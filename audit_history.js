const fs = require('fs');
let code = fs.readFileSync('js/modules/historySearch.js', 'utf8');

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

const regexTrInner = /tr\.innerHTML = \`([\s\S]*?)\`;/g;
code = code.replace(regexTrInner, (match, p1) => {
    return 'tr.innerHTML = `' + p1
        .replace(/\$\{c\.firstName\}/g, '${escapeHTML(c.firstName)}')
        .replace(/\$\{c\.lastName\}/g, '${escapeHTML(c.lastName)}')
        .replace(/\$\{c\.doc\}/g, '${escapeHTML(c.doc)}')
        .replace(/\$\{c\.latestJumpDate\}/g, '${escapeHTML(c.latestJumpDate)}')
    + '`;';
});

const regexJumpsHtml = /jumpsHtml \+= \`([\s\S]*?)\`;/g;
code = code.replace(regexJumpsHtml, (match, p1) => {
    return 'jumpsHtml += `' + p1
        .replace(/\$\{j\.date\}/g, '${escapeHTML(j.date)}')
        .replace(/\$\{j\.time \|\| '--:--'\}/g, "${escapeHTML(j.time || '--:--')}")
        .replace(/\$\{j\.paxStatus\}/g, '${escapeHTML(j.paxStatus)}')
        .replace(/\$\{j\.type\}/g, '${escapeHTML(j.type)}')
        .replace(/\$\{j\.cams \|\| 'Ninguna'\}/g, "${escapeHTML(j.cams || 'Ninguna')}")
        .replace(/\$\{j\.instructor \|\| 'S\/A'\}/g, "${escapeHTML(j.instructor || 'S/A')}")
        .replace(/\$\{j\.aeronave \|\| 'S\/A'\}/g, "${escapeHTML(j.aeronave || 'S/A')}")
        .replace(/\$\{j\.vueloNum \|\| '--'\}/g, "${escapeHTML(j.vueloNum || '--')}")
    + '`;';
});

const regexDetailsHtml = /detailsBody\.innerHTML = \`([\s\S]*?)\`;/;
code = code.replace(regexDetailsHtml, (match, p1) => {
    return 'detailsBody.innerHTML = `' + p1
        .replace(/\$\{client\.name\}/g, '${escapeHTML(client.name)}')
        .replace(/\$\{client\.doc\}/g, '${escapeHTML(client.doc)}')
        .replace(/\$\{client\.phone\}/g, '${escapeHTML(client.phone)}')
        .replace(/\$\{client\.email\}/g, '${escapeHTML(client.email)}')
    + '`;';
});


fs.writeFileSync('js/modules/historySearch.js', code, 'utf8');
console.log('historySearch.js audited and refactored.');
