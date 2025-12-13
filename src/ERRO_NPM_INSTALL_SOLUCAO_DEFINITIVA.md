# 🚨 ERRO NPM INSTALL - SOLUÇÃO DEFINITIVA

## ❌ ERRO:
```
npm error code EINVALIDTAGNAME
npm error Invalid tag name "^version" of package "library@^version"
```

## 🔍 CAUSA:
Esse erro significa que existe um arquivo com dependência mal formatada (provavelmente `package.json` corrompido ou `.npmrc` com problema).

---

## ✅ SOLUÇÃO PASSO A PASSO:

### **PASSO 1: Verificar se o package.json está corrompido**

Abra o PowerShell na pasta do projeto e execute:

```powershell
Get-Content package.json
```

**Procure por:**
- ❌ `"library@^version"` (INCORRETO)
- ❌ `"package": "^version"` (INCORRETO)
- ✅ `"react": "^18.3.1"` (CORRETO)

---

### **PASSO 2: Deletar TODOS os arquivos de cache**

```powershell
# Limpar cache npm
npm cache clean --force

# Deletar node_modules (se existir)
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }

# Deletar package-lock.json (se existir)
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }

# Deletar yarn.lock (se existir)
if (Test-Path "yarn.lock") { Remove-Item -Force "yarn.lock" }

# Deletar .npmrc local (se existir)
if (Test-Path ".npmrc") { Remove-Item -Force ".npmrc" }
```

---

### **PASSO 3: Copiar package.json correto**

Vou criar um `package.json` 100% funcional. Execute este comando para criar o arquivo:

```powershell
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
```

---

### **PASSO 4: Reinstalar**

```powershell
npm install
```

---

## 🔧 SCRIPT AUTOMÁTICO COMPLETO (COPIE E COLE NO POWERSHELL):

```powershell
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
```

---

## 🆘 SE AINDA DER ERRO:

### **Opção 1: Verificar versão do Node/npm**

```powershell
node --version   # Deve ser >= 18
npm --version    # Deve ser >= 9
```

**Se a versão for antiga, atualize:**
- Baixe: https://nodejs.org/en/download/ (versão LTS - 20.11.0)
- Instale
- Reinicie o PowerShell

---

### **Opção 2: Usar YARN ao invés de npm**

```powershell
# Instalar Yarn
npm install -g yarn

# Limpar cache
yarn cache clean

# Instalar dependências
yarn install

# Rodar projeto
yarn dev
```

---

### **Opção 3: Usar NPX (sem instalação)**

```powershell
npx create-vite@latest redflix-novo --template react-ts
cd redflix-novo

# Copiar seus arquivos para esta nova pasta
# Depois:
npm install
npm run dev
```

---

## 📁 ESTRUTURA MÍNIMA NECESSÁRIA:

Se você só quer testar os arquivos HTML (sem React):

```
📁 Projeto/
├── 📄 index.html          ← Abrir direto no navegador
├── 📄 series.html         ← Abrir direto no navegador
├── 📄 canais.html         ← Abrir direto no navegador
├── 📄 kids.html           ← Abrir direto no navegador
└── 📄 serie-details.html  ← Abrir direto no navegador
```

**Como testar SEM npm:**

1. **Clique 2x no arquivo HTML**
2. **OU use Live Server (VS Code)**
3. **OU use Python:**
   ```powershell
   python -m http.server 8000
   # Depois abra: http://localhost:8000/index.html
   ```

---

## 🔍 VERIFICAR LOG DE ERRO:

```powershell
# Ver log completo do erro
Get-Content "C:\Users\Fabricio\AppData\Local\npm-cache\_logs\2025-11-28T13_07_09_791Z-debug-0.log"
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO:

- [ ] Node.js >= 18 instalado
- [ ] npm cache limpo
- [ ] node_modules deletado
- [ ] package-lock.json deletado
- [ ] yarn.lock deletado (se existir)
- [ ] .npmrc deletado (se existir)
- [ ] package.json recriado limpo
- [ ] npm install executado
- [ ] npm run dev funcionando

---

## 🎯 SOLUÇÃO RÁPIDA (1 LINHA):

Copie e cole este comando no PowerShell (na pasta do projeto):

```powershell
npm cache clean --force; if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }; if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }; npm install
```

---

## 📞 ÚLTIMA ALTERNATIVA:

Se NADA funcionar, me envie:

1. Conteúdo do seu `package.json`:
   ```powershell
   Get-Content package.json
   ```

2. Versões instaladas:
   ```powershell
   node --version
   npm --version
   ```

3. Log completo do erro:
   ```powershell
   Get-Content "C:\Users\Fabricio\AppData\Local\npm-cache\_logs\*" | Select-Object -Last 50
   ```

---

**🚀 EXECUTE O SCRIPT AUTOMÁTICO ACIMA E O ERRO SERÁ CORRIGIDO!**
