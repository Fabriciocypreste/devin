import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Channel } from '../utils/channelsParser';

// Icons inline to avoid lucide-react dependency
const X = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const ChevronLeft = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);

const List = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"></line>
    <line x1="8" y1="12" x2="21" y2="12"></line>
    <line x1="8" y1="18" x2="21" y2="18"></line>
    <line x1="3" y1="6" x2="3.01" y2="6"></line>
    <line x1="3" y1="12" x2="3.01" y2="12"></line>
    <line x1="3" y1="18" x2="3.01" y2="18"></line>
  </svg>
);

interface VideoPlayerProps {
  channel: Channel;
  onClose: () => void;
}

export function VideoPlayer({ channel, onClose }: VideoPlayerProps) {
  const [showEpisodes, setShowEpisodes] = useState(false);

  // Log quando o player abre para mostrar que está usando URL REAL
  useState(() => {
    console.log('📺 ========================================');
    console.log('🎬 REPRODUZINDO CANAL COM DADOS REAIS');
    console.log('📺 ========================================');
    console.log(`📝 Nome: ${channel.name}`);
    console.log(`🖼️ Logo REAL: ${channel.logo}`);
    console.log(`📡 Stream URL REAL: ${channel.url}`);
    console.log(`📂 Categoria: ${channel.category}`);
    console.log(`🎯 Qualidade: ${channel.quality}`);
    console.log(`📺 Programas: ${channel.programs.join(', ')}`);
    console.log('📺 ========================================');
    console.log('✅ REPRODUZINDO STREAM REAL DO ARQUIVO!');
    console.log('📺 ========================================');
  });

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/90 to-transparent p-6 z-10">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Botão Voltar */}
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-white hover:text-[#E50914] transition-colors group"
            >
              <div className="bg-white/10 p-2 rounded-lg group-hover:bg-[#E50914] transition-colors">
                <ChevronLeft size={24} />
              </div>
              <span className="font-['Montserrat:Semi_Bold',sans-serif] text-[16px]">
                Voltar
              </span>
            </button>

            {/* Logo do Canal */}
            <div className="flex items-center gap-3 ml-6">
              <ImageWithFallback
                src={channel.logo}
                alt={channel.name}
                className="h-12 w-auto object-contain"
              />
              <div>
                <h2 className="text-white font-['Montserrat:Bold',sans-serif] text-[20px]">
                  {channel.name}
                </h2>
                <p className="text-white/60 font-['Montserrat:Medium',sans-serif] text-[12px]">
                  {channel.quality} • Ao Vivo
                </p>
              </div>
            </div>
          </div>

          {/* Botão EPs */}
          {channel.programs.length > 0 && (
            <button
              onClick={() => setShowEpisodes(!showEpisodes)}
              className="flex items-center gap-2 bg-white/10 hover:bg-[#E50914] px-4 py-2 rounded-lg transition-colors text-white"
            >
              <List size={20} />
              <span className="font-['Montserrat:Semi_Bold',sans-serif] text-[14px]">
                Programação
              </span>
            </button>
          )}

          {/* Botão Fechar */}
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-red-600 p-2 rounded-lg transition-colors text-white"
          >
            <X size={24} />
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="w-full h-full flex items-center justify-center p-8">
        <div className="relative w-full max-w-7xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          {/* Tentativa de player de vídeo */}
          <iframe
            src={channel.url}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={channel.name}
          />
          
          {/* Fallback se o iframe não funcionar */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-black pointer-events-none">
            <div className="text-center">
              <ImageWithFallback
                src={channel.logo}
                alt={channel.name}
                className="h-32 w-auto object-contain mx-auto mb-4 opacity-50"
              />
              <p className="text-white/60 font-['Montserrat:Medium',sans-serif] text-[16px]">
                Transmissão ao vivo de {channel.name}
              </p>
              <p className="text-white/40 font-['Montserrat:Regular',sans-serif] text-[14px] mt-2">
                {channel.quality}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Programação */}
      {showEpisodes && channel.programs.length > 0 && (
        <div className="absolute right-8 top-24 bg-[#1a1a1a] border border-[#E50914]/30 rounded-xl p-6 w-96 shadow-2xl z-20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-['Montserrat:Bold',sans-serif] text-[18px]">
              Programação
            </h3>
            <button
              onClick={() => setShowEpisodes(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
            {channel.programs.map((program, index) => (
              <div
                key={index}
                className="bg-white/5 hover:bg-[#E50914]/20 p-3 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-[#E50914]/50"
              >
                <p className="text-white font-['Montserrat:Medium',sans-serif] text-[14px]">
                  {program}
                </p>
                <p className="text-white/40 font-['Montserrat:Regular',sans-serif] text-[12px] mt-1">
                  Disponível
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E50914;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c41a23;
        }
      `}</style>
    </div>
  );
}
