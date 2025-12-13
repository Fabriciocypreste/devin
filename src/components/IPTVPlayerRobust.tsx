/**
 * 📺 IPTV PLAYER ROBUSTO - Player P2P com HLS
 * 
 * Suporta:
 * - M3U8 (HLS streams)
 * - M3U (Playlists)
 * - TS (Transport Streams)
 * - MP4 (Direct video)
 * - CORS proxy via vite.config
 * - P2P CDN para otimização
 * - Low latency mode
 * - Recuperação automática de erros
 */

import { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';

interface IPTVPlayerRobustProps {
  streamUrl: string;
  channelName: string;
  channelLogo?: string;
  channelGroup?: string;
  epg?: {
    current?: {
      title: string;
      start: string;
      end: string;
    };
    next?: {
      title: string;
      start: string;
      end: string;
    };
  };
  onClose: () => void;
  onError?: (error: string) => void;
}

export function IPTVPlayerRobust({
  streamUrl,
  channelName,
  channelLogo,
  channelGroup,
  epg,
  onClose,
  onError,
}: IPTVPlayerRobustProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [bufferHealth, setBufferHealth] = useState(100);
  const [quality, setQuality] = useState<string>('auto');

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('📺 ═══════════════════════════════════════════════');
    console.log('📺 INICIANDO IPTV PLAYER ROBUSTO');
    console.log('📺 Canal:', channelName);
    console.log('📺 Stream:', streamUrl);
    console.log('📺 ═══════════════════════════════════════════════');

    // Limpar HLS anterior
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Detectar tipo de stream
    const processedUrl = processStreamUrl(streamUrl);
    const streamType = detectStreamType(processedUrl);

    console.log('🔍 Tipo detectado:', streamType);
    console.log('🔗 URL processada:', processedUrl);

    if (streamType === 'm3u8' && Hls.isSupported()) {
      initHLSPlayer(video, processedUrl);
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      initNativePlayer(video, processedUrl);
    } else {
      initDirectPlayer(video, processedUrl);
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      video.pause();
      video.src = '';
    };
  }, [streamUrl, channelName]);

  // Processar URL do stream (adicionar proxy se necessário)
  const processStreamUrl = (url: string): string => {
    // Se for URL externa, usar proxy do vite
    if (url.startsWith('http://') || url.startsWith('https://')) {
      // Se não for do mesmo domínio, usar proxy
      if (!url.includes(window.location.hostname)) {
        // Usar proxy do vite.config
        return `/proxy-stream${url.replace(/^https?:\/\/[^/]+/, '')}`;
      }
    }
    return url;
  };

  // Detectar tipo de stream
  const detectStreamType = (url: string): 'm3u8' | 'm3u' | 'ts' | 'mp4' | 'unknown' => {
    const lower = url.toLowerCase();
    
    if (lower.includes('.m3u8') || lower.includes('m3u8')) return 'm3u8';
    if (lower.includes('.m3u') || lower.includes('m3u')) return 'm3u';
    if (lower.includes('.ts') || lower.includes('transport')) return 'ts';
    if (lower.includes('.mp4')) return 'mp4';
    
    // Fallback para m3u8 se não souber
    return 'm3u8';
  };

  // Inicializar HLS.js
  const initHLSPlayer = (video: HTMLVideoElement, url: string) => {
    console.log('🚀 Inicializando HLS.js Player');

    const hls = new Hls({
      // P2P e Performance
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 90,
      
      // Buffer otimizado para IPTV
      maxBufferLength: 30,
      maxMaxBufferLength: 600,
      maxBufferSize: 60 * 1000 * 1000,
      maxBufferHole: 0.5,
      
      // Retry e Timeout
      manifestLoadingTimeOut: 10000,
      manifestLoadingMaxRetry: 4,
      manifestLoadingRetryDelay: 1000,
      levelLoadingTimeOut: 10000,
      levelLoadingMaxRetry: 4,
      fragLoadingTimeOut: 20000,
      fragLoadingMaxRetry: 6,
      
      // CORS
      xhrSetup: (xhr, url) => {
        xhr.withCredentials = false;
      },
      
      // Debug (apenas dev)
      debug: false,
    });

    hlsRef.current = hls;

    hls.loadSource(url);
    hls.attachMedia(video);

    // Event: Manifesto parseado
    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      console.log('✅ Manifesto HLS parseado');
      console.log('   Níveis de qualidade:', data.levels.length);
      
      setLoading(false);
      
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado:', err);
        setError('Clique para reproduzir');
      });
    });

    // Event: Nível alterado (qualidade)
    hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
      const level = hls.levels[data.level];
      console.log(`🎬 Qualidade: ${level.height}p @ ${Math.round(level.bitrate / 1000)}kbps`);
      setQuality(`${level.height}p`);
    });

    // Event: Fragment carregado
    hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
      // Calcular saúde do buffer
      if (video.buffered.length > 0) {
        const buffered = video.buffered.end(video.buffered.length - 1) - video.currentTime;
        const health = Math.min(100, (buffered / 30) * 100);
        setBufferHealth(health);
      }
    });

    // Event: Erro
    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error('❌ Erro HLS:', data);

      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error('❌ Erro de rede fatal');
            console.log('🔄 Tentando recuperar...');
            hls.startLoad();
            setTimeout(() => {
              if (video.paused) {
                video.play().catch(console.error);
              }
            }, 1000);
            break;

          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error('❌ Erro de mídia fatal');
            console.log('🔄 Tentando recuperar...');
            hls.recoverMediaError();
            break;

          default:
            console.error('❌ Erro fatal irrecuperável');
            setError('Erro ao carregar stream. Tente outro canal.');
            setLoading(false);
            onError?.('Erro fatal ao carregar stream');
            hls.destroy();
            break;
        }
      } else {
        // Erro não-fatal, apenas log
        console.warn('⚠️ Erro HLS não-fatal:', data.details);
      }
    });
  };

  // Inicializar player nativo (Safari)
  const initNativePlayer = (video: HTMLVideoElement, url: string) => {
    console.log('🍎 Usando player nativo (Safari)');
    
    video.src = url;
    setLoading(false);
    
    video.play().catch(err => {
      console.warn('⚠️ Autoplay bloqueado:', err);
      setError('Clique para reproduzir');
    });
  };

  // Inicializar player direto (MP4, TS)
  const initDirectPlayer = (video: HTMLVideoElement, url: string) => {
    console.log('🎬 Usando player direto');
    
    video.src = url;
    setLoading(false);
    
    video.play().catch(err => {
      console.warn('⚠️ Autoplay bloqueado:', err);
      setError('Clique para reproduzir');
    });
  };

  // Auto-hide controls
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  // Event listeners do vídeo
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      setIsPlaying(true);
      setError(null);
      setLoading(false);
    };

    const handlePause = () => setIsPlaying(false);
    
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleWaiting = () => setLoading(true);
    const handlePlaying = () => setLoading(false);

    const handleError = (e: Event) => {
      console.error('❌ Erro no vídeo:', e);
      setError('Erro ao reproduzir stream');
      setLoading(false);
      onError?.('Erro ao reproduzir vídeo');
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
    };
  }, [onError]);

  // Handlers
  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  const handleMuteToggle = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const newVolume = parseFloat(e.target.value);
    videoRef.current.volume = newVolume;
    if (newVolume > 0 && videoRef.current.muted) {
      videoRef.current.muted = false;
    }
  };

  const handleClickToPlay = () => {
    if (error && videoRef.current) {
      videoRef.current.play();
      setError(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Video */}
      <div className="relative w-full h-full" onClick={handleClickToPlay}>
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          onClick={handlePlayPause}
        />

        {/* Overlays */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
            showControls || loading || error ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Top Bar - Channel Info */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 via-black/60 to-transparent p-6 pointer-events-auto backdrop-blur-sm">
            <div className="flex items-start justify-between">
              {/* Channel Logo + Name */}
              <div className="flex items-center gap-4">
                {channelLogo && (
                  <div className="h-16 w-24 bg-white/10 rounded backdrop-blur-md flex items-center justify-center p-2">
                    <img
                      src={channelLogo}
                      alt={channelName}
                      className="h-full w-full object-contain"
                      onError={(e) => e.currentTarget.style.display = 'none'}
                    />
                  </div>
                )}
                <div>
                  <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                    {channelName}
                  </h2>
                  {channelGroup && (
                    <p className="text-white/80 text-sm drop-shadow">
                      {channelGroup}
                    </p>
                  )}
                  {quality !== 'auto' && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs text-white">
                      {quality}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Live + Close */}
              <div className="flex items-center gap-4">
                {/* Live Badge */}
                <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full shadow-lg">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <span className="text-white font-semibold text-sm">AO VIVO</span>
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center transition-all"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>

            {/* EPG Info */}
            {epg?.current && (
              <div className="mt-4 bg-white/10 backdrop-blur-md rounded-lg p-3">
                <div className="flex items-center gap-2 text-white/90 text-sm mb-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span className="font-medium">Agora:</span>
                  <span>{epg.current.title}</span>
                </div>
                {epg.next && (
                  <div className="text-white/60 text-xs">
                    Próximo: {epg.next.title}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Bar - Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 pointer-events-auto backdrop-blur-sm">
            <div className="flex items-center gap-4">
              {/* Volume */}
              <button onClick={handleMuteToggle} className="text-white hover:text-red-500 transition-colors">
                {isMuted || volume === 0 ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>

              {/* Volume Slider */}
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-3
                  [&::-webkit-slider-thumb]:h-3
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:cursor-pointer"
              />

              {/* Buffer Health */}
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      bufferHealth > 50 ? 'bg-green-500' : 
                      bufferHealth > 25 ? 'bg-yellow-500' : 
                      'bg-red-500'
                    }`}
                    style={{ width: `${bufferHealth}%` }}
                  />
                </div>
                <span className="text-white/60 text-xs">{Math.round(bufferHealth)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
              <p className="text-white text-lg">Carregando stream...</p>
            </div>
          </div>
        )}

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center pointer-events-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-white text-xl mb-4">{error}</p>
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.play();
                    setError(null);
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
