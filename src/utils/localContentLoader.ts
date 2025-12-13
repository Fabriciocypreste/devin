/**
 * Local Content Loader
 * Carrega filmes e séries dos arquivos JSON locais com imagens correspondentes
 */

import { Movie } from '../types';

// Import local JSON data
import moviesData from '../data/movies.json';
import seriesData from '../data/series.json';
import channelsData from '../data/channels.json';

export interface LocalContentItem {
  id: string;
  name: string;
  title: string;
  logo?: string | null;
  group: string;
  url: string;
  poster?: string;
  backdrop?: string;
  release_date?: string;
  tmdb_id?: number;
  local_poster?: string;
  original_image?: string;
  is_series?: boolean;
}

/**
 * Converte item local para formato Movie usado pelo app
 */
function convertToMovie(item: LocalContentItem, index: number): Movie {
  return {
    id: item.tmdb_id || index + 1000,
    title: item.title || item.name,
    name: item.name || item.title,
    overview: `${item.title || item.name} - ${item.group}`,
    poster_path: item.local_poster || item.poster || '',
    backdrop_path: item.backdrop || item.local_poster || item.poster || '',
    release_date: item.release_date || '',
    vote_average: 7.5,
    vote_count: 100,
    genre_ids: getGenreIds(item.group),
    media_type: item.is_series ? 'tv' : 'movie',
    // Custom fields for streaming
    stream_url: item.url,
    local_poster: item.local_poster,
  };
}

/**
 * Mapeia grupos para IDs de gênero do TMDB
 */
function getGenreIds(group: string): number[] {
  const groupLower = (group || '').toLowerCase();
  
  if (groupLower.includes('ação') || groupLower.includes('action')) return [28];
  if (groupLower.includes('comédia') || groupLower.includes('comedy')) return [35];
  if (groupLower.includes('drama')) return [18];
  if (groupLower.includes('terror') || groupLower.includes('horror')) return [27];
  if (groupLower.includes('ficção') || groupLower.includes('sci-fi')) return [878];
  if (groupLower.includes('animação') || groupLower.includes('animation')) return [16];
  if (groupLower.includes('documentário') || groupLower.includes('documentary')) return [99];
  if (groupLower.includes('romance')) return [10749];
  if (groupLower.includes('aventura') || groupLower.includes('adventure')) return [12];
  if (groupLower.includes('família') || groupLower.includes('family')) return [10751];
  if (groupLower.includes('infantil') || groupLower.includes('kids')) return [10751, 16];
  
  return [28]; // Default: Ação
}

/**
 * Carrega todos os filmes locais
 */
export function loadLocalMovies(): Movie[] {
  const movies = (moviesData as LocalContentItem[]).map((item, index) => 
    convertToMovie(item, index)
  );
  console.log(`📽️ Loaded ${movies.length} local movies`);
  return movies;
}

/**
 * Carrega todas as séries locais
 */
export function loadLocalSeries(): Movie[] {
  const series = (seriesData as LocalContentItem[]).map((item, index) => 
    convertToMovie({ ...item, is_series: true }, index + 1000)
  );
  console.log(`📺 Loaded ${series.length} local series`);
  return series;
}

/**
 * Carrega todo o conteúdo local (filmes + séries)
 */
export function loadAllLocalContent(): Movie[] {
  const movies = loadLocalMovies();
  const series = loadLocalSeries();
  const all = [...movies, ...series];
  console.log(`🎬 Loaded ${all.length} total local content items`);
  return all;
}

/**
 * Carrega canais locais (arquivos .ts)
 */
export function loadLocalChannels(): LocalContentItem[] {
  const channels = channelsData as LocalContentItem[];
  console.log(`📡 Loaded ${channels.length} local channels`);
  return channels;
}

/**
 * Busca conteúdo por título
 */
export function searchLocalContent(query: string): Movie[] {
  const all = loadAllLocalContent();
  const queryLower = query.toLowerCase();
  
  return all.filter(item => 
    (item.title || '').toLowerCase().includes(queryLower) ||
    (item.name || '').toLowerCase().includes(queryLower)
  );
}

export default {
  loadLocalMovies,
  loadLocalSeries,
  loadAllLocalContent,
  loadLocalChannels,
  searchLocalContent,
};
