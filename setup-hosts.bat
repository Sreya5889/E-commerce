@echo off
title EduAcademy - Local Hosts Setup
echo ====================================================
echo  EduAcademy - Local Demo Domain Setup (mycourse.test)
echo ====================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-hosts.ps1"
