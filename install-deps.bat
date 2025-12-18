@echo off
echo 🧹 Limpando cache do npm...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json

echo 📦 Instalando dependências da raiz...
call npm install

echo 📦 Instalando dependências do src...
cd src
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del /f /q package-lock.json
call npm install
cd ..

echo ✅ Instalação completa!
echo.
echo Para rodar o projeto, execute:
echo   npm run dev

pause
