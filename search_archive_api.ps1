[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

# Search archive.org API for FIFA 2005 no-cd fix files
$searchUrl = "https://archive.org/advancedsearch.php?q=fifa+2005+nocd+fix&fl[]=identifier&fl[]=title&rows=20&output=json"
$json = $wc.DownloadString($searchUrl)
Write-Output $json
