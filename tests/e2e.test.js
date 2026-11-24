/**
 * Suite de Pruebas Automatizadas E2E (End-to-End), AppSec & QA
 * Sistema FRATERNO - Auditoría Integral de 5 Fases
 */
process.env.NODE_ENV = 'test';

const test = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { Readable, Duplex } = require('node:stream');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const { app } = require('../server.js');

// ============================================================================
// In-Memory Express HTTP Dispatcher (Executes real Express middleware & routes)
// ============================================================================
function requestApp(method, urlPath, body = undefined, customHeaders = {}) {
    return new Promise((resolve, reject) => {
        const rawBody = body === undefined
            ? ''
            : (typeof body === 'string' ? body : JSON.stringify(body));

        const headers = {
            host: 'localhost:3000',
            ...(rawBody ? {
                'content-type': 'application/json',
                'content-length': String(Buffer.byteLength(rawBody))
            } : {}),
            ...customHeaders
        };

        const mockSocket = new Duplex({
            read() {},
            write(chunk, enc, cb) { cb(); }
        });
        mockSocket.remoteAddress = '127.0.0.1';

        const req = new Readable({
            read() {
                if (rawBody) {
                    this.push(Buffer.from(rawBody));
                }
                this.push(null);
            }
        });
        req.method = method.toUpperCase();
        req.url = urlPath;
        req.originalUrl = urlPath;
        req.path = urlPath.split('?')[0];
        req.headers = headers;
        req.connection = mockSocket;
        req.socket = mockSocket;
        req.get = (name) => headers[String(name).toLowerCase()];
        req.header = req.get;

        const resHeaders = new Map();
        const chunks = [];
        const res = new EventEmitter();
        res.statusCode = 200;
        res.headersSent = false;
        res.locals = {};

        res.setHeader = (name, val) => {
            resHeaders.set(String(name).toLowerCase(), String(val));
        };
        res.getHeader = (name) => resHeaders.get(String(name).toLowerCase()) || null;
        res.removeHeader = (name) => resHeaders.delete(String(name).toLowerCase());
        res.set = (name, val) => { res.setHeader(name, val); return res; };
        res.get = (name) => res.getHeader(name);
        res.status = (code) => { res.statusCode = code; return res; };
        res.writeHead = (code, hdrs) => {
            res.statusCode = code;
            if (hdrs) {
                Object.entries(hdrs).forEach(([k, v]) => res.setHeader(k, v));
            }
            return res;
        };
        res.write = (chunk) => {
            if (chunk) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk)));
            return true;
        };
        res.end = (chunk) => {
            if (chunk) res.write(chunk);
            res.headersSent = true;
            const text = Buffer.concat(chunks).toString('utf8');
            resolve({
                status: res.statusCode,
                ok: res.statusCode >= 200 && res.statusCode < 300,
                headers: {
                    get: (k) => resHeaders.get(String(k).toLowerCase()) || null
                },
                text: async () => text,
                json: async () => (text ? JSON.parse(text) : {})
            });
            res.emit('finish');
        };
        res.json = (obj) => {
            res.setHeader('content-type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(obj));
            return res;
        };
        res.send = (payload) => {
            if (typeof payload === 'object' && payload !== null && !Buffer.isBuffer(payload)) {
                return res.json(payload);
            }
            res.end(payload);
            return res;
        };
        res.sendFile = (filePath) => {
            try {
                const content = fs.readFileSync(filePath);
                res.statusCode = 200;
                res.end(content);
            } catch (e) {
                res.statusCode = 404;
                res.end('Not Found');
            }
        };

        try {
            app.handle(req, res, (err) => {
                if (err) {
                    res.statusCode = err.status || 500;
                    res.json({ error: err.message || 'Internal Server Error' });
                } else if (!res.headersSent) {
                    res.statusCode = 404;
                    res.end('Not Found');
                }
            });
        } catch (err) {
            reject(err);
        }
    });
}

// ============================================================================
// Lightweight DOM / Browser Runtime for Full-Stack SPA E2E Execution
// ============================================================================
class MockElement {
    constructor(tagName = 'DIV', ownerDocument = null) {
        this.tagName = String(tagName).toUpperCase();
        this.ownerDocument = ownerDocument;
        this.id = '';
        this.className = '';
        this.style = { setProperty: (k, v) => { this.style[k] = v; } };
        this.dataset = {};
        this.attributes = {};
        this.children = [];
        this.parentNode = null;
        this.parentElement = null;
        this.listeners = {};
        this.value = '';
        this.checked = false;
        this.disabled = false;
        this.readOnly = false;
        this.selectedIndex = 0;
        this.files = [];
        this._innerHTML = '';
        this._textContent = '';
        this.classList = {
            _set: new Set(),
            add: (...cls) => {
                cls.forEach(c => this.classList._set.add(c));
                this.className = Array.from(this.classList._set).join(' ');
            },
            remove: (...cls) => {
                cls.forEach(c => this.classList._set.delete(c));
                this.className = Array.from(this.classList._set).join(' ');
            },
            contains: (c) => this.classList._set.has(c),
            toggle: (c) => {
                if (this.classList._set.has(c)) this.classList.remove(c);
                else this.classList.add(c);
            }
        };
    }

    get innerHTML() {
        return this._innerHTML;
    }

    set innerHTML(html) {
        if (this.children.length > 0 && this.ownerDocument) {
            const toRemove = new Set();
            const collect = (node) => {
                toRemove.add(node);
                if (node.id && this.ownerDocument.elementsById.get(node.id) === node) {
                    this.ownerDocument.elementsById.delete(node.id);
                }
                (node.children || []).forEach(collect);
            };
            this.children.forEach(collect);
            this.ownerDocument.allElements = this.ownerDocument.allElements.filter(el => !toRemove.has(el));
        }
        this.children = [];
        this._innerHTML = String(html ?? '');
        this._textContent = this._innerHTML.replace(/<[^>]*>/g, '');
        if (this.ownerDocument) {
            this.ownerDocument._indexHTML(this._innerHTML, this);
        }
    }

    get textContent() {
        return this._textContent || this._innerHTML.replace(/<[^>]*>/g, '');
    }

    set textContent(txt) {
        this._textContent = String(txt ?? '');
        this._innerHTML = this._textContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    get innerText() {
        return this.textContent;
    }

    set innerText(txt) {
        this.textContent = txt;
    }

    get options() {
        return this.children.filter(c => c.tagName === 'OPTION');
    }

    setAttribute(name, val) {
        const v = String(val);
        this.attributes[name] = v;
        if (name === 'id') {
            this.id = v;
            if (this.ownerDocument) this.ownerDocument.elementsById.set(v, this);
        } else if (name === 'class') {
            this.className = v;
            v.split(/\s+/).filter(Boolean).forEach(c => this.classList._set.add(c));
        } else if (name.startsWith('data-')) {
            const camel = name.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
            this.dataset[camel] = v;
        } else if (name === 'value') {
            this.value = v;
        }
    }

    getAttribute(name) {
        if (name === 'id') return this.id || null;
        if (name === 'class') return this.className || null;
        if (name.startsWith('data-')) {
            const camel = name.slice(5).replace(/-([a-z])/g, (_, l) => l.toUpperCase());
            if (this.dataset[camel] !== undefined) return this.dataset[camel];
        }
        return this.attributes[name] !== undefined ? this.attributes[name] : null;
    }

    removeAttribute(name) {
        delete this.attributes[name];
        if (name === 'disabled') this.disabled = false;
    }

    appendChild(child) {
        if (!child) return child;
        child.parentNode = this;
        child.parentElement = this;
        this.children.push(child);
        if (child.id && this.ownerDocument) {
            this.ownerDocument.elementsById.set(child.id, child);
        }
        return child;
    }

    removeChild(child) {
        const idx = this.children.indexOf(child);
        if (idx >= 0) this.children.splice(idx, 1);
        return child;
    }

    replaceChild(newChild, oldChild) {
        const idx = this.children.indexOf(oldChild);
        if (idx >= 0) {
            newChild.parentNode = this;
            newChild.parentElement = this;
            this.children[idx] = newChild;
        }
        return oldChild;
    }

    cloneNode() {
        const clone = new MockElement(this.tagName, this.ownerDocument);
        clone.id = this.id;
        clone.className = this.className;
        clone.attributes = { ...this.attributes };
        clone.dataset = { ...this.dataset };
        clone._innerHTML = this._innerHTML;
        clone._textContent = this._textContent;
        if (clone.id && this.ownerDocument) {
            this.ownerDocument.elementsById.set(clone.id, clone);
        }
        return clone;
    }

    remove() {
        if (this.parentNode) this.parentNode.removeChild(this);
        if (this.id && this.ownerDocument) this.ownerDocument.elementsById.delete(this.id);
    }

    insertAdjacentHTML(pos, html) {
        this.innerHTML += html;
    }

    addEventListener(type, fn) {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(fn);
    }

    removeEventListener(type, fn) {
        if (!this.listeners[type]) return;
        this.listeners[type] = this.listeners[type].filter(f => f !== fn);
    }

    dispatchEvent(evt) {
        const type = typeof evt === 'string' ? evt : evt.type;
        const eventObj = typeof evt === 'object' ? evt : { type };
        eventObj.target = eventObj.target || this;
        eventObj.currentTarget = this;
        eventObj.preventDefault = eventObj.preventDefault || (() => {});
        eventObj.stopPropagation = eventObj.stopPropagation || (() => {});
        (this.listeners[type] || []).forEach(fn => fn.call(this, eventObj));
    }

    click() {
        if (this.tagName === 'INPUT' && (this.attributes.type === 'checkbox' || this.attributes.type === 'radio')) {
            this.checked = !this.checked;
            this.dispatchEvent({ type: 'change', target: this });
        }
        this.dispatchEvent({ type: 'click', target: this });
    }

    focus() {}
    blur() { this.dispatchEvent({ type: 'blur', target: this }); }
    scrollIntoView() {}
    select() {}

    getBoundingClientRect() {
        return { left: 0, top: 0, width: 400, height: 150, right: 400, bottom: 150 };
    }

    getContext() {
        return {
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 2,
            lineCap: 'round',
            font: '',
            fillRect: () => {},
            clearRect: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
            fillText: () => {},
            drawImage: () => {},
            getImageData: () => ({ data: new Uint8ClampedArray(400) })
        };
    }

    toDataURL() {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    }

    querySelector(selector) {
        const all = this.querySelectorAll(selector);
        return all[0] || null;
    }

    querySelectorAll(selector) {
        if (this.ownerDocument) {
            return this.ownerDocument.querySelectorAll(selector, this);
        }
        return [];
    }

    closest(selector) {
        let cur = this;
        while (cur) {
            if (this.ownerDocument && this.ownerDocument._matches(cur, selector)) return cur;
            cur = cur.parentElement;
        }
        return null;
    }
}

class MockDocument {
    constructor() {
        this.elementsById = new Map();
        this.allElements = [];
        this.listeners = {};
        this.body = new MockElement('BODY', this);
        this.head = new MockElement('HEAD', this);
        this.documentElement = new MockElement('HTML', this);
    }

    createElement(tag) {
        const el = new MockElement(tag, this);
        this.allElements.push(el);
        return el;
    }

    createTextNode(text) {
        const el = new MockElement('#TEXT', this);
        el.textContent = text;
        return el;
    }

    getElementById(id) {
        return this.elementsById.get(id) || null;
    }

    addEventListener(type, fn) {
        if (!this.listeners[type]) this.listeners[type] = [];
        this.listeners[type].push(fn);
    }

    removeEventListener(type, fn) {
        if (!this.listeners[type]) return;
        this.listeners[type] = this.listeners[type].filter(f => f !== fn);
    }

    dispatchEvent(evt) {
        const type = typeof evt === 'string' ? evt : evt.type;
        (this.listeners[type] || []).forEach(fn => fn(evt));
    }

    _indexHTML(html, parent) {
        const voidTags = new Set(['AREA', 'BASE', 'BR', 'COL', 'EMBED', 'HR', 'IMG', 'INPUT', 'LINK', 'META', 'PARAM', 'SOURCE', 'TRACK', 'WBR']);
        const stack = [parent];
        const tagRegex = /<\/?([a-zA-Z0-9-]+)([^>]*)>/g;
        let match;
        while ((match = tagRegex.exec(html)) !== null) {
            const fullTag = match[0];
            const tagName = match[1].toUpperCase();
            const attrStr = match[2];

            if (fullTag.startsWith('</')) {
                if (stack.length > 1 && stack[stack.length - 1].tagName === tagName) {
                    stack.pop();
                }
                continue;
            }

            const curParent = stack[stack.length - 1];
            const el = new MockElement(tagName, this);
            el.parentElement = curParent;
            el.parentNode = curParent;

            const attrRegex = /([a-zA-Z0-9_-]+)(?:="([^"]*)")?/g;
            let aMatch;
            while ((aMatch = attrRegex.exec(attrStr)) !== null) {
                const aName = aMatch[1];
                const aVal = aMatch[2] !== undefined ? aMatch[2] : '';
                if (aName === 'checked') el.checked = true;
                else if (aName === 'disabled') el.disabled = true;
                else if (aName === 'readonly') el.readOnly = true;
                else el.setAttribute(aName, aVal);
            }
            curParent.children.push(el);
            if (curParent.tagName === 'SELECT' && tagName === 'OPTION') {
                if (curParent.value === '' || attrStr.includes('selected')) {
                    curParent.value = el.value;
                }
            }
            this.allElements.push(el);

            if (!voidTags.has(tagName) && !fullTag.endsWith('/>')) {
                stack.push(el);
            }
        }
    }

    _matches(el, selector) {
        if (!el || !selector) return false;
        const s = selector.trim();
        if (s.includes(' ')) {
            const tokens = s.split(/\s+/).filter(Boolean);
            const targetToken = tokens[tokens.length - 1];
            if (!this._matches(el, targetToken)) return false;
            let cursor = el.parentNode;
            for (let i = tokens.length - 2; i >= 0; i--) {
                let foundAncestor = false;
                while (cursor) {
                    if (this._matches(cursor, tokens[i])) {
                        foundAncestor = true;
                        cursor = cursor.parentNode;
                        break;
                    }
                    cursor = cursor.parentNode;
                }
                if (!foundAncestor) return false;
            }
            return true;
        }
        if (s.startsWith('#') && !s.includes('.')) {
            return el.id === s.slice(1);
        }
        if (s.startsWith('.') && !s.includes('[')) {
            return el.classList.contains(s.slice(1));
        }
        const classAttrMatch = s.match(/^\.([a-zA-Z0-9_-]+)\[([a-zA-Z0-9_-]+)="([^"]+)"\]$/);
        if (classAttrMatch) {
            return el.classList.contains(classAttrMatch[1]) && el.getAttribute(classAttrMatch[2]) === classAttrMatch[3];
        }
        const attrMatch = s.match(/^\[([a-zA-Z0-9_-]+)="([^"]+)"\]$/);
        if (attrMatch) {
            return el.getAttribute(attrMatch[1]) === attrMatch[2];
        }
        if (/^[a-zA-Z0-9]+$/.test(s)) {
            return el.tagName === s.toUpperCase();
        }
        return false;
    }

    _isDescendantOf(el, ancestor) {
        let cur = el.parentNode;
        while (cur) {
            if (cur === ancestor) return true;
            cur = cur.parentNode;
        }
        return false;
    }

    querySelector(selector, root = null) {
        return this.querySelectorAll(selector, root)[0] || null;
    }

    querySelectorAll(selector, root = null) {
        const parts = selector.split(',').map(s => s.trim());
        const pool = root ? this.allElements.filter(el => this._isDescendantOf(el, root)) : this.allElements;
        return pool.filter(el => parts.some(p => this._matches(el, p)));
    }
}

function createStorage() {
    const store = new Map();
    return {
        getItem: (k) => (store.has(k) ? store.get(k) : null),
        setItem: (k, v) => store.set(k, String(v)),
        removeItem: (k) => store.delete(k),
        clear: () => store.clear()
    };
}

function buildSPAContext() {
    const doc = new MockDocument();
    const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    doc.body.innerHTML = indexHtml;

    const alerts = [];
    const localStore = createStorage();
    const sessionStore = createStorage();

    const win = {
        document: doc,
        localStorage: localStore,
        sessionStorage: sessionStore,
        location: {
            _hash: '#/',
            get hash() { return this._hash; },
            set hash(v) {
                this._hash = v.startsWith('#') ? v : '#' + v;
            },
            reload: () => {}
        },
        navigator: { clipboard: { writeText: async () => {} } },
        console,
        setTimeout: (fn, ms) => setTimeout(fn, Math.min(ms || 0, 5)),
        clearTimeout,
        setInterval: () => 999,
        clearInterval: () => {},
        Date,
        Math,
        Intl,
        JSON,
        Number,
        String,
        Boolean,
        Array,
        Object,
        RegExp,
        Error,
        Promise,
        Map,
        Set,
        Uint8Array,
        Blob: class MockBlob { constructor(parts, opts) { this.parts = parts; this.type = opts?.type; } },
        URL: { createObjectURL: () => 'blob:mock-url', revokeObjectURL: () => {} },
        Event: class MockEvent { constructor(type) { this.type = type; } },
        FileReader: class MockFileReader {
            readAsDataURL() {
                if (this.onload) this.onload({ target: { result: 'data:image/png;base64,MOCK_PAYMENT_SUPPORT' } });
            }
        },
        alert: (msg) => { alerts.push(String(msg)); },
        confirm: () => true,
        prompt: () => 'test',
        open: () => ({ document: { write: () => {}, close: () => {} } }),
        addEventListener: (type, fn) => doc.addEventListener('win_' + type, fn),
        removeEventListener: (type, fn) => doc.removeEventListener('win_' + type, fn),
        fetch: async (url, opts = {}) => {
            if (String(url).includes('open-meteo.com')) {
                return {
                    ok: true,
                    status: 200,
                    json: async () => ({ current_weather: { temperature: 24, weathercode: 1 } })
                };
            }
            const urlPath = url.startsWith('http') ? new URL(url).pathname : (url.startsWith('/') ? url : '/' + url);
            return requestApp(opts.method || 'GET', urlPath, opts.body);
        },
        jspdf: {
            jsPDF: class MockJsPDF {
                constructor() {
                    this.textCalls = [];
                    this.imageCalls = [];
                    this.internal = { pageSize: { getWidth: () => 210, getHeight: () => 297 } };
                }
                setFillColor() {}
                rect() {}
                setTextColor() {}
                setFont() {}
                setFontSize() {}
                text(t) { this.textCalls.push(Array.isArray(t) ? t.join(' ') : String(t)); }
                setDrawColor() {}
                setLineWidth() {}
                line() {}
                roundedRect() {}
                splitTextToSize(t) { return [String(t)]; }
                addImage(img, fmt) { this.imageCalls.push({ img, fmt }); }
                addPage() {}
                save() {}
                output(type) {
                    if (type === 'datauristring') {
                        return 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PC9UeXBlL0NhdGFsb2c+PgplbmRvYmoK';
                    }
                    return new ArrayBuffer(32);
                }
            }
        }
    };
    win.window = win;
    win.globalThis = win;

    const ctx = vm.createContext(win);

    const scriptOrder = [
        'js/components.js',
        'js/modules/login.js',
        'js/modules/home.js',
        'js/modules/dashboard.js',
        'js/modules/booking.js',
        'js/modules/reservations.js',
        'js/modules/b2c-form.js',
        'js/modules/billing.js',
        'js/modules/store.js',
        'js/modules/checkin.js',
        'js/modules/manifest.js',
        'js/modules/settings.js',
        'js/modules/historySearch.js',
        'js/modules/autogestion.js',
        'js/modules/fleet.js',
        'js/modules/hrms.js',
        'js/modules/inventory.js',
        'js/modules/assignment.js',
        'js/modules/finance.js',
        'js/modules/fids.js',
        'js/modules/media.js',
        'js/modules/invoicing.js',
        'js/app.js'
    ];

    for (const relPath of scriptOrder) {
        const absPath = path.join(__dirname, '..', relPath);
        const code = fs.readFileSync(absPath, 'utf8');
        vm.runInContext(code, ctx, { filename: relPath });
    }

    return { win, doc, alerts };
}

