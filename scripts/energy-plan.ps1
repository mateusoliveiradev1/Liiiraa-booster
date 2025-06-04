# Configure Liiiraa Booster power plan
# Invoked via `window.api.runScript('energy-plan')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'energy-plan.log'

try {
    $planName = 'Liiiraa Booster - Max Performance and Low Latêncy'

    # Create the plan by duplicating Ultimate Performance as a base
    $newGuid = (powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61).Trim()
    powercfg -changename $newGuid $planName | Out-Null

    # Set processor states to 100% for maximum performance
    $processor = '54533251-82be-4824-96c1-47b60b740d00'
    $minProc   = '893dee8e-2bef-41e0-89c6-b55d0929964c'
    $maxProc   = 'bc5038f7-23e0-4960-96da-33abaf5935ec'
    powercfg -setacvalueindex $newGuid $processor $minProc 100
    powercfg -setdcvalueindex $newGuid $processor $minProc 100
    powercfg -setacvalueindex $newGuid $processor $maxProc 100
    powercfg -setdcvalueindex $newGuid $processor $maxProc 100

    powercfg -setactive $newGuid | Out-Null
    Write-Output "Power plan '$planName' activated."
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
