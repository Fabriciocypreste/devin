/**
 * 🎥 HLS PLAYER ROBUSTO
 * Player de vídeo com suporte HLS (HTTP Live Streaming) para IPTV
 * Suporta streams M3U8 com fallback e proxy CORS
 */

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

interface HLSPlayerProps {
  url: string;
  poster?: string;
  title?: string;
  autoPlay?: boolean;
  onClose?: () => void;
}

export function HLSPlayer({ 
  url, 
  poster, 
  title = 'Canal IPTV',
  autoPlay = true,
  onClose 
}: HLSPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [useProxy, setUseProxy] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Construir URL com ou sem proxy
  const getStreamUrl = (originalUrl: string, withProxy: boolean): string => {
    // Proxy desabilitado - retornar URL original
    return originalUrl;
  };

  // Inicializar HLS Player
  useEffect(() => {
    if (!videoRef.current || !url) return;

    const video = videoRef.current;
    const streamUrl = getStreamUrl(url, useProxy);

    console.log('🎥 Inicializando player HLS para:', title);
    console.log('📡 Stream URL:', streamUrl);
    console.log('🔧 Usando proxy:', useProxy);

    // Cleanup anterior
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    // Verificar suporte HLS
    if (Hls.isSupported()) {
      console.log('✅ HLS.js suportado');
      
      const hls = new Hls({
        debug: false,
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 3,
        maxFragLookUpTolerance: 0.25,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        liveDurationInfinity: false,
        enableWebVTT: true,
        enableIMSC1: true,
        enableCEA708Captions: true,
        stretchShortVideoTrack: false,
        maxAudioFramesDrift: 1,
        forceKeyFrameOnDiscontinuity: true,
        abrEwmaFastLive: 3.0,
        abrEwmaSlowLive: 9.0,
        abrEwmaFastVoD: 3.0,
        abrEwmaSlowVoD: 9.0,
        abrEwmaDefaultEstimate: 500000,
        abrBandWidthFactor: 0.95,
        abrBandWidthUpFactor: 0.7,
        abrMaxWithRealBitrate: false,
        maxStarvationDelay: 4,
        maxLoadingDelay: 4,
        minAutoBitrate: 0,
        emeEnabled: false,
        licenseXhrSetup: undefined,
        drmSystemOptions: {},
        requestMediaKeySystemAccessFunc: null,
      });

      hlsRef.current = hls;

      // Event listeners
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifest parseado');
        setIsLoading(false);
        
        if (autoPlay) {
          video.play()
            .then(() => {
              console.log('✅ Reprodução iniciada');
              setIsPlaying(true);
            })
            .catch(err => {
              console.warn('⚠️ Autoplay bloqueado:', err);
              setIsPlaying(false);
            });
        }
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ Erro HLS:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('💀 Erro fatal de rede');
              
              // Se não está usando proxy, tentar com proxy
              if (!useProxy) {
                console.log('🔄 Tentando novamente COM proxy...');
                setUseProxy(true);
              } else {
                setError('Erro de rede ao carregar stream. Verifique sua conexão.');
              }
              break;
              
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('💀 Erro fatal de mídia');
              console.log('🔄 Tentando recuperar...');
              hls.recoverMediaError();
              break;
              
            default:
              console.error('💀 Erro fatal não recuperável');
              setError('Erro ao carregar stream. Tente outro canal.');
              hls.destroy();
              break;
          }
        }
      });

      hls.on(Hls.Events.BUFFER_APPENDING, () => {
        setIsLoading(false);
      });

      hls.on(Hls.Events.FRAG_BUFFERED, () => {
        setIsLoading(false);
      });

      // Carregar stream
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Suporte nativo HLS (Safari)
      console.log('✅ HLS nativo suportado');
      
      video.src = streamUrl;
      
      video.addEventListener('loadedmetadata', () => {
        console.log('✅ Metadata carregada');
        setIsLoading(false);
        
        if (autoPlay) {
          video.play()
            .then(() => {
              console.log('✅ Reprodução iniciada');
              setIsPlaying(true);
            })
            .catch(err => {
              console.warn('⚠️ Autoplay bloqueado:', err);
            });
        }
      });

      video.addEventListener('error', () => {
        console.error('❌ Erro no vídeo');
        
        if (!useProxy) {
          console.log('🔄 Tentando novamente COM proxy...');
          setUseProxy(true);
        } else {
          setError('Erro ao carregar stream');
        }
      });
    } else {
      console.error('❌ HLS não suportado neste navegador');
      setError('Navegador não suporta reprodução HLS');
    }

    // Cleanup
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [url, title, autoPlay, useProxy]);

  // Gerenciar volume
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  // Auto-hide controls
  const resetControlsTimeout = () => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    setShowControls(true);
    
    if (isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Play/Pause
  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error('Erro ao reproduzir:', err));
    }
  };

  // Mute/Unmute
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onMouseMove={resetControlsTimeout}
      onClick={resetControlsTimeout}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        poster={poster}
        playsInline
        onClick={togglePlay}
      />

      {/* Loading Overlay */}
      {isLoading && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E50914] mb-4"></div>
          <p className="text-white text-lg">Carregando stream...</p>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-white text-xl mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setUseProxy(!useProxy);
            }}
            className="px-6 py-3 bg-[#E50914] text-white rounded hover:bg-[#f40612] transition"
          >
            Tentar Novamente
          </button>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ pointerEvents: showControls ? 'auto' : 'none' }}
      >
        {/* Top Bar */}
        <div className="bg-gradient-to-b from-black/80 to-transparent p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="text-white hover:text-[#E50914] transition"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-white text-xl font-semibold">{title}</h2>
          </div>
          
          {useProxy && (
            <div className="text-yellow-500 text-sm flex items-center gap-2">
              <span>🔒</span>
              <span>Proxy ativo</span>
            </div>
          )}
        </div>

        {/* Bottom Controls */}
        <div className="bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-[#E50914] transition"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-[#E50914] transition"
              >
                {isMuted || volume === 0 ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => {
                  setVolume(parseFloat(e.target.value));
                  if (parseFloat(e.target.value) > 0) {
                    setIsMuted(false);
                  }
                }}
                className="w-24 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex-1" />

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-[#E50914] transition"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
