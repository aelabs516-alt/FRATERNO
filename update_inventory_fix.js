const fs = require('fs');
let code = fs.readFileSync('js/modules/inventory.js', 'utf8');

// 1. Change title
code = code.replace(
    '<h3 style="margin: 0;">Equipos Fun Jumper / Escuela Registrados</h3>',
    '<h3 style="margin: 0;">Fun jumper - Escuela</h3>'
);

// 2. Change table styling
code = code.replace(
    '<table class="table">',
    '<table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">'
);
code = code.replace(
    '<th>ID Equipo</th>',
    '<th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">ID Equipo</th>'
);
code = code.replace(
    '<th>Contenedor (25a)</th>',
    '<th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Contenedor (25a)</th>'
);
code = code.replace(
    '<th>AAD (20a)</th>',
    '<th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">AAD (20a)</th>'
);
code = code.replace(
    '<th>Principal (2000s)</th>',
    '<th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Principal (2000s)</th>'
);
code = code.replace(
    '<th>Reserva (20a)</th>',
    '<th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Reserva (20a)</th>'
);
code = code.replace(
    '<th>Acciones</th>',
    '<th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Acciones</th>'
);

// 3. Inject JS logic
const jsLogic = `
        window.AppData.funRigs = window.AppData.funRigs || [];
        
        // --- FUN JUMPER LOGIC ---
        const tbodyFun = document.getElementById('fun-table-body');
        const modalFun = document.getElementById('modal-fun');
        let editingFunIndex = -1;

        function renderFunTable() {
            if(!tbodyFun) return;
            tbodyFun.innerHTML = '';
            const rigs = window.AppData.funRigs || [];
            
            if (rigs.length === 0) {
                tbodyFun.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No hay equipos Fun Jumper registrados.</td></tr>';
                return;
            }
            
            rigs.forEach((r, idx) => {
                const renderPart = (p, limitJumps) => {
                    if (p.na) return '<span style="color: var(--text-secondary); font-size: 0.85rem;">N/A</span>';
                    
                    let alertHtml = '';
                    if (limitJumps && p.saltos >= 1800) {
                        const color = p.saltos >= 2000 ? 'var(--brand-danger)' : 'var(--brand-warning)';
                        alertHtml = \`<div style="color: \${color}; font-size: 0.75rem; font-weight: bold; margin-top:2px;"><i class="fas fa-exclamation-triangle"></i> \${p.saltos} saltos</div>\`;
                    }
                    
                    return \`
                        <div style="font-size: 0.85rem;">
                            <strong>EAN:</strong> \${p.ean || '-'}<br>
                            <span style="color: var(--text-secondary);">\${p.date || '-'}</span>
                            \${alertHtml}
                        </div>
                    \`;
                };

                tbodyFun.innerHTML += \`
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="font-weight: bold; padding: 1rem;">\${r.id}</td>
                        <td style="padding: 1rem;">\${renderPart(r.contenedor, false)}</td>
                        <td style="padding: 1rem;">\${renderPart(r.aad, false)}</td>
                        <td style="padding: 1rem;">\${renderPart(r.principal, true)}</td>
                        <td style="padding: 1rem;">\${renderPart(r.reserva, false)}</td>
                        <td style="padding: 1rem;">
                            <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.85rem; margin-right: 0.25rem;" onclick="window.editFun(\${idx})"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.85rem; color: var(--brand-danger); border-color: var(--brand-danger);" onclick="window.deleteFun(\${idx})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                \`;
            });
        }

        window.editFun = (idx) => {
            editingFunIndex = idx;
            const r = window.AppData.funRigs[idx];
            document.getElementById('modal-fun-title').textContent = 'Editar Equipo Fun Jumper';
            document.getElementById('fun-id').value = r.id;
            
            ['cont', 'aad', 'prin', 'res'].forEach(p => {
                const data = r[p === 'cont' ? 'contenedor' : p === 'prin' ? 'principal' : p === 'res' ? 'reserva' : 'aad'];
                document.getElementById(\`fun-\${p}-na\`).checked = data.na;
                document.getElementById(\`fun-\${p}-ean\`).value = data.ean || '';
                document.getElementById(\`fun-\${p}-date\`).value = data.date || '';
                
                document.getElementById(\`fun-\${p}-ean\`).disabled = data.na;
                document.getElementById(\`fun-\${p}-date\`).disabled = data.na;
                if(p === 'prin') {
                    document.getElementById('fun-prin-saltos').value = data.saltos || 0;
                    document.getElementById('fun-prin-saltos').disabled = data.na;
                }
            });
            
            modalFun.style.display = 'flex';
        };

        window.deleteFun = (idx) => {
            if (confirm('¿Seguro que deseas eliminar este equipo Fun Jumper?')) {
                window.AppData.funRigs.splice(idx, 1);
                if (window.saveAppData) window.saveAppData();
                renderFunTable();
            }
        };

        const btnAddFun = document.getElementById('btn-add-fun');
        if(btnAddFun) {
            btnAddFun.addEventListener('click', () => {
                editingFunIndex = -1;
                document.getElementById('modal-fun-title').textContent = 'Nuevo Equipo Fun Jumper';
                document.getElementById('fun-id').value = '';
                
                ['cont', 'aad', 'prin', 'res'].forEach(p => {
                    document.getElementById(\`fun-\${p}-na\`).checked = false;
                    document.getElementById(\`fun-\${p}-ean\`).value = '';
                    document.getElementById(\`fun-\${p}-date\`).value = '';
                    document.getElementById(\`fun-\${p}-ean\`).disabled = false;
                    document.getElementById(\`fun-\${p}-date\`).disabled = false;
                    if(p === 'prin') {
                        document.getElementById('fun-prin-saltos').value = '';
                        document.getElementById('fun-prin-saltos').disabled = false;
                    }
                });
                
                modalFun.style.display = 'flex';
            });
        }

        const btnCancelFun = document.getElementById('btn-cancel-fun');
        if(btnCancelFun) {
            btnCancelFun.addEventListener('click', () => {
                modalFun.style.display = 'none';
            });
        }

        // NA Toggle logic
        ['cont', 'aad', 'prin', 'res'].forEach(p => {
            const chk = document.getElementById(\`fun-\${p}-na\`);
            if(chk) {
                chk.addEventListener('change', (e) => {
                    const isNa = e.target.checked;
                    document.getElementById(\`fun-\${p}-ean\`).disabled = isNa;
                    document.getElementById(\`fun-\${p}-date\`).disabled = isNa;
                    if(p === 'prin') document.getElementById('fun-prin-saltos').disabled = isNa;
                });
            }
        });

        const btnSaveFun = document.getElementById('btn-save-fun');
        if(btnSaveFun) {
            btnSaveFun.addEventListener('click', () => {
                const id = document.getElementById('fun-id').value.trim();
                if (!id) return alert('El identificador del equipo es obligatorio');
                
                const getPart = (p) => {
                    const na = document.getElementById(\`fun-\${p}-na\`).checked;
                    const ean = document.getElementById(\`fun-\${p}-ean\`).value.trim();
                    const date = document.getElementById(\`fun-\${p}-date\`).value;
                    const res = { na, ean: na ? '' : ean, date: na ? '' : date };
                    if (p === 'prin') {
                        res.saltos = na ? 0 : (parseInt(document.getElementById('fun-prin-saltos').value, 10) || 0);
                    }
                    return res;
                };

                const rig = {
                    id: id,
                    contenedor: getPart('cont'),
                    aad: getPart('aad'),
                    principal: getPart('prin'),
                    reserva: getPart('res')
                };

                if (editingFunIndex > -1) {
                    window.AppData.funRigs[editingFunIndex] = rig;
                } else {
                    window.AppData.funRigs.push(rig);
                }

                if (window.saveAppData) window.saveAppData();
                modalFun.style.display = 'none';
                renderFunTable();
            });
        }

        // --- END FUN JUMPER LOGIC ---
`;

if (!code.includes('// --- FUN JUMPER LOGIC ---')) {
    code = code.replace(
        '// Init',
        jsLogic + '\n        // Init'
    );
    code = code.replace(
        'renderAccesorios();',
        'renderAccesorios();\n        renderFunTable();'
    );
}

fs.writeFileSync('js/modules/inventory.js', code, 'utf8');
console.log('Done modifying inventory.js for Fun Jumper logic');
