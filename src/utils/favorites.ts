/**
 * REDFLIX FAVORITES MANAGER
 * Gerencia favoritos do usuário usando localStorage
 */

import { EnrichedContent } from '../types/content';

const FAVORITES_KEY = 'redflix_favorites';

/**
 * Adiciona um item aos favoritos
 */
export const addToFavorites = (item: EnrichedContent): void => {
  try {
    const favorites = getFavorites();
    
    // Verifica se já existe
    if (favorites.some(fav => fav.id === item.id)) {
      console.log('Item já está nos favoritos');
      return;
    }
    
    favorites.push(item);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    
    // Dispara evento customizado para atualizar UI
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  } catch (error) {
    console.error('Erro ao adicionar aos favoritos:', error);
  }
};

/**
 * Remove um item dos favoritos
 */
export const removeFromFavorites = (id: string): void => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(item => item.id !== id);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
    
    // Dispara evento customizado para atualizar UI
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  } catch (error) {
    console.error('Erro ao remover dos favoritos:', error);
  }
};

/**
 * Retorna todos os favoritos
 */
export const getFavorites = (): EnrichedContent[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (!stored) return [];
    
    return JSON.parse(stored) as EnrichedContent[];
  } catch (error) {
    console.error('Erro ao carregar favoritos:', error);
    return [];
  }
};

/**
 * Verifica se um item está nos favoritos
 */
export const isFavorite = (id: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(item => item.id === id);
};

/**
 * Limpa todos os favoritos
 */
export const clearFavorites = (): void => {
  try {
    localStorage.removeItem(FAVORITES_KEY);
    window.dispatchEvent(new CustomEvent('favoritesChanged'));
  } catch (error) {
    console.error('Erro ao limpar favoritos:', error);
  }
};

/**
 * Retorna favoritos filtrados por tipo
 */
export const getFavoritesByType = (type: 'movie' | 'series' | 'channel' | 'all' = 'all'): EnrichedContent[] => {
  const favorites = getFavorites();
  
  if (type === 'all') {
    return favorites;
  }
  
  return favorites.filter(item => item.type === type);
};

/**
 * Hook personalizado para usar favoritos em componentes React
 */
export const useFavoritesListener = (callback: () => void): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  window.addEventListener('favoritesChanged', callback);
  
  return () => {
    window.removeEventListener('favoritesChanged', callback);
  };
};
