window.Modules = window.Modules || {};

window.Modules.hrms = {
    render: (container) => {
        container.innerHTML = `
            <div class="hrms-module" style="display: flex; flex-direction: column; height: 100%; gap: 1rem;">
                <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-light)); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                            <i class="fas fa-users"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; color: var(--text-primary);">Directorio Corporativo & RRHH</h2>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Gestiona instructores, pilotos y personal administrativo</p>
                        </div>
                    </div>
                    <button class="btn btn-primary" id="btn-new-emp" style="padding: 0.75rem 1.5rem;"><i class="fas fa-user-plus"></i> Nuevo Miembro</button>
                </div>
                
                <div style="display: flex; flex: 1; gap: 1.5rem; overflow: hidden; flex-wrap: wrap;">
                    
                    <!-- Directorio -->
                    <div class="card" style="flex: 2; display: flex; flex-direction: column; min-width: 350px;">
                        <h3 style="margin-top: 0; margin-bottom: 1rem;">Directorio de Personal</h3>
                        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                            <input type="text" id="emp-search" class="form-control" placeholder="Buscar por nombre o rol..." style="flex: 1;">
                            <select id="emp-filter-role" class="form-control" style="width: auto;">
                                <option value="ALL">Todos los Roles</option>
                                <option value="Admin">Administrativos</option>
                                <option value="Camara Flyer">Camara Flyer</option>
                                <option value="Coach">Coach</option>
                                <option value="Empacador">Empacadores</option>
                                <option value="Instructor AFF">Instructor AFF</option>
                                <option value="Instructor Tandem">Instructor Tandem</option>
                                <option value="Piloto">Pilotos</option>
                                <option value="Rigger">Rigger</option>
                                <option value="S&TA">S&TA</option>
                                <option value="Tierra">Tierra / Ventas</option>
                            </select>
                        </div>
                        <div id="emp-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem; overflow-y: auto; padding-right: 0.5rem;">
                            <!-- Injected dynamically -->
                        </div>
                    </div>
                    
                    <!-- Reloj Checador -->
                    <div class="card" style="flex: 1; min-width: 300px; display: flex; flex-direction: column;">
                        <h3 style="margin-top: 0;"><i class="fas fa-clock" style="color: var(--brand-action);"></i> Reloj Checador</h3>
                        <p style="color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.5rem;">Selecciona tu nombre para registrar tu turno de hoy.</p>
                        
                        <div class="form-group">
                            <label>Empleado</label>
                            <select id="clock-emp-select" class="form-control"></select>
                        </div>
                        
                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                            <button class="btn btn-success" id="btn-clock-in" style="flex: 1; padding: 1rem; font-size: 1.1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-sign-in-alt" style="font-size: 1.5rem;"></i> ENTRADA
                            </button>
                            <button class="btn btn-danger" id="btn-clock-out" style="flex: 1; padding: 1rem; font-size: 1.1rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;">
                                <i class="fas fa-sign-out-alt" style="font-size: 1.5rem;"></i> SALIDA
                            </button>
                        </div>
                        
                        <h4 style="margin-top: 1rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-color);">Registros de Hoy</h4>
                        <div id="clock-logs" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 0.5rem;">
                            <!-- Injected dynamically -->
                        </div>
                    </div>

                </div>
            </div>

            <!-- Modal for New Employee -->
            <div id="modal-emp" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 450px; max-width: 90%; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="close-emp-modal" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-user-plus" style="color: var(--brand-action);"></i> Registrar Miembro</h3>
                    <div style="max-height: 75vh; overflow-y: auto; padding-right: 0.5rem;">
                        <input type="hidden" id="emp-id">
                        
                        <!-- Foto -->
                        <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 1.5rem;">
                            <label for="emp-photo" style="cursor: pointer; position: relative;">
                                <div id="emp-photo-preview" style="width: 100px; height: 100px; border-radius: 50%; background: var(--bg-surface-hover); border: 2px dashed var(--border-color); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                    <i class="fas fa-camera" style="font-size: 2rem; color: var(--text-secondary);"></i>
                                </div>
                                <div style="position: absolute; bottom: 0; right: 0; background: var(--brand-action); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">
                                    <i class="fas fa-plus"></i>
                                </div>
                            </label>
                            <input type="file" id="emp-photo" accept="image/*" style="display: none;">
                            <small style="color: var(--text-secondary); margin-top: 0.5rem;">Haz clic para foto</small>
                        </div>

                        <!-- Nombre y Apellido -->
                        <div style="display: flex; gap: 1rem;">
                            <div class="form-group" style="flex: 1;">
                                <label>Nombre(s)</label>
                                <input type="text" id="emp-name" class="form-control" placeholder="Ej. Juan">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label>Apellido(s)</label>
                                <input type="text" id="emp-lastname" class="form-control" placeholder="Ej. Pérez">
                            </div>
                        </div>
                        
                        <!-- Contacto -->
                        <div style="display: flex; gap: 1rem;">
                            <div class="form-group" style="flex: 1;">
                                <label>Documento</label>
                                <input type="text" id="emp-doc" class="form-control" placeholder="Ej. 10203040">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label>Teléfono</label>
                                <input type="text" id="emp-phone" class="form-control" placeholder="Ej. 3001234567">
                            </div>
                        </div>

                        <div style="display: flex; gap: 1rem;">
                            <div class="form-group" style="flex: 1;">
                                <label>Fecha de Nacimiento</label>
                                <input type="date" id="emp-dob" class="form-control">
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label>Correo Electrónico</label>
                                <input type="email" id="emp-email" class="form-control" placeholder="Ej. juan@correo.com">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Rol / Cargo</label>
                            <select id="emp-role" class="form-control">
                                <option value="Admin">Administrativo</option>
                                <option value="Camara Flyer">Camara Flyer</option>
                                <option value="Coach">Coach</option>
                                <option value="Empacador">Empacador</option>
                                <option value="Instructor AFF">Instructor AFF</option>
                                <option value="Instructor Tandem">Instructor Tandem</option>
                                <option value="Piloto">Piloto</option>
                                <option value="Rigger">Rigger</option>
                                <option value="S&TA">S&TA</option>
                                <option value="Tierra">Tierra / Ventas</option>
                            </select>
                        </div>
                        
                        <div id="licencia-container" class="form-group" style="display: block;">
                            <label style="display: flex; justify-content: space-between; align-items: center;">
                                Licencias
                                <button type="button" id="btn-add-licencia" style="background: var(--brand-action); color: white; border: none; border-radius: 4px; padding: 0.2rem 0.5rem; font-size: 0.8rem; cursor: pointer;"><i class="fas fa-plus"></i> Añadir</button>
                            </label>
                            <div id="dynamic-licencias" style="display: flex; flex-direction: column; gap: 0.5rem; margin-top: 0.5rem;">
                                <!-- Licencias injectadas -->
                            </div>
                            <small style="color: var(--text-secondary); display: block; margin-top: 0.5rem;">Obligatorio para Pilotos e Instructores.</small>
                        </div>

                    <div id="comisiones-container" class="form-group" style="display: none; max-height: 150px; overflow-y: auto; background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                        <label style="margin-bottom: 0.5rem; display: block;">Conceptos a Comisionar</label>
                        <div id="comisiones-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <!-- Checkboxes dynamically populated -->
                        </div>
                    </div>

                    </div> <!-- end scrollable area -->
                    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-outline" id="btn-cancel-emp">Cancelar</button>
                        <button class="btn btn-primary" id="btn-save-emp"><i class="fas fa-save"></i> Guardar Empleado</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    init: () => {
        function escapeHTML(str) {
            if (str == null) return '';
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
        window.AppData = window.AppData || {};
        window.AppData.employees = window.AppData.employees || [];
        window.AppData.timeTracking = window.AppData.timeTracking || [];
        
        const empList = document.getElementById('emp-list');
        const searchInput = document.getElementById('emp-search');
        const roleFilter = document.getElementById('emp-filter-role');
        const clockSelect = document.getElementById('clock-emp-select');
        const clockLogs = document.getElementById('clock-logs');

        function getRoleColor(role) {
            switch(role) {
                case 'Piloto': return '#1a73e8'; // blue
                case 'Instructor AFF': return '#d93025'; // red
                case 'Instructor Tandem': return '#d93025'; // red
                case 'Coach': return '#00acc1'; // cyan
                case 'Camara Flyer': return '#e37400'; // orange
                case 'Rigger': return '#0d9488'; // teal
                case 'S&TA': return '#3949ab'; // indigo
                case 'Empacador': return '#8e24aa'; // purple
                case 'Tierra': return '#1e8e3e'; // green
                case 'Admin': return '#5f6368'; // gray
                default: return '#1a73e8';
            }
        }

        function getRoleIcon(role) {
            switch(role) {
                case 'Piloto': return 'fa-plane';
                case 'Instructor AFF': return 'fa-parachute-box';
                case 'Instructor Tandem': return 'fa-parachute-box';
                case 'Coach': return 'fa-chalkboard-teacher';
                case 'Camara Flyer': return 'fa-camera';
                case 'Rigger': return 'fa-tools';
                case 'S&TA': return 'fa-shield-alt';
                case 'Empacador': return 'fa-box';
                case 'Tierra': return 'fa-headset';
                case 'Admin': return 'fa-user-tie';
                default: return 'fa-user';
            }
        }

        function renderEmployees() {
            empList.innerHTML = '';
            clockSelect.innerHTML = '<option value="">-- Selecciona tu nombre --</option>';
            
            const term = searchInput.value.toLowerCase();
            const filter = roleFilter.value;
            
            // Sort alphabetically
            const sorted = [...window.AppData.employees].sort((a,b) => a.name.localeCompare(b.name));

            sorted.forEach((emp, idx) => {
                // Popolate clock select
                clockSelect.innerHTML += `<option value="${escapeHTML(emp.id)}">${escapeHTML(emp.name)} (${escapeHTML(emp.role)})</option>`;

                // Filtering
                if (filter !== 'ALL' && emp.role !== filter) return;
                if (term && !emp.name.toLowerCase().includes(term) && !emp.role.toLowerCase().includes(term)) return;

                const color = getRoleColor(emp.role);
                const icon = getRoleIcon(emp.role);

                const card = document.createElement('div');
                card.style.background = 'var(--bg-main)';
                card.style.border = '1px solid var(--border-color)';
                card.style.borderRadius = '12px';
                card.style.padding = '1rem';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.gap = '0.5rem';
                card.style.position = 'relative';
                
                let avatarHtml = `<div style="width: 48px; height: 48px; border-radius: 50%; background: ${color}20; color: ${color}; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                    <i class="fas ${icon}"></i>
                                  </div>`;
                if (emp.photoUrl) {
                    avatarHtml = `<img src="${emp.photoUrl}" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid ${color};">`;
                }
                
                let fullName = emp.name;
                if (emp.lastname) fullName += ' ' + emp.lastname;

                let licHtml = '';
                if (emp.licencias && emp.licencias.length > 0) {
                    licHtml = `<div><i class="fas fa-id-badge" style="width: 20px;"></i> ${escapeHTML(emp.licencias.join(', '))}</div>`;
                } else if (emp.licencia) {
                    licHtml = `<div><i class="fas fa-id-badge" style="width: 20px;"></i> ${escapeHTML(emp.licencia)}</div>`; // fallback
                }

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            ${avatarHtml}
                            <div>
                                <h4 style="margin: 0; font-size: 1.05rem;">${escapeHTML(fullName)}</h4>
                                <span style="font-size: 0.8rem; background: ${color}20; color: ${color}; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 600; display: inline-block; margin-top: 0.25rem;">${escapeHTML(emp.role)}</span>
                            </div>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn btn-edit-emp" data-id="${escapeHTML(emp.id)}" style="background: none; border: none; color: var(--brand-action); cursor: pointer; padding: 0.25rem;"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-delete-emp" data-id="${escapeHTML(emp.id)}" style="background: none; border: none; color: var(--brand-danger); cursor: pointer; padding: 0.25rem;"><i class="fas fa-trash"></i></button>
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 0.25rem; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.5rem; background: var(--bg-surface-hover); padding: 0.75rem; border-radius: 8px;">
                        <div><i class="fas fa-id-card" style="width: 20px;"></i> ${escapeHTML(emp.doc || "N/A")}</div>
                        ${emp.dob ? `<div><i class="fas fa-birthday-cake" style="width: 20px;"></i> ${escapeHTML(emp.dob)}</div>` : ""}
                        ${emp.phone ? `<div><i class="fas fa-phone" style="width: 20px;"></i> ${escapeHTML(emp.phone)}</div>` : ""}
                        ${emp.email ? `<div><i class="fas fa-envelope" style="width: 20px;"></i> ${escapeHTML(emp.email)}</div>` : ""}
                        ${licHtml}
                    </div>
                `;
                empList.appendChild(card);
            });

            // Delete listeners
            document.querySelectorAll('.btn-delete-emp').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const ok = window.showConfirm ? await window.showConfirm('¿Deseas eliminar a este miembro del personal?', { title: 'Eliminar Miembro', type: 'danger' }) : confirm('¿Deseas eliminar a este miembro del personal?');
                    if (ok) {
                        window.AppData.employees = window.AppData.employees.filter(emp => emp.id !== id);
                        if(window.saveAppData) window.saveAppData();
                        renderEmployees();
                    }
                });
            });

            document.querySelectorAll('.btn-edit-emp').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const emp = window.AppData.employees.find(x => x.id === id);
                    if (emp) {
                        document.getElementById('emp-id').value = emp.id;
                        document.getElementById('emp-name').value = emp.name || '';
                        document.getElementById('emp-lastname').value = emp.lastname || '';
                        document.getElementById('emp-doc').value = emp.doc || '';
                        document.getElementById('emp-phone').value = emp.phone || '';
                        document.getElementById('emp-dob').value = emp.dob || '';
                        document.getElementById('emp-email').value = emp.email || '';
                        document.getElementById('emp-role').value = emp.role;
                        
                        // Photo
                        const preview = document.getElementById('emp-photo-preview');
                        if (emp.photoUrl) {
                            preview.innerHTML = `<img src="${emp.photoUrl}" style="width:100%;height:100%;object-fit:cover;">`;
                            preview.dataset.url = emp.photoUrl;
                        } else {
                            preview.innerHTML = `<i class="fas fa-camera" style="font-size: 2rem; color: var(--text-secondary);"></i>`;
                            delete preview.dataset.url;
                        }
                        
                        document.getElementById('emp-role').dispatchEvent(new Event('change'));
                        
                        ensureComisionesPopulated();
                        
                        // Set checkboxes
                        document.querySelectorAll('.comision-chk').forEach(chk => {
                            chk.checked = (emp.comisiones || []).includes(chk.value);
                        });
                        
                        // Render licenses
                        renderDynamicLicenses(emp.licencias || (emp.licencia ? [emp.licencia] : []));

                        const modal = document.getElementById('modal-emp');
                        modal.style.display = 'flex';
                        void modal.offsetWidth;
                        modal.style.opacity = '1';
                        modal.querySelector('.modal-content').style.transform = 'translateY(0)';
                    }
                });
            });
        }

        searchInput.addEventListener('input', renderEmployees);
        roleFilter.addEventListener('change', renderEmployees);

        // =======================
        // Reloj Checador Logic
        // =======================
        function renderClockLogs() {
            clockLogs.innerHTML = '';
            const todayStr = new Date().toLocaleDateString('en-CA');
            const logsToday = window.AppData.timeTracking.filter(l => l.date === todayStr);
            
            if (logsToday.length === 0) {
                clockLogs.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 1rem;">No hay registros hoy.</div>';
                return;
            }

            // Sort by time descending
            logsToday.sort((a,b) => b.time.localeCompare(a.time));

            logsToday.forEach(log => {
                const emp = window.AppData.employees.find(e => e.id === log.empId) || {name: 'Desconocido'};
                const isEntry = log.type === 'in';
                const color = isEntry ? 'var(--brand-success)' : 'var(--brand-danger)';
                const icon = isEntry ? 'fa-sign-in-alt' : 'fa-sign-out-alt';
                
                const item = document.createElement('div');
                item.style.display = 'flex';
                item.style.justifyContent = 'space-between';
                item.style.alignItems = 'center';
                item.style.background = 'var(--bg-surface-hover)';
                item.style.padding = '0.75rem';
                item.style.borderRadius = '8px';
                
                item.innerHTML = `
                    <div style="display: flex; gap: 0.75rem; align-items: center;">
                        <i class="fas ${icon}" style="color: ${color};"></i>
                        <div>
                            <div style="font-weight: 500;">${escapeHTML(emp.name)}</div>
                            <div style="font-size: 0.75rem; color: var(--text-secondary);">${isEntry ? 'Entrada' : 'Salida'}</div>
                        </div>
                    </div>
                    <div style="font-weight: 600;">${log.time}</div>
                `;
                clockLogs.appendChild(item);
            });
        }

        function handleClock(type) {
            const empId = clockSelect.value;
            if(!empId) return alert('Por favor, selecciona tu nombre primero.');
            
            const now = new Date();
            const dateStr = now.toLocaleDateString('en-CA');
            const timeStr = now.toLocaleTimeString('es-CO', {hour: '2-digit', minute:'2-digit'});
            
            window.AppData.timeTracking.push({
                id: 'log_' + Date.now(),
                empId,
                date: dateStr,
                time: timeStr,
                type // 'in' or 'out'
            });
            if(window.saveAppData) window.saveAppData();
            renderClockLogs();
            clockSelect.value = ''; // reset
            alert(type === 'in' ? '¡Entrada registrada!' : '¡Salida registrada!');
        }

        document.getElementById('btn-clock-in').addEventListener('click', () => handleClock('in'));
        document.getElementById('btn-clock-out').addEventListener('click', () => handleClock('out'));

        // =======================
        // Dynamic Licenses & Comisiones Logic
        // =======================
        
        function ensureComisionesPopulated() {
            const comList = document.getElementById('comisiones-list');
            if (comList.children.length === 0) {
                const maestro = window.AppData.maestroValores || [];
                maestro.forEach(val => {
                    comList.innerHTML += `
                        <label style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer;">
                            <input type="checkbox" class="comision-chk" value="${val.name}" style="accent-color: var(--brand-action);"> ${val.name}
                        </label>
                    `;
                });
            }
        }

        const dynLicencias = document.getElementById('dynamic-licencias');
        function renderDynamicLicenses(licsArray = []) {
            dynLicencias.innerHTML = '';
            if (licsArray.length === 0) licsArray.push(''); // 1 empty field by default
            licsArray.forEach(lic => addLicenseField(lic));
        }
        
        function addLicenseField(val = '') {
            const div = document.createElement('div');
            div.style.display = 'flex';
            div.style.gap = '0.5rem';
            div.innerHTML = `
                <input type="text" class="form-control emp-lic-input" placeholder="Ej. PTL-001" value="${val}" style="flex: 1;">
                <button type="button" class="btn btn-danger btn-rem-licencia" style="padding: 0 0.5rem;"><i class="fas fa-trash"></i></button>
            `;
            dynLicencias.appendChild(div);
            
            div.querySelector('.btn-rem-licencia').addEventListener('click', () => {
                if(dynLicencias.children.length > 1) {
                    div.remove();
                } else {
                    div.querySelector('input').value = ''; // Just clear if it's the last one
                }
            });
        }
        
        document.getElementById('btn-add-licencia').addEventListener('click', () => {
            addLicenseField('');
        });

        // Photo Upload Logic
        document.getElementById('emp-photo').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (ev) => {
                const preview = document.getElementById('emp-photo-preview');
                preview.innerHTML = `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;">`;
                preview.dataset.url = ev.target.result;
            };
            reader.readAsDataURL(file);
        });

        // =======================
        // Modal Logic
        // =======================
        const roleSelectGlobal = document.getElementById('emp-role');
        if (roleSelectGlobal) {
            roleSelectGlobal.addEventListener('change', (e) => {
                const val = e.target.value;
                const isOp = ['Piloto', 'Instructor AFF', 'Instructor Tandem', 'Coach', 'Camara Flyer', 'Empacador', 'S&TA', 'Rigger'].includes(val);
                const licContainer = document.getElementById('licencia-container');
                const comContainer = document.getElementById('comisiones-container');
                if (licContainer) licContainer.style.display = isOp ? 'block' : 'none';
                if (comContainer) comContainer.style.display = isOp ? 'block' : 'none';
            });
        }

        const modal = document.getElementById('modal-emp');
        document.getElementById('btn-new-emp').addEventListener('click', () => {
            document.getElementById('emp-id').value = '';
            
            // clear new fields
            const preview = document.getElementById('emp-photo-preview');
            preview.innerHTML = `<i class="fas fa-camera" style="font-size: 2rem; color: var(--text-secondary);"></i>`;
            delete preview.dataset.url;
            document.getElementById('emp-photo').value = '';
            
            document.getElementById('emp-name').value = '';
            document.getElementById('emp-lastname').value = '';
            document.getElementById('emp-doc').value = '';
            document.getElementById('emp-phone').value = '';
            document.getElementById('emp-dob').value = '';
            document.getElementById('emp-email').value = '';
            renderDynamicLicenses([]);

            const roleSelect = document.getElementById('emp-role');
            ensureComisionesPopulated();
            document.querySelectorAll('.comision-chk').forEach(c => c.checked = false);
            
            // trigger change to set initial state
            roleSelect.dispatchEvent(new Event('change'));

            modal.style.display = 'flex';
            void modal.offsetWidth;
            modal.style.opacity = '1';
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.transform = 'translateY(0)';
        });

        function closeModal() {
            const modalContent = modal.querySelector('.modal-content');
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }

        document.getElementById('close-emp-modal').addEventListener('click', closeModal);
        document.getElementById('btn-cancel-emp').addEventListener('click', closeModal);

        document.getElementById('btn-save-emp').addEventListener('click', () => {
            const name = document.getElementById('emp-name').value.trim();
            const lastname = document.getElementById('emp-lastname').value.trim();
            const role = document.getElementById('emp-role').value;
            const doc = document.getElementById('emp-doc').value.trim();
            const phone = document.getElementById('emp-phone').value.trim();
            const dob = document.getElementById('emp-dob').value;
            const email = document.getElementById('emp-email').value.trim();
            const photoUrl = document.getElementById('emp-photo-preview').dataset.url || '';
            
            // Gather dynamic licenses
            const licencias = [];
            document.querySelectorAll('.emp-lic-input').forEach(inp => {
                if(inp.value.trim() !== '') licencias.push(inp.value.trim());
            });

            if(!name || !doc) return alert('El Nombre y el Documento son obligatorios');
            
            let comisiones = [];
            if (['Piloto', 'Instructor AFF', 'Instructor Tandem', 'Coach', 'Camara Flyer', 'Empacador', 'S&TA', 'Rigger'].includes(role)) {
                const chks = document.querySelectorAll('.comision-chk:checked');
                comisiones = Array.from(chks).map(c => c.value);
            }

            const id = document.getElementById('emp-id').value;
            
            if (id) {
                const emp = window.AppData.employees.find(e => e.id === id);
                if (emp) {
                    emp.name = name;
                    emp.lastname = lastname;
                    emp.role = role;
                    emp.doc = doc;
                    emp.phone = phone;
                    emp.dob = dob;
                    emp.email = email;
                    emp.licencias = licencias;
                    emp.comisiones = comisiones;
                    if(photoUrl) emp.photoUrl = photoUrl;
                }
            } else {
                window.AppData.employees.push({
                    id: 'emp_' + Date.now(),
                    name, lastname, role, doc, phone, dob, email, licencias, comisiones, photoUrl,
                    status: 'Activo'
                });
            }
            if(window.saveAppData) window.saveAppData();
            
            renderEmployees();
            closeModal();
        });

        // Init Calls
        renderEmployees();
        renderClockLogs();
    }
};
