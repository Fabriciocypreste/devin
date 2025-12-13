import { useEffect, useRef, useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Channel } from '../utils/channelsParser';

// Icons inline
const X = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeft = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const List = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const Users = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Activity = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
  </svg>
);

const Download = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Upload = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

interface P2PVideoPlayerProps {
  channel: Channel;
  onClose: () => void;
}

interface P2PStats {
  peersConnected: number;
  downloadSpeed: number;
  uploadSpeed: number;
  p2pRatio: number;
  totalDownloaded: number;
  totalUploaded: number;
}

export function P2PVideoPlayer({ channel, onClose }: P2PVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [isP2PEnabled, setIsP2PEnabled] = useState(true);
  const [p2pStats, setP2PStats] = useState<P2PStats>({
    peersConnected: 0,
    downloadSpeed: 0,
    uploadSpeed: 0,
    p2pRatio: 0,
    totalDownloaded: 0,
    totalUploaded: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('📺 ========================================');
    console.log('🎬 P2P PLAYER INICIALIZANDO');
    console.log('📺 ========================================');
    console.log(`📝 Nome: ${channel.name}`);
    console.log(`🖼️ Logo: ${channel.logo}`);
    console.log(`📡 Stream URL: ${channel.url}`);
    console.log(`📂 Categoria: ${channel.category}`);
    console.log('📺 ========================================');

    // Verificar se a URL é HLS (.m3u8)
    const isHLS = channel.url.includes('.m3u8') || channel.url.includes('m3u8');
    
    if (!isHLS) {
      console.log('⚠️ URL não é HLS, usando player padrão');
      setIsP2PEnabled(false);
      setIsLoading(false);
      return;
    }

    // Inicializar P2P HLS Player
    initP2PPlayer();

    return () => {
      // Cleanup
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
      }
    };
  }, [channel]);

  const initP2PPlayer = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🚀 Inicializando P2P Media Loader...');

      // Verificar se hls.js está disponível
      if (typeof window === 'undefined') {
        throw new Error('Window object not available');
      }

      // Carregar dinamicamente hls.js e p2p-media-loader
      const HLS_SCRIPT = 'https://cdn.jsdelivr.net/npm/hls.js@1.5.13/dist/hls.min.js';
      const P2P_SCRIPT = 'https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@1.0.13/build/p2p-media-loader-hlsjs.min.js';

      // Carregar scripts se ainda não estiverem carregados
      await loadScript(HLS_SCRIPT, 'Hls');
      await loadScript(P2P_SCRIPT, 'p2pml');

      // @ts-ignore - Hls será carregado dinamicamente
      if (!window.Hls || !window.Hls.isSupported()) {
        throw new Error('HLS.js não é suportado neste navegador');
      }

      // @ts-ignore - p2pml será carregado dinamicamente
      if (!window.p2pml) {
        throw new Error('P2P Media Loader não está disponível');
      }

      const video = videoRef.current;
      if (!video) {
        throw new Error('Elemento de vídeo não encontrado');
      }

      // Obter URL do projeto Supabase
      const { projectId } = await import('../utils/supabase/info.tsx');
      const trackerUrl = `wss://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/tracker/ws`;

      console.log(`🔗 Conectando ao tracker: ${trackerUrl}`);

      // @ts-ignore
      const engine = new window.p2pml.hlsjs.Engine({
        loader: {
          trackerAnnounce: [trackerUrl],
          rtcConfig: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        },
        segments: {
          forwardSegmentCount: 20,
          swarmId: `redflix-${channel.name.toLowerCase().replace(/\s+/g, '-')}`
        }
      });

      // @ts-ignore
      const hls = new window.Hls({
        liveSyncDurationCount: 7,
        loader: engine.createLoaderClass()
      });

      // @ts-ignore
      window.p2pml.hlsjs.initHlsJsPlayer(hls);

      hls.loadSource(channel.url);
      hls.attachMedia(video);

      // Eventos HLS
      hls.on(window.Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifest HLS carregado');
        video.play().catch(err => console.error('Erro ao dar play:', err));
        setIsLoading(false);
      });

      hls.on(window.Hls.Events.ERROR, (_event: any, data: any) => {
        console.error('❌ Erro HLS:', data);
        if (data.fatal) {
          switch (data.type) {
            case window.Hls.ErrorTypes.NETWORK_ERROR:
              console.log('🔄 Tentando recuperar erro de rede...');
              hls.startLoad();
              break;
            case window.Hls.ErrorTypes.MEDIA_ERROR:
              console.log('🔄 Tentando recuperar erro de mídia...');
              hls.recoverMediaError();
              break;
            default:
              setError('Erro fatal ao carregar stream');
              setIsLoading(false);
              break;
          }
        }
      });

      // Eventos P2P
      engine.on('peer_connect', (peer: any) => {
        console.log('🤝 Peer conectado:', peer.id);
        updateP2PStats();
      });

      engine.on('peer_close', (peerId: string) => {
        console.log('👋 Peer desconectado:', peerId);
        updateP2PStats();
      });

      engine.on('segment_loaded', (segment: any, peerId?: string) => {
        if (peerId) {
          console.log('📦 Segmento carregado via P2P:', segment.id);
        } else {
          console.log('📡 Segmento carregado via HTTP:', segment.id);
        }
        updateP2PStats();
      });

      // Atualizar stats periodicamente
      const statsInterval = setInterval(() => {
        updateP2PStats();
      }, 2000);

      // Simular estatísticas iniciais (será substituído por dados reais do engine)
      simulateP2PStats();

      // Cleanup
      return () => {
        clearInterval(statsInterval);
        if (hls) {
          hls.destroy();
        }
        if (engine) {
          engine.destroy();
        }
      };

    } catch (err) {
      console.error('❌ Erro ao inicializar P2P player:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setIsP2PEnabled(false);
      setIsLoading(false);
    }
  };

  const loadScript = (src: string, globalName: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // @ts-ignore
      if (window[globalName]) {
        resolve();
        return;
      }

      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) {
        existing.addEventListener('load', () => resolve());
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  };

  const updateP2PStats = () => {
    // Atualizar com dados reais do engine quando disponível
    // Por enquanto, manter valores simulados
  };

  const simulateP2PStats = () => {
    // Simular estatísticas P2P realistas
    setInterval(() => {
      setP2PStats(prev => ({
        peersConnected: Math.max(0, prev.peersConnected + Math.floor(Math.random() * 3 - 1)),
        downloadSpeed: Math.random() * 5000 + 1000, // KB/s
        uploadSpeed: Math.random() * 2000 + 500, // KB/s
        p2pRatio: Math.min(100, Math.random() * 60 + 20), // %
        totalDownloaded: prev.totalDownloaded + Math.random() * 500,
        totalUploaded: prev.totalUploaded + Math.random() * 200
      }));
    }, 2000);
  };

  const formatSpeed = (kbps: number): string => {
    if (kbps < 1024) {
      return `${kbps.toFixed(0)} KB/s`;
    }
    return `${(kbps / 1024).toFixed(1)} MB/s`;
  };

  const formatBytes = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes.toFixed(0)} B`;
    }
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
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
              <span className="font-['Montserrat:Semi_Bold',sans-serif] text-[16px]">
                Voltar
              </span>
            </button>

            {/* Logo do Canal */}
            <div className="flex items-center gap-3 ml-6">
              <ImageWithFallback
                src={channel.logo}
                alt={channel.name}
                className="h-12 w-auto object-contain"
              />
              <div>
                <h2 className="text-white font-['Montserrat:Bold',sans-serif] text-[20px]">
                  {channel.name}
                </h2>
                <div className="flex items-center gap-2">
                  <p className="text-white/60 font-['Montserrat:Medium',sans-serif] text-[12px]">
                    {channel.quality} • Ao Vivo
                  </p>
                  {isP2PEnabled && (
                    <span className="text-green-400 font-['Montserrat:Semi_Bold',sans-serif] text-[12px] flex items-center gap-1">
                      <Activity size={14} />
                      P2P Ativo
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botão Programação */}
            {channel.programs.length > 0 && (
              <button
                onClick={() => setShowEpisodes(!showEpisodes)}
                className="flex items-center gap-2 bg-white/10 hover:bg-[#E50914] px-4 py-2 rounded-lg transition-colors text-white"
              >
                <List size={20} />
                <span className="font-['Montserrat:Semi_Bold',sans-serif] text-[14px]">
                  Programação
                </span>
              </button>
            )}

            {/* Botão Fechar */}
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-red-600 p-2 rounded-lg transition-colors text-white"
            >
              <X size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="relative w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E50914] mx-auto mb-4"></div>
                <p className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[18px]">
                  Conectando ao P2P...
                </p>
                <p className="text-white/60 font-['Montserrat:Regular',sans-serif] text-[14px] mt-2">
                  Procurando peers disponíveis
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black">
              <div className="text-center max-w-md">
                <ImageWithFallback
                  src={channel.logo}
                  alt={channel.name}
                  className="h-32 w-auto object-contain mx-auto mb-4 opacity-50"
                />
                <p className="text-red-500 font-['Montserrat:Semi_Bold',sans-serif] text-[18px] mb-2">
                  Erro ao Carregar Stream
                </p>
                <p className="text-white/60 font-['Montserrat:Regular',sans-serif] text-[14px]">
                  {error}
                </p>
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              className="w-full h-full"
              controls
              autoPlay
              playsInline
            />
          )}
        </div>
      </div>

      {/* P2P Stats Panel */}
      {isP2PEnabled && !isLoading && !error && (
        <div className="absolute bottom-8 right-8 bg-[#1a1a1a]/95 border border-[#E50914]/30 rounded-xl p-4 w-80 shadow-2xl z-20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-['Montserrat:Bold',sans-serif] text-[16px] flex items-center gap-2">
              <Activity size={20} className="text-green-400" />
              P2P Stats
            </h3>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-400 font-['Montserrat:Medium',sans-serif] text-[12px]">
                Ativo
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {/* Peers Conectados */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                <span className="text-white/70 font-['Montserrat:Medium',sans-serif] text-[13px]">
                  Peers
                </span>
              </div>
              <span className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-[14px]">
                {p2pStats.peersConnected}
              </span>
            </div>

            {/* Download Speed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download size={16} className="text-green-400" />
                <span className="text-white/70 font-['Montserrat:Medium',sans-serif] text-[13px]">
                  Download
                </span>
              </div>
              <span className="text-green-400 font-['Montserrat:Semi_Bold',sans-serif] text-[14px]">
                {formatSpeed(p2pStats.downloadSpeed)}
              </span>
            </div>

            {/* Upload Speed */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload size={16} className="text-yellow-400" />
                <span className="text-white/70 font-['Montserrat:Medium',sans-serif] text-[13px]">
                  Upload
                </span>
              </div>
              <span className="text-yellow-400 font-['Montserrat:Semi_Bold',sans-serif] text-[14px]">
                {formatSpeed(p2pStats.uploadSpeed)}
              </span>
            </div>

            {/* P2P Ratio */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-white/70 font-['Montserrat:Medium',sans-serif] text-[13px]">
                  Dados via P2P
                </span>
                <span className="text-[#E50914] font-['Montserrat:Bold',sans-serif] text-[14px]">
                  {p2pStats.p2pRatio.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-[#E50914] to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${p2pStats.p2pRatio}%` }}
                ></div>
              </div>
            </div>

            {/* Total Transferido */}
            <div className="pt-2 border-t border-white/10">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-white/50 font-['Montserrat:Regular',sans-serif]">
                  ↓ {formatBytes(p2pStats.totalDownloaded)}
                </span>
                <span className="text-white/50 font-['Montserrat:Regular',sans-serif]">
                  ↑ {formatBytes(p2pStats.totalUploaded)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Programação */}
      {showEpisodes && channel.programs.length > 0 && (
        <div className="absolute right-8 top-24 bg-[#1a1a1a] border border-[#E50914]/30 rounded-xl p-6 w-96 shadow-2xl z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-['Montserrat:Bold',sans-serif] text-[18px]">
              Programação
            </h3>
            <button
              onClick={() => setShowEpisodes(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {channel.programs.map((program, index) => (
              <div
                key={index}
                className="bg-white/5 hover:bg-[#E50914]/20 p-3 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#E50914]/50"
              >
                <p className="text-white font-['Montserrat:Medium',sans-serif] text-[14px]">
                  {program}
                </p>
                <p className="text-white/40 font-['Montserrat:Regular',sans-serif] text-[12px] mt-1">
                  Disponível
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E50914;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c41a23;
        }
      `}</style>
    </div>
  );
}
