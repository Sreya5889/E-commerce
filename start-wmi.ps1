$workspace = "c:\Users\DELL\OneDrive\Documents\e-commerce"

# 1. Start Vite Frontend (port 5173)
$conn5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if (-not $conn5173) {
    $cmdVite = "cmd.exe /c node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173"
    $procVite = Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList $cmdVite, $workspace
    Write-Host "Spawned Vite Frontend (PID: $($procVite.ProcessId)) on port 5173"
} else {
    Write-Host "Port 5173 (Vite) is already listening."
}

# 2. Start Express Backend API (port 5000)
$conn5000 = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue
if (-not $conn5000) {
    $cmdServer = "cmd.exe /c node server\server.js"
    $procServer = Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList $cmdServer, $workspace
    Write-Host "Spawned Express Server (PID: $($procServer.ProcessId)) on port 5000"
} else {
    Write-Host "Port 5000 (API Server) is already listening."
}

# 3. Start Reverse Proxy (port 80)
$conn80 = Get-NetTCPConnection -LocalPort 80 -ErrorAction SilentlyContinue
if (-not $conn80) {
    $cmdProxy = "cmd.exe /c node server\proxy.js"
    $procProxy = Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList $cmdProxy, $workspace
    Write-Host "Spawned Local Reverse Proxy (PID: $($procProxy.ProcessId)) on port 80"
} else {
    Write-Host "Port 80 is already in use."
}

Start-Sleep -Seconds 4
Write-Host "`n=== Active Listening Ports ==="
Get-NetTCPConnection -LocalPort 80, 5000, 5173 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, State, OwningProcess
