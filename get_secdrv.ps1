[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)")

$driverPath = "C:\Windows\System32\drivers\secdrv.sys"

# Try multiple sources for secdrv.sys
$sources = @(
    "https://github.com/nicowillis/secdrv/raw/main/secdrv.sys",
    "https://raw.githubusercontent.com/nicowillis/secdrv/main/secdrv.sys",
    "https://web.archive.org/web/2010/https://download.microsoft.com/download/whistler/md/1.0/WINXP/EN-US/secdrv.sys",
    "https://archive.org/download/winxp-secdrv/secdrv.sys"
)

$downloaded = $false
foreach ($url in $sources) {
    try {
        Write-Output "Trying: $url"
        $wc.DownloadFile($url, $driverPath)
        $size = (Get-Item $driverPath).Length
        if ($size -gt 10000) {
            Write-Output "SUCCESS! Downloaded $size bytes from $url"
            $downloaded = $true
            break
        } else {
            Write-Output "File too small ($size bytes), trying next..."
            Remove-Item $driverPath -Force
        }
    } catch {
        Write-Output "Failed: $_"
    }
}

if (-not $downloaded) {
    Write-Output "All sources failed. Searching archive.org..."
    $search = $wc.DownloadString("https://archive.org/advancedsearch.php?q=secdrv.sys&fl[]=identifier&rows=5&output=json")
    Write-Output $search
}
