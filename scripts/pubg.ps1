# PUBG optimization script
# Invoked via `window.api.runScript('pubg')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'pubg.log'

try {
    Write-Output 'Applying PUBG optimizations...'

    # Edit Engine.ini for better input latency
    $config = Join-Path $env:LOCALAPPDATA 'TslGame\Saved\Config\WindowsNoEditor\Engine.ini'
    if (Test-Path $config) {
        Add-Content -Path $config -Value '[SystemSettings]'
        Add-Content -Path $config -Value 'bUseVSync=False'
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
