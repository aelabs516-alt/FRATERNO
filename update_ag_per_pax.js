const fs = require('fs');
let code = fs.readFileSync('js/modules/autogestion.js', 'utf8');

// 1. Remove the static legal modules from the HTML and replace with <div id="ag-legal-container-1"></div>
const staticLegalRegex = /<!-- 1\. Guía de Bienvenida -->[\s\S]*?<!-- Signature Pad -->[\s\S]*?<\/div>\s*<\/div>\s*(<button type="submit" id="ag-btn-confirm")/;

if (staticLegalRegex.test(code)) {
    code = code.replace(staticLegalRegex, '<div id="ag-legal-container-1"></div>\n$1');
} else {
    console.log("Could not find static legal modules to remove.");
}

// 2. Add the dynamic HTML generator and state arrays inside init()
const initRegex = /const form = document\.getElementById\('ag-booking-form'\);/;
const dynamicLogic = `const form = document.getElementById('ag-booking-form');
        
        window.agSignatures = {}; // To hold signature data
        window.agIsSigned = {};   // To hold signing state

        const getLegalHTML = (paxIndex) => {
            return \`
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-book-open"></i> <span data-i18n="doc1_title">\${translations[currentLang]?.doc1_title || '1. Guía de Bienvenida'}</span> (Pasajero \${paxIndex})</h4>
                    <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem; text-align: left;">
                        <p data-i18n="doc1_desc">\${translations[currentLang]?.doc1_desc || 'Conoce todo lo necesario antes de tu salto.'}</p>
                    </div>
                    <button type="button" id="ag-btn-dl-bienvenida-\${paxIndex}" style="background: transparent; border: 1px solid #3b82f6; color: #3b82f6; width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">\${translations[currentLang]?.btn_pdf || 'Descargar Documento PDF'}</span>
                    </button>
                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: white; font-weight: bold;">
                        <input type="checkbox" id="ag-chk-bienvenida-\${paxIndex}" class="ag-legal-chk" data-pax="\${paxIndex}" style="accent-color: #10b981; width: 18px; height: 18px;">
                        <span data-i18n="doc_read_accept">\${translations[currentLang]?.doc_read_accept || 'He leído y acepto el documento'}</span>
                    </label>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-file-contract"></i> <span data-i18n="doc2_title">\${translations[currentLang]?.doc2_title || '2. Términos y Condiciones'}</span> (Pasajero \${paxIndex})</h4>
                    <button type="button" id="ag-btn-dl-terminos-\${paxIndex}" style="background: transparent; border: 1px solid #3b82f6; color: #3b82f6; width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">\${translations[currentLang]?.btn_pdf || 'Descargar'}</span>
                    </button>
                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: white; font-weight: bold;">
                        <input type="checkbox" id="ag-chk-terminos-\${paxIndex}" class="ag-legal-chk" data-pax="\${paxIndex}" style="accent-color: #10b981; width: 18px; height: 18px;">
                        <span data-i18n="doc_read_accept">\${translations[currentLang]?.doc_read_accept || 'Acepto'}</span>
                    </label>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-info-circle"></i> <span data-i18n="doc3_title">\${translations[currentLang]?.doc3_title || '3. Ficha Informativa'}</span> (Pasajero \${paxIndex})</h4>
                    <button type="button" id="ag-btn-dl-ficha-\${paxIndex}" style="background: transparent; border: 1px solid #3b82f6; color: #3b82f6; width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">\${translations[currentLang]?.btn_pdf || 'Descargar'}</span>
                    </button>
                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: white; font-weight: bold;">
                        <input type="checkbox" id="ag-chk-ficha-\${paxIndex}" class="ag-legal-chk" data-pax="\${paxIndex}" style="accent-color: #10b981; width: 18px; height: 18px;">
                        <span data-i18n="doc_read_accept">\${translations[currentLang]?.doc_read_accept || 'Acepto'}</span>
                    </label>
                </div>

                <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.3); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: #f59e0b; margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> <span data-i18n="doc4_title">\${translations[currentLang]?.doc4_title || '4. Exoneración'}</span> (Pasajero \${paxIndex})</h4>
                    <button type="button" id="ag-btn-dl-exo-\${paxIndex}" style="background: transparent; border: 1px solid #f59e0b; color: #f59e0b; width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">\${translations[currentLang]?.btn_pdf || 'Descargar'}</span>
                    </button>
                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: white; font-weight: bold;">
                        <input type="checkbox" id="ag-chk-exo-\${paxIndex}" class="ag-legal-chk" data-pax="\${paxIndex}" style="accent-color: #f59e0b; width: 18px; height: 18px;">
                        <span data-i18n="doc_read_accept">\${translations[currentLang]?.doc_read_accept || 'Acepto'}</span>
                    </label>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-camera"></i> <span data-i18n="selfie_title">\${translations[currentLang]?.selfie_title || 'Foto / Selfie'}</span> (Pasajero \${paxIndex})</h4>
                    <input type="file" id="ag-selfie-file-\${paxIndex}" class="form-control ag-selfie-input" accept="image/*" capture="user" data-pax="\${paxIndex}" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white;">
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-signature"></i> <span data-i18n="sig_title">\${translations[currentLang]?.sig_title || 'Firma'}</span> (Pasajero \${paxIndex})</h4>
                    <div style="background: white; border-radius: 8px; overflow: hidden; margin-bottom: 1rem; border: 2px dashed #cbd5e1;">
                        <canvas id="ag-signature-pad-\${paxIndex}" style="width: 100%; height: 200px; display: block; touch-action: none;"></canvas>
                    </div>
                    <button type="button" id="ag-btn-clear-sig-\${paxIndex}" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
                        <i class="fas fa-eraser"></i> <span data-i18n="clear">\${translations[currentLang]?.clear || 'Limpiar Firma'}</span>
                    </button>
                </div>
            \`;
        };

        const initLegalModulesForPax = (paxIndex) => {
            const container = document.getElementById('ag-legal-container-' + paxIndex);
            if (!container) return;
            container.innerHTML = getLegalHTML(paxIndex);

            // PDF Downloads
            ['bienvenida', 'terminos', 'ficha', 'exo'].forEach((docId, index) => {
                const btn = document.getElementById(\`ag-btn-dl-\${docId}-\${paxIndex}\`);
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const link = document.createElement('a');
                        const suffix = currentLang === 'en' ? '_EN' : '';
                        let filename = '';
                        if (index === 0) filename = '1_bienvenida' + suffix + '.pdf';
                        else if (index === 1) filename = '2_terminos_condiciones' + suffix + '.pdf';
                        else if (index === 2) filename = '3_ficha_informacion' + suffix + '.pdf';
                        else if (index === 3) filename = '4_exoneracion' + suffix + '.pdf';
                        
                        link.href = 'assets/docs/' + filename;
                        link.download = filename;
                        link.click();
                    });
                }
            });

            // Signature Pad Logic
            const canvas = document.getElementById(\`ag-signature-pad-\${paxIndex}\`);
            window.agIsSigned[paxIndex] = false;
            if(canvas) {
                const ctx = canvas.getContext('2d');
                let isDrawing = false;
                const resizeCanvas = () => {
                    const rect = canvas.parentElement.getBoundingClientRect();
                    canvas.width = rect.width || 300;
                    canvas.height = 200;
                };
                window.addEventListener('resize', resizeCanvas);
                resizeCanvas();

                const getPos = (e) => {
                    const rect = canvas.getBoundingClientRect();
                    let clientX = e.clientX, clientY = e.clientY;
                    if (e.touches && e.touches.length > 0) {
                        clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
                    }
                    return { x: clientX - rect.left, y: clientY - rect.top };
                };

                const startDrawing = (e) => {
                    isDrawing = true; window.agIsSigned[paxIndex] = true; checkFormValid();
                    const pos = getPos(e);
                    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
                };
                const draw = (e) => {
                    if (!isDrawing) return; e.preventDefault();
                    const pos = getPos(e);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke();
                };
                const stopDrawing = () => { isDrawing = false; };

                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', draw);
                canvas.addEventListener('mouseup', stopDrawing);
                canvas.addEventListener('mouseout', stopDrawing);
                canvas.addEventListener('touchstart', startDrawing, {passive: false});
                canvas.addEventListener('touchmove', draw, {passive: false});
                canvas.addEventListener('touchend', stopDrawing);

                document.getElementById(\`ag-btn-clear-sig-\${paxIndex}\`).addEventListener('click', () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    window.agIsSigned[paxIndex] = false;
                    checkFormValid();
                });
            }

            // Listeners for validation
            ['bienvenida', 'terminos', 'ficha', 'exo'].forEach(docId => {
                document.getElementById(\`ag-chk-\${docId}-\${paxIndex}\`)?.addEventListener('change', checkFormValid);
            });
            document.getElementById(\`ag-selfie-file-\${paxIndex}\`)?.addEventListener('change', checkFormValid);
        };

        const checkFormValid = () => {
            const qty = parseInt(document.getElementById('ag-qty')?.value) || 1;
            const btn = document.getElementById('ag-btn-confirm');
            if (!btn) return;
            
            let allValid = true;
            for (let i = 1; i <= qty; i++) {
                const c1 = document.getElementById(\`ag-chk-bienvenida-\${i}\`)?.checked;
                const c2 = document.getElementById(\`ag-chk-terminos-\${i}\`)?.checked;
                const c3 = document.getElementById(\`ag-chk-ficha-\${i}\`)?.checked;
                const c4 = document.getElementById(\`ag-chk-exo-\${i}\`)?.checked;
                const selfieInput = document.getElementById(\`ag-selfie-file-\${i}\`);
                const hasSelfie = selfieInput && selfieInput.files && selfieInput.files.length > 0;
                const signed = window.agIsSigned[i];
                
                if (!(c1 && c2 && c3 && c4 && hasSelfie && signed)) {
                    allValid = false;
                    break;
                }
            }
            btn.disabled = !allValid;
        };
`;
code = code.replace(initRegex, dynamicLogic);

