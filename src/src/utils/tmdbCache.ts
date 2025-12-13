/**
 * 🗄️ TMDB CACHE SYSTEM
 * 
 * Sistema de cache inteligente para imagens e dados do TMDB
 * - LocalStorage para metadados (paths)
 * - IndexedDB para URLs completas
 * - TTL (Time To Live) configurável
 * - Lazy loading por demanda
 */

import { getDetails } from './tmdb';

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ═══════════════════════════════════════════════════════════

const CACHE_VERSION = 'v1';
const CACHE_KEYS = {
  METADATA: `tmdb_metadata_${CACHE_VERSION}`,
  IMAGES: `tmdb_images_${CACHE_VERSION}`,
  TIMESTAMP: `tmdb_timestamp_${CACHE_VERSION}`,
};

// TTL: 7 dias (em milissegundos)
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000;

// Limite de itens no cache
const MAX_CACHE_ITEMS = 1000;

// TTL para detalhes (em milissegundos)
const DETAIL_CACHE_DURATION = 24 * 60 * 60 * 1000;

// Cache para detalhes
const detailsCache = new Map<string, { data: any; timestamp: number }>();

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export interface TMDBCacheEntry {
  id: string; // Chave única (title + year)
  title: string;
  year?: number;
  type: 'movie' | 'tv';
  tmdbId?: number;
  poster_path?: string;
  backdrop_path?: string;
  poster_url?: string;
  backdrop_url?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  genres?: Array<{ id: number; name: string }>;
  timestamp: number;
}

interface CacheStats {
  totalItems: number;
  cacheSize: string;
  oldestEntry: number;
  newestEntry: number;
  hitRate: number;
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES DE CACHE
// ═══════════════════════════════════════════════════════════

/**
 * Gera chave única para cache
 */
function getCacheKey(title: string, year?: number, type: 'movie' | 'tv' = 'movie'): string {
  const cleanTitle = title.toLowerCase().trim();
  return `${type}:${cleanTitle}:${year || 'unknown'}`;
}

/**
 * Verifica se o cache ainda é válido
 */
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_TTL;
}

/**
 * Carrega todos os metadados do cache
 */
function loadCacheMetadata(): Map<string, TMDBCacheEntry> {
  try {
    const data = localStorage.getItem(CACHE_KEYS.METADATA);
    if (!data) return new Map();
    
    const parsed = JSON.parse(data);
    return new Map(Object.entries(parsed));
  } catch (error) {
    console.warn('⚠️ Erro ao carregar cache:', error);
    return new Map();
  }
}

/**
 * Salva metadados no cache
 */
