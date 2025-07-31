<?php
// Iniciar sesión si es necesario
session_start();
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistema de Bodegas - SPA</title>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link href="/assets/css/styles.css" rel="stylesheet">
    
    <!-- SPA específico CSS -->
    <style>
        .module-content {
            min-height: 600px;
        }
        
        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .nav-link.active {
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 0.375rem;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div class="container">
            <a class="navbar-brand" href="#" onclick="App.loadModule('bodegas')">
                <i class="bi bi-building"></i>
                Sistema de Bodegas
            </a>
            
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-module="bodegas" onclick="App.loadModule('bodegas')">
                            <i class="bi bi-house"></i>
                            Bodegas
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-module="encargados" onclick="App.loadModule('encargados')">
                            <i class="bi bi-people"></i>
                            Encargados
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <main class="container mt-4">
        <!-- Alert Container -->
        <div id="alert-container"></div>
        
        <!-- Module Content Container -->
        <div id="module-content" class="module-content position-relative">
            <!-- Loading overlay -->
            <div id="loading-overlay" class="loading-overlay d-none">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
            
            <!-- Contenido inicial -->
            <div class="text-center py-5">
                <i class="bi bi-building icon-large text-primary mb-3"></i>
                <h2>Bienvenido al Sistema de Bodegas</h2>
                <p class="text-muted">Selecciona un módulo del menú superior para comenzar</p>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-light mt-5 py-4">
        <div class="container text-center">
            <p class="text-muted mb-0">
                Sistema de Gestión de Bodegas &copy; <?= date('Y') ?> - Grupo Expertos
            </p>
        </div>
    </footer>

    <!-- Modal Container -->
    <div id="modal-container"></div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Módulos específicos -->
    <script src="/views/bodegas.js"></script>
    <script src="/views/encargados.js"></script>
    <script src="/views/asignaciones.js"></script>
    
    <!-- SPA Principal -->
    <script src="/assets/js/spa-simple.js"></script>
</body>
</html>
