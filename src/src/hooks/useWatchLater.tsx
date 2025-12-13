import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as kv from '../utils/supabase/kv_store';

interface WatchLaterItem {
  content_id: string;
  content_type: 'movie' | 'tv';
  tmdb_id: number;
  title: string;
  poster_url: string;
  backdrop_url: string;
  added_at?: string;
}

const WATCH_LATER_PREFIX = 'watch_later:';

/**
 * Hook para gerenciar lista "Assistir Mais Tarde"
 * Funciona com localStorage (não autenticado) ou Supabase (autenticado)
 */
export function useWatchLater() {
  const { user, isAuthenticated } = useAuth();
  const [watchLaterItems, setWatchLaterItems] = useState<WatchLaterItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Carregar lista do localStorage ou Supabase
  useEffect(() => {
    const loadWatchLater = async () => {
      if (!isAuthenticated || !user) {
        // Modo offline: usar localStorage
        const saved = localStorage.getItem('redflix_watchlater');
        if (saved) {
          try {
            const items = JSON.parse(saved);
            setWatchLaterItems(items);
          } catch (e) {
            console.error('Erro ao carregar watchLater do localStorage:', e);
          }
        }
        return;
      }

      // Modo online: buscar do Supabase
      setLoading(true);
      try {
        const key = `${WATCH_LATER_PREFIX}${user.id}`;
        const result = await kv.get(key);
        
        if (result) {
          setWatchLaterItems(result as WatchLaterItem[]);
        }
      } catch (error) {
        console.error('Erro ao carregar watchLater do Supabase:', error);
      } finally {
        setLoading(false);
      }
    };

    loadWatchLater();
  }, [user, isAuthenticated]);

  // Verificar se um item está na lista
  const isInWatchLater = useCallback((contentId: string): boolean => {
    return watchLaterItems.some(item => item.content_id === contentId);
  }, [watchLaterItems]);

  // Adicionar ou remover da lista
  const toggleWatchLater = useCallback(async (item: Omit<WatchLaterItem, 'added_at'>) => {
    const exists = isInWatchLater(item.content_id);
    
    if (!isAuthenticated || !user) {
      // Modo offline: atualizar localStorage
      const newList = exists
        ? watchLaterItems.filter(i => i.content_id !== item.content_id)
        : [...watchLaterItems, { ...item, added_at: new Date().toISOString() }];
      
      setWatchLaterItems(newList);
      localStorage.setItem('redflix_watchlater', JSON.stringify(newList));
      
      return;
    }

    // Modo online: atualizar Supabase
    setLoading(true);
    try {
      const key = `${WATCH_LATER_PREFIX}${user.id}`;
      
      const newList = exists
        ? watchLaterItems.filter(i => i.content_id !== item.content_id)
        : [...watchLaterItems, { ...item, added_at: new Date().toISOString() }];
      
      await kv.set(key, newList);
      setWatchLaterItems(newList);
      
      console.log(exists ? '✅ Removido de Assistir Mais Tarde' : '✅ Adicionado a Assistir Mais Tarde');
    } catch (error) {
      console.error('Erro ao atualizar watchLater no Supabase:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [watchLaterItems, user, isAuthenticated, isInWatchLater]);

  // Remover item específico
  const removeFromWatchLater = useCallback(async (contentId: string) => {
    if (!isAuthenticated || !user) {
      // Modo offline
      const newList = watchLaterItems.filter(i => i.content_id !== contentId);
      setWatchLaterItems(newList);
      localStorage.setItem('redflix_watchlater', JSON.stringify(newList));
      return;
    }

    // Modo online
    setLoading(true);
    try {
      const key = `${WATCH_LATER_PREFIX}${user.id}`;
      const newList = watchLaterItems.filter(i => i.content_id !== contentId);
      
      await kv.set(key, newList);
      setWatchLaterItems(newList);
    } catch (error) {
      console.error('Erro ao remover de watchLater:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [watchLaterItems, user, isAuthenticated]);

  // Limpar toda a lista
  const clearWatchLater = useCallback(async () => {
    if (!isAuthenticated || !user) {
      // Modo offline
      setWatchLaterItems([]);
      localStorage.removeItem('redflix_watchlater');
      return;
    }

    // Modo online
    setLoading(true);
    try {
      const key = `${WATCH_LATER_PREFIX}${user.id}`;
      await kv.del(key);
      setWatchLaterItems([]);
    } catch (error) {
      console.error('Erro ao limpar watchLater:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  return {
    watchLaterItems,
    loading,
    isInWatchLater,
    toggleWatchLater,
    removeFromWatchLater,
    clearWatchLater,
  };
}