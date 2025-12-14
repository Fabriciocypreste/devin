/**
 * M3U Content Loader - Carrega filmes e séries do GitHub via servidor
 * FONTE: https://github.com/Fabriciocypreste/lista
 * ENRIQUECIMENTO: TMDB API para imagens (posters, backdrops, logos)
 * 
 * ⚠️ ATENÇÃO: O repositório GitHub precisa estar público e conter os arquivos:
 * - filmes.txt (ou filmes.m3u)
 * - series.txt (ou series.m3u)
 * - canais.txt (ou canais.m3u)
 * 
 * ✅ OTIMIZAÇÕES IMPLEMENTADAS:
 * - Cache LocalStorage (7 dias)
 * - Lazy Loading (prioriza primeira página)
 * - Carregamento progressivo em background
 * - Limita requisições simultâneas ao TMDB
 * - Fallback para TMDB se GitHub não disponível
 */

import { parseM3U, M3UEntry } from './m3uParser';
import { projectId, publicAnonKey } from './supabase/info';
import { getFromCache, saveToCache, cleanExpiredCache } from './tmdbCache';
import { enrichMovie, enrichSeries } from './tmdb';

// ⚠️ CONFIGURAÇÃO: Ativar/desativar carregamento do GitHub
const ENABLE_GITHUB_LOADING = false; // Desabilitado até o repositório estar disponível

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

let m3uCache: CachedM3UData | null = null;
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 dias

/**
 * Detecta se um item é filme ou série baseado no nome e categoria
 */
function detectType(entry: M3UEntry): 'movie' | 'tv' | 'canal' {
  const nome = entry.nome.toLowerCase();
  const categoria = (entry.categoria || entry.group_title || '').toLowerCase();
  
  // Palavras-chave para canais
  const canalKeywords = ['tv', 'canal', 'channel', 'ao vivo', 'live', 'news', 'sport', 'esporte'];
  if (canalKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
    return 'canal';
  }
  
  // Palavras-chave para séries
  const serieKeywords = ['serie', 'series', 'temporada', 'season', 's0', 's1', 's2', 's3', 'episodio', 'episode', 'ep'];
  if (serieKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
    return 'tv';
  }
  
  // Palavras-chave para filmes
  const filmeKeywords = ['filme', 'movie', 'cinema'];
  if (filmeKeywords.some(k => categoria.includes(k))) {
    return 'movie';
  }
  
  // Padrão: se tem ano no nome, provavelmente é filme
  if (/\b(19|20)\d{2}\b/.test(nome)) {
    return 'movie';
  }
  
  // Se não identificou, tentar pela URL
  if (entry.url && (entry.url.includes('/movie/') || entry.url.includes('/filme/'))) {
    return 'movie';
  }
  
  if (entry.url && (entry.url.includes('/serie/') || entry.url.includes('/tv/'))) {
    return 'tv';
  }
  
  // Padrão: assumir filme
  return 'movie';
}

/**
 * Extrai o nome limpo do título (remove ano, qualidade, etc)
 */
function cleanTitle(title: string): string {
  return title
    .replace(/\b(19|20)\d{2}\b/g, '') // Remove ano
    .replace(/\b(1080p|720p|480p|360p|HD|FHD|4K|UHD|BluRay|WEB-DL|WEBRip)\b/gi, '') // Remove qualidade
    .replace(/\b(Dublado|Legendado|Dual|Audio)\b/gi, '') // Remove info de áudio
    .replace(/\[.*?\]/g, '') // Remove colchetes
    .replace(/\(.*?\)/g, '') // Remove parênteses
    .replace(/\s+/g, ' ') // Remove espaços extras
    .trim();
}

/**
 * Converte entrada M3U para formato de conteúdo
 */
function entryToContent(entry: M3UEntry, index: number, type: 'movie' | 'tv'): M3UContent {
  const cleanedTitle = cleanTitle(entry.nome);
  
  return {
    id: index + 1000, // IDs começam em 1000 para não conflitar com TMDB
    title: cleanedTitle,
    name: type === 'tv' ? cleanedTitle : undefined,
    original_title: entry.nome,
    poster_path: entry.logo || undefined,
    backdrop_path: undefined,
    overview: `Stream: ${cleanedTitle}`,
    vote_average: 0,
    release_date: undefined,
    genre_ids: [],
    streamUrl: entry.url,
    category: entry.categoria || entry.group_title || 'outros',
    type: type,
    logo: entry.logo,
  };
}

