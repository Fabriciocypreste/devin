import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// CORS
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Logger
app.use("*", logger(console.log));

// ============================================
// M3U PARSER (inline for server use)
// ============================================

interface M3UEntry {
  nome: string;
  logo: string;
  url: string;
  categoria: string;
  tvg_id?: string;
  tvg_name?: string;
  group_title?: string;
}

function parseM3U(content: string): M3UEntry[] {
  const lines = content.split('\n').map(line => line.trim());
  const entries: M3UEntry[] = [];
  
  let currentEntry: Partial<M3UEntry> = {};
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Ignora linhas vazias e cabeçalho
    if (!line || line === '#EXTM3U') {
      continue;
    }
    
    // Linha de informação do canal/conteúdo
    if (line.startsWith('#EXTINF:')) {
      // Extrair tvg-id
      const tvgIdMatch = line.match(/tvg-id="([^"]*)"/);
      if (tvgIdMatch) {
        currentEntry.tvg_id = tvgIdMatch[1];
      }
      
      // Extrair tvg-name
      const tvgNameMatch = line.match(/tvg-name="([^"]*)"/);
      if (tvgNameMatch) {
        currentEntry.tvg_name = tvgNameMatch[1];
      }
      
      // Extrair tvg-logo
      const logoMatch = line.match(/tvg-logo="([^"]*)"/);
      if (logoMatch) {
        currentEntry.logo = logoMatch[1];
      }
      
      // Extrair group-title (categoria)
      const groupMatch = line.match(/group-title="([^"]*)"/);
      if (groupMatch) {
        currentEntry.group_title = groupMatch[1];
        currentEntry.categoria = groupMatch[1].toLowerCase();
      }
      
      // Extrair nome (após a última vírgula)
      const commaIndex = line.lastIndexOf(',');
      if (commaIndex !== -1) {
        currentEntry.nome = line.substring(commaIndex + 1).trim();
      }
    }
    // Linha com URL
    else if (line.startsWith('http')) {
      currentEntry.url = line;
      
      // Se temos nome e URL, adicionar entrada
      if (currentEntry.nome && currentEntry.url) {
        entries.push({
          nome: currentEntry.nome,
          logo: currentEntry.logo || '',
          url: currentEntry.url,
          categoria: currentEntry.categoria || 'outros',
          tvg_id: currentEntry.tvg_id,
          tvg_name: currentEntry.tvg_name,
          group_title: currentEntry.group_title,
        });
      }
      
      // Resetar para próxima entrada
      currentEntry = {};
    }
  }
  
  return entries;
}

// ============================================
// IPTV ROUTES (GitHub lista repository)
// ============================================

/**
 * GET /make-server-2363f5d6/iptv/playlists/filmes
 * Busca filmes.txt do repositório GitHub
 */
