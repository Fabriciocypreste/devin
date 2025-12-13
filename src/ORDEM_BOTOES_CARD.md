# 🎯 ORDEM CORRETA DOS BOTÕES DO CARD HOVER

## 📐 LAYOUT VISUAL DOS BOTÕES

```
┌────────────────────────────────────────────────────┐
│                                                    │
│          IMAGEM DO FILME/SÉRIE (16:9)              │
│                                                    │
│  [Logo ou Título Grande]                           │
│                                                    │
│  ┌──────────────┐  ┌───┐  ┌───┐  ┌───┐     ┌───┐ │
│  │ ▶️ Assistir  │  │ ➕ │  │ 👍 │  │ 🕒 │     │ ⬇️ │ │
│  └──────────────┘  └───┘  └───┘  └───┘     └───┘ │
│   1º BOTÃO         2º     3º     4º         5º    │
│                                                    │
│  98% Match  [16]  2024  [HD]                       │
│  Ação • Aventura • Ficção                          │
│  Sinopse do filme ou série...                      │
└────────────────────────────────────────────────────┘
```

---

## 🎮 ORDEM E FUNCIONALIDADE DOS BOTÕES

### **1º BOTÃO - ▶️ ASSISTIR** (Branco, Grande)
**Aparência:** Botão retangular branco com texto "Assistir"  
**Funcionalidade:** Abre a página de detalhes completa  
**O que mostra:**
- ✅ Informações completas do filme/série
- ✅ Temporadas e episódios (para séries)
- ✅ Elenco e atores
- ✅ Trailer e vídeos
- ✅ Sinopse completa
- ✅ Recomendações similares

```typescript
onClick={(e) => {
  e.stopPropagation();
  onClick?.(); // Abre MovieDetails
}}
```

---

### **2º BOTÃO - ➕ ADICIONAR À MINHA LISTA** (Círculo)
**Aparência:** Círculo cinza com ícone +  
**Quando ativado:** Círculo branco com ícone ✓  
**Funcionalidade:** Adiciona/remove da "Minha Lista"  
**O que faz:**
- ✅ Salva no localStorage (`redflix_mylist`)
- ✅ Item aparece na página "Minha Lista"
- ✅ Ícone muda de + para ✓
- ✅ Toast: "{título} adicionado à Minha Lista"

**Estados:**
- 🔘 **Não na lista:** Círculo cinza + ícone + branco
- ✅ **Na lista:** Círculo branco + ícone ✓ preto

```typescript
onClick={(e) => {
  e.stopPropagation();
  onAddToList?.(); // Adiciona à Minha Lista
}}
```

---

