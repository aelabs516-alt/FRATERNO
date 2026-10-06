window.Modules = window.Modules || {};

window.Modules.fids = {
    render: (container) => {
        container.innerHTML = `
            <style>
                @keyframes pulseRadar {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                @keyframes pulseBoarding {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.35rem 0.75rem; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    text-transform: uppercase; 
                    letter-spacing: 1px; 
                    background: rgba(0,0,0,0.3); 
                    font-size: 0.95rem;
                }
                .status-En-El-Aire {
                    animation: pulseRadar 2s infinite;
                    border: 1px solid #3b82f6;
                    color: #3b82f6;
                }
                .status-Abordando {
                    animation: pulseBoarding 2s infinite;
                    border: 1px solid #10b981;
                    color: #10b981;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: currentColor;
                }
            </style>
            <div id="fids-container" style="background-color: #000000; color: #e2e8f0; height: 100%; width: 100%; padding: 0; overflow: hidden; display: flex; flex-direction: column; font-family: 'Inter', sans-serif;">
                <div id="fids-header" style="display: flex; justify-content: space-between; align-items: center; background: linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%), url('img/fids_skydiving_banner.png') center/cover no-repeat; padding: 1rem 2rem; border-bottom: 2px solid #38bdf8; box-shadow: 0 4px 15px rgba(0,0,0,0.8);">
                    <div style="display: flex; flex-direction: column; gap: 0.25rem;">
                        <h1 style="margin: 0; color: #f8fafc; font-size: 2.2rem; letter-spacing: 2px; display: flex; align-items: center; gap: 1rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                            <i class="fas fa-plane-arrival" style="color: #38bdf8;"></i> 
                            <span id="fids-title">VUELOS / FLIGHTS</span>
                        </h1>
                        <div style="font-size: 1.1rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.5rem; font-weight: 500; text-transform: uppercase;">
                            <i class="far fa-calendar-alt" style="color: #94a3b8;"></i>
                            <span id="fids-date">DD MMMM AAAA</span>
                        </div>
                    </div>
                    
                    <!-- Central Logo -->
                    <div style="position: absolute; left: 50%; transform: translateX(-50%); display: flex; justify-content: center; align-items: center;">
                        <img src="img/logo-fids.png" alt="Fraterno Logo" style="height: 140px; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.8));">
                    </div>

                    <div style="display: flex; gap: 2rem; align-items: center;">
                        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.15rem;">
                            <div style="font-size: 2.2rem; font-weight: bold; color: #f8fafc; font-variant-numeric: tabular-nums; display: flex; align-items: center; gap: 0.75rem; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);">
                                <i class="far fa-clock" style="color: #38bdf8;"></i>
                                <span id="fids-time">HH:MM</span>
                            </div>
                            <span style="font-size: 0.9rem; color: #cbd5e1; text-transform: uppercase; letter-spacing: 2px; font-weight: 500;">Hora Local</span>
                        </div>
                        <div style="height: 50px; width: 2px; background: rgba(255,255,255,0.2);"></div>
                        <div style="display: flex; gap: 1.25rem; align-items: center; background: rgba(0,0,0,0.5); padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.1);">
                            <!-- Cisneros -->
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 70px;">
                                <span style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.2rem;">Cisneros</span>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i id="fids-weather-icon-cisneros" class="fas fa-cloud-sun" style="font-size: 1.3rem; color: #facc15; filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.8));"></i>
                                    <span id="fids-temp-cisneros" style="font-size: 1.1rem; font-weight: bold; color: #f8fafc; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">--°C</span>
                                </div>
                            </div>
                            
                            <div style="height: 35px; width: 1px; background: rgba(255,255,255,0.2);"></div>
                            
                            <!-- Medellín -->
                            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 70px;">
                                <span style="font-size: 0.75rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.2rem;">Medellín</span>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <i id="fids-weather-icon-medellin" class="fas fa-cloud-sun" style="font-size: 1.3rem; color: #facc15; filter: drop-shadow(0px 2px 2px rgba(0,0,0,0.8));"></i>
                                    <span id="fids-temp-medellin" style="font-size: 1.1rem; font-weight: bold; color: #f8fafc; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">--°C</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="flex: 1; overflow: hidden; padding: 1rem 1rem 0 1rem;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 1.15rem;">
                        <thead>
                            <tr style="background-color: #000000; color: #94a3b8; border-bottom: 2px solid #475569; text-transform: uppercase; font-size: 1rem; letter-spacing: 1px;">
                                <th style="padding: 0.5rem 1rem; text-align: center;" id="th-vuelo">Vuelo</th>
                                <th style="padding: 0.5rem 1rem; text-align: center;" id="th-pax">Pasajero</th>
                                <th style="padding: 0.5rem 1rem; text-align: center;" id="th-inst">Instructor</th>
                                <th style="padding: 0.5rem 1rem; text-align: center;" id="th-plane">Aeronave</th>
                                <th style="padding: 0.5rem 1rem; text-align: center;" id="th-status">Estado</th>
                            </tr>
                        </thead>
                        <tbody id="fids-tbody" style="transition: opacity 0.3s ease;">
                            <!-- Dynamic Rows -->
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        const escapeHTML = (str) => {
            if(!str) return '';
            return String(str).replace(/[&<>'"]/g, 
                tag => ({
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#39;',
                    '"': '&quot;'
                }[tag] || tag)
            );
        };

        const title = document.getElementById('fids-title');
        const thVuelo = document.getElementById('th-vuelo');
        const thPax = document.getElementById('th-pax');
        const thInst = document.getElementById('th-inst');
        const thPlane = document.getElementById('th-plane');
        const thStatus = document.getElementById('th-status');
        const fDate = document.getElementById('fids-date');
        const fTime = document.getElementById('fids-time');
        const tbody = document.getElementById('fids-tbody');

        let isEnglish = false;
        
        // Paginación State
        let currentPage = 0;
        let totalPages = 1;
        let allRowsHtml = [];
        let rotationTimer = null;
        let fidsRowsPerPage = 5;
        
        // Hide global header/sidebar for full immersion
        const header = document.getElementById('main-header');
        const sidebar = document.getElementById('sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (header) header.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        if (mainContent) {
            mainContent.style.marginLeft = '0';
            mainContent.style.marginTop = '0';
            mainContent.style.padding = '0';
            mainContent.style.height = '100vh';
            mainContent.style.backgroundColor = '#000000';
        }
        container.style.backgroundColor = '#000000';
        document.body.style.backgroundColor = '#000000';

        // Restore UI on leave
        window.addEventListener('hashchange', function onLeave() {
            if (window.location.hash !== '#/fids') {
                if (header) header.style.display = '';
                if (sidebar) sidebar.style.display = '';
                if (mainContent) {
                    mainContent.style.marginLeft = '';
                    mainContent.style.marginTop = '';
                    mainContent.style.padding = '';
                    mainContent.style.height = '';
                    mainContent.style.backgroundColor = '';
                }
                container.style.backgroundColor = '';
                document.body.style.backgroundColor = '';
                window.removeEventListener('hashchange', onLeave);
            }
        });

        function getAvatarUrl(name) {
            if (!name || name === 'Sin asignar' || name === 'N/A') {
                return '<div style="width: 40px; height: 40px; border-radius: 50%; background: #334155; display: flex; align-items: center; justify-content: center; color: #94a3b8;"><i class="fas fa-user-astronaut"></i></div>';
            }
            return `<img src="https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=38bdf8&color=fff&rounded=true&size=40" style="width: 40px; height: 40px; border-radius: 50%;">`;
        }

        function translateStatus(statusStr, toEnglish) {
            if (!toEnglish) return statusStr;
            const dict = {
                'Programado': 'Scheduled',
                'En Espera': 'Standby',
                'Abordando': 'Boarding',
                'En El Aire': 'In Air',
                'Paracaidistas en el aire': 'Skydivers On Air',
                'Aterrizó': 'Landed',
                'Cancelado / Cancelled': 'Cancelled'
            };
            return dict[statusStr] || statusStr;
        }

        function getStatusColor(statusStr) {
            switch(statusStr) {
                case 'Programado': return '#94a3b8'; // Slate
                case 'En Espera': return '#f59e0b'; // Amber
                case 'Abordando': return '#10b981'; // Emerald (Verde)
                case 'En El Aire': return '#3b82f6'; // Blue (Azul)
                case 'Paracaidistas en el aire': return '#8b5cf6'; // Purple
                case 'Aterrizó': return '#64748b'; // Slate darker
                case 'Cancelado / Cancelled': return '#ef4444'; // Red
                default: return '#f8fafc';
            }
        }

        function renderFids() {
            const allPax = window.AppData.passengers || [];
            const now = Date.now();
            const todayStr = new Date().toLocaleDateString('en-CA');

            // Group by flight
            const groups = {};
            allPax.forEach(p => {
                const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
                if (p.paxStatus === 'Completado' || isCancelled) return;
                if (p.date !== todayStr) return; // Only today's flights
                
                // 5-minute rule for Aterrizó
                if (p.flightStatus === 'Aterrizó' && p.landedAt) {
                    if (now - p.landedAt > (5 * 60 * 1000)) return; // Exceeds 5 mins
                }

                const key = `${p.aeronave}_${p.time}`;
                if (!groups[key]) groups[key] = [];
                groups[key].push(p);
            });

            const sortedKeys = Object.keys(groups).sort((a,b) => {
                const tA = a.split('_')[1] || '00:00';
                const tB = b.split('_')[1] || '00:00';
                return tA.localeCompare(tB);
            });

            const newHtmlRows = [];

            if (sortedKeys.length === 0) {
                newHtmlRows.push(`<tr><td colspan="5" style="text-align:center; padding: 2rem; color: #475569;">${isEnglish ? 'NO ACTIVE FLIGHTS' : 'NO HAY VUELOS ACTIVOS'}</td></tr>`);
            } else {
                sortedKeys.forEach((key, flightIndex) => {
                    const paxList = groups[key];
                    paxList.forEach((p, paxIndex) => {
                        const trBg = (flightIndex % 2 === 0) ? 'transparent' : 'rgba(255,255,255,0.02)';
                        const trB = (paxIndex === paxList.length - 1) ? '1px solid #334155' : 'none';
                        const trStyle = `background-color: ${trBg}; border-bottom: ${trB};`;
                        
                        const isFirstPax = paxIndex === 0;
                        let vCol = '';
                        if (isFirstPax) {
                            const fNum = p.vueloNum || p.time || (flightIndex + 1).toString().padStart(2, '0');
                            vCol = `<div style="font-size: 1.5rem; font-weight: bold; color: #f8fafc;">${escapeHTML(fNum)}</div>`;
                        }
                        
                        const instAvatar = getAvatarUrl(p.instructor);
                        const instName = p.instructor === 'Sin asignar' ? (isEnglish ? 'Unassigned' : 'Sin asignar') : p.instructor;

                        newHtmlRows.push(`
                            <tr style="${trStyle}">
                                <td style="padding: 0.5rem 1rem; vertical-align: middle; text-align: center;">${vCol}</td>
                                <td style="padding: 0.5rem 1rem; vertical-align: middle; text-align: center; font-weight: 500; color: #f1f5f9;">${escapeHTML(p.name)}</td>
                                <td style="padding: 0.5rem 1rem; vertical-align: middle;">
                                    <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
                                        ${instAvatar}
                                        <span style="color: #cbd5e1; font-size: 1rem;">${escapeHTML(instName)}</span>
                                    </div>
                                </td>
                                <td style="padding: 0.5rem 1rem; vertical-align: middle; text-align: center; color: #cbd5e1;">${escapeHTML(p.aeronave)}</td>
                                <td style="padding: 0.5rem 1rem; vertical-align: middle; text-align: center;">
                                    
                                    <div class="status-badge ${p.flightStatus === 'En El Aire' || p.flightStatus === 'Paracaidistas en el aire' ? 'status-En-El-Aire' : (p.flightStatus === 'Abordando' ? 'status-Abordando' : '')}" style="color: ${getStatusColor(p.flightStatus)}; border: 1px solid ${getStatusColor(p.flightStatus)};">
                                        ${(p.flightStatus === 'En El Aire' || p.flightStatus === 'Abordando' || p.flightStatus === 'Paracaidistas en el aire') ? '<div class="status-dot"></div>' : ''}
                                        <span>${translateStatus(p.flightStatus, isEnglish)}</span>
                                    </div>
                                </td>
                            </tr>
                        `);
                    });
                });
            }

            const oldDataStr = JSON.stringify(allRowsHtml);
            const newDataStr = JSON.stringify(newHtmlRows);

            if (oldDataStr !== newDataStr) {
                allRowsHtml = newHtmlRows;
                calculatePagination();
                renderPage();
                resetRotationTimer();
            }
        }

        function calculatePagination() {
            const headerEl = document.getElementById('fids-header');
            const theadEl = document.querySelector('#fids-container thead');
            const headerHeight = headerEl ? headerEl.offsetHeight : 150;
            const theadHeight = theadEl ? theadEl.offsetHeight : 50;
            
            // Available height for tbody
            const availableHeight = window.innerHeight - headerHeight - theadHeight - 100; // 100px safety margin
            const rowHeight = 58; // Avg row height
            
            fidsRowsPerPage = Math.max(1, Math.floor(availableHeight / rowHeight));
            totalPages = Math.max(1, Math.ceil(allRowsHtml.length / fidsRowsPerPage));
            
            if (currentPage >= totalPages) currentPage = 0;
        }

        function renderPage() {
            if (!tbody) return;
            
            tbody.style.opacity = '0'; // fade out
            
            setTimeout(() => {
                const startIndex = currentPage * fidsRowsPerPage;
                const endIndex = startIndex + fidsRowsPerPage;
                const pageRows = allRowsHtml.slice(startIndex, endIndex);
                
                tbody.innerHTML = pageRows.join('');
                
                // Page indicator removed per user request                
                tbody.style.opacity = '1'; // fade in
            }, 300);
        }

        function resetRotationTimer() {
            if (rotationTimer) clearInterval(rotationTimer);
            if (totalPages > 1) {
                rotationTimer = setInterval(() => {
                    currentPage = (currentPage + 1) % totalPages;
                    renderPage();
                }, 10000);
            }
        }
        
        window.addEventListener('resize', () => {
            if(document.getElementById('fids-tbody')) {
                calculatePagination();
                renderPage();
            }
        });

        function updateClock() {
            const d = new Date();
            const dateOpts = { day: '2-digit', month: 'long', year: 'numeric' };
            const timeOpts = { hour: '2-digit', minute: '2-digit', hour12: false };
            const dateStr = d.toLocaleDateString('es-CO', dateOpts);
            const timeStr = d.toLocaleTimeString('es-CO', timeOpts);
            
            if (fDate) fDate.textContent = dateStr;
            if (fTime) fTime.textContent = timeStr;
        }

        async function fetchWeather() {
            try {
                // Cisneros and Medellin coordinates
                const [resCisneros, resMedellin] = await Promise.all([
                    fetch('https://api.open-meteo.com/v1/forecast?latitude=6.5417&longitude=-75.0864&current_weather=true'),
                    fetch('https://api.open-meteo.com/v1/forecast?latitude=6.2442&longitude=-75.5812&current_weather=true')
                ]);
                
                const dataCisneros = await resCisneros.json();
                const dataMedellin = await resMedellin.json();
                
                const updateUI = (data, prefix) => {
                    if (data && data.current_weather) {
                        const temp = Math.round(data.current_weather.temperature);
                        const code = data.current_weather.weathercode;
                        const wIcon = document.getElementById(`fids-weather-icon-${prefix}`);
                        const wTemp = document.getElementById(`fids-temp-${prefix}`);
                        
                        if (wTemp) wTemp.textContent = temp + '°C';
                        
                        if (wIcon) {
                            if (code === 0) wIcon.className = 'fas fa-sun';
                            else if (code <= 3) wIcon.className = 'fas fa-cloud-sun';
                            else if (code < 60) wIcon.className = 'fas fa-cloud';
                            else if (code < 80) wIcon.className = 'fas fa-cloud-rain';
                            else wIcon.className = 'fas fa-poo-storm';
                            
                            wIcon.style.color = (code <= 3) ? '#facc15' : '#94a3b8';
                        }
                    }
                };
                
                updateUI(dataCisneros, 'cisneros');
                updateUI(dataMedellin, 'medellin');
                
            } catch (e) {
                console.error("Error fetching weather:", e);
            }
        }
        
        fetchWeather();
        const weatherInterval = setInterval(fetchWeather, 600000); // 10 mins

        function toggleLanguage() {
            isEnglish = !isEnglish;
            
            if (isEnglish) {
                thVuelo.textContent = 'Time';
                thPax.textContent = 'Passenger';
                thInst.textContent = 'Instructor';
                thPlane.textContent = 'Aircraft';
                thStatus.textContent = 'Status';
            } else {
                thVuelo.textContent = 'Vuelo';
                thPax.textContent = 'Pasajero';
                thInst.textContent = 'Instructor';
                thPlane.textContent = 'Aeronave';
                thStatus.textContent = 'Estado';
            }
            
            renderFids(); // re-render to translate status cells
        }

        // Intervals
        const clockInterval = setInterval(() => {
            if(document.getElementById('fids-time')) {
                updateClock();
            } else {
                clearInterval(clockInterval); // Clean up if destroyed
                clearInterval(weatherInterval);
            }
        }, 1000);

        const dataInterval = setInterval(() => {
            if(document.getElementById('fids-tbody')) {
                renderFids(); // Render silently updates arrays and re-triggers if needed
            } else {
                clearInterval(dataInterval);
                if (rotationTimer) clearInterval(rotationTimer);
            }
        }, 1000);

        const langInterval = setInterval(() => {
            if(document.getElementById('fids-tbody')) {
                toggleLanguage();
            } else {
                clearInterval(langInterval);
            }
        }, 20000); // Every 20 seconds

        // Init
        updateClock();
        renderFids();
    }
};
