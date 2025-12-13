Write-Host "===================================" -ForegroundColor Cyan
Write-Host " CORRIGINDO ERRO NPM INSTALL" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
Write-Host ""

# 1. Limpar cache
Write-Host "[1/6] Limpando cache npm..." -ForegroundColor Yellow
npm cache clean --force
Write-Host "OK" -ForegroundColor Green

# 2. Deletar node_modules
Write-Host "[2/6] Removendo node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") { 
    Remove-Item -Recurse -Force "node_modules"
    Write-Host "OK - Removido" -ForegroundColor Green
} else { 
    Write-Host "OK - Nao existe" -ForegroundColor Green
}

# 3. Deletar package-lock.json
Write-Host "[3/6] Removendo package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") { 
    Remove-Item -Force "package-lock.json"
    Write-Host "OK - Removido" -ForegroundColor Green
} else { 
    Write-Host "OK - Nao existe" -ForegroundColor Green
}

# 4. Deletar yarn.lock
Write-Host "[4/6] Removendo yarn.lock..." -ForegroundColor Yellow
if (Test-Path "yarn.lock") { 
    Remove-Item -Force "yarn.lock"
    Write-Host "OK - Removido" -ForegroundColor Green
} else { 
    Write-Host "OK - Nao existe" -ForegroundColor Green
}

# 5. Deletar .npmrc local
Write-Host "[5/6] Removendo .npmrc local..." -ForegroundColor Yellow
if (Test-Path ".npmrc") { 
    Remove-Item -Force ".npmrc"
    Write-Host "OK - Removido" -ForegroundColor Green
} else { 
    Write-Host "OK - Nao existe" -ForegroundColor Green
}

# 6. Criar package.json limpo
Write-Host "[6/6] Criando package.json limpo..." -ForegroundColor Yellow
@'
{
  "name": "redflix-platform",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "lucide-react": "^0.344.0",
    "sonner": "^1.4.3",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "date-fns": "^3.3.1",
    "hls.js": "^1.5.1",
    "recharts": "^2.10.3",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-popover": "^1.0.7",
    "@radix-ui/react-progress": "^1.0.3",
    "@radix-ui/react-radio-group": "^1.1.3",
    "@radix-ui/react-scroll-area": "^1.0.5",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-separator": "^1.0.3",
    "@radix-ui/react-slider": "^1.1.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "@radix-ui/react-tooltip": "^1.0.7"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.1.6",
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.18",
    "typescript": "^5.4.2"
  }
}
'@ | Out-File -FilePath package.json -Encoding UTF8
Write-Host "OK - Criado" -ForegroundColor Green

Write-Host ""
Write-Host "===================================" -ForegroundColor Cyan
Write-Host " INSTALANDO DEPENDENCIAS..." -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan
npm install

Write-Host ""
Write-Host "===================================" -ForegroundColor Green
Write-Host " CONCLUIDO! Execute: npm run dev" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green
Read-Host "Pressione Enter para sair"
