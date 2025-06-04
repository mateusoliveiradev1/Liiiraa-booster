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
        if (Test-Path $backupPath) {
            Write-Output 'Restoring registry values from backup...'
            reg import $backupPath | Out-Null
        } else {
            Write-Warning "Backup file not found: $backupPath"
            Set-ItemProperty -Path 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System' -Name 'EnableLUA' -Value 1 -Force
        }
    }

    if ($DisableUpdate) {
        $service = Get-Service -Name 'wuauserv' -ErrorAction SilentlyContinue
        if ($service) {
            Set-Service -InputObject $service -StartupType Manual -ErrorAction SilentlyContinue
            Start-Service -InputObject $service -ErrorAction SilentlyContinue
            Write-Output 'Service wuauserv restored'
        }
    }

    if ($DisableDefender) {
        $service = Get-Service -Name 'WinDefend' -ErrorAction SilentlyContinue
        if ($service) {
            Set-Service -InputObject $service -StartupType Manual -ErrorAction SilentlyContinue
            Start-Service -InputObject $service -ErrorAction SilentlyContinue
            Write-Output 'Service WinDefend restored'
        }
    }

    if ($DisableMemoryCompression) {
        Enable-MMAgent -mc | Out-Null
    }

    if ($DisableMitigations) {
        bcdedit /set {current} mitigations default | Out-Null
    }

    if ($DisableHVCI) {
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -Name 'Enabled' -Value 1 -Type DWord -Force
    }

    if ($DisableTelemetry) {
        Set-ItemProperty -Path 'HKLM:\Software\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 1 -Type DWord -Force
    }

    if ($DisableSmartScreen) {
        Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer' -Name 'SmartScreenEnabled' -Value 'Warn' -Force
    }

    Write-Output 'Advanced tweaks restored.'
    Stop-Transcript | Out-Null
    exit
}

Write-Warning 'Applying advanced tweaks. Use at your own risk.'
Write-Output "Creating registry backup at $backupPath..."
reg export 'HKLM\Software\Microsoft\Windows\CurrentVersion\Policies\System' $backupPath /y | Out-Null

try {
    if ($DisableUAC) {
        Set-ItemProperty -Path 'HKLM:\Software\Microsoft\Windows\CurrentVersion\Policies\System' -Name 'EnableLUA' -Value 0 -Force
    }

    if ($DisableDefender) {
        $defender = Get-Service -Name 'WinDefend' -ErrorAction SilentlyContinue
        if ($defender) {
            Set-Service -InputObject $defender -StartupType Disabled -ErrorAction SilentlyContinue
            Stop-Service -InputObject $defender -Force -ErrorAction SilentlyContinue
        }
    }

    if ($DisableUpdate) {
        $update = Get-Service -Name 'wuauserv' -ErrorAction SilentlyContinue
        if ($update) {
            Set-Service -InputObject $update -StartupType Disabled -ErrorAction SilentlyContinue
            Stop-Service -InputObject $update -Force -ErrorAction SilentlyContinue
        }
    }

    if ($DisableMemoryCompression) {
        Disable-MMAgent -mc | Out-Null
    }

    if ($DisableMitigations) {
        bcdedit /set {current} mitigations off | Out-Null
    }

    if ($DisableHVCI) {
        Set-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\DeviceGuard\Scenarios\HypervisorEnforcedCodeIntegrity' -Name 'Enabled' -Value 0 -Type DWord -Force
    }

    if ($DisableTelemetry) {
        Set-ItemProperty -Path 'HKLM:\Software\Policies\Microsoft\Windows\DataCollection' -Name 'AllowTelemetry' -Value 0 -Type DWord -Force
    }

    if ($DisableSmartScreen) {
        Set-ItemProperty -Path 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer' -Name 'SmartScreenEnabled' -Value 'Off' -Force
    }

    Write-Output 'Advanced tweaks applied.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
