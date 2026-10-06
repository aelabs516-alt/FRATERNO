const fs = require('fs');
let code = fs.readFileSync('js/modules/fids.js', 'utf8');

const regexRenderStyle = /container\.innerHTML = \`/;
const replaceRenderStyle = `container.innerHTML = \`
            <style>
                @keyframes pulseRadar {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
                }
                @keyframes pulseBoarding {
                    0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
                    70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
                }
                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.35rem 0.75rem; 
                    border-radius: 4px; 
                    font-weight: bold; 
                    text-transform: uppercase; 
                    letter-spacing: 1px; 
                    background: rgba(0,0,0,0.3); 
                    font-size: 0.95rem;
                }
                .status-En-El-Aire {
                    animation: pulseRadar 2s infinite;
                    border: 1px solid #3b82f6;
                    color: #3b82f6;
                }
                .status-Abordando {
                    animation: pulseBoarding 2s infinite;
                    border: 1px solid #10b981;
                    color: #10b981;
                }
                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: currentColor;
                }
            </style>`;

if (regexRenderStyle.test(code) && !code.includes('pulseRadar')) {
    code = code.replace(regexRenderStyle, replaceRenderStyle);
}

const regexTd = /<div style="display: inline-block; padding: 0\.35rem 0\.75rem; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: \$\{getStatusColor\(p\.flightStatus\)\}; border: 1px solid \$\{getStatusColor\(p\.flightStatus\)\}; background: rgba\(0,0,0,0\.3\); font-size: 0\.95rem;">[\s\S]*?<\/div>/;
const replaceTd = `
                                    <div class="status-badge \${p.flightStatus === 'En El Aire' || p.flightStatus === 'Paracaidistas en el aire' ? 'status-En-El-Aire' : (p.flightStatus === 'Abordando' ? 'status-Abordando' : '')}" style="color: \${getStatusColor(p.flightStatus)}; border: 1px solid \${getStatusColor(p.flightStatus)};">
                                        \${(p.flightStatus === 'En El Aire' || p.flightStatus === 'Abordando' || p.flightStatus === 'Paracaidistas en el aire') ? '<div class="status-dot"></div>' : ''}
                                        <span>\${translateStatus(p.flightStatus, isEnglish)}</span>
                                    </div>`;
code = code.replace(regexTd, replaceTd);

fs.writeFileSync('js/modules/fids.js', code, 'utf8');
console.log("Updated fids.js");
