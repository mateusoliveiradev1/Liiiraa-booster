# NVIDIA GPU optimization script
# Invoked via `window.api.runScript('gpu-nvidia')` in Electron

param(
    [int]$Limit,
    [switch]$Restore,
    [switch]$MaxPower,
    [switch]$LockMaxClock
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
            & nvidia-smi -rgc | Out-Null
            & nvidia-smi -rmc | Out-Null
        }
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Type DWord -Value 1 -Force
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'TdrDelay' -Value 2 -Type DWord -Force
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
            if ($MaxPower) {
                $max = & nvidia-smi --query-gpu=power.max_limit --format=csv,noheader
                $maxValue = [regex]::Match($max, '\d+').Value
                if ($maxValue) { & nvidia-smi -pl $maxValue | Out-Null }
            }
            if ($LockMaxClock) {
                $gfx = & nvidia-smi --query-gpu=clocks.max.graphics --format=csv,noheader
                $mem = & nvidia-smi --query-gpu=clocks.max.memory --format=csv,noheader
                $gfxVal = [regex]::Match($gfx, '\d+').Value
                $memVal = [regex]::Match($mem, '\d+').Value
                if ($gfxVal) { & nvidia-smi --lock-gpu-clocks=$gfxVal | Out-Null }
                if ($memVal) { & nvidia-smi --lock-memory-clocks=$memVal | Out-Null }
            }
        }
        if ($MaxPower -or $LockMaxClock) {
            Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'TdrDelay' -Value 10 -Type DWord -Force
        }
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Type DWord -Value 2 -Force
    }

    Write-Output 'GPU optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
