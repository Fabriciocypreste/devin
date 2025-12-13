import { useState, useEffect } from 'react';
import { Movie, getImageUrl, getImages } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';

// SVG Paths inline para evitar dependência do Figma
const svgPaths = {
  p4f15700: "M14.21 8.70235C14.2145 9.04709 14.1428 9.38856 14 9.70235C13.85 10.0344 13.62 10.3224 13.33 10.5424L3.68003 18.0524C3.34031 18.3114 2.93518 18.4707 2.51003 18.5124H2.28003C1.93241 18.5125 1.58972 18.4302 1.28003 18.2724C0.90424 18.0878 0.586224 17.8038 0.360552 17.4512C0.13488 17.0986 0.0101864 16.6909 2.76776e-05 16.2724V2.27235C-0.0020449 1.8591 0.112322 1.45362 0.330028 1.10235C0.540707 0.751116 0.842492 0.463422 1.2034 0.269767C1.5643 0.076111 1.97087 -0.0162913 2.38003 0.00235371C2.79203 0.0223537 3.19203 0.150354 3.54003 0.372354L13.2 6.81235C13.494 7.01635 13.74 7.28235 13.92 7.59235C14.11 7.93235 14.21 8.31335 14.21 8.70235Z",
  p2f213500: "M10 15C10.2833 15 10.521 14.904 10.713 14.712C10.905 14.52 11.0007 14.2827 11 14V10C11 9.71667 10.904 9.47933 10.712 9.288C10.52 9.09667 10.2827 9.00067 10 9C9.71733 8.99933 9.48 9.09533 9.288 9.288C9.096 9.48067 9 9.718 9 10V14C9 14.2833 9.096 14.521 9.288 14.713C9.48 14.905 9.71733 15.0007 10 15ZM10 7C10.2833 7 10.521 6.904 10.713 6.712C10.905 6.52 11.0007 6.28267 11 6C10.9993 5.71733 10.9033 5.48 10.712 5.288C10.5207 5.096 10.2833 5 10 5C9.71667 5 9.47933 5.096 9.288 5.288C9.09667 5.48 9.00067 5.71733 9 6C8.99933 6.28267 9.09533 6.52033 9.288 6.713C9.48067 6.90567 9.718 7.00133 10 7ZM10 20C8.61667 20 7.31667 19.7373 6.1 19.212C4.88334 18.6867 3.825 17.9743 2.925 17.075C2.025 16.1757 1.31267 15.1173 0.788001 13.9C0.263335 12.6827 0.000667932 11.3827 1.26582e-06 10C-0.000665401 8.61733 0.262001 7.31733 0.788001 6.1C1.314 4.88267 2.02633 3.82433 2.925 2.925C3.82367 2.02567 4.882 1.31333 6.1 0.788C7.318 0.262667 8.618 0 10 0C11.382 0 12.682 0.262667 13.9 0.788C15.118 1.31333 16.1763 2.02567 17.075 2.925C17.9737 3.82433 18.6863 4.88267 19.213 6.1C19.7397 7.31733 20.002 8.61733 20 10C19.998 11.3827 19.7353 12.6827 19.212 13.9C18.6887 15.1173 17.9763 16.1757 17.075 17.075C16.1737 17.9743 15.1153 18.687 13.9 19.213C12.6847 19.739 11.3847 20.0013 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z",
};

interface CategoryBannerProps {
  content: Movie | null;
  onPlayClick?: () => void;
  onInfoClick?: () => void;
}

// Componente de Tags de Gênero (igual ao HeroSlider)
function GenreTags({ genres }: { genres?: string[] }) {
  if (!genres || genres.length === 0) return null;
  
  return (
    <div className="content-stretch flex gap-2 items-center relative shrink-0">
      {genres.slice(0, 2).map((genre, index) => (
        <div key={genre} className="flex items-center gap-2">
          {index > 0 && (
            <div className="relative shrink-0 size-[4px]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 4">
                <circle cx="2" cy="2" fill="var(--fill-0, #FEFEFE)" r="2" />
              </svg>
            </div>
          )}
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-xs sm:text-sm md:text-[16px] text-nowrap text-white whitespace-pre">
            {genre}
          </p>
        </div>
      ))}
    </div>
  );
}

// Botão Assistir (igual ao HeroSlider)
function PlayButton({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick} 
      className="bg-red-600 box-border content-stretch flex flex-col gap-[10px] h-[32px] sm:h-[36px] items-center justify-center px-3 sm:px-[11px] py-[7px] relative rounded-[4px] shrink-0 w-[90px] sm:w-[103px] cursor-pointer hover:bg-red-700 transition-colors active:scale-95"
    >
      <div className="content-stretch flex gap-1 sm:gap-[6px] items-center justify-center relative shrink-0">
        <div className="relative shrink-0 size-[18px] sm:size-[24px]">
          <div className="absolute inset-[11.43%_20.39%_11.43%_20.4%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 19">
              <path d={svgPaths.p4f15700} fill="var(--fill-0, #FEFEFE)" />
            </svg>
          </div>
        </div>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm sm:text-[16px] text-nowrap text-white whitespace-pre">
          Assistir
        </p>
      </div>
    </div>
  );
}

