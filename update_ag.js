const fs = require('fs');

let code = fs.readFileSync('js/modules/autogestion.js', 'utf8');

// 1. Inyectar Lógica de Traducciones y Componentes
const translationsJS = `
    const translations = {
        es: {
            title: "Reserva tu Aventura",
            personal_data: "Datos Personales",
            fname: "Nombre",
            lname: "Apellido",
            doc: "Documento / Pasaporte",
            phone: "Teléfono / WhatsApp",
            email: "Correo Electrónico",
            weight: "Peso (KG)",
            group_title: "Procedimiento para Reservas de Grupos",
            group_understood: "¡Entendido! ✅",
            jump_detail: "Detalle de Salto",
            jump_type: "Tipo de Experiencia",
            qty: "Cant. Personas",
            addons: "Adicionales Pasajero",
            cam_gopro: "Cámara Go-Pro",
            cam_360: "Cámara 360° Interactiva",
            cam_ext: "Cámara Externa",
            total: "Total Estimado:",
            date: "Fecha Deseada",
            doc1_title: "1. Guía de Bienvenida",
            doc1_desc: "Conoce todo lo necesario antes de tu salto. Información general y recomendaciones clave.",
            doc2_title: "2. Términos y Condiciones de la Operación",
            doc2_desc: "Regulaciones operativas, políticas de reagendamiento y condiciones del servicio.",
            doc3_title: "3. Ficha Informativa",
            doc3_desc: "Información detallada sobre el equipo, seguridad y desarrollo de la actividad.",
            doc4_title: "4. Exoneración de Responsabilidad",
            exo_p1: "Antes de finalizar su compra, es indispensable que lea detenidamente la Exoneración de Responsabilidad.",
            exo_p2: "En este documento encontrará información importante sobre las condiciones de uso, alcance de la garantía, responsabilidades de las partes, requisitos de instalación, recomendaciones de uso y demás aspectos relacionados con el producto o servicio adquirido.",
            exo_p3: "Al continuar con la compra, usted declara que ha leído, comprendido y acepta los términos y condiciones establecidos en la Exoneración de Responsabilidad.",
            btn_pdf: "Descargar Documento PDF",
            doc_read_accept: "He leído y acepto el documento",
            selfie_title: "Foto / Selfie de Seguridad",
            selfie_desc: "Para validar tu identidad, por favor toma o sube una fotografía frontal (selfie).",
            sig_title: "Firma del Pasajero",
            sig_desc: "Por favor, firma en el cuadro inferior. Esta firma se estampará en los documentos legales y es equivalente a tu firma física.",
            clear: "Limpiar Firma",
            btn_confirm: "Confirmar Reserva",
            alert_check: "Debes leer y aceptar todos los documentos obligatorios.",
            alert_selfie: "Falta foto / selfie de seguridad.",
            alert_sig: "Falta firmar.",
            alert_processing: "Procesando Documentos...",
            alert_success: "¡Registro y firma completados exitosamente!",
            alert_error: "Error al procesar los PDFs."
        },
        en: {
            title: "Book your Adventure",
            personal_data: "Personal Data",
            fname: "First Name",
            lname: "Last Name",
            doc: "ID / Passport",
            phone: "Phone / WhatsApp",
            email: "Email Address",
            weight: "Weight (KG)",
            group_title: "Group Booking Procedure",
            group_understood: "Understood! ✅",
            jump_detail: "Jump Details",
            jump_type: "Experience Type",
            qty: "Pax Qty",
            addons: "Add-ons Passenger",
            cam_gopro: "Go-Pro Camera",
            cam_360: "360° Interactive Camera",
            cam_ext: "External Camera",
            total: "Estimated Total:",
            date: "Desired Date",
            doc1_title: "1. Welcome Guide",
            doc1_desc: "Learn everything you need before your jump. General information and key recommendations.",
            doc2_title: "2. Operation Terms and Conditions",
            doc2_desc: "Operational regulations, rescheduling policies, and service conditions.",
            doc3_title: "3. Information Sheet",
            doc3_desc: "Detailed information about equipment, security, and activity development.",
            doc4_title: "4. Liability Waiver",
            exo_p1: "Important – Please Read the Liability Waiver. Before completing your purchase, it is essential that you carefully read the Liability Waiver.",
            exo_p2: "This document contains important information regarding the terms of use, warranty coverage, responsibilities of each party, installation requirements, usage recommendations, and other relevant details related to the product or service you are purchasing.",
            exo_p3: "By proceeding with your purchase, you acknowledge that you have read, understood, and agreed to the terms and conditions outlined in the Liability Waiver.",
            btn_pdf: "Download PDF Document",
            doc_read_accept: "I have read and accept the document",
            selfie_title: "Security Photo / Selfie",
            selfie_desc: "To validate your identity, please take or upload a frontal photo (selfie).",
            sig_title: "Passenger Signature",
            sig_desc: "Please sign in the box below. This signature will be stamped on the legal documents and is equivalent to your physical signature.",
            clear: "Clear Signature",
            btn_confirm: "Confirm Booking",
            alert_check: "You must read and accept all mandatory documents.",
            alert_selfie: "Security photo / selfie is missing.",
            alert_sig: "Signature is missing.",
            alert_processing: "Processing Documents...",
            alert_success: "Registration and signature successfully completed!",
            alert_error: "Error processing PDFs."
        }
    };
    let currentLang = 'es';
    const applyTranslations = () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (translations[currentLang][key]) {
                el.placeholder = translations[currentLang][key];
            }
        });
    };
`;

