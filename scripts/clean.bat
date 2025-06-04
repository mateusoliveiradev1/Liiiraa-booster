@echo off
setlocal EnableDelayedExpansion
rem Clean temporary files and logs
rem Invoked via `window.api.runScript('clean')` in Electron
:: Ensure script is running as Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo This script must be run as Administrator. Exiting.
    exit /b 1
)

echo WARNING: This script removes temporary files. Use at your own risk.


set "LOGDIR=%~dp0..\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%"
set "LOGFILE=%LOGDIR%\clean.log"
echo [%date% %time%] Cleaning system...>>"%LOGFILE%"
echo Cleaning system...

REM Directories to clean
set DIRS="%TEMP%" "%SystemRoot%\Temp" "C:\Windows\Prefetch" "C:\Windows\SoftwareDistribution\Download" "%LOCALAPPDATA%\D3DSCache" "%LOCALAPPDATA%\Microsoft\Windows\Explorer" "%LOCALAPPDATA%\Microsoft\Windows\INetCache"

set SIZEBEFORE=0
for %%D in (%DIRS%) do (
  for /f "usebackq delims=" %%A in (`powershell -NoProfile -Command "(Get-ChildItem -Path '%%~D' -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum"`) do (
    if not "%%A"=="" set /a SIZEBEFORE+=%%A
  )
)

rem Delete temp files and caches
for %%D in (%DIRS%) do (
  del /f /s /q "%%~D\*" >>"%LOGFILE%" 2>&1
  for /d %%E in ("%%~D\*") do rd /s /q "%%E" >>"%LOGFILE%" 2>&1
)

rem Clear event logs
for /f %%G in ('wevtutil el') do wevtutil cl "%%G" >>"%LOGFILE%" 2>&1

rem Flush DNS cache
ipconfig /flushdns >>"%LOGFILE%" 2>&1

rem Remove Windows Update downloads
net stop wuauserv >>"%LOGFILE%" 2>&1
del /f /s /q "C:\Windows\SoftwareDistribution\Download\*" >>"%LOGFILE%" 2>&1
net start wuauserv >>"%LOGFILE%" 2>&1

rem Empty recycle bin
PowerShell -Command "Clear-RecycleBin -Force" >>"%LOGFILE%" 2>&1

set SIZEAFTER=0
for %%D in (%DIRS%) do (
  for /f "usebackq delims=" %%A in (`powershell -NoProfile -Command "(Get-ChildItem -Path '%%~D' -Recurse -Force -ErrorAction SilentlyContinue | Measure-Object Length -Sum).Sum"`) do (
    if not "%%A"=="" set /a SIZEAFTER+=%%A
  )
)

for /f "usebackq delims=" %%A in (`powershell -NoProfile -Command "$b=%SIZEBEFORE%; $a=%SIZEAFTER%; [math]::Round(($b-$a)/1MB)"`) do set FREEDMB=%%A
echo Freed !FREEDMB! MB>>"%LOGFILE%"
echo Freed !FREEDMB! MB
echo Done.>>"%LOGFILE%"
