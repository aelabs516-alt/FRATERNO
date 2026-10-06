const fs = require('fs');
let code = fs.readFileSync('js/modules/assignment.js', 'utf8');

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

// 2. Fix XSS in renderAssignments
const regexOptions = /const options = availableRigs\.map\(r => \`<option value="\$\{r\.id\}">Equipo \$\{r\.id\}<\/option>\`\)\.join\(''\);/;
code = code.replace(regexOptions, `const options = availableRigs.map(r => \`<option value="\${escapeHTML(r.id)}">Equipo \${escapeHTML(r.id)}</option>\`).join('');`);

const regexCard = /card\.innerHTML = \`([\s\S]*?)<h4([\s\S]*?)>\$\{p\.name\}<\/h4>([\s\S]*?)>\$\{p\.instructor \|\| 'Sin Asignar'\}<\/span>([\s\S]*?)>\$\{p\.flightStatus \|\| 'Sin Vuelo'\}<\/span>([\s\S]*?)\`;/;
code = code.replace(regexCard, (match, p1, p2, p3, p4, p5) => {
    return `card.innerHTML = \`${p1}<h4${p2}>\${escapeHTML(p.name)}</h4>${p3}>\${escapeHTML(p.instructor || 'Sin Asignar')}</span>${p4}>\${escapeHTML(p.flightStatus || 'Sin Vuelo')}</span>${p5}\`;`;
});

const regexRigId = /Equipo \$\{p\.rigId\} Asignado<\/span>/g;
code = code.replace(regexRigId, 'Equipo ${escapeHTML(p.rigId)} Asignado</span>');


fs.writeFileSync('js/modules/assignment.js', code, 'utf8');
console.log('assignment.js audited and refactored.');
