import { useState, useEffect } from 'react';
import { Movie, getImageUrl, getTitle } from '../utils/tmdb';
import { OptimizedImage } from './OptimizedImage';
import { useMyList } from '../hooks/useMyList';
import { useFavorites } from '../hooks/useFavorites';
import { useWatchLater } from '../hooks/useWatchLater';
import { useAuth } from '../contexts/AuthContext';

// TMDB API Configuration
// 🔥 TEMPORÁRIO: API Key hardcoded - Criar .env depois!
const TMDB_API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Cache global para detalhes de filmes/séries
const detailsCache = new Map<string, any>();

// Função para buscar detalhes com cache
async function getCachedDetails(mediaType: string, id: number): Promise<any> {
  const cacheKey = `${mediaType}-${id}`;
  
  // Verificar cache
  if (detailsCache.has(cacheKey)) {
    console.log('✅ Usando cache para:', cacheKey);
    return detailsCache.get(cacheKey);
  }
  
  try {
    console.log('🌐 Buscando da API do TMDB:', cacheKey);
    // Buscar detalhes + imagens em uma única requisição
    const response = await fetch(
      `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&language=pt-BR&append_to_response=images,content_ratings,release_dates`
    );
    
    if (!response.ok) {
      console.error('❌ Erro na API do TMDB:', response.status);
      return null;
    }
    
    const data = await response.json();
    console.log('✅ Dados recebidos do TMDB:', {
      title: data.title || data.name,
      logo: data.images?.logos?.length || 0,
      seasons: data.number_of_seasons,
      episodes: data.number_of_episodes,
      releaseDate: data.release_date || data.first_air_date
    });
    
    // Armazenar no cache
    detailsCache.set(cacheKey, data);
    
    return data;
  } catch (error) {
    console.error('❌ Erro ao buscar detalhes:', error);
    return null;
  }
}

// Extrair logo das imagens
function extractLogoFromDetails(details: any): string | null {
  if (!details.images || !details.images.logos) return null;
  
  // Priorizar logo em português
  const ptLogo = details.images.logos.find((logo: any) => logo.iso_639_1 === 'pt');
  if (ptLogo) return ptLogo.file_path;
  
  // Fallback para logo em inglês
  const enLogo = details.images.logos.find((logo: any) => logo.iso_639_1 === 'en');
  if (enLogo) return enLogo.file_path;
  
  // Fallback para qualquer logo
  if (details.images.logos.length > 0) {
    return details.images.logos[0].file_path;
  }
  
  return null;
}

// Extrair gêneros
function extractGenres(details: any): string[] {
  if (!details.genres) return [];
  return details.genres.map((g: any) => g.name).slice(0, 3);
}

// Extrair classificação etária
function extractAgeRating(details: any, mediaType: string): string {
  if (mediaType === 'movie') {
    // Para filmes, usar release_dates
    if (details.release_dates?.results) {
      const brRelease = details.release_dates.results.find((r: any) => r.iso_3166_1 === 'BR');
      if (brRelease?.release_dates?.[0]?.certification) {
        return brRelease.release_dates[0].certification;
      }
      
      const usRelease = details.release_dates.results.find((r: any) => r.iso_3166_1 === 'US');
      if (usRelease?.release_dates?.[0]?.certification) {
        return usRelease.release_dates[0].certification;
      }
    }
  } else {
    // Para séries, usar content_ratings
    if (details.content_ratings?.results) {
      const brRating = details.content_ratings.results.find((r: any) => r.iso_3166_1 === 'BR');
      if (brRating?.rating) {
        return brRating.rating;
      }
      
      const usRating = details.content_ratings.results.find((r: any) => r.iso_3166_1 === 'US');
      if (usRating?.rating) {
        return usRating.rating;
      }
    }
  }
  
  return '';
}

// Icons inline to avoid lucide-react dependency
const Plus = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Check = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const ThumbsUp = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
  </svg>
);

