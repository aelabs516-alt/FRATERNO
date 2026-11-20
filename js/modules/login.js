window.Modules = window.Modules || {};
window.Modules.login = {
    render: (container) => {
        const isDark = document.body && document.body.classList && document.body.classList.contains('dark-mode');
        const logoSrc = isDark ? 'img/logo_dark.png' : 'img/logo.png';
        container.innerHTML = `
            <div class="login-container">
                <div class="login-overlay"></div>
                <div class="login-ambient-orb orb-1"></div>
                <div class="login-ambient-orb orb-2"></div>

                <button type="button" id="login-theme-toggle" class="login-theme-btn" title="Cambiar entre modo claro y modo oscuro">
                    <i class="fas ${isDark ? 'fa-sun' : 'fa-moon'}"></i>
                    <span>${isDark ? 'Modo Claro' : 'Modo Oscuro'}</span>
                </button>

                <div class="login-card">
                    <div class="login-badge">
                        <i class="fas fa-parachute-box"></i> Operaciones Aéreas & Manifiesto
                    </div>
                    <div class="login-logo">
                        <img src="${logoSrc}" alt="Fraterno Paracaidismo">
                    </div>
                    <h1 class="login-title">Bienvenido a Fraterno</h1>
                    <p class="login-subtitle">Ingresa tus credenciales para acceder al centro de control</p>

                    <form id="login-form" class="login-form">
                        <div class="form-group">
                            <label for="login-user">Usuario</label>
                            <div class="login-input-wrap">
                                <i class="fas fa-user login-input-icon"></i>
                                <input type="text" id="login-user" class="form-control" placeholder="Ingresa tu usuario" autocomplete="username" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="login-pass">Contraseña</label>
                            <div class="login-input-wrap">
                                <i class="fas fa-lock login-input-icon"></i>
                                <input type="password" id="login-pass" class="form-control" placeholder="••••••••" autocomplete="current-password" required>
                                <button type="button" id="login-toggle-pass" class="login-pass-eye" aria-label="Mostrar u ocultar contraseña" title="Mostrar contraseña">
                                    <i class="fas fa-eye"></i>
                                </button>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary login-submit-btn">
                            <span>Iniciar Sesión</span>
                            <i class="fas fa-arrow-right"></i>
                        </button>
                    </form>

                    <div class="login-footer-note">
                        <i class="fas fa-shield-alt"></i> Plataforma Segura — Club Deportivo Fundación Fraterno
                    </div>
                </div>
            </div>
        `;
    },
    init: () => {
        const form = document.getElementById('login-form');
        const togglePassBtn = document.getElementById('login-toggle-pass');
        const passInput = document.getElementById('login-pass');
        const themeBtn = document.getElementById('login-theme-toggle');

        if (togglePassBtn && passInput) {
            togglePassBtn.addEventListener('click', () => {
                const showing = passInput.type === 'text';
                passInput.type = showing ? 'password' : 'text';
                togglePassBtn.innerHTML = `<i class="fas ${showing ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
            });
        }

        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                const currentlyDark = document.body.classList.contains('dark-mode');
                const next = currentlyDark ? 'light' : 'dark';
                if (typeof window.applyTheme === 'function') {
                    window.applyTheme(next, true);
                }
                themeBtn.innerHTML = `<i class="fas ${next === 'dark' ? 'fa-sun' : 'fa-moon'}"></i><span>${next === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}</span>`;
            });
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const userIn = document.getElementById('login-user').value.trim();
            const passIn = document.getElementById('login-pass').value;
            
            const users = window.AppData.users || [];
            
            let matchedUser = users.find(u =>
                String(u.username || '').trim() === userIn &&
                (u.password === passIn || (u.password === undefined && passIn === '1234'))
            );
            
            // Fallback de emergencia únicamente si admin01 no existe en el estado
            const hasAdminInStore = users.some(u =>
                String(u.username || '').trim().toLowerCase() === 'admin01' || u.id === 'usr_admin'
            );
            if (!hasAdminInStore && userIn === 'admin01' && passIn === '01Fraterno*' && !matchedUser) {
                matchedUser = { id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: '01Fraterno*', mustChangePassword: false };
                window.AppData.users = users;
                window.AppData.users.unshift(matchedUser);
                if (window.saveAppData) window.saveAppData();
            }

            if (matchedUser) {
                sessionStorage.setItem('fraterno_user', JSON.stringify(matchedUser));
                sessionStorage.setItem('fraterno_role', matchedUser.role.toLowerCase().includes('venta') ? 'ventas' : 'admin');
                sessionStorage.setItem('fraterno_check_support_notifs', '1');
                
                if (matchedUser.role.toLowerCase().includes('venta')) {
                    window.location.hash = '/reservas';
                } else {
                    window.location.hash = '/';
                }
            } else {
                const errMsg = 'Usuario o contraseña incorrectos. Verifica tus credenciales e intenta nuevamente.';
                if (window.showAlert) {
                    window.showAlert(errMsg, { type: 'danger', title: 'Acceso Denegado' });
                } else {
                    alert(errMsg);
                }
            }
        });
    }
};

