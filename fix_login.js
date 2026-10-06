const fs = require('fs');

// 1. UPDATE APP.JS
let appJs = fs.readFileSync('js/app.js', 'utf8');

// Set default admin password
appJs = appJs.replace(
    'users: [{ id: \'usr_admin\', name: \'Admin Master\', username: \'admin01\', role: \'Administrador\' }]',
    'users: [{ id: \'usr_admin\', name: \'Admin Master\', username: \'admin01\', role: \'Administrador\', password: \'admin\' }]'
);

// Update routing check to use fraterno_user
appJs = appJs.replace(
    "const currentRole = sessionStorage.getItem('fraterno_role');\n    if (!currentRole && hash !== '/b2c' && hash !== '/autogestion') {",
    "const currentUserStr = sessionStorage.getItem('fraterno_user');\n    if (!currentUserStr && hash !== '/b2c' && hash !== '/autogestion') {"
);

// When logging out, clear fraterno_user
appJs = appJs.replace(
    "sessionStorage.removeItem('fraterno_role');",
    "sessionStorage.removeItem('fraterno_user'); sessionStorage.removeItem('fraterno_role');"
);

// In router, parse the user and update the sidebar
const routerBlock = `function router() {
    let hash = window.location.hash || '#/';
    hash = hash.substring(1); // remove #
`;
if (appJs.includes(routerBlock)) {
    appJs = appJs.replace(
        routerBlock,
        `function router() {
    let hash = window.location.hash || '#/';
    hash = hash.substring(1); // remove #
    
    // Update Sidebar User Profile
    const userStr = sessionStorage.getItem('fraterno_user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            const profileDiv = document.getElementById('sidebar-user-profile');
            if (profileDiv) {
                const h4 = profileDiv.querySelector('h4');
                const roleSpan = profileDiv.querySelector('.role');
                if (h4) h4.innerText = user.name;
                if (roleSpan) roleSpan.innerText = '[' + user.role + ']';
            }
        } catch(e) {}
    }
`
    );
}

fs.writeFileSync('js/app.js', appJs);

// 2. UPDATE LOGIN.JS
let loginJs = fs.readFileSync('js/modules/login.js', 'utf8');

// Remove role dropdown and fix submit logic
const loginHtmlTarget = `                        <!-- Para la maqueta, permitiremos elegir el rol a simular -->
                        <div class="form-group" style="margin-bottom: 2rem;">
                            <label style="color: var(--brand-action);">[Modo Demo] Simular Rol:</label>
                            <select id="login-role" class="form-control" style="border-color: var(--brand-action);">
                                <option value="admin">Administrador (Acceso Total)</option>
                                <option value="ventas">Ventas (Solo Reservas y Calendario)</option>
                            </select>
                        </div>`;
loginJs = loginJs.replace(loginHtmlTarget, '');

const initTarget = `        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('login-role').value;
            
            // Save role in session storage for the app to know who is logged in
            sessionStorage.setItem('fraterno_role', role);

            // Redirect based on role
            if (role === 'admin') {
                window.location.hash = '/';
            } else if (role === 'ventas') {
                window.location.hash = '/reservas';
            }
        });`;
const initReplacement = `        const form = document.getElementById('login-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const userIn = document.getElementById('login-user').value.trim();
            const passIn = document.getElementById('login-pass').value;
            
            const users = window.AppData.users || [];
            
            // Allow default hardcoded credentials if array is somehow corrupted
            let matchedUser = users.find(u => u.username === userIn && (u.password === passIn || (u.password === undefined && passIn === '1234')));
            
            // Fallback for demo
            if (userIn === 'admin01' && passIn === 'admin' && !matchedUser) {
                matchedUser = { id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: 'admin' };
            }

            if (matchedUser) {
                sessionStorage.setItem('fraterno_user', JSON.stringify(matchedUser));
                sessionStorage.setItem('fraterno_role', matchedUser.role.toLowerCase().includes('venta') ? 'ventas' : 'admin');
                
                if (matchedUser.role.toLowerCase().includes('venta')) {
                    window.location.hash = '/reservas';
                } else {
                    window.location.hash = '/';
                }
            } else {
                alert('Credenciales incorrectas. (Si es un usuario sin contraseña guardada, prueba con 1234)');
            }
        });`;
loginJs = loginJs.replace(initTarget, initReplacement);
fs.writeFileSync('js/modules/login.js', loginJs);

// 3. UPDATE SETTINGS.JS
let settingsJs = fs.readFileSync('js/modules/settings.js', 'utf8');

settingsJs = settingsJs.replace(
    '<label>Contraseña</label><input type="password" class="form-control">',
    '<label>Contraseña</label><input type="password" id="usr-pass" class="form-control" placeholder="1234">'
);

// Add password extraction in create/edit listener
if (!settingsJs.includes("const password = document.getElementById('usr-pass').value;")) {
    settingsJs = settingsJs.replace(
        "const role = document.getElementById('usr-role').value;",
        "const role = document.getElementById('usr-role').value;\n            const password = document.getElementById('usr-pass').value;"
    );
    settingsJs = settingsJs.replace(
        "user.role = role;",
        "user.role = role;\n                    if (password) user.password = password;"
    );
    settingsJs = settingsJs.replace(
        "role: role",
        "role: role,\n                    password: password || '1234'"
    );
    settingsJs = settingsJs.replace(
        "document.getElementById('usr-role').selectedIndex = 0;",
        "document.getElementById('usr-role').selectedIndex = 0;\n            document.getElementById('usr-pass').value = '';"
    );
}

fs.writeFileSync('js/modules/settings.js', settingsJs);
console.log('Login fix script executed successfully.');
