const fs = require('fs');
let code = fs.readFileSync('js/modules/billing.js', 'utf8');

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

// 2. Fix NaN Bug in getPrice and getComision
const regexPrice = /return item && item\.price \? parseInt\(item\.price\.replace\(\/\\\.\/g, ''\)\) \|\| 0 : 0;/g;
code = code.replace(regexPrice, "return item && item.price ? parseInt(item.price.replace(/\\D/g, '')) || 0 : 0;");

const regexComision = /return item && item\.comision \? parseInt\(item\.comision\.replace\(\/\\\.\/g, ''\)\) \|\| 0 : 0;/g;
code = code.replace(regexComision, "return item && item.comision ? parseInt(item.comision.replace(/\\D/g, '')) || 0 : 0;");

// Fix another potential regex that was written without escape
const regexPrice2 = /return item && item\.price \? parseInt\(item\.price\.toString\(\)\.replace\(\/\\\.\/g, ''\)\) \|\| 0 : 0;/g;
code = code.replace(regexPrice2, "return item && item.price ? parseInt(item.price.toString().replace(/\\D/g, '')) || 0 : 0;");


// 3. Fix XSS in tbIngresos
const regexIngresosName = /<td style="padding: 1rem; font-weight: 600;">\$\{p\.name\}<\/td>/g;
code = code.replace(regexIngresosName, '<td style="padding: 1rem; font-weight: 600;">${escapeHTML(p.name)}</td>');

const regexIngresosType = /<td style="padding: 1rem;">\$\{p\.type\}<\/td>/g;
code = code.replace(regexIngresosType, '<td style="padding: 1rem;">${escapeHTML(p.type)}</td>');

const regexIngresosCams = /<td style="padding: 1rem;">\$\{p\.cams \|\| '-'\}/g;
code = code.replace(regexIngresosCams, '<td style="padding: 1rem;">${escapeHTML(p.cams || "-")}');

// 4. Fix XSS in tbNomina
const regexNominaInst = /<td style="padding: 1rem; font-weight: 600;">\$\{instDisplay\}<\/td>/g;
code = code.replace(regexNominaInst, '<td style="padding: 1rem; font-weight: 600;">${escapeHTML(instDisplay)}</td>');

// 5. Fix XSS in tbody-empacadores
const regexEmpacador = /<td style="padding: 1rem; font-weight: 600;">\$\{empName\}<\/td>/g;
code = code.replace(regexEmpacador, '<td style="padding: 1rem; font-weight: 600;">${escapeHTML(empName)}</td>');

fs.writeFileSync('js/modules/billing.js', code, 'utf8');
console.log('billing.js audited and refactored.');
