const fs = require('fs');
let code = fs.readFileSync('js/modules/manifest.js', 'utf8');

// 1. Modificar la tarjeta de vuelo (renderBoard)
const regexCard = /let paxHtml = '';[\s\S]*?vuelo\.passengers\.forEach\(p => \{[\s\S]*?\}\);/;
const replaceCard = `let totalWeight = 0;
                let paxHtml = '';
                vuelo.passengers.forEach(p => {
                    const badgeClass = p.type.toLowerCase().includes('tandem') ? 'var(--brand-action)' : 'var(--brand-success)';
                    const capHtml = p.capitan && p.capitan !== 'Sin asignar' ? \`<span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-user-astronaut"></i> \${p.capitan}</span>\` : '';
                    
                    const w = parseFloat(p.weight) || 0;
                    totalWeight += w;

                    const waiverHtml = !p.waiverSigned ? \`<span style="color: var(--brand-danger); margin-left: 5px; font-size: 1.1rem;" title="Sin firma (Waiver)"><i class="fas fa-exclamation-triangle"></i></span>\` : '';

                    paxHtml += \`
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px dashed var(--border-color);">
                            <div style="display: flex; flex-direction: column;">
                                <span style="font-weight: 500; font-size: 0.9rem;">\${p.name} \${waiverHtml} \${capHtml}</span>
                                \${p.instructor && p.instructor !== 'Sin asignar' ? \`<span style="font-size: 0.75rem; color: var(--text-secondary);"><i class="fas fa-user-tie"></i> Inst: \${p.instructor}</span>\` : ''}
                            </div>
                            <span style="font-size: 0.7rem; background: \${badgeClass}; color: white; padding: 2px 6px; border-radius: 12px; font-weight: bold;">\${p.type}</span>
                        </div>
                    \`;
                });`;
code = code.replace(regexCard, replaceCard);

const regexTripulacion = /<div style="margin-bottom: 1rem; background: var\(--bg-surface-hover\); padding: 0\.75rem; border-radius: 8px;">[\s\S]*?<\/div>\s*<\/div>/;
const replaceTripulacion = `<div style="margin-bottom: 1rem; background: var(--bg-surface-hover); padding: 0.75rem; border-radius: 8px;">
                        <strong style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.5px;">Tripulación</strong>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                            <i class="fas fa-user-astronaut" style="color: var(--text-secondary)"></i> <span style="font-size: 0.9rem;">Capitán: <strong>\${capitanName}</strong></span>
                        </div>
                        <div>
                            \${instHtml || '<span style="font-size: 0.8rem; color: var(--text-secondary);">Sin instructores asignados</span>'}
                        </div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px dashed rgba(255,255,255,0.1);">
                            <i class="fas fa-weight-hanging" style="color: var(--brand-warning)"></i> <span style="font-size: 0.9rem;">Peso Estimado: <strong style="color: var(--text-primary);">\${totalWeight} Kg</strong></span>
                        </div>
                    </div>`;
code = code.replace(regexTripulacion, replaceTripulacion);

// 2. Modificar renderModalPaxList para chequear las firmas
const regexRenderModal = /function renderModalPaxList\(\) \{[\s\S]*?list\.appendChild\(item\);\s*\}\);\s*\}/;
const replaceRenderModal = `function renderModalPaxList() {
            list.innerHTML = '';
            
            if (currentModalPax.length === 0) {
                list.innerHTML = '<div style="padding: 1rem; text-align: center; color: var(--text-secondary);">El vuelo no tiene pasajeros actualmente.</div>';
                document.getElementById('btn-confirm-chk').disabled = false;
                document.getElementById('btn-confirm-chk').style.opacity = '1';
                return;
            }

            let hasMissingWaiver = false;

            currentModalPax.forEach(p => {
                const item = document.createElement('label');
                item.style.display = 'flex';
                item.style.alignItems = 'center';
                item.style.justifyContent = 'space-between';
                item.style.padding = '0.75rem';
                item.style.border = '1px solid var(--border-color)';
                item.style.borderRadius = '6px';
                item.style.cursor = 'pointer';
                item.style.transition = 'background 0.2s';
                
                item.onmouseover = () => item.style.background = 'var(--bg-surface-hover)';
                item.onmouseout = () => item.style.background = 'transparent';
                
                const instName = p.instructor && p.instructor !== 'Sin asignar' ? \` <span style="color:var(--text-secondary); font-size:0.8rem;"><i class="fas fa-user-tie"></i> \${p.instructor}</span>\` : '';
                
                let waiverAlert = '';
                if (!p.waiverSigned) {
                    hasMissingWaiver = true;
                    waiverAlert = \`<div style="font-size: 0.8rem; color: var(--brand-danger); font-weight: bold; margin-top: 4px;"><i class="fas fa-exclamation-triangle"></i> Faltan Firmas (Waiver)</div>\`;
                }
                
                item.innerHTML = \`
                    <div style="display: flex; flex-direction: column;">
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <input type="checkbox" class="chk-pax-item" value="\${p.id}" checked style="width: 20px; height: 20px; accent-color: var(--brand-action); cursor: pointer;">
                            <span style="font-weight: 600; font-size: 1rem;">\${p.name}\${instName}</span>
                        </div>
                        \${waiverAlert}
                    </div>
                    <span style="font-size: 0.75rem; background: var(--bg-surface-hover); padding: 4px 8px; border-radius: 12px; font-weight: bold; color: var(--text-secondary);">\${p.type}</span>
                \`;
                list.appendChild(item);
            });

            const btnConfirm = document.getElementById('btn-confirm-chk');
            if (hasMissingWaiver) {
                btnConfirm.disabled = true;
                btnConfirm.style.opacity = '0.5';
                btnConfirm.style.cursor = 'not-allowed';
                btnConfirm.innerHTML = '<i class="fas fa-ban"></i> Faltan Firmas';
            } else {
                btnConfirm.disabled = false;
                btnConfirm.style.opacity = '1';
                btnConfirm.style.cursor = 'pointer';
                btnConfirm.innerHTML = '<i class="fas fa-plane-departure"></i> Confirmar Despegue';
            }
        }`;
code = code.replace(regexRenderModal, replaceRenderModal);

fs.writeFileSync('js/modules/manifest.js', code, 'utf8');
console.log("Updated manifest.js");
