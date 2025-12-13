/**
 * 📺 IPTV CHANNELS PAGE - Página de Canais Moderna
 * 
 * Features:
 * - Menu vertical com logos e nomes
 * - EPG (programação) ao lado
 * - Efeito glassmorphism (vidro transparente)
 * - Design elegante e moderno
 * - Player robusto integrado
 * - Carrega canaissite.txt
 */

import { useState, useEffect } from 'react';
import { IPTVPlayerRobust } from './IPTVPlayerRobust';

interface Channel {
  id: number;
  name: string;
  logo?: string;
  streamUrl: string;
  group?: string;
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
}

interface ChannelGroup {
  name: string;
  channels: Channel[];
}

export function IPTVChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [channelGroups, setChannelGroups] = useState<ChannelGroup[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar canais do servidor
  useEffect(() => {
    loadChannelsFromServer();
  }, []);

  const loadChannelsFromServer = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('📺 ═══════════════════════════════════════════════');
      console.log('📺 CARREGANDO CANAIS DE canaissite.txt');
      console.log('📺 ═══════════════════════════════════════════════');

      // Usar proxy do vite.config
      const response = await fetch('/filmes/canaissite.txt');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const content = await response.text();
      console.log(`✅ Arquivo carregado: ${content.length} caracteres`);

      // Parse M3U
      const parsedChannels = parseM3U(content);
      console.log(`✅ Canais parseados: ${parsedChannels.length}`);

      setChannels(parsedChannels);
      organizeChannelGroups(parsedChannels);

      console.log('✅ ═══════════════════════════════════════════════');
      console.log('✅ CANAIS CARREGADOS COM SUCESSO');
      console.log('✅ ═══════════════════════════════════════════════');
    } catch (err) {
      console.error('❌ Erro ao carregar canais:', err);
      setError('Erro ao carregar canais. Verifique sua conexão.');
      
      // Canais demo para desenvolvimento
      const demoChannels = createDemoChannels();
      setChannels(demoChannels);
      organizeChannelGroups(demoChannels);
    } finally {
      setLoading(false);
    }
  };

  // Parse M3U8/M3U
  const parseM3U = (content: string): Channel[] => {
    const lines = content.split('\n').map(l => l.trim()).filter(Boolean);
    const channels: Channel[] = [];
    let currentChannel: Partial<Channel> = {};
    let id = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Linha de metadados: #EXTINF
      if (line.startsWith('#EXTINF')) {
        // Extrair dados
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const groupMatch = line.match(/group-title="([^"]+)"/);
        const nameMatch = line.split(',').pop();

        currentChannel = {
          id: id++,
          name: nameMatch?.trim() || 'Canal sem nome',
          logo: logoMatch?.[1],
          group: groupMatch?.[1],
          epg: generateMockEPG(),
        };
      } 
      // Linha de URL
      else if (line.startsWith('http')) {
        if (currentChannel.name) {
          channels.push({
            ...currentChannel as Channel,
            streamUrl: line,
          });
        }
        currentChannel = {};
      }
    }

    return channels;
  };

  // Gerar EPG mock (simulado)
  const generateMockEPG = () => {
    const programs = [
      'Jornal da Noite',
      'Novela das 21h',
      'Filme: Ação Total',
      'Documentário Natureza',
      'Show de Variedades',
      'Futebol ao Vivo',
      'Série: Crime Scene',
      'Talk Show',
      'Reality Show',
      'Desenho Animado',
    ];

    const now = new Date();
    const current = programs[Math.floor(Math.random() * programs.length)];
    const next = programs[Math.floor(Math.random() * programs.length)];

    return {
      current: {
        title: current,
        start: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        end: new Date(now.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
      next: {
        title: next,
        start: new Date(now.getTime() + 2 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        end: new Date(now.getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      },
    };
  };

  // Organizar canais por grupo
  const organizeChannelGroups = (channelsList: Channel[]) => {
    const groupsMap = new Map<string, Channel[]>();

    channelsList.forEach(channel => {
      const group = channel.group || 'Outros';
      if (!groupsMap.has(group)) {
        groupsMap.set(group, []);
      }
      groupsMap.get(group)!.push(channel);
    });

    const groups: ChannelGroup[] = Array.from(groupsMap.entries()).map(([name, channels]) => ({
      name,
      channels,
    }));

    setChannelGroups(groups);
  };

  // Criar canais demo
  const createDemoChannels = (): Channel[] => {
    return [
      {
        id: 1,
        name: 'Globo HD',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Logotipo_da_Rede_Globo.svg/200px-Logotipo_da_Rede_Globo.svg.png',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Canais Abertos',
        epg: generateMockEPG(),
      },
      {
        id: 2,
        name: 'SBT HD',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Logotipo_do_SBT.svg/200px-Logotipo_do_SBT.svg.png',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Canais Abertos',
        epg: generateMockEPG(),
      },
      {
        id: 3,
        name: 'ESPN HD',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png',
        streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
        group: 'Esportes',
        epg: generateMockEPG(),
      },
    ];
  };

  // Filtrar canais
  const filteredChannels = channels.filter(channel => {
    // Filtro de grupo
    if (selectedGroup !== 'all' && channel.group !== selectedGroup) {
      return false;
    }

    // Filtro de busca
    if (searchQuery && !channel.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl" />
      </div>

      {/* Header com glassmorphism */}
      <div className="sticky top-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                  <polyline points="17 2 12 7 7 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold">Canais IPTV</h1>
                <p className="text-white/60 text-sm">Transmissões ao vivo</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                <span className="text-white/60 text-sm">Canais: </span>
                <span className="font-bold">{filteredChannels.length}</span>
              </div>
              <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                <span className="text-white/60 text-sm">Grupos: </span>
                <span className="font-bold">{channelGroups.length}</span>
              </div>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="flex gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg 
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                fill="none" 
                stroke="currentColor" 
                strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Buscar canal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>

            {/* Group Filter */}
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition-all cursor-pointer"
            >
              <option value="all" className="bg-gray-900">Todos os grupos</option>
              {channelGroups.map(group => (
                <option key={group.name} value={group.name} className="bg-gray-900">
                  {group.name} ({group.channels.length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 py-8">
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4" />
            <p className="text-white/60">Carregando canais...</p>
          </div>
        )}

        {error && (
          <div className="max-w-md mx-auto mt-20">
            <div className="bg-red-500/10 backdrop-blur-md border border-red-500/30 rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={loadChannelsFromServer}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-lg font-semibold transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {!loading && !error && filteredChannels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" strokeWidth={2}>
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                <polyline points="17 2 12 7 7 2" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Nenhum canal encontrado</h2>
            <p className="text-white/60">Tente outra busca ou grupo</p>
          </div>
        )}

        {/* Channels List */}
        {!loading && !error && filteredChannels.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredChannels.map(channel => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
              >
                {/* Channel Info */}
                <div className="flex items-center gap-4 mb-3">
                  {/* Logo */}
                  <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center p-2 flex-shrink-0">
                    {channel.logo ? (
                      <img
                        src={channel.logo}
                        alt={channel.name}
                        className="w-full h-full object-contain"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    ) : (
                      <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2" />
                        <polyline points="17 2 12 7 7 2" />
                      </svg>
                    )}
                  </div>

                  {/* Name + Group */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                      {channel.name}
                    </h3>
                    {channel.group && (
                      <p className="text-sm text-white/60 truncate">{channel.group}</p>
                    )}
                  </div>

                  {/* Live Badge */}
                  <div className="flex items-center gap-1 px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-full">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-xs text-red-400 font-medium">AO VIVO</span>
                  </div>
                </div>

                {/* EPG */}
                {channel.epg?.current && (
                  <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-start gap-2 mb-2">
                      <svg className="w-4 h-4 text-white/60 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {channel.epg.current.title}
                        </p>
                        <p className="text-xs text-white/60">
                          {channel.epg.current.start} - {channel.epg.current.end}
                        </p>
                      </div>
                    </div>
                    {channel.epg.next && (
                      <div className="text-xs text-white/40 truncate">
                        Próximo: {channel.epg.next.title}
                      </div>
                    )}
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/0 to-red-500/0 group-hover:from-red-500/10 group-hover:via-red-500/5 group-hover:to-red-500/10 rounded-xl transition-all pointer-events-none" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Player */}
      {selectedChannel && (
        <IPTVPlayerRobust
          streamUrl={selectedChannel.streamUrl}
          channelName={selectedChannel.name}
          channelLogo={selectedChannel.logo}
          channelGroup={selectedChannel.group}
          epg={selectedChannel.epg}
          onClose={() => setSelectedChannel(null)}
        />
      )}
    </div>
  );
}
