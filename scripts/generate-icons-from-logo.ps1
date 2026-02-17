Add-Type -AssemblyName System.Drawing

$sourcePath = "..\public\images\logo.png"
$targetDir = "..\public\images"
$sizes = @(192, 512)
$bgColor = [System.Drawing.ColorTranslator]::FromHtml("#1c1c2b")

# Ensure source exists
if (-not (Test-Path $sourcePath)) {
    Write-Error "Source file not found: $sourcePath"
    exit 1
}

# Load source image
$sourceImage = [System.Drawing.Image]::FromFile($sourcePath)

foreach ($size in $sizes) {
    $targetPath = Join-Path $targetDir "android-chrome-${size}x${size}.png"
    
    # Create new square bitmap
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Set high quality
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality

    # Fill background
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    
    # Calculate aspect ratio to fit logo inside with padding
    # Padding of 20px on each side for 192, scalable for 512
    $padding = $size * 0.1
    $drawSize = $size - ($padding * 2)
    
    $ratio = [Math]::Min($drawSize / $sourceImage.Width, $drawSize / $sourceImage.Height)
    $newWidth = $sourceImage.Width * $ratio
    $newHeight = $sourceImage.Height * $ratio
    $x = ($size - $newWidth) / 2
    $y = ($size - $newHeight) / 2
    
    # Draw image
    $graphics.DrawImage($sourceImage, $x, $y, $newWidth, $newHeight)
    
    # Save
    $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Dispose
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "Generated $targetPath"
}

$sourceImage.Dispose()
