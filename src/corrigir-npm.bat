@echo off
chcp 65001 > nul
echo ===================================
echo  CORRIGINDO ERRO NPM INSTALL
echo ===================================
echo.

echo [1/6] Limpando cache npm...
call npm cache clean --force
echo OK

echo.
echo [2/6] Removendo node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo OK - Removido
) else (
    echo OK - Nao existe
)

echo.
echo [3/6] Removendo package-lock.json...
if exist package-lock.json (
    del /f package-lock.json
    echo OK - Removido
) else (
    echo OK - Nao existe
)

echo.
echo [4/6] Removendo yarn.lock...
if exist yarn.lock (
    del /f yarn.lock
    echo OK - Removido
) else (
    echo OK - Nao existe
)

echo.
echo [5/6] Removendo .npmrc local...
if exist .npmrc (
    del /f .npmrc
    echo OK - Removido
) else (
    echo OK - Nao existe
)

echo.
echo [6/6] Criando package.json limpo...
(
echo {
echo   "name": "redflix-platform",
echo   "private": true,
echo   "version": "1.0.0",
echo   "type": "module",
echo   "scripts": {
echo     "dev": "vite",
echo     "build": "vite build",
echo     "preview": "vite preview"
echo   },
echo   "dependencies": {
echo     "react": "^18.3.1",
echo     "react-dom": "^18.3.1",
echo     "react-router-dom": "^6.22.0",
echo     "lucide-react": "^0.344.0",
echo     "sonner": "^1.4.3",
echo     "clsx": "^2.1.0",
echo     "tailwind-merge": "^2.2.1",
echo     "date-fns": "^3.3.1",
echo     "hls.js": "^1.5.1",
echo     "recharts": "^2.10.3",
echo     "@radix-ui/react-accordion": "^1.1.2",
echo     "@radix-ui/react-alert-dialog": "^1.0.5",
echo     "@radix-ui/react-avatar": "^1.0.4",
echo     "@radix-ui/react-checkbox": "^1.0.4",
echo     "@radix-ui/react-dialog": "^1.0.5",
echo     "@radix-ui/react-dropdown-menu": "^2.0.6",
echo     "@radix-ui/react-label": "^2.0.2",
echo     "@radix-ui/react-popover": "^1.0.7",
echo     "@radix-ui/react-progress": "^1.0.3",
echo     "@radix-ui/react-radio-group": "^1.1.3",
echo     "@radix-ui/react-scroll-area": "^1.0.5",
echo     "@radix-ui/react-select": "^2.0.0",
echo     "@radix-ui/react-separator": "^1.0.3",
echo     "@radix-ui/react-slider": "^1.1.2",
echo     "@radix-ui/react-switch": "^1.0.3",
echo     "@radix-ui/react-tabs": "^1.0.4",
echo     "@radix-ui/react-toast": "^1.1.5",
echo     "@radix-ui/react-tooltip": "^1.0.7"
echo   },
echo   "devDependencies": {
echo     "@types/react": "^18.2.66",
echo     "@types/react-dom": "^18.2.22",
echo     "@vitejs/plugin-react": "^4.2.1",
echo     "vite": "^5.1.6",
echo     "tailwindcss": "^3.4.1",
echo     "postcss": "^8.4.35",
echo     "autoprefixer": "^10.4.18",
echo     "typescript": "^5.4.2"
echo   }
echo }
) > package.json
echo OK - Criado

echo.
echo ===================================
echo  INSTALANDO DEPENDENCIAS...
echo ===================================
call npm install

echo.
echo ===================================
echo  CONCLUIDO! Execute: npm run dev
echo ===================================
pause
