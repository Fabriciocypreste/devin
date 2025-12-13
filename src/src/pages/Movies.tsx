import React, { useEffect, useState } from 'react';
import { contentService } from '../services/contentService';
import { EnrichedContent } from '../types/content';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../utils/cn';

interface MoviesProps {
    onPlay: (movie: EnrichedContent) => void;
}

export function Movies({ onPlay }: MoviesProps) {
    const [movies, setMovies] = useState<EnrichedContent[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<string>('Todos');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            await contentService.loadAllContent();
            const allMovies = await contentService.getMovies();
            setMovies(allMovies);
            setLoading(false);
        };
        load();
    }, []);

    // Extract unique genres/categories
    const genres = ['Todos', ...Array.from(new Set(movies.map(m => m.category || 'Outros').filter(Boolean))).sort()];

    const filteredMovies = selectedGenre === 'Todos'
        ? movies
        : movies.filter(m => m.category === selectedGenre);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-redflix-gradient pt-24 px-12 pb-20">
            <h1 className="text-4xl font-bold text-white mb-8">Filmes</h1>

            {/* Genre Filter */}
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

            {/* Movies Grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {filteredMovies.map(movie => (
                    <GlassCard
                        key={movie.id}
                        title={movie.title}
                        imageUrl={movie.posterPath}
                        aspectRatio="poster"
                        onPress={() => onPlay(movie)}
                    />
                ))}
            </div>

            {filteredMovies.length === 0 && (
                <div className="text-center text-gray-500 mt-20">
                    Nenhum filme encontrado nesta categoria.
                </div>
            )}
        </div>
    );
}
