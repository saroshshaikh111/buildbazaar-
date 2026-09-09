$exePath = "C:\Program Files (x86)\EA SPORTS\FIFA 2005\fifa2005.exe"
$regPath = "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
if (!(Test-Path $regPath)) { New-Item -Path $regPath -Force }
Set-ItemProperty -Path $regPath -Name $exePath -Value "WINXPSP3 RUNASADMIN" -Force
Write-Output "Compatibility mode set to Windows XP SP3 + Run as Admin"