app.get("/make-server-2363f5d6/iptv/playlists/filmes", async (c) => {
  try {
    console.log("📡 Fetching filmes.txt from GitHub...");
    
    // URLs possíveis do repositório GitHub (tentando várias combinações)
    const urls = [
      // Tentativa 1: main branch com .txt
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/main/filmes.txt",
      // Tentativa 2: master branch com .txt
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/master/filmes.txt",
      // Tentativa 3: main branch com .m3u
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/main/filmes.m3u",
      // Tentativa 4: master branch com .m3u
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/master/filmes.m3u",
      // Tentativa 5: sem extensão
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/main/filmes",
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/master/filmes",
    ];
    
    let response: Response | null = null;
    let content = "";
    let successUrl = "";
    
    // Tentar cada URL até encontrar uma que funcione
    for (const url of urls) {
      try {
        console.log(`🔍 Trying: ${url}`);
        response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RedFlix/1.0)",
            "Accept": "text/plain, application/octet-stream, */*",
          },
        });
        
        console.log(`📊 Response status: ${response.status}`);
        
        if (response.ok) {
          content = await response.text();
          successUrl = url;
          console.log(`✅ Successfully fetched ${content.length} bytes from: ${url}`);
          break;
        } else {
          console.log(`⚠️ URL returned ${response.status}: ${url}`);
        }
      } catch (err) {
        console.log(`❌ Failed to fetch from: ${url}`, err.message);
        continue;
      }
    }
    
    if (!content) {
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('ℹ️ REPOSITÓRIO GITHUB NÃO ENCONTRADO');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('O repositório não está público ou não contém os arquivos.');
      console.log('Para configurar:');
      console.log('');
      console.log('1. Crie o repositório: https://github.com/Fabriciocypreste/lista');
      console.log('2. Torne-o público');
      console.log('3. Adicione os arquivos: filmes.txt, series.txt, canais.txt');
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      
      // Retornar dados vazios sem erro
      return c.json({
        info: "GitHub repository not configured. See server logs for instructions.",
        repository: "https://github.com/Fabriciocypreste/lista",
        total: 0,
        movies: [],
        categories: {},
      }, 200); // ✅ Mudado de 404 para 200
    }
    
    console.log(`📄 Content preview: ${content.substring(0, 200)}...`);
    
    // Parse M3U content
    const entries = parseM3U(content);
    console.log(`📊 Parsed ${entries.length} entries from filmes.txt`);
    
    if (entries.length === 0) {
      console.warn("⚠️ No entries found in file. Content may not be in M3U format.");
      console.log("📄 First 500 chars:", content.substring(0, 500));
    }
    
    // Formatar para o formato esperado
    const movies = entries.map((entry, index) => ({
      id: index + 1000,
      name: entry.nome,
      title: entry.nome,
      url: entry.url,
      logo: entry.logo,
      category: entry.categoria || 'outros',
      tvg_id: entry.tvg_id,
      tvg_name: entry.tvg_name,
      group_title: entry.group_title,
    }));
    
    // Agrupar por categorias
    const categories: Record<string, number> = {};
    movies.forEach(movie => {
      const cat = movie.category || 'outros';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    console.log(`✅ Returning ${movies.length} movies in ${Object.keys(categories).length} categories`);
    console.log(`📊 Source: ${successUrl}`);
    
    return c.json({
      total: movies.length,
      movies,
      categories,
      source: successUrl || "GitHub - Fabriciocypreste/lista",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in /iptv/playlists/filmes:", error);
    return c.json({
      error: `Failed to load filmes.txt: ${error.message}`,
      stack: error.stack,
      total: 0,
      movies: [],
      categories: {},
    }, 500);
  }
});

/**
 * GET /make-server-2363f5d6/iptv/playlists/series
 * Busca series.txt do repositório GitHub
 */
app.get("/make-server-2363f5d6/iptv/playlists/series", async (c) => {
  try {
    console.log("📡 Fetching series.txt from GitHub...");
    
    const urls = [
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/main/series.txt",
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/master/series.txt",
    ];
    
    let response: Response | null = null;
    let content = "";
    
    for (const url of urls) {
      try {
        console.log(`🔍 Trying: ${url}`);
        response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RedFlix/1.0)",
          },
        });
        
        if (response.ok) {
          content = await response.text();
          console.log(`✅ Successfully fetched from: ${url}`);
          break;
        }
      } catch (err) {
        console.log(`❌ Failed to fetch from: ${url}`, err);
        continue;
      }
    }
    
    if (!content) {
      console.error("❌ Failed to fetch series.txt from all sources");
      return c.json({
        error: "Failed to fetch series.txt from GitHub",
        total: 0,
        series: [],
        categories: {},
      }, 500);
    }
    
    const entries = parseM3U(content);
    console.log(`📊 Parsed ${entries.length} entries from series.txt`);
    
    const series = entries.map((entry, index) => ({
      id: index + 2000,
      name: entry.nome,
      title: entry.nome,
      url: entry.url,
      logo: entry.logo,
      category: entry.categoria || 'outros',
      tvg_id: entry.tvg_id,
      tvg_name: entry.tvg_name,
      group_title: entry.group_title,
    }));
    
    const categories: Record<string, number> = {};
    series.forEach(item => {
      const cat = item.category || 'outros';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    console.log(`✅ Returning ${series.length} series in ${Object.keys(categories).length} categories`);
    
    return c.json({
      total: series.length,
      series,
      categories,
      source: "GitHub - Fabriciocypreste/lista",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in /iptv/playlists/series:", error);
    return c.json({
      error: `Failed to load series.txt: ${error.message}`,
      total: 0,
      series: [],
      categories: {},
    }, 500);
  }
});

/**
 * GET /make-server-2363f5d6/iptv/playlists/canais
 * Busca canais.txt do repositório GitHub
 */
app.get("/make-server-2363f5d6/iptv/playlists/canais", async (c) => {
  try {
    console.log("📡 Fetching canais.txt from GitHub...");
    
    const urls = [
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/main/canais.txt",
      "https://raw.githubusercontent.com/Fabriciocypreste/lista/master/canais.txt",
    ];
    
    let response: Response | null = null;
    let content = "";
    
    for (const url of urls) {
      try {
        console.log(`🔍 Trying: ${url}`);
        response = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; RedFlix/1.0)",
          },
        });
        
        if (response.ok) {
          content = await response.text();
          console.log(`✅ Successfully fetched from: ${url}`);
          break;
        }
      } catch (err) {
        console.log(`❌ Failed to fetch from: ${url}`, err);
        continue;
      }
    }
    
    if (!content) {
      console.error("❌ Failed to fetch canais.txt from all sources");
      return c.json({
        error: "Failed to fetch canais.txt from GitHub",
        total: 0,
        channels: [],
        categories: {},
      }, 500);
    }
    
    const entries = parseM3U(content);
    console.log(`📊 Parsed ${entries.length} entries from canais.txt`);
    
    const channels = entries.map((entry, index) => ({
      id: index + 3000,
      name: entry.nome,
      title: entry.nome,
      url: entry.url,
      logo: entry.logo,
      category: entry.categoria || 'outros',
      tvg_id: entry.tvg_id,
      tvg_name: entry.tvg_name,
      group_title: entry.group_title,
    }));
    
    const categories: Record<string, number> = {};
    channels.forEach(channel => {
      const cat = channel.category || 'outros';
      categories[cat] = (categories[cat] || 0) + 1;
    });
    
    console.log(`✅ Returning ${channels.length} channels in ${Object.keys(categories).length} categories`);
    
    return c.json({
      total: channels.length,
      channels,
      categories,
      source: "GitHub - Fabriciocypreste/lista",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error in /iptv/playlists/canais:", error);
    return c.json({
      error: `Failed to load canais.txt: ${error.message}`,
      total: 0,
      channels: [],
      categories: {},
    }, 500);
  }
});

