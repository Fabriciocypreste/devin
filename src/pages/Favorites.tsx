/**
 * REDFLIX FAVORITES PAGE
 * Lista de conteúdos favoritos do usuário
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, getFavoritesByType, removeFromFavorites } from '../utils/favorites';
import { EnrichedContent } from '../types/content';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../utils/tmdb';

interface FavoritesProps {
  onPlay: (item: EnrichedContent) => void;
}

export function Favorites({ onPlay }: FavoritesProps) {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<EnrichedContent[]>([]);
  const [selectedType, setSelectedType] = useState<'all' | 'movie' | 'series' | 'channel'>('all');

  useEffect(() => {
    loadFavorites();
    
    // Listener para atualizar quando favoritos mudarem
    const handleFavoritesChanged = () => loadFavorites();
    window.addEventListener('favoritesChanged', handleFavoritesChanged);
    
    return () => {
      window.removeEventListener('favoritesChanged', handleFavoritesChanged);
    };
  }, [selectedType]);

  const loadFavorites = () => {
    const allFavorites = selectedType === 'all' 
      ? getFavorites()
      : getFavoritesByType(selectedType);
    setFavorites(allFavorites);
  };

  const handleRemove = (id: string) => {
    if (confirm('Remover dos favoritos?')) {
      removeFromFavorites(id);
      loadFavorites();
    }
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
        <h1 className="text-4xl font-bold text-white mb-6">Meus Favoritos</h1>
        
        {/* Type Filter */}
        <div className="flex flex-wrap gap-3">
          {['all', 'movie', 'series', 'channel'].map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type as any)}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
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

      {/* Results Count */}
      {favorites.length > 0 && (
        <p className="text-gray-400 mb-6">
          {favorites.length} favorito{favorites.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {favorites.map(item => (
            <div key={item.id} className="relative group">
              <MovieCard
                movie={toMovie(item)}
                onPlay={() => onPlay(item)}
                onDetails={() => navigate(`/details/${item.id}`)}
              />
              
              {/* Remove Button */}
              <button
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 right-2 z-10 p-2 bg-black/80 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Remover dos favoritos"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">❤️</div>
          <h3 className="text-2xl font-semibold text-white mb-2">
            Nenhum favorito ainda
          </h3>
          <p className="text-gray-400 max-w-md mb-8">
            Adicione seus filmes, séries e canais favoritos para acessá-los facilmente aqui
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
