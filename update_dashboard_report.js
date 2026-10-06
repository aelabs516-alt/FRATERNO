const fs = require('fs');
let content = fs.readFileSync('js/modules/dashboard.js', 'utf8');

// 1. Replace the button
content = content.replace(
    '<button class="btn btn-primary" onclick="alert(\'Generador de reportes en construccin.\')" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(59,130,246,0.4);"><i class="fas fa-chart-line"></i> Reporte Ejecutivo</button>',
    '<button id="btn-reporte-ejecutivo" class="btn btn-primary" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(59,130,246,0.4);"><i class="fas fa-chart-line"></i> Reporte Ejecutivo</button>'
);

// Fallback just in case encoding issues
content = content.replace(
    /<button class="btn btn-primary" onclick="alert\('Generador de reportes en construcci[^']+'\)"[^>]+><i class="fas fa-chart-line"><\/i> Reporte Ejecutivo<\/button>/,
    '<button id="btn-reporte-ejecutivo" class="btn btn-primary" style="border-radius: 8px; box-shadow: 0 4px 15px rgba(59,130,246,0.4);"><i class="fas fa-chart-line"></i> Reporte Ejecutivo</button>'
);

// 2. Add Modal HTML inside render
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
                                <p style="margin: 0.2rem 0 0 0; color: #666; font-size: 0.9rem;">Fecha: <span id="rep-fecha"></span></p>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem;">
                            <!-- Panel Ingresos -->
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
                                <h3 style="margin-top: 0; color: #111; font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;"><i class="fas fa-money-bill-wave" style="color: #10b981;"></i> Resumen de Ingresos (Hoy)</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Tándem:</span> <strong id="rep-ing-tandem">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Fun Jumper:</span> <strong id="rep-ing-fun">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Copiloto:</span> <strong id="rep-ing-cop">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Adicionales:</span> <strong id="rep-ing-add">$0</strong></div>
                                <div style="display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 0.5rem; border-top: 1px dashed #ccc; font-size: 1.2rem; color: #111;"><strong>TOTAL BRUTO:</strong> <strong id="rep-ing-total">$0</strong></div>
                            </div>
                            
                            <!-- Panel Operativo -->
                            <div style="border: 1px solid #ddd; border-radius: 8px; padding: 1rem;">
                                <h3 style="margin-top: 0; color: #111; font-size: 1.1rem; border-bottom: 1px solid #eee; padding-bottom: 0.5rem;"><i class="fas fa-parachute-box" style="color: #38bdf8;"></i> Resumen Operativo (Hoy)</h3>
                                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;"><span style="color: #555;">Saltos Totales:</span> <strong id="rep-op-jumps">0</strong></div>
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
content = content.replace(/<\/div>\s*`;\s*},\s*init:/, modalHtml + '\n            </div>\n        `;\n    },\n    init:');

// 3. Add JS binding at the end of init
const jsBinding = `
        const btnRep = document.getElementById('btn-reporte-ejecutivo');
        if(btnRep) {
            btnRep.addEventListener('click', () => {
                document.getElementById('rep-fecha').textContent = new Date().toLocaleString('es-CO');
                const fmt = (val) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
                
                document.getElementById('rep-ing-tandem').textContent = fmt(iTandem);
                document.getElementById('rep-ing-fun').textContent = fmt(iFun);
                document.getElementById('rep-ing-cop').textContent = fmt(iCopiloto);
                document.getElementById('rep-ing-add').textContent = fmt(iAdicionales);
                document.getElementById('rep-ing-total').textContent = fmt(iTandem + iFun + iCopiloto + iAdicionales);
                
                document.getElementById('rep-op-jumps').textContent = jumpsToday;
                document.getElementById('rep-op-inst').textContent = activeInst;
                document.getElementById('rep-op-cash').textContent = fmt(cashBalance);
                
                document.getElementById('rep-mes-tandem').textContent = countTandem;
                document.getElementById('rep-mes-fun').textContent = countFun;

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

content = content.replace(/}\s*\}\s*$/m, jsBinding + '\n        }\n    }\n};');
fs.writeFileSync('js/modules/dashboard.js', content);
console.log("Dashboard updated with Reporte Ejecutivo logic.");
