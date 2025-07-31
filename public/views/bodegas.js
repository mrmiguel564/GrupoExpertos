// Módulo de Bodegas
window.BodegasModule = {
    // Renderizar lista de bodegas
    renderList: function(data) {
        // Obtener template pre-cargado
        const $template = $('#bodegas-list-template');
        if ($template.length === 0) {
            console.error('Template de lista no encontrado');
            return '<div class="alert alert-danger">Error: Template no encontrado</div>';
        }

        // Clonar template
        const $container = $template.clone();
        $container.removeClass('template d-none').removeAttr('id');
        
        if (!data || data.length === 0) {
            // Mostrar estado vacío
            $container.find('#bodegas-empty-state').removeClass('d-none');
            $container.find('#bodegas-table-container').addClass('d-none');
        } else {
            // Mostrar tabla con datos
            $container.find('#bodegas-empty-state').addClass('d-none');
            $container.find('#bodegas-table-container').removeClass('d-none');
            
            // Generar filas de la tabla
            this.populateTable($container, data);
        }

        return $container[0].outerHTML;
    },

    // Llenar tabla con datos
    populateTable: function($container, data) {
        const $tbody = $container.find('#bodegas-table-body');
        $tbody.empty();

        data.forEach(bodega => {
            // Formatear fecha de creación
            const fechaCreacion = new Date(bodega.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });

            const $row = $(`
                <tr>
                    <td><code>${bodega.codigo || 'N/A'}</code></td>
                    <td><strong>${bodega.nombre}</strong></td>
                    <td>${bodega.ubicacion}</td>
                    <td>${parseFloat(bodega.dotacion).toLocaleString()}</td>
                    <td>
                        <span class="text-primary">
                            <i class="bi bi-person"></i> ${bodega.encargado_nombre}
                        </span>
                    </td>
                    <td><small>${fechaCreacion}</small></td>
                    <td>
                        ${bodega.activa === true || bodega.activa === 'true' 
                            ? '<span class="badge bg-success">Activa</span>' 
                            : '<span class="badge bg-danger">Inactiva</span>'}
                    </td>
                    <td>
                        <div class="btn-group btn-group-sm">
                            <button class="btn btn-outline-primary" title="Ver detalles" onclick="BodegasModule.showDetails(${bodega.id})">
                                <i class="bi bi-eye"></i>
                            </button>
                            <button class="btn btn-outline-success" title="Editar" onclick="BodegasModule.showForm(${bodega.id})" >

                                <i class="bi bi-pencil"></i>
                            </button>
                            <button class="btn btn-outline-danger" title="Eliminar" onclick="BodegasModule.deleteItem(${bodega.id}, '${bodega.nombre}')">
                                <i class="bi bi-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `);

            $tbody.append($row);
        });
    },

    // Mostrar formulario
    showForm: function(id = null) {
        console.log('Mostrando formulario de bodega:', id);
        
        // Obtener template pre-cargado
        const $template = $('#bodegas-form-template');
        if ($template.length === 0) {
            console.error('Template de formulario no encontrado');
            App.showNotification('Error: Template de formulario no encontrado', 'error');
            return;
        }

        const isEdit = id !== null;
        
        // Clonar template y mostrarlo en modal
        const $formClone = $template.clone();
        $formClone.removeClass('template d-none').removeAttr('id');
        
        // Renderizar modal con template clonado
        App.renderModal($formClone.html());
        
        // Configurar el formulario según el modo (crear/editar)
        this.setupForm(isEdit, id);
        
        // Cargar encargados disponibles
        this.loadEncargados();
        
        // Configurar eventos del selector múltiple
        this.setupMultiSelect();
        
        // Si es edición, cargar los datos
        if (isEdit) {
            this.loadFormData(id);
        }
    },

    // Configurar formulario para crear o editar
    setupForm: function(isEdit, id = null) {
        if (isEdit) {
            $('#form-title').text('Editar Bodega');
            $('#submit-text').text('Actualizar');
            $('#bodega-id').val(id);
        } else {
            $('#form-title').text('Nueva Bodega');
            $('#submit-text').text('Guardar');
            $('#bodega-id').val('');
            // Limpiar campos
            $('#bodega-form')[0].reset();
        }
    },

    // Cargar datos para edición
    loadFormData: function(id) {
        App.showLoading();
        
        $.ajax({
            url: '/api/bodegas.php',
            method: 'GET',
            data: {
                action: 'show',
                id: id
            },
            success: function(response) {
                if (response) {
                    const bodega = response;
                    // Llenar formulario con los datos
                    $('#codigo').val(bodega.codigo);
                    $('#nombre').val(bodega.nombre);
                    $('#ubicacion').val(bodega.ubicacion);
                    $('#dotacion').val(bodega.dotacion);
                    $('#activa').val(bodega.activa === true || bodega.activa === 'true' ? 'true' : 'false');
                    
                    // Cargar encargados asignados
                    BodegasModule.loadAssignedEncargados(id);
                }
                App.hideLoading();
            },
            error: function(xhr) {
                console.error('Error cargando datos:', xhr);
                App.showNotification('Error al cargar los datos de la bodega', 'error');
                App.hideLoading();
            }
        });
    },

    // Cargar encargados asignados a la bodega
    loadAssignedEncargados: function(bodegaId) {
        $.ajax({
            url: '/api/bodegas.php',
            method: 'GET',
            data: {
                action: 'encargados',
                id: bodegaId
            },
            success: function(encargadosAsignados) {
                // Marcar los checkboxes de los encargados asignados
                encargadosAsignados.forEach(function(encargado) {
                    $(`#enc_${encargado.id}`).prop('checked', true);
                });
                // Actualizar la vista de seleccionados
                BodegasModule.updateSelectedEncargados();
            },
            error: function(xhr) {
                console.error('Error cargando encargados asignados:', xhr);
            }
        });
    },

    // Mostrar detalles
    showDetails: function(id) {
        console.log('Mostrando detalles de bodega:', id);
        
        // Obtener template pre-cargado
        const $template = $('#bodegas-details-template');
        if ($template.length === 0) {
            console.error('Template de detalles no encontrado');
            App.showNotification('Error: Template de detalles no encontrado', 'error');
            return;
        }
        
        App.showLoading();
        
        const self = this;
        $.ajax({
            url: '/api/bodegas.php',
            method: 'GET',
            data: {
                action: 'show',
                id: id
            },
            success: function(response) {
                if (response) {
                    self.renderDetails(response, id, $template);
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
    renderDetails: function(bodega, id, $template) {
        // Clonar template
        const $detailsClone = $template.clone();
        $detailsClone.removeClass('template d-none').removeAttr('id');
        
        // Renderizar modal con template clonado
        App.renderModal($detailsClone.html());
        
        // Llenar datos en el template
        $('#detail-codigo').text(bodega.codigo);
        $('#detail-nombre').text(bodega.nombre);
        $('#detail-ubicacion').text(bodega.ubicacion);
        $('#detail-dotacion').text(parseFloat(bodega.dotacion).toLocaleString());
        
        // Estado
        const estadoBadge = bodega.activa === true || bodega.activa === 'true'
            ? '<span class="badge bg-success">Activa</span>' 
            : '<span class="badge bg-danger">Inactiva</span>';
        $('#detail-estado').html(estadoBadge);
        
        // Fechas
        if (bodega.created_at) {
            $('#detail-created').text(new Date(bodega.created_at).toLocaleDateString('es-ES'));
        }
        if (bodega.updated_at) {
            $('#detail-updated').text(new Date(bodega.updated_at).toLocaleDateString('es-ES'));
        }
        
        // Evento para botón editar
        const self = this;
        $('#edit-detail-btn').on('click', function() {
            // Cerrar modal actual y abrir formulario
            $('.modal').modal('hide');
            setTimeout(() => {
                self.showForm(id);
            }, 300);
        });
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
    },

    // === FUNCIONES PARA SELECTOR MÚLTIPLE DE ENCARGADOS ===
    
    // Cargar lista de encargados disponibles
    loadEncargados: function() {
        $.ajax({
            url: '/api/encargados.php',
            method: 'GET',
            data: { action: 'all' },
            success: function(response) {
                BodegasModule.renderEncargadosList(response);
            },
            error: function(xhr) {
                console.error('Error cargando encargados:', xhr);
                $('#encargados-list').html('<div class="text-danger text-center py-3">Error cargando encargados</div>');
            }
        });
    },

    // Renderizar lista de encargados en el dropdown
    renderEncargadosList: function(encargados) {
        const $list = $('#encargados-list');
        $list.empty();

        if (!encargados || encargados.length === 0) {
            $list.html('<div class="text-muted text-center py-3">No hay encargados disponibles</div>');
            return;
        }

        encargados.forEach(encargado => {
            const $item = $(`
                <div class="encargado-checkbox-item" data-id="${encargado.id}">
                    <input type="checkbox" id="enc_${encargado.id}" value="${encargado.id}">
                    <label for="enc_${encargado.id}" class="form-check-label">
                        <div class="encargado-info">
                            <span class="encargado-name">${encargado.nombre} ${encargado.apellido}</span>
                            <span class="encargado-details">${encargado.cargo} • ${encargado.email}</span>
                        </div>
                    </label>
                </div>
            `);
            $list.append($item);
        });
    },

    // Configurar eventos del selector múltiple
    setupMultiSelect: function() {
        const self = this;

        // Evento para el buscador
        $('#search-encargados').on('input', function() {
            const searchTerm = $(this).val().toLowerCase();
            $('.encargado-checkbox-item').each(function() {
                const text = $(this).text().toLowerCase();
                $(this).toggle(text.includes(searchTerm));
            });
        });

        // Prevenir que el dropdown se cierre al hacer clic dentro
        $(document).on('click', '.dropdown-menu', function(e) {
            e.stopPropagation();
        });

        // Evento para los checkboxes
        $(document).on('change', '#encargados-list input[type="checkbox"]', function() {
            self.updateSelectedEncargados();
        });

        // Evento para quitar encargados seleccionados
        $(document).on('click', '.remove-item', function() {
            const encargadoId = $(this).data('id');
            $(`#enc_${encargadoId}`).prop('checked', false);
            self.updateSelectedEncargados();
        });

        // Validación en tiempo real
        $(document).on('change', '#encargados-list input[type="checkbox"]', function() {
            self.validateEncargados();
        });
    },

    // Actualizar la vista de encargados seleccionados
    updateSelectedEncargados: function() {
        const $selectedContainer = $('#selected-encargados');
        const $hiddenInputs = $('#encargados-hidden-inputs');
        const selectedCheckboxes = $('#encargados-list input[type="checkbox"]:checked');

        // Limpiar contenedores
        $selectedContainer.empty();
        $hiddenInputs.empty();

        if (selectedCheckboxes.length === 0) {
            $selectedContainer.html('<small class="text-muted">Ningún encargado seleccionado</small>');
            return;
        }

        // Agregar encargados seleccionados
        selectedCheckboxes.each(function() {
            const $checkbox = $(this);
            const encargadoId = $checkbox.val();
            const $item = $checkbox.closest('.encargado-checkbox-item');
            const nombreCompleto = $item.find('.encargado-name').text();

            // Agregar badge visual
            const $badge = $(`
                <span class="selected-item" data-id="${encargadoId}">
                    ${nombreCompleto}
                    <button type="button" class="remove-item" data-id="${encargadoId}">×</button>
                </span>
            `);
            $selectedContainer.append($badge);

            // Agregar input hidden para envío
            const $hiddenInput = $(`<input type="hidden" name="encargados[]" value="${encargadoId}">`);
            $hiddenInputs.append($hiddenInput);
        });
    },

    // Validar que se haya seleccionado al menos un encargado
    validateEncargados: function() {
        const selectedCount = $('#encargados-list input[type="checkbox"]:checked').length;
        const $container = $('.multi-select-container');
        const $error = $('#encargados-error');

        if (selectedCount === 0) {
            $container.addClass('is-invalid');
            $error.show();
            return false;
        } else {
            $container.removeClass('is-invalid');
            $error.hide();
            return true;
        }
    }
};
