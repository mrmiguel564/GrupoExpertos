<?php
/**
 * Modelo Bodega
 * Maneja las operaciones CRUD para la tabla bodega
 */

require_once __DIR__ . '/BaseModel.php';

class Bodega extends BaseModel {
    protected $table = 'bodega';
    
    /**
     * Campos requeridos para crear una bodega
     */
    private $requiredFields = ['nombre'];
    
    /**
     * Crea una nueva bodega
     * @param array $data Datos de la bodega
     * @return array Resultado de la operación con success y mensaje
     */
    public function create($data) {
        // Validar campos requeridos
        $errors = $this->validateRequired($data, $this->requiredFields);
        if (!empty($errors)) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $errors
            ];
        }
        
        // Validaciones adicionales
        if (!$this->validateEmail($data['email'] ?? '')) {
            return [
                'success' => false,
                'message' => 'El email no tiene un formato válido'
            ];
        }
        
        $sql = "INSERT INTO bodega (nombre, direccion, telefono, email, capacidad_maxima, estado) 
                VALUES (?, ?, ?, ?, ?, ?)";
        
        $params = [
            $data['nombre'],
            $data['direccion'] ?? null,
            $data['telefono'] ?? null,
            $data['email'] ?? null,
            $data['capacidad_maxima'] ?? 0,
            $data['estado'] ?? 'activo'
        ];
        
        $stmt = $this->executeQuery($sql, $params);
        
        if ($stmt) {
            return [
                'success' => true,
                'message' => 'Bodega creada exitosamente',
                'id' => $this->db->lastInsertId()
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Error al crear la bodega: ' . $this->getLastError()
        ];
    }
    
    /**
     * Actualiza una bodega existente
     * @param int $id ID de la bodega
     * @param array $data Nuevos datos
     * @return array Resultado de la operación
     */
    public function update($id, $data) {
        // Verificar que la bodega existe
        if (!$this->readById($id)) {
            return [
                'success' => false,
                'message' => 'La bodega no existe'
            ];
        }
        
        // Validar campos requeridos
        $errors = $this->validateRequired($data, $this->requiredFields);
        if (!empty($errors)) {
            return [
                'success' => false,
                'message' => 'Errores de validación',
                'errors' => $errors
            ];
        }
        
        // Validaciones adicionales
        if (!empty($data['email']) && !$this->validateEmail($data['email'])) {
            return [
                'success' => false,
                'message' => 'El email no tiene un formato válido'
            ];
        }
        
        $sql = "UPDATE bodega 
                SET nombre = ?, direccion = ?, telefono = ?, email = ?, 
                    capacidad_maxima = ?, estado = ?
                WHERE id = ?";
        
        $params = [
            $data['nombre'],
            $data['direccion'] ?? null,
            $data['telefono'] ?? null,
            $data['email'] ?? null,
            $data['capacidad_maxima'] ?? 0,
            $data['estado'] ?? 'activo',
            $id
        ];
        
        $stmt = $this->executeQuery($sql, $params);
        
        if ($stmt) {
            return [
                'success' => true,
                'message' => 'Bodega actualizada exitosamente'
            ];
        }
        
        return [
            'success' => false,
            'message' => 'Error al actualizar la bodega: ' . $this->getLastError()
        ];
    }
    
    /**
     * Obtiene todas las bodegas con información de encargados
     * @return array
     */
    public function readAllWithEncargados() {
        $sql = "SELECT b.*, 
                       COUNT(be.encargado_id) as total_encargados,
                       STRING_AGG(e.nombre || ' ' || e.apellido, ', ') as encargados
                FROM bodega b
                LEFT JOIN bodega_encargado be ON b.id = be.bodega_id AND be.estado = 'activo'
                LEFT JOIN encargado e ON be.encargado_id = e.id
                GROUP BY b.id
                ORDER BY b.nombre";
        
        $stmt = $this->executeQuery($sql);
        
        if ($stmt) {
            return $stmt->fetchAll();
        }
        
        return [];
    }
    
    /**
     * Busca bodegas por nombre
     * @param string $nombre
     * @return array
     */
    public function searchByName($nombre) {
        $sql = "SELECT * FROM bodega WHERE nombre ILIKE ? ORDER BY nombre";
        $stmt = $this->executeQuery($sql, ["%{$nombre}%"]);
        
        if ($stmt) {
            return $stmt->fetchAll();
        }
        
        return [];
    }
    
    /**
     * Obtiene bodegas por estado
     * @param string $estado
     * @return array
     */
    public function getByEstado($estado = 'activo') {
        $sql = "SELECT * FROM bodega WHERE estado = ? ORDER BY nombre";
        $stmt = $this->executeQuery($sql, [$estado]);
        
        if ($stmt) {
            return $stmt->fetchAll();
        }
        
        return [];
    }
    
    /**
     * Valida formato de email
     * @param string $email
     * @return bool
     */
    private function validateEmail($email) {
        if (empty($email)) {
            return true; // Email es opcional
        }
        
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    /**
     * Obtiene encargados asignados a una bodega
     * @param int $bodegaId
     * @return array
     */
    public function getEncargados($bodegaId) {
        $sql = "SELECT e.*, be.es_principal, be.fecha_asignacion
                FROM encargado e
                INNER JOIN bodega_encargado be ON e.id = be.encargado_id
                WHERE be.bodega_id = ? AND be.estado = 'activo'
                ORDER BY be.es_principal DESC, e.nombre";
        
        $stmt = $this->executeQuery($sql, [$bodegaId]);
        
        if ($stmt) {
            return $stmt->fetchAll();
        }
        
        return [];
    }
}
