import { useState, useEffect } from 'react';
import { ChevronRightIcon, PlayIcon, InfoIcon, TrendingUpIcon, StarIcon, ClockIcon, CalendarIcon, AwardIcon, FlameIcon } from './Icons';
import { NetflixHeader } from './NetflixHeader';
import { MovieDetails } from './MovieDetails';
import { getImageUrl } from '../utils/tmdb';
import { getLocalContentItems } from '../utils/localContent';
import { fetchContentDetails } from '../utils/contentList';
import { OptimizedImage } from './OptimizedImage';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Content {
  id: number;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  overview: string;
  media_type: 'movie' | 'tv';
  release_date?: string;
  first_air_date?: string;
}

interface BombandoPageProps {
  onClose?: () => void;
  onCategoryChange?: (category: string) => void;
  onSearchClick?: () => void;
  onMovieClick?: (id: number, type: 'movie' | 'tv') => void;
}

export function BombandoPage({ onClose, onCategoryChange, onSearchClick, onMovieClick }: BombandoPageProps) {
  const [novidades, setNovidades] = useState<Content[]>([]);
  const [top10Series, setTop10Series] = useState<Content[]>([]);
  const [top10Filmes, setTop10Filmes] = useState<Content[]>([]);
  const [valemEspera, setValemEspera] = useState<Content[]>([]);
  const [estrelasSemana, setEstrelasSemana] = useState<Content[]>([]);
  const [estrelasProxima, setEstrelasProxima] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedContent, setSelectedContent] = useState<{ id: number; type: 'movie' | 'tv' } | null>(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      console.log('🎬 Bombando: Carregando conteúdo...');

      // Usar função helper que já converte e detecta tipos
      const contentList = getLocalContentItems(40);
      console.log(`📋 ${contentList.length} títulos preparados para busca`);

      const contentDetails = await fetchContentDetails(contentList);
      console.log(`✅ ${contentDetails.length} títulos carregados com detalhes`);

      if (contentDetails.length === 0) {
        throw new Error('Nenhum conteúdo disponível');
      }

      const sortedByRating = [...contentDetails].sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      
      // Novidades - Top 10 melhor avaliados
      setNovidades(sortedByRating.slice(0, 10) as Content[]);

      // Top 10 Séries Brasil
      const topSeries = contentDetails
        .filter(c => c.media_type === 'tv' || c.name)
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 10);
      setTop10Series(topSeries as Content[]);

      // Top 10 Filmes Brasil
      const topMovies = contentDetails
        .filter(c => c.media_type === 'movie' || c.title)
        .sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        .slice(0, 10);
      setTop10Filmes(topMovies as Content[]);

      // Valem a espera
      const esperaContent = contentDetails
        .filter(c => (c.vote_average || 0) >= 7.0)
        .slice(0, 10);
      setValemEspera(esperaContent as Content[]);

      // Estrelas da semana
      setEstrelasSemana(sortedByRating.slice(10, 20) as Content[]);

      // Estrelas próxima semana
      const proximaSemana = contentDetails
        .filter(c => c.media_type === 'tv' || c.name)
        .slice(0, 10);
      setEstrelasProxima(proximaSemana as Content[]);

      console.log('🎉 Bombando: Todo conteúdo carregado com sucesso!');
      setLoading(false);
    } catch (error) {
      console.error('❌ Erro ao carregar conteúdo:', error);
      setLoading(false);
    }
  };

  const handleContentClick = (content: Content) => {
    if (onMovieClick) {
      onMovieClick(content.id, content.media_type);
    } else {
      setSelectedContent({ id: content.id, type: content.media_type });
    }
  };

  if (selectedContent) {
    return (
      <MovieDetails
        movieId={selectedContent.id}
        type={selectedContent.type}
        onClose={() => setSelectedContent(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#141414]">
        <NetflixHeader 
          activeCategory="bombando"
          onCategoryChange={onCategoryChange || (() => {})}
          onSearchClick={onSearchClick || (() => {})}
        />
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white">Carregando conteúdo em alta...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141414]">
      <NetflixHeader 
        activeCategory="bombando"
        onCategoryChange={onCategoryChange || (() => {})}
        onSearchClick={onSearchClick || (() => {})}
      />

      <div className="pt-16 md:pt-20 pb-20">
        {/* Novidades na Netflix */}
        <section className="px-4 md:px-12 mb-10 md:mb-16">
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            Novidades na Netflix
          </h2>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {novidades.map((item, index) => (
              <div
                key={`novidade-${item.id}`}
                onClick={() => handleContentClick(item)}
                className="relative flex-shrink-0 w-[300px] md:w-[350px] snap-start group cursor-pointer"
              >
                <div className="relative rounded overflow-hidden bg-zinc-900">
                  <ImageWithFallback
                    src={getImageUrl(item.backdrop_path, 'w500')}
                    alt={item.title || item.name || ''}
                    className="w-full h-[170px] md:h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Badge N da Netflix */}
                  <div className="absolute top-0 left-0 w-12 h-16 bg-[#E50914] flex items-center justify-center">
                    <span className="text-white text-2xl font-black">N</span>
                  </div>
                  
                  {/* Badge Nova Temporada (em alguns cards) */}
                  {index % 3 === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-[#E50914] py-1 px-3">
                      <p className="text-white text-xs font-bold text-center">Nova temporada</p>
                    </div>
                  )}
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <PlayIcon className="w-16 h-16 text-white fill-white drop-shadow-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brasil: Top 10 em séries hoje */}
        <section className="px-4 md:px-12 mb-10 md:mb-16">
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            Brasil: top 10 em séries hoje
          </h2>
          <div className="flex gap-1 md:gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {top10Series.map((item, index) => (
              <div
                key={`top10-series-${item.id}`}
                onClick={() => handleContentClick(item)}
                className="relative flex-shrink-0 snap-start group cursor-pointer"
              >
                <div className="relative flex items-end h-[270px] md:h-[320px]">
                  {/* Número gigante com stroke */}
                  <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
                    <svg
                      viewBox="0 0 140 200"
                      className="w-[110px] h-[165px] md:w-[140px] md:h-[200px]"
                    >
                      <text
                        x="5"
                        y="165"
                        className="font-black"
                        style={{
                          fontSize: '200px',
                          fill: 'transparent',
                          stroke: '#464646',
                          strokeWidth: '3px',
                          paintOrder: 'stroke',
                        }}
                      >
                        {index + 1}
                      </text>
                    </svg>
                  </div>
                  
                  {/* Poster */}
                  <div className="relative z-10 ml-8 md:ml-12 rounded overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <OptimizedImage
                      src={getImageUrl(item.poster_path, 'w342')}
                      alt={item.name || item.title || ''}
                      className="w-[140px] h-[210px] md:w-[160px] md:h-[240px] object-cover"
                      priority={index < 3}
                      blur={true}
                      quality={80}
                      width={342}
                      height={513}
                      useProxy={false}
                    />
                    
                    {/* Badge Novidade (em alguns) */}
                    {index < 3 && (
                      <div className="absolute top-2 right-2 bg-[#E50914] text-white px-2 py-1 text-xs font-bold rounded">
                        Novidade
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <PlayIcon className="w-12 h-12 text-white fill-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Valem a espera */}
        <section className="px-4 md:px-12 mb-10 md:mb-16">
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            Valem a espera
          </h2>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {valemEspera.map((item) => (
              <div
                key={`espera-${item.id}`}
                onClick={() => handleContentClick(item)}
                className="relative flex-shrink-0 w-[300px] md:w-[350px] snap-start group cursor-pointer"
              >
                <div className="relative rounded overflow-hidden bg-zinc-900">
                  <ImageWithFallback
                    src={getImageUrl(item.backdrop_path, 'w500')}
                    alt={item.title || item.name || ''}
                    className="w-full h-[170px] md:h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Hover overlay com info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-sm md:text-base mb-2">
                        {item.title || item.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                          <span className="text-white font-semibold">
                            {item.vote_average.toFixed(1)}
                          </span>
                        </div>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-300">
                          {item.media_type === 'tv' ? 'Série' : 'Filme'}
                        </span>
                      </div>
                    </div>
                    
                    {/* Play icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <PlayIcon className="w-16 h-16 text-white fill-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brasil: Top 10 em filmes hoje */}
        <section className="px-4 md:px-12 mb-10 md:mb-16">
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            Brasil: top 10 em filmes hoje
          </h2>
          <div className="flex gap-1 md:gap-2 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {top10Filmes.map((item, index) => (
              <div
                key={`top10-filmes-${item.id}`}
                onClick={() => handleContentClick(item)}
                className="relative flex-shrink-0 snap-start group cursor-pointer"
              >
                <div className="relative flex items-end h-[270px] md:h-[320px]">
                  {/* Número gigante com stroke */}
                  <div className="absolute left-0 bottom-0 z-0 pointer-events-none">
                    <svg
                      viewBox="0 0 140 200"
                      className="w-[110px] h-[165px] md:w-[140px] md:h-[200px]"
                    >
                      <text
                        x="5"
                        y="165"
                        className="font-black"
                        style={{
                          fontSize: '200px',
                          fill: 'transparent',
                          stroke: '#464646',
                          strokeWidth: '3px',
                          paintOrder: 'stroke',
                        }}
                      >
                        {index + 1}
                      </text>
                    </svg>
                  </div>
                  
                  {/* Poster */}
                  <div className="relative z-10 ml-8 md:ml-12 rounded overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                    <img
                      src={getImageUrl(item.poster_path, 'w342')}
                      alt={item.title || item.name || ''}
                      className="w-[140px] h-[210px] md:w-[160px] md:h-[240px] object-cover"
                      loading="lazy"
                    />
                    
                    {/* Badge Novidade (em alguns) */}
                    {index < 3 && (
                      <div className="absolute top-2 right-2 bg-[#E50914] text-white px-2 py-1 text-xs font-bold rounded">
                        Novidade
                      </div>
                    )}
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <PlayIcon className="w-12 h-12 text-white fill-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Estrelas da semana */}
        <section className="px-4 md:px-12 mb-10 md:mb-16">
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            Estrelas da semana
          </h2>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {estrelasSemana.map((item) => (
              <div
                key={`estrelas-${item.id}`}
                onClick={() => handleContentClick(item)}
                className="relative flex-shrink-0 w-[300px] md:w-[350px] snap-start group cursor-pointer"
              >
                <div className="relative rounded overflow-hidden bg-zinc-900">
                  <img
                    src={getImageUrl(item.backdrop_path, 'w500')}
                    alt={item.title || item.name || ''}
                    className="w-full h-[170px] md:h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-sm md:text-base">
                        {item.title || item.name}
                      </p>
                    </div>
                    
                    {/* Play icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <PlayIcon className="w-14 h-14 text-white fill-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Estrelas da próxima semana */}
        <section className="px-4 md:px-12 mb-10 md:mb-16">
          <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-4 md:mb-6">
            Estrelas da próxima semana
          </h2>
          <div className="flex gap-2 md:gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {estrelasProxima.map((item) => (
              <div
                key={`proxima-${item.id}`}
                onClick={() => handleContentClick(item)}
                className="relative flex-shrink-0 w-[300px] md:w-[350px] snap-start group cursor-pointer"
              >
                <div className="relative rounded overflow-hidden bg-zinc-900">
                  <img
                    src={getImageUrl(item.backdrop_path, 'w500')}
                    alt={item.title || item.name || ''}
                    className="w-full h-[170px] md:h-[200px] object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-bold text-sm md:text-base">
                        {item.title || item.name}
                      </p>
                    </div>
                    
                    {/* Play icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <PlayIcon className="w-14 h-14 text-white fill-white drop-shadow-lg" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Netflix Style */}
        <footer className="px-4 md:px-12 pt-12 pb-8 border-t border-gray-800 mt-20">
          <div className="max-w-6xl mx-auto">
            {/* Social Icons */}
            <div className="flex gap-6 mb-8">
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition" aria-label="YouTube">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-8">
              <div className="space-y-3">
                <a href="#" className="block hover:underline">Audiodescrição</a>
                <a href="#" className="block hover:underline">Relações com investidores</a>
                <a href="#" className="block hover:underline">Avisos legais</a>
              </div>
              <div className="space-y-3">
                <a href="#" className="block hover:underline">Central de Ajuda</a>
                <a href="#" className="block hover:underline">Carreiras</a>
                <a href="#" className="block hover:underline">Preferências de cookies</a>
              </div>
              <div className="space-y-3">
                <a href="#" className="block hover:underline">Cartão pré-pago</a>
                <a href="#" className="block hover:underline">Termos de uso</a>
                <a href="#" className="block hover:underline">Informações corporativas</a>
              </div>
              <div className="space-y-3">
                <a href="#" className="block hover:underline">Centro de mídia</a>
                <a href="#" className="block hover:underline">Privacidade</a>
                <a href="#" className="block hover:underline">Entre em contato</a>
              </div>
            </div>

            {/* Service Code Button */}
            <button className="border border-gray-600 text-gray-400 px-4 py-2 text-sm hover:border-white hover:text-white transition mb-6">
              Código do serviço
            </button>

            {/* Copyright */}
            <p className="text-gray-500 text-xs">
              © 1997-2024 Netflix, Inc.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}