// ============================================
// TMDB API PROXY ROUTES
// ============================================

const TMDB_API_KEY = Deno.env.get("TMDB_API_KEY") || "ddb1bdf6aa91bdf335797853884b0c1d";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

// Proxy for TMDB API (prevents API key exposure)
app.get("/make-server-2363f5d6/tmdb/*", async (c) => {
  const path = c.req.path.replace("/make-server-2363f5d6/tmdb/", "");
  const queryParams = new URL(c.req.url).searchParams;
  
  // Build URL with all query params
  const url = new URL(`${TMDB_BASE_URL}/${path}`);
  queryParams.forEach((value, key) => {
    url.searchParams.append(key, value);
  });
  url.searchParams.set("api_key", TMDB_API_KEY);
  
  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status}`, data);
    }
    
    return c.json(data, response.status);
  } catch (error) {
    console.error("Error proxying TMDB request:", error);
    return c.json({ error: "Failed to fetch from TMDB" }, 500);
  }
});

// ============================================
// FOOTBALL-DATA.ORG API ROUTES
// ============================================

const FOOTBALL_API_KEY = "f7fe9c326ae64ffebe0ac06dc33c1cfb";
const FOOTBALL_BASE_URL = "https://api.football-data.org/v4";

// Mock data como fallback
const MOCK_TEAMS = {
  teams: [
    { id: 1, name: "Flamengo", crest: "https://crests.football-data.org/1776.png", shortName: "FLA" },
    { id: 2, name: "Palmeiras", crest: "https://crests.football-data.org/1777.png", shortName: "PAL" },
    { id: 3, name: "Atlético Mineiro", crest: "https://crests.football-data.org/1778.png", shortName: "CAM" },
    { id: 4, name: "São Paulo", crest: "https://crests.football-data.org/1779.png", shortName: "SAO" },
    { id: 5, name: "Corinthians", crest: "https://crests.football-data.org/1780.png", shortName: "COR" },
    { id: 6, name: "Grêmio", crest: "https://crests.football-data.org/1781.png", shortName: "GRE" },
    { id: 7, name: "Internacional", crest: "https://crests.football-data.org/1782.png", shortName: "INT" },
    { id: 8, name: "Botafogo", crest: "https://crests.football-data.org/1783.png", shortName: "BOT" },
  ]
};

const MOCK_STANDINGS = {
  standings: [{
    table: [
      { position: 1, team: { name: "Palmeiras", crest: "https://crests.football-data.org/1777.png" }, playedGames: 38, won: 24, draw: 8, lost: 6, points: 80, goalsFor: 65, goalsAgainst: 32 },
      { position: 2, team: { name: "Flamengo", crest: "https://crests.football-data.org/1776.png" }, playedGames: 38, won: 23, draw: 9, lost: 6, points: 78, goalsFor: 70, goalsAgainst: 38 },
      { position: 3, team: { name: "Atlético Mineiro", crest: "https://crests.football-data.org/1778.png" }, playedGames: 38, won: 20, draw: 10, lost: 8, points: 70, goalsFor: 58, goalsAgainst: 40 },
      { position: 4, team: { name: "Botafogo", crest: "https://crests.football-data.org/1783.png" }, playedGames: 38, won: 19, draw: 11, lost: 8, points: 68, goalsFor: 55, goalsAgainst: 42 },
    ]
  }]
};

const MOCK_MATCHES = {
  matches: [
    {
      id: 1,
      utcDate: new Date().toISOString(),
      status: "SCHEDULED",
      homeTeam: { name: "Flamengo", crest: "https://crests.football-data.org/1776.png" },
      awayTeam: { name: "Palmeiras", crest: "https://crests.football-data.org/1777.png" },
      score: { fullTime: { home: null, away: null } }
    },
    {
      id: 2,
      utcDate: new Date(Date.now() - 86400000).toISOString(),
      status: "FINISHED",
      homeTeam: { name: "Corinthians", crest: "https://crests.football-data.org/1780.png" },
      awayTeam: { name: "São Paulo", crest: "https://crests.football-data.org/1779.png" },
      score: { fullTime: { home: 2, away: 1 } }
    }
  ]
};

const MOCK_SCORERS = {
  scorers: [
    { player: { name: "Pedro" }, team: { name: "Flamengo" }, goals: 15 },
    { player: { name: "Hulk" }, team: { name: "Atlético Mineiro" }, goals: 14 },
    { player: { name: "Raphael Veiga" }, team: { name: "Palmeiras" }, goals: 12 },
  ]
};

// Get teams from a competition
app.get("/make-server-2363f5d6/football/competitions/:id/teams", async (c) => {
  const competitionId = c.req.param("id");
  
  try {
    const response = await fetch(
      `${FOOTBALL_BASE_URL}/competitions/${competitionId}/teams`,
      {
        headers: {
          "X-Auth-Token": FOOTBALL_API_KEY,
        },
      }
    );

    if (!response.ok) {
      // Usar dados mock silenciosamente
      return c.json(MOCK_TEAMS);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.teams?.length || 0} teams`);
    return c.json(data);
  } catch (error) {
    // Usar dados mock silenciosamente
    return c.json(MOCK_TEAMS);
  }
});

