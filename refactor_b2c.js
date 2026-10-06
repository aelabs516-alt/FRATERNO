const fs = require('fs');

const renderContent = `
    render: (container) => {
        container.innerHTML = \`
            <style>
                .b2c-view {
                    --b2c-accent: var(--brand-action);
                    --b2c-glass-bg: var(--glass-bg);
                    --b2c-border: var(--border-color);
                    --b2c-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.05);
                    font-family: 'Inter', sans-serif;
                }
                .dark-mode .b2c-view {
                    --b2c-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
                }
                .b2c-glass-card {
                    background: var(--b2c-glass-bg);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid var(--b2c-border);
                    border-radius: 16px;
                    padding: 2rem;
                    margin-bottom: 1.5rem;
                    box-shadow: var(--b2c-shadow);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .b2c-glass-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.1);
                }
                .floating-group {
                    position: relative;
                    margin-bottom: 1.5rem;
                }
                .floating-group input, .floating-group select, .floating-group textarea {
                    width: 100%;
                    padding: 1.4rem 1rem 0.6rem 1rem;
                    background: var(--bg-surface-hover);
                    border: 1px solid var(--border-color);
                    border-radius: 12px;
                    color: var(--text-primary);
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                .floating-group input:focus, .floating-group select:focus, .floating-group textarea:focus {
                    border-color: var(--b2c-accent);
                    outline: none;
                    box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.2);
                    background: var(--bg-surface);
                }
                .floating-group label {
                    position: absolute;
                    top: 50%;
                    left: 1rem;
                    transform: translateY(-50%);
                    font-size: 1rem;
                    color: var(--text-secondary);
                    pointer-events: none;
                    transition: all 0.2s ease-out;
                    margin: 0;
                }
                .floating-group input:focus ~ label,
                .floating-group input:not(:placeholder-shown) ~ label,
                .floating-group select ~ label,
                .floating-group textarea:focus ~ label,
                .floating-group textarea:not(:placeholder-shown) ~ label {
                    top: 0.5rem;
                    transform: translateY(0);
                    font-size: 0.75rem;
                    color: var(--b2c-accent);
                    font-weight: 600;
                }
                .floating-group input:disabled, .floating-group select:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    background: var(--bg-surface-hover);
                }
                .step-container {
                    animation: slideUpFade 0.5s ease-out forwards;
                }
                @keyframes slideUpFade {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .b2c-btn-glow {
                    padding: 1rem 2rem;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 0.5rem;
                }
                .b2c-btn-glow.primary {
                    background: linear-gradient(135deg, var(--brand-action), #0284c7);
                    color: white;
                    box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3);
                }
                .b2c-btn-glow.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4);
                }
                .b2c-btn-glow.success {
                    background: linear-gradient(135deg, var(--brand-success), #059669);
                    color: white;
                    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
                }
                .b2c-btn-glow.success:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
                }
                .legal-card {
                    border: 1px solid var(--border-color);
                    background: var(--bg-surface-hover);
                    border-radius: 12px;
                    padding: 1.5rem;
                    margin-bottom: 1rem;
                    transition: all 0.3s ease;
                    display: flex;
                    flex-direction: column;
                }
                .legal-card:hover {
                    border-color: var(--b2c-accent);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .legal-card-header {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    margin-bottom: 0.5rem;
                }
                .legal-card-header h4 { margin: 0; font-size: 1.1rem; color: var(--text-primary); }
                .legal-card-header i { font-size: 1.5rem; color: var(--b2c-accent); }
                .legal-card p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5; }
                .legal-card .actions {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                    background: var(--bg-surface);
                    padding: 1rem;
                    border-radius: 8px;
                }
                .custom-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    font-weight: 600;
                    color: var(--text-primary);
                }
                .custom-checkbox input {
                    width: 24px; height: 24px;
                    accent-color: var(--brand-success);
                    cursor: pointer;
                }
                .btn-download {
                    background: transparent;
                    border: 1px solid var(--b2c-accent);
                    color: var(--b2c-accent);
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-weight: 600;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    cursor: pointer;
                }
                .btn-download:hover {
                    background: var(--b2c-accent);
                    color: white;
                }
            </style>
            
            <div class="b2c-view" style="position: relative; max-width: 800px; margin: 0 auto; padding: 1rem;">
                <div style="position: absolute; top: 0; right: 1rem; z-index: 10;">
                    <select id="lang-selector" class="form-control" style="background: var(--glass-bg); backdrop-filter: blur(8px); border-radius: 20px; padding: 0.5rem 1rem; font-weight: 600; border: 1px solid var(--border-color);">
                        <option value="es">🇪🇸 Español</option>
                        <option value="en">🇺🇸 English</option>
                    </select>
                </div>

                <div class="b2c-header step-container" style="text-align: center; margin-bottom: 3rem; margin-top: 2rem;">
                    <div class="logo" style="display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; font-style: italic; font-weight: 900; font-size: 3rem; color: var(--text-primary); letter-spacing: -1.5px; margin-bottom: 3px;">
                            FRAT
                            <div style="display: flex; flex-direction: column; gap: 4px; margin: 0 6px; transform: skewX(-15deg);">
                                <div style="width: 35px; height: 12px; background: #45dcf8; border-radius: 8px 16px 8px 16px; box-shadow: 0 0 10px rgba(69,220,248,0.5);"></div>
                                <div style="width: 35px; height: 12px; background: #45dcf8; border-radius: 8px 16px 8px 16px; box-shadow: 0 0 10px rgba(69,220,248,0.5);"></div>
                                <div style="width: 35px; height: 12px; background: #45dcf8; border-radius: 8px 16px 8px 16px; box-shadow: 0 0 10px rgba(69,220,248,0.5);"></div>
                            </div>
                            RNO
                        </div>
                        <div style="font-size: 1rem; color: var(--text-secondary); letter-spacing: 6px; font-weight: 600;">PARACAIDISMO</div>
                    </div>
                    <h2 data-i18n="title" style="font-size: 2rem; font-weight: 800; background: linear-gradient(90deg, var(--text-primary), var(--b2c-accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Completa tu Registro</h2>
                    <p style="color: var(--text-secondary); font-size: 1.1rem; margin-top: 0.5rem;" data-i18n="subtitle">Verifica tu identidad y completa los datos de tu salto.</p>
                </div>

                <div id="auth-step" class="b2c-glass-card step-container" style="max-width: 500px; margin: 0 auto;">
                    <div style="text-align: center; margin-bottom: 2rem;">
                        <div style="width: 64px; height: 64px; background: rgba(2, 132, 199, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem auto; color: var(--b2c-accent); font-size: 2rem;">
                            <i class="fas fa-id-card"></i>
                        </div>
                        <p style="color: var(--text-secondary); font-size: 1.05rem;" data-i18n="auth_msg">Ingresa tu documento de identidad para recibir un Token OTP.</p>
                    </div>
                    <div class="floating-group">
                        <input type="text" id="b2c-doc" placeholder=" " data-i18n-ph="doc_placeholder" style="text-align: center; font-size: 1.2rem; font-weight: 600; letter-spacing: 2px;">
                        <label data-i18n="p_doc_label" style="left: 50%; transform: translateX(-50%) translateY(-50%);">Documento de Identidad</label>
                    </div>
                    <button id="btn-send-otp" class="b2c-btn-glow primary" style="width: 100%;" data-i18n="btn_otp">
                        <i class="fas fa-paper-plane"></i> Solicitar Código
                    </button>
                    
                    <div id="otp-container" style="display: none; margin-top: 2rem; padding-top: 2rem; border-top: 1px dashed var(--border-color);">
                        <p style="text-align: center; color: var(--text-secondary); margin-bottom: 1rem; font-weight: 600;">Ingresa el código OTP recibido</p>
                        <div class="floating-group">
                            <input type="text" id="b2c-otp" placeholder=" " style="text-align: center; font-size: 2rem; letter-spacing: 1rem; font-weight: 700;" maxlength="6">
                            <label style="left: 50%; transform: translateX(-50%) translateY(-50%);">Código OTP</label>
                        </div>
                        <button id="btn-verify-otp" class="b2c-btn-glow success" style="width: 100%;" data-i18n="btn_verify">
                            <i class="fas fa-check-circle"></i> Verificar
                        </button>
                    </div>
                </div>

                <div id="form-step" style="display: none;" class="step-container">
                    
                    <div class="b2c-glass-card">
                        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); margin-bottom: 1.5rem;"><i class="fas fa-user-circle" style="color: var(--b2c-accent);"></i> <span data-i18n="personal_data">Datos Personales</span></h3>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="floating-group">
                                <input type="text" id="b2c-fname" placeholder=" " disabled>
                                <label data-i18n="p_name">Nombre</label>
                            </div>
                            <div class="floating-group">
                                <input type="text" id="b2c-lname" placeholder=" " disabled>
                                <label data-i18n="p_lastname">Apellido</label>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="floating-group">
                                <input type="text" id="b2c-doc-filled" placeholder=" " disabled>
                                <label data-i18n="p_doc_label">Documento</label>
                            </div>
                            <div class="floating-group">
                                <input type="date" class="form-control" value="2026-07-15" disabled style="padding: 1.4rem 1rem 0.6rem 1rem;">
                                <label data-i18n="jump_date" style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">Fecha de Salto</label>
                            </div>
                        </div>

                        <div class="floating-group">
                            <input type="number" step="0.1" id="weight-input" placeholder=" ">
                            <label data-i18n="weight">Peso (Kg)</label>
                        </div>
                        <div id="weight-alert" class="alert alert-warning" style="display:none; margin-top: -1rem; margin-bottom: 1.5rem; border-radius: 8px;"></div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
                            <div class="floating-group" style="margin: 0;">
                                <select id="loc-country" style="padding-top: 1.4rem;">
                                    <option value="" disabled selected></option>
                                </select>
                                <label data-i18n="location" style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">País</label>
                            </div>
                            <div class="floating-group" style="margin: 0;">
                                <select id="loc-state" style="padding-top: 1.4rem;">
                                    <option value="" disabled selected></option>
                                </select>
                                <label style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">Estado/Depto</label>
                            </div>
                            <div class="floating-group" style="margin: 0;">
                                <select id="loc-city" style="padding-top: 1.4rem;">
                                    <option value="" disabled selected></option>
                                </select>
                                <label style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">Ciudad</label>
                            </div>
                        </div>
                        
                        <div class="floating-group">
                            <input type="text" placeholder=" " class="form-control" id="b2c-address">
                            <label data-i18n="address">Dirección de Residencia</label>
                        </div>
                        
                        <div class="floating-group">
                            <select id="b2c-occupation" style="padding-top: 1.4rem;">
                                <option value="" disabled selected></option>
                                <option value="Estudiante" data-i18n="occ_student">Estudiante</option>
                                <option value="Empleado" data-i18n="occ_employee">Empleado</option>
                                <option value="Independiente" data-i18n="occ_independent">Independiente</option>
                                <option value="Empresario" data-i18n="occ_business">Empresario</option>
                                <option value="Otro" data-i18n="occ_other">Otro</option>
                            </select>
                            <label data-i18n="occupation" style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">¿Cuál es tu ocupación?</label>
                        </div>
                        <div class="floating-group" id="occ-other-group" style="display:none;">
                            <input type="text" id="b2c-occ-other" placeholder=" " data-i18n-ph="occ_other_ph">
                            <label>Especifica tu profesión</label>
                        </div>

                        <div class="floating-group">
                            <input type="text" id="b2c-activities" placeholder=" " data-i18n-ph="fav_activities_ph">
                            <label data-i18n="fav_activities">¿Cuáles son tus actividades favoritas?</label>
                        </div>

                        <div class="floating-group">
                            <select id="contact-method" style="padding-top: 1.4rem;">
                                <option value="" disabled selected></option>
                                <option>Instagram</option>
                                <option>Facebook</option>
                                <option data-i18n="opt_friend">Amigo/Familiar</option>
                                <option>Tiktok</option>
                                <option value="asesor" data-i18n="opt_advisor">Asesor de Ventas</option>
                            </select>
                            <label data-i18n="how_found" style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">¿Cómo nos conociste?</label>
                        </div>

                        <div class="floating-group" id="asesor-container" style="display: none;">
                            <select id="b2c-advisor" style="padding-top: 1.4rem;">
                                <option value="" disabled selected></option>
                                <option>Pedro S.</option>
                                <option>María V.</option>
                                <option>Carlos G.</option>
                            </select>
                            <label data-i18n="advisor_name" style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">Nombre de tu Asesor</label>
                        </div>
                    </div>

                    <div class="b2c-glass-card">
                        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); margin-bottom: 0.5rem;"><i class="fas fa-file-invoice-dollar" style="color: var(--b2c-accent);"></i> <span data-i18n="payment_support">Soporte de Pago</span></h3>
                        <p style="color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 1.5rem;" data-i18n="payment_msg">
                            Por favor, envía el comprobante de pago al WhatsApp 302 338 1129.
                        </p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="floating-group">
                                <input type="date" class="form-control" style="padding: 1.4rem 1rem 0.6rem 1rem;">
                                <label data-i18n="payment_date" style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">Fecha de pago</label>
                            </div>
                            <div class="floating-group">
                                <select class="form-control" style="padding-top: 1.4rem;">
                                    <option value="" disabled selected></option>
                                    <option data-i18n="pm_transfer">Transferencia Bancaria</option>
                                    <option data-i18n="pm_credit">Tarjeta de Crédito</option>
                                    <option>QR</option>
                                    <option>Llave Bre-B</option>
                                </select>
                                <label data-i18n="payment_method" style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">Medio de Pago</label>
                            </div>
                        </div>
                        <div class="floating-group">
                            <input type="file" class="form-control" accept="image/*,.pdf" style="padding: 1.4rem 1rem 0.6rem 1rem;">
                            <label data-i18n="payment_file" style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">Comprobante (Imagen/PDF)</label>
                        </div>
                    </div>

                    <div class="b2c-glass-card" style="border: 2px solid var(--brand-success); background: rgba(16, 185, 129, 0.05);">
                        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: var(--brand-success); margin-bottom: 0.5rem;"><i class="fas fa-users"></i> <span data-i18n="group_title">Reservas de Grupos</span></h3>
                        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.5rem;" data-i18n="group_desc">
                            Los registros se vinculan al correo del líder. Por logística no se garantiza el salto simultáneo con tus acompañantes.
                        </p>
                        <label class="custom-checkbox">
                            <input type="checkbox">
                            <span data-i18n="btn_understood">¡Entendido! ✅</span>
                        </label>
                    </div>

                    <div class="b2c-glass-card" style="border: 2px solid var(--brand-success); background: rgba(16, 185, 129, 0.05);">
                        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: var(--brand-success); margin-bottom: 0.5rem;"><i class="fas fa-heartbeat"></i> <span data-i18n="medical_title">Condiciones Médicas</span></h3>
                        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.5rem;" data-i18n="medical_desc">
                            Declaro estar en buenas condiciones de salud.
                        </p>
                        <div class="floating-group">
                            <textarea class="form-control" placeholder=" " data-i18n-ph="medical_ph" rows="2" style="resize: none;"></textarea>
                            <label>Especificaciones de salud (opcional)</label>
                        </div>
                        <label class="custom-checkbox">
                            <input type="checkbox">
                            <span data-i18n="btn_understood2">¡Entendido! ✅</span>
                        </label>
                    </div>

                    <div class="b2c-glass-card">
                        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); margin-bottom: 1.5rem;"><i class="fas fa-file-signature" style="color: var(--b2c-accent);"></i> Aceptación Legal</h3>
                        
                        <!-- 1. Guía de Bienvenida -->
                        <div class="legal-card">
                            <div class="legal-card-header">
                                <i class="fas fa-book-open"></i>
                                <h4 data-i18n="doc1_title">1. Guía de Bienvenida</h4>
                            </div>
                            <p data-i18n="doc1_desc">Conoce todo lo necesario antes de tu salto. Información general y recomendaciones clave.</p>
                            <div class="actions">
                                <button id="btn-dl-bienvenida" class="btn-download">
                                    <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar PDF</span>
                                </button>
                                <label class="custom-checkbox">
                                    <input type="checkbox" id="chk-bienvenida" class="req-check">
                                    <span data-i18n="doc_read_accept">He leído y acepto el documento</span>
                                </label>
                            </div>
                        </div>

                        <!-- 2. Términos y Condiciones -->
                        <div class="legal-card">
                            <div class="legal-card-header">
                                <i class="fas fa-file-contract"></i>
                                <h4 data-i18n="doc2_title">2. Términos y Condiciones de la Operación</h4>
                            </div>
                            <p data-i18n="doc2_desc">Regulaciones operativas, políticas de reagendamiento y condiciones del servicio.</p>
                            <div class="actions">
                                <button id="btn-dl-terminos" class="btn-download">
                                    <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar PDF</span>
                                </button>
                                <label class="custom-checkbox">
                                    <input type="checkbox" id="chk-terminos" class="req-check">
                                    <span data-i18n="doc_read_accept">He leído y acepto el documento</span>
                                </label>
                            </div>
                        </div>

                        <!-- 3. Ficha Informativa -->
                        <div class="legal-card">
                            <div class="legal-card-header">
                                <i class="fas fa-info-circle"></i>
                                <h4 data-i18n="doc3_title">3. Ficha Informativa</h4>
                            </div>
                            <p data-i18n="doc3_desc">Información detallada sobre el equipo, seguridad y desarrollo de la actividad.</p>
                            <div class="actions">
                                <button id="btn-dl-ficha" class="btn-download">
                                    <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar PDF</span>
                                </button>
                                <label class="custom-checkbox">
                                    <input type="checkbox" id="chk-ficha" class="req-check">
                                    <span data-i18n="doc_read_accept">He leído y acepto el documento</span>
                                </label>
                            </div>
                        </div>

                        <!-- 4. Exoneración de Responsabilidad -->
                        <div class="legal-card" style="border-color: var(--brand-warning); background: rgba(245, 158, 11, 0.05);">
                            <div class="legal-card-header">
                                <i class="fas fa-exclamation-triangle" style="color: var(--brand-warning);"></i>
                                <h4 data-i18n="doc4_title" style="color: var(--brand-warning);">4. Exoneración de Responsabilidad</h4>
                            </div>
                            <p data-i18n="exo_p1" style="margin-bottom: 0.5rem;">Antes de finalizar su compra, es indispensable que lea detenidamente la Exoneración de Responsabilidad.</p>
                            <p data-i18n="exo_p3" style="font-weight: 600;">Al continuar con la compra, usted declara que ha leído, comprendido y acepta los términos y condiciones establecidos.</p>
                            <div class="actions" style="background: transparent;">
                                <button id="btn-dl-exo" class="btn-download" style="border-color: var(--brand-warning); color: var(--brand-warning);">
                                    <i class="fas fa-file-pdf"></i> <span data-i18n="btn_pdf">Descargar PDF</span>
                                </button>
                                <label class="custom-checkbox">
                                    <input type="checkbox" id="chk-exo" class="req-check">
                                    <span data-i18n="doc_read_accept">He leído y acepto el documento</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="b2c-glass-card">
                        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); margin-bottom: 0.5rem;"><i class="fas fa-camera-retro" style="color: var(--b2c-accent);"></i> <span data-i18n="selfie_title">Foto / Selfie de Seguridad</span></h3>
                        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.5rem;" data-i18n="selfie_desc">
                            Para validar tu identidad, por favor toma o sube una fotografía frontal (selfie).
                        </p>
                        <div class="floating-group" style="margin-bottom: 0;">
                            <input type="file" id="selfie-file" class="form-control" accept="image/*" capture="user" style="padding: 1.4rem 1rem 0.6rem 1rem;">
                            <label style="top: 0.5rem; font-size: 0.75rem; transform: none; font-weight: 600;">Sube tu fotografía</label>
                        </div>
                    </div>

                    <div class="b2c-glass-card">
                        <h3 style="display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary); margin-bottom: 0.5rem;"><i class="fas fa-signature" style="color: var(--b2c-accent);"></i> <span data-i18n="signature_title">Firma del Pasajero</span></h3>
                        <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1.5rem;" data-i18n="signature_desc">
                            Por favor, firma en el recuadro inferior para confirmar tu registro.
                        </p>
                        <div style="border: 2px dashed var(--b2c-accent); border-radius: 12px; background: #ffffff; overflow: hidden; margin-bottom: 1rem; box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);">
                            <canvas id="signature-pad" height="200" style="width: 100%; height: 200px; touch-action: none; cursor: crosshair;"></canvas>
                        </div>
                        <p style="font-size: 0.85rem; color: var(--brand-success); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem;">
                            <i class="fas fa-check-circle"></i> <span data-i18n="sig_stamp_msg">Esta firma se insertará automáticamente en la última página de todos los documentos PDF al confirmar la reserva.</span>
                        </p>
                        <button class="b2c-btn-glow" id="btn-clear-sig" style="background: var(--bg-surface-hover); color: var(--text-primary); width: 100%; font-size: 1rem;">
                            <i class="fas fa-eraser"></i> <span data-i18n="btn_clear_sig">Limpiar Firma</span>
                        </button>
                    </div>
                    
                    <button id="btn-confirm-booking" class="b2c-btn-glow primary" style="width: 100%; padding: 1.25rem; font-size: 1.25rem; margin-top: 1rem;" disabled>
                        <i class="fas fa-paper-plane"></i> <span data-i18n="btn_finish">Finalizar y Enviar Registro</span>
                    </button>
                </div>
            </div>
        \`;
    },
`;

let fullFile = fs.readFileSync('c:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/b2c-form.js', 'utf8');

const initIndex = fullFile.indexOf('init: () => {');
if (initIndex === -1) throw new Error('Could not find init:');
const beforeRender = fullFile.substring(0, fullFile.indexOf('render: (container) => {'));
const afterRender = fullFile.substring(initIndex);

fs.writeFileSync('c:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/b2c-form.js', beforeRender + renderContent + afterRender, 'utf8');
console.log('Replaced render function successfully.');
