/**
 * app.js
 * Motor de enrutamiento principal (Single Page Application)
 */

window.saveToLocalStorageSafe = function(dataObj) {
    try {
        localStorage.setItem('fraterno_app_data', JSON.stringify(dataObj));
        return true;
    } catch (storageErr) {
        console.warn('localStorage quota exceeded, saving compact local cache while keeping full state in memory/PostgreSQL:', storageErr.message);
        try {
            // Limpiar copias de respaldo viejas si existen para liberar espacio
            if (typeof localStorage.length === 'number' && typeof localStorage.key === 'function') {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith('fraterno_app_data_corrupted_backup_')) {
                        keysToRemove.push(k);
                    }
                }
                keysToRemove.forEach(k => localStorage.removeItem(k));
            }
            // Crear copia ligera para caché local (sin archivos multimedia pesados que ya viajan a PostgreSQL)
            const compact = JSON.parse(JSON.stringify(dataObj));
            if (Array.isArray(compact.passengers)) {
                compact.passengers = compact.passengers.map(p => {
                    const cp = { ...p };
                    delete cp.signedLegalDocs;
                    delete cp.soportePago;
                    if (cp.selfie && cp.selfie.length > 40000) cp.selfie = null;
                    if (cp.paymentSupport && cp.paymentSupport.dataUrl && cp.paymentSupport.dataUrl.length > 80000) {
                        cp.paymentSupport = { ...cp.paymentSupport, dataUrl: '' };
                    }
                    return cp;
                });
            }
            if (Array.isArray(compact.supportTickets)) {
                compact.supportTickets = compact.supportTickets.map(t => {
                    const ct = { ...t };
                    if (ct.imageDataUrl && ct.imageDataUrl.length > 60000) ct.imageDataUrl = '';
                    return ct;
                });
            }
            if (compact.legalDocs) {
                compact.legalDocs = {};
            }
            localStorage.setItem('fraterno_app_data', JSON.stringify(compact));
            return true;
        } catch (compactErr) {
            console.warn('Compact localStorage cache also exceeded quota, continuing with PostgreSQL backend only:', compactErr.message);
            return false;
        }
    }
};

window.saveAppData = function() {
    window.saveToLocalStorageSafe(window.AppData);

    // Sync full state (including selfies, signatures & payment supports up to 50MB) with backend PostgreSQL API
    return fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(window.AppData)
    }).catch(err => console.error('Failed to sync state to server:', err));
};

// Global Money Formatter
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('money-input')) {
        let val = e.target.value.replace(/\D/g, '');
        if (val) {
            e.target.value = parseInt(val, 10).toLocaleString('es-CO');
        } else {
            e.target.value = '';
        }
    }
});

const CLEAN_RESET_VERSION = 'clean_slate_2026_11_19_v1';
const DEFAULT_MASTER_ADMIN_PASS = '01Fraterno*';

window.migrateMasterAdminPassword = function(state) {
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
};

window.createBlankAppData = function() {
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
};

window.resetSystemToBlank = async function() {
    const clean = window.createBlankAppData();
    window.AppData = clean;
    try {
        localStorage.removeItem('fraterno_app_data');
        localStorage.removeItem('factura_seq');
        localStorage.removeItem('fraterno_wiped_transactional_v2');
        localStorage.setItem('fraterno_app_data', JSON.stringify(clean));
        localStorage.setItem('factura_seq', '1');
    } catch (e) {}

    try {
        await fetch('/api/reset-state', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ confirm: true })
        });
    } catch (err) {
        console.warn('Reset API offline, local state wiped:', err);
    }
    return clean;
};

