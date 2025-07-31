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
                'id' => $_POST['id'] ?? '',
                'nombre' => $_POST['nombre'] ?? '',
                'codigo' => $_POST['codigo'] ?? '',
                'ubicacion' => $_POST['ubicacion'] ?? '',
                'dotacion' => $_POST['dotacion'] ?? 0,
                'estado' => $_POST['estado'] ?? 'activa',
                'encargados' => $_POST['encargados'] ?? []
            ];
            
            $result = $bodegaModel->save($data);
            if ($result['success']) {
                echo json_encode(['message' => 'Bodega actualizada exitosamente']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => $result['message']]);
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
    
}
