window.Modules = window.Modules || {};
window.Modules.reservations = {
    render: (container) => {
        container.innerHTML = `
            <style>
                .glass-card {
                    background: var(--glass-bg);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid var(--border-color);
                    border-radius: 16px;
                    padding: 1.5rem;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
                }
                .glass-card:hover {
                    box-shadow: 0 15px 45px rgba(0,0,0,0.4);
                    border-color: rgba(255,255,255,0.1);
                }
                .input-glow:focus {
                    box-shadow: 0 0 10px rgba(56, 189, 248, 0.5);
                    border-color: #38bdf8 !important;
                }
                .neon-total-box {
                    background: var(--bg-surface-hover);
                    backdrop-filter: blur(8px);
                    border-radius: 12px;
                    padding: 1.5rem;
                    border: 1px solid rgba(16, 185, 129, 0.2);
                    box-shadow: 0 0 20px rgba(16, 185, 129, 0.05);
                }
                .neon-total-box strong {
                    text-shadow: 0 0 15px currentColor;
                }
            
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
            </style>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2 style="margin-bottom: 0.5rem;">Registro de Salto</h2>
                    <p style="color: var(--text-secondary); margin: 0;">Crea nuevas reservas e ingresa la información financiera.</p>
                </div>
                <div style="background: var(--bg-surface); padding: 0.75rem; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; min-width: 320px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <label style="color: var(--brand-action); font-size: 0.85rem; font-weight: bold; margin-bottom: 0.5rem;"><i class="fas fa-search"></i> Buscar Pasajero Existente</label>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="text" id="p-search-filter" class="form-control input-glow" placeholder="Nombre, cédula, teléfono, correo..." style="flex: 1; padding: 0.4rem 0.6rem; font-size: 0.9rem;">
                        <button type="button" id="btn-p-search" class="btn btn-primary" style="padding: 0.4rem 0.8rem; font-size: 0.9rem;"><i class="fas fa-search"></i> Buscar</button>
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                <!-- Card Datos del Pasajero -->
                <div class="glass-card" style="margin: 0; height: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                        <h3 style="margin: 0;">Datos del Pasajero</h3>
                        <div style="display: flex; gap: 1rem; align-items: center; flex-wrap: wrap;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <label style="font-weight: 500; margin: 0;">Tipo de Salto:</label>
                                <select id="global-jumptype" class="form-control input-glow" style="width: auto;">
                                <option value="Salto Tandem" selected>Salto Tandem</option>
                                <option value="Fun Jumper">Fun Jumper</option>
                                <option value="Copiloto">Copiloto</option>
                            </select>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <label style="font-weight: 500; margin: 0;">Cant. Personas:</label>
                                <input type="number" id="qty-people" value="1" min="1" max="10" class="form-control input-glow" style="width: 80px;">
                            </div>
                        </div>
                    </div>

                    <div id="passenger-tabs" style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; overflow-x: auto; padding-bottom: 0.5rem;">
                        <!-- Tabs injected here -->
                    </div>

                    <div id="passenger-form">
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem;">
                            <div class="form-group">
                                <label>Nombre</label>
                                <input type="text" id="p-name" class="form-control input-glow" placeholder="Ej. Ana">
                            </div>
                            <div class="form-group">
                                <label>Apellido</label>
                                <input type="text" id="p-lastname" class="form-control input-glow" placeholder="Ej. Martínez">
                            </div>
                            <div class="form-group">
                                <label>Documento</label>
                                <input type="text" id="p-doc" class="form-control input-glow" placeholder="Cédula o Pasaporte">
                            </div>
                            <div class="form-group">
                                <label>Teléfono (WhatsApp)</label>
                                <input type="tel" id="p-phone" class="form-control input-glow" maxlength="14" placeholder="+57 300 000 0000">
                            </div>
                            <div class="form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" id="p-email" class="form-control input-glow" placeholder="email@ejemplo.com">
                            </div>
                            <div class="form-group">
                                <label>Fecha de Nacimiento</label>
                                <input type="date" id="p-dob" class="form-control input-glow">
                            </div>
                            <div class="form-group">
                                <label for="p-weight">Peso (kg)</label>
                                <input type="number" id="p-weight" class="form-control input-glow" min="0" max="200" step="0.5" placeholder="Ej. 75">
                            </div>
                            <div class="form-group">
                                <label>Fecha de Salto</label>
                                <div style="display: flex; gap: 0.5rem; align-items: stretch;">
                                    <input type="date" id="p-jumpdate" class="form-control input-glow" style="flex: 1;">
                                    <div id="p-date-action-container" style="display: flex; align-items: center;"></div>
                                </div>
                                <div id="p-capacity-info" style="font-size: 0.85rem; margin-top: 0.25rem; font-weight: 600;"></div>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label for="p-flight-select">Vuelo Programado</label>
                                <select id="p-flight-select" class="form-control input-glow" style="width: 100%; max-width: 100%; text-overflow: ellipsis;" disabled>
                                    <option value="">Sin asignar vuelo (Por definir)</option>
                                </select>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1; margin-bottom: 0; padding: 0.85rem 1rem; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-surface-hover);">
                                <label for="p-has-medical" style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-weight: 600; color: var(--brand-danger); margin: 0;">
                                    <input type="checkbox" id="p-has-medical" style="width: 17px; height: 17px; accent-color: var(--brand-danger); cursor: pointer;">
                                    <i class="fas fa-heartbeat"></i>
                                    <span>Con Condición Médica</span>
                                </label>
                                <div id="p-medical-container" style="display: none; margin-top: 0.75rem;">
                                    <label for="p-medical-condition" style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 0.35rem; display: block;">Condición médica reportada por el pasajero *</label>
                                    <textarea id="p-medical-condition" class="form-control input-glow" rows="2" placeholder="Describe la condición médica reportada (ej. asma, cirugía reciente, alergias, vértigo, etc.)..."></textarea>
                                </div>
                            </div>
                        </div>

                        <div id="p-flights-breakdown" style="display: none; margin-top: 1rem; padding: 0.9rem 1rem; background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 10px;">
                        </div>
                        
                        <div id="minor-alert" class="alert alert-warning" style="display: none; background: rgba(255,152,0,0.15); margin-top: 1rem;">
                            <i class="fas fa-exclamation-triangle"></i>
                            <span><strong>Atención:</strong> El pasajero es menor de edad. Debe saltar con un adulto responsable.</span>
                        </div>
                        <div id="weight-alert" class="alert alert-warning" style="display: none; background: rgba(245,158,11,0.12); border-left: 4px solid var(--brand-warning); color: var(--text-primary); margin-top: 0.75rem; padding: 0.8rem 1rem; border-radius: 8px; font-size: 0.88rem;">
                        </div>
                    </div>
                </div>
                
                <!-- Card Lógica Financiera -->
                <div class="glass-card" style="border-left: 4px solid var(--brand-success); margin: 0; height: 100%; display: flex; flex-direction: column;">
                    <h3 style="margin-bottom: 1rem;">Lógica Financiera (Pasajero Actual)</h3>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; flex-grow: 1;">
                        <!-- Columna Izquierda -->
                        <div style="display: flex; flex-direction: column;">
                            <div class="form-group" style="margin-bottom: 0.5rem;">
                                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--brand-action); font-weight: 600;">
                                    <input type="checkbox" id="f-cortesia"> Cortesía / Editar Valor Manual
                                </label>
                            </div>
                            <div class="form-group" id="container-cortesia-obs" style="display: none;">
                                <label>Observaciones de Cortesía / Manual</label>
                                <textarea id="f-cortesia-obs" class="form-control input-glow" rows="2" placeholder="Motivo..."></textarea>
                            </div>
                            <div class="form-group">
                                <label>Valor Salto Venta ($)</label>
                                <input type="text" id="f-baseprice" class="form-control price-input" value="1.500.000" readonly style="background: var(--bg-surface-hover);">
                            </div>
                            <div class="form-group" id="f-kg-extra-group">
                                <label for="f-kg-extra">Recargo Peso Extra (&gt; 85 kg) ($)</label>
                                <div style="display: flex; align-items: center; gap: 0.5rem;">
                                    <input type="text" id="f-kg-extra" class="form-control" value="0" readonly style="background: var(--bg-surface-hover); font-weight: 600;">
                                    <span id="f-kg-extra-badge" style="font-size: 0.78rem; color: var(--text-secondary); white-space: nowrap;">Sin recargo (≤ 85 kg)</span>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Descuento ($)</label>
                                <div style="display: flex; gap: 0.5rem;">
                                    <input type="text" id="f-discount" class="form-control price-input" value="0" disabled style="background: rgba(0,0,0,0.05); color: var(--text-secondary);">
                                    <button class="btn btn-outline" id="btn-unlock-discount" title="Desbloquear Descuento" style="padding: 0 1rem;"><i class="fas fa-lock"></i></button>
                                </div>
                            </div>

                            <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem;">
                                <div class="form-group" style="flex: 1; margin: 0;">
                                    <label>Comisión (A quién)</label>
                                    <input type="text" id="f-comision-to" class="form-control input-glow" placeholder="Agencia/Asesor">
                                </div>
                                <div class="form-group" style="flex: 1; margin: 0;">
                                    <label>Valor ($)</label>
                                    <input type="text" id="f-comision-val" class="form-control price-input" value="0">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Forma de Pago (Pasajero Actual)</label>
                                <select id="f-paymethod" class="form-control input-glow">
                                    <option value="Efectivo">Efectivo</option>
                                    <option value="Transferencia">Transferencia</option>
                                    <option value="Tarjeta">Tarjeta</option>
                                    <option value="Otro">Otro</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label>¿Pago Completo (Grupo)?</label>
                                <select id="global-fullpay" class="form-control input-glow">
                                    <option value="si">Sí</option>
                                    <option value="no" selected>No</option>
                                </select>
                            </div>
                            <div class="form-group" id="global-abono-container">
                                <label>Valor Abonado Global ($)</label>
                                <input type="text" id="global-abono" class="form-control price-input" value="0">
                            </div>
                        </div>

                        <!-- Columna Derecha -->
                        <div style="display: flex; flex-direction: column;">
                            <h4 style="margin-bottom: 1rem;">Adiciones (Cámaras / Equipos)</h4>
                            <div id="dynamic-adiciones-container" style="max-height: 400px; overflow-y: auto; padding-right: 0.5rem; margin-bottom: 1rem;">
                                <!-- Rendered dynamically -->
                            </div>

                            <!-- Totals Box -->
                            <div class="neon-total-box" style="margin-top: auto;">
                                <div id="display-kg-extra-row" style="display: none; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.95rem;">
                                    <span style="color: var(--brand-warning); font-weight: 600;"><i class="fas fa-weight"></i> Recargo Peso Extra (Grupo)</span>
                                    <strong id="display-kg-extra" style="color: var(--brand-warning);">$0</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 1.1rem;">
                                    <span style="color: var(--text-secondary);">Total a Pagar (Grupo)</span>
                                    <strong id="display-total">$0</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;">
                                    <span style="color: var(--text-secondary);">Abono</span>
                                    <strong id="display-abono" style="color: var(--brand-success);">$0</strong>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 1.3rem;">
                                    <span style="color: var(--text-primary); font-weight: 600;">Saldo Pendiente</span>
                                    <strong id="display-pending" style="color: var(--brand-danger);">$0</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- End Grid Wrapper -->
            
            <div style="margin-top: 2rem; display: flex; justify-content: center;">
                <button id="btn-save-res" class="btn btn-primary" style="padding: 1rem 2rem; font-size: 1.2rem; width: 100%; max-width: 600px;">
                    <i class="fas fa-save"></i> Guardar Reserva y Enviar Token OTP
                </button>
            </div>

            <!-- Custom Password Modal -->
            <div id="modal-cortesia-pwd" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 2000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content glass-card" style="width: 350px; max-width: 90%; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="close-cortesia-pwd" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; margin-bottom: 1rem; color: var(--text-primary);"><i class="fas fa-lock" style="color: var(--brand-warning);"></i> Verificación de Seguridad</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Ingrese clave de Administrador para habilitar Cortesía / Valor Manual.</p>
                    <div class="form-group">
                        <input type="password" id="cortesia-pwd-input" class="form-control input-glow" placeholder="Contraseña..." autofocus>
                    </div>
                    <div style="display: flex; justify-content: flex-end; gap: 0.5rem; margin-top: 1.5rem;">
                        <button class="btn btn-outline" id="btn-cortesia-cancel">Cancelar</button>
                        <button class="btn btn-primary" id="btn-cortesia-confirm">Autorizar</button>
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
        // State
        let passengers = [];
        let activeIndex = 0;

        const basePrices = {
            'Salto Tandem': 1500000,
            'Fun Jumper': 1200000
        };

        const getBasePriceForJumpType = (jumpType, record = null) => {
            if (window.TariffGuard) {
                const itemName = window.TariffGuard.resolveJumpTypeItemName(jumpType, window.TariffGuard.getEffectiveMaestroForRecord(record));
                const priceFromMaestro = window.TariffGuard.getPriceForRecord(record, itemName);
                if (priceFromMaestro > 0) return priceFromMaestro;
            }
            return basePrices[jumpType] || 0;
        };

        // DOM Elements
        const qtyInput = document.getElementById('qty-people');
        const tabsContainer = document.getElementById('passenger-tabs');
        
        // Passenger Inputs
        const pName = document.getElementById('p-name');
        const pDoc = document.getElementById('p-doc');
        const pPhone = document.getElementById('p-phone');
        const pEmail = document.getElementById('p-email');
        const pDob = document.getElementById('p-dob');
        const pWeight = document.getElementById('p-weight');
        const pJumpDate = document.getElementById('p-jumpdate');
        const pFlightSelect = document.getElementById('p-flight-select');
        const pFlightsBreakdown = document.getElementById('p-flights-breakdown');
        const pHasMedical = document.getElementById('p-has-medical');
        const pMedicalContainer = document.getElementById('p-medical-container');
        const pMedicalCondition = document.getElementById('p-medical-condition');
        const globalJumptype = document.getElementById('global-jumptype');
        
        // Finance Inputs
        const fCortesia = document.getElementById('f-cortesia');
        const fCortesiaObs = document.getElementById('f-cortesia-obs');
        const containerCortesiaObs = document.getElementById('container-cortesia-obs');
        const fBasePrice = document.getElementById('f-baseprice');
        const fKgExtra = document.getElementById('f-kg-extra');
        const fKgExtraBadge = document.getElementById('f-kg-extra-badge');
        const fDiscount = document.getElementById('f-discount');
        const fComisionTo = document.getElementById('f-comision-to');
        const fComisionVal = document.getElementById('f-comision-val');
        const fPayMethod = document.getElementById('f-paymethod');

        // Global Inputs
        const globalFullPay = document.getElementById('global-fullpay');
        const globalAbono = document.getElementById('global-abono');
        const globalAbonoContainer = document.getElementById('global-abono-container');

        // Displays
        const dKgExtraRow = document.getElementById('display-kg-extra-row');
        const dKgExtra = document.getElementById('display-kg-extra');
        const dTotal = document.getElementById('display-total');
        const dAbono = document.getElementById('display-abono');
        const dPending = document.getElementById('display-pending');
        const minorAlert = document.getElementById('minor-alert');
        const weightAlert = document.getElementById('weight-alert');

        // Format Currency Helpers
        const formatCurrency = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const parseCurrency = (str) => parseInt(String(str).replace(/\D/g, ''), 10) || 0;

        // Política de Recargo por Peso Extra (> 85 kg)
        const EXTRA_WEIGHT_THRESHOLD_KG = 85;
        const getKgExtraRate = (record = null) => {
            if (window.TariffGuard) {
                const rate = window.TariffGuard.getPriceForRecord(record, 'Valor KG Extra');
                if (rate > 0) return rate;
            }
            const maestro = (window.AppData && Array.isArray(window.AppData.maestroValores)) ? window.AppData.maestroValores : [];
            const mItem = maestro.find(m => m.name === 'Valor KG Extra');
            if (mItem) {
                const parsed = parseCurrency(mItem.price);
                if (parsed > 0) return parsed;
            }
            return 5000;
        };

        const getExtraWeightDetails = (weightVal, record = null) => {
            const w = parseFloat(weightVal);
            const validWeight = (!isNaN(w) && w > 0) ? w : 0;
            const extraKg = validWeight > EXTRA_WEIGHT_THRESHOLD_KG
                ? Number((validWeight - EXTRA_WEIGHT_THRESHOLD_KG).toFixed(2))
                : 0;
            const rate = getKgExtraRate(record);
            const charge = extraKg > 0 ? Math.round(extraKg * rate) : 0;
            return { weight: validWeight, extraKg, rate, charge };
        };

        const updateWeightUI = (weightVal, record = null) => {
            const wt = getExtraWeightDetails(weightVal, record);
            if (fKgExtra) {
                fKgExtra.value = formatCurrency(wt.charge);
                fKgExtra.style.color = wt.charge > 0 ? 'var(--brand-warning)' : '';
            }
            if (fKgExtraBadge) {
                if (wt.extraKg > 0) {
                    fKgExtraBadge.textContent = `${wt.extraKg} kg × $${formatCurrency(wt.rate)}`;
                    fKgExtraBadge.style.color = 'var(--brand-warning)';
                    fKgExtraBadge.style.fontWeight = '700';
                } else {
                    fKgExtraBadge.textContent = 'Sin recargo (≤ 85 kg)';
                    fKgExtraBadge.style.color = 'var(--text-secondary)';
                    fKgExtraBadge.style.fontWeight = '400';
                }
            }
            if (weightAlert) {
                if (wt.weight > 100) {
                    weightAlert.style.display = 'block';
                    weightAlert.style.borderLeftColor = 'var(--brand-danger)';
                    weightAlert.style.background = 'rgba(239, 68, 68, 0.12)';
                    weightAlert.style.color = 'var(--brand-danger)';
                    weightAlert.innerHTML = `<i class="fas fa-exclamation-circle"></i> <strong>Atención (Peso superior a 100 kg):</strong> Requiere evaluación con el Jefe de Seguridad (S&amp;TA) para autorizar el salto. Adicionalmente aplica recargo por sobrepeso (&gt; 85 kg): <strong>${wt.extraKg} kg extra × $${formatCurrency(wt.rate)} = +$${formatCurrency(wt.charge)} COP</strong>.`;
                } else if (wt.extraKg > 0) {
                    weightAlert.style.display = 'block';
                    weightAlert.style.borderLeftColor = 'var(--brand-warning)';
                    weightAlert.style.background = 'rgba(245, 158, 11, 0.12)';
                    weightAlert.style.color = 'var(--text-primary)';
                    weightAlert.innerHTML = `<i class="fas fa-weight"></i> <strong>Política de Sobrepeso (&gt; 85 kg):</strong> Aplica recargo de <strong>$${formatCurrency(wt.rate)} COP</strong> por cada Kg extra → <strong>${wt.extraKg} kg extra (+$${formatCurrency(wt.charge)} COP)</strong> sumados al total.`;
                } else {
                    weightAlert.style.display = 'none';
                    weightAlert.innerHTML = '';
                }
            }
            return wt;
        };

        // Capacity Helper
        function getAvailableCapacityForDate(dateStrYMD) {
            if (!dateStrYMD) return { totalT: 0, usedT: 0, totalF: 0, usedF: 0, totalC: 0, usedC: 0, total: 0 };
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
                    if (p.type === 'Salto Tandem' || p.type === 'Tandem') {
                        usedT += 1;
                    } else if (p.type === 'Copiloto') {
                        usedC += 1;
                    } else if (p.type === 'Fun Jumper') {
                        usedF += 1;
                    }
                }
            });

            const availableT = Math.max(0, totalT - usedT);
            const availableF = Math.max(0, totalF - usedF);
            const availableC = Math.max(0, totalC - usedC);
            return {
                totalT, usedT, availableT,
                totalF, usedF, availableF,
                totalC, usedC, availableC,
                total: totalT + totalF + totalC,
                available: availableT + availableF + availableC
            };
        }

        // Auto-format price inputs on typing
        document.querySelectorAll('.price-input').forEach(input => {
            input.addEventListener('input', (e) => {
                let val = e.target.value.replace(/[^0-9]/g, '');
                if (val !== '') {
                    e.target.value = formatCurrency(parseInt(val));
                }
            });
        });

        function initPassengers(count) {
            // Adjust array size
            while(passengers.length < count) {
                passengers.push({
                    name: '', doc: '', phone: '', email: '', dob: '', weight: '', jumpdate: '',
                    flightId: '', aeronave: 'Sin asignar', vueloNum: '', time: 'Por definir',
                    hasMedicalCondition: false, medicalCondition: '',
                    cortesia: false, manualPrice: getBasePriceForJumpType(globalJumptype.value, null) || 1500000, discount: 0,
                    adiciones: {},
                    comisionTo: '', comisionVal: 0, payMethod: 'Efectivo'
                });
            }
            if (passengers.length > count) {
                passengers.length = count;
                if(activeIndex >= count) activeIndex = count - 1;
            }
            renderTabs();
            loadPassenger(activeIndex);
            calculateGlobal();
        }

        function isPaxComplete(p) {
            return p.name.trim() !== '' && p.doc.trim() !== '' && p.phone.trim() !== '';
        }

        function renderTabs() {
            tabsContainer.innerHTML = '';
            passengers.forEach((p, i) => {
                const btn = document.createElement('button');
                btn.className = 'btn ' + (i === activeIndex ? 'btn-primary' : 'btn-outline');
                btn.style.borderRadius = '20px';
                const statusIcon = isPaxComplete(p) ? '<i class="fas fa-check-circle" style="color: #10b981; margin-left:5px;"></i>' : '<i class="fas fa-exclamation-circle" style="color: #f59e0b; margin-left:5px;"></i>';
                btn.innerHTML = 'Pasajero ' + (i + 1) + statusIcon;
                btn.onclick = () => {
                    saveCurrentPassenger();
                    activeIndex = i;
                    renderTabs();
                    loadPassenger(activeIndex);
                    renderAdicionesUI(); // Refresh adiciones for new passenger
                };
                tabsContainer.appendChild(btn);
            });
        }

        function saveCurrentPassenger() {
            const p = passengers[activeIndex];
            if(!p) return;
            p.name = pName.value;
            const pLastnameInput = document.getElementById('p-lastname');
            if (pLastnameInput) p.lastname = pLastnameInput.value;
            p.doc = pDoc.value;
            p.phone = pPhone.value;
            p.email = pEmail.value;
            p.dob = pDob.value;
            if (pWeight) p.weight = pWeight.value;
            p.jumpdate = pJumpDate.value;
            if (pHasMedical) {
                p.hasMedicalCondition = Boolean(pHasMedical.checked);
                p.medicalCondition = p.hasMedicalCondition && pMedicalCondition ? pMedicalCondition.value.trim() : '';
            }
            
            p.cortesia = fCortesia.checked;
            p.cortesiaObs = fCortesiaObs.value;
            p.manualPrice = parseCurrency(fBasePrice.value);
            p.discount = parseCurrency(fDiscount.value);
            p.comisionTo = fComisionTo.value;
            p.comisionVal = parseCurrency(fComisionVal.value);
            p.payMethod = fPayMethod.value;
        }

        function loadPassenger(index) {
            const p = passengers[index];
            if(!p) return;
            pName.value = p.name || '';
            const pLastnameInput = document.getElementById('p-lastname');
            if (pLastnameInput) pLastnameInput.value = p.lastname || '';
            pDoc.value = p.doc;
            pPhone.value = p.phone;
            pEmail.value = p.email;
            pDob.value = p.dob;
            if (pWeight) pWeight.value = (p.weight !== undefined && p.weight !== null && p.weight !== 0 && p.weight !== '0') ? p.weight : '';
            pJumpDate.value = p.jumpdate;
            const hasMed = Boolean(
                p.hasMedicalCondition
                || (p.medicalCondition && String(p.medicalCondition).trim() !== '' && String(p.medicalCondition).trim().toLowerCase() !== 'ninguna')
            );
            if (pHasMedical) pHasMedical.checked = hasMed;
            if (pMedicalContainer) pMedicalContainer.style.display = hasMed ? 'block' : 'none';
            if (pMedicalCondition) pMedicalCondition.value = hasMed ? (p.medicalCondition || '') : '';
            
            fCortesia.checked = p.cortesia;
            fDiscount.value = formatCurrency(p.discount);
            fComisionTo.value = p.comisionTo || '';
            fComisionVal.value = formatCurrency(p.comisionVal || 0);
            fPayMethod.value = p.payMethod || 'Efectivo';

            updateFinanceUI(p);
            updateWeightUI(p.weight, p);
            renderAdicionesUI();
            checkMinor(p.dob);
            updateCapacityUI(p.jumpdate);
        }

        window.toggleNoOpDate = function(dateStr) {
            if (!dateStr) return;
            window.AppData = window.AppData || {};
            window.AppData.noOpRules = window.AppData.noOpRules || { daysOfWeek: ['1', '2'], specificDates: [] };
            
            const idx = window.AppData.noOpRules.specificDates.indexOf(dateStr);
            if (idx >= 0) {
                // It was blocked, now unblock it
                window.AppData.noOpRules.specificDates.splice(idx, 1);
                alert(`Fecha ${dateStr} habilitada para operación. Se removió de la configuración.`);
            } else {
                // It was unblocked, now block it
                window.AppData.noOpRules.specificDates.push(dateStr);
                window.AppData.noOpRules.specificDates.sort();
                alert(`Fecha ${dateStr} bloqueada. Ninguna reserva se podrá programar aquí.`);
            }
            if (window.saveAppData) window.saveAppData();
            updateCapacityUI(dateStr);
        };

        function getDraftFlightSelectionsExcluding(excludeIdx, dateStr) {
            const sels = [];
            passengers.forEach((px, idx) => {
                if (idx === excludeIdx) return;
                if (px && px.jumpdate === dateStr && px.flightId) {
                    sels.push({
                        flightId: px.flightId,
                        aeronave: px.aeronave,
                        time: px.time,
                        type: globalJumptype.value
                    });
                }
            });
            return sels;
        }

        function applySelectedFlightToCurrentPax(flightId, dateStr) {
            const p = passengers[activeIndex];
            if (!p) return;
            if (!flightId || !dateStr || !window.FlightAvailabilityHelper) {
                p.flightId = '';
                p.aeronave = 'Sin asignar';
                p.vueloNum = '';
                p.time = 'Por definir';
                return;
            }
            const extraSelections = getDraftFlightSelectionsExcluding(activeIndex, dateStr);
            const flights = window.FlightAvailabilityHelper.getFlightsForDate(dateStr, {
                excludePaxId: p.id || null,
                extraSelections
            });
            const found = flights.find(f => f.flightId === flightId);
            const canAssign = found && (typeof found.canAssignForType === 'function'
                ? found.canAssignForType(globalJumptype.value)
                : (!found.isLocked && found.getAvailForType(globalJumptype.value) > 0));
            if (!canAssign) {
                p.flightId = '';
                p.aeronave = 'Sin asignar';
                p.vueloNum = '';
                p.time = 'Por definir';
                return;
            }
            p.flightId = found.flightId;
            p.aeronave = found.matricula;
            p.vueloNum = found.vueloNum;
            p.time = found.horaInicio;
        }

        function updateCapacityUI(dateStr) {
            const infoDiv = document.getElementById('p-capacity-info');
            const actionContainer = document.getElementById('p-date-action-container');
            if(actionContainer) actionContainer.innerHTML = '';

            const resetFlightControls = (placeholderText) => {
                if (pFlightSelect) {
                    pFlightSelect.innerHTML = `<option value="">${escapeHTML(placeholderText || 'Sin asignar vuelo (Por definir)')}</option>`;
                    pFlightSelect.value = '';
                    pFlightSelect.disabled = true;
                }
                if (pFlightsBreakdown) {
                    pFlightsBreakdown.style.display = 'none';
                    pFlightsBreakdown.innerHTML = '';
                }
            };
            
            if (!dateStr) {
                infoDiv.innerHTML = 'Selecciona una fecha para ver disponibilidad.';
                infoDiv.style.color = 'var(--text-secondary)';
                resetFlightControls('Selecciona una fecha primero');
                return;
            }

            window.AppData = window.AppData || {};
            window.AppData.noOpRules = window.AppData.noOpRules || { daysOfWeek: ['1', '2'], specificDates: [] };
            
            const noOpInfo = window.FlightAvailabilityHelper
                ? window.FlightAvailabilityHelper.isDateNoOp(dateStr)
                : {
                    blocked: window.AppData.noOpRules.specificDates.includes(dateStr)
                        || window.AppData.noOpRules.daysOfWeek.includes(new Date(dateStr + "T00:00:00").getDay().toString()),
                    isDayBlocked: window.AppData.noOpRules.daysOfWeek.includes(new Date(dateStr + "T00:00:00").getDay().toString())
                };
            
            if (actionContainer) {
                actionContainer.innerHTML = '';
            }

            if (noOpInfo.blocked) {
                infoDiv.innerHTML = `Esta fecha está configurada como NO Operación. ${noOpInfo.isDayBlocked ? '(Por defecto día cerrado)' : ''}`;
                infoDiv.style.color = 'var(--brand-danger)';
                resetFlightControls('Fecha sin operación');
                return;
            }
            
            const cap = getAvailableCapacityForDate(dateStr);
            if (cap.total === 0) {
                infoDiv.innerHTML = `Sin vuelos programados para esta fecha.`;
                infoDiv.style.color = 'var(--brand-danger)';
                resetFlightControls('Sin vuelos programados');
                return;
            }

            infoDiv.innerHTML = `
                <div style="display:flex; gap:1rem; flex-wrap: wrap;">
                    <span style="color: ${cap.availableT > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'}">
                        <strong>Tándem:</strong> ${cap.availableT}/${cap.totalT}
                    </span>
                    <span style="color: ${cap.availableF > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'}">
                        <strong>Fun Jumper:</strong> ${cap.availableF}/${cap.totalF}
                    </span>
                    <span style="color: ${cap.availableC > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'}">
                        <strong>Copiloto:</strong> ${cap.availableC}/${cap.totalC}
                    </span>
                </div>
            `;
            infoDiv.style.color = 'var(--text-primary)';

            if (!window.FlightAvailabilityHelper || !pFlightSelect) return;

            const currentPax = passengers[activeIndex];
            const jType = globalJumptype.value;
            const catLabel = window.FlightAvailabilityHelper.getCategoryLabel(jType);
            const extraSelections = getDraftFlightSelectionsExcluding(activeIndex, dateStr);
            const flights = window.FlightAvailabilityHelper.getFlightsForDate(dateStr, {
                excludePaxId: currentPax ? (currentPax.id || null) : null,
                extraSelections
            });

            if (flights.length === 0) {
                resetFlightControls('Sin vuelos programados');
                return;
            }

            // Resolver si el pasajero actual ya tiene un vuelo coincidente en esta fecha
            const matchedCurrent = currentPax ? window.FlightAvailabilityHelper.findMatchingFlightForPax(currentPax, flights) : null;
            let selectedFlightId = (matchedCurrent && (typeof matchedCurrent.canAssignForType === 'function'
                ? matchedCurrent.canAssignForType(jType)
                : (!matchedCurrent.isLocked && matchedCurrent.getAvailForType(jType) > 0)))
                ? matchedCurrent.flightId
                : '';

            if (currentPax && currentPax.flightId && !selectedFlightId) {
                currentPax.flightId = '';
                currentPax.aeronave = 'Sin asignar';
                currentPax.vueloNum = '';
                currentPax.time = 'Por definir';
            } else if (currentPax && selectedFlightId && matchedCurrent) {
                currentPax.flightId = matchedCurrent.flightId;
                currentPax.aeronave = matchedCurrent.matricula;
                currentPax.vueloNum = matchedCurrent.vueloNum;
                currentPax.time = matchedCurrent.horaInicio;
            }

            let optionsHtml = `<option value="">Sin asignar vuelo (Por definir)</option>`;
            flights.forEach(f => {
                const availForType = f.getAvailForType(jType);
                const capForType = f.getCapForType(jType);
                const canSelect = typeof f.canAssignForType === 'function'
                    ? f.canAssignForType(jType)
                    : (!f.isLocked && availForType > 0);
                const timeRange = f.horaFin ? `${f.horaInicio} - ${f.horaFin}` : f.horaInicio;
                const currentTag = f.containsExcludedPax ? ' (Vuelo actual)' : '';
                const statusTxt = canSelect
                    ? `${availForType}/${capForType} ${catLabel} disp.${currentTag}`
                    : (f.isLocked ? 'Vuelo cerrado' : `SIN CUPO ${catLabel}`);
                const isSelected = selectedFlightId === f.flightId;
                optionsHtml += `<option value="${escapeHTML(f.flightId)}" ${!canSelect ? 'disabled' : ''} ${isSelected ? 'selected' : ''}>${escapeHTML(f.vueloNum)} (${escapeHTML(timeRange)}) · ${escapeHTML(f.matricula)} — ${escapeHTML(statusTxt)}</option>`;
            });

            pFlightSelect.disabled = false;
            pFlightSelect.innerHTML = optionsHtml;
            pFlightSelect.value = selectedFlightId;

            if (pFlightsBreakdown) {
                pFlightsBreakdown.style.display = 'block';
                const cardsHtml = flights.map(f => {
                    const availForType = f.getAvailForType(jType);
                    const canSelect = typeof f.canAssignForType === 'function'
                        ? f.canAssignForType(jType)
                        : (!f.isLocked && availForType > 0);
                    const isSelected = selectedFlightId === f.flightId;
                    const timeRange = f.horaFin ? `${f.horaInicio} - ${f.horaFin}` : f.horaInicio;
                    const badgeBg = isSelected
                        ? 'var(--brand-action)'
                        : (canSelect ? 'rgba(16, 185, 129, 0.14)' : 'rgba(239, 68, 68, 0.14)');
                    const badgeColor = isSelected
                        ? '#ffffff'
                        : (canSelect ? 'var(--brand-success)' : 'var(--brand-danger)');
                    const badgeText = isSelected
                        ? 'Seleccionado'
                        : (canSelect ? `${availForType} disp.` : (f.isLocked ? 'Cerrado' : 'Lleno'));
                    const borderStyle = isSelected
                        ? '2px solid var(--brand-action)'
                        : '1px solid var(--border-color)';

                    return `
                        <div class="flight-slot-card" data-flight-id="${escapeHTML(f.flightId)}" data-available="${canSelect ? '1' : '0'}"
                             style="padding: 0.6rem 0.8rem; border-radius: 8px; background: var(--bg-surface); border: ${borderStyle}; display: flex; justify-content: space-between; align-items: center; gap: 0.65rem; flex-wrap: wrap; cursor: ${canSelect ? 'pointer' : 'not-allowed'}; opacity: ${canSelect || isSelected ? '1' : '0.62'};">
                            <div style="min-width: 170px;">
                                <div style="font-weight: 700; font-size: 0.86rem; color: var(--text-primary);">
                                    <i class="fas fa-plane" style="color: var(--brand-action); margin-right: 0.3rem;"></i>
                                    ${escapeHTML(f.vueloNum)} · ${escapeHTML(timeRange)} · ${escapeHTML(f.matricula)}
                                </div>
                                <div style="font-size: 0.76rem; color: var(--text-secondary); margin-top: 2px; display: flex; gap: 0.65rem; flex-wrap: wrap;">
                                    <span>Tándem: <strong style="color: ${f.availTan > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'};">${f.availTan}/${f.capTan}</strong></span>
                                    <span>Fun: <strong style="color: ${f.availFun > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'};">${f.availFun}/${f.capFun}</strong></span>
                                    <span>Cop: <strong style="color: ${f.availCop > 0 ? 'var(--brand-success)' : 'var(--brand-danger)'};">${f.availCop}/${f.capCop}</strong></span>
                                </div>
                            </div>
                            <span style="font-size: 0.75rem; font-weight: 700; padding: 0.22rem 0.6rem; border-radius: 999px; background: ${badgeBg}; color: ${badgeColor}; white-space: nowrap;">
                                ${escapeHTML(badgeText)}
                            </span>
                        </div>
                    `;
                }).join('');

                pFlightsBreakdown.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.6rem; flex-wrap: wrap; gap: 0.5rem;">
                        <strong style="font-size: 0.85rem; color: var(--text-primary);">
                            <i class="fas fa-plane-departure" style="color: var(--brand-action);"></i> Desglose de Vuelos del Día (${flights.length})
                        </strong>
                        <span style="font-size: 0.76rem; color: var(--text-secondary);">Haz clic en un vuelo disponible o usa el selector superior</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${cardsHtml}
                    </div>
                `;

                pFlightsBreakdown.querySelectorAll('.flight-slot-card[data-available="1"]').forEach(card => {
                    card.addEventListener('click', () => {
                        const fid = card.getAttribute('data-flight-id');
                        if (!fid) return;
                        pFlightSelect.value = fid;
                        applySelectedFlightToCurrentPax(fid, dateStr);
                        updateCapacityUI(dateStr);
                    });
                });
            }
        }
        
        pJumpDate.addEventListener('change', (e) => {
            if (passengers[activeIndex]) {
                if (passengers[activeIndex].jumpdate !== e.target.value) {
                    passengers[activeIndex].flightId = '';
                    passengers[activeIndex].aeronave = 'Sin asignar';
                    passengers[activeIndex].vueloNum = '';
                    passengers[activeIndex].time = 'Por definir';
                }
                passengers[activeIndex].jumpdate = e.target.value;
            }
            updateCapacityUI(e.target.value);
        });

        if (pFlightSelect) {
            pFlightSelect.addEventListener('change', (e) => {
                applySelectedFlightToCurrentPax(e.target.value, pJumpDate.value);
                updateCapacityUI(pJumpDate.value);
            });
        }

        const btnSearch = document.getElementById('btn-p-search');
        const searchInput = document.getElementById('p-search-filter');

        function executeSearch() {
            const q = searchInput.value.trim().toLowerCase();
            if (!q) return alert('Por favor ingresa un dato para buscar (Nombre, Apellido, Documento, Teléfono o Correo).');
            
            const dbPax = window.AppData.passengers || [];
            let found = null;
            
            // Search backwards to get the most recent record
            for (let i = dbPax.length - 1; i >= 0; i--) {
                const px = dbPax[i];
                if (
                    (px.name && px.name.toLowerCase().includes(q)) ||
                    (px.lastname && px.lastname.toLowerCase().includes(q)) ||
                    (px.doc && px.doc.toLowerCase() === q) ||
                    (px.phone && px.phone.toLowerCase().includes(q)) ||
                    (px.email && px.email.toLowerCase() === q)
                ) {
                    found = px;
                    break;
                }
            }
            
            if (found) {
                // Ensure all existing fields are synchronized to local state
                Object.assign(passengers[activeIndex], found);
                
                passengers[activeIndex].id = found.id;
                pName.value = found.name || pName.value;
                if (typeof pLastname !== 'undefined') pLastname.value = found.lastname || pLastname.value;
                const pLastnameInput = document.getElementById('p-lastname');
                if (pLastnameInput) pLastnameInput.value = found.lastname || pLastnameInput.value;
                pDoc.value = found.doc || pDoc.value;
                pPhone.value = found.phone || pPhone.value;
                pEmail.value = found.email || pEmail.value;
                pDob.value = found.dob || pDob.value;
                if (pWeight && found.weight !== undefined && found.weight !== null && found.weight > 0) {
                    pWeight.value = found.weight;
                    passengers[activeIndex].weight = found.weight;
                }
                const foundHasMed = Boolean(found.medicalCondition && String(found.medicalCondition).trim() !== '' && String(found.medicalCondition).trim().toLowerCase() !== 'ninguna');
                if (pHasMedical) pHasMedical.checked = foundHasMed;
                if (pMedicalContainer) pMedicalContainer.style.display = foundHasMed ? 'block' : 'none';
                if (pMedicalCondition) pMedicalCondition.value = foundHasMed ? found.medicalCondition : '';
                if (passengers[activeIndex]) {
                    passengers[activeIndex].hasMedicalCondition = foundHasMed;
                    passengers[activeIndex].medicalCondition = foundHasMed ? found.medicalCondition : '';
                }
                
                if (found.date && found.date !== 'Por definir') {
                    pJumpDate.value = found.date;
                    passengers[activeIndex].jumpdate = found.date;
                }

                // Sincronizar pagos
                if (found.financiera) {
                    passengers[activeIndex].manualPrice = found.financiera.manualPrice || 0;
                    passengers[activeIndex].discount = found.financiera.discount || 0;
                    passengers[activeIndex].comisionTo = found.financiera.comisionTo || '';
                    passengers[activeIndex].comisionVal = found.financiera.comisionVal || 0;
                    passengers[activeIndex].totalPaid = found.financiera.totalPaid || 0;
                    passengers[activeIndex].payMethod = found.financiera.payMethod || 'Efectivo';
                    passengers[activeIndex].cortesiaObs = found.financiera.cortesiaObs || '';
                    
                    fBasePrice.value = formatCurrency(passengers[activeIndex].manualPrice);
                    fDiscount.value = formatCurrency(passengers[activeIndex].discount);
                    fComisionTo.value = passengers[activeIndex].comisionTo;
                    fComisionVal.value = formatCurrency(passengers[activeIndex].comisionVal);
                    fPayMethod.value = passengers[activeIndex].payMethod;
                    
                    if (found.financiera.cortesiaObs || found.financiera.manualPrice === 0) {
                        fCortesia.checked = true;
                        containerCortesiaObs.style.display = 'block';
                        fCortesiaObs.value = passengers[activeIndex].cortesiaObs;
                        fBasePrice.readOnly = false;
                        fBasePrice.style.background = 'transparent';
                    }
                }

                // Immediately save to state
                if (passengers[activeIndex]) {
                    passengers[activeIndex].name = pName.value;
                    passengers[activeIndex].lastname = pLastnameInput ? pLastnameInput.value : '';
                    passengers[activeIndex].doc = pDoc.value;
                    passengers[activeIndex].phone = pPhone.value;
                    passengers[activeIndex].email = pEmail.value;
                    passengers[activeIndex].dob = pDob.value;
                    if (pWeight) passengers[activeIndex].weight = pWeight.value;
                }
                
                updateWeightUI(pWeight ? pWeight.value : '', passengers[activeIndex]);
                updateCapacityUI(pJumpDate.value);
                renderAdicionesUI();
                calculateGlobal();
                alert('¡Pasajero encontrado! Datos e información financiera sincronizados.');
            } else {
                alert('No se encontró ningún pasajero histórico con esos datos.');
            }
        }

        if (btnSearch) {
            btnSearch.addEventListener('click', executeSearch);
        }
        if (searchInput) {
            searchInput.addEventListener('keyup', (e) => {
                if (e.key === 'Enter') executeSearch();
            });
        }

        function updateFinanceUI(p) {
            if (p.cortesia) {
                fBasePrice.readOnly = false;
                fBasePrice.style.background = 'transparent';
                fBasePrice.value = formatCurrency(p.manualPrice);
                containerCortesiaObs.style.display = 'block';
                fCortesiaObs.value = p.cortesiaObs || '';
            } else {
                fBasePrice.readOnly = true;
                fBasePrice.style.background = 'var(--bg-surface-hover)';
                const hasLockedBase = p.id && p.financiera && typeof p.financiera.manualPrice === 'number' && p.financiera.manualPrice > 0 && (!p.type || p.type === globalJumptype.value);
                const base = hasLockedBase ? p.financiera.manualPrice : getBasePriceForJumpType(globalJumptype.value, p);
                fBasePrice.value = formatCurrency(base);
                p.manualPrice = base; // Keep it in sync
                containerCortesiaObs.style.display = 'none';
                fCortesiaObs.value = '';
            }
        }

        function calculateGlobal() {
            saveCurrentPassenger(); // Make sure current active is saved before calculating
            let total = 0;
            let totalYaPagado = 0;
            let totalKgExtraCharge = 0;
            
            passengers.forEach((p, idx) => {
                let pTotal = 0;
                if (p.cortesia) {
                    pTotal += p.manualPrice;
                } else {
                    const hasLockedBase = p.id && p.financiera && typeof p.financiera.manualPrice === 'number' && p.financiera.manualPrice > 0 && (!p.type || p.type === globalJumptype.value);
                    pTotal += hasLockedBase ? p.financiera.manualPrice : getBasePriceForJumpType(globalJumptype.value, p);
                }
                
                if (p.adiciones) {
                    const effectiveMaestro = window.TariffGuard ? window.TariffGuard.getEffectiveMaestroForRecord(p) : (window.AppData?.maestroValores || []);
                    for (const [key, val] of Object.entries(p.adiciones)) {
                        if (val === 'si') {
                            if (window.TariffGuard) {
                                pTotal += window.TariffGuard.getPriceForRecord(p, key);
                            } else {
                                const mItem = effectiveMaestro.find(m => m.name === key);
                                if (mItem) pTotal += parseCurrency(mItem.price);
                            }
                        }
                    }
                }

                // Recargo por peso extra (> 85 kg)
                const wt = (idx === activeIndex)
                    ? updateWeightUI(p.weight, p)
                    : getExtraWeightDetails(p.weight, p);
                pTotal += wt.charge;
                totalKgExtraCharge += wt.charge;
                
                pTotal -= p.discount;
                if(pTotal < 0) pTotal = 0;
                
                total += pTotal;
                totalYaPagado += (p.totalPaid || 0);
            });

            if (dKgExtraRow && dKgExtra) {
                dKgExtraRow.style.display = totalKgExtraCharge > 0 ? 'flex' : 'none';
                dKgExtra.textContent = '+$' + formatCurrency(totalKgExtraCharge);
            }

            let abonoNuevo = parseCurrency(globalAbono.value);
            if (globalFullPay.value === 'si') {
                abonoNuevo = Math.max(0, total - totalYaPagado);
                globalAbono.value = formatCurrency(abonoNuevo);
                globalAbonoContainer.style.display = 'none';
            } else {
                globalAbonoContainer.style.display = 'block';
            }

            let pending = total - (totalYaPagado + abonoNuevo);
            if(pending < 0) pending = 0;

            dTotal.textContent = '$' + formatCurrency(total);
            dAbono.textContent = '$' + formatCurrency(totalYaPagado + abonoNuevo);
            dPending.textContent = '$' + formatCurrency(pending);
            if (pending > 0) {
                dPending.style.color = 'var(--brand-danger)';
            } else {
                dPending.style.color = 'var(--brand-success)';
            }

            const btnSave = document.getElementById('btn-save-res');
            if (btnSave) {
                if (pending === 0 && passengers.every(isPaxComplete)) {
                    btnSave.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    btnSave.style.animation = 'pulseGlow 2s infinite';
                } else {
                    btnSave.style.background = 'var(--brand-action)';
                    btnSave.style.animation = 'none';
                }
            }
        }

        function checkMinor(dobVal) {
            if(!dobVal) {
                minorAlert.style.display = 'none';
                document.getElementById('btn-save-res').disabled = false;
                return;
            }
            const birthDate = new Date(dobVal);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            if (age < 12) {
                minorAlert.style.display = 'block';
                minorAlert.innerHTML = '<i class="fas fa-ban"></i> <strong>Prohibido Saltar:</strong> El pasajero es menor de 12 años, por regulación no puede realizar la actividad.';
                minorAlert.style.borderLeftColor = 'var(--brand-danger)';
                minorAlert.style.color = 'var(--brand-danger)';
                minorAlert.style.background = 'rgba(239,68,68,0.1)';
                document.getElementById('btn-save-res').disabled = true;
            } else if (age < 18) {
                minorAlert.style.display = 'block';
                minorAlert.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <strong>Pasajero Menor de Edad:</strong> Si es menor de edad la aceptación legal la debe firmar los 2 padres o tutor legal.';
                minorAlert.style.borderLeftColor = 'var(--brand-warning)';
                minorAlert.style.color = 'var(--brand-warning)';
                minorAlert.style.background = 'rgba(245,158,11,0.1)';
                document.getElementById('btn-save-res').disabled = false;
            } else {
                minorAlert.style.display = 'none';
                document.getElementById('btn-save-res').disabled = false;
            }
        }

        // Listeners for triggers
        qtyInput.addEventListener('change', (e) => {
            let count = parseInt(e.target.value);
            if(count < 1) count = 1;
            if(count > 10) count = 10;
            e.target.value = count;
            initPassengers(count);
        });

        pDob.addEventListener('change', (e) => checkMinor(e.target.value));
        if (pWeight) {
            pWeight.addEventListener('input', calculateGlobal);
            pWeight.addEventListener('change', calculateGlobal);
        }
        if (pHasMedical) {
            pHasMedical.addEventListener('change', () => {
                if (pMedicalContainer) {
                    pMedicalContainer.style.display = pHasMedical.checked ? 'block' : 'none';
                }
                if (!pHasMedical.checked && pMedicalCondition) {
                    pMedicalCondition.value = '';
                }
                saveCurrentPassenger();
            });
        }
        if (pMedicalCondition) {
            pMedicalCondition.addEventListener('input', () => saveCurrentPassenger());
        }

        // When Jump Type or Cortesia changes, we might need to update the base price UI
        globalJumptype.addEventListener('change', (e) => {
            const todayStr = new Date().toLocaleDateString('en-CA');
            if(e.target.value === 'Fun Jumper' || e.target.value === 'funjumper') {
                pJumpDate.value = todayStr;
                pJumpDate.min = todayStr;
                pJumpDate.max = todayStr;
                pJumpDate.readOnly = true;
            } else {
                pJumpDate.min = '';
                pJumpDate.max = '';
                pJumpDate.readOnly = false;
            }
            saveCurrentPassenger();
            renderAdicionesUI(); // Update UI list first
            updateFinanceUI(passengers[activeIndex]);
            updateCapacityUI(pJumpDate.value);
            calculateGlobal();
        });

        const modalPwd = document.getElementById('modal-cortesia-pwd');
        const modalPwdInput = document.getElementById('cortesia-pwd-input');
        const btnCortesiaConfirm = document.getElementById('btn-cortesia-confirm');
        const btnCortesiaCancel = document.getElementById('btn-cortesia-cancel');
        const closeCortesiaPwd = document.getElementById('close-cortesia-pwd');

        const btnUnlockDiscount = document.getElementById('btn-unlock-discount');

        let currentPwdAction = null;

        function closePwdModal() {
            modalPwd.style.opacity = '0';
            modalPwd.querySelector('.modal-content').style.transform = 'translateY(-20px)';
            setTimeout(() => { modalPwd.style.display = 'none'; }, 300);
            modalPwdInput.value = '';
            currentPwdAction = null;
        }

        fCortesia.addEventListener('click', (e) => {
            if (fCortesia.checked) {
                e.preventDefault(); // Prevent checking immediately
                currentPwdAction = 'cortesia';
                document.querySelector('#modal-cortesia-pwd p').textContent = 'Ingrese clave de Administrador para habilitar Cortesía / Valor Manual.';
                modalPwd.style.display = 'flex';
                void modalPwd.offsetWidth;
                modalPwd.style.opacity = '1';
                modalPwd.querySelector('.modal-content').style.transform = 'translateY(0)';
                setTimeout(() => modalPwdInput.focus(), 100);
            }
        });

        btnUnlockDiscount.addEventListener('click', (e) => {
            e.preventDefault();
            currentPwdAction = 'descuento';
            document.querySelector('#modal-cortesia-pwd p').textContent = 'Ingrese clave de Administrador para habilitar el Descuento.';
            modalPwd.style.display = 'flex';
            void modalPwd.offsetWidth;
            modalPwd.style.opacity = '1';
            modalPwd.querySelector('.modal-content').style.transform = 'translateY(0)';
            setTimeout(() => modalPwdInput.focus(), 100);
        });

        function checkPwd() {
            const pwd = modalPwdInput.value;
            let isValid = false;
            const adminUser = (window.AppData.users || []).find(u => (u.role === 'admin' || u.role === 'Administrador' || u.role === 'SuperAdmin'));
            if (adminUser && adminUser.password === pwd) {
                isValid = true;
            } else if (!adminUser && pwd === 'admin123') {
                isValid = true;
            }

            if (isValid) {
                if (currentPwdAction === 'cortesia') {
                    fCortesia.checked = true;
                    saveCurrentPassenger();
                    updateFinanceUI(passengers[activeIndex]);
                    calculateGlobal();
                } else if (currentPwdAction === 'descuento') {
                    fDiscount.disabled = false;
                    fDiscount.style.background = '';
                    fDiscount.style.color = '';
                    btnUnlockDiscount.style.display = 'none';
                    fDiscount.focus();
                }
                closePwdModal();
            } else {
                alert('Clave incorrecta.');
                modalPwdInput.value = '';
                modalPwdInput.focus();
            }
        }

        btnCortesiaConfirm.addEventListener('click', checkPwd);
        modalPwdInput.addEventListener('keyup', (e) => { if (e.key === 'Enter') checkPwd(); });
        btnCortesiaCancel.addEventListener('click', closePwdModal);
        closeCortesiaPwd.addEventListener('click', closePwdModal);

        fCortesia.addEventListener('change', () => {
            if (!fCortesia.checked) {
                saveCurrentPassenger();
                updateFinanceUI(passengers[activeIndex]);
                calculateGlobal();
            }
        });

        // Any change in finance inputs should recalculate global
        fBasePrice.addEventListener('input', calculateGlobal);
        fDiscount.addEventListener('input', calculateGlobal);
        globalAbono.addEventListener('input', calculateGlobal);
        globalFullPay.addEventListener('change', calculateGlobal);

        document.getElementById('btn-save-res').addEventListener('click', () => {
            saveCurrentPassenger();
            
            // Validate capacity first
            const dateCounts = {};
            for (let i = 0; i < passengers.length; i++) {
                const p = passengers[i];
                if (p.jumpdate) {
                    dateCounts[p.jumpdate] = (dateCounts[p.jumpdate] || 0) + 1;
                }
            }
            for (const [dateStr, count] of Object.entries(dateCounts)) {
                const cap = getAvailableCapacityForDate(dateStr);
                if (cap.total > 0) {
                    const jType = globalJumptype.value;
                    const availForType = jType === 'Copiloto' ? cap.availableC : (jType === 'Fun Jumper' ? cap.availableF : cap.availableT);
                    if (count > availForType) {
                        alert(`¡Error de Capacidad!\nNo hay suficientes cupos disponibles (${jType}) para la fecha ${dateStr}.\nSolicitados: ${count}, Disponibles: ${availForType}`);
                        return;
                    }
                }
            }

            // Validar disponibilidad por vuelo específico para los pasajeros con vuelo programado
            if (window.FlightAvailabilityHelper) {
                const jType = globalJumptype.value;
                const requestedByFlight = {};
                for (let i = 0; i < passengers.length; i++) {
                    const p = passengers[i];
                    if (p.jumpdate && p.flightId) {
                        const key = `${p.jumpdate}__${p.flightId}`;
                        if (!requestedByFlight[key]) {
                            requestedByFlight[key] = { dateStr: p.jumpdate, flightId: p.flightId, paxIds: [], count: 0 };
                        }
                        requestedByFlight[key].count += 1;
                        if (p.id) requestedByFlight[key].paxIds.push(p.id);
                    }
                }
                for (const entry of Object.values(requestedByFlight)) {
                    const flights = window.FlightAvailabilityHelper.getFlightsForDate(entry.dateStr, {
                        excludePaxId: entry.paxIds.length === 1 ? entry.paxIds[0] : null
                    });
                    const targetFlight = flights.find(f => f.flightId === entry.flightId);
                    if (!targetFlight || targetFlight.isLocked) {
                        alert(`El vuelo seleccionado para la fecha ${entry.dateStr} ya no está disponible.`);
                        return;
                    }
                    const avail = typeof targetFlight.getAssignableAvailForType === 'function'
                        ? targetFlight.getAssignableAvailForType(jType)
                        : targetFlight.getAvailForType(jType);
                    if (entry.count > avail) {
                        alert(`¡Error de Capacidad en Vuelo!\nEl ${targetFlight.vueloNum} (${targetFlight.horaInicio} · ${targetFlight.matricula}) solo tiene ${avail} cupo(s) disponible(s) para ${jType}, y estás asignando ${entry.count}.`);
                        return;
                    }
                }
            }
            
            let hasErrors = false;
            let finalPax = [];
            
            for (let i = 0; i < passengers.length; i++) {
                const p = passengers[i];
                // Sanitize numeric fields (in case of paste)
                p.doc = p.doc.replace(/[^0-9]/g, '');
                p.phone = p.phone.replace(/[^0-9]/g, '');
                
                if(!p.name || !p.doc || !p.jumpdate || !p.phone || !p.email || !p.dob) {
                    alert(`Por favor completa todos los datos personales (Nombre, Documento, Teléfono, Correo, Fecha de Nacimiento y Fecha de Salto) para el Pasajero ${i+1}.`);
                    hasErrors = true;
                    break;
                }

                if (p.weight !== '' && p.weight !== undefined && p.weight !== null && parseFloat(p.weight) < 0) {
                    alert(`El peso del Pasajero ${i+1} no puede ser un valor negativo.`);
                    hasErrors = true;
                    break;
                }

                if (p.hasMedicalCondition && !String(p.medicalCondition || '').trim()) {
                    alert(`Por favor ingresa la condición médica reportada para el Pasajero ${i+1}.`);
                    hasErrors = true;
                    break;
                }
                
                // Validate date is not in the past
                const jumpDateObj = new Date(p.jumpdate + 'T00:00:00');
                const todayObj = new Date();
                todayObj.setHours(0,0,0,0);
                if (jumpDateObj < todayObj) {
                    alert(`La fecha de salto del Pasajero ${i+1} no puede estar en el pasado.`);
                    hasErrors = true;
                    break;
                }
                
                // Format date to DD/MM/YYYY
                // Construct final passenger object
                const adics = [];
                if (p.adiciones) {
                    Object.keys(p.adiciones).forEach(k => {
                        if (p.adiciones[k] === 'si') adics.push(k);
                    });
                }
                
                let pTotal = p.manualPrice || 0;
                if (p.adiciones) {
                    for (const [key, val] of Object.entries(p.adiciones)) {
                        if (val === 'si') {
                            if (window.TariffGuard) {
                                pTotal += window.TariffGuard.getPriceForRecord(p, key);
                            } else if (window.AppData && window.AppData.maestroValores) {
                                const mItem = window.AppData.maestroValores.find(m => m.name === key);
                                if (mItem) pTotal += parseCurrency(mItem.price);
                            }
                        }
                    }
                }
                const wt = getExtraWeightDetails(p.weight, p);
                pTotal += wt.charge;
                pTotal -= p.discount || 0;
                if (pTotal < 0) pTotal = 0;
                
                let paxId = p.id || ('pax_' + Date.now() + '_' + i);
                let currentTotalPaid = p.totalPaid || 0;
                let abonoVal = parseCurrency(globalAbono.value);
                let newAbono = globalFullPay.value === 'si' ? Math.max(0, pTotal - currentTotalPaid) : Math.round(abonoVal / passengers.length);
                let finalTotalPaid = currentTotalPaid + newAbono; // Accrue payments
                const createdAt = p.createdAt || new Date().toISOString();
                const tariffSnapshot = (p.tariffSnapshot && Array.isArray(p.tariffSnapshot.items) && p.tariffSnapshot.items.length > 0)
                    ? p.tariffSnapshot
                    : (window.TariffGuard ? window.TariffGuard.buildTariffSnapshot() : null);
                
                const hasSelectedFlight = Boolean(p.flightId && p.aeronave && p.aeronave !== 'Sin asignar');
                const dateChanged = Boolean(p.date && p.date !== p.jumpdate);
                const resolvedFlightId = hasSelectedFlight ? p.flightId : (dateChanged ? '' : (p.flightId || ''));
                const resolvedAeronave = hasSelectedFlight ? p.aeronave : (dateChanged ? 'Sin asignar' : (p.aeronave || 'Sin asignar'));
                const resolvedVueloNum = hasSelectedFlight ? (p.vueloNum || '') : (dateChanged ? '' : (p.vueloNum || ''));
                const resolvedTime = hasSelectedFlight ? (p.time || 'Por definir') : (dateChanged ? 'Por definir' : (p.time || 'Por definir'));

                finalPax.push({
                    ...p, // preserve all existing properties like weight, paxStatus, etc
                    id: paxId,
                    createdAt,
                    tariffSnapshot,
                    name: `${p.name} ${p.lastname || ''}`.trim(),
                    lastname: p.lastname || '',
                    doc: p.doc,
                    phone: p.phone,
                    email: p.email,
                    dob: p.dob,
                    date: p.jumpdate, // Ensure ISO format YYYY-MM-DD
                    time: resolvedTime,
                    flightId: resolvedFlightId,
                    type: globalJumptype.value,
                    adiciones: p.adiciones || {},
                    cams: adics.join(', ') || 'Sin cámaras',
                    weight: wt.weight,
                    medicalCondition: p.hasMedicalCondition ? String(p.medicalCondition || '').trim() : 'Ninguna',
                    instructor: dateChanged ? 'Sin asignar' : (p.instructor || 'Sin asignar'),
                    camInstructor: dateChanged ? 'Sin asignar' : (p.camInstructor || 'Sin asignar'),
                    aeronave: resolvedAeronave,
                    vueloNum: resolvedVueloNum,
                    paxStatus: dateChanged ? 'Pendiente Check-in' : (p.paxStatus || 'Pendiente Check-in'),
                    flightStatus: (hasSelectedFlight || dateChanged) ? 'Programado' : (p.flightStatus || 'A tiempo / On-Time'),
                    waiverSigned: p.waiverSigned || false,
                    status: p.status || 'En Espera', // General status
                    financiera: {
                        ...(p.financiera || {}),
                        manualPrice: p.manualPrice,
                        kgExtra: wt.extraKg,
                        kgExtraRate: wt.rate,
                        kgExtraCharge: wt.charge,
                        totalValue: pTotal,
                        cortesiaObs: p.cortesiaObs || '',
                        discount: p.discount,
                        comisionTo: p.comisionTo,
                        comisionVal: p.comisionVal,
                        payMethod: p.payMethod,
                        totalPaid: finalTotalPaid // Will be handled in billing or updated here
                    }
                });
            }
            
            if(hasErrors) return;
            
            // Persist to AppData
            window.AppData = window.AppData || {};
            window.AppData.passengers = window.AppData.passengers || [];
            
            finalPax.forEach(px => {
                const existingIndex = window.AppData.passengers.findIndex(x => x.id === px.id);
                if (existingIndex !== -1) {
                    window.AppData.passengers[existingIndex] = { ...window.AppData.passengers[existingIndex], ...px };
                } else {
                    window.AppData.passengers.push(px);
                }
            });
            if (window.saveAppData) window.saveAppData();
            if (window.PaymentAlertsHelper) window.PaymentAlertsHelper.runAutoCheckOnLoad();

            alert('¡Reserva Guardada exitosamente!\nSe ha enviado el Token OTP y el enlace al Portal de Autogestión (B2C) al correo y WhatsApp registrado.\n\nEnlace enviado al cliente: https://fraternoparacaidismo.com/autogestion\n\nLos pasajeros ya están disponibles en el Check-in y Calendario.');
            
            // Reset form
            passengers = [];
            activeIndex = 0;
            qtyInput.value = 1;
            initPassengers(1);
        });

        function renderAdicionesUI() {
            const container = document.getElementById('dynamic-adiciones-container');
            container.innerHTML = '';
            
            const currentPax = passengers[activeIndex];
            const effectiveMaestro = window.TariffGuard
                ? window.TariffGuard.getEffectiveMaestroForRecord(currentPax)
                : (window.AppData && window.AppData.maestroValores ? window.AppData.maestroValores : []);
            if (!effectiveMaestro || effectiveMaestro.length === 0) return;

            let itemsToShow = [];
            if (globalJumptype.value === 'Fun Jumper') {
                itemsToShow = effectiveMaestro;
            } else {
                itemsToShow = effectiveMaestro.filter(v => 
                    ['Cámara 360', 'Cámara Externa', 'Cámara Go-Pro'].includes(v.name)
                );
            }

            let adicHtml = '';
            itemsToShow.forEach(item => {
                const safeName = escapeHTML(item.name);
                const safePrice = formatCurrency(parseCurrency(item.price));
                adicHtml += `
                    <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <label style="margin:0; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; width: 100%;">
                            <input type="checkbox" class="dynamic-adic" data-name="${safeName}" style="width: 18px; height: 18px; accent-color: var(--brand-action);">
                            <span style="flex: 1;">${safeName}</span>
                            <span style="color: var(--text-secondary);">+${safePrice}</span>
                        </label>
                    </div>
                `;
            });
            container.innerHTML = adicHtml;

            // attach event listeners
            document.querySelectorAll('.dynamic-adic').forEach(chk => {
                chk.addEventListener('change', (e) => {
                    const p = passengers[activeIndex];
                    if (!p.adiciones) p.adiciones = {};
                    p.adiciones[e.target.dataset.name] = e.target.checked ? 'si' : 'no';
                    calculateGlobal();
                });
            });
            
            // Set current passenger values
            const p = passengers[activeIndex];
            if (p && p.adiciones) {
                document.querySelectorAll('.dynamic-adic').forEach(chk => {
                    if (p.adiciones[chk.dataset.name] === 'si') {
                        chk.checked = true;
                    } else {
                        chk.checked = false;
                    }
                });
            }
        }

        // Init
        // Ensure maestroValores exists (if directly routed without visiting config)
        if (window.TariffGuard) {
            window.TariffGuard.ensureVersionMetadata();
        } else if (!window.AppData.maestroValores) {
            window.AppData.maestroValores = [
                {name: 'Valor KG Extra', price: '5.000', comision: '0'}, {name: 'Salto Tandem', price: '1.500.000', comision: '0'},
                {name: 'Fun Jumper', price: '0', comision: '0'}, {name: 'Copiloto', price: '0', comision: '0'},
                {name: 'Salto AFF', price: '0', comision: '0'}, {name: 'Salto AFF 1', price: '0', comision: '0'}, {name: 'Salto AFF 2', price: '0', comision: '0'},
                {name: 'Cámara Externa', price: '250.000', comision: '0'}, {name: 'Cámara Go-Pro', price: '100.000', comision: '0'},
                {name: 'Cámara 360', price: '150.000', comision: '0'}, {name: 'Empaque Tandem', price: '0', comision: '0'}, {name: 'Empaque Escuela', price: '0', comision: '0'},
                {name: 'Teoría AFF', price: '0', comision: '0'}, {name: 'Hora de Teoría', price: '0', comision: '0'}, {name: 'Coach', price: '0', comision: '0'},
                {name: 'Curso de Empaque', price: '0', comision: '0'}, {name: 'Empaque de Reserva', price: '0', comision: '0'},
                {name: 'Curso Control Cúpula', price: '0', comision: '0'}, {name: 'Acompañamiento Examen Licencia', price: '0', comision: '0'},
                {name: 'Curso Aterrizajes en Agua', price: '0', comision: '0'}, {name: 'Alquiler de equipo', price: '0', comision: '0'}
            ];
        }

        initPassengers(1);
        renderAdicionesUI();
    }
}