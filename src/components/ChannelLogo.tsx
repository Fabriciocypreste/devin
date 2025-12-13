import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Movie } from '../types';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { convertUrl } from '../utils/url';

declare const Hls: any;

interface ChannelPlayerProps {
  channel: Movie;
  onClose: () => void;
}

const ChannelPlayer: React.FC<ChannelPlayerProps> = ({ channel, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsInstanceRef = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadChannel = useCallback(() => {
    const video = videoRef.current;
    if (!video || !channel) return;

    if (hlsInstanceRef.current) {
      hlsInstanceRef.current.destroy();
    }
    
    setIsLoading(true);
    setError(null);
    
    const sourceStreamUrl = channel.streamUrl;

    if (!sourceStreamUrl || !sourceStreamUrl.toLowerCase().includes('.m3u8')) {
        setError("Formato de stream inválido. Este player suporta apenas M3U8.");
        setIsLoading(false);
        return;
    }
    
    // CORREÇÃO: Usa a função `convertUrl` que aponta para o proxy de produção.
    const streamUrl = convertUrl(sourceStreamUrl);

    if (Hls.isSupported()) {
      // CORREÇÃO: Aplica a configuração otimizada do HLS.js.
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90,
      });
      hlsInstanceRef.current = hls;

      // CORREÇÃO: Adiciona um tratador de erros robusto para evitar o '[object Object]'.
      hls.on(Hls.Events.ERROR, (event: any, data: any) => {
        try {
            console.error('HLS Error:', data);
            
            let detailsString = 'Detalhes indisponíveis';
            if (data) {
                const details = [];
                if (data.type) details.push(`Tipo: ${data.type}`);
                if (data.details) details.push(`Detalhes: ${data.details}`);
                if (data.reason) details.push(`Motivo: ${data.reason}`);
                if (data.response && data.response.code) {
                    details.push(`Código de rede: ${data.response.code}`);
                }
                if (data.url) details.push(`URL: ${data.url.substring(0, 100)}...`);
                
                if (details.length > 0) {
                    detailsString = details.join('; ');
                } else {
                    detailsString = JSON.stringify(data);
                }
            }

            if (data && data.fatal) {
                let userMessage = '';
                const errorDetails = `(Detalhes: ${detailsString})`;
                switch (data.type) {
                    case Hls.ErrorTypes.NETWORK_ERROR:
                        userMessage = `Erro de rede ao carregar o stream (manifestLoadError). Verifique sua conexão. O conteúdo pode estar offline ou bloqueado. ${errorDetails}`;
                        if (hlsInstanceRef.current) { hlsInstanceRef.current.startLoad(); }
                        break;
                    case Hls.ErrorTypes.MEDIA_ERROR:
                        userMessage = `Erro de mídia. O stream pode estar corrompido ou em um formato incompatível. ${errorDetails}`;
                        if (hlsInstanceRef.current) { hlsInstanceRef.current.recoverMediaError(); }
                        break;
                    default:
                        userMessage = `Ocorreu um erro fatal e a reprodução não pode continuar. ${errorDetails}`;
                        if (hlsInstanceRef.current) { hlsInstanceRef.current.destroy(); hlsInstanceRef.current = null; }
                        break;
                }
                setError(userMessage);
            } else {
                console.warn(`HLS.js non-fatal error: ${detailsString}`);
            }
        } catch (e) {
            console.error('Error within HLS error handler:', e);
            setError('Ocorreu um erro inesperado ao processar um erro de reprodução.');
        }
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => {});
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('error', () => {
        setError('Não foi possível carregar o vídeo. O formato pode não ser suportado ou o link pode estar quebrado.');
        setIsLoading(false);
      });
      video.play().catch(() => {});
    } else {
      setError("Seu navegador não suporta a reprodução de HLS.");
      setIsLoading(false);
    }
  }, [channel]);
  
  useEffect(() => {
    const video = videoRef.current;
    if(!video) return;

    loadChannel();
    
    const handleCanPlay = () => setIsLoading(false);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      if (hlsInstanceRef.current) {
        hlsInstanceRef.current.destroy();
        hlsInstanceRef.current = null;
      }
    };
  }, [channel, loadChannel]);


  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative w-full max-w-4xl aspect-video bg-black shadow-2xl rounded-lg" onClick={e => e.stopPropagation()}>
        <video ref={videoRef} className="w-full h-full" controls autoPlay playsInline />

        {isLoading && !error && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-16 h-16 border-4 border-brand-red border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        {error && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 text-white text-center p-4 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-brand-red mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-xl font-bold mb-2">Erro na Reprodução</h2>
                <p className="max-w-md mb-6">{error}</p>
                 <button 
                    onClick={loadChannel}
                    className="px-6 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition-colors mb-2"
                >
                    Tentar Novamente
                </button>
                 <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-brand-red text-white font-semibold rounded-md hover:bg-red-700 transition-colors"
                >
                    Fechar
                </button>
            </div>
        )}

        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
          <h1 className="text-white text-xl font-semibold">{channel.title}</h1>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 z-50 text-white bg-black/50 p-2 rounded-full hover:bg-white/20 transition-colors" aria-label="Fechar">
            <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ChannelPlayer;
