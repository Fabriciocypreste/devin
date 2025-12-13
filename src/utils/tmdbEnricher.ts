/**
 * TMDB Enricher - Enriquece filmes e séries do M3U com imagens e metadados do TMDB
 * Agrupa temporadas de séries para mostrar apenas UMA capa na página inicial
 */

import { M3UContent } from './m3uContentLoader';

const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

interface TMDBSearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
}

interface EnrichedContent extends M3UContent {
  tmdb_id?: number;
  grouped?: boolean;
  episodes?: M3UContent[]; // Para séries com múltiplas temporadas/episódios
}

/**
 * Limpa o título para busca no TMDB (remove ano, temporada, episódio, qualidade)
 */
function cleanTitleForSearch(title: string): string {
  return title
    // Remove temporada/episódio
    .replace(/\b(temporada|season|s)\s*\d+/gi, '')
    .replace(/\b(episodio|episode|ep|e)\s*\d+/gi, '')
    // Remove ano
    .replace(/\b(19|20)\d{2}\b/g, '')
    // Remove qualidade
    .replace(/\b(1080p|720p|480p|360p|HD|FHD|4K|UHD|BluRay|WEB-DL|WEBRip)\b/gi, '')
    // Remove áudio
    .replace(/\b(Dublado|Legendado|Dual|Audio|Nacional)\b/gi, '')
    // Remove caracteres especiais
    .replace(/[[\](){}]/g, '')
    // Remove espaços extras
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extrai número da temporada do título
 */
function extractSeasonNumber(title: string): number | null {
  // Padrões: "S01", "Temporada 1", "Season 1", etc
  const patterns = [
    /\bS(\d{1,2})\b/i,
    /\btemporada\s*(\d+)/i,
    /\bseason\s*(\d+)/i,
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) {
      return parseInt(match[1], 10);
    }
  }
  
  return null;
}

/**
 * Busca metadados no TMDB
 */
