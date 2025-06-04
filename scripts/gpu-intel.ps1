# Intel GPU optimization script
# Invoked via `window.api.runScript('gpu-intel')` in Electron
param(
    [switch]$Restore
)


# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Set-StrictMode -Version Latest
Require-Admin
Start-LiiiraaLog 'gpu-intel.log'

try {
    if ($Restore) {
        Write-Output 'Restoring Intel GPU settings...'
        # Disable hardware accelerated GPU scheduling
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Type DWord -Value 1 -Force
    } else {
        Write-Output 'Applying Intel GPU optimizations...'
        # Force hardware accelerated GPU scheduling
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Type DWord -Value 2 -Force
    }

    Write-Output 'GPU optimization complete.'
} catch {
    Write-Error $_
    exit 1
}

Stop-LiiiraaLog
