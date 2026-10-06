const fs = require('fs');
let code = fs.readFileSync('js/modules/fleet.js', 'utf8');

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

// 2. Fix XSS in planeSelect and replPlane
const regexPlaneOpt = /planeSelect\.innerHTML \+= `<option value="\$\{a\.id\}">\$\{a\.matricula\} \(\$\{a\.modelo\}\)<\/option>`;/g;
code = code.replace(regexPlaneOpt, 'planeSelect.innerHTML += `<option value="${escapeHTML(a.id)}">${escapeHTML(a.matricula)} (${escapeHTML(a.modelo)})</option>`;');

const regexReplPlaneOpt = /replPlane\.innerHTML \+= `<option value="\$\{a\.id\}">\$\{a\.matricula\}<\/option>`;/g;
code = code.replace(regexReplPlaneOpt, 'replPlane.innerHTML += `<option value="${escapeHTML(a.id)}">${escapeHTML(a.matricula)}</option>`;');

// 3. Fix XSS in nameDiv
const regexNameDiv = /nameDiv\.innerHTML = `<strong style="color: var\(--text-primary\); font-size: 1\.05rem;">\$\{a\.matricula\}<\/strong>\\s*<span style="font-size:0\.75rem; color:var\(--text-secondary\);">\$\{a\.modelo\}<\/span>`;/g;
code = code.replace(regexNameDiv, 'nameDiv.innerHTML = `<strong style="color: var(--text-primary); font-size: 1.05rem;">${escapeHTML(a.matricula)}</strong>\\n                                     <span style="font-size:0.75rem; color:var(--text-secondary);">${escapeHTML(a.modelo)}</span>`;');

// 4. Fix XSS in captSelect
const regexCapt = /captSelect\.innerHTML \+= `<option value="\$\{p\.name\}">\$\{p\.name\}<\/option>`;/g;
code = code.replace(regexCapt, 'captSelect.innerHTML += `<option value="${escapeHTML(p.name)}">${escapeHTML(p.name)}</option>`;');

fs.writeFileSync('js/modules/fleet.js', code, 'utf8');
console.log('fleet.js audited and refactored.');
