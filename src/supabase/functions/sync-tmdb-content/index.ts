// =====================================================
// RedFlix Edge Function - sync-tmdb-content
// Sincroniza conteúdos do TMDB para o banco Supabase
// =====================================================
// Deploy: supabase functions deploy sync-tmdb-content
// Invoke: curl -X POST https://<project-ref>.supabase.co/functions/v1/sync-tmdb-content \
//   -H "Authorization: Bearer <anon-key>" \
//   -H "Content-Type: application/json" \
//   -d '{"tmdb_ids": [299534, 1396], "media_type": "movie"}'
// =====================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

// =====================================================
// TIPOS
// =====================================================

interface SyncRequest {
  tmdb_ids?: number[];
  media_type?: 'movie' | 'tv';
  sync_all?: boolean; // Sincronizar conteúdos populares
  limit?: number;
}

interface TMDBMovie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Array<{ id: number; name: string }>;
  release_date: string;
  runtime: number;
  vote_average: number;
  vote_count: number;
  popularity: number;
  adult: boolean;
}

interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: Array<{ id: number; name: string }>;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
}

// =====================================================
// FUNÇÃO PRINCIPAL
// =====================================================

serve(async (req) => {
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validar método
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse body
    const body: SyncRequest = await req.json();

    // Validações
    if (!body.sync_all && (!body.tmdb_ids || body.tmdb_ids.length === 0)) {
      return new Response(
        JSON.stringify({ error: 'Forneça tmdb_ids ou sync_all=true' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar cliente Supabase com SERVICE_ROLE_KEY
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const tmdbApiKey = Deno.env.get('TMDB_API_KEY');

    if (!supabaseUrl || !supabaseServiceKey || !tmdbApiKey) {
      return new Response(
        JSON.stringify({ error: 'Variáveis de ambiente não configuradas' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let idsToSync: number[] = [];

    // Se sync_all, buscar conteúdos populares do TMDB
    if (body.sync_all) {
      const popularMovies = await fetchPopularContent('movie', tmdbApiKey, body.limit || 20);
      const popularTVShows = await fetchPopularContent('tv', tmdbApiKey, body.limit || 20);
      idsToSync = [...popularMovies, ...popularTVShows];
    } else {
      idsToSync = body.tmdb_ids!;
    }

    const results = [];
    const errors = [];

    // Sincronizar cada ID
    for (const tmdbId of idsToSync) {
      try {
        const mediaType = body.media_type || 'movie';
        const content = mediaType === 'movie'
          ? await fetchMovieDetails(tmdbId, tmdbApiKey)
          : await fetchTVShowDetails(tmdbId, tmdbApiKey);

        if (!content) {
          errors.push({ tmdb_id: tmdbId, error: 'Conteúdo não encontrado no TMDB' });
          continue;
        }

        // Inserir/atualizar no banco
        const { data, error } = await supabase.rpc('update_content_from_tmdb', {
          p_tmdb_id: content.tmdb_id,
          p_media_type: content.media_type,
          p_title: content.title,
          p_original_title: content.original_title,
          p_overview: content.overview,
          p_poster_path: content.poster_path,
          p_backdrop_path: content.backdrop_path,
          p_genres: content.genres,
          p_release_date: content.release_date,
          p_runtime: content.runtime,
          p_vote_average: content.vote_average,
          p_vote_count: content.vote_count,
          p_popularity: content.popularity,
        });

        if (error) {
          console.error(`Erro ao sincronizar TMDB ID ${tmdbId}:`, error);
          errors.push({ tmdb_id: tmdbId, error: error.message });
        } else {
          results.push({ tmdb_id: tmdbId, content_id: data, status: 'synced' });
        }
      } catch (err) {
        console.error(`Erro ao processar TMDB ID ${tmdbId}:`, err);
        errors.push({ tmdb_id: tmdbId, error: err.message });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        synced: results.length,
        errors: errors.length,
        results,
        errors,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Erro geral na Edge Function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// =====================================================
// FUNÇÕES AUXILIARES - TMDB API
// =====================================================

async function fetchMovieDetails(tmdbId: number, apiKey: string): Promise<any> {
  const url = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=pt-BR`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`TMDB API error (movie ${tmdbId}):`, response.statusText);
    return null;
  }

  const movie: TMDBMovie = await response.json();

  // Filtrar adulto
  if (movie.adult) {
    console.log(`Filme ${tmdbId} marcado como adulto - pulando`);
    return null;
  }

  return {
    tmdb_id: movie.id,
    media_type: 'movie',
    title: movie.title,
    original_title: movie.original_title,
    overview: movie.overview || '',
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    genres: movie.genres.map((g) => g.name),
    release_date: movie.release_date || null,
    runtime: movie.runtime || null,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count,
    popularity: movie.popularity,
  };
}

async function fetchTVShowDetails(tmdbId: number, apiKey: string): Promise<any> {
  const url = `https://api.themoviedb.org/3/tv/${tmdbId}?api_key=${apiKey}&language=pt-BR`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`TMDB API error (tv ${tmdbId}):`, response.statusText);
    return null;
  }

  const tv: TMDBTVShow = await response.json();

  return {
    tmdb_id: tv.id,
    media_type: 'tv',
    title: tv.name,
    original_title: tv.original_name,
    overview: tv.overview || '',
    poster_path: tv.poster_path,
    backdrop_path: tv.backdrop_path,
    genres: tv.genres.map((g) => g.name),
    release_date: tv.first_air_date || null,
    runtime: null, // Séries não têm runtime fixo
    vote_average: tv.vote_average,
    vote_count: tv.vote_count,
    popularity: tv.popularity,
  };
}

async function fetchPopularContent(
  mediaType: 'movie' | 'tv',
  apiKey: string,
  limit: number
): Promise<number[]> {
  const url = `https://api.themoviedb.org/3/${mediaType}/popular?api_key=${apiKey}&language=pt-BR&page=1`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`TMDB API error (popular ${mediaType}):`, response.statusText);
    return [];
  }

  const data = await response.json();
  return data.results.slice(0, limit).map((item: any) => item.id);
}

// =====================================================
// OBSERVAÇÕES
// =====================================================

// 1. DEPLOY:
//    supabase functions deploy sync-tmdb-content --no-verify-jwt
//
// 2. SECRETS (configure via Supabase Dashboard ou CLI):
//    supabase secrets set TMDB_API_KEY=<sua-chave>
//    As variáveis SUPABASE_URL, SUPABASE_ANON_KEY e SUPABASE_SERVICE_ROLE_KEY
//    são injetadas automaticamente pelo Supabase
//
// 3. EXEMPLO DE CHAMADA (frontend):
//    const { data, error } = await fetch(
//      `https://${projectId}.supabase.co/functions/v1/sync-tmdb-content`,
//      {
//        method: 'POST',
//        headers: {
//          'Authorization': `Bearer ${publicAnonKey}`,
//          'Content-Type': 'application/json'
//        },
//        body: JSON.stringify({
//          tmdb_ids: [299534, 1396],
//          media_type: 'movie'
//        })
//      }
//    );
//
// 4. SYNC_ALL (sincronizar conteúdos populares):
//    body: JSON.stringify({ sync_all: true, limit: 50 })
//
// 5. AGENDAMENTO (via cron ou webhook):
//    Configure um webhook ou GitHub Action para chamar esta função
//    periodicamente e manter o catálogo atualizado
