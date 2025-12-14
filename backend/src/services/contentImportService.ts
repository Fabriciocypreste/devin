/**
 * Content Import Service - Importa conteudo de M3U para o banco de dados
 * 
 * Regras:
 * - Filmes -> apenas filmes
 * - Series -> apenas series
 * - Home -> todo conteudo
 * - Compara nova lista com banco
 * - Insere somente o que nao existir
 * - Nunca duplica conteudo
 */

import prisma from './database';

interface M3UEntry {
  nome: string;
  url: string;
  logo?: string;
  categoria?: string;
  group_title?: string;
}

interface ImportResult {
  total: number;
  inserted: number;
  skipped: number;
  errors: number;
  details: string[];
}

/**
 * Detecta se um item e filme ou serie baseado no nome e categoria
 */
function detectContentType(entry: M3UEntry): 'movie' | 'series' | 'channel' {
  const nome = entry.nome.toLowerCase();
  const categoria = (entry.categoria || entry.group_title || '').toLowerCase();
  
  // Palavras-chave para canais
  const canalKeywords = ['tv', 'canal', 'channel', 'ao vivo', 'live', 'news', 'sport', 'esporte'];
  if (canalKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
    return 'channel';
  }
  
  // Palavras-chave para series
  const serieKeywords = ['serie', 'series', 'temporada', 'season', 's0', 's1', 's2', 's3', 'episodio', 'episode', 'ep'];
  if (serieKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
    return 'series';
  }
  
  // Palavras-chave para filmes
  const filmeKeywords = ['filme', 'movie', 'cinema'];
  if (filmeKeywords.some(k => categoria.includes(k))) {
    return 'movie';
  }
  
  // Padrao: se tem ano no nome, provavelmente e filme
  if (/\b(19|20)\d{2}\b/.test(nome)) {
    return 'movie';
  }
  
  // Se nao identificou, tentar pela URL
  if (entry.url && (entry.url.includes('/movie/') || entry.url.includes('/filme/'))) {
    return 'movie';
  }
  
  if (entry.url && (entry.url.includes('/serie/') || entry.url.includes('/tv/'))) {
    return 'series';
  }
  
  // Padrao: assumir filme
  return 'movie';
}

/**
 * Extrai o nome limpo do titulo (remove ano, qualidade, etc)
 */
function cleanTitle(title: string): string {
  return title
    .replace(/\b(19|20)\d{2}\b/g, '') // Remove ano
    .replace(/\b(1080p|720p|480p|360p|HD|FHD|4K|UHD|BluRay|WEB-DL|WEBRip)\b/gi, '') // Remove qualidade
    .replace(/\b(Dublado|Legendado|Dual|Audio)\b/gi, '') // Remove info de audio
    .replace(/\[.*?\]/g, '') // Remove colchetes
    .replace(/\(.*?\)/g, '') // Remove parenteses
    .replace(/\s+/g, ' ') // Remove espacos extras
    .trim();
}

/**
 * Extrai ano do titulo
 */
function extractYear(title: string): string | null {
  const match = title.match(/\b(19|20)\d{2}\b/);
  return match ? match[0] : null;
}

/**
 * Parse M3U content
 */
function parseM3U(content: string): M3UEntry[] {
  const entries: M3UEntry[] = [];
  const lines = content.split('\n');
  
  let currentEntry: Partial<M3UEntry> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith('#EXTINF:')) {
      // Parse EXTINF line
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
      const tvgLogoMatch = line.match(/tvg-logo="([^"]*)"/);
      const groupTitleMatch = line.match(/group-title="([^"]*)"/);
      const nameMatch = line.match(/,(.+)$/);
      
      currentEntry = {
        nome: tvgNameMatch ? tvgNameMatch[1] : (nameMatch ? nameMatch[1].trim() : ''),
        logo: tvgLogoMatch ? tvgLogoMatch[1] : undefined,
        group_title: groupTitleMatch ? groupTitleMatch[1] : undefined,
        categoria: groupTitleMatch ? groupTitleMatch[1] : undefined,
      };
    } else if (line && !line.startsWith('#') && currentEntry.nome) {
      // URL line
      currentEntry.url = line;
      if (currentEntry.nome && currentEntry.url) {
        entries.push(currentEntry as M3UEntry);
      }
      currentEntry = {};
    }
  }
  
  return entries;
}

/**
 * Importa conteudo de M3U para o banco de dados
 */
