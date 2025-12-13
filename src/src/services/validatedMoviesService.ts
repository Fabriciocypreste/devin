// ========================================
// 🎬 VALIDATED MOVIES SERVICE
// ========================================
// Serviço para carregar filmes validados e enriquecer com TMDB

import { FILMES_VALIDADOS } from '../data/filmesValidados';
import { enrichMovie, type EnrichedContent } from './tmdbService';

export interface ValidatedMovie {
  id: string;
  title: string;
  year: number;
  streamUrl: string;
  logoUrl: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  tmdbId?: number;
  media_type: 'movie';
  release_date?: string;
  category?: string;
  
  // Novas propriedades com imagens completas
  logo_url?: string;
  all_posters?: string[];
  all_backdrops?: string[];
  all_logos?: string[];
  genres?: string[];
  runtime?: number;
  status?: string;
  tagline?: string;
}

/**
 * Extrai o ano do título
 * Exemplos: "Silvio (2024)" -> 2024
 */
const extractYear = (title: string): number => {
  const yearMatch = title.match(/\((\d{4})\)/);
  return yearMatch ? parseInt(yearMatch[1]) : new Date().getFullYear();
};

/**
 * Remove o ano do título
 * Exemplo: "Silvio (2024)" -> "Silvio"
 */
const cleanTitle = (title: string): string => {
  return title.replace(/\s*\(\d{4}\)\s*$/, '').trim();
};

/**
 * Busca informações do filme no TMDB
 */
const searchTMDB = async (title: string, year: number): Promise<any | null> => {
  try {
    const cleanedTitle = cleanTitle(title);
    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanedTitle)}&year=${year}&language=pt-BR`;
    
    console.log(`🔍 TMDB: Buscando "${cleanedTitle}" (${year})`);
    
    const response = await fetch(searchUrl);
    if (!response.ok) {
      console.warn(`⚠️ TMDB: Erro na busca - ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const movie = data.results[0];
      console.log(`✅ TMDB: Encontrado - ${movie.title} (${movie.release_date?.split('-')[0]})`);
      return movie;
    }
    
    // Se não encontrou com o ano, tenta sem
    const searchUrlNoYear = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanedTitle)}&language=pt-BR`;
    const responseNoYear = await fetch(searchUrlNoYear);
    
    if (responseNoYear.ok) {
      const dataNoYear = await responseNoYear.json();
      if (dataNoYear.results && dataNoYear.results.length > 0) {
        const movie = dataNoYear.results[0];
        console.log(`✅ TMDB: Encontrado (sem ano) - ${movie.title}`);
        return movie;
      }
    }
    
    console.log(`❌ TMDB: Não encontrado - "${cleanedTitle}"`);
    return null;
  } catch (error) {
    console.error(`❌ TMDB: Erro ao buscar "${title}":`, error);
    return null;
  }
};

/**
 * Carrega filmes validados e enriquece com TMDB
 */
export const loadValidatedMovies = async (enrichWithTMDB: boolean = true): Promise<ValidatedMovie[]> => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎬 CARREGANDO FILMES VALIDADOS (DADOS EMBUTIDOS)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  try {
    // 1. Usar dados embutidos diretamente
    console.log(`✅ Dados embutidos carregados: ${FILMES_VALIDADOS.length} filmes`);
    
    // 2. Converter para formato ValidatedMovie
    const movies: ValidatedMovie[] = FILMES_VALIDADOS.map((filme, index) => {
      const year = extractYear(filme.titulo);
      const cleanedTitle = cleanTitle(filme.titulo);
      
      return {
        id: `validated-${index}-${Date.now()}`,
        title: cleanedTitle,
        year,
        streamUrl: filme.url,
        logoUrl: '', // Será preenchido pelo TMDB
        media_type: 'movie',
        category: 'Filmes Nacionais',
      };
    });
    
    console.log(`✅ Filmes convertidos: ${movies.length}`);
    
    if (!enrichWithTMDB) {
      console.log('⏭️  Enriquecimento TMDB desabilitado');
      return movies;
    }
    
    // 3. Enriquecer com TMDB (NOVO MÉTODO COM LOGOS)
    console.log('🎨 Enriquecendo com TMDB (Imagens + Logos + Release)...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const enrichedMovies: ValidatedMovie[] = [];
    let successCount = 0;
    let failCount = 0;
    
    // Processar em batches de 5 para não sobrecarregar a API
    const BATCH_SIZE = 5;
    for (let i = 0; i < movies.length; i += BATCH_SIZE) {
      const batch = movies.slice(i, i + BATCH_SIZE);
      
      const enrichedBatch = await Promise.all(
        batch.map(async (movie) => {
          // Usar novo serviço TMDB com imagens completas
          const enrichedData = await enrichMovie(movie.title, movie.year);
          
          if (enrichedData) {
            successCount++;
            return {
              ...movie,
              tmdbId: enrichedData.tmdbId,
              
              // Imagens principais
              poster_path: enrichedData.poster_url,
              backdrop_path: enrichedData.backdrop_url,
              logoUrl: enrichedData.logo_url || enrichedData.poster_url, // Logo ou poster como fallback
              logo_url: enrichedData.logo_url,
              
              // Todas as imagens alternativas
              all_posters: enrichedData.all_posters,
              all_backdrops: enrichedData.all_backdrops,
              all_logos: enrichedData.all_logos,
              
              // Dados extras
              overview: enrichedData.overview || `Filme brasileiro de ${movie.year}`,
              vote_average: enrichedData.vote_average || 7.0,
              release_date: enrichedData.release_date || `${movie.year}-01-01`,
              genres: enrichedData.genres,
              runtime: enrichedData.runtime,
              status: enrichedData.status,
              tagline: enrichedData.tagline,
            };
          } else {
            failCount++;
            // Retorna sem imagens, mas com dados básicos
            return {
              ...movie,
              poster_path: '',
              backdrop_path: '',
              logoUrl: '',
              logo_url: '',
              all_posters: [],
              all_backdrops: [],
              all_logos: [],
              overview: `Filme brasileiro de ${movie.year}`,
              vote_average: 7.0,
              release_date: `${movie.year}-01-01`,
              genres: [],
            };
          }
        })
      );
      
      enrichedMovies.push(...enrichedBatch);
      
      // Log de progresso
      console.log(`📊 Progresso: ${enrichedMovies.length}/${movies.length} (${successCount} ✅ | ${failCount} ❌)`);
      
      // Delay para não sobrecarregar API (250ms entre batches)
      if (i + BATCH_SIZE < movies.length) {
        await new Promise(resolve => setTimeout(resolve, 250));
      }
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ ENRIQUECIMENTO COMPLETO!`);
    console.log(`📊 Sucesso: ${successCount}/${movies.length}`);
    console.log(`📊 Falha: ${failCount}/${movies.length}`);
    console.log(`📊 Taxa de sucesso: ${((successCount / movies.length) * 100).toFixed(1)}%`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    return enrichedMovies;
    
  } catch (error) {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERRO AO CARREGAR FILMES VALIDADOS:', error);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    return [];
  }
};

/**
 * Carrega apenas um filme por categoria (para teste rápido)
 */
export const loadValidatedMoviesQuick = async (): Promise<ValidatedMovie[]> => {
  console.log('⚡ MODO RÁPIDO: Carregando sem enriquecimento TMDB');
  return loadValidatedMovies(false);
};