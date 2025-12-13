Write-Host "========================================" -ForegroundColor Cyan
Write-Host " LIMPANDO CACHE E REINSTALANDO NPM" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/4] Limpando cache do npm..." -ForegroundColor Yellow
npm cache clean --force

Write-Host ""
Write-Host "[2/4] Removendo node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "OK - node_modules removido" -ForegroundColor Green
} else {
    Write-Host "OK - node_modules nao existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "[3/4] Removendo package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item -Force "package-lock.json"
    Write-Host "OK - package-lock.json removido" -ForegroundColor Green
} else {
    Write-Host "OK - package-lock.json nao existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "[4/4] Instalando dependencias..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " CONCLUIDO! Execute: npm run dev" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Read-Host "Pressione Enter para sair"
