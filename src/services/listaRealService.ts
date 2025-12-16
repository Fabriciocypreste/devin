/**
 * 🎬 REDFLIX - LISTA REAL SERVICE
 * 
 * Parser do arquivo LISTAREAL.zip (M3U com streams .TS reais)
 * 
 * REGRA: SÓ DADOS REAIS, ZERO FAKE/DEMO
 */

export interface CanalReal {
  id: number;
  name: string;
  logo: string | null;
  url: string; // Stream .TS real
  group: string; // Categoria do canal
  quality: string; // HD/FHD/4K/SD
  tvgId?: string;
  status: 'live';
  viewers?: number; // Opcional
}

/**
 * Parse do arquivo LISTAREAL.m3u (dados REAIS)
 */
export async function parseListaReal(content: string): Promise<CanalReal[]> {
  console.log('📺 Parseando LISTAREAL.m3u (dados REAIS)...');
  
  const lines = content.split('\n');
  const canais: CanalReal[] = [];
  let currentCanal: Partial<CanalReal> = {};
  let id = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Extrair metadados do canal
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
      const nameMatch = line.match(/,(.+)$/);

      const name = nameMatch?.[1]?.trim() || '';
      
      currentCanal = {
        id: id++,
        name,
        logo: logoMatch?.[1] || null,
        group: groupMatch?.[1] || 'Outros',
        tvgId: tvgIdMatch?.[1],
        quality: extractQuality(name),
        status: 'live',
      };
    } 
    else if (line && !line.startsWith('#')) {
      // URL do stream (linha após #EXTINF)
      currentCanal.url = line;
      
      if (currentCanal.name && currentCanal.url) {
        canais.push(currentCanal as CanalReal);
        currentCanal = {};
      }
    }
  }

  console.log(`✅ ${canais.length} canais REAIS parseados do LISTAREAL.m3u`);
  return canais;
}

/**
 * Extrair qualidade do nome do canal
 */
function extractQuality(name: string): string {
  if (/4K|UHD/i.test(name)) return '4K';
  if (/FHD|1080p?/i.test(name)) return 'FHD';
  if (/HD|720p?/i.test(name)) return 'HD';
  return 'SD';
}

/**
 * Carregar canais REAIS do arquivo LISTAREAL.zip
 */
export async function loadCanaisReais(): Promise<CanalReal[]> {
  try {
    console.log('📦 Carregando LISTAREAL.m3u...');
    
    // Tentar carregar o M3U (você precisa extrair o .zip primeiro)
    const response = await fetch('/LISTAREAL.m3u');
    
    if (!response.ok) {
      throw new Error('LISTAREAL.m3u não encontrado. Extraia o LISTAREAL.zip e coloque o arquivo na pasta public/');
    }
    
    const content = await response.text();
    const canais = await parseListaReal(content);
    
    if (canais.length === 0) {
      throw new Error('Nenhum canal encontrado no LISTAREAL.m3u');
    }
    
    console.log(`✅ ${canais.length} canais REAIS carregados`);
    return canais;
    
  } catch (error) {
    console.error('❌ Erro ao carregar LISTAREAL.m3u:', error);
    throw error;
  }
}

/**
 * Agrupar canais por categoria
 */
export function groupByCategory(canais: CanalReal[]): Record<string, CanalReal[]> {
  return canais.reduce((acc, canal) => {
    const group = canal.group || 'Outros';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(canal);
    return acc;
  }, {} as Record<string, CanalReal[]>);
}

/**
 * Buscar canais por nome
 */
export function searchCanais(canais: CanalReal[], query: string): CanalReal[] {
  const lowerQuery = query.toLowerCase();
  return canais.filter(canal => 
    canal.name.toLowerCase().includes(lowerQuery)
  );
}
