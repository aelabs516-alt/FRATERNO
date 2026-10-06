const fs = require('fs');
let code = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

// 1. Update HTML
const oldHtml = `
                    <div class="card" style="text-align: center; border: 1px solid var(--brand-warning); background: rgba(245, 158, 11, 0.05);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--brand-warning);"><i class="fas fa-exclamation-triangle"></i> Importante – Lectura de la Exoneración de Responsabilidad</h4>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; text-align: left;">
                            <p>Antes de finalizar su compra, es indispensable que lea detenidamente la Exoneración de Responsabilidad.</p>
                            <p>En este documento encontrará información importante sobre las condiciones de uso, alcance de la garantía, responsabilidades de las partes, requisitos de instalación, recomendaciones de uso y demás aspectos relacionados con el producto o servicio adquirido.</p>
                            <p><strong>Al continuar con la compra, usted declara que ha leído, comprendido y acepta los términos y condiciones establecidos en la Exoneración de Responsabilidad.</strong></p>
                            <p>Si tiene alguna duda sobre su contenido, le recomendamos solicitar asesoría antes de completar su compra.</p>
                        </div>
                        <button id="btn-download-exo" class="btn btn-outline" style="border-color: var(--brand-warning); color: var(--brand-warning); width: 100%; box-sizing: border-box;">
        <i class="fas fa-file-pdf"></i> Descargar Documento PDF
    </button>
                        <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; font-weight: bold; color: var(--text-primary); margin-top: 1rem;">
                            <input type="checkbox" style="width: 20px; height: 20px;" required>
                            <span>He leído y acepto la Exoneración de Responsabilidad</span>
                        </label>
                    </div>`;

// We use regex to match ignoring minor whitespace issues
const htmlRegex = /<div class="card" style="text-align: center; border: 1px solid var\(--brand-warning\); background: rgba\(245, 158, 11, 0\.05\);">[\s\S]*?<h4[^>]*>.*?Importante.*?<\/h4>[\s\S]*?<div[^>]*>[\s\S]*?<p>Antes de finalizar.*?<\/p>[\s\S]*?<p>En este documento.*?<\/p>[\s\S]*?<p><strong>Al continuar.*?<\/strong><\/p>[\s\S]*?<p>Si tiene alguna duda.*?<\/p>[\s\S]*?<\/div>[\s\S]*?<button id="btn-download-exo"[^>]*>[\s\S]*?<\/button>[\s\S]*?<label[^>]*>[\s\S]*?<input type="checkbox"[^>]*>[\s\S]*?<span>He le.*?<\/span>[\s\S]*?<\/label>[\s\S]*?<\/div>/;

const newHtml = `
                    <div class="card" style="text-align: center; border: 1px solid var(--brand-warning); background: rgba(245, 158, 11, 0.05);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--brand-warning);"><i class="fas fa-exclamation-triangle"></i> <span data-i18n="exo_title">Importante – Lectura de la Exoneración de Responsabilidad</span></h4>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; text-align: left;">
                            <p data-i18n="exo_p1">Antes de finalizar su compra, es indispensable que lea detenidamente la Exoneración de Responsabilidad.</p>
                            <p data-i18n="exo_p2">En este documento encontrará información importante sobre las condiciones de uso, alcance de la garantía, responsabilidades de las partes, requisitos de instalación, recomendaciones de uso y demás aspectos relacionados con el producto o servicio adquirido.</p>
                            <p><strong data-i18n="exo_p3">Al continuar con la compra, usted declara que ha leído, comprendido y acepta los términos y condiciones establecidos en la Exoneración de Responsabilidad.</strong></p>
                            <p data-i18n="exo_p4">Si tiene alguna duda sobre su contenido, le recomendamos solicitar asesoría antes de completar su compra.</p>
                        </div>
                        <button id="btn-download-exo" class="btn btn-outline" style="border-color: var(--brand-warning); color: var(--brand-warning); width: 100%; box-sizing: border-box;">
                            <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar Documento PDF</span>
                        </button>
                        <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; font-weight: bold; color: var(--text-primary); margin-top: 1rem;">
                            <input type="checkbox" style="width: 20px; height: 20px;" required>
                            <span data-i18n="exo_check">He leído y acepto la Exoneración de Responsabilidad</span>
                        </label>
                    </div>`;

