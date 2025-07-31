// Módulo de Bodegas
window.BodegasModule = {
    // Renderizar lista de bodegas
    renderList: function(data) {
        if (!data || data.length === 0) {
            return `
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="card-title mb-0">Gestión de Bodegas</h5>
                        <button class="btn btn-primary" onclick="BodegasModule.showForm()">
                            <i class="bi bi-plus-lg"></i> Nueva Bodega
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="empty-state text-center py-5">
                            <i class="bi bi-warehouse display-1 text-muted mb-3"></i>
                            <h4 class="text-muted">No hay bodegas registradas</h4>
                            <p class="text-muted">Comienza agregando tu primera bodega</p>
                            <button class="btn btn-primary" onclick="BodegasModule.showForm()">
                                <i class="bi bi-plus-lg"></i> Agregar Primera Bodega
                            </button>
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
                    <td>${parseFloat(bodega.dotacion).toLocaleString()} m²</td>
                    <td>
                        ${bodega.estado === 'activa' 
                            ? '<span class="badge bg-success">Activa</span>' 
                            : '<span class="badge bg-danger">Inactiva</span>'}
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" onclick="BodegasModule.showDetails(${bodega.id})" title="Ver detalles">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-success" onclick="BodegasModule.showForm(${bodega.id})" title="Editar">
                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" onclick="BodegasModule.deleteItem(${bodega.id}, '${bodega.nombre}')" title="Eliminar">
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
                    <button class="btn btn-primary" onclick="BodegasModule.showForm()">
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
                                    <th>dotacion</th>
                                    <th>Estado</th>
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
        console.log('Mostrando formulario de bodega:', id);
        
        const isEdit = id !== null;
        const title = isEdit ? 'Editar Bodega' : 'Nueva Bodega';
        
        const formHtml = `
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-warehouse"></i> ${title}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="bodega-form" data-ajax="true">
                    <input type="hidden" name="action" value="store">
                    <input type="hidden" name="module" value="bodegas">
                    ${isEdit ? `<input type="hidden" name="id" value="${id}">` : ''}
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="codigo" class="form-label">Código *</label>
                                <input type="text" class="form-control" id="codigo" name="codigo" required 
                                       placeholder="Ej: BOD001">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="nombre" class="form-label">Nombre *</label>
                                <input type="text" class="form-control" id="nombre" name="nombre" required 
                                       placeholder="Ej: Bodega Central">
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="ubicacion" class="form-label">Ubicación *</label>
                        <input type="text" class="form-control" id="ubicacion" name="ubicacion" required 
                               placeholder="Ej: Zona Industrial Norte">
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="dotacion" class="form-label">dotacion (m²) *</label>
                                <input type="number" class="form-control" id="dotacion" name="dotacion" 
                                       min="0" step="0.01" required placeholder="Ej: 1500.50">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="mb-3">
                                <label for="estado" class="form-label">Estado *</label>
                                <select class="form-select" id="estado" name="estado" required>
                                    <option value="">Seleccionar...</option>
                                    <option value="activa">Activa</option>
                                    <option value="inactiva">Inactiva</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="mb-3">
                        <label for="descripcion" class="form-label">Descripción</label>
                        <textarea class="form-control" id="descripcion" name="descripcion" rows="3" 
                                  placeholder="Descripción opcional de la bodega"></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                <button type="submit" form="bodega-form" class="btn btn-primary">
                    <i class="bi bi-save"></i> ${isEdit ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        `;
        
        App.renderModal(formHtml);
        
        // Si es edición, cargar los datos
        if (isEdit) {
            this.loadFormData(id);
        }
    },

    // Cargar datos para edición
    loadFormData: function(id) {
        $.ajax({
            url: '/api/bodegas.php',
            method: 'GET',
            data: {
                action: 'show',
                id: id
            },
            success: function(response) {
                if (response ) {
                    const bodega = response;
                    $('#codigo').val(bodega.codigo);
                    $('#nombre').val(bodega.nombre);
                    $('#ubicacion').val(bodega.ubicacion);
                    $('#dotacion').val(bodega.dotacion);
                    $('#estado').val(bodega.estado);
                    $('#descripcion').val(bodega.descripcion || '');
                }
            },
            error: function(xhr) {
                console.error('Error cargando datos:', xhr);
                App.showNotification('Error al cargar los datos de la bodega', 'error');
            }
        });
    },

    // Mostrar detalles
    showDetails: function(id) {
        console.log('Mostrando detalles de bodega:', id);
        
        App.showLoading();
        
        $.ajax({
            url: '/api/bodegas.php',
            method: 'GET',
            data: {
                action: 'show',
                id: id
            },
            success: function(response) {
                if (response && response.data) {
                    BodegasModule.renderDetails(response.data);
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

    // Renderizar detalles
    renderDetails: function(bodega) {
        const detailsHtml = `
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-warehouse"></i> Detalles de Bodega
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <div class="row">
                    <div class="col-md-6">
                        <h6>Información General</h6>
                        <table class="table table-sm">
                            <tr>
                                <td><strong>Código:</strong></td>
                                <td>${bodega.codigo}</td>
                            </tr>
                            <tr>
                                <td><strong>Nombre:</strong></td>
                                <td>${bodega.nombre}</td>
                            </tr>
                            <tr>
                                <td><strong>Ubicación:</strong></td>
                                <td>${bodega.ubicacion}</td>
                            </tr>
                            <tr>
                                <td><strong>Estado:</strong></td>
                                <td>
                                    ${bodega.estado === 'activa' 
                                        ? '<span class="badge bg-success">Activa</span>' 
                                        : '<span class="badge bg-danger">Inactiva</span>'}
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-md-6">
                        <h6>Especificaciones</h6>
                        <table class="table table-sm">
                            <tr>
                                <td><strong>dotacion:</strong></td>
                                <td>${parseFloat(bodega.dotacion).toLocaleString()} m²</td>
                            </tr>
                            <tr>
                                <td><strong>Creada:</strong></td>
                                <td>${new Date(bodega.created_at).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Actualizada:</strong></td>
                                <td>${new Date(bodega.updated_at).toLocaleDateString()}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                
                ${bodega.descripcion ? `
                    <div class="mt-3">
                        <h6>Descripción</h6>
                        <p class="text-muted">${bodega.descripcion}</p>
                    </div>
                ` : ''}
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" onclick="BodegasModule.showForm(${bodega.id})">
                    <i class="bi bi-pencil"></i> Editar
                </button>
            </div>
        `;
        
        App.renderModal(detailsHtml);
    },

    // Eliminar bodega
    deleteItem: function(id, nombre) {
        if (!confirm(`¿Está seguro de que desea eliminar la bodega "${nombre}"?`)) {
            return;
        }
        
        App.showLoading();
        
        $.ajax({
            url: '/api/bodegas.php',
            method: 'POST',
            data: {
                action: 'delete',
                id: id,
                _method: 'DELETE'
            },
            success: function(response) {
                App.showNotification('Bodega eliminada exitosamente', 'success');
                App.loadModule('bodegas'); // Recargar módulo
            },
            error: function(xhr) {
                console.error('Error eliminando bodega:', xhr);
                App.showNotification('Error al eliminar la bodega', 'error');
                App.hideLoading();
            }
        });
    }
};
