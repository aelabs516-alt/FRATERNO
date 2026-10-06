const fs = require('fs');

let b2cCode = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

// 1. Remove generatePDF logic and replace listeners
const regex = /const btnPdf = document\.getElementById\('btn-download-pdf'\);[\s\S]*?doc\.save\(filename\);\s*\}/g;

const newLogic = `const btnPdf = document.getElementById('btn-download-pdf');
        if (btnPdf) {
            btnPdf.addEventListener('click', (e) => {
                e.preventDefault();
                const link = document.createElement('a');
                if (currentLang === 'en') {
                    link.href = 'assets/docs/Terminos_y_Condiciones_EN.pdf';
                    link.download = 'Terminos_y_Condiciones_EN.pdf';
                } else {
                    link.href = 'assets/docs/Terminos_y_Condiciones_ES.pdf';
                    link.download = 'Terminos_y_Condiciones_ES.pdf';
                }
                link.click();
            });
        }
        
        const btnExo = document.getElementById('btn-download-exo');
        if (btnExo) {
            btnExo.addEventListener('click', (e) => {
                e.preventDefault();
                const link = document.createElement('a');
                if (currentLang === 'en') {
                    link.href = 'assets/docs/Exoneracion_Responsabilidad_EN.pdf';
                    link.download = 'Exoneracion_Responsabilidad_EN.pdf';
                } else {
                    link.href = 'assets/docs/Exoneracion_Responsabilidad_ES.pdf';
                    link.download = 'Exoneracion_Responsabilidad_ES.pdf';
                }
                link.click();
            });
        }`;

if (regex.test(b2cCode)) {
    b2cCode = b2cCode.replace(regex, newLogic);
    fs.writeFileSync('js/modules/b2c-form.js', b2cCode, 'utf8');
    console.log("PDF logic updated to direct file download.");
} else {
    console.log("Failed to find pdf logic");
}
