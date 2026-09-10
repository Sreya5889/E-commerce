$wsh = New-Object -ComObject WScript.Shell
$desktop = [System.Environment]::GetFolderPath('Desktop')
$shortcutPath = Join-Path $desktop "EduAcademy - Launch Platform.lnk"
$shortcut = $wsh.CreateShortcut($shortcutPath)
$shortcut.TargetPath = "c:\Users\DELL\OneDrive\Documents\e-commerce\start-all.bat"
$shortcut.WorkingDirectory = "c:\Users\DELL\OneDrive\Documents\e-commerce"
$shortcut.WindowStyle = 1
$shortcut.Description = "Launch EduAcademy Servers (Ports 5000 & 5173)"
$shortcut.Save()
Write-Host "Desktop shortcut created at: $shortcutPath"
