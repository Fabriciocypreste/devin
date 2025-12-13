import { projectId, publicAnonKey } from './supabase/info';

/**
 * Busca a lista de canais do servidor (banco de dados ou Chemorena)
 */
export async function fetchChannelsList(): Promise<string[]> {
  try {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/channels-list`;
    console.log('Fetching channels list from server...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error fetching channels list from server:', response.status, errorText);
      return [];
    }
    
    const data = await response.json();
    console.log('Channels list received:', data.items?.length || 0, 'items');
    
    return data.items || [];
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏱️ Request timeout while fetching channels list');
    } else {
      console.error('Error fetching channels list:', error);
    }
    return [];
  }
}
