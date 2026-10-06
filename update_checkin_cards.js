const fs = require('fs');
let code = fs.readFileSync('js/modules/checkin.js', 'utf8');

const regexCardHTML = /card\.innerHTML = `[\s\S]*?`;/;
const replaceCardHTML = `
            let balanceBadge = '';
            let totalToPay = 0;
            if (pax.financiera) {
                 const base = pax.financiera.manualPrice || 0;
                 const discount = pax.financiera.discount || 0;
                 totalToPay = base - discount;
                 if (totalToPay < 0) totalToPay = 0;
            }
            const paid = pax.financiera ? (pax.financiera.totalPaid || 0) : 0;
            const pending = totalToPay - paid;
            
            if (pending > 0) {
                balanceBadge = '<span style="color: var(--brand-danger); font-weight: bold;"><i class="fas fa-exclamation-triangle"></i> Pendiente</span>';
            } else {
                balanceBadge = '<span style="color: var(--brand-success);"><i class="fas fa-check-circle"></i> Pagado</span>';
            }
            
            const signatureBadge = pax.waiverSigned ? '<span style="color: var(--brand-success);"><i class="fas fa-signature"></i> Firmado</span>' : '<span style="color: var(--text-secondary);"><i class="fas fa-signature"></i> Sin Firma</span>';
            const weightBadge = pax.weight ? \`<span style="color: var(--text-primary);"><i class="fas fa-weight-hanging"></i> \${pax.weight} Kg</span>\` : '<span style="color: var(--brand-warning);"><i class="fas fa-weight-hanging"></i> - Kg</span>';

            card.innerHTML = \`
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                    <strong class="p-name" style="font-size: 1.1rem; color: var(--text-primary);">\${pax.name || 'Sin Nombre'}</strong>
                    <span style="font-size: 0.75rem; background: \${badgeClass}; color: white; padding: 2px 8px; border-radius: 12px; font-weight: 600;">\${pax.type}</span>
                </div>
                
                <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas \${statusIcon}"></i> Hora: <strong>\${pax.time || 'N/A'}</strong>
                </div>
                
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; font-size: 0.75rem; background: rgba(0,0,0,0.2); padding: 0.5rem; border-radius: 6px;">
                    \${balanceBadge}
                    <span style="color: var(--text-secondary);">|</span>
                    \${signatureBadge}
                    <span style="color: var(--text-secondary);">|</span>
                    \${weightBadge}
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.8rem; color: var(--text-secondary); background: var(--bg-surface-hover); padding: 0.5rem; border-radius: 6px; margin-bottom: 0.5rem;">
                    <span><i class="fas fa-plane"></i> \${pax.aeronave || 'S/A'}</span>
                    <span><i class="fas fa-user-tie"></i> \${pax.instructor || 'S/A'}</span>
                    <span><i class="fas fa-video"></i> \${pax.cams || 'Ninguna'}</span>
                </div>
            \`;`;

if (regexCardHTML.test(code)) {
    code = code.replace(regexCardHTML, replaceCardHTML);
    console.log("Checkin logic replaced.");
} else {
    console.log("Failed checkin logic replace.");
}

fs.writeFileSync('js/modules/checkin.js', code, 'utf8');
