const fs = require('fs');
let code = fs.readFileSync('js/modules/autogestion.js', 'utf8');

// Replace 1: Append <div id="ag-legal-container-${i}"></div>
const regex1 = /<\/div>\s*`;\s*\}\s*container\.innerHTML = html;/;
if (regex1.test(code)) {
    code = code.replace(regex1, `</div>\n                                <div id="ag-legal-container-\${i}"></div>\n                            \`;\n                        }\n                        container.innerHTML = html;`);
    console.log("Success replacing regex1");
} else {
    console.log("Failed regex1");
}

// Replace 2: Inject initLegalModulesForPax
const regex2 = /container\.dataset\.qty = qty;[\s\S]*?\/\/ Rebind listeners/;
if (regex2.test(code)) {
    code = code.replace(regex2, `container.dataset.qty = qty;
                        for (let i = 2; i <= qty; i++) {
                            initLegalModulesForPax(i);
                        }

                        // Rebind listeners`);
    console.log("Success replacing regex2");
} else {
    console.log("Failed regex2");
}

// Replace 3: Check form valid after calculateLiveTotal
const regex3 = /document\.getElementById\('lbl-total-val'\)\.textContent = formatCurrency\(grandTotal\);\s*\}/;
if (regex3.test(code)) {
    code = code.replace(regex3, `document.getElementById('lbl-total-val').textContent = formatCurrency(grandTotal);\n            checkFormValid();\n        }`);
    console.log("Success replacing regex3");
} else {
    console.log("Failed regex3");
}

fs.writeFileSync('js/modules/autogestion.js', code, 'utf8');
