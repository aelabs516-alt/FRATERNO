const fs = require('fs');
let code = fs.readFileSync('js/modules/dashboard_clean.js', 'utf8');

// Replace the date initialization logic
code = code.replace(
    "const now = new Date();\n        const todayStr = now.toLocaleDateString('en-CA'); // YYYY-MM-DD",
    "const todayStr = window.AppData?.dashboardFilterDate || new Date().toLocaleDateString('en-CA');\n        const now = new Date(todayStr + 'T12:00:00'); // Ensure local tz"
);

// Add the date input next to the title
code = code.replace(
    '<p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem;">Resumen de operaciones para hoy, ${todayFormatted}</p>',
    '<p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem; display: flex; align-items: center; gap: 1rem;">Resumen de operaciones para la fecha: <input type="date" id="dash-filter-date" value="${todayStr}" style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 6px; padding: 0.25rem 0.5rem; outline: none; font-family: inherit;"></p>'
);

// Fix the report button
code = code.replace(
    '<button class="btn btn-primary" onclick="alert(\'Generador de reportes en construccin.\')"',
    '<button id="btn-reporte-ejecutivo" class="btn btn-primary"'
);
code = code.replace(
    '<button class="btn btn-primary" onclick="alert(\'Generador de reportes en construcci\ufffdn.\')"',
    '<button id="btn-reporte-ejecutivo" class="btn btn-primary"'
);
code = code.replace(
    /<button class="btn btn-primary" onclick="alert\('Generador de reportes en construcci[^']+'\)"/g,
    '<button id="btn-reporte-ejecutivo" class="btn btn-primary"'
);


// Add Modal HTML at the end of render
const modalHtml = `
            <!-- Modal Reporte Ejecutivo -->
            <div id="modal-reporte-ejecutivo" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 10000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 800px; max-width: 95%; max-height: 90vh; overflow-y: auto; background: #fff; color: #333; position: relative;">
                    <button id="btn-close-reporte" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: #666; font-size: 1.5rem;"><i class="fas fa-times"></i></button>
                    
                    <div id="reporte-printable" style="padding: 2rem; background: #fff;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #111; padding-bottom: 1rem; margin-bottom: 1.5rem;">
                            <img src="img/logo.png" alt="Logo" style="height: 60px;">
                            <div style="text-align: right;">
                                <h2 style="margin: 0; color: #111; font-size: 1.5rem; text-transform: uppercase;">Reporte Ejecutivo</h2>
                                <p style="margin: 0.2rem 0 0 0; color: #666; font-size: 0.9rem;">Fecha del Reporte: <span id="rep-fecha"></span></p>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
                                <h3 style="margin-top: 0; color: #111; font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;"><i class="fas fa-money-bill-wave" style="color: #10b981;"></i> Resumen de Ingresos</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Tándem:</span> <strong id="rep-ing-tandem">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Fun Jumper:</span> <strong id="rep-ing-fun">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Copiloto:</span> <strong id="rep-ing-cop">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Adicionales:</span> <strong id="rep-ing-add">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 0.5rem; border-top: 1px dashed #ccc; font-size: 1.2rem; color: #111;"><strong>TOTAL BRUTO:</strong> <strong id="rep-ing-total">$0</strong></div>
                            </div>
                            
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
                                <h3 style="margin-top: 0; color: #111; font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;"><i class="fas fa-parachute-box" style="color: #38bdf8;"></i> Resumen Operativo</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Saltos Totales (Día):</span> <strong id="rep-op-jumps">0</strong></div>
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
`;

code = code.replace(
    '</div>\n        `;\n    },\n    init: () => {',
    modalHtml + '\n            </div>\n        `;\n    },\n    init: () => {'
);

