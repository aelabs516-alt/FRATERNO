
const fs = require('fs');
let AppData = {
    passengers: [
        { id: 'p1', name: 'John', date: '2026-07-31', jumpdate: '2026-07-31', aeronave: 'HK-123', vueloNum: 'Vuelo 1', paxStatus: 'Check-in Listo', flightStatus: 'Programado' }
    ]
};

// Simulate reservations.js edit date to tomorrow
let p = AppData.passengers[0];
p.jumpdate = '2026-08-01';
let newPax = { ...p, date: p.jumpdate };
AppData.passengers[0] = newPax;

// Simulate manifest.js filtering for today
let today = '2026-07-31';
let flightsToday = [];
AppData.passengers.forEach(pax => {
    if (pax.date !== today) return;
    if (pax.paxStatus !== 'Check-in Listo') return;
    flightsToday.push(pax);
});
console.log('Flights Today:', flightsToday.length);

// Simulate manifest.js filtering for tomorrow
let tomorrow = '2026-08-01';
let flightsTomorrow = [];
AppData.passengers.forEach(pax => {
    if (pax.date !== tomorrow) return;
    if (pax.paxStatus !== 'Check-in Listo') return;
    flightsTomorrow.push(pax);
});
console.log('Flights Tomorrow:', flightsTomorrow.length);
