const fs = require('fs');
let code = fs.readFileSync('c:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/billing.js', 'utf8');

// 1. Insert Tab Button
const tabButtonHtml = `
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="factura"><i class="fas fa-file-invoice"></i> Generar Factura</button>`;
code = code.replace(/(data-target="empacadores">.*?<\/button>)/, '$1' + tabButtonHtml);

// 2. Insert Factura Content Div at the end of render
const facturaHtml = `
            <!-- ============================================== -->
            <!-- 4. Factura Cliente                             -->
            <!-- ============================================== -->
            <div id="content-factura" class="billing-content" style="display: none;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
                    <!-- LEFT PANE: Form -->
                    <div class="card" style="margin-bottom: 0;">
                        <h3 style="margin-bottom: 1rem; color: var(--brand-action);"><i class="fas fa-user-edit"></i> Información del Cliente</h3>
                        
                        <div class="form-group">
                            <label>Fecha</label>
                            <input type="date" id="factura-fecha" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Nombre / Razón Social</label>
                            <input type="text" id="factura-nombre" class="form-control" placeholder="Nombre completo o Empresa">
                        </div>
                        <div class="form-group">
                            <label>NIT / CC</label>
                            <input type="text" id="factura-id" class="form-control" placeholder="123456789">
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label>Departamento</label>
                                <select id="factura-depto" class="form-control">
                                    <option value="" disabled selected>Seleccione...</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label>Ciudad / Municipio</label>
                                <select id="factura-ciudad" class="form-control" disabled>
                                    <option value="" disabled selected>Seleccione Depto primero</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Dirección</label>
                            <input type="text" id="factura-dir" class="form-control" placeholder="Calle 123 #45-67">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group">
                                <label>Teléfono (Solo números)</label>
                                <input type="text" id="factura-tel" class="form-control" maxlength="14" placeholder="3001234567">
                            </div>
                            <div class="form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" id="factura-email" class="form-control" placeholder="correo@ejemplo.com">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Observaciones</label>
                            <textarea id="factura-obs" class="form-control" rows="2" placeholder="Notas adicionales..."></textarea>
                        </div>
                        
                        <hr style="border: 0; border-top: 1px solid var(--border-color); margin: 1.5rem 0;">
                        
                        <h3 style="margin-bottom: 1rem; color: var(--brand-success);"><i class="fas fa-cart-plus"></i> Agregar Ítem</h3>
                        <div style="display: flex; gap: 0.5rem; align-items: flex-end; margin-bottom: 1rem;">
                            <div class="form-group" style="flex: 2; margin-bottom: 0;">
                                <label>Descripción</label>
                                <input type="text" id="factura-item-desc" class="form-control" placeholder="Ej. Salto Tándem">
                            </div>
                            <div class="form-group" style="flex: 1; margin-bottom: 0;">
                                <label>Cant.</label>
                                <input type="number" id="factura-item-qty" class="form-control" value="1" min="1">
                            </div>
                            <div class="form-group" style="flex: 1.5; margin-bottom: 0;">
                                <label>V. Unitario ($)</label>
                                <input type="number" id="factura-item-price" class="form-control" placeholder="700000">
                            </div>
                            <button class="btn btn-success" id="btn-add-factura-item" style="height: 42px; margin-bottom: 2px;"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>

                    <!-- RIGHT PANE: Preview & Export -->
                    <div style="display: flex; flex-direction: column; gap: 1rem;">
                        <button id="btn-exportar-factura" class="btn btn-primary" style="padding: 1rem; font-size: 1.1rem; width: 100%; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.3);">
                            <i class="fas fa-file-pdf"></i> Generar y Descargar Factura PDF
                        </button>

                        <div class="card" id="factura-preview" style="background: #ffffff; color: #333333; padding: 2rem; border-radius: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); min-height: 500px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                            
                            <!-- Header Factura -->
                            <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #333; padding-bottom: 1rem; margin-bottom: 1rem;">
                                <div>
                                    <h2 style="margin: 0; color: #111; font-weight: 900; letter-spacing: -1px; font-size: 24px;">FRATERNO PARACAIDISMO</h2>
                                    <p style="margin: 0.2rem 0 0 0; font-size: 12px; color: #666;">NIT: 901.234.567-8</p>
                                    <p style="margin: 0; font-size: 12px; color: #666;">Ricaurte, Cundinamarca</p>
                                    <p style="margin: 0; font-size: 12px; color: #666;">info@fraternoparacaidismo.com</p>
                                </div>
                                <div style="text-align: right;">
                                    <h2 style="margin: 0; color: #111; font-size: 24px;">FACTURA DE VENTA</h2>
                                    <h3 style="margin: 0.5rem 0 0 0; color: #d32f2f; font-size: 20px;">N° <span id="prev-factura-num">0001</span></h3>
                                    <p style="margin: 0.2rem 0 0 0; font-size: 12px; color: #666;">Fecha: <span id="prev-fecha"></span></p>
                                </div>
                            </div>
                            
                            <!-- Info Cliente -->
                            <div style="background: #f9f9f9; padding: 1rem; border: 1px solid #eee; border-radius: 4px; margin-bottom: 1.5rem; font-size: 13px;">
                                <div style="display: grid; grid-template-columns: 100px 1fr; margin-bottom: 0.4rem;">
                                    <strong style="color: #444;">Cliente:</strong> <span id="prev-nombre"></span>
                                </div>
                                <div style="display: grid; grid-template-columns: 100px 1fr; margin-bottom: 0.4rem;">
                                    <strong style="color: #444;">NIT/CC:</strong> <span id="prev-id"></span>
                                </div>
                                <div style="display: grid; grid-template-columns: 100px 1fr; margin-bottom: 0.4rem;">
                                    <strong style="color: #444;">Dirección:</strong> <span id="prev-dir"></span>
                                </div>
                                <div style="display: grid; grid-template-columns: 100px 1fr; margin-bottom: 0.4rem;">
                                    <strong style="color: #444;">Ubicación:</strong> <span id="prev-ubicacion"></span>
                                </div>
                                <div style="display: grid; grid-template-columns: 100px 1fr; margin-bottom: 0.4rem;">
                                    <strong style="color: #444;">Teléfono:</strong> <span id="prev-tel"></span>
                                </div>
                                <div style="display: grid; grid-template-columns: 100px 1fr;">
                                    <strong style="color: #444;">Correo:</strong> <span id="prev-email"></span>
                                </div>
                            </div>

                            <!-- Tabla Items -->
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; font-size: 13px;">
                                <thead>
                                    <tr style="background: #333; color: white;">
                                        <th style="padding: 0.5rem; text-align: left;">Descripción</th>
                                        <th style="padding: 0.5rem; text-align: center; width: 60px;">Cant.</th>
                                        <th style="padding: 0.5rem; text-align: right; width: 100px;">V. Unitario</th>
                                        <th style="padding: 0.5rem; text-align: right; width: 100px;">Total</th>
                                        <th style="width: 30px; background: transparent;" class="no-print"></th>
                                    </tr>
                                </thead>
                                <tbody id="prev-items-body">
                                    <!-- Items go here -->
                                </tbody>
                            </table>

                            <!-- Totales -->
                            <div style="display: flex; justify-content: flex-end; margin-bottom: 2rem;">
                                <div style="width: 250px; background: #f9f9f9; padding: 1rem; border: 1px solid #eee; border-radius: 4px;">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 13px;">
                                        <span>Subtotal:</span>
                                        <span id="prev-subtotal">$0</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 13px;">
                                        <span>IVA (19%):</span>
                                        <span id="prev-iva">$0</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 16px; border-top: 1px solid #ccc; padding-top: 0.5rem; margin-top: 0.5rem;">
                                        <span>TOTAL:</span>
                                        <span id="prev-total">$0</span>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Observaciones -->
                            <div style="font-size: 12px; color: #666; border-top: 1px dashed #ccc; padding-top: 1rem;">
                                <strong>Observaciones:</strong>
                                <p id="prev-obs" style="margin: 0.2rem 0 0 0; white-space: pre-wrap;"></p>
                            </div>
                            
                            <div style="text-align: center; margin-top: 2rem; font-size: 11px; color: #999;">
                                Documento generado por Fraterno Paracaidismo Software
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;

code = code.replace(/(\s*<\/div>\s*`;\s*},)/, facturaHtml + '$1');

