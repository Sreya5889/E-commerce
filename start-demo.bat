@echo off
setlocal enabledelayedexpansion
title EduAcademy - Local Demo Launcher

echo ====================================================
echo   EduAcademy - Professional Local Demo Launcher
echo ====================================================
echo.

:: Check if hosts file has mycourse.test
findstr /i "mycourse.test" "%windir%\System32\drivers\etc\hosts" >nul 2>&1
if %errorlevel% neq 0 (
    echo [NOTICE] 'mycourse.test' is not yet configured in your Windows hosts file.
    echo Launching administrator setup to map local domains...
    call "%~dp0setup-hosts.bat"
)

echo.
echo ====================================================
echo Starting Frontend, Backend, and Reverse Proxy...
echo.
echo   Demo URL : http://mycourse.test
echo   API URL  : http://api.mycourse.test
echo   Direct   : http://mycourse.test:5173
echo ====================================================
echo.

:: Open the browser after 3 seconds in parallel
start /b cmd /c "timeout /t 3 /nobreak >nul & start http://mycourse.test"

:: Run the dev:all orchestrator
node "%~dp0scripts\dev-all.js"

pause
