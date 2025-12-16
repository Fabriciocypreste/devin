/**
 * 🎬 REDFLIX - M3U PARSER SERVICE
 * 
 * Parser completo para o arquivo LISTAREAL.m3u com suporte a:
 * - Extração de metadados (tvg-name, tvg-logo, group-title)
 * - Detecção automática de canais adultos
 * - Agrupamento por categorias
 * - Busca e filtros
 */

export interface Channel {
  id: string;
  name: string;
  logo: string | null;
  url: string;
  group: string;
  tvgId?: string;
  tvgName?: string;
  isAdult: boolean;
}

/**
 * Detecta se um canal é adulto baseado APENAS na categoria
 * (não no nome do canal, para evitar falsos positivos)
 */
function isAdultChannel(group: string, name: string): boolean {
  const groupLower = group.toLowerCase();
  
  // Categorias adultas conhecidas
  const adultCategories = [
    'adultos',
    'xxx adultos',
    'xxx onlyfans',
    'series | onlyfans',
    '+18',
    '18+'
  ];
  
  // Verifica se a categoria corresponde exatamente a uma categoria adulta
  return adultCategories.some(category => groupLower === category);
}

/**
 * Parse do arquivo M3U e retorna lista de canais
 */
export async function parseM3U(m3uContent: string): Promise<Channel[]> {
  console.log('📺 Parseando LISTAREAL.m3u...');
  
  const lines = m3uContent.split('\n');
  const channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};
  let channelId = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('#EXTINF:')) {
      // Extrair metadados do canal
      const logoMatch = line.match(/tvg-logo="([^"]+)"/);
      const groupMatch = line.match(/group-title="([^"]+)"/);
      const tvgIdMatch = line.match(/tvg-id="([^"]+)"/);
      const tvgNameMatch = line.match(/tvg-name="([^"]+)"/);
      const nameMatch = line.match(/,(.+)$/);

      const name = nameMatch?.[1]?.trim() || '';
      const group = groupMatch?.[1] || 'Outros';
      
      currentChannel = {
        id: `channel-${channelId++}`,
        name,
        logo: logoMatch?.[1] || null,
        group,
        tvgId: tvgIdMatch?.[1],
        tvgName: tvgNameMatch?.[1],
        isAdult: isAdultChannel(group, name),
      };
    } 
    else if (line && !line.startsWith('#')) {
      // URL do stream (linha após #EXTINF)
      currentChannel.url = line;
      
      if (currentChannel.name && currentChannel.url) {
        channels.push(currentChannel as Channel);
        currentChannel = {};
      }
    }
  }

  console.log(`✅ ${channels.length} canais parseados do LISTAREAL.m3u`);
  
  // Log de estatísticas
  const adultCount = channels.filter(c => c.isAdult).length;
  console.log(`🔒 ${adultCount} canais adultos detectados`);
  
  return channels;
}

/**
 * Carrega e parseia o arquivo LISTAREAL.m3u
 */
export async function loadChannels(): Promise<Channel[]> {
  try {
    console.log('📦 Carregando LISTAREAL.m3u...');
    
    // Carregar o arquivo M3U da raiz do projeto
    const response = await fetch('/LISTAREAL.m3u');
    
    if (!response.ok) {
      throw new Error('LISTAREAL.m3u não encontrado');
    }
    
    const content = await response.text();
    const channels = await parseM3U(content);
    
    if (channels.length === 0) {
      throw new Error('Nenhum canal encontrado no LISTAREAL.m3u');
    }
    
    console.log(`✅ ${channels.length} canais carregados com sucesso`);
    return channels;
    
  } catch (error) {
    console.error('❌ Erro ao carregar LISTAREAL.m3u:', error);
    throw error;
  }
}

/**
 * Agrupa canais por categoria
 */
export function groupByCategory(channels: Channel[]): Record<string, Channel[]> {
  return channels.reduce((acc, channel) => {
    const group = channel.group || 'Outros';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(channel);
    return acc;
  }, {} as Record<string, Channel[]>);
}

/**
 * Busca canais por nome
 */
export function searchChannels(channels: Channel[], query: string): Channel[] {
  if (!query.trim()) return channels;
  
  const lowerQuery = query.toLowerCase();
  return channels.filter(channel => 
    channel.name.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filtra canais por categoria
 */
export function filterByCategory(channels: Channel[], category: string): Channel[] {
  if (category === 'all') return channels;
  return channels.filter(channel => channel.group === category);
}

/**
 * Retorna lista de categorias únicas
 */
export function getCategories(channels: Channel[]): string[] {
  const categories = new Set(channels.map(c => c.group));
  return Array.from(categories).sort();
}
