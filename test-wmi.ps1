$workspace = "c:\Users\DELL\OneDrive\Documents\e-commerce"
$cmd = "cmd.exe /c node node_modules\vite\bin\vite.js --host 0.0.0.0 --port 5173"
$proc = Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList $cmd, $workspace
Write-Host "Spawned Vite with PID: $($proc.ProcessId)"
Start-Sleep -Seconds 6
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | Select-Object LocalAddress, LocalPort, State, OwningProcess
