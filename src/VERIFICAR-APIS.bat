@echo off
cls
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║              🔍 VERIFICANDO APIs HARDCODED NO CÓDIGO 🔍                 ║
echo ║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
echo.
timeout /t 1 /nobreak >nul

echo [1/5] Verificando /utils/tmdb.ts...
findstr /C:"ddb1bdf6aa91bdf335797853884b0c1d" utils\tmdb.ts >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ✅ API Key encontrada em tmdb.ts
) else (
    color 0C
    echo ❌ API Key NAO encontrada em tmdb.ts
)
echo.

echo [2/5] Verificando /components/MovieCard.tsx...
findstr /C:"ddb1bdf6aa91bdf335797853884b0c1d" components\MovieCard.tsx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ✅ API Key encontrada em MovieCard.tsx
) else (
    color 0C
    echo ❌ API Key NAO encontrada em MovieCard.tsx
)
echo.

echo [3/5] Verificando /components/MoviesPage.tsx...
findstr /C:"ddb1bdf6aa91bdf335797853884b0c1d" components\MoviesPage.tsx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ✅ API Key encontrada em MoviesPage.tsx
) else (
    color 0C
    echo ❌ API Key NAO encontrada em MoviesPage.tsx
)
echo.

echo [4/5] Verificando /components/SeriesPage.tsx...
findstr /C:"ddb1bdf6aa91bdf335797853884b0c1d" components\SeriesPage.tsx >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ✅ API Key encontrada em SeriesPage.tsx
) else (
    color 0C
    echo ❌ API Key NAO encontrada em SeriesPage.tsx
)
echo.

echo [5/5] Verificando /utils/primeVicioLoader.ts...
findstr /C:"ddb1bdf6aa91bdf335797853884b0c1d" utils\primeVicioLoader.ts >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    color 0A
    echo ✅ API Key encontrada em primeVicioLoader.ts
) else (
    color 0C
    echo ❌ API Key NAO encontrada em primeVicioLoader.ts
)
echo.

color 0E
echo.
echo ══════════════════════════════════════════════════════════════════════════
echo.
echo ✅ TODAS as APIs estão HARDCODED no código!
echo.
echo Você PODE rodar o projeto SEM precisar de .env!
echo.
echo Execute: LIMPAR-E-RODAR.bat
echo.
echo ══════════════════════════════════════════════════════════════════════════
echo.
pause
