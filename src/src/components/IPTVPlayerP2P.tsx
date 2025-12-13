import React, { useEffect, useRef, useState } from 'react';
import { UsersIcon, ArrowDownIcon, ArrowUpIcon, ActivityIcon } from './Icons';

// Tipos para HLS.js e P2P Media Loader (carregados via CDN)
declare global {
  interface Window {
    Hls: any;
    p2pml: any;
  }
}

type IPTVPlayerP2PProps = {
  url?: string;
  streamUrl?: string;
  poster?: string;
  autoPlay?: boolean;
  title?: string;
  onClose?: () => void;
  enableP2P?: boolean; // Ativa/desativa P2P
};

interface P2PStats {
  peers: number;
  bytesDownloadedP2P: number;
  bytesUploadedP2P: number;
  bytesDownloadedHTTP: number;
  p2pPercentage: number;
}

/**
 * 🚀 IPTVPlayerP2P - Player HLS com suporte P2P via WebRTC
 * 
 * Usa:
 * - HLS.js para reprodução de streams .m3u8
 * - p2p-media-loader para distribuição P2P via WebRTC
 * - Tracker P2P integrado no servidor Supabase
 * 
 * Bibliotecas carregadas via CDN no index.html:
 * - hls.js
 * - p2p-media-loader-core
 * - p2p-media-loader-hlsjs
 */
