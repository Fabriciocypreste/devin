/**
 * Componente de Teste - Visualiza Conteúdo Enriquecido com TMDB
 */

import { useState, useEffect } from 'react';
import { loadEnrichedContent } from '../utils/enrichedContentLoader';
import { Movie, getImageUrl } from '../utils/tmdb';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function EnrichedContentTest() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [series, setSeries] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalMovies: 0,
    moviesWithImages: 0,
    totalSeries: 0,
    seriesWithImages: 0,
    groupedSeries: 0
  });

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        console.log('🧪 Teste: Carregando conteúdo enriquecido...');
        
        const { movies: enrichedMovies, series: enrichedSeries } = await loadEnrichedContent();
        
        setMovies(enrichedMovies.slice(0, 20)); // Mostrar apenas 20 para teste
        setSeries(enrichedSeries.slice(0, 20));
        
        // Calcular estatísticas
        const moviesWithImages = enrichedMovies.filter(m => m.poster_path && m.poster_path.includes('themoviedb')).length;
        const seriesWithImages = enrichedSeries.filter(s => s.poster_path && s.poster_path.includes('themoviedb')).length;
        const groupedSeries = enrichedSeries.filter(s => s.episodes && s.episodes.length > 0).length;
        
        setStats({
          totalMovies: enrichedMovies.length,
          moviesWithImages,
          totalSeries: enrichedSeries.length,
          seriesWithImages,
          groupedSeries
        });
        
        console.log('✅ Teste: Conteúdo carregado!');
        console.log('📊 Estatísticas:', {
          'Total Filmes': enrichedMovies.length,
          'Filmes com TMDB': moviesWithImages,
          'Total Séries': enrichedSeries.length,
          'Séries com TMDB': seriesWithImages,
          'Séries Agrupadas': groupedSeries
        });
        
        setLoading(false);
      } catch (err) {
        console.error('❌ Teste: Erro ao carregar:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
        setLoading(false);
      }
    }
    
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">🧪 Teste de Enriquecimento TMDB</h1>
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#E50914]"></div>
            <p className="text-xl">Carregando e enriquecendo conteúdo...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">🧪 Teste de Enriquecimento TMDB</h1>
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6">
            <p className="text-red-500 font-bold">❌ Erro:</p>
            <p className="text-red-300 mt-2">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-2">🧪 Teste de Enriquecimento TMDB</h1>
        <p className="text-gray-400 mb-8">Visualização do conteúdo enriquecido com imagens da API do TMDB</p>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Filmes</p>
            <p className="text-3xl font-bold text-[#E50914]">{stats.totalMovies}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Com Imagem TMDB</p>
            <p className="text-3xl font-bold text-green-500">{stats.moviesWithImages}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalMovies > 0 ? Math.round((stats.moviesWithImages / stats.totalMovies) * 100) : 0}%
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Total Séries</p>
            <p className="text-3xl font-bold text-[#E50914]">{stats.totalSeries}</p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Com Imagem TMDB</p>
            <p className="text-3xl font-bold text-green-500">{stats.seriesWithImages}</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.totalSeries > 0 ? Math.round((stats.seriesWithImages / stats.totalSeries) * 100) : 0}%
            </p>
          </div>
          <div className="bg-gray-900 rounded-lg p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">Séries Agrupadas</p>
            <p className="text-3xl font-bold text-blue-500">{stats.groupedSeries}</p>
          </div>
        </div>

        {/* Filmes */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">🎬 Filmes (primeiros 20)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {movies.map((movie, index) => (
              <div key={movie.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-[#E50914] transition-all">
                {/* Imagem */}
                <div className="relative aspect-[2/3] bg-gray-800">
                  {movie.poster_path ? (
                    <>
                      <ImageWithFallback
                        src={movie.poster_path.startsWith('http') ? movie.poster_path : getImageUrl(movie.poster_path, 'w500')}
                        alt={movie.title || movie.name || 'Movie'}
                        className="w-full h-full object-cover"
                      />
                      {/* Badge TMDB */}
                      {movie.poster_path.includes('themoviedb') && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
                          TMDB
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-600 text-sm text-center px-2">Sem imagem</p>
                    </div>
                  )}
                  {/* Número */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-sm line-clamp-2 mb-1">
                    {movie.title || movie.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>⭐ {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                    {movie.release_date && (
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Séries */}
        <div>
          <h2 className="text-2xl font-bold mb-4">📺 Séries (primeiros 20)</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {series.map((serie, index) => (
              <div key={serie.id} className="bg-gray-900 rounded-lg overflow-hidden border border-gray-800 hover:border-[#E50914] transition-all">
                {/* Imagem */}
                <div className="relative aspect-[2/3] bg-gray-800">
                  {serie.poster_path ? (
                    <>
                      <ImageWithFallback
                        src={serie.poster_path.startsWith('http') ? serie.poster_path : getImageUrl(serie.poster_path, 'w500')}
                        alt={serie.title || serie.name || 'Series'}
                        className="w-full h-full object-cover"
                      />
                      {/* Badge TMDB */}
                      {serie.poster_path.includes('themoviedb') && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded font-bold">
                          TMDB
                        </div>
                      )}
                      {/* Badge Agrupada */}
                      {serie.episodes && serie.episodes.length > 0 && (
                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded font-bold">
                          {serie.episodes.length} eps
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="text-gray-600 text-sm text-center px-2">Sem imagem</p>
                    </div>
                  )}
                  {/* Número */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    #{index + 1}
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-3">
                  <h3 className="font-bold text-sm line-clamp-2 mb-1">
                    {serie.title || serie.name}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>⭐ {serie.vote_average ? serie.vote_average.toFixed(1) : 'N/A'}</span>
                    {serie.first_air_date && (
                      <span>{new Date(serie.first_air_date).getFullYear()}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Legenda */}
        <div className="mt-8 p-4 bg-gray-900 rounded-lg border border-gray-800">
          <h3 className="font-bold mb-2">📋 Legenda:</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>🟢 <span className="text-green-500 font-bold">TMDB</span> = Imagem vem do TMDB</li>
            <li>🔵 <span className="text-blue-500 font-bold">X eps</span> = Série agrupada com múltiplos episódios</li>
            <li>⭐ = Avaliação do TMDB (0-10)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
