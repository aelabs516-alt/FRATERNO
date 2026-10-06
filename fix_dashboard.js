const fs = require('fs');
let data = fs.readFileSync('js/modules/dashboard.js', 'utf8');
data = data.replace("(window.AppData?.pilots || []).length", "(window.AppData?.employees || []).filter(e => e.role && e.role.includes('Instructor') && e.status === 'Activo').length");
fs.writeFileSync('js/modules/dashboard.js', data);
console.log('Fixed dashboard');
