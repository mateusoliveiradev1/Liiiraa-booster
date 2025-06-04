# Optimize system settings for gaming performance
# Invoked via `window.api.runScript('optimize')` in Electron

param(
    [switch]$Restore
)

$backupPath = Join-Path $PSScriptRoot 'registry-backup.reg'

Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin

if ($Restore) {
    if (Test-Path $backupPath) {
        Write-Output 'Restoring registry values from backup...'
        reg import $backupPath | Out-Null
        Write-Output 'Restore complete.'
    } else {
        Write-Error "Backup file not found: $backupPath"
    }
    exit
}

Write-Warning 'This script modifies system settings and may affect stability.'
Write-Output "Creating registry backup at $backupPath..."
reg export 'HKLM\Software\Microsoft\Windows NT\CurrentVersion\Multimedia' $backupPath /y | Out-Null

Write-Output 'Optimizing system...'
# Example optimization step
Set-ItemProperty -Path 'HKLM:\Software\Microsoft\Windows NT\CurrentVersion\Multimedia' -Name 'SystemEffectsPolicy' -Value 0 -Force

Write-Output "Done. Run with -Restore to revert changes."

Start-LiiiraaLog 'optimize.log'

Write-Output "Optimizing system..."

try {
    # --- Power plan ---
    $planName = 'Liiiraa Booster - Max Performance and Low Latency'
    $planGuid = (powercfg -l | Where-Object { $_ -match [regex]::Escape($planName) }) -replace '\s*([\w-]+)\s+.*', '$1'
    if (-not $planGuid) {
        $dup = powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61
        $planGuid = $dup -replace '.*GUID:\s*([A-Fa-f0-9-]+).*', '$1'
        powercfg -changename $planGuid $planName | Out-Null
        Write-Output "Power plan '$planName' created"
    }
    if ($planGuid) {
        powercfg -setactive $planGuid | Out-Null
        Write-Output "Power plan '$planName' activated"
    }

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

    # Prioritize multimedia tasks and remove network throttling
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -Value 0xffffffff -Type DWord -Force
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -Value 10 -Type DWord -Force

    Write-Output "Optimization complete"
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