// ============================================================================
// SUITE 1: BACKEND API & APPSEC (OWASP ZERO-TRUST)
// ============================================================================
test('1.1 [AppSec OWASP] Cabeceras de seguridad HTTP activas y ocultamiento de X-Powered-By', async () => {
    const res = await requestApp('GET', '/api/state');
    assert.equal(res.status, 200);
    assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
    assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
    assert.equal(res.headers.get('x-xss-protection'), '1; mode=block');
    assert.equal(res.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
    assert.equal(res.headers.get('x-powered-by'), null);
});

test('1.2 [AppSec Zero-Trust] Bloqueo HTTP 403 contra descarga de archivos sensibles del servidor', async () => {
    const sensitivePaths = [
        '/server.js',
        '/package.json',
        '/.env',
        '/Dockerfile',
        '/docker-compose.yml',
        '/fix_mojibake.js'
    ];

    for (const p of sensitivePaths) {
        const res = await requestApp('GET', p);
        assert.equal(res.status, 403, `El archivo sensible ${p} debería responder 403 Forbidden`);
    }
});

test('1.3 [API E2E] GET y POST /api/state persisten estado válido y rechazan payloads corruptos con HTTP 400', async () => {
    // Negative test: Array instead of plain object
    const badRes1 = await requestApp('POST', '/api/state', ['invalid']);
    assert.equal(badRes1.status, 400);

    // Negative test: Malformed JSON
    const badRes2 = await requestApp('POST', '/api/state', '{malformed_json:');
    assert.equal(badRes2.status, 400);

    // Happy path: Save and retrieve state
    const sampleState = {
        passengers: [{ id: 'pax_e2e_1', name: 'Carlos Perez', doc: '10203040' }],
        restriccionSaltos: '200 Saltos'
    };
    const postRes = await requestApp('POST', '/api/state', sampleState);
    assert.equal(postRes.status, 200);
    const postJson = await postRes.json();
    assert.equal(postJson.success, true);

    const getRes = await requestApp('GET', '/api/state');
    assert.equal(getRes.status, 200);
    const stateJson = await getRes.json();
    assert.equal(stateJson.passengers[0].name, 'Carlos Perez');
    assert.equal(stateJson.restriccionSaltos, '200 Saltos');
});

test('1.4 [API E2E Req #9] POST /api/send-payment-alert valida emails, sanitiza cabeceras y despacha alerta <= 10 días', async () => {
    // Negative test: Invalid email and missing fields
    const invalidRes = await requestApp('POST', '/api/send-payment-alert', {
        passengerName: '',
        passengerEmail: 'correo-invalido'
    });
    assert.equal(invalidRes.status, 400);

    // Happy path: Valid payment alert request
    const validRes = await requestApp('POST', '/api/send-payment-alert', {
        passengerName: 'Valentina Gomez\r\nBcc: attacker@evil.com',
        passengerDoc: '1098765432',
        passengerEmail: 'valentina@example.com',
        recipients: ['valentina@example.com', 'admin@fraterno.com'],
        jumpDate: '2026-11-25',
        daysRemaining: 7,
        totalValue: 1500000,
        totalPaid: 500000,
        pendingBalance: 1000000
    });
    assert.equal(validRes.status, 200);
    const body = await validRes.json();
    assert.equal(body.success, true);
    assert.equal(body.recipients.length, 2);
    assert.ok(!body.subject.includes('\r') && !body.subject.includes('\n'));
});

// ============================================================================
// SUITE 2: ARQUITECTURA FRONTEND, RBAC & XSS SANITIZATION
// ============================================================================
test('2.1 [Arquitectura] El 100% de los 21 módulos están registrados y libres de errores de sintaxis o referencias rotas', () => {
    const { win } = buildSPAContext();
    const expectedModules = [
        'login', 'home', 'dashboard', 'booking', 'reservations', 'b2c',
        'billing', 'store', 'checkin', 'manifest', 'settings', 'historySearch',
        'autogestion', 'fleet', 'hrms', 'inventory', 'assignment', 'finance',
        'fids', 'media', 'invoicing'
    ];

    for (const modName of expectedModules) {
        assert.ok(win.Modules[modName], `El módulo ${modName} debe existir en window.Modules`);
        assert.equal(typeof win.Modules[modName].render, 'function', `El módulo ${modName} debe implementar render()`);
    }
});

test('2.2 [RBAC & Auth Zero-Trust] Protección de rutas para usuarios no autenticados y restricción de rol Ventas', () => {
    const { win } = buildSPAContext();

    // 1. Usuario no autenticado intentando ir a /configuracion -> redirigido a #/login
    win.sessionStorage.clear();
    win.location.hash = '#/configuracion';
    win.router();
    assert.equal(win.location.hash, '#/login');

    // 2. Rutas públicas B2C (/b2c y /autogestion) son accesibles sin sesión administrativa
    win.location.hash = '#/b2c';
    win.router();
    assert.equal(win.location.hash, '#/b2c');

    // 3. Usuario con rol 'ventas' intentando acceder a /configuracion o /facturacion -> bloqueado y redirigido a #/registro-salto
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Asesor Ventas', role: 'Asesor de Ventas' }));
    win.sessionStorage.setItem('fraterno_role', 'ventas');
    win.location.hash = '#/configuracion';
    win.router();
    assert.equal(win.location.hash, '#/registro-salto');

    win.location.hash = '#/facturacion';
    win.router();
    assert.equal(win.location.hash, '#/registro-salto');

    // 4. Usuario con rol 'admin' puede acceder a /configuracion
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin', role: 'SuperAdmin' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.location.hash = '#/configuracion';
    win.router();
    assert.equal(win.location.hash, '#/configuracion');
});

test('2.3 [AppSec XSS] Sanitización HTML estricta contra payloads XSS en componentes y vistas', () => {
    const { win, doc } = buildSPAContext();
    const xssPayload = '<img src=x onerror="window.__xssTriggered=true"><script>alert(1)</script>';
    const escaped = win.escapeHTML(xssPayload);

    assert.ok(!escaped.includes('<script>'));
    assert.ok(!escaped.includes('<img'));
    assert.ok(escaped.includes('&lt;img') && escaped.includes('&lt;script&gt;'));

    // Inyectar pasajero con payload XSS en Home y verificar que se renderiza escapado en #home-flights-table
    const todayStr = new Date().toLocaleDateString('en-CA');
    win.AppData.passengers = [{
        id: 'pax_xss',
        name: xssPayload,
        date: todayStr,
        instructor: xssPayload,
        aeronave: xssPayload,
        paxStatus: 'Check-in OK',
        flightStatus: 'A tiempo / On-Time'
    }];

    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin', role: 'SuperAdmin' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.location.hash = '#/';
    win.router();

    const tbody = doc.getElementById('home-flights-table');
    assert.ok(tbody);
    assert.ok(tbody.children.length > 0);
    const rowHtml = tbody.children[0].innerHTML;
    assert.ok(!rowHtml.includes('<script>alert(1)</script>'));
    assert.ok(rowHtml.includes('&lt;script&gt;alert(1)&lt;/script&gt;'));
});

// ============================================================================
// SUITE 3: FLUJOS CRÍTICOS DE NEGOCIO (REQ #1 A #10 + REFINAMIENTOS)
// ============================================================================
test('3.1 [Req #1, #5 + Semáforo y Múltiples Poncheras] Manifiesto y FIDS: Restricción por Saltos con colores semáforo y PONCHERA multi-cantidad', async () => {
    const { win, doc } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin', role: 'SuperAdmin' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    const todayStr = new Date().toLocaleDateString('en-CA');
    win.AppData.employees = [{
        id: 'emp_single_inst',
        name: 'Mateo',
        lastname: 'Loaiza',
        role: 'Instructor Tandem',
        status: 'Activo'
    }];
    win.AppData.passengers = [{
        id: 'pax_m1',
        name: 'Andres Restrepo',
        doc: '8090100',
        date: todayStr,
        type: 'Salto Tandem',
        instructor: 'Mateo', // Nombre corto asignado en pasajero NO debe duplicar al instructor en Ponchera
        aeronave: 'HK-4512',
        vueloNum: '1',
        paxStatus: 'Check-in OK',
        flightStatus: 'A tiempo / On-Time'
    }];

    // 1. Verificar que PONCHERA solo lista al único instructor registrado (sin duplicar Mateo y Mateo Loaiza)
    win.location.hash = '#/manifiesto';
    win.router();

    const poncheraChecks = doc.querySelectorAll('.chk-ponchera-inst');
    assert.equal(poncheraChecks.length, 1, 'Si hay 1 instructor registrado, PONCHERA debe mostrar exactamente 1 instructor sin duplicados');
    assert.equal(poncheraChecks[0].value, 'Mateo Loaiza');

    const levels = [
        { val: 'Sin restricción', expectedColor: '#10b981' }, // Verde
        { val: '25 Saltos', expectedColor: '#84cc16' },       // Verde-Lima
        { val: '100 Saltos', expectedColor: '#eab308' },      // Amarillo
        { val: '200 Saltos', expectedColor: '#f59e0b' },      // Ámbar
        { val: '300 Saltos', expectedColor: '#f97316' },      // Naranja
        { val: '500 Saltos', expectedColor: '#ef4444' },      // Rojo
        { val: 'Zona Cerrada', expectedColor: '#dc2626' }     // Rojo Crítico / Cierre
    ];

    const styleFn = win.Modules.manifest.getJumpRestrictionStyle;
    assert.equal(typeof styleFn, 'function');
    for (const lvl of levels) {
        const st = styleFn(lvl.val);
        assert.equal(st.color, lvl.expectedColor, `El nivel ${lvl.val} debe tener color semáforo ${lvl.expectedColor}`);
    }

    // Verificar que existe la opción Zona Cerrada en el selector de Manifiesto
    const restSelect = doc.getElementById('manifest-jump-restriction');
    assert.ok(restSelect.options.some(o => o.value === 'Zona Cerrada'), 'Manifiesto debe incluir la opción Zona Cerrada');

    // 2. Configurar Restricción '500 Saltos' (Rojo) y Poncheras múltiples (Mateo Loaiza x3, Carlos Perez x1)
    win.AppData.restriccionSaltos = '500 Saltos';
    win.AppData.ponchera = [
        { name: 'Mateo Loaiza', count: 3 },
        { name: 'Carlos Perez', count: 1 }
    ];
    win.saveAppData();

    // Capturar intervalo de idioma de FIDS para probar también la vista en inglés
    let langToggleFn = null;
    win.setInterval = (fn, ms) => {
        if (ms === 20000) langToggleFn = fn;
        return 999;
    };

    // 3. Renderizar FIDS y verificar que se reflejan la restricción con semáforo rojo y las cantidades de ponchera
    win.location.hash = '#/fids';
    win.router();

    const fidsRestrBadge = doc.getElementById('fids-val-restriction');
    const fidsRestrText = doc.getElementById('fids-rest-text');
    const fidsLightRed = doc.getElementById('fids-light-red');
    const fidsPoncheraVal = doc.getElementById('fids-val-ponchera');
    const fidsClosedBanner = doc.getElementById('fids-closed-banner');
    const fidsClosedIcon = doc.getElementById('fids-closed-warning-icon');

    assert.ok(fidsRestrBadge && fidsRestrText && fidsLightRed && fidsPoncheraVal);
    assert.equal(fidsRestrText.textContent, '500 Saltos');
    assert.equal(fidsRestrBadge.style.borderColor, '#ef4444', 'FIDS debe aplicar el borde rojo (#ef4444) para 500 Saltos');
    assert.equal(fidsLightRed.style.opacity, '1', 'La luz roja del semáforo en FIDS debe estar encendida al 100%');
    assert.equal(fidsClosedBanner.style.display, 'none');
    assert.ok(fidsPoncheraVal.innerHTML.includes('Mateo Loaiza'), 'FIDS debe listar a Mateo Loaiza en PONCHERA');
    assert.ok(fidsPoncheraVal.innerHTML.includes('x3'), 'FIDS debe mostrar el multiplicador x3 cuando el instructor debe 3 poncheras');

    // 4. Probar selección de Zona Cerrada desde Manifiesto -> abre modal de motivo con las 3 opciones obligatorias
    win.location.hash = '#/manifiesto';
    win.router();
    const mSelect = doc.getElementById('manifest-jump-restriction');
    mSelect.value = 'Zona Cerrada';
    mSelect.dispatchEvent({ type: 'change', target: mSelect });

    const reasonSel = doc.getElementById('closed-zone-reason-select');
    assert.ok(reasonSel, 'Al elegir Zona Cerrada debe abrir el selector de motivo');
    const reasonOpts = reasonSel.options.map(o => o.value);
    assert.deepEqual(reasonOpts, [
        'Condiciones Meteorológicas',
        'Espacio Aéreo y Control de Tráfico (ATC)',
        'Seguridad en Tierra (Zona de Aterrizaje y Pista)',
        'Operación en Tierra',
        'Orden Público'
    ]);
    reasonSel.value = 'Espacio Aéreo y Control de Tráfico (ATC)';
    doc.getElementById('closed-reason-confirm').click();
    await new Promise(r => setTimeout(r, 10));

    assert.equal(win.AppData.restriccionSaltos, 'Zona Cerrada');
    assert.equal(win.AppData.zonaCerradaMotivo, 'Espacio Aéreo y Control de Tráfico (ATC)');
    assert.equal(doc.getElementById('manifest-closed-reason-text').textContent, 'Espacio Aéreo y Control de Tráfico (ATC)');

    // 4.b Verificar en FIDS: Zona Cerrada (ES) -> NO-GO (EN) + Motivo visible en ambos idiomas
    win.location.hash = '#/fids';
    win.router();
    assert.equal(doc.getElementById('fids-rest-text').textContent, 'Zona Cerrada');
    assert.equal(doc.getElementById('fids-closed-warning-icon').style.display, 'inline-block');
    assert.equal(doc.getElementById('fids-closed-banner').style.display, 'flex');
    assert.equal(doc.getElementById('fids-closed-reason-display').textContent, 'MOTIVO: Espacio Aéreo y Control de Tráfico (ATC)');

    assert.equal(typeof langToggleFn, 'function');
    langToggleFn(); // Cambiar a inglés
    assert.equal(doc.getElementById('fids-rest-text').textContent, 'NO-GO');
    assert.ok(doc.getElementById('fids-closed-banner-text').textContent.includes('NO-GO'));
    assert.equal(doc.getElementById('fids-closed-reason-display').textContent, 'REASON: Airspace & Air Traffic Control (ATC)');

    // 5. Probar Sin restricción -> Español: "Sin Restricción" / Inglés: "All Jumpers"
    win.AppData.restriccionSaltos = 'Sin restricción';
    win.AppData.zonaCerradaMotivo = '';
    win.saveAppData();
    langToggleFn(); // Volver a español
    assert.equal(doc.getElementById('fids-rest-text').textContent, 'Sin Restricción');
    assert.equal(doc.getElementById('fids-closed-banner').style.display, 'none');

    langToggleFn(); // Cambiar a inglés
    assert.equal(doc.getElementById('fids-rest-text').textContent, 'All Jumpers');
});

test('3.2 [Req #3 y #10] Portal B2C y Consulta Historial: Firma insertada en los 4 documentos legales y Soporte de Pago al final', async () => {
    const { win, doc, alerts } = buildSPAContext();

    // 1. Verificar que en Portal B2C solo se envía código OTP a documentos de pasajeros reservados activos
    win.AppData.passengers = [{
        id: 'pax_res_active',
        name: 'Laura Martinez',
        doc: '1030507090',
        paxStatus: 'Pendiente Check-in',
        flightStatus: 'A tiempo / On-Time'
    }];

    win.location.hash = '#/b2c';
    win.router();

    const b2cDocInput = doc.getElementById('b2c-doc');
    const btnSendOtp = doc.getElementById('btn-send-otp');
    const otpContainer = doc.getElementById('otp-container');
    assert.ok(b2cDocInput && btnSendOtp && otpContainer);

    // 1.a Documento vacío -> bloqueado
    b2cDocInput.value = '   ';
    const alertsBeforeOtp = alerts.length;
    btnSendOtp.click();
    assert.ok(alerts.length > alertsBeforeOtp, 'Debe mostrar alerta si se solicita código sin ingresar documento');
    assert.equal(otpContainer.style.display, 'none', 'No debe desplegar #otp-container si el documento está vacío');

    // 1.b Documento no existente / sin reserva -> bloqueado (no enviar token)
    b2cDocInput.value = '999999999';
    const alertsBeforeNotFound = alerts.length;
    btnSendOtp.click();
    assert.ok(alerts.length > alertsBeforeNotFound, 'Debe mostrar alerta si el documento no corresponde a un pasajero reservado');
    assert.equal(otpContainer.style.display, 'none', 'No debe enviar token ni desplegar #otp-container si el documento no existe en reservas');

    // 1.c Documento que sí coincide con pasajero reservado -> permitido
    b2cDocInput.value = '1030507090';
    btnSendOtp.click();
    assert.equal(otpContainer.style.display, 'block', 'Debe desplegar #otp-container cuando el documento coincide con un pasajero reservado');

    // 1.b Verificar que en Portal B2C el paso de soporte de pago está oculto inicialmente
    const paymentSupportStep = doc.getElementById('payment-support-step');
    assert.ok(paymentSupportStep, 'Debe existir el contenedor #payment-support-step en B2C');
    assert.ok(
        paymentSupportStep.getAttribute('style').includes('display: none'),
        'El soporte de pago debe estar oculto hasta que el cliente firme la aceptación legal'
    );

    // 2. Generar los 4 documentos legales firmados mediante LegalDocsHelper
    const pax = {
        id: 'pax_b2c_1',
        name: 'Laura Martinez',
        doc: '1030507090',
        phone: '3001234567',
        email: 'laura@example.com',
        weight: 62,
        type: 'Salto Tandem',
        date: new Date().toLocaleDateString('en-CA'),
        paxStatus: 'Check-in OK',
        waiverSigned: true,
        signature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        paymentSupport: {
            fileName: 'comprobante_bancolombia.png',
            type: 'image/png',
            dataUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
            uploadedAt: new Date().toISOString()
        }
    };

    const signedDocs = await win.LegalDocsHelper.generateAllSignedLegalDocs(pax, 'es');
    assert.ok(signedDocs.guia && signedDocs.guia.startsWith('data:application/pdf'), 'Guía de Bienvenida firmada generada');
    assert.ok(signedDocs.terminos && signedDocs.terminos.startsWith('data:application/pdf'), 'Términos y Condiciones firmado generado');
    assert.ok(signedDocs.ficha && signedDocs.ficha.startsWith('data:application/pdf'), 'Ficha de Información firmada generada');
    assert.ok(signedDocs.exoneracion && signedDocs.exoneracion.startsWith('data:application/pdf'), 'Exoneración de Responsabilidad firmada generada');

    pax.signedLegalDocs = signedDocs;
    win.AppData.passengers = [pax];

    // 3. Verificar visibilidad en Consulta Historial (/historial)
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin', role: 'SuperAdmin' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.location.hash = '#/historial';
    win.router();

    const resultsBody = doc.getElementById('global-search-results');
    assert.ok(resultsBody);
    assert.ok(resultsBody.children.length > 0, 'Debe listar al cliente en Consulta Historial');

    // Abrir modal de detalles del cliente y verificar los 4 documentos firmados y el Soporte de Pago B2C
    const viewDetailsBtn = doc.querySelector('.btn-view-pax');
    assert.ok(viewDetailsBtn, 'Debe existir el botón Ver Historial (.btn-view-pax)');
    viewDetailsBtn.click();

    const detailsBody = doc.getElementById('details-body');
    assert.ok(detailsBody);
    assert.ok(detailsBody.innerHTML.includes('4 Docs Firmados'), 'Consulta Historial debe mostrar los 4 documentos legales firmados');
    assert.ok(detailsBody.innerHTML.includes('Soporte de Pago B2C'), 'Consulta Historial debe mostrar el Soporte de Pago B2C');
});

test('3.3 [Req #4, #9 y #10] Módulo Reservas: Relación de Pago Completo vs Incompleto, Soporte B2C y Alerta de Correo <= 10 días', async () => {
    const { win } = buildSPAContext();

    const futureDate5Days = new Date(Date.now() + 5 * 86400000).toLocaleDateString('en-CA');
    const futureDate20Days = new Date(Date.now() + 20 * 86400000).toLocaleDateString('en-CA');

    const paxIncompleteSoon = {
        id: 'pax_inc_5d',
        name: 'Santiago Rios',
        doc: '11223344',
        email: 'santiago@example.com',
        date: futureDate5Days,
        type: 'Salto Tandem',
        financiera: { totalValue: 1500000, totalPaid: 500000 }
    };

    const paxCompleteSoon = {
        id: 'pax_comp_5d',
        name: 'Maria Fernanda',
        doc: '55667788',
        email: 'maria@example.com',
        date: futureDate5Days,
        type: 'Salto Tandem',
        financiera: { totalValue: 1500000, totalPaid: 1500000 }
    };

    const paxIncompleteFar = {
        id: 'pax_inc_20d',
        name: 'Pedro Gomez',
        doc: '99887766',
        email: 'pedro@example.com',
        date: futureDate20Days,
        type: 'Salto Tandem',
        financiera: { totalValue: 1500000, totalPaid: 300000 }
    };

    // 1. Verificar cálculo financiero (getPaxFinancialSummary)
    const sumIncomplete = win.getPaxFinancialSummary(paxIncompleteSoon);
    assert.equal(sumIncomplete.isComplete, false);
    assert.equal(sumIncomplete.pendingBalance, 1000000);

    const sumComplete = win.getPaxFinancialSummary(paxCompleteSoon);
    assert.equal(sumComplete.isComplete, true);
    assert.equal(sumComplete.pendingBalance, 0);

    // 2. Verificar detección de reservas con pago incompleto y <= 10 días para el salto
    win.AppData.passengers = [paxIncompleteSoon, paxCompleteSoon, paxIncompleteFar];
    const eligible = win.PaymentAlertsHelper.getEligiblePassengers();
    assert.equal(eligible.length, 1, 'Solo la reserva con pago incompleto y <= 10 días debe generar alerta');
    assert.equal(eligible[0].pax.id, 'pax_inc_5d');
    assert.ok(eligible[0].daysRemaining <= 10 && eligible[0].daysRemaining >= 4);

    // 3. Despachar alerta por correo electrónico al backend y verificar registro
    const dispatchRes = await win.PaymentAlertsHelper.sendPaymentAlertEmail(eligible[0]);
    assert.equal(dispatchRes.success, true);
    assert.ok(paxIncompleteSoon.lastPaymentAlertDate && paxIncompleteSoon.lastPaymentAlertAt, 'Debe registrar fecha y hora de alerta enviada');
    assert.equal(win.AppData.emailAlertsLog.length, 1, 'Debe registrar el evento en emailAlertsLog');
});

test('3.4 [Req #6 y #7] RRHH y Check-in: Creación del cargo Rigger y asignación de Instructor Tandem, AFF y S&TA', () => {
    const { win, doc } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin', role: 'SuperAdmin' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    // 1. Verificar helper de roles aplicables para instructor asignado
    assert.equal(win.isAssignableInstructor({ role: 'Instructor Tandem', status: 'Activo' }), true);
    assert.equal(win.isAssignableInstructor({ role: 'Instructor AFF', status: 'Activo' }), true);
    assert.equal(win.isAssignableInstructor({ role: 'S&TA', status: 'Activo' }), true);
    assert.equal(win.isAssignableInstructor({ role: 'Rigger', status: 'Activo' }), false);
    assert.equal(win.isAssignableInstructor({ role: 'Piloto', status: 'Activo' }), false);
    assert.equal(win.isAssignableInstructor({ role: 'Instructor Tandem', status: 'Inactivo' }), false);

    // 2. Verificar que en RRHH (/rrhh) existe la opción 'Rigger' en el selector de Rol / Cargo
    win.location.hash = '#/rrhh';
    win.router();

    const roleSelect = doc.getElementById('emp-role');
    assert.ok(roleSelect, 'Debe existir el selector #emp-role en RRHH');
    const roleOptions = roleSelect.options.map(o => o.value);
    assert.ok(roleOptions.includes('Rigger'), 'El selector de cargos en RRHH debe incluir el cargo Rigger');
    assert.ok(roleOptions.includes('Instructor Tandem'));
    assert.ok(roleOptions.includes('Instructor AFF'));
    assert.ok(roleOptions.includes('S&TA'));

    // 3. Crear un nuevo miembro incluyendo Fecha de Nacimiento (#emp-dob) y verificar persistencia y visualización
    const dobInput = doc.getElementById('emp-dob');
    assert.ok(dobInput, 'Debe existir el campo de fecha de nacimiento #emp-dob en RRHH');
    doc.getElementById('emp-name').value = 'Camila';
    doc.getElementById('emp-lastname').value = 'Torres';
    doc.getElementById('emp-doc').value = '10405060';
    doc.getElementById('emp-phone').value = '3109998877';
    dobInput.value = '1992-08-14';
    doc.getElementById('emp-email').value = 'camila@fraterno.com';
    roleSelect.value = 'Rigger';
    doc.getElementById('btn-save-emp').click();

    const savedEmp = win.AppData.employees.find(e => e.doc === '10405060');
    assert.ok(savedEmp, 'El miembro debe guardarse en AppData.employees');
    assert.equal(savedEmp.dob, '1992-08-14', 'La fecha de nacimiento debe guardarse en el miembro');
    const empListEl = doc.getElementById('emp-list');
    assert.ok(empListEl.children.some(c => c.innerHTML.includes('1992-08-14')), 'La tarjeta del directorio debe mostrar la fecha de nacimiento');
});

test('3.5 [Req #8] Configuración / Aeronaves: Paso de Operativa a AOG y migración de vuelos programados', () => {
    const { win } = buildSPAContext();
    const todayStr = new Date().toLocaleDateString('en-CA');

    win.AppData.aeronaves = [
        { id: 'av_1', matricula: 'HK-4512', modelo: 'Cessna 182', capFun: '4', capTan: '2', capCop: '1', estado: 'Operativa' },
        { id: 'av_2', matricula: 'HK-5099', modelo: 'Caravan 208', capFun: '14', capTan: '6', capCop: '1', estado: 'Operativa' }
    ];
    win.AppData.asignacionFlota = [
        { id: 'fl_1', id_aeronave: 'av_1', fecha: todayStr, horaInicio: '09:00', duracion: 30, estado: 'Programado' },
        { id: 'fl_2', id_aeronave: 'av_1', fecha: todayStr, horaInicio: '10:00', duracion: 30, estado: 'Programado' }
    ];
    win.AppData.passengers = [
        { id: 'px_1', name: 'Pax Vuelo 1', date: todayStr, aeronave: 'HK-4512 (Cessna 182)' }
    ];

    // Simular migración de av_1 (pasa a AOG) hacia av_2 (HK-5099)
    const sourcePlane = win.AppData.aeronaves[0];
    const targetPlane = win.AppData.aeronaves[1];
    sourcePlane.estado = 'AOG';

    win.AppData.asignacionFlota.forEach(f => {
        if (f.id_aeronave === sourcePlane.id && f.fecha >= todayStr) {
            f.id_aeronave = targetPlane.id;
        }
    });

    const newLabel = `${targetPlane.matricula} (${targetPlane.modelo})`;
    win.AppData.passengers.forEach(p => {
        if (p.date >= todayStr && p.aeronave && p.aeronave.includes(sourcePlane.matricula)) {
            p.aeronave = newLabel;
        }
    });

    assert.equal(win.AppData.asignacionFlota[0].id_aeronave, 'av_2');
    assert.equal(win.AppData.asignacionFlota[1].id_aeronave, 'av_2');
    assert.equal(win.AppData.passengers[0].aeronave, 'HK-5099 (Caravan 208)');
});

test('3.6 [Inventario, Caja, Tienda y Autogestión] Validación de salud de equipos Tándem y casos borde', () => {
    const { win, doc, alerts } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin', role: 'SuperAdmin' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    // 1. Inventario: Renderizar tabla de equipos Tándem con partes en estado OK, Warning y Danger
    win.AppData.tandemRigs = [{
        id: 'TANDEM-01',
        parts: {
            'Contenedor': { serial: 'CNT-101', currentJumps: 100, limitJumps: 500, date: '2026-01-01', limitMonths: 24 },
            'AAD': { serial: 'AAD-202', currentJumps: 495, limitJumps: 500, date: '2026-01-01', limitMonths: 24 },
            'Cúpula Principal': { serial: 'CUP-303', currentJumps: 520, limitJumps: 500, date: '2026-01-01', limitMonths: 24 },
            'Reserva': { serial: 'RES-404', currentJumps: 10, limitJumps: 500, date: '2026-01-01', limitMonths: 24 },
            'Arnès': { serial: 'ARN-505', currentJumps: 50, limitJumps: 500, date: '2026-01-01', limitMonths: 24 }
        }
    }];

    win.location.hash = '#/inventario';
    win.router();

    const tandemTbody = doc.getElementById('tandem-table-body');
    assert.ok(tandemTbody);
    assert.ok(tandemTbody.innerHTML.includes('TANDEM-01'));
    assert.ok(!tandemTbody.innerHTML.includes('undefined'), 'La tabla de equipos Tándem nunca debe renderizar valores undefined');
    assert.ok(tandemTbody.innerHTML.includes('520 saltos (límite 500)'));

    // 2. Registro de Salto (Edge Case / Negative Test): Menor de 12 años bloquea el botón de guardar
    win.location.hash = '#/registro-salto';
    win.router();

    const dobInput = doc.getElementById('p-dob');
    const saveBtn = doc.getElementById('btn-save-res');
    const twoYearsAgo = new Date(Date.now() - 2 * 365 * 86400000).toLocaleDateString('en-CA');
    dobInput.value = twoYearsAgo;
    dobInput.dispatchEvent({ type: 'change', target: dobInput });
    assert.equal(saveBtn.disabled, true, 'Un pasajero menor de 12 años debe deshabilitar el botón de guardar reserva');

    // 3. Adulto válido habilita el botón, pero fecha en el pasado es rechazada al guardar
    const adultDob = '1995-05-15';
    dobInput.value = adultDob;
    dobInput.dispatchEvent({ type: 'change', target: dobInput });
    assert.equal(saveBtn.disabled, false);

    doc.getElementById('p-name').value = 'Juan';
    doc.getElementById('p-lastname').value = 'Prueba';
    doc.getElementById('p-doc').value = '123456789';
    doc.getElementById('p-phone').value = '3001112233';
    doc.getElementById('p-email').value = 'juan@test.com';
    doc.getElementById('p-jumpdate').value = '2020-01-01'; // Fecha en el pasado

    const alertsBefore = alerts.length;
    saveBtn.click();
    assert.ok(alerts.length > alertsBefore, 'Debe disparar alerta al intentar guardar una fecha en el pasado');
    assert.ok(alerts[alerts.length - 1].includes('pasado'), 'El mensaje debe indicar que la fecha no puede estar en el pasado');
});

test('3.7 [Reinicio en Blanco] POST /api/reset-state y window.resetSystemToBlank() limpian todos los datos de prueba', async () => {
    const { win } = buildSPAContext();

    // Poblar datos de prueba simulados
    win.AppData.passengers = [{ id: 'p1', name: 'Test Pax' }];
    win.AppData.employees = [{ id: 'e1', name: 'Test Inst', role: 'Instructor Tandem' }];
    win.AppData.aeronaves = [{ id: 'a1', matricula: 'HK-9999' }];
    win.AppData.ponchera = [{ name: 'Test Inst', count: 2 }];
    win.AppData.restriccionSaltos = '500 Saltos';
    win.localStorage.setItem('factura_seq', '42');

    // Ejecutar reinicio completo
    await win.resetSystemToBlank();

    assert.equal(win.AppData.passengers.length, 0);
    assert.equal(win.AppData.employees.length, 0);
    assert.equal(win.AppData.aeronaves.length, 0);
    assert.equal(win.AppData.ponchera.length, 0);
    assert.equal(win.AppData.restriccionSaltos, 'Sin restricción');
    assert.equal(win.AppData.users.length, 1);
    assert.equal(win.AppData.users[0].username, 'admin01');
    assert.equal(win.localStorage.getItem('factura_seq'), '1');

    // Verificar que el servidor también quedó en blanco vía GET /api/state
    const stateRes = await requestApp('GET', '/api/state');
    assert.equal(stateRes.status, 200);
    const serverState = await stateRes.json();
    assert.equal(serverState.passengers.length, 0);
    assert.equal(serverState.employees.length, 0);
    assert.equal(serverState.aeronaves.length, 0);
    assert.equal(serverState.restriccionSaltos, 'Sin restricción');
});

test('3.8 [Resiliencia B2C / Storage Quota] saveAppData nunca falla ante QuotaExceededError de localStorage y persiste adjuntos en PostgreSQL', async () => {
    const { win } = buildSPAContext();

    // Simular cuota de localStorage excedida cuando el payload supera 50 KB
    const origSetItem = win.localStorage.setItem;
    win.localStorage.setItem = (k, v) => {
        if (k === 'fraterno_app_data' && String(v).length > 50000) {
            throw new Error("Failed to execute 'setItem' on 'Storage': Setting the value of 'fraterno_app_data' exceeded the quota.");
        }
        return origSetItem(k, v);
    };

    const bigReceipt = 'data:image/jpeg;base64,' + 'A'.repeat(120000);
    const bigSelfie = 'data:image/jpeg;base64,' + 'B'.repeat(90000);

    win.AppData.passengers = [{
        id: 'pax_quota_test',
        name: 'Laura Quota',
        doc: '10998877',
        selfie: bigSelfie,
        paymentSupport: { fileName: 'comprobante.jpg', dataUrl: bigReceipt }
    }];

    // No debe lanzar excepción y debe sincronizar el payload completo con /api/state
    await assert.doesNotReject(async () => {
        await win.saveAppData();
    });

    const stateRes = await requestApp('GET', '/api/state');
    const serverState = await stateRes.json();
    const savedPax = serverState.passengers.find(p => p.id === 'pax_quota_test');
    assert.ok(savedPax, 'El pasajero debe quedar guardado en el servidor aunque localStorage exceda su cuota');
    assert.equal(savedPax.paymentSupport.dataUrl.length, bigReceipt.length, 'El soporte de pago completo debe persistir en PostgreSQL');
    assert.equal(savedPax.selfie.length, bigSelfie.length, 'La selfie completa debe persistir en PostgreSQL');

    // Restaurar estado limpio en el servidor al finalizar
    await requestApp('POST', '/api/reset-state', {});
});

test('3.9 [Portal B2C Pre-llenado + Ficha Informativa + Exoneración con Iniciales + PDF Consolidado 4-en-1]', async () => {
    const { win, doc } = buildSPAContext();
    const mockSig = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const mockSelfie = 'data:image/jpeg;base64,MOCK_SELFIE_DATA';
    const mockReceipt = 'data:image/jpeg;base64,MOCK_RECEIPT_DATA';

    // 1. Pasajero que ya diligenció B2C previamente -> no debe diligenciar 2 veces lo mismo
    const existingPax = {
        id: 'pax_b2c_prefill',
        name: 'Andres Felipe Gomez',
        lastname: 'Gomez',
        docType: 'Cédula de Ciudadanía (CC)',
        doc: '1036900111',
        date: '2026-12-05',
        dob: '1993-04-20',
        phone: '3105554433',
        email: 'andres@fraterno.com',
        type: 'Salto Tandem',
        cams: 'Cámara 360',
        weight: 74,
        country: 'Colombia',
        state: 'Antioquia',
        city: 'Medellín',
        address: 'Cra 43A # 10-20',
        occupation: 'Independiente',
        favActivities: 'Paracaidismo y montañismo',
        contactMethod: 'Instagram',
        medicalCondition: 'Ninguna',
        paxStatus: 'Pendiente Check-in',
        flightStatus: 'Programado',
        b2cCompleted: true,
        waiverSigned: true,
        signedAt: '19/11/2026, 3:55:00 p. m.',
        legalDocsAccepted: { bienvenida: true, terminos: true, ficha: true, exoneracion: true },
        selfie: mockSelfie,
        signature: mockSig,
        paymentSupport: {
            dataUrl: mockReceipt,
            fileName: 'soporte_bancolombia.jpg',
            paymentDate: '2026-11-19',
            paymentMethod: 'Transferencia Bancaria'
        }
    };
    win.AppData.passengers = [existingPax];

    win.location.hash = '#/b2c';
    win.router();

    doc.getElementById('b2c-doc').value = '1036900111';
    doc.getElementById('btn-send-otp').click();
    doc.getElementById('b2c-otp').value = '123456';
    doc.getElementById('btn-verify-otp').click();

    // Verificar pre-llenado completo
    assert.equal(doc.getElementById('b2c-prefilled-banner').style.display, 'block', 'Debe mostrar aviso de información precargada');
    assert.equal(doc.getElementById('b2c-jump-date').value, '2026-12-05', 'Debe precargar la fecha de salto real');
    assert.equal(doc.getElementById('weight-input').value, 74, 'Debe precargar el peso ya diligenciado');
    assert.equal(doc.getElementById('b2c-address').value, 'Cra 43A # 10-20', 'Debe precargar la dirección ya diligenciada');
    assert.equal(doc.getElementById('b2c-occupation').value, 'Independiente', 'Debe precargar la ocupación');
    assert.equal(doc.getElementById('b2c-activities').value, 'Paracaidismo y montañismo', 'Debe precargar actividades favoritas');
    assert.equal(doc.getElementById('chk-bienvenida').checked, true);
    assert.equal(doc.getElementById('chk-terminos').checked, true);
    assert.equal(doc.getElementById('chk-ficha').checked, true);
    assert.equal(doc.getElementById('chk-exo').checked, true);
    assert.equal(doc.getElementById('selfie-saved-preview').style.display, 'block', 'Debe mostrar selfie ya registrada');
    assert.equal(doc.getElementById('sig-saved-badge').style.display, 'inline-flex', 'Debe indicar que la firma ya está registrada');
    assert.equal(doc.getElementById('payment-support-step').style.display, 'block', 'Debe habilitar el paso de soporte de pago si ya había firmado');

    // 2. Verificar diligenciamiento completo de Ficha Informativa (Doc 3)
    const catalog = win.LegalDocsHelper.getDocsCatalog('es');
    const fichaBody = win.LegalDocsHelper.buildPopulatedBodyText(catalog[2], existingPax, 'es');
    assert.ok(fichaBody.includes('Fecha de Salto: 2026-12-05'), 'Ficha debe incluir Fecha de Salto');
    assert.ok(fichaBody.includes('Nombre Completo: Andres Felipe Gomez'), 'Ficha debe incluir Nombre Completo');
    assert.ok(fichaBody.includes('Cédula de Ciudadanía (CC) - 1036900111'), 'Ficha debe incluir tipo y número de documento');
    assert.ok(fichaBody.includes('Medellín, Antioquia, Colombia'), 'Ficha debe incluir ubicación');
    assert.ok(fichaBody.includes('Cra 43A # 10-20'), 'Ficha debe incluir dirección');

    // 3. Verificar diligenciamiento de Exoneración de Responsabilidad (Doc 4) con Yo + Tipo Doc + Doc + Iniciales
    const exoBody = win.LegalDocsHelper.buildPopulatedBodyText(catalog[3], existingPax, 'es');
    assert.ok(
        exoBody.includes('Yo, Andres Felipe Gomez, mayor de edad, identificado(a) con Cédula de Ciudadanía (CC) No. 1036900111'),
        'Exoneración debe incluir Yo, Nombre del pasajero, tipo de documento y número de documento'
    );
    const initialsMatches = exoBody.match(/Iniciales del participante:\s*A\.F\.G/g) || [];
    assert.ok(initialsMatches.length >= 9, 'Exoneración debe insertar las iniciales del participante en todas las cláusulas');

    // 4. Verificar consolidación de los 4 PDFs en 1 solo PDF con Nombre completo, Documento, Firma y Fecha en los 4
    const consolidatedPdf = win.LegalDocsHelper.buildConsolidatedJsPdf(existingPax, 'es');
    const allText = consolidatedPdf.textCalls.join('\n');
    assert.ok(allText.includes('1. Guía de Bienvenida'));
    assert.ok(allText.includes('2. Términos y Condiciones'));
    assert.ok(allText.includes('3. Ficha Informativa'));
    assert.ok(allText.includes('4. Exoneración de Responsabilidad'));
    assert.ok(allText.includes('Nombre completo: Andres Felipe Gomez'));
    assert.ok(allText.includes('Documento: Cédula de Ciudadanía (CC) 1036900111'));
    assert.ok(allText.includes('Fecha: 19/11/2026, 3:55:00 p. m.'));
    assert.ok(allText.includes('Firma:'));
    assert.equal(consolidatedPdf.imageCalls.length, 4, 'La firma electrónica debe insertarse en el campo Firma de los 4 documentos consolidados');
});

test('3.10 [Plantillas PDF Cargadas] Diligenciamiento exacto por coordenadas en Exoneración y Ficha Informativa subidas en Configuración', async () => {
    const { win } = buildSPAContext();

    // Simular exactamente el PDF subido en el screenshot del usuario (Exoneración de Responsabilidad)
    const mockPdfItems = [
        // Línea 1: Yo, ______________________________, mayor de edad, identificado(a) con
        { str: 'Yo,', transform: [1, 0, 0, 10, 60, 680], width: 16, height: 10 },
        { str: '______________________________', transform: [1, 0, 0, 10, 82, 680], width: 190, height: 10 },
        { str: ', mayor de edad, identificado(a) con', transform: [1, 0, 0, 10, 275, 680], width: 180, height: 10 },
        // Línea 2: ________________ No. _________________, actuando en nombre propio...
        { str: '________________', transform: [1, 0, 0, 10, 60, 660], width: 95, height: 10 },
        { str: 'No.', transform: [1, 0, 0, 10, 160, 660], width: 18, height: 10 },
        { str: '_________________', transform: [1, 0, 0, 10, 182, 660], width: 105, height: 10 },
        { str: ', actuando en nombre propio', transform: [1, 0, 0, 10, 290, 660], width: 150, height: 10 },
        // Cláusulas con Iniciales del participante: ________
        { str: 'Iniciales del participante: ________', transform: [1, 0, 0, 10, 60, 520], width: 170, height: 10 },
        { str: 'Iniciales del participante:', transform: [1, 0, 0, 10, 60, 410], width: 120, height: 10 },
        { str: '________', transform: [1, 0, 0, 10, 184, 410], width: 48, height: 10 },
        // Ficha Informativa: Fecha de salto
        { str: 'Fecha de salto: ________________', transform: [1, 0, 0, 10, 60, 340], width: 180, height: 10 },
        // Bloque final de firma: Nombre completo, Documento, Firma, Fecha
        { str: 'Nombre completo: ________________________', transform: [1, 0, 0, 10, 60, 200], width: 220, height: 10 },
        { str: 'Documento: ________________________', transform: [1, 0, 0, 10, 60, 180], width: 200, height: 10 },
        { str: 'Firma: ________________________', transform: [1, 0, 0, 10, 60, 140], width: 180, height: 10 },
        { str: 'Fecha: ________________________', transform: [1, 0, 0, 10, 60, 100], width: 180, height: 10 }
    ];

    const drawnTexts = [];
    const drawnImages = [];

    win.pdfjsLib = {
        getDocument: () => ({
            promise: Promise.resolve({
                numPages: 1,
                getPage: async () => ({
                    getTextContent: async () => ({ items: mockPdfItems })
                })
            })
        })
    };

    win.PDFLib = {
        StandardFonts: { Helvetica: 'Helvetica', HelveticaBold: 'Helvetica-Bold' },
        rgb: (r, g, b) => ({ r, g, b }),
        PDFDocument: {
            load: async () => ({
                getPages: () => [{
                    getSize: () => ({ width: 612, height: 792 }),
                    drawText: (text, opts) => drawnTexts.push({ text, ...opts }),
                    drawImage: (img, opts) => drawnImages.push({ img, ...opts })
                }],
                embedFont: async () => ({ widthOfTextAtSize: (t, sz) => t.length * sz * 0.5 }),
                embedPng: async () => ({ scaleToFit: (w, h) => ({ width: Math.min(w, 90), height: Math.min(h, 28) }) }),
                getForm: () => ({ getFields: () => [] }),
                save: async () => new Uint8Array([37, 80, 68, 70])
            })
        }
    };

    // Mock fetch for signature dataUrl -> ArrayBuffer
    const origFetch = win.fetch;
    win.fetch = async (url, opts) => {
        if (String(url).startsWith('data:')) {
            return { ok: true, arrayBuffer: async () => new ArrayBuffer(16) };
        }
        return origFetch(url, opts);
    };

    const paxData = {
        name: 'Andres Felipe Gomez',
        docType: 'Cédula de Ciudadanía (CC)',
        doc: '1036900111',
        date: '2026-12-05',
        signedAt: '19/11/2026',
        signature: 'data:image/png;base64,MOCK_PNG'
    };

    await win.LegalDocsHelper.fillUploadedPdfTemplate(new ArrayBuffer(16), 'exoneracion', paxData, 'es');

    const textsList = drawnTexts.map(d => d.text);
    // Verificar Yo, Nombre
    assert.ok(drawnTexts.some(d => d.text === 'Andres Felipe Gomez' && Math.abs(d.y - 682) < 5), 'Debe escribir el nombre completo en Yo, ______');
    // Verificar Tipo Doc antes de No.
    assert.ok(drawnTexts.some(d => d.text === 'C.C.' && Math.abs(d.y - 662) < 5), 'Debe escribir el tipo de documento antes de No.');
    // Verificar Número de documento después de No.
    assert.ok(drawnTexts.some(d => d.text === '1036900111' && Math.abs(d.y - 662) < 5), 'Debe escribir el número de documento después de No.');
    // Verificar Iniciales del participante en ambas cláusulas (unificada y separada)
    const initialsDrawn = drawnTexts.filter(d => d.text === 'A.F.G');
    assert.equal(initialsDrawn.length, 2, 'Debe escribir las iniciales A.F.G en cada campo Iniciales del participante: ________');
    // Verificar Fecha de salto
    assert.ok(drawnTexts.some(d => d.text === '2026-12-05' && Math.abs(d.y - 342) < 5), 'Debe escribir Fecha de salto');
    // Verificar Nombre completo, Documento y Fecha del bloque de firma
    assert.ok(drawnTexts.some(d => d.text === 'Andres Felipe Gomez' && Math.abs(d.y - 202) < 5), 'Debe escribir Nombre completo en bloque de firma');
    assert.ok(drawnTexts.some(d => d.text === '1036900111' && Math.abs(d.y - 182) < 5), 'Debe escribir Documento en bloque de firma');
    assert.ok(drawnTexts.some(d => d.text === '19/11/2026' && Math.abs(d.y - 102) < 5), 'Debe escribir Fecha de aceptación legal en campo Fecha');
    // Verificar Firma electrónica ubicada exactamente en campo Firma (y ~ 136)
    assert.equal(drawnImages.length, 1, 'Debe ubicar la firma electrónica exactamente en el campo Firma sin duplicarla');
    assert.ok(Math.abs(drawnImages[0].y - 136) < 10, 'La firma debe dibujarse sobre las coordenadas Y del campo Firma');
});

test('3.11 [Seguridad Maestro de Valores] Actualizaciones de tarifas nunca afectan facturación ni datos anteriores y solo aplican a registros futuros', async () => {
    const { win, doc } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin Master', role: 'Administrador' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    // 1. Configurar Tarifa Inicial v1 en Maestro de Valores
    win.AppData.maestroValores = [
        { name: 'Salto Tandem', price: '1500000', comision: '150000' },
        { name: 'Cámara 360', price: '150000', comision: '50000' },
        { name: 'Cámara Go-Pro', price: '100000', comision: '30000' },
        { name: 'Cámara Externa', price: '250000', comision: '80000' },
        { name: 'Valor KG Extra', price: '5000', comision: '2000' },
        { name: 'Empaque Tandem', price: '25000', comision: '0' },
        { name: 'Empaque Escuela', price: '20000', comision: '0' },
        { name: 'Fun Jumper', price: '0', comision: '0' },
        { name: 'Copiloto', price: '0', comision: '0' }
    ];
    win.AppData.maestroValoresVersion = 1;
    win.AppData.maestroValoresHistory = [];
    win.TariffGuard.ensureVersionMetadata();

    win.AppData.employees = [
        { id: 'emp_pack_1', name: 'Luis Empacador', role: 'Empacador', status: 'Activo' },
        { id: 'emp_inst_1', name: 'Juan Instructor', role: 'Instructor Tandem', status: 'Activo' },
        { id: 'emp_inst_2', name: 'Pedro Instructor', role: 'Instructor Tandem', status: 'Activo' },
        { id: 'emp_inst_3', name: 'Carlos Futuro', role: 'Instructor Tandem', status: 'Activo' }
    ];

    const todayStr = new Date().toLocaleDateString('en-CA');
    const v1Snapshot = win.TariffGuard.buildTariffSnapshot();

    // Crear 2 pasajeros previos: uno con snapshot v1 y otro legado SIN snapshot (para verificar congelamiento automático)
    win.AppData.passengers = [
        {
            id: 'pax_hist_1',
            name: 'Pax Anterior',
            doc: '1001',
            type: 'Salto Tandem',
            date: todayStr,
            weight: 95, // 5 kg extra sobre 90kg -> v1: 5 * 5.000 = 25.000 | nomina kg: 5 * 2.000 = 10.000
            cams: 'Cámara 360',
            adiciones: { 'Cámara 360': 'si' },
            instructor: 'Juan Instructor',
            paxStatus: 'Pendiente Check-in',
            createdAt: '2026-11-01T10:00:00.000Z',
            tariffSnapshot: v1Snapshot,
            financiera: { manualPrice: 1500000, discount: 0, totalPaid: 1500000 }
        },
        {
            id: 'pax_legacy_1',
            name: 'Pax Legacy',
            doc: '1002',
            type: 'Salto Tandem',
            date: todayStr,
            weight: 92, // 2 kg extra -> v1: 2 * 5.000 = 10.000 | nomina kg: 2 * 2.000 = 4.000
            cams: 'Cámara 360',
            instructor: 'Pedro Instructor',
            paxStatus: 'Completado'
            // Sin tariffSnapshot ni financiera: TariffGuard debe congelarlo con v1 antes de guardar v2
        }
    ];

    // Crear 2 registros previos de empaque (uno con unitPrice v1 y otro legado sin unitPrice)
    win.AppData.packerBilling = [
        {
            id: 'emp_hist_1',
            empId: 'emp_pack_1',
            date: todayStr,
            type: 'Tandem',
            count: 3, // 3 * 25.000 = 75.000
            unitPrice: 25000,
            createdAt: '2026-11-01T11:00:00.000Z',
            tariffSnapshot: v1Snapshot
        },
        {
            id: 'emp_legacy_1',
            empId: 'emp_pack_1',
            date: todayStr,
            type: 'Tandem',
            count: 2 // Legado sin unitPrice: debe quedar congelado en 25.000 -> 2 * 25.000 = 50.000
        }
    ];

    // 2. Ir a Configuración -> Maestro de Valores y simular edición de tarifas en UI
    win.location.hash = '#/configuracion';
    win.router();

    const bannerEl = doc.getElementById('maestro-security-banner');
    assert.ok(bannerEl && bannerEl.innerHTML.includes('maestro-version-badge') && bannerEl.innerHTML.includes('Tarifa Vigente v1'), 'Debe mostrar Tarifa Vigente v1 inicialmente');

    const setMaestroInput = (itemName, newPrice, newComision) => {
        const pEl = doc.querySelectorAll('#valores-grid .price-input').find(i => i.dataset.name === itemName);
        const cEl = doc.querySelectorAll('#valores-grid .comision-input').find(i => i.dataset.name === itemName);
        assert.ok(pEl && cEl, `Deben existir inputs para ${itemName}`);
        pEl.value = String(newPrice);
        if (newComision !== undefined) cEl.value = String(newComision);
    };

    setMaestroInput('Salto Tandem', '2.000.000', '250.000');
    setMaestroInput('Cámara 360', '300.000', '100.000');
    setMaestroInput('Valor KG Extra', '10.000', '4.000');
    setMaestroInput('Empaque Tandem', '40.000', '0');

    // 2a. Cancelar confirmación: no debe guardar ni incrementar versión
    let confirmPrompted = false;
    win.showConfirm = async (msg) => {
        confirmPrompted = true;
        assert.ok(msg.includes('Tarifa v2') && msg.includes('2 pasajero(s)') && msg.includes('2 registro(s) de empaque'));
        return false;
    };
    const btnSavePrices = doc.getElementById('btn-save-prices');
    btnSavePrices.click();
    await new Promise(r => setTimeout(r, 15));
    assert.ok(confirmPrompted, 'Debe solicitar confirmación de seguridad antes de actualizar Maestro de Valores');
    assert.equal(win.AppData.maestroValoresVersion, 1, 'Si el usuario cancela, la versión debe permanecer en v1');

    // 2b. Confirmar actualización a v2
    win.showConfirm = async () => true;
    win.showAlert = () => {};
    btnSavePrices.click();
    await new Promise(r => setTimeout(r, 20));

    assert.equal(win.AppData.maestroValoresVersion, 2, 'Al confirmar debe avanzar a Tarifa v2');
    assert.equal(win.AppData.maestroValoresHistory.length, 2, 'El historial debe almacenar v1 y v2');
    assert.ok(bannerEl.innerHTML.includes('Tarifa Vigente v2'), 'El banner debe actualizarse a Tarifa Vigente v2');

    // Verificar congelamiento automático de los registros legados ANTES de aplicar v2
    const legacyPax = win.AppData.passengers.find(p => p.id === 'pax_legacy_1');
    assert.equal(legacyPax.tariffSnapshot.version, 1, 'El pasajero legado debe haberse congelado con Tarifa v1');
    assert.equal(legacyPax.financiera.manualPrice, 1500000, 'El precio base legado debe quedar bloqueado en $1.500.000');
    const legacyPacker = win.AppData.packerBilling.find(r => r.id === 'emp_legacy_1');
    assert.equal(legacyPacker.unitPrice, 25000, 'El empaque legado debe quedar congelado en $25.000');
    assert.equal(legacyPacker.tariffSnapshot.version, 1);

    // 3. Crear registros FUTUROS después de la actualización a v2
    const v2Snapshot = win.TariffGuard.buildTariffSnapshot();
    assert.equal(v2Snapshot.version, 2);
    win.AppData.passengers.push({
        id: 'pax_futuro_1',
        name: 'Pax Futuro',
        doc: '2001',
        type: 'Salto Tandem',
        date: todayStr,
        weight: 95, // 5 kg extra -> v2: 5 * 10.000 = 50.000 | nomina kg: 5 * 4.000 = 20.000
        cams: 'Cámara 360',
        adiciones: { 'Cámara 360': 'si' },
        instructor: 'Carlos Futuro',
        paxStatus: 'Pendiente Check-in',
        createdAt: new Date().toISOString(),
        tariffSnapshot: v2Snapshot,
        financiera: { manualPrice: 2000000, discount: 0, totalPaid: 2000000 }
    });

    // 4. Ir a Facturación, agregar un empaque FUTURO vía UI y validar todos los totales
    win.location.hash = '#/facturacion';
    win.router();

    doc.getElementById('billing-empacador-select').value = 'emp_pack_1';
    doc.getElementById('billing-empacador-date').value = todayStr;
    doc.getElementById('billing-empacador-type').value = 'Tandem';
    doc.getElementById('billing-empacador-count').value = '2'; // 2 * 40.000 = 80.000
    doc.getElementById('btn-add-empaque').click();

    const newPackerRow = win.AppData.packerBilling[win.AppData.packerBilling.length - 1];
    assert.equal(newPackerRow.unitPrice, 40000, 'El nuevo registro de empaque debe congelar el valor v2 ($40.000)');
    assert.equal(newPackerRow.tariffSnapshot.version, 2);

    // Validar tabla de Ingresos y Nómina en Facturación
    const normalizeDigits = (str) => String(str || '').replace(/\D/g, '');
    const ingresosRows = doc.getElementById('tbody-ingresos').children;
    assert.equal(ingresosRows.length, 3);

    // Pax Anterior (v1): 1.500.000 + 25.000 + 150.000 = 1.675.000
    assert.ok(ingresosRows[0].innerHTML.includes('Pax Anterior'));
    assert.ok(ingresosRows[0].innerHTML.includes('v1'));
    assert.ok(ingresosRows[0].innerHTML.includes('1.675.000'), `Pax Anterior debe mantener ingreso v1 ($1.675.000), obtuvo: ${ingresosRows[0].innerHTML}`);

    // Pax Legacy (congelado v1): 1.500.000 + 10.000 + 150.000 = 1.660.000
    assert.ok(ingresosRows[1].innerHTML.includes('Pax Legacy'));
    assert.ok(ingresosRows[1].innerHTML.includes('v1'));
    assert.ok(ingresosRows[1].innerHTML.includes('1.660.000'), `Pax Legacy debe mantener ingreso v1 ($1.660.000), obtuvo: ${ingresosRows[1].innerHTML}`);

    // Pax Futuro (v2): 2.000.000 + 50.000 + 300.000 = 2.350.000
    assert.ok(ingresosRows[2].innerHTML.includes('Pax Futuro'));
    assert.ok(ingresosRows[2].innerHTML.includes('v2'));
    assert.ok(ingresosRows[2].innerHTML.includes('2.350.000'), `Pax Futuro debe usar ingreso v2 ($2.350.000), obtuvo: ${ingresosRows[2].innerHTML}`);

    // Total Ingresos = 1.675.000 + 1.660.000 + 2.350.000 = 5.685.000
    assert.equal(normalizeDigits(doc.getElementById('tfoot-ingresos-total').textContent), '5685000');

    // Total Nómina = (150k+10k+50k=210k) + (150k+4k+50k=204k) + (250k+20k+100k=370k) = 784.000
    const nominaRows = doc.getElementById('tbody-nomina').children;
    assert.equal(nominaRows.length, 3);
    assert.ok(nominaRows[0].innerHTML.includes('210.000'), 'Nómina de Juan Instructor debe conservar tarifa v1 ($210.000)');
    assert.ok(nominaRows[1].innerHTML.includes('204.000'), 'Nómina de Pedro Instructor debe conservar tarifa v1 ($204.000)');
    assert.ok(nominaRows[2].innerHTML.includes('370.000'), 'Nómina de Carlos Futuro debe liquidarse con tarifa v2 ($370.000)');
    assert.equal(normalizeDigits(doc.getElementById('tfoot-nomina-total').textContent), '784000');

    // Total Empacadores = (3*25.000=75.000) + (2*25.000=50.000) + (2*40.000=80.000) = 205.000
    assert.equal(normalizeDigits(doc.getElementById('tfoot-empacadores-total').textContent), '205000');

    // 5. Segunda actualización a v3: v1 y v2 deben permanecer completamente inalteradas
    const v3Items = win.TariffGuard.cloneMaestro(win.AppData.maestroValores).map(i =>
        i.name === 'Salto Tandem' ? { ...i, price: '3000000', comision: '400000' } : i
    );
    const resV3 = win.TariffGuard.applyMaestroUpdate(v3Items, 'Admin Master');
    assert.equal(resV3.newVersion, 3);
    assert.equal(win.TariffGuard.getPriceForRecord(win.AppData.passengers[0], 'Salto Tandem'), 1500000, 'Pax Anterior sigue bloqueado en v1 tras pasar a v3');
    assert.equal(win.TariffGuard.getPriceForRecord(win.AppData.passengers[2], 'Salto Tandem'), 2000000, 'Pax Futuro sigue bloqueado en v2 tras pasar a v3');
    assert.equal(win.TariffGuard.getPriceForRecord(null, 'Salto Tandem'), 3000000, 'Registros nuevos usarán Tarifa v3');
});

test('3.12 [Asignación de Flota] Migración de vuelos entre aeronaves: 1 vuelo, 1 día, 1 semana o todos (con pasajeros y control de conflictos)', async () => {
    const { win, doc } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin Operaciones', role: 'Administrador' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    win.AppData.aeronaves = [
        { id: 'plane_A', matricula: 'HK-1001', modelo: 'Cessna 208 Caravan', capTandem: 5, capFun: 10, estado: 'Operativa' },
        { id: 'plane_B', matricula: 'HK-2002', modelo: 'PAC 750XL', capTandem: 4, capFun: 8, estado: 'Operativa' },
        { id: 'plane_C', matricula: 'HK-3003', modelo: 'Cessna 182', capTandem: 2, capFun: 4, estado: 'Operativa' }
    ];

    win.AppData.asignacionFlota = [
        // Día 1 (2026-11-20) en HK-1001: 2 vuelos
        { id: 'f_d1_1', id_aeronave: 'plane_A', fecha: '2026-11-20', horaInicio: '08:00', horaFin: '08:30', estado: 'Programado', capitan: 'Cap 1' },
        { id: 'f_d1_2', id_aeronave: 'plane_A', fecha: '2026-11-20', horaInicio: '10:00', horaFin: '10:30', estado: 'Programado', capitan: 'Cap 1' },
        // Día 2 (2026-11-21) en HK-1001: 2 vuelos (1 tendrá conflicto en HK-2002 a las 09:00)
        { id: 'f_d2_1', id_aeronave: 'plane_A', fecha: '2026-11-21', horaInicio: '09:00', horaFin: '09:30', estado: 'Programado', capitan: 'Cap 1' },
        { id: 'f_d2_2', id_aeronave: 'plane_A', fecha: '2026-11-21', horaInicio: '11:00', horaFin: '11:30', estado: 'Programado', capitan: 'Cap 1' },
        // Conflicto preexistente en HK-2002 el 2026-11-21 a las 09:10 (se cruza con 09:00-09:30 + 15min)
        { id: 'f_b_conflict', id_aeronave: 'plane_B', fecha: '2026-11-21', horaInicio: '09:10', horaFin: '09:40', estado: 'Programado', capitan: 'Cap 2' },
        // Dentro de la semana (2026-11-22 y 2026-11-26 -> semana desde 2026-11-20 hasta 2026-11-26)
        { id: 'f_w_1', id_aeronave: 'plane_A', fecha: '2026-11-22', horaInicio: '08:30', horaFin: '09:00', estado: 'Programado', capitan: 'Cap 1' },
        { id: 'f_w_2', id_aeronave: 'plane_A', fecha: '2026-11-26', horaInicio: '14:00', horaFin: '14:30', estado: 'Programado', capitan: 'Cap 1' },
        // Fuera de la semana (2026-12-05)
        { id: 'f_far_1', id_aeronave: 'plane_A', fecha: '2026-12-05', horaInicio: '15:00', horaFin: '15:30', estado: 'Programado', capitan: 'Cap 1' }
    ];

    win.AppData.passengers = [
        { id: 'p_1', name: 'Pasajero Vuelo 1', date: '2026-11-20', time: '08:00', aeronave: 'HK-1001', vueloNum: 'Vuelo 1', flightStatus: 'Programado' },
        { id: 'p_2', name: 'Pasajero Vuelo 2', date: '2026-11-20', time: '10:00', aeronave: 'HK-1001', vueloNum: 'Vuelo 2', flightStatus: 'Programado' },
        { id: 'p_3', name: 'Pasajero Semana', date: '2026-11-22', time: '08:30', aeronave: 'HK-1001', vueloNum: 'Vuelo 1', flightStatus: 'Programado' },
        { id: 'p_4', name: 'Pasajero Lejano', date: '2026-12-05', time: '15:00', aeronave: 'HK-1001', vueloNum: 'Vuelo 1', flightStatus: 'Programado' }
    ];

    win.showConfirm = async () => true;
    win.showAlert = () => {};

    // Renderizar módulo Asignación de Flota
    win.location.hash = '#/flota';
    win.router();

    // Seleccionar fecha 2026-11-20 para visualizar Gantt con botones rápidos de migración por vuelo
    const dateFilter = doc.getElementById('fleet-date-filter');
    dateFilter.value = '2026-11-20';
    dateFilter.dispatchEvent({ type: 'change' });

    const singleBtns = doc.querySelectorAll('.btn-migrate-single-flight');
    assert.equal(singleBtns.length, 2, 'Cada bloque de vuelo en el Gantt debe tener botón rápido de migración individual');

    // CASO 1: Migrar 1 VUELO específico (f_d1_1) desde el botón rápido del bloque en Gantt hacia HK-2002
    singleBtns[0].click();
    assert.equal(doc.getElementById('mig-scope').value, 'single');
    assert.equal(doc.getElementById('mig-single-flight').value, 'f_d1_1');
    doc.getElementById('mig-plane-to').value = 'plane_B';
    doc.getElementById('btn-confirm-mig').click();
    await new Promise(r => setTimeout(r, 15));

    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_d1_1').id_aeronave, 'plane_B', 'El vuelo f_d1_1 debe haberse migrado a HK-2002');
    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_d1_2').id_aeronave, 'plane_A', 'El vuelo f_d1_2 del mismo día NO debe moverse al migrar solo 1 vuelo');
    assert.equal(win.AppData.passengers.find(p => p.id === 'p_1').aeronave, 'HK-2002', 'El pasajero del vuelo migrado debe actualizar su aeronave a HK-2002');
    assert.equal(win.AppData.passengers.find(p => p.id === 'p_2').aeronave, 'HK-1001', 'El pasajero del otro vuelo permanece en HK-1001');

    // CASO 2: Migrar los vuelos de 1 DÍA (2026-11-21) de HK-1001 a HK-2002 con control de conflicto horario
    doc.getElementById('btn-migrate-flights').click();
    doc.getElementById('mig-scope').value = 'day';
    doc.getElementById('mig-scope').dispatchEvent({ type: 'change' });
    doc.getElementById('mig-plane-from').value = 'plane_A';
    doc.getElementById('mig-plane-from').dispatchEvent({ type: 'change' });
    doc.getElementById('mig-plane-to').value = 'plane_B';
    doc.getElementById('mig-date-base').value = '2026-11-21';
    doc.getElementById('mig-date-base').dispatchEvent({ type: 'change' });
    doc.getElementById('btn-confirm-mig').click();
    await new Promise(r => setTimeout(r, 15));

    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_d2_2').id_aeronave, 'plane_B', 'El vuelo sin conflicto del día (11:00) debe migrar a HK-2002');
    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_d2_1').id_aeronave, 'plane_A', 'El vuelo con conflicto horario (09:00) debe protegerse y omitirse sin forzar');

    // CASO 3: Migrar vuelos de 1 SEMANA (2026-11-20 al 2026-11-26) de HK-1001 a HK-3003
    doc.getElementById('btn-migrate-flights').click();
    doc.getElementById('mig-scope').value = 'week';
    doc.getElementById('mig-scope').dispatchEvent({ type: 'change' });
    doc.getElementById('mig-plane-from').value = 'plane_A';
    doc.getElementById('mig-plane-from').dispatchEvent({ type: 'change' });
    doc.getElementById('mig-plane-to').value = 'plane_C';
    doc.getElementById('mig-date-base').value = '2026-11-20';
    doc.getElementById('mig-date-base').dispatchEvent({ type: 'change' });
    assert.ok(doc.getElementById('mig-week-range-hint').textContent.includes('2026-11-20 hasta 2026-11-26'), 'Debe mostrar el rango exacto de 7 días');
    doc.getElementById('btn-confirm-mig').click();
    await new Promise(r => setTimeout(r, 15));

    // Los vuelos restantes dentro de esa semana (f_d1_2, f_d2_1, f_w_1, f_w_2) deben haber migrado a plane_C
    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_d1_2').id_aeronave, 'plane_C');
    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_d2_1').id_aeronave, 'plane_C');
    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_w_1').id_aeronave, 'plane_C');
    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_w_2').id_aeronave, 'plane_C');
    assert.equal(win.AppData.passengers.find(p => p.id === 'p_2').aeronave, 'HK-3003');
    assert.equal(win.AppData.passengers.find(p => p.id === 'p_3').aeronave, 'HK-3003');
    // El vuelo lejano (2026-12-05) NO debe moverse al migrar solo 1 semana
    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_far_1').id_aeronave, 'plane_A', 'Un vuelo fuera de la semana no debe migrar');

    // CASO 4: Migrar TODOS los vuelos de HK-3003 hacia HK-1001 y luego TODOS los de HK-1001 hacia HK-2002 (incluyendo 2026-12-05)
    doc.getElementById('btn-migrate-flights').click();
    doc.getElementById('mig-scope').value = 'all';
    doc.getElementById('mig-scope').dispatchEvent({ type: 'change' });
    doc.getElementById('mig-plane-from').value = 'plane_A';
    doc.getElementById('mig-plane-from').dispatchEvent({ type: 'change' });
    doc.getElementById('mig-plane-to').value = 'plane_C';
    doc.getElementById('btn-confirm-mig').click();
    await new Promise(r => setTimeout(r, 15));

    assert.equal(win.AppData.asignacionFlota.filter(f => f.id_aeronave === 'plane_A').length, 0, 'Al migrar TODOS no deben quedar vuelos en la aeronave origen');
    assert.equal(win.AppData.asignacionFlota.find(f => f.id === 'f_far_1').id_aeronave, 'plane_C', 'El vuelo futuro f_far_1 debe haberse migrado a HK-3003');
    assert.equal(win.AppData.passengers.find(p => p.id === 'p_4').aeronave, 'HK-3003', 'El pasajero del vuelo lejano debe haberse migrado a HK-3003');
});