export default function IPTVPlayerP2P({ 
  url, 
  streamUrl, 
  poster, 
  autoPlay = true, 
  title,
  onClose,
  enableP2P = true
}: IPTVPlayerP2PProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<any>(null);
  const engineRef = useRef<any>(null);
  
  const [p2pStats, setP2PStats] = useState<P2PStats>({
    peers: 0,
    bytesDownloadedP2P: 0,
    bytesUploadedP2P: 0,
    bytesDownloadedHTTP: 0,
    p2pPercentage: 0
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStats, setShowStats] = useState(true);
  
  const videoUrl = url || streamUrl || '';

  // Formata bytes para KB/MB
  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    return (kb / 1024).toFixed(1) + ' MB';
  };

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    console.log('🎬 Carregando stream com P2P:', videoUrl);

    // Aguarda libs carregarem do CDN
    const initPlayer = () => {
      if (!window.Hls) {
        console.warn('⏳ Aguardando HLS.js carregar...');
        setTimeout(initPlayer, 200);
        return;
      }

      // Verifica se é stream HLS (.m3u8)
      const isHLS = videoUrl.toLowerCase().includes('.m3u8');

      if (isHLS && window.Hls.isSupported() && enableP2P && window.p2pml) {
        console.log('✅ Iniciando player HLS com P2P');

        // Configuração do engine P2P
        try {
          engineRef.current = new window.p2pml.hlsjs.Engine({
            loader: {
              trackerAnnounce: [
                // Tracker P2P integrado no servidor Supabase
                `wss://${window.location.hostname}/functions/v1/make-server-2363f5d6/tracker`,
                // Fallback para tracker público
                'wss://tracker.openwebtorrent.com'
              ],
              rtcConfig: {
                iceServers: [
                  { urls: 'stun:stun.l.google.com:19302' },
                  { urls: 'stun:stun1.l.google.com:19302' }
                ]
              },
            },
            segments: {
              forwardSegmentCount: 20,
            },
          });

          console.log('✅ P2P Engine inicializado');
        } catch (err) {
          console.warn('⚠️ Erro ao inicializar P2P, usando HTTP apenas:', err);
          engineRef.current = null;
        }

        // Configuração do HLS.js com P2P
        hlsRef.current = new window.Hls({
          liveSyncDurationCount: 5,
          liveMaxLatencyDurationCount: 10,
          loader: engineRef.current ? engineRef.current.createLoaderClass() : undefined,
          debug: false,
        });

        hlsRef.current.loadSource(videoUrl);
        hlsRef.current.attachMedia(video);

        // Inicializa integração P2P + HLS.js
        if (engineRef.current && window.p2pml?.hlsjs?.initHlsJsPlayer) {
          try {
            window.p2pml.hlsjs.initHlsJsPlayer(hlsRef.current);
            console.log('✅ P2P integrado ao HLS.js');
          } catch (err) {
            console.warn('⚠️ Erro ao integrar P2P com HLS.js:', err);
          }
        }

        // Eventos HLS
        hlsRef.current.on(window.Hls.Events.MANIFEST_PARSED, () => {
          console.log('✅ Manifest HLS parseado');
          if (autoPlay) {
            video.play().catch(err => {
              console.warn('⚠️ Autoplay bloqueado:', err);
            });
          }
        });

        hlsRef.current.on(window.Hls.Events.ERROR, (event: any, data: any) => {
          console.error('❌ Erro HLS:', data);
          if (data.fatal) {
            switch (data.type) {
              case window.Hls.ErrorTypes.NETWORK_ERROR:
                console.log('🔄 Tentando recuperar erro de rede...');
                hlsRef.current?.startLoad();
                break;
              case window.Hls.ErrorTypes.MEDIA_ERROR:
                console.log('🔄 Tentando recuperar erro de mídia...');
                hlsRef.current?.recoverMediaError();
                break;
              default:
                console.error('💥 Erro fatal, recarregando player...');
                hlsRef.current?.destroy();
                break;
            }
          }
        });

      } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari/iOS com suporte HLS nativo (sem P2P)
        console.log('✅ Usando HLS nativo (Safari/iOS)');
        video.src = videoUrl;
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('⚠️ Autoplay bloqueado:', err);
          });
        }
      } else {
        // MP4 ou outro formato
        console.log('✅ Usando player HTML5 padrão');
        video.src = videoUrl;
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('⚠️ Autoplay bloqueado:', err);
          });
        }
      }
    };

    initPlayer();

    // Atualiza estatísticas P2P a cada 2 segundos
    const statsInterval = setInterval(() => {
      if (engineRef.current && engineRef.current.getStats) {
        try {
          const stats = engineRef.current.getStats();
          const totalDownloaded = (stats.http?.downloaded || 0) + (stats.p2p?.downloaded || 0);
          const p2pPercentage = totalDownloaded > 0 
            ? Math.round(((stats.p2p?.downloaded || 0) / totalDownloaded) * 100) 
            : 0;

          setP2PStats({
            peers: stats.numPeers || 0,
            bytesDownloadedP2P: stats.p2p?.downloaded || 0,
            bytesUploadedP2P: stats.p2p?.uploaded || 0,
            bytesDownloadedHTTP: stats.http?.downloaded || 0,
            p2pPercentage
          });
        } catch (err) {
          console.warn('⚠️ Erro ao obter estatísticas P2P:', err);
        }
      }
    }, 2000);

    // Cleanup
    return () => {
      clearInterval(statsInterval);
      
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      
      if (engineRef.current) {
        engineRef.current.destroy();
        engineRef.current = null;
      }
    };
  }, [videoUrl, autoPlay, enableP2P]);

  return (
    <div className="relative flex flex-col w-full h-full bg-black">
      {/* Player de Vídeo */}
      <div className="relative flex-1 flex items-center justify-center">
        <video
          ref={videoRef}
          controls
          playsInline
          poster={poster}
          className="w-full h-full max-h-[85vh] object-contain"
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={(e) => {
            console.error('❌ Erro ao carregar stream:', videoUrl);
            console.error('Detalhes:', e);
          }}
          onLoadedMetadata={() => {
            console.log('✅ Metadados carregados');
          }}
        />
        
        {/* Título */}
        {title && (
          <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-2 rounded-lg text-sm md:text-base font-semibold backdrop-blur-sm border border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>📺 {title}</span>
            </div>
          </div>
        )}
        
        {/* Badge AO VIVO */}
        {isPlaying && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#E50914] text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
            🔴 AO VIVO
          </div>
        )}
        
        {/* Botão de Fechar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-full hover:bg-[#E50914] transition-colors backdrop-blur-sm font-semibold border border-gray-700"
          >
            ✕ Fechar
          </button>
        )}
      </div>

      {/* Estatísticas P2P */}
      {enableP2P && showStats && (
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-black border-t border-gray-800 p-3">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Toggle Stats */}
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-xs text-gray-400 hover:text-white transition"
            >
              {showStats ? '▼' : '▶'} Estatísticas P2P
            </button>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6 flex-1 max-w-4xl mx-4">
              {/* Peers Conectados */}
              <div className="flex items-center gap-2 text-sm">
                <UsersIcon className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-gray-400 text-xs">Peers</div>
                  <div className="text-white font-bold">
                    {p2pStats.peers}
                  </div>
                </div>
              </div>

              {/* Download P2P */}
              <div className="flex items-center gap-2 text-sm">
                <ArrowDownIcon className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-gray-400 text-xs">P2P ↓</div>
                  <div className="text-white font-bold">
                    {formatBytes(p2pStats.bytesDownloadedP2P)}
                  </div>
                </div>
              </div>

              {/* Upload P2P */}
              <div className="flex items-center gap-2 text-sm">
                <ArrowUpIcon className="w-5 h-5 text-yellow-400" />
                <div>
                  <div className="text-gray-400 text-xs">P2P ↑</div>
                  <div className="text-white font-bold">
                    {formatBytes(p2pStats.bytesUploadedP2P)}
                  </div>
                </div>
              </div>

              {/* Eficiência P2P */}
              <div className="flex items-center gap-2 text-sm">
                <ActivityIcon className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-gray-400 text-xs">Eficiência</div>
                  <div className={`font-bold ${
                    p2pStats.p2pPercentage > 50 ? 'text-green-400' :
                    p2pStats.p2pPercentage > 20 ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>
                    {p2pStats.p2pPercentage}% P2P
                  </div>
                </div>
              </div>
            </div>

            {/* HTTP Download (menor) */}
            <div className="text-xs text-gray-500">
              HTTP: {formatBytes(p2pStats.bytesDownloadedHTTP)}
            </div>
          </div>

          {/* Barra de Progresso P2P */}
          <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-500"
              style={{ width: `${p2pStats.p2pPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}