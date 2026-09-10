@echo off
echo ====================================================
echo Starting EduAcademy Localhost Servers
echo ====================================================
echo.
echo [1/2] Launching Express Backend Server (Port 5000)...
start EduAcademy Express Backend (Port 5000) cmd /k node server/server.js

echo [2/2] Launching Vite Frontend Dev Server (Port 5173)...
start EduAcademy Vite Dev Server (Port 5173) cmd /k node node_modules/vite/bin/vite.js --host --port 5173

echo.
echo ====================================================
echo All servers are running!
echo.
echo [Vite Dev Server]:   http://localhost:5173/
echo [Express Fullstack]: http://localhost:5000/
echo [API Health Probe]:  http://localhost:5000/health
echo ====================================================
timeout /t 5
