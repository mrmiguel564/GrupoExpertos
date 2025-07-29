<?php
/**
 * Modelo base con funcionalidades comunes para todos los modelos
 * Proporciona métodos básicos de CRUD y manejo de errores
 */

require_once __DIR__ . '/../config/Database.php';

abstract class BaseModel {
    protected $db;
    protected $table;
    protected $primaryKey = 'id';
    
    /**
     * Constructor que inicializa la conexión a la base de datos
     */
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    /**
     * Ejecuta una consulta preparada con manejo de errores
     * @param string $sql
     * @param array $params
     * @return PDOStatement|false
     */
    protected function executeQuery($sql, $params = []) {
        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Error en consulta SQL: " . $e->getMessage());
            return false;
        }
    }
    
    /**
     * Obtiene todos los registros de la tabla
     * @return array
     */
    public function readAll() {
        $sql = "SELECT * FROM {$this->table} ORDER BY {$this->primaryKey}";
        $stmt = $this->executeQuery($sql);
        
        if ($stmt) {
            return $stmt->fetchAll();
        }
        
        return [];
    }
    
    /**
     * Obtiene un registro por su ID
     * @param int $id
     * @return array|null
     */
    public function readById($id) {
        $sql = "SELECT * FROM {$this->table} WHERE {$this->primaryKey} = ?";
        $stmt = $this->executeQuery($sql, [$id]);
        
        if ($stmt) {
            return $stmt->fetch();
        }
        
        return null;
    }
    
    /**
     * Elimina un registro por su ID
     * @param int $id
     * @return bool
     */
    public function delete($id) {
        $sql = "DELETE FROM {$this->table} WHERE {$this->primaryKey} = ?";
        $stmt = $this->executeQuery($sql, [$id]);
        
        return $stmt !== false;
    }
    
    /**
     * Obtiene el último error de la base de datos
     * @return string
     */
    public function getLastError() {
        $errorInfo = $this->db->errorInfo();
        return $errorInfo[2] ?? 'Error desconocido';
    }
    
    /**
     * Valida que los campos requeridos estén presentes
     * @param array $data
     * @param array $requiredFields
     * @return array Array de errores (vacío si no hay errores)
     */
    protected function validateRequired($data, $requiredFields) {
        $errors = [];
        
        foreach ($requiredFields as $field) {
            if (!isset($data[$field]) || trim($data[$field]) === '') {
                $errors[] = "El campo {$field} es requerido";
            }
        }
        
        return $errors;
    }
}
