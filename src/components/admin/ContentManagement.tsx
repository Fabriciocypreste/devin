import { Card } from '../ui/card';
import { Button } from '../ui/button-simple';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge-simple';
import { useState } from 'react';

// Icons inline to avoid lucide-react dependency
const Video = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="23 7 16 12 23 17 23 7"></polygon>
    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
  </svg>
);

const Upload = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17 8 12 3 7 8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
);

const Plus = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const Search = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const Filter = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const Edit = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const Trash2 = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const Eye = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export function ContentManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const content = [
    { 
      id: 1, 
      title: 'Breaking Bad', 
      type: 'Série',
      status: 'Publicado',
      views: 45890,
      rating: 9.5,
      episodes: 62,
      seasons: 5,
      uploadDate: '2024-01-15'
    },
    { 
      id: 2, 
      title: 'Inception', 
      type: 'Filme',
      status: 'Publicado',
      views: 32450,
      rating: 8.8,
      duration: '148 min',
      uploadDate: '2024-02-10'
    },
    { 
      id: 3, 
      title: 'Dark', 
      type: 'Série',
      status: 'Rascunho',
      views: 0,
      rating: 0,
      episodes: 26,
      seasons: 3,
      uploadDate: '2024-11-01'
    },
    { 
      id: 4, 
      title: 'The Matrix', 
      type: 'Filme',
      status: 'Pendente',
      views: 0,
      rating: 0,
      duration: '136 min',
      uploadDate: '2024-11-03'
    },
  ];

  const stats = {
    total: 2847,
    published: 2456,
    pending: 234,
    draft: 157
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
            Gerenciamento de Conteúdo
          </h1>
          <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
            {stats.total.toLocaleString()} títulos no catálogo
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            <Upload size={16} className="mr-2" />
            Importar
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Plus size={16} className="mr-2" />
            Adicionar Conteúdo
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Video className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">Total</p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.total.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <Eye className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">Publicados</p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.published.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-600/20 rounded-lg">
              <Filter className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">Pendentes</p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.pending.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gray-600/20 rounded-lg">
              <Edit className="text-gray-400" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">Rascunhos</p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.draft.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="bg-[#1a1a1a] border-white/10 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <Input
            placeholder="Buscar por título, gênero ou tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10 text-white"
          />
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {content.map((item) => (
          <Card key={item.id} className="bg-[#1a1a1a] border-white/10 overflow-hidden group">
            {/* Thumbnail */}
            <div className="aspect-video bg-gradient-to-br from-red-900/20 to-purple-900/20 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Video className="text-white/30" size={48} />
              </div>
              <div className="absolute top-2 right-2">
                <Badge className={`${
                  item.status === 'Publicado' ? 'bg-green-600/80' :
                  item.status === 'Pendente' ? 'bg-yellow-600/80' :
                  'bg-gray-600/80'
                } text-white border-0`}>
                  {item.status}
                </Badge>
              </div>
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <Eye size={18} className="text-white" />
                </button>
                <button className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors">
                  <Edit size={18} className="text-white" />
                </button>
                <button className="p-2 bg-red-600/60 hover:bg-red-600/80 rounded-lg transition-colors">
                  <Trash2 size={18} className="text-white" />
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-white font-['Inter:Semi_Bold',sans-serif] text-[15px] line-clamp-1">
                  {item.title}
                </h3>
                {item.rating > 0 && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-yellow-500 text-[12px]">★</span>
                    <span className="text-white font-['Inter:Bold',sans-serif] text-[12px]">
                      {item.rating}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-white/20 text-white/70 text-[11px]">
                  {item.type}
                </Badge>
                {item.type === 'Série' && (
                  <span className="text-white/50 text-[12px]">
                    {item.seasons} temp. • {item.episodes} ep.
                  </span>
                )}
                {item.type === 'Filme' && (
                  <span className="text-white/50 text-[12px]">
                    {item.duration}
                  </span>
                )}
              </div>

              {item.views > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <span className="text-white/50 text-[12px]">Visualizações</span>
                  <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[13px]">
                    {item.views.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="text-white/40 text-[11px]">
                Adicionado: {new Date(item.uploadDate).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
