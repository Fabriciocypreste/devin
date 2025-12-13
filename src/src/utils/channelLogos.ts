/**
 * Mapeamento de Logos dos Canais
 * 
 * Este arquivo contém as URLs das logos de todos os canais disponíveis.
 * As logos são hospedadas em api.cdnapp.fun
 * 
 * Formato: { "Nome do Canal": "URL da Logo" }
 */

export const channelLogos: Record<string, string> = {
  // ========================================
  // PARTE 1 - Canais Abertos e Notícias
  // ========================================
  "Cultura": "http://api.cdnapp.fun:80/images/9563345ec7cd63944d9900e9c091e661.png",
  "RedeTV!": "http://api.cdnapp.fun:80/images/0cb21e2d7c03d3fceb868d1a1eeb0ea5.png",
  "Band SP HD": "http://api.cdnapp.fun:80/images/0c0fdf1d9fabeb1bd3e468f6ceeafcc6.png",
  "Band BA": "http://api.cdnapp.fun:80/images/0c0fdf1d9fabeb1bd3e468f6ceeafcc6.png",
  "Band MG": "http://api.cdnapp.fun:80/images/0c0fdf1d9fabeb1bd3e468f6ceeafcc6.png",
  "Band PR": "http://api.cdnapp.fun:80/images/0c0fdf1d9fabeb1bd3e468f6ceeafcc6.png",
  "Band RJ": "http://api.cdnapp.fun:80/images/0c0fdf1d9fabeb1bd3e468f6ceeafcc6.png",
  "Band News HD": "http://api.cdnapp.fun:80/images/9f9e24e0e239a089bf51e279bf1f1d8b.png",
  "Record News HD": "http://api.cdnapp.fun:80/images/38a68fe3d9fc96249f5033b352ad0e23.png",
  "Record SP HD": "http://api.cdnapp.fun:80/images/ad82afc305b7456ccfc0c5e882e2c479.png",
  "SBT SP HD": "http://api.cdnapp.fun:80/images/b1e983d082e93e5a31d089e8db99f8bd.png",
  "Globo SP Capital HD": "http://api.cdnapp.fun:80/images/eb2f19351af9fe1276eb337b9d40063d.png",
  
  // ========================================
  // ESPORTES
  // ========================================
  "ESPN 1 HD": "http://api.cdnapp.fun:80/images/e6e050c3bd8a18d931080c2bbb6bc9e9.png",
  "SporTV 1 HD": "http://api.cdnapp.fun:80/images/827448d224d3dff5e00c588de090f1b7.png",
  "Premiere Clubes HD": "http://api.cdnapp.fun:80/images/453debc2d6dc008b7c893abed2d0b0e2.png",
  "Combate HD": "http://api.cdnapp.fun:80/images/e4be82410120cfe3dd90b12ff415a6ca.png",
  
  // ========================================
  // INFANTIL
  // ========================================
  "Cartoon Network HD": "http://api.cdnapp.fun:80/images/61f608be98fd5522b96d095ece9997b2.png",
  
  // ========================================
  // CULTURA E DOCUMENTÁRIOS
  // ========================================
  "Discovery Channel HD": "http://api.cdnapp.fun:80/images/28a05132fb2c78cc4e0c6a208b2cdfae.png",
  
  // ========================================
  // NOTÍCIAS
  // ========================================
  "CNN Brasil HD": "http://api.cdnapp.fun:80/images/cb47fa38d96afbff2c2013e8328f0cd2.png",
  
  // ========================================
  // VARIEDADES E ENTRETENIMENTO
  // ========================================
  "MTV HD": "http://api.cdnapp.fun:80/images/94b48120b47130cb9596a49315a9627c.png",
  "Multishow HD": "http://api.cdnapp.fun:80/images/6cfb472515d71ef4d4210623fe8502c7.png",
  "Viva HD": "http://api.cdnapp.fun:80/images/b0643085037160100b06a12edb136e20.png",
  
  // ========================================
  // AGUARDANDO MAIS CANAIS...
  // (Adicionar conforme você enviar as próximas partes)
  // ========================================
};

/**
 * Busca a logo de um canal pelo nome
 * Suporta busca case-insensitive e variações do nome
 */
export function getChannelLogo(channelName: string): string | undefined {
  if (!channelName) return undefined;
  
  // Busca exata (case-sensitive)
  if (channelLogos[channelName]) {
    return channelLogos[channelName];
  }
  
  // Busca case-insensitive
  const lowerName = channelName.toLowerCase().trim();
  const foundKey = Object.keys(channelLogos).find(
    key => key.toLowerCase().trim() === lowerName
  );
  
  if (foundKey) {
    return channelLogos[foundKey];
  }
  
  // Busca parcial (começa com)
  const partialMatch = Object.keys(channelLogos).find(
    key => key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())
  );
  
  if (partialMatch) {
    return channelLogos[partialMatch];
  }
  
  return undefined;
}

/**
 * Retorna todas as logos disponíveis
 */
export function getAllChannelLogos(): Record<string, string> {
  return { ...channelLogos };
}

/**
 * Verifica se um canal tem logo disponível
 */
export function hasChannelLogo(channelName: string): boolean {
  return getChannelLogo(channelName) !== undefined;
}

/**
 * Estatísticas das logos
 */
export function getLogosStats() {
  const total = Object.keys(channelLogos).length;
  const categories = {
    abertos: 0,
    esportes: 0,
    infantil: 0,
    cultura: 0,
    noticias: 0,
    variedades: 0,
  };
  
  Object.keys(channelLogos).forEach(name => {
    const lower = name.toLowerCase();
    if (lower.includes('espn') || lower.includes('sportv') || lower.includes('premiere') || lower.includes('combate')) {
      categories.esportes++;
    } else if (lower.includes('cartoon') || lower.includes('nick') || lower.includes('disney') || lower.includes('gloob')) {
      categories.infantil++;
    } else if (lower.includes('discovery') || lower.includes('national') || lower.includes('history')) {
      categories.cultura++;
    } else if (lower.includes('news') || lower.includes('cnn') || lower.includes('globonews')) {
      categories.noticias++;
    } else if (lower.includes('mtv') || lower.includes('multishow') || lower.includes('viva')) {
      categories.variedades++;
    } else if (lower.includes('globo') || lower.includes('sbt') || lower.includes('record') || lower.includes('band') || lower.includes('redetv')) {
      categories.abertos++;
    }
  });
  
  return {
    total,
    categories,
  };
}
