const fs = require('fs');
let code = fs.readFileSync('js/modules/settings.js', 'utf8');

// Inject escapeHTML helper at the beginning of init
const regexInit = /init: \(\) => \{/;
const replaceInit = `init: () => {
        function escapeHTML(str) {
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

// Refactor renderValores
const regexRenderValores = /if \(gridContainer\) \{[\s\S]*?if \(checklistContainer\) \{/;
const replaceRenderValores = `if (gridContainer) {
                let html = '';
                window.AppData.maestroValores.forEach(item => {
                    const safeName = escapeHTML(item.name);
                    const formattedPrice = item.price ? parseInt(item.price.toString().replace(/\\D/g, '') || 0).toLocaleString('es-CO') : '0';
                    const formattedComision = item.comision ? parseInt(item.comision.toString().replace(/\\D/g, '') || 0).toLocaleString('es-CO') : '0';
                    html += \`
                        <div class="form-group" style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.5rem;">
                            <label style="font-weight: 600; font-size: 1.05rem;">\${safeName}</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div>
                                    <label style="font-size: 0.8rem; color: var(--text-secondary);">Precio Venta</label>
                                    <input type="text" class="form-control price-input money-input" data-name="\${safeName}" value="\${formattedPrice}">
                                </div>
                                <div>
                                    <label style="font-size: 0.8rem; color: var(--text-secondary);">Honorarios Staff</label>
                                    <input type="text" class="form-control comision-input money-input" data-name="\${safeName}" value="\${formattedComision}">
                                </div>
                            </div>
                        </div>
                    \`;
                });
                gridContainer.innerHTML = html;
                
                // Re-attach currency formatting
                document.querySelectorAll('#valores-grid .money-input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        e.target.value = formatCurrency(e.target.value);
                    });
                });
            }
            
            if (checklistContainer) {`;
code = code.replace(regexRenderValores, replaceRenderValores);

// Refactor checklist loop
const regexChecklist = /checklistContainer\.innerHTML = '';\s*window\.AppData\.maestroValores\.forEach\(item => \{[\s\S]*?\}\);/;
const replaceChecklist = `
                let chkHtml = '';
                window.AppData.maestroValores.forEach(item => {
                    const safeName = escapeHTML(item.name);
                    chkHtml += \`
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="\${safeName}"> \${safeName}
                        </label>
                    \`;
                });
                checklistContainer.innerHTML = chkHtml;
`;
code = code.replace(regexChecklist, replaceChecklist);

// Refactor renderAeronaves
const regexAeronavesLoop = /window\.AppData\.aeronaves\.forEach\(a => \{[\s\S]*?tablePlane\.appendChild\(tr\);\s*\}\);/;
const replaceAeronavesLoop = `let planeHtml = '';
            window.AppData.aeronaves.forEach(a => {
                let statusColor = 'var(--text-primary)';
                if(a.estado === 'Operativa') statusColor = 'var(--brand-success)';
                if(a.estado === 'AOG') statusColor = 'var(--brand-warning)';
                if(a.estado === 'No operativa') statusColor = 'var(--brand-danger)';
                
                planeHtml += \`
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 1rem; font-weight: 600;">\${escapeHTML(a.matricula)}</td>
                    <td style="padding: 1rem;">\${escapeHTML(a.modelo)}</td>
                    <td style="padding: 1rem;">FJ: \${escapeHTML(a.capFun)} | T: \${escapeHTML(a.capTan)}</td>
                    <td style="padding: 1rem; color: \${statusColor}; font-weight: 600;">\${escapeHTML(a.estado)}</td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit-plane" data-id="\${escapeHTML(a.id)}" style="padding: 0.25rem 0.5rem; margin-right: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete-plane" data-id="\${escapeHTML(a.id)}" style="color: var(--brand-danger); padding: 0.25rem 0.5rem;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>\`;
            });
            tablePlane.innerHTML = planeHtml;
`;
code = code.replace(regexAeronavesLoop, replaceAeronavesLoop);

fs.writeFileSync('js/modules/settings.js', code, 'utf8');
console.log('settings.js audited and refactored.');
