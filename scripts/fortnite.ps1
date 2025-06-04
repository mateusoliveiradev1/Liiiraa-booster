# Fortnite optimization script
# Invoked via `window.api.runScript('fortnite')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'fortnite.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Applying Fortnite optimizations...'

    # Tweak GameUserSettings.ini values
    $config = Join-Path $env:LOCALAPPDATA 'FortniteGame\Saved\Config\WindowsClient\GameUserSettings.ini'
    if (Test-Path $config) {
        (Get-Content $config) -replace '^bUseVSync=.*', 'bUseVSync=False' | Set-Content $config
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
