const fs = require('fs');

// 1. Update reservations.js
let resCode = fs.readFileSync('js/modules/reservations.js', 'utf8');
resCode = resCode.replace(
    /let usedCapacity = 0;\s*\([\s\S]*?usedCapacity\+\+;\s*\}\s*\}\);/,
    `let usedCapacity = 0;
            (window.AppData.passengers || []).forEach(p => {
                if (p.date === dateStrYMD && p.paxStatus !== 'Cancelado' && p.flightStatus !== 'Cancelado / Cancelled') {
                    if (p.type === 'Tandem') {
                        usedCapacity += 2;
                    } else {
                        usedCapacity += 1;
                    }
                }
            });`
);
fs.writeFileSync('js/modules/reservations.js', resCode, 'utf8');
console.log('Updated reservations.js');

// 2. Update autogestion.js
let autoCode = fs.readFileSync('js/modules/autogestion.js', 'utf8');
autoCode = autoCode.replace(
    /const booked = dayPaxs\.length;/,
    `let booked = 0;
            dayPaxs.forEach(p => {
                if (p.type === 'Tandem' || p.type === 'Salto Tandem') {
                    booked += 2;
                } else {
                    booked += 1;
                }
            });`
);
fs.writeFileSync('js/modules/autogestion.js', autoCode, 'utf8');
console.log('Updated autogestion.js');
