import React, { useEffect, useState } from 'react';
import { contentService } from '../services/contentService';
import { ContentRow } from '../components/ContentRow';
import { EnrichedContent } from '../types/content';
import { GlassCard } from '../components/ui/GlassCard';

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

            {/* Content Rows */}
            <div className="relative z-10 -mt-32 space-y-4">
                <ContentRow title="Tendências" items={content.trending.slice(1)} onItemClick={onPlay} />
                <ContentRow title="Filmes Populares" items={content.popularMovies} onItemClick={onPlay} />
                <ContentRow title="Séries do Momento" items={content.popularSeries} onItemClick={onPlay} isPoster={true} />
            </div>
        </div>
    );
}
