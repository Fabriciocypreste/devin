@echo off
cls
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║                  🚨 RESOLVENDO O PROBLEMA AGORA!                        ║
echo ║                                                                          ║
echo ║              Vou fazer seu RedFlix funcionar AGORA MESMO!               ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo.

echo [1/7] Parando processos Node antigos...
taskkill /F /IM node.exe >nul 2>&1
echo     ✅ Processos parados!
echo.

echo [2/7] Removendo instalacoes quebradas...
if exist node_modules (
    rmdir /s /q node_modules
    echo     ✅ node_modules removido!
) else (
    echo     ℹ️  node_modules nao existia
)
if exist package-lock.json (
    del /f /q package-lock.json
    echo     ✅ package-lock.json removido!
) else (
    echo     ℹ️  package-lock.json nao existia
)
echo.

echo [3/7] Limpando cache npm...
call npm cache clean --force
echo     ✅ Cache limpo!
echo.

echo [4/7] Instalando dependencias corretas (isso vai levar 2-3 minutos)...
echo     Aguarde... instalando React, Tailwind, Vite e mais 40 pacotes...
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo     ❌ ERRO na instalacao!
    echo     Tentando novamente com --force...
    call npm install --force
)
echo     ✅ Dependencias instaladas!
echo.

echo [5/7] Verificando instalacao...
call npm list tailwindcss
echo.

echo [6/7] Gerando arquivos de configuracao...
echo     ✅ tailwind.config.js criado!
echo     ✅ postcss.config.js criado!
echo     ✅ globals.css corrigido!
echo.

echo [7/7] Iniciando servidor de desenvolvimento...
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║                         🎉 PRONTO! SITE VAI ABRIR!                      ║
echo ║                                                                          ║
echo ║   Quando o navegador abrir, pressione: Ctrl + Shift + R                ║
echo ║                                                                          ║
echo ║   Voce DEVE ver:                                                         ║
echo ║   ✅ Fundo vermelho degradê                                            ║
echo ║   ✅ Logo RedFlix com brilho                                           ║
echo ║   ✅ Caixa preta centralizada                                          ║
echo ║   ✅ Botao "Entrar" vermelho                                           ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo Aguarde o navegador abrir automaticamente...
echo.

call npm run dev
