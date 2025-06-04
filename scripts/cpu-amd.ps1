# AMD CPU optimization script
# Invoked via `window.api.runScript('cpu-amd')` in Electron

# Ensure script is running as Administrator
$principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Error 'This script must be run as Administrator. Exiting.'
    exit 1
}

$logDir = Join-Path $PSScriptRoot '..\logs'
if (!(Test-Path $logDir)) { New-Item -Path $logDir -ItemType Directory | Out-Null }
$logFile = Join-Path $logDir 'cpu-amd.log'
Start-Transcript -Path $logFile -Append | Out-Null

try {
    Write-Output 'Applying AMD CPU optimizations...'

    # Activate AMD Ryzen High Performance plan when available
    $ryzenPlan = powercfg -l | Where-Object { $_ -match 'AMD Ryzen High Performance' }
    if ($ryzenPlan) {
        $guid = $ryzenPlan -replace '.*GUID:\s*([\w-]+).*', '$1'
        powercfg -setactive $guid | Out-Null
    }

    # Disable core parking
    $policy = '0cc5b647-c1df-4637-891a-dec35c318583'
    $sub    = '3b04d4fd-1cc7-4f23-ab1c-d1337819c4bb'
    powercfg -setacvalueindex scheme_current $policy $sub 100
    powercfg -setdcvalueindex scheme_current $policy $sub 100

    Write-Output 'CPU optimization complete.'
} catch {
    Write-Error $_
}

Stop-Transcript | Out-Null