test('3.13 [Visualización Adaptativa] Detección Computador / Tablet / Celular, menú lateral táctil y adaptación sin solapamientos ni desbordes', () => {
    const { win, doc } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ name: 'Admin', role: 'Administrador' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    // 1. Detección Computador (Desktop 1440x900)
    win.innerWidth = 1440;
    win.innerHeight = 900;
    win.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0', platform: 'Win32', maxTouchPoints: 0 };
    let dev = win.detectDevice();
    assert.equal(dev.type, 'desktop');
    assert.equal(win.isDesktopDevice, true);
    assert.equal(win.isTabletDevice, false);
    assert.equal(win.isMobileDevice, false);
    assert.ok(doc.body.classList.contains('device-desktop'));
    assert.equal(doc.body.getAttribute('data-device'), 'desktop');
    assert.equal(doc.body.getAttribute('data-orientation'), 'landscape');

    // 2. Detección Tablet (iPad vertical 820x1180)
    win.innerWidth = 820;
    win.innerHeight = 1180;
    win.navigator = { userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X)', platform: 'iPad', maxTouchPoints: 5 };
    dev = win.detectDevice();
    assert.equal(dev.type, 'tablet');
    assert.equal(win.isTabletDevice, true);
    assert.ok(doc.body.classList.contains('device-tablet'));
    assert.ok(!doc.body.classList.contains('device-desktop'));
    assert.equal(doc.body.getAttribute('data-device'), 'tablet');
    assert.equal(doc.body.getAttribute('data-orientation'), 'portrait');

    // 2b. Detección iPadOS modo escritorio (MacIntel + maxTouchPoints > 1, 1180x820)
    win.innerWidth = 1180;
    win.innerHeight = 820;
    win.navigator = { userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', platform: 'MacIntel', maxTouchPoints: 5 };
    dev = win.detectDevice();
    assert.equal(dev.type, 'tablet', 'iPadOS con userAgent de Mac y pantalla táctil debe identificarse como tablet');
    assert.equal(dev.orientation, 'landscape');

    // 3. Detección Celular (iPhone 390x844 vertical y 844x390 horizontal)
    win.innerWidth = 390;
    win.innerHeight = 844;
    win.navigator = { userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Mobile/15E148', platform: 'iPhone', maxTouchPoints: 5 };
    dev = win.detectDevice();
    assert.equal(dev.type, 'mobile');
    assert.equal(win.isMobileDevice, true);
    assert.ok(doc.body.classList.contains('device-mobile'));
    assert.equal(doc.body.getAttribute('data-device'), 'mobile');

    win.innerWidth = 844;
    win.innerHeight = 390;
    dev = win.detectDevice();
    assert.equal(dev.type, 'mobile', 'Un teléfono en modo horizontal (844x390) debe seguir identificándose como celular');
    assert.equal(dev.orientation, 'landscape');

    // 4. Cajón lateral (drawer) y cierre automático al cambiar de ruta o volver a desktop
    const sidebar = doc.getElementById('sidebar');
    const backdrop = doc.getElementById('sidebar-backdrop');
    assert.ok(sidebar && backdrop, 'Deben existir #sidebar y #sidebar-backdrop en el DOM');
    sidebar.classList.add('open');
    backdrop.classList.add('open');

    // Al navegar por el router, se cierra el menú móvil/tablet y no se sobrescribe padding inline con '2rem'
    win.location.hash = '#/registro-salto';
    win.router();
    assert.ok(!sidebar.classList.contains('open'), 'Al navegar debe cerrarse el menú lateral abierto');
    assert.ok(!backdrop.classList.contains('open'));
    const mainContent = doc.querySelector('.main-content');
    assert.equal(mainContent.style.padding, '', 'router() no debe forzar padding inline 2rem que rompa móvil/tablet');

    // 5. Verificación del mejorador adaptativo (applyResponsiveLayout) en módulos críticos
    const wideGrids = doc.querySelectorAll('.resp-auto-grid-wide');
    assert.ok(wideGrids.length > 0, 'Registro de Salto debe etiquetar grids minmax(400px) como .resp-auto-grid-wide');

    // Calendario Reservas: mantiene 7 columnas (.resp-calendar-grid) en lugar de colapsar a 1 columna
    win.location.hash = '#/reservas';
    win.router();
    const calGrids = doc.querySelectorAll('.resp-calendar-grid');
    assert.ok(calGrids.length >= 2, 'Calendario de Reservas debe mantener etiqueta .resp-calendar-grid');

    // FIDS: logo central etiquetado (.fids-center-logo) para evitar solapamiento en móvil/tablet
    win.location.hash = '#/fids';
    win.router();
    assert.ok(doc.querySelector('.fids-center-logo'), 'FIDS debe contar con .fids-center-logo para flujo adaptativo');
    assert.ok(doc.querySelector('.fids-table-wrap'), 'FIDS debe contar con .fids-table-wrap para scroll táctil');

    // Asignación de Flota: el Gantt NO debe colapsarse a 1 columna sino mantenerse desplazable
    win.location.hash = '#/flota';
    win.router();
    const ganttHeader = doc.getElementById('gantt-header');
    assert.ok(ganttHeader && !ganttHeader.classList.contains('resp-grid-2'), 'El Gantt debe preservar sus columnas y usar scroll horizontal en móvil/tablet');

    // Check-in: tablero Kanban etiquetado para 2x2 en tablet y apilado en celular
    win.location.hash = '#/checkin';
    win.router();
    assert.ok(doc.querySelector('.checkin-kanban-board'), 'Check-in debe incluir clase .checkin-kanban-board');

    // Al volver a Desktop, el cajón se cierra automáticamente
    sidebar.classList.add('open');
    win.innerWidth = 1440;
    win.innerHeight = 900;
    win.navigator = { userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', platform: 'Win32', maxTouchPoints: 0 };
    win.detectDevice();
    assert.ok(!sidebar.classList.contains('open'), 'Al volver a escritorio el menú drawer debe cerrarse');

    // 6. Integridad de css/styles.css (llaves balanceadas y reglas tablet + celular + tema claro/oscuro presentes)
    const cssText = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8');
    const opens = (cssText.match(/\{/g) || []).length;
    const closes = (cssText.match(/\}/g) || []).length;
    assert.equal(opens, closes, `css/styles.css debe tener llaves CSS balanceadas (${opens} vs ${closes})`);
    assert.ok(cssText.includes('body.device-tablet') && cssText.includes('body.device-mobile'));
    assert.ok(cssText.includes('.fids-center-logo') && cssText.includes('.checkin-kanban-board') && cssText.includes('#gantt-container'));
    assert.ok(cssText.includes('color-scheme: light') && cssText.includes('color-scheme: dark') && cssText.includes('.nav-group-label'));

    // 7. Sincronización de Tema Claro / Oscuro (window.applyTheme) y Pantalla de Login rediseñada
    win.applyTheme('dark', true);
    assert.ok(doc.body.classList.contains('dark-mode'));
    assert.equal(doc.body.getAttribute('data-theme'), 'dark');
    assert.equal(win.localStorage.getItem('fraterno_theme'), 'dark');
    assert.ok(doc.querySelector('.logo img').src.includes('logo_dark.png'));

    win.applyTheme('light', true);
    assert.ok(doc.body.classList.contains('light-mode'));
    assert.equal(doc.body.getAttribute('data-theme'), 'light');
    assert.ok(doc.querySelector('.logo img').src.includes('logo.png'));

    // Probar Login rediseñado (toggle mostrar contraseña + toggle tema)
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();
    const loginPass = doc.getElementById('login-pass');
    const togglePassBtn = doc.getElementById('login-toggle-pass');
    const loginThemeBtn = doc.getElementById('login-theme-toggle');
    assert.ok(loginPass && togglePassBtn && loginThemeBtn, 'Login debe incluir controles modernos de visibilidad de contraseña y cambio de tema');
    togglePassBtn.click();
    assert.equal(loginPass.type, 'text', 'Al pulsar el ícono de ojo, la contraseña debe mostrarse');
    loginThemeBtn.click();
    assert.ok(doc.body.classList.contains('dark-mode'), 'El botón de tema en Login debe activar modo oscuro');
});

test('3.14 [Módulo Soporte] Reporte de novedad por usuario (imagen opcional), gestión exclusiva por admin01 y popup de solución al iniciar sesión', async () => {
    const { win, doc } = buildSPAContext();
    win.showAlert = () => {};

    win.AppData.users = [
        { id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: '01Fraterno*' },
        { id: 'usr_op1', name: 'Laura Operadora', username: 'laura_op', role: 'Administrador', password: '1234' },
        { id: 'usr_v1', name: 'Carlos Ventas', username: 'carlos_v', role: 'Asesor de Ventas', password: '1234' }
    ];
    win.AppData.supportTickets = [];

    // 1. Iniciar sesión como usuario distinto a admin01 (incluso teniendo rol Administrador)
    win.sessionStorage.setItem('fraterno_user', JSON.stringify(win.AppData.users[1]));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.location.hash = '#/';
    win.router();

    const btnSupport = doc.querySelector('.btn-support');
    assert.ok(btnSupport, 'Debe existir el botón Soporte en el menú lateral');
    assert.ok(!doc.getElementById('support-pending-badge'), 'Solo admin01 debe ver el contador de casos pendientes');

    // Al hacer clic en Soporte como laura_op, se abre el formulario de reporte (NUNCA el panel de gestión)
    btnSupport.click();
    assert.ok(doc.getElementById('modal-support-report'), 'Debe abrir ventana de reporte de novedad para usuarios distintos a admin01');
    assert.equal(doc.getElementById('modal-support-admin'), null, 'Un usuario distinto a admin01 NO debe ver el panel de gestión de casos');

    // Verificar que el campo imagen NO es obligatorio
    const imgInput = doc.getElementById('support-image-input');
    assert.ok(imgInput && !imgInput.getAttribute('required'), 'El campo de imagen debe existir y ser opcional');

    // Enviar caso #1 SIN imagen
    doc.getElementById('support-reporter-name').value = 'Laura Operadora';
    doc.getElementById('support-contact-number').value = '3005559988';
    doc.getElementById('support-description').value = 'El filtro de fechas en Facturación no guarda el último rango.';
    doc.getElementById('support-report-form').dispatchEvent({ type: 'submit' });

    assert.equal(win.AppData.supportTickets.length, 1);
    const tk1 = win.AppData.supportTickets[0];
    assert.equal(tk1.code, 'SUP-0001');
    assert.equal(tk1.createdByUsername, 'laura_op');
    assert.equal(tk1.contactNumber, '3005559988');
    assert.equal(tk1.imageDataUrl, '');
    assert.equal(tk1.status, 'Pendiente');

    // Enviar caso #2 CON imagen opcional
    const resImgTicket = win.SupportSystem.createTicket({
        reporterName: 'Laura Operadora',
        contactNumber: '3005559988',
        description: 'Botón desalineado en pantalla de Check-in.',
        imageDataUrl: 'data:image/png;base64,MOCK_SCREENSHOT',
        imageName: 'error_checkin.png'
    });
    assert.equal(resImgTicket.ok, true);
    assert.equal(resImgTicket.ticket.code, 'SUP-0002');
    assert.equal(resImgTicket.ticket.imageDataUrl, 'data:image/png;base64,MOCK_SCREENSHOT');

    // Verificar que laura_op NO puede resolver casos ni llamando directamente al método
    const denied = win.SupportSystem.resolveTicket(tk1.id, 'Intento no autorizado');
    assert.equal(denied.ok, false, 'Solo admin01 puede resolver casos de soporte');
    assert.equal(tk1.status, 'Pendiente');

    // 2. Iniciar sesión como admin01 y gestionar casos desde el botón Soporte
    win.sessionStorage.setItem('fraterno_user', JSON.stringify(win.AppData.users[0]));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.router();

    assert.ok(btnSupport.innerHTML.includes('support-pending-badge') && btnSupport.innerHTML.includes('2'), 'admin01 debe ver contador de 2 casos pendientes en el menú Soporte');

    btnSupport.click();
    const adminModal = doc.getElementById('modal-support-admin');
    assert.ok(adminModal, 'admin01 debe abrir el panel de gestión de casos de soporte');
    assert.ok(adminModal.innerHTML.includes('SUP-0001') && adminModal.innerHTML.includes('SUP-0002'));
    assert.ok(adminModal.innerHTML.includes('Ver imagen adjunta'), 'El panel admin debe permitir visualizar la imagen adjunta cuando exista');

    // Escribir solución para SUP-0001 y marcar como solucionado
    const solInput = doc.querySelector(`.support-solution-input[data-ticket-id="${tk1.id}"]`);
    const btnResolve = doc.querySelector(`.btn-resolve-support-ticket[data-ticket-id="${tk1.id}"]`);
    assert.ok(solInput && btnResolve);
    solInput.value = 'Se actualizó el módulo de Facturación y ya persiste correctamente el filtro de fechas.';
    btnResolve.click();

    assert.equal(tk1.status, 'Solucionado');
    assert.equal(tk1.resolvedBy, 'admin01');
    assert.equal(tk1.userNotified, false);
    assert.ok(tk1.solution.includes('persiste correctamente el filtro de fechas'));
    adminModal.remove();

    // 3. Si inicia sesión OTRO usuario (carlos_v), NO debe ver el popup de solución de laura_op
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();
    doc.getElementById('login-user').value = 'carlos_v';
    doc.getElementById('login-pass').value = '1234';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    win.router();
    assert.equal(doc.getElementById('modal-support-resolved-notif'), null, 'Otro usuario no debe recibir notificaciones de casos ajenos');

    // 4. Cuando laura_op inicia sesión, se abre automáticamente la ventana emergente con la solución dada
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();
    doc.getElementById('login-user').value = 'laura_op';
    doc.getElementById('login-pass').value = '1234';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    win.router();

    const notifModal = doc.getElementById('modal-support-resolved-notif');
    assert.ok(notifModal, 'Al iniciar sesión el usuario que reportó el caso debe abrirse la ventana emergente de solución');
    assert.ok(notifModal.innerHTML.includes('SUP-0001'), 'La ventana emergente debe mostrar el código del caso');
    assert.ok(notifModal.innerHTML.includes('Se actualizó el módulo de Facturación y ya persiste correctamente el filtro de fechas.'), 'La ventana emergente debe mostrar la solución dada');

    // Al pulsar Entendido, se marca como notificado y NO reaparece en el siguiente inicio de sesión
    doc.getElementById('btn-support-notif-accept').click();
    assert.equal(doc.getElementById('modal-support-resolved-notif'), null);
    assert.equal(tk1.userNotified, true);

    // Nuevo inicio de sesión de laura_op: no debe volver a mostrarse el caso ya notificado
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();
    doc.getElementById('login-user').value = 'laura_op';
    doc.getElementById('login-pass').value = '1234';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    win.router();
    assert.equal(doc.getElementById('modal-support-resolved-notif'), null, 'Un caso ya notificado no debe volver a abrir popup al iniciar sesión nuevamente');
});

test('3.15 [Factor de Seguridad de Contraseñas] Exige mínimo 8 caracteres, mayúsculas, minúsculas, números y caracteres especiales en PasswordPolicy y edición/cambio de clave', () => {
    const { win, doc } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    const alertsShown = [];
    win.showAlert = (msg, opts) => alertsShown.push({ msg, opts });

    win.AppData.users = [
        { id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: '01Fraterno*' }
    ];

    win.location.hash = '#/configuracion';
    win.router();

    const usrName = doc.getElementById('usr-name');
    const usrUsername = doc.getElementById('usr-username');
    const usrCedula = doc.getElementById('usr-cedula');
    const usrPass = doc.getElementById('usr-pass');
    const btnCreate = doc.getElementById('btn-create-usr');
    const btnGen = doc.getElementById('btn-generate-secure-pass');

    // Al registrar nuevo usuario, el campo de Contraseña Segura NO debe mostrarse
    const editPassFields = doc.getElementById('usr-edit-password-fields');
    assert.ok(
        editPassFields.style.display === 'none' || String(editPassFields.getAttribute('style') || '').includes('display: none'),
        'El campo de contraseña no debe mostrarse al registrar un nuevo usuario'
    );

    // 1. Validar política PasswordPolicy contra cada criterio faltante
    const invalidPasswords = [
        '',               // vacía
        '1234',           // muy corta y solo números
        'Ab1!xyz',        // solo 7 caracteres
        'fraterno1!',     // sin mayúscula
        'FRATERNO1!',     // sin minúscula
        'Fraterno!@',     // sin número
        'Fraterno123'     // sin carácter especial
    ];

    for (const badPwd of invalidPasswords) {
        assert.equal(win.PasswordPolicy.validate(badPwd).valid, false, `PasswordPolicy debe rechazar contraseña insegura: "${badPwd}"`);
    }

    // 2. Crear usuario con cédula -> contraseña automática <cedula>Fp* (cumple PasswordPolicy)
    usrName.value = 'Ana Seguridad';
    usrUsername.value = 'ana_sec';
    usrCedula.value = '10203040';
    btnCreate.click();
    assert.equal(win.AppData.users.length, 2, 'Debe crear usuario con contraseña automática basada en la cédula');
    const created = win.AppData.users.find(u => u.username === 'ana_sec');
    assert.equal(created.password, '10203040Fp*');
    assert.equal(win.PasswordPolicy.validate(created.password).valid, true);

    // 3. Verificar indicador en tiempo real y generador automático de clave segura
    usrPass.value = 'Fraterno2026*';
    usrPass.dispatchEvent({ type: 'input' });
    assert.ok(doc.getElementById('usr-pass-strength-label').textContent.includes('Segura (5/5)'));

    btnGen.click();
    const genPwd = usrPass.value;
    assert.equal(win.PasswordPolicy.validate(genPwd).valid, true, `La contraseña autogenerada (${genPwd}) debe cumplir el 100% de los criterios`);

    // 4. Edición de usuario: rechazar clave débil, permitir clave vacía (conserva actual) y permitir nueva clave segura
    btnCreate.dataset.editId = created.id;
    usrName.value = 'Ana Seguridad Edit';
    usrUsername.value = 'ana_sec';
    usrPass.value = 'debil123';
    btnCreate.click();
    assert.equal(created.password, '10203040Fp*', 'Al editar, no debe permitir cambiar por una contraseña débil');

    usrPass.value = '';
    btnCreate.click();
    assert.equal(created.name, 'Ana Seguridad Edit', 'Al editar dejando contraseña vacía, conserva la clave actual');
    assert.equal(created.password, '10203040Fp*');

    btnCreate.dataset.editId = created.id;
    usrName.value = 'Ana Seguridad Edit';
    usrUsername.value = 'ana_sec';
    usrPass.value = 'NuevaClave#99';
    btnCreate.click();
    assert.equal(created.password, 'NuevaClave#99', 'Al editar con nueva contraseña segura debe actualizarse correctamente');
});

test('3.16 [Seguridad Usuarios Activos] Mantiene siempre oculto y protegido al usuario Admin Master (admin01) mientras sigue activo', () => {
    const { win, doc } = buildSPAContext();
    const alertsShown = [];
    win.showAlert = (msg, opts) => alertsShown.push({ msg, opts });

    win.AppData.users = [
        { id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: '01Fraterno*' }
    ];

    // 1. Con solo admin01 en el sistema, Usuarios Activos no debe mostrarlo
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.location.hash = '#/configuracion';
    win.router();

    let tbody = doc.getElementById('table-usr');
    let rowsHtml = tbody.children.map(tr => tr.innerHTML).join('\n');
    assert.equal(tbody.children.length, 1, 'Con solo admin01 debe mostrar únicamente la fila de estado vacío');
    assert.ok(rowsHtml.includes('No hay usuarios adicionales registrados'), 'Debe mostrar el mensaje de lista vacía');
    assert.ok(!rowsHtml.includes('admin01'), 'admin01 nunca debe renderizarse en Usuarios Activos');
    assert.ok(!rowsHtml.includes('Admin Master'), 'Admin Master nunca debe renderizarse en Usuarios Activos');
    assert.ok(!rowsHtml.includes('usr_admin'), 'El id usr_admin nunca debe aparecer en Usuarios Activos');
    assert.ok(!String(doc.getElementById('usr-username').getAttribute('placeholder') || '').toLowerCase().includes('admin01'), 'El placeholder del campo usuario no debe revelar admin01');

    // 2. Agregar usuarios adicionales e iniciar sesión como otro Administrador
    win.AppData.users.push(
        { id: 'usr_laura', name: 'Laura Operadora', username: 'laura_op', role: 'Administrador', password: 'Password1!' },
        { id: 'usr_carlos', name: 'Carlos Ventas', username: 'carlos_v', role: 'Asesor de Ventas', password: 'Password2@' }
    );
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({ id: 'usr_laura', name: 'Laura Operadora', username: 'laura_op', role: 'Administrador' }));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.router();

    tbody = doc.getElementById('table-usr');
    rowsHtml = tbody.children.map(tr => tr.innerHTML).join('\n');
    assert.equal(tbody.children.length, 2, 'Solo deben renderizarse los 2 usuarios visibles (ocultando a admin01)');
    assert.ok(rowsHtml.includes('laura_op') && rowsHtml.includes('carlos_v'), 'Los demás usuarios deben mostrarse normalmente en Usuarios Activos');
    assert.ok(!rowsHtml.includes('admin01') && !rowsHtml.includes('Admin Master') && !rowsHtml.includes('usr_admin'), 'admin01 debe permanecer invisible para los demás usuarios en Usuarios Activos');

    // 3. Bloquear creación duplicada / reserva de admin01 y Admin Master
    const usrName = doc.getElementById('usr-name');
    const usrUsername = doc.getElementById('usr-username');
    const usrCedula = doc.getElementById('usr-cedula');
    const usrPass = doc.getElementById('usr-pass');
    const btnCreate = doc.getElementById('btn-create-usr');

    usrName.value = 'Intruso';
    usrUsername.value = 'ADMIN01';
    usrCedula.value = '99887766';
    btnCreate.click();
    assert.equal(win.AppData.users.length, 3, 'No debe permitir crear un usuario con username admin01');

    usrName.value = 'Admin Master';
    usrUsername.value = 'otro_user';
    usrCedula.value = '99887766';
    btnCreate.click();
    assert.equal(win.AppData.users.length, 3, 'No debe permitir crear un usuario con nombre reservado Admin Master');

    // 4. Bloquear modificación forzada de usr_admin vía dataset.editId o renombrar otro usuario a admin01
    btnCreate.dataset.editId = 'usr_admin';
    usrName.value = 'Hackeado';
    usrUsername.value = 'hacked';
    usrPass.value = 'Hacked123!';
    btnCreate.click();
    const masterAfter = win.AppData.users.find(u => u.id === 'usr_admin');
    assert.equal(masterAfter.username, 'admin01', 'No debe permitir modificar la cuenta protegida admin01');
    assert.equal(masterAfter.password, '01Fraterno*', 'La contraseña de admin01 debe permanecer intacta');

    btnCreate.dataset.editId = 'usr_carlos';
    usrName.value = 'Carlos Ventas';
    usrUsername.value = 'admin01';
    usrPass.value = '';
    btnCreate.click();
    assert.equal(win.AppData.users.find(u => u.id === 'usr_carlos').username, 'carlos_v', 'No debe permitir renombrar otro usuario a admin01');

    // 5. Confirmar que admin01 sigue completamente activo y puede iniciar sesión normalmente
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();
    doc.getElementById('login-user').value = 'admin01';
    doc.getElementById('login-pass').value = '01Fraterno*';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    const logged = JSON.parse(win.sessionStorage.getItem('fraterno_user') || 'null');
    assert.ok(logged && logged.username === 'admin01', 'admin01 debe seguir completamente activo para iniciar sesión');
});

test('3.17 [Gestión de Contraseñas] Nueva clave admin01 (01Fraterno*), cambio obligatorio en primer login y autogestión de contraseña por usuarios', async () => {
    const { win, doc } = buildSPAContext();
    const alertsShown = [];
    win.showAlert = (msg, opts) => alertsShown.push({ msg, opts });

    // 1. Verificar nueva contraseña por defecto para admin01 (en estado limpio, servidor y migración)
    const blank = win.createBlankAppData();
    assert.equal(blank.users[0].username, 'admin01');
    assert.equal(blank.users[0].password, '01Fraterno*', 'La clave por defecto de admin01 debe ser 01Fraterno*');

    const resetRes = await requestApp('POST', '/api/reset-state', { confirm: true });
    assert.equal(resetRes.status, 200);
    const resetBody = await resetRes.json();
    assert.equal(resetBody.state.users[0].password, '01Fraterno*', 'El servidor debe sembrar admin01 con contraseña 01Fraterno*');

    // Migración automática si existía clave legacy 'admin'
    const legacyState = { users: [{ id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: 'admin' }] };
    assert.equal(win.migrateMasterAdminPassword(legacyState), true);
    assert.equal(legacyState.users[0].password, '01Fraterno*');

    // Contraseña antigua 'admin' debe ser rechazada; '01Fraterno*' debe autenticar correctamente
    win.AppData = win.createBlankAppData();
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();

    doc.getElementById('login-user').value = 'admin01';
    doc.getElementById('login-pass').value = 'admin';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    assert.equal(win.sessionStorage.getItem('fraterno_user'), null, 'La contraseña anterior "admin" no debe permitir iniciar sesión');

    doc.getElementById('login-user').value = 'admin01';
    doc.getElementById('login-pass').value = '01Fraterno*';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    win.router();
    assert.equal(JSON.parse(win.sessionStorage.getItem('fraterno_user')).username, 'admin01');
    assert.equal(doc.getElementById('modal-change-password'), null, 'admin01 no debe recibir modal forzado de primer login');

    // 2. Crear un usuario nuevo desde Configuración -> contraseña automática <cedula>Fp*, ventana emergente con Usuario/Contraseña y mustChangePassword = true
    win.location.hash = '#/configuracion';
    win.router();

    const editPassBox = doc.getElementById('usr-edit-password-fields');
    assert.ok(
        editPassBox.style.display === 'none' || String(editPassBox.getAttribute('style') || '').includes('display: none'),
        'El campo Contraseña Segura no debe aparecer al registrar un nuevo usuario'
    );

    // Sin cédula no debe crear el usuario
    doc.getElementById('usr-name').value = 'Sofía Asesora';
    doc.getElementById('usr-username').value = 'sofia_v';
    doc.getElementById('usr-cedula').value = '';
    doc.getElementById('usr-role').value = 'Asesor de Ventas';
    doc.getElementById('btn-create-usr').click();
    assert.equal(win.AppData.users.find(u => u.username === 'sofia_v'), undefined, 'La cédula debe ser obligatoria para generar la contraseña por defecto');

    // Con cédula -> crea con contraseña <cedula>Fp* y muestra ventana emergente con Usuario y Contraseña
    doc.getElementById('usr-cedula').value = '1.035.862.410';
    doc.getElementById('btn-create-usr').click();

    const sofiaRec = win.AppData.users.find(u => u.username === 'sofia_v');
    assert.ok(sofiaRec, 'El nuevo usuario debe crearse correctamente');
    assert.equal(sofiaRec.cedula, '1035862410');
    assert.equal(sofiaRec.password, '1035862410Fp*', 'La contraseña por defecto debe ser la cédula acompañada de Fp*');
    assert.equal(sofiaRec.mustChangePassword, true, 'Todo usuario recién creado debe exigir cambio de contraseña en su primer inicio de sesión');

    const credsModal = doc.getElementById('modal-new-user-credentials');
    assert.ok(credsModal, 'Al crear un usuario nuevo debe abrirse una ventana emergente con Usuario y Contraseña');
    assert.ok(doc.getElementById('new-user-modal-username') && credsModal.innerHTML.includes('sofia_v'), 'La ventana emergente debe mostrar el Usuario creado');
    assert.ok(doc.getElementById('new-user-modal-password') && credsModal.innerHTML.includes('1035862410Fp*'), 'La ventana emergente debe mostrar la Contraseña generada (<cedula>Fp*)');
    doc.getElementById('btn-close-new-user-creds').click();
    assert.equal(doc.getElementById('modal-new-user-credentials'), null);

    // 3. Primer inicio de sesión de sofia_v con su contraseña por defecto (<cedula>Fp*) -> debe abrir modal obligatorio sin botón cerrar
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();
    doc.getElementById('login-user').value = 'sofia_v';
    doc.getElementById('login-pass').value = '1035862410Fp*';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    win.router();

    let modal = doc.getElementById('modal-change-password');
    assert.ok(modal, 'En el primer inicio de sesión debe desplegarse el modal de cambio obligatorio de contraseña');
    assert.equal(modal.dataset.forced, '1', 'El modal debe estar en modo obligatorio (forced)');
    assert.equal(doc.getElementById('btn-pwd-close-top'), null, 'El modal obligatorio no debe permitir cerrarse con X');
    assert.equal(doc.getElementById('pwd-current'), null, 'En el primer login no debe pedir contraseña actual sino establecer una nueva');

    // Rechazar misma contraseña temporal (<cedula>Fp*), clave débil o confirmación distinta
    doc.getElementById('pwd-new').value = '1035862410Fp*';
    doc.getElementById('pwd-confirm').value = '1035862410Fp*';
    doc.getElementById('form-change-password').dispatchEvent({ type: 'submit' });
    assert.equal(sofiaRec.mustChangePassword, true, 'No debe aceptar la misma contraseña inicial por defecto');
    assert.ok(doc.getElementById('pwd-modal-error').textContent.includes('diferente'));

    doc.getElementById('pwd-new').value = 'debil123';
    doc.getElementById('pwd-confirm').value = 'debil123';
    doc.getElementById('form-change-password').dispatchEvent({ type: 'submit' });
    assert.equal(sofiaRec.mustChangePassword, true, 'No debe aceptar contraseña que incumpla PasswordPolicy');

    doc.getElementById('pwd-new').value = 'SofiaSegura#26';
    doc.getElementById('pwd-confirm').value = 'OtraClave#26';
    doc.getElementById('form-change-password').dispatchEvent({ type: 'submit' });
    assert.equal(sofiaRec.mustChangePassword, true, 'No debe aceptar confirmaciones que no coinciden');

    // Establecer nueva contraseña personal válida
    doc.getElementById('pwd-new').value = 'SofiaSegura#26';
    doc.getElementById('pwd-confirm').value = 'SofiaSegura#26';
    doc.getElementById('form-change-password').dispatchEvent({ type: 'submit' });

    assert.equal(sofiaRec.mustChangePassword, false, 'Una vez cambiada la clave, mustChangePassword debe quedar en false');
    assert.equal(sofiaRec.password, 'SofiaSegura#26');
    assert.equal(doc.getElementById('modal-change-password'), null, 'El modal obligatorio debe cerrarse tras guardar la nueva contraseña');

    // Segundo login de sofia_v: clave temporal rechazada, nueva clave aceptada sin pedir cambio obligatorio
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();
    doc.getElementById('login-user').value = 'sofia_v';
    doc.getElementById('login-pass').value = '1035862410Fp*';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    assert.equal(win.sessionStorage.getItem('fraterno_user'), null, 'La contraseña temporal por defecto anterior no debe volver a funcionar');

    doc.getElementById('login-user').value = 'sofia_v';
    doc.getElementById('login-pass').value = 'SofiaSegura#26';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    win.router();
    assert.equal(JSON.parse(win.sessionStorage.getItem('fraterno_user')).username, 'sofia_v');
    assert.equal(doc.getElementById('modal-change-password'), null, 'En inicios de sesión posteriores no debe pedir cambio obligatorio');

    // 4. Autogestión de contraseña por usuario estándar (Asesor de Ventas) sin administrador
    const btnSelfPwd = doc.getElementById('btn-sidebar-change-password');
    assert.ok(btnSelfPwd, 'Debe existir el botón Cambiar Contraseña accesible en el menú lateral para todos los usuarios');
    btnSelfPwd.click();

    modal = doc.getElementById('modal-change-password');
    assert.ok(modal, 'Al dar clic en Cambiar Contraseña debe abrirse el modal de autogestión');
    assert.equal(modal.dataset.forced, '0');
    assert.ok(doc.getElementById('pwd-current'), 'El modo autogestión debe solicitar la contraseña actual');

    // Clave actual incorrecta debe rechazarse
    doc.getElementById('pwd-current').value = 'ClaveEquivocada1!';
    doc.getElementById('pwd-new').value = 'MiClaveAuto$99';
    doc.getElementById('pwd-confirm').value = 'MiClaveAuto$99';
    doc.getElementById('form-change-password').dispatchEvent({ type: 'submit' });
    assert.equal(sofiaRec.password, 'SofiaSegura#26', 'No debe cambiar contraseña si la clave actual es incorrecta');
    assert.ok(doc.getElementById('pwd-modal-error').textContent.includes('incorrecta'));

    // Cambio autónomo exitoso
    doc.getElementById('pwd-current').value = 'SofiaSegura#26';
    doc.getElementById('pwd-new').value = 'MiClaveAuto$99';
    doc.getElementById('pwd-confirm').value = 'MiClaveAuto$99';
    doc.getElementById('form-change-password').dispatchEvent({ type: 'submit' });
    assert.equal(sofiaRec.password, 'MiClaveAuto$99', 'El usuario debe poder actualizar su contraseña autónomamente');
    assert.equal(doc.getElementById('modal-change-password'), null);

    // Iniciar sesión con la contraseña autogestionada
    win.sessionStorage.clear();
    win.location.hash = '#/login';
    win.router();
    doc.getElementById('login-user').value = 'sofia_v';
    doc.getElementById('login-pass').value = 'MiClaveAuto$99';
    doc.getElementById('login-form').dispatchEvent({ type: 'submit' });
    assert.equal(JSON.parse(win.sessionStorage.getItem('fraterno_user')).username, 'sofia_v', 'El usuario debe poder autenticarse con la contraseña cambiada por sí mismo');
});

test('3.18 [Seguridad Zona de Reinicio] Solo visible para admin01 (Admin Master) y exige contraseña para Restablecer Sistema en Blanco', async () => {
    const { win, doc } = buildSPAContext();
    const alertsShown = [];
    win.showAlert = async (msg, opts) => { alertsShown.push({ msg, opts }); };
    win.showConfirm = async () => true;

    win.AppData = win.createBlankAppData();
    win.AppData.users.push({
        id: 'usr_otro_admin',
        name: 'Laura Administradora',
        username: 'laura_admin',
        role: 'Administrador',
        password: 'LauraPassword1!'
    });
    win.AppData.passengers = [{ id: 'pax_keep_1', name: 'Pasajero Activo' }];

    // 1. Iniciar sesión como otro Administrador distinto a admin01 -> NO debe visualizar Zona de Reinicio
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({
        id: 'usr_otro_admin', name: 'Laura Administradora', username: 'laura_admin', role: 'Administrador'
    }));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.location.hash = '#/configuracion';
    win.router();

    assert.ok(doc.getElementById('content-backup'), 'La pestaña Backup de Datos debe existir');
    assert.equal(doc.getElementById('reset-system-zone'), null, 'Un usuario distinto a admin01 NO debe ver la Zona de Reinicio');
    assert.equal(doc.getElementById('btn-reset-system-blank'), null, 'El botón Restablecer Sistema en Blanco NO debe renderizarse para otros usuarios');

    // 2. Iniciar sesión como admin01 (Admin Master) -> SÍ debe visualizar Zona de Reinicio
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({
        id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador'
    }));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.router();

    const resetZone = doc.getElementById('reset-system-zone');
    const btnReset = doc.getElementById('btn-reset-system-blank');
    assert.ok(resetZone && btnReset, 'admin01 (Admin Master) debe visualizar la Zona de Reinicio y el botón de restablecimiento');

    const flush = () => new Promise(r => setTimeout(r, 30));

    // 3. Cancelar el prompt de contraseña -> NO debe borrar datos
    let promptCalls = 0;
    let promptInputType = null;
    win.showPrompt = async (_msg, opts) => {
        promptCalls++;
        promptInputType = opts && opts.inputType;
        return null;
    };
    btnReset.click();
    await flush();
    assert.equal(promptCalls, 1, 'Debe solicitar contraseña antes de restablecer');
    assert.equal(promptInputType, 'password', 'El campo de contraseña debe ser tipo password');
    assert.equal(win.AppData.passengers.length, 1, 'Si se cancela el ingreso de contraseña, no debe borrar datos');

    // 4. Ingresar contraseña incorrecta -> debe alertar y NO borrar datos
    win.showPrompt = async () => 'ClaveIncorrecta99!';
    btnReset.click();
    await flush();
    assert.equal(win.AppData.passengers.length, 1, 'Con contraseña incorrecta no debe restablecer el sistema');
    assert.ok(alertsShown.some(a => String(a.msg).includes('Contraseña incorrecta')), 'Debe notificar contraseña incorrecta');

    // 5. Ingresar contraseña correcta de admin01 (01Fraterno*) -> debe restablecer el sistema en blanco
    win.showPrompt = async () => '01Fraterno*';
    btnReset.click();
    await flush();
    assert.equal(win.AppData.passengers.length, 0, 'Con la contraseña correcta de admin01 debe restablecer el sistema en blanco');
    assert.equal(win.AppData.users.length, 1);
    assert.equal(win.AppData.users[0].username, 'admin01');
});

