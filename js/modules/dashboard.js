window.Modules = window.Modules || {};

window.Modules.dashboard = {
    render: (container) => {
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
        
        // Safe data access
        const paxs = window.AppData?.passengers || [];
        const pilots = window.AppData?.pilots || [];
        const pettyCash = window.AppData?.pettyCash || [];
        
        const filterMode = window.AppData?.dashboardFilterMode || 'date';
        const todayStr = window.AppData?.dashboardFilterDate || (filterMode === 'month' ? new Date().toLocaleDateString('en-CA').substring(0,7) : new Date().toLocaleDateString('en-CA'));
        const parts = todayStr.split('-');
        let todayFormatted = todayStr;
        if (parts.length === 3) {
            todayFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`;
        } else if (parts.length === 2) {
            todayFormatted = `${parts[1]}/${parts[0]}`;
        }
        
        // 1. Calculate Jumps and Income for Today/Month
        const todayPaxs = paxs.filter(p => {
            const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
            return p.date && p.date.startsWith(todayStr) && !isCancelled;
        });
        const landedPaxs = todayPaxs.filter(p => p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado');
        const jumpsToday = landedPaxs.length;
        
        let lblHoy = 'Hoy';
        const realTodayStr = new Date().toLocaleDateString('en-CA');
        if (filterMode === 'month') {
            lblHoy = (todayStr === realTodayStr.substring(0,7)) ? 'Mes' : todayFormatted;
        } else {
            lblHoy = (todayStr === realTodayStr) ? 'Hoy' : todayFormatted;
        }
        
        let todayIncome = 0;
        let iTandem = 0, iFun = 0, iCopiloto = 0, iAdicionales = 0;

        todayPaxs.forEach(p => {
            const paid = p.financiera?.totalPaid || 0;
            todayIncome += paid;

            let pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let basePrice = 850000; // default Tandem
            if (pType.includes('copiloto')) basePrice = 1200000;
            else if (pType.includes('fun')) basePrice = 150000;
            
            if (p.financiera?.manualPrice && p.financiera.manualPrice > 0) {
                basePrice = p.financiera.manualPrice;
            }

            let allocatedBase = Math.min(paid, basePrice);
            let allocatedExtras = Math.max(0, paid - allocatedBase);

            if (pType.includes('tandem')) iTandem += allocatedBase;
            else if (pType.includes('copiloto')) iCopiloto += allocatedBase;
            else iFun += allocatedBase;

            iAdicionales += allocatedExtras;
        });
        
        // 2. Instructors
        const employees = window.AppData?.employees || [];
        const activeInst = employees.filter(e => e.role && e.role.includes('Instructor') && e.status === 'Activo').length;

        // 3. Petty Cash Balance
        let cashBalance = 0;
        pettyCash.forEach(tx => {
            if (tx.type === 'IN') cashBalance += tx.amount;
            else if (tx.type === 'OUT') cashBalance -= tx.amount;
        });
        
        // 4. Upcoming Flights
        const flightsMap = new Map();
        todayPaxs.forEach(p => {
            if (p.flightStatus === 'Completado' || p.flightStatus === 'Aterrizó' || p.paxStatus === 'Cancelado') return;
            const vNum = p.vueloNum || p.time;
            const key = `${p.aeronave}_${vNum}`;
            if (!flightsMap.has(key)) {
                flightsMap.set(key, { aeronave: p.aeronave, time: p.time, status: p.flightStatus, paxs: 1 });
            } else {
                flightsMap.get(key).paxs++;
            }
        });
        const upcomingFlights = Array.from(flightsMap.values())
            .sort((a, b) => a.time.localeCompare(b.time))
            .slice(0, 3);
        
        // 5. Period Distributions (Calculated based on selected filter date/month)
        let countTandem = 0;
        let countFun = 0;
        let countAFF = 0;
        let countCoach = 0;
        let countCamaras = 0;
        landedPaxs.forEach(p => {
            const pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (pType.includes('tandem')) countTandem++;
            else if (pType.includes('aff')) countAFF++;
            else if (pType.includes('coach')) countCoach++;
            else countFun++;
            
            if (p.adiciones) {
                Object.keys(p.adiciones).forEach(k => {
                    let kt = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (kt.includes('camara') || kt.includes('gopro')) countCamaras++;
                });
            }
        });
        
        const totalMonth = countTandem + countFun + countAFF + countCoach + countCamaras || 1;
        const pctTandem = Math.round((countTandem / totalMonth) * 100);
        const pctFun = Math.round((countFun / totalMonth) * 100);
        const pctAFF = Math.round((countAFF / totalMonth) * 100);
        const pctCoach = Math.round((countCoach / totalMonth) * 100);
        const pctCamaras = Math.round((countCamaras / totalMonth) * 100);

        const formatCur = (num) => '$' + parseInt(num || 0, 10).toLocaleString('es-CO');

        const getStatusColor = (statusStr) => {
            switch(statusStr) {
                case 'Programado': return 'var(--text-secondary)';
                case 'En Espera': return 'var(--brand-warning)';
                case 'Abordando': return 'var(--brand-success)';
                case 'En El Aire': return 'var(--brand-blue-light)';
                case 'Paracaidistas en el aire': return 'var(--brand-purple)';
                default: return 'var(--text-primary)';
            }
        };

        container.innerHTML = `
            <style>
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .dash-card {
                    background: var(--bg-surface);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                    border: 1px solid var(--border-color);
                    position: relative;
                    overflow: hidden;
                    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .dash-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 30px rgba(0,0,0,0.12);
                }
                .dash-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 4px;
                }
                .card-c1::before { background: linear-gradient(90deg, #0ea5e9, #38bdf8); }
                .card-c2::before { background: linear-gradient(90deg, #10b981, #34d399); }
                .card-c3::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
                .card-c4::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); }

                .dash-icon {
                    position: absolute;
                    top: 1.25rem; right: 1.25rem;
                    font-size: 2.2rem;
                    opacity: 0.15;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                    color: currentColor;
                }
                .dash-card:hover .dash-icon {
                    opacity: 0.3;
                    transform: scale(1.1) rotate(5deg);
                }
                
                .kpi-title { font-size: 0.95rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0.25rem; }
                .kpi-value { font-size: 2.5rem; font-weight: 800; margin: 0.25rem 0 0 0; color: var(--text-primary); letter-spacing: -1px; }
                
                .progress-bar-bg { width: 100%; height: 10px; background: var(--bg-surface-hover); border-radius: 5px; overflow: hidden; margin-top: 0.5rem; }
                .progress-bar-fill { height: 100%; border-radius: 5px; transition: width 1s ease-out; }
            </style>

            <div class="dashboard-module">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h2 style="margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -0.5px; color: var(--text-primary);">Panel de Control</h2>
                        <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.95rem;">
                            <span>Filtro de operaciones:</span>
                            <select id="dash-filter-mode" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 6px; padding: 0.4rem; outline: none; font-weight: 600; cursor: pointer;">
                                <option value="date" ${filterMode === 'date' ? 'selected' : ''}>Día Específico</option>
                                <option value="month" ${filterMode === 'month' ? 'selected' : ''}>Mes Completo</option>
                            </select>
                            <input type="${filterMode}" id="dash-filter-date" value="${todayStr}" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 6px; padding: 0.4rem 0.75rem; outline: none; font-family: inherit; font-weight: 600; cursor: pointer; transition: border-color 0.2s;">
                        </div>
                    </div>
                    <button id="btn-reporte-ejecutivo" class="btn btn-primary" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(59,130,246,0.3); font-weight: 600; padding: 0.6rem 1.25rem;"><i class="fas fa-chart-line"></i> Reporte Ejecutivo</button>
                </div>

                <!-- KPI Grid -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                    <div class="dash-card card-c1" style="animation-delay: 0.1s;">
                        <i class="fas fa-parachute-box dash-icon" style="color: #0ea5e9;"></i>
                        <div class="kpi-title">Saltos ${lblHoy}</div>
                        <div class="kpi-value">${jumpsToday}</div>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #0ea5e9; font-weight: 600;"><i class="fas fa-arrow-trend-up"></i> Operación ${lblHoy}</p>
                    </div>
                    <div class="dash-card card-c2" style="animation-delay: 0.2s;">
                        <i class="fas fa-sack-dollar dash-icon" style="color: #10b981;"></i>
                        <div class="kpi-title">Ingresos Estimados</div>
                        <div class="kpi-value">${formatCur(todayIncome)}</div>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #10b981; font-weight: 600;">Bruto Proyectado</p>
                    </div>
                    <div class="dash-card card-c3" style="animation-delay: 0.3s;">
                        <i class="fas fa-wallet dash-icon" style="color: #f59e0b;"></i>
                        <div class="kpi-title">Caja Menor</div>
                        <div class="kpi-value">${formatCur(cashBalance)}</div>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #f59e0b; font-weight: 600;">Balance Actual</p>
                    </div>
                    <div class="dash-card card-c4" style="animation-delay: 0.4s;">
                        <i class="fas fa-users-cog dash-icon" style="color: #8b5cf6;"></i>
                        <div class="kpi-title">Plantilla Pilotos</div>
                        <div class="kpi-value">${activeInst}</div>
                        <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #8b5cf6; font-weight: 600;">Registrados en Sistema</p>
                    </div>
                </div>
                
                <!-- Lower Section -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
                    
                    <!-- Próximos Vuelos -->
                    <div class="dash-card" style="animation-delay: 0.5s; padding: 0;">
                        <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color); background: rgba(0,0,0,0.02);">
                            <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-primary);"><i class="fas fa-plane-departure" style="color: var(--brand-action); margin-right: 0.5rem;"></i> Próximos Vuelos</h3>
                        </div>
                        <div style="padding: 1rem 1.5rem;">
                            ${upcomingFlights.length > 0 ? upcomingFlights.map(v => `
                                <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px dashed var(--border-color);">
                                    <div>
                                        <div style="font-weight: 600; font-size: 1.05rem; color: var(--text-primary);">${escapeHTML(v.time)} - ${escapeHTML(v.aeronave)}</div>
                                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">${v.paxs} Pasajeros</div>
                                    </div>
                                    <div style="padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; background: var(--bg-surface-hover); color: ${getStatusColor(v.status)}; border: 1px solid ${getStatusColor(v.status)};">
                                        ${escapeHTML(v.status)}
                                    </div>
                                </div>
                            `).join('') : '<div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-secondary);"><i class="fas fa-check-circle" style="font-size: 2rem; opacity: 0.5; margin-bottom: 0.5rem; display: block;"></i>No hay vuelos próximos pendientes encontrados.</div>'}
                            
                            <div style="margin-top: 1.5rem; text-align: center;">
                                <a href="#/manifest" style="color: var(--brand-action); font-size: 0.9rem; text-decoration: none; font-weight: 600; transition: opacity 0.2s;">Ver Manifiesto Completo <i class="fas fa-arrow-right"></i></a>
                            </div>
                        </div>
                    </div>

                    <!-- Distribución de Saltos -->
                    <div class="dash-card" style="animation-delay: 0.6s;">
                        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; color: var(--text-primary);"><i class="fas fa-chart-pie" style="color: var(--brand-success); margin-right: 0.5rem;"></i> Distribución de Saltos (${lblHoy})</h3>
                        
                        <div style="position: relative; height: 200px; width: 100%; margin-bottom: 1.5rem; display: flex; justify-content: center;">
                            <canvas id="monthDistributionChart"></canvas>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem; font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">
                                <span><i class="fas fa-parachute-box" style="color: #0ea5e9; margin-right:5px;"></i> Tándem <span style="color: var(--text-secondary); font-size: 0.85rem; font-weight: normal;">(${countTandem})</span></span>
                                <span>${pctTandem}%</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${pctTandem}%; background: linear-gradient(90deg, #0ea5e9, #38bdf8);"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem; font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">
                                <span><i class="fas fa-user-astronaut" style="color: #10b981; margin-right:5px;"></i> Fun Jumper <span style="color: var(--text-secondary); font-size: 0.85rem; font-weight: normal;">(${countFun})</span></span>
                                <span>${pctFun}%</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${pctFun}%; background: linear-gradient(90deg, #059669, #10b981);"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem; font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">
                                <span><i class="fas fa-plane" style="color: #f59e0b; margin-right:5px;"></i> AFF <span style="color: var(--text-secondary); font-size: 0.85rem; font-weight: normal;">(${countAFF})</span></span>
                                <span>${pctAFF}%</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${pctAFF}%; background: linear-gradient(90deg, #f59e0b, #fbbf24);"></div>
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem; font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">
                                <span><i class="fas fa-chalkboard-teacher" style="color: #8b5cf6; margin-right:5px;"></i> Coach <span style="color: var(--text-secondary); font-size: 0.85rem; font-weight: normal;">(${countCoach})</span></span>
                                <span>${pctCoach}%</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${pctCoach}%; background: linear-gradient(90deg, #8b5cf6, #a78bfa);"></div>
                            </div>
                        </div>

                        <div>
                            <div style="display:flex; justify-content:space-between; margin-bottom: 0.4rem; font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">
                                <span><i class="fas fa-video" style="color: #ec4899; margin-right:5px;"></i> Cámaras <span style="color: var(--text-secondary); font-size: 0.85rem; font-weight: normal;">(${countCamaras})</span></span>
                                <span>${pctCamaras}%</span>
                            </div>
                            <div class="progress-bar-bg">
                                <div class="progress-bar-fill" style="width: ${pctCamaras}%; background: linear-gradient(90deg, #ec4899, #f472b6);"></div>
                            </div>
                        </div>
                    </div>

                    <!-- Distribución Ingresos Hoy -->
                    <div class="dash-card" style="animation-delay: 0.7s;">
                        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; color: var(--text-primary);"><i class="fas fa-hand-holding-dollar" style="color: #f59e0b; margin-right: 0.5rem;"></i> Ingresos Estimados (${lblHoy})</h3>
                        
                        <div style="position: relative; height: 200px; width: 100%; margin-bottom: 1.5rem; display: flex; justify-content: center;">
                            <canvas id="incomeDistributionChart"></canvas>
                        </div>
                    </div>
                    
                    <!-- Ventas Tienda -->
                    <div class="dash-card" style="animation-delay: 0.8s;">
                        <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; color: var(--text-primary);"><i class="fas fa-shopping-basket" style="color: #8b5cf6; margin-right: 0.5rem;"></i> Productos Tienda Vendidos (${lblHoy})</h3>
                        
                        <div style="position: relative; height: 200px; width: 100%; margin-bottom: 1.5rem; display: flex; justify-content: center;">
                            <canvas id="storeProductsChart"></canvas>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- Modal Reporte Ejecutivo -->
            <div id="modal-reporte-ejecutivo" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 10000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 800px; max-width: 95%; max-height: 90vh; overflow-y: auto; background: #fff; color: #333; position: relative; border-radius: 12px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
                    <button id="btn-close-reporte" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: #666; font-size: 1.5rem; border: none; cursor: pointer;"><i class="fas fa-times"></i></button>
                    
                    <div id="reporte-printable" style="padding: 2.5rem; background: #fff;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABAAAAAHhCAYAAADwPcwDAAAQAElEQVR4AeydB4AcVf3Hf2/2LoWEkNBydwlFpGgQRINAcgkE6SgqIhFyRwBRsWLvLSp2/dsLNlouwaCIItIlklxCEaQG6S25S+glkOTKvP/ve8kme3dbZmZndt7ufvfe25l5897v/d5n9mbm/V7zhB8SIAESIAESIAESIAESIAESIAESIIFaJyA0ANT8JWYBSYAESIAESIAESIAESIAESIAESEBoAOCPgARIgARIgARIgARIgARIgARIgARqnoAWkD0AFAIdCZAACZAACZAACZAACZAACZAACdQyAZSNBgBQoCcBEiABEiABEiABEiABEiABEiCB2iUwUDIaAAYw8IsESIAESIAESIAESIAESIAESIAEapXAxnLRALCRA79JgARIgARIgARIgARIgARIgARIoDYJbCoVDQCbQHBDAiRAAiRAAiRAAiRAAiRAAiRAArVIIFsmGgCyJLglARIgARIgARIgARIgARIgARIggdojsLlENABsRsEdEiABEiABEiABEiABEiABEiABEqg1AlvKQwPAFhbcIwESIAESIAESIAESIAESIAESIIHaIpBTGhoAcmBwlwRIgARIgARIgARIgARIgARIgARqiUBuWWgAyKXBfRIgARIgARIgARIgARIgARIgARKoHQKDSkIDwCAcPCABEiABEiABEiABEiABEiABEiCBWiEwuBw0AAzmwSMSIAESIAESIAESIAESIAESIAESqA0CQ0pBA8AQIDwkARIgARIgARIgARIgARIgARIggVogMLQMNAAMJcJjEiABEiABEiABEiABEiABEiABEqh+AsNKQAPAMCQMIAESIAESIAESIAESIAESIAESIIFqJzBcfxoAhjNhCAmQAAmQAAmQAAmQAAmQAAmQAAlUN4E82tMAkAcKg0iABEiABEiABEiABEiABEiABEigmgnk050GgHxUGEYCJEACJEACJEACJEACJEACJEAC1Usgr+Y0AOTFwkASIAESIAESIAESIAESIAESIAESqFYC+fWmASA/F4aSAAmQAAmQAAmQAAmQAAmQAAmQQHUSKKA1DQAFwDCYBEiABEiABEiABEiABEiABEiABKqRQCGdaQAoRIbhJEACJEACJEACJEACJEACJEACJFB9BApqTANAQTQ8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QALlJEADQDlpMy8SIAESIAESIAESIIFmAvSRAAmQAAmUlQANAGXFzcxIgARIgARIgARIgAQcAbokQAIkQALlJUADQHl5MzcSIAESIAESIAESIIEEAX6SAAmQAAmUmQANAGUGzuxIgARIgARIgARIgARAgCIBEiABEig3ARoAyk2c+ZEACZAACZAACZAACYiQAQmQAAmQQNkJ0ABQduTMkARIgARIgARIgARIgARIgARIgATKT4AGgPIzZ44kQAIkQAIkQAIk0NkJsP4kQAIkQAIVIEADQAWgM0sSIAESIAESIAES6NwEWHsSIAESIIFKEKABoBLUmScJkAAJkAAJkAAJdGYCrDsJkAAJkEBFCNAAUBHszJQESIAESIAESIAEOi8B1pwESIAESKAyBGgAqAx35koCJEACJEACJEACnZUA600CJEACJFAhAjQAVAg8syUBEiABEiABEiCBzkmAtSYBEiABEqgUARoAKkWe+ZIACZAACZAACZBAZyTAOpMACZAACVSMAA0AFUPPjEmABEiABEiABEig8xFgjUmABEiABCpHgAaAyrFnziRAAiRAAiRAAiTQ2QiwviRAAiRAAhUkQANABeEzaxIgARIgARIgARLoXARYWxIgARIggUoSoAGgkvSZNwmQAAmQAAmQAAl0JgKsKwmQAAmQQEUJ0ABQUfzMnARIgARIgARIgAQ6DwHWlARIgARIoLIEaACoLH/mTgIkQAIkQAIkQAKdhQDrSQIkQAIkUGECNABU+AIwexIgARIgARIgARLoHARYSxIgARIggUoToAGg0leA+ZMACZAACZAACZBAZyDAOpIACZAACVScAA0AFb8ELAAJkAAJkAAJkAAJdHwCrCEJkAAJkEDlCdAAUPlrwBKQAAmQAAmQAAmQQEcnwPqRAAmQAAmEgAANACG4CCwCCZAACZAACZAACXRsAqwdCZAACZBAGAjQABCGq8AykAAJkAAJkAAJkEBHJsC6kQAJkAAJhIIADQChuAwsBAmQAAmQAAmQAAl0XAKsGQmQAAmQQDgI0AAQjuvAUpAACZAACZAACZBARyXAepEACZAACYSEAA0AIbkQLAYJkAAJkAAJkAAJdEwCrBUJkAAJkEBYCNAAEJYrwXKQAAmQAAmQAAmQQEckwDqRAAmQAAmEhgANAKG5FCwICZAACZAACZAACXQ8AqwRCZAACZBAeAjQABCea8GSkAAJkAAJkAAJkEBHI8D6kAAJkAAJhIgADQAhuhgsCgmQAAmQAAmQAAl0LAKsDQmQAAmQQJgI0AAQpqvBspAACZAACZAACZBARyLAupAACZAACYSKAA0AobocLAwJkAAJkAAJkAAJdBwCrAkJkAAJkEC4CNAAEK7rwdKQAAmQAAmQAAmQQEchwHqQAAmQAAmEjAANACG7ICwOCZAACZAACZAACXQMAqwFCZAACZBA2AjQABC2K8LykAAJkAAJkAAJkEBHIMA6kAAJkAAJhI4ADQChuyQsEAmQAAmQAAmQAAm0fwKsAQmQAAmQQPgI0AAQvmvCEpEACZAACZAACZBAeyfA8pMACZAACYSQAA0AIbwoLBIJkAAJkAAJkAAJtG8CLD0JkAAJkEAYCdAAEMarwjKRAAmQAAmQAAmQQHsmwLKTAAmQAAmEkgANAKG8LCwUCZAACZAACZAACbRfAiw5CZAACZBAOAnQABDO68JSkQAJkAAJkAAJkEB7JcBykwAJkAAJhJQADQAhvTAsFgmQAAmQAAmQAAm0TwIsNQmQAAmQQFgJ0AAQ1ivDcpEACZAACZAACZBAeyTAMpMACZAACYSWAA0Aob00LBgJkAAJkAAJkAAJtD8CLDEJkAAJkEB4CdAAEN5rw5KRAAmQAAmQAAmQQHsjwPKSAAmQAAmEmAANACG+OCwaCZAACZAACZAACbQvAiwtCZAACZBAmAnQABDmq8OykQAJkAAJkAAJkEB7IsCykgAJkAAJhJoADQChvjwsHAmQAAmQAAmQAAm0HwIsKQmQAAmQQLgJ/D8AAAD//7P8qmcAAAAGSURBVAMAPsCXsMJY3e0AAAAASUVORK5CYII=" alt="Logo" style="height: 60px; object-fit: contain;">
                            <div style="text-align: right;">
                                <h2 style="margin: 0; color: #111; font-size: 1.6rem; text-transform: uppercase; font-weight: 800;">Reporte Ejecutivo</h2>
                                <p style="margin: 0.2rem 0 0 0; color: #666; font-size: 0.9rem;">Fecha de Reporte: <span id="rep-fecha" style="font-weight: 600; color: #333;"></span></p>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.25rem; background: #fafafa;">
                                <h3 style="margin-top: 0; color: #111; font-size: 1.1rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.75rem;"><i class="fas fa-money-bill-wave" style="color: #10b981;"></i> Resumen de Ingresos</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Tándem:</span> <strong id="rep-ing-tandem">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Fun Jumper:</span> <strong id="rep-ing-fun">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Copiloto:</span> <strong id="rep-ing-cop">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Adicionales:</span> <strong id="rep-ing-add">$0</strong></div>
                                <div id="rep-ing-add-details" style="font-size: 0.8rem; color: #666; padding-left: 1rem; margin-bottom: 0.75rem;"></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Tienda / Merch:</span> <strong id="rep-ing-store">$0</strong></div>
                                <div id="rep-ing-store-details" style="font-size: 0.8rem; color: #666; padding-left: 1rem; margin-bottom: 0.75rem;"></div>
                                <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 0.75rem; border-top: 1px dashed #ccc; font-size: 1.2rem; color: #111;"><strong>TOTAL BRUTO:</strong> <strong id="rep-ing-total" style="color: #10b981;">$0</strong></div>
                            </div>
                            
                            <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 1.25rem; background: #fafafa;">
                                <h3 style="margin-top: 0; color: #111; font-size: 1.1rem; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.75rem;"><i class="fas fa-parachute-box" style="color: #0ea5e9;"></i> Resumen Operativo</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Saltos Totales:</span> <strong id="rep-op-jumps">0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Instructores Activos:</span> <strong id="rep-op-inst">0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Caja Menor (Balance):</span> <strong id="rep-op-cash">$0</strong></div>
                                
                                <h4 style="margin: 1.5rem 0 0.5rem 0; color: #333; font-size: 0.95rem;">Distribución de Saltos</h4>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem; font-size: 0.9rem;"><span style="color: #666;">Tándem (${lblHoy}):</span> <strong id="rep-mes-tandem">0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem; font-size: 0.9rem;"><span style="color: #666;">Fun Jumper (${lblHoy}):</span> <strong id="rep-mes-fun">0</strong></div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; color: #999; font-size: 0.85rem; margin-top: 3rem; border-top: 1px solid #eee; padding-top: 1rem;">
                            Documento generado automáticamente por Fraterno App
                        </div>
                    </div>
                    
                    <div style="padding: 1rem 2rem; background: #f8f9fa; border-top: 1px solid #eee; text-align: right; border-radius: 0 0 12px 12px;">
                        <button id="btn-export-pdf" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 1.05rem; font-weight: 600;"><i class="fas fa-file-pdf"></i> Generar y Descargar PDF</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    init: () => {
        const paxs = window.AppData?.passengers || [];
        const filterMode = window.AppData?.dashboardFilterMode || 'date';
        const todayStr = window.AppData?.dashboardFilterDate || (filterMode === 'month' ? new Date().toLocaleDateString('en-CA').substring(0,7) : new Date().toLocaleDateString('en-CA'));
        const periodPaxs = paxs.filter(p => {
            const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
            return p.date && p.date.startsWith(todayStr) && !isCancelled && (p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado');
        });
        
        let countTandem = 0, countFun = 0, countAFF = 0, countCoach = 0, countCamaras = 0;
        periodPaxs.forEach(p => {
            const pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (pType.includes('tandem')) countTandem++;
            else if (pType.includes('aff')) countAFF++;
            else if (pType.includes('coach')) countCoach++;
            else countFun++;
            
            if (p.adiciones) {
                Object.keys(p.adiciones).forEach(k => {
                    let kt = k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (kt.includes('camara') || kt.includes('gopro')) countCamaras++;
                });
            }
        });

        const isDark = document.body.classList.contains('dark-mode');
        const legendColor = isDark ? '#ffffff' : '#333333';

        const ctx = document.getElementById('monthDistributionChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Tándem', 'Fun Jumper', 'AFF', 'Coach', 'Cámaras'],
                    datasets: [{
                        data: [countTandem, countFun, countAFF, countCoach, countCamaras],
                        backgroundColor: ['#0ea5e9', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'],
                        borderWidth: 2,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: legendColor, font: { family: "'Inter', sans-serif", size: 12 } } }
                    }
                }
            });
        }

        const todayPaxs = paxs.filter(p => p.date && p.date.startsWith(todayStr) && !(p.paxStatus && p.paxStatus.includes('Cancelado')) && !(p.flightStatus && p.flightStatus.includes('Cancelado')));
        let iTandem = 0, iFun = 0, iCopiloto = 0;
        let incomeExtras = {};
        let countExtras = {};
        todayPaxs.forEach(p => {
            const paid = p.financiera?.totalPaid || 0;
            let pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let basePrice = 850000;
            if (pType.includes('copiloto')) basePrice = 1200000;
            else if (pType.includes('fun')) basePrice = 150000;
            if (p.financiera?.manualPrice > 0) basePrice = p.financiera.manualPrice;
            
            let allocatedBase = Math.min(paid, basePrice);
            let allocatedExtras = Math.max(0, paid - allocatedBase);

            if (pType.includes('tandem')) iTandem += allocatedBase;
            else if (pType.includes('copiloto')) iCopiloto += allocatedBase;
            else iFun += allocatedBase;

            if (allocatedExtras > 0 && p.adiciones) {
                let addKeys = Object.keys(p.adiciones).filter(k => p.adiciones[k] === 'si');
                if (addKeys.length > 0) {
                    let pricePerExtra = allocatedExtras / addKeys.length;
                    addKeys.forEach(k => {
                        incomeExtras[k] = (incomeExtras[k] || 0) + pricePerExtra;
                        countExtras[k] = (countExtras[k] || 0) + 1;
                    });
                } else {
                    incomeExtras['Otros Adicionales'] = (incomeExtras['Otros Adicionales'] || 0) + allocatedExtras;
                    countExtras['Otros Adicionales'] = (countExtras['Otros Adicionales'] || 0) + 1;
                }
            } else if (allocatedExtras > 0) {
                incomeExtras['Otros Adicionales'] = (incomeExtras['Otros Adicionales'] || 0) + allocatedExtras;
                countExtras['Otros Adicionales'] = (countExtras['Otros Adicionales'] || 0) + 1;
            }
        });

        const ctxIncome = document.getElementById('incomeDistributionChart');
        if (ctxIncome && typeof Chart !== 'undefined') {
            let labelsIncome = ['Tándem', 'Fun Jumper', 'Copiloto'];
            let dataIncome = [iTandem, iFun, iCopiloto];
            let bgIncome = ['#0ea5e9', '#10b981', '#f59e0b'];
            const extraColors = ['#8b5cf6', '#ec4899', '#ef4444', '#14b8a6', '#f43f5e'];
            let cIdx = 0;

            Object.keys(incomeExtras).forEach(k => {
                labelsIncome.push(k);
                dataIncome.push(incomeExtras[k]);
                bgIncome.push(extraColors[cIdx % extraColors.length]);
                cIdx++;
            });

            new Chart(ctxIncome, {
                type: 'doughnut',
                data: {
                    labels: labelsIncome,
                    datasets: [{
                        data: dataIncome,
                        backgroundColor: bgIncome,
                        borderWidth: 2,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: legendColor, font: { family: "'Inter', sans-serif", size: 12 } } },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    const formatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
                                    return ` ${context.label}: ${formatted}`;
                                }
                            }
                        }
                    }
                }
            });
        }

        // Event Listeners
        const modeInput = document.getElementById('dash-filter-mode');
        if(modeInput) {
            modeInput.addEventListener('change', (e) => {
                window.AppData.dashboardFilterMode = e.target.value;
                if(e.target.value === 'month') {
                    window.AppData.dashboardFilterDate = new Date().toLocaleDateString('en-CA').substring(0,7);
                } else {
                    window.AppData.dashboardFilterDate = new Date().toLocaleDateString('en-CA');
                }
                const container = document.getElementById('app-view');
                if(container) {
                    window.Modules.dashboard.render(container);
                }
            });
        }

        const dateInput = document.getElementById('dash-filter-date');
        if(dateInput) {
            dateInput.addEventListener('change', (e) => {
                window.AppData.dashboardFilterDate = e.target.value;
                const container = document.getElementById('app-view');
                if(container) {
                    window.Modules.dashboard.render(container);
                }
            });
        }
        
        const btnRep = document.getElementById('btn-reporte-ejecutivo');
        if(btnRep) {
            btnRep.addEventListener('click', () => {
                document.getElementById('rep-fecha').textContent = todayStr;
                const fmt = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
                
                document.getElementById('rep-ing-tandem').textContent = fmt(iTandem);
                document.getElementById('rep-ing-fun').textContent = fmt(iFun);
                document.getElementById('rep-ing-cop').textContent = fmt(iCopiloto);
                let sumExtras = 0;
                let htmlExtras = '';
                Object.keys(incomeExtras).forEach(k => {
                    let v = incomeExtras[k];
                    sumExtras += v;
                    htmlExtras += `<div style="display:flex; justify-content:space-between; margin-bottom:2px;"><span>- ${k} (x${countExtras[k]})</span><span>${fmt(v)}</span></div>`;
                });
                document.getElementById('rep-ing-add').textContent = fmt(sumExtras);
                if(document.getElementById('rep-ing-add-details')) document.getElementById('rep-ing-add-details').innerHTML = htmlExtras;
                
                // Calculate Store Sales for today
                let sumStore = 0;
                let storeDetails = {};
                const storeSales = window.AppData.storeSales || [];
                storeSales.filter(s => s.date && s.date.startsWith(todayStr)).forEach(s => {
                    sumStore += (s.total || 0);
                    (s.items || []).forEach(item => {
                        if (!storeDetails[item.name]) storeDetails[item.name] = { qty: 0, total: 0 };
                        storeDetails[item.name].qty += (item.qty || 1);
                        storeDetails[item.name].total += (item.qty || 1) * (item.price || 0);
                    });
                });
                document.getElementById('rep-ing-store').textContent = fmt(sumStore);
                
                let htmlStore = '';
                Object.keys(storeDetails).forEach(k => {
                    htmlStore += `<div style="display:flex; justify-content:space-between; margin-bottom:2px;"><span>- ${k} (x${storeDetails[k].qty})</span><span>${fmt(storeDetails[k].total)}</span></div>`;
                });
                if(document.getElementById('rep-ing-store-details')) document.getElementById('rep-ing-store-details').innerHTML = htmlStore;
                
                document.getElementById('rep-ing-total').textContent = fmt(iTandem + iFun + iCopiloto + sumExtras + sumStore);
                
                document.getElementById('rep-op-jumps').textContent = todayPaxs.filter(p => p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado').length;
                document.getElementById('rep-op-inst').textContent = (window.AppData?.employees || []).filter(e => e.role && e.role.includes('Instructor') && e.status === 'Activo').length;
                
                let cashBalance = 0;
                (window.AppData?.pettyCash || []).forEach(tx => { if(tx.type==='IN') cashBalance+=tx.amount; else if(tx.type==='OUT') cashBalance-=tx.amount; });
                document.getElementById('rep-op-cash').textContent = fmt(cashBalance);
                
                document.getElementById('rep-mes-tandem').textContent = countTandem;
                document.getElementById('rep-mes-fun').textContent = countFun;

                const modal = document.getElementById('modal-reporte-ejecutivo');
                modal.style.display = 'flex';
                setTimeout(() => modal.style.opacity = '1', 10);
            });
        }
        
        const btnCloseRep = document.getElementById('btn-close-reporte');
        if(btnCloseRep) {
            btnCloseRep.addEventListener('click', () => {
                const modal = document.getElementById('modal-reporte-ejecutivo');
                modal.style.opacity = '0';
                setTimeout(() => modal.style.display = 'none', 300);
            });
        }

        const ctxStore = document.getElementById('storeProductsChart');
        if (ctxStore && typeof Chart !== 'undefined') {
            const storeSalesLocal = window.AppData?.storeSales || [];
            let storeItemsSold = {};
            
            storeSalesLocal.filter(s => s.date && s.date.startsWith(todayStr)).forEach(s => {
                (s.items || []).forEach(item => {
                    storeItemsSold[item.name] = (storeItemsSold[item.name] || 0) + (item.qty || 1);
                });
            });
            
            let labelsStore = Object.keys(storeItemsSold);
            let dataStore = Object.values(storeItemsSold);
            let bgStore = ['#8b5cf6', '#ec4899', '#ef4444', '#14b8a6', '#f43f5e', '#f59e0b', '#10b981', '#0ea5e9'];
            
            if (labelsStore.length === 0) {
                labelsStore = ['Sin ventas ' + (filterMode === 'month' ? 'en este mes' : 'hoy')];
                dataStore = [1];
                bgStore = ['#e5e7eb'];
            }
            
            new Chart(ctxStore, {
                type: 'doughnut',
                data: {
                    labels: labelsStore,
                    datasets: [{
                        data: dataStore,
                        backgroundColor: bgStore,
                        borderWidth: 2,
                        hoverOffset: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: { position: 'bottom', labels: { color: legendColor, font: { family: "'Inter', sans-serif", size: 12 } } },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    if (context.label.startsWith('Sin ventas')) return ' 0';
                                    return ` ${context.label}: ${context.raw} unidades`;
                                }
                            }
                        }
                    }
                }
            });
        }
        
        const btnExportPdf = document.getElementById('btn-export-pdf');
        if(btnExportPdf) {
            btnExportPdf.addEventListener('click', () => {
                if (typeof html2canvas === 'undefined') {
                    const script = document.createElement('script');
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                    script.onload = () => execPdf();
                    document.head.appendChild(script);
                } else {
                    execPdf();
                }
            });
        }
        
        function execPdf() {
            const el = document.getElementById('reporte-printable');
            html2canvas(el, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                if(typeof window.jspdf === 'undefined') return alert("jsPDF no cargado");
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Reporte_Ejecutivo_Fraterno.pdf');
            }).catch(err => {
                console.error(err);
                alert('Error generando PDF. Asegúrate de que el logo u otros elementos no bloqueen el canvas.');
            });
        }
    }
};
