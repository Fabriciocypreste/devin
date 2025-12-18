/**
 * REDFLIX HISTORY PAGE
 * Histórico de visualização com progresso
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  getHistory, 
  getHistoryByPeriod, 
  getHistoryByType,
  clearHistory,
  removeFromHistory,
  HistoryItem 
} from '../utils/history';
import { EnrichedContent } from '../types/content';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../utils/tmdb';

interface HistoryProps {
  onPlay: (item: EnrichedContent) => void;
}

export function History({ onPlay }: HistoryProps) {
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series' | 'channel'>('all');

  useEffect(() => {
    loadHistory();
    
    // Listener para atualizar quando histórico mudar
    const handleHistoryChanged = () => loadHistory();
    window.addEventListener('historyChanged', handleHistoryChanged);
    
    return () => {
      window.removeEventListener('historyChanged', handleHistoryChanged);
    };
  }, [selectedPeriod, selectedType]);

  const loadHistory = () => {
    let items = getHistoryByPeriod(selectedPeriod);
    
    if (selectedType !== 'all') {
      items = items.filter(item => item.content.type === selectedType);
    }
    
    setHistory(items);
  };

  const handleClearAll = () => {
    if (confirm('Isso irá apagar todo o seu histórico de visualização. Deseja continuar?')) {
      clearHistory();
      loadHistory();
    }
  };

  const handleRemove = (id: string) => {
    if (confirm('Remover do histórico?')) {
      removeFromHistory(id);
      loadHistory();
    }
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  const toMovie = (item: EnrichedContent): Movie => ({
    id: typeof item.id === 'number' ? item.id : parseInt(item.id) || 0,
    title: item.title,
    name: item.title,
    overview: item.overview || '',
    poster_path: item.posterPath || '',
    backdrop_path: item.backdropPath || '',
    vote_average: item.rating || 0,
    media_type: item.type === 'series' ? 'tv' : item.type === 'movie' ? 'movie' : 'tv',
    release_date: item.releaseDate,
    first_air_date: item.releaseDate,
    streamUrl: item.streamUrl
  });

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6 md:px-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-bold text-white">Histórico</h1>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
            >
              Limpar Tudo
            </button>
          )}
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-4">
          {/* Period Filter */}
          <div className="flex gap-2">
            {['all', 'today', 'week', 'month'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  selectedPeriod === period
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-900/50 backdrop-blur-md text-gray-400 hover:text-white border border-gray-700'
                }`}
              >
                {period === 'all' ? 'Tudo' : 
                 period === 'today' ? 'Hoje' :
                 period === 'week' ? 'Esta Semana' : 'Este Mês'}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex gap-2">
            {['all', 'movie', 'series', 'channel'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                  selectedType === type
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-900/50 backdrop-blur-md text-gray-400 hover:text-white border border-gray-700'
                }`}
              >
                {type === 'all' ? 'Todos' : 
                 type === 'movie' ? 'Filmes' :
                 type === 'series' ? 'Séries' : 'Canais'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      {history.length > 0 && (
        <p className="text-gray-400 mb-6">
          {history.length} item{history.length !== 1 ? 's' : ''} no histórico
        </p>
      )}

      {/* History List */}
      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map(item => (
            <div
              key={item.content.id}
              className="flex gap-4 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-4 hover:border-red-600 transition-colors group"
            >
              {/* Poster */}
              <div
                className="relative w-32 h-48 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => navigate(`/details/${item.content.id}`)}
              >
                {item.content.posterPath ? (
                  <img
                    src={item.content.posterPath}
                    alt={item.content.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
                
                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                  <div
                    className="h-full bg-red-600"
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3
                  className="text-xl font-semibold text-white mb-2 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() => navigate(`/details/${item.content.id}`)}
                >
                  {item.content.title}
                </h3>
                
                {item.content.overview && (
                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                    {item.content.overview}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-4">
                  <span>{formatDate(item.lastWatched)}</span>
                  <span>{item.progress}% assistido</span>
                  {item.content.type && (
                    <span className="px-2 py-1 bg-gray-800 rounded text-xs uppercase">
                      {item.content.type === 'movie' ? 'Filme' : 
                       item.content.type === 'series' ? 'Série' : 'Canal'}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => onPlay(item.content)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm font-medium"
                  >
                    <span>▶</span>
                    {item.progress >= 5 && item.progress < 95 ? 'Continuar' : 'Assistir'}
                  </button>
                  
                  <button
                    onClick={() => navigate(`/details/${item.content.id}`)}
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
                  >
                    Detalhes
                  </button>
                  
                  <button
                    onClick={() => handleRemove(item.content.id)}
                    className="px-4 py-2 bg-gray-800 hover:bg-red-600 text-white rounded-lg transition-colors text-sm"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📜</div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Nenhum histórico
          </h3>
          <p className="text-gray-400 max-w-md mb-8">
            {selectedPeriod !== 'all' || selectedType !== 'all'
              ? 'Nenhum item encontrado para os filtros selecionados'
              : 'Comece a assistir algo e seu histórico aparecerá aqui'}
          </p>
          <button
            onClick={() => navigate('/home')}
            className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
          >
            Explorar Conteúdo
          </button>
        </div>
      )}
    </div>
  );
}
