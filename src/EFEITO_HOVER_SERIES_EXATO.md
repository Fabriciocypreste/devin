# 🎬 CÓDIGO EXATO DO EFEITO HOVER - PÁGINA SÉRIES

## 📍 LOCALIZAÇÃO NO CÓDIGO

### Arquivo: `/components/SeriesPage.tsx`
**Linhas 236-258** - Wrapper com Motion.div

### Arquivo: `/components/MovieCard.tsx`  
**Linhas 120-326** - Componente completo com hover

---

## 🎯 PARTE 1: WRAPPER NA PÁGINA SÉRIES (SeriesPage.tsx)

```tsx
// Linhas 236-258 de SeriesPage.tsx

{series.map((show) => (
  <motion.div
    key={show.id}
    onMouseEnter={() => setHoveredId(show.id)}
    onMouseLeave={() => setHoveredId(null)}
    animate={{
      scale: hoveredId === show.id ? 1.05 : 1,
      opacity: hoveredId !== null && hoveredId !== show.id ? 0.5 : 1,
    }}
    transition={{ duration: 0.3 }}
    className="touch-manipulation relative"
    style={{ zIndex: hoveredId === show.id ? 100 : 1 }}
  >
    <MovieCard
      movie={show}
      onClick={() => onMovieClick && onMovieClick(show)}
      onAddToList={() => onAddToList?.(show)}
      onLike={() => onLike?.(show)}
      onWatchLater={() => onWatchLater?.(show)}
      isInList={myList.includes(show.id)}
      isLiked={likedList.includes(show.id)}
      isInWatchLater={watchLaterList.includes(show.id)}
    />
  </motion.div>
))}
```

### 🔑 VARIÁVEL DE ESTADO NECESSÁRIA:

```tsx
// Linha 61 de SeriesPage.tsx
const [hoveredId, setHoveredId] = useState<number | null>(null);
```

---

## 🎯 PARTE 2: COMPONENTE MOVIECARD COMPLETO (MovieCard.tsx)

### **ESTADO DO HOVER:**

```tsx
// Linha 58
const [isHovered, setIsHovered] = useState(false);
```

### **ESTRUTURA PRINCIPAL:**

```tsx
// Linhas 120-326

return (
  <div
    className="relative group cursor-pointer touch-manipulation"
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >
    {/* CARD NORMAL - Sempre visível */}
    <div className="relative rounded-md overflow-hidden shadow-lg transition-all duration-300">
      <div 
        className="relative w-full aspect-[16/9] bg-[#141414] overflow-hidden"
        onClick={onClick}
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
        
        {/* Logo (se existir) */}
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

    {/* CARD EXPANDIDO - Aparece no hover */}
    {isHovered && (
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300"
        style={{ 
          transformOrigin: 'center top',
          width: '390px' // 30% maior que o normal
        }}
      >
        <div className="bg-[#181818] rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
          {/* Imagem backdrop grande */}
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
            
            {/* Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent pointer-events-none" />
            
            {/* Botão Volume */}
            <div className="absolute top-4 right-4 z-10">
              <button className="w-9 h-9 rounded-full border-2 border-white/60 hover:border-white bg-transparent/40 backdrop-blur-sm flex items-center justify-center transition-colors">
                <Volume2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Conteúdo: Logo/Título + Botões + Info */}
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
              {/* Botão Assistir */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-full flex items-center gap-2 transition-colors font-bold"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                <span>Assistir</span>
              </button>
              
              {/* Botão Adicionar */}
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
              >
                {isInList ? (
                  <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </button>
              
              {/* Botão Like */}
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
              >
                <ThumbsUp className="w-5 h-5 text-white" />
              </button>
              
              {/* Botão Assistir Mais Tarde */}
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
              >
                <Clock className="w-5 h-5 text-white" />
              </button>
              
              {/* Botão Mais Info */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors ml-auto"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Match, Classificação, Ano */}
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
                {subtitle}
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

            {/* Descrição */}
            {movie.overview && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                {movie.overview}
              </p>
            )}

            {/* Info de episódios (séries) */}
            {mediaType === 'tv' && episodes > 0 && (
              <p className="text-gray-400 text-xs mb-2">
                {episodes} episódio{episodes > 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>
    )}
  </div>
);
```

---

## ⚙️ CARACTERÍSTICAS DO EFEITO:

### 1️⃣ **WRAPPER MOTION (SeriesPage)**
- ✅ Scale 1.05 no hover
- ✅ Opacity 0.5 nos outros cards
- ✅ Z-index 100 no card hover
- ✅ Transição de 300ms

### 2️⃣ **CARD NORMAL (MovieCard)**
- ✅ Aspect ratio 16:9
- ✅ Imagem backdrop
- ✅ Logo opcional no canto
- ✅ Sempre visível

### 3️⃣ **CARD EXPANDIDO (hover)**
- ✅ Width: 390px (30% maior)
- ✅ Posição: absolute, centralizado
- ✅ Animação: fade-in + zoom-in
- ✅ Duration: 300ms
- ✅ Background: #181818
- ✅ Border: 2px gray-700
- ✅ Shadow: shadow-2xl

### 4️⃣ **CONTEÚDO DO HOVER**
- ✅ Backdrop image HD
- ✅ Gradient overlay
- ✅ Botão volume (topo direito)
- ✅ Logo ou título
- ✅ 5 botões de ação
- ✅ Match percentage
- ✅ Classificação etária
- ✅ Gêneros
- ✅ Descrição (3 linhas)
- ✅ Info de episódios

---

## 📦 IMPORTS NECESSÁRIOS:

```tsx
// SeriesPage.tsx
import { motion } from 'motion/react';
import { MovieCard } from './MovieCard';

// MovieCard.tsx
import { useState, useEffect } from 'react';
import { Movie, getImageUrl, getTitle } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';
import { getCachedDetails, extractGenres, extractAgeRating, extractLogoFromDetails } from '../utils/tmdbCache';
```

---

## 🎨 CLASSES CSS IMPORTANTES:

```css
/* Tailwind classes usadas */
.animate-in         /* Animação de entrada */
.fade-in           /* Fade suave */
.zoom-in           /* Zoom de entrada */
.duration-300      /* 300ms */
.shadow-2xl        /* Sombra intensa */
.aspect-[16/9]     /* Ratio 16:9 */
.line-clamp-2      /* Limita 2 linhas */
.line-clamp-3      /* Limita 3 linhas */
```

---

## 🔥 RESUMO TÉCNICO:

| Elemento | Valor |
|----------|-------|
| **Duration** | 300ms |
| **Scale hover** | 1.05 |
| **Opacity outros** | 0.5 |
| **Width expandido** | 390px |
| **Z-index hover** | 100 |
| **Background** | #181818 |
| **Border** | 2px #374151 |
| **Transform origin** | center top |
| **Position** | absolute, centralizado |
| **Aspect ratio** | 16:9 |

---

## ✨ ESSE É O CÓDIGO EXATO!

Use os trechos acima para replicar o efeito hover perfeitamente!

**RedFlix v2.4.0** 🎬
