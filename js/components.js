/**
 * components.js
 * Maneja la lógica de la UI Global (Header, Reloj, Sidebar, Tema, Modales del Sistema,
 * Documentos Legales Firmados, Visor de Soporte de Pago y Alertas de Correo <= 10 días)
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initMobileMenu();
    initCustomAlerts();
    if (window.SupportSystem && typeof window.SupportSystem.init === 'function') {
        window.SupportSystem.init();
    }
    if (window.PasswordManager && typeof window.PasswordManager.init === 'function') {
        window.PasswordManager.init();
    }
});

// ==========================================
// Dual Clock Widget (UTC / Medellín)
// ==========================================
function initClock() {
    const localTimeEl = document.getElementById('local-time');
    const utcTimeEl = document.getElementById('utc-time');
    const headerDateEl = document.getElementById('header-date');
    
    function updateClock() {
        if (!localTimeEl || !utcTimeEl || !headerDateEl) return;
        
        const now = new Date();
        
        // Date (DD MMMM AAAA)
        const dateOptions = { timeZone: 'America/Bogota', day: '2-digit', month: 'long', year: 'numeric' };
        let dateStr = new Intl.DateTimeFormat('es-CO', dateOptions).format(now);
        dateStr = dateStr.replace(/ de /g, ' ');
        headerDateEl.textContent = dateStr;

        // Medellín Time (HH:MM)
        const timeOptions = { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: false };
        const medellinStr = new Intl.DateTimeFormat('es-CO', timeOptions).format(now);
        localTimeEl.textContent = `${medellinStr} Medellín`;

        // UTC Time (HH:MM)
        const utcHour = now.getUTCHours().toString().padStart(2, '0');
        const utcMinute = now.getUTCMinutes().toString().padStart(2, '0');
        utcTimeEl.textContent = `${utcHour}:${utcMinute} UTC`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

// ==========================================
// Mobile & Tablet Menu (Sidebar Drawer)
// ==========================================
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');
    if (!btn || !sidebar) return;

    let backdrop = document.getElementById('sidebar-backdrop');
    if (!backdrop && document.body) {
        backdrop = document.createElement('div');
        backdrop.id = 'sidebar-backdrop';
        backdrop.className = 'sidebar-backdrop';
        document.body.appendChild(backdrop);
    }

    const isDrawerMode = () => (
        window.innerWidth <= 1024 ||
        (document.body && document.body.classList && (document.body.classList.contains('device-mobile') || document.body.classList.contains('device-tablet')))
    );

    const closeDrawer = () => {
        sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
    };

    const toggleDrawer = (e) => {
        if (e) e.stopPropagation();
        const willOpen = !sidebar.classList.contains('open');
        sidebar.classList.toggle('open', willOpen);
        if (backdrop) backdrop.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
    };

    btn.addEventListener('click', toggleDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    // Cerrar al seleccionar cualquier opción del menú en móvil o tablet
    sidebar.querySelectorAll('.nav-item').forEach(link => {
        link.addEventListener('click', () => {
            if (isDrawerMode()) closeDrawer();
        });
    });

    document.addEventListener('click', (e) => {
        if (isDrawerMode() && sidebar.classList.contains('open')) {
            if (!sidebar.contains(e.target) && !btn.contains(e.target)) {
                closeDrawer();
            }
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeDrawer();
        }
    });
}

// ==========================================
// Helper: Escape HTML
// ==========================================
window.escapeHTML = function(str) {
    if (str == null) return '';
    return String(str).replace(/[&<>"']/g, (m) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    }[m]));
};

// ==========================================
// Helper: Normalización Canónica de Rol / Etiqueta de Usuario
// Evita que perfiles como Asesor de Ventas u Operaciones cambien a Administrador
// ==========================================
window.normalizeUserRoleLabel = function(rawRole, userObj = null) {
    if (userObj) {
        const uname = String(userObj.username || '').trim().toLowerCase();
        const uid = String(userObj.id || '').trim().toLowerCase();
        const fullName = String(userObj.name || '').trim().toLowerCase();
        if (uname === 'admin01' || uid === 'usr_admin' || fullName === 'admin master') {
            return 'Administrador';
        }
    }

    const r = String(rawRole || '').trim();
    const rLow = r.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    if (
        rLow.includes('asesor') ||
        rLow.includes('venta') ||
        rLow.includes('veta') ||
        rLow.includes('comercial') ||
        rLow.includes('sales')
    ) {
        return 'Asesor de Ventas';
    }
    if (
        rLow.includes('operacion') ||
        rLow.includes('operador') ||
        rLow.includes('operation')
    ) {
        return 'Operaciones';
    }
    if (
        rLow === 'admin' ||
        rLow === 'administrador' ||
        rLow === 'superadmin' ||
        rLow === 'administrator'
    ) {
        return 'Administrador';
    }
    if (r) return r;

    try {
        const sessCode = typeof sessionStorage !== 'undefined' ? String(sessionStorage.getItem('fraterno_role') || '').toLowerCase() : '';
        if (sessCode === 'ventas') return 'Asesor de Ventas';
        if (sessCode === 'operaciones') return 'Operaciones';
        if (sessCode === 'admin') return 'Administrador';
    } catch (e) {}
    return 'Usuario';
};

window.resolveSessionRoleCode = function(rawRole, userObj = null) {
    const label = window.normalizeUserRoleLabel(rawRole, userObj);
    if (label === 'Administrador') return 'admin';
    if (label === 'Asesor de Ventas') return 'ventas';
    if (label === 'Operaciones') return 'operaciones';
    return 'operador';
};

window.updateSidebarUserProfileUI = function(userObj) {
    if (!userObj) return;
    const profileDiv = document.getElementById('sidebar-user-profile');
    if (!profileDiv) return;
    const h4 = profileDiv.querySelector('h4');
    const roleSpan = profileDiv.querySelector('.role');
    const avatarImg = profileDiv.querySelector('.avatar img');
    const displayRole = window.normalizeUserRoleLabel(userObj.role, userObj);
    if (h4) h4.innerText = userObj.name || userObj.username || 'Usuario';
    if (roleSpan) roleSpan.innerText = '[' + displayRole + ']';
    if (avatarImg) avatarImg.src = userObj.photo || 'https://i.pravatar.cc/150?img=11';
};

// ==========================================
// Helper: Instructor Role Check (Req #6)
// Cargo Instructor Tándem, AFF y S&TA aplica para Instructor Asignado
// ==========================================
window.isAssignableInstructor = function(emp) {
    if (!emp || !emp.role) return false;
    if (emp.status && emp.status !== 'Activo') return false;
    const role = emp.role.trim();
    const validRoles = ['Instructor Tandem', 'Instructor Tándem', 'Instructor AFF', 'S&TA', 'Instructor', 'Tandem'];
    if (validRoles.includes(role)) return true;
    const rLow = role.toLowerCase();
    return rLow.includes('instructor') || rLow === 's&ta' || rLow.includes('tandem') || rLow.includes('tándem');
};

window.isAssignableCameraInstructor = function(emp) {
    if (!emp || !emp.role) return false;
    if (emp.status && emp.status !== 'Activo') return false;
    if (window.isAssignableInstructor(emp)) return true;
    const rLow = emp.role.toLowerCase();
    return rLow.includes('camara') || rLow.includes('cámara') || rLow.includes('camera');
};

// ==========================================
// Helper: Financial Calculation for Passenger
// ==========================================
window.getPaxFinancialSummary = function(pax) {
    if (!pax) return { totalValue: 0, totalPaid: 0, pending: 0, pendingBalance: 0, isComplete: false, isCortesia: false, payMethod: 'Efectivo' };
    const fin = pax.financiera || {};
    const isCortesia = Boolean(pax.cortesia || fin.cortesiaObs || (fin.manualPrice === 0 && pax.cortesia === true));
    const discount = parseFloat(fin.discount) || 0;
    let base = parseFloat(fin.manualPrice) || 0;

    let totalValue = 0;
    if (fin.totalValue !== undefined && fin.totalValue !== null && fin.totalValue > 0) {
        totalValue = parseFloat(fin.totalValue);
    } else {
        totalValue = Math.max(0, base - discount);
    }

    const totalPaid = parseFloat(fin.totalPaid) || 0;
    const pending = Math.max(0, totalValue - totalPaid);
    const isComplete = isCortesia ? (pending === 0) : (totalValue > 0 && pending === 0);

    return {
        totalValue,
        totalPaid,
        pending,
        pendingBalance: pending,
        isComplete,
        isCortesia,
        payMethod: fin.payMethod || pax.payMethod || 'Efectivo'
    };
};

// ==========================================
// Unified System Popups / Modals (Req #2)
// ==========================================
function detectAlertType(msg) {
    const lower = String(msg || '').toLowerCase();
    if (lower.includes('error') || lower.includes('incorrect') || lower.includes('denegado') || lower.includes('no se puede') || lower.includes('conflicto') || lower.includes('obligatorio') || lower.includes('falta')) {
        return 'danger';
    }
    if (lower.includes('atención') || lower.includes('atencion') || lower.includes('alerta') || lower.includes('advertencia') || lower.includes('pendiente') || lower.includes('incompleto')) {
        return 'warning';
    }
    if (lower.includes('éxito') || lower.includes('exito') || lower.includes('exitosamente') || lower.includes('guardad') || lower.includes('completad') || lower.includes('encontrado') || lower.includes('registrad') || lower.includes('actualizad') || lower.includes('habilitad')) {
        return 'success';
    }
    return 'info';
}

function getDialogTheme(type) {
    switch (type) {
        case 'danger':
            return { color: 'var(--brand-danger)', bg: 'rgba(220, 38, 38, 0.12)', icon: 'fa-exclamation-circle', defaultTitle: 'Aviso de Validación' };
        case 'warning':
            return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.14)', icon: 'fa-exclamation-triangle', defaultTitle: 'Atención' };
        case 'success':
            return { color: 'var(--brand-success)', bg: 'rgba(16, 185, 129, 0.14)', icon: 'fa-check-circle', defaultTitle: 'Operación Exitosa' };
        default:
            return { color: 'var(--brand-action)', bg: 'rgba(2, 132, 199, 0.14)', icon: 'fa-info-circle', defaultTitle: 'Notificación del Sistema' };
    }
}

window.showAlert = function(message, options = {}) {
    return new Promise((resolve) => {
        const type = options.type || detectAlertType(message);
        const theme = getDialogTheme(type);
        const title = options.title || theme.defaultTitle;
        const formattedMsg = window.escapeHTML(String(message || '')).replace(/\n/g, '<br>');

        const overlay = document.createElement('div');
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '99999';

        overlay.innerHTML = `
            <div class="fraterno-modal-card" style="width: 440px; max-width: 92%; border-top-color: ${theme.color} !important;">
                <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.25rem;">
                    <div class="fraterno-dialog-icon" style="background: ${theme.bg}; color: ${theme.color};">
                        <i class="fas ${theme.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.4rem 0; font-size: 1.15rem; color: var(--text-primary); font-weight: 700;">${window.escapeHTML(title)}</h4>
                        <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.55; word-break: break-word;">${formattedMsg}</div>
                    </div>
                </div>
                <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <button class="btn btn-primary" id="fraterno-alert-ok" style="min-width: 120px; padding: 0.65rem 1.5rem; background: ${theme.color}; color: #fff; border: none;">
                        <i class="fas fa-check"></i> Aceptar
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        const okBtn = overlay.querySelector('#fraterno-alert-ok');
        okBtn.focus();

        function close() {
            overlay.remove();
            resolve(true);
        }

        okBtn.addEventListener('click', close);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) close();
        });
    });
};

window.showConfirm = function(message, options = {}) {
    return new Promise((resolve) => {
        const type = options.type || 'warning';
        const theme = getDialogTheme(type);
        const title = options.title || 'Confirmar Acción';
        const confirmText = options.confirmText || 'Confirmar';
        const cancelText = options.cancelText || 'Cancelar';
        const formattedMsg = window.escapeHTML(String(message || '')).replace(/\n/g, '<br>');

        const overlay = document.createElement('div');
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '99999';

        overlay.innerHTML = `
            <div class="fraterno-modal-card" style="width: 460px; max-width: 92%; border-top-color: ${theme.color} !important;">
                <div style="display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.25rem;">
                    <div class="fraterno-dialog-icon" style="background: ${theme.bg}; color: ${theme.color};">
                        <i class="fas ${theme.icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <h4 style="margin: 0 0 0.4rem 0; font-size: 1.15rem; color: var(--text-primary); font-weight: 700;">${window.escapeHTML(title)}</h4>
                        <div style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.55;">${formattedMsg}</div>
                    </div>
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <button class="btn btn-outline" id="fraterno-confirm-cancel" style="padding: 0.65rem 1.25rem;">${window.escapeHTML(cancelText)}</button>
                    <button class="btn btn-primary" id="fraterno-confirm-ok" style="padding: 0.65rem 1.5rem; background: ${theme.color}; color: #fff; border: none;">
                        <i class="fas fa-check"></i> ${window.escapeHTML(confirmText)}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        const okBtn = overlay.querySelector('#fraterno-confirm-ok');
        const cancelBtn = overlay.querySelector('#fraterno-confirm-cancel');
        okBtn.focus();

        function finish(result) {
            overlay.remove();
            resolve(result);
        }

        okBtn.addEventListener('click', () => finish(true));
        cancelBtn.addEventListener('click', () => finish(false));
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) finish(false);
        });
    });
};

window.showPrompt = function(message, options = {}) {
    return new Promise((resolve) => {
        const title = options.title || 'Ingreso de Información';
        const inputType = options.inputType || 'text';
        const placeholder = options.placeholder || '';
        const defaultValue = options.defaultValue || '';
        const confirmText = options.confirmText || 'Aceptar';
        const cancelText = options.cancelText || 'Cancelar';
        const formattedMsg = window.escapeHTML(String(message || '')).replace(/\n/g, '<br>');

        const overlay = document.createElement('div');
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '99999';

        overlay.innerHTML = `
            <div class="fraterno-modal-card" style="width: 440px; max-width: 92%;">
                <h3><i class="fas ${inputType === 'password' ? 'fa-lock' : 'fa-edit'}" style="color: var(--brand-action);"></i> ${window.escapeHTML(title)}</h3>
                <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 1rem; line-height: 1.5;">${formattedMsg}</p>
                <div class="form-group" style="margin-bottom: 1.25rem;">
                    <input type="${inputType}" id="fraterno-prompt-input" class="form-control" placeholder="${window.escapeHTML(placeholder)}" value="${window.escapeHTML(defaultValue)}">
                </div>
                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                    <button class="btn btn-outline" id="fraterno-prompt-cancel" style="padding: 0.65rem 1.25rem;">${window.escapeHTML(cancelText)}</button>
                    <button class="btn btn-primary" id="fraterno-prompt-ok" style="padding: 0.65rem 1.5rem;">
                        <i class="fas fa-check"></i> ${window.escapeHTML(confirmText)}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        const inp = overlay.querySelector('#fraterno-prompt-input');
        const okBtn = overlay.querySelector('#fraterno-prompt-ok');
        const cancelBtn = overlay.querySelector('#fraterno-prompt-cancel');
        setTimeout(() => inp.focus(), 30);

        function finish(val) {
            overlay.remove();
            resolve(val);
        }

        okBtn.addEventListener('click', () => finish(inp.value));
        cancelBtn.addEventListener('click', () => finish(null));
        inp.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') finish(inp.value);
            if (e.key === 'Escape') finish(null);
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) finish(null);
        });
    });
};

function initCustomAlerts() {
    window.nativeAlert = window.alert.bind(window);
    window.alert = function(msg) {
        window.showAlert(msg);
    };
}

// ==========================================
// Payment Support Viewer Modal (Req #10)
// Visible in Modulo Reservas & Consulta Historial
// ==========================================
window.viewPaymentSupportModal = function(pax) {
    if (!pax) return;
    const support = pax.paymentSupport || (pax.soportePago ? { dataUrl: pax.soportePago } : null);
    if (!support || !support.dataUrl) {
        window.showAlert('Este pasajero aún no tiene un soporte de pago adjuntado desde el Portal B2C.', { type: 'warning', title: 'Sin Soporte de Pago' });
        return;
    }

    const isPdf = support.dataUrl.startsWith('data:application/pdf') || (support.fileName && support.fileName.toLowerCase().endsWith('.pdf'));
    const fileName = support.fileName || `Soporte_Pago_${pax.doc || pax.name || 'Cliente'}.${isPdf ? 'pdf' : 'png'}`;

    const previewHtml = isPdf
        ? `<iframe src="${support.dataUrl}" style="width: 100%; height: 60vh; border: 1px solid var(--border-color); border-radius: 10px; background: #fff;"></iframe>`
        : `<div style="text-align: center; background: var(--bg-main); padding: 1rem; border-radius: 10px; border: 1px solid var(--border-color); max-height: 62vh; overflow: auto;">
               <img src="${support.dataUrl}" alt="Soporte de Pago" style="max-width: 100%; max-height: 56vh; object-fit: contain; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
           </div>`;

    const overlay = document.createElement('div');
    overlay.className = 'fraterno-modal-overlay';
    overlay.style.display = 'flex';

    overlay.innerHTML = `
        <div class="fraterno-modal-card" style="width: 720px; max-width: 95%; max-height: 92vh; display: flex; flex-direction: column;">
            <button id="close-pay-support-top" class="btn" style="position: absolute; top: 1.25rem; right: 1.25rem; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
            <h3><i class="fas fa-file-invoice-dollar" style="color: var(--brand-success);"></i> Soporte de Pago del Cliente (Portal B2C)</h3>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; background: var(--bg-surface-hover); padding: 1rem; border-radius: 10px; margin-bottom: 1rem; border: 1px solid var(--border-color);">
                <div>
                    <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Pasajero</span>
                    <strong>${window.escapeHTML(pax.name || 'S/D')}</strong>
                </div>
                <div>
                    <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Documento</span>
                    <strong style="font-family: monospace;">${window.escapeHTML(pax.doc || 'S/D')}</strong>
                </div>
                <div>
                    <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Fecha de Pago</span>
                    <strong>${window.escapeHTML(support.paymentDate || pax.date || 'Registrado B2C')}</strong>
                </div>
                <div>
                    <span style="display: block; font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Medio de Pago</span>
                    <strong style="color: var(--brand-action);">${window.escapeHTML(support.paymentMethod || pax.financiera?.payMethod || 'Transferencia')}</strong>
                </div>
            </div>

            <div style="flex: 1; overflow-y: auto; margin-bottom: 1rem;">
                ${previewHtml}
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                <a href="${support.dataUrl}" download="${window.escapeHTML(fileName)}" class="btn btn-primary" style="text-decoration: none;">
                    <i class="fas fa-download"></i> Descargar Comprobante
                </a>
                <button class="btn btn-outline" id="close-pay-support-btn">Cerrar</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    overlay.querySelector('#close-pay-support-top').addEventListener('click', close);
    overlay.querySelector('#close-pay-support-btn').addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
};

// ==========================================
// Legal Documents Helper with Signature Insertion (Req #3)
// Inserts passenger signature into ALL 4 legal acceptance documents
// ==========================================
window.LegalDocsHelper = {
    getDocsCatalog: function(lang = 'es') {
        const isEn = lang === 'en';
        return [
            {
                key: 'bienvenida',
                num: 1,
                filename: isEn ? '1_Welcome_Guide_Signed.pdf' : '1_Guia_de_Bienvenida_Firmada.pdf',
                title: isEn ? '1. Welcome Guide - Fraterno Skydiving' : '1. Guía de Bienvenida - Fraterno Paracaidismo',
                text: isEn
                    ? "WELCOME GUIDE – FRATERNO SKYDIVING CLUB\n\nWelcome to Fraterno Skydiving! Before your jump, please review and accept the following operational and safety guidelines:\n\n1. ARRIVAL & PUNCTUALITY\nAll participants must arrive at the dropzone at the scheduled check-in time. Weather conditions, air traffic control, and safety inspections determine the flight order.\n\n2. CLOTHING & FOOTWEAR\nWear comfortable athletic clothing and closed lace-up sneakers. Sandals, boots, heels, or loose accessories are strictly prohibited during the jump.\n\n3. PRE-JUMP PREPARATION & BRIEFING\nPay close attention to the safety briefing provided by your certified instructor. Follow body position instructions for exit, freefall, canopy flight, and landing.\n\n4. HEALTH & SOBRIETY\nParticipants must not be under the influence of alcohol, psychoactive substances, or unapproved medications within 24 hours prior to the activity.\n\nBy signing below, I confirm that I have read, understood, and accepted the Welcome Guide."
                    : "GUÍA DE BIENVENIDA – CLUB DEPORTIVO FRATERNO PARACAIDISMO\n\n¡Bienvenido a Fraterno Paracaidismo! Antes de realizar tu salto, por favor lee y acepta las siguientes recomendaciones operativas y de seguridad:\n\n1. LLEGADA Y DISPONIBILIDAD DE TIEMPO\nEl participante debe presentarse puntualmente a la hora citada para su Check-in. La operación aérea depende de condiciones meteorológicas, control de tráfico aéreo de la Aeronáutica Civil e inspecciones técnicas, por lo cual debes disponer del día completo para la actividad.\n\n2. VESTIMENTA Y CALZADO\nUsa ropa cómoda o deportiva y tenis cerrados ajustables (con cordones). No se permite saltar con sandalias, botas con ganchos, tacones ni objetos sueltos (joyas, relojes, teléfonos).\n\n3. INSTRUCCIÓN PREVIA (BRIEFING DE SEGURIDAD)\nAtiende todas las indicaciones de tu instructor certificado sobre la posición de salida del avión, caída libre, navegación bajo cúpula y posición de aterrizaje.\n\n4. CONDICIONES FÍSICAS Y SOBRIEDAD\nEstá estrictamente prohibido presentarse bajo el efecto de bebidas alcohólicas o sustancias psicoactivas.\n\nAl firmar este documento, declaro que he leído, comprendido y aceptado en su totalidad la Guía de Bienvenida."
            },
            {
                key: 'terminos',
                num: 2,
                filename: isEn ? '2_Terms_and_Conditions_Signed.pdf' : '2_Terminos_y_Condiciones_Firmado.pdf',
                title: isEn ? '2. Operation Terms and Conditions' : '2. Términos y Condiciones de la Operación',
                text: isEn ? (window.TerminosTextEn || "TERMS AND CONDITIONS - FRATERNO SKYDIVING") : (window.TerminosText || "TÉRMINOS Y CONDICIONES - FRATERNO PARACAIDISMO")
            },
            {
                key: 'ficha',
                num: 3,
                filename: isEn ? '3_Participant_Information_Sheet_Signed.pdf' : '3_Ficha_Informativa_Participante_Firmada.pdf',
                title: isEn ? '3. Participant Information & Data Authorization Sheet' : '3. Ficha Informativa y Autorización de Datos',
                text: isEn
                    ? "PARTICIPANT INFORMATION SHEET & PERSONAL DATA AUTHORIZATION\nFRATERNO SKYDIVING – AERIAL SPORTS CLUB\n\n1. TECHNICAL & EQUIPMENT INFORMATION\nAll jumps are conducted using certified dual-parachute systems (Main canopy, Reserve canopy, and Automatic Activation Device - AAD) maintained by certified FAA/Aerocivil Riggers, and operated by licensed instructors.\n\n2. WEIGHT & MEDICAL DECLARATION\nThe participant confirms that the weight and medical condition information declared in the registration form is truthful and accurate. Surcharges apply above 85 Kg, and weights over 100 Kg require safety officer evaluation.\n\n3. PERSONAL DATA PROTECTION (HABEAS DATA - LAW 1581 OF 2012)\nI expressly authorize CLUB DEPORTIVO FUNDACIÓN FRATERNO to collect, store, and process my personal data, identification, security photographs, and digital signatures for operational, insurance, safety, and institutional communication purposes.\n\nBy signing this document, I certify that all personal and health data provided is accurate and I accept the Participant Information Sheet."
                    : "FICHA INFORMATIVA DEL PARTICIPANTE Y AUTORIZACIÓN DE TRATAMIENTO DE DATOS\nFRATERNO PARACAIDISMO – CLUB DEPORTIVO DE ACTIVIDADES AÉREAS\n\n1. INFORMACIÓN TÉCNICA Y DE EQUIPOS\nLas actividades de salto se desarrollan empleando sistemas certificados de paracaídas de doble cúpula (Principal y Reserva) equipados con Dispositivo de Apertura Automática (AAD), inspeccionados por Riggers certificados y operados por instructores con licencia vigente.\n\n2. VERACIDAD DE PESO Y CONDICIÓN MÉDICA\nEl participante certifica que los datos de peso corporal, edad y condiciones médicas registrados en el formulario son veraces. A partir de 85 Kg aplica recargo operativo por Kg adicional, y pesos superiores a 100 Kg requieren evaluación del Oficial de Seguridad (S&TA).\n\n3. AUTORIZACIÓN DE TRATAMIENTO DE DATOS PERSONALES (LEY 1581 DE 2012)\nAutorizo de manera libre, previa, expresa e informada al CLUB DEPORTIVO FUNDACIÓN FRATERNO para recolectar, almacenar y tratar mis datos personales, registro fotográfico de seguridad y firma digital para fines operativos, aeronáuticos, de seguros y contacto institucional.\n\nEn constancia de lectura y aceptación de la Ficha Informativa, firmo el presente documento."
            },
            {
                key: 'exoneracion',
                num: 4,
                filename: isEn ? '4_Liability_Waiver_Signed.pdf' : '4_Exoneracion_Responsabilidad_Firmada.pdf',
                title: isEn ? '4. Liability Waiver and Informed Assumption of Risks' : '4. Exoneración de Responsabilidad y Asunción de Riesgos',
                text: isEn ? (window.ExoneracionTextEn || "DECLARATION OF LIABILITY WAIVER") : (window.ExoneracionText || "DECLARACIÓN DE EXONERACIÓN DE RESPONSABILIDAD")
            }
        ];
    },

    computeInitials: function(fullName = '') {
        const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
        if (parts.length === 0) return 'N/A';
        return parts.map(n => n.charAt(0).toUpperCase()).join('.');
    },

    buildPopulatedBodyText: function(docMeta, paxData = {}, lang = 'es') {
        const isEn = lang === 'en';
        const fullName = (paxData.name || 'Participante').trim();
        const docType = paxData.docType || (isEn ? 'ID Document' : 'Cédula de Ciudadanía (CC)');
        const docNum = paxData.doc || 'S/D';
        const jumpDate = paxData.date || paxData.latestJumpDate || (isEn ? 'Pending' : 'Por confirmar');
        const jumpType = paxData.type || 'Salto Tandem';
        const cams = paxData.cams || (isEn ? 'None' : 'Ninguna');
        const dob = paxData.dob || (isEn ? 'Not registered' : 'No registrada');
        const phone = paxData.phone || (isEn ? 'Not registered' : 'No registrado');
        const email = paxData.email || (isEn ? 'Not registered' : 'No registrado');
        const weight = paxData.weight ? `${paxData.weight} Kg` : (isEn ? 'Not registered' : 'No registrado');
        const locParts = [paxData.city, paxData.state, paxData.country].filter(Boolean);
        const locationStr = locParts.length > 0 ? locParts.join(', ') : (isEn ? 'Not registered' : 'No registrada');
        const address = paxData.address || (isEn ? 'Not registered' : 'No registrada');
        const occupation = (paxData.occupation === 'Otro' && paxData.occupationOther)
            ? paxData.occupationOther
            : (paxData.occupation || (isEn ? 'Not registered' : 'No registrada'));
        const favActivities = paxData.favActivities || (isEn ? 'Not registered' : 'No registradas');
        const contactMethod = paxData.contactMethod
            ? (paxData.contactMethod === 'asesor' && paxData.advisor ? `Asesor (${paxData.advisor})` : paxData.contactMethod)
            : (isEn ? 'Not registered' : 'No registrado');
        const medical = paxData.medicalCondition || (isEn ? 'None' : 'Ninguna');
        const initials = this.computeInitials(fullName);

        let bodyText = docMeta.text || '';

        if (docMeta.key === 'ficha') {
            const fichaHeader = isEn
                ? `PARTICIPANT REGISTRATION & RESERVATION DATA\n` +
                  `------------------------------------------------------------\n` +
                  `Jump Date: ${jumpDate}\n` +
                  `Experience / Jump Type: ${jumpType}   |   Cameras / Add-ons: ${cams}\n` +
                  `Full Name: ${fullName}\n` +
                  `Document Type & Number: ${docType} - ${docNum}\n` +
                  `Date of Birth: ${dob}   |   Weight: ${weight}\n` +
                  `Phone / WhatsApp: ${phone}   |   Email: ${email}\n` +
                  `Location (City, State, Country): ${locationStr}\n` +
                  `Residential Address: ${address}\n` +
                  `Occupation / Profession: ${occupation}\n` +
                  `Favorite Activities: ${favActivities}\n` +
                  `How did you hear about us: ${contactMethod}\n` +
                  `Reported Medical Conditions: ${medical}\n` +
                  `------------------------------------------------------------\n\n`
                : `DATOS COMPLETOS DEL PARTICIPANTE Y DE LA RESERVA\n` +
                  `------------------------------------------------------------\n` +
                  `Fecha de Salto: ${jumpDate}\n` +
                  `Tipo de Salto: ${jumpType}   |   Cámaras / Adicionales: ${cams}\n` +
                  `Nombre Completo: ${fullName}\n` +
                  `Tipo y Número de Documento: ${docType} - ${docNum}\n` +
                  `Fecha de Nacimiento: ${dob}   |   Peso Corporal: ${weight}\n` +
                  `Teléfono / WhatsApp: ${phone}   |   Correo Electrónico: ${email}\n` +
                  `Ubicación (Ciudad, Depto/Estado, País): ${locationStr}\n` +
                  `Dirección de Residencia: ${address}\n` +
                  `Ocupación / Profesión: ${occupation}\n` +
                  `Actividades Favoritas: ${favActivities}\n` +
                  `¿Cómo nos conoció?: ${contactMethod}\n` +
                  `Condiciones Médicas Reportadas: ${medical}\n` +
                  `------------------------------------------------------------\n\n`;
            return fichaHeader + bodyText;
        }

        if (docMeta.key === 'exoneracion') {
            if (!isEn) {
                bodyText = bodyText.replace(
                    /Yo,\s*mayor de edad/i,
                    `Yo, ${fullName}, mayor de edad, identificado(a) con ${docType} No. ${docNum}`
                );
                // Reemplazar espacios en blanco explícitos de iniciales si existen
                bodyText = bodyText.replace(/Iniciales del participante:\s*_+/gi, `Iniciales del participante: ${initials}`);
                // Insertar iniciales del participante al final de cada cláusula numerada
                const clauseBlocks = bodyText.split('\n\n');
                const processedBlocks = clauseBlocks.map(block => {
                    if (/^(PRIMERA|SEGUNDA|TERCERA|CUARTA|QUINTA|SEXTA|SÉPTIMA|SEPTIMA|OCTAVA|NOVENA)\s*[–-]/i.test(block.trim())) {
                        if (!/Iniciales del participante:/i.test(block)) {
                            return `${block}\nIniciales del participante: ${initials}`;
                        }
                    }
                    return block;
                });
                bodyText = processedBlocks.join('\n\n');
            } else {
                bodyText = bodyText.replace(
                    /I,\s*of legal age/i,
                    `I, ${fullName}, of legal age, identified with ${docType} No. ${docNum}`
                );
                bodyText = bodyText.replace(/Participant initials:\s*_+/gi, `Participant initials: ${initials}`);
                const clauseBlocks = bodyText.split('\n\n');
                const processedBlocks = clauseBlocks.map(block => {
                    if (/^(FIRST|SECOND|THIRD|FOURTH|FIFTH|SIXTH|SEVENTH|EIGHTH|NINTH)\s*[–-]/i.test(block.trim())) {
                        if (!/Participant initials:/i.test(block)) {
                            return `${block}\nParticipant initials: ${initials}`;
                        }
                    }
                    return block;
                });
                bodyText = processedBlocks.join('\n\n');
            }
        }

        return bodyText;
    },

    drawDocOnJsPdf: function(pdf, docMeta, paxData = {}, lang = 'es', isContinuation = false) {
        if (isContinuation) {
            pdf.addPage();
        }
        const isEn = lang === 'en';
        const fullName = (paxData.name || 'Participante').trim();
        const docType = paxData.docType || (isEn ? 'ID' : 'CC');
        const docNum = paxData.doc || 'S/D';
        const jumpDate = paxData.date || paxData.latestJumpDate || (isEn ? 'Pending' : 'Por confirmar');
        const signedDate = paxData.signedAt || new Date().toLocaleString('es-CO');
        const initials = this.computeInitials(fullName);

        // Header Bar
        pdf.setFillColor(12, 35, 49);
        pdf.rect(0, 0, 210, 26, 'F');
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(13);
        pdf.setTextColor(255, 255, 255);
        pdf.text("FRATERNO PARACAIDISMO - DOCUMENTO LEGAL DE ACEPTACIÓN", 105, 11, { align: "center" });
        pdf.setFontSize(11);
        pdf.setTextColor(69, 220, 248);
        pdf.text(docMeta.title, 105, 19, { align: "center" });

        // Participant metadata box
        pdf.setDrawColor(200, 210, 220);
        pdf.setFillColor(245, 248, 250);
        pdf.roundedRect(15, 30, 180, 21, 2, 2, 'FD');
        pdf.setFontSize(8.8);
        pdf.setTextColor(20, 20, 20);
        pdf.text(`${isEn ? 'Full Name' : 'Nombre completo'}: ${fullName}`, 20, 36.5);
        pdf.text(`${isEn ? 'Document' : 'Documento'}: ${docType} ${docNum}`, 122, 36.5);
        pdf.text(`${isEn ? 'Jump Date' : 'Fecha de Salto'}: ${jumpDate}`, 20, 42.5);
        pdf.text(`${isEn ? 'Initials' : 'Iniciales'}: ${initials}`, 122, 42.5);
        pdf.text(`${isEn ? 'Acceptance Date' : 'Fecha aceptación legal'}: ${signedDate}`, 20, 48.5);

        // Body Text
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(9.2);
        pdf.setTextColor(40, 40, 40);

        const bodyText = this.buildPopulatedBodyText(docMeta, paxData, lang);
        const lines = pdf.splitTextToSize(bodyText, 178);
        let y = 58;
        for (let i = 0; i < lines.length; i++) {
            if (y > 270) {
                pdf.addPage();
                y = 20;
            }
            const lineStr = String(lines[i] || '');
            if (/^(Iniciales del participante:|Participant initials:)/i.test(lineStr.trim())) {
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(12, 35, 49);
                pdf.text(lineStr, 16, y);
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(40, 40, 40);
            } else {
                pdf.text(lineStr, 16, y);
            }
            y += 4.6;
        }

        // Structured Signature Block at the end of EVERY legal document
        if (y > 205) {
            pdf.addPage();
            y = 25;
        } else {
            y += 8;
        }

        pdf.setDrawColor(2, 132, 199);
        pdf.setFillColor(248, 250, 252);
        pdf.roundedRect(15, y, 180, 68, 3, 3, 'FD');

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(9.5);
        pdf.setTextColor(12, 35, 49);
        pdf.text(isEn ? "DIGITAL ACCEPTANCE & SIGNATURE RECORD" : "CONSTANCIA DE ACEPTACIÓN LEGAL Y FIRMA ELECTRÓNICA", 20, y + 7);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.8);
        pdf.setTextColor(30, 30, 30);
        pdf.text(`${isEn ? 'Full Name' : 'Nombre completo'}: ${fullName}`, 20, y + 14);
        pdf.text(`${isEn ? 'Document' : 'Documento'}: ${docType} ${docNum}`, 20, y + 20);
        pdf.text(`${isEn ? 'Participant Initials' : 'Iniciales del participante'}: ${initials}`, 120, y + 20);
        pdf.text(`${isEn ? 'Date' : 'Fecha'}: ${signedDate}`, 20, y + 26);

        const sigMinor = paxData.signatureMinor;
        const sigMain = paxData.signature;

        // Dedicated Signature Field Box ("Firma:")
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(8.8);
        pdf.setTextColor(12, 35, 49);
        pdf.text(`${isEn ? 'Signature' : 'Firma'}:`, 20, y + 34);
        pdf.setDrawColor(180, 195, 210);
        pdf.setFillColor(255, 255, 255);
        pdf.roundedRect(20, y + 36, 170, 27, 2, 2, 'FD');

        try {
            if (sigMinor && (sigMinor.mother || sigMinor.father)) {
                if (sigMinor.mother) {
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(7.5);
                    pdf.text(isEn ? "Legal Tutor 1" : "Tutor Legal 1", 24, y + 40);
                    pdf.addImage(sigMinor.mother, 'PNG', 24, y + 41, 65, 20);
                }
                if (sigMinor.father) {
                    pdf.setFont("helvetica", "normal");
                    pdf.setFontSize(7.5);
                    pdf.text(isEn ? "Legal Tutor 2" : "Tutor Legal 2", 108, y + 40);
                    pdf.addImage(sigMinor.father, 'PNG', 108, y + 41, 65, 20);
                }
            } else if (sigMain) {
                pdf.addImage(sigMain, 'PNG', 26, y + 38, 75, 23);
            } else {
                pdf.setTextColor(180, 50, 50);
                pdf.text(isEn ? "[Pending Signature]" : "[Documento sin firma registrada]", 26, y + 51);
            }
        } catch (err) {
            console.warn("Could not embed signature image in jsPDF:", err);
        }

        return pdf;
    },

    buildSingleDocJsPdf: function(docMeta, paxData = {}, lang = 'es') {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        return this.drawDocOnJsPdf(pdf, docMeta, paxData, lang, false);
    },

    buildConsolidatedJsPdf: function(paxData = {}, lang = 'es') {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        const catalog = this.getDocsCatalog(lang);
        catalog.forEach((docMeta, idx) => {
            this.drawDocOnJsPdf(pdf, docMeta, paxData, lang, idx > 0);
        });
        return pdf;
    },

    sanitizeWinAnsi: function(str = '') {
        return String(str || '')
            .replace(/[“”]/g, '"')
            .replace(/[‘’]/g, "'")
            .replace(/[–—]/g, '-')
            .replace(/[^\x20-\x7E\xA0-\xFF]/g, '')
            .trim();
    },

    getShortDocType: function(docType = '') {
        const low = String(docType || '').toLowerCase();
        if (low.includes('ciudadan') || low === 'cc' || low.includes('(cc)')) return 'C.C.';
        if (low.includes('extranjer') || low === 'ce' || low.includes('(ce)')) return 'C.E.';
        if (low.includes('identidad') || low === 'ti' || low.includes('(ti)')) return 'T.I.';
        if (low.includes('pasaporte') || low.includes('passport')) return 'Pasaporte';
        return docType ? String(docType).trim() : 'C.C.';
    },

    buildPassengerFieldsMap: function(paxData = {}, lang = 'es') {
        const isEn = lang === 'en';
        const fullName = (paxData.name || 'Participante').trim();
        const nameParts = fullName.split(/\s+/).filter(Boolean);
        const firstName = nameParts[0] || fullName;
        const lastName = paxData.lastname || nameParts.slice(1).join(' ') || '';
        const docType = paxData.docType || (isEn ? 'ID Document' : 'Cédula de Ciudadanía (CC)');
        const docTypeShort = this.getShortDocType(docType);
        const docNum = paxData.doc || 'S/D';
        const jumpDate = paxData.date || paxData.latestJumpDate || (isEn ? 'Pending' : 'Por confirmar');
        const jumpType = paxData.type || 'Salto Tandem';
        const cams = paxData.cams || (isEn ? 'None' : 'Ninguna');
        const dob = paxData.dob || '';
        const phone = paxData.phone || '';
        const email = paxData.email || '';
        const weight = paxData.weight ? `${paxData.weight} Kg` : '';
        const country = paxData.country || '';
        const state = paxData.state ? String(paxData.state).replace(/ Department/gi, '') : '';
        const city = paxData.city || '';
        const locationStr = [city, state, country].filter(Boolean).join(', ');
        const address = paxData.address || '';
        const occupation = (paxData.occupation === 'Otro' && paxData.occupationOther)
            ? paxData.occupationOther
            : (paxData.occupation || '');
        const favActivities = paxData.favActivities || '';
        const contactMethod = paxData.contactMethod
            ? (paxData.contactMethod === 'asesor' && paxData.advisor ? `Asesor (${paxData.advisor})` : paxData.contactMethod)
            : '';
        const medical = paxData.medicalCondition || (isEn ? 'None' : 'Ninguna');
        const signedDate = paxData.signedAt || new Date().toLocaleDateString('es-CO');
        const initials = this.computeInitials(fullName);

        return {
            fullName, firstName, lastName, docType, docTypeShort, docNum,
            jumpDate, jumpType, cams, dob, phone, email, weight,
            country, state, city, locationStr, address, occupation,
            favActivities, contactMethod, medical, signedDate, initials
        };
    },

    groupPdfJsItemsIntoLines: function(rawItems = []) {
        const items = rawItems
            .filter(it => it && typeof it.str === 'string' && it.str.length > 0 && Array.isArray(it.transform))
            .map(it => ({
                str: it.str,
                x: Number(it.transform[4]) || 0,
                y: Number(it.transform[5]) || 0,
                width: Number(it.width) || (it.str.length * 5),
                height: Math.abs(Number(it.transform[3])) || Number(it.height) || 10
            }));

        const lines = [];
        items.forEach(item => {
            let line = lines.find(l => Math.abs(l.y - item.y) <= 4.5);
            if (!line) {
                line = { y: item.y, items: [] };
                lines.push(line);
            }
            line.items.push(item);
        });

        lines.sort((a, b) => b.y - a.y);

        // Sort items left-to-right and merge consecutive underscore runs split by Word PDF exporters
        lines.forEach(line => {
            line.items.sort((a, b) => a.x - b.x);
            const merged = [];
            for (const it of line.items) {
                const prev = merged[merged.length - 1];
                const isOnlyUnderscore = /^[\s_]+$/.test(it.str) && it.str.includes('_');
                const prevIsOnlyUnderscore = prev && /^[\s_]+$/.test(prev.str) && prev.str.includes('_');
                if (prevIsOnlyUnderscore && isOnlyUnderscore && (it.x - (prev.x + prev.width)) < 8) {
                    const rightEdge = Math.max(prev.x + prev.width, it.x + it.width);
                    prev.str += it.str;
                    prev.width = rightEdge - prev.x;
                } else {
                    merged.push({ ...it });
                }
            }
            line.items = merged;
            line.text = merged.map(i => i.str).join(' ').replace(/\s+/g, ' ').trim();
        });

        return lines;
    },

    extractFieldTargetsFromLines: function(lines = [], pageWidth = 612) {
        const targets = [];

        for (let li = 0; li < lines.length; li++) {
            const line = lines[li];
            const prevLineText = li > 0 ? lines[li - 1].text : '';
            let foundBlankOnLine = false;

            // Pass A: Explicit underscore blanks (3 or more underscores)
            for (let ii = 0; ii < line.items.length; ii++) {
                const item = line.items[ii];
                if (!item.str.includes('_')) continue;

                const rx = /_{3,}/g;
                let match;
                while ((match = rx.exec(item.str)) !== null) {
                    foundBlankOnLine = true;
                    const len = Math.max(1, item.str.length);
                    const blankX = item.x + (match.index / len) * item.width;
                    const blankW = Math.max(24, (match[0].length / len) * item.width);

                    const beforeSameItem = item.str.slice(0, match.index);
                    const afterSameItem = item.str.slice(match.index + match[0].length);
                    const beforeItems = line.items.slice(0, ii).map(x => x.str).join(' ');
                    const afterItems = line.items.slice(ii + 1).map(x => x.str).join(' ');

                    const prevText = `${beforeItems} ${beforeSameItem}`.replace(/\s+/g, ' ').trim();
                    const nextText = `${afterSameItem} ${afterItems}`.replace(/\s+/g, ' ').trim();

                    targets.push({
                        x: blankX,
                        y: item.y,
                        width: blankW,
                        height: item.height,
                        prevText,
                        nextText,
                        prevLineText,
                        lineText: line.text,
                        hasUnderscore: true
                    });
                }
            }

            // Pass B: Colon-terminated labels OR vector-line gaps (for PDFs that draw lines instead of underscore chars)
            if (!foundBlankOnLine) {
                for (let ii = 0; ii < line.items.length; ii++) {
                    const item = line.items[ii];
                    const trimmed = item.str.trim();
                    const nextItem = line.items[ii + 1];
                    const startX = item.x + item.width + 4;
                    const gapW = nextItem ? (nextItem.x - startX - 4) : (pageWidth - 45 - startX);

                    const isColonLabel = trimmed.endsWith(':');
                    const isIntroGap = nextItem && gapW >= 32 && (
                        /(^|\s)yo\s*,?$/i.test(trimmed) ||
                        /identificad[oa](\(a\))?\s+con$/i.test(trimmed) ||
                        /\bno\.?$/i.test(trimmed)
                    );
                    const isLeadingGapBeforeNo = ii === 0 && item.x > 95 && /^no\.?/i.test(trimmed) && /identificad[oa](\(a\))?\s+con\s*$/i.test(prevLineText);

                    if (isLeadingGapBeforeNo) {
                        targets.push({
                            x: 56,
                            y: item.y,
                            width: Math.max(40, item.x - 60),
                            height: item.height,
                            prevText: '',
                            nextText: line.text,
                            prevLineText,
                            lineText: line.text,
                            hasUnderscore: false
                        });
                    }

                    if ((isColonLabel && gapW >= 32) || isIntroGap) {
                        const prevChunk = line.items.slice(0, ii + 1).map(x => x.str).join(' ').replace(/\s+/g, ' ').trim();
                        targets.push({
                            x: startX,
                            y: item.y,
                            width: gapW,
                            height: item.height,
                            prevText: prevChunk,
                            nextText: nextItem ? line.items.slice(ii + 1).map(x => x.str).join(' ') : '',
                            prevLineText,
                            lineText: line.text,
                            hasUnderscore: false
                        });
                    }
                }
            }
        }

        return targets;
    },

    resolveFieldSpecForTarget: function(target, fields) {
        const norm = (s) => String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        const prev = norm(target.prevText);
        const next = norm(target.nextText);
        const prevLine = norm(target.prevLineText);
        const line = norm(target.lineText);

        // 1. Intro Exoneración: "Yo, ____________, mayor de edad..."
        if (/(^|\s)yo\s*,?\s*$/.test(prev) || /(^|\s)i\s*,?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.fullName, align: 'left' };
        }

        // 2. Intro Exoneración: "identificado(a) con _______ No. _______" (en misma línea o partida en 2 líneas)
        if (/\bno\.?\s*$/.test(prev) && (line.includes('actuando') || line.includes('identificad') || prevLine.includes('identificad') || line.includes('no.'))) {
            return { kind: 'text', value: fields.docNum, align: 'left' };
        }
        if (/identificad[oa](\(a\))?\s+con\s*$/.test(prev) ||
            (/identificad[oa](\(a\))?\s+con\s*$/.test(prevLine) && prev === '' && /^no\.?/.test(next)) ||
            /identified\s+with\s*$/.test(prev)) {
            const val = target.width < 135 ? fields.docTypeShort : fields.docType;
            return { kind: 'text', value: val, align: 'center' };
        }

        // 3. Iniciales del participante: ________
        if (/iniciales(\s+del\s+participante)?\s*:?\s*$/.test(prev) || /initials\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.initials, align: 'center', bold: true };
        }

        // 4. Firma electrónica en campo Firma
        if (/firma(\s+(del\s+(participante|pasajero|alumno|cliente|tutor(\s+legal)?(\s*[12])?)|electronica|digital))?\s*:?\s*$/.test(prev) ||
            /signature(\s+of\s+participant)?\s*:?\s*$/.test(prev)) {
            return { kind: 'signature' };
        }

        // 5. Campos estructurados de Ficha Informativa y bloque final de Exoneración
        if (/(nombre\s+completo|nombres\s+y\s+apellidos|nombre\s+del\s+(participante|pasajero)|full\s+name)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.fullName, align: 'left' };
        }
        if (/(^|\s)(primer\s+)?nombre(\(s\))?\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.fullName, align: 'left' };
        }
        if (/apellido(s|\(s\))?\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.lastName, align: 'left' };
        }
        if (/(tipo\s+de\s+documento|tipo\s+doc\.?|document\s+type)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: target.width < 115 ? fields.docTypeShort : fields.docType, align: 'left' };
        }
        if (/(documento(\s+de\s+identidad)?|numero\s+de\s+documento|no\.?\s*documento|identificacion|cedula|c\.c\.|id\s+number|document)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.docNum, align: 'left' };
        }
        if (/(fecha\s+(del?\s+)?(salto|vuelo|actividad|experiencia|reserva)|jump\s+date)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.jumpDate, align: 'left' };
        }
        if (/(fecha\s+de\s+nacimiento|f\.?\s*nacimiento|birth\s*date|date\s+of\s+birth)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.dob, align: 'left' };
        }
        if (/(fecha(\s+de\s+(aceptacion|firma|diligenciamiento|registro))?|date)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.signedDate, align: 'left' };
        }
        if (/(telefono|celular|whatsapp|movil|phone|contacto)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.phone, align: 'left' };
        }
        if (/(correo(\s+electronico)?|e-?mail)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.email, align: 'left' };
        }
        if (/(peso(\s*\(kg\)|\s+corporal)?|weight)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.weight, align: 'left' };
        }
        if (/(direccion(\s+de\s+residencia)?|domicilio|address)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.address, align: 'left' };
        }
        if (/(ubicacion|ciudad\s+y\s+pais|location)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.locationStr, align: 'left' };
        }
        if (/(ciudad|municipio|city)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.city, align: 'left' };
        }
        if (/(departamento|depto\.?|estado|state)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.state, align: 'left' };
        }
        if (/(pais|country)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.country, align: 'left' };
        }
        if (/(ocupacion|profesion|occupation)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.occupation, align: 'left' };
        }
        if (/(actividades\s+favoritas|hobbies|intereses|favorite\s+activities)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.favActivities, align: 'left' };
        }
        if (/(como\s+nos\s+conocio|referido|asesor|how\s+did\s+you\s+hear)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.contactMethod, align: 'left' };
        }
        if (/(condicion(es)?\s+medica(s)?|alergias|enfermedades|salud|observaciones\s+medicas|medical)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.medical, align: 'left' };
        }
        if (/(tipo\s+de\s+salto|modalidad|experiencia|servicio|jump\s+type)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.jumpType, align: 'left' };
        }
        if (/(camara(s)?|video|foto|adicionales)\s*:?\s*$/.test(prev)) {
            return { kind: 'text', value: fields.cams, align: 'left' };
        }

        return null;
    },

    fillUploadedPdfTemplate: async function(existingBytes, docKey, paxData = {}, lang = 'es') {
        const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
        const fields = this.buildPassengerFieldsMap(paxData, lang);
        const pdfDoc = await PDFDocument.load(existingBytes);
        const pages = pdfDoc.getPages();
        const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const inkColor = rgb(0.05, 0.14, 0.35);

        // Pre-embed electronic signature PNG (if present)
        let embeddedSig = null;
        const sigUrl = (paxData.signatureMinor && paxData.signatureMinor.mother) ? paxData.signatureMinor.mother : paxData.signature;
        if (sigUrl) {
            try {
                const pngBytes = await fetch(sigUrl).then(r => r.arrayBuffer());
                embeddedSig = await pdfDoc.embedPng(pngBytes);
            } catch (e) {
                console.warn('Could not embed signature PNG in uploaded PDF:', e);
            }
        }

        // Attempt AcroForm filling if the uploaded PDF has interactive form fields
        try {
            const form = pdfDoc.getForm();
            const acroFields = form.getFields();
            acroFields.forEach(af => {
                if (typeof af.setText !== 'function') return;
                const fname = (af.getName() || '').toLowerCase();
                if (fname.includes('nombre') || fname.includes('name')) af.setText(this.sanitizeWinAnsi(fields.fullName));
                else if (fname.includes('tipo') && fname.includes('doc')) af.setText(this.sanitizeWinAnsi(fields.docTypeShort));
                else if (fname.includes('doc') || fname.includes('cedula')) af.setText(this.sanitizeWinAnsi(fields.docNum));
                else if (fname.includes('inicial')) af.setText(this.sanitizeWinAnsi(fields.initials));
                else if (fname.includes('salto')) af.setText(this.sanitizeWinAnsi(fields.jumpDate));
                else if (fname.includes('fecha') || fname.includes('date')) af.setText(this.sanitizeWinAnsi(fields.signedDate));
                else if (fname.includes('peso') || fname.includes('weight')) af.setText(this.sanitizeWinAnsi(fields.weight));
                else if (fname.includes('tel') || fname.includes('phone')) af.setText(this.sanitizeWinAnsi(fields.phone));
                else if (fname.includes('mail') || fname.includes('correo')) af.setText(this.sanitizeWinAnsi(fields.email));
            });
        } catch (e) {}

        let signaturePlaced = false;

        // Locate exact text & underscore coordinates via PDF.js and draw passenger data in-place
        if (window.pdfjsLib && typeof window.pdfjsLib.getDocument === 'function') {
            try {
                const bytesCopy = new Uint8Array(existingBytes.slice(0));
                const loadingTask = window.pdfjsLib.getDocument({ data: bytesCopy });
                const pdfJsDoc = await loadingTask.promise;

                for (let pIdx = 0; pIdx < Math.min(pdfJsDoc.numPages, pages.length); pIdx++) {
                    const pdfJsPage = await pdfJsDoc.getPage(pIdx + 1);
                    const textContent = await pdfJsPage.getTextContent();
                    const page = pages[pIdx];
                    const { width: pageWidth } = page.getSize();

                    const lines = this.groupPdfJsItemsIntoLines(textContent.items || []);
                    const targets = this.extractFieldTargetsFromLines(lines, pageWidth);

                    for (const target of targets) {
                        const spec = this.resolveFieldSpecForTarget(target, fields);
                        if (!spec) continue;

                        if (spec.kind === 'signature') {
                            if (embeddedSig) {
                                const maxSigW = Math.min(Math.max(target.width, 95), 145);
                                const sigH = 28;
                                const dims = embeddedSig.scaleToFit(maxSigW, sigH);
                                page.drawImage(embeddedSig, {
                                    x: target.x + 2,
                                    y: Math.max(12, target.y - 4),
                                    width: dims.width,
                                    height: dims.height
                                });
                                signaturePlaced = true;
                            }
                        } else if (spec.kind === 'text' && spec.value) {
                            const safeVal = this.sanitizeWinAnsi(spec.value);
                            if (!safeVal) continue;
                            const chosenFont = spec.bold ? fontBold : fontRegular;
                            let fontSize = Math.min(10, Math.max(8, target.height * 0.92));
                            const maxWidth = Math.max(target.width - 4, 24);
                            let txtW = chosenFont.widthOfTextAtSize(safeVal, fontSize);
                            while (txtW > maxWidth && fontSize > 6.5) {
                                fontSize -= 0.5;
                                txtW = chosenFont.widthOfTextAtSize(safeVal, fontSize);
                            }
                            let drawX = target.x + 2;
                            if (spec.align === 'center' && txtW < target.width) {
                                drawX = target.x + (target.width - txtW) / 2;
                            }
                            page.drawText(safeVal, {
                                x: drawX,
                                y: target.y + 2,
                                size: fontSize,
                                font: chosenFont,
                                color: inkColor
                            });
                        }
                    }
                }
            } catch (pdfJsErr) {
                console.warn('PDF.js text extraction warning, applying fallback stamp:', pdfJsErr);
            }
        }

        // If no dedicated "Firma:" field existed on the uploaded PDF (e.g. Guía / Términos),
        // stamp the clean electronic signature & acceptance record on the last page
        if (!signaturePlaced && pages.length > 0) {
            const lastPage = pages[pages.length - 1];
            const { width } = lastPage.getSize();
            if (embeddedSig) {
                const dims = embeddedSig.scaleToFit(130, 38);
                lastPage.drawImage(embeddedSig, {
                    x: width - dims.width - 45,
                    y: 26,
                    width: dims.width,
                    height: dims.height
                });
            }
            lastPage.drawText(this.sanitizeWinAnsi(`Nombre completo: ${fields.fullName} | Documento: ${fields.docTypeShort} ${fields.docNum}`), {
                x: 40,
                y: 42,
                size: 8,
                font: fontBold,
                color: inkColor
            });
            lastPage.drawText(this.sanitizeWinAnsi(`Iniciales: ${fields.initials} | Fecha de aceptación: ${fields.signedDate}`), {
                x: 40,
                y: 30,
                size: 8,
                font: fontRegular,
                color: inkColor
            });
        }

        return await pdfDoc.save();
    },

    generateSingleDocArrayBuffer: async function(docKey, paxData = {}, lang = 'es') {
        const catalog = this.getDocsCatalog(lang);
        const docMeta = catalog.find(d => d.key === docKey) || catalog[0];

        // Check if admin uploaded a custom PDF in Settings -> Documentos Legales
        const fullKey = `${docMeta.key}_${lang === 'en' ? 'en' : 'es'}`;
        const customArr = window.AppData?.legalDocs?.[fullKey];
        const latestCustom = (customArr && customArr.length > 0) ? customArr[customArr.length - 1] : null;

        if (latestCustom && latestCustom.dataUrl && window.PDFLib) {
            try {
                const existingBytes = await fetch(latestCustom.dataUrl).then(r => r.arrayBuffer());
                return await this.fillUploadedPdfTemplate(existingBytes, docMeta.key, paxData, lang);
            } catch (e) {
                console.warn("Fallback to jsPDF for custom legal doc:", e);
            }
        }

        const jsPdfDoc = this.buildSingleDocJsPdf(docMeta, paxData, lang);
        return jsPdfDoc.output('arraybuffer');
    },

    generateConsolidatedPdfBytes: async function(paxData = {}, lang = 'es') {
        const docKeys = ['bienvenida', 'terminos', 'ficha', 'exoneracion'];
        if (window.PDFLib) {
            try {
                const { PDFDocument } = window.PDFLib;
                const mergedPdf = await PDFDocument.create();
                for (const dKey of docKeys) {
                    const buf = await this.generateSingleDocArrayBuffer(dKey, paxData, lang);
                    const singleDoc = await PDFDocument.load(buf);
                    const copied = await mergedPdf.copyPages(singleDoc, singleDoc.getPageIndices());
                    copied.forEach(p => mergedPdf.addPage(p));
                }
                return await mergedPdf.save();
            } catch (e) {
                console.warn("PDFLib merge fallback to consolidated jsPDF:", e);
            }
        }
        const consolidated = this.buildConsolidatedJsPdf(paxData, lang);
        return consolidated.output('arraybuffer');
    },

    downloadConsolidatedPdf: async function(paxData = {}, lang = 'es') {
        const bytes = await this.generateConsolidatedPdfBytes(paxData, lang);
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const safeId = (paxData.doc || paxData.name || 'Pasajero').toString().replace(/\s+/g, '_');
        link.download = `Documentos_Legales_Consolidados_${safeId}.pdf`;
        link.click();
    },

    generateAllSignedLegalDocs: async function(paxData = {}, lang = 'es') {
        const catalog = this.getDocsCatalog(lang);
        const result = {};
        for (const docMeta of catalog) {
            const pdf = this.buildSingleDocJsPdf(docMeta, paxData, lang);
            const dataUri = pdf.output('datauristring');
            result[docMeta.key] = dataUri;
            if (docMeta.key === 'bienvenida') {
                result.guia = dataUri;
            }
        }
        return result;
    },

    downloadSingleDocPdf: async function(docKey, paxData = {}, lang = 'es') {
        const catalog = this.getDocsCatalog(lang);
        const docMeta = catalog.find(d => d.key === docKey) || catalog[0];
        const buffer = await this.generateSingleDocArrayBuffer(docKey, paxData, lang);
        const blob = new Blob([buffer], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const safeName = (paxData.doc || paxData.name || 'Pasajero').toString().replace(/\s+/g, '_');
        link.download = `${docMeta.num}_${docMeta.key}_${safeName}.pdf`;
        link.click();
    },

    openLegalDocPreviewModal: function(docKey, paxData = {}, lang = 'es') {
        const catalog = this.getDocsCatalog(lang);
        const docMeta = catalog.find(d => d.key === docKey) || catalog[0];
        const fullName = (paxData.name || 'Participante').trim();
        const docType = paxData.docType || 'CC';
        const docNum = paxData.doc || 'S/D';
        const signedDate = paxData.signedAt || paxData.latestJumpDate || new Date().toLocaleDateString('es-CO');
        const initials = this.computeInitials(fullName);

        const bodyText = this.buildPopulatedBodyText(docMeta, paxData, lang);

        const sigMinor = paxData.signatureMinor;
        const sigMain = paxData.signature;
        let sigHtml = '';
        if (sigMinor && (sigMinor.mother || sigMinor.father)) {
            sigHtml = `
                <div style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap;">
                    ${sigMinor.mother ? `<div style="text-align: center;"><span style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:0.4rem;">Firma Tutor Legal 1</span><img src="${sigMinor.mother}" style="height: 90px; background: #fff; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color);"></div>` : ''}
                    ${sigMinor.father ? `<div style="text-align: center;"><span style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:0.4rem;">Firma Tutor Legal 2</span><img src="${sigMinor.father}" style="height: 90px; background: #fff; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color);"></div>` : ''}
                </div>
            `;
        } else if (sigMain) {
            sigHtml = `
                <div style="text-align: center;">
                    <span style="display:block; font-size:0.8rem; font-weight:600; margin-bottom:0.4rem; text-transform: uppercase; letter-spacing: 0.5px;">Firma</span>
                    <img src="${sigMain}" alt="Firma del Pasajero" style="height: 100px; max-width: 100%; background: #fff; padding: 0.5rem; border-radius: 6px; border: 1px solid var(--border-color); box-shadow: 0 2px 6px rgba(0,0,0,0.08);">
                </div>
            `;
        } else {
            sigHtml = `<div style="color: var(--brand-danger); font-weight: 600; text-align: center;"><i class="fas fa-exclamation-triangle"></i> Sin firma digital registrada</div>`;
        }

        const overlay = document.createElement('div');
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';

        overlay.innerHTML = `
            <div class="fraterno-modal-card" style="width: 750px; max-width: 95%; max-height: 90vh; display: flex; flex-direction: column;">
                <button id="close-legal-prev-top" class="btn" style="position: absolute; top: 1.25rem; right: 1.25rem; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                <h3><i class="fas fa-file-signature" style="color: var(--brand-action);"></i> ${window.escapeHTML(docMeta.title)}</h3>
                
                <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; background: var(--bg-surface-hover); padding: 0.85rem 1.2rem; border-radius: 10px; margin-bottom: 1rem; border: 1px solid var(--border-color); font-size: 0.9rem;">
                    <div><strong>Nombre completo:</strong> ${window.escapeHTML(fullName)}</div>
                    <div><strong>Documento:</strong> <span style="font-family: monospace;">${window.escapeHTML(docType)} ${window.escapeHTML(docNum)}</span></div>
                    <div><strong>Iniciales:</strong> ${window.escapeHTML(initials)}</div>
                    <div><span style="color: var(--brand-success); font-weight: 700;"><i class="fas fa-check-circle"></i> Fecha: ${window.escapeHTML(signedDate)}</span></div>
                </div>

                <div id="legal-preview-body" style="flex: 1; overflow-y: auto; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; line-height: 1.65; font-size: 0.92rem; color: var(--text-primary); white-space: pre-wrap;">${window.escapeHTML(bodyText)}

<div style="margin-top: 1.5rem; padding: 1.25rem; background: var(--bg-surface-hover); border: 1px dashed var(--brand-action); border-radius: 10px; white-space: normal;">
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.5rem; margin-bottom: 1rem; font-size: 0.85rem;">
        <div><strong>Nombre completo:</strong> ${window.escapeHTML(fullName)}</div>
        <div><strong>Documento:</strong> ${window.escapeHTML(docType)} ${window.escapeHTML(docNum)}</div>
        <div><strong>Iniciales del participante:</strong> ${window.escapeHTML(initials)}</div>
        <div><strong>Fecha:</strong> ${window.escapeHTML(signedDate)}</div>
    </div>
    ${sigHtml}
</div></div>

                <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-outline" id="btn-dl-all-consolidated"><i class="fas fa-layer-group"></i> Descargar 4 Docs Consolidados</button>
                    <button class="btn btn-primary" id="btn-dl-single-legal"><i class="fas fa-file-pdf"></i> Descargar Este PDF</button>
                    <button class="btn btn-outline" id="close-legal-prev-btn">Cerrar</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Si existe una plantilla PDF personalizada cargada en Configuración, previsualizar el PDF ya diligenciado
        const customKey = `${docMeta.key}_${lang === 'en' ? 'en' : 'es'}`;
        const customArr = window.AppData?.legalDocs?.[customKey];
        const hasCustomPdf = Boolean(customArr && customArr.length > 0 && customArr[customArr.length - 1].dataUrl && window.PDFLib);
        let previewBlobUrl = null;
        if (hasCustomPdf) {
            const previewContainer = overlay.querySelector('#legal-preview-body');
            if (previewContainer) {
                previewContainer.style.padding = '0.5rem';
                previewContainer.style.whiteSpace = 'normal';
                previewContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-secondary);"><i class="fas fa-spinner fa-spin"></i> Generando vista previa del PDF diligenciado...</div>`;
                this.generateSingleDocArrayBuffer(docKey, paxData, lang).then(buf => {
                    const blob = new Blob([buf], { type: 'application/pdf' });
                    previewBlobUrl = URL.createObjectURL(blob);
                    previewContainer.innerHTML = `<iframe src="${previewBlobUrl}" style="width: 100%; height: 60vh; border: none; border-radius: 8px; background: #fff;"></iframe>`;
                }).catch(err => {
                    console.warn('Error rendering custom PDF preview:', err);
                });
            }
        }

        const close = () => {
            if (previewBlobUrl) {
                try { URL.revokeObjectURL(previewBlobUrl); } catch (e) {}
            }
            overlay.remove();
        };
        overlay.querySelector('#close-legal-prev-top').addEventListener('click', close);
        overlay.querySelector('#close-legal-prev-btn').addEventListener('click', close);
        overlay.querySelector('#btn-dl-single-legal').addEventListener('click', () => {
            this.downloadSingleDocPdf(docKey, paxData, lang);
        });
        const btnAll = overlay.querySelector('#btn-dl-all-consolidated');
        if (btnAll) {
            btnAll.addEventListener('click', () => {
                this.downloadConsolidatedPdf(paxData, lang);
            });
        }
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    }
};

// ==========================================
// Email Alerts for Incomplete Payment <= 10 Days (Req #9)
// ==========================================
window.PaymentAlertsHelper = {
    getDaysUntilJump: function(dateStrYMD) {
        if (!dateStrYMD || !/^\d{4}-\d{2}-\d{2}$/.test(dateStrYMD)) return null;
        const jumpDate = new Date(dateStrYMD + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const diffMs = jumpDate.getTime() - today.getTime();
        return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    },

    getQualifyingReservations: function() {
        const passengers = window.AppData?.passengers || [];
        const list = [];

        passengers.forEach(p => {
            const isCancelled = (p.paxStatus && p.paxStatus.includes('Cancelado')) || (p.flightStatus && p.flightStatus.includes('Cancelado'));
            const isCompleted = p.paxStatus === 'Completado' || p.flightStatus === 'Completado' || p.flightStatus === 'Aterrizó';
            if (isCancelled || isCompleted) return;

            const daysRemaining = this.getDaysUntilJump(p.date);
            if (daysRemaining === null || daysRemaining < 0 || daysRemaining > 10) return;

            const finSummary = window.getPaxFinancialSummary(p);
            if (!finSummary.isComplete) {
                list.push({
                    pax: p,
                    daysRemaining,
                    totalValue: finSummary.totalValue,
                    totalPaid: finSummary.totalPaid,
                    pending: finSummary.pending
                });
            }
        });

        list.sort((a, b) => a.daysRemaining - b.daysRemaining);
        return list;
    },

    getEligiblePassengers: function() {
        return this.getQualifyingReservations();
    },

    sendPaymentAlertEmail: async function(item, silent = true) {
        return this.sendEmailAlert(item, silent);
    },

    sendEmailAlert: async function(item, silent = false) {
        const p = item.pax;
        const adminUsers = (window.AppData?.users || []).filter(u => u.email).map(u => u.email);
        const backupEmail = window.AppData?.backupConfig?.email || 'admin@fraternoparacaidismo.com';
        const recipients = [p.email, ...adminUsers, backupEmail].filter(Boolean);

        const payload = {
            passengerId: p.id,
            passengerName: p.name,
            passengerDoc: p.doc,
            passengerEmail: p.email || 'Sin correo registrado',
            recipients: Array.from(new Set(recipients)),
            jumpDate: p.date,
            daysRemaining: item.daysRemaining,
            totalValue: item.totalValue,
            totalPaid: item.totalPaid,
            pendingBalance: item.pending
        };

        let apiResult = { success: true, mode: 'local' };
        try {
            const res = await fetch('/api/send-payment-alert', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                apiResult = await res.json();
            }
        } catch (err) {
            console.warn('Email API offline, recording alert locally:', err);
        }

        const todayStr = new Date().toLocaleDateString('en-CA');
        const timestamp = new Date().toLocaleString('es-CO');
        p.lastPaymentAlertDate = todayStr;
        p.lastPaymentAlertAt = timestamp;

        window.AppData.emailAlertsLog = window.AppData.emailAlertsLog || [];
        window.AppData.emailAlertsLog.unshift({
            id: 'alert_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            paxId: p.id,
            paxName: p.name,
            paxEmail: p.email || 'N/A',
            jumpDate: p.date,
            daysRemaining: item.daysRemaining,
            pendingBalance: item.pending,
            sentAt: timestamp,
            recipients: payload.recipients.join(', ')
        });
        if (window.AppData.emailAlertsLog.length > 100) {
            window.AppData.emailAlertsLog.length = 100;
        }
        if (window.saveAppData) window.saveAppData();

        if (!silent) {
            const fmt = (n) => '$' + parseInt(n || 0, 10).toLocaleString('es-CO');
            window.showAlert(
                `Alerta de pago incompleto enviada por correo electrónico.\n\n` +
                `• Pasajero: ${p.name} (${p.email || 'Sin correo'})\n` +
                `• Fecha de Salto: ${p.date} (Faltan ${item.daysRemaining} día(s))\n` +
                `• Saldo Pendiente: ${fmt(item.pending)}\n` +
                `• Destinatarios notificados: ${payload.recipients.join(', ')}`,
                { type: 'success', title: 'Alerta de Correo Enviada' }
            );
        }
        return apiResult;
    },

    runAutoCheckOnLoad: async function() {
        const todayStr = new Date().toLocaleDateString('en-CA');
        const qualifying = this.getQualifyingReservations();
        const unsentToday = qualifying.filter(item => item.pax.lastPaymentAlertDate !== todayStr);
        for (const item of unsentToday) {
            await this.sendEmailAlert(item, true);
        }
    },

    openAlertsCenterModal: function(onAfterSend) {
        const qualifying = this.getQualifyingReservations();
        const logs = (window.AppData?.emailAlertsLog || []).slice(0, 15);
        const fmt = (n) => '$' + parseInt(n || 0, 10).toLocaleString('es-CO');

        const rowsHtml = qualifying.length === 0
            ? `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--text-secondary);">No hay reservas con pago incompleto a 10 días o menos del salto.</td></tr>`
            : qualifying.map((item, idx) => `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 0.75rem;">
                        <strong>${window.escapeHTML(item.pax.name)}</strong><br>
                        <small style="color: var(--text-secondary);">${window.escapeHTML(item.pax.email || 'Sin correo')}</small>
                    </td>
                    <td style="padding: 0.75rem;">${window.escapeHTML(item.pax.date)}</td>
                    <td style="padding: 0.75rem;">
                        <span style="background: rgba(220, 38, 38, 0.12); color: var(--brand-danger); padding: 3px 8px; border-radius: 12px; font-weight: 700; font-size: 0.8rem;">
                            ${item.daysRemaining === 0 ? '¡HOY!' : item.daysRemaining + ' día(s)'}
                        </span>
                    </td>
                    <td style="padding: 0.75rem; color: var(--brand-danger); font-weight: 700;">${fmt(item.pending)}</td>
                    <td style="padding: 0.75rem; font-size: 0.8rem; color: var(--text-secondary);">
                        ${item.pax.lastPaymentAlertAt ? `<span style="color: var(--brand-success);"><i class="fas fa-check-double"></i> ${window.escapeHTML(item.pax.lastPaymentAlertAt)}</span>` : 'Pendiente envío'}
                    </td>
                    <td style="padding: 0.75rem; text-align: center;">
                        <button class="btn btn-primary btn-sm btn-send-single-alert" data-idx="${idx}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
                            <i class="fas fa-paper-plane"></i> Enviar Alerta
                        </button>
                    </td>
                </tr>
            `).join('');

        const overlay = document.createElement('div');
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';

        overlay.innerHTML = `
            <div class="fraterno-modal-card" style="width: 850px; max-width: 96%; max-height: 90vh; display: flex; flex-direction: column;">
                <button id="close-alerts-center-top" class="btn" style="position: absolute; top: 1.25rem; right: 1.25rem; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                <h3><i class="fas fa-envelope-open-text" style="color: var(--brand-warning);"></i> Alertas por Correo Electrónico (Pago Incompleto ≤ 10 Días)</h3>
                
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">
                    El sistema detecta automáticamente las reservas que no cuentan con pago completo y cuya fecha de salto es en <strong>10 días o menos</strong>, enviando alertas por correo electrónico al cliente y a los usuarios del sistema.
                </p>

                <div style="flex: 1; overflow-y: auto; border: 1px solid var(--border-color); border-radius: 10px; background: var(--bg-main); margin-bottom: 1rem;">
                    <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
                        <thead>
                            <tr style="background: var(--bg-surface-hover); border-bottom: 1px solid var(--border-color);">
                                <th style="padding: 0.75rem;">Pasajero / Correo</th>
                                <th style="padding: 0.75rem;">Fecha Salto</th>
                                <th style="padding: 0.75rem;">Días Restantes</th>
                                <th style="padding: 0.75rem;">Saldo Pendiente</th>
                                <th style="padding: 0.75rem;">Última Alerta</th>
                                <th style="padding: 0.75rem; text-align: center;">Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${rowsHtml}
                        </tbody>
                    </table>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 1rem; flex-wrap: wrap; gap: 0.75rem;">
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">
                        <i class="fas fa-history"></i> Total alertas enviadas en historial: <strong>${(window.AppData?.emailAlertsLog || []).length}</strong>
                    </span>
                    <div style="display: flex; gap: 0.75rem;">
                        ${qualifying.length > 0 ? `<button class="btn btn-warning" id="btn-send-all-alerts"><i class="fas fa-mail-bulk"></i> Enviar Alerta a Todos (${qualifying.length})</button>` : ''}
                        <button class="btn btn-outline" id="close-alerts-center-btn">Cerrar</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.querySelector('#close-alerts-center-top').addEventListener('click', close);
        overlay.querySelector('#close-alerts-center-btn').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

        overlay.querySelectorAll('.btn-send-single-alert').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                const item = qualifying[idx];
                if (!item) return;
                e.currentTarget.disabled = true;
                e.currentTarget.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                await this.sendEmailAlert(item, false);
                close();
                if (typeof onAfterSend === 'function') onAfterSend();
            });
        });

        const btnAll = overlay.querySelector('#btn-send-all-alerts');
        if (btnAll) {
            btnAll.addEventListener('click', async () => {
                btnAll.disabled = true;
                btnAll.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando Alertas...';
                for (const item of qualifying) {
                    await this.sendEmailAlert(item, true);
                }
                close();
                window.showAlert(`Se han enviado ${qualifying.length} alerta(s) de correo electrónico exitosamente.`, { type: 'success', title: 'Alertas Enviadas' });
                if (typeof onAfterSend === 'function') onAfterSend();
            });
        }
    }
};

// =====================================
// Sistema de Seguridad e Inmutabilidad del Maestro de Valores (TariffGuard)
// Garantiza que las actualizaciones de tarifas solo apliquen a registros futuros
// y jamás alteren reservas, liquidaciones o facturación histórica.
// =====================================
window.TariffGuard = {
    DEFAULT_MAESTRO_VALORES: [
        { name: 'Acompañamiento Examen Licencia', price: '0', comision: '0' },
        { name: 'Alquiler de equipo', price: '0', comision: '0' },
        { name: 'Cámara 360', price: '150.000', comision: '0' },
        { name: 'Cámara Externa', price: '250.000', comision: '0' },
        { name: 'Cámara Go-Pro', price: '100.000', comision: '0' },
        { name: 'Coach', price: '0', comision: '0' },
        { name: 'Copiloto', price: '0', comision: '0' },
        { name: 'Curso Aterrizajes en Agua', price: '0', comision: '0' },
        { name: 'Curso Control Cúpula', price: '0', comision: '0' },
        { name: 'Curso de Empaque', price: '0', comision: '0' },
        { name: 'Empaque de Reserva', price: '0', comision: '0' },
        { name: 'Empaque Escuela', price: '0', comision: '0' },
        { name: 'Empaque Tandem', price: '0', comision: '0' },
        { name: 'Fun Jumper', price: '0', comision: '0' },
        { name: 'Hora de Teoría', price: '0', comision: '0' },
        { name: 'Salto AFF', price: '0', comision: '0' },
        { name: 'Salto AFF 1', price: '0', comision: '0' },
        { name: 'Salto AFF 2', price: '0', comision: '0' },
        { name: 'Salto Tandem', price: '1.500.000', comision: '0' },
        { name: 'Teoría AFF', price: '0', comision: '0' },
        { name: 'Valor KG Extra', price: '5.000', comision: '0' }
    ],

    parseMoney(val) {
        if (typeof val === 'number' && !isNaN(val)) return Math.round(val);
        if (val === null || val === undefined || val === '') return 0;
        const digits = String(val).replace(/\D/g, '');
        return digits ? parseInt(digits, 10) : 0;
    },

    cloneMaestro(list) {
        if (!Array.isArray(list)) return [];
        return list.map(item => ({
            name: String(item?.name || '').trim(),
            price: String(item?.price ?? '0'),
            comision: String(item?.comision ?? '0')
        }));
    },

    normalizeItemName(name) {
        const raw = String(name || '').trim();
        if (!raw) return '';
        if (raw === 'Honorario Salto Tandem' || raw === 'Tandem') return 'Salto Tandem';
        if (raw === 'Cámara GoPro' || raw === 'Camara GoPro' || raw === 'Camara Go-Pro') return 'Cámara Go-Pro';
        if (raw === 'Camara 360') return 'Cámara 360';
        if (raw === 'Camara Externa') return 'Cámara Externa';
        return raw;
    },

    ensureVersionMetadata() {
        window.AppData = window.AppData || {};
        if (!Array.isArray(window.AppData.maestroValores) || window.AppData.maestroValores.length === 0) {
            window.AppData.maestroValores = this.cloneMaestro(this.DEFAULT_MAESTRO_VALORES);
        } else {
            window.AppData.maestroValores.forEach(item => {
                if (item.name === 'Honorario Salto Tandem') item.name = 'Salto Tandem';
                if (item.comision === undefined || item.comision === null) item.comision = '0';
                if (item.price === undefined || item.price === null) item.price = '0';
            });
            if (!window.AppData.maestroValores.some(i => i.name === 'Fun Jumper')) {
                window.AppData.maestroValores.push({ name: 'Fun Jumper', price: '0', comision: '0' });
            }
            if (!window.AppData.maestroValores.some(i => i.name === 'Copiloto')) {
                window.AppData.maestroValores.push({ name: 'Copiloto', price: '0', comision: '0' });
            }
        }

        if (typeof window.AppData.maestroValoresVersion !== 'number' || window.AppData.maestroValoresVersion < 1) {
            window.AppData.maestroValoresVersion = 1;
        }
        if (!Array.isArray(window.AppData.maestroValoresHistory)) {
            window.AppData.maestroValoresHistory = [];
        }
        if (window.AppData.maestroValoresHistory.length === 0) {
            window.AppData.maestroValoresHistory.push({
                version: window.AppData.maestroValoresVersion,
                effectiveFrom: '1970-01-01T00:00:00.000Z',
                updatedBy: 'Sistema (Tarifa Inicial)',
                changes: [],
                protectedCounts: { passengers: 0, packers: 0, facturas: 0 },
                items: this.cloneMaestro(window.AppData.maestroValores)
            });
        }
        return window.AppData.maestroValoresVersion;
    },

    buildTariffSnapshot(sourceList = null, version = null) {
        const currentVersion = this.ensureVersionMetadata();
        return {
            version: version || currentVersion,
            capturedAt: new Date().toISOString(),
            items: this.cloneMaestro(sourceList || window.AppData.maestroValores)
        };
    },

    lookupInList(list, itemName, field = 'price') {
        if (!Array.isArray(list) || !itemName) return 0;
        const normalized = this.normalizeItemName(itemName);
        let item = list.find(x => x.name === itemName);
        if (!item && normalized !== itemName) {
            item = list.find(x => x.name === normalized);
        }
        if (!item) {
            const lower = normalized.toLowerCase();
            item = list.find(x => this.normalizeItemName(x.name).toLowerCase() === lower);
        }
        return item ? this.parseMoney(item[field]) : 0;
    },

    resolveJumpTypeItemName(jumpType, list = null) {
        const items = Array.isArray(list) ? list : (window.AppData?.maestroValores || []);
        const raw = String(jumpType || '').trim();
        if (!raw || raw === 'Tandem' || raw === 'Salto Tandem') return 'Salto Tandem';
        const exact = items.find(x => x.name === raw);
        if (exact) return exact.name;
        if (raw.toUpperCase().includes('AFF')) return 'Salto AFF';
        if (raw.toLowerCase().includes('fun')) return 'Fun Jumper';
        if (raw.toLowerCase().includes('copiloto')) return 'Copiloto';
        return 'Salto Tandem';
    },

    getEffectiveMaestroForRecord(record) {
        this.ensureVersionMetadata();
        // 1. Prioridad máxima: snapshot inmutable congelado en el registro
        if (record && record.tariffSnapshot && Array.isArray(record.tariffSnapshot.items) && record.tariffSnapshot.items.length > 0) {
            return record.tariffSnapshot.items;
        }
        // 2. Respaldo cronológico por fecha de creación contra historial de versiones
        const recordTs = record && (record.createdAt || record.signedAt || (record.acceptedDocs && record.acceptedDocs.date));
        if (recordTs && Array.isArray(window.AppData.maestroValoresHistory) && window.AppData.maestroValoresHistory.length > 0) {
            const recTime = Date.parse(recordTs);
            if (!isNaN(recTime)) {
                let matched = null;
                for (const entry of window.AppData.maestroValoresHistory) {
                    const effTime = Date.parse(entry.effectiveFrom);
                    if (!isNaN(effTime) && effTime <= recTime) {
                        matched = entry;
                    }
                }
                if (matched && Array.isArray(matched.items) && matched.items.length > 0) {
                    return matched.items;
                }
            }
        }
        // 3. Registros nuevos / sin snapshot previo usan el Maestro vigente actual
        return window.AppData.maestroValores || [];
    },

    getPriceForRecord(record, itemName) {
        const list = this.getEffectiveMaestroForRecord(record);
        return this.lookupInList(list, itemName, 'price');
    },

    getComisionForRecord(record, itemName) {
        const list = this.getEffectiveMaestroForRecord(record);
        return this.lookupInList(list, itemName, 'comision');
    },

    computeDiff(oldItems, newItems) {
        const oldList = Array.isArray(oldItems) ? oldItems : [];
        const newList = Array.isArray(newItems) ? newItems : [];
        const changes = [];
        newList.forEach(nItem => {
            const name = String(nItem?.name || '').trim();
            if (!name) return;
            const oItem = oldList.find(x => x.name === name);
            const newPrice = this.parseMoney(nItem.price);
            const newCom = this.parseMoney(nItem.comision);
            if (!oItem) {
                changes.push({ name, oldPrice: 0, newPrice, oldComision: 0, newComision: newCom, isNew: true });
            } else {
                const oldPrice = this.parseMoney(oItem.price);
                const oldCom = this.parseMoney(oItem.comision);
                if (oldPrice !== newPrice || oldCom !== newCom) {
                    changes.push({ name, oldPrice, newPrice, oldComision: oldCom, newComision: newCom, isNew: false });
                }
            }
        });
        return changes;
    },

    freezeExistingRecords(previousMaestro, previousVersion) {
        window.AppData = window.AppData || {};
        const prevItems = this.cloneMaestro(previousMaestro);
        const prevVer = previousVersion || 1;
        const freezeTs = new Date(Date.now() - 1000).toISOString();

        let frozenPassengersCount = 0;
        let frozenPackersCount = 0;
        let frozenFacturasCount = 0;

        const passengers = window.AppData.passengers || [];
        passengers.forEach(p => {
            if (!p.tariffSnapshot || !Array.isArray(p.tariffSnapshot.items) || p.tariffSnapshot.items.length === 0) {
                const recTs = p.createdAt || p.signedAt || (p.acceptedDocs && p.acceptedDocs.date) || freezeTs;
                if (!p.createdAt) p.createdAt = recTs;
                p.tariffSnapshot = {
                    version: prevVer,
                    capturedAt: recTs,
                    items: this.cloneMaestro(prevItems)
                };
                if (!p.financiera) {
                    p.financiera = {};
                }
                if (p.financiera.manualPrice === undefined || p.financiera.manualPrice === null) {
                    const jName = this.resolveJumpTypeItemName(p.type, prevItems);
                    p.financiera.manualPrice = this.lookupInList(prevItems, jName, 'price');
                }
                frozenPassengersCount++;
            }
        });

        const packers = window.AppData.packerBilling || [];
        packers.forEach(r => {
            const needsUnitPrice = (typeof r.unitPrice !== 'number' || isNaN(r.unitPrice));
            const needsSnapshot = (!r.tariffSnapshot || !Array.isArray(r.tariffSnapshot.items) || r.tariffSnapshot.items.length === 0);
            if (needsUnitPrice || needsSnapshot) {
                const recTs = r.createdAt || freezeTs;
                if (!r.createdAt) r.createdAt = recTs;
                if (needsUnitPrice) {
                    const itemName = (r.type === 'Escuela') ? 'Empaque Escuela' : 'Empaque Tandem';
                    r.unitPrice = this.lookupInList(prevItems, itemName, 'price');
                }
                if (needsSnapshot) {
                    r.tariffSnapshot = {
                        version: prevVer,
                        capturedAt: recTs,
                        items: this.cloneMaestro(prevItems)
                    };
                }
                frozenPackersCount++;
            }
        });

        const facturas = window.AppData.facturas || [];
        facturas.forEach(f => {
            if (!f.tariffVersion) {
                f.tariffVersion = prevVer;
                if (!f.createdAt) f.createdAt = f.fecha ? `${f.fecha}T00:00:00.000Z` : freezeTs;
                frozenFacturasCount++;
            }
        });

        return {
            frozenPassengersCount,
            frozenPackersCount,
            frozenFacturasCount,
            totalPassengers: passengers.length,
            totalPackers: packers.length,
            totalFacturas: facturas.length
        };
    },

    applyMaestroUpdate(newItemsList, updatedBy = null) {
        const previousVersion = this.ensureVersionMetadata();
        const previousMaestro = this.cloneMaestro(window.AppData.maestroValores);
        const normalizedNew = this.cloneMaestro(newItemsList).map(item => ({
            name: item.name,
            price: String(this.parseMoney(item.price)),
            comision: String(this.parseMoney(item.comision))
        }));

        const changes = this.computeDiff(previousMaestro, normalizedNew);
        if (changes.length === 0) {
            return {
                changed: false,
                previousVersion,
                newVersion: previousVersion,
                changes: [],
                freezeStats: {
                    frozenPassengersCount: 0,
                    frozenPackersCount: 0,
                    frozenFacturasCount: 0,
                    totalPassengers: (window.AppData.passengers || []).length,
                    totalPackers: (window.AppData.packerBilling || []).length,
                    totalFacturas: (window.AppData.facturas || []).length
                }
            };
        }

        // Asegurar que la versión anterior quede registrada en el historial con sus valores reales previos
        const existingPrevHistory = window.AppData.maestroValoresHistory.find(h => h.version === previousVersion);
        if (!existingPrevHistory) {
            window.AppData.maestroValoresHistory.push({
                version: previousVersion,
                effectiveFrom: '1970-01-01T00:00:00.000Z',
                updatedBy: 'Sistema (Respaldo Automático)',
                changes: [],
                protectedCounts: {
                    passengers: (window.AppData.passengers || []).length,
                    packers: (window.AppData.packerBilling || []).length,
                    facturas: (window.AppData.facturas || []).length
                },
                items: this.cloneMaestro(previousMaestro)
            });
        } else if (previousVersion === 1 && window.AppData.maestroValoresHistory.length === 1) {
            // Mantener v1 sincronizada con el estado vigente previo al primer cambio
            existingPrevHistory.items = this.cloneMaestro(previousMaestro);
        }

        // 1. Congelar TODOS los registros históricos ANTES de aplicar los nuevos valores
        const freezeStats = this.freezeExistingRecords(previousMaestro, previousVersion);

        // 2. Publicar la nueva versión vigente SOLO para registros futuros
        const newVersion = previousVersion + 1;
        const effectiveFrom = new Date().toISOString();
        const actor = updatedBy || (typeof sessionStorage !== 'undefined' && (sessionStorage.getItem('fraterno_user') || sessionStorage.getItem('fraterno_username'))) || 'Administrador';

        window.AppData.maestroValores = normalizedNew.sort((a, b) => a.name.localeCompare(b.name));
        window.AppData.maestroValoresVersion = newVersion;
        window.AppData.maestroValoresHistory.push({
            version: newVersion,
            effectiveFrom,
            updatedBy: actor,
            changes,
            protectedCounts: {
                passengers: freezeStats.totalPassengers,
                packers: freezeStats.totalPackers,
                facturas: freezeStats.totalFacturas
            },
            items: this.cloneMaestro(window.AppData.maestroValores)
        });

        if (typeof window.saveAppData === 'function') window.saveAppData();

        return {
            changed: true,
            previousVersion,
            newVersion,
            effectiveFrom,
            changes,
            freezeStats
        };
    }
};

// =====================================
// Sistema de Soporte Técnico y Gestión de Casos (SupportSystem)
// - Usuarios estándar: reportan novedad (Nombre, Contacto, Novedad, Imagen opcional)
// - Exclusivo admin01: visualiza y gestiona todos los casos de soporte
// - Al iniciar sesión el usuario reportante: popup automático con la solución brindada
// =====================================
window.SupportSystem = {
    init() {
        const supportBtns = document.querySelectorAll('.btn-support');
        supportBtns.forEach(btn => {
            if (btn.dataset && btn.dataset.supportBound === '1') return;
            if (btn.dataset) btn.dataset.supportBound = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });
        this.updateSupportBadge();
    },

    getCurrentUser() {
        try {
            const raw = sessionStorage.getItem('fraterno_user');
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    },

    isSupportAdmin(user = null) {
        const u = user || this.getCurrentUser();
        return !!(u && String(u.username || '').trim().toLowerCase() === 'admin01');
    },

    ensureStore() {
        window.AppData = window.AppData || {};
        if (!Array.isArray(window.AppData.supportTickets)) {
            window.AppData.supportTickets = [];
        }
        return window.AppData.supportTickets;
    },

    getNextCode() {
        const tickets = this.ensureStore();
        let maxNum = 0;
        tickets.forEach(t => {
            const m = String(t.code || '').match(/(\d+)$/);
            if (m) {
                const n = parseInt(m[1], 10);
                if (n > maxNum) maxNum = n;
            }
        });
        return 'SUP-' + String(maxNum + 1).padStart(4, '0');
    },

    compressImageIfNeeded(dataUrl) {
        return new Promise((resolve) => {
            if (!dataUrl || typeof Image === 'undefined' || typeof document === 'undefined' || typeof document.createElement !== 'function') {
                return resolve(dataUrl || '');
            }
            try {
                const img = new Image();
                img.onload = () => {
                    try {
                        const maxDim = 1200;
                        let w = img.width || 0;
                        let h = img.height || 0;
                        if (!w || !h) return resolve(dataUrl);
                        if (w > maxDim || h > maxDim) {
                            const ratio = Math.min(maxDim / w, maxDim / h);
                            w = Math.round(w * ratio);
                            h = Math.round(h * ratio);
                        }
                        const canvas = document.createElement('canvas');
                        canvas.width = w;
                        canvas.height = h;
                        const ctx = canvas.getContext('2d');
                        if (!ctx || typeof ctx.drawImage !== 'function' || typeof canvas.toDataURL !== 'function') {
                            return resolve(dataUrl);
                        }
                        ctx.drawImage(img, 0, 0, w, h);
                        const compressed = canvas.toDataURL('image/jpeg', 0.82);
                        resolve(compressed && compressed.length < dataUrl.length ? compressed : dataUrl);
                    } catch (e) {
                        resolve(dataUrl);
                    }
                };
                img.onerror = () => resolve(dataUrl);
                img.src = dataUrl;
            } catch (e) {
                resolve(dataUrl);
            }
        });
    },

    createTicket({ reporterName, contactNumber, description, imageDataUrl = '', imageName = '' }) {
        const name = String(reporterName || '').trim();
        const contact = String(contactNumber || '').trim();
        const desc = String(description || '').trim();

        if (!name || !contact || !desc) {
            return { ok: false, error: 'Por favor completa tu nombre, número de contacto y la descripción de la novedad.' };
        }

        const user = this.getCurrentUser();
        const tickets = this.ensureStore();
        const ticket = {
            id: 'sup_' + Date.now() + '_' + Math.floor(Math.random() * 10000),
            code: this.getNextCode(),
            createdAt: new Date().toISOString(),
            createdByUserId: user && user.id ? user.id : '',
            createdByUsername: user && user.username ? String(user.username).trim() : '',
            reporterName: name,
            contactNumber: contact,
            description: desc,
            imageDataUrl: imageDataUrl || '',
            imageName: imageName || '',
            status: 'Pendiente',
            solution: '',
            resolvedAt: null,
            resolvedBy: '',
            userNotified: false,
            notifiedAt: null
        };

        tickets.push(ticket);
        if (typeof window.saveAppData === 'function') window.saveAppData();
        this.updateSupportBadge();
        return { ok: true, ticket };
    },

    resolveTicket(ticketId, solutionText) {
        if (!this.isSupportAdmin()) {
            return { ok: false, error: 'Acceso denegado: únicamente el usuario admin01 puede gestionar los casos de soporte.' };
        }
        const sol = String(solutionText || '').trim();
        if (!sol) {
            return { ok: false, error: 'Por favor ingresa la solución brindada antes de cerrar el caso.' };
        }

        const tickets = this.ensureStore();
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) {
            return { ok: false, error: 'Caso de soporte no encontrado.' };
        }

        ticket.status = 'Solucionado';
        ticket.solution = sol;
        ticket.resolvedAt = new Date().toISOString();
        ticket.resolvedBy = 'admin01';
        ticket.userNotified = false;
        ticket.notifiedAt = null;

        if (typeof window.saveAppData === 'function') window.saveAppData();
        this.updateSupportBadge();
        return { ok: true, ticket };
    },

    getPendingResolvedNotificationsForUser(user = null) {
        const u = user || this.getCurrentUser();
        if (!u) return [];
        const uName = String(u.username || '').trim().toLowerCase();
        const uId = String(u.id || '').trim();
        const tickets = this.ensureStore();

        return tickets.filter(t => {
            if (!t || t.status !== 'Solucionado' || t.userNotified) return false;
            const byUser = uName && String(t.createdByUsername || '').trim().toLowerCase() === uName;
            const byId = uId && String(t.createdByUserId || '').trim() === uId;
            return byUser || byId;
        });
    },

    acknowledgeNotifications(ticketIds) {
        const ids = new Set(Array.isArray(ticketIds) ? ticketIds : []);
        if (ids.size === 0) return;
        const tickets = this.ensureStore();
        const now = new Date().toISOString();
        let changed = false;
        tickets.forEach(t => {
            if (ids.has(t.id) && !t.userNotified) {
                t.userNotified = true;
                t.notifiedAt = now;
                changed = true;
            }
        });
        if (changed && typeof window.saveAppData === 'function') {
            window.saveAppData();
        }
    },

    updateSupportBadge() {
        const btn = document.querySelector('.btn-support');
        if (!btn) return;
        if (this.isSupportAdmin()) {
            const pendingCount = this.ensureStore().filter(t => t.status !== 'Solucionado').length;
            const badge = pendingCount > 0
                ? ` <span id="support-pending-badge" style="background: var(--brand-danger); color: #fff; font-size: 0.7rem; font-weight: 800; padding: 0.1rem 0.45rem; border-radius: 999px; margin-left: 0.25rem;">${pendingCount}</span>`
                : '';
            btn.innerHTML = `<i class="fas fa-headset"></i> Soporte${badge}`;
        } else {
            btn.innerHTML = `<i class="fas fa-headset"></i> Soporte`;
        }
    },

    open() {
        // Cerrar drawer móvil/tablet si está abierto
        const sb = document.getElementById('sidebar');
        const bd = document.getElementById('sidebar-backdrop');
        if (sb && sb.classList) sb.classList.remove('open');
        if (bd && bd.classList) bd.classList.remove('open');

        if (this.isSupportAdmin()) {
            this.openAdminPanel();
        } else {
            this.openUserReportModal();
        }
    },

    openImageLightbox(dataUrl, title = 'Imagen Adjunta') {
        if (!dataUrl) return;
        const existing = document.getElementById('modal-support-img-lightbox');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'modal-support-img-lightbox';
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';
        overlay.style.zIndex = '4000';
        overlay.innerHTML = `
            <div class="fraterno-modal-card" style="width: 720px; max-width: 95vw; text-align: center;">
                <button id="close-support-lightbox" class="btn" style="position: absolute; top: 1rem; right: 1rem; color: var(--text-secondary); font-size: 1.2rem;"><i class="fas fa-times"></i></button>
                <h3 style="margin-bottom: 1rem;"><i class="fas fa-image" style="color: var(--brand-action);"></i> ${window.escapeHTML(title)}</h3>
                <div style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 12px; padding: 0.75rem; margin-bottom: 1rem;">
                    <img src="${dataUrl}" alt="Evidencia de soporte" style="max-width: 100%; max-height: 65vh; object-fit: contain; border-radius: 8px;">
                </div>
                <div style="display: flex; justify-content: flex-end;">
                    <button type="button" class="btn btn-primary" id="btn-ok-support-lightbox">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.querySelector('#close-support-lightbox').addEventListener('click', close);
        overlay.querySelector('#btn-ok-support-lightbox').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    },

    openUserReportModal() {
        const existing = document.getElementById('modal-support-report');
        if (existing) existing.remove();

        const user = this.getCurrentUser();
        const defaultName = user && user.name ? user.name : '';
        const defaultContact = (user && (user.phone || user.tel || user.celular)) ? (user.phone || user.tel || user.celular) : '';

        const overlay = document.createElement('div');
        overlay.id = 'modal-support-report';
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';

        overlay.innerHTML = `
            <div class="fraterno-modal-card" style="width: 560px; max-width: 95vw; max-height: 92vh; overflow-y: auto;">
                <button type="button" id="btn-support-close-top" class="btn" style="position: absolute; top: 1rem; right: 1rem; color: var(--text-secondary); font-size: 1.2rem;"><i class="fas fa-times"></i></button>
                <h3><i class="fas fa-headset" style="color: var(--brand-action);"></i> Soporte Técnico — Reportar Novedad</h3>
                <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1.25rem;">
                    Cuéntanos la novedad o inconveniente que presentas con el sistema. Nuestro administrador gestionará tu caso y recibirás la respuesta al iniciar sesión.
                </p>

                <form id="support-report-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;" class="resp-grid-2">
                        <div class="form-group">
                            <label for="support-reporter-name">Tu Nombre *</label>
                            <input type="text" id="support-reporter-name" class="form-control" value="${window.escapeHTML(defaultName)}" placeholder="Nombre completo" required>
                        </div>
                        <div class="form-group">
                            <label for="support-contact-number">Número de Contacto *</label>
                            <input type="tel" id="support-contact-number" class="form-control" value="${window.escapeHTML(defaultContact)}" placeholder="Ej: 300 123 4567" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="support-description">Novedad con el sistema *</label>
                        <textarea id="support-description" class="form-control" rows="4" placeholder="Describe qué ocurrió, en qué módulo y cualquier detalle útil..." required></textarea>
                    </div>

                    <div class="form-group" style="margin-bottom: 1.25rem;">
                        <label for="support-image-input">Adjuntar Imagen / Captura de pantalla <span style="color: var(--text-muted); font-weight: 500;">(Opcional)</span></label>
                        <input type="file" id="support-image-input" class="form-control" accept="image/*" style="padding: 0.5rem;">
                        <div id="support-image-preview-wrap" style="display: none; margin-top: 0.75rem; padding: 0.75rem; background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 10px; align-items: center; justify-content: space-between; gap: 0.75rem;">
                            <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
                                <img id="support-image-preview" src="" alt="Vista previa" style="width: 64px; height: 64px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-color);">
                                <span id="support-image-name" style="font-size: 0.84rem; color: var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
                            </div>
                            <button type="button" id="support-remove-image" class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.8rem; color: var(--brand-danger);"><i class="fas fa-trash"></i> Quitar</button>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                        <button type="button" class="btn btn-outline" id="btn-support-cancel">Cancelar</button>
                        <button type="submit" class="btn btn-primary" id="btn-support-submit"><i class="fas fa-paper-plane"></i> Enviar Caso</button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);
        const close = () => overlay.remove();
        overlay.querySelector('#btn-support-close-top').addEventListener('click', close);
        overlay.querySelector('#btn-support-cancel').addEventListener('click', close);
        overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });

        let attachedImageDataUrl = '';
        let attachedImageName = '';

        const fileInput = overlay.querySelector('#support-image-input');
        const previewWrap = overlay.querySelector('#support-image-preview-wrap');
        const previewImg = overlay.querySelector('#support-image-preview');
        const previewName = overlay.querySelector('#support-image-name');
        const removeBtn = overlay.querySelector('#support-remove-image');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files && e.target.files[0];
                if (!file) {
                    attachedImageDataUrl = '';
                    attachedImageName = '';
                    previewWrap.style.display = 'none';
                    return;
                }
                attachedImageName = file.name || 'captura.png';
                const reader = new FileReader();
                reader.onload = async (ev) => {
                    const rawUrl = ev.target && ev.target.result ? String(ev.target.result) : '';
                    attachedImageDataUrl = await this.compressImageIfNeeded(rawUrl);
                    previewImg.src = attachedImageDataUrl;
                    previewName.textContent = attachedImageName;
                    previewWrap.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                attachedImageDataUrl = '';
                attachedImageName = '';
                if (fileInput) fileInput.value = '';
                previewWrap.style.display = 'none';
            });
        }

        overlay.querySelector('#support-report-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const reporterName = overlay.querySelector('#support-reporter-name').value;
            const contactNumber = overlay.querySelector('#support-contact-number').value;
            const description = overlay.querySelector('#support-description').value;

            const res = this.createTicket({
                reporterName,
                contactNumber,
                description,
                imageDataUrl: attachedImageDataUrl,
                imageName: attachedImageName
            });

            if (!res.ok) {
                if (window.showAlert) window.showAlert(res.error, { type: 'warning', title: 'Campos Obligatorios' });
                else alert(res.error);
                return;
            }

            close();
            const msg = `Tu caso de soporte (${res.ticket.code}) fue enviado correctamente. Cuando sea gestionado y solucionado, recibirás un aviso emergente al iniciar sesión.`;
            if (window.showAlert) window.showAlert(msg, { type: 'success', title: `Caso Registrado (${res.ticket.code})` });
            else alert(msg);
        });
    },

    openAdminPanel() {
        if (!this.isSupportAdmin()) {
            this.openUserReportModal();
            return;
        }

        const existing = document.getElementById('modal-support-admin');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.id = 'modal-support-admin';
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';

        let activeFilter = 'all';

        const renderPanelBody = () => {
            const tickets = this.ensureStore();
            const pendingCount = tickets.filter(t => t.status !== 'Solucionado').length;
            const resolvedCount = tickets.filter(t => t.status === 'Solucionado').length;

            const filtered = [...tickets]
                .filter(t => {
                    if (activeFilter === 'pending') return t.status !== 'Solucionado';
                    if (activeFilter === 'resolved') return t.status === 'Solucionado';
                    return true;
                })
                .sort((a, b) => {
                    // Pendientes primero, luego más recientes
                    if (a.status !== b.status) return a.status === 'Pendiente' ? -1 : 1;
                    return String(b.createdAt || '').localeCompare(String(a.createdAt || ''));
                });

            const listHtml = filtered.length === 0
                ? `<div style="text-align: center; padding: 2.5rem 1rem; color: var(--text-secondary);">
                        <i class="fas fa-inbox" style="font-size: 2.4rem; opacity: 0.35; display: block; margin-bottom: 0.65rem;"></i>
                        No hay casos de soporte en esta categoría.
                   </div>`
                : filtered.map(t => {
                    const isResolved = t.status === 'Solucionado';
                    const dateStr = t.createdAt ? new Date(t.createdAt).toLocaleString('es-CO') : '—';
                    const resDateStr = t.resolvedAt ? new Date(t.resolvedAt).toLocaleString('es-CO') : '';
                    const statusBadge = isResolved
                        ? `<span style="background: rgba(16, 185, 129, 0.14); color: var(--brand-success); border: 1px solid rgba(16, 185, 129, 0.35); padding: 0.2rem 0.65rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700;"><i class="fas fa-check-circle"></i> Solucionado</span>`
                        : `<span style="background: rgba(245, 158, 11, 0.14); color: var(--brand-warning); border: 1px solid rgba(245, 158, 11, 0.38); padding: 0.2rem 0.65rem; border-radius: 999px; font-size: 0.75rem; font-weight: 700;"><i class="fas fa-clock"></i> Pendiente</span>`;

                    const imgSection = t.imageDataUrl
                        ? `<div style="margin-top: 0.75rem; display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                                <img src="${t.imageDataUrl}" alt="Adjunto" style="width: 72px; height: 54px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-color);">
                                <button type="button" class="btn btn-outline btn-view-support-img" data-ticket-id="${window.escapeHTML(t.id)}" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">
                                    <i class="fas fa-search-plus"></i> Ver imagen adjunta
                                </button>
                           </div>`
                        : '';

                    const actionSection = isResolved
                        ? `<div style="margin-top: 0.85rem; padding: 0.85rem 1rem; border-radius: 10px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.28);">
                                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.35rem;">
                                    <strong style="color: var(--brand-success); font-size: 0.85rem;"><i class="fas fa-check-double"></i> Solución registrada (${window.escapeHTML(resDateStr)})</strong>
                                    <span style="font-size: 0.76rem; color: var(--text-secondary);">
                                        ${t.userNotified ? '<i class="fas fa-envelope-open"></i> Usuario ya notificado' : '<i class="fas fa-bell"></i> Se notificará al usuario al iniciar sesión'}
                                    </span>
                                </div>
                                <p style="margin: 0; color: var(--text-primary); font-size: 0.9rem; white-space: pre-wrap;">${window.escapeHTML(t.solution)}</p>
                           </div>`
                        : `<div style="margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px dashed var(--border-color);">
                                <label style="font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); display: block; margin-bottom: 0.4rem;">Solución para el usuario:</label>
                                <textarea class="form-control support-solution-input" data-ticket-id="${window.escapeHTML(t.id)}" rows="2" placeholder="Describe la solución aplicada a esta novedad..."></textarea>
                                <div style="display: flex; justify-content: flex-end; margin-top: 0.6rem;">
                                    <button type="button" class="btn btn-primary btn-resolve-support-ticket" data-ticket-id="${window.escapeHTML(t.id)}" style="padding: 0.48rem 1rem; font-size: 0.85rem;">
                                        <i class="fas fa-check"></i> Guardar Solución y Notificar Usuario
                                    </button>
                                </div>
                           </div>`;

                    return `
                        <div class="support-ticket-card" data-ticket-id="${window.escapeHTML(t.id)}" style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-left: 4px solid ${isResolved ? 'var(--brand-success)' : 'var(--brand-warning)'}; border-radius: 12px; padding: 1rem 1.15rem; margin-bottom: 0.9rem;">
                            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                                <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                                    <strong style="font-family: var(--font-mono); color: var(--brand-action);">${window.escapeHTML(t.code)}</strong>
                                    ${statusBadge}
                                    <span style="font-size: 0.78rem; color: var(--text-secondary);">${window.escapeHTML(dateStr)}</span>
                                </div>
                                <span style="font-size: 0.8rem; color: var(--text-secondary);">
                                    <i class="fas fa-user-tag"></i> Usuario: <strong>${window.escapeHTML(t.createdByUsername || 'N/A')}</strong>
                                </span>
                            </div>
                            <div style="display: flex; gap: 1.25rem; flex-wrap: wrap; font-size: 0.86rem; color: var(--text-primary); margin-bottom: 0.55rem;">
                                <span><i class="fas fa-user" style="color: var(--brand-action);"></i> <strong>${window.escapeHTML(t.reporterName)}</strong></span>
                                <span><i class="fas fa-phone" style="color: var(--brand-success);"></i> ${window.escapeHTML(t.contactNumber)}</span>
                            </div>
                            <div style="background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 8px; padding: 0.75rem; font-size: 0.9rem; color: var(--text-primary); white-space: pre-wrap;">
                                ${window.escapeHTML(t.description)}
                            </div>
                            ${imgSection}
                            ${actionSection}
                        </div>
                    `;
                }).join('');

            overlay.innerHTML = `
                <div class="fraterno-modal-card" style="width: 840px; max-width: 95vw; max-height: 92vh; overflow-y: auto;">
                    <button type="button" id="btn-support-admin-close-top" class="btn" style="position: absolute; top: 1rem; right: 1rem; color: var(--text-secondary); font-size: 1.2rem;"><i class="fas fa-times"></i></button>
                    <h3><i class="fas fa-headset" style="color: var(--brand-action);"></i> Gestión de Casos de Soporte (admin01)</h3>

                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1.15rem;">
                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="support-admin-filters">
                            <button type="button" class="btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline'} btn-support-filter" data-filter="all">Todos (${tickets.length})</button>
                            <button type="button" class="btn ${activeFilter === 'pending' ? 'btn-warning' : 'btn-outline'} btn-support-filter" data-filter="pending">Pendientes (${pendingCount})</button>
                            <button type="button" class="btn ${activeFilter === 'resolved' ? 'btn-primary' : 'btn-outline'} btn-support-filter" data-filter="resolved">Solucionados (${resolvedCount})</button>
                        </div>
                    </div>

                    <div id="support-admin-list">${listHtml}</div>

                    <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
                        <button type="button" class="btn btn-outline" id="btn-support-admin-close">Cerrar</button>
                    </div>
                </div>
            `;

            const close = () => overlay.remove();
            overlay.querySelector('#btn-support-admin-close-top').addEventListener('click', close);
            overlay.querySelector('#btn-support-admin-close').addEventListener('click', close);

            overlay.querySelectorAll('.btn-support-filter').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    activeFilter = e.currentTarget.getAttribute('data-filter') || 'all';
                    renderPanelBody();
                });
            });

            overlay.querySelectorAll('.btn-view-support-img').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tid = e.currentTarget.getAttribute('data-ticket-id');
                    const tk = this.ensureStore().find(x => x.id === tid);
                    if (tk && tk.imageDataUrl) {
                        this.openImageLightbox(tk.imageDataUrl, `Adjunto del caso ${tk.code}`);
                    }
                });
            });

            overlay.querySelectorAll('.btn-resolve-support-ticket').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const tid = e.currentTarget.getAttribute('data-ticket-id');
                    const input = overlay.querySelector(`.support-solution-input[data-ticket-id="${tid}"]`);
                    const solText = input ? input.value : '';
                    const res = this.resolveTicket(tid, solText);
                    if (!res.ok) {
                        if (window.showAlert) window.showAlert(res.error, { type: 'warning', title: 'Validación' });
                        else alert(res.error);
                        return;
                    }
                    renderPanelBody();
                    const okMsg = `Caso ${res.ticket.code} marcado como Solucionado. Al iniciar sesión, el usuario (${res.ticket.createdByUsername || res.ticket.reporterName}) verá la ventana emergente con la solución registrada.`;
                    if (window.showAlert) window.showAlert(okMsg, { type: 'success', title: 'Caso Solucionado' });
                    else alert(okMsg);
                });
            });
        };

        overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.remove(); });
        document.body.appendChild(overlay);
        renderPanelBody();
    },

    checkAndNotifyResolvedTickets() {
        const user = this.getCurrentUser();
        if (!user) return false;
        if (document.getElementById('modal-support-resolved-notif')) return false;

        const pending = this.getPendingResolvedNotificationsForUser(user);
        if (pending.length === 0) return false;

        const overlay = document.createElement('div');
        overlay.id = 'modal-support-resolved-notif';
        overlay.className = 'fraterno-modal-overlay';
        overlay.style.display = 'flex';

        const cardsHtml = pending.map(t => {
            const resDateStr = t.resolvedAt ? new Date(t.resolvedAt).toLocaleString('es-CO') : '';
            return `
                <div style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-left: 4px solid var(--brand-success); border-radius: 12px; padding: 1rem 1.15rem; margin-bottom: 0.9rem; text-align: left;">
                    <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <strong style="font-family: var(--font-mono); color: var(--brand-action);">${window.escapeHTML(t.code)}</strong>
                        <span style="font-size: 0.78rem; color: var(--text-secondary);">Solucionado el ${window.escapeHTML(resDateStr)}</span>
                    </div>
                    <div style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 0.65rem;">
                        <strong>Tu novedad reportada:</strong> ${window.escapeHTML(t.description)}
                    </div>
                    <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.32); border-radius: 8px; padding: 0.8rem 0.95rem;">
                        <div style="font-size: 0.8rem; font-weight: 700; color: var(--brand-success); margin-bottom: 0.25rem; text-transform: uppercase; letter-spacing: 0.04em;">
                            <i class="fas fa-check-circle"></i> Solución brindada:
                        </div>
                        <div style="font-size: 0.95rem; color: var(--text-primary); font-weight: 500; white-space: pre-wrap;">${window.escapeHTML(t.solution)}</div>
                    </div>
                </div>
            `;
        }).join('');

        const titleText = pending.length === 1
            ? '¡Tu Caso de Soporte Fue Solucionado!'
            : `¡Tienes ${pending.length} Casos de Soporte Solucionados!`;

        overlay.innerHTML = `
            <div class="fraterno-modal-card" style="width: 580px; max-width: 95vw; max-height: 90vh; overflow-y: auto; border-top-color: var(--brand-success) !important;">
                <h3><i class="fas fa-check-circle" style="color: var(--brand-success);"></i> ${titleText}</h3>
                <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 1.15rem;">
                    Hola <strong>${window.escapeHTML(user.name || user.username)}</strong>, el equipo de soporte ya dio solución a tu solicitud:
                </p>
                <div id="support-resolved-notif-items">${cardsHtml}</div>
                <div style="display: flex; justify-content: flex-end; border-top: 1px solid var(--border-color); padding-top: 1rem; margin-top: 0.5rem;">
                    <button type="button" class="btn btn-primary" id="btn-support-notif-accept" style="padding: 0.6rem 1.4rem;">
                        <i class="fas fa-check"></i> Entendido
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        const ids = pending.map(t => t.id);
        const acceptAndClose = () => {
            this.acknowledgeNotifications(ids);
            overlay.remove();
        };
        overlay.querySelector('#btn-support-notif-accept').addEventListener('click', acceptAndClose);
        return true;
    }
};

// =====================================
// Política de Seguridad para Contraseñas (PasswordPolicy)
// Requisitos: mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales
// =====================================
window.PasswordPolicy = {
    MIN_LENGTH: 8,

    evaluate(password) {
        const pwd = String(password || '');
        const rules = {
            minLength: pwd.length >= this.MIN_LENGTH,
            hasUpper: /[A-ZÁÉÍÓÚÑ]/.test(pwd),
            hasLower: /[a-záéíóúñ]/.test(pwd),
            hasNumber: /[0-9]/.test(pwd),
            hasSpecial: /[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s]/.test(pwd)
        };

        const missing = [];
        if (!rules.minLength) missing.push(`Mínimo ${this.MIN_LENGTH} caracteres`);
        if (!rules.hasUpper) missing.push('Al menos una letra mayúscula (A-Z)');
        if (!rules.hasLower) missing.push('Al menos una letra minúscula (a-z)');
        if (!rules.hasNumber) missing.push('Al menos un número (0-9)');
        if (!rules.hasSpecial) missing.push('Al menos un carácter especial (!@#$%^&*...)');

        const score = Object.values(rules).filter(Boolean).length;
        const valid = missing.length === 0;

        let level = 'Vacía';
        let color = 'var(--text-muted)';
        if (pwd.length > 0) {
            if (score <= 2) { level = 'Débil'; color = 'var(--brand-danger)'; }
            else if (score === 3) { level = 'Media'; color = 'var(--brand-warning)'; }
            else if (score === 4) { level = 'Buena'; color = 'var(--brand-action)'; }
            else { level = 'Segura'; color = 'var(--brand-success)'; }
        }

        return { valid, score, maxScore: 5, level, color, rules, missing };
    },

    validate(password) {
        const res = this.evaluate(password);
        if (!res.valid) {
            return {
                valid: false,
                error: 'La contraseña no cumple con el factor de seguridad requerido:\n• ' + res.missing.join('\n• '),
                details: res
            };
        }
        return { valid: true, error: null, details: res };
    },

    generateSecurePassword(length = 12) {
        const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        const lower = 'abcdefghijkmnopqrstuvwxyz';
        const nums = '23456789';
        const specials = '!@#$%&*?-_+=';
        const all = upper + lower + nums + specials;

        const pick = (chars) => chars[Math.floor(Math.random() * chars.length)];
        const chars = [pick(upper), pick(lower), pick(nums), pick(specials)];
        const targetLen = Math.max(this.MIN_LENGTH, length);
        while (chars.length < targetLen) {
            chars.push(pick(all));
        }
        // Mezclar orden aleatoriamente (Fisher-Yates)
        for (let i = chars.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [chars[i], chars[j]] = [chars[j], chars[i]];
        }
        return chars.join('');
    }
};

// =====================================
// Gestión Autónoma y Primer Inicio de Sesión de Contraseñas (PasswordManager)
// - Exige cambio obligatorio en primer inicio de sesión de usuarios nuevos
// - Permite a cualquier usuario cambiar su contraseña sin contactar a un administrador
// =====================================
window.PasswordManager = {
    init() {
        const btns = document.querySelectorAll('.btn-change-password');
        btns.forEach(btn => {
            if (btn.dataset && btn.dataset.pwdBound === '1') return;
            if (btn.dataset) btn.dataset.pwdBound = '1';
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const sidebar = document.getElementById('sidebar');
                const backdrop = document.getElementById('sidebar-backdrop');
                if (sidebar && sidebar.classList) sidebar.classList.remove('open');
                if (backdrop && backdrop.classList) backdrop.classList.remove('open');
                this.openChangePasswordModal({ forced: false });
            });
        });
    },

    getCurrentUserRecord() {
        let sessionUser = null;
        try {
            const raw = sessionStorage.getItem('fraterno_user');
            if (raw) sessionUser = JSON.parse(raw);
        } catch (e) {}
        if (!sessionUser) return { sessionUser: null, record: null };

        const users = (window.AppData && Array.isArray(window.AppData.users)) ? window.AppData.users : [];
        let record = null;
        if (sessionUser.id) {
            record = users.find(u => u && u.id === sessionUser.id) || null;
        }
        if (!record && sessionUser.username) {
            const targetUname = String(sessionUser.username).trim().toLowerCase();
            record = users.find(u => u && String(u.username || '').trim().toLowerCase() === targetUname) || null;
        }
        return { sessionUser, record };
    },

    requiresPasswordChange() {
        const { sessionUser, record } = this.getCurrentUserRecord();
        if (!sessionUser) return false;
        if (record) return record.mustChangePassword === true;
        return sessionUser.mustChangePassword === true;
    },

    changePassword({ currentPassword = '', newPassword = '', confirmPassword = '', isFirstLogin = false } = {}) {
        const { sessionUser, record } = this.getCurrentUserRecord();
        if (!sessionUser || !record) {
            return { ok: false, error: 'No se encontró una cuenta de usuario activa para actualizar.' };
        }

        const storedPass = record.password !== undefined ? String(record.password) : '1234';

        if (!isFirstLogin) {
            if (!currentPassword) {
                return { ok: false, error: 'Debes ingresar tu contraseña actual.' };
            }
            if (String(currentPassword) !== storedPass) {
                return { ok: false, error: 'La contraseña actual ingresada es incorrecta.' };
            }
        }

        if (window.PasswordPolicy) {
            const check = window.PasswordPolicy.validate(newPassword);
            if (!check.valid) {
                return { ok: false, error: check.error };
            }
        } else {
            const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;
            if (!strongRegex.test(String(newPassword || ''))) {
                return { ok: false, error: 'La contraseña debe tener mínimo 8 caracteres y combinar mayúsculas, minúsculas, números y caracteres especiales.' };
            }
        }

        if (String(newPassword) !== String(confirmPassword)) {
            return { ok: false, error: 'La confirmación no coincide con la nueva contraseña.' };
        }

        if (String(newPassword) === storedPass) {
            return { ok: false, error: 'La nueva contraseña debe ser diferente a tu contraseña actual.' };
        }

        record.password = String(newPassword);
        record.mustChangePassword = false;
        record.passwordUpdatedAt = new Date().toISOString();

        try {
            const canonicalRole = window.normalizeUserRoleLabel ? window.normalizeUserRoleLabel(record.role, record) : record.role;
            record.role = canonicalRole;
            const updatedSession = {
                ...sessionUser,
                id: record.id,
                name: record.name,
                username: record.username,
                role: canonicalRole,
                allowedRoutes: Array.isArray(record.allowedRoutes) ? record.allowedRoutes : sessionUser.allowedRoutes,
                photo: record.photo || sessionUser.photo || '',
                mustChangePassword: false,
                passwordUpdatedAt: record.passwordUpdatedAt
            };
            sessionStorage.setItem('fraterno_user', JSON.stringify(updatedSession));
            if (window.resolveSessionRoleCode) {
                sessionStorage.setItem('fraterno_role', window.resolveSessionRoleCode(canonicalRole, record));
            }
            if (window.updateSidebarUserProfileUI) {
                window.updateSidebarUserProfileUI(updatedSession);
            }
        } catch (e) {}

        if (typeof window.saveAppData === 'function') {
            window.saveAppData();
        }

        return { ok: true, user: record };
    },

    checkMandatoryPasswordChange() {
        if (!this.requiresPasswordChange()) return false;
        this.openChangePasswordModal({ forced: true });
        return true;
    },

    openChangePasswordModal({ forced = false } = {}) {
        const { sessionUser, record } = this.getCurrentUserRecord();
        if (!sessionUser) return false;

        const existing = document.getElementById('modal-change-password');
        if (existing) {
            if (forced && existing.dataset && existing.dataset.forced !== '1') {
                existing.remove();
            } else {
                return true;
            }
        }

        const displayName = window.escapeHTML((record && record.name) || sessionUser.name || sessionUser.username || 'Usuario');
        const displayUser = window.escapeHTML((record && record.username) || sessionUser.username || '');

        const overlay = document.createElement('div');
        overlay.id = 'modal-change-password';
        if (overlay.dataset) overlay.dataset.forced = forced ? '1' : '0';
        overlay.className = 'modal-overlay';
        overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(12, 35, 49, 0.78); backdrop-filter: blur(5px); z-index: 10050; display: flex; justify-content: center; align-items: center; padding: 1rem;';

        overlay.innerHTML = `
            <div style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 16px; width: 100%; max-width: 500px; max-height: 92vh; overflow-y: auto; box-shadow: 0 24px 60px rgba(0,0,0,0.38); padding: 1.75rem; position: relative;">
                ${!forced ? `<button type="button" id="btn-pwd-close-top" aria-label="Cerrar" style="position: absolute; top: 1rem; right: 1rem; color: var(--text-muted); font-size: 1.2rem; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center;"><i class="fas fa-times"></i></button>` : ''}

                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.65rem;">
                    <div style="width: 44px; height: 44px; border-radius: 12px; background: ${forced ? 'rgba(245, 158, 11, 0.16)' : 'var(--brand-action-soft)'}; color: ${forced ? 'var(--brand-warning)' : 'var(--brand-action)'}; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                        <i class="fas ${forced ? 'fa-user-shield' : 'fa-key'}"></i>
                    </div>
                    <div>
                        <h3 style="margin: 0; font-size: 1.15rem;">${forced ? 'Cambio de Contraseña Obligatorio' : 'Cambiar Mi Contraseña'}</h3>
                        <div style="font-size: 0.82rem; color: var(--text-secondary);">${displayName}${displayUser ? ` (@${displayUser})` : ''}</div>
                    </div>
                </div>

                ${forced
                    ? `<div style="background: rgba(245, 158, 11, 0.12); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 10px; padding: 0.8rem 0.95rem; margin: 0.85rem 0 1.1rem 0; font-size: 0.86rem; color: var(--text-primary); line-height: 1.45;">
                            <i class="fas fa-info-circle" style="color: var(--brand-warning); margin-right: 0.35rem;"></i>
                            <strong>Primer inicio de sesión:</strong> Por tu seguridad, debes establecer una nueva contraseña personal diferente a la asignada inicialmente para continuar usando la plataforma.
                       </div>`
                    : `<p style="color: var(--text-secondary); font-size: 0.86rem; margin: 0.5rem 0 1.1rem 0;">Gestiona el cambio de tu contraseña de acceso en cualquier momento de forma segura y autónoma.</p>`
                }

                <div id="pwd-modal-error" style="display: none; background: rgba(220, 38, 38, 0.12); border: 1px solid rgba(220, 38, 38, 0.35); color: var(--brand-danger); border-radius: 10px; padding: 0.75rem 0.9rem; margin-bottom: 1rem; font-size: 0.84rem; white-space: pre-line; font-weight: 500;"></div>

                <form id="form-change-password" autocomplete="off">
                    ${!forced ? `
                    <div class="form-group" style="margin-bottom: 1rem;">
                        <label for="pwd-current">Contraseña Actual *</label>
                        <div style="position: relative; display: flex; align-items: center;">
                            <input type="password" id="pwd-current" class="form-control" placeholder="Ingresa tu contraseña actual" autocomplete="current-password" style="padding-right: 2.6rem;" required>
                            <button type="button" id="btn-toggle-pwd-current" aria-label="Mostrar contraseña actual" style="position: absolute; right: 0.6rem; color: var(--text-muted); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>` : ''}

                    <div class="form-group" style="margin-bottom: 0.85rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                            <label for="pwd-new" style="margin: 0;">Nueva Contraseña Segura *</label>
                            <button type="button" id="btn-gen-pwd-new" style="font-size: 0.75rem; font-weight: 700; color: var(--brand-action); padding: 0; background: none; border: none; cursor: pointer;" title="Generar contraseña segura automáticamente">
                                <i class="fas fa-magic"></i> Generar
                            </button>
                        </div>
                        <div style="position: relative; display: flex; align-items: center;">
                            <input type="password" id="pwd-new" class="form-control" placeholder="Mín. 8 chars (Mayúscula, minúscula, número y especial)" autocomplete="new-password" style="padding-right: 2.6rem;" required>
                            <button type="button" id="btn-toggle-pwd-new" aria-label="Mostrar nueva contraseña" style="position: absolute; right: 0.6rem; color: var(--text-muted); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </div>

                    <div style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.8rem 0.95rem; margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem; font-size: 0.8rem;">
                            <strong style="color: var(--text-primary);"><i class="fas fa-shield-alt" style="color: var(--brand-action);"></i> Factor de Seguridad</strong>
                            <span id="pwd-strength-label" style="font-weight: 700; color: var(--text-muted);">Sin ingresar</span>
                        </div>
                        <div style="width: 100%; height: 6px; border-radius: 999px; background: var(--border-color); overflow: hidden; margin-bottom: 0.6rem;">
                            <div id="pwd-strength-bar" style="width: 0%; height: 100%; background: var(--text-muted); transition: width 0.25s ease, background-color 0.25s ease;"></div>
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); gap: 0.3rem 0.7rem; font-size: 0.77rem; color: var(--text-secondary);">
                            <span id="pwd-rule-len"><i class="far fa-circle"></i> Mínimo 8 caracteres</span>
                            <span id="pwd-rule-upper"><i class="far fa-circle"></i> Letra mayúscula (A-Z)</span>
                            <span id="pwd-rule-lower"><i class="far fa-circle"></i> Letra minúscula (a-z)</span>
                            <span id="pwd-rule-num"><i class="far fa-circle"></i> Número (0-9)</span>
                            <span id="pwd-rule-spec"><i class="far fa-circle"></i> Carácter especial (!@#$...)</span>
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 1.25rem;">
                        <label for="pwd-confirm">Confirmar Nueva Contraseña *</label>
                        <div style="position: relative; display: flex; align-items: center;">
                            <input type="password" id="pwd-confirm" class="form-control" placeholder="Repite la nueva contraseña" autocomplete="new-password" style="padding-right: 2.6rem;" required>
                            <button type="button" id="btn-toggle-pwd-confirm" aria-label="Mostrar confirmación" style="position: absolute; right: 0.6rem; color: var(--text-muted); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                        <div id="pwd-match-status" style="font-size: 0.78rem; margin-top: 0.35rem; min-height: 1.1em;"></div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; flex-wrap: wrap;">
                        ${forced
                            ? `<button type="button" class="btn btn-outline" id="btn-pwd-logout"><i class="fas fa-sign-out-alt"></i> Cerrar Sesión</button>`
                            : `<button type="button" class="btn btn-outline" id="btn-pwd-cancel">Cancelar</button>`
                        }
                        <button type="submit" class="btn btn-primary" id="btn-pwd-submit">
                            <i class="fas fa-check-circle"></i> ${forced ? 'Establecer Nueva Contraseña' : 'Guardar Nueva Contraseña'}
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(overlay);

        const currentInput = overlay.querySelector('#pwd-current');
        const newInput = overlay.querySelector('#pwd-new');
        const confirmInput = overlay.querySelector('#pwd-confirm');
        const errBox = overlay.querySelector('#pwd-modal-error');
        const matchStatus = overlay.querySelector('#pwd-match-status');

        const bindEyeToggle = (btnId, inputEl) => {
            const btn = overlay.querySelector(btnId);
            if (!btn || !inputEl) return;
            btn.addEventListener('click', () => {
                const showing = inputEl.type === 'text';
                inputEl.type = showing ? 'password' : 'text';
                btn.innerHTML = `<i class="fas ${showing ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
            });
        };
        bindEyeToggle('#btn-toggle-pwd-current', currentInput);
        bindEyeToggle('#btn-toggle-pwd-new', newInput);
        bindEyeToggle('#btn-toggle-pwd-confirm', confirmInput);

        const updateStrengthUI = (pwdVal) => {
            if (!window.PasswordPolicy) return;
            const res = window.PasswordPolicy.evaluate(pwdVal);
            const bar = overlay.querySelector('#pwd-strength-bar');
            const label = overlay.querySelector('#pwd-strength-label');
            if (bar) {
                bar.style.width = `${(res.score / res.maxScore) * 100}%`;
                bar.style.background = res.color;
            }
            if (label) {
                label.textContent = pwdVal ? `${res.level} (${res.score}/${res.maxScore})` : 'Sin ingresar';
                label.style.color = res.color;
            }
            const map = [
                ['#pwd-rule-len', res.rules.minLength, 'Mínimo 8 caracteres'],
                ['#pwd-rule-upper', res.rules.hasUpper, 'Letra mayúscula (A-Z)'],
                ['#pwd-rule-lower', res.rules.hasLower, 'Letra minúscula (a-z)'],
                ['#pwd-rule-num', res.rules.hasNumber, 'Número (0-9)'],
                ['#pwd-rule-spec', res.rules.hasSpecial, 'Carácter especial (!@#$...)']
            ];
            map.forEach(([sel, passed, txt]) => {
                const el = overlay.querySelector(sel);
                if (!el) return;
                el.style.color = passed ? 'var(--brand-success)' : 'var(--text-secondary)';
                el.style.fontWeight = passed ? '600' : '400';
                el.innerHTML = `<i class="${passed ? 'fas fa-check-circle' : 'far fa-circle'}"></i> ${txt}`;
            });
        };

        const updateMatchUI = () => {
            if (!matchStatus || !newInput || !confirmInput) return;
            const nVal = newInput.value;
            const cVal = confirmInput.value;
            if (!cVal) {
                matchStatus.textContent = '';
                return;
            }
            if (nVal === cVal) {
                matchStatus.style.color = 'var(--brand-success)';
                matchStatus.innerHTML = '<i class="fas fa-check-circle"></i> Las contraseñas coinciden';
            } else {
                matchStatus.style.color = 'var(--brand-danger)';
                matchStatus.innerHTML = '<i class="fas fa-times-circle"></i> Las contraseñas no coinciden';
            }
        };

        if (newInput) {
            newInput.addEventListener('input', () => {
                updateStrengthUI(newInput.value);
                updateMatchUI();
            });
        }
        if (confirmInput) {
            confirmInput.addEventListener('input', updateMatchUI);
        }

        const btnGen = overlay.querySelector('#btn-gen-pwd-new');
        if (btnGen && newInput && window.PasswordPolicy) {
            btnGen.addEventListener('click', () => {
                const generated = window.PasswordPolicy.generateSecurePassword(12);
                newInput.value = generated;
                if (confirmInput) confirmInput.value = generated;
                newInput.type = 'text';
                if (confirmInput) confirmInput.type = 'text';
                const toggleNew = overlay.querySelector('#btn-toggle-pwd-new');
                const toggleConf = overlay.querySelector('#btn-toggle-pwd-confirm');
                if (toggleNew) toggleNew.innerHTML = '<i class="fas fa-eye-slash"></i>';
                if (toggleConf) toggleConf.innerHTML = '<i class="fas fa-eye-slash"></i>';
                updateStrengthUI(generated);
                updateMatchUI();
            });
        }

        const close = () => {
            if (overlay.parentNode) overlay.remove();
        };

        if (!forced) {
            const btnCloseTop = overlay.querySelector('#btn-pwd-close-top');
            const btnCancel = overlay.querySelector('#btn-pwd-cancel');
            if (btnCloseTop) btnCloseTop.addEventListener('click', close);
            if (btnCancel) btnCancel.addEventListener('click', close);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) close();
            });
        } else {
            const btnLogout = overlay.querySelector('#btn-pwd-logout');
            if (btnLogout) {
                btnLogout.addEventListener('click', () => {
                    close();
                    sessionStorage.removeItem('fraterno_user');
                    sessionStorage.removeItem('fraterno_role');
                    sessionStorage.removeItem('fraterno_check_support_notifs');
                    window.location.hash = '#/login';
                });
            }
        }

        const form = overlay.querySelector('#form-change-password');
        if (form) {
            form.addEventListener('submit', (e) => {
                if (e && typeof e.preventDefault === 'function') e.preventDefault();
                if (errBox) {
                    errBox.style.display = 'none';
                    errBox.textContent = '';
                }
                const res = this.changePassword({
                    currentPassword: currentInput ? currentInput.value : '',
                    newPassword: newInput ? newInput.value : '',
                    confirmPassword: confirmInput ? confirmInput.value : '',
                    isFirstLogin: forced
                });
                if (!res.ok) {
                    if (errBox) {
                        errBox.textContent = res.error;
                        errBox.style.display = 'block';
                    } else if (window.showAlert) {
                        window.showAlert(res.error, { type: 'danger', title: 'Error al Cambiar Contraseña' });
                    }
                    return;
                }

                close();
                const successMsg = forced
                    ? '¡Contraseña actualizada! Ya puedes usar el sistema con tu nueva contraseña personal.'
                    : 'Tu contraseña ha sido actualizada con éxito.';
                if (window.showAlert) {
                    window.showAlert(successMsg, { type: 'success', title: 'Contraseña Actualizada' });
                } else {
                    alert(successMsg);
                }

                if (forced && window.SupportSystem && sessionStorage.getItem('fraterno_check_support_notifs') === '1') {
                    sessionStorage.removeItem('fraterno_check_support_notifs');
                    window.SupportSystem.checkAndNotifyResolvedTickets();
                }
            });
        }

        return true;
    }
};

// =====================================
// Helper Compartido de Disponibilidad de Vuelos y Recargo por Peso (FlightAvailabilityHelper)
// Usado por Registro de Salto (reservations.js) y Reservas -> Editar Reserva (booking.js)
// =====================================
window.FlightAvailabilityHelper = {
    EXTRA_WEIGHT_THRESHOLD_KG: 85,

    normalizeJumpCategory(jumpType) {
        const t = String(jumpType || '').toLowerCase();
        if (t.includes('copiloto')) return 'cop';
        if (t.includes('fun') || t.includes('deport')) return 'fun';
        return 'tan';
    },

    getCategoryLabel(catOrType) {
        const cat = (catOrType === 'tan' || catOrType === 'fun' || catOrType === 'cop')
            ? catOrType
            : this.normalizeJumpCategory(catOrType);
        if (cat === 'cop') return 'Copiloto';
        if (cat === 'fun') return 'Fun Jumper';
        return 'Tándem';
    },

    isCancelledPax(p) {
        if (!p) return true;
        return Boolean(
            (p.paxStatus && String(p.paxStatus).includes('Cancelado')) ||
            (p.flightStatus && String(p.flightStatus).includes('Cancelado'))
        );
    },

    isLockedFlightStatus(status) {
        return ['En El Aire', 'Paracaidistas en el aire', 'Aterrizó', 'Completado'].includes(String(status || ''));
    },

    isDateNoOp(dateStrYMD) {
        if (!dateStrYMD) return { blocked: false, isDayBlocked: false, isSpecificBlocked: false };
        const noOp = (window.AppData && window.AppData.noOpRules) || { daysOfWeek: ['1', '2'], specificDates: [], exceptions: [] };
        const specific = Array.isArray(noOp.specificDates) ? noOp.specificDates : [];
        const exceptions = Array.isArray(noOp.exceptions) ? noOp.exceptions : [];
        const daysOfWeek = Array.isArray(noOp.daysOfWeek) ? noOp.daysOfWeek : ['1', '2'];

        if (exceptions.includes(dateStrYMD)) {
            return { blocked: false, isDayBlocked: false, isSpecificBlocked: false };
        }
        const isSpecificBlocked = specific.includes(dateStrYMD);
        const dateObj = new Date(dateStrYMD + 'T00:00:00');
        const dayOfWeek = String(dateObj.getDay());
        const isDayBlocked = daysOfWeek.includes(dayOfWeek);
        return { blocked: isSpecificBlocked || isDayBlocked, isDayBlocked, isSpecificBlocked };
    },

    getFlightsForDate(dateStrYMD, options = {}) {
        if (!dateStrYMD) return [];
        const { excludePaxId = null, extraSelections = [] } = options;

        const aeronaves = (window.AppData && Array.isArray(window.AppData.aeronaves)) ? window.AppData.aeronaves : [];
        const asignaciones = (window.AppData && Array.isArray(window.AppData.asignacionFlota)) ? window.AppData.asignacionFlota : [];
        const passengers = (window.AppData && Array.isArray(window.AppData.passengers)) ? window.AppData.passengers : [];

        const planeById = {};
        aeronaves.forEach(a => {
            if (a && a.id) planeById[a.id] = a;
        });

        // Filtrar vuelos activos del día agrupados por aeronave para asignar número de vuelo (Vuelo 1, Vuelo 2...)
        const dayAsgs = asignaciones.filter(asg => asg && asg.fecha === dateStrYMD && asg.estado !== 'Cancelado');
        const byPlane = {};
        dayAsgs.forEach(asg => {
            if (!byPlane[asg.id_aeronave]) byPlane[asg.id_aeronave] = [];
            byPlane[asg.id_aeronave].push(asg);
        });

        const normTime = (t) => {
            const s = String(t || '').trim().split(' ')[0];
            const m = s.match(/^(\d{1,2}):(\d{2})/);
            return m ? `${m[1].padStart(2, '0')}:${m[2]}` : s;
        };

        const results = [];
        Object.keys(byPlane).forEach(planeId => {
            const plane = planeById[planeId];
            if (!plane) return;
            const list = byPlane[planeId].slice().sort((a, b) => normTime(a.horaInicio).localeCompare(normTime(b.horaInicio)));
            list.forEach((asg, idx) => {
                const capTan = parseInt(plane.capTan || 0, 10);
                const capFun = parseInt(plane.capFun || 0, 10);
                const capCop = parseInt(plane.capCop || 0, 10);
                const asgTimeNorm = normTime(asg.horaInicio);
                const asgVueloNum = `Vuelo ${idx + 1}`;

                // Ocupación REAL del vuelo (incluye todos los pasajeros activos en este vuelo)
                let usedTan = 0;
                let usedFun = 0;
                let usedCop = 0;
                let containsExcludedPax = false;
                let excludedPaxCat = null;
                let isLocked = this.isLockedFlightStatus(asg.estado);

                passengers.forEach(p => {
                    if (!p || this.isCancelledPax(p)) return;
                    if (p.date !== dateStrYMD) return;
                    const matches = (p.flightId && p.flightId === asg.id)
                        || (p.aeronave === plane.matricula && asgTimeNorm && normTime(p.time) === asgTimeNorm)
                        || (!p.flightId && p.aeronave === plane.matricula && String(p.vueloNum || '').trim() === asgVueloNum);
                    if (!matches) return;

                    if (this.isLockedFlightStatus(p.flightStatus)) {
                        isLocked = true;
                    }

                    const cat = this.normalizeJumpCategory(p.type);
                    if (excludePaxId && p.id === excludePaxId) {
                        containsExcludedPax = true;
                        excludedPaxCat = cat;
                    }

                    if (cat === 'cop') usedCop += 1;
                    else if (cat === 'fun') usedFun += 1;
                    else usedTan += 1;
                });

                // Contar selecciones en borrador (ej. otros pasajeros del mismo grupo en Registro de Salto)
                (extraSelections || []).forEach(sel => {
                    if (!sel) return;
                    const matchesSel = (sel.flightId && sel.flightId === asg.id)
                        || (sel.aeronave === plane.matricula && asgTimeNorm && normTime(sel.time) === asgTimeNorm);
                    if (!matchesSel) return;
                    const cat = this.normalizeJumpCategory(sel.type);
                    if (cat === 'cop') usedCop += 1;
                    else if (cat === 'fun') usedFun += 1;
                    else usedTan += 1;
                });

                const availTan = Math.max(0, capTan - usedTan);
                const availFun = Math.max(0, capFun - usedFun);
                const availCop = Math.max(0, capCop - usedCop);
                const totalCap = capTan + capFun + capCop;
                const totalUsed = usedTan + usedFun + usedCop;
                const totalAvail = availTan + availFun + availCop;

                const descriptor = {
                    flightId: asg.id,
                    fecha: asg.fecha,
                    idAeronave: plane.id,
                    matricula: plane.matricula,
                    modelo: plane.modelo || '',
                    vueloNum: asgVueloNum,
                    horaInicio: asg.horaInicio || '',
                    horaFin: asg.horaFin || '',
                    capTan, usedTan, availTan,
                    capFun, usedFun, availFun,
                    capCop, usedCop, availCop,
                    totalCap, totalUsed, totalAvail,
                    isLocked,
                    containsExcludedPax,
                    getAvailForType: (jumpType) => {
                        const cat = this.normalizeJumpCategory(jumpType);
                        if (cat === 'cop') return availCop;
                        if (cat === 'fun') return availFun;
                        return availTan;
                    },
                    getAssignableAvailForType: (jumpType) => {
                        const cat = this.normalizeJumpCategory(jumpType);
                        const baseAvail = cat === 'cop' ? availCop : (cat === 'fun' ? availFun : availTan);
                        return (containsExcludedPax && excludedPaxCat === cat) ? baseAvail + 1 : baseAvail;
                    },
                    canAssignForType: (jumpType) => {
                        if (isLocked) return false;
                        const cat = this.normalizeJumpCategory(jumpType);
                        if (containsExcludedPax && excludedPaxCat === cat) return true;
                        const baseAvail = cat === 'cop' ? availCop : (cat === 'fun' ? availFun : availTan);
                        return baseAvail > 0;
                    },
                    getCapForType: (jumpType) => {
                        const cat = this.normalizeJumpCategory(jumpType);
                        if (cat === 'cop') return capCop;
                        if (cat === 'fun') return capFun;
                        return capTan;
                    },
                    getUsedForType: (jumpType) => {
                        const cat = this.normalizeJumpCategory(jumpType);
                        if (cat === 'cop') return usedCop;
                        if (cat === 'fun') return usedFun;
                        return usedTan;
                    }
                };
                results.push(descriptor);
            });
        });

        results.sort((a, b) => {
            const timeCmp = normTime(a.horaInicio).localeCompare(normTime(b.horaInicio));
            if (timeCmp !== 0) return timeCmp;
            return String(a.matricula || '').localeCompare(String(b.matricula || ''));
        });

        return results;
    },

    findMatchingFlightForPax(pax, flights) {
        if (!pax || !Array.isArray(flights) || flights.length === 0) return null;
        if (pax.flightId) {
            const byId = flights.find(f => f.flightId === pax.flightId);
            if (byId) return byId;
        }
        const normTime = (t) => {
            const s = String(t || '').trim().split(' ')[0];
            const m = s.match(/^(\d{1,2}):(\d{2})/);
            return m ? `${m[1].padStart(2, '0')}:${m[2]}` : s;
        };
        if (pax.aeronave && pax.aeronave !== 'Sin asignar') {
            if (pax.time && pax.time !== 'Por definir') {
                const paxT = normTime(pax.time);
                const byTime = flights.find(f => f.matricula === pax.aeronave && normTime(f.horaInicio) === paxT);
                if (byTime) return byTime;
            }
            if (pax.vueloNum) {
                const byNum = flights.find(f => f.matricula === pax.aeronave && f.vueloNum === String(pax.vueloNum).trim());
                if (byNum) return byNum;
            }
        }
        return null;
    },

    getKgExtraRate(record = null) {
        if (window.TariffGuard) {
            const rate = window.TariffGuard.getPriceForRecord(record, 'Valor KG Extra');
            if (rate > 0) return rate;
        }
        const maestro = (window.AppData && Array.isArray(window.AppData.maestroValores)) ? window.AppData.maestroValores : [];
        const mItem = maestro.find(m => m.name === 'Valor KG Extra');
        if (mItem && mItem.price !== undefined) {
            const parsed = parseInt(String(mItem.price).replace(/\D/g, ''), 10) || 0;
            if (parsed > 0) return parsed;
        }
        return 5000;
    },

    getPassengerWeightSurcharge(weightVal, record = null) {
        const w = parseFloat(weightVal);
        const validWeight = (!isNaN(w) && w > 0) ? w : 0;
        const extraKg = validWeight > this.EXTRA_WEIGHT_THRESHOLD_KG
            ? Number((validWeight - this.EXTRA_WEIGHT_THRESHOLD_KG).toFixed(2))
            : 0;
        const rate = this.getKgExtraRate(record);
        const charge = extraKg > 0 ? Math.round(extraKg * rate) : 0;
        return { weight: validWeight, extraKg, rate, charge };
    }
};
