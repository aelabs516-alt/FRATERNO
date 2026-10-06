const fs = require('fs');
let code = fs.readFileSync('js/modules/dashboard.js', 'utf8');

// 1. Add pulse animation CSS
code = code.replace(/<\/style>/, `
                @keyframes pulseGlow {
                    0% { transform: scale(1); opacity: 0.15; text-shadow: 0 0 0 transparent; }
                    50% { transform: scale(1.15) rotate(5deg); opacity: 0.4; text-shadow: 0 0 20px currentColor; }
                    100% { transform: scale(1); opacity: 0.15; text-shadow: 0 0 0 transparent; }
                }
                .dash-icon-pulse {
                    animation: pulseGlow 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }
            </style>`);

// 2. Add dash-icon-pulse class to dash-icons
code = code.replace(/class="fas fa-parachute-box dash-icon"/, 'class="fas fa-parachute-box dash-icon dash-icon-pulse"');
code = code.replace(/class="fas fa-sack-dollar dash-icon"/, 'class="fas fa-sack-dollar dash-icon dash-icon-pulse"');

// 3. Replace progress bars with canvas for Chart.js
const regexBars = /<div style="margin-bottom: 1\.5rem;">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;
const replacementBars = `<div style="position: relative; height: 220px; width: 100%;">
                        <canvas id="monthDistributionChart"></canvas>
                    </div>
                </div>`;
if (regexBars.test(code)) {
    code = code.replace(regexBars, replacementBars);
}

// 4. Update init function to draw chart
const regexInit = /init:\s*\(\)\s*=>\s*\{[\s\S]*?\}/;
const replacementInit = `init: () => {
        // Recalculate stats for chart
        const paxs = window.AppData?.passengers || [];
        const now = new Date();
        const todayStr = now.toLocaleDateString('en-CA');
        const currentMonth = todayStr.substring(0, 7);
        const monthPaxs = paxs.filter(p => p.date && p.date.startsWith(currentMonth) && (p.flightStatus === 'Aterrizó' || p.flightStatus === 'Completado' || p.paxStatus === 'Completado'));
        
        let countTandem = 0;
        let countFun = 0;
        monthPaxs.forEach(p => {
            const pType = (p.type || '').toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
            if (pType.includes('tandem')) countTandem++;
            else countFun++;
        });

        // Initialize Chart.js with dark theme support
        const ctx = document.getElementById('monthDistributionChart');
        if (ctx && typeof Chart !== 'undefined') {
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Tándem', 'Fun Jumper'],
                    datasets: [{
                        data: [countTandem, countFun],
                        backgroundColor: [
                            'rgba(14, 165, 233, 0.85)', // Cyan
                            'rgba(16, 185, 129, 0.85)'  // Emerald
                        ],
                        borderColor: [
                            '#0ea5e9',
                            '#10b981'
                        ],
                        borderWidth: 2,
                        hoverOffset: 10,
                        hoverBorderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: '#e2e8f0',
                                font: {
                                    family: "'Inter', sans-serif",
                                    size: 13,
                                    weight: '500'
                                },
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderWidth: 1,
                            padding: 12,
                            displayColors: true,
                            boxPadding: 4,
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0) || 1;
                                    const percentage = Math.round((value / total) * 100) + '%';
                                    return \` \${context.label}: \${value} (\${percentage})\`;
                                }
                            }
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 1500,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
    }`;

code = code.replace(regexInit, replacementInit);

fs.writeFileSync('js/modules/dashboard.js', code, 'utf8');
console.log("Updated dashboard.js");
