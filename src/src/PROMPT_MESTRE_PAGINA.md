# 🎯 PROMPT MESTRE - CRIAR PÁGINA TEMÁTICA REDFLIX

## 📋 TEMPLATE UNIVERSAL PARA CRIAR PÁGINAS ESTILO SOCCERPAGE

---

## 🎬 PROMPT BASE

```
Crie uma página completa para a plataforma RedFlix sobre [TEMA], seguindo EXATAMENTE o mesmo padrão, layout e funcionalidades da página de Futebol (SoccerPage.tsx). A página deve ser idêntica em estrutura, design e interatividade.

## 📐 ESTRUTURA OBRIGATÓRIA DA PÁGINA

### 1. IMPORTS E CONFIGURAÇÃO INICIAL
```typescript
import React, { useEffect, useState, useRef } from "react";
import { NetflixHeader } from './NetflixHeader';
import { ArrowLeftIcon, [ÍCONES_ESPECÍFICOS] } from './Icons';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { ImageWithFallback } from './figma/ImageWithFallback';
```

### 2. INTERFACE E PROPS
```typescript
interface [Nome]PageProps {
  onClose?: () => void;
}

export function [Nome]Page({ onClose }: [Nome]PageProps) {
  // Estados principais
  const [loading, setLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [data1, setData1] = useState<any[]>([]);
  const [data2, setData2] = useState<any[]>([]);
  // ... outros estados conforme necessário
  
  // Refs para navegação rápida (scroll suave)
  const section1Ref = useRef<HTMLDivElement>(null);
  const section2Ref = useRef<HTMLDivElement>(null);
  // ... outras refs
  
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;
}
```

### 3. HERO BANNER COM VÍDEO YOUTUBE (OBRIGATÓRIO)
```typescript
{/* Hero Banner - YouTube Video - Full Width */}
<div className="relative overflow-hidden">
  {/* Video Container - 16:9 Aspect Ratio */}
  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
    {/* YouTube Iframe com autoplay mute loop */}
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src="https://www.youtube.com/embed/[VIDEO_ID]?autoplay=1&mute=1&loop=1&playlist=[VIDEO_ID]&controls=0&modestbranding=1&showinfo=0&rel=0&disablekb=1&fs=0&playsinline=1&iv_load_policy=3"
      title="[TÍTULO] - RedFlix"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      style={{ pointerEvents: 'none' }}
    />
    
    {/* Overlay Gradients - EXATAMENTE como SoccerPage */}
    {/* Gradient Top - extends header */}
    <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/70 to-transparent z-10 pointer-events-none" />
    
    {/* Gradient Bottom */}
    <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none" />
    
    {/* Side Vignette - Left */}
    <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none" />
    
    {/* Side Vignette - Right */}
    <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/50 to-transparent z-10 pointer-events-none" />
    
    {/* Content Overlay - z-20 */}
    <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
      <div className="max-w-6xl mx-auto text-center space-y-6">
        {/* Ícone/Logo SVG Personalizado */}
        <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-4">
          {/* SVG customizado do tema */}
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-2xl">
          [TÍTULO PRINCIPAL]
        </h1>

        {/* Subtitle */}
        <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFD700] drop-shadow-xl">
          [SUBTÍTULO]
        </div>

        {/* Stats Pills - 3 cards interativos */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-6 pointer-events-auto">
          <div className="flex items-center gap-3 bg-black/80 backdrop-blur-lg px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-[#FFD700]/40 shadow-2xl hover:border-[#FFD700] transition-all duration-300 hover:scale-105">
            <[ÍCONE] className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
            <span className="font-black text-white text-base md:text-lg">[STAT 1]</span>
          </div>
          {/* Repetir para 2 mais stats */}
        </div>
      </div>
    </div>
  </div>
</div>
```

### 4. MOBILE QUICK ACTION BAR (OBRIGATÓRIO)
```typescript
{/* Mobile Quick Action Bar - Sticky Top */}
<div className="md:hidden sticky top-16 z-40 bg-gradient-to-r from-[COR1] via-[COR2] to-[COR3] shadow-lg">
  <div className="flex items-center justify-around py-2 px-2">
    {/* 4-6 botões de navegação rápida */}
    <button
      onClick={() => section1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/20 transition-all active:scale-95"
    >
      <[ÍCONE] className="w-5 h-5 text-black" />
      <span className="text-[9px] font-bold text-black">[LABEL]</span>
    </button>
    {/* Repetir para outras seções */}
  </div>
</div>
```

### 5. SEÇÕES DE CONTEÚDO (MÍNIMO 6 SEÇÕES)

#### 5.1 Primeira Seção - Grid 2 Colunas
```typescript
<div ref={section1Ref} className="px-4 md:px-12 pt-12 pb-8 scroll-mt-32">
  <div className="flex items-center gap-3 mb-8">
    <[ÍCONE] className="w-7 h-7 text-[#FFD700]" />
    <h2 className="text-3xl font-bold text-white">[TÍTULO DA SEÇÃO]</h2>
  </div>

  {data.length === 0 ? (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
      <[ÍCONE] className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-300 text-lg">Nenhum dado disponível</p>
    </div>
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {data.map((item) => (
        <div
          key={item.id}
          className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/20"
        >
          {/* Conteúdo do card */}
        </div>
      ))}
    </div>
  )}
</div>
```

#### 5.2 Quick Stats Section (4 Cards)
```typescript
<div className="px-4 md:px-12 py-8">
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
    {/* 4 cards de estatísticas */}
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#FFD700]/50 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
          <[ÍCONE] className="w-6 h-6 text-[#FFD700]" />
        </div>
      </div>
      <div className="text-4xl font-black text-white mb-1">[NÚMERO]</div>
      <div className="text-sm text-gray-300">[DESCRIÇÃO]</div>
    </div>
    {/* Repetir 3x */}
  </div>
</div>
```

#### 5.3 Live/Destaque Section (Se aplicável)
```typescript
{condicao && (
  <div ref={liveRef} className="relative px-4 md:px-12 mb-16 scroll-mt-32">
    <div className="bg-gradient-to-br from-red-600/20 via-red-500/10 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-500/50 shadow-2xl animate-pulse-slow">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute"></div>
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white">🔴 [TÍTULO DESTAQUE]</h2>
        <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
          LIVE
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cards de destaque */}
      </div>
    </div>
  </div>
)}
```

#### 5.4 Grid de Cards/Items (3-4 colunas)
```typescript
<div ref={section3Ref} className="px-4 md:px-12 mb-16 scroll-mt-32">
  <div className="flex items-center justify-between mb-8">
    <div className="flex items-center gap-3">
      <[ÍCONE] className="w-7 h-7 text-[#FFD700]" />
      <h2 className="text-3xl font-bold text-white">[TÍTULO]</h2>
    </div>
  </div>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
    {items.map((item) => (
      <div
        key={item.id}
        onClick={() => handleItemClick(item)}
        className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/20"
      >
        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden">
          <ImageWithFallback
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        
        {/* Info */}
        <div className="p-4">
          <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
            {item.name}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-2">
            {item.description}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
```

#### 5.5 Tabela/Ranking Section
```typescript
<div ref={tableRef} className="px-4 md:px-12 mb-16 scroll-mt-32">
  <div className="flex items-center gap-3 mb-8">
    <TableIcon className="w-7 h-7 text-[#FFD700]" />
    <h2 className="text-3xl font-bold text-white">[TÍTULO TABELA]</h2>
  </div>

  <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
    {/* Desktop Table */}
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead className="bg-white/10">
          <tr>
            <th className="text-left p-4 text-gray-300 font-semibold">#</th>
            <th className="text-left p-4 text-gray-300 font-semibold">[COLUNA 1]</th>
            {/* Mais colunas */}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => (
            <tr
              key={row.id}
              className="border-t border-white/10 hover:bg-white/5 transition-all duration-200"
            >
              <td className="p-4 text-white font-bold">{index + 1}</td>
              {/* Mais células */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Mobile Cards */}
    <div className="md:hidden divide-y divide-white/10">
      {tableData.map((row, index) => (
        <div key={row.id} className="p-4 hover:bg-white/5">
          {/* Card mobile content */}
        </div>
      ))}
    </div>
  </div>
</div>
```

#### 5.6 Lista de Notícias/Artigos
```typescript
<div className="px-4 md:px-12 mb-16">
  <div className="flex items-center gap-3 mb-8">
    <NewspaperIcon className="w-7 h-7 text-[#FFD700]" />
    <h2 className="text-3xl font-bold text-white">[TÍTULO NOTÍCIAS]</h2>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {news.map((article) => (
      <div
        key={article.id}
        onClick={() => handleNewsClick(article)}
        className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/20"
      >
        {/* Thumbnail */}
        {article.thumbnail && (
          <div className="relative h-48 overflow-hidden">
            <ImageWithFallback
              src={article.thumbnail}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          <h3 className="text-white font-bold text-lg mb-3 line-clamp-2 group-hover:text-[#FFD700] transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-400 text-sm line-clamp-3 mb-4">
            {article.description}
          </p>
          
          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{new Date(article.pubDate).toLocaleDateString('pt-BR')}</span>
            <ExternalLinkIcon className="w-4 h-4 group-hover:text-[#FFD700] transition-colors" />
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```

### 6. LOADING STATE (OBRIGATÓRIO)
```typescript
if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-[COR1] via-[COR2] to-[COR3]">
      <NetflixHeader 
        activeCategory="[categoria]"
        onCategoryChange={() => {}}
        onSearchClick={() => {}}
      />
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Carregando dados de [TEMA]...</p>
        </div>
      </div>
    </div>
  );
}
```

### 7. FETCH DE DADOS (SISTEMA ROBUSTO)
```typescript
async function fetchAllData() {
  // Prevent multiple simultaneous calls
  if (isFetching) {
    console.log('⚠️ fetchAllData já está em execução, ignorando...');
    return;
  }
  
  console.log('🔄 Iniciando fetchAllData...');
  setIsFetching(true);
  setLoading(true);
  
  try {
    // Fetch data 1
    try {
      console.log('📡 Buscando [dados 1]...');
      const resp1 = await fetch(`${serverUrl}/[endpoint1]`, {
        headers: { "Authorization": `Bearer ${publicAnonKey}` },
      });
      
      if (resp1.ok) {
        const data = await resp1.json();
        setData1(data.items || []);
        console.log(`✅ ${data.items?.length || 0} [itens] carregados`);
      } else {
        console.error(`❌ Erro HTTP: ${resp1.status}`);
      }
    } catch (err) {
      console.error('⚠️ Erro ao buscar [dados 1]:', err);
    }

    // Fetch data 2, 3, 4... (repetir padrão)

    setLoading(false);
    setIsFetching(false);
  } catch (error: any) {
    console.error('⚠️ Erro ao carregar dados:', error);
    setLoading(false);
    setIsFetching(false);
  }
}

useEffect(() => {
  fetchAllData();
}, []);
```

### 8. PALETA DE CORES TEMA
```typescript
// Background gradient
className="min-h-screen bg-gradient-to-r from-[COR_PRIMARIA] via-[COR_SECUNDARIA] to-[COR_TERCIARIA] text-white"

// Exemplos por tema:
// Futebol: from-[#006a4e] via-[#0a3d5c] to-[#1a1f3a] (verde→azul→escuro)
// Música: from-[#8B008B] via-[#4B0082] to-[#1a1a2e] (roxo→índigo→escuro)
// Tecnologia: from-[#0ea5e9] via-[#1e40af] to-[#0f172a] (azul→azul-escuro→preto)
// Games: from-[#8b5cf6] via-[#6366f1] to-[#1e1b4b] (roxo→roxo-claro→azul-escuro)
// Cinema: from-[#dc2626] via-[#991b1b] to-[#1a1a1a] (vermelho→vermelho-escuro→preto)
```

### 9. ÍCONES NECESSÁRIOS
```typescript
// Importar do arquivo Icons.tsx:
import {
  // Navegação
  ArrowLeftIcon,
  ExternalLinkIcon,
  
  // Stats
  TrophyIcon,
  CalendarIcon,
  TrendingUpIcon,
  ClockIcon,
  
  // Conteúdo
  NewspaperIcon,
  TvIcon,
  PlayIcon,
  
  // Categorias
  UsersIcon,
  TargetIcon,
  TableIcon,
  AwardIcon,
  MapPinIcon,
  
  // [ADICIONAR OUTROS CONFORME NECESSÁRIO]
} from './Icons';
```

### 10. RESPONSIVIDADE (OBRIGATÓRIO)
```
- Hero: text-5xl md:text-7xl lg:text-8xl
- Seções: px-4 md:px-12
- Grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Quick Stats: grid-cols-2 md:grid-cols-4
- Mobile Quick Bar: md:hidden (só mobile)
- Tabelas: hidden md:block (desktop) + md:hidden (mobile cards)
```

### 11. ANIMAÇÕES E TRANSIÇÕES
```typescript
// Hover cards
className="hover:border-[#FFD700] transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/20"

// Hover images
className="group-hover:scale-110 transition-transform duration-500"

// Live indicator
className="animate-ping" // dot pulsante
className="animate-pulse-slow" // container

// Active states
className="active:scale-95" // mobile touch

// Smooth scroll
behavior: 'smooth', block: 'start'
```

---

## ✅ CHECKLIST COMPLETO - TUDO DEVE TER:

### ESTRUTURA VISUAL
- [ ] Hero Banner YouTube com vídeo em loop (16:9)
- [ ] Overlay gradients (top, bottom, left, right vignette)
- [ ] Ícone/Logo SVG customizado do tema
- [ ] Título gigante (text-5xl → text-8xl)
- [ ] 3 Stats Pills interativos no hero
- [ ] Mobile Quick Action Bar (sticky top-16)

### SEÇÕES DE CONTEÚDO
- [ ] Mínimo 6 seções diferentes
- [ ] 1 seção Quick Stats (4 cards)
- [ ] 1 seção grid 2 colunas
- [ ] 1 seção grid 3-4 colunas
- [ ] 1 seção tabela/ranking
- [ ] 1 seção notícias/artigos
- [ ] 1 seção destaque/live (opcional)

### FUNCIONALIDADES
- [ ] Loading state com spinner
- [ ] Fetch de dados com try/catch robusto
- [ ] Sistema de refs para scroll suave
- [ ] Prevenção de múltiplos fetches (isFetching)
- [ ] Empty states para dados vazios
- [ ] Click handlers para items

### RESPONSIVIDADE
- [ ] Mobile First design
- [ ] Breakpoints: mobile / md / lg
- [ ] Tabelas com versão mobile (cards)
- [ ] Touch-friendly (active:scale-95)
- [ ] Quick Action Bar só mobile

### DESIGN
- [ ] Paleta de cores temática (3 cores gradient)
- [ ] Accent color: #FFD700 (ouro)
- [ ] Glass morphism (backdrop-blur-sm)
- [ ] Border hover effects
- [ ] Shadow hover effects
- [ ] Smooth transitions (300ms)

### ACESSIBILIDADE
- [ ] Alt text em imagens
- [ ] Semantic HTML
- [ ] Keyboard navigation
- [ ] Screen reader friendly
- [ ] Contrast adequado

---

## 🎨 TEMAS PRONTOS PARA USAR

### 🎵 MÚSICA/SHOWS
```
- Cores: from-[#8B008B] via-[#4B0082] to-[#1a1a2e]
- Video: Show/Festival ao vivo
- Seções: Artistas, Albums, Playlists, Top Charts, Próximos Shows, Notícias
- Ícones: MusicIcon, HeadphonesIcon, MicIcon, etc.
```

### 🎮 GAMES/E-SPORTS
```
- Cores: from-[#8b5cf6] via-[#6366f1] to-[#1e1b4b]
- Video: Gameplay/Torneio
- Seções: Jogos, Torneios, Streamers, Rankings, Lançamentos, Reviews
- Ícones: GamepadIcon, TrophyIcon, StarIcon, etc.
```

### 🎬 CINEMA/FILMES
```
- Cores: from-[#dc2626] via-[#991b1b] to-[#1a1a1a]
- Video: Trailer/Behind the Scenes
- Seções: Em Cartaz, Lançamentos, Críticas, Box Office, Premiações, Trailers
- Ícones: FilmIcon, PopcornIcon, CameraIcon, etc.
```

### 💻 TECNOLOGIA/INOVAÇÃO
```
- Cores: from-[#0ea5e9] via-[#1e40af] to-[#0f172a]
- Video: Tech demos/Innovation
- Seções: Gadgets, Reviews, Tutoriais, Lançamentos, Tendências, Notícias
- Ícones: CpuIcon, SmartphoneIcon, CodeIcon, etc.
```

### 🏀 BASQUETE/NBA
```
- Cores: from-[#ff6b00] via-[#c54102] to-[#1a1a1a]
- Video: Highlights NBA
- Seções: Times, Jogos, Tabela, Top Scorers, Playoffs, Notícias
- Ícones: Basketball, Trophy, Target, etc.
```

### 🎤 STAND-UP/COMÉDIA
```
- Cores: from-[#f59e0b] via-[#d97706] to-[#1a1a1a]
- Video: Stand-up performance
- Seções: Comediantes, Shows, Especiais, Agenda, Trending, Reviews
- Ícones: SmileIcon, MicIcon, ThumbsUpIcon, etc.
```

---

## 🚀 EXEMPLO DE USO DO PROMPT

### Para criar uma página de MÚSICA:

```
Crie uma página completa MusicPage.tsx para a plataforma RedFlix sobre Música e Shows, seguindo EXATAMENTE o mesmo padrão, layout e funcionalidades da página de Futebol (SoccerPage.tsx).

ESPECIFICAÇÕES:
- Cores: bg-gradient-to-r from-[#8B008B] via-[#4B0082] to-[#1a1f3a]
- Hero Video: ID do YouTube de show/festival ao vivo
- Logo/Ícone: Nota musical SVG customizada
- Título Hero: "Music & Live Shows"
- Subtítulo: "RedFlix Music • 2025"

SEÇÕES (mínimo 6):
1. Próximos Shows (grid 2 colunas, igual "Próximos Jogos")
2. Quick Stats (4 cards: Total Artistas, Shows Agendados, Álbuns Novos, Top Chart)
3. Ao Vivo Agora (se houver shows transmitindo ao vivo, igual "Live Matches")
4. Artistas em Destaque (grid 4 colunas com fotos e nomes)
5. Top 20 Músicas (tabela ranking igual "Tabela")
6. Últimas Notícias Musicais (grid 3 colunas, igual "Notícias")

MOBILE QUICK BAR (5 botões):
- 🎵 AO VIVO (se houver)
- 👨‍🎤 ARTISTAS
- 🎯 TOP 20
- 📅 AGENDA
- 📰 NOTÍCIAS

DADOS API:
- Criar endpoints no servidor para:
  - /music/artists
  - /music/upcoming-shows
  - /music/top-charts
  - /music/news
  - /music/live-events

USAR:
- ImageWithFallback para fotos de artistas
- Scroll suave com refs
- Loading state com spinner
- Empty states
- Hover effects idênticos
- Mesma estrutura de cards

O layout, animações, responsividade e interatividade devem ser IDÊNTICOS à SoccerPage.tsx.
```

---

## 📝 NOTAS IMPORTANTES

1. **NUNCA altere o NetflixHeader** - use como componente externo
2. **SEMPRE use ImageWithFallback** para imagens externas
3. **SEMPRE implemente loading state** antes do conteúdo
4. **SEMPRE use try/catch** em todos os fetches
5. **SEMPRE tenha empty states** para dados vazios
6. **SEMPRE use scroll-mt-32** nas seções com refs
7. **SEMPRE use pointer-events-none** no iframe YouTube
8. **SEMPRE tenha versão mobile das tabelas**
9. **SEMPRE use transition-all duration-300** nos hovers
10. **SEMPRE siga a estrutura exata** do SoccerPage.tsx

---

## 🎯 RESULTADO ESPERADO

Uma página **pixel-perfect** idêntica à SoccerPage.tsx mas com:
- Tema visual diferente (cores, vídeo, ícones)
- Dados diferentes (API endpoints específicos)
- Conteúdo temático apropriado
- MESMA estrutura, layout e funcionalidades
- MESMA experiência de usuário
- MESMA qualidade de código

---

**Versão:** 1.0.0  
**Baseado em:** RedFlix SoccerPage v2.4.0  
**Compatibilidade:** 100% com arquitetura RedFlix
```
