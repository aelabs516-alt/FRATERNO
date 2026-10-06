const fs = require('fs');
let code = fs.readFileSync('js/modules/media.js', 'utf8');

// 1. Add Checkbox HTML
code = code.replace(
    '<div class="form-group" style="margin: 0;">\n                        <label>Buscador</label>',
    `<div class="form-group" style="margin: 0; display: flex; align-items: flex-end;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none; margin-bottom: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-surface-hover); border-radius: 8px; border: 1px solid var(--border-color);">
                            <input type="checkbox" id="media-filter-pending" style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-weight: 500;">Solo pendientes</span>
                        </label>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label>Buscador</label>`
);

// 2. Register checkbox in JS
code = code.replace(
    'const searchInput = document.getElementById(\'media-search\');',
    `const searchInput = document.getElementById('media-search');
        const chkPending = document.getElementById('media-filter-pending');`
);

// 3. Bind event listener
code = code.replace(
    'searchInput.addEventListener(\'input\', renderTable);',
    `searchInput.addEventListener('input', renderTable);
        chkPending.addEventListener('change', renderTable);`
);

// 4. Update filtering logic
code = code.replace(
    'const term = searchInput.value.toLowerCase();',
    `const term = searchInput.value.toLowerCase();
            const showOnlyPending = chkPending.checked;`
);

code = code.replace(
    'if (!checkDateFilter(p.date)) return false;',
    `if (!checkDateFilter(p.date)) return false;
                if (showOnlyPending && p.mediaDelivered) return false;`
);

fs.writeFileSync('js/modules/media.js', code, 'utf8');
console.log('Done adding pending filter');