function loadAppData() {
    const saved = localStorage.getItem('fraterno_app_data');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            // Si los datos en localStorage son anteriores al reinicio limpio, eliminar toda la información de prueba
            if (data._resetVersion !== CLEAN_RESET_VERSION) {
                const blank = window.createBlankAppData();
                localStorage.setItem('fraterno_app_data', JSON.stringify(blank));
                localStorage.setItem('factura_seq', '1');
                localStorage.removeItem('fraterno_wiped_transactional_v2');
                return blank;
            }

            // Asegurar estructuras base
            data.noOpRules = data.noOpRules || { daysOfWeek: ['1', '2'], specificDates: [], exceptions: [] };
            data.users = (Array.isArray(data.users) && data.users.length > 0)
                ? data.users
                : [{ id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: DEFAULT_MASTER_ADMIN_PASS, mustChangePassword: false }];
            const pwdMigrated = window.migrateMasterAdminPassword(data);
            data.passengers = data.passengers || [];
            data.employees = data.employees || [];
            data.aeronaves = data.aeronaves || [];
            data.asignacionFlota = data.asignacionFlota || [];
            data.storeProducts = data.storeProducts || [];
            data.storeSales = data.storeSales || [];
            data.ponchera = data.ponchera || [];
            data.maestroValoresVersion = data.maestroValoresVersion || 1;
            data.maestroValoresHistory = data.maestroValoresHistory || [];
            data.supportTickets = data.supportTickets || [];
            data.restriccionSaltos = data.restriccionSaltos || 'Sin restricción';
            data.emailAlertsLog = data.emailAlertsLog || [];

            if (pwdMigrated) {
                try { localStorage.setItem('fraterno_app_data', JSON.stringify(data)); } catch (e) {}
            }
            return data;
        } catch(e) {
            console.error("Critical: Failed to parse fraterno_app_data, resetting to blank state.", e);
        }
    }
    const blank = window.createBlankAppData();
    localStorage.setItem('fraterno_app_data', JSON.stringify(blank));
    localStorage.setItem('factura_seq', '1');
    return blank;
}
window.AppData = loadAppData();
if (window.TariffGuard) {
    window.TariffGuard.ensureVersionMetadata();
}

// Migration for old date formats DD/MM/YYYY to YYYY-MM-DD
if (window.AppData.passengers && window.AppData.passengers.length > 0) {
    let migrated = false;
    window.AppData.passengers.forEach(p => {
        if (p.date && p.date.includes('/')) {
            const parts = p.date.split('/');
            if (parts.length === 3) {
                p.date = `${parts[2]}-${parts[1]}-${parts[0]}`;
                migrated = true;
            }
        }
    });
    if (migrated) window.saveAppData();
}

// One-time migration for employees
window.AppData.employees = window.AppData.employees || [];
if (window.AppData.instructors && window.AppData.instructors.length > 0) {
    window.AppData.instructors.forEach(inst => {
        if (!window.AppData.employees.find(e => e.id === inst.id || e.name === inst.name)) {
            window.AppData.employees.push({
                id: inst.id || 'emp_' + Date.now() + Math.random(),
                name: inst.name,
                role: 'Instructor',
                doc: inst.doc || '',
                hasCam: inst.hasCam || false
            });
        }
    });
    // Clear legacy array so it doesn't migrate again
    window.AppData.instructors = [];
    window.saveAppData();
}
if (window.AppData.pilots && window.AppData.pilots.length > 0) {
    window.AppData.pilots.forEach(pil => {
        if (!window.AppData.employees.find(e => e.id === pil.id || (e.name === pil.nombre + ' ' + pil.apellido))) {
            window.AppData.employees.push({
                id: pil.id || 'emp_' + Date.now() + Math.random(),
                name: (pil.nombre + ' ' + pil.apellido).trim(),
                role: 'Piloto',
                doc: pil.doc || '',
                licencia: pil.licencia || ''
            });
        }
    });
    window.AppData.pilots = [];
    window.saveAppData();
}

// Evitar sobrescribir PostgreSQL en beforeunload desde pestañas no autenticadas o sin sincronizar
window.addEventListener('beforeunload', () => {
    if (sessionStorage.getItem('fraterno_user')) {
        window.saveToLocalStorageSafe(window.AppData);
    }
});

const routes = {
    '/login': window.Modules.login,
    '/': window.Modules.home,
    '/dashboard': window.Modules.dashboard,
    '/reservas': window.Modules.booking,
    '/registro-salto': window.Modules.reservations,
    '/b2c': window.Modules.b2c,
    '/checkin': window.Modules.checkin,
    '/manifiesto': window.Modules.manifest,
    '/facturacion': window.Modules.billing,
    '/configuracion': window.Modules.settings,
    '/historial': window.Modules.historySearch,
    '/tienda': window.Modules.store,
    '/generar-factura': window.Modules.invoicing,

    '/autogestion': window.Modules.autogestion,
    '/flota': window.Modules.fleet,

    '/rrhh': window.Modules.hrms,
    '/inventario': window.Modules.inventory,
    '/asignacion': window.Modules.assignment,
    '/caja': window.Modules.finance,
    '/fids': window.Modules.fids,
    '/videografia': window.Modules.media
};

