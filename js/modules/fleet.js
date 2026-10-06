window.Modules = window.Modules || {};

window.Modules.fleet = {
    render: (container) => {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; gap: 1rem;">
                <!-- Header -->
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, var(--brand-blue), #3b82f6); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                            <i class="fas fa-plane"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; color: var(--text-primary);">Asignación de Flota</h2>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Gestión de rutas, aeronaves y horas de vuelo</p>
                        </div>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <input type="date" id="fleet-date-filter" class="form-control" style="height: 100%; font-weight: bold; padding: 0.5rem 1rem;">
                        </div>
                        <button class="btn btn-primary" id="btn-replicate" style="padding: 0 1.5rem;"><i class="fas fa-copy"></i> Replicar Día</button>
                    </div>
                </div>

                <!-- KPIs -->
                <div style="display: flex; gap: 1rem;">
                    <div class="card" style="flex: 1; display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
                        <div style="width: 45px; height: 45px; background: var(--brand-blue)20; color: var(--brand-blue); border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.25rem;"><i class="fas fa-plane-departure"></i></div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.5rem;" id="kpi-flights">0</h3>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Vuelos Programados</span>
                        </div>
                    </div>
                    <div class="card" style="flex: 1; display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
                        <div style="width: 45px; height: 45px; background: var(--brand-action)20; color: var(--brand-action); border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.25rem;"><i class="fas fa-parachute-box"></i></div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.5rem;" id="kpi-tandem">0</h3>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Cupos Tándem Generados</span>
                        </div>
                    </div>
                    <div class="card" style="flex: 1; display: flex; align-items: center; gap: 1rem; padding: 1.25rem;">
                        <div style="width: 45px; height: 45px; background: var(--brand-success)20; color: var(--brand-success); border-radius: 10px; display: flex; justify-content: center; align-items: center; font-size: 1.25rem;"><i class="fas fa-users"></i></div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.5rem;" id="kpi-fun">0</h3>
                            <span style="font-size: 0.85rem; color: var(--text-secondary);">Cupos Deportivos</span>
                        </div>
                    </div>
                </div>

                <!-- Main Gantt Interface -->
                <div class="card" style="flex: 1; display: flex; flex-direction: column; overflow: hidden; padding: 1.5rem;">
                    
                    <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; align-items: flex-end; background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px;">
                        <div class="form-group" style="margin-bottom: 0; flex: 2;">
                            <label style="font-weight: 600; color: var(--text-primary);">Aeronave</label>
                            <select id="fleet-plane-select" class="form-control" style="background: var(--bg-main);"></select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0; flex: 1;">
                            <label style="font-weight: 600; color: var(--text-primary);">Capitán</label>
                            <select id="fleet-captain-select" class="form-control" style="background: var(--bg-main);"></select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0; flex: 1;">
                            <label style="font-weight: 600; color: var(--text-primary);">Hora Despegue</label>
                            <input type="time" id="fleet-time-start" class="form-control" style="background: var(--bg-main);">
                        </div>
                        <div class="form-group" style="margin-bottom: 0; flex: 1;">
                            <label style="font-weight: 600; color: var(--text-primary);">Hora Aterrizaje</label>
                            <input type="time" id="fleet-time-end" class="form-control" style="background: var(--bg-main);">
                        </div>
                        <button class="btn btn-primary" id="btn-add-assign" style="height: 42px; flex: 1;"><i class="fas fa-plus"></i> Programar Vuelo</button>
                    </div>

                    <!-- Gantt Chart Container -->
                    <div id="gantt-container" style="flex: 1; display: flex; flex-direction: column; border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; background: var(--bg-main);">
                        <!-- Header Horas (05:00 a 18:30) -->
                        <div id="gantt-header" style="display: grid; grid-template-columns: 140px 1fr; border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.03);">
                            <div style="padding: 0.75rem; font-weight: bold; border-right: 1px solid var(--border-color); text-align: center; color: var(--brand-blue);">Flota / Matrícula</div>
                            <!-- Dynamic hours -->
                        </div>
                        <!-- Body Rows -->
                        <div id="gantt-body" style="flex: 1; overflow-y: auto;">
                            <!-- Dynamic aircraft rows -->
                        </div>
                    </div>
                    
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 1rem; display: flex; gap: 1.5rem; justify-content: center;">
                        <span style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 12px; height: 12px; border-radius: 2px; background: var(--brand-action);"></div> Vuelo Programado</span>
                        <span style="display: flex; align-items: center; gap: 0.5rem;"><div style="width: 12px; height: 12px; border-radius: 2px; background: rgba(245, 158, 11, 0.4);"></div> Margen Logístico (15 min)</span>
                        <span>* Puedes arrastrar (Drag & Drop) los vuelos para ajustar la hora.</span>
                    </div>

                </div>
            </div>

            <!-- Modal Replicar -->
            <div id="modal-replicate" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 500px; max-width: 90%; max-height: 90vh; overflow-y: auto; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="btn-cancel-repl-top" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-copy" style="color: var(--brand-action);"></i> Replicar Programación</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 0.9rem;">
                        Copia la programación del día origen (plantilla) hacia un rango de fechas, omitiendo los días de No-Operación.
                    </p>
                    
                    <div class="form-group">
                        <label>Día Origen (Plantilla)</label>
                        <input type="date" id="repl-date-from" class="form-control" disabled style="background: var(--bg-surface-hover);">
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label>Aplicar Hasta (Límite)</label>
                            <input type="date" id="repl-date-to" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Aeronave a Replicar</label>
                            <select id="repl-plane" class="form-control">
                                <option value="all">Todas (Operación completa)</option>
                            </select>
                        </div>
                    </div>

                    <label style="font-weight: 600; margin-bottom: 0.5rem; display: block; margin-top: 0.5rem;">Días hábiles a aplicar:</label>
                    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.85rem;">
                        <label style="cursor:pointer;"><input type="checkbox" class="repl-day" value="1" checked> Lunes</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="repl-day" value="2" checked> Martes</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="repl-day" value="3" checked> Miércoles</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="repl-day" value="4" checked> Jueves</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="repl-day" value="5" checked> Viernes</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="repl-day" value="6" checked> Sábado</label>
                        <label style="cursor:pointer;"><input type="checkbox" class="repl-day" value="0" checked> Domingo</label>
                    </div>

                    <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-outline" id="btn-cancel-repl">Cancelar</button>
                        <button class="btn btn-primary" id="btn-confirm-repl"><i class="fas fa-check"></i> Ejecutar Réplica</button>
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
        window.AppData.aeronaves = window.AppData.aeronaves || [];
        window.AppData.asignacionFlota = window.AppData.asignacionFlota || [];

        const dateFilter = document.getElementById('fleet-date-filter');
        const planeSelect = document.getElementById('fleet-plane-select');
        const timeStart = document.getElementById('fleet-time-start');
        const timeEnd = document.getElementById('fleet-time-end');
        const btnAddAssign = document.getElementById('btn-add-assign');
        
        const ganttHeader = document.getElementById('gantt-header');
        const ganttBody = document.getElementById('gantt-body');

        // Modals
        const modalReplicate = document.getElementById('modal-replicate');
        const modalContent = modalReplicate.querySelector('.modal-content');
        const btnReplicate = document.getElementById('btn-replicate');
        const btnCancelRepl = document.getElementById('btn-cancel-repl');
        const btnCancelReplTop = document.getElementById('btn-cancel-repl-top');
        const btnConfirmRepl = document.getElementById('btn-confirm-repl');
        const replPlane = document.getElementById('repl-plane');

        // Initial setup
        const today = new Date().toLocaleDateString('en-CA');
        dateFilter.value = today;

        // Header logic (05:00 to 18:30 = 13.5 hours)
        function renderHeader() {
            let html = '<div style="padding: 0.75rem; font-weight: bold; border-right: 1px solid var(--border-color); text-align: center; color: var(--brand-blue); background: rgba(0,0,0,0.03);">Flota / Matrícula</div>';
            html += '<div style="position: relative; width: 100%; height: 100%;">';
            for (let i = 5; i <= 18; i++) {
                const pct = ((i - 5) / 13.5) * 100;
                html += `<div style="position: absolute; left: ${pct}%; top: 0; padding: 0.75rem 0.25rem; font-size: 0.75rem; border-left: 1px solid var(--border-color); height: 100%; color: var(--text-secondary); font-weight: bold;">${i.toString().padStart(2, '0')}:00</div>`;
            }
            html += '</div>';
            ganttHeader.innerHTML = html;
        }

        // Time logic (HH:MM to pixels)
        function timeToMins(t) {
            if(!t) return 0;
            const [h, m] = t.split(':').map(Number);
            return (h * 60) + m;
        }

        function minsToTime(m) {
            let h = Math.floor(m / 60);
            let mm = m % 60;
            return `${h.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
        }

        function addMinutes(t, add) {
            return minsToTime(timeToMins(t) + add);
        }

        function timeToPercent(timeStr) {
            const [h, m] = timeStr.split(':').map(Number);
            const totalMins = 13.5 * 60; // 05:00 to 18:30
            let mins = ((h - 5) * 60) + m;
            if (mins < 0) mins = 0;
            if (mins > totalMins) mins = totalMins;
            return (mins / totalMins) * 100;
        }

        function checkOverlap(idAeronave, fecha, startStr, endStr, ignoreId = null) {
            const ms = timeToMins(startStr);
            // End time plus 15min logistic margin
            const me = timeToMins(endStr) + 15;

            const existing = window.AppData.asignacionFlota.filter(a => a.id_aeronave === idAeronave && a.fecha === fecha && a.id !== ignoreId);
            for (let asg of existing) {
                const as = timeToMins(asg.horaInicio);
                const ae = timeToMins(asg.horaFin) + 15;

                // Check if (start < ae) and (end > as)
                if (ms < ae && me > as) {
                    return true;
                }
            }
            return false;
        }

        function renderGantt() {
            const currentDate = dateFilter.value;
            ganttBody.innerHTML = '';
            planeSelect.innerHTML = '';
            replPlane.innerHTML = '<option value="all">Todas (Operación completa)</option>';

            let totalFlights = 0;
            let totalTandem = 0;
            let totalFun = 0;

            const activas = window.AppData.aeronaves.filter(a => a.estado === 'Operativa');

            if (activas.length === 0) {
                ganttBody.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-secondary);">No hay aeronaves operativas en la configuración del sistema.</div>';
                document.getElementById('kpi-flights').textContent = '0';
                document.getElementById('kpi-tandem').textContent = '0';
                document.getElementById('kpi-fun').textContent = '0';
                return;
            }

            activas.forEach(a => {
                planeSelect.innerHTML += `<option value="${escapeHTML(a.id)}">${escapeHTML(a.matricula)} (${escapeHTML(a.modelo)})</option>`;
                replPlane.innerHTML += `<option value="${escapeHTML(a.id)}">${escapeHTML(a.matricula)}</option>`;

                const tr = document.createElement('div');
                tr.style.display = 'grid';
                tr.style.gridTemplateColumns = '140px 1fr';
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.style.minHeight = '70px';

                const nameDiv = document.createElement('div');
                nameDiv.style.padding = '1rem 0.75rem';
                nameDiv.style.borderRight = '1px solid var(--border-color)';
                nameDiv.style.background = 'rgba(0,0,0,0.01)';
                nameDiv.style.display = 'flex';
                nameDiv.style.flexDirection = 'column';
                nameDiv.style.justifyContent = 'center';
                
                nameDiv.innerHTML = `<strong style="color: var(--text-primary); font-size: 1.05rem;">${a.matricula}</strong>
                                     <span style="font-size:0.75rem; color:var(--text-secondary);">${a.modelo}</span>`;

                const trackDiv = document.createElement('div');
                trackDiv.style.position = 'relative';
                trackDiv.style.background = 'repeating-linear-gradient(90deg, transparent, transparent calc(100%/13.5 - 1px), var(--border-color) calc(100%/13.5 - 1px), var(--border-color) calc(100%/13.5))';

                // Get assignments
                const assignments = window.AppData.asignacionFlota
                    .filter(asg => asg.id_aeronave === a.id && asg.fecha === currentDate)
                    .sort((x, y) => timeToMins(x.horaInicio) - timeToMins(y.horaInicio));
                
                assignments.forEach((asg, index) => {
                    totalFlights++;
                    totalTandem += parseInt(a.capTandem || 0);
                    totalFun += parseInt(a.capFun || 0);

                    const startPct = timeToPercent(asg.horaInicio);
                    const endPct = timeToPercent(asg.horaFin);
                    const logPct = timeToPercent(addMinutes(asg.horaFin, 15));

                    // Log block
                    let logBlock = null;
                    if (logPct > endPct) {
                        logBlock = document.createElement('div');
                        logBlock.style.position = 'absolute';
                        logBlock.style.left = endPct + '%';
                        logBlock.style.width = (logPct - endPct) + '%';
                        logBlock.style.top = '12px';
                        logBlock.style.bottom = '12px';
                        logBlock.style.background = 'rgba(245, 158, 11, 0.4)';
                        logBlock.style.borderRadius = '0 6px 6px 0';
                        logBlock.title = 'Margen Logístico (15min)';
                        trackDiv.appendChild(logBlock);
                    }

                    // Main block
                    const block = document.createElement('div');
                    block.style.position = 'absolute';
                    block.style.left = startPct + '%';
                    block.style.width = (endPct - startPct) + '%';
                    block.style.top = '12px';
                    block.style.bottom = '12px';
                    block.style.background = 'linear-gradient(135deg, var(--brand-action), #f59e0b)';
                    block.style.color = 'white';
                    block.style.borderRadius = '6px 0 0 6px';
                    block.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                    block.style.cursor = 'grab';
                    
                    block.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: center; height: 100%; padding: 0 0.5rem; overflow: hidden; white-space: nowrap;">
                                        <div style="display: flex; flex-direction: column; justify-content: center;">
                                            <strong style="font-size: 0.8rem; line-height: 1;">Vuelo #${index + 1}</strong>
                                            <span style="opacity:0.9; font-size: 0.65rem;" class="time-label">${asg.horaInicio}</span>
                                        </div>
                                       </div>`;
                    
                    // delete btn
                    const delBtn = document.createElement('button');
                    delBtn.innerHTML = '<i class="fas fa-times"></i>';
                    delBtn.style.background = 'rgba(0,0,0,0.2)';
                    delBtn.style.border = 'none';
                    delBtn.style.color = 'white';
                    delBtn.style.borderRadius = '50%';
                    delBtn.style.width = '18px';
                    delBtn.style.height = '18px';
                    delBtn.style.display = 'flex';
                    delBtn.style.alignItems = 'center';
                    delBtn.style.justifyContent = 'center';
                    delBtn.style.fontSize = '0.6rem';
                    delBtn.style.cursor = 'pointer';
                    
                    delBtn.addEventListener('click', (e) => {
                          e.stopPropagation();
                          if(confirm('¿Eliminar esta asignación de vuelo?')){
                              
                              const aeronaveMatricula = window.AppData.aeronaves.find(a => a.id === asg.id_aeronave)?.matricula;
                              if (aeronaveMatricula && window.AppData.passengers) {
                                  window.AppData.passengers.forEach(p => {
                                      if (p.date === asg.fecha && p.aeronave === aeronaveMatricula && p.time === asg.horaInicio) {
                                          p.aeronave = 'Sin asignar';
                                          p.time = 'Por Asignar';
                                          p.vueloNum = '';
                                      }
                                  });
                              }

                              window.AppData.asignacionFlota = window.AppData.asignacionFlota.filter(x => x.id !== asg.id);
                              if (window.saveAppData) window.saveAppData();
                              renderGantt();
                          }
                      });
                    
                    block.querySelector('div').appendChild(delBtn);
                    trackDiv.appendChild(block);

                    // Drag & Drop
                    block.addEventListener('mousedown', (e) => {
                        if (e.target.closest('button')) return;
                        e.preventDefault();
                        
                        const startX = e.clientX;
                        const trackWidth = trackDiv.getBoundingClientRect().width;
                        const totalMins = 810; 
                        
                        const origStartMins = timeToMins(asg.horaInicio);
                        const origEndMins = timeToMins(asg.horaFin);
                        const duration = origEndMins - origStartMins;
                        
                        let currentStartMins = origStartMins;
                        block.style.cursor = 'grabbing';
                        block.style.zIndex = '10';
                        block.style.transform = 'scale(1.02)';
                        block.style.transition = 'none';
                        
                        const onMouseMove = (moveEvent) => {
                            const deltaX = moveEvent.clientX - startX;
                            const deltaMins = Math.round((deltaX / trackWidth) * totalMins);
                            
                            let newStartMins = origStartMins + deltaMins;
                            const minStart = 300; 
                            const maxEnd = 1110 - 15;
                            
                            if (newStartMins < minStart) newStartMins = minStart;
                            if (newStartMins + duration > maxEnd) newStartMins = maxEnd - duration;
                            
                            currentStartMins = newStartMins;
                            
                            const newStartPct = ((newStartMins - 300) / totalMins) * 100;
                            block.style.left = newStartPct + '%';
                            if (logBlock) logBlock.style.left = (newStartPct + ((duration)/totalMins)*100) + '%';
                            block.querySelector('.time-label').textContent = minsToTime(currentStartMins);
                        };
                        
                        const onMouseUp = () => {
                            document.removeEventListener('mousemove', onMouseMove);
                            document.removeEventListener('mouseup', onMouseUp);
                            block.style.cursor = 'grab';
                            block.style.zIndex = '';
                            block.style.transform = 'scale(1)';
                            
                            if (currentStartMins !== origStartMins) {
                                const newStartStr = minsToTime(currentStartMins);
                                const newEndStr = minsToTime(currentStartMins + duration);
                                
                                if (checkOverlap(asg.id_aeronave, currentDate, newStartStr, newEndStr, asg.id)) {
                                    alert('Conflicto: Ya existe un vuelo en este horario.');
                                    renderGantt(); // Revert
                                } else {
                                    asg.horaInicio = newStartStr;
                                    asg.horaFin = newEndStr;
                                    if (window.saveAppData) window.saveAppData();
                                    renderGantt();
                                }
                            }
                        };
                        
                        document.addEventListener('mousemove', onMouseMove);
                        document.addEventListener('mouseup', onMouseUp);
                    });
                });

                tr.appendChild(nameDiv);
                tr.appendChild(trackDiv);
                ganttBody.appendChild(tr);
            });

            // Update KPIs
            document.getElementById('kpi-flights').textContent = totalFlights;
            document.getElementById('kpi-tandem').textContent = totalTandem;
            document.getElementById('kpi-fun').textContent = totalFun;
        }

        // Setup Header
        renderHeader();
        renderGantt();

        const captSelect = document.getElementById('fleet-captain-select');
        function renderCaptains() {
            if(captSelect) {
                captSelect.innerHTML = '';
                const pilots = window.AppData.employees.filter(e => e.role === 'Piloto');
                if (pilots.length === 0) {
                    captSelect.innerHTML = '<option value="">Sin pilotos</option>';
                } else {
                    pilots.forEach(p => {
                        captSelect.innerHTML += `<option value="${escapeHTML(p.name)}">${escapeHTML(p.name)}</option>`;
                    });
                }
            }
        }
        renderCaptains();

        // Listeners
        dateFilter.addEventListener('change', renderGantt);

        btnAddAssign.addEventListener('click', () => {
            const idAeronave = planeSelect.value;
            const fecha = dateFilter.value;
            const start = timeStart.value;
            const end = timeEnd.value;
            const capitan = captSelect ? captSelect.value : 'S/A';

            if (!idAeronave || !start || !end) return alert('Completa las horas de vuelo.');
            if (timeToMins(start) >= timeToMins(end)) return alert('La hora fin debe ser posterior a la de inicio.');

            if (checkOverlap(idAeronave, fecha, start, end)) {
                return alert('Conflicto: La aeronave ya está asignada en este horario (incluye margen 15 min).');
            }

            window.AppData.asignacionFlota.push({
                id: 'asg_' + Date.now(),
                id_aeronave: idAeronave,
                fecha: fecha,
                horaInicio: start,
                horaFin: end,
                estado: 'Programado',
                capitan: capitan
            });

            if (window.saveAppData) window.saveAppData();

            timeStart.value = '';
            timeEnd.value = '';
            renderGantt();
        });

        // Replication Modals
        function openReplModal() {
            document.getElementById('repl-date-from').value = dateFilter.value;
            modalReplicate.style.display = 'flex';
            void modalReplicate.offsetWidth;
            modalReplicate.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }

        function closeReplModal() {
            modalReplicate.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            setTimeout(() => { modalReplicate.style.display = 'none'; }, 300);
        }

        btnReplicate.addEventListener('click', openReplModal);
        btnCancelRepl.addEventListener('click', closeReplModal);
        btnCancelReplTop.addEventListener('click', closeReplModal);

        btnConfirmRepl.addEventListener('click', () => {
            const dateFrom = document.getElementById('repl-date-from').value;
            const dateTo = document.getElementById('repl-date-to').value;
            const pId = document.getElementById('repl-plane').value;
            
            const daysChecked = Array.from(document.querySelectorAll('.repl-day:checked')).map(cb => parseInt(cb.value));

            if (!dateTo || daysChecked.length === 0) {
                return alert('Selecciona una fecha límite y al menos un día hábil.');
            }

            const startDate = new Date(dateFrom + 'T12:00:00Z');
            const limitDate = new Date(dateTo + 'T12:00:00Z');
            if (limitDate <= startDate) {
                return alert('La fecha límite debe ser posterior al día origen.');
            }

            let sourceAsg = window.AppData.asignacionFlota.filter(a => a.fecha === dateFrom);
            if (pId !== 'all') {
                sourceAsg = sourceAsg.filter(a => a.id_aeronave === pId);
            }

            if (sourceAsg.length === 0) return alert('No hay vuelos programados en este día para replicar.');

            let conflicts = 0;
            let replicated = 0;
            let current = new Date(startDate);
            current.setDate(current.getDate() + 1); 

            while (current <= limitDate) {
                const dayOfWeek = current.getDay();
                if (daysChecked.includes(dayOfWeek)) {
                    const dateStr = current.toISOString().split('T')[0];
                    
                    sourceAsg.forEach(asg => {
                        const airplane = window.AppData.aeronaves.find(x => x.id === asg.id_aeronave);
                        if(airplane && airplane.estado === 'Operativa') {
                            if (checkOverlap(asg.id_aeronave, dateStr, asg.horaInicio, asg.horaFin)) {
                                conflicts++;
                            } else {
                                window.AppData.asignacionFlota.push({
                                    id: 'asg_r_' + Date.now() + Math.floor(Math.random()*1000),
                                    id_aeronave: asg.id_aeronave,
                                    fecha: dateStr,
                                    horaInicio: asg.horaInicio,
                                    horaFin: asg.horaFin,
                                    estado: 'Programado'
                                });
                                replicated++;
                            }
                        }
                    });
                }
                current.setDate(current.getDate() + 1);
            }

            if (window.saveAppData) window.saveAppData();
            closeReplModal();
            renderGantt();
            alert(`Operación replicada: ${replicated} vuelos agregados. ${conflicts > 0 ? '(' + conflicts + ' ignorados por conflictos)' : ''}`);
        });

    }
};
