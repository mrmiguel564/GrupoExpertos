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
        /* Layout principal con flexbox */
        body {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        /* Contenido principal que crece */
        main {
            flex: 1;
            min-height: 70vh; /* Tamaño mínimo del contenido principal */
            padding: 2rem 0;
        }
        
        .module-content {
            min-height: 500px; /* Altura mínima del contenido del módulo */
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
        
        /* Footer siempre abajo */
        footer {
            margin-top: auto;
            flex-shrink: 0;
        }
        
        /* Contenedor responsivo */
        .container-main {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 1rem;
        }
        
        /* Ajustes responsivos */
        @media (max-width: 768px) {
            main {
                padding: 1rem 0;
                min-height: 60vh;
            }
            
            .module-content {
                min-height: 400px;
            }
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
    <main>
        <div class="container-main">
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
                    <i class="bi bi-building display-1 text-primary mb-3"></i>
                    <h2>Bienvenido al Sistema de Bodegas</h2>
                    <p class="text-muted">Selecciona un módulo del menú superior para comenzar</p>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="bg-light py-2 border-top">
        <div class="container-main">
            <div class="text-center">
                <p class="text-muted mb-0 small">
                    Sistema de Gestión de Bodegas &copy; <?= date('Y') ?> - Grupo Expertos
                </p>
            </div>
        </div>
    </footer>

    <!-- Modal Container -->
    <div id="modal-container"></div>

    <!-- Templates Precargados -->
    <!-- Template: Lista de Bodegas -->
    <div id="bodegas-list-template" class="template d-none">
        <?php include 'views/templates/bodegas-list.html'; ?>
    </div>

    <!-- Template: Formulario de Bodegas -->
    <div id="bodegas-form-template" class="template d-none">
        <?php include 'views/templates/bodegas-form.html'; ?>
    </div>

    <!-- Template: Detalles de Bodegas -->
    <div id="bodegas-details-template" class="template d-none">
        <?php include 'views/templates/bodegas-details.html'; ?>
    </div>

    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Módulos específicos -->
    <script src="/views/bodegas.js"></script>
    <script src="/views/encargados.js"></script>
    <script src="/views/asignaciones.js"></script>
    
    <!-- SPA Principal -->
    <script src="/assets/js/spa.js"></script>
</body>
</html>