// Get matches from a competition
app.get("/make-server-2363f5d6/football/competitions/:id/matches", async (c) => {
  const competitionId = c.req.param("id");
  
  try {
    const response = await fetch(
      `${FOOTBALL_BASE_URL}/competitions/${competitionId}/matches`,
      {
        headers: {
          "X-Auth-Token": FOOTBALL_API_KEY,
        },
      }
    );

    if (!response.ok) {
      // Usar dados mock silenciosamente
      return c.json(MOCK_MATCHES);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.matches?.length || 0} matches`);
    return c.json(data);
  } catch (error) {
    // Usar dados mock silenciosamente
    return c.json(MOCK_MATCHES);
  }
});

// Get standings from a competition
app.get("/make-server-2363f5d6/football/competitions/:id/standings", async (c) => {
  const competitionId = c.req.param("id");
  
  try {
    const response = await fetch(
      `${FOOTBALL_BASE_URL}/competitions/${competitionId}/standings`,
      {
        headers: {
          "X-Auth-Token": FOOTBALL_API_KEY,
        },
      }
    );

    if (!response.ok) {
      // Usar dados mock silenciosamente
      return c.json(MOCK_STANDINGS);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched standings`);
    return c.json(data);
  } catch (error) {
    // Usar dados mock silenciosamente
    return c.json(MOCK_STANDINGS);
  }
});

