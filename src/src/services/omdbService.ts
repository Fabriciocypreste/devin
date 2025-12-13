/**
 * OMDb API Service
 * API para buscar informações detalhadas e pôsteres de filmes/séries
 * Documentação: http://www.omdbapi.com/
 */

const OMDB_API_KEY = 'faa9f03';
const OMDB_BASE_URL = 'http://www.omdbapi.com/';

export interface OMDbMovie {
    Title: string;
    Year: string;
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Awards: string;
    Poster: string; // URL do pôster em alta qualidade
    Ratings: Array<{
        Source: string;
        Value: string;
    }>;
    Metascore: string;
    imdbRating: string;
    imdbVotes: string;
    imdbID: string;
    Type: 'movie' | 'series' | 'episode';
    DVD?: string;
    BoxOffice?: string;
    Production?: string;
    Website?: string;
    Response: string;
}

export interface OMDbSearchResult {
    Title: string;
    Year: string;
    imdbID: string;
    Type: 'movie' | 'series' | 'episode';
    Poster: string;
}

export interface OMDbSearchResponse {
    Search: OMDbSearchResult[];
    totalResults: string;
    Response: string;
}

/**
 * Buscar filme/série por IMDB ID
 */
export async function getByImdbId(imdbId: string): Promise<OMDbMovie | null> {
    try {
        const url = `${OMDB_BASE_URL}?i=${imdbId}&apikey=${OMDB_API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            console.error('OMDb API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.Response === 'False') {
            console.error('OMDb: Movie not found:', data.Error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('OMDb: Error fetching movie:', error);
        return null;
    }
}

/**
 * Buscar filme/série por título
 */
export async function getByTitle(title: string, year?: number): Promise<OMDbMovie | null> {
    try {
        let url = `${OMDB_BASE_URL}?t=${encodeURIComponent(title)}&apikey=${OMDB_API_KEY}`;

        if (year) {
            url += `&y=${year}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            console.error('OMDb API error:', response.status);
            return null;
        }

        const data = await response.json();

        if (data.Response === 'False') {
            console.error('OMDb: Movie not found:', data.Error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('OMDb: Error fetching movie:', error);
        return null;
    }
}

/**
 * Buscar filmes/séries por termo de busca
 */
export async function search(query: string, type?: 'movie' | 'series'): Promise<OMDbSearchResult[]> {
    try {
        let url = `${OMDB_BASE_URL}?s=${encodeURIComponent(query)}&apikey=${OMDB_API_KEY}`;

        if (type) {
            url += `&type=${type}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            console.error('OMDb API error:', response.status);
            return [];
        }

        const data: OMDbSearchResponse = await response.json();

        if (data.Response === 'False') {
            console.error('OMDb: Search failed:', data);
            return [];
        }

        return data.Search || [];
    } catch (error) {
        console.error('OMDb: Error searching:', error);
        return [];
    }
}

/**
 * Obter URL do pôster de alta qualidade
 */
export function getPosterUrl(movie: OMDbMovie, size: 'small' | 'medium' | 'large' = 'medium'): string {
    if (!movie.Poster || movie.Poster === 'N/A') {
        return '';
    }

    // OMDb retorna URLs no formato: ...._V1_SX300.jpg
    // Podemos alterar o tamanho substituindo SX300
    const sizeMap = {
        small: 'SX150',
        medium: 'SX300',
        large: 'SX600'
    };

    return movie.Poster.replace(/SX\d+/, sizeMap[size]);
}

/**
 * Obter informações enriquecidas combinando OMDb com dados existentes
 */
export async function enrichMovieData(title: string, year?: number) {
    console.log(`🎬 OMDb: Enriquecendo "${title}"${year ? ` (${year})` : ''}`);

    const omdbData = await getByTitle(title, year);

    if (!omdbData) {
        console.log('❌ OMDb: Não encontrado');
        return null;
    }

    console.log('✅ OMDb: Dados encontrados');
    console.log(`   Pôster: ${omdbData.Poster !== 'N/A' ? '✅' : '❌'}`);
    console.log(`   IMDB Rating: ${omdbData.imdbRating}`);
    console.log(`   Gêneros: ${omdbData.Genre}`);

    return {
        title: omdbData.Title,
        year: parseInt(omdbData.Year),
        poster: omdbData.Poster !== 'N/A' ? omdbData.Poster : null,
        plot: omdbData.Plot,
        rating: parseFloat(omdbData.imdbRating),
        genres: omdbData.Genre.split(', '),
        director: omdbData.Director,
        actors: omdbData.Actors.split(', '),
        runtime: omdbData.Runtime,
        imdbId: omdbData.imdbID,
        type: omdbData.Type
    };
}
