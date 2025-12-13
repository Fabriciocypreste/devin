/**
 * Service Worker para RedFlix
 * Implementa cache inteligente de recursos estáticos e imagens
 */

const CACHE_VERSION = 'redflix-v1.0.0';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Recursos para cache inicial (precache)
const STATIC_RESOURCES = [
  '/',
  '/index.html',
  '/styles/globals.css',
  '/vite.svg',
  'https://chemorena.com/redfliz.png', // Logo principal
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  // Cache First (imagens e assets estáticos)
  cacheFirst: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      console.error('Fetch failed:', error);
      throw error;
    }
  },
  
  // Network First (APIs e dados dinâmicos)
  networkFirst: async (request, cacheName) => {
    try {
      const networkResponse = await fetch(request);
      if (networkResponse.ok) {
        const cache = await caches.open(cacheName);
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    } catch (error) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
      throw error;
    }
  },
  
  // Stale While Revalidate (melhor para atualizações frequentes)
  staleWhileRevalidate: async (request, cacheName) => {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        cache.put(request, networkResponse.clone());
      }
      return networkResponse;
    });
    
    return cachedResponse || fetchPromise;
  },
};

// Install - Precache recursos estáticos
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('📦 Service Worker: Precaching recursos estáticos');
      return cache.addAll(STATIC_RESOURCES);
    })
  );
  
  // Forçar ativação imediata
  self.skipWaiting();
});

// Activate - Limpar caches antigos
self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== IMAGE_CACHE && cacheName !== API_CACHE) {
            console.log('🗑️ Service Worker: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Assumir controle imediato
  self.clients.claim();
});

// Fetch - Interceptar requisições
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorar requisições não-GET
  if (request.method !== 'GET') {
    return;
  }
  
  // Ignorar chrome-extension e outras URLs não http(s)
  if (!url.protocol.startsWith('http')) {
    return;
  }
  
  // Estratégia para imagens
  if (request.destination === 'image' || url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)$/i)) {
    event.respondWith(
      CACHE_STRATEGIES.cacheFirst(request, IMAGE_CACHE)
    );
    return;
  }
  
  // Estratégia para APIs TMDB
  if (url.hostname.includes('themoviedb.org') || url.hostname.includes('tmdb.org')) {
    event.respondWith(
      CACHE_STRATEGIES.networkFirst(request, API_CACHE)
    );
    return;
  }
  
  // Estratégia para APIs Sportmonks/TheSportsDB
  if (url.hostname.includes('sportmonks.com') || url.hostname.includes('thesportsdb.com')) {
    event.respondWith(
      CACHE_STRATEGIES.networkFirst(request, API_CACHE)
    );
    return;
  }
  
  // Estratégia para CDN de canais
  if (url.hostname.includes('cdnapp.fun') || url.hostname.includes('chemorena.com')) {
    event.respondWith(
      CACHE_STRATEGIES.staleWhileRevalidate(request, IMAGE_CACHE)
    );
    return;
  }
  
  // Estratégia para recursos estáticos (CSS, JS, fonts)
  if (request.destination === 'style' || request.destination === 'script' || request.destination === 'font') {
    event.respondWith(
      CACHE_STRATEGIES.cacheFirst(request, STATIC_CACHE)
    );
    return;
  }
  
  // Estratégia para páginas HTML
  if (request.destination === 'document') {
    event.respondWith(
      CACHE_STRATEGIES.networkFirst(request, STATIC_CACHE)
    );
    return;
  }
  
  // Padrão: Network First com fallback para cache
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request);
    })
  );
});

// Background Sync (para requisições offline)
self.addEventListener('sync', (event) => {
  console.log('🔄 Service Worker: Background sync:', event.tag);
  
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
  
  if (event.tag === 'sync-watch-history') {
    event.waitUntil(syncWatchHistory());
  }
});

// Funções de sincronização (exemplos)
async function syncFavorites() {
  try {
    // Implementar lógica de sincronização de favoritos
    console.log('✅ Favoritos sincronizados');
  } catch (error) {
    console.error('❌ Erro ao sincronizar favoritos:', error);
  }
}

async function syncWatchHistory() {
  try {
    // Implementar lógica de sincronização de histórico
    console.log('✅ Histórico sincronizado');
  } catch (error) {
    console.error('❌ Erro ao sincronizar histórico:', error);
  }
}

// Push Notifications (opcional)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  
  const options = {
    body: data.body || 'Novo conteúdo disponível!',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    vibrate: [200, 100, 200],
    tag: data.tag || 'notification',
    data: {
      url: data.url || '/',
    },
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'RedFlix', options)
  );
});

// Click em notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const url = event.notification.data.url || '/';
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Se já tiver uma janela aberta, focar nela
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }
      // Senão, abrir nova janela
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Message handling (comunicação com app)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

console.log('🚀 Service Worker carregado!');
