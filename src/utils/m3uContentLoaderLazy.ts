/**
 * 🚀 M3U CONTENT LOADER COM LAZY LOADING
 * 
 * Carrega conteúdo do filmes.txt de forma progressiva:
 * 1. FASE 1: Carrega 20 itens prioritários (página inicial)
 * 2. FASE 2: Carrega resto em background (não bloqueia UI)
 * 
 * ✅ Com cache TMDB (LocalStorage)
 * ✅ Requisições controladas (3 simultâneas)
 * ✅ Delay entre batches (500ms)
 */

import { parseM3U, M3UEntry } from './m3uParser';
import { projectId, publicAnonKey } from './supabase/info';
import { getFromCache, saveToCache, cleanExpiredCache } from './tmdbCache';
import { enrichMovie, enrichSeries } from '../services/tmdbService';

export interface M3UContent {
  id: number;
  title: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
  streamUrl: string;
  category: string;
  type: 'movie' | 'tv';
  logo?: string;
  original_title?: string;
}

interface CachedM3UData {
  filmes: M3UContent[];
  series: M3UContent[];
  canais: M3UEntry[];
  timestamp: number;
}

// Cache global dos dados M3U (não TMDB)
let m3uRawCache: CachedM3UData | null = null;
const M3U_CACHE_DURATION = 30 * 60 * 1000; // 30 minutos

// Itens prioritários (primeira página)
const PRIORITY_ITEMS_COUNT = 20;

/**
 * Detecta tipo baseado nos dados do servidor
 */
function detectTypeFromServerData(item: any): 'movie' | 'tv' | 'canal' {
  const nome = (item.name || item.title || '').toLowerCase();
  const categoria = (item.category || '').toLowerCase();
  
  // Canais
  const canalKeywords = ['tv', 'canal', 'channel', 'ao vivo', 'live', 'news', 'sport', 'esporte', 'globo', 'record', 'sbt', 'band'];
  if (canalKeywords.some(k => categoria.includes(k))) {
    return 'canal';
  }
  
  // Séries
  const serieKeywords = [
    'serie', 'series', 'temporada', 'season', 
    's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10',
    's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
    'episodio', 'episode', 'ep', 'e01', 'e02', 'e03',
    'temp', 'temporadas'
  ];
  
  if (/s\d{1,2}e\d{1,2}/i.test(nome) || /temporada\s*\d+/i.test(nome) || /season\s*\d+/i.test(nome)) {
    return 'tv';
  }
  
  if (serieKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
    return 'tv';
  }
  
  // Filmes
  const filmeKeywords = ['filme', 'movie', 'cinema'];
  if (filmeKeywords.some(k => categoria.includes(k))) {
    return 'movie';
  }
  
  if (/\b(19|20)\d{2}\b/.test(nome)) {
    return 'movie';
  }
  
  return 'movie';
}

/**
 * Carrega dados RAW do servidor (sem enriquecimento TMDB)
 */
