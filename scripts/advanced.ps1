# Advanced system tweaks (UAC, Defender, Windows Update)
# Invoked via `window.api.runScript('advanced')` in Electron

param(
    [switch]$Restore,
    [switch]$DisableDefender,
    [switch]$DisableUpdate,
    [switch]$DisableUAC,
    [switch]$DisableMemoryCompression,
    [switch]$DisableMitigations,
    [switch]$DisableHVCI,
    [switch]$DisableTelemetry,
    [switch]$DisableSmartScreen
)

$backupPath = Join-Path $PSScriptRoot 'advanced-backup.reg'

Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Set-StrictMode -Version Latest
Require-Admin
Start-LiiiraaLog 'advanced.log'

# If no specific tweaks were selected, default to all
$flagList = @(
    $DisableDefender,
    $DisableUpdate,
    $DisableUAC,
    $DisableMemoryCompression,
    $DisableMitigations,
    $DisableHVCI,
    $DisableTelemetry,
    $DisableSmartScreen
)
if ($Restore -and ($flagList -contains $true)) {
    Write-Error 'Cannot combine -Restore with other tweak flags.'
    Stop-LiiiraaLog
    exit 1
}
if (-not ($flagList -contains $true)) {
    $DisableDefender = $true
    $DisableUpdate = $true
    $DisableUAC = $true
    $DisableMemoryCompression = $true
    $DisableMitigations = $true
    $DisableHVCI = $true
    $DisableTelemetry = $true
    $DisableSmartScreen = $true
}

if ($Restore) {
    if ($DisableUAC) {
        Write-Output 'Restoring UAC...'
        if (Test-Path $backupPath) {
            Write-Output 'Restoring registry values from backup...'
            reg import $backupPath | Out-Null
        } else {
            Write-Warning "Backup file not found: $backupPath"
            Set-ItemProperty -Path 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System' -Name 'EnableLUA' -Value 1 -Force
        }
        Write-Output 'UAC enabled'
    }

    if ($DisableUpdate) {
        Write-Output 'Restoring Windows Update service...'
        $service = Get-Service -Name 'wuauserv' -ErrorAction SilentlyContinue
        if ($service) {
            Set-Service -InputObject $service -StartupType Manual -ErrorAction SilentlyContinue
            Start-Service -InputObject $service -ErrorAction SilentlyContinue
            Write-Output 'Service wuauserv restored'
        }
    }

    if ($DisableDefender) {
        Write-Output 'Restoring Windows Defender service...'
        $service = Get-Service -Name 'WinDefend' -ErrorAction SilentlyContinue
        if ($service) {
            Set-Service -InputObject $service -StartupType Manual -ErrorAction SilentlyContinue
            Start-Service -InputObject $service -ErrorAction SilentlyContinue
            Write-Output 'Service WinDefend restored'
        }
    }

    if ($DisableMemoryCompression) {
        Write-Output 'Re-enabling Memory Compression...'
        Enable-MMAgent -mc | Out-Null
    }

    if ($DisableMitigations) {
        Write-Output 'Restoring hardware mitigations...'
        bcdedit /set {current} mitigations default | Out-Null
    }

    if ($DisableHVCI) {
        Write-Output 'Re-enabling Core Isolation...'
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -Name 'Enabled' -Value 1 -Type DWord -Force
    }

    if ($DisableTelemetry) {
        Write-Output 'Re-enabling telemetry collection...'
        Set-ItemProperty -Path 'HKLM:\Software\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 1 -Type DWord -Force
    }

    if ($DisableSmartScreen) {
        Write-Output 'Restoring SmartScreen...'
        Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer' -Name 'SmartScreenEnabled' -Value 'Warn' -Force
    }

    Write-Output 'Advanced tweaks restored.'
    Stop-LiiiraaLog
    exit
}

Write-Warning 'Applying advanced tweaks. Use at your own risk.'
Write-Output "Creating registry backup at $backupPath..."
reg export 'HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\System' $backupPath /y | Out-Null

try {
    if ($DisableUAC) {
        Write-Output 'Disabling UAC...'
        Set-ItemProperty -Path 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System' -Name 'EnableLUA' -Value 0 -Force
    }

    if ($DisableDefender) {
        Write-Output 'Disabling Windows Defender service...'
        $defender = Get-Service -Name 'WinDefend' -ErrorAction SilentlyContinue
        if ($defender) {
            Set-Service -InputObject $defender -StartupType Disabled -ErrorAction SilentlyContinue
            Stop-Service -InputObject $defender -Force -ErrorAction SilentlyContinue
        }
    }

    if ($DisableUpdate) {
        Write-Output 'Disabling Windows Update service...'
        $update = Get-Service -Name 'wuauserv' -ErrorAction SilentlyContinue
        if ($update) {
            Set-Service -InputObject $update -StartupType Disabled -ErrorAction SilentlyContinue
            Stop-Service -InputObject $update -Force -ErrorAction SilentlyContinue
        }
    }

    if ($DisableMemoryCompression) {
        Write-Output 'Disabling Memory Compression...'
        Disable-MMAgent -mc | Out-Null
    }

    if ($DisableMitigations) {
        Write-Output 'Disabling hardware mitigations...'
        bcdedit /set {current} mitigations off | Out-Null
    }

    if ($DisableHVCI) {
        Write-Output 'Disabling Core Isolation...'
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -Name 'Enabled' -Value 0 -Type DWord -Force
    }

    if ($DisableTelemetry) {
        Write-Output 'Disabling telemetry collection...'
        Set-ItemProperty -Path 'HKLM:\Software\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord -Force
    }

    if ($DisableSmartScreen) {
        Write-Output 'Disabling SmartScreen...'
        Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer' -Name 'SmartScreenEnabled' -Value 'Off' -Force
    }

    Write-Output 'Advanced tweaks applied.'
} catch {
    Write-Error $_
    exit 1
}

Stop-LiiiraaLog
