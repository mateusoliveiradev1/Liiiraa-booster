function Require-Admin {
    $principal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
    if (-not $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
        Write-Error 'This script must be run as Administrator. Exiting.'
        exit 1
    }
}

function Start-LiiiraaLog {
    param(
        [Parameter(Mandatory)][string]$Name
    )
    $logDir = Join-Path $PSScriptRoot '..\logs'
    if (!(Test-Path $logDir)) {
        New-Item -Path $logDir -ItemType Directory | Out-Null
    }
    if (-not $Name.EndsWith('.log')) {
        $Name = "$Name.log"
    }
    $logFile = Join-Path $logDir $Name
    Start-Transcript -Path $logFile -Append | Out-Null
}

Export-ModuleMember -Function Require-Admin, Start-LiiiraaLog
