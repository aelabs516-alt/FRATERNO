const fs = require('fs');
let code = fs.readFileSync('js/modules/dashboard.js', 'utf8');

// Inject escapeHTML into render
const regexRender = /render: \(container\) => \{/;
const replaceRender = `render: (container) => {
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
code = code.replace(regexRender, replaceRender);

// Replace template properties
const regexUpcoming = /\$\{v\.time\} - \$\{v\.aeronave\}/g;
code = code.replace(regexUpcoming, '${escapeHTML(v.time)} - ${escapeHTML(v.aeronave)}');

const regexStatus = /\$\{v\.status\}/g;
code = code.replace(regexStatus, '${escapeHTML(v.status)}');

fs.writeFileSync('js/modules/dashboard.js', code, 'utf8');
console.log('dashboard.js audited and refactored.');
