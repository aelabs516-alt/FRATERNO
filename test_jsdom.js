const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;
const code = fs.readFileSync('js/modules/billing.js', 'utf8');

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id='app-view'></div></body></html>`, { runScripts: 'dangerously' });
const window = dom.window;

// Setup mocks
window.AppData = { employees: [], maestroValores: [], inventory: [], enabledModules: {} };
window.location.hash = '#/facturacion';
window.Modules = {};
window.jspdf = { jsPDF: class {} };
window.html2canvas = () => Promise.resolve({ toDataURL: () => '' });
window.localStorage = { getItem: () => null, setItem: () => {} };
window.sessionStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };

// Expose escapeHTML globally
window.escapeHTML = (str) => {
    return str.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });
};

// Run billing.js
try {
    const script = dom.window.document.createElement('script');
    script.textContent = code;
    dom.window.document.body.appendChild(script);
    console.log('Script loaded successfully.');
    
    if (window.Modules.billing) {
        console.log('Billing module exists!');
        window.Modules.billing.render(window.document.getElementById('app-view'));
        console.log('Render successful.');
        
        // Let's stub chart creation because canvas doesn't exist
        window.Chart = function() {
            return { destroy: () => {}, update: () => {} };
        };

        window.Modules.billing.init();
        console.log('Init successful.');
    } else {
        console.log('Billing module DOES NOT EXIST!');
    }
} catch(e) {
    console.error('ERROR:', e);
}
