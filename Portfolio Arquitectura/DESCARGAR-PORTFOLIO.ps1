# Descargador Portfolio arq.estudio.gr

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " DESCARGADOR PORTFOLIO - arq.estudio.gr" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "REQUISITO: archivo instagram-cookies.txt en el Escritorio" -ForegroundColor Yellow
Write-Host ""
Write-Host "Como exportar las cookies:" -ForegroundColor White
Write-Host "  1. Chrome -> instagram.com (logueado)" -ForegroundColor Gray
Write-Host "  2. Extension Cookie-Editor -> icono arriba a la derecha" -ForegroundColor Gray
Write-Host "  3. Boton Export (abajo) -> Export as Netscape" -ForegroundColor Gray
Write-Host "     (Si no ves Netscape, exporta en JSON normal, el script lo convierte)" -ForegroundColor Gray
Write-Host "  4. Guardar en Escritorio como: instagram-cookies.txt" -ForegroundColor Gray
Write-Host ""

$cookieFile = "$env:USERPROFILE\Desktop\instagram-cookies.txt"
$cookieConverted = "$env:USERPROFILE\Desktop\instagram-cookies-converted.txt"
$organizer = "$env:USERPROFILE\Desktop\Portfolio Arquitectura\organizar-descargas.py"
$converter = "$env:USERPROFILE\Desktop\Portfolio Arquitectura\convertir-cookies.py"

if (-not (Test-Path $cookieFile)) {
    Write-Host "ERROR: No se encontro instagram-cookies.txt en el Escritorio." -ForegroundColor Red
    Write-Host "Seguir las instrucciones de arriba y volver a ejecutar." -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host "[1/4] Instalando instaloader..." -ForegroundColor Yellow
python -m pip install instaloader --quiet --upgrade 2>$null
Write-Host "OK" -ForegroundColor Green
Write-Host ""

Write-Host "[2/4] Convirtiendo y validando cookies..." -ForegroundColor Yellow
python $converter $cookieFile
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error en las cookies. Revisá las instrucciones." -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}
Write-Host ""

$tempDir = "$env:USERPROFILE\Desktop\ig_descarga_temp"
New-Item -ItemType Directory -Force -Path $tempDir | Out-Null
Set-Location $tempDir

Write-Host "[3/4] Descargando @arq.estudio.gr..." -ForegroundColor Yellow
Write-Host ""

python -m instaloader `
  --cookiefile $cookieConverted `
  --no-videos `
  --no-captions `
  --no-compress-json `
  --no-metadata-json `
  --dirname-pattern "{profile}" `
  --filename-pattern "{shortcode}" `
  -- arq.estudio.gr

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "ERROR en descarga de Instagram." -ForegroundColor Red
    Write-Host "Puede ser que la sesion haya expirado. Exporta las cookies de nuevo." -ForegroundColor Yellow
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "[4/4] Organizando archivos en Portfolio Arquitectura..." -ForegroundColor Yellow
python $organizer "$tempDir\arq.estudio.gr"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host " COMPLETADO - Revisa Portfolio Arquitectura" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Read-Host "Presiona Enter para cerrar"
