import { useState, useEffect } from 'react';
import { Movie } from '../utils/tmdb';
import { toast } from '../utils/toast';

// Icons inline to avoid lucide-react dependency
const XIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const PlayIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const InfoIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

const Trash2Icon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const FilterIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const Grid3x3Icon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const ListIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

const UploadIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const LinkIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
  </svg>
);

const DownloadIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

interface MyListPageProps {
  onClose?: () => void;
  onMovieClick?: (movie: Movie) => void;
  myList?: number[];
  onRemoveFromList?: (movieId: number) => void;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  likedList?: number[];
  watchLaterList?: number[];
}

export function MyListPage({ onClose, onMovieClick, myList = [], onRemoveFromList, onAddToList, onLike, onWatchLater, likedList = [], watchLaterList = [] }: MyListPageProps) {
  const [filter, setFilter] = useState<'all' | 'movies' | 'series'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'title' | 'rating'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [content, setContent] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importLoading, setImportLoading] = useState(false);

  // Função para parsear M3U/M3U8
  const parseM3U = (content: string): { title: string; url: string }[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const items: { title: string; url: string }[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Linha EXTINF com informações
      if (line.startsWith('#EXTINF:')) {
        const titleMatch = line.match(/,(.+)$/);
        const title = titleMatch ? titleMatch[1].trim() : 'Sem título';
        
        // Próxima linha deve ser a URL
        if (i + 1 < lines.length && !lines[i + 1].startsWith('#')) {
          const url = lines[i + 1].trim();
          items.push({ title, url });
        }
      }
      // Linha com URL direta (sem EXTINF)
      else if (!line.startsWith('#') && (line.startsWith('http') || line.includes('://'))) {
        const title = line.split('/').pop() || 'Stream';
        items.push({ title, url: line });
      }
    }
    
    return items;
  };

  // Função para parsear TXT simples
  const parseTXT = (content: string): { title: string; url: string }[] => {
    const lines = content.split('\n').filter(line => line.trim());
    const items: { title: string; url: string }[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('http') || trimmed.includes('://')) {
        const title = trimmed.split('/').pop() || 'Stream';
        items.push({ title, url: trimmed });
      }
    }
    
    return items;
  };

  // Função para importar lista de URL
  const handleImportFromUrl = async () => {
    if (!importUrl.trim()) {
      toast.error('Digite uma URL válida');
      return;
    }

    setImportLoading(true);
    try {
      const response = await fetch(importUrl);
      if (!response.ok) throw new Error('Erro ao baixar lista');
      
      const content = await response.text();
      const fileType = importUrl.toLowerCase().endsWith('.m3u') || 
                       importUrl.toLowerCase().endsWith('.m3u8') ? 'm3u' : 'txt';
      
      const items = fileType === 'm3u' ? parseM3U(content) : parseTXT(content);
      
      if (items.length === 0) {
        toast.error('Nenhum item válido encontrado na lista');
        return;
      }

      // Salvar URLs no localStorage
      const existingUrls = JSON.parse(localStorage.getItem('redflix_custom_streams') || '{}');
      items.forEach(item => {
        existingUrls[item.title] = item.url;
      });
      localStorage.setItem('redflix_custom_streams', JSON.stringify(existingUrls));
      
      toast.success(`${items.length} itens importados com sucesso! 🎉`);
      setImportUrl('');
      setShowImportModal(false);
    } catch (error) {
      console.error('Erro ao importar lista:', error);
      toast.error('Erro ao importar lista. Verifique a URL.');
    } finally {
      setImportLoading(false);
    }
  };

  // Função para importar arquivo
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Verificar extensão
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.txt', '.m3u', '.m3u8', '.ts'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      toast.error('Formato não suportado. Use: .txt, .m3u, .m3u8 ou .ts');
      return;
    }

    setImportLoading(true);
    try {
      const content = await file.text();
      const fileType = fileName.endsWith('.m3u') || fileName.endsWith('.m3u8') ? 'm3u' : 'txt';
      
      const items = fileType === 'm3u' ? parseM3U(content) : parseTXT(content);
      
      if (items.length === 0) {
        toast.error('Nenhum item válido encontrado no arquivo');
        return;
      }

      // Salvar URLs no localStorage
      const existingUrls = JSON.parse(localStorage.getItem('redflix_custom_streams') || '{}');
      items.forEach(item => {
        existingUrls[item.title] = item.url;
      });
      localStorage.setItem('redflix_custom_streams', JSON.stringify(existingUrls));
      
      toast.success(`${items.length} itens importados do arquivo ${file.name}! 🎉`);
      setShowImportModal(false);
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      toast.error('Erro ao ler arquivo. Verifique o formato.');
    } finally {
      setImportLoading(false);
      // Limpar input
      event.target.value = '';
    }
  };

  // Buscar detalhes dos filmes/séries da minha lista
  useEffect(() => {
    const fetchMyListContent = async () => {
      if (myList.length === 0) {
        setContent([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const promises = myList.map(async (id) => {
          // Tentar buscar como filme
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/movie/${id}?api_key=ddb1bdf6aa91bdf335797853884b0c1d&language=pt-BR`
            );
            if (response.ok) {
              const data = await response.json();
              return { ...data, media_type: 'movie' };
            }
          } catch (error) {
            console.error('Error fetching movie:', error);
          }

          // Se não for filme, tentar como série
          try {
            const response = await fetch(
              `https://api.themoviedb.org/3/tv/${id}?api_key=ddb1bdf6aa91bdf335797853884b0c1d&language=pt-BR`
            );
            if (response.ok) {
              const data = await response.json();
              return { ...data, media_type: 'tv', title: data.name };
            }
          } catch (error) {
            console.error('Error fetching series:', error);
          }

          return null;
        });

        const results = await Promise.all(promises);
        const validContent = results.filter(item => item !== null) as Movie[];
        setContent(validContent);
      } catch (error) {
        console.error('Error loading My List:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyListContent();
  }, [myList]);

  // Filtrar e ordenar conteúdo
  const filteredContent = content
    .filter(item => {
      if (filter === 'movies') return item.media_type === 'movie';
      if (filter === 'series') return item.media_type === 'tv';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'title') {
        const titleA = a.title || a.name || '';
        const titleB = b.title || b.name || '';
        return titleA.localeCompare(titleB);
      }
      if (sortBy === 'rating') {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      return 0; // recent (manter ordem original)
    });

  const handleRemove = (movieId: number) => {
    if (onRemoveFromList) {
      onRemoveFromList(movieId);
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-20 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl mb-2">Minha Lista</h1>
            <p className="text-white/60">
              {filteredContent.length} {filteredContent.length === 1 ? 'título' : 'títulos'}
            </p>
          </div>
          <div className="flex gap-3">
            {/* Botão Importar Lista */}
            <button
              onClick={() => setShowImportModal(true)}
              className="px-4 py-2 bg-[#E50914] hover:bg-[#f40612] text-white rounded-md transition-colors flex items-center gap-2"
            >
              <DownloadIcon className="w-5 h-5" size={20} />
              Importar Lista
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <XIcon className="w-6 h-6" size={24} />
              </button>
            )}
          </div>
        </div>

        {/* Modal de Importação */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-lg max-w-2xl w-full p-6 relative">
              {/* Header do Modal */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl">Importar Lista de Streams</h2>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  disabled={importLoading}
                >
                  <XIcon className="w-6 h-6" size={24} />
                </button>
              </div>

              {/* Instruções */}
              <div className="bg-[#252525] border border-white/10 rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-2 flex items-center gap-2">
                  <InfoIcon size={18} />
                  Formatos Suportados
                </h3>
                <ul className="text-sm text-white/70 space-y-1 ml-6">
                  <li>• <strong>.txt</strong> - Lista simples de URLs (uma por linha)</li>
                  <li>• <strong>.m3u / .m3u8</strong> - Playlists IPTV com formato EXTINF</li>
                  <li>• <strong>.ts</strong> - Arquivos de transport stream</li>
                </ul>
              </div>

              {/* Importar por URL */}
              <div className="mb-6">
                <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                  <LinkIcon size={18} />
                  Importar de URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={importUrl}
                    onChange={(e) => setImportUrl(e.target.value)}
                    placeholder="https://exemplo.com/lista.m3u"
                    className="flex-1 bg-black/50 border border-white/20 text-white px-4 py-3 rounded-md focus:outline-none focus:border-[#E50914] placeholder:text-white/40"
                    disabled={importLoading}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleImportFromUrl();
                    }}
                  />
                  <button
                    onClick={handleImportFromUrl}
                    disabled={importLoading || !importUrl.trim()}
                    className="px-6 py-3 bg-[#E50914] hover:bg-[#f40612] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {importLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                        Importando...
                      </>
                    ) : (
                      <>
                        <DownloadIcon size={18} />
                        Importar
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-white/50 mt-2">
                  Cole a URL de uma lista .txt, .m3u ou .m3u8 hospedada online
                </p>
              </div>

              {/* Separador */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-white/10"></div>
                <span className="text-white/50 text-sm">OU</span>
                <div className="flex-1 h-px bg-white/10"></div>
              </div>

              {/* Importar por Upload */}
              <div>
                <label className="block text-sm text-white/70 mb-2 flex items-center gap-2">
                  <UploadIcon size={18} />
                  Fazer Upload de Arquivo
                </label>
                <input
                  type="file"
                  accept=".txt,.m3u,.m3u8,.ts"
                  onChange={handleFileUpload}
                  disabled={importLoading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className={`block w-full border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-[#E50914] hover:bg-[#E50914]/5 transition-all ${
                    importLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <UploadIcon className="w-12 h-12 mx-auto mb-3 text-white/40" size={48} />
                  <p className="text-white mb-1">Clique para selecionar ou arraste o arquivo aqui</p>
                  <p className="text-sm text-white/50">
                    Suporta: .txt, .m3u, .m3u8, .ts (máx. 10MB)
                  </p>
                </label>
              </div>

              {/* Exemplo de Formato */}
              <details className="mt-6">
                <summary className="cursor-pointer text-sm text-white/70 hover:text-white transition-colors">
                  Ver exemplos de formato
                </summary>
                <div className="mt-3 space-y-3">
                  <div className="bg-black/50 border border-white/10 rounded p-3">
                    <p className="text-xs text-white/50 mb-2">Exemplo .txt:</p>
                    <code className="text-xs text-white/80 block">
                      https://example.com/stream1.m3u8<br />
                      https://example.com/stream2.mp4<br />
                      https://example.com/stream3.ts
                    </code>
                  </div>
                  <div className="bg-black/50 border border-white/10 rounded p-3">
                    <p className="text-xs text-white/50 mb-2">Exemplo .m3u:</p>
                    <code className="text-xs text-white/80 block">
                      #EXTM3U<br />
                      #EXTINF:-1,Canal 1<br />
                      https://example.com/canal1.m3u8<br />
                      #EXTINF:-1,Canal 2<br />
                      https://example.com/canal2.m3u8
                    </code>
                  </div>
                </div>
              </details>
            </div>
          </div>
        )}

        {/* Filtros e Ordenação */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-full border transition-all ${
                filter === 'all'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('movies')}
              className={`px-4 py-2 rounded-full border transition-all ${
                filter === 'movies'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Filmes
            </button>
            <button
              onClick={() => setFilter('series')}
              className={`px-4 py-2 rounded-full border transition-all ${
                filter === 'series'
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/30 hover:border-white/60'
              }`}
            >
              Séries
            </button>
          </div>

          <div className="flex gap-4 items-center">
            {/* Ordenar */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/50 border border-white/30 text-white px-4 py-2 rounded appearance-none cursor-pointer hover:border-white/60 transition-colors pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="recent">Adicionado recentemente</option>
              <option value="title">Título (A-Z)</option>
              <option value="rating">Avaliação</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2 bg-black/50 border border-white/30 rounded p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <Grid3x3Icon className="w-5 h-5" size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-white/20' : 'hover:bg-white/10'
                }`}
              >
                <ListIcon className="w-5 h-5" size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E50914]"></div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredContent.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl mb-2">Sua lista está vazia</h2>
            <p className="text-white/60">
              {filter !== 'all' 
                ? `Nenhum ${filter === 'movies' ? 'filme' : 'série'} na sua lista`
                : 'Adicione filmes e séries para assistir mais tarde'}
            </p>
          </div>
        )}

        {/* Grid View */}
        {!loading && viewMode === 'grid' && filteredContent.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {filteredContent.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-[2/3] rounded-md overflow-hidden bg-zinc-800 relative">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                    <button
                      onClick={() => onMovieClick && onMovieClick(item)}
                      className="w-full bg-white text-black py-2 rounded-md hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <PlayIcon className="w-4 h-4 fill-current" size={16} />
                      Assistir
                    </button>
                    <button
                      onClick={() => onMovieClick && onMovieClick(item)}
                      className="w-full bg-zinc-700 text-white py-2 rounded-md hover:bg-zinc-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <InfoIcon className="w-4 h-4" size={16} />
                      Detalhes
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2Icon className="w-4 h-4" size={16} />
                      Remover
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className="text-sm line-clamp-1">{item.title || item.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-white/60 mt-1">
                    <span>{item.media_type === 'movie' ? 'Filme' : 'Série'}</span>
                    {item.vote_average && (
                      <>
                        <span>•</span>
                        <span className="text-yellow-500">★ {item.vote_average.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {!loading && viewMode === 'list' && filteredContent.length > 0 && (
          <div className="space-y-3">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900/50 rounded-lg p-4 flex gap-4 hover:bg-zinc-900 transition-colors group"
              >
                <div className="w-24 h-36 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                    alt={item.title || item.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg mb-1">{item.title || item.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/60 mb-2">
                    <span className="px-2 py-1 bg-white/10 rounded text-xs">
                      {item.media_type === 'movie' ? 'Filme' : 'Série'}
                    </span>
                    {item.vote_average && (
                      <span className="text-yellow-500">★ {item.vote_average.toFixed(1)}</span>
                    )}
                    {(item.release_date || item.first_air_date) && (
                      <span>
                        {new Date(item.release_date || item.first_air_date || '').getFullYear()}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-white/60 line-clamp-2">{item.overview}</p>
                </div>
                <div className="flex flex-col gap-2 flex-shrink-0">
                  <button
                    onClick={() => onMovieClick && onMovieClick(item)}
                    className="px-4 py-2 bg-white text-black rounded-md hover:bg-white/90 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <PlayIcon className="w-4 h-4 fill-current" size={16} />
                    Assistir
                  </button>
                  <button
                    onClick={() => onMovieClick && onMovieClick(item)}
                    className="px-4 py-2 bg-zinc-700 text-white rounded-md hover:bg-zinc-600 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <InfoIcon className="w-4 h-4" size={16} />
                    Info
                  </button>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="px-4 py-2 bg-red-600/20 text-red-500 rounded-md hover:bg-red-600/30 transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <Trash2Icon className="w-4 h-4" size={16} />
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}