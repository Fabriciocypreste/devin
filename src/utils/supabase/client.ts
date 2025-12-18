import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables. Please check your .env file.');
}

// Use empty string as fallback to allow the app to start, but auth will fail gracefully
export const supabase = createClient(
  supabaseUrl || 'https://glnmajvrxdwfyedsuaxx.supabase.co',
  supabaseAnonKey || ''
);

// Export types for database tables
export interface Filme {
  id?: number;
  title: string;
  url: string;
  poster?: string;
  description?: string;
  genre?: string;
  year?: number;
  rating?: number;
  duration?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Serie {
  id?: number;
  title: string;
  url: string;
  poster?: string;
  description?: string;
  genre?: string;
  year?: number;
  rating?: number;
  seasons?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Canal {
  id?: number;
  name: string;
  url: string;
  logo?: string;
  category?: string;
  created_at?: string;
  updated_at?: string;
}

// Database helper object for backwards compatibility
export const db = {
  filmes: {
    async getAll() {
      const { data, error } = await supabase.from('filmes').select('*');
      if (error) throw error;
      return data || [];
    },
    async insert(filme: Filme) {
      const { data, error } = await supabase.from('filmes').insert(filme).select();
      if (error) throw error;
      return data?.[0];
    },
  },
  series: {
    async getAll() {
      const { data, error } = await supabase.from('series').select('*');
      if (error) throw error;
      return data || [];
    },
    async insert(serie: Serie) {
      const { data, error } = await supabase.from('series').insert(serie).select();
      if (error) throw error;
      return data?.[0];
    },
  },
  canais: {
    async getAll() {
      const { data, error } = await supabase.from('canais').select('*');
      if (error) throw error;
      return data || [];
    },
    async insert(canal: Canal) {
      const { data, error } = await supabase.from('canais').insert(canal).select();
      if (error) throw error;
      return data?.[0];
    },
  },
};
