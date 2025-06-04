# Windows Debloat script
# Invoked via `window.api.runScript('debloat')` in Electron

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
Start-Transcript -Path $logFile -Append | Out-Null

try {
    $apps = @(
        'Microsoft.ZuneMusic',
        'Microsoft.ZuneVideo',
        'Microsoft.BingNews',
        'Microsoft.MicrosoftSolitaireCollection',
        'Microsoft.YourPhone',
        'Microsoft.GetHelp'
    )
    foreach ($app in $apps) {
        Get-AppxPackage -Name $app -AllUsers | Remove-AppxPackage -ErrorAction SilentlyContinue
        Write-Output "Removed $app"
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
