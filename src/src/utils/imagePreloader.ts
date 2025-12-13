import { projectId, publicAnonKey } from './supabase/info';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;

interface PreloadQueueItem {
  url: string;
  priority: 'high' | 'medium' | 'low';
  type: 'poster' | 'backdrop' | 'logo';
}

class ImagePreloader {
  private queue: PreloadQueueItem[] = [];
  private processing = false;
  private cache = new Map<string, Promise<string>>();
  private maxConcurrent = 3;
  private currentlyProcessing = 0;

  /**
   * Adiciona imagem à fila de pré-carregamento
   */
  add(url: string, priority: 'high' | 'medium' | 'low' = 'medium', type: 'poster' | 'backdrop' | 'logo' = 'poster') {
    if (!url || url.includes('null')) return;
    
    // Evitar duplicatas na fila
    const exists = this.queue.some(item => item.url === url);
    if (exists || this.cache.has(url)) return;

    this.queue.push({ url, priority, type });
    
    // Processar imediatamente se for alta prioridade
    if (priority === 'high' && !this.processing) {
      this.processQueue();
    }
  }

  /**
   * Adiciona múltiplas imagens de uma vez
   */
  addBatch(urls: string[], priority: 'high' | 'medium' | 'low' = 'medium', type: 'poster' | 'backdrop' | 'logo' = 'poster') {
    urls.forEach(url => this.add(url, priority, type));
    if (priority === 'high') {
      this.processQueue();
    }
  }

  /**
   * Processa a fila de imagens
   */
  private async processQueue() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    console.log(`🚀 Starting image preload queue (${this.queue.length} items)`);

    // Ordenar por prioridade
    this.queue.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Processar em lotes
    while (this.queue.length > 0 && this.currentlyProcessing < this.maxConcurrent) {
      const item = this.queue.shift();
      if (!item) break;

      this.currentlyProcessing++;
      this.preloadImage(item).finally(() => {
        this.currentlyProcessing--;
        
        // Continuar processando se ainda houver itens na fila
        if (this.queue.length > 0) {
          setTimeout(() => this.processQueue(), 100);
        } else {
          this.processing = false;
        }
      });
    }
  }

  /**
   * Pré-carrega uma imagem única via servidor
   */
  private async preloadImage(item: PreloadQueueItem): Promise<string> {
    const { url, type } = item;

    // Verificar se já está em cache
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    const promise = (async () => {
      try {
        // Silenciado para não poluir console
        // console.log(`📥 Preloading ${type}: ${url.substring(url.lastIndexOf('/') + 1)}`);

        // Usar o proxy do servidor que já faz cache no Supabase Storage
        const response = await fetch(`${SERVER_URL}/image-proxy?url=${encodeURIComponent(url)}`, {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to preload image: ${response.status}`);
        }

        const data = await response.json();
        console.log(`✅ Preloaded ${type}: ${url.substring(url.lastIndexOf('/') + 1)}`);
        
        return data.url || url;
      } catch (error) {
        // Silenciado - o sistema de fallback já cuida disso
        // console.error(`❌ Error preloading image:`, error);
        return url; // Fallback para URL original
      }
    })();

    this.cache.set(url, promise);
    return promise;
  }

  /**
   * Obtém URL otimizada (do cache se disponível)
   */
  async getOptimizedUrl(url: string): Promise<string> {
    if (!url || url.includes('null')) return '';
    
    // Se já temos em cache, retornar
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    // Se não está em cache, adicionar à fila com prioridade alta
    this.add(url, 'high');
    this.processQueue();
    
    return url; // Retornar URL original enquanto processa
  }

  /**
   * Limpa o cache (útil para economizar memória)
   */
  clearCache() {
    this.cache.clear();
    this.queue = [];
    console.log('🗑️ Image preloader cache cleared');
  }

  /**
   * Estatísticas
   */
  getStats() {
    return {
      cached: this.cache.size,
      queued: this.queue.length,
      processing: this.currentlyProcessing
    };
  }
}

// Singleton
export const imagePreloader = new ImagePreloader();

/**
 * Hook para pré-carregar imagens de uma lista de filmes/séries
 */
export function preloadContentImages(
  content: Array<{ poster_path?: string; backdrop_path?: string }>,
  options: {
    posters?: boolean;
    backdrops?: boolean;
    priority?: 'high' | 'medium' | 'low';
  } = {}
) {
  const { posters = true, backdrops = false, priority = 'medium' } = options;

  const posterUrls: string[] = [];
  const backdropUrls: string[] = [];

  content.forEach(item => {
    if (posters && item.poster_path) {
      posterUrls.push(`https://image.tmdb.org/t/p/w342${item.poster_path}`);
    }
    if (backdrops && item.backdrop_path) {
      backdropUrls.push(`https://image.tmdb.org/t/p/w1280${item.backdrop_path}`);
    }
  });

  if (posterUrls.length > 0) {
    imagePreloader.addBatch(posterUrls, priority, 'poster');
  }

  if (backdropUrls.length > 0) {
    imagePreloader.addBatch(backdropUrls, priority, 'backdrop');
  }

  // Silenciado para não poluir console
  // console.log(`📦 Queued ${posterUrls.length} posters and ${backdropUrls.length} backdrops for preloading`);
}

/**
 * Pré-carrega imagens críticas (hero, primeira linha, etc)
 */
export function preloadCriticalImages(
  heroContent: Array<{ backdrop_path?: string; poster_path?: string }>,
  firstRowContent: Array<{ poster_path?: string }>
) {
  // Hero backdrops com prioridade máxima
  if (heroContent.length > 0) {
    const heroUrls = heroContent
      .filter(item => item.backdrop_path)
      .map(item => `https://image.tmdb.org/t/p/w1280${item.backdrop_path}`);
    
    imagePreloader.addBatch(heroUrls, 'high', 'backdrop');
  }

  // Primeira linha de conteúdo com alta prioridade
  if (firstRowContent.length > 0) {
    const firstRowUrls = firstRowContent
      .filter(item => item.poster_path)
      .slice(0, 10) // Apenas os primeiros 10
      .map(item => `https://image.tmdb.org/t/p/w342${item.poster_path}`);
    
    imagePreloader.addBatch(firstRowUrls, 'high', 'poster');
  }

  console.log('🎯 Critical images queued for preloading');
}
