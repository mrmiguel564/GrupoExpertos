<?php

class EncargadoController
{
    public function apiIndex()
    {
        try {
            $encargadoModel = new Encargado();
            $encargados = $encargadoModel->readAll();
            echo json_encode($encargados);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiShow($id)
    {
        try {
            $encargadoModel = new Encargado();
            $encargado = $encargadoModel->readById($id);
            if (!$encargado) {
                http_response_code(404);
                echo json_encode(['error' => 'Encargado no encontrado']);
                return;
            }
            echo json_encode(['data' => $encargado]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function apiStore()
    {
        try {
            $encargadoModel = new Encargado();
            $data = [
                'nombre' => $_POST['nombre'] ?? '',
                'apellido' => $_POST['apellido'] ?? '',
                'email' => $_POST['email'] ?? '',
                'telefono' => $_POST['telefono'] ?? null,
                'cargo' => $_POST['cargo'] ?? '',
                'fecha_ingreso' => $_POST['fecha_ingreso'] ?? date('Y-m-d'),
                'estado' => $_POST['estado'] ?? 'activo',
                'observaciones' => $_POST['observaciones'] ?? null
            ];
            
            if (isset($_POST['id']) && !empty($_POST['id'])) {
                // Actualizar
                $result = $encargadoModel->update($_POST['id'], $data);
                if ($result['success']) {
                    echo json_encode(['message' => 'Encargado actualizado exitosamente']);
                } else {
                    http_response_code(400);
                    echo json_encode(['error' => $result['message']]);
                }
            } else {
                // Crear
                $result = $encargadoModel->create($data);
                if ($result['success']) {
                    echo json_encode(['message' => 'Encargado creado exitosamente']);
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
            $encargadoModel = new Encargado();
            $result = $encargadoModel->delete($id);
            if ($result) {
                echo json_encode(['message' => 'Encargado eliminado exitosamente']);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Error al eliminar el encargado']);
            }
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
