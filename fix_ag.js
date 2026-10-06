const fs = require('fs');
let code = fs.readFileSync('js/modules/autogestion.js', 'utf8');

const regexToFix = /(form\.innerHTML = `[\s\S]*?`;\s*)(\}\);)/;
const replacement = `$1
            } catch (err) {
                console.error(err);
                alert(translations[currentLang]?.alert_error || 'Error al procesar los PDFs.');
                btnFinish.disabled = false;
                btnFinish.innerHTML = translations[currentLang]?.btn_confirm || 'Confirmar Reserva';
            }
$2`;

if (regexToFix.test(code)) {
    code = code.replace(regexToFix, replacement);
    fs.writeFileSync('js/modules/autogestion.js', code, 'utf8');
    console.log("Fixed syntax error");
} else {
    console.log("Could not find regex to fix");
}
