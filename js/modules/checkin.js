window.Modules = window.Modules || {};

window.Modules.checkin = {
    render: (container) => {
        container.innerHTML = `
            <style>
                .kanban-col {
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    min-width: 250px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                }
                .kanban-card {
                    background: var(--bg-surface-hover);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 1rem;
                    cursor: pointer;
                    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
                }
                .kanban-card:hover {
                    transform: translateY(-4px) scale(1.02);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.3);
                    border-color: rgba(255,255,255,0.15);
                }
                .glass-modal {
                    background: var(--bg-surface) !important;
                    backdrop-filter: blur(16px) !important;
                    border: 1px solid var(--border-color) !important;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important;
                    padding: 2.5rem !important;
                }
            </style>
            <div style="display: flex; flex-direction: column; height: 100%; gap: 1rem;">
                <!-- Header -->
                <div class="glass-card" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: var(--glass-bg); backdrop-filter: blur(12px); border: 1px solid var(--border-color); border-radius: 12px; margin-bottom: 1rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, var(--brand-action), #f59e0b); display: flex; align-items: center; justify-content: center; color: var(--text-primary); font-size: 1.5rem;">
                            <i class="fas fa-clipboard-check"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; color: var(--text-primary);">Check-in Operativo</h2>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Recepción, peso, firmas y pagos adicionales</p>
                        </div>
                    </div>
                    <div>
                        <input type="text" id="search-passenger" class="form-control" placeholder="Buscar pasajero..." style="width: 300px;">
                    </div>
                </div>

                <!-- Kanban Board -->
                <div style="display: flex; gap: 1.5rem; flex: 1; overflow-y: hidden;">
                    
                    <!-- Columna: Pendiente -->
                    <div class="kanban-col" style="flex: 1; display: flex; flex-direction: column; min-width: 250px;">
                        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem; color: var(--brand-warning); font-size: 1.1rem; border-bottom: 2px solid var(--brand-warning); padding-bottom: 0.5rem;">
                            <i class="fas fa-clock"></i> Pendientes Check-in (<span id="count-pend">0</span>)
                        </h3>
                        <div id="col-pend" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding-right: 0.5rem;">
                            <!-- Cards -->
                        </div>
                    </div>

                    <!-- Columna: Listo (Check-in completado) -->
                    <div class="kanban-col" style="flex: 1; display: flex; flex-direction: column; min-width: 250px;">
                        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem; color: var(--brand-success); font-size: 1.1rem; border-bottom: 2px solid var(--brand-success); padding-bottom: 0.5rem;">
                            <i class="fas fa-check-circle"></i> Check-in Listo (<span id="count-ready">0</span>)
                        </h3>
                        <div id="col-ready" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding-right: 0.5rem;">
                            <!-- Cards -->
                        </div>
                    </div>

                    <!-- Columna: En Vuelo -->
                    <div class="kanban-col" style="flex: 1; display: flex; flex-direction: column; min-width: 250px;">
                        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem; color: var(--brand-info, #0dcaf0); font-size: 1.1rem; border-bottom: 2px solid var(--brand-info, #0dcaf0); padding-bottom: 0.5rem;">
                            <i class="fas fa-plane-departure"></i> En Vuelo (<span id="count-flight">0</span>)
                        </h3>
                        <div id="col-flight" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding-right: 0.5rem;">
                            <!-- Cards -->
                        </div>
                    </div>

                    <!-- Columna: Completado -->
                    <div class="kanban-col" style="flex: 1; display: flex; flex-direction: column; min-width: 250px;">
                        <h3 style="margin-top: 0; display: flex; align-items: center; gap: 0.5rem; color: var(--brand-blue); font-size: 1.1rem; border-bottom: 2px solid var(--brand-blue); padding-bottom: 0.5rem;">
                            <i class="fas fa-flag-checkered"></i> Completado / Facturar (<span id="count-comp">0</span>)
                        </h3>
                        <div id="col-comp" style="flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 1rem; padding-right: 0.5rem;">
                            <!-- Cards -->
                        </div>
                    </div>

                </div>
            </div>

            <!-- Modal for Check-in -->
            <div id="modal-edit-passenger" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content glass-modal" style="width: 750px; max-width: 95%; max-height: 90vh; overflow-y: auto; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <h3 style="margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-user-edit" style="color: var(--brand-action);"></i> Completar Check-in</h3>
                    
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem; margin-top:1rem;">
                        <div class="form-group">
                            <label>Nombre del Pasajero</label>
                            <input type="text" id="edit-p-name" class="form-control" disabled style="background: var(--bg-surface-hover); font-weight: bold; color: var(--text-primary);">
                        </div>
                        <div class="form-group">
                            <label>Documento</label>
                            <input type="text" id="edit-p-doc" class="form-control" disabled style="background: var(--bg-surface-hover); font-weight: bold; color: var(--text-primary);">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label>Peso (Kg)</label>
                            <input type="number" id="edit-p-weight" class="form-control" placeholder="Ej. 75">
                        </div>
                        <div class="form-group">
                            <label>Instructor Asignado</label>
                            <select id="edit-p-instructor" class="form-control">
                                <option value="Sin asignar">Sin asignar</option>
                            </select>
                        </div>
                        <div class="form-group" id="edit-cam-instructor-container" style="display: none;">
                            <label>Instructor Cámara Externa</label>
                            <select id="edit-p-cam-instructor" class="form-control">
                                <option value="Sin asignar">Sin asignar</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="form-group">
                            <label>Aeronave Asignada</label>
                            <select id="edit-p-aeronave" class="form-control">
                                <option value="Sin asignar">Sin asignar</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Número de Vuelo / Hora</label>
                            <select id="edit-p-vuelo" class="form-control" disabled>
                                <option value="Sin asignar">Primero seleccione Aeronave</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
                        <!-- Adicionales de camara -->
                        <div class="form-group">
                            <label>Servicios Adicionales (Sincronizado)</label>
                            <div id="checkin-dynamic-adiciones"></div>
                        </div>
                        
                                                <!-- Asignación de equipo (Inventario) -->
                        <div class="form-group" id="edit-equipo-container">
                            <label>Equipo (Paracaídas)</label>
                            <select id="edit-p-equipo" class="form-control">
                                <option value="">Sin Asignar</option>
                            </select>
                            <small style="color: var(--text-secondary);" id="edit-p-equipo-help">Equipos Disponibles</small>
                        </div>

                        <!-- Asignación de Accesorios/Material (Inventario) -->
                        <div class="form-group" id="edit-accesorios-container">
                            <label>Accesorios / Material</label>
                            <select id="edit-p-accesorios" class="form-control" multiple style="min-height: 80px;">
                            </select>
                            <small style="color: var(--text-secondary);">Selección múltiple (Ctrl/Cmd + click)</small>
                        </div>
                    </div>

                    <div class="form-group" id="edit-medical-container" style="display: none; margin-top: 1rem; border: 1px solid var(--brand-danger); padding: 1rem; border-radius: 8px; background: rgba(239, 68, 68, 0.05);">
                        <label style="color: var(--brand-danger); font-weight: bold;"><i class="fas fa-heartbeat"></i> Condición Médica Reportada</label>
                        <div id="edit-p-medical" style="color: var(--text-primary); font-size: 0.95rem; margin-top: 0.5rem; background: var(--bg-surface); padding: 0.5rem; border-radius: 4px;"></div>
                    </div>

                    <div class="form-group" id="edit-minor-container" style="display: none; margin-top: 1rem; border: 1px solid #F97316; padding: 1rem; border-radius: 8px; background: rgba(249, 115, 22, 0.05);">
                        <label style="color: #F97316; font-weight: bold;"><i class="fas fa-child"></i> Pasajero Menor de Edad</label>
                        <div style="color: var(--text-primary); font-size: 0.95rem; margin-top: 0.5rem; background: var(--bg-surface); padding: 0.5rem; border-radius: 4px;">
                            Este pasajero cuenta con firmas y documentación registrada por sus Tutores Legales.
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 1rem; border: 1px solid var(--brand-action); padding: 1rem; border-radius: 8px; background: rgba(255,152,0,0.05);">
                        <label style="display:flex; align-items:center; gap:0.5rem; margin:0; cursor:pointer; font-weight: 600; color: var(--brand-action); font-size: 1.1rem;">
                            <input type="checkbox" id="edit-p-waiver" style="width: 20px; height: 20px;"> Exoneración de Responsabilidad (FIRMADA)
                        </label>
                    </div>

                    <div style="background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--brand-action);">
                        <div>
                            <strong style="font-size: 1.1rem;">Saldo Pendiente de Reserva</strong>
                            <div style="font-size:0.85rem; color:var(--text-secondary);">El pasajero debe tener saldo $0 para completar el Check-in.</div>
                        </div>
                        <div id="edit-p-balance" style="color:var(--brand-action); font-weight:bold; font-size:1.5rem;">$0</div>
                    </div>
                    
                    <div style="background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-left: 4px solid var(--brand-danger);">
                        <div>
                            <strong style="font-size: 1.1rem;">Cobro Extra Estimado (Check-in)</strong>
                            <div style="font-size:0.85rem; color:var(--text-secondary);">* Exceso de peso (>85kg) cobra $5.000 x Kg. Adicionales de cámara.</div>
                        </div>
                        <div id="edit-p-extra-charge" style="color:var(--brand-danger); font-weight:bold; font-size:1.5rem;">$0</div>
                    </div>

                    <div id="payment-section" style="background: rgba(46, 204, 113, 0.05); padding: 1.25rem; border-radius: 8px; margin-bottom: 1.5rem; border: 1px solid rgba(46, 204, 113, 0.3); display: none;">
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--brand-success); font-weight: bold; font-size: 1.1rem;">
                            <i class="fas fa-hand-holding-usd"></i> Registrar Pago
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 1rem; align-items: flex-end;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.85rem; color: var(--text-secondary);">Monto a Pagar</label>
                                <div style="position: relative;">
                                    <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-secondary); font-weight: bold;">$</span>
                                    <input type="text" id="edit-p-pay-amount" class="form-control" placeholder="0" style="padding-left: 25px; font-weight: bold;">
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label style="font-size: 0.85rem; color: var(--text-secondary);">Forma de Pago</label>
                                <select id="edit-p-pay-method" class="form-control" style="font-weight: 500;">
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Transferencia">Transferencia (Nequi/Bancolombia)</option>
                                    <option value="Tarjeta/Datafono">Tarjeta / Datáfono</option>
                                    <option value="Link de Pago">Link de Pago</option>
                                </select>
                            </div>
                            <button class="btn btn-success" id="btn-register-payment" style="height: 42px; padding: 0 1.5rem; font-weight: bold;"><i class="fas fa-check"></i> Pagar</button>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Estado Check-in</label>
                        <select id="edit-p-status" class="form-control" disabled style="font-weight: bold;">
                            <option value="Pendiente Check-in">Pendiente Check-in</option>
                            <option value="Check-in Listo">Check-in Listo (Autorizado)</option>
                        </select>
                    </div>

                    <div style="display:flex; justify-content:flex-end; gap:1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-outline" id="btn-cancel-edit">Cerrar</button>
                        <button class="btn btn-primary" id="btn-save-edit" style="padding: 0.75rem 2rem;"><i class="fas fa-save"></i> Guardar Check-in</button>
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
        window.AppData.passengers = window.AppData.passengers || [];
        window.AppData.employees = window.AppData.employees || [];
        window.AppData.inventory = window.AppData.inventory || [];
        window.AppData.aeronaves = window.AppData.aeronaves || [];
        
        let activeEditId = null;

        const colPend = document.getElementById('col-pend');
        const colReady = document.getElementById('col-ready');
        const colFlight = document.getElementById('col-flight');
        const colComp = document.getElementById('col-comp');

        function createPaxCard(pax) {
            const typeBadge = pax.type.toLowerCase().replace(' ', '');
            const badgeClass = typeBadge === 'tandem' ? 'var(--brand-action)' : 'var(--brand-success)';
            
            const card = document.createElement('div');
            card.className = 'card passenger-card';
            card.style.padding = '1rem';
            card.style.marginBottom = '0';
            card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
            card.style.cursor = 'pointer';
            card.style.borderLeft = `4px solid ${badgeClass}`;
            card.setAttribute('data-search', `${pax.doc} ${pax.phone} ${pax.name}`.toLowerCase());
            
            let statusIcon = 'fa-clock';
            if (pax.paxStatus === 'Check-in Listo') statusIcon = 'fa-check-circle';
            if (pax.paxStatus === 'Completado' || pax.flightStatus === 'Completado') statusIcon = 'fa-plane';

            
            let balanceBadge = '';
            let totalToPay = 0;
            if (pax.financiera) {
                 const base = pax.financiera.manualPrice || 0;
                 const discount = pax.financiera.discount || 0;
                 totalToPay = base - discount;
                 if (totalToPay < 0) totalToPay = 0;
            }
            const paid = pax.financiera ? (pax.financiera.totalPaid || 0) : 0;
            const pending = totalToPay - paid;
            
            if (pending > 0) {
                balanceBadge = '<span style="color: var(--brand-danger); font-weight: bold;"><i class="fas fa-exclamation-triangle"></i> Pendiente</span>';
            } else {
                balanceBadge = '<span style="color: var(--brand-success);"><i class="fas fa-check-circle"></i> Pagado</span>';
            }
            
            const signatureBadge = pax.waiverSigned ? '<span style="color: var(--brand-success);"><i class="fas fa-signature"></i> Firmado</span>' : '<span style="color: var(--text-secondary);"><i class="fas fa-signature"></i> Sin Firma</span>';
            const weightBadge = pax.weight ? `<span style="color: var(--text-primary);"><i class="fas fa-weight-hanging"></i> ${pax.weight} Kg</span>` : '<span style="color: var(--brand-warning);"><i class="fas fa-weight-hanging"></i> - Kg</span>';

            let medicalBadge = '';
            if (pax.medicalCondition && pax.medicalCondition.trim() !== '' && pax.medicalCondition !== 'Ninguna') {
                medicalBadge = `<span style="color: var(--brand-danger);" title="${escapeHTML(pax.medicalCondition)}"><i class="fas fa-heartbeat"></i> Médica</span> <span style="color: var(--text-secondary);">|</span> `;
            }

            function isPaxMinor(p) {
                if (p.signatureMinor && Object.keys(p.signatureMinor).length > 0) return true;
                if (p.dob) {
                    const bd = new Date(p.dob + 'T00:00:00');
                    const today = new Date();
                    let age = today.getFullYear() - bd.getFullYear();
                    if (today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) age--;
                    return age < 18;
                }
                return false;
            }

            let minorBadge = '';
            if (isPaxMinor(pax)) {
                minorBadge = `<span style="color: #F97316;" title="Menor de Edad"><i class="fas fa-child"></i> Menor</span> <span style="color: var(--text-secondary);">|</span> `;
            }

            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                    <strong class="p-name" style="font-size: 1.1rem; color: var(--text-primary);">${escapeHTML(pax.name || 'Sin Nombre')}</strong>
                    <span style="font-size: 0.75rem; background: ${badgeClass}; color: var(--text-primary); padding: 2px 8px; border-radius: 12px; font-weight: 600;">${escapeHTML(pax.type)}</span>
                </div>
                
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas ${statusIcon}"></i> Hora: <strong>${escapeHTML(pax.time || 'N/A')}</strong>
                </div>
                
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; font-size: 0.75rem; background: var(--bg-surface-hover); padding: 0.5rem; border-radius: 6px;">
                    ${medicalBadge}
                    ${minorBadge}
                    ${balanceBadge}
                    <span style="color: var(--text-secondary);">|</span>
                    ${signatureBadge}
                    <span style="color: var(--text-secondary);">|</span>
                    ${weightBadge}
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-surface-hover); padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem;">
                    <span><i class="fas fa-plane"></i> ${escapeHTML(pax.aeronave || 'S/A')}</span>
                    <span><i class="fas fa-user-tie"></i> ${escapeHTML(pax.instructor || 'S/A')}</span>
                    <span><i class="fas fa-video"></i> ${escapeHTML(pax.cams || 'Ninguna')}</span>
                </div>
            `;
            
            // Allow clicking the card to edit (unless completed, though viewing is fine)
            card.addEventListener('click', () => openEditModal(pax));
            return card;
        }

        function renderKanban() {
            colPend.innerHTML = '';
            colReady.innerHTML = '';
            colFlight.innerHTML = '';
            colComp.innerHTML = '';

            let cPend = 0, cReady = 0, cFlight = 0, cComp = 0;
            const term = document.getElementById('search-passenger').value.toLowerCase();

            const todayStr = new Date().toLocaleDateString('en-CA');
            const paxs = window.AppData.passengers
                .filter(p => p.paxStatus !== 'Cancelado / Cancelled' && p.date === todayStr)
                .sort((a,b) => (a.time || '').localeCompare(b.time || ''));

            paxs.forEach(pax => {
                const searchData = `${pax.doc} ${pax.phone} ${pax.name}`.toLowerCase();
                if (term && !searchData.includes(term)) return;

                const card = createPaxCard(pax);

                if (pax.paxStatus === 'Completado' || pax.flightStatus === 'Completado' || pax.flightStatus === 'Aterrizó') {
                    colComp.appendChild(card);
                    cComp++;
                } else if (pax.flightStatus === 'En El Aire' || pax.flightStatus === 'Paracaidistas en el aire') {
                    colFlight.appendChild(card);
                    cFlight++;
                } else if (pax.paxStatus === 'Check-in Listo') {
                    colReady.appendChild(card);
                    cReady++;
                } else {
                    colPend.appendChild(card);
                    cPend++;
                }
            });

            document.getElementById('count-pend').textContent = cPend;
            document.getElementById('count-ready').textContent = cReady;
            document.getElementById('count-flight').textContent = cFlight;
            document.getElementById('count-comp').textContent = cComp;
        }

        document.getElementById('search-passenger').addEventListener('input', renderKanban);

        // =======================
        // Edit Modal Logic
        // =======================
        const modal = document.getElementById('modal-edit-passenger');
        const modalContent = modal.querySelector('.modal-content');
        
        const iWeight = document.getElementById('edit-p-weight');
        let iCams = Array.from(document.querySelectorAll('.cam-chk'));
        const iStatus = document.getElementById('edit-p-status');
        const iWaiver = document.getElementById('edit-p-waiver');
        const iInstructor = document.getElementById('edit-p-instructor');
        const iAeronave = document.getElementById('edit-p-aeronave');
        const iVuelo = document.getElementById('edit-p-vuelo');
        const iEquipo = document.getElementById('edit-p-equipo');
        const chargeSpan = document.getElementById('edit-p-extra-charge');

        iWaiver.addEventListener('change', () => {
            if (iWaiver.checked) {
                iStatus.disabled = false;
                iStatus.value = 'Check-in Listo'; // auto-suggest
            } else {
                iStatus.disabled = true;
                iStatus.value = 'Pendiente Check-in';
            }
        });

        let currentPaxBalance = 0;
        let baseValorReserva = 0;
        let basePagado = 0;

        function formatCurrency(val) {
            return '$' + val.toLocaleString('es-CO');
        }

        function calculateExtras() {
            let total = 0;
            let hasExternalCam = false;
            iCams.forEach(chk => {
                if(chk.checked && (chk.value.includes('Ext') || chk.value.includes('Externa'))) hasExternalCam = true;
            });
            const camInstContainer = document.getElementById('edit-cam-instructor-container');
            if(camInstContainer) camInstContainer.style.display = hasExternalCam ? 'block' : 'none';

            const activePax = (window.AppData.passengers || []).find(p => p.id === activeEditId) || null;
            const kgExtraRate = (window.TariffGuard ? window.TariffGuard.getPriceForRecord(activePax, 'Valor KG Extra') : 0) || 5000;
            const w = parseFloat(iWeight.value) || 0;
            if (w > 85) total += (w - 85) * kgExtraRate;
            
            iCams.forEach(chk => {
                if(chk.checked) total += parseInt(chk.dataset.price);
            });
            
            chargeSpan.textContent = formatCurrency(total);
            
            // Actualizar Saldo Total
            const saldoTotal = currentPaxBalance + total;
            document.getElementById('edit-p-balance').textContent = formatCurrency(saldoTotal);
            
            if (saldoTotal > 0) {
                document.getElementById('edit-p-balance').style.color = 'var(--brand-danger)';
                document.getElementById('payment-section').style.display = 'block';
                document.getElementById('edit-p-pay-amount').value = saldoTotal.toLocaleString('es-CO');
            } else {
                document.getElementById('edit-p-balance').style.color = 'var(--brand-success)';
                document.getElementById('payment-section').style.display = 'none';
            }
        }

        iWeight.addEventListener('input', calculateExtras);
        iCams.forEach(chk => chk.addEventListener('change', calculateExtras));

        // Format monto a pagar
        const iPayAmount = document.getElementById('edit-p-pay-amount');
        iPayAmount.addEventListener('input', (e) => {
            let val = e.target.value.replace(/[^0-9]/g, '');
            if (val) {
                e.target.value = parseInt(val, 10).toLocaleString('es-CO');
            } else {
                e.target.value = '';
            }
        });

        // Registrar Pago Logic
        document.getElementById('btn-register-payment').addEventListener('click', () => {
            if (!activeEditId) return;
            const paxIndex = window.AppData.passengers.findIndex(p => p.id === activeEditId);
            if (paxIndex === -1) return;
            
            const pax = window.AppData.passengers[paxIndex];
            const payAmountStr = document.getElementById('edit-p-pay-amount').value;
            const payAmount = parseFloat(payAmountStr.replace(/[^0-9]/g, '')) || 0;
            const payMethod = document.getElementById('edit-p-pay-method').value;
            
            if (payAmount <= 0) return alert('Ingrese un monto válido para pagar.');
            
            // Si el pax no tiene financiera, la inicializamos
            if (!pax.financiera) {
                pax.financiera = {
                    manualPrice: 0,
                    discount: 0,
                    totalPaid: 0,
                    payMethod: payMethod
                };
            }
            
            pax.financiera.totalPaid = (pax.financiera.totalPaid || 0) + payAmount;
            
            // Opcional: Podríamos enviar este ingreso a pettyCash (Caja Menor) aquí,
            // pero para mantenerlo simple y centrado en el check-in, solo actualizamos el pasajero.
            
            if (window.saveAppData) window.saveAppData();
            
            alert('Pago registrado exitosamente por ' + formatCurrency(payAmount));
            
            // Recalcular
            basePagado = pax.financiera.totalPaid;
            currentPaxBalance = baseValorReserva - basePagado;
            calculateExtras();
        });

        function updateInstructorAvailability(timeValue, paxId, currentInst) {
            const busyInstructors = new Set();
            window.AppData.passengers.forEach(p => {
                if (p.id !== paxId && p.time === timeValue && p.instructor && p.instructor !== 'Sin asignar') {
                    busyInstructors.add(p.instructor);
                }
            });

            iInstructor.innerHTML = '<option value="Sin asignar">Sin asignar</option>';
            const formatEmpName = (emp) => (String(emp.name || '') + (emp.lastname ? ' ' + String(emp.lastname) : '')).replace(/\s+/g, ' ').trim();

            // Req #6: Rol cargo Instructor Tándem, AFF y S&TA aplica para Instructor Asignado
            const instructorList = Array.from(new Set(
                window.AppData.employees
                    .filter(e => window.isAssignableInstructor
                        ? window.isAssignableInstructor(e)
                        : (e.role && (e.role.includes('Instructor') || e.role === 'S&TA' || e.role.includes('Tandem'))))
                    .map(formatEmpName)
                    .filter(Boolean)
            ));

            const camInstructorList = Array.from(new Set(
                window.AppData.employees
                    .filter(e => window.isAssignableCameraInstructor
                        ? window.isAssignableCameraInstructor(e)
                        : (e.role && (e.role.includes('Instructor') || e.role === 'S&TA' || e.role.includes('Camara') || e.role.includes('Cameraman') || e.role.includes('Tandem'))))
                    .map(formatEmpName)
                    .filter(Boolean)
            ));

            const iCamInstructor = document.getElementById('edit-p-cam-instructor');
            let currentCamInst = iCamInstructor ? iCamInstructor.value : 'Sin asignar';

            let instHtml = '';
            instructorList.forEach(inst => {
                if (!busyInstructors.has(inst)) {
                    instHtml += `<option value="${escapeHTML(inst)}">${escapeHTML(inst)}</option>`;
                }
            });
            iInstructor.innerHTML += instHtml;
            const matchedInstOpt = Array.from(iInstructor.options).find(opt =>
                opt.value === currentInst || (currentInst && currentInst !== 'Sin asignar' && opt.value.toLowerCase().startsWith(String(currentInst).toLowerCase() + ' '))
            );
            if (matchedInstOpt) iInstructor.value = matchedInstOpt.value;
            else iInstructor.value = 'Sin asignar';

            if (iCamInstructor) {
                let camInstHtml = '';
                camInstructorList.forEach(inst => {
                    if (!busyInstructors.has(inst)) {
                        camInstHtml += `<option value="${escapeHTML(inst)}">${escapeHTML(inst)}</option>`;
                    }
                });
                iCamInstructor.innerHTML = '<option value="Sin asignar">Sin asignar</option>' + camInstHtml;
                const matchedCamOpt = Array.from(iCamInstructor.options).find(opt =>
                    opt.value === currentCamInst || (currentCamInst && currentCamInst !== 'Sin asignar' && opt.value.toLowerCase().startsWith(String(currentCamInst).toLowerCase() + ' '))
                );
                if (matchedCamOpt) {
                    iCamInstructor.value = matchedCamOpt.value;
                }
            }

        }

        function populateSelects(timeValue, paxId, currentInst, currentPlane, currentCamInst) {
            let iCamInstructor = document.getElementById('edit-p-cam-instructor');
            if (iCamInstructor) {
                iCamInstructor.dataset.loadedValue = currentCamInst || 'Sin asignar';
            }

            // Instructores
            updateInstructorAvailability(timeValue, paxId, currentInst);
            iCamInstructor = document.getElementById('edit-p-cam-instructor');
            if (iCamInstructor && iCamInstructor.dataset.loadedValue) {
                if (Array.from(iCamInstructor.options).some(opt => opt.value === iCamInstructor.dataset.loadedValue)) {
                    iCamInstructor.value = iCamInstructor.dataset.loadedValue;
                } else {
                    iCamInstructor.value = 'Sin asignar';
                }
            }


            // Aeronaves
            iAeronave.innerHTML = '<option value="Sin asignar">Sin asignar</option>';
            window.AppData.aeronaves.forEach(a => {
                iAeronave.innerHTML += `<option value="${escapeHTML(a.matricula)}">${escapeHTML(a.matricula)} (${escapeHTML(a.modelo)})</option>`;
            });
            iAeronave.value = currentPlane || 'Sin asignar';

            // Equipos (Paracaídas Tándem)
            iEquipo.innerHTML = '<option value="">Sin Asignar</option>';
            const activePax = window.AppData.passengers.find(p => p.id === paxId);
            if (activePax) {
                updateEquipoOptions(activePax.type);
            }
        }

        iAeronave.addEventListener('change', () => {
            const selectedPlane = iAeronave.value;
            iVuelo.innerHTML = '';
            iVuelo.disabled = false;
            
            if (selectedPlane === 'Sin asignar') {
                iVuelo.innerHTML = '<option value="Sin asignar">Sin vuelo asignado</option>';
                iVuelo.disabled = false;
                return;
            }
            
            // Use asignacionFlota
            const todayStr = new Date().toLocaleDateString('en-CA');
            const aeronaveObj = window.AppData.aeronaves.find(a => a.matricula === selectedPlane);
            
            if (!aeronaveObj) {
                iVuelo.innerHTML = '<option value="Sin asignar">Sin vuelo asignado</option>';
                return;
            }
            
            const asgs = window.AppData.asignacionFlota.filter(a => a.id_aeronave === aeronaveObj.id && a.fecha === todayStr);
            if (asgs.length === 0) {
                iVuelo.innerHTML = '<option value="Sin asignar">Sin vuelos programados hoy</option>';
                return;
            }
            
            asgs.sort((a,b) => a.horaInicio.localeCompare(b.horaInicio));
            let vCount = 1;
            asgs.forEach((asg) => {
                let isBlocked = false;
                if (window.AppData.passengers) {
                    isBlocked = window.AppData.passengers.some(p => 
                        p.aeronave === selectedPlane &&
                        p.time === asg.horaInicio &&
                        p.date === todayStr &&
                        p.flightStatus && (p.flightStatus.includes('Aire') || p.flightStatus.includes('Aterriz') || p.flightStatus === 'Completado')
                    );
                    
                    // If the current passenger is already on this flight, allow it to show so the select dropdown doesn't break
                    if (isBlocked && window.AppData.passengers.some(p => p.id === activeEditId && p.aeronave === selectedPlane && p.time === asg.horaInicio && p.date === todayStr)) {
                        isBlocked = false;
                    }
                }
                
                if (!isBlocked) {
                    iVuelo.innerHTML += `<option value="${escapeHTML(asg.horaInicio)}">Vuelo ${vCount}</option>`;
                }
                vCount++;
            });
        });

        iVuelo.addEventListener('change', () => {
            updateInstructorAvailability(iVuelo.value, activeEditId, iInstructor.value);
        });

        function updateEquipoOptions(paxType) {
            iEquipo.innerHTML = '<option value="">Sin Asignar</option>';
            if (paxType && paxType.includes('Tandem')) {
                const instName = iInstructor.value;
                if (instName && instName !== 'Sin asignar') {
                    const instObj = window.AppData.employees.find(e => e.name === instName);
                    if (instObj) {
                        const assignedRig = (window.AppData.instructorAssignments || {})[instObj.id];
                        if (assignedRig) {
                            iEquipo.innerHTML += `<option value="${escapeHTML(assignedRig)}">Equipo ${escapeHTML(assignedRig)} (Asignado)</option>`;
                            iEquipo.value = assignedRig; 
                        } else {
                            iEquipo.innerHTML += `<option value="" disabled>Instructor sin equipo asignado</option>`;
                        }
                    }
                } else {
                    iEquipo.innerHTML += `<option value="" disabled>Seleccione un instructor primero</option>`;
                }
            } else {
                const funRigs = window.AppData.funRigs || [];
                funRigs.forEach(eq => {
                    let alert = '';
                    if (eq.limit && eq.totalJumps >= eq.limit) alert = ' \u26A0\uFE0F Mant!';
                    iEquipo.innerHTML += `<option value="${escapeHTML(eq.id)}">Escuela: ${escapeHTML(eq.id)} ${alert}</option>`;
                });
                iEquipo.innerHTML += `<option value="Propio">Equipo Propio</option>`;
            }
        }

        iInstructor.addEventListener('change', () => {
            const activePax = window.AppData.passengers.find(p => p.id === activeEditId);
            if (activePax) {
                updateEquipoOptions(activePax.type);
            }
        });

        function openEditModal(pax) {
            activeEditId = pax.id;
            document.getElementById('edit-p-name').value = pax.name;
            document.getElementById('edit-p-doc').value = pax.doc || '';
            iWeight.value = pax.weight || '';
            document.getElementById('edit-equipo-container').style.display = 'block';
            
            iCams.forEach(chk => {
                chk.checked = (pax.cams && pax.cams.includes(chk.value));
            });

            const medContainer = document.getElementById('edit-medical-container');
            const medText = document.getElementById('edit-p-medical');
            if (pax.medicalCondition && pax.medicalCondition.trim() !== '' && pax.medicalCondition !== 'Ninguna') {
                medContainer.style.display = 'block';
                medText.textContent = pax.medicalCondition;
            } else {
                medContainer.style.display = 'none';
            }

            const minorContainer = document.getElementById('edit-minor-container');
            
            function isPaxMinorCheck(p) {
                if (p.signatureMinor && Object.keys(p.signatureMinor).length > 0) return true;
                if (p.dob) {
                    const bd = new Date(p.dob + 'T00:00:00');
                    const today = new Date();
                    let age = today.getFullYear() - bd.getFullYear();
                    if (today.getMonth() < bd.getMonth() || (today.getMonth() === bd.getMonth() && today.getDate() < bd.getDate())) age--;
                    return age < 18;
                }
                return false;
            }

            if (isPaxMinorCheck(pax)) {
                minorContainer.style.display = 'block';
            } else {
                minorContainer.style.display = 'none';
            }

            iWaiver.checked = (pax.paxStatus === 'Check-in Listo' || pax.paxStatus === 'Completado');
            iStatus.disabled = !iWaiver.checked;
            iStatus.value = pax.paxStatus || 'Pendiente Check-in';
            
            populateSelects(pax.time, pax.id, pax.instructor, pax.aeronave, pax.camInstructor);
            calculateExtras(); // Trigger to show/hide the container
            updateEquipoOptions(pax.type);
            
            // set flight time
            if (pax.aeronave && pax.aeronave !== 'Sin asignar') {
                iAeronave.dispatchEvent(new Event('change')); // triggers flight population
                setTimeout(() => { iVuelo.value = pax.time; }, 50);
            }

            // set equipment if any
            if(pax.equipoId) {
                iEquipo.value = pax.equipoId;
            }
            const iAcc = document.getElementById('edit-p-accesorios');
            Array.from(iAcc.options).forEach(opt => {
                opt.selected = (pax.accesoriosIds || []).includes(opt.value);
            });

            // Calculate Base Reservation Balance
            basePagado = 0;
            baseValorReserva = 0;
            if (pax.financiera) {
                baseValorReserva = (pax.financiera.manualPrice || 0) - (pax.financiera.discount || 0);
                if (pax.financiera.totalPaid !== undefined) {
                    basePagado = pax.financiera.totalPaid;
                }
            }
            currentPaxBalance = baseValorReserva - basePagado;

            
            // Populate Dynamic Adiciones based on passenger's frozen tariffSnapshot (or current maestroValores if none)
            const containerAdiciones = document.getElementById('checkin-dynamic-adiciones');
            if (containerAdiciones) {
                containerAdiciones.innerHTML = '';
                const effectiveMaestro = window.TariffGuard
                    ? window.TariffGuard.getEffectiveMaestroForRecord(pax)
                    : (window.AppData.maestroValores || []);
                if (effectiveMaestro && effectiveMaestro.length > 0) {
                    effectiveMaestro.forEach(v => {
                        // Show cameras or all if Fun Jumper
                        if (v.name.includes('360') || v.name.includes('Externa') || v.name.includes('Go-Pro') || pax.type === 'Fun Jumper') {
                            const lbl = document.createElement('label');
                            lbl.style = 'display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;';
                            let isChecked = '';
                            if (pax.adiciones && pax.adiciones[v.name] === 'si') {
                                isChecked = 'checked';
                            } else if (!pax.adiciones && pax.cams && pax.cams.includes(v.name)) {
                                isChecked = 'checked';
                            }
                            const cleanPrice = parseInt(String(v.price ?? '0').replace(/[^0-9]/g, ''), 10) || 0;
                            lbl.innerHTML = `<input type="checkbox" class="cam-chk" value="${escapeHTML(v.name)}" data-price="${cleanPrice}" ${isChecked}> ${escapeHTML(v.name)} ($${cleanPrice.toLocaleString('es-CO')})`;
                            containerAdiciones.appendChild(lbl);
                        }
                    });
                }
            }
            
            iCams = Array.from(document.querySelectorAll('.cam-chk'));
            iCams.forEach(chk => chk.addEventListener('change', calculateExtras));
            
            calculateExtras();
            modal.style.display = 'flex';
            setTimeout(() => { modal.style.opacity = '1'; modalContent.style.transform = 'translateY(0)'; }, 10);
            
            // Implement lock logic
            setTimeout(() => {
                const btnSaveEdit = document.getElementById('btn-save-edit');
                const isLocked = (pax.flightStatus === 'En El Aire' || pax.flightStatus === 'Paracaidistas en el aire' || pax.flightStatus === 'Completado' || pax.flightStatus === 'Aterrizó' || pax.paxStatus === 'Completado');
                
                let lockBanner = document.getElementById('edit-lock-banner');
                if (!lockBanner) {
                    lockBanner = document.createElement('div');
                    lockBanner.id = 'edit-lock-banner';
                    lockBanner.style.padding = '1rem';
                    lockBanner.style.marginBottom = '1rem';
                    lockBanner.style.borderRadius = '8px';
                    lockBanner.style.background = 'rgba(231, 76, 60, 0.1)';
                    lockBanner.style.border = '1px solid var(--brand-danger)';
                    lockBanner.style.color = 'var(--brand-danger)';
                    lockBanner.style.display = 'flex';
                    lockBanner.style.justifyContent = 'space-between';
                    lockBanner.style.alignItems = 'center';
                    
                    const lockText = document.createElement('div');
                    lockText.innerHTML = '<i class="fas fa-lock"></i> <strong>Registro Bloqueado</strong>: El vuelo ya está en curso o completado.';
                    lockBanner.appendChild(lockText);

                    const unlockBtn = document.createElement('button');
                    unlockBtn.className = 'btn btn-outline';
                    unlockBtn.innerHTML = '<i class="fas fa-unlock"></i> Desbloquear (Admin)';
                    unlockBtn.onclick = async () => {
                        const pwd = window.showPrompt
                            ? await window.showPrompt('Ingrese clave de Administrador:', { title: 'Desbloquear Registro', inputType: 'password', placeholder: 'Contraseña...' })
                            : prompt('Ingrese clave de Administrador:');
                        if (pwd === null) return;
                        let isValid = false;
                        const adminUser = (window.AppData.users || []).find(u => (u.role === 'admin' || u.role === 'Administrador' || u.role === 'SuperAdmin'));
                        if (adminUser && adminUser.password === pwd) {
                            isValid = true;
                        } else if (!adminUser && pwd === 'admin123') {
                            isValid = true;
                        }
                        if (isValid) {
                            lockBanner.style.display = 'none';
                            document.querySelectorAll('#modal-edit-passenger input, #modal-edit-passenger select').forEach(el => {
                                if(el.id !== 'edit-p-name' && el.id !== 'edit-p-status') el.disabled = false;
                            });
                            btnSaveEdit.style.display = 'inline-block';
                        } else {
                            alert('Clave incorrecta.');
                        }
                    };
                    lockBanner.appendChild(unlockBtn);
                    
                    const title = modalContent.querySelector('h3');
                    title.parentNode.insertBefore(lockBanner, title.nextSibling);
                }

                if (isLocked) {
                    lockBanner.style.display = 'flex';
                    document.querySelectorAll('#modal-edit-passenger input, #modal-edit-passenger select').forEach(el => {
                        el.disabled = true;
                    });
                    btnSaveEdit.style.display = 'none';
                } else {
                    if (lockBanner) lockBanner.style.display = 'none';
                    document.querySelectorAll('#modal-edit-passenger input, #modal-edit-passenger select').forEach(el => {
                        if (el.id !== 'edit-p-name' && el.id !== 'edit-p-status' && el.id !== 'edit-p-vuelo') {
                            el.disabled = false;
                        }
                    });
                    btnSaveEdit.style.display = 'inline-block';
                }
            }, 100);
        }

        function closeModal() {
            modal.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            setTimeout(() => { modal.style.display = 'none'; }, 300);
        }

        document.getElementById('btn-cancel-edit').addEventListener('click', closeModal);
        document.getElementById('modal-edit-passenger').addEventListener('click', (e) => {
            if(e.target === modal) closeModal();
        });

        document.getElementById('btn-save-edit').addEventListener('click', () => {
            if (!activeEditId) return;
            const paxIndex = window.AppData.passengers.findIndex(p => p.id === activeEditId);
            if (paxIndex === -1) return;

            const pax = window.AppData.passengers[paxIndex];
            
            // Validations for Check-in Listo
            if (iStatus.value === 'Check-in Listo') {
                const balanceEl = document.getElementById('edit-p-balance').textContent;
                const saldoVal = parseInt(balanceEl.replace(/[^0-9]/g, '')) || 0;
                
                if (saldoVal > 0) {
                    alert('No se puede finalizar el Check-in. El pasajero tiene un saldo pendiente de ' + formatCurrency(saldoVal) + '. Debe registrar el pago antes de continuar.');
                    return;
                }

                if (!iWeight.value || iWeight.value <= 0) {
                    alert('El campo Peso es obligatorio para el Check-in.');
                    return;
                }
                if (pax.type.includes('Tandem') && (!iInstructor.value || iInstructor.value === 'Sin asignar')) {
                    alert('Debe asignar un Instructor para saltos Tandem.');
                    return;
                }
                if (!iAeronave.value || iAeronave.value === 'Sin asignar') {
                    alert('Debe asignar una Aeronave para autorizar el Check-in.');
                    return;
                }
                if (!iVuelo.value || iVuelo.value.toLowerCase() === 'sin asignar') {
                    alert('Debe seleccionar un Vuelo para autorizar el Check-in.');
                    return;
                }
            }
            
            const camInstEl = document.getElementById('edit-p-cam-instructor');
            if (iInstructor.value && iInstructor.value !== 'Sin asignar' && 
                camInstEl && camInstEl.value && camInstEl.value !== 'Sin asignar' &&
                camInstEl.parentElement.style.display !== 'none') {
                if (iInstructor.value === camInstEl.value) {
                    alert('El Instructor Asignado al pasajero no puede ser el mismo que el Instructor de Cámara Externa.');
                    return;
                }
            }
            
            // Gather cams and sync with pax.adiciones
            const selectedCams = [];
            if (!pax.adiciones) pax.adiciones = {};
            iCams.forEach(chk => { 
                if(chk.checked) {
                    selectedCams.push(chk.value);
                    pax.adiciones[chk.value] = 'si';
                } else {
                    pax.adiciones[chk.value] = 'no';
                }
            });

            pax.weight = parseFloat(iWeight.value) || 0;
            pax.cams = selectedCams.join(', ') || 'Ninguna';
            pax.paxStatus = iStatus.value;
            pax.instructor = iInstructor.value;
            const iCamInstructor = document.getElementById('edit-p-cam-instructor');
            pax.camInstructor = iCamInstructor && iCamInstructor.parentElement.style.display !== 'none' ? iCamInstructor.value : 'Sin asignar';
            pax.aeronave = iAeronave.value;
            if (!iVuelo.disabled && iVuelo.value !== 'Sin Asignar' && iVuelo.value !== 'Sin asignar') {
                pax.time = iVuelo.value;
                pax.vueloNum = iVuelo.options[iVuelo.selectedIndex].text;
            } else {
                pax.vueloNum = '';
            }
            pax.equipoId = iEquipo.value;
            const iAcc = document.getElementById('edit-p-accesorios');
            pax.accesoriosIds = Array.from(iAcc.selectedOptions).map(opt => opt.value);

            if (window.saveAppData) window.saveAppData();
            
            closeModal();
            renderKanban();
        });

        // Initialize
        renderKanban();
    }
};
