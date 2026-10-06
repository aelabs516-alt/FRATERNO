const fs = require('fs');
let code = fs.readFileSync('js/modules/dashboard.js', 'utf8');

// 1. Render variables
const newInitVariables = `        const filterMode = window.AppData?.dashboardFilterMode || 'date';
        const todayStr = window.AppData?.dashboardFilterDate || (filterMode === 'month' ? new Date().toLocaleDateString('en-CA').substring(0,7) : new Date().toLocaleDateString('en-CA'));
        const parts = todayStr.split('-');
        let todayFormatted = todayStr;
        if (parts.length === 3) {
            todayFormatted = \`\${parts[2]}/\${parts[1]}/\${parts[0]}\`;
        } else if (parts.length === 2) {
            todayFormatted = \`\${parts[1]}/\${parts[0]}\`;
        }`;

code = code.replace(
    /const todayStr = window\.AppData\?\.dashboardFilterDate.*?;.*?const todayFormatted = `\$\{parts\[2\]\}\/\$\{parts\[1\]\}\/\$\{parts\[0\]\}`; \/\/ DD\/MM\/YYYY/s,
    newInitVariables
);

// 2. Adjust todayPaxs filter inside render
code = code.replace(
    'return p.date === todayStr && !isCancelled;',
    'return p.date && p.date.startsWith(todayStr) && !isCancelled;'
);

// 3. Adjust Titles based on mode
code = code.replace('const jumpsToday = landedPaxs.length;', 'const jumpsToday = landedPaxs.length;\n        const lblHoy = filterMode === \\'month\\' ? \\'Mes\\' : \\'Hoy\\';');
code = code.replace('<div class="kpi-title">Saltos Hoy</div>', '<div class="kpi-title">Saltos ${lblHoy}</div>');
code = code.replace('<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #0ea5e9; font-weight: 600;"><i class="fas fa-arrow-trend-up"></i> Operación Activa</p>', '<p style="margin: 0.5rem 0 0 0; font-size: 0.85rem; color: #0ea5e9; font-weight: 600;"><i class="fas fa-arrow-trend-up"></i> Operación ${lblHoy}</p>');
code = code.replace('<h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; color: var(--text-primary);"><i class="fas fa-hand-holding-dollar" style="color: #f59e0b; margin-right: 0.5rem;"></i> Ingresos Estimados (Hoy)</h3>', '<h3 style="margin: 0 0 1.5rem 0; font-size: 1.1rem; color: var(--text-primary);"><i class="fas fa-hand-holding-dollar" style="color: #f59e0b; margin-right: 0.5rem;"></i> Ingresos Estimados (${lblHoy})</h3>');

// 4. Update the UI Filter section
const uiFilter = `
                        <div style="margin-top: 0.5rem; display: flex; align-items: center; gap: 0.75rem; color: var(--text-secondary); font-size: 0.95rem;">
                            <span>Resumen de operaciones:</span>
                            <select id="dash-filter-mode" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 6px; padding: 0.4rem; outline: none; font-weight: 600; cursor: pointer;">
                                <option value="date" \${filterMode === 'date' ? 'selected' : ''}>Día Específico</option>
                                <option value="month" \${filterMode === 'month' ? 'selected' : ''}>Mes Completo</option>
                            </select>
                            <input type="\${filterMode}" id="dash-filter-date" value="\${todayStr}" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); border-radius: 6px; padding: 0.4rem 0.75rem; outline: none; font-family: inherit; font-weight: 600; cursor: pointer; transition: border-color 0.2s;">
                        </div>`;

code = code.replace(
    /<div style="margin-top: 0\.5rem; display: flex; align-items: center; gap: 0\.75rem; color: var\(--text-secondary\); font-size: 0\.95rem;">.*?<\/div>/s,
    uiFilter
);

// 5. Update Event Listeners in init()
const listeners = `
        const modeInput = document.getElementById('dash-filter-mode');
        if(modeInput) {
            modeInput.addEventListener('change', (e) => {
                window.AppData.dashboardFilterMode = e.target.value;
                if(e.target.value === 'month') {
                    window.AppData.dashboardFilterDate = new Date().toLocaleDateString('en-CA').substring(0,7);
                } else {
                    window.AppData.dashboardFilterDate = new Date().toLocaleDateString('en-CA');
                }
                if(window.Modules.dashboard.init) {
                    const container = document.getElementById('content-dashboard') || document.querySelector('.main-content');
                    if(container) {
                        window.Modules.dashboard.render(container);
                        window.Modules.dashboard.init();
                    }
                }
            });
        }

        const dateInput = document.getElementById('dash-filter-date');
        if(dateInput) {
            dateInput.addEventListener('change', (e) => {
                window.AppData.dashboardFilterDate = e.target.value;
                if(window.Modules.dashboard.init) {
                    const container = document.getElementById('content-dashboard') || document.querySelector('.main-content');
                    if(container) {
                        window.Modules.dashboard.render(container);
                        window.Modules.dashboard.init();
                    }
                }
            });
        }`;

code = code.replace(
    /const dateInput = document\.getElementById\('dash-filter-date'\);.*?}\n        }/s,
    listeners
);

// 6. Fix init() filtering logic to use startsWith instead of === todayStr
code = code.replace(
    "const todayPaxs = paxs.filter(p => p.date === todayStr && !(p.paxStatus && p.paxStatus.includes('Cancelado')) && !(p.flightStatus && p.flightStatus.includes('Cancelado')));",
    "const todayPaxs = paxs.filter(p => p.date && p.date.startsWith(todayStr) && !(p.paxStatus && p.paxStatus.includes('Cancelado')) && !(p.flightStatus && p.flightStatus.includes('Cancelado')));"
);

// 7. Fix variables in init
code = code.replace(
    "const todayStr = window.AppData?.dashboardFilterDate || new Date().toLocaleDateString('en-CA');",
    "const filterMode = window.AppData?.dashboardFilterMode || 'date';\n        const todayStr = window.AppData?.dashboardFilterDate || (filterMode === 'month' ? new Date().toLocaleDateString('en-CA').substring(0,7) : new Date().toLocaleDateString('en-CA'));"
);

fs.writeFileSync('js/modules/dashboard.js', code);
console.log('Done!');
