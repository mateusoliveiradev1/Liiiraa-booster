@echo off
rem Clean temporary files and logs
rem Invoked via `window.api.runScript('clean')` in Electron

set "LOGDIR=%~dp0..\logs"
if not exist "%LOGDIR%" mkdir "%LOGDIR%"
set "LOGFILE=%LOGDIR%\clean.log"
echo [%date% %time%] Cleaning system...>>"%LOGFILE%"
echo Cleaning system...

rem Delete temp files and prefetch data
del /f /s /q "%TEMP%\*" >>"%LOGFILE%" 2>&1
for /d %%D in ("%TEMP%\*") do rd /s /q "%%D" >>"%LOGFILE%" 2>&1
del /f /s /q "C:\Windows\Prefetch\*" >>"%LOGFILE%" 2>&1
for /d %%D in ("C:\Windows\Prefetch\*") do rd /s /q "%%D" >>"%LOGFILE%" 2>&1

rem Clear event logs
for /f %%G in ('wevtutil el') do wevtutil cl "%%G" >>"%LOGFILE%" 2>&1

rem Empty recycle bin
PowerShell -Command "Clear-RecycleBin -Force" >>"%LOGFILE%" 2>&1

echo Done.>>"%LOGFILE%"
