# Find and stop only the CD2 process
Get-Process -Name powershell -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like '*powershell.exe' -and (Get-CimInstance Win32_Process -Filter "ProcessId = $($_.Id)" -ErrorAction SilentlyContinue).CommandLine -match 'download_cd2'
} | Stop-Process -Force -ErrorAction SilentlyContinue

# Relaunch CD2
$cd2Script = "C:\Users\saros\Documents\buildbazaar-\download_cd2.ps1"
$p = Start-Process -FilePath "powershell.exe" -ArgumentList "-File", $cd2Script -WindowStyle Hidden -PassThru
Write-Output "CD2 restarted with PID: $($p.Id)"
