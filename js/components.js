/**
 * components.js
 * Maneja la lógica de la UI Global (Header, Reloj, Sidebar, Tema)
 */

document.addEventListener('DOMContentLoaded', () => {
    initClock();
    initMobileMenu();
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
        // Sometimes Int returns "26 de junio de 2026", user wants "26 junio 2026"
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

    updateClock(); // Initial call
    setInterval(updateClock, 1000); // Update every second
}

// ==========================================
// Mobile Menu (Sidebar)
// ==========================================
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const sidebar = document.getElementById('sidebar');

    btn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar if clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            if (!sidebar.contains(e.target) && !btn.contains(e.target) && sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        }
    });
}
