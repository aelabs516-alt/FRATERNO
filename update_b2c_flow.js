const fs = require('fs');

let code = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

// 1. Remove the old duplicate Exoneration block (if exists) before the Selfie block.
// The one with "Importante – Lectura de la Exoneración de Responsabilidad" but we have the new 4 ones.
// Let's remove ANY block that has "btn-download-exo" and "chk-exo" EXCEPT the one in the 4 items sequence.
// Actually, it's safer to just replace the whole main container layout.
// Let's look for the start of the layout.
// Since it's huge, let's use targeted regexes to clean up.

// Wait, I can just replace the `btnFinish` click listener logic to include the pdf-lib generation.
const btnFinishRegex = /const btnFinish = document\.querySelector\('\[data-i18n="btn_finish"\]'\)\.parentElement;\s*if \(btnFinish\) \{\s*btnFinish\.addEventListener\('click', \(\) => \{[\s\S]*?window\.location\.hash = '#\/';\s*\}\);\s*\}/;

const newBtnFinish = `const btnFinish = document.querySelector('[data-i18n="btn_finish"]').parentElement;
        if (btnFinish) {
            btnFinish.addEventListener('click', async () => {
                
                // Validate checkboxes and signature
                const c1 = document.getElementById('chk-bienvenida') ? document.getElementById('chk-bienvenida').checked : false;
                const c2 = document.getElementById('chk-terminos') ? document.getElementById('chk-terminos').checked : false;
                const c3 = document.getElementById('chk-ficha') ? document.getElementById('chk-ficha').checked : false;
                const c4 = document.getElementById('chk-exo') ? document.getElementById('chk-exo').checked : false;
                const selfieInput = document.getElementById('selfie-file');
                const hasSelfie = selfieInput && selfieInput.files && selfieInput.files.length > 0;
                
                if (!c1 || !c2 || !c3 || !c4) {
                    return alert(currentLang === 'es' ? 'Debes leer y aceptar todos los documentos obligatorios.' : 'You must read and accept all mandatory documents.');
                }
                if (!hasSelfie) {
                    return alert(currentLang === 'es' ? 'Falta foto / selfie de seguridad.' : 'Security photo / selfie is missing.');
                }
                if (!isCanvasSigned) {
                    return alert(currentLang === 'es' ? 'Falta firmar.' : 'Signature is missing.');
                }

                const sigDataUrl = canvas.toDataURL('image/png');
                
                // Get data
                const fName = document.getElementById('b2c-fname') ? document.getElementById('b2c-fname').value : '';
                const lName = document.getElementById('b2c-lname') ? document.getElementById('b2c-lname').value : '';
                const doc = document.getElementById('b2c-doc-filled') ? document.getElementById('b2c-doc-filled').value : '';
                const weight = document.getElementById('weight-input') ? document.getElementById('weight-input').value : 0;
                
                if (!fName || !doc) {
                    return alert(currentLang === 'es' ? 'Faltan datos personales.' : 'Missing personal data.');
                }

                // Show loading
                btnFinish.disabled = true;
                btnFinish.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando Documentos...';

                try {
                    // Sign PDFs
                    const { PDFDocument } = window.PDFLib;
                    const suffix = currentLang === 'en' ? '_EN' : '';
                    const files = [
                        '1_bienvenida' + suffix + '.pdf',
                        '2_terminos_condiciones' + suffix + '.pdf',
                        '3_ficha_informacion' + suffix + '.pdf',
                        '4_exoneracion' + suffix + '.pdf'
                    ];

                    const mergedPdf = await PDFDocument.create();

                    for (const file of files) {
                        try {
                            const res = await fetch('assets/docs/' + file);
                            if (!res.ok) {
                                console.warn("Could not load", file);
                                continue;
                            }
                            const arrayBuffer = await res.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(arrayBuffer);
                            
                            // Embed signature
                            const pngImageBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
                            const pngImage = await pdfDoc.embedPng(pngImageBytes);
                            
                            // Draw on last page
                            const pages = pdfDoc.getPages();
                            const lastPage = pages[pages.length - 1];
                            const { width, height } = lastPage.getSize();
                            
                            const sigDims = pngImage.scale(0.5); // scale down
                            lastPage.drawImage(pngImage, {
                                x: width / 2 - sigDims.width / 2,
                                y: 50,
                                width: sigDims.width,
                                height: sigDims.height,
                            });

                            // Copy pages to merged PDF
                            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                            copiedPages.forEach((page) => mergedPdf.addPage(page));
                        } catch (e) {
                            console.error("Error processing " + file, e);
                        }
                    }

                    // Download merged
                    const mergedPdfBytes = await mergedPdf.save();
                    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = "Documentos_Firmados_Fraterno.pdf";
                    link.click();
                    
                    window.AppData = window.AppData || {};
                    window.AppData.passengers = window.AppData.passengers || [];
                    window.AppData.b2cSignature = sigDataUrl;

                    // Push to passengers
                    window.AppData.passengers.push({
                        id: 'b2c_' + Date.now(),
                        name: \`\${fName} \${lName}\`.trim(),
                        doc: doc,
                        phone: '',
                        email: '',
                        dob: '',
                        date: '', // To be synced if needed
                        time: 'Por definir',
                        type: 'Tandem', // Default
                        cams: 'Sin cámaras',
                        weight: parseFloat(weight) || 0,
                        instructor: 'Sin asignar',
                        aeronave: 'Sin asignar',
                        paxStatus: 'Pendiente Check-in',
                        flightStatus: 'A tiempo / On-Time',
                        waiverSigned: true, 
                        status: 'En Espera',
                        financiera: {
                            manualPrice: 0, discount: 0, comisionTo: '', comisionVal: 0, totalPaid: 0
                        }
                    });
                    
                    if (window.saveAppData) window.saveAppData();

                    alert(currentLang === 'es' ? '¡Registro y firma completados exitosamente!' : 'Registration and signature successfully completed!');
                    window.location.hash = '#/';
                } catch (err) {
                    console.error("Error signing PDFs", err);
                    alert(currentLang === 'es' ? 'Error al procesar los PDFs.' : 'Error processing PDFs.');
                    btnFinish.disabled = false;
                    btnFinish.innerHTML = '<i class="fas fa-check"></i> <span data-i18n="btn_finish">Confirmar Reserva</span>';
                }
            });
        }`;