export async function importM3UContent(
  m3uContent: string,
  options: {
    contentType?: 'movie' | 'series' | 'all';
    clearExisting?: boolean;
  } = {}
): Promise<ImportResult> {
  const { contentType = 'all', clearExisting = false } = options;
  
  const result: ImportResult = {
    total: 0,
    inserted: 0,
    skipped: 0,
    errors: 0,
    details: [],
  };
  
  try {
    // Parse M3U
    const entries = parseM3U(m3uContent);
    result.total = entries.length;
    
    console.log(`📥 Importando ${entries.length} itens do M3U...`);
    
    // Limpar conteudo existente se solicitado
    if (clearExisting) {
      await prisma.content.deleteMany({});
      result.details.push('Conteudo existente removido');
    }
    
    // Buscar titulos existentes para evitar duplicatas
    const existingContent = await prisma.content.findMany({
      select: { title: true, streamUrl: true },
    });
    const existingTitles = new Set(existingContent.map(c => c.title.toLowerCase()));
    const existingUrls = new Set(existingContent.map(c => c.streamUrl).filter(Boolean));
    
    // Processar cada entrada
    for (const entry of entries) {
      try {
        const type = detectContentType(entry);
        
        // Filtrar por tipo se especificado
        if (contentType !== 'all') {
          if (contentType === 'movie' && type !== 'movie') continue;
          if (contentType === 'series' && type !== 'series') continue;
        }
        
        // Ignorar canais
        if (type === 'channel') {
          result.skipped++;
          continue;
        }
        
        const cleanedTitle = cleanTitle(entry.nome);
        const year = extractYear(entry.nome);
        
        // Verificar duplicata por titulo ou URL
        if (existingTitles.has(cleanedTitle.toLowerCase()) || 
            (entry.url && existingUrls.has(entry.url))) {
          result.skipped++;
          continue;
        }
        
        // Inserir no banco
        await prisma.content.create({
          data: {
            title: cleanedTitle,
            originalTitle: entry.nome,
            type: type,
            posterPath: entry.logo || null,
            backdropPath: entry.logo || null,
            streamUrl: entry.url,
            releaseDate: year ? `${year}-01-01` : null,
            genres: entry.categoria || entry.group_title || null,
            active: true,
            featured: false,
          },
        });
        
        result.inserted++;
        existingTitles.add(cleanedTitle.toLowerCase());
        if (entry.url) existingUrls.add(entry.url);
        
      } catch (error: any) {
        result.errors++;
        result.details.push(`Erro ao importar "${entry.nome}": ${error.message}`);
      }
    }
    
    result.details.push(`Importacao concluida: ${result.inserted} inseridos, ${result.skipped} ignorados, ${result.errors} erros`);
    console.log(`✅ Importacao: ${result.inserted} inseridos, ${result.skipped} ignorados, ${result.errors} erros`);
    
    return result;
  } catch (error: any) {
    console.error('❌ Erro na importacao:', error);
    result.errors++;
    result.details.push(`Erro geral: ${error.message}`);
    return result;
  }
}

/**
 * Importa conteudo de URL M3U
 */
export async function importM3UFromUrl(
  url: string,
  options: {
    contentType?: 'movie' | 'series' | 'all';
    clearExisting?: boolean;
  } = {}
): Promise<ImportResult> {
  try {
    console.log(`📡 Buscando M3U de: ${url}`);
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const content = await response.text();
    return await importM3UContent(content, options);
  } catch (error: any) {
    console.error('❌ Erro ao buscar M3U:', error);
    return {
      total: 0,
      inserted: 0,
      skipped: 0,
      errors: 1,
      details: [`Erro ao buscar URL: ${error.message}`],
    };
  }
}

/**
 * Sincroniza conteudo com TMDB (enriquece metadados)
 */
export async function enrichContentWithTMDB(
  tmdbApiKey: string,
  limit: number = 100
): Promise<{ enriched: number; errors: number }> {
  const result = { enriched: 0, errors: 0 };
  
  try {
    // Buscar conteudo sem tmdbId
    const contentToEnrich = await prisma.content.findMany({
      where: { tmdbId: null },
      take: limit,
    });
    
    console.log(`🎨 Enriquecendo ${contentToEnrich.length} itens com TMDB...`);
    
    for (const content of contentToEnrich) {
      try {
        const searchType = content.type === 'series' ? 'tv' : 'movie';
        const searchUrl = `https://api.themoviedb.org/3/search/${searchType}?api_key=${tmdbApiKey}&query=${encodeURIComponent(content.title)}&language=pt-BR`;
        
                const response = await fetch(searchUrl);
                if (!response.ok) continue;
        
                interface TMDBSearchResult {
                  results: Array<{
                    id: number;
                    overview?: string;
                    poster_path?: string;
                    backdrop_path?: string;
                    vote_average?: number;
                    vote_count?: number;
                    release_date?: string;
                    first_air_date?: string;
                  }>;
                }
        
                const data = (await response.json()) as TMDBSearchResult;
                if (!data.results || data.results.length === 0) continue;
        
                const tmdbResult = data.results[0];
        
        await prisma.content.update({
          where: { id: content.id },
          data: {
            tmdbId: tmdbResult.id,
            overview: tmdbResult.overview || content.overview,
            posterPath: tmdbResult.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbResult.poster_path}` : content.posterPath,
            backdropPath: tmdbResult.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbResult.backdrop_path}` : content.backdropPath,
            voteAverage: tmdbResult.vote_average || 0,
            voteCount: tmdbResult.vote_count || 0,
            releaseDate: tmdbResult.release_date || tmdbResult.first_air_date || content.releaseDate,
          },
        });
        
        result.enriched++;
        
        // Delay para nao sobrecarregar API
        await new Promise(resolve => setTimeout(resolve, 250));
        
      } catch (error) {
        result.errors++;
      }
    }
    
    console.log(`✅ Enriquecimento: ${result.enriched} atualizados, ${result.errors} erros`);
    return result;
  } catch (error) {
    console.error('❌ Erro no enriquecimento:', error);
    return result;
  }
}

export default {
  importM3UContent,
  importM3UFromUrl,
  enrichContentWithTMDB,
};
