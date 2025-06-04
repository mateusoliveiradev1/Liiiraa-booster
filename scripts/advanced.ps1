# Advanced system tweaks (UAC, Defender, Windows Update)
# Invoked via `window.api.runScript('advanced')` in Electron

param(
    [switch]$Restore
)

$backupPath = Join-Path $PSScriptRoot 'advanced-backup.reg'

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'advanced.log'
Start-Transcript -Path $logFile -Append | Out-Null

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

    Write-Output 'Advanced tweaks applied.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
