# Game Booster script
# Invoked via `window.api.runScript('gamebooster')` in Electron

# Ensure script is running as Administrator
Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin

Write-Warning 'Applying temporary tweaks for gaming session.'

Start-LiiiraaLog 'gamebooster.log'

try {
    $services = @('wuauserv', 'Spooler')
    foreach ($svc in $services) {
        $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
        if ($service) {
            Stop-Service -InputObject $service -Force -ErrorAction SilentlyContinue
            Write-Output "Service $svc stopped"
        }
    }

    # Disable Game Bar during the session
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\GameBar' -Name 'AllowAutoGameMode' -Value 0 -Force

    # Boost foreground process priority
    $process = Get-Process -Id $pid
    $process.PriorityClass = 'High'
    [System.GC]::Collect()
    Write-Output 'RAM flush triggered.'
    Write-Output 'Game Booster ready.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