const Heart = ({ className = "", fill = "none" }: { className?: string; fill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const ChevronDown = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const Clock = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Play = ({ className = "", fill = "none" }: { className?: string; fill?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const Volume2 = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  onPlay?: (movie: Movie) => void; // ✅ NOVO: Callback para reproduzir diretamente
  onAddToList?: () => void;
  onLike?: () => void;
  onWatchLater?: () => void;
  isInList?: boolean;
  isLiked?: boolean;
  isInWatchLater?: boolean;
}

export function MovieCard({ movie, onClick, onPlay, onAddToList, onLike, onWatchLater, isInList = false, isLiked = false, isInWatchLater = false }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [logoPath, setLogoPath] = useState<string | null>(null);
  const [genres, setGenres] = useState<string[]>([]);
  const [ageRating, setAgeRating] = useState<string>('');
  const [episodes, setEpisodes] = useState<number>(0);
  const [seasons, setSeasons] = useState<number>(0);
  const [releaseYear, setReleaseYear] = useState<string>('');
  
  // Hooks para integração com banco de dados
  const { isAuthenticated } = useAuth();
  const { toggleMyList, isInMyList } = useMyList();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { toggleWatchLater, isInWatchLater: checkInWatchLater } = useWatchLater();
  
  // Verificar se movie existe e tem dados válidos
  if (!movie || !movie.id) {
    return null;
  }
  
  // Determinar se é filme ou série e quantas temporadas (se aplicável)
  const mediaType = movie.media_type || (movie.first_air_date && !movie.release_date ? 'tv' : 'movie');
  const title = getTitle(movie);
  
  // Verificar status real do banco de dados
  const inMyList = isAuthenticated ? isInMyList(movie.id.toString()) : isInList;
  const inFavorites = isAuthenticated ? isFavorite(movie.id.toString()) : isLiked;
  const inWatchLater = isAuthenticated ? checkInWatchLater(movie.id.toString()) : isInWatchLater;
  
  // Handlers para ações
  const handleAddToList = async () => {
    if (!isAuthenticated) {
      onAddToList?.();
      return;
    }
    
    await toggleMyList({
      content_id: movie.id.toString(),
      content_type: mediaType,
      tmdb_id: movie.id,
      title: title,
      poster_url: movie.poster_path || '',
      backdrop_url: movie.backdrop_path || ''
    });
  };
  
  const handleLike = async () => {
    if (!isAuthenticated) {
      onLike?.();
      return;
    }
    
    await toggleFavorite({
      content_id: movie.id.toString(),
      content_type: mediaType,
      tmdb_id: movie.id,
      title: title,
      poster_url: movie.poster_path || '',
      backdrop_url: movie.backdrop_path || ''
    });
  };
  
  const handleWatchLater = async () => {
    if (!isAuthenticated) {
      onWatchLater?.();
      return;
    }
    
    await toggleWatchLater({
      content_id: movie.id.toString(),
      content_type: mediaType,
      tmdb_id: movie.id,
      title: title,
      poster_url: movie.poster_path || '',
      backdrop_url: movie.backdrop_path || ''
    });
  };
  
  // Buscar logo, gêneros, classificação e episódios COM CACHE
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Buscar detalhes com cache (uma única requisição)
        const details = await getCachedDetails(mediaType, movie.id);
        
        if (!details) return;
        
        // Extrair logo
        const logo = extractLogoFromDetails(details);
        if (logo) {
          setLogoPath(logo);
        }
        
        // Extrair gêneros
        const movieGenres = extractGenres(details);
        if (movieGenres.length > 0) {
          setGenres(movieGenres);
        }
        
        // Extrair classificação etária
        const rating = extractAgeRating(details, mediaType);
        setAgeRating(rating);
        
        // Contar episódios para séries
        if (mediaType === 'tv' && details.number_of_episodes) {
          setEpisodes(details.number_of_episodes);
        }
        
        // Contar temporadas para séries
        if (mediaType === 'tv' && details.number_of_seasons) {
          setSeasons(details.number_of_seasons);
        }
        
        // Extrair ano de lançamento
        if (details.release_date) {
          setReleaseYear(new Date(details.release_date).getFullYear().toString());
        } else if (details.first_air_date) {
          setReleaseYear(new Date(details.first_air_date).getFullYear().toString());
        }
      } catch (error) {
        console.error('❌ Erro ao buscar detalhes do TMDB:', error);
      }
    };

    // Buscar detalhes quando o usuário passar o mouse
    if (isHovered && !logoPath && !genres.length) {
      console.log('🔍 Buscando detalhes do TMDB para:', title, '(ID:', movie.id, ', Type:', mediaType, ')');
      fetchDetails();
    }
  }, [isHovered, movie.id, mediaType, logoPath, genres.length, title]);

  return (
    <div
      className="relative group cursor-pointer touch-manipulation"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* CARD NORMAL - Imagem Horizontal (Backdrop) - Permanece Visível no Hover (Estilo Netflix) */}
      <div className="relative rounded-md overflow-hidden shadow-lg transition-all duration-300 group-hover:opacity-0">
        <div 
          className="relative w-full aspect-[16/9] bg-[#141414] overflow-hidden"
          onClick={() => {
            console.log('🎬 MovieCard onClick:', movie.title || movie.name, 'ID:', movie.id);
            onClick?.();
          }}
        >
          <OptimizedImage
            src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
            alt={title}
            className="w-full h-full object-cover"
            priority={false}
            blur={true}
            quality={75}
            width={500}
            height={281}
            useProxy={false}
          />
          
          {/* Logo do Filme/Série - Canto Inferior Esquerdo */}
          {logoPath && (
            <div className="absolute bottom-1 md:bottom-2 left-1 md:left-2 max-w-[60%] z-10">
              <img
                src={getImageUrl(logoPath, 'w300')}
                alt={`${title} logo`}
                className="w-full h-auto max-h-6 md:max-h-10 object-contain drop-shadow-lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* EXPANDED HOVER CARD - Estilo Netflix - 30% MAIOR */}
      <div 
        className={`absolute top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
          isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ 
          transformOrigin: 'center top',
          width: '390px' // 300px + 30% = 390px
        }}
      >
        <div className="bg-[#181818] rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700">
          {/* Imagem Grande - Horizontal */}
          <div className="relative aspect-[16/9] overflow-hidden">
            <OptimizedImage
              src={getImageUrl(movie.backdrop_path || movie.poster_path, 'w780')}
              alt={title}
              className="w-full h-full object-cover"
              priority={true}
              blur={true}
              quality={85}
              width={780}
              height={439}
              useProxy={false}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent pointer-events-none" />
            
            {/* Volume Icon - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <button className="w-9 h-9 rounded-full border-2 border-white/60 hover:border-white bg-transparent/40 backdrop-blur-sm flex items-center justify-center transition-colors">
                <Volume2 className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Content Info */}
          <div className="p-5">
            {/* Logo do Filme/Série ou Título */}
            {logoPath ? (
              <div className="flex items-center justify-start mb-4">
                <img
                  src={getImageUrl(logoPath, 'w500')}
                  alt={`${title} logo`}
                  className="max-w-[60%] h-auto max-h-16 object-contain"
                />
              </div>
            ) : (
              <h3 className="text-white text-xl font-bold mb-4 line-clamp-2">
                {title}
              </h3>
            )}
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 mb-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  // ✅ Se tem streamUrl e onPlay, reproduzir diretamente
                  if ((movie as any).streamUrl && onPlay) {
                    console.log('🎬 MovieCard: Reproduzindo diretamente:', movie.title || movie.name);
                    console.log('📡 streamUrl:', (movie as any).streamUrl);
                    onPlay(movie);
                  } else {
                    // Fallback: abrir detalhes
                    console.log('🎬 MovieCard: Abrindo detalhes (sem streamUrl ou onPlay)');
                    onClick?.();
                  }
                }}
                className="bg-white hover:bg-gray-200 text-black px-6 py-2 rounded-full flex items-center gap-2 transition-colors font-bold"
              >
                <Play className="w-5 h-5" fill="currentColor" />
                <span>Assistir</span>
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToList();
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                  inMyList 
                    ? 'border-white bg-white hover:bg-gray-200' 
                    : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                }`}
                title={inMyList ? 'Remover da Minha Lista' : 'Adicionar à Minha Lista'}
              >
                {inMyList ? (
                  <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                ) : (
                  <Plus className="w-5 h-5 text-white" />
                )}
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                  inFavorites
                    ? 'border-[#E50914] bg-[#E50914] hover:bg-[#f40612]'
                    : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                }`}
                title={inFavorites ? 'Remover Gostei' : 'Gostei'}
              >
                <ThumbsUp className={`w-5 h-5 ${inFavorites ? 'text-white' : 'text-white'}`} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleWatchLater();
                }}
                className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all ${
                  inWatchLater
                    ? 'border-blue-500 bg-blue-500 hover:bg-blue-600'
                    : 'border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                }`}
                title={inWatchLater ? 'Remover de Assistir Mais Tarde' : 'Assistir Mais Tarde'}
              >
                <Clock className={`w-5 h-5 text-white`} />
              </button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                className="w-9 h-9 rounded-full border-2 border-gray-400 hover:border-white bg-[#2a2a2a] hover:bg-[#3a3a3a] flex items-center justify-center transition-colors ml-auto"
              >
                <ChevronDown className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Match, Age Rating and Info */}
            <div className="flex items-center gap-2 mb-3 text-sm flex-wrap">
              <span className="text-green-500 font-bold">
                {Math.round(movie.vote_average * 10)}% Match
              </span>
              {ageRating && (
                <span className="px-2 py-0.5 border-2 border-gray-400 text-white text-xs font-bold">
                  {ageRating}
                </span>
              )}
              <span className="text-gray-400 text-sm">
                {releaseYear}
              </span>
              <span className="px-1.5 border border-gray-500 text-gray-400 text-xs">HD</span>
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-white mb-3">
                {genres.map((genre, idx) => (
                  <span key={genre}>
                    {genre}
                    {idx < genres.length - 1 && <span className="mx-1.5 text-gray-500">•</span>}
                  </span>
                ))}
              </div>
            )}

            {/* Description/Overview */}
            {movie.overview && (
              <p className="text-gray-400 text-sm mb-3 line-clamp-3">
                {movie.overview}
              </p>
            )}

            {/* Seasons and Episodes info for TV shows */}
            {mediaType === 'tv' && (seasons > 0 || episodes > 0) && (
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                {seasons > 0 && (
                  <span className="font-semibold">
                    {seasons} temporada{seasons > 1 ? 's' : ''}
                  </span>
                )}
                {seasons > 0 && episodes > 0 && <span className="text-gray-600">•</span>}
                {episodes > 0 && (
                  <span>
                    {episodes} episódio{episodes > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
