const fs = require('fs');
let code = fs.readFileSync('js/modules/autogestion.js', 'utf8');

const regex = /totalDetEl\.textContent = `Total para \$\{qty\} persona\(s\)`;\s*\}\s*\}/;
if (regex.test(code)) {
    code = code.replace(regex, `totalDetEl.textContent = \`Total para \${qty} persona(s)\`;
            }
            checkFormValid();
        }`);
    console.log("Success replacing regex.");
} else {
    console.log("Failed regex");
}
fs.writeFileSync('js/modules/autogestion.js', code, 'utf8');
