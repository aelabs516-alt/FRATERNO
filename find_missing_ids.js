const fs = require('fs');

const code = fs.readFileSync('js/modules/settings.js', 'utf8');

// Extract the HTML template string
const templateMatch = code.match(/container\.innerHTML = \`(.*?)\`;/s);
const template = templateMatch ? templateMatch[1] : '';

// Extract all getElementById calls
const regex = /document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const missing = [];

while ((match = regex.exec(code)) !== null) {
    const id = match[1];
    // Exclude 'app-view' or anything that's globally present
    if (id === 'main-header' || id === 'sidebar' || id === 'app-wrapper' || id === 'app-view') continue;
    
    // Check if the id exists in the template
    if (!template.includes(`id="${id}"`) && !template.includes(`id='${id}'`)) {
        missing.push(id);
    }
}

console.log("Missing IDs:", [...new Set(missing)]);
