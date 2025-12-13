/**
 * Fast Image Preloader - Sistema Ultra-Rápido de Preload
 * 
 * Carrega imagens diretamente no browser sem proxy/servidor
 * Muito mais rápido que o sistema anterior
 */

interface PreloadOptions {
  priority?: 'high' | 'low';
  type?: 'poster' | 'backdrop' | 'logo';
}

class FastImagePreloader {
  private preloadedUrls = new Set<string>();
  private preloadLinks = new Map<string, HTMLLinkElement>();

  /**
   * Pré-carrega uma única imagem
   */
  preload(url: string, options: PreloadOptions = {}): void {
    if (!url || url.includes('null') || this.preloadedUrls.has(url)) {
      return;
    }

    const { priority = 'low', type = 'poster' } = options;

    // Criar link de preload no <head>
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    link.setAttribute('fetchpriority', priority);
    
    if (type === 'poster') {
      link.setAttribute('imagesrcset', url);
      link.setAttribute('imagesizes', '(max-width: 200px) 200px, (max-width: 400px) 400px, 800px');
    }

    document.head.appendChild(link);

    this.preloadedUrls.add(url);
    this.preloadLinks.set(url, link);

    // Silenciado para não poluir console
    // console.log(`⚡ Preloading ${type} (${priority}): ${url.substring(url.lastIndexOf('/') + 1)}`);
  }

  /**
   * Pré-carrega múltiplas imagens (batch)
   */
  preloadBatch(urls: string[], options: PreloadOptions = {}): void {
    urls.forEach(url => this.preload(url, options));
  }

  /**
   * Pré-carrega usando Image() para forçar download
   */
  preloadWithImage(url: string): Promise<void> {
    if (!url || url.includes('null') || this.preloadedUrls.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        this.preloadedUrls.add(url);
        // Silenciado - sucesso esperado
        // console.log(`✅ Image loaded: ${url.substring(url.lastIndexOf('/') + 1)}`);
        resolve();
      };
      
      img.onerror = () => {
        // Silenciado - o sistema de fallback já cuida disso
        // console.warn(`⚠️ Failed to load: ${url.substring(url.lastIndexOf('/') + 1)}`);
        reject(new Error('Image load failed'));
      };

      img.src = url;
    });
  }

  /**
   * Pré-carrega batch com Image() e concurrency control
   */
  async preloadBatchWithImages(
    urls: string[], 
    concurrency: number = 6
  ): Promise<void> {
    const uniqueUrls = urls.filter(url => url && !url.includes('null') && !this.preloadedUrls.has(url));
    
    if (uniqueUrls.length === 0) return;

    // Silenciado - muito verboso
    // console.log(`🚀 Fast preloading ${uniqueUrls.length} images (concurrency: ${concurrency})...`);

    // Processar em lotes
    for (let i = 0; i < uniqueUrls.length; i += concurrency) {
      const batch = uniqueUrls.slice(i, i + concurrency);
      await Promise.allSettled(batch.map(url => this.preloadWithImage(url)));
    }

    // console.log(`✅ Preload complete: ${uniqueUrls.length} images`);
  }

  /**
   * Limpa preload links do DOM (economia de memória)
   */
  cleanup(): void {
    this.preloadLinks.forEach(link => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    });
    
    this.preloadLinks.clear();
    console.log('🗑️ Preload links cleaned up');
  }

  /**
   * Reseta tudo
   */
  reset(): void {
    this.cleanup();
    this.preloadedUrls.clear();
  }

  /**
   * Estatísticas
   */
  getStats() {
    return {
      preloaded: this.preloadedUrls.size,
      linksInDOM: this.preloadLinks.size
    };
  }
}

// Singleton global
export const fastPreloader = new FastImagePreloader();

/**
 * Pré-carrega primeiras imagens visíveis (crítico para performance)
 */
export function preloadFirstVisible(
  content: Array<{ poster_path?: string; backdrop_path?: string }>,
  count: number = 6
): void {
  const urls: string[] = [];

  // Pegar primeiras imagens
  content.slice(0, count).forEach(item => {
    if (item.backdrop_path) {
      // Para cards horizontais, usar backdrop
      urls.push(`https://image.tmdb.org/t/p/w500${item.backdrop_path}`);
    } else if (item.poster_path) {
      urls.push(`https://image.tmdb.org/t/p/w342${item.poster_path}`);
    }
  });

  if (urls.length > 0) {
    // Silenciado - muito verboso
    // console.log(`🎯 Preloading first ${urls.length} visible images...`);
    fastPreloader.preloadBatchWithImages(urls, 6); // Carrega 6 simultâneas
  }
}

/**
 * Pré-carrega hero banners (prioridade máxima)
 */
export function preloadHeroBanners(
  heroContent: Array<{ backdrop_path?: string }>,
  count: number = 3
): void {
  const urls = heroContent
    .filter(item => item.backdrop_path)
    .slice(0, count)
    .map(item => `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`);

  if (urls.length > 0) {
    // Apenas log se houver erro, não sucesso
    // console.log(`🎬 Preloading ${urls.length} hero banners...`);
    
    // Hero banners: usar link preload com alta prioridade
    urls.forEach((url, index) => {
      fastPreloader.preload(url, { 
        priority: index === 0 ? 'high' : 'low',
        type: 'backdrop'
      });
    });
  }
}

/**
 * Pré-carrega próxima página (para scroll infinito)
 */
export function preloadNextPage(
  content: Array<{ poster_path?: string; backdrop_path?: string }>,
  startIndex: number = 0,
  count: number = 10
): void {
  const urls: string[] = [];

  content.slice(startIndex, startIndex + count).forEach(item => {
    if (item.backdrop_path) {
      urls.push(`https://image.tmdb.org/t/p/w500${item.backdrop_path}`);
    } else if (item.poster_path) {
      urls.push(`https://image.tmdb.org/t/p/w342${item.poster_path}`);
    }
  });

  if (urls.length > 0) {
    // Preload de baixa prioridade (background)
    setTimeout(() => {
      fastPreloader.preloadBatchWithImages(urls, 3); // Mais conservador
    }, 1000);
  }
}

/**
 * Hook React para auto-preload no mount
 */
export function useImagePreload(
  content: Array<{ poster_path?: string; backdrop_path?: string }>,
  options: {
    first?: number;
    heroes?: number;
    enabled?: boolean;
  } = {}
): void {
  const { first = 6, heroes = 0, enabled = true } = options;

  if (!enabled) return;

  // Executar apenas uma vez no mount
  if (typeof window !== 'undefined') {
    // Preload heroes primeiro
    if (heroes > 0) {
      preloadHeroBanners(content, heroes);
    }

    // Depois preload das primeiras visíveis
    if (first > 0) {
      setTimeout(() => {
        preloadFirstVisible(content, first);
      }, 100);
    }
  }
}

// Expor globalmente para debug
if (typeof window !== 'undefined') {
  (window as any).fastPreloader = fastPreloader;
}

export default fastPreloader;
