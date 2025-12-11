# PowerShell script to list files for manual upload to NIC.RU
# Since NIC.RU doesn't support folder upload, this helps track which files to upload
# Run: .\list-files-to-upload.ps1

$ErrorActionPreference = "Continue"
$deployFolder = "deploy-ready"

Write-Host ""
Write-Host "📋 Creating list of files to upload to NIC.RU..." -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $deployFolder)) {
    Write-Host "❌ Error: Folder '$deployFolder' not found!" -ForegroundColor Red
    Write-Host "   Run .\prepare-deploy.ps1 first to prepare files." -ForegroundColor Yellow
    exit 1
}

# Get all files with their relative paths
$allFiles = Get-ChildItem -Path $deployFolder -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace((Resolve-Path $deployFolder).Path + "\", "").Replace("\", "/")
    [PSCustomObject]@{
        Path = $relativePath
        FullPath = $_.FullName
        Size = $_.Length
        Folder = Split-Path -Path $relativePath -Parent
        FileName = $_.Name
    }
}

# Group by folder
$filesByFolder = $allFiles | Group-Object -Property Folder

Write-Host "📁 Files organized by folder for upload:" -ForegroundColor Green
Write-Host ""

$totalFiles = 0
foreach ($folderGroup in $filesByFolder) {
    $folderName = if ($folderGroup.Name) { $folderGroup.Name } else { "Root (docs/)" }
    
    Write-Host "📂 $folderName" -ForegroundColor Cyan
    Write-Host "   Upload to: docs/$folderName" -ForegroundColor Gray
    Write-Host ""
    
    foreach ($file in $folderGroup.Group) {
        $sizeKB = [math]::Round($file.Size / 1KB, 2)
        Write-Host "   📄 $($file.FileName)" -ForegroundColor White
        Write-Host "      Size: $sizeKB KB" -ForegroundColor Gray
        Write-Host "      Path: deploy-ready/$($file.Path)" -ForegroundColor Gray
        Write-Host ""
        $totalFiles++
    }
    
    Write-Host ""
}

# Create summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "📊 Summary:" -ForegroundColor Green
Write-Host "   Total files: $totalFiles" -ForegroundColor Cyan
Write-Host "   Total folders: $($filesByFolder.Count)" -ForegroundColor Cyan
Write-Host ""
Write-Host "📤 Upload instructions:" -ForegroundColor Yellow
Write-Host "   1. Go to: https://www.nic.ru/hcp2/" -ForegroundColor White
Write-Host "   2. Open File Manager → docs/" -ForegroundColor White
Write-Host "   3. For each folder above:" -ForegroundColor White
Write-Host "      - Open the folder on NIC.RU (or create if needed)" -ForegroundColor White
Write-Host "      - Upload files from deploy-ready/[folder]/" -ForegroundColor White
Write-Host "   4. Upload files one by one or in batches" -ForegroundColor White
Write-Host ""

# Save to file
$outputFile = "files-to-upload.txt"
$allFiles | Select-Object Path, @{Name="SizeKB";Expression={[math]::Round($_.Size / 1KB, 2)}} | Format-Table -AutoSize | Out-File -FilePath $outputFile -Encoding UTF8

Write-Host "💾 File list saved to: $outputFile" -ForegroundColor Green
Write-Host ""

