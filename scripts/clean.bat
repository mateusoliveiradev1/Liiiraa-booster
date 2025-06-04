@echo off
rem Clean temporary files and logs
rem Invoked via `window.api.runScript('clean')` in Electron

:: Ensure script is running as Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo This script must be run as Administrator. Exiting.
    exit /b 1
)

echo WARNING: This script removes temporary files. Use at your own risk.

echo Cleaning system...
rem Example cleanup steps (placeholder)
