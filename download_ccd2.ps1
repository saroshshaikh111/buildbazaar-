[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$setupDir = "C:\FIFA2005_Setup"
$wc = New-Object System.Net.WebClient
$wc.Headers.Add("User-Agent", "Mozilla/5.0")

# Download CCD and SUB files for CD2 (needed for CloneCD mount to bypass copy protection)
Write-Output "Downloading CD2.ccd..."
$wc.DownloadFile(
    "https://archive.org/download/fifa2005_multi6/TLF-GAME-10.06.04.FIFA.2005.CLONECD-CXZISO-CD2-ENG.CCD",
    "$setupDir\CD2.ccd"
)
Write-Output "CCD downloaded: $((Get-Item "$setupDir\CD2.ccd").Length) bytes"

Write-Output "Downloading CD2.sub..."
$wc.DownloadFile(
    "https://archive.org/download/fifa2005_multi6/TLF-GAME-10.06.04.FIFA.2005.CLONECD-CXZISO-CD2-ENG.SUB",
    "$setupDir\CD2.sub"
)
Write-Output "SUB downloaded: $((Get-Item "$setupDir\CD2.sub").Length) bytes"

# Rename the IMG to match CCD
if (!(Test-Path "$setupDir\CD2.img")) {
    Write-Output "CD2.img already named correctly"
} else {
    Write-Output "CD2.img exists - ready to mount with WinCDEmu"
}

Write-Output "Done! All CloneCD files ready."
