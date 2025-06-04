# NVIDIA GPU optimization script
# Invoked via `window.api.runScript('gpu-nvidia')` in Electron

param(
    [int]$Limit
)

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'gpu-nvidia.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Applying NVIDIA GPU optimizations...'

    # Enable persistence mode and set power limit when nvidia-smi is present
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

    # Force hardware accelerated GPU scheduling
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Type DWord -Value 2 -Force

    Write-Output 'GPU optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
