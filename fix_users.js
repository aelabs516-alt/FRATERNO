const fs = require('fs');

// 1. Fix app.js
let appJs = fs.readFileSync('js/app.js', 'utf8');

// Ensure users is present in parsed data
if (!appJs.includes('data.users = data.users ||')) {
    appJs = appJs.replace(
        'data.noOpRules = data.noOpRules || { daysOfWeek: [\'1\', \'2\'], specificDates: [] };',
        'data.noOpRules = data.noOpRules || { daysOfWeek: [\'1\', \'2\'], specificDates: [] };\n            data.users = data.users || [{ id: \'usr_admin\', name: \'Admin Master\', username: \'admin01\', role: \'Administrador\' }];'
    );
}
// Ensure users is present in default fallback
if (!appJs.includes('users: [{')) {
    appJs = appJs.replace(
        'noOpRules: { daysOfWeek: [\'1\', \'2\'], specificDates: [] }',
        'noOpRules: { daysOfWeek: [\'1\', \'2\'], specificDates: [] },\n        users: [{ id: \'usr_admin\', name: \'Admin Master\', username: \'admin01\', role: \'Administrador\' }]'
    );
}

fs.writeFileSync('js/app.js', appJs);

// 2. Fix settings.js
let settingsJs = fs.readFileSync('js/modules/settings.js', 'utf8');

// Remove hardcoded row
settingsJs = settingsJs.replace(
    /<tbody id="table-usr">[\s\S]*?<\/tbody>/,
    '<tbody id="table-usr"></tbody>'
);

// Inject renderUsersTable and call it in init()
if (!settingsJs.includes('function renderUsersTable()')) {
    settingsJs = settingsJs.replace(
        '// =====================================\n        // 1. Configuration Init',
        `// =====================================
        // USERS PERSISTENCE
        // =====================================
        function renderUsersTable() {
            const tbody = document.getElementById('table-usr');
            if (!tbody) return;
            tbody.innerHTML = '';
            const users = window.AppData.users || [];
            users.forEach(u => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = \`
                    <td style="padding: 1rem; font-weight: 500;">\${u.name}</td>
                    <td style="padding: 1rem;">\${u.username}</td>
                    <td style="padding: 1rem;">\${u.role}</td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit" data-id="\${u.id}" style="color: var(--brand-action); padding: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-id="\${u.id}" style="color: var(--brand-danger); padding: 0.25rem;"><i class="fas fa-trash"></i></button>
                    </td>
                \`;
                tbody.appendChild(tr);
            });
        }
        renderUsersTable();

        // =====================================
        // 1. Configuration Init`
    );
}

// Update delete listener
if (!settingsJs.includes('window.AppData.users.splice(idx, 1)')) {
    settingsJs = settingsJs.replace(
        "if(confirm('¿Estás seguro de que deseas eliminar este registro?')) {\n                        btnDelete.closest('tr').remove();\n                    }",
        `if(confirm('¿Estás seguro de que deseas eliminar este registro?')) {
                        const tr = btnDelete.closest('tr');
                        const tbody = tr.closest('tbody');
                        if (tbody && tbody.id === 'table-usr') {
                            const id = btnDelete.getAttribute('data-id');
                            if (id) {
                                const idx = window.AppData.users.findIndex(u => u.id === id);
                                if (idx !== -1) {
                                    window.AppData.users.splice(idx, 1);
                                    if (window.saveAppData) window.saveAppData();
                                }
                            }
                        }
                        tr.remove();
                    }`
    );
}

// Update edit listener to use data-id
settingsJs = settingsJs.replace(
    'btnCreate.dataset.editRowIndex = tr.rowIndex;',
    "btnCreate.dataset.editId = btnEdit.getAttribute('data-id');"
);

// Update create listener
const createListenerOld = `        document.getElementById('btn-create-usr').addEventListener('click', (e) => {
            const name = document.getElementById('usr-name').value;
            const username = document.getElementById('usr-username').value;
            const role = document.getElementById('usr-role').value;

            if (!name || !username) return alert('El nombre y usuario son obligatorios.');

            const tbody = document.getElementById('table-usr');
            const btn = e.currentTarget;

            if (btn.dataset.editRowIndex) {
                const rowIndex = parseInt(btn.dataset.editRowIndex, 10);
                let targetRow = null;
                for (let r of tbody.rows) {
                    if (r.rowIndex === rowIndex) {
                        targetRow = r;
                        break;
                    }
                }
                
                if (targetRow) {
                    targetRow.cells[0].innerText = name;
                    targetRow.cells[1].innerText = username;
                    targetRow.cells[2].innerText = role;
                    alert('Usuario actualizado con éxito.');
                }
                
                delete btn.dataset.editRowIndex;
                btn.innerHTML = '<i class="fas fa-save"></i> Crear Usuario';
            } else {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = \`
                    <td style="padding: 1rem; font-weight: 500;">\${name}</td>
                    <td style="padding: 1rem;">\${username}</td>
                    <td style="padding: 1rem;">\${role}</td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit" style="color: var(--brand-action); padding: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" style="color: var(--brand-danger); padding: 0.25rem;"><i class="fas fa-trash"></i></button>
                    </td>
                \`;
                tbody.appendChild(tr);
                alert('Usuario creado con éxito.');
            }

            document.getElementById('usr-name').value = '';
            document.getElementById('usr-username').value = '';
            document.getElementById('usr-role').selectedIndex = 0;
        });`;

const createListenerNew = `        document.getElementById('btn-create-usr').addEventListener('click', (e) => {
            const name = document.getElementById('usr-name').value;
            const username = document.getElementById('usr-username').value;
            const role = document.getElementById('usr-role').value;

            if (!name || !username) return alert('El nombre y usuario son obligatorios.');

            const btn = e.currentTarget;
            window.AppData.users = window.AppData.users || [];

            if (btn.dataset.editId) {
                const id = btn.dataset.editId;
                const user = window.AppData.users.find(u => u.id === id);
                if (user) {
                    user.name = name;
                    user.username = username;
                    user.role = role;
                    alert('Usuario actualizado con éxito.');
                }
                delete btn.dataset.editId;
                btn.innerHTML = '<i class="fas fa-save"></i> Crear Usuario';
            } else {
                window.AppData.users.push({
                    id: 'usr_' + Date.now(),
                    name: name,
                    username: username,
                    role: role
                });
                alert('Usuario creado con éxito.');
            }

            if (window.saveAppData) window.saveAppData();
            renderUsersTable();

            document.getElementById('usr-name').value = '';
            document.getElementById('usr-username').value = '';
            document.getElementById('usr-role').selectedIndex = 0;
        });`;

settingsJs = settingsJs.replace(createListenerOld, createListenerNew);

fs.writeFileSync('js/modules/settings.js', settingsJs);
console.log('Script executed successfully.');
