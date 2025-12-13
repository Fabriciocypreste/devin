import { useState, useEffect } from 'react';
import { Movie, getImageUrl, getTitle } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';
import { getCachedLogo } from '../utils/tmdbCache';

interface ContinueWatchingCardProps {
  movie: Movie;
  progress?: number;
  onClick?: () => void;
}

export function ContinueWatchingCard({ movie, progress = 54, onClick }: ContinueWatchingCardProps) {
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const progressWidth = (progress / 100) * 320;
  
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
        const logo = await getCachedLogo(mediaType, movie.id);
        
        if (logo) {
          setLogoPath(logo);
        }
      } catch (error) {
        // Silenciar erro para não poluir console
      }
    };
    
    fetchLogo();
  }, [movie.id, movie.media_type, movie.title]);
  
  return (
    <div 
      className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-[320px] cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-[#d9d9d9] h-[180px] relative rounded-[10px] shrink-0 w-full overflow-hidden group">
        {movie.backdrop_path ? (
          <OptimizedImage
            src={getImageUrl(movie.backdrop_path, 'w500')} 
            alt={getTitle(movie)}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            priority={false}
            blur={true}
            quality={75}
            width={500}
            height={281}
            useProxy={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/50">
            No Image
          </div>
        )}
        
        {/* Logo do Filme/Série - Card Continuar Assistindo */}
        {logoPath && (
          <div className="absolute top-2 left-2 max-w-[40%]">
            <img
              src={getImageUrl(logoPath, 'w300')}
              alt={`${getTitle(movie)} logo`}
              className="w-full h-auto max-h-10 object-contain drop-shadow-lg"
            />
          </div>
        )}
        
        <div aria-hidden="true" className="absolute border-[1.5px] border-[rgba(255,255,255,0.5)] border-solid inset-0 pointer-events-none rounded-[10px]" />
      </div>
      <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
        <div className="[grid-area:1_/_1] bg-[#d9d9d9] h-[4px] ml-0 mt-0 w-[320px]" />
        <div 
          className="[grid-area:1_/_1] bg-red-500 h-[4px] ml-0 mt-0 transition-all duration-300" 
          style={{ width: `${progressWidth}px` }}
        />
      </div>
    </div>
  );
}
