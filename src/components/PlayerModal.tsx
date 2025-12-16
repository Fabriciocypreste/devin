/**
 * 🎬 Player Modal para Canais IPTV
 * 
 * Player fullscreen com suporte a:
 * - Streams .ts via HLS.js
 * - Controles de vídeo nativos
 * - Modo fullscreen
 */

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Channel } from '../services/m3uParser';

interface PlayerModalProps {
  channel: Channel | null;
  onClose: () => void;
}

export function PlayerModal({ channel, onClose }: PlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryTrigger, setRetryTrigger] = useState(0); // For manual retry

  useEffect(() => {
    if (!channel || !videoRef.current) return;

    const video = videoRef.current;
    setError(null);
    setIsLoading(true);

    console.log('🎬 Iniciando player para:', channel.name);
    console.log('📡 URL:', channel.url);

    // Cleanup anterior
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Para streams .ts, usar HLS.js
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 20000,
      });

      hls.loadSource(channel.url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifest carregado');
        setIsLoading(false);
        video.play().catch(err => {
          console.warn('⚠️ Autoplay bloqueado:', err);
          setError('Clique no vídeo para iniciar a reprodução');
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('❌ HLS Error:', data);
        
        if (data.fatal) {
          setIsLoading(false);
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError('Erro de rede. Canal pode estar offline.');
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError('Erro de mídia. Tentando recuperar...');
              hls.recoverMediaError();
              break;
            default:
              setError('Erro ao reproduzir stream');
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari suporte nativo HLS
      video.src = channel.url;
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado:', err);
        setError('Clique no vídeo para iniciar a reprodução');
      });
      setIsLoading(false);
    } else {
      setError('Seu navegador não suporta reprodução HLS');
      setIsLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel, retryTrigger]); // Include retryTrigger to allow manual retries

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'f' && videoRef.current) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          videoRef.current.requestFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!channel) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Video Player */}
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls
        autoPlay
        playsInline
        onClick={(e) => {
          // Tentar reproduzir se pausado
          if (videoRef.current?.paused) {
            videoRef.current.play().catch(console.error);
          }
        }}
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white text-lg">Carregando stream...</p>
          </div>
        </div>
      )}

      {/* Error Overlay */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center p-8 max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">Erro ao reproduzir</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => {
                  setError(null);
                  setIsLoading(true);
                  // Trigger retry by incrementing retryTrigger
                  setRetryTrigger(prev => prev + 1);
                }}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
              >
                Tentar Novamente
              </button>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar with Channel Info */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {channel.logo && (
              <img
                src={channel.logo}
                alt={channel.name}
                className="w-12 h-12 object-contain"
              />
            )}
            <div>
              <h2 className="text-white text-xl font-bold">{channel.name}</h2>
              <p className="text-gray-400 text-sm">{channel.group}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="absolute bottom-20 left-4 text-white/60 text-sm opacity-0 hover:opacity-100 transition-opacity">
        <p>Esc: Fechar • F: Fullscreen</p>
      </div>
    </div>
  );
}