const htmlInjection = `
                                <!-- Selector de Idioma -->
                                <div style="position: absolute; top: 1rem; right: 2rem;">
                                    <select id="ag-lang-select" style="background: rgba(15, 23, 42, 0.8); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 0.5rem; border-radius: 8px;">
                                        <option value="es">Español</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
`;

// Insert the language selector just inside the form container
code = code.replace(/<div style="background: rgba\(30, 41, 59, 0\.7\); backdrop-filter: blur\(15px\); border: 1px solid rgba\(255,255,255,0\.1\); border-radius: 24px; padding: 3rem; box-shadow: 0 25px 50px -12px rgba\(0,0,0,0\.5\);">/, 
    match => match + htmlInjection);

// Replace headings and labels with data-i18n attributes in the form
const formReplacements = [
    { from: />Reserva tu Aventura<\/h2>/, to: ' data-i18n="title">Reserva tu Aventura</h2>' },
    { from: />Datos Personales<\/h3>/, to: ' data-i18n="personal_data">Datos Personales</h3>' },
    { from: />Nombre<\/label>/, to: ' data-i18n="fname">Nombre</label>' },
    { from: />Apellido<\/label>/, to: ' data-i18n="lname">Apellido</label>' },
    { from: />Documento \/ Pasaporte<\/label>/, to: ' data-i18n="doc">Documento / Pasaporte</label>' },
    { from: />Teléfono \/ WhatsApp<\/label>/, to: ' data-i18n="phone">Teléfono / WhatsApp</label>' },
    { from: />Correo Electrónico<\/label>/, to: ' data-i18n="email">Correo Electrónico</label>' },
    { from: />Peso \(KG\)<\/label>/, to: ' data-i18n="weight">Peso (KG)</label>' },
    { from: />Detalle de Salto<\/h3>/, to: ' data-i18n="jump_detail">Detalle de Salto</h3>' },
    { from: />Tipo de Experiencia<\/label>/, to: ' data-i18n="jump_type">Tipo de Experiencia</label>' },
    { from: />Cant\. Personas<\/label>/, to: ' data-i18n="qty">Cant. Personas</label>' },
    { from: />Total Estimado:<\/span>/, to: ' data-i18n="total">Total Estimado:</span>' },
    { from: />Fecha Deseada<\/label>/, to: ' data-i18n="date">Fecha Deseada</label>' },
    { from: />Confirmar Reserva\s*<\/button>/, to: ' data-i18n="btn_confirm">Confirmar Reserva\n                                </button>' }
];
formReplacements.forEach(rep => {
    code = code.replace(rep.from, rep.to);
});

