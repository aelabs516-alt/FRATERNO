window.Modules = window.Modules || {};

window.Modules.autogestion = {
    render: (container) => {
        container.innerHTML = `
            <div style="--bg-main: #0f172a; --text-primary: #ffffff; --text-secondary: #cbd5e1; --border-color: rgba(255, 255, 255, 0.1); --bg-surface: rgba(15, 23, 42, 0.5); --bg-surface-hover: rgba(255, 255, 255, 0.05); --glass-bg: rgba(30, 41, 59, 0.7); --brand-success: #10b981; --brand-action: #3b82f6; min-height: 100vh; background: var(--bg-main); color: var(--text-primary); display: flex; flex-direction: column; font-family: 'Inter', sans-serif; overflow-y: auto;">
                
                <!-- Hero Section with Parallax Effect -->
                <div style="position: relative; padding: 5rem 2rem; text-align: center; overflow: hidden; background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9)), url('https://images.unsplash.com/photo-1520114878144-6123749969dd?auto=format&fit=crop&q=80&w=2000') center/cover; background-attachment: fixed;">
                    <div style="position: relative; z-index: 10; max-width: 800px; margin: 0 auto; animation: fadeDown 1s ease-out;">
                        <h1 style="font-size: 3.5rem; font-weight: 900; margin-bottom: 1rem; letter-spacing: -1px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">
                            FRATERNO <span style="background: linear-gradient(to right, #3b82f6, #06b6d4); -webkit-background-clip: text; color: transparent;">SKYDIVING</span>
                        </h1>
                        <p style="font-size: 1.25rem; color: var(--text-secondary); margin-bottom: 2.5rem; line-height: 1.6;">
                            Reserva tu salto Tándem o Deportivo de forma rápida y segura. Disfruta de la mejor zona de salto con instructores certificados y vistas increíbles.
                        </p>
                    </div>
                </div>

                <!-- Booking Section -->
                <div id="booking-section" style="padding: 4rem 2rem; background: var(--bg-main); position: relative;">
                    <!-- Decorative Orbs -->
                    <div style="position: absolute; top: 10%; left: -5%; width: 300px; height: 300px; background: rgba(59, 130, 246, 0.15); border-radius: 50%; filter: blur(50px); pointer-events: none;"></div>
                    <div style="position: absolute; bottom: 10%; right: -5%; width: 300px; height: 300px; background: rgba(16, 185, 129, 0.1); border-radius: 50%; filter: blur(50px); pointer-events: none;"></div>

                    <div style="max-width: 700px; margin: 0 auto; position: relative; z-index: 10;">
                        <div style="background: var(--glass-bg); backdrop-filter: blur(15px); border: 1px solid var(--border-color); border-radius: 24px; padding: 3rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
                                <!-- Selector de Idioma -->
                                <div style="position: absolute; top: 1rem; right: 2rem;">
                                    <select id="ag-lang-select" style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); padding: 0.5rem; border-radius: 8px;">
                                        <option value="es">Español</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>

                            <h2 style="margin-top: 0; font-size: 2rem; margin-bottom: 2rem; color: var(--text-primary); text-align: center;" data-i18n="title">Reserva tu Aventura</h2>
                            
                            <form id="ag-booking-form">
                                <!-- Detalles del Salto -->
                                <h3 style="color: var(--brand-action); font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem;"><i class="fas fa-parachute-box"></i> Detalle de Salto</h3>
                                
                                <div style="display: flex; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="flex: 2; margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="jump_type">Tipo de Experiencia</label>
                                        <select id="ag-type" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);">
                                            <option value="Salto Tandem">Salto Tándem</option>
                                        </select>
                                    </div>
                                    <div class="form-group" style="flex: 1; margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="qty">Cant. Personas</label>
                                        <input type="number" id="ag-qty" value="1" min="1" max="10" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary); text-align: center;" required>
                                    </div>
                                </div>

                                <!-- Datos Personales -->
                                <h3 style="color: var(--brand-action); font-size: 1.1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem; margin-bottom: 1.5rem;"><i class="fas fa-user"></i> Datos Personales</h3>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="fname">Nombre</label>
                                        <input type="text" id="ag-fname" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="lname">Apellido</label>
                                        <input type="text" id="ag-lname" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="doc">Documento / Pasaporte</label>
                                        <input type="text" id="ag-doc" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="phone">Teléfono / WhatsApp</label>
                                        <input type="text" id="ag-phone" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="email">Correo Electrónico</label>
                                        <input type="email" id="ag-email" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" placeholder="ejemplo@correo.com" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="weight">Peso (KG)</label>
                                        <input type="number" id="ag-weight" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" placeholder="Ej. 75" required>
                                    </div>
                                </div>
                                <div id="ag-camera-section" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem;">
                                    <label style="color: var(--text-secondary); font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem; display: block;">Adicionales Pasajero 1</label>
                                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-color);">
                                            <div style="display: flex; align-items: center; gap: 0.8rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="1" value="Cámara Go-Pro" style="accent-color: var(--brand-action); width: 18px; height: 18px;">
                                                <span style="color: var(--text-primary);">Cámara Go-Pro</span>
                                            </div>
                                            <strong id="lbl-gopro-val" style="color: var(--brand-success);"></strong>
                                        </label>
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-color);">
                                            <div style="display: flex; align-items: center; gap: 0.8rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="1" value="Cámara 360" style="accent-color: var(--brand-action); width: 18px; height: 18px;">
                                                <span style="color: var(--text-primary);">Cámara 360° Interactiva</span>
                                            </div>
                                            <strong id="lbl-360-val" style="color: var(--brand-success);"></strong>
                                        </label>
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                            <div style="display: flex; align-items: center; gap: 0.8rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="1" value="Cámara Externa" style="accent-color: var(--brand-action); width: 18px; height: 18px;">
                                                <span style="color: var(--text-primary);">Cámara Externa</span>
                                            </div>
                                            <strong id="lbl-ext-val" style="color: var(--brand-success);"></strong>
                                        </label>
                                    </div>
                                </div>

                                <div id="ag-legal-container-1"></div>
                                <div id="ag-group-container"></div>
                                <div id="ag-group-note" style="display: none; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; color: var(--brand-action); font-size: 0.85rem;">
                                    <h4 style="margin-top: 0; color: var(--brand-action);"><i class="fas fa-info-circle"></i> Procedimiento para Reservas de Grupos</h4>
                                    <p style="margin-bottom: 0.75rem;">Te recordamos que, para realizar la reserva de un grupo, cada pasajero debe completar el formulario desde el correo electrónico de un líder del grupo, con el fin de identificar correctamente que se trata de una reserva grupal y evitar cualquier tipo de confusión.</p>
                                    <p style="margin-bottom: 0.75rem;">Además, asegúrate de adjuntar el comprobante de pago con cada formulario para completar la reserva de manera exitosa.</p>
                                    <p style="margin-bottom: 0.75rem;">Si van en pareja o en grupo, por motivos logísticos, de organización y disponibilidad de cupos, no se garantiza que todos salten al mismo tiempo ni que vayan en el mismo vuelo.</p>
                                    <p style="margin-bottom: 1rem;">Si tienes alguna duda o necesitas más aclaraciones, no dudes en ponerte en contacto con tu asesor. Estamos aquí para ayudarte.<br><br>Agradecemos tu cooperación y confianza en Fraterno 🪂.</p>
                                    
                                    <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--text-primary); font-weight: bold; font-size: 0.95rem; background: var(--bg-surface-hover); padding: 0.75rem; border-radius: 6px;">
                                        <input type="checkbox" id="ag-group-understand" style="accent-color: #10b981; width: 18px; height: 18px;">
                                        ¡Entendido! ✅
                                    </label>
                                </div>

                                <!-- Detalle del salto movido arriba -->

                                <!-- Camera section moved to top -->

                                <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 1.5rem; border-radius: 12px; margin-bottom: 2rem;">
                                    <div style="display: flex; justify-content: space-between; align-items: center;">
                                        <span style="color: var(--text-secondary); font-size: 1.1rem; font-weight: 500;" data-i18n="total">Total Estimado:</span>
                                        <strong id="ag-total-val" style="color: #10b981; font-size: 2rem; font-weight: 900;">$0</strong>
                                    </div>
                                    <div id="ag-total-detail" style="font-size: 0.8rem; color: var(--text-secondary); text-align: right; margin-top: 0.5rem;"></div>
                                </div>

                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;" data-i18n="date">Fecha Deseada</label>
                                        <input type="hidden" id="ag-date" required>
                                        <div id="ag-interactive-calendar" style="width: 100%; margin-top: 0.5rem; background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                                            <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem; background: rgba(30, 41, 59, 0.8);">
                                                <button type="button" id="ag-cal-prev" style="background: var(--border-color); border: none; color: var(--text-primary); cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s;"><i class="fas fa-chevron-left"></i></button>
                                                <span id="ag-cal-month" style="color: var(--text-primary); font-weight: bold; font-size: 1.1rem; text-transform: capitalize; letter-spacing: 0.5px;"></span>
                                                <button type="button" id="ag-cal-next" style="background: var(--border-color); border: none; color: var(--text-primary); cursor: pointer; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: background 0.2s;"><i class="fas fa-chevron-right"></i></button>
                                            </div>
                                            <div style="display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; padding: 0.5rem 0.5rem 0 0.5rem; color: var(--text-secondary); font-size: 0.75rem; font-weight: 700; text-transform: uppercase;">
                                                <div>Do</div><div>Lu</div><div>Ma</div><div>Mi</div><div>Ju</div><div>Vi</div><div>Sa</div>
                                            </div>
                                            <div id="ag-cal-grid" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.35rem; padding: 0.5rem;">
                                                <!-- Calendar days injected here -->
                                            </div>
                                        </div>
                                        <div id="ag-availability-info" style="margin-top: 1rem; padding: 1rem; border-radius: 8px; display: none;"></div>
                                    </div>
                                </div>

                                
                                <!-- Legal container moved up -->
<button type="submit" id="ag-btn-confirm" class="btn" disabled style="width: 100%; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: var(--text-primary); padding: 1.2rem; font-size: 1.2rem; font-weight: bold; border-radius: 12px; border: none; cursor: pointer; box-shadow: 0 10px 20px -5px rgba(59, 130, 246, 0.5); transition: transform 0.2s, box-shadow 0.2s;">
                                    Confirmar Reserva
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding: 2rem; color: #64748b; font-size: 0.9rem; border-top: 1px solid rgba(255,255,255,0.05); margin-top: auto;">
                    &copy; 2026 Fraterno Skydiving. Todos los derechos reservados.
                </div>
            </div>
            <style>
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .form-control:focus {
                    outline: none;
                    border-color: var(--brand-action) !important;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }
                .btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.7) !important;
                }
            </style>
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

        
    const translations = {
        es: {
            title: "Reserva tu Aventura",
            personal_data: "Datos Personales",
            fname: "Nombre",
            lname: "Apellido",
            doc: "Documento / Pasaporte",
            phone: "Teléfono / WhatsApp",
            email: "Correo Electrónico",
            weight: "Peso (KG)",
            group_title: "Procedimiento para Reservas de Grupos",
            group_understood: "¡Entendido! ✅",
            jump_detail: "Detalle de Salto",
            jump_type: "Tipo de Experiencia",
            qty: "Cant. Personas",
            addons: "Adicionales Pasajero",
            cam_gopro: "Cámara Go-Pro",
            cam_360: "Cámara 360° Interactiva",
            cam_ext: "Cámara Externa",
            total: "Total Estimado:",
            date: "Fecha Deseada",
            doc1_title: "1. Guía de Bienvenida",
            doc1_desc: "Conoce todo lo necesario antes de tu salto. Información general y recomendaciones clave.",
            doc2_title: "2. Términos y Condiciones de la Operación",
            doc2_desc: "Regulaciones operativas, políticas de reagendamiento y condiciones del servicio.",
            doc3_title: "3. Ficha Informativa",
            doc3_desc: "Información detallada sobre el equipo, seguridad y desarrollo de la actividad.",
            doc4_title: "4. Exoneración de Responsabilidad",
            exo_p1: "Antes de finalizar su compra, es indispensable que lea detenidamente la Exoneración de Responsabilidad.",
            exo_p2: "En este documento encontrará información importante sobre las condiciones de uso, alcance de la garantía, responsabilidades de las partes, requisitos de instalación, recomendaciones de uso y demás aspectos relacionados con el producto o servicio adquirido.",
            exo_p3: "Al continuar con la compra, usted declara que ha leído, comprendido y acepta los términos y condiciones establecidos en la Exoneración de Responsabilidad.",
            btn_pdf: "Descargar Documento PDF",
            doc_read_accept: "He leído y acepto el documento",
            selfie_title: "Foto / Selfie de Seguridad",
            selfie_desc: "Para validar tu identidad, por favor toma o sube una fotografía frontal (selfie).",
            sig_title: "Firma del Pasajero",
            sig_desc: "Por favor, firma en el cuadro inferior. Esta firma se estampará en los documentos legales y es equivalente a tu firma física.",
            clear: "Limpiar Firma",
            btn_confirm: "Confirmar Reserva",
            alert_check: "Debes leer y aceptar todos los documentos obligatorios.",
            alert_selfie: "Falta foto / selfie de seguridad.",
            alert_sig: "Falta firmar.",
            alert_processing: "Procesando Documentos...",
            alert_success: "¡Registro y firma completados exitosamente!",
            alert_error: "Error al procesar los PDFs."
        },
        en: {
            title: "Book your Adventure",
            personal_data: "Personal Data",
            fname: "First Name",
            lname: "Last Name",
            doc: "ID / Passport",
            phone: "Phone / WhatsApp",
            email: "Email Address",
            weight: "Weight (KG)",
            group_title: "Group Booking Procedure",
            group_understood: "Understood! ✅",
            jump_detail: "Jump Details",
            jump_type: "Experience Type",
            qty: "Pax Qty",
            addons: "Add-ons Passenger",
            cam_gopro: "Go-Pro Camera",
            cam_360: "360° Interactive Camera",
            cam_ext: "External Camera",
            total: "Estimated Total:",
            date: "Desired Date",
            doc1_title: "1. Welcome Guide",
            doc1_desc: "Learn everything you need before your jump. General information and key recommendations.",
            doc2_title: "2. Operation Terms and Conditions",
            doc2_desc: "Operational regulations, rescheduling policies, and service conditions.",
            doc3_title: "3. Information Sheet",
            doc3_desc: "Detailed information about equipment, security, and activity development.",
            doc4_title: "4. Liability Waiver",
            exo_p1: "Important – Please Read the Liability Waiver. Before completing your purchase, it is essential that you carefully read the Liability Waiver.",
            exo_p2: "This document contains important information regarding the terms of use, warranty coverage, responsibilities of each party, installation requirements, usage recommendations, and other relevant details related to the product or service you are purchasing.",
            exo_p3: "By proceeding with your purchase, you acknowledge that you have read, understood, and agreed to the terms and conditions outlined in the Liability Waiver.",
            btn_pdf: "Download PDF Document",
            doc_read_accept: "I have read and accept the document",
            selfie_title: "Security Photo / Selfie",
            selfie_desc: "To validate your identity, please take or upload a frontal photo (selfie).",
            sig_title: "Passenger Signature",
            sig_desc: "Please sign in the box below. This signature will be stamped on the legal documents and is equivalent to your physical signature.",
            clear: "Clear Signature",
            btn_confirm: "Confirm Booking",
            alert_check: "You must read and accept all mandatory documents.",
            alert_selfie: "Security photo / selfie is missing.",
            alert_sig: "Signature is missing.",
            alert_processing: "Processing Documents...",
            alert_success: "Registration and signature successfully completed!",
            alert_error: "Error processing PDFs."
        }
    };
    let currentLang = 'es';
    const applyTranslations = () => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });
        document.querySelectorAll('[data-i18n-ph]').forEach(el => {
            const key = el.getAttribute('data-i18n-ph');
            if (translations[currentLang][key]) {
                el.placeholder = translations[currentLang][key];
            }
        });
    };

        const langSelect = document.getElementById('ag-lang-select');
        if (langSelect) {
            langSelect.addEventListener('change', (e) => {
                currentLang = e.target.value;
                applyTranslations();
            });
            window.agSignatures = {}; window.agIsSigned = {};
            applyTranslations(); // initial apply
            initLegalModulesForPax(1);
        }

        

        const typeSelect = document.getElementById('ag-type');
        const cameraSection = document.getElementById('ag-camera-section');
        const form = document.getElementById('ag-booking-form');
        
        
        function getLegalHTML(paxIndex) {
            return `
                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: var(--brand-action); margin-bottom: 0.5rem;"><i class="fas fa-book-open"></i> <span data-i18n="doc1_title">${translations[currentLang]?.doc1_title || '1. Guía de Bienvenida'}</span> (Pasajero ${paxIndex})</h4>
                    <div style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; text-align: left;">
                        <p data-i18n="doc1_desc">${translations[currentLang]?.doc1_desc || 'Conoce todo lo necesario antes de tu salto.'}</p>
                    </div>
                    <button type="button" id="ag-btn-dl-bienvenida-${paxIndex}" style="background: transparent; border: 1px solid #3b82f6; color: var(--brand-action); width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">${translations[currentLang]?.btn_pdf || 'Descargar Documento PDF'}</span>
                    </button>
                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: var(--text-primary); font-weight: bold;">
                        <input type="checkbox" id="ag-chk-bienvenida-${paxIndex}" class="ag-legal-chk" data-pax="${paxIndex}" style="accent-color: #10b981; width: 18px; height: 18px;">
                        <span data-i18n="doc_read_accept">${translations[currentLang]?.doc_read_accept || 'He leído y acepto el documento'}</span>
                    </label>
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: var(--brand-action); margin-bottom: 0.5rem;"><i class="fas fa-file-contract"></i> <span data-i18n="doc2_title">${translations[currentLang]?.doc2_title || '2. Términos y Condiciones'}</span> (Pasajero ${paxIndex})</h4>
                    <button type="button" id="ag-btn-dl-terminos-${paxIndex}" style="background: transparent; border: 1px solid #3b82f6; color: var(--brand-action); width: 100%; padding: 0.75rem; border-radius: 8px; cursor: pointer; margin-bottom: 1rem; transition: background 0.2s;">
                        <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">${translations[currentLang]?.btn_pdf || 'Descargar'}</span>
                    </button>
                    <label style="display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; color: var(--text-primary); font-weight: bold;">
                        <input type="checkbox" id="ag-chk-terminos-${paxIndex}" class="ag-legal-chk" data-pax="${paxIndex}" style="accent-color: #10b981; width: 18px; height: 18px;">
                        <span data-i18n="doc_read_accept">${translations[currentLang]?.doc_read_accept || 'Acepto'}</span>
                    </label>
                </div>



                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 1.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: var(--brand-action); margin-bottom: 0.5rem;"><i class="fas fa-camera"></i> <span data-i18n="selfie_title">${translations[currentLang]?.selfie_title || 'Foto / Selfie'}</span> (Pasajero ${paxIndex})</h4>
                    <input type="file" id="ag-selfie-file-${paxIndex}" class="form-control ag-selfie-input" accept="image/*" capture="user" data-pax="${paxIndex}" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);">
                </div>

                <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; margin-bottom: 2.5rem; text-align: center;">
                    <h4 style="margin-top: 0; color: var(--brand-action); margin-bottom: 0.5rem;"><i class="fas fa-signature"></i> <span data-i18n="sig_title">${translations[currentLang]?.sig_title || 'Firma'}</span> (Pasajero ${paxIndex})</h4>
                    <div style="background: white; border-radius: 8px; overflow: hidden; margin-bottom: 1rem; border: 2px dashed #cbd5e1;">
                        <canvas id="ag-signature-pad-${paxIndex}" style="width: 100%; height: 200px; display: block; touch-action: none;"></canvas>
                    </div>
                    <button type="button" id="ag-btn-clear-sig-${paxIndex}" style="background: transparent; border: 1px solid var(--border-color); color: var(--text-secondary); padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
                        <i class="fas fa-eraser"></i> <span data-i18n="clear">${translations[currentLang]?.clear || 'Limpiar Firma'}</span>
                    </button>
                </div>
            `;
        };

        function initLegalModulesForPax(paxIndex) {
            const container = document.getElementById('ag-legal-container-' + paxIndex);
            if (!container) return;
            container.innerHTML = getLegalHTML(paxIndex);

            // PDF Downloads
            ['bienvenida', 'terminos'].forEach((docId, index) => {
                const btn = document.getElementById(`ag-btn-dl-${docId}-${paxIndex}`);
                if (btn) {
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        const link = document.createElement('a');
                        const suffix = currentLang === 'en' ? '_EN' : '';
                        let filename = '';
                        if (index === 0) filename = '1_bienvenida' + suffix + '.pdf';
                        else if (index === 1) filename = '2_terminos_condiciones' + suffix + '.pdf';
                        let docPath = 'assets/docs/' + filename;
                        const docKey = index === 0 ? 'bienvenida' : 'terminos';
                        const fullKey = docKey + '_' + (typeof currentLang !== 'undefined' && currentLang === 'en' ? 'en' : 'es');
                        const docArr = window.AppData?.legalDocs?.[fullKey];
                        if (docArr && docArr.length > 0 && docArr[docArr.length - 1].dataUrl) {
                            docPath = docArr[docArr.length - 1].dataUrl;
                        }
                        
                        link.href = docPath;
                        link.download = filename;
                        link.click();
                    });
                }
            });

            // Signature Pad Logic
            const canvas = document.getElementById(`ag-signature-pad-${paxIndex}`);
            window.agIsSigned[paxIndex] = false;
            if(canvas) {
                const ctx = canvas.getContext('2d');
                let isDrawing = false;
                const resizeCanvas = () => {
                    const rect = canvas.parentElement.getBoundingClientRect();
                    canvas.width = rect.width || 300;
                    canvas.height = 200;
                };
                window.addEventListener('resize', resizeCanvas);
                resizeCanvas();

                const getPos = (e) => {
                    const rect = canvas.getBoundingClientRect();
                    let clientX = e.clientX, clientY = e.clientY;
                    if (e.touches && e.touches.length > 0) {
                        clientX = e.touches[0].clientX; clientY = e.touches[0].clientY;
                    }
                    return { x: clientX - rect.left, y: clientY - rect.top };
                };

                const startDrawing = (e) => {
                    isDrawing = true; window.agIsSigned[paxIndex] = true; checkFormValid();
                    const pos = getPos(e);
                    ctx.beginPath(); ctx.moveTo(pos.x, pos.y);
                };
                const draw = (e) => {
                    if (!isDrawing) return; e.preventDefault();
                    const pos = getPos(e);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.strokeStyle = '#000'; ctx.lineWidth = 2; ctx.stroke();
                };
                const stopDrawing = () => { isDrawing = false; };

                canvas.addEventListener('mousedown', startDrawing);
                canvas.addEventListener('mousemove', draw);
                canvas.addEventListener('mouseup', stopDrawing);
                canvas.addEventListener('mouseout', stopDrawing);
                canvas.addEventListener('touchstart', startDrawing, {passive: false});
                canvas.addEventListener('touchmove', draw, {passive: false});
                canvas.addEventListener('touchend', stopDrawing);

                document.getElementById(`ag-btn-clear-sig-${paxIndex}`).addEventListener('click', () => {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    window.agIsSigned[paxIndex] = false;
                    checkFormValid();
                });
            }

            // Listeners for validation
            ['bienvenida', 'terminos'].forEach(docId => {
                document.getElementById(`ag-chk-${docId}-${paxIndex}`)?.addEventListener('change', checkFormValid);
            });
            document.getElementById(`ag-selfie-file-${paxIndex}`)?.addEventListener('change', checkFormValid);
        };

        function checkFormValid() {
            const qty = parseInt(document.getElementById('ag-qty')?.value) || 1;
            const btn = document.getElementById('ag-btn-confirm');
            if (!btn) return;
            
            let allValid = true;
            for (let i = 1; i <= qty; i++) {
                const c1 = document.getElementById(`ag-chk-bienvenida-${i}`)?.checked;
                const c2 = document.getElementById(`ag-chk-terminos-${i}`)?.checked;
                const selfieInput = document.getElementById(`ag-selfie-file-${i}`);
                const hasSelfie = selfieInput && selfieInput.files && selfieInput.files.length > 0;
                const signed = window.agIsSigned[i];
                
                if (!(c1 && c2 && hasSelfie && signed)) {
                    allValid = false;
                    break;
                }
            }
            btn.disabled = !allValid;
        };


        // Toggle camera options based on jump type
        typeSelect.addEventListener('change', (e) => {
            if (e.target.value === 'Salto Tandem') {
                cameraSection.style.display = 'block';
            } else {
                cameraSection.style.display = 'none';
                document.querySelectorAll('.ag-cam-opt').forEach(chk => chk.checked = false);
            }
        });

        // Formatter Fix
        const formatCurrency = (num) => '$' + parseInt(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        const parseCurrency = (str) => parseInt(str.toString().replace(/\D/g, '')) || 0;

        // Load Prices from Maestro
        const maestro = window.AppData?.maestroValores || [];
        let prices = {
            base: 0,
            gopro: 0,
            cam360: 0,
            ext: 0
        };
        
        const goproItem = maestro.find(x => x.name === 'Cámara Go-Pro');
        if (goproItem && goproItem.price) {
            prices.gopro = parseCurrency(goproItem.price);
            document.getElementById('lbl-gopro-val').textContent = formatCurrency(prices.gopro);
        }
        
        const c360Item = maestro.find(x => x.name === 'Cámara 360');
        if (c360Item && c360Item.price) {
            prices.cam360 = parseCurrency(c360Item.price);
            document.getElementById('lbl-360-val').textContent = formatCurrency(prices.cam360);
        }
        
        const extItem = maestro.find(x => x.name === 'Cámara Externa');
        if (extItem && extItem.price) {
            prices.ext = parseCurrency(extItem.price);
            document.getElementById('lbl-ext-val').textContent = formatCurrency(prices.ext);
        }

        // Modify Select Option to include Tandem price
        const tandemItem = maestro.find(x => x.name === 'Salto Tandem' || x.name === 'Honorario Salto Tandem' || x.name.includes('Tandem'));
        if (tandemItem && tandemItem.price) {
            prices.base = parseCurrency(tandemItem.price);
            typeSelect.options[0].textContent = `Salto Tándem - ${formatCurrency(prices.base)}`;
        }

        function calculateLiveTotal() {
            const qtyInput = document.getElementById('ag-qty');
            if (!qtyInput) return;
            const qty = parseInt(qtyInput.value) || 1;
            
            // Render extra passenger fields
            const container = document.getElementById('ag-group-container');
            const note = document.getElementById('ag-group-note');
            
            if (container && note) {
                if (qty > 1) {
                    note.style.display = 'block';
                    if (container.dataset.qty !== String(qty)) {
                        let html = '';
                        for (let i = 2; i <= qty; i++) {
                            html += `
                                <h4 style="color: var(--brand-action); font-size: 1rem; margin-top: 1rem; margin-bottom: 1rem; border-top: 1px dashed var(--border-color); padding-top: 1rem;"><i class="fas fa-user-plus"></i> Pasajero ${i}</h4>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;">Nombre</label>
                                        <input type="text" id="ag-fname-${i}" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;">Apellido</label>
                                        <input type="text" id="ag-lname-${i}" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;">Documento / Pasaporte</label>
                                        <input type="text" id="ag-doc-${i}" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;">Teléfono / WhatsApp</label>
                                        <input type="text" id="ag-phone-${i}" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                </div>
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.5rem;">
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;">Correo Electrónico</label>
                                        <input type="email" id="ag-email-${i}" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" placeholder="ejemplo@correo.com" required>
                                    </div>
                                    <div class="form-group" style="margin-bottom: 0;">
                                        <label style="color: var(--text-secondary); font-size: 0.9rem;">Peso (KG)</label>
                                        <input type="number" id="ag-weight-${i}" class="form-control" style="background: var(--bg-surface); border: 1px solid var(--border-color); color: var(--text-primary);" required>
                                    </div>
                                </div>
                                <div class="ag-cam-section-extra" style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem; display: ${document.getElementById('ag-type').value === 'Salto Tandem' ? 'block' : 'none'};">
                                    <label style="color: var(--text-secondary); font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; display: block;">Adicionales Pasajero ${i}</label>
                                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-color);">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="${i}" value="Cámara Go-Pro" style="accent-color: var(--brand-action); width: 16px; height: 16px;">
                                                <span style="color: var(--text-primary); font-size: 0.85rem;">Cámara Go-Pro</span>
                                            </div>
                                            <strong style="color: var(--brand-success); font-size: 0.85rem;">${formatCurrency(prices.gopro)}</strong>
                                        </label>
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--border-color);">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="${i}" value="Cámara 360" style="accent-color: var(--brand-action); width: 16px; height: 16px;">
                                                <span style="color: var(--text-primary); font-size: 0.85rem;">Cámara 360°</span>
                                            </div>
                                            <strong style="color: var(--brand-success); font-size: 0.85rem;">${formatCurrency(prices.cam360)}</strong>
                                        </label>
                                        <label style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                                <input type="checkbox" class="ag-cam-opt" data-pax="${i}" value="Cámara Externa" style="accent-color: var(--brand-action); width: 16px; height: 16px;">
                                                <span style="color: var(--text-primary); font-size: 0.85rem;">Cámara Externa</span>
                                            </div>
                                            <strong style="color: var(--brand-success); font-size: 0.85rem;">${formatCurrency(prices.ext)}</strong>
                                        </label>
                                    </div>
                                </div>
                                <div id="ag-legal-container-${i}"></div>
                            `;
                        }
                        container.innerHTML = html;
                        container.dataset.qty = qty;
                        for (let i = 2; i <= qty; i++) {
                            initLegalModulesForPax(i);
                        }

                        // Rebind listeners to new checkboxes
                        document.querySelectorAll('.ag-cam-opt').forEach(chk => {
                            chk.removeEventListener('change', calculateLiveTotal);
                            chk.addEventListener('change', calculateLiveTotal);
                        });
                    }
                } else {
                    note.style.display = 'none';
                    if (container.dataset.qty !== "1") {
                        container.innerHTML = '';
                        container.dataset.qty = 1;
                    }
                }
            }

            let grandTotal = prices.base * qty;
            document.querySelectorAll('.ag-cam-opt:checked').forEach(chk => {
                if (chk.value === 'Cámara Go-Pro') grandTotal += prices.gopro;
                if (chk.value === 'Cámara 360') grandTotal += prices.cam360;
                if (chk.value === 'Cámara Externa') grandTotal += prices.ext;
            });
            
            const totalValEl = document.getElementById('ag-total-val');
            if(totalValEl) totalValEl.textContent = formatCurrency(grandTotal);
            
            const totalDetEl = document.getElementById('ag-total-detail');
            if (totalDetEl) {
                totalDetEl.textContent = `Total para ${qty} persona(s)`;
            }
            checkFormValid();
        }

        document.getElementById('ag-qty').addEventListener('input', calculateLiveTotal);
        document.querySelectorAll('.ag-cam-opt').forEach(chk => {
            chk.addEventListener('change', calculateLiveTotal);
        });
        
        calculateLiveTotal();

        // Set min date to today
        const dateInput = document.getElementById('ag-date');
        const submitBtn = document.querySelector('#ag-booking-form button[type="submit"]');
        const today = new Date();
        today.setHours(0,0,0,0);
        
        let calCurrentDate = new Date(today.getFullYear(), today.getMonth(), 1);
        
        function formatToYYYYMMDD(dateObj) {
            const yyyy = dateObj.getFullYear();
            const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
            const dd = String(dateObj.getDate()).padStart(2, '0');
            return `${yyyy}-${mm}-${dd}`;
        }
        
        function isNoOpDay(dateObj) {
            if (!window.AppData || !window.AppData.noOpRules) return false;
            const rules = window.AppData.noOpRules;
            const dayIndex = String(dateObj.getDay());
            const dateStr = formatToYYYYMMDD(dateObj);
            
            if (rules.exceptions && rules.exceptions.includes(dateStr)) return false;
            if (rules.daysOfWeek && rules.daysOfWeek.includes(dayIndex)) return true;
            if (rules.specificDates && rules.specificDates.includes(dateStr)) return true;
            return false;
        }

        const checkAvailability = (d) => {
            if (!d) return { available: 0, total: 0, status: 'none' };
            window.AppData = window.AppData || {};
            const paxs = window.AppData.passengers || [];
            const asignaciones = window.AppData.asignacionFlota || [];
            const aeronaves = window.AppData.aeronaves || [];

            const dayAssignments = asignaciones.filter(a => a.fecha === d && a.estado !== 'Cancelado');
            const dayPaxs = paxs.filter(p => p.date === d && p.paxStatus !== 'Cancelado / Cancelled');

            let totalCapacity = 0;
            dayAssignments.forEach(asg => {
                const plane = aeronaves.find(a => a.id === asg.id_aeronave);
                if (plane) {
                    totalCapacity += parseInt(plane.capacidad || plane.capFun || plane.capTan || 0, 10);
                }
            });

            let booked = 0;
            dayPaxs.forEach(p => {
                if (p.type === 'Tandem' || p.type === 'Salto Tandem') {
                    booked += 2;
                } else {
                    booked += 1;
                }
            });
            const available = totalCapacity - booked;
            
            if (totalCapacity === 0) return { available: 0, total: 0, status: 'no_flights' };
            if (available <= 0) return { available, total: totalCapacity, status: 'full' };
            return { available, total: totalCapacity, status: 'available' };
        };

        function renderAgCalendar() {
            const year = calCurrentDate.getFullYear();
            const month = calCurrentDate.getMonth();
            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            
            document.getElementById('ag-cal-month').textContent = `${monthNames[month]} ${year}`;
            
            const grid = document.getElementById('ag-cal-grid');
            grid.innerHTML = '';
            
            const firstDay = new Date(year, month, 1).getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                grid.appendChild(empty);
            }
            
            for (let i = 1; i <= daysInMonth; i++) {
                const dDate = new Date(year, month, i);
                const dStr = formatToYYYYMMDD(dDate);
                const isPast = dDate < today;
                const isNoOp = isNoOpDay(dDate);
                
                const cell = document.createElement('div');
                cell.style.aspectRatio = '1';
                cell.style.borderRadius = '8px';
                cell.style.display = 'flex';
                cell.style.flexDirection = 'column';
                cell.style.alignItems = 'center';
                cell.style.justifyContent = 'center';
                cell.style.fontSize = '0.95rem';
                cell.style.cursor = 'pointer';
                cell.style.transition = 'all 0.2s';
                cell.style.position = 'relative';
                
                let bgColor = 'transparent';
                let color = 'white';
                let availHtml = '';
                
                if (isPast || isNoOp) {
                    color = '#475569';
                    cell.style.cursor = 'not-allowed';
                    if (isNoOp && !isPast) {
                        availHtml = `<div style="font-size: 0.55rem; color: #ef4444; margin-top: 2px;">Cerrado</div>`;
                    }
                } else {
                    const avail = checkAvailability(dStr);
                    if (avail.status === 'no_flights' || avail.status === 'full') {
                        color = '#94a3b8';
                        availHtml = `<div style="width: 4px; height: 4px; border-radius: 50%; background: #ef4444; margin-top: 4px;"></div>`;
                    } else if (avail.status === 'available') {
                        bgColor = 'rgba(59, 130, 246, 0.15)';
                        color = '#60a5fa';
                        availHtml = `<div style="width: 4px; height: 4px; border-radius: 50%; background: #10b981; margin-top: 4px;"></div>`;
                    }
                    
                    cell.onmouseover = () => { if (dateInput.value !== dStr) cell.style.background = 'var(--border-color)'; };
                    cell.onmouseout = () => { if (dateInput.value !== dStr) cell.style.background = bgColor; };
                    
                    cell.addEventListener('click', () => {
                        dateInput.value = dStr;
                        renderAgCalendar();
                        updateAvailabilityInfo(dStr, avail);
                    });
                }
                
                if (dateInput.value === dStr) {
                    bgColor = '#3b82f6';
                    color = 'white';
                    cell.style.fontWeight = 'bold';
                    cell.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.4)';
                }
                
                cell.style.background = bgColor;
                cell.style.color = color;
                cell.innerHTML = `<span>${i}</span>${availHtml}`;
                
                grid.appendChild(cell);
            }
        }
        
        function updateAvailabilityInfo(dStr, avail) {
            const availInfo = document.getElementById('ag-availability-info');
            availInfo.style.display = 'block';

            if (avail.status === 'no_flights') {
                availInfo.style.background = 'rgba(239, 68, 68, 0.1)';
                availInfo.style.border = '1px solid #ef4444';
                availInfo.innerHTML = '<span style="color: #ef4444; font-weight: bold;"><i class="fas fa-exclamation-circle"></i> Lo sentimos, no hay vuelos programados para esta fecha.</span>';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
            } else if (avail.status === 'full') {
                availInfo.style.background = 'rgba(239, 68, 68, 0.1)';
                availInfo.style.border = '1px solid #ef4444';
                availInfo.innerHTML = '<span style="color: #ef4444; font-weight: bold;"><i class="fas fa-times-circle"></i> Agotado. No hay cupos disponibles.</span>';
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.5';
                submitBtn.style.cursor = 'not-allowed';
            } else {
                availInfo.style.background = 'rgba(16, 185, 129, 0.1)';
                availInfo.style.border = '1px solid #10b981';
                availInfo.innerHTML = `<span style="color: #10b981; font-weight: bold;"><i class="fas fa-check-circle"></i> ¡Excelente! Tenemos ${avail.available} cupos disponibles para el ${dStr}.</span>`;
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.style.cursor = 'pointer';
            }
        }

        document.getElementById('ag-cal-prev').addEventListener('click', () => {
            calCurrentDate.setMonth(calCurrentDate.getMonth() - 1);
            renderAgCalendar();
        });
        document.getElementById('ag-cal-next').addEventListener('click', () => {
            calCurrentDate.setMonth(calCurrentDate.getMonth() + 1);
            renderAgCalendar();
        });
        
        renderAgCalendar();
        
        if (dateInput) {
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }

        // Submit form
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btnFinish = document.getElementById('ag-btn-confirm');

                const fName = document.getElementById('ag-fname').value.trim();
                const lName = document.getElementById('ag-lname').value.trim();
                const name = `${fName} ${lName}`.trim();
                const doc = document.getElementById('ag-doc').value.trim();
                const phone = document.getElementById('ag-phone').value.trim();
                const weight = parseFloat(document.getElementById('ag-weight').value);
                const date = document.getElementById('ag-date').value;
                const type = document.getElementById('ag-type').value;
                const qty = parseInt(document.getElementById('ag-qty').value) || 1;
                const emailMain = document.getElementById('ag-email').value.trim();

                if (qty > 1) {
                    const understood = document.getElementById('ag-group-understand');
                    if (understood && !understood.checked) {
                        alert("Debes marcar la casilla '¡Entendido! ✅' en la sección de Procedimiento para Reservas de Grupos.");
                        return;
                    }
                }

                // Pre-validate all passengers before disabling button or generating PDFs
                const paxDrafts = [];
                for (let i = 1; i <= qty; i++) {
                    let pName, pDoc, pPhone, pEmail, pWeight;
                    if (i === 1) {
                        pName = name;
                        pDoc = doc;
                        pPhone = phone;
                        pEmail = emailMain;
                        pWeight = weight;
                    } else {
                        const cfName = (document.getElementById(`ag-fname-${i}`)?.value || '').trim();
                        const clName = (document.getElementById(`ag-lname-${i}`)?.value || '').trim();
                        pName = `${cfName} ${clName}`.trim();
                        pDoc = (document.getElementById(`ag-doc-${i}`)?.value || '').trim();
                        pPhone = (document.getElementById(`ag-phone-${i}`)?.value || '').trim();
                        pEmail = (document.getElementById(`ag-email-${i}`)?.value || '').trim();
                        pWeight = parseFloat(document.getElementById(`ag-weight-${i}`)?.value);
                    }

                    if (pWeight > 100) {
                        alert(`El pasajero ${pName} supera el peso máximo permitido (100 kg) por razones operativas y de seguridad.`);
                        return;
                    }
                    if (pWeight < 30 || isNaN(pWeight)) {
                        alert(`El pasajero ${pName} no cumple con el peso mínimo requerido (30 kg).`);
                        return;
                    }

                    let cams = [];
                    if (type === 'Salto Tandem') {
                        document.querySelectorAll(`.ag-cam-opt[data-pax="${i}"]:checked`).forEach(chk => {
                            cams.push(chk.value);
                        });
                    }
                    const sigCanvas = document.getElementById('ag-signature-pad-' + i);
                    const sigDataUrl = (sigCanvas && typeof sigCanvas.toDataURL === 'function') ? sigCanvas.toDataURL('image/png') : null;

                    paxDrafts.push({ i, pName, pDoc, pPhone, pEmail, pWeight, cams, sigDataUrl });
                }

                btnFinish.disabled = true;
                btnFinish.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + (translations[currentLang]?.alert_processing || 'Procesando...');

                try {
                    const getDocVersion = (docKey) => {
                        const actualDocKey = docKey === 'guia' ? 'bienvenida' : docKey;
                        const fullKey = actualDocKey + '_' + (typeof currentLang !== 'undefined' && currentLang === 'en' ? 'en' : 'es');
                        const docArr = window.AppData?.legalDocs?.[fullKey];
                        return (docArr && docArr.length > 0) ? docArr[docArr.length - 1].version : 1;
                    };

                    window.AppData = window.AppData || {};
                    window.AppData.passengers = window.AppData.passengers || [];

                    const tariffSnapshot = window.TariffGuard ? window.TariffGuard.buildTariffSnapshot() : null;
                    const createdAtIso = new Date().toISOString();
                    for (const draft of paxDrafts) {
                        const baseJumpPrice = window.TariffGuard
                            ? window.TariffGuard.getPriceForRecord({ tariffSnapshot }, window.TariffGuard.resolveJumpTypeItemName(type, tariffSnapshot?.items))
                            : (prices.base || 0);
                        const newPax = {
                            id: 'pax_' + Date.now() + '_' + draft.i,
                            createdAt: createdAtIso,
                            tariffSnapshot,
                            name: draft.pName,
                            doc: draft.pDoc,
                            phone: draft.pPhone,
                            email: draft.pEmail,
                            weight: draft.pWeight,
                            type,
                            date,
                            cams: draft.cams.length > 0 ? draft.cams.join(', ') : 'Ninguna',
                            time: 'Por Asignar',
                            paxStatus: 'Pendiente Check-in',
                            flightStatus: 'En Espera',
                            waiverSigned: true,
                            signature: draft.sigDataUrl,
                            selfie: (window.agTempSelfies && window.agTempSelfies[draft.i]) ? window.agTempSelfies[draft.i] : null,
                            instructor: 'Sin asignar',
                            aeronave: 'Sin asignar',
                            financiera: {
                                manualPrice: baseJumpPrice,
                                discount: 0,
                                totalPaid: 0
                            },
                            acceptedDocs: {
                                date: new Date().toISOString(),
                                versions: {
                                    guia: getDocVersion('guia'),
                                    terminos: getDocVersion('terminos'),
                                    ficha: getDocVersion('ficha'),
                                    exoneracion: getDocVersion('exoneracion')
                                }
                            }
                        };

                        if (window.LegalDocsHelper && typeof window.LegalDocsHelper.generateAllSignedLegalDocs === 'function') {
                            try {
                                newPax.signedLegalDocs = await window.LegalDocsHelper.generateAllSignedLegalDocs(newPax, currentLang);
                            } catch (pdfErr) {
                                console.warn('Could not embed PDFs in autogestion:', pdfErr);
                            }
                        }

                        window.AppData.passengers.push(newPax);
                    }

                    if (window.saveAppData) window.saveAppData();

                    // Success feedback
                    form.innerHTML = `
                        <div style="text-align: center; padding: 3rem 1rem; animation: fadeDown 0.5s ease-out;">
                            <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.2); color: #10b981; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 2.5rem; margin: 0 auto 1.5rem auto;">
                                <i class="fas fa-check"></i>
                            </div>
                            <h3 style="color: var(--text-primary); font-size: 1.5rem; margin-bottom: 1rem;">¡Reserva Confirmada!</h3>
                            <p style="color: var(--text-secondary); font-size: 1rem; margin-bottom: 2rem;">
                                Hola ${escapeHTML(name)}, tu reserva para el ${escapeHTML(date)} ha sido pre-registrada con éxito${qty > 1 ? ` para ${qty} personas` : ''}.<br><br>
                                <span style="color: var(--text-primary); font-weight: bold;">
                                    <i class="fas fa-envelope-open-text"></i> Hemos enviado un enlace a los correos electrónicos registrados para ingresar al Portal Cliente (B2C) y completar la firma y el registro de la Ficha Informativa y Exoneración de Responsabilidad.
                                </span>
                            </p>
                            <button onclick="window.location.reload()" class="btn" style="background: transparent; border: 1px solid #3b82f6; color: var(--brand-action); padding: 0.8rem 2rem; border-radius: 30px; font-weight: bold; cursor: pointer; transition: all 0.2s;">Hacer Otra Reserva</button>
                        </div>
                    `;
                } catch (err) {
                    console.error(err);
                    alert(translations[currentLang]?.alert_error || 'Error al procesar los PDFs.');
                    btnFinish.disabled = false;
                    btnFinish.innerHTML = translations[currentLang]?.btn_confirm || 'Confirmar Reserva';
                }
            });
        }
    }
};
