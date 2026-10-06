const fs = require('fs');

function search(file) {
    if (!fs.existsSync(file)) return;
    const lines = fs.readFileSync(file, 'utf8').split('\n');
    lines.forEach((l, i) => {
        if (l.includes('capFun') || l.includes('capTan') || l.includes('FJ') || l.includes('Tandem') || l.includes('capCop')) {
            console.log(file + ':' + (i + 1) + ':' + l.trim());
        }
    });
}

['js/modules/reservations.js', 'js/modules/dashboard.js', 'js/modules/fleet.js'].forEach(search);
