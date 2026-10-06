const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'js', 'modules');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

files.forEach(f => {
    const filePath = path.join(dir, f);
    let content = fs.readFileSync(filePath, 'utf8');
    
    let original = content;
    // Replace \` with `
    content = content.replace(/\\`/g, '`');
    // Replace \${ with ${
    content = content.replace(/\\\${/g, '${');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed', f);
    }
});
