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
                                <input type="text" id="login-user" class="form-control" placeholder="Ingresa tu usuario" autocomplete="username" autocapitalize="none" autocorrect="off" spellcheck="false" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="login-pass">Contraseña</label>
                            <div class="login-input-wrap">
                                <i class="fas fa-lock login-input-icon"></i>
                                <input type="password" id="login-pass" class="form-control" placeholder="••••••••" autocomplete="current-password" autocapitalize="none" autocorrect="off" spellcheck="false" required>
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

        function findMatchingUser(userIn, passIn) {
            const normUser = String(userIn || '').trim().toLowerCase();
            const passTrimmed = String(passIn || '').trim();
            if (!normUser) return null;

            const deletedSet = new Set(
                (window.AppData && Array.isArray(window.AppData.deletedUserIds)) ? window.AppData.deletedUserIds : []
            );
            const users = (window.AppData && Array.isArray(window.AppData.users)) ? window.AppData.users : [];
            let matchedUser = users.find(u => {
                if (!u) return false;
                if (u.id && deletedSet.has(u.id)) return false;
                const uName = String(u.username || '').trim().toLowerCase();
                if (!u.id && uName && deletedSet.has('uname:' + uName)) return false;
                if (!uName || uName !== normUser) return false;
                if (u.password === undefined) {
                    return passIn === '1234' || passTrimmed === '1234';
                }
                const storedPass = String(u.password);
                return storedPass === passIn || storedPass === passTrimmed;
            }) || null;

            // Fallback de emergencia únicamente si admin01 no existe en el estado
            const hasAdminInStore = users.some(u =>
                u && (String(u.username || '').trim().toLowerCase() === 'admin01' || u.id === 'usr_admin')
            );
            if (!hasAdminInStore && normUser === 'admin01' && (passIn === '01Fraterno*' || passTrimmed === '01Fraterno*') && !matchedUser) {
                matchedUser = { id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: '01Fraterno*', mustChangePassword: false };
                window.AppData.users = users;
                window.AppData.users.unshift(matchedUser);
                if (window.saveAppData) window.saveAppData();
            }
            return matchedUser;
        }

        function completeLogin(matchedUser) {
            const canonicalRole = window.normalizeUserRoleLabel
                ? window.normalizeUserRoleLabel(matchedUser.role, matchedUser)
                : matchedUser.role;
            matchedUser.role = canonicalRole;
            const sessionRoleCode = window.resolveSessionRoleCode
                ? window.resolveSessionRoleCode(canonicalRole, matchedUser)
                : (String(canonicalRole || '').toLowerCase().includes('venta') ? 'ventas' : 'admin');

            sessionStorage.setItem('fraterno_user', JSON.stringify(matchedUser));
            sessionStorage.setItem('fraterno_role', sessionRoleCode);
            sessionStorage.setItem('fraterno_check_support_notifs', '1');
            if (window.updateSidebarUserProfileUI) {
                window.updateSidebarUserProfileUI(matchedUser);
            }

            const landing = (typeof window.getDefaultLandingRouteForUser === 'function')
                ? window.getDefaultLandingRouteForUser(matchedUser)
                : (sessionRoleCode === 'ventas' ? '/reservas' : '/');
            window.location.hash = landing;
        }

        form.addEventListener('submit', async (e) => {
            if (e && typeof e.preventDefault === 'function') e.preventDefault();
            if (form.dataset.submitting === '1') return;
            form.dataset.submitting = '1';

            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.disabled = true;

            try {
                const userIn = document.getElementById('login-user').value.trim();
                const passIn = document.getElementById('login-pass').value;

                // 1. Seguridad multi-dispositivo: SIEMPRE sincronizar estado fresco desde el servidor ANTES de autenticar
                //    para impedir que un navegador sin refrescar permita ingresar a un usuario eliminado o con credenciales revocadas.
                if (typeof window.syncStateFromServer === 'function') {
                    await window.syncStateFromServer();
                }

                // 2. Validar credenciales contra la lista actualizada de usuarios activos
                const matchedUser = findMatchingUser(userIn, passIn);
                if (matchedUser) {
                    completeLogin(matchedUser);
                    return;
                }

                // 3. Mensaje claro orientando si es primer inicio de sesión
                const normUser = String(userIn || '').trim().toLowerCase();
                const deletedSet = new Set(
                    (window.AppData && Array.isArray(window.AppData.deletedUserIds)) ? window.AppData.deletedUserIds : []
                );
                const existingUser = ((window.AppData && window.AppData.users) || []).find(
                    u => u && !(u.id && deletedSet.has(u.id)) && String(u.username || '').trim().toLowerCase() === normUser
                );
                const errMsg = (existingUser && existingUser.mustChangePassword === true)
                    ? 'Contraseña incorrecta para primer inicio de sesión. Ingresa tu número de cédula seguido exactamente de Fp* (con F mayúscula, p minúscula y asterisco *).'
                    : 'Usuario o contraseña incorrectos. Verifica tus credenciales e intenta nuevamente.';

                if (window.showAlert) {
                    window.showAlert(errMsg, { type: 'danger', title: 'Acceso Denegado' });
                } else {
                    alert(errMsg);
                }
            } finally {
                form.dataset.submitting = '0';
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
};

