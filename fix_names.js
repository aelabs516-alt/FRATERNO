const fs = require('fs');

// 1. Fix b2c-form.js
let b2cCode = fs.readFileSync('C:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/b2c-form.js', 'utf8');
const b2cRegex = /existingPax\.medicalCondition = medicalValue;/g;
const b2cRepl = `existingPax.medicalCondition = medicalValue;
                        existingPax.name = (fName + ' ' + lName).trim();
                        existingPax.lastname = lName;
                        existingPax.phone = phone;`;
if (b2cCode.includes('existingPax.medicalCondition = medicalValue;')) {
    b2cCode = b2cCode.replace(b2cRegex, b2cRepl);
    fs.writeFileSync('C:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/b2c-form.js', b2cCode, 'utf8');
    console.log('Fixed b2c-form.js');
}

// 2. Fix reservations.js
let resCode = fs.readFileSync('C:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/reservations.js', 'utf8');
resCode = resCode.replace(/p\.name = pName\.value;/g, `p.name = pName.value;
            const pLastnameInput = document.getElementById('p-lastname');
            if (pLastnameInput) p.lastname = pLastnameInput.value;`);
resCode = resCode.replace(/pName\.value = p\.name;/g, `pName.value = p.name || '';
            const pLastnameInput = document.getElementById('p-lastname');
            if (pLastnameInput) pLastnameInput.value = p.lastname || '';`);
fs.writeFileSync('C:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/reservations.js', resCode, 'utf8');
console.log('Fixed reservations.js');

// 3. Fix booking.js
let bookingCode = fs.readFileSync('C:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/booking.js', 'utf8');
const bookingRegex = /iEditName\.value = p\.name \|\| '';/g;
const bookingRepl = `
                    let fullName = (p.name || '').trim();
                    if (p.lastname && !fullName.includes(p.lastname)) {
                        fullName += ' ' + p.lastname;
                    }
                    iEditName.value = fullName.trim();
`;
bookingCode = bookingCode.replace(bookingRegex, bookingRepl);
fs.writeFileSync('C:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/booking.js', bookingCode, 'utf8');
console.log('Fixed booking.js');
