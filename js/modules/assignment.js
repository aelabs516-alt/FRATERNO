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
                card.style.background = 'rgba(15, 23, 42, 0.4)';
                card.style.backdropFilter = 'blur(12px)';
                card.style.WebkitBackdropFilter = 'blur(12px)';
                card.style.border = '1px solid rgba(255,255,255,0.05)';
                card.style.borderRadius = '12px';
                card.style.padding = '1.5rem';
                card.style.display = 'flex';
                card.style.justifyContent = 'space-between';
                card.style.alignItems = 'center';
                card.style.flexWrap = 'wrap';
                card.style.gap = '1rem';
                card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                
                card.onmouseover = () => {
                    card.style.transform = 'translateY(-2px)';
                    card.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';
                };
                card.onmouseout = () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                };
                
                let selectHtml = '';
                if(assignedRigId) {
                    selectHtml = `
                        <div style="display: flex; align-items: center; gap: 1rem; background: rgba(16, 185, 129, 0.1); padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
                            <span style="color: var(--brand-success); font-weight: bold;"><i class="fas fa-parachute-box"></i> Equipo ${escapeHTML(assignedRigId)} Asignado</span>
                            <button class="btn btn-release" data-id="${inst.id}" style="background: var(--brand-danger); color: white; border: none; padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3); transition: background 0.2s;"><i class="fas fa-unlink"></i> Desasignar</button>
                        </div>
                    `;
                } else {
                    const options = availableRigs.map(r => `<option value="${escapeHTML(r.id)}">Equipo ${escapeHTML(r.id)}</option>`).join('');
                    selectHtml = `
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <select class="form-control sel-rig" data-id="${inst.id}" style="width: 200px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);">
                                <option value="">Seleccione Equipo...</option>
                                ${options}
                            </select>
                            <button class="btn btn-primary btn-claim" data-id="${inst.id}" style="padding: 0.5rem 1rem; font-weight: bold; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);"><i class="fas fa-hand-paper"></i> Asignar</button>
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
