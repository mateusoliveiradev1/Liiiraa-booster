# Create a system restore point
# Invoked via `window.api.runScript('restore-point')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Set-StrictMode -Version Latest
Require-Admin
Start-LiiiraaLog 'restore-point.log'

try {
    Write-Output 'Creating system restore point...'
    Checkpoint-Computer -Description 'Liiiraa Booster Restore' -RestorePointType 'MODIFY_SETTINGS'
    Write-Output 'Restore point created.'
} catch {
    Write-Error $_
    exit 1
}

Stop-LiiiraaLog
