# Windows Debloat script
# Invoked via `window.api.runScript('debloat-full')`,
# `window.api.runScript('debloat-lite')` or
# `window.api.runScript('debloat-restore')` in Electron

param(
    [switch]$Full,
    [switch]$Lite,
    [switch]$Restore
)

Import-Module (Join-Path $PSScriptRoot 'common.psm1')
Set-StrictMode -Version Latest
Require-Admin

Write-Warning 'This script removes built-in Windows apps. Use at your own risk.'

Start-LiiiraaLog 'debloat.log'
$logDir = Join-Path $PSScriptRoot '..\logs'
$removedFile = Join-Path $logDir 'debloat-removed.txt'

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

    # Apps removed in lite mode. These are also removed when running the full
    # debloat option.
    $liteApps = @(
        'Microsoft.ZuneMusic',
        'Microsoft.ZuneVideo',
        'Microsoft.BingNews',
        'Microsoft.MicrosoftSolitaireCollection',
        'Microsoft.YourPhone',
        'Microsoft.GetHelp',
        'Microsoft.WindowsFeedbackHub',
        'Microsoft.3DBuilder',
        'Microsoft.Getstarted'
    )

    # Additional apps removed only with the full debloat option.
    $fullExtra = @(
        'Microsoft.XboxApp',
        'Microsoft.People',
        'Microsoft.SkypeApp',
        'Microsoft.XboxGameOverlay',
        'Microsoft.XboxGameCallableUI'
    )

    $apps = if ($Lite) { $liteApps } else { $liteApps + $fullExtra }

    foreach ($app in $apps) {
        $pkg = Get-AppxPackage -Name $app -AllUsers -ErrorAction SilentlyContinue
        if ($pkg) {
            Remove-AppxPackage -Package $pkg.PackageFullName -AllUsers -ErrorAction SilentlyContinue
            # Log removed package for possible restoration
            $app | Out-File -FilePath $removedFile -Append
            Write-Output "Removed $app"
        }
    }

    # Disable optional features that waste resources
    $features = @(
        'XPS-Viewer'
    )
    # Extra features disabled only when running the full debloat option
    $featuresExtra = @(
        'Print3D',
        'FaxServicesClientPackage'
    )

    $featuresToDisable = if ($Lite) { $features } else { $features + $featuresExtra }

    foreach ($feature in $featuresToDisable) {
        Disable-WindowsOptionalFeature -FeatureName $feature -Online -NoRestart -ErrorAction SilentlyContinue
        Write-Output "Feature $feature disabled"
    }
    Write-Output 'Debloat complete.'
} catch {
    Write-Error $_
    exit 1
}

Stop-LiiiraaLog
