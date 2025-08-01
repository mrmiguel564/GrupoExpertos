// Módulo de Encargados
window.EncargadosModule = {
    // Renderizar lista de encargados
    renderList: function(data) {
        if (!data || data.length === 0) {
            return `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Gestión de Encargados</h5>
                        <button class="btn btn-success" onclick="EncargadosModule.showForm()">
                            <i class="bi bi-plus-lg"></i> Nuevo Encargado
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="empty-state text-center py-5">
                            <i class="bi bi-people display-1 text-muted mb-3"></i>
                            <h4 class="text-muted">No hay encargados registrados</h4>
                            <p class="text-muted">Comienza agregando tu primer encargado</p>
                            <button class="btn btn-success" onclick="EncargadosModule.showForm()">
                                <i class="bi bi-plus-lg"></i> Agregar Primer Encargado
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
        
        let rows = '';
        data.forEach(encargado => {
            //console.log('Procesando encargado:', encargado);
            rows += `
                <tr>
                    
                    <td>
                        <strong>${encargado.nombre} ${encargado.apellido}</strong><br>
                        <small class="text-muted">${encargado.email}</small>
                    </td>
                    <td>${encargado.telefono || 'No especificado'}</td>
                    <td>${new Date(encargado.created_at).toLocaleDateString()}</td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="EncargadosModule.showDetails(${encargado.id})" title="Ver detalles">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-success" onclick="EncargadosModule.showForm(${encargado.id})" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="EncargadosModule.deleteItem(${encargado.id}, '${encargado.nombre} ${encargado.apellido}')" title="Eliminar">
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
                    <button class="btn btn-success" onclick="EncargadosModule.showForm()">
                        <i class="bi bi-plus-lg"></i> Nuevo Encargado
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>Encargado</th> 
                                    <th>Teléfono</th>
                                    <th>Fecha Ingreso</th>
                                    <th width="120">Acciones</th>
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

    // Mostrar formulario
    showForm: function(id = null) {
        console.log('Mostrando formulario de encargado:', id);
        
        const isEdit = id !== null;
        const title = isEdit ? 'Editar Encargado' : 'Nuevo Encargado';
        
        const formHtml = `
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-person"></i> ${title}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="encargado-form" data-ajax="true">
                    <input type="hidden" name="action" value="store">
                    <input type="hidden" name="module" value="encargados">
                    ${isEdit ? `<input type="hidden" name="id" value="${id}">` : ''}
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="nombre" name="nombre" required 
                                       placeholder="Ej: Juan Carlos">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="apellido" class="form-label">Apellido *</label>
                                <input type="text" class="form-control" id="apellido" name="apellido" required 
                                       placeholder="Ej: González López">
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="email" class="form-label">Email *</label>
                                <input type="email" class="form-control" id="email" name="email" required 
                                       placeholder="ejemplo@correo.com">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="telefono" class="form-label">Teléfono</label>
                                <input type="tel" class="form-control" id="telefono" name="telefono" 
                                       placeholder="Ej: +56 9 1234 5678">
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="fecha_ingreso" class="form-label">Fecha de Ingreso *</label>
                                <input type="date" class="form-control" id="fecha_ingreso" name="fecha_ingreso" required>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" form="encargado-form" class="btn btn-success">
                    <i class="bi bi-save"></i> ${isEdit ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        `;
        
        App.renderModal(formHtml);
        
        // Establecer fecha actual por defecto si es nuevo
        if (!isEdit) {
            const today = new Date().toISOString().split('T')[0];
            $('#fecha_ingreso').val(today);
        }
        
        // Si es edición, cargar los datos
        if (isEdit) {
            this.loadFormData(id);
        }
    },

    // Cargar datos para edición
    loadFormData: function(id) {
        $.ajax({
            url: '/api/encargados.php',
            method: 'GET',
            data: {
                action: 'show',
                id: id
            },
            success: function(response) {
                if (response && response.data) {
                    const encargado = response.data;
                    $('#nombre').val(encargado.nombre);
                    $('#apellido').val(encargado.apellido);
                    $('#email').val(encargado.email);
                    $('#telefono').val(encargado.telefono || '');
                    $('#fecha_ingreso').val(encargado.created_at);
 
                }
            },
            error: function(xhr) {
                console.error('Error cargando datos:', xhr);
                App.showNotification('Error al cargar los datos del encargado', 'error');
            }
        });
    },

    // Mostrar detalles
    showDetails: function(id) {
        console.log('Mostrando detalles de encargado:', id);
        
        App.showLoading();
        
        $.ajax({
            url: '/api/encargados.php',
            method: 'GET',
            data: {
                action: 'show',
                id: id
            },
            success: function(response) {
                if (response && response.data) {
                    EncargadosModule.renderDetails(response.data);
                }
                App.hideLoading();
            },
            error: function(xhr) {
                console.error('Error cargando detalles:', xhr);
                App.showNotification('Error al cargar los detalles', 'error');
                App.hideLoading();
            }
        });
    },



    // Eliminar encargado
    deleteItem: function(id, nombre) {
        if (!confirm(`¿Está seguro de que desea eliminar al encargado "${nombre}"?`)) {
            return;
        }
        
        App.showLoading();
        
        $.ajax({
            url: '/api/encargados.php',
            method: 'POST',
            data: {
                action: 'delete',
                id: id,
                _method: 'DELETE'
            },
            success: function(response) {
                App.showNotification('Encargado eliminado exitosamente', 'success');
                App.loadModule('encargados'); // Recargar módulo
            },
            error: function(xhr) {
                console.error('Error eliminando encargado:', xhr);
                App.showNotification('Error al eliminar el encargado', 'error');
                App.hideLoading();
            }
        });
    }
};
