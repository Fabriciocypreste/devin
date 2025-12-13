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

const CalendarIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const ClockIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const SearchIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

interface HistoryItem {
  movieId: number;
  timestamp: number;
  movie: Movie;
  watchedDuration?: number;
}

interface HistoryPageProps {
  onClose?: () => void;
  onMovieClick?: (movie: Movie) => void;
}

export function HistoryPage({ onClose, onMovieClick }: HistoryPageProps) {
  const [filter, setFilter] = useState<'all' | 'movies' | 'series'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Carregar histórico do localStorage
  useEffect(() => {
    const loadHistory = () => {
      try {
        const saved = localStorage.getItem('redflix_watch_history');
        if (saved) {
          const data = JSON.parse(saved);
          // Ordenar por timestamp mais recente
          const sorted = data.sort((a: HistoryItem, b: HistoryItem) => b.timestamp - a.timestamp);
          setHistory(sorted);
        }
      } catch (error) {
        console.error('Error loading history:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const filteredContent = history.filter(item => {
    // Filtro de tipo
    if (filter === 'movies' && item.movie.media_type !== 'movie') return false;
    if (filter === 'series' && item.movie.media_type !== 'tv') return false;

    // Filtro de data
    const now = Date.now();
    const itemDate = item.timestamp;
    if (dateFilter === 'today' && itemDate < now - 86400000) return false;
    if (dateFilter === 'week' && itemDate < now - 604800000) return false;
    if (dateFilter === 'month' && itemDate < now - 2592000000) return false;

    // Filtro de busca
    if (searchQuery) {
      const title = (item.movie.title || item.movie.name || '').toLowerCase();
      return title.includes(searchQuery.toLowerCase());
    }

    return true;
  });

  // Agrupar por data
  const groupedByDate = filteredContent.reduce((acc, item) => {
    const date = new Date(item.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Ontem';
    } else {
      dateKey = date.toLocaleDateString('pt-BR', { 
        day: 'numeric', 
        month: 'long',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(item);
    return acc;
  }, {} as Record<string, HistoryItem[]>);

  const handleRemove = (movieId: number) => {
    const updated = history.filter(item => item.movieId !== movieId);
    setHistory(updated);
    localStorage.setItem('redflix_watch_history', JSON.stringify(updated));
  };

  const handleClearAll = () => {
    if (confirm('Deseja limpar todo o histórico de visualização?')) {
      setHistory([]);
      localStorage.removeItem('redflix_watch_history');
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-20 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2">Histórico</h1>
            <p className="text-white/60">
              {filteredContent.length} {filteredContent.length === 1 ? 'visualização' : 'visualizações'}
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar no histórico..."
              className="w-full bg-zinc-900 border border-white/20 text-white pl-10 pr-4 py-3 rounded-md focus:outline-none focus:border-white/40 transition-colors"
            />
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
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

          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setDateFilter('all')}
              className={`px-4 py-2 rounded-full border transition-all ${
                dateFilter === 'all'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              <CalendarIcon className="w-4 h-4 inline mr-2" size={16} />
              Tudo
            </button>
            <button
              onClick={() => setDateFilter('today')}
              className={`px-4 py-2 rounded-full border transition-all ${
                dateFilter === 'today'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setDateFilter('week')}
              className={`px-4 py-2 rounded-full border transition-all ${
                dateFilter === 'week'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Esta semana
            </button>
            <button
              onClick={() => setDateFilter('month')}
              className={`px-4 py-2 rounded-full border transition-all ${
                dateFilter === 'month'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Este mês
            </button>
          </div>
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
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl mb-2">Nenhum histórico encontrado</h2>
            <p className="text-white/60">
              {searchQuery
                ? `Nenhum resultado para "${searchQuery}"`
                : filter !== 'all' || dateFilter !== 'all'
                  ? 'Tente ajustar os filtros'
                  : 'Assista algo para criar seu histórico'}
            </p>
          </div>
        )}

        {/* Content Grouped by Date */}
        {!loading && filteredContent.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedByDate).map(([date, items]) => (
              <div key={date}>
                <h2 className="text-xl mb-4 text-white/80 sticky top-20 bg-[#141414] py-2 z-10">
                  {date}
                </h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={`${item.movieId}-${item.timestamp}`}
                      className="bg-zinc-900/50 rounded-lg p-4 flex gap-4 hover:bg-zinc-900 transition-colors group"
                    >
                      <div className="w-32 h-20 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                        <ImageWithFallback
                          src={`https://image.tmdb.org/t/p/w500${item.movie.backdrop_path || item.movie.poster_path}`}
                          alt={item.movie.title || item.movie.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base mb-1 truncate">{item.movie.title || item.movie.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-white/60">
                          <span className="px-2 py-0.5 bg-white/10 rounded text-xs">
                            {item.movie.media_type === 'movie' ? 'Filme' : 'Série'}
                          </span>
                          <span className="flex items-center gap-1">
                            <ClockIcon className="w-3 h-3" size={12} />
                            {formatTime(item.timestamp)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => onMovieClick && onMovieClick(item.movie)}
                          className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                        >
                          <PlayIcon className="w-4 h-4 fill-current" size={16} />
                          Assistir
                        </button>
                        <button
                          onClick={() => onMovieClick && onMovieClick(item.movie)}
                          className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors"
                        >
                          <InfoIcon className="w-4 h-4" size={16} />
                        </button>
                        <button
                          onClick={() => handleRemove(item.movieId)}
                          className="px-4 py-2 bg-zinc-800 text-white/60 rounded-md hover:bg-red-600 hover:text-white transition-colors"
                        >
                          <Trash2Icon className="w-4 h-4" size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Clear All Button */}
        {!loading && history.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={handleClearAll}
              className="px-6 py-3 bg-zinc-800 text-white/60 rounded-md hover:bg-red-600 hover:text-white transition-colors inline-flex items-center gap-2"
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
