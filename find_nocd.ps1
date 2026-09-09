[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36")
$wc.Headers.Add("Referer", "https://www.myabandonware.com/game/fifa-soccer-2005-cn4")

# Try the direct download page
$html = $wc.DownloadString("https://www.myabandonware.com/game/fifa-soccer-2005-cn4/download/")
Write-Output "--- All links on download page ---"
$matches2 = [regex]::Matches($html, 'href="([^"]+)"')
foreach ($m in $matches2) {
    $link = $m.Groups[1].Value
    if ($link -match "fifa|nocd|crack|fix|patch|download|zip|rar|exe") {
        Write-Output $link
    }
}
