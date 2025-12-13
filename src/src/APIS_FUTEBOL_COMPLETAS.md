# 📡 TODAS AS APIS DA PÁGINA FUTEBOL - REDFLIX

## 🎯 VISÃO GERAL

A página de futebol utiliza **3 provedores diferentes de APIs** para obter dados completos:

1. **Football-Data.org** - Dados oficiais de competições, times, partidas
2. **Sportmonks** - Estatísticas detalhadas, jogos ao vivo, transferências
3. **TheSportsDB** - Informações visuais e detalhes de times
4. **GloboEsporte RSS** - Notícias de futebol em português

---

## 📊 APIS UTILIZADAS NA SOCCERPAGE

### ✅ **12 APIs CHAMADAS ATIVAMENTE** (usadas no componente):

```javascript
const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;
const brasileiraoId = 2013; // Brasileirão Série A
const libertadoresId = 2152; // Copa Libertadores
```

#### 1️⃣ **TIMES DO BRASILEIRÃO**
```javascript
GET ${serverUrl}/football/competitions/${brasileiraoId}/teams
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna:
{
  "teams": [
    {
      "id": 1234,
      "name": "Flamengo",
      "shortName": "FLA",
      "tla": "FLA",
      "crest": "https://...",
      "address": "...",
      "website": "...",
      "founded": 1895,
      "clubColors": "...",
      "venue": "...",
      "lastUpdated": "..."
    }
    // ... mais times
  ]
}
```

---

#### 2️⃣ **PARTIDAS DO BRASILEIRÃO**
```javascript
GET ${serverUrl}/football/competitions/${brasileiraoId}/matches
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna:
{
  "matches": [
    {
      "id": 5678,
      "utcDate": "2025-11-20T20:00:00Z",
      "status": "SCHEDULED", // ou "TIMED", "IN_PLAY", "FINISHED"
      "matchday": 35,
      "homeTeam": {
        "id": 1234,
        "name": "Flamengo",
        "shortName": "FLA",
        "crest": "https://..."
      },
      "awayTeam": {
        "id": 5678,
        "name": "Palmeiras",
        "shortName": "PAL",
        "crest": "https://..."
      },
      "score": {
        "winner": null,
        "fullTime": { "home": null, "away": null }
      }
    }
    // ... mais partidas
  ]
}
```

---

#### 3️⃣ **TABELA DE CLASSIFICAÇÃO**
```javascript
GET ${serverUrl}/football/competitions/${brasileiraoId}/standings
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna:
{
  "standings": [
    {
      "type": "TOTAL",
      "table": [
        {
          "position": 1,
          "team": {
            "id": 1234,
            "name": "Flamengo",
            "shortName": "FLA",
            "crest": "https://..."
          },
          "playedGames": 34,
          "won": 22,
          "draw": 8,
          "lost": 4,
          "points": 74,
          "goalsFor": 68,
          "goalsAgainst": 32,
          "goalDifference": 36
        }
        // ... mais times
      ]
    }
  ]
}
```

---

#### 4️⃣ **PARTIDAS DA LIBERTADORES**
```javascript
GET ${serverUrl}/football/competitions/${libertadoresId}/matches
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna: Mesmo formato das partidas do Brasileirão
```

---

#### 5️⃣ **NOTÍCIAS DE FUTEBOL**
```javascript
GET ${serverUrl}/soccer-news
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Query params opcionais:
// ?team=flamengo (filtrar por time)

// Retorna:
{
  "items": [
    {
      "title": "Flamengo vence clássico...",
      "link": "https://ge.globo.com/...",
      "pubDate": "2025-11-15T10:30:00Z",
      "description": "...",
      "thumbnail": "https://...",
      "category": "Brasileirão"
    }
    // ... mais notícias
  ]
}
```

---

#### 6️⃣ **ARTILHEIROS DO BRASILEIRÃO (Football-Data)**
```javascript
GET ${serverUrl}/football/competitions/${brasileiraoId}/scorers
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna:
{
  "scorers": [
    {
      "player": {
        "id": 9999,
        "name": "Pedro",
        "nationality": "Brazil",
        "position": "Attacker"
      },
      "team": {
        "id": 1234,
        "name": "Flamengo",
        "crest": "https://..."
      },
      "goals": 28,
      "assists": 5,
      "penalties": 4
    }
    // ... mais artilheiros
  ]
}
```

