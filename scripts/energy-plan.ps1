# Configure Liiiraa Booster power plan
# Invoked via `window.api.runScript('energy-plan')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'energy-plan.log'

try {
    $planName = 'Liiiraa Booster - Max Performance and Low Latency'
    try {
        $newGuid = (powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61).Trim()
    } catch {
        $newGuid = (powercfg -duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c).Trim()
    }
    powercfg -changename $newGuid $planName | Out-Null
    powercfg -setactive $newGuid | Out-Null
    Write-Output "Power plan '$planName' activated."
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
