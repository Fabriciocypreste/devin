/**
 * 🚀 TMDB LAZY LOADER
 * 
 * Carrega dados do TMDB de forma inteligente e progressiva:
 * 1. Carrega primeiro a página inicial (priority items)
 * 2. Depois carrega o resto em background
 * 3. Usa cache para evitar requisições duplicadas
 * 4. Limita requisições simultâneas para não sobrecarregar API
 */

import { getFromCache, saveToCache, getBatchFromCache, saveBatchToCache } from './tmdbCache';
import { enrichMovie, enrichSeries } from '../services/tmdbService';

// ═══════════════════════════════════════════════════════════
// CONFIGURAÇÕES
// ═══════════════════════════════════════════════════════════

// Número de itens carregados na primeira página (PRIORIDADE)
const PRIORITY_ITEMS = 20;

// Número de requisições simultâneas ao TMDB
const CONCURRENT_REQUESTS = 3;

// Delay entre batches (ms)
const BATCH_DELAY = 500;

// Tamanho do batch
const BATCH_SIZE = 5;

// ═══════════════════════════════════════════════════════════
// TIPOS
// ═══════════════════════════════════════════════════════════

export interface LazyLoadItem {
  title: string;
  year?: number;
  type: 'movie' | 'tv';
  streamUrl: string;
  category?: string;
  logo?: string;
  original_title?: string;
  id: number;
}

export interface EnrichedItem extends LazyLoadItem {
  poster_path?: string;
  backdrop_path?: string;
  poster_url?: string;
  backdrop_url?: string;
  overview?: string;
  vote_average?: number;
  release_date?: string;
  genre_ids?: number[];
  genres?: Array<{ id: number; name: string }>;
  tmdbId?: number;
  isEnriched: boolean;
}

export interface LazyLoadProgress {
  current: number;
  total: number;
  percentage: number;
  phase: 'priority' | 'background' | 'completed';
}

// ═══════════════════════════════════════════════════════════
// ESTADO GLOBAL
// ═══════════════════════════════════════════════════════════

const loadingQueue = new Map<string, Promise<EnrichedItem>>();
let isBackgroundLoading = false;
let backgroundAbortController: AbortController | null = null;

// ═══════════════════════════════════════════════════════════
// FUNÇÕES PRINCIPAIS
// ═══════════════════════════════════════════════════════════

/**
 * Enriquece um único item com dados do TMDB
 */
async function enrichSingleItem(item: LazyLoadItem): Promise<EnrichedItem> {
  const cacheKey = `${item.type}:${item.title}:${item.year || 'unknown'}`;
  
  // 1. Verificar cache primeiro
  const cached = getFromCache(item.title, item.year, item.type);
  if (cached) {
    return {
      ...item,
      ...cached,
      isEnriched: true,
    };
  }
  
  // 2. Verificar se já está sendo carregado
  if (loadingQueue.has(cacheKey)) {
    return loadingQueue.get(cacheKey)!;
  }
  
  // 3. Criar promise de carregamento
  const loadPromise = (async () => {
    try {
      // Extrair ano do título se não fornecido
      let year = item.year;
      if (!year && item.title) {
        const yearMatch = item.title.match(/\b(19|20)\d{2}\b/);
        year = yearMatch ? parseInt(yearMatch[0]) : undefined;
      }
      
      // Limpar título
      const cleanTitle = item.title
        .replace(/\b(19|20)\d{2}\b/g, '')
        .replace(/\b(1080p|720p|480p|360p|HD|FHD|4K|UHD|BluRay|WEB-DL|WEBRip)\b/gi, '')
        .replace(/\b(Dublado|Legendado|Dual|Audio)\b/gi, '')
        .replace(/\[.*?\]/g, '')
        .replace(/\(.*?\)/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      
      // Buscar no TMDB
      const enrichFunc = item.type === 'movie' ? enrichMovie : enrichSeries;
      const tmdbData = await enrichFunc(cleanTitle, year);
      
      if (tmdbData) {
        // Salvar no cache
        saveToCache(item.title, tmdbData, year, item.type);
        
        const enriched: EnrichedItem = {
          ...item,
          poster_path: tmdbData.poster_path,
          backdrop_path: tmdbData.backdrop_path,
          poster_url: tmdbData.poster_url,
          backdrop_url: tmdbData.backdrop_url,
          overview: tmdbData.overview,
          vote_average: tmdbData.vote_average,
          release_date: tmdbData.release_date,
          genres: tmdbData.genres,
          genre_ids: tmdbData.genres?.map((g: any) => g.id),
          tmdbId: tmdbData.id,
          isEnriched: true,
        };
        
        return enriched;
      }
    } catch (error) {
      console.warn(`⚠️ Erro ao enriquecer "${item.title}":`, error);
    }
    
    // Retornar item sem enriquecimento se falhar
    return {
      ...item,
      isEnriched: false,
    };
  })();
  
  // Adicionar à fila
  loadingQueue.set(cacheKey, loadPromise);
  
  // Limpar da fila quando concluir
  loadPromise.finally(() => {
    loadingQueue.delete(cacheKey);
  });
  
  return loadPromise;
}

/**
 * Enriquece múltiplos itens em paralelo (com limite de concorrência)
 */
async function enrichBatch(
  items: LazyLoadItem[],
  concurrency: number = CONCURRENT_REQUESTS
): Promise<EnrichedItem[]> {
  const results: EnrichedItem[] = [];
  
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const enriched = await Promise.all(
      batch.map(item => enrichSingleItem(item))
    );
    results.push(...enriched);
    
    // Delay entre batches para não sobrecarregar API
    if (i + concurrency < items.length) {
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY));
    }
  }
  
  return results;
}

