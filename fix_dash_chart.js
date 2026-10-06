const fs = require('fs');

let fileStr = fs.readFileSync('js/modules/dashboard.js', 'utf8');

// 1. In render(), change the title of the chart
fileStr = fileStr.replace(
    /Distribuci(.)n de Saltos \(Mes\)/,
    "Distribuci$1n de Saltos (${lblHoy})"
);
fileStr = fileStr.replace(
    /Distribuci(.)n Mensual/g,
    "Distribuci$1n de Saltos"
);
fileStr = fileStr.replace(
    /T(.*)ndem \(Mes\)/,
    "T$1ndem (${lblHoy})"
);
fileStr = fileStr.replace(
    /Fun Jumper \(Mes\)/,
    "Fun Jumper (${lblHoy})"
);

// 2. Change the calculation logic in render()
const oldCalcRender = `        // 5. Month Distributions (Always calculated based on selected month or date's month)
        const currentMonth = todayStr.substring(0, 7); // YYYY-MM
        const monthPaxs = paxs.filter(p => p.date && p.date.startsWith(currentMonth) && (p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado'));
        let countTandem = 0;
        let countFun = 0;
        monthPaxs.forEach(p => {`;
        
const newCalcRender = `        // 5. Period Distributions (Calculated based on selected filter date/month)
        let countTandem = 0;
        let countFun = 0;
        landedPaxs.forEach(p => {`;

fileStr = fileStr.replace(oldCalcRender, newCalcRender);

// Also need to handle the case if it has special characters
fileStr = fileStr.replace(
    "const monthPaxs = paxs.filter(p => p.date && p.date.startsWith(currentMonth) && (p.flightStatus === 'Aterriz' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado'));",
    ""
);

// 3. Change the calculation logic in init()
const oldInitCalc = `        const currentMonth = todayStr.substring(0, 7);
        const monthPaxs = paxs.filter(p => p.date && p.date.startsWith(currentMonth) && (p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado'));
        
        let countTandem = 0, countFun = 0;
        monthPaxs.forEach(p => {`;

const newInitCalc = `        const periodPaxs = paxs.filter(p => {
            const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
            return p.date && p.date.startsWith(todayStr) && !isCancelled && (p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado');
        });
        
        let countTandem = 0, countFun = 0;
        periodPaxs.forEach(p => {`;
        
fileStr = fileStr.replace(oldInitCalc, newInitCalc);
// special char fallback for init
fileStr = fileStr.replace(
    /const monthPaxs = paxs.filter\(p => p.date && p.date.startsWith\(currentMonth\) && \(p.flightStatus === 'Aterriz.' \|\| p.flightStatus === 'Completado' \|\| p.paxStatus === 'Completado'\)\);/,
    `const periodPaxs = paxs.filter(p => {
            const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
            return p.date && p.date.startsWith(todayStr) && !isCancelled && (p.flightStatus === 'Aterrizó' || p.flightStatus === 'Aterriz' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado');
        });`
);
fileStr = fileStr.replace(
    "monthPaxs.forEach(p => {",
    "periodPaxs.forEach(p => {"
);

// Also remove `const currentMonth = todayStr.substring(0, 7);` if it exists in init
fileStr = fileStr.replace(
    "const currentMonth = todayStr.substring(0, 7);",
    ""
);


fs.writeFileSync('js/modules/dashboard.js', fileStr);
console.log('Chart logic updated.');
