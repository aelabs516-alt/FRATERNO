const fs = require('fs');
let code = fs.readFileSync('js/modules/manifest.js', 'utf8');

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

// 2. Fix XSS in renderBoard (paxHtml)
const regexPaxHtml = /<span style="font-weight: 500; font-size: 0\.9rem;">\$\{p\.name\} \$\{waiverHtml\} \$\{capHtml\}<\/span>/g;
code = code.replace(regexPaxHtml, '<span style="font-weight: 500; font-size: 0.9rem;">${escapeHTML(p.name)} ${waiverHtml} ${capHtml}</span>');

const regexInst = /Inst: \$\{p\.instructor\}/g;
code = code.replace(regexInst, 'Inst: ${escapeHTML(p.instructor)}');

const regexType = /font-weight: bold;">\$\{p\.type\}<\/span>/g;
code = code.replace(regexType, 'font-weight: bold;">${escapeHTML(p.type)}</span>');

const regexInst2 = /\$\{insts\.join\(\', \'\)\}/g;
code = code.replace(regexInst2, '${escapeHTML(insts.join(", "))}');

// 3. Fix XSS in card.innerHTML
const regexCardInner = /<h3([\s\S]*?)>\$\{vuelo\.aeronave\}<\/h3>([\s\S]*?)Vuelo: \$\{vuelo\.vueloNum\}<\/div>([\s\S]*?)Estado: \$\{vuelo\.status\}<\/div>([\s\S]*?)>\$\{vuelo\.time\}<\/span>/;
code = code.replace(regexCardInner, (match, p1, p2, p3, p4) => {
    return `<h3${p1}>\${escapeHTML(vuelo.aeronave)}</h3>${p2}Vuelo: \${escapeHTML(vuelo.vueloNum)}</div>${p3}Estado: \${escapeHTML(vuelo.status)}</div>${p4}>\${escapeHTML(vuelo.time)}</span>`;
});

const regexCapitan = /Capitán: <strong>\$\{capitanName\}<\/strong>/g;
code = code.replace(regexCapitan, 'Capitán: <strong>${escapeHTML(capitanName)}</strong>');

// 4. Fix XSS in renderModalPaxList (item.innerHTML)
const regexItemName = />\$\{p\.name\}\$\{instName\}<\/span>/g;
code = code.replace(regexItemName, '>${escapeHTML(p.name)}${instName}</span>');

const regexItemType = /color: var\(--text-secondary\);">\$\{p\.type\}<\/span>/g;
code = code.replace(regexItemType, 'color: var(--text-secondary);">${escapeHTML(p.type)}</span>');

// 5. Fix XSS in populateAddPaxDropdown
const regexAddPax = /selectAddPax\.innerHTML \+= \`<option value="\$\{p\.id\}">\$\{p\.name\} \(\$\{p\.type\}\)<\/option>\`;/g;
code = code.replace(regexAddPax, 'selectAddPax.innerHTML += `<option value="${escapeHTML(p.id)}">${escapeHTML(p.name)} (${escapeHTML(p.type)})</option>`;');

fs.writeFileSync('js/modules/manifest.js', code, 'utf8');
console.log('manifest.js audited and refactored.');
