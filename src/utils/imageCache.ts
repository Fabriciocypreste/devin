/**
 * Sistema de Cache de Imagens para RedFlix
 * 
 * Gerencia cache de imagens usando:
 * - Service Worker Cache API
 * - LocalStorage para metadados
 * - IndexedDB para imagens grandes
 */

interface CacheMetadata {
  url: string;
  cachedAt: number;
  size: number;
  format: string;
}

class ImageCacheManager {
  private cacheName = 'redflix-images-v1';
  private maxAge = 7 * 24 * 60 * 60 * 1000; // 7 dias em ms
  private metadataKey = 'redflix-image-metadata';

  /**
   * Pré-carrega imagens críticas para cache
   */
  async preloadCriticalImages(urls: string[]): Promise<void> {
    if (!('caches' in window) || urls.length === 0) return;

    try {
      const cache = await caches.open(this.cacheName);
      let successCount = 0;
      
      const preloadPromises = urls.map(async url => {
        try {
          // Verificar se é HTTPS ou data URI
          if (!url.startsWith('https://') && !url.startsWith('data:')) {
            console.warn(`⚠️ Skipping non-HTTPS URL: ${url}`);
            return;
          }
          
          await cache.add(url);
          successCount++;
        } catch (err) {
          // Silenciosamente ignorar erros individuais (CORS, 404, etc)
          console.debug(`Could not preload: ${url}`);
        }
      });
      
      await Promise.all(preloadPromises);
      
      if (successCount > 0) {
        console.log(`✅ Preloaded ${successCount}/${urls.length} critical images`);
      }
    } catch (error) {
      // Silenciosamente ignorar erros de cache
      console.debug('Image preloading not available');
    }
  }

  /**
   * Adiciona imagem ao cache
   */
  async cacheImage(url: string, response: Response): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      await cache.put(url, response.clone());

