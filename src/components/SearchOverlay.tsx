import { useState, useEffect } from 'react';

// Inline X icon to avoid lucide-react dependency
const XIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  initialValue?: string;
}

export function SearchOverlay({ isOpen, onClose, onSearch, initialValue = '' }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState(initialValue);

  useEffect(() => {
    setSearchQuery(initialValue);
  }, [initialValue]);

  if (!isOpen) return null;

  const letters = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  const handleKeyPress = (key: string) => {
    setSearchQuery(prev => prev + key);
  };

  const handleBackspace = () => {
    setSearchQuery(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleSpace = () => {
    setSearchQuery(prev => prev + ' ');
  };

  const handleSubmit = () => {
    if (searchQuery.trim()) {
      onSearch(searchQuery);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center justify-center p-4 md:p-8">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 40% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)`
        }} />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 md:top-8 right-4 md:right-8 text-white/70 hover:text-white transition-colors z-10 bg-white/10 hover:bg-white/20 rounded-full p-2 md:p-3"
      >
        <XIcon />
      </button>

      {/* Main content */}
      <div className="relative w-full max-w-4xl">
        {/* Title */}
        <h1 className="text-white text-center font-['Inter:Extra_Bold',sans-serif] text-3xl md:text-5xl lg:text-[56px] mb-6 md:mb-12">
          Buscar
        </h1>

        {/* Search input */}
        <div className="relative mb-6 md:mb-12">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Digite para buscar..."
            autoFocus
            className="w-full bg-[#1e293b]/80 backdrop-blur-sm text-white text-base md:text-xl lg:text-[24px] px-4 md:px-8 py-3 md:py-6 rounded-xl md:rounded-2xl outline-none border-2 border-white/20 focus:border-red-600 transition-all duration-300 placeholder-white/40 font-['Inter:Medium',sans-serif]"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 md:right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
            >
              <XIcon />
            </button>
          )}
        </div>

        {/* Virtual Keyboard */}
        <div className="space-y-2 md:space-y-4">
          {/* Letter rows */}
          {letters.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1 md:gap-3">
              {row.map((letter) => (
                <button
                  key={letter}
                  onClick={() => handleKeyPress(letter)}
                  className="min-w-[32px] md:min-w-[60px] h-[40px] md:h-[60px] bg-white/10 hover:bg-red-600 active:bg-red-700 text-white text-sm md:text-[20px] font-['Inter:Semi_Bold',sans-serif] rounded-lg md:rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-red-600/30 backdrop-blur-sm border border-white/10"
                >
                  {letter}
                </button>
              ))}
            </div>
          ))}

          {/* Space and backspace row */}
          <div className="flex justify-center gap-1 md:gap-3 mt-3 md:mt-6">
            <button
              onClick={handleBackspace}
              className="min-w-[80px] md:min-w-[120px] h-[40px] md:h-[60px] bg-white/10 hover:bg-orange-600 active:bg-orange-700 text-white text-xs md:text-[16px] font-['Inter:Semi_Bold',sans-serif] rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-orange-600/30 backdrop-blur-sm border border-white/10 flex items-center justify-center gap-1 md:gap-2"
            >
              <svg className="w-4 h-4 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
              <span className="hidden sm:inline">Apagar</span>
            </button>
            <button
              onClick={handleSpace}
              className="flex-1 max-w-[200px] md:max-w-[300px] h-[40px] md:h-[60px] bg-white/10 hover:bg-blue-600 active:bg-blue-700 text-white text-xs md:text-[16px] font-['Inter:Semi_Bold',sans-serif] rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-blue-600/30 backdrop-blur-sm border border-white/10"
            >
              Espaço
            </button>
          </div>

          {/* Number row */}
          <div className="flex justify-center gap-1 md:gap-3 mt-2 md:mt-4">
            {numbers.map((num) => (
              <button
                key={num}
                onClick={() => handleKeyPress(num)}
                className="min-w-[32px] md:min-w-[60px] h-[40px] md:h-[60px] bg-white/10 hover:bg-purple-600 active:bg-purple-700 text-white text-sm md:text-[20px] font-['Inter:Semi_Bold',sans-serif] rounded-lg md:rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-purple-600/30 backdrop-blur-sm border border-white/10"
              >
                {num}
              </button>
            ))}
          </div>

          {/* Submit and Back buttons */}
          <div className="flex justify-center gap-3 md:gap-6 mt-4 md:mt-8">
            <button
              onClick={onClose}
              className="px-6 md:px-12 py-3 md:py-4 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-sm md:text-[18px] font-['Inter:Bold',sans-serif] rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 backdrop-blur-sm border border-white/20"
            >
              Voltar
            </button>
            <button
              onClick={handleSubmit}
              disabled={!searchQuery.trim()}
              className="px-6 md:px-12 py-3 md:py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 active:from-red-800 active:to-red-900 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white text-sm md:text-[18px] font-['Inter:Bold',sans-serif] rounded-lg md:rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-red-600/30 disabled:shadow-none"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
