const fs = require('fs');
let code = fs.readFileSync('js/modules/billing.js', 'utf8');

const initStart = code.indexOf('// --- FACTURA LOGIC ---');
let topPart = code.substring(0, initStart);

topPart = topPart.trim();
while (topPart.endsWith('}') || topPart.endsWith(';')) {
    topPart = topPart.substring(0, topPart.length - 1).trim();
}

// We only need to close ONE thing here to put the FACTURA logic INSIDE init:
// The `btnExportNomina.addEventListener` call and the `if(btnExportNomina)` block:
// wait, if `topPart` ends with `})`, that's the end of `btnExportNomina.addEventListener('click', () => { ... })`
// So we just need:
// `;\n        }\n\n` (closes `addEventListener();` and `if(btnExportNomina) {`)
topPart += ';\n        }\n\n';

const facturaLogic = `        // --- FACTURA LOGIC ---
        const colombiaData = {
            "Amazonas": ["Leticia", "Puerto Nariño"],
            "Antioquia": ["Medellín", "Bello", "Itagüí", "Envigado", "Apartadó", "Rionegro"],
            "Atlántico": ["Barranquilla", "Soledad", "Malambo", "Sabanagrande"],
            "Bogotá D.C.": ["Bogotá"],
            "Bolívar": ["Cartagena", "Magangué", "Turbaco"],
            "Boyacá": ["Tunja", "Duitama", "Sogamoso", "Chiquinquirá"],
            "Caldas": ["Manizales", "La Dorada", "Villamaría"],
            "Caquetá": ["Florencia", "San Vicente del Caguán"],
            "Casanare": ["Yopal", "Aguazul", "Villanueva"],
            "Cauca": ["Popayán", "Santander de Quilichao", "El Tambo"],
            "Cesar": ["Valledupar", "Aguachica", "Agustín Codazzi"],
            "Chocó": ["Quibdó", "Istmina", "Tadó"],
            "Córdoba": ["Montería", "Lorica", "Tierralta", "Cereté"],
            "Cundinamarca": ["Soacha", "Fusagasugá", "Facatativá", "Zipaquirá", "Chía", "Girardot", "Ricaurte"],
            "Huila": ["Neiva", "Pitalito", "Garzón"],
            "La Guajira": ["Riohacha", "Maicao", "Uribia"],
            "Magdalena": ["Santa Marta", "Ciénaga", "Fundación"],
            "Meta": ["Villavicencio", "Acacías", "Granada"],
            "Nariño": ["Pasto", "Tumaco", "Ipiales"],
            "Norte de Santander": ["Cúcuta", "Ocaña", "Villa del Rosario"],
            "Putumayo": ["Mocoa", "Puerto Asís"],
            "Quindío": ["Armenia", "Calarcá", "Montenegro"],
            "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal"],
            "San Andrés y Providencia": ["San Andrés", "Providencia"],
            "Santander": ["Bucaramanga", "Floridablanca", "Barrancabermeja", "Piedecuesta"],
            "Sucre": ["Sincelejo", "Corozal", "San Marcos"],
            "Tolima": ["Ibagué", "Espinal", "Melgar", "Flandes"],
            "Valle del Cauca": ["Cali", "Buenaventura", "Palmira", "Tuluá", "Cartago"]
        };

        const deptoSelect = document.getElementById('factura-depto');
        const ciudadSelect = document.getElementById('factura-ciudad');
        
        if(deptoSelect) {
            Object.keys(colombiaData).sort().forEach(depto => {
                const opt = document.createElement('option');
                opt.value = depto;
                opt.textContent = depto;
                deptoSelect.appendChild(opt);
            });

            deptoSelect.addEventListener('change', (e) => {
                const depto = e.target.value;
                ciudadSelect.innerHTML = '<option value="" disabled selected>Seleccione Ciudad</option>';
                if (depto && colombiaData[depto]) {
                    colombiaData[depto].sort().forEach(ciudad => {
                        const opt = document.createElement('option');
                        opt.value = ciudad;
                        opt.textContent = ciudad;
                        ciudadSelect.appendChild(opt);
                    });
                    ciudadSelect.disabled = false;
                } else {
                    ciudadSelect.disabled = true;
                }
                updatePreview();
            });
        }

        const fFecha = document.getElementById('factura-fecha');
        if(fFecha) {
            const today = new Date().toISOString().split('T')[0];
            fFecha.value = today;
        }

        let seqStr = localStorage.getItem('factura_seq') || "1";
        let seqNum = parseInt(seqStr, 10);
        function pad(num, size) {
            let s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        }
        const fNum = document.getElementById('prev-factura-num');
        if(fNum) fNum.textContent = pad(seqNum, 4);

        const telInput = document.getElementById('factura-tel');
        if(telInput) {
            telInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/\\D/g, '').substring(0, 14);
                updatePreview();
            });
        }

        const bindFields = [
            { id: 'factura-fecha', prev: 'prev-fecha' },
            { id: 'factura-nombre', prev: 'prev-nombre' },
            { id: 'factura-id', prev: 'prev-id' },
            { id: 'factura-dir', prev: 'prev-dir' },
            { id: 'factura-email', prev: 'prev-email' },
            { id: 'factura-obs', prev: 'prev-obs' }
        ];

        function updatePreview() {
            bindFields.forEach(f => {
                const prevEl = document.getElementById(f.prev);
                const el = document.getElementById(f.id);
                if (prevEl && el) prevEl.textContent = el.value || '';
            });
            const deptoEl = document.getElementById('factura-depto');
            const ciudadEl = document.getElementById('factura-ciudad');
            if (deptoEl && ciudadEl) {
                const depto = deptoEl.value || '';
                const ciudad = ciudadEl.value || '';
                const prevUbi = document.getElementById('prev-ubicacion');
                if(prevUbi) prevUbi.textContent = (ciudad && depto) ? (ciudad + ', ' + depto) : '';
            }
            if(telInput) {
                const prevTel = document.getElementById('prev-tel');
                if(prevTel) prevTel.textContent = telInput.value || '';
            }
        }

        bindFields.forEach(f => {
            const el = document.getElementById(f.id);
            if(el) {
                el.addEventListener('input', updatePreview);
                el.addEventListener('change', updatePreview);
            }
        });
        if(ciudadSelect) ciudadSelect.addEventListener('change', updatePreview);

        let facturaItems = [];
        const btnAddItem = document.getElementById('btn-add-factura-item');
        const itemsBody = document.getElementById('prev-items-body');

        function renderFacturaItems() {
            if(!itemsBody) return;
            itemsBody.innerHTML = '';
            let subtotal = 0;
            facturaItems.forEach((item, index) => {
                const totalLine = item.qty * item.price;
                subtotal += totalLine;
                const tr = document.createElement('tr');
                tr.innerHTML = \`<td style="padding: 0.5rem; border-bottom: 1px solid #eee;">\${escapeHTML(item.desc)}</td><td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: center;">\${item.qty}</td><td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: right;">$\${item.price.toLocaleString('es-CO')}</td><td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: right;">$\${totalLine.toLocaleString('es-CO')}</td><td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: center;" class="no-print"><button class="btn-del-item" data-idx="\${index}" style="background: none; border: none; color: #d32f2f; cursor: pointer;"><i class="fas fa-trash"></i></button></td>\`;
                itemsBody.appendChild(tr);
            });

            document.querySelectorAll('.btn-del-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.getAttribute('data-idx'));
                    facturaItems.splice(idx, 1);
                    renderFacturaItems();
                });
            });

            const iva = subtotal * 0.19;
            const total = subtotal + iva;

            const prevSub = document.getElementById('prev-subtotal');
            const prevIva = document.getElementById('prev-iva');
            const prevTot = document.getElementById('prev-total');
            if(prevSub) prevSub.textContent = '$' + subtotal.toLocaleString('es-CO');
            if(prevIva) prevIva.textContent = '$' + iva.toLocaleString('es-CO');
            if(prevTot) prevTot.textContent = '$' + total.toLocaleString('es-CO');
        }

        if(btnAddItem) {
            btnAddItem.addEventListener('click', () => {
                const desc = document.getElementById('factura-item-desc').value;
                const qty = parseInt(document.getElementById('factura-item-qty').value, 10);
                const price = parseFloat(document.getElementById('factura-item-price').value);

                if (!desc || isNaN(qty) || isNaN(price)) {
                    alert('Complete todos los campos del ítem');
                    return;
                }

                facturaItems.push({ desc, qty, price });
                document.getElementById('factura-item-desc').value = '';
                document.getElementById('factura-item-qty').value = '1';
                document.getElementById('factura-item-price').value = '';
                
                renderFacturaItems();
            });
        }

        updatePreview();
        renderFacturaItems();

        const btnExport = document.getElementById('btn-exportar-factura');
        if(btnExport) {
            btnExport.addEventListener('click', () => {
                if (typeof window.jspdf === 'undefined') {
                    alert("Error: jsPDF no está cargado.");
                    return;
                }
                if (typeof html2canvas === 'undefined') {
                    const script = document.createElement('script');
                    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
                    script.onload = () => exportFactura();
                    document.head.appendChild(script);
                } else {
                    exportFactura();
                }
            });
        }

        function exportFactura() {
            const previewEl = document.getElementById('factura-preview');
            const deletes = previewEl.querySelectorAll('.no-print');
            deletes.forEach(el => el.style.display = 'none');

            html2canvas(previewEl, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Factura_Fraterno_' + pad(seqNum, 4) + '.pdf');

                seqNum++;
                localStorage.setItem('factura_seq', seqNum.toString());
                document.getElementById('prev-factura-num').textContent = pad(seqNum, 4);

                deletes.forEach(el => el.style.display = '');
                alert('Factura generada con éxito.');
            }).catch(err => {
                console.error("Error generating PDF", err);
                alert("Hubo un error al generar el PDF.");
                deletes.forEach(el => el.style.display = '');
            });
        }
    }
};
`;

fs.writeFileSync('js/modules/billing.js', topPart + facturaLogic, 'utf8');
console.log('Fixed rebuild!');