---

#### 7️⃣ **ARTILHEIROS DETALHADOS (Sportmonks)**
```javascript
GET ${serverUrl}/sportmonks/scorers/brasileirao
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna:
{
  "data": [
    {
      "player": {
        "data": {
          "id": 123456,
          "display_name": "Pedro",
          "image_path": "https://...",
          "position_id": 27,
          "nationality": "Brazil"
        }
      },
      "team": {
        "data": {
          "id": 7890,
          "name": "Flamengo",
          "image_path": "https://..."
        }
      },
      "goals": 28,
      "assists": 5,
      "minutes": 2847,
      "rating": "7.89"
    }
    // ... mais artilheiros
  ]
}
```

---

#### 8️⃣ **JOGOS AO VIVO (Sportmonks)**
```javascript
GET ${serverUrl}/sportmonks/matches/live
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna:
{
  "data": [
    {
      "id": 123456,
      "name": "Flamengo vs Palmeiras",
      "league": {
        "data": {
          "id": 384,
          "name": "Brasileirão Serie A",
          "image_path": "https://..."
        }
      },
      "participants": [
        {
          "id": 7890,
          "name": "Flamengo",
          "image_path": "https://...",
          "meta": {
            "location": "home",
            "goals": 2
          }
        },
        {
          "id": 7891,
          "name": "Palmeiras",
          "image_path": "https://...",
          "meta": {
            "location": "away",
            "goals": 1
          }
        }
      ],
      "scores": [
        { "score": { "goals": 2, "participant": "home" } },
        { "score": { "goals": 1, "participant": "away" } }
      ],
      "state": {
        "state": "INPLAY",
        "minute": 67
      }
    }
    // ... mais jogos ao vivo
  ]
}
```

---

#### 9️⃣ **TRANSFERÊNCIAS RECENTES (Sportmonks)**
```javascript
GET ${serverUrl}/sportmonks/transfers/brasileirao
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna:
{
  "data": [
    {
      "player": {
        "data": {
          "id": 123456,
          "display_name": "Gabigol",
          "image_path": "https://..."
        }
      },
      "from": {
        "data": {
          "name": "Flamengo",
          "image_path": "https://..."
        }
      },
      "to": {
        "data": {
          "name": "Cruzeiro",
          "image_path": "https://..."
        }
      },
      "type": "Transfer",
      "date": "2025-01-15",
      "amount": 5000000
    }
    // ... mais transferências
  ]
}
```

---

#### 🔟 **GARÇONS/ASSISTÊNCIAS (Sportmonks)**
```javascript
GET ${serverUrl}/sportmonks/assists/brasileirao
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna: Mesmo formato dos artilheiros, mas ordenado por assistências
{
  "data": [
    {
      "player": { /* ... */ },
      "team": { /* ... */ },
      "goals": 12,
      "assists": 18,  // Ordenado por este campo
      "minutes": 2847,
      "rating": "7.89"
    }
    // ... mais garçons
  ]
}
```

---

#### 1️⃣1️⃣ **RODADAS DO BRASILEIRÃO (Sportmonks)**
```javascript
GET ${serverUrl}/sportmonks/rounds/brasileirao
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Retorna:
{
  "data": [
    {
      "id": 5678,
      "name": "Rodada 35",
      "starting_at": "2025-11-20",
      "ending_at": "2025-11-24",
      "fixtures": {
        "data": [
          {
            "id": 123456,
            "name": "Flamengo vs Palmeiras",
            "participants": [/* ... */]
          }
          // ... mais fixtures
        ]
      }
    }
    // ... mais rodadas
  ]
}
```

---

