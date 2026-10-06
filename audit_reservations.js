const fs = require('fs');
let code = fs.readFileSync('js/modules/reservations.js', 'utf8');

// 1. Fix the syntax error corruption
const corruptionRegex = /dPending\.textContent = '[\s\S]*?\n \+ formatCurrency\(pending\);/m;
code = code.replace(corruptionRegex, "dPending.textContent = '$' + formatCurrency(pending);");

// 2. Inject escapeHTML
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

// 3. Fix parseCurrency
const regexParse = /const parseCurrency = \(str\) => parseInt\(str\.replace\(\/\\\.\/g, ''\)\) \|\| 0;/g;
const replaceParse = `const parseCurrency = (str) => parseInt(String(str).replace(/\\D/g, ''), 10) || 0;`;
code = code.replace(regexParse, replaceParse);

// 4. Fix pTotal and abonoVal in btn-save-res
const regexAbono = /let newAbono = globalFullPay\.value === 'si' \? pTotal : Math\.round\(abonoVal \/ passengers\.length\);/g;
const replaceAbono = `let newAbono = globalFullPay.value === 'si' ? finalTotalPaid : Math.round(parseCurrency(globalAbono.value) / passengers.length);`;
// Actually finalTotalPaid is currentTotalPaid + newAbono. 
// If full pay, newAbono should be the manualPrice + adiciones - discount.
// The whole block has:
/*
                let paxId = p.id || ('pax_' + Date.now() + '_' + i);
                let currentTotalPaid = p.totalPaid || 0;
                let newAbono = globalFullPay.value === 'si' ? pTotal : Math.round(abonoVal / passengers.length);
                let finalTotalPaid = currentTotalPaid + newAbono; // Accrue payments
*/
// We need to calculate pTotal for this passenger!
const regexSaveResBody = /let paxId = p\.id \|\| \('pax_' \+ Date\.now\(\) \+ '_' \+ i\);[\s\S]*?let finalTotalPaid = currentTotalPaid \+ newAbono;/g;
const replaceSaveResBody = `let pTotal = p.manualPrice || 0;
                if (p.adiciones && window.AppData && window.AppData.maestroValores) {
                    for (const [key, val] of Object.entries(p.adiciones)) {
                        if (val === 'si') {
                            const mItem = window.AppData.maestroValores.find(m => m.name === key);
                            if (mItem) pTotal += parseCurrency(mItem.price);
                        }
                    }
                }
                pTotal -= p.discount || 0;
                if (pTotal < 0) pTotal = 0;
                
                let paxId = p.id || ('pax_' + Date.now() + '_' + i);
                let currentTotalPaid = p.totalPaid || 0;
                let abonoVal = parseCurrency(globalAbono.value);
                let newAbono = globalFullPay.value === 'si' ? pTotal : Math.round(abonoVal / passengers.length);
                let finalTotalPaid = currentTotalPaid + newAbono;`;
code = code.replace(regexSaveResBody, replaceSaveResBody);

// 5. Fix renderAdicionesUI XSS and innerHTML loop
const regexAdic = /container\.innerHTML = '';[\s\S]*?\}\);/m;
const replaceAdic = `container.innerHTML = '';
            
            if (!window.AppData || !window.AppData.maestroValores) return;

            let itemsToShow = [];
            if (globalJumptype.value === 'Fun Jumper') {
                itemsToShow = window.AppData.maestroValores;
            } else {
                itemsToShow = window.AppData.maestroValores.filter(v => 
                    ['Cámara 360', 'Cámara Externa', 'Cámara Go-Pro'].includes(v.name)
                );
            }

            let adicHtml = '';
            itemsToShow.forEach(item => {
                const safeName = escapeHTML(item.name);
                const safePrice = formatCurrency(parseCurrency(item.price));
                adicHtml += \`
                    <div class="form-group" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
                        <label style="margin:0; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; width: 100%;">
                            <input type="checkbox" class="dynamic-adic" data-name="\${safeName}" style="width: 18px; height: 18px; accent-color: var(--brand-action);">
                            <span style="flex: 1;">\${safeName}</span>
                            <span style="color: var(--text-secondary);">+\$\${safePrice}</span>
                        </label>
                    </div>
                \`;
            });
            container.innerHTML = adicHtml;

            // attach event listeners
            document.querySelectorAll('.dynamic-adic').forEach(chk => {
                chk.addEventListener('change', (e) => {
                    const p = passengers[activeIndex];
                    if (!p.adiciones) p.adiciones = {};
                    p.adiciones[e.target.dataset.name] = e.target.checked ? 'si' : 'no';
                    calculateGlobal();
                });
            });`;
code = code.replace(regexAdic, replaceAdic);


fs.writeFileSync('js/modules/reservations.js', code, 'utf8');
console.log('reservations.js audited and refactored.');
