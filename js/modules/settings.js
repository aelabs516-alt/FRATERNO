window.Modules = window.Modules || {};
window.Modules.settings = {
    render: (container) => {
        container.innerHTML = `
            <h2>Configuración del Sistema</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Administra las variables globales y submódulos.</p>

            <!-- Tabs Navigation -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; overflow-x: auto;" id="settings-tabs">
                <button class="btn btn-primary" data-target="precios">Maestro de Valores</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="aeronaves">Aeronaves</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="usuarios">Creación de Usuarios</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="backup"><i class="fas fa-database"></i> Backup de Datos</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="noop"><i class="fas fa-calendar-times"></i> Fechas NO Operación</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="documentos"><i class="fas fa-file-pdf"></i> Documentos Legales</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="store-products"><i class="fas fa-box"></i> Maestro Productos Tienda</button>
            </div>

            <!-- 1. Maestro de Valores                          -->
            <!-- ============================================== -->
            
            <!-- ============================================== -->
            <!-- Gesti&oacute;n de Documentos PDF                      -->
            <!-- ============================================== -->
            <div id="content-documentos" class="settings-content" style="display: none;">
                <h3>Gesti&oacute;n de Documentos Legales (PDF)</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Administra las versiones de los documentos que se muestran en el portal B2C y portal de autogesti&oacute;n.</p>
                <div id="docs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                    <!-- Rendered dynamically -->
                </div>
            </div>

            <!-- ============================================== -->
            <!-- Maestro Productos Tienda                       -->
            <!-- ============================================== -->
            <div id="content-store-products" class="card settings-content" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3><i class="fas fa-boxes"></i> Maestro de Productos Tienda</h3>
                    <button class="btn btn-primary" id="btn-create-store-product"><i class="fas fa-plus"></i> Crear Producto</button>
                </div>
                <div id="store-products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;">
                    <!-- Productos renderizados aquí -->
                </div>
            </div>

            <div id="content-precios" class="card settings-content" style="display: block;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <h3>Maestro de Valores</h3>
                    <button class="btn btn-primary" id="btn-create-valor"><i class="fas fa-plus"></i> Crear Nuevo Ítem</button>
                </div>
                <div id="valores-grid" style="margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                    <!-- Rendered dynamically -->
                </div>
                <div style="margin-top: 1.5rem; text-align: right;">
                    <button class="btn btn-primary" id="btn-save-prices"><i class="fas fa-save"></i> Guardar Valores</button>
                </div>
            </div>



            <!-- ============================================== -->
            <!-- Aeronaves                                      -->
            <!-- ============================================== -->
            <div id="content-aeronaves" class="settings-content" style="display: none;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                    
                    <!-- Formulario -->
                    <div class="card">
                        <h3>Registrar Aeronave</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Registra los aviones y su capacidad de salto.</p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Aeronave (Modelo)</label>
                                <input type="text" id="plane-model" class="form-control" placeholder="Ej: Cessna 208 Caravan">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Matrícula</label>
                                <input type="text" id="plane-reg" class="form-control" placeholder="Ej: HK-1234">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Cap. FunJumper</label>
                                <input type="number" id="plane-cap-fun" class="form-control" value="10" min="0">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Cap. Tandem</label>
                                <input type="number" id="plane-cap-tan" class="form-control" value="5" min="0">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Cap. Copiloto</label>
                                <input type="number" id="plane-cap-cop" class="form-control" value="0" min="0">
                            </div>
                            <div class="form-group" style="margin-bottom: 0; grid-column: span 2;">
                                <label>Aeronave Activa (Estado)</label>
                                <select id="plane-status" class="form-control">
                                    <option value="Operativa">Operativa</option>
                                    <option value="AOG">AOG (Mantenimiento)</option>
                                    <option value="No operativa">No operativa</option>
                                </select>
                            </div>
                            <div class="form-group" style="grid-column: span 2; margin-bottom: 0;">
                                <label>Foto de la Aeronave</label>
                                <input type="file" id="plane-photo" class="form-control" style="padding: 0.5rem;">
                            </div>
                        </div>

                        <div style="margin-top: 1.5rem;">
                            <button class="btn btn-primary" id="btn-create-plane" style="width: 100%; padding: 0.75rem;"><i class="fas fa-plane"></i> Crear Aeronave</button>
                        </div>
                    </div>

                    <!-- Lista -->
                    <div class="card">
                        <h3>Aeronaves Activas</h3>
                        <table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem; margin-top: 1rem;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--border-color); background: var(--bg-surface-hover);">
                                    <th style="padding: 1rem;">Matrícula</th>
                                    <th style="padding: 1rem;">Modelo</th>
                                    <th style="padding: 1rem;">Capacidad</th>
                                    <th style="padding: 1rem;">Estado</th>
                                    <th style="padding: 1rem; text-align: center;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="table-plane">
                                <!-- Dynamic rows -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- 5. Creación de Usuarios                        -->
            <!-- ============================================== -->
            <div id="content-usuarios" class="settings-content" style="display: none;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                    
                    <!-- Formulario Nuevo Usuario -->
                    <div class="card">
                        <h3>Registrar Nuevo Usuario</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Completa los datos y asigna los módulos de acceso permitidos.</p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;"><label>Usuario</label><input type="text" id="usr-username" class="form-control" placeholder="Ej: admin01"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>Nombre Completo</label><input type="text" id="usr-name" class="form-control" placeholder="Nombre"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>Cédula</label><input type="text" class="form-control"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>Celular</label><input type="tel" class="form-control"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>Correo</label><input type="email" class="form-control"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>Contraseña</label><input type="password" id="usr-pass" class="form-control" placeholder="1234"></div>
                            <div class="form-group" style="grid-column: span 2; margin-bottom: 0;"><label>Foto (URL o Archivo)</label><input type="file" id="usr-photo" class="form-control" style="padding: 0.5rem;" accept="image/*"></div>
                        </div>

                        <h4 style="margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Rol y Accesos</h4>
                        <div class="form-group">
                            <label>Rol del Usuario</label>
                            <select id="usr-role" class="form-control">
                                <option>Administrador</option>
                                <option>Asesor de Ventas</option>
                                <option>Operaciones</option>
                            </select>
                        </div>
                        
                        <label style="font-weight: 500; margin-bottom: 0.5rem; display: block;">Módulos Permitidos:</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Asignación de Flota</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Asignación de Recursos</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Caja Menor</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Check-in</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Configuración</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Consulta Historial</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Dashboard</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Facturación</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Generar Factura</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Inicio</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Inventario</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Manifiesto</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Pantalla FIDS</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Portal Autogestión</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Portal B2C (Cliente)</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Registro de Salto</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Reservas</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> RRHH y Tiempos</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Ventas Tienda</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" checked style="accent-color: var(--brand-action);"> Videografía</label>
                        </div>

                        <div style="margin-top: 1.5rem;">
                            <button class="btn btn-primary" id="btn-create-usr" style="width: 100%; padding: 0.75rem;"><i class="fas fa-save"></i> Crear Usuario</button>
                        </div>
                    </div>

                    <!-- Lista de Usuarios -->
                    <div class="card">
                        <h3>Usuarios Activos</h3>
                        <div style="overflow-x: auto; margin-top: 1rem;">
                            <table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                                <thead>
                                    <tr style="border-bottom: 1px solid var(--border-color); background: var(--bg-surface-hover);">
                                        <th style="padding: 1rem;">Nombre</th>
                                        <th style="padding: 1rem;">Usuario</th>
                                        <th style="padding: 1rem;">Rol</th>
                                        <th style="padding: 1rem; text-align: center;">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="table-usr"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- 6. Backup de Datos                             -->
            <!-- ============================================== -->
            <div id="content-backup" class="card settings-content" style="display: none;">
                <h3>Copias de Seguridad (Backup)</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Configura el envío automático de la base de datos a tu correo electrónico.</p>
                
                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem; max-width: 500px;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Correo Electrónico Destino</label>
                        <input type="email" id="backup-email" class="form-control" placeholder="admin@fraterno.com">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Frecuencia de Envío</label>
                        <select id="backup-freq" class="form-control">
                            <option value="diario">Diario</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Hora de Envío</label>
                        <input type="time" id="backup-time" class="form-control" value="23:00">
                    </div>
                </div>
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem;">
                    <button class="btn btn-primary" id="btn-save-backup"><i class="fas fa-save"></i> Guardar Configuración</button>
                    <button class="btn" id="btn-force-backup" style="background: var(--brand-success); color: white;"><i class="fas fa-cloud-download-alt"></i> Forzar Backup Ahora</button>
                </div>
            </div>



            <!-- ============================================== -->
            <!-- 7. Fechas NO Operación                         -->
            <!-- ============================================== -->
            <div id="content-noop" class="settings-content" style="display: none;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                    
                    <div class="card">
                        <h3 style="color: var(--brand-danger);"><i class="fas fa-calendar-times"></i> Días de la Semana Cerrados</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Selecciona los días que, por defecto, la empresa NO tiene operación (ej. todos los lunes y martes).</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; background: var(--bg-main); padding: 1rem; border-radius: 8px;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="1"> Lunes
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="2"> Martes
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="3"> Miércoles
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="4"> Jueves
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="5"> Viernes
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="6"> Sábado
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="0"> Domingo
                            </label>
                        </div>
                        <button class="btn btn-primary" id="btn-save-noop-days" style="margin-top: 1rem; width: 100%;">Guardar Días</button>
                    </div>

                    <div class="card">
                        <h3 style="color: var(--brand-danger);"><i class="fas fa-calendar-day"></i> Fechas Específicas Cerradas</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Bloquea fechas exactas (DD/MM/AAAA) por mantenimientos, festivos especiales, etc.</p>
                        
                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                            <input type="date" id="noop-specific-date" class="form-control" style="flex: 1;">
                            <button class="btn btn-primary" id="btn-add-noop-date"><i class="fas fa-plus"></i> Bloquear</button>
                        </div>

                        <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Fechas Bloqueadas</h4>
                        <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 8px; max-height: 250px; overflow-y: auto;">
                            <table class="data-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                                <thead>
                                    <tr style="background: var(--bg-surface); border-bottom: 2px solid var(--border-color);">
                                        <th style="padding: 0.75rem;">Fecha (AAAA-MM-DD)</th>
                                        <th style="padding: 0.75rem; text-align: center;">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="table-noop-dates">
                                    <!-- Dynamic rows -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>


        `;
    },
    
    init: () => {
        function escapeHTML(str) {
            if (typeof str !== 'string') str = String(str);
            return str.replace(/[&<>"']/g, function(m) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                }[m];
            });
        }
        
        window.renderUsersTable = function() {
            const tbody = document.getElementById('table-usr');
            if (!tbody) return;
            tbody.innerHTML = '';
            const users = window.AppData.users || [];
            users.forEach(u => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = `
                    <td style="padding: 1rem; font-weight: 500;">${escapeHTML(u.name)}</td>
                    <td style="padding: 1rem;">${escapeHTML(u.username)}</td>
                    <td style="padding: 1rem;">${escapeHTML(u.role)}</td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit" data-id="${escapeHTML(u.id)}" style="color: var(--brand-action); padding: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-id="${escapeHTML(u.id)}" style="color: var(--brand-danger); padding: 0.25rem;"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        };
        window.renderUsersTable();

        // =====================================
        // Tabs Logic
        // =====================================
        const tabsContainer = document.getElementById('settings-tabs');
        const tabs = tabsContainer.querySelectorAll('button');
        const contents = document.querySelectorAll('.settings-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('btn-primary');
                    t.style.background = 'var(--bg-surface-hover)';
                    t.style.color = 'var(--text-primary)';
                });
                contents.forEach(c => c.style.display = 'none');
                tab.classList.add('btn-primary');
                tab.style.background = '';
                tab.style.color = '';
                const target = tab.getAttribute('data-target');
                document.getElementById('content-' + target).style.display = 'block';
            });
        });

        // =====================================
        // Currency Formatting Helper
        // =====================================
        function formatCurrency(val) {
            let num = val.replace(/\D/g, ''); // strip non digits
            if (num === '') return '';
            return parseInt(num).toLocaleString('es-CO');
        }

        const priceInputs = document.querySelectorAll('.price-input');
        priceInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = formatCurrency(e.target.value);
            });
        });

        // =====================================
        // Global CRUD Action Delegation (Edit/Delete/View)
        // =====================================
        document.querySelectorAll('.crud-table').forEach(table => {
            table.addEventListener('click', (e) => {
                const btnDelete = e.target.closest('.btn-delete');
                const btnEdit = e.target.closest('.btn-edit');
                const btnViewServices = e.target.closest('.btn-view-services');
                
                if (btnDelete) {
                    if(confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                        const tr = btnDelete.closest('tr');
                        const tbody = tr.closest('tbody');
                        if (tbody && tbody.id === 'table-usr') {
                            const id = btnDelete.getAttribute('data-id');
                            if (id) {
                                const idx = window.AppData.users.findIndex(u => u.id === id);
                                if (idx !== -1) {
                                    window.AppData.users.splice(idx, 1);
                                    if (window.saveAppData) window.saveAppData();
                                }
                            }
                        }
                        tr.remove();
                    }
                }
                
                if (btnEdit && !btnViewServices) {
                    const tr = btnEdit.closest('tr');
                    const tbody = btnEdit.closest('tbody');
                    if (tbody && tbody.id === 'table-usr') {
                        const nameInput = document.getElementById('usr-name');
                        const userInput = document.getElementById('usr-username');
                        const roleSelect = document.getElementById('usr-role');
                        
                        if (nameInput) nameInput.value = tr.cells[0].innerText.trim();
                        if (userInput) userInput.value = tr.cells[1].innerText.trim();
                        if (roleSelect) {
                            const roleTxt = tr.cells[2].innerText.trim();
                            for (let i = 0; i < roleSelect.options.length; i++) {
                                if (roleSelect.options[i].text === roleTxt || roleSelect.options[i].value === roleTxt) {
                                    roleSelect.selectedIndex = i;
                                    break;
                                }
                            }
                        }
                        
                        if (nameInput) {
                            const btnCreate = document.getElementById('btn-create-usr');
                            if (btnCreate) {
                                btnCreate.dataset.editId = btnEdit.getAttribute('data-id');
                                btnCreate.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
                            }
                            const formContainer = nameInput.closest('.card');
                            if (formContainer) {
                                formContainer.scrollIntoView({ behavior: 'smooth' });
                                formContainer.style.transition = 'border 0.3s ease, box-shadow 0.3s ease';
                                formContainer.style.border = '2px solid var(--brand-action)';
                                formContainer.style.boxShadow = '0 0 10px rgba(69, 220, 248, 0.3)';
                                setTimeout(() => { 
                                    formContainer.style.border = '1px solid var(--border-color)'; 
                                    formContainer.style.boxShadow = 'var(--shadow-sm)';
                                }, 1500);
                            }
                        }
                    } else {
                        alert('Función de edición habilitada. Haz los cambios en el formulario (Modo Demo).');
                    }
                }

                if (btnViewServices) {
                    const services = btnViewServices.getAttribute('data-services');
                    const tr = btnViewServices.closest('tr');
                    let name = 'Instructor';
                    let lastname = '';
                    
                    if (tr.cells.length >= 3) {
                        name = tr.cells[1].innerText.trim();
                        lastname = tr.cells[2].innerText.trim();
                    }

                    const servicesList = (services && services.trim()) ? services.split(',') : [];
                    const servicesHtml = servicesList.length > 0 
                        ? servicesList.map(s => `<li style="background: var(--bg-surface-hover); padding: 0.75rem 1rem; border-radius: 6px; font-weight: 500; border-left: 4px solid var(--brand-action);"><i class="fas fa-check-circle" style="color: var(--brand-success); margin-right: 0.5rem;"></i>${s.trim()}</li>`).join('')
                        : `<li style="background: var(--bg-surface-hover); padding: 0.75rem 1rem; border-radius: 6px; font-weight: 500; color: var(--text-secondary);">Ningún servicio habilitado</li>`;

                    const modalHtml = `
                        <div id="inst-services-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 99999; opacity: 0; transition: opacity 0.3s ease;">
                            <div style="background: var(--bg-surface); padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transform: translateY(-20px); transition: transform 0.3s ease;">
                                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                                    <h3 style="margin: 0; font-size: 1.25rem;">Servicios de Instructor</h3>
                                    <button id="close-inst-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-light)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
                                        ${name.charAt(0)}${lastname ? lastname.charAt(0) : ''}
                                    </div>
                                    <div>
                                        <h4 style="margin: 0; font-size: 1.1rem;">${name} ${lastname}</h4>
                                        <span style="font-size: 0.9rem; color: var(--text-secondary);">Instructor Activo</span>
                                    </div>
                                </div>
                                <div>
                                    <h5 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--text-secondary); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">Servicios Habilitados</h5>
                                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; max-height: 250px; overflow-y: auto;">
                                        ${servicesHtml}
                                    </ul>
                                </div>
                                <div style="margin-top: 2rem; text-align: right;">
                                    <button class="btn btn-primary" id="btn-ok-inst-modal" style="width: 100%;">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.insertAdjacentHTML('beforeend', modalHtml);
                    
                    const modal = document.getElementById('inst-services-modal');
                    const modalContent = modal.querySelector('div');
                    
                    // Animate in
                    setTimeout(() => {
                        modal.style.opacity = '1';
                        modalContent.style.transform = 'translateY(0)';
                    }, 10);
                    
                    const closeModal = () => {
                        modal.style.opacity = '0';
                        modalContent.style.transform = 'translateY(-20px)';
                        setTimeout(() => modal.remove(), 300);
                    };
                    
                    document.getElementById('close-inst-modal').addEventListener('click', closeModal);
                    document.getElementById('btn-ok-inst-modal').addEventListener('click', closeModal);
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) closeModal();
                    });
                }
            });
        });

        // =====================================
        // Save Prices Logic
        // =====================================
        document.getElementById('btn-save-prices').addEventListener('click', () => {
            // update global prices array
            const priceInputs = document.querySelectorAll('#valores-grid .price-input');
            const comisionInputs = document.querySelectorAll('#valores-grid .comision-input');
            window.AppData.maestroValores.forEach(item => {
                const pInput = Array.from(priceInputs).find(i => i.dataset.name === item.name);
                if (pInput) item.price = pInput.value.replace(/\./g, '');
                
                const cInput = Array.from(comisionInputs).find(i => i.dataset.name === item.name);
                if (cInput) item.comision = cInput.value.replace(/\./g, '');
            });
            if (window.saveAppData) window.saveAppData();
            alert('Precios Base Globales guardados con éxito.');
        });
        
        document.getElementById('btn-create-valor').addEventListener('click', () => {
            const newName = prompt('Nombre del nuevo ítem:');
            if (newName && newName.trim()) {
                window.AppData.maestroValores.push({ name: newName.trim(), price: '0', comision: '0' });
                if (window.saveAppData) window.saveAppData();
                renderValores();
            }
        });

        // =====================================
        // Dynamic Checklist Generation
        // =====================================
        const checklistContainer = document.getElementById('inst-services-checklist');
        const gridContainer = document.getElementById('valores-grid');

        // =====================================
        // Module Toggles Logic
        // =====================================
        function renderModulesToggles() {
            window.AppData.enabledModules = window.AppData.enabledModules || {};
            const modulesList = [
                { id: 'booking', name: 'Reservas y Booking' },
                { id: 'manifest', name: 'Manifiesto Operativo' },
                { id: 'fleet', name: 'Asignación de Flota' },
                { id: 'checkin', name: 'Check-In' },
                { id: 'finance', name: 'Caja Menor (Finanzas)' },
                { id: 'inventory', name: 'Inventario' },
                { id: 'hrms', name: 'Recursos Humanos' },
                { id: 'billing', name: 'Facturación' },
                { id: 'fids', name: 'Pantalla FIDS' },
                { id: 'passengerSearch', name: 'Búsqueda de Pasajeros' }
            ];

            const container = document.getElementById('modules-toggles-container');
            if (!container) return;
            container.innerHTML = '';
            
            modulesList.forEach(mod => {
                const isEnabled = window.AppData.enabledModules[mod.id] !== false; // true by default
                
                const card = document.createElement('div');
                card.style = 'background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;';
                card.innerHTML = `
                    <span style="font-weight: 500;">${mod.name}</span>
                    <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 24px;">
                        <input type="checkbox" data-mod="${mod.id}" ${isEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                        <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isEnabled ? 'var(--brand-success)' : '#ccc'}; transition: .4s; border-radius: 24px;">
                            <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${isEnabled ? '28px' : '3px'}; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                        </span>
                    </label>
                `;
                
                // Add event listener directly to the checkbox
                const checkbox = card.querySelector('input');
                const slider = card.querySelector('.slider');
                const knob = slider.querySelector('span');
                
                checkbox.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    window.AppData.enabledModules[mod.id] = checked;
                    slider.style.backgroundColor = checked ? 'var(--brand-success)' : '#ccc';
                    knob.style.left = checked ? '28px' : '3px';
                    if (window.saveAppData) window.saveAppData();
                });

                container.appendChild(card);
            });
        }
        
        function renderValores() {
            if (!window.AppData.maestroValores) {
                window.AppData.maestroValores = [
                    {name: 'Valor KG Extra', price: '5.000', comision: '0'}, {name: 'Salto Tandem', price: '1.500.000', comision: '0'},
                    {name: 'Fun Jumper', price: '0', comision: '0'}, {name: 'Copiloto', price: '0', comision: '0'},
                    {name: 'Salto AFF', price: '0', comision: '0'}, {name: 'Salto AFF 1', price: '0', comision: '0'}, {name: 'Salto AFF 2', price: '0', comision: '0'},
                    {name: 'Cámara Externa', price: '250.000', comision: '0'}, {name: 'Cámara Go-Pro', price: '100.000', comision: '0'},
                    {name: 'Cámara 360', price: '150.000', comision: '0'}, {name: 'Empaque Tandem', price: '0', comision: '0'}, {name: 'Empaque Escuela', price: '0', comision: '0'}, {name: 'Teoría AFF', price: '0', comision: '0'},
                    {name: 'Hora de Teoría', price: '0', comision: '0'}, {name: 'Coach', price: '0', comision: '0'}, {name: 'Curso de Empaque', price: '0', comision: '0'},
                    {name: 'Empaque de Reserva', price: '0', comision: '0'}, {name: 'Curso Control Cúpula', price: '0', comision: '0'},
                    {name: 'Acompañamiento Examen Licencia', price: '0', comision: '0'}, {name: 'Curso Aterrizajes en Agua', price: '0', comision: '0'},
                    {name: 'Alquiler de equipo', price: '0', comision: '0'}
                ];
            }
            
            let hasChanges = false;
            window.AppData.maestroValores.forEach(item => {
                if (item.name === 'Honorario Salto Tandem') {
                    item.name = 'Salto Tandem';
                    hasChanges = true;
                }
            });
            
            // Add Fun Jumper if missing
            const hasFunJumper = window.AppData.maestroValores.some(i => i.name === 'Fun Jumper');
            if (!hasFunJumper) {
                window.AppData.maestroValores.push({name: 'Fun Jumper', price: '0', comision: '0'});
                hasChanges = true;
            }
            // Add Copiloto if missing
            const hasCopiloto = window.AppData.maestroValores.some(i => i.name === 'Copiloto');
            if (!hasCopiloto) {
                window.AppData.maestroValores.push({name: 'Copiloto', price: '0', comision: '0'});
                hasChanges = true;
            }
            
            if (hasChanges && window.saveAppData) window.saveAppData();
            
            // Sort alphabetically
            window.AppData.maestroValores.sort((a, b) => a.name.localeCompare(b.name));
            
            if (gridContainer) {
                let html = '';
                window.AppData.maestroValores.forEach(item => {
                    const safeName = escapeHTML(item.name);
                    const formattedPrice = item.price ? parseInt(item.price.toString().replace(/\D/g, '') || 0).toLocaleString('es-CO') : '0';
                    const formattedComision = item.comision ? parseInt(item.comision.toString().replace(/\D/g, '') || 0).toLocaleString('es-CO') : '0';
                    html += `
                        <div class="form-group" style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.5rem;">
                            <label style="font-weight: 600; font-size: 1.05rem;">${safeName}</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div>
                                    <label style="font-size: 0.8rem; color: var(--text-secondary);">Precio Venta</label>
                                    <input type="text" class="form-control price-input money-input" data-name="${safeName}" value="${formattedPrice}">
                                </div>
                                <div>
                                    <label style="font-size: 0.8rem; color: var(--text-secondary);">Honorarios Staff</label>
                                    <input type="text" class="form-control comision-input money-input" data-name="${safeName}" value="${formattedComision}">
                                </div>
                            </div>
                        </div>
                    `;
                });
                gridContainer.innerHTML = html;
                
                // Re-attach currency formatting
                document.querySelectorAll('#valores-grid .money-input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        e.target.value = formatCurrency(e.target.value);
                    });
                });
            }
            
            if (checklistContainer) {
                
                let chkHtml = '';
                window.AppData.maestroValores.forEach(item => {
                    const safeName = escapeHTML(item.name);
                    chkHtml += `
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="${safeName}"> ${safeName}
                        </label>
                    `;
                });
                checklistContainer.innerHTML = chkHtml;

            }
        }
        
        renderValores();



        // =====================================
        // 2. Create Schedule
        // =====================================
        const btnCreateSch = document.getElementById('btn-create-sch');
        if (btnCreateSch) {
            btnCreateSch.addEventListener('click', () => {
                const time = document.getElementById('sch-time').value;
                const cap = document.getElementById('sch-cap').value;

                if (!time) return alert('La hora es obligatoria.');

                const tbody = document.getElementById('table-sch');
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                
                // Format time (e.g. 14:00 -> 02:00 PM)
                let hour = parseInt(time.split(':')[0]);
                let min = time.split(':')[1];
                let ampm = hour >= 12 ? 'PM' : 'AM';
                hour = hour % 12;
                hour = hour ? hour : 12;
                let timeStr = `${hour.toString().padStart(2, '0')}:${min} ${ampm}`;

                tr.innerHTML = `
                    <td style="padding: 1rem; font-weight: 600;">${timeStr}</td>
                    <td style="padding: 1rem;">${cap} cupos</td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit" style="color: var(--brand-action); padding: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" style="color: var(--brand-danger); padding: 0.25rem;"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);

                document.getElementById('sch-time').value = '';
                alert('Franja creada con éxito.');
            });
        }



        const usrPhotoInput = document.getElementById('usr-photo');
        if (usrPhotoInput) {
            usrPhotoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        usrPhotoInput.dataset.base64 = evt.target.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    usrPhotoInput.dataset.base64 = '';
                }
            });
        }
        
        // =====================================
        // 4. Create User
        // =====================================
        document.getElementById('btn-create-usr').addEventListener('click', (e) => {
            const name = document.getElementById('usr-name').value;
            const username = document.getElementById('usr-username').value;
            const role = document.getElementById('usr-role').value;
            const password = document.getElementById('usr-pass').value;
            const photoInput = document.getElementById('usr-photo');
            const photoData = photoInput ? photoInput.dataset.base64 : null;

            if (!name || !username) return alert('El nombre y usuario son obligatorios.');

            const btn = e.currentTarget;
            window.AppData.users = window.AppData.users || [];

            if (btn.dataset.editId) {
                const id = btn.dataset.editId;
                const user = window.AppData.users.find(u => u.id === id);
                if (user) {
                    user.name = name;
                    user.username = username;
                    user.role = role;
                    if (password) user.password = password;
                    if (photoData) user.photo = photoData;
                    alert('Usuario actualizado con éxito.');
                }
                delete btn.dataset.editId;
                btn.innerHTML = '<i class="fas fa-save"></i> Crear Usuario';
            } else {
                window.AppData.users.push({
                    id: 'usr_' + Date.now(),
                    name: name,
                    username: username,
                    role: role,
                    password: password || '1234',
                    photo: photoData || ''
                });
                alert('Usuario creado con éxito.');
            }

            if (window.saveAppData) window.saveAppData();
            if (window.renderUsersTable) window.renderUsersTable();

            document.getElementById('usr-name').value = '';
            document.getElementById('usr-username').value = '';
            document.getElementById('usr-role').selectedIndex = 0;
            document.getElementById('usr-pass').value = '';
            if (photoInput) {
                photoInput.value = '';
                photoInput.dataset.base64 = '';
            }
        });

        // =====================================
        // 5. Backup configuration
        // =====================================
        document.getElementById('btn-save-backup').addEventListener('click', () => {
            const email = document.getElementById('backup-email').value;
            if(!email) return alert('Por favor ingresa un correo electrónico.');
            alert('Configuración de Backup guardada exitosamente.');
        });

        document.getElementById('btn-force-backup').addEventListener('click', () => {
            alert('Generando copia de seguridad y enviando al correo configurado...');
        });

        // =====================================


        // =====================================
        // 6. Fechas NO Operación
        // =====================================
        window.AppData = window.AppData || {};
        window.AppData.noOpRules = window.AppData.noOpRules || {
            daysOfWeek: ['1', '2'], // Default: Monday(1), Tuesday(2) are closed
            specificDates: [],
            exceptions: []
        };

        const checkboxes = document.querySelectorAll('.noop-day');
        // Load checked days
        checkboxes.forEach(cb => {
            if (window.AppData.noOpRules.daysOfWeek.includes(cb.value)) {
                cb.checked = true;
            }
        });

        // Save Days
        document.getElementById('btn-save-noop-days').addEventListener('click', () => {
            const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
            window.AppData.noOpRules.daysOfWeek = selected;
            if (window.saveAppData) window.saveAppData();
            alert('Días de No Operación guardados exitosamente.');
        });

        // Load specific dates
        const tableDates = document.getElementById('table-noop-dates');
        function renderNoOpDates() {
            if (!tableDates) return;
            tableDates.innerHTML = '';
            window.AppData.noOpRules.specificDates.forEach((dateStr, idx) => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = `
                    <td style="padding: 0.75rem;">${dateStr}</td>
                    <td style="padding: 0.75rem; text-align: center;">
                        <button class="btn btn-delete-date" data-idx="${idx}" style="color: var(--brand-danger); padding: 0.25rem; background: none; border: none; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tableDates.appendChild(tr);
            });

            document.querySelectorAll('.btn-delete-date').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-idx');
                    window.AppData.noOpRules.specificDates.splice(idx, 1);
                    if (window.saveAppData) window.saveAppData();
                    renderNoOpDates();
                });
            });
        }
        renderNoOpDates();

        // Add Specific Date logic
        const dateInput = document.getElementById('noop-specific-date');
        const btnAddNoOpDate = document.getElementById('btn-add-noop-date');
        
        function handleAddDate() {
            const dateStr = dateInput.value;
            if(!dateStr) return alert('Selecciona una fecha válida.');
            
            if(!window.AppData.noOpRules.specificDates.includes(dateStr)) {
                window.AppData.noOpRules.specificDates.push(dateStr);
                // sort ascending
                window.AppData.noOpRules.specificDates.sort();
                if (window.saveAppData) window.saveAppData();
                renderNoOpDates();
                dateInput.value = '';
                alert('Fecha bloqueada exitosamente.');
            } else {
                alert('Esa fecha ya está bloqueada.');
                dateInput.value = '';
            }
        }

        if (btnAddNoOpDate) {
            btnAddNoOpDate.addEventListener('click', handleAddDate);
        }

        // =====================================
        // Aeronaves Logic
        // =====================================
        
        window.AppData.aeronaves = window.AppData.aeronaves || [];
        const tablePlane = document.getElementById('table-plane');
        const btnCreatePlane = document.getElementById('btn-create-plane');
        let editingPlaneId = null;

        function renderAeronaves() {
            tablePlane.innerHTML = '';
            if (window.AppData.aeronaves.length === 0) {
                tablePlane.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1rem; color: var(--text-secondary);">No hay aeronaves registradas</td></tr>';
                return;
            }

            let planeHtml = '';
            window.AppData.aeronaves.forEach(a => {
                let statusColor = 'var(--text-primary)';
                if(a.estado === 'Operativa') statusColor = 'var(--brand-success)';
                if(a.estado === 'AOG') statusColor = 'var(--brand-warning)';
                if(a.estado === 'No operativa') statusColor = 'var(--brand-danger)';
                
                planeHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 1rem; font-weight: 600;">${escapeHTML(a.matricula)}</td>
                    <td style="padding: 1rem;">${escapeHTML(a.modelo)}</td>
                    <td style="padding: 1rem;">FJ: ${escapeHTML(a.capFun)} | T: ${escapeHTML(a.capTan)} | C: ${escapeHTML(a.capCop || 0)}</td>
                    <td style="padding: 1rem; font-weight: 600;">
                        <select class="form-control plane-inline-status" data-id="${escapeHTML(a.id)}" style="color: ${statusColor}; border-color: var(--border-color); background: var(--bg-surface); font-weight: bold; width: auto; display: inline-block; padding: 0.25rem 0.5rem;">
                            <option value="Operativa" ${a.estado === 'Operativa' ? 'selected' : ''} style="color: var(--brand-success);">Operativa</option>
                            <option value="AOG" ${a.estado === 'AOG' ? 'selected' : ''} style="color: var(--brand-warning);">AOG (Mantenimiento)</option>
                            <option value="No operativa" ${a.estado === 'No operativa' ? 'selected' : ''} style="color: var(--brand-danger);">No operativa</option>
                        </select>
                    </td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit-plane" data-id="${escapeHTML(a.id)}" style="padding: 0.25rem 0.5rem; margin-right: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete-plane" data-id="${escapeHTML(a.id)}" style="color: var(--brand-danger); padding: 0.25rem 0.5rem;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            });
            tablePlane.innerHTML = planeHtml;


            document.querySelectorAll('.btn-delete-plane').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    if (confirm('¿Seguro que deseas eliminar esta aeronave?')) {
                        window.AppData.aeronaves = window.AppData.aeronaves.filter(a => a.id !== id);
                        if (window.saveAppData) window.saveAppData();
                        renderAeronaves();
                    }
                });
            });

            document.querySelectorAll('.btn-edit-plane').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const plane = window.AppData.aeronaves.find(a => a.id === id);
                    if(plane) {
                        editingPlaneId = id;
                        document.getElementById('plane-model').value = plane.modelo || '';
                        document.getElementById('plane-reg').value = plane.matricula || '';
                        document.getElementById('plane-cap-fun').value = plane.capFun || 0;
                        document.getElementById('plane-cap-tan').value = plane.capTan || 0;
                        document.getElementById('plane-cap-cop').value = plane.capCop || 0;
                        document.getElementById('plane-status').value = plane.estado || 'Operativa';
                        
                        btnCreatePlane.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
                        
                        // Scroll up to form
                        document.getElementById('content-aeronaves').scrollIntoView({behavior: 'smooth'});
                    }
                });
            });

            document.querySelectorAll('.plane-inline-status').forEach(select => {
                select.addEventListener('change', (e) => {
                    const id = e.target.getAttribute('data-id');
                    const newState = e.target.value;
                    const plane = window.AppData.aeronaves.find(a => a.id === id);
                    if (plane && plane.estado !== newState) {
                        if (newState === 'AOG' || newState === 'No operativa') {
                            const today = new Date().toLocaleDateString('en-CA');
                            const flightsToDelete = (window.AppData.asignacionFlota || []).filter(f => f.id_aeronave === plane.id && f.fecha >= today);
                            if (flightsToDelete.length > 0) {
                                if (confirm(`Atención: Hay ${flightsToDelete.length} vuelos programados a partir de hoy para esta aeronave. Si continúas, se eliminarán. ¿Deseas continuar y cambiar el estado a ${newState}?`)) {
                                    window.AppData.asignacionFlota = (window.AppData.asignacionFlota || []).filter(f => !(f.id_aeronave === plane.id && f.fecha >= today));
                                } else {
                                    e.target.value = plane.estado; // Revertir visualmente
                                    return; // Cancelar cambio
                                }
                            }
                        }
                        plane.estado = newState;
                        if (window.saveAppData) window.saveAppData();
                        renderAeronaves();
                    }
                });
            });
        }

        renderAeronaves();

        btnCreatePlane.addEventListener('click', () => {
            const model = document.getElementById('plane-model').value.trim();
            const reg = document.getElementById('plane-reg').value.trim();
            const capFun = parseInt(document.getElementById('plane-cap-fun').value);
            const capTan = parseInt(document.getElementById('plane-cap-tan').value);
            const capCop = parseInt(document.getElementById('plane-cap-cop').value);
            const status = document.getElementById('plane-status').value;

            if (!model || !reg) {
                return alert('Modelo y Matrícula son obligatorios.');
            }

            if (editingPlaneId) {
                const plane = window.AppData.aeronaves.find(a => a.id === editingPlaneId);
                if(plane) {
                    const statusChanged = plane.estado !== status;
                    if (statusChanged && (status === 'AOG' || status === 'No operativa')) {
                        const today = new Date().toLocaleDateString('en-CA');
                        const flightsToDelete = (window.AppData.asignacionFlota || []).filter(f => f.id_aeronave === plane.id && f.fecha >= today);
                        if (flightsToDelete.length > 0) {
                            if (confirm(`Atención: Hay ${flightsToDelete.length} vuelos programados a partir de hoy para esta aeronave. Si continúas, se eliminarán. ¿Deseas continuar y cambiar el estado a ${status}?`)) {
                                window.AppData.asignacionFlota = (window.AppData.asignacionFlota || []).filter(f => !(f.id_aeronave === plane.id && f.fecha >= today));
                            } else {
                                return; // Cancelar guardado
                            }
                        }
                    }
                    
                    plane.modelo = model;
                    plane.matricula = reg;
                    plane.capFun = capFun || 0;
                    plane.capTan = capTan || 0;
                    plane.capCop = capCop || 0;
                    plane.estado = status;
                }
                editingPlaneId = null;
                btnCreatePlane.innerHTML = '<i class="fas fa-plane"></i> Crear Aeronave';
            } else {
                window.AppData.aeronaves.push({
                    id: 'a_' + Date.now(),
                    modelo: model,
                    matricula: reg,
                    capFun: capFun || 0,
                    capTan: capTan || 0,
                    capCop: capCop || 0,
                    estado: status
                });
            }
            
            if (window.saveAppData) window.saveAppData();

            document.getElementById('plane-model').value = '';
            document.getElementById('plane-reg').value = '';
            document.getElementById('plane-cap-fun').value = '10';
            document.getElementById('plane-cap-tan').value = '5';
            document.getElementById('plane-cap-cop').value = '0';
            document.getElementById('plane-status').value = 'Operativa';

            renderAeronaves();
        });


        // ==============================================
        // Logic: Documentos Legales
        // ==============================================
        window.AppData.legalDocs = window.AppData.legalDocs || {
            bienvenida_es: [], bienvenida_en: [],
            terminos_es: [], terminos_en: [],
            ficha_es: [], ficha_en: [],
            exoneracion_es: [], exoneracion_en: []
        };

        const docsMeta = [
            { id: 'bienvenida_es', name: 'Gu&iacute;a de Bienvenida (ES)' },
            { id: 'bienvenida_en', name: 'Welcome Guide (EN)' },
            { id: 'terminos_es', name: 'T&eacute;rminos y Condiciones (ES)' },
            { id: 'terminos_en', name: 'Terms and Conditions (EN)' },
            { id: 'ficha_es', name: 'Ficha Informativa (ES)' },
            { id: 'ficha_en', name: 'Information Sheet (EN)' },
            { id: 'exoneracion_es', name: 'Exoneraci&oacute;n de Responsabilidad (ES)' },
            { id: 'exoneracion_en', name: 'Liability Waiver (EN)' }
        ];

        function renderDocs() {
            const grid = document.getElementById('docs-grid');
            if (!grid) return;
            
            grid.innerHTML = docsMeta.map(meta => {
                const versions = window.AppData.legalDocs[meta.id] || [];
                const latest = versions[versions.length - 1];
                const historyList = versions.slice().reverse().map(v => 
                    `<div style="font-size: 0.85rem; display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                        <span>v${v.version} - ${new Date(v.date).toLocaleString()}</span>
                        ${v.version === (latest ? latest.version : -1) ? '<span style="color: var(--brand-success); font-weight: bold;">(Actual)</span>' : '<span style="color: var(--text-secondary);">Antigua</span>'}
                    </div>`
                ).join('');

                return `
                <div class="card" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h4 style="margin: 0; color: var(--brand-primary);">${meta.name}</h4>
                        ${latest ? `<span style="background: var(--brand-success); color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">v${latest.version}</span>` : `<span style="background: var(--border-color); color: var(--text-secondary); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">Sin cargar</span>`}
                    </div>
                    <div style="flex: 1; background: var(--bg-surface-hover); border-radius: 4px; padding: 1rem; max-height: 150px; overflow-y: auto;">
                        <h5 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 0.9rem;">Historial de versiones:</h5>
                        ${historyList || '<div style="color: var(--text-secondary); font-size: 0.85rem;">No hay versiones registradas.</div>'}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="file" id="file_${meta.id}" accept=".pdf" style="display: none;" onchange="uploadDoc(this, '${meta.id}')">
                        <button class="btn btn-primary" style="flex: 1;" onclick="document.getElementById('file_${meta.id}').click()"><i class="fas fa-upload"></i> Subir Nueva Versi&oacute;n</button>
                    </div>
                </div>`;
            }).join('');
        }

        window.uploadDoc = function(inputEl, metaId) {
            if (!inputEl.files || inputEl.files.length === 0) return;
            const file = inputEl.files[0];
            if (file.type !== 'application/pdf') {
                alert('Solo se permiten archivos PDF.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                const arr = window.AppData.legalDocs[metaId] || [];
                const newVersion = arr.length > 0 ? arr[arr.length - 1].version + 1 : 1;
                arr.push({
                    version: newVersion,
                    date: new Date().toISOString(),
                    filename: file.name,
                    dataUrl: dataUrl
                });
                window.AppData.legalDocs[metaId] = arr;
                if (window.saveAppData) window.saveAppData();
                renderDocs();
                alert('Documento actualizado correctamente a la versi&oacute;n ' + newVersion);
            };
            reader.readAsDataURL(file);
        };

        renderDocs();

        // ==========================================
        // Lógica de Maestro Productos Tienda
        // ==========================================
        function renderStoreProducts() {
            const grid = document.getElementById('store-products-grid');
            if (!grid) return;
            
            const products = window.AppData.storeProducts || [];
            
            if (products.length === 0) {
                grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1;">No hay productos creados.</p>';
                return;
            }
            
            const fmt = (val) => '$' + parseInt(val).toLocaleString('es-CO');
            
            grid.innerHTML = products.map(p => `
                <div class="card" style="display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid var(--border-color);">
                    <div style="height: 120px; background: #eee; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 4px;">
                        ${p.image ? `<img src="${p.image}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-image" style="font-size: 2rem; color: #ccc;"></i>'}
                    </div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-primary); margin-top: 0.5rem;">${p.name}</div>
                    ${p.barcode ? `<div style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fas fa-barcode"></i> ${p.barcode}</div>` : ''}
                    <div style="color: var(--brand-success); font-size: 1.2rem; margin-bottom: 0.5rem; font-weight: 600;">${fmt(p.price)}</div>
                    <button class="btn btn-sm btn-delete-store-product" data-id="${p.id}" style="background: var(--brand-danger); color: white;"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            `).join('');
            
            document.querySelectorAll('.btn-delete-store-product').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (confirm('¿Seguro que deseas eliminar este producto?')) {
                        const id = e.currentTarget.getAttribute('data-id');
                        window.AppData.storeProducts = window.AppData.storeProducts.filter(x => x.id !== id);
                        if (window.saveAppData) window.saveAppData();
                        renderStoreProducts();
                    }
                });
            });
        }

        const btnCreateProduct = document.getElementById('btn-create-store-product');
        if (btnCreateProduct) {
            btnCreateProduct.addEventListener('click', () => {
                const modalHtml = `
                <div id="storeProductModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10000; animation: fadeIn 0.2s;">
                    <div style="background: var(--bg-card, #ffffff); padding: 2rem; border-radius: 12px; width: 450px; max-width: 90%; box-shadow: 0 20px 40px rgba(0,0,0,0.3); color: var(--text-primary);">
                        <h3 style="margin-top: 0; font-size: 1.25rem;"><i class="fas fa-box-open" style="color: #8b5cf6; margin-right: 0.5rem;"></i> Crear Producto Tienda</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nombre del Producto <span style="color: #ef4444;">*</span></label>
                            <input type="text" id="sp-name" class="form-control" placeholder="Ej: Camiseta FRATERNO">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Código de Barra</label>
                            <input type="text" id="sp-barcode" class="form-control" placeholder="Opcional">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Valor / Precio <span style="color: #ef4444;">*</span></label>
                            <input type="text" id="sp-price" class="form-control" placeholder="Ej: 50.000">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Foto (Opcional)</label>
                            <input type="file" id="sp-photo" class="form-control" accept="image/*" style="padding: 0.5rem;">
                        </div>
                        
                        <div style="display: flex; justify-content: flex-end; gap: 1rem;">
                            <button id="sp-cancel" class="btn btn-secondary">Cancelar</button>
                            <button id="sp-save" class="btn btn-primary" style="background: #8b5cf6; border-color: #8b5cf6;">Guardar</button>
                        </div>
                    </div>
                </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                const modal = document.getElementById('storeProductModal');
                
                const spPriceInput = document.getElementById('sp-price');
                spPriceInput.addEventListener('input', (e) => {
                    e.target.value = formatCurrency(e.target.value);
                });
                
                document.getElementById('sp-cancel').addEventListener('click', () => {
                    modal.remove();
                });
                
                document.getElementById('sp-save').addEventListener('click', () => {
                    const name = document.getElementById('sp-name').value.trim();
                    const barcode = document.getElementById('sp-barcode').value.trim();
                    const price = parseFloat(document.getElementById('sp-price').value.replace(/\D/g, ''));
                    const photoInput = document.getElementById('sp-photo');
                    
                    if (!name || isNaN(price)) {
                        alert('Por favor, ingresa el nombre y el valor del producto.');
                        return;
                    }
                    
                    if (photoInput.files && photoInput.files[0]) {
                        const reader = new FileReader();
                        reader.onload = e => {
                            saveProduct(name, barcode, price, e.target.result);
                            modal.remove();
                        };
                        reader.readAsDataURL(photoInput.files[0]);
                    } else {
                        saveProduct(name, barcode, price, null);
                        modal.remove();
                    }
                });
            });
        }
        
        function saveProduct(name, barcode, price, imageBase64) {
            window.AppData.storeProducts = window.AppData.storeProducts || [];
            window.AppData.storeProducts.push({
                id: 'prod_' + Date.now(),
                name: name,
                barcode: barcode || null,
                price: parseFloat(price),
                image: imageBase64
            });
            if (window.saveAppData) window.saveAppData();
            renderStoreProducts();
        }

        renderStoreProducts();

    }
}
