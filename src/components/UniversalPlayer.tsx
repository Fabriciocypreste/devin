import { useState, useEffect, useRef } from 'react';
import { Movie, getTitle } from '../utils/tmdb';
import Hls from 'hls.js';

// Icons inline
const X = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Play = ({ size = 64 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const ChevronLeft = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

interface UniversalPlayerProps {
  movie: Movie;
  streamUrl: string | null;
  trailerUrl?: string | null;
  onClose: () => void;
}

export function UniversalPlayer({ movie, streamUrl, trailerUrl, onClose }: UniversalPlayerProps) {
  const [playerMode, setPlayerMode] = useState<'stream' | 'trailer' | 'placeholder'>('placeholder');
  const [isLoading, setIsLoading] = useState(true);
  const [playerError, setPlayerError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const title = getTitle(movie);
  const mediaType = movie.first_air_date ? 'tv' : 'movie';

  useEffect(() => {
    // Determinar qual player usar
    if (streamUrl) {
      setPlayerMode('stream');
      console.log('🎬 Player Mode: STREAM');
      console.log('📡 Stream URL:', streamUrl);
    } else if (trailerUrl) {
      setPlayerMode('trailer');
      console.log('🎬 Player Mode: TRAILER (YouTube)');
      console.log('🎥 Trailer Key:', trailerUrl);
    } else {
      setPlayerMode('placeholder');
      console.log('🎬 Player Mode: PLACEHOLDER');
    }
    
    setIsLoading(false);
  }, [streamUrl, trailerUrl]);

  // Initialize HLS player for stream URLs
  useEffect(() => {
    if (playerMode !== 'stream' || !streamUrl || !videoRef.current) return;

    const video = videoRef.current;
    const isHlsStream = streamUrl.includes('.m3u8');
    const isMp4Stream = streamUrl.includes('.mp4');

    // Cleanup previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isMp4Stream) {
      // Direct MP4 playback
      video.src = streamUrl;
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado:', err.message);
      });
    } else if (isHlsStream && Hls.isSupported()) {
      // HLS playback
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 20000,
        levelLoadingTimeOut: 20000,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ HLS Manifest carregado');
        video.play().catch(err => {
          console.warn('⚠️ Autoplay bloqueado:', err.message);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data);
        if (data.fatal) {
          setPlayerError(`Erro ao reproduzir: ${data.details || 'Erro desconhecido'}`);
          hls.destroy();
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS
      video.src = streamUrl;
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado:', err.message);
      });
    } else {
      // Fallback: try direct playback
      video.src = streamUrl;
      video.play().catch(err => {
        console.warn('⚠️ Erro ao reproduzir:', err.message);
        setPlayerError('Formato de vídeo não suportado');
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [playerMode, streamUrl]);

  return (
    <div className="fixed inset-0 bg-black/98 z-[60] flex items-center justify-center p-4">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-6 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Botão Voltar */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white hover:text-[#E50914] transition-colors group"
            >
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#E50914] transition-colors">
                <ChevronLeft size={24} />
              </div>
              <span className="font-['Inter:Semi_Bold',sans-serif] text-[16px]">
                Voltar
              </span>
            </button>

            {/* Título */}
            <div className="ml-6">
              <h2 className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {title}
              </h2>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                {mediaType === 'tv' ? 'Série' : 'Filme'}
                {streamUrl ? ' • Reproduzindo' : trailerUrl ? ' • Trailer' : ''}
              </p>
            </div>
          </div>

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-red-600 p-2 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="relative w-full max-w-7xl aspect-video">
        {isLoading ? (
          <div className="w-full h-full bg-[#000] rounded flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-white font-['Inter:Medium',sans-serif]">Carregando...</p>
            </div>
          </div>
        ) : playerMode === 'stream' && streamUrl ? (
          // Player de Stream (MP4/HLS nativo)
          <div className="w-full h-full bg-black rounded overflow-hidden relative">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              autoPlay
              playsInline
              onClick={(e) => {
                const video = e.currentTarget;
                if (video.paused) {
                  video.play().catch(console.error);
                }
              }}
            />
            {/* Error Overlay */}
            {playerError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/90">
                <div className="text-center p-8 max-w-md">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">Erro ao reproduzir</h3>
                  <p className="text-gray-400 mb-6">{playerError}</p>
                  <button
                    onClick={() => {
                      setPlayerError(null);
                      if (videoRef.current) {
                        videoRef.current.load();
                        videoRef.current.play().catch(console.error);
                      }
                    }}
                    className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-[#f40612] transition"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : playerMode === 'trailer' && trailerUrl ? (
          // Player de Trailer (YouTube)
          <div className="w-full h-full bg-black rounded overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailerUrl}?autoplay=1&rel=0`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
              title={`${title} - Trailer`}
            />
          </div>
        ) : (
          // Placeholder (sem URL disponível)
          <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-black rounded flex items-center justify-center">
            <div className="text-center max-w-md p-8">
              <Play size={64} className="text-white/30 mx-auto mb-6" />
              
              <h3 className="text-white font-['Inter:Bold',sans-serif] text-[24px] mb-4">
                Conteúdo Indisponível
              </h3>
              
              <p className="text-white/70 font-['Inter:Regular',sans-serif] text-[16px] mb-6">
                A URL de streaming para <span className="text-red-600 font-['Inter:Semi_Bold',sans-serif]">"{title}"</span> não está disponível.
              </p>
              
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6">
                <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[14px] mb-2">
                  Para assistir este {mediaType === 'tv' ? 'série' : 'filme'}:
                </p>
                <ol className="text-white/50 font-['Inter:Regular',sans-serif] text-[13px] text-left space-y-2">
                  <li>1. Adicione a URL de streaming no arquivo JSON</li>
                  <li>2. Configure seu serviço de streaming</li>
                  <li>3. Recarregue a página</li>
                </ol>
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="flex items-center gap-2 bg-red-600/10 border border-red-600/30 rounded px-3 py-2">
                  <span className="text-red-500 font-['Inter:Bold',sans-serif] text-[12px]">TMDB ID:</span>
                  <span className="text-white font-['Inter:Medium',sans-serif] text-[12px]">{movie.id}</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/30 rounded px-3 py-2">
                  <span className="text-blue-500 font-['Inter:Bold',sans-serif] text-[12px]">TIPO:</span>
                  <span className="text-white font-['Inter:Medium',sans-serif] text-[12px]">
                    {mediaType === 'tv' ? 'Série' : 'Filme'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Badge */}
      {streamUrl && (
        <div className="absolute bottom-8 left-8 bg-green-600/20 border border-green-600/50 rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
              REPRODUZINDO STREAM REAL
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
