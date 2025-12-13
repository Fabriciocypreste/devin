import { useState, useEffect } from 'react';
import { imagePreloader } from '../utils/imagePreloader';

export function ImagePreloadMonitor() {
  const [stats, setStats] = useState({ cached: 0, queued: 0, processing: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(imagePreloader.getStats());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Atalho de teclado para mostrar/esconder (Ctrl+Shift+I)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        setIsVisible(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg shadow-lg text-xs font-mono opacity-30 hover:opacity-100 transition-opacity"
        title="Image Preload Monitor (Ctrl+Shift+I)"
      >
        🖼️ {stats.cached}
      </button>
    );
  }

  const totalProgress = stats.cached + stats.processing;
  const totalItems = totalProgress + stats.queued;
  const percentage = totalItems > 0 ? Math.round((stats.cached / totalItems) * 100) : 100;

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-black/90 backdrop-blur-sm text-white p-4 rounded-lg shadow-2xl border border-white/10 font-mono text-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm">🖼️ Image Preloader</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-white/60 hover:text-white transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-white/60 mb-1">
            <span>Progress</span>
            <span>{percentage}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-green-500/20 border border-green-500/30 rounded p-2 text-center">
            <div className="text-green-400 text-lg font-bold">{stats.cached}</div>
            <div className="text-white/60 text-[10px]">Cached</div>
          </div>
          
          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded p-2 text-center">
            <div className="text-yellow-400 text-lg font-bold">{stats.processing}</div>
            <div className="text-white/60 text-[10px]">Loading</div>
          </div>
          
          <div className="bg-blue-500/20 border border-blue-500/30 rounded p-2 text-center">
            <div className="text-blue-400 text-lg font-bold">{stats.queued}</div>
            <div className="text-white/60 text-[10px]">Queued</div>
          </div>
        </div>

        {/* Status */}
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${stats.processing > 0 ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
            <span className="text-white/60 text-[10px]">
              {stats.processing > 0 ? 'Preloading images...' : 'Idle'}
            </span>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-2 pt-2 border-t border-white/10 text-white/40 text-[10px]">
          Press <kbd className="bg-white/10 px-1 rounded">Ctrl+Shift+I</kbd> to toggle
        </div>
      </div>
    </div>
  );
}
