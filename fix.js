const fs = require('fs');
let lines = fs.readFileSync('js/modules/b2c-form.js', 'utf8').split('\n');

let start_idx = -1;
let end_idx = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('document.getElementById(\'b2c-lname\').value = nameParts.slice(1)')) {
        start_idx = i + 1;
    }
    if (start_idx !== -1 && i > start_idx && lines[i].includes('selCountry.dispatchEvent(new Event(\'change\'));')) {
        end_idx = i + 2;
        break;
    }
}

if (start_idx !== -1 && end_idx !== -1) {
    const new_code = `                const phoneInput = document.getElementById('b2c-phone');
                if (phoneInput && found.phone) phoneInput.value = found.phone;
                
                const emailInput = document.getElementById('b2c-email');
                if (emailInput && found.email) emailInput.value = found.email;
                
                if(found.dob) {
                    const birthDate = new Date(found.dob);
                    const today = new Date();
                    let age = today.getFullYear() - birthDate.getFullYear();
                    const m = today.getMonth() - birthDate.getMonth();
                    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                        age--;
                    }
                    if (age < 18) {
                        isMinorFlow = true;
                        document.getElementById('selfie-section').style.display = 'none';
                        document.getElementById('signature-section').style.display = 'none';
                        document.getElementById('minor-selfie-section').style.display = 'block';
                        document.getElementById('minor-signature-section').style.display = 'block';
                    } else {
                        isMinorFlow = false;
                        document.getElementById('selfie-section').style.display = 'block';
                        document.getElementById('signature-section').style.display = 'block';
                        document.getElementById('minor-selfie-section').style.display = 'none';
                        document.getElementById('minor-signature-section').style.display = 'none';
                    }
                }
            } else {
                document.getElementById('b2c-fname').value = '';
                document.getElementById('b2c-lname').value = '';
            }
        });

        // Asesor Toggle Logic
        const contactMethod = document.getElementById('contact-method');
        const asesorContainer = document.getElementById('asesor-container');
        if (contactMethod && asesorContainer) {
            contactMethod.addEventListener('change', (e) => {
                if (e.target.value === 'asesor') {
                    asesorContainer.style.display = 'block';
                } else {
                    asesorContainer.style.display = 'none';
                }
            });
        }

        const selCountry = document.getElementById('loc-country');
        const selState = document.getElementById('loc-state');
        const selCity = document.getElementById('loc-city');

        if(selCountry && selState && selCity) {
            selCountry.innerHTML = '<option value="" disabled selected>Cargando países...</option>';
            selState.innerHTML = '<option value="" disabled selected>Seleccione un País primero</option>';
            selCity.innerHTML = '<option value="" disabled selected>Seleccione un Estado primero</option>';

            fetch('https://countriesnow.space/api/v0.1/countries/states')
                .then(res => res.json())
                .then(res => {
                    if(!res.error) {
                        selCountry.innerHTML = '<option value="" disabled selected>Seleccione el país</option>';
                        const data = res.data;
                        const colIdx = data.findIndex(c => c.name === 'Colombia');
                        if (colIdx > -1) {
                            const col = data.splice(colIdx, 1)[0];
                            data.unshift(col);
                        }
                        
                        data.forEach(c => {
                            const opt = document.createElement('option');
                            opt.value = c.name;
                            opt.textContent = c.name;
                            selCountry.appendChild(opt);
                        });
                        
                        window.worldDataCache = data;
                        selCountry.value = 'Colombia';
                        selCountry.dispatchEvent(new Event('change'));
                    }
                })
                .catch(err => {
                    selCountry.innerHTML = '<option value="Colombia">Colombia</option>';
                    selState.innerHTML = '<option value="Cundinamarca">Cundinamarca</option>';
                    selCity.innerHTML = '<option value="Bogotá">Bogotá</option>';
                });

            selCountry.addEventListener('change', () => {
                selState.innerHTML = '<option value="" disabled selected>Seleccione el estado</option>';
                selCity.innerHTML = '<option value="" disabled selected>Seleccione un Estado primero</option>';
                
                if (window.worldDataCache) {
                    const countryData = window.worldDataCache.find(c => c.name === selCountry.value);
                    if (countryData && countryData.states && countryData.states.length > 0) {
                        const states = [...countryData.states].sort((a,b) => a.name.localeCompare(b.name));
                        states.forEach(s => {
                            const opt = document.createElement('option');
                            opt.value = s.name;
                            opt.textContent = s.name;
                            selState.appendChild(opt);
                        });
                        selState.selectedIndex = 0;
                        selState.dispatchEvent(new Event('change'));
                    } else {
                        selState.innerHTML = '<option value="N/A">N/A</option>';
                        selCity.innerHTML = '<option value="N/A">N/A</option>';
                    }
                }
            });

            selState.addEventListener('change', () => {
                selCity.innerHTML = '<option value="" disabled selected>Cargando ciudades...</option>';
                
                fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        country: selCountry.value,
                        state: selState.value
                    })
                })
                .then(res => res.json())
                .then(res => {
                    selCity.innerHTML = '<option value="" disabled selected>Seleccione la ciudad</option>';
                    if(!res.error && res.data && res.data.length > 0) {
                        res.data.sort((a,b) => a.localeCompare(b)).forEach(city => {
                            const opt = document.createElement('option');
                            opt.value = city;
                            opt.textContent = city;
                            selCity.appendChild(opt);
                        });
                    } else {
                        selCity.innerHTML = '<option value="N/A">N/A</option>';
                    }
                })
                .catch(err => {
                    selCity.innerHTML = '<option value="N/A">N/A</option>';
                });
            });
        }`;
    
    const before = lines.slice(0, start_idx).join('\n');
    const after = lines.slice(end_idx).join('\n');
    fs.writeFileSync('js/modules/b2c-form.js', before + '\n' + new_code + '\n' + after, 'utf8');
    console.log('Fixed correctly');
} else {
    console.log('Not found boundaries', start_idx, end_idx);
}

