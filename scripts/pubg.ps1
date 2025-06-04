# PUBG optimization script
# Invoked via `window.api.runScript('pubg')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'pubg.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Applying PUBG optimizations...'

    # Edit Engine.ini for better input latency
    $config = Join-Path $env:LOCALAPPDATA 'TslGame\Saved\Config\WindowsNoEditor\Engine.ini'
    if (Test-Path $config) {
        Add-Content -Path $config -Value '[SystemSettings]'
        Add-Content -Path $config -Value 'bUseVSync=False'
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
