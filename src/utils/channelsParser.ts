export interface Channel {
  id: number;
  name: string;
  logo: string;
  url: string;
  programs: string[];
  category: string;
  quality: string;
}

export function parseChannelsFile(fileContent: string): Channel[] {
  const lines = fileContent.trim().split('\n');
  const channels: Channel[] = [];

  lines.forEach((line, index) => {
    const parts = line.split('|');
    if (parts.length >= 3) {
      const name = parts[0].trim();
      const logo = parts[1].trim();
      const url = parts[2].trim();
      const programs = parts[3] ? parts[3].split(',').map(p => p.trim()) : [];

      // Detectar categoria baseado no nome do canal
      const category = detectCategory(name);
      
      // Detectar qualidade
      const quality = detectQuality(name);

      channels.push({
        id: index + 1,
        name,
        logo,
        url,
        programs,
        category,
        quality
      });
    }
  });

  return channels;
}

function detectCategory(name: string): string {
  const nameLower = name.toLowerCase();
  
  // Esportes
  if (
    nameLower.includes('sport') || 
    nameLower.includes('espn') || 
    nameLower.includes('fox sports') ||
    nameLower.includes('premiere') ||
    nameLower.includes('combate') ||
    nameLower.includes('band sports') ||
    nameLower.includes('tnt sports')
  ) {
    return 'ESPORTE';
  }
  
  // Infantil
  if (
    nameLower.includes('kids') ||
    nameLower.includes('cartoon') ||
    nameLower.includes('nickelodeon') ||
    nameLower.includes('disney') ||
    nameLower.includes('gloob') ||
    nameLower.includes('nick jr')
  ) {
    return 'INFANTIL';
  }
  
  // Notícias
  if (
    nameLower.includes('news') ||
    nameLower.includes('cnn') ||
    nameLower.includes('globonews') ||
    nameLower.includes('bandnews') ||
    nameLower.includes('recordnews')
  ) {
    return 'NOTÍCIAS';
  }
  
  // Filmes & Séries
  if (
    nameLower.includes('hbo') ||
    nameLower.includes('telecine') ||
    nameLower.includes('paramount') ||
    nameLower.includes('universal') ||
    nameLower.includes('warner') ||
    nameLower.includes('axn') ||
    nameLower.includes('sony') ||
    nameLower.includes('tnt') ||
    nameLower.includes('space') ||
    nameLower.includes('fx') ||
    nameLower.includes('amc') ||
    nameLower.includes('syfy')
  ) {
    return 'FILMES & SÉRIES';
  }
  
  // Cultura
  if (
    nameLower.includes('national geographic') ||
    nameLower.includes('discovery') ||
    nameLower.includes('history') ||
    nameLower.includes('animal planet') ||
    nameLower.includes('science')
  ) {
    return 'CULTURA';
  }
  
  // Variedades
  if (
    nameLower.includes('mtv') ||
    nameLower.includes('vh1') ||
    nameLower.includes('comedy') ||
    nameLower.includes('tlc') ||
    nameLower.includes('food') ||
    nameLower.includes('hgtv')
  ) {
    return 'VARIEDADES';
  }
  
  // Abertos
  if (
    nameLower.includes('globo') ||
    nameLower.includes('sbt') ||
    nameLower.includes('record') ||
    nameLower.includes('band') ||
    nameLower.includes('redetv')
  ) {
    return 'ABERTOS';
  }
  
  return 'TODO';
}

function detectQuality(name: string): string {
  const nameLower = name.toLowerCase();
  
  if (nameLower.includes('4k') || nameLower.includes('uhd')) {
    return '4K';
  }
  
  if (nameLower.includes('hd')) {
    return 'HD';
  }
  
  return 'SD';
}

export async function loadChannelsFromServer(): Promise<Channel[]> {
  try {
    console.log('📺 ========================================');
    console.log('📺 CARREGANDO CANAIS REAIS VIA SERVIDOR');
    console.log('📺 ========================================');
    
    // Importar informações do Supabase
    const { projectId, publicAnonKey } = await import('./supabase/info');
    
    // Usar o servidor backend para evitar problemas de CORS
    const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/channels-data`;
    
    console.log('🔗 Buscando canais através do servidor backend...');
    console.log('📡 Isso evita problemas de CORS no navegador');
    
    const response = await fetch(serverUrl, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Servidor retornou status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success && data.content) {
      console.log('✅ Conteúdo recebido do servidor!');
      console.log(`📦 Tamanho: ${data.content.length} caracteres`);
      console.log(`🌐 Fonte original: ${data.source}`);
      
      const channels = parseChannelsFile(data.content);
      console.log(`✅ ${channels.length} canais REAIS parseados com sucesso!`);
      console.log('🎯 TODAS AS URLs DE LOGO E STREAM SÃO REAIS!');
      
      // Mostrar estatísticas por categoria
      const categoryCounts: { [key: string]: number } = {};
      channels.forEach(channel => {
        categoryCounts[channel.category] = (categoryCounts[channel.category] || 0) + 1;
      });
      console.log('📊 Distribuição por categoria:', categoryCounts);
      console.log('📺 ========================================');
      
      return channels;
    }
    
    throw new Error(data.message || 'Falha ao carregar canais');
    
  } catch (error) {
    console.error('❌ Erro ao carregar canais:', error);
    console.log('⚠️ Tentando fallback local...');
    
    // Tentar fallback local em caso de erro
    try {
      const localResponse = await fetch('/canais.txt');
      if (localResponse.ok) {
        const content = await localResponse.text();
        const channels = parseChannelsFile(content);
        console.log(`✅ Fallback: ${channels.length} canais do arquivo local`);
        return channels;
      }
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError);
    }
    
    console.log('📺 ========================================');
    return [];
  }
}
