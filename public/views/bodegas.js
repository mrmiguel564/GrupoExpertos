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

            // Generar lista de encargados
            let encargadosHtml = '';
            if (bodega.encargados && bodega.encargados.length > 0) {
                const encargadosItems = bodega.encargados.map(encargado => 
                    `<span class="badge bg-primary">
                        <i class="bi bi-person"></i> ${encargado.nombre} ${encargado.apellido}
                    </span>`
                ).join('');
                encargadosHtml = `<div class="encargados-list">${encargadosItems}</div>`;
            } else {
                encargadosHtml = '<span class="text-muted"><i class="bi bi-person-x"></i> Sin encargados</span>';
            }

            const $row = $(`
                <tr>
                    <td><code>${bodega.codigo || 'N/A'}</code></td>
                    <td><strong>${bodega.nombre}</strong></td>
                    <td>${bodega.ubicacion}</td>
                    <td>${parseInt(bodega.dotacion || 0)}</td>
                    <td>
                        ${encargadosHtml}
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
            // Establecer estado por defecto
            $('#activa').val('true');
        }
        
        // Configurar validaciones
        this.setupValidations();
    },

    // Configurar validaciones del formulario
    setupValidations: function() {
        // Validación en tiempo real para código
        $('#codigo').on('input', function() {
            BodegasModule.validateField(this);
        });

        // Validación en tiempo real para nombre
        $('#nombre').on('input', function() {
            BodegasModule.validateField(this);
        });

        // Validación en tiempo real para ubicación
        $('#ubicacion').on('input', function() {
            BodegasModule.validateField(this);
        });

        // Validación en tiempo real para dotación
        $('#dotacion').on('input', function() {
            BodegasModule.validateField(this);
        });

        // Validación del formulario completo antes del envío
        $('#bodega-form').on('submit', function(e) {
            if (!BodegasModule.validateForm()) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
        });
    },

    // Validar campo individual
    validateField: function(field) {
        const $field = $(field);
        const value = $field.val().trim();
        const fieldName = $field.attr('name');
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'codigo':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El código es obligatorio';
                } else if (value.length > 5) {
                    isValid = false;
                    errorMessage = 'El código no puede tener más de 5 caracteres';
                } else if (!/^[A-Za-z0-9]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'El código solo puede contener letras y números';
                }
                break;

            case 'nombre':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El nombre es obligatorio';
                } else if (value.length < 3) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 3 caracteres';
                } else if (value.length > 100) {
                    isValid = false;
                    errorMessage = 'El nombre no puede tener más de 100 caracteres';
                }
                break;

            case 'ubicacion':
                if (!value) {
                    isValid = false;
                    errorMessage = 'La ubicación es obligatoria';
                } else if (value.length < 5) {
                    isValid = false;
                    errorMessage = 'La ubicación debe tener al menos 5 caracteres';
                } else if (value.length > 200) {
                    isValid = false;
                    errorMessage = 'La ubicación no puede tener más de 200 caracteres';
                }
                break;

            case 'dotacion':
                if (!value) {
                    isValid = false;
                    errorMessage = 'La dotación es obligatoria';
                } else if (isNaN(value) || parseFloat(value) < 0) {
                    isValid = false;
                    errorMessage = 'La dotación debe ser un número mayor o igual a 0';
                }
                break;
        }

        // Aplicar clases de validación
        if (isValid) {
            $field.removeClass('is-invalid').addClass('is-valid');
            $field.siblings('.invalid-feedback').hide();
        } else {
            $field.removeClass('is-valid').addClass('is-invalid');
            $field.siblings('.invalid-feedback').text(errorMessage).show();
        }

        return isValid;
    },

    // Validar todo el formulario
    validateForm: function() {
        let isValid = true;

        // Validar campos básicos
        ['codigo', 'nombre', 'ubicacion', 'dotacion'].forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Validar encargados
        if (!this.validateEncargados()) {
            isValid = false;
        }

        // Validar estado
        const estado = $('#activa').val();
        if (!estado) {
            $('#activa').addClass('is-invalid');
            isValid = false;
        } else {
            $('#activa').removeClass('is-invalid').addClass('is-valid');
        }

        return isValid;
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
                    console.log('Datos de bodega cargados:', bodega);
                    // Llenar formulario con los datos
                    $('#codigo').val(bodega.codigo);
                    $('#nombre').val(bodega.nombre);
                    $('#ubicacion').val(bodega.ubicacion);
                    $('#dotacion').val(bodega.dotacion);
                    $('#activa').val(bodega.activa === true || bodega.activa === 'true' ? 'true' : 'false');
                    

                    bodega.encargados.forEach(function(encargado) {
                        $(`#enc_${encargado.id}`).prop('checked', true);
                    });

                    BodegasModule.updateSelectedEncargados();
                    BodegasModule.validateField('#codigo');
                    BodegasModule.validateField('#nombre');
                    BodegasModule.validateField('#ubicacion');
                    BodegasModule.validateField('#dotacion');

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
        $('#detail-codigo').text(bodega.codigo || 'N/A');
        $('#detail-nombre').text(bodega.nombre || 'Sin nombre');
        $('#detail-ubicacion').text(bodega.ubicacion || 'Sin ubicación');
        $('#detail-dotacion').text(`${parseInt(bodega.dotacion || 0)}`);
        
        // Estado
        const estadoBadge = bodega.activa === true || bodega.activa === 'true'
            ? '<span class="badge bg-success fs-6"><i class="bi bi-check-circle me-1"></i>Activa</span>' 
            : '<span class="badge bg-danger fs-6"><i class="bi bi-x-circle me-1"></i>Inactiva</span>';
        $('#detail-estado').html(estadoBadge);
        
        // Fechas con formato mejorado
        if (bodega.created_at) {
            const fechaCreacion = new Date(bodega.created_at);
            $('#detail-created').html(`
                <i class="bi bi-calendar-plus me-1"></i>
                ${fechaCreacion.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
                <br><span class="text-muted" style="font-size: 0.75rem;">${fechaCreacion.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
            `);
        } else {
            $('#detail-created').html('<span class="text-muted">No disponible</span>');
        }
        
        if (bodega.updated_at) {
            const fechaActualizacion = new Date(bodega.updated_at);
            $('#detail-updated').html(`
                <i class="bi bi-calendar-check me-1"></i>
                ${fechaActualizacion.toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                })}
                <br><span class="text-muted" style="font-size: 0.75rem;">${fechaActualizacion.toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                })}</span>
            `);
        } else {
            $('#detail-updated').html('<span class="text-muted">No disponible</span>');
        }
        
        // Renderizar encargados
        this.renderEncargadosDetails(bodega.encargados || []);
        
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

    // Renderizar lista de encargados en los detalles
    renderEncargadosDetails: function(encargados) {
        const $container = $('#detail-encargados-list');
        const $emptyState = $('#detail-encargados-empty');
        
        // Limpiar contenedor
        $container.empty();
        
        if (!encargados || encargados.length === 0) {
            // Mostrar estado vacío
            $container.hide();
            $emptyState.show();
            return;
        }
        
        // Ocultar estado vacío y mostrar lista
        $emptyState.hide();
        $container.show();
        
        // Generar cards para cada encargado
        encargados.forEach(encargado => {
            const $encargadoCard = $(`
                <div class="encargado-detail-item mb-2">
                    <div class="d-flex align-items-center p-2 border rounded bg-white">
                        <div class="flex-shrink-0 me-2">
                            <div class="avatar-circle bg-primary text-white">
                                <i class="bi bi-person"></i>
                            </div>
                        </div>
                        <div class="flex-grow-1">
                            <div class="fw-bold text-dark mb-1">
                                ${encargado.nombre || 'Sin nombre'} ${encargado.apellido || ''}
                            </div>
                            <div class="small text-muted">
                                <i class="bi bi-envelope me-1"></i>
                                ${encargado.email || 'Sin email'}
                            </div>
                            ${encargado.telefono ? `
                                <div class="small text-muted">
                                    <i class="bi bi-telephone me-1"></i>
                                    ${encargado.telefono}
                                </div>
                            ` : ''}
                        </div>
                        <div class="flex-shrink-0 d-none d-md-block">
                            <span class="badge bg-light text-dark border">
                                <i class="bi bi-person-check me-1"></i>
                                Asignado
                            </span>
                        </div>
                    </div>
                </div>
            `);
            $container.append($encargadoCard);
        });
        
        // Agregar contador de encargados
        const $contador = $(`
            <div class="mt-2 text-center">
                <small class="text-muted">
                    <i class="bi bi-people me-1"></i>
                    Total: ${encargados.length} encargado${encargados.length !== 1 ? 's' : ''} asignado${encargados.length !== 1 ? 's' : ''}
                </small>
            </div>
        `);
        $container.append($contador);
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
            data: { 
                action: 'all' 
            },
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
                            <span class="encargado-details">${encargado.email}</span>
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

            // Agregar input hidden para envío (usando el nombre correcto)
            const $hiddenInput = $(`<input type="hidden" name="encargados[]" value="${encargadoId}">`);
            $hiddenInputs.append($hiddenInput);
        });

        // También agregar un input con todos los IDs separados por coma (para compatibilidad)
        const allIds = [];
        selectedCheckboxes.each(function() {
            allIds.push($(this).val());
        });
        if (allIds.length > 0) {
            const $commaInput = $(`<input type="hidden" name="encargados" value="${allIds.join(',')}">`);
            $hiddenInputs.append($commaInput);
        }
        this.validateEncargados();
    },

    // Validar que se haya seleccionado al menos un encargado
    validateEncargados: function() {
        const selectedCount = $('#encargados-list input[type="checkbox"]:checked').length;
        const $container = $('.multi-select-container');
        const $error = $('#encargados-error');

        if (selectedCount === 0) {
            $container.addClass('is-invalid');
            $error.text('Debe seleccionar al menos un encargado').show();
            return false;
        } else {
            $container.removeClass('is-invalid');
            $error.hide();
            return true;
        }
    }
};
