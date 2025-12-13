// RedFlix - GloboEsporte Embed Viewer
import React, { useState } from 'react';
import { 
  XIcon as X, 
  ArrowLeftIcon as ArrowLeft, 
  ExternalLinkIcon as ExternalLink, 
  AlertCircleIcon as AlertCircle, 
  Maximize2Icon as Maximize2, 
  Minimize2Icon as Minimize2 
} from './Icons';

interface NewsReaderProps {
  newsUrl: string;
  onClose: () => void;
}

export function NewsReader({ newsUrl, onClose }: NewsReaderProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  const handleIframeError = () => {
    setIframeError(true);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const openInNewTab = () => {
    window.open(newsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Header - Sticky */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-green-900/90 to-green-800/90 backdrop-blur-md border-b border-green-600/30 shadow-xl">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Left: Back Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 backdrop-blur-sm hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline font-semibold">Voltar</span>
          </button>

          {/* Center: Logo */}
          <div className="flex items-center gap-3 flex-1 justify-center">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
              <span className="font-black text-green-600 text-xl">ge</span>
            </div>
            <div className="hidden md:block">
              <div className="font-black text-white text-xl">GloboEsporte</div>
              <div className="text-green-300 text-xs">Notícias em Tempo Real</div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 rounded-lg transition-all duration-200 backdrop-blur-sm hover:scale-105"
              title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
              <span className="hidden lg:inline text-sm font-semibold">
                {isFullscreen ? "Normal" : "Expandir"}
              </span>
            </button>

            <button
              onClick={openInNewTab}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 font-semibold shadow-lg hover:shadow-green-600/50 hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Abrir no GE</span>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className={`h-[calc(100vh-64px)] ${isFullscreen ? 'p-0' : 'p-4'} bg-gradient-to-br from-gray-900 to-black`}>
        {iframeError ? (
          /* Error State */
          <div className="h-full flex items-center justify-center">
            <div className="max-w-2xl mx-auto text-center p-8">
              <div className="w-20 h-20 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-red-600">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              
              <h2 className="text-3xl font-bold text-white mb-4">
                Não foi possível carregar
              </h2>
              
              <p className="text-gray-400 text-lg mb-8">
                O GloboEsporte pode estar bloqueando a visualização em iframe.
                Clique no botão abaixo para abrir em uma nova aba.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => {
                    setIframeError(false);
                    window.location.reload();
                  }}
                  className="px-6 py-3 bg-[#e50914] hover:bg-[#f40612] text-white rounded-lg transition-all font-semibold hover:scale-105"
                >
                  Tentar Novamente
                </button>
                
                <button
                  onClick={openInNewTab}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all font-semibold inline-flex items-center justify-center gap-2 hover:scale-105"
                >
                  <ExternalLink className="w-5 h-5" />
                  Abrir no GloboEsporte
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Iframe Container */
          <div className={`h-full ${isFullscreen ? 'rounded-none' : 'rounded-xl'} overflow-hidden shadow-2xl border border-green-600/30 bg-white`}>
            {/* Loading Overlay */}
            <div className="relative w-full h-full">
              {/* Iframe */}
              <iframe
                src={newsUrl}
                className="w-full h-full border-0"
                title="GloboEsporte"
                onError={handleIframeError}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-presentation"
              />

              {/* Info Badge */}
              {!isFullscreen && (
                <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-lg border border-white/20">
                  <div className="flex items-center gap-2 text-xs text-gray-300">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Conteúdo carregado do GloboEsporte</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Tip */}
      {!isFullscreen && !iframeError && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none p-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400 text-sm">
              💡 <span className="text-green-400 font-semibold">Dica:</span> Clique em "Expandir" para visualização em tela cheia
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
