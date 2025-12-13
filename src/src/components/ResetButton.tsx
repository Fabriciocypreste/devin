import { useState } from 'react';

/**
 * Botão de Reset de Emergência
 * Aparece no canto inferior direito em qualquer tela
 * Permite resetar para a tela de login a qualquer momento
 */
export function ResetButton() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleReset = () => {
    console.log('🔄 Reset de emergência acionado!');
    
    // Limpar todos os dados
    localStorage.clear();
    sessionStorage.clear();
    
    // Limpar cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirecionar
    window.location.href = '/?reset=true';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg z-[9999] flex items-center justify-center transition-all hover:scale-110"
        title="Mostrar botão de reset"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      </button>
    );
  }

  return (
    <>
      {/* Botão principal */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end gap-2">
        {showConfirm && (
          <div className="bg-black border border-red-600 rounded-lg p-4 shadow-2xl animate-fadeIn mb-2 max-w-xs">
            <p className="text-white text-sm mb-3">
              🔄 Isso vai limpar todos os dados e voltar para o login. Confirma?
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleReset}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                ✅ Sim, Resetar
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsVisible(false)}
            className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
            title="Ocultar botão"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <button
            onClick={() => setShowConfirm(!showConfirm)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
            title="Resetar e voltar para login"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="font-semibold text-sm">Voltar ao Login</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
