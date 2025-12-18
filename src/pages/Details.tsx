/**
 * REDFLIX DETAILS PAGE
 * Página de detalhes de conteúdo com integração TMDB
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contentService } from '../services/contentService';
import { tmdbService } from '../services/tmdbService';
import { EnrichedContent } from '../types/content';
import { addToFavorites, removeFromFavorites, isFavorite } from '../utils/favorites';
import { addToHistory } from '../utils/history';

interface DetailsProps {
  onPlay?: (item: EnrichedContent) => void;
}

export function Details({ onPlay }: DetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [content, setContent] = useState<EnrichedContent | null>(null);
  const [similar, setSimilar] = useState<EnrichedContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [tmdbDetails, setTmdbDetails] = useState<any>(null);

  useEffect(() => {
    loadContent();
  }, [id]);

  useEffect(() => {
    if (content) {
      setIsFav(isFavorite(content.id));
    }
  }, [content]);

  const loadContent = async () => {
    if (!id) {
      navigate('/');
      return;
    }

    setIsLoading(true);

    try {
      await contentService.loadAllContent();
      
      // Busca em todos os tipos de conteúdo
      const allContent = [
        ...contentService.getMovies(),
        ...contentService.getSeries(),
        ...contentService.getChannels()
      ];
      
      const item = allContent.find(c => c.id === id);
      
      if (!item) {
        console.error('Conteúdo não encontrado');
        navigate('/');
        return;
      }
      
      setContent(item);
      
      // Carrega detalhes do TMDB se disponível
      if (item.tmdbId && item.type !== 'channel') {
        try {
          const details = await tmdbService.getDetails(
            item.tmdbId,
            item.type === 'series' ? 'tv' : 'movie'
          );
          setTmdbDetails(details);
        } catch (error) {
          console.error('Erro ao carregar detalhes TMDB:', error);
        }
      }
      
      // Carrega conteúdo similar
      loadSimilarContent(item);
    } catch (error) {
      console.error('Erro ao carregar conteúdo:', error);
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSimilarContent = async (item: EnrichedContent) => {
    try {
      const allContent = [
        ...contentService.getMovies(),
        ...contentService.getSeries(),
        ...contentService.getChannels()
      ];
      
      // Filtra por tipo e gêneros similares
      const similarItems = allContent
        .filter(c => 
          c.id !== item.id && 
          c.type === item.type &&
          c.genres?.some(g => item.genres?.includes(g))
        )
        .slice(0, 12);
      
      setSimilar(similarItems);
    } catch (error) {
      console.error('Erro ao carregar conteúdo similar:', error);
    }
  };

  const handlePlay = () => {
    if (content) {
      addToHistory(content, 0);
      onPlay?.(content);
    }
  };

  const handleFavorite = () => {
    if (!content) return;
    
    if (isFav) {
      removeFromFavorites(content.id);
      setIsFav(false);
    } else {
      addToFavorites(content);
      setIsFav(true);
    }
  };

  const handleShare = async () => {
    if (!content) return;
    
    const shareData = {
      title: content.title,
      text: `Assista ${content.title} no RedFlix!`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copia URL para clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado para a área de transferência!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!content) {
    return null;
  }

  const backdropUrl = content.backdropPath || content.posterPath;
  const releaseYear = content.year || (content.releaseDate ? new Date(content.releaseDate).getFullYear() : null);
  const rating = content.rating ? (content.rating * 10).toFixed(0) : null;

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] md:h-[80vh]">
        {/* Backdrop Image */}
        {backdropUrl && (
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={content.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent"></div>
          </div>
        )}

        {/* Content Info */}
        <div className="relative z-10 flex h-full items-end px-6 md:px-12 pb-12">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              {content.title}
            </h1>
            
            {content.originalTitle && content.originalTitle !== content.title && (
              <p className="text-xl text-gray-300 mb-4">
                Título Original: {content.originalTitle}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6 text-gray-300">
              {releaseYear && <span className="text-lg">{releaseYear}</span>}
              {rating && (
                <span className="flex items-center gap-1 text-lg">
                  <span className="text-yellow-400">⭐</span>
                  {rating}%
                </span>
              )}
              {content.runtime && (
                <span className="text-lg">{content.runtime} min</span>
              )}
              {content.type && (
                <span className="px-3 py-1 bg-gray-800/80 backdrop-blur-md rounded text-sm uppercase">
                  {content.type === 'movie' ? 'Filme' : content.type === 'series' ? 'Série' : 'Canal'}
                </span>
              )}
            </div>

            {content.genres && content.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {content.genres.map(genre => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-gray-900/70 backdrop-blur-md border border-gray-700 rounded-full text-sm text-gray-300"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handlePlay}
                className="flex items-center gap-2 px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                <span className="text-xl">▶</span>
                Assistir
              </button>
              
              <button
                onClick={handleFavorite}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 backdrop-blur-md hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
              >
                <span className="text-xl">{isFav ? '❤️' : '🤍'}</span>
                {isFav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 backdrop-blur-md hover:bg-gray-700 text-white rounded-lg transition-colors border border-gray-700"
              >
                <span className="text-xl">🔗</span>
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="px-6 md:px-12 py-12">
        {/* Synopsis */}
        {content.overview && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Sinopse</h2>
            <p className="text-lg text-gray-300 leading-relaxed max-w-4xl">
              {content.overview}
            </p>
          </div>
        )}

        {/* Cast and Crew */}
        {content.cast && content.cast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Elenco</h2>
            <div className="flex flex-wrap gap-3">
              {content.cast.map((actor, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-900/50 backdrop-blur-md border border-gray-700 rounded-lg text-gray-300"
                >
                  {actor}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Similar Content */}
        {similar.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Títulos Similares</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similar.map(item => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/details/${item.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-2">
                    {item.posterPath ? (
                      <img
                        src={item.posterPath}
                        alt={item.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-900 flex items-center justify-center">
                        <span className="text-4xl">🎬</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors"></div>
                  </div>
                  <h3 className="text-sm text-white group-hover:text-red-500 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
