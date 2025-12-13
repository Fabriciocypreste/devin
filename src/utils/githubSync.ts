/**
 * GitHub Sync - Utilitários para sincronizar dados do repositório GitHub
 * com o banco de dados Supabase
 */

import { parseM3UComplete, isValidM3U, M3UEntry } from './m3uParser';
import { supabase, Filme, Serie, Canal } from './supabase/client';

export interface SyncResult {
  success: boolean;
  type: 'filmes' | 'series' | 'canais';
  total: number;
  inserted: number;
  updated: number;
  errors: string[];
}

export interface SyncProgress {
  step: string;
  progress: number;
  message: string;
}

/**
 * Busca conteúdo de um arquivo do GitHub
 */
export async function fetchGitHubFile(
  owner: string,
  repo: string,
  path: string
): Promise<string> {
  try {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/main/${path}`;
    console.log(`📡 Buscando arquivo: ${url}`);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar arquivo: ${response.status} ${response.statusText}`);
    }
    
    const content = await response.text();
    console.log(`✅ Arquivo baixado com sucesso (${content.length} bytes)`);
    
    return content;
  } catch (error) {
    console.error(`❌ Erro ao buscar arquivo do GitHub:`, error);
    throw error;
  }
}

/**
 * Processa arquivo JSON
 */
function processJSONFile(content: string, type: 'filmes' | 'series' | 'canais'): M3UEntry[] {
  try {
    const data = JSON.parse(content);
    
    // Se já é um array de objetos com a estrutura esperada
    if (Array.isArray(data)) {
      return data.map(item => ({
        nome: item.nome || item.name || item.title || '',
        logo: item.logo || item.poster || item.image || '',
        url: item.url || item.stream || item.link || '',
        categoria: item.categoria || item.category || item.genre || type,
        tvg_id: item.tvg_id || item.id,
        tvg_name: item.tvg_name || item.nome,
        group_title: item.group_title || item.group || item.categoria,
      }));
    }
    
    // Se tem uma propriedade com o tipo
    if (data[type]) {
      return processJSONFile(JSON.stringify(data[type]), type);
    }
    
    return [];
  } catch (error) {
    console.error('Erro ao processar JSON:', error);
    return [];
  }
}

/**
 * Sincroniza filmes com o Supabase
 */
async function syncFilmes(entries: M3UEntry[]): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    type: 'filmes',
    total: entries.length,
    inserted: 0,
    updated: 0,
    errors: [],
  };
  
  try {
    console.log(`🎬 Sincronizando ${entries.length} filmes...`);
    
    // Converter para formato Filme
    const filmes: Omit<Filme, 'id' | 'created_at'>[] = entries.map(entry => ({
      nome: entry.nome,
      logo: entry.logo,
      categoria: entry.categoria,
      url: entry.url,
    }));
    
    // Fazer upsert em lotes de 100
    const batchSize = 100;
    for (let i = 0; i < filmes.length; i += batchSize) {
      const batch = filmes.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('filmes')
        .upsert(batch, { 
          onConflict: 'nome',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error(`❌ Erro ao inserir lote ${i / batchSize + 1}:`, error);
        result.errors.push(`Lote ${i / batchSize + 1}: ${error.message}`);
      } else {
        result.inserted += data?.length || 0;
        console.log(`✅ Lote ${i / batchSize + 1} inserido (${data?.length || 0} itens)`);
      }
    }
    
    console.log(`✅ ${result.inserted} filmes sincronizados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao sincronizar filmes:', error);
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Erro desconhecido');
  }
  
  return result;
}

/**
 * Sincroniza séries com o Supabase
 */
async function syncSeries(entries: M3UEntry[]): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    type: 'series',
    total: entries.length,
    inserted: 0,
    updated: 0,
    errors: [],
  };
  
  try {
    console.log(`📺 Sincronizando ${entries.length} séries...`);
    
    // Converter para formato Serie
    const series: Omit<Serie, 'id' | 'created_at'>[] = entries.map(entry => ({
      nome: entry.nome,
      logo: entry.logo,
      categoria: entry.categoria,
      url: entry.url,
    }));
    
    // Fazer upsert em lotes de 100
    const batchSize = 100;
    for (let i = 0; i < series.length; i += batchSize) {
      const batch = series.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('series')
        .upsert(batch, { 
          onConflict: 'nome',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error(`❌ Erro ao inserir lote ${i / batchSize + 1}:`, error);
        result.errors.push(`Lote ${i / batchSize + 1}: ${error.message}`);
      } else {
        result.inserted += data?.length || 0;
        console.log(`✅ Lote ${i / batchSize + 1} inserido (${data?.length || 0} itens)`);
      }
    }
    
    console.log(`✅ ${result.inserted} séries sincronizadas com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao sincronizar séries:', error);
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Erro desconhecido');
  }
  
  return result;
}

/**
 * Sincroniza canais com o Supabase
 */
async function syncCanais(entries: M3UEntry[]): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    type: 'canais',
    total: entries.length,
    inserted: 0,
    updated: 0,
    errors: [],
  };
  
  try {
    console.log(`📡 Sincronizando ${entries.length} canais...`);
    
    // Converter para formato Canal
    const canais: Omit<Canal, 'id' | 'created_at'>[] = entries.map(entry => ({
      nome: entry.nome,
      logo: entry.logo,
      categoria: entry.categoria,
      url: entry.url,
    }));
    
    // Fazer upsert em lotes de 100
    const batchSize = 100;
    for (let i = 0; i < canais.length; i += batchSize) {
      const batch = canais.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('canais')
        .upsert(batch, { 
          onConflict: 'nome',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error(`❌ Erro ao inserir lote ${i / batchSize + 1}:`, error);
        result.errors.push(`Lote ${i / batchSize + 1}: ${error.message}`);
      } else {
        result.inserted += data?.length || 0;
        console.log(`✅ Lote ${i / batchSize + 1} inserido (${data?.length || 0} itens)`);
      }
    }
    
    console.log(`✅ ${result.inserted} canais sincronizados com sucesso!`);
  } catch (error) {
    console.error('❌ Erro ao sincronizar canais:', error);
    result.success = false;
    result.errors.push(error instanceof Error ? error.message : 'Erro desconhecido');
  }
  
  return result;
}

