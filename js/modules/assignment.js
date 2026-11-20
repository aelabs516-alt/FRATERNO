window.Modules.assignment = {
    render: (container) => {
        container.innerHTML = `
            <div class="assignment-module" style="display: flex; flex-direction: column; height: 100%; gap: 1rem;">
                
                <!-- Header -->
                <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, var(--brand-action), #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                            <i class="fas fa-people-carry"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; color: var(--text-primary);">Asignación de Recursos</h2>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Asignación de Equipos a Instructores</p>
                        </div>
                    </div>
                </div>
                
                <!-- Body -->
                <div style="display: flex; flex: 1; gap: 1.5rem; overflow: hidden; flex-direction: column;">
                    
                    <div class="card" style="flex: 1; overflow-y: auto;">
                        <h3 style="margin-top: 0; margin-bottom: 1.5rem;">Instructores y Equipos</h3>
                        <div id="assignment-list" style="display: grid; gap: 1rem;">
                            <!-- Injected dynamically -->
                        </div>
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

        function renderAssignments() {
            const list = document.getElementById('assignment-list');
            if(!list) return;
            list.innerHTML = '';
            
            const employees = window.AppData?.employees || [];
            const tandemRigs = window.AppData?.tandemRigs || [];
            window.AppData.instructorAssignments = window.AppData.instructorAssignments || {};
            
            // Filtra los empleados que tengan rol/servicios de instructor (Req #6: Instructor Tándem, AFF y S&TA)
            let instructores = employees.filter(e => {
                if (window.isAssignableInstructor && window.isAssignableInstructor(e)) return true;
                if (e.role && (e.role.toLowerCase().includes('instructor') || e.role === 'S&TA')) return true;
                if (e.services && e.services.includes('Salto Tándem')) return true;
                if (e.category && e.category.toLowerCase().includes('instructor')) return true;
                if (e.name && e.name.toLowerCase().includes('instructor')) return true;
                return false;
            });
            
            // Si por alguna razón los roles no están definidos, listamos todos para no dejar vacío
            if(instructores.length === 0 && employees.length > 0) {
                instructores = employees;
            }
            
            if(instructores.length === 0) {
                list.innerHTML = '<div style="color: var(--text-secondary); text-align: center; padding: 2rem;">No hay instructores registrados en el sistema.</div>';
                return;
            }
            
            // Available rigs: Rigs that are NOT assigned to any instructor
            const assignedRigs = Object.values(window.AppData.instructorAssignments);
            const availableRigs = tandemRigs.filter(r => !assignedRigs.includes(r.id));
            
            instructores.forEach(inst => {
                const assignedRigId = window.AppData.instructorAssignments[inst.id];
                
                const card = document.createElement('div');
                card.style.background = 'var(--bg-surface)';
                card.style.border = '1px solid var(--border-color)';
                card.style.borderRadius = '14px';
                card.style.padding = '1.25rem 1.5rem';
                card.style.display = 'flex';
                card.style.justifyContent = 'space-between';
                card.style.alignItems = 'center';
                card.style.flexWrap = 'wrap';
                card.style.gap = '1rem';
                card.style.boxShadow = 'var(--shadow-sm)';
                card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease';
                
                card.onmouseover = () => {
                    card.style.transform = 'translateY(-2px)';
                    card.style.boxShadow = 'var(--shadow-md)';
                    card.style.borderColor = 'var(--brand-action)';
                };
                card.onmouseout = () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = 'var(--shadow-sm)';
                    card.style.borderColor = 'var(--border-color)';
                };
                
                let selectHtml = '';
                if(assignedRigId) {
                    selectHtml = `
                        <div style="display: flex; align-items: center; gap: 1rem; background: rgba(16, 185, 129, 0.12); padding: 0.5rem 1rem; border-radius: 10px; border: 1px solid rgba(16, 185, 129, 0.28); flex-wrap: wrap;">
                            <span style="color: var(--brand-success); font-weight: 700;"><i class="fas fa-parachute-box"></i> Equipo ${escapeHTML(assignedRigId)} Asignado</span>
                            <button class="btn btn-danger btn-release" data-id="${inst.id}" style="padding: 0.45rem 1rem;"><i class="fas fa-unlink"></i> Desasignar</button>
                        </div>
                    `;
                } else {
                    const options = availableRigs.map(r => `<option value="${escapeHTML(r.id)}">Equipo ${escapeHTML(r.id)}</option>`).join('');
                    selectHtml = `
                        <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
                            <select class="form-control sel-rig" data-id="${inst.id}" style="width: 200px;">
                                <option value="">Seleccione Equipo...</option>
                                ${options}
                            </select>
                            <button class="btn btn-primary btn-claim" data-id="${inst.id}" style="padding: 0.55rem 1rem;"><i class="fas fa-hand-paper"></i> Asignar</button>
                        </div>
                    `;
                }
                
                card.innerHTML = `
                    <div>
                        <h4 style="margin: 0; font-size: 1.2rem; color: var(--text-primary);"><i class="fas fa-user-tie" style="color: var(--brand-action); margin-right: 0.5rem;"></i>${escapeHTML(inst.name)}</h4>
                        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.4rem; display: flex; align-items: center; gap: 0.75rem;">
                            <span>${escapeHTML(inst.role || 'Instructor')}</span>
                        </div>
                    </div>
                    ${selectHtml}
                `;
                
                list.appendChild(card);
            });
            
            document.querySelectorAll('.btn-claim').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const instId = e.currentTarget.getAttribute('data-id');
                    const select = document.querySelector(`.sel-rig[data-id="${instId}"]`);
                    const rigId = select.value;
                    
                    if(!rigId) return alert('Por favor, seleccione un equipo para asignar.');
                    
                    window.AppData.instructorAssignments[instId] = rigId;
                    if(window.saveAppData) window.saveAppData();
                    renderAssignments();
                });
            });
            
            document.querySelectorAll('.btn-release').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const instId = e.currentTarget.getAttribute('data-id');
                    delete window.AppData.instructorAssignments[instId];
                    if(window.saveAppData) window.saveAppData();
                    renderAssignments();
                });
            });
        }
        
        renderAssignments();
    }
};
