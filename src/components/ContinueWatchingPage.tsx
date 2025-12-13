import { useState, useEffect } from 'react';
import { Movie } from '../utils/tmdb';
import { ImageWithFallback } from './figma/ImageWithFallback';

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

const Trash2Icon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const RotateCcwIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="1 4 1 10 7 10"></polyline>
    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
  </svg>
);

interface WatchProgress {
  movieId: number;
  progress: number; // 0-100
  timestamp: number;
  duration: number;
  movie: Movie;
}

interface ContinueWatchingPageProps {
  onClose?: () => void;
  onMovieClick?: (movie: Movie) => void;
}

export function ContinueWatchingPage({ onClose, onMovieClick }: ContinueWatchingPageProps) {
  const [filter, setFilter] = useState<'all' | 'movies' | 'series'>('all');
  const [watchList, setWatchList] = useState<WatchProgress[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar histórico de assistidos do localStorage
  useEffect(() => {
    const loadWatchProgress = () => {
      try {
        const saved = localStorage.getItem('redflix_continue_watching');
        if (saved) {
          const data = JSON.parse(saved);
          // Ordenar por timestamp mais recente
          const sorted = data.sort((a: WatchProgress, b: WatchProgress) => b.timestamp - a.timestamp);
          setWatchList(sorted);
        }
      } catch (error) {
        console.error('Error loading watch progress:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchProgress();
  }, []);

  const filteredContent = watchList.filter(item => {
    if (filter === 'movies') return item.movie.media_type === 'movie';
    if (filter === 'series') return item.movie.media_type === 'tv';
    return true;
  });

  const handleRemove = (movieId: number) => {
    const updated = watchList.filter(item => item.movieId !== movieId);
    setWatchList(updated);
    localStorage.setItem('redflix_continue_watching', JSON.stringify(updated));
  };

  const handleContinueWatching = (item: WatchProgress) => {
    if (onMovieClick) {
      onMovieClick(item.movie);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min restantes`;
    }
    return `${minutes} min restantes`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Agora mesmo';
    if (seconds < 3600) return `Há ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Há ${Math.floor(seconds / 3600)} horas`;
    if (seconds < 604800) return `Há ${Math.floor(seconds / 86400)} dias`;
    return `Há ${Math.floor(seconds / 604800)} semanas`;
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-20 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2">Continue Assistindo</h1>
            <p className="text-white/60">
              {filteredContent.length} {filteredContent.length === 1 ? 'título' : 'títulos'} em andamento
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <XIcon className="w-6 h-6" size={24} />
            </button>
          )}
        </div>

        {/* Filtros */}
        <div className="flex gap-2 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === 'all'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white/30 hover:border-white/60'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('movies')}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === 'movies'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white/30 hover:border-white/60'
            }`}
          >
            Filmes
          </button>
          <button
            onClick={() => setFilter('series')}
            className={`px-4 py-2 rounded-full border transition-all ${
              filter === 'series'
                ? 'bg-white text-black border-white'
                : 'bg-transparent text-white border-white/30 hover:border-white/60'
            }`}
          >
            Séries
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredContent.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">▶️</div>
            <h2 className="text-2xl mb-2">Nada por aqui ainda</h2>
            <p className="text-white/60">
              {filter !== 'all' 
                ? `Nenhum ${filter === 'movies' ? 'filme' : 'série'} em andamento`
                : 'Comece a assistir algo para aparecer aqui'}
            </p>
          </div>
        )}

        {/* Content List */}
        {!loading && filteredContent.length > 0 && (
          <div className="space-y-4">
            {filteredContent.map((item) => (
              <div
                key={item.movieId}
                className="bg-zinc-900/50 rounded-lg overflow-hidden hover:bg-zinc-900 transition-colors group"
              >
                <div className="flex gap-4 p-4">
                  {/* Thumbnail com overlay de progresso */}
                  <div className="relative w-48 h-28 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                    <ImageWithFallback
                      src={`https://image.tmdb.org/t/p/w500${item.movie.backdrop_path || item.movie.poster_path}`}
                      alt={item.movie.title || item.movie.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Play overlay */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <PlayIcon className="w-6 h-6 fill-white text-white ml-1" size={24} />
                      </div>
                    </div>
                    {/* Progress indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        className="h-full bg-[#E50914]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg mb-1 truncate">{item.movie.title || item.movie.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-white/60 mb-2 flex-wrap">
                          <span className="px-2 py-1 bg-white/10 rounded text-xs">
                            {item.movie.media_type === 'movie' ? 'Filme' : 'Série'}
                          </span>
                          <span>{Math.round(item.progress)}% assistido</span>
                          <span>•</span>
                          <span>{formatTimeAgo(item.timestamp)}</span>
                        </div>
                        <p className="text-sm text-white/60 line-clamp-2">{item.movie.overview}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleContinueWatching(item)}
                          className="px-6 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <PlayIcon className="w-4 h-4 fill-current" size={16} />
                          Continuar
                        </button>
                        <button
                          onClick={() => onMovieClick && onMovieClick(item.movie)}
                          className="px-6 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <InfoIcon className="w-4 h-4" size={16} />
                          Detalhes
                        </button>
                        <button
                          onClick={() => handleRemove(item.movieId)}
                          className="px-6 py-2 bg-zinc-800 text-white/60 rounded-md hover:bg-zinc-700 hover:text-white transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <Trash2Icon className="w-4 h-4" size={16} />
                          Remover
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear All Button */}
        {!loading && filteredContent.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (confirm('Deseja limpar todo o histórico de Continue Assistindo?')) {
                  setWatchList([]);
                  localStorage.removeItem('redflix_continue_watching');
                }
              }}
              className="px-6 py-3 bg-zinc-800 text-white/60 rounded-md hover:bg-zinc-700 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <Trash2Icon className="w-5 h-5" size={20} />
              Limpar todo o histórico
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
