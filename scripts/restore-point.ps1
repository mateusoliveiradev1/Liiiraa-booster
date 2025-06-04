# Create a system restore point
# Invoked via `window.api.runScript('restore-point')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'restore-point.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Creating system restore point...'
    Checkpoint-Computer -Description 'Liiiraa Booster Restore' -RestorePointType 'MODIFY_SETTINGS'
    Write-Output 'Restore point created.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
