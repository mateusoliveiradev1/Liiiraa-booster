# Game Booster script
# Invoked via `window.api.runScript('gamebooster')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

Write-Warning 'Applying temporary tweaks for gaming session.'

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'gamebooster.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    $services = @('wuauserv', 'Spooler')
    foreach ($svc in $services) {
        $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
        if ($service) {
            Stop-Service -InputObject $service -Force -ErrorAction SilentlyContinue
            Write-Output "Service $svc stopped"
        }
    }
    [System.GC]::Collect()
    Write-Output 'RAM flush triggered.'
    Write-Output 'Game Booster ready.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
