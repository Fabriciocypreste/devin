/**
 * Sistema de Preload Dinâmico de Recursos Críticos
 * 
 * Adiciona <link rel="preload"> dinamicamente no <head>
 * para recursos críticos identificados em runtime
 */

interface PreloadOptions {
  as: 'image' | 'script' | 'style' | 'font' | 'fetch' | 'document';
  type?: string;
  crossorigin?: 'anonymous' | 'use-credentials';
  fetchpriority?: 'high' | 'low' | 'auto';
}

class ResourcePreloader {
  private preloadedUrls = new Set<string>();

  /**
   * Adiciona preload de recurso no head
   */
  preload(href: string, options: PreloadOptions) {
    // Evitar duplicatas
    if (this.preloadedUrls.has(href)) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = options.as;

    if (options.type) {
      link.type = options.type;
    }

    if (options.crossorigin) {
      link.crossOrigin = options.crossorigin;
    }

    if (options.fetchpriority) {
      link.setAttribute('fetchpriority', options.fetchpriority);
    }

    document.head.appendChild(link);
    this.preloadedUrls.add(href);

    console.log(`🔗 Preloaded: ${href.substring(href.lastIndexOf('/') + 1)}`);
  }

  /**
   * Preload de imagem hero
   */
  preloadHeroImage(imageUrl: string, priority: 'high' | 'low' = 'high') {
    if (!imageUrl || imageUrl.includes('null')) return;

    this.preload(imageUrl, {
      as: 'image',
      fetchpriority: priority,
      crossorigin: 'anonymous',
    });
  }

  /**
   * Preload de múltiplas imagens
   */
  preloadImages(urls: string[], priority: 'high' | 'low' = 'low') {
    urls.forEach(url => {
      if (url && !url.includes('null')) {
        this.preload(url, {
          as: 'image',
          fetchpriority: priority,
          crossorigin: 'anonymous',
        });
      }
    });
  }

  /**
   * Prefetch de rota (para navegação futura)
   */
  prefetchRoute(route: string) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';
    document.head.appendChild(link);

    console.log(`🔮 Prefetched route: ${route}`);
  }

  /**
   * Prefetch de múltiplas rotas
   */
  prefetchRoutes(routes: string[]) {
    routes.forEach(route => this.prefetchRoute(route));
  }

  /**
   * DNS Prefetch para domínios externos
   */
  dnsPrefetch(domain: string) {
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    document.head.appendChild(link);

    console.log(`🌐 DNS Prefetch: ${domain}`);
  }

  /**
   * Preconnect para recursos críticos externos
   */
  preconnect(url: string, crossorigin = false) {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    if (crossorigin) {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);

    console.log(`🔌 Preconnected: ${url}`);
  }

  /**
   * Limpar todos os preloads
   */
  clearPreloads() {
    const preloadLinks = document.querySelectorAll('link[rel="preload"]');
    preloadLinks.forEach(link => {
      if (!link.hasAttribute('data-vite-preload')) {
        // Não remover preloads do Vite
        link.remove();
      }
    });
    this.preloadedUrls.clear();
    console.log('🗑️ Preloads cleared');
  }

  /**
   * Estatísticas
   */
  getStats() {
    return {
      preloaded: this.preloadedUrls.size,
      urls: Array.from(this.preloadedUrls),
    };
  }
}

// Singleton
export const resourcePreloader = new ResourcePreloader();

/**
 * Hook para preload de hero content
 */
export function preloadHeroContent(heroItems: Array<{ backdrop_path?: string; poster_path?: string }>) {
  if (!heroItems || heroItems.length === 0) return;

  // Preload das primeiras 3 imagens hero
  const heroImages = heroItems
    .slice(0, 3)
    .map(item => item.backdrop_path || item.poster_path)
    .filter(Boolean)
    .map(path => `https://image.tmdb.org/t/p/w1280${path}`);

  if (heroImages.length > 0) {
    // Primeira imagem: alta prioridade
    resourcePreloader.preloadHeroImage(heroImages[0], 'high');

    // Restante: baixa prioridade
    if (heroImages.length > 1) {
      resourcePreloader.preloadImages(heroImages.slice(1), 'low');
    }

    console.log(`🎬 Preloaded ${heroImages.length} hero images`);
  }
}

/**
 * Preload de recursos críticos na inicialização
 */
export function preloadCriticalResources() {
  // Preconnect para APIs críticas
  resourcePreloader.preconnect('https://image.tmdb.org', true);
  
  // DNS Prefetch para recursos secundários
  resourcePreloader.dnsPrefetch('https://api.themoviedb.org');
  resourcePreloader.dnsPrefetch('https://api.cdnapp.fun');
  
  console.log('✅ Critical resources preloaded');
}

/**
 * Prefetch de rotas para navegação antecipada
 */
export function prefetchMainRoutes() {
  const mainRoutes = [
    '/kids',
    '/top10',
    '/channels',
    '/movies',
    '/series',
    '/originals',
  ];

  // Aguardar 2s após carregamento inicial
  setTimeout(() => {
    resourcePreloader.prefetchRoutes(mainRoutes);
    console.log('🔮 Main routes prefetched');
  }, 2000);
}

/**
 * Cache Control Headers para CDN
 * (Para uso em servidor ou configuração de CDN)
 */
export const cacheControlHeaders = {
  // Imagens (1 ano)
  images: 'public, max-age=31536000, immutable',
  
  // JavaScript/CSS (1 ano com hash)
  assets: 'public, max-age=31536000, immutable',
  
  // HTML (sem cache, sempre revalidar)
  html: 'no-cache, must-revalidate',
  
  // API responses (5 minutos)
  api: 'public, max-age=300, stale-while-revalidate=60',
  
  // Fontes (1 ano)
  fonts: 'public, max-age=31536000, immutable',
};

/**
 * Verificar se recursos estão cacheados
 */
export async function checkResourceCache(url: string): Promise<boolean> {
  if ('caches' in window) {
    try {
      const cache = await caches.open('redflix-v1');
      const response = await cache.match(url);
      return !!response;
    } catch (error) {
      return false;
    }
  }
  return false;
}

/**
 * Adicionar recurso ao cache manualmente
 */
export async function addToCache(url: string) {
  if ('caches' in window) {
    try {
      const cache = await caches.open('redflix-v1');
      await cache.add(url);
      console.log(`💾 Cached: ${url}`);
    } catch (error) {
      console.error(`❌ Failed to cache: ${url}`, error);
    }
  }
}

/**
 * Performance hints para diferentes tipos de conteúdo
 */
export const performanceHints = {
  // Hero images - alta prioridade
  hero: {
    preload: true,
    fetchpriority: 'high' as const,
    loading: 'eager' as const,
  },
  
  // Primeira linha - prioridade média
  firstRow: {
    preload: true,
    fetchpriority: 'auto' as const,
    loading: 'eager' as const,
  },
  
  // Resto - lazy loading
  rest: {
    preload: false,
    fetchpriority: 'auto' as const,
    loading: 'lazy' as const,
  },
};
