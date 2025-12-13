/**
 * Enriched Content Loader - Carrega conteúdo do M3U e enriquece com TMDB
 * Sistema inteligente de cache e agrupamento
 */

import { loadM3UFilmes, loadM3USeries } from './m3uContentLoader';
import { enrichAllContent, EnrichedContent } from './tmdbEnricher';
import { Movie } from './tmdb';

interface CachedEnrichedData {
  movies: Movie[];
  series: Movie[];
  timestamp: number;
}

let enrichedCache: CachedEnrichedData | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

/**
 * Converte EnrichedContent para Movie
 */
function enrichedToMovie(item: EnrichedContent, index: number): Movie {
  const isTV = item.type === 'tv';
  
  return {
    id: item.tmdb_id || item.id,
    title: isTV ? undefined : item.title,
    name: isTV ? item.title : undefined,
    original_title: item.original_title,
    original_name: isTV ? item.original_title : undefined,
    poster_path: item.poster_path || '',
    backdrop_path: item.backdrop_path || item.poster_path || '',
    overview: item.overview || `Assista ${item.title}`,
    vote_average: item.vote_average || 0,
    vote_count: 0,
    popularity: 50 + (100 - index) * 0.5,
    release_date: isTV ? undefined : item.release_date,
    first_air_date: isTV ? item.release_date : undefined,
    genre_ids: item.genre_ids || [],
    adult: false,
    original_language: 'pt',
    media_type: item.type as 'movie' | 'tv',
    // Dados extras para player
    streamUrl: item.streamUrl,
    episodes: item.episodes, // Para séries agrupadas
  };
}

/**
 * Carrega e enriquece conteúdo do M3U com TMDB
 */
export async function loadEnrichedContent(forceRefresh = false): Promise<{ movies: Movie[], series: Movie[] }> {
  // Verificar cache
  if (!forceRefresh && enrichedCache && Date.now() - enrichedCache.timestamp < CACHE_DURATION) {
    console.log('📦 Usando cache de conteúdo enriquecido');
    return {
      movies: enrichedCache.movies,
      series: enrichedCache.series
    };
  }
  
  console.log('🎨 Carregando e enriquecendo conteúdo...');
  
  try {
    // Carregar do M3U
    const [m3uMovies, m3uSeries] = await Promise.all([
      loadM3UFilmes(),
      loadM3USeries()
    ]);
    
    console.log(`📥 M3U: ${m3uMovies.length} filmes, ${m3uSeries.length} séries`);
    
    // Se não tem conteúdo, retornar vazio
    if (m3uMovies.length === 0 && m3uSeries.length === 0) {
      console.log('⚠️ Nenhum conteúdo M3U disponível');
      return { movies: [], series: [] };
    }
    
    // Enriquecer com TMDB (limitar para não sobrecarregar)
    const enriched = await enrichAllContent(m3uMovies, m3uSeries, {
      maxMovies: 100,  // Enriquecer até 100 filmes
      maxSeries: 50    // Enriquecer até 50 séries (agrupadas)
    });
    
    // Converter para formato Movie
    const movies: Movie[] = enriched.movies.map((item, index) => enrichedToMovie(item, index));
    const series: Movie[] = enriched.series.map((item, index) => enrichedToMovie(item, index));
    
    console.log(`✅ Enriquecimento completo: ${movies.length} filmes, ${series.length} séries`);
    
    // Atualizar cache
    enrichedCache = {
      movies,
      series,
      timestamp: Date.now()
    };
    
    return { movies, series };
  } catch (error) {
    console.error('❌ Erro ao enriquecer conteúdo:', error);
    
    // Retornar cache antigo se existir
    if (enrichedCache) {
      console.log('📦 Usando cache antigo devido a erro');
      return {
        movies: enrichedCache.movies,
        series: enrichedCache.series
      };
    }
    
    // Sem cache, retornar vazio
    return { movies: [], series: [] };
  }
}

/**
 * Carrega apenas filmes enriquecidos
 */
export async function loadEnrichedMovies(): Promise<Movie[]> {
  const { movies } = await loadEnrichedContent();
  return movies;
}

/**
 * Carrega apenas séries enriquecidas
 */
export async function loadEnrichedSeries(): Promise<Movie[]> {
  const { series } = await loadEnrichedContent();
  return series;
}

/**
 * Limpa o cache
 */
export function clearEnrichedCache() {
  enrichedCache = null;
  console.log('🗑️ Cache de conteúdo enriquecido limpo');
}
