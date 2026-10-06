const fs = require('fs');
let code = fs.readFileSync('js/modules/historySearch.js', 'utf8');

const signatureHtmlBlock = `
            let signatureHtml = '';
            if (client.signature) {
                signatureHtml = \`
                <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); font-size: 1.1rem;"><i class="fas fa-file-signature" style="color: var(--brand-action); margin-right: 0.5rem;"></i> Documento Legal y Firma (Exoneración de Responsabilidades)</h4>
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0; line-height: 1.6; font-style: italic;">"Al firmar este documento, declaro que he leído, entendido y aceptado todos los términos y condiciones, así como el documento de exoneración de responsabilidades inherentes a la práctica del paracaidismo. Asumo voluntariamente todos los riesgos."</p>
                        <div style="margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.02); padding: 1.5rem; border-radius: 8px; border: 1px dashed var(--border-color);">
                            <strong style="display: block; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Firma del Pasajero</strong>
                            <img src="\${client.signature}" alt="Firma del Pasajero" style="max-width: 100%; height: 120px; background: white; border-radius: 4px; padding: 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        </div>
                    </div>
                </div>
                \`;
            }
`;

code = code.replace(
    'detailsBody.innerHTML = `', 
    signatureHtmlBlock + '\n            detailsBody.innerHTML = `'
);

code = code.replace(
    /(\$\{jumpsHtml\}\s*<\/div>\s*)`;/, 
    '$1${signatureHtml}\n            `;'
);

fs.writeFileSync('js/modules/historySearch.js', code);
console.log('Successfully injected signature UI in historySearch.js');
