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

    # Re-enable services disabled during optimization
    $services = @('DiagTrack', 'SysMain', 'diagnosticshub.standardcollector.service', 'Dmwappushservice', 'WSearch')
    foreach ($svc in $services) {
        $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
        if ($service) {
            Set-Service -InputObject $service -StartupType Manual -ErrorAction SilentlyContinue
            Start-Service -InputObject $service -ErrorAction SilentlyContinue
            Write-Output "Service $svc restored"
        }
    }

    # Re-enable scheduled tasks
    $tasks = @(
        @{ Path='\Microsoft\Windows\Application Experience\'; Name='ProgramDataUpdater' },
        @{ Path='\Microsoft\Windows\Customer Experience Improvement Program\'; Name='Consolidator' },
        @{ Path='\Microsoft\Windows\Application Experience\'; Name='Microsoft Compatibility Appraiser' },
        @{ Path='\Microsoft\Windows\Customer Experience Improvement Program\'; Name='UsbCeip' }
    )
    foreach ($t in $tasks) {
        try {
            Enable-ScheduledTask -TaskPath $t.Path -TaskName $t.Name -ErrorAction Stop
            Write-Output "Task $($t.Path)$($t.Name) enabled"
        } catch {}
    }

    # Remove network latency tweaks if present
    $activeAdapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' }
    foreach ($adp in $activeAdapters) {
        $ifaceKey = "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\$($adp.InterfaceGuid)"
        Remove-ItemProperty -Path $ifaceKey -Name 'TCPAckFrequency' -ErrorAction SilentlyContinue
        Remove-ItemProperty -Path $ifaceKey -Name 'TcpDelAckTicks' -ErrorAction SilentlyContinue
    }
    exit
}

Write-Warning 'This script modifies system settings and may affect stability.'
Write-Output "Creating registry backup at $backupPath..."

# Backup multiple registry locations so they can be restored with -Restore
$backupKeys = @(
    'HKLM\Software\Microsoft\Windows NT\CurrentVersion\Multimedia',
    'HKCU\System\GameConfigStore',
    'HKCU\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects',
    'HKLM\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy'
)

# Recreate backup file each run
if (Test-Path $backupPath) { Remove-Item $backupPath }
foreach ($key in $backupKeys) {
    $tmp = New-TemporaryFile
    reg export $key $tmp /y | Out-Null
    Get-Content $tmp | Out-File $backupPath -Encoding ASCII -Append
    Remove-Item $tmp
}

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
    # Added diagnosticshub.standardcollector.service, Dmwappushservice and WSearch
    $services = @('DiagTrack', 'SysMain', 'diagnosticshub.standardcollector.service', 'Dmwappushservice', 'WSearch')
    foreach ($svc in $services) {
        $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
        if ($service) {
            Set-Service -InputObject $service -StartupType Disabled -ErrorAction SilentlyContinue
            Stop-Service -InputObject $service -Force -ErrorAction SilentlyContinue
            Write-Output "Service $svc disabled"
        }
    }

    # --- Disable scheduled tasks ---
    # Added Microsoft Compatibility Appraiser and UsbCeip tasks
    $tasks = @(
        @{ Path='\Microsoft\Windows\Application Experience\'; Name='ProgramDataUpdater' },
        @{ Path='\Microsoft\Windows\Customer Experience Improvement Program\'; Name='Consolidator' },
        @{ Path='\Microsoft\Windows\Application Experience\'; Name='Microsoft Compatibility Appraiser' },
        @{ Path='\Microsoft\Windows\Customer Experience Improvement Program\'; Name='UsbCeip' }
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

    # Disable Game DVR to prevent background recording
    Set-ItemProperty -Path 'HKCU:\System\GameConfigStore' -Name 'GameDVR_Enabled' -Value 0 -Type DWord -Force

    # Turn off visual effects animations for better performance
    Set-ItemProperty -Path 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects' -Name 'VisualFXSetting' -Value 2 -Type DWord -Force

    # Prevent apps from running in the background
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Policies\Microsoft\Windows\AppPrivacy' -Name 'LetAppsRunInBackground' -Value 2 -Type DWord -Force

    # Prioritize multimedia tasks and remove network throttling
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'NetworkThrottlingIndex' -Value 0xffffffff -Type DWord -Force
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile' -Name 'SystemResponsiveness' -Value 10 -Type DWord -Force

    # --- Reduce TCP acknowledgement delay for each active adapter ---
    # TCPAckFrequency controls how often ACKs are sent. Setting it to 1 sends an
    # ACK for every packet, reducing latency in some games.
    # TcpDelAckTicks specifies the delay (in 100ms units) before an ACK is sent
    # when delayed acknowledgements are enabled. Setting it to 0 removes the delay.
    $activeAdapters = Get-NetAdapter | Where-Object { $_.Status -eq 'Up' }
    foreach ($adp in $activeAdapters) {
        $ifaceKey = "HKLM:\SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces\$($adp.InterfaceGuid)"
        Set-ItemProperty -Path $ifaceKey -Name 'TCPAckFrequency' -Value 1 -Type DWord -Force
        Set-ItemProperty -Path $ifaceKey -Name 'TcpDelAckTicks' -Value 0 -Type DWord -Force
    }

    Write-Output "Optimization complete"
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
