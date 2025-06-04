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

set SIZEBEFORE=0
for %%D in ("%TEMP%" "C:\Windows\Prefetch" "C:\Windows\SoftwareDistribution\Download") do (
  for /f "tokens=3" %%A in ('dir /s /-c "%%~D" 2^>nul ^| find "File(s)"') do (
    set B=%%A
    set B=!B:,=!
    set /a SIZEBEFORE+=B
  )
)

rem Delete temp files and prefetch data
del /f /s /q "%TEMP%\*" >>"%LOGFILE%" 2>&1
for /d %%D in ("%TEMP%\*") do rd /s /q "%%D" >>"%LOGFILE%" 2>&1
del /f /s /q "C:\Windows\Prefetch\*" >>"%LOGFILE%" 2>&1
for /d %%D in ("C:\Windows\Prefetch\*") do rd /s /q "%%D" >>"%LOGFILE%" 2>&1

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
for %%D in ("%TEMP%" "C:\Windows\Prefetch" "C:\Windows\SoftwareDistribution\Download") do (
  for /f "tokens=3" %%A in ('dir /s /-c "%%~D" 2^>nul ^| find "File(s)"') do (
    set B=%%A
    set B=!B:,=!
    set /a SIZEAFTER+=B
  )
)

set /a FREED=SIZEBEFORE-SIZEAFTER
set /a FREEDMB=FREED/1048576
echo Freed !FREEDMB! MB>>"%LOGFILE%"
echo Freed !FREEDMB! MB
echo Done.>>"%LOGFILE%"
