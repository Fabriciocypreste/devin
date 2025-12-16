/**
 * Canais Service
 * Service layer for managing IPTV channels
 */

import { parseM3U, Channel } from './m3uParser';

const M3U_URL = '/LISTAREAL.m3u';

/**
 * Load all channels from M3U file
 * @returns Promise<Channel[]> - Array of channels
 */
export async function loadCanais(): Promise<Channel[]> {
  try {
    console.log('📺 Loading channels from M3U...');
    const channels = await parseM3U(M3U_URL);
    console.log(`✅ Loaded ${channels.length} channels`);
    return channels;
  } catch (error) {
    console.error('❌ Error loading channels:', error);
    return [];
  }
}

/**
 * Get list of unique categories from channels
 * @param canais - Array of channels
 * @returns string[] - Array of category names
 */
export function getCategories(canais: Channel[]): string[] {
  const categories = canais.map(c => c.group).filter(g => g);
  const uniqueCategories = Array.from(new Set(categories)).sort();
  return ['Todas', ...uniqueCategories];
}

/**
 * Filter channels by search term and category
 * @param canais - Array of channels
 * @param search - Search term
 * @param category - Category filter
 * @returns Channel[] - Filtered channels
 */
export function filterCanais(
  canais: Channel[],
  search: string,
  category: string
): Channel[] {
  let filtered = canais;

  // Filter by search term
  if (search && search.trim()) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(c =>
      c.name.toLowerCase().includes(searchLower)
    );
  }

  // Filter by category
  if (category && category !== 'Todas') {
    filtered = filtered.filter(c => c.group === category);
  }

  return filtered;
}
