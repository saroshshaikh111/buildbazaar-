# Disable DEP for FIFA 2005
$exePath = "C:\Program Files (x86)\EA SPORTS\FIFA 2005\fifa2005.exe"

# Method 1: Add to DEP exception list via registry
$depPath = "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags\Layers"
try {
    if (!(Test-Path $depPath)) { New-Item -Path $depPath -Force | Out-Null }
    # DISABLEDEP disables Data Execution Prevention for this specific exe
    $current = (Get-ItemProperty -Path $depPath -Name $exePath -ErrorAction SilentlyContinue).$exePath
    if ($current) {
        Set-ItemProperty -Path $depPath -Name $exePath -Value "$current DISABLEDEP" -Force
    } else {
        Set-ItemProperty -Path $depPath -Name $exePath -Value "DISABLEDEP" -Force
    }
    Write-Output "DEP disabled for fifa2005.exe (HKLM)"
} catch {
    Write-Output "HKLM failed: $_"
}

# Also try the CD2 exe which may be the cracked version - copy it over
$cd2Exe = "D:\fifa2005.exe"
$installExe = "C:\Program Files (x86)\EA SPORTS\FIFA 2005\fifa2005.exe"

if (Test-Path $cd2Exe) {
    $cd2Size = (Get-Item $cd2Exe).Length
    $instSize = (Get-Item $installExe).Length
    Write-Output "CD2 exe size: $cd2Size, Installed exe size: $instSize"
    
    if ($cd2Size -ne $instSize) {
        Write-Output "Sizes differ - CD2 may be the cracked version! Copying..."
        Copy-Item $installExe "$installExe.bak" -Force
        Copy-Item $cd2Exe $installExe -Force
        Write-Output "Replaced with CD2 exe!"
    } else {
        Write-Output "Same size - identical files."
    }
} else {
    Write-Output "CD2 drive not accessible"
}

# Also check the RunGame.exe on CD2
$runGame = "D:\RunGame.exe"
if (Test-Path $runGame) {
    Write-Output "RunGame.exe found on CD2, size: $((Get-Item $runGame).Length)"
    Copy-Item $runGame "C:\Program Files (x86)\EA SPORTS\FIFA 2005\RunGame.exe" -Force
    Write-Output "Copied RunGame.exe to install dir"
}

Write-Output "Done!"
