const fs = require('fs');

let code = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

const regex = /link\.href = 'data:application\/pdf;base64,[^']+';\s*link\.download = 'Exoneracion_Responsabilidades\.pdf';/;

const replacement = `link.href = 'assets/docs/Terminos_y_Condiciones.pdf';
                  link.download = 'Terminos_y_Condiciones.pdf';`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('js/modules/b2c-form.js', code, 'utf8');
    console.log('Successfully updated terms PDF link.');
} else {
    console.log('Regex failed to match.');
}
