$workspace = "c:\Users\DELL\OneDrive\Documents\e-commerce"

# Terminate any existing stuck processes on 5000 or 5173
$ports = @(5000, 5173)
foreach ($port in $ports) {
    $conns = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($conns) {
        foreach ($c in $conns) {
            try {
                Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue
            } catch {}
        }
    }
}

Start-Sleep -Milliseconds 500

# Start Vite detached under WmiPrvSE
$viteCmd = "cmd.exe /c node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173 > vite.log 2>&1"
$resVite = Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList $viteCmd, $workspace

# Start Express Server detached under WmiPrvSE
$serverCmd = "cmd.exe /c node server\server.js > server.log 2>&1"
$resServer = Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList $serverCmd, $workspace

Write-Host "Vite Process ID: $($resVite.ProcessId)"
Write-Host "Server Process ID: $($resServer.ProcessId)"

Start-Sleep -Seconds 3

# Verify ports
$active = Get-NetTCPConnection -LocalPort 5000, 5173 -ErrorAction SilentlyContinue
$active | Select-Object LocalAddress, LocalPort, State, OwningProcess | Format-Table -AutoSize
