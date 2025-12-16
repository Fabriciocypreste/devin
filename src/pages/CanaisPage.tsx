/**
 * 📺 REDFLIX - Página de Canais IPTV
 * 
 * Sistema completo de canais IPTV com:
 * - Parser do LISTAREAL.m3u
 * - Proteção por senha para conteúdo adulto
 * - Filtros por categoria e busca
 * - Grid responsivo
 * - Player integrado
 */

import { useState, useEffect } from 'react';
import {
  loadChannels,
  searchChannels,
  filterByCategory,
  getCategories,
  type Channel,
} from '../services/m3uParser';
import {
  hasAdultAccess,
  clearAdultAccess,
  getSessionTimeRemaining,
} from '../utils/adultContentProtection';
import { PasswordModal } from './PasswordModal';
import { PlayerModal } from './PlayerModal';

export function CanaisPage() {
  const [allChannels, setAllChannels] = useState<Channel[]>([]);
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingChannel, setPendingChannel] = useState<Channel | null>(null);
  const [hasAdultAuth, setHasAdultAuth] = useState(hasAdultAccess());
  
  // Player
  const [playingChannel, setPlayingChannel] = useState<Channel | null>(null);

  // Carregar canais na inicialização
  useEffect(() => {
    async function fetchChannels() {
      try {
        setLoading(true);
        setError(null);
        
        const channels = await loadChannels();
        setAllChannels(channels);
        setFilteredChannels(channels);
        
        const cats = getCategories(channels);
        setCategories(cats);
        
        setLoading(false);
      } catch (err: any) {
        console.error('Erro ao carregar canais:', err);
        setError(err.message || 'Erro ao carregar canais');
        setLoading(false);
      }
    }
    
    fetchChannels();
  }, []);

  // Aplicar filtros
  useEffect(() => {
    let result = allChannels;
    
    // Filtro por categoria
    result = filterByCategory(result, selectedCategory);
    
    // Filtro por busca
    result = searchChannels(result, searchQuery);
    
    // Ocultar canais adultos se não autenticado
    if (!hasAdultAuth) {
      result = result.filter(channel => !channel.isAdult);
    }
    
    setFilteredChannels(result);
  }, [allChannels, selectedCategory, searchQuery, hasAdultAuth]);

  // Atualizar estado de autenticação periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setHasAdultAuth(hasAdultAccess());
    }, 10000); // Verificar a cada 10 segundos
    
    return () => clearInterval(interval);
  }, []);

  const handleChannelClick = (channel: Channel) => {
    if (channel.isAdult && !hasAdultAuth) {
      // Canal adulto bloqueado - mostrar modal de senha
      setPendingChannel(channel);
      setShowPasswordModal(true);
    } else {
      // Canal permitido - abrir player
      setPlayingChannel(channel);
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setHasAdultAuth(true);
    
    // Abrir canal pendente
    if (pendingChannel) {
      setPlayingChannel(pendingChannel);
      setPendingChannel(null);
    }
  };

  const handleUnlockAdultArea = () => {
    if (hasAdultAuth) {
      // Já autenticado - remover acesso
      clearAdultAccess();
      setHasAdultAuth(false);
    } else {
      // Não autenticado - mostrar modal
      setShowPasswordModal(true);
    }
  };

  const totalChannels = allChannels.length;
  const adultChannelsCount = allChannels.filter(c => c.isAdult).length;
  const sessionTimeRemaining = getSessionTimeRemaining();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg">Carregando canais...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-600/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-white/10 px-6 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-white text-3xl font-bold flex items-center gap-3">
              📺 Canais IPTV
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              {filteredChannels.length} de {totalChannels} canais disponíveis
            </p>
          </div>
          
          {/* Adult Area Button */}
          {adultChannelsCount > 0 && (
            <button
              onClick={handleUnlockAdultArea}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
                hasAdultAuth
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              {hasAdultAuth ? (
                <>
                  <span>🔓</span>
                  <span>Área Adulta Ativa</span>
                  {sessionTimeRemaining > 0 && (
                    <span className="text-xs opacity-70">({sessionTimeRemaining}min)</span>
                  )}
                </>
              ) : (
                <>
                  <span>🔒</span>
                  <span>Área Adulta</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 py-4 bg-[#141414] border-b border-white/5">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Buscar canal..."
                className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-white/10 focus:border-red-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border border-white/10 focus:border-red-600 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="all">📂 Todas as Categorias</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors whitespace-nowrap"
            >
              Limpar Filtros
            </button>
          )}
        </div>
      </div>

      {/* Channels Grid */}
      <div className="p-6">
        {filteredChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {filteredChannels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel)}
                className="group relative bg-[#181818] rounded-lg overflow-hidden border border-white/10 hover:border-red-600 transition-all duration-300 cursor-pointer hover:scale-105"
              >
                {/* Channel Logo */}
                <div className="aspect-video bg-[#2a2a2a] flex items-center justify-center p-4">
                  {channel.logo ? (
                    <img
                      src={channel.logo}
                      alt={channel.name}
                      className="max-w-full max-h-full object-contain filter drop-shadow-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center">
                      <span className="text-white text-2xl font-bold">
                        {channel.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Channel Info */}
                <div className="p-4">
                  <h3 className="text-white font-semibold truncate mb-1">
                    {channel.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400 truncate flex-1">
                      {channel.group}
                    </span>
                    {channel.isAdult && !hasAdultAuth && (
                      <span className="text-lg" title="Conteúdo Adulto - Bloqueado">
                        🔒
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mx-auto mb-2 shadow-lg">
                      {channel.isAdult && !hasAdultAuth ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-white text-sm font-semibold">
                      {channel.isAdult && !hasAdultAuth ? '🔒 Desbloquear' : '▶️ Assistir'}
                    </p>
                  </div>
                </div>

                {/* Live Badge */}
                <div className="absolute top-2 right-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-red-600 rounded text-xs text-white font-semibold">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                    AO VIVO
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <span className="text-6xl mb-4">📺</span>
            <h3 className="text-white text-xl font-semibold mb-2">Nenhum canal encontrado</h3>
            <p className="text-gray-400">
              {searchQuery || selectedCategory !== 'all'
                ? 'Tente ajustar os filtros'
                : 'Nenhum canal disponível'}
            </p>
          </div>
        )}
      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPendingChannel(null);
        }}
        onSuccess={handlePasswordSuccess}
      />

      {/* Player Modal */}
      <PlayerModal
        channel={playingChannel}
        onClose={() => setPlayingChannel(null)}
      />
    </div>
  );
}
