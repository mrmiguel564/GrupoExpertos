@echo off
echo Sistema de Bodegas - Servidor de Desarrollo
echo ==========================================
echo.
echo Iniciando servidor en: http://localhost:8000
echo Presiona Ctrl+C para detener
echo.

cd /d "%~dp0public"
php -S localhost:8000

pause
