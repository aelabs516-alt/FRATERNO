const fs = require('fs');
let code = fs.readFileSync('js/modules/inventory.js', 'utf8');

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

// 2. Fix XSS in renderTandems (Table and List)
const regexRigId = /<h4 style="margin: 0; font-size: 1\.2rem;">Equipo \$\{rig\.id\}<\/h4>/g;
code = code.replace(regexRigId, '<h4 style="margin: 0; font-size: 1.2rem;">Equipo ${escapeHTML(rig.id)}</h4>');

const regexRigId2 = /<td style="font-weight: bold; padding: 1rem;">\$\{rig\.id\}<\/td>/g;
code = code.replace(regexRigId2, '<td style="font-weight: bold; padding: 1rem;">${escapeHTML(rig.id)}</td>');

const regexPartSerial = /<strong>EAN:<\/strong> \$\{part\.serial \|\| '-'\}/g;
code = code.replace(regexPartSerial, '<strong>EAN:</strong> ${escapeHTML(part.serial || "-")}');

const regexPartNameSerial = /<span>\$\{partName\} \(\$\{part\.serial\}\)<\/span>/g;
code = code.replace(regexPartNameSerial, '<span>${partName} (${escapeHTML(part.serial)})</span>');

// 3. Fix XSS in renderAccesorios
const regexAccSerial = /<h4 style="margin: 0; font-size: 1\.1rem;">\$\{item\.serial\}<\/h4>/g;
code = code.replace(regexAccSerial, '<h4 style="margin: 0; font-size: 1.1rem;">${escapeHTML(item.serial)}</h4>');

const regexAccModel = /<span style="font-size: 0\.8rem; color: var\(--text-secondary\);">\$\{item\.model\}<\/span>/g;
code = code.replace(regexAccModel, '<span style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHTML(item.model)}</span>');

// 4. Fix XSS in renderFunTable
const regexFunRigId = /<td style="font-weight: bold; padding: 1rem;">\$\{r\.id\}<\/td>/g;
code = code.replace(regexFunRigId, '<td style="font-weight: bold; padding: 1rem;">${escapeHTML(r.id)}</td>');

const regexFunEan = /<strong>EAN:<\/strong> \$\{p\.ean \|\| '-'\}/g;
code = code.replace(regexFunEan, '<strong>EAN:</strong> ${escapeHTML(p.ean || "-")}');


fs.writeFileSync('js/modules/inventory.js', code, 'utf8');
console.log('inventory.js audited and refactored.');
