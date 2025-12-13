/**
 * Migration Helpers
 * Funções auxiliares para migrar dados locais para o KV Store
 */

import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;

/**
 * Migra lista de filmes/séries de dados locais para KV Store
 */
export async function migrateContentList(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    console.log('🔄 Iniciando migração da lista de conteúdo...');
    
    const response = await fetch(`${BASE_URL}/migrate-content-list`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Migration failed: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log('✅ Migração concluída:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Erro na migração de conteúdo:', error);
    throw error;
  }
}

/**
 * Migra lista de canais do Chemorena para KV Store
 */
export async function migrateChannelsList(): Promise<{ success: boolean; count: number; message: string }> {
  try {
    console.log('🔄 Iniciando migração da lista de canais...');
    
    const response = await fetch(`${BASE_URL}/migrate-channels-list`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Migration failed: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log('✅ Migração concluída:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Erro na migração de canais:', error);
    throw error;
  }
}

/**
 * Salva lista de conteúdo personalizada no KV Store
 */
export async function saveContentList(items: string[]): Promise<{ success: boolean; count: number }> {
  try {
    console.log(`💾 Salvando ${items.length} items no KV Store...`);
    
    const response = await fetch(`${BASE_URL}/content-list`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ items })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Save failed: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log('✅ Lista salva:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Erro ao salvar lista:', error);
    throw error;
  }
}

/**
 * Salva lista de canais personalizada no KV Store
 */
export async function saveChannelsList(content: string): Promise<{ success: boolean; count: number }> {
  try {
    console.log(`💾 Salvando lista de canais (${content.length} caracteres)...`);
    
    const response = await fetch(`${BASE_URL}/channels-list`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Save failed: ${response.status} - ${error}`);
    }
    
    const result = await response.json();
    console.log('✅ Lista de canais salva:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Erro ao salvar canais:', error);
    throw error;
  }
}

/**
 * Executa migração completa (conteúdo + canais)
 */
export async function migrateAll(): Promise<{
  content: { success: boolean; count: number };
  channels: { success: boolean; count: number };
}> {
  console.log('🚀 Iniciando migração completa...');
  
  const results = {
    content: { success: false, count: 0 },
    channels: { success: false, count: 0 }
  };
  
  try {
    // Migrar conteúdo
    const contentResult = await migrateContentList();
    results.content = contentResult;
    console.log(`✅ Conteúdo: ${contentResult.count} items migrados`);
  } catch (error) {
    console.error('❌ Falha na migração de conteúdo:', error);
  }
  
  try {
    // Migrar canais
    const channelsResult = await migrateChannelsList();
    results.channels = channelsResult;
    console.log(`✅ Canais: ${channelsResult.count} items migrados`);
  } catch (error) {
    console.error('❌ Falha na migração de canais:', error);
  }
  
  console.log('🎉 Migração completa finalizada!', results);
  
  return results;
}

/**
 * Verifica status do KV Store
 */
export async function checkKVStatus(): Promise<{
  contentListExists: boolean;
  channelsListExists: boolean;
  contentCount: number;
  channelsCount: number;
}> {
  try {
    // Verificar content list
    const contentResponse = await fetch(`${BASE_URL}/content-list`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    const contentData = await contentResponse.json();
    
    // Verificar channels list
    const channelsResponse = await fetch(`${BASE_URL}/channels-list`, {
      headers: { 'Authorization': `Bearer ${publicAnonKey}` }
    });
    const channelsData = await channelsResponse.json();
    
    return {
      contentListExists: contentData.source === 'kv-store',
      channelsListExists: channelsData.source === 'kv-store',
      contentCount: contentData.count || 0,
      channelsCount: channelsData.count || 0
    };
  } catch (error) {
    console.error('❌ Erro ao verificar status do KV:', error);
    throw error;
  }
}
