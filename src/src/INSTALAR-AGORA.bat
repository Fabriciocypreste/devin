@echo off
echo ============================================
echo REDFLIX - INSTALACAO GARANTIDA
echo ============================================
echo.

echo [1/5] Parando processos Node...
taskkill /F /IM node.exe >nul 2>&1

echo [2/5] Limpando instalacoes antigas...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo [3/5] Limpando cache npm...
call npm cache clean --force

echo [4/5] Instalando dependencias...
call npm install --legacy-peer-deps

echo [5/5] Iniciando servidor...
echo.
echo ============================================
echo PRONTO! Site vai abrir automaticamente!
echo ============================================
echo.
call npm run dev
