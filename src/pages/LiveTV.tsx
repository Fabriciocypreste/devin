import React, { useEffect, useState } from 'react';
import { contentService } from '../services/contentService';
import { EnrichedContent } from '../types/content';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../utils/cn';

interface LiveTVProps {
    onPlay: (channel: EnrichedContent) => void;
}

export function LiveTV({ onPlay }: LiveTVProps) {
    const [channels, setChannels] = useState<EnrichedContent[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
    const [selectedChannel, setSelectedChannel] = useState<EnrichedContent | null>(null);

    useEffect(() => {
        const load = async () => {
            await contentService.loadAllContent();
            const allChannels = contentService.getChannels();
            setChannels(allChannels);
            if (allChannels.length > 0) setSelectedChannel(allChannels[0]);
        };
        load();
    }, []);

    // Extract categories
    const categories = ['Todos', ...Array.from(new Set(channels.map(c => c.group || 'Outros').filter(Boolean)))];

    const filteredChannels = selectedCategory === 'Todos'
        ? channels
        : channels.filter(c => c.group === selectedCategory);

    return (
        <div className="flex h-screen w-full bg-redflix-gradient pt-20 overflow-hidden">
            {/* Left: Categories */}
            <div className="w-64 shrink-0 overflow-y-auto border-r border-white/10 bg-black/40 p-4 scrollbar-hide glass-panel">
                <h2 className="mb-6 text-xl font-bold text-white">Categorias</h2>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={cn(
                                "w-full rounded px-4 py-3 text-left text-sm font-medium transition-all focus-ring",
                                selectedCategory === cat
                                    ? "bg-red-600 text-white shadow-lg"
                                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                            )}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Center: Channel List */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                <h2 className="mb-6 text-2xl font-bold text-white">{selectedCategory} ({filteredChannels.length})</h2>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {filteredChannels.map(channel => (
                        <GlassCard
                            key={channel.id}
                            title={channel.title}
                            imageUrl={channel.logo}
                            aspectRatio="video"
                            className={cn(
                                "bg-black/60",
                                selectedChannel?.id === channel.id && "ring-2 ring-white"
                            )}
                            onPress={() => onPlay(channel)}
                            onMouseEnter={() => setSelectedChannel(channel)}
                            onFocus={() => setSelectedChannel(channel)}
                        />
                    ))}
                </div>
            </div>

            {/* Right: Preview & Description */}
            <div className="w-80 shrink-0 border-l border-white/10 bg-black/60 p-6 glass-panel hidden xl:block">
                {selectedChannel ? (
                    <div className="space-y-6">
                        <div className="aspect-video w-full overflow-hidden rounded-lg bg-black shadow-2xl border border-white/20">
                            {selectedChannel.logo ? (
                                <img src={selectedChannel.logo} alt={selectedChannel.title} className="h-full w-full object-contain p-4" />
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-500">Sem Preview</div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-white">{selectedChannel.title}</h3>
                            <p className="mt-2 text-sm text-gray-400">{selectedChannel.group}</p>
                            <div className="mt-4 flex gap-2">
                                <span className="rounded bg-red-600/20 px-2 py-1 text-xs font-bold text-red-500">AO VIVO</span>
                                <span className="rounded bg-white/10 px-2 py-1 text-xs font-bold text-white">HD</span>
                            </div>
                        </div>
                        <button
                            onClick={() => onPlay(selectedChannel)}
                            className="w-full rounded bg-red-600 py-3 font-bold text-white hover:bg-red-700 focus-ring shadow-lg hover:shadow-red-600/40 transition-all"
                        >
                            Assistir Agora
                        </button>
                    </div>
                ) : (
                    <div className="text-center text-gray-500">Selecione um canal</div>
                )}
            </div>
        </div>
    );
}
