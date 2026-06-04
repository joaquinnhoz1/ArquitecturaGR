# Descargador con sessionid directo
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host " DESCARGADOR PORTFOLIO - arq.estudio.gr" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Como obtener el sessionid:" -ForegroundColor Yellow
Write-Host "  1. Chrome abierto en instagram.com (logueado)" -ForegroundColor White
Write-Host "  2. Presiona F12 para abrir DevTools" -ForegroundColor White
Write-Host "  3. Pestaña Application -> Storage -> Cookies -> https://www.instagram.com" -ForegroundColor White
Write-Host "  4. Busca la cookie llamada 'sessionid'" -ForegroundColor White
Write-Host "  5. Copia el valor completo (empieza con numeros, +50 chars)" -ForegroundColor White
Write-Host ""
Write-Host "Instalando requests..." -ForegroundColor Yellow
python -m pip install requests --quiet --upgrade 2>$null
Write-Host "OK" -ForegroundColor Green
Write-Host ""
Write-Host "Iniciando descargador..." -ForegroundColor Yellow
python "$env:USERPROFILE\Desktop\Portfolio Arquitectura\descargar-con-sessionid.py"
