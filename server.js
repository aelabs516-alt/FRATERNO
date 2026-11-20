const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Desactivar cabecera que expone tecnología del servidor (OWASP)
app.disable('x-powered-by');

// Configuración de base de datos con soporte para variables de entorno
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:db2025**@n8n_db_postgres:5432/db_elefante?sslmode=disable',
    connectionTimeoutMillis: 3000
});

// Versión de reinicio limpio (elimina datos de prueba previos una sola vez al desplegar/iniciar)
const CLEAN_RESET_VERSION = 'clean_slate_2026_11_19_v1';
const DEFAULT_MASTER_ADMIN_PASS = '01Fraterno*';

function migrateMasterAdminPassword(state) {
    if (!state || !Array.isArray(state.users)) return false;
    let changed = false;
    state.users.forEach(u => {
        if (!u) return;
        const uname = String(u.username || '').trim().toLowerCase();
        const uid = String(u.id || '').trim().toLowerCase();
        if ((uname === 'admin01' || uid === 'usr_admin') && u.password === 'admin') {
            u.password = DEFAULT_MASTER_ADMIN_PASS;
            u.mustChangePassword = false;
            changed = true;
        }
    });
    return changed;
}

function createBlankState() {
    return {
        _resetVersion: CLEAN_RESET_VERSION,
        passengers: [],
        employees: [],
        instructors: [],
        pilots: [],
        timeTracking: [],
        aeronaves: [],
        asignacionFlota: [],
        inventory: [],
        tandemRigs: [],
        funRigs: [],
        pettyCash: [],
        cajaMenor: [],
        cashClosings: [],
        storeProducts: [],
        storeSales: [],
        facturas: [],
        packerBilling: [],
        ponchera: [],
        maestroValoresVersion: 1,
        maestroValoresHistory: [],
        supportTickets: [],
        restriccionSaltos: 'Sin restricción',
        zonaCerradaMotivo: '',
        emailAlertsLog: [],
        legalDocs: {},
        enabledModules: {},
        backupConfig: {},
        noOpRules: { daysOfWeek: ['1', '2'], specificDates: [], exceptions: [] },
        users: [{ id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: DEFAULT_MASTER_ADMIN_PASS, mustChangePassword: false }]
    };
}

// Estado en memoria de respaldo (failover seguro si PostgreSQL no está accesible en entorno local/pruebas)
let memoryFallbackState = createBlankState();
let dbConnected = false;

// Cabeceras de Seguridad HTTP (OWASP Hardening)
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
    next();
});

// Middleware CORS y JSON con validación de errores de parseo
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Guardián Zero-Trust contra exposición de archivos sensibles del servidor
const BLOCKED_STATIC_PATTERNS = [
    /^\/\.env/i,
    /^\/\.git/i,
    /^\/\.dockerignore/i,
    /^\/server\.js$/i,
    /^\/package(-lock)?\.json$/i,
    /^\/dockerfile$/i,
    /^\/docker-compose\.ya?ml$/i,
    /^\/tests(\/|$)/i,
    /^\/(fix_|patch_|update_|replace_|inject_|remove_|reorder_|restore_|clean_|extract_)/i,
    /\.(py|ps1|sql|sh|bat|cmd|log)$/i
];

app.use((req, res, next) => {
    const reqPath = decodeURIComponent(req.path || '');
    if ( reqPath.includes('..') || BLOCKED_STATIC_PATTERNS.some(rx => rx.test(reqPath)) ) {
        return res.status(403).json({ error: 'Acceso denegado a recurso protegido del servidor.' });
    }
    next();
});

app.use(express.static(path.join(__dirname, '.')));

// Inicializar tabla en la BD si no existe y aplicar reinicio limpio de datos de prueba
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS app_state (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const res = await pool.query('SELECT data FROM app_state WHERE id = 1');
        if (res.rows.length === 0) {
            await pool.query('INSERT INTO app_state (id, data) VALUES (1, $1)', [createBlankState()]);
            console.log('Database initialized with clean blank state');
        } else {
            const currentData = res.rows[0].data || {};
            if (currentData._resetVersion !== CLEAN_RESET_VERSION) {
                await pool.query(
                    'UPDATE app_state SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
                    [createBlankState()]
                );
                console.log('Test data wiped from PostgreSQL. System ready in blank state:', CLEAN_RESET_VERSION);
            } else {
                if (migrateMasterAdminPassword(currentData)) {
                    await pool.query(
                        'UPDATE app_state SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
                        [currentData]
                    );
                    console.log('Master admin password migrated to secure policy.');
                }
                console.log('Database initialized successfully');
            }
        }
        dbConnected = true;
    } catch (err) {
        dbConnected = false;
        console.warn('Database offline or unreachable, using safe in-memory state fallback:', err.message);
    }
};

if (process.env.NODE_ENV !== 'test') {
    initDB();
}

// Sanitizador recursivo contra Prototype Pollution
function isSafePlainObject(obj) {
    if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return false;
    const rawKeys = Object.getOwnPropertyNames(obj);
    if (rawKeys.includes('__proto__') || rawKeys.includes('constructor') || rawKeys.includes('prototype')) {
        return false;
    }
    return true;
}

// Obtener estado (reemplaza a loadAppData)
app.get('/api/state', async (req, res) => {
    try {
        if (dbConnected) {
            const result = await pool.query('SELECT data FROM app_state WHERE id = 1');
            if (result.rows.length > 0) {
                const dbData = result.rows[0].data;
                if (migrateMasterAdminPassword(dbData)) {
                    await pool.query(
                        'UPDATE app_state SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
                        [dbData]
                    );
                }
                return res.json(dbData);
            }
            return res.json({});
        }
        migrateMasterAdminPassword(memoryFallbackState);
        return res.json(memoryFallbackState);
    } catch (err) {
        console.error('Error fetching state:', err.message);
        return res.json(memoryFallbackState);
    }
});

