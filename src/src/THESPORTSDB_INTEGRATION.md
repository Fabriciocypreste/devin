# 🏆 RedFlix - Integração TheSportsDB API

## 🎯 Visão Geral

Integração completa com a API do TheSportsDB para enriquecer as informações dos times brasileiros com dados detalhados, histórico, estádios, jogadores e muito mais.

---

## 🔑 API Key

```
API Key: 123
Base URL: https://www.thesportsdb.com/api/v1/json/123
Tier: Free (Developer Key)
```

**⚠️ Nota:** A chave `123` é uma chave de desenvolvimento fornecida pelo TheSportsDB para testes. Para produção, considere obter uma chave paga para mais recursos.

---

## 📡 Endpoints Implementados

### **1. Buscar Time por Nome**
```
GET /make-server-2363f5d6/sportsdb/search/team/:teamName
```

**Exemplo:**
```bash
GET /make-server-2363f5d6/sportsdb/search/team/Flamengo
```

**Resposta:**
```json
{
  "teams": [
    {
      "idTeam": "133602",
      "strTeam": "Flamengo",
      "strAlternate": "Clube de Regatas do Flamengo",
      "intFormedYear": "1895",
      "strStadium": "Maracanã",
      "strStadiumLocation": "Rio de Janeiro",
      "strTeamBadge": "https://...",
      "strTeamBanner": "https://...",
      "strDescriptionPT": "O Clube de Regatas do Flamengo...",
      ...
    }
  ]
}
```

---

### **2. Buscar Time por ID**
```
GET /make-server-2363f5d6/sportsdb/team/:id
```

**Exemplo:**
```bash
GET /make-server-2363f5d6/sportsdb/team/133602
```

---

### **3. Listar Todos os Times do Brasileirão**
```
GET /make-server-2363f5d6/sportsdb/league/brazilian
```

**Liga:** Brazilian Serie A (ID: 4351)

**Resposta:**
```json
{
  "teams": [
    { "idTeam": "133602", "strTeam": "Flamengo", ... },
    { "idTeam": "133610", "strTeam": "Palmeiras", ... },
    { "idTeam": "133623", "strTeam": "São Paulo", ... },
    ...
  ]
}
```

---

### **4. Últimos Jogos do Time**
```
GET /make-server-2363f5d6/sportsdb/team/:id/last-matches
```

**Exemplo:**
```bash
GET /make-server-2363f5d6/sportsdb/team/133602/last-matches
```

**Resposta:**
```json
{
  "results": [
    {
      "idEvent": "1234567",
      "strEvent": "Flamengo vs Palmeiras",
      "dateEvent": "2024-11-01",
      "intHomeScore": "2",
      "intAwayScore": "1",
      ...
    },
    ...
  ]
}
```

---

### **5. Próximos Jogos do Time**
```
GET /make-server-2363f5d6/sportsdb/team/:id/next-matches
```

**Exemplo:**
```bash
GET /make-server-2363f5d6/sportsdb/team/133602/next-matches
```

---

### **6. Jogadores do Time**
```
GET /make-server-2363f5d6/sportsdb/team/:id/players
```

**Exemplo:**
```bash
GET /make-server-2363f5d6/sportsdb/team/133602/players
```

**Resposta:**
```json
{
  "player": [
    {
      "idPlayer": "34161234",
      "strPlayer": "Gabigol",
      "strPosition": "Forward",
      "strNationality": "Brazil",
      "strThumb": "https://...",
      "dateBorn": "1996-08-30",
      "strNumber": "10",
      ...
    },
    ...
  ]
}
```

---

### **7. Tabela da Liga**
```
GET /make-server-2363f5d6/sportsdb/league/table/brazilian?season=2024
```

**Query Params:**
- `season` (opcional): Ano da temporada (padrão: 2024)

**Resposta:**
```json
{
  "table": [
    {
      "name": "Palmeiras",
      "teamid": "133610",
      "played": 38,
      "win": 24,
      "draw": 8,
      "loss": 6,
      "goalsfor": 72,
      "goalsagainst": 35,
      "goalsdifference": 37,
      "total": 80
    },
    ...
  ]
}
```

---

## 🎨 Interface na SoccerPage

### **Seção de Informações Detalhadas**

Localização: Entre "Times do Brasileirão" e "Próximos Jogos"

