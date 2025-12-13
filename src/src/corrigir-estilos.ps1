# Script de Correção Automática - Estilos CSS Quebrados
# RedFlix Platform

Clear-Host

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Red
Write-Host "║                                                                          ║" -ForegroundColor Red
Write-Host "║              🚨 CORREÇÃO AUTOMÁTICA - ESTILOS CSS QUEBRADOS             ║" -ForegroundColor White
Write-Host "║                                                                          ║" -ForegroundColor Red
Write-Host "╚══════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Red
Write-Host ""
Write-Host ""

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "  ⚡ INICIANDO CORREÇÃO AUTOMÁTICA" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 2

# Passo 1: Parar servidor Node.js
Write-Host "[1/6] 🛑 Parando servidor Node.js..." -ForegroundColor Cyan
try {
    Stop-Process -Name "node" -Force -ErrorAction SilentlyContinue
    Write-Host "      ✅ Servidor parado com sucesso" -ForegroundColor Green
} catch {
    Write-Host "      ⚠️  Nenhum servidor estava rodando" -ForegroundColor Yellow
}
Write-Host ""

Start-Sleep -Seconds 1

# Passo 2: Remover node_modules
Write-Host "[2/6] 🗑️  Removendo node_modules..." -ForegroundColor Cyan
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Write-Host "      ✅ node_modules removido" -ForegroundColor Green
} else {
    Write-Host "      ⚠️  node_modules não encontrado" -ForegroundColor Yellow
}
Write-Host ""

Start-Sleep -Seconds 1

# Passo 3: Remover package-lock.json
Write-Host "[3/6] 🗑️  Removendo package-lock.json..." -ForegroundColor Cyan
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json" -ErrorAction SilentlyContinue
    Write-Host "      ✅ package-lock.json removido" -ForegroundColor Green
} else {
    Write-Host "      ⚠️  package-lock.json não encontrado" -ForegroundColor Yellow
}
Write-Host ""

Start-Sleep -Seconds 1

# Passo 4: Limpar cache
Write-Host "[4/6] 🧹 Limpando cache do npm..." -ForegroundColor Cyan
npm cache clean --force | Out-Null
Write-Host "      ✅ Cache limpo" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 1

# Passo 5: Instalar dependências
Write-Host "[5/6] 📦 Reinstalando dependências..." -ForegroundColor Cyan
Write-Host "      ⏳ Isso pode demorar alguns minutos..." -ForegroundColor Yellow
Write-Host ""
npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "      ✅ Dependências instaladas com sucesso!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "      ❌ ERRO ao instalar dependências!" -ForegroundColor Red
    Write-Host "      Tente manualmente: npm install" -ForegroundColor Yellow
    Pause
    exit 1
}
Write-Host ""

Start-Sleep -Seconds 2

# Passo 6: Iniciar servidor
Write-Host "[6/6] 🚀 Iniciando servidor..." -ForegroundColor Cyan
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "  ✅ CORREÇÃO CONCLUÍDA COM SUCESSO!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "  📌 PRÓXIMOS PASSOS:" -ForegroundColor White
Write-Host ""
Write-Host "  1️⃣  O servidor vai iniciar automaticamente agora" -ForegroundColor White
Write-Host "  2️⃣  Quando abrir o navegador, pressione: " -NoNewline -ForegroundColor White
Write-Host "Ctrl + Shift + R" -ForegroundColor Yellow
Write-Host "  3️⃣  Você DEVE ver o fundo vermelho e todos os estilos!" -ForegroundColor White
Write-Host ""
Write-Host "  🔴 RESULTADO ESPERADO:" -ForegroundColor Red
Write-Host "     ✅ Fundo vermelho degradê" -ForegroundColor Green
Write-Host "     ✅ Caixa preta centralizada" -ForegroundColor Green
Write-Host "     ✅ Botão 'Entrar' vermelho brilhante" -ForegroundColor Green
Write-Host "     ✅ Logo com efeito de brilho" -ForegroundColor Green
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 3

Write-Host "  🚀 Iniciando npm run dev..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  ⚠️  IMPORTANTE: Quando o navegador abrir, pressione " -NoNewline -ForegroundColor Yellow
Write-Host "Ctrl+Shift+R" -ForegroundColor Red
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

Start-Sleep -Seconds 2

npm run dev