// ==========================================
// Device Identification (Desktop / Tablet / Mobile)
// ==========================================
window.detectDevice = function detectDevice() {
    const width = window.innerWidth || (document.documentElement && document.documentElement.clientWidth) || 1280;
    const height = window.innerHeight || (document.documentElement && document.documentElement.clientHeight) || 800;
    const ua = (typeof navigator !== 'undefined' && navigator.userAgent) ? navigator.userAgent : '';
    const platform = (typeof navigator !== 'undefined' && navigator.platform) ? navigator.platform : '';
    const maxTouch = (typeof navigator !== 'undefined' && navigator.maxTouchPoints) ? navigator.maxTouchPoints : 0;

    const isIPadOS = platform === 'MacIntel' && maxTouch > 1;
    const isTabletUA = /iPad|Tablet|PlayBook|Silk|Kindle/i.test(ua) || (/Android/i.test(ua) && !/Mobile/i.test(ua)) || isIPadOS;
    const isPhoneUA = /iPhone|iPod|Windows Phone|BlackBerry|IEMobile|Opera Mini/i.test(ua) || (/Android/i.test(ua) && /Mobile/i.test(ua));

    let deviceType = 'desktop';
    if (width <= 767 || (isPhoneUA && Math.min(width, height) <= 500 && width < 920)) {
        deviceType = 'mobile';
    } else if ((width >= 768 && width <= 1024) || (isTabletUA && width <= 1366)) {
        deviceType = 'tablet';
    } else {
        deviceType = 'desktop';
    }

    const orientation = width >= height ? 'landscape' : 'portrait';
    const info = {
        type: deviceType,
        isMobile: deviceType === 'mobile',
        isTablet: deviceType === 'tablet',
        isDesktop: deviceType === 'desktop',
        orientation,
        width,
        height
    };

    window.DeviceInfo = info;
    window.isMobileDevice = info.isMobile;
    window.isTabletDevice = info.isTablet;
    window.isDesktopDevice = info.isDesktop;

    const targets = [document.documentElement, document.body].filter(Boolean);
    targets.forEach(el => {
        if (el.classList) {
            el.classList.remove('device-mobile', 'device-tablet', 'device-desktop', 'orientation-portrait', 'orientation-landscape');
            el.classList.add(`device-${deviceType}`, `orientation-${orientation}`);
        }
        if (typeof el.setAttribute === 'function') {
            el.setAttribute('data-device', deviceType);
            el.setAttribute('data-orientation', orientation);
        }
    });

    // Al regresar a escritorio, cerrar cajón lateral si estaba abierto
    if (info.isDesktop) {
        const sb = document.getElementById('sidebar');
        const bd = document.getElementById('sidebar-backdrop');
        if (sb && sb.classList) sb.classList.remove('open');
        if (bd && bd.classList) bd.classList.remove('open');
    }

    return info;
};

