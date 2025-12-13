/**
 * 👤 LISTA DE ASSINANTES
 * Tabela completa com todos os assinantes do sistema
 */

import { useState } from 'react';

interface Subscriber {
  id: number;
  nomeCompleto: string;
  email: string;
  telefone: string;
  planoAtual: string;
  status: 'Ativo' | 'Suspenso' | 'Cancelado';
  metodoPagamento: string;
  proximaCobranca: string;
  dataCriacao: string;
}

const mockSubscribers: Subscriber[] = [
  {
    id: 1,
    nomeCompleto: 'Ana Silva',
    email: 'ana.silva@email.com',
    telefone: '+55 11 99999-1234',
    planoAtual: 'Premium 4K',
    status: 'Ativo',
    metodoPagamento: 'Cartão de Crédito',
    proximaCobranca: '15/08/2024',
    dataCriacao: '10/02/2023',
  },
  {
    id: 2,
    nomeCompleto: 'Carlos Oliveira',
    email: 'carlos.o@email.com',
    telefone: '+55 21 98888-5678',
    planoAtual: 'Básico HD',
    status: 'Suspenso',
    metodoPagamento: 'Boleto',
    proximaCobranca: 'N/A',
    dataCriacao: '22/11/2023',
  },
  {
    id: 3,
    nomeCompleto: 'Beatriz Santos',
    email: 'bea.santos@email.com',
    telefone: '+55 31 97777-4321',
    planoAtual: 'Standard Full HD',
    status: 'Cancelado',
    metodoPagamento: 'Pix',
    proximaCobranca: 'N/A',
    dataCriacao: '05/06/2024',
  },
  {
    id: 4,
    nomeCompleto: 'Luíra Santos',
    email: 'bea.santos@email.com',
    telefone: '+55 31 97777-4321',
    planoAtual: 'Standard Full HD',
    status: 'Ativo',
    metodoPagamento: 'Cartão de Crédito',
    proximaCobranca: '15/08/2024',
    dataCriacao: '10/02/2023',
  },
  {
    id: 5,
    nomeCompleto: 'Anndia Silva',
    email: 'ana.silva@email.com',
    telefone: '+55 11 99999-1234',
    planoAtual: 'Básico HD',
    status: 'Suspenso',
    metodoPagamento: 'Cartão de Crédito',
    proximaCobranca: 'N/A',
    dataCriacao: '22/11/2023',
  },
  {
    id: 6,
    nomeCompleto: 'Carlos Oliveira',
    email: 'ana.silva@email.com',
    telefone: '+55 11 99999-1234',
    planoAtual: 'Premium 4K',
    status: 'Ativo',
    metodoPagamento: 'Cartão de Crédito',
    proximaCobranca: '15/08/2024',
    dataCriacao: '10/02/2023',
  },
  {
    id: 7,
    nomeCompleto: 'Matriz Santos',
    email: 'ana.silva@email.com',
    telefone: '+55 21 98888-5678',
    planoAtual: 'Básico HD',
    status: 'Suspenso',
    metodoPagamento: 'Boleto',
    proximaCobranca: 'N/A',
    dataCriacao: '22/11/2023',
  },
  {
    id: 8,
    nomeCompleto: 'Ana Silva',
    email: 'ana.silva@email.com',
    telefone: '+55 11 99999-1234',
    planoAtual: 'Premium 4K',
    status: 'Ativo',
    metodoPagamento: 'Boleto',
    proximaCobranca: '15/08/2024',
    dataCriacao: '10/02/2023',
  },
  {
    id: 9,
    nomeCompleto: 'Carlos Oliveira',
    email: 'carlos.o@email.com',
    telefone: '+55 21 98888-5678',
    planoAtual: 'Standard Full HD',
    status: 'Cancelado',
    metodoPagamento: 'Pix',
    proximaCobranca: '12/08/2024',
    dataCriacao: '05/06/2024',
  },
  {
    id: 10,
    nomeCompleto: 'Beatriz Santos',
    email: 'bea.santos@email.com',
    telefone: '+55 31 97777-4321',
    planoAtual: 'Premium 4K',
    status: 'Ativo',
    metodoPagamento: 'Cartão de Crédito',
    proximaCobranca: 'N/A',
    dataCriacao: '15/03/2024',
  },
];

export function SubscribersList() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [planoFilter, setPlanoFilter] = useState<string>('');

  const totalPages = 5;
  const itemsPerPage = 10;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-500/20 text-green-500';
      case 'Suspenso':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'Cancelado':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Lista de Assinantes</h1>
        <button className="px-4 py-2 bg-[#E50914] hover:bg-[#E50914]/80 rounded text-white font-medium transition-colors flex items-center gap-2">
          <span>+</span>
          <span>Adicionar Assinante</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Buscar por nome, email, telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-2 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#E50914]"
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

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-2 text-white focus:outline-none focus:border-[#E50914] min-w-[150px]"
        >
          <option value="">Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Suspenso">Suspenso</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        {/* Plano Filter */}
        <select
          value={planoFilter}
          onChange={(e) => setPlanoFilter(e.target.value)}
          className="bg-[#1a1a1a] border border-[#2a2a2a] rounded px-4 py-2 text-white focus:outline-none focus:border-[#E50914] min-w-[150px]"
        >
          <option value="">Plano</option>
          <option value="Básico HD">Básico HD</option>
          <option value="Standard Full HD">Standard Full HD</option>
          <option value="Premium 4K">Premium 4K</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#0a0a0a] border-b border-[#2a2a2a]">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Nome completo</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Email</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Telefone</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Plano atual</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Método de pagamento</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Próxima cobrança</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Data de criação</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2a2a]">
              {mockSubscribers.map((subscriber) => (
                <tr key={subscriber.id} className="hover:bg-[#2a2a2a]/30 transition-colors">
                  <td className="px-6 py-4 text-sm text-white">{subscriber.nomeCompleto}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{subscriber.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{subscriber.telefone}</td>
                  <td className="px-6 py-4 text-sm text-white">{subscriber.planoAtual}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(subscriber.status)}`}>
                      {subscriber.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">{subscriber.metodoPagamento}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{subscriber.proximaCobranca}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{subscriber.dataCriacao}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      {/* Edit Icon */}
                      <button className="p-1.5 hover:bg-[#3a3a3a] rounded transition-colors" title="Editar">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                        </svg>
                      </button>
                      {/* View Icon */}
                      <button className="p-1.5 hover:bg-[#3a3a3a] rounded transition-colors" title="Visualizar">
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
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#2a2a2a]">
          <div className="text-sm text-gray-400">
            Exibindo 1-10 de 250
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded transition-colors ${
                  currentPage === page
                    ? 'bg-[#E50914] text-white'
                    : 'hover:bg-[#2a2a2a] text-gray-400'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="p-2 hover:bg-[#2a2a2a] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
