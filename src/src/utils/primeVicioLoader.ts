/**
 * 🎬 REDFLIX CONTENT LOADER - FONTE ÚNICA
 * 
 * REGRA OBRIGATÓRIA:
 * - Busca conteúdo do TMDB diretamente
 * - Mostra TUDO (assume disponível)
 * - Usa player HTML5 universal
 * - SEM filmes.txt, SEM outras fontes
 */

// TMDB API - Chaves hardcoded
// 🔥 TEMPORÁRIO: API Keys hardcoded - Criar .env depois!
const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
const TMDB_BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZGIxYmRmNmFhOTFiZGYzMzU3OTc4NTM4ODRiMGMxZCIsIm5iZiI6MTc1NzgyNzc4NS42NTI5OTk5LCJzdWIiOiI2OGM2NTJjOWExMzU0OWNiMTljOGZkNTQiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.MRN49ZNLLIcrO-jeU9lcJUetiI8fZ5rkJl0a81RAb5U';
const TMDB_BASE = 'https://api.themoviedb.org/3';

// Flag para controlar se já mostramos aviso de API
let apiWarningShown = false;

// Fallback: Conteúdo demo caso a API Key esteja expirada
const DEMO_MOVIES: Content[] = [
  {
    id: 912649,
    title: 'Venom: A Última Rodada',
    name: 'Venom: A Última Rodada',
    poster_path: 'https://image.tmdb.org/t/p/w500/k42Owka8v91trK1qMYwCQCNwJKr.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/3V4kLQg0kSqPLctI5ziYWabAZYF.jpg',
    overview: 'Eddie e Venom estão em fuga. Perseguidos pelos seus dois mundos e com o cerco a apertar, a dupla é forçada a tomar uma decisão devastadora que resultará no fim da sua última dança.',
    vote_average: 6.8,
    release_date: '2024-10-22',
    type: 'movie',
    year: 2024,
    media_type: 'movie',
    available: true,
  },
  {
    id: 933260,
    title: 'O Corvo',
    name: 'O Corvo',
    poster_path: 'https://image.tmdb.org/t/p/w500/58QT4cPJ2u2TqWZkterDq9q4yxQ.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/Asg2UUwipAdE87MxtJy7SQo08XI.jpg',
    overview: 'As almas gémeas Eric e Shelly são brutalmente assassinadas. Tendo a oportunidade de salvar o seu verdadeiro amor ao sacrificar-se, Eric parte em busca de vingança implacável contra os seus assassinos, atravessando os mundos dos vivos e dos mortos para corrigir os erros.',
    vote_average: 5.8,
    release_date: '2024-08-21',
    type: 'movie',
    year: 2024,
    media_type: 'movie',
    available: true,

  },
  {
    id: 1184918,
    title: 'The Wild Robot',
    name: 'The Wild Robot',
    poster_path: 'https://image.tmdb.org/t/p/w500/wTnV3PCVW5O92JMrFvvrRcV39RU.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/417tYZ4XUyJrtyZXj7HpvWf1E8f.jpg',
    overview: 'Após um naufrágio, o robô inteligente Roz fica preso numa ilha desabitada. Para sobreviver ao ambiente adverso, Roz estabelece relações com os animais da ilha e torna-se pai adotivo de um ganso órfão.',
    vote_average: 8.6,
    release_date: '2024-09-12',
    type: 'movie',
    year: 2024,
    media_type: 'movie',
    available: true,

  },
  {
    id: 698687,
    title: 'Transformers: O Início',
    name: 'Transformers: O Início',
    poster_path: 'https://image.tmdb.org/t/p/w500/c3rwwFFVbkyEI6wPtpPd9lvovPW.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/xiSNQY9ttB43cP7xVVGeGfDhGnT.jpg',
    overview: 'A história não contada das origens de Optimus Prime e Megatron, mais conhecidos como inimigos jurados, mas que já foram amigos ligados como irmãos que mudaram o destino de Cybertron para sempre.',
    vote_average: 8.1,
    release_date: '2024-09-11',
    type: 'movie',
    year: 2024,
    media_type: 'movie',
    available: true,

  },
  {
    id: 519182,
    title: 'Deadpool & Wolverine',
    name: 'Deadpool & Wolverine',
    poster_path: 'https://image.tmdb.org/t/p/w500/9TFSqghEHrlBMRR63yTx80Orxva.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/yDHYTfA3R0jFYba16jBB1ef8oIt.jpg',
    overview: 'Um apático Wade Wilson trabalha duro na vida civil. Os seus dias como mercenário moralmente flexível, Deadpool, ficaram para trás. Quando o seu mundo natal enfrenta uma ameaça existencial, Wade tem de vestir novamente o fato, juntamente com um ainda mais relutante... relutante? Mais relutante? Ele tem de convencer um Wolverine relutante... Merda.',
    vote_average: 7.7,
    release_date: '2024-07-24',
    type: 'movie',
    year: 2024,
    media_type: 'movie',
    available: true,

  },
  {
    id: 1034062,
    title: 'Terrifier 3',
    name: 'Terrifier 3',
    poster_path: 'https://image.tmdb.org/t/p/w500/7NDHoebflLwL1CcgLJ9wZbbDrmV.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/18TSJF1WLA4CkymvVUcKDBwUJ9F.jpg',
    overview: 'Art the Clown está pronto para espalhar o caos entre os habitantes do Condado de Miles durante uma pacífica véspera de Natal.',
    vote_average: 7.3,
    release_date: '2024-10-09',
    type: 'movie',
    year: 2024,
    media_type: 'movie',
    available: true,

  },
];

