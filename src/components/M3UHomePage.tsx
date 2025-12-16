/**
 * @deprecated This component is no longer used in the main application.
 * App.tsx now renders content directly from the database using databaseContentLoader.
 * This component is kept for backward compatibility and reference only.
 * 
 * M3U Home Page - Página inicial com conteúdo do lista.m3u
 * Exibe filmes e séries em carrosséis categorizados
 */

import React, { useState, useEffect } from 'react';
import { loadM3UContent, M3UContent, getM3UCategories } from '../utils/m3uContentLoader';
import { MovieCard } from './MovieCard';
import { getTmdbImageUrl } from '../utils/tmdb';
import IPTVPlayer from './IPTVPlayer';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, Loader2Icon } from './Icons';

interface M3UHomePageProps {
  onMovieClick?: (content: M3UContent) => void;
}

export function M3UHomePage({ onMovieClick }: M3UHomePageProps) {
  const [loading, setLoading] = useState(true);
  const [filmes, setFilmes] = useState<M3UContent[]>([]);
  const [series, setSeries] = useState<M3UContent[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedContent, setSelectedContent] = useState<M3UContent | null>(null);
  const [featuredContent, setFeaturedContent] = useState<M3UContent | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  async function loadContent() {
    try {
      setLoading(true);
      console.log('🎬 Carregando conteúdo M3U para home page...');
      
      const data = await loadM3UContent();
      const cats = await getM3UCategories();
      
      setFilmes(data.filmes);
      setSeries(data.series);
      setCategories(cats);
      
      // Selecionar conteúdo destaque (primeiro filme ou série com poster)
      const featured = [...data.filmes, ...data.series].find(c => c.poster_path || c.logo);
      setFeaturedContent(featured || null);
      
      console.log(`✅ Home carregada: ${data.filmes.length} filmes, ${data.series.length} séries`);
      setLoading(false);
    } catch (error) {
      console.error('❌ Erro ao carregar M3U:', error);
      setLoading(false);
    }
  }

  const handleContentClick = (content: M3UContent) => {
    if (onMovieClick) {
      onMovieClick(content);
    } else {
      setSelectedContent(content);
    }
  };

  if (selectedContent) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <IPTVPlayer
          streamUrl={selectedContent.streamUrl}
          title={selectedContent.title}
          onClose={() => setSelectedContent(null)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="flex flex-col items-center gap-4">
          <Loader2Icon className="w-12 h-12 text-[#E50914] animate-spin" />
          <p className="text-white text-lg">Carregando conteúdo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Featured Banner */}
      {featuredContent && (
        <div className="relative h-[80vh] w-full overflow-hidden">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${getTmdbImageUrl(featuredContent.backdrop_path || featuredContent.poster_path, 'original') || featuredContent.logo})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-8 md:p-16">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                {featuredContent.title}
              </h1>
              
              {featuredContent.overview && (
                <p className="text-lg text-white/90 mb-6 line-clamp-3">
                  {featuredContent.overview}
                </p>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => handleContentClick(featuredContent)}
                  className="flex items-center gap-2 bg-white hover:bg-white/90 text-black px-8 py-3 rounded-lg transition-colors"
                >
                  <PlayIcon className="w-6 h-6 fill-black" />
                  <span className="font-semibold">Assistir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Rows */}
      <div className="relative z-20 -mt-32 px-8 pb-16 space-y-12">
        {/* Filmes */}
        {filmes.length > 0 && (
          <ContentRow
            title="🎬 Filmes"
            items={filmes.slice(0, 20)}
            onItemClick={handleContentClick}
          />
        )}

        {/* Séries */}
        {series.length > 0 && (
          <ContentRow
            title="📺 Séries"
            items={series.slice(0, 20)}
            onItemClick={handleContentClick}
          />
        )}

        {/* Por Categoria */}
        {categories.slice(0, 5).map(category => {
          const categoryContent = [
            ...filmes.filter(f => f.category === category),
            ...series.filter(s => s.category === category)
          ].slice(0, 20);

          if (categoryContent.length === 0) return null;

          return (
            <ContentRow
              key={category}
              title={`📂 ${category.charAt(0).toUpperCase() + category.slice(1)}`}
              items={categoryContent}
              onItemClick={handleContentClick}
            />
          );
        })}
      </div>
    </div>
  );
}

interface ContentRowProps {
  title: string;
  items: M3UContent[];
  onItemClick: (content: M3UContent) => void;
}

function ContentRow({ title, items, onItemClick }: ContentRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const rowRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    
    const scrollAmount = 800;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : scrollPosition + scrollAmount;
    
    rowRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    
    setScrollPosition(newPosition);
  };

  return (
    <div className="group relative">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
        {title}
      </h2>

      {/* Scroll Buttons */}
      {scrollPosition > 0 && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ChevronLeftIcon className="w-8 h-8" />
        </button>
      )}

      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRightIcon className="w-8 h-8" />
      </button>

      {/* Content Scroll */}
      <div
        ref={rowRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            onClick={() => onItemClick(item)}
            className="flex-shrink-0 w-[200px] cursor-pointer transform transition-transform hover:scale-105"
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800">
              {(item.poster_path || item.logo) && (
                <img
                  src={getTmdbImageUrl(item.poster_path, 'w500') || item.logo}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <PlayIcon className="w-12 h-12 text-white fill-white" />
              </div>
            </div>

            <h3 className="text-white text-sm mt-2 line-clamp-2">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}