if (htmlRegex.test(code)) {
    code = code.replace(htmlRegex, newHtml);
    console.log("HTML replaced.");
} else {
    console.log("Regex HTML match failed!");
}

// 2. Update Translations
// For 'es'
const esTranslations = `
                medical_ph: "Especificaciones de salud (opcional)",
                btn_understood2: "¡Entendido! 👍",
                exo_title: "Importante – Lectura de la Exoneración de Responsabilidad",
                exo_p1: "Antes de finalizar su compra, es indispensable que lea detenidamente la Exoneración de Responsabilidad.",
                exo_p2: "En este documento encontrará información importante sobre las condiciones de uso, alcance de la garantía, responsabilidades de las partes, requisitos de instalación, recomendaciones de uso y demás aspectos relacionados con el producto o servicio adquirido.",
                exo_p3: "Al continuar con la compra, usted declara que ha leído, comprendido y acepta los términos y condiciones establecidos en la Exoneración de Responsabilidad.",
                exo_p4: "Si tiene alguna duda sobre su contenido, le recomendamos solicitar asesoría antes de completar su compra.",
                exo_check: "He leído y acepto la Exoneración de Responsabilidad",
`;
code = code.replace(/medical_ph: "Especificaciones de salud \(opcional\)",\s*btn_understood2: ".*?Entendido!.*?",/, esTranslations);

// For 'en'
const enTranslations = `
                medical_ph: "Health specifications (optional)",
                btn_understood2: "Understood! 👍",
                exo_title: "Important – Please Read the Liability Waiver",
                exo_p1: "Before completing your purchase, it is essential that you carefully read the Liability Waiver.",
                exo_p2: "This document contains important information regarding the terms of use, warranty coverage, responsibilities of each party, installation requirements, usage recommendations, and other relevant details related to the product or service you are purchasing.",
                exo_p3: "By proceeding with your purchase, you acknowledge that you have read, understood, and agreed to the terms and conditions outlined in the Liability Waiver.",
                exo_p4: "If you have any questions regarding its contents, we recommend contacting us for assistance before completing your purchase.",
                exo_check: "I have read and accept the Liability Waiver",
`;
code = code.replace(/medical_ph: "Health specifications \(optional\)",\s*btn_understood2: ".*?Understood!.*?",/, enTranslations);

// 3. Update generatePDF to use currentLang
const pdfLogicRegex = /if \(type === 'terminos'\) \{[\s\S]*?\} else \{[\s\S]*?\}/;
const newPdfLogic = `
            if (type === 'terminos') {
                if (currentLang === 'en' && window.TerminosTextEn) {
                    title = "TERMS AND CONDITIONS";
                    filename = "Terms_and_Conditions_Fraterno.pdf";
                    text = window.TerminosTextEn;
                } else {
                    title = "TÉRMINOS Y CONDICIONES";
                    filename = "Terminos_y_Condiciones_Fraterno.pdf";
                    text = window.TerminosText || "Términos y condiciones...";
                }
            } else {
                if (currentLang === 'en' && window.ExoneracionTextEn) {
                    title = "LIABILITY WAIVER";
                    filename = "Liability_Waiver_Fraterno.pdf";
                    text = window.ExoneracionTextEn;
                } else {
                    title = "EXONERACIÓN DE RESPONSABILIDAD";
                    filename = "Exoneracion_Responsabilidad_Fraterno.pdf";
                    text = window.ExoneracionText || "Declaración de exoneración...";
                }
            }
`;
if (pdfLogicRegex.test(code)) {
    code = code.replace(pdfLogicRegex, newPdfLogic);
    console.log("PDF logic replaced.");
} else {
    console.log("PDF logic regex failed!");
}

fs.writeFileSync('js/modules/b2c-form.js', code, 'utf8');
console.log('UI texts updated.');