/**
 * Sincroniza um arquivo específico do GitHub com o Supabase
 */
export async function syncFile(
  owner: string,
  repo: string,
  path: string,
  type: 'filmes' | 'series' | 'canais',
  onProgress?: (progress: SyncProgress) => void
): Promise<SyncResult> {
  try {
    // Buscar arquivo
    onProgress?.({
      step: 'download',
      progress: 0,
      message: `📡 Baixando ${path}...`,
    });
    
    const content = await fetchGitHubFile(owner, repo, path);
    
    onProgress?.({
      step: 'parse',
      progress: 33,
      message: `📄 Processando arquivo...`,
    });
    
    // Processar arquivo
    let entries: M3UEntry[] = [];
    
    if (isValidM3U(content)) {
      console.log('📝 Arquivo M3U detectado, convertendo para JSON...');
      const parsed = parseM3UComplete(content, path);
      entries = parsed.entries;
      console.log(`✅ ${entries.length} entradas extraídas do M3U`);
    } else if (path.endsWith('.json')) {
      console.log('📝 Arquivo JSON detectado');
      entries = processJSONFile(content, type);
      console.log(`✅ ${entries.length} entradas extraídas do JSON`);
    } else {
      throw new Error('Formato de arquivo não suportado');
    }
    
    if (entries.length === 0) {
      throw new Error('Nenhuma entrada encontrada no arquivo');
    }
    
    onProgress?.({
      step: 'sync',
      progress: 66,
      message: `💾 Sincronizando com Supabase...`,
    });
    
    // Sincronizar com banco
    let result: SyncResult;
    
    switch (type) {
      case 'filmes':
        result = await syncFilmes(entries);
        break;
      case 'series':
        result = await syncSeries(entries);
        break;
      case 'canais':
        result = await syncCanais(entries);
        break;
    }
    
    onProgress?.({
      step: 'complete',
      progress: 100,
      message: `✅ Sincronização completa!`,
    });
    
    return result;
  } catch (error) {
    console.error('❌ Erro na sincronização:', error);
    return {
      success: false,
      type,
      total: 0,
      inserted: 0,
      updated: 0,
      errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
    };
  }
}

/**
 * Sincroniza todos os arquivos do repositório FIGMA1
 */
export async function syncAllFromFIGMA1(
  onProgress?: (progress: SyncProgress) => void
): Promise<SyncResult[]> {
  const owner = 'Fabriciocypreste';
  const repo = 'FIGMA1';
  
  const files = [
    { path: 'data/filmes.json', type: 'filmes' as const },
    { path: 'data/series.json', type: 'series' as const },
    { path: 'data/canais.json', type: 'canais' as const },
    { path: 'lista.m3u', type: 'canais' as const },
  ];
  
  const results: SyncResult[] = [];
  
  console.log('🚀 Iniciando sincronização completa do repositório FIGMA1...');
  
  for (const file of files) {
    try {
      const result = await syncFile(owner, repo, file.path, file.type, onProgress);
      results.push(result);
    } catch (error) {
      console.error(`❌ Erro ao sincronizar ${file.path}:`, error);
      results.push({
        success: false,
        type: file.type,
        total: 0,
        inserted: 0,
        updated: 0,
        errors: [error instanceof Error ? error.message : 'Erro desconhecido'],
      });
    }
  }
  
  // Resumo final
  const totalInserted = results.reduce((sum, r) => sum + r.inserted, 0);
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  
  console.log('');
  console.log('========================================');
  console.log('📊 RESUMO DA SINCRONIZAÇÃO');
  console.log('========================================');
  console.log(`✅ ${totalInserted} registros sincronizados`);
  console.log(`❌ ${totalErrors} erros encontrados`);
  console.log('========================================');
  
  return results;
}
