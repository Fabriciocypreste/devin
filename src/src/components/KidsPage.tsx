import { useState, useRef } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getKidsContentByCategory, getNewContent, getPopularContent, KidsContent } from '../utils/kidsContent';
import { KidsGames } from "./KidsGames";

// Banner oficial da Netflix Kids
const NETFLIX_KIDS_BANNER = "https://occ-0-897-420.1.nflxso.net/dnm/api/v6/6AYY37jfdO6hpXcMjf9Yu5cnmO0/AAAABSSd2nVhfK3FGvPqxZCnqFAbwey1RgTCexoAupQsssqtrjVERiSYd__EAwEnpE5uMZZ2eUeG0aTGB-LG7vIM8LhkJTtaPxXKaU0_.webp?r=4c7";

const X = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeft = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const ChevronRight = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const Play = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Star = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

interface KidsPageProps {
  onClose: () => void;
}

// Avatares de personagens com imagens reais - estilo Netflix Kids
const characterAvatars = [
  { id: 1, name: "Gabby's Dollhouse", color: "#FFD700", emoji: "🐱" },
  { id: 2, name: "Super Heróis", color: "#FF6347", emoji: "🦸" },
  { id: 3, name: "Pokémon", color: "#ADFF2F", emoji: "⚡" },
  { id: 4, name: "Galinha Pintadinha", color: "#00CED1", emoji: "🐔" },
  { id: 5, name: "Masha e o Urso", color: "#FF1493", emoji: "🐻" },
  { id: 6, name: "Shrek", color: "#FFD700", emoji: "👹" },
  { id: 7, name: "Jurassic World", color: "#FF8C00", emoji: "🦖" },
];

export function KidsPage({ onClose }: KidsPageProps) {
  const [selectedTab, setSelectedTab] = useState<'content' | 'games'>('content');
  const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const categorizedContent = getKidsContentByCategory();
  const newContent = getNewContent();
  const popularContent = getPopularContent();

  const scroll = (categoryTitle: string, direction: 'left' | 'right') => {
    const container = scrollContainerRefs.current[categoryTitle];
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft = direction === 'left' 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  };

  const renderContentCard = (item: KidsContent, index: number) => (
    <div
      key={index}
      className="flex-shrink-0 w-[180px] md:w-[220px] group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        <img 
          src={item.image} 
          alt={item.description || 'Netflix Kids Content'}
          className="w-full h-[270px] md:h-[330px] object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/220x330/FF6B9D/FFFFFF?text=RedFlix+Kids';
          }}
        />
        
        {/* Status Badge */}
        {item.status && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
            {item.status.includes('Nouvelle') ? '🆕 Novo' : 
             item.status.includes('Ajout') ? '✨ Recente' : 
             item.status}
          </div>
        )}

        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform">
            <Play className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {/* Hover Info */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {item.description && (
            <p className="text-white text-xs line-clamp-2">{item.description}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderContentRow = (title: string, items: KidsContent[], rowKey: string) => {
    if (items.length === 0) return null;

    return (
      <div className="mb-8" key={rowKey}>
        {/* Category Title */}
        <div className="flex items-center justify-between mb-4 px-4 md:px-8">
          <h2 className="text-white text-xl md:text-2xl font-bold flex items-center gap-2">
            {title}
            <span className="text-sm text-gray-400 font-normal">({items.length})</span>
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll(rowKey, 'left')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => scroll(rowKey, 'right')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content Carousel */}
        <div 
          ref={(el) => scrollContainerRefs.current[rowKey] = el}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 md:px-8 scroll-smooth"
        >
          {items.map((item, index) => renderContentCard(item, index))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto pt-16">
      {/* Animated Gradient Background - Netflix Kids Style */}
      <div className="fixed inset-0 bg-gradient-to-br from-pink-500/30 via-purple-500/30 to-blue-500/30 blur-3xl animate-pulse-slow" />
      <div className="fixed inset-0 bg-gradient-to-tr from-blue-600/20 via-pink-400/20 to-purple-600/20 blur-2xl" />
      <div className="fixed inset-0 bg-black/40" />
      
      {/* Content Container */}
      <div className="relative">
      {/* Full Screen Hero Banner */}
      <div className="relative">
        {/* Background Banner - Full Screen */}
        <div className="relative h-[70vh] md:h-[80vh] lg:h-[85vh] overflow-hidden">
          <ImageWithFallback
            src={NETFLIX_KIDS_BANNER}
            alt="Netflix Kids Banner" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 md:right-8 w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors z-20 touch-manipulation"
          >
            <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
          </button>

          {/* Kids Logo - Centered */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white drop-shadow-2xl mb-4">
              RedFlix Kids
            </h1>
            <p className="text-white text-lg md:text-2xl drop-shadow-lg font-semibold max-w-2xl">
              Diversão segura para toda família! 🎨
            </p>
          </div>

          {/* Character Avatars - Bottom of Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-12 pb-6 px-4 md:px-8 z-10">
            <div className="flex items-center gap-2 mb-4 md:mb-6">
              <h2 className="text-white text-base md:text-xl font-semibold tracking-wide">Personagens</h2>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-2 md:gap-4 lg:gap-5 overflow-x-auto scrollbar-hide pb-2">
              {characterAvatars.map((avatar) => (
                <button
                  key={avatar.id}
                  className="flex-shrink-0 group cursor-pointer touch-manipulation"
                >
                  <div 
                    className="w-20 h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden transform transition-all duration-300 group-hover:scale-110 active:scale-95 ring-[3px] md:ring-4 ring-white/0 group-hover:ring-white/100 flex items-center justify-center text-4xl md:text-5xl lg:text-6xl shadow-2xl"
                    style={{ backgroundColor: avatar.color }}
                  >
                    {avatar.emoji}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-4 md:px-8 py-4 border-b border-white/10">
          <button
            onClick={() => setSelectedTab('content')}
            className={`px-6 py-2 rounded-full transition-all font-semibold ${
              selectedTab === 'content'
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            📺 Filmes & Séries
          </button>
          <button
            onClick={() => setSelectedTab('games')}
            className={`px-6 py-2 rounded-full transition-all font-semibold ${
              selectedTab === 'games'
                ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg'
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
          >
            🎮 Jogos Divertidos
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="py-6 pb-24">
        {selectedTab === 'content' ? (
          <>
            {/* Novidades */}
            {renderContentRow('🆕 Novidades Netflix Kids', newContent, 'novidades')}

            {/* Popular */}
            {renderContentRow('⭐ Mais Assistidos', popularContent, 'popular')}

            {/* Animés */}
            {renderContentRow('🎌 Desenhos Animados', categorizedContent['Animés'], 'animes')}

            {/* Films */}
            {renderContentRow('🎬 Filmes Infantis', categorizedContent['Films'], 'films')}

            {/* Séries */}
            {renderContentRow('📺 Séries Divertidas', categorizedContent['Séries'], 'series')}

            {/* Jeunesse */}
            {renderContentRow('👶 Para os Pequenos', categorizedContent['Jeunesse'], 'jeunesse')}

            {/* Info Banner */}
            <div className="mx-4 md:mx-8 mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl border border-white/10">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🎉</div>
                <div>
                  <h3 className="text-white text-lg font-bold mb-2">Controle Parental Ativo</h3>
                  <p className="text-white/80 text-sm">
                    Todo conteúdo aqui é seguro e apropriado para crianças. 
                    Pais podem configurar limites de tempo e restrições adicionais nas configurações.
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <KidsGames />
        )}
      </div>
      </div>
    </div>
  );
}
