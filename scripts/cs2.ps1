# CS2 optimization script
# Invoked via `window.api.runScript('cs2')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'cs2.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Applying CS2 optimizations...'

    # Add launch options to autoexec.cfg
    $cfg = Join-Path $env:USERPROFILE 'Documents\My Games\Counter-Strike Global Offensive\cfg\autoexec.cfg'
    if (Test-Path $cfg) {
        Add-Content -Path $cfg -Value 'fps_max 400'
        Add-Content -Path $cfg -Value 'cl_disablehtmlmotd 1'
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
