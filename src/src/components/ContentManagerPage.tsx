import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Eye, Database, TrendingUp, Film, Tv, Radio } from 'lucide-react';
import { ImportContentModal } from './ImportContentModal';
import { parseM3UContent, saveImportedContent, loadImportedContent, getImportStats, clearImportedContent, convertToMovieFormat } from '../utils/contentImporter';

/**
 * 🎯 PÁGINA DE GERENCIAMENTO DE CONTEÚDO IMPORTADO
 * 
 * Permite importar e gerenciar conteúdo do repositório:
 * https://github.com/Fabriciocypreste/lista.git
 */

export function ContentManagerPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({ filmes: 0, series: 0, canais: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const importStats = await getImportStats();
      setStats(importStats);
    } catch (error) {
      console.error('❌ Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = async (type: 'filmes' | 'series' | 'canais', content: string) => {
    console.log(`📥 Importing ${type}...`);
    
    // Parse content
    const items = parseM3UContent(content, type);
    
    if (items.length === 0) {
      throw new Error('Nenhum item válido encontrado no conteúdo');
    }

    // Save to server
    await saveImportedContent(type, items);
    
    // Reload stats
    await loadStats();
    
    console.log(`✅ Successfully imported ${items.length} ${type}`);
  };

  const handleClear = async (type: 'filmes' | 'series' | 'canais') => {
    if (!confirm(`Tem certeza que deseja limpar todos os ${type}?`)) {
      return;
    }

    try {
      await clearImportedContent(type);
      await loadStats();
      alert(`✅ ${type.toUpperCase()} limpos com sucesso!`);
    } catch (error) {
      alert(`❌ Erro ao limpar ${type}: ${error}`);
    }
  };

  const cards = [
    { type: 'filmes' as const, label: 'Filmes', icon: Film, color: 'from-red-500/20 to-red-600/20', iconColor: 'text-red-500', count: stats.filmes },
    { type: 'series' as const, label: 'Séries', icon: Tv, color: 'from-blue-500/20 to-blue-600/20', iconColor: 'text-blue-500', count: stats.series },
    { type: 'canais' as const, label: 'Canais', icon: Radio, color: 'from-green-500/20 to-green-600/20', iconColor: 'text-green-500', count: stats.canais },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black pt-20 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
            <Database className="w-10 h-10 text-[#E50914]" />
            Gerenciar Conteúdo
          </h1>
          <p className="text-gray-400 text-lg">
            Importe conteúdo real do repositório{' '}
            <a 
              href="https://github.com/Fabriciocypreste/lista" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E50914] hover:underline"
            >
              github.com/Fabriciocypreste/lista
            </a>
          </p>
        </div>

        {/* Total Stats Card */}
        <div className="bg-gradient-to-br from-[#E50914]/20 to-[#E50914]/10 border border-[#E50914]/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#E50914] rounded-full flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold">Total de Itens</h3>
                <p className="text-gray-400">Conteúdo importado e disponível</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-black text-white">
                {isLoading ? '...' : stats.total.toLocaleString()}
              </div>
              <div className="text-gray-400 text-sm mt-1">
                {stats.filmes + stats.series + stats.canais > 0 ? 'Ativos' : 'Vazio'}
              </div>
            </div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.type}
                className={`relative bg-gradient-to-br ${card.color} backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all hover:scale-105 group`}
              >
                {/* Icon */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className={`w-6 h-6 ${card.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="text-white text-xl font-bold">{card.label}</h3>
                    <p className="text-gray-400 text-sm">Repositório GitHub</p>
                  </div>
                </div>

                {/* Count */}
                <div className="mb-6">
                  <div className="text-4xl font-black text-white mb-1">
                    {isLoading ? '...' : card.count.toLocaleString()}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {card.count === 0 ? 'Nenhum item' : card.count === 1 ? '1 item' : `${card.count} itens`}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                  >
                    <Upload className="w-4 h-4" />
                    Importar
                  </button>
                  {card.count > 0 && (
                    <button
                      onClick={() => handleClear(card.type)}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-semibold"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    card.count > 0 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {card.count > 0 ? 'Ativo' : 'Vazio'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <h3 className="text-white text-xl font-bold mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#E50914]" />
            Como usar?
          </h3>
          <div className="space-y-4 text-gray-300">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#E50914] rounded-full flex items-center justify-center text-white font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Acesse o repositório</p>
                <p className="text-sm">
                  Visite{' '}
                  <a 
                    href="https://github.com/Fabriciocypreste/lista" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#E50914] hover:underline"
                  >
                    github.com/Fabriciocypreste/lista
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#E50914] rounded-full flex items-center justify-center text-white font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Escolha o arquivo</p>
                <p className="text-sm">
                  Selecione <code className="bg-black/50 px-2 py-0.5 rounded">filmes.txt</code>,{' '}
                  <code className="bg-black/50 px-2 py-0.5 rounded">series.txt</code> ou{' '}
                  <code className="bg-black/50 px-2 py-0.5 rounded">canais.txt</code>
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#E50914] rounded-full flex items-center justify-center text-white font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Copie o conteúdo</p>
                <p className="text-sm">
                  Clique em "Raw" no GitHub e copie todo o conteúdo do arquivo
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#E50914] rounded-full flex items-center justify-center text-white font-bold">
                4
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Importe na RedFlix</p>
                <p className="text-sm">
                  Clique em "Importar", cole o conteúdo e confirme
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                ✓
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Pronto!</p>
                <p className="text-sm">
                  O conteúdo estará disponível imediatamente na plataforma
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Big Import Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-[#E50914] to-[#f40612] hover:from-[#f40612] hover:to-[#E50914] text-white text-xl font-bold rounded-2xl shadow-2xl shadow-[#E50914]/50 hover:shadow-[#E50914]/70 transition-all hover:scale-105"
          >
            <Upload className="w-6 h-6" />
            Importar Conteúdo do GitHub
          </button>
        </div>
      </div>

      {/* Import Modal */}
      <ImportContentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onImport={handleImport}
      />
    </div>
  );
}
