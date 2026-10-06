const fs = require('fs');

// 1. UPDATE APP.JS
let appJs = fs.readFileSync('js/app.js', 'utf8');

// Update sidebar updating logic to include avatar
if (appJs.includes("const roleSpan = profileDiv.querySelector('.role');")) {
    appJs = appJs.replace(
        "const roleSpan = profileDiv.querySelector('.role');\n                if (h4) h4.innerText = user.name;\n                if (roleSpan) roleSpan.innerText = '[' + user.role + ']';",
        "const roleSpan = profileDiv.querySelector('.role');\n                const avatarImg = profileDiv.querySelector('.avatar img');\n                if (h4) h4.innerText = user.name;\n                if (roleSpan) roleSpan.innerText = '[' + user.role + ']';\n                if (avatarImg) avatarImg.src = user.photo || 'https://i.pravatar.cc/150?img=11';"
    );
}
fs.writeFileSync('js/app.js', appJs);

// 2. UPDATE SETTINGS.JS
let settingsJs = fs.readFileSync('js/modules/settings.js', 'utf8');

// Add id to photo input
settingsJs = settingsJs.replace(
    '<div class="form-group" style="grid-column: span 2; margin-bottom: 0;"><label>Foto (URL o Archivo)</label><input type="file" class="form-control" style="padding: 0.5rem;"></div>',
    '<div class="form-group" style="grid-column: span 2; margin-bottom: 0;"><label>Foto (URL o Archivo)</label><input type="file" id="usr-photo" class="form-control" style="padding: 0.5rem;" accept="image/*"></div>'
);

// Add event listener for file change right before Create User block
const fileEventBlock = `        const usrPhotoInput = document.getElementById('usr-photo');
        if (usrPhotoInput) {
            usrPhotoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        usrPhotoInput.dataset.base64 = evt.target.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    usrPhotoInput.dataset.base64 = '';
                }
            });
        }
        
        // =====================================
        // 4. Create User`;
if (!settingsJs.includes("usrPhotoInput.addEventListener")) {
    settingsJs = settingsJs.replace(
        "        // =====================================\n        // 4. Create User",
        fileEventBlock
    );
}

// Extract photo in btn-create-usr handler
if (!settingsJs.includes("const photoInput = document.getElementById('usr-photo');")) {
    settingsJs = settingsJs.replace(
        "const password = document.getElementById('usr-pass').value;",
        "const password = document.getElementById('usr-pass').value;\n            const photoInput = document.getElementById('usr-photo');\n            const photoData = photoInput ? photoInput.dataset.base64 : null;"
    );
    
    // Add to edit logic
    settingsJs = settingsJs.replace(
        "user.role = role;\n                    if (password) user.password = password;",
        "user.role = role;\n                    if (password) user.password = password;\n                    if (photoData) user.photo = photoData;"
    );
    
    // Add to create logic
    settingsJs = settingsJs.replace(
        "password: password || '1234'",
        "password: password || '1234',\n                    photo: photoData || ''"
    );
    
    // Reset inputs
    settingsJs = settingsJs.replace(
        "document.getElementById('usr-pass').value = '';",
        "document.getElementById('usr-pass').value = '';\n            if (photoInput) {\n                photoInput.value = '';\n                photoInput.dataset.base64 = '';\n            }"
    );
}

fs.writeFileSync('js/modules/settings.js', settingsJs);
console.log('Photo fix script executed successfully.');
