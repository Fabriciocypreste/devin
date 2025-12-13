/**
 * M3U Parser - Converte arquivos M3U para JSON estruturado
 * Usado para importar listas de canais, filmes e séries
 */

export interface M3UEntry {
  nome: string;
  logo: string;
  url: string;
  categoria: string;
  tvg_id?: string;
  tvg_name?: string;
  group_title?: string;
}

export interface ParsedM3U {
  type: 'filmes' | 'series' | 'canais';
  entries: M3UEntry[];
}

/**
 * Faz parse de conteúdo M3U e converte para JSON
 */
export function parseM3U(content: string): M3UEntry[] {
  const lines = content.split('\n').map(line => line.trim());
  const entries: M3UEntry[] = [];
  
  let currentEntry: Partial<M3UEntry> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Ignora linhas vazias e cabeçalho
    if (!line || line === '#EXTM3U') {
      continue;
    }
    
    // Linha de informação do canal/conteúdo
    if (line.startsWith('#EXTINF:')) {
      // Extrair informações da linha EXTINF
      // Formato: #EXTINF:-1 tvg-id="id" tvg-name="nome" tvg-logo="url" group-title="grupo",Nome do Canal
      
      // Extrair tvg-id
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      if (tvgIdMatch) {
        currentEntry.tvg_id = tvgIdMatch[1];
      }
      
      // Extrair tvg-name
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
      if (tvgNameMatch) {
        currentEntry.tvg_name = tvgNameMatch[1];
      }
      
      // Extrair tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      if (logoMatch) {
        currentEntry.logo = logoMatch[1];
      }
      
      // Extrair group-title (categoria)
      const groupMatch = line.match(/group-title="([^"]*)"/);
      if (groupMatch) {
        currentEntry.group_title = groupMatch[1];
        currentEntry.categoria = groupMatch[1].toLowerCase();
      }
      
      // Extrair nome (após a última vírgula)
      const commaIndex = line.lastIndexOf(',');
      if (commaIndex !== -1) {
        currentEntry.nome = line.substring(commaIndex + 1).trim();
      }
    }
    // Linha com URL
    else if (line.startsWith('http')) {
      currentEntry.url = line;
      
      // Se temos nome e URL, adicionar entrada
      if (currentEntry.nome && currentEntry.url) {
        entries.push({
          nome: currentEntry.nome,
          logo: currentEntry.logo || '',
          url: currentEntry.url,
          categoria: currentEntry.categoria || 'outros',
          tvg_id: currentEntry.tvg_id,
          tvg_name: currentEntry.tvg_name,
          group_title: currentEntry.group_title,
        });
      }
      
      // Resetar para próxima entrada
      currentEntry = {};
    }
  }
  
  return entries;
}

/**
 * Detecta o tipo de conteúdo baseado no nome do arquivo ou categorias
 */
export function detectContentType(filename: string, entries: M3UEntry[]): 'filmes' | 'series' | 'canais' {
  const lowerFilename = filename.toLowerCase();
  
  // Detectar pelo nome do arquivo
  if (lowerFilename.includes('filme')) return 'filmes';
  if (lowerFilename.includes('serie') || lowerFilename.includes('series')) return 'series';
  if (lowerFilename.includes('canal') || lowerFilename.includes('canais') || lowerFilename.includes('tv')) return 'canais';
  
  // Detectar pelas categorias/grupos mais comuns
  const categories = entries.map(e => e.categoria?.toLowerCase() || '');
  const canalKeywords = ['tv', 'canal', 'channel', 'aberto', 'fechado'];
  const filmeKeywords = ['filme', 'movie', 'cinema'];
  const serieKeywords = ['serie', 'series', 'temporada', 'season'];
  
  const canalCount = categories.filter(c => canalKeywords.some(k => c.includes(k))).length;
  const filmeCount = categories.filter(c => filmeKeywords.some(k => c.includes(k))).length;
  const serieCount = categories.filter(c => serieKeywords.some(k => c.includes(k))).length;
  
  if (canalCount > filmeCount && canalCount > serieCount) return 'canais';
  if (filmeCount > serieCount) return 'filmes';
  if (serieCount > 0) return 'series';
  
  // Padrão: assumir canais
  return 'canais';
}

/**
 * Parse completo do M3U com detecção automática de tipo
 */
export function parseM3UComplete(content: string, filename: string): ParsedM3U {
  const entries = parseM3U(content);
  const type = detectContentType(filename, entries);
  
  return {
    type,
    entries,
  };
}

/**
 * Valida se o conteúdo é um arquivo M3U válido
 */
export function isValidM3U(content: string): boolean {
  return content.includes('#EXTM3U') || content.includes('#EXTINF:');
}
