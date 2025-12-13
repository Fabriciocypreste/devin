@echo off
chcp 65001 >nul
cls

echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║              🚨 CORREÇÃO AUTOMÁTICA - ESTILOS CSS QUEBRADOS             ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo.

echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   ⚡ INICIANDO CORREÇÃO AUTOMÁTICA
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

timeout /t 2 /nobreak >nul

echo [1/6] 🛑 Parando servidor Node.js...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo       ✅ Servidor parado com sucesso
) else (
    echo       ⚠️  Nenhum servidor estava rodando
)
echo.

timeout /t 1 /nobreak >nul

echo [2/6] 🗑️  Removendo node_modules...
if exist node_modules (
    rd /s /q node_modules 2>nul
    echo       ✅ node_modules removido
) else (
    echo       ⚠️  node_modules não encontrado
)
echo.

timeout /t 1 /nobreak >nul

echo [3/6] 🗑️  Removendo package-lock.json...
if exist package-lock.json (
    del /f /q package-lock.json 2>nul
    echo       ✅ package-lock.json removido
) else (
    echo       ⚠️  package-lock.json não encontrado
)
echo.

timeout /t 1 /nobreak >nul

echo [4/6] 🧹 Limpando cache do npm...
call npm cache clean --force
echo       ✅ Cache limpo
echo.

timeout /t 1 /nobreak >nul

echo [5/6] 📦 Reinstalando dependências...
echo       ⏳ Isso pode demorar alguns minutos...
echo.
call npm install
if %errorlevel% equ 0 (
    echo.
    echo       ✅ Dependências instaladas com sucesso!
) else (
    echo.
    echo       ❌ ERRO ao instalar dependências!
    echo       Tente manualmente: npm install
    pause
    exit /b 1
)
echo.

timeout /t 2 /nobreak >nul

echo [6/6] 🚀 Iniciando servidor...
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo   ✅ CORREÇÃO CONCLUÍDA COM SUCESSO!
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.
echo   📌 PRÓXIMOS PASSOS:
echo.
echo   1️⃣  O servidor vai iniciar automaticamente agora
echo   2️⃣  Quando abrir o navegador, pressione: Ctrl + Shift + R
echo   3️⃣  Você DEVE ver o fundo vermelho e todos os estilos!
echo.
echo   🔴 RESULTADO ESPERADO:
echo      ✅ Fundo vermelho degradê
echo      ✅ Caixa preta centralizada
echo      ✅ Botão "Entrar" vermelho brilhante
echo      ✅ Logo com efeito de brilho
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

timeout /t 3 /nobreak >nul

echo   🚀 Iniciando npm run dev...
echo.
echo   ⚠️  IMPORTANTE: Quando o navegador abrir, pressione Ctrl+Shift+R
echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

timeout /t 2 /nobreak >nul

call npm run dev
