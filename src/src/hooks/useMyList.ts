/**
 * REDFLIX - Hook para Minha Lista
 * Gerenciamento de minha lista integrado com o backend
 */

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../utils/api';

// Toast nativo simples
const showToast = (message: string, type: 'error' | 'success' = 'success') => {
  const toastEl = document.createElement('div');
  toastEl.className = `fixed top-4 right-4 z-[9999] px-6 py-3 rounded-lg shadow-lg text-white font-semibold ${
    type === 'error' ? 'bg-red-600' : 'bg-green-600'
  }`;
  toastEl.textContent = message;
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

interface MyListItem {
  id: string;
  content_id: string;
  content_type: 'movie' | 'tv' | 'iptv';
  tmdb_id?: number;
  title?: string;
  poster_url?: string;
  added_at: string;
}

export function useMyList() {
  const { accessToken, selectedProfile, isAuthenticated, isLoading: authLoading } = useAuth();
  const [myList, setMyList] = useState<MyListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Carregar minha lista
   */
  const loadMyList = async () => {
    if (!isAuthenticated || !accessToken) {
      setMyList([]);
      return;
    }

    try {
      setIsLoading(true);
      const { items } = await api.myList.list(
        accessToken,
        selectedProfile?.id
      );
      setMyList(items);
    } catch (error) {
      console.error('Erro ao carregar minha lista:', error);
      toast.error('Erro ao carregar sua lista');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verificar se item está na lista
   */
  const isInMyList = (contentId: string): boolean => {
    return myList.some(item => item.content_id === contentId);
  };

  /**
   * Adicionar à minha lista
   */
  const addToMyList = async (data: {
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
      await api.myList.add(accessToken, {
        ...data,
        profile_id: selectedProfile?.id,
      });
      
      // Recarregar lista
      await loadMyList();
      
      toast.success('Adicionado à sua lista');
      return true;
    } catch (error) {
      console.error('Erro ao adicionar à minha lista:', error);
      toast.error('Erro ao adicionar à lista');
      return false;
    }
  };

  /**
   * Remover da minha lista
   */
  const removeFromMyList = async (contentId: string) => {
    if (!isAuthenticated || !accessToken) {
      return false;
    }

    try {
      await api.myList.remove(
        accessToken,
        contentId,
        selectedProfile?.id
      );
      
      // Recarregar lista
      await loadMyList();
      
      toast.success('Removido da sua lista');
      return true;
    } catch (error) {
      console.error('Erro ao remover da minha lista:', error);
      toast.error('Erro ao remover da lista');
      return false;
    }
  };

  /**
   * Toggle (adicionar ou remover)
   */
  const toggleMyList = async (data: {
    content_id: string;
    content_type: 'movie' | 'tv' | 'iptv';
    tmdb_id?: number;
    title?: string;
    poster_url?: string;
  }) => {
    if (isInMyList(data.content_id)) {
      return await removeFromMyList(data.content_id);
    } else {
      return await addToMyList(data);
    }
  };

  // Carregar ao montar ou quando mudar perfil
  useEffect(() => {
    // Só carregar se o auth já foi inicializado e usuário está autenticado
    if (!authLoading && isAuthenticated && accessToken) {
      loadMyList();
    }
  }, [accessToken, selectedProfile?.id, isAuthenticated, authLoading]);

  return {
    myList,
    isLoading,
    isInMyList,
    addToMyList,
    removeFromMyList,
    toggleMyList,
    refreshMyList: loadMyList,
  };
}