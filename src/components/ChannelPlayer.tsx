/**
 * 📺 CHANNEL PLAYER - Player de Canais IPTV
 * 
 * Player nativo HTML5 para canais ao vivo com:
 * - Logo do canal (canto superior esquerdo)
 * - Nome do canal (canto superior esquerdo)
 * - Indicador "AO VIVO" (canto superior direito)
 * - Controles nativos do navegador
 * - Suporte para M3U8, MP4, TS
 */

import { useRef, useEffect, useState } from 'react';

// Tipo para HLS.js (será carregado dinamicamente)
declare const Hls: any;

interface ChannelPlayerProps {
  channel: {
    id: number;
    name: string;
    logo?: string;
    streamUrl: string;
    group?: string;
  };
  onClose: () => void;
}

// Icons
const X = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Volume2 = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const VolumeX = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

const Radio = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
  </svg>
);

export function ChannelPlayer({ channel, onClose }: ChannelPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('📺 Carregando canal:', channel.name);
    console.log('📡 Stream URL:', channel.streamUrl);

    // Limpar HLS anterior se existir
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const streamUrl = channel.streamUrl;
    const isM3U8 = streamUrl.includes('.m3u8') || streamUrl.includes('m3u8');

    if (isM3U8 && Hls.isSupported()) {
      // HLS.js para M3U8
      console.log('🔄 Usando HLS.js para M3U8');
      
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 600,
        maxBufferSize: 60 * 1000 * 1000,
        maxBufferHole: 0.5,
      });

      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifesto M3U8 parseado');
        video.play().catch(err => {
          console.warn('⚠️ Autoplay bloqueado:', err);
          setError('Clique para reproduzir');
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ Erro HLS:', data);
        
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('❌ Erro de rede, tentando recuperar...');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('❌ Erro de mídia, tentando recuperar...');
              hls.recoverMediaError();
              break;
            default:
              console.error('❌ Erro fatal irrecuperável');
              setError('Erro ao carregar stream');
              hls.destroy();
              break;
          }
        }
      });

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari nativo
      console.log('🔄 Usando player nativo do Safari');
      video.src = streamUrl;
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado:', err);
        setError('Clique para reproduzir');
      });

    } else {
      // Vídeo direto (MP4, TS, etc)
      console.log('🔄 Usando player nativo para vídeo direto');
      video.src = streamUrl;
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado:', err);
        setError('Clique para reproduzir');
      });
    }

    // Event listeners
    const handlePlay = () => {
      setIsPlaying(true);
      setError(null);
    };
    
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);

    // Cleanup
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.streamUrl, channel.name]);

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
      {/* Video Container */}
      <div className="relative w-full h-full" onClick={handleClickToPlay}>
        {/* Video Element */}
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          onClick={handlePlayPause}
        />

        {/* Overlay Container (só aparece quando showControls é true) */}
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Top Overlay - Channel Info */}
          <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-6 pointer-events-auto">
            <div className="flex items-start justify-between">
              {/* Channel Logo + Name */}
              <div className="flex items-center gap-4">
                {channel.logo && (
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="h-16 w-auto object-contain bg-black/40 rounded p-2"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div className="flex flex-col">
                  <h2 className="text-white text-2xl font-bold drop-shadow-lg">
                    {channel.name}
                  </h2>
                  {channel.group && (
                    <p className="text-white/80 text-sm drop-shadow">
                      {channel.group}
                    </p>
                  )}
                </div>
              </div>

              {/* Live Indicator + Close Button */}
              <div className="flex items-center gap-4">
                {/* Live Badge */}
                {isLive && (
                  <div className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-full">
                    <Radio className="w-4 h-4 text-white animate-pulse" />
                    <span className="text-white font-semibold text-sm">AO VIVO</span>
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="w-10 h-10 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
                  aria-label="Fechar"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pointer-events-auto">
            <div className="flex items-center gap-4">
              {/* Volume Controls */}
              <button
                onClick={handleMuteToggle}
                className="text-white hover:text-red-500 transition-colors"
                aria-label={isMuted ? "Ativar som" : "Silenciar"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-6 h-6" />
                ) : (
                  <Volume2 className="w-6 h-6" />
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
                  [&::-webkit-slider-thumb]:cursor-pointer
                  [&::-moz-range-thumb]:w-3
                  [&::-moz-range-thumb]:h-3
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-pointer"
              />

              {/* Channel Name (bottom) */}
              <div className="flex-1 text-center">
                <p className="text-white text-sm font-medium">
                  Assistindo canal ao vivo
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Error Overlay */}
        {error && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center pointer-events-auto">
            <div className="text-center">
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
                Clique para Reproduzir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}