/**
 * 🎯 IMPORTADOR DE CONTEÚDO DO GITHUB
 * 
 * Processa arquivos M3U/TXT do repositório:
 * https://github.com/Fabriciocypreste/lista.git
 * 
 * Formato esperado:
 * #EXTM3U
 * #EXTINF:-1 tvg-logo="..." group-title="...", Nome do Conteúdo
 * http://url-do-stream.m3u8
 */

export interface ImportedContent {
  id: string;
  title: string;
  url: string;
  logo?: string;
  group?: string;
  description?: string;
  metadata?: Record<string, string>;
}

/**
 * Parse conteúdo M3U e extrai informações estruturadas
 */
export function parseM3UContent(content: string, type: 'filmes' | 'series' | 'canais'): ImportedContent[] {
  const items: ImportedContent[] = [];
  const lines = content.split('\n').map(line => line.trim()).filter(line => line);

  let currentInfo: Partial<ImportedContent> = {};

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Parse #EXTINF line
    if (line.startsWith('#EXTINF:')) {
      // Extract attributes from EXTINF line
      const attributes = extractAttributes(line);
      const titleMatch = line.match(/,(.+)$/);
      
      currentInfo = {
        title: titleMatch ? titleMatch[1].trim() : 'Sem título',
        logo: attributes['tvg-logo'] || attributes['logo'],
        group: attributes['group-title'] || attributes['group'],
        metadata: attributes,
      };
    }
    // Parse URL line
    else if (line.startsWith('http://') || line.startsWith('https://')) {
      if (currentInfo.title) {
        items.push({
          id: generateId(currentInfo.title!, items.length),
          title: currentInfo.title!,
          url: line,
          logo: currentInfo.logo,
          group: currentInfo.group,
          description: currentInfo.metadata?.['description'] || '',
          metadata: currentInfo.metadata,
        });
        
        currentInfo = {};
      }
    }
    // Parse simple format (title and URL on consecutive lines)
    else if (!line.startsWith('#') && currentInfo.title) {
      // Might be a continuation of previous item
      continue;
    }
  }

  console.log(`✅ Parsed ${items.length} ${type} items`);
  return items;
}

/**
 * Extrai atributos de uma linha EXTINF
 */
function extractAttributes(line: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  
  // Match patterns like: tvg-logo="..." group-title="..."
  const attrRegex = /(\w+(?:-\w+)*)="([^"]*)"/g;
  let match;
  
  while ((match = attrRegex.exec(line)) !== null) {
    attributes[match[1]] = match[2];
  }
  
  return attributes;
}

/**
 * Gera ID único baseado no título
 */
function generateId(title: string, index: number): string {
  const slug = title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return `${slug}-${index}`;
}

/**
 * Salva conteúdo importado no KV store
 */
export async function saveImportedContent(
  type: 'filmes' | 'series' | 'canais',
  items: ImportedContent[]
): Promise<void> {
  try {
    const { projectId, publicAnonKey } = await import('./supabase/info.tsx');
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/imported-content/${type}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ items }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to save: ${response.statusText}`);
    }

    console.log(`✅ Saved ${items.length} ${type} to KV store`);
  } catch (error) {
    console.error(`❌ Error saving ${type}:`, error);
    throw error;
  }
}

/**
 * Carrega conteúdo importado do KV store
 */
export async function loadImportedContent(
  type: 'filmes' | 'series' | 'canais'
): Promise<ImportedContent[]> {
  try {
    const { projectId, publicAnonKey } = await import('./supabase/info.tsx');
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/imported-content/${type}`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );

    if (!response.ok) {
      console.warn(`⚠️ No ${type} content found, returning empty array`);
      return [];
    }

    const data = await response.json();
    console.log(`✅ Loaded ${data.length} ${type} from KV store`);
    return data;
  } catch (error) {
    console.error(`❌ Error loading ${type}:`, error);
    return [];
  }
}

/**
 * Converte ImportedContent para formato compatível com MovieCard
 */
export function convertToMovieFormat(item: ImportedContent) {
  return {
    id: item.id,
    title: item.title,
    name: item.title,
    poster_path: item.logo || null,
    backdrop_path: item.logo || null,
    overview: item.metadata?.description || '',
    vote_average: 0,
    release_date: '',
    streamUrl: item.url,
    group: item.group || 'Sem categoria',
  };
}

/**
 * Estatísticas do conteúdo importado
 */
export async function getImportStats(): Promise<{
  filmes: number;
  series: number;
  canais: number;
  total: number;
}> {
  const [filmes, series, canais] = await Promise.all([
    loadImportedContent('filmes'),
    loadImportedContent('series'),
    loadImportedContent('canais'),
  ]);

  return {
    filmes: filmes.length,
    series: series.length,
    canais: canais.length,
    total: filmes.length + series.length + canais.length,
  };
}

/**
 * Limpa todo o conteúdo importado
 */
export async function clearImportedContent(type?: 'filmes' | 'series' | 'canais'): Promise<void> {
  const types = type ? [type] : ['filmes', 'series', 'canais'] as const;
  
  for (const t of types) {
    await saveImportedContent(t, []);
  }
  
  console.log(`✅ Cleared ${type || 'all'} imported content`);
}
