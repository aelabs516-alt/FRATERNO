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
                        signature: null
                    });
                }
                const client = paxMap.get(key);
                client.jumps.push(p);
                if (p.signature && !client.signature) {
                    client.signature = p.signature;
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
            
            client.jumps.forEach(j => {
                let statusColor = 'var(--text-secondary)';
                if (j.paxStatus === 'Check-in Listo') statusColor = 'var(--brand-action)';
                if (j.paxStatus === 'Completado') statusColor = 'var(--brand-success)';
                if (j.paxStatus === 'Cancelado / Cancelled') statusColor = 'var(--brand-danger)';
                
                // Documents section
                const docBadge = j.waiverSigned 
                    ? '<span style="color: var(--brand-success);"><i class="fas fa-file-signature"></i> Waiver Firmado</span>' 
                    : '<span style="color: var(--brand-danger);"><i class="fas fa-times-circle"></i> Waiver Pendiente</span>';

                // Payments section
                let pagado = 0;
                let valorReserva = 0;
                if (j.financiera) {
                    valorReserva = (j.financiera.manualPrice || 0) - (j.financiera.discount || 0);
                    if (j.financiera.totalPaid !== undefined) {
                        pagado = j.financiera.totalPaid;
                    }
                }
                const finStatus = pagado >= valorReserva && valorReserva > 0
                    ? '<span style="color: var(--brand-success); font-weight:bold;">Pagado</span>'
                    : '<span style="color: var(--brand-action); font-weight:bold;">Con Saldo Pendiente</span>';

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

                        <div style="background: rgba(0,0,0,0.02); border: 1px dashed var(--border-color); padding: 1rem; border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase; margin-bottom: 0.25rem;"><i class="fas fa-wallet"></i> Resumen de Pagos</span>
                                <span style="font-size: 0.9rem;">Valor Base: <strong>${formatCurrency(valorReserva)}</strong> | Pagado: <strong>${formatCurrency(pagado)}</strong></span>
                            </div>
                            <div>${finStatus}</div>
                        </div>
                    </div>
                `;
            });

            
            let signatureHtml = '';
            if (client.signature) {
                signatureHtml = `
                <div style="margin-top: 2rem; border-top: 1px solid var(--border-color); padding-top: 1.5rem;">
                    <h4 style="margin: 0 0 1rem 0; color: var(--text-primary); font-size: 1.1rem;"><i class="fas fa-file-signature" style="color: var(--brand-action); margin-right: 0.5rem;"></i> Documento Legal y Firma (Exoneración de Responsabilidades)</h4>
                    <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 1.5rem; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-top: 0; line-height: 1.6; font-style: italic;">"Al firmar este documento, declaro que he leído, entendido y aceptado todos los términos y condiciones, así como el documento de exoneración de responsabilidades inherentes a la práctica del paracaidismo. Asumo voluntariamente todos los riesgos."</p>
                        <div style="margin-top: 1.5rem; display: flex; flex-direction: column; align-items: center; justify-content: center; background: rgba(0,0,0,0.02); padding: 1.5rem; border-radius: 8px; border: 1px dashed var(--border-color);">
                            <strong style="display: block; font-size: 0.85rem; color: var(--text-primary); margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 1px;">Firma del Pasajero</strong>
                            <img src="${client.signature}" alt="Firma del Pasajero" style="max-width: 100%; height: 120px; background: white; border-radius: 4px; padding: 0.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
                        </div>
                    </div>
                </div>
                `;
            }

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
                
                <div style="max-height: 450px; overflow-y: auto; padding-right: 0.5rem;">
                    ${jumpsHtml}
                </div>
            ${signatureHtml}
            `;

            modalDetails.style.display = 'flex';
            void modalDetails.offsetWidth;
            modalDetails.style.opacity = '1';
            modalContent.style.transform = 'translateY(0)';
            
            // Re-bind PDF button
            const pdfBtn = document.getElementById('btn-download-pdf');
            // Remove previous listeners by cloning
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
                
                // Load and append the 4 legal documents
                const files = [
                    '1_bienvenida.pdf',
                    '2_terminos_condiciones.pdf',
                    '3_ficha_informacion.pdf',
                    '4_exoneracion.pdf'
                ];
                
                const startIndex = mergedPdf.getPageCount();
                
                for (const file of files) {
                    try {
                        const docKey = file.includes('1_bienvenida') ? 'bienvenida' : (file.includes('2_terminos') ? 'terminos' : (file.includes('3_ficha') ? 'ficha' : 'exoneracion'));
                        let docUrl = 'assets/docs/' + file;
                        const fullKey = docKey + '_es';
                        const docArr = window.AppData?.legalDocs?.[fullKey];
                        if (docArr && docArr.length > 0 && docArr[docArr.length - 1].dataUrl) {
                            docUrl = docArr[docArr.length - 1].dataUrl;
                        }
                        
                        const res = await fetch(docUrl);
                        if (!res.ok) continue;
                        const arrayBuffer = await res.arrayBuffer();
                        const pdfDoc = await PDFDocument.load(arrayBuffer);
                        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                        copiedPages.forEach(page => mergedPdf.addPage(page));
                    } catch (err) {
                        console.error("Error appending doc", err);
                    }
                }
                
                const endIndex = mergedPdf.getPageCount();
                if (endIndex > startIndex) {
                    const lastPage = mergedPdf.getPage(endIndex - 1);
                    const { width, height } = lastPage.getSize();
                    
                    if (client.signature) {
                        try {
                            const pngImageBytes = await fetch(client.signature).then(res => res.arrayBuffer());
                            const pngImage = await mergedPdf.embedPng(pngImageBytes);
                            const sigDims = pngImage.scale(0.5);
                            lastPage.drawImage(pngImage, {
                                x: width / 2 - sigDims.width / 2,
                                y: 50,
                                width: sigDims.width,
                                height: sigDims.height,
                            });
                        } catch (e) { console.error("Error drawing signature", e); }
                    }
                    
                    if (client.selfie) {
                        try {
                            const selfieBytes = await fetch(client.selfie).then(res => res.arrayBuffer());
                            let selfieImg;
                            if (client.selfie.includes('image/jpeg') || client.selfie.includes('image/jpg')) {
                                selfieImg = await mergedPdf.embedJpg(selfieBytes);
                            } else {
                                selfieImg = await mergedPdf.embedPng(selfieBytes);
                            }
                            const selfieDims = selfieImg.scaleToFit(100, 100);
                            lastPage.drawImage(selfieImg, {
                                x: 50,
                                y: 50,
                                width: selfieDims.width,
                                height: selfieDims.height,
                            });
                        } catch (e) { console.error("Error drawing selfie", e); }
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
