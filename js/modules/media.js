window.Modules = window.Modules || {};
window.Modules.media = {
    render: (container) => {
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2 style="margin-bottom: 0.5rem;"><i class="fas fa-video" style="color: var(--brand-action);"></i> Reporte de Videografía (Adicionales)</h2>
                    <p style="color: var(--text-secondary); margin: 0;">Gestión y entrega de material videográfico a pasajeros.</p>
                </div>
            </div>

            <div class="card" style="margin-bottom: 1.5rem;">
                <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: flex-end;">
                    <div class="form-group" style="margin: 0; min-width: 200px;">
                        <label>Filtro de Fecha</label>
                        <select id="media-filter-type" class="form-control">
                            <option value="today">Día (Hoy)</option>
                            <option value="week">Semana (Últimos 7 días)</option>
                            <option value="month">Mes (Actual)</option>
                            <option value="range">Rango de Fechas Específico</option>
                        </select>
                    </div>
                    <div class="form-group" id="media-range-container" style="display: none; margin: 0; gap: 1rem; flex: 1;">
                        <div style="display: flex; gap: 1rem; align-items: center;">
                            <div>
                                <label>Desde</label>
                                <input type="date" id="media-date-from" class="form-control">
                            </div>
                            <div>
                                <label>Hasta</label>
                                <input type="date" id="media-date-to" class="form-control">
                            </div>
                        </div>
                    </div>
                    
                    
                    <div style="margin-left: auto; display: flex; align-items: flex-end; gap: 1rem;">
                        <div class="form-group" style="margin: 0;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none; margin-bottom: 0; padding: 0.6rem 1rem; background: var(--bg-surface-hover); border-radius: 8px; border: 1px solid var(--border-color); height: 42px; box-sizing: border-box;">
                                <input type="checkbox" id="media-filter-pending" style="width: 18px; height: 18px; cursor: pointer; margin: 0;">
                                <span style="font-weight: 500;">Solo pendientes</span>
                            </label>
                        </div>
                        <div class="form-group" style="margin: 0;">
                            <label>Buscador</label>
                            <input type="text" id="media-search" class="form-control" placeholder="Buscar pasajero..." style="width: 250px; height: 42px; box-sizing: border-box;">
                        </div>
                    </div>


                </div>
            </div>

            <div class="card" style="padding: 0;">
                <div style="overflow-x: auto;">
                    <table class="table" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="background: var(--bg-surface-hover); border-bottom: 2px solid var(--border-color);">
                                <th style="padding: 1rem; text-align: left;">Fecha Salto</th>
                                <th style="padding: 1rem; text-align: left;">Nombre y Apellido</th>
                                <th style="padding: 1rem; text-align: left;">Documento</th>
                                <th style="padding: 1rem; text-align: left;">Adicionales (Cámaras)</th>
                                <th style="padding: 1rem; text-align: center;">Estado Envío</th>
                                <th style="padding: 1rem; text-align: left;">Detalles de Entrega</th>
                            </tr>
                        </thead>
                        <tbody id="media-tbody">
                            <!-- Injected rows -->
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Modal for Delivery Info -->
            <div id="media-delivery-modal" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
                <div class="modal-content card" style="width: 400px; max-width: 95%;">
                    <h3 style="margin-top: 0;">Confirmar Envío de Material</h3>
                    <p style="color: var(--text-secondary); font-size: 0.9rem;">Registre los datos de entrega del material.</p>
                    
                    <div class="form-group">
                        <label>Enviado Por (Nombre)</label>
                        <input type="text" id="media-sender" class="form-control" placeholder="Ej. Juan Pérez">
                    </div>
                    <div class="form-group">
                        <label>Medio de Envío</label>
                        <input type="text" id="media-method" class="form-control" placeholder="Ej. WhatsApp, Enlace Drive...">
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem;">
                        <button class="btn btn-outline" id="media-btn-cancel">Cancelar</button>
                        <button class="btn btn-primary" id="media-btn-confirm">Confirmar Envío</button>
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
        const filterType = document.getElementById('media-filter-type');
        const rangeContainer = document.getElementById('media-range-container');
        const dateFrom = document.getElementById('media-date-from');
        const dateTo = document.getElementById('media-date-to');
        const searchInput = document.getElementById('media-search');
        const chkPending = document.getElementById('media-filter-pending');
        const tbody = document.getElementById('media-tbody');

        const modal = document.getElementById('media-delivery-modal');
        const senderInput = document.getElementById('media-sender');
        const methodInput = document.getElementById('media-method');
        const btnCancel = document.getElementById('media-btn-cancel');
        const btnConfirm = document.getElementById('media-btn-confirm');

        let pendingPaxId = null;
        let pendingCheckbox = null;

        // Auto-fill dates
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const todayStr = `${yyyy}-${mm}-${dd}`;
        dateFrom.value = todayStr;
        dateTo.value = todayStr;

        function checkDateFilter(paxDate) {
            if (!paxDate) return false;
            const pd = new Date(paxDate + 'T00:00:00');
            const ft = filterType.value;
            const now = new Date();
            now.setHours(0,0,0,0);
            
            if (ft === 'today') {
                return paxDate === todayStr;
            } else if (ft === 'week') {
                const weekAgo = new Date(now);
                weekAgo.setDate(weekAgo.getDate() - 7);
                return pd >= weekAgo && pd <= now;
            } else if (ft === 'month') {
                return paxDate.startsWith(`${yyyy}-${mm}`);
            } else if (ft === 'range') {
                const from = dateFrom.value ? new Date(dateFrom.value + 'T00:00:00') : new Date('2000-01-01');
                const to = dateTo.value ? new Date(dateTo.value + 'T23:59:59') : new Date('2100-01-01');
                return pd >= from && pd <= to;
            }
            return false;
        }

        function renderTable() {
            tbody.innerHTML = '';
            const term = searchInput.value.toLowerCase();
            const showOnlyPending = chkPending.checked;
            const paxs = window.AppData.passengers || [];

            let filtered = paxs.filter(p => {
                if (p.paxStatus === 'Cancelado / Cancelled' || p.flightStatus === 'Cancelado / Cancelled') return false;
                // Only those with Adicionales (cams)
                if (!p.cams || p.cams === 'Sin cámaras' || p.cams === 'Ninguna') return false;
                
                if (!checkDateFilter(p.date)) return false;
                if (showOnlyPending && p.mediaDelivered) return false;

                const searchable = `${p.name} ${p.lastname} ${p.doc}`.toLowerCase();
                if (term && !searchable.includes(term)) return false;

                return true;
            });

            filtered.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

            if (filtered.length === 0) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No se encontraron pasajeros con adicionales en este rango.</td></tr>`;
                return;
            }

            filtered.forEach(pax => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                
                const mediaDelivered = pax.mediaDelivered || false;
                const deliveryDetails = pax.mediaDetails ? `<div style="font-size:0.85rem; color:var(--text-secondary);">Enviado por: <strong>${escapeHTML(pax.mediaDetails.sender)}</strong><br>Medio: <strong>${escapeHTML(pax.mediaDetails.method)}</strong><br>Fecha: ${escapeHTML(pax.mediaDetails.date)}</div>` : '<span style="color:var(--text-secondary); font-size:0.85rem;">Pendiente</span>';

                tr.innerHTML = `
                    <td style="padding: 1rem;">${pax.date}</td>
                    <td style="padding: 1rem; font-weight: 500;">${escapeHTML(pax.name)} ${escapeHTML(pax.lastname || "")}</td>
                    <td style="padding: 1rem;">${escapeHTML(pax.doc)}</td>
                    <td style="padding: 1rem;"><span style="background: var(--brand-blue-light); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.85rem;">${escapeHTML(pax.cams)}</span></td>
                    <td style="padding: 1rem; text-align: center;">
                        <label style="cursor:pointer;">
                            <input type="checkbox" class="chk-delivery" data-id="${pax.id}" style="width: 20px; height: 20px; cursor:pointer;" ${mediaDelivered ? 'checked' : ''}>
                        </label>
                    </td>
                    <td style="padding: 1rem;">${deliveryDetails}</td>
                `;
                tbody.appendChild(tr);
            });

            // Bind checkboxes
            document.querySelectorAll('.chk-delivery').forEach(chk => {
                chk.addEventListener('change', (e) => {
                    const isChecked = e.target.checked;
                    const paxId = e.target.getAttribute('data-id');
                    const paxObj = window.AppData.passengers.find(p => p.id === paxId);

                    if (isChecked) {
                        // Open modal to confirm delivery
                        pendingPaxId = paxId;
                        pendingCheckbox = e.target;
                        senderInput.value = '';
                        methodInput.value = '';
                        modal.style.display = 'flex';
                    } else {
                        // Unchecking requires Admin
                        const pwd = prompt('Ingrese clave de Administrador para revertir el estado de entrega:');
                        let isValid = false;
                        const adminUser = (window.AppData.users || []).find(u => (u.role === 'admin' || u.role === 'Administrador' || u.role === 'SuperAdmin'));
                        if (adminUser && adminUser.password === pwd) {
                            isValid = true;
                        } else if (!adminUser && pwd === 'admin123') {
                            isValid = true;
                        }
                        
                        if (isValid) {
                            paxObj.mediaDelivered = false;
                            paxObj.mediaDetails = null;
                            if (window.saveAppData) window.saveAppData();
                            renderTable();
                        } else {
                            e.target.checked = true; // revert
                            alert('Clave incorrecta. No se puede revertir.');
                        }
                    }
                });
            });
        }

        filterType.addEventListener('change', () => {
            if (filterType.value === 'range') {
                rangeContainer.style.display = 'flex';
            } else {
                rangeContainer.style.display = 'none';
            }
            renderTable();
        });

        dateFrom.addEventListener('change', renderTable);
        dateTo.addEventListener('change', renderTable);
        searchInput.addEventListener('input', renderTable);
        chkPending.addEventListener('change', renderTable);

        btnCancel.addEventListener('click', () => {
            if (pendingCheckbox) pendingCheckbox.checked = false; // revert
            modal.style.display = 'none';
            pendingPaxId = null;
            pendingCheckbox = null;
        });

        btnConfirm.addEventListener('click', () => {
            if (!senderInput.value.trim() || !methodInput.value.trim()) {
                alert('Por favor, complete ambos campos (Enviado Por y Medio de Envío).');
                return;
            }

            if (pendingPaxId) {
                const paxObj = window.AppData.passengers.find(p => p.id === pendingPaxId);
                if (paxObj) {
                    paxObj.mediaDelivered = true;
                    paxObj.mediaDetails = {
                        sender: senderInput.value.trim(),
                        method: methodInput.value.trim(),
                        date: new Date().toLocaleString('es-CO')
                    };
                    if (window.saveAppData) window.saveAppData();
                }
            }
            modal.style.display = 'none';
            pendingPaxId = null;
            pendingCheckbox = null;
            renderTable();
        });

        renderTable();
    }
};
