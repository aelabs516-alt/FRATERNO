window.Modules = window.Modules || {};
window.Modules.settings = {
    isCurrentSessionMasterAdmin: () => {
        try {
            const raw = sessionStorage.getItem('fraterno_user');
            if (!raw) return false;
            const u = JSON.parse(raw);
            if (!u) return false;
            const uname = String(u.username || '').trim().toLowerCase();
            const uid = String(u.id || '').trim().toLowerCase();
            return uname === 'admin01' || uid === 'usr_admin';
        } catch (e) {
            return false;
        }
    },
    render: (container) => {
        const isMasterAdminSession = window.Modules.settings.isCurrentSessionMasterAdmin();
        container.innerHTML = `
            <h2>Configuración del Sistema</h2>
            <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Administra las variables globales y submódulos.</p>

            <!-- Tabs Navigation -->
            <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; overflow-x: auto;" id="settings-tabs">
                <button class="btn btn-primary" data-target="precios">Maestro de Valores</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="aeronaves">Aeronaves</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="usuarios">Creación de Usuarios</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="backup"><i class="fas fa-database"></i> Backup de Datos</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="noop"><i class="fas fa-calendar-times"></i> Fechas NO Operación</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="documentos"><i class="fas fa-file-pdf"></i> Documentos Legales</button>
                <button class="btn" style="background: var(--bg-surface-hover); color: var(--text-primary);" data-target="store-products"><i class="fas fa-box"></i> Maestro Productos Tienda</button>
            </div>

            <!-- 1. Maestro de Valores                          -->
            <!-- ============================================== -->
            
            <!-- ============================================== -->
            <!-- Gesti&oacute;n de Documentos PDF                      -->
            <!-- ============================================== -->
            <div id="content-documentos" class="settings-content" style="display: none;">
                <h3>Gesti&oacute;n de Documentos Legales (PDF)</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Administra las versiones de los documentos que se muestran en el portal B2C y portal de autogesti&oacute;n.</p>
                <div id="docs-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                    <!-- Rendered dynamically -->
                </div>
            </div>

            <!-- ============================================== -->
            <!-- Maestro Productos Tienda                       -->
            <!-- ============================================== -->
            <div id="content-store-products" class="card settings-content" style="display: none;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <h3><i class="fas fa-boxes"></i> Maestro de Productos Tienda</h3>
                    <button class="btn btn-primary" id="btn-create-store-product"><i class="fas fa-plus"></i> Crear Producto</button>
                </div>
                <div id="store-products-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;">
                    <!-- Productos renderizados aquí -->
                </div>
            </div>

            <div id="content-precios" class="card settings-content" style="display: block;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
                    <h3>Maestro de Valores</h3>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        <button class="btn btn-outline" id="btn-toggle-tariff-history"><i class="fas fa-history"></i> Historial de Tarifas</button>
                        <button class="btn btn-primary" id="btn-create-valor"><i class="fas fa-plus"></i> Crear Nuevo Ítem</button>
                    </div>
                </div>
                <div id="maestro-security-banner" style="margin-top: 1rem; padding: 0.9rem 1.1rem; border-radius: 10px; background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.35); display: flex; align-items: flex-start; gap: 0.85rem;">
                    <!-- Rendered dynamically by renderValoresSecurityUI -->
                </div>
                <div id="maestro-history-panel" style="display: none; margin-top: 1rem; padding: 1rem; border-radius: 10px; background: var(--bg-surface-hover); border: 1px solid var(--border-color);">
                    <!-- Rendered dynamically by renderValoresSecurityUI -->
                </div>
                <div id="valores-grid" style="margin-top: 1rem; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem;">
                    <!-- Rendered dynamically -->
                </div>
                <div style="margin-top: 1.5rem; text-align: right;">
                    <button class="btn btn-primary" id="btn-save-prices"><i class="fas fa-shield-alt"></i> Guardar Valores (Solo Futuros)</button>
                </div>
            </div>



            <!-- ============================================== -->
            <!-- Aeronaves                                      -->
            <!-- ============================================== -->
            <div id="content-aeronaves" class="settings-content" style="display: none;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                    
                    <!-- Formulario -->
                    <div class="card">
                        <h3>Registrar Aeronave</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Registra los aviones y su capacidad de salto.</p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Aeronave (Modelo)</label>
                                <input type="text" id="plane-model" class="form-control" placeholder="Ej: Cessna 208 Caravan">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Matrícula</label>
                                <input type="text" id="plane-reg" class="form-control" placeholder="Ej: HK-1234">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Cap. FunJumper</label>
                                <input type="number" id="plane-cap-fun" class="form-control" value="10" min="0">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Cap. Tandem</label>
                                <input type="number" id="plane-cap-tan" class="form-control" value="5" min="0">
                            </div>
                            <div class="form-group" style="margin-bottom: 0;">
                                <label>Cap. Copiloto</label>
                                <input type="number" id="plane-cap-cop" class="form-control" value="0" min="0">
                            </div>
                            <div class="form-group" style="margin-bottom: 0; grid-column: span 2;">
                                <label>Aeronave Activa (Estado)</label>
                                <select id="plane-status" class="form-control">
                                    <option value="Operativa">Operativa</option>
                                    <option value="AOG">AOG (Mantenimiento)</option>
                                    <option value="No operativa">No operativa</option>
                                </select>
                            </div>
                            <div class="form-group" style="grid-column: span 2; margin-bottom: 0;">
                                <label>Foto de la Aeronave</label>
                                <input type="file" id="plane-photo" class="form-control" style="padding: 0.5rem;">
                            </div>
                        </div>

                        <div style="margin-top: 1.5rem;">
                            <button class="btn btn-primary" id="btn-create-plane" style="width: 100%; padding: 0.75rem;"><i class="fas fa-plane"></i> Crear Aeronave</button>
                        </div>
                    </div>

                    <!-- Lista -->
                    <div class="card">
                        <h3>Aeronaves Activas</h3>
                        <table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem; margin-top: 1rem;">
                            <thead>
                                <tr style="border-bottom: 1px solid var(--border-color); background: var(--bg-surface-hover);">
                                    <th style="padding: 1rem;">Matrícula</th>
                                    <th style="padding: 1rem;">Modelo</th>
                                    <th style="padding: 1rem;">Capacidad</th>
                                    <th style="padding: 1rem;">Estado</th>
                                    <th style="padding: 1rem; text-align: center;">Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="table-plane">
                                <!-- Dynamic rows -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- 5. Creación de Usuarios                        -->
            <!-- ============================================== -->
            <div id="content-usuarios" class="settings-content" style="display: none;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                    
                    <!-- Formulario Nuevo Usuario -->
                    <div class="card">
                        <h3>Registrar Nuevo Usuario</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Completa los datos y asigna los módulos de acceso permitidos.</p>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                            <div class="form-group" style="margin-bottom: 0;"><label for="usr-username">Usuario *</label><input type="text" id="usr-username" class="form-control" placeholder="Ej: operador01"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label for="usr-name">Nombre Completo *</label><input type="text" id="usr-name" class="form-control" placeholder="Nombre"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label for="usr-cedula">Cédula *</label><input type="text" id="usr-cedula" class="form-control" placeholder="Ej: 1020304050"></div>
                            <div class="form-group" style="margin-bottom: 0;"><label for="usr-phone">Celular</label><input type="tel" id="usr-phone" class="form-control" placeholder="Ej: 3001234567"></div>
                            <div class="form-group" style="grid-column: span 2; margin-bottom: 0;"><label for="usr-email">Correo</label><input type="email" id="usr-email" class="form-control" placeholder="correo@ejemplo.com"></div>

                            <div id="usr-default-pass-info" style="grid-column: span 2; background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.75rem 0.95rem; font-size: 0.82rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.6rem;">
                                <i class="fas fa-key" style="color: var(--brand-action); font-size: 1rem; flex-shrink: 0;"></i>
                                <span><strong>Contraseña inicial automática:</strong> Se asignará por defecto con el número de cédula acompañado de <code>Fp*</code> y deberá cambiarse en el primer inicio de sesión.</span>
                            </div>

                            <!-- Solo visible al editar un usuario existente (nunca al registrar nuevo usuario) -->
                            <div id="usr-edit-password-fields" style="display: none; grid-column: span 2;">
                                <div class="form-group" style="margin-bottom: 0.75rem;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                                        <label for="usr-pass" style="margin: 0;">Nueva Contraseña (opcional al editar)</label>
                                        <button type="button" id="btn-generate-secure-pass" style="font-size: 0.75rem; font-weight: 700; color: var(--brand-action); padding: 0; background: none; border: none; cursor: pointer;" title="Generar contraseña segura automáticamente">
                                            <i class="fas fa-magic"></i> Generar
                                        </button>
                                    </div>
                                    <div style="position: relative; display: flex; align-items: center;">
                                        <input type="password" id="usr-pass" class="form-control" placeholder="Mín. 8 chars (Aa1!)" autocomplete="new-password" style="padding-right: 2.5rem;">
                                        <button type="button" id="btn-toggle-usr-pass" aria-label="Mostrar contraseña" style="position: absolute; right: 0.6rem; color: var(--text-muted); width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 6px;">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <div id="usr-pass-security-box" style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 10px; padding: 0.85rem 1rem;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.45rem; font-size: 0.8rem;">
                                        <strong style="color: var(--text-primary);"><i class="fas fa-shield-alt" style="color: var(--brand-action);"></i> Factor de Seguridad de Contraseña</strong>
                                        <span id="usr-pass-strength-label" style="font-weight: 700; color: var(--text-muted);">Sin ingresar</span>
                                    </div>
                                    <div style="width: 100%; height: 6px; border-radius: 999px; background: var(--border-color); overflow: hidden; margin-bottom: 0.65rem;">
                                        <div id="usr-pass-strength-bar" style="width: 0%; height: 100%; background: var(--text-muted); transition: width 0.25s ease, background-color 0.25s ease;"></div>
                                    </div>
                                    <div id="usr-pass-checklist" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(175px, 1fr)); gap: 0.35rem 0.75rem; font-size: 0.78rem; color: var(--text-secondary);">
                                        <span id="rule-len"><i class="far fa-circle"></i> Mínimo 8 caracteres</span>
                                        <span id="rule-upper"><i class="far fa-circle"></i> Letra mayúscula (A-Z)</span>
                                        <span id="rule-lower"><i class="far fa-circle"></i> Letra minúscula (a-z)</span>
                                        <span id="rule-num"><i class="far fa-circle"></i> Número (0-9)</span>
                                        <span id="rule-spec"><i class="far fa-circle"></i> Carácter especial (!@#$...)</span>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group" style="grid-column: span 2; margin-bottom: 0;"><label>Foto (URL o Archivo)</label><input type="file" id="usr-photo" class="form-control" style="padding: 0.5rem;" accept="image/*"></div>
                        </div>

                        <h4 style="margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.5rem;">Rol y Accesos</h4>
                        <div class="form-group">
                            <label>Rol del Usuario</label>
                            <select id="usr-role" class="form-control">
                                <option>Administrador</option>
                                <option>Asesor de Ventas</option>
                                <option>Operaciones</option>
                            </select>
                        </div>
                        
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; flex-wrap: wrap; gap: 0.5rem;">
                            <label style="font-weight: 600; margin: 0;">Módulos Permitidos:</label>
                            <div style="display: flex; gap: 0.5rem;">
                                <button type="button" id="btn-usr-mods-all" style="font-size: 0.76rem; font-weight: 600; color: var(--brand-action); background: none; border: none; cursor: pointer; padding: 0;">Marcar todos</button>
                                <span style="color: var(--text-muted); font-size: 0.76rem;">|</span>
                                <button type="button" id="btn-usr-mods-none" style="font-size: 0.76rem; font-weight: 600; color: var(--text-secondary); background: none; border: none; cursor: pointer; padding: 0;">Desmarcar todos</button>
                            </div>
                        </div>
                        <div id="usr-allowed-modules-grid" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/flota" checked style="accent-color: var(--brand-action);"> Asignación de Flota</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/asignacion" checked style="accent-color: var(--brand-action);"> Asignación de Recursos</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/caja" checked style="accent-color: var(--brand-action);"> Caja Menor</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/checkin" checked style="accent-color: var(--brand-action);"> Check-in</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/configuracion" checked style="accent-color: var(--brand-action);"> Configuración</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/historial" checked style="accent-color: var(--brand-action);"> Consulta Historial</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/dashboard" checked style="accent-color: var(--brand-action);"> Dashboard</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/facturacion" checked style="accent-color: var(--brand-action);"> Facturación</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/generar-factura" checked style="accent-color: var(--brand-action);"> Generar Factura</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/" checked style="accent-color: var(--brand-action);"> Itinerario (Inicio)</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/inventario" checked style="accent-color: var(--brand-action);"> Inventario</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/manifiesto" checked style="accent-color: var(--brand-action);"> Manifiesto</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/fids" checked style="accent-color: var(--brand-action);"> Pantalla FIDS</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/autogestion" checked style="accent-color: var(--brand-action);"> Portal Autogestión</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/b2c" checked style="accent-color: var(--brand-action);"> Portal B2C (Cliente)</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/registro-salto" checked style="accent-color: var(--brand-action);"> Registro de Salto</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/reservas" checked style="accent-color: var(--brand-action);"> Reservas</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/rrhh" checked style="accent-color: var(--brand-action);"> RRHH y Tiempos</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/tienda" checked style="accent-color: var(--brand-action);"> Ventas Tienda</label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;"><input type="checkbox" class="usr-module-chk" data-route="/videografia" checked style="accent-color: var(--brand-action);"> Videografía</label>
                        </div>

                        <div style="margin-top: 1.5rem;">
                            <button class="btn btn-primary" id="btn-create-usr" style="width: 100%; padding: 0.75rem;"><i class="fas fa-save"></i> Crear Usuario</button>
                        </div>
                    </div>

                    <!-- Lista de Usuarios -->
                    <div class="card">
                        <h3>Usuarios Activos</h3>
                        <div style="overflow-x: auto; margin-top: 1rem;">
                            <table class="crud-table" style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.95rem;">
                                <thead>
                                    <tr style="border-bottom: 1px solid var(--border-color); background: var(--bg-surface-hover);">
                                        <th style="padding: 1rem;">Nombre</th>
                                        <th style="padding: 1rem;">Usuario</th>
                                        <th style="padding: 1rem;">Rol</th>
                                        <th style="padding: 1rem; text-align: center;">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="table-usr"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- ============================================== -->
            <!-- 6. Backup de Datos                             -->
            <!-- ============================================== -->
            <div id="content-backup" class="card settings-content" style="display: none;">
                <h3>Copias de Seguridad (Backup)</h3>
                <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Configura el envío automático de la base de datos a tu correo electrónico.</p>
                
                <div style="margin-top: 1rem; display: flex; flex-direction: column; gap: 1rem; max-width: 500px;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Correo Electrónico Destino</label>
                        <input type="email" id="backup-email" class="form-control" placeholder="admin@fraterno.com">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Frecuencia de Envío</label>
                        <select id="backup-freq" class="form-control">
                            <option value="diario">Diario</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensual">Mensual</option>
                        </select>
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Hora de Envío</label>
                        <input type="time" id="backup-time" class="form-control" value="23:00">
                    </div>
                </div>
                
                <div style="margin-top: 2rem; display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button class="btn btn-primary" id="btn-save-backup"><i class="fas fa-save"></i> Guardar Configuración</button>
                    <button class="btn" id="btn-force-backup" style="background: var(--brand-success); color: white;"><i class="fas fa-cloud-download-alt"></i> Forzar Backup Ahora</button>
                </div>

                ${isMasterAdminSession ? `
                <div id="reset-system-zone" style="margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px dashed var(--border-color);">
                    <h4 style="color: var(--brand-danger); margin-bottom: 0.5rem;"><i class="fas fa-exclamation-triangle"></i> Zona de Reinicio (Entorno de Pruebas)</h4>
                    <p style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem;">Elimina todos los pasajeros, reservas, aeronaves, empleados, inventario, caja, facturas y ventas de prueba, dejando el sistema completamente en blanco (solo se conserva el usuario <strong>admin01</strong>).</p>
                    <button class="btn btn-danger" id="btn-reset-system-blank"><i class="fas fa-trash-restore"></i> Restablecer Sistema en Blanco</button>
                </div>
                ` : ''}
            </div>



            <!-- ============================================== -->
            <!-- 7. Fechas NO Operación                         -->
            <!-- ============================================== -->
            <div id="content-noop" class="settings-content" style="display: none;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 1.5rem;">
                    
                    <div class="card">
                        <h3 style="color: var(--brand-danger);"><i class="fas fa-calendar-times"></i> Días de la Semana Cerrados</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Selecciona los días que, por defecto, la empresa NO tiene operación (ej. todos los lunes y martes).</p>
                        
                        <div style="display: flex; flex-direction: column; gap: 0.5rem; background: var(--bg-main); padding: 1rem; border-radius: 8px;">
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="1"> Lunes
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="2"> Martes
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="3"> Miércoles
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="4"> Jueves
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="5"> Viernes
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="6"> Sábado
                            </label>
                            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" class="noop-day" value="0"> Domingo
                            </label>
                        </div>
                        <button class="btn btn-primary" id="btn-save-noop-days" style="margin-top: 1rem; width: 100%;">Guardar Días</button>
                    </div>

                    <div class="card">
                        <h3 style="color: var(--brand-danger);"><i class="fas fa-calendar-day"></i> Fechas Específicas Cerradas</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 1rem; font-size: 0.9rem;">Bloquea fechas exactas (DD/MM/AAAA) por mantenimientos, festivos especiales, etc.</p>
                        
                        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem;">
                            <input type="date" id="noop-specific-date" class="form-control" style="flex: 1;">
                            <button class="btn btn-primary" id="btn-add-noop-date"><i class="fas fa-plus"></i> Bloquear</button>
                        </div>

                        <h4 style="margin-bottom: 0.5rem; font-size: 0.95rem;">Fechas Bloqueadas</h4>
                        <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 8px; max-height: 250px; overflow-y: auto;">
                            <table class="data-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                                <thead>
                                    <tr style="background: var(--bg-surface); border-bottom: 2px solid var(--border-color);">
                                        <th style="padding: 0.75rem;">Fecha (AAAA-MM-DD)</th>
                                        <th style="padding: 0.75rem; text-align: center;">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody id="table-noop-dates">
                                    <!-- Dynamic rows -->
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>


        `;
    },
    
    init: () => {
        function escapeHTML(str) {
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
        
        // Usuario Admin Master (admin01) siempre oculto y protegido por seguridad en Usuarios Activos
        function isHiddenMasterAdmin(u) {
            if (!u) return false;
            const uname = String(u.username || '').trim().toLowerCase();
            const uid = String(u.id || '').trim().toLowerCase();
            const name = String(u.name || '').trim().toLowerCase();
            return uname === 'admin01' || uid === 'usr_admin' || name === 'admin master';
        }

        window.renderUsersTable = function() {
            const tbody = document.getElementById('table-usr');
            if (!tbody) return;
            tbody.innerHTML = '';
            const users = (window.AppData.users || []).filter(u => !isHiddenMasterAdmin(u));
            if (users.length === 0) {
                const emptyTr = document.createElement('tr');
                emptyTr.innerHTML = `
                    <td colspan="4" style="padding: 1.5rem; text-align: center; color: var(--text-muted); font-style: italic;">
                        No hay usuarios adicionales registrados.
                    </td>
                `;
                tbody.appendChild(emptyTr);
                return;
            }
            users.forEach(u => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = `
                    <td style="padding: 1rem; font-weight: 500;">${escapeHTML(u.name)}</td>
                    <td style="padding: 1rem;">${escapeHTML(u.username)}</td>
                    <td style="padding: 1rem;">${escapeHTML(u.role)}</td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit" data-id="${escapeHTML(u.id)}" style="color: var(--brand-action); padding: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" data-id="${escapeHTML(u.id)}" style="color: var(--brand-danger); padding: 0.25rem;"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        };
        window.renderUsersTable();

        // =====================================
        // Tabs Logic
        // =====================================
        const tabsContainer = document.getElementById('settings-tabs');
        const tabs = tabsContainer.querySelectorAll('button');
        const contents = document.querySelectorAll('.settings-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => {
                    t.classList.remove('btn-primary');
                    t.style.background = 'var(--bg-surface-hover)';
                    t.style.color = 'var(--text-primary)';
                });
                contents.forEach(c => c.style.display = 'none');
                tab.classList.add('btn-primary');
                tab.style.background = '';
                tab.style.color = '';
                const target = tab.getAttribute('data-target');
                document.getElementById('content-' + target).style.display = 'block';
            });
        });

        // =====================================
        // Currency Formatting Helper
        // =====================================
        function formatCurrency(val) {
            let num = val.replace(/\D/g, ''); // strip non digits
            if (num === '') return '';
            return parseInt(num).toLocaleString('es-CO');
        }

        const priceInputs = document.querySelectorAll('.price-input');
        priceInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                e.target.value = formatCurrency(e.target.value);
            });
        });

        // =====================================
        // Global CRUD Action Delegation (Edit/Delete/View)
        // =====================================
        document.querySelectorAll('.crud-table').forEach(table => {
            table.addEventListener('click', async (e) => {
                const btnDelete = e.target.closest('.btn-delete');
                const btnEdit = e.target.closest('.btn-edit');
                const btnViewServices = e.target.closest('.btn-view-services');
                
                if (btnDelete) {
                    const ok = window.showConfirm ? await window.showConfirm('¿Estás seguro de que deseas eliminar este registro?', { title: 'Eliminar Registro', type: 'danger' }) : confirm('¿Estás seguro de que deseas eliminar este registro?');
                    if (ok) {
                        const tr = btnDelete.closest('tr');
                        const tbody = tr.closest('tbody');
                        if (tbody && tbody.id === 'table-usr') {
                            const id = btnDelete.getAttribute('data-id');
                            if (id) {
                                const idx = window.AppData.users.findIndex(u => u.id === id);
                                if (idx !== -1) {
                                    const targetDelUser = window.AppData.users[idx];
                                    if (isHiddenMasterAdmin(targetDelUser)) {
                                        if (window.showAlert) window.showAlert('Esta cuenta está protegida por seguridad y no puede eliminarse.', { type: 'danger', title: 'Acción Protegida' });
                                        return;
                                    }
                                    window.AppData.deletedUserIds = Array.isArray(window.AppData.deletedUserIds) ? window.AppData.deletedUserIds : [];
                                    if (!window.AppData.deletedUserIds.includes(id)) {
                                        window.AppData.deletedUserIds.push(id);
                                    }
                                    window.AppData.users.splice(idx, 1);
                                    if (window.saveAppData) await window.saveAppData();
                                }
                            }
                            if (window.renderUsersTable) window.renderUsersTable();
                            return;
                        }
                        tr.remove();
                    }
                }
                
                if (btnEdit && !btnViewServices) {
                    const tr = btnEdit.closest('tr');
                    const tbody = btnEdit.closest('tbody');
                    if (tbody && tbody.id === 'table-usr') {
                        const editId = btnEdit.getAttribute('data-id');
                        const targetUsr = (window.AppData.users || []).find(u => u.id === editId);
                        if (isHiddenMasterAdmin(targetUsr)) {
                            if (window.showAlert) window.showAlert('Esta cuenta está protegida por seguridad.', { type: 'danger', title: 'Acción Protegida' });
                            return;
                        }
                        const nameInput = document.getElementById('usr-name');
                        const userInput = document.getElementById('usr-username');
                        const cedulaInput = document.getElementById('usr-cedula');
                        const phoneInput = document.getElementById('usr-phone');
                        const emailInput = document.getElementById('usr-email');
                        const roleSelect = document.getElementById('usr-role');
                        const editPassBox = document.getElementById('usr-edit-password-fields');
                        const defaultPassInfo = document.getElementById('usr-default-pass-info');
                        
                        if (nameInput) nameInput.value = targetUsr ? (targetUsr.name || '') : tr.cells[0].innerText.trim();
                        if (userInput) userInput.value = targetUsr ? (targetUsr.username || '') : tr.cells[1].innerText.trim();
                        if (cedulaInput) cedulaInput.value = targetUsr ? (targetUsr.cedula || '') : '';
                        if (phoneInput) phoneInput.value = targetUsr ? (targetUsr.phone || '') : '';
                        if (emailInput) emailInput.value = targetUsr ? (targetUsr.email || '') : '';
                        if (editPassBox) editPassBox.style.display = 'block';
                        if (defaultPassInfo) defaultPassInfo.style.display = 'none';
                        if (roleSelect) {
                            const roleTxt = targetUsr ? (targetUsr.role || '') : (tr.cells && tr.cells[2] ? tr.cells[2].innerText.trim() : '');
                            for (let i = 0; i < roleSelect.options.length; i++) {
                                if (roleSelect.options[i].text === roleTxt || roleSelect.options[i].value === roleTxt) {
                                    roleSelect.selectedIndex = i;
                                    break;
                                }
                            }
                        }

                        // Precargar módulos permitidos del usuario a editar
                        document.querySelectorAll('.usr-module-chk').forEach(chk => {
                            const r = chk.getAttribute('data-route');
                            if (targetUsr && Array.isArray(targetUsr.allowedRoutes)) {
                                chk.checked = targetUsr.allowedRoutes.includes(r);
                            } else {
                                chk.checked = true;
                            }
                        });
                        
                        if (nameInput) {
                            const btnCreate = document.getElementById('btn-create-usr');
                            if (btnCreate) {
                                btnCreate.dataset.editId = btnEdit.getAttribute('data-id');
                                btnCreate.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
                            }
                            const formContainer = nameInput.closest('.card');
                            if (formContainer) {
                                formContainer.scrollIntoView({ behavior: 'smooth' });
                                formContainer.style.transition = 'border 0.3s ease, box-shadow 0.3s ease';
                                formContainer.style.border = '2px solid var(--brand-action)';
                                formContainer.style.boxShadow = '0 0 10px rgba(69, 220, 248, 0.3)';
                                setTimeout(() => { 
                                    formContainer.style.border = '1px solid var(--border-color)'; 
                                    formContainer.style.boxShadow = 'var(--shadow-sm)';
                                }, 1500);
                            }
                        }
                    } else {
                        alert('Función de edición habilitada. Haz los cambios en el formulario (Modo Demo).');
                    }
                }

                if (btnViewServices) {
                    const services = btnViewServices.getAttribute('data-services');
                    const tr = btnViewServices.closest('tr');
                    let name = 'Instructor';
                    let lastname = '';
                    
                    if (tr.cells.length >= 3) {
                        name = tr.cells[1].innerText.trim();
                        lastname = tr.cells[2].innerText.trim();
                    }

                    const servicesList = (services && services.trim()) ? services.split(',') : [];
                    const servicesHtml = servicesList.length > 0 
                        ? servicesList.map(s => `<li style="background: var(--bg-surface-hover); padding: 0.75rem 1rem; border-radius: 6px; font-weight: 500; border-left: 4px solid var(--brand-action);"><i class="fas fa-check-circle" style="color: var(--brand-success); margin-right: 0.5rem;"></i>${s.trim()}</li>`).join('')
                        : `<li style="background: var(--bg-surface-hover); padding: 0.75rem 1rem; border-radius: 6px; font-weight: 500; color: var(--text-secondary);">Ningún servicio habilitado</li>`;

                    const modalHtml = `
                        <div id="inst-services-modal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 99999; opacity: 0; transition: opacity 0.3s ease;">
                            <div style="background: var(--bg-surface); padding: 2rem; border-radius: 12px; max-width: 400px; width: 90%; box-shadow: 0 10px 25px rgba(0,0,0,0.2); transform: translateY(-20px); transition: transform 0.3s ease;">
                                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1.5rem;">
                                    <h3 style="margin: 0; font-size: 1.25rem;">Servicios de Instructor</h3>
                                    <button id="close-inst-modal" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-secondary);">&times;</button>
                                </div>
                                <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
                                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--brand-blue), var(--brand-blue-light)); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.5rem; font-weight: bold;">
                                        ${escapeHTML(name.charAt(0))}${lastname ? escapeHTML(lastname.charAt(0)) : ''}
                                    </div>
                                    <div>
                                        <h4 style="margin: 0; font-size: 1.1rem;">${escapeHTML(name)} ${escapeHTML(lastname)}</h4>
                                        <span style="font-size: 0.9rem; color: var(--text-secondary);">Instructor Activo</span>
                                    </div>
                                </div>
                                <div>
                                    <h5 style="margin-top: 0; margin-bottom: 0.5rem; color: var(--text-secondary); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 0.5px;">Servicios Habilitados</h5>
                                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; max-height: 250px; overflow-y: auto;">
                                        ${servicesHtml}
                                    </ul>
                                </div>
                                <div style="margin-top: 2rem; text-align: right;">
                                    <button class="btn btn-primary" id="btn-ok-inst-modal" style="width: 100%;">Cerrar</button>
                                </div>
                            </div>
                        </div>
                    `;
                    
                    document.body.insertAdjacentHTML('beforeend', modalHtml);
                    
                    const modal = document.getElementById('inst-services-modal');
                    const modalContent = modal.querySelector('div');
                    
                    // Animate in
                    setTimeout(() => {
                        modal.style.opacity = '1';
                        modalContent.style.transform = 'translateY(0)';
                    }, 10);
                    
                    const closeModal = () => {
                        modal.style.opacity = '0';
                        modalContent.style.transform = 'translateY(-20px)';
                        setTimeout(() => modal.remove(), 300);
                    };
                    
                    document.getElementById('close-inst-modal').addEventListener('click', closeModal);
                    document.getElementById('btn-ok-inst-modal').addEventListener('click', closeModal);
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) closeModal();
                    });
                }
            });
        });

        // =====================================
        // Save Prices Logic (Protected by TariffGuard)
        // =====================================
        function renderValoresSecurityUI() {
            if (window.TariffGuard) window.TariffGuard.ensureVersionMetadata();
            const ver = window.AppData?.maestroValoresVersion || 1;
            const history = window.AppData?.maestroValoresHistory || [];
            const latest = history[history.length - 1];
            const totalPax = (window.AppData?.passengers || []).length;
            const totalPackers = (window.AppData?.packerBilling || []).length;
            const totalFacturas = (window.AppData?.facturas || []).length;

            const lastUpdateText = (latest && latest.effectiveFrom && latest.effectiveFrom !== '1970-01-01T00:00:00.000Z')
                ? `${new Date(latest.effectiveFrom).toLocaleString('es-CO')} por ${escapeHTML(latest.updatedBy || 'Administrador')}`
                : 'Tarifa inicial del sistema';

            const banner = document.getElementById('maestro-security-banner');
            if (banner) {
                banner.innerHTML = `
                    <i class="fas fa-shield-alt" style="font-size: 1.4rem; color: #10b981; margin-top: 2px;"></i>
                    <div style="flex: 1;">
                        <div style="display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap;">
                            <strong style="color: var(--text-primary);">Protección Histórica de Tarifas Activa</strong>
                            <span id="maestro-version-badge" style="background: rgba(16, 185, 129, 0.18); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 999px; padding: 0.15rem 0.6rem; font-size: 0.8rem; font-weight: 700;">Tarifa Vigente v${ver}</span>
                            <span style="font-size: 0.8rem; color: var(--text-secondary);">Última vigencia: ${lastUpdateText}</span>
                        </div>
                        <p style="margin: 0.35rem 0 0 0; font-size: 0.85rem; color: var(--text-secondary); line-height: 1.45;">
                            Al actualizar cualquier valor, <strong>todos los registros anteriores (${totalPax} pasajero(s), ${totalPackers} empaque(s), ${totalFacturas} factura(s))</strong> permanecen inmutables con la tarifa vigente al momento de su registro. Los nuevos valores aplican <strong>exclusivamente a datos futuros</strong>.
                        </p>
                    </div>
                `;
            }

            const panel = document.getElementById('maestro-history-panel');
            if (panel) {
                if (history.length === 0) {
                    panel.innerHTML = `<p style="margin: 0; color: var(--text-secondary); font-size: 0.85rem;">Sin historial de cambios registrado.</p>`;
                } else {
                    const fmtCOP = (n) => '$' + (parseInt(n, 10) || 0).toLocaleString('es-CO');
                    const rows = [...history].reverse().map(h => {
                        const dateStr = (h.effectiveFrom && h.effectiveFrom !== '1970-01-01T00:00:00.000Z')
                            ? new Date(h.effectiveFrom).toLocaleString('es-CO')
                            : 'Inicio del sistema';
                        const changesHtml = (h.changes && h.changes.length > 0)
                            ? h.changes.map(c => {
                                const parts = [];
                                if (c.isNew) {
                                    parts.push(`Nuevo ítem (Venta: ${fmtCOP(c.newPrice)}, Staff: ${fmtCOP(c.newComision)})`);
                                } else {
                                    if (c.oldPrice !== c.newPrice) parts.push(`Venta: ${fmtCOP(c.oldPrice)} → ${fmtCOP(c.newPrice)}`);
                                    if (c.oldComision !== c.newComision) parts.push(`Staff: ${fmtCOP(c.oldComision)} → ${fmtCOP(c.newComision)}`);
                                }
                                return `<div style="font-size: 0.8rem;">• <strong>${escapeHTML(c.name)}</strong>: ${escapeHTML(parts.join(' | '))}</div>`;
                            }).join('')
                            : '<span style="color: var(--text-secondary); font-size: 0.8rem;">Tarifa base inicial</span>';
                        const prot = h.protectedCounts || { passengers: 0, packers: 0, facturas: 0 };
                        return `
                            <tr style="border-bottom: 1px solid var(--border-color);">
                                <td style="padding: 0.6rem; font-weight: 700;">v${h.version}</td>
                                <td style="padding: 0.6rem; font-size: 0.85rem;">${escapeHTML(dateStr)}</td>
                                <td style="padding: 0.6rem; font-size: 0.85rem;">${escapeHTML(h.updatedBy || 'Administrador')}</td>
                                <td style="padding: 0.6rem;">${changesHtml}</td>
                                <td style="padding: 0.6rem; font-size: 0.8rem; color: var(--text-secondary);">${prot.passengers || 0} pax / ${prot.packers || 0} emp. / ${prot.facturas || 0} fac.</td>
                            </tr>
                        `;
                    }).join('');
                    panel.innerHTML = `
                        <h4 style="margin: 0 0 0.75rem 0; font-size: 0.95rem;"><i class="fas fa-history"></i> Auditoría de Versiones del Maestro de Valores</h4>
                        <div style="overflow-x: auto;">
                            <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem;">
                                <thead>
                                    <tr style="border-bottom: 1px solid var(--border-color);">
                                        <th style="padding: 0.5rem;">Versión</th>
                                        <th style="padding: 0.5rem;">Vigencia Desde</th>
                                        <th style="padding: 0.5rem;">Usuario</th>
                                        <th style="padding: 0.5rem;">Cambios Aplicados (Solo Futuros)</th>
                                        <th style="padding: 0.5rem;">Registros Protegidos</th>
                                    </tr>
                                </thead>
                                <tbody>${rows}</tbody>
                            </table>
                        </div>
                    `;
                }
            }
        }

        const btnToggleTariffHistory = document.getElementById('btn-toggle-tariff-history');
        if (btnToggleTariffHistory) {
            btnToggleTariffHistory.addEventListener('click', () => {
                const panel = document.getElementById('maestro-history-panel');
                if (!panel) return;
                const isOpen = panel.style.display !== 'none';
                panel.style.display = isOpen ? 'none' : 'block';
                if (!isOpen) renderValoresSecurityUI();
            });
        }

        document.getElementById('btn-save-prices').addEventListener('click', async () => {
            if (window.TariffGuard) window.TariffGuard.ensureVersionMetadata();

            const priceInputs = document.querySelectorAll('#valores-grid .price-input');
            const comisionInputs = document.querySelectorAll('#valores-grid .comision-input');
            const proposedItems = (window.AppData.maestroValores || []).map(item => {
                const pInput = Array.from(priceInputs).find(i => i.dataset.name === item.name);
                const cInput = Array.from(comisionInputs).find(i => i.dataset.name === item.name);
                return {
                    name: item.name,
                    price: pInput ? pInput.value.replace(/\D/g, '') : String(item.price ?? '0'),
                    comision: cInput ? cInput.value.replace(/\D/g, '') : String(item.comision ?? '0')
                };
            });

            if (window.TariffGuard) {
                const diff = window.TariffGuard.computeDiff(window.AppData.maestroValores, proposedItems);
                if (diff.length === 0) {
                    if (window.showAlert) {
                        window.showAlert('No se detectaron cambios en los valores del Maestro.', { type: 'info', title: 'Sin Cambios' });
                    } else {
                        alert('No se detectaron cambios en los valores del Maestro.');
                    }
                    return;
                }

                const curVer = window.AppData.maestroValoresVersion || 1;
                const nextVer = curVer + 1;
                const paxCount = (window.AppData.passengers || []).length;
                const packerCount = (window.AppData.packerBilling || []).length;
                const facCount = (window.AppData.facturas || []).length;
                const previewLines = diff.slice(0, 5).map(c => {
                    const fmt = (n) => '$' + (parseInt(n, 10) || 0).toLocaleString('es-CO');
                    const parts = [];
                    if (c.oldPrice !== c.newPrice) parts.push(`Venta ${fmt(c.oldPrice)} → ${fmt(c.newPrice)}`);
                    if (c.oldComision !== c.newComision) parts.push(`Staff ${fmt(c.oldComision)} → ${fmt(c.newComision)}`);
                    return `• ${c.name}: ${parts.join(', ')}`;
                }).join('\n');
                const moreNote = diff.length > 5 ? `\n... y ${diff.length - 5} ítem(s) más.` : '';

                const confirmMsg =
                    `Se actualizarán ${diff.length} ítem(s) hacia la Tarifa v${nextVer}:\n${previewLines}${moreNote}\n\n` +
                    `SEGURIDAD HISTÓRICA:\n` +
                    `• ${paxCount} pasajero(s), ${packerCount} registro(s) de empaque y ${facCount} factura(s) anteriores quedarán bloqueados con la Tarifa v${curVer} sin ninguna modificación.\n` +
                    `• Los nuevos valores aplicarán únicamente para registros ingresados a partir de este momento.\n\n` +
                    `¿Desea aplicar la actualización de forma segura?`;

                const confirmed = window.showConfirm
                    ? await window.showConfirm(confirmMsg, { title: 'Confirmar Actualización Segura de Tarifas', type: 'warning' })
                    : confirm(confirmMsg);

                if (!confirmed) return;

                const result = window.TariffGuard.applyMaestroUpdate(proposedItems);
                renderValores();

                const successMsg = `Tarifa v${result.newVersion} guardada exitosamente. Toda la información y facturación anterior permanece intacta bajo las tarifas históricas; los nuevos precios solo aplicarán a registros futuros.`;
                if (window.showAlert) {
                    window.showAlert(successMsg, { type: 'success', title: `Maestro Actualizado (v${result.newVersion})` });
                } else {
                    alert(successMsg);
                }
                return;
            }

            // Fallback si TariffGuard no está cargado
            window.AppData.maestroValores = proposedItems;
            if (window.saveAppData) window.saveAppData();
            alert('Precios Base Globales guardados con éxito.');
        });
        
        document.getElementById('btn-create-valor').addEventListener('click', async () => {
            const newName = window.showPrompt
                ? await window.showPrompt('Ingrese el nombre del nuevo ítem para el Maestro de Valores:', { title: 'Crear Nuevo Ítem', placeholder: 'Ej: Salto Especial...' })
                : prompt('Nombre del nuevo ítem:');
            if (newName && newName.trim()) {
                const cleanName = newName.trim();
                const exists = (window.AppData.maestroValores || []).some(i => i.name.toLowerCase() === cleanName.toLowerCase());
                if (exists) {
                    if (window.showAlert) window.showAlert(`El ítem "${cleanName}" ya existe en el Maestro de Valores.`, { type: 'warning', title: 'Ítem Duplicado' });
                    else alert(`El ítem "${cleanName}" ya existe.`);
                    return;
                }
                if (window.TariffGuard) {
                    const updated = window.TariffGuard.cloneMaestro(window.AppData.maestroValores);
                    updated.push({ name: cleanName, price: '0', comision: '0' });
                    window.TariffGuard.applyMaestroUpdate(updated);
                } else {
                    window.AppData.maestroValores.push({ name: cleanName, price: '0', comision: '0' });
                    if (window.saveAppData) window.saveAppData();
                }
                renderValores();
            }
        });

        // =====================================
        // Dynamic Checklist Generation
        // =====================================
        const checklistContainer = document.getElementById('inst-services-checklist');
        const gridContainer = document.getElementById('valores-grid');

        // =====================================
        // Module Toggles Logic
        // =====================================
        function renderModulesToggles() {
            window.AppData.enabledModules = window.AppData.enabledModules || {};
            const modulesList = [
                { id: 'booking', name: 'Reservas y Booking' },
                { id: 'manifest', name: 'Manifiesto Operativo' },
                { id: 'fleet', name: 'Asignación de Flota' },
                { id: 'checkin', name: 'Check-In' },
                { id: 'finance', name: 'Caja Menor (Finanzas)' },
                { id: 'inventory', name: 'Inventario' },
                { id: 'hrms', name: 'Recursos Humanos' },
                { id: 'billing', name: 'Facturación' },
                { id: 'fids', name: 'Pantalla FIDS' },
                { id: 'passengerSearch', name: 'Búsqueda de Pasajeros' }
            ];

            const container = document.getElementById('modules-toggles-container');
            if (!container) return;
            container.innerHTML = '';
            
            modulesList.forEach(mod => {
                const isEnabled = window.AppData.enabledModules[mod.id] !== false; // true by default
                
                const card = document.createElement('div');
                card.style = 'background: var(--bg-surface-hover); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center;';
                card.innerHTML = `
                    <span style="font-weight: 500;">${mod.name}</span>
                    <label class="switch" style="position: relative; display: inline-block; width: 50px; height: 24px;">
                        <input type="checkbox" data-mod="${mod.id}" ${isEnabled ? 'checked' : ''} style="opacity: 0; width: 0; height: 0;">
                        <span class="slider round" style="position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: ${isEnabled ? 'var(--brand-success)' : '#ccc'}; transition: .4s; border-radius: 24px;">
                            <span style="position: absolute; content: ''; height: 18px; width: 18px; left: ${isEnabled ? '28px' : '3px'}; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%;"></span>
                        </span>
                    </label>
                `;
                
                // Add event listener directly to the checkbox
                const checkbox = card.querySelector('input');
                const slider = card.querySelector('.slider');
                const knob = slider.querySelector('span');
                
                checkbox.addEventListener('change', (e) => {
                    const checked = e.target.checked;
                    window.AppData.enabledModules[mod.id] = checked;
                    slider.style.backgroundColor = checked ? 'var(--brand-success)' : '#ccc';
                    knob.style.left = checked ? '28px' : '3px';
                    if (window.saveAppData) window.saveAppData();
                });

                container.appendChild(card);
            });
        }
        
        function renderValores() {
            if (window.TariffGuard) {
                window.TariffGuard.ensureVersionMetadata();
            }
            if (!window.AppData.maestroValores) {
                window.AppData.maestroValores = [
                    {name: 'Valor KG Extra', price: '5.000', comision: '0'}, {name: 'Salto Tandem', price: '1.500.000', comision: '0'},
                    {name: 'Fun Jumper', price: '0', comision: '0'}, {name: 'Copiloto', price: '0', comision: '0'},
                    {name: 'Salto AFF', price: '0', comision: '0'}, {name: 'Salto AFF 1', price: '0', comision: '0'}, {name: 'Salto AFF 2', price: '0', comision: '0'},
                    {name: 'Cámara Externa', price: '250.000', comision: '0'}, {name: 'Cámara Go-Pro', price: '100.000', comision: '0'},
                    {name: 'Cámara 360', price: '150.000', comision: '0'}, {name: 'Empaque Tandem', price: '0', comision: '0'}, {name: 'Empaque Escuela', price: '0', comision: '0'}, {name: 'Teoría AFF', price: '0', comision: '0'},
                    {name: 'Hora de Teoría', price: '0', comision: '0'}, {name: 'Coach', price: '0', comision: '0'}, {name: 'Curso de Empaque', price: '0', comision: '0'},
                    {name: 'Empaque de Reserva', price: '0', comision: '0'}, {name: 'Curso Control Cúpula', price: '0', comision: '0'},
                    {name: 'Acompañamiento Examen Licencia', price: '0', comision: '0'}, {name: 'Curso Aterrizajes en Agua', price: '0', comision: '0'},
                    {name: 'Alquiler de equipo', price: '0', comision: '0'}
                ];
            }
            
            let hasChanges = false;
            window.AppData.maestroValores.forEach(item => {
                if (item.name === 'Honorario Salto Tandem') {
                    item.name = 'Salto Tandem';
                    hasChanges = true;
                }
            });
            
            // Add Fun Jumper if missing
            const hasFunJumper = window.AppData.maestroValores.some(i => i.name === 'Fun Jumper');
            if (!hasFunJumper) {
                window.AppData.maestroValores.push({name: 'Fun Jumper', price: '0', comision: '0'});
                hasChanges = true;
            }
            // Add Copiloto if missing
            const hasCopiloto = window.AppData.maestroValores.some(i => i.name === 'Copiloto');
            if (!hasCopiloto) {
                window.AppData.maestroValores.push({name: 'Copiloto', price: '0', comision: '0'});
                hasChanges = true;
            }
            
            if (hasChanges && window.saveAppData) window.saveAppData();
            
            // Sort alphabetically
            window.AppData.maestroValores.sort((a, b) => a.name.localeCompare(b.name));
            renderValoresSecurityUI();
            
            if (gridContainer) {
                let html = '';
                window.AppData.maestroValores.forEach(item => {
                    const safeName = escapeHTML(item.name);
                    const formattedPrice = item.price ? parseInt(item.price.toString().replace(/\D/g, '') || 0).toLocaleString('es-CO') : '0';
                    const formattedComision = item.comision ? parseInt(item.comision.toString().replace(/\D/g, '') || 0).toLocaleString('es-CO') : '0';
                    html += `
                        <div class="form-group" style="background: var(--bg-surface); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 0.5rem;">
                            <label style="font-weight: 600; font-size: 1.05rem;">${safeName}</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                                <div>
                                    <label style="font-size: 0.8rem; color: var(--text-secondary);">Precio Venta</label>
                                    <input type="text" class="form-control price-input money-input" data-name="${safeName}" value="${formattedPrice}">
                                </div>
                                <div>
                                    <label style="font-size: 0.8rem; color: var(--text-secondary);">Honorarios Staff</label>
                                    <input type="text" class="form-control comision-input money-input" data-name="${safeName}" value="${formattedComision}">
                                </div>
                            </div>
                        </div>
                    `;
                });
                gridContainer.innerHTML = html;
                
                // Re-attach currency formatting
                document.querySelectorAll('#valores-grid .money-input').forEach(input => {
                    input.addEventListener('input', (e) => {
                        e.target.value = formatCurrency(e.target.value);
                    });
                });
            }
            
            if (checklistContainer) {
                
                let chkHtml = '';
                window.AppData.maestroValores.forEach(item => {
                    const safeName = escapeHTML(item.name);
                    chkHtml += `
                        <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                            <input type="checkbox" value="${safeName}"> ${safeName}
                        </label>
                    `;
                });
                checklistContainer.innerHTML = chkHtml;

            }
        }
        
        renderValores();



        // =====================================
        // 2. Create Schedule
        // =====================================
        const btnCreateSch = document.getElementById('btn-create-sch');
        if (btnCreateSch) {
            btnCreateSch.addEventListener('click', () => {
                const time = document.getElementById('sch-time').value;
                const cap = document.getElementById('sch-cap').value;

                if (!time) return alert('La hora es obligatoria.');

                const tbody = document.getElementById('table-sch');
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                
                // Format time (e.g. 14:00 -> 02:00 PM)
                let hour = parseInt(time.split(':')[0]);
                let min = time.split(':')[1];
                let ampm = hour >= 12 ? 'PM' : 'AM';
                hour = hour % 12;
                hour = hour ? hour : 12;
                let timeStr = `${hour.toString().padStart(2, '0')}:${min} ${ampm}`;

                tr.innerHTML = `
                    <td style="padding: 1rem; font-weight: 600;">${escapeHTML(timeStr)}</td>
                    <td style="padding: 1rem;">${escapeHTML(cap)} cupos</td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit" style="color: var(--brand-action); padding: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete" style="color: var(--brand-danger); padding: 0.25rem;"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);

                document.getElementById('sch-time').value = '';
                alert('Franja creada con éxito.');
            });
        }



        const usrPhotoInput = document.getElementById('usr-photo');
        if (usrPhotoInput) {
            usrPhotoInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(evt) {
                        usrPhotoInput.dataset.base64 = evt.target.result;
                    };
                    reader.readAsDataURL(file);
                } else {
                    usrPhotoInput.dataset.base64 = '';
                }
            });
        }
        
        // =====================================
        // 4. Create User (con Factor de Seguridad de Contraseña)
        // =====================================
        const usrPassInput = document.getElementById('usr-pass');
        const btnToggleUsrPass = document.getElementById('btn-toggle-usr-pass');
        const btnGenUsrPass = document.getElementById('btn-generate-secure-pass');

        function updatePasswordSecurityUI(pwdValue) {
            if (!window.PasswordPolicy) return;
            const res = window.PasswordPolicy.evaluate(pwdValue);
            const bar = document.getElementById('usr-pass-strength-bar');
            const lbl = document.getElementById('usr-pass-strength-label');
            if (bar) {
                bar.style.width = `${(res.score / res.maxScore) * 100}%`;
                bar.style.background = res.color;
            }
            if (lbl) {
                lbl.textContent = pwdValue ? `${res.level} (${res.score}/${res.maxScore})` : 'Sin ingresar';
                lbl.style.color = res.color;
            }

            const ruleNodes = [
                { id: 'rule-len', ok: res.rules.minLength, text: 'Mínimo 8 caracteres' },
                { id: 'rule-upper', ok: res.rules.hasUpper, text: 'Letra mayúscula (A-Z)' },
                { id: 'rule-lower', ok: res.rules.hasLower, text: 'Letra minúscula (a-z)' },
                { id: 'rule-num', ok: res.rules.hasNumber, text: 'Número (0-9)' },
                { id: 'rule-spec', ok: res.rules.hasSpecial, text: 'Carácter especial (!@#$...)' }
            ];
            ruleNodes.forEach(r => {
                const el = document.getElementById(r.id);
                if (!el) return;
                el.style.color = r.ok ? 'var(--brand-success)' : (pwdValue ? 'var(--brand-danger)' : 'var(--text-secondary)');
                el.style.fontWeight = r.ok ? '600' : '400';
                el.innerHTML = `<i class="${r.ok ? 'fas fa-check-circle' : (pwdValue ? 'fas fa-times-circle' : 'far fa-circle')}"></i> ${r.text}`;
            });
        }

        if (usrPassInput) {
            usrPassInput.addEventListener('input', (e) => updatePasswordSecurityUI(e.target.value));
        }
        if (btnToggleUsrPass && usrPassInput) {
            btnToggleUsrPass.addEventListener('click', () => {
                const isText = usrPassInput.type === 'text';
                usrPassInput.type = isText ? 'password' : 'text';
                btnToggleUsrPass.innerHTML = `<i class="fas ${isText ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
            });
        }
        if (btnGenUsrPass && usrPassInput && window.PasswordPolicy) {
            btnGenUsrPass.addEventListener('click', () => {
                usrPassInput.value = window.PasswordPolicy.generateSecurePassword(12);
                usrPassInput.type = 'text';
                if (btnToggleUsrPass) btnToggleUsrPass.innerHTML = '<i class="fas fa-eye-slash"></i>';
                updatePasswordSecurityUI(usrPassInput.value);
            });
        }

        function showNewUserCredentialsModal(username, password, fullName) {
            const existing = document.getElementById('modal-new-user-credentials');
            if (existing) existing.remove();

            const overlay = document.createElement('div');
            overlay.id = 'modal-new-user-credentials';
            overlay.className = 'modal-overlay';
            overlay.style.cssText = 'position: fixed; inset: 0; background: rgba(12, 35, 49, 0.72); backdrop-filter: blur(4px); z-index: 10040; display: flex; justify-content: center; align-items: center; padding: 1rem;';

            const safeUser = escapeHTML(username);
            const safePass = escapeHTML(password);
            const safeName = escapeHTML(fullName || username);

            overlay.innerHTML = `
                <div style="background: var(--bg-surface); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 16px; width: 100%; max-width: 460px; box-shadow: 0 24px 60px rgba(0,0,0,0.35); padding: 1.75rem; position: relative;">
                    <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1rem;">
                        <div style="width: 46px; height: 46px; border-radius: 12px; background: rgba(16, 185, 129, 0.14); color: var(--brand-success); display: flex; align-items: center; justify-content: center; font-size: 1.35rem; flex-shrink: 0;">
                            <i class="fas fa-user-check"></i>
                        </div>
                        <div>
                            <h3 style="margin: 0; font-size: 1.15rem;">Usuario Creado con Éxito</h3>
                            <div style="font-size: 0.84rem; color: var(--text-secondary);">${safeName}</div>
                        </div>
                    </div>

                    <p style="font-size: 0.88rem; color: var(--text-secondary); margin: 0 0 1rem 0; line-height: 1.45;">
                        Se han generado las credenciales de acceso inicial. Al iniciar sesión por primera vez, el sistema solicitará el cambio obligatorio de contraseña.
                    </p>

                    <div style="background: var(--bg-surface-hover); border: 1px solid var(--border-color); border-radius: 12px; padding: 1rem 1.1rem; display: flex; flex-direction: column; gap: 0.8rem; margin-bottom: 1.25rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.65rem;">
                            <span style="font-size: 0.84rem; color: var(--text-secondary); font-weight: 600;"><i class="fas fa-user" style="color: var(--brand-action); margin-right: 0.35rem;"></i> Usuario</span>
                            <code id="new-user-modal-username" style="font-family: 'JetBrains Mono', monospace; font-size: 0.98rem; font-weight: 700; color: var(--text-primary); background: var(--bg-surface); padding: 0.25rem 0.6rem; border-radius: 6px; border: 1px solid var(--border-color);">${safeUser}</code>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; gap: 0.75rem;">
                            <span style="font-size: 0.84rem; color: var(--text-secondary); font-weight: 600;"><i class="fas fa-key" style="color: var(--brand-action); margin-right: 0.35rem;"></i> Contraseña</span>
                            <code id="new-user-modal-password" style="font-family: 'JetBrains Mono', monospace; font-size: 0.98rem; font-weight: 700; color: var(--brand-action); background: var(--bg-surface); padding: 0.25rem 0.6rem; border-radius: 6px; border: 1px solid var(--border-color);">${safePass}</code>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: flex-end; gap: 0.75rem; flex-wrap: wrap;">
                        <button type="button" class="btn btn-outline" id="btn-copy-new-user-creds"><i class="fas fa-copy"></i> Copiar Datos</button>
                        <button type="button" class="btn btn-primary" id="btn-close-new-user-creds"><i class="fas fa-check"></i> Aceptar</button>
                    </div>
                </div>
            `;

            document.body.appendChild(overlay);

            const close = () => { if (overlay.parentNode) overlay.remove(); };
            const btnClose = overlay.querySelector('#btn-close-new-user-creds');
            const btnCopy = overlay.querySelector('#btn-copy-new-user-creds');
            if (btnClose) btnClose.addEventListener('click', close);
            overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
            if (btnCopy) {
                btnCopy.addEventListener('click', async () => {
                    const txt = `Usuario: ${username}\nContraseña: ${password}`;
                    try {
                        if (navigator.clipboard && navigator.clipboard.writeText) {
                            await navigator.clipboard.writeText(txt);
                        }
                        btnCopy.innerHTML = '<i class="fas fa-check"></i> ¡Copiado!';
                    } catch (err) {
                        btnCopy.innerHTML = '<i class="fas fa-check"></i> Listo';
                    }
                });
            }
        }

        const btnModsAll = document.getElementById('btn-usr-mods-all');
        const btnModsNone = document.getElementById('btn-usr-mods-none');
        if (btnModsAll) {
            btnModsAll.addEventListener('click', () => {
                document.querySelectorAll('.usr-module-chk').forEach(chk => { chk.checked = true; });
            });
        }
        if (btnModsNone) {
            btnModsNone.addEventListener('click', () => {
                document.querySelectorAll('.usr-module-chk').forEach(chk => { chk.checked = false; });
            });
        }

        document.getElementById('btn-create-usr').addEventListener('click', async (e) => {
            const name = document.getElementById('usr-name').value.trim();
            const username = document.getElementById('usr-username').value.trim();
            const cedulaInput = document.getElementById('usr-cedula');
            const phoneInput = document.getElementById('usr-phone');
            const emailInput = document.getElementById('usr-email');
            const cedulaRaw = cedulaInput ? cedulaInput.value.trim() : '';
            const cedula = cedulaRaw.replace(/[\s.,-]/g, '');
            const phone = phoneInput ? phoneInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const role = document.getElementById('usr-role').value;
            const password = usrPassInput ? usrPassInput.value : '';
            const photoInput = document.getElementById('usr-photo');
            const photoData = photoInput ? photoInput.dataset.base64 : null;

            const btn = e.currentTarget;
            window.AppData.users = window.AppData.users || [];
            const isEditing = !!btn.dataset.editId;

            if (!name || !username) {
                const msg = 'El nombre y usuario son obligatorios.';
                return window.showAlert ? window.showAlert(msg, { type: 'warning', title: 'Campos Obligatorios' }) : alert(msg);
            }

            if (!isEditing && !cedula) {
                const msg = 'El número de cédula es obligatorio para generar la contraseña por defecto.';
                return window.showAlert ? window.showAlert(msg, { type: 'warning', title: 'Cédula Obligatoria' }) : alert(msg);
            }

            const allowedRoutes = Array.from(document.querySelectorAll('.usr-module-chk'))
                .filter(chk => chk.checked)
                .map(chk => chk.getAttribute('data-route'))
                .filter(Boolean);
            if (allowedRoutes.length === 0) {
                const msg = 'Debes seleccionar al menos un módulo permitido para el usuario.';
                return window.showAlert ? window.showAlert(msg, { type: 'warning', title: 'Módulos Requeridos' }) : alert(msg);
            }

            // Al editar, si se ingresa una nueva contraseña, debe cumplir el factor de seguridad
            if (isEditing && password.length > 0) {
                if (window.PasswordPolicy) {
                    const check = window.PasswordPolicy.validate(password);
                    if (!check.valid) {
                        updatePasswordSecurityUI(password);
                        return window.showAlert
                            ? window.showAlert(check.error, { type: 'danger', title: 'Contraseña Insegura' })
                            : alert(check.error);
                    }
                } else {
                    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).{8,}$/;
                    if (!strongRegex.test(password)) {
                        return alert('La contraseña debe tener mínimo 8 caracteres y combinar letras mayúsculas, minúsculas, números y caracteres especiales.');
                    }
                }
            }

            const editPassBox = document.getElementById('usr-edit-password-fields');
            const defaultPassInfo = document.getElementById('usr-default-pass-info');

            let createdCredentials = null;
            if (isEditing) {
                const id = btn.dataset.editId;
                const user = window.AppData.users.find(u => u.id === id);
                if (user && isHiddenMasterAdmin(user)) {
                    delete btn.dataset.editId;
                    btn.innerHTML = '<i class="fas fa-save"></i> Crear Usuario';
                    if (editPassBox) editPassBox.style.display = 'none';
                    if (defaultPassInfo) defaultPassInfo.style.display = 'flex';
                    const msg = 'Esta cuenta está protegida por seguridad y no puede modificarse desde esta lista.';
                    return window.showAlert ? window.showAlert(msg, { type: 'danger', title: 'Acción Protegida' }) : alert(msg);
                }
                const reservedOrDup = username.toLowerCase() === 'admin01'
                    || name.toLowerCase() === 'admin master'
                    || window.AppData.users.some(u => u.id !== id && String(u.username || '').trim().toLowerCase() === username.toLowerCase());
                if (reservedOrDup) {
                    const msg = `El nombre o usuario ingresado no está disponible o ya existe en el sistema.`;
                    return window.showAlert ? window.showAlert(msg, { type: 'warning', title: 'Usuario No Disponible' }) : alert(msg);
                }
                if (user) {
                    user.name = name;
                    user.username = username;
                    if (cedula) user.cedula = cedula;
                    user.phone = phone;
                    user.email = email;
                    user.role = role;
                    user.allowedRoutes = allowedRoutes;
                    user.updatedAt = new Date().toISOString();
                    if (password) {
                        user.password = password;
                        user.passwordUpdatedAt = user.updatedAt;
                    }
                    if (photoData) user.photo = photoData;
                    if (window.showAlert) window.showAlert('Usuario actualizado con éxito.', { type: 'success', title: 'Usuario Actualizado' });
                    else alert('Usuario actualizado con éxito.');
                }
                delete btn.dataset.editId;
                btn.innerHTML = '<i class="fas fa-save"></i> Crear Usuario';
            } else {
                const dup = username.toLowerCase() === 'admin01'
                    || name.toLowerCase() === 'admin master'
                    || window.AppData.users.some(u => String(u.username || '').trim().toLowerCase() === username.toLowerCase());
                if (dup) {
                    const msg = `El nombre o usuario ingresado no está disponible o ya existe en el sistema.`;
                    return window.showAlert ? window.showAlert(msg, { type: 'warning', title: 'Usuario Duplicado' }) : alert(msg);
                }
                const defaultPassword = `${cedula}Fp*`;
                const nowIso = new Date().toISOString();
                window.AppData.users.push({
                    id: 'usr_' + Date.now(),
                    name: name,
                    username: username,
                    cedula: cedula,
                    phone: phone,
                    email: email,
                    role: role,
                    allowedRoutes: allowedRoutes,
                    password: defaultPassword,
                    photo: photoData || '',
                    mustChangePassword: true,
                    createdAt: nowIso,
                    updatedAt: nowIso
                });
                createdCredentials = { username, defaultPassword, name };
            }

            if (window.renderUsersTable) window.renderUsersTable();
            const savePromise = window.saveAppData ? window.saveAppData() : null;
            if (createdCredentials) {
                showNewUserCredentialsModal(createdCredentials.username, createdCredentials.defaultPassword, createdCredentials.name);
            }

            document.getElementById('usr-name').value = '';
            document.getElementById('usr-username').value = '';
            if (cedulaInput) cedulaInput.value = '';
            if (phoneInput) phoneInput.value = '';
            if (emailInput) emailInput.value = '';
            document.getElementById('usr-role').selectedIndex = 0;
            document.querySelectorAll('.usr-module-chk').forEach(chk => { chk.checked = true; });
            if (usrPassInput) {
                usrPassInput.value = '';
                usrPassInput.type = 'password';
            }
            if (btnToggleUsrPass) btnToggleUsrPass.innerHTML = '<i class="fas fa-eye"></i>';
            if (editPassBox) editPassBox.style.display = 'none';
            if (defaultPassInfo) defaultPassInfo.style.display = 'flex';
            updatePasswordSecurityUI('');
            if (photoInput) {
                photoInput.value = '';
                photoInput.dataset.base64 = '';
            }
            if (savePromise && typeof savePromise.then === 'function') {
                try { await savePromise; } catch (err) {}
            }
        });

        // =====================================
        // 5. Backup configuration
        // =====================================
        document.getElementById('btn-save-backup').addEventListener('click', () => {
            const email = document.getElementById('backup-email').value;
            if(!email) return alert('Por favor ingresa un correo electrónico.');
            alert('Configuración de Backup guardada exitosamente.');
        });

        document.getElementById('btn-force-backup').addEventListener('click', () => {
            alert('Generando copia de seguridad y enviando al correo configurado...');
        });

        const btnResetSystem = document.getElementById('btn-reset-system-blank');
        if (btnResetSystem) {
            btnResetSystem.addEventListener('click', async () => {
                // Seguridad: solo admin01 (Admin Master) está autorizado a ejecutar el reinicio
                if (!window.Modules.settings.isCurrentSessionMasterAdmin()) {
                    const deniedMsg = 'Acceso denegado: únicamente el usuario Admin Master (admin01) puede restablecer el sistema.';
                    if (window.showAlert) {
                        await window.showAlert(deniedMsg, { title: 'Acceso Restringido', type: 'danger' });
                    } else {
                        alert(deniedMsg);
                    }
                    return;
                }

                const confirmed = window.showConfirm
                    ? await window.showConfirm('¿Estás seguro de eliminar TODA la información del sistema (pasajeros, reservas, RRHH, flota, inventario, facturas y caja)? Esta acción no se puede deshacer.', {
                        title: 'Restablecer Sistema en Blanco',
                        type: 'danger',
                        confirmText: 'Continuar',
                        cancelText: 'Cancelar'
                    })
                    : confirm('¿Estás seguro de eliminar TODA la información del sistema?');
                if (!confirmed) return;

                // Solicitar contraseña actual de Admin Master (admin01) antes de ejecutar el borrado
                const enteredPass = window.showPrompt
                    ? await window.showPrompt('Por seguridad, ingresa la contraseña de Admin Master (admin01) para confirmar el restablecimiento del sistema en blanco:', {
                        title: 'Verificación de Contraseña',
                        inputType: 'password',
                        placeholder: 'Ingresa tu contraseña...',
                        confirmText: 'Restablecer Sistema',
                        cancelText: 'Cancelar'
                    })
                    : prompt('Ingresa la contraseña de Admin Master (admin01) para confirmar:');

                if (enteredPass === null) return;

                const users = (window.AppData && Array.isArray(window.AppData.users)) ? window.AppData.users : [];
                const masterRecord = users.find(u => u && (String(u.username || '').trim().toLowerCase() === 'admin01' || u.id === 'usr_admin'));
                const expectedPass = (masterRecord && masterRecord.password !== undefined) ? String(masterRecord.password) : '01Fraterno*';

                if (String(enteredPass) !== expectedPass) {
                    const wrongMsg = 'Contraseña incorrecta. No se realizó el restablecimiento del sistema.';
                    if (window.showAlert) {
                        await window.showAlert(wrongMsg, { title: 'Contraseña Incorrecta', type: 'danger' });
                    } else {
                        alert(wrongMsg);
                    }
                    return;
                }

                if (window.resetSystemToBlank) {
                    await window.resetSystemToBlank();
                    if (window.showAlert) {
                        await window.showAlert('El sistema ha sido restablecido completamente en blanco. Se conservaron únicamente las credenciales del Administrador Master.', {
                            title: 'Sistema en Blanco',
                            type: 'success'
                        });
                    }
                    window.location.hash = '#/';
                    window.location.reload();
                }
            });
        }

        // =====================================


        // =====================================
        // 6. Fechas NO Operación
        // =====================================
        window.AppData = window.AppData || {};
        window.AppData.noOpRules = window.AppData.noOpRules || {
            daysOfWeek: ['1', '2'], // Default: Monday(1), Tuesday(2) are closed
            specificDates: [],
            exceptions: []
        };

        const checkboxes = document.querySelectorAll('.noop-day');
        // Load checked days
        checkboxes.forEach(cb => {
            if (window.AppData.noOpRules.daysOfWeek.includes(cb.value)) {
                cb.checked = true;
            }
        });

        // Save Days
        document.getElementById('btn-save-noop-days').addEventListener('click', () => {
            const selected = Array.from(checkboxes).filter(cb => cb.checked).map(cb => cb.value);
            window.AppData.noOpRules.daysOfWeek = selected;
            if (window.saveAppData) window.saveAppData();
            alert('Días de No Operación guardados exitosamente.');
        });

        // Load specific dates
        const tableDates = document.getElementById('table-noop-dates');
        function renderNoOpDates() {
            if (!tableDates) return;
            tableDates.innerHTML = '';
            window.AppData.noOpRules.specificDates.forEach((dateStr, idx) => {
                const tr = document.createElement('tr');
                tr.style.borderBottom = '1px solid var(--border-color)';
                tr.innerHTML = `
                    <td style="padding: 0.75rem;">${dateStr}</td>
                    <td style="padding: 0.75rem; text-align: center;">
                        <button class="btn btn-delete-date" data-idx="${idx}" style="color: var(--brand-danger); padding: 0.25rem; background: none; border: none; cursor: pointer;"><i class="fas fa-trash"></i></button>
                    </td>
                `;
                tableDates.appendChild(tr);
            });

            document.querySelectorAll('.btn-delete-date').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.currentTarget.getAttribute('data-idx');
                    window.AppData.noOpRules.specificDates.splice(idx, 1);
                    if (window.saveAppData) window.saveAppData();
                    renderNoOpDates();
                });
            });
        }
        renderNoOpDates();

        // Add Specific Date logic
        const dateInput = document.getElementById('noop-specific-date');
        const btnAddNoOpDate = document.getElementById('btn-add-noop-date');
        
        function handleAddDate() {
            const dateStr = dateInput.value;
            if(!dateStr) return alert('Selecciona una fecha válida.');
            
            if(!window.AppData.noOpRules.specificDates.includes(dateStr)) {
                window.AppData.noOpRules.specificDates.push(dateStr);
                // sort ascending
                window.AppData.noOpRules.specificDates.sort();
                if (window.saveAppData) window.saveAppData();
                renderNoOpDates();
                dateInput.value = '';
                alert('Fecha bloqueada exitosamente.');
            } else {
                alert('Esa fecha ya está bloqueada.');
                dateInput.value = '';
            }
        }

        if (btnAddNoOpDate) {
            btnAddNoOpDate.addEventListener('click', handleAddDate);
        }

        // =====================================
        // Modal Migración de Vuelos AOG (Req #8)
        // =====================================
        function openAogMigrationModal(sourcePlane, targetNewState) {
            return new Promise((resolve) => {
                const today = new Date().toLocaleDateString('en-CA');
                const scheduledFlights = (window.AppData.asignacionFlota || []).filter(f => f.id_aeronave === sourcePlane.id && f.fecha >= today);
                const otherOperativePlanes = (window.AppData.aeronaves || []).filter(a => a.id !== sourcePlane.id && a.estado === 'Operativa');

                const optionsHtml = otherOperativePlanes.length > 0
                    ? otherOperativePlanes.map(op => `<option value="${escapeHTML(op.id)}">${escapeHTML(op.matricula)} (${escapeHTML(op.modelo)}) - Cap: FJ ${escapeHTML(op.capFun)} / T ${escapeHTML(op.capTan)}</option>`).join('')
                    : `<option value="">-- No hay otras aeronaves en estado Operativa --</option>`;

                const overlay = document.createElement('div');
                overlay.className = 'fraterno-modal-overlay';
                overlay.style.display = 'flex';

                overlay.innerHTML = `
                    <div class="fraterno-modal-card" style="width: 540px; max-width: 94%; border-top-color: var(--brand-warning) !important;">
                        <button id="aog-modal-close-top" class="btn" style="position: absolute; top: 1.25rem; right: 1.25rem; color: var(--text-secondary); font-size: 1.25rem;"><i class="fas fa-times"></i></button>
                        <h3><i class="fas fa-plane-slash" style="color: var(--brand-warning);"></i> Cambio de Estado a ${escapeHTML(targetNewState)}</h3>
                        
                        <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 10px; padding: 1rem; margin-bottom: 1.25rem;">
                            <div style="font-size: 0.95rem; color: var(--text-primary); margin-bottom: 0.4rem;">
                                Aeronave seleccionada: <strong>${escapeHTML(sourcePlane.matricula)} (${escapeHTML(sourcePlane.modelo)})</strong>
                            </div>
                            <div style="font-size: 0.9rem; color: var(--text-secondary);">
                                Vuelos programados a partir de hoy: <strong style="color: var(--brand-warning);">${scheduledFlights.length} vuelo(s)</strong>
                            </div>
                        </div>

                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.65rem;">
                                ¿Desea migrar los vuelos programados de la aeronave ${escapeHTML(sourcePlane.matricula)} a otra aeronave operativa?
                            </label>
                            <div style="display: flex; flex-direction: column; gap: 0.6rem; background: var(--bg-surface-hover); padding: 0.9rem 1rem; border-radius: 10px; border: 1px solid var(--border-color);">
                                <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-weight: 600; color: var(--text-primary); margin: 0;">
                                    <input type="radio" name="aog-migrate-opt" value="yes" ${otherOperativePlanes.length > 0 ? 'checked' : ''} style="accent-color: var(--brand-action); width: 18px; height: 18px;">
                                    <span>Sí, migrar los vuelos programados a otra aeronave</span>
                                </label>
                                <label style="display: flex; align-items: center; gap: 0.6rem; cursor: pointer; font-weight: 500; color: var(--text-secondary); margin: 0;">
                                    <input type="radio" name="aog-migrate-opt" value="no" ${otherOperativePlanes.length === 0 ? 'checked' : ''} style="accent-color: var(--brand-danger); width: 18px; height: 18px;">
                                    <span>No migrar (eliminar vuelos programados de esta aeronave)</span>
                                </label>
                            </div>
                        </div>

                        <div class="form-group" id="aog-target-plane-container" style="margin-bottom: 1.5rem; display: ${otherOperativePlanes.length > 0 ? 'block' : 'none'};">
                            <label style="font-weight: 700; color: var(--text-primary);">Indicar a cuál aeronave migrar los vuelos:</label>
                            <select id="aog-target-plane-select" class="form-control" style="font-weight: 600;">
                                ${optionsHtml}
                            </select>
                        </div>

                        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                            <button type="button" class="btn btn-outline" id="aog-btn-cancel">Cancelar</button>
                            <button type="button" class="btn btn-primary" id="aog-btn-confirm" style="background: var(--brand-warning); color: #fff; border: none;">
                                <i class="fas fa-exchange-alt"></i> Confirmar y Pasar a ${escapeHTML(targetNewState)}
                            </button>
                        </div>
                    </div>
                `;

                document.body.appendChild(overlay);
                const radios = overlay.querySelectorAll('input[name="aog-migrate-opt"]');
                const targetContainer = overlay.querySelector('#aog-target-plane-container');
                const targetSelect = overlay.querySelector('#aog-target-plane-select');

                radios.forEach(r => {
                    r.addEventListener('change', () => {
                        const sel = overlay.querySelector('input[name="aog-migrate-opt"]:checked')?.value;
                        targetContainer.style.display = (sel === 'yes') ? 'block' : 'none';
                    });
                });

                function cancel() {
                    overlay.remove();
                    resolve({ confirmed: false });
                }

                overlay.querySelector('#aog-modal-close-top').addEventListener('click', cancel);
                overlay.querySelector('#aog-btn-cancel').addEventListener('click', cancel);
                overlay.addEventListener('click', (e) => { if (e.target === overlay) cancel(); });

                overlay.querySelector('#aog-btn-confirm').addEventListener('click', () => {
                    const choice = overlay.querySelector('input[name="aog-migrate-opt"]:checked')?.value;
                    if (choice === 'yes') {
                        const targetPlaneId = targetSelect.value;
                        if (!targetPlaneId) {
                            alert('Por favor selecciona una aeronave operativa destino para migrar los vuelos, o elige la opción "No migrar".');
                            return;
                        }
                        const destPlane = (window.AppData.aeronaves || []).find(a => a.id === targetPlaneId);
                        if (!destPlane) {
                            alert('Aeronave destino no encontrada.');
                            return;
                        }

                        // Migrate scheduled flights in asignacionFlota
                        let migratedCount = 0;
                        (window.AppData.asignacionFlota || []).forEach(f => {
                            if (f.id_aeronave === sourcePlane.id && f.fecha >= today) {
                                f.id_aeronave = destPlane.id;
                                migratedCount++;
                            }
                        });

                        // Also migrate passengers assigned to sourcePlane.matricula on future/today active flights
                        (window.AppData.passengers || []).forEach(p => {
                            if (p.aeronave === sourcePlane.matricula && p.date >= today && p.flightStatus !== 'Completado' && p.flightStatus !== 'Aterrizó') {
                                p.aeronave = destPlane.matricula;
                            }
                        });

                        overlay.remove();
                        alert(`Estado cambiado a ${targetNewState}.\nSe migraron exitosamente ${migratedCount} vuelo(s) programado(s) a la aeronave ${destPlane.matricula}.`);
                        resolve({ confirmed: true, migrated: true, targetPlane: destPlane });
                    } else {
                        // Do not migrate: remove scheduled flights from today onwards
                        window.AppData.asignacionFlota = (window.AppData.asignacionFlota || []).filter(f => !(f.id_aeronave === sourcePlane.id && f.fecha >= today));
                        (window.AppData.passengers || []).forEach(p => {
                            if (p.aeronave === sourcePlane.matricula && p.date >= today && p.flightStatus !== 'Completado' && p.flightStatus !== 'Aterrizó') {
                                p.aeronave = 'Sin asignar';
                                p.vueloNum = '';
                            }
                        });
                        overlay.remove();
                        resolve({ confirmed: true, migrated: false });
                    }
                });
            });
        }
        
        window.AppData.aeronaves = window.AppData.aeronaves || [];
        const tablePlane = document.getElementById('table-plane');
        const btnCreatePlane = document.getElementById('btn-create-plane');
        let editingPlaneId = null;

        function renderAeronaves() {
            tablePlane.innerHTML = '';
            if (window.AppData.aeronaves.length === 0) {
                tablePlane.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 1rem; color: var(--text-secondary);">No hay aeronaves registradas</td></tr>';
                return;
            }

            let planeHtml = '';
            window.AppData.aeronaves.forEach(a => {
                let statusColor = 'var(--text-primary)';
                if(a.estado === 'Operativa') statusColor = 'var(--brand-success)';
                if(a.estado === 'AOG') statusColor = 'var(--brand-warning)';
                if(a.estado === 'No operativa') statusColor = 'var(--brand-danger)';
                
                planeHtml += `
                <tr style="border-bottom: 1px solid var(--border-color);">
                    <td style="padding: 1rem; font-weight: 600;">${escapeHTML(a.matricula)}</td>
                    <td style="padding: 1rem;">${escapeHTML(a.modelo)}</td>
                    <td style="padding: 1rem;">FJ: ${escapeHTML(a.capFun)} | T: ${escapeHTML(a.capTan)} | C: ${escapeHTML(a.capCop || 0)}</td>
                    <td style="padding: 1rem; font-weight: 600;">
                        <select class="form-control plane-inline-status" data-id="${escapeHTML(a.id)}" style="color: ${statusColor}; border-color: var(--border-color); background: var(--bg-surface); font-weight: bold; width: auto; display: inline-block; padding: 0.25rem 0.5rem;">
                            <option value="Operativa" ${a.estado === 'Operativa' ? 'selected' : ''} style="color: var(--brand-success);">Operativa</option>
                            <option value="AOG" ${a.estado === 'AOG' ? 'selected' : ''} style="color: var(--brand-warning);">AOG (Mantenimiento)</option>
                            <option value="No operativa" ${a.estado === 'No operativa' ? 'selected' : ''} style="color: var(--brand-danger);">No operativa</option>
                        </select>
                    </td>
                    <td style="padding: 1rem; text-align: center;">
                        <button class="btn btn-edit-plane" data-id="${escapeHTML(a.id)}" style="padding: 0.25rem 0.5rem; margin-right: 0.25rem;"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-delete-plane" data-id="${escapeHTML(a.id)}" style="color: var(--brand-danger); padding: 0.25rem 0.5rem;"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>`;
            });
            tablePlane.innerHTML = planeHtml;


            document.querySelectorAll('.btn-delete-plane').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const ok = window.showConfirm ? await window.showConfirm('¿Seguro que deseas eliminar esta aeronave?', { title: 'Eliminar Aeronave', type: 'danger' }) : confirm('¿Seguro que deseas eliminar esta aeronave?');
                    if (ok) {
                        window.AppData.aeronaves = window.AppData.aeronaves.filter(a => a.id !== id);
                        if (window.saveAppData) window.saveAppData();
                        renderAeronaves();
                    }
                });
            });

            document.querySelectorAll('.btn-edit-plane').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const plane = window.AppData.aeronaves.find(a => a.id === id);
                    if(plane) {
                        editingPlaneId = id;
                        document.getElementById('plane-model').value = plane.modelo || '';
                        document.getElementById('plane-reg').value = plane.matricula || '';
                        document.getElementById('plane-cap-fun').value = plane.capFun || 0;
                        document.getElementById('plane-cap-tan').value = plane.capTan || 0;
                        document.getElementById('plane-cap-cop').value = plane.capCop || 0;
                        document.getElementById('plane-status').value = plane.estado || 'Operativa';
                        
                        btnCreatePlane.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
                        
                        // Scroll up to form
                        document.getElementById('content-aeronaves').scrollIntoView({behavior: 'smooth'});
                    }
                });
            });

            document.querySelectorAll('.plane-inline-status').forEach(select => {
                select.addEventListener('change', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    const newState = e.target.value;
                    const plane = window.AppData.aeronaves.find(a => a.id === id);
                    if (plane && plane.estado !== newState) {
                        if (newState === 'AOG' || newState === 'No operativa') {
                            const res = await openAogMigrationModal(plane, newState);
                            if (!res.confirmed) {
                                e.target.value = plane.estado; // Revertir visualmente
                                return;
                            }
                        }
                        plane.estado = newState;
                        if (window.saveAppData) window.saveAppData();
                        renderAeronaves();
                    }
                });
            });
        }

        renderAeronaves();

        btnCreatePlane.addEventListener('click', async () => {
            const model = document.getElementById('plane-model').value.trim();
            const reg = document.getElementById('plane-reg').value.trim();
            const capFun = parseInt(document.getElementById('plane-cap-fun').value);
            const capTan = parseInt(document.getElementById('plane-cap-tan').value);
            const capCop = parseInt(document.getElementById('plane-cap-cop').value);
            const status = document.getElementById('plane-status').value;

            if (!model || !reg) {
                return alert('Modelo y Matrícula son obligatorios.');
            }

            if (editingPlaneId) {
                const plane = window.AppData.aeronaves.find(a => a.id === editingPlaneId);
                if(plane) {
                    const statusChanged = plane.estado !== status;
                    if (statusChanged && (status === 'AOG' || status === 'No operativa')) {
                        const res = await openAogMigrationModal(plane, status);
                        if (!res.confirmed) {
                            return; // Cancelar guardado
                        }
                    }
                    
                    plane.modelo = model;
                    plane.matricula = reg;
                    plane.capFun = capFun || 0;
                    plane.capTan = capTan || 0;
                    plane.capCop = capCop || 0;
                    plane.estado = status;
                }
                editingPlaneId = null;
                btnCreatePlane.innerHTML = '<i class="fas fa-plane"></i> Crear Aeronave';
            } else {
                window.AppData.aeronaves.push({
                    id: 'a_' + Date.now(),
                    modelo: model,
                    matricula: reg,
                    capFun: capFun || 0,
                    capTan: capTan || 0,
                    capCop: capCop || 0,
                    estado: status
                });
            }
            
            if (window.saveAppData) window.saveAppData();

            document.getElementById('plane-model').value = '';
            document.getElementById('plane-reg').value = '';
            document.getElementById('plane-cap-fun').value = '10';
            document.getElementById('plane-cap-tan').value = '5';
            document.getElementById('plane-cap-cop').value = '0';
            document.getElementById('plane-status').value = 'Operativa';

            renderAeronaves();
        });


        // ==============================================
        // Logic: Documentos Legales
        // ==============================================
        window.AppData.legalDocs = window.AppData.legalDocs || {
            bienvenida_es: [], bienvenida_en: [],
            terminos_es: [], terminos_en: [],
            ficha_es: [], ficha_en: [],
            exoneracion_es: [], exoneracion_en: []
        };

        const docsMeta = [
            { id: 'bienvenida_es', name: 'Gu&iacute;a de Bienvenida (ES)' },
            { id: 'bienvenida_en', name: 'Welcome Guide (EN)' },
            { id: 'terminos_es', name: 'T&eacute;rminos y Condiciones (ES)' },
            { id: 'terminos_en', name: 'Terms and Conditions (EN)' },
            { id: 'ficha_es', name: 'Ficha Informativa (ES)' },
            { id: 'ficha_en', name: 'Information Sheet (EN)' },
            { id: 'exoneracion_es', name: 'Exoneraci&oacute;n de Responsabilidad (ES)' },
            { id: 'exoneracion_en', name: 'Liability Waiver (EN)' }
        ];

        function renderDocs() {
            const grid = document.getElementById('docs-grid');
            if (!grid) return;
            
            grid.innerHTML = docsMeta.map(meta => {
                const versions = window.AppData.legalDocs[meta.id] || [];
                const latest = versions[versions.length - 1];
                const historyList = versions.slice().reverse().map(v => 
                    `<div style="font-size: 0.85rem; display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                        <span>v${v.version} - ${new Date(v.date).toLocaleString()}</span>
                        ${v.version === (latest ? latest.version : -1) ? '<span style="color: var(--brand-success); font-weight: bold;">(Actual)</span>' : '<span style="color: var(--text-secondary);">Antigua</span>'}
                    </div>`
                ).join('');

                return `
                <div class="card" style="display: flex; flex-direction: column; gap: 1rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <h4 style="margin: 0; color: var(--brand-primary);">${meta.name}</h4>
                        ${latest ? `<span style="background: var(--brand-success); color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">v${latest.version}</span>` : `<span style="background: var(--border-color); color: var(--text-secondary); padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: bold;">Sin cargar</span>`}
                    </div>
                    <div style="flex: 1; background: var(--bg-surface-hover); border-radius: 4px; padding: 1rem; max-height: 150px; overflow-y: auto;">
                        <h5 style="margin-top: 0; margin-bottom: 0.5rem; font-size: 0.9rem;">Historial de versiones:</h5>
                        ${historyList || '<div style="color: var(--text-secondary); font-size: 0.85rem;">No hay versiones registradas.</div>'}
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <input type="file" id="file_${meta.id}" accept=".pdf" style="display: none;" onchange="uploadDoc(this, '${meta.id}')">
                        <button class="btn btn-primary" style="flex: 1;" onclick="document.getElementById('file_${meta.id}').click()"><i class="fas fa-upload"></i> Subir Nueva Versi&oacute;n</button>
                    </div>
                </div>`;
            }).join('');
        }

        window.uploadDoc = function(inputEl, metaId) {
            if (!inputEl.files || inputEl.files.length === 0) return;
            const file = inputEl.files[0];
            if (file.type !== 'application/pdf') {
                alert('Solo se permiten archivos PDF.');
                return;
            }
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                const arr = window.AppData.legalDocs[metaId] || [];
                const newVersion = arr.length > 0 ? arr[arr.length - 1].version + 1 : 1;
                arr.push({
                    version: newVersion,
                    date: new Date().toISOString(),
                    filename: file.name,
                    dataUrl: dataUrl
                });
                window.AppData.legalDocs[metaId] = arr;
                if (window.saveAppData) window.saveAppData();
                renderDocs();
                alert('Documento actualizado correctamente a la versi&oacute;n ' + newVersion);
            };
            reader.readAsDataURL(file);
        };

        renderDocs();

        // ==========================================
        // Lógica de Maestro Productos Tienda
        // ==========================================
        function renderStoreProducts() {
            const grid = document.getElementById('store-products-grid');
            if (!grid) return;
            
            const products = window.AppData.storeProducts || [];
            
            if (products.length === 0) {
                grid.innerHTML = '<p style="color: var(--text-secondary); grid-column: 1 / -1;">No hay productos creados.</p>';
                return;
            }
            
            const fmt = (val) => '$' + parseInt(val).toLocaleString('es-CO');
            
            grid.innerHTML = products.map(p => `
                <div class="card" style="display: flex; flex-direction: column; gap: 0.5rem; border: 1px solid var(--border-color);">
                    <div style="height: 120px; background: #eee; display: flex; align-items: center; justify-content: center; overflow: hidden; border-radius: 4px;">
                        ${p.image ? `<img src="${escapeHTML(p.image)}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-image" style="font-size: 2rem; color: #ccc;"></i>'}
                    </div>
                    <div style="font-weight: bold; font-size: 1.1rem; color: var(--text-primary); margin-top: 0.5rem;">${escapeHTML(p.name)}</div>
                    ${p.barcode ? `<div style="font-size: 0.85rem; color: var(--text-secondary);"><i class="fas fa-barcode"></i> ${escapeHTML(p.barcode)}</div>` : ''}
                    <div style="color: var(--brand-success); font-size: 1.2rem; margin-bottom: 0.5rem; font-weight: 600;">${fmt(p.price)}</div>
                    <button class="btn btn-sm btn-delete-store-product" data-id="${escapeHTML(p.id)}" style="background: var(--brand-danger); color: white;"><i class="fas fa-trash"></i> Eliminar</button>
                </div>
            `).join('');
            
            document.querySelectorAll('.btn-delete-store-product').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.currentTarget.getAttribute('data-id');
                    const ok = window.showConfirm ? await window.showConfirm('¿Seguro que deseas eliminar este producto?', { title: 'Eliminar Producto', type: 'danger' }) : confirm('¿Seguro que deseas eliminar este producto?');
                    if (ok) {
                        window.AppData.storeProducts = window.AppData.storeProducts.filter(x => x.id !== id);
                        if (window.saveAppData) window.saveAppData();
                        renderStoreProducts();
                    }
                });
            });
        }

        const btnCreateProduct = document.getElementById('btn-create-store-product');
        if (btnCreateProduct) {
            btnCreateProduct.addEventListener('click', () => {
                const modalHtml = `
                <div id="storeProductModal" class="fraterno-modal-overlay" style="display: flex;">
                    <div class="fraterno-modal-card" style="width: 460px; max-width: 92%;">
                        <h3><i class="fas fa-box-open" style="color: var(--brand-action);"></i> Crear Producto Tienda</h3>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Nombre del Producto <span style="color: var(--brand-danger);">*</span></label>
                            <input type="text" id="sp-name" class="form-control" placeholder="Ej: Camiseta FRATERNO">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Código de Barra</label>
                            <input type="text" id="sp-barcode" class="form-control" placeholder="Opcional">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Valor / Precio <span style="color: var(--brand-danger);">*</span></label>
                            <input type="text" id="sp-price" class="form-control" placeholder="Ej: 50.000">
                        </div>
                        
                        <div class="form-group" style="margin-bottom: 1.5rem;">
                            <label style="display: block; margin-bottom: 0.5rem; font-weight: 500;">Foto (Opcional)</label>
                            <input type="file" id="sp-photo" class="form-control" accept="image/*" style="padding: 0.5rem;">
                        </div>
                        
                        <div style="display: flex; justify-content: flex-end; gap: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
                            <button id="sp-cancel" class="btn btn-outline">Cancelar</button>
                            <button id="sp-save" class="btn btn-primary"><i class="fas fa-save"></i> Guardar</button>
                        </div>
                    </div>
                </div>
                `;
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                const modal = document.getElementById('storeProductModal');
                
                const spPriceInput = document.getElementById('sp-price');
                spPriceInput.addEventListener('input', (e) => {
                    e.target.value = formatCurrency(e.target.value);
                });
                
                document.getElementById('sp-cancel').addEventListener('click', () => {
                    modal.remove();
                });
                
                document.getElementById('sp-save').addEventListener('click', () => {
                    const name = document.getElementById('sp-name').value.trim();
                    const barcode = document.getElementById('sp-barcode').value.trim();
                    const price = parseFloat(document.getElementById('sp-price').value.replace(/\D/g, ''));
                    const photoInput = document.getElementById('sp-photo');
                    
                    if (!name || isNaN(price)) {
                        alert('Por favor, ingresa el nombre y el valor del producto.');
                        return;
                    }
                    
                    if (photoInput.files && photoInput.files[0]) {
                        const reader = new FileReader();
                        reader.onload = e => {
                            saveProduct(name, barcode, price, e.target.result);
                            modal.remove();
                        };
                        reader.readAsDataURL(photoInput.files[0]);
                    } else {
                        saveProduct(name, barcode, price, null);
                        modal.remove();
                    }
                });
            });
        }
        
        function saveProduct(name, barcode, price, imageBase64) {
            window.AppData.storeProducts = window.AppData.storeProducts || [];
            window.AppData.storeProducts.push({
                id: 'prod_' + Date.now(),
                name: name,
                barcode: barcode || null,
                price: parseFloat(price),
                image: imageBase64
            });
            if (window.saveAppData) window.saveAppData();
            renderStoreProducts();
        }

        renderStoreProducts();

    }
}
