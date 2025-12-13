/**
 * Utilitário para buscar URLs de streaming de filmes e séries
 * dos arquivos JSON locais
 */

export interface ContentUrl {
  nome: string;
  url: string;
  logo?: string;
  categoria?: string;
}

// Cache para evitar múltiplas requisições
let filmesCache: ContentUrl[] | null = null;
let seriesCache: ContentUrl[] | null = null;

/**
 * Carrega os filmes do M3U
 */
async function loadFilmes(): Promise<ContentUrl[]> {
  if (filmesCache) return filmesCache;
  
  try {
    const { loadM3UFilmes } = await import('./m3uContentLoader');
    const m3uFilmes = await loadM3UFilmes();
    filmesCache = m3uFilmes.map(m => ({
      nome: m.title,
      url: m.streamUrl,
      logo: m.poster_path || m.logo,
      categoria: m.category
    }));
    return filmesCache || [];
  } catch (error) {
    console.error('Erro ao carregar filmes do M3U:', error);
    return [];
  }
}

/**
 * Carrega as séries do M3U
 */
async function loadSeries(): Promise<ContentUrl[]> {
  if (seriesCache) return seriesCache;
  
  try {
    const { loadM3USeries } = await import('./m3uContentLoader');
    const m3uSeries = await loadM3USeries();
    seriesCache = m3uSeries.map(m => ({
      nome: m.title,
      url: m.streamUrl,
      logo: m.poster_path || m.logo,
      categoria: m.category
    }));
    return seriesCache || [];
  } catch (error) {
    console.error('Erro ao carregar séries do M3U:', error);
    return [];
  }
}

/**
 * Normaliza uma string para comparação (remove acentos, caracteres especiais, etc)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s]/g, '') // Remove caracteres especiais
    .trim();
}

/**
 * Calcula similaridade entre duas strings (Levenshtein distance simplificado)
 */
function similarity(s1: string, s2: string): number {
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(s1: string, s2: string): number {
  const costs: number[] = [];
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

/**
 * Busca URL de um filme pelo título
 */
export async function getMovieUrl(title: string): Promise<string | null> {
  const filmes = await loadFilmes();
  const normalizedTitle = normalizeString(title);
  
  console.log(`🔍 Buscando URL para filme: "${title}"`);
  
  // Primeira tentativa: match exato
  let found = filmes.find(f => normalizeString(f.nome) === normalizedTitle);
  
  // Segunda tentativa: contains
  if (!found) {
    found = filmes.find(f => 
      normalizeString(f.nome).includes(normalizedTitle) ||
      normalizedTitle.includes(normalizeString(f.nome))
    );
  }
  
  // Terceira tentativa: similaridade > 70%
  if (!found) {
    let bestMatch: ContentUrl | null = null;
    let bestScore = 0;
    
    for (const filme of filmes) {
      const score = similarity(normalizedTitle, normalizeString(filme.nome));
      if (score > bestScore && score > 0.7) {
        bestScore = score;
        bestMatch = filme;
      }
    }
    
    if (bestMatch) {
      console.log(`✨ Match por similaridade (${(bestScore * 100).toFixed(0)}%): "${bestMatch.nome}"`);
      found = bestMatch;
    }
  }
  
  if (found) {
    console.log(`✅ URL encontrada: ${found.url}`);
    return found.url;
  }
  
  // Silenciar warning - é esperado não encontrar URLs para todos os filmes
  // console.debug(`ℹ️ URL não disponível para: "${title}"`);
  return null;
}

/**
 * Busca URL de uma série pelo título
 */
export async function getSeriesUrl(title: string): Promise<string | null> {
  const series = await loadSeries();
  const normalizedTitle = normalizeString(title);
  
  console.log(`🔍 Buscando URL para série: "${title}"`);
  
  // Primeira tentativa: match exato
  let found = series.find(s => normalizeString(s.nome) === normalizedTitle);
  
  // Segunda tentativa: contains
  if (!found) {
    found = series.find(s => 
      normalizeString(s.nome).includes(normalizedTitle) ||
      normalizedTitle.includes(normalizeString(s.nome))
    );
  }
  
  // Terceira tentativa: similaridade > 70%
  if (!found) {
    let bestMatch: ContentUrl | null = null;
    let bestScore = 0;
    
    for (const serie of series) {
      const score = similarity(normalizedTitle, normalizeString(serie.nome));
      if (score > bestScore && score > 0.7) {
        bestScore = score;
        bestMatch = serie;
      }
    }
    
    if (bestMatch) {
      console.log(`✨ Match por similaridade (${(bestScore * 100).toFixed(0)}%): "${bestMatch.nome}"`);
      found = bestMatch;
    }
  }
  
  if (found) {
    console.log(`✅ URL encontrada: ${found.url}`);
    return found.url;
  }
  
  // Silenciar warning - é esperado não encontrar URLs para todas as séries
  // console.debug(`ℹ️ URL não disponível para: "${title}"`);
  return null;
}

/**
 * Busca URL de conteúdo (filme ou série) automaticamente
 */
export async function getContentUrl(
  title: string,
  type: 'movie' | 'tv' = 'movie'
): Promise<string | null> {
  if (type === 'tv') {
    return await getSeriesUrl(title);
  } else {
    return await getMovieUrl(title);
  }
}

/**
 * Verifica se uma URL é válida para streaming
 */
export function isValidStreamUrl(url: string): boolean {
  if (!url) return false;
  
  // URLs example.com são placeholders
  if (url.includes('example.com')) {
    return false;
  }
  
  // Verifica se tem protocolo
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Verifica se uma URL de filme/série é válida (formato MP4)
 */
export function isValidMovieUrl(url: string): boolean {
  if (!isValidStreamUrl(url)) return false;
  
  // Filmes e séries devem ser MP4
  return url.toLowerCase().endsWith('.mp4');
}

/**
 * Verifica se uma URL de canal ao vivo é válida (formato M3U8)
 */
export function isValidChannelUrl(url: string): boolean {
  if (!isValidStreamUrl(url)) return false;
  
  // Canais ao vivo devem ser M3U8
  return url.toLowerCase().endsWith('.m3u8');
}

/**
 * Busca todos os filmes disponíveis
 */
export async function getAllMovies(): Promise<ContentUrl[]> {
  return await loadFilmes();
}

/**
 * Busca todas as séries disponíveis
 */
export async function getAllSeries(): Promise<ContentUrl[]> {
  return await loadSeries();
}