import React, { useRef } from 'react';
import { GlassCard } from './ui/GlassCard';
import { EnrichedContent } from '../types/content';
import { Movie } from '../types';
import { cn } from '../utils/cn';

interface ContentRowProps {
  title: string;
  items?: EnrichedContent[] | Movie[];
  content?: EnrichedContent[] | Movie[]; // Alias for items to support App.tsx
  onItemClick?: (item: EnrichedContent | Movie) => void;
  onMovieClick?: (movie: Movie) => void; // Alias for onItemClick
  isPoster?: boolean;
  // Extra props passed by App.tsx but maybe not used yet
  maxItems?: number;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  myList?: number[];
  likedList?: number[];
  watchLaterList?: number[];
}

export function ContentRow({
  title,
  items,
  content,
  onItemClick,
  onMovieClick,
  isPoster = true
}: ContentRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  // Normalize items/content
  const data = items || content || [];
  const handleClick = onItemClick || onMovieClick || (() => { });

  if (!data.length) return null;

  return (
    <div className="py-8 space-y-4">
      <h2 className="text-2xl font-bold text-white px-12 drop-shadow-md border-l-4 border-red-600 pl-4">
        {title}
      </h2>

      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto px-12 pb-8 scrollbar-hide snap-x"
        style={{ scrollBehavior: 'smooth' }}
      >
        {data.map((item: any) => {
          // Normalize fields (handle Movie vs EnrichedContent)
          const poster = item.posterPath || item.poster_path;
          const backdrop = item.backdropPath || item.backdrop_path;
          const title = item.title || item.name;

                    return (
                      <div key={item.id} className="snap-start shrink-0">
                        <GlassCard
                          className={cn(
                            isPoster ? "w-[200px]" : "w-[300px]",
                            "transition-all duration-300"
                          )}
                          aspectRatio={isPoster ? 'poster' : 'video'}
                          imageUrl={isPoster ? poster : backdrop || poster}
                          title={title}
                          onPress={() => handleClick(item)}
                          tabIndex={0}
                          showLogo={!item.isLocal && poster?.startsWith('http')}
                        />
                      </div>
                    );
        })}
      </div>
    </div>
  );
}
