# 🚀 COMO RODAR O PROJETO REDFLIX

## ⚡ INÍCIO RÁPIDO

### **Opção 1: Script Automático (RECOMENDADO)**

#### Windows (Prompt de Comando):
```bash
limpar-e-instalar.bat
```

#### Windows (PowerShell):
```powershell
.\limpar-e-instalar.ps1
```

Se der erro de política no PowerShell, execute antes:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### **Opção 2: Comandos Manuais**

```bash
# 1. Limpar cache
npm cache clean --force

# 2. Remover node_modules (Windows PowerShell)
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 3. Instalar dependências
npm install

# 4. Rodar projeto
npm run dev
```

---

## 📋 COMANDOS DISPONÍVEIS

```bash
# Modo desenvolvimento (Hot Reload ativo)
npm run dev

# Build de produção
npm run build

# Preview do build
npm run preview

# Análise do bundle
npm run analyze
```

---

## 🌐 ACESSAR O PROJETO

Após rodar `npm run dev`, abra no navegador:

**URL:** `http://localhost:5173`

---

## ✅ VERIFICAÇÕES ANTES DE RODAR

### **1. Versão do Node.js**
```bash
node --version
```
**Versão mínima:** 18.x ou superior

### **2. Versão do npm**
```bash
npm --version
```
**Versão mínima:** 9.x ou superior

### **3. Atualizar Node.js (se necessário)**

**Opção A:** Baixar do site oficial
- https://nodejs.org/en/download/ (versão LTS)

**Opção B:** Usar nvm (Node Version Manager)
```bash
# Instalar nvm: https://github.com/coreybutler/nvm-windows
nvm install 20.11.0
nvm use 20.11.0
```

---

## 🔧 SOLUÇÃO DE PROBLEMAS

### **1. Erro: `EINVALIDTAGNAME`**

**Solução:**
```bash
npm cache clean --force
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

---

### **2. Erro: Porta 5173 em uso**

**Verificar processos:**
```bash
netstat -ano | findstr :5173
```

**Matar processo:**
```bash
taskkill /PID <PID> /F
```

**OU** edite `vite.config.ts` e mude a porta:
```typescript
export default defineConfig({
  server: {
    port: 3000  // Altere para outra porta
  }
})
```

---

### **3. Erro: Módulo não encontrado**

**Solução:**
```bash
npm cache clean --force
npm install
```

---

### **4. Erro de permissão (PowerShell)**

**Execute como Administrador:**
1. Clique direito no PowerShell
2. "Executar como Administrador"

**OU configure a política:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

### **5. Erro de SSL/Certificado**

```bash
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

---

## 📁 TESTAR SEM NPM (Arquivos HTML)

Se você quer apenas testar as páginas HTML estáticas:

### **Opção 1: Abrir direto no navegador**
- Clique 2x em `index.html`
- Clique 2x em `series.html`
- Clique 2x em `canais.html`
- Clique 2x em `kids.html`

### **Opção 2: Live Server (VS Code)**
1. Instale a extensão "Live Server"
2. Clique direito em `index.html`
3. "Open with Live Server"

### **Opção 3: Python HTTP Server**
```bash
python -m http.server 8000
```
Depois abra: `http://localhost:8000/index.html`

---

## 🎯 PÁGINAS DISPONÍVEIS

Após rodar o projeto, você terá acesso a:

### **Páginas Principais:**
- **`/`** - Página inicial (Home)
- **`/login`** - Login
- **`/signup`** - Cadastro
- **`/filmes`** - Filmes
- **`/series`** - Séries
- **`/canais`** - Canais IPTV
- **`/futebol`** - Futebol ao vivo
- **`/kids`** - Página Kids com jogos

### **Páginas de Usuário:**
- **`/profile`** - Seleção de perfil
- **`/dashboard`** - Dashboard do usuário
- **`/favoritos`** - Favoritos
- **`/historico`** - Histórico
- **`/minha-lista`** - Minha Lista

### **Páginas Admin:**
- **`/admin`** - Painel administrativo

### **Páginas de Teste:**
- **`/?db-status=true`** - Status do banco de dados
- **`/?iptv-test=true`** - Teste IPTV

---

## 🔐 CONFIGURAR VARIÁVEIS DE AMBIENTE

O projeto usa Supabase. As seguintes variáveis já estão configuradas:

✅ `TMDB_API_KEY` - API do The Movie Database  
✅ `SUPABASE_URL` - URL do Supabase  
✅ `SUPABASE_ANON_KEY` - Chave pública do Supabase  
✅ `SUPABASE_SERVICE_ROLE_KEY` - Chave privada do Supabase  
✅ `SUPABASE_DB_URL` - URL do banco de dados  

**Não é necessário configurar nada manualmente!**

---

## 📊 ESTRUTURA DO PROJETO

```
📁 redflix-platform/
├── 📁 components/          # Componentes React
├── 📁 contexts/            # Contextos (AuthContext, etc)
├── 📁 hooks/               # Hooks customizados
├── 📁 utils/               # Utilitários e helpers
├── 📁 supabase/           # Configuração Supabase
├── 📁 styles/             # Estilos globais
├── 📁 public/             # Arquivos públicos
├── 📄 App.tsx             # Componente principal
├── 📄 main.tsx            # Entry point
├── 📄 types.ts            # Definições de tipos
├── 📄 package.json        # Dependências
├── 📄 vite.config.ts      # Configuração Vite
└── 📄 README.md           # Documentação
```

---

## 🎨 TECNOLOGIAS USADAS

- **React 18** - Framework frontend
- **TypeScript** - Linguagem tipada
- **Vite** - Build tool ultra-rápido
- **Tailwind CSS** - Framework CSS
- **Supabase** - Backend (banco de dados + auth)
- **TMDB API** - API de filmes e séries
- **HLS.js** - Player de vídeo

---

## 📦 DEPENDÊNCIAS PRINCIPAIS

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.22.0",
  "lucide-react": "^0.344.0",
  "tailwindcss": "^3.4.1",
  "hls.js": "^1.5.1",
  "recharts": "^2.10.3"
}
```

---

## ✅ CHECKLIST DE INSTALAÇÃO

- [ ] Node.js >= 18 instalado
- [ ] npm >= 9 instalado
- [ ] Cache limpo: `npm cache clean --force`
- [ ] node_modules removido
- [ ] package-lock.json removido
- [ ] `npm install` executado com sucesso
- [ ] `npm run dev` rodando
- [ ] Navegador abrindo em `http://localhost:5173`
- [ ] Sem erros no console

---

## 🆘 SUPORTE

### **Se nada funcionar:**

1. **Reinstalar Node.js completamente**
   - Desinstalar Node.js (Painel de Controle)
   - Deletar pastas:
     - `C:\Program Files\nodejs`
     - `C:\Users\SEU_USUARIO\AppData\Roaming\npm`
   - Baixar nova versão: https://nodejs.org/
   - Reiniciar computador

2. **Usar Yarn ao invés de npm**
   ```bash
   npm install -g yarn
   yarn install
   yarn dev
   ```

3. **Usar Docker**
   ```bash
   docker run -it --rm -v ${PWD}:/app -w /app -p 5173:5173 node:20 bash
   npm install
   npm run dev
   ```

---

## 🎉 PRONTO!

Agora você está pronto para rodar o RedFlix!

Execute:
```bash
npm run dev
```

E acesse: **`http://localhost:5173`**

**Aproveite! 🍿🎬**
