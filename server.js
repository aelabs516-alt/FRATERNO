const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de base de datos
// Usa DATABASE_URL si está disponible, de lo contrario las variables de entorno, o por defecto la BD interna de easypanel
const pool = new Pool({
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:db2025**@n8n_db_postgres:5432/db_elefante?sslmode=disable'
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '.'))); // Sirve los archivos estáticos desde este directorio

// Inicializar tabla en la BD si no existe
const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS app_state (
                id SERIAL PRIMARY KEY,
                data JSONB NOT NULL,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        
        // Insertar registro por defecto si está vacío
        const res = await pool.query('SELECT COUNT(*) FROM app_state');
        if (parseInt(res.rows[0].count) === 0) {
            await pool.query('INSERT INTO app_state (id, data) VALUES (1, $1)', ['{}']);
        }
        console.log('Database initialized successfully');
    } catch (err) {
        console.error('Failed to initialize database:', err.message);
    }
};

initDB();

// API Endpoints para manejar el estado de la aplicación

// Obtener estado (reemplaza a loadAppData)
app.get('/api/state', async (req, res) => {
    try {
        const result = await pool.query('SELECT data FROM app_state WHERE id = 1');
        if (result.rows.length > 0) {
            res.json(result.rows[0].data);
        } else {
            res.json({});
        }
    } catch (err) {
        console.error('Error fetching state:', err);
        res.status(500).json({ error: 'Failed to fetch state' });
    }
});

// Guardar estado (reemplaza a saveAppData)
app.post('/api/state', async (req, res) => {
    try {
        const newData = req.body;
        await pool.query(
            'UPDATE app_state SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
            [newData]
        );
        res.json({ success: true, message: 'State updated successfully' });
    } catch (err) {
        console.error('Error saving state:', err);
        res.status(500).json({ error: 'Failed to save state' });
    }
});

// Redirigir todas las demás peticiones al index.html (soporte SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
