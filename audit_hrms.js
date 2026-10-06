const fs = require('fs');
let code = fs.readFileSync('js/modules/hrms.js', 'utf8');

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

// 2. clockSelect
const regexClockSelect = /clockSelect\.innerHTML \+= `<option value="\$\{emp\.id\}">\$\{emp\.name\} \(\$\{emp\.role\}\)<\/option>`;/g;
code = code.replace(regexClockSelect, 'clockSelect.innerHTML += `<option value="${escapeHTML(emp.id)}">${escapeHTML(emp.name)} (${escapeHTML(emp.role)})</option>`;');

// 3. empList
const regexFullName = /<h4 style="margin: 0; font-size: 1\.05rem;">\$\{fullName\}<\/h4>/g;
code = code.replace(regexFullName, '<h4 style="margin: 0; font-size: 1.05rem;">${escapeHTML(fullName)}</h4>');

const regexRole = /<span style="font-size: 0\.8rem; background: \$\{color\}20; color: \$\{color\}; padding: 0\.2rem 0\.6rem; border-radius: 12px; font-weight: 600; display: inline-block; margin-top: 0\.25rem;">\$\{emp\.role\}<\/span>/g;
code = code.replace(regexRole, '<span style="font-size: 0.8rem; background: ${color}20; color: ${color}; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 600; display: inline-block; margin-top: 0.25rem;">${escapeHTML(emp.role)}</span>');

const regexDoc = /<div><i class="fas fa-id-card" style="width: 20px;"><\/i> \$\{emp\.doc \|\| 'N\/A'\}<\/div>/g;
code = code.replace(regexDoc, '<div><i class="fas fa-id-card" style="width: 20px;"></i> ${escapeHTML(emp.doc || "N/A")}</div>');

const regexPhone = /\$\{emp\.phone \? `<div><i class="fas fa-phone" style="width: 20px;"><\/i> \$\{emp\.phone\}<\/div>` : ''\}/g;
code = code.replace(regexPhone, '${emp.phone ? `<div><i class="fas fa-phone" style="width: 20px;"></i> ${escapeHTML(emp.phone)}</div>` : ""}');

const regexEmail = /\$\{emp\.email \? `<div><i class="fas fa-envelope" style="width: 20px;"><\/i> \$\{emp\.email\}<\/div>` : ''\}/g;
code = code.replace(regexEmail, '${emp.email ? `<div><i class="fas fa-envelope" style="width: 20px;"></i> ${escapeHTML(emp.email)}</div>` : ""}');

// 4. clockLogs
const regexLogName = /<div style="font-weight: 500;">\$\{emp\.name\}<\/div>/g;
code = code.replace(regexLogName, '<div style="font-weight: 500;">${escapeHTML(emp.name)}</div>');


fs.writeFileSync('js/modules/hrms.js', code, 'utf8');
console.log('hrms.js audited and refactored.');
