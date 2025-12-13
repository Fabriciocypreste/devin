import React, { useState } from 'react';
import { X, Upload, FileText, Film, Tv, Radio } from 'lucide-react';

/**
 * 🎯 MODAL PARA IMPORTAR CONTEÚDO DO GITHUB
 * 
 * Permite colar conteúdo dos arquivos:
 * - filmes.txt
 * - series.txt
 * - canais.txt
 * 
 * Repositório: https://github.com/Fabriciocypreste/lista.git
 */

interface ImportContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (type: 'filmes' | 'series' | 'canais', content: string) => void;
}

export function ImportContentModal({ isOpen, onClose, onImport }: ImportContentModalProps) {
  const [activeTab, setActiveTab] = useState<'filmes' | 'series' | 'canais'>('filmes');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleImport = async () => {
    if (!content.trim()) {
      alert('Por favor, cole o conteúdo do arquivo!');
      return;
    }

    setIsProcessing(true);
    try {
      await onImport(activeTab, content);
      alert(`✅ ${activeTab.toUpperCase()} importado com sucesso!`);
      setContent('');
      onClose();
    } catch (error) {
      alert(`❌ Erro ao importar: ${error}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: 'filmes' as const, label: 'Filmes', icon: Film, color: 'text-red-500' },
    { id: 'series' as const, label: 'Séries', icon: Tv, color: 'text-blue-500' },
    { id: 'canais' as const, label: 'Canais', icon: Radio, color: 'text-green-500' },
  ];

  const getInstructions = () => {
    const baseUrl = 'https://github.com/Fabriciocypreste/lista/blob/main';
    const files = {
      filmes: `${baseUrl}/filmes.txt`,
      series: `${baseUrl}/series.txt`,
      canais: `${baseUrl}/canais.txt`,
    };

    return (
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-4">
        <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Como importar?
        </h4>
        <ol className="text-sm text-gray-300 space-y-2 ml-4 list-decimal">
          <li>
            Acesse:{' '}
            <a 
              href={files[activeTab]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline break-all"
            >
              {activeTab}.txt
            </a>
          </li>
          <li>Clique em "Raw" no canto superior direito</li>
          <li>Selecione todo o conteúdo (Ctrl+A / Cmd+A)</li>
          <li>Copie (Ctrl+C / Cmd+C)</li>
          <li>Cole no campo abaixo (Ctrl+V / Cmd+V)</li>
          <li>Clique em "Importar"</li>
        </ol>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Upload className="w-6 h-6 text-[#E50914]" />
              Importar Conteúdo Real
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Repositório: github.com/Fabriciocypreste/lista
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-6 pb-0 border-b border-white/10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setContent('');
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-t-lg transition-all ${
                  isActive
                    ? 'bg-white/10 border-t-2 border-[#E50914] text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? tab.color : ''}`} />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {getInstructions()}

          {/* Textarea */}
          <div className="mb-4">
            <label className="block text-white font-semibold mb-2">
              Cole o conteúdo do arquivo {activeTab}.txt:
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`#EXTM3U\n#EXTINF:-1,Título do ${activeTab.slice(0, -1)}\nhttp://exemplo.com/stream.m3u8\n\n...`}
              className="w-full h-64 bg-black/50 border border-white/20 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none focus:border-[#E50914] transition-colors"
              spellCheck={false}
            />
            <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
              <span>
                {content.length > 0 ? `${content.length.toLocaleString()} caracteres` : 'Aguardando conteúdo...'}
              </span>
              {content.length > 0 && (
                <button
                  onClick={() => setContent('')}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

          {/* Preview */}
          {content.length > 0 && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <h4 className="text-green-400 font-bold mb-2">✅ Prévia detectada</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>• Formato: {content.startsWith('#EXTM3U') ? 'M3U válido' : 'Texto'}</p>
                <p>• Linhas: ~{content.split('\n').length}</p>
                <p>• Tamanho: {(content.length / 1024).toFixed(2)} KB</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-white/10 bg-black/20">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleImport}
            disabled={!content.trim() || isProcessing}
            className="px-8 py-3 bg-[#E50914] hover:bg-[#f40612] text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processando...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Importar {activeTab.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
