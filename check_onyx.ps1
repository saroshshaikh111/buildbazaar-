[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")

# Check the ONYX35.txt file for the file listing (index of what's on the DVD)
$txt = $wc.DownloadString("https://archive.org/download/onyxdvd-35/ONYX35.txt")
# Search for FIFA
$lines = $txt -split "`n"
$lines | Where-Object { $_ -match "fifa|FIFA" }
