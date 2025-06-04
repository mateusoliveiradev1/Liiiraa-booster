# Valorant optimization script
# Invoked via `window.api.runScript('valorant')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'valorant.log'

try {
    Write-Output 'Applying Valorant optimizations...'

    # Unlock frame rate limit
    $config = Join-Path $env:LOCALAPPDATA 'VALORANT\Saved\Config\WindowsClient\GameUserSettings.ini'
    if (Test-Path $config) {
        (Get-Content $config) -replace '^FrameRateLimit=.*', 'FrameRateLimit=0' | Set-Content $config
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