#### 1️⃣2️⃣ **DETALHES DE TIMES (TheSportsDB)**
```javascript
GET ${serverUrl}/sportsdb/search/team/${encodeURIComponent(teamName)}
Headers: { "Authorization": `Bearer ${publicAnonKey}` }

// Exemplo: /sportsdb/search/team/Flamengo

// Retorna:
{
  "teams": [
    {
      "idTeam": "133602",
      "strTeam": "Flamengo",
      "strAlternate": "Clube de Regatas do Flamengo",
      "strLeague": "Brazilian Serie A",
      "strCountry": "Brazil",
      "strBadge": "https://www.thesportsdb.com/images/media/team/badge/...",
      "strTeamBanner": "https://...",
      "strStadium": "Maracanã",
      "strStadiumThumb": "https://...",
      "strStadiumLocation": "Rio de Janeiro",
      "intStadiumCapacity": "78838",
      "strWebsite": "www.flamengo.com.br",
      "strFacebook": "...",
      "strTwitter": "...",
      "strInstagram": "...",
      "strDescriptionEN": "Full description...",
      "strDescriptionPT": "Descrição completa..."
    }
    // Pode retornar múltiplos resultados
  ]
}
```

---

## 📚 APIS ADICIONAIS DISPONÍVEIS (NÃO USADAS ATUALMENTE)

### **Football-Data.org APIs:**

```javascript
// Todas as competições
GET /football/competitions

// Partidas de hoje
GET /football/matches

// Partidas de um time específico
GET /football/teams/:id/matches
```

### **TheSportsDB APIs:**

```javascript
// Time por ID
GET /sportsdb/team/:id

// Todos os times do Brasileirão
GET /sportsdb/league/brazilian

// Últimas 5 partidas de um time
GET /sportsdb/team/:id/last-matches

// Próximas 5 partidas de um time
GET /sportsdb/team/:id/next-matches

// Jogadores de um time
GET /sportsdb/team/:id/players

// Tabela do Brasileirão
GET /sportsdb/league/table/brazilian?season=2024
```

### **Sportmonks APIs (23 endpoints disponíveis):**

```javascript
// Tabela de classificação
GET /sportmonks/standings/brasileirao

// Detalhes de um time
GET /sportmonks/team/:id

// Elenco/jogadores de um time
GET /sportmonks/team/:id/squad

// Próximos jogos do Brasileirão
GET /sportmonks/fixtures/brasileirao

// Estatísticas de um time
GET /sportmonks/team/:id/statistics

// Detalhes de um jogador
GET /sportmonks/player/:id

// Lesões de um time
GET /sportmonks/team/:id/injuries

// Confronto direto entre dois times
GET /sportmonks/h2h/:team1/:team2

// Detalhes de uma partida específica
GET /sportmonks/fixture/:id

// Retrospecto de um time (últimos 5 jogos)
GET /sportmonks/team/:id/form

// Notícias do Brasileirão
GET /sportmonks/news/brasileirao

// Detalhes de um estádio
GET /sportmonks/venue/:id

// Árbitros
GET /sportmonks/referees
```

---

## 🔑 API KEYS E CONFIGURAÇÃO

### **No Servidor (`/supabase/functions/server/index.tsx`):**

```typescript
// Football-Data.org
const FOOTBALL_API_KEY = "1785cd0b9269484c9778e013e8fe414c";
const FOOTBALL_BASE_URL = "https://api.football-data.org/v4";

// TheSportsDB
const SPORTSDB_API_KEY = "123"; // Free tier key
const SPORTSDB_BASE_URL = "https://www.thesportsdb.com/api/v1/json";

// Sportmonks
const SPORTMONKS_API_KEY = "wc1ZGRWBlAm8QY61LopdJLJ8yoWaWqoxXTUMH7yUgsdqP7ehfOwSuCzkg7bI";
const SPORTMONKS_BASE_URL = "https://api.sportmonks.com/v3/football";

// GloboEsporte RSS
const RSS_URL = "https://ge.globo.com/rss/ge/futebol/";
```

---

## 🎯 IDs IMPORTANTES

```typescript
// Competições
const brasileiraoId = 2013;  // Brasileirão Série A (Football-Data)
const libertadoresId = 2152; // Copa Libertadores (Football-Data)

// Sportmonks
const seasonId = 23880;      // Temporada 2025 do Brasileirão
const leagueId = 384;        // Liga Brasileirão (Sportmonks)
const brazilianLeagueTheSportsDB = 4351; // Brasileirão (TheSportsDB)
```

---

## 📋 EXEMPLO DE USO COMPLETO

