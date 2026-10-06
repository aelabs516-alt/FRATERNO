const fs = require('fs');

let billingCode = fs.readFileSync('js/modules/billing.js', 'utf8');
let match = billingCode.match(/src="(data:image\/png;base64,[^"]+)"/);

if (match) {
    let base64Logo = match[1];
    let dashboardCode = fs.readFileSync('js/modules/dashboard.js', 'utf8');
    
    dashboardCode = dashboardCode.replace(/src="img\/logo\.png"/g, 'src="' + base64Logo + '"');
    
    fs.writeFileSync('js/modules/dashboard.js', dashboardCode);
    console.log('Logo replaced successfully in dashboard.js!');
} else {
    console.log('Base64 logo not found in billing.js');
}
