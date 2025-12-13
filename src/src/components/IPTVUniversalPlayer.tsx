import React, { useEffect, useRef, useState } from 'react';
import { UsersIcon, ArrowDownIcon, ArrowUpIcon, ActivityIcon } from './Icons';

// Tipos para HLS.js e P2P Media Loader (carregados via CDN)
declare global {
  interface Window {
    Hls: any;
    p2pml: any;
  }
}

type IPTVUniversalPlayerProps = {
  url?: string;
  streamUrl?: string;
  poster?: string;
  autoPlay?: boolean;
  title?: string;
  onClose?: () => void;
  enableP2P?: boolean; // Ativa/desativa P2P
  enableStats?: boolean; // Mostra estatísticas P2P
  isLive?: boolean; // Marca se é stream ao vivo
};

interface P2PStats {
  peers: number;
  bytesDownloadedP2P: number;
  bytesUploadedP2P: number;
  bytesDownloadedHTTP: number;
  p2pPercentage: number;
}

/**
 * 🚀 IPTVUniversalPlayer - Player Universal para IPTV
 * 
 * ✅ SUPORTA:
 * - MP4 (P2P, player HTML5 nativo)
 * - M3U8 (HLS com hls.js + P2P via WebRTC)
 * - TS segments (HLS)
 * - Streaming ao vivo (Live)
 * - Listas de IPTV (.m3u, .m3u8)
 * 
 * 🔧 TECNOLOGIAS:
 * - HLS.js para reprodução de streams .m3u8
 * - p2p-media-loader para distribuição P2P via WebRTC
 * - Player HTML5 nativo para MP4
 * - CORS habilitado no vite.config
 * 
 * 📡 FONTES DE DADOS:
 * - Filmes/Séries: https://chemorena.com/filmes/filmes.txt (MP4 P2P)
 * - Canais IPTV: https://chemorena.com/filmes/canaissite.txt (M3U8 HLS)
 * 
 * Bibliotecas carregadas via CDN no index.html:
 * - hls.js
 * - p2p-media-loader-core
 * - p2p-media-loader-hlsjs
 */
