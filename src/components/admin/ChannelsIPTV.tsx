/**
 * 📺 CANAIS AO VIVO (IPTV) - LISTA DE CANAIS
 * Gerenciamento completo dos canais IPTV
 */

import { useState } from 'react';

interface Channel {
  id: number;
  logo: string;
  nome: string;
  grupo: string;
  qualidade: string;
  status: 'Online' | 'Offline';
  audiencia: string;
  trend?: 'up' | 'down';
}

const mockChannels: Channel[] = [
  {
    id: 1,
    logo: '/logos/globo.png',
    nome: 'Globo HD',
    grupo: 'Entretenimento',
    qualidade: 'FHD 1080p',
    status: 'Online',
    audiencia: '34.5k',
    trend: 'up',
  },
  {
    id: 2,
    logo: '/logos/espn.png',
    nome: 'ESPN Brasil',
    grupo: 'Esportes',
    qualidade: 'FHD 1080p',
    status: 'Online',
    audiencia: '12.8k',
    trend: 'down',
  },
  {
    id: 3,
    logo: '/logos/discovery.png',
    nome: 'Discovery Channel',
    grupo: 'Documentários',
    qualidade: 'HD 720p',
    status: 'Online',
    audiencia: '—',
  },
  {
    id: 4,
    logo: '/logos/discovery.png',
    nome: 'Discovery Channel',
    grupo: 'Documentários',
    qualidade: 'HD 720p',
    status: 'Offline',
    audiencia: '—',
  },
  {
    id: 5,
    logo: '/logos/cnn.png',
    nome: 'CNN Brasil',
    grupo: 'Notícias',
    qualidade: 'FHD 1080p',
    status: 'Online',
    audiencia: '8.2k',
    trend: 'up',
  },
];

export function ChannelsIPTV() {
  const [searchTerm, setSearchTerm] = useState('');
  const [grupoFilter, setGrupoFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Canais ao Vivo (IPTV) - Lista de Canais</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar canal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E50914]"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>

        {/* Grupo Filter */}
        <button className="px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white hover:bg-[#2a2a2a] transition-colors flex items-center gap-2 min-w-[180px]">
          <span>Filtrar por Grupo</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Status Filter */}
        <button className="px-4 py-2.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-white hover:bg-[#2a2a2a] transition-colors flex items-center gap-2 min-w-[180px]">
          <span>Filtrar por Status</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {/* Create Button */}
        <button className="px-4 py-2.5 bg-[#E50914] hover:bg-[#E50914]/80 rounded text-white font-medium transition-colors whitespace-nowrap">
          Criar Canal Manual
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-[#2a2a2a]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Logo</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Nome</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Grupo</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Qualidade</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status online/offline</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Audiência em tempo real</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {mockChannels.map((channel) => (
                <tr key={channel.id} className="hover:bg-[#2a2a2a]/30 transition-colors">
                  {/* Logo */}
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 bg-[#2a2a2a] rounded-lg flex items-center justify-center overflow-hidden">
                      <div className="w-8 h-8 bg-white/10 rounded"></div>
                    </div>
                  </td>

                  {/* Nome */}
                  <td className="px-6 py-4 text-sm font-medium text-white">{channel.nome}</td>

                  {/* Grupo */}
                  <td className="px-6 py-4 text-sm text-gray-400">{channel.grupo}</td>

                  {/* Qualidade */}
                  <td className="px-6 py-4 text-sm text-gray-400">{channel.qualidade}</td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          channel.status === 'Online' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      ></span>
                      <span className={`text-sm ${
                        channel.status === 'Online' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {channel.status}
                      </span>
                    </div>
                  </td>

                  {/* Audiência */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{channel.audiencia}</span>
                      {channel.trend && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={channel.trend === 'up' ? '#10b981' : '#ef4444'}
                          strokeWidth="2"
                          className={channel.trend === 'up' ? '' : 'rotate-180'}
                        >
                          <polyline points="18 15 12 9 6 15" />
                        </svg>
                      )}
                    </div>
                  </td>

                  {/* Ações */}
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit */}
                      <button className="p-2 hover:bg-[#3a3a3a] rounded transition-colors" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>

                      {/* Play */}
                      <button className="p-2 hover:bg-[#3a3a3a] rounded transition-colors" title="Testar Stream">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      </button>

                      {/* View */}
                      <button className="p-2 hover:bg-[#3a3a3a] rounded transition-colors" title="Visualizar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-[#2a2a2a]">
          <button className="p-2 hover:bg-[#2a2a2a] rounded transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="11 17 6 12 11 7" />
              <polyline points="18 17 13 12 18 7" />
            </svg>
          </button>

          <button className="w-8 h-8 bg-[#E50914] text-white rounded transition-colors">
            1
          </button>

          <span className="text-gray-500">...</span>

          <button className="p-2 hover:bg-[#2a2a2a] rounded transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="13 17 18 12 13 7" />
              <polyline points="6 17 11 12 6 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
