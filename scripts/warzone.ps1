# Warzone optimization script
# Invoked via `window.api.runScript('warzone')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'warzone.log'

try {
    Write-Output 'Applying Warzone optimizations...'

    # Tune adv_options.ini settings
    $config = Join-Path $env:USERPROFILE 'Documents\Call of Duty Modern Warfare\players\adv_options.ini'
    if (Test-Path $config) {
        (Get-Content $config) -replace '^VideoMemoryScale .*', 'VideoMemoryScale 0.85' | Set-Content $config
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
