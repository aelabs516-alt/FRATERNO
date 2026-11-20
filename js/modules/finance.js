window.Modules = window.Modules || {};

window.Modules.finance = {
    render: (container) => {
        container.innerHTML = `
            <div class="finance-root" style="display: flex; flex-direction: column; height: 100%; gap: 1rem; padding-bottom: 1rem;">
                
                <!-- Header -->
                <div class="card finance-header" style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, var(--brand-success), #10b981); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                            <i class="fas fa-chart-pie"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; color: var(--text-primary);">Dashboard Financiero & Caja</h2>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Control de ingresos, egresos y cierres de caja diarios</p>
                        </div>
                    </div>
                    <div class="finance-header-actions" style="display: flex; gap: 1rem;">
                        <button class="btn btn-outline" id="btn-history-close" style="padding: 0 1.5rem;"><i class="fas fa-history"></i> Historial de Cierres</button>
                        <button class="btn btn-primary" id="btn-add-tx" style="padding: 0 1.5rem;"><i class="fas fa-plus"></i> Registrar Movimiento</button>
                    </div>
                </div>

                <!-- KPIs -->
                <div class="finance-kpis" style="display: flex; gap: 1rem;">
                    <div class="card" style="flex: 1; display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem; background: linear-gradient(145deg, var(--bg-main), var(--bg-surface-hover));">
                        <div style="width: 50px; height: 50px; background: rgba(16, 185, 129, 0.15); color: var(--brand-success); border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 1.5rem;"><i class="fas fa-arrow-down"></i></div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.8rem; color: var(--brand-success);" id="fin-income">$0</h3>
                            <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Ingresos Hoy</span>
                        </div>
                    </div>
                    <div class="card" style="flex: 1; display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem; background: linear-gradient(145deg, var(--bg-main), var(--bg-surface-hover));">
                        <div style="width: 50px; height: 50px; background: rgba(239, 68, 68, 0.15); color: var(--brand-danger); border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 1.5rem;"><i class="fas fa-arrow-up"></i></div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.8rem; color: var(--brand-danger);" id="fin-expense">$0</h3>
                            <span style="font-size: 0.85rem; color: var(--text-secondary); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Egresos Hoy</span>
                        </div>
                    </div>
                    <div class="card" style="flex: 1; display: flex; align-items: center; gap: 1.25rem; padding: 1.5rem; background: linear-gradient(145deg, var(--brand-blue), #3b82f6); color: white;">
                        <div style="width: 50px; height: 50px; background: rgba(255, 255, 255, 0.2); color: white; border-radius: 12px; display: flex; justify-content: center; align-items: center; font-size: 1.5rem;"><i class="fas fa-wallet"></i></div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.8rem;" id="fin-balance">$0</h3>
                            <span style="font-size: 0.85rem; opacity: 0.9; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Saldo Neto (Caja)</span>
                        </div>
                    </div>
                </div>

                <!-- Main Content (Charts and List) -->
                <div class="finance-main-split" style="display: flex; gap: 1.5rem; flex: 1; min-height: 0;">
                    
                    <!-- Breakdown (Left) -->
                    <div class="card" style="flex: 1; display: flex; flex-direction: column; min-width: 300px;">
                        <h3 style="margin-top: 0; margin-bottom: 1.5rem;"><i class="fas fa-chart-pie" style="color: var(--brand-action);"></i> Desglose de Ingresos (Hoy)</h3>
                        
                        <!-- Visual breakdown bars instead of canvas for simplicity & responsiveness -->
                        <div style="display: flex; flex-direction: column; gap: 1rem; flex: 1; justify-content: center;">
                            <div class="breakdown-item">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span style="font-weight: 600; color: var(--text-primary);">Saltos Tándem</span>
                                    <strong id="b-tandem">$0</strong>
                                </div>
                                <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                                    <div id="bar-tandem" style="width: 0%; height: 100%; background: var(--brand-blue); border-radius: 4px; transition: width 0.5s;"></div>
                                </div>
                            </div>

                            <div class="breakdown-item">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span style="font-weight: 600; color: var(--text-primary);">Saltos Deportivos</span>
                                    <strong id="b-fun">$0</strong>
                                </div>
                                <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                                    <div id="bar-fun" style="width: 0%; height: 100%; background: var(--brand-success); border-radius: 4px; transition: width 0.5s;"></div>
                                </div>
                            </div>

                            <div class="breakdown-item">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span style="font-weight: 600; color: var(--text-primary);">Servicios de Cámara</span>
                                    <strong id="b-cams">$0</strong>
                                </div>
                                <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                                    <div id="bar-cams" style="width: 0%; height: 100%; background: var(--brand-action); border-radius: 4px; transition: width 0.5s;"></div>
                                </div>
                            </div>
                            
                            <div class="breakdown-item">
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                                    <span style="font-weight: 600; color: var(--text-primary);">Extras / Otros</span>
                                    <strong id="b-other">$0</strong>
                                </div>
                                <div style="width: 100%; height: 8px; background: var(--border-color); border-radius: 4px; overflow: hidden;">
                                    <div id="bar-other" style="width: 0%; height: 100%; background: #9ca3af; border-radius: 4px; transition: width 0.5s;"></div>
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 2rem;">
                            <button class="btn" id="btn-close-cash" style="width: 100%; padding: 1rem; background: var(--brand-warning); color: var(--text-primary); font-weight: bold; font-size: 1.1rem; box-shadow: 0 4px 10px rgba(245, 158, 11, 0.3);"><i class="fas fa-lock"></i> Realizar Cierre de Caja (Hoy)</button>
                        </div>
                    </div>

                    <!-- Daily Ledger (Right) -->
                    <div class="card" style="flex: 2; display: flex; flex-direction: column; overflow: hidden;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                            <h3 style="margin: 0;"><i class="fas fa-list-ul"></i> Libro Diario (Transacciones de Hoy)</h3>
                        </div>
                        
                        <div style="flex: 1; overflow-y: auto;">
                            <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: left;">
                                <thead>
                                    <tr style="background: var(--bg-surface); border-bottom: 2px solid var(--border-color);">
                                        <th style="padding: 1rem;">Hora</th>
                                        <th style="padding: 1rem;">Tipo</th>
                                        <th style="padding: 1rem;">Categoría</th>
                                        <th style="padding: 1rem;">Concepto</th>
                                        <th style="padding: 1rem; text-align: right;">Monto</th>
                                        <th style="padding: 1rem; text-align: center;">Acción</th>
                                    </tr>
                                </thead>
                                <tbody id="fin-tx-list"></tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Modal for New Tx -->
            <div id="modal-tx" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 450px; max-width: 90%; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="close-tx-modal" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-exchange-alt" style="color: var(--brand-success);"></i> Nuevo Movimiento</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Tipo de Movimiento</label>
                            <select id="tx-type" class="form-control">
                                <option value="IN">Ingreso (+)</option>
                                <option value="OUT">Egreso (-)</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0;">
                            <label>Categoría</label>
                            <select id="tx-cat" class="form-control">
                                <option value="Tandem">Saltos Tándem</option>
                                <option value="Deportivo">Saltos Deportivos</option>
                                <option value="Camaras">Cámaras</option>
                                <option value="Otros">Otros / Extras</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Concepto / Detalle</label>
                        <input type="text" id="tx-desc" class="form-control" placeholder="Ej. Pago de gasolina, abono reserva...">
                    </div>

                    <div class="form-group" style="margin-bottom: 1.5rem;">
                        <label>Monto ($)</label>
                        <input type="text" id="tx-amount" class="form-control money-input" style="font-size: 1.5rem; font-weight: bold; color: var(--brand-success);" min="0" placeholder="0">
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-primary" id="btn-save-tx" style="padding: 0.75rem 2rem;"><i class="fas fa-save"></i> Guardar Movimiento</button>
                    </div>
                </div>
            </div>

            <!-- Modal for Closing History -->
            <div id="modal-history" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 800px; max-width: 95%; max-height: 90vh; display: flex; flex-direction: column; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="close-hist-modal" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; color: var(--text-primary); border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-history" style="color: var(--brand-blue);"></i> Historial de Cierres de Caja</h3>
                    
                    <div style="flex: 1; overflow-y: auto; margin-top: 1rem;">
                        <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr style="background: var(--bg-surface); border-bottom: 2px solid var(--border-color);">
                                    <th style="padding: 1rem;">Fecha</th>
                                    <th style="padding: 1rem;">Ingresos</th>
                                    <th style="padding: 1rem;">Egresos</th>
                                    <th style="padding: 1rem;">Saldo Neto</th>
                                    <th style="padding: 1rem;">Responsable</th>
                                </tr>
                            </thead>
                            <tbody id="hist-list"></tbody>
                        </table>
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
        window.AppData.pettyCash = window.AppData.pettyCash || [];
        window.AppData.cashClosings = window.AppData.cashClosings || [];

        const txList = document.getElementById('fin-tx-list');
        const lblIncome = document.getElementById('fin-income');
        const lblExpense = document.getElementById('fin-expense');
        const lblBalance = document.getElementById('fin-balance');
        
        // Breakdowns
        const bTandem = document.getElementById('b-tandem');
        const bFun = document.getElementById('b-fun');
        const bCams = document.getElementById('b-cams');
        const bOther = document.getElementById('b-other');
        
        const barTandem = document.getElementById('bar-tandem');
        const barFun = document.getElementById('bar-fun');
        const barCams = document.getElementById('bar-cams');
        const barOther = document.getElementById('bar-other');

        // Modals
        const modalTx = document.getElementById('modal-tx');
        const modalHistory = document.getElementById('modal-history');
        const mtxContent = modalTx.querySelector('.modal-content');
        const mhiContent = modalHistory.querySelector('.modal-content');

        const formatMoney = (val) => '$' + parseInt(val).toLocaleString('es-CO');

        function renderTransactions() {
            txList.innerHTML = '';
            const todayStr = new Date().toLocaleDateString('en-CA');
            const txsToday = window.AppData.pettyCash.filter(t => t.date === todayStr);
            
            let totalIn = 0, totalOut = 0;
            let sumTan = 0, sumFun = 0, sumCam = 0, sumOth = 0;

            if (txsToday.length === 0) {
                txList.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No hay movimientos registrados hoy.</td></tr>';
            } else {
                txsToday.sort((a,b) => b.time.localeCompare(a.time)).forEach(tx => {
                    const isIncome = tx.type === 'IN';
                    if (isIncome) {
                        totalIn += tx.amount;
                        if(tx.cat === 'Tandem') sumTan += tx.amount;
                        else if(tx.cat === 'Deportivo') sumFun += tx.amount;
                        else if(tx.cat === 'Camaras') sumCam += tx.amount;
                        else sumOth += tx.amount;
                    } else {
                        totalOut += tx.amount;
                    }

                    const color = isIncome ? 'var(--brand-success)' : 'var(--brand-danger)';
                    const bgCol = isIncome ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
                    const sign = isIncome ? '+' : '-';
                    
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid var(--border-color)';
                    tr.style.transition = 'background 0.2s';
                    tr.onmouseover = () => tr.style.background = 'var(--bg-surface-hover)';
                    tr.onmouseout = () => tr.style.background = 'transparent';
                    tr.innerHTML = `
                        <td style="padding: 1rem; color: var(--text-secondary);">${tx.time}</td>
                        <td style="padding: 1rem;">
                            <span style="background: ${bgCol}; color: ${color}; padding: 0.25rem 0.75rem; border-radius: 12px; font-weight: bold; font-size: 0.8rem;">
                                ${isIncome ? 'INGRESO' : 'EGRESO'}
                            </span>
                        </td>
                        <td style="padding: 1rem; font-size: 0.9rem;">${escapeHTML(tx.cat || "Otros")}</td>
                        <td style="padding: 1rem; font-weight: 500;">${escapeHTML(tx.desc)}</td>
                        <td style="padding: 1rem; text-align: right; font-weight: bold; color: ${color}; font-size: 1.1rem;">
                            ${sign}${formatMoney(tx.amount)}
                        </td>
                        <td style="padding: 1rem; text-align: center;">
                            <button class="btn-del-tx" data-id="${tx.id}" style="background:transparent; border:none; color:var(--text-secondary); cursor:pointer;"><i class="fas fa-trash hover-danger"></i></button>
                        </td>
                    `;
                    txList.appendChild(tr);
                });
            }

            // Update KPIs
            const net = totalIn - totalOut;
            lblIncome.textContent = formatMoney(totalIn);
            lblExpense.textContent = formatMoney(totalOut);
            lblBalance.textContent = formatMoney(net);

            // Update Breakdown
            bTandem.textContent = formatMoney(sumTan);
            bFun.textContent = formatMoney(sumFun);
            bCams.textContent = formatMoney(sumCam);
            bOther.textContent = formatMoney(sumOth);

            
            // Animar dinámicamente las barras
            barTandem.style.width = '0%';
            barFun.style.width = '0%';
            barCams.style.width = '0%';
            barOther.style.width = '0%';
            
            setTimeout(() => {
                barTandem.style.width = totalIn ? ((sumTan/totalIn)*100) + '%' : '0%';
                barFun.style.width = totalIn ? ((sumFun/totalIn)*100) + '%' : '0%';
                barCams.style.width = totalIn ? ((sumCam/totalIn)*100) + '%' : '0%';
                barOther.style.width = totalIn ? ((sumOth/totalIn)*100) + '%' : '0%';
            }, 50);

            // Bind deletes
            document.querySelectorAll('.btn-del-tx').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const ok = window.showConfirm ? await window.showConfirm('¿Eliminar este movimiento?', { title: 'Eliminar Movimiento', type: 'danger' }) : confirm('¿Eliminar este movimiento?');
                    if (ok) {
                        window.AppData.pettyCash = window.AppData.pettyCash.filter(x => x.id !== id);
                        if(window.saveAppData) window.saveAppData();
                        renderTransactions();
                    }
                });
            });
        }

        renderTransactions();

        // Modal Tx Logic
        document.getElementById('btn-add-tx').addEventListener('click', () => {
            modalTx.style.display = 'flex';
            void modalTx.offsetWidth;
            modalTx.style.opacity = '1';
            mtxContent.style.transform = 'translateY(0)';
            document.getElementById('tx-amount').focus();
        });

        function closeTxModal() {
            modalTx.style.opacity = '0';
            mtxContent.style.transform = 'translateY(-20px)';
            setTimeout(() => { modalTx.style.display = 'none'; }, 300);
            
            document.getElementById('tx-desc').value = '';
            document.getElementById('tx-amount').value = '';
        }

        document.getElementById('close-tx-modal').addEventListener('click', closeTxModal);

        const txType = document.getElementById('tx-type');
        const txAmount = document.getElementById('tx-amount');
        txType.addEventListener('change', () => {
            if(txType.value === 'IN') txAmount.style.color = 'var(--brand-success)';
            else txAmount.style.color = 'var(--brand-danger)';
        });

        document.getElementById('btn-save-tx').addEventListener('click', () => {
            const type = txType.value;
            const cat = document.getElementById('tx-cat').value;
            const desc = document.getElementById('tx-desc').value.trim();
            const amtStr = txAmount.value.replace(/\D/g, '');
            const amount = parseInt(amtStr, 10);
            
            if(!desc || isNaN(amount) || amount <= 0) return alert('Descripción y monto válido son requeridos.');

            const now = new Date();
            window.AppData.pettyCash.push({
                id: 'tx_' + Date.now(),
                type: type,
                cat: cat,
                desc: desc,
                amount: amount,
                user: 'Admin',
                date: now.toISOString().split('T')[0],
                time: now.toTimeString().substring(0,5)
            });

            if(window.saveAppData) window.saveAppData();
            closeTxModal();
            renderTransactions();
        });

        // Closing Logic
        document.getElementById('btn-close-cash').addEventListener('click', async () => {
            const todayStr = new Date().toLocaleDateString('en-CA');
            const txsToday = window.AppData.pettyCash.filter(t => t.date === todayStr);
            if (txsToday.length === 0) return alert('No hay movimientos hoy para cerrar.');
            
            // Check if already closed
            if (window.AppData.cashClosings.find(c => c.date === todayStr)) {
                return alert('La caja de hoy ya fue cerrada. Consulta el historial.');
            }

            const ok = window.showConfirm ? await window.showConfirm('¿Estás seguro de realizar el cierre de caja? Esto guardará un registro inmutable del día.', { title: 'Confirmar Cierre de Caja', type: 'warning' }) : confirm('¿Estás seguro de realizar el cierre de caja? Esto guardará un registro inmutable del día.');
            if (ok) {
                let totalIn = 0, totalOut = 0;
                txsToday.forEach(tx => {
                    if (tx.type === 'IN') totalIn += tx.amount;
                    else totalOut += tx.amount;
                });

                window.AppData.cashClosings.push({
                    id: 'cls_' + Date.now(),
                    date: todayStr,
                    totalIn,
                    totalOut,
                    net: totalIn - totalOut,
                    user: 'Admin',
                    timestamp: new Date().toISOString()
                });

                if(window.saveAppData) window.saveAppData();
                alert('Cierre de caja guardado con éxito.');
            }
        });

        // History Modal
        const histList = document.getElementById('hist-list');
        document.getElementById('btn-history-close').addEventListener('click', () => {
            histList.innerHTML = '';
            
            if (window.AppData.cashClosings.length === 0) {
                histList.innerHTML = '<tr><td colspan="5" style="text-align:center; padding: 2rem; color:var(--text-secondary);">No hay cierres registrados.</td></tr>';
            } else {
                [...window.AppData.cashClosings].reverse().forEach(c => {
                    const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid var(--border-color)';
                    tr.innerHTML = `
                        <td style="padding: 1rem; font-weight: 500;">${escapeHTML(c.date)}</td>
                        <td style="padding: 1rem; color: var(--brand-success);">${formatMoney(c.totalIn)}</td>
                        <td style="padding: 1rem; color: var(--brand-danger);">${formatMoney(c.totalOut)}</td>
                        <td style="padding: 1rem; font-weight: bold; color: var(--brand-blue);">${formatMoney(c.net)}</td>
                        <td style="padding: 1rem; color: var(--text-secondary);">${escapeHTML(c.user)}</td>
                    `;
                    histList.appendChild(tr);
                });
            }

            modalHistory.style.display = 'flex';
            void modalHistory.offsetWidth;
            modalHistory.style.opacity = '1';
            mhiContent.style.transform = 'translateY(0)';
        });

        document.getElementById('close-hist-modal').addEventListener('click', () => {
            modalHistory.style.opacity = '0';
            mhiContent.style.transform = 'translateY(-20px)';
            setTimeout(() => { modalHistory.style.display = 'none'; }, 300);
        });

    }
};