async function loadRawM3UData(): Promise<{ filmes: M3UContent[]; series: M3UContent[] }> {
  // Verificar cache M3U
  if (m3uRawCache && Date.now() - m3uRawCache.timestamp < M3U_CACHE_DURATION) {
    console.log('📦 Usando cache RAW do M3U');
    return {
      filmes: m3uRawCache.filmes,
      series: m3uRawCache.series,
    };
  }
  
  console.log('📡 Buscando filmes.txt do servidor...');
  
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/filmes`;
  
  const response = await fetch(serverUrl, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  if (!data.movies || data.movies.length === 0) {
    throw new Error('Nenhum filme encontrado no servidor');
  }
  
  console.log(`✅ ${data.movies.length} itens carregados do servidor`);
  
  // Separar filmes e séries (SEM enriquecimento)
  const filmes: M3UContent[] = data.movies
    .filter((movie: any) => detectTypeFromServerData(movie) === 'movie')
    .map((movie: any, index: number) => ({
      id: movie.id || index + 1000,
      title: movie.name || movie.title,
      name: movie.name || movie.title,
      original_title: movie.title,
      poster_path: movie.logo || undefined,
      backdrop_path: movie.logo || undefined,
      overview: `Stream: ${movie.name || movie.title}`,
      vote_average: 0,
      release_date: undefined,
      genre_ids: [],
      streamUrl: movie.url,
      category: movie.category || 'outros',
      type: 'movie' as const,
      logo: movie.logo,
    }));
  
  const series: M3UContent[] = data.movies
    .filter((movie: any) => detectTypeFromServerData(movie) === 'tv')
    .map((movie: any, index: number) => ({
      id: movie.id || index + 2000,
      title: movie.name || movie.title,
      name: movie.name || movie.title,
      original_title: movie.title,
      poster_path: movie.logo || undefined,
      backdrop_path: movie.logo || undefined,
      overview: `Stream: ${movie.name || movie.title}`,
      vote_average: 0,
      release_date: undefined,
      genre_ids: [],
      streamUrl: movie.url,
      category: movie.category || 'outros',
      type: 'tv' as const,
      logo: movie.logo,
    }));
  
  console.log(`🎬 Filmes: ${filmes.length} | 📺 Séries: ${series.length}`);
  
  // Cache RAW (não enriquecido)
  m3uRawCache = {
    filmes,
    series,
    canais: [],
    timestamp: Date.now(),
  };
  
  return { filmes, series };
}

/**
 * Enriquece um único item com TMDB (com cache)
 */
async function enrichSingleItem(item: M3UContent): Promise<M3UContent> {
  // Extrair ano
  const yearMatch = item.original_title?.match(/\b(19|20)\d{2}\b/) || item.title.match(/\b(19|20)\d{2}\b/);
  const year = yearMatch ? parseInt(yearMatch[0]) : undefined;
  
  // 1️⃣ CACHE PRIMEIRO
  const cached = getFromCache(item.title, year, item.type);
  if (cached) {
    return {
      ...item,
      poster_path: cached.poster_url || cached.poster_path || item.poster_path,
      backdrop_path: cached.backdrop_url || cached.backdrop_path || item.backdrop_path,
      overview: cached.overview || item.overview,
      vote_average: cached.vote_average || item.vote_average,
      release_date: cached.release_date || item.release_date,
      genre_ids: cached.genres?.map((g: any) => g.id) || item.genre_ids,
    };
  }
  
  // 2️⃣ BUSCAR TMDB
  try {
    const enrichFunc = item.type === 'movie' ? enrichMovie : enrichSeries;
    const tmdbData = await enrichFunc(item.title, year);
    
    if (tmdbData) {
      // Salvar no cache
      saveToCache(item.title, tmdbData, year, item.type);
      
      return {
        ...item,
        poster_path: tmdbData.poster_url || item.poster_path,
        backdrop_path: tmdbData.backdrop_url || item.backdrop_path,
        overview: tmdbData.overview || item.overview,
        vote_average: tmdbData.vote_average || item.vote_average,
        release_date: tmdbData.release_date || item.release_date,
        genre_ids: tmdbData.genres?.map((g: any) => g.id) || item.genre_ids,
      };
    }
  } catch (error) {
    // Silenciosamente falhar
  }
  
  return item;
}

/**
 * Enriquece múltiplos itens em lote
 */
async function enrichBatch(items: M3UContent[]): Promise<M3UContent[]> {
  const CONCURRENT = 3;
  const BATCH_SIZE = 5;
  const DELAY = 500;
  
  const enriched: M3UContent[] = [];
  let cacheHits = 0;
  let apiCalls = 0;
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const yearMatch = item.original_title?.match(/\b(19|20)\d{2}\b/) || item.title.match(/\b(19|20)\d{2}\b/);
        const year = yearMatch ? parseInt(yearMatch[0]) : undefined;
        
        const cached = getFromCache(item.title, year, item.type);
        if (cached) {
          cacheHits++;
        } else {
          apiCalls++;
        }
        
        return enrichSingleItem(item);
      })
    );
    
    enriched.push(...batchResults);
    
    // Log progresso
    if ((i + BATCH_SIZE) % 20 === 0 || i + BATCH_SIZE >= items.length) {
      const progress = Math.min(i + BATCH_SIZE, items.length);
      console.log(`   📊 ${progress}/${items.length} | 💾 ${cacheHits} cache | 🌐 ${apiCalls} API`);
    }
    
    // Delay entre batches
    if (i + BATCH_SIZE < items.length) {
      await new Promise(resolve => setTimeout(resolve, DELAY));
    }
  }
  
  console.log(`   ✅ Total: ${cacheHits} cache hits | ${apiCalls} API calls`);
  
  return enriched;
}

/**
 * 🚀 CARREGAMENTO LAZY
 * 
 * @param priorityOnly - true = só 20 prioritários, false = todos
 */
export async function loadM3UContentLazy(priorityOnly: boolean = false): Promise<CachedM3UData> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 LAZY LOAD ${priorityOnly ? 'PRIORITÁRIOS' : 'COMPLETO'}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Limpar cache expirado
  cleanExpiredCache();
  
  // Carregar dados RAW
  const { filmes: allFilmes, series: allSeries } = await loadRawM3UData();
  
  if (priorityOnly) {
    // ═══════════════════════════════════════════════════════════
    // MODO PRIORITÁRIO: Apenas 20 primeiros itens
    // ═══════════════════════════════════════════════════════════
    
    const priorityFilmes = allFilmes.slice(0, Math.min(PRIORITY_ITEMS_COUNT, allFilmes.length));
    const prioritySeries = allSeries.slice(0, Math.max(0, PRIORITY_ITEMS_COUNT - priorityFilmes.length));
    
    console.log(`🎯 Enriquecendo ${priorityFilmes.length} filmes prioritários...`);
    const enrichedFilmes = await enrichBatch(priorityFilmes);
    
    console.log(`🎯 Enriquecendo ${prioritySeries.length} séries prioritárias...`);
    const enrichedSeries = await enrichBatch(prioritySeries);
    
    console.log('✅ PRIORITÁRIOS CARREGADOS!');
    
    return {
      filmes: enrichedFilmes,
      series: enrichedSeries,
      canais: [],
      timestamp: Date.now(),
    };
    
  } else {
    // ═══════════════════════════════════════════════════════════
    // MODO COMPLETO: Todos os itens
    // ═══════════════════════════════════════════════════════════
    
    console.log(`🔄 Enriquecendo TODOS os ${allFilmes.length} filmes...`);
    const enrichedFilmes = await enrichBatch(allFilmes);
    
    console.log(`🔄 Enriquecendo TODAS as ${allSeries.length} séries...`);
    const enrichedSeries = await enrichBatch(allSeries);
    
    console.log('✅ TUDO CARREGADO!');
    
    return {
      filmes: enrichedFilmes,
      series: enrichedSeries,
      canais: [],
      timestamp: Date.now(),
    };
  }
}

/**
 * Carrega apenas filmes
 */
export async function loadM3UFilmesLazy(priorityOnly: boolean = false): Promise<M3UContent[]> {
  const data = await loadM3UContentLazy(priorityOnly);
  return data.filmes;
}

/**
 * Carrega apenas séries
 */
export async function loadM3USeriesLazy(priorityOnly: boolean = false): Promise<M3UContent[]> {
  const data = await loadM3UContentLazy(priorityOnly);
  return data.series;
}
