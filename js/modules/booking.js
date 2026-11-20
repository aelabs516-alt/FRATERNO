window.Modules = window.Modules || {};

window.Modules.booking = {
    render: (container) => {
        container.innerHTML = `
            <div class="booking-module" style="display: flex; flex-direction: column; height: 100%; gap: 1rem;">
                <!-- Header with Filters -->
                <div class="card" style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
                    <div style="flex: 1; min-width: 200px;">
                        <label>Buscar Pasajero (Nombre, Doc, Cel)</label>
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" id="booking-search" class="form-control" placeholder="Buscar...">
                        </div>
                    </div>
                    <div style="flex: 0 0 200px;">
                        <label>Filtrar Fecha Específica</label>
                        <input type="date" id="booking-date-filter" class="form-control">
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(239, 68, 68, 0.05); border-radius: 6px; border: 1px solid var(--brand-danger); margin-bottom: 2px;">
                        <input type="checkbox" id="filter-medical" style="accent-color: var(--brand-danger); width: 16px; height: 16px; cursor: pointer;">
                        <label for="filter-medical" style="color: var(--brand-danger); font-size: 0.9rem; font-weight: 600; cursor: pointer; margin: 0;">Con Condición Médica</label>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem; background: rgba(249, 115, 22, 0.05); border-radius: 6px; border: 1px solid #F97316; margin-bottom: 2px;">
                        <input type="checkbox" id="filter-minor" style="accent-color: #F97316; width: 16px; height: 16px; cursor: pointer;">
                        <label for="filter-minor" style="color: #F97316; font-size: 0.9rem; font-weight: 600; cursor: pointer; margin: 0;">Es Menor de Edad</label>
                    </div>
                    <button class="btn btn-warning" id="btn-booking-email-alerts" style="padding: 0.5rem 1rem;" title="Alertas por correo para reservas con pago incompleto a 10 días o menos">
                        <i class="fas fa-envelope-open-text"></i> Alertas Pago ≤10d (<span id="booking-alerts-count">0</span>)
                    </button>
                    <button class="btn btn-primary" id="booking-btn-clear" style="padding: 0.5rem 1rem;">
                        <i class="fas fa-times"></i> Limpiar
                    </button>
                </div>

                <div class="booking-main-split" style="display: flex; flex: 1; gap: 1rem; overflow: hidden; flex-wrap: wrap;">
                    <!-- Calendar Section -->
                    <div class="card booking-calendar-card" style="flex: 2; display: flex; flex-direction: column; overflow: hidden; min-width: 350px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <button class="btn" id="booking-prev-month" style="background: var(--bg-surface-hover);"><i class="fas fa-chevron-left"></i></button>
                            <h2 id="booking-month-year" style="margin: 0; color: var(--text-primary);"></h2>
                            <button class="btn" id="booking-next-month" style="background: var(--bg-surface-hover);"><i class="fas fa-chevron-right"></i></button>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; font-weight: bold; margin-bottom: 0.5rem; color: var(--text-secondary);">
                            <div>Dom</div><div>Lun</div><div>Mar</div><div>Mié</div><div>Jue</div><div>Vie</div><div>Sáb</div>
                        </div>
                        <div id="booking-calendar-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.5rem; flex: 1; overflow-y: auto;">
                            <!-- Days injected here -->
                        </div>
                    </div>

                    <!-- Side Panel: Day Details -->
                    <div class="card booking-side-card" style="flex: 1; display: flex; flex-direction: column; min-width: 300px; max-height: calc(100vh - 120px); overflow: hidden;">
                        <h3 id="booking-day-title" style="margin-top: 0; color: var(--text-primary); border-bottom: 2px solid var(--border-color); padding-bottom: 0.5rem;">Selecciona un día</h3>
                        
                        <div id="booking-day-capacity" style="margin-bottom: 1rem; padding: 1rem; background: var(--bg-main); border-radius: var(--border-radius-md);">
                            <div style="font-size: 0.85rem; color: var(--text-secondary);">Disponibilidad del día</div>
                            <div style="font-size: 1.5rem; font-weight: 700; color: var(--brand-action);">-- / --</div>
                        </div>

                        <div style="flex: 1; overflow-y: auto; padding-right: 0.5rem;" id="booking-pax-list">
                            <p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">Selecciona una fecha en el calendario o usa el buscador para ver los pasajeros.</p>
                        </div>
                    </div>
                </div>
                    </div>
                </div>
            </div>

            <!-- Modal Cancelar Reserva -->
            <div id="modal-cancel-res" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <div class="modal-content" style="background: var(--bg-surface); padding: 2rem; border-radius: 12px; width: 90%; max-width: 400px; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
                    <h3 style="margin-top: 0; color: var(--brand-danger); margin-bottom: 1rem;"><i class="fas fa-exclamation-circle"></i> Cancelar Reserva</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1rem;">¿Está seguro que desea cancelar esta reserva? Por favor ingrese las observaciones de la cancelación. Se mantendrá el historial del pasajero.</p>
                    
                    <div class="form-group">
                        <label>Observaciones de Cancelación</label>
                        <textarea id="cancel-res-obs" class="form-control" rows="3" placeholder="Motivo de la cancelación..." required></textarea>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem;">
                        <button class="btn" id="btn-close-cancel-modal" style="background: var(--bg-surface-hover); color: var(--text-primary);">Cancelar</button>
                        <button class="btn btn-danger" id="btn-confirm-cancel-res"><i class="fas fa-trash-alt"></i> Aceptar</button>
                    </div>
                </div>
            </div>

            <!-- Modal Editar Reserva -->
            <div id="modal-edit-res" class="modal-overlay" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <div class="modal-content" style="background: var(--bg-surface); padding: 2rem; border-radius: 12px; width: 90%; max-width: 600px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
                    <h3 style="margin-top: 0; color: var(--brand-blue); margin-bottom: 1.5rem;"><i class="fas fa-edit"></i> Editar Reserva</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label>Nombre(s) y Apellido(s)</label>
                            <input type="text" id="edit-res-name" class="form-control" disabled style="background: var(--bg-surface-hover); font-weight: bold;">
                        </div>
                        <div class="form-group">
                            <label>Documento de Identidad</label>
                            <input type="text" id="edit-res-doc" class="form-control" disabled style="background: var(--bg-surface-hover); font-weight: bold;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label>Teléfono</label>
                            <input type="text" id="edit-res-phone" class="form-control" disabled style="background: var(--bg-surface-hover); font-weight: bold;">
                        </div>
                        <div class="form-group">
                            <label>Correo Electrónico</label>
                            <input type="email" id="edit-res-email" class="form-control" disabled style="background: var(--bg-surface-hover); font-weight: bold;">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group">
                            <label>Fecha de Salto</label>
                            <input type="date" id="edit-res-date" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Tipo de Salto</label>
                            <select id="edit-res-type" class="form-control" disabled style="background: var(--bg-surface-hover); font-weight: bold;">
                                <option value="Salto Tandem">Salto Tandem</option>
                                <option value="Fun Jumper">Fun Jumper</option>
                                <option value="Copiloto">Copiloto</option>
                                <option value="Curso de Paracaidismo">Curso de Paracaidismo</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label>Adicionales (Cámaras)</label>
                        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                            <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="edit-res-cam-360" value="360°"> Cámara 360°</label>
                            <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="edit-res-cam-gopro" value="GoPro"> Cámara GoPro</label>
                            <label style="display:flex; align-items:center; gap:0.5rem;"><input type="checkbox" id="edit-res-cam-ext" value="Externa"> Cámara Externa</label>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn" id="btn-close-edit-res-modal" style="background: var(--bg-surface-hover); color: var(--text-primary);">Cancelar</button>
                        <button class="btn btn-primary" id="btn-confirm-edit-res"><i class="fas fa-save"></i> Guardar Cambios</button>
                    </div>
                </div>
            </div>
        `;

        let currentDate = new Date();
        currentDate.setDate(1); // Evita bug de salto de mes
        let activeDateString = null;

        const calGrid = document.getElementById('booking-calendar-grid');
        const monthYearLbl = document.getElementById('booking-month-year');
        const paxList = document.getElementById('booking-pax-list');
        const dayTitle = document.getElementById('booking-day-title');
        const dayCapacity = document.getElementById('booking-day-capacity');

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

        const searchInput = document.getElementById('booking-search');
        const dateFilter = document.getElementById('booking-date-filter');

        const modalCancel = document.getElementById('modal-cancel-res');
        const txtCancelObs = document.getElementById('cancel-res-obs');
        let paxToCancelId = null;

        document.getElementById('btn-close-cancel-modal').addEventListener('click', () => {
            modalCancel.style.display = 'none';
            paxToCancelId = null;
            txtCancelObs.value = '';
        });

        document.getElementById('btn-confirm-cancel-res').addEventListener('click', () => {
            if (!paxToCancelId) return;
            const obs = txtCancelObs.value.trim();
            if (!obs) return alert('Debe ingresar una observación para cancelar la reserva.');
            
            const paxObj = window.AppData.passengers.find(p => p.id === paxToCancelId);
            if (paxObj) {
                paxObj.paxStatus = 'Cancelado / Cancelled';
                paxObj.observacionesCancelacion = obs;
                if (window.saveAppData) window.saveAppData();
                alert('Reserva cancelada exitosamente.');
                
                // Re-render
                if (activeDateString) {
                    renderCalendar(); // To update counts
                    renderDayDetails(activeDateString, false);
                } else {
                    executeSearch();
                }
            }
            modalCancel.style.display = 'none';
            paxToCancelId = null;
            txtCancelObs.value = '';
        });

        // ==========================
        // Edit Reservation Logic
        // ==========================
        const modalEditRes = document.getElementById('modal-edit-res');
        let paxToEditId = null;

        const iEditName = document.getElementById('edit-res-name');
        const iEditDoc = document.getElementById('edit-res-doc');
        const iEditPhone = document.getElementById('edit-res-phone');
        const iEditEmail = document.getElementById('edit-res-email');
        const iEditDate = document.getElementById('edit-res-date');
        const iEditType = document.getElementById('edit-res-type');
        const iEditCam360 = document.getElementById('edit-res-cam-360');
        const iEditCamGoPro = document.getElementById('edit-res-cam-gopro');
        const iEditCamExt = document.getElementById('edit-res-cam-ext');

        document.getElementById('btn-close-edit-res-modal').addEventListener('click', () => {
            modalEditRes.style.display = 'none';
            paxToEditId = null;
        });

        document.getElementById('btn-confirm-edit-res').addEventListener('click', () => {
            if (!paxToEditId) return;
            const paxObj = window.AppData.passengers.find(p => p.id === paxToEditId);
            if (!paxObj) return;
            
            if(!iEditName.value || !iEditDate.value) return alert('Nombre y Fecha son obligatorios.');

            paxObj.name = iEditName.value.trim();
            paxObj.doc = iEditDoc.value.trim();
            paxObj.phone = iEditPhone.value.trim();
            paxObj.email = iEditEmail.value.trim();
            const oldDate = paxObj.date;
            paxObj.date = iEditDate.value;
            paxObj.jumpdate = iEditDate.value;
            paxObj.type = iEditType.value;
            
            // Si la fecha cambió, el pasajero debe perder su estado de Check-in y Vuelo
            if (oldDate !== paxObj.date) {
                paxObj.paxStatus = 'Pendiente Check-in';
                paxObj.aeronave = 'Sin asignar';
                paxObj.vueloNum = '';
                paxObj.time = 'Por definir';
                paxObj.flightStatus = 'Programado';
                paxObj.instructor = 'Sin asignar';
                paxObj.camInstructor = 'Sin asignar';
            }
            
            const selectedCams = [];
            if (!paxObj.adiciones) paxObj.adiciones = {};

            if (iEditCam360.checked) {
                selectedCams.push(iEditCam360.value);
                paxObj.adiciones['Cámara 360'] = 'si';
            } else {
                paxObj.adiciones['Cámara 360'] = 'no';
            }

            if (iEditCamGoPro.checked) {
                selectedCams.push(iEditCamGoPro.value);
                paxObj.adiciones['Cámara Go-Pro'] = 'si';
            } else {
                paxObj.adiciones['Cámara Go-Pro'] = 'no';
            }

            if (iEditCamExt.checked) {
                selectedCams.push(iEditCamExt.value);
                paxObj.adiciones['Cámara Externa'] = 'si';
            } else {
                paxObj.adiciones['Cámara Externa'] = 'no';
            }

            paxObj.cams = selectedCams.length > 0 ? selectedCams.join(', ') : 'Ninguna';
            
            // Recalculate base manualPrice using passenger's frozen tariffSnapshot (never retroactively applying newer Maestro rates)
            const getPrice = (name) => {
                if (window.TariffGuard) {
                    return window.TariffGuard.getPriceForRecord(paxObj, name);
                }
                const list = (paxObj.tariffSnapshot && Array.isArray(paxObj.tariffSnapshot.items))
                    ? paxObj.tariffSnapshot.items
                    : (window.AppData.maestroValores || []);
                const item = list.find(x => x.name === name);
                return item && item.price ? parseInt(String(item.price).replace(/\D/g, ''), 10) || 0 : 0;
            };
            
            const baseItemName = window.TariffGuard
                ? window.TariffGuard.resolveJumpTypeItemName(paxObj.type, window.TariffGuard.getEffectiveMaestroForRecord(paxObj))
                : (paxObj.type === 'Tandem' ? 'Salto Tandem' : paxObj.type);
            let newPrice = getPrice(baseItemName);
            selectedCams.forEach(cam => {
                if (cam.includes('360')) newPrice += getPrice('Cámara 360');
                if (cam.includes('GoPro') || cam.includes('Go-Pro')) newPrice += getPrice('Cámara Go-Pro');
                if (cam.includes('Externa')) newPrice += getPrice('Cámara Externa');
            });
            
            if (!paxObj.financiera) paxObj.financiera = { manualPrice: 0, discount: 0, totalPaid: 0 };
            paxObj.financiera.manualPrice = newPrice;
            paxObj.financiera.totalValue = Math.max(0, newPrice - (paxObj.financiera.discount || 0));
            
            if (window.saveAppData) window.saveAppData();
            alert('Reserva actualizada exitosamente.');
            
            modalEditRes.style.display = 'none';
            paxToEditId = null;
            
            // Re-render
            if (activeDateString) {
                renderCalendar(); 
                renderDayDetails(activeDateString, false);
            } else {
                executeSearch();
            }
        });

        function getCapacityForDate(dateStrYMD) {
            if (!dateStrYMD) return { totalT: 0, usedT: 0, totalF: 0, usedF: 0, totalC: 0, usedC: 0 };
            const aeronavesMap = {};
            (window.AppData.aeronaves || []).forEach(a => {
                aeronavesMap[a.id] = {
                    tan: parseInt(a.capTan || 0, 10),
                    fun: parseInt(a.capFun || 0, 10),
                    cop: parseInt(a.capCop || 0, 10)
                };
            });

            let totalT = 0, totalF = 0, totalC = 0;
            (window.AppData.asignacionFlota || []).forEach(asg => {
                if (asg.fecha === dateStrYMD && asg.estado !== 'Cancelado') {
                    const cap = aeronavesMap[asg.id_aeronave];
                    if (cap) {
                        totalT += cap.tan;
                        totalF += cap.fun;
                        totalC += cap.cop;
                    }
                }
            });

            let usedT = 0, usedF = 0, usedC = 0;
            (window.AppData.passengers || []).forEach(p => {
                const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
                if (p.date === dateStrYMD && !isCancelled) {
                    if (p.type === 'Salto Tandem' || p.type === 'Tandem') usedT++;
                    else if (p.type === 'Copiloto') usedC++;
                    else if (p.type === 'Fun Jumper') usedF++;
                }
            });

            return { totalT, usedT, totalF, usedF, totalC, usedC };
        }
        // Check if day is No-Op
        function isNoOpDay(dateObj) {
            if (!window.AppData.noOpRules) return false;
            
            const dayIndex = String(dateObj.getDay()); // '0' to '6'
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;

            if (window.AppData.noOpRules.exceptions && window.AppData.noOpRules.exceptions.includes(dateStr)) {
                return false;
            }
            
            if (window.AppData.noOpRules.daysOfWeek && window.AppData.noOpRules.daysOfWeek.includes(dayIndex)) {
                return true;
            }
            
            if (window.AppData.noOpRules.specificDates && window.AppData.noOpRules.specificDates.includes(dateStr)) {
                return true;
            }
            
            return false;
        }

        // Format Date to YYYY-MM-DD for matching pax
        function formatToYYYYMMDD(dateObj) {
            const dd = String(dateObj.getDate()).padStart(2, '0');
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const yyyy = dateObj.getFullYear();
            return `${yyyy}-${mm}-${dd}`;
        }

        function renderCalendar() {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            monthYearLbl.textContent = `${monthNames[month]} ${year}`;
            
            calGrid.innerHTML = '';
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            // Empty slots for previous month
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                empty.style.background = 'transparent';
                calGrid.appendChild(empty);
            }
            
            for (let i = 1; i <= daysInMonth; i++) {
                const dDate = new Date(year, month, i);
                const dStr = formatToYYYYMMDD(dDate);
                const isNoOp = isNoOpDay(dDate);
                
                // Count Pax for this day
                const cap = getCapacityForDate(dStr);
                const paxCount = cap.usedT + cap.usedF + cap.usedC;
                
                const isToday = new Date().toDateString() === dDate.toDateString();
                const isActive = activeDateString === dStr;
                
                const cell = document.createElement('div');
                cell.style.border = `1px solid ${isActive ? 'var(--brand-action)' : 'var(--border-color)'}`;
                cell.style.borderRadius = 'var(--border-radius-sm)';
                cell.style.padding = '0.5rem';
                cell.style.cursor = 'pointer';
                cell.style.display = 'flex';
                cell.style.flexDirection = 'column';
                cell.style.background = isActive ? 'rgba(69, 220, 248, 0.1)' : 'var(--bg-surface)';
                cell.style.transition = 'all 0.2s';
                cell.style.minHeight = '100px';
                
                if (isToday) {
                    cell.style.border = '2px solid var(--brand-blue-light)';
                }

                if (isNoOp) {
                    cell.style.background = 'rgba(248, 97, 69, 0.1)'; // Light danger color
                    cell.style.borderColor = 'rgba(248, 97, 69, 0.3)';
                    cell.style.cursor = 'not-allowed';
                    
                    cell.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <div style="font-weight: bold; color: var(--brand-danger);">${i}</div>
                            <button class="btn btn-sm noop-toggle-btn" style="padding: 1px 4px; font-size: 0.65rem; background: var(--brand-success); color: white;" title="Habilitar Fecha">Habilitar</button>
                        </div>
                        <div style="margin-top: auto; font-size: 0.7rem; color: var(--brand-danger); font-weight: 600; text-align: center;"><i class="fas fa-ban"></i> NO OP</div>
                    `;
                    
                    cell.addEventListener('click', () => {
                        activeDateString = dStr;
                        renderDayDetails(dStr, true);
                        renderCalendar();
                    });
                } else {
                    let cTan = cap.totalT > 0 ? (cap.usedT >= cap.totalT ? 'var(--brand-danger)' : 'var(--brand-success)') : 'var(--text-secondary)';
                    let cFun = cap.totalF > 0 ? (cap.usedF >= cap.totalF ? 'var(--brand-danger)' : 'var(--brand-success)') : 'var(--text-secondary)';
                    let cCop = cap.totalC > 0 ? (cap.usedC >= cap.totalC ? 'var(--brand-danger)' : 'var(--brand-success)') : 'var(--text-secondary)';
                    
                    cell.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.25rem;">
                            <div style="font-weight: bold; color: var(--text-primary);">${i}</div>
                        </div>
                        <div style="margin-top: auto; font-size: 0.75rem; color: var(--text-secondary); text-align: left; line-height: 1.2;">
                            <div style="font-weight: bold; margin-bottom: 2px;">Reservas:</div>
                            <div style="color: ${cTan};">${cap.usedT}/${cap.totalT} Tandem</div>
                            <div style="color: ${cFun};">${cap.usedF}/${cap.totalF} Funjumper</div>
                            <div style="color: ${cCop};">${cap.usedC}/${cap.totalC} Copiloto</div>
                        </div>
                    `;
                    
                    cell.addEventListener('click', () => {
                        activeDateString = dStr;
                        renderDayDetails(dStr, false, paxCount);
                        renderCalendar();
                    });
                }

                // Add Toggle Event Logic
                const toggleBtn = cell.querySelector('.noop-toggle-btn');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        window.AppData = window.AppData || {};
                        window.AppData.noOpRules = window.AppData.noOpRules || { daysOfWeek: ['1', '2'], specificDates: [] };
                        const idx = window.AppData.noOpRules.specificDates.indexOf(dStr);
                        if (idx >= 0) {
                            window.AppData.noOpRules.specificDates.splice(idx, 1);
                        } else {
                            let confirmMsg = `¿Estás seguro que deseas bloquear el día ${dStr}?`;
                            if (paxCount > 0) {
                                confirmMsg += `\n\n¡ATENCIÓN! Este día cuenta con ${paxCount} reserva(s) activa(s).\nSi lo bloqueas, no se podrán tomar reservas nuevas, pero los pasajeros existentes permanecerán en el sistema.`;
                            }
                            const ok = window.showConfirm ? await window.showConfirm(confirmMsg, { title: 'Bloquear Día Operativo' }) : confirm(confirmMsg);
                            if (!ok) return;

                            window.AppData.noOpRules.specificDates.push(dStr);
                            window.AppData.noOpRules.specificDates.sort();
                        }
                        if (window.saveAppData) window.saveAppData();
                        renderCalendar();
                    });
                }
                
                // Hover effect
                cell.onmouseover = () => { if (!isActive) cell.style.background = 'var(--bg-surface-hover)'; };
                cell.onmouseout = () => { if (!isActive) cell.style.background = isNoOp ? 'rgba(248, 97, 69, 0.1)' : 'var(--bg-surface)'; };
                
                calGrid.appendChild(cell);
            }
        }

        function renderDayDetails(dateStr, isNoOp, paxCount = 0) {
            dayTitle.textContent = `Fecha: ${dateStr}`;
            
            if (isNoOp) {
                dayCapacity.innerHTML = `
                    <div style="font-size: 0.85rem; color: var(--brand-danger);"><i class="fas fa-exclamation-triangle"></i> Día de No Operación</div>
                    <div style="font-size: 1rem; color: var(--text-secondary); margin-top: 0.5rem; margin-bottom: 1rem;">No se permiten reservas para este día según la configuración.</div>
                    <button class="btn" id="btn-unblock-day" style="background: var(--brand-success); color: white; width: 100%; border: none;"><i class="fas fa-unlock"></i> Habilitar Día Especial</button>
                `;
                document.getElementById('btn-unblock-day').addEventListener('click', () => {
                    // dateStr is already YYYY-MM-DD
                    const ymd = dateStr;
                    
                    window.AppData.noOpRules.exceptions = window.AppData.noOpRules.exceptions || [];
                    if (!window.AppData.noOpRules.exceptions.includes(ymd)) {
                        window.AppData.noOpRules.exceptions.push(ymd);
                    }
                    if (window.saveAppData) window.saveAppData();
                    alert('Día habilitado exitosamente para operación.');
                    renderCalendar(); 
                    renderDayDetails(dateStr, false, 0);
                });
            } else {
                const dayCap = getCapacityForDate(dateStr);
                
                dayCapacity.innerHTML = `
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem;">Disponibilidad del día</div>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <div style="color: ${(dayCap.totalT - dayCap.usedT) > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'};">
                            <strong>Tándem:</strong> ${(dayCap.totalT - dayCap.usedT)} / ${dayCap.totalT}
                        </div>
                        <div style="color: ${(dayCap.totalF - dayCap.usedF) > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'};">
                            <strong>Fun Jumper:</strong> ${(dayCap.totalF - dayCap.usedF)} / ${dayCap.totalF}
                        </div>
                        <div style="color: ${(dayCap.totalC - dayCap.usedC) > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'};">
                            <strong>Copiloto:</strong> ${(dayCap.totalC - dayCap.usedC)} / ${dayCap.totalC}
                        </div>
                    </div>
                `;
            }
            
            const paxOfDay = (window.AppData.passengers || []).filter(p => p.date === dateStr);
            renderPaxList(paxOfDay);
        }

        function renderPaxList(paxArray) {
            const filterMed = document.getElementById('filter-medical');
            const filterMinor = document.getElementById('filter-minor');
            
            function isPaxMinor(p) {
                if (p.signatureMinor && Object.keys(p.signatureMinor).length > 0) return true;
                if (p.dob) {
                    const bd = new Date(p.dob + 'T00:00:00'); // Prevent timezone shift
                    const today = new Date();
                    let age = today.getFullYear() - bd.getFullYear();
                    if (today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) age--;
                    return age < 18;
                }
                return false;
            }

            if (filterMed && filterMed.checked) {
                paxArray = paxArray.filter(p => p.medicalCondition && p.medicalCondition.trim() !== '' && p.medicalCondition !== 'Ninguna');
            }
            if (filterMinor && filterMinor.checked) {
                paxArray = paxArray.filter(p => isPaxMinor(p));
            }

            if (paxArray.length === 0) {
                paxList.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">No hay pasajeros registrados.</p>`;
                return;
            }

            const fmtMoney = (n) => '$' + parseInt(n || 0, 10).toLocaleString('es-CO');
            
            paxList.innerHTML = paxArray.map(p => {
                const isCancelled = p.paxStatus === 'Cancelado / Cancelled';
                const medHtml = (p.medicalCondition && p.medicalCondition.trim() !== '' && p.medicalCondition !== 'Ninguna') ? `<span style="color: var(--brand-danger); margin-left: 5px; font-size: 1.1rem;" title="Condición Médica: ${escapeHTML(p.medicalCondition)}"><i class="fas fa-heartbeat"></i></span>` : '';
                const minorHtml = isPaxMinor(p) ? `<span style="color: #F97316; margin-left: 5px; font-size: 1.1rem;" title="Menor de Edad"><i class="fas fa-child"></i></span>` : '';

                const deleteBtn = !isCancelled ? `<button class="btn-cancel-res" data-id="${p.id}" style="background: transparent; border: none; color: var(--brand-danger); cursor: pointer; padding: 0 4px;" title="Cancelar Reserva"><i class="fas fa-trash-alt"></i></button>` : '';
                const editBtn = !isCancelled ? `<button class="btn-edit-res" data-id="${p.id}" style="background: transparent; border: none; color: var(--brand-blue); cursor: pointer; padding: 0 4px;" title="Editar Reserva"><i class="fas fa-pencil-alt"></i></button>` : '';
                const cancelMsg = isCancelled ? `<div style="color: var(--brand-danger); font-size: 0.8rem; margin-top: 0.5rem; background: rgba(248, 97, 69, 0.1); padding: 4px 8px; border-radius: 4px;"><strong>Cancelado:</strong> ${escapeHTML(p.observacionesCancelacion) || 'Sin observaciones'}</div>` : '';

                // Relacionar Información del Pago en el Panel Derecho (Req #4, #9, #10)
                const finSummary = window.getPaxFinancialSummary ? window.getPaxFinancialSummary(p) : {
                    totalValue: (p.financiera?.manualPrice || 0) - (p.financiera?.discount || 0),
                    totalPaid: p.financiera?.totalPaid || 0,
                    pending: Math.max(0, ((p.financiera?.manualPrice || 0) - (p.financiera?.discount || 0)) - (p.financiera?.totalPaid || 0)),
                    isComplete: ((p.financiera?.totalPaid || 0) >= ((p.financiera?.manualPrice || 0) - (p.financiera?.discount || 0)) && ((p.financiera?.manualPrice || 0) > 0)),
                    payMethod: p.financiera?.payMethod || 'Efectivo'
                };

                const daysUntilJump = (window.PaymentAlertsHelper && p.date) ? window.PaymentAlertsHelper.getDaysUntilJump(p.date) : null;
                const isUrgentPaymentAlert = !isCancelled && !finSummary.isComplete && daysUntilJump !== null && daysUntilJump >= 0 && daysUntilJump <= 10;

                let paymentStatusHtml = '';
                if (!isCancelled) {
                    if (finSummary.isComplete) {
                        paymentStatusHtml = `
                            <div style="margin-top: 0.55rem; padding: 0.55rem 0.75rem; border-radius: 8px; background: rgba(16, 185, 129, 0.12); border: 1px solid var(--brand-success);">
                                <div style="display: flex; justify-content: space-between; align-items: center; color: var(--brand-success); font-weight: 700; font-size: 0.82rem;">
                                    <span><i class="fas fa-check-circle"></i> PAGO COMPLETO</span>
                                    <span>${fmtMoney(finSummary.totalPaid)}</span>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 2px;">
                                    Valor Reserva: <strong>${fmtMoney(finSummary.totalValue)}</strong> | Medio: <strong>${escapeHTML(finSummary.payMethod)}</strong>
                                </div>
                            </div>
                        `;
                    } else {
                        paymentStatusHtml = `
                            <div style="margin-top: 0.55rem; padding: 0.55rem 0.75rem; border-radius: 8px; background: rgba(220, 38, 38, 0.1); border: 1px solid var(--brand-danger);">
                                <div style="display: flex; justify-content: space-between; align-items: center; color: var(--brand-danger); font-weight: 700; font-size: 0.82rem;">
                                    <span><i class="fas fa-exclamation-triangle"></i> ALERTA: PAGO INCOMPLETO</span>
                                    <span>Saldo: ${fmtMoney(finSummary.pending)}</span>
                                </div>
                                <div style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 3px;">
                                    Total: <strong>${fmtMoney(finSummary.totalValue)}</strong> | Abonado: <strong>${fmtMoney(finSummary.totalPaid)}</strong>
                                </div>
                                ${isUrgentPaymentAlert ? `
                                    <div style="margin-top: 0.45rem; padding-top: 0.45rem; border-top: 1px dashed rgba(220, 38, 38, 0.35); display: flex; justify-content: space-between; align-items: center; gap: 0.4rem; flex-wrap: wrap;">
                                        <span style="font-size: 0.74rem; color: var(--brand-danger); font-weight: 700;">
                                            <i class="fas fa-clock"></i> Faltan ${daysUntilJump} día(s) para el salto
                                        </span>
                                        <button type="button" class="btn btn-warning btn-sm btn-send-pax-email-alert" data-id="${p.id}" style="padding: 0.2rem 0.55rem; font-size: 0.73rem;">
                                            <i class="fas fa-envelope"></i> Alerta Correo
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }
                }

                // Soporte de Pago B2C visible en Reservas (Req #10)
                const hasB2CSupport = Boolean((p.paymentSupport && p.paymentSupport.dataUrl) || p.soportePago);
                const supportHtml = hasB2CSupport
                    ? `<button type="button" class="btn btn-primary btn-sm btn-view-b2c-support" data-id="${p.id}" style="margin-top: 0.45rem; width: 100%; padding: 0.38rem 0.6rem; font-size: 0.78rem;">
                           <i class="fas fa-file-invoice-dollar"></i> Ver Soporte de Pago Adjunto (B2C)
                       </button>`
                    : `<div style="margin-top: 0.4rem; font-size: 0.74rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.35rem;">
                           <i class="fas fa-receipt"></i> Soporte de pago B2C: No adjuntado
                       </div>`;
                
                return `
                <div style="border: 1px solid var(--border-color); padding: 0.75rem; border-radius: var(--border-radius-sm); margin-bottom: 0.6rem; background: var(--bg-surface);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem;">
                        <strong style="color: var(--brand-blue);"><i class="fas fa-user"></i> ${escapeHTML(p.name)} ${medHtml} ${minorHtml}</strong>
                        <div style="display: flex; gap: 0.5rem; align-items: center;">
                            <span style="font-size: 0.75rem; background: var(--bg-surface-hover); padding: 2px 6px; border-radius: 4px;">${escapeHTML(p.type)}</span>
                            ${editBtn}
                            ${deleteBtn}
                        </div>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                        <i class="fas fa-id-card"></i> ${escapeHTML(p.doc)} &nbsp;|&nbsp; <i class="fas fa-phone"></i> ${escapeHTML(p.phone)}
                    </div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary);">
                        <i class="fas fa-calendar"></i> ${escapeHTML(p.date)} &nbsp;|&nbsp; <i class="fas fa-clock"></i> ${escapeHTML(p.time || 'N/A')}
                        ${p.aeronave && p.aeronave !== 'Sin asignar' ? `<br><i class="fas fa-plane"></i> ${escapeHTML(p.aeronave)}` : ''}
                    </div>
                    ${paymentStatusHtml}
                    ${!isCancelled ? supportHtml : ''}
                    ${cancelMsg}
                </div>
                `;
            }).join('');

            // Attach event listeners to B2C payment support viewer buttons (Req #10)
            paxList.querySelectorAll('.btn-view-b2c-support').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const p = window.AppData.passengers.find(x => x.id === id);
                    if (p && window.viewPaymentSupportModal) {
                        window.viewPaymentSupportModal(p);
                    }
                });
            });

            // Attach event listeners to individual Email Alert buttons (Req #9)
            paxList.querySelectorAll('.btn-send-pax-email-alert').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.dataset.id;
                    const p = window.AppData.passengers.find(x => x.id === id);
                    if (!p || !window.PaymentAlertsHelper) return;
                    const finSummary = window.getPaxFinancialSummary(p);
                    const daysRem = window.PaymentAlertsHelper.getDaysUntilJump(p.date) || 0;
                    e.currentTarget.disabled = true;
                    e.currentTarget.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                    await window.PaymentAlertsHelper.sendEmailAlert({
                        pax: p,
                        daysRemaining: daysRem,
                        totalValue: finSummary.totalValue,
                        totalPaid: finSummary.totalPaid,
                        pending: finSummary.pending
                    }, false);
                    updateAlertsCounter();
                    if (activeDateString) renderDayDetails(activeDateString, false);
                    else executeSearch();
                });
            });

            // Attach event listeners to cancel buttons
            paxList.querySelectorAll('.btn-cancel-res').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    paxToCancelId = e.currentTarget.dataset.id;
                    modalCancel.style.display = 'flex';
                    txtCancelObs.value = '';
                    txtCancelObs.focus();
                });
            });

            // Attach event listeners to edit buttons
            paxList.querySelectorAll('.btn-edit-res').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.dataset.id;
                    const p = window.AppData.passengers.find(x => x.id === id);
                    if(!p) return;
                    
                    paxToEditId = id;
                    
                    let fullName = (p.name || '').trim();
                    if (p.lastname && !fullName.includes(p.lastname)) {
                        fullName += ' ' + p.lastname;
                    }
                    iEditName.value = fullName.trim();

                    iEditDoc.value = p.doc || '';
                    iEditPhone.value = p.phone || '';
                    iEditEmail.value = p.email || '';
                    iEditDate.value = p.date || '';
                    iEditType.value = p.type || 'Salto Tandem';
                    
                    const cams = p.cams || '';
                    iEditCam360.checked = cams.includes('360');
                    iEditCamGoPro.checked = cams.includes('GoPro');
                    iEditCamExt.checked = cams.includes('Externa');
                    
                    modalEditRes.style.display = 'flex';
                });
            });
        }

        function executeSearch() {
            const term = searchInput.value.toLowerCase().trim();
            const dFilter = dateFilter.value; // YYYY-MM-DD
            
            if (!term && !dFilter) {
                activeDateString = null;
                dayTitle.textContent = 'Selecciona un día';
                dayCapacity.innerHTML = `
                    <div style="font-size: 0.85rem; color: var(--text-secondary);">Disponibilidad del día</div>
                    <div style="font-size: 1.5rem; font-weight: 700; color: var(--brand-action);">-- / --</div>
                `;
                paxList.innerHTML = `<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">Selecciona una fecha en el calendario o usa el buscador para ver los pasajeros.</p>`;
                renderCalendar();
                return;
            }
            
            // If date is provided, format it and change calendar month
            if (dFilter) {
                const parts = dFilter.split('-'); // YYYY-MM-DD
                const yyyy = parseInt(parts[0]);
                const mm = parseInt(parts[1]) - 1;
                const dd = parseInt(parts[2]);
                
                currentDate = new Date(yyyy, mm, 1);
                const tgtDateStr = dFilter;
                
                activeDateString = tgtDateStr;
                renderCalendar();
                
                // If no term, just show day details
                if(!term) {
                    const isNoOp = isNoOpDay(new Date(yyyy, mm, dd));
                    let pCount = (window.AppData.passengers || []).filter(p => p.date === tgtDateStr).length;
                    renderDayDetails(tgtDateStr, isNoOp, pCount);
                    return;
                }
            }
            
            // Search globally
            const results = (window.AppData.passengers || []).filter(p => {
                const matchesTerm = !term || p.name.toLowerCase().includes(term) || String(p.doc).includes(term) || String(p.phone).includes(term);
                const matchesDate = !dFilter || p.date === activeDateString;
                return matchesTerm && matchesDate;
            });
            
            dayTitle.textContent = 'Resultados de Búsqueda';
            dayCapacity.innerHTML = `<div style="font-size: 0.85rem; color: var(--text-secondary);">Coincidencias: <strong>${results.length}</strong> pasajeros</div>`;
            renderPaxList(results);
        }

        // Events
        document.getElementById('booking-prev-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
        document.getElementById('booking-next-month').addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
        
        searchInput.addEventListener('input', executeSearch);
        dateFilter.addEventListener('change', executeSearch);
        document.getElementById('filter-medical').addEventListener('change', () => {
            if (activeDateString) {
                renderDayDetails(activeDateString, false);
            } else {
                executeSearch();
            }
        });
        document.getElementById('filter-minor').addEventListener('change', () => {
            if (activeDateString) {
                renderDayDetails(activeDateString, false);
            } else {
                executeSearch();
            }
        });
        
        document.getElementById('booking-btn-clear').addEventListener('click', () => {
            searchInput.value = '';
            dateFilter.value = '';
            executeSearch();
        });

        function updateAlertsCounter() {
            const countSpan = document.getElementById('booking-alerts-count');
            if (!countSpan || !window.PaymentAlertsHelper) return;
            const list = window.PaymentAlertsHelper.getQualifyingReservations();
            countSpan.textContent = list.length;
        }

        const btnEmailAlerts = document.getElementById('btn-booking-email-alerts');
        if (btnEmailAlerts) {
            btnEmailAlerts.addEventListener('click', () => {
                if (window.PaymentAlertsHelper) {
                    window.PaymentAlertsHelper.openAlertsCenterModal(() => {
                        updateAlertsCounter();
                        if (activeDateString) renderDayDetails(activeDateString, false);
                        else executeSearch();
                    });
                }
            });
        }

        // Init
        const initDate = new Date();
        activeDateString = formatToYYYYMMDD(initDate);
        currentDate = new Date(initDate.getFullYear(), initDate.getMonth(), 1);
        renderCalendar();
        updateAlertsCounter();
        if (window.PaymentAlertsHelper) {
            window.PaymentAlertsHelper.runAutoCheckOnLoad();
        }
        
        // Show today's pax list by default
        const isNoOp = isNoOpDay(initDate);
        let initCount = (window.AppData.passengers || []).filter(p => p.date === activeDateString).length;
        renderDayDetails(activeDateString, isNoOp, initCount);
    }
};