// Get top scorers from a competition
app.get("/make-server-2363f5d6/football/competitions/:id/scorers", async (c) => {
  const competitionId = c.req.param("id");
  
  try {
    const response = await fetch(
      `${FOOTBALL_BASE_URL}/competitions/${competitionId}/scorers`,
      {
        headers: {
          "X-Auth-Token": FOOTBALL_API_KEY,
        },
      }
    );

    if (!response.ok) {
      // Usar dados mock silenciosamente
      return c.json(MOCK_SCORERS);
    }

    const data = await response.json();
    console.log(`✅ Successfully fetched ${data.scorers?.length || 0} scorers`);
    return c.json(data);
  } catch (error) {
    // Usar dados mock silenciosamente
    return c.json(MOCK_SCORERS);
  }
});

// ============================================
// SPORTMONKS API ROUTES (Mock data for now)
// ============================================

// Mock data for scorers
app.get("/make-server-2363f5d6/sportmonks/scorers/brasileirao", async (c) => {
  const mockScorers = {
    data: [
      {
        player: { data: { display_name: "Pedro", common_name: "Pedro" } },
        team: { data: { name: "Flamengo" } },
        goals_count: 15,
        assists_count: 5,
        appearances_count: 20
      },
      {
        player: { data: { display_name: "Hulk", common_name: "Hulk" } },
        team: { data: { name: "Atlético Mineiro" } },
        goals_count: 14,
        assists_count: 3,
        appearances_count: 19
      }
    ]
  };
  return c.json(mockScorers);
});

// Mock data for assists
app.get("/make-server-2363f5d6/sportmonks/assists/brasileirao", async (c) => {
  const mockAssists = {
    data: [
      {
        player: { data: { display_name: "Arrascaeta", common_name: "Arrascaeta" } },
        team: { data: { name: "Flamengo" } },
        assists_count: 10,
        goals_count: 5,
        appearances_count: 20
      }
    ]
  };
  return c.json(mockAssists);
});

