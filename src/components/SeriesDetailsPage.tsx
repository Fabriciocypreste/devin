/**
 * 📺 PÁGINA DE DETALHES DE SÉRIE - Estilo Netflix
 * 
 * Exibe temporadas, episódios e permite reproduzir cada um
 * FONTE: filmes.txt (URLs reais de cada episódio)
 */

import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getImageUrl } from '../utils/tmdb';
import IPTVUniversalPlayer from './IPTVUniversalPlayer';

// Icons
const Play = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const X = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Clock = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

interface Episode {
  id: string;
  number: number;
  title: string;
  overview?: string;
  streamUrl: string;
  poster_path?: string;
  runtime?: number;
  original_title?: string;
}

interface Season {
  number: number;
  name: string;
  episodes: Episode[];
}

interface SeriesDetailsPageProps {
  series: Movie;
  allEpisodes: Movie[]; // Todos os episódios vindos do filmes.txt
  onClose: () => void;
}

export function SeriesDetailsPage({ series, allEpisodes, onClose }: SeriesDetailsPageProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null);
  const [seasons, setSeasons] = useState<Season[]>([]);

  useEffect(() => {
    // Organizar episódios por temporada
    const organizedSeasons = organizeEpisodesBySeason(series, allEpisodes);
    setSeasons(organizedSeasons);
    
    if (organizedSeasons.length > 0) {
      setSelectedSeason(organizedSeasons[0].number);
    }
  }, [series, allEpisodes]);

  const currentSeason = seasons.find(s => s.number === selectedSeason);

  if (playingEpisode) {
    return (
      <div className="fixed inset-0 z-50 bg-black">
        <IPTVUniversalPlayer
          streamUrl={playingEpisode.streamUrl}
          title={`${series.title || series.name} - ${playingEpisode.title}`}
          poster={series.backdrop_path || series.poster_path}
          isLive={false}
          enableP2P={true}
          enableStats={false}
          autoPlay={true}
          onClose={() => setPlayingEpisode(null)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#141414]">
      {/* Hero Banner */}
      <div className="relative h-[70vh] w-full">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={getImageUrl(series.backdrop_path || series.poster_path, 'original')}
            alt={series.title || series.name || ''}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/90 via-transparent to-transparent" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 bg-[#141414] rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-end p-12 pb-20">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-4">
              {series.title || series.name}
            </h1>
            
            <div className="flex items-center gap-4 text-white/80 mb-6">
              {series.first_air_date && (
                <span>{new Date(series.first_air_date).getFullYear()}</span>
              )}
              <span>{seasons.length} Temporada{seasons.length > 1 ? 's' : ''}</span>
              {series.vote_average && series.vote_average > 0 && (
                <div className="flex items-center gap-1">
                  <span className="text-green-400">★</span>
                  <span>{series.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>

            <p className="text-white/90 text-lg leading-relaxed mb-6 line-clamp-3">
              {series.overview || 'Descrição não disponível.'}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  // Reproduzir primeiro episódio
                  if (currentSeason && currentSeason.episodes.length > 0) {
                    setPlayingEpisode(currentSeason.episodes[0]);
                  }
                }}
                className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-white/80 transition-colors"
              >
                <Play className="w-5 h-5" />
                <span>Assistir</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Episodes Section */}
      <div className="px-12 pb-12 -mt-10 relative z-10">
        {/* Season Selector */}
        <div className="mb-6">
          <div className="inline-block relative">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(Number(e.target.value))}
              className="appearance-none bg-[#2F2F2F] text-white px-6 py-3 pr-12 rounded font-semibold cursor-pointer hover:bg-[#3F3F3F] transition-colors"
            >
              {seasons.map(season => (
                <option key={season.number} value={season.number}>
                  {season.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" />
          </div>
        </div>

        {/* Episodes List */}
        {currentSeason && (
          <div className="space-y-2">
            {currentSeason.episodes.map((episode, index) => (
              <div
                key={episode.id}
                className="bg-[#2F2F2F] rounded-lg p-4 hover:bg-[#3F3F3F] transition-colors cursor-pointer group"
                onClick={() => setPlayingEpisode(episode)}
              >
                <div className="flex gap-4">
                  {/* Episode Number */}
                  <div className="text-3xl font-bold text-white/50 w-12 flex-shrink-0">
                    {episode.number}
                  </div>

                  {/* Thumbnail */}
                  <div className="relative w-40 h-24 flex-shrink-0 bg-[#1F1F1F] rounded overflow-hidden">
                    {episode.poster_path ? (
                      <ImageWithFallback
                        src={getImageUrl(episode.poster_path, 'w300')}
                        alt={episode.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/30">
                        <Play className="w-8 h-8" />
                      </div>
                    )}
                    
                    {/* Play Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                        <Play className="w-5 h-5 text-white ml-1" />
                      </div>
                    </div>

                    {/* Runtime */}
                    {episode.runtime && (
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-2 py-0.5 rounded">
                        {episode.runtime}m
                      </div>
                    )}
                  </div>

                  {/* Episode Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg">
                        {episode.title}
                      </h3>
                      {episode.runtime && (
                        <div className="flex items-center gap-1 text-white/60 text-sm flex-shrink-0 ml-4">
                          <Clock className="w-4 h-4" />
                          <span>{episode.runtime}m</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-white/70 text-sm line-clamp-2">
                      {episode.overview || 'Descrição não disponível.'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Episodes Message */}
        {!currentSeason || currentSeason.episodes.length === 0 && (
          <div className="text-center py-12 text-white/60">
            <p>Nenhum episódio disponível para esta temporada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Organiza episódios por temporada baseado nos dados do filmes.txt
 */
function organizeEpisodesBySeason(series: Movie, allEpisodes: Movie[]): Season[] {
  const seriesName = (series.title || series.name || '').toLowerCase();
  
  // Filtrar episódios desta série
  const episodes = allEpisodes.filter(ep => {
    const epName = (ep.title || ep.name || '').toLowerCase();
    return epName.includes(seriesName) || ep.original_title?.toLowerCase().includes(seriesName);
  });

  console.log(`📺 Organizando ${episodes.length} episódios para "${series.title || series.name}"`);

  // Agrupar por temporada
  const seasonsMap = new Map<number, Episode[]>();

  episodes.forEach(ep => {
    const title = ep.title || ep.name || ep.original_title || '';
    
    // Extrair número da temporada (S01, S02, Temporada 1, Season 2, etc)
    const seasonMatch = title.match(/(?:s|season|temporada)\s*(\d+)/i);
    const seasonNumber = seasonMatch ? parseInt(seasonMatch[1]) : 1;

    // Extrair número do episódio (E01, E02, Episódio 1, Episode 2, etc)
    const episodeMatch = title.match(/(?:e|ep|episode|episodio|episódio)\s*(\d+)/i);
    const episodeNumber = episodeMatch ? parseInt(episodeMatch[1]) : 1;

    const episode: Episode = {
      id: ep.id?.toString() || `${seasonNumber}-${episodeNumber}`,
      number: episodeNumber,
      title: cleanEpisodeTitle(title),
      overview: ep.overview,
      streamUrl: (ep as any).streamUrl || '',
      poster_path: ep.poster_path || ep.backdrop_path,
      runtime: undefined,
      original_title: ep.original_title,
    };

    if (!seasonsMap.has(seasonNumber)) {
      seasonsMap.set(seasonNumber, []);
    }
    seasonsMap.get(seasonNumber)!.push(episode);
  });

  // Converter para array de temporadas
  const seasons: Season[] = Array.from(seasonsMap.entries())
    .map(([number, episodes]) => ({
      number,
      name: `Temporada ${number}`,
      episodes: episodes.sort((a, b) => a.number - b.number),
    }))
    .sort((a, b) => a.number - b.number);

  console.log(`✅ Organizado em ${seasons.length} temporadas`);
  seasons.forEach(s => {
    console.log(`   ${s.name}: ${s.episodes.length} episódios`);
  });

  return seasons;
}

/**
 * Limpa o título do episódio removendo marcadores de temporada/episódio
 */
function cleanEpisodeTitle(title: string): string {
  return title
    .replace(/(?:s|season|temporada)\s*\d+/gi, '')
    .replace(/(?:e|ep|episode|episodio|episódio)\s*\d+/gi, '')
    .replace(/\s*-\s*/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim() || 'Episódio';
}
