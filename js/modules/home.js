window.Modules = window.Modules || {};
window.Modules.home = {
    render: (container) => {
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2>Itinerario</h2>
            </div>
            
            <div class="card">
                <div class="home-table-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                    <h3 style="margin: 0;">Próximos Vuelos</h3>
                    <input type="date" id="home-date-filter" class="form-control" style="width: 200px; background: var(--bg-main);">
                </div>
                
                <div class="table-responsive">
                <table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border-color); background: var(--bg-surface-hover);">
                            <th style="padding: 1rem;">Vuelo</th>
                            <th style="padding: 1rem;">Pasajero</th>
                            <th style="padding: 1rem;">Instructor</th>
                            <th style="padding: 1rem;">Aeronave</th>
                            <th style="padding: 1rem;">Estado (Pax)</th>
                            <th style="padding: 1rem;">Estado del Vuelo</th>
                        </tr>
                    </thead>
                    <tbody id="home-flights-table">
                        <!-- Rendered dynamically -->
                    </tbody>
                </table>
                </div>
            </div>
        `;
    },
    init: () => {
        const tbody = document.getElementById('home-flights-table');
        const dateFilter = document.getElementById('home-date-filter');
        
        // Initialize date filter to today
        const todayStr = new Date().toLocaleDateString('en-CA');
        dateFilter.value = todayStr;

        function renderTable() {
            tbody.innerHTML = '';
            
            if(!window.AppData || !window.AppData.passengers) return;

            const selectedDate = dateFilter.value;

            // Filter by date and sort globally by time
            const filteredPax = window.AppData.passengers.filter(p => {
                const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
                return p.date === selectedDate && !isCancelled;
            });
            
            filteredPax.sort((a, b) => {
                if (!a.time || !b.time) return 0;
                return a.time.localeCompare(b.time);
            });

            if (filteredPax.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" style="padding: 2rem; text-align: center; color: var(--text-secondary);">No hay vuelos registrados para esta fecha.</td></tr>';
                return;
            }

            filteredPax.forEach((pax, index) => {
                // Determine styles for paxStatus
                let paxStatusStyle = 'color: var(--text-secondary); background: var(--bg-surface-hover);';
                if (pax.paxStatus === 'Check-in Listo') {
                    paxStatusStyle = 'color: var(--brand-success); background: rgba(16,185,129,0.1);';
                } else if (pax.paxStatus === 'Pendiente Check-in') {
                    paxStatusStyle = 'color: var(--brand-action); background: rgba(255,152,0,0.1);';
                }

                // Determine styles for flightStatus
                let flightStatusStyle = 'color: var(--text-secondary); background: var(--bg-surface-hover);';
                if (pax.flightStatus === 'A tiempo / On-Time' || pax.flightStatus === 'Despegó') {
                    flightStatusStyle = 'color: var(--brand-success); background: rgba(16,185,129,0.1);';
                } else if (pax.flightStatus === 'Demorado / Delay') {
                    flightStatusStyle = 'color: var(--brand-action); background: rgba(255,152,0,0.1);';
                } else if (pax.flightStatus === 'Adelantado / Early') {
                    flightStatusStyle = 'color: var(--brand-success); background: rgba(16,185,129,0.2);';
                } else if (pax.flightStatus === 'Cancelado / Cancelled') {
                    flightStatusStyle = 'color: var(--brand-danger); background: rgba(239,68,68,0.1);';
                }

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = `
                    <td style="padding: 1rem; font-weight: 600;">${escapeHTML(pax.vueloNum || '---')}</td>
                    <td style="padding: 1rem;">
                        <span class="display-val">${escapeHTML(pax.name || '')}</span>
                    </td>
                    <td style="padding: 1rem;">
                        <span class="display-val">${escapeHTML(pax.instructor || '')}</span>
                    </td>
                    <td style="padding: 1rem;">
                        <span class="display-val">${escapeHTML(pax.aeronave || 'Sin asignar')}</span>
                    </td>
                    <td style="padding: 1rem;">
                        <span class="display-val" style="${paxStatusStyle} padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${escapeHTML(pax.paxStatus || '')}</span>
                    </td>
                    <td style="padding: 1rem;">
                        <span class="display-val" style="${flightStatusStyle} padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600;">${escapeHTML(pax.flightStatus || '')} ${(pax.flightStatus === 'Demorado / Delay' || pax.flightStatus === 'Adelantado / Early') && pax.estimatedTime ? '(' + escapeHTML(pax.estimatedTime) + ')' : ''}</span>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }

        renderTable();
        
        dateFilter.addEventListener('change', renderTable);
    }
};
