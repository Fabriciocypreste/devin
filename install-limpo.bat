@echo off
echo.
echo ========================================
echo   REDFLIX - INSTALACAO LIMPA
echo ========================================
echo.

echo [1/7] Parando processos...
taskkill /F /IM node.exe 2>nul

echo [2/7] Removendo node_modules da raiz...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo [3/7] Removendo node_modules do src...
if exist src\node_modules rmdir /s /q src\node_modules
if exist src\package-lock.json del /f /q src\package-lock.json

echo [4/7] Limpando cache do npm...
call npm cache clean --force

echo [5/7] Limpando cache do Vite...
if exist node_modules\.vite rmdir /s /q node_modules\.vite

echo [6/7] Instalando dependencias da raiz...
call npm install

echo [7/7] Instalando dependencias do src...
cd src
call npm install
cd ..

echo.
echo ========================================
echo   INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Agora execute: npm run dev
echo.
pause
