const fs = require('fs');
let code = fs.readFileSync('js/modules/finance.js', 'utf8');

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

// 2. Fix XSS in renderTransactions
const regexCat = /<td style="padding: 1rem; font-size: 0\.9rem;">\$\{tx\.cat \|\| 'Otros'\}<\/td>/g;
code = code.replace(regexCat, '<td style="padding: 1rem; font-size: 0.9rem;">${escapeHTML(tx.cat || "Otros")}</td>');

const regexDesc = /<td style="padding: 1rem; font-weight: 500;">\$\{tx\.desc\}<\/td>/g;
code = code.replace(regexDesc, '<td style="padding: 1rem; font-weight: 500;">${escapeHTML(tx.desc)}</td>');

// 3. Fix XSS in hist-list
const regexHistDate = /<td style="padding: 1rem; font-weight: 500;">\$\{c\.date\}<\/td>/g;
code = code.replace(regexHistDate, '<td style="padding: 1rem; font-weight: 500;">${escapeHTML(c.date)}</td>');

const regexHistUser = /<td style="padding: 1rem; color: var\(--text-secondary\);">\$\{c\.user\}<\/td>/g;
code = code.replace(regexHistUser, '<td style="padding: 1rem; color: var(--text-secondary);">${escapeHTML(c.user)}</td>');

// 4. Fix NaN Bug in btn-save-tx (replace(/D/g, '') to replace(/\D/g, ''))
const regexD = /const amtStr = txAmount\.value\.replace\(\/D\/g, ''\);/g;
code = code.replace(regexD, "const amtStr = txAmount.value.replace(/\\D/g, '');");

fs.writeFileSync('js/modules/finance.js', code, 'utf8');
console.log('finance.js audited and refactored.');
