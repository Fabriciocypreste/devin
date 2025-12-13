import React, { useEffect, useState } from 'react';
import { contentService } from '../services/contentService';
import { EnrichedContent } from '../types/content';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../utils/cn';

interface SeriesProps {
    onPlay: (serie: EnrichedContent) => void;
}

export function Series({ onPlay }: SeriesProps) {
    const [series, setSeries] = useState<EnrichedContent[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            await contentService.loadAllContent();
            const allSeries = await contentService.getSeries();
            setSeries(allSeries);
            setLoading(false);
        };
        load();
    }, []);

    const genres = ['Todos', ...Array.from(new Set(series.map(s => s.category || 'Outros').filter(Boolean))).sort()];

    const filteredSeries = selectedGenre === 'Todos'
        ? series
        : series.filter(s => s.category === selectedGenre);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-redflix-gradient pt-24 px-12 pb-20">
            <h1 className="text-4xl font-bold text-white mb-8">Séries</h1>

            <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide mb-8">
                {genres.map(genre => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={cn(
                            "whitespace-nowrap rounded-full px-6 py-2 text-sm font-bold transition-all focus-ring border border-white/10",
                            selectedGenre === genre
                                ? "bg-red-600 text-white shadow-lg"
                                : "bg-black/40 text-gray-300 hover:bg-white/10 hover:text-white backdrop-blur-md"
                        )}
                    >
                        {genre}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredSeries.map(serie => (
                    <GlassCard
                        key={serie.id}
                        title={serie.title}
                        imageUrl={serie.posterPath}
                        aspectRatio="poster"
                        onPress={() => onPlay(serie)}
                    />
                ))}
            </div>

            {filteredSeries.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    Nenhuma série encontrada nesta categoria.
                </div>
            )}
        </div>
    );
}
