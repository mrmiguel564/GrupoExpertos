<?php

class Encargado 
{
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance()->getConnection();
    }
    
    public function readAll() {
        $sql = "SELECT * FROM encargados ORDER BY id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    
    public function readById($id) {
        // Obtener datos del encargado
        $sql = "SELECT * FROM encargados WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        $encargado = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$encargado) {
            return false;
        }
        
        // Obtener bodegas asociadas a este encargado
        $sqlBodegas = "SELECT b.id, b.codigo, b.nombre, b.ubicacion, b.dotacion, b.activa, b.created_at, b.updated_at
                       FROM bodega_encargado be
                       INNER JOIN bodegas b ON be.bodega_id = b.id
                       WHERE be.encargado_id = ?
                       ORDER BY b.nombre";
        $stmtBodegas = $this->db->prepare($sqlBodegas);
        $stmtBodegas->execute([$id]);
        $bodegas = $stmtBodegas->fetchAll(PDO::FETCH_ASSOC);
        
        // Agregar las bodegas al array del encargado
        $encargado['bodegas'] = $bodegas;
        
        return $encargado;
    }
    
    public function create($data) {
        $sql = "INSERT INTO encargados (nombre, p_apellido, s_apellido, email, telefono) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['nombre'],
            $data['p_apellido'],
            $data['s_apellido'] ?? null, // Segundo apellido es opcional
            $data['email'],
            $data['telefono']
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Encargado creado exitosamente' : 'Error al crear el encargado'
        ];
    }
    
    public function update($id, $data) {
        $sql = "UPDATE encargados SET nombre = ?, p_apellido = ?, s_apellido = ?, email = ?, telefono = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['nombre'],
            $data['p_apellido'],
            $data['s_apellido'] ?? null, // Segundo apellido es opcional
            $data['email'],
            $data['telefono'],
            $id
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Encargado actualizado exitosamente' : 'Error al actualizar el encargado'
        ];
    }
    
    public function delete($id) {
        $sql = "DELETE FROM encargados WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$id]);
    }
}
