const fs = require('fs');
let code = fs.readFileSync('js/modules/billing.js', 'utf8');

// The single quotes were broken because $' became empty string.
// So: if(prevSub) prevSub.textContent = ' + subtotal.toLocaleString('es-CO');
// We want: if(prevSub) prevSub.textContent = '$' + subtotal.toLocaleString('es-CO');
code = code.replace(/textContent = ' \+ subtotal/g, "textContent = '$' + subtotal");
code = code.replace(/textContent = ' \+ iva/g, "textContent = '$' + iva");
code = code.replace(/textContent = ' \+ total/g, "textContent = '$' + total");

// And for the template literal:
// it was: <td ...>$\${item.price.toLocaleString('es-CO')}</td>
// which became: <td ...>${item.price.toLocaleString('es-CO')}</td> (which is valid syntax but missing $)
// wait, if $' became empty string, then $$ became $? 
// No, $$ in replace string becomes a literal $. So $\${ became \${
// Let's just fix the HTML template literal by completely replacing renderFacturaItems
const renderFacturaItemsNew = `
        function renderFacturaItems() {
            if(!itemsBody) return;
            itemsBody.innerHTML = '';
            let subtotal = 0;
            facturaItems.forEach((item, index) => {
                const totalLine = item.qty * item.price;
                subtotal += totalLine;
                const tr = document.createElement('tr');
                tr.innerHTML = \`
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">\${escapeHTML(item.desc)}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: center;">\${item.qty}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: right;">$\${item.price.toLocaleString('es-CO')}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: right;">$\${totalLine.toLocaleString('es-CO')}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: center;" class="no-print">
                        <button class="btn-del-item" data-idx="\${index}" style="background: none; border: none; color: #d32f2f; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </td>
                \`;
                itemsBody.appendChild(tr);
            });

            document.querySelectorAll('.btn-del-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
                    facturaItems.splice(idx, 1);
                    renderFacturaItems();
                });
            });

            const iva = subtotal * 0.19;
            const total = subtotal + iva;

            const prevSub = document.getElementById('prev-subtotal');
            const prevIva = document.getElementById('prev-iva');
            const prevTot = document.getElementById('prev-total');
            if(prevSub) prevSub.textContent = '$' + subtotal.toLocaleString('es-CO');
            if(prevIva) prevIva.textContent = '$' + iva.toLocaleString('es-CO');
            if(prevTot) prevTot.textContent = '$' + total.toLocaleString('es-CO');
        }
`;

// Replace the old renderFacturaItems function
const startIndex = code.indexOf('function renderFacturaItems() {');
if(startIndex !== -1) {
    const endIndex = code.indexOf('if(btnAddItem) {');
    if(endIndex !== -1) {
        code = code.substring(0, startIndex) + renderFacturaItemsNew + code.substring(endIndex);
    }
}

fs.writeFileSync('js/modules/billing.js', code, 'utf8');
console.log('Fixed syntax correctly');
