# AMD CPU optimization script
# Invoked via `window.api.runScript('cpu-amd')` in Electron

param(
    [switch]$Restore
)

Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'cpu-amd.log'

if ($Restore) {
    try {
        Write-Output 'Restoring AMD CPU settings...'
        $balanced = '381b4222-f694-41f0-9685-ff5bb260df2e'
        powercfg -setactive $balanced | Out-Null
        $policy = '0cc5b647-c1df-4637-891a-dec35c318583'
        $sub    = '3b04d4fd-1cc7-4f23-ab1c-d1337819c4bb'
        powercfg -setacvalueindex scheme_current $policy $sub 0
        powercfg -setdcvalueindex scheme_current $policy $sub 0
        Write-Output 'Restore complete.'
    } catch {
        Write-Error $_
    }
    Stop-Transcript | Out-Null
    exit
}

try {
    Write-Output 'Applying AMD CPU optimizations...'

    # Activate AMD Ryzen High Performance plan when available
    $ryzenPlan = powercfg -l | Where-Object { $_ -match 'AMD Ryzen High Performance' }
    if ($ryzenPlan) {
        $guid = $ryzenPlan -replace '.*GUID:\s*([\w-]+).*', '$1'
        powercfg -setactive $guid | Out-Null
    }

    # Disable core parking
    $policy = '0cc5b647-c1df-4637-891a-dec35c318583'
    $sub    = '3b04d4fd-1cc7-4f23-ab1c-d1337819c4bb'
    powercfg -setacvalueindex scheme_current $policy $sub 100
    powercfg -setdcvalueindex scheme_current $policy $sub 100

    Write-Output 'CPU optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