const jsBinding = `
        const dateInput = document.getElementById('dash-filter-date');
        if(dateInput) {
            dateInput.addEventListener('change', (e) => {
                window.AppData.dashboardFilterDate = e.target.value;
                if(window.Modules.dashboard.init) {
                    const container = document.getElementById('content-dashboard') || document.querySelector('.main-content');
                    if(container) {
                        window.Modules.dashboard.render(container);
                        window.Modules.dashboard.init();
                    }
                }
            });
        }
        
        const btnRep = document.getElementById('btn-reporte-ejecutivo');
        if(btnRep) {
            btnRep.addEventListener('click', () => {
                const tdStr = window.AppData?.dashboardFilterDate || new Date().toLocaleDateString('en-CA');
                document.getElementById('rep-fecha').textContent = tdStr;
                const fmt = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
                
                // Recalculate stats inside here since the render vars aren't available in init block directly
                const paxs = window.AppData?.passengers || [];
                const tPaxs = paxs.filter(p => p.date === tdStr && !(p.paxStatus && p.paxStatus.includes('Cancelado')) && !(p.flightStatus && p.flightStatus.includes('Cancelado')));
                const lPaxs = tPaxs.filter(p => p.flightStatus === 'Aterriz' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado');
                let tInc = 0, tt = 0, tf = 0, tc = 0, ta = 0;
                tPaxs.forEach(p => {
                    const paid = p.financiera?.totalPaid || 0;
                    tInc += paid;
                    let pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
                    let bPrice = 850000; if(pType.includes('copiloto')) bPrice = 1200000; else if(pType.includes('fun')) bPrice = 150000;
                    if(p.financiera?.manualPrice > 0) bPrice = p.financiera.manualPrice;
                    let aBase = Math.min(paid, bPrice); let aExt = Math.max(0, paid - aBase);
                    if(pType.includes('tandem')) tt += aBase; else if(pType.includes('copiloto')) tc += aBase; else tf += aBase;
                    ta += aExt;
                });
                
                document.getElementById('rep-ing-tandem').textContent = fmt(tt);
                document.getElementById('rep-ing-fun').textContent = fmt(tf);
                document.getElementById('rep-ing-cop').textContent = fmt(tc);
                document.getElementById('rep-ing-add').textContent = fmt(ta);
                document.getElementById('rep-ing-total').textContent = fmt(tt + tf + tc + ta);
                
                document.getElementById('rep-op-jumps').textContent = lPaxs.length;
                document.getElementById('rep-op-inst').textContent = (window.AppData?.pilots || []).length;
                
                let cashBalance = 0;
                (window.AppData?.pettyCash || []).forEach(tx => { if(tx.type==='IN') cashBalance+=tx.amount; else if(tx.type==='OUT') cashBalance-=tx.amount; });
                document.getElementById('rep-op-cash').textContent = fmt(cashBalance);
                
                const currentMonth = tdStr.substring(0, 7);
                const monthPaxs = paxs.filter(p => p.date && p.date.startsWith(currentMonth) && (p.flightStatus === 'Aterriz' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado'));
                let cTandem = 0, cFun = 0;
                monthPaxs.forEach(p => {
                    const pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
                    if(pType.includes('tandem')) cTandem++; else cFun++;
                });
                document.getElementById('rep-mes-tandem').textContent = cTandem;
                document.getElementById('rep-mes-fun').textContent = cFun;

                const modal = document.getElementById('modal-reporte-ejecutivo');
                modal.style.display = 'flex';
                setTimeout(() => modal.style.opacity = '1', 10);
            });
        }
        
        const btnCloseRep = document.getElementById('btn-close-reporte');
        if(btnCloseRep) {
            btnCloseRep.addEventListener('click', () => {
                const modal = document.getElementById('modal-reporte-ejecutivo');
                modal.style.opacity = '0';
                setTimeout(() => modal.style.display = 'none', 300);
            });
        }
        
        const btnExportPdf = document.getElementById('btn-export-pdf');
        if(btnExportPdf) {
            btnExportPdf.addEventListener('click', () => {
                if (typeof html2canvas === 'undefined') {
                    const script = document.createElement('script');
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                    script.onload = () => execPdf();
                    document.head.appendChild(script);
                } else {
                    execPdf();
                }
            });
        }
        
        function execPdf() {
            const el = document.getElementById('reporte-printable');
            html2canvas(el, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                if(typeof window.jspdf === 'undefined') return alert("jsPDF no cargado");
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Reporte_Ejecutivo_Fraterno.pdf');
            }).catch(err => {
                console.error(err);
                alert('Error generando PDF. Asegúrate de que el logo u otros elementos no bloqueen el canvas.');
            });
        }
`;

// Add init logic at the very end of init function
const idx = code.lastIndexOf('}'); // very last brace
const idx2 = code.lastIndexOf('}', idx - 1); // second to last brace
code = code.substring(0, idx2) + jsBinding + '\n        ' + code.substring(idx2);

// Fix todayStr in init() charts logic
code = code.replace(
    "const todayStr = now.toLocaleDateString('en-CA');",
    "const todayStr = window.AppData?.dashboardFilterDate || new Date().toLocaleDateString('en-CA');"
);

fs.writeFileSync('js/modules/dashboard.js', code);
