/**
 * Database Content Loader - Carrega conteudo EXCLUSIVAMENTE do banco de dados
 * 
 * FONTE UNICA: Backend API /api/content
 * NAO usa TMDB diretamente, NAO usa arquivos locais
 * 
 * O banco de dados e a UNICA fonte de verdade para:
 * - Filmes
 * - Series
 * - Episodios
 * - Progresso de visualizacao
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3333';

export interface DatabaseContent {
  id: number;
  tmdbId?: number;
  title: string;
  originalTitle?: string;
  type: 'movie' | 'series';
  overview?: string;
  posterPath?: string;
  backdropPath?: string;
  logoPath?: string;
  trailerUrl?: string;
  streamUrl?: string;
  releaseDate?: string;
  runtime?: number;
  voteAverage: number;
  voteCount: number;
  genres?: string;
  featured: boolean;
  active: boolean;
  seasons?: DatabaseSeason[];
}

export interface DatabaseSeason {
  id: number;
  contentId: number;
  seasonNumber: number;
  name?: string;
  overview?: string;
  posterPath?: string;
  airDate?: string;
  episodes: DatabaseEpisode[];
}

export interface DatabaseEpisode {
  id: number;
  seasonId: number;
  contentId: number;
  seasonNumber: number;
  episodeNumber: number;
  name?: string;
  overview?: string;
  stillPath?: string;
  airDate?: string;
  runtime?: number;
  streamUrl?: string;
}

// Cache em memoria
let cachedContent: DatabaseContent[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Carrega todo o conteudo do banco de dados
 */
export async function loadAllContentFromDatabase(): Promise<{
  movies: DatabaseContent[];
  series: DatabaseContent[];
}> {
  // Verificar cache
  if (cachedContent && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('📦 Usando cache do banco de dados');
    const movies = cachedContent.filter(c => c.type === 'movie');
    const series = cachedContent.filter(c => c.type === 'series');
    return { movies, series };
  }

  console.log('🗄️ Carregando conteudo do banco de dados...');
  console.log(`📡 API: ${API_BASE}/api/content`);

  try {
    // Carregar filmes
    const moviesResponse = await fetch(`${API_BASE}/api/content?type=movie&active=true&limit=1000`);
    if (!moviesResponse.ok) {
      throw new Error(`Erro ao carregar filmes: ${moviesResponse.status}`);
    }
    const moviesData = await moviesResponse.json();

    // Carregar series
    const seriesResponse = await fetch(`${API_BASE}/api/content?type=series&active=true&limit=1000`);
    if (!seriesResponse.ok) {
      throw new Error(`Erro ao carregar series: ${seriesResponse.status}`);
    }
    const seriesData = await seriesResponse.json();

    const movies: DatabaseContent[] = moviesData.contents || [];
    const series: DatabaseContent[] = seriesData.contents || [];

    // Atualizar cache
    cachedContent = [...movies, ...series];
    cacheTimestamp = Date.now();

    console.log(`✅ Carregado do banco: ${movies.length} filmes + ${series.length} series`);

    return { movies, series };
  } catch (error) {
    console.error('❌ Erro ao carregar do banco:', error);
    
    // Retornar cache antigo se existir
    if (cachedContent) {
      console.log('⚠️ Usando cache antigo devido a erro');
      const movies = cachedContent.filter(c => c.type === 'movie');
      const series = cachedContent.filter(c => c.type === 'series');
      return { movies, series };
    }

    return { movies: [], series: [] };
  }
}

/**
 * Carrega um conteudo especifico por ID
 */
export async function loadContentById(contentId: number): Promise<DatabaseContent | null> {
  try {
    const response = await fetch(`${API_BASE}/api/content/${contentId}`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar conteudo: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`❌ Erro ao carregar conteudo ${contentId}:`, error);
    return null;
  }
}

/**
 * Busca conteudo por termo
 */
export async function searchContent(query: string): Promise<DatabaseContent[]> {
  try {
    const response = await fetch(`${API_BASE}/api/content?search=${encodeURIComponent(query)}&active=true&limit=50`);
    if (!response.ok) {
      throw new Error(`Erro na busca: ${response.status}`);
    }
    const data = await response.json();
    return data.contents || [];
  } catch (error) {
    console.error('❌ Erro na busca:', error);
    return [];
  }
}

/**
 * Carrega conteudo em destaque
 */
export async function loadFeaturedContent(): Promise<DatabaseContent[]> {
  try {
    const response = await fetch(`${API_BASE}/api/content?featured=true&active=true&limit=20`);
    if (!response.ok) {
      throw new Error(`Erro ao carregar destaque: ${response.status}`);
    }
    const data = await response.json();
    return data.contents || [];
  } catch (error) {
    console.error('❌ Erro ao carregar destaque:', error);
    return [];
  }
}

/**
 * Converte DatabaseContent para o formato Movie usado pelo App
 */
export function convertToMovieFormat(content: DatabaseContent): any {
  return {
    id: content.id,
    title: content.title,
    name: content.type === 'series' ? content.title : undefined,
    poster_path: content.posterPath,
    backdrop_path: content.backdropPath,
    logo: content.logoPath,
    overview: content.overview,
    vote_average: content.voteAverage,
    release_date: content.type === 'movie' ? content.releaseDate : undefined,
    first_air_date: content.type === 'series' ? content.releaseDate : undefined,
    genre_ids: content.genres ? content.genres.split(',').map(g => parseInt(g.trim())).filter(g => !isNaN(g)) : [],
    type: content.type === 'series' ? 'tv' : 'movie',
    media_type: content.type === 'series' ? 'tv' : 'movie',
    streamUrl: content.streamUrl,
    trailerUrl: content.trailerUrl,
    year: content.releaseDate ? parseInt(content.releaseDate.split('-')[0]) : undefined,
    available: !!content.streamUrl,
    seasons: content.seasons?.map(s => ({
      season_number: s.seasonNumber,
      name: s.name,
      episode_count: s.episodes?.length || 0,
      episodes: s.episodes?.map(e => ({
        episode_number: e.episodeNumber,
        name: e.name,
        still_path: e.stillPath,
        available: !!e.streamUrl,
        streamUrl: e.streamUrl,
      })) || [],
    })) || [],
  };
}

/**
 * Limpa o cache
 */
export function clearDatabaseCache(): void {
  cachedContent = null;
  cacheTimestamp = 0;
  console.log('🗑️ Cache do banco limpo');
}
