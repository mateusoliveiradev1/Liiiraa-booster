# NVIDIA GPU optimization script
# Invoked via `window.api.runScript('gpu-nvidia')` in Electron

param(
    [int]$Limit,
    [switch]$Restore
)


# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'gpu-nvidia.log'

try {
    if ($Restore) {
        Write-Output 'Restoring NVIDIA GPU settings...'
        if (Get-Command 'nvidia-smi.exe' -ErrorAction SilentlyContinue) {
            & nvidia-smi -pm 0 | Out-Null
            $limitOutput = & nvidia-smi --query-gpu=power.default_limit --format=csv,noheader
            $limitValue  = [regex]::Match($limitOutput, '\d+').Value
            if ($limitValue) { & nvidia-smi -pl $limitValue | Out-Null }
        }
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Type DWord -Value 1 -Force
    } else {
        Write-Output 'Applying NVIDIA GPU optimizations...'
        if (Get-Command 'nvidia-smi.exe' -ErrorAction SilentlyContinue) {
            & nvidia-smi -pm 1 | Out-Null
            if (-not $Limit) {
                $limitOutput = & nvidia-smi --query-gpu=power.default_limit --format=csv,noheader
                $limitValue  = [regex]::Match($limitOutput, '\d+').Value
                if ($limitValue) { $Limit = [int]$limitValue }
            }
            if ($Limit) {
                & nvidia-smi -pl $Limit | Out-Null
            }
        }
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Type DWord -Value 2 -Force
    }

    Write-Output 'GPU optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
