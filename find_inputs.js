const fs = require('fs');
const path = './js/modules/';

fs.readdirSync(path).forEach(f => {
    if(f.endsWith('.js')){
        const t = fs.readFileSync(path+f,'utf8');
        const regex = /<input[^>]+>/g;
        let match;
        while((match = regex.exec(t)) !== null) {
            const inputHTML = match[0];
            if(inputHTML.includes('type="number"') || inputHTML.toLowerCase().includes('precio') || inputHTML.toLowerCase().includes('monto') || inputHTML.toLowerCase().includes('amount') || inputHTML.toLowerCase().includes('fee') || inputHTML.toLowerCase().includes('price')) {
                console.log(f, inputHTML);
            }
        }
    }
});
