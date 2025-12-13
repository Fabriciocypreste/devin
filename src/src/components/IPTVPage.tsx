// RedFlix IPTV Page - Smart TV Style Interface
import React, { useState, useEffect } from 'react';
import { NetflixHeader } from './NetflixHeader';
import IPTVPlayerP2P from './IPTVPlayerP2P';
import { 
  TvIcon, 
  FilmIcon, 
  PlayIcon, 
  Loader2Icon, 
  AlertCircleIcon, 
  SearchIcon,
  GridIcon,
  ListIcon,
  FilterIcon
} from './Icons';
import { projectId, publicAnonKey } from '../utils/supabase/info';

// Configuração do servidor
const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;

interface Channel {
  name: string;
  url: string;
  logo?: string;
  category?: string;
  tvgId?: string;
}

interface IPTVPageProps {
  onClose?: () => void;
  onCategoryChange?: (category: string) => void;
  onSearchClick?: () => void;
  defaultTab?: 'canais' | 'filmes';
}

export function IPTVPage({ 
  onClose, 
  onCategoryChange, 
  onSearchClick,
  defaultTab = 'canais'
}: IPTVPageProps) {
  const [activeTab, setActiveTab] = useState<'canais' | 'filmes'>(defaultTab);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [movies, setMovies] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Record<string, Channel[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStream, setSelectedStream] = useState<Channel | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Helper function to parse M3U playlist
  const parseM3U = (content: string): Channel[] => {
    const channels: Channel[] = [];
    const lines = content.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Extract channel info from EXTINF line
        const nameMatch = line.match(/,(.+)$/);
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        const categoryMatch = line.match(/group-title="([^"]+)"/);
        const idMatch = line.match(/tvg-id="([^"]+)"/);
        
        // Get URL from next line
        const url = lines[i + 1]?.trim();
        
        if (nameMatch && url && !url.startsWith('#')) {
          channels.push({
            name: nameMatch[1].trim(),
            url: url,
            logo: logoMatch ? logoMatch[1] : undefined,
            category: categoryMatch ? categoryMatch[1] : 'Outros',
            tvgId: idMatch ? idMatch[1] : undefined
          });
        }
      }
    }
    
    return channels;
  };

  useEffect(() => {
    // IPTV desabilitado - servidor removido
    setLoading(false);
    setError('IPTV temporariamente desabilitado');
  }, [activeTab]);

  const fetchChannels = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('📺 Buscando canais IPTV...');
      console.log('🔗 URL:', `${serverUrl}/iptv/playlists/canais`);
      
      const response = await fetch(`${serverUrl}/iptv/playlists/canais`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Erro da resposta:', errorText);
        throw new Error(`Erro ${response.status}: ${errorText || response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Canais carregados:', data.total);

      setChannels(data.channels || []);
      setCategories(data.categories || {});
      setLoading(false);
    } catch (err) {
      console.error('❌ Erro ao carregar canais:', err);
      setError(`Erro ao carregar canais: ${err.message}`);
      setLoading(false);
    }
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('━━━━━━━━━━━━━━━���━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('ℹ️ IPTV FILMES/SÉRIES DESABILITADO');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
      console.log('O repositório GitHub não está disponível.');
      console.log('Para habilitar, configure o repositório em:');
      console.log('📍 https://github.com/Fabriciocypreste/lista');
      console.log('');
      console.log('Ou ative ENABLE_GITHUB_LOADING em:');
      console.log('/utils/m3uContentLoader.ts');
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

      setMovies([]);
      setCategories({});
      setLoading(false);
      
      // Não mostrar erro, apenas informação
      return;
      
      /* CÓDIGO DESABILITADO TEMPORARIAMENTE
      console.log('🎬 Buscando filmes e séries IPTV...');
      
      const response = await fetch(`${serverUrl}/iptv/playlists/filmes`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Filmes/Séries carregados:', data.total);

      setMovies(data.movies || []);
      setCategories(data.categories || {});
      setLoading(false);
      */
    } catch (err) {
      console.error('❌ Erro ao carregar filmes:', err);
      setError('Erro ao carregar filmes. Tente novamente.');
      setLoading(false);
    }
  };

  const handleStreamSelect = (stream: Channel) => {
    console.log('▶️ Selecionando stream:', stream.name);
    setSelectedStream(stream);
  };

  const getFilteredItems = () => {
    const items = activeTab === 'canais' ? channels : movies;
    
    let filtered = items;

    // Filter by category
    if (selectedCategory !== 'Todos') {
      filtered = categories[selectedCategory] || [];
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const categoryList = Object.keys(categories).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#141414] to-[#1a0a0f]">
      <NetflixHeader
        activeCategory="iptv"
        onCategoryChange={onCategoryChange || (() => {})}
        onSearchClick={onSearchClick || (() => {})}
      />

      <div className="pt-20 px-4 md:px-12 pb-20">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-white text-3xl md:text-5xl font-black mb-2 flex items-center gap-3">
            <TvIcon className="w-10 h-10 text-[#E50914]" />
            RedFlix IPTV
          </h1>
          <p className="text-gray-400 text-sm md:text-base">
            Assista canais ao vivo e conteúdo sob demanda
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('canais')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'canais'
                ? 'text-white border-b-4 border-[#E50914]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <TvIcon className="w-5 h-5" />
              <span>Canais ao Vivo</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('filmes')}
            className={`px-6 py-3 font-bold transition-all ${
              activeTab === 'filmes'
                ? 'text-white border-b-4 border-[#E50914]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <FilmIcon className="w-5 h-5" />
              <span>Filmes & Séries</span>
            </div>
          </button>
        </div>

        {/* Loading State para Canais */}
        {activeTab === 'canais' && loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <Loader2Icon className="w-12 h-12 text-[#E50914] animate-spin" />
              <p className="text-white">Carregando canais...</p>
            </div>
          </div>
        )}

        {/* Error State para Canais */}
        {activeTab === 'canais' && error && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4 p-8 bg-red-900/20 border border-red-500 rounded-lg max-w-md">
              <AlertCircleIcon className="w-12 h-12 text-red-500" />
              <p className="text-white text-center">{error}</p>
              <button
                onClick={() => fetchChannels()}
                className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-[#E50914]/90 transition"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}

        {/* NOVA INTERFACE: Menu Lateral para Canais */}
        {activeTab === 'canais' && !loading && !error && (
          <div className="flex gap-6 h-[calc(100vh-280px)]">
            {/* Menu Lateral Esquerdo - Lista de Canais */}
            <div className="w-80 flex-shrink-0 bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden flex flex-col">
              {/* Header do Menu */}
              <div className="p-4 border-b border-gray-800 bg-[#0f0f0f]">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <TvIcon className="w-5 h-5 text-[#E50914]" />
                  Canais Disponíveis
                </h3>
                <p className="text-gray-400 text-xs mt-1">
                  {getFilteredItems().length} canais
                </p>
              </div>

              {/* Search dentro do menu */}
              <div className="p-3 border-b border-gray-800">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar canal..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800/50 text-white text-sm pl-9 pr-3 py-2 rounded border border-gray-700 focus:border-[#E50914] focus:outline-none transition"
                  />
                </div>
              </div>

              {/* Category Filter dentro do menu */}
              <div className="px-3 py-2 border-b border-gray-800">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-gray-800/50 text-white text-sm px-3 py-2 rounded border border-gray-700 focus:border-[#E50914] focus:outline-none transition"
                >
                  <option value="Todos">Todas as categorias</option>
                  {categoryList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Lista de Canais com Scroll */}
              <div className="flex-1 overflow-y-auto">
                {getFilteredItems().map((channel, index) => (
                  <div
                    key={`${channel.url}-${index}`}
                    onClick={() => handleStreamSelect(channel)}
                    className={`flex items-center gap-3 p-3 cursor-pointer transition-all border-l-4 ${
                      selectedStream?.url === channel.url
                        ? 'bg-[#E50914]/20 border-[#E50914]'
                        : 'border-transparent hover:bg-gray-800/50 hover:border-gray-700'
                    }`}
                  >
                    {/* Logo do Canal */}
                    <div className="w-12 h-12 flex-shrink-0 bg-gray-800 rounded overflow-hidden border border-gray-700">
                      {channel.logo ? (
                        <img
                          src={channel.logo}
                          alt={channel.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TvIcon className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                    </div>

                    {/* Nome e Categoria */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-semibold truncate">
                        {channel.name}
                      </h4>
                      {channel.category && (
                        <p className="text-gray-400 text-xs truncate">
                          {channel.category}
                        </p>
                      )}
                    </div>

                    {/* Indicador de Reprodução */}
                    {selectedStream?.url === channel.url && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Empty State */}
                {getFilteredItems().length === 0 && (
                  <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                    <TvIcon className="w-12 h-12 mb-2" />
                    <p className="text-sm">Nenhum canal encontrado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Player Principal à Direita */}
            <div className="flex-1 bg-black rounded-lg border border-gray-800 overflow-hidden">
              {selectedStream ? (
                <IPTVPlayerP2P
                  streamUrl={selectedStream.url}
                  title={selectedStream.name}
                  onClose={() => setSelectedStream(null)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                  <TvIcon className="w-24 h-24 mb-4 text-gray-700" />
                  <h3 className="text-xl font-bold text-gray-400 mb-2">
                    Selecione um canal
                  </h3>
                  <p className="text-sm text-gray-600">
                    Clique em um canal no menu lateral para começar a assistir
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Interface original para Filmes & Séries */}
        {activeTab === 'filmes' && (
          <>
            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800/50 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-[#E50914] focus:outline-none transition"
                />
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <FilterIcon className="w-5 h-5 text-gray-400" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-[#E50914] focus:outline-none transition min-w-[200px]"
                >
                  <option value="Todos">Todas as categorias</option>
                  {categoryList.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex gap-2 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition ${
                    viewMode === 'grid' ? 'bg-[#E50914] text-white' : 'text-gray-400'
                  }`}
                >
                  <GridIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition ${
                    viewMode === 'list' ? 'bg-[#E50914] text-white' : 'text-gray-400'
                  }`}
                >
                  <ListIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4">
                  <Loader2Icon className="w-12 h-12 text-[#E50914] animate-spin" />
                  <p className="text-white">Carregando conteúdo...</p>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="flex items-center justify-center py-20">
                <div className="flex flex-col items-center gap-4 p-8 bg-red-900/20 border border-red-500 rounded-lg max-w-md">
                  <AlertCircleIcon className="w-12 h-12 text-red-500" />
                  <p className="text-white text-center">{error}</p>
                  <button
                    onClick={() => activeTab === 'canais' ? fetchChannels() : fetchMovies()}
                    className="px-6 py-2 bg-[#E50914] text-white rounded-lg hover:bg-[#E50914]/90 transition"
                  >
                    Tentar Novamente
                  </button>
                </div>
              </div>
            )}

            {/* Content Grid/List */}
            {!loading && !error && (
              <>
                {/* Stats */}
                <div className="mb-4 text-gray-400 text-sm">
                  Mostrando {getFilteredItems().length} itens
                </div>

                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {getFilteredItems().map((item, index) => (
                      <div
                        key={`${item.url}-${index}`}
                        onClick={() => handleStreamSelect(item)}
                        className="group cursor-pointer"
                      >
                        <div className="relative aspect-video bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-[#E50914] transition-all duration-300">
                          {/* Logo or Thumbnail */}
                          {item.logo ? (
                            <img
                              src={item.logo}
                              alt={item.name}
                              className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {activeTab === 'canais' ? (
                                <TvIcon className="w-12 h-12 text-gray-600" />
                              ) : (
                                <FilmIcon className="w-12 h-12 text-gray-600" />
                              )}
                            </div>
                          )}
                          
                          {/* Play Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                            <PlayIcon className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity fill-white drop-shadow-lg" />
                          </div>

                          {/* Category Badge */}
                          {item.category && (
                            <div className="absolute top-2 right-2 bg-[#E50914]/90 px-2 py-1 rounded text-xs text-white font-bold">
                              {item.category}
                            </div>
                          )}
                        </div>
                        
                        {/* Title */}
                        <h3 className="mt-2 text-white text-sm font-semibold line-clamp-2 group-hover:text-[#E50914] transition">
                          {item.name}
                        </h3>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-2">
                    {getFilteredItems().map((item, index) => (
                      <div
                        key={`${item.url}-${index}`}
                        onClick={() => handleStreamSelect(item)}
                        className="flex items-center gap-4 p-4 bg-gray-800/30 hover:bg-gray-800/60 rounded-lg border border-gray-700 hover:border-[#E50914] cursor-pointer transition-all group"
                      >
                        {/* Logo */}
                        <div className="w-16 h-16 bg-gradient-to-br from-gray-700 to-gray-800 rounded flex items-center justify-center flex-shrink-0">
                          {item.logo ? (
                            <img src={item.logo} alt={item.name} className="w-full h-full object-contain p-2" />
                          ) : (
                            activeTab === 'canais' ? (
                              <TvIcon className="w-8 h-8 text-gray-500" />
                            ) : (
                              <FilmIcon className="w-8 h-8 text-gray-500" />
                            )
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold truncate group-hover:text-[#E50914] transition">
                            {item.name}
                          </h3>
                          {item.category && (
                            <p className="text-gray-400 text-sm">{item.category}</p>
                          )}
                        </div>

                        {/* Play Button */}
                        <PlayIcon className="w-8 h-8 text-gray-400 group-hover:text-[#E50914] transition flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {getFilteredItems().length === 0 && (
                  <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">Nenhum item encontrado</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}