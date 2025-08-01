# Sistema de Gestión de Bodegas y Encargados
## Documentación del Código Fuente

Sistema web PHP con arquitectura MVC + SPA para gestión de bodegas, encargados y sus relaciones.

---

## Tecnologías

```
Backend:  PHP 7.4+ con PDO + Postgresql
Frontend: JavaScript ES6+ con jQuery + Bootstrap 5
Patrón:   MVC + Single Page Application (SPA)
```

---

## Backend - PHP

### Configuración (`config/Database.php`)
```php
class Database {
    private static $instance = null;    // Singleton
    private $connection;                
    
    public static function getInstance() { ... }
    public function getConnection() { ... }
}
```
- Conexión única Postgresql con PDO
- Variables de entorno con `.env`

### Modelos (`models/`)

#### Bodega.php
```php
class Bodega {
    public function readAll() { ... }      // Listar con encargados
    public function readById($id) { ... }  // Individual + relaciones
    public function create($data) { ... }  // Crear + asignar encargados
    public function update($id, $data) { ... } // Actualizar + relaciones
}
```
- **Campos**: codigo, nombre, ubicacion, dotacion, activa
- **Relación**: Many-to-Many con Encargados

#### Encargado.php
```php
class Encargado {
    public function create($data) {
        // INSERT nombre, p_apellido, s_apellido, email, telefono
    }
    public function readById($id) {
        // Encargado + array de bodegas asignadas
    }
}
```
- **Campos**: nombre, p_apellido (requerido), s_apellido (opcional), email, telefono
- **Relación**: Many-to-Many con Bodegas

#### BodegaEncargado.php
```php
class BodegaEncargado {
    public function readAll() { ... }                    // Todas las asignaciones
    public function getEncargadosByBodegaId($id) { ... } // Encargados de bodega
}
```
- **Función**: Gestiona relación Many-to-Many

### APIs REST (`public/api/`)
```php
// /api/bodegas.php y /api/encargados.php
$action = $_GET['action'] ?? $_POST['action'];

switch($action) {
    case 'all':    // GET: Listar
    case 'show':   // GET: Individual
    case 'store':  // POST: Crear
    case 'update': // POST: Actualizar  
    case 'delete': // POST: Eliminar
}

// Retorna JSON: { success, data, message, errors }
```

---

## Frontend - JavaScript

### SPA Principal (`public/assets/js/spa.js`)
```javascript
window.App = {
    init() { ... },                    // Inicializa aplicación
    loadModule(name) { ... },          // Carga módulos dinámicamente
    renderModal(content) { ... },      // Gestiona modales
    showNotification(msg, type) { ... } // Sistema de alertas
}
```

### Módulo Bodegas (`public/views/bodegas.js`)
```javascript
window.BodegasModule = {
    // Cache para filtros
    allBodegas: [],
    filteredBodegas: [],
    
    renderList(data) { ... },      // Lista + filtros en tiempo real
    applyFilters() { ... },        // Filtro por texto/estado
    showForm(id) { ... },          // Modal crear/editar
    showDetails(id) { ... },       // Modal detalles
    validateField(field) { ... }   // Validación instantánea
}
```

### Módulo Encargados (`public/views/encargados.js`)
```javascript
window.EncargadosModule = {
    formatNombreCompleto(encargado) {
        // Combina nombre + p_apellido + s_apellido
        return `${nombre} ${p_apellido} ${s_apellido || ''}`.trim();
    },
    
    renderList(data) { ... },           // Lista con nombres completos
    showForm(id) { ... },               // Formulario apellidos separados
    renderDetails(encargado) { ... },   // Detalles + bodegas asignadas
    renderBodegasAsignadas(bodegas) { ... } // Lista de bodegas del encargado
}
```

### Templates HTML (`public/views/templates/`)
Templates pre-cargados para modales:
- `bodegas-details.html` - Detalles de bodega
- `encargados-details.html` - Detalles de encargado
- `bodegas-form.html` - Formulario bodega

