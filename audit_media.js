const fs = require('fs');
let code = fs.readFileSync('js/modules/media.js', 'utf8');

// 1. Inject escapeHTML
const regexInit = /init: \(\) => \{/;
const replaceInit = `init: () => {
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
        }`;
code = code.replace(regexInit, replaceInit);

// 2. Fix XSS in deliveryDetails
const regexDelivery = /const deliveryDetails = pax\.mediaDetails \? `<div style="font-size:0\.85rem; color:var\(--text-secondary\);">Enviado por: <strong>\$\{pax\.mediaDetails\.sender\}<\/strong><br>Medio: <strong>\$\{pax\.mediaDetails\.method\}<\/strong><br>Fecha: \$\{pax\.mediaDetails\.date\}<\/div>` : '<span style="color:var\(--text-secondary\); font-size:0\.85rem;">Pendiente<\/span>';/g;
code = code.replace(regexDelivery, 'const deliveryDetails = pax.mediaDetails ? `<div style="font-size:0.85rem; color:var(--text-secondary);">Enviado por: <strong>${escapeHTML(pax.mediaDetails.sender)}</strong><br>Medio: <strong>${escapeHTML(pax.mediaDetails.method)}</strong><br>Fecha: ${escapeHTML(pax.mediaDetails.date)}</div>` : \'<span style="color:var(--text-secondary); font-size:0.85rem;">Pendiente</span>\';');

// 3. Fix XSS in tbody tr
const regexTr = /<td style="padding: 1rem; font-weight: 500;">\$\{pax\.name\} \$\{pax\.lastname \|\| ''\}<\/td>\s*<td style="padding: 1rem;">\$\{pax\.doc\}<\/td>\s*<td style="padding: 1rem;"><span style="background: var\(--brand-blue-light\); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0\.85rem;">\$\{pax\.cams\}<\/span><\/td>/g;
code = code.replace(regexTr, '<td style="padding: 1rem; font-weight: 500;">${escapeHTML(pax.name)} ${escapeHTML(pax.lastname || "")}</td>\n                    <td style="padding: 1rem;">${escapeHTML(pax.doc)}</td>\n                    <td style="padding: 1rem;"><span style="background: var(--brand-blue-light); color: white; padding: 4px 8px; border-radius: 12px; font-size: 0.85rem;">${escapeHTML(pax.cams)}</span></td>');


fs.writeFileSync('js/modules/media.js', code, 'utf8');
console.log('media.js audited and refactored.');
