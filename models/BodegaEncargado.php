<?php

class BodegaEncargado 
{
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function readAll() {
        $sql = "SELECT be.*, b.nombre as bodega_nombre, e.nombre as encargado_nombre, e.apellido as encargado_apellido
                FROM bodega_encargado be
                LEFT JOIN bodegas b ON be.bodega_id = b.id
                LEFT JOIN encargados e ON be.encargado_id = e.id
                ORDER BY be.id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function readById($id) {
        $sql = "SELECT be.*, b.nombre as bodega_nombre, e.nombre as encargado_nombre, e.apellido as encargado_apellido
                FROM bodega_encargado be
                LEFT JOIN bodegas b ON be.bodega_id = b.id
                LEFT JOIN encargados e ON be.encargado_id = e.id
                WHERE be.id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $sql = "INSERT INTO bodega_encargado (bodega_id, encargado_id, fecha_asignacion, observaciones) 
                VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['bodega_id'],
            $data['encargado_id'],
            $data['fecha_asignacion'],
            $data['observaciones']
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Asignación creada exitosamente' : 'Error al crear la asignación'
        ];
    }
    
    public function update($id, $data) {
        $sql = "UPDATE bodega_encargado SET bodega_id = ?, encargado_id = ?, fecha_asignacion = ?, observaciones = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['bodega_id'],
            $data['encargado_id'],
            $data['fecha_asignacion'],
            $data['observaciones'],
            $id
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Asignación actualizada exitosamente' : 'Error al actualizar la asignación'
        ];
    }
    
    public function delete($id) {
        $sql = "DELETE FROM bodega_encargado WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }
}
