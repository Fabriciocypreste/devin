import React, { useEffect, useState } from 'react';
import { contentService } from '../services/contentService';
import { EnrichedContent } from '../types/content';
import { MovieCard } from '../components/MovieCard';
import { Movie } from '../utils/tmdb';

interface HomeProps {
    onPlay: (item: EnrichedContent) => void;
}

export function Home({ onPlay }: HomeProps) {
    const [content, setContent] = useState<{
        trending: EnrichedContent[];
        popularMovies: EnrichedContent[];
        popularSeries: EnrichedContent[];
    } | null>(null);

    useEffect(() => {
        const load = async () => {
            await contentService.loadAllContent();
            const data = await contentService.getEnrichedHomeContent();
            setContent(data);
        };
        load();
    }, []);

    // Conversor de EnrichedContent para Movie (interface do TMDB usada pelo MovieCard)
    const toMovie = (item: EnrichedContent): Movie => ({
        id: item.id,
        title: item.title,
        name: item.title,
        overview: item.overview || '',
        poster_path: item.posterPath || '',
        backdrop_path: item.backdropPath || '',
        vote_average: item.rating || 0,
        media_type: item.type === 'series' ? 'tv' : 'movie',
        release_date: item.releaseDate,
        first_air_date: item.releaseDate,
        streamUrl: item.streamUrl
    });

    if (!content) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            </div>
        );
    }

    const heroItem = content.trending[0];

    return (
        <div className="min-h-screen bg-redflix-gradient pb-20">
            {/* Hero Section */}
            {heroItem && (
                <div className="relative h-[80vh] w-full overflow-hidden">
                    <div className="absolute inset-0">
                        <img
                            src={heroItem.backdropPath || heroItem.posterPath}
                            alt={heroItem.title}
                            className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
                    </div>

                    <div className="absolute bottom-[20%] left-12 max-w-2xl space-y-6">
                        <h1 className="text-6xl font-bold text-white drop-shadow-lg leading-tight">
                            {heroItem.title}
                        </h1>
                        <p className="text-lg text-gray-200 line-clamp-3 drop-shadow-md">
                            {heroItem.overview}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => onPlay(heroItem)}
                                className="flex items-center gap-2 rounded bg-white px-8 py-3 text-xl font-bold text-black hover:bg-gray-200 focus-ring transition-colors"
                            >
                                ▶ Assistir
                            </button>
                            <button className="flex items-center gap-2 rounded bg-gray-500/50 px-8 py-3 text-xl font-bold text-white backdrop-blur hover:bg-gray-500/70 focus-ring transition-colors">
                                ℹ Mais Informações
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Content Grids - Mesmo estilo da página Series/Movies */}
            <div className="relative z-10 -mt-32 px-12 space-y-12">
                {/* Tendências */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Tendências</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px]">
                        {content.trending.slice(1).map(item => (
                            <div key={item.id} className="relative z-10">
                                <MovieCard
                                    movie={toMovie(item)}
                                    onClick={() => onPlay(item)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Filmes Populares */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Filmes Populares</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px]">
                        {content.popularMovies.map(item => (
                            <div key={item.id} className="relative z-10">
                                <MovieCard
                                    movie={toMovie(item)}
                                    onClick={() => onPlay(item)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Séries do Momento */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-6">Séries do Momento</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-[24px]">
                        {content.popularSeries.map(item => (
                            <div key={item.id} className="relative z-10">
                                <MovieCard
                                    movie={toMovie(item)}
                                    onClick={() => onPlay(item)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