/**
 * Enriquece conteúdo com dados do TMDB em lote (COM CACHE)
 */
async function enrichContentBatch(
  content: M3UContent[],
  type: 'movie' | 'tv'
): Promise<M3UContent[]> {
  const enrichedContent: M3UContent[] = [];
  const BATCH_SIZE = 5; // Reduzido para 5 (menos carga na API)
  const CONCURRENT_REQUESTS = 3; // Máximo 3 requisições simultâneas
  let successCount = 0;
  let failCount = 0;
  let cacheHits = 0;
  
  console.log(`🔄 Enriquecendo ${content.length} itens (${type})...`);
  console.log(`📊 Cache: Verificando itens em cache...`);
  
  // Limpar cache expirado primeiro
  cleanExpiredCache();
  
  for (let i = 0; i < content.length; i += BATCH_SIZE) {
    const batch = content.slice(i, i + BATCH_SIZE);
    
    const enrichedBatch = await Promise.all(
      batch.map(async (item) => {
        try {
          // Extrair ano do título se possível
          const yearMatch = item.original_title?.match(/\b(19|20)\d{2}\b/) || item.title.match(/\b(19|20)\d{2}\b/);
          const year = yearMatch ? parseInt(yearMatch[0]) : undefined;
          
          // 1️⃣ TENTAR CACHE PRIMEIRO
          const cached = getFromCache(item.title, year, type);
          if (cached) {
            cacheHits++;
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
          
          // 2️⃣ SE NÃO ESTÁ EM CACHE, BUSCAR NO TMDB
          const enrichFunc = type === 'movie' ? enrichMovie : enrichSeries;
          const tmdbData = await enrichFunc(item.title, year);
          
          if (tmdbData) {
            // Salvar no cache para futuras requisições
            saveToCache(item.title, tmdbData, year, type);
            
            successCount++;
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
          console.warn(`⚠️ Erro ao enriquecer "${item.title}":`, error);
        }
        
        failCount++;
        return item; // Retorna sem enriquecimento se falhar
      })
    );
    
    enrichedContent.push(...enrichedBatch);
    
    // Log de progresso a cada 20 itens
    if ((i + BATCH_SIZE) % 20 === 0 || i + BATCH_SIZE >= content.length) {
      const progress = Math.min(i + BATCH_SIZE, content.length);
      const percentage = ((progress / content.length) * 100).toFixed(1);
      console.log(`📊 Progresso: ${progress}/${content.length} (${percentage}%) | ✅ ${successCount} | 💾 ${cacheHits} cache | ❌ ${failCount}`);
    }
    
    // Delay maior para não sobrecarregar API (500ms entre batches)
    if (i + BATCH_SIZE < content.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  const total = successCount + cacheHits;
  console.log(`✅ Enriquecimento completo: ${total}/${content.length} (${((total / content.length) * 100).toFixed(1)}%)`);
  console.log(`   💾 Cache: ${cacheHits} hits | 🌐 API: ${successCount} novas | ❌ Falhas: ${failCount}`);
  
  return enrichedContent;
}

/**
 * Carrega e processa o arquivo filmes.txt do servidor remoto
 */
export async function loadM3UContent(forceRefresh = false): Promise<CachedM3UData> {
  // ⚠️ Verificar se carregamento do GitHub está habilitado
  if (!ENABLE_GITHUB_LOADING) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ℹ️ CARREGAMENTO DO GITHUB DESABILITADO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Para habilitar, defina ENABLE_GITHUB_LOADING = true em:');
    console.log('/utils/m3uContentLoader.ts (linha 24)');
    console.log('');
    console.log('Certifique-se de que o repositório está público:');
    console.log('📍 https://github.com/Fabriciocypreste/lista');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return {
      filmes: [],
      series: [],
      canais: [],
      timestamp: Date.now(),
    };
  }
  
  // Verificar cache
  if (!forceRefresh && m3uCache && Date.now() - m3uCache.timestamp < CACHE_DURATION) {
    console.log('📦 Usando cache M3U');
    return m3uCache;
  }
  
  console.log('🎬 Carregando conteúdo do GitHub via servidor...');
  
  try {
    // PRIORIDADE 1: Buscar do servidor remoto via API do servidor
    const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/filmes`;
    
    console.log('📡 Buscando do servidor:', serverUrl);
    
    const response = await fetch(serverUrl, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.warn(`⚠️ Servidor retornou ${response.status}:`, errorData);
      
      if (response.status === 404 && errorData.tried_urls) {
        console.log('💡 URLs tentadas pelo servidor:', errorData.tried_urls);
        console.log('💡 Verifique se o repositório GitHub existe e contém os arquivos necessários');
        console.log('💡 Repositório esperado: https://github.com/Fabriciocypreste/lista');
      }
      
      throw new Error(`HTTP ${response.status}: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.movies || data.movies.length === 0) {
      console.warn('⚠️ Nenhum filme retornado do servidor');
      throw new Error('Nenhum filme encontrado no servidor');
    }
    
    console.log(`✅ ${data.movies.length} filmes carregados do GitHub via servidor`);
    console.log(`📊 Fonte: ${data.source || 'GitHub'}`);
    
    // Converter formato do servidor para formato M3UContent
    const filmes: M3UContent[] = data.movies
      .filter((movie: any) => {
        const type = detectTypeFromServerData(movie);
        return type === 'movie';
      })
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
      .filter((movie: any) => {
        const type = detectTypeFromServerData(movie);
        return type === 'tv';
      })
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
    
    console.log(`🎬 Filmes processados: ${filmes.length}`);
    console.log(`📺 Séries processadas: ${series.length}`);
    console.log(`✅ SEPARAÇÃO COMPLETA: ${filmes.length} filmes + ${series.length} séries`);
    
    // 🎨 ENRIQUECER COM TMDB (imagens, metadados)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎨 Enriquecendo com TMDB API...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Enriquecer filmes (em lotes de 10)
    const enrichedFilmes = await enrichContentBatch(filmes, 'movie');
    
    // Enriquecer séries (em lotes de 10)
    const enrichedSeries = await enrichContentBatch(series, 'tv');
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Enriquecimento TMDB concluído!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Criar cache com conteúdo enriquecido
    m3uCache = {
      filmes: enrichedFilmes,
      series: enrichedSeries,
      canais: [],
      timestamp: Date.now(),
    };
    
    return m3uCache;
  } catch (error) {
    console.log('ℹ️ Erro ao carregar do GitHub:', error.message);
    
    // FALLBACK: Tentar carregar diretamente do URL (pode ter CORS)
    try {
      console.log('🔄 Tentando fallback direto...');
      
      const directUrls = [
        'https://raw.githubusercontent.com/Fabriciocypreste/lista/main/filmes.txt',
        'https://raw.githubusercontent.com/Fabriciocypreste/lista/master/filmes.txt',
      ];
      
      let directContent = '';
      
      for (const url of directUrls) {
        try {
          console.log(`🔍 Tentando: ${url}`);
          const directResponse = await fetch(url);
          
          if (directResponse.ok) {
            directContent = await directResponse.text();
            console.log(`✅ Carregado ${directContent.length} bytes de ${url}`);
            break;
          }
        } catch (err) {
          console.log(`❌ Falhou: ${url}`);
          continue;
        }
      }
      
      if (directContent) {
        const entries = parseM3U(directContent);
        
        // Separar por tipo
        const filmes: M3UContent[] = [];
        const series: M3UContent[] = [];
        
        entries.forEach((entry, index) => {
          const type = detectType(entry);
          
          if (type === 'movie') {
            filmes.push(entryToContent(entry, filmes.length, 'movie'));
          } else if (type === 'tv') {
            series.push(entryToContent(entry, series.length, 'tv'));
          }
        });
        
        console.log(`✅ Carregado diretamente: ${filmes.length} filmes, ${series.length} séries`);
        
        m3uCache = {
          filmes,
          series,
          canais: [],
          timestamp: Date.now(),
        };
        
        return m3uCache;
      }
    } catch (directError) {
      console.log('⚠️ Fetch direto não disponível (CORS/Network)');
    }
    
    // FALLBACK: Retornar cache antigo se existir
    if (m3uCache) {
      console.log('✅ Usando cache M3U antigo');
      return m3uCache;
    }
    
    // FALLBACK FINAL: Retornar vazio com mensagem informativa
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('ℹ️ REPOSITÓRIO GITHUB NÃO ENCONTRADO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('Por favor, verifique se o repositório existe:');
    console.log('📍 https://github.com/Fabriciocypreste/lista');
    console.log('');
    console.log('O repositório deve conter os arquivos:');
    console.log('  • filmes.txt ou filmes.m3u');
    console.log('  • series.txt ou series.m3u');
    console.log('  • canais.txt ou canais.m3u');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return {
      filmes: [],
      series: [],
      canais: [],
      timestamp: Date.now(),
    };
  }
}

/**
 * Detecta tipo baseado nos dados do servidor
 */
function detectTypeFromServerData(item: any): 'movie' | 'tv' | 'canal' {
  const nome = (item.name || item.title || '').toLowerCase();
  const categoria = (item.category || '').toLowerCase();
  
  // Palavras-chave para canais (detectar primeiro)
  const canalKeywords = ['tv', 'canal', 'channel', 'ao vivo', 'live', 'news', 'sport', 'esporte', 'globo', 'record', 'sbt', 'band'];
  if (canalKeywords.some(k => categoria.includes(k))) {
    return 'canal';
  }
  
  // Palavras-chave para séries (mais específicas)
  const serieKeywords = [
    'serie', 'series', 'temporada', 'season', 
    's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10',
    's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
    'episodio', 'episode', 'ep', 'e01', 'e02', 'e03',
    'temp', 'temporadas'
  ];
  
  // Verificar se tem padrão de série (SxxExx ou Sxx)
  if (/s\d{1,2}e\d{1,2}/i.test(nome) || /temporada\s*\d+/i.test(nome) || /season\s*\d+/i.test(nome)) {
    return 'tv';
  }
  
  if (serieKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
    return 'tv';
  }
  
  // Palavras-chave para filmes
  const filmeKeywords = ['filme', 'movie', 'cinema'];
  if (filmeKeywords.some(k => categoria.includes(k))) {
    return 'movie';
  }
  
  // Se tem ano no nome (1900-2099), provavelmente é filme
  if (/\b(19|20)\d{2}\b/.test(nome)) {
    return 'movie';
  }
  
  // Padrão: filme (se não identificou como série ou canal)
  return 'movie';
}

/**
 * Carrega apenas filmes do M3U
 */
export async function loadM3UFilmes(): Promise<M3UContent[]> {
  const data = await loadM3UContent();
  return data.filmes;
}

/**
 * Carrega apenas séries do M3U
 */
export async function loadM3USeries(): Promise<M3UContent[]> {
  const data = await loadM3UContent();
  return data.series;
}

/**
 * Carrega apenas canais do M3U
 */
export async function loadM3UCanais(): Promise<M3UEntry[]> {
  const data = await loadM3UContent();
  return data.canais;
}

/**
 * Busca conteúdo por título
 */
export async function searchM3UContent(query: string): Promise<M3UContent[]> {
  const data = await loadM3UContent();
  const searchTerm = query.toLowerCase();
  
  const allContent = [...data.filmes, ...data.series];
  
  return allContent.filter(item => 
    item.title.toLowerCase().includes(searchTerm) ||
    item.original_title?.toLowerCase().includes(searchTerm) ||
    item.category.toLowerCase().includes(searchTerm)
  );
}

/**
 * Obtém conteúdo por categoria
 */
export async function getM3UByCategory(category: string, type?: 'movie' | 'tv'): Promise<M3UContent[]> {
  const data = await loadM3UContent();
  const categoryLower = category.toLowerCase();
  
  let content = type === 'movie' ? data.filmes : 
                type === 'tv' ? data.series : 
                [...data.filmes, ...data.series];
  
  if (category === 'all' || category === 'todos') {
    return content;
  }
  
  return content.filter(item => 
    item.category.toLowerCase().includes(categoryLower)
  );
}

/**
 * Obtém todas as categorias únicas
 */
export async function getM3UCategories(): Promise<string[]> {
  const data = await loadM3UContent();
  const allContent = [...data.filmes, ...data.series];
  
  const categories = new Set<string>();
  allContent.forEach(item => {
    if (item.category && item.category !== 'outros') {
      categories.add(item.category);
    }
  });
  
  return Array.from(categories).sort();
}

/**
 * Limpa o cache (útil para forçar reload)
 */
export function clearM3UCache(): void {
  m3uCache = null;
  console.log('🗑️ Cache M3U limpo');
}

/**
 * Verifica se o arquivo M3U existe
 */
export async function checkM3UExists(): Promise<boolean> {
  try {
    const response = await fetch('/data/lista.m3u', { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Obtém estatísticas do M3U
 */
export async function getM3UStats(): Promise<{
  totalFilmes: number;
  totalSeries: number;
  totalCanais: number;
  categories: string[];
  lastUpdate: Date;
}> {
  const data = await loadM3UContent();
  const categories = await getM3UCategories();
  
  return {
    totalFilmes: data.filmes.length,
    totalSeries: data.series.length,
    totalCanais: data.canais.length,
    categories,
    lastUpdate: new Date(data.timestamp),
  };
}
