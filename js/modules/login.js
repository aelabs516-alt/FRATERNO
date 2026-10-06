window.Modules = window.Modules || {};
window.Modules.login = {
    render: (container) => {
        container.innerHTML = `
            <div class="login-container">
                <div class="login-overlay"></div>
                <div class="login-card">
                    <div class="login-logo" style="margin-bottom: 0.5rem; text-align: center;">
                        <img src="img/logo.png" alt="Fraterno Logo" style="height: 60px;">
                    </div>
                    <p class="login-subtitle">Sistema de Gestión Aeronáutica</p>

                    <form id="login-form" style="text-align: left;">
                        <div class="form-group">
                            <label>Usuario</label>
                            <input type="text" id="login-user" class="form-control" placeholder="Ingresa tu usuario" required>
                        </div>
                        <div class="form-group" style="margin-bottom: 2rem;">
                            <label>Contraseña</label>
                            <input type="password" id="login-pass" class="form-control" placeholder="••••••••" required>
                        </div>



                        <button type="submit" class="btn btn-primary" style="width: 100%; padding: 0.75rem; font-size: 1.1rem;">
                            Iniciar Sesión <i class="fas fa-arrow-right" style="margin-left: 0.5rem;"></i>
                        </button>
                    </form>
                </div>
            </div>
        `;
    },
    init: () => {
        const form = document.getElementById('login-form');
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
        });
    }
}

