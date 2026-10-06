const fs = require('fs');

let code = fs.readFileSync('js/modules/settings.js', 'utf8');

const startToken = 'window.AppData.aeronaves = window.AppData.aeronaves || [];';

const newLogic = `
        window.AppData.aeronaves = window.AppData.aeronaves || [];
        const tablePlane = document.getElementById('table-plane');
        const btnCreatePlane = document.getElementById('btn-create-plane');
        let editingPlaneId = null;

        function renderAeronaves() {
            tablePlane.innerHTML = '';
            if (window.AppData.aeronaves.length === 0) {
                tablePlane.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1rem; color: var(--text-secondary);">No hay aeronaves registradas</td></tr>';
                return;
            }

            window.AppData.aeronaves.forEach(a => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                let statusColor = 'var(--text-primary)';
                if(a.estado === 'Operativa') statusColor = 'var(--brand-success)';
                if(a.estado === 'AOG') statusColor = 'var(--brand-warning)';
                if(a.estado === 'No operativa') statusColor = 'var(--brand-danger)';
                
                tr.innerHTML = \`
                    <td style="padding: 1rem; font-weight: 600;">\${a.matricula}</td>
                    <td style="padding: 1rem;">\${a.modelo}</td>
                    <td style="padding: 1rem;">FJ: \${a.capFun} | T: \${a.capTan}</td>
                    <td style="padding: 1rem; color: \${statusColor}; font-weight: 600;">\${a.estado}</td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit-plane" data-id="\${a.id}" style="padding: 0.25rem 0.5rem; margin-right: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete-plane" data-id="\${a.id}" style="color: var(--brand-danger); padding: 0.25rem 0.5rem;"><i class="fas fa-trash"></i></button>
                    </td>
                \`;
                tablePlane.appendChild(tr);
            });

            document.querySelectorAll('.btn-delete-plane').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    if (confirm('¿Seguro que deseas eliminar esta aeronave?')) {
                        window.AppData.aeronaves = window.AppData.aeronaves.filter(a => a.id !== id);
                        if (window.saveAppData) window.saveAppData();
                        renderAeronaves();
                    }
                });
            });

            document.querySelectorAll('.btn-edit-plane').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const plane = window.AppData.aeronaves.find(a => a.id === id);
                    if(plane) {
                        editingPlaneId = id;
                        document.getElementById('plane-model').value = plane.modelo || '';
                        document.getElementById('plane-reg').value = plane.matricula || '';
                        document.getElementById('plane-cap-fun').value = plane.capFun || 0;
                        document.getElementById('plane-cap-tan').value = plane.capTan || 0;
                        document.getElementById('plane-status').value = plane.estado || 'Operativa';
                        
                        btnCreatePlane.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
                        
                        // Scroll up to form
                        document.getElementById('content-aeronaves').scrollIntoView({behavior: 'smooth'});
                    }
                });
            });
        }

        renderAeronaves();

        btnCreatePlane.addEventListener('click', () => {
            const model = document.getElementById('plane-model').value.trim();
            const reg = document.getElementById('plane-reg').value.trim();
            const capFun = parseInt(document.getElementById('plane-cap-fun').value);
            const capTan = parseInt(document.getElementById('plane-cap-tan').value);
            const status = document.getElementById('plane-status').value;

            if (!model || !reg) {
                return alert('Modelo y Matrícula son obligatorios.');
            }

            if (editingPlaneId) {
                const plane = window.AppData.aeronaves.find(a => a.id === editingPlaneId);
                if(plane) {
                    plane.modelo = model;
                    plane.matricula = reg;
                    plane.capFun = capFun || 0;
                    plane.capTan = capTan || 0;
                    plane.estado = status;
                }
                editingPlaneId = null;
                btnCreatePlane.innerHTML = '<i class="fas fa-plane"></i> Crear Aeronave';
            } else {
                window.AppData.aeronaves.push({
                    id: 'a_' + Date.now(),
                    modelo: model,
                    matricula: reg,
                    capFun: capFun || 0,
                    capTan: capTan || 0,
                    estado: status
                });
            }
            
            if (window.saveAppData) window.saveAppData();

            document.getElementById('plane-model').value = '';
            document.getElementById('plane-reg').value = '';
            document.getElementById('plane-cap-fun').value = '10';
            document.getElementById('plane-cap-tan').value = '5';
            document.getElementById('plane-status').value = 'Operativa';

            renderAeronaves();
        });

    }
}
`;

const startIndex = code.indexOf(startToken);
if(startIndex !== -1) {
    code = code.substring(0, startIndex) + newLogic;
    fs.writeFileSync('js/modules/settings.js', code, 'utf8');
    console.log('Successfully updated Aeronaves logic in settings.js');
} else {
    console.log('Could not find start token');
}
