# Windows Debloat script
# Invoked via `window.api.runScript('debloat-full')`,
# `window.api.runScript('debloat-lite')` or
# `window.api.runScript('debloat-restore')` in Electron

param(
    [switch]$Full,
    [switch]$Lite,
    [switch]$Restore
)

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

Write-Warning 'This script removes built-in Windows apps. Use at your own risk.'

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'debloat.log'
$removedFile = Join-Path $logDir 'debloat-removed.txt'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    if ($Restore) {
        if (Test-Path $removedFile) {
            $packages = Get-Content $removedFile | Where-Object { $_ }
            foreach ($pkg in $packages) {
                $app = Get-AppxPackage -Name $pkg -AllUsers -ErrorAction SilentlyContinue
                if ($app) {
                    Add-AppxPackage -DisableDevelopmentMode -Register ($app.InstallLocation + '\\AppXManifest.xml') -ErrorAction SilentlyContinue
                    Write-Output "Restored $pkg"
                }
            }
        } else {
            Write-Output 'No packages to restore.'
        }
        return
    }

    $liteApps = @(
        'Microsoft.ZuneMusic',
        'Microsoft.ZuneVideo',
        'Microsoft.BingNews',
        'Microsoft.MicrosoftSolitaireCollection',
        'Microsoft.YourPhone',
        'Microsoft.GetHelp'
    )
    $fullExtra = @(
        'Microsoft.XboxApp',
        'Microsoft.People',
        'Microsoft.SkypeApp'
    )

    $apps = if ($Lite) { $liteApps } else { $liteApps + $fullExtra }

    foreach ($app in $apps) {
        $pkg = Get-AppxPackage -Name $app -AllUsers -ErrorAction SilentlyContinue
        if ($pkg) {
            Remove-AppxPackage -Package $pkg.PackageFullName -AllUsers -ErrorAction SilentlyContinue
            $app | Out-File -FilePath $removedFile -Append
            Write-Output "Removed $app"
        }
    }

    # Disable optional features that waste resources
    $features = @('XPS-Viewer')
    foreach ($feature in $features) {
        Disable-WindowsOptionalFeature -FeatureName $feature -Online -NoRestart -ErrorAction SilentlyContinue
        Write-Output "Feature $feature disabled"
    }
    Write-Output 'Debloat complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
