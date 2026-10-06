const fs = require('fs');
let code = fs.readFileSync('js/app.js', 'utf8');

// 1. Refactor loadAppData
const regexLoadApp = /function loadAppData\(\) \{([\s\S]*?)\} catch\(e\) \{\}([\s\S]*?)return \{/m;
const replaceLoadApp = `function loadAppData() {
    const saved = localStorage.getItem('fraterno_app_data');
    if (saved) {
        try { 
            const data = JSON.parse(saved);
            // Ensure noOpRules exists
            data.noOpRules = data.noOpRules || { daysOfWeek: ['1', '2'], specificDates: [] };
            
            // Migrate old flight status
            if (data.passengers) {
                data.passengers.forEach(p => {
                    if (p.flightStatus === 'Skydivers On Air') p.flightStatus = 'Paracaidistas en el aire';
                });
            }

            return data;
        } catch(e) {
            console.error("Critical: Failed to parse fraterno_app_data, backing up to prevent data loss.", e);
            localStorage.setItem('fraterno_app_data_corrupted_backup_' + Date.now(), saved);
        }
    }$2return {`;
code = code.replace(regexLoadApp, replaceLoadApp);

// 2. Refactor router DOM checks
const regexRouterDOM = /const appView = document\.getElementById\('app-view'\);[\s\S]*?routes\[hash\]\.render\(appView\);\s*if\(routes\[hash\]\.init\) \{\s*routes\[hash\]\.init\(\);\s*\}/;
const replaceRouterDOM = `const appView = document.getElementById('app-view');
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
            appView.innerHTML = \`<div style="padding:2rem;color:red;text-align:center;">
                <h3>Error Crítico de Renderizado</h3>
                <p>El módulo no pudo cargar correctamente debido a un error interno.</p>
                <code>\${err.message}</code>
            </div>\`;
        }
    } else {
        console.error("Module definition is missing render method:", hash);
    }`;
code = code.replace(regexRouterDOM, replaceRouterDOM);

fs.writeFileSync('js/app.js', code, 'utf8');
console.log('app.js audited and refactored.');
