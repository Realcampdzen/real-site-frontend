# PowerShell script for preparing PRODUCTION files for NIC.RU hosting
# This creates a clean production version WITHOUT test features
# Run: .\prepare-deploy.ps1

$ErrorActionPreference = "Continue"
$deployFolder = "deploy-ready"

Write-Host ""
Write-Host "🚀 Preparing PRODUCTION files for NIC.RU deployment..." -ForegroundColor Cyan
Write-Host "   This will create a clean version WITHOUT test features" -ForegroundColor Yellow
Write-Host ""

# Remove old deploy-ready folder if exists
if (Test-Path $deployFolder) {
    Write-Host "Removing old $deployFolder folder..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $deployFolder -ErrorAction SilentlyContinue
}

# Create new folder
New-Item -ItemType Directory -Path $deployFolder -Force | Out-Null
Write-Host "Created folder: $deployFolder" -ForegroundColor Green

# Copy main files
Write-Host "📄 Copying main files..." -ForegroundColor Cyan
$includeFiles = @(
    "index.html",
    "manifest.json",
    "sw.js",
    "service-detail.html",
    "ai-photo-detail.html",
    ".htaccess"
)

foreach ($file in $includeFiles) {
    if (Test-Path $file) {
        Copy-Item $file -Destination $deployFolder -Force
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  NOT FOUND: $file" -ForegroundColor Yellow
    }
}

# Copy folders
Write-Host ""
Write-Host "📁 Copying folders..." -ForegroundColor Cyan
$includeFolders = @(
    "css",
    "js",
    "public",
    "images",
    "img",
    "chat-components"
)

foreach ($folder in $includeFolders) {
    if (Test-Path $folder) {
        $destPath = Join-Path $deployFolder $folder
        Copy-Item -Path $folder -Destination $destPath -Recurse -Force
        Write-Host "  ✅ $folder/" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  NOT FOUND: $folder/" -ForegroundColor Yellow
    }
}

# Clean up dev/excluded files
Write-Host ""
Write-Host "🧹 Cleaning up dev/excluded files..." -ForegroundColor Cyan
$excludePatterns = @(
    "node_modules",
    ".git",
    ".env",
    "logs",
    "*.log",
    "server.js",
    "package.json",
    "package-lock.json"
)

foreach ($pattern in $excludePatterns) {
    $items = Get-ChildItem -Path $deployFolder -Recurse -Include $pattern -ErrorAction SilentlyContinue
    foreach ($item in $items) {
        Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  🗑️  Removed: $($item.Name)" -ForegroundColor Yellow
    }
}

# Remove debug/test files
Write-Host ""
Write-Host "🗑️  Removing debug/test files..." -ForegroundColor Cyan
$debugFiles = Get-ChildItem -Path $deployFolder -Recurse -File | Where-Object {
    $_.Name -match "(debug|test|fix)-.*\.html" -or 
    $_.Name -match ".*_(temp|backup|fixed)\.css" -or
    $_.Name -match "visual-editor\.html"
}
foreach ($file in $debugFiles) {
    Remove-Item -Path $file.FullName -Force -ErrorAction SilentlyContinue
    Write-Host "  🗑️  Removed debug file: $($file.Name)" -ForegroundColor Yellow
}

# PRODUCTION: Remove test features
# TODO: Add logic here to remove/modify test features when ready
# Examples:
# - Remove test bot connections (if not connected to AI)
# - Remove incomplete sections
# - Remove placeholder images
# - Disable test features in HTML/JS

Write-Host ""
Write-Host "📝 Production cleanup:" -ForegroundColor Cyan
Write-Host "  ℹ️  Note: Test features removal can be added here when needed" -ForegroundColor Gray
Write-Host "  ℹ️  Examples: incomplete bots, placeholder images, test sections" -ForegroundColor Gray

# Count files
$fileCount = (Get-ChildItem -Path $deployFolder -Recurse -File | Measure-Object).Count
$folderCount = (Get-ChildItem -Path $deployFolder -Recurse -Directory | Measure-Object).Count

Write-Host ""
Write-Host "✅ DONE! Production files prepared in folder: $deployFolder" -ForegroundColor Green
Write-Host "   📊 Total files: $fileCount" -ForegroundColor Cyan
Write-Host "   📁 Total folders: $folderCount" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next step: Get list of files to upload" -ForegroundColor Yellow
Write-Host "   Run: .\list-files-to-upload.ps1" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Important: NIC.RU doesn't support folder upload!" -ForegroundColor Yellow
Write-Host "   You need to upload files one by one into existing folders" -ForegroundColor Gray
Write-Host "   See DEVELOPMENT_WORKFLOW.md for detailed instructions" -ForegroundColor Gray
Write-Host ""

