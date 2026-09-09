[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")

$driverPath = "C:\Windows\System32\drivers\secdrv.sys"

# Download secdrv.sys from archive.org (original Windows XP SP3 file)
Write-Output "Downloading secdrv.sys..."
try {
    $wc.DownloadFile(
        "https://archive.org/download/secdrvsys/secdrv.sys",
        $driverPath
    )
    Write-Output "Downloaded from archive.org"
} catch {
    # Try alternate source
    Write-Output "Trying alternate source..."
    $wc.DownloadFile(
        "https://github.com/enoch85/secdrv/raw/master/secdrv.sys",
        $driverPath
    )
    Write-Output "Downloaded from GitHub"
}

$size = (Get-Item $driverPath).Length
Write-Output "secdrv.sys size: $size bytes"

# Register and start the SafeDisc service
Write-Output "Registering secdrv service..."
& sc.exe create secdrv type= kernel start= demand binPath= $driverPath DisplayName= "Security Driver"
& sc.exe start secdrv
Write-Output "secdrv service started!"

# Now verify
$svc = Get-Service secdrv -ErrorAction SilentlyContinue
if ($svc) {
    Write-Output "Service status: $($svc.Status)"
} else {
    Write-Output "Service not found - may need elevation"
}
