@echo off
cd /d "%~dp0"
title EduAcademy Platform Launcher
echo ========================================================
echo  Launching EduAcademy E-Learning Platform...
echo ========================================================
echo.

start "EduAcademy-Server-5000" cmd /k "node server/server.js"
start "EduAcademy-Vite-5173" cmd /k "node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173"

echo.
echo Servers launched in dedicated console windows!
echo  - Vite Dev Frontend: http://localhost:5173
echo  - Unified API + SPA: http://localhost:5000
echo.
echo Leave the opened terminal windows running while browsing.
echo ========================================================
pause
