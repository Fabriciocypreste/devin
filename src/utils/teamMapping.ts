// Mapeamento de nomes de times do Football-Data para TheSportsDB
// Para garantir busca correta na API TheSportsDB

export const teamNameMapping: Record<string, string> = {
  // Grandes times
  'Flamengo': 'Flamengo',
  'Palmeiras': 'Palmeiras',
  'São Paulo FC': 'Sao Paulo',
  'Corinthians': 'Corinthians',
  'Santos FC': 'Santos',
  'Grêmio FBPA': 'Gremio',
  'SC Internacional': 'Internacional',
  'Fluminense FC': 'Fluminense',
  'Botafogo FR': 'Botafogo',
  'CR Vasco da Gama': 'Vasco da Gama',
  'Atlético Mineiro': 'Atletico Mineiro',
  'Cruzeiro EC': 'Cruzeiro',
  
  // Outros times
  'EC Bahia': 'Bahia',
  'Athletico Paranaense': 'Atletico Paranaense',
  'Fortaleza EC': 'Fortaleza',
  'RB Bragantino': 'Red Bull Bragantino',
  'Cuiabá EC': 'Cuiaba',
  'Goiás EC': 'Goias',
  'Coritiba FC': 'Coritiba',
  'Avaí FC': 'Avai',
  'Atlético Goianiense': 'Atletico Goianiense',
  'Sport Recife': 'Sport Recife',
  'Ceará SC': 'Ceara',
  'América Mineiro': 'America Mineiro',
  'Juventude': 'Juventude',
  'Chapecoense': 'Chapecoense',
};

// Função para normalizar nome do time para busca
export function normalizeTeamName(name: string): string {
  // Remove acentos
  const normalized = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Remove sufixos comuns
  return normalized
    .replace(/\s+(FC|EC|SC|FBPA|FR)$/i, '')
    .trim();
}

// Função para obter nome do time para busca no TheSportsDB
export function getSearchName(footballDataName: string): string {
  // Primeiro tenta no mapeamento
  if (teamNameMapping[footballDataName]) {
    return teamNameMapping[footballDataName];
  }
  
  // Normaliza e retorna
  return normalizeTeamName(footballDataName);
}

// IDs conhecidos do TheSportsDB para times brasileiros
export const teamSportsDbIds: Record<string, string> = {
  'Flamengo': '133602',
  'Palmeiras': '133610',
  'São Paulo': '133623',
  'Corinthians': '133604',
  'Grêmio': '133607',
  'Internacional': '133609',
  'Atlético Mineiro': '133600',
  'Santos': '133619',
  'Fluminense': '133605',
  'Botafogo': '133603',
  'Vasco da Gama': '133624',
  'Cruzeiro': '135089',
  'Bahia': '133601',
  'Athletico Paranaense': '133599',
  'Fortaleza': '134777',
  'Red Bull Bragantino': '134778',
  'Cuiabá': '135762',
  'Goiás': '133606',
  'Coritiba': '135088',
  'Avaí': '135695',
};

// Função helper para obter ID direto se conhecido
export function getSportsDbId(teamName: string): string | null {
  const searchName = getSearchName(teamName);
  return teamSportsDbIds[searchName] || null;
}
