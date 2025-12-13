import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { XIcon, ClockIcon, PlayIcon, InfoIcon, Trash2Icon, PlusIcon, CalendarIcon, StarIcon, CheckIcon } from './Icons';

interface WatchLaterPageProps {
  onClose?: () => void;
}

export function WatchLaterPage({ onClose }: WatchLaterPageProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const watchLaterItems = [
    {
      id: 1,
      title: 'Stranger Things',
      type: 'Série',
      year: '2016',
      rating: 8.7,
      duration: '4 temporadas',
      addedAt: new Date('2025-11-01'),
      thumbnail: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      description: 'Quando um garoto desaparece, a cidade toda participa nas buscas...'
    },
    {
      id: 2,
      title: 'The Crown',
      type: 'Série',
      year: '2016',
      rating: 8.6,
      duration: '6 temporadas',
      addedAt: new Date('2025-10-28'),
      thumbnail: 'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg',
      description: 'Drama sobre o reinado da Rainha Elizabeth II.'
    },
    {
      id: 3,
      title: 'Breaking Bad',
      type: 'Série',
      year: '2008',
      rating: 9.5,
      duration: '5 temporadas',
      addedAt: new Date('2025-10-25'),
      thumbnail: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
      description: 'Professor de química se torna fabricante de metanfetamina.'
    },
    {
      id: 4,
      title: 'The Witcher',
      type: 'Série',
      year: '2019',
      rating: 8.2,
      duration: '3 temporadas',
      addedAt: new Date('2025-10-20'),
      thumbnail: 'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04URsPm.jpg',
      description: 'Geralt de Rívia, um caçador de monstros mutante.'
    },
    {
      id: 5,
      title: 'Dark',
      type: 'Série',
      year: '2017',
      rating: 8.8,
      duration: '3 temporadas',
      addedAt: new Date('2025-10-15'),
      thumbnail: 'https://image.tmdb.org/t/p/w500/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
      description: 'Thriller de ficção científica sobre viagem no tempo.'
    },
    {
      id: 6,
      title: 'Money Heist',
      type: 'Série',
      year: '2017',
      rating: 8.2,
      duration: '5 temporadas',
      addedAt: new Date('2025-10-10'),
      thumbnail: 'https://image.tmdb.org/t/p/w500/MoEKaPFHABtA1xKoOteirGaHl1.jpg',
      description: 'Um grupo criminoso realiza o maior assalto da história.'
    }
  ];

  const toggleSelection = (id: number) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    if (diffDays < 30) return `Há ${Math.floor(diffDays / 7)} semanas`;
    return `Há ${Math.floor(diffDays / 30)} meses`;
  };

  return (
    <div className="fixed inset-0 bg-black z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-b from-black via-black/95 to-transparent backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <ClockIcon className="w-8 h-8 text-[#E50914]" />
              <div>
                <h1 className="text-3xl text-white">Ver Depois</h1>
                <p className="text-[#B3B3B3] text-sm mt-1">
                  {watchLaterItems.length} {watchLaterItems.length === 1 ? 'item' : 'itens'} na fila
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {selectedItems.length > 0 && (
                <button className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors flex items-center gap-2">
                  <Trash2Icon className="w-4 h-4" />
                  Remover {selectedItems.length}
                </button>
              )}
              {onClose && (
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <XIcon className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center gap-2">
              <PlusIcon className="w-4 h-4" />
              Adicionar Novo
            </button>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
              Ordenar por Data
            </button>
            <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors">
              Limpar Assistidos
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-4">
          {watchLaterItems.map((item) => (
            <div
              key={item.id}
              className={`group bg-white/5 backdrop-blur-xl border rounded-xl p-4 hover:bg-white/10 transition-all duration-300 ${
                selectedItems.includes(item.id) ? 'border-[#E50914]' : 'border-white/10'
              }`}
            >
              <div className="flex gap-4">
                {/* Checkbox */}
                <div className="flex items-center">
                  <button
                    onClick={() => toggleSelection(item.id)}
                    className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      selectedItems.includes(item.id)
                        ? 'bg-[#E50914] border-[#E50914]'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  >
                    {selectedItems.includes(item.id) && (
                      <CheckIcon className="w-4 h-4 text-white" />
                    )}
                  </button>
                </div>

                {/* Thumbnail */}
                <div className="relative w-48 h-28 shrink-0 rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayIcon className="w-12 h-12 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-lg mb-1">{item.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-[#B3B3B3] mb-2">
                    <span>{item.year}</span>
                    <span>•</span>
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.duration}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white">{item.rating}</span>
                    </div>
                  </div>
                  <p className="text-[#B3B3B3] text-sm line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-[#B3B3B3]">
                    <CalendarIcon className="w-3 h-3" />
                    <span>Adicionado {formatDate(item.addedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[120px]">
                  <button className="px-4 py-2 bg-[#E50914] hover:bg-[#C41A23] text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                    <PlayIcon className="w-4 h-4" />
                    Assistir
                  </button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
                    <InfoIcon className="w-4 h-4" />
                    Detalhes
                  </button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-red-600/20 text-white hover:text-red-500 rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Trash2Icon className="w-4 h-4" />
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {watchLaterItems.length === 0 && (
          <div className="text-center py-20">
            <ClockIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Sua lista está vazia</p>
            <p className="text-white/40 text-sm mt-2">
              Adicione títulos para assistir depois
            </p>
            <button className="mt-6 px-6 py-3 bg-[#E50914] hover:bg-[#C41A23] text-white rounded-lg transition-colors flex items-center gap-2 mx-auto">
              <PlusIcon className="w-5 h-5" />
              Explorar Conteúdo
            </button>
          </div>
        )}

        {/* Tips */}
        {watchLaterItems.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-[#E50914]/10 to-transparent border border-[#E50914]/20 rounded-xl p-6">
            <h3 className="text-white mb-2 flex items-center gap-2">
              <InfoIcon className="w-5 h-5 text-[#E50914]" />
              Dica
            </h3>
            <p className="text-[#B3B3B3] text-sm">
              Organize sua lista por prioridade e receba notificações quando novos episódios
              estiverem disponíveis.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
