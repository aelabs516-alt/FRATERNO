window.Modules = window.Modules || {};
window.Modules.manifest = {
    render: (container) => {
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2>Manifiesto Operativo (Despegues)</h2>
                <div style="display: flex; gap: 1rem; align-items: center;">
                    <input type="date" id="manifest-date-filter" class="form-control" style="width: 200px; background: var(--bg-main);">
                    <button class="btn btn-primary" onclick="window.location.reload()"><i class="fas fa-sync-alt"></i> Refrescar Tablero</button>
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
        
        // Initialize date filter to today
        const todayStr = new Date().toLocaleDateString('en-CA');
        dateFilter.value = todayStr;

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

                    const waiverHtml = !p.waiverSigned ? `<span style="color: var(--brand-danger); margin-left: 5px; font-size: 1.1rem;" title="Sin firma (Waiver)"><i class="fas fa-exclamation-triangle"></i></span>` : '';
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

                selectStatus.addEventListener('change', (e) => {
                    const newState = e.target.value;
                    const role = sessionStorage.getItem('fraterno_role') || 'ventas';
                    
                    const unsignedPax = vuelo.passengers.filter(p => !p.waiverSigned);
                    if (unsignedPax.length > 0) {
                        const names = unsignedPax.map(p => p.name).join(', ');
                        alert(`No se puede cambiar el estado del vuelo.\nFaltan pasajeros por firmar (Waiver):\n\n${names}`);
                        e.target.value = currentStatus;
                        return;
                    }
                    
                    if (currentStatus === 'Aterrizó' && role !== 'admin') {
                        alert('Acceso Denegado: Solo un administrador puede cambiar el estado de un vuelo que ya ha aterrizado.');
                        e.target.value = currentStatus;
                        return;
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
                    hasMissingWaiver = true;
                    waiverAlert = `<div style="font-size: 0.8rem; color: var(--brand-danger); font-weight: bold; margin-top: 4px;"><i class="fas fa-exclamation-triangle"></i> Faltan Firmas (Waiver)</div>`;
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
            if (hasMissingWaiver) {
                btnConfirm.disabled = true;
                btnConfirm.style.opacity = '0.5';
                btnConfirm.style.cursor = 'not-allowed';
                btnConfirm.innerHTML = '<i class="fas fa-ban"></i> Faltan Firmas';
            } else {
                btnConfirm.disabled = false;
                btnConfirm.style.opacity = '1';
                btnConfirm.style.cursor = 'pointer';
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

        document.getElementById('btn-confirm-chk').addEventListener('click', () => {
            if (!pendingFlight) return;
            
            const checkedIds = Array.from(list.querySelectorAll('.chk-pax-item:checked')).map(cb => cb.value);
            
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