**Layout:**
```
┌─────────────────────────────────────────────────────────┐
│ 🏆 Informações Detalhadas dos Times    [TheSportsDB]   │
├─────────────────────────────────────────────────────────┤
│ ┌──────────┬──────────┬──────────┐                     │
│ │ [Badge]  │ [Badge]  │ [Badge]  │                     │
│ │ Flamengo │ Palmeiras│ S. Paulo │                     │
│ │ Maracanã │ Allianz  │ Morumbi  │                     │
│ │ 1895     │ 1914     │ 1930     │                     │
│ │ Rio de J.│ São Paulo│ São Paulo│                     │
│ │ [Banner] │ [Banner] │ [Banner] │                     │
│ │ [Detalhes] [Detalhes] [Detalhes]                     │
│ └──────────┴──────────┴──────────┘                     │
│                                                         │
│              [Ver Todos os 20 Times]                    │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 Dados Disponíveis por Time

### **Informações Básicas**
- ✅ Nome oficial (`strTeam`)
- ✅ Nome alternativo (`strAlternate`)
- ✅ Ano de fundação (`intFormedYear`)
- ✅ Estádio (`strStadium`)
- ✅ Localização do estádio (`strStadiumLocation`)
- ✅ Capacidade do estádio (`intStadiumCapacity`)

### **Imagens**
- ✅ Badge/Escudo (`strTeamBadge`)
- ✅ Banner (`strTeamBanner`)
- ✅ Logo (`strTeamLogo`)
- ✅ Jersey/Uniforme (`strTeamJersey`)

### **Descrições**
- ✅ Descrição em Português (`strDescriptionPT`)
- ✅ Descrição em Inglês (`strDescriptionEN`)

### **Redes Sociais**
- ✅ Website (`strWebsite`)
- ✅ Facebook (`strFacebook`)
- ✅ Twitter (`strTwitter`)
- ✅ Instagram (`strInstagram`)
- ✅ YouTube (`strYoutube`)

### **Cores**
- ✅ Cor primária (`strTeamColor1`)
- ✅ Cor secundária (`strTeamColor2`)
- ✅ Cor terciária (`strTeamColor3`)

### **Localização**
- ✅ País (`strCountry`)
- ✅ Cidade (`strStadiumLocation`)
- ✅ Coordenadas GPS (`strStadiumThumb`)

---

## 🎨 Card do Time - Estrutura

```tsx
<div className="team-card">
  {/* Header */}
  <div className="flex gap-4">
    <img src={team.strTeamBadge} />    {/* Badge 64x64 */}
    <div>
      <h3>{team.strTeam}</h3>           {/* Nome principal */}
      <p>{team.strAlternate}</p>        {/* Nome alternativo */}
    </div>
  </div>

  {/* Info */}
  <div className="info">
    <div>📍 {team.strStadium}</div>      {/* Estádio */}
    <div>📅 {team.intFormedYear}</div>   {/* Ano fundação */}
    <div>🌎 {team.strStadiumLocation}</div> {/* Cidade */}
  </div>

  {/* Description */}
  <p className="description">
    {team.strDescriptionPT}             {/* Descrição PT */}
  </p>

  {/* Banner (Background) */}
  <img src={team.strTeamBanner} />     {/* Banner fundo */}

  {/* Button */}
  <button>Ver Detalhes</button>
</div>
```

---

## 🇧🇷 Times Brasileiros Série A (2024)

### **IDs do TheSportsDB**

| Time | ID TheSportsDB | Fundação | Estádio |
|------|----------------|----------|---------|
| **Flamengo** | 133602 | 1895 | Maracanã |
| **Palmeiras** | 133610 | 1914 | Allianz Parque |
| **São Paulo** | 133623 | 1930 | Morumbi |
| **Corinthians** | 133604 | 1910 | Neo Química Arena |
| **Grêmio** | 133607 | 1903 | Arena do Grêmio |
| **Internacional** | 133609 | 1909 | Beira-Rio |
| **Atlético-MG** | 133600 | 1908 | Mineirão |
| **Santos** | 133619 | 1912 | Vila Belmiro |
| **Fluminense** | 133605 | 1902 | Maracanã |
| **Botafogo** | 133603 | 1894 | Nilton Santos |
| **Vasco** | 133624 | 1898 | São Januário |
| **Cruzeiro** | 135089 | 1921 | Mineirão |
| **Bahia** | 133601 | 1931 | Arena Fonte Nova |
| **Athletico-PR** | 133599 | 1924 | Arena da Baixada |
| **Fortaleza** | 134777 | 1918 | Castelão |
| **Bragantino** | 134778 | 1928 | Nabi Abi Chedid |
| **Cuiabá** | 135762 | 2001 | Arena Pantanal |
| **Goiás** | 133606 | 1943 | Serrinha |
| **Coritiba** | 135088 | 1909 | Couto Pereira |
| **Avaí** | 135695 | 1923 | Ressacada |

---

## 🎯 Funcionalidades Implementadas

### **1. Listagem de Times Enriquecida**
```tsx
// Busca automática ao carregar página
useEffect(() => {
  fetchSportsDbTeams();
}, []);

