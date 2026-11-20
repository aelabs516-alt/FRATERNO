window.Modules = window.Modules || {};

window.Modules.b2c = {
    render: (container) => {
        container.innerHTML = `
            <div class="b2c-container" style="min-height: 100vh; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; display: flex; flex-direction: column; overflow-y: auto;">
                
                <!-- Hero Section -->
                <div style="position: relative; padding: 4rem 2rem; text-align: center; overflow: hidden;">
                    <!-- Decorative BG Elements -->
                    <div style="position: absolute; top: -50%; left: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
                    <div style="position: absolute; bottom: -50%; right: -10%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
                    
                    <div style="position: relative; z-index: 10; max-width: 800px; margin: 0 auto;">
                        <h1 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: -1px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;">
                            <img src="img/logo-fids.png" alt="Fraterno" style="max-width: 80%; width: auto; height: auto; object-fit: contain; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.5));">
                            Vive la experiencia
                        </h1>
                        <p style="font-size: 1.2rem; color: #cbd5e1; margin-bottom: 2.5rem; line-height: 1.6;">
                            Reserva tu salto Tándem o Deportivo de forma rápida y segura. Disfruta de la mejor zona de salto con instructores certificados y vistas increíbles.
                        </p>
                        
                        <!-- CTA Buttons -->
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button class="btn" style="background: var(--brand-action); color: white; padding: 1rem 2.5rem; font-size: 1.1rem; border-radius: 30px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.5); font-weight: bold; cursor: pointer; transition: transform 0.2s;" onclick="document.getElementById('booking-section').scrollIntoView({behavior: 'smooth'})">
                                ¡Reserva tu Salto Hoy!
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Features Section -->
                <div style="padding: 3rem 2rem; background: rgba(255,255,255,0.02);">
                    <div style="max-width: 1000px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 2rem; border-radius: 16px; text-align: center; backdrop-filter: blur(10px);">
                            <div style="width: 60px; height: 60px; background: rgba(59, 130, 246, 0.2); color: #45dcf8; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; margin: 0 auto 1.5rem auto;"><i class="fas fa-parachute-box"></i></div>
                            <h3 style="margin-bottom: 1rem; font-size: 1.3rem;">Salto Tándem</h3>
                            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">La forma más fácil y segura de experimentar la caída libre. Unido a un instructor profesional todo el tiempo.</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 2rem; border-radius: 16px; text-align: center; backdrop-filter: blur(10px);">
                            <div style="width: 60px; height: 60px; background: rgba(16, 185, 129, 0.2); color: #10b981; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; margin: 0 auto 1.5rem auto;"><i class="fas fa-video"></i></div>
                            <h3 style="margin-bottom: 1rem; font-size: 1.3rem;">Servicios de Cámara</h3>
                            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">Lleva a casa el recuerdo de tu vida. Contamos con paquetes de fotos y video (Handcam y Cámara Externa).</p>
                        </div>
                        <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 2rem; border-radius: 16px; text-align: center; backdrop-filter: blur(10px);">
                            <div style="width: 60px; height: 60px; background: rgba(245, 158, 11, 0.2); color: #f59e0b; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 1.5rem; margin: 0 auto 1.5rem auto;"><i class="fas fa-plane"></i></div>
                            <h3 style="margin-bottom: 1rem; font-size: 1.3rem;">Saltadores Deportivos</h3>
                            <p style="color: #94a3b8; font-size: 0.95rem; line-height: 1.5;">¿Ya tienes licencia? Reserva tu cupo en los próximos vuelos y disfruta de nuestras instalaciones premium.</p>
                        </div>
                    </div>
                </div>

                <!-- Booking Section -->
                <div id="booking-section" style="padding: 4rem 2rem; flex: 1; position: relative;">
                    <div class="card" style="max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(20px); border-radius: 20px; padding: 2.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                        <h2 style="margin-top: 0; margin-bottom: 2rem; color: white; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem;">Formulario de Reserva</h2>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem;">
                            <!-- Column 1 -->
                            <div>
                                <div class="form-group">
                                    <label style="color: #cbd5e1;">Tipo de Reserva</label>
                                    <select id="b2c-type" class="form-control" style="background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.2); color: white;">
                                        <option value="Tandem" style="color: black;">Salto Tándem</option>
                                        <option value="Fun Jumper" style="color: black;">Salto Deportivo (Licenciado)</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label style="color: #cbd5e1;">Fecha de Salto</label>
                                    <input type="date" id="b2c-date" class="form-control" style="background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.2); color: white;">
                                </div>
                                <div class="form-group">
                                    <label style="color: #cbd5e1;">Hora Preferida</label>
                                    <select id="b2c-time" class="form-control" style="background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.2); color: white;">
                                        <option value="08:00" style="color: black;">08:00 AM</option>
                                        <option value="10:00" style="color: black;">10:00 AM</option>
                                        <option value="12:00" style="color: black;">12:00 PM (Mediodía)</option>
                                        <option value="14:00" style="color: black;">02:00 PM</option>
                                        <option value="16:00" style="color: black;">04:00 PM</option>
                                    </select>
                                </div>
                                <div class="form-group" id="b2c-cams-group">
                                    <label style="color: #cbd5e1;">Paquete de Video / Adicionales (Opcional)</label>
                                    <div id="b2c-dynamic-cams" style="display: flex; flex-direction: column; gap: 0.5rem; background: rgba(0,0,0,0.2); padding: 1rem; border-radius: var(--border-radius-sm); border: 1px solid rgba(255,255,255,0.2);">
                                        <!-- Checkboxes injected dynamically -->
                                    </div>
                                </div>
                                <div class="form-group" style="margin-top: 1.5rem; background: rgba(59, 130, 246, 0.2); padding: 1rem; border-radius: 8px; border: 1px solid rgba(59, 130, 246, 0.4);">
                                    <label style="color: #cbd5e1; font-size: 0.9rem; margin-bottom: 0.25rem; display: block;">Total Estimado</label>
                                    <div id="b2c-total-price" style="font-size: 1.5rem; font-weight: bold; color: white;">$0</div>
                                </div>
                            </div>
                            
                            <!-- Column 2 -->
                            <div>
                                <div class="form-group">
                                    <label style="color: #cbd5e1;">Nombre Completo</label>
                                    <input type="text" id="b2c-name" class="form-control" style="background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.2); color: white;" placeholder="Ej. Juan Pérez">
                                </div>
                                <div class="form-group">
                                    <label style="color: #cbd5e1;">Documento / Pasaporte</label>
                                    <input type="text" id="b2c-doc" class="form-control" style="background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.2); color: white;" placeholder="Número de identificación">
                                </div>
                                <div class="form-group">
                                    <label style="color: #cbd5e1;">Teléfono / WhatsApp</label>
                                    <input type="text" id="b2c-phone" class="form-control" style="background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.2); color: white;" placeholder="+57 300 000 0000">
                                </div>
                                <div class="form-group">
                                    <label style="color: #cbd5e1;">Peso (Kg) - Para Tándem</label>
                                    <input type="number" id="b2c-weight" class="form-control" style="background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.2); color: white;" placeholder="En kilogramos (Máx 110kg)">
                                </div>
                            </div>
                        </div>

                        <div style="margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 2rem; text-align: center;">
                            <button id="btn-submit-b2c" class="btn" style="background: var(--brand-success); color: white; padding: 1rem 3rem; font-size: 1.1rem; border-radius: 8px; font-weight: bold; width: 100%; max-width: 400px; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">
                                Confirmar y Pagar
                            </button>
                            <p style="color: #94a3b8; font-size: 0.8rem; margin-top: 1rem;">Al hacer clic, serás redirigido a nuestra pasarela de pagos segura. Tus datos serán procesados para generar tu reserva.</p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding: 2rem; color: rgba(255,255,255,0.3); font-size: 0.85rem; border-top: 1px solid rgba(255,255,255,0.05);">
                    &copy; 2026 FRATERNO Paracaidismo. Todos los derechos reservados.
                </div>
                
                <!-- Success Modal -->
                <div id="modal-b2c-success" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2000; align-items: center; justify-content: center; backdrop-filter: blur(5px);">
                    <div style="background: var(--bg-main); padding: 3rem; border-radius: 20px; text-align: center; max-width: 400px; width: 90%;">
                        <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.2); color: var(--brand-success); border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 2.5rem; margin: 0 auto 1.5rem auto;">
                            <i class="fas fa-check"></i>
                        </div>
                        <h2 style="margin-bottom: 1rem; color: var(--text-primary);">¡Reserva Exitosa!</h2>
                        <p style="color: var(--text-secondary); margin-bottom: 2rem; font-size: 0.95rem;">
                            Hemos recibido tu reserva. Tu número de localizador te ha sido enviado por correo y WhatsApp. Te esperamos en la Dropzone.
                        </p>
                        <button class="btn btn-primary" onclick="window.location.reload()" style="width: 100%;">Volver al Inicio</button>
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
        // Set min date to today
        const dateInput = document.getElementById('b2c-date');
        const today = new Date().toLocaleDateString('en-CA');
        dateInput.value = today;
        dateInput.min = today;

        const typeInput = document.getElementById('b2c-type');
        const camsGroup = document.getElementById('b2c-cams-group');
        const weightInput = document.getElementById('b2c-weight');
        const timeInput = document.getElementById('b2c-time');
        const camsContainer = document.getElementById('b2c-dynamic-cams');
        const totalPriceLabel = document.getElementById('b2c-total-price');

        // Helpers
        const formatCurrency = (num) => '$' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        
        let basePrices = { tandem: 1500000, funjumper: 1200000 };
        function updateBasePrices() {
            if (window.AppData && window.AppData.maestroValores) {
                const pt = window.AppData.maestroValores.find(v => v.name === 'Salto Tandem');
                const pf = window.AppData.maestroValores.find(v => v.name === 'Fun Jumper');
                if (pt) basePrices.tandem = parseInt(String(pt.price).replace(/\D/g, '') || '0', 10);
                if (pf) basePrices.funjumper = parseInt(String(pf.price).replace(/\D/g, '') || '0', 10);
            }
        }
        updateBasePrices();
        
        function renderDynamicCams() {
            
            if (!window.AppData || !window.AppData.maestroValores) {
                camsContainer.innerHTML = '';
                return;
            }

            let itemsToShow = window.AppData.maestroValores.filter(v => 
                ['Cámara 360', 'Cámara Externa', 'Cámara Go-Pro'].includes(v.name)
            );
            
            if (typeInput.value === 'Fun Jumper') {
                itemsToShow = window.AppData.maestroValores;
            }

            let camsHtml = '';
            itemsToShow.forEach(item => {
                const safeName = escapeHTML(item.name);
                const rawPrice = item.price ? String(item.price).replace(/\D/g, '') : '0';
                camsHtml += `
                    <label style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; color: white;">
                        <span style="display: flex; align-items: center; gap: 0.5rem;">
                            <input type="checkbox" class="b2c-cam-chk" value="${safeName}" data-price="${rawPrice}" style="width: 16px; height: 16px; accent-color: var(--brand-action);">
                            ${safeName}
                        </span>
                        <span style="color: #cbd5e1; font-size: 0.9rem;">+${formatCurrency(rawPrice)}</span>
                    </label>
                `;
            });
            camsContainer.innerHTML = camsHtml;
            
            document.querySelectorAll('.b2c-cam-chk').forEach(chk => {
                chk.addEventListener('change', calculateTotal);
            });

            
            document.querySelectorAll('.b2c-cam-chk').forEach(chk => {
                chk.addEventListener('change', calculateTotal);
            });
        }
        
        function calculateTotal() {
            let total = typeInput.value === 'Fun Jumper' ? basePrices.funjumper : basePrices.tandem;
            if (camsGroup.style.display !== 'none') {
                document.querySelectorAll('.b2c-cam-chk').forEach(chk => {
                    if (chk.checked) total += parseInt((chk.getAttribute('data-price') || '0').replace(/\D/g, ''), 10);
                });
            }
            totalPriceLabel.textContent = formatCurrency(total);
        }

        typeInput.addEventListener('change', () => {
            if (typeInput.value === 'Fun Jumper') {
                camsGroup.style.display = 'none';
                weightInput.placeholder = 'Opcional para deportivos';
            } else {
                camsGroup.style.display = 'block';
                weightInput.placeholder = 'En kilogramos (Máx 110kg)';
            }
            renderDynamicCams();
            calculateTotal();
        });
        
        function updateAvailableTimes() {
            const dateVal = dateInput.value;
            timeInput.innerHTML = '';
            
            if (!dateVal) return;
            
            const asgs = (window.AppData.asignacionFlota || []).filter(a => a.fecha === dateVal && a.estado !== 'Cancelado');
            if (asgs.length === 0) {
                timeInput.innerHTML = '<option value="" style="color: black;">No hay vuelos programados</option>';
                timeInput.disabled = true;
                return;
            }
            
            timeInput.disabled = false;
            // Get unique start times and sort
            const times = [...new Set(asgs.map(a => a.horaInicio))].sort();
            let timesHtml = '';
            times.forEach(t => {
                timesHtml += `<option value="${escapeHTML(t)}" style="color: black;">${escapeHTML(t)}</option>`;
            });
            timeInput.innerHTML = timesHtml;
        }

        dateInput.addEventListener('change', updateAvailableTimes);

        const docInput = document.getElementById('b2c-doc');
        const nameInput = document.getElementById('b2c-name');
        const phoneInput = document.getElementById('b2c-phone');

        docInput.addEventListener('blur', () => {
            const docVal = docInput.value.trim();
            if (!docVal) return;
            
            window.AppData = window.AppData || {};
            const passengers = window.AppData.passengers || [];
            
            // Search latest jump for this doc safely
            let found = null;
            const targetDoc = String(docVal).trim().toLowerCase();
            for (let i = passengers.length - 1; i >= 0; i--) {
                if (passengers[i].doc && String(passengers[i].doc).trim().toLowerCase() === targetDoc) {
                    if (passengers[i].name) {
                        found = passengers[i];
                        break;
                    }
                }
            }
            
            if (found) {
                nameInput.value = found.name || '';
                phoneInput.value = found.phone || '';
            } else {
                alert('El documento ingresado no existe en nuestra base de datos. Se registrará como cliente nuevo.');
            }
        });

        document.getElementById('btn-submit-b2c').addEventListener('click', () => {
            const type = typeInput.value;
            const date = dateInput.value;
            const time = timeInput.value;
            
            if (timeInput.disabled || !time) {
                return alert('Por favor, selecciona una fecha con vuelos programados.');
            }
            
            const selectedCams = [];
            if (type === 'Tandem') {
                document.querySelectorAll('.b2c-cam-chk').forEach(chk => {
                    if (chk.checked) selectedCams.push(chk.value);
                });
            }
            const cams = selectedCams.length > 0 ? selectedCams.join(', ') : 'Ninguna';
            
            const name = nameInput.value.trim();
            const doc = docInput.value.trim();
            const phone = phoneInput.value.trim();
            const weight = weightInput.value;

            if (!name || !doc || !phone || !date) {
                return alert('Por favor, completa tus datos personales, documento, teléfono y fecha.');
            }

            if (type === 'Tandem' && weight && parseInt(weight) > 110) {
                return alert('Para tu seguridad, el peso máximo para saltos Tándem es 110kg. Por favor contáctanos para evaluar tu caso.');
            }

            window.AppData = window.AppData || {};
            window.AppData.passengers = window.AppData.passengers || [];

            // Add new pax automatically set to "Pendiente Check-in" with frozen tariff snapshot
            const b2cSnapshot = window.TariffGuard ? window.TariffGuard.buildTariffSnapshot() : null;
            const b2cBasePrice = window.TariffGuard
                ? window.TariffGuard.getPriceForRecord({ tariffSnapshot: b2cSnapshot }, window.TariffGuard.resolveJumpTypeItemName(type, b2cSnapshot?.items))
                : 0;
            window.AppData.passengers.push({
                id: 'b2c_' + Date.now(),
                createdAt: new Date().toISOString(),
                tariffSnapshot: b2cSnapshot,
                name: name,
                doc: doc,
                phone: phone,
                type: type,
                date: date,
                time: time,
                cams: cams,
                weight: weight || '',
                instructor: 'Sin asignar',
                aeronave: 'Sin asignar',
                paxStatus: 'Pendiente Check-in',
                flightStatus: 'En Espera',
                waiverSigned: false,
                financiera: { manualPrice: b2cBasePrice, discount: 0, totalPaid: 0 },
                source: 'B2C'
            });

            if (window.saveAppData) window.saveAppData();

            // Show success modal
            document.getElementById('modal-b2c-success').style.display = 'flex';
        });
        
        // initial calculations
        renderDynamicCams();
        calculateTotal();
        updateAvailableTimes();
    }
};
