/**
 * REDFLIX - M3U Playlist Parser
 * 
 * Parse M3U/M3U8 playlists para extrair filmes, séries e canais IPTV
 */

export interface M3UItem {
  id: string;
  name: string;
  logo: string;
  category: string;
  url: string;
  type: 'movie' | 'tv' | 'channel';
  tvgId?: string;
  tvgName?: string;
  groupTitle?: string;
  duration?: string;
}

export interface ParsedM3U {
  movies: M3UItem[];
  series: M3UItem[];
  channels: M3UItem[];
  total: number;
}

/**
 * Parse M3U playlist text
 */
export function parseM3U(content: string): ParsedM3U {
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);
  
  const movies: M3UItem[] = [];
  const series: M3UItem[] = [];
  const channels: M3UItem[] = [];
  
  let currentItem: Partial<M3UItem> | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Parse #EXTINF line
    if (line.startsWith('#EXTINF:')) {
      const info = parseExtInf(line);
      currentItem = {
        id: generateId(),
        name: info.name,
        logo: info.logo,
        category: info.category,
        tvgId: info.tvgId,
        tvgName: info.tvgName,
        groupTitle: info.groupTitle,
        duration: info.duration,
        url: '',
        type: determineType(info.category, info.name)
      };
    }
    // Parse URL line
    else if (line.startsWith('http://') || line.startsWith('https://')) {
      if (currentItem) {
        currentItem.url = line;
        
        // Adicionar ao array apropriado
        const item = currentItem as M3UItem;
        
        if (item.type === 'movie') {
          movies.push(item);
        } else if (item.type === 'tv') {
          series.push(item);
        } else {
          channels.push(item);
        }
        
        currentItem = null;
      }
    }
  }
  
  return {
    movies,
    series,
    channels,
    total: movies.length + series.length + channels.length
  };
}

/**
 * Parse #EXTINF line
 */
function parseExtInf(line: string): {
  name: string;
  logo: string;
  category: string;
  tvgId?: string;
  tvgName?: string;
  groupTitle?: string;
  duration?: string;
} {
  // Formato: #EXTINF:-1 tvg-id="..." tvg-name="..." tvg-logo="..." group-title="...",Nome
  
  const result = {
    name: '',
    logo: '',
    category: 'Geral',
    tvgId: '',
    tvgName: '',
    groupTitle: '',
    duration: '-1'
  };
  
  // Extrair duração
  const durationMatch = line.match(/#EXTINF:(-?\d+)/);
  if (durationMatch) {
    result.duration = durationMatch[1];
  }
  
  // Extrair tvg-id
  const tvgIdMatch = line.match(/tvg-id="([^"]*)"/i);
  if (tvgIdMatch) {
    result.tvgId = tvgIdMatch[1];
  }
  
  // Extrair tvg-name
  const tvgNameMatch = line.match(/tvg-name="([^"]*)"/i);
  if (tvgNameMatch) {
    result.tvgName = tvgNameMatch[1];
  }
  
  // Extrair tvg-logo
  const logoMatch = line.match(/tvg-logo="([^"]*)"/i);
  if (logoMatch) {
    result.logo = logoMatch[1];
  }
  
  // Extrair group-title (categoria)
  const groupMatch = line.match(/group-title="([^"]*)"/i);
  if (groupMatch) {
    result.groupTitle = groupMatch[1];
    result.category = groupMatch[1];
  }
  
  // Extrair nome (tudo depois da última vírgula)
  const nameMatch = line.match(/,(.+)$/);
  if (nameMatch) {
    result.name = nameMatch[1].trim();
  }
  
  // Se não tem logo, usar placeholder
  if (!result.logo) {
    result.logo = 'https://via.placeholder.com/244x137?text=' + encodeURIComponent(result.name);
  }
  
  return result;
}

/**
 * Determinar tipo baseado em categoria e nome
 */
