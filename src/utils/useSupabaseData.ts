/**
 * Hook React para carregar dados do Supabase com fallback local
 * 
 * Features:
 * - Carrega dados do Supabase como fonte primária
 * - Fallback automático para JSON local se Supabase falhar
 * - Cache em memória para evitar requisições desnecessárias
 * - Loading e error states
 * - Revalidação automática
 */

import { useState, useEffect } from 'react';
import { db, type Filme, type Serie, type Canal } from './supabase/client';

// Cache em memória
const cache = {
  filmes: null as Filme[] | null,
  series: null as Serie[] | null,
  canais: null as Canal[] | null,
  timestamp: {
    filmes: 0,
    series: 0,
    canais: 0,
  },
};

// Tempo de cache (5 minutos)
const CACHE_TIME = 5 * 60 * 1000;

/**
 * Carrega dados do arquivo JSON local (fallback)
 */
async function carregarJSONLocal<T>(caminho: string): Promise<T[]> {
  try {
    const response = await fetch(caminho);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${caminho}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Erro ao carregar JSON local ${caminho}:`, error);
    return [];
  }
}

/**
 * Hook para carregar filmes do Supabase com fallback local
 */
export function useFilmes() {
  const [filmes, setFilmes] = useState<Filme[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'supabase' | 'local' | null>(null);

  useEffect(() => {
    async function loadFilmes() {
      try {
        setLoading(true);
        setError(null);

        // Verificar cache
        const now = Date.now();
        if (cache.filmes && (now - cache.timestamp.filmes) < CACHE_TIME) {
          console.log('✅ Filmes carregados do cache');
          setFilmes(cache.filmes);
          setSource('supabase');
          setLoading(false);
          return;
        }

        // Tentar carregar do Supabase
        try {
          console.log('📥 Carregando filmes do Supabase...');
          const data = await db.filmes.getAll();
          
          if (data && data.length > 0) {
            console.log(`✅ ${data.length} filmes carregados do Supabase`);
            setFilmes(data);
            setSource('supabase');
            
            // Atualizar cache
            cache.filmes = data;
            cache.timestamp.filmes = now;
          } else {
            throw new Error('Nenhum filme encontrado no Supabase');
          }
        } catch (supabaseError) {
          console.warn('⚠️ Erro ao carregar do Supabase, usando fallback local');
          console.error(supabaseError);
          
          // Fallback: carregar do JSON local
          const localData = await carregarJSONLocal<Filme>('/data/filmes.json');
          
          if (localData && localData.length > 0) {
            console.log(`✅ ${localData.length} filmes carregados do JSON local`);
            setFilmes(localData);
            setSource('local');
          } else {
            throw new Error('Nenhum filme encontrado (Supabase e local falharam)');
          }
        }
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : 'Erro ao carregar filmes';
        console.error('❌ Erro fatal ao carregar filmes:', mensagem);
        setError(mensagem);
        setFilmes([]);
        setSource(null);
      } finally {
        setLoading(false);
      }
    }

    loadFilmes();
  }, []);

  return { filmes, loading, error, source };
}

/**
 * Hook para carregar séries do Supabase com fallback local
 */
export function useSeries() {
  const [series, setSeries] = useState<Serie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'supabase' | 'local' | null>(null);

  useEffect(() => {
    async function loadSeries() {
      try {
        setLoading(true);
        setError(null);

        // Verificar cache
        const now = Date.now();
        if (cache.series && (now - cache.timestamp.series) < CACHE_TIME) {
          console.log('✅ Séries carregadas do cache');
          setSeries(cache.series);
          setSource('supabase');
          setLoading(false);
          return;
        }

        // Tentar carregar do Supabase
        try {
          console.log('📥 Carregando séries do Supabase...');
          const data = await db.series.getAll();
          
          if (data && data.length > 0) {
            console.log(`✅ ${data.length} séries carregadas do Supabase`);
            setSeries(data);
            setSource('supabase');
            
            // Atualizar cache
            cache.series = data;
            cache.timestamp.series = now;
          } else {
            throw new Error('Nenhuma série encontrada no Supabase');
          }
        } catch (supabaseError) {
          console.warn('⚠️ Erro ao carregar do Supabase, usando fallback local');
          console.error(supabaseError);
          
          // Fallback: carregar do JSON local
          const localData = await carregarJSONLocal<Serie>('/data/series.json');
          
          if (localData && localData.length > 0) {
            console.log(`✅ ${localData.length} séries carregadas do JSON local`);
            setSeries(localData);
            setSource('local');
          } else {
            throw new Error('Nenhuma série encontrada (Supabase e local falharam)');
          }
        }
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : 'Erro ao carregar séries';
        console.error('❌ Erro fatal ao carregar séries:', mensagem);
        setError(mensagem);
        setSeries([]);
        setSource(null);
      } finally {
        setLoading(false);
      }
    }

    loadSeries();
  }, []);

  return { series, loading, error, source };
}

/**
 * Hook para carregar canais do Supabase com fallback local
 */
export function useCanais() {
  const [canais, setCanais] = useState<Canal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<'supabase' | 'local' | null>(null);

  useEffect(() => {
    async function loadCanais() {
      try {
        setLoading(true);
        setError(null);

        // Verificar cache
        const now = Date.now();
        if (cache.canais && (now - cache.timestamp.canais) < CACHE_TIME) {
          console.log('✅ Canais carregados do cache');
          setCanais(cache.canais);
          setSource('supabase');
          setLoading(false);
          return;
        }

        // Tentar carregar do Supabase
        try {
          console.log('📥 Carregando canais do Supabase...');
          const data = await db.canais.getAll();
          
          if (data && data.length > 0) {
            console.log(`✅ ${data.length} canais carregados do Supabase`);
            setCanais(data);
            setSource('supabase');
            
            // Atualizar cache
            cache.canais = data;
            cache.timestamp.canais = now;
          } else {
            throw new Error('Nenhum canal encontrado no Supabase');
          }
        } catch (supabaseError) {
          console.warn('⚠️ Erro ao carregar do Supabase, usando fallback local');
          console.error(supabaseError);
          
          // Fallback: carregar do JSON local
          const localData = await carregarJSONLocal<Canal>('/data/canais.json');
          
          if (localData && localData.length > 0) {
            console.log(`✅ ${localData.length} canais carregados do JSON local`);
            setCanais(localData);
            setSource('local');
          } else {
            throw new Error('Nenhum canal encontrado (Supabase e local falharam)');
          }
        }
      } catch (err) {
        const mensagem = err instanceof Error ? err.message : 'Erro ao carregar canais';
        console.error('❌ Erro fatal ao carregar canais:', mensagem);
        setError(mensagem);
        setCanais([]);
        setSource(null);
      } finally {
        setLoading(false);
      }
    }

    loadCanais();
  }, []);

  return { canais, loading, error, source };
}

/**
 * Hook para carregar todos os dados (filmes, séries e canais)
 */
export function useTodosDados() {
  const filmesData = useFilmes();
  const seriesData = useSeries();
  const canaisData = useCanais();

  const loading = filmesData.loading || seriesData.loading || canaisData.loading;
  const hasError = filmesData.error || seriesData.error || canaisData.error;

  return {
    filmes: filmesData.filmes,
    series: seriesData.series,
    canais: canaisData.canais,
    loading,
    error: hasError,
    sources: {
      filmes: filmesData.source,
      series: seriesData.source,
      canais: canaisData.source,
    },
  };
}

/**
 * Limpa o cache manualmente
 */
export function limparCache() {
  cache.filmes = null;
  cache.series = null;
  cache.canais = null;
  cache.timestamp.filmes = 0;
  cache.timestamp.series = 0;
  cache.timestamp.canais = 0;
  console.log('🗑️ Cache limpo');
}

// Expor função de limpar cache globalmente em desenvolvimento
if (typeof window !== 'undefined') {
  (window as any).limparCacheRedFlix = limparCache;
}
