const fs = require('fs');
let code = fs.readFileSync('js/modules/assignment.js', 'utf8');

const regex = /card\.style\.background = 'var\(--bg-surface-hover\)';[\s\S]*?list\.appendChild\(card\);\s*\}\);/;
const replaceStr = `card.style.background = 'rgba(15, 23, 42, 0.4)';
                card.style.backdropFilter = 'blur(12px)';
                card.style.WebkitBackdropFilter = 'blur(12px)';
                card.style.border = '1px solid rgba(255,255,255,0.05)';
                card.style.borderRadius = '12px';
                card.style.padding = '1.5rem';
                card.style.display = 'flex';
                card.style.justifyContent = 'space-between';
                card.style.alignItems = 'center';
                card.style.flexWrap = 'wrap';
                card.style.gap = '1rem';
                card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                card.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
                
                card.onmouseover = () => {
                    card.style.transform = 'translateY(-2px)';
                    card.style.boxShadow = '0 10px 40px rgba(0,0,0,0.2)';
                };
                card.onmouseout = () => {
                    card.style.transform = 'translateY(0)';
                    card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                };
                
                let selectHtml = '';
                if(p.rigId) {
                    selectHtml = \`
                        <div style="display: flex; align-items: center; gap: 1rem; background: rgba(16, 185, 129, 0.1); padding: 0.5rem 1rem; border-radius: 8px; border: 1px solid rgba(16, 185, 129, 0.2);">
                            <span style="color: var(--brand-success); font-weight: bold;"><i class="fas fa-parachute-box"></i> Equipo \${p.rigId} Asignado</span>
                            <button class="btn btn-release" data-id="\${p.id}" style="background: var(--brand-danger); color: white; border: none; padding: 0.4rem 1rem; border-radius: 6px; cursor: pointer; font-weight: bold; box-shadow: 0 2px 10px rgba(239, 68, 68, 0.3); transition: background 0.2s;"><i class="fas fa-unlink"></i> Liberar</button>
                        </div>
                    \`;
                } else {
                    const options = availableRigs.map(r => \`<option value="\${r.id}">Equipo \${r.id}</option>\`).join('');
                    selectHtml = \`
                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                            <select class="form-control sel-rig" data-id="\${p.id}" style="width: 200px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);">
                                <option value="">Seleccione Equipo...</option>
                                \${options}
                            </select>
                            <button class="btn btn-primary btn-claim" data-id="\${p.id}" style="padding: 0.5rem 1rem; font-weight: bold; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);"><i class="fas fa-hand-paper"></i> Reclamar</button>
                        </div>
                    \`;
                }
                
                card.innerHTML = \`
                    <div>
                        <h4 style="margin: 0; font-size: 1.2rem; color: var(--text-primary);">\${p.name}</h4>
                        <div style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0.4rem; display: flex; align-items: center; gap: 0.75rem;">
                            <span><i class="fas fa-user-tie" style="color: var(--brand-action);"></i> \${p.instructor || 'Sin Asignar'}</span>
                            <span style="color: rgba(255,255,255,0.2);">|</span>
                            <span><i class="fas fa-plane" style="color: var(--brand-info);"></i> \${p.flightStatus || 'Sin Vuelo'}</span>
                        </div>
                    </div>
                    \${selectHtml}
                \`;
                
                list.appendChild(card);
            });`;

if (regex.test(code)) {
    code = code.replace(regex, replaceStr);
    console.log("Updated assignment.js cards");
} else {
    console.log("Failed to update assignment.js cards");
}
fs.writeFileSync('js/modules/assignment.js', code, 'utf8');
