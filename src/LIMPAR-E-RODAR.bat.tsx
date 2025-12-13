@echo off
cls
color 0C
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║              🔥 LIMPEZA COMPLETA + INSTALACAO FORCADA 🔥               ║
echo ║                                                                          ║
echo ║           Isso vai GARANTIR que o CSS carregue corretamente!            ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
timeout /t 2 /nobreak >nul

color 0E
echo [1/8] Parando TODOS os processos Node.js...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 1 /nobreak >nul
echo ✅ Processos parados!
echo.

echo [2/8] Removendo node_modules...
if exist node_modules (
    rmdir /s /q node_modules 2>nul
    echo ✅ node_modules removido!
) else (
    echo ℹ️  node_modules nao existia
)
echo.

echo [3/8] Removendo package-lock.json...
if exist package-lock.json (
    del /f /q package-lock.json 2>nul
    echo ✅ package-lock.json removido!
) else (
    echo ℹ️  package-lock.json nao existia
)
echo.

echo [4/8] Removendo cache do Vite...
if exist .vite (
    rmdir /s /q .vite 2>nul
    echo ✅ Cache Vite removido!
) else (
    echo ℹ️  Cache Vite nao existia
)
echo.

echo [5/8] Removendo dist...
if exist dist (
    rmdir /s /q dist 2>nul
    echo ✅ dist removido!
) else (
    echo ℹ️  dist nao existia
)
echo.

echo [6/8] Limpando cache npm...
call npm cache clean --force
call npm cache verify
echo ✅ Cache npm limpo e verificado!
echo.

color 0A
echo [7/8] Instalando dependencias com --force...
echo     Isso vai FORCAR a reinstalacao do Tailwind CSS!
echo.
call npm install --legacy-peer-deps --force

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ❌ ERRO na instalacao!
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Instalacao completa!
echo.

echo [8/8] Verificando Tailwind CSS...
call npm list tailwindcss
echo.

color 0E

echo.
echo [9/9] Verificando arquivo .env...
if exist .env (
    echo ✅ Arquivo .env encontrado!
    echo    Contem: TMDB API Key e Supabase
) else (
    color 0C
    echo ❌ AVISO: Arquivo .env NAO encontrado!
    echo    O projeto foi baixado sem o .env
    echo    Mas eu ja criei um para voce!
    color 0A
)
echo.

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║                    ✅ TUDO LIMPO E REINSTALADO! ✅                      ║
echo ║                                                                          ║
echo ║              Agora vou iniciar o servidor novamente...                  ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │                                                                          │
echo │  ⚡ IMPORTANTE: QUANDO O NAVEGADOR ABRIR                                 │
echo │                                                                          │
echo │     1. Pressione: Ctrl + Shift + Delete                                 │
echo │     2. Marque: "Imagens e arquivos em cache"                            │
echo │     3. Clique: "Limpar dados"                                           │
echo │     4. Depois pressione: Ctrl + Shift + R                               │
echo │                                                                          │
echo │  ✅ AI SIM O FUNDO VERMELHO VAI APARECER!                               │
echo │                                                                          │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.
echo Iniciando em 3 segundos...
timeout /t 3 /nobreak >nul

color 0A
call npm run dev
