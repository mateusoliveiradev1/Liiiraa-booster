# Intel GPU optimization script
# Invoked via `window.api.runScript('gpu-intel')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'gpu-intel.log'

try {
    Write-Output 'Applying Intel GPU optimizations...'

    # Force hardware accelerated GPU scheduling
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Type DWord -Value 2 -Force

    Write-Output 'GPU optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
