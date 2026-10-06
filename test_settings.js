const fs = require('fs');

global.window = {
    location: { hash: '' },
    AppData: {
        prices: {},
        commissions: {},
        fleet: [],
        noOpRules: { daysOfWeek: [], specificDates: [] },
        pilots: []
    }
};
global.document = {
    createElement: () => ({ style: {}, classList: { add: () => {} }, appendChild: () => {} }),
    getElementById: (id) => {
        // Return a dummy object for getElementById to see if one is missing in the actual HTML
        return {
            addEventListener: () => {},
            appendChild: () => {},
            value: '',
            style: {}
        };
    },
    querySelectorAll: () => []
};

try {
    require('./js/modules/settings.js');
    console.log("Settings module loaded.");

    const div = { innerHTML: '', querySelectorAll: () => [] };
    window.Modules.settings.render(div);

    console.log("Rendered successfully.");
} catch (e) {
    console.error(e);
}
