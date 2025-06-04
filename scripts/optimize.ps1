# Optimize system settings for gaming performance
# Invoked via `window.api.runScript('optimize')` in Electron

$logDir = Join-Path $PSScriptRoot "..\logs"
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir "optimize.log"
Start-Transcript -Path $logFile -Append | Out-Null

Write-Output "Optimizing system..."

try {
    # --- Power plan ---
    $plan = (powercfg -l | Where-Object { $_ -match 'Ultimate Performance' }) -replace '\s*([\w-]+)\s+.*', '$1'
    if (-not $plan) {
        powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61 | Out-Null
        $plan = (powercfg -l | Where-Object { $_ -match 'Ultimate Performance' }) -replace '\s*([\w-]+)\s+.*', '$1'
    }
    if ($plan) { powercfg -setactive $plan }
    Write-Output "Ultimate Performance plan activated"

    # --- Disable unnecessary services ---
    $services = @('DiagTrack', 'SysMain')
    foreach ($svc in $services) {
        $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
        if ($service) {
            Set-Service -InputObject $service -StartupType Disabled -ErrorAction SilentlyContinue
            Stop-Service -InputObject $service -Force -ErrorAction SilentlyContinue
            Write-Output "Service $svc disabled"
        }
    }

    # --- Disable scheduled tasks ---
    $tasks = @(
        @{ Path='\Microsoft\Windows\Application Experience\'; Name='ProgramDataUpdater' },
        @{ Path='\Microsoft\Windows\Customer Experience Improvement Program\'; Name='Consolidator' }
    )
    foreach ($t in $tasks) {
        try {
            Disable-ScheduledTask -TaskPath $t.Path -TaskName $t.Name -ErrorAction Stop
            Write-Output "Task $($t.Path)$($t.Name) disabled"
        } catch {}
    }

    # --- Registry tweaks ---
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\GameBar' -Name 'AllowAutoGameMode' -Value 1 -Force
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\MSMQ' -Name 'TCPNoDelay' -Value 1 -Force
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers' -Name 'HwSchMode' -Value 2 -Type DWord -Force

    Write-Output "Optimization complete"
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