```html
<!-- IDs específicos para JavaScript -->
<span id="detail-nombre">-</span>
<div id="detail-encargados-list">...</div>
```

---

## Base de Datos

```sql
-- Bodegas
CREATE TABLE bodegas (
    id INT PRIMARY KEY AUTO_INCREMENT,
    codigo VARCHAR(10) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    ubicacion VARCHAR(200),
    dotacion INT DEFAULT 0,
    activa BOOLEAN DEFAULT true,
    created_at, updated_at TIMESTAMP
);

-- Encargados con apellidos separados
CREATE TABLE encargados (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    p_apellido VARCHAR(100) NOT NULL,     -- Primer apellido
    s_apellido VARCHAR(100) NULL,         -- Segundo apellido (opcional)
    email VARCHAR(150) UNIQUE NOT NULL,
    telefono VARCHAR(20),
    created_at, updated_at TIMESTAMP
);

-- Relación Many-to-Many
CREATE TABLE bodega_encargado (
    id INT PRIMARY KEY AUTO_INCREMENT,
    bodega_id INT NOT NULL,
    encargado_id INT NOT NULL,
    fecha_asignacion DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (bodega_id) REFERENCES bodegas(id) ON DELETE CASCADE,
    FOREIGN KEY (encargado_id) REFERENCES encargados(id) ON DELETE CASCADE
);
```

---

## Estructura de Archivos

```
GrupoExpertos/
├── config/
│   └── Database.php                    # Conexión singleton
├── controllers/
│   ├── BodegaController.php           # CRUD bodegas
│   └── EncargadoController.php        # CRUD encargados
├── models/
│   ├── Bodega.php                     # Modelo bodega
│   ├── Encargado.php                  # Modelo encargado
│   └── BodegaEncargado.php            # Relaciones M:N
├── public/
│   ├── index.php                      # SPA principal
│   ├── api/
│   │   ├── bodegas.php               # API REST bodegas
│   │   └── encargados.php            # API REST encargados
│   ├── assets/
│   │   ├── css/styles.css            # Estilos custom
│   │   └── js/spa.js                 # Controlador SPA
│   └── views/
│       ├── bodegas.js                # Módulo bodegas
│       ├── encargados.js             # Módulo encargados
│       └── templates/                # Templates HTML
└── composer.json                     # Dependencias PHP
```

---

## Flujo de Datos

### Carga de Módulo
```
Usuario → Click Menu → App.loadModule() → AJAX → API → JSON → Renderizar
```

### Operación CRUD
```
Form → Validate JS → AJAX POST → Controller → Model → Database → JSON Response → Update UI
```

---

## APIs

### Endpoints
```
GET  /api/bodegas.php?action=all        # Listar bodegas
GET  /api/bodegas.php?action=show&id=1  # Bodega específica
POST /api/bodegas.php (action=store)    # Crear bodega
POST /api/bodegas.php (action=update)   # Actualizar bodega
POST /api/bodegas.php (action=delete)   # Eliminar bodega

GET  /api/encargados.php?action=all     # Listar encargados
GET  /api/encargados.php?action=show&id=1 # Encargado específico
POST /api/encargados.php (action=store) # Crear encargado
```

### Formato JSON
```json
{
    "success": true,
    "data": {
        "id": 1,
        "nombre": "Juan",
        "p_apellido": "González",
        "s_apellido": "López",
        "bodegas": [...]
    },
    "message": "OK"
}
```

---

## Características Técnicas

- **SPA**: Sin recargas de página
- **Templates**: HTML separado de JavaScript
- **Filtros**: Búsqueda en tiempo real
- **Validaciones**: Frontend + Backend
- **Relaciones**: Many-to-Many con navegación cruzada
- **Responsive**: Bootstrap 5 desktop-first

---

## Patrones Implementados

**Backend**: Singleton, MVC, Repository  
**Frontend**: Module Pattern, Observer, Template Method  
**Base de Datos**: Triggers automáticos, Foreign Keys