function determineType(category: string, name: string): 'movie' | 'tv' | 'channel' {
  const lowerCategory = category.toLowerCase();
  const lowerName = name.toLowerCase();
  
  // Categorias de filmes
  const movieCategories = [
    'filmes', 'movies', 'filme', 'movie', 
    'cinema', 'vod movies', 'vod filme'
  ];
  
  // Categorias de séries
  const seriesCategories = [
    'series', 'séries', 'serie', 'série',
    'tv shows', 'shows', 'vod series', 'vod série'
  ];
  
  // Verificar categoria
  for (const cat of movieCategories) {
    if (lowerCategory.includes(cat)) {
      return 'movie';
    }
  }
  
  for (const cat of seriesCategories) {
    if (lowerCategory.includes(cat)) {
      return 'tv';
    }
  }
  
  // Verificar nome
  if (lowerName.includes('temporada') || 
      lowerName.includes('season') || 
      lowerName.includes('s0') ||
      lowerName.match(/s\d{2}e\d{2}/i)) {
    return 'tv';
  }
  
  // Verificar se parece filme (ano no nome)
  if (lowerName.match(/\(?\d{4}\)?/) || lowerName.match(/19\d{2}|20\d{2}/)) {
    return 'movie';
  }
  
  // Default: canal
  return 'channel';
}

/**
 * Gerar ID único
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Parse M3U file
 */
export async function parseM3UFile(file: File): Promise<ParsedM3U> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = parseM3U(content);
        resolve(parsed);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Parse M3U from URL
 */
export async function parseM3UFromURL(url: string): Promise<ParsedM3U> {
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const content = await response.text();
    return parseM3U(content);
  } catch (error) {
    throw new Error(`Erro ao carregar M3U: ${error}`);
  }
}

/**
 * Validar formato M3U
 */
export function isValidM3U(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.startsWith('#EXTM3U') || trimmed.includes('#EXTINF:');
}

/**
 * Estatísticas da playlist
 */
export function getM3UStats(parsed: ParsedM3U) {
  const categoriesMap = new Map<string, number>();
  
  [...parsed.movies, ...parsed.series, ...parsed.channels].forEach(item => {
    const count = categoriesMap.get(item.category) || 0;
    categoriesMap.set(item.category, count + 1);
  });
  
  const categories = Array.from(categoriesMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  return {
    total: parsed.total,
    movies: parsed.movies.length,
    series: parsed.series.length,
    channels: parsed.channels.length,
    categories,
    categoriesCount: categories.length
  };
}

/**
 * Filtrar itens
 */
export function filterM3UItems(
  items: M3UItem[], 
  filters: {
    search?: string;
    category?: string;
    type?: 'movie' | 'tv' | 'channel';
  }
): M3UItem[] {
  let filtered = [...items];
  
  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(item => 
      item.name.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search)
    );
  }
  
  if (filters.category) {
    filtered = filtered.filter(item => item.category === filters.category);
  }
  
  if (filters.type) {
    filtered = filtered.filter(item => item.type === filters.type);
  }
  
  return filtered;
}

/**
 * Agrupar por categoria
 */
export function groupByCategory(items: M3UItem[]): Map<string, M3UItem[]> {
  const grouped = new Map<string, M3UItem[]>();
  
  items.forEach(item => {
    const category = item.category || 'Sem Categoria';
    const existing = grouped.get(category) || [];
    grouped.set(category, [...existing, item]);
  });
  
  return grouped;
}

/**
 * Exportar para JSON
 */
export function exportToJSON(parsed: ParsedM3U): string {
  return JSON.stringify(parsed, null, 2);
}

/**
 * Converter para formato Supabase
 */
export function convertToSupabaseFormat(parsed: ParsedM3U) {
  return {
    movies: parsed.movies.map(item => ({
      tmdb_id: null,
      title: item.name,
      original_title: item.name,
      overview: '',
      poster_path: item.logo,
      backdrop_path: item.logo,
      media_type: 'movie' as const,
      genre_ids: [],
      release_date: '',
      vote_average: 0,
      vote_count: 0,
      popularity: 0,
      adult: false,
      original_language: 'pt',
      video_url: item.url,
      is_featured: false,
      duration_minutes: 0
    })),
    series: parsed.series.map(item => ({
      tmdb_id: null,
      title: item.name,
      original_title: item.name,
      overview: '',
      poster_path: item.logo,
      backdrop_path: item.logo,
      media_type: 'tv' as const,
      genre_ids: [],
      first_air_date: '',
      vote_average: 0,
      vote_count: 0,
      popularity: 0,
      adult: false,
      original_language: 'pt',
      video_url: item.url,
      is_featured: false
    })),
    channels: parsed.channels.map(item => ({
      name: item.name,
      logo_url: item.logo,
      category: item.category,
      stream_url: item.url,
      tvg_id: item.tvgId || '',
      tvg_name: item.tvgName || item.name,
      is_active: true,
      is_premium: false,
      sort_order: 0
    }))
  };
}