async function fetchSportsDbTeams() {
  const response = await fetch(
    `${serverUrl}/sportsdb/league/brazilian`
  );
  const data = await response.json();
  setSportsDbTeams(data.teams || []);
}
```

### **2. Cards Premium com Informações**
- ✅ Badge do time (hover scale 110%)
- ✅ Nome + nome alternativo
- ✅ Estádio + ícone MapPin
- ✅ Ano de fundação + ícone Calendar
- ✅ Cidade + ícone MapPin
- ✅ Descrição truncada (3 linhas)
- ✅ Banner de fundo (opacity 30%, hover 50%)
- ✅ Botão "Ver Detalhes" com ExternalLink

### **3. Integração com TeamDetails**
```tsx
onClick={() => {
  // Encontra time correspondente do football-data
  const matchingTeam = teams.find(t => 
    t.name.includes(team.strTeam.split(' ')[0])
  );
  
  if (matchingTeam) {
    setSelectedTeam({ 
      ...matchingTeam, 
      sportsDbData: team  // Adiciona dados extras
    });
  }
}}
```

### **4. Grid Responsivo**
```css
/* Mobile: 1 coluna */
grid-cols-1

/* Tablet: 2 colunas */
md:grid-cols-2

/* Desktop: 3 colunas */
lg:grid-cols-3
```

### **5. Limit de Exibição**
- Mostra **12 times** por padrão
- Botão "Ver Todos" se tiver mais de 12

---

## 🎨 Design System

### **Cores Brasil Theme**
```css
--brasil-verde: #009b3a;
--brasil-amarelo: #fedf00;
--brasil-azul: #002776;
```

### **Gradiente do Container**
```tsx
className="bg-gradient-to-br from-[#009b3a]/10 via-[#fedf00]/5 to-[#002776]/10"
```

**Efeito Visual:**
- 🟢 Canto superior esquerdo: Verde Brasil (10%)
- 🟡 Centro: Amarelo Brasil (5%)
- 🔵 Canto inferior direito: Azul Brasil (10%)

### **Badge "TheSportsDB"**
```tsx
<div className="px-4 py-2 bg-[#FFD700]/10 rounded-full border border-[#FFD700]/30">
  <span className="text-[#FFD700]">TheSportsDB</span>
</div>
```

---

## 🚀 Próximas Melhorias

### **1. Modal de Detalhes Completo**
```tsx
interface TeamDetailModal {
  basicInfo: TeamBasicInfo;
  statistics: TeamStats;
  recentMatches: Match[];
  nextMatches: Match[];
  players: Player[];
  socialMedia: SocialLinks;
}
```

### **2. Estatísticas do Time**
- 📊 Gráfico de desempenho (últimos 10 jogos)
- 🎯 Gols marcados vs sofridos
- 🏆 Títulos conquistados
- 👥 Elenco completo

### **3. Comparação de Times**
```tsx
<TeamComparison 
  team1={flamengo}
  team2={palmeiras}
/>
```

### **4. Filtros e Busca**
```tsx
<Filters>
  <Search placeholder="Buscar time..." />
  <Filter by="estado" />
  <Filter by="fundacao" />
  <Filter by="estadio" />
</Filters>
```

### **5. Cache de Dados**
```tsx
// Cache local para evitar requisições repetidas
const CACHE_KEY = 'sportsdb_teams';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h

