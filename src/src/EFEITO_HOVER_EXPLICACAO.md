# 🎬 RedFlix - Efeito Hover nas Imagens (Estilo Netflix)

## 📋 Descrição do Efeito

O efeito hover implementado na plataforma RedFlix replica fielmente o comportamento da Netflix, criando uma experiência visual rica e interativa quando o usuário passa o mouse sobre os cards de filmes e séries.

---

## 🎯 Características Principais

### 1. **Card Expandido ao Hover (Zoom + Informações)**
- O card aumenta **30% do tamanho original** (300px → 390px)
- Aparece um overlay com informações detalhadas
- Transição suave de 300ms
- O card sobe acima dos outros elementos (z-index: 50)

### 2. **Blur nos Cards Vizinhos**
- Quando você passa o mouse em um card, os outros ficam desfocados (`blur(2px)`)
- Redução de opacidade para 50% nos cards não selecionados
- Cria foco visual no card em hover

### 3. **Conteúdo Adicional no Hover**
- Logo do filme/série (se disponível no TMDB)
- Botões de ação (Assistir, Minha Lista, Gostei, Ver Depois)
- Percentual de match
- Classificação etária
- Ano de lançamento
- Gêneros
- Sinopse (limitada a 3 linhas)
- Temporadas e episódios (para séries)

---

## 💻 Código Completo - Componente MovieCard

