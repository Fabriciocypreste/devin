/**
 * ========================================
 * 🧪 TESTE DO IPTV SERVICE
 * ========================================
 * 
 * Componente de teste para validar o iptvService.ts
 * Permite testar o carregamento direto do filmes.txt
 * sem depender do sistema Supabase.
 */

import { useState } from 'react';
import { fetchAndParseMovies, fetchMoviesByCategory, detectContentType, isValidStreamFormat } from '../services/iptvService';
import { Movie } from '../types';

export function IptvServiceTest() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<{ [key: string]: Movie[] }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    movies: 0,
    series: 0,
    channels: 0,
    validStreams: 0,
  });

  const handleLoadMovies = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Iniciando teste do iptvService...');
      
      // Buscar e parsear
      const result = await fetchMoviesByCategory();
      
      setMovies(result.movies);
      setCategories(result.categories);
      
      // Calcular estatísticas
      const movieCount = result.movies.filter(m => detectContentType(m) === 'movie').length;
      const seriesCount = result.movies.filter(m => detectContentType(m) === 'tv').length;
      const channelCount = result.movies.filter(m => detectContentType(m) === 'channel').length;
      const validStreamCount = result.movies.filter(m => isValidStreamFormat(m.streamUrl)).length;
      
      setStats({
        total: result.total,
        movies: movieCount,
        series: seriesCount,
        channels: channelCount,
        validStreams: validStreamCount,
      });
      
      console.log('✅ Teste concluído com sucesso!');
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMsg);
      console.error('❌ Erro no teste:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl mb-2">🧪 Teste do IPTV Service</h1>
          <p className="text-gray-400">
            Teste o carregamento direto do filmes.txt usando CORS proxies
          </p>
        </div>

        {/* Botão de Teste */}
        <div className="mb-8">
          <button
            onClick={handleLoadMovies}
            disabled={loading}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            {loading ? '⏳ Carregando...' : '🚀 Testar iptvService'}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-600 rounded-lg">
            <h3 className="font-bold mb-2">❌ Erro:</h3>
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Estatísticas */}
        {movies.length > 0 && (
          <div className="mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-3xl mb-1">📊</div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-3xl mb-1">🎬</div>
              <div className="text-2xl font-bold">{stats.movies}</div>
              <div className="text-sm text-gray-400">Filmes</div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-3xl mb-1">📺</div>
              <div className="text-2xl font-bold">{stats.series}</div>
              <div className="text-sm text-gray-400">Séries</div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-3xl mb-1">📡</div>
              <div className="text-2xl font-bold">{stats.channels}</div>
              <div className="text-sm text-gray-400">Canais</div>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
              <div className="text-3xl mb-1">✅</div>
              <div className="text-2xl font-bold">{stats.validStreams}</div>
              <div className="text-sm text-gray-400">Streams Válidos</div>
            </div>
          </div>
        )}

        {/* Categorias */}
        {Object.keys(categories).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl mb-4">📂 Categorias ({Object.keys(categories).length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(categories).map(([category, items]) => (
                <div
                  key={category}
                  className="bg-gray-900 p-3 rounded-lg border border-gray-700 hover:border-red-600 transition-colors"
                >
                  <div className="font-semibold truncate" title={category}>
                    {category}
                  </div>
                  <div className="text-sm text-gray-400">{items.length} itens</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Filmes */}
        {movies.length > 0 && (
          <div>
            <h2 className="text-2xl mb-4">🎥 Primeiros 20 Itens</h2>
            <div className="space-y-2">
              {movies.slice(0, 20).map((movie, index) => {
                const contentType = detectContentType(movie);
                const isValid = isValidStreamFormat(movie.streamUrl);
                
                return (
                  <div
                    key={movie.id}
                    className="bg-gray-900 p-4 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="flex-shrink-0">
                        {movie.logoUrl ? (
                          <img
                            src={movie.logoUrl}
                            alt={movie.title}
                            className="w-24 h-16 object-cover rounded bg-gray-800"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${index}/244/137`;
                            }}
                          />
                        ) : (
                          <div className="w-24 h-16 bg-gray-800 rounded flex items-center justify-center">
                            <span className="text-2xl">
                              {contentType === 'movie' ? '🎬' : contentType === 'tv' ? '📺' : '📡'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold truncate">{movie.title}</h3>
                          <div className="flex gap-2 flex-shrink-0">
                            <span className={`px-2 py-1 rounded text-xs ${
                              contentType === 'movie' ? 'bg-blue-900 text-blue-200' :
                              contentType === 'tv' ? 'bg-purple-900 text-purple-200' :
                              'bg-green-900 text-green-200'
                            }`}>
                              {contentType === 'movie' ? '🎬 Filme' :
                               contentType === 'tv' ? '📺 Série' :
                               '📡 Canal'}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs ${
                              isValid ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'
                            }`}>
                              {isValid ? '✅ Válido' : '❌ Inválido'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-400 mb-2">
                          <span className="inline-block mr-4">📂 {movie.category}</span>
                          {movie.year > 0 && <span className="inline-block">📅 {movie.year}</span>}
                        </div>
                        
                        <div className="text-xs text-gray-500 truncate" title={movie.streamUrl}>
                          🔗 {movie.streamUrl}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-500">
          <p>
            💡 <strong>Dica:</strong> Abra o console do navegador (F12) para ver logs detalhados do processo.
          </p>
        </div>
      </div>
    </div>
  );
}
