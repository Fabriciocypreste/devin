// RedFlix - GloboEsporte Team URLs Mapping
// Maps team names to their GloboEsporte URLs

export const teamGloboUrls: Record<string, string> = {
  // Times Brasileiros - Série A
  'Flamengo': 'https://ge.globo.com/futebol/times/flamengo/',
  'Palmeiras': 'https://ge.globo.com/futebol/times/palmeiras/',
  'Corinthians': 'https://ge.globo.com/futebol/times/corinthians/',
  'São Paulo': 'https://ge.globo.com/futebol/times/sao-paulo/',
  'Fluminense': 'https://ge.globo.com/futebol/times/fluminense/',
  'Santos': 'https://ge.globo.com/futebol/times/santos/',
  'Grêmio': 'https://ge.globo.com/futebol/times/gremio/',
  'Internacional': 'https://ge.globo.com/futebol/times/internacional/',
  'Atlético-MG': 'https://ge.globo.com/futebol/times/atletico-mg/',
  'Cruzeiro': 'https://ge.globo.com/futebol/times/cruzeiro/',
  'Botafogo': 'https://ge.globo.com/futebol/times/botafogo/',
  'Vasco': 'https://ge.globo.com/futebol/times/vasco/',
  'Athletico-PR': 'https://ge.globo.com/futebol/times/atletico-pr/',
  'Coritiba': 'https://ge.globo.com/futebol/times/coritiba/',
  'Bahia': 'https://ge.globo.com/futebol/times/bahia/',
  'Vitória': 'https://ge.globo.com/futebol/times/vitoria/',
  'Sport': 'https://ge.globo.com/futebol/times/sport/',
  'Fortaleza': 'https://ge.globo.com/futebol/times/fortaleza/',
  'Ceará': 'https://ge.globo.com/futebol/times/ceara/',
  'Goiás': 'https://ge.globo.com/futebol/times/goias/',
  'Atlético-GO': 'https://ge.globo.com/futebol/times/atletico-go/',
  'Cuiabá': 'https://ge.globo.com/futebol/times/cuiaba/',
  'Red Bull Bragantino': 'https://ge.globo.com/futebol/times/red-bull-bragantino/',
  'América-MG': 'https://ge.globo.com/futebol/times/america-mg/',
  'Avaí': 'https://ge.globo.com/futebol/times/avai/',
  'Chapecoense': 'https://ge.globo.com/futebol/times/chapecoense/',
  'Ponte Preta': 'https://ge.globo.com/futebol/times/ponte-preta/',
  'Guarani': 'https://ge.globo.com/futebol/times/guarani/',
};

/**
 * Get GloboEsporte URL for a team
 * @param teamName - Team name (can be full name or variations)
 * @returns GloboEsporte URL for the team
 */
export function getTeamGloboUrl(teamName: string): string {
  // Direct match
  if (teamGloboUrls[teamName]) {
    return teamGloboUrls[teamName];
  }

  // Try to find partial match
  const normalizedInput = teamName.toLowerCase().trim();
  
  for (const [team, url] of Object.entries(teamGloboUrls)) {
    const normalizedTeam = team.toLowerCase();
    if (normalizedTeam.includes(normalizedInput) || normalizedInput.includes(normalizedTeam)) {
      return url;
    }
  }

  // Fallback: generate URL from team name
  const slug = teamName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens
    .trim();

  return `https://ge.globo.com/futebol/times/${slug}/`;
}

/**
 * Get main GloboEsporte URL
 */
export function getMainGloboUrl(): string {
  return 'https://ge.globo.com/';
}

/**
 * Get GloboEsporte soccer/football URL
 */
export function getSoccerGloboUrl(): string {
  return 'https://ge.globo.com/futebol/';
}

/**
 * Get Brasileirão URL
 */
export function getBrasileiraoUrl(): string {
  return 'https://ge.globo.com/futebol/brasileirao-serie-a/';
}

/**
 * Get Libertadores URL
 */
export function getLibertadoresUrl(): string {
  return 'https://ge.globo.com/futebol/libertadores/';
}
