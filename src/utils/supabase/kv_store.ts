/**
 * KV Store - Frontend Client for Supabase Key-Value Storage
 * This is a lightweight wrapper to interact with the kv_store table
 */

import { projectId, publicAnonKey } from './info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;

interface KVResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get a single value by key
 */
export async function get(key: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/kv/${encodeURIComponent(key)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`KV Store: Failed to get key "${key}"`, response.statusText);
      return null;
    }

    const result: KVResponse = await response.json();
    return result.data ?? null;
  } catch (error) {
    console.error(`KV Store: Error getting key "${key}"`, error);
    return null;
  }
}

/**
 * Set a single key-value pair
 */
export async function set(key: string, value: any): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/kv/${encodeURIComponent(key)}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ value }),
    });

    if (!response.ok) {
      console.error(`KV Store: Failed to set key "${key}"`, response.statusText);
    }
  } catch (error) {
    console.error(`KV Store: Error setting key "${key}"`, error);
  }
}

/**
 * Delete a single key
 */
export async function del(key: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/kv/${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`KV Store: Failed to delete key "${key}"`, response.statusText);
    }
  } catch (error) {
    console.error(`KV Store: Error deleting key "${key}"`, error);
  }
}

/**
 * Get multiple values by keys
 */
export async function mget(keys: string[]): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/kv/mget`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys }),
    });

    if (!response.ok) {
      console.error('KV Store: Failed to mget keys', response.statusText);
      return [];
    }

    const result: KVResponse<any[]> = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error('KV Store: Error in mget', error);
    return [];
  }
}

/**
 * Set multiple key-value pairs
 */
export async function mset(keys: string[], values: any[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/kv/mset`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys, values }),
    });

    if (!response.ok) {
      console.error('KV Store: Failed to mset keys', response.statusText);
    }
  } catch (error) {
    console.error('KV Store: Error in mset', error);
  }
}

/**
 * Delete multiple keys
 */
export async function mdel(keys: string[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/kv/mdel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ keys }),
    });

    if (!response.ok) {
      console.error('KV Store: Failed to mdel keys', response.statusText);
    }
  } catch (error) {
    console.error('KV Store: Error in mdel', error);
  }
}

/**
 * Get all values with keys matching a prefix
 */
export async function getByPrefix(prefix: string): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/kv/prefix/${encodeURIComponent(prefix)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error(`KV Store: Failed to get by prefix "${prefix}"`, response.statusText);
      return [];
    }

    const result: KVResponse<any[]> = await response.json();
    return result.data ?? [];
  } catch (error) {
    console.error(`KV Store: Error getting by prefix "${prefix}"`, error);
    return [];
  }
}

/**
 * Check if KV Store is available
 */
export async function isAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('KV Store: Connection check failed', error);
    return false;
  }
}

// Export default object with all methods
export default {
  get,
  set,
  del,
  mget,
  mset,
  mdel,
  getByPrefix,
  isAvailable,
};
