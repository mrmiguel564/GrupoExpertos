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
        $sql = "SELECT e.id, e.nombre, e.apellido, e.email, e.telefono, e.fecha_ingreso,
                       be.fecha_asignacion, be.observaciones as observaciones_asignacion
                FROM bodega_encargado be
                INNER JOIN encargados e ON be.encargado_id = e.id
                WHERE be.bodega_id = ?
                ORDER BY e.nombre, e.apellido";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$bodegaId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $sql = "INSERT INTO bodegas (nombre, codigo, ubicacion, dotacion, activa) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        
        // Convertir activa a boolean
        $activa = isset($data['activa']) ? ($data['activa'] === 'true' || $data['activa'] === true) : true;
        
        $result = $stmt->execute([
            $data['nombre'],
            $data['codigo'],
            $data['ubicacion'],
            $data['dotacion'],
            $activa
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Bodega creada exitosamente' : 'Error al crear la bodega'
        ];
    }
    
    public function update($id, $data) {
        $sql = "UPDATE bodegas SET nombre = ?, codigo = ?, ubicacion = ?, dotacion = ?, activa = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        // Convertir activa a boolean
        $activa = isset($data['activa']) ? ($data['activa'] === 'true' || $data['activa'] === true) : true;
        
        $result = $stmt->execute([
            $data['nombre'],
            $data['codigo'],
            $data['ubicacion'],
            $data['dotacion'],
            $activa,
            $id
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Bodega actualizada exitosamente' : 'Error al actualizar la bodega'
        ];
    }
    
    public function delete($id) {
        $sql = "DELETE FROM bodegas WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }
}