```typescript
// SoccerPage.tsx - fetchAllData()

async function fetchAllData() {
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;
  
  // 1. Times
  const teamsResp = await fetch(`${serverUrl}/football/competitions/2013/teams`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const teamsData = await teamsResp.json();
  setTeams(teamsData.teams);

  // 2. Partidas
  const matchesResp = await fetch(`${serverUrl}/football/competitions/2013/matches`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const matchesData = await matchesResp.json();
  setUpcomingMatches(matchesData.matches);

  // 3. Tabela
  const standingsResp = await fetch(`${serverUrl}/football/competitions/2013/standings`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const standingsData = await standingsResp.json();
  setStandings(standingsData.standings[0].table);

  // 4. Libertadores
  const libertadoresResp = await fetch(`${serverUrl}/football/competitions/2152/matches`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const libertadoresData = await libertadoresResp.json();
  setLibertadoresMatches(libertadoresData.matches);

  // 5. Notícias
  const newsResp = await fetch(`${serverUrl}/soccer-news`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const newsData = await newsResp.json();
  setNews(newsData.items);

  // 6. Artilheiros (Football-Data)
  const scorersResp = await fetch(`${serverUrl}/football/competitions/2013/scorers`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const scorersData = await scorersResp.json();
  setTopScorers(scorersData.scorers);

  // 7. Artilheiros detalhados (Sportmonks)
  const sportmonksScorersResp = await fetch(`${serverUrl}/sportmonks/scorers/brasileirao`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const sportmonksData = await sportmonksScorersResp.json();
  setSportmonksScorers(sportmonksData.data);

  // 8. Jogos ao vivo
  const liveResp = await fetch(`${serverUrl}/sportmonks/matches/live`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const liveData = await liveResp.json();
  setLiveMatches(liveData.data);

  // 9. Transferências
  const transfersResp = await fetch(`${serverUrl}/sportmonks/transfers/brasileirao`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const transfersData = await transfersResp.json();
  setTransfers(transfersData.data);

  // 10. Assistências
  const assistsResp = await fetch(`${serverUrl}/sportmonks/assists/brasileirao`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const assistsData = await assistsResp.json();
  setAssists(assistsData.data);

  // 11. Rodadas
  const roundsResp = await fetch(`${serverUrl}/sportmonks/rounds/brasileirao`, {
    headers: { "Authorization": `Bearer ${publicAnonKey}` }
  });
  const roundsData = await roundsResp.json();
  setRounds(roundsData.data);

  // 12. Detalhes de cada time (loop)
  for (const team of teams) {
    const searchName = getSearchName(team.name);
    const searchResp = await fetch(
      `${serverUrl}/sportsdb/search/team/${encodeURIComponent(searchName)}`,
      { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
    );
    const searchData = await searchResp.json();
    // Processar dados...
  }
}
```

---

## ✅ RESUMO ESTATÍSTICAS

- **Total de APIs Disponíveis:** 36 endpoints
- **APIs Usadas Ativamente:** 12 endpoints
- **Provedores de Dados:** 4 (Football-Data, Sportmonks, TheSportsDB, GloboEsporte)
- **API Keys Necessárias:** 3 (Football-Data, Sportmonks, TheSportsDB é free)
- **Autenticação:** Bearer token do Supabase

---

## 🚀 COMO USAR PARA CRIAR OUTRAS PÁGINAS

Para criar uma página de **outro esporte/tema**, você precisa:

1. **Encontrar APIs similares** para o novo tema
2. **Criar novos endpoints no servidor** (`/supabase/functions/server/index.tsx`)
3. **Replicar a estrutura de fetch** da SoccerPage
4. **Adaptar os dados** para o novo formato

### Exemplo: Página de Basquete/NBA

```typescript
// No servidor:
const NBA_API_KEY = "sua_chave";
const NBA_BASE_URL = "https://api-basketball.com/v1";

app.get("/make-server-2363f5d6/nba/teams", async (c) => {
  const response = await fetch(`${NBA_BASE_URL}/teams?league=12`, {
    headers: { "x-rapidapi-key": NBA_API_KEY }
  });
  const data = await response.json();
  return c.json(data);
});

// No componente:
const teamsResp = await fetch(`${serverUrl}/nba/teams`, {
  headers: { "Authorization": `Bearer ${publicAnonKey}` }
});
```

---

**Versão:** 1.0.0  
**Atualizado:** 15/11/2025  
**Total de Endpoints Documentados:** 36
