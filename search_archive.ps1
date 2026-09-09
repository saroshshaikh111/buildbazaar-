[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$url = "https://archive.org/advancedsearch.php?q=fifa2005&fl[]=identifier&fl[]=title&output=json"
$res = Invoke-WebRequest -Uri $url -UseBasicParsing
$res.Content
