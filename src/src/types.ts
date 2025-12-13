// ========================================
// 📦 TIPOS BASE DO REDFLIX
// ========================================
// Este arquivo define os tipos fundamentais
// usados em toda a aplicação RedFlix

/**
 * Interface base de um filme/série/canal
 * Criado a partir do parsing do filmes.txt
 * Compatível com o formato usado internamente no App
 */
export interface Movie {
  // Campos do iptvService (base)
  id: string | number; // Flexível para aceitar string ou number
  category?: string;
  title?: string;
  logoUrl?: string;
  streamUrl?: string;
  year?: number;

  // Campos do formato interno do App (compatibilidade)
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
  media_type?: 'movie' | 'tv';
  release_date?: string;
  episodes?: any[];
  genre_ids?: number[];
}

/**
 * Item da lista "Minha Lista"
 */
export interface MyListItem {
  movie: Movie;
  addedAt: number;
}

/**
 * Categoria de filmes/séries
 */
export interface Category {
  title: string;
  movies: Movie[];
}

// ========================================
// 🎬 TIPOS DO TMDB (The Movie Database)
// ========================================

/**
 * Resultado de busca do TMDB
 */
export interface TmdbSearchResult {
  id: number;
  media_type: 'movie' | 'tv';
  name?: string; // Para TV
  title?: string; // Para Movie
  poster_path: string | null;
  backdrop_path: string | null;
}

/**
 * Vídeo/Trailer do TMDB
 */
export interface TmdbVideo {
  key: string;
  site: 'YouTube';
  type: 'Trailer' | 'Teaser' | 'Clip' | 'Featurette';
  official: boolean;
}

/**
 * Gênero do TMDB
 */
export interface TmdbGenre {
  id: number;
  name: string;
}

/**
 * Detalhes base do TMDB (comum a filmes e séries)
 */
export interface TmdbBaseDetails {
  id: number;
  overview: string;
  backdrop_path: string | null;
  poster_path: string | null;
  vote_average: number;
  genres: TmdbGenre[];
}

/**
 * Detalhes de filme do TMDB
 */
export interface TmdbMovieDetails extends TmdbBaseDetails {
  title: string;
  release_date: string;
}

/**
 * Detalhes de série do TMDB
 */
export interface TmdbTvDetails extends TmdbBaseDetails {
  name: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
}

/**
 * Union type: Detalhes de filme OU série
 */
export type TmdbDetails = TmdbMovieDetails | TmdbTvDetails;
