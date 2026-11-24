window.Modules = window.Modules || {};
window.Modules.manifest = {
    getJumpRestrictionStyle: (val) => {
        switch (val) {
            case 'Sin restricción': return { color: '#10b981', light: 'green' };
            case '25 Saltos':       return { color: '#84cc16', light: 'green' };
            case '100 Saltos':      return { color: '#eab308', light: 'yellow' };
            case '200 Saltos':      return { color: '#f59e0b', light: 'yellow' };
            case '300 Saltos':      return { color: '#f97316', light: 'red' };
            case '500 Saltos':      return { color: '#ef4444', light: 'red' };
            case 'Zona Cerrada':    return { color: '#dc2626', light: 'closed' };
            default:                return { color: '#10b981', light: 'green' };
        }
    },
    render: (container) => {
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                <h2 style="margin: 0;"><i class="fas fa-plane-departure" style="color: var(--brand-action);"></i> Manifiesto Operativo (Despegues)</h2>
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <input type="date" id="manifest-date-filter" class="form-control" style="width: 180px; background: var(--bg-main);">
                    <button class="btn btn-primary" id="btn-refresh-manifest"><i class="fas fa-sync-alt"></i> Refrescar Tablero</button>
                </div>
            </div>

            <!-- Barra Superior de Control Operativo: Restricción Por Saltos y PONCHERA (Req #1 & #5) -->
            <div class="card" style="display: flex; gap: 1.5rem; align-items: flex-end; flex-wrap: wrap; padding: 1.15rem 1.5rem; margin-bottom: 1.5rem; background: var(--bg-surface); border-left: 4px solid var(--brand-action);">
                <div class="form-group" style="margin-bottom: 0; min-width: 260px; flex: 1;">
                    <label style="font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                        <i class="fas fa-traffic-light" id="manifest-restriction-icon" style="color: #10b981;"></i> Restricción Por Saltos:
                        <span id="manifest-semaforo-dot" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: #10b981; box-shadow: 0 0 8px #10b981; margin-left: auto;"></span>
                    </label>
                    <select id="manifest-jump-restriction" class="form-control" style="font-weight: 700; background: var(--bg-main); border-width: 2px; transition: all 0.25s ease;">
                        <option value="Sin restricción">🟢 Sin Restricción</option>
                        <option value="25 Saltos">🟢 25 Saltos</option>
                        <option value="100 Saltos">🟡 100 Saltos</option>
                        <option value="200 Saltos">🟠 200 Saltos</option>
                        <option value="300 Saltos">🟠 300 Saltos</option>
                        <option value="500 Saltos">🔴 500 Saltos</option>
                        <option value="Zona Cerrada">⛔ Zona Cerrada / NO-GO</option>
                    </select>
                    <div id="manifest-closed-reason-badge" style="display: none; margin-top: 0.45rem; font-size: 0.82rem; font-weight: 700; color: #dc2626; background: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.35); border-radius: 6px; padding: 0.35rem 0.65rem; align-items: center; justify-content: space-between; gap: 0.5rem;">
                        <span><i class="fas fa-exclamation-triangle"></i> Motivo: <strong id="manifest-closed-reason-text"></strong></span>
                        <button type="button" id="btn-change-closed-reason" style="background: none; border: none; color: #dc2626; cursor: pointer; font-size: 0.78rem; text-decoration: underline; font-weight: 700; padding: 0;">Cambiar</button>
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 0; min-width: 280px; flex: 1.5;">
                    <label style="font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;">
                        <i class="fas fa-beer" style="color: #f59e0b;"></i> PONCHERA (Instructores que deben la ponchera):
                    </label>
                    <div class="multi-dropdown" id="ponchera-dropdown">
                        <button type="button" class="multi-dropdown-btn" id="ponchera-dropdown-btn">
                            <span id="ponchera-selected-label" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Seleccionar instructores...</span>
                            <i class="fas fa-chevron-down" style="font-size: 0.8rem; color: var(--text-secondary);"></i>
                        </button>
                        <div class="multi-dropdown-menu" id="ponchera-dropdown-menu">
                            <!-- Instructores se inyectan dinámicamente -->
                        </div>
                    </div>
                </div>

                <div id="ponchera-badges-container" style="display: flex; gap: 0.5rem; flex-wrap: wrap; align-items: center; flex: 1;">
                    <!-- Badges de quienes deben la ponchera -->
                </div>
            </div>

            <div id="vuelos-board" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 1.5rem;">
                <!-- Rendered dynamically -->
            </div>

            <!-- Modal Checklist En El Aire -->
            <div id="modal-checklist" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 550px; max-width: 90%; position: relative; transform: translateY(-20px); transition: transform 0.3s ease; max-height: 90vh; display: flex; flex-direction: column;">
                    <button id="btn-cancel-chk-top" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; color: var(--brand-action); border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-clipboard-check"></i> Autorización de Despegue</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                        Aeronave: <strong id="chk-aeronave" style="color: var(--text-primary);"></strong>
                    </p>
                    
                    <div style="background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                        <strong style="display: block; margin-bottom: 0.5rem; font-size: 0.9rem;">Agregar Pasajero (Opcional):</strong>
                        <div style="display: flex; gap: 0.5rem;">
                            <select id="chk-add-pax-select" class="form-control" style="flex: 1; background: var(--bg-main);">
                                <!-- Populated dynamically with pax En Espera without plane -->
                            </select>
                            <button id="btn-add-pax" class="btn btn-primary"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>

                    <p style="font-size: 0.85rem; color: var(--brand-danger); margin-bottom: 0.5rem; font-weight: 600;"><i class="fas fa-exclamation-triangle"></i> Los pasajeros DESMARCADOS serán removidos del vuelo.</p>
                    
                    <div id="chk-pax-list" style="display: flex; flex-direction: column; gap: 0.5rem; flex: 1; overflow-y: auto; padding: 0.5rem; border: 1px solid var(--border-color); border-radius: 6px; background: var(--bg-main);">
                        <!-- Checklist items populated dynamically -->
                    </div>
                    
                    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-outline" id="btn-cancel-chk" style="width: 50%;">Cancelar</button>
                        <button class="btn btn-primary" id="btn-confirm-chk" style="width: 50%;"><i class="fas fa-plane-departure"></i> Confirmar Despegue</button>
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
        const board = document.getElementById('vuelos-board');
        const dateFilter = document.getElementById('manifest-date-filter');
        const btnRefresh = document.getElementById('btn-refresh-manifest');
        if (btnRefresh) {
            btnRefresh.addEventListener('click', () => renderBoard());
        }
        
        // Initialize date filter to today
        const todayStr = new Date().toLocaleDateString('en-CA');
        dateFilter.value = todayStr;

        // ==========================================
        // 1. Restricción Por Saltos con Semáforo (Req #1)
        // ==========================================
        window.AppData = window.AppData || {};
        const jumpRestSelect = document.getElementById('manifest-jump-restriction');
        const restDot = document.getElementById('manifest-semaforo-dot');
        const restIcon = document.getElementById('manifest-restriction-icon');

        function getSemaforoColor(val) {
            switch (val) {
                case 'Sin restricción': return '#10b981'; // Verde (menos restrictivo)
                case '25 Saltos':       return '#84cc16'; // Verde Lima
                case '100 Saltos':      return '#eab308'; // Amarillo
                case '200 Saltos':      return '#f59e0b'; // Ámbar
                case '300 Saltos':      return '#f97316'; // Naranja Intenso
                case '500 Saltos':      return '#ef4444'; // Rojo (más restrictivo)
                case 'Zona Cerrada':    return '#dc2626'; // Rojo Crítico (Operaciones Cerradas / NO-GO)
                default:                return '#10b981';
            }
        }

        const CLOSED_ZONE_REASONS = [
            'Condiciones Meteorológicas',
            'Espacio Aéreo y Control de Tráfico (ATC)',
            'Seguridad en Tierra (Zona de Aterrizaje y Pista)',
            'Operación en Tierra',
            'Orden Público'
        ];

        const closedReasonBadge = document.getElementById('manifest-closed-reason-badge');
        const closedReasonText = document.getElementById('manifest-closed-reason-text');
        const btnChangeClosedReason = document.getElementById('btn-change-closed-reason');

        function openClosedZoneReasonModal(preselectedReason) {
            return new Promise((resolve) => {
                const defaultReason = CLOSED_ZONE_REASONS.includes(preselectedReason) ? preselectedReason : CLOSED_ZONE_REASONS[0];
                const overlay = document.createElement('div');
                overlay.className = 'fraterno-modal-overlay';
                overlay.style.display = 'flex';
                overlay.style.zIndex = '99999';

                const optionsHtml = CLOSED_ZONE_REASONS.map(r =>
                    `<option value="${escapeHTML(r)}" ${r === defaultReason ? 'selected' : ''}>${escapeHTML(r)}</option>`
                ).join('');

                overlay.innerHTML = `
                    <div class="fraterno-modal-card" style="width: 490px; max-width: 94%; border-top-color: #dc2626 !important;">
                        <button type="button" id="closed-reason-close-top" class="btn" style="position: absolute; top: 1.25rem; right: 1.25rem; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                        <h3 style="color: #dc2626; display: flex; align-items: center; gap: 0.6rem; margin-top: 0;">
                            <i class="fas fa-exclamation-triangle"></i> Motivo de Zona Cerrada / NO-GO
                        </h3>
                        <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 1.25rem;">
                            Selecciona el motivo por el cual las operaciones de salto quedan cerradas o suspendidas. Este motivo se reflejará en tiempo real en las pantallas <strong>FIDS</strong>.
                        </p>
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; display: block;">Motivo de Cierre *</label>
                            <select id="closed-zone-reason-select" class="form-control" style="font-weight: 600;">
                                ${optionsHtml}
                            </select>
                        </div>
                        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                            <button type="button" class="btn btn-outline" id="closed-reason-cancel">Cancelar</button>
                            <button type="button" class="btn btn-danger" id="closed-reason-confirm" style="background: #dc2626; color: #fff; border: none;">
                                <i class="fas fa-ban"></i> Confirmar Zona Cerrada
                            </button>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);
                const sel = overlay.querySelector('#closed-zone-reason-select');
                const btnOk = overlay.querySelector('#closed-reason-confirm');
                const btnCancel = overlay.querySelector('#closed-reason-cancel');
                const btnTop = overlay.querySelector('#closed-reason-close-top');

                function finish(val) {
                    overlay.remove();
                    resolve(val);
                }

                btnOk.addEventListener('click', () => finish(sel.value || CLOSED_ZONE_REASONS[0]));
                btnCancel.addEventListener('click', () => finish(null));
                btnTop.addEventListener('click', () => finish(null));
                overlay.addEventListener('click', (e) => { if (e.target === overlay) finish(null); });
            });
        }

        function updateManifestRestrictionStyle(val) {
            const color = getSemaforoColor(val);
            const isClosed = val === 'Zona Cerrada';
            if (jumpRestSelect) {
                jumpRestSelect.style.borderColor = color;
                jumpRestSelect.style.color = color;
                jumpRestSelect.style.background = isClosed ? 'rgba(220, 38, 38, 0.12)' : 'var(--bg-main)';
            }
            if (restDot) {
                restDot.style.background = color;
                restDot.style.boxShadow = `0 0 10px ${color}`;
            }
            if (restIcon) {
                restIcon.className = isClosed ? 'fas fa-exclamation-triangle' : 'fas fa-traffic-light';
                restIcon.style.color = color;
            }
            if (closedReasonBadge && closedReasonText) {
                if (isClosed && window.AppData.zonaCerradaMotivo) {
                    closedReasonText.textContent = window.AppData.zonaCerradaMotivo;
                    closedReasonBadge.style.display = 'flex';
                } else {
                    closedReasonBadge.style.display = 'none';
                }
            }
        }

        if (jumpRestSelect) {
            let lastRestrictionVal = window.AppData.restriccionSaltos || 'Sin restricción';
            jumpRestSelect.value = lastRestrictionVal;
            updateManifestRestrictionStyle(lastRestrictionVal);

            jumpRestSelect.addEventListener('change', async (e) => {
                const newVal = e.target.value;
                if (newVal === 'Zona Cerrada') {
                    const selectedReason = await openClosedZoneReasonModal(window.AppData.zonaCerradaMotivo);
                    if (!selectedReason) {
                        // Usuario canceló: restaurar valor anterior
                        jumpRestSelect.value = lastRestrictionVal;
                        updateManifestRestrictionStyle(lastRestrictionVal);
                        return;
                    }
                    window.AppData.restriccionSaltos = 'Zona Cerrada';
                    window.AppData.zonaCerradaMotivo = selectedReason;
                    lastRestrictionVal = 'Zona Cerrada';
                    updateManifestRestrictionStyle('Zona Cerrada');
                    if (window.saveAppData) window.saveAppData();
                } else {
                    window.AppData.restriccionSaltos = newVal;
                    window.AppData.zonaCerradaMotivo = '';
                    lastRestrictionVal = newVal;
                    updateManifestRestrictionStyle(newVal);
                    if (window.saveAppData) window.saveAppData();
                }
            });

            if (btnChangeClosedReason) {
                btnChangeClosedReason.addEventListener('click', async () => {
                    const selectedReason = await openClosedZoneReasonModal(window.AppData.zonaCerradaMotivo);
                    if (selectedReason) {
                        window.AppData.zonaCerradaMotivo = selectedReason;
                        updateManifestRestrictionStyle('Zona Cerrada');
                        if (window.saveAppData) window.saveAppData();
                    }
                });
            }
        }

        // ==========================================
        // 2. PONCHERA Dropdown con Cantidad Múltiple (Req #5)
        // Un instructor puede deber/pagar más de una ponchera
        // ==========================================
        function normalizePoncheraList(rawList) {
            if (!Array.isArray(rawList)) return [];
            const map = new Map();
            rawList.forEach(item => {
                if (typeof item === 'string' && item.trim()) {
                    const n = item.trim();
                    map.set(n, (map.get(n) || 0) + 1);
                } else if (item && typeof item === 'object' && item.name) {
                    const n = String(item.name).trim();
                    const c = Math.max(1, parseInt(item.count, 10) || 1);
                    if (n) map.set(n, (map.get(n) || 0) + c);
                }
            });
            return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
        }

        window.AppData.ponchera = normalizePoncheraList(window.AppData.ponchera);
        const poncheraBtn = document.getElementById('ponchera-dropdown-btn');
        const poncheraMenu = document.getElementById('ponchera-dropdown-menu');
        const poncheraLabel = document.getElementById('ponchera-selected-label');
        const poncheraBadges = document.getElementById('ponchera-badges-container');

        function getAllInstructorsForPonchera() {
            const emps = window.AppData.employees || [];
            const canonicalMap = new Map();

            emps
                .filter(e => window.isAssignableCameraInstructor
                    ? window.isAssignableCameraInstructor(e)
                    : (e.role && (e.role.includes('Instructor') || e.role === 'S&TA' || e.role.includes('Camara') || e.role.includes('Tandem'))))
                .forEach(e => {
                    const fullName = (String(e.name || '') + (e.lastname ? ' ' + String(e.lastname) : '')).replace(/\s+/g, ' ').trim();
                    if (!fullName) return;
                    const key = fullName.toLowerCase();
                    if (!canonicalMap.has(key)) {
                        canonicalMap.set(key, fullName);
                    }
                });

            // Reconciliar si existe un registro en ponchera guardado solo con el primer nombre de un instructor ya listado
            if (Array.isArray(window.AppData.ponchera) && canonicalMap.size > 0) {
                const canonList = Array.from(canonicalMap.values());
                window.AppData.ponchera.forEach(item => {
                    if (!item || !item.name) return;
                    const low = item.name.trim().toLowerCase();
                    if (!canonicalMap.has(low)) {
                        const matched = canonList.find(fn => fn.toLowerCase().startsWith(low + ' '));
                        if (matched) {
                            item.name = matched;
                        }
                    }
                });
                window.AppData.ponchera = normalizePoncheraList(window.AppData.ponchera);
            }

            return Array.from(canonicalMap.values()).sort((a, b) => a.localeCompare(b));
        }

        function setInstructorPoncheraCount(instName, newCount) {
            let list = normalizePoncheraList(window.AppData.ponchera);
            const idx = list.findIndex(x => x.name === instName);
            if (newCount <= 0) {
                if (idx !== -1) list.splice(idx, 1);
            } else {
                if (idx !== -1) list[idx].count = newCount;
                else list.push({ name: instName, count: newCount });
            }
            window.AppData.ponchera = list;
            if (window.saveAppData) window.saveAppData();
            renderPoncheraUI();
        }

        function renderPoncheraUI() {
            if (!poncheraMenu || !poncheraLabel || !poncheraBadges) return;
            window.AppData.ponchera = normalizePoncheraList(window.AppData.ponchera);
            const selected = window.AppData.ponchera;
            const allInst = getAllInstructorsForPonchera();

            if (selected.length === 0) {
                poncheraLabel.textContent = 'Ningún instructor seleccionado';
                poncheraLabel.style.color = 'var(--text-secondary)';
            } else {
                poncheraLabel.textContent = selected.map(x => `${x.name} (x${x.count})`).join(', ');
                poncheraLabel.style.color = 'var(--text-primary)';
                poncheraLabel.style.fontWeight = '700';
            }

            // Render Badges with quantity and +/- controls
            poncheraBadges.innerHTML = selected.map(item => `
                <span style="display: inline-flex; align-items: center; gap: 0.45rem; background: rgba(245, 158, 11, 0.15); border: 1px solid #f59e0b; color: #f59e0b; padding: 0.3rem 0.65rem; border-radius: 20px; font-weight: 700; font-size: 0.84rem;">
                    <i class="fas fa-beer"></i>
                    <span>${escapeHTML(item.name)}</span>
                    <span style="background: #f59e0b; color: #051017; padding: 1px 7px; border-radius: 12px; font-weight: 900; font-size: 0.78rem;">x${item.count}</span>
                    <button type="button" class="btn-dec-ponchera-badge" data-name="${escapeHTML(item.name)}" title="Restar 1 ponchera" style="width: 20px; height: 20px; border-radius: 50%; background: rgba(245, 158, 11, 0.25); color: #f59e0b; display: inline-flex; align-items: center; justify-content: center; font-size: 0.7rem; cursor: pointer;"><i class="fas fa-minus"></i></button>
                    <button type="button" class="btn-inc-ponchera-badge" data-name="${escapeHTML(item.name)}" title="Sumar 1 ponchera" style="width: 20px; height: 20px; border-radius: 50%; background: rgba(245, 158, 11, 0.25); color: #f59e0b; display: inline-flex; align-items: center; justify-content: center; font-size: 0.7rem; cursor: pointer;"><i class="fas fa-plus"></i></button>
                    <button type="button" class="btn-remove-ponchera" data-name="${escapeHTML(item.name)}" title="Quitar todas" style="color: var(--brand-danger); font-size: 0.9rem; margin-left: 2px; cursor: pointer;"><i class="fas fa-times-circle"></i></button>
                </span>
            `).join('');

            poncheraBadges.querySelectorAll('.btn-dec-ponchera-badge').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const name = e.currentTarget.getAttribute('data-name');
                    const entry = selected.find(x => x.name === name);
                    setInstructorPoncheraCount(name, (entry ? entry.count : 1) - 1);
                });
            });
            poncheraBadges.querySelectorAll('.btn-inc-ponchera-badge').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const name = e.currentTarget.getAttribute('data-name');
                    const entry = selected.find(x => x.name === name);
                    setInstructorPoncheraCount(name, (entry ? entry.count : 0) + 1);
                });
            });
            poncheraBadges.querySelectorAll('.btn-remove-ponchera').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const nameToRem = e.currentTarget.getAttribute('data-name');
                    setInstructorPoncheraCount(nameToRem, 0);
                });
            });

            // Render Dropdown Menu Items with Checkbox + Stepper (- / count / +)
            if (allInst.length === 0) {
                poncheraMenu.innerHTML = `<div style="padding: 0.75rem; color: var(--text-secondary); font-size: 0.85rem; text-align: center;">No hay instructores registrados en RRHH.</div>`;
            } else {
                poncheraMenu.innerHTML = allInst.map(name => {
                    const entry = selected.find(x => x.name === name);
                    const count = entry ? entry.count : 0;
                    const isChecked = count > 0 ? 'checked' : '';
                    return `
                        <div class="multi-dropdown-item" style="justify-content: space-between; cursor: default;">
                            <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; flex: 1; margin: 0;">
                                <input type="checkbox" class="chk-ponchera-inst" value="${escapeHTML(name)}" ${isChecked}>
                                <span style="font-weight: ${count > 0 ? '700' : '500'}; color: ${count > 0 ? '#f59e0b' : 'var(--text-primary)'};">${escapeHTML(name)}</span>
                            </label>
                            <div style="display: inline-flex; align-items: center; gap: 0.35rem;">
                                <button type="button" class="btn-step-ponchera" data-action="dec" data-name="${escapeHTML(name)}" style="width: 24px; height: 24px; border-radius: 6px; background: var(--bg-surface-hover); border: 1px solid var(--border-color); color: var(--text-primary); font-weight: bold; display: inline-flex; align-items: center; justify-content: center;">-</button>
                                <span style="min-width: 26px; text-align: center; font-weight: 800; font-size: 0.88rem; color: ${count > 0 ? '#f59e0b' : 'var(--text-secondary)'};">${count}</span>
                                <button type="button" class="btn-step-ponchera" data-action="inc" data-name="${escapeHTML(name)}" style="width: 24px; height: 24px; border-radius: 6px; background: rgba(245, 158, 11, 0.2); border: 1px solid #f59e0b; color: #f59e0b; font-weight: bold; display: inline-flex; align-items: center; justify-content: center;">+</button>
                            </div>
                        </div>
                    `;
                }).join('');

                poncheraMenu.querySelectorAll('.chk-ponchera-inst').forEach(chk => {
                    chk.addEventListener('change', (e) => {
                        const val = e.target.value;
                        const entry = selected.find(x => x.name === val);
                        if (e.target.checked) {
                            setInstructorPoncheraCount(val, entry ? entry.count : 1);
                        } else {
                            setInstructorPoncheraCount(val, 0);
                        }
                    });
                });

                poncheraMenu.querySelectorAll('.btn-step-ponchera').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const name = e.currentTarget.getAttribute('data-name');
                        const action = e.currentTarget.getAttribute('data-action');
                        const entry = selected.find(x => x.name === name);
                        const curr = entry ? entry.count : 0;
                        const next = action === 'inc' ? curr + 1 : Math.max(0, curr - 1);
                        setInstructorPoncheraCount(name, next);
                    });
                });
            }
        }

        if (poncheraBtn && poncheraMenu) {
            poncheraBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                poncheraMenu.classList.toggle('open');
            });
            document.addEventListener('click', (e) => {
                const wrapper = document.getElementById('ponchera-dropdown');
                if (wrapper && !wrapper.contains(e.target)) {
                    poncheraMenu.classList.remove('open');
                }
            });
        }

        renderPoncheraUI();

        // ==========================================
        // Helpers de Autorización de Administrador (Waiver Pendiente)
        // ==========================================
        function getCurrentSessionUser() {
            try {
                const raw = sessionStorage.getItem('fraterno_user');
                return raw ? JSON.parse(raw) : null;
            } catch (e) {
                return null;
            }
        }

        function isAdminRoleString(roleStr) {
            const r = String(roleStr || '').trim().toLowerCase();
            return r === 'admin' || r === 'administrador' || r === 'superadmin' || r.includes('admin');
        }

        function isCurrentUserAdmin() {
            const user = getCurrentSessionUser();
            if (user) {
                const uname = String(user.username || '').trim().toLowerCase();
                if (uname === 'admin01' || user.id === 'usr_admin') return true;
                if (user.role !== undefined && user.role !== null && String(user.role).trim() !== '') {
                    return isAdminRoleString(user.role);
                }
            }
            return (sessionStorage.getItem('fraterno_role') || '') === 'admin';
        }

        function findAuthorizingAdminByPassword(pwd) {
            if (!pwd) return null;
            const users = (window.AppData && Array.isArray(window.AppData.users)) ? window.AppData.users : [];
            const admins = users.filter(u => u && (
                isAdminRoleString(u.role)
                || String(u.username || '').trim().toLowerCase() === 'admin01'
                || u.id === 'usr_admin'
            ));
            const matched = admins.find(u => u.password !== undefined && String(u.password) === String(pwd));
            if (matched) return matched;
            if (admins.length === 0 && String(pwd) === '01Fraterno*') {
                return { id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador' };
            }
            return null;
        }

        function needsWaiverAuthorization(p) {
            return Boolean(p && !p.waiverSigned && !p.waiverAdminAuthorized);
        }

        function markPassengersWaiverAuthorized(paxList, adminUser) {
            const authBy = (adminUser && (adminUser.name || adminUser.username)) || 'Administrador';
            const authAt = new Date().toISOString();
            paxList.forEach(p => {
                p.waiverAdminAuthorized = true;
                p.waiverAuthorizedBy = authBy;
                p.waiverAuthorizedAt = authAt;
            });
            if (window.saveAppData) window.saveAppData();
        }

        async function authorizePendingWaiverPassengers(pendingPax) {
            if (!Array.isArray(pendingPax) || pendingPax.length === 0) return true;

            if (isCurrentUserAdmin()) {
                markPassengersWaiverAuthorized(pendingPax, getCurrentSessionUser());
                return true;
            }

            const names = pendingPax.map(p => p.name).join(', ');
            const promptMsg = `Faltan pasajeros por firmar (Waiver):\n${names}\n\nÚnicamente un Administrador puede autorizar este cambio de estado. Ingresa la contraseña de algún Administrador para autorizar:`;
            const enteredPwd = window.showPrompt
                ? await window.showPrompt(promptMsg, {
                    title: 'Autorización de Administrador (Waiver Pendiente)',
                    inputType: 'password',
                    placeholder: 'Contraseña de Administrador...',
                    confirmText: 'Autorizar Cambio',
                    cancelText: 'Cancelar'
                })
                : prompt(promptMsg);

            if (enteredPwd === null) return false;

            const authAdmin = findAuthorizingAdminByPassword(enteredPwd);
            if (!authAdmin) {
                const errMsg = 'Contraseña de Administrador incorrecta. No se autorizó el cambio de estado.';
                if (window.showAlert) {
                    await window.showAlert(errMsg, { title: 'Autorización Denegada', type: 'danger' });
                } else {
                    alert(errMsg);
                }
                return false;
            }

            markPassengersWaiverAuthorized(pendingPax, authAdmin);
            return true;
        }

        function renderBoard() {
            board.innerHTML = '';
            
            if (!window.AppData || !window.AppData.passengers) return;

            const selectedDate = dateFilter.value;
            const vuelosMap = new Map();

            window.AppData.passengers.forEach(pax => {
                if (pax.date !== selectedDate) return;
                if (!pax.aeronave || pax.aeronave === 'Sin asignar') return;
                if (pax.paxStatus !== 'Check-in Listo') return; 
                if (pax.flightStatus === 'Cancelado / Cancelled' || pax.flightStatus === 'Completado') return;

                const vNum = pax.vueloNum || pax.time;
                const flightKey = `${pax.aeronave}_${vNum}`;
                
                if (!vuelosMap.has(flightKey)) {
                    vuelosMap.set(flightKey, {
                        aeronave: pax.aeronave,
                        vueloNum: vNum,
                        time: pax.time,
                        status: pax.flightStatus || 'Programado',
                        passengers: []
                    });
                }
                
                vuelosMap.get(flightKey).passengers.push(pax);
            });

            if (vuelosMap.size === 0) {
                board.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 4rem; background: var(--bg-surface-hover); border-radius: 12px; color: var(--text-secondary);">
                        <div style="width: 80px; height: 80px; background: rgba(0,0,0,0.05); border-radius: 50%; display: flex; justify-content: center; align-items: center; margin: 0 auto 1.5rem auto;">
                            <i class="fas fa-plane-slash" style="font-size: 2.5rem; color: var(--brand-action); opacity: 0.7;"></i>
                        </div>
                        <h3 style="margin-top: 0; color: var(--text-primary);">Manifiesto Vacío</h3>
                        <p style="max-width: 400px; margin: 0 auto;">No hay vuelos configurados o listos. Ve al módulo Check-in y asigna a los pasajeros una Aeronave y Hora de Vuelo.</p>
                    </div>
                `;
                return;
            }

            Array.from(vuelosMap.values())
            .sort((a,b) => (a.time || '').localeCompare(b.time || ''))
            .forEach(vuelo => {
                const card = document.createElement('div');
                card.className = 'card';
                card.style.display = 'flex';
                card.style.flexDirection = 'column';
                card.style.borderTop = '4px solid var(--brand-action)';
                card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                
                let totalWeight = 0;
                let paxHtml = '';
                
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

                vuelo.passengers.forEach(p => {
                    const badgeClass = p.type.toLowerCase().includes('tandem') ? 'var(--brand-action)' : 'var(--brand-success)';
                    const capHtml = p.capitan && p.capitan !== 'Sin asignar' ? `<span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-user-astronaut"></i> ${p.capitan}</span>` : '';
                    
                    const w = parseFloat(p.weight) || 0;
                    totalWeight += w;

                    const waiverHtml = !p.waiverSigned
                        ? (p.waiverAdminAuthorized
                            ? `<span style="color: var(--brand-success); margin-left: 5px; font-size: 0.78rem; font-weight: 700;" title="Waiver pendiente - Autorizado por Administrador (${escapeHTML(p.waiverAuthorizedBy || 'Admin')})"><i class="fas fa-user-shield"></i> Autorizado</span>`
                            : `<span style="color: var(--brand-danger); margin-left: 5px; font-size: 1.1rem;" title="Sin firma (Waiver) - Requiere autorización de Administrador"><i class="fas fa-exclamation-triangle"></i></span>`)
                        : '';
                    const medHtml = (p.medicalCondition && p.medicalCondition.trim() !== '' && p.medicalCondition !== 'Ninguna') ? `<span style="color: var(--brand-danger); margin-left: 5px; font-size: 1.1rem;" title="Condición Médica: ${escapeHTML(p.medicalCondition)}"><i class="fas fa-heartbeat"></i></span>` : '';
                    const minorHtml = isPaxMinor(p) ? `<span style="color: #F97316; margin-left: 5px; font-size: 1.1rem;" title="Menor de Edad"><i class="fas fa-child"></i></span>` : '';

                    paxHtml += `
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color);">
                            <div style="display: flex; flex-direction: column;">
                                <span style="font-weight: 500; font-size: 0.9rem;">${escapeHTML(p.name)} ${waiverHtml} ${medHtml} ${minorHtml} ${capHtml}</span>
                                ${p.instructor && p.instructor !== 'Sin asignar' ? `<span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-user-tie"></i> Inst: ${escapeHTML(p.instructor)}</span>` : ''}
                            </div>
                            <span style="font-size: 0.7rem; background: ${badgeClass}; color: white; padding: 2px 6px; border-radius: 12px; font-weight: bold;">${escapeHTML(p.type)}</span>
                        </div>
                    `;
                });

                const capitanName = vuelo.passengers[0].capitan || 'Sin asignar';
                let instHtml = '';
                const insts = Array.from(new Set(vuelo.passengers.map(p => p.instructor).filter(i => i && i !== 'Sin asignar')));
                if (insts.length > 0) {
                    instHtml = `<i class="fas fa-user-tie" style="color: var(--text-secondary)"></i> <span style="font-size: 0.85rem;">Instructores: <strong>${escapeHTML(insts.join(", "))}</strong></span>`;
                }

                const isDespego = (vuelo.status === 'En El Aire' || vuelo.status === 'Paracaidistas en el aire');

                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 1rem;">
                        <div>
                            <h3 style="margin: 0; color: var(--brand-action); font-size: 1.3rem;"><i class="fas fa-plane"></i> ${vuelo.aeronave}</h3>
                            <div style="font-size: 0.95rem; font-weight: bold; margin-top: 0.2rem; color: var(--text-primary);">Vuelo: ${vuelo.vueloNum}</div>
                            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 0.2rem;">Estado: ${vuelo.status}</div>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-weight: bold; font-size: 1.4rem; display: block; color: var(--brand-blue);">${vuelo.time}</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1rem; background: var(--bg-surface-hover); padding: 0.75rem; border-radius: 8px;">
                        <strong style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Tripulación</strong>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <i class="fas fa-user-astronaut" style="color: var(--text-secondary)"></i> <span style="font-size: 0.9rem;">Capitán: <strong>${escapeHTML(capitanName)}</strong></span>
                        </div>
                        <div>
                            ${instHtml || '<span style="font-size: 0.8rem; color: var(--text-secondary);">Sin instructores asignados</span>'}
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed rgba(255,255,255,0.1);">
                            <i class="fas fa-weight-hanging" style="color: var(--brand-warning)"></i> <span style="font-size: 0.9rem;">Peso Estimado: <strong style="color: var(--text-primary);">${totalWeight} Kg</strong></span>
                        </div>
                    </div>

                    <div style="margin-bottom: 1.5rem; flex: 1;">
                        <strong style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Pasajeros (${vuelo.passengers.length})</strong>
                        ${paxHtml}
                    </div>

                    <div style="display: flex; gap: 0.5rem; align-items: center; margin-top: auto; background: rgba(0,0,0,0.02); padding: 0.5rem; border-radius: 6px;">
                        <span style="font-weight: 600; font-size: 0.85rem; color: var(--text-secondary);">Estado:</span>
                        <select class="form-control flight-status-select" data-key="${vuelo.aeronave}_${vuelo.vueloNum}" style="flex: 1; font-weight: 600; ${isDespego ? 'background: var(--brand-success); color: white; border-color: var(--brand-success);' : ''}">
                            <option value="Programado" ${vuelo.status==='Programado'?'selected':''}>Programado</option>
                            <option value="En Espera" ${vuelo.status==='En Espera'?'selected':''}>1. En Espera</option>
                            <option value="Abordando" ${vuelo.status==='Abordando'?'selected':''}>2. Abordando</option>
                            <option value="En El Aire" ${vuelo.status==='En El Aire'?'selected':''}>3. En El Aire</option>
                            <option value="Paracaidistas en el aire" ${vuelo.status==='Paracaidistas en el aire'?'selected':''}>4. Paracaidistas en el aire</option>
                            <option value="Aterrizó" ${vuelo.status==='Aterrizó'?'selected':''}>5. Aterrizó</option>
                        </select>
                    </div>
                `;

                const selectStatus = card.querySelector('.flight-status-select');
                const currentStatus = vuelo.status;

                selectStatus.addEventListener('change', async (e) => {
                    const newState = e.target.value;
                    const isAdmin = isCurrentUserAdmin();

                    if (currentStatus === 'Aterrizó' && !isAdmin) {
                        alert('Acceso Denegado: Solo un administrador puede cambiar el estado de un vuelo que ya ha aterrizado.');
                        e.target.value = currentStatus;
                        return;
                    }

                    // Verificar pasajeros sin firma (Waiver) que aún no tengan autorización previa de administrador
                    const unsignedPendingPax = vuelo.passengers.filter(needsWaiverAuthorization);
                    if (unsignedPendingPax.length > 0) {
                        if (!isAdmin) {
                            e.target.value = currentStatus; // Mantener estado visual previo mientras se valida contraseña
                        }
                        const authorized = await authorizePendingWaiverPassengers(unsignedPendingPax);
                        if (!authorized) {
                            e.target.value = currentStatus;
                            return;
                        }
                    }

                    if (newState === 'En El Aire') {
                        e.target.value = currentStatus; // Revert visually while modal is open
                        openChecklistModal(vuelo, e.target);
                        return;
                    }

                    saveFlightState(vuelo.passengers, newState);
                });

                board.appendChild(card);
            });
        }

        function saveFlightState(paxList, newState) {
            paxList.forEach(p => { 
                p.flightStatus = newState;
                if (newState === 'Aterrizó') {
                    if (!p.landedAt) {
                        p.landedAt = Date.now();
                        // Deduct usage from assigned Rig if applicable
                        if (p.rigId && window.AppData.tandemRigs) {
                            const rig = window.AppData.tandemRigs.find(r => r.id === p.rigId);
                            if (rig) {
                                rig.totalJumps = (rig.totalJumps || 0) + 1;
                                Object.keys(rig.parts).forEach(partKey => {
                                    if (rig.parts[partKey]) {
                                        rig.parts[partKey].currentJumps = (rig.parts[partKey].currentJumps || 0) + 1;
                                    }
                                });
                            }
                        }
                    }
                } else {
                    delete p.landedAt;
                }
            });
            if (window.saveAppData) window.saveAppData();
            renderBoard();
        }

        let pendingFlight = null;
        let pendingSelect = null;
        let currentModalPax = []; // Keep track of passengers currently in the modal list

        const modalChecklist = document.getElementById('modal-checklist');
        const modalContent = modalChecklist.querySelector('.modal-content');
        const list = document.getElementById('chk-pax-list');
        const selectAddPax = document.getElementById('chk-add-pax-select');

        function openChecklistModal(vuelo, selectElem) {
            pendingFlight = vuelo;
            pendingSelect = selectElem;
            currentModalPax = [...vuelo.passengers]; // copy the array
            
            document.getElementById('chk-aeronave').textContent = vuelo.aeronave + ' - ' + vuelo.vueloNum;
            
            renderModalPaxList();
            populateAddPaxDropdown();
            
            modalChecklist.style.display = 'flex';
            void modalChecklist.offsetWidth;
            modalChecklist.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
        }

        function renderModalPaxList() {
            list.innerHTML = '';
            
            if (currentModalPax.length === 0) {
                list.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-secondary);">El vuelo no tiene pasajeros actualmente.</div>';
                document.getElementById('btn-confirm-chk').disabled = false;
                document.getElementById('btn-confirm-chk').style.opacity = '1';
                return;
            }

            let hasMissingWaiver = false;

            currentModalPax.forEach(p => {
                const item = document.createElement('label');
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.justifyContent = 'space-between';
                item.style.padding = '0.75rem';
                item.style.border = '1px solid var(--border-color)';
                item.style.borderRadius = '6px';
                item.style.cursor = 'pointer';
                item.style.transition = 'background 0.2s';
                
                item.onmouseover = () => item.style.background = 'var(--bg-surface-hover)';
                item.onmouseout = () => item.style.background = 'transparent';
                
                const instName = p.instructor && p.instructor !== 'Sin asignar' ? ` <span style="color:var(--text-secondary); font-size:0.8rem;"><i class="fas fa-user-tie"></i> ${p.instructor}</span>` : '';
                
                let waiverAlert = '';
                if (!p.waiverSigned) {
                    if (p.waiverAdminAuthorized) {
                        waiverAlert = `<div style="font-size: 0.8rem; color: var(--brand-success); font-weight: bold; margin-top: 4px;"><i class="fas fa-user-shield"></i> Waiver pendiente — Autorizado por ${escapeHTML(p.waiverAuthorizedBy || 'Administrador')}</div>`;
                    } else {
                        hasMissingWaiver = true;
                        waiverAlert = `<div style="font-size: 0.8rem; color: var(--brand-danger); font-weight: bold; margin-top: 4px;"><i class="fas fa-exclamation-triangle"></i> Faltan Firmas (Waiver) — Requiere autorización de Administrador</div>`;
                    }
                }
                
                item.innerHTML = `
                    <div style="display: flex; flex-direction: column;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <input type="checkbox" class="chk-pax-item" value="${p.id}" checked style="width: 20px; height: 20px; accent-color: var(--brand-action); cursor: pointer;">
                            <span style="font-weight: 600; font-size: 1rem;">${escapeHTML(p.name)}${instName}</span>
                        </div>
                        ${waiverAlert}
                    </div>
                    <span style="font-size: 0.75rem; background: var(--bg-surface-hover); padding: 4px 8px; border-radius: 12px; font-weight: bold; color: var(--text-secondary);">${escapeHTML(p.type)}</span>
                `;
                list.appendChild(item);
            });

            const btnConfirm = document.getElementById('btn-confirm-chk');
            btnConfirm.disabled = false;
            btnConfirm.style.opacity = '1';
            btnConfirm.style.cursor = 'pointer';
            if (hasMissingWaiver) {
                btnConfirm.innerHTML = isCurrentUserAdmin()
                    ? '<i class="fas fa-user-shield"></i> Autorizar y Confirmar Despegue'
                    : '<i class="fas fa-lock"></i> Autorizar con Admin y Despegar';
            } else {
                btnConfirm.innerHTML = '<i class="fas fa-plane-departure"></i> Confirmar Despegue';
            }
        }

        function populateAddPaxDropdown() {
            selectAddPax.innerHTML = '<option value="">Selecciona un pasajero...</option>';
            
            // Find pax who are Check-in Listo but DO NOT have an aircraft (Sin asignar)
            const availablePax = window.AppData.passengers.filter(p => 
                p.paxStatus === 'Check-in Listo' && 
                (p.flightStatus !== 'Completado' && p.flightStatus !== 'Cancelado / Cancelled') &&
                (!p.aeronave || p.aeronave === 'Sin asignar') &&
                !currentModalPax.find(cp => cp.id === p.id) // Not already in the modal list
            );

            availablePax.forEach(p => {
                selectAddPax.innerHTML += `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} (${escapeHTML(p.type)})</option>`;
            });
        }

        // Add passenger dynamically
        document.getElementById('btn-add-pax').addEventListener('click', () => {
            const paxId = selectAddPax.value;
            if (!paxId) return;

            const paxToAdd = window.AppData.passengers.find(p => p.id === paxId);
            if (paxToAdd) {
                // Update their data dynamically for this flight
                paxToAdd.aeronave = pendingFlight.aeronave;
                paxToAdd.vueloNum = pendingFlight.vueloNum;
                paxToAdd.time = pendingFlight.time;
                paxToAdd.capitan = pendingFlight.passengers[0]?.capitan || 'Sin asignar';
                
                currentModalPax.push(paxToAdd);
                renderModalPaxList();
                populateAddPaxDropdown();
            }
        });

        function closeChecklistModal() {
            modalChecklist.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            setTimeout(() => { modalChecklist.style.display = 'none'; }, 300);
            pendingFlight = null;
            pendingSelect = null;
            currentModalPax = [];
        }

        document.getElementById('btn-cancel-chk').addEventListener('click', closeChecklistModal);
        document.getElementById('btn-cancel-chk-top').addEventListener('click', closeChecklistModal);

        document.getElementById('btn-confirm-chk').addEventListener('click', async () => {
            if (!pendingFlight) return;
            
            const checkedIds = Array.from(list.querySelectorAll('.chk-pax-item:checked')).map(cb => cb.value);

            // Si algún pasajero marcado (ej. agregado manualmente en el modal) aún requiere autorización por Waiver pendiente
            const checkedPendingWaiver = currentModalPax.filter(p => checkedIds.includes(p.id) && needsWaiverAuthorization(p));
            if (checkedPendingWaiver.length > 0) {
                const authorized = await authorizePendingWaiverPassengers(checkedPendingWaiver);
                if (!authorized) return;
            }
            
            // Remove unchecked passengers
            currentModalPax.forEach(p => {
                if (!checkedIds.includes(p.id)) {
                    // They were unchecked! Expel them from flight.
                    p.aeronave = 'Sin asignar';
                    p.vueloNum = '';
                    p.time = '';
                    p.flightStatus = 'En Espera'; 
                } else {
                    // They are checked, confirm state
                    p.flightStatus = 'En El Aire';
                }
            });

            if (window.saveAppData) window.saveAppData();
            closeChecklistModal();
            renderBoard();
        });

        renderBoard();
        
        dateFilter.addEventListener('change', renderBoard);
    }
};
