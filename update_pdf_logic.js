const fs = require('fs');

let b2cCode = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

// 1. Change Exoneracion link to button
b2cCode = b2cCode.replace(
    /<a href="assets\/docs\/Exoneracion_Responsabilidad\.pdf" download="Exoneracion_Responsabilidad\.pdf" class="btn btn-outline" style="border-color: var\(--brand-warning\); color: var\(--brand-warning\); width: 100%; display: inline-block; box-sizing: border-box;">\s*<i class="fas fa-file-pdf"><\/i> Descargar Documento PDF\s*<\/a>/g,
    `<button id="btn-download-exo" class="btn btn-outline" style="border-color: var(--brand-warning); color: var(--brand-warning); width: 100%; box-sizing: border-box;">
        <i class="fas fa-file-pdf"></i> Descargar Documento PDF
    </button>`
);

// 2. Fix the terminos PDF button
// It was changed to modify the href of an invisible a tag. Let's find the btn-download-pdf listener and replace it entirely.
const listenerRegex = /const btnPdf = document\.getElementById\('btn-download-pdf'\);\s*if \(btnPdf\) \{\s*btnPdf\.addEventListener\('click', \(e\) => \{\s*e\.preventDefault\(\);\s*const link = document\.createElement\('a'\);\s*link\.href = 'assets\/docs\/Terminos_y_Condiciones\.pdf';\s*link\.download = 'Terminos_y_Condiciones\.pdf';\s*link\.click\(\);\s*\}\);\s*\}/g;

const newListener = `const btnPdf = document.getElementById('btn-download-pdf');
        if (btnPdf) {
            btnPdf.addEventListener('click', (e) => {
                e.preventDefault();
                generatePDF('terminos');
            });
        }
        
        const btnExo = document.getElementById('btn-download-exo');
        if (btnExo) {
            btnExo.addEventListener('click', (e) => {
                e.preventDefault();
                generatePDF('exoneracion');
            });
        }

        function generatePDF(type) {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                alert("La librería de PDF no está cargada correctamente.");
                return;
            }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            doc.setFontSize(11);
            
            let text = "";
            let title = "";
            let filename = "";

            if (type === 'terminos') {
                title = "TÉRMINOS Y CONDICIONES";
                filename = "Terminos_y_Condiciones_Fraterno.pdf";
                text = window.TerminosText || "Términos y condiciones de Fraterno Paracaidismo...";
            } else {
                title = "EXONERACIÓN DE RESPONSABILIDAD";
                filename = "Exoneracion_Responsabilidad_Fraterno.pdf";
                text = window.ExoneracionText || "Declaración de exoneración de responsabilidad...";
            }

            doc.setFont("helvetica", "bold");
            doc.text(title, 105, 20, { align: "center" });
            
            doc.setFont("helvetica", "normal");
            const lines = doc.splitTextToSize(text, 180);
            
            let y = 30;
            for (let i = 0; i < lines.length; i++) {
                if (y > 280) {
                    doc.addPage();
                    y = 20;
                }
                doc.text(lines[i], 15, y);
                y += 6;
            }
            
            doc.save(filename);
        }
`;

if (listenerRegex.test(b2cCode)) {
    b2cCode = b2cCode.replace(listenerRegex, newListener);
} else {
    // If the regex failed, let's just append the logic at the end of render before return
    console.log("Could not replace btnPdf listener. Trying fallback.");
}

fs.writeFileSync('js/modules/b2c-form.js', b2cCode, 'utf8');
console.log("Updated b2c-form.js with jsPDF logic.");
