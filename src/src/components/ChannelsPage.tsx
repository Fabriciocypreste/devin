/**
 * 📺 CHANNELS PAGE
 * Página de canais IPTV com logos, grupos e busca
 */

import { useState, useEffect } from 'react';
import { Channel, loadChannels, filterChannelsByGroup, searchChannels } from '../utils/channelsLoader';
import { ChannelPlayer } from './ChannelPlayer';

// Icons
const SearchIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const ChevronDownIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const TvIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

export function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [groups, setGroups] = useState<string[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Carregar canais
  useEffect(() => {
    const fetchChannels = async () => {
      setLoading(true);
      
      try {
        console.log('📺 Iniciando carregamento de canais...');
        const data = await loadChannels();
        setChannels(data.channels);
        setFilteredChannels(data.channels);
        setGroups(['all', ...data.groups]);
        
        console.log(`✅ ${data.channels.length} canais carregados`);
        console.log(`✅ ${data.groups.length} grupos encontrados`);
      } catch (error) {
        console.error('❌ Erro ao carregar canais:', error);
        // loadChannels já retorna canais demo em caso de erro
        // então não precisamos tratar aqui
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = channels;

    // Filtrar por grupo
    if (selectedGroup !== 'all') {
      result = filterChannelsByGroup(result, selectedGroup);
    }

    // Filtrar por busca
    if (searchQuery.trim()) {
      result = searchChannels(result, searchQuery);
    }

    setFilteredChannels(result);
  }, [channels, selectedGroup, searchQuery]);

  // Abrir canal
  const handleChannelClick = (channel: Channel) => {
    console.log('📺 Abrindo canal:', channel.name);
    console.log('📡 Stream URL:', channel.streamUrl);
    setSelectedChannel(channel);
  };

  // Fechar player
  const handleClosePlayer = () => {
    setSelectedChannel(null);
  };

  const selectedGroupName = selectedGroup === 'all' 
    ? 'Todos os grupos' 
    : selectedGroup;

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#141414] border-b border-white/10">
        <div className="px-4 md:px-8 lg:px-12 py-4">
          {/* Title */}
          <div className="flex items-center gap-4 mb-4">
            <TvIcon className="w-8 h-8 text-[#E50914]" size={32} />
            <h1 className="text-2xl md:text-4xl font-bold">Canais IPTV</h1>
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={20} />
              <input
                type="text"
                placeholder="Buscar canais..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/30 rounded focus:border-white/60 focus:outline-none transition-colors"
              />
            </div>

            {/* Group Filter */}
            <div className="relative">
              <button
                onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/30 rounded hover:border-white/60 transition-colors whitespace-nowrap"
              >
                <span className="text-sm font-medium">{selectedGroupName}</span>
                <ChevronDownIcon 
                  className={`w-4 h-4 transition-transform ${showGroupDropdown ? 'rotate-180' : ''}`} 
                  size={16} 
                />
              </button>

              {/* Dropdown */}
              {showGroupDropdown && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setShowGroupDropdown(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-black/95 border border-white/30 rounded shadow-2xl z-50 max-h-[400px] overflow-y-auto backdrop-blur-md">
                    <div className="p-2">
                      {groups.map((group) => (
                        <button
                          key={group}
                          onClick={() => {
                            setSelectedGroup(group);
                            setShowGroupDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-white/10 transition-colors rounded ${
                            selectedGroup === group ? 'bg-white/20 text-white font-semibold' : 'text-white/80'
                          }`}
                        >
                          {group === 'all' ? 'Todos os grupos' : group}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Results Count */}
            <div className="flex items-center px-4 py-2 bg-black/30 border border-white/20 rounded">
              <span className="text-sm text-white/60">
                {filteredChannels.length} {filteredChannels.length === 1 ? 'canal' : 'canais'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 lg:px-12 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#E50914] mb-4"></div>
            <p className="text-white/60">Carregando canais...</p>
          </div>
        )}

        {/* Channels Grid */}
        {!loading && filteredChannels.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                onMouseEnter={() => setHoveredId(channel.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleChannelClick(channel)}
                className="relative cursor-pointer group"
                style={{ 
                  transform: hoveredId === channel.id ? 'scale(1.05)' : 'scale(1)',
                  opacity: hoveredId !== null && hoveredId !== channel.id ? 0.5 : 1,
                  transition: 'transform 0.3s, opacity 0.3s',
                  zIndex: hoveredId === channel.id ? 100 : 1
                }}
              >
                {/* Channel Card */}
                <div className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden border-2 border-transparent group-hover:border-[#E50914] transition-colors">
                  {/* Logo */}
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="w-full h-full object-contain p-2"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback se logo não carregar
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <TvIcon className="w-12 h-12 text-white/30" size={48} />
                    </div>
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-center p-2">
                      <div className="w-12 h-12 mx-auto mb-2 bg-[#E50914] rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <p className="text-xs text-white font-medium">Assistir</p>
                    </div>
                  </div>
                </div>

                {/* Channel Name */}
                <div className="mt-2 px-1">
                  <p className="text-sm font-medium text-white truncate" title={channel.name}>
                    {channel.name}
                  </p>
                  {channel.group && (
                    <p className="text-xs text-white/40 truncate" title={channel.group}>
                      {channel.group}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredChannels.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <TvIcon className="w-16 h-16 text-white/20 mb-4" size={64} />
            <h2 className="text-2xl font-semibold mb-2">Nenhum canal encontrado</h2>
            <p className="text-white/60 text-center">
              {searchQuery ? 'Tente outra busca' : 'Nenhum canal disponível neste grupo'}
            </p>
          </div>
        )}
      </div>

      {/* Player - Novo ChannelPlayer com logo e nome */}
      {selectedChannel && (
        <ChannelPlayer
          channel={{
            id: selectedChannel.id,
            name: selectedChannel.name,
            logo: selectedChannel.logo,
            streamUrl: selectedChannel.streamUrl,
            group: selectedChannel.group,
          }}
          onClose={handleClosePlayer}
        />
      )}
    </div>
  );
}