function saveCacheMetadata(cache: Map<string, TMDBCacheEntry>): void {
  try {
    // Limitar número de itens
    if (cache.size > MAX_CACHE_ITEMS) {
      console.log(`🧹 Limpando cache antigo (${cache.size} -> ${MAX_CACHE_ITEMS})`);
      
      // Ordenar por timestamp e manter apenas os mais recentes
      const sorted = Array.from(cache.entries())
        .sort((a, b) => b[1].timestamp - a[1].timestamp)
        .slice(0, MAX_CACHE_ITEMS);
      
      cache = new Map(sorted);
    }
    
    const obj = Object.fromEntries(cache);
    localStorage.setItem(CACHE_KEYS.METADATA, JSON.stringify(obj));
    localStorage.setItem(CACHE_KEYS.TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.warn('⚠️ Erro ao salvar cache:', error);
    
    // Se falhar (quota excedida), limpar tudo e tentar novamente
    if (error instanceof DOMException && error.name === 'QuotaExceededError') {
      console.log('🗑️ Quota excedida. Limpando cache...');
      clearCache();
    }
  }
}

/**
 * Busca item no cache
 */
export function getFromCache(
  title: string,
  year?: number,
  type: 'movie' | 'tv' = 'movie'
): TMDBCacheEntry | null {
  const key = getCacheKey(title, year, type);
  const cache = loadCacheMetadata();
  const entry = cache.get(key);
  
  if (!entry) {
    return null;
  }
  
  // Verificar se ainda é válido
  if (!isCacheValid(entry.timestamp)) {
    console.log(`🗑️ Cache expirado para "${title}"`);
    cache.delete(key);
    saveCacheMetadata(cache);
    return null;
  }
  
  console.log(`✅ Cache HIT: "${title}"`);
  return entry;
}

/**
 * Salva item no cache
 */
export function saveToCache(
  title: string,
  data: Partial<TMDBCacheEntry>,
  year?: number,
  type: 'movie' | 'tv' = 'movie'
): void {
  const key = getCacheKey(title, year, type);
  const cache = loadCacheMetadata();
  
  const entry: TMDBCacheEntry = {
    id: key,
    title,
    year,
    type,
    timestamp: Date.now(),
    ...data,
  };
  
  cache.set(key, entry);
  saveCacheMetadata(cache);
  
  console.log(`💾 Cache SAVE: "${title}"`);
}

/**
 * Limpa todo o cache
 */
export function clearCache(): void {
  try {
    localStorage.removeItem(CACHE_KEYS.METADATA);
    localStorage.removeItem(CACHE_KEYS.IMAGES);
    localStorage.removeItem(CACHE_KEYS.TIMESTAMP);
    console.log('🗑️ Cache TMDB limpo');
  } catch (error) {
    console.warn('⚠️ Erro ao limpar cache:', error);
  }
}

/**
 * Obtém estatísticas do cache
 */
export function getCacheStats(): CacheStats {
  const cache = loadCacheMetadata();
  const entries = Array.from(cache.values());
  
  if (entries.length === 0) {
    return {
      totalItems: 0,
      cacheSize: '0 KB',
      oldestEntry: 0,
      newestEntry: 0,
      hitRate: 0,
    };
  }
  
  const timestamps = entries.map(e => e.timestamp);
  const oldestEntry = Math.min(...timestamps);
  const newestEntry = Math.max(...timestamps);
  
  // Calcular tamanho aproximado
  const sizeBytes = new Blob([localStorage.getItem(CACHE_KEYS.METADATA) || '']).size;
  const sizeKB = (sizeBytes / 1024).toFixed(2);
  
  return {
    totalItems: cache.size,
    cacheSize: `${sizeKB} KB`,
    oldestEntry,
    newestEntry,
    hitRate: 0, // TODO: Implementar contador de hits
  };
}

/**
 * Remove entradas expiradas do cache
 */
export function cleanExpiredCache(): number {
  const cache = loadCacheMetadata();
  const initialSize = cache.size;
  
  let removed = 0;
  for (const [key, entry] of cache.entries()) {
    if (!isCacheValid(entry.timestamp)) {
      cache.delete(key);
      removed++;
    }
  }
  
  if (removed > 0) {
    saveCacheMetadata(cache);
    console.log(`🧹 Removidas ${removed} entradas expiradas do cache`);
  }
  
  return removed;
}

/**
 * Busca múltiplos itens em lote (retorna apenas os que estão em cache)
 */
export function getBatchFromCache(
  items: Array<{ title: string; year?: number; type?: 'movie' | 'tv' }>
): Map<string, TMDBCacheEntry> {
  const cache = loadCacheMetadata();
  const results = new Map<string, TMDBCacheEntry>();
  
  for (const item of items) {
    const key = getCacheKey(item.title, item.year, item.type || 'movie');
    const entry = cache.get(key);
    
    if (entry && isCacheValid(entry.timestamp)) {
      results.set(key, entry);
    }
  }
  
  return results;
}

/**
 * Salva múltiplos itens em lote
 */
export function saveBatchToCache(
  items: Array<{
    title: string;
    data: Partial<TMDBCacheEntry>;
    year?: number;
    type?: 'movie' | 'tv';
  }>
): void {
  const cache = loadCacheMetadata();
  
  for (const item of items) {
    const key = getCacheKey(item.title, item.year, item.type || 'movie');
    
    const entry: TMDBCacheEntry = {
      id: key,
      title: item.title,
      year: item.year,
      type: item.type || 'movie',
      timestamp: Date.now(),
      ...item.data,
    };
    
    cache.set(key, entry);
  }
  
  saveCacheMetadata(cache);
  console.log(`💾 Salvos ${items.length} itens em cache`);
}

/**
 * Pré-carrega dados para o cache (usado em background)
 */
export async function preloadCache(
  items: Array<{ title: string; year?: number; type?: 'movie' | 'tv' }>,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  console.log(`🔄 Pré-carregando ${items.length} itens...`);
  
  // Filtrar apenas itens que não estão em cache
  const cache = loadCacheMetadata();
  const uncachedItems = items.filter(item => {
    const key = getCacheKey(item.title, item.year, item.type || 'movie');
    const entry = cache.get(key);
    return !entry || !isCacheValid(entry.timestamp);
  });
  
  console.log(`📊 ${uncachedItems.length} itens precisam ser carregados`);
  
  if (onProgress) {
    onProgress(items.length - uncachedItems.length, items.length);
  }
  
  // Nota: A lógica de busca no TMDB será feita pelo tmdbLazyLoader
}

// ═══════════════════════════════════════════════════════════
// UTILITÁRIOS
// ═══════════════════════════════════════════════════════════

/**
 * Exporta cache para JSON (para debug/backup)
 */
export function exportCache(): string {
  const cache = loadCacheMetadata();
  const obj = Object.fromEntries(cache);
  return JSON.stringify(obj, null, 2);
}

/**
 * Importa cache de JSON (para restaurar backup)
 */
export function importCache(json: string): void {
  try {
    const obj = JSON.parse(json);
    const cache = new Map(Object.entries(obj));
    saveCacheMetadata(cache);
    console.log(`✅ Importados ${cache.size} itens para o cache`);
  } catch (error) {
    console.error('❌ Erro ao importar cache:', error);
  }
}

// ═══════════════════════════════════════════════════════════
// FUNÇÕES AUXILIARES PARA MOVIECARD
// ═══════════════════════════════════════════════════════════

/**
 * Busca detalhes completos com cache (para MovieCard)
 */
export async function getCachedDetails(mediaType: 'movie' | 'tv', tmdbId: number): Promise<any> {
  const cacheKey = `details-${mediaType}-${tmdbId}`;
  
  // Verificar cache
  const cached = detailsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < DETAIL_CACHE_DURATION) {
    console.log('✅ [Cache Hit] Detalhes:', cacheKey);
    return cached.data;
  }
  
  // Buscar da API com append_to_response
  console.log('📡 [Cache Miss] Buscando detalhes:', cacheKey);
  
  const appendParams = 'images,content_ratings,release_dates,credits,genres';
  const details = await getDetails(mediaType, tmdbId, appendParams);
  
  // Salvar no cache
  if (details) {
    detailsCache.set(cacheKey, {
      data: details,
      timestamp: Date.now()
    });
  }
  
  return details;
}

