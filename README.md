# Sistema de Gestión de Bodegas y Encargados

Un sistema web desarrollado en PHP 7.4 con PostgreSQL para la gestión de bodegas y encargados.

## Características

- **Gestión de Bodegas**: CRUD completo para bodegas con validaciones
- **Gestión de Encargados**: CRUD completo para encargados 
- **Relaciones**: Sistema de asignación entre bodegas y encargados
- **Interfaz Responsiva**: Bootstrap 5 para una interfaz moderna
- **Validaciones**: Validaciones tanto en frontend como backend
- **Búsqueda y Filtros**: Funcionalidades de búsqueda en tiempo real

## Requisitos del Sistema

- PHP 7.4 o superior
- PostgreSQL 12 o superior
- Apache/Nginx
- Composer

## Instalación

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd GrupoExpertos
```

### 2. Instalar Dependencias

```bash
composer install
```

### 3. Configuración de Base de Datos

1. Crear la base de datos PostgreSQL:
```sql
CREATE DATABASE bodegas_sistema;
```

2. Ejecutar el script de esquema:
```bash
psql -U postgres -d bodegas_sistema -f database/schema.sql
```

### 4. Configuración de Variables de Entorno

1. Copiar el archivo de ejemplo:
```bash
copy .env.example .env
```

2. Editar `.env` con tus credenciales:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bodegas_sistema
DB_USER=tu_usuario
DB_PASS=tu_password

APP_URL=http://localhost
APP_ENV=development
```

### 5. Configuración del Servidor Web

#### Apache

Crear un VirtualHost apuntando a la carpeta `public/`:

```apache
<VirtualHost *:80>
    DocumentRoot "C:/ProyectosGIT/GrupoExpertos/public"
    ServerName bodegas.local
    
    <Directory "C:/ProyectosGIT/GrupoExpertos/public">
        AllowOverride All
        Require all granted
        DirectoryIndex index.php
    </Directory>
</VirtualHost>
```

#### Nginx

```nginx
server {
    listen 80;
    server_name bodegas.local;
    root C:/ProyectosGIT/GrupoExpertos/public;
    
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass 127.0.0.1:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## Estructura del Proyecto

```
GrupoExpertos/
├── config/
│   └── Database.php          # Configuración de base de datos
├── controllers/
│   ├── BaseController.php    # Controlador base
│   └── BodegaController.php  # Controlador de bodegas
├── models/
│   ├── BaseModel.php         # Modelo base
│   ├── Bodega.php           # Modelo de bodegas
│   ├── Encargado.php        # Modelo de encargados
│   └── BodegaEncargado.php  # Modelo de relaciones
├── views/
│   ├── layout.php           # Layout principal
│   ├── bodegas/             # Vistas de bodegas
│   └── errors/              # Páginas de error
├── public/
│   ├── index.php           # Punto de entrada
│   └── assets/             # CSS, JS, imágenes
├── database/
│   └── schema.sql          # Esquema de base de datos
├── composer.json           # Dependencias PHP
├── .env.example           # Ejemplo de variables de entorno
└── README.md             # Este archivo
```

## Uso del Sistema

### Gestión de Bodegas

1. **Listar Bodegas**: Ir a `/bodegas`
2. **Crear Bodega**: Click en "Nueva Bodega"
3. **Editar Bodega**: Click en el ícono de editar en la tabla
4. **Eliminar Bodega**: Click en el ícono de eliminar (con confirmación)
5. **Ver Detalles**: Click en el ícono de ver

### Características de las Bodegas

- Nombre (requerido)
- Dirección
- Teléfono
- Email (con validación)
- Capacidad máxima
- Estado (activo/inactivo)

### Validaciones

- **Frontend**: Validación en tiempo real con JavaScript
- **Backend**: Validaciones de servidor con PHP
- **Base de Datos**: Constraints y triggers de PostgreSQL

## API Endpoints

El sistema incluye algunos endpoints para AJAX:

- `GET /bodegas/search?q=nombre` - Buscar bodegas por nombre
- `GET /bodegas/getByEstado?estado=activo` - Filtrar por estado

## Seguridad

- Sanitización de entradas con `htmlspecialchars()`
- Consultas preparadas (PDO) para prevenir SQL Injection
- Validación tanto en frontend como backend
- Manejo de errores con logs

## Extensibilidad

El sistema está diseñado para ser fácilmente extensible:

1. **Nuevos Modelos**: Extender `BaseModel`
2. **Nuevos Controladores**: Extender `BaseController`
3. **Nuevas Rutas**: Agregar en `public/index.php`
4. **Nuevas Vistas**: Seguir la estructura existente

## Base de Datos

### Tablas Principales

1. **bodega**: Información de bodegas
2. **encargado**: Información de encargados
3. **bodega_encargado**: Relación muchos a muchos

### Características de la BD

- Triggers automáticos para fechas de actualización
- Índices para optimización
- Constraints de integridad
- Datos de ejemplo incluidos

## Desarrollo

### Agregar Nuevas Funcionalidades

1. Crear el modelo en `models/`
2. Crear el controlador en `controllers/`
3. Crear las vistas en `views/`
4. Agregar rutas en `public/index.php`

### Estilo de Código

- PSR-4 para autoloading
- Documentación en español
- Nombres descriptivos
- Separación clara de responsabilidades

## Resolución de Problemas

### Error de Conexión a BD

1. Verificar credenciales en `.env`
2. Confirmar que PostgreSQL esté ejecutándose
3. Verificar que la base de datos exista

### Error 404

1. Verificar configuración del servidor web
2. Confirmar que apunte a la carpeta `public/`
3. Verificar que mod_rewrite esté habilitado (Apache)

### Dependencias

1. Ejecutar `composer install`
2. Verificar versión de PHP (7.4+)

## Licencia

Este proyecto es de uso interno para Grupo Expertos.

## Soporte

Para soporte técnico, contactar al equipo de desarrollo.
