# 🏆 RedFlix Originais - Página Exclusiva

## 📋 Visão Geral

Página premium dedicada às **produções originais RedFlix**, acessível ao clicar na logo da plataforma no header. Mostra apenas filmes e séries produzidos pela RedFlix com design exclusivo e filtros avançados.

---

## ✨ Funcionalidades Implementadas

### **1. Acesso pela Logo**

**Como acessar:**
```
Clicar na logo RedFlix (canto superior esquerdo) → Abre RedFlix Originais
```

**Comportamento:**
- ✅ Logo agora tem tooltip "RedFlix Originais"
- ✅ Hover effect (opacidade)
- ✅ Abre página exclusiva de originais
- ✅ Fecha todas as outras páginas

---

## 🎨 Design da Página

### **Hero Banner Premium**

```
┌────────────────────────────────────────────────────────┐
│                                                         │
│              🏆  REDFLIX  ORIGINAIS  🏆                │
│                                                         │
│   Produções exclusivas e premiadas. Conteúdo original  │
│          de alta qualidade feito pela RedFlix          │
│                                                         │
│      🏆 20 Originais    ⭐ Premiados                   │
│                                                         │
└────────────────────────────────────────────────────────┘
```

**Características do Banner:**
- ✅ Altura: 50vh (mobile) / 60vh (desktop)
- ✅ Gradient vermelho (#E50914) + preto
- ✅ Pattern de fundo sutil
- ✅ Logo estilizada "REDFLIX ORIGINAIS"
- ✅ Ícones de troféu (Award)
- ✅ Contador de originais
- ✅ Badge "Premiados" com estrela
- ✅ Botão "X" para fechar (top-right)

---

### **Sistema de Filtros**

#### **Filtro 1: Tipo de Conteúdo**
```
[ Todos ] [ Filmes ] [ Séries ]
```

**Estilo:**
- ✅ Pills com borda
- ✅ Ativo: fundo vermelho (#E50914)
- ✅ Inativo: borda branca/30%
- ✅ Hover: borda branca/60%

---

#### **Filtro 2: Gênero**
```
Dropdown com 12 gêneros:
- Todos (padrão)
- Ação
- Aventura
- Animação
- Comédia
- Crime
- Drama
- Fantasia
- Ficção Científica
- Terror
- Romance
- Suspense
```

**Funcionalidade:**
- ✅ Filtra por genre_ids do TMDB
- ✅ Múltiplas combinações possíveis
- ✅ Dropdown estilizado Netflix

---

#### **Filtro 3: Ordenação**
```
Dropdown com 3 opções:
- Mais recentes (padrão)
- Mais populares (por rating)
- Título (A-Z)
```

**Lógica de Ordenação:**

```typescript
// Mais recentes: por data de lançamento
const dateA = new Date(a.release_date || a.first_air_date).getTime();
const dateB = new Date(b.release_date || b.first_air_date).getTime();
return dateB - dateA; // Mais novo primeiro

// Mais populares: por vote_average
return (b.vote_average || 0) - (a.vote_average || 0);

// Título A-Z: alfabético
return titleA.localeCompare(titleB);
```

---

### **Grid de Conteúdo**

#### **Layout Responsivo**

| Tela | Colunas | Breakpoint |
|------|---------|------------|
| **Mobile** | 2 | < 640px |
| **Tablet SM** | 3 | 640px - 768px |
| **Tablet MD** | 4 | 768px - 1024px |
| **Desktop** | 5 | 1024px - 1280px |
| **Desktop XL** | 6 | > 1280px |

**Classes Tailwind:**
```jsx
grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3
```

---

#### **Card de Conteúdo Original**

```
┌─────────────────┐
│ 🏆 ORIGINAL     │  ← Badge vermelho fixo
│                 │
│                 │
│   POSTER 2:3    │
│                 │
│                 │
│             ⭐8.5│  ← Rating no canto
└─────────────────┘
  Título do Filme
  Filme • 2024
```

**Características:**
- ✅ Aspect ratio 2:3 (poster padrão)
- ✅ Badge "REDFLIX ORIGINAL" fixo (top-left)
- ✅ Rating com estrela (bottom-right)
- ✅ Hover: scale 110%
- ✅ Overlay escuro com botões no hover

---

#### **Badge "ORIGINAL"**

**Design:**
```jsx
<div className="bg-[#E50914] text-white text-[10px] font-bold px-2 py-1 rounded inline-flex items-center gap-1">
  <Award className="w-3 h-3" />
  ORIGINAL
</div>
```

**Posicionamento:**
- ✅ Top-left do card
- ✅ Sempre visível (não some no hover)
- ✅ Gradient de fundo para contraste
- ✅ Ícone de troféu + texto

---

#### **Rating Badge**

**Quando mostrar:**
- ✅ Apenas se `vote_average > 0`

**Design:**
```jsx
<div className="bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
  <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
  {vote_average.toFixed(1)}
</div>
```

**Posicionamento:**
- ✅ Bottom-right do card
- ✅ Backdrop blur para legibilidade
- ✅ Estrela amarela preenchida

---

### **Hover Overlay**

**Botões no hover:**
```
┌──────────────────┐
│   [▶ Assistir]   │  ← Fundo branco
│   [ℹ Detalhes]   │  ← Fundo cinza
└──────────────────┘
```

**Características:**
- ✅ Fundo preto/90%
- ✅ Opacidade 0 → 100% (transition)
- ✅ 2 botões full-width
- ✅ Ícones + texto
- ✅ Clique abre MovieDetails

---

## 🎬 Sistema de Dados

### **Lista de Originais RedFlix**

**IDs marcados como originais** (simulação):

```typescript
const redflixOriginalIds = [
  // Séries
  1399,   // Game of Thrones
  94605,  // Arcane
  85271,  // WandaVision
  88396,  // The Falcon and the Winter Soldier
  95557,  // Invincible
  106541, // Dark Crystal
  84958,  // Loki
  115036, // The Lord of the Rings: The Rings of Power
  92749,  // Moon Knight
  114410, // Cowboy Bebop
  
  // Filmes
  505642, // Black Panther
  299534, // Avengers: Endgame
  438631, // Dune
  615656, // Meg 2: The Trench
  872585, // Oppenheimer
  346698, // Barbie
  569094, // Spider-Man: Across the Spider-Verse
  447365, // Guardians of the Galaxy Vol. 3
  361743, // Top Gun: Maverick
  453395, // Doctor Strange in the Multiverse of Madness
];
```

**Total:** 20 originais (10 séries + 10 filmes)

---

### **Busca de Dados**

**Fluxo:**
```
1. Pegar lista de IDs
2. Para cada ID:
   a. Tentar buscar como série (tv)
   b. Se falhar, tentar como filme (movie)
3. Adicionar flag `isRedFlixOriginal: true`
4. Retornar array de Movies
```

**API Calls:**
```typescript
// Série
GET https://api.themoviedb.org/3/tv/${id}?api_key=${KEY}&language=pt-BR

// Filme  
GET https://api.themoviedb.org/3/movie/${id}?api_key=${KEY}&language=pt-BR
```

**Objeto retornado:**
```typescript
{
  ...dadosTMDB,
  media_type: 'tv' | 'movie',
  title: data.name || data.title, // Normalizado
  isRedFlixOriginal: true // Flag exclusiva
}
```

---

## 🔄 Integração com App.tsx

### **Estado**
```typescript
const [showRedFlixOriginalsPage, setShowRedFlixOriginalsPage] = useState(false);
```

### **Handler de Navegação**
```typescript
case 'redflix-originals':
  setShowRedFlixOriginalsPage(true);
  // Fechar todas as outras páginas
  setShowChannels(false);
  setShowKidsPage(false);
  setShowSoccerPage(false);
  setShowLanguagePage(false);
  setShowMyListPage(false);
  setShowContinueWatchingPage(false);
  setShowHistoryPage(false);
  setShowFavoritosPage(false);
  setBottomNavTab('home');
  break;
```

### **Renderização Condicional**
```tsx
if (showRedFlixOriginalsPage) {
  return (
    <RedFlixOriginalsPage 
      onClose={() => setShowRedFlixOriginalsPage(false)}
      onMovieClick={setSelectedMovie}
    />
  );
}
```

---

## 🎯 Fluxo de Uso

### **1. Acessar a Página**

```
Desktop/Mobile:
1. Olhar para o header (topo da tela)
2. Clicar na logo RedFlix (esquerda)
3. Página de Originais abre
```

---

### **2. Navegar pelo Conteúdo**

```
Filtrar:
1. Clicar em "Filmes" → Ver só filmes
2. Selecionar "Ação" no dropdown → Ver originais de ação
3. Escolher "Mais populares" → Ordenar por rating

Resultado:
Grid atualiza instantaneamente com filtros aplicados
```

---

### **3. Assistir Conteúdo**

```
Opção 1 - Hover (Desktop):
1. Passar mouse sobre card
2. Overlay aparece
3. Clicar "▶ Assistir" ou "ℹ Detalhes"

Opção 2 - Clique (Mobile):
1. Tocar no card
2. Abre MovieDetails
3. Ver informações + assistir
```

---

### **4. Voltar**

```
Opção 1 - Botão X:
Clicar no X (canto superior direito) → Volta para home

Opção 2 - Navegação:
Clicar em qualquer item do menu → Fecha Originais
```

---

## 📊 Estados da Página

### **Loading**
```
┌──────────────────────────┐
│    [spinner animado]     │
│  Carregando originais    │
│       RedFlix...         │
└──────────────────────────┘
```

**Quando:** Durante busca na API TMDB

---

### **Empty (Nenhum resultado)**
```
┌──────────────────────────┐
│          🏆              │
│  Nenhum original         │
│     encontrado           │
│                          │
│ Tente ajustar os filtros │
└──────────────────────────┘
```

**Quando:** 
- Todos originais filtrados
- Combinação de filtros sem resultados

---

### **Com Conteúdo**
```
┌──────────────────────────┐
│ 15 originais - Filmes    │
│ - Ação                   │
│                          │
│ [Grid de 15 cards]       │
└──────────────────────────┘
```

**Informação exibida:**
- Quantidade de resultados
- Filtros ativos
- Grid responsivo

---

## 🎨 Paleta de Cores

| Elemento | Cor | Código |
|----------|-----|--------|
| **Background** | Preto | `#141414` |
| **Accent** | Vermelho RedFlix | `#E50914` |
| **Badge Original** | Vermelho | `#E50914` |
| **Rating Star** | Amarelo | `#EAB308` (yellow-500) |
| **Text** | Branco | `#FFFFFF` |
| **Text Secondary** | Branco 60% | `rgba(255,255,255,0.6)` |
| **Cards BG** | Cinza escuro | `#27272A` (zinc-800) |
| **Overlay** | Preto 90% | `rgba(0,0,0,0.9)` |

---

## ✨ Efeitos Visuais

### **Hero Banner**
- ✅ Gradient vermelho → preto
- ✅ Pattern SVG sutil (opacidade 10%)
- ✅ Backdrop blur em elementos

### **Cards**
- ✅ Hover scale: 100% → 110% (300ms)
- ✅ Overlay fade: 0 → 100% (200ms)
- ✅ Border radius: 6px (rounded-md)
- ✅ Lazy loading de imagens

### **Badges**
- ✅ Badge Original: sempre visível
- ✅ Rating badge: backdrop-blur-sm
- ✅ Gradientes para contraste

### **Filtros**
- ✅ Pills com transition-all
- ✅ Border color animado
- ✅ Dropdowns com seta custom

---

## 🚀 Performance

### **Otimizações Implementadas**

1. **Lazy Loading**
```jsx
<img loading="lazy" />
```

2. **Busca Única**
```typescript
useEffect(() => {
  fetchOriginals(); // Apenas no mount
}, []);
```

3. **Filtros em Memória**
```typescript
// Não faz nova API call ao filtrar
const filtered = content.filter(...).sort(...);
```

4. **Imagens TMDB**
```
w500 = 500px de largura (otimizado)
```

---

## 📱 Responsividade

### **Mobile (< 640px)**
```
- Banner: 50vh altura
- Grid: 2 colunas
- Filtros: vertical stack
- Logo: 24px altura
- Text: menor
```

### **Tablet (640px - 1024px)**
```
- Banner: 60vh altura
- Grid: 3-4 colunas
- Filtros: 2 linhas
- Logo: 28px altura
```

### **Desktop (> 1024px)**
```
- Banner: 60vh altura
- Grid: 5-6 colunas
- Filtros: 1 linha horizontal
- Logo: 32px altura
- Text: tamanho padrão
```

---

## 🔧 Arquivos Modificados/Criados

### **Novos:**
```
/components/RedFlixOriginalsPage.tsx  ← Página completa
/REDFLIX_ORIGINALS_README.md          ← Esta documentação
```

### **Modificados:**
```
/App.tsx                      ← Estado + handlers + renderização
/components/NetflixHeader.tsx ← Logo onClick modificado
```

---

## 🎯 Diferenças vs Outras Páginas

### **Exclusividades:**

1. **Hero Banner Premium**
   - Outras páginas: título simples
   - Originais: banner 60vh com design especial

2. **Badge "ORIGINAL"**
   - Outras páginas: badges opcionais
   - Originais: badge obrigatório em todos

3. **Acesso pela Logo**
   - Outras páginas: menu/perfil
   - Originais: logo principal

4. **Tema Vermelho Intenso**
   - Outras páginas: vermelho como accent
   - Originais: vermelho como tema principal

5. **IDs Específicos**
   - Outras páginas: busca geral
   - Originais: lista curada de IDs

---

## 💡 Ideias para Expansão

### **Fase 2 - Backend**
```typescript
// Marcar originais no banco de dados
interface Content {
  id: number;
  isOriginal: boolean;
  originalBadge?: 'REDFLIX' | 'EXCLUSIVE';
  productionYear?: number;
  awards?: string[];
}
```

### **Fase 3 - Features Premium**
- 🔄 Seção "Em Produção" (coming soon)
- 🔄 Trailers exclusivos
- 🔄 Making of / Behind the scenes
- 🔄 Entrevistas com elenco
- 🔄 Badge de "Novo Original" (últimos 30 dias)
- 🔄 "Original do Mês" (destaque especial)

### **Fase 4 - Gamificação**
- 🔄 "Maratonista de Originais" (badge)
- 🔄 "Descobridor" (assistiu antes de viralizar)
- 🔄 Ranking de originais assistidos
- 🔄 Recompensas por assistir todos

---

## 📊 Métricas Sugeridas

### **Analytics a Implementar**

```typescript
// Eventos a trackear
{
  logoClick: number,           // Cliques na logo
  pageViews: number,           // Views da página
  filterUsage: {
    type: { movies: X, series: Y },
    genre: { action: X, drama: Y },
    sort: { recent: X, popular: Y }
  },
  contentClicks: number,       // Cliques em cards
  watchStarts: number,         // Assistiu após clicar
  averageTimeOnPage: seconds
}
```

---

## ✅ Checklist de QA

### **Funcional**
- ✅ Logo abre página de Originais
- ✅ Filtro de tipo funciona (Todos/Filmes/Séries)
- ✅ Filtro de gênero funciona (12 opções)
- ✅ Ordenação funciona (3 modos)
- ✅ Cards clicáveis abrem MovieDetails
- ✅ Badge "ORIGINAL" visível em todos
- ✅ Rating badge mostra nota correta
- ✅ Botão X fecha a página
- ✅ Contador de originais correto

### **Visual**
- ✅ Hero banner responsivo
- ✅ Gradient vermelho aplicado
- ✅ Pattern de fundo visível
- ✅ Logo "REDFLIX ORIGINAIS" centralizada
- ✅ Ícones de troféu renderizando
- ✅ Cards com aspect ratio 2:3
- ✅ Hover effects suaves
- ✅ Badges bem posicionados

### **Responsivo**
- ✅ Mobile: 2 colunas
- ✅ Tablet: 3-4 colunas
- ✅ Desktop: 5-6 colunas
- ✅ Banner altura correta (50vh/60vh)
- ✅ Filtros se reorganizam
- ✅ Texto legível em todas telas

### **Performance**
- ✅ Loading state durante busca
- ✅ Lazy loading de imagens
- ✅ Sem re-render desnecessário
- ✅ Filtros instantâneos

---

## 🎉 Resultado Final

✅ **Página "RedFlix Originais" completa!**

**Acessível por:**
- Clicar na logo RedFlix no header

**Conteúdo:**
- 20 produções originais (10 filmes + 10 séries)

**Filtros:**
- 3 tipos (Todos/Filmes/Séries)
- 12 gêneros
- 3 ordenações

**Design:**
- Hero banner premium 60vh
- Badge "ORIGINAL" em todos
- Grid responsivo 2-6 colunas
- Tema vermelho intenso

**Experiência:**
- Loading states
- Empty states
- Hover effects
- Mobile-friendly
- Integração MovieDetails

---

**Status:** ✅ Implementado e Funcionando  
**Data:** Novembro 2024  
**Versão RedFlix:** 2.4.0  
**Feature:** Catálogo de Originais Exclusivos  
**Impacto:** Destaca produções próprias da plataforma 🏆✨

**Clique na logo e explore os melhores originais RedFlix! 🎬❤️**