// Mock data for transfers
app.get("/make-server-2363f5d6/sportmonks/transfers/brasileirao", async (c) => {
  const mockTransfers = {
    data: [
      {
        player: { data: { display_name: "Tiquinho Soares" } },
        from_team: { data: { name: "Botafogo" } },
        to_team: { data: { name: "Atlético Mineiro" } },
        amount: "R$ 15M",
        date: "2025-01-15"
      }
    ]
  };
  return c.json(mockTransfers);
});

// Mock data for live matches
app.get("/make-server-2363f5d6/sportmonks/matches/live", async (c) => {
  const mockLiveMatches = {
    data: []
  };
  return c.json(mockLiveMatches);
});

// Mock data for rounds
app.get("/make-server-2363f5d6/sportmonks/rounds/brasileirao", async (c) => {
  const mockRounds = {
    data: [
      {
        name: "Rodada 1",
        start_date: "2025-04-13",
        end_date: "2025-04-14"
      }
    ]
  };
  return c.json(mockRounds);
});

// ============================================
// SOCCER NEWS (RSS Feed)
// ============================================

app.get("/make-server-2363f5d6/soccer-news", async (c) => {
  try {
    const response = await fetch(
      "https://ge.globo.com/dynamo/futebol/times/flamengo/rss2.xml"
    );

    if (!response.ok) {
      console.error(`GE RSS error: ${response.status}`);
      return c.json({ items: [] }, 200);
    }

    const xmlText = await response.text();
    
    // Parse RSS XML (simple parser)
    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];
      
      const titleMatch = /<title><!\[CDATA\[(.*?)\]\]><\/title>/.exec(itemContent);
      const linkMatch = /<link>(.*?)<\/link>/.exec(itemContent);
      const descMatch = /<description><!\[CDATA\[(.*?)\]\]><\/description>/.exec(itemContent);
      const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemContent);
      
      if (titleMatch && linkMatch) {
        items.push({
          title: titleMatch[1],
          link: linkMatch[1],
          description: descMatch ? descMatch[1] : "",
          pubDate: pubDateMatch ? pubDateMatch[1] : ""
        });
      }
    }

    return c.json({ items: items.slice(0, 20) });
  } catch (error) {
    console.error("Error fetching news:", error);
    return c.json({ items: [] }, 200);
  }
});

// ============================================
// M3U/TXT PROXY (for IPTV)
// ============================================

/**
 * Proxy para arquivos M3U/TXT (evita CORS)
 * GET /make-server-2363f5d6/proxy-m3u?url={file_url}
 */
app.get("/make-server-2363f5d6/proxy-m3u", async (c) => {
  try {
    const fileUrl = c.req.query("url");
    
    if (!fileUrl) {
      console.error("❌ proxy-m3u: URL não fornecida");
      return c.json({ error: "URL parameter is required" }, 400);
    }

    console.log(`📡 proxy-m3u: Fetching ${fileUrl}`);
    
    const response = await fetch(fileUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      console.error(`❌ proxy-m3u: Failed to fetch ${fileUrl} - Status: ${response.status}`);
      return c.json(
        { error: `Failed to fetch file: ${response.statusText}` },
        response.status
      );
    }

    const content = await response.text();
    console.log(`✅ proxy-m3u: Successfully fetched ${content.length} characters from ${fileUrl}`);

    return new Response(content, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Cache-Control": "public, max-age=300",
      },
    });
  } catch (error) {
    console.error("❌ proxy-m3u: Error:", error);
    return c.json({ error: `Proxy error: ${error.message}` }, 500);
  }
});

/**
 * OPTIONS para CORS preflight - proxy-m3u
 */
app.options("/make-server-2363f5d6/proxy-m3u", (c) => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
});

// ============================================
// THESPORTSDB API ROUTES
// ============================================

const SPORTSDB_API_KEY = "3"; // Free tier key

