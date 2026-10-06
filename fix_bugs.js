const fs = require('fs');

// 1. Fix reservations.js clearing form
let resJs = fs.readFileSync('js/modules/reservations.js', 'utf8');
if (!resJs.includes('passengers = [];\n            activeIndex = 0;')) {
    resJs = resJs.replace(
        "// Reset form\n            qtyInput.value = 1;",
        "// Reset form\n            passengers = [];\n            activeIndex = 0;\n            qtyInput.value = 1;"
    );
    fs.writeFileSync('js/modules/reservations.js', resJs);
}

// 2. Fix checkin.js
let checkinJs = fs.readFileSync('js/modules/checkin.js', 'utf8');

// Replace hardcoded checkboxes with a container
const oldCheckboxes = `<label>Servicios de Cǭmara</label>
                            <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                                <input type="checkbox" id="chk-360" class="cam-chk" value="360" data-price="150000"> 360 ($150.000)
                            </label>
                            <label style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;">
                                <input type="checkbox" id="chk-gopro" class="cam-chk" value="GoPro" data-price="100000"> GoPro ($100.000)
                            </label>
                            <label style="display:flex; align-items:center; gap:0.5rem;">
                                <input type="checkbox" id="chk-ext" class="cam-chk" value="Externa" data-price="250000"> Externa ($250.000)
                            </label>`;
const newCheckboxes = `<label>Servicios Adicionales (Sincronizado)</label>
                            <div id="checkin-dynamic-adiciones"></div>`;
                            
// Fallback for character encoding mismatch
checkinJs = checkinJs.replace(/<label>Servicios de C.mara<\/label>[\s\S]*?<label style="display:flex; align-items:center; gap:0.5rem;">[\s\S]*?<\/label>/, newCheckboxes);

// In openEditModal, populate the dynamic checkboxes
const dynamicLogic = `
            // Populate Dynamic Adiciones based on maestroValores and pax.adiciones
            const containerAdiciones = document.getElementById('checkin-dynamic-adiciones');
            if (containerAdiciones) {
                containerAdiciones.innerHTML = '';
                if (window.AppData.maestroValores) {
                    window.AppData.maestroValores.forEach(v => {
                        // Show cameras or all if Fun Jumper
                        if (['Cámara 360', 'Cámara Externa', 'Cámara Go-Pro'].includes(v.name) || pax.type === 'Fun Jumper') {
                            const lbl = document.createElement('label');
                            lbl.style = 'display:flex; align-items:center; gap:0.5rem; margin-bottom:0.5rem;';
                            const isChecked = pax.adiciones && pax.adiciones[v.name] === 'si' ? 'checked' : '';
                            lbl.innerHTML = \`<input type="checkbox" class="cam-chk" value="\${v.name}" data-price="\${v.price}" \${isChecked}> \${v.name} (\$\${parseInt(v.price).toLocaleString('es-CO')})\`;
                            containerAdiciones.appendChild(lbl);
                        }
                    });
                }
            }
            
            iCams = Array.from(document.querySelectorAll('.cam-chk'));
            iCams.forEach(chk => chk.addEventListener('change', calculateExtras));
            
            calculateExtras();`;

checkinJs = checkinJs.replace("calculateExtras();\n            modal.style.display = 'flex';", dynamicLogic + "\n            modal.style.display = 'flex';");

// When saving, update pax.adiciones and pax.cams
const saveLogicOld = `            // Gather cams
            const selectedCams = [];
            iCams.forEach(chk => { if(chk.checked) selectedCams.push(chk.value); });`;

const saveLogicNew = `            // Gather cams and sync with pax.adiciones
            const selectedCams = [];
            if (!pax.adiciones) pax.adiciones = {};
            iCams.forEach(chk => { 
                if(chk.checked) {
                    selectedCams.push(chk.value);
                    pax.adiciones[chk.value] = 'si';
                } else {
                    pax.adiciones[chk.value] = 'no';
                }
            });`;

checkinJs = checkinJs.replace(saveLogicOld, saveLogicNew);

// Also need to make sure iCams is queried dynamically rather than statically
checkinJs = checkinJs.replace("const iCams = document.querySelectorAll('.cam-chk');", "let iCams = Array.from(document.querySelectorAll('.cam-chk'));");

fs.writeFileSync('js/modules/checkin.js', checkinJs);
console.log('Bugs fixed successfully.');
