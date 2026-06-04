@echo off
python --version >nul 2>&1
if errorlevel 1 goto trypy
goto haspy
:trypy
py --version >nul 2>&1
if errorlevel 1 (
  echo Python no encontrado.
  echo Instala Python: winget install Python.Python.3.12
  pause
  exit /b 1
)
set PYCMD=py
goto start
:haspy
set PYCMD=python
:start
echo [1/3] Instalando instaloader...
%PYCMD% -m pip install instaloader --quiet --upgrade
echo [2/3] Descargando @arq.estudio.gr...
echo Chrome debe estar abierto y logueado en Instagram.
if not exist "%USERPROFILE%\Desktop\ig_descarga_temp" mkdir "%USERPROFILE%\Desktop\ig_descarga_temp"
cd /d "%USERPROFILE%\Desktop\ig_descarga_temp"
%PYCMD% -m instaloader --load-cookies chrome --no-videos --no-captions --no-compress-json --no-metadata-json --dirname-pattern {profile} --filename-pattern {shortcode} -- arq.estudio.gr
if errorlevel 1 (
  echo ERROR: Verificá que Chrome esté abierto y logueado en Instagram.
  pause
  exit /b 1
)
echo [3/3] Organizando archivos...
%PYCMD% "%USERPROFILE%\Desktop\Portfolio Arquitectura\organizar-descargas.py" "%USERPROFILE%\Desktop\ig_descarga_temp\arq.estudio.gr"
echo.
echo COMPLETADO - Revisá la carpeta Portfolio Arquitectura en el Escritorio.
pause
