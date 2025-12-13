# 🎯 GUIA RÁPIDO - COMO USAR OS BOTÕES DO CARD

## 📺 PASSO A PASSO

### **1. ATIVAR O CARD HOVER**
```
┌──────────────────┐
│                  │
│   [CARD NORMAL]  │  ← Passe o mouse aqui
│                  │
└──────────────────┘

        ↓ HOVER ↓

┌─────────────────────────────────┐
│                                 │
│     [CARD EXPANDIDO - 30%]      │
│                                 │
│  Logo ou Título                 │
│                                 │
│  [▶ Assistir] [+] [👍] [🕒] [⬇️] │
│                                 │
│  98% Match  [16]  2024  [HD]    │
│  Ação • Aventura • Ficção       │
│  Sinopse do filme...            │
└─────────────────────────────────┘
```

---

### **2. BOTÃO ASSISTIR** ▶️

**Localização:** Primeiro botão (branco)

**O que faz:**
- Abre página de detalhes completa
- Mostra trailer e informações
- Acesso ao player de vídeo

**Como usar:**
```
1. Passe o mouse no card
2. Clique no botão branco "▶ Assistir"
3. Página de detalhes abre
4. Assista ao trailer ou episódios
```

**Exemplo de uso:**
```
Usuário → Hover → Clica "Assistir" → MovieDetails abre
```

---

### **3. BOTÃO ADICIONAR À LISTA** ➕

**Localização:** Segundo botão (círculo)

**O que faz:**
- Adiciona filme/série à "Minha Lista"
- Salva no localStorage
- Sincroniza automaticamente

**Estados:**
- **NÃO adicionado:** Círculo cinza com + branco
- **ADICIONADO:** Círculo branco com ✓ preto

**Como usar:**
```
1. Passe o mouse no card
2. Clique no círculo com +
3. Ícone muda para ✓
4. Toast confirma: "Adicionado à Minha Lista"
5. Item aparece em "Minha Lista" (menu lateral)
```

**Exemplo visual:**
```
ANTES: [⊕ cinza]  →  DEPOIS: [✓ branco]
```

**Onde ver:**
```
Menu Lateral → Minha Lista → Item aparece aqui
```

---

### **4. BOTÃO CURTIR** 👍

**Localização:** Terceiro botão (círculo)

**O que faz:**
- Adiciona aos "Favoritos"
- Salva no localStorage
- Botão fica vermelho