// We need to inject the 4 legal documents right before the Confirm button.
const legalModulesHtml = `
                                <!-- 1. Guía de Bienvenida -->
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-book-open"></i> <span data-i18n="doc1_title">1. Guía de Bienvenida</span></h4>
                                    <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem; text-align: left;">
                                        <p data-i18n="doc1_desc">Conoce todo lo necesario antes de tu salto. Información general y recomendaciones clave.</p>
                                    </div>
                                    <button type="button" id="ag-btn-dl-bienvenida" style="background: transparent; border: 1px solid #3b82f6; color: #3b82f6; width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar Documento PDF</span>
                                    </button>
                                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: white; font-weight: bold;">
                                        <input type="checkbox" id="ag-chk-bienvenida" style="accent-color: #10b981; width: 18px; height: 18px;">
                                        <span data-i18n="doc_read_accept">He leído y acepto el documento</span>
                                    </label>
                                </div>

                                <!-- 2. Términos y Condiciones -->
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-file-contract"></i> <span data-i18n="doc2_title">2. Términos y Condiciones de la Operación</span></h4>
                                    <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem; text-align: left;">
                                        <p data-i18n="doc2_desc">Regulaciones operativas, políticas de reagendamiento y condiciones del servicio.</p>
                                    </div>
                                    <button type="button" id="ag-btn-dl-terminos" style="background: transparent; border: 1px solid #3b82f6; color: #3b82f6; width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar Documento PDF</span>
                                    </button>
                                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: white; font-weight: bold;">
                                        <input type="checkbox" id="ag-chk-terminos" style="accent-color: #10b981; width: 18px; height: 18px;">
                                        <span data-i18n="doc_read_accept">He leído y acepto el documento</span>
                                    </label>
                                </div>

                                <!-- 3. Ficha Informativa -->
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-info-circle"></i> <span data-i18n="doc3_title">3. Ficha Informativa</span></h4>
                                    <div style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem; text-align: left;">
                                        <p data-i18n="doc3_desc">Información detallada sobre el equipo, seguridad y desarrollo de la actividad.</p>
                                    </div>
                                    <button type="button" id="ag-btn-dl-ficha" style="background: transparent; border: 1px solid #3b82f6; color: #3b82f6; width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar Documento PDF</span>
                                    </button>
                                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: white; font-weight: bold;">
                                        <input type="checkbox" id="ag-chk-ficha" style="accent-color: #10b981; width: 18px; height: 18px;">
                                        <span data-i18n="doc_read_accept">He leído y acepto el documento</span>
                                    </label>
                                </div>

                                <!-- 4. Exoneración -->
                                <div style="background: rgba(245, 158, 11, 0.05); border: 1px solid rgba(245, 158, 11, 0.3); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                                    <h4 style="margin-top: 0; color: #f59e0b; margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> <span data-i18n="doc4_title">4. Exoneración de Responsabilidad</span></h4>
                                    <div style="font-size: 0.85rem; color: #cbd5e1; margin-bottom: 1rem; text-align: left;">
                                        <p data-i18n="exo_p1">Antes de finalizar su compra, es indispensable que lea detenidamente la Exoneración de Responsabilidad.</p>
                                        <p data-i18n="exo_p2">En este documento encontrará información importante sobre las condiciones de uso, alcance de la garantía, responsabilidades de las partes, requisitos de instalación, recomendaciones de uso y demás aspectos relacionados con el producto o servicio adquirido.</p>
                                        <p><strong data-i18n="exo_p3">Al continuar con la compra, usted declara que ha leído, comprendido y acepta los términos y condiciones establecidos en la Exoneración de Responsabilidad.</strong></p>
                                    </div>
                                    <button type="button" id="ag-btn-dl-exo" style="background: transparent; border: 1px solid #f59e0b; color: #f59e0b; width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar Documento PDF</span>
                                    </button>
                                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: white; font-weight: bold;">
                                        <input type="checkbox" id="ag-chk-exo" style="accent-color: #f59e0b; width: 18px; height: 18px;">
                                        <span data-i18n="doc_read_accept">He leído y acepto el documento</span>
                                    </label>
                                </div>

                                <!-- Selfie -->
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-camera"></i> <span data-i18n="selfie_title">Foto / Selfie de Seguridad</span></h4>
                                    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;" data-i18n="selfie_desc">Para validar tu identidad, por favor toma o sube una fotografía frontal (selfie).</p>
                                    <input type="file" id="ag-selfie-file" class="form-control" accept="image/*" capture="user" style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255,255,255,0.1); color: white;">
                                </div>

                                <!-- Signature Pad -->
                                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2.5rem; text-align: center;">
                                    <h4 style="margin-top: 0; color: #3b82f6; margin-bottom: 0.5rem;"><i class="fas fa-signature"></i> <span data-i18n="sig_title">Firma del Pasajero</span></h4>
                                    <p style="font-size: 0.85rem; color: #94a3b8; margin-bottom: 1rem;" data-i18n="sig_desc">Por favor, firma en el cuadro inferior. Esta firma se estampará en los documentos legales y es equivalente a tu firma física.</p>
                                    <div style="background: white; border-radius: 8px; overflow: hidden; margin-bottom: 1rem; border: 2px dashed #cbd5e1;">
                                        <canvas id="ag-signature-pad" style="width: 100%; height: 200px; display: block; touch-action: none;"></canvas>
                                    </div>
                                    <button type="button" id="ag-btn-clear-sig" style="background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #cbd5e1; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
                                        <i class="fas fa-eraser"></i> <span data-i18n="clear">Limpiar Firma</span>
                                    </button>
                                </div>
`;

