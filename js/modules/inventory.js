window.Modules = window.Modules || {};

window.Modules.inventory = {
    render: (container) => {
        container.innerHTML = `
            <div class="inventory-module" style="display: flex; flex-direction: column; height: 100%; gap: 1rem;">
                
                <!-- Header -->
                <div class="card" style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 1rem;">
                        <div style="width: 50px; height: 50px; border-radius: 12px; background: linear-gradient(135deg, var(--brand-success), #10b981); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem;">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <div>
                            <h2 style="margin: 0; color: var(--text-primary);">Gestión de Inventario</h2>
                            <p style="margin: 0; color: var(--text-secondary); font-size: 0.9rem;">Equipos de salto, AADs y repuestos</p>
                        </div>
                    </div>
                </div>

                <!-- Tabs Navigation -->
                <div style="display: flex; gap: 0.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;" id="inv-tabs">
                    <button class="btn btn-primary" data-target="tandem"><i class="fas fa-parachute-box"></i> Equipos Tándem</button>
                    <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="fun"><i class="fas fa-child"></i> Equipos Fun Jumper</button>
                    <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="accesorios"><i class="fas fa-tools"></i> Accesorios / Material</button>
                </div>
                
                <!-- ========================================== -->
                <!-- TAB 1: Equipos Tándem                      -->
                <!-- ========================================== -->
                <div id="content-tandem" class="inv-content" style="display: flex; flex: 1; flex-direction: column; gap: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0;">Equipos Tándem</h3>
                        <button class="btn btn-success" id="btn-new-tandem"><i class="fas fa-plus"></i> Ensamblar Equipo Tándem</button>
                    </div>
                    <!-- Lista en formato Grid -->
                    
                      <div class="table-responsive" style="flex: 1; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color);">
                          <table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                              <thead>
                                  <tr>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">ID Equipo</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Contenedor (25a)</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">AAD (20a)</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Principal (2000s)</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Reserva (20a)</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Arn&eacute;s</th>
                                      <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Acciones</th>
                                  </tr>
                              </thead>
                              <tbody id="tandem-table-body">
                                  <!-- Dynamic rows -->
                              </tbody>
                          </table>
                      </div>

                </div>

                <!-- ========================================== -->
                
                <!-- ========================================== -->
                <!-- TAB 3: Equipos Fun Jumper / Escuela        -->
                <!-- ========================================== -->
                <div id="content-fun" class="inv-content" style="display: none; flex: 1; flex-direction: column; gap: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0;">Fun jumper - Escuela</h3>
                        <button class="btn btn-success" id="btn-add-fun"><i class="fas fa-plus"></i> Nuevo Equipo</button>
                    </div>
                    <div class="table-responsive" style="flex: 1; background: var(--bg-surface); border-radius: 8px; border: 1px solid var(--border-color);">
                        <table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                            <thead>
                                <tr>
                                    <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">ID Equipo</th>
                                    <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Contenedor (25a)</th>
                                    <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">AAD (20a)</th>
                                    <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Principal (2000s)</th>
                                    <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Reserva (20a)</th>
                                    <th style="padding: 1rem; border-bottom: 1px solid var(--border-color);">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="fun-table-body">
                                <!-- Dynamic rows -->
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- TAB 2: Accesorios / Material               -->
                <!-- ========================================== -->
                <div id="content-accesorios" class="inv-content" style="display: none; flex: 1; flex-direction: column; gap: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0;">Accesorios y Material Diverso</h3>
                        <button class="btn btn-primary" id="btn-new-acc"><i class="fas fa-plus"></i> Registrar Accesorio</button>
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <input type="text" id="inv-acc-search" class="form-control" placeholder="Buscar serial o modelo..." style="flex: 1;">
                        <select id="inv-acc-filter" class="form-control" style="width: auto;">
                            <option value="ALL">Todas las Categorías</option>
                            <option value="Altimetro">Altimetro</option>
                            <option value="Camara 360">Camara 360</option>
                            <option value="Camara Go-Pro">Camara Go-Pro</option>
                            <option value="Casco">Casco</option>
                            <option value="Gafas">Gafas</option>
                            <option value="Suits">Suits</option>
                        </select>
                    </div>
                    <!-- Lista en formato Grid -->
                    <div id="inv-acc-list" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; overflow-y: auto; padding: 0.5rem 0;">
                        <!-- Injected dynamically -->
                    </div>
                </div>

            
            <!-- ============================================================== -->
            <!-- Modal for New Fun Jumper Equipment                             -->
            <!-- ============================================================== -->
            <div id="modal-fun" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center;">
                <div class="modal-content card" style="width: 700px; max-width: 95%; max-height: 90vh; overflow-y: auto; position: relative;">
                    <h3 id="modal-fun-title" style="margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-parachute-box" style="color: var(--brand-success);"></i> Nuevo Equipo Fun Jumper</h3>
                    
                    <div class="form-group">
                        <label>ID / Nombre del Equipo</label>
                        <input type="text" id="fun-id" class="form-control" placeholder="Ej: R-01, Escuela 1">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
                        <!-- Contenedor -->
                        <div class="card" style="background: var(--bg-surface-hover); padding: 1rem;">
                            <h4 style="margin: 0 0 1rem 0; display: flex; justify-content: space-between; align-items: center;">
                                Contenedor
                                <label style="font-size: 0.8rem; font-weight: normal; display: flex; align-items: center; gap: 0.25rem;"><input type="checkbox" id="fun-cont-na"> N/A</label>
                            </h4>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>No. Serie / EAN</label><input type="text" id="fun-cont-ean" class="form-control"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>Fecha DOM</label><input type="date" id="fun-cont-date" class="form-control"></div>
                        </div>

                        <!-- AAD -->
                        <div class="card" style="background: var(--bg-surface-hover); padding: 1rem;">
                            <h4 style="margin: 0 0 1rem 0; display: flex; justify-content: space-between; align-items: center;">
                                AAD
                                <label style="font-size: 0.8rem; font-weight: normal; display: flex; align-items: center; gap: 0.25rem;"><input type="checkbox" id="fun-aad-na"> N/A</label>
                            </h4>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>No. Serie / EAN</label><input type="text" id="fun-aad-ean" class="form-control"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>Fecha DOM</label><input type="date" id="fun-aad-date" class="form-control"></div>
                        </div>

                        <!-- Principal -->
                        <div class="card" style="background: var(--bg-surface-hover); padding: 1rem;">
                            <h4 style="margin: 0 0 1rem 0; display: flex; justify-content: space-between; align-items: center;">
                                Cúpula Principal
                                <label style="font-size: 0.8rem; font-weight: normal; display: flex; align-items: center; gap: 0.25rem;"><input type="checkbox" id="fun-prin-na"> N/A</label>
                            </h4>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>No. Serie / EAN</label><input type="text" id="fun-prin-ean" class="form-control"></div>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>Fecha DOM</label><input type="date" id="fun-prin-date" class="form-control"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>No. Saltos</label><input type="number" id="fun-prin-saltos" class="form-control" value="0" min="0"></div>
                        </div>

                        <!-- Reserva -->
                        <div class="card" style="background: var(--bg-surface-hover); padding: 1rem;">
                            <h4 style="margin: 0 0 1rem 0; display: flex; justify-content: space-between; align-items: center;">
                                Cúpula Reserva
                                <label style="font-size: 0.8rem; font-weight: normal; display: flex; align-items: center; gap: 0.25rem;"><input type="checkbox" id="fun-res-na"> N/A</label>
                            </h4>
                            <div class="form-group" style="margin-bottom: 0.5rem;"><label>No. Serie / EAN</label><input type="text" id="fun-res-ean" class="form-control"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label>Fecha Venc.</label><input type="date" id="fun-res-date" class="form-control"></div>
                        </div>
                    </div>
                    
                    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color);">
                        <button class="btn" id="btn-cancel-fun" style="background: var(--bg-surface-hover); color: var(--text-primary);">Cancelar</button>
                        <button class="btn btn-primary" id="btn-save-fun"><i class="fas fa-save"></i> Guardar Equipo</button>
                    </div>
                </div>
            </div>

</div>

            <!-- ============================================================== -->
            <!-- Modal for New Tandem Equipment                                 -->
            <!-- ============================================================== -->
            <div id="modal-tandem" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 700px; max-width: 95%; max-height: 90vh; overflow-y: auto; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="close-tandem-modal" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-parachute-box" style="color: var(--brand-success);"></i> Ensamblar Equipo Tándem</h3>
                    
                    <div class="form-group">
                        <label>Identificador del Equipo (Ej. T-01)</label>
                        <input type="text" id="tandem-id" class="form-control" placeholder="Identificador principal del ensamble">
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-top: 1rem;">
                        <!-- Part Template Generator -->
                        ${['Contenedor', 'AAD', 'Cúpula Principal', 'Reserva', 'Arnés'].map(part => `
                            <div style="background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color);">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                                    <h4 style="margin: 0; color: var(--brand-action);">${part}</h4>
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; font-size: 0.85rem;">
                                        <input type="checkbox" class="tandem-part-na" data-part="${part}" style="accent-color: var(--brand-action);"> N/A
                                    </label>
                                </div>
                                <div class="tandem-part-fields" id="fields-${part.replace(/\s+/g, '')}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                    <div class="form-group" style="margin: 0;">
                                        <label>Serial / EAN</label>
                                        <input type="text" class="form-control tandem-serial" data-part="${part}" placeholder="Serial">
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label>Fecha de Ingreso</label>
                                        <input type="date" class="form-control tandem-date" data-part="${part}">
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label>Vida Útil (Saltos)</label>
                                        <input type="number" class="form-control tandem-limit-jumps" data-part="${part}" placeholder="Saltos">
                                    </div>
                                    <div class="form-group" style="margin: 0;">
                                        <label>Vida Útil (Meses)</label>
                                        <input type="number" class="form-control tandem-limit-months" data-part="${part}" placeholder="Meses">
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-outline" id="btn-cancel-tandem">Cancelar</button>
                        <button class="btn btn-primary" id="btn-save-tandem"><i class="fas fa-save"></i> Guardar Ensamble</button>
                    </div>
                </div>
            </div>

            <!-- ============================================================== -->
            <!-- Modal for New Accessory                                        -->
            <!-- ============================================================== -->
            <div id="modal-acc" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 450px; max-width: 90%; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="close-acc-modal" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-tools" style="color: var(--brand-success);"></i> Registrar Accesorio</h3>
                    
                    <div class="form-group">
                        <label>Categoría</label>
                        <select id="acc-cat" class="form-control">
                            <option value="Altimetro">Altimetro</option>
                            <option value="Camara 360">Camara 360</option>
                            <option value="Camara Go-Pro">Camara Go-Pro</option>
                            <option value="Casco">Casco</option>
                            <option value="Gafas">Gafas</option>
                            <option value="Suits">Suits</option>
                        </select>
                    </div>

                    <div style="display: flex; gap: 1rem;">
                        <div class="form-group" style="flex: 1;">
                            <label>Código / Serial</label>
                            <input type="text" id="acc-serial" class="form-control" placeholder="Ej. A-01">
                        </div>
                        <div class="form-group" style="flex: 1;">
                            <label>Límite (Saltos)</label>
                            <input type="number" id="acc-limit" class="form-control" min="0" placeholder="Opcional">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label>Marca / Modelo</label>
                        <input type="text" id="acc-model" class="form-control" placeholder="Ej. Alti-2">
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 1rem; margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-outline" id="btn-cancel-acc">Cancelar</button>
                        <button class="btn btn-primary" id="btn-save-acc"><i class="fas fa-save"></i> Guardar Accesorio</button>
                    </div>
                </div>
            </div>
        `;
    },
    
    init: () => {
        function escapeHTML(str) {
            if (str == null) return '';
            if (typeof str !== 'string') str = String(str);
            return str.replace(/[&<>"']/g, function(m) {
                return {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    '"': '&quot;',
                    "'": '&#039;'
                }[m];
            });
        }
        window.AppData = window.AppData || {};
        window.AppData.inventory = window.AppData.inventory || [];
        window.AppData.tandemRigs = window.AppData.tandemRigs || [];

        // Tab Navigation
        const tabs = document.querySelectorAll('#inv-tabs .btn');
        const contents = document.querySelectorAll('.inv-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                tabs.forEach(t => {
                    t.classList.remove('btn-primary');
                    t.style.background = 'var(--bg-surface-hover)';
                    t.style.color = 'var(--text-primary)';
                });
                const clicked = e.currentTarget;
                clicked.classList.add('btn-primary');
                clicked.style.background = '';
                clicked.style.color = '';

                contents.forEach(c => c.style.display = 'none');
                document.getElementById('content-' + clicked.getAttribute('data-target')).style.display = 'flex';
                
                renderAccesorios();
        renderFunTable();
                renderTandemsTable(); renderTandemsList();
            });
        });

        // -----------------------------------------------------------
        // TANDEM LOGIC
        // -----------------------------------------------------------
        const tandemList = document.getElementById('inv-tandem-list');
        const modalTandem = document.getElementById('modal-tandem');
        const contentTandem = modalTandem.querySelector('.modal-content');

        function openTandemModal() {
            document.getElementById('tandem-id').value = '';
            document.querySelectorAll('.tandem-part-na').forEach(chk => {
                chk.checked = false;
                const partId = chk.getAttribute('data-part').replace(/\s+/g, '');
                document.getElementById('fields-' + partId).style.opacity = '1';
                document.getElementById('fields-' + partId).style.pointerEvents = 'auto';
            });
            document.querySelectorAll('.tandem-serial').forEach(i => i.value = '');
            document.querySelectorAll('.tandem-date').forEach(i => i.value = '');
            document.querySelectorAll('.tandem-limit-jumps').forEach(i => i.value = '');
            document.querySelectorAll('.tandem-limit-months').forEach(i => i.value = '');

            modalTandem.style.display = 'flex';
            void modalTandem.offsetWidth;
            modalTandem.style.opacity = '1';
            contentTandem.style.transform = 'translateY(0)';
        }

        function closeTandemModal() {
            modalTandem.style.opacity = '0';
            contentTandem.style.transform = 'translateY(-20px)';
            setTimeout(() => { modalTandem.style.display = 'none'; }, 300);
        }

        document.getElementById('btn-new-tandem').addEventListener('click', openTandemModal);
        document.getElementById('close-tandem-modal').addEventListener('click', closeTandemModal);
        document.getElementById('btn-cancel-tandem').addEventListener('click', closeTandemModal);

        // N/A toggle logic
        document.querySelectorAll('.tandem-part-na').forEach(chk => {
            chk.addEventListener('change', (e) => {
                const partId = e.target.getAttribute('data-part').replace(/\s+/g, '');
                const fields = document.getElementById('fields-' + partId);
                if (e.target.checked) {
                    fields.style.opacity = '0.3';
                    fields.style.pointerEvents = 'none';
                } else {
                    fields.style.opacity = '1';
                    fields.style.pointerEvents = 'auto';
                }
            });
        });

        document.getElementById('btn-save-tandem').addEventListener('click', () => {
            const rigId = document.getElementById('tandem-id').value.trim();
            if (!rigId) return alert('Debes proporcionar un Identificador (Ej. T-01).');
            if (window.AppData.tandemRigs.find(r => r.id === rigId)) return alert('Ya existe un equipo con ese Identificador.');

            const partsData = {};
            let hasAtLeastOnePart = false;

            ['Contenedor', 'AAD', 'Cúpula Principal', 'Reserva', 'Arnés'].forEach(part => {
                const isNA = document.querySelector(`.tandem-part-na[data-part="${part}"]`).checked;
                if (!isNA) {
                    const serial = document.querySelector(`.tandem-serial[data-part="${part}"]`).value.trim();
                    const date = document.querySelector(`.tandem-date[data-part="${part}"]`).value;
                    const jumps = parseInt(document.querySelector(`.tandem-limit-jumps[data-part="${part}"]`).value);
                    const months = parseInt(document.querySelector(`.tandem-limit-months[data-part="${part}"]`).value);

                    partsData[part] = {
                        serial: serial || 'S/N',
                        date: date || null,
                        limitJumps: isNaN(jumps) ? null : jumps,
                        limitMonths: isNaN(months) ? null : months,
                        currentJumps: 0
                    };
                    hasAtLeastOnePart = true;
                } else {
                    partsData[part] = null;
                }
            });

            if (!hasAtLeastOnePart) return alert('Debes configurar al menos una parte del equipo.');

            window.AppData.tandemRigs.push({
                id: rigId,
                parts: partsData,
                totalJumps: 0
            });

            if(window.saveAppData) window.saveAppData();
            closeTandemModal();
            renderTandemsTable(); renderTandemsList();
        });

        function calculateHealth(part) {
            if (!part) return { status: 'success', reason: 'ok' };
            let percentJumps = 0;
            let percentTime = 0;
            let diffMonths = 0;

            if (part.limitJumps) percentJumps = (part.currentJumps / part.limitJumps) * 100;
            
            if (part.limitMonths && part.date) {
                const start = new Date(part.date);
                const now = new Date();
                diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                percentTime = (diffMonths / part.limitMonths) * 100;
            }

            const maxPercent = Math.max(percentJumps, percentTime);
            let status = 'success';
            if (maxPercent >= 100) status = 'danger';
            else if (maxPercent >= 90) status = 'warning';
            
            let reason = 'ok';
            let val = '';
            if (status !== 'success') {
                if (percentTime > percentJumps) {
                    reason = 'time';
                    val = `${diffMonths} meses (límite ${part.limitMonths})`;
                } else {
                    reason = 'jumps';
                    val = `${part.currentJumps} saltos (límite ${part.limitJumps})`;
                }
            } else {
                reason = 'ok';
                val = `${part.currentJumps} saltos`;
            }

            return { status, reason, val };
        }

        function renderTandemsTable() {
            const tandemTableBody = document.getElementById('tandem-table-body');
            if(!tandemTableBody) return;
            tandemTableBody.innerHTML = '';
            const rigs = window.AppData.tandemRigs || [];

            if(rigs.length === 0) {
                tandemTableBody.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--text-secondary); padding: 2rem;">No hay equipos tǭndem registrados.</td></tr>';
                return;
            }

            rigs.forEach((rig, idx) => {
                const renderPart = (partName) => {
                    const part = rig.parts[partName];
                    if (!part) {
                        return '<span style="color: var(--text-secondary); font-size: 0.85rem;">N/A</span>';
                    }
                    
                    const healthData = calculateHealth(part);
                    let alertHtml = '';
                    if (healthData.status === 'danger' || healthData.status === 'warning') {
                        const color = healthData.status === 'danger' ? 'var(--brand-danger)' : 'var(--brand-warning)';
                        alertHtml = `<div style="color: ${color}; font-size: 0.75rem; font-weight: bold; margin-top:4px; padding: 2px 4px; border: 1px solid ${color}; border-radius: 4px; display: inline-block;">
                            <i class="fas fa-exclamation-triangle"></i> ${healthData.val}
                        </div>`;
                    } else {
                        alertHtml = `<div style="color: var(--brand-success); font-size: 0.75rem; margin-top:2px;">${healthData.val}</div>`;
                    }
                    
                    return `
                        <div style="font-size: 0.85rem;">
                            <strong>EAN:</strong> ${escapeHTML(part.serial || "-")}<br>
                            <span style="color: var(--text-secondary);">${part.date ? part.date : '-'}</span>
                            ${alertHtml}
                        </div>
                    `;
                };

                tandemTableBody.innerHTML += `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="font-weight: bold; padding: 1rem;">${escapeHTML(rig.id)}</td>
                        <td style="padding: 1rem;">${renderPart('Contenedor')}</td>
                        <td style="padding: 1rem;">${renderPart('AAD')}</td>
                        <td style="padding: 1rem;">${renderPart('Cúpula Principal')}</td>
                        <td style="padding: 1rem;">${renderPart('Reserva')}</td>
                        <td style="padding: 1rem;">${renderPart('Arnès')}</td>
                        <td style="padding: 1rem;">
                            <button class="btn btn-outline btn-delete-tandem" data-idx="${idx}" style="padding: 0.25rem 0.5rem; font-size: 0.85rem; color: var(--brand-danger); border-color: var(--brand-danger);"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });

            document.querySelectorAll('.btn-delete-tandem').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-idx');
                    if(confirm('¿Seguro que deseas eliminar este equipo Tándem?')) {
                        window.AppData.tandemRigs.splice(idx, 1);
                        if(window.saveAppData) window.saveAppData();
                        renderTandemsTable(); renderTandemsList();
                    }
                });
            });
        }

        function calculateHealth(part) {
            if (!part) return null;
            let percentJumps = 0;
            let percentTime = 0;

            if (part.limitJumps) percentJumps = (part.currentJumps / part.limitJumps) * 100;
            
            if (part.limitMonths && part.date) {
                const start = new Date(part.date);
                const now = new Date();
                const diffMonths = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
                percentTime = (diffMonths / part.limitMonths) * 100;
            }

            const maxPercent = Math.max(percentJumps, percentTime);
            if (maxPercent >= 100) return 'danger';
            if (maxPercent >= 90) return 'warning';
            return 'success';
        }

        function renderTandemsList() {
            if (!tandemList) return;
            tandemList.innerHTML = '';
            const rigs = window.AppData.tandemRigs || [];

            if(rigs.length === 0) {
                tandemList.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 2rem;">No hay equipos tándem registrados.</div>';
                return;
            }

            rigs.forEach(rig => {
                let overallStatus = 'success';
                const partsHtml = ['Contenedor', 'AAD', 'Cúpula Principal', 'Reserva', 'Arnés'].map(partName => {
                    const part = rig.parts[partName];
                    if (!part) {
                        return `<div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); padding: 0.2rem 0;"><span>${partName}:</span> <span style="color: #64748b;">N/A</span></div>`;
                    }
                    
                    const healthData = calculateHealth(part);
                    let alertHtml = '';
                    if (healthData.status === 'danger' || healthData.status === 'warning') {
                        const color = healthData.status === 'danger' ? 'var(--brand-danger)' : 'var(--brand-warning)';
                        alertHtml = `<div style="color: ${color}; font-size: 0.75rem; font-weight: bold; margin-top:4px; padding: 2px 4px; border: 1px solid ${color}; border-radius: 4px; display: inline-block;">
                            <i class="fas fa-exclamation-triangle"></i> ${healthData.val}
                        </div>`;
                    } else {
                        alertHtml = `<div style="color: var(--brand-success); font-size: 0.75rem; margin-top:2px;">${healthData.val}</div>`;
                    }
                    
                    return `
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; padding: 0.3rem 0; border-bottom: 1px dashed var(--border-color);">
                            <span>${partName} (${escapeHTML(part.serial)})</span>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <span style="color: var(--text-secondary);">${part.currentJumps} Saltos</span>
                                <div style="width: 10px; height: 10px; border-radius: 50%; background: ${colorMap[health]};" title="Estado"></div>
                            </div>
                        </div>
                    `;
                }).join('');

                const colorMapOverall = {
                    'success': { c: 'var(--brand-success)', t: 'Operativo', i: 'fa-check-circle' },
                    'warning': { c: 'var(--brand-warning)', t: 'Revisión Sugerida', i: 'fa-exclamation-circle' },
                    'danger': { c: 'var(--brand-danger)', t: 'Mantenimiento Req.', i: 'fa-exclamation-triangle' }
                };
                const st = colorMapOverall[overallStatus];

                const card = document.createElement('div');
                card.className = 'card';
                card.style.background = 'var(--bg-main)';
                card.style.border = `1px solid ${st.c}40`;
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 40px; height: 40px; border-radius: 8px; background: ${st.c}20; color: ${st.c}; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                <i class="fas fa-parachute-box"></i>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.2rem;">Equipo ${escapeHTML(rig.id)}</h4>
                                <span style="font-size: 0.8rem; color: var(--text-secondary);">Saltos Totales: ${rig.totalJumps || 0}</span>
                            </div>
                        </div>
                        <span style="font-size: 0.75rem; background: ${st.c}20; color: ${st.c}; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem;"><i class="fas ${st.i}"></i> ${st.t}</span>
                    </div>
                    <div style="background: var(--bg-surface-hover); padding: 0.5rem; border-radius: 8px;">
                        ${partsHtml}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                        <button class="btn btn-add-tj" data-id="${rig.id}" style="background: var(--bg-surface-hover); color: var(--text-primary); font-size: 0.85rem; padding: 0.4rem 0.75rem;"><i class="fas fa-plus" style="color: var(--brand-action);"></i> Añadir Salto</button>
                        <button class="btn btn-del-tandem" data-id="${rig.id}" style="background: transparent; color: var(--brand-danger); border: none; font-size: 1rem; padding: 0.25rem; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                tandemList.appendChild(card);
            });

            document.querySelectorAll('.btn-add-tj').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const rig = window.AppData.tandemRigs.find(r => r.id === id);
                    if(rig) {
                        rig.totalJumps = (rig.totalJumps || 0) + 1;
                        Object.keys(rig.parts).forEach(p => {
                            if (rig.parts[p]) rig.parts[p].currentJumps++;
                        });
                        if(window.saveAppData) window.saveAppData();
                        renderTandemsTable(); renderTandemsList();
                    }
                });
            });

            document.querySelectorAll('.btn-del-tandem').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    if(confirm(`¿Deseas eliminar el equipo ${id}?`)) {
                        window.AppData.tandemRigs = window.AppData.tandemRigs.filter(r => r.id !== id);
                        if(window.saveAppData) window.saveAppData();
                        renderTandemsTable(); renderTandemsList();
                    }
                });
            });
        }

        // -----------------------------------------------------------
        // ACCESORIOS LOGIC
        // -----------------------------------------------------------
        const accList = document.getElementById('inv-acc-list');
        const filterSelect = document.getElementById('inv-acc-filter');
        const searchInput = document.getElementById('inv-acc-search');
        
        const modalAcc = document.getElementById('modal-acc');
        const contentAcc = modalAcc.querySelector('.modal-content');
        
        function getCatIcon(cat) {
            switch(cat) {
                case 'Altimetro': return 'fa-tachometer-alt';
                case 'Camara 360': return 'fa-video';
                case 'Camara Go-Pro': return 'fa-camera-retro';
                case 'Casco': return 'fa-hard-hat';
                case 'Gafas': return 'fa-glasses';
                case 'Suits': return 'fa-tshirt';
                default: return 'fa-box';
            }
        }

        function renderAccesorios() {
            if (!accList) return;
            accList.innerHTML = '';
            
            const filter = filterSelect.value;
            const term = searchInput.value.toLowerCase();
            
            const items = window.AppData.inventory.filter(i => {
                // Ignore old Tandems just in case they are still in DB, they shouldn't show in Accessories
                if (i.category === 'Tandem') return false; 
                if (filter !== 'ALL' && i.category !== filter) return false;
                if (term && !i.serial.toLowerCase().includes(term) && !i.model.toLowerCase().includes(term)) return false;
                return true;
            });

            if(items.length === 0) {
                accList.innerHTML = '<div style="grid-column: 1 / -1; text-align: center; color: var(--text-secondary); padding: 2rem;">No hay accesorios registrados.</div>';
                return;
            }

            items.forEach((item) => {
                let statusColor = 'var(--brand-success)';
                let statusText = 'Operativo';
                let icon = 'fa-check-circle';
                let percentage = 0;

                if (item.limit) {
                    percentage = (item.jumps / item.limit) * 100;
                    if(item.jumps >= item.limit) {
                        statusColor = 'var(--brand-danger)';
                        statusText = 'Mantenimiento Requerido';
                        icon = 'fa-exclamation-triangle';
                    } else if (item.jumps >= item.limit * 0.9) {
                        statusColor = 'var(--brand-warning)';
                        statusText = 'Próximo a Mantenimiento';
                        icon = 'fa-exclamation-circle';
                    }
                }
                
                percentage = Math.min(100, percentage);

                const card = document.createElement('div');
                card.className = 'card';
                card.style.background = 'var(--bg-main)';
                card.style.border = '1px solid var(--border-color)';
                card.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 40px; height: 40px; border-radius: 8px; background: var(--bg-surface-hover); color: var(--brand-blue); display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
                                <i class="fas ${getCatIcon(item.category)}"></i>
                            </div>
                            <div>
                                <h4 style="margin: 0; font-size: 1.1rem;">${escapeHTML(item.serial)}</h4>
                                <span style="font-size: 0.8rem; color: var(--text-secondary);">${escapeHTML(item.model)}</span>
                            </div>
                        </div>
                        <div style="text-align: right;">
                            <span style="font-size: 0.75rem; background: ${statusColor}20; color: ${statusColor}; padding: 0.2rem 0.6rem; border-radius: 12px; font-weight: 600; display: inline-flex; align-items: center; gap: 0.25rem;"><i class="fas ${icon}"></i> ${statusText}</span>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.25rem;">
                            <span>Saltos/Usos:</span>
                            <strong>${item.jumps || 0} ${item.limit ? `/ ${item.limit}` : ''}</strong>
                        </div>
                        ${item.limit ? `
                        <div style="width: 100%; height: 6px; background: var(--border-color); border-radius: 3px; overflow: hidden;">
                            <div style="width: ${percentage}%; height: 100%; background: ${statusColor}; border-radius: 3px;"></div>
                        </div>` : ''}
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                        <button class="btn btn-add-aj" data-serial="${item.serial}" style="background: var(--bg-surface-hover); color: var(--text-primary); font-size: 0.85rem; padding: 0.4rem 0.75rem;"><i class="fas fa-plus" style="color: var(--brand-action);"></i> Añadir Uso</button>
                        <button class="btn btn-del-acc" data-serial="${item.serial}" style="background: transparent; color: var(--brand-danger); border: none; font-size: 1rem; padding: 0.25rem; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </div>
                `;
                accList.appendChild(card);
            });

            document.querySelectorAll('.btn-add-aj').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const serial = e.currentTarget.getAttribute('data-serial');
                    const it = window.AppData.inventory.find(i => i.serial === serial);
                    if(it) {
                        it.jumps = (it.jumps || 0) + 1;
                        if(window.saveAppData) window.saveAppData();
                        renderAccesorios();
                    }
                });
            });

            document.querySelectorAll('.btn-del-acc').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const serial = e.currentTarget.getAttribute('data-serial');
                    if(confirm('¿Eliminar este accesorio?')) {
                        window.AppData.inventory = window.AppData.inventory.filter(i => i.serial !== serial);
                        if(window.saveAppData) window.saveAppData();
                        renderAccesorios();
                    }
                });
            });
        }

        filterSelect.addEventListener('change', renderAccesorios);
        searchInput.addEventListener('input', renderAccesorios);

        function openAccModal() {
            modalAcc.style.display = 'flex';
            void modalAcc.offsetWidth;
            modalAcc.style.opacity = '1';
            contentAcc.style.transform = 'translateY(0)';
        }
        function closeAccModal() {
            modalAcc.style.opacity = '0';
            contentAcc.style.transform = 'translateY(-20px)';
            setTimeout(() => { modalAcc.style.display = 'none'; }, 300);
            
            document.getElementById('acc-serial').value = '';
            document.getElementById('acc-model').value = '';
            document.getElementById('acc-limit').value = '';
        }

        document.getElementById('btn-new-acc').addEventListener('click', openAccModal);
        document.getElementById('close-acc-modal').addEventListener('click', closeAccModal);
        document.getElementById('btn-cancel-acc').addEventListener('click', closeAccModal);

        document.getElementById('btn-save-acc').addEventListener('click', () => {
            const cat = document.getElementById('acc-cat').value;
            const serial = document.getElementById('acc-serial').value.trim();
            const model = document.getElementById('acc-model').value.trim();
            const limit = parseInt(document.getElementById('acc-limit').value);
            
            if(!serial || !model) return alert('Por favor, ingresa el serial y el modelo.');
            if(window.AppData.inventory.find(i => i.serial === serial)) return alert('Ese código/serial ya existe.');

            window.AppData.inventory.push({
                category: cat,
                serial: serial,
                model: model,
                limit: isNaN(limit) ? null : limit,
                jumps: 0
            });

            if(window.saveAppData) window.saveAppData();
            closeAccModal();
            renderAccesorios();
        });

        
        window.AppData.funRigs = window.AppData.funRigs || [];
        
        // --- FUN JUMPER LOGIC ---
        const tbodyFun = document.getElementById('fun-table-body');
        const modalFun = document.getElementById('modal-fun');
        let editingFunIndex = -1;

        function renderFunTable() {
            if(!tbodyFun) return;
            tbodyFun.innerHTML = '';
            const rigs = window.AppData.funRigs || [];
            
            if (rigs.length === 0) {
                tbodyFun.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 2rem; color: var(--text-secondary);">No hay equipos Fun Jumper registrados.</td></tr>';
                return;
            }
            
            rigs.forEach((r, idx) => {
                const renderPart = (p, limitJumps) => {
                    if (p.na) return '<span style="color: var(--text-secondary); font-size: 0.85rem;">N/A</span>';
                    
                    let alertHtml = '';
                    if (limitJumps && p.saltos >= 1800) {
                        const color = p.saltos >= 2000 ? 'var(--brand-danger)' : 'var(--brand-warning)';
                        alertHtml = `<div style="color: ${color}; font-size: 0.75rem; font-weight: bold; margin-top:2px;"><i class="fas fa-exclamation-triangle"></i> ${p.saltos} saltos</div>`;
                    }
                    
                    return `
                        <div style="font-size: 0.85rem;">
                            <strong>EAN:</strong> ${escapeHTML(p.ean || "-")}<br>
                            <span style="color: var(--text-secondary);">${p.date || '-'}</span>
                            ${alertHtml}
                        </div>
                    `;
                };

                tbodyFun.innerHTML += `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="font-weight: bold; padding: 1rem;">${escapeHTML(r.id)}</td>
                        <td style="padding: 1rem;">${renderPart(r.contenedor, false)}</td>
                        <td style="padding: 1rem;">${renderPart(r.aad, false)}</td>
                        <td style="padding: 1rem;">${renderPart(r.principal, true)}</td>
                        <td style="padding: 1rem;">${renderPart(r.reserva, false)}</td>
                        <td style="padding: 1rem;">
                            <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.85rem; margin-right: 0.25rem;" onclick="window.editFun(${idx})"><i class="fas fa-edit"></i></button>
                            <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.85rem; color: var(--brand-danger); border-color: var(--brand-danger);" onclick="window.deleteFun(${idx})"><i class="fas fa-trash"></i></button>
                        </td>
                    </tr>
                `;
            });
        }

        window.editFun = (idx) => {
            editingFunIndex = idx;
            const r = window.AppData.funRigs[idx];
            document.getElementById('modal-fun-title').textContent = 'Editar Equipo Fun Jumper';
            document.getElementById('fun-id').value = r.id;
            
            ['cont', 'aad', 'prin', 'res'].forEach(p => {
                const data = r[p === 'cont' ? 'contenedor' : p === 'prin' ? 'principal' : p === 'res' ? 'reserva' : 'aad'];
                document.getElementById(`fun-${p}-na`).checked = data.na;
                document.getElementById(`fun-${p}-ean`).value = data.ean || '';
                document.getElementById(`fun-${p}-date`).value = data.date || '';
                
                document.getElementById(`fun-${p}-ean`).disabled = data.na;
                document.getElementById(`fun-${p}-date`).disabled = data.na;
                if(p === 'prin') {
                    document.getElementById('fun-prin-saltos').value = data.saltos || 0;
                    document.getElementById('fun-prin-saltos').disabled = data.na;
                }
            });
            
            modalFun.style.display = 'flex';
        };

        window.deleteFun = (idx) => {
            if (confirm('¿Seguro que deseas eliminar este equipo Fun Jumper?')) {
                window.AppData.funRigs.splice(idx, 1);
                if (window.saveAppData) window.saveAppData();
                renderFunTable();
            }
        };

        const btnAddFun = document.getElementById('btn-add-fun');
        if(btnAddFun) {
            btnAddFun.addEventListener('click', () => {
                editingFunIndex = -1;
                document.getElementById('modal-fun-title').textContent = 'Nuevo Equipo Fun Jumper';
                document.getElementById('fun-id').value = '';
                
                ['cont', 'aad', 'prin', 'res'].forEach(p => {
                    document.getElementById(`fun-${p}-na`).checked = false;
                    document.getElementById(`fun-${p}-ean`).value = '';
                    document.getElementById(`fun-${p}-date`).value = '';
                    document.getElementById(`fun-${p}-ean`).disabled = false;
                    document.getElementById(`fun-${p}-date`).disabled = false;
                    if(p === 'prin') {
                        document.getElementById('fun-prin-saltos').value = '';
                        document.getElementById('fun-prin-saltos').disabled = false;
                    }
                });
                
                modalFun.style.display = 'flex';
            });
        }

        const btnCancelFun = document.getElementById('btn-cancel-fun');
        if(btnCancelFun) {
            btnCancelFun.addEventListener('click', () => {
                modalFun.style.display = 'none';
            });
        }

        // NA Toggle logic
        ['cont', 'aad', 'prin', 'res'].forEach(p => {
            const chk = document.getElementById(`fun-${p}-na`);
            if(chk) {
                chk.addEventListener('change', (e) => {
                    const isNa = e.target.checked;
                    document.getElementById(`fun-${p}-ean`).disabled = isNa;
                    document.getElementById(`fun-${p}-date`).disabled = isNa;
                    if(p === 'prin') document.getElementById('fun-prin-saltos').disabled = isNa;
                });
            }
        });

        const btnSaveFun = document.getElementById('btn-save-fun');
        if(btnSaveFun) {
            btnSaveFun.addEventListener('click', () => {
                const id = document.getElementById('fun-id').value.trim();
                if (!id) return alert('El identificador del equipo es obligatorio');
                
                const getPart = (p) => {
                    const na = document.getElementById(`fun-${p}-na`).checked;
                    const ean = document.getElementById(`fun-${p}-ean`).value.trim();
                    const date = document.getElementById(`fun-${p}-date`).value;
                    const res = { na, ean: na ? '' : ean, date: na ? '' : date };
                    if (p === 'prin') {
                        res.saltos = na ? 0 : (parseInt(document.getElementById('fun-prin-saltos').value, 10) || 0);
                    }
                    return res;
                };

                const rig = {
                    id: id,
                    contenedor: getPart('cont'),
                    aad: getPart('aad'),
                    principal: getPart('prin'),
                    reserva: getPart('res')
                };

                if (editingFunIndex > -1) {
                    window.AppData.funRigs[editingFunIndex] = rig;
                } else {
                    window.AppData.funRigs.push(rig);
                }

                if (window.saveAppData) window.saveAppData();
                modalFun.style.display = 'none';
                renderFunTable();
            });
        }

        // --- END FUN JUMPER LOGIC ---

        // Init
        renderTandemsTable(); renderTandemsList();
        renderAccesorios();
    }
};
