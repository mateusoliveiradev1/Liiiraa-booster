# Peripheral power tweaks
# Invoked via `window.api.runScript('peripheral-energy')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'peripheral-energy.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Disabling USB selective suspend...'
    powercfg -setacvalueindex scheme_current SUB_USB USB_SELECTIVE_SUSPEND 0
    powercfg -setdcvalueindex scheme_current SUB_USB USB_SELECTIVE_SUSPEND 0
    Write-Output 'Peripheral power tweaks applied.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
