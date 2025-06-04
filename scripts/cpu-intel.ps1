# Intel CPU optimization script
# Invoked via `window.api.runScript('cpu-intel')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'cpu-intel.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Applying Intel CPU optimizations...'

    # Disable power throttling to allow the CPU to boost freely
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling' -Name 'PowerThrottlingOff' -Value 1 -Force

    # Prefer maximum performance for energy policy
    $policy = '54533251-82be-4824-96c1-47b60b740d00'
    $sub    = 'bc5038f7-23e0-4960-96da-33abaf5935ec'
    powercfg -setacvalueindex scheme_current $policy $sub 100
    powercfg -setdcvalueindex scheme_current $policy $sub 100

    Write-Output 'CPU optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