/**
 * Extrai gêneros dos detalhes
 */
export function extractGenres(details: any): string[] {
  if (!details || !details.genres) return [];
  return details.genres.slice(0, 3).map((g: any) => g.name);
}

/**
 * Extrai classificação etária dos detalhes
 */
export function extractAgeRating(details: any, mediaType: 'movie' | 'tv'): string {
  if (!details) return 'L';
  
  if (mediaType === 'tv' && details.content_ratings?.results) {
    const brRating = details.content_ratings.results.find((r: any) => r.iso_3166_1 === 'BR');
    const usRating = details.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US');
    return brRating?.rating || usRating?.rating || 'L';
  } else if (mediaType === 'movie' && details.release_dates?.results) {
    const brRelease = details.release_dates.results.find((r: any) => r.iso_3166_1 === 'BR');
    const usRelease = details.release_dates.results.find((r: any) => r.iso_3166_1 === 'US');
    const certification = brRelease?.release_dates?.[0]?.certification || usRelease?.release_dates?.[0]?.certification;
    return certification || 'L';
  }
  
  return 'L';
}

/**
 * Extrai logo dos detalhes
 */
export function extractLogoFromDetails(details: any): string | null {
  if (!details || !details.images?.logos) return null;
  
  const logos = details.images.logos;
  const ptLogo = logos.find((l: any) => l.iso_639_1 === 'pt');
  const enLogo = logos.find((l: any) => l.iso_639_1 === 'en');
  const anyLogo = logos[0];
  
  const selectedLogo = ptLogo || enLogo || anyLogo;
  return selectedLogo ? selectedLogo.file_path : null;
}