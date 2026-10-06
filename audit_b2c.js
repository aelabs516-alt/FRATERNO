const fs = require('fs');
let code = fs.readFileSync('js/modules/b2c.js', 'utf8');

// Inject escapeHTML
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

// Refactor renderDynamicCams
const regexCams = /camsContainer\.innerHTML = '';[\s\S]*?\}\);/m;
const replaceCams = `
            if (!window.AppData || !window.AppData.maestroValores) {
                camsContainer.innerHTML = '';
                return;
            }

            let itemsToShow = window.AppData.maestroValores.filter(v => 
                ['Cámara 360', 'Cámara Externa', 'Cámara Go-Pro'].includes(v.name)
            );
            
            if (typeInput.value === 'Fun Jumper') {
                itemsToShow = window.AppData.maestroValores;
            }

            let camsHtml = '';
            itemsToShow.forEach(item => {
                const safeName = escapeHTML(item.name);
                const rawPrice = item.price ? String(item.price).replace(/\\D/g, '') : '0';
                camsHtml += \`
                    <label style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: white;">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" class="b2c-cam-chk" value="\${safeName}" data-price="\${rawPrice}" style="width: 16px; height: 16px; accent-color: var(--brand-action);">
                            \${safeName}
                        </span>
                        <span style="color: #cbd5e1; font-size: 0.9rem;">+\${formatCurrency(rawPrice)}</span>
                    </label>
                \`;
            });
            camsContainer.innerHTML = camsHtml;
            
            document.querySelectorAll('.b2c-cam-chk').forEach(chk => {
                chk.addEventListener('change', calculateTotal);
            });
`;
code = code.replace(regexCams, replaceCams);

// Fix calculateTotal parseInt bug
const regexCalc = /if \(chk\.checked\) total \+= parseInt\(chk\.getAttribute\('data-price'\) \|\| 0, 10\);/g;
const replaceCalc = `if (chk.checked) total += parseInt((chk.getAttribute('data-price') || '0').replace(/\\D/g, ''), 10);`;
code = code.replace(regexCalc, replaceCalc);

// Refactor updateAvailableTimes
const regexTimes = /const times = \[\.\.\.new Set\(asgs\.map\(a => a\.horaInicio\)\)\]\.sort\(\);\s*times\.forEach\(t => \{\s*timeInput\.innerHTML \+= \`<option value="\$\{t\}" style="color: black;">\$\{t\}<\/option>\`;\s*\}\);/;
const replaceTimes = `const times = [...new Set(asgs.map(a => a.horaInicio))].sort();
            let timesHtml = '';
            times.forEach(t => {
                timesHtml += \`<option value="\${escapeHTML(t)}" style="color: black;">\${escapeHTML(t)}</option>\`;
            });
            timeInput.innerHTML = timesHtml;`;
code = code.replace(regexTimes, replaceTimes);

// Update basePrices dynamically from maestroValores instead of hardcoded
const regexBasePrices = /let basePrices = \{ tandem: 1500000, funjumper: 1200000 \};/;
const replaceBasePrices = `let basePrices = { tandem: 1500000, funjumper: 1200000 };
        function updateBasePrices() {
            if (window.AppData && window.AppData.maestroValores) {
                const pt = window.AppData.maestroValores.find(v => v.name === 'Salto Tandem');
                const pf = window.AppData.maestroValores.find(v => v.name === 'Fun Jumper');
                if (pt) basePrices.tandem = parseInt(String(pt.price).replace(/\\D/g, '') || '0', 10);
                if (pf) basePrices.funjumper = parseInt(String(pf.price).replace(/\\D/g, '') || '0', 10);
            }
        }
        updateBasePrices();`;
code = code.replace(regexBasePrices, replaceBasePrices);

fs.writeFileSync('js/modules/b2c.js', code, 'utf8');
console.log('b2c.js audited and refactored.');
