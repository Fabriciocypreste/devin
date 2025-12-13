// Mapeamento de nomes de times do Football-Data para IDs do Sportmonks
// Brasileirão Série A 2024

export const sportmonksTeamIds: Record<string, number> = {
  // Times principais do Brasileirão
  'Flamengo': 1450,
  'Palmeiras': 1451,
  'Corinthians': 1452,
  'São Paulo': 1453,
  'Santos': 1454,
  'Grêmio': 1455,
  'Internacional': 1456,
  'Atlético Mineiro': 1457,
  'Fluminense': 1458,
  'Botafogo': 1459,
  'Vasco da Gama': 1460,
  'Cruzeiro': 1461,
  'Athletico Paranaense': 1462,
  'Fortaleza': 1463,
  'Bahia': 1464,
  'Goiás': 1465,
  'Cuiabá': 1466,
  'Coritiba': 1467,
  'América Mineiro': 1468,
  'Red Bull Bragantino': 1469,
};

// Função para obter ID do Sportmonks baseado no nome do time
export function getSportmonksTeamId(teamName: string): number | null {
  // Tenta busca direta
  if (sportmonksTeamIds[teamName]) {
    return sportmonksTeamIds[teamName];
  }
  
  // Tenta busca parcial
  const normalizedName = teamName.toLowerCase().trim();
  for (const [key, value] of Object.entries(sportmonksTeamIds)) {
    if (key.toLowerCase().includes(normalizedName) || normalizedName.includes(key.toLowerCase())) {
      return value;
    }
  }
  
  return null;
}
