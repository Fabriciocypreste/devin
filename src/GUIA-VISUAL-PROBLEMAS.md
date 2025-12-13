# 🔍 GUIA VISUAL DE PROBLEMAS E SOLUÇÕES

## 🎯 **COMO IDENTIFICAR O PROBLEMA:**

---

## ❌ **PROBLEMA 1: FUNDO BRANCO (SEM ESTILOS CSS)**

### **Você vê:**
```
┌────────────────────────────────────┐
│                                    │
│  BRANCO                            │
│                                    │
│  • RedFlix (texto preto simples)  │
│  • Email [caixa cinza]            │
│  • Senha [caixa cinza]            │
│  • [Entrar] (botão cinza)         │
│  • Continuar com Google            │
│  • Continuar com Facebook          │
│  • Continuar com Apple             │
│                                    │
└────────────────────────────────────┘
```

### **Problema:**
❌ Tailwind CSS não está carregando

### **Solução:**
```bash
# 1. Verificar arquivos
dir tailwind.config.js
dir postcss.config.js
dir styles\globals.css

# 2. Reinstalar
npm install --force

# 3. Hard reload no navegador
Ctrl + Shift + R

# 4. Limpar cache
Ctrl + Shift + Delete → Limpar dados
```

### **Como saber se resolveu:**
✅ Fundo vermelho degradê aparece
✅ Caixa preta centralizada
✅ Botão vermelho brilhante

---

## ❌ **PROBLEMA 2: ERRO "VITE" NO TERMINAL**

### **Você vê:**
```
Error: Cannot find module 'vite'
```

### **Problema:**
❌ Dependências não instaladas

### **Solução:**
```bash
npm install --legacy-peer-deps
```

---

## ❌ **PROBLEMA 3: ERRO "TAILWINDCSS" NO TERMINAL**

### **Você vê:**
```
Error: Cannot find module 'tailwindcss'
```

### **Problema:**
❌ Tailwind não instalado

### **Solução:**
```bash
npm install tailwindcss@3.4.1 postcss autoprefixer --save-dev
npm run dev
```

---

## ❌ **PROBLEMA 4: PORTA EM USO**

### **Você vê:**
```
Error: Port 5173 is already in use
```

### **Problema:**
❌ Servidor já está rodando

### **Solução:**
```bash
# Windows
taskkill /F /IM node.exe
npm run dev

# Mac/Linux
killall node
npm run dev
```

---

## ❌ **PROBLEMA 5: PÁGINA EM BRANCO (NADA APARECE)**

### **Você vê:**
```
┌────────────────────────────────────┐
│                                    │
│                                    │
│                                    │
│         (TOTALMENTE VAZIO)         │
│                                    │
│                                    │
│                                    │
└────────────────────────────────────┘
```

### **Problema:**
❌ Erro no JavaScript

### **Solução:**
```bash
# 1. Abrir DevTools
F12 → Console

# 2. Ver erro vermelho

# 3. Se for "Cannot find App.tsx":
dir App.tsx

# 4. Se for erro de import:
npm install --force
```

---

## ❌ **PROBLEMA 6: IMAGENS NÃO CARREGAM (TMDB)**

### **Você vê:**
```
┌────────────────────────────────────┐
│  🔴 RedFlix                        │
│                                    │
│  [❌] [❌] [❌] [❌]               │
│  (Quadrados vazios no lugar        │
│   dos posters de filmes)           │
│                                    │
└────────────────────────────────────┘
```

### **Problema:**
❌ TMDB API não configurada ou com erro

### **Solução:**
```bash
# 1. Verificar .env
type .env
# Deve ter: VITE_TMDB_API_KEY=ddb1bdf6aa91bdf335797853884b0c1d

# 2. Testar API no navegador:
# Cole isso na barra de endereço:
https://api.themoviedb.org/3/movie/popular?api_key=ddb1bdf6aa91bdf335797853884b0c1d

# 3. Se retornar JSON, API está OK
# Se retornar erro, gere nova key em: themoviedb.org

# 4. Reiniciar servidor
Ctrl + C
npm run dev
```

---

## ❌ **PROBLEMA 7: "NPM NÃO É RECONHECIDO"**

### **Você vê:**
```
'npm' não é reconhecido como um comando interno
ou externo, um programa operável ou um arquivo em lotes.
```

### **Problema:**
❌ Node.js não instalado

### **Solução:**
```
1. Baixar Node.js: https://nodejs.org/
2. Instalar versão LTS (recomendada)
3. Fechar e abrir o terminal
4. Testar: node --version
```

---

## ❌ **PROBLEMA 8: ERRO DE PERMISSÃO (EACCES)**

### **Você vê:**
```
Error: EACCES: permission denied
```

### **Problema:**
❌ Sem permissão de administrador

### **Solução:**
```bash
# Windows:
# 1. Feche o terminal
# 2. Botão direito no PowerShell
# 3. "Executar como Administrador"
# 4. Rode novamente: npm install

# Mac/Linux:
sudo npm install --legacy-peer-deps
```

---

## ❌ **PROBLEMA 9: ERRO 404 AO NAVEGAR**

### **Você vê:**
```
Cannot GET /filmes
404 - Not Found
```

### **Problema:**
❌ React Router não configurado corretamente

