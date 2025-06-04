# Optimize system settings for gaming performance
# Invoked via `window.api.runScript('optimize')` in Electron

param(
    [switch]$Restore
)

$backupPath = Join-Path $PSScriptRoot 'registry-backup.reg'

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

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
