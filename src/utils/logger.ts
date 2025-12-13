/**
 * Logger utility - controla verbosidade dos logs
 */

const IS_DEV = import.meta.env?.DEV || false;

export const logger = {
  // Logs importantes - sempre mostram
  info: (message: string, ...args: any[]) => {
    console.log(`ℹ️ ${message}`, ...args);
  },
  
  // Sucessos - sempre mostram
  success: (message: string, ...args: any[]) => {
    console.log(`✅ ${message}`, ...args);
  },
  
  // Warnings - sempre mostram
  warn: (message: string, ...args: any[]) => {
    console.warn(`⚠️ ${message}`, ...args);
  },
  
  // Erros - sempre mostram
  error: (message: string, ...args: any[]) => {
    console.error(`❌ ${message}`, ...args);
  },
  
  // Debug - só mostra em desenvolvimento
  debug: (message: string, ...args: any[]) => {
    if (IS_DEV) {
      console.log(`🐛 ${message}`, ...args);
    }
  },
  
  // Network - mostra falhas de fetch de forma mais amigável
  networkError: (context: string, error: any) => {
    // Não logar "Failed to fetch" repetidamente
    if (error?.message === 'Failed to fetch') {
      // Silencioso - não polui console
      return;
    }
    console.error(`🌐 Erro de rede em ${context}:`, error);
  },
  
  // API - mostra erros de API de forma mais amigável
  apiError: (api: string, status: number, context?: string) => {
    if (status === 401) {
      // Silencioso para 401 - API key pode estar temporariamente indisponível
      return;
    }
    if (status === 404) {
      console.warn(`🔍 ${api}: Recurso não encontrado${context ? ` (${context})` : ''}`);
      return;
    }
    console.error(`⚠️ ${api} retornou status ${status}${context ? ` (${context})` : ''}`);
  }
};
