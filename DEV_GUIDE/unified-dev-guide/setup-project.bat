@echo off
REM Antigravity Project Linker Launcher
if "%~1"=="" (
    echo Penggunaan: setup-project.bat "D:\path\ke\proyek-baru"
    echo Contoh: setup-project.bat "D:\projects\my-cool-app"
    pause
    exit /b 1
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0setup-project.ps1" -TargetDir "%~1"
pause
