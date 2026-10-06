const fs = require('fs');
let code = fs.readFileSync('js/modules/booking.js', 'utf8');

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

// 2. Fix getPrice in btn-confirm-edit-res
const regexGetPrice = /const getPrice = \(name\) => \{[\s\S]*?return item && item\.price \? parseInt\(item\.price\.replace\(\/\\\.\/g, ''\)\) \|\| 0 : 0;\s*\};/;
const replaceGetPrice = `const getPrice = (name) => {
                const item = (window.AppData.maestroValores || []).find(x => x.name === name);
                return item && item.price ? parseInt(String(item.price).replace(/\\D/g, ''), 10) || 0 : 0;
            };`;
code = code.replace(regexGetPrice, replaceGetPrice);

// 3. Fix XSS in renderPaxList
const regexRenderPaxListMap = /paxList\.innerHTML = paxArray\.map\(p => \{([\s\S]*?)return \`([\s\S]*?)\`;\s*\}\)\.join\(''\);/;
code = code.replace(regexRenderPaxListMap, (match, body, template) => {
    // Add escape functions to body variables
    const safeBody = body
        .replace(/p\.observacionesCancelacion/g, 'escapeHTML(p.observacionesCancelacion)');
    
    const safeTemplate = template
        .replace(/\$\{p\.name\}/g, '${escapeHTML(p.name)}')
        .replace(/\$\{p\.type\}/g, '${escapeHTML(p.type)}')
        .replace(/\$\{p\.doc\}/g, '${escapeHTML(p.doc)}')
        .replace(/\$\{p\.phone\}/g, '${escapeHTML(p.phone)}')
        .replace(/\$\{p\.date\}/g, '${escapeHTML(p.date)}')
        .replace(/\$\{p\.time \|\| 'N\/A'\}/g, "${escapeHTML(p.time || 'N/A')}")
        .replace(/\$\{p\.aeronave\}/g, '${escapeHTML(p.aeronave)}');
        
    return `paxList.innerHTML = paxArray.map(p => {${safeBody}return \`${safeTemplate}\`;\n            }).join('');`;
});


fs.writeFileSync('js/modules/booking.js', code, 'utf8');
console.log('booking.js audited and refactored.');
