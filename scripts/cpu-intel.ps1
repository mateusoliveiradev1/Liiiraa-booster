# Intel CPU optimization script
# Invoked via `window.api.runScript('cpu-intel')` in Electron

param(
    [switch]$Restore
)

Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'cpu-intel.log'

if ($Restore) {
    try {
        Write-Output 'Restoring Intel CPU settings...'
        Remove-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Power\PowerThrottling' -Name 'PowerThrottlingOff' -ErrorAction SilentlyContinue
        $policy = '54533251-82be-4824-96c1-47b60b740d00'
        $sub    = 'bc5038f7-23e0-4960-96da-33abaf5935ec'
        powercfg -setacvalueindex scheme_current $policy $sub 0
        powercfg -setdcvalueindex scheme_current $policy $sub 0
        $balanced = '381b4222-f694-41f0-9685-ff5bb260df2e'
        powercfg -setactive $balanced | Out-Null
        Write-Output 'Restore complete.'
    } catch {
        Write-Error $_
    }
    Stop-Transcript | Out-Null
    exit
}

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
