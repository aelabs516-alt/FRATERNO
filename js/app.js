/**
 * app.js
 * Motor de enrutamiento principal (Single Page Application)
 */

window.saveAppData = function() {
    localStorage.setItem('fraterno_app_data', JSON.stringify(window.AppData));
    
    // Sync with backend API
    fetch('/api/state', {
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

function loadAppData() {
    const saved = localStorage.getItem('fraterno_app_data');
    if (saved) {
        try { 
            const data = JSON.parse(saved);
            // Ensure noOpRules exists
            data.noOpRules = data.noOpRules || { daysOfWeek: ['1', '2'], specificDates: [] };
            data.users = data.users || [{ id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador' }];
            
            // Migrate old flight status
            if (data.passengers) {
                data.passengers.forEach(p => {
                    if (p.flightStatus === 'Skydivers On Air') p.flightStatus = 'Paracaidistas en el aire';
                });
            }

            // Init store data if absent
            data.storeProducts = data.storeProducts || [];
            data.storeSales = data.storeSales || [];

            return data;
        } catch(e) {
            console.error("Critical: Failed to parse fraterno_app_data, backing up to prevent data loss.", e);
            localStorage.setItem('fraterno_app_data_corrupted_backup_' + Date.now(), saved);
        }
    }
    return {
        passengers: [],
        instructors: [],
        pilots: [],
        aeronaves: [],
        asignacionFlota: [],
        storeProducts: [],
        storeSales: [],
        noOpRules: { daysOfWeek: ['1', '2'], specificDates: [] },
        users: [{ id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: 'admin' }]
    };
}
window.AppData = loadAppData();

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

/// One-time wipe of transactional data for production start
if (!localStorage.getItem('fraterno_wiped_transactional_v2')) {
    window.AppData.passengers = [];
    window.AppData.asignacionFlota = [];
    window.AppData.timeTracking = [];
    window.AppData.cajaMenor = [];
    
    if (window.AppData.inventory) {
        window.AppData.inventory.forEach(item => {
            item.jumps = 0; // Reset parachute usage
        });
    }

    window.saveAppData();
    localStorage.setItem('fraterno_wiped_transactional_v2', 'true');
    console.log("Transactional data wiped for production start.");
}

window.addEventListener('beforeunload', window.saveAppData);

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
    const appContainer = document.getElementById('app-wrapper');
    const mainContent = document.querySelector('.main-content');

    const isFullscreenModule = hash === '/login' || hash === '/b2c' || hash === '/autogestion';

    if (header) header.style.display = isFullscreenModule ? 'none' : 'flex';
    if (sidebar) sidebar.style.display = isFullscreenModule ? 'none' : 'flex';
    if (appContainer) {
        appContainer.style.marginTop = isFullscreenModule ? '0' : 'calc(var(--header-height) + 1rem)';
        appContainer.style.height = isFullscreenModule ? '100vh' : 'calc(100vh - var(--header-height) - 1rem)';
    }
    if (mainContent) {
        mainContent.style.padding = isFullscreenModule ? '0' : '2rem';
    }
    
    // Render the module securely
    if (routes[hash] && typeof routes[hash].render === 'function') {
        try {
            routes[hash].render(appView);
            if (typeof routes[hash].init === 'function') {
                routes[hash].init();
            }
        } catch (err) {
            console.error("Module Render Error:", err);
            appView.innerHTML = `<div style="padding:2rem;color:red;text-align:center;">
                <h3>Error Crítico de Renderizado</h3>
                <p>El módulo no pudo cargar correctamente debido a un error interno.</p>
                <code>${err.message}</code>
            </div>`;
        }
    } else {
        console.error("Module definition is missing render method:", hash);
    }
    } catch (criticalErr) {
        console.error("Critical Router Error:", criticalErr);
        const appView = document.getElementById('app-view');
        if (appView) {
            appView.innerHTML = `<div style="padding:2rem;color:red;text-align:center;">
                <h3>Error Crítico del Sistema</h3>
                <p>El sistema encontró un error al intentar navegar.</p>
                <code>${criticalErr.message}</code>
            </div>`;
        }
    }
}

// Listen to hash changes
window.addEventListener('hashchange', router);

// On load
window.addEventListener('load', async () => {
    try {
        const res = await fetch('/api/state');
        if (res.ok) {
            const data = await res.json();
            if (Object.keys(data).length > 0) {
                window.AppData = data;
                localStorage.setItem('fraterno_app_data', JSON.stringify(data));
            }
        }
    } catch (e) {
        console.log('Running in local mode or API offline');
    }
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
    const savedTheme = localStorage.getItem('fraterno_theme');
    
    const updateLogo = (theme) => {
        const logoImg = document.querySelector('.logo img');
        if (logoImg) {
            logoImg.src = theme === 'dark' ? 'img/logo_dark.png' : 'img/logo.png';
        }
    };

    if (savedTheme === 'dark') {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        if (themeSwitch) themeSwitch.checked = true;
        updateLogo('dark');
    } else {
        updateLogo('light');
    }

    if (themeSwitch) {
        themeSwitch.addEventListener('change', (e) => {
            const updateDashboardCharts = () => {
                if (window.Modules && window.Modules.dashboard && (window.location.hash === '#/dashboard' || window.location.hash === '' || window.location.hash === '#/')) {
                    const container = document.getElementById('app-view');
                    if (container) {
                        window.Modules.dashboard.render(container);
                    }
                }
            };

            if (e.target.checked) {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                localStorage.setItem('fraterno_theme', 'dark');
                updateLogo('dark');
                updateDashboardCharts();
            } else {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                localStorage.setItem('fraterno_theme', 'light');
                updateLogo('light');
                updateDashboardCharts();
            }
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

    // Device Identification (Mobile vs Desktop)
    function detectDevice() {
        const isMobile = window.innerWidth <= 768 || /Mobi|Android/i.test(navigator.userAgent);
        window.isMobileDevice = isMobile;
        if (isMobile) {
            document.body.classList.add('device-mobile');
            document.body.classList.remove('device-desktop');
        } else {
            document.body.classList.add('device-desktop');
            document.body.classList.remove('device-mobile');
        }
    }
    detectDevice();
    window.addEventListener('resize', detectDevice);

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
});
