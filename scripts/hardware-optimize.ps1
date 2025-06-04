# Auto hardware detection and optimization
# Invoked via `window.api.runScript('auto-optimize')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'hardware-optimize.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Detecting hardware...'
    $cpuVendor = (Get-WmiObject Win32_Processor | Select-Object -First 1 -ExpandProperty Manufacturer)
    $gpuName   = (Get-WmiObject Win32_VideoController | Select-Object -First 1 -ExpandProperty Name)

    Write-Output "CPU Vendor: $cpuVendor"
    Write-Output "GPU Name: $gpuName"

    $scriptDir = $PSScriptRoot

    if ($cpuVendor -match 'AMD') {
        Write-Output 'Running AMD CPU optimizations...'
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'cpu-amd.ps1')
    } elseif ($cpuVendor -match 'Intel') {
        Write-Output 'Running Intel CPU optimizations...'
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'cpu-intel.ps1')
    } else {
        Write-Warning "Unknown CPU vendor: $cpuVendor"
    }

    if ($gpuName -match 'NVIDIA') {
        Write-Output 'Running NVIDIA GPU optimizations...'
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'gpu-nvidia.ps1')
    } elseif ($gpuName -match 'AMD' -or $gpuName -match 'Radeon') {
        Write-Output 'Running AMD GPU optimizations...'
        & powershell -ExecutionPolicy Bypass -File (Join-Path $scriptDir 'gpu-amd.ps1')
    } else {
        Write-Warning "Unknown GPU vendor: $gpuName"
    }

    Write-Output 'Auto optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
