const fs = require('fs');
let code = fs.readFileSync('js/modules/autogestion.js', 'utf8');

const regex = /const qty = parseInt\(document\.getElementById\('ag-qty'\)\.value\) \|\| 1;\s*for \(let pax = 1; pax <= qty; pax\+\+\) \{/;
if (regex.test(code)) {
    code = code.replace(regex, `const totalPax = parseInt(document.getElementById('ag-qty').value) || 1;
                for (let pax = 1; pax <= totalPax; pax++) {`);
    console.log("Replaced qty with totalPax.");
} else {
    console.log("Failed to find regex");
}
fs.writeFileSync('js/modules/autogestion.js', code, 'utf8');
