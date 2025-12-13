import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Removido motion/react - usando CSS transitions

// SVG Icons Inline (sem dependência lucide-react)
const XIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const HeartIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const FilterIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const PlayIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const StarIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
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

interface FavoritesPageProps {
  onClose?: () => void;
}

export function FavoritesPage({ onClose }: FavoritesPageProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'movies' | 'series'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const favorites = [
    {
      id: 1,
      title: 'Stranger Things',
      type: 'Série',
      year: '2016',
      rating: 8.7,
      genres: ['Ficção Científica', 'Drama', 'Terror'],
      addedAt: 'Há 2 semanas',
      thumbnail: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg'
    },
    {
      id: 2,
      title: 'The Crown',
      type: 'Série',
      year: '2016',
      rating: 8.6,
      genres: ['Drama', 'Biografia', 'História'],
      addedAt: 'Há 1 semana',
      thumbnail: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg'
    },
    {
      id: 3,
      title: 'Breaking Bad',
      type: 'Série',
      year: '2008',
      rating: 9.5,
      genres: ['Crime', 'Drama', 'Thriller'],
      addedAt: 'Há 3 semanas',
      thumbnail: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg'
    },
    {
      id: 4,
      title: 'The Witcher',
      type: 'Série',
      year: '2019',
      rating: 8.2,
      genres: ['Fantasia', 'Ação', 'Aventura'],
      addedAt: 'Há 4 dias',
      thumbnail: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg'
    },
    {
      id: 5,
      title: 'Dark',
      type: 'Série',
      year: '2017',
      rating: 8.8,
      genres: ['Mistério', 'Ficção Científica', 'Thriller'],
      addedAt: 'Há 1 mês',
      thumbnail: 'https://image.tmdb.org/t/p/w500/56v2KjBlU4XaOv9rVYEQypROD7P.jpg'
    },
    {
      id: 6,
      title: 'Money Heist',
      type: 'Série',
      year: '2017',
      rating: 8.2,
      genres: ['Crime', 'Ação', 'Thriller'],
      addedAt: 'Há 2 meses',
      thumbnail: 'https://image.tmdb.org/t/p/w500/MoEKaPFHABtA1xKoOteirGaHl1.jpg'
    },
    {
      id: 7,
      title: 'Peaky Blinders',
      type: 'Série',
      year: '2013',
      rating: 8.8,
      genres: ['Crime', 'Drama'],
      addedAt: 'Há 5 dias',
      thumbnail: 'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVlVGkVcZIW.jpg'
    },
    {
      id: 8,
      title: 'Ozark',
      type: 'Série',
      year: '2017',
      rating: 8.5,
      genres: ['Crime', 'Drama', 'Thriller'],
      addedAt: 'Há 3 dias',
      thumbnail: 'https://image.tmdb.org/t/p/w500/m73bD8VjibSKvXEN3lwBTTXP9kX.jpg'
    }
  ];

  const filterFavorites = (filter: typeof selectedFilter) => {
    switch (filter) {
      case 'movies':
        return favorites.filter(item => item.type === 'Filme');
      case 'series':
        return favorites.filter(item => item.type === 'Série');
      default:
        return favorites;
    }
  };

  const filteredFavorites = filterFavorites(selectedFilter);

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <HeartIcon className="w-8 h-8 text-[#E50914] fill-[#E50914]" size={32} />
              <div>
                <h1 className="text-3xl text-white">Meus Favoritos</h1>
                <p className="text-[#B3B3B3] text-sm mt-1">
                  {filteredFavorites.length} {filteredFavorites.length === 1 ? 'item' : 'itens'} favorito{filteredFavorites.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' ? 'bg-[#E50914]' : 'hover:bg-white/10'
                  }`}
                >
                  <Grid3x3Icon className="w-5 h-5 text-white" size={20} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' ? 'bg-[#E50914]' : 'hover:bg-white/10'
                  }`}
                >
                  <ListIcon className="w-5 h-5 text-white" size={20} />
                </button>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <XIcon className="w-6 h-6 text-white" size={24} />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <FilterIcon className="w-5 h-5 text-[#B3B3B3]" size={20} />
            {[
              { value: 'all', label: 'Todos' },
              { value: 'movies', label: 'Filmes' },
              { value: 'series', label: 'Séries' }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value as any)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedFilter === filter.value
                    ? 'bg-[#E50914] text-white'
                    : 'bg-white/5 text-[#B3B3B3] hover:bg-white/10 hover:text-white'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredFavorites.map((item) => (
              <div
                key={item.id}
                className="group relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:-translate-y-2"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {/* Actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-2">
                      <button className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center hover:bg-[#C41A23] transition-colors">
                        <PlayIcon className="w-6 h-6 text-white ml-1" size={24} />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                        <InfoIcon className="w-5 h-5 text-white" size={20} />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" size={16} />
                        <span className="text-white text-sm">{item.rating}</span>
                      </div>
                      <p className="text-white/80 text-xs">{item.year}</p>
                    </div>

                    {/* Remove button */}
                    <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-600/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-600 transition-colors">
                      <HeartIcon className="w-4 h-4 text-white fill-white" size={16} />
                    </button>
                  </div>
                </div>
                <h3 className="text-white mt-2 text-sm truncate">{item.title}</h3>
                <p className="text-[#B3B3B3] text-xs mt-1">{item.type}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((item) => (
              <div
                key={item.id}
                className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative w-32 h-48 shrink-0 rounded-lg overflow-hidden">
                    <ImageWithFallback
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <PlayIcon className="w-12 h-12 text-white" size={48} />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white text-xl mb-1">{item.title}</h3>
                        <div className="flex items-center gap-3 text-sm text-[#B3B3B3]">
                          <span>{item.year}</span>
                          <span>•</span>
                          <span>{item.type}</span>
                          <span>•</span>
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" size={16} />
                            <span className="text-white">{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {item.genres.map((genre, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-white/5 text-[#B3B3B3] rounded-full text-xs"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>

                    <p className="text-[#B3B3B3] text-sm">Adicionado {item.addedAt}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <button className="px-4 py-2 bg-[#E50914] hover:bg-[#C41A23] text-white rounded-lg transition-colors flex items-center gap-2">
                      <PlayIcon className="w-4 h-4" size={16} />
                      Assistir
                    </button>
                    <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2">
                      <InfoIcon className="w-4 h-4" size={16} />
                      Detalhes
                    </button>
                    <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded-lg transition-colors flex items-center gap-2">
                      <Trash2Icon className="w-4 h-4" size={16} />
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredFavorites.length === 0 && (
          <div className="text-center py-20">
            <HeartIcon className="w-16 h-16 text-white/20 mx-auto mb-4" size={64} />
            <p className="text-white/60 text-lg">Nenhum favorito encontrado</p>
            <p className="text-white/40 text-sm mt-2">Adicione títulos aos seus favoritos</p>
          </div>
        )}
      </div>
    </div>
  );
}