/**
 * 🎯 CARREGAMENTO PRIORIZADO
 * Carrega primeiro os itens da página inicial, depois o resto em background
 */
export async function lazyLoadWithPriority(
  allItems: LazyLoadItem[],
  onProgress?: (progress: LazyLoadProgress) => void,
  onPriorityComplete?: (items: EnrichedItem[]) => void
): Promise<EnrichedItem[]> {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🚀 LAZY LOAD COM PRIORIDADE - INICIANDO');
  console.log(`📊 Total de itens: ${allItems.length}`);
  console.log(`🎯 Itens prioritários: ${PRIORITY_ITEMS}`);
  console.log(`🔄 Concorrência: ${CONCURRENT_REQUESTS} requisições simultâneas`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const results: EnrichedItem[] = [];
  
  // ═══════════════════════════════════════════════════════════
  // FASE 1: CARREGAR ITENS PRIORITÁRIOS (PÁGINA INICIAL)
  // ═══════════════════════════════════════════════════════════
  
  const priorityItems = allItems.slice(0, PRIORITY_ITEMS);
  const backgroundItems = allItems.slice(PRIORITY_ITEMS);
  
  console.log(`\n🎯 FASE 1: Carregando ${priorityItems.length} itens prioritários...`);
  
  if (onProgress) {
    onProgress({
      current: 0,
      total: allItems.length,
      percentage: 0,
      phase: 'priority',
    });
  }
  
  // Verificar cache em lote primeiro
  const cachedPriority = getBatchFromCache(
    priorityItems.map(item => ({
      title: item.title,
      year: item.year,
      type: item.type,
    }))
  );
  
  console.log(`✅ ${cachedPriority.size}/${priorityItems.length} itens prioritários em cache`);
  
  // Enriquecer itens prioritários
  const enrichedPriority = await enrichBatch(priorityItems, CONCURRENT_REQUESTS);
  results.push(...enrichedPriority);
  
  const prioritySuccess = enrichedPriority.filter(i => i.isEnriched).length;
  console.log(`✅ FASE 1 COMPLETA: ${prioritySuccess}/${priorityItems.length} enriquecidos`);
  
  if (onProgress) {
    onProgress({
      current: priorityItems.length,
      total: allItems.length,
      percentage: Math.round((priorityItems.length / allItems.length) * 100),
      phase: 'priority',
    });
  }
  
  // Notificar conclusão dos itens prioritários
  if (onPriorityComplete) {
    onPriorityComplete(enrichedPriority);
  }
  
  // ═══════════════════════════════════════════════════════════
  // FASE 2: CARREGAR RESTO EM BACKGROUND
  // ═══════════════════════════════════════════════════════════
  
  if (backgroundItems.length > 0) {
    console.log(`\n🔄 FASE 2: Carregando ${backgroundItems.length} itens em background...`);
    
    // Marcar que estamos carregando em background
    isBackgroundLoading = true;
    backgroundAbortController = new AbortController();
    
    // Carregar em background (não bloqueia)
    (async () => {
      try {
        let completed = priorityItems.length;
        
        // Processar em batches pequenos
        for (let i = 0; i < backgroundItems.length; i += BATCH_SIZE) {
          // Verificar se foi cancelado
          if (backgroundAbortController?.signal.aborted) {
            console.log('⚠️ Carregamento em background cancelado');
            break;
          }
          
          const batch = backgroundItems.slice(i, i + BATCH_SIZE);
          const enriched = await enrichBatch(batch, CONCURRENT_REQUESTS);
          results.push(...enriched);
          
          completed += batch.length;
          
          if (onProgress) {
            onProgress({
              current: completed,
              total: allItems.length,
              percentage: Math.round((completed / allItems.length) * 100),
              phase: 'background',
            });
          }
          
          // Log de progresso a cada 20 itens
          if (completed % 20 === 0) {
            const successCount = enriched.filter(i => i.isEnriched).length;
            console.log(`📊 Progresso: ${completed}/${allItems.length} (${successCount}/${batch.length} enriquecidos neste batch)`);
          }
        }
        
        const totalSuccess = results.filter(i => i.isEnriched).length;
        console.log(`\n✅ FASE 2 COMPLETA: ${totalSuccess}/${allItems.length} itens enriquecidos no total`);
        
        if (onProgress) {
          onProgress({
            current: allItems.length,
            total: allItems.length,
            percentage: 100,
            phase: 'completed',
          });
        }
        
      } catch (error) {
        console.error('❌ Erro no carregamento em background:', error);
      } finally {
        isBackgroundLoading = false;
        backgroundAbortController = null;
      }
    })();
  } else {
    console.log('✅ Todos os itens carregados (sem background)');
    
    if (onProgress) {
      onProgress({
        current: allItems.length,
        total: allItems.length,
        percentage: 100,
        phase: 'completed',
      });
    }
  }
  
  // Retornar imediatamente com os itens prioritários
  // (os itens de background serão adicionados progressivamente)
  return results;
}

/**
 * Carrega um único item sob demanda (quando visível)
 */
export async function lazyLoadSingleItem(item: LazyLoadItem): Promise<EnrichedItem> {
  return enrichSingleItem(item);
}

/**
 * Carrega itens quando se tornam visíveis (intersection observer)
 */
export function createLazyObserver(
  onItemVisible: (item: LazyLoadItem) => void
): IntersectionObserver {
  return new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const item = (entry.target as any).__lazyLoadItem;
          if (item) {
            onItemVisible(item);
          }
        }
      });
    },
    {
      rootMargin: '200px', // Começar a carregar 200px antes de ficar visível
      threshold: 0.1,
    }
  );
}

