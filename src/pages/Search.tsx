/**
 * REDFLIX SEARCH PAGE
 * Busca avançada com filtros por tipo e gênero
 */

import React, { useState, useEffect, useCallback } from 'react';
import { contentService } from '../services/contentService';
import { EnrichedContent } from '../types/content';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../utils/tmdb';

interface SearchProps {
  onPlay: (item: EnrichedContent) => void;
  onDetails?: (item: EnrichedContent) => void;
}

export function Search({ onPlay, onDetails }: SearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<EnrichedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series' | 'channel'>('all');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  // Converte EnrichedContent para Movie (formato do MovieCard)
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

  // Carrega gêneros disponíveis
  useEffect(() => {
    const loadGenres = async () => {
      await contentService.loadAllContent();
      const allContent = [
        ...contentService.getMovies(),
        ...contentService.getSeries()
      ];
      
      const genresSet = new Set<string>();
      allContent.forEach(item => {
        item.genres?.forEach(genre => genresSet.add(genre));
      });
      
      setAvailableGenres(Array.from(genresSet).sort());
    };
    
    loadGenres();
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() && selectedType === 'all' && selectedGenre === 'all') {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(timer);
  }, [query, selectedType, selectedGenre]);

  const performSearch = useCallback(async () => {
    setIsLoading(true);
    
    try {
      await contentService.loadAllContent();
      
      let allContent: EnrichedContent[] = [];
      
      // Filtra por tipo
      if (selectedType === 'all') {
        allContent = [
          ...contentService.getMovies(),
          ...contentService.getSeries(),
          ...contentService.getChannels()
        ];
      } else if (selectedType === 'movie') {
        allContent = contentService.getMovies();
      } else if (selectedType === 'series') {
        allContent = contentService.getSeries();
      } else if (selectedType === 'channel') {
        allContent = contentService.getChannels();
      }
      
      // Filtra por query
      if (query.trim()) {
        const lowerQuery = query.toLowerCase();
        allContent = allContent.filter(item =>
          item.title.toLowerCase().includes(lowerQuery) ||
          item.originalTitle?.toLowerCase().includes(lowerQuery) ||
          item.overview?.toLowerCase().includes(lowerQuery)
        );
      }
      
      // Filtra por gênero
      if (selectedGenre !== 'all') {
        allContent = allContent.filter(item =>
          item.genres?.includes(selectedGenre)
        );
      }
      
      setResults(allContent);
    } catch (error) {
      console.error('Erro ao buscar conteúdo:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedType, selectedGenre]);

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6 md:px-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-6">Buscar</h1>
        
        {/* Search Input */}
        <div className="relative mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar filmes, séries ou canais..."
            className="w-full px-6 py-4 bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-600 transition-colors"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            {isLoading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
            ) : (
              <span className="text-2xl">🔍</span>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          {/* Type Filter */}
          <div className="flex gap-2">
            {['all', 'movie', 'series', 'channel'].map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type as any)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
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

          {/* Genre Filter */}
          {availableGenres.length > 0 && (
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="px-4 py-2 bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition-colors"
            >
              <option value="all">Todos os Gêneros</option>
              {availableGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Results Count */}
      {results.length > 0 && (
        <p className="text-gray-400 mb-6">
          {results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Results Grid */}
      {results.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {results.map(item => (
            <MovieCard
              key={item.id}
              movie={toMovie(item)}
              onPlay={() => onPlay(item)}
              onDetails={() => onDetails?.(item)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            {query.trim() || selectedType !== 'all' || selectedGenre !== 'all'
              ? 'Nenhum resultado encontrado'
              : 'Digite algo para buscar'}
          </h3>
          <p className="text-gray-400 max-w-md">
            {query.trim() || selectedType !== 'all' || selectedGenre !== 'all'
              ? 'Tente usar palavras-chave diferentes ou remover os filtros'
              : 'Procure por filmes, séries ou canais ao vivo'}
          </p>
        </div>
      )}
    </div>
  );
}
