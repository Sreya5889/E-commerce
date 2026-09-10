# EduAcademy - Local Domain Hosts Setup Script
# Safely adds 'mycourse.test' and 'api.mycourse.test' to Windows hosts file.

$hostsPath = "$env:windir\System32\drivers\etc\hosts"

# Self-elevate to Administrator if not already running with elevated privileges
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "Requesting Administrator privileges to update hosts file..." -ForegroundColor Cyan
    Start-Process powershell.exe -Verb RunAs -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`""
    exit
}

Write-Host "====================================================" -ForegroundColor Green
Write-Host "  EduAcademy - Local Demo Domain Setup" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green

if (-not (Test-Path $hostsPath)) {
    Write-Host "Error: Hosts file not found at $hostsPath" -ForegroundColor Red
    Pause
    exit 1
}

$content = Get-Content -Path $hostsPath -Raw -ErrorAction Stop

$entriesNeeded = @(
    "127.0.0.1 mycourse.test",
    "127.0.0.1 api.mycourse.test"
)

$toAdd = @()
foreach ($entry in $entriesNeeded) {
    $domain = ($entry -split '\s+')[1]
    if ($content -notmatch [regex]::Escape($domain)) {
        $toAdd += $entry
    } else {
        Write-Host " [OK] Domain already mapped: $domain" -ForegroundColor Yellow
    }
}

if ($toAdd.Count -gt 0) {
    $linesToAdd = "`r`n`r`n# EduAcademy Local Demo Domains`r`n" + ($toAdd -join "`r`n") + "`r`n"
    Add-Content -Path $hostsPath -Value $linesToAdd -ErrorAction Stop
    Write-Host " [SUCCESS] Added following entries to $hostsPath :" -ForegroundColor Green
    foreach ($line in $toAdd) {
        Write-Host "    $line" -ForegroundColor Green
    }
} else {
    Write-Host " [INFO] All local demo domains are already configured in $hostsPath" -ForegroundColor Cyan
}

# Flush DNS Resolver Cache
Write-Host " Flushing Windows DNS resolver cache..." -ForegroundColor Cyan
ipconfig /flushdns | Out-Null
Write-Host " [OK] DNS cache flushed successfully." -ForegroundColor Green

Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "Setup Complete! You can now access:" -ForegroundColor White
Write-Host "  Frontend : http://mycourse.test" -ForegroundColor Cyan
Write-Host "  Backend  : http://api.mycourse.test" -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Green
Write-Host "Press any key to close..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
