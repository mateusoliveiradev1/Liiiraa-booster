# Auto hardware detection and optimization
# Invoked via `window.api.runScript('auto-optimize')` in Electron

param(
    [switch]$Restore
)

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'hardware-optimize.log'

try {
    Write-Output 'Detecting hardware...'
    $cpuVendor = (Get-CimInstance -ClassName Win32_Processor | Select-Object -First 1 -ExpandProperty Manufacturer)
    $gpuName   = (Get-CimInstance -ClassName Win32_VideoController | Select-Object -First 1 -ExpandProperty Name)

    Write-Output "CPU Vendor: $cpuVendor"
    Write-Output "GPU Name: $gpuName"

    $scriptDir = $PSScriptRoot

    $cpuArgs = @()
    $gpuArgs = @()
    if ($Restore) {
        $cpuArgs += '-Restore'
        $gpuArgs += '-Restore'
    }

    if ($cpuVendor -match 'AMD') {
        Write-Output ($Restore ? 'Restoring AMD CPU settings...' : 'Running AMD CPU optimizations...')
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'cpu-amd.ps1') @cpuArgs
    } elseif ($cpuVendor -match 'Intel') {
        Write-Output ($Restore ? 'Restoring Intel CPU settings...' : 'Running Intel CPU optimizations...')
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'cpu-intel.ps1') @cpuArgs
    } else {
        Write-Warning "Unknown CPU vendor: $cpuVendor"
    }

    if ($gpuName -match 'NVIDIA') {
        Write-Output ($Restore ? 'Restoring NVIDIA GPU settings...' : 'Running NVIDIA GPU optimizations...')
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'gpu-nvidia.ps1') @gpuArgs
    } elseif ($gpuName -match 'AMD' -or $gpuName -match 'Radeon') {
        Write-Output ($Restore ? 'Restoring AMD GPU settings...' : 'Running AMD GPU optimizations...')
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'gpu-amd.ps1') @gpuArgs
    } elseif ($gpuName -match 'Intel') {
        Write-Output ($Restore ? 'Restoring Intel GPU settings...' : 'Running Intel GPU optimizations...')
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'gpu-intel.ps1') @gpuArgs
    } else {
        Write-Warning "Unknown GPU vendor: $gpuName"
    }

    Write-Output 'Auto optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
