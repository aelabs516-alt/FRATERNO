const fs = require('fs');
let code = fs.readFileSync('js/modules/finance.js', 'utf8');

// For animation
const regexWidths = /barTandem\.style\.width = totalIn \? \(\(sumTan\/totalIn\)\*100\) \+ '%' : '0%';[\s\S]*?barOther\.style\.width = totalIn \? \(\(sumOth\/totalIn\)\*100\) \+ '%' : '0%';/;
const replaceWidths = `
            // Animar dinámicamente las barras
            barTandem.style.width = '0%';
            barFun.style.width = '0%';
            barCams.style.width = '0%';
            barOther.style.width = '0%';
            
            setTimeout(() => {
                barTandem.style.width = totalIn ? ((sumTan/totalIn)*100) + '%' : '0%';
                barFun.style.width = totalIn ? ((sumFun/totalIn)*100) + '%' : '0%';
                barCams.style.width = totalIn ? ((sumCam/totalIn)*100) + '%' : '0%';
                barOther.style.width = totalIn ? ((sumOth/totalIn)*100) + '%' : '0%';
            }, 50);`;
            
code = code.replace(regexWidths, replaceWidths);

// Make the daily ledger tr look more premium
const regexTr = /const tr = document\.createElement\('tr'\);\s*tr\.style\.borderBottom = '1px solid var\(--border-color\)';/;
const replaceTr = `const tr = document.createElement('tr');
                    tr.style.borderBottom = '1px solid var(--border-color)';
                    tr.style.transition = 'background 0.2s';
                    tr.onmouseover = () => tr.style.background = 'var(--bg-surface-hover)';
                    tr.onmouseout = () => tr.style.background = 'transparent';`;
code = code.replace(regexTr, replaceTr);

fs.writeFileSync('js/modules/finance.js', code, 'utf8');
console.log('finance.js updated.');
