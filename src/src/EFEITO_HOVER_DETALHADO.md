# 🎬 EFEITO HOVER DETALHADO - CARDS DE FILMES/SÉRIES

## 📋 Visão Geral

O efeito hover nos cards de filmes e séries do RedFlix é **IDÊNTICO ao Netflix**, com expansão do card, exibição de informações detalhadas e animações suaves.

---

## 🎨 ANATOMIA DO EFEITO HOVER

### 1️⃣ **ESTADO NORMAL** (Sem Hover)

```
┌─────────────────────────────┐
│                             │
│   [Imagem Backdrop 16:9]    │
│                             │
│   [Logo do Filme/Série]     │  ← Canto superior esquerdo
│                             │
└─────────────────────────────┘
```

**Características:**
- 📐 Aspect Ratio: **16:9** (horizontal)
- 📏 Largura: **300px** (base)
- 🖼️ Imagem: Backdrop em qualidade **w780**
- 🏷️ Logo: Se disponível, aparece no canto superior esquerdo
- 🎨 Background: `#141414` (cinza escuro Netflix)
- ✨ Bordas: `rounded-md` com `shadow-lg`

---

### 2️⃣ **ESTADO HOVER** (Mouse sobre o card)

```
╔═══════════════════════════════════════════╗
║                                           ║
║     [Imagem Backdrop MAIOR 16:9]          ║
║                                           ║
║     [Logo HD ou Título]        [🔊]       ║  ← Volume no canto
║                                           ║
║━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━║
║                                           ║
║  [▶ Assistir]  [+]  [👍]  [🕐]  [⌄]     ║  ← Botões de ação
║                                           ║
║  98% Match  [16]  2024  HD                ║  ← Informações
║                                           ║
║  Ação • Suspense • Drama                  ║  ← Gêneros
║                                           ║
║  Uma história emocionante sobre...        ║  ← Sinopse
║                                           ║
║  10 episódios                             ║  ← Para séries
║                                           ║
╚═══════════════════════════════════════════╝
```

---

## 🔧 ESPECIFICAÇÕES TÉCNICAS

### **Transformações CSS**

#### Card Principal (Grid)
```css
/* Estado Normal */
transform: scale(1);
opacity: 1;
transition: transform 0.3s, opacity 0.3s;

/* Estado Hover (card atual) */
transform: scale(1.05);  /* 5% maior */
opacity: 1;
z-index: 100;

/* Estado Hover (outros cards) */
transform: scale(1);
opacity: 0.5;  /* 50% transparente */
z-index: 1;
```

#### Card Expandido
```css
/* Posicionamento */
position: absolute;
top: 0;
left: 50%;
transform: translateX(-50%);
z-index: 50;

/* Dimensões */
width: 390px;  /* 300px + 30% = 390px */
transform-origin: center top;

/* Animações */
animation: fade-in zoom-in;
duration: 300ms;
```

### **Cores e Estilos**

```css
/* Card Expandido */
background: #181818;  /* Cinza escuro Netflix */
border: 2px solid #444444;  /* Borda cinza */
border-radius: 8px;
box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9);  /* Sombra profunda */

/* Gradient Overlay na Imagem */
background: linear-gradient(
  to top,
  #181818 0%,
  transparent 50%,
  transparent 100%
);
```

---

## 📊 ELEMENTOS DO CARD EXPANDIDO

### **1. Imagem Principal**
- 📐 Aspect Ratio: **16:9**
- 📏 Qualidade: **w780** (alta resolução)
- 🎨 Overlay: Gradiente de baixo para cima
- ⚡ Priority: **true** (carregamento prioritário)

### **2. Botão de Volume** (Canto Superior Direito)
```
┌─────┐
│ 🔊  │  ← Ícone de volume
└─────┘
```
- 🎨 Background: `rgba(0,0,0,0.4)` com `backdrop-blur`
- 🔲 Tamanho: **36x36px** (w-9 h-9)
- 🔘 Borda: `2px solid rgba(255,255,255,0.6)`
- 🌀 Forma: `rounded-full` (circular)

### **3. Logo ou Título**
```
Se tem logo TMDB:
  [████ LOGO ████]
  max-width: 60%
  max-height: 64px

Se não tem logo:
  "Título do Filme/Série"
  font-size: 1.25rem (20px)
  font-weight: bold
```

