<?php

class BodegaController
{
    public function apiIndex()
    {
        try {
            $bodegaModel = new Bodega();
            $bodegas = $bodegaModel->readAll();
            echo json_encode($bodegas);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiShow($id)
    {
        try {
            $bodegaModel = new Bodega();
            $bodega = $bodegaModel->readById($id);
            if (!$bodega) {
                http_response_code(404);
                echo json_encode(['error' => 'Bodega no encontrada']);
                return;
            }
            echo json_encode($bodega);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiStore()
    {
        try {
            $bodegaModel = new Bodega();
            $data = [
                'nombre' => $_POST['nombre'] ?? '',
                'codigo' => $_POST['codigo'] ?? '',
                'ubicacion' => $_POST['ubicacion'] ?? '',
                'dotacion' => $_POST['dotacion'] ?? 0,
                'estado' => $_POST['estado'] ?? 'activa'
            ];
            
            if (isset($_POST['id']) && !empty($_POST['id'])) {
                // Actualizar
                $result = $bodegaModel->update($_POST['id'], $data);
                if ($result['success']) {
                    echo json_encode(['message' => 'Bodega actualizada exitosamente']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => $result['message']]);
                }
            } else {
                // Crear
                $result = $bodegaModel->create($data);
                if ($result['success']) {
                    echo json_encode(['message' => 'Bodega creada exitosamente']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => $result['message']]);
                }
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiDelete($id)
    {
        try {
            $bodegaModel = new Bodega();
            $result = $bodegaModel->delete($id);
            if ($result) {
                echo json_encode(['message' => 'Bodega eliminada exitosamente']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Error al eliminar la bodega']);
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiForm($id = null)
    {
        // Formulario estático que no requiere datos del servidor
        $bodega = null;
        if ($id) {
            try {
                $bodegaModel = new Bodega();
                $bodega = $bodegaModel->readById($id);
            } catch (Exception $e) {
                // Si hay error, continúa con bodega null
            }
        }
        
        $html = $this->generateBodegaForm($bodega);
        echo json_encode(['html' => $html]);
    }
    
    private function generateBodegaForm($bodega = null)
    {
        $isEdit = $bodega !== null;
        $title = $isEdit ? 'Editar Bodega' : 'Nueva Bodega';
        
        return '
        <div class="modal-header">
            <h5 class="modal-title">' . $title . '</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
            <form id="bodega-form" data-ajax="true">
                <input type="hidden" name="api" value="store">
                <input type="hidden" name="module" value="bodegas">
                ' . ($isEdit ? '<input type="hidden" name="id" value="' . $bodega['id'] . '">' : '') . '
                
                <div class="mb-3">
                    <label for="nombre" class="form-label">Nombre *</label>
                    <input type="text" class="form-control" id="nombre" name="nombre" 
                           value="' . ($bodega['nombre'] ?? '') . '" required>
                </div>
                
                <div class="mb-3">
                    <label for="codigo" class="form-label">Código *</label>
                    <input type="text" class="form-control" id="codigo" name="codigo" 
                           value="' . ($bodega['codigo'] ?? '') . '" required>
                </div>
                
                <div class="mb-3">
                    <label for="ubicacion" class="form-label">Ubicación *</label>
                    <input type="text" class="form-control" id="ubicacion" name="ubicacion" 
                           value="' . ($bodega['ubicacion'] ?? '') . '" required>
                </div>
                
                <div class="mb-3">
                    <label for="dotacion" class="form-label">dotacion (m²) *</label>
                    <input type="number" class="form-control" id="dotacion" name="dotacion" 
                           value="' . ($bodega['dotacion'] ?? '') . '" min="1" step="0.01" required>
                </div>
                
                <div class="mb-3">
                    <label for="estado" class="form-label">Estado</label>
                    <select class="form-select" id="estado" name="estado">
                        <option value="activa"' . (($bodega['estado'] ?? 'activa') === 'activa' ? ' selected' : '') . '>Activa</option>
                        <option value="inactiva"' . (($bodega['estado'] ?? '') === 'inactiva' ? ' selected' : '') . '>Inactiva</option>
                    </select>
                </div>
            </form>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="submit" form="bodega-form" class="btn btn-primary">
                ' . ($isEdit ? 'Actualizar' : 'Guardar') . '
            </button>
        </div>';
    }
}
