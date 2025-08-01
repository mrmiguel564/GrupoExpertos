<?php

class Bodega 
{
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function readAll() {
        // Obtener todas las bodegas
        $sql = "SELECT * FROM bodegas ORDER BY id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $bodegas = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Para cada bodega, obtener sus encargados
        foreach ($bodegas as &$bodega) {
            $bodega['encargados'] = $this->getEncargadosByBodegaId($bodega['id']);
        }
        
        return $bodegas;
    }
    
    public function readById($id) {
        $sql = "SELECT * FROM bodegas WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $bodega = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($bodega) {
            // Agregar los encargados asignados a esta bodega
            $bodega['encargados'] = $this->getEncargadosByBodegaId($id);
        }
        
        return $bodega;
    }
    
    private function getEncargadosByBodegaId($bodegaId) {
        $sql = "SELECT e.id, e.nombre, e.p_apellido, e.s_apellido, e.email, e.telefono,
                       be.fecha_asignacion
                FROM bodega_encargado be
                INNER JOIN encargados e ON be.encargado_id = e.id
                WHERE be.bodega_id = ?
                ORDER BY e.nombre, e.p_apellido";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$bodegaId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Función unificada para crear y actualizar bodegas con asignaciones
     * @param array $data Datos de la bodega
     * @param int|null $id ID de la bodega (null para crear, ID para actualizar)
     * @return array Resultado de la operación
     */
    public function save($data) {
        try {
            $this->db->beginTransaction();            

            // Validar encargados
            if (!isset($data['encargados']) || empty($data['encargados'])) {
                return [
                    'success' => false, 
                    'message' => 'Debe proporcionar al menos un encargado'
                ];
            }
            
            // Validar que los encargados existan
            $encargadosIds = $this->validateEncargados($data['encargados']);
            if (empty($encargadosIds)) {
                return [
                    'success' => false, 
                    'message' => 'Los encargados proporcionados no son válidos'
                ];
            }
            
            // Convertir activa a boolean
            $activa = isset($data['activa']) ? ($data['activa'] === 'true' || $data['activa'] === true) : true;

            if (is_numeric($data['id'])) {
                // Actualizar bodega existente
                $sql = "UPDATE bodegas SET nombre = ?, codigo = ?, ubicacion = ?, dotacion = ?, activa = ? WHERE id = ?";
                $stmt = $this->db->prepare($sql);
                $result = $stmt->execute([
                    $data['nombre'],
                    $data['codigo'],
                    $data['ubicacion'],
                    $data['dotacion'],
                    $activa,
                    $data['id']
                ]);
                $bodegaId = $data['id'];
                $action = 'actualizada';
            } else {
                // Crear nueva bodega
                $sql = "INSERT INTO bodegas (nombre, codigo, ubicacion, dotacion, activa) VALUES (?, ?, ?, ?, ?)";
                $stmt = $this->db->prepare($sql);
                $result = $stmt->execute([
                    $data['nombre'],
                    $data['codigo'],
                    $data['ubicacion'],
                    $data['dotacion'],
                    $activa
                ]);
                $bodegaId = $this->db->lastInsertId();
                $action = 'creada';
            }
            
            if ($result) {
                // Borrar asignaciones existentes (si es actualización o crear limpio)
                $this->removeAllEncargados($bodegaId);
                
                // Crear nuevas asignaciones
                $this->assignEncargados($bodegaId, $encargadosIds);
                
                $this->db->commit();
                return [
                    'success' => true,
                    'message' => "Bodega {$action} exitosamente",
                    'id' => $bodegaId
                ];
            } else {
                $this->db->rollback();
                return [
                    'success' => false,
                    'message' => "Error al {$action} la bodega"
                ];
            }
        } catch (Exception $e) {
            $this->db->rollback();
            return [
                'success' => false,
                'message' => 'Error: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Valida que los encargados existan en la base de datos
     * @param mixed $encargados Array o string con IDs de encargados
     * @return array Array de IDs válidos
     */
    private function validateEncargados($encargados) {
        // Convertir a array si es string
        if (is_string($encargados)) {
            $encargados = explode(',', $encargados);
        }
        
        // Limpiar y filtrar IDs
        $encargados = array_filter(array_map('trim', $encargados), function($id) {
            return is_numeric($id) && $id > 0;
        });
        
        if (empty($encargados)) {
            return [];
        }
        
        // Construir placeholders para la consulta preparada
        $placeholders = str_repeat('?,', count($encargados) - 1) . '?';
        $sql = "SELECT id FROM encargados WHERE id IN ({$placeholders})";
        $stmt = $this->db->prepare($sql);
        $stmt->execute($encargados);
        
        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    /**
     * Asigna encargados a una bodega
     * @param int $bodegaId ID de la bodega
     * @param array $encargadosIds Array con IDs de encargados
     */
    private function assignEncargados($bodegaId, $encargadosIds) {
        $sql = "INSERT INTO bodega_encargado (bodega_id, encargado_id, fecha_asignacion) VALUES (?, ?, NOW())";
        $stmt = $this->db->prepare($sql);
        
        foreach ($encargadosIds as $encargadoId) {
            $stmt->execute([$bodegaId, $encargadoId]);
        }
    }

    /**
     * Elimina todos los encargados asignados a una bodega
     * @param int $bodegaId ID de la bodega
     */
    private function removeAllEncargados($bodegaId) {
        $sql = "DELETE FROM bodega_encargado WHERE bodega_id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$bodegaId]);
    }

    public function delete($id) {
        try {
            $this->db->beginTransaction();
            
            // Primero eliminar las asignaciones
            $this->removeAllEncargados($id);
            
            // Luego eliminar la bodega
            $sql = "DELETE FROM bodegas WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute([$id]);
            
            if ($result) {
                $this->db->commit();
                return true;
            } else {
                $this->db->rollback();
                return false;
            }
        } catch (Exception $e) {
            $this->db->rollback();
            return false;
        }
    }

    /**
     * Validar datos del formulario
     * @param array $data Datos a validar
     * @return array Resultado de la validación
     */
    private function validateData($data) {
        // Validar código
        if (empty($data['codigo'])) {
            return ['valid' => false, 'message' => 'El código es obligatorio'];
        }
        if (strlen($data['codigo']) > 5) {
            return ['valid' => false, 'message' => 'El código no puede tener más de 5 caracteres'];
        }
        if (!preg_match('/^[A-Za-z0-9]+$/', $data['codigo'])) {
            return ['valid' => false, 'message' => 'El código solo puede contener letras y números'];
        }

        // Validar nombre
        if (empty($data['nombre'])) {
            return ['valid' => false, 'message' => 'El nombre es obligatorio'];
        }
        if (strlen($data['nombre']) < 3) {
            return ['valid' => false, 'message' => 'El nombre debe tener al menos 3 caracteres'];
        }
        if (strlen($data['nombre']) > 100) {
            return ['valid' => false, 'message' => 'El nombre no puede tener más de 100 caracteres'];
        }

        // Validar ubicación
        if (empty($data['ubicacion'])) {
            return ['valid' => false, 'message' => 'La ubicación es obligatoria'];
        }
        if (strlen($data['ubicacion']) < 5) {
            return ['valid' => false, 'message' => 'La ubicación debe tener al menos 5 caracteres'];
        }
        if (strlen($data['ubicacion']) > 200) {
            return ['valid' => false, 'message' => 'La ubicación no puede tener más de 200 caracteres'];
        }

        // Validar dotación
        if (!isset($data['dotacion']) || $data['dotacion'] === '') {
            return ['valid' => false, 'message' => 'La dotación es obligatoria'];
        }
        if (!is_numeric($data['dotacion']) || floatval($data['dotacion']) < 0) {
            return ['valid' => false, 'message' => 'La dotación debe ser un número mayor o igual a 0'];
        }

        return ['valid' => true, 'message' => 'Datos válidos'];
    }

    /**
     * Verificar si existe un código de bodega
     * @param string $codigo Código a verificar
     * @param int|null $excludeId ID a excluir de la búsqueda (para edición)
     * @return bool True si existe, false si no
     */
    private function codeExists($codigo, $excludeId = null) {
        $sql = "SELECT id FROM bodegas WHERE codigo = ?";
        $params = [$codigo];
        
        if ($excludeId) {
            $sql .= " AND id != ?";
            $params[] = $excludeId;
        }
        
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        
        return $stmt->fetch() !== false;
    }
}