// Remove the old PDF downloads logic and old Signature Pad logic
// This logic is currently from `// PDF Downloads` to the end of `checkFormValid` block.
const oldLogicRegex = /\/\/ PDF Downloads[\s\S]*?document\.getElementById\('ag-selfie-file'\)\?\.addEventListener\('change', checkFormValid\);/;
if (oldLogicRegex.test(code)) {
    code = code.replace(oldLogicRegex, '');
} else {
    console.log("Could not find old PDF/Signature logic to remove.");
}

// 3. Inject initLegalModulesForPax(1) after applying translations for the first time
const applyTransRegex = /applyTranslations\(\);\s*\/\/ initial apply/;
if (applyTransRegex.test(code)) {
    code = code.replace(applyTransRegex, `applyTranslations(); // initial apply\n            initLegalModulesForPax(1);`);
}

// 4. Update calculateLiveTotal() to append <div id="ag-legal-container-i"></div> and call initLegalModulesForPax(i)
const calculateTotalRegex = /html \+= \`[\s\S]*?<\/div>\\n\s*\`;/;
const newHtmlAppend = `html += \`
                                <h4 style="color: #3b82f6; font-size: 1rem; margin-top: 1rem; margin-bottom: 1rem; border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 1rem;"><i class="fas fa-user-plus"></i> Pasajero \${i}</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: #94a3b8; font-size: 0.9rem;">Nombre</label>
                                        <input type="text" id="ag-fname-\${i}" class="form-control" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white;" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: #94a3b8; font-size: 0.9rem;">Apellido</label>
                                        <input type="text" id="ag-lname-\${i}" class="form-control" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white;" required>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: #94a3b8; font-size: 0.9rem;">Documento / Pasaporte</label>
                                        <input type="text" id="ag-doc-\${i}" class="form-control" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white;" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: #94a3b8; font-size: 0.9rem;">Teléfono / WhatsApp</label>
                                        <input type="text" id="ag-phone-\${i}" class="form-control" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white;" required>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: #94a3b8; font-size: 0.9rem;">Correo Electrónico</label>
                                        <input type="email" id="ag-email-\${i}" class="form-control" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white;" placeholder="ejemplo@correo.com" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: #94a3b8; font-size: 0.9rem;">Peso (KG)</label>
                                        <input type="number" id="ag-weight-\${i}" class="form-control" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white;" required>
                                    </div>
                                </div>
                                <div class="ag-cam-section-extra" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: \${document.getElementById('ag-type').value === 'Salto Tandem' ? 'block' : 'none'};">
                                    <label style="color: #94a3b8; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; display: block;">Adicionales Pasajero \${i}</label>
                                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-bottom: 0.5rem; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="\${i}" value="Cámara Go-Pro" style="accent-color: #3b82f6; width: 16px; height: 16px;">
                                                <span style="color: white; font-size: 0.85rem;">Cámara Go-Pro</span>
                                            </div>
                                            <strong style="color: var(--brand-success); font-size: 0.85rem;">\${formatCurrency(prices.gopro)}</strong>
                                        </label>
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-bottom: 0.5rem; border-bottom: 1px dashed rgba(255,255,255,0.1);">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="\${i}" value="Cámara 360" style="accent-color: #3b82f6; width: 16px; height: 16px;">
                                                <span style="color: white; font-size: 0.85rem;">Cámara 360°</span>
                                            </div>
                                            <strong style="color: var(--brand-success); font-size: 0.85rem;">\${formatCurrency(prices.cam360)}</strong>
                                        </label>
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="\${i}" value="Cámara Externa" style="accent-color: #3b82f6; width: 16px; height: 16px;">
                                                <span style="color: white; font-size: 0.85rem;">Cámara Externa</span>
                                            </div>
                                            <strong style="color: var(--brand-success); font-size: 0.85rem;">\${formatCurrency(prices.ext)}</strong>
                                        </label>
                                    </div>
                                </div>
                                <div id="ag-legal-container-\${i}"></div>
                            \`;`;

