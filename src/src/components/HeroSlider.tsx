import { useState, useEffect } from 'react';
import { Movie } from '../utils/tmdb';
import { HERO_SLIDES, HeroSlide, fetchHeroSlides } from '../utils/heroContent';

// Icons inline
const Plus = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const ThumbsUp = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
);

const Clock = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

function GenreTags({ genres }: { genres: string[] }) {
  return (
    <div className="content-stretch flex gap-2 items-center relative shrink-0">
      {genres.slice(0, 3).map((genre, index) => (
        <div key={genre} className="flex gap-2 items-center">
          <p 
            className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm sm:text-base md:text-[17px] text-nowrap text-white whitespace-pre"
            style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.9)' }}
          >
            {genre}
          </p>
          {index < Math.min(genres.length, 3) - 1 && (
            <div className="relative shrink-0 size-[5px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
                <circle cx="2.5" cy="2.5" fill="var(--fill-0, #FEFEFE)" r="2.5" style={{ filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.8))' }} />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Frame2795() {
  return (
    <div className="content-stretch flex gap-1 sm:gap-[6px] items-center justify-center relative shrink-0">
      <div className="relative shrink-0 size-[18px] sm:size-[24px]" data-name="mage:play-fill">
        <div className="absolute inset-[11.43%_20.39%_11.43%_20.4%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 19">
            <path d="M14.21 8.70235C14.2145 9.04709 14.1428 9.38856 14 9.70235C13.85 10.0344 13.62 10.3224 13.33 10.5424L3.68003 18.0524C3.34031 18.3114 2.93518 18.4707 2.51003 18.5124H2.28003C1.93241 18.5125 1.58972 18.4302 1.28003 18.2724C0.90424 18.0878 0.586224 17.8038 0.360552 17.4512C0.13488 17.0986 0.0101864 16.6909 2.76776e-05 16.2724V2.27235C-0.0020449 1.8591 0.112322 1.45362 0.330028 1.10235C0.540707 0.751116 0.842492 0.463422 1.2034 0.269767C1.5643 0.076111 1.97087 -0.0162913 2.38003 0.00235371C2.79203 0.0223537 3.19203 0.150354 3.54003 0.372354L13.2 6.81235C13.494 7.01635 13.74 7.28235 13.92 7.59235C14.11 7.93235 14.21 8.31335 14.21 8.70235Z" fill="var(--fill-0, #FEFEFE)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm sm:text-[16px] text-nowrap text-white whitespace-pre">Assistir</p>
    </div>
  );
}

function Frame2796({ onClick }: { onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-red-600 box-border content-stretch flex flex-col gap-[10px] h-[32px] sm:h-[36px] items-center justify-center px-3 sm:px-[11px] py-[7px] relative rounded-[4px] shrink-0 w-[90px] sm:w-[103px] cursor-pointer hover:bg-red-700 transition-colors active:scale-95">
      <Frame2795 />
    </div>
  );
}

function Frame2797() {
  return (
    <div className="content-stretch flex gap-1 sm:gap-[6px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[18px] sm:size-[24px]" data-name="material-symbols:info-outline-rounded">
        <div className="absolute inset-[8.333%]" data-name="Vector">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d="M10 15C10.2833 15 10.521 14.904 10.713 14.712C10.905 14.52 11.0007 14.2827 11 14V10C11 9.71667 10.904 9.47933 10.712 9.288C10.52 9.09667 10.2827 9.00067 10 9C9.71733 8.99933 9.48 9.09533 9.288 9.288C9.096 9.48067 9 9.718 9 10V14C9 14.2833 9.096 14.521 9.288 14.713C9.48 14.905 9.71733 15.0007 10 15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C10.9993 5.71733 10.9033 5.48 10.712 5.288C10.5207 5.096 10.2833 5 10 5C9.71667 5 9.47933 5.096 9.288 5.288C9.09667 5.48 9.00067 5.71733 9 6C8.99933 6.28267 9.09533 6.52033 9.288 6.713C9.48067 6.90567 9.718 7.00133 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88334 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667932 11.3827 1.26582e-06 10C-0.000665401 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88267 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 10 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88267 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 10C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="var(--fill-0, #FEFEFE)" id="Vector" />
          </svg>
        </div>
      </div>
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm sm:text-[16px] text-nowrap text-white whitespace-pre">Mais Info</p>
    </div>
  );
}

function Frame2798({ onClick }: { onClick?: () => void }) {
  return (
    <div onClick={onClick} className="bg-[#333333] box-border content-stretch flex flex-col gap-[10px] h-[32px] sm:h-[36px] items-start px-3 sm:px-[11px] py-[6px] relative rounded-[4px] shrink-0 w-[110px] sm:w-[126px] cursor-pointer hover:bg-[#404040] transition-colors active:scale-95">
      <Frame2797 />
    </div>
  );
}

function Frame2799({ onPlayClick, onInfoClick }: { onPlayClick?: () => void; onInfoClick?: () => void }) {
  return (
    <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
      <Frame2796 onClick={onPlayClick} />
      <Frame2798 onClick={onInfoClick} />
    </div>
  );
}

interface HeroSliderProps {
  onMovieClick?: (movie: Movie) => void;
  sidebarCollapsed?: boolean;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  myList?: number[];
  likedList?: number[];
  watchLaterList?: number[];
}

export function HeroSlider({ 
  onMovieClick, 
  sidebarCollapsed = true,
  onAddToList,
  onLike,
  onWatchLater,
  myList = [],
  likedList = [],
  watchLaterList = []
}: HeroSliderProps) {
  const [slides, setSlides] = useState<HeroSlide[]>(HERO_SLIDES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fade, setFade] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    // Tentar buscar dados atualizados do TMDB
    const loadHeroData = async () => {
      console.log('🎬 HeroSlider: Iniciando carregamento...');
      console.log(`📋 Dados iniciais: ${HERO_SLIDES.length} séries`);
      
      try {
        // Buscar dados atualizados do TMDB (com fallback automático)
        const updatedSlides = await fetchHeroSlides();
        
        if (updatedSlides && updatedSlides.length > 0) {
          setSlides(updatedSlides);
          console.log(`✅ ${updatedSlides.length} séries carregadas!`);
        } else {
          console.log('⚠️ Usando dados estáticos (fallback)');
          setSlides(HERO_SLIDES);
        }
        
        // Log de todas as séries e logos
        const slidesToLog = updatedSlides.length > 0 ? updatedSlides : HERO_SLIDES;
        console.log('\n📸 SÉRIES CARREGADAS:');
        slidesToLog.forEach((slide, index) => {
          console.log(`\n${index + 1}. ${slide.name}${slide.title ? ` (${slide.title})` : ''}`);
          console.log(`   ID: ${slide.id}`);
          console.log(`   Logo: ${slide.logo_path ? '✅ DISPONÍVEL' : '❌ NÃO DISPONÍVEL'}`);
          if (slide.logo_path) {
            console.log(`   URL Logo: ${slide.logo_path}`);
          }
          console.log(`   Backdrop: ${slide.backdrop_path ? '✅' : '❌'}`);
          console.log(`   Trailer: ${slide.trailer_key ? `✅ ${slide.trailer_key}` : '❌ Não disponível'}`);
          console.log(`   Gêneros: ${slide.genres.join(', ')}`);
        });
        
        // Preload da primeira imagem E logo após carregar
        if (slidesToLog.length > 0) {
          const firstSlide = slidesToLog[0];
          
          // Preload backdrop
          if (firstSlide.backdrop_path) {
            const backdropLink = document.createElement('link');
            backdropLink.rel = 'preload';
            backdropLink.as = 'image';
            backdropLink.href = firstSlide.backdrop_path;
            backdropLink.setAttribute('fetchpriority', 'high');
            backdropLink.setAttribute('crossorigin', 'anonymous');
            document.head.appendChild(backdropLink);
            console.log('\n🚀 Preloading backdrop:', firstSlide.backdrop_path);
          }
          
          // Preload logo
          if (firstSlide.logo_path) {
            const logoLink = document.createElement('link');
            logoLink.rel = 'preload';
            logoLink.as = 'image';
            logoLink.href = firstSlide.logo_path;
            logoLink.setAttribute('fetchpriority', 'high');
            logoLink.setAttribute('crossorigin', 'anonymous');
            document.head.appendChild(logoLink);
            console.log('🚀 Preloading logo:', firstSlide.logo_path);
          }
        }
      } catch (error) {
        console.error('❌ Erro ao carregar hero data:', error);
        console.log('📋 Usando dados estáticos como fallback');
        setSlides(HERO_SLIDES);
      }
      
      // Marca como carregado
      setTimeout(() => {
        setLoading(false);
        console.log('\n✅ HeroSlider: Pronto para exibir!\n');
      }, 100);
    };
    
    loadHeroData();
  }, []);

  // Auto-rotate slides every 6 seconds
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => {
          const nextIndex = (prev + 1) % slides.length;
          // Pré-carregar a próxima imagem
          setImagesLoaded(loaded => new Set(loaded).add(nextIndex));
          return nextIndex;
        });
        setFade(true);
      }, 300);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [slides.length]);

  // Pré-carregar imagens adjacentes quando muda o slide
  useEffect(() => {
    if (slides.length === 0) return;
    
    // Marcar slide atual + próximo como prontos para carregar
    const nextIndex = (currentIndex + 1) % slides.length;
    setImagesLoaded(loaded => {
      const newSet = new Set(loaded);
      newSet.add(currentIndex);
      newSet.add(nextIndex);
      return newSet;
    });
  }, [currentIndex, slides.length]);

  if (loading) {
    // Mostrar skeleton durante o carregamento
    const sidebarWidth = sidebarCollapsed ? 96 : 216;
    const contentLeft = sidebarCollapsed ? 130 : 250;
    return (
      <div 
        className="absolute h-screen top-0 bg-[#1a1a1a] transition-all duration-300 z-[5]"
        style={{ 
          left: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`
        }}
      >
        <div 
          className="absolute top-[30vh] w-[415px] z-[7]"
          style={{ left: `${contentLeft}px` }}
        >
          <div className="h-20 w-[300px] bg-white/10 rounded mb-4 animate-pulse"></div>
          <div className="h-4 w-full bg-white/10 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-3/4 bg-white/10 rounded mb-2 animate-pulse"></div>
          <div className="h-4 w-full bg-white/10 rounded mb-6 animate-pulse"></div>
          <div className="flex gap-3">
            <div className="h-9 w-[103px] bg-red-600/30 rounded animate-pulse"></div>
            <div className="h-9 w-[126px] bg-white/10 rounded animate-pulse"></div>
          </div>
        </div>
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-16% from-[#141414] to-[69.5%] to-[rgba(217,217,217,0)] via-36% via-[rgba(40,40,40,0.71)] z-[6]"
        />
      </div>
    );
  }
  
  if (slides.length === 0) {
    console.error('❌ HeroSlider: Nenhum banner disponível');
    const sidebarWidth = sidebarCollapsed ? 96 : 216;
    const contentLeft = sidebarCollapsed ? 130 : 250;
    return (
      <div 
        className="absolute h-screen top-0 bg-[#1a1a1a] transition-all duration-300 z-[5]"
        style={{ 
          left: `${sidebarWidth}px`,
          width: `calc(100% - ${sidebarWidth}px)`
        }}
      >
        <div 
          className="absolute top-[40vh] w-[415px] z-[7]"
          style={{ left: `${contentLeft}px` }}
        >
          <p className="text-white text-xl mb-4">⚠️ Não foi possível carregar os destaques</p>
          <p className="text-white/60 text-sm">Verifique o console para mais detalhes</p>
        </div>
        <div 
          className="absolute inset-0 bg-gradient-to-r from-16% from-[#141414] to-[69.5%] to-[rgba(217,217,217,0)] via-36% via-[rgba(40,40,40,0.71)] z-[6]"
        />
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <>
      {/* Hero Background Image - Full Width com Overflow Hidden */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden z-[5]">
        {/* Renderizar apenas o slide atual e o próximo */}
        {slides.map((slide, index) => {
          const isCurrentSlide = index === currentIndex;
          const shouldPreload = imagesLoaded.has(index);
          
          // Renderizar apenas slides que devem estar visíveis ou pré-carregados
          if (!isCurrentSlide && !shouldPreload) return null;
          
          return slide.backdrop_path ? (
            <div 
              key={index}
              className={`absolute top-0 left-0 w-full min-h-screen transition-all duration-500 ${
                isCurrentSlide && fade ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.backdrop_path}
                alt={slide.name || slide.title || 'Hero Banner'}
                loading={index === 0 ? 'eager' : 'lazy'}
                className="w-full h-screen object-cover"
                style={{ 
                  objectPosition: 'center top'
                }}
                onError={(e) => {
                  // Silenciar erro - fallback será tratado
                  e.currentTarget.style.display = 'none';
                }}
                onLoad={() => {
                  console.log(`✅ Banner ${index} carregado:`, slide.name);
                }}
              />
            </div>
          ) : null;
        })}
        {!currentSlide.backdrop_path && (
          <div className="absolute top-0 left-0 w-full h-full bg-[#141414]" />
        )}
      </div>
      
      {/* Hero Gradient Overlay - Escurece laterais */}
      <div className="absolute bg-gradient-to-r from-[#141414] from-0% via-[rgba(20,20,20,0.5)] via-40% to-transparent to-70% h-screen top-0 left-0 w-full transition-all duration-300 z-[6]" />
      
      {/* Bottom Gradient - Esconde overflow e faz transição suave */}
      <div className="absolute left-0 w-full h-48 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent transition-all duration-300 z-[7]"
        style={{ bottom: 0 }}
      />
      
      {/* Hero Content */}
      <div 
        className={`absolute content-stretch flex flex-col gap-3 md:gap-6 items-start top-[25vh] sm:top-[30vh] md:top-[35vh] w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] z-[8] px-4 md:px-12 left-0 transition-all duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Logo da Série/Filme - Posicionamento destacado */}
        <div className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[500px] min-h-[90px] sm:min-h-[110px] md:min-h-[150px] mb-2">
          {currentSlide.logo_path ? (
            <img 
              src={currentSlide.logo_path} 
              alt={currentSlide.name || currentSlide.title || ''}
              className="w-full max-h-[90px] sm:max-h-[110px] md:max-h-[150px] object-contain object-left"
              style={{
                filter: 'drop-shadow(0 8px 20px rgba(0, 0, 0, 1)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.95))',
                imageRendering: 'high-quality'
              }}
              crossOrigin="anonymous"
              loading="eager"
              onError={(e) => {
                // Silenciar erro - fallback para título será exibido automaticamente
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const container = target.parentElement;
                if (container && !container.querySelector('h1')) {
                  const titleElement = document.createElement('h1');
                  titleElement.className = "font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-tight not-italic text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight";
                  titleElement.style.textShadow = '0 4px 12px rgba(0, 0, 0, 0.9)';
                  titleElement.textContent = currentSlide.name || currentSlide.title || '';
                  container.appendChild(titleElement);
                  console.log(`✅ Fallback: Exibindo título em texto para "${currentSlide.name}"`);
                }
              }}
              onLoad={() => {
                console.log(`✅ ✅ ✅ LOGO CARREGADA E VISÍVEL: ${currentSlide.name}`);
                console.log(`URL da logo:`, currentSlide.logo_path);
              }}
            />
          ) : (
            <h1 className="font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-tight not-italic text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-tight" style={{ textShadow: '0 4px 12px rgba(0, 0, 0, 0.9)' }}>
              {currentSlide.name || currentSlide.title}
            </h1>
          )}
        </div>
        
        {/* Gêneros e Descrição */}
        <div className="content-stretch flex flex-col gap-2 md:gap-3 items-start relative shrink-0 w-full max-w-[450px]">
          <GenreTags genres={currentSlide.genres} />
          <div className="font-['Inter:Medium',sans-serif] font-medium leading-relaxed not-italic relative shrink-0 text-[#d1d1d1] text-sm sm:text-base md:text-[15px] max-w-full">
            <p className="mb-0 line-clamp-3 md:line-clamp-4" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)' }}>
              {currentSlide.overview || 'Descrição não disponível.'}
            </p>
          </div>
        </div>
        {/* Botões de Ação */}
        <div className="flex items-center gap-3">
          <Frame2796 onClick={() => {
            if (currentSlide.trailer_key) {
              setShowTrailer(true);
            } else {
              onMovieClick?.(currentSlide as any);
            }
          }} />
          <Frame2798 onClick={() => onMovieClick?.(currentSlide as any)} />
          
          {/* Botão Adicionar à Lista */}
          <button
            onClick={() => onAddToList?.(currentSlide as any)}
            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
              myList.includes(currentSlide.id)
                ? 'border-white bg-white hover:bg-gray-200'
                : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
            }`}
            title={myList.includes(currentSlide.id) ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
          >
            {myList.includes(currentSlide.id) ? (
              <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <Plus className="w-5 h-5 text-white" />
            )}
          </button>

          {/* Botão Curtir */}
          <button
            onClick={() => onLike?.(currentSlide as any)}
            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
              likedList.includes(currentSlide.id)
                ? 'border-[#E50914] bg-[#E50914] hover:bg-[#f40612]'
                : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
            }`}
            title={likedList.includes(currentSlide.id) ? 'Remover Gostei' : 'Gostei'}
          >
            <ThumbsUp className={`w-5 h-5 ${likedList.includes(currentSlide.id) ? 'text-white fill-white' : 'text-white'}`} />
          </button>

          {/* Botão Assistir Depois */}
          <button
            onClick={() => onWatchLater?.(currentSlide as any)}
            className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
              watchLaterList.includes(currentSlide.id)
                ? 'border-blue-500 bg-blue-500 hover:bg-blue-600'
                : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
            }`}
            title={watchLaterList.includes(currentSlide.id) ? 'Remover de Assistir Depois' : 'Assistir Depois'}
          >
            <Clock className={`w-5 h-5 ${watchLaterList.includes(currentSlide.id) ? 'text-white' : 'text-white'}`} />
          </button>

          {/* Botão Dropdown (placeholder) */}
          <button
            className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-all"
            title="Mais opções"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
      
      {/* Slide indicators */}
      <div 
        className="absolute bottom-8 md:bottom-12 flex gap-[8px] z-[8] px-4 md:px-12 left-0"
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setFade(false);
              // Pré-carregar o slide clicado
              setImagesLoaded(loaded => new Set(loaded).add(index));
              setTimeout(() => {
                setCurrentIndex(index);
                setFade(true);
              }, 300);
            }}
            className={`w-[8px] h-[8px] rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-red-600 w-[24px]' 
                : 'bg-white/50 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
      
      {/* Trailer Modal */}
      {showTrailer && currentSlide.trailer_key && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center"
          onClick={() => setShowTrailer(false)}
        >
          <div 
            className="relative w-full max-w-[1200px] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-red-600 transition-colors"
            >
              ✕
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${currentSlide.trailer_key}?autoplay=1&rel=0`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}