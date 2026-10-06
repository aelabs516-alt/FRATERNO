const fs = require('fs');
let code = fs.readFileSync('js/modules/autogestion.js', 'utf8');

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

// 2. Fix XSS in the success message
const regexSuccess = /form\.innerHTML = \`([\s\S]*?)Hola \$\{name\}, tu reserva para el \$\{date\} ha sido registrada con éxito\$\{qty > 1 \? \` para \$\{qty\} personas\` : ''\}\.([\s\S]*?)Te esperamos en la Dropzone para tu \$\{type\}\.([\s\S]*?)\`;/g;
code = code.replace(regexSuccess, (match, p1, p2, p3) => {
    return `form.innerHTML = \`${p1}Hola \${escapeHTML(name)}, tu reserva para el \${escapeHTML(date)} ha sido registrada con éxito\${qty > 1 ? \` para \${qty} personas\` : ''}.${p2}Te esperamos en la Dropzone para tu \${escapeHTML(type)}.${p3}\`;`;
});

// Write changes
fs.writeFileSync('js/modules/autogestion.js', code, 'utf8');
console.log('autogestion.js audited and refactored.');
