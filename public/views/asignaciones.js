// Módulo de Asignaciones
window.AsignacionesModule = {
    // Renderizar lista de asignaciones
    renderList: function(data) {
        return `
            <div class="card">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">Gestión de Asignaciones</h5>
                    <button class="btn btn-warning" onclick="AsignacionesModule.showForm()">
                        <i class="bi bi-plus-lg"></i> Nueva Asignación
                    </button>
                </div>
                <div class="card-body">
                    <div class="empty-state text-center py-5">
                        <i class="bi bi-person-workspace display-1 text-muted mb-3"></i>
                        <h4 class="text-muted">Módulo de Asignaciones</h4>
                        <p class="text-muted">Funcionalidad en desarrollo</p>
                        <button class="btn btn-warning" onclick="AsignacionesModule.showForm()">
                            <i class="bi bi-plus-lg"></i> Crear Asignación
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    // Mostrar formulario
    showForm: function(id = null) {
        console.log('Mostrando formulario de asignación:', id);
        
        const isEdit = id !== null;
        const title = isEdit ? 'Editar Asignación' : 'Nueva Asignación';
        
        const formHtml = `
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="bi bi-person-workspace"></i> ${title}
                </h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
                <form id="asignacion-form" data-ajax="true">
                    <input type="hidden" name="action" value="store">
                    <input type="hidden" name="module" value="asignaciones">
                    ${isEdit ? `<input type="hidden" name="id" value="${id}">` : ''}
                    
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle"></i>
                        <strong>Próximamente:</strong> Este módulo permitirá asignar encargados a bodegas específicas.
                    </div>
                    
                    <div class="mb-3">
                        <label for="bodega_id" class="form-label">Bodega *</label>
                        <select class="form-select" id="bodega_id" name="bodega_id" required disabled>
                            <option value="">Cargando bodegas...</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label for="encargado_id" class="form-label">Encargado *</label>
                        <select class="form-select" id="encargado_id" name="encargado_id" required disabled>
                            <option value="">Cargando encargados...</option>
                        </select>
                    </div>
                    
                    <div class="mb-3">
                        <label for="fecha_asignacion" class="form-label">Fecha de Asignación *</label>
                        <input type="date" class="form-control" id="fecha_asignacion" name="fecha_asignacion" required disabled>
                    </div>
                    
                    <div class="mb-3">
                        <label for="observaciones" class="form-label">Observaciones</label>
                        <textarea class="form-control" id="observaciones" name="observaciones" rows="3" 
                                  placeholder="Observaciones de la asignación" disabled></textarea>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                <button type="submit" form="asignacion-form" class="btn btn-warning" disabled>
                    <i class="bi bi-save"></i> En Desarrollo
                </button>
            </div>
        `;
        
        App.renderModal(formHtml);
        
        // Establecer fecha actual por defecto
        const today = new Date().toISOString().split('T')[0];
        $('#fecha_asignacion').val(today);
    }
};