const DEMO_SERIES: Content[] = [
  {
    id: 94605,
    title: 'Arcane',
    name: 'Arcane',
    poster_path: 'https://image.tmdb.org/t/p/w500/fqldf2t8ztc9aiwn3k6mlX3tvRT.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/qPC08l97VxKwgFxNhxM2wZZhlCN.jpg',
    overview: 'Em meio ao conflito entre as cidades gêmeas de Piltover e Zaun, duas irmãs lutam em lados opostos de uma guerra entre tecnologias mágicas e convicções incompatíveis.',
    vote_average: 8.8,
    first_air_date: '2021-11-06',
    type: 'tv',
    year: 2021,
    media_type: 'tv',
    available: true,

  },
  {
    id: 246,
    title: 'Avatar: A Lenda de Aang',
    name: 'Avatar: A Lenda de Aang',
    poster_path: 'https://image.tmdb.org/t/p/w500/9RQhVb3r3mCMqYVhLoCaKKsCH2m.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/jx7Y4JsIpWhHCqPUQY4tT8DbYaD.jpg',
    overview: 'Num mundo dividido em quatro nações, todas as pessoas podem controlar um dos quatro elementos (água, terra, fogo e ar). Apenas o Avatar pode controlar todos os quatro elementos. Quando o mundo necessita dele, o Avatar desaparece.',
    vote_average: 8.7,
    first_air_date: '2005-02-21',
    type: 'tv',
    year: 2005,
    media_type: 'tv',
    available: true,

  },
  {
    id: 1396,
    title: 'Breaking Bad',
    name: 'Breaking Bad',
    poster_path: 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    overview: 'Walter White é um professor de química que vive com sua esposa e seu filho, que tem paralisia cerebral. Quando descobre ter câncer nos pulmões, ele decide fabricar metanfetamina para garantir o futuro financeiro de sua família.',
    vote_average: 8.9,
    first_air_date: '2008-01-20',
    type: 'tv',
    year: 2008,
    media_type: 'tv',
    available: true,

  },
  {
    id: 95557,
    title: 'Invencível',
    name: 'Invencível',
    poster_path: 'https://image.tmdb.org/t/p/w500/yDWJYRAwMNKbIYT8ZB33qy84uzO.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/6UH52Fmau8RPsMAbQbjwN3wJSCj.jpg',
    overview: 'Mark Grayson é um adolescente normal, a não ser pelo fato de seu pai ser o super-herói mais poderoso do planeta. Logo após seu aniversário de 17 anos, Mark começa a desenvolver seus próprios poderes e entrar no legado de seu pai.',
    vote_average: 8.7,
    first_air_date: '2021-03-25',
    type: 'tv',
    year: 2021,
    media_type: 'tv',
    available: true,

  },
  {
    id: 1429,
    title: 'Attack on Titan',
    name: 'Attack on Titan',
    poster_path: 'https://image.tmdb.org/t/p/w500/hTP1DtLGFamjfu8WqjnuQdP1n4i.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/2zXpICRaXZNu8UvP5pFDgKJPcfS.jpg',
    overview: 'Há vários séculos, a raça humana foi quase dizimada por titãs. São tipicamente várias histórias de altura, parecem não ter inteligência, devoram seres humanos e, pior de tudo, parecem fazer isto pelo prazer e não como fonte de alimentação.',
    vote_average: 8.7,
    first_air_date: '2013-04-07',
    type: 'tv',
    year: 2013,
    media_type: 'tv',
    available: true,

  },
  {
    id: 60625,
    title: 'Rick and Morty',
    name: 'Rick and Morty',
    poster_path: 'https://image.tmdb.org/t/p/w500/gdIrmf2DdY5mgN6ycVP0XlzKzbE.jpg',
    backdrop_path: 'https://image.tmdb.org/t/p/original/RuKHt1rRbKZazvp5n2qGH7eMQ3.jpg',
    overview: 'Rick e Morty é uma série animada de comédia para adultos que acompanha um cientista louco, Rick, e seu neto facilmente influenciável, Morty, que dividem seu tempo entre a vida doméstica e viagens interdimensionais.',
    vote_average: 8.7,
    first_air_date: '2013-12-02',
    type: 'tv',
    year: 2013,
    media_type: 'tv',
    available: true,

  },
];