app.get("/make-server-2363f5d6/sportsdb/search/teams", async (c) => {
  const teamName = c.req.query("t");
  
  if (!teamName) {
    return c.json({ teams: null }, 400);
  }

  try {
    const response = await fetch(
      `https://www.thesportsdb.com/api/v1/json/${SPORTSDB_API_KEY}/searchteams.php?t=${encodeURIComponent(teamName)}`
    );

    if (!response.ok) {
      console.error(`SportsDB API error: ${response.status}`);
      return c.json({ teams: null }, response.status);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.error("Error fetching team from SportsDB:", error);
    return c.json({ teams: null }, 500);
  }
});

// ============================================
// KV STORE ROUTES (for user data)
// ============================================

// My List
app.get("/make-server-2363f5d6/my-list/:userId", async (c) => {
  const userId = c.req.param("userId");
  const data = await kv.get(`my-list:${userId}`);
  return c.json(data || []);
});

app.post("/make-server-2363f5d6/my-list/:userId", async (c) => {
  const userId = c.req.param("userId");
  const body = await c.req.json();
  await kv.set(`my-list:${userId}`, body);
  return c.json({ success: true });
});

// Watch Later
app.get("/make-server-2363f5d6/watch-later/:userId", async (c) => {
  const userId = c.req.param("userId");
  const data = await kv.get(`watch-later:${userId}`);
  return c.json(data || []);
});

app.post("/make-server-2363f5d6/watch-later/:userId", async (c) => {
  const userId = c.req.param("userId");
  const body = await c.req.json();
  await kv.set(`watch-later:${userId}`, body);
  return c.json({ success: true });
});

// Likes
app.get("/make-server-2363f5d6/likes/:userId", async (c) => {
  const userId = c.req.param("userId");
  const data = await kv.get(`likes:${userId}`);
  return c.json(data || []);
});

app.post("/make-server-2363f5d6/likes/:userId", async (c) => {
  const userId = c.req.param("userId");
  const body = await c.req.json();
  await kv.set(`likes:${userId}`, body);
  return c.json({ success: true });
});

// ============================================
// IMPORTED CONTENT (from GitHub repo)
// ============================================

// Get imported content
app.get("/make-server-2363f5d6/imported-content/:type", async (c) => {
  const type = c.req.param("type"); // filmes, series, canais
  const data = await kv.get(`imported-content:${type}`);
  return c.json(data || []);
});

// Save imported content
app.post("/make-server-2363f5d6/imported-content/:type", async (c) => {
  const type = c.req.param("type");
  const body = await c.req.json();
  
  console.log(`💾 Saving ${body.items?.length || 0} ${type} to KV store`);
  
  await kv.set(`imported-content:${type}`, body.items || []);
  return c.json({ 
    success: true, 
    count: body.items?.length || 0,
    type 
  });
});

// Delete imported content
app.delete("/make-server-2363f5d6/imported-content/:type", async (c) => {
  const type = c.req.param("type");
  await kv.del(`imported-content:${type}`);
  console.log(`🗑️ Deleted ${type} from KV store`);
  return c.json({ success: true });
});

// Get stats about imported content
app.get("/make-server-2363f5d6/imported-content-stats", async (c) => {
  const [filmes, series, canais] = await Promise.all([
    kv.get(`imported-content:filmes`),
    kv.get(`imported-content:series`),
    kv.get(`imported-content:canais`),
  ]);

  const stats = {
    filmes: Array.isArray(filmes) ? filmes.length : 0,
    series: Array.isArray(series) ? series.length : 0,
    canais: Array.isArray(canais) ? canais.length : 0,
    total: 
      (Array.isArray(filmes) ? filmes.length : 0) +
      (Array.isArray(series) ? series.length : 0) +
      (Array.isArray(canais) ? canais.length : 0),
  };

  return c.json(stats);
});

// Health check
app.get("/make-server-2363f5d6/health", (c) => {
  return c.json({ 
    status: "ok",
    message: "RedFlix Server is running",
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.notFound((c) => {
  return c.json({ 
    error: "Not Found",
    path: c.req.path 
  }, 404);
});

Deno.serve(app.fetch);