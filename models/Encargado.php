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
        $sql = "SELECT * FROM encargados WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
    
    public function create($data) {
        $sql = "INSERT INTO encargados (nombre, apellido, email, telefono) 
                VALUES (?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['nombre'],
            $data['apellido'],
            $data['email'],
            $data['telefono']
        ]);
        
        return [
            'success' => $result,
            'message' => $result ? 'Encargado creado exitosamente' : 'Error al crear el encargado'
        ];
    }
    
    public function update($id, $data) {
        $sql = "UPDATE encargados SET nombre = ?, apellido = ?, email = ?, telefono = ? WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        
        $result = $stmt->execute([
            $data['nombre'],
            $data['apellido'],
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
