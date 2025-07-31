<?php

class Bodega 
{
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function readAll() {
        $sql = "SELECT * FROM bodegas ORDER BY id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function readById($id) {
        $sql = "SELECT * FROM bodegas WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $sql = "INSERT INTO bodegas (nombre, codigo, ubicacion, dotacion, activa) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['nombre'],
            $data['codigo'],
            $data['ubicacion'],
            $data['dotacion'],
            $data['activa'] ?? true
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Bodega creada exitosamente' : 'Error al crear la bodega'
        ];
    }
    
    public function update($id, $data) {
        $sql = "UPDATE bodegas SET nombre = ?, codigo = ?, ubicacion = ?, dotacion = ?, activa = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['nombre'],
            $data['codigo'],
            $data['ubicacion'],
            $data['dotacion'],
            $data['activa'] ?? true,
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