code = code.replace(/<button type="submit" class="btn"[^>]*>[\s\S]*?Confirmar Reserva[\s\S]*?<\/button>/, match => legalModulesHtml + '\n' + match);

// We need to disable the button initially.
code = code.replace(/<button type="submit" class="btn"/, '<button type="submit" id="ag-btn-confirm" class="btn" disabled');

// 2. Insert the translation function and listeners in init: () => {
const initLogic = `
        ${translationsJS}
        const langSelect = document.getElementById('ag-lang-select');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                currentLang = e.target.value;
                applyTranslations();
            });
            applyTranslations(); // initial apply
        }

        // PDF Downloads
        ['bienvenida', 'terminos', 'ficha', 'exo'].forEach((docId, index) => {
            const btn = document.getElementById('ag-btn-dl-' + docId);
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
        const canvas = document.getElementById('ag-signature-pad');
        let ctx = null, isDrawing = false, isCanvasSigned = false;
        if(canvas) {
            ctx = canvas.getContext('2d');
            const resizeCanvas = () => {
                const rect = canvas.parentElement.getBoundingClientRect();
                canvas.width = rect.width;
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
                isDrawing = true; isCanvasSigned = true; checkFormValid();
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

            document.getElementById('ag-btn-clear-sig').addEventListener('click', () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                isCanvasSigned = false;
                checkFormValid();
            });
        }

        const checkFormValid = () => {
            const c1 = document.getElementById('ag-chk-bienvenida')?.checked;
            const c2 = document.getElementById('ag-chk-terminos')?.checked;
            const c3 = document.getElementById('ag-chk-ficha')?.checked;
            const c4 = document.getElementById('ag-chk-exo')?.checked;
            const selfieInput = document.getElementById('ag-selfie-file');
            const hasSelfie = selfieInput && selfieInput.files && selfieInput.files.length > 0;
            const btn = document.getElementById('ag-btn-confirm');
            if (btn) btn.disabled = !(c1 && c2 && c3 && c4 && hasSelfie && isCanvasSigned);
        };

        ['ag-chk-bienvenida', 'ag-chk-terminos', 'ag-chk-ficha', 'ag-chk-exo'].forEach(id => {
            document.getElementById(id)?.addEventListener('change', checkFormValid);
        });
        document.getElementById('ag-selfie-file')?.addEventListener('change', checkFormValid);
`;

code = code.replace(/init: \(\) => \{/, 'init: () => {\n' + initLogic);

// Modify the submit event listener logic to process PDFs.
// Currently it's: form.addEventListener('submit', (e) => { e.preventDefault(); ... window.location.hash = '#/'; });
const newSubmitLogic = `
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btnFinish = document.getElementById('ag-btn-confirm');
            
            const fname = document.getElementById('ag-fname').value;
            const lname = document.getElementById('ag-lname').value;
            const sigDataUrl = canvas.toDataURL('image/png');

            btnFinish.disabled = true;
            btnFinish.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (translations[currentLang]?.alert_processing || 'Procesando...');

            try {
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
                        if (!res.ok) continue;
                        const arrayBuffer = await res.arrayBuffer();
                        const pdfDoc = await PDFDocument.load(arrayBuffer);
                        
                        const pngImageBytes = await fetch(sigDataUrl).then(res => res.arrayBuffer());
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
                const mergedPdfBytes = await mergedPdf.save();
                const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = "Documentos_Firmados_Autogestion.pdf";
                link.click();

                // Generate booking logic ...
`;

const submitRegex = /form\.addEventListener\('submit',\s*\([^)]*\)\s*=>\s*\{[\s\S]*?e\.preventDefault\(\);/;
code = code.replace(submitRegex, newSubmitLogic);

// Restore original success alert and redirect at the end of the submit logic
const submitEndRegex = /alert\('¡Reserva confirmada exitosamente!'\);\s*window\.location\.hash = '#\/';\s*\}\);/;
const newSubmitEnd = `alert(translations[currentLang]?.alert_success || '¡Registro y firma completados exitosamente!');
                window.location.hash = '#/';
            } catch (err) {
                console.error(err);
                alert(translations[currentLang]?.alert_error || 'Error al procesar los PDFs.');
                btnFinish.disabled = false;
                btnFinish.innerHTML = translations[currentLang]?.btn_confirm || 'Confirmar Reserva';
            }
        });`;
code = code.replace(submitEndRegex, newSubmitEnd);

fs.writeFileSync('js/modules/autogestion.js', code, 'utf8');
console.log('Autogestion redesign complete.');
