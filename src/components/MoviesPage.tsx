import { useState, useEffect } from 'react';
import { Movie } from '../utils/tmdb';
import { CategoryBanner } from './CategoryBanner';
import { MovieCard } from './MovieCard';
import { loadAllContent } from '../utils/primeVicioLoader';

// Icons inline to avoid lucide-react dependency
const ChevronDownIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const Grid3x3Icon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ListIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

interface MoviesPageProps {
  onClose?: () => void;
  onMovieClick?: (movie: Movie) => void;
  onPlay?: (movie: Movie) => void; // ✅ NOVO: Callback para reproduzir diretamente
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  myList?: number[];
  likedList?: number[];
  watchLaterList?: number[];
}

export function MoviesPage({ 
  onClose, 
  onMovieClick,
  onPlay,
  onAddToList,
  onLike,
  onWatchLater,
  myList = [],
  likedList = [],
  watchLaterList = []
}: MoviesPageProps) {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenreDropdown, setShowGenreDropdown] = useState(false);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const genres = [
    { id: 'all', name: 'Todos os gêneros' },
    { id: '28', name: 'Ação' },
    { id: '12', name: 'Aventura' },
    { id: '16', name: 'Animação' },
    { id: '35', name: 'Comédia' },
    { id: '80', name: 'Crime' },
    { id: '99', name: 'Documentário' },
    { id: '18', name: 'Drama' },
    { id: '10751', name: 'Família' },
    { id: '14', name: 'Fantasia' },
    { id: '36', name: 'História' },
    { id: '27', name: 'Terror' },
    { id: '10402', name: 'Música' },
    { id: '9648', name: 'Mistério' },
    { id: '10749', name: 'Romance' },
    { id: '878', name: 'Ficção científica' },
    { id: '10770', name: 'Cinema TV' },
    { id: '53', name: 'Thriller' },
    { id: '10752', name: 'Guerra' },
    { id: '37', name: 'Faroeste' },
  ];

  // Carregar filmes do local_content.json e tmdb_content.json
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        console.log('🎬 Carregando filmes do conteúdo local e TMDB...');
        
        // Carregar conteúdo usando o loader progressivo
        const { movies: allMovies } = await loadAllContent();
        
        console.log(`✅ ${allMovies.length} filmes carregados`);
        
        // Filtrar por gênero se selecionado
        let filteredMovies = allMovies;
        if (selectedGenre !== 'all') {
          const genreId = parseInt(selectedGenre);
          filteredMovies = allMovies.filter((movie: any) => 
            movie.genre_ids?.includes(genreId) || 
            movie.genres?.some((g: any) => g.id === genreId || g === genreId)
          );
        }
        
        // Converter para o tipo Movie
        const processedMovies: Movie[] = filteredMovies.map((movie: any) => ({
          id: movie.id,
          title: movie.title || movie.name,
          name: movie.name || movie.title,
          overview: movie.overview || 'Conteúdo disponível para reprodução.',
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average || 7.5,
          vote_count: movie.vote_count || 0,
          popularity: movie.popularity || 0,
          release_date: movie.release_date,
          genre_ids: movie.genre_ids || [],
          adult: false,
          original_language: 'pt',
          original_title: movie.title || movie.name,
          media_type: 'movie',
          streamUrl: movie.streamUrl,
          isLocal: movie.isLocal
        }));
        
        setMovies(processedMovies);
        setFeaturedMovie(processedMovies[0] || null);
        setLoading(false);
        
      } catch (error) {
        console.error('❌ Erro ao carregar filmes:', error);
        setMovies([]);
        setFeaturedMovie(null);
        setLoading(false);
      }
    };

    fetchMovies();
  }, [selectedGenre]);

  const selectedGenreName = genres.find(g => g.id === selectedGenre)?.name || 'Todos os gêneros';

  return (
    <div className="min-h-screen bg-[#141414] text-white relative">
      {/* Featured Movie Banner - TELA CHEIA IGUAL PÁGINA INICIAL */}
      {!loading && featuredMovie && (
        <div className="relative h-screen">
          {/* Genre Filter - Positioned above banner */}
          <div className="absolute top-20 left-0 right-0 z-30 px-4 md:px-8 lg:px-12">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl md:text-4xl font-bold drop-shadow-lg">Filmes</h1>
              
              {/* Genre Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowGenreDropdown(!showGenreDropdown)}
                  className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-black/70 border border-white/30 rounded hover:border-white/60 transition-colors backdrop-blur-sm"
                >
                  <span className="text-xs md:text-sm font-medium">{selectedGenreName}</span>
                  <ChevronDownIcon className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${showGenreDropdown ? 'rotate-180' : ''}`} size={16} />
                </button>

                {/* Dropdown Menu */}
                {showGenreDropdown && (
                  <>
                    {/* Overlay to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40"
                      onClick={() => setShowGenreDropdown(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-[280px] md:w-[600px] bg-black/95 border border-white/30 rounded shadow-2xl z-50 max-h-[400px] overflow-y-auto backdrop-blur-md">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 p-2">
                        {genres.map((genre) => (
                          <button
                            key={genre.id}
                            onClick={() => {
                              setSelectedGenre(genre.id);
                              setShowGenreDropdown(false);
                            }}
                            className={`px-3 py-2 text-left text-xs md:text-sm hover:bg-white/10 transition-colors rounded ${
                              selectedGenre === genre.id ? 'bg-white/20 text-white font-semibold' : 'text-white/80'
                            }`}
                          >
                            {genre.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <CategoryBanner
            content={featuredMovie}
            onPlayClick={() => onMovieClick && onMovieClick(featuredMovie)}
            onInfoClick={() => onMovieClick && onMovieClick(featuredMovie)}
          />
        </div>
      )}

      {/* Content Section - COMEÇA NA MESMA POSIÇÃO DA PÁGINA INICIAL */}
      <div 
        className="absolute left-0 right-0 pb-24 md:pb-20 px-4 md:px-8 lg:px-12"
        style={{ 
          top: loading ? '5rem' : 'calc(100vh + 75px)'
        }}
      >
        {/* View Mode Toggle - Moved to top right */}
        {!loading && (
          <div className="flex items-center justify-end mb-6 gap-4">
            {/* View Mode Toggle */}
            <div className="hidden md:flex gap-2 bg-black/50 border border-white/30 rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <Grid3x3Icon className="w-5 h-5" size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <ListIcon className="w-5 h-5" size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-white/60">
            {movies.length} filmes
            {selectedGenre !== 'all' && ` - ${selectedGenreName}`}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
          </div>
        )}

        {/* Grid View - COM EFEITOS HOVER DA PÁGINA INICIAL */}
        {!loading && viewMode === 'grid' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px]">
            {movies.map((movie) => (
              <div
                key={movie.id}
                onMouseEnter={() => setHoveredId(movie.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="touch-manipulation relative"
                style={{ 
                  transform: hoveredId === movie.id ? 'scale(1.05)' : 'scale(1)',
                  opacity: hoveredId !== null && hoveredId !== movie.id ? 0.5 : 1,
                  transition: 'transform 0.3s, opacity 0.3s',
                  zIndex: hoveredId === movie.id ? 100 : 1
                }}
              >
                <MovieCard
                  movie={movie}
                  onClick={() => onMovieClick && onMovieClick(movie)}
                  onPlay={onPlay ? () => onPlay(movie) : undefined}
                  onAddToList={() => onAddToList?.(movie)}
                  onLike={() => onLike?.(movie)}
                  onWatchLater={() => onWatchLater?.(movie)}
                  isInList={myList.includes(movie.id)}
                  isLiked={likedList.includes(movie.id)}
                  isInWatchLater={watchLaterList.includes(movie.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && viewMode === 'list' && (
          <div className="space-y-3">
            {movies.map((movie) => (
              <div
                key={movie.id}
                className="bg-zinc-900/50 rounded-lg p-4 flex gap-4 hover:bg-zinc-900 transition-colors cursor-pointer"
                onClick={() => onMovieClick && onMovieClick(movie)}
              >
                <div className="w-24 h-36 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg mb-1">{movie.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/60 mb-2">
                    {movie.release_date && (
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    )}
                    {movie.vote_average > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-yellow-500">★ {movie.vote_average.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm text-white/60 line-clamp-2">{movie.overview}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && movies.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl mb-2">Nenhum filme encontrado</h2>
            <p className="text-white/60">Tente selecionar outro gênero</p>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {showGenreDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowGenreDropdown(false)}
        />
      )}
    </div>
  );
}