### **4. Botões de Ação**

#### **Botão Assistir** (Principal)
```
┌────────────────┐
│ ▶  Assistir    │  ← Branco com ícone play
└────────────────┘
```
- 🎨 Background: `#FFFFFF` (branco)
- 🎨 Hover: `#E5E5E5` (cinza claro)
- 🔤 Texto: `#000000` (preto)
- 📏 Padding: `px-6 py-2` (24px horizontal, 8px vertical)
- 🔘 Forma: `rounded-full` (totalmente arredondado)

#### **Botão Minha Lista** (Segundo)
```
┌───┐
│ + │  ← Adicionar (ou ✓ se já está na lista)
└───┘
```
- 🎨 Normal: Background `#2a2a2a`, Borda `#9CA3AF`
- 🎨 Adicionado: Background `#FFFFFF`, Borda `#FFFFFF`
- 🎨 Hover: Borda fica branca
- 🔲 Tamanho: **36x36px** circular

#### **Botão Gostei** (Terceiro)
```
┌───┐
│ 👍 │  ← Polegar para cima
└───┘
```
- 🎨 Normal: Background `#2a2a2a`, Borda `#9CA3AF`
- 🎨 Ativado: Background `#E50914` (vermelho Netflix)
- 🎨 Hover: Background `#f40612` (vermelho mais claro)
- 🔲 Tamanho: **36x36px** circular

#### **Botão Assistir Mais Tarde** (Quarto)
```
┌───┐
│ 🕐 │  ← Relógio
└───┘
```
- 🎨 Normal: Background `#2a2a2a`, Borda `#9CA3AF`
- 🎨 Ativado: Background `#3B82F6` (azul)
- 🎨 Hover: Background `#2563EB` (azul mais escuro)
- 🔲 Tamanho: **36x36px** circular

#### **Botão Mais Info** (Último - Direita)
```
┌───┐
│ ⌄ │  ← Seta para baixo
└───┘
```
- 🎨 Background: `#2a2a2a`
- 🎨 Borda: `#9CA3AF`
- 🎨 Hover: Borda fica branca
- 📍 Posição: `ml-auto` (alinhado à direita)

### **5. Informações de Match**

```
98% Match  [16]  2024  HD
   ↓        ↓     ↓    ↓
 Score  Idade  Ano  Qualidade
```

- 🎯 **Match**: Verde `#22C55E`, calculado como `vote_average * 10%`
- 🔞 **Classificação**: Borda cinza `2px`, exemplo: `16`, `18`, `L`
- 📅 **Ano**: Cinza claro `#9CA3AF`
- 📺 **Qualidade**: Badge `HD` com borda cinza

### **6. Gêneros**

```
Ação • Suspense • Drama
 ↓      ↓         ↓
Separados por bullet points
```

- 🎨 Cor: `#FFFFFF` (branco)
- 📏 Font-size: `0.875rem` (14px)
- 🔘 Separador: `•` em cinza `#6B7280`

### **7. Sinopse**

```
Uma história emocionante sobre um 
grupo de heróis que deve salvar...
(máximo 3 linhas)
```

- 🎨 Cor: `#9CA3AF` (cinza claro)
- 📏 Font-size: `0.875rem` (14px)
- 📄 Limite: `line-clamp-3` (máximo 3 linhas)

### **8. Informação de Episódios** (Apenas Séries)

```
10 episódios
```

- 🎨 Cor: `#9CA3AF` (cinza claro)
- 📏 Font-size: `0.75rem` (12px)

---

## ⚡ COMPORTAMENTO E ANIMAÇÕES

### **Ao Entrar (onMouseEnter)**
1. ✅ `setIsHovered(true)` - Ativa estado hover
2. 📊 Busca dados do TMDB (logo, gêneros, classificação)
3. 🎬 Card expande 30% (300px → 390px)
4. ✨ Animação `fade-in zoom-in` em 300ms
5. 📌 Z-index aumenta para 50 (fica por cima)
6. 🌓 Outros cards ficam 50% transparentes

### **Ao Sair (onMouseLeave)**
1. ❌ `setIsHovered(false)` - Desativa estado hover
2. 🔄 Card volta ao tamanho normal
3. 💨 Animação `fade-out zoom-out` em 300ms
4. 🌅 Outros cards voltam a 100% de opacidade

### **Efeito no Grid**

