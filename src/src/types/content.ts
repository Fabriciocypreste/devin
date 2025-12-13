export interface RawContentItem {
    id?: string | number;
    title?: string; // Movies often use title
    name?: string;  // Channels/Series often use name
    logo?: string;
    group_title?: string;
    url?: string;
    stream_url?: string;
    tvg_id?: string;
    tvg_name?: string;
    tvg_logo?: string;
    year?: string | number;
    country?: string;
    genres?: string;
    imdb_id?: string;
    rating?: string | number;
}

export interface EnrichedContent {
    id: string; // Unique internal ID
    tmdbId?: number;
    title: string;
    originalTitle?: string;
    overview?: string;
    posterPath?: string;
    backdropPath?: string;
    streamUrl: string;
    type: 'movie' | 'series' | 'channel';
    rating?: number;
    year?: number;
    genres?: string[];
    cast?: string[]; // Top 5 cast names
    logo?: string; // For channels or fallback
    category?: string;
    runtime?: number;
    releaseDate?: string;
    addedAt?: number; // Timestamp for "New" badge
}

export interface CategorySection {
    id: string;
    title: string;
    items: EnrichedContent[];
    type: 'movie' | 'series' | 'channel' | 'mixed';
}