if (calculateTotalRegex.test(code)) {
    code = code.replace(calculateTotalRegex, newHtmlAppend);
} else {
    console.log("Could not find calculateTotal loop regex.");
}

// And after the loop, we need to call initLegalModulesForPax(i) and applyTranslations()
const afterLoopRegex = /container\.innerHTML = html;\n\s*container\.dataset\.qty = String\(qty\);\n\s*\}\n\s*\} else \{\n\s*note\.style\.display = 'none';\n\s*container\.innerHTML = '';/;
const afterLoopFix = `container.innerHTML = html;
                        container.dataset.qty = String(qty);
                        for (let i = 2; i <= qty; i++) {
                            initLegalModulesForPax(i);
                        }
                    }
                } else {
                    note.style.display = 'none';
                    container.innerHTML = '';
                    container.dataset.qty = "1";
                }
                checkFormValid();`;

if (afterLoopRegex.test(code)) {
    code = code.replace(afterLoopRegex, afterLoopFix);
} else {
    console.log("Could not find afterLoopRegex.");
}

// 5. Update the submit event listener to generate a merged PDF of ALL passengers
const submitLogicRegex = /try \{[\s\S]*?const link = document\.createElement\('a'\);[\s\S]*?link\.click\(\);/;

const newSubmitLogic = `try {
                const { PDFDocument } = window.PDFLib;
                const suffix = currentLang === 'en' ? '_EN' : '';
                const files = [
                    '1_bienvenida' + suffix + '.pdf',
                    '2_terminos_condiciones' + suffix + '.pdf',
                    '3_ficha_informacion' + suffix + '.pdf',
                    '4_exoneracion' + suffix + '.pdf'
                ];

                const mergedPdf = await PDFDocument.create();
                const qty = parseInt(document.getElementById('ag-qty').value) || 1;

                for (let pax = 1; pax <= qty; pax++) {
                    const canvas = document.getElementById('ag-signature-pad-' + pax);
                    const sigDataUrl = canvas.toDataURL('image/png');
                    const pngImageBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());

                    for (const file of files) {
                        try {
                            const res = await fetch('assets/docs/' + file);
                            if (!res.ok) continue;
                            const arrayBuffer = await res.arrayBuffer();
                            const pdfDoc = await PDFDocument.load(arrayBuffer);
                            
                            const pngImage = await pdfDoc.embedPng(pngImageBytes);
                            
                            const pages = pdfDoc.getPages();
                            if (pages.length > 0) {
                                const lastPage = pages[pages.length - 1];
                                const { width, height } = lastPage.getSize();
                                const sigDims = pngImage.scale(0.5);
                                lastPage.drawImage(pngImage, {
                                    x: width / 2 - sigDims.width / 2,
                                    y: 50,
                                    width: sigDims.width,
                                    height: sigDims.height,
                                });
                            }
                            const modifiedBytes = await pdfDoc.save();
                            const modifiedDoc = await PDFDocument.load(modifiedBytes);
                            const copiedPages = await mergedPdf.copyPages(modifiedDoc, modifiedDoc.getPageIndices());
                            copiedPages.forEach(page => mergedPdf.addPage(page));
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
                
                const mergedPdfBytes = await mergedPdf.save();
                const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "Documentos_Firmados_Autogestion.pdf";
                link.click();`;

if (submitLogicRegex.test(code)) {
    code = code.replace(submitLogicRegex, newSubmitLogic);
} else {
    console.log("Could not find submitLogicRegex.");
}

// Ensure the old signature data extraction (const sigDataUrl = canvas.toDataURL...) is removed from the beginning of submit
const oldSigExtract = /const sigDataUrl = canvas\.toDataURL\('image\/png'\);/;
if (oldSigExtract.test(code)) {
    code = code.replace(oldSigExtract, '');
}

fs.writeFileSync('js/modules/autogestion.js', code, 'utf8');
console.log("Per passenger signatures updated successfully.");
