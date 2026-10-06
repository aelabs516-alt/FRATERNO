const fs = require('fs');
let code = fs.readFileSync('C:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/b2c-form.js', 'utf8');

const regex = /const \{\s*jsPDF\s*\} = window\.jspdf;[\s\S]*?docPdf\.save\("Documentos_Firmados_Fraterno\.pdf"\);/g;

const replacement = `const { jsPDF } = window.jspdf;
                    const docPdf = new jsPDF();
                    
                    docPdf.setFontSize(14);
                    docPdf.setTextColor(0, 0, 0);
                    docPdf.text(currentLang === 'es' ? "4. Exoneración de Responsabilidad" : "4. Liability Waiver", 105, 20, { align: "center" });
                    
                    docPdf.setFontSize(10);
                    docPdf.setTextColor(50, 50, 50);
                    
                    let baseText = currentLang === 'es' ? window.ExoneracionText : window.ExoneracionTextEn;
                    if (currentLang === 'es') {
                        baseText = baseText.replace("Yo, mayor de edad", "Yo, " + fName + " " + lName + ", mayor de edad, identificado(a) con No. " + doc);
                    } else {
                        baseText = baseText.replace("I, of legal age", "I, " + fName + " " + lName + ", of legal age, identified with No. " + doc);
                    }
                    
                    const initials = fName.charAt(0).toUpperCase() + lName.charAt(0).toUpperCase();
                    const bottomFieldsEs = "\\n\\nIniciales del participante: " + initials + "\\n\\nNombre completo: " + fName + " " + lName + "\\nDocumento: " + doc + "\\nFecha: " + new Date().toLocaleString();
                    const bottomFieldsEn = "\\n\\nParticipant Initials: " + initials + "\\n\\nFull Name: " + fName + " " + lName + "\\nID/Passport: " + doc + "\\nDate: " + new Date().toLocaleString();
                    
                    baseText += currentLang === 'es' ? bottomFieldsEs : bottomFieldsEn;
                    
                    const splitText = docPdf.splitTextToSize(baseText, 170);
                    
                    let y = 30;
                    for (let i = 0; i < splitText.length; i++) {
                        if (y > 270) {
                            docPdf.addPage();
                            y = 20;
                        }
                        docPdf.text(splitText[i], 20, y);
                        y += 5;
                    }
                    
                    // Add signature
                    docPdf.setTextColor(0, 0, 0);
                    if (y > 230) {
                        docPdf.addPage();
                        y = 20;
                    } else {
                        y += 10;
                    }
                    
                    if (isMinorFlow) {
                        docPdf.text(currentLang === 'es' ? "Firma Tutor Legal 1:" : "Tutor 1 Signature:", 20, y);
                        docPdf.addImage(sigDataUrlM, 'PNG', 20, y + 5, 80, 40);
                        if (!isSingleTutor) {
                            docPdf.text(currentLang === 'es' ? "Firma Tutor Legal 2:" : "Tutor 2 Signature:", 110, y);
                            docPdf.addImage(sigDataUrlF, 'PNG', 110, y + 5, 80, 40);
                        }
                    } else {
                        docPdf.text(currentLang === 'es' ? "Firma:" : "Signature:", 20, y);
                        docPdf.addImage(sigDataUrl, 'PNG', 20, y + 5, 80, 40);
                    }
                    
                    docPdf.save(currentLang === 'es' ? "4_Exoneracion_Responsabilidad_Firmado.pdf" : "4_Liability_Waiver_Signed.pdf");`;

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('C:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/b2c-form.js', code, 'utf8');
    console.log("PDF logic replaced successfully.");
} else {
    console.log("Failed to find PDF generation block.");
}
