# Valorant optimization script
# Invoked via `window.api.runScript('valorant')` in Electron

param(
    [switch]$Restore
)

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'valorant.log'

if ($Restore) {
    try {
        Write-Output 'Restoring Valorant settings...'
        $config = Join-Path $env:LOCALAPPDATA 'VALORANT\Saved\Config\WindowsClient\GameUserSettings.ini'
        if (Test-Path $config) {
            (Get-Content $config) -replace '^FrameRateLimit=.*', 'FrameRateLimit=60' | Set-Content $config
        }
        Write-Output 'Restore complete.'
    } catch {
        Write-Error $_
    }
    Stop-Transcript | Out-Null
    exit
}

try {
    Write-Output 'Applying Valorant optimizations...'

    # Unlock frame rate limit
    $config = Join-Path $env:LOCALAPPDATA 'VALORANT\Saved\Config\WindowsClient\GameUserSettings.ini'
    if (Test-Path $config) {
        if (-not (Select-String -Path $config -Pattern '^FrameRateLimit=0$' -Quiet)) {
            (Get-Content $config) -replace '^FrameRateLimit=.*', 'FrameRateLimit=0' | Set-Content $config
        }
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