**Estados:**
- **NÃO curtido:** Círculo cinza
- **CURTIDO:** Círculo vermelho (#E50914)

**Como usar:**
```
1. Passe o mouse no card
2. Clique no círculo com 👍
3. Botão fica vermelho
4. Toast confirma: "Você curtiu {título} 👍"
5. Item aparece em "Favoritos"
```

**Exemplo visual:**
```
ANTES: [👍 cinza]  →  DEPOIS: [👍 VERMELHO]
```

**Onde ver:**
```
Menu Lateral → Favoritos → Item aparece aqui
```

---

### **5. BOTÃO ASSISTIR MAIS TARDE** 🕒

**Localização:** Quarto botão (círculo)

**O que faz:**
- Adiciona a "Assistir Depois"
- Salva no localStorage
- Botão fica azul

**Estados:**
- **NÃO adicionado:** Círculo cinza
- **ADICIONADO:** Círculo azul

**Como usar:**
```
1. Passe o mouse no card
2. Clique no círculo com 🕒
3. Botão fica azul
4. Toast confirma: "{título} adicionado a Assistir Depois 🕒"
5. Item aparece em "Assistir Depois"
```

**Exemplo visual:**
```
ANTES: [🕒 cinza]  →  DEPOIS: [🕒 AZUL]
```

**Onde ver:**
```
Menu Lateral → Assistir Depois → Item aparece aqui
```

---

### **6. BOTÃO DETALHES** ⬇️

**Localização:** Último botão (direita)

**O que faz:**
- Abre detalhes completos
- Mostra sinopse, elenco, trailer
- Informações do TMDB

**Como usar:**
```
1. Passe o mouse no card
2. Clique no círculo com ⬇️
3. Modal de detalhes abre
4. Veja todas as informações
```

**Exemplo de uso:**
```
Usuário → Hover → Clica ⬇️ → MovieDetails modal
```

---

## 🎨 GUIA VISUAL COMPLETO

### **Card em Estado Normal:**
```
┌──────────────────┐
│                  │
│                  │
│   IMAGEM DO      │
│   FILME/SÉRIE    │
│                  │
│                  │
└──────────────────┘
```

### **Card ao Passar o Mouse (HOVER):**
```
┌───────────────────────────────────────┐
│                                       │
│       IMAGEM BACKDROP (16:9)          │
│                                       │
│  [Logo Filme]              [🔊]       │
│                                       │
├───────────────────────────────────────┤
│                                       │
│  VINGADORES                           │
│                                       │
│  ┌─────────────┐ ┌──┐┌──┐┌──┐  ┌──┐ │
│  │▶️ Assistir   │ │+ ││👍││🕒│  │⬇️│ │
│  └─────────────┘ └──┘└──┘└──┘  └──┘ │
│   Branco         Cinza/✓/❤️/🔵  Mais │
│                                       │
│  98% Match  [16]  2024  [HD]          │
│                                       │
│  Ação • Aventura • Ficção Científica  │
│                                       │
│  Os heróis mais poderosos da Terra    │
│  se unem para combater...             │
│                                       │
│  24 episódios                         │
│                                       │
└───────────────────────────────────────┘
```

### **Legenda dos Botões:**
```
[▶️ Assistir]  → Botão BRANCO grande (principal)
[+]           → Adicionar à Minha Lista
[👍]          → Curtir / Favoritos  
[🕒]          → Assistir Mais Tarde
[⬇️]          → Mais Detalhes
```

---

## 💡 DICAS E TRUQUES

### **1. Remover de uma Lista:**
```
Simplesmente clique novamente no mesmo botão!

Exemplo:
- Item está na Minha Lista (botão com ✓)
- Clique novamente
- Ícone volta para +
- Toast: "Removido da Minha Lista"
```

### **2. Adicionar em Múltiplas Listas:**
```
Você pode adicionar o mesmo item em TODAS as listas:

✓ Minha Lista     (botão +)
✓ Favoritos       (botão 👍)
✓ Assistir Depois (botão 🕒)

Todas as listas são independentes!
```

### **3. Verificar Status:**
```
A cor do botão mostra o status:

+ CINZA   → Não está na Minha Lista
✓ BRANCO  → Está na Minha Lista
👍 CINZA  → Não curtiu
👍 VERMELHO → Curtiu
🕒 CINZA  → Não está em Assistir Depois
🕒 AZUL   → Está em Assistir Depois
```

### **4. Toast de Confirmação:**
```
Sempre que você clica em um botão:

┌────────────────────────────────┐
│ ✅ Vingadores adicionado à     │
│    Minha Lista                 │
└────────────────────────────────┘
          ↑
    Aparece aqui embaixo
    Duração: 2 segundos
```

---

## 📱 ONDE ENCONTRAR SEUS ITENS

### **Minha Lista:**
```
Menu Lateral (☰) → Minha Lista
ou
Perfil → Minha Lista
```

### **Favoritos:**
```
Menu Lateral (☰) → Favoritos
```

### **Assistir Depois:**
```
Menu Lateral (☰) → Assistir Depois
ou
Perfil → Assistir Depois
```

---

## 🔄 SINCRONIZAÇÃO

### **Dados Salvos:**
```
✅ Persistem ao recarregar a página
✅ Sincronizam entre todas as páginas
✅ Salvos no navegador (localStorage)
✅ Não são perdidos ao fechar o navegador
```

### **LocalStorage:**
```javascript
// Suas listas ficam salvas em:
localStorage.getItem('redflix_mylist')      // [1234, 5678, 9012]
localStorage.getItem('redflix_liked')       // [1234, 3456]
localStorage.getItem('redflix_watchlater')  // [5678, 9012]
```

---

## ⚡ ATALHOS RÁPIDOS

| Ação | Botão | Atalho Visual |
|------|-------|---------------|
| Assistir | ▶️ Assistir | Botão branco grande |
| Adicionar à lista | + | Segundo círculo |
| Curtir | 👍 | Terceiro círculo |
| Assistir depois | 🕒 | Quarto círculo |
| Mais detalhes | ⬇️ | Último círculo (direita) |

---

## 🎯 EXEMPLO PRÁTICO

### **Cenário: Adicionar "Vingadores" em todas as listas**

```
1. Encontre o card "Vingadores"
2. Passe o mouse → Card expande

3. PASSO 1: Adicionar à Minha Lista
   - Clique no botão + (segundo botão)
   - Ícone muda para ✓
   - Toast: "Vingadores adicionado à Minha Lista"

4. PASSO 2: Curtir
   - Clique no botão 👍 (terceiro botão)
   - Botão fica VERMELHO
   - Toast: "Você curtiu Vingadores 👍"

5. PASSO 3: Assistir Depois
   - Clique no botão 🕒 (quarto botão)
   - Botão fica AZUL
   - Toast: "Vingadores adicionado a Assistir Depois 🕒"

6. RESULTADO:
   ✓ Botão + está com ✓ (branco)
   ✓ Botão 👍 está vermelho
   ✓ Botão 🕒 está azul
   ✓ Item aparece nas 3 listas!
```

---

## ✅ CHECKLIST DE TESTE

**Teste se tudo funciona:**

- [ ] Passe o mouse em um card → Ele expande?
- [ ] Clique no botão + → Ícone muda para ✓?
- [ ] Clique no botão 👍 → Fica vermelho?
- [ ] Clique no botão 🕒 → Fica azul?
- [ ] Veja o toast de confirmação aparecer?
- [ ] Vá em "Minha Lista" → Item está lá?
- [ ] Vá em "Favoritos" → Item está lá?
- [ ] Vá em "Assistir Depois" → Item está lá?
- [ ] Recarregue a página → Dados permanecem?
- [ ] Clique novamente → Remove da lista?

---

## 🎊 PRONTO!

Agora você sabe usar todos os botões do card hover!

**Lembre-se:**
- ✅ Passe o mouse para expandir
- ✅ Cada botão tem uma função específica
- ✅ Cores indicam o estado
- ✅ Toasts confirmam a ação
- ✅ Dados são salvos automaticamente

**Divirta-se usando a RedFlix! 🎬🍿**
