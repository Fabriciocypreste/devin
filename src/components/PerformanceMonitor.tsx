import { useEffect, useState } from 'react';

// Icons inline to avoid lucide-react dependency
const Zap = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const ImageIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="8.5" cy="8.5" r="1.5"></circle>
    <polyline points="21 15 16 10 5 21"></polyline>
  </svg>
);

const Clock = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const TrendingUp = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const X = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  totalImages: number;
  cachedImages: number;
  loadedImages: number;
  averageImageSize: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    totalImages: 0,
    cachedImages: 0,
    loadedImages: 0,
    averageImageSize: 0
  });
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Só mostrar em desenvolvimento ou se habilitado
    const showMonitor = localStorage.getItem('redflix-show-performance') === 'true';
    setIsVisible(showMonitor);

    if (!showMonitor) return;

    // Performance Observer para Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP Observer
      try {
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          setMetrics(prev => ({ ...prev, lcp: lastEntry.renderTime || lastEntry.loadTime }));
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('LCP observer not supported');
      }

      // FID Observer
      try {
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            setMetrics(prev => ({ ...prev, fid: entry.processingStart - entry.startTime }));
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (e) {
        console.warn('FID observer not supported');
      }

      // CLS Observer
      try {
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
              setMetrics(prev => ({ ...prev, cls: clsValue }));
            }
          }
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('CLS observer not supported');
      }

      // Navigation Timing
      try {
        const navTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navTiming) {
          setMetrics(prev => ({
            ...prev,
            fcp: navTiming.domContentLoadedEventEnd - navTiming.fetchStart,
            ttfb: navTiming.responseStart - navTiming.requestStart
          }));
        }
      } catch (e) {
        console.warn('Navigation timing not available');
      }
    }

    // Monitorar imagens
    const updateImageMetrics = () => {
      const images = document.querySelectorAll('img');
      let totalSize = 0;
      let loadedCount = 0;

      images.forEach(img => {
        if (img.complete) {
          loadedCount++;
          // Estimar tamanho (aproximado)
          if (img.naturalWidth && img.naturalHeight) {
            totalSize += img.naturalWidth * img.naturalHeight * 0.001; // KB aproximado
          }
        }
      });

      setMetrics(prev => ({
        ...prev,
        totalImages: images.length,
        loadedImages: loadedCount,
        averageImageSize: totalSize / (loadedCount || 1)
      }));
    };

    // Atualizar métricas de imagens periodicamente
    const imageInterval = setInterval(updateImageMetrics, 2000);

    return () => {
      clearInterval(imageInterval);
    };
  }, []);

  if (!isVisible) return null;

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return '#4DAF6E'; // Verde
    if (value <= thresholds[1]) return '#FFA500'; // Laranja
    return '#E73D1C'; // Vermelho
  };

  const lcpColor = getScoreColor(metrics.lcp, [2500, 4000]);
  const fidColor = getScoreColor(metrics.fid, [100, 300]);
  const clsColor = getScoreColor(metrics.cls, [0.1, 0.25]);

  const imageLoadProgress = (metrics.loadedImages / metrics.totalImages) * 100 || 0;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in">
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#E50914] to-[#C41A23] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-white" />
            <h3 className="text-white text-sm">
              Performance Monitor
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <TrendingUp className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                localStorage.removeItem('redflix-show-performance');
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="p-4 space-y-3">
          {/* Web Vitals */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: lcpColor }}
                />
                <p className="text-white/60 text-xs">LCP</p>
              </div>
              <p className="text-white text-lg">
                {(metrics.lcp / 1000).toFixed(2)}s
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: fidColor }}
                />
                <p className="text-white/60 text-xs">FID</p>
              </div>
              <p className="text-white text-lg">
                {metrics.fid.toFixed(0)}ms
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: clsColor }}
                />
                <p className="text-white/60 text-xs">CLS</p>
              </div>
              <p className="text-white text-lg">
                {metrics.cls.toFixed(3)}
              </p>
            </div>
          </div>

          {/* Image Loading */}
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#E50914]" />
                <p className="text-white text-sm">
                  Imagens
                </p>
              </div>
              <p className="text-white/60 text-xs">
                {metrics.loadedImages}/{metrics.totalImages}
              </p>
            </div>
            
            {/* Progress Bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E50914] to-[#F40612] transition-all duration-500"
                style={{ width: `${imageLoadProgress}%` }}
              />
            </div>

            {imageLoadProgress === 100 && (
              <p className="text-green-400 text-xs mt-1">
                ✓ Todas as imagens carregadas
              </p>
            )}
          </div>

          {/* Details */}
          {showDetails && (
            <div className="space-y-2 pt-2 border-t border-white/10 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs">FCP:</p>
                <p className="text-white text-xs">
                  {(metrics.fcp / 1000).toFixed(2)}s
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs">TTFB:</p>
                <p className="text-white text-xs">
                  {metrics.ttfb.toFixed(0)}ms
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-white/60 text-xs">Img Avg:</p>
                <p className="text-white text-xs">
                  {metrics.averageImageSize.toFixed(0)} KB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-[#E50914]/10 border-t border-[#E50914]/20 px-4 py-2">
          <p className="text-white/70 text-xs">
            {metrics.lcp > 2500 && '⚠️ LCP alto - otimize imagens principais'}
            {metrics.lcp <= 2500 && metrics.fid > 100 && '⚠️ FID alto - reduza JavaScript'}
            {metrics.lcp <= 2500 && metrics.fid <= 100 && metrics.cls > 0.1 && '⚠️ CLS alto - reserve espaço para imagens'}
            {metrics.lcp <= 2500 && metrics.fid <= 100 && metrics.cls <= 0.1 && '✓ Performance excelente!'}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Ativar o monitor de performance
 * Usar no console: enablePerformanceMonitor()
 */
export function enablePerformanceMonitor() {
  localStorage.setItem('redflix-show-performance', 'true');
  window.location.reload();
}

/**
 * Desativar o monitor de performance
 */
export function disablePerformanceMonitor() {
  localStorage.removeItem('redflix-show-performance');
  window.location.reload();
}

// Expor funções globalmente
if (typeof window !== 'undefined') {
  (window as any).enablePerformanceMonitor = enablePerformanceMonitor;
  (window as any).disablePerformanceMonitor = disablePerformanceMonitor;
}