if (btnFinishRegex.test(code)) {
    code = code.replace(btnFinishRegex, newBtnFinish);
    fs.writeFileSync('js/modules/b2c-form.js', code, 'utf8');
    console.log("btnFinish logic updated.");
} else {
    console.log("Could not find btnFinish logic via regex.");
}

// 2. Remove the old terms block check in checkFormValid if it exists, since we replaced it with 4 checks.
const checkValidRegex = /function checkFormValid\(\) \{[\s\S]*?isCanvasSigned\);\s*\}\s*\}/;
const newCheckValid = `function checkFormValid() {
              const c1 = document.getElementById('chk-bienvenida') ? document.getElementById('chk-bienvenida').checked : false;
              const c2 = document.getElementById('chk-terminos') ? document.getElementById('chk-terminos').checked : false;
              const c3 = document.getElementById('chk-ficha') ? document.getElementById('chk-ficha').checked : false;
              const c4 = document.getElementById('chk-exo') ? document.getElementById('chk-exo').checked : false;
              const selfieInput = document.getElementById('selfie-file');
              const hasSelfie = selfieInput && selfieInput.files && selfieInput.files.length > 0;
              
              const btn = document.getElementById('btn-confirm-booking');
              if (btn) {
                  btn.disabled = !(c1 && c2 && c3 && c4 && hasSelfie && isCanvasSigned);
              }
          }`;

if (checkValidRegex.test(code)) {
    code = code.replace(checkValidRegex, newCheckValid);
    fs.writeFileSync('js/modules/b2c-form.js', code, 'utf8');
    console.log("checkFormValid logic updated.");
} else {
    console.log("Could not find checkFormValid logic via regex.");
}

// Ensure the stray Exoneracion block is removed
// We added one manually before selfie: <div class="card" style="text-align: center; border: 1px solid var(--brand-warning); background: rgba(245, 158, 11, 0.05);">...<h4>...Importante...</h4>...<button id="btn-download-exo"...</button>...<label>...<input type="checkbox"...</label></div>
// But now there's an official block: <!-- 4. Exoneración de Responsabilidad -->
// So we must remove the first duplicate one if it exists.
// Wait, the official block 4 has id="chk-exo" and "btn-dl-exo".
// My duplicate block had id="btn-download-exo" and NO id on checkbox.
const duplicateExoRegex = /<div class="card" style="text-align: center; border: 1px solid var\(--brand-warning\); background: rgba\(245, 158, 11, 0\.05\);">[\s\S]*?<h4[^>]*>.*?Importante.*?<\/h4>[\s\S]*?<button id="btn-download-exo"[\s\S]*?<\/button>[\s\S]*?<\/label>\s*<\/div>/;
if (duplicateExoRegex.test(code)) {
    code = code.replace(duplicateExoRegex, '');
    fs.writeFileSync('js/modules/b2c-form.js', code, 'utf8');
    console.log("Duplicate Exoneracion removed.");
} else {
    console.log("Duplicate Exoneracion not found.");
}

// Ensure "Reserva de Grupos" and "Condiciones Médicas" and "Soporte de Pago" are ordered correctly if needed.
// The user said: "despues de Reserva tu Aventura, Detalle de Salto, Fecha Deseada y Antes de poder confirmar la reserva, el usuario debe pasar por los siguientes pasos: 1... 2... 3... 4..."
// The current order is mostly fine. We just removed the duplicate Exoneration.
