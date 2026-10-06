const fs = require('fs');

let b2cCode = fs.readFileSync('js/modules/b2c-form.js', 'utf8');
const texts = JSON.parse(fs.readFileSync('pdf_texts_en.json', 'utf8'));

if (!b2cCode.includes('window.TerminosTextEn =')) {
    const injection = `window.TerminosTextEn = ${JSON.stringify(texts.terminos_en)};\nwindow.ExoneracionTextEn = ${JSON.stringify(texts.exoneracion_en)};\n`;
    // Insert after window.TerminosText
    b2cCode = b2cCode.replace('window.TerminosText =', injection + 'window.TerminosText =');
    fs.writeFileSync('js/modules/b2c-form.js', b2cCode, 'utf8');
    console.log('Injected English texts successfully.');
} else {
    console.log('Already injected.');
}
