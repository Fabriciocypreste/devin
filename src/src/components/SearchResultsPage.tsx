import { useState, useEffect } from 'react';
import { Movie, getImageUrl, getTitle } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';

// Icons inline
const SearchIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const PlayIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const InfoIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const XIcon = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface SearchResultsPageProps {
  searchQuery: string;
  allContent: Movie[];
  onClose: () => void;
  onMovieClick?: (movie: { id: number; type: 'movie' | 'tv' }) => void;
  onSearchClick?: () => void;
}

export function SearchResultsPage({ 
  searchQuery, 
  allContent, 
  onClose, 
  onMovieClick,
  onSearchClick 
}: SearchResultsPageProps) {
  const [filteredResults, setFilteredResults] = useState<Movie[]>([]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredResults([]);
      return;
    }

    const searchTerm = searchQuery.toLowerCase();
    const results = allContent.filter(item => {
      const title = getTitle(item).toLowerCase();
      const overview = (item.overview || '').toLowerCase();
      
      return title.includes(searchTerm) || overview.includes(searchTerm);
    });

    setFilteredResults(results);
    console.log(`🔍 ${results.length} resultados para "${searchQuery}"`);
  }, [searchQuery, allContent]);

  const handleContentClick = (movie: Movie) => {
    const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
    onMovieClick?.({ id: movie.id, type: mediaType as 'movie' | 'tv' });
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black to-transparent px-4 md:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              <XIcon className="w-6 h-6" />
            </button>
            
            <div className="flex items-center gap-3 flex-1 max-w-2xl">
              <SearchIcon className="w-5 h-5 text-white/60" />
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-bold">
                  Resultados para "{searchQuery}"
                </h1>
                <p className="text-sm text-white/60 mt-1">
                  {filteredResults.length} {filteredResults.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onSearchClick}
            className="bg-white/10 hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <SearchIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Grid */}
      <div className="px-4 md:px-12 py-8">
        {filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <SearchIcon className="w-16 h-16 text-white/20 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Nenhum resultado encontrado</h2>
            <p className="text-white/60 max-w-md">
              Não encontramos nenhum título que corresponda à sua busca por "{searchQuery}".
              Tente usar palavras-chave diferentes.
            </p>
            <button
              onClick={onSearchClick}
              className="mt-6 bg-[#E50914] hover:bg-[#f40612] text-white px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Fazer Nova Busca
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
            {filteredResults.map((item) => (
              <div
                key={`${item.id}-${item.media_type || 'movie'}`}
                className="group cursor-pointer"
                onClick={() => handleContentClick(item)}
              >
                <div className="relative aspect-[2/3] rounded-md overflow-hidden bg-zinc-900">
                  <OptimizedImage
                    src={getImageUrl(item.poster_path, 'w342')}
                    alt={getTitle(item)}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    priority={false}
                    blur={true}
                    quality={75}
                    width={342}
                    height={513}
                    useProxy={false}
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex gap-2 mb-2">
                        <button 
                          className="bg-white hover:bg-white/90 text-black rounded-full p-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContentClick(item);
                          }}
                        >
                          <PlayIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContentClick(item);
                          }}
                        >
                          <InfoIcon className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <p className="text-white text-xs font-semibold line-clamp-2">
                        {getTitle(item)}
                      </p>
                      
                      {item.vote_average > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-green-500 text-xs font-bold">
                            {Math.round(item.vote_average * 10)}% relevante
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Title below poster */}
                <h3 className="mt-2 text-sm text-white/80 line-clamp-2 group-hover:text-white transition-colors">
                  {getTitle(item)}
                </h3>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
