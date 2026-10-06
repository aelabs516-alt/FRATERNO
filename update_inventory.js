const fs = require('fs');
let code = fs.readFileSync('js/modules/inventory.js', 'utf8');

const regexCalcHealth = /function calculateHealth\(part\) \{[\s\S]*?return 'success';\s*\}/;
const replaceCalcHealth = `function calculateHealth(part) {
            if (!part) return { status: 'success', reason: 'ok' };
            let percentJumps = 0;
            let percentTime = 0;
            let diffMonths = 0;

            if (part.limitJumps) percentJumps = (part.currentJumps / part.limitJumps) * 100;
            
            if (part.limitMonths && part.date) {
                const start = new Date(part.date);
                const now = new Date();
                diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                percentTime = (diffMonths / part.limitMonths) * 100;
            }

            const maxPercent = Math.max(percentJumps, percentTime);
            let status = 'success';
            if (maxPercent >= 100) status = 'danger';
            else if (maxPercent >= 90) status = 'warning';
            
            let reason = 'ok';
            let val = '';
            if (status !== 'success') {
                if (percentTime > percentJumps) {
                    reason = 'time';
                    val = \`\${diffMonths} meses (límite \${part.limitMonths})\`;
                } else {
                    reason = 'jumps';
                    val = \`\${part.currentJumps} saltos (límite \${part.limitJumps})\`;
                }
            } else {
                reason = 'ok';
                val = \`\${part.currentJumps} saltos\`;
            }

            return { status, reason, val };
        }`;

code = code.replace(regexCalcHealth, replaceCalcHealth);

// We need to replace the usage in renderTandems and renderFunTable
// In renderTandems (which renders `tandemTableBody`):
const regexRenderPart1 = /const health = calculateHealth\(part\);[\s\S]*?return \`/;
const replaceRenderPart1 = `const healthData = calculateHealth(part);
                    let alertHtml = '';
                    if (healthData.status === 'danger' || healthData.status === 'warning') {
                        const color = healthData.status === 'danger' ? 'var(--brand-danger)' : 'var(--brand-warning)';
                        alertHtml = \`<div style="color: \${color}; font-size: 0.75rem; font-weight: bold; margin-top:4px; padding: 2px 4px; border: 1px solid \${color}; border-radius: 4px; display: inline-block;">
                            <i class="fas fa-exclamation-triangle"></i> \${healthData.val}
                        </div>\`;
                    } else {
                        alertHtml = \`<div style="color: var(--brand-success); font-size: 0.75rem; margin-top:2px;">\${healthData.val}</div>\`;
                    }
                    
                    return \``;
                    
// Since we have renderTandems and renderFunTable, let's just globally replace this if it occurs multiple times, or do it twice.
let parts = code.split(/const health = calculateHealth\(part\);/);
if (parts.length > 1) {
    code = parts[0];
    for (let i = 1; i < parts.length; i++) {
        let replacement = replaceRenderPart1;
        // The original code was:
        // const health = calculateHealth(part);
        // let alertHtml = '';
        // if (health === 'danger' || health === 'warning') {
        // ...
        // } else {
        // ...
        // }
        // return `
        // we need to find the `return \`` and replace everything in between.
        let subPart = parts[i];
        let returnIdx = subPart.indexOf('return `');
        if (returnIdx !== -1) {
            code += replacement + subPart.substring(returnIdx + 8);
        } else {
            code += 'const health = calculateHealth(part);' + subPart;
        }
    }
}

fs.writeFileSync('js/modules/inventory.js', code, 'utf8');
console.log('inventory.js updated.');
