@echo off
cd /d "c:\Users\DELL\OneDrive\Documents\e-commerce"
start "EduAcademy-Server" /b node server\server.js
start "EduAcademy-Vite" /b node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173
