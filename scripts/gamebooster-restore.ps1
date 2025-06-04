# Restore Game Booster settings
# Invoked via `window.api.runScript('gamebooster-restore')` in Electron

Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin

Start-LiiiraaLog 'gamebooster.log'

try {
    $services = @('wuauserv', 'Spooler')
    foreach ($svc in $services) {
        $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
        if ($service) {
            Start-Service -InputObject $service -ErrorAction SilentlyContinue
            Write-Output "Service $svc started"
        }
    }

    # Re-enable Game Bar setting
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\GameBar' -Name 'AllowAutoGameMode' -Value 1 -Force
    Write-Output 'Game Booster settings restored.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
