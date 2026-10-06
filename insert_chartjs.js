const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

if (!code.includes('chart.js')) {
    code = code.replace('<!-- Main CSS -->', '<!-- Chart.js -->\n    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n\n    <!-- Main CSS -->');
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Chart.js included in index.html");
} else {
    console.log("Chart.js already included");
}
