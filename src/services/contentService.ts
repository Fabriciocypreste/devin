import { RawContentItem, EnrichedContent } from '../types/content';
import { tmdbService, getImageUrl } from './tmdbService';

const JSON_FILES = Array.from({ length: 20 }, (_, i) => `/data/part_${String(i + 1).padStart(2, '0')}.json`);

let rawContentCache: RawContentItem[] = [];
let isLoaded = false;

export const contentService = {
    loadAllContent: async (): Promise<RawContentItem[]> => {
        if (isLoaded && rawContentCache.length > 0) return rawContentCache;

        try {
            console.log('Loading content from JSON files...');
            const promises = JSON_FILES.map(async (file) => {
                try {
                    const res = await fetch(file);
                    if (!res.ok) return [];
                    return await res.json();
                } catch (e) {
                    console.warn(`Failed to load ${file}`, e);
                    return [];
                }
            });

            const results = await Promise.all(promises);
            rawContentCache = results.flat();
            isLoaded = true;
            console.log(`Loaded ${rawContentCache.length} items.`);
            return rawContentCache;
        } catch (error) {
            console.error('Error loading content:', error);
            return [];
        }
    },

    findStreamUrl: (title: string, type: 'movie' | 'series'): string | null => {
        if (!title) return null;
        const normalizedTitle = title.toLowerCase().trim();

        // Simple exact match first
        const match = rawContentCache.find(item => {
            const itemTitle = (item.title || item.name || '').toLowerCase().trim();
            return itemTitle === normalizedTitle || itemTitle.includes(normalizedTitle);
        });

        return match?.url || match?.stream_url || null;
    },

    getEnrichedHomeContent: async () => {
        // Strategy: Get TMDB Trending/Popular and try to attach stream URLs
        const [trending, popularMovies, popularSeries] = await Promise.all([
            tmdbService.getTrending(),
            tmdbService.getPopularMovies(),
            tmdbService.getPopularSeries()
        ]);

        const enrich = (items: any[], type: 'movie' | 'series') => {
            return items.map(item => {
                const title = item.title || item.name;
                const streamUrl = contentService.findStreamUrl(title, type);

                return {
                    id: item.id.toString(),
                    tmdbId: item.id,
                    title: title,
                    overview: item.overview,
                    posterPath: getImageUrl(item.poster_path),
                    backdropPath: getImageUrl(item.backdrop_path, 'backdrop'),
                    rating: item.vote_average,
                    releaseDate: item.release_date || item.first_air_date,
                    type: type,
                    streamUrl: streamUrl || '', // Empty string if not found (UI handles "Not Available")
                } as EnrichedContent;
            });
        };

        return {
            trending: enrich(trending, 'movie'), // Mixed types actually, simplified for now
            popularMovies: enrich(popularMovies, 'movie'),
            popularSeries: enrich(popularSeries, 'series'),
        };
    },

    getChannels: () => {
        return rawContentCache.filter(item =>
            item.group_title?.toLowerCase().includes('tv') ||
            item.group_title?.toLowerCase().includes('canais') ||
            item.url?.endsWith('.ts')
        ).map(item => ({
            id: String(item.id || Math.random()),
            title: item.name || item.title || 'Unknown Channel',
            streamUrl: item.url || '',
            logo: item.logo || item.tvg_logo,
            group: item.group_title,
            type: 'channel'
        } as EnrichedContent));
    },

    getMovies: async () => {
        const rawMovies = rawContentCache.filter(item =>
            !item.group_title?.toLowerCase().includes('tv') &&
            !item.group_title?.toLowerCase().includes('canais') &&
            !item.url?.endsWith('.ts') &&
            (item.url?.endsWith('.mp4') || item.url?.endsWith('.mkv') || !item.url)
        );

        return rawMovies.map(item => ({
            id: String(item.id || Math.random()),
            title: item.title || item.name || 'Untitled Movie',
            streamUrl: item.url || '',
            posterPath: item.logo,
            type: 'movie',
            category: item.group_title || 'Geral'
        } as EnrichedContent));
    },

    getSeries: async () => {
        const rawSeries = rawContentCache.filter(item =>
            item.group_title?.toLowerCase().includes('series') ||
            item.group_title?.toLowerCase().includes('série')
        );

        return rawSeries.map(item => ({
            id: String(item.id || Math.random()),
            title: item.title || item.name || 'Untitled Series',
            streamUrl: item.url || '',
            posterPath: item.logo,
            type: 'series',
            category: item.group_title || 'Geral'
        } as EnrichedContent));
    }
};
