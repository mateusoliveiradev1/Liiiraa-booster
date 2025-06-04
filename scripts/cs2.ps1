# CS2 optimization script
# Invoked via `window.api.runScript('cs2')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'cs2.log'

try {
    Write-Output 'Applying CS2 optimizations...'

    # Add launch options to autoexec.cfg
    $cfg = Join-Path $env:USERPROFILE 'Documents\My Games\Counter-Strike Global Offensive\cfg\autoexec.cfg'
    if (Test-Path $cfg) {
        Add-Content -Path $cfg -Value 'fps_max 400'
        Add-Content -Path $cfg -Value 'cl_disablehtmlmotd 1'
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
