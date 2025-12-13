import { useState, useEffect } from 'react';
import { Movie, getImageUrl } from '../utils/tmdb';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ChevronRightIcon, PlayIcon, PlusIcon, ThumbsUpIcon, ChevronDownIcon, Volume2Icon } from './Icons';

export function Top10Section({ 
  title, 
  movies, 
  onMovieClick 
}: { 
  title: string; 
  movies: Movie[]; 
  onMovieClick: (movie: Movie) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const [hoveredMovie, setHoveredMovie] = useState<number | null>(null);
  const [logos, setLogos] = useState<Record<number, string>>({});
  const [movieDetails, setMovieDetails] = useState<Record<number, { genres: string[], ageRating: string, episodes: number }>>({});

  console.log(`🏆 Rendering TOP 10: "${title}" with ${movies.length} movies`);

  const top10Movies = movies.slice(0, 10);
  const visibleMovies = showAll ? top10Movies : top10Movies.slice(0, 5);

  // Buscar logos dos filmes
  useEffect(() => {
    const fetchLogos = async () => {
      for (const movie of visibleMovies) {
        if (logos[movie.id]) continue; // Já tem logo

        const mediaType = movie.name ? 'tv' : 'movie';
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/${mediaType}/${movie.id}/images?api_key=ddb1bdf6aa91bdf335797853884b0c1d&include_image_language=pt,en,null`
          );
          const data = await response.json();
          
          const logosData = data.logos || [];
          const ptLogo = logosData.find((img: any) => img.iso_639_1 === 'pt');
          const enLogo = logosData.find((img: any) => img.iso_639_1 === 'en');
          const anyLogo = logosData[0];
          
          const selectedLogo = ptLogo || enLogo || anyLogo;
          if (selectedLogo) {
            setLogos(prev => ({ ...prev, [movie.id]: selectedLogo.file_path }));
          }
        } catch (error) {
          console.log('Logo não disponível para:', movie.title || movie.name);
        }
      }
    };

    fetchLogos();
  }, [visibleMovies, logos]);

  // Buscar detalhes quando hover
  useEffect(() => {
    const fetchDetails = async (movie: Movie) => {
      if (movieDetails[movie.id]) return;

      const mediaType = movie.name ? 'tv' : 'movie';
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/${mediaType}/${movie.id}?api_key=ddb1bdf6aa91bdf335797853884b0c1d&language=pt-BR&append_to_response=content_ratings,release_dates`
        );
        const details = await response.json();
        
        const genres = details.genres ? details.genres.slice(0, 3).map((g: any) => g.name) : [];
        let ageRating = 'L';
        
        if (mediaType === 'tv' && details.content_ratings?.results) {
          const brRating = details.content_ratings.results.find((r: any) => r.iso_3166_1 === 'BR');
          const usRating = details.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US');
          ageRating = brRating?.rating || usRating?.rating || 'L';
        } else if (mediaType === 'movie' && details.release_dates?.results) {
          const brRelease = details.release_dates.results.find((r: any) => r.iso_3166_1 === 'BR');
          const usRelease = details.release_dates.results.find((r: any) => r.iso_3166_1 === 'US');
          const certification = brRelease?.release_dates?.[0]?.certification || usRelease?.release_dates?.[0]?.certification;
          ageRating = certification || 'L';
        }
        
        const episodes = mediaType === 'tv' && details.number_of_episodes ? details.number_of_episodes : 0;
        
        setMovieDetails(prev => ({
          ...prev,
          [movie.id]: { genres, ageRating, episodes }
        }));
      } catch (error) {
        console.log('Erro ao buscar detalhes:', error);
      }
    };

    if (hoveredMovie !== null) {
      fetchDetails(visibleMovies[hoveredMovie]);
    }
  }, [hoveredMovie, visibleMovies, movieDetails]);

  if (top10Movies.length === 0) return null;

  return (
    <div className="relative w-full">
      {/* TOP 10 Title - Responsivo */}
      <div className="px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="bg-gradient-to-r from-[#E50914] to-[#B20710] p-1.5 sm:p-2 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs sm:text-sm">TOP 10</span>
          </div>
          <h2 className="text-white font-['Inter:Bold',sans-serif] text-xl sm:text-2xl lg:text-[28px]">
            {title}
          </h2>
        </div>
      </div>
      
      {/* Grid Container - VERTICAL (POSTER) */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div 
          className="grid gap-2 sm:gap-3 md:gap-4 py-4"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))'
          }}
        >
          {visibleMovies.map((movie, index) => (
            <div
              key={movie.id}
              className="cursor-pointer relative w-full"
              onMouseEnter={() => setHoveredMovie(index)}
              onMouseLeave={() => setHoveredMovie(null)}
            >
              <div className="relative w-full flex items-center" style={{ height: 'clamp(240px, 30vw, 320px)' }}>
                {/* Big Number - Netflix Style - ATRÁS DO POSTER */}
                <div 
                  className="absolute left-0 bottom-0 z-0 pointer-events-none select-none font-black"
                  style={{
                    fontSize: 'clamp(160px, 18vw, 280px)',
                    lineHeight: 'clamp(160px, 18vw, 280px)',
                    fontWeight: '900',
                    color: 'transparent',
                    WebkitTextStroke: 'clamp(5px, 0.7vw, 10px) rgba(30, 30, 30, 0.9)',
                    textStroke: 'clamp(5px, 0.7vw, 10px) rgba(30, 30, 30, 0.9)',
                    textShadow: '0 10px 30px rgba(0, 0, 0, 0.9)',
                    fontFamily: 'Impact, sans-serif',
                    transform: 'translateX(clamp(-12px, -1.5vw, -24px))'
                  }}
                >
                  {index + 1}
                </div>

                {/* Movie Card VERTICAL - SOBRE O NÚMERO */}
                <div className="relative z-10 w-full flex justify-center" style={{ marginLeft: 'clamp(40px, 6vw, 80px)' }}>
                  <div className={`group/card w-full max-w-[140px] transition-all duration-300 ${hoveredMovie === index ? 'scale-0' : 'scale-100'}`}>
                    <div className="relative aspect-[2/3] rounded-sm overflow-hidden bg-gray-900 shadow-2xl">
                      <ImageWithFallback
                        src={getImageUrl(movie.poster_path, 'w500')}
                        alt={movie.title || movie.name || 'Movie'}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Logo do Filme/Série - Card Pequeno TOP 10 */}
                      {logos[movie.id] && (
                        <div className="absolute top-2 left-2 right-2 flex justify-center">
                          <img
                            src={getImageUrl(logos[movie.id], 'w300')}
                            alt={`${movie.title || movie.name} logo`}
                            className="max-w-[80%] h-auto max-h-10 object-contain drop-shadow-lg"
                          />
                        </div>
                      )}
                      
                      {/* Badge Vermelho */}
                      {index < 3 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-[#E50914] text-white px-1 sm:px-2 py-0.5 text-[8px] sm:text-[10px] font-black text-center">
                          {index === 0 ? 'Novidade' : index === 1 ? 'Nova temporada' : 'Assista já'}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* EXPANDED HOVER CARD - Estilo Netflix - 30% MAIOR */}
                  {hoveredMovie === index && (
                    <div 
                      className="absolute top-0 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in zoom-in duration-300"
                      style={{ 
                        transformOrigin: 'center top',
                        width: '364px' // 280px + 30% = 364px
                      }}
                    >
                      <div className="bg-[#181818] rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
                        {/* Imagem Grande */}
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <ImageWithFallback
                            src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
                            alt={movie.title || movie.name || 'Movie'}
                            className="w-full h-full object-cover"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent pointer-events-none" />
                          
                          {/* Volume Icon - Top Right */}
                          <div className="absolute top-4 right-4 z-10">
                            <button className="w-9 h-9 rounded-full border-2 border-white/60 hover:border-white bg-transparent/40 backdrop-blur-sm flex items-center justify-center transition-colors">
                              <Volume2Icon className="w-5 h-5 text-white" />
                            </button>
                          </div>
                        </div>

                        {/* Content Info */}
                        <div className="p-5">
                          {/* Logo do Filme/Série */}
                          {logos[movie.id] && (
                            <div className="flex items-center justify-start mb-4">
                              <img
                                src={getImageUrl(logos[movie.id], 'w500')}
                                alt={`${movie.title || movie.name} logo`}
                                className="max-w-[60%] h-auto max-h-16 object-contain"
                              />
                            </div>
                          )}
                          
                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 mb-4">
                            <button 
                              onClick={() => onMovieClick(movie)}
                              className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-full flex items-center gap-2 transition-colors font-bold"
                            >
                              <PlayIcon className="w-5 h-5 fill-black" />
                              <span>Assistir</span>
                            </button>
                            <button className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors">
                              <PlusIcon className="w-5 h-5 text-white" />
                            </button>
                            <button className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors">
                              <ThumbsUpIcon className="w-5 h-5 text-white" />
                            </button>
                            <button 
                              onClick={() => onMovieClick(movie)}
                              className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors ml-auto"
                            >
                              <ChevronDownIcon className="w-5 h-5 text-white" />
                            </button>
                          </div>

                          {/* Match, Age Rating and Info */}
                          <div className="flex items-center gap-2 mb-3 text-sm flex-wrap">
                            <span className="text-green-500 font-bold">
                              {Math.round((movie.vote_average || 0) * 10)}% Match
                            </span>
                            {movieDetails[movie.id]?.ageRating && (
                              <span className="px-2 py-0.5 border-2 border-gray-400 text-white text-xs font-bold">
                                {movieDetails[movie.id].ageRating}
                              </span>
                            )}
                            <span className="text-gray-400 text-sm">
                              {new Date(movie.release_date || movie.first_air_date || '').getFullYear()}
                            </span>
                            <span className="px-1.5 border border-gray-500 text-gray-400 text-xs">HD</span>
                          </div>

                          {/* Genres */}
                          {movieDetails[movie.id]?.genres && movieDetails[movie.id].genres.length > 0 && (
                            <div className="flex items-center gap-2 text-sm text-white mb-3">
                              {movieDetails[movie.id].genres.map((genre, idx) => (
                                <span key={genre}>
                                  {genre}
                                  {idx < movieDetails[movie.id].genres.length - 1 && <span className="mx-1.5 text-gray-500">•</span>}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Episodes info for TV shows */}
                          {movie.name && movieDetails[movie.id]?.episodes > 0 && (
                            <p className="text-gray-400 text-xs mb-2">
                              {movieDetails[movie.id].episodes} episódio{movieDetails[movie.id].episodes > 1 ? 's' : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Botão Ver Mais/Menos */}
          {top10Movies.length > 5 && (
            <div 
              className="flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 w-full"
              onClick={() => setShowAll(!showAll)}
            >
              <div className="bg-[#1a1a1a] hover:bg-[#E50914] border-2 border-[#E50914] rounded-lg flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all duration-300 group w-full max-w-[140px]" style={{ height: 'clamp(180px, 22vw, 210px)' }}>
                <ChevronRightIcon 
                  className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#E50914] group-hover:text-white transition-all duration-300 ${showAll ? 'rotate-180' : ''}`}
                />
                <span className="text-white font-bold text-xs sm:text-sm text-center px-2">
                  {showAll ? 'Ver Menos' : 'Ver Mais'}
                </span>
                <span className="text-gray-400 text-[10px] sm:text-xs">
                  {showAll ? '5 itens' : `+${top10Movies.length - 5}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}