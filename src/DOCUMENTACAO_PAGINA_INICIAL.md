# 🎬 RedFlix - Documentação Completa da Página Inicial

## 📋 Índice
1. [Visão Geral](#visão-geral)
2. [Estrutura Vertical](#estrutura-vertical)
3. [Componentes Principais](#componentes-principais)
4. [Código Completo](#código-completo)
5. [Estados e Props](#estados-e-props)
6. [Fluxo de Dados](#fluxo-de-dados)
7. [Estilos e Posicionamento](#estilos-e-posicionamento)

---

## 📐 Visão Geral

A página inicial da RedFlix é composta por **7 seções principais** que se empilham verticalmente, criando uma experiência de scroll infinito estilo Netflix.

### **Arquivo Principal**
**`/App.tsx`** (linhas 1770-2050)

### **Tecnologias Utilizadas**
- ⚛️ React + TypeScript
- 🎨 Tailwind CSS v4.0
- 🎬 TMDB API (The Movie Database)
- 🎭 Motion/React (animações)
- 🖼️ OptimizedImage (lazy loading)

---

## 🏗️ Estrutura Vertical

### **Layout Empilhado (de cima para baixo)**

```
┌─────────────────────────────────────────┐
│  1. NetflixHeader (Fixo no topo)       │ top: 0
│     - Logo RedFlix                      │ height: 68px
│     - Menu de navegação                 │
│     - Busca e perfil                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  2. HeroSlider (Banner Principal)       │ top: 0
│     - Slides rotativos                  │ height: 100vh
│     - Filme/série em destaque           │
│     - Botões de ação                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  3. Top10Section                        │ top: calc(100vh + 75px)
│     - Top 10 Brasil em séries           │ height: ~550px
│     - Números grandes                   │
│     - Cards com hover                   │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  4. FeaturedBanners                     │ top: calc(100vh + 625px)
│     - Trailers em destaque              │ height: ~550px
│     - Vídeos do YouTube                 │
│     - Player inline                     │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  5. StreamingLogos                      │ (dentro do FeaturedBanners)
│     - Logos de plataformas              │
│     - Filtro clicável                   │
│     - Scroll horizontal                 │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  6. StreamingMarquee                    │ top: calc(100vh + 1175px)
│     - Logos animados                    │ height: ~450px
│     - Efeito marquee                    │
│     - 2 linhas (ida e volta)            │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  7. ContentRows (Múltiplas Linhas)      │ top: calc(100vh + 1625px)
│     - Destaques do Dia                  │ height: dinâmico
│     - Em Alta Agora                     │
│     - Adicionados Recentemente          │
│     - Mais Assistidos                   │
│     - Categorias por gênero             │
│     - (Ação, Comédia, Drama, etc.)      │
└─────────────────────────────────────────┘
```

---

## 🎯 Componentes Principais

### **1️⃣ NetflixHeader**
**Arquivo:** `/components/NetflixHeader.tsx`

```tsx
import { useState, useEffect } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, UserIcon, MenuIcon, XIcon } from './Icons';
const redflixLogo = 'http://chemorena.com/redfliz.png';

interface NetflixHeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchClick: () => void;
  onProfileClick?: () => void;
  currentUser?: { name: string; avatar?: string } | null;
}

export function NetflixHeader({
  activeCategory,
  onCategoryChange,
  onSearchClick,
  onProfileClick,
  currentUser
}: NetflixHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Início', value: 'home' },
    { label: 'Séries', value: 'Séries' },
    { label: 'Filmes', value: 'Filmes' },
    { label: 'Bombando', value: 'bombando' },
    { label: 'Navegar por idiomas', value: 'languages' },
    { label: 'Canais', value: 'canais' },
    { label: 'Futebol', value: 'futebol' },
    { label: 'Minha lista', value: 'my-list' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-12 h-16 md:h-[68px]">
          {/* Logo + Menu */}
          <div className="flex items-center gap-3 md:gap-10">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden text-white p-1"
              aria-label="Menu"
            >
              {showMobileMenu ? <XIcon className="w-6 h-6" size={24} /> : <MenuIcon className="w-6 h-6" size={24} />}
            </button>

            {/* Logo RedFlix */}
            <img
              src={redflixLogo}
              alt="RedFlix"
              className="h-6 md:h-8 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onCategoryChange('redflix-originals')}
              title="RedFlix Originais"
            />

            {/* Navigation Menu - Desktop */}
            <nav className="hidden lg:flex items-center gap-5">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onCategoryChange(item.value)}
                  className={`text-sm transition-colors ${
                    activeCategory === item.value
                      ? 'text-white font-semibold'
                      : 'text-gray-300 hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Search */}
            <button
              onClick={onSearchClick}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Buscar"
            >
              <SearchIcon className="w-5 h-5 md:w-6 md:h-6" size={24} />
            </button>

            {/* Kids */}
            <button
              onClick={() => onCategoryChange('kids')}
              className="hidden md:block text-white hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Infantil
            </button>

            {/* Notifications */}
            <button
              className="hidden sm:block text-white hover:text-gray-300 transition-colors relative"
              aria-label="Notificações"
            >
              <BellIcon className="w-5 h-5 md:w-6 md:h-6" size={24} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E50914] rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1 md:gap-2 group"
                aria-label="Perfil"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 md:w-8 md:h-8 rounded"
                  />
                ) : (
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-[#E50914] rounded flex items-center justify-center">
                    <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-white" size={20} />
                  </div>
                )}
                <ChevronDownIcon className="hidden md:block w-4 h-4 text-white group-hover:rotate-180 transition-transform" size={16} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-4 w-56 bg-black/95 border border-gray-700 rounded py-2 shadow-xl">
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm">
                    👤 Meu Perfil
                  </button>
                  <button className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm">
                    ⚙️ Configurações
                  </button>
                  <hr className="border-gray-700 my-2" />
                  <button 
                    onClick={onProfileClick}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-black/95 border-t border-gray-800">
            <nav className="flex flex-col p-4 space-y-3">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    onCategoryChange(item.value);
                    setShowMobileMenu(false);
                  }}
                  className={`text-left py-2 transition-colors ${
                    activeCategory === item.value
                      ? 'text-white font-semibold'
                      : 'text-gray-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
```

**Características:**
- ✅ Fixo no topo (`position: fixed`)
- ✅ Muda de transparente para sólido ao rolar (`isScrolled`)
- ✅ Logo RedFlix clicável
- ✅ Menu responsivo (mobile e desktop)
- ✅ Dropdown de perfil
- ✅ Ícones de busca e notificações

---

### **2️⃣ HeroSlider**
**Arquivo:** `/components/HeroSlider.tsx`

```tsx
import { useState, useEffect } from 'react';
import { Movie } from '../utils/tmdb';
import { HERO_SLIDES, HeroSlide, fetchHeroSlides } from '../utils/heroContent';

interface HeroSliderProps {
  onMovieClick: (movie: Movie) => void;
  sidebarCollapsed: boolean;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  myList?: number[];
  likedList?: number[];
  watchLaterList?: number[];
}

export function HeroSlider({
  onMovieClick,
  sidebarCollapsed,
  onAddToList,
  onLike,
  onWatchLater,
  myList = [],
  likedList = [],
  watchLaterList = []
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>(HERO_SLIDES);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Buscar slides do TMDB
  useEffect(() => {
    const loadSlides = async () => {
      const tmdbSlides = await fetchHeroSlides();
      if (tmdbSlides.length > 0) {
        setSlides(tmdbSlides);
      }
    };
    loadSlides();
  }, []);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Mudar slide a cada 7 segundos

    return () => clearInterval(timer);
  }, [isAutoPlaying, slides.length]);

  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Background Image com Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${currentSlideData.image})`,
        }}
      >
        {/* Overlay gradiente */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 h-full flex items-center px-4 md:px-12 lg:px-16">
        <div className="max-w-2xl">
          {/* Logo do filme/série */}
          {currentSlideData.logo && (
            <img
              src={currentSlideData.logo}
              alt={currentSlideData.title}
              className="w-full max-w-md mb-6 drop-shadow-2xl"
            />
          )}

          {/* Título (se não tiver logo) */}
          {!currentSlideData.logo && (
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
              {currentSlideData.title}
            </h1>
          )}

          {/* Gêneros */}
          <div className="flex gap-2 mb-4">
            {currentSlideData.genres.slice(0, 3).map((genre, index) => (
              <span key={genre} className="text-white text-lg">
                {genre}
                {index < 2 && ' • '}
              </span>
            ))}
          </div>

          {/* Descrição */}
          <p className="text-white text-lg md:text-xl mb-8 line-clamp-3 drop-shadow-lg max-w-xl">
            {currentSlideData.description}
          </p>

          {/* Botões de Ação */}
          <div className="flex gap-4">
            {/* Botão Assistir */}
            <button
              onClick={() => onMovieClick(currentSlideData as any)}
              className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded flex items-center gap-2 transition-all hover:scale-105 font-semibold"
            >
              <PlayIcon className="w-6 h-6" />
              Assistir
            </button>

            {/* Botão Mais Info */}
            <button
              onClick={() => onMovieClick(currentSlideData as any)}
              className="bg-gray-500/70 hover:bg-gray-500/90 text-white px-8 py-3 rounded flex items-center gap-2 transition-all hover:scale-105 font-semibold backdrop-blur-sm"
            >
              <InfoIcon className="w-6 h-6" />
              Mais Info
            </button>
          </div>
        </div>
      </div>

      {/* Indicadores de Slide */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              setIsAutoPlaying(false);
            }}
            className={`h-1 rounded-full transition-all ${
              index === currentSlide
                ? 'w-12 bg-white'
                : 'w-8 bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
```

**Características:**
- ✅ Altura de tela cheia (`height: 100vh`)
- ✅ Auto-play com timer de 7 segundos
- ✅ Gradiente overlay (esquerda → direita, baixo → cima)
- ✅ Logo do filme/série (quando disponível)
- ✅ Botões "Assistir" e "Mais Info"
- ✅ Indicadores de slide

---

### **3️⃣ Top10Section**
**Arquivo:** `/components/Top10Section.tsx`

```tsx
import { useState, useEffect } from 'react';
import { Movie, getImageUrl } from '../utils/tmdb';

export function Top10Section({ 
  title, 
  movies, 
  onMovieClick 
}: { 
  title: string; 
  movies: Movie[]; 
  onMovieClick: (movie: Movie) => void;
}) {
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const top10Movies = movies.slice(0, 10);

  return (
    <div className="relative w-full py-12 bg-gradient-to-b from-black via-black to-transparent">
      {/* Header */}
      <div className="px-8 mb-6">
        <h2 className="text-white font-['Inter:Bold',sans-serif] text-[28px] mb-2">
          {title}
        </h2>
        <p className="text-white/60 text-[14px]">
          Top 10 do Brasil esta semana
        </p>
      </div>

      {/* Grid de Cards */}
      <div className="relative overflow-x-auto">
        <div className="flex gap-4 px-8 pb-4">
          {top10Movies.map((movie, index) => (
            <div
              key={movie.id}
              className="relative flex-shrink-0 cursor-pointer group"
              style={{ width: '240px' }}
              onMouseEnter={() => setHoveredMovie(index)}
              onMouseLeave={() => setHoveredMovie(null)}
              onClick={() => onMovieClick(movie)}
            >
              {/* Número Grande */}
              <div className="absolute left-0 bottom-0 z-10 pointer-events-none">
                <div
                  className="font-['Inter:Black',sans-serif] text-[220px] leading-none"
                  style={{
                    WebkitTextStroke: '2px white',
                    WebkitTextFillColor: 'transparent',
                    textShadow: '0 0 20px rgba(0,0,0,0.8)',
                  }}
                >
                  {index + 1}
                </div>
              </div>

              {/* Imagem do Filme */}
              <div className="relative ml-16 rounded-lg overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-110">
                <img
                  src={getImageUrl(movie.poster_path, 'w342')}
                  alt={movie.title || movie.name || ''}
                  className="w-full h-auto aspect-[2/3] object-cover"
                />

                {/* Overlay no hover */}
                {hoveredMovie === index && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity">
                    <PlayIcon className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Características:**
- ✅ Top 10 filmes/séries
- ✅ Números grandes em stroke
- ✅ Scroll horizontal
- ✅ Hover com overlay e play icon
- ✅ Posicionamento absoluto dos números

---

### **4️⃣ FeaturedBanners**
**Arquivo:** `/components/FeaturedBanners.tsx`

```tsx
import { useState } from 'react';
import { motion } from '../utils/motion-stub';

interface TrailerBanner {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  youtubeId: string;
  thumbnail: string;
}

const trailerBanners: TrailerBanner[] = [
  {
    id: 1,
    title: 'Trailer 1',
    subtitle: 'Ação • Aventura • Épico',
    badge: 'NOVO TRAILER',
    youtubeId: 'U8aTTyYfVOE',
    thumbnail: 'https://img.youtube.com/vi/U8aTTyYfVOE/maxresdefault.jpg'
  },
  {
    id: 2,
    title: 'Trailer 2',
    subtitle: 'Drama • Suspense • Emocionante',
    badge: 'EM BREVE',
    youtubeId: 'OD6kUZwMOjQ',
    thumbnail: 'https://img.youtube.com/vi/OD6kUZwMOjQ/maxresdefault.jpg'
  },
  {
    id: 3,
    title: 'Trailer 3',
    subtitle: 'Ficção • Fantasia • Aventura',
    badge: 'LANÇAMENTO',
    youtubeId: 'YoFKWWtIHSc',
    thumbnail: 'https://img.youtube.com/vi/YoFKWWtIHSc/maxresdefault.jpg'
  }
];

export function FeaturedBanners() {
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

  return (
    <div className="relative w-full pt-12 pb-8 bg-gradient-to-b from-[#141414] via-black to-black">
      {/* Header */}
      <div className="px-8 mb-6">
        <h2 className="text-white font-['Inter:Bold',sans-serif] text-[28px] mb-2">
          Trailers em Destaque
        </h2>
        <p className="text-white/60 text-[14px]">
          Assista aos trailers mais quentes do momento
        </p>
      </div>

      {/* Grid de Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-8">
        {trailerBanners.map((banner) => (
          <motion.div
            key={banner.id}
            onMouseEnter={() => setHoveredVideo(banner.id)}
            onMouseLeave={() => setHoveredVideo(null)}
            className="group relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-xl overflow-hidden border border-white/10 hover:border-[#E50914]/50 transition-all duration-500 hover:scale-[1.02] cursor-pointer shadow-2xl hover:shadow-[#E50914]/30"
            style={{ height: '280px' }}
          >
            {playingVideo === banner.id ? (
              // Player do YouTube
              <iframe
                src={`https://www.youtube.com/embed/${banner.youtubeId}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                {/* Thumbnail */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${banner.thumbnail})`,
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Badge */}
                <div className="absolute top-4 right-4 bg-[#E50914] text-white text-xs font-bold px-3 py-1 rounded-full">
                  {banner.badge}
                </div>

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setPlayingVideo(banner.id)}
                    className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white hover:scale-110 transition-transform"
                  >
                    <PlayIcon className="w-10 h-10 text-white fill-white ml-1" />
                  </button>
                </div>

                {/* Conteúdo */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-white font-bold text-xl mb-1">{banner.title}</h3>
                  <p className="text-white/70 text-sm">{banner.subtitle}</p>
                </div>
              </>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

**Características:**
- ✅ 3 banners de trailers
- ✅ Thumbnails do YouTube
- ✅ Player inline ao clicar
- ✅ Hover com scale
- ✅ Badge de destaque
- ✅ Gradient overlay

---

### **5️⃣ StreamingLogos**
**Arquivo:** `/components/StreamingLogos.tsx`

```tsx
import { useRef, useState } from 'react';

interface StreamingPlatform {
  id: number;
  name: string;
  logo: string;
  provider_id?: number;
}

const streamingPlatforms: StreamingPlatform[] = [
  { id: 1, name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png', provider_id: 8 },
  { id: 2, name: 'Amazon Prime Video', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png', provider_id: 9 },
  { id: 3, name: 'Disney+', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/640px-Disney%2B_logo.svg.png', provider_id: 337 },
  { id: 4, name: 'HBO Max', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg', provider_id: 384 },
  { id: 5, name: 'Apple TV+', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg', provider_id: 350 },
  { id: 6, name: 'Paramount+', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg', provider_id: 531 },
  { id: 7, name: 'Star+', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Star%2B_logo.svg/1280px-Star%2B_logo.svg.png', provider_id: 619 },
  { id: 8, name: 'Globoplay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Globoplay_2018.svg/2560px-Globoplay_2018.svg.png', provider_id: 307 }
];

export function StreamingLogos({ onPlatformSelect }: { onPlatformSelect?: (providerId: number, platformName: string) => void }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<number | null>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handlePlatformClick = (platform: StreamingPlatform) => {
    const isAlreadySelected = selectedPlatform === platform.id;

    if (isAlreadySelected) {
      setSelectedPlatform(null);
      onPlatformSelect?.(0, '');
    } else {
      setSelectedPlatform(platform.id);
      onPlatformSelect?.(platform.provider_id || 0, platform.name);
    }
  };

  return (
    <div className="relative w-full py-8 bg-black">
      {/* Header */}
      <div className="px-8 mb-6">
        <h3 className="text-white font-['Inter:Semi_Bold',sans-serif] text-[20px]">
          Filtrar por Plataforma
        </h3>
      </div>

      {/* Scroll Container */}
      <div className="relative group">
        {/* Botão Esquerdo */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeftIcon className="w-6 h-6" />
        </button>

        {/* Logos */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 px-8 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {streamingPlatforms.map((platform) => (
            <div
              key={platform.id}
              onClick={() => handlePlatformClick(platform)}
              className={`flex-shrink-0 cursor-pointer transition-all duration-300 ${
                selectedPlatform === platform.id
                  ? 'scale-110 ring-4 ring-[#E50914]'
                  : 'hover:scale-105'
              }`}
            >
              <div className="w-32 h-20 bg-white rounded-lg flex items-center justify-center p-3">
                <img
                  src={platform.logo}
                  alt={platform.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Botão Direito */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronRightIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
```

**Características:**
- ✅ 8 plataformas de streaming
- ✅ Scroll horizontal com botões
- ✅ Seleção com ring vermelho
- ✅ Filtro de conteúdo por plataforma
- ✅ Hover com scale

---

### **6️⃣ StreamingMarquee**
**Arquivo:** `/components/StreamingMarquee.tsx`

```tsx
const streamingPlatforms = [
  { id: 1, name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png' },
  { id: 2, name: 'Amazon Prime Video', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png' },
  { id: 3, name: 'Disney+', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/640px-Disney%2B_logo.svg.png' },
  { id: 4, name: 'HBO Max', logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg' },
  { id: 5, name: 'Apple TV+', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
  { id: 6, name: 'Paramount+', logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg' },
  { id: 7, name: 'Star+', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Star%2B_logo.svg/1280px-Star%2B_logo.svg.png' },
  { id: 8, name: 'Globoplay', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Globoplay_2018.svg/2560px-Globoplay_2018.svg.png' }
];

const duplicatedPlatforms = [...streamingPlatforms, ...streamingPlatforms, ...streamingPlatforms];

export function StreamingMarquee() {
  return (
    <div className="relative w-full py-12 overflow-hidden bg-black">
      {/* Gradient Fade Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-black to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-black to-transparent" />

      {/* Marquee Row 1 - Left to Right */}
      <div className="relative flex overflow-hidden">
        <div className="flex gap-8 items-center animate-marquee">
          {duplicatedPlatforms.map((platform, index) => (
            <div
              key={`row1-${platform.id}-${index}`}
              className="flex-shrink-0 w-36 h-24 bg-white rounded-lg flex items-center justify-center p-4 hover:scale-110 transition-transform"
            >
              <img
                src={platform.logo}
                alt={platform.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Marquee Row 2 - Right to Left */}
      <div className="relative flex overflow-hidden mt-8">
        <div className="flex gap-8 items-center animate-marquee-reverse">
          {duplicatedPlatforms.slice().reverse().map((platform, index) => (
            <div
              key={`row2-${platform.id}-${index}`}
              className="flex-shrink-0 w-36 h-24 bg-white rounded-lg flex items-center justify-center p-4 hover:scale-110 transition-transform"
            >
              <img
                src={platform.logo}
                alt={platform.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

**CSS para Animação:**
```css
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.333%);
  }
}

@keyframes marquee-reverse {
  0% {
    transform: translateX(-33.333%);
  }
  100% {
    transform: translateX(0);
  }
}

.animate-marquee {
  animation: marquee 30s linear infinite;
}

.animate-marquee-reverse {
  animation: marquee-reverse 30s linear infinite;
}
```

**Características:**
- ✅ 2 linhas de logos
- ✅ Animação infinita
- ✅ Linha 1: esquerda → direita
- ✅ Linha 2: direita → esquerda
- ✅ Gradient fade nas bordas
- ✅ Hover com scale

---

### **7️⃣ ContentRow**
**Arquivo:** `/components/ContentRow.tsx`

```tsx
import { useState } from 'react';
import { Movie } from '../utils/tmdb';
import { MovieCard } from './MovieCard';
import { motion } from '../utils/motion-stub';

interface ContentRowProps {
  title: string;
  content: Movie[];
  onMovieClick: (movie: Movie) => void;
  maxItems?: number;
  showViewAll?: boolean;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  myList?: number[];
  likedList?: number[];
  watchLaterList?: number[];
}

export function ContentRow({
  title,
  content,
  onMovieClick,
  maxItems,
  showViewAll = true,
  onAddToList,
  onLike,
  onWatchLater,
  myList = [],
  likedList = [],
  watchLaterList = []
}: ContentRowProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (content.length === 0) return null;

  const displayContent = maxItems ? content.slice(0, maxItems) : content;

  return (
    <div className="mb-8 md:mb-12">
      {/* Row Title */}
      <div className="flex items-center justify-between mb-3 md:mb-4 px-4 md:px-2">
        <h2 className="text-white font-['Inter:Bold',sans-serif] text-lg md:text-xl lg:text-[24px]">
          {title}
        </h2>
        {showViewAll && maxItems && content.length > maxItems && (
          <button className="text-red-600 hover:text-red-500 transition-colors flex items-center gap-1 group">
            <span className="font-['Inter:Medium',sans-serif] text-xs md:text-[14px]">
              Ver tudo ({content.length})
            </span>
            <ChevronRight size={16} className="md:w-[18px] md:h-[18px] group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Content Grid with Blur Effect on Siblings */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6 px-4 md:px-2">
        {displayContent.map((item) => (
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
              isInList={myList.includes(item.id)}
              isLiked={likedList.includes(item.id)}
              isInWatchLater={watchLaterList.includes(item.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
```

**Características:**
- ✅ Grid responsivo (2-7 colunas)
- ✅ Blur nos cards vizinhos ao hover
- ✅ Botão "Ver tudo" com contador
- ✅ Usa MovieCard com efeito hover completo
- ✅ Animação com Motion

---

## 🔧 Código Principal - App.tsx

### **Renderização da Página Inicial**

```tsx
// /App.tsx (linhas 1770-2050)

return (
  <div className="bg-[#141414] relative w-full min-h-screen overflow-x-hidden">
    {/* Performance Monitor */}
    <PerformanceMonitor />
    
    {/* Netflix Header */}
    <NetflixHeader
      activeCategory={activeCategory}
      onCategoryChange={handleCategoryChange}
      onSearchClick={() => setShowSearchOverlay(true)}
      onProfileClick={() => setCurrentScreen('login')}
      currentUser={currentUser}
    />
    
    {/* Hero Slider */}
    <HeroSlider 
      onMovieClick={handleMovieClick} 
      sidebarCollapsed={false}
      onAddToList={handleAddToList}
      onLike={handleLike}
      onWatchLater={handleWatchLater}
      myList={myList}
      likedList={likedList}
      watchLaterList={watchLaterList}
    />
    
    {/* TOP 10 Section */}
    {activeCategory === 'Início' && !loading && (
      <div 
        className="absolute z-10 left-0 right-0"
        style={{ top: 'calc(100vh + 75px)' }}
      >
        <div className="bg-gradient-to-b from-black via-black to-transparent pb-12">
          {top10BrasilSeries.length > 0 && (
            <Top10Section
              title="Brasil: top 10 em séries hoje"
              movies={top10BrasilSeries}
              onMovieClick={handleMovieClick}
            />
          )}
        </div>
      </div>
    )}
    
    {/* Featured Banners + Streaming Logos */}
    <div 
      className="absolute z-10 left-0 right-0" 
      style={{ 
        top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
          ? 'calc(100vh + 625px)' 
          : '100vh'
      }}
    >
      <FeaturedBanners />
      <StreamingLogos 
        onPlatformSelect={(providerId, platformName) => {
          setSelectedProvider(providerId);
          setSelectedProviderName(platformName);
        }}
      />
    </div>

    {/* Streaming Marquee */}
    <div 
      className="absolute z-10 left-0 right-0"
      style={{ 
        top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
          ? 'calc(100vh + 1175px)' 
          : 'calc(100vh + 550px)'
      }}
    >
      <StreamingMarquee />
    </div>
    
    {/* Content Rows */}
    <div 
      className="absolute pb-24 md:pb-20 px-0 md:px-4 lg:px-12 left-0 right-0" 
      style={{ 
        top: activeCategory === 'Início' && !loading && top10BrasilSeries.length > 0
          ? 'calc(100vh + 1625px)' 
          : 'calc(100vh + 1000px)' 
      }}
    >
      {loading ? (
        // Loading State
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
          <p className="text-white text-center mt-4">Carregando catálogo...</p>
        </div>
      ) : filteredContent.length > 0 ? (
        <div>
          {/* Header com contador */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
                {activeCategory === 'Filmes' ? 'Filmes' : 
                 activeCategory === 'Séries' ? 'Séries' : 
                 'Catálogo Completo'}
              </h2>
              <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
                {activeCategory === 'Filmes' ? `${movies.length} filmes disponíveis` : 
                 activeCategory === 'Séries' ? `${series.length} séries disponíveis` : 
                 `${allContent.length} títulos no catálogo`}
              </p>
            </div>
          </div>

          {/* Content Rows por categoria */}
          {activeCategory === 'Início' && sortedGenres.length > 0 ? (
            <div className="space-y-12">
              {/* Destaques do dia */}
              <ContentRow 
                title="Destaques do Dia"
                content={allContent.slice(0, 18)}
                onMovieClick={handleMovieClick}
                maxItems={18}
                onAddToList={handleAddToList}
                onLike={handleLike}
                onWatchLater={handleWatchLater}
                myList={myList}
                likedList={likedList}
                watchLaterList={watchLaterList}
              />
              
              {/* Em Alta Agora */}
              <ContentRow 
                title="Em Alta Agora"
                content={allContent.slice(18, 36)}
                onMovieClick={handleMovieClick}
                maxItems={18}
                onAddToList={handleAddToList}
                onLike={handleLike}
                onWatchLater={handleWatchLater}
                myList={myList}
                likedList={likedList}
                watchLaterList={watchLaterList}
              />
              
              {/* Adicionados Recentemente */}
              <ContentRow 
                title="Adicionados Recentemente"
                content={allContent.slice(36, 54)}
                onMovieClick={handleMovieClick}
                maxItems={18}
                onAddToList={handleAddToList}
                onLike={handleLike}
                onWatchLater={handleWatchLater}
                myList={myList}
                likedList={likedList}
                watchLaterList={watchLaterList}
              />
              
              {/* Mais Assistidos */}
              <ContentRow 
                title="Mais Assistidos"
                content={allContent.slice(54, 72)}
                onMovieClick={handleMovieClick}
                maxItems={18}
                onAddToList={handleAddToList}
                onLike={handleLike}
                onWatchLater={handleWatchLater}
                myList={myList}
                likedList={likedList}
                watchLaterList={watchLaterList}
              />
              
              {/* Fileiras por gênero */}
              {sortedGenres.map(([genre, content]) => (
                <ContentRow 
                  key={genre}
                  title={genre}
                  content={content}
                  onMovieClick={handleMovieClick}
                  maxItems={18}
                  showViewAll={true}
                  onAddToList={handleAddToList}
                  onLike={handleLike}
                  onWatchLater={handleWatchLater}
                  myList={myList}
                  likedList={likedList}
                  watchLaterList={watchLaterList}
                />
              ))}
            </div>
          ) : (
            // Página de Filmes/Séries específicas
            <div className="space-y-12">
              {sortedGenres.map(([genre, content]) => (
                <ContentRow 
                  key={genre}
                  title={genre}
                  content={content}
                  onMovieClick={handleMovieClick}
                  showViewAll={false}
                  onAddToList={handleAddToList}
                  onLike={handleLike}
                  onWatchLater={handleWatchLater}
                  myList={myList}
                  likedList={likedList}
                  watchLaterList={watchLaterList}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/50 text-xl">Nenhum conteúdo encontrado</p>
        </div>
      )}
    </div>
  </div>
);
```

---

## 📊 Estados e Props

### **Estados Principais do App.tsx**

```tsx
// Navegação
const [currentScreen, setCurrentScreen] = useState('login');
const [isAuthenticated, setIsAuthenticated] = useState(false);

// Conteúdo
const [allContent, setAllContent] = useState<Movie[]>([]);
const [topShows, setTopShows] = useState<Movie[]>([]);
const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
const [activeCategory, setActiveCategory] = useState('Início');

// Busca
const [searchQuery, setSearchQuery] = useState('');
const [showSearchOverlay, setShowSearchOverlay] = useState(false);

// Loading
const [loading, setLoading] = useState(true);
const [loadingProgress, setLoadingProgress] = useState(0);
const [error, setError] = useState<string | null>(null);

// Modal
const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
const [selectedPerson, setSelectedPerson] = useState<{ id: number; name: string } | null>(null);

// Player
const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);

// Listas do usuário (localStorage)
const [myList, setMyList] = useState<number[]>([]);
const [likedList, setLikedList] = useState<number[]>([]);
const [watchLaterList, setWatchLaterList] = useState<number[]>([]);

// Top 10
const [top10BrasilSeries, setTop10BrasilSeries] = useState<Movie[]>([]);
const [top10Trending, setTop10Trending] = useState<Movie[]>([]);

// Filtros
const [selectedProvider, setSelectedProvider] = useState<number>(0);
const [selectedProviderName, setSelectedProviderName] = useState<string>('');
```

---

## 🔄 Fluxo de Dados

### **1. Carregamento de Conteúdo**

```
App.tsx (useEffect)
  ↓
loadAllContent() (TMDB API)
  ↓
Filmes + Séries combinados
  ↓
setAllContent([...])
  ↓
Organização por gênero
  ↓
ContentRows renderizadas
```

### **2. Clique em um Card**

```
MovieCard (onClick)
  ↓
ContentRow (onMovieClick)
  ↓
App.tsx (handleMovieClick)
  ↓
setSelectedMovie(movie)
  ↓
MovieDetails renderizado
```

### **3. Adicionar à Minha Lista**

```
MovieCard (onAddToList)
  ↓
ContentRow (onAddToList)
  ↓
App.tsx (handleAddToList)
  ↓
setMyList([...myList, movieId])
  ↓
localStorage.setItem('redflix_mylist', ...)
```

---

## 🎨 Estilos e Posicionamento

### **Classes Tailwind Principais**

```css
/* Background */
bg-[#141414]  /* Preto Netflix */
bg-black      /* Preto puro */

/* Cores RedFlix */
bg-[#E50914]  /* Vermelho principal */
bg-[#C41A23]  /* Vermelho hover */
bg-[#B20710]  /* Vermelho escuro */

/* Textos */
text-white
text-white/50
text-white/60
text-gray-300
text-gray-400

/* Fontes */
font-['Inter:Bold',sans-serif]
font-['Inter:Semi_Bold',sans-serif]
font-['Inter:Medium',sans-serif]
font-['Inter:Regular',sans-serif]

/* Grid Responsivo */
grid-cols-2           /* Mobile */
sm:grid-cols-3        /* Tablet pequeno */
md:grid-cols-4        /* Tablet */
lg:grid-cols-5        /* Desktop */
xl:grid-cols-6        /* Desktop grande */
2xl:grid-cols-7       /* 4K */

/* Transições */
transition-all duration-300
transition-colors
transition-transform
transition-opacity

/* Hover Effects */
hover:scale-105
hover:scale-110
hover:bg-[#C41A23]
hover:text-gray-200
group-hover:opacity-100
group-hover:scale-110

/* Gradientes */
bg-gradient-to-b from-black via-black to-transparent
bg-gradient-to-r from-[#E50914] to-[#B20710]
bg-gradient-to-t from-black via-transparent to-transparent
```

### **Posicionamento Absoluto**

```tsx
// Todas as seções usam position: absolute com cálculo dinâmico

// Top 10
style={{ top: 'calc(100vh + 75px)' }}

// Featured Banners
style={{ top: 'calc(100vh + 625px)' }}

// Streaming Marquee
style={{ top: 'calc(100vh + 1175px)' }}

// Content Rows
style={{ top: 'calc(100vh + 1625px)' }}
```

---

## 📱 Responsividade

### **Breakpoints**

```css
/* Mobile First */
default: < 640px
sm:      640px+    (Tablet pequeno)
md:      768px+    (Tablet)
lg:      1024px+   (Desktop)
xl:      1280px+   (Desktop grande)
2xl:     1536px+   (4K)
```

### **Adaptações Mobile**

```tsx
// Header
h-16 md:h-[68px]           /* Altura menor no mobile */
px-4 md:px-12              /* Padding menor no mobile */
text-sm md:text-base       /* Textos menores */

// Hero Slider
text-5xl md:text-7xl       /* Título menor */
px-4 md:px-12 lg:px-16     /* Padding responsivo */

// Content Grid
grid-cols-2                /* 2 colunas no mobile */
gap-3 md:gap-4 lg:gap-6    /* Gaps menores */

// Top 10
flex gap-4                 /* Scroll horizontal */
overflow-x-auto            /* Permite scroll */
```

---

## 🎯 Resumo de Arquivos

### **Componentes da Página Inicial**

| Arquivo | Linhas | Função |
|---------|--------|--------|
| `/App.tsx` | 2050 | Componente principal e orquestração |
| `/components/NetflixHeader.tsx` | 300 | Menu superior fixo |
| `/components/HeroSlider.tsx` | 400 | Banner principal rotativo |
| `/components/Top10Section.tsx` | 250 | Top 10 do Brasil |
| `/components/FeaturedBanners.tsx` | 300 | Trailers em destaque |
| `/components/StreamingLogos.tsx` | 200 | Filtro de plataformas |
| `/components/StreamingMarquee.tsx` | 150 | Logos animados |
| `/components/ContentRow.tsx` | 100 | Linha de conteúdo |
| `/components/MovieCard.tsx` | 530 | Card individual com hover |

### **Utilitários**

| Arquivo | Função |
|---------|--------|
| `/utils/tmdb.ts` | API do TMDB |
| `/utils/heroContent.ts` | Slides do hero |
| `/utils/primeVicioLoader.ts` | Carregamento de conteúdo |
| `/utils/motion-stub.ts` | Animações |
| `/utils/imageCache.ts` | Cache de imagens |

---

## ✅ Checklist de Implementação

- [x] NetflixHeader (menu superior)
- [x] HeroSlider (banner principal)
- [x] Top10Section (top 10 Brasil)
- [x] FeaturedBanners (trailers)
- [x] StreamingLogos (filtro)
- [x] StreamingMarquee (logos animados)
- [x] ContentRow (linhas de conteúdo)
- [x] MovieCard (cards com hover)
- [x] Grid responsivo
- [x] Blur nos vizinhos ao hover
- [x] Loading state
- [x] Error handling
- [x] LocalStorage para listas
- [x] Integração TMDB
- [x] Player de vídeo
- [x] Busca de conteúdo
- [x] Filtro por plataforma
- [x] Filtro por gênero
- [x] Mobile responsivo

---

**Desenvolvido com ❤️ para RedFlix - Plataforma de Streaming**

**Data:** Novembro 2024
**Versão:** 2.0
**Tecnologia:** React + TypeScript + Tailwind CSS + TMDB API