export interface Content {
  id: number;
  title: string;
  name: string;
  poster_path?: string;
  backdrop_path?: string;
  logo?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  type: 'movie' | 'tv';
  year?: number;
  media_type?: string;
  available: boolean; // ✅ Disponível no sistema
  embedUrl?: string; // URL do player embed
  // Para séries
  seasons?: Array<{
    season_number: number;
    name: string;
    episode_count: number;
    episodes?: Array<{
      episode_number: number;
      name: string;
      still_path?: string;
      available: boolean;
      embedUrl?: string;
    }>;
  }>;
}

// Cache em memória
let cachedMovies: Content[] | null = null;
let cachedSeries: Content[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30min

/**
 * Gerar URL de embed para player
 */
export function getEmbedUrl(tmdbId: number, type: 'movie' | 'tv', season?: number, episode?: number): string {
  // Retorna URLs genéricas para player HTML5 universal
  if (type === 'movie') {
    return `#movie-${tmdbId}`;
  } else {
    return `#tv-${tmdbId}-${season}-${episode}`;
  }
}

/**
 * Carregar filmes populares do TMDB diretamente
 */
async function loadMoviesFromTMDB(): Promise<Content[]> {
  console.log('🎬 Carregando filmes do TMDB...');

  const movies: Content[] = [];

  // Carregar múltiplas páginas
  const pages = [1, 2, 3];

  for (const page of pages) {
    try {
      const url = `${TMDB_BASE}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`;

      const response = await fetch(url);

      if (!response.ok) {
        // Silenciar erro - não poluir console
        continue;
      }

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        movies.push(...data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          name: movie.title,
          poster_path: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : undefined,
          backdrop_path: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : undefined,
          overview: movie.overview,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          genre_ids: movie.genre_ids,
          type: 'movie' as const,
          year: movie.release_date ? parseInt(movie.release_date.split('-')[0]) : undefined,
          media_type: 'movie',
          available: true, // Assume disponível
          embedUrl: getEmbedUrl(movie.id, 'movie'),
        })));

        console.log(`   ✅ Página ${page}: ${data.results.length} filmes`);
      }

      // Delay entre páginas
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Erro ao carregar página ${page}:`, error);
    }
  }

  console.log(`✅ Total de filmes: ${movies.length}`);
  return movies;
}

/**
 * Carregar séries populares do TMDB diretamente
 */
async function loadSeriesFromTMDB(): Promise<Content[]> {
  console.log('📺 Carregando séries do TMDB...');

  const series: Content[] = [];

  // Carregar múltiplas páginas
  const pages = [1, 2, 3];

  for (const page of pages) {
    try {
      const url = `${TMDB_BASE}/tv/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=${page}`;

      const response = await fetch(url);

      if (!response.ok) {
        // Silenciar erro - não poluir console
        continue;
      }

      const data = await response.json();

      if (data.results && Array.isArray(data.results)) {
        series.push(...data.results.map((show: any) => ({
          id: show.id,
          title: show.name,
          name: show.name,
          poster_path: show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : undefined,
          backdrop_path: show.backdrop_path
            ? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
            : undefined,
          overview: show.overview,
          vote_average: show.vote_average,
          first_air_date: show.first_air_date,
          genre_ids: show.genre_ids,
          type: 'tv' as const,
          year: show.first_air_date ? parseInt(show.first_air_date.split('-')[0]) : undefined,
          media_type: 'tv',
          available: true, // Assume disponível
          embedUrl: getEmbedUrl(show.id, 'tv', 1, 1),
        })));

        console.log(`   ✅ Página ${page}: ${data.results.length} séries`);
      }

      // Delay entre páginas
      await new Promise(resolve => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`Erro ao carregar página ${page}:`, error);
    }
  }

  console.log(`✅ Total de séries: ${series.length}`);
  return series;
}

/**
 * Carregar logo do TMDB
 */
async function loadLogo(tmdbId: number, type: 'movie' | 'tv'): Promise<string | undefined> {
  try {
    const url = `${TMDB_BASE}/${type}/${tmdbId}/images`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
        'accept': 'application/json',
      },
    });

    if (!response.ok) return undefined;

    const data = await response.json();

    if (data.logos && data.logos.length > 0) {
      // Preferir logo em português
      const ptLogo = data.logos.find((l: any) => l.iso_639_1 === 'pt');
      const logo = ptLogo || data.logos[0];

      return `https://image.tmdb.org/t/p/original${logo.file_path}`;
    }
  } catch (error) {
    // Silencioso
  }

  return undefined;
}

