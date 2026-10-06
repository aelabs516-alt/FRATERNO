const fs = require('fs');

let code = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

const regex = /<div class="card" style="text-align: center;">\s*<h4 style="margin-bottom: 0\.5rem;" data-i18n="selfie_title">Foto \/ Selfie de Seguridad<\/h4>/;

const replacement = `
                    <div class="card" style="text-align: center; border: 1px solid var(--brand-warning); background: rgba(245, 158, 11, 0.05);">
                        <h4 style="margin-bottom: 0.5rem; color: var(--brand-warning);"><i class="fas fa-exclamation-triangle"></i> Importante – Lectura de la Exoneración de Responsabilidad</h4>
                        <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; text-align: left;">
                            <p>Antes de finalizar su compra, es indispensable que lea detenidamente la Exoneración de Responsabilidad.</p>
                            <p>En este documento encontrará información importante sobre las condiciones de uso, alcance de la garantía, responsabilidades de las partes, requisitos de instalación, recomendaciones de uso y demás aspectos relacionados con el producto o servicio adquirido.</p>
                            <p><strong>Al continuar con la compra, usted declara que ha leído, comprendido y acepta los términos y condiciones establecidos en la Exoneración de Responsabilidad.</strong></p>
                            <p>Si tiene alguna duda sobre su contenido, le recomendamos solicitar asesoría antes de completar su compra.</p>
                        </div>
                        <a href="assets/docs/Exoneracion_Responsabilidad.pdf" download="Exoneracion_Responsabilidad.pdf" class="btn btn-outline" style="border-color: var(--brand-warning); color: var(--brand-warning); width: 100%; display: inline-block; box-sizing: border-box;">
                            <i class="fas fa-file-pdf"></i> Descargar Documento PDF
                        </a>
                        <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; font-weight: bold; color: var(--text-primary); margin-top: 1rem;">
                            <input type="checkbox" style="width: 20px; height: 20px;" required>
                            <span>He leído y acepto la Exoneración de Responsabilidad</span>
                        </label>
                    </div>

                    <div class="card" style="text-align: center;">
                        <h4 style="margin-bottom: 0.5rem;" data-i18n="selfie_title">Foto / Selfie de Seguridad</h4>`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('js/modules/b2c-form.js', code, 'utf8');
    console.log('Successfully injected Exoneration section.');
} else {
    console.log('Failed to find insertion point.');
}

// Ensure assets/docs directory exists
const docsDir = 'assets/docs';
if (!fs.existsSync(docsDir)){
    fs.mkdirSync(docsDir, { recursive: true });
}
