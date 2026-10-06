const fs = require('fs');
let code = fs.readFileSync('js/modules/b2c-form.js', 'utf8');

const search = `            } else {
                document.getElementById('b2c-fname').value = '';
                document.getElementById('b2c-lname').value = '';
                    selCity.appendChild(opt);
                });
            });

            selCountry.value = "Colombia";
            selCountry.dispatchEvent(new Event('change'));
        }`;

const replacement = `            } else {
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

let noCr = code.replace(/\r/g, '');
let searchNoCr = search.replace(/\r/g, '');

if (noCr.includes(searchNoCr)) {
    noCr = noCr.replace(searchNoCr, replacement);
    fs.writeFileSync('js/modules/b2c-form.js', noCr, 'utf8');
    console.log('Successfully replaced logic!');
} else {
    console.log('Search string not found! Something changed.');
}