/**
 * Carregar detalhes completos (com logo) - apenas para os primeiros
 */
async function enrichWithLogos(items: Content[], maxItems: number = 20): Promise<Content[]> {
  console.log(`🎨 Carregando logos (primeiros ${maxItems})...`);

  const toEnrich = items.slice(0, maxItems);
  const rest = items.slice(maxItems);

  const BATCH_SIZE = 5;
  const enriched: Content[] = [];

  for (let i = 0; i < toEnrich.length; i += BATCH_SIZE) {
    const batch = toEnrich.slice(i, i + BATCH_SIZE);

    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const logo = await loadLogo(item.id, item.type);
        return { ...item, logo };
      })
    );

    enriched.push(...batchResults);

    // Log de progresso
    const processed = Math.min(i + BATCH_SIZE, toEnrich.length);
    console.log(`   Processado: ${processed}/${toEnrich.length}`);

    // Delay entre lotes
    if (i + BATCH_SIZE < toEnrich.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  return [...enriched, ...rest];
}

/**
 * FUNÇÃO PRINCIPAL - Carregar TUDO
 */
export async function loadAllContent(): Promise<{
  movies: Content[];
  series: Content[];
}> {
  // Cache check
  if (cachedMovies && cachedSeries && Date.now() - cacheTimestamp < CACHE_DURATION) {
    console.log('📦 Usando cache em memória');
    return { movies: cachedMovies, series: cachedSeries };
  }

  console.log('🎬 ═══════════════════════════════════════════════════');
  console.log('🎬 CARREGANDO CONTEÚDO');
  console.log('🎬 Fonte: TMDB (metadados e conteúdo)');
  console.log('🎬 ═══════════════════════════════════════════════════');

  try {
    // STEP 1: Carregar do TMDB
    const [moviesRaw, seriesRaw] = await Promise.all([
      loadMoviesFromTMDB(),
      loadSeriesFromTMDB(),
    ]);

    console.log('\n📊 Resultado TMDB:');
    console.log(`   Filmes: ${moviesRaw.length}`);
    console.log(`   Séries: ${seriesRaw.length}`);

    if (moviesRaw.length === 0 && seriesRaw.length === 0) {
      // Usar conteúdo demo silenciosamente
      cachedMovies = DEMO_MOVIES;
      cachedSeries = DEMO_SERIES;
      cacheTimestamp = Date.now();

      return { movies: DEMO_MOVIES, series: DEMO_SERIES };
    }

    // STEP 2: Carregar logos (apenas primeiros 20 de cada)
    console.log('\n🎨 Fase 2: Carregar logos...');

    const [moviesWithLogos, seriesWithLogos] = await Promise.all([
      enrichWithLogos(moviesRaw, 20),
      enrichWithLogos(seriesRaw, 20),
    ]);

    console.log('✅ ═══════════════════════════════════════════════════');
    console.log(`✅ CARREGADO COM SUCESSO!`);
    console.log(`   Filmes: ${moviesWithLogos.length}`);
    console.log(`   Séries: ${seriesWithLogos.length}`);
    console.log(`   TODOS assumidos como disponíveis`);
    console.log('✅ ═══════════════════════════════════════════════════');

    // Cache
    cachedMovies = moviesWithLogos;
    cachedSeries = seriesWithLogos;
    cacheTimestamp = Date.now();

    return { movies: moviesWithLogos, series: seriesWithLogos };
  } catch (error) {
    console.error('❌ Erro ao carregar conteúdo:', error);

    // Retornar cache se existir
    if (cachedMovies && cachedSeries) {
      console.log('⚠️ Usando cache antigo devido a erro');
      return { movies: cachedMovies, series: cachedSeries };
    }

    // Último recurso: usar conteúdo demo
    console.warn('⚠️ Usando conteúdo DEMO como fallback');
    console.log('💡 Para corrigir, siga o guia: /COMO_GERAR_API_KEY_TMDB.md');

    return { movies: DEMO_MOVIES, series: DEMO_SERIES };
  }
}