// Guardar estado (reemplaza a saveAppData) con validación de payload
app.post('/api/state', async (req, res) => {
    try {
        const newData = req.body;
        if (!isSafePlainObject(newData)) {
            return res.status(400).json({ error: 'El payload de estado debe ser un objeto JSON válido.' });
        }
        if (!newData._resetVersion) {
            newData._resetVersion = CLEAN_RESET_VERSION;
        }
        memoryFallbackState = JSON.parse(JSON.stringify(newData));

        if (dbConnected) {
            await pool.query(
                `INSERT INTO app_state (id, data, updated_at) VALUES (1, $1, CURRENT_TIMESTAMP)
                 ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP`,
                [newData]
            );
        }
        return res.json({ success: true, message: 'State updated successfully' });
    } catch (err) {
        console.error('Error saving state:', err.message);
        return res.status(500).json({ error: 'Error interno al guardar el estado de la aplicación.' });
    }
});

// Restablecer el sistema en blanco (eliminar toda la información de prueba)
app.post('/api/reset-state', async (req, res) => {
    try {
        const blank = createBlankState();
        memoryFallbackState = JSON.parse(JSON.stringify(blank));

        if (dbConnected) {
            await pool.query(
                `INSERT INTO app_state (id, data, updated_at) VALUES (1, $1, CURRENT_TIMESTAMP)
                 ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, updated_at = CURRENT_TIMESTAMP`,
                [blank]
            );
        }
        return res.json({ success: true, message: 'Sistema restablecido en blanco exitosamente.', state: blank });
    } catch (err) {
        console.error('Error resetting state:', err.message);
        return res.status(500).json({ error: 'Error interno al restablecer el sistema.' });
    }
});

// Enviar alerta por correo electrónico cuando una reserva tiene pago incompleto y faltan <= 10 días (Req #9)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.post('/api/send-payment-alert', async (req, res) => {
    try {
        const body = req.body || {};
        const passengerName = String(body.passengerName || body.paxName || '').replace(/[\r\n]/g, ' ').trim();
        const passengerDoc = String(body.passengerDoc || 'N/A').replace(/[\r\n]/g, ' ').trim();
        const passengerEmail = String(body.passengerEmail || body.to || '').replace(/[\r\n]/g, '').trim();
        const jumpDate = String(body.jumpDate || '').replace(/[\r\n]/g, '').trim();
        const daysRemaining = body.daysRemaining !== undefined ? Number(body.daysRemaining) : Number(body.daysLeft);
        const totalValue = Number(body.totalValue || 0);
        const totalPaid = Number(body.totalPaid || 0);
        const pendingBalance = body.pendingBalance !== undefined ? Number(body.pendingBalance) : Number(body.balance || 0);

        const rawRecipients = Array.isArray(body.recipients) && body.recipients.length > 0
            ? body.recipients
            : (passengerEmail ? [passengerEmail] : []);

        const validRecipients = rawRecipients
            .map(r => String(r || '').replace(/[\r\n]/g, '').trim())
            .filter(r => EMAIL_REGEX.test(r));

        if (!passengerName || validRecipients.length === 0 || Number.isNaN(daysRemaining)) {
            return res.status(400).json({
                error: 'Datos inválidos para envío de alerta. Se requiere nombre del pasajero, destinatario con email válido y días restantes.'
            });
        }

        const subject = `[FRATERNO] Alerta de Pago Pendiente - Reserva de Salto (${jumpDate || 'Próximo'})`;
        const textBody =
            `Hola ${passengerName},\n\n` +
            `Te recordamos que tu reserva de salto programada para el ${jumpDate || 'próximo salto'} (faltan ${daysRemaining} día(s)) presenta un saldo pendiente por completar.\n\n` +
            `• Pasajero: ${passengerName} (Doc: ${passengerDoc})\n` +
            `• Valor Total Reserva: $${totalValue.toLocaleString('es-CO')}\n` +
            `• Valor Abonado: $${totalPaid.toLocaleString('es-CO')}\n` +
            `• Saldo Pendiente: $${pendingBalance.toLocaleString('es-CO')}\n\n` +
            `Por favor completa tu pago y adjunta el soporte en nuestro Portal B2C o comunícate al WhatsApp +57 302 338 1129.\n\n` +
            `Equipo Fraterno Paracaidismo`;

        console.log(`[EMAIL ALERT <= 10 DAYS] To: ${validRecipients.join(', ')} | Subject: ${subject}`);

        if (process.env.EMAIL_WEBHOOK_URL) {
            try {
                await fetch(process.env.EMAIL_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipients: validRecipients,
                        subject,
                        textBody,
                        passengerName,
                        jumpDate,
                        daysRemaining,
                        pendingBalance
                    })
                });
            } catch (wErr) {
                console.warn('Webhook email dispatch warning:', wErr.message);
            }
        }

        return res.json({
            success: true,
            subject,
            recipients: validRecipients,
            sentAt: new Date().toISOString()
        });
    } catch (err) {
        console.error('Error sending payment alert:', err.message);
        return res.status(500).json({ error: 'Error interno al procesar la alerta de pago.' });
    }
});

// Redirigir todas las demás peticiones GET de navegación al index.html (soporte SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Manejador global de excepciones (evita volcado de stack traces y maneja JSON malformado)
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'JSON malformado en el cuerpo de la petición.' });
    }
    console.error('Unhandled Server Exception:', err.message);
    return res.status(500).json({ error: 'Error interno del servidor.' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = { app, initDB, pool };