```
Estado Inicial:
[A] [B] [C] [D] [E]
100% 100% 100% 100% 100%

Hover em C:
[A]  [B]  ╔═══╗  [D]  [E]
50%  50%  ║ C ║  50%  50%
           ║105%║
           ╚═══╝
```

---

## 🎯 EFEITOS DE FOCO VISUAL

### **Card Atual (Hover)**
- 🔍 `scale(1.05)` - 5% maior
- 💡 `opacity: 1` - Totalmente visível
- 🎨 `z-index: 100` - Acima de tudo no grid
- ✨ Sombra profunda `shadow-2xl`

### **Outros Cards (Sem Hover)**
- 📦 `scale(1)` - Tamanho normal
- 🌫️ `opacity: 0.5` - 50% transparente
- 📌 `z-index: 1` - Camada base
- 🎭 Efeito de "desfoque visual" por opacidade

---

## 🔧 OTIMIZAÇÕES

### **Carregamento Lazy**
- 📥 Logo do TMDB só é buscado no **primeiro hover**
- 💾 Dados são **cacheados** para próximas interações
- ⚡ Imagens usam `OptimizedImage` com blur placeholder

### **Performance**
- 🎨 Transições via CSS (GPU acelerado)
- 🖼️ Imagens com priority no hover
- 📊 Busca de dados apenas quando necessário
- 🗜️ Blur hash para loading progressivo

---

## 📱 RESPONSIVIDADE

### **Desktop (> 1024px)**
- 📏 Card: 300px → 390px no hover
- 🔲 Botões: 36x36px (w-9 h-9)
- 📝 Font-sizes completos

### **Tablet (768px - 1024px)**
- 📏 Card: Proporcionalmente menor
- 🔲 Botões: Mantém 36x36px
- 📝 Font-sizes ligeiramente reduzidos

### **Mobile (< 768px)**
- 🚫 **Hover desabilitado** (touch-manipulation)
- 👆 Tap direto abre MovieDetails
- 📱 Layout simplificado sem expansão

---

## 🎨 PALETA DE CORES COMPLETA

```css
/* Backgrounds */
--card-bg: #181818;           /* Card expandido */
--card-normal-bg: #141414;    /* Card normal */
--button-bg: #2a2a2a;         /* Botões circulares */
--button-hover-bg: #3a3a3a;   /* Hover botões */

/* Acentos */
--primary: #E50914;           /* Vermelho Netflix */
--primary-hover: #f40612;     /* Vermelho hover */
--success: #22C55E;           /* Verde match */
--info: #3B82F6;              /* Azul assistir depois */

/* Textos */
--text-white: #FFFFFF;        /* Títulos */
--text-gray: #9CA3AF;         /* Sinopse */
--text-gray-dark: #6B7280;    /* Separadores */

/* Bordas */
--border-gray: #444444;       /* Borda card */
--border-light: #9CA3AF;      /* Bordas botões */
```

---

## 💡 EXEMPLO DE USO NO CÓDIGO

```tsx
// Grid de Filmes
<div className="grid grid-cols-5 gap-[24px]">
  {movies.map((movie) => (
    <div
      key={movie.id}
      onMouseEnter={() => setHoveredId(movie.id)}
      onMouseLeave={() => setHoveredId(null)}
      style={{ 
        transform: hoveredId === movie.id ? 'scale(1.05)' : 'scale(1)',
        opacity: hoveredId !== null && hoveredId !== movie.id ? 0.5 : 1,
        transition: 'transform 0.3s, opacity 0.3s',
        zIndex: hoveredId === movie.id ? 100 : 1
      }}
    >
      <MovieCard movie={movie} />
    </div>
  ))}
</div>
```

---

## 🎬 RESULTADO FINAL

O efeito hover cria uma experiência **Netflix-like perfeita**:

✅ **Expansão suave** do card em 30%  
✅ **Animações fluidas** em 300ms  
✅ **Foco visual** com opacidade dos outros cards  
✅ **Informações completas** sem sair da página  
✅ **Botões de ação** instantâneos  
✅ **Performance otimizada** com lazy loading  
✅ **Responsivo** e touch-friendly  

---

**Documentação**: RedFlix v2.0  
**Componente**: `/components/MovieCard.tsx`  
**Inspiração**: Netflix (2024)  
**Status**: ✅ Implementado e Funcional