      // Salvar metadata
      this.saveMetadata(url, response);
    } catch (error) {
      // Silenciosamente ignorar erros de cache
      // Cache é uma otimização, não deve quebrar a funcionalidade
    }
  }

  /**
   * Busca imagem do cache
   */
  async getCachedImage(url: string): Promise<Response | undefined> {
    if (!('caches' in window)) return undefined;

    try {
      const cache = await caches.open(this.cacheName);
      const cached = await cache.match(url);

      if (cached) {
        // Verificar se não expirou
        const metadata = this.getMetadata(url);
        if (metadata && (Date.now() - metadata.cachedAt) < this.maxAge) {
          return cached;
        } else {
          // Cache expirado, remover silenciosamente
          cache.delete(url).catch(() => {});
          this.removeMetadata(url);
        }
      }
    } catch (error) {
      // Silenciosamente ignorar erros de leitura de cache
    }

    return undefined;
  }

  /**
   * Limpa cache de imagens antigas
   */
  async cleanOldCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      const cache = await caches.open(this.cacheName);
      const requests = await cache.keys();
      const now = Date.now();

      const deletePromises = requests.map(async (request) => {
        try {
          const metadata = this.getMetadata(request.url);
          if (metadata && (now - metadata.cachedAt) > this.maxAge) {
            await cache.delete(request);
            this.removeMetadata(request.url);
          }
        } catch {
          // Ignorar erros individuais
        }
      });

      await Promise.all(deletePromises);
    } catch (error) {
      // Silenciosamente ignorar erros de limpeza
    }
  }

  /**
   * Calcula tamanho total do cache
   */
  async getCacheSize(): Promise<number> {
    if (!('caches' in window)) return 0;

    try {
      const cache = await caches.open(this.cacheName);
      const requests = await cache.keys();
      let totalSize = 0;

      for (const request of requests) {
        try {
          const metadata = this.getMetadata(request.url);
          if (metadata) {
            totalSize += metadata.size;
          }
        } catch {
          // Ignorar erros individuais
        }
      }

      return totalSize;
    } catch (error) {
      // Silenciosamente retornar 0 em caso de erro
      return 0;
    }
  }

  /**
   * Salva metadata da imagem no localStorage
   */
  private saveMetadata(url: string, response: Response): void {
    try {
      const metadata = this.getAllMetadata();
      const contentLength = response.headers.get('content-length');
      const contentType = response.headers.get('content-type');

      metadata[url] = {
        url,
        cachedAt: Date.now(),
        size: contentLength ? parseInt(contentLength) : 0,
        format: contentType || 'unknown'
      };

      localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
    } catch (error) {
      // LocalStorage pode estar cheio, ignorar
    }
  }

  /**
   * Busca metadata de uma imagem
   */
  private getMetadata(url: string): CacheMetadata | null {
    try {
      const metadata = this.getAllMetadata();
      return metadata[url] || null;
    } catch {
      return null;
    }
  }

  /**
   * Remove metadata de uma imagem
   */
  private removeMetadata(url: string): void {
    try {
      const metadata = this.getAllMetadata();
      delete metadata[url];
      localStorage.setItem(this.metadataKey, JSON.stringify(metadata));
    } catch {
      // Ignorar erros
    }
  }

  /**
   * Busca todos os metadados
   */
  private getAllMetadata(): Record<string, CacheMetadata> {
    try {
      const stored = localStorage.getItem(this.metadataKey);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  /**
   * Limpa todo o cache
   */
  async clearAllCache(): Promise<void> {
    if (!('caches' in window)) return;

    try {
      await caches.delete(this.cacheName);
      localStorage.removeItem(this.metadataKey);
      console.log('✅ All cache cleared');
    } catch (error) {
      // Silenciosamente ignorar erros
    }
  }
}

// Singleton instance
export const imageCache = new ImageCacheManager();

/**
 * Hook React para usar o cache de imagens
 */
export function useImageCache() {
  return {
    preloadImages: (urls: string[]) => imageCache.preloadCriticalImages(urls),
    getCacheSize: () => imageCache.getCacheSize(),
    cleanCache: () => imageCache.cleanOldCache(),
    clearCache: () => imageCache.clearAllCache()
  };
}

/**
 * Fetch otimizado com cache
 */
export async function fetchImageWithCache(url: string): Promise<Response> {
  // Validar URL
  if (!url || (!url.startsWith('https://') && !url.startsWith('data:'))) {
    throw new Error(`Invalid URL for caching: ${url}`);
  }

  // Tentar buscar do cache primeiro
  try {
    const cached = await imageCache.getCachedImage(url);
    if (cached) {
      return cached;
    }
  } catch (error) {
    // Cache falhou, continuar com fetch
    console.debug('Cache read failed, fetching fresh');
  }

  // Se não estiver em cache, fazer fetch
  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
      },
      mode: 'cors',
      cache: 'default'
    });

    if (response.ok) {
      // Adicionar ao cache (silenciosamente ignorar erros)
      imageCache.cacheImage(url, response).catch(() => {
        // Falha de cache não deve afetar o carregamento
      });
    }

    return response;
  } catch (error) {
    console.debug('Error fetching image:', url);
    throw error;
  }
}

/**
 * Pré-carrega imagens críticas ao iniciar a aplicação
 */
export function initializeImageCache() {
  // Imagens críticas para pré-carregar
  const criticalImages: string[] = [
    // Adicione imagens críticas aqui se necessário
    // Nota: URLs HTTP sem CORS podem falhar no cache
  ];

  // Limpar cache antigo periodicamente
  imageCache.cleanOldCache().catch(() => {
    // Ignorar erros de limpeza
  });

  // Pré-carregar imagens críticas apenas se houver
  if (criticalImages.length > 0) {
    imageCache.preloadCriticalImages(criticalImages).catch(() => {
      // Ignorar erros de pré-carregamento
    });
  }

  // Monitorar tamanho do cache
  imageCache.getCacheSize().then(size => {
    const sizeMB = (size / 1024 / 1024).toFixed(2);
    console.log(`📦 Image cache size: ${sizeMB} MB`);
  }).catch(() => {
    // Ignorar erros de medição
  });
}
