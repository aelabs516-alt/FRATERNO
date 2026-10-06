const fs = require('fs');

let code = fs.readFileSync('js/modules/inventory.js', 'utf8');

// 1. Replace the Grid HTML with a Table HTML for Tandem
const tandemGridRegex = /<div id="inv-tandem-list"[\s\S]*?<\/div>/;
const tandemTableHtml = `
                      <div class="table-responsive" style="flex: 1; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color);">
                          <table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                              <thead>
                                  <tr>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">ID Equipo</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Contenedor (25a)</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">AAD (20a)</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Principal (2000s)</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Reserva (20a)</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Arn&eacute;s</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Acciones</th>
                                  </tr>
                              </thead>
                              <tbody id="tandem-table-body">
                                  <!-- Dynamic rows -->
                              </tbody>
                          </table>
                      </div>
`;
code = code.replace(tandemGridRegex, tandemTableHtml);

// 2. We need to replace the `renderTandems` logic
// Since regex might be tricky, let's find the start and end of the function block
const renderTandemsStart = code.indexOf('function renderTandems() {');
const renderTandemsEnd = code.indexOf('function calculateHealth(part) {');

if (renderTandemsStart !== -1 && renderTandemsEnd !== -1) {
    const newRenderTandems = `function renderTandems() {
            const tandemTableBody = document.getElementById('tandem-table-body');
            if(!tandemTableBody) return;
            tandemTableBody.innerHTML = '';
            const rigs = window.AppData.tandemRigs || [];

            if(rigs.length === 0) {
                tandemTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay equipos tǭndem registrados.</td></tr>';
                return;
            }

            rigs.forEach((rig, idx) => {
                const renderPart = (partName) => {
                    const part = rig.parts[partName];
                    if (!part) {
                        return '<span style="color: var(--text-secondary); font-size: 0.85rem;">N/A</span>';
                    }
                    
                    const health = calculateHealth(part);
                    let alertHtml = '';
                    if (health === 'danger' || health === 'warning') {
                        const color = health === 'danger' ? 'var(--brand-danger)' : 'var(--brand-warning)';
                        alertHtml = \`<div style="color: \${color}; font-size: 0.75rem; font-weight: bold; margin-top:2px;"><i class="fas fa-exclamation-triangle"></i> \${part.currentJumps} saltos</div>\`;
                    } else {
                        alertHtml = \`<div style="color: var(--brand-success); font-size: 0.75rem; margin-top:2px;">\${part.currentJumps} saltos</div>\`;
                    }
                    
                    return \`
                        <div style="font-size: 0.85rem;">
                            <strong>EAN:</strong> \${part.serial || '-'}<br>
                            <span style="color: var(--text-secondary);">\${part.date ? part.date : '-'}</span>
                            \${alertHtml}
                        </div>
                    \`;
                };

                tandemTableBody.innerHTML += \`
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="font-weight: bold; padding: 1rem;">\${rig.id}</td>
                        <td style="padding: 1rem;">\${renderPart('Contenedor')}</td>
                        <td style="padding: 1rem;">\${renderPart('AAD')}</td>
                        <td style="padding: 1rem;">\${renderPart('Cúpula Principal')}</td>
                        <td style="padding: 1rem;">\${renderPart('Reserva')}</td>
                        <td style="padding: 1rem;">\${renderPart('Arnès')}</td>
                        <td style="padding: 1rem;">
                            <button class="btn btn-outline btn-delete-tandem" data-idx="\${idx}" style="padding: 0.25rem 0.5rem; font-size: 0.85rem; color: var(--brand-danger); border-color: var(--brand-danger);"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                \`;
            });

            document.querySelectorAll('.btn-delete-tandem').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-idx');
                    if(confirm('¿Seguro que deseas eliminar este equipo Tándem?')) {
                        window.AppData.tandemRigs.splice(idx, 1);
                        if(window.saveAppData) window.saveAppData();
                        renderTandems();
                    }
                });
            });
        }

        `;
    
    code = code.substring(0, renderTandemsStart) + newRenderTandems + code.substring(renderTandemsEnd);
}

fs.writeFileSync('js/modules/inventory.js', code, 'utf8');
console.log('Done rewriting renderTandems');
