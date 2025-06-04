# Advanced system tweaks (UAC, Defender, Windows Update)
# Invoked via `window.api.runScript('advanced')` in Electron

param(
    [switch]$Restore
)

$backupPath = Join-Path $PSScriptRoot 'advanced-backup.reg'

Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Require-Admin
Start-LiiiraaLog 'advanced.log'

if ($Restore) {
    if (Test-Path $backupPath) {
        Write-Output 'Restoring registry values from backup...'
        reg import $backupPath | Out-Null
    } else {
        Write-Warning "Backup file not found: $backupPath"
    }
    $services = @('wuauserv', 'WinDefend')
    foreach ($svc in $services) {
        $service = Get-Service -Name $svc -ErrorAction SilentlyContinue
        if ($service) {
            Set-Service -InputObject $service -StartupType Manual -ErrorAction SilentlyContinue
            Start-Service -InputObject $service -ErrorAction SilentlyContinue
            Write-Output "Service $svc restored"
        }
    }

    # Re-enable Memory Compression
    Enable-MMAgent -mc | Out-Null

    # Restore default hardware mitigations
    bcdedit /set {current} mitigations default | Out-Null

    # Re-enable Core Isolation (HVCI)
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -Name 'Enabled' -Value 1 -Type DWord -Force

    Write-Output 'Advanced tweaks restored.'
    Stop-Transcript | Out-Null
    exit
}

Write-Warning 'Applying advanced tweaks. Use at your own risk.'
Write-Output "Creating registry backup at $backupPath..."
reg export 'HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\System' $backupPath /y | Out-Null

try {
    # Disable UAC
    Set-ItemProperty -Path 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System' -Name 'EnableLUA' -Value 0 -Force
    # Disable Windows Defender service
    $defender = Get-Service -Name 'WinDefend' -ErrorAction SilentlyContinue
    if ($defender) {
        Set-Service -InputObject $defender -StartupType Disabled -ErrorAction SilentlyContinue
        Stop-Service -InputObject $defender -Force -ErrorAction SilentlyContinue
    }
    # Disable Windows Update service
    $update = Get-Service -Name 'wuauserv' -ErrorAction SilentlyContinue
    if ($update) {
        Set-Service -InputObject $update -StartupType Disabled -ErrorAction SilentlyContinue
        Stop-Service -InputObject $update -Force -ErrorAction SilentlyContinue
    }

    # Disable Memory Compression
    Disable-MMAgent -mc | Out-Null

    # Disable hardware mitigation policies
    bcdedit /set {current} mitigations off | Out-Null

    # Disable Core Isolation (HVCI)
    Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -Name 'Enabled' -Value 0 -Type DWord -Force

    # Turn off telemetry collection
    Set-ItemProperty -Path 'HKLM:\Software\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord -Force

    # Disable SmartScreen filter
    Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer' -Name 'SmartScreenEnabled' -Value 'Off' -Force

    Write-Output 'Advanced tweaks applied.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
