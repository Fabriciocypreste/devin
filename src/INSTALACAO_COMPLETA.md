# 🚀 INSTALAÇÃO COMPLETA - REDFLIX PLATFORM

## ✅ CORREÇÃO APLICADA

Acabei de corrigir **2 problemas críticos**:

1. ✅ **Tailwind v4**: Atualizei de v3 para v4 no `package.json`
2. ✅ **CSS Import**: Adicionei `@import "tailwindcss";` no `globals.css`

---

## 📋 INSTRUÇÕES DE INSTALAÇÃO (COPIE E COLE)

### **Windows (PowerShell)**

```powershell
# 1. Clone o repositório (se ainda não clonou)
git clone <seu-repositorio>
cd redflix-platform

# 2. Instale as dependências
npm install

# 3. Execute o projeto
npm run dev
```

### **Mac/Linux (Terminal)**

```bash
# 1. Clone o repositório (se ainda não clonou)
git clone <seu-repositorio>
cd redflix-platform

# 2. Instale as dependências
npm install

# 3. Execute o projeto
npm run dev
```

---

## ⚡ INSTALAÇÃO RÁPIDA (1 COMANDO)

```bash
npm install && npm run dev
```

---

## 🎯 O QUE VAI ACONTECER

### **1. Durante `npm install` (2-5 minutos):**
```
Instalando dependências...
✅ React 18.3.1
✅ Tailwind CSS 4.0.0
✅ Vite 5.1.6
✅ Lucide Icons
✅ Radix UI Components
✅ HLS.js (Player)
✅ +30 outras dependências
```

### **2. Durante `npm run dev` (10-30 segundos):**
```
  VITE v5.1.6  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.100:5173/
  ➜  press h + enter to show help
```

### **3. Navegador vai abrir automaticamente:**
```
✅ Fundo vermelho degradê
✅ Logo RedFlix com brilho
✅ Caixa preta de login
✅ Campos brancos arredondados
✅ Botão "Entrar" vermelho #E50914
✅ Botões sociais (Google, Facebook, Apple)
```

---

## 🆘 PROBLEMAS COMUNS

### ❌ **Erro: "Module not found: tailwindcss"**

**Solução:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

### ❌ **Erro: "Port 5173 is already in use"**

**Solução 1 - Matar processo:**
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

**Solução 2 - Usar outra porta:**
```bash
npm run dev -- --port 3000
```

---

### ❌ **Estilos não carregam (página branca)**

**Solução:**
```bash
# 1. Pare o servidor (Ctrl+C)
# 2. Limpe cache
npm cache clean --force

# 3. Reinstale
npm install

# 4. Rode novamente
npm run dev

# 5. No navegador, force reload
# Pressione: Ctrl + Shift + R
```

---

### ❌ **Erro: "Cannot find module 'vite'"**

**Solução:**
```bash
npm install vite@latest --save-dev
npm run dev
```

---

### ❌ **Erro: "Node.js version too old"**

**Requisito:** Node.js >= 18.0.0

**Verificar versão:**
```bash
node --version
```

**Atualizar Node.js:**
- Windows: https://nodejs.org/
- Mac: `brew install node`
- Linux: `sudo apt update && sudo apt install nodejs npm`

---

## 🔧 SCRIPTS DISPONÍVEIS

### **Desenvolvimento (com hot reload):**
```bash
npm run dev
```

### **Build para produção:**
```bash
npm run build
```

### **Preview do build:**
```bash
npm run preview
```

### **Análise de bundle:**
```bash
npm run analyze
```

---

## 📁 ESTRUTURA DO PROJETO

```
redflix-platform/
├── src/
│   ├── components/          # Componentes React
│   │   ├── Login.tsx       # Tela de login
│   │   ├── NetflixHeader.tsx
│   │   ├── MovieCard.tsx
│   │   ├── Player.tsx      # Player HTML5
│   │   └── ...
│   ├── styles/
│   │   └── globals.css     # ✅ CORRIGIDO (com @import)
│   ├── utils/              # Utilitários
│   ├── types/              # TypeScript types
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Entry point
├── public/                 # Arquivos estáticos
├── package.json            # ✅ CORRIGIDO (Tailwind v4)
├── vite.config.ts          # Configuração Vite
└── tsconfig.json           # TypeScript config
```

---

## 🎨 VERIFICAR SE ESTÁ FUNCIONANDO

### **Checklist Visual:**

Abra http://localhost:5173 e verifique:

- [ ] ✅ Fundo vermelho degradê (não branco)
- [ ] ✅ Logo RedFlix centralizada com brilho
- [ ] ✅ Caixa preta centralizada
- [ ] ✅ Campos de input brancos com bordas arredondadas
- [ ] ✅ Botão "Entrar" vermelho brilhante
- [ ] ✅ Botões sociais coloridos (Google colorido, Facebook azul, Apple preto)
- [ ] ✅ Checkbox "Lembre-se de mim"
- [ ] ✅ Link "Precisa de ajuda?"
- [ ] ✅ Link "Novo por aqui? Assine agora"

