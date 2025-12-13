import { useState, useEffect } from 'react';
import { Movie } from '../utils/tmdb';

// Icons inline to avoid lucide-react dependency
const XIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PlayIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const InfoIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const StarIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const AwardIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

interface RedFlixOriginalsPageProps {
  onClose?: () => void;
  onMovieClick?: (movie: Movie) => void;
}

export function RedFlixOriginalsPage({ onClose, onMovieClick }: RedFlixOriginalsPageProps) {
  const [filter, setFilter] = useState<'all' | 'movies' | 'series'>('all');
  const [genreFilter, setGenreFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'title'>('recent');
  const [content, setContent] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  // IDs de conteúdos marcados como "RedFlix Originals"
  // Na prática, isso viria de uma API ou banco de dados
  const redflixOriginalIds = [
    // Séries populares para simular "originais"
    1399,  // Game of Thrones
    94605, // Arcane
    85271, // WandaVision
    88396, // The Falcon and the Winter Soldier
    95557, // Invincible
    106541, // Dark Crystal
    84958, // Loki
    115036, // The Lord of the Rings: The Rings of Power
    92749, // Moon Knight
    114410, // Cowboy Bebop
    
    // Filmes para simular "originais"
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

  const genres = [
    { label: 'Todos', value: 'all' },
    { label: 'Ação', value: '28' },
    { label: 'Aventura', value: '12' },
    { label: 'Animação', value: '16' },
    { label: 'Comédia', value: '35' },
    { label: 'Crime', value: '80' },
    { label: 'Drama', value: '18' },
    { label: 'Fantasia', value: '14' },
    { label: 'Ficção Científica', value: '878' },
    { label: 'Terror', value: '27' },
    { label: 'Romance', value: '10749' },
    { label: 'Suspense', value: '53' },
  ];

  // Buscar detalhes dos originais RedFlix
  useEffect(() => {
    const fetchOriginals = async () => {
      setLoading(true);
      try {
        const promises = redflixOriginalIds.map(async (id) => {
          // Tentar buscar como série
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/tv/${id}?api_key=ddb1bdf6aa91bdf335797853884b0c1d&language=pt-BR`
            );
            if (response.ok) {
              const data = await response.json();
              return { 
                ...data, 
                media_type: 'tv', 
                title: data.name,
                isRedFlixOriginal: true 
              };
            }
          } catch (error) {
            // Silencioso
          }

          // Se não for série, tentar como filme
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=ddb1bdf6aa91bdf335797853884b0c1d&language=pt-BR`
            );
            if (response.ok) {
              const data = await response.json();
              return { 
                ...data, 
                media_type: 'movie',
                isRedFlixOriginal: true 
              };
            }
          } catch (error) {
            // Silencioso
          }

          return null;
        });

        const results = await Promise.all(promises);
        const validContent = results.filter(item => item !== null) as Movie[];
        setContent(validContent);
      } catch (error) {
        console.error('Error loading RedFlix Originals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOriginals();
  }, []);

  // Filtrar e ordenar conteúdo
  const filteredContent = content
    .filter(item => {
      // Filtro de tipo
      if (filter === 'movies' && item.media_type !== 'movie') return false;
      if (filter === 'series' && item.media_type !== 'tv') return false;

      // Filtro de gênero
      if (genreFilter !== 'all') {
        const genreId = parseInt(genreFilter);
        if (!item.genre_ids?.includes(genreId)) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        const titleA = a.title || a.name || '';
        const titleB = b.title || b.name || '';
        return titleA.localeCompare(titleB);
      }
      if (sortBy === 'popular') {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      // recent - ordenar por data de lançamento
      const dateA = new Date(a.release_date || a.first_air_date || 0).getTime();
      const dateB = new Date(b.release_date || b.first_air_date || 0).getTime();
      return dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Header com Banner Premium */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#E50914]/20 via-[#141414]/80 to-[#141414]" />
        
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
          {/* Logo RedFlix ORIGINALS */}
          <div className="mb-6">
            <div className="flex items-center gap-4 justify-center mb-4">
              <AwardIcon className="w-12 h-12 text-[#E50914]" size={48} />
              <div>
                <h1 className="text-5xl md:text-7xl mb-2 tracking-tight">
                  <span className="text-[#E50914]">RED</span>
                  <span className="text-white">FLIX</span>
                </h1>
                <div className="text-xl md:text-2xl tracking-[0.3em] text-white/80">
                  ORIGINAIS
                </div>
              </div>
              <AwardIcon className="w-12 h-12 text-[#E50914]" size={48} />
            </div>
          </div>

          <p className="text-lg md:text-xl text-white/80 max-w-2xl mb-8">
            Produções exclusivas e premiadas. Conteúdo original de alta qualidade feito pela RedFlix.
          </p>

          <div className="flex items-center gap-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <AwardIcon className="w-5 h-5 text-[#E50914]" size={20} />
              <span>{content.length} Originais</span>
            </div>
            <div className="flex items-center gap-2">
              <StarIcon className="w-5 h-5 text-yellow-500 fill-yellow-500" size={20} />
              <span>Premiados</span>
            </div>
          </div>

          {/* Close button */}
          {onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-8 md:right-8 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
              <XIcon className="w-6 h-6" size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-4 mb-8 items-start lg:items-center justify-between">
          {/* Type Filter */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full border transition-all ${
                filter === 'all'
                  ? 'bg-[#E50914] text-white border-[#E50914]'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('movies')}
              className={`px-4 py-2 rounded-full border transition-all ${
                filter === 'movies'
                  ? 'bg-[#E50914] text-white border-[#E50914]'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Filmes
            </button>
            <button
              onClick={() => setFilter('series')}
              className={`px-4 py-2 rounded-full border transition-all ${
                filter === 'series'
                  ? 'bg-[#E50914] text-white border-[#E50914]'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Séries
            </button>
          </div>

          {/* Genre & Sort */}
          <div className="flex gap-4 items-center flex-wrap">
            {/* Genre Filter */}
            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="bg-black/50 border border-white/30 text-white px-4 py-2 rounded appearance-none cursor-pointer hover:border-white/60 transition-colors pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              {genres.map(genre => (
                <option key={genre.value} value={genre.value}>
                  {genre.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/50 border border-white/30 text-white px-4 py-2 rounded appearance-none cursor-pointer hover:border-white/60 transition-colors pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="recent">Mais recentes</option>
              <option value="popular">Mais populares</option>
              <option value="title">Título (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914] mx-auto mb-4"></div>
              <p className="text-white/60">Carregando originais RedFlix...</p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredContent.length === 0 && (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-[#E50914] mx-auto mb-4" />
            <h2 className="text-2xl mb-2">Nenhum original encontrado</h2>
            <p className="text-white/60">
              Tente ajustar os filtros para ver mais conteúdo
            </p>
          </div>
        )}

        {/* Results Count */}
        {!loading && filteredContent.length > 0 && (
          <div className="mb-6 text-white/60">
            {filteredContent.length} {filteredContent.length === 1 ? 'original' : 'originais'} 
            {filter !== 'all' && ` - ${filter === 'movies' ? 'Filmes' : 'Séries'}`}
            {genreFilter !== 'all' && ` - ${genres.find(g => g.value === genreFilter)?.label}`}
          </div>
        )}

        {/* Content Grid */}
        {!loading && filteredContent.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredContent.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* RedFlix Original Badge */}
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-2">
                    <div className="bg-[#E50914] text-white text-[10px] font-bold px-2 py-1 rounded inline-flex items-center gap-1">
                      <AwardIcon className="w-3 h-3" size={12} />
                      ORIGINAL
                    </div>
                  </div>
                  
                  {/* Rating badge */}
                  {item.vote_average && item.vote_average > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                      <StarIcon className="w-3 h-3 fill-yellow-500 text-yellow-500" size={12} />
                      {item.vote_average.toFixed(1)}
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => onMovieClick && onMovieClick(item)}
                      className="w-full bg-white text-black py-2 rounded-md hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <PlayIcon className="w-4 h-4 fill-current" size={16} />
                      Assistir
                    </button>
                    <button
                      onClick={() => onMovieClick && onMovieClick(item)}
                      className="w-full bg-zinc-700 text-white py-2 rounded-md hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <InfoIcon className="w-4 h-4" size={16} />
                      Detalhes
                    </button>
                  </div>
                </div>
                
                <div className="mt-2">
                  <h3 className="text-sm line-clamp-1">{item.title || item.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                    <span>{item.media_type === 'movie' ? 'Filme' : 'Série'}</span>
                    {(item.release_date || item.first_air_date) && (
                      <>
                        <span>•</span>
                        <span>
                          {new Date(item.release_date || item.first_air_date || '').getFullYear()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