### **Solução:**
```bash
# 1. Verificar se react-router-dom está instalado
npm list react-router-dom

# 2. Se não estiver, instalar
npm install react-router-dom

# 3. Reiniciar
npm run dev
```

---

## ❌ **PROBLEMA 10: BUILD FALHA**

### **Você vê:**
```
npm run build
...
Error: Build failed
```

### **Problema:**
❌ Erro no código ou dependências

### **Solução:**
```bash
# 1. Limpar tudo
rm -rf node_modules dist
npm cache clean --force

# 2. Reinstalar
npm install --legacy-peer-deps

# 3. Tentar build novamente
npm run build

# 4. Se der erro de memória:
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

---

## ✅ **ESTADO CORRETO (FUNCIONANDO):**

### **Você deve ver:**

```
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║        🌆 FUNDO: Degradê vermelho escuro → preto          ║
║                                                            ║
║           ┌─────────────────────────────────┐              ║
║           │                                 │              ║
║           │  ⚫ CAIXA: Preta semi-transp.  │              ║
║           │                                 │              ║
║           │    🔴 REDFLIX                  │              ║
║           │    (Logo vermelho brilhante)   │              ║
║           │                                 │              ║
║           │    📧 [Email]                  │              ║
║           │    (Input com borda sutil)     │              ║
║           │                                 │              ║
║           │    🔒 [Senha]                  │              ║
║           │    (Input com borda sutil)     │              ║
║           │                                 │              ║
║           │    🔴 [ENTRAR]                 │              ║
║           │    (Botão vermelho #E50914)    │              ║
║           │                                 │              ║
║           │    ─────── ou ───────          │              ║
║           │                                 │              ║
║           │    🔵 Continuar com Google     │              ║
║           │    🔘 Continuar com Facebook   │              ║
║           │    ⚫ Continuar com Apple      │              ║
║           │                                 │              ║
║           │    Não tem conta? Cadastre-se  │              ║
║           │                                 │              ║
║           └─────────────────────────────────┘              ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🔍 **CHECKLIST DE VERIFICAÇÃO:**

### **No Terminal:**
```
✅ VITE v5.1.6  ready in 1234 ms
✅ ➜  Local:   http://localhost:5173/
✅ Sem erros vermelhos
```

### **No Navegador (Visualmente):**
```
✅ Fundo vermelho degradê (não branco!)
✅ Logo RedFlix com brilho vermelho
✅ Caixa preta semi-transparente
✅ Inputs com bordas sutis
✅ Botão "Entrar" vermelho brilhante
✅ Botões sociais coloridos (azul, rosa, preto)
✅ Texto branco legível
```

### **No DevTools (F12 → Console):**
```
✅ Sem erros vermelhos
✅ Pode ter logs azuis/cinza (normal)
✅ Pode ter warnings amarelos (ignorar)
```

### **No DevTools (F12 → Network):**
```
✅ globals.css - Status: 200 (verde)
✅ App.tsx - Status: 200 (verde)
✅ main.tsx - Status: 200 (verde)
✅ tmdb api - Status: 200 (verde)
```

### **No DevTools (F12 → Elements):**
```
✅ <body class="bg-[#141414]"> (fundo escuro)
✅ Classes Tailwind aparecendo (bg-red-600, etc)
✅ Estilos CSS aplicados
```

---

## 📊 **COMPARAÇÃO VISUAL:**

| Aspecto | ❌ Errado | ✅ Correto |
|---------|-----------|-----------|
| **Fundo** | Branco | Vermelho degradê |
| **Logo** | Preto simples | Vermelho brilhante |
| **Caixa** | Sem estilo | Preta semi-transp. |
| **Inputs** | Cinza feio | Bordas sutis |
| **Botão** | Cinza | Vermelho #E50914 |
| **Textos** | Preto | Branco |
| **Sociais** | Cinza | Coloridos |

---

## 🎯 **TESTE FINAL:**

### **1. Abrir site:**
```
http://localhost:5173
```

### **2. Verificar cores:**
```
Fundo: Vermelho → Preto (degradê)
Logo: #E50914 (vermelho)
Botão: #E50914 (vermelho)
Caixa: rgba(0,0,0,0.8) (preta transp.)
```

### **3. Testar login:**
```
Email: demo@redflix.com
Senha: demo123
```

### **4. Verificar navegação:**
```
✅ Página Home abre
✅ Filmes aparecem
✅ Séries aparecem
✅ Busca funciona
```

---

## 💡 **DICAS RÁPIDAS:**

### **Se estiver com pressa:**
```bash
# Use o script automático:
INSTALAR-E-TESTAR.bat

# Espere 2 minutos

# Hard reload no navegador:
Ctrl + Shift + R
```

### **Se der qualquer erro:**
```bash
# Solução universal:
taskkill /F /IM node.exe
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --legacy-peer-deps --force
npm run dev
```

### **Se ainda não funcionar:**
```
ME ENVIE:
1. Print do terminal
2. Print do navegador (F12 → Console)
3. Print visual da tela
4. node --version
5. npm --version
```

---

## ✅ **RESUMO:**

**Problema mais comum:** Fundo branco (CSS não carrega)  
**Solução:** `npm install --force` + `Ctrl + Shift + R`

**Se nada funcionar:** Rode `INSTALAR-E-TESTAR.bat`

**Garantia:** Se seguir os passos, VAI FUNCIONAR! 🚀
