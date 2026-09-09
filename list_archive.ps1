[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$res = Invoke-WebRequest -Uri "https://archive.org/download/fifa2005_multi6" -UseBasicParsing
$res.Links | Where-Object {$_.href -notmatch "^#" -and $_.href -ne "/"} | Select-Object href
