/**
 * REDFLIX 404 PAGE
 * Página de erro 404 - Não encontrado
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { EnrichedContent } from '../types/content';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../utils/tmdb';

interface NotFoundProps {
  onPlay?: (item: EnrichedContent) => void;
}

export function NotFound({ onPlay }: NotFoundProps) {
  const navigate = useNavigate();
  const [popularContent, setPopularContent] = useState<EnrichedContent[]>([]);

  useEffect(() => {
    loadPopularContent();
  }, []);

  const loadPopularContent = async () => {
    try {
      await contentService.loadAllContent();
      
      // Pega conteúdo aleatório para sugestões
      const allContent = [
        ...contentService.getMovies(),
        ...contentService.getSeries()
      ];
      
      // Embaralha e pega os primeiros 6
      const shuffled = allContent.sort(() => 0.5 - Math.random());
      setPopularContent(shuffled.slice(0, 6));
    } catch (error) {
      console.error('Erro ao carregar conteúdo popular:', error);
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
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-4xl w-full text-center">
        {/* 404 Animation */}
        <div className="mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-red-600 via-red-500 to-red-600 bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Página Não Encontrada
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Ops! Parece que você se perdeu no catálogo do RedFlix.
            <br />
            A página que você está procurando não existe ou foi removida.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => navigate('/home')}
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors text-lg"
            >
              🏠 Voltar para Início
            </button>
            
            <button
              onClick={() => navigate(-1)}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-lg border border-gray-700"
            >
              ← Voltar
            </button>
            
            <button
              onClick={() => navigate('/search')}
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors text-lg border border-gray-700"
            >
              🔍 Buscar
            </button>
          </div>
        </div>

        {/* Suggestions */}
        {popularContent.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white mb-6 text-left">
              Que tal assistir algo?
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {popularContent.map(item => (
                <MovieCard
                  key={item.id}
                  movie={toMovie(item)}
                  onPlay={() => {
                    if (onPlay) {
                      onPlay(item);
                    } else {
                      navigate(`/details/${item.id}`);
                    }
                  }}
                  onDetails={() => navigate(`/details/${item.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Fun Facts */}
        <div className="mt-16 p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl">
          <h4 className="text-lg font-semibold text-white mb-2">💡 Você sabia?</h4>
          <p className="text-gray-400">
            O código de erro 404 foi criado em 1992 no CERN, onde a World Wide Web nasceu.
            O número não tem significado especial – era apenas o próximo número disponível!
          </p>
        </div>
      </div>
    </div>
  );
}
