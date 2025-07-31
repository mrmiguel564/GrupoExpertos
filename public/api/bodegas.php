<?php
require_once __DIR__ . '/../../vendor/autoload.php';

// Cargar variables de entorno
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . '/../..');
$dotenv->load();

// Cargar clases necesarias
require_once __DIR__ . '/../../config/Database.php';
require_once __DIR__ . '/../../models/Bodega.php';
require_once __DIR__ . '/../../controllers/BodegaController.php';

// Configurar respuesta JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

try {
    $controller = new BodegaController();
    $method = $_SERVER['REQUEST_METHOD'];
    $action = $_GET['action'] ?? $_POST['action'] ?? '';
    $id = $_GET['id'] ?? $_POST['id'] ?? null;
    
    switch ($method) {
        case 'GET':
            switch ($action) {
                case 'index':
                    $controller->apiIndex();
                    break;
                case 'show':
                    $controller->apiShow($id);
                    break;
                case 'form':
                    $controller->apiForm($id);
                    break;
                default:
                    $controller->apiIndex();
            }
            break;
            
        case 'POST':
            if (isset($_POST['_method']) && $_POST['_method'] === 'DELETE') {
                $controller->apiDelete($id);
            } else {
                $controller->apiStore();
            }
            break;
            
        case 'PUT':
            $controller->apiUpdate($id);
            break;
            
        case 'DELETE':
            $controller->apiDelete($id);
            break;
            
        default:
            throw new Exception('Método HTTP no soportado');
    }
    
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