async function searchTMDB(title: string, type: 'movie' | 'tv'): Promise<TMDBSearchResult | null> {
  try {
    const cleanedTitle = cleanTitleForSearch(title);
    
    if (!cleanedTitle || cleanedTitle.length < 2) {
      return null;
    }
    
    const endpoint = type === 'movie' ? 'search/movie' : 'search/tv';
    const url = `${TMDB_BASE_URL}/${endpoint}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanedTitle)}&language=pt-BR`;
    
    console.log(`🔍 Buscando no TMDB: "${cleanedTitle}" (${type})`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn(`⚠️ TMDB API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      console.log(`✅ Encontrado: ${result.title || result.name}`);
      return result;
    }
    
    console.log(`ℹ️ Não encontrado: "${cleanedTitle}"`);
    return null;
  } catch (error) {
    console.error('❌ Erro ao buscar no TMDB:', error);
    return null;
  }
}

/**
 * Agrupa séries por nome base (ignora temporada/episódio)
 */
function groupSeriesByTitle(series: M3UContent[]): Map<string, M3UContent[]> {
  const grouped = new Map<string, M3UContent[]>();
  
  series.forEach(item => {
    const baseTitle = cleanTitleForSearch(item.title);
    
    if (!grouped.has(baseTitle)) {
      grouped.set(baseTitle, []);
    }
    
    grouped.get(baseTitle)!.push(item);
  });
  
  return grouped;
}

/**
 * Enriquece um único item com dados do TMDB
 */
async function enrichItem(item: M3UContent): Promise<EnrichedContent> {
  const tmdbData = await searchTMDB(item.title, item.type);
  
  if (tmdbData) {
    return {
      ...item,
      tmdb_id: tmdbData.id,
      poster_path: tmdbData.poster_path ? `${TMDB_IMAGE_BASE}${tmdbData.poster_path}` : item.poster_path,
      backdrop_path: tmdbData.backdrop_path ? `${TMDB_IMAGE_BASE}${tmdbData.backdrop_path}` : item.backdrop_path,
      overview: tmdbData.overview || item.overview,
      vote_average: tmdbData.vote_average || item.vote_average,
      release_date: tmdbData.release_date || tmdbData.first_air_date || item.release_date,
      genre_ids: tmdbData.genre_ids || item.genre_ids,
    };
  }
  
  return item;
}

/**
 * Enriquece filmes com dados do TMDB (com rate limiting)
 */
export async function enrichMovies(movies: M3UContent[], maxItems = 50): Promise<EnrichedContent[]> {
  console.log(`🎬 Enriquecendo ${Math.min(movies.length, maxItems)} filmes com TMDB...`);
  
  const enrichedMovies: EnrichedContent[] = [];
  const moviesToProcess = movies.slice(0, maxItems);
  
  // Processar em lotes de 5 para não sobrecarregar a API
  const BATCH_SIZE = 5;
  const DELAY_BETWEEN_BATCHES = 500; // 500ms
  
  for (let i = 0; i < moviesToProcess.length; i += BATCH_SIZE) {
    const batch = moviesToProcess.slice(i, i + BATCH_SIZE);
    
    const enrichedBatch = await Promise.all(
      batch.map(movie => enrichItem(movie))
    );
    
    enrichedMovies.push(...enrichedBatch);
    
    // Aguardar entre lotes
    if (i + BATCH_SIZE < moviesToProcess.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  // Adicionar filmes não processados sem enriquecimento
  if (movies.length > maxItems) {
    enrichedMovies.push(...movies.slice(maxItems));
  }
  
  console.log(`✅ ${enrichedMovies.length} filmes processados`);
  
  return enrichedMovies;
}

/**
 * Enriquece séries e agrupa por título base (UMA capa por série)
 */
export async function enrichAndGroupSeries(series: M3UContent[], maxItems = 30): Promise<EnrichedContent[]> {
  console.log(`📺 Enriquecendo e agrupando ${series.length} séries...`);
  
  // Agrupar por título base
  const grouped = groupSeriesByTitle(series);
  
  console.log(`📊 ${grouped.size} séries únicas encontradas`);
  
  const enrichedSeries: EnrichedContent[] = [];
  const groupedArray = Array.from(grouped.entries()).slice(0, maxItems);
  
  // Processar em lotes
  const BATCH_SIZE = 5;
  const DELAY_BETWEEN_BATCHES = 500;
  
  for (let i = 0; i < groupedArray.length; i += BATCH_SIZE) {
    const batch = groupedArray.slice(i, i + BATCH_SIZE);
    
    const enrichedBatch = await Promise.all(
      batch.map(async ([baseTitle, episodes]) => {
        // Usar o primeiro episódio como base
        const mainItem = episodes[0];
        
        // Buscar dados no TMDB
        const enriched = await enrichItem(mainItem);
        
        // Ordenar episódios por temporada
        const sortedEpisodes = episodes.sort((a, b) => {
          const seasonA = extractSeasonNumber(a.title) || 0;
          const seasonB = extractSeasonNumber(b.title) || 0;
          return seasonA - seasonB;
        });
        
        return {
          ...enriched,
          grouped: true,
          episodes: sortedEpisodes,
        };
      })
    );
    
    enrichedSeries.push(...enrichedBatch);
    
    // Aguardar entre lotes
    if (i + BATCH_SIZE < groupedArray.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
    }
  }
  
  console.log(`✅ ${enrichedSeries.length} séries processadas e agrupadas`);
  
  return enrichedSeries;
}

/**
 * Enriquece todo o conteúdo (filmes e séries)
 */
export async function enrichAllContent(
  movies: M3UContent[],
  series: M3UContent[],
  options = { maxMovies: 50, maxSeries: 30 }
): Promise<{ movies: EnrichedContent[], series: EnrichedContent[] }> {
  console.log('🎨 Iniciando enriquecimento completo com TMDB...');
  
  const [enrichedMovies, enrichedSeries] = await Promise.all([
    enrichMovies(movies, options.maxMovies),
    enrichAndGroupSeries(series, options.maxSeries)
  ]);
  
  console.log('✅ Enriquecimento completo concluído!');
  
  return {
    movies: enrichedMovies,
    series: enrichedSeries
  };
}

export type { EnrichedContent };
