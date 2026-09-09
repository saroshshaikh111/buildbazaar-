$exePath = "C:\Program Files (x86)\EA SPORTS\FIFA 2005\fifa2005.exe"
$depPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
if (!(Test-Path $depPath)) { New-Item -Path $depPath -Force | Out-Null }
Set-ItemProperty -Path $depPath -Name $exePath -Value "WINXPSP3 RUNASADMIN DISABLEDEP" -Force
Write-Output "DEP disabled system-wide for fifa2005.exe"

# Copy RunGame.exe from CD2 
Copy-Item "D:\RunGame.exe" "C:\Program Files (x86)\EA SPORTS\FIFA 2005\RunGame.exe" -Force
Write-Output "Copied RunGame.exe"
