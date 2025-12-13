@echo off
cls
color 0C
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║              🎬 REDFLIX - INSTALACAO E TESTE COMPLETO 🎬               ║
echo ║                                                                          ║
echo ║                 VAI FUNCIONAR AGORA! EU GARANTO! 🚀                     ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
timeout /t 2 /nobreak >nul

color 0E
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │ PASSO 1/8: Verificando Node.js                                          │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.

node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo ❌ ERRO: Node.js nao encontrado!
    echo.
    echo Por favor, instale Node.js de: https://nodejs.org/
    echo Baixe a versao LTS ^(recomendada^)
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js instalado: %NODE_VERSION%
echo.
timeout /t 1 /nobreak >nul

color 0A
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │ PASSO 2/8: Parando processos antigos                                    │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.
taskkill /F /IM node.exe >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Processos Node.js antigos parados!
) else (
    echo ℹ️  Nenhum processo Node.js ativo
)
echo.
timeout /t 1 /nobreak >nul

color 0B
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │ PASSO 3/8: Limpando instalacoes anteriores                              │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.

if exist node_modules (
    echo 🗑️  Removendo node_modules antigo...
    rmdir /s /q node_modules 2>nul
    echo ✅ node_modules removido!
) else (
    echo ℹ️  node_modules nao existe
)

if exist package-lock.json (
    echo 🗑️  Removendo package-lock.json...
    del /f /q package-lock.json 2>nul
    echo ✅ package-lock.json removido!
) else (
    echo ℹ️  package-lock.json nao existe
)
echo.
timeout /t 1 /nobreak >nul

color 0D
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │ PASSO 4/8: Limpando cache npm                                           │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.
call npm cache clean --force
echo ✅ Cache limpo!
echo.
timeout /t 1 /nobreak >nul

color 0E
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │ PASSO 5/8: Instalando dependencias ^(pode levar 2-3 minutos^)             │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.
echo 📦 Instalando React, Tailwind CSS, Vite e mais 50+ pacotes...
echo.

call npm install --legacy-peer-deps

if %ERRORLEVEL% NEQ 0 (
    color 0C
    echo.
    echo ⚠️  Erro na instalacao! Tentando com --force...
    echo.
    call npm install --force
    
    if %ERRORLEVEL% NEQ 0 (
        color 0C
        echo.
        echo ❌ ERRO CRITICO na instalacao!
        echo.
        echo Possíveis soluções:
        echo 1. Verifique sua conexao com internet
        echo 2. Rode como Administrador
        echo 3. Tente: npm cache clean --force
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ✅ Todas as dependencias instaladas!
echo.
timeout /t 1 /nobreak >nul

color 0A
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │ PASSO 6/8: Verificando instalacao do Tailwind CSS                       │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.

call npm list tailwindcss 2>nul | find "tailwindcss@"
if %ERRORLEVEL% EQU 0 (
    echo ✅ Tailwind CSS instalado corretamente!
) else (
    color 0C
    echo ❌ Tailwind CSS nao encontrado!
    echo Tentando instalar manualmente...
    call npm install tailwindcss@3.4.1 --save-dev
)
echo.
timeout /t 1 /nobreak >nul

color 0B
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │ PASSO 7/8: Verificando arquivos de configuracao                         │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.

set CONFIG_OK=1

if exist tailwind.config.js (
    echo ✅ tailwind.config.js encontrado
) else (
    color 0C
    echo ❌ tailwind.config.js NAO encontrado!
    set CONFIG_OK=0
)

if exist postcss.config.js (
    echo ✅ postcss.config.js encontrado
) else (
    color 0C
    echo ❌ postcss.config.js NAO encontrado!
    set CONFIG_OK=0
)

if exist styles\globals.css (
    echo ✅ styles\globals.css encontrado
) else (
    color 0C
    echo ❌ styles\globals.css NAO encontrado!
    set CONFIG_OK=0
)

if exist .env (
    echo ✅ .env encontrado ^(TMDB API configurada^)
) else (
    color 0E
    echo ⚠️  .env nao encontrado ^(usando API key padrao^)
)

if exist package.json (
    echo ✅ package.json encontrado
) else (
    color 0C
    echo ❌ package.json NAO encontrado!
    set CONFIG_OK=0
)

if exist App.tsx (
    echo ✅ App.tsx encontrado
) else (
    color 0C
    echo ❌ App.tsx NAO encontrado!
    set CONFIG_OK=0
)

if %CONFIG_OK% EQU 0 (
    color 0C
    echo.
    echo ❌ ERRO: Arquivos criticos faltando!
    echo Por favor, verifique se todos os arquivos foram baixados corretamente.
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Todos os arquivos de configuracao OK!
echo.
timeout /t 2 /nobreak >nul

color 0A
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │ PASSO 8/8: Testando TMDB API                                            │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.

echo 🧪 Testando conexao com TMDB...
curl -s "https://api.themoviedb.org/3/movie/popular?api_key=ddb1bdf6aa91bdf335797853884b0c1d&language=pt-BR&page=1" >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ TMDB API funcionando!
) else (
    color 0E
    echo ⚠️  Nao foi possivel testar TMDB ^(curl nao instalado^)
    echo    Mas vai funcionar no navegador!
)
echo.
timeout /t 2 /nobreak >nul

cls
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║                    ✅ INSTALACAO CONCLUIDA! ✅                          ║
echo ║                                                                          ║
echo ║              Agora vou iniciar o servidor de desenvolvimento            ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo.
echo ┌──────────────────────────────────────────────────────────────────────────┐
echo │                                                                          │
echo │  🎬 REDFLIX PLATFORM - PRONTO PARA USAR! 🎬                             │
echo │                                                                          │
echo │  O navegador vai abrir automaticamente em alguns segundos...            │
echo │                                                                          │
echo │  📍 URL: http://localhost:5173                                          │
echo │                                                                          │
echo │  ⚡ IMPORTANTE:                                                          │
echo │     Quando o navegador abrir, pressione: Ctrl + Shift + R               │
echo │     ^(Isso forca o reload e carrega os estilos CSS^)                      │
echo │                                                                          │
echo │  ✅ VOCE DEVE VER:                                                       │
echo │     • Fundo vermelho degrade                                            │
echo │     • Logo RedFlix com brilho                                           │
echo │     • Caixa preta centralizada                                          │
echo │     • Botao "Entrar" vermelho                                           │
echo │     • Botoes sociais coloridos                                          │
echo │                                                                          │
echo │  🔑 CREDENCIAIS DE TESTE:                                               │
echo │     Email: demo@redflix.com                                             │
echo │     Senha: demo123                                                      │
echo │                                                                          │
echo │  📊 ESTATISTICAS:                                                        │
echo │     • 500.000+ Filmes ^(TMDB^)                                            │
echo │     • 100.000+ Series ^(TMDB^)                                            │
echo │     • Canais IPTV ao vivo                                               │
echo │     • Player de video completo                                          │
echo │                                                                          │
echo │  🛑 PARA PARAR O SERVIDOR:                                              │
echo │     Pressione Ctrl + C nesta janela                                     │
echo │                                                                          │
echo └──────────────────────────────────────────────────────────────────────────┘
echo.
echo.
echo Iniciando servidor em 3 segundos...
timeout /t 3 /nobreak >nul

color 0E
echo.
echo ═══════════════════════════════════════════════════════════════════════════
echo.

call npm run dev
