<?php

class AsignacionController
{
    public function apiIndex()
    {
        try {
            $asignacionModel = new BodegaEncargado();
            $asignaciones = $asignacionModel->readAll();
            echo json_encode($asignaciones);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiShow($id)
    {
        try {
            $asignacionModel = new BodegaEncargado();
            $asignacion = $asignacionModel->readById($id);
            if (!$asignacion) {
                http_response_code(404);
                echo json_encode(['error' => 'Asignación no encontrada']);
                return;
            }
            echo json_encode(['data' => $asignacion]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    public function apiStore()
    {
        try {
            $asignacionModel = new BodegaEncargado();
            $data = [
                'bodega_id' => $_POST['bodega_id'] ?? '',
                'encargado_id' => $_POST['encargado_id'] ?? '',
                'fecha_asignacion' => $_POST['fecha_asignacion'] ?? date('Y-m-d'),
 
            ];
            
            if (isset($_POST['id']) && !empty($_POST['id'])) {
                // Actualizar
                $asignacionModel->update($_POST['id'], $data);
                echo json_encode(['message' => 'Asignación actualizada exitosamente']);
            } else {
                // Crear
                $asignacionModel->create($data);
                echo json_encode(['message' => 'Asignación creada exitosamente']);
            }
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiDelete($id)
    {
        try {
            $asignacionModel = new BodegaEncargado();
            $asignacionModel->delete($id);
            echo json_encode(['message' => 'Asignación eliminada exitosamente']);
        } catch (Exception $e) {
            http_response_code(400);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiForm($id = null)
    {
        // Formulario estático manejado por JavaScript
        echo json_encode(['message' => 'Formulario manejado por JavaScript']);
    }
}