localStorage.setItem(CACHE_KEY, JSON.stringify({
  data: teams,
  timestamp: Date.now()
}));
```

---

## 📝 Exemplos de Uso

### **Buscar Time Específico**
```tsx
const searchTeam = async (teamName: string) => {
  const response = await fetch(
    `${serverUrl}/sportsdb/search/team/${teamName}`,
    { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
  );
  const data = await response.json();
  return data.teams?.[0];
};

// Uso
const flamengo = await searchTeam('Flamengo');
console.log(flamengo.strStadium); // "Maracanã"
```

### **Listar Jogadores**
```tsx
const getPlayers = async (teamId: string) => {
  const response = await fetch(
    `${serverUrl}/sportsdb/team/${teamId}/players`,
    { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
  );
  const data = await response.json();
  return data.player || [];
};

// Uso
const players = await getPlayers('133602');
players.forEach(p => {
  console.log(`${p.strPlayer} - ${p.strPosition}`);
});
```

### **Ver Últimos Jogos**
```tsx
const getLastMatches = async (teamId: string) => {
  const response = await fetch(
    `${serverUrl}/sportsdb/team/${teamId}/last-matches`,
    { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
  );
  const data = await response.json();
  return data.results || [];
};

// Uso
const matches = await getLastMatches('133602');
console.log(`${matches[0].intHomeScore} x ${matches[0].intAwayScore}`);
```

---

## 🐛 Tratamento de Erros

### **Server-side**
```tsx
try {
  const response = await fetch(url);
  if (!response.ok) {
    console.log(`TheSportsDB API error: ${response.status}`);
    return c.json({ error: "Failed to fetch" }, response.status);
  }
  return c.json(data);
} catch (error) {
  console.log(`Server error: ${error}`);
  return c.json({ error: `Server error: ${error}` }, 500);
}
```

### **Client-side**
```tsx
try {
  const response = await fetch(url);
  if (response.ok) {
    const data = await response.json();
    setSportsDbTeams(data.teams || []);
  } else {
    console.error('Failed to fetch teams');
  }
} catch (error) {
  console.error('Error:', error);
}
```

---

## 🎬 Bandeira do Brasil Corrigida

### **SVG Completo**
```tsx
<svg viewBox="0 0 720 504">
  {/* Verde */}
  <rect width="720" height="504" fill="#009b3a"/>
  
  {/* Losango Amarelo */}
  <path d="M360,7.5L649.5,252L360,496.5L70.5,252L360,7.5z" fill="#fedf00"/>
  
  {/* Círculo Azul */}
  <circle cx="360" cy="252" r="104" fill="#002776"/>
  
  {/* Faixa Branca */}
  <path d="M360,148 A104,104 0 0,1 464,252 A104,104 0 0,1 360,356" 
        fill="none" stroke="#fff" strokeWidth="10"/>
  
  {/* Texto "ORDEM E PROGRESSO" */}
  <text x="360" y="258" fontFamily="Arial" fontSize="24" 
        fontWeight="bold" fill="#fff" textAnchor="middle">
    ORDEM E PROGRESSO
  </text>
  
  {/* Estrelas (representativas) */}
  <circle cx="360" cy="200" r="3" fill="#fff"/>
  <circle cx="380" cy="215" r="2.5" fill="#fff"/>
  <circle cx="340" cy="215" r="2.5" fill="#fff"/>
  <circle cx="360" cy="230" r="2" fill="#fff"/>
  <circle cx="390" cy="290" r="2" fill="#fff"/>
  <circle cx="330" cy="290" r="2" fill="#fff"/>
</svg>
```

**Elementos:**
- ✅ Retângulo verde (#009b3a)
- ✅ Losango amarelo (#fedf00)
- ✅ Círculo azul (#002776)
- ✅ Faixa branca curva
- ✅ Texto "ORDEM E PROGRESSO"
- ✅ 6 estrelas representativas

---

## 📊 Comparação: Football-Data vs TheSportsDB

| Recurso | Football-Data | TheSportsDB |
|---------|---------------|-------------|
| **Jogos ao vivo** | ✅ Sim | ❌ Não |
| **Estatísticas** | ✅ Detalhadas | ⚠️ Básicas |
| **Tabela liga** | ✅ Tempo real | ⚠️ Estática |
| **Badges/Logos** | ✅ Sim | ✅ HD |
| **Banners** | ❌ Não | ✅ Sim |
| **Descrições PT** | ❌ Não | ✅ Sim |
| **Estádio info** | ⚠️ Nome | ✅ Completo |
| **Jogadores** | ⚠️ Squad | ✅ Detalhado |
| **Histórico** | ❌ Não | ✅ Sim |
| **Redes sociais** | ❌ Não | ✅ Sim |
| **Cores time** | ❌ Não | ✅ Sim |
| **Limite API** | 10 req/min | ∞ (free tier) |

**Conclusão:** Usar **ambas** as APIs de forma complementar!

---

## ✅ Checklist de Implementação

- ✅ Servidor: Endpoints TheSportsDB
- ✅ Cliente: Fetch teams brasileiro
- ✅ UI: Seção cards detalhados
- ✅ Bandeira do Brasil corrigida
- ✅ Grid responsivo
- ✅ Hover effects
- ✅ Integração com TeamDetails
- ✅ Error handling
- ✅ Loading states
- ✅ Documentação completa
- ⚠️ TODO: Modal detalhes completo
- ⚠️ TODO: Jogadores por time
- ⚠️ TODO: Cache local
- ⚠️ TODO: Filtros de busca

---

**Status:** ✅ 100% Implementado (Básico)
**Versão:** RedFlix v3.4.0 - TheSportsDB Integration
**Data:** 2024
**Impacto:** Informações Enriquecidas dos Times 🏆⚽🇧🇷✨
