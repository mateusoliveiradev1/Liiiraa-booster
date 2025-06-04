# AMD GPU optimization script
# Invoked via `window.api.runScript('gpu-amd')` in Electron
param(
    [switch]$Restore
)


# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Set-StrictMode -Version Latest
Require-Admin
Start-LiiiraaLog 'gpu-amd.log'

try {
    $gpuClass = 'HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}'
    $amdKey = Get-ChildItem $gpuClass | Where-Object {
        (Get-ItemProperty -Path $_.PSPath -Name 'DriverDesc' -ErrorAction SilentlyContinue).DriverDesc -match 'AMD'
    } | Select-Object -First 1

    if ($Restore) {
        Write-Output 'Restoring AMD GPU settings...'
        if ($amdKey) {
            Set-ItemProperty -Path $amdKey.PSPath -Name 'EnableUlps' -Value 1 -Type DWord -Force
        }
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'TdrDelay' -Value 2 -Type DWord -Force
    } else {
        Write-Output 'Applying AMD GPU optimizations...'
        if ($amdKey) {
            Set-ItemProperty -Path $amdKey.PSPath -Name 'EnableUlps' -Value 0 -Type DWord -Force
        }
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'TdrDelay' -Value 10 -Type DWord -Force
    }

    Write-Output 'GPU optimization complete.'
} catch {
    Write-Error $_
    exit 1
}

Stop-LiiiraaLog
