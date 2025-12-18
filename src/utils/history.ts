/**
 * REDFLIX WATCH HISTORY MANAGER
 * Gerencia histórico de visualização com progresso
 */

import { EnrichedContent } from '../types/content';

const HISTORY_KEY = 'redflix_watch_history';
const MAX_HISTORY_ITEMS = 100; // Limita histórico a 100 itens

export interface HistoryItem {
  content: EnrichedContent;
  progress: number; // Porcentagem assistida (0-100)
  lastWatched: number; // Timestamp
  duration?: number; // Duração total em segundos (se disponível)
  currentTime?: number; // Tempo atual em segundos
}

/**
 * Adiciona ou atualiza item no histórico
 */
export const addToHistory = (
  item: EnrichedContent, 
  progress: number = 0,
  currentTime?: number,
  duration?: number
): void => {
  try {
    let history = getHistory();
    
    // Remove item existente se houver
    history = history.filter(h => h.content.id !== item.id);
    
    // Adiciona no início (mais recente primeiro)
    history.unshift({
      content: item,
      progress: Math.min(100, Math.max(0, progress)), // Garante 0-100
      lastWatched: Date.now(),
      currentTime,
      duration
    });
    
    // Limita tamanho do histórico
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    
    // Dispara evento customizado para atualizar UI
    window.dispatchEvent(new CustomEvent('historyChanged'));
  } catch (error) {
    console.error('Erro ao adicionar ao histórico:', error);
  }
};

/**
 * Retorna todo o histórico ordenado por data (mais recente primeiro)
 */
export const getHistory = (): HistoryItem[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    
    const history = JSON.parse(stored) as HistoryItem[];
    
    // Ordena por lastWatched (mais recente primeiro)
    return history.sort((a, b) => b.lastWatched - a.lastWatched);
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
};

/**
 * Retorna progresso de um item específico
 */
export const getProgress = (id: string): number => {
  const history = getHistory();
  const item = history.find(h => h.content.id === id);
  return item?.progress || 0;
};

/**
 * Retorna informações de reprodução de um item específico
 */
export const getPlaybackInfo = (id: string): { currentTime: number; duration: number; progress: number } | null => {
  const history = getHistory();
  const item = history.find(h => h.content.id === id);
  
  if (!item) return null;
  
  return {
    currentTime: item.currentTime || 0,
    duration: item.duration || 0,
    progress: item.progress
  };
};

/**
 * Limpa todo o histórico
 */
export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
    window.dispatchEvent(new CustomEvent('historyChanged'));
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
  }
};

/**
 * Remove um item específico do histórico
 */
export const removeFromHistory = (id: string): void => {
  try {
    const history = getHistory();
    const filtered = history.filter(item => item.content.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
    
    window.dispatchEvent(new CustomEvent('historyChanged'));
  } catch (error) {
    console.error('Erro ao remover do histórico:', error);
  }
};

/**
 * Retorna histórico filtrado por período
 */
export const getHistoryByPeriod = (period: 'today' | 'week' | 'month' | 'all' = 'all'): HistoryItem[] => {
  const history = getHistory();
  const now = Date.now();
  
  if (period === 'all') {
    return history;
  }
  
  const periodMillis = {
    today: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
    month: 30 * 24 * 60 * 60 * 1000
  };
  
  const cutoff = now - periodMillis[period];
  return history.filter(item => item.lastWatched >= cutoff);
};

/**
 * Retorna histórico filtrado por tipo de conteúdo
 */
export const getHistoryByType = (type: 'movie' | 'series' | 'channel' | 'all' = 'all'): HistoryItem[] => {
  const history = getHistory();
  
  if (type === 'all') {
    return history;
  }
  
  return history.filter(item => item.content.type === type);
};

/**
 * Retorna itens para "Continuar Assistindo" (progresso entre 5% e 95%)
 */
export const getContinueWatching = (): HistoryItem[] => {
  const history = getHistory();
  return history.filter(item => item.progress >= 5 && item.progress < 95);
};

/**
 * Hook personalizado para usar histórico em componentes React
 */
export const useHistoryListener = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  window.addEventListener('historyChanged', callback);
  
  return () => {
    window.removeEventListener('historyChanged', callback);
  };
};
