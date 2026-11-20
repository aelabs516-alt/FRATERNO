window.Modules = window.Modules || {};

window.Modules.historySearch = {
    render: (container) => {
        container.innerHTML = `
            <div style="display: flex; flex-direction: column; min-height: 80vh; gap: 1.5rem;">
                <!-- Header -->
                <div class="card" style="display: flex; justify-content: space-between; align-items: center; padding: 1.5rem;">
                    <div>
                        <h2 style="margin: 0; color: var(--text-primary);"><i class="fas fa-history" style="color: var(--brand-action);"></i> Consulta Historial</h2>
                        <p style="margin: 0; color: var(--text-secondary); font-size: 0.95rem; margin-top: 0.25rem;">Directorio de clientes y su historial completo de operaciones.</p>
                    </div>
                </div>

                <!-- Search Bar -->
                <div class="card" style="padding: 1.5rem; background: var(--bg-surface-hover);">
                    <div style="display: flex; gap: 1rem;">
                        <div style="flex: 1; position: relative;">
                            <i class="fas fa-search" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-secondary);"></i>
                            <input type="text" id="global-search-input" class="form-control" placeholder="Buscar por Nombre, Apellido, Cédula, Teléfono o Correo..." style="padding-left: 2.5rem; height: 50px; font-size: 1.1rem; background: var(--bg-main);">
                        </div>
                    </div>
                </div>

                <!-- Results Table -->
                <div class="card" style="flex: 1; overflow: hidden; display: flex; flex-direction: column; padding: 0;">
                    <div style="padding: 1.5rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0;">Directorio de Clientes</h3>
                        <span id="results-count" style="background: var(--brand-action); color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: bold;">0 Encontrados</span>
                    </div>
                    
                    <div style="flex: 1; overflow-y: auto;">
                        <table class="data-table" style="width: 100%; border-collapse: collapse; text-align: left;">
                            <thead style="position: sticky; top: 0; z-index: 10;">
                                <tr style="background: var(--bg-surface); border-bottom: 2px solid var(--border-color);">
                                    <th style="padding: 1rem;">Nombres</th>
                                    <th style="padding: 1rem;">Apellidos</th>
                                    <th style="padding: 1rem;">Documento</th>
                                    <th style="padding: 1rem;">Último Salto</th>
                                    <th style="padding: 1rem; text-align: center;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="global-search-results">
                                <!-- Results populated dynamically -->
                            </tbody>
                        </table>
                        <div id="global-search-empty" style="padding: 4rem; text-align: center; color: var(--text-secondary); display: none;">
                            <i class="fas fa-users-slash" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                            <h3 style="margin: 0; color: var(--text-primary);">No se encontraron clientes</h3>
                            <p>Intenta buscar con otros términos.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Details Modal -->
            <div id="modal-pax-details" class="modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); z-index: 1000; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s ease;">
                <div class="modal-content card" style="width: 800px; max-width: 95%; max-height: 90vh; overflow-y: auto; position: relative; transform: translateY(-20px); transition: transform 0.3s ease;">
                    <button id="btn-close-details" class="btn" style="position: absolute; top: 1rem; right: 1rem; background: transparent; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                    <h3 style="margin-top: 0; color: var(--brand-blue); border-bottom: 1px solid var(--border-color); padding-bottom: 1rem;"><i class="fas fa-address-card"></i> Historial Completo del Pasajero</h3>
                    
                    <div id="details-body" style="margin-top: 1.5rem;">
                        <!-- Injected via JS -->
                    </div>

                    <div style="margin-top: 2rem; display: flex; gap: 1rem; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button class="btn btn-primary" id="btn-download-pdf"><i class="fas fa-file-pdf"></i> Descargar PDF</button>
                        <button class="btn btn-outline" id="btn-close-details-2">Cerrar</button>
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
        const searchInput = document.getElementById('global-search-input');
        const resultsTbody = document.getElementById('global-search-results');
        const emptyState = document.getElementById('global-search-empty');
        const countSpan = document.getElementById('results-count');

        const modalDetails = document.getElementById('modal-pax-details');
        const modalContent = modalDetails.querySelector('.modal-content');
        const detailsBody = document.getElementById('details-body');

        // Format Currency Helper
        const formatCurrency = (num) => '$' + (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

        function splitName(fullName) {
            if (!fullName) return { first: 'S/D', last: '' };
            const parts = fullName.trim().split(' ');
            return {
                first: parts[0] || 'S/D',
                last: parts.slice(1).join(' ') || ''
            };
        }

        function renderResults() {
            window.AppData = window.AppData || {};
            const passengers = window.AppData.passengers || [];
            
            const term = searchInput.value.toLowerCase().trim();
            
            // Group by Document (fallback to Name)
            const paxMap = new Map();
            
            passengers.forEach(p => {
                const key = p.doc ? p.doc.trim() : (p.name ? p.name.trim() : p.id);
                if (!paxMap.has(key)) {
                    paxMap.set(key, {
                        doc: p.doc || 'S/D',
                        name: p.name || 'Sin Nombre',
                        phone: p.phone || 'S/D',
                        email: p.email || 'S/D',
                        jumps: [],
                        signature: null,
                        signatureMinor: null,
                        selfie: null,
                        signedAt: null,
                        paymentSupport: null
                    });
                }
                const client = paxMap.get(key);
                client.jumps.push(p);
                // Conservar los datos más recientes diligenciados para Ficha Informativa y Exoneración
                ['docType', 'date', 'type', 'cams', 'dob', 'weight', 'country', 'state', 'city', 'address', 'occupation', 'occupationOther', 'favActivities', 'contactMethod', 'advisor', 'medicalCondition'].forEach(field => {
                    if (p[field] && (!client[field] || p.b2cCompleted)) {
                        client[field] = p[field];
                    }
                });
                if (p.signature) client.signature = p.signature;
                if (p.signatureMinor) client.signatureMinor = p.signatureMinor;
                if (p.selfie) client.selfie = p.selfie;
                if (p.signedAt) client.signedAt = p.signedAt;
                if (p.paymentSupport || p.soportePago) {
                    client.paymentSupport = p.paymentSupport || { dataUrl: p.soportePago };
                }
            });

            // Prepare distinct clients list
            const clients = Array.from(paxMap.values()).map(client => {
                // Find latest jump
                client.jumps.sort((a, b) => {
                    if (a.date !== b.date) return (a.date > b.date) ? -1 : 1;
                    return (a.time > b.time) ? -1 : 1;
                });
                client.latestJumpDate = client.jumps[0].date || 'S/D';
                
                // Split name
                const { first, last } = splitName(client.name);
                client.firstName = first;
                client.lastName = last;
                
                return client;
            });

            // Sort by latest jump descending
            clients.sort((a, b) => (a.latestJumpDate > b.latestJumpDate) ? -1 : 1);
            
            resultsTbody.innerHTML = '';
            let count = 0;

            clients.forEach(c => {
                // Search filter (Name, Last Name, Doc, Phone, Email)
                if (term) {
                    const searchable = `${c.firstName} ${c.lastName} ${c.doc} ${c.phone} ${c.email}`.toLowerCase();
                    if (!searchable.includes(term)) return;
                }
                
                count++;

                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.style.transition = 'background 0.2s';
                tr.onmouseover = () => tr.style.background = 'var(--bg-surface-hover)';
                tr.onmouseout = () => tr.style.background = 'transparent';

                tr.innerHTML = `
                    <td style="padding: 1rem; color: var(--text-primary); font-weight: 500;">${escapeHTML(c.firstName)}</td>
                    <td style="padding: 1rem; color: var(--text-primary); font-weight: 500;">${escapeHTML(c.lastName)}</td>
                    <td style="padding: 1rem; font-family: monospace; font-size: 1rem; font-weight: bold;">${escapeHTML(c.doc)}</td>
                    <td style="padding: 1rem; font-weight: bold; color: var(--text-secondary);">${escapeHTML(c.latestJumpDate)} <span style="font-size: 0.8rem; font-weight: normal; background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px; margin-left: 0.5rem;">${c.jumps.length} salto(s)</span></td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-primary btn-sm btn-view-pax" style="padding: 0.4rem 0.8rem; font-size: 0.85rem;"><i class="fas fa-eye"></i> Ver Historial</button>
                    </td>
                `;

                tr.querySelector('.btn-view-pax').addEventListener('click', () => {
                    openDetailsModal(c);
                });

                resultsTbody.appendChild(tr);
            });

            countSpan.textContent = `${count} Encontrados`;
            
            if (count === 0) {
                emptyState.style.display = 'block';
                resultsTbody.parentElement.style.display = 'none';
            } else {
                emptyState.style.display = 'none';
                resultsTbody.parentElement.style.display = '';
            }
        }

        function openDetailsModal(client) {
            let jumpsHtml = '';
            
            client.jumps.forEach((j, jIdx) => {
                let statusColor = 'var(--text-secondary)';
                if (j.paxStatus === 'Check-in Listo') statusColor = 'var(--brand-action)';
                if (j.paxStatus === 'Completado') statusColor = 'var(--brand-success)';
                if (j.paxStatus === 'Cancelado / Cancelled') statusColor = 'var(--brand-danger)';
                
                // Documents section
                const docBadge = j.waiverSigned 
                    ? '<span style="color: var(--brand-success);"><i class="fas fa-file-signature"></i> 4 Docs Firmados</span>' 
                    : '<span style="color: var(--brand-danger);"><i class="fas fa-times-circle"></i> Waiver Pendiente</span>';

                // Payments section
                const finSummary = window.getPaxFinancialSummary ? window.getPaxFinancialSummary(j) : {
                    totalValue: ((j.financiera?.manualPrice || 0) - (j.financiera?.discount || 0)),
                    totalPaid: (j.financiera?.totalPaid || 0),
                    pending: Math.max(0, ((j.financiera?.manualPrice || 0) - (j.financiera?.discount || 0)) - (j.financiera?.totalPaid || 0)),
                    isComplete: false
                };
                const valorReserva = finSummary.totalValue;
                const pagado = finSummary.totalPaid;

                const finStatus = finSummary.isComplete
                    ? '<span style="color: var(--brand-success); font-weight:bold;"><i class="fas fa-check-circle"></i> Pago Completo</span>'
                    : `<span style="color: var(--brand-danger); font-weight:bold;"><i class="fas fa-exclamation-triangle"></i> Pago Incompleto (Pendiente: ${formatCurrency(finSummary.pending)})</span>`;

                const hasPaymentSupport = Boolean((j.paymentSupport && j.paymentSupport.dataUrl) || j.soportePago || (client.paymentSupport && client.paymentSupport.dataUrl));
                const supportBtnHtml = hasPaymentSupport
                    ? `<button type="button" class="btn btn-primary btn-sm btn-view-jump-support" data-jidx="${jIdx}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;"><i class="fas fa-file-invoice-dollar"></i> Ver Soporte de Pago B2C</button>`
                    : `<span style="font-size: 0.8rem; color: var(--text-secondary);"><i class="fas fa-receipt"></i> Sin soporte B2C</span>`;

                jumpsHtml += `
                    <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.25rem; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 0.75rem; margin-bottom: 0.75rem;">
                            <strong style="font-size: 1.2rem; color: var(--text-primary);"><i class="fas fa-plane-departure" style="color: var(--text-secondary); margin-right: 0.5rem;"></i> ${escapeHTML(j.date)} <span style="color: var(--text-secondary); font-size: 1rem;">(${escapeHTML(j.time || '--:--')})</span></strong>
                            <span style="background: var(--bg-surface-hover); padding: 4px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: bold; color: ${statusColor};">${escapeHTML(j.paxStatus)}</span>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1rem;">
                            <div>
                                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Tipo / Cámaras</span>
                                <strong>${escapeHTML(j.type)} / ${escapeHTML(j.cams || 'Ninguna')}</strong>
                            </div>
                            <div>
                                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Instructor</span>
                                <strong>${escapeHTML(j.instructor || 'S/A')}</strong>
                            </div>
                            <div>
                                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Aeronave (Vuelo)</span>
                                <strong>${escapeHTML(j.aeronave || 'S/A')} (${escapeHTML(j.vueloNum || '--')})</strong>
                            </div>
                            <div>
                                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Documentos</span>
                                <strong>${docBadge}</strong>
                            </div>
                        </div>

                        <div style="background: rgba(0,0,0,0.02); border: 1px dashed var(--border-color); padding: 1rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                            <div>
                                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.25rem;"><i class="fas fa-wallet"></i> Resumen de Pagos</span>
                                <span style="font-size: 0.9rem;">Valor Total: <strong>${formatCurrency(valorReserva)}</strong> | Pagado: <strong>${formatCurrency(pagado)}</strong></span>
                            </div>
                            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                                ${finStatus}
                                ${supportBtnHtml}
                            </div>
                        </div>
                    </div>
                `;
            });

            // Soporte de Pago B2C Section (Req #10)
            let paymentSupportSectionHtml = '';
            if (client.paymentSupport && client.paymentSupport.dataUrl) {
                const ps = client.paymentSupport;
                const isPdfSupport = ps.dataUrl.startsWith('data:application/pdf') || (ps.fileName && ps.fileName.toLowerCase().endsWith('.pdf'));
                paymentSupportSectionHtml = `
                <div style="margin-top: 1.5rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                        <h4 style="margin: 0; color: var(--text-primary); font-size: 1.1rem;">
                            <i class="fas fa-file-invoice-dollar" style="color: var(--brand-success); margin-right: 0.5rem;"></i> Soporte de Pago Adjuntado (Portal B2C)
                        </h4>
                        <button type="button" class="btn btn-primary btn-sm" id="btn-open-full-payment-support">
                            <i class="fas fa-expand"></i> Ampliar / Descargar Comprobante
                        </button>
                    </div>
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
                        <div>
                            <div style="font-size: 0.9rem; margin-bottom: 0.25rem;"><strong>Medio de Pago:</strong> ${escapeHTML(ps.paymentMethod || 'Transferencia')}</div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);"><strong>Fecha de Pago:</strong> ${escapeHTML(ps.paymentDate || client.latestJumpDate || 'Registrado')}</div>
                        </div>
                        <div>
                            ${isPdfSupport
                                ? `<span style="color: var(--brand-action); font-weight: 700;"><i class="fas fa-file-pdf"></i> Comprobante PDF Adjunto</span>`
                                : `<img src="${ps.dataUrl}" alt="Soporte de Pago" style="height: 85px; border-radius: 6px; border: 1px solid var(--border-color); object-fit: contain; background: #fff; padding: 4px; cursor: pointer;" id="img-thumb-payment-support">`
                            }
                        </div>
                    </div>
                </div>
                `;
            }

            // All 4 Legal Acceptance Documents with Passenger Signature Embedded (Req #3)
            const docsCatalog = window.LegalDocsHelper ? window.LegalDocsHelper.getDocsCatalog('es') : [
                { key: 'bienvenida', num: 1, title: '1. Guía de Bienvenida' },
                { key: 'terminos', num: 2, title: '2. Términos y Condiciones de la Operación' },
                { key: 'ficha', num: 3, title: '3. Ficha Informativa y Autorización de Datos' },
                { key: 'exoneracion', num: 4, title: '4. Exoneración de Responsabilidad' }
            ];

            const hasSignature = Boolean(client.signature || (client.signatureMinor && (client.signatureMinor.mother || client.signatureMinor.father)));
            const sigImgSrc = client.signature || (client.signatureMinor && client.signatureMinor.mother) || '';

            const legalDocsCardsHtml = docsCatalog.map(docItem => `
                <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 10px; padding: 1rem; display: flex; flex-direction: column; justify-content: space-between; gap: 0.75rem; box-shadow: var(--shadow-sm);">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                        <div>
                            <strong style="color: var(--text-primary); font-size: 0.95rem; display: block;">${escapeHTML(docItem.title)}</strong>
                            <span style="font-size: 0.8rem; color: ${hasSignature ? 'var(--brand-success)' : 'var(--brand-warning)'}; font-weight: 600;">
                                <i class="fas ${hasSignature ? 'fa-check-circle' : 'fa-clock'}"></i> ${hasSignature ? 'Aceptado y Firmado por el Pasajero' : 'Pendiente de Firma Digital'}
                            </span>
                        </div>
                        <i class="fas fa-file-signature" style="font-size: 1.35rem; color: var(--brand-action);"></i>
                    </div>
                    ${hasSignature ? `
                        <div style="display: flex; align-items: center; gap: 0.75rem; background: var(--bg-surface-hover); padding: 0.5rem 0.75rem; border-radius: 8px; border: 1px dashed var(--border-color);">
                            <img src="${sigImgSrc}" alt="Firma" style="height: 38px; background: #fff; border-radius: 4px; padding: 2px 6px; border: 1px solid var(--border-color);">
                            <span style="font-size: 0.78rem; color: var(--text-secondary);">Firma insertada en documento (${escapeHTML(client.name)})</span>
                        </div>
                    ` : ''}
                    <div style="display: flex; gap: 0.5rem; margin-top: auto;">
                        <button type="button" class="btn btn-primary btn-sm btn-preview-legal-doc" data-doc-key="${docItem.key}" style="flex: 1; padding: 0.45rem; font-size: 0.82rem;">
                            <i class="fas fa-eye"></i> Ver Documento
                        </button>
                        <button type="button" class="btn btn-outline btn-sm btn-dl-legal-doc" data-doc-key="${docItem.key}" style="flex: 1; padding: 0.45rem; font-size: 0.82rem;">
                            <i class="fas fa-file-pdf"></i> PDF Firmado
                        </button>
                    </div>
                </div>
            `).join('');

            const signatureHtml = `
                <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                        <h4 style="margin: 0; color: var(--text-primary); font-size: 1.1rem;">
                            <i class="fas fa-file-contract" style="color: var(--brand-action); margin-right: 0.5rem;"></i> Documentos de Aceptación Legal (Con Firma del Pasajero)
                        </h4>
                        <button type="button" id="btn-dl-consolidated-history" class="btn btn-primary btn-sm" style="padding: 0.45rem 0.9rem; font-size: 0.82rem;">
                            <i class="fas fa-layer-group"></i> Descargar 4 Docs Consolidados (PDF)
                        </button>
                    </div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem;">
                        ${legalDocsCardsHtml}
                    </div>
                </div>
            `;

            detailsBody.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; background: var(--bg-surface-hover); padding: 1.5rem; border-radius: 8px;">
                    <div>
                        <span style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.2rem;">Nombres y Apellidos</span>
                        <strong style="font-size: 1.1rem;">${escapeHTML(client.name)}</strong>
                    </div>
                    <div>
                        <span style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.2rem;">Documento de Identidad</span>
                        <strong style="font-size: 1.1rem; font-family: monospace;">${escapeHTML(client.doc)}</strong>
                    </div>
                    <div>
                        <span style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.2rem;">Teléfono de Contacto</span>
                        <strong style="font-size: 1rem;">${escapeHTML(client.phone)}</strong>
                    </div>
                    <div>
                        <span style="display: block; font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 0.2rem;">Correo Electrónico</span>
                        <strong style="font-size: 1rem;">${escapeHTML(client.email)}</strong>
                    </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">
                    <h4 style="margin: 0; color: var(--text-primary);"><i class="fas fa-list-alt"></i> Histórico de Reservas / Saltos</h4>
                    <span style="background: var(--brand-action); color: white; padding: 2px 10px; border-radius: 12px; font-size: 0.85rem; font-weight: bold;">Total: ${client.jumps.length}</span>
                </div>
                
                <div style="max-height: 360px; overflow-y: auto; padding-right: 0.5rem;">
                    ${jumpsHtml}
                </div>
                ${paymentSupportSectionHtml}
                ${signatureHtml}
            `;

            // Bind buttons for Legal Documents Preview & Download
            detailsBody.querySelectorAll('.btn-preview-legal-doc').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const dKey = e.currentTarget.getAttribute('data-doc-key');
                    if (window.LegalDocsHelper) {
                        window.LegalDocsHelper.openLegalDocPreviewModal(dKey, client, 'es');
                    }
                });
            });

            detailsBody.querySelectorAll('.btn-dl-legal-doc').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const dKey = e.currentTarget.getAttribute('data-doc-key');
                    if (window.LegalDocsHelper) {
                        window.LegalDocsHelper.downloadSingleDocPdf(dKey, client, 'es');
                    }
                });
            });

            const btnDlConsolidated = detailsBody.querySelector('#btn-dl-consolidated-history');
            if (btnDlConsolidated) {
                btnDlConsolidated.addEventListener('click', () => {
                    if (window.LegalDocsHelper && typeof window.LegalDocsHelper.downloadConsolidatedPdf === 'function') {
                        window.LegalDocsHelper.downloadConsolidatedPdf(client, 'es');
                    }
                });
            }

            // Bind buttons for Payment Support Viewer
            detailsBody.querySelectorAll('.btn-view-jump-support').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const jIdx = parseInt(e.currentTarget.getAttribute('data-jidx'), 10);
                    const jumpPax = client.jumps[jIdx];
                    const targetPax = (jumpPax && (jumpPax.paymentSupport || jumpPax.soportePago)) ? jumpPax : { ...client, paymentSupport: client.paymentSupport };
                    if (window.viewPaymentSupportModal) window.viewPaymentSupportModal(targetPax);
                });
            });

            const btnOpenFullSupport = detailsBody.querySelector('#btn-open-full-payment-support');
            if (btnOpenFullSupport) {
                btnOpenFullSupport.addEventListener('click', () => {
                    if (window.viewPaymentSupportModal) window.viewPaymentSupportModal({ ...client, paymentSupport: client.paymentSupport });
                });
            }
            const imgThumbSupport = detailsBody.querySelector('#img-thumb-payment-support');
            if (imgThumbSupport) {
                imgThumbSupport.addEventListener('click', () => {
                    if (window.viewPaymentSupportModal) window.viewPaymentSupportModal({ ...client, paymentSupport: client.paymentSupport });
                });
            }

            modalDetails.style.display = 'flex';
            void modalDetails.offsetWidth;
            modalDetails.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
            
            // Re-bind PDF button
            const pdfBtn = document.getElementById('btn-download-pdf');
            const newPdfBtn = pdfBtn.cloneNode(true);
            pdfBtn.parentNode.replaceChild(newPdfBtn, pdfBtn);
            
            newPdfBtn.addEventListener('click', () => {
                generatePDF(client);
            });
        }
        
        async function generatePDF(client) {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                alert('La librería PDF no está cargada. Intente recargar la página.');
                return;
            }
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Header
            doc.setFontSize(22);
            doc.setTextColor(33, 150, 243); // brand blue
            doc.text("Historial de Pasajero", 105, 20, { align: "center" });
            
            doc.setFontSize(12);
            doc.setTextColor(50, 50, 50);
            doc.text(`Generado: ${new Date().toLocaleString()}`, 105, 28, { align: "center" });
            
            doc.setDrawColor(200, 200, 200);
            doc.line(15, 32, 195, 32);
            
            // Client Info
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text("Información Personal", 15, 42);
            
            doc.setFontSize(11);
            doc.text(`Nombre: ${client.name}`, 15, 50);
            doc.text(`Documento: ${client.doc}`, 15, 56);
            doc.text(`Teléfono: ${client.phone}`, 15, 62);
            doc.text(`Correo: ${client.email}`, 15, 68);
            doc.text(`Total Saltos: ${client.jumps.length}`, 15, 74);
            
            doc.line(15, 80, 195, 80);
            
            // Jumps History
            doc.setFontSize(14);
            doc.text("Historial de Reservas y Saltos", 15, 90);
            
            let y = 100;
            const pageHeight = doc.internal.pageSize.getHeight();
            
            client.jumps.forEach((j, index) => {
                if (y > pageHeight - 40) {
                    doc.addPage();
                    y = 20;
                }
                
                doc.setFontSize(12);
                doc.setTextColor(33, 150, 243);
                doc.text(`Salto #${client.jumps.length - index} - ${j.date} (${j.time || '--:--'})`, 15, y);
                doc.setTextColor(100, 100, 100);
                doc.setFontSize(10);
                doc.text(`Estado: ${j.paxStatus}`, 150, y);
                
                y += 6;
                doc.setTextColor(50, 50, 50);
                doc.text(`Tipo: ${j.type} | Cámaras: ${j.cams || 'Ninguna'}`, 15, y);
                y += 6;
                doc.text(`Vuelo: ${j.aeronave || 'S/A'} (${j.vueloNum || '--'}) | Instructor: ${j.instructor || 'S/A'}`, 15, y);
                
                y += 6;
                const docText = j.waiverSigned ? 'Waiver Firmado' : 'Waiver Pendiente';
                doc.text(`Documentos: ${docText}`, 15, y);
                
                y += 6;
                let pagado = 0;
                let valorReserva = 0;
                if (j.financiera) {
                    valorReserva = (j.financiera.manualPrice || 0) - (j.financiera.discount || 0);
                    if (j.financiera.totalPaid !== undefined) {
                        pagado = j.financiera.totalPaid;
                    }
                }
                const formatCurrency = (num) => '$' + (num || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
                doc.text(`Financiera: Base ${formatCurrency(valorReserva)} | Pagado ${formatCurrency(pagado)}`, 15, y);
                
                y += 12;
            });
            
            // Generate jsPDF ArrayBuffer
            const historyPdfArrayBuffer = doc.output('arraybuffer');
            
            try {
                const { PDFDocument } = window.PDFLib;
                const mergedPdf = await PDFDocument.create();
                
                // Load history PDF
                const historyPdf = await PDFDocument.load(historyPdfArrayBuffer);
                const historyPages = await mergedPdf.copyPages(historyPdf, historyPdf.getPageIndices());
                historyPages.forEach(p => mergedPdf.addPage(p));
                
                // Append all 4 legal documents with the passenger's signature inserted in EVERY document (Req #3)
                if (window.LegalDocsHelper) {
                    const docKeys = ['bienvenida', 'terminos', 'ficha', 'exoneracion'];
                    for (const docKey of docKeys) {
                        try {
                            const arrayBuffer = await window.LegalDocsHelper.generateSingleDocArrayBuffer(docKey, client, 'es');
                            const pdfDoc = await PDFDocument.load(arrayBuffer);
                            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                            copiedPages.forEach(page => mergedPdf.addPage(page));
                        } catch (err) {
                            console.error("Error appending signed legal doc:", docKey, err);
                        }
                    }
                }
                
                const mergedPdfBytes = await mergedPdf.save();
                const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `Historial_${client.doc || client.name.replace(/\s+/g, '_')}.pdf`;
                link.click();
                
            } catch (err) {
                console.error("Error merging PDFs", err);
                doc.save(`Historial_${client.doc || client.name.replace(/\s+/g, '_')}.pdf`);
            }
        }

        function closeDetails() {
            modalDetails.style.opacity = '0';
            modalContent.style.transform = 'translateY(-20px)';
            setTimeout(() => { modalDetails.style.display = 'none'; }, 300);
        }

        document.getElementById('btn-close-details').addEventListener('click', closeDetails);
        document.getElementById('btn-close-details-2').addEventListener('click', closeDetails);

        searchInput.addEventListener('input', renderResults);

        // Initial render
        renderResults();
    }
};
