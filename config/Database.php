<?php
/**
 * Configuración de la base de datos
 * Maneja la conexión PDO con PostgreSQL usando variables de entorno
 */

require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// Cargar variables de entorno
$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->load();

class Database {
    private static $instance = null;
    private $connection;
    
    /**
     * Constructor privado para patrón Singleton
     */
    private function __construct() {
        $this->connection = $this->createConnection();
    }
    
    /**
     * Obtiene la instancia única de la base de datos
     * @return Database
     */
    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Crea la conexión PDO con PostgreSQL
     * @return PDO
     * @throws PDOException
     */
    private function createConnection() {
        $host = $_ENV['DB_HOST'];
        $port = $_ENV['DB_PORT'];
        $dbname = $_ENV['DB_NAME'];
        $username = $_ENV['DB_USER'];
        $password = $_ENV['DB_PASS'];
        
        $dsn = "pgsql:host={$host};port={$port};dbname={$dbname}";
        
        try {
            $pdo = new PDO($dsn, $username, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
            
            return $pdo;
        } catch (PDOException $e) {
            throw new PDOException("Error de conexión a la base de datos: " . $e->getMessage());
        }
    }
    
    /**
     * Obtiene la conexión PDO
     * @return PDO
     */
    public function getConnection() {
        return $this->connection;
    }
    
    /**
     * Previene la clonación del objeto
     */
    public function __clone() {
        throw new Exception("No se puede clonar una instancia de " . get_class($this));
    }
    
    /**
     * Previene la deserialización del objeto
     */
    public function __wakeup() {
        throw new Exception("No se puede deserializar una instancia de " . get_class($this));
    }
}
