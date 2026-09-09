[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$installerPath = "C:\FIFA2005_Setup\WinCDEmu.exe"

Write-Output "Downloading WinCDEmu..."
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")
$wc.DownloadFile("https://wincdemu.sysprogs.org/download/", "C:\FIFA2005_Setup\wincdemu_page.html")

# Parse the actual download link from the page
$html = Get-Content "C:\FIFA2005_Setup\wincdemu_page.html" -Raw
$match = [regex]::Match($html, 'href="([^"]*WinCDEmu[^"]*\.exe)"')
if ($match.Success) {
    $link = $match.Groups[1].Value
    if (-not $link.StartsWith("http")) { $link = "https://wincdemu.sysprogs.org$link" }
    Write-Output "Found installer link: $link"
    $wc.DownloadFile($link, $installerPath)
    Write-Output "Downloaded WinCDEmu installer"
} else {
    # Fallback: direct known URL
    $wc.DownloadFile("https://wincdemu.sysprogs.org/static/files/WinCDEmu-4.1.exe", $installerPath)
    Write-Output "Downloaded WinCDEmu using fallback URL"
}

Write-Output "Installing WinCDEmu..."
Start-Process -FilePath $installerPath -ArgumentList "/UNATTENDED" -Wait
Write-Output "WinCDEmu install complete."
