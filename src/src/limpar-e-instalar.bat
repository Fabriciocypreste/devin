@echo off
echo ========================================
echo  LIMPANDO CACHE E REINSTALANDO NPM
echo ========================================
echo.

echo [1/4] Limpando cache do npm...
call npm cache clean --force

echo.
echo [2/4] Removendo node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo OK - node_modules removido
) else (
    echo OK - node_modules nao existe
)

echo.
echo [3/4] Removendo package-lock.json...
if exist package-lock.json (
    del /f package-lock.json
    echo OK - package-lock.json removido
) else (
    echo OK - package-lock.json nao existe
)

echo.
echo [4/4] Instalando dependencias...
call npm install

echo.
echo ========================================
echo  CONCLUIDO! Execute: npm run dev
echo ========================================
pause