// ==========================================
// Responsive Layout Enhancer (solo aplica en tablet/mobile vía CSS)
// ==========================================
window.applyResponsiveLayout = function applyResponsiveLayout(root) {
    const container = root || document.getElementById('app-view');
    if (!container || typeof container.querySelectorAll !== 'function') return;

    // 1. Asegurar scroll horizontal limpio en cualquier tabla que no esté envuelta
    const tables = container.querySelectorAll('table');
    tables.forEach(tbl => {
        const parent = tbl.parentElement;
        if (!parent) return;
        const pStyle = (parent.getAttribute && parent.getAttribute('style')) || '';
        const alreadyScrollable =
            (parent.classList && (parent.classList.contains('table-responsive') || parent.classList.contains('resp-table-scroll') || parent.classList.contains('fids-table-wrap'))) ||
            /overflow-x\s*:\s*auto/i.test(pStyle);
        if (!alreadyScrollable) {
            if (typeof document.createElement === 'function' && typeof parent.replaceChild === 'function') {
                const wrap = document.createElement('div');
                wrap.classList.add('resp-table-scroll');
                parent.replaceChild(wrap, tbl);
                wrap.appendChild(tbl);
            } else if (parent.classList) {
                parent.classList.add('resp-table-scroll');
            }
        }
    });

    // 2. Clasificar grids y bloques con estilos inline para adaptación segura en tablet y celular
    const allDivs = container.querySelectorAll('div');
    allDivs.forEach(el => {
        const st = (el.getAttribute && el.getAttribute('style')) || '';
        if (!st || !el.classList) return;

        if (/grid-template-columns\s*:/i.test(st)) {
            if (el.id === 'gantt-header' || (el.parentElement && el.parentElement.id === 'gantt-body')) {
                return; // El Gantt maneja su propio scroll horizontal fluido
            }
            if (/repeat\(\s*7/i.test(st)) {
                el.classList.add('resp-calendar-grid');
            } else if (/100px\s+1fr/i.test(st)) {
                el.classList.add('resp-kv-grid');
            } else if (/minmax\(\s*(?:3\d\d|4\d\d)px/i.test(st)) {
                el.classList.add('resp-auto-grid-wide');
            } else if (/minmax\(\s*2\d\dpx/i.test(st)) {
                el.classList.add('resp-auto-grid-med');
            } else if (/repeat\(\s*4/i.test(st)) {
                el.classList.add('resp-grid-4');
            } else if (/1fr\s+1fr\s+1fr|1fr\s+2fr\s+auto|1fr\s+1fr\s+auto/i.test(st)) {
                el.classList.add('resp-grid-3');
            } else if (/2fr\s+1fr|1fr\s+1fr|repeat\(\s*2/i.test(st)) {
                el.classList.add('resp-grid-2');
            }
        }

        if (/min-width\s*:\s*(?:2[6-9]\d|3\d\d|4\d\d)px/i.test(st) && el.id !== 'gantt-header' && !el.classList.contains('kanban-col')) {
            el.classList.add('resp-fluid-min');
        }
    });

    // 3. Inputs y selects con ancho fijo amplio en escritorio -> fluidos en móvil
    const controls = container.querySelectorAll('input, select');
    controls.forEach(ctrl => {
        const st = (ctrl.getAttribute && ctrl.getAttribute('style')) || '';
        if (/width\s*:\s*(?:1[89]\d|2\d\d|3\d\d|4\d\d)px/i.test(st) && ctrl.classList) {
            ctrl.classList.add('resp-fluid-control');
        }
    });
};

// ==========================================
// Theme Engine (Modo Claro / Modo Oscuro sincronizado)
// ==========================================
window.applyTheme = function applyTheme(theme, persist = true) {
    const isDark = theme === 'dark';
    const mode = isDark ? 'dark' : 'light';
    const targets = [document.documentElement, document.body].filter(Boolean);
    targets.forEach(el => {
        if (el.classList) {
            el.classList.remove('light-mode', 'dark-mode');
            el.classList.add(isDark ? 'dark-mode' : 'light-mode');
        }
        if (typeof el.setAttribute === 'function') {
            el.setAttribute('data-theme', mode);
        }
    });

    const themeSwitch = document.getElementById('checkbox-theme');
    if (themeSwitch) themeSwitch.checked = isDark;

    document.querySelectorAll('.logo img, .login-logo img').forEach(img => {
        img.src = isDark ? 'img/logo_dark.png' : 'img/logo.png';
    });

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme && typeof metaTheme.setAttribute === 'function') {
        metaTheme.setAttribute('content', isDark ? '#060d17' : '#0c2331');
    }

    if (persist) {
        try { localStorage.setItem('fraterno_theme', mode); } catch (e) {}
    }

    if (window.Modules && window.Modules.dashboard && window.location.hash === '#/dashboard') {
        const container = document.getElementById('app-view');
        if (container) window.Modules.dashboard.render(container);
    }

    return mode;
};

try {
    const initialTheme = localStorage.getItem('fraterno_theme') === 'dark' ? 'dark' : 'light';
    window.applyTheme(initialTheme, false);
} catch (e) {}

window.detectDevice();
window.addEventListener('resize', window.detectDevice);
window.addEventListener('orientationchange', window.detectDevice);

// ==========================================
// Router Engine & Auth
// ==========================================
function router() {
    try {
        let hash = window.location.hash.slice(1) || '/';
        hash = hash.split('?')[0];
    
    // Auth Check & Sidebar Update
    const currentUserStr = sessionStorage.getItem('fraterno_user');
    const currentRole = sessionStorage.getItem('fraterno_role');
    
    if (currentUserStr) {
        try {
            const user = JSON.parse(currentUserStr);
            const profileDiv = document.getElementById('sidebar-user-profile');
            if (profileDiv) {
                const h4 = profileDiv.querySelector('h4');
                const roleSpan = profileDiv.querySelector('.role');
                const avatarImg = profileDiv.querySelector('.avatar img');
                if (h4) h4.innerText = user.name;
                if (roleSpan) roleSpan.innerText = '[' + user.role + ']';
                if (avatarImg) avatarImg.src = user.photo || 'https://i.pravatar.cc/150?img=11';
            }
        } catch(e) {}
    }

    if (!currentUserStr && hash !== '/b2c' && hash !== '/autogestion') {
        hash = '/login';
        window.location.hash = '#/login';
    } else if (currentRole && hash === '/login') {
        // Already logged in, prevent accessing login
        hash = currentRole === 'admin' ? '/' : '/registro-salto';
        window.location.hash = '#' + hash;
    }

    // Validate route, default to appropriate dashboard
    if (!routes[hash]) {
        hash = currentRole === 'admin' ? '/' : '/registro-salto';
        window.location.hash = '#' + hash;
    }
    
    // Update active state on sidebar & Handle Permissions Visually
    const enabledModules = window.AppData.enabledModules || {};
    
    // Map of routes to module keys for toggle
    const moduleMap = {
        '/inventario': 'inventory',
        '/rrhh': 'hrms',
        '/caja': 'finance',
        '/manifiesto': 'manifest',
        '/checkin': 'checkin',
        '/flota': 'fleet',
        '/reservas': 'booking',
        '/fids': 'fids',
        '/videografia': 'media',
        '/facturacion': 'billing',
        '/historial': 'historySearch',
        '/tienda': 'store',
        '/generar-factura': 'invoicing'
    };

    // Check if the requested module is disabled
    const reqModKey = moduleMap[hash];
    if (reqModKey && enabledModules[reqModKey] === false) {
        alert('Este módulo ha sido deshabilitado por el administrador.');
        hash = currentRole === 'admin' ? '/' : '/registro-salto';
        window.location.hash = '#' + hash;
        return; // Stop execution and wait for hashchange
    }

    // Control de acceso basado en roles (RBAC - OWASP A01 Broken Access Control)
    if (currentRole && currentRole !== 'admin' && hash !== '/b2c' && hash !== '/autogestion' && hash !== '/login') {
        const restrictedForVentas = ['/', '/dashboard', '/facturacion', '/configuracion'];
        if (currentRole === 'ventas' && restrictedForVentas.includes(hash)) {
            alert('Acceso denegado: Su rol no tiene permisos para acceder a este módulo.');
            hash = '/registro-salto';
            window.location.hash = '#/registro-salto';
            return;
        }
    }

    const appView = document.getElementById('app-view');
    if (!appView) {
        console.error("Critical: #app-view not found.");
        return;
    }
    appView.innerHTML = '';

    // Update active state on sidebar & Handle Permissions Visually
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        item.style.display = 'flex'; // show all by default
        
        const r = item.getAttribute('data-route');
        
        // Hide if module is disabled globally
        const modKey = moduleMap[r];
        if (modKey && enabledModules[modKey] === false) {
            item.style.display = 'none';
        }

        // Hide certain modules if ventas
        if (currentRole === 'ventas') {
            if (r === '/' || r === '/facturacion' || r === '/configuracion') {
                item.style.display = 'none';
            }
        }

        if (item.getAttribute('data-route') === hash) {
            item.classList.add('active');
        }
    });

    const header = document.getElementById('main-header');
    const sidebar = document.getElementById('sidebar');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');
    const appContainer = document.getElementById('app-wrapper');
    const mainContent = document.querySelector('.main-content');

    const isFullscreenModule = hash === '/login' || hash === '/b2c' || hash === '/autogestion';
    if (document.body && document.body.classList) {
        document.body.classList.toggle('fullscreen-route', isFullscreenModule);
        document.body.classList.toggle('fids-route', hash === '/fids');
    }

    // Cerrar menú lateral móvil/tablet al cambiar de módulo
    if (sidebar && sidebar.classList && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
    }
    if (sidebarBackdrop && sidebarBackdrop.classList && sidebarBackdrop.classList.contains('open')) {
        sidebarBackdrop.classList.remove('open');
    }

    if (header) header.style.display = isFullscreenModule ? 'none' : '';
    if (sidebar) sidebar.style.display = isFullscreenModule ? 'none' : '';
    if (appContainer) {
        appContainer.style.marginTop = isFullscreenModule ? '0' : '';
        appContainer.style.height = isFullscreenModule ? '100vh' : '';
    }
    if (mainContent) {
        mainContent.style.padding = isFullscreenModule ? '0' : '';
        mainContent.style.marginLeft = '';
        mainContent.style.marginTop = '';
        mainContent.style.height = '';
        mainContent.style.backgroundColor = '';
    }
    
    // Render the module securely
    if (routes[hash] && typeof routes[hash].render === 'function') {
        try {
            routes[hash].render(appView);
            if (typeof routes[hash].init === 'function') {
                routes[hash].init();
            }
            if (typeof window.applyResponsiveLayout === 'function') {
                window.applyResponsiveLayout(appView);
            }
            let blockedByFirstLogin = false;
            if (window.PasswordManager) {
                window.PasswordManager.init();
                if (!isFullscreenModule && hash !== '/fids' && currentUserStr) {
                    blockedByFirstLogin = window.PasswordManager.checkMandatoryPasswordChange();
                }
            }
            if (window.SupportSystem) {
                window.SupportSystem.init();
                window.SupportSystem.updateSupportBadge();
                if (!blockedByFirstLogin && !isFullscreenModule && hash !== '/fids' && currentUserStr) {
                    if (sessionStorage.getItem('fraterno_check_support_notifs') === '1') {
                        sessionStorage.removeItem('fraterno_check_support_notifs');
                        window.SupportSystem.checkAndNotifyResolvedTickets();
                    }
                }
            }
        } catch (err) {
            console.error("Module Render Error:", err);
            const safeMsg = window.escapeHTML ? window.escapeHTML(err.message || 'Error interno') : 'Error interno';
            appView.innerHTML = `<div style="padding:2rem;color:red;text-align:center;">
                <h3>Error Crítico de Renderizado</h3>
                <p>El módulo no pudo cargar correctamente debido a un error interno.</p>
                <code>${safeMsg}</code>
            </div>`;
        }
    } else {
        console.error("Module definition is missing render method:", hash);
    }
    } catch (criticalErr) {
        console.error("Critical Router Error:", criticalErr);
        const appView = document.getElementById('app-view');
        if (appView) {
            const safeCrit = window.escapeHTML ? window.escapeHTML(criticalErr.message || 'Error de navegación') : 'Error de navegación';
            appView.innerHTML = `<div style="padding:2rem;color:red;text-align:center;">
                <h3>Error Crítico del Sistema</h3>
                <p>El sistema encontró un error al intentar navegar.</p>
                <code>${safeCrit}</code>
            </div>`;
        }
    }
}
window.router = router;

// Listen to hash changes
window.addEventListener('hashchange', router);

// Sincronización con PostgreSQL sin caché (reutilizable desde login y arranque)
let _activeStateSyncPromise = null;
window.syncStateFromServer = function() {
    if (_activeStateSyncPromise) return _activeStateSyncPromise;
    _activeStateSyncPromise = (async () => {
        try {
            const res = await fetch('/api/state', {
                cache: 'no-store',
                headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
            });
            if (res.ok) {
                const data = await res.json();
                if (data && data._resetVersion === CLEAN_RESET_VERSION) {
                    const pwdMigrated = window.migrateMasterAdminPassword(data);
                    window.AppData = data;
                    window.AppData.users = (Array.isArray(data.users) && data.users.length > 0)
                        ? data.users
                        : [{ id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: DEFAULT_MASTER_ADMIN_PASS, mustChangePassword: false }];
                    window.AppData.supportTickets = window.AppData.supportTickets || [];
                    if (window.TariffGuard) window.TariffGuard.ensureVersionMetadata();
                    window.saveToLocalStorageSafe(window.AppData);
                    if (pwdMigrated) window.saveAppData();
                    return true;
                } else {
                    // El servidor aún tenía datos de prueba o estado vacío previo: sincronizar el estado limpio
                    const blank = window.createBlankAppData();
                    window.AppData = blank;
                    window.saveToLocalStorageSafe(blank);
                    try { localStorage.setItem('factura_seq', '1'); } catch (e) {}
                    window.saveAppData();
                    return true;
                }
            }
        } catch (e) {
            console.log('Running in local mode or API offline');
        } finally {
            _activeStateSyncPromise = null;
        }
        return false;
    })();
    return _activeStateSyncPromise;
};

// Iniciar hidratación temprana sin esperar imágenes externas
document.addEventListener('DOMContentLoaded', () => {
    window.syncStateFromServer();
});

// On load
window.addEventListener('load', async () => {
    await window.syncStateFromServer();
    // Force re-render if user clicks the sidebar link of the module they are already in
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const href = item.getAttribute('href');
            if (window.location.hash === href) {
                e.preventDefault();
                router();
            }
        });
    });

    // Dark Mode Toggle Logic
    const themeSwitch = document.getElementById('checkbox-theme');
    const savedTheme = localStorage.getItem('fraterno_theme') === 'dark' ? 'dark' : 'light';
    window.applyTheme(savedTheme, false);

    if (themeSwitch) {
        themeSwitch.addEventListener('change', (e) => {
            window.applyTheme(e.target.checked ? 'dark' : 'light', true);
        });
    }

    // Handle logout
    const logoutBtn = document.querySelector('.btn-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('fraterno_user'); sessionStorage.removeItem('fraterno_role');
            window.location.hash = '#/login';
        });
    }

    if (typeof window.detectDevice === 'function') {
        window.detectDevice();
    }

    // Inactivity Timeout (15 minutes) - Optimized approach
    let lastActivityTime = Date.now();
    const INACTIVITY_LIMIT_MS = 15 * 60 * 1000;
    
    const updateActivityTime = () => {
        lastActivityTime = Date.now();
    };
    
    // Check inactivity periodically instead of setting a new timer on every mouse move
    setInterval(() => {
        const currentUserStr = sessionStorage.getItem('fraterno_user');
        if (currentUserStr && (Date.now() - lastActivityTime > INACTIVITY_LIMIT_MS)) {
            alert('Tu sesión ha expirado por inactividad (15 minutos). Por seguridad debes iniciar sesión de nuevo.');
            sessionStorage.removeItem('fraterno_user');
            sessionStorage.removeItem('fraterno_role');
            window.location.hash = '#/login';
        }
    }, 30000); // Check every 30 seconds
    
    ['mousemove', 'mousedown', 'keypress', 'touchmove', 'scroll'].forEach(evt => {
        // Use passive listener and throttle by relying on simple variable assignment
        document.addEventListener(evt, updateActivityTime, { capture: true, passive: true });
    });

    router();

    let blockedByFirstLoginOnLoad = false;
    if (window.PasswordManager) {
        window.PasswordManager.init();
        const curHashPwd = (window.location.hash.slice(1) || '/').split('?')[0];
        const isPublicPwd = ['/login', '/b2c', '/autogestion', '/fids'].includes(curHashPwd);
        if (!isPublicPwd && sessionStorage.getItem('fraterno_user')) {
            blockedByFirstLoginOnLoad = window.PasswordManager.checkMandatoryPasswordChange();
        }
    }

    if (window.SupportSystem) {
        window.SupportSystem.init();
        window.SupportSystem.updateSupportBadge();
        const curHash = (window.location.hash.slice(1) || '/').split('?')[0];
        const isPublic = ['/login', '/b2c', '/autogestion', '/fids'].includes(curHash);
        if (!blockedByFirstLoginOnLoad && !isPublic && sessionStorage.getItem('fraterno_user')) {
            window.SupportSystem.checkAndNotifyResolvedTickets();
        }
    }
});