/**
 * Cancela o carregamento em background
 */
export function cancelBackgroundLoading(): void {
  if (backgroundAbortController) {
    backgroundAbortController.abort();
    console.log('⚠️ Carregamento em background cancelado pelo usuário');
  }
}

/**
 * Verifica se está carregando em background
 */
export function isLoadingInBackground(): boolean {
  return isBackgroundLoading;
}

/**
 * Limpa a fila de carregamento
 */
export function clearLoadingQueue(): void {
  loadingQueue.clear();
  console.log('🗑️ Fila de carregamento limpa');
}

/**
 * Pré-carrega itens específicos (para navegação antecipada)
 */
export async function preloadItems(
  items: LazyLoadItem[],
  onProgress?: (current: number, total: number) => void
): Promise<EnrichedItem[]> {
  console.log(`🔄 Pré-carregando ${items.length} itens...`);
  
  const results: EnrichedItem[] = [];
  
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);
    const enriched = await enrichBatch(batch, CONCURRENT_REQUESTS);
    results.push(...enriched);
    
    if (onProgress) {
      onProgress(Math.min(i + BATCH_SIZE, items.length), items.length);
    }
  }
  
  return results;
}

// ═══════════════════════════════════════════════════════════
// ESTATÍSTICAS
// ═══════════════════════════════════════════════════════════

export interface LoaderStats {
  queueSize: number;
  isBackgroundLoading: boolean;
  backgroundItemsRemaining: number;
}

export function getLoaderStats(): LoaderStats {
  return {
    queueSize: loadingQueue.size,
    isBackgroundLoading,
    backgroundItemsRemaining: 0, // TODO: Implementar contador
  };
}
