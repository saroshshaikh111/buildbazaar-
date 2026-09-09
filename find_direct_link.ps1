[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0")

# Try lonebullet search
$html = $wc.DownloadString("https://lonebullet.com/search.php?q=fifa+2005")
$matches = [regex]::Matches($html, 'href="([^"]*fifa[^"]*)"', 'IgnoreCase')
foreach ($m in $matches) {
    Write-Output $m.Groups[1].Value
}
