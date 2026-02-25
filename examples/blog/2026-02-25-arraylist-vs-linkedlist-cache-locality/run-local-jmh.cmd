@echo off
setlocal

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0run-local-jmh.ps1" %*
exit /b %ERRORLEVEL%
