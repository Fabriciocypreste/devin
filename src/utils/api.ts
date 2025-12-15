/**
 * REDFLIX API CLIENT
 * Cliente para comunicação com o backend local
 * Integrado com o Admin Dashboard para refletir alterações em tempo real
 */

// Backend local - mesma base de dados do Admin Dashboard
const API_BASE_URL = 'http://localhost:3333/api';

interface ApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  token?: string;
}

/**
 * Função principal para fazer requisições à API
 * Conecta ao backend local que compartilha o banco de dados com o Admin Dashboard
 */
async function apiRequest<T = any>(
  endpoint: string, 
  options: ApiOptions = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  // Adicionar token de autenticação se fornecido
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error [${method} ${endpoint}]:`, error);
    throw error;
  }
}

// ============================================
// AUTENTICAÇÃO
// ============================================

export const authApi = {
  /**
   * Criar nova conta
   */
  signup: async (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: data,
    });
  },

  /**
   * Login
   */
  signin: async (email: string, password: string) => {
    console.log('📡 [API] Chamando signin:', { email, endpoint: '/auth/signin' });
    
    const result = await apiRequest<{
      success: boolean;
      access_token: string;
      refresh_token: string;
      user: {
        id: string;
        email: string;
        name: string;
      };
    }>('/auth/signin', {
      method: 'POST',
      body: { email, password },
    });
    
    console.log('📡 [API] Resposta signin:', result);
    
    return result;
  },

  /**
   * Logout
   */
  signout: async (token: string) => {
    return apiRequest('/auth/signout', {
      method: 'POST',
      token,
    });
  },
};

// ============================================
// USUÁRIOS
// ============================================

export const usersApi = {
  /**
   * Obter dados do usuário autenticado
   */
  getMe: async (token: string) => {
    return apiRequest('/users/me', { token });
  },
};

// ============================================
// PERFIS
// ============================================

export const profilesApi = {
  /**
   * Listar perfis do usuário
   */
  list: async (token: string) => {
    return apiRequest<{ profiles: any[] }>('/profiles', { token });
  },

  /**
   * Criar novo perfil
   */
  create: async (token: string, data: {
    name: string;
    avatar_url?: string;
    is_kids?: boolean;
    pin_code?: string;
    maturity_rating?: string;
  }) => {
    return apiRequest('/profiles', {
      method: 'POST',
      token,
      body: data,
    });
  },

  /**
   * Atualizar perfil
   */
  update: async (token: string, profileId: string, data: any) => {
    return apiRequest(`/profiles/${profileId}`, {
      method: 'PUT',
      token,
      body: data,
    });
  },

  /**
   * Deletar perfil
   */
  delete: async (token: string, profileId: string) => {
    return apiRequest(`/profiles/${profileId}`, {
      method: 'DELETE',
      token,
    });
  },
};

// ============================================
// MINHA LISTA
// ============================================

export const myListApi = {
  /**
   * Listar itens da minha lista
   */
  list: async (token: string, profileId?: string) => {
    const query = profileId ? `?profile_id=${profileId}` : '';
    return apiRequest<{ items: any[] }>(`/my-list${query}`, { token });
  },

  /**
   * Adicionar item à minha lista
   */
  add: async (token: string, data: {
    content_id: string;
    content_type: 'movie' | 'tv' | 'iptv';
    profile_id?: string;
    tmdb_id?: number;
    title?: string;
    poster_url?: string;
  }) => {
    return apiRequest('/my-list', {
      method: 'POST',
      token,
      body: data,
    });
  },

  /**
   * Remover item da minha lista
   */
  remove: async (token: string, contentId: string, profileId?: string) => {
    const query = profileId ? `?profile_id=${profileId}` : '';
    return apiRequest(`/my-list/${contentId}${query}`, {
      method: 'DELETE',
      token,
    });
  },
};

// ============================================
// FAVORITOS
// ============================================

export const favoritesApi = {
  /**
   * Listar favoritos
   */
  list: async (token: string, profileId?: string) => {
    const query = profileId ? `?profile_id=${profileId}` : '';
    return apiRequest<{ favorites: any[] }>(`/favorites${query}`, { token });
  },

  /**
   * Adicionar aos favoritos
   */
  add: async (token: string, data: {
    content_id: string;
    content_type: 'movie' | 'tv' | 'iptv';
    profile_id?: string;
    tmdb_id?: number;
    title?: string;
    poster_url?: string;
  }) => {
    return apiRequest('/favorites', {
      method: 'POST',
      token,
      body: data,
    });
  },

  /**
   * Remover dos favoritos
   */
  remove: async (token: string, contentId: string, profileId?: string) => {
    const query = profileId ? `?profile_id=${profileId}` : '';
    return apiRequest(`/favorites/${contentId}${query}`, {
      method: 'DELETE',
      token,
    });
  },
};

// ============================================
// REVIEWS
// ============================================

export const reviewsApi = {
  /**
   * Listar reviews de um conteúdo
   */
  list: async (contentId: string) => {
    return apiRequest<{ reviews: any[] }>(`/reviews/${contentId}`);
  },

  /**
   * Criar review
   */
  create: async (token: string, data: {
    content_id: string;
    content_type: 'movie' | 'tv';
    rating: number;
    review_text?: string;
    profile_id?: string;
  }) => {
    return apiRequest('/reviews', {
      method: 'POST',
      token,
      body: data,
    });
  },

  /**
   * Atualizar review
   */
  update: async (token: string, reviewId: string, data: {
    rating?: number;
    review_text?: string;
  }) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      token,
      body: data,
    });
  },

  /**
   * Deletar review
   */
  delete: async (token: string, reviewId: string) => {
    return apiRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
      token,
    });
  },
};

// ============================================
// CANAIS IPTV
// ============================================

export const iptvApi = {
  /**
   * Listar canais IPTV
   */
  listChannels: async (filters?: {
    category?: string;
    subcategory?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.subcategory) params.append('subcategory', filters.subcategory);
    if (filters?.search) params.append('search', filters.search);
    
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiRequest<{ channels: any[] }>(`/iptv/channels${query}`);
  },

  /**
   * Obter detalhes de um canal
   */
  getChannel: async (slug: string) => {
    return apiRequest<{ channel: any }>(`/iptv/channels/${slug}`);
  },

  /**
   * Listar categorias
   */
  listCategories: async () => {
    return apiRequest<{ categories: any[] }>('/iptv/categories');
  },

  /**
   * Listar favoritos IPTV
   */
  listFavorites: async (token: string, profileId?: string) => {
    const query = profileId ? `?profile_id=${profileId}` : '';
    return apiRequest<{ favorites: any[] }>(`/iptv/favorites${query}`, { token });
  },

  /**
   * Adicionar canal aos favoritos
   */
  addFavorite: async (token: string, data: {
    channel_id: string;
    profile_id?: string;
  }) => {
    return apiRequest('/iptv/favorites', {
      method: 'POST',
      token,
      body: data,
    });
  },

  /**
   * Remover canal dos favoritos
   */
  removeFavorite: async (token: string, channelId: string, profileId?: string) => {
    const query = profileId ? `?profile_id=${profileId}` : '';
    return apiRequest(`/iptv/favorites/${channelId}${query}`, {
      method: 'DELETE',
      token,
    });
  },
};

// ============================================
// NOTIFICAÇÕES
// ============================================

export const notificationsApi = {
  /**
   * Listar notificações
   */
  list: async (token: string, unreadOnly = false, limit = 50) => {
    const params = new URLSearchParams();
    if (unreadOnly) params.append('unread_only', 'true');
    params.append('limit', limit.toString());
    
    return apiRequest<{ notifications: any[]; unread_count: number }>(
      `/notifications?${params.toString()}`,
      { token }
    );
  },

  /**
   * Marcar como lida
   */
  markAsRead: async (token: string, notificationId: string) => {
    return apiRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
      token,
    });
  },

  /**
   * Marcar todas como lidas
   */
  markAllAsRead: async (token: string) => {
    return apiRequest('/notifications/read-all', {
      method: 'PUT',
      token,
    });
  },

  /**
   * Deletar notificação
   */
  delete: async (token: string, notificationId: string) => {
    return apiRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
      token,
    });
  },

  /**
   * Limpar todas as lidas
   */
  clearAll: async (token: string) => {
    return apiRequest('/notifications/clear-all', {
      method: 'DELETE',
      token,
    });
  },
};

// Exportar API completa
export const api = {
  auth: authApi,
  users: usersApi,
  profiles: profilesApi,
  myList: myListApi,
  favorites: favoritesApi,
  reviews: reviewsApi,
  iptv: iptvApi,
  notifications: notificationsApi,
};

export default api;
