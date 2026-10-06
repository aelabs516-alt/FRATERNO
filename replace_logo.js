const fs = require('fs');
const bytes = fs.readFileSync('img/logo.png');
const b64 = 'data:image/png;base64,' + bytes.toString('base64');
let content = fs.readFileSync('js/modules/billing.js', 'utf8');
const regex = /<img src=\"data:image\/png;base64,[^\"]+\" alt=\"Fraterno Paracaidismo\" style=\"height: 90px; margin-bottom: 0.5rem; object-fit: contain;\">/;
content = content.replace(regex, '<img src=\"' + b64 + '\" alt=\"Fraterno Paracaidismo\" style=\"height: 90px; margin-bottom: 0.5rem; object-fit: contain;\">');
fs.writeFileSync('js/modules/billing.js', content);
console.log('Logo replaced successfully');
