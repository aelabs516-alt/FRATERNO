const fs = require('fs');
let code = fs.readFileSync('js/modules/billing.js', 'utf8');

// Update styling of total columns and hover effects for tbody-nomina
const regexNominaTr = /const ntr = document\.createElement\('tr'\);\s*ntr\.style\.borderBottom = '1px solid var\(--border-color\)';\s*ntr\.innerHTML = \`([\s\S]*?)\`;/;
const replaceNominaTr = `const ntr = document.createElement('tr');
                ntr.style.borderBottom = '1px solid var(--border-color)';
                ntr.style.transition = 'background 0.2s';
                ntr.onmouseover = () => ntr.style.background = 'var(--bg-surface-hover)';
                ntr.onmouseout = () => ntr.style.background = 'transparent';
                
                ntr.innerHTML = \`$1\`;`;
                
code = code.replace(regexNominaTr, replaceNominaTr);

// Enhance Neto A Pagar specifically inside the innerHTML
const regexNeto = /<td style="padding: 1rem; font-weight: 700; color: var\(--brand-action\);">\$\{formatCurrency\(n\.total\)\}<\/td>/;
const replaceNeto = `<td style="padding: 1rem;">
                        <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; padding: 0.3rem 0.6rem; display: inline-block; font-weight: 700; color: var(--brand-action); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            \${formatCurrency(n.total)}
                        </div>
                    </td>`;
code = code.replace(regexNeto, replaceNeto);

// Also enhance Ingresos hover
const regexIngresosTr = /tr\.innerHTML = \`([\s\S]*?)\`;\s*tbIngresos\.appendChild\(tr\);/;
const replaceIngresosTr = `tr.style.transition = 'background 0.2s';
                tr.onmouseover = () => tr.style.background = 'var(--bg-surface-hover)';
                tr.onmouseout = () => tr.style.background = 'transparent';
                tr.innerHTML = \`$1\`;
                tbIngresos.appendChild(tr);`;
code = code.replace(regexIngresosTr, replaceIngresosTr);

// Enhance Total Ingresos cell
const regexIngresosTotal = /<td style="padding: 1rem; font-weight: 700; color: var\(--brand-success\);">\$\{formatCurrency\(income\)\}<\/td>/;
const replaceIngresosTotal = `<td style="padding: 1rem;">
                        <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 6px; padding: 0.3rem 0.6rem; display: inline-block; font-weight: 700; color: var(--brand-success); box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                            \${formatCurrency(income)}
                        </div>
                    </td>`;
code = code.replace(regexIngresosTotal, replaceIngresosTotal);


fs.writeFileSync('js/modules/billing.js', code, 'utf8');
console.log('billing.js updated.');
