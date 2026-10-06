const fs = require('fs');

let code = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

const regex = /const mergedPdf = await PDFDocument\.create\(\);[\s\S]*?copiedPages\.forEach\(\(page\) => mergedPdf\.addPage\(\{?page\}?\)\);/g;

// To be safe, let's just replace the whole try catch block to ensure flawless merge.
const tryCatchRegex = /try \{[\s\S]*?alert\(currentLang === 'es' \? 'Error al procesar los PDFs.' : 'Error processing PDFs.'\);\s*btnFinish\.disabled = false;\s*btnFinish\.innerHTML = '<i class="fas fa-check"><\/i> <span data-i18n="btn_finish">Confirmar Reserva<\/span>';\s*\}/;

const newTryCatch = `try {
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
                            if (pages.length > 0) {
                                const lastPage = pages[pages.length - 1];
                                const { width, height } = lastPage.getSize();
                                
                                const sigDims = pngImage.scale(0.5); // scale down
                                lastPage.drawImage(pngImage, {
                                    x: width / 2 - sigDims.width / 2,
                                    y: 50,
                                    width: sigDims.width,
                                    height: sigDims.height,
                                });
                            }

                            // To ensure modifications are copied, save and reload
                            const modifiedBytes = await pdfDoc.save();
                            const modifiedDoc = await PDFDocument.load(modifiedBytes);

                            // Copy pages to merged PDF
                            const copiedPages = await mergedPdf.copyPages(modifiedDoc, modifiedDoc.getPageIndices());
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
                }`;

if (tryCatchRegex.test(code)) {
    code = code.replace(tryCatchRegex, newTryCatch);
    fs.writeFileSync('js/modules/b2c-form.js', code, 'utf8');
    console.log("Merged PDF logic improved.");
} else {
    console.log("Regex for try catch failed");
}