export default function IPTVUniversalPlayer({ 
  url, 
  streamUrl, 
  poster, 
  autoPlay = true, 
  title,
  onClose,
  enableP2P = true,
  enableStats = true,
  isLive = false
}: IPTVUniversalPlayerProps) {
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
  const [showStats, setShowStats] = useState(enableStats);
  const [playerType, setPlayerType] = useState<'hls-p2p' | 'hls-native' | 'html5'>('html5');
  const [error, setError] = useState<string | null>(null);
  
  const videoUrl = url || streamUrl || '';

  // Formata bytes para KB/MB
  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes <= 0) return '0 KB';
    const kb = bytes / 1024;
    if (kb < 1024) return kb.toFixed(1) + ' KB';
    return (kb / 1024).toFixed(1) + ' MB';
  };

  // Detecta tipo de stream
  const detectStreamType = (url: string): 'hls' | 'ts' | 'mp4' | 'unknown' => {
    const urlLower = url.toLowerCase();
    if (urlLower.includes('.m3u8') || urlLower.includes('.m3u')) return 'hls';
    if (urlLower.includes('.ts')) return 'ts';
    if (urlLower.includes('.mp4')) return 'mp4';
    return 'unknown';
  };

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    const streamType = detectStreamType(videoUrl);
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎬 IPTV UNIVERSAL PLAYER - INICIANDO');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📡 URL:', videoUrl);
    console.log('📺 Tipo Detectado:', streamType.toUpperCase());
    console.log('🔴 É Live:', isLive);
    console.log('🌐 P2P Habilitado:', enableP2P);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Aguarda libs carregarem do CDN
    const initPlayer = () => {
      const isHLS = streamType === 'hls' || streamType === 'ts';

      // ══════════════════════════════════════════════════════
      // 1️⃣ MODO HLS + P2P (M3U8, TS com P2P via WebRTC)
      // ══════════════════════════════════════════════════════
      if (isHLS && window.Hls && window.Hls.isSupported() && enableP2P && window.p2pml) {
        console.log('✅ Iniciando modo: HLS + P2P (via WebRTC)');
        setPlayerType('hls-p2p');

        try {
          // Configuração do engine P2P
          engineRef.current = new window.p2pml.hlsjs.Engine({
            loader: {
              trackerAnnounce: [
                // Tracker P2P integrado no servidor Supabase
                `wss://${window.location.hostname}/functions/v1/make-server-2363f5d6/tracker`,
                // Fallback para trackers públicos
                'wss://tracker.openwebtorrent.com',
                'wss://tracker.novage.com.ua'
              ],
              rtcConfig: {
                iceServers: [
                  { urls: 'stun:stun.l.google.com:19302' },
                  { urls: 'stun:stun1.l.google.com:19302' },
                  { urls: 'stun:stun2.l.google.com:19302' }
                ]
              },
              // Configurações otimizadas para P2P
              simultaneousHttpDownloads: 2,
              simultaneousP2PDownloads: 3,
            },
            segments: {
              forwardSegmentCount: isLive ? 10 : 20, // Menos para live (latência)
              swarmId: videoUrl, // Identifica o swarm P2P
            },
          });

          console.log('✅ P2P Engine inicializado');
          console.log('   - Tracker: Supabase + OpenWebTorrent + Novage');
          console.log('   - STUN Servers: Google (3 servidores)');
          console.log(`   - Segments: ${isLive ? 10 : 20} forward`);

          // Configuração do HLS.js com P2P
          hlsRef.current = new window.Hls({
            // Configurações para streaming ao vivo
            liveSyncDurationCount: isLive ? 3 : 5,
            liveMaxLatencyDurationCount: isLive ? 8 : 10,
            maxLiveSyncPlaybackRate: 1.5,
            
            // Integração P2P
            loader: engineRef.current.createLoaderClass(),
            
            // Buffer
            maxBufferLength: isLive ? 20 : 30,
            maxMaxBufferLength: isLive ? 40 : 60,
            
            // Performance
            manifestLoadingTimeOut: 10000,
            manifestLoadingMaxRetry: 4,
            levelLoadingTimeOut: 10000,
            levelLoadingMaxRetry: 4,
            fragLoadingTimeOut: 20000,
            fragLoadingMaxRetry: 6,
            
            // Debug
            debug: false,
            enableWorker: true,
            lowLatencyMode: isLive,
            
            // CORS
            xhrSetup: (xhr: XMLHttpRequest, url: string) => {
              xhr.withCredentials = false; // Não enviar cookies (CORS)
            },
          });

          hlsRef.current.loadSource(videoUrl);
          hlsRef.current.attachMedia(video);

          // Inicializa integração P2P + HLS.js
          if (window.p2pml?.hlsjs?.initHlsJsPlayer) {
            window.p2pml.hlsjs.initHlsJsPlayer(hlsRef.current);
            console.log('✅ P2P integrado ao HLS.js');
          }

          // Eventos HLS
          hlsRef.current.on(window.Hls.Events.MANIFEST_PARSED, () => {
            console.log('✅ Manifest HLS parseado com sucesso');
            if (autoPlay) {
              video.play().catch(err => {
                console.warn('⚠️ Autoplay bloqueado pelo navegador:', err);
              });
            }
          });

          hlsRef.current.on(window.Hls.Events.LEVEL_LOADED, (event: any, data: any) => {
            console.log(`📊 Qualidade carregada: ${data.details.totalduration}s, ${data.details.fragments.length} segmentos`);
          });

          hlsRef.current.on(window.Hls.Events.ERROR, (event: any, data: any) => {
            console.error('❌ Erro HLS:', data.type, data.details);
            
            if (data.fatal) {
              switch (data.type) {
                case window.Hls.ErrorTypes.NETWORK_ERROR:
                  console.log('🔄 Erro de rede detectado - Tentando recuperar...');
                  setError('Erro de conexão. Reconectando...');
                  hlsRef.current?.startLoad();
                  setTimeout(() => setError(null), 3000);
                  break;
                  
                case window.Hls.ErrorTypes.MEDIA_ERROR:
                  console.log('🔄 Erro de mídia detectado - Tentando recuperar...');
                  setError('Erro de reprodução. Tentando corrigir...');
                  hlsRef.current?.recoverMediaError();
                  setTimeout(() => setError(null), 3000);
                  break;
                  
                default:
                  console.error('💥 Erro fatal irrecuperável');
                  setError('Erro ao reproduzir stream. Tente novamente.');
                  hlsRef.current?.destroy();
                  break;
              }
            }
          });

          console.log('✅ Player HLS + P2P configurado com sucesso');

        } catch (err) {
          console.error('❌ Erro ao inicializar P2P:', err);
          setError('Erro ao inicializar P2P. Usando HTTP...');
          
          // Fallback: HLS sem P2P
          initHLSWithoutP2P();
        }

      // ══════════════════════════════════════════════════════
      // 2️⃣ MODO HLS NATIVO (Safari/iOS sem P2P)
      // ══════════════════════════════════════════════════════
      } else if (isHLS && video.canPlayType('application/vnd.apple.mpegurl')) {
        console.log('✅ Iniciando modo: HLS Nativo (Safari/iOS)');
        setPlayerType('hls-native');
        
        video.src = videoUrl;
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('⚠️ Autoplay bloqueado:', err);
          });
        }

      // ══════════════════════════════════════════════════════
      // 3️⃣ MODO HLS SEM P2P (Fallback)
      // ══════════════════════════════════════════════════════
      } else if (isHLS && window.Hls && window.Hls.isSupported()) {
        initHLSWithoutP2P();

      // ══════════════════════════════════════════════════════
      // 4️⃣ MODO HTML5 PADRÃO (MP4, WebM, etc)
      // ══════════════════════════════════════════════════════
      } else {
        console.log('✅ Iniciando modo: HTML5 Player (MP4 P2P)');
        setPlayerType('html5');
        
        video.src = videoUrl;
        if (autoPlay) {
          video.play().catch(err => {
            console.warn('⚠️ Autoplay bloqueado:', err);
          });
        }
      }
    };

    // Função auxiliar: HLS sem P2P
    const initHLSWithoutP2P = () => {
      console.log('✅ Iniciando modo: HLS sem P2P (HTTP apenas)');
      setPlayerType('hls-native');

      hlsRef.current = new window.Hls({
        liveSyncDurationCount: isLive ? 3 : 5,
        liveMaxLatencyDurationCount: isLive ? 8 : 10,
        maxBufferLength: isLive ? 20 : 30,
        debug: false,
        enableWorker: true,
        lowLatencyMode: isLive,
        xhrSetup: (xhr: XMLHttpRequest) => {
          xhr.withCredentials = false;
        },
      });

      hlsRef.current.loadSource(videoUrl);
      hlsRef.current.attachMedia(videoRef.current!);

      hlsRef.current.on(window.Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifest HLS parseado');
        if (autoPlay) {
          videoRef.current!.play().catch(err => {
            console.warn('⚠️ Autoplay bloqueado:', err);
          });
        }
      });

      hlsRef.current.on(window.Hls.Events.ERROR, (event: any, data: any) => {
        if (data.fatal) {
          console.error('❌ Erro fatal HLS:', data);
          setError('Erro ao carregar stream');
        }
      });
    };

    // Aguardar libs carregar ou iniciar imediatamente
    if (detectStreamType(videoUrl) === 'hls' && !window.Hls) {
      console.log('⏳ Aguardando HLS.js carregar do CDN...');
      setTimeout(initPlayer, 300);
    } else {
      initPlayer();
    }

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
          // Ignorar erros de stats silenciosamente
        }
      }
    }, 2000);

    // Cleanup
    return () => {
      console.log('🧹 Limpando player...');
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
  }, [videoUrl, autoPlay, enableP2P, isLive]);

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
          onPlay={() => {
            setIsPlaying(true);
            console.log('▶️ Reprodução iniciada');
          }}
          onPause={() => {
            setIsPlaying(false);
            console.log('⏸️ Reprodução pausada');
          }}
          onError={(e) => {
            console.error('❌ Erro ao carregar stream:', videoUrl);
            console.error('Detalhes:', e);
            setError('Erro ao carregar stream');
          }}
          onLoadedMetadata={() => {
            console.log('✅ Metadados do vídeo carregados');
          }}
          onWaiting={() => {
            console.log('⏳ Buffering...');
          }}
          onCanPlay={() => {
            console.log('✅ Pronto para reproduzir');
            setError(null);
          }}
        />
        
        {/* Título */}
        {title && (
          <div className="absolute top-4 left-4 bg-black/90 text-white px-4 py-2 rounded-lg text-sm md:text-base font-semibold backdrop-blur-sm border border-gray-700 shadow-xl">
            <div className="flex items-center gap-2">
              {isLive && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>}
              <span>{isLive ? '🔴' : '📺'} {title}</span>
            </div>
          </div>
        )}
        
        {/* Badge AO VIVO */}
        {isPlaying && isLive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[#E50914] text-white px-4 py-2 rounded-full text-xs font-bold uppercase shadow-lg border-2 border-white/20">
            🔴 AO VIVO
          </div>
        )}

        {/* Badge Tipo de Player */}
        <div className="absolute top-4 right-20 bg-black/80 text-white px-3 py-1 rounded-lg text-xs backdrop-blur-sm border border-gray-700">
          {playerType === 'hls-p2p' && '🌐 HLS + P2P'}
          {playerType === 'hls-native' && '📡 HLS'}
          {playerType === 'html5' && '🎬 MP4'}
        </div>
        
        {/* Botão de Fechar */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/90 text-white px-4 py-2 rounded-full hover:bg-[#E50914] transition-all duration-300 backdrop-blur-sm font-semibold border border-gray-700 shadow-xl hover:scale-105"
          >
            ✕ Fechar
          </button>
        )}

        {/* Mensagem de Erro */}
        {error && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-600/90 text-white px-6 py-3 rounded-lg text-sm font-semibold backdrop-blur-sm border border-red-500 shadow-xl">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Estatísticas P2P */}
      {enableP2P && showStats && playerType === 'hls-p2p' && (
        <div className="bg-gradient-to-r from-gray-900 via-gray-900 to-black border-t border-gray-800 p-3">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            {/* Toggle Stats */}
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-xs text-gray-400 hover:text-white transition flex items-center gap-1"
            >
              <span>{showStats ? '▼' : '▶'}</span>
              <span className="font-semibold">Estatísticas P2P WebRTC</span>
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
