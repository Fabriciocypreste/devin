import { useState } from 'react';
import { Movie } from '../utils/tmdb';
import { MovieCard } from './MovieCard';

// Icons inline to avoid lucide-react dependency
const ChevronRight = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const ChevronDown = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

interface InfiniteContentRowProps {
  title: string;
  content: Movie[];
  onMovieClick: (movie: Movie) => void;
  initialLoadCount?: number;
  loadMoreCount?: number;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  myList?: number[];
  likedList?: number[];
  watchLaterList?: number[];
}

export function InfiniteContentRow({ 
  title, 
  content, 
  onMovieClick, 
  initialLoadCount = 12,
  loadMoreCount = 12,
  onAddToList,
  onLike,
  onWatchLater,
  myList = [],
  likedList = [],
  watchLaterList = []
}: InfiniteContentRowProps) {
  const [displayCount, setDisplayCount] = useState(initialLoadCount);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (content.length === 0) return null;

  const displayContent = content.slice(0, displayCount);
  const hasMore = displayCount < content.length;

  const loadMore = () => {
    setDisplayCount(prev => Math.min(prev + loadMoreCount, content.length));
  };

  const showAll = () => {
    setDisplayCount(content.length);
  };

  return (
    <div className="mb-12">
      {/* Row Title */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-white font-['Inter:Bold',sans-serif] text-[24px]">
          {title}
        </h2>
        <div className="flex items-center gap-4">
          <span className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px]">
            Mostrando {displayContent.length} de {content.length}
          </span>
          {hasMore && (
            <button 
              onClick={showAll}
              className="text-red-600 hover:text-red-500 transition-colors flex items-center gap-1 group"
            >
              <span className="font-['Inter:Medium',sans-serif] text-[14px]">Ver tudo</span>
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Content Grid with Blur Effect on Siblings */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 px-2">
        {displayContent.map((item) => (
          <div
            key={item.id}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            className="relative"
            style={{
              filter: hoveredId !== null && hoveredId !== item.id ? 'blur(2px)' : 'blur(0px)',
              opacity: hoveredId !== null && hoveredId !== item.id ? 0.5 : 1,
              transition: 'filter 0.3s ease, opacity 0.3s ease',
              zIndex: hoveredId === item.id ? 100 : 1
            }}
          >
            <MovieCard
              movie={item}
              onClick={() => onMovieClick(item)}
              onAddToList={() => onAddToList?.(item)}
              onLike={() => onLike?.(item)}
              onWatchLater={() => onWatchLater?.(item)}
              isInList={myList.includes(item.id)}
              isLiked={likedList.includes(item.id)}
              isInWatchLater={watchLaterList.includes(item.id)}
            />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && displayCount < content.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={loadMore}
            className="bg-[#252525] hover:bg-red-600 text-white px-8 py-3 rounded-full transition-all duration-200 flex items-center gap-2 group font-['Inter:Medium',sans-serif] shadow-lg hover:scale-105 active:scale-95"
          >
            <span>Carregar mais {Math.min(loadMoreCount, content.length - displayCount)}</span>
            <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}