/**
 * Carregar temporadas e episódios de uma série
 */
export async function loadSeriesDetails(tmdbId: number): Promise<Content | null> {
  try {
    console.log(`📺 Carregando detalhes da série ${tmdbId}...`);

    // Buscar detalhes da série
    const url = `${TMDB_BASE}/tv/${tmdbId}?language=pt-BR&append_to_response=images`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Erro ao buscar série:', response.status);
      return null;
    }

    const data = await response.json();

    // Buscar logo
    let logo: string | undefined;
    if (data.images?.logos && data.images.logos.length > 0) {
      const ptLogo = data.images.logos.find((l: any) => l.iso_639_1 === 'pt');
      const logoData = ptLogo || data.images.logos[0];
      logo = `https://image.tmdb.org/t/p/original${logoData.file_path}`;
    }

    // Carregar detalhes de cada temporada (máximo 5 temporadas)
    const seasonsToLoad = data.seasons
      .filter((s: any) => s.season_number > 0)
      .slice(0, 5);

    const seasons = await Promise.all(
      seasonsToLoad.map(async (season: any) => {
        // Buscar episódios da temporada
        const seasonUrl = `${TMDB_BASE}/tv/${tmdbId}/season/${season.season_number}?language=pt-BR`;

        try {
          const seasonResponse = await fetch(seasonUrl, {
            headers: {
              'Authorization': `Bearer ${TMDB_BEARER_TOKEN}`,
              'accept': 'application/json',
            },
          });

          if (!seasonResponse.ok) {
            return {
              season_number: season.season_number,
              name: season.name,
              episode_count: season.episode_count,
              episodes: [],
            };
          }

          const seasonData = await seasonResponse.json();

          // Criar lista de episódios (todos disponíveis)
          const episodes = seasonData.episodes.map((ep: any) => ({
            episode_number: ep.episode_number,
            name: ep.name,
            still_path: ep.still_path
              ? `https://image.tmdb.org/t/p/w500${ep.still_path}`
              : undefined,
            available: true, // Assume disponível
            embedUrl: getEmbedUrl(tmdbId, 'tv', season.season_number, ep.episode_number),
          }));

          // Delay entre temporadas
          await new Promise(resolve => setTimeout(resolve, 200));

          return {
            season_number: season.season_number,
            name: season.name,
            episode_count: season.episode_count,
            episodes,
          };
        } catch (error) {
          console.warn(`Erro ao carregar temporada ${season.season_number}:`, error);
          return {
            season_number: season.season_number,
            name: season.name,
            episode_count: season.episode_count,
            episodes: [],
          };
        }
      })
    );

    console.log(`✅ Carregado: ${seasons.length} temporadas`);

    return {
      id: data.id,
      title: data.name,
      name: data.name,
      poster_path: data.poster_path
        ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
        : undefined,
      backdrop_path: data.backdrop_path
        ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
        : undefined,
      logo,
      overview: data.overview,
      vote_average: data.vote_average,
      first_air_date: data.first_air_date,
      genres: data.genres,
      type: 'tv',
      year: data.first_air_date ? parseInt(data.first_air_date.split('-')[0]) : undefined,
      media_type: 'tv',
      available: true,
      seasons,
    };
  } catch (error) {
    console.error(`Erro ao carregar detalhes da série ${tmdbId}:`, error);
    return null;
  }
}