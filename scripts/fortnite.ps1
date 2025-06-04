# Fortnite optimization script
# Invoked via `window.api.runScript('fortnite')` in Electron

param(
    [switch]$Restore
)

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'fortnite.log'

if ($Restore) {
    try {
        Write-Output 'Restoring Fortnite settings...'
        $config = Join-Path $env:LOCALAPPDATA 'FortniteGame\Saved\Config\WindowsClient\GameUserSettings.ini'
        if (Test-Path $config) {
            (Get-Content $config) -replace '^bUseVSync=.*', 'bUseVSync=True' | Set-Content $config
        }
        Write-Output 'Restore complete.'
    } catch {
        Write-Error $_
    }
    Stop-Transcript | Out-Null
    exit
}

try {
    Write-Output 'Applying Fortnite optimizations...'

    # Tweak GameUserSettings.ini values
    $config = Join-Path $env:LOCALAPPDATA 'FortniteGame\Saved\Config\WindowsClient\GameUserSettings.ini'
    if (Test-Path $config) {
        if (-not (Select-String -Path $config -Pattern '^bUseVSync=False$' -Quiet)) {
            (Get-Content $config) -replace '^bUseVSync=.*', 'bUseVSync=False' | Set-Content $config
        }
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
