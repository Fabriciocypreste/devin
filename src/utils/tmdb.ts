import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;

// 🔥 TEMPORÁRIO: API Key hardcoded para teste rápido
// TODO: Depois de testar, REMOVER esta linha e criar arquivo .env
const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';

const TMDB_DIRECT_URL = 'https://api.themoviedb.org/3';

export interface Movie {
  id: number | string;
  title?: string;
  name?: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  media_type?: 'movie' | 'tv' | string;
  // Campos adicionais do enriquecimento
  original_title?: string;
  original_name?: string;
  vote_count?: number;
  popularity?: number;
  adult?: boolean;
  original_language?: string;
  streamUrl?: string;  // URL do stream M3U
  episodes?: Movie[];  // Episódios agrupados (para séries)
}

export interface TMDBResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

async function fetchFromTMDB(endpoint: string, retries = 1): Promise<any> {
  // MODO DIRETO: Edge Functions não deployadas - ir direto para TMDB API
  // Isso evita erros de "Failed to fetch" no console

  console.log('🔄 Fetching directly from TMDB API (Edge Functions disabled)');

  try {
    const directUrl = convertToDirectUrl(endpoint);
    console.log(`📡 TMDB request: ${directUrl.replace(TMDB_API_KEY, '***')}`);

    const response = await fetch(directUrl);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));

      // 404 is often expected - silent handling
      if (response.status === 404) {
        // console.log(`ℹ️ TMDB: Resource not found (404) - expected for some content`);
        throw new Error(`Not found`);
      }

      throw new Error(`TMDB API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log(`✅ TMDB response: ${data.results?.length || data.id || 'OK'}`);
    return data;
  } catch (error) {
    // Only log as error if it's not a 404
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (!errorMessage.includes('Not found') && !errorMessage.includes('404')) {
      console.error('❌ TMDB API error:', error);
    }
    throw error;
  }

  /* CÓDIGO ORIGINAL COM SERVIDOR - Reativar após deploy das Edge Functions
  let lastError: Error | null = null;
  
  // Try server endpoint first
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const url = `${BASE_URL}${endpoint}`;
      console.log(`🔄 Fetching via server (attempt ${attempt}/${retries}): ${url}`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        
        // 404 is often expected (e.g., no videos available, content removed) - silently handle
        if (response.status === 404) {
          // Silenciado - 404 é esperado para conteúdo removido ou indisponível
          // console.log(`ℹ️ Content not found (404): ${endpoint}`);
          lastError = new Error(`Not found: ${response.statusText}`);
          break;
        }
        
        console.error(`❌ Server error: ${response.status} ${response.statusText}`, errorData);
        
        // Don't retry on other 4xx errors
        if (response.status >= 400 && response.status < 500) {
          lastError = new Error(`Client error: ${response.statusText}`);
          break;
        }
        
        lastError = new Error(`Server error: ${response.statusText}`);
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
          continue;
        }
        break;
      }

      const data = await response.json();
      console.log(`✅ Server response received (${data.results?.length || 'N/A'} results)`);
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Better error logging for AbortError
      if (error instanceof Error && error.name === 'AbortError') {
        console.error(`⏱️ Request timeout (attempt ${attempt}/${retries}): Server took too long to respond`);
      } else {
        console.error(`❌ Server fetch error (attempt ${attempt}/${retries}):`, error);
      }
      
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Increased delay between retries
      }
    }
  }
  
  // Server failed, try direct TMDB API as fallback
  console.log('⚠️ Server unavailable, trying direct TMDB API...');
  try {
    const directUrl = convertToDirectUrl(endpoint);
    console.log(`🔄 Fetching directly from TMDB: ${directUrl}`);
    
    const response = await fetch(directUrl);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      
      // 404 is often expected - log as info
      if (response.status === 404) {
        console.log(`ℹ️ Direct TMDB: Resource not found (404)`);
        throw new Error(`Not found`);
      }
      
      throw new Error(`TMDB API error: ${response.statusText} - ${JSON.stringify(errorData)}`);
    }
    
    const data = await response.json();
    console.log(`✅ Direct TMDB response received (${data.results?.length || 'N/A'} results)`);
    return data;
  } catch (directError) {
    // Only log as error if it's not a 404
    const errorMessage = directError instanceof Error ? directError.message : String(directError);
    if (!errorMessage.includes('Not found') && !errorMessage.includes('404')) {
      console.error('❌ Direct TMDB API also failed:', directError);
    }
    throw lastError || directError;
  }
  */
}

// Convert server endpoint to direct TMDB URL
function convertToDirectUrl(endpoint: string): string {
  // Remove /tmdb prefix if present
  const path = endpoint.replace(/^\/tmdb/, '');

  // Parse the path and query params
  const [pathPart, queryPart] = path.split('?');
  const segments = pathPart.split('/').filter(s => s);

  let tmdbPath = '';
  let queryParams = `api_key=${TMDB_API_KEY}&language=pt-BR`;

  if (queryPart) {
    queryParams += `&${queryPart}`;
  }

  // Map server routes to TMDB API routes
  if (segments[0] === 'trending') {
    // /trending/movie/day -> /trending/movie/day
    tmdbPath = `/${segments.join('/')}`;
  } else if (segments[0] === 'popular') {
    // /popular/movie -> /movie/popular
    tmdbPath = `/${segments[1]}/popular`;
  } else if (segments[0] === 'top-rated') {
    // /top-rated/movie -> /movie/top_rated
    tmdbPath = `/${segments[1]}/top_rated`;
  } else if (segments[0] === 'search') {
    // /search/movie -> /search/movie
    tmdbPath = `/${segments.join('/')}`;
  } else if (segments[0] === 'details') {
    // /details/movie/123 -> /movie/123
    tmdbPath = `/${segments[1]}/${segments[2]}`;
  } else if (segments[0] === 'images') {
    // /images/movie/123 -> /movie/123/images
    tmdbPath = `/${segments[1]}/${segments[2]}/images`;
  } else if (segments[0] === 'credits') {
    // /credits/movie/123 -> /movie/123/credits
    tmdbPath = `/${segments[1]}/${segments[2]}/credits`;
  } else if (segments[0] === 'videos') {
    // /videos/movie/123 -> /movie/123/videos
    tmdbPath = `/${segments[1]}/${segments[2]}/videos`;
  } else if (segments[0] === 'discover') {
    // /discover/movie -> /discover/movie
    tmdbPath = `/${segments.join('/')}`;
  } else if (segments[0] === 'person') {
    // /person/123 or /person/123/movie_credits
    tmdbPath = `/${segments.join('/')}`;
  } else if (segments[0] === 'tv' && segments[2] === 'season') {
    // /tv/123/season/1 -> /tv/123/season/1
    tmdbPath = `/${segments.join('/')}`;
  } else {
    tmdbPath = path;
  }

  return `${TMDB_DIRECT_URL}${tmdbPath}?${queryParams}`;
}

export async function getTrending(mediaType: 'movie' | 'tv' | 'all', timeWindow: 'day' | 'week' = 'day'): Promise<TMDBResponse> {
  return fetchFromTMDB(`/tmdb/trending/${mediaType}/${timeWindow}`);
}

export async function getPopular(mediaType: 'movie' | 'tv'): Promise<TMDBResponse> {
  return fetchFromTMDB(`/tmdb/popular/${mediaType}`);
}

export async function getTopRated(mediaType: 'movie' | 'tv'): Promise<TMDBResponse> {
  return fetchFromTMDB(`/tmdb/top-rated/${mediaType}`);
}

export async function search(mediaType: 'movie' | 'tv' | 'multi', query: string): Promise<TMDBResponse> {
  if (!query || query.trim() === '') {
    console.warn('⚠️ Search chamado com query vazia');
    return { results: [], page: 1, total_pages: 0, total_results: 0 };
  }
  return fetchFromTMDB(`/tmdb/search/${mediaType}?query=${encodeURIComponent(query)}`);
}

export async function getDetails(mediaType: 'movie' | 'tv', id: number): Promise<Movie> {
  // Validar ID
  if (!id || id <= 0 || isNaN(id)) {
    throw new Error(`Invalid ${mediaType} ID: ${id}`);
  }

  // Usar append_to_response para buscar tudo de uma vez
  const appendParams = 'credits,images,videos,content_ratings,release_dates';
  return fetchFromTMDB(`/tmdb/details/${mediaType}/${id}?append_to_response=${appendParams}&include_image_language=pt,en,null`);
}

export function getImageUrl(path: string, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '';
  // Se o path já é uma URL completa, retornar diretamente
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function getTitle(item: Movie): string {
  return item.title || item.name || 'Untitled';
}

export function getReleaseYear(item: Movie): string {
  const date = item.release_date || item.first_air_date;
  return date ? new Date(date).getFullYear().toString() : '';
}

export async function getImages(mediaType: 'movie' | 'tv', id: number): Promise<any> {
  return fetchFromTMDB(`/tmdb/images/${mediaType}/${id}`);
}

export async function getSeason(tvId: number, seasonNumber: number): Promise<any> {
  return fetchFromTMDB(`/tmdb/tv/${tvId}/season/${seasonNumber}`);
}

export async function getCredits(mediaType: 'movie' | 'tv', id: number): Promise<any> {
  return fetchFromTMDB(`/tmdb/credits/${mediaType}/${id}`);
}

export async function getVideos(mediaType: 'movie' | 'tv', id: number): Promise<any> {
  try {
    return await fetchFromTMDB(`/tmdb/videos/${mediaType}/${id}`);
  } catch (error) {
    // Return empty results for 404s or other errors - videos are optional
    console.log(`ℹ️ No videos available for ${mediaType} ${id}`);
    return { results: [] };
  }
}

export async function discover(mediaType: 'movie' | 'tv', params?: {
  primary_release_year?: number;
  first_air_date_year?: number;
  sort_by?: string;
}): Promise<TMDBResponse> {
  let endpoint = `/tmdb/discover/${mediaType}`;
  const queryParams = new URLSearchParams();

  if (params?.primary_release_year) {
    queryParams.append('primary_release_year', params.primary_release_year.toString());
  }
  if (params?.first_air_date_year) {
    queryParams.append('first_air_date_year', params.first_air_date_year.toString());
  }
  if (params?.sort_by) {
    queryParams.append('sort_by', params.sort_by);
  }

  const queryString = queryParams.toString();
  if (queryString) {
    endpoint += `?${queryString}`;
  }

  return fetchFromTMDB(endpoint);
}

export async function getPersonDetails(personId: number): Promise<any> {
  return fetchFromTMDB(`/tmdb/person/${personId}`);
}

export async function getPersonMovieCredits(personId: number): Promise<any> {
  return fetchFromTMDB(`/tmdb/person/${personId}/movie_credits`);
}

export async function getPersonTVCredits(personId: number): Promise<any> {
  return fetchFromTMDB(`/tmdb/person/${personId}/tv_credits`);
}

export async function getPersonImages(personId: number): Promise<any> {
  return fetchFromTMDB(`/tmdb/person/${personId}/images`);
}