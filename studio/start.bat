@echo off
REM ── Reklame-studio: ett-klikks lokal server (Windows) ──
cd /d "%~dp0"
set PORT=8765

echo.
echo  Starter reklame-studio paa http://localhost:%PORT%
echo  Lat dette vinduet staa aapent mens du jobber.
echo  Lukk vinduet eller trykk Ctrl+C for aa stoppe.
echo.

REM Aapne nettleser etter 1.5 sek (i bakgrunnen)
start "" /B cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:%PORT%/index.html"

REM Proev python3, deretter py, deretter python
where python3 >nul 2>&1
if %errorlevel%==0 (
  python3 -m http.server %PORT%
  goto :eof
)
where py >nul 2>&1
if %errorlevel%==0 (
  py -3 -m http.server %PORT%
  goto :eof
)
where python >nul 2>&1
if %errorlevel%==0 (
  python -m http.server %PORT%
  goto :eof
)
where node >nul 2>&1
if %errorlevel%==0 (
  npx --yes http-server -p %PORT% -c-1
  goto :eof
)

echo.
echo  Fant ikke Python eller Node paa maskinen.
echo  Installer Python fra https://www.python.org/downloads/
echo  (huk av "Add Python to PATH" under installasjon).
echo.
pause
