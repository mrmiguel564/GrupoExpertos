-- Esquema de base de datos para el sistema de Bodegas y Encargados
-- PostgreSQL

-- Crear la base de datos (ejecutar como superusuario)
-- CREATE DATABASE bodegas_sistema;

-- Tabla de bodegas
CREATE TABLE IF NOT EXISTS bodega (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    capacidad_maxima INTEGER DEFAULT 0,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de encargados
CREATE TABLE IF NOT EXISTS encargado (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100) UNIQUE,
    cargo VARCHAR(50) DEFAULT 'Encargado de Bodega',
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    fecha_ingreso DATE DEFAULT CURRENT_DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia para la relación muchos a muchos entre bodegas y encargados
CREATE TABLE IF NOT EXISTS bodega_encargado (
    id SERIAL PRIMARY KEY,
    bodega_id INTEGER NOT NULL,
    encargado_id INTEGER NOT NULL,
    fecha_asignacion DATE DEFAULT CURRENT_DATE,
    es_principal BOOLEAN DEFAULT FALSE,
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'inactivo')),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Claves foráneas
    FOREIGN KEY (bodega_id) REFERENCES bodega(id) ON DELETE CASCADE,
    FOREIGN KEY (encargado_id) REFERENCES encargado(id) ON DELETE CASCADE,
    
    -- Constraint único para evitar duplicados
    UNIQUE(bodega_id, encargado_id)
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_bodega_nombre ON bodega(nombre);
CREATE INDEX IF NOT EXISTS idx_bodega_estado ON bodega(estado);
CREATE INDEX IF NOT EXISTS idx_encargado_cedula ON encargado(cedula);
CREATE INDEX IF NOT EXISTS idx_encargado_email ON encargado(email);
CREATE INDEX IF NOT EXISTS idx_bodega_encargado_bodega ON bodega_encargado(bodega_id);
CREATE INDEX IF NOT EXISTS idx_bodega_encargado_encargado ON bodega_encargado(encargado_id);

-- Trigger para actualizar fecha_actualizacion automáticamente
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a las tablas
CREATE TRIGGER trigger_bodega_fecha_actualizacion
    BEFORE UPDATE ON bodega
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER trigger_encargado_fecha_actualizacion
    BEFORE UPDATE ON encargado
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

-- Datos de ejemplo (opcional)
INSERT INTO bodega (nombre, direccion, telefono, email, capacidad_maxima) VALUES
('Bodega Central', 'Av. Principal 123, Ciudad', '555-0001', 'central@empresa.com', 1000),
('Bodega Norte', 'Calle Norte 456, Zona Norte', '555-0002', 'norte@empresa.com', 800),
('Bodega Sur', 'Av. Sur 789, Zona Sur', '555-0003', 'sur@empresa.com', 1200);

INSERT INTO encargado (nombre, apellido, cedula, telefono, email, cargo) VALUES
('Juan', 'Pérez', '12345678', '555-1001', 'juan.perez@empresa.com', 'Supervisor de Bodega'),
('María', 'González', '87654321', '555-1002', 'maria.gonzalez@empresa.com', 'Encargado de Bodega'),
('Carlos', 'Rodríguez', '11223344', '555-1003', 'carlos.rodriguez@empresa.com', 'Asistente de Bodega');

-- Asignar encargados a bodegas
INSERT INTO bodega_encargado (bodega_id, encargado_id, es_principal) VALUES
(1, 1, TRUE),  -- Juan es encargado principal de Bodega Central
(2, 2, TRUE),  -- María es encargada principal de Bodega Norte
(3, 3, TRUE),  -- Carlos es encargado principal de Bodega Sur
(1, 2, FALSE); -- María también trabaja en Bodega Central como apoyo
