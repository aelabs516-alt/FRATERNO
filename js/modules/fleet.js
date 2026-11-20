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
                    <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <input type="date" id="fleet-date-filter" class="form-control" style="height: 100%; font-weight: bold; padding: 0.5rem 1rem;">
                        </div>
                        <button class="btn" id="btn-migrate-flights" style="padding: 0 1.25rem; background: var(--brand-warning); color: #fff; border: none;"><i class="fas fa-exchange-alt"></i> Migrar Vuelos</button>
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

            <!-- Modal Migrar Vuelos entre Aeronaves -->
            <div id="modal-migrate" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 560px; max-width: 94%; max-height: 92vh; overflow-y: auto; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="btn-cancel-mig-top" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                        <i class="fas fa-exchange-alt" style="color: var(--brand-warning);"></i> Migrar Vuelos entre Aeronaves
                    </h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.25rem; font-size: 0.9rem;">
                        Transfiere uno o varios vuelos programados (junto con sus pasajeros asignados) de una aeronave origen a otra aeronave operativa.
                    </p>

                    <div class="form-group">
                        <label style="font-weight: 600;">Alcance de la Migración</label>
                        <select id="mig-scope" class="form-control">
                            <option value="single">1 Vuelo específico</option>
                            <option value="day" selected>Vuelos de 1 Día</option>
                            <option value="week">Vuelos de 1 Semana (7 días)</option>
                            <option value="all">Todos los vuelos de la aeronave</option>
                        </select>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label style="font-weight: 600;">Aeronave Origen</label>
                            <select id="mig-plane-from" class="form-control"></select>
                        </div>
                        <div class="form-group">
                            <label style="font-weight: 600;">Aeronave Destino (Operativa)</label>
                            <select id="mig-plane-to" class="form-control"></select>
                        </div>
                    </div>

                    <div id="mig-date-wrapper" class="form-group">
                        <label id="mig-date-label" style="font-weight: 600;">Día a Migrar</label>
                        <input type="date" id="mig-date-base" class="form-control">
                        <small id="mig-week-range-hint" style="display: none; color: var(--brand-action); font-weight: 600; margin-top: 0.35rem;"></small>
                    </div>

                    <div id="mig-single-flight-wrapper" class="form-group" style="display: none;">
                        <label style="font-weight: 600;">Vuelo Específico a Migrar</label>
                        <select id="mig-single-flight" class="form-control"></select>
                    </div>

                    <div id="mig-preview-box" style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.9rem 1rem; margin-bottom: 1rem; font-size: 0.88rem;">
                        <!-- Dynamic summary -->
                    </div>

                    <label style="display: flex; align-items: center; gap: 0.55rem; cursor: pointer; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1.25rem;">
                        <input type="checkbox" id="mig-force-overlap" style="accent-color: var(--brand-warning); width: 16px; height: 16px;">
                        <span>Permitir migración aunque exista cruce de horario en la aeronave destino</span>
                    </label>

                    <div style="display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-outline" id="btn-cancel-mig">Cancelar</button>
                        <button class="btn" id="btn-confirm-mig" style="background: var(--brand-warning); color: #fff; border: none;"><i class="fas fa-exchange-alt"></i> Confirmar Migración</button>
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
                
                nameDiv.innerHTML = `<strong style="color: var(--text-primary); font-size: 1.05rem;">${escapeHTML(a.matricula)}</strong>
                                     <span style="font-size:0.75rem; color:var(--text-secondary);">${escapeHTML(a.modelo)}</span>`;

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
                    
                    block.innerHTML = `<div style="display: flex; justify-content: space-between; align-items: center; height: 100%; padding: 0 0.5rem; overflow: hidden; white-space: nowrap; gap: 0.25rem;">
                                        <div style="display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
                                            <strong style="font-size: 0.8rem; line-height: 1;">Vuelo #${index + 1}</strong>
                                            <span style="opacity:0.9; font-size: 0.65rem;" class="time-label">${escapeHTML(asg.horaInicio)}</span>
                                        </div>
                                       </div>`;

                    const actionsBox = document.createElement('div');
                    actionsBox.style.display = 'flex';
                    actionsBox.style.alignItems = 'center';
                    actionsBox.style.gap = '0.25rem';

                    // Quick migrate single flight btn
                    const migSingleBtn = document.createElement('button');
                    migSingleBtn.classList.add('btn-migrate-single-flight');
                    migSingleBtn.setAttribute('data-flight-id', asg.id);
                    migSingleBtn.title = 'Migrar este vuelo a otra aeronave';
                    migSingleBtn.innerHTML = '<i class="fas fa-exchange-alt"></i>';
                    migSingleBtn.style.background = 'rgba(0,0,0,0.22)';
                    migSingleBtn.style.border = 'none';
                    migSingleBtn.style.color = 'white';
                    migSingleBtn.style.borderRadius = '50%';
                    migSingleBtn.style.width = '18px';
                    migSingleBtn.style.height = '18px';
                    migSingleBtn.style.display = 'flex';
                    migSingleBtn.style.alignItems = 'center';
                    migSingleBtn.style.justifyContent = 'center';
                    migSingleBtn.style.fontSize = '0.58rem';
                    migSingleBtn.style.cursor = 'pointer';
                    migSingleBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        openMigrateModal({ scope: 'single', fromPlaneId: asg.id_aeronave, dateBase: asg.fecha, flightId: asg.id });
                    });

                    // delete btn
                    const delBtn = document.createElement('button');
                    delBtn.title = 'Eliminar vuelo';
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
                    
                    delBtn.addEventListener('click', async (e) => {
                          e.stopPropagation();
                          const ok = window.showConfirm ? await window.showConfirm('¿Eliminar esta asignación de vuelo?', { title: 'Eliminar Vuelo Programado', type: 'danger' }) : confirm('¿Eliminar esta asignación de vuelo?');
                          if (ok) {
                              
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
                    
                    actionsBox.appendChild(migSingleBtn);
                    actionsBox.appendChild(delBtn);
                    block.querySelector('div').appendChild(actionsBox);
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

        // =====================================
        // Migración de Vuelos entre Aeronaves
        // (1 vuelo, 1 día, 1 semana o todos)
        // =====================================
        function addDaysYMD(ymd, days) {
            if (!ymd || !/^\d{4}-\d{2}-\d{2}$/.test(ymd)) return '';
            const [y, m, d] = ymd.split('-').map(Number);
            const dt = new Date(Date.UTC(y, m - 1, d + days));
            return dt.toISOString().slice(0, 10);
        }

        function getMigrationCandidates({ scope, fromPlaneId, dateBase, flightId }) {
            const allAsgs = (window.AppData.asignacionFlota || []).filter(a => a.id_aeronave === fromPlaneId);
            let candidates = [];
            let rangeEnd = dateBase || '';

            if (scope === 'single') {
                candidates = allAsgs.filter(a => a.id === flightId);
            } else if (scope === 'day') {
                candidates = allAsgs.filter(a => a.fecha === dateBase);
            } else if (scope === 'week') {
                rangeEnd = addDaysYMD(dateBase, 6);
                candidates = allAsgs.filter(a => a.fecha >= dateBase && a.fecha <= rangeEnd);
            } else if (scope === 'all') {
                candidates = [...allAsgs];
            }

            candidates.sort((x, y) => {
                if (x.fecha !== y.fecha) return String(x.fecha || '').localeCompare(String(y.fecha || ''));
                return timeToMins(x.horaInicio) - timeToMins(y.horaInicio);
            });

            return { candidates, rangeStart: dateBase || '', rangeEnd };
        }

        function countAffectedPassengers(candidates, fromPlane) {
            if (!fromPlane || !Array.isArray(window.AppData.passengers)) return 0;
            const matchedIds = new Set();
            candidates.forEach(asg => {
                window.AppData.passengers.forEach(p => {
                    if (
                        p.aeronave === fromPlane.matricula &&
                        p.date === asg.fecha &&
                        p.time === asg.horaInicio &&
                        p.flightStatus !== 'Completado' &&
                        p.flightStatus !== 'Aterrizó'
                    ) {
                        matchedIds.add(p.id || `${p.name}_${p.date}_${p.time}`);
                    }
                });
            });
            return matchedIds.size;
        }

        function migrateFlights({ scope, fromPlaneId, toPlaneId, dateBase, flightId, forceOverlap = false }) {
            const fromPlane = (window.AppData.aeronaves || []).find(a => a.id === fromPlaneId);
            const toPlane = (window.AppData.aeronaves || []).find(a => a.id === toPlaneId);
            if (!fromPlane || !toPlane) {
                return { ok: false, error: 'Selecciona aeronave origen y destino válidas.' };
            }
            if (fromPlane.id === toPlane.id) {
                return { ok: false, error: 'La aeronave origen y la aeronave destino deben ser diferentes.' };
            }

            const { candidates, rangeStart, rangeEnd } = getMigrationCandidates({ scope, fromPlaneId, dateBase, flightId });
            if (candidates.length === 0) {
                return { ok: false, error: 'No hay vuelos programados para migrar con los criterios seleccionados.' };
            }

            const migratedFlights = [];
            const skippedFlights = [];
            const touchedDates = new Set();
            const migratedPaxIds = new Set();
            const actor = (typeof sessionStorage !== 'undefined' && (sessionStorage.getItem('fraterno_user') || sessionStorage.getItem('fraterno_username'))) || 'Operaciones';

            candidates.forEach(asg => {
                const hasConflict = checkOverlap(toPlane.id, asg.fecha, asg.horaInicio, asg.horaFin, asg.id);
                if (hasConflict && !forceOverlap) {
                    skippedFlights.push(asg);
                    return;
                }

                asg.id_aeronave = toPlane.id;
                migratedFlights.push(asg);
                touchedDates.add(asg.fecha);

                // Migrar pasajeros activos asignados a este vuelo exacto
                (window.AppData.passengers || []).forEach(p => {
                    if (
                        p.aeronave === fromPlane.matricula &&
                        p.date === asg.fecha &&
                        p.time === asg.horaInicio &&
                        p.flightStatus !== 'Completado' &&
                        p.flightStatus !== 'Aterrizó'
                    ) {
                        p.aeronave = toPlane.matricula;
                        migratedPaxIds.add(p.id || `${p.name}_${p.date}_${p.time}`);
                        p.history = p.history || [];
                        p.history.push({
                            date: new Date().toISOString(),
                            action: `Vuelo migrado de aeronave ${fromPlane.matricula} a ${toPlane.matricula}`,
                            user: actor
                        });
                    }
                });
            });

            // Para migraciones por día/semana/todos, también reasignar pasajeros sin hora exacta en fechas donde ya no quedaron vuelos en origen
            if (scope !== 'single' && migratedFlights.length > 0) {
                touchedDates.forEach(fecha => {
                    const remainingOnOrigin = (window.AppData.asignacionFlota || []).some(a => a.id_aeronave === fromPlane.id && a.fecha === fecha);
                    if (!remainingOnOrigin) {
                        (window.AppData.passengers || []).forEach(p => {
                            const noExactTime = !p.time || p.time === 'Por Asignar' || p.time === 'Por definir';
                            if (
                                p.aeronave === fromPlane.matricula &&
                                p.date === fecha &&
                                noExactTime &&
                                p.flightStatus !== 'Completado' &&
                                p.flightStatus !== 'Aterrizó'
                            ) {
                                p.aeronave = toPlane.matricula;
                                migratedPaxIds.add(p.id || `${p.name}_${p.date}`);
                            }
                        });
                    }
                });
            }

            // Recalcular número de vuelo (Vuelo N) para los pasajeros de la aeronave destino en las fechas afectadas
            touchedDates.forEach(fecha => {
                const destDayFlights = (window.AppData.asignacionFlota || [])
                    .filter(a => a.id_aeronave === toPlane.id && a.fecha === fecha)
                    .sort((x, y) => timeToMins(x.horaInicio) - timeToMins(y.horaInicio));
                destDayFlights.forEach((asg, idx) => {
                    (window.AppData.passengers || []).forEach(p => {
                        if (
                            p.aeronave === toPlane.matricula &&
                            p.date === fecha &&
                            p.time === asg.horaInicio &&
                            p.flightStatus !== 'Completado' &&
                            p.flightStatus !== 'Aterrizó'
                        ) {
                            p.vueloNum = `Vuelo ${idx + 1}`;
                        }
                    });
                });
            });

            if (migratedFlights.length > 0 && window.saveAppData) {
                window.saveAppData();
            }

            return {
                ok: migratedFlights.length > 0,
                migratedCount: migratedFlights.length,
                skippedCount: skippedFlights.length,
                migratedPassengersCount: migratedPaxIds.size,
                fromPlane,
                toPlane,
                rangeStart,
                rangeEnd,
                error: migratedFlights.length === 0
                    ? 'Todos los vuelos seleccionados presentan conflicto de horario en la aeronave destino (margen logístico de 15 min).'
                    : null
            };
        }

        // Exponer helpers en window.Modules.fleet para reutilización y pruebas
        window.Modules.fleet.getMigrationCandidates = getMigrationCandidates;
        window.Modules.fleet.migrateFlights = migrateFlights;

        const modalMigrate = document.getElementById('modal-migrate');
        const modalMigContent = modalMigrate.querySelector('.modal-content');
        const btnMigrateFlights = document.getElementById('btn-migrate-flights');
        const btnCancelMig = document.getElementById('btn-cancel-mig');
        const btnCancelMigTop = document.getElementById('btn-cancel-mig-top');
        const btnConfirmMig = document.getElementById('btn-confirm-mig');

        const migScope = document.getElementById('mig-scope');
        const migPlaneFrom = document.getElementById('mig-plane-from');
        const migPlaneTo = document.getElementById('mig-plane-to');
        const migDateWrapper = document.getElementById('mig-date-wrapper');
        const migDateLabel = document.getElementById('mig-date-label');
        const migDateBase = document.getElementById('mig-date-base');
        const migWeekRangeHint = document.getElementById('mig-week-range-hint');
        const migSingleFlightWrapper = document.getElementById('mig-single-flight-wrapper');
        const migSingleFlight = document.getElementById('mig-single-flight');
        const migPreviewBox = document.getElementById('mig-preview-box');
        const migForceOverlap = document.getElementById('mig-force-overlap');

        function populateMigratePlaneSelects(preferredFromId = null) {
            const allPlanes = window.AppData.aeronaves || [];
            const sourcePlanes = allPlanes.filter(a =>
                a.estado === 'Operativa' || (window.AppData.asignacionFlota || []).some(f => f.id_aeronave === a.id)
            );
            migPlaneFrom.innerHTML = '';
            if (sourcePlanes.length === 0) {
                migPlaneFrom.innerHTML = '<option value="">-- Sin aeronaves disponibles --</option>';
            } else {
                sourcePlanes.forEach(a => {
                    migPlaneFrom.innerHTML += `<option value="${escapeHTML(a.id)}">${escapeHTML(a.matricula)} (${escapeHTML(a.modelo)}) [${escapeHTML(a.estado)}]</option>`;
                });
                if (preferredFromId && sourcePlanes.some(a => a.id === preferredFromId)) {
                    migPlaneFrom.value = preferredFromId;
                }
            }
            populateMigrateDestSelect();
        }

        function populateMigrateDestSelect() {
            const fromId = migPlaneFrom.value;
            const prevDest = migPlaneTo.value;
            const destPlanes = (window.AppData.aeronaves || []).filter(a => a.estado === 'Operativa' && a.id !== fromId);
            migPlaneTo.innerHTML = '';
            if (destPlanes.length === 0) {
                migPlaneTo.innerHTML = '<option value="">-- No hay otra aeronave operativa --</option>';
            } else {
                destPlanes.forEach(a => {
                    migPlaneTo.innerHTML += `<option value="${escapeHTML(a.id)}">${escapeHTML(a.matricula)} (${escapeHTML(a.modelo)})</option>`;
                });
                if (prevDest && destPlanes.some(a => a.id === prevDest)) {
                    migPlaneTo.value = prevDest;
                }
            }
        }

        function populateSingleFlightSelect(preferredFlightId = null) {
            const fromId = migPlaneFrom.value;
            const dateVal = migDateBase.value;
            const flights = (window.AppData.asignacionFlota || [])
                .filter(a => a.id_aeronave === fromId && a.fecha === dateVal)
                .sort((x, y) => timeToMins(x.horaInicio) - timeToMins(y.horaInicio));
            migSingleFlight.innerHTML = '';
            if (flights.length === 0) {
                migSingleFlight.innerHTML = '<option value="">-- Sin vuelos programados en esta fecha --</option>';
            } else {
                flights.forEach((f, idx) => {
                    const capText = f.capitan ? ` | Cap: ${escapeHTML(f.capitan)}` : '';
                    migSingleFlight.innerHTML += `<option value="${escapeHTML(f.id)}">Vuelo #${idx + 1} (${escapeHTML(f.horaInicio)} - ${escapeHTML(f.horaFin)})${capText}</option>`;
                });
                if (preferredFlightId && flights.some(f => f.id === preferredFlightId)) {
                    migSingleFlight.value = preferredFlightId;
                }
            }
        }

        function refreshMigrateUI(preferredFlightId = null) {
            const scope = migScope.value;
            if (scope === 'all') {
                migDateWrapper.style.display = 'none';
                migSingleFlightWrapper.style.display = 'none';
                migWeekRangeHint.style.display = 'none';
            } else if (scope === 'week') {
                migDateWrapper.style.display = 'block';
                migDateLabel.textContent = 'Inicio de Semana (7 días consecutivos)';
                migSingleFlightWrapper.style.display = 'none';
                const endStr = addDaysYMD(migDateBase.value, 6);
                migWeekRangeHint.textContent = endStr ? `Rango seleccionado: ${migDateBase.value} hasta ${endStr}` : '';
                migWeekRangeHint.style.display = endStr ? 'block' : 'none';
            } else if (scope === 'day') {
                migDateWrapper.style.display = 'block';
                migDateLabel.textContent = 'Día a Migrar';
                migSingleFlightWrapper.style.display = 'none';
                migWeekRangeHint.style.display = 'none';
            } else {
                migDateWrapper.style.display = 'block';
                migDateLabel.textContent = 'Fecha del Vuelo';
                migSingleFlightWrapper.style.display = 'block';
                migWeekRangeHint.style.display = 'none';
                populateSingleFlightSelect(preferredFlightId);
            }

            const fromId = migPlaneFrom.value;
            const toId = migPlaneTo.value;
            const fromPlane = (window.AppData.aeronaves || []).find(a => a.id === fromId);
            const toPlane = (window.AppData.aeronaves || []).find(a => a.id === toId);
            const { candidates, rangeStart, rangeEnd } = getMigrationCandidates({
                scope,
                fromPlaneId: fromId,
                dateBase: migDateBase.value,
                flightId: migSingleFlight.value
            });

            const conflicts = toId
                ? candidates.filter(asg => checkOverlap(toId, asg.fecha, asg.horaInicio, asg.horaFin, asg.id))
                : [];
            const forceOverlapPreview = !!migForceOverlap.checked;
            const eligibleCandidates = forceOverlapPreview
                ? candidates
                : candidates.filter(asg => !conflicts.includes(asg));
            const paxCount = countAffectedPassengers(eligibleCandidates, fromPlane);
            const scopeDesc = scope === 'single'
                ? '1 vuelo específico'
                : scope === 'day'
                    ? `Día ${escapeHTML(rangeStart)}`
                    : scope === 'week'
                        ? `Semana (${escapeHTML(rangeStart)} al ${escapeHTML(rangeEnd)})`
                        : 'Todos los vuelos programados';

            migPreviewBox.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
                    <span><strong>Alcance:</strong> ${scopeDesc}</span>
                    <span><strong>Ruta:</strong> ${fromPlane ? escapeHTML(fromPlane.matricula) : '—'} → ${toPlane ? escapeHTML(toPlane.matricula) : '—'}</span>
                </div>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <span><i class="fas fa-plane-departure" style="color: var(--brand-action);"></i> Vuelos a migrar: <strong>${candidates.length}</strong></span>
                    <span><i class="fas fa-users" style="color: var(--brand-success);"></i> Pasajeros reasignados: <strong>${paxCount}</strong></span>
                    ${conflicts.length > 0 ? `<span style="color: var(--brand-danger);"><i class="fas fa-exclamation-triangle"></i> Conflictos horarios: <strong>${conflicts.length}</strong></span>` : `<span style="color: var(--brand-success);"><i class="fas fa-check-circle"></i> Sin conflictos horarios</span>`}
                </div>
            `;
        }

        function openMigrateModal(opts = {}) {
            migScope.value = opts.scope || 'day';
            migDateBase.value = opts.dateBase || dateFilter.value || today;
            migForceOverlap.checked = false;
            populateMigratePlaneSelects(opts.fromPlaneId || planeSelect.value || null);
            refreshMigrateUI(opts.flightId || null);

            modalMigrate.style.display = 'flex';
            void modalMigrate.offsetWidth;
            modalMigrate.style.opacity = '1';
            modalMigContent.style.transform = 'translateY(0)';
        }

        function closeMigrateModal() {
            modalMigrate.style.opacity = '0';
            modalMigContent.style.transform = 'translateY(-20px)';
            setTimeout(() => { modalMigrate.style.display = 'none'; }, 300);
        }

        if (btnMigrateFlights) btnMigrateFlights.addEventListener('click', () => openMigrateModal());
        if (btnCancelMig) btnCancelMig.addEventListener('click', closeMigrateModal);
        if (btnCancelMigTop) btnCancelMigTop.addEventListener('click', closeMigrateModal);
        modalMigrate.addEventListener('click', (e) => { if (e.target === modalMigrate) closeMigrateModal(); });

        migScope.addEventListener('change', () => refreshMigrateUI());
        migPlaneFrom.addEventListener('change', () => {
            populateMigrateDestSelect();
            refreshMigrateUI();
        });
        migPlaneTo.addEventListener('change', () => refreshMigrateUI());
        migDateBase.addEventListener('change', () => refreshMigrateUI());
        migSingleFlight.addEventListener('change', () => refreshMigrateUI());
        migForceOverlap.addEventListener('change', () => refreshMigrateUI());

        btnConfirmMig.addEventListener('click', async () => {
            const scope = migScope.value;
            const fromPlaneId = migPlaneFrom.value;
            const toPlaneId = migPlaneTo.value;
            const dateBase = migDateBase.value;
            const flightId = migSingleFlight.value;
            const forceOverlap = !!migForceOverlap.checked;

            if (!fromPlaneId || !toPlaneId) {
                const msg = 'Debes seleccionar una aeronave origen y una aeronave destino operativa.';
                return window.showAlert ? window.showAlert(msg, { type: 'warning', title: 'Datos Incompletos' }) : alert(msg);
            }
            if (scope === 'single' && !flightId) {
                const msg = 'Selecciona el vuelo específico que deseas migrar.';
                return window.showAlert ? window.showAlert(msg, { type: 'warning', title: 'Vuelo Requerido' }) : alert(msg);
            }

            const fromPlane = (window.AppData.aeronaves || []).find(a => a.id === fromPlaneId);
            const toPlane = (window.AppData.aeronaves || []).find(a => a.id === toPlaneId);
            const { candidates, rangeStart, rangeEnd } = getMigrationCandidates({ scope, fromPlaneId, dateBase, flightId });

            if (candidates.length === 0) {
                const msg = 'No hay vuelos programados para migrar con los criterios seleccionados.';
                return window.showAlert ? window.showAlert(msg, { type: 'info', title: 'Sin Vuelos' }) : alert(msg);
            }

            const conflicts = candidates.filter(asg => checkOverlap(toPlaneId, asg.fecha, asg.horaInicio, asg.horaFin, asg.id));
            if (!forceOverlap && conflicts.length === candidates.length) {
                const msg = 'Todos los vuelos seleccionados presentan conflicto de horario en la aeronave destino (incluye margen logístico de 15 min). Activa la opción "Permitir migración aunque exista cruce de horario" si deseas forzarla.';
                return window.showAlert ? window.showAlert(msg, { type: 'danger', title: 'Conflicto de Horarios' }) : alert(msg);
            }

            const eligibleCandidates = forceOverlap
                ? candidates
                : candidates.filter(asg => !conflicts.includes(asg));
            const paxCount = countAffectedPassengers(eligibleCandidates, fromPlane);
            const scopeLabel = scope === 'single'
                ? '1 vuelo específico'
                : scope === 'day'
                    ? `los vuelos del día ${rangeStart}`
                    : scope === 'week'
                        ? `los vuelos de la semana (${rangeStart} al ${rangeEnd})`
                        : 'TODOS los vuelos programados';
            const willMigrateCount = eligibleCandidates.length;
            const conflictNote = (!forceOverlap && conflicts.length > 0)
                ? `\n• ${conflicts.length} vuelo(s) se omitirán por cruce horario en destino.`
                : '';

            const confirmText =
                `¿Confirmas migrar ${scopeLabel} desde ${fromPlane.matricula} hacia ${toPlane.matricula}?\n\n` +
                `• Vuelos a transferir: ${willMigrateCount}\n` +
                `• Pasajeros activos que se reasignarán automáticamente: ${paxCount}${conflictNote}`;

            const ok = window.showConfirm
                ? await window.showConfirm(confirmText, { title: 'Confirmar Migración de Vuelos', type: 'warning' })
                : confirm(confirmText);
            if (!ok) return;

            const result = migrateFlights({ scope, fromPlaneId, toPlaneId, dateBase, flightId, forceOverlap });
            if (!result.ok) {
                return window.showAlert ? window.showAlert(result.error, { type: 'danger', title: 'No se pudo migrar' }) : alert(result.error);
            }

            closeMigrateModal();
            renderGantt();

            const summaryMsg =
                `Se migraron ${result.migratedCount} vuelo(s) de ${result.fromPlane.matricula} a ${result.toPlane.matricula}.` +
                (result.migratedPassengersCount > 0 ? `\nPasajeros actualizados: ${result.migratedPassengersCount}.` : '') +
                (result.skippedCount > 0 ? `\nVuelos omitidos por conflicto horario: ${result.skippedCount}.` : '');

            if (window.showAlert) {
                window.showAlert(summaryMsg, { type: 'success', title: 'Migración Completada' });
            } else {
                alert(summaryMsg);
            }
        });

    }
};
