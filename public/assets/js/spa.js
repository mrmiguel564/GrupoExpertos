// Sistema de Bodegas - Single Page Application
window.App = {
    currentModule: null,
    
    // Inicializar la aplicación
    init: function() {
        console.log('Inicializando SPA...');
        
        // Cargar módulo inicial
        this.loadModule('bodegas');
        
        // Event listeners globales
        this.bindGlobalEvents();
    },
    
    // Mostrar loading
    showLoading: function() {
        $('#loading-overlay').removeClass('d-none');
    },
    
    // Ocultar loading
    hideLoading: function() {
        $('#loading-overlay').addClass('d-none');
    },
    
    // Mostrar notificación
    showNotification: function(message, type = 'info') {
        const alertTypes = {
            'error': 'danger',
            'success': 'success',
            'warning': 'warning',
            'info': 'info'
        };
        
        const alertClass = alertTypes[type] || 'info';
        
        const alertHtml = `
            <div class="alert alert-${alertClass} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        $('#alert-container').html(alertHtml);
        
        // Auto-hide después de 5 segundos
        setTimeout(() => {
            $('#alert-container .alert').fadeOut();
        }, 5000);
    },
    
    // Cargar módulo
    loadModule: function(module) {
        console.log('Cargando módulo:', module);
        
        this.currentModule = module;
        
        // Actualizar navegación activa
        $('.nav-link').removeClass('active');
        $(`[data-module="${module}"]`).addClass('active');
        
        // Renderizar interfaz inmediatamente (sin datos)
        this.renderModuleContent([]);
        
        // Luego cargar los datos en segundo plano
        this.loadModuleData(module);
    },
    
    // Cargar datos del módulo
    loadModuleData: function(module) {
        console.log('Cargando datos del módulo:', module);
        
        $.ajax({
            url: '/',
            method: 'GET',
            data: {
                api: 'index',
                module: module
            },
            success: (response) => {
                this.updateModuleContent(response);
            },
            error: (xhr) => {
                console.error('Error cargando datos del módulo:', xhr);
                this.showNotification('Error al cargar los datos', 'warning');
            }
        });
    },
    
    // Actualizar contenido del módulo con datos
    updateModuleContent: function(data) {
        if (data && data.length > 0) {
            this.renderModuleContent(data);
        }
    },
    
    // Renderizar contenido del módulo
    renderModuleContent: function(data) {
        let html = '';
        
        switch (this.currentModule) {
            case 'bodegas':
                html = BodegasModule.renderList(data);
                break;
            case 'encargados':
                html = EncargadosModule.renderList(data);
                break;
            case 'asignaciones':
                html = AsignacionesModule.renderList(data);
                break;
            default:
                html = '<div class="alert alert-warning">Módulo no encontrado</div>';
        }
        
        $('#module-content').html(html);
        this.bindModuleEvents();
    },
    
    // Renderizar módulo de bodegas
    renderBodegas: function(data) {
        if (!data || data.length === 0) {
            return `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Gestión de Bodegas</h5>
                        <button class="btn btn-primary" onclick="App.showForm('bodegas')">
                            <i class="bi bi-plus-lg"></i> Nueva Bodega
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="empty-state">
                            <i class="bi bi-warehouse"></i>
                            <p>No hay bodegas registradas</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        let rows = '';
        data.forEach(bodega => {
            rows += `
                <tr>
                    <td>
                        <strong>${bodega.nombre}</strong><br>
                        <small class="text-muted">${bodega.codigo}</small>
                    </td>
                    <td>${bodega.ubicacion}</td>
                    <td>${parseFloat(bodega.capacidad).toLocaleString()} m²</td>
                    <td>
                        ${bodega.estado === 'activa' 
                            ? '<span class="badge bg-success">Activa</span>' 
                            : '<span class="badge bg-danger">Inactiva</span>'}
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="App.showDetails('bodegas', ${bodega.id})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-success" onclick="App.showForm('bodegas', ${bodega.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="App.deleteItem('bodegas', ${bodega.id}, '${bodega.nombre}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        return `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Gestión de Bodegas</h5>
                    <button class="btn btn-primary" onclick="App.showForm('bodegas')">
                        <i class="bi bi-plus-lg"></i> Nueva Bodega
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Bodega</th>
                                    <th>Ubicación</th>
                                    <th>Capacidad</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Renderizar módulo de encargados
    renderEncargados: function(data) {
        if (!data || data.length === 0) {
            return `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Gestión de Encargados</h5>
                        <button class="btn btn-success" onclick="App.showForm('encargados')">
                            <i class="bi bi-plus-lg"></i> Nuevo Encargado
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="empty-state">
                            <i class="bi bi-people"></i>
                            <p>No hay encargados registrados</p>
                        </div>
                    </div>
                </div>
            `;
        }
        
        let rows = '';
        data.forEach(encargado => {
            rows += `
                <tr>
                    <td>
                        <strong>${encargado.nombre} ${encargado.apellido}</strong><br>
                        <small class="text-muted">${encargado.email}</small>
                    </td>
                    <td>${encargado.cargo}</td>
                    <td>${encargado.telefono || 'No especificado'}</td>
                    <td>${new Date(encargado.fecha_ingreso).toLocaleDateString()}</td>
                    <td>
                        ${encargado.estado === 'activo' 
                            ? '<span class="badge bg-success">Activo</span>' 
                            : '<span class="badge bg-danger">Inactivo</span>'}
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="App.showDetails('encargados', ${encargado.id})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-success" onclick="App.showForm('encargados', ${encargado.id})">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="App.deleteItem('encargados', ${encargado.id}, '${encargado.nombre} ${encargado.apellido}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        });
        
        return `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Gestión de Encargados</h5>
                    <button class="btn btn-success" onclick="App.showForm('encargados')">
                        <i class="bi bi-plus-lg"></i> Nuevo Encargado
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Encargado</th>
                                    <th>Cargo</th>
                                    <th>Teléfono</th>
                                    <th>Fecha Ingreso</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Renderizar módulo de asignaciones
    renderAsignaciones: function(data) {
        return `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Gestión de Asignaciones</h5>
                    <button class="btn btn-warning" onclick="App.showForm('asignaciones')">
                        <i class="bi bi-plus-lg"></i> Nueva Asignación
                    </button>
                </div>
                <div class="card-body">
                    <div class="empty-state">
                        <i class="bi bi-person-workspace"></i>
                        <p>Módulo de asignaciones en desarrollo</p>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Mostrar formulario modal
    showForm: function(module, id = null) {
        console.log('Mostrando formulario:', module, id);
        
        // Para formularios nuevos, mostrar inmediatamente
        if (!id) {
            this.renderStaticForm(module);
            return;
        }
        
        // Para ediciones, cargar datos del servidor
        this.showLoading();
        
        $.ajax({
            url: '/',
            method: 'GET',
            data: {
                api: 'form',
                module: module,
                id: id
            },
            success: (response) => {
                if (response.html) {
                    this.renderModal(response.html);
                } else {
                    this.renderModal(response);
                }
                this.hideLoading();
            },
            error: (xhr) => {
                console.error('Error cargando formulario:', xhr);
                this.showNotification('Error al cargar el formulario', 'error');
                this.hideLoading();
            }
        });
    },
    
    // Renderizar formularios estáticos
    renderStaticForm: function(module) {
        let formHtml = '';
        
        switch (module) {
            case 'bodegas':
                formHtml = this.getBodegaForm();
                break;
            case 'encargados':
                formHtml = this.getEncargadoForm();
                break;
            case 'asignaciones':
                formHtml = this.getAsignacionForm();
                break;
            default:
                formHtml = '<div class="alert alert-warning">Formulario no disponible</div>';
        }
        
        this.renderModal(formHtml);
    },
    
    // Formulario de bodega estático
    getBodegaForm: function() {
        return `
            <div class="modal-header">
                <h5 class="modal-title">Nueva Bodega</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="bodega-form" data-ajax="true">
                    <input type="hidden" name="api" value="store">
                    <input type="hidden" name="module" value="bodegas">
                    
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre *</label>
                        <input type="text" class="form-control" id="nombre" name="nombre" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="codigo" class="form-label">Código *</label>
                        <input type="text" class="form-control" id="codigo" name="codigo" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="ubicacion" class="form-label">Ubicación *</label>
                        <input type="text" class="form-control" id="ubicacion" name="ubicacion" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="capacidad" class="form-label">Capacidad (m²) *</label>
                        <input type="number" class="form-control" id="capacidad" name="capacidad" 
                               min="1" step="0.01" required>
                    </div>
                    
                    <div class="mb-3">
                        <label for="estado" class="form-label">Estado</label>
                        <select class="form-select" id="estado" name="estado">
                            <option value="activa" selected>Activa</option>
                            <option value="inactiva">Inactiva</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" form="bodega-form" class="btn btn-primary">Guardar</button>
            </div>
        `;
    },
    
    // Formulario de encargado estático
    getEncargadoForm: function() {
        return `
            <div class="modal-header">
                <h5 class="modal-title">Nuevo Encargado</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="encargado-form" data-ajax="true">
                    <input type="hidden" name="api" value="store">
                    <input type="hidden" name="module" value="encargados">
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="nombre" name="nombre" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="apellido" class="form-label">Apellido *</label>
                                <input type="text" class="form-control" id="apellido" name="apellido" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="email" class="form-label">Email *</label>
                        <input type="email" class="form-control" id="email" name="email" required>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="tel" class="form-control" id="telefono" name="telefono">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="cargo" class="form-label">Cargo *</label>
                                <input type="text" class="form-control" id="cargo" name="cargo" required>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="fecha_ingreso" class="form-label">Fecha de Ingreso *</label>
                                <input type="date" class="form-control" id="fecha_ingreso" name="fecha_ingreso" 
                                       value="${new Date().toISOString().split('T')[0]}" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="estado" class="form-label">Estado</label>
                                <select class="form-select" id="estado" name="estado">
                                    <option value="activo" selected>Activo</option>
                                    <option value="inactivo">Inactivo</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" form="encargado-form" class="btn btn-success">Guardar</button>
            </div>
        `;
    },
    
    // Formulario de asignación estático
    getAsignacionForm: function() {
        return `
            <div class="modal-header">
                <h5 class="modal-title">Nueva Asignación</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    Módulo de asignaciones en desarrollo
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
            </div>
        `;
    },
    
    // Mostrar detalles
    showDetails: function(module, id) {
        console.log('Mostrando detalles:', module, id);
        
        this.showLoading();
        
        $.ajax({
            url: '/',
            method: 'GET',
            data: {
                api: 'show',
                module: module,
                id: id
            },
            success: (response) => {
                this.renderModal(response);
                this.hideLoading();
            },
            error: (xhr) => {
                console.error('Error cargando detalles:', xhr);
                this.showNotification('Error al cargar los detalles', 'error');
                this.hideLoading();
            }
        });
    },
    
    // Eliminar item
    deleteItem: function(module, id, name) {
        if (!confirm(`¿Está seguro de que desea eliminar "${name}"?`)) {
            return;
        }
        
        this.showLoading();
        
        $.ajax({
            url: '/',
            method: 'POST',
            data: {
                api: 'delete',
                module: module,
                id: id,
                _method: 'DELETE'
            },
            success: (response) => {
                this.showNotification('Elemento eliminado exitosamente', 'success');
                this.loadModule(this.currentModule); // Recargar módulo
            },
            error: (xhr) => {
                console.error('Error eliminando elemento:', xhr);
                this.showNotification('Error al eliminar el elemento', 'error');
                this.hideLoading();
            }
        });
    },
    
    // Renderizar modal
    renderModal: function(content) {
        let modalContent = content;
        
        // Si el contenido es un objeto JSON con propiedad html
        if (typeof content === 'object' && content.html) {
            modalContent = content.html;
        }
        
        const modalHtml = `
            <div class="modal fade" id="dynamic-modal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        ${modalContent}
                    </div>
                </div>
            </div>
        `;
        
        $('#modal-container').html(modalHtml);
        const modal = new bootstrap.Modal(document.getElementById('dynamic-modal'));
        modal.show();
    },
    
    // Enviar formulario
    submitForm: function(form) {
        const formData = new FormData(form);
        const module = formData.get('module');
        const id = formData.get('id');
        
        this.showLoading();
        
        $.ajax({
            url: '/',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                this.showNotification(response.message || 'Operación exitosa', 'success');
                $('#dynamic-modal').modal('hide');
                this.loadModule(this.currentModule); // Recargar módulo
            },
            error: (xhr) => {
                console.error('Error enviando formulario:', xhr);
                let message = 'Error al procesar el formulario';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    message = xhr.responseJSON.error;
                }
                this.showNotification(message, 'error');
                this.hideLoading();
            }
        });
    },
    
    // Bind eventos del módulo
    bindModuleEvents: function() {
        // Eventos específicos se pueden agregar aquí
    },
    
    // Bind eventos globales
    bindGlobalEvents: function() {
        // Envío de formularios AJAX
        $(document).on('submit', 'form[data-ajax="true"]', function(e) {
            e.preventDefault();
            App.submitForm(this);
        });
        
        // Cerrar modal al completar operación
        $(document).on('hidden.bs.modal', '#dynamic-modal', function() {
            $('#modal-container').empty();
        });
    }
};

// Inicializar cuando el DOM esté listo
$(document).ready(function() {
    App.init();
});
