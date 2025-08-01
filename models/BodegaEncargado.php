<?php

class BodegaEncargado 
{
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function readAll() {
        $sql = "SELECT be.*, b.nombre as bodega_nombre, e.nombre as encargado_nombre, e.p_apellido as encargado_p_apellido, e.s_apellido as encargado_s_apellido
                FROM bodega_encargado be
                LEFT JOIN bodegas b ON be.bodega_id = b.id
                LEFT JOIN encargados e ON be.encargado_id = e.id
                ORDER BY be.id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function readById($id) {
        $sql = "SELECT be.*, b.nombre as bodega_nombre, e.nombre as encargado_nombre, e.p_apellido as encargado_p_apellido, e.s_apellido as encargado_s_apellido
                FROM bodega_encargado be
                LEFT JOIN bodegas b ON be.bodega_id = b.id
                LEFT JOIN encargados e ON be.encargado_id = e.id
                WHERE be.id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function getEncargadosByBodegaId($bodegaId) {
        $sql = "SELECT e.id, e.nombre, e.p_apellido, e.s_apellido, e.email, e.telefono
                FROM bodega_encargado be
                INNER JOIN encargados e ON be.encargado_id = e.id
                WHERE be.bodega_id = ?
                ORDER BY e.nombre, e.p_apellido";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$bodegaId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $sql = "INSERT INTO bodega_encargado (bodega_id, encargado_id, fecha_asignacion) 
                VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['bodega_id'],
            $data['encargado_id'],
            $data['fecha_asignacion'],
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Asignación creada exitosamente' : 'Error al crear la asignación'
        ];
    }
    
    public function update($id, $data) {
        $sql = "UPDATE bodega_encargado SET bodega_id = ?, encargado_id = ?, fecha_asignacion = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['bodega_id'],
            $data['encargado_id'],
            $data['fecha_asignacion'],
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
