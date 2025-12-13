import { useState } from 'react';
import { 
  enrichMovie, 
  enrichSeries, 
  type EnrichedContent 
} from '../services/tmdbService';

const Search = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const Film = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
);

const Tv = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

export function TMDBEnrichmentTest() {
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EnrichedContent | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Digite um título para buscar');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const enriched = mediaType === 'movie'
        ? await enrichMovie(query, year ? parseInt(year) : undefined)
        : await enrichSeries(query, year ? parseInt(year) : undefined);

      if (enriched) {
        setResult(enriched);
      } else {
        setError('Nenhum resultado encontrado no TMDB');
      }
    } catch (err) {
      setError(`Erro ao buscar: ${err}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-white text-2xl font-bold mb-2">
          🎬 Teste de Enriquecimento TMDB
        </h2>
        <p className="text-[#999] text-sm">
          Busque filmes e séries para ver imagens, logos e release dates da API do TMDB
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-[#1a1a1a] rounded-lg p-6 space-y-4">
        <div className="flex gap-3">
          {/* Media Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMediaType('movie')}
              className={`px-4 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors ${
                mediaType === 'movie'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#252525] text-[#999] hover:text-white'
              }`}
            >
              <Film size={20} />
              Filme
            </button>
            <button
              onClick={() => setMediaType('tv')}
              className={`px-4 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors ${
                mediaType === 'tv'
                  ? 'bg-red-600 text-white'
                  : 'bg-[#252525] text-[#999] hover:text-white'
              }`}
            >
              <Tv size={20} />
              Série
            </button>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder={`Digite o título ${mediaType === 'movie' ? 'do filme' : 'da série'}...`}
            className="flex-1 bg-[#252525] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-red-600 outline-none"
          />

          {/* Year Input */}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Ano (opcional)"
            className="w-32 bg-[#252525] text-white px-4 py-3 rounded-lg border border-[#333] focus:border-red-600 outline-none"
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold disabled:opacity-50 flex items-center gap-2"
          >
            <Search size={20} />
            Buscar
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="inline-block w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white mt-4">Buscando no TMDB...</p>
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-white text-xl font-bold mb-4">📋 Informações Básicas</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[#999] text-sm mb-1">Título</p>
                <p className="text-white font-bold">{result.title}</p>
              </div>
              <div>
                <p className="text-[#999] text-sm mb-1">Título Original</p>
                <p className="text-white font-bold">{result.original_title}</p>
              </div>
              <div>
                <p className="text-[#999] text-sm mb-1">🗓️ Data de Lançamento</p>
                <p className="text-white font-bold">
                  {result.release_date ? new Date(result.release_date).toLocaleDateString('pt-BR') : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-[#999] text-sm mb-1">⭐ Avaliação</p>
                <p className="text-white font-bold">{result.vote_average.toFixed(1)}/10</p>
              </div>
              <div>
                <p className="text-[#999] text-sm mb-1">TMDB ID</p>
                <p className="text-white font-bold">#{result.tmdbId}</p>
              </div>
              <div>
                <p className="text-[#999] text-sm mb-1">⏱️ Duração</p>
                <p className="text-white font-bold">{result.runtime ? `${result.runtime} min` : 'N/A'}</p>
              </div>
            </div>
            
            {result.tagline && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                <p className="text-[#999] text-sm mb-1">💬 Tagline</p>
                <p className="text-white italic">&quot;{result.tagline}&quot;</p>
              </div>
            )}
            
            {result.overview && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                <p className="text-[#999] text-sm mb-1">📝 Sinopse</p>
                <p className="text-white">{result.overview}</p>
              </div>
            )}
            
            {result.genres.length > 0 && (
              <div className="mt-4 pt-4 border-t border-[#333]">
                <p className="text-[#999] text-sm mb-2">🎭 Gêneros</p>
                <div className="flex flex-wrap gap-2">
                  {result.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-[#252525] text-white px-3 py-1 rounded-full text-sm"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Main Images */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-white text-xl font-bold mb-4">🖼️ Imagens Principais</h3>
            <div className="grid grid-cols-3 gap-4">
              {/* Poster */}
              <div>
                <p className="text-[#999] text-sm mb-2">Poster</p>
                {result.poster_url ? (
                  <img
                    src={result.poster_url}
                    alt={result.title}
                    className="w-full rounded-lg border border-[#333]"
                  />
                ) : (
                  <div className="aspect-[2/3] bg-[#252525] rounded-lg flex items-center justify-center border border-[#333]">
                    <p className="text-[#666]">Sem poster</p>
                  </div>
                )}
              </div>

              {/* Backdrop */}
              <div className="col-span-2">
                <p className="text-[#999] text-sm mb-2">Backdrop</p>
                {result.backdrop_url ? (
                  <img
                    src={result.backdrop_url}
                    alt={result.title}
                    className="w-full rounded-lg border border-[#333]"
                  />
                ) : (
                  <div className="aspect-video bg-[#252525] rounded-lg flex items-center justify-center border border-[#333]">
                    <p className="text-[#666]">Sem backdrop</p>
                  </div>
                )}
              </div>
            </div>

            {/* Logo */}
            {result.logo_url && (
              <div className="mt-4">
                <p className="text-[#999] text-sm mb-2">🏷️ Logo</p>
                <div className="bg-[#252525] rounded-lg p-8 flex items-center justify-center border border-[#333]">
                  <img
                    src={result.logo_url}
                    alt={`${result.title} logo`}
                    className="max-h-32"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Alternative Images */}
          {(result.all_posters.length > 0 || result.all_backdrops.length > 0 || result.all_logos.length > 0) && (
            <div className="bg-[#1a1a1a] rounded-lg p-6">
              <h3 className="text-white text-xl font-bold mb-4">📚 Imagens Alternativas</h3>
              
              {/* All Posters */}
              {result.all_posters.length > 0 && (
                <div className="mb-6">
                  <p className="text-[#999] text-sm mb-3">
                    Posters ({result.all_posters.length})
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {result.all_posters.slice(0, 10).map((poster, index) => (
                      <img
                        key={index}
                        src={poster}
                        alt={`Poster ${index + 1}`}
                        className="h-40 rounded-lg border border-[#333] flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Backdrops */}
              {result.all_backdrops.length > 0 && (
                <div className="mb-6">
                  <p className="text-[#999] text-sm mb-3">
                    Backdrops ({result.all_backdrops.length})
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {result.all_backdrops.slice(0, 10).map((backdrop, index) => (
                      <img
                        key={index}
                        src={backdrop}
                        alt={`Backdrop ${index + 1}`}
                        className="h-32 rounded-lg border border-[#333] flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* All Logos */}
              {result.all_logos.length > 0 && (
                <div>
                  <p className="text-[#999] text-sm mb-3">
                    Logos ({result.all_logos.length})
                  </p>
                  <div className="flex gap-3 overflow-x-auto pb-2">
                    {result.all_logos.map((logo, index) => (
                      <div
                        key={index}
                        className="bg-[#252525] rounded-lg p-4 flex items-center justify-center border border-[#333] flex-shrink-0"
                      >
                        <img
                          src={logo}
                          alt={`Logo ${index + 1}`}
                          className="h-20"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* JSON Data */}
          <div className="bg-[#1a1a1a] rounded-lg p-6">
            <h3 className="text-white text-xl font-bold mb-4">💾 Dados JSON</h3>
            <pre className="bg-[#0a0a0a] text-[#0f0] p-4 rounded-lg text-xs overflow-x-auto border border-[#333]">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
