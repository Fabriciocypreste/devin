/**
 * REDFLIX - Hook para Favoritos
 * Gerenciamento de favoritos integrado com o backend
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

// Toast nativo simples
const showToast = (message: string, type: 'error' | 'success' = 'success') => {
  const toastEl = document.createElement('div');
  toastEl.className = `fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-opacity ${
    type === 'error' ? 'bg-red-600' : 'bg-green-600'
  }`;
  toastEl.textContent = message;
  toastEl.style.opacity = '1';
  document.body.appendChild(toastEl);
  setTimeout(() => {
    toastEl.style.opacity = '0';
    setTimeout(() => toastEl.remove(), 300);
  }, 3000);
};

const toast = {
  error: (msg: string) => showToast(msg, 'error'),
  success: (msg: string) => showToast(msg, 'success')
};

interface FavoriteItem {
  id: string;
  content_id: string;
  content_type: 'movie' | 'tv' | 'iptv';
  tmdb_id?: number;
  title?: string;
  poster_url?: string;
  added_at: string;
}

export function useFavorites() {
  const { accessToken, selectedProfile, isAuthenticated, isLoading: authLoading } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Carregar favoritos
   */
  const loadFavorites = async () => {
    if (!isAuthenticated || !accessToken) {
      setFavorites([]);
      return;
    }

    try {
      setIsLoading(true);
      const { favorites: items } = await api.favorites.list(
        accessToken,
        selectedProfile?.id
      );
      setFavorites(items);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast.error('Erro ao carregar favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verificar se item está nos favoritos
   */
  const isFavorite = (contentId: string): boolean => {
    return favorites.some(item => item.content_id === contentId);
  };

  /**
   * Adicionar aos favoritos
   */
  const addToFavorites = async (data: {
    content_id: string;
    content_type: 'movie' | 'tv' | 'iptv';
    tmdb_id?: number;
    title?: string;
    poster_url?: string;
  }) => {
    if (!isAuthenticated || !accessToken) {
      toast.error('Você precisa estar logado');
      return false;
    }

    try {
      await api.favorites.add(accessToken, {
        ...data,
        profile_id: selectedProfile?.id,
      });
      
      // Recarregar favoritos
      await loadFavorites();
      
      toast.success('Adicionado aos favoritos');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar aos favoritos:', error);
      toast.error('Erro ao adicionar aos favoritos');
      return false;
    }
  };

  /**
   * Remover dos favoritos
   */
  const removeFromFavorites = async (contentId: string) => {
    if (!isAuthenticated || !accessToken) {
      return false;
    }

    try {
      await api.favorites.remove(
        accessToken,
        contentId,
        selectedProfile?.id
      );
      
      // Recarregar favoritos
      await loadFavorites();
      
      toast.success('Removido dos favoritos');
      return true;
    } catch (error) {
      console.error('Erro ao remover dos favoritos:', error);
      toast.error('Erro ao remover dos favoritos');
      return false;
    }
  };

  /**
   * Toggle (adicionar ou remover)
   */
  const toggleFavorite = async (data: {
    content_id: string;
    content_type: 'movie' | 'tv' | 'iptv';
    tmdb_id?: number;
    title?: string;
    poster_url?: string;
  }) => {
    if (isFavorite(data.content_id)) {
      return await removeFromFavorites(data.content_id);
    } else {
      return await addToFavorites(data);
    }
  };

  // Carregar ao montar ou quando mudar perfil
  useEffect(() => {
    // Só carregar se o auth já foi inicializado e usuário está autenticado
    if (!authLoading && isAuthenticated && accessToken) {
      loadFavorites();
    }
  }, [accessToken, selectedProfile?.id, isAuthenticated, authLoading]);

  return {
    favorites,
    isLoading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    refreshFavorites: loadFavorites,
  };
}