Se TUDO estiver ✅ → **Funcionando perfeitamente!**

---

### **Checklist Técnico:**

Pressione `F12` (DevTools) e verifique:

1. **Console (não deve ter erros em vermelho):**
   ```
   ✅ Sem erros de CSS
   ✅ Sem erros de "Module not found"
   ✅ Sem erros de Tailwind
   ```

2. **Network (deve carregar CSS):**
   ```
   ✅ globals.css carregado (Status 200)
   ✅ Tailwind classes aplicadas
   ```

3. **Elements (inspecionar botão "Entrar"):**
   ```html
   <button class="bg-[#E50914] hover:bg-red-700 ...">
   ```
   
   **Computed styles deve mostrar:**
   ```css
   background-color: rgb(229, 9, 20);
   border-radius: 0.5rem;
   ```

---

## 🚀 COMANDOS ÚTEIS

### **Limpar cache e reinstalar TUDO:**
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run dev
```

### **Forçar rebuild (Vite):**
```bash
npm run dev -- --force
```

### **Verificar dependências desatualizadas:**
```bash
npm outdated
```

### **Atualizar todas as dependências:**
```bash
npm update
```

---

## 🌐 URLS IMPORTANTES

Depois de rodar `npm run dev`:

- **Local:** http://localhost:5173
- **Network:** http://192.168.x.x:5173 (acessível por outros dispositivos na rede)

---

## 📱 TESTAR EM MOBILE

1. Rode: `npm run dev`
2. Veja o IP da Network (ex: http://192.168.1.100:5173)
3. No celular (mesma rede WiFi), abra esse IP
4. Deve ver a tela de login responsiva

---

## 🔒 VARIÁVEIS DE AMBIENTE

O projeto já tem as secrets configuradas:
```
✅ TMDB_API_KEY
✅ SUPABASE_URL
✅ SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ SUPABASE_DB_URL
```

Você **NÃO** precisa configurar nada!

---

## 🎬 FUNCIONALIDADES DISPONÍVEIS

### **Autenticação:**
- Login com email/senha
- Login social (Google, Facebook, Apple)
- Cadastro de usuários
- Seleção de perfis

### **Conteúdo:**
- Filmes (do TMDB)
- Séries (do TMDB)
- Canais IPTV (do GitHub)
- Kids (conteúdo infantil + jogos)

### **Player:**
- Player HTML5 nativo
- Suporte HLS (m3u8)
- Controles customizados
- Picture-in-Picture

### **Recursos:**
- Busca avançada
- Minha Lista
- Continuar Assistindo
- Histórico
- Favoritos
- Top 10
- Dashboard do Usuário

---

## 🐛 DEBUG AVANÇADO

### **Ver logs do Vite:**
```bash
DEBUG=vite:* npm run dev
```

### **Ver todas as dependências instaladas:**
```bash
npm list
```

### **Verificar se Tailwind está instalado:**
```bash
npm list tailwindcss
```

**Saída esperada:**
```
redflix-platform@1.0.0
└── tailwindcss@4.0.0
```

---

## ✅ TESTES DE FUNCIONAMENTO

### **Teste 1: CSS Tailwind**

Cole no console do navegador:
```javascript
document.querySelector('button')?.classList.contains('bg-[#E50914]')
```

**Resultado esperado:** `true`

---

### **Teste 2: Hot Reload**

1. Abra `/src/components/Login.tsx`
2. Mude o texto "Entrar" para "LOGIN"
3. Salve (Ctrl+S)
4. **Resultado:** Página atualiza automaticamente

---

### **Teste 3: Build de Produção**

```bash
npm run build
```

**Saída esperada:**
```
✓ built in 12.34s
dist/index.html                   1.23 KB
dist/assets/index-abc123.css     45.67 KB
dist/assets/index-def456.js     234.56 KB
```

---

## 🎉 PRONTO PARA USAR!

Depois de seguir os passos acima, você terá:

✅ **RedFlix Platform** totalmente funcional  
✅ **Todos os estilos** carregando perfeitamente  
✅ **Player de vídeo** funcionando  
✅ **Integração TMDB** ativa  
✅ **IPTV** funcionando  
✅ **Responsivo** (desktop + mobile)  

---

## 📞 SUPORTE

Se ainda tiver problemas, me diga:

1. Qual comando você rodou?
2. Qual erro apareceu?
3. Print do console (F12)
4. Versão do Node: `node --version`

---

## 🎬 COMEÇAR AGORA

```bash
# COPIE E COLE TUDO DE UMA VEZ:
npm install && npm run dev
```

**EM 2 MINUTOS SEU SITE ESTARÁ RODANDO! 🚀**

---

## 🔄 ATUALIZAÇÕES APLICADAS

✅ **2025-11-28**: Corrigido Tailwind v3 → v4  
✅ **2025-11-28**: Adicionado `@import "tailwindcss"` no CSS  
✅ **2025-11-28**: Removido `tailwindcss-animate` (incompatível com v4)  

---

**Seu RedFlix está pronto para download e uso! 🎉🍿**