// Botão Mais Info (igual ao HeroSlider)
function InfoButton({ onClick }: { onClick?: () => void }) {
  return (
    <div 
      onClick={onClick} 
      className="bg-[#333333] box-border content-stretch flex flex-col gap-[10px] h-[32px] sm:h-[36px] items-start px-3 sm:px-[11px] py-[6px] relative rounded-[4px] shrink-0 w-[110px] sm:w-[126px] cursor-pointer hover:bg-[#404040] transition-colors active:scale-95"
    >
      <div className="content-stretch flex gap-1 sm:gap-[6px] items-center relative shrink-0">
        <div className="relative shrink-0 size-[18px] sm:size-[24px]">
          <div className="absolute inset-[8.333%]">
            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
              <path d={svgPaths.p2f213500} fill="var(--fill-0, #FEFEFE)" />
            </svg>
          </div>
        </div>
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[normal] not-italic relative shrink-0 text-sm sm:text-[16px] text-nowrap text-white whitespace-pre">
          Mais Info
        </p>
      </div>
    </div>
  );
}

export function CategoryBanner({ content, onPlayClick, onInfoClick }: CategoryBannerProps) {
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [loadingLogo, setLoadingLogo] = useState(true);

  useEffect(() => {
    if (!content) return;

    async function fetchLogo() {
      try {
        const mediaType = content.media_type === 'tv' ? 'tv' : 'movie';
        const images = await getImages(mediaType, content.id);
        const logo = images.logos?.find((l: any) => l.iso_639_1 === 'en' || l.iso_639_1 === 'pt') || images.logos?.[0];
        setLogoPath(logo?.file_path || null);
      } catch (error) {
        console.error('Error fetching logo:', error);
        setLogoPath(null);
      } finally {
        setLoadingLogo(false);
      }
    }

    fetchLogo();
  }, [content]);

  if (!content) return null;

  const title = content.title || content.name || '';
  const overview = content.overview || '';
  const backdropUrl = content.backdrop_path 
    ? getImageUrl(content.backdrop_path, 'original')
    : '';

  // Mapear genre_ids para nomes (simplificado)
  const genreMap: { [key: number]: string } = {
    28: 'Ação',
    12: 'Aventura',
    16: 'Animação',
    35: 'Comédia',
    80: 'Crime',
    99: 'Documentário',
    18: 'Drama',
    10751: 'Família',
    14: 'Fantasia',
    36: 'História',
    27: 'Terror',
    10402: 'Música',
    9648: 'Mistério',
    10749: 'Romance',
    878: 'Ficção científica',
    53: 'Thriller',
    10752: 'Guerra',
    37: 'Faroeste',
    10759: 'Action & Adventure',
    10762: 'Infantil',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics'
  };

  const genres = content.genre_ids?.map(id => genreMap[id]).filter(Boolean) || [];

  return (
    <>
      {/* Hero Background Image - Full Width (MESMA ALTURA DA PÁGINA INICIAL) */}
      <div className="absolute top-0 left-0 w-full h-screen overflow-hidden z-[5]">
        {backdropUrl && (
          <div className="absolute top-0 left-0 w-full h-full transition-opacity duration-500">
            <OptimizedImage
              src={backdropUrl}
              alt={title}
              priority={true}
              width={1920}
              height={1080}
              quality={90}
              useProxy={true}
              className="w-full h-full object-cover"
              style={{ 
                objectPosition: 'center top'
              }}
            />
          </div>
        )}
      </div>
      
      {/* Hero Gradient Overlay - Escurece laterais (IGUAL AO HEROSLIDER) */}
      <div className="absolute bg-gradient-to-r from-[#141414] from-0% via-[rgba(20,20,20,0.5)] via-40% to-transparent to-70% h-screen top-0 left-0 w-full transition-all duration-300 z-[6]" />
      
      {/* Bottom Gradient - Transição suave (IGUAL AO HEROSLIDER) */}
      <div 
        className="absolute left-0 w-full h-48 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-transparent transition-all duration-300 z-[7]"
        style={{ bottom: 0 }}
      />
      
      {/* Hero Content (IGUAL AO HEROSLIDER) */}
      <div className="absolute content-stretch flex flex-col gap-3 md:gap-6 items-start top-[25vh] sm:top-[30vh] md:top-[35vh] w-full max-w-[90%] sm:max-w-[500px] md:max-w-[600px] z-[8] px-4 md:px-12 left-0 transition-all duration-300">
        <div className="content-stretch flex flex-col gap-2 md:gap-[14px] items-start relative shrink-0 w-full">
          {/* Logo ou Título */}
          {loadingLogo ? (
            <div className="h-[50px] sm:h-[60px] md:h-[80px] w-[200px] sm:w-[250px] md:w-[300px] bg-white/10 rounded animate-pulse" />
          ) : logoPath ? (
            <div className="relative w-full max-w-[200px] sm:max-w-[250px] md:max-w-[300px] h-[50px] sm:h-[60px] md:h-[80px]">
              <img 
                src={getImageUrl(logoPath, 'w500')} 
                alt={title}
                className="w-full h-full object-contain object-left"
              />
            </div>
          ) : (
            <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-tight not-italic relative shrink-0 text-2xl sm:text-3xl md:text-[40px] text-white uppercase">
              {title}
            </p>
          )}
          
          {/* Tags de Gênero */}
          <GenreTags genres={genres} />
          
          {/* Overview */}
          <div className="font-['Inter:Medium',sans-serif] font-medium leading-normal not-italic relative shrink-0 text-[#bebebe] text-xs sm:text-sm md:text-[14px] max-w-full">
            <p className="mb-0 line-clamp-3 md:line-clamp-4">{overview || 'Descrição não disponível.'}</p>
          </div>
        </div>
        
        {/* Botões */}
        <div className="content-stretch flex gap-[12px] items-center relative shrink-0">
          <PlayButton onClick={onPlayClick} />
          <InfoButton onClick={onInfoClick} />
        </div>
      </div>
    </>
  );
}