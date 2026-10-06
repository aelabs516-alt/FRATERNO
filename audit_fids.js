const fs = require('fs');
let code = fs.readFileSync('js/modules/fids.js', 'utf8');

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

// 2. Fix XSS in renderFids
const regexTr = /newHtmlRows\.push\(\`([\s\S]*?)<td(.*?)>\$\{vCol\}<\/td>([\s\S]*?)<td(.*?)>\$\{p\.name\}<\/td>([\s\S]*?)<span(.*?)>\$\{instName\}<\/span>([\s\S]*?)<td(.*?)>\$\{p\.aeronave\}<\/td>([\s\S]*?)\`\);/;
code = code.replace(regexTr, (match, p1, p2, p3, p4, p5, p6, p7, p8, p9) => {
    return `newHtmlRows.push(\`${p1}<td${p2}>\${vCol}</td>${p3}<td${p4}>\${escapeHTML(p.name)}</td>${p5}<span${p6}>\${escapeHTML(instName)}</span>${p7}<td${p8}>\${escapeHTML(p.aeronave)}</td>${p9}\`);`;
});

const regexVcol = /vCol = \`<div(.*?)>\$\{fNum\}<\/div>\`;/;
code = code.replace(regexVcol, 'vCol = `<div$1>${escapeHTML(fNum)}</div>`;');

fs.writeFileSync('js/modules/fids.js', code, 'utf8');
console.log('fids.js audited and refactored.');
