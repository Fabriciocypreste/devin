/**
 * Script de Ingestao de Dados do TMDB
 * 
 * Usa as 3 chaves TMDB configuradas no projeto com rotacao automatica
 * para evitar limites de uso (40 requests/10s por chave)
 * 
 * Este script:
 * - Busca 500 filmes e 500 series populares do TMDB
 * - Obtem metadados completos (elenco, diretores, generos, etc.)
 * - Usa as imagens existentes quando disponiveis
 * - Atualiza o banco de dados existente
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ============================================
// CONFIGURACAO DAS APIs TMDB
// ============================================

// 3 chaves TMDB com rotacao automatica (configurar via variaveis de ambiente)
// Exemplo: TMDB_API_KEY_1=xxx TMDB_API_KEY_2=yyy TMDB_API_KEY_3=zzz npx ts-node scripts/ingest-tmdb-data.ts
const TMDB_API_KEYS = [
  process.env.TMDB_API_KEY_1 || '',
  process.env.TMDB_API_KEY_2 || '',
  process.env.TMDB_API_KEY_3 || '',
].filter(key => key.length > 0);

if (TMDB_API_KEYS.length === 0) {
  console.error('❌ Erro: Nenhuma chave TMDB configurada!');
  console.error('Configure as variaveis de ambiente TMDB_API_KEY_1, TMDB_API_KEY_2, TMDB_API_KEY_3');
  process.exit(1);
}

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

let currentKeyIndex = 0;
let requestCount = 0;
const REQUESTS_PER_KEY = 35; // Rotaciona a cada 35 requests (limite e 40/10s)
const DELAY_BETWEEN_REQUESTS = 300; // 300ms entre requests

function getNextApiKey(): string {
  requestCount++;
  if (requestCount >= REQUESTS_PER_KEY) {
    requestCount = 0;
    currentKeyIndex = (currentKeyIndex + 1) % TMDB_API_KEYS.length;
    console.log(`🔄 Rotacionando para API Key ${currentKeyIndex + 1}/${TMDB_API_KEYS.length}`);
  }
  return TMDB_API_KEYS[currentKeyIndex];
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// FUNCOES DE API TMDB
// ============================================

async function tmdbFetch(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const apiKey = getNextApiKey();
  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('language', 'pt-BR');
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  try {
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log('⚠️ Rate limit atingido, aguardando 10s...');
        await sleep(10000);
        return tmdbFetch(endpoint, params);
      }
      throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`❌ Erro ao buscar ${endpoint}:`, error);
    throw error;
  }
}

async function getPopularMovies(page: number = 1): Promise<any> {
  return tmdbFetch('/movie/popular', { page: page.toString() });
}

async function getPopularTVShows(page: number = 1): Promise<any> {
  return tmdbFetch('/tv/popular', { page: page.toString() });
}

async function getTopRatedMovies(page: number = 1): Promise<any> {
  return tmdbFetch('/movie/top_rated', { page: page.toString() });
}

async function getTopRatedTVShows(page: number = 1): Promise<any> {
  return tmdbFetch('/tv/top_rated', { page: page.toString() });
}

async function getTrendingMovies(page: number = 1): Promise<any> {
  return tmdbFetch('/trending/movie/week', { page: page.toString() });
}

async function getTrendingTVShows(page: number = 1): Promise<any> {
  return tmdbFetch('/trending/tv/week', { page: page.toString() });
}

async function getMovieDetails(movieId: number): Promise<any> {
  return tmdbFetch(`/movie/${movieId}`, {
    append_to_response: 'credits,videos,images,release_dates',
    include_image_language: 'pt,en,null'
  });
}

async function getTVShowDetails(tvId: number): Promise<any> {
  return tmdbFetch(`/tv/${tvId}`, {
    append_to_response: 'credits,videos,images,content_ratings',
    include_image_language: 'pt,en,null'
  });
}

async function getTVSeasonDetails(tvId: number, seasonNumber: number): Promise<any> {
  return tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`);
}

// ============================================
// FUNCOES DE PROCESSAMENTO
// ============================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getOrCreateGenre(name: string): Promise<number> {
  const slug = slugify(name);
  
  let genre = await prisma.genre.findUnique({ where: { slug } });
  
  if (!genre) {
    genre = await prisma.genre.create({
      data: { name, slug }
    });
  }
  
  return genre.id;
}

async function getOrCreatePerson(data: {
  name: string;
  tmdbId?: number;
  birthday?: string | null;
  deathday?: string | null;
  gender?: number;
  profilePath?: string | null;
  popularity?: number;
}): Promise<number> {
  // Tentar encontrar por nome (TMDB nao tem ID unico para pessoas em credits)
  const existing = await prisma.person.findFirst({ 
    where: { name: data.name } 
  });
  
  if (existing) return existing.id;

  // Criar nova pessoa
  const person = await prisma.person.create({
    data: {
      name: data.name,
      birthday: data.birthday || undefined,
      deathday: data.deathday || undefined,
      gender: data.gender || 0,
      profilePath: data.profilePath ? `${TMDB_IMAGE_BASE}/w185${data.profilePath}` : undefined,
      popularity: data.popularity || undefined,
    }
  });

  return person.id;
}

// ============================================
// FUNCAO PRINCIPAL DE PROCESSAMENTO DE FILME
// ============================================

async function processMovie(tmdbMovie: any): Promise<void> {
  console.log(`\n🎬 Processando filme: ${tmdbMovie.title} (${tmdbMovie.release_date?.split('-')[0] || 'N/A'})`);

  try {
    // Buscar detalhes completos
    const details = await getMovieDetails(tmdbMovie.id);
    await sleep(DELAY_BETWEEN_REQUESTS);

    // Verificar se ja existe no banco
    let content = await prisma.content.findFirst({
      where: { 
        OR: [
          { tmdbId: tmdbMovie.id },
          { title: tmdbMovie.title }
        ]
      }
    });

    const contentData = {
      tmdbId: tmdbMovie.id,
      title: tmdbMovie.title,
      originalTitle: tmdbMovie.original_title,
      type: 'movie',
      overview: tmdbMovie.overview || details.overview,
      posterPath: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE}/w500${tmdbMovie.poster_path}` : undefined,
      backdropPath: tmdbMovie.backdrop_path ? `${TMDB_IMAGE_BASE}/original${tmdbMovie.backdrop_path}` : undefined,
      releaseDate: tmdbMovie.release_date,
      runtime: details.runtime,
      voteAverage: tmdbMovie.vote_average || 0,
      voteCount: tmdbMovie.vote_count || 0,
      genres: details.genres?.map((g: any) => g.name).join(', ') || '',
      country: details.production_countries?.[0]?.name || '',
      language: details.original_language || '',
      popularity: tmdbMovie.popularity,
      featured: tmdbMovie.vote_average >= 7.5,
      active: true,
    };

    if (content) {
      // Atualizar registro existente (manter imagens existentes se houver)
      await prisma.content.update({
        where: { id: content.id },
        data: {
          ...contentData,
          posterPath: content.posterPath || contentData.posterPath,
          backdropPath: content.backdropPath || contentData.backdropPath,
        }
      });
      console.log(`  ✓ Atualizado (ID: ${content.id})`);
    } else {
      // Criar novo registro
      content = await prisma.content.create({ data: contentData });
      console.log(`  ✓ Criado (ID: ${content.id})`);
    }

    // Processar generos
    if (details.genres) {
      for (const genre of details.genres) {
        try {
          const genreId = await getOrCreateGenre(genre.name);
          await prisma.contentGenre.upsert({
            where: { contentId_genreId: { contentId: content.id, genreId } },
            update: {},
            create: { contentId: content.id, genreId }
          });
        } catch (e) {
          // Ignorar erros de duplicata
        }
      }
    }

    // Processar elenco (cast)
    if (details.credits?.cast) {
      const mainCast = details.credits.cast.slice(0, 15); // Top 15 atores
      let order = 0;
      
      for (const actor of mainCast) {
        try {
          const personId = await getOrCreatePerson({
            name: actor.name,
            gender: actor.gender,
            profilePath: actor.profile_path,
            popularity: actor.popularity
          });
          
          await prisma.credit.upsert({
            where: {
              contentId_personId_department_job_character: {
                contentId: content.id,
                personId,
                department: 'Acting',
                job: 'Actor',
                character: actor.character || ''
              }
            },
            update: { creditOrder: order },
            create: {
              contentId: content.id,
              personId,
              department: 'Acting',
              job: 'Actor',
              character: actor.character || '',
              creditOrder: order
            }
          });
          order++;
        } catch (e) {
          // Ignorar erros
        }
      }
      console.log(`  ✓ Elenco: ${mainCast.length} atores`);
    }

    // Processar diretores e escritores (crew)
    if (details.credits?.crew) {
      const directors = details.credits.crew.filter((c: any) => c.job === 'Director');
      const writers = details.credits.crew.filter((c: any) => 
        c.job === 'Writer' || c.job === 'Screenplay' || c.job === 'Story'
      );

      // Diretores
      let dirOrder = 0;
      for (const director of directors) {
        try {
          const personId = await getOrCreatePerson({
            name: director.name,
            gender: director.gender,
            profilePath: director.profile_path
          });
          
          await prisma.credit.upsert({
            where: {
              contentId_personId_department_job_character: {
                contentId: content.id,
                personId,
                department: 'Directing',
                job: 'Director',
                character: ''
              }
            },
            update: { creditOrder: dirOrder },
            create: {
              contentId: content.id,
              personId,
              department: 'Directing',
              job: 'Director',
              creditOrder: dirOrder
            }
          });
          dirOrder++;
        } catch (e) {
          // Ignorar erros
        }
      }
      if (directors.length > 0) {
        console.log(`  ✓ Diretores: ${directors.map((d: any) => d.name).join(', ')}`);
      }

      // Escritores
      let writerOrder = 0;
      for (const writer of writers.slice(0, 5)) {
        try {
          const personId = await getOrCreatePerson({
            name: writer.name,
            gender: writer.gender,
            profilePath: writer.profile_path
          });
          
          await prisma.credit.upsert({
            where: {
              contentId_personId_department_job_character: {
                contentId: content.id,
                personId,
                department: 'Writing',
                job: writer.job,
                character: ''
              }
            },
            update: { creditOrder: writerOrder },
            create: {
              contentId: content.id,
              personId,
              department: 'Writing',
              job: writer.job,
              creditOrder: writerOrder
            }
          });
          writerOrder++;
        } catch (e) {
          // Ignorar erros
        }
      }
    }

    // Processar trailer
    if (details.videos?.results) {
      const trailer = details.videos.results.find((v: any) => 
        v.type === 'Trailer' && v.site === 'YouTube'
      );
      if (trailer) {
        await prisma.content.update({
          where: { id: content.id },
          data: { trailerUrl: `https://www.youtube.com/watch?v=${trailer.key}` }
        });
      }
    }

    // Processar logo (se disponivel)
    if (details.images?.logos && details.images.logos.length > 0) {
      const logo = details.images.logos.find((l: any) => l.iso_639_1 === 'pt') || 
                   details.images.logos.find((l: any) => l.iso_639_1 === 'en') ||
                   details.images.logos[0];
      if (logo) {
        await prisma.content.update({
          where: { id: content.id },
          data: { logoPath: `${TMDB_IMAGE_BASE}/w500${logo.file_path}` }
        });
      }
    }

  } catch (error) {
    console.error(`  ❌ Erro ao processar ${tmdbMovie.title}:`, error);
  }
}

// ============================================
// FUNCAO PRINCIPAL DE PROCESSAMENTO DE SERIE
// ============================================

async function processTVShow(tmdbShow: any): Promise<void> {
  console.log(`\n📺 Processando serie: ${tmdbShow.name} (${tmdbShow.first_air_date?.split('-')[0] || 'N/A'})`);

  try {
    // Buscar detalhes completos
    const details = await getTVShowDetails(tmdbShow.id);
    await sleep(DELAY_BETWEEN_REQUESTS);

    // Verificar se ja existe no banco
    let content = await prisma.content.findFirst({
      where: { 
        OR: [
          { tmdbId: tmdbShow.id },
          { title: tmdbShow.name }
        ]
      }
    });

    const contentData = {
      tmdbId: tmdbShow.id,
      title: tmdbShow.name,
      originalTitle: tmdbShow.original_name,
      type: 'series',
      overview: tmdbShow.overview || details.overview,
      posterPath: tmdbShow.poster_path ? `${TMDB_IMAGE_BASE}/w500${tmdbShow.poster_path}` : undefined,
      backdropPath: tmdbShow.backdrop_path ? `${TMDB_IMAGE_BASE}/original${tmdbShow.backdrop_path}` : undefined,
      releaseDate: tmdbShow.first_air_date,
      runtime: details.episode_run_time?.[0] || null,
      voteAverage: tmdbShow.vote_average || 0,
      voteCount: tmdbShow.vote_count || 0,
      genres: details.genres?.map((g: any) => g.name).join(', ') || '',
      country: details.origin_country?.[0] || '',
      language: details.original_language || '',
      popularity: tmdbShow.popularity,
      featured: tmdbShow.vote_average >= 7.5,
      active: true,
    };

    if (content) {
      // Atualizar registro existente (manter imagens existentes se houver)
      await prisma.content.update({
        where: { id: content.id },
        data: {
          ...contentData,
          posterPath: content.posterPath || contentData.posterPath,
          backdropPath: content.backdropPath || contentData.backdropPath,
        }
      });
      console.log(`  ✓ Atualizado (ID: ${content.id})`);
    } else {
      // Criar novo registro
      content = await prisma.content.create({ data: contentData });
      console.log(`  ✓ Criado (ID: ${content.id})`);
    }

    // Processar generos
    if (details.genres) {
      for (const genre of details.genres) {
        try {
          const genreId = await getOrCreateGenre(genre.name);
          await prisma.contentGenre.upsert({
            where: { contentId_genreId: { contentId: content.id, genreId } },
            update: {},
            create: { contentId: content.id, genreId }
          });
        } catch (e) {
          // Ignorar erros de duplicata
        }
      }
    }

    // Processar elenco (cast)
    if (details.credits?.cast) {
      const mainCast = details.credits.cast.slice(0, 15); // Top 15 atores
      let order = 0;
      
      for (const actor of mainCast) {
        try {
          const personId = await getOrCreatePerson({
            name: actor.name,
            gender: actor.gender,
            profilePath: actor.profile_path,
            popularity: actor.popularity
          });
          
          await prisma.credit.upsert({
            where: {
              contentId_personId_department_job_character: {
                contentId: content.id,
                personId,
                department: 'Acting',
                job: 'Actor',
                character: actor.character || ''
              }
            },
            update: { creditOrder: order },
            create: {
              contentId: content.id,
              personId,
              department: 'Acting',
              job: 'Actor',
              character: actor.character || '',
              creditOrder: order
            }
          });
          order++;
        } catch (e) {
          // Ignorar erros
        }
      }
      console.log(`  ✓ Elenco: ${mainCast.length} atores`);
    }

    // Processar criadores
    if (details.created_by) {
      let creatorOrder = 0;
      for (const creator of details.created_by) {
        try {
          const personId = await getOrCreatePerson({
            name: creator.name,
            gender: creator.gender,
            profilePath: creator.profile_path
          });
          
          await prisma.credit.upsert({
            where: {
              contentId_personId_department_job_character: {
                contentId: content.id,
                personId,
                department: 'Creator',
                job: 'Creator',
                character: ''
              }
            },
            update: { creditOrder: creatorOrder },
            create: {
              contentId: content.id,
              personId,
              department: 'Creator',
              job: 'Creator',
              creditOrder: creatorOrder
            }
          });
          creatorOrder++;
        } catch (e) {
          // Ignorar erros
        }
      }
      if (details.created_by.length > 0) {
        console.log(`  ✓ Criadores: ${details.created_by.map((c: any) => c.name).join(', ')}`);
      }
    }

    // Processar trailer
    if (details.videos?.results) {
      const trailer = details.videos.results.find((v: any) => 
        v.type === 'Trailer' && v.site === 'YouTube'
      );
      if (trailer) {
        await prisma.content.update({
          where: { id: content.id },
          data: { trailerUrl: `https://www.youtube.com/watch?v=${trailer.key}` }
        });
      }
    }

    // Processar logo (se disponivel)
    if (details.images?.logos && details.images.logos.length > 0) {
      const logo = details.images.logos.find((l: any) => l.iso_639_1 === 'pt') || 
                   details.images.logos.find((l: any) => l.iso_639_1 === 'en') ||
                   details.images.logos[0];
      if (logo) {
        await prisma.content.update({
          where: { id: content.id },
          data: { logoPath: `${TMDB_IMAGE_BASE}/w500${logo.file_path}` }
        });
      }
    }

    // Processar temporadas e episodios
    if (details.seasons && details.seasons.length > 0) {
      for (const season of details.seasons) {
        if (season.season_number === 0) continue; // Pular "Specials"

        try {
          // Buscar detalhes da temporada
          const seasonDetails = await getTVSeasonDetails(tmdbShow.id, season.season_number);
          await sleep(DELAY_BETWEEN_REQUESTS);

          // Criar ou atualizar temporada
          let dbSeason = await prisma.season.findFirst({
            where: { contentId: content.id, seasonNumber: season.season_number }
          });

          if (!dbSeason) {
            dbSeason = await prisma.season.create({
              data: {
                contentId: content.id,
                seasonNumber: season.season_number,
                name: season.name || `Temporada ${season.season_number}`,
                overview: season.overview || undefined,
                posterPath: season.poster_path ? `${TMDB_IMAGE_BASE}/w500${season.poster_path}` : undefined,
                airDate: season.air_date || undefined
              }
            });
          } else {
            await prisma.season.update({
              where: { id: dbSeason.id },
              data: {
                name: season.name || dbSeason.name,
                overview: season.overview || dbSeason.overview,
                posterPath: season.poster_path ? `${TMDB_IMAGE_BASE}/w500${season.poster_path}` : dbSeason.posterPath,
                airDate: season.air_date || dbSeason.airDate
              }
            });
          }

          // Criar episodios
          if (seasonDetails.episodes) {
            for (const ep of seasonDetails.episodes) {
              try {
                await prisma.episode.upsert({
                  where: {
                    contentId_seasonNumber_episodeNumber: {
                      contentId: content.id,
                      seasonNumber: ep.season_number,
                      episodeNumber: ep.episode_number
                    }
                  },
                  update: {
                    name: ep.name,
                    overview: ep.overview || undefined,
                    stillPath: ep.still_path ? `${TMDB_IMAGE_BASE}/w500${ep.still_path}` : undefined,
                    airDate: ep.air_date || undefined,
                    runtime: ep.runtime || undefined
                  },
                  create: {
                    seasonId: dbSeason.id,
                    contentId: content.id,
                    seasonNumber: ep.season_number,
                    episodeNumber: ep.episode_number,
                    name: ep.name,
                    overview: ep.overview || undefined,
                    stillPath: ep.still_path ? `${TMDB_IMAGE_BASE}/w500${ep.still_path}` : undefined,
                    airDate: ep.air_date || undefined,
                    runtime: ep.runtime || undefined
                  }
                });
              } catch (e) {
                // Ignorar erros de duplicata
              }
            }
          }
        } catch (e) {
          console.error(`  ⚠️ Erro ao processar temporada ${season.season_number}:`, e);
        }
      }
      console.log(`  ✓ Temporadas: ${details.seasons.filter((s: any) => s.season_number > 0).length}`);
    }

  } catch (error) {
    console.error(`  ❌ Erro ao processar ${tmdbShow.name}:`, error);
  }
}

// ============================================
// FUNCAO PRINCIPAL
// ============================================

async function main() {
  console.log('🎬 Iniciando ingestao de dados do TMDB...\n');
  console.log('APIs utilizadas:');
  console.log('  - TMDB API (themoviedb.org)');
  console.log(`  - ${TMDB_API_KEYS.length} chaves com rotacao automatica\n`);

  const TARGET_MOVIES = 500;
  const TARGET_SERIES = 500;
  const ITEMS_PER_PAGE = 20;

  let moviesProcessed = 0;
  let seriesProcessed = 0;
  const processedMovieIds = new Set<number>();
  const processedSeriesIds = new Set<number>();

  // ============================================
  // PROCESSAR FILMES
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('🎬 PROCESSANDO FILMES');
  console.log('='.repeat(50));

  // Buscar filmes de varias fontes para diversidade
  const movieSources = [
    { name: 'Popular', fetch: getPopularMovies },
    { name: 'Top Rated', fetch: getTopRatedMovies },
    { name: 'Trending', fetch: getTrendingMovies },
  ];

  for (const source of movieSources) {
    if (moviesProcessed >= TARGET_MOVIES) break;

    console.log(`\n📊 Buscando filmes ${source.name}...`);
    
    for (let page = 1; page <= 25 && moviesProcessed < TARGET_MOVIES; page++) {
      try {
        const response = await source.fetch(page);
        await sleep(DELAY_BETWEEN_REQUESTS);

        for (const movie of response.results) {
          if (moviesProcessed >= TARGET_MOVIES) break;
          if (processedMovieIds.has(movie.id)) continue;

          processedMovieIds.add(movie.id);
          await processMovie(movie);
          moviesProcessed++;

          // Progresso a cada 50 filmes
          if (moviesProcessed % 50 === 0) {
            console.log(`\n📈 Progresso filmes: ${moviesProcessed}/${TARGET_MOVIES}\n`);
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar pagina ${page} de ${source.name}:`, error);
      }
    }
  }

  // ============================================
  // PROCESSAR SERIES
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('📺 PROCESSANDO SERIES');
  console.log('='.repeat(50));

  // Buscar series de varias fontes para diversidade
  const seriesSources = [
    { name: 'Popular', fetch: getPopularTVShows },
    { name: 'Top Rated', fetch: getTopRatedTVShows },
    { name: 'Trending', fetch: getTrendingTVShows },
  ];

  for (const source of seriesSources) {
    if (seriesProcessed >= TARGET_SERIES) break;

    console.log(`\n📊 Buscando series ${source.name}...`);
    
    for (let page = 1; page <= 25 && seriesProcessed < TARGET_SERIES; page++) {
      try {
        const response = await source.fetch(page);
        await sleep(DELAY_BETWEEN_REQUESTS);

        for (const show of response.results) {
          if (seriesProcessed >= TARGET_SERIES) break;
          if (processedSeriesIds.has(show.id)) continue;

          processedSeriesIds.add(show.id);
          await processTVShow(show);
          seriesProcessed++;

          // Progresso a cada 50 series
          if (seriesProcessed % 50 === 0) {
            console.log(`\n📈 Progresso series: ${seriesProcessed}/${TARGET_SERIES}\n`);
          }
        }
      } catch (error) {
        console.error(`Erro ao buscar pagina ${page} de ${source.name}:`, error);
      }
    }
  }

  // ============================================
  // RESUMO FINAL
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('📊 RESUMO DA INGESTAO');
  console.log('='.repeat(50));
  console.log(`Filmes processados: ${moviesProcessed}`);
  console.log(`Series processadas: ${seriesProcessed}`);
  
  // Estatisticas finais
  const contentCount = await prisma.content.count();
  const genreCount = await prisma.genre.count();
  const personCount = await prisma.person.count();
  const creditCount = await prisma.credit.count();
  const seasonCount = await prisma.season.count();
  const episodeCount = await prisma.episode.count();

  console.log('\n📈 ESTATISTICAS DO BANCO:');
  console.log(`  - Conteudos: ${contentCount}`);
  console.log(`  - Generos: ${genreCount}`);
  console.log(`  - Pessoas: ${personCount}`);
  console.log(`  - Creditos: ${creditCount}`);
  console.log(`  - Temporadas: ${seasonCount}`);
  console.log(`  - Episodios: ${episodeCount}`);
  console.log('='.repeat(50));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
