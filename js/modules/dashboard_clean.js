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
        
        const now = new Date();
        const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const parts = todayStr.split('-');
        const todayFormatted = `${parts[2]}/${parts[1]}/${parts[0]}`; // DD/MM/YYYY
        
        // 1. Calculate Jumps and Income for Today
        const todayPaxs = paxs.filter(p => {
            const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
            return p.date === todayStr && !isCancelled;
        });
        const landedPaxs = todayPaxs.filter(p => p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado');
        const jumpsToday = landedPaxs.length;
        
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
            let allocatedExtras = paid - allocatedBase;
            if (allocatedExtras < 0) allocatedExtras = 0;

            if (pType.includes('tandem')) iTandem += allocatedBase;
            else if (pType.includes('copiloto')) iCopiloto += allocatedBase;
            else iFun += allocatedBase;

            iAdicionales += allocatedExtras;
        });
        
        // 2. Instructors
        const activeInst = pilots.length;

        // 3. Petty Cash Balance
        let cashBalance = 0;
        pettyCash.forEach(tx => {
            if (tx.type === 'IN') cashBalance += tx.amount;
            else if (tx.type === 'OUT') cashBalance -= tx.amount;
        });
        
        // 4. Upcoming Flights (Próximos Vuelos)
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
        
        // 5. Month Distributions
        const currentMonth = todayStr.substring(0, 7); // YYYY-MM
        const monthPaxs = paxs.filter(p => p.date && p.date.startsWith(currentMonth) && (p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado'));
        let countTandem = 0;
        let countFun = 0;
        monthPaxs.forEach(p => {
            const pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (pType.includes('tandem')) countTandem++;
            else countFun++;
        });
        
        const totalMonth = countTandem + countFun || 1;
        const pctTandem = Math.round((countTandem / totalMonth) * 100);
        const pctFun = Math.round((countFun / totalMonth) * 100);

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

        // Render HTML with injected CSS animations and premium styles
        container.innerHTML = `
            <style>
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); 
        } }
        }
    }
};
                .dash-card {
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    border: 1px solid var(--border-color);
                    position: relative;
                    overflow: hidden;
                    animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                    opacity: 0;
                    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
                }
                .dash-card:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 15px 45px rgba(0,0,0,0.4);
                    border-color: rgba(255,255,255,0.15);
                }
                .dash-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; width: 100%; height: 4px;
                }
                .card-c1::before { background: linear-gradient(90deg, #0ea5e9, #38bdf8); box-shadow: 0 0 10px rgba(14,165,233,0.8); }
                .card-c2::before { background: linear-gradient(90deg, #10b981, #34d399); box-shadow: 0 0 10px rgba(16,185,129,0.8); }
                .card-c3::before { background: linear-gradient(90deg, #f59e0b, #fbbf24); box-shadow: 0 0 10px rgba(245,158,11,0.8); }
                .card-c4::before { background: linear-gradient(90deg, #8b5cf6, #a78bfa); box-shadow: 0 0 10px rgba(139,92,246,0.8); }

                .dash-icon {
                    position: absolute;
                    top: 1.5rem; right: 1.5rem;
                    font-size: 2.5rem;
                    opacity: 0.15;
                    transition: opacity 0.3s ease, transform 0.3s ease;
                }
                .dash-card:hover .dash-icon {
                    opacity: 0.3;
                    transform: scale(1.1) rotate(5deg);
                }
                
                .kpi-title { font-size: 0.95rem; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 1px; }
                .kpi-value { font-size: 2.8rem; font-weight: 800; margin: 0.5rem 0 0 0; color: var(--text-primary); letter-spacing: -1px; }
                
                .progress-bar-bg { width: 100%; height: 12px; background: var(--bg-surface-hover); border-radius: 6px; overflow: hidden; margin-top: 0.5rem; border: 1px solid var(--border-color); }
                .progress-bar-fill { height: 100%; border-radius: 6px; transition: width 1.5s cubic-bezier(0.22, 1, 0.36, 1); }
            
                @keyframes pulseGlow {
                    0% { transform: scale(1); opacity: 0.15; text-shadow: 0 0 0 transparent; }
                    50% { transform: scale(1.15) rotate(5deg); opacity: 0.4; text-shadow: 0 0 20px currentColor; }
                    100% { transform: scale(1); opacity: 0.15; text-shadow: 0 0 0 transparent; }
                }
                .dash-icon-pulse {
                    animation: pulseGlow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            </style>

            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div>
                    <h2 style="margin: 0; font-size: 2rem; font-weight: 800; letter-spacing: -1px;">Panel de Control</h2>
                    <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem;">Resumen de operaciones para hoy, ${todayFormatted}</p>
                </div>
                <button id="btn-reporte-ejecutivo" class="btn btn-primary" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(59,130,246,0.4);"><i class="fas fa-chart-line"></i> Reporte Ejecutivo</button>
            </div>

            <!-- KPI Grid -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 2rem;">
                <div class="dash-card card-c1" style="animation-delay: 0.1s;">
                    <i class="fas fa-parachute-box dash-icon dash-icon-pulse" style="color: #38bdf8;"></i>
                    <div class="kpi-title">Saltos Hoy</div>
                    <div class="kpi-value">${jumpsToday}</div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #38bdf8; font-weight: 500;"><i class="fas fa-arrow-trend-up"></i> Operación Activa</p>
                </div>
                <div class="dash-card card-c2" style="animation-delay: 0.2s;">
                    <i class="fas fa-sack-dollar dash-icon dash-icon-pulse" style="color: #10b981;"></i>
                    <div class="kpi-title">Ingresos Estimados</div>
                    <div class="kpi-value">${formatCur(todayIncome)}</div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #10b981; font-weight: 500;">Bruto Proyectado</p>
                </div>
                <div class="dash-card card-c3" style="animation-delay: 0.3s;">
                    <i class="fas fa-wallet dash-icon" style="color: #f59e0b;"></i>
                    <div class="kpi-title">Caja Menor</div>
                    <div class="kpi-value">${formatCur(cashBalance)}</div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #f59e0b; font-weight: 500;">Balance Actual</p>
                </div>
                <div class="dash-card card-c4" style="animation-delay: 0.4s;">
                    <i class="fas fa-users-cog dash-icon" style="color: #8b5cf6;"></i>
                    <div class="kpi-title">Plantilla Pilotos</div>
                    <div class="kpi-value">${activeInst}</div>
                    <p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #8b5cf6; font-weight: 500;">Registrados en Sistema</p>
                </div>
            </div>
            
            <!-- Lower Section -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 1.5rem;">
                
                <!-- Próximos Vuelos -->
                <div class="dash-card" style="animation-delay: 0.5s; padding: 0;">
                    <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color);">
                        <h3 style="margin: 0; font-size: 1.1rem;"><i class="fas fa-plane-departure" style="color: var(--brand-action); margin-right: 0.5rem;"></i> Próximos Vuelos</h3>
                    </div>
                    <div style="padding: 1rem 1.5rem;">
                        ${upcomingFlights.length > 0 ? upcomingFlights.map(v => `
                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px dashed var(--border-color);">
                                <div>
                                    <div style="font-weight: 600; font-size: 1.05rem;">${escapeHTML(v.time)} - ${escapeHTML(v.aeronave)}</div>
                                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 2px;">${v.paxs} Pasajeros</div>
                                </div>
                                <div style="padding: 4px 10px; border-radius: 20px; font-size: 0.75rem; font-weight: bold; background: var(--bg-surface-hover); color: ${getStatusColor(v.status)}; border: 1px solid ${getStatusColor(v.status)};">
                                    ${escapeHTML(v.status)}
                                </div>
                            </div>
                        `).join('') : '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);">No hay vuelos próximos pendientes hoy.</div>'}
                        
                        <div style="margin-top: 1rem; text-align: center;">
                            <a href="#/manifest" style="color: var(--brand-action); font-size: 0.9rem; text-decoration: none; font-weight: 600;">Ver Manifiesto Completo <i class="fas fa-arrow-right"></i></a>
                        </div>
                    </div>
                </div>

                <!-- Distribución Mensual -->
                <div class="dash-card" style="animation-delay: 0.6s;">
                    <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem;"><i class="fas fa-chart-pie" style="color: var(--brand-success); margin-right: 0.5rem;"></i> Distribución de Saltos (Mes)</h3>
                    
                    <div style="position: relative; height: 220px; width: 100%; margin-bottom: 1.5rem;">
                        <canvas id="monthDistributionChart"></canvas>
                    </div>

                    <div style="margin-bottom: 1rem;">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; font-weight: 500;">
                            <span><i class="fas fa-parachute-box" style="color: #38bdf8; margin-right:5px;"></i> Tándem <span style="color: var(--text-secondary); font-size: 0.85rem;">(${countTandem})</span></span>
                            <span>${pctTandem}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${pctTandem}%; background: linear-gradient(90deg, #0ea5e9, #38bdf8);"></div>
                        </div>
                    </div>

                    <div>
                        <div style="display:flex; justify-content:space-between; margin-bottom: 0.5rem; font-weight: 500;">
                            <span><i class="fas fa-user-astronaut" style="color: #10b981; margin-right:5px;"></i> Fun Jumper <span style="color: var(--text-secondary); font-size: 0.85rem;">(${countFun})</span></span>
                            <span>${pctFun}%</span>
                        </div>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${pctFun}%; background: linear-gradient(90deg, #059669, #10b981);"></div>
                        </div>
                    </div>
                </div>

                <!-- Distribución Ingresos Hoy -->
                <div class="dash-card" style="animation-delay: 0.7s;">
                    <h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem;"><i class="fas fa-hand-holding-dollar" style="color: #f59e0b; margin-right: 0.5rem;"></i> Ingresos Estimados (Hoy)</h3>
                    
                    <div style="position: relative; height: 220px; width: 100%; margin-bottom: 1.5rem;">
                        <canvas id="incomeDistributionChart"></canvas>
                    </div>
                </div>
                
            
            <!-- Modal Reporte Ejecutivo -->
            <div id="modal-reporte-ejecutivo" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 10000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 800px; max-width: 95%; max-height: 90vh; overflow-y: auto; background: #fff; color: #333; position: relative;">
                    <button id="btn-close-reporte" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: #666; font-size: 1.5rem;"><i class="fas fa-times"></i></button>
                    
                    <div id="reporte-printable" style="padding: 2rem; background: #fff;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                            <img src="img/logo.png" alt="Logo" style="height: 60px;">
                            <div style="text-align: right;">
                                <h2 style="margin: 0; color: #111; font-size: 1.5rem; text-transform: uppercase;">Reporte Ejecutivo</h2>
                                <p style="margin: 0.2rem 0 0 0; color: #666; font-size: 0.9rem;">Fecha: <span id="rep-fecha"></span></p>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                            <!-- Panel Ingresos -->
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
                                <h3 style="margin-top: 0; color: #111; font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;"><i class="fas fa-money-bill-wave" style="color: #10b981;"></i> Resumen de Ingresos (Hoy)</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Tándem:</span> <strong id="rep-ing-tandem">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Fun Jumper:</span> <strong id="rep-ing-fun">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Copiloto:</span> <strong id="rep-ing-cop">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Adicionales:</span> <strong id="rep-ing-add">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 0.5rem; border-top: 1px dashed #ccc; font-size: 1.2rem; color: #111;"><strong>TOTAL BRUTO:</strong> <strong id="rep-ing-total">$0</strong></div>
                            </div>
                            
                            <!-- Panel Operativo -->
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
                                <h3 style="margin-top: 0; color: #111; font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;"><i class="fas fa-parachute-box" style="color: #38bdf8;"></i> Resumen Operativo (Hoy)</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Saltos Totales:</span> <strong id="rep-op-jumps">0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Instructores Activos:</span> <strong id="rep-op-inst">0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Caja Menor (Balance):</span> <strong id="rep-op-cash">$0</strong></div>
                                
                                <h4 style="margin: 1.5rem 0 0.5rem 0; color: #333; font-size: 0.95rem;">Distribución Mensual</h4>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem; font-size: 0.9rem;"><span style="color: #666;">Tándem (Mes):</span> <strong id="rep-mes-tandem">0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.2rem; font-size: 0.9rem;"><span style="color: #666;">Fun Jumper (Mes):</span> <strong id="rep-mes-fun">0</strong></div>
                            </div>
                        </div>
                        
                        <div style="text-align: center; color: #999; font-size: 0.8rem; margin-top: 3rem; border-top: 1px solid #eee; padding-top: 1rem;">
                            Documento generado automáticamente por Fraterno App
                        </div>
                    </div>
                    
                    <div style="padding: 1rem 2rem; background: #f8f9fa; border-top: 1px solid #eee; text-align: right; border-radius: 0 0 12px 12px;">
                        <button id="btn-export-pdf" class="btn btn-primary" style="padding: 0.75rem 1.5rem; font-size: 1.05rem;"><i class="fas fa-file-pdf"></i> Generar y Descargar PDF</button>
                    </div>
                </div>
            </div>

            </div>
        `;
    },
    init: () => {
        // Recalculate stats for chart
        const paxs = window.AppData?.passengers || [];
        const now = new Date();
        const todayStr = now.toLocaleDateString('en-CA');
        const currentMonth = todayStr.substring(0, 7);
        const monthPaxs = paxs.filter(p => p.date && p.date.startsWith(currentMonth) && (p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado'));
        
        let countTandem = 0;
        let countFun = 0;
        monthPaxs.forEach(p => {
            const pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            if (pType.includes('tandem')) countTandem++;
            else countFun++;
        });

        // Initialize Chart.js with dark theme support
        const ctx = document.getElementById('monthDistributionChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Tándem', 'Fun Jumper'],
                    datasets: [{
                        data: [countTandem, countFun],
                        backgroundColor: [
                            'rgba(14, 165, 233, 0.85)', // Cyan
                            'rgba(16, 185, 129, 0.85)'  // Emerald
                        ],
                        borderColor: [
                            '#0ea5e9',
                            '#10b981'
                        ],
                        borderWidth: 2,
                        hoverOffset: 10,
                        hoverBorderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#000000',
                                font: {
                                    family: "'Inter', sans-serif",
                                    size: 13,
                                    weight: '500'
                                },
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            boxPadding: 4,
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
                                    const percentage = Math.round((value / total) * 100) + '%';
                                    return ` ${context.label}: ${value} (${percentage})`;
                                }
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 1500,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }

        // --- New Income Chart ---
        let iTandem = 0, iFun = 0, iCopiloto = 0, iAdicionales = 0;
        const todayPaxs = paxs.filter(p => {
            const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
            return p.date === todayStr && !isCancelled;
        });

        todayPaxs.forEach(p => {
            const paid = p.financiera?.totalPaid || 0;

            let pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            let basePrice = 850000; // default Tandem
            if (pType.includes('copiloto')) basePrice = 1200000;
            else if (pType.includes('fun')) basePrice = 150000;
            
            if (p.financiera?.manualPrice && p.financiera.manualPrice > 0) {
                basePrice = p.financiera.manualPrice;
            }

            let allocatedBase = Math.min(paid, basePrice);
            let allocatedExtras = paid - allocatedBase;
            if (allocatedExtras < 0) allocatedExtras = 0;

            if (pType.includes('tandem')) iTandem += allocatedBase;
            else if (pType.includes('copiloto')) iCopiloto += allocatedBase;
            else iFun += allocatedBase;

            iAdicionales += allocatedExtras;
        });

        const ctxIncome = document.getElementById('incomeDistributionChart');
        if (ctxIncome && typeof Chart !== 'undefined') {
            new Chart(ctxIncome, {
                type: 'doughnut',
                data: {
                    labels: ['Tándem', 'Fun Jumper', 'Copiloto', 'Adicionales'],
                    datasets: [{
                        data: [iTandem, iFun, iCopiloto, iAdicionales],
                        backgroundColor: [
                            'rgba(14, 165, 233, 0.85)',  // Cyan
                            'rgba(16, 185, 129, 0.85)',  // Emerald
                            'rgba(245, 158, 11, 0.85)',  // Amber
                            'rgba(139, 92, 246, 0.85)'   // Violet
                        ],
                        borderColor: [
                            '#0ea5e9',
                            '#10b981',
                            '#f59e0b',
                            '#8b5cf6'
                        ],
                        borderWidth: 2,
                        hoverOffset: 10,
                        hoverBorderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#000000',
                                font: { family: "'Inter', sans-serif", size: 12, weight: '500' },
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            padding: 12,
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
                                    const percentage = Math.round((value / total) * 100) + '%';
                                    const formatted = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
                                    return ` ${context.label}: ${formatted} (${percentage})`;
                                }
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 1500,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
    }
}
