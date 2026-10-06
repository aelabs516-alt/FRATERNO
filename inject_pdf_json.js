const fs = require('fs');

let b2cCode = fs.readFileSync('js/modules/b2c-form.js', 'utf8');
const texts = JSON.parse(fs.readFileSync('pdf_texts.json', 'utf8'));

if (!b2cCode.includes('window.TerminosText =')) {
    const injection = `window.TerminosText = ${JSON.stringify(texts.terminos)};\nwindow.ExoneracionText = ${JSON.stringify(texts.exoneracion)};\n`;
    b2cCode = injection + b2cCode;
    fs.writeFileSync('js/modules/b2c-form.js', b2cCode, 'utf8');
    console.log('Injected texts successfully using JSON stringify.');
} else {
    console.log('Already injected.');
}
