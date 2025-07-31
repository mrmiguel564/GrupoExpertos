// Sistema de Bodegas - Single Page Application (Simplificado)
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
            url: `/api/${module}.php`,
            method: 'GET',
            data: {
                action: 'index'
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
    
    // Mostrar formulario modal (delegado a módulos específicos)
    showForm: function(module, id = null) {
        console.log('Delegando formulario a módulo:', module, id);
        
        switch (module) {
            case 'bodegas':
                BodegasModule.showForm(id);
                break;
            case 'encargados':
                EncargadosModule.showForm(id);
                break;
            case 'asignaciones':
                AsignacionesModule.showForm(id);
                break;
            default:
                this.showNotification('Módulo no encontrado', 'error');
        }
    },
    
    // Mostrar detalles (delegado a módulos específicos)
    showDetails: function(module, id) {
        console.log('Delegando detalles a módulo:', module, id);
        
        switch (module) {
            case 'bodegas':
                BodegasModule.showDetails(id);
                break;
            case 'encargados':
                EncargadosModule.showDetails(id);
                break;
            case 'asignaciones':
                AsignacionesModule.showDetails(id);
                break;
            default:
                this.showNotification('Módulo no encontrado', 'error');
        }
    },
    
    // Eliminar item (delegado a módulos específicos)
    deleteItem: function(module, id, name) {
        switch (module) {
            case 'bodegas':
                BodegasModule.deleteItem(id, name);
                break;
            case 'encargados':
                EncargadosModule.deleteItem(id, name);
                break;
            case 'asignaciones':
                AsignacionesModule.deleteItem(id, name);
                break;
            default:
                this.showNotification('Módulo no encontrado', 'error');
        }
    },
    
    // Renderizar modal
    renderModal: function(content) {
        const modalHtml = `
            <div class="modal fade" id="dynamic-modal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        ${content}
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
        
        // Remover campos de control del formulario
        formData.delete('module');
        
        this.showLoading();
        
        $.ajax({
            url: `/api/${module}.php`,
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
