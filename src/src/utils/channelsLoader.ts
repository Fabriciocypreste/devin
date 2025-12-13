/**
 * Carregar canais do arquivo canaissite.txt
 */
export async function loadChannels(): Promise<ChannelsData> {
  const CHANNELS_URL = 'https://chemorena.com/filmes/canaissite.txt';
  
  console.log('📺 ═══════════════════════════════════════════════════════');
  console.log('📺 CARREGANDO CANAIS REAIS DO SERVIDOR');
  console.log('📺 URL:', CHANNELS_URL);
  console.log('📺 ═══════════════════════════════════════════════════════');

  try {
    let content: string | null = null;
    
    // TENTATIVA 1: Carregar direto (sem CORS)
    try {
      console.log('🔄 Tentativa 1: Carregamento direto...');
      const response = await fetch(CHANNELS_URL, {
        mode: 'cors',
        headers: {
          'Accept': 'text/plain, */*',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
      });
      
      if (response.ok) {
        content = await response.text();
        console.log(`✅ SUCESSO - Carregado direto: ${content.length} caracteres`);
        console.log(`✅ Primeiros 100 caracteres:`, content.substring(0, 100));
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (directError) {
      console.warn('⚠️ Tentativa 1 FALHOU (esperado por CORS):', directError);
      
      // TENTATIVA 2: Usar proxy do servidor
      try {
        console.log('🔄 Tentativa 2: Via proxy do servidor...');
        const { projectId, publicAnonKey } = await import('./supabase/info.tsx');
        const proxyUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/proxy-m3u?url=${encodeURIComponent(CHANNELS_URL)}`;
        
        console.log('📡 URL do proxy:', proxyUrl);
        
        const proxyResponse = await fetch(proxyUrl, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`,
            'Accept': 'text/plain, */*',
          },
        });
        
        if (proxyResponse.ok) {
          content = await proxyResponse.text();
          console.log(`✅ SUCESSO - Carregado via proxy: ${content.length} caracteres`);
          console.log(`✅ Primeiros 100 caracteres:`, content.substring(0, 100));
        } else {
          const errorText = await proxyResponse.text();
          throw new Error(`Proxy error: ${proxyResponse.status} - ${errorText}`);
        }
      } catch (proxyError) {
        console.error('❌ Tentativa 2 FALHOU:', proxyError);
        throw proxyError;
      }
    }

    // Se chegou aqui, conseguiu carregar!
    if (!content) {
      throw new Error('Conteúdo vazio');
    }

    // Parse M3U8
    console.log('🔄 Parseando conteúdo M3U8...');
    const channels = parseM3U8(content);
    
    if (channels.length === 0) {
      console.warn('⚠️ Nenhum canal encontrado no parse!');
      throw new Error('Nenhum canal parseado');
    }
    
    // Extrair grupos únicos
    const groupsSet = new Set<string>();
    channels.forEach(channel => {
      if (channel.group) {
        groupsSet.add(channel.group);
      }
    });
    const groups = Array.from(groupsSet).sort();

    console.log('✅ ═══════════════════════════════════════════════════════');
    console.log('✅ CANAIS REAIS CARREGADOS COM SUCESSO!');
    console.log(`✅ Total de canais: ${channels.length}`);
    console.log(`✅ Total de grupos: ${groups.length}`);
    console.log('✅ Grupos:', groups.join(', '));
    console.log('✅ ═══════════════════════════════════════════════════════');
    
    // Log dos primeiros 5 canais como amostra
    console.log('📋 Amostra dos primeiros 5 canais:');
    channels.slice(0, 5).forEach((ch, idx) => {
      console.log(`  ${idx + 1}. ${ch.name} [${ch.group || 'Sem grupo'}]`);
      console.log(`     Logo: ${ch.logo || 'Sem logo'}`);
      console.log(`     Stream: ${ch.streamUrl.substring(0, 50)}...`);
    });

    return {
      channels,
      groups
    };

  } catch (error) {
    console.error('❌ Erro ao carregar canais:', error);
    
    // Retornar canais de demonstração em caso de erro
    console.log('📺 Usando canais de demonstração...');
    
    const demoChannels: Channel[] = [
      {
        id: 1,
        name: 'RedFlix Esportes HD',
        logo: 'https://via.placeholder.com/200x112/E50914/FFFFFF?text=ESPORTES+HD',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Esportes',
        tvgId: 'demo-sports'
      },
      {
        id: 2,
        name: 'RedFlix Filmes HD',
        logo: 'https://via.placeholder.com/200x112/E50914/FFFFFF?text=FILMES+HD',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Filmes',
        tvgId: 'demo-movies'
      },
      {
        id: 3,
        name: 'RedFlix Séries HD',
        logo: 'https://via.placeholder.com/200x112/E50914/FFFFFF?text=SERIES+HD',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Séries',
        tvgId: 'demo-series'
      },
      {
        id: 4,
        name: 'RedFlix Notícias',
        logo: 'https://via.placeholder.com/200x112/E50914/FFFFFF?text=NOTICIAS',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Notícias',
        tvgId: 'demo-news'
      },
      {
        id: 5,
        name: 'RedFlix Kids HD',
        logo: 'https://via.placeholder.com/200x112/E50914/FFFFFF?text=KIDS+HD',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Infantil',
        tvgId: 'demo-kids'
      },
      {
        id: 6,
        name: 'RedFlix Documentários',
        logo: 'https://via.placeholder.com/200x112/E50914/FFFFFF?text=DOCS',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Documentários',
        tvgId: 'demo-docs'
      },
    ];
    
    return {
      channels: demoChannels,
      groups: ['Esportes', 'Filmes', 'Séries', 'Notícias', 'Infantil', 'Documentários']
    };
  }
}

/**
 * Filtrar canais por grupo
 */
export function filterChannelsByGroup(channels: Channel[], group: string): Channel[] {
  if (group === 'all') {
    return channels;
  }
  return channels.filter(channel => channel.group === group);
}

/**
 * Buscar canais por nome
 */
export function searchChannels(channels: Channel[], query: string): Channel[] {
  if (!query.trim()) {
    return channels;
  }
  
  const lowerQuery = query.toLowerCase();
  return channels.filter(channel => 
    channel.name.toLowerCase().includes(lowerQuery)
  );
}