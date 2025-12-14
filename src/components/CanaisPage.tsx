// RedFlix Canais Page - Smart TV Style with Glassmorphism
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Hls from 'hls.js';

// Channel interface
interface Channel {
  id: string;
  name: string;
  title: string;
  logo: string | null;
  group: string;
  url: string;
  poster?: string;
  backdrop?: string;
}

// Category icons mapping
const categoryIcons: Record<string, string> = {
  'Canais - Abertos': '📺',
  'Canais - 24hs': '🎬',
  'Canais - Premiere': '⚽',
  'Canais - Uruguay': '🇺🇾',
  'Canais - A Fazenda': '🌾',
  'Canais – Globo': '🌐',
  'Canais – Adultos': '🔞',
  'Canais – Filmes e Séries': '🎥',
  'Canais – Esportes Ppv': '🏆',
  'Canais – Documentários': '📚',
  'Canais – Esportes': '⚽',
  'Canais – Infantis': '👶',
  'Canais – Variedades': '🎭',
  'Canais – Religiosos': '⛪',
  'Canais – Notícias': '📰',
  'Canais – Música': '🎵',
};

// Proxy URL for CORS
const PROXY_URL = 'https://corsproxy.io/?';

interface CanaisPageProps {
  onClose?: () => void;
}

export function CanaisPage({ onClose }: CanaisPageProps) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [focusedChannel, setFocusedChannel] = useState<Channel | null>(null);
  const [playingChannel, setPlayingChannel] = useState<Channel | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load channels from Backend API or fallback to JSON
  useEffect(() => {
    const loadChannels = async () => {
      try {
        setLoading(true);
        
        // Try backend API first (port 3333)
        try {
          const apiResponse = await fetch('http://localhost:3333/api/channels');
          if (apiResponse.ok) {
            const apiData = await apiResponse.json();
            if (apiData.length > 0) {
              const mappedChannels = apiData.map((ch: any) => ({
                id: String(ch.id),
                name: ch.name,
                title: ch.name,
                logo: ch.logo,
                group: ch.category?.name || 'Sem Categoria',
                url: ch.url,
              }));
              processChannels(mappedChannels);
              console.log('✅ Canais carregados da API do backend');
              return;
            }
          }
        } catch (apiErr) {
          console.log('Backend API não disponível, usando JSON local');
        }
        
        // Fallback to local JSON
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/src/data/channels.json`);
        
        if (!response.ok) {
          const altResponse = await fetch(`${baseUrl}/data/channels.json`);
          if (!altResponse.ok) {
            throw new Error('Failed to load channels');
          }
          const data = await altResponse.json();
          processChannels(data);
          return;
        }
        
        const data = await response.json();
        processChannels(data);
      } catch (err) {
        console.error('Error loading channels:', err);
        setError('Erro ao carregar canais. Tente novamente.');
        setLoading(false);
      }
    };

    const processChannels = (data: Channel[]) => {
      // Filter only .ts files
      const tsChannels = data.filter(ch => ch.url && ch.url.endsWith('.ts'));
      setChannels(tsChannels);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(tsChannels.map(ch => ch.group))].sort();
      setCategories(uniqueCategories);
      
      setLoading(false);
      console.log(`✅ ${tsChannels.length} canais .ts carregados`);
    };

    loadChannels();
  }, []);

  // Filter channels by category
  const filteredChannels = selectedCategory === 'all' 
    ? channels 
    : channels.filter(ch => ch.group === selectedCategory);

  // State for player error message
  const [playerError, setPlayerError] = useState<string | null>(null);
  const retryCountRef = useRef(0);

  // Initialize HLS player
  const initPlayer = useCallback((channel: Channel) => {
    if (!videoRef.current) return;

    // Cleanup previous instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setPlayerError(null);
    retryCountRef.current = 0;

    const video = videoRef.current;
    
    // Try direct URL first for .ts streams, then proxy as fallback
    const directUrl = channel.url;
    const proxyUrl = `${PROXY_URL}${encodeURIComponent(channel.url)}`;
    
    // For .ts files, try direct first (many IPTV streams work without proxy)
    const isTs = channel.url.endsWith('.ts');
    const streamUrl = isTs ? directUrl : proxyUrl;

    console.log(`🎬 Iniciando player para: ${channel.name}`);
    console.log(`📡 URL: ${streamUrl}`);

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
        maxBufferLength: 30,
        maxMaxBufferLength: 60,
        // More tolerant settings for IPTV streams
        fragLoadingTimeOut: 20000,
        manifestLoadingTimeOut: 20000,
        levelLoadingTimeOut: 20000,
      });
      
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('✅ Manifest carregado, iniciando reprodução...');
        video.play().catch(err => {
          console.warn('⚠️ Autoplay bloqueado:', err.message);
          setPlayerError('Clique no vídeo para iniciar a reprodução');
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        // Log detailed error info
        console.error('❌ HLS Error:', {
          type: data.type,
          details: data.details,
          fatal: data.fatal,
          url: data.frag?.url || data.url || 'N/A',
          response: data.response?.code || 'N/A',
          reason: data.reason || 'N/A',
        });

        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (retryCountRef.current < 2) {
                retryCountRef.current++;
                console.log(`🔄 Tentativa ${retryCountRef.current}/2 - Erro de rede, tentando novamente...`);
                
                // If direct URL failed, try with proxy
                if (isTs && retryCountRef.current === 1) {
                  console.log('🔄 Tentando com proxy CORS...');
                  hls.loadSource(proxyUrl);
                } else {
                  hls.startLoad();
                }
              } else {
                setPlayerError(`Canal indisponível: ${data.details || 'Erro de rede'}`);
                hls.destroy();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('🔄 Erro de mídia, tentando recuperar...');
              hls.recoverMediaError();
              break;
            default:
              // For other errors (like manifest parsing), the stream might not be HLS
              if (data.details === 'manifestParsingError') {
                setPlayerError('Stream não é HLS válido. Este canal pode estar offline ou usar formato incompatível.');
              } else {
                setPlayerError(`Erro ao reproduzir: ${data.details || 'Erro desconhecido'}`);
              }
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari native HLS support
      video.src = streamUrl;
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado:', err.message);
        setPlayerError('Clique no vídeo para iniciar a reprodução');
      });
    } else {
      setPlayerError('Seu navegador não suporta reprodução HLS');
    }
  }, []);

  // Handle channel selection
  const handleChannelClick = (channel: Channel) => {
    setPlayingChannel(channel);
    setIsFullscreen(true);
    setTimeout(() => initPlayer(channel), 100);
  };

  // Handle channel focus (for preload)
  const handleChannelFocus = (channel: Channel) => {
    setFocusedChannel(channel);
  };

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  };

  // Handle close player
  const handleClosePlayer = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }
    setPlayingChannel(null);
    setIsFullscreen(false);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && playingChannel) {
        handleClosePlayer();
      }
      if (e.key === 'f' && playingChannel) {
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playingChannel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Carregando canais...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-[#f40612] transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Fullscreen Player
  if (playingChannel && isFullscreen) {
    return (
      <div 
        ref={containerRef}
        className="fixed inset-0 bg-black z-50 flex items-center justify-center"
        onClick={handleClosePlayer}
      >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          autoPlay
          playsInline
          onClick={(e) => {
            e.stopPropagation();
            // Try to play if paused
            if (videoRef.current?.paused) {
              videoRef.current.play().catch(console.error);
            }
          }}
        />
        
        {/* Error Message Overlay */}
        {playerError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80" onClick={(e) => e.stopPropagation()}>
            <div className="text-center p-8 max-w-md">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-white text-xl font-semibold mb-2">Erro ao reproduzir</h3>
              <p className="text-gray-400 mb-6">{playerError}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => {
                    setPlayerError(null);
                    initPlayer(playingChannel);
                  }}
                  className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-[#f40612] transition"
                >
                  Tentar Novamente
                </button>
                <button
                  onClick={handleClosePlayer}
                  className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Hidden UI - only show on hover */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent pointer-events-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {playingChannel.logo && (
                  <img 
                    src={playingChannel.logo} 
                    alt={playingChannel.name}
                    className="w-12 h-12 object-contain"
                  />
                )}
                <div>
                  <h2 className="text-white text-xl font-bold">{playingChannel.name}</h2>
                  <p className="text-gray-400 text-sm">{playingChannel.group}</p>
                </div>
              </div>
              <button
                onClick={handleClosePlayer}
                className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar - Categories */}
      <div 
        className={`fixed left-0 top-0 h-full bg-black/90 backdrop-blur-xl border-r border-white/10 z-40 transition-all duration-300 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        }`}
        onMouseEnter={() => setSidebarCollapsed(false)}
        onMouseLeave={() => setSidebarCollapsed(true)}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10">
          {sidebarCollapsed ? (
            <span className="text-2xl">📺</span>
          ) : (
            <h1 className="text-white font-bold text-xl">Canais</h1>
          )}
        </div>

        {/* Categories */}
        <div className="py-4 overflow-y-auto h-[calc(100%-4rem)]">
          {/* All channels */}
          <button
            onClick={() => setSelectedCategory('all')}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
              selectedCategory === 'all' 
                ? 'bg-[#E50914] text-white' 
                : 'text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <span className="text-xl flex-shrink-0">🏠</span>
            {!sidebarCollapsed && <span className="truncate">Todos os Canais</span>}
          </button>

          {/* Category buttons */}
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                selectedCategory === category 
                  ? 'bg-[#E50914] text-white' 
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              }`}
              title={category}
            >
              <span className="text-xl flex-shrink-0">
                {categoryIcons[category] || '📺'}
              </span>
              {!sidebarCollapsed && (
                <span className="truncate text-sm">{category.replace('Canais - ', '').replace('Canais – ', '')}</span>
              )}
            </button>
          ))}
        </div>

        {/* Close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute bottom-4 left-0 right-0 mx-4 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition"
          >
            {sidebarCollapsed ? '✕' : 'Fechar'}
          </button>
        )}
      </div>

      {/* Main Content - Channels Grid */}
      <div className={`flex-1 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Header */}
        <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-white text-2xl font-bold">
                {selectedCategory === 'all' ? 'Todos os Canais' : selectedCategory.replace('Canais - ', '').replace('Canais – ', '')}
              </h1>
              <p className="text-gray-400 text-sm">{filteredChannels.length} canais disponíveis</p>
            </div>
          </div>
        </div>

        {/* Channels Grid - Glassmorphism Style */}
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel)}
                onMouseEnter={() => handleChannelFocus(channel)}
                onFocus={() => handleChannelFocus(channel)}
                tabIndex={0}
                className={`group relative aspect-video rounded-xl overflow-hidden cursor-pointer transition-all duration-300 
                  bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10
                  hover:scale-105 hover:border-[#E50914] hover:shadow-lg hover:shadow-[#E50914]/20
                  focus:scale-105 focus:border-[#E50914] focus:shadow-lg focus:shadow-[#E50914]/20 focus:outline-none
                  ${focusedChannel?.id === channel.id ? 'ring-2 ring-[#E50914]' : ''}
                `}
              >
                {/* Channel Logo */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="max-w-full max-h-full object-contain filter drop-shadow-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#E50914] to-[#b8070f] flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {channel.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-white text-sm font-semibold truncate">{channel.name}</h3>
                    <p className="text-gray-400 text-xs truncate">{channel.group.replace('Canais - ', '').replace('Canais – ', '')}</p>
                  </div>
                </div>

                {/* Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-[#E50914] flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>

                {/* Live indicator */}
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded text-xs text-white font-semibold">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    AO VIVO
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredChannels.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="text-6xl mb-4">📺</span>
              <h3 className="text-white text-xl font-semibold mb-2">Nenhum canal encontrado</h3>
              <p className="text-gray-400">Selecione outra categoria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CanaisPage;