// 3. Insert JS logic at the end of init
const jsLogic = `
        // --- FACTURA LOGIC ---
        const colombiaData = {
          "Amazonas": [
                    "Leticia",
                    "Puerto Nariño"
          ],
          "Antioquia": [
                    "Abejorral",
                    "Abriaquí",
                    "Alejandría",
                    "Amagá",
                    "Amalfi",
                    "Andes",
                    "Angelópolis",
                    "Angostura",
                    "Anorí",
                    "Anzá",
                    "Apartadó",
                    "Arboletes",
                    "Argelia",
                    "Armenia",
                    "Barbosa",
                    "Bello",
                    "Belmira",
                    "Betania",
                    "Betulia",
                    "Briceño",
                    "Buriticá",
                    "Cáceres",
                    "Caicedo",
                    "Caldas",
                    "Campamento",
                    "Cañasgordas",
                    "Caracolí",
                    "Caramanta",
                    "Carepa",
                    "Carolina del Príncipe",
                    "Caucasia",
                    "Chigorodó",
                    "Cisneros",
                    "Ciudad Bolívar",
                    "Cocorná",
                    "Concepción",
                    "Concordia",
                    "Copacabana",
                    "Dabeiba",
                    "Donmatías",
                    "Ebéjico",
                    "El Bagre",
                    "El Carmen de Viboral",
                    "El Peñol",
                    "El Retiro",
                    "El Santuario",
                    "Entrerríos",
                    "Envigado",
                    "Fredonia",
                    "Frontino",
                    "Giraldo",
                    "Girardota",
                    "Gómez Plata",
                    "Granada",
                    "Guadalupe",
                    "Guarne",
                    "Guatapé",
                    "Heliconia",
                    "Hispania",
                    "Itagüí",
                    "Ituango",
                    "Jardín",
                    "Jericó",
                    "La Ceja",
                    "La Estrella",
                    "La Pintada",
                    "La Unión",
                    "Liborina",
                    "Maceo",
                    "Marinilla",
                    "Medellín",
                    "Montebello",
                    "Murindó",
                    "Mutatá",
                    "Nariño",
                    "Nechí",
                    "Necoclí",
                    "Olaya",
                    "Peque",
                    "Pueblorrico",
                    "Puerto Berrío",
                    "Puerto Nare",
                    "Puerto Triunfo",
                    "Remedios",
                    "Rionegro",
                    "Sabanalarga",
                    "Sabaneta",
                    "Salgar",
                    "San Andrés de Cuerquia",
                    "San Carlos",
                    "San Francisco",
                    "San Jerónimo",
                    "San José de la Montaña",
                    "San Juan de Urabá",
                    "San Luis",
                    "San Pedro de Urabá",
                    "San Pedro de los Milagros",
                    "San Rafael",
                    "San Roque",
                    "San Vicente",
                    "Santa Bárbara",
                    "Santa Fe de Antioquia",
                    "Santa Rosa de Osos",
                    "Santo Domingo",
                    "Segovia",
                    "Sonsón",
                    "Sopetrán",
                    "Támesis",
                    "Tarazá",
                    "Tarso",
                    "Titiribí",
                    "Toledo",
                    "Turbo",
                    "Uramita",
                    "Urrao",
                    "Valdivia",
                    "Valparaíso",
                    "Vegachí",
                    "Venecia",
                    "Vigía del Fuerte",
                    "Yalí",
                    "Yarumal",
                    "Yolombó",
                    "Yondó",
                    "Zaragoza"
          ],
          "Arauca": [
                    "Arauca",
                    "Arauquita",
                    "Cravo Norte",
                    "Fortul",
                    "Puerto Rondón",
                    "Saravena",
                    "Tame"
          ],
          "Atlántico": [
                    "Baranoa",
                    "Barranquilla",
                    "Campo de la Cruz",
                    "Candelaria",
                    "Galapa",
                    "Juan de Acosta",
                    "Luruaco",
                    "Malambo",
                    "Manatí",
                    "Palmar de Varela",
                    "Piojó",
                    "Polonuevo",
                    "Ponedera",
                    "Puerto Colombia",
                    "Repelón",
                    "Sabanagrande",
                    "Sabanalarga",
                    "Santa Lucía",
                    "Santo Tomás",
                    "Soledad",
                    "Suán",
                    "Tubará",
                    "Usiacurí"
          ],
          "Bolívar": [
                    "Achí",
                    "Altos del Rosario",
                    "Arenal",
                    "Arjona",
                    "Arroyohondo",
                    "Barranco de Loba",
                    "Brazuelo de Papayal",
                    "Calamar",
                    "Cantagallo",
                    "Cartagena de Indias",
                    "Cicuco",
                    "Clemencia",
                    "Córdoba",
                    "El Carmen de Bolívar",
                    "El Guamo",
                    "El Peñón",
                    "Hatillo de Loba",
                    "Magangué",
                    "Mahates",
                    "Margarita",
                    "María la Baja",
                    "Mompós",
                    "Montecristo",
                    "Morales",
                    "Norosí",
                    "Pinillos",
                    "Regidor",
                    "Río Viejo",
                    "San Cristóbal",
                    "San Estanislao",
                    "San Fernando",
                    "San Jacinto del Cauca",
                    "San Jacinto",
                    "San Juan Nepomuceno",
                    "San Martín de Loba",
                    "San Pablo",
                    "Santa Catalina",
                    "Santa Rosa",
                    "Santa Rosa del Sur",
                    "Simití",
                    "Soplaviento",
                    "Talaigua Nuevo",
                    "Tiquisio",
                    "Turbaco",
                    "Turbaná",
                    "Villanueva",
                    "Zambrano"
          ],
          "Boyacá": [
                    "Almeida",
                    "Aquitania",
                    "Arcabuco",
                    "Belén",
                    "Berbeo",
                    "Betéitiva",
                    "Boavita",
                    "Boyacá",
                    "Briceño",
                    "Buenavista",
                    "Busbanzá",
                    "Caldas",
                    "Campohermoso",
                    "Cerinza",
                    "Chinavita",
                    "Chiquinquirá",
                    "Chíquiza",
                    "Chiscas",
                    "Chita",
                    "Chitaraque",
                    "Chivatá",
                    "Chivor",
                    "Ciénega",
                    "Cómbita",
                    "Coper",
                    "Corrales",
                    "Covarachía",
                    "Cubará",
                    "Cucaita",
                    "Cuítiva",
                    "Duitama",
                    "El Cocuy",
                    "El Espino",
                    "Firavitoba",
                    "Floresta",
                    "Gachantivá",
                    "Gámeza",
                    "Garagoa",
                    "Guacamayas",
                    "Guateque",
                    "Guayatá",
                    "Güicán",
                    "Iza",
                    "Jenesano",
                    "Jericó",
                    "La Capilla",
                    "La Uvita",
                    "La Victoria",
                    "Labranzagrande",
                    "Macanal",
                    "Maripí",
                    "Miraflores",
                    "Mongua",
                    "Monguí",
                    "Moniquirá",
                    "Motavita",
                    "Muzo",
                    "Nobsa",
                    "Nuevo Colón",
                    "Oicatá",
                    "Otanche",
                    "Pachavita",
                    "Páez",
                    "Paipa",
                    "Pajarito",
                    "Panqueba",
                    "Pauna",
                    "Paya",
                    "Paz del Río",
                    "Pesca",
                    "Pisba",
                    "Puerto Boyacá",
                    "Quípama",
                    "Ramiriquí",
                    "Ráquira",
                    "Rondón",
                    "Saboyá",
                    "Sáchica",
                    "Samacá",
                    "San Eduardo",
                    "San José de Pare",
                    "San Luis de Gaceno",
                    "San Mateo",
                    "San Miguel de Sema",
                    "San Pablo de Borbur",
                    "Santa María",
                    "Santa Rosa de Viterbo",
                    "Santa Sofía",
                    "Santana",
                    "Sativanorte",
                    "Sativasur",
                    "Siachoque",
                    "Soatá",
                    "Socha",
                    "Socotá",
                    "Sogamoso",
                    "Somondoco",
                    "Sora",
                    "Soracá",
                    "Sotaquirá",
                    "Susacón",
                    "Sutamarchán",
                    "Sutatenza",
                    "Tasco",
                    "Tenza",
                    "Tibaná",
                    "Tibasosa",
                    "Tinjacá",
                    "Tipacoque",
                    "Toca",
                    "Togüí",
                    "Tópaga",
                    "Tota",
                    "Tunja",
                    "Tununguá",
                    "Turmequé",
                    "Tuta",
                    "Tutazá",
                    "Úmbita",
                    "Ventaquemada",
                    "Villa de Leyva",
                    "Viracachá",
                    "Zetaquira"
          ],
          "Caldas": [
                    "Aguadas",
                    "Anserma",
                    "Aranzazu",
                    "Belalcázar",
                    "Chinchiná",
                    "Filadelfia",
                    "La Dorada",
                    "La Merced",
                    "Manizales",
                    "Manzanares",
                    "Marmato",
                    "Marquetalia",
                    "Marulanda",
                    "Neira",
                    "Norcasia",
                    "Pácora",
                    "Palestina",
                    "Pensilvania",
                    "Riosucio",
                    "Risaralda",
                    "Salamina",
                    "Samaná",
                    "San José",
                    "Supía",
                    "Victoria",
                    "Villamaría",
                    "Viterbo"
          ],
          "Caquetá": [
                    "Albania",
                    "Belén de los Andaquíes",
                    "Cartagena del Chairá",
                    "Curillo",
                    "El Doncello",
                    "El Paujil",
                    "Florencia",
                    "La Montañita",
                    "Milán",
                    "Morelia",
                    "Puerto Rico",
                    "San José del Fragua",
                    "San Vicente del Caguán",
                    "Solano",
                    "Solita",
                    "Valparaíso"
          ],
          "Casanare": [
                    "Aguazul",
                    "Chámeza",
                    "Hato Corozal",
                    "La Salina",
                    "Maní",
                    "Monterrey",
                    "Nunchía",
                    "Orocué",
                    "Paz de Ariporo",
                    "Pore",
                    "Recetor",
                    "Sabanalarga",
                    "Sácama",
                    "San Luis de Palenque",
                    "Támara",
                    "Tauramena",
                    "Trinidad",
                    "Villanueva",
                    "Yopal"
          ],
          "Cauca": [
                    "Almaguer",
                    "Argelia",
                    "Balboa",
                    "Bolívar",
                    "Buenos Aires",
                    "Cajibío",
                    "Caldono",
                    "Caloto",
                    "Corinto",
                    "El Tambo",
                    "Florencia",
                    "Guachené",
                    "Guapí",
                    "Inzá",
                    "Jambaló",
                    "La Sierra",
                    "La Vega",
                    "López de Micay",
                    "Mercaderes",
                    "Miranda",
                    "Morales",
                    "Padilla",
                    "Páez",
                    "Patía",
                    "Piamonte",
                    "Piendamó",
                    "Popayán",
                    "Puerto Tejada",
                    "Puracé",
                    "Rosas",
                    "San Sebastián",
                    "Santa Rosa",
                    "Santander de Quilichao",
                    "Silvia",
                    "Sotará",
                    "Suárez",
                    "Sucre",
                    "Timbío",
                    "Timbiquí",
                    "Toribío",
                    "Totoró",
                    "Villa Rica"
          ],
          "Cesar": [
                    "Aguachica",
                    "Agustín Codazzi",
                    "Astrea",
                    "Becerril",
                    "Bosconia",
                    "Chimichagua",
                    "Chiriguaná",
                    "Curumaní",
                    "El Copey",
                    "El Paso",
                    "Gamarra",
                    "González",
                    "La Gloria (Cesar)",
                    "La Jagua de Ibirico",
                    "La Paz",
                    "Manaure Balcón del Cesar",
                    "Pailitas",
                    "Pelaya",
                    "Pueblo Bello",
                    "Río de Oro",
                    "San Alberto",
                    "San Diego",
                    "San Martín",
                    "Tamalameque",
                    "Valledupar"
          ],
          "Chocó": [
                    "Acandí",
                    "Alto Baudó",
                    "Bagadó",
                    "Bahía Solano",
                    "Bajo Baudó",
                    "Bojayá",
                    "Cantón de San Pablo",
                    "Cértegui",
                    "Condoto",
                    "El Atrato",
                    "El Carmen de Atrato",
                    "El Carmen del Darién",
                    "Istmina",
                    "Juradó",
                    "Litoral de San Juan",
                    "Lloró",
                    "Medio Atrato",
                    "Medio Baudó",
                    "Medio San Juan",
                    "Nóvita",
                    "Nuquí",
                    "Quibdó",
                    "Río Iró",
                    "Río Quito",
                    "Riosucio",
                    "San José del Palmar",
                    "Sipí",
                    "Tadó",
                    "Unión Panamericana",
                    "Unguía"
          ],
          "Cundinamarca": [
                    "Agua de Dios",
                    "Albán",
                    "Anapoima",
                    "Anolaima",
                    "Apulo",
                    "Arbeláez",
                    "Beltrán",
                    "Bituima",
                    "Bogotá",
                    "Bojacá",
                    "Cabrera",
                    "Cachipay",
                    "Cajicá",
                    "Caparrapí",
                    "Cáqueza",
                    "Carmen de Carupa",
                    "Chaguaní",
                    "Chía",
                    "Chipaque",
                    "Choachí",
                    "Chocontá",
                    "Cogua",
                    "Cota",
                    "Cucunubá",
                    "El Colegio",
                    "El Peñón",
                    "El Rosal",
                    "Facatativá",
                    "Fómeque",
                    "Fosca",
                    "Funza",
                    "Fúquene",
                    "Fusagasugá",
                    "Gachalá",
                    "Gachancipá",
                    "Gachetá",
                    "Gama",
                    "Girardot",
                    "Granada",
                    "Guachetá",
                    "Guaduas",
                    "Guasca",
                    "Guataquí",
                    "Guatavita",
                    "Guayabal de Síquima",
                    "Guayabetal",
                    "Gutiérrez",
                    "Jerusalén",
                    "Junín",
                    "La Calera",
                    "La Mesa",
                    "La Palma",
                    "La Peña",
                    "La Vega",
                    "Lenguazaque",
                    "Machetá",
                    "Madrid",
                    "Manta",
                    "Medina",
                    "Mosquera",
                    "Nariño",
                    "Nemocón",
                    "Nilo",
                    "Nimaima",
                    "Nocaima",
                    "Pacho",
                    "Paime",
                    "Pandi",
                    "Paratebueno",
                    "Pasca",
                    "Puerto Salgar",
                    "Pulí",
                    "Quebradanegra",
                    "Quetame",
                    "Quipile",
                    "Ricaurte",
                    "San Antonio del Tequendama",
                    "San Bernardo",
                    "San Cayetano",
                    "San Francisco",
                    "San Juan de Rioseco",
                    "Sasaima",
                    "Sesquilé",
                    "Sibaté",
                    "Silvania",
                    "Simijaca",
                    "Soacha",
                    "Sopó",
                    "Subachoque",
                    "Suesca",
                    "Supatá",
                    "Susa",
                    "Sutatausa",
                    "Tabio",
                    "Tausa",
                    "Tena",
                    "Tenjo",
                    "Tibacuy",
                    "Tibirita",
                    "Tocaima",
                    "Tocancipá",
                    "Topaipí",
                    "Ubalá",
                    "Ubaque",
                    "Ubaté",
                    "Une",
                    "Útica",
                    "Venecia",
                    "Vergara",
                    "Vianí",
                    "Villagómez",
                    "Villapinzón",
                    "Villeta",
                    "Viotá",
                    "Yacopí",
                    "Zipacón",
                    "Zipaquirá"
          ],
          "Córdoba": [
                    "Ayapel",
                    "Buenavista",
                    "Canalete",
                    "Cereté",
                    "Chimá",
                    "Chinú",
                    "Ciénaga de Oro",
                    "Cotorra",
                    "La Apartada",
                    "Lorica",
                    "Los Córdobas",
                    "Momil",
                    "Montelíbano",
                    "Montería",
                    "Moñitos",
                    "Planeta Rica",
                    "Pueblo Nuevo",
                    "Puerto Escondido",
                    "Puerto Libertador",
                    "Purísima",
                    "Sahagún",
                    "San Andrés de Sotavento",
                    "San Antero",
                    "San Bernardo del Viento",
                    "San Carlos",
                    "San José de Uré",
                    "San Pelayo",
                    "Tierralta",
                    "Tuchín",
                    "Valencia"
          ],
          "Guainía": [
                    "Inírida"
          ],
          "Guaviare": [
                    "Calamar",
                    "El Retorno",
                    "Miraflores",
                    "San José del Guaviare"
          ],
          "Huila": [
                    "Acevedo",
                    "Agrado",
                    "Aipe",
                    "Algeciras",
                    "Altamira",
                    "Baraya",
                    "Campoalegre",
                    "Colombia",
                    "El Pital",
                    "Elías",
                    "Garzón",
                    "Gigante",
                    "Guadalupe",
                    "Hobo",
                    "Íquira",
                    "Isnos",
                    "La Argentina",
                    "La Plata",
                    "Nátaga",
                    "Neiva",
                    "Oporapa",
                    "Paicol",
                    "Palermo",
                    "Palestina",
                    "Pitalito",
                    "Rivera",
                    "Saladoblanco",
                    "San Agustín",
                    "Santa María",
                    "Suaza",
                    "Tarqui",
                    "Tello",
                    "Teruel",
                    "Tesalia",
                    "Timaná",
                    "Villavieja",
                    "Yaguará"
          ],
          "La Guajira": [
                    "Albania",
                    "Barrancas",
                    "Dibulla",
                    "Distracción",
                    "El Molino",
                    "Fonseca",
                    "Hatonuevo",
                    "La Jagua del Pilar",
                    "Maicao",
                    "Manaure",
                    "Riohacha",
                    "San Juan del Cesar",
                    "Uribia",
                    "Urumita",
                    "Villanueva"
          ],
          "Magdalena": [
                    "Algarrobo",
                    "Aracataca",
                    "Ariguaní",
                    "Cerro de San Antonio",
                    "Chibolo",
                    "Chibolo",
                    "Ciénaga",
                    "Concordia",
                    "El Banco",
                    "El Piñón",
                    "El Retén",
                    "Fundación",
                    "Guamal",
                    "Nueva Granada",
                    "Pedraza",
                    "Pijiño del Carmen",
                    "Pivijay",
                    "Plato",
                    "Pueblo Viejo",
                    "Remolino",
                    "Sabanas de San Ángel",
                    "Salamina",
                    "San Sebastián de Buenavista",
                    "San Zenón",
                    "Santa Ana",
                    "Santa Bárbara de Pinto",
                    "Santa Marta",
                    "Sitionuevo",
                    "Tenerife",
                    "Zapayán",
                    "Zona Bananera"
          ],
          "Meta": [
                    "Acacías",
                    "Barranca de Upía",
                    "Cabuyaro",
                    "Castilla la Nueva",
                    "Cubarral",
                    "Cumaral",
                    "El Calvario",
                    "El Castillo",
                    "El Dorado",
                    "Fuente de Oro",
                    "Granada",
                    "Guamal",
                    "La Macarena",
                    "La Uribe",
                    "Lejanías",
                    "Mapiripán",
                    "Mesetas",
                    "Puerto Concordia",
                    "Puerto Gaitán",
                    "Puerto Lleras",
                    "Puerto López",
                    "Puerto Rico",
                    "Restrepo",
                    "San Carlos de Guaroa",
                    "San Juan de Arama",
                    "San Juanito",
                    "San Martín",
                    "Villavicencio",
                    "Vista Hermosa"
          ],
          "Nariño": [
                    "Aldana",
                    "Ancuyá",
                    "Arboleda",
                    "Barbacoas",
                    "Belén",
                    "Buesaco",
                    "Chachagüí",
                    "Colón",
                    "Consacá",
                    "Contadero",
                    "Córdoba",
                    "Cuaspud",
                    "Cumbal",
                    "Cumbitara",
                    "El Charco",
                    "El Peñol",
                    "El Rosario",
                    "El Tablón",
                    "El Tambo",
                    "Francisco Pizarro",
                    "Funes",
                    "Guachucal",
                    "Guaitarilla",
                    "Gualmatán",
                    "Iles",
                    "Imués",
                    "Ipiales",
                    "La Cruz",
                    "La Florida",
                    "La Llanada",
                    "La Tola",
                    "La Unión",
                    "Leiva",
                    "Linares",
                    "Los Andes",
                    "Magüí Payán",
                    "Mallama",
                    "Mosquera",
                    "Nariño",
                    "Olaya Herrera",
                    "Ospina",
                    "Pasto",
                    "Policarpa",
                    "Potosí",
                    "Providencia",
                    "Puerres",
                    "Pupiales",
                    "Ricaurte",
                    "Roberto Payán",
                    "Samaniego",
                    "San Bernardo",
                    "San José de Albán",
                    "San Lorenzo",
                    "San Pablo",
                    "San Pedro de Cartago",
                    "Sandoná",
                    "Santa Bárbara",
                    "Santacruz",
                    "Sapuyes",
                    "Taminango",
                    "Tangua",
                    "Tumaco",
                    "Túquerres",
                    "Yacuanquer"
          ],
          "Norte de Santander": [
                    "Ábrego",
                    "Arboledas",
                    "Bochalema",
                    "Bucarasica",
                    "Cáchira",
                    "Cácota",
                    "Chinácota",
                    "Chitagá",
                    "Convención",
                    "Cúcuta",
                    "Cucutilla",
                    "Duranía",
                    "El Carmen",
                    "El Tarra",
                    "El Zulia",
                    "Gramalote",
                    "Hacarí",
                    "Herrán",
                    "La Esperanza",
                    "La Playa de Belén",
                    "Labateca",
                    "Los Patios",
                    "Lourdes",
                    "Mutiscua",
                    "Ocaña",
                    "Pamplona",
                    "Pamplonita",
                    "Puerto Santander",
                    "Ragonvalia",
                    "Salazar de Las Palmas",
                    "San Calixto",
                    "San Cayetano",
                    "Santiago",
                    "Santo Domingo de Silos",
                    "Sardinata",
                    "Teorama",
                    "Tibú",
                    "Toledo",
                    "Villa Caro",
                    "Villa del Rosario"
          ],
          "Putumayo": [
                    "Colón",
                    "Mocoa",
                    "Orito",
                    "Puerto Asís",
                    "Puerto Caicedo",
                    "Puerto Guzmán",
                    "Puerto Leguízamo",
                    "San Francisco",
                    "San Miguel",
                    "Santiago",
                    "Sibundoy",
                    "Valle del Guamuez",
                    "Villagarzón"
          ],
          "Quindío": [
                    "Armenia",
                    "Buenavista",
                    "Calarcá",
                    "Circasia",
                    "Córdoba",
                    "Filandia",
                    "Génova",
                    "La Tebaida",
                    "Montenegro",
                    "Pijao",
                    "Quimbaya",
                    "Salento"
          ],
          "Risaralda": [
                    "Apía",
                    "Balboa",
                    "Belén de Umbría",
                    "Dosquebradas",
                    "Guática",
                    "La Celia",
                    "La Virginia",
                    "Marsella",
                    "Mistrató",
                    "Pereira",
                    "Pueblo Rico",
                    "Quinchía",
                    "Santa Rosa de Cabal",
                    "Santuario"
          ],
          "San Andrés y Providencia": [
                    "Providencia y Santa Catalina Islas",
                    "San Andrés"
          ],
          "Santander": [
                    "Aguada",
                    "Albania",
                    "Aratoca",
                    "Barbosa",
                    "Barichara",
                    "Barrancabermeja",
                    "Betulia",
                    "Bolívar",
                    "Bucaramanga",
                    "Cabrera",
                    "California",
                    "Capitanejo",
                    "Carcasí",
                    "Cepitá",
                    "Cerrito",
                    "Charalá",
                    "Charta",
                    "Chima",
                    "Chipatá",
                    "Cimitarra",
                    "Concepción",
                    "Confines",
                    "Contratación",
                    "Coromoro",
                    "Curití",
                    "El Carmen de Chucurí",
                    "El Guacamayo",
                    "El Peñón",
                    "El Playón",
                    "El Socorro",
                    "Encino",
                    "Enciso",
                    "Florián",
                    "Floridablanca",
                    "Galán",
                    "Gámbita",
                    "Girón",
                    "Guaca",
                    "Guadalupe",
                    "Guapotá",
                    "Guavatá",
                    "Güepsa",
                    "Hato",
                    "Jesús María",
                    "Jordán",
                    "La Belleza",
                    "La Paz",
                    "Landázuri",
                    "Lebrija",
                    "Los Santos",
                    "Macaravita",
                    "Málaga",
                    "Matanza",
                    "Mogotes",
                    "Molagavita",
                    "Ocamonte",
                    "Oiba",
                    "Onzaga",
                    "Palmar",
                    "Palmas del Socorro",
                    "Páramo",
                    "Piedecuesta",
                    "Pinchote",
                    "Puente Nacional",
                    "Puerto Parra",
                    "Puerto Wilches",
                    "Rionegro",
                    "Sabana de Torres",
                    "San Andrés",
                    "San Benito",
                    "San Gil",
                    "San Joaquín",
                    "San José de Miranda",
                    "San Miguel",
                    "San Vicente de Chucurí",
                    "Santa Bárbara",
                    "Santa Helena del Opón",
                    "Simacota",
                    "Suaita",
                    "Sucre",
                    "Suratá",
                    "Tona",
                    "Valle de San José",
                    "Vélez",
                    "Vetas",
                    "Villanueva",
                    "Zapatoca"
          ],
          "Sucre": [
                    "Buenavista",
                    "Caimito",
                    "Chalán",
                    "Colosó",
                    "Corozal",
                    "Coveñas",
                    "El Roble",
                    "Galeras",
                    "Guaranda",
                    "La Unión",
                    "Los Palmitos",
                    "Majagual",
                    "Morroa",
                    "Ovejas",
                    "Sampués",
                    "San Antonio de Palmito",
                    "San Benito Abad",
                    "San Juan de Betulia",
                    "San Marcos",
                    "San Onofre",
                    "San Pedro",
                    "Sincé",
                    "Sincelejo",
                    "Sucre",
                    "Tolú",
                    "Tolú Viejo"
          ],
          "Tolima": [
                    "Alpujarra",
                    "Alvarado",
                    "Ambalema",
                    "Anzoátegui",
                    "Armero",
                    "Ataco",
                    "Cajamarca",
                    "Carmen de Apicalá",
                    "Casabianca",
                    "Chaparral",
                    "Coello",
                    "Coyaima",
                    "Cunday",
                    "Dolores",
                    "El Espinal",
                    "Falán",
                    "Flandes",
                    "Fresno",
                    "Guamo",
                    "Herveo",
                    "Honda",
                    "Ibagué",
                    "Icononzo",
                    "Lérida",
                    "Líbano",
                    "Mariquita",
                    "Melgar",
                    "Murillo",
                    "Natagaima",
                    "Ortega",
                    "Palocabildo",
                    "Piedras",
                    "Planadas",
                    "Prado",
                    "Purificación",
                    "Rioblanco",
                    "Roncesvalles",
                    "Rovira",
                    "Saldaña",
                    "San Antonio",
                    "San Luis",
                    "Santa Isabel",
                    "Suárez",
                    "Valle de San Juan",
                    "Venadillo",
                    "Villahermosa",
                    "Villarrica"
          ],
          "Valle del Cauca": [
                    "Alcalá",
                    "Andalucía",
                    "Ansermanuevo",
                    "Argelia",
                    "Bolívar",
                    "Buenaventura",
                    "Buga",
                    "Bugalagrande",
                    "Caicedonia",
                    "Cali",
                    "Calima",
                    "Candelaria",
                    "Cartago",
                    "Dagua",
                    "El Águila",
                    "El Cairo",
                    "El Cerrito",
                    "El Dovio",
                    "Florida",
                    "Ginebra",
                    "Guacarí",
                    "Jamundí",
                    "La Cumbre",
                    "La Unión",
                    "La Victoria",
                    "Obando",
                    "Palmira",
                    "Pradera",
                    "Restrepo",
                    "Riofrío",
                    "Roldanillo",
                    "San Pedro",
                    "Sevilla",
                    "Toro",
                    "Trujillo",
                    "Tuluá",
                    "Ulloa",
                    "Versalles",
                    "Vijes",
                    "Yotoco",
                    "Yumbo",
                    "Zarzal"
          ],
          "Vaupés": [
                    "Carurú",
                    "Mitú",
                    "Taraira"
          ],
          "Vichada": [
                    "Cumaribo",
                    "La Primavera",
                    "Puerto Carreño",
                    "Santa Rosalía"
          ]
};

        const deptoSelect = document.getElementById('factura-depto');
        const ciudadSelect = document.getElementById('factura-ciudad');
        
        if(deptoSelect) {
            // Populate Deptos
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

        // Set Date
        const fFecha = document.getElementById('factura-fecha');
        if(fFecha) {
            const today = new Date().toISOString().split('T')[0];
            fFecha.value = today;
        }

        // Sequence
        let seqStr = localStorage.getItem('factura_seq') || "1";
        let seqNum = parseInt(seqStr, 10);
        function pad(num, size) {
            let s = num + "";
            while (s.length < size) s = "0" + s;
            return s;
        }
        const fNum = document.getElementById('prev-factura-num');
        if(fNum) fNum.textContent = pad(seqNum, 4);

        // Validation: Phone numbers only max 14
        const telInput = document.getElementById('factura-tel');
        if(telInput) {
            telInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/\\D/g, '').substring(0, 14);
                updatePreview();
            });
        }

        // Real-time binding
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

        // Invoice Items
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
                tr.innerHTML = \`
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee;">\${escapeHTML(item.desc)}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: center;">\${item.qty}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: right;">$\${item.price.toLocaleString('es-CO')}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: right;">$\${totalLine.toLocaleString('es-CO')}</td>
                    <td style="padding: 0.5rem; border-bottom: 1px solid #eee; text-align: center;" class="no-print">
                        <button class="btn-del-item" data-idx="\${index}" style="background: none; border: none; color: #d32f2f; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </td>
                \`;
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

        // Initialize preview
        updatePreview();
        renderFacturaItems();

        // PDF Generation
        const btnExport = document.getElementById('btn-exportar-factura');
        if(btnExport) {
            btnExport.addEventListener('click', () => {
                if (typeof window.jspdf === 'undefined') {
                    alert("Error: jsPDF no está cargado. No se puede exportar.");
                    return;
                }
                if (typeof html2canvas === 'undefined') {
                    // Try to dynamically load html2canvas if not present
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
            // Hide delete buttons temporarily
            const deletes = previewEl.querySelectorAll('.no-print');
            deletes.forEach(el => el.style.display = 'none');

            // Generate
            html2canvas(previewEl, { scale: 2 }).then(canvas => {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                const { jsPDF } = window.jspdf;
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('Factura_Fraterno_' + pad(seqNum, 4) + '.pdf');

                // Increment sequence
                seqNum++;
                localStorage.setItem('factura_seq', seqNum.toString());
                document.getElementById('prev-factura-num').textContent = pad(seqNum, 4);

                // Restore delete buttons
                deletes.forEach(el => el.style.display = '');
                alert('Factura generada con éxito y secuencia actualizada a ' + pad(seqNum, 4));
            }).catch(err => {
                console.error("Error generating PDF", err);
                alert("Hubo un error al generar el PDF.");
                deletes.forEach(el => el.style.display = '');
            });
        }
`;

// Insert before the last closing brace of init
code = code.replace(/(\s*}\s*)$/, jsLogic + '$1');

fs.writeFileSync('c:/Users/Falcon/Documents/FRATERNO/Prueba/js/modules/billing.js', code, 'utf8');
console.log('Factura logic injected.');
