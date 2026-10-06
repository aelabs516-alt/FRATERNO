const fs = require('fs');
let code = fs.readFileSync('js/modules/reservations.js', 'utf8');

// 1. renderTabs
const regexTabs = /function renderTabs\(\) \{[\s\S]*?tabsContainer\.appendChild\(btn\);\s*\}\);\s*\}/;
const replaceTabs = `function isPaxComplete(p) {
            return p.name.trim() !== '' && p.doc.trim() !== '' && p.phone.trim() !== '';
        }

        function renderTabs() {
            tabsContainer.innerHTML = '';
            passengers.forEach((p, i) => {
                const btn = document.createElement('button');
                btn.className = 'btn ' + (i === activeIndex ? 'btn-primary' : 'btn-outline');
                btn.style.borderRadius = '20px';
                const statusIcon = isPaxComplete(p) ? '<i class="fas fa-check-circle" style="color: #10b981; margin-left:5px;"></i>' : '<i class="fas fa-exclamation-circle" style="color: #f59e0b; margin-left:5px;"></i>';
                btn.innerHTML = 'Pasajero ' + (i + 1) + statusIcon;
                btn.onclick = () => {
                    saveCurrentPassenger();
                    activeIndex = i;
                    renderTabs();
                    loadPassenger(activeIndex);
                    renderAdicionesUI(); // Refresh adiciones for new passenger
                };
                tabsContainer.appendChild(btn);
            });
        }`;

if (regexTabs.test(code)) {
    code = code.replace(regexTabs, replaceTabs);
    console.log("Replaced renderTabs");
} else {
    console.log("Failed to replace renderTabs");
}

// 2. Add animation keyframes at the top of the file in the style block
if (!code.includes('pulseGlow')) {
    code = code.replace(/<\/style>/, `
                @keyframes pulseGlow {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
            </style>`);
}

// 3. calculateGlobal
const regexCalc = /dPending\.textContent = '\$' \+ formatCurrency\(pending\);\s*\}/;
const replaceCalc = `dPending.textContent = '$' + formatCurrency(pending);
            if (pending > 0) {
                dPending.style.color = 'var(--brand-danger)';
            } else {
                dPending.style.color = 'var(--brand-success)';
            }

            const btnSave = document.getElementById('btn-save-res');
            if (btnSave) {
                if (pending === 0 && passengers.every(isPaxComplete)) {
                    btnSave.style.background = 'linear-gradient(135deg, #10b981, #059669)';
                    btnSave.style.animation = 'pulseGlow 2s infinite';
                } else {
                    btnSave.style.background = 'var(--brand-action)';
                    btnSave.style.animation = 'none';
                }
            }
        }`;

if (regexCalc.test(code)) {
    code = code.replace(regexCalc, replaceCalc);
    console.log("Replaced calculateGlobal");
} else {
    console.log("Failed to replace calculateGlobal");
}

fs.writeFileSync('js/modules/reservations.js', code, 'utf8');