### **3º BOTÃO - 👍 CURTIR** (Círculo)
**Aparência:** Círculo cinza com ícone 👍  
**Quando ativado:** Círculo VERMELHO com ícone 👍 branco  
**Funcionalidade:** Adiciona/remove dos "Favoritos"  
**O que faz:**
- ✅ Salva no localStorage (`redflix_liked`)
- ✅ Item aparece na página "Favoritos"
- ✅ Círculo fica vermelho (#E50914)
- ✅ Toast: "Você curtiu {título} 👍"

**Estados:**
- 🔘 **Não curtido:** Círculo cinza + ícone branco
- ❤️ **Curtido:** Círculo VERMELHO (#E50914) + ícone branco

```typescript
onClick={(e) => {
  e.stopPropagation();
  onLike?.(); // Adiciona aos Favoritos
}}
```

---

### **4º BOTÃO - 🕒 ASSISTIR MAIS TARDE** (Círculo)
**Aparência:** Círculo cinza com ícone 🕒  
**Quando ativado:** Círculo AZUL com ícone 🕒 branco  
**Funcionalidade:** Adiciona/remove de "Assistir Depois"  
**O que faz:**
- ✅ Salva no localStorage (`redflix_watchlater`)
- ✅ Item aparece na página "Assistir Depois"
- ✅ Círculo fica azul
- ✅ Toast: "{título} adicionado a Assistir Depois 🕒"

**Estados:**
- 🔘 **Não na lista:** Círculo cinza + ícone branco
- 🔵 **Na lista:** Círculo AZUL + ícone branco

```typescript
onClick={(e) => {
  e.stopPropagation();
  onWatchLater?.(); // Adiciona a Assistir Mais Tarde
}}
```

---

### **5º BOTÃO - ⬇️ DETALHES/EXPANDIR** (Círculo, Direita)
**Aparência:** Círculo cinza com seta ⬇️ (alinhado à direita)  
**Funcionalidade:** Abre a página de detalhes completa (igual ao botão Assistir)  
**O que mostra:**
- ✅ Página completa de detalhes (MovieDetails)
- ✅ **Temporadas e episódios** (para séries)
- ✅ **Elenco completo e atores**
- ✅ Trailer e vídeos relacionados
- ✅ Sinopse detalhada
- ✅ Filmes/séries similares
- ✅ Informações técnicas

```typescript
onClick={(e) => {
  e.stopPropagation();
  onClick?.(); // Abre MovieDetails (mesma função do botão Assistir)
}}
```

**Nota:** Este botão tem a mesma funcionalidade do 1º botão (Assistir). Ambos abrem a página de detalhes completa.

---

## 🎨 CORES DOS BOTÕES

### **Botão Assistir (1º):**
```css
bg-white                    /* Fundo branco */
hover:bg-gray-200           /* Hover cinza claro */
text-black                  /* Texto preto */
```

### **Botão Adicionar à Lista (2º):**
```css
/* Estado NORMAL */
bg-[#2a2a2a]                /* Fundo cinza escuro */
border-gray-400             /* Borda cinza */
text-white                  /* Ícone branco */

/* Estado ATIVO (na lista) */
bg-white                    /* Fundo branco */
border-white                /* Borda branca */
text-black                  /* Ícone preto (✓) */
```

### **Botão Curtir (3º):**
```css
/* Estado NORMAL */
bg-[#2a2a2a]                /* Fundo cinza escuro */
border-gray-400             /* Borda cinza */
text-white                  /* Ícone branco */

/* Estado ATIVO (curtido) */
bg-[#E50914]                /* Fundo VERMELHO RedFlix */
border-[#E50914]            /* Borda vermelha */
text-white                  /* Ícone branco */
hover:bg-[#f40612]          /* Hover vermelho mais claro */
```

### **Botão Assistir Mais Tarde (4º):**
```css
/* Estado NORMAL */
bg-[#2a2a2a]                /* Fundo cinza escuro */
border-gray-400             /* Borda cinza */
text-white                  /* Ícone branco */

/* Estado ATIVO (na lista) */
bg-blue-500                 /* Fundo AZUL */
border-blue-500             /* Borda azul */
text-white                  /* Ícone branco */
hover:bg-blue-600           /* Hover azul mais escuro */
```

### **Botão Detalhes (5º):**
```css
bg-[#2a2a2a]                /* Fundo cinza escuro */
border-gray-400             /* Borda cinza */
text-white                  /* Ícone branco */
hover:border-white          /* Hover borda branca */
hover:bg-[#3a3a3a]          /* Hover fundo cinza mais claro */
```

---

## 📱 EXEMPLO VISUAL COMPLETO

### **Card Normal (Sem Hover):**
```
┌──────────────────┐
│                  │
│                  │
│   IMAGEM DO      │
│   FILME/SÉRIE    │
│                  │
│                  │
└──────────────────┘
    (sem botões)
```

### **Card com Hover (Expandido 30%):**
```
┌─────────────────────────────────────────────┐
│                                             │
│       IMAGEM BACKDROP (16:9)                │
│                                             │
│  [Logo Grande]              [🔊]            │
│                                             │
├─────────────────────────────────────────────┤
│                                             │
│  VINGADORES                                 │
│                                             │
│  ┌─────────────┐ ┌──┐ ┌──┐ ┌──┐     ┌──┐  │
│  │ ▶️ Assistir │ │➕│ │👍│ │🕒│     │⬇️│  │
│  └─────────────┘ └──┘ └──┘ └──┘     └──┘  │
│                                             │
│  98% Match  [16]  2024  [HD]                │
│                                             │
│  Ação • Aventura • Ficção Científica        │
│                                             │
│  Os heróis mais poderosos da Terra se       │
│  unem para combater uma ameaça global...    │
│                                             │
│  24 episódios                               │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔄 FLUXO DE USO

### **Cenário 1: Ver Detalhes Completos**
```
1. Usuário passa o mouse no card
2. Card expande mostrando 5 botões
3. Clica em "▶️ Assistir" OU "⬇️ Detalhes"
4. Página MovieDetails abre
5. Vê temporadas, episódios, elenco, trailer
```

### **Cenário 2: Adicionar às Listas**
```
1. Usuário passa o mouse no card
2. Card expande mostrando 5 botões
3. Clica em "➕" → Item vai para "Minha Lista"
4. Clica em "👍" → Item vai para "Favoritos" (vermelho)
5. Clica em "🕒" → Item vai para "Assistir Depois" (azul)
6. Toasts aparecem confirmando
```

### **Cenário 3: Gerenciar Estado**
```
1. Item JÁ está na Minha Lista (ícone ✓)
2. Item JÁ foi curtido (botão vermelho)
3. Item JÁ está em Assistir Depois (botão azul)
4. Clica novamente em qualquer um → Remove da lista
5. Toast confirma remoção
```

---

## 🎯 RESUMO RÁPIDO

| Posição | Ícone | Nome | Cor Ativa | Salva Em |
|---------|-------|------|-----------|----------|
| 1º | ▶️ | Assistir | Branco | - (abre detalhes) |
| 2º | ➕/✓ | Adicionar à Lista | Branco | `redflix_mylist` |
| 3º | 👍 | Curtir | Vermelho | `redflix_liked` |
| 4º | 🕒 | Assistir Mais Tarde | Azul | `redflix_watchlater` |
| 5º | ⬇️ | Detalhes | Cinza | - (abre detalhes) |

---

## ✅ CONFIRMAÇÃO

**Botões que abrem DETALHES COMPLETOS (temporadas, episódios, atores):**
- ✅ 1º Botão - ▶️ Assistir
- ✅ 5º Botão - ⬇️ Detalhes (seta para baixo)

**Ambos abrem a mesma página:** `MovieDetails`

**3º Botão (👍 Curtir):**
- ✅ Fica VERMELHO quando ativado
- ✅ Salva em "Favoritos"
- ✅ localStorage: `redflix_liked`

**4º Botão (🕒 Assistir Mais Tarde):**
- ✅ Fica AZUL quando ativado
- ✅ Salva em "Assistir Depois"
- ✅ localStorage: `redflix_watchlater`

---

## 📊 CÓDIGO FONTE

**Arquivo:** `/components/MovieCard.tsx`  
**Linhas:**
- Linha 210-219: Botão Assistir (1º)
- Linha 220-239: Botão Adicionar à Lista (2º)
- Linha 240-253: Botão Curtir (3º)
- Linha 254-267: Botão Assistir Mais Tarde (4º)
- Linha 268-276: Botão Detalhes (5º)

---

**✅ TUDO CORRETO E FUNCIONANDO!**

**Criado em:** Novembro 2024  
**Status:** ✅ CONFIRMADO
