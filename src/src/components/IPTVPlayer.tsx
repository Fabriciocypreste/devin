import React, { useEffect, useRef } from 'react';

// Removido import de hls.js - usando apenas player HTML5 nativo
type IPTVPlayerProps = {
  url?: string;
  streamUrl?: string; // Compatibilidade com código antigo
  poster?: string;
  autoPlay?: boolean;
  title?: string;
  onClose?: () => void;
};

/**
 * 🎬 IPTVPlayer - Compatível com .M3U8, .MP4 e outros formatos de mídia.
 * Usa player HTML5 nativo com suporte HLS nativo em Safari/iOS
 */
export default function IPTVPlayer({ 
  url, 
  streamUrl, 
  poster, 
  autoPlay = true, 
  title,
  onClose 
}: IPTVPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Suporta tanto 'url' quanto 'streamUrl' para compatibilidade
  const videoUrl = url || streamUrl || '';

  useEffect(() => {
    if (!videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    console.log('🎬 Carregando stream:', videoUrl);

    // Safari/iOS e alguns browsers modernos têm suporte nativo HLS
    video.src = videoUrl;
    
    if (autoPlay) {
      video.play().catch(err => {
        console.warn('⚠️ Autoplay bloqueado:', err);
      });
    }
  }, [videoUrl, autoPlay]);

  return (
    <div className="relative flex justify-center items-center w-full h-full bg-black overflow-hidden">
      <video
        ref={videoRef}
        controls
        playsInline
        poster={poster}
        className="w-full h-full max-h-[85vh] object-contain"
        onError={(e) => {
          console.error('❌ Erro ao carregar stream:', videoUrl);
          console.error('Detalhes do erro:', e);
        }}
        onLoadedMetadata={() => {
          console.log('✅ Metadados carregados');
        }}
        onCanPlay={() => {
          console.log('✅ Vídeo pronto para reprodução');
        }}
      />
      
      {/* Título do vídeo */}
      {title && (
        <div className="absolute top-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg text-sm md:text-base font-semibold backdrop-blur-sm">
          📺 {title}
        </div>
      )}
      
      {/* Botão de fechar */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-full hover:bg-[#E50914] transition-colors backdrop-blur-sm font-semibold"
        >
          ✕ Fechar
        </button>
      )}
    </div>
  );
}