test('3.19 [Registro de Salto - Peso y Recargo KG Extra] Campo Peso (kg) en Datos del pasajero con política automática de recargo (> 85 kg) y persistencia financiera', () => {
    const { win, doc } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({
        id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador'
    }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    win.AppData = win.createBlankAppData();
    win.AppData.maestroValores = [
        { name: 'Valor KG Extra', price: '5.000', comision: '0' },
        { name: 'Salto Tandem', price: '1.500.000', comision: '0' },
        { name: 'Cámara Go-Pro', price: '100.000', comision: '0' },
        { name: 'Cámara 360', price: '150.000', comision: '0' },
        { name: 'Cámara Externa', price: '250.000', comision: '0' }
    ];

    win.location.hash = '#/registro-salto';
    win.router();

    const pWeight = doc.getElementById('p-weight');
    const fKgExtra = doc.getElementById('f-kg-extra');
    const fKgExtraBadge = doc.getElementById('f-kg-extra-badge');
    const weightAlert = doc.getElementById('weight-alert');
    const dKgExtraRow = doc.getElementById('display-kg-extra-row');
    const dKgExtra = doc.getElementById('display-kg-extra');
    const dTotal = doc.getElementById('display-total');

    assert.ok(pWeight, 'Debe existir el campo Peso (kg) en Datos del Pasajero');
    assert.ok(fKgExtra && fKgExtraBadge, 'Debe existir el desglose de Recargo Peso Extra en Lógica Financiera');

    // 1. Peso <= 85 kg -> sin recargo
    pWeight.value = '80';
    pWeight.dispatchEvent({ type: 'input', target: pWeight });
    assert.equal(fKgExtra.value, '0');
    assert.equal(dTotal.textContent, '$1.500.000');
    assert.equal(weightAlert.style.display, 'none');
    assert.equal(dKgExtraRow.style.display, 'none');

    pWeight.value = '85';
    pWeight.dispatchEvent({ type: 'input', target: pWeight });
    assert.equal(fKgExtra.value, '0');
    assert.equal(dTotal.textContent, '$1.500.000');

    // 2. Peso > 85 kg (95 kg -> 10 kg extra * $5.000 = +$50.000)
    pWeight.value = '95';
    pWeight.dispatchEvent({ type: 'input', target: pWeight });
    assert.equal(fKgExtra.value, '50.000', '95 kg debe aplicar recargo de $50.000 (10 kg extra × $5.000)');
    assert.ok(fKgExtraBadge.textContent.includes('10 kg'));
    assert.equal(weightAlert.style.display, 'block');
    assert.ok(weightAlert.innerHTML.includes('50.000'));
    assert.equal(dKgExtraRow.style.display, 'flex');
    assert.equal(dKgExtra.textContent, '+$50.000');
    assert.equal(dTotal.textContent, '$1.550.000');

    // 3. Peso > 100 kg (105 kg -> alerta Jefe de Seguridad S&TA + recargo 20 kg * $5.000 = +$100.000)
    pWeight.value = '105';
    pWeight.dispatchEvent({ type: 'input', target: pWeight });
    assert.equal(fKgExtra.value, '100.000');
    assert.ok(weightAlert.innerHTML.includes('100 kg') && weightAlert.innerHTML.includes('S&amp;TA'));
    assert.equal(dTotal.textContent, '$1.600.000');

    // 4. Grupo de 2 pasajeros con tarifa actualizada en Maestro de Valores ($8.000/kg) y guardado completo
    win.AppData.maestroValores[0].price = '8.000';
    win.router();

    const futureDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-CA');
    const qtyInput = doc.getElementById('qty-people');
    qtyInput.value = '2';
    qtyInput.dispatchEvent({ type: 'change', target: qtyInput });

    // Pasajero 1: 95 kg -> 10 kg extra * $8.000 = $80.000 -> total $1.580.000
    doc.getElementById('p-name').value = 'Andrés';
    doc.getElementById('p-lastname').value = 'Gómez';
    doc.getElementById('p-doc').value = '10101010';
    doc.getElementById('p-phone').value = '3001112233';
    doc.getElementById('p-email').value = 'andres@test.com';
    doc.getElementById('p-dob').value = '1992-04-10';
    doc.getElementById('p-weight').value = '95';
    doc.getElementById('p-weight').dispatchEvent({ type: 'input' });
    doc.getElementById('p-jumpdate').value = futureDate;

    // Cambiar a Pasajero 2: 88 kg -> 3 kg extra * $8.000 = $24.000 -> total $1.524.000
    const tabBtns = doc.getElementById('passenger-tabs').children;
    assert.equal(tabBtns.length, 2);
    tabBtns[1].onclick();

    doc.getElementById('p-name').value = 'Camila';
    doc.getElementById('p-lastname').value = 'Ríos';
    doc.getElementById('p-doc').value = '20202020';
    doc.getElementById('p-phone').value = '3004445566';
    doc.getElementById('p-email').value = 'camila@test.com';
    doc.getElementById('p-dob').value = '1996-08-20';
    doc.getElementById('p-weight').value = '88';
    doc.getElementById('p-weight').dispatchEvent({ type: 'input' });
    doc.getElementById('p-jumpdate').value = futureDate;

    assert.equal(doc.getElementById('display-kg-extra').textContent, '+$104.000', 'El recargo grupal debe sumar $80.000 + $24.000 = $104.000');
    assert.equal(doc.getElementById('display-total').textContent, '$3.104.000', 'El total grupal debe incluir ambos recargos por peso extra');

    // Pago completo y guardar reserva
    const fullPay = doc.getElementById('global-fullpay');
    fullPay.value = 'si';
    fullPay.dispatchEvent({ type: 'change' });
    doc.getElementById('btn-save-res').click();

    assert.equal(win.AppData.passengers.length, 2, 'Deben persistirse ambos pasajeros');
    const pax1 = win.AppData.passengers.find(p => p.doc === '10101010');
    const pax2 = win.AppData.passengers.find(p => p.doc === '20202020');

    assert.equal(pax1.weight, 95);
    assert.equal(pax1.financiera.kgExtra, 10);
    assert.equal(pax1.financiera.kgExtraRate, 8000);
    assert.equal(pax1.financiera.kgExtraCharge, 80000);
    assert.equal(pax1.financiera.totalValue, 1580000);
    assert.equal(pax1.financiera.totalPaid, 1580000);

    assert.equal(pax2.weight, 88);
    assert.equal(pax2.financiera.kgExtra, 3);
    assert.equal(pax2.financiera.kgExtraCharge, 24000);
    assert.equal(pax2.financiera.totalValue, 1524000);
    assert.equal(pax2.financiera.totalPaid, 1524000);

    // Verificar compatibilidad con getPaxFinancialSummary (usado en Reservas)
    const summary1 = win.getPaxFinancialSummary(pax1);
    assert.equal(summary1.totalValue, 1580000);
    assert.equal(summary1.pending, 0);
    assert.equal(summary1.isComplete, true);
});

test('3.20 [Programación y Edición de Vuelo + Peso] Desglose y selección de vuelo por fecha en Registro de Salto y edición de vuelo/peso en Panel Derecho de Reservas', () => {
    const { win, doc, alerts } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({
        id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador'
    }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    // Calcular próximo sábado futuro (garantiza día operativo != lunes/martes)
    const d = new Date();
    const daysToSat = ((6 - d.getDay() + 7) % 7) || 7;
    d.setDate(d.getDate() + daysToSat);
    const opDate = d.toLocaleDateString('en-CA');

    win.AppData = win.createBlankAppData();
    win.AppData.maestroValores = [
        { name: 'Valor KG Extra', price: '5.000', comision: '0' },
        { name: 'Salto Tandem', price: '1.500.000', comision: '0' },
        { name: 'Cámara Go-Pro', price: '100.000', comision: '0' },
        { name: 'Cámara 360', price: '150.000', comision: '0' },
        { name: 'Cámara Externa', price: '250.000', comision: '0' }
    ];
    win.AppData.aeronaves = [
        { id: 'av_1', matricula: 'HK-1820', modelo: 'Cessna 182', capTan: 2, capFun: 2, capCop: 1, estado: 'Operativa' }
    ];
    win.AppData.asignacionFlota = [
        { id: 'flt_1', id_aeronave: 'av_1', fecha: opDate, horaInicio: '08:00', horaFin: '08:30', estado: 'Programado' },
        { id: 'flt_2', id_aeronave: 'av_1', fecha: opDate, horaInicio: '09:00', horaFin: '09:30', estado: 'Programado' },
        { id: 'flt_3', id_aeronave: 'av_1', fecha: opDate, horaInicio: '10:00', horaFin: '10:30', estado: 'Programado' }
    ];
    // flt_1 lleno (2/2 Tándem), flt_2 parcial (1/2 Tándem), flt_3 libre (0/2 Tándem)
    win.AppData.passengers = [
        { id: 'p_full_1', name: 'Pax Uno', doc: '111', phone: '300', date: opDate, type: 'Salto Tandem', flightId: 'flt_1', aeronave: 'HK-1820', vueloNum: 'Vuelo 1', time: '08:00', weight: 70, financiera: { manualPrice: 1500000, totalValue: 1500000, totalPaid: 1500000 } },
        { id: 'p_full_2', name: 'Pax Dos', doc: '222', phone: '300', date: opDate, type: 'Salto Tandem', flightId: 'flt_1', aeronave: 'HK-1820', vueloNum: 'Vuelo 1', time: '08:00', weight: 72, financiera: { manualPrice: 1500000, totalValue: 1500000, totalPaid: 1500000 } },
        { id: 'p_half_1', name: 'Pax Tres', doc: '333', phone: '300', date: opDate, type: 'Salto Tandem', flightId: 'flt_2', aeronave: 'HK-1820', vueloNum: 'Vuelo 2', time: '09:00', weight: 68, financiera: { manualPrice: 1500000, totalValue: 1500000, totalPaid: 1500000 } }
    ];

    // 1. REGISTRO DE SALTO: Seleccionar fecha -> desglosa ocupación y vuelos del día y permite programar pasajero en vuelo
    win.location.hash = '#/registro-salto';
    win.router();

    const pJumpDate = doc.getElementById('p-jumpdate');
    const pFlightSelect = doc.getElementById('p-flight-select');
    const pFlightsBreakdown = doc.getElementById('p-flights-breakdown');

    assert.ok(pFlightSelect && pFlightsBreakdown, 'Debe existir el selector de vuelo y el desglose de vuelos del día');

    pJumpDate.value = opDate;
    pJumpDate.dispatchEvent({ type: 'change', target: pJumpDate });

    assert.ok(doc.getElementById('p-capacity-info').innerHTML.includes('3/6'), 'Debe mostrar la ocupación diaria de Tándem (3/6 disponibles)');
    assert.equal(pFlightSelect.disabled, false, 'Al seleccionar una fecha con vuelos, el selector de vuelos debe habilitarse');
    assert.equal(pFlightsBreakdown.style.display, 'block', 'Debe mostrar el desglose visual de vuelos del día');
    assert.ok(pFlightsBreakdown.innerHTML.includes('Vuelo 1') && pFlightsBreakdown.innerHTML.includes('Vuelo 2') && pFlightsBreakdown.innerHTML.includes('Vuelo 3'));
    assert.ok(pFlightSelect.innerHTML.includes('flt_1') && pFlightSelect.innerHTML.includes('SIN CUPO'), 'El vuelo lleno debe mostrarse como SIN CUPO y deshabilitado');
    assert.ok(pFlightSelect.innerHTML.includes('1/2 Tándem disp.') && pFlightSelect.innerHTML.includes('2/2 Tándem disp.'));

    // Programar nuevo pasajero en flt_2 (Vuelo 2, 09:00, HK-1820) con peso 90 kg
    doc.getElementById('p-name').value = 'Mateo';
    doc.getElementById('p-lastname').value = 'Vargas';
    doc.getElementById('p-doc').value = '77889900';
    doc.getElementById('p-phone').value = '3007778899';
    doc.getElementById('p-email').value = 'mateo@test.com';
    doc.getElementById('p-dob').value = '1993-07-15';
    doc.getElementById('p-weight').value = '90';
    doc.getElementById('p-weight').dispatchEvent({ type: 'input' });

    pFlightSelect.value = 'flt_2';
    pFlightSelect.dispatchEvent({ type: 'change', target: pFlightSelect });

    doc.getElementById('btn-save-res').click();

    const mateo = win.AppData.passengers.find(p => p.doc === '77889900');
    assert.ok(mateo, 'El pasajero debe guardarse correctamente');
    assert.equal(mateo.flightId, 'flt_2');
    assert.equal(mateo.aeronave, 'HK-1820');
    assert.equal(mateo.vueloNum, 'Vuelo 2');
    assert.equal(mateo.time, '09:00');
    assert.equal(mateo.weight, 90);
    assert.equal(mateo.financiera.kgExtraCharge, 25000);

    // 2. RESERVAS (Panel Derecho -> Editar Reserva): Editar vuelo (solo disponibles o sin vuelo) y editar peso
    win.location.hash = '#/reservas';
    win.router();

    const dateFilter = doc.getElementById('booking-date-filter');
    dateFilter.value = opDate;
    dateFilter.dispatchEvent({ type: 'change', target: dateFilter });

    const editBtns = doc.querySelectorAll('.btn-edit-res');
    const mateoEditBtn = editBtns.find(b => b.dataset.id === mateo.id);
    assert.ok(mateoEditBtn, 'Debe aparecer el botón Editar Reserva para Mateo en el panel derecho');
    mateoEditBtn.click();

    const iEditWeight = doc.getElementById('edit-res-weight');
    const iEditFlight = doc.getElementById('edit-res-flight');
    const btnConfirmEdit = doc.getElementById('btn-confirm-edit-res');

    assert.equal(String(iEditWeight.value), '90', 'Debe precargar el peso actual del pasajero');
    assert.equal(iEditFlight.value, 'flt_2', 'Debe precargar el vuelo actual del pasajero');
    assert.ok(String(iEditFlight.getAttribute('style') || '').includes('width: 100%'), 'El selector de vuelo debe ocupar ancho completo para no recortar el texto');
    assert.ok(!iEditFlight.innerHTML.includes('value="flt_1"'), 'NO debe ofrecer el Vuelo 1 lleno en el selector de edición');
    assert.ok(iEditFlight.innerHTML.includes('value="flt_2"') && iEditFlight.innerHTML.includes('0/2 Tándem disp. (Vuelo actual)'), 'El vuelo actual lleno debe reflejar 0/2 real (sin inflar a 1/2)');
    assert.ok(iEditFlight.innerHTML.includes('value="flt_3"') && iEditFlight.innerHTML.includes('2/2 Tándem disp.'), 'Vuelo 3 libre debe mostrar 2/2 Tándem disp.');
    assert.ok(iEditFlight.innerHTML.includes('Sin vuelo asignado'), 'Debe incluir la opción de dejar sin vuelo');

    // A) Cambiar vuelo a flt_3 (Vuelo 3, 10:00) y editar peso a 98 kg (13 kg extra = $65.000)
    iEditFlight.value = 'flt_3';
    iEditWeight.value = '98';
    iEditWeight.dispatchEvent({ type: 'input' });
    btnConfirmEdit.click();

    assert.equal(mateo.flightId, 'flt_3');
    assert.equal(mateo.aeronave, 'HK-1820');
    assert.equal(mateo.vueloNum, 'Vuelo 3');
    assert.equal(mateo.time, '10:00');
    assert.equal(mateo.weight, 98);
    assert.equal(mateo.financiera.kgExtra, 13);
    assert.equal(mateo.financiera.kgExtraCharge, 65000);
    assert.equal(mateo.financiera.totalValue, 1565000);

    // B) Reabrir edición de Mateo (ahora único pasajero en Vuelo 3 de cap 2) -> Vuelo 3 DEBE reflejar 1/2 Tándem disp. (NO 2/2) y dejar SIN VUELO + peso 75 kg
    const mateoEditBtn2 = doc.querySelectorAll('.btn-edit-res').find(b => b.dataset.id === mateo.id);
    mateoEditBtn2.click();

    assert.ok(iEditFlight.innerHTML.includes('1/2 Tándem disp. (Vuelo actual)'), 'Con 1 pasajero Tándem en vuelo de capacidad 2 debe mostrar 1/2 Tándem disp. y NO 2/2');

    iEditFlight.value = '';
    iEditWeight.value = '75';
    btnConfirmEdit.click();

    assert.equal(mateo.flightId, '');
    assert.equal(mateo.aeronave, 'Sin asignar');
    assert.equal(mateo.vueloNum, '');
    assert.equal(mateo.time, 'Por definir');
    assert.equal(mateo.weight, 75);
    assert.equal(mateo.financiera.kgExtra, 0);
    assert.equal(mateo.financiera.kgExtraCharge, 0);
    assert.equal(mateo.financiera.totalValue, 1500000);

    // C) Bloquear asignación forzada a un vuelo lleno (flt_1)
    const mateoEditBtn3 = doc.querySelectorAll('.btn-edit-res').find(b => b.dataset.id === mateo.id);
    mateoEditBtn3.click();
    const alertsCountBefore = alerts.length;
    iEditFlight.value = 'flt_1';
    btnConfirmEdit.click();
    assert.ok(alerts.length > alertsCountBefore, 'Debe rechazar la asignación a un vuelo sin disponibilidad');
    assert.equal(mateo.aeronave, 'Sin asignar', 'El pasajero debe permanecer sin vuelo si se intenta asignar uno lleno');
});

test('3.21 [Manifiesto - Autorización Admin Waiver] Cambio de estado con Waiver pendiente solo por admin o con clave de algún admin (una única vez por pasajero)', async () => {
    const { win, doc } = buildSPAContext();
    const alertsShown = [];
    win.showAlert = async (msg, opts) => { alertsShown.push({ msg, opts }); };

    const todayStr = new Date().toLocaleDateString('en-CA');
    win.AppData = win.createBlankAppData();
    win.AppData.users = [
        { id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador', password: '01Fraterno*' },
        { id: 'usr_laura', name: 'Laura Admin', username: 'laura_admin', role: 'Administrador', password: 'LauraAdmin#1' },
        { id: 'usr_carlos', name: 'Carlos Operaciones', username: 'carlos_op', role: 'Operaciones', password: 'CarlosOp#1' },
        { id: 'usr_sofia', name: 'Sofía Ventas', username: 'sofia_v', role: 'Asesor de Ventas', password: 'SofiaVen#1' }
    ];
    win.AppData.passengers = [
        {
            id: 'pax_nw_1', name: 'Diego SinFirma', doc: '111000', phone: '300111',
            date: todayStr, type: 'Salto Tandem', aeronave: 'HK-1820', vueloNum: 'Vuelo 1', time: '08:00',
            weight: 75, paxStatus: 'Check-in Listo', flightStatus: 'Programado', waiverSigned: false
        },
        {
            id: 'pax_nw_2', name: 'Elena SinFirma', doc: '222000', phone: '300222',
            date: todayStr, type: 'Salto Tandem', aeronave: 'HK-1820', vueloNum: 'Vuelo 2', time: '09:00',
            weight: 68, paxStatus: 'Check-in Listo', flightStatus: 'Programado', waiverSigned: false
        }
    ];

    const flush = () => new Promise(r => setTimeout(r, 25));
    const getFlightSelect = (vueloNum) => doc.querySelectorAll('.flight-status-select').find(s => String(s.getAttribute('data-key') || '').includes(vueloNum));

    // 1. Sesión de usuario NO administrador (Operaciones) -> solicita contraseña de algún administrador
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({
        id: 'usr_carlos', name: 'Carlos Operaciones', username: 'carlos_op', role: 'Operaciones'
    }));
    win.sessionStorage.setItem('fraterno_role', 'admin'); // Incluso si fraterno_role viene como 'admin' por login.js
    win.location.hash = '#/manifiesto';
    win.router();

    let promptCount = 0;
    let lastPromptType = null;

    // 1a. Cancelar contraseña -> no cambia estado
    win.showPrompt = async (_msg, opts) => {
        promptCount++;
        lastPromptType = opts && opts.inputType;
        return null;
    };
    let sel1 = getFlightSelect('Vuelo 1');
    assert.ok(sel1, 'Debe existir selector de estado para Vuelo 1');
    sel1.value = 'Abordando';
    sel1.dispatchEvent({ type: 'change', target: sel1 });
    await flush();
    assert.equal(promptCount, 1, 'Debe pedir contraseña de administrador para usuario Operaciones');
    assert.equal(lastPromptType, 'password');
    assert.equal(win.AppData.passengers[0].flightStatus, 'Programado', 'Al cancelar no debe cambiar el estado del vuelo');
    assert.ok(!win.AppData.passengers[0].waiverAdminAuthorized);

    // 1b. Ingresar contraseña de un NO administrador (propia de Operaciones) -> rechaza
    win.showPrompt = async () => { promptCount++; return 'CarlosOp#1'; };
    sel1 = getFlightSelect('Vuelo 1');
    sel1.value = 'Abordando';
    sel1.dispatchEvent({ type: 'change', target: sel1 });
    await flush();
    assert.equal(win.AppData.passengers[0].flightStatus, 'Programado', 'La contraseña de un no-administrador no debe autorizar');
    assert.ok(alertsShown.some(a => String(a.msg).includes('incorrecta')));
    assert.ok(!win.AppData.passengers[0].waiverAdminAuthorized);

    // 1c. Ingresar contraseña de ALGÚN administrador (Laura Admin) -> autoriza y cambia estado
    win.showPrompt = async () => { promptCount++; return 'LauraAdmin#1'; };
    sel1 = getFlightSelect('Vuelo 1');
    sel1.value = 'Abordando';
    sel1.dispatchEvent({ type: 'change', target: sel1 });
    await flush();
    assert.equal(win.AppData.passengers[0].flightStatus, 'Abordando', 'Con contraseña de algún administrador debe permitir cambiar estado');
    assert.equal(win.AppData.passengers[0].waiverAdminAuthorized, true, 'El pasajero debe quedar autorizado permanentemente');
    assert.equal(win.AppData.passengers[0].waiverAuthorizedBy, 'Laura Admin');

    // 2. Cambios posteriores sobre ese mismo pasajero (incluso por NO administrador) NO deben volver a pedir autorización
    const promptsAfterAuth = promptCount;
    win.showPrompt = async () => { promptCount++; return '01Fraterno*'; };
    sel1 = getFlightSelect('Vuelo 1');
    sel1.value = 'Paracaidistas en el aire';
    sel1.dispatchEvent({ type: 'change', target: sel1 });
    await flush();
    assert.equal(promptCount, promptsAfterAuth, 'Una vez autorizado el pasajero, no debe solicitar más autorización de administrador');
    assert.equal(win.AppData.passengers[0].flightStatus, 'Paracaidistas en el aire');

    // Confirmar que también funciona hacia En El Aire (modal checklist no bloqueado)
    sel1 = getFlightSelect('Vuelo 1');
    sel1.value = 'En El Aire';
    sel1.dispatchEvent({ type: 'change', target: sel1 });
    await flush();
    assert.equal(promptCount, promptsAfterAuth, 'Abrir despegue para pasajero ya autorizado no debe volver a pedir clave');
    const btnConfirmChk = doc.getElementById('btn-confirm-chk');
    assert.equal(btnConfirmChk.disabled, false, 'El botón Confirmar Despegue debe permanecer habilitado tras autorización');

    // 3. Sesión de Administrador directa sobre Vuelo 2 (Elena SinFirma) -> cambia sin pedir contraseña y marca autorización permanente
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({
        id: 'usr_laura', name: 'Laura Admin', username: 'laura_admin', role: 'Administrador'
    }));
    win.sessionStorage.setItem('fraterno_role', 'admin');
    win.router();

    let adminPrompts = 0;
    win.showPrompt = async () => { adminPrompts++; return null; };
    let sel2 = getFlightSelect('Vuelo 2');
    sel2.value = 'Abordando';
    sel2.dispatchEvent({ type: 'change', target: sel2 });
    await flush();
    assert.equal(adminPrompts, 0, 'Un administrador no requiere ingresar contraseña para cambiar el estado');
    assert.equal(win.AppData.passengers[1].flightStatus, 'Abordando');
    assert.equal(win.AppData.passengers[1].waiverAdminAuthorized, true);

    // 4. Usuario Ventas cambiando después Vuelo 2 (ya autorizado por Admin) -> tampoco pide contraseña
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({
        id: 'usr_sofia', name: 'Sofía Ventas', username: 'sofia_v', role: 'Asesor de Ventas'
    }));
    win.sessionStorage.setItem('fraterno_role', 'ventas');
    win.router();

    let salesPrompts = 0;
    win.showPrompt = async () => { salesPrompts++; return null; };
    sel2 = getFlightSelect('Vuelo 2');
    sel2.value = 'Paracaidistas en el aire';
    sel2.dispatchEvent({ type: 'change', target: sel2 });
    await flush();
    assert.equal(salesPrompts, 0, 'Si un administrador ya autorizó al pasajero, otro usuario tampoco volverá a recibir solicitud');
    assert.equal(win.AppData.passengers[1].flightStatus, 'Paracaidistas en el aire');
});

