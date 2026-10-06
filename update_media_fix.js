const fs = require('fs');
let code = fs.readFileSync('js/modules/media.js', 'utf8');

const searchBlockRegex = /<div class="form-group" style="margin: 0;">\s*<label>Buscador<\/label>\s*<input type="text" id="media-search" class="form-control" placeholder="Buscar pasajero\.\.\." style="width: 250px;">\s*<\/div>/;

const replacementHtml = `
                    <div class="form-group" style="margin: 0;">
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; user-select: none; margin-bottom: 0.5rem; padding: 0.75rem 1rem; background: var(--bg-surface-hover); border-radius: 8px; border: 1px solid var(--border-color);">
                            <input type="checkbox" id="media-filter-pending" style="width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-weight: 500;">Solo pendientes</span>
                        </label>
                    </div>
                    <div class="form-group" style="margin: 0;">
                        <label>Buscador</label>
                        <input type="text" id="media-search" class="form-control" placeholder="Buscar pasajero..." style="width: 250px;">
                    </div>
`;

code = code.replace(searchBlockRegex, replacementHtml);
fs.writeFileSync('js/modules/media.js', code, 'utf8');
console.log('Fixed media.js HTML injection');
