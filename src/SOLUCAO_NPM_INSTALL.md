# 🔧 SOLUÇÃO: Erro npm install - EINVALIDTAGNAME

## ❌ ERRO ENCONTRADO:
```
npm error code EINVALIDTAGNAME
npm error Invalid tag name "^version" of package "library@^version"
```

## ✅ SOLUÇÃO COMPLETA:

### **PASSO 1: Limpar Cache do NPM**

```bash
# Windows PowerShell
npm cache clean --force
```

### **PASSO 2: Deletar node_modules e package-lock.json**

```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### **PASSO 3: Reinstalar Dependências**

```bash
# Instalar com npm
npm install

# OU usar yarn (recomendado)
yarn install
```

### **PASSO 4: Rodar o Projeto**

```bash
# Modo desenvolvimento
npm run dev

# OU com yarn
yarn dev
```

---

## 📋 SCRIPT AUTOMÁTICO (WINDOWS)

Crie um arquivo chamado `limpar-e-instalar.bat` na raiz do projeto:

```batch
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
```

**Execute o arquivo:**
```bash
.\limpar-e-instalar.bat
```

---

## 📋 SCRIPT AUTOMÁTICO (POWERSHELL)

Crie um arquivo chamado `limpar-e-instalar.ps1`:

```powershell
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
```

**Execute o arquivo:**
```powershell
powershell -ExecutionPolicy Bypass -File .\limpar-e-instalar.ps1
```

---

## 🔍 VERIFICAR VERSÃO DO NODE/NPM

```bash
# Verificar versão do Node.js (deve ser >= 18)
node --version

# Verificar versão do npm (deve ser >= 9)
npm --version
```

### **SE PRECISAR ATUALIZAR:**

**Opção 1: Baixar do site oficial**
- https://nodejs.org/en/download/

**Opção 2: Usar nvm (Node Version Manager)**
```bash
# Instalar nvm: https://github.com/coreybutler/nvm-windows
nvm install 20.11.0
nvm use 20.11.0
```

---

## 🚀 ALTERNATIVA: USAR YARN

Se o erro persistir, use Yarn ao invés do npm:

```bash
# Instalar Yarn globalmente
npm install -g yarn

# Limpar cache
yarn cache clean

# Instalar dependências
yarn install

# Rodar projeto
yarn dev
```

---

## 📦 ESTRUTURA CORRETA DO PACKAGE.JSON

Seu `package.json` está CORRETO! Não há erros nele:

```json
{
  "name": "redflix-platform",
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.22.0",
    "lucide-react": "^0.344.0",
    // ... todas as dependências estão corretas
  }
}
```

---

## 🎯 COMANDOS DISPONÍVEIS APÓS INSTALAÇÃO:

```bash
# Modo desenvolvimento (localhost:5173)
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Análise do bundle
npm run analyze
```

---

## 🌐 PÁGINAS HTML PURAS (SEM NPM)

Se você quer apenas testar as páginas HTML sem instalar nada:

1. **index.html** - Página inicial
2. **series.html** - Página de séries
3. **canais.html** - Página de canais IPTV
4. **serie-details.html** - Detalhes de série
5. **kids.html** - Página Kids

**Como abrir:**
- Clique duas vezes no arquivo `.html`
- OU use Live Server no VS Code
- OU use Python: `python -m http.server 8000`

---

## ⚠️ PROBLEMAS COMUNS:

### **1. Erro de Permissão:**
```bash
# Executar como Administrador
# PowerShell: Botão direito > Executar como Administrador
```

### **2. Erro de Política de Execução (PowerShell):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### **3. Porta 5173 em uso:**
```bash
# Matar processo na porta 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### **4. Erro de SSL/Certificado:**
```bash
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

---

## ✅ CHECKLIST FINAL:

- [ ] Node.js >= 18 instalado
- [ ] npm >= 9 instalado
- [ ] Cache limpo: `npm cache clean --force`
- [ ] node_modules removido
- [ ] package-lock.json removido
- [ ] `npm install` executado com sucesso
- [ ] `npm run dev` funcionando
- [ ] Navegador abrindo em `http://localhost:5173`

---

## 🆘 SE NADA FUNCIONAR:

### **Opção 1: Reinstalar Node.js completamente**
1. Desinstalar Node.js (Painel de Controle)
2. Deletar pasta: `C:\Program Files\nodejs`
3. Deletar pasta: `C:\Users\SEU_USUARIO\AppData\Roaming\npm`
4. Baixar nova versão: https://nodejs.org/en/download/
5. Instalar e reiniciar computador

### **Opção 2: Usar Docker**
```bash
docker run -it --rm -v ${PWD}:/app -w /app -p 5173:5173 node:20 bash
cd /app
npm install
npm run dev
```

### **Opção 3: Usar CodeSandbox/StackBlitz (Online)**
- Upload do projeto para CodeSandbox.io
- OU StackBlitz.com
- Roda direto no navegador sem instalar nada

---

## 📞 SUPORTE ADICIONAL:

Se o erro persistir, forneça:
1. Versão do Node: `node --version`
2. Versão do npm: `npm --version`
3. Sistema operacional: Windows 10/11
4. Log completo do erro
5. Conteúdo do arquivo: `C:\Users\Fabricio\AppData\Local\npm-cache\_logs\2025-11-28T12_54_55_989Z-debug-0.log`

---

**✅ SOLUÇÃO RECOMENDADA: Execute os comandos na ordem:**

```bash
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm run dev
```

**🚀 Depois disso, o projeto deve funcionar perfeitamente!**
