import { useState, useEffect, useRef, useCallback } from 'react';
import { Movie, getTitle } from '../utils/tmdb';
import { useAuth } from '../contexts/AuthContext';
import Hls from 'hls.js';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3333';

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

interface NextEpisode {
  id: number;
  seasonNumber: number;
  episodeNumber: number;
  name: string | null;
  streamUrl: string | null;
  runtime: number | null;
  stillPath: string | null;
}

interface UniversalPlayerProps {
  movie: Movie;
  streamUrl: string | null;
  trailerUrl?: string | null;
  onClose: () => void;
  contentId?: number;
  episodeId?: number;
  onNextEpisode?: (episode: NextEpisode) => void;
}

export function UniversalPlayer({ 
  movie, 
  streamUrl, 
  trailerUrl, 
  onClose, 
  contentId,
  episodeId,
  onNextEpisode 
}: UniversalPlayerProps) {
  const { userId } = useAuth(); // Obter userId do contexto de autenticacao
    const [playerMode, setPlayerMode] = useState<'stream' | 'trailer' | 'placeholder'>('placeholder');
    const [isLoading, setIsLoading] = useState(true);
    const [playerError, setPlayerError] = useState<string | null>(null);
    const [subscriptionError, setSubscriptionError] = useState<{ code: string; message: string } | null>(null);
    const [nextEpisode, setNextEpisode] = useState<NextEpisode | null>(null);
    const [showNextEpisodeCountdown, setShowNextEpisodeCountdown] = useState(false);
    const [countdown, setCountdown] = useState(10);
    const [progressLoaded, setProgressLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const saveProgressTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const title = getTitle(movie);
  const mediaType = movie.first_air_date ? 'tv' : 'movie';
  const actualContentId = contentId || movie.id;

    // Funcao para verificar subscription antes de reproduzir
    const checkSubscription = useCallback(async (): Promise<boolean> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setSubscriptionError({ code: 'NO_TOKEN', message: 'Voce precisa estar logado para assistir.' });
          return false;
        }
      
        const response = await fetch(`${API_BASE}/api/streaming/check-access`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      
        if (!response.ok) {
          const data = await response.json();
          if (data.code === 'SUBSCRIPTION_REQUIRED') {
            setSubscriptionError({ code: 'SUBSCRIPTION_REQUIRED', message: 'Voce precisa de uma assinatura ativa para assistir este conteudo.' });
            return false;
          }
          if (data.code === 'SUBSCRIPTION_EXPIRED') {
            setSubscriptionError({ code: 'SUBSCRIPTION_EXPIRED', message: 'Sua assinatura expirou. Renove para continuar assistindo.' });
            return false;
          }
        }
        return true;
      } catch (error) {
        console.error('Erro ao verificar subscription:', error);
        return true; // Em caso de erro, permitir reproducao
      }
    }, []);

    // Funcao para salvar progresso no backend
    const saveProgress = useCallback(async (currentTime: number, duration: number) => {
      try {
        await fetch(`${API_BASE}/api/progress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId,
            contentId: actualContentId,
            episodeId: episodeId || null,
            watchedTime: Math.floor(currentTime),
            duration: Math.floor(duration)
          })
        });
        console.log('Progresso salvo:', Math.floor(currentTime), 'de', Math.floor(duration), 'segundos');
      } catch (error) {
        console.error('Erro ao salvar progresso:', error);
      }
    }, [userId, actualContentId, episodeId]);

  // Funcao para carregar progresso do backend
  const loadProgress = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE}/api/progress/${actualContentId}?userId=${userId}`);
      const data = await response.json();
      
      if (data.hasProgress && data.progress && !data.progress.completed) {
        return data.progress.watchedTime;
      }
      return 0;
    } catch (error) {
      console.error('❌ Erro ao carregar progresso:', error);
      return 0;
    }
  }, [userId, actualContentId]);

  // Funcao para buscar proximo episodio
  const fetchNextEpisode = useCallback(async () => {
    if (mediaType !== 'tv') return;
    
    try {
      const url = episodeId 
        ? `${API_BASE}/api/progress/${actualContentId}/next?userId=${userId}&currentEpisodeId=${episodeId}`
        : `${API_BASE}/api/progress/${actualContentId}/next?userId=${userId}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.hasNextEpisode && data.nextEpisode) {
        setNextEpisode(data.nextEpisode);
        console.log('📺 Próximo episódio:', data.nextEpisode);
      }
    } catch (error) {
      console.error('❌ Erro ao buscar próximo episódio:', error);
    }
  }, [mediaType, actualContentId, userId, episodeId]);

  // Carregar progresso e proximo episodio ao iniciar
  useEffect(() => {
    const initPlayer = async () => {
      if (playerMode === 'stream' && videoRef.current && !progressLoaded) {
        const savedTime = await loadProgress();
        if (savedTime > 0 && videoRef.current) {
          videoRef.current.currentTime = savedTime;
          console.log('⏩ Retomando de:', savedTime, 'segundos');
        }
        setProgressLoaded(true);
      }
      
      // Buscar proximo episodio para series
      if (mediaType === 'tv') {
        await fetchNextEpisode();
      }
    };
    
    initPlayer();
  }, [playerMode, loadProgress, fetchNextEpisode, mediaType, progressLoaded]);

  // Salvar progresso periodicamente e ao pausar
  useEffect(() => {
    const video = videoRef.current;
    if (!video || playerMode !== 'stream') return;

    const handleTimeUpdate = () => {
      // Salvar a cada 10 segundos
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
      }
      saveProgressTimeoutRef.current = setTimeout(() => {
        if (video && !video.paused) {
          saveProgress(video.currentTime, video.duration);
        }
      }, 10000);
    };

    const handlePause = () => {
      if (video.currentTime > 0 && video.duration > 0) {
        saveProgress(video.currentTime, video.duration);
      }
    };

    const handleEnded = async () => {
      // Salvar como completado
      if (video.duration > 0) {
        await saveProgress(video.duration, video.duration);
      }
      
      // Mostrar countdown para proximo episodio
      if (nextEpisode && mediaType === 'tv') {
        setShowNextEpisodeCountdown(true);
        setCountdown(10);
        
        countdownIntervalRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 1) {
              if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
              }
              // Carregar proximo episodio
              if (onNextEpisode && nextEpisode) {
                onNextEpisode(nextEpisode);
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [playerMode, saveProgress, nextEpisode, mediaType, onNextEpisode]);

  // Salvar progresso ao fechar o player
  const handleClose = useCallback(() => {
    const video = videoRef.current;
    if (video && video.currentTime > 0 && video.duration > 0) {
      saveProgress(video.currentTime, video.duration);
    }
    onClose();
  }, [saveProgress, onClose]);

  // Cancelar countdown e continuar assistindo
  const cancelNextEpisode = useCallback(() => {
    setShowNextEpisodeCountdown(false);
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
  }, []);

  // Pular para proximo episodio imediatamente
  const skipToNextEpisode = useCallback(() => {
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    if (onNextEpisode && nextEpisode) {
      onNextEpisode(nextEpisode);
    }
  }, [onNextEpisode, nextEpisode]);

    useEffect(() => {
      // Verificar subscription e determinar qual player usar
      const initializePlayer = async () => {
        if (streamUrl) {
          // Verificar subscription antes de permitir streaming
          const hasAccess = await checkSubscription();
          if (!hasAccess) {
            setIsLoading(false);
            return;
          }
          setPlayerMode('stream');
          console.log('Player Mode: STREAM');
          console.log('Stream URL:', streamUrl);
        } else if (trailerUrl) {
          setPlayerMode('trailer');
          console.log('Player Mode: TRAILER (YouTube)');
          console.log('Trailer Key:', trailerUrl);
        } else {
          setPlayerMode('placeholder');
          console.log('Player Mode: PLACEHOLDER');
        }
        setIsLoading(false);
      };
    
      initializePlayer();
    }, [streamUrl, trailerUrl, checkSubscription]);

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
              onClick={handleClose}
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
            onClick={handleClose}
            className="bg-white/10 hover:bg-red-600 p-2 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Next Episode Countdown Overlay */}
      {showNextEpisodeCountdown && nextEpisode && (
        <div className="absolute bottom-24 right-8 bg-black/90 border border-white/20 rounded-xl p-6 z-20 max-w-sm">
          <div className="flex items-start gap-4">
            {nextEpisode.stillPath && (
              <img 
                src={`https://image.tmdb.org/t/p/w185${nextEpisode.stillPath}`}
                alt={nextEpisode.name || 'Próximo episódio'}
                className="w-24 h-14 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <p className="text-white/60 text-xs mb-1">Próximo episódio em {countdown}s</p>
              <p className="text-white font-semibold text-sm">
                T{nextEpisode.seasonNumber}:E{nextEpisode.episodeNumber}
              </p>
              {nextEpisode.name && (
                <p className="text-white/80 text-xs mt-1">{nextEpisode.name}</p>
              )}
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={cancelNextEpisode}
              className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition"
            >
              Cancelar
            </button>
            <button
              onClick={skipToNextEpisode}
              className="flex-1 px-3 py-2 bg-[#E50914] hover:bg-[#f40612] text-white text-sm rounded-lg transition"
            >
              Reproduzir Agora
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#E50914] transition-all duration-1000"
              style={{ width: `${(10 - countdown) * 10}%` }}
            />
          </div>
        </div>
      )}

            {/* Video Player */}
            <div className="relative w-full max-w-7xl aspect-video">
              {subscriptionError ? (
                <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-black rounded flex items-center justify-center">
                  <div className="text-center max-w-md p-8">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-600/20 flex items-center justify-center">
                      <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-white font-['Inter:Bold',sans-serif] text-[24px] mb-4">
                      {subscriptionError.code === 'SUBSCRIPTION_EXPIRED' ? 'Assinatura Expirada' : 'Assinatura Necessaria'}
                    </h3>
                    <p className="text-white/70 font-['Inter:Regular',sans-serif] text-[16px] mb-6">
                      {subscriptionError.message}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleClose}
                        className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                      >
                        Voltar
                      </button>
                      <button
                        onClick={() => window.location.href = '/planos'}
                        className="px-6 py-3 bg-[#E50914] text-white rounded-lg hover:bg-[#f40612] transition"
                      >
                        Ver Planos
                      </button>
                    </div>
                  </div>
                </div>
              ) : isLoading ? (
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