```tsx
import { useState, useEffect } from 'react';
import { Movie, getImageUrl, getTitle } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  onAddToList?: () => void;
  onLike?: () => void;
  onWatchLater?: () => void;
  isInList?: boolean;
  isLiked?: boolean;
  isInWatchLater?: boolean;
}

export function MovieCard({ 
  movie, 
  onClick, 
  onAddToList, 
  onLike, 
  onWatchLater, 
  isInList = false, 
  isLiked = false, 
  isInWatchLater = false 
}: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [ageRating, setAgeRating] = useState<string>('');
  const [episodes, setEpisodes] = useState<number>(0);
  const [seasons, setSeasons] = useState<number>(0);
  const [releaseYear, setReleaseYear] = useState<string>('');

  const mediaType = movie.media_type || (movie.first_air_date && !movie.release_date ? 'tv' : 'movie');
  const title = getTitle(movie);

  return (
    <div
      className="relative group cursor-pointer touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ========================================
          CARD NORMAL (Sempre Visível)
          ======================================== */}
      <div className="relative rounded-md overflow-hidden shadow-lg transition-all duration-300 group-hover:opacity-0">
        <div 
          className="relative w-full aspect-[16/9] bg-[#141414] overflow-hidden"
          onClick={() => onClick?.()}
        >
          <OptimizedImage
            src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
            alt={title}
            className="w-full h-full object-cover"
            priority={false}
            blur={true}
            quality={75}
            width={500}
            height={281}
            useProxy={false}
          />
          
          {/* Logo pequeno no card normal */}
          {logoPath && (
            <div className="absolute top-1 md:top-2 left-1 md:left-2 max-w-[40%]">
              <img
                src={getImageUrl(logoPath, 'w300')}
                alt={`${title} logo`}
                className="w-full h-auto max-h-6 md:max-h-12 object-contain drop-shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================
          CARD EXPANDIDO (Aparece no Hover)
          ======================================== */}
      <div 
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ 
          transformOrigin: 'center top',
          width: '390px' // 30% maior que o original
        }}
      >
        <div className="bg-[#181818] rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
          
          {/* Imagem Grande */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <OptimizedImage
              src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
              alt={title}
              className="w-full h-full object-cover"
              priority={true}
              blur={true}
              quality={85}
              width={780}
              height={439}
              useProxy={false}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent pointer-events-none" />
            
            {/* Volume Icon */}
            <div className="absolute top-4 right-4 z-10">
              <button className="w-9 h-9 rounded-full border-2 border-white/60 hover:border-white bg-transparent/40 backdrop-blur-sm flex items-center justify-center transition-colors">
                {/* SVG Volume Icon */}
              </button>
            </div>
          </div>

          {/* Informações do Conteúdo */}
          <div className="p-5">
            
            {/* Logo ou Título */}
            {logoPath ? (
              <div className="flex items-center justify-start mb-4">
                <img
                  src={getImageUrl(logoPath, 'w500')}
                  alt={`${title} logo`}
                  className="max-w-[60%] h-auto max-h-16 object-contain"
                />
              </div>
            ) : (
              <h3 className="text-white text-xl font-bold mb-4 line-clamp-2">
                {title}
              </h3>
            )}
            
            {/* Botões de Ação */}
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-full flex items-center gap-2 transition-colors font-bold"
              >
                <PlayIcon />
                <span>Assistir</span>
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToList?.();
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                  isInList 
                    ? 'border-white bg-white hover:bg-gray-200' 
                    : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                }`}
                title={isInList ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
              >
                {isInList ? <CheckIcon /> : <PlusIcon />}
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onLike?.();
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                  isLiked
                    ? 'border-[#E50914] bg-[#E50914] hover:bg-[#f40612]'
                    : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                }`}
                title={isLiked ? 'Remover Gostei' : 'Gostei'}
              >
                <ThumbsUpIcon />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onWatchLater?.();
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                  isInWatchLater
                    ? 'border-blue-500 bg-blue-500 hover:bg-blue-600'
                    : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                }`}
                title={isInWatchLater ? 'Remover de Assistir Mais Tarde' : 'Assistir Mais Tarde'}
              >
                <ClockIcon />
              </button>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors ml-auto"
              >
                <ChevronDownIcon />
              </button>
            </div>

            {/* Match, Classificação e Ano */}
            <div className="flex items-center gap-2 mb-3 text-sm flex-wrap">
              <span className="text-green-500 font-bold">
                {Math.round(movie.vote_average * 10)}% Match
              </span>
              {ageRating && (
                <span className="px-2 py-0.5 border-2 border-gray-400 text-white text-xs font-bold">
                  {ageRating}
                </span>
              )}
              <span className="text-gray-400 text-sm">
                {releaseYear}
              </span>
              <span className="px-1.5 border border-gray-500 text-gray-400 text-xs">HD</span>
            </div>

            {/* Gêneros */}
            {genres.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-white mb-3">
                {genres.map((genre, idx) => (
                  <span key={genre}>
                    {genre}
                    {idx < genres.length - 1 && <span className="mx-1.5 text-gray-500">•</span>}
                  </span>
                ))}
              </div>
            )}

            {/* Sinopse */}
            {movie.overview && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                {movie.overview}
              </p>
            )}

            {/* Temporadas e Episódios (para séries) */}
            {mediaType === 'tv' && (seasons > 0 || episodes > 0) && (
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                {seasons > 0 && (
                  <span className="font-semibold">
                    {seasons} temporada{seasons > 1 ? 's' : ''}
                  </span>
                )}
                {seasons > 0 && episodes > 0 && <span className="text-gray-600">•</span>}
                {episodes > 0 && (
                  <span>
                    {episodes} episódio{episodes > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 🎨 Código - ContentRow (Blur nos Vizinhos)

```tsx
import { useState } from 'react';
import { Movie } from '../utils/tmdb';
import { MovieCard } from './MovieCard';
import { motion } from 'motion/react';

interface ContentRowProps {
  title: string;
  content: Movie[];
  onMovieClick: (movie: Movie) => void;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
}

export function ContentRow({ 
  title, 
  content, 
  onMovieClick, 
  onAddToList, 
  onLike, 
  onWatchLater 
}: ContentRowProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <div className="mb-8 md:mb-12">
      {/* Título da Linha */}
      <h2 className="text-white font-bold text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 px-4 md:px-2">
        {title}
      </h2>

      {/* Grid de Conteúdo com Blur nos Vizinhos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6 px-4 md:px-2">
        {content.map((item) => (
          <motion.div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            animate={{
              filter: hoveredId !== null && hoveredId !== item.id ? 'blur(2px)' : 'blur(0px)',
              opacity: hoveredId !== null && hoveredId !== item.id ? 0.5 : 1,
            }}
            transition={{ duration: 0.3 }}
            className="touch-manipulation relative"
            style={{ zIndex: hoveredId === item.id ? 100 : 1 }}
          >
            <MovieCard
              movie={item}
              onClick={() => onMovieClick(item)}
              onAddToList={() => onAddToList?.(item)}
              onLike={() => onLike?.(item)}
              onWatchLater={() => onWatchLater?.(item)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🔧 Classes CSS Principais

### 1. **Transições Suaves**
```css
/* Card normal que desaparece no hover */
.group-hover:opacity-0 {
  transition: all 300ms;
}

/* Card expandido que aparece no hover */
.transition-all.duration-300 {
  transition-property: all;
  transition-duration: 300ms;
}
```

### 2. **Transformações**
```css
/* Zoom e centralização do card expandido */
transform: translateX(-50%);
transform-origin: center top;

/* Estado normal vs hover */
opacity-100 scale-100  /* Visível */
opacity-0 scale-95     /* Invisível */
```

### 3. **Z-Index (Camadas)**
```css
/* Card em hover fica acima de todos */
z-50 (z-index: 50)

/* Cards normais */
z-1 (z-index: 1)

/* Cards em hover na grid */
z-100 (z-index: 100)
```

### 4. **Blur nos Vizinhos (Motion)**
```tsx
animate={{
  filter: hoveredId !== null && hoveredId !== item.id 
    ? 'blur(2px)'    // Cards vizinhos
    : 'blur(0px)',   // Card em hover
  opacity: hoveredId !== null && hoveredId !== item.id 
    ? 0.5            // Cards vizinhos
    : 1,             // Card em hover
}}
```

---

## 📐 Dimensões e Proporções

| Elemento | Tamanho Normal | Tamanho Hover |
|----------|----------------|---------------|
| **Card Width** | 300px | 390px (+30%) |
| **Aspect Ratio** | 16:9 | 16:9 |
| **Card Height** | auto (169px) | auto (220px) |
| **Border** | none | 2px gray-700 |
| **Shadow** | lg | 2xl |

---

## ⚡ Otimizações de Performance

### 1. **Lazy Loading de Detalhes**
```tsx
// Buscar detalhes APENAS quando hover
useEffect(() => {
  if (isHovered && !logoPath && !genres.length) {
    fetchDetails(); // API TMDB
  }
}, [isHovered]);
```

### 2. **Cache de Dados**
```tsx
// Cache global para evitar requisições repetidas
const detailsCache = new Map<string, any>();

async function getCachedDetails(mediaType: string, id: number) {
  const cacheKey = `${mediaType}-${id}`;
  
  if (detailsCache.has(cacheKey)) {
    return detailsCache.get(cacheKey);
  }
  
  const data = await fetch(`${TMDB_BASE_URL}/${mediaType}/${id}`);
  detailsCache.set(cacheKey, data);
  
  return data;
}
```

### 3. **Pointer Events**
```tsx
// Desabilitar cliques quando card não está visível
pointer-events-none
```

---

## 🎭 Estados Visuais

### Card Normal
- ✅ Imagem horizontal (backdrop)
- ✅ Logo pequeno (se disponível)
- ✅ Sem informações adicionais
- ✅ Opacidade 100%

### Card em Hover
- ✅ Zoom 30%
- ✅ Imagem grande com gradient
- ✅ Logo grande
- ✅ Botões de ação
- ✅ Match, classificação, ano
- ✅ Gêneros
- ✅ Sinopse
- ✅ Temporadas/episódios (séries)
- ✅ Border e shadow aumentados

### Cards Vizinhos
- ✅ Blur de 2px
- ✅ Opacidade 50%
- ✅ Transição suave

---

## 📱 Responsividade

```tsx
// Grid adaptável
grid-cols-2        // Mobile
sm:grid-cols-3     // Tablet pequeno
md:grid-cols-4     // Tablet
lg:grid-cols-5     // Desktop
xl:grid-cols-6     // Desktop grande
2xl:grid-cols-7    // 4K
```

---

## 🎯 Como Replicar em Outro Projeto

### Passo 1: Estrutura HTML
```tsx
<div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
  {/* Card Normal */}
  <div className="transition-all group-hover:opacity-0">
    <img src={image} alt={title} />
  </div>
  
  {/* Card Expandido */}
  <div className={isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}>
    <div className="bg-dark rounded-lg shadow-2xl">
      <img src={image} alt={title} />
      <div className="p-5">
        {/* Conteúdo detalhado */}
      </div>
    </div>
  </div>
</div>
```

### Passo 2: CSS Tailwind
```tsx
// Card container
className="relative group cursor-pointer"

// Card normal
className="transition-all duration-300 group-hover:opacity-0"

// Card hover
className={`absolute top-0 left-1/2 -translate-x-1/2 z-50 
  transition-all duration-300 
  ${isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
```

### Passo 3: Blur nos Vizinhos (Motion)
```tsx
import { motion } from 'motion/react';

<motion.div
  animate={{
    filter: hoveredId !== null && hoveredId !== item.id ? 'blur(2px)' : 'blur(0px)',
    opacity: hoveredId !== null && hoveredId !== item.id ? 0.5 : 1,
  }}
  transition={{ duration: 0.3 }}
>
  <Card />
</motion.div>
```

### Passo 4: Estado de Hover
```tsx
const [isHovered, setIsHovered] = useState(false);
const [hoveredId, setHoveredId] = useState<number | null>(null);

// No card individual
onMouseEnter={() => setIsHovered(true)}
onMouseLeave={() => setIsHovered(false)}

// Na grid
onMouseEnter={() => setHoveredId(item.id)}
onMouseLeave={() => setHoveredId(null)}
```

---

## 🎬 Resultado Final

### Comportamento:
1. **Mouse fora** → Card normal com imagem horizontal
2. **Mouse sobre** → Card expande 30%, mostra detalhes, logo, botões
3. **Cards vizinhos** → Ficam desfocados (blur 2px) e com 50% opacidade
4. **Transição** → 300ms suave em todas as mudanças

### Cores RedFlix:
- Background: `#181818` (card expandido)
- Texto: `#FFFFFF` (branco)
- Botão principal: `#E50914` (vermelho RedFlix)
- Texto secundário: `#BEBEBE` (cinza claro)
- Border: `#374151` (gray-700)

---

## ✅ Checklist de Implementação

- [x] Card normal com backdrop/poster
- [x] Card expandido 30% maior
- [x] Transição suave de 300ms
- [x] Blur nos cards vizinhos
- [x] Opacidade reduzida nos vizinhos
- [x] Z-index correto (card hover acima)
- [x] Logo do TMDB (quando disponível)
- [x] Botões de ação (Assistir, Lista, Gostei, Ver Depois)
- [x] Match percentage
- [x] Classificação etária
- [x] Ano de lançamento
- [x] Gêneros
- [x] Sinopse (3 linhas)
- [x] Temporadas/episódios (séries)
- [x] Gradient overlay
- [x] Volume icon
- [x] Responsividade
- [x] Cache de dados TMDB
- [x] Lazy loading de detalhes

---

**Desenvolvido com ❤️ para RedFlix**
