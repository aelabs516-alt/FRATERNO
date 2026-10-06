const fs = require('fs');

try {
    const code = fs.readFileSync('js/modules/billing.js', 'utf8');
    let output = '';
    
    // We will extract the exact logic inside init
    const renderMatch = code.indexOf('init: () => {');
    const initCode = code.substring(renderMatch + 13, code.lastIndexOf('}') - 1);
    
    // We mock window and document
    global.window = {
        AppData: { employees: [], maestroValores: [], inventory: [], enabledModules: {} },
        location: { hash: '#/facturacion' },
        jspdf: { jsPDF: class {} },
        html2canvas: () => Promise.resolve({ toDataURL: () => '' }),
        localStorage: { getItem: () => null, setItem: () => {} }
    };
    global.document = {
        getElementById: (id) => {
            if (id === 'app-view') return { style: {} };
            // Let's create a proxy to pretend any property exists and doesn't throw on undefined
            return {
                style: {},
                classList: { remove: () => {}, add: () => {} },
                addEventListener: () => {},
                appendChild: () => {},
                innerHTML: '',
                value: '',
                options: [], // So options.length works!
                textContent: ''
            };
        },
        querySelectorAll: () => [],
        querySelector: () => null,
        createElement: () => ({ style: {}, classList: { add: () => {}, remove: () => {} }, appendChild: () => {}, innerHTML: '' })
    };
    
    global.escapeHTML = (str) => str;
    
    // Evaluate init Code
    const initFn = new Function(initCode);
    initFn();
    console.log('INIT EXECUTED PERFECTLY!');
} catch(e) {
    console.error('ERROR DURING INIT:', e.message);
    console.error(e.stack);
}
