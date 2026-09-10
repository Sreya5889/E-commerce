@echo off
cd /d "c:\Users\DELL\OneDrive\Documents\e-commerce"
start "EduAcademy-Server-5000" node server\server.js
start "EduAcademy-Vite-5173" node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173
