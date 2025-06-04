# AMD GPU optimization script
# Invoked via `window.api.runScript('gpu-amd')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'gpu-amd.log'

try {
    Write-Output 'Applying AMD GPU optimizations...'

    # Disable Ultra Low Power State to prevent clocks from dropping too low
    $gpuClass = 'HKLM:\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}'
    $amdKey = Get-ChildItem $gpuClass | Where-Object {
        (Get-ItemProperty -Path $_.PSPath -Name 'DriverDesc' -ErrorAction SilentlyContinue).DriverDesc -match 'AMD'
    } | Select-Object -First 1

    if ($amdKey) {
        Set-ItemProperty -Path $amdKey.PSPath -Name 'EnableUlps' -Value 0 -Type DWord -Force
    }

    # Extend TDR delay to reduce driver reset crashes
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'TdrDelay' -Value 10 -Type DWord -Force

    Write-Output 'GPU optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
