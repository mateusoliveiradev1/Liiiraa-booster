# CS2 optimization script
# Invoked via `window.api.runScript('cs2')` in Electron

param(
    [switch]$Restore
)

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'cs2.log'

if ($Restore) {
    try {
        Write-Output 'Restoring CS2 settings...'
        $cfg = Join-Path $env:USERPROFILE 'Documents\My Games\Counter-Strike Global Offensive\cfg\autoexec.cfg'
        if (Test-Path $cfg) {
            (Get-Content $cfg) | Where-Object { $_ -ne 'fps_max 400' -and $_ -ne 'cl_disablehtmlmotd 1' } | Set-Content $cfg
        }
        Write-Output 'Restore complete.'
    } catch {
        Write-Error $_
    }
    Stop-Transcript | Out-Null
    exit
}

try {
    Write-Output 'Applying CS2 optimizations...'

    # Add launch options to autoexec.cfg
    $cfg = Join-Path $env:USERPROFILE 'Documents\My Games\Counter-Strike Global Offensive\cfg\autoexec.cfg'
    if (Test-Path $cfg) {
        if (-not (Select-String -Path $cfg -SimpleMatch -Pattern 'fps_max 400' -Quiet)) {
            Add-Content -Path $cfg -Value 'fps_max 400'
        }
        if (-not (Select-String -Path $cfg -SimpleMatch -Pattern 'cl_disablehtmlmotd 1' -Quiet)) {
            Add-Content -Path $cfg -Value 'cl_disablehtmlmotd 1'
        }
    }

    Write-Output 'Game optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
