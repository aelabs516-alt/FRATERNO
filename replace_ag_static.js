const fs = require('fs');
let code = fs.readFileSync('js/modules/autogestion.js', 'utf8');

const regex1 = /<!-- 1\. Guía de Bienvenida -->[\s\S]*?<button type="submit" id="ag-btn-confirm"/;
if (regex1.test(code)) {
    code = code.replace(regex1, '<div id="ag-legal-container-1"></div>\n<button type="submit" id="ag-btn-confirm"');
    fs.writeFileSync('js/modules/autogestion.js', code, 'utf8');
    console.log("Success replacing static blocks.");
} else {
    console.log("Could not find static blocks");
}
