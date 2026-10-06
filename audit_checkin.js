const fs = require('fs');
let code = fs.readFileSync('js/modules/checkin.js', 'utf8');

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

// 2. Fix XSS in createPaxCard
const regexCreatePaxCard = /card\.innerHTML = \`([\s\S]*?)\`;/;
code = code.replace(regexCreatePaxCard, (match, template) => {
    // Replace all ${pax.prop} with ${escapeHTML(pax.prop)}
    let safeTemplate = template
        .replace(/\$\{pax\.name \|\| 'Sin Nombre'\}/g, "${escapeHTML(pax.name || 'Sin Nombre')}")
        .replace(/\$\{pax\.type\}/g, "${escapeHTML(pax.type)}")
        .replace(/\$\{pax\.time \|\| 'N\/A'\}/g, "${escapeHTML(pax.time || 'N/A')}")
        .replace(/\$\{pax\.aeronave \|\| 'S\/A'\}/g, "${escapeHTML(pax.aeronave || 'S/A')}")
        .replace(/\$\{pax\.instructor \|\| 'S\/A'\}/g, "${escapeHTML(pax.instructor || 'S/A')}")
        .replace(/\$\{pax\.cams \|\| 'Ninguna'\}/g, "${escapeHTML(pax.cams || 'Ninguna')}")
        .replace(/\$\{pax\.weight\}/g, "${escapeHTML(pax.weight)}");
    return `card.innerHTML = \`${safeTemplate}\`;`;
});

// 3. Fix XSS in iInstructor, iAeronave, iVuelo, iEquipo
const regexInst = /iInstructor\.innerHTML \+= \`<option value="\$\{inst\}">\$\{inst\}<\/option>\`;/g;
code = code.replace(regexInst, 'iInstructor.innerHTML += `<option value="${escapeHTML(inst)}">${escapeHTML(inst)}</option>`;');

const regexAero = /iAeronave\.innerHTML \+= \`<option value="\$\{a\.matricula\}">\$\{a\.matricula\} \(\$\{a\.modelo\}\)<\/option>\`;/g;
code = code.replace(regexAero, 'iAeronave.innerHTML += `<option value="${escapeHTML(a.matricula)}">${escapeHTML(a.matricula)} (${escapeHTML(a.modelo)})</option>`;');

const regexVuelo = /iVuelo\.innerHTML \+= \`<option value="\$\{asg\.horaInicio\}">Vuelo \$\{idx \+ 1\}<\/option>\`;/g;
code = code.replace(regexVuelo, 'iVuelo.innerHTML += `<option value="${escapeHTML(asg.horaInicio)}">Vuelo ${idx + 1}</option>`;');

const regexEquipo = /iEquipo\.innerHTML \+= \`<option value="\$\{eq\.serial\}">\$\{eq\.serial\} \$\{alert\}<\/option>\`;/g;
code = code.replace(regexEquipo, 'iEquipo.innerHTML += `<option value="${escapeHTML(eq.serial)}">${escapeHTML(eq.serial)} ${alert}</option>`;');


fs.writeFileSync('js/modules/checkin.js', code, 'utf8');
console.log('checkin.js audited and refactored.');
