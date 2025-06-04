# Peripheral power tweaks
# Invoked via `window.api.runScript('peripheral-energy')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Set-StrictMode -Version Latest
Require-Admin
Start-LiiiraaLog 'peripheral-energy.log'

try {
    Write-Output 'Disabling USB selective suspend...'
    powercfg -setacvalueindex scheme_current SUB_USB USB_SELECTIVE_SUSPEND 0
    powercfg -setdcvalueindex scheme_current SUB_USB USB_SELECTIVE_SUSPEND 0
    Write-Output 'Peripheral power tweaks applied.'
} catch {
    Write-Error $_
    exit 1
}

Stop-LiiiraaLog
