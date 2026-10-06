window.Modules = window.Modules || {};
window.Modules.billing = {
    render: (container) => {
        container.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                <h2>Facturación y Reportes</h2>
            </div>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Gestión de ingresos de la empresa y cálculo de nómina técnica.</p>

            <!-- Tabs Navigation -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;" id="billing-tabs">
                <button class="btn btn-primary" data-target="ingresos"><i class="fas fa-chart-bar"></i> Reporte de Ingresos</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="liquidacion"><i class="fas fa-money-check-alt"></i> Liquidación de Instructores</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="empacadores"><i class="fas fa-box-open"></i> Liquidación de Empacadores</button>
            </div>

            <!-- ============================================== -->
            <!-- 1. Reporte de Ingresos                         -->
            <!-- ============================================== -->
            <div id="content-ingresos" class="billing-content" style="display: block;">
                <div class="card" style="background: var(--bg-surface-hover); margin-bottom: 1rem;">
                    <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
                        <div class="form-group" style="margin-bottom: 0; min-width: 150px;">
                            <label>Desde</label>
                            <input type="date" class="form-control">
                        </div>
                        <div class="form-group" style="margin-bottom: 0; min-width: 150px;">
                            <label>Hasta</label>
                            <input type="date" class="form-control">
                        </div>
                        <button class="btn btn-primary" style="height: 42px; margin-bottom: 2px;"><i class="fas fa-filter"></i> Filtrar</button>
                    </div>
                </div>

                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3>Ingresos por Servicios</h3>
                        <button class="btn btn-success" id="btn-export-ingresos" style="padding: 0.5rem 1rem;"><i class="fas fa-file-excel"></i> Exportar Ingresos</button>
                    </div>
                    
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead>
                                <tr style="background: var(--bg-surface-hover); border-bottom: 2px solid var(--border-color);">
                                    <th style="padding: 1rem;">Pasajero</th>
                                    <th style="padding: 1rem;">Tipo Salto</th>
                                    <th style="padding: 1rem;">Adicionales</th>
                                    <th style="padding: 1rem;">V. Base</th>
                                    <th style="padding: 1rem;">V. Kilos Ext.</th>
                                    <th style="padding: 1rem;">V. Cámaras</th>
                                    <th style="padding: 1rem; color: var(--brand-success);">Total Cobrado</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-ingresos">
                                <!-- Dynamic rows -->
                            </tbody>
                            <tfoot>
                                <tr style="background: var(--bg-surface-hover); font-weight: 700;">
                                    <td style="padding: 1rem;" colspan="6">TOTAL INGRESOS PERÍODO</td>
                                    <td style="padding: 1rem; font-size: 1.2rem; color: var(--brand-success);" id="tfoot-ingresos-total">$0</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- 2. Liquidación Instructores                    -->
            <!-- ============================================== -->
            <div id="content-liquidacion" class="billing-content" style="display: none;">
                <div class="card" style="background: var(--bg-surface-hover); margin-bottom: 1rem;">
                    <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
                        <div class="form-group" style="margin-bottom: 0; min-width: 200px;">
                            <label>Instructor</label>
                            <select id="billing-instructor-filter" class="form-control">
                                <option value="todos">Todos los Instructores</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0; min-width: 150px;">
                            <label>Desde</label>
                            <input type="date" class="form-control">
                        </div>
                        <div class="form-group" style="margin-bottom: 0; min-width: 150px;">
                            <label>Hasta</label>
                            <input type="date" class="form-control">
                        </div>
                        <button class="btn btn-primary" style="height: 42px; margin-bottom: 2px;"><i class="fas fa-filter"></i> Filtrar</button>
                    </div>
                </div>

                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3>Reporte de Liquidación (Nómina)</h3>
                        <button class="btn btn-success" style="padding: 0.5rem 1rem;"><i class="fas fa-file-excel"></i> Exportar Liquidación</button>
                    </div>
                    
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 900px;">
                            <thead>
                                <tr style="background: var(--bg-surface-hover); border-bottom: 2px solid var(--border-color);">
                                    <th style="padding: 1rem; width: 40px;"><input type="checkbox" id="chk-all-nomina" style="cursor: pointer;"></th>
                                    <th style="padding: 1rem;">Instructor</th>
                                    <th style="padding: 1rem;">Fecha</th>
                                    <th style="padding: 1rem;">Saltos</th>
                                    <th style="padding: 1rem;">Kilos Extras</th>
                                    <th style="padding: 1rem;">Cámara 360</th>
                                    <th style="padding: 1rem;">Cámara Ext.</th>
                                    <th style="padding: 1rem;">Honorarios Base</th>
                                    <th style="padding: 1rem;">Honorarios Extras</th>
                                    <th style="padding: 1rem; color: var(--brand-action);">Neto a Pagar</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-nomina">
                                <!-- Dynamic rows -->
                            </tbody>
                            <tfoot>
                                <tr style="background: var(--bg-surface-hover); font-weight: 700;">
                                    <td style="padding: 1rem;" colspan="9">TOTAL NÓMINA TÉCNICA</td>
                                    <td style="padding: 1rem; font-size: 1.2rem; color: var(--brand-action);" id="tfoot-nomina-total">$0</td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- 3. Liquidación Empacadores                     -->
            <!-- ============================================== -->
            <div id="content-empacadores" class="billing-content" style="display: none;">
                <div class="card" style="background: var(--bg-surface-hover); margin-bottom: 1rem;">
                    <div style="display: flex; gap: 1rem; align-items: flex-end; flex-wrap: wrap;">
                        <div class="form-group" style="margin-bottom: 0; min-width: 200px;">
                            <label>Empacador</label>
                            <select id="billing-empacador-select" class="form-control">
                                <option value="">Seleccione un Empacador</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0; min-width: 150px;">
                            <label>Fecha</label>
                            <input type="date" id="billing-empacador-date" class="form-control">
                        </div>
                        <div class="form-group" style="margin-bottom: 0; min-width: 150px;">
                            <label>Tipo</label>
                            <select id="billing-empacador-type" class="form-control">
                                <option value="Tandem">Tandem</option>
                                <option value="Escuela">Escuela (Fun)</option>
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 0; min-width: 150px;">
                            <label>Empaques Realizados</label>
                            <input type="number" id="billing-empacador-count" class="form-control" min="1" placeholder="Ej. 15">
                        </div>
                        <button id="btn-add-empaque" class="btn btn-primary" style="height: 42px; margin-bottom: 2px;"><i class="fas fa-plus"></i> Registrar</button>
                    </div>
                </div>

                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h3>Historial de Empaques y Liquidación</h3>
                    </div>
                    
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; text-align: left; min-width: 700px;">
                            <thead>
                                <tr style="background: var(--bg-surface-hover); border-bottom: 2px solid var(--border-color);">
                                    <th style="padding: 1rem;">Fecha</th>
                                    <th style="padding: 1rem;">Empacador</th>
                                    <th style="padding: 1rem;">Empaques</th>
                                    <th style="padding: 1rem;">Tarifa Unitaria</th>
                                    <th style="padding: 1rem; color: var(--brand-action);">Neto a Pagar</th>
                                    <th style="padding: 1rem; width: 60px;">Acción</th>
                                </tr>
                            </thead>
                            <tbody id="tbody-empacadores">
                                <!-- Dynamic rows -->
                            </tbody>
                            <tfoot>
                                <tr style="background: var(--bg-surface-hover); font-weight: 700;">
                                    <td style="padding: 1rem;" colspan="4">TOTAL A PAGAR (EMPAQUES)</td>
                                    <td style="padding: 1rem; font-size: 1.2rem; color: var(--brand-action);" id="tfoot-empacadores-total" colspan="2">$0</td>
                                </tr>
                            </tfoot>
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
        // Tab logic
        const tabs = document.querySelectorAll('#billing-tabs .btn');
        const contents = document.querySelectorAll('.billing-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => {
                    t.classList.remove('btn-primary');
                    t.style.background = 'var(--bg-surface-hover)';
                    t.style.color = 'var(--text-primary)';
                });
                const clicked = e.currentTarget;
                clicked.classList.add('btn-primary');
                clicked.style.background = '';
                clicked.style.color = '';

                contents.forEach(c => c.style.display = 'none');
                document.getElementById('content-' + clicked.getAttribute('data-target')).style.display = 'block';
            });
        });
        
        function formatCurrency(num) {
            return '$' + parseInt(num || 0, 10).toLocaleString('es-CO');
        }
        
        function renderData() {
            const tbIngresos = document.getElementById('tbody-ingresos');
            const tbNomina = document.getElementById('tbody-nomina');
            const tfIngresos = document.getElementById('tfoot-ingresos-total');
            const tfNomina = document.getElementById('tfoot-nomina-total');
            
            tbIngresos.innerHTML = '';
            tbNomina.innerHTML = '';
            
            // Populate Instructor Filter
            const instFilter = document.getElementById('billing-instructor-filter');
            if (instFilter && instFilter.options.length <= 1) {
                const emps = (window.AppData?.employees || []).filter(e => ['Piloto', 'Instructor Tandem', 'Tandem', 'Cameraman'].includes(e.role));
                emps.forEach(e => {
                    const lname = e.lastname ? ` | ${e.lastname}` : '';
                    const doc = e.doc ? ` | ${e.doc}` : '';
                    const opt = document.createElement('option');
                    opt.value = e.name;
                    opt.textContent = `${e.name}${lname}${doc}`;
                    instFilter.appendChild(opt);
                });
            }
            
            let totalIngresos = 0;
            let totalNomina = 0;
            
            const paxs = window.AppData?.passengers || [];
            const maestro = window.AppData?.maestroValores || [];
            
            const getPrice = (name) => {
                const item = maestro.find(x => x.name === name);
                return item && item.price ? parseInt(item.price.replace(/\\./g, '')) || 0 : 0;
            };
            
            const getComision = (name) => {
                const item = maestro.find(x => x.name === name);
                return item && item.comision ? parseInt(item.comision.replace(/\\./g, '')) || 0 : 0;
            };

            const nominaMap = {};
            
            paxs.forEach(p => {
                // Ingresos
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                
                // Base
                let base = p.financiera?.manualPrice || getPrice(p.type === 'Tandem' ? 'Salto Tandem' : (p.type.includes('AFF') ? 'Salto AFF' : 'Salto Tandem'));
                
                // Kilos
                let kgs = p.weight > 90 ? (p.weight - 90) : 0;
                let kgValue = kgs * getPrice('Valor KG Extra');
                
                // Cams
                let extraVal = 0;
                if (p.cams) {
                    if (p.cams.includes('360')) extraVal += getPrice('Cámara 360');
                    if (p.cams.includes('GoPro') || p.cams.includes('Handcam')) extraVal += getPrice('Cámara Go-Pro');
                    if (p.cams.includes('Ext')) extraVal += getPrice('Cámara Externa');
                }

                const income = base + kgValue + extraVal;
                totalIngresos += income;
                
                tr.style.transition = 'background 0.2s';
                tr.onmouseover = () => tr.style.background = 'var(--bg-surface-hover)';
                tr.onmouseout = () => tr.style.background = 'transparent';
                tr.innerHTML = `
                    <td style="padding: 1rem; font-weight: 600;">${escapeHTML(p.name)}</td>
                    <td style="padding: 1rem;">${escapeHTML(p.type)}</td>
                    <td style="padding: 1rem;">${escapeHTML(p.cams || "-")} / ${kgs > 0 ? kgs+'kg Ext' : 'Sin Ext'}</td>
                    <td style="padding: 1rem;">${formatCurrency(base)}</td>
                    <td style="padding: 1rem;">${formatCurrency(kgValue)}</td>
                    <td style="padding: 1rem;">${formatCurrency(extraVal)}</td>
                    <td style="padding: 1rem;">
                        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 0.3rem 0.6rem; display: inline-block; font-weight: 700; color: var(--brand-success); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            ${formatCurrency(income)}
                        </div>
                    </td>
                `;
                tbIngresos.appendChild(tr);
                
                // Nómina (Aggregation)
                if (p.instructor && p.instructor !== 'Sin asignar') {
                    const key = `${p.instructor}_${p.date || 'S/D'}`;
                    if (!nominaMap[key]) {
                        nominaMap[key] = { instructor: p.instructor, date: p.date || 'S/D', saltos: 0, kilos: 0, cam360: 0, camExt: 0, base: 0, extras: 0, total: 0 };
                    }
                    
                    nominaMap[key].saltos += 1;
                    
                    let instKgVal = kgs * getComision('Valor KG Extra');
                    nominaMap[key].kilos += instKgVal;
                    
                    let instCam360 = (p.cams || '').includes('360') ? getComision('Cámara 360') : 0;
                    nominaMap[key].cam360 += instCam360;
                    
                    let instCamGoPro = ((p.cams || '').includes('GoPro') || (p.cams || '').includes('Handcam')) ? getComision('Cámara Go-Pro') : 0;
                    nominaMap[key].camExt += instCamGoPro;
                    
                    let instBase = getComision(p.type === 'Tandem' ? 'Salto Tandem' : (p.type.includes('AFF') ? 'Salto AFF' : 'Salto Tandem'));
                    nominaMap[key].base += instBase;
                    
                    const totExt = instKgVal + instCam360 + instCamGoPro;
                    nominaMap[key].extras += totExt;
                    nominaMap[key].total += instBase + totExt;
                }

                if (p.camInstructor && p.camInstructor !== 'Sin asignar') {
                    const camKey = `${p.camInstructor}_${p.date || 'S/D'}`;
                    if (!nominaMap[camKey]) {
                        nominaMap[camKey] = { instructor: p.camInstructor, date: p.date || 'S/D', saltos: 0, kilos: 0, cam360: 0, camExt: 0, base: 0, extras: 0, total: 0 };
                    }
                    
                    let instCamExtReal = ((p.cams || '').includes('Ext') || (p.cams || '').includes('Externa')) ? getComision('Cámara Externa') : 0;
                    if (instCamExtReal > 0) {
                        nominaMap[camKey].camExt += instCamExtReal;
                        nominaMap[camKey].extras += instCamExtReal;
                        nominaMap[camKey].total += instCamExtReal;
                    }
                }
            });
            
            // Render Nomina
            Object.values(nominaMap).forEach((n, idx) => {
                totalNomina += n.total;
                
                let instDisplay = n.instructor;
                const emp = (window.AppData?.employees || []).find(e => e.name === n.instructor || e.id === n.instructor);
                if (emp) {
                    const lname = emp.lastname ? `|${emp.lastname}` : '';
                    const doc = emp.doc ? `|${emp.doc}` : '';
                    instDisplay = `${emp.name}${lname}${doc}`;
                }

                const ntr = document.createElement('tr');
                ntr.style.borderBottom = '1px solid var(--border-color)';
                ntr.style.transition = 'background 0.2s';
                ntr.onmouseover = () => ntr.style.background = 'var(--bg-surface-hover)';
                ntr.onmouseout = () => ntr.style.background = 'transparent';
                
                ntr.innerHTML = `
                    <td style="padding: 1rem;"><input type="checkbox" class="chk-nomina-row" style="cursor: pointer;"></td>
                    <td style="padding: 1rem; font-weight: 600;">${escapeHTML(instDisplay)}</td>
                    <td style="padding: 1rem;">${n.date}</td>
                    <td style="padding: 1rem; text-align: center;">${n.saltos}</td>
                    <td style="padding: 1rem;">${formatCurrency(n.kilos)}</td>
                    <td style="padding: 1rem;">${formatCurrency(n.cam360)}</td>
                    <td style="padding: 1rem;">${formatCurrency(n.camExt)}</td>
                    <td style="padding: 1rem;">${formatCurrency(n.base)}</td>
                    <td style="padding: 1rem;">${formatCurrency(n.extras)}</td>
                    <td style="padding: 1rem;">
                        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; padding: 0.3rem 0.6rem; display: inline-block; font-weight: 700; color: var(--brand-action); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            ${formatCurrency(n.total)}
                        </div>
                    </td>
                `;
                tbNomina.appendChild(ntr);
            });
            
            tfIngresos.textContent = formatCurrency(totalIngresos);
            tfNomina.textContent = formatCurrency(totalNomina);

            // Select All Nomina Checkbox
            const chkAll = document.getElementById('chk-all-nomina');
            if(chkAll) {
                chkAll.addEventListener('change', (e) => {
                    document.querySelectorAll('.chk-nomina-row').forEach(c => c.checked = e.target.checked);
                });
            }
        }
        
        renderData();
        
        // =======================
        // Liquidacion Empacadores
        // =======================
        function renderEmpacadores() {
            const selectEmp = document.getElementById('billing-empacador-select');
            const tbody = document.getElementById('tbody-empacadores');
            const tfootTotal = document.getElementById('tfoot-empacadores-total');
            
            // Populate select
            if (selectEmp && selectEmp.options.length <= 1) {
                const empacadores = (window.AppData?.employees || []).filter(e => e.role === 'Empacador');
                empacadores.forEach(e => {
                    const opt = document.createElement('option');
                    opt.value = e.id;
                    opt.textContent = e.name;
                    selectEmp.appendChild(opt);
                });
            }

            // Get unit prices
            const maestro = window.AppData?.maestroValores || [];
            const empaqueTandemItem = maestro.find(x => x.name === 'Empaque Tandem');
            const empaqueEscuelaItem = maestro.find(x => x.name === 'Empaque Escuela');
            const pTandem = empaqueTandemItem && empaqueTandemItem.price ? parseInt(empaqueTandemItem.price.toString().replace(/\./g, '')) || 0 : 0;
            const pEscuela = empaqueEscuelaItem && empaqueEscuelaItem.price ? parseInt(empaqueEscuelaItem.price.toString().replace(/\./g, '')) || 0 : 0;

            if(tbody) tbody.innerHTML = '';
            let totalGeneral = 0;
            const records = window.AppData?.packerBilling || [];
            
            records.forEach(r => {
                const emp = (window.AppData?.employees || []).find(e => e.id === r.empId);
                const empName = emp ? emp.name : 'Desconocido';
                const uPrice = (r.type === 'Escuela') ? pEscuela : pTandem;
                const totalRow = r.count * uPrice;
                totalGeneral += totalRow;

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = `
                    <td style="padding: 1rem;">${r.date}</td>
                    <td style="padding: 1rem; font-weight: 600;">${escapeHTML(empName)}</td>
                    <td style="padding: 1rem;">${r.type || 'Tandem'}</td>
                    <td style="padding: 1rem; text-align: center;">${r.count}</td>
                    <td style="padding: 1rem;">${formatCurrency(uPrice)}</td>
                    <td style="padding: 1rem; font-weight: 700; color: var(--brand-action);">${formatCurrency(totalRow)}</td>
                    <td style="padding: 1rem;"><button class="btn btn-del-empaque" data-id="${r.id}" style="background: rgba(239, 68, 68, 0.1); color: var(--brand-danger); padding: 0.25rem 0.5rem; border:none; border-radius:4px; cursor:pointer;"><i class="fas fa-trash"></i></button></td>
                `;
                if(tbody) tbody.appendChild(tr);
            });

            if(tfootTotal) tfootTotal.textContent = formatCurrency(totalGeneral);

            // Delete logic
            document.querySelectorAll('.btn-del-empaque').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (confirm('¿Eliminar este registro?')) {
                        const id = e.currentTarget.getAttribute('data-id');
                        window.AppData.packerBilling = window.AppData.packerBilling.filter(x => x.id !== id);
                        if (window.saveAppData) window.saveAppData();
                        renderEmpacadores();
                    }
                });
            });
        }

        const btnAddEmpaque = document.getElementById('btn-add-empaque');
        if (btnAddEmpaque) {
            btnAddEmpaque.addEventListener('click', () => {
                const empId = document.getElementById('billing-empacador-select').value;
                const date = document.getElementById('billing-empacador-date').value;
                const type = document.getElementById('billing-empacador-type') ? document.getElementById('billing-empacador-type').value : 'Tandem';
                const count = parseInt(document.getElementById('billing-empacador-count').value);

                if (!empId || !date || isNaN(count) || count <= 0) {
                    return alert('Por favor, complete todos los campos correctamente.');
                }

                window.AppData.packerBilling = window.AppData.packerBilling || [];
                window.AppData.packerBilling.push({
                    id: 'empaque_' + Date.now(),
                    empId,
                    date,
                    type,
                    count
                });

                if (window.saveAppData) window.saveAppData();
                
                // Clear inputs
                document.getElementById('billing-empacador-count').value = '';
                
                renderEmpacadores();
            });
        }
        
        renderEmpacadores();
        
        // Export logic
        document.getElementById('btn-export-ingresos')?.addEventListener('click', () => {
            alert('Exportando Reporte de Ingresos a CSV...');
        });
        
        const btnExportNomina = document.querySelector('.btn-success[style*="Exportar Liquidación"]') || document.querySelectorAll('.btn-success')[1];
        if (btnExportNomina) {
            btnExportNomina.addEventListener('click', () => {
                const selected = document.querySelectorAll('.chk-nomina-row:checked');
                if (selected.length === 0) {
                    return alert('Por favor selecciona al menos un registro de nómina para exportar/liquidar.');
                }
                alert(`Generando y exportando liquidación para ${selected.length} registros seleccionados...`);
            });
        }

    }
};