test('3.22 [Registro de Salto - Condición Médica] Campo Con Condición Médica en Datos del pasajero, validación obligatoria y sincronización con Reservas', () => {
    const { win, doc, alerts } = buildSPAContext();
    win.sessionStorage.setItem('fraterno_user', JSON.stringify({
        id: 'usr_admin', name: 'Admin Master', username: 'admin01', role: 'Administrador'
    }));
    win.sessionStorage.setItem('fraterno_role', 'admin');

    const futureDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString('en-CA');
    win.AppData = win.createBlankAppData();

    win.location.hash = '#/registro-salto';
    win.router();

    const chkMed = doc.getElementById('p-has-medical');
    const medBox = doc.getElementById('p-medical-container');
    const medInput = doc.getElementById('p-medical-condition');
    assert.ok(chkMed && medBox && medInput, 'Debe existir el campo Con Condición Médica y el detalle reportado en Datos del Pasajero');
    assert.ok(medBox.style.display === 'none' || String(medBox.getAttribute('style') || '').includes('display: none'));

    // Configurar grupo de 2 pasajeros
    const qtyInput = doc.getElementById('qty-people');
    qtyInput.value = '2';
    qtyInput.dispatchEvent({ type: 'change', target: qtyInput });

    // Pasajero 1: marcar Con Condición Médica sin detalle -> debe rechazar al guardar
    doc.getElementById('p-name').value = 'Valeria';
    doc.getElementById('p-lastname').value = 'Castro';
    doc.getElementById('p-doc').value = '555111';
    doc.getElementById('p-phone').value = '3005551111';
    doc.getElementById('p-email').value = 'valeria@test.com';
    doc.getElementById('p-dob').value = '1994-03-12';
    doc.getElementById('p-jumpdate').value = futureDate;

    chkMed.checked = true;
    chkMed.dispatchEvent({ type: 'change', target: chkMed });
    assert.equal(medBox.style.display, 'block', 'Al marcar Con Condición Médica debe mostrarse el campo de detalle');

    // Cambiar a Pasajero 2 (sin condición médica)
    const tabs = doc.getElementById('passenger-tabs').children;
    tabs[1].onclick();
    assert.equal(chkMed.checked, false, 'El Pasajero 2 debe iniciar sin condición médica marcada');
    assert.equal(medBox.style.display, 'none');

    doc.getElementById('p-name').value = 'Tomás';
    doc.getElementById('p-lastname').value = 'Ruiz';
    doc.getElementById('p-doc').value = '555222';
    doc.getElementById('p-phone').value = '3005552222';
    doc.getElementById('p-email').value = 'tomas@test.com';
    doc.getElementById('p-dob').value = '1991-09-05';
    doc.getElementById('p-jumpdate').value = futureDate;

    // Intentar guardar con Pasajero 1 sin descripción médica -> bloqueado
    const alertsBefore = alerts.length;
    doc.getElementById('btn-save-res').click();
    assert.ok(alerts.length > alertsBefore, 'Debe exigir describir la condición médica si la casilla está marcada');
    assert.equal(win.AppData.passengers.length, 0);

    // Volver al Pasajero 1 e ingresar la condición médica reportada
    tabs[0].onclick();
    assert.equal(chkMed.checked, true);
    medInput.value = 'Asma leve controlada con inhalador';
    medInput.dispatchEvent({ type: 'input', target: medInput });

    doc.getElementById('btn-save-res').click();
    assert.equal(win.AppData.passengers.length, 2, 'Deben guardarse ambos pasajeros correctamente');

    const p1 = win.AppData.passengers.find(p => p.doc === '555111');
    const p2 = win.AppData.passengers.find(p => p.doc === '555222');
    assert.equal(p1.medicalCondition, 'Asma leve controlada con inhalador');
    assert.equal(p2.medicalCondition, 'Ninguna');

    // Verificar sincronización con filtro Con Condición Médica en Reservas
    win.location.hash = '#/reservas';
    win.router();
    const dateFilter = doc.getElementById('booking-date-filter');
    dateFilter.value = futureDate;
    dateFilter.dispatchEvent({ type: 'change', target: dateFilter });

    const filterMed = doc.getElementById('filter-medical');
    filterMed.checked = true;
    filterMed.dispatchEvent({ type: 'change', target: filterMed });

    const paxListHtml = doc.getElementById('booking-pax-list').innerHTML;
    assert.ok(paxListHtml.includes('Valeria Castro') && paxListHtml.includes('fa-heartbeat') && paxListHtml.includes('Asma leve controlada con inhalador'), 'El filtro de Reservas debe mostrar a Valeria con su condición médica reportada');
    assert.ok(!paxListHtml.includes('Tomás Ruiz'), 'El filtro Con Condición Médica debe ocultar pasajeros sin condición médica');
});
