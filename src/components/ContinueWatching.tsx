import { useState, useEffect } from 'react';
import { Movie } from '../utils/tmdb';
import { useAuth } from '../contexts/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3333';

interface ContinueWatchingItem {
  id: string;
  content: {
    id: number;
    title: string;
    posterPath: string | null;
    backdropPath: string | null;
    type: string;
    streamUrl: string | null;
  };
  episode: {
    id: number;
    name: string | null;
    stillPath: string | null;
    seasonNumber: number;
    episodeNumber: number;
  } | null;
  watchedTime: number;
  duration: number;
  percentWatched: number;
  watchedMinutes: number;
  totalMinutes: number;
  seasonNumber: number | null;
  episodeNumber: number | null;
  displayMessage: string | null;
}

interface ContinueWatchingProps {
  onPlay: (movie: Movie, streamUrl: string | null) => void;
}

export function ContinueWatching({ onPlay }: ContinueWatchingProps) {
  const { userId } = useAuth(); // Obter userId do contexto de autenticacao
  const [items, setItems] = useState<ContinueWatchingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContinueWatching = async () => {
      // Nao buscar se nao houver userId (usuario nao autenticado)
      if (!userId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE}/api/progress/user/${userId}/continue-watching`);
        const data = await response.json();
        
        if (data.continueWatching) {
          setItems(data.continueWatching);
        }
      } catch (error) {
        console.error('Erro ao buscar "Continuar Assistindo":', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContinueWatching();
  }, [userId]);

  const handlePlay = (item: ContinueWatchingItem) => {
    const movie: Movie = {
      id: item.content.id,
      title: item.content.title,
      name: item.content.type === 'series' ? item.content.title : undefined,
      poster_path: item.content.posterPath,
      backdrop_path: item.content.backdropPath,
      overview: '',
      vote_average: 0,
      release_date: item.content.type === 'movie' ? '' : undefined,
      first_air_date: item.content.type === 'series' ? '' : undefined,
    };
    
    onPlay(movie, item.content.streamUrl);
  };

  if (loading) {
    return (
      <div className="px-8 py-4">
        <div className="animate-pulse flex space-x-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="w-48 h-28 bg-gray-800 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="px-8 py-4">
      <h2 className="text-white font-bold text-xl mb-4">Continuar Assistindo</h2>
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {items.map(item => (
          <div 
            key={item.id}
            className="flex-shrink-0 w-72 bg-gray-900/80 rounded-lg overflow-hidden cursor-pointer group hover:ring-2 hover:ring-white/50 transition-all"
            onClick={() => handlePlay(item)}
          >
            {/* Thumbnail */}
            <div className="relative aspect-video">
              <img
                src={
                  item.episode?.stillPath 
                    ? `https://image.tmdb.org/t/p/w500${item.episode.stillPath}`
                    : item.content.backdropPath 
                      ? `https://image.tmdb.org/t/p/w500${item.content.backdropPath}`
                      : item.content.posterPath
                        ? `https://image.tmdb.org/t/p/w500${item.content.posterPath}`
                        : '/placeholder.jpg'
                }
                alt={item.content.title}
                className="w-full h-full object-cover"
              />
              
              {/* Play overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>

              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                <div 
                  className="h-full bg-[#E50914]"
                  style={{ width: `${item.percentWatched}%` }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="p-3">
              <h3 className="text-white font-semibold text-sm truncate">
                {item.content.title}
              </h3>
              
              {item.displayMessage && (
                <p className="text-gray-400 text-xs mt-1">
                  {item.displayMessage}
                </p>
              )}
              
              {item.content.type === 'series' && item.episode && (
                <p className="text-gray-500 text-xs mt-1">
                  {item.episode.name || `Episodio ${item.episodeNumber}`}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ContinueWatching;
