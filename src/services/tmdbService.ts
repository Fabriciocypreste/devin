import axios from 'axios';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_API_KEY_HERE'; // Fallback to avoid crash if missing
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'pt-BR', // Default to Portuguese as per context
  },
});

export const getImageUrl = (path: string | null, size: 'poster' | 'backdrop' = 'poster') => {
  if (!path) return null;
  const baseUrl = size === 'poster' ? IMAGE_BASE_URL : BACKDROP_BASE_URL;
  return `${baseUrl}${path}`;
};

export const tmdbService = {
  searchMulti: async (query: string) => {
    try {
      const response = await tmdbClient.get('/search/multi', {
        params: { query, include_adult: false },
      });
      return response.data.results;
    } catch (error) {
      console.error('TMDB Search Error:', error);
      return [];
    }
  },

  getTrending: async (timeWindow: 'day' | 'week' = 'week') => {
    const response = await tmdbClient.get(`/trending/all/${timeWindow}`);
    return response.data.results;
  },

  getPopularMovies: async () => {
    const response = await tmdbClient.get('/movie/popular');
    return response.data.results;
  },

  getTopRatedMovies: async () => {
    const response = await tmdbClient.get('/movie/top_rated');
    return response.data.results;
  },

  getUpcomingMovies: async () => { // 2025 releases logic will be handled by filtering or just this endpoint
    const response = await tmdbClient.get('/movie/upcoming');
    return response.data.results;
  },

  getPopularSeries: async () => {
    const response = await tmdbClient.get('/tv/popular');
    return response.data.results;
  },

  getMovieDetails: async (id: number) => {
    const response = await tmdbClient.get(`/movie/${id}`, {
      params: { append_to_response: 'credits,videos,similar' }
    });
    return response.data;
  },

  getSeriesDetails: async (id: number) => {
    const response = await tmdbClient.get(`/tv/${id}`, {
      params: { append_to_response: 'credits,videos,similar,season/1' } // Fetch season 1 by default
    });
    return response.data;
  }
};