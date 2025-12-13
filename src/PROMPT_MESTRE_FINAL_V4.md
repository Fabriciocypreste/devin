# 🎬 PROMPT MESTRE FINAL V4 — RedFlix IPTV

**Versão:** 4.0  
**Data:** 08 de Novembro de 2025  
**Projeto:** RedFlix - Plataforma de Streaming Completa  
**Status:** ✅ ESPECIFICAÇÃO COMPLETA  

---

## 🚨 INSTRUÇÕES PRIORITÁRIAS

### ❌ PROIBIÇÕES ABSOLUTAS:

```
🔴 NÃO modificar o layout existente
🔴 NÃO alterar menus, fontes, cores ou espaçamento
🔴 NÃO mudar o design visual RedFlix original
🔴 NÃO adicionar novos elementos visuais não solicitados
🔴 NÃO remover funcionalidades existentes
```

### ✅ PERMISSÕES:

```
✅ Adicionar novas funções técnicas (Supabase, M3U, Player)
✅ Implementar carregamento completo de dados
✅ Otimizar performance e cache
✅ Corrigir bugs técnicos
✅ Adicionar logs de debug
```

### 🖼️ PADRÃO DE IMAGENS:

```
📐 Tamanho FIXO: 244 × 137 px
📐 Aspect Ratio: 16:9
📐 Formato: WebP com fallback JPG
📐 Qualidade: 85%
📐 Lazy Loading: Ativado
📐 Fallback: sem_logo.png
```

---

## 🎯 OBJETIVO PRINCIPAL

Atualizar o projeto RedFlix IPTV com as seguintes integrações técnicas:

1. **Player HLS Completo** - Reprodução de .ts e .m3u8
2. **Integração Supabase** - Cache e sincronização
3. **Parser M3U Total** - Leitura completa de listas remotas
4. **Performance Otimizada** - Cache em 3 camadas
5. **Filtros e Menus Originais** - Sem alteração visual

**SEM ALTERAR O VISUAL DO SITE.**

---

## 📋 MENU PRINCIPAL (MANTER EXATAMENTE)

```
┌─────────────────────────────────────────────────┐
│  MENU NAVEGAÇÃO - NÃO ALTERAR                   │
├─────────────────────────────────────────────────┤
│  1. Início                                      │
│  2. Séries                                      │
│  3. Filmes                                      │
│  4. Bombando                                    │
│  5. Navegar por idiomas                         │
│  6. Canais                                      │
│  7. Futebol                                     │
│  8. Minha lista                                 │
└─────────────────────────────────────────────────┘
```

**Componente:** `NetflixHeader.tsx`  
**Localização:** Desktop (Sidebar) + Mobile (Bottom Nav)  
**Cores:** Fundo #000000, Destaque #E50914, Texto #FFFFFF  

---

## ⚙️ FUNCIONALIDADES A IMPLEMENTAR

### 1️⃣ Player Embutido (HLS)

**Arquivo:** `/components/IPTVPlayer.tsx`

**Características:**

```tsx
import Hls from 'hls.js';

interface PlayerProps {
  channelName: string;
  channelUrl: string;
  channelLogo: string;
  channelGroup: string;
  onClose: () => void;
}

// Funcionalidades:
✅ Reproduz canais .ts e .m3u8 com autoplay
✅ Mostra logo, nome e grupo do canal no topo
✅ Controles: play/pause, volume, fullscreen
✅ Botão ⭐ favoritar canal
✅ Fechar modal com ESC ou botão X
✅ Erro handling com retry automático
✅ Loading spinner durante carregamento
✅ Suporte a múltiplos formatos (HLS, DASH, MP4)
```

**Implementação:**

```tsx
const PlayerModal = ({ channel, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  useEffect(() => {
    if (!videoRef.current) return;
    
    const video = videoRef.current;
    
    // Se o navegador suporta HLS nativamente (Safari)
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = channel.url;
      video.play();
    }
    // Usar hls.js para outros navegadores
    else if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });
      
      hls.loadSource(channel.url);
      hls.attachMedia(video);
      
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
      
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              console.error('HLS Error:', data);
          }
        }
      });
      
      hlsRef.current = hls;
    }
    
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [channel.url]);
  
  // ... resto do componente
};
```

**Layout do Player:**

```tsx
<div className="fixed inset-0 bg-black z-50 flex flex-col">
  {/* Header */}
  <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent">
    <div className="flex items-center gap-4">
      <img src={channel.logo} alt={channel.name} className="w-12 h-12" />
      <div>
        <h2 className="text-white font-bold text-xl">{channel.name}</h2>
        <p className="text-gray-400 text-sm">{channel.group}</p>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button className="p-2 hover:bg-white/10 rounded">⭐</button>
      <button onClick={onClose} className="p-2 hover:bg-white/10 rounded">✕</button>
    </div>
  </div>
  
  {/* Video */}
  <div className="flex-1 flex items-center justify-center">
    <video
      ref={videoRef}
      controls
      autoPlay
      className="w-full h-full"
    />
  </div>
</div>
```

---

### 2️⃣ Supabase (Cache + Sincronização)

**Arquivo:** `/utils/supabase/client.ts`

**Tabela:** `conteudo`

**Schema:**

```sql
CREATE TABLE conteudo (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  grupo TEXT,
  url TEXT NOT NULL,
  tipo TEXT, -- 'canal', 'filme', 'serie'
  logo TEXT,
  poster TEXT,
  favorito BOOLEAN DEFAULT FALSE,
  atualizado_em TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_conteudo_grupo ON conteudo(grupo);
CREATE INDEX idx_conteudo_tipo ON conteudo(tipo);
CREATE INDEX idx_conteudo_favorito ON conteudo(favorito);
CREATE INDEX idx_conteudo_nome ON conteudo(nome);
```

**Fluxo de Dados:**

```
┌─────────────────────────────────────────────┐
│  FLUXO DE CARREGAMENTO (3 CAMADAS)         │
├─────────────────────────────────────────────┤
│                                             │
│  1. IndexedDB (Local Cache)                 │
│     ↓ (se vazio)                            │
│  2. Supabase (Cloud Cache)                  │
│     ↓ (se vazio)                            │
│  3. HTTP (Lista M3U Remota)                 │
│     ↓                                       │
│  Salvar em: Supabase → IndexedDB           │
│                                             │
└─────────────────────────────────────────────┘
```

**Implementação:**

```tsx
// utils/carregarListaSupabase.ts

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function carregarConteudo() {
  console.log('🚀 RedFlix IPTV iniciado');
  console.log('📡 Buscando conteúdo no Supabase...');
  
  // 1. Tentar buscar do Supabase
  const { data: supabaseData, error } = await supabase
    .from('conteudo')
    .select('*')
    .order('nome');
  
  if (!error && supabaseData && supabaseData.length > 0) {
    console.log(`✅ ${supabaseData.length} canais carregados do Supabase`);
    return supabaseData;
  }
  
  // 2. Se Supabase vazio, carregar da URL remota
  console.log('⚠️ Supabase vazio — carregando playlist remota');
  
  const url = 'http://api.cdnapp.fun:80/playlist/new_app/Q24Wb98eYc/m3u_plus';
  const canais = await parseM3UFromUrl(url);
  
  console.log(`✅ ${canais.length} canais processados`);
  console.log('💾 Sincronizando com Supabase...');
  
  // 3. Salvar no Supabase
  const { error: insertError } = await supabase
    .from('conteudo')
    .insert(
      canais.map(canal => ({
        nome: canal.name,
        grupo: canal.group,
        url: canal.url,
        tipo: 'canal',
        logo: canal.logo || null,
        atualizado_em: new Date().toISOString()
      }))
    );
  
  if (!insertError) {
    console.log('✅ Banco atualizado');
  }
  
  return canais;
}
```

**Sincronização Automática:**

```tsx
// Sincronizar a cada 12 horas
const SYNC_INTERVAL = 12 * 60 * 60 * 1000; // 12 horas

useEffect(() => {
  const syncInterval = setInterval(async () => {
    console.log('🔄 Sincronização automática iniciada...');
    await carregarConteudo();
  }, SYNC_INTERVAL);
  
  return () => clearInterval(syncInterval);
}, []);
```

---

### 3️⃣ Parser M3U (Completo)

**Arquivo:** `/utils/m3uParser.ts`

**Características:**

```
✅ Lê 100% da lista M3U
✅ Sem limite de linhas
✅ Suporte a listas grandes (10k+ canais)
✅ Streaming incremental (não carrega tudo na memória)
✅ Extrai: nome, grupo, logo, URL
✅ Performance otimizada
```

**Implementação Completa:**

```tsx
interface Channel {
  name: string;
  group: string;
  logo: string;
  url: string;
}

export async function parseM3UFromUrl(url: string): Promise<Channel[]> {
  console.log('📡 Iniciando download da lista M3U...');
  
  const response = await fetch(url, { 
    cache: 'no-store',
    headers: {
      'User-Agent': 'RedFlix/4.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  // Usar streaming para listas grandes
  const reader = response.body!.getReader();
  const decoder = new TextDecoder('utf-8');
  
  let buffer = '';
  let channels: Channel[] = [];
  let currentChannel: Partial<Channel> = {};
  let lineCount = 0;
  
  while (true) {
    const { done, value } = await reader.read();
    
    if (done) break;
    
    buffer += decoder.decode(value, { stream: true });
    
    // Processar linhas completas
    let lineEnd;
    while ((lineEnd = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, lineEnd).trim();
      buffer = buffer.slice(lineEnd + 1);
      
      lineCount++;
      
      // Log de progresso a cada 1000 linhas
      if (lineCount % 1000 === 0) {
        console.log(`📊 Processando linha ${lineCount}...`);
      }
      
      // Ignorar linhas vazias e comentários
      if (!line || line.startsWith('#EXTM3U')) continue;
      
      // Parse #EXTINF
      if (line.startsWith('#EXTINF:')) {
        // Extrair nome
        const nameMatch = line.match(/,(.+)$/);
        if (nameMatch) {
          currentChannel.name = nameMatch[1].trim();
        }
        
        // Extrair grupo
        const groupMatch = line.match(/group-title="([^"]+)"/);
        if (groupMatch) {
          currentChannel.group = groupMatch[1];
        }
        
        // Extrair logo
        const logoMatch = line.match(/tvg-logo="([^"]+)"/);
        if (logoMatch) {
          currentChannel.logo = logoMatch[1];
        }
      }
      // Parse URL do canal
      else if (line.startsWith('http')) {
        currentChannel.url = line;
        
        // Adicionar canal completo
        if (currentChannel.name && currentChannel.url) {
          channels.push({
            name: currentChannel.name,
            group: currentChannel.group || 'Sem Categoria',
            logo: currentChannel.logo || 'sem_logo.png',
            url: currentChannel.url
          });
        }
        
        // Reset para próximo canal
        currentChannel = {};
      }
    }
  }
  
  // Processar buffer final
  if (buffer.trim()) {
    // ... processar última linha
  }
  
  console.log(`✅ ${channels.length} canais extraídos`);
  console.log(`📊 ${lineCount} linhas processadas`);
  
  return channels;
}
```

**Otimização para Listas Gigantes:**

```tsx
// Processar em batches para não travar a UI
export async function parseM3UInBatches(
  url: string,
  onProgress: (count: number) => void
): Promise<Channel[]> {
  const BATCH_SIZE = 100;
  const channels: Channel[] = [];
  
  // ... código de parsing ...
  
  // A cada 100 canais, fazer yield
  if (channels.length % BATCH_SIZE === 0) {
    await new Promise(resolve => setTimeout(resolve, 0));
    onProgress(channels.length);
  }
  
  return channels;
}
```

---

### 4️⃣ Imagens e Layout

**REGRA ABSOLUTA:**

```
📐 TODAS as imagens devem ter: 244 × 137 px
```

**Componente:** `/components/MediaCard.tsx`

```tsx
interface MediaCardProps {
  title: string;
  image: string;
  onClick: () => void;
}

export function MediaCard({ title, image, onClick }: MediaCardProps) {
  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer transition-transform hover:scale-105"
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-md">
        <img
          src={image || 'sem_logo.png'}
          alt={title}
          width={244}
          height={137}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = 'sem_logo.png';
          }}
        />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-white mt-2 text-sm truncate">
        {title}
      </h3>
    </div>
  );
}
```

**Grid Responsivo:**

```css
/* globals.css */

.media-grid {
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

/* Mobile: 2 colunas */
@media (min-width: 320px) {
  .media-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablet: 4 colunas */
@media (min-width: 768px) {
  .media-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Desktop: 6 colunas */
@media (min-width: 1024px) {
  .media-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
```

**Lazy Loading + Infinite Scroll:**

```tsx
import { useInView } from 'react-intersection-observer';

export function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  });
  
  useEffect(() => {
    if (inView && !loading) {
      loadMoreChannels();
    }
  }, [inView]);
  
  async function loadMoreChannels() {
    setLoading(true);
    const newChannels = await fetchChannels(page);
    setChannels(prev => [...prev, ...newChannels]);
    setPage(prev => prev + 1);
    setLoading(false);
  }
  
  return (
    <div>
      <div className="media-grid">
        {channels.map(channel => (
          <MediaCard key={channel.id} {...channel} />
        ))}
      </div>
      
      {/* Trigger para carregar mais */}
      <div ref={ref} className="h-20 flex items-center justify-center">
        {loading && <p className="text-white">Carregando mais canais...</p>}
      </div>
    </div>
  );
}
```

---

### 5️⃣ Performance

**Cache em 3 Camadas:**

```
┌────────────────────────────────────────┐
│  ARQUITETURA DE CACHE                  │
├────────────────────────────────────────┤
│                                        │
│  Layer 1: Memory Cache (React State)   │
│           ↓ Miss                       │
│  Layer 2: IndexedDB (Local Storage)    │
│           ↓ Miss                       │
│  Layer 3: Supabase (Cloud Database)    │
│           ↓ Miss                       │
│  Layer 4: Remote M3U (HTTP)            │
│                                        │
└────────────────────────────────────────┘
```

**Implementação IndexedDB:**

```tsx
// utils/cacheLocal.ts

const DB_NAME = 'RedFlixDB';
const STORE_NAME = 'channels';
const DB_VERSION = 1;

class CacheLocal {
  private db: IDBDatabase | null = null;
  
  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('nome', 'nome', { unique: false });
          store.createIndex('grupo', 'grupo', { unique: false });
        }
      };
    });
  }
  
  async save(channels: Channel[]) {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    // Limpar store antes de salvar
    await store.clear();
    
    // Salvar canais
    for (const channel of channels) {
      await store.add(channel);
    }
    
    return tx.complete;
  }
  
  async getAll(): Promise<Channel[]> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
  
  async getByGroup(group: string): Promise<Channel[]> {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const index = store.index('grupo');
    
    return new Promise((resolve, reject) => {
      const request = index.getAll(group);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const cacheLocal = new CacheLocal();
```

**Pré-carregamento de Imagens:**

```tsx
// utils/imagePreloader.ts

export async function preloadImages(images: string[], priority: number = 5) {
  const priorityImages = images.slice(0, priority);
  const otherImages = images.slice(priority);
  
  // Pré-carregar imagens prioritárias imediatamente
  await Promise.all(
    priorityImages.map(src => 
      new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      })
    )
  );
  
  // Pré-carregar outras imagens em segundo plano
  otherImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}
```

**Otimizações de Renderização:**

```tsx
// Virtualização de lista para milhares de itens
import { FixedSizeGrid } from 'react-window';

export function VirtualizedChannelGrid({ channels }: Props) {
  const columnCount = 6;
  const rowCount = Math.ceil(channels.length / columnCount);
  
  const Cell = ({ columnIndex, rowIndex, style }: any) => {
    const index = rowIndex * columnCount + columnIndex;
    const channel = channels[index];
    
    if (!channel) return null;
    
    return (
      <div style={style}>
        <MediaCard {...channel} />
      </div>
    );
  };
  
  return (
    <FixedSizeGrid
      columnCount={columnCount}
      columnWidth={250}
      height={window.innerHeight - 200}
      rowCount={rowCount}
      rowHeight={200}
      width={window.innerWidth}
    >
      {Cell}
    </FixedSizeGrid>
  );
}
```

---

## 🧩 ESTRUTURA DO PROJETO

```
RedFlix_IPTV/
├── src/
│   ├── components/
│   │   ├── PlayerModal.tsx              ✅ Novo (Player HLS)
│   │   ├── CanaisPage.tsx               ✅ Atualizado (Grid + Filtros)
│   │   ├── MediaCard.tsx                ✅ Novo (Card 244×137)
│   │   ├── NetflixHeader.tsx            ⚠️ Manter igual
│   │   ├── BottomNavBar.tsx             ⚠️ Manter igual
│   │   ├── IPTVPlayer.tsx               ✅ Atualizado (HLS.js)
│   │   └── IPTVPage.tsx                 ✅ Atualizado
│   │
│   ├── utils/
│   │   ├── supabaseClient.ts            ✅ Novo
│   │   ├── parseM3U.ts                  ✅ Atualizado (streaming)
│   │   ├── carregarListaSupabase.ts     ✅ Novo
│   │   ├── cacheLocal.ts                ✅ Novo (IndexedDB)
│   │   ├── imagePreloader.ts            ✅ Existente
│   │   ├── tmdb.ts                      ⚠️ Manter
│   │   └── contentUrls.ts               ⚠️ Manter
│   │
│   ├── pages/ (ou components/)
│   │   ├── HomePage.tsx                 ⚠️ Manter original
│   │   ├── SeriesPage.tsx               ⚠️ Manter original
│   │   ├── MoviesPage.tsx               ⚠️ Manter original
│   │   ├── BombandoPage.tsx             ⚠️ Manter original
│   │   ├── LanguageBrowsePage.tsx       ⚠️ Manter original
│   │   ├── CanaisPage.tsx               ✅ Atualizar (IPTV)
│   │   ├── SoccerPage.tsx               ⚠️ Manter original
│   │   └── MyListPage.tsx               ⚠️ Manter original
│   │
│   ├── App.tsx                          ⚠️ Manter layout + rotas
│   ├── main.tsx                         ⚠️ Manter
│   └── index.html                       ⚠️ Manter
│
├── public/
│   ├── data/
│   │   ├── canais.json                  ✅ Fallback local
│   │   └── lista.m3u                    ✅ Fallback local
│   └── sem_logo.png                     ✅ Novo (fallback)
│
├── styles/
│   └── globals.css                      ⚠️ Apenas adicionar grid
│
├── supabase/
│   ├── migrations/
│   │   └── create_conteudo_table.sql    ✅ Novo
│   └── functions/
│       └── server/
│           └── index.tsx                ⚠️ Manter
│
├── package.json                         ✅ Adicionar hls.js
├── vite.config.ts                       ⚠️ Manter
└── README.md                            ✅ Atualizar docs
```

---

## 🧪 LOGS ESPERADOS NO CONSOLE

**Sequência de Inicialização:**

```
🚀 RedFlix IPTV iniciado
📡 Buscando conteúdo no Supabase...

--- Cenário 1: Supabase com dados ---
✅ 8.421 canais carregados do Supabase
💾 Salvando em IndexedDB...
✅ Cache local atualizado
🎬 Renderizando canais no grid

--- Cenário 2: Supabase vazio ---
⚠️ Supabase vazio — carregando playlist remota
📡 Iniciando download da lista M3U...
📊 Processando linha 1000...
📊 Processando linha 2000...
📊 Processando linha 5000...
📊 Processando linha 8000...
✅ 8.421 canais extraídos
📊 8.421 linhas processadas
💾 Sincronizando com Supabase...
✅ Banco atualizado
💾 Salvando em IndexedDB...
✅ Cache local atualizado
🎬 Renderizando canais no grid
```

**Durante Uso:**

```
👆 Canal selecionado: Globo HD
🎬 Abrindo player...
📺 URL: http://...stream.m3u8
✅ HLS carregado com sucesso
▶️ Reproduzindo...

--- Se houver erro ---
❌ Erro ao carregar stream
🔄 Tentando novamente... (1/3)
```

---

## 🧠 TESTE DE CONEXÃO

### 1️⃣ Teste Supabase

```tsx
// Test em DevTools Console

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://seu-projeto.supabase.co',
  'sua-anon-key'
);

const { data, error } = await supabase
  .from('conteudo')
  .select('*')
  .limit(1);

console.log('Conectado?', !error);
console.log('Dados:', data);
```

### 2️⃣ Teste Parser M3U

```tsx
// Test em DevTools Console

import { parseM3UFromUrl } from './utils/parseM3U';

const url = 'http://api.cdnapp.fun:80/playlist/new_app/Q24Wb98eYc/m3u_plus';
const canais = await parseM3UFromUrl(url);

console.log(`Total de canais: ${canais.length}`);
console.log('Primeiro canal:', canais[0]);
```

### 3️⃣ Teste Player

```tsx
// Clique em qualquer card de canal
// Verifique:
✅ Modal abre?
✅ Logo do canal aparece?
✅ Nome e grupo corretos?
✅ Vídeo começa a tocar?
✅ Controles funcionam?
✅ Botão fechar funciona?
```

### 4️⃣ Teste IndexedDB

```tsx
// DevTools → Application → IndexedDB → RedFlixDB

// Verificar:
✅ Banco criado?
✅ Store 'channels' existe?
✅ Dados salvos?
✅ Índices criados (nome, grupo)?
```

---

## 🎨 DESIGN (MANTER 100% ORIGINAL)

**Cores:**

```css
/* NÃO ALTERAR */
--bg-primary: #000000;     /* Fundo principal */
--bg-secondary: #141414;   /* Fundo secundário */
--accent-red: #E50914;     /* Vermelho RedFlix */
--text-white: #FFFFFF;     /* Texto principal */
--text-gray: #808080;      /* Texto secundário */
--hover-bg: #2A2A2A;       /* Hover background */
```

**Fontes:**

```css
/* NÃO ALTERAR */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Pesos */
.font-regular { font-weight: 400; }
.font-medium { font-weight: 500; }
.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.font-extrabold { font-weight: 800; }
```

**Espaçamentos:**

```css
/* NÃO ALTERAR */
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2rem;     /* 32px */
--spacing-xl: 3rem;     /* 48px */
```

**Animações (Hover dos Cards):**

```css
/* MANTER EXATAMENTE ASSIM */
.media-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.media-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(229, 9, 20, 0.3);
}
```

**Layout:**

```
┌──────────────────────────────────────────┐
│  Header (NetflixHeader.tsx)              │
│  - Logo RedFlix                          │
│  - Menu navegação                        │
│  - Busca / Perfil                        │
├──────────────────────────────────────────┤
│                                          │
│  Content Area                            │
│  - Hero Slider (Home)                    │
│  - Content Rows                          │
│  - Canais Grid (IPTV)                    │
│                                          │
├──────────────────────────────────────────┤
│  Bottom Nav (Mobile)                     │
│  - Início | Séries | Filmes | etc        │
└──────────────────────────────────────────┘
```

---

## 🧩 SEGURANÇA

### Variáveis de Ambiente:

```env
# .env (NÃO COMMITAR)

# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ... (somente anon key no frontend)

# TMDB
VITE_TMDB_API_KEY=seu-api-key

# Lista M3U
VITE_M3U_URL=http://api.cdnapp.fun:80/playlist/new_app/Q24Wb98eYc/m3u_plus
```

**⚠️ NUNCA expor:**

```
❌ SUPABASE_SERVICE_ROLE_KEY (apenas backend)
❌ Senhas de banco de dados
❌ Tokens privados
```

### RLS (Row Level Security) no Supabase:

```sql
-- Habilitar RLS
ALTER TABLE conteudo ENABLE ROW LEVEL SECURITY;

-- Política: Leitura pública
CREATE POLICY "Leitura pública"
ON conteudo
FOR SELECT
TO public
USING (true);

-- Política: Inserção autenticada (opcional)
CREATE POLICY "Inserção autenticada"
ON conteudo
FOR INSERT
TO authenticated
WITH CHECK (true);
```

---

## 💬 RESUMO PARA IA

**Objetivo:**

> Atualizar o RedFlix IPTV com todas as funções IPTV (Supabase + Player HLS + Parser M3U completo), **mantendo 100% do layout e menus originais**.

**Regras Absolutas:**

1. ✅ **NÃO MODIFICAR** layout, cores, fontes, espaçamentos
2. ✅ **MANTER** todos os menus e navegação originais
3. ✅ **ADICIONAR** apenas funcionalidades técnicas (Supabase, Player, Parser)
4. ✅ **FIXAR** todas as imagens em 244 × 137 px
5. ✅ **PRESERVAR** design idêntico ao RedFlix original

**Menu Principal (não alterar):**

```
Início | Séries | Filmes | Bombando | Navegar por idiomas | Canais | Futebol | Minha lista
```

**Funcionalidades a Adicionar:**

1. Player HLS completo (hls.js)
2. Integração Supabase (cache + sincronização)
3. Parser M3U completo (sem limite de linhas)
4. Cache em 3 camadas (Memory + IndexedDB + Supabase)
5. Performance otimizada (lazy loading, infinite scroll)

**Resultado Esperado:**

- ✅ Site visualmente idêntico ao original
- ✅ Todas as funcionalidades IPTV funcionando
- ✅ Performance < 3s para carregar
- ✅ Suporte a 10.000+ canais
- ✅ Cache local funcional
- ✅ Player HLS robusto

---

## 📚 RECURSOS NECESSÁRIOS

### Pacotes NPM:

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "@supabase/supabase-js": "^2.38.4",
    "hls.js": "^1.4.12",
    "react-intersection-observer": "^9.5.3",
    "react-window": "^1.8.10"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "typescript": "^5.2.2"
  }
}
```

### Assets Necessários:

```
public/
├── sem_logo.png           ✅ (244×137px, fallback para logos)
├── redflix-logo.png       ✅ (logo principal)
└── data/
    ├── canais.json        ✅ (fallback local)
    └── lista.m3u          ✅ (fallback local)
```

---

## 🎯 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Setup Inicial

- [ ] Instalar hls.js: `npm install hls.js`
- [ ] Instalar Supabase: `npm install @supabase/supabase-js`
- [ ] Criar arquivo `.env` com variáveis
- [ ] Configurar Supabase (projeto + tabela)
- [ ] Testar conexão Supabase

### Fase 2: Parser M3U

- [ ] Criar `/utils/parseM3U.ts`
- [ ] Implementar streaming incremental
- [ ] Testar com lista remota
- [ ] Adicionar logs de progresso
- [ ] Tratar erros de rede

### Fase 3: Cache Sistema

- [ ] Criar `/utils/cacheLocal.ts` (IndexedDB)
- [ ] Criar `/utils/carregarListaSupabase.ts`
- [ ] Implementar fluxo de 3 camadas
- [ ] Testar sincronização
- [ ] Adicionar auto-sync (12h)

### Fase 4: Player HLS

- [ ] Atualizar `/components/IPTVPlayer.tsx`
- [ ] Implementar hls.js
- [ ] Adicionar controles
- [ ] Testar com streams .ts e .m3u8
- [ ] Adicionar error handling

### Fase 5: UI Canais

- [ ] Criar `/components/MediaCard.tsx` (244×137)
- [ ] Atualizar `/components/CanaisPage.tsx`
- [ ] Implementar grid responsivo
- [ ] Adicionar lazy loading
- [ ] Adicionar infinite scroll

### Fase 6: Testes

- [ ] Testar carregamento completo
- [ ] Testar player com múltiplos canais
- [ ] Testar cache (offline)
- [ ] Testar performance (10k+ canais)
- [ ] Verificar layout original preservado

### Fase 7: Otimizações

- [ ] Pré-carregar imagens prioritárias
- [ ] Virtualizar lista de canais
- [ ] Otimizar bundle (code splitting)
- [ ] Adicionar service worker (PWA)
- [ ] Medir performance (< 3s)

---

## 🚀 DEPLOYMENT

### Build de Produção:

```bash
# Build
npm run build

# Preview
npm run preview

# Deploy (Vercel)
vercel deploy --prod

# Deploy (Netlify)
netlify deploy --prod --dir=dist
```

### Variáveis no Deploy:

```
VITE_SUPABASE_URL=https://...
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_TMDB_API_KEY=...
VITE_M3U_URL=http://...
```

---

## 📊 MÉTRICAS DE SUCESSO

```
┌────────────────────────────────────────┐
│  OBJETIVOS DE PERFORMANCE              │
├────────────────────────────────────────┤
│  ⏱️  Tempo carregamento: < 3s          │
│  📊 Canais suportados: 10.000+         │
│  💾 Cache hit rate: > 90%              │
│  🎬 Player latência: < 500ms           │
│  📱 Mobile FPS: > 60                   │
│  🖼️  Imagens lazy load: 100%           │
│  ♿ Lighthouse Score: > 90             │
└────────────────────────────────────────┘
```

---

## 🎬 EXEMPLO DE USO

### Fluxo do Usuário:

```
1. Usuário abre o app
   └─> RedFlix carrega do cache local (< 1s)

2. Usuário clica em "Canais"
   └─> Grid de canais aparece (imagens lazy load)

3. Usuário clica em um canal
   └─> Player modal abre
   └─> Stream começa em < 2s

4. Usuário assiste ao canal
   └─> Controles disponíveis
   └─> Pode favoritar
   └─> Pode fechar (ESC ou X)

5. App sincroniza em background
   └─> A cada 12 horas
   └─> Atualiza Supabase → IndexedDB
```

---

## 🐛 TROUBLESHOOTING

### Problema: Canais não carregam

```
1. Verificar console:
   - Procurar "🚀 RedFlix IPTV iniciado"
   - Verificar se há erros de rede

2. Testar Supabase:
   - DevTools → Console
   - Rodar teste de conexão (ver seção "Teste de Conexão")

3. Verificar IndexedDB:
   - DevTools → Application → IndexedDB
   - Procurar "RedFlixDB"

4. Fallback local:
   - Verificar se existe public/data/canais.json
```

### Problema: Player não reproduz

```
1. Verificar URL do canal:
   - É .m3u8 ou .ts?
   - URL está acessível?

2. Verificar console HLS:
   - Procurar erros de HLS
   - Verificar se hls.js está carregado

3. Testar em outro navegador:
   - Safari: HLS nativo
   - Chrome: hls.js

4. Verificar CORS:
   - Servidor permite cross-origin?
```

### Problema: Imagens não aparecem

```
1. Verificar tamanho:
   - Deve ser 244×137 px

2. Verificar fallback:
   - sem_logo.png existe?

3. Verificar console:
   - Erros 404?
   - Erros de CORS?

4. Limpar cache:
   - Ctrl+Shift+R (hard reload)
```

---

## ✅ CONCLUSÃO

Este prompt define **TODAS** as especificações para atualizar o RedFlix IPTV com funcionalidades completas de streaming, mantendo **100% fidelidade ao design original**.

**Pontos-chave:**

1. ✅ Layout e visual: **NÃO ALTERAR**
2. ✅ Menu navegação: **PRESERVAR EXATAMENTE**
3. ✅ Imagens: **244 × 137 px FIXO**
4. ✅ Funcionalidades: **ADICIONAR** (Player, Supabase, Parser)
5. ✅ Performance: **< 3s carregamento**

**Resultado esperado:**

- Site visualmente idêntico ao RedFlix original
- Sistema IPTV completo e funcional
- Suporte a milhares de canais
- Performance otimizada
- Cache robusto em 3 camadas

---

**Desenvolvido por:** Fabricio Cypreste  
**Versão do Prompt:** 4.0  
**Data:** 08 de Novembro de 2025  
**Status:** ✅ ESPECIFICAÇÃO COMPLETA  

🎬 **RedFlix IPTV - Prompt Mestre Final V4** 🚀

---

## 📎 ANEXOS

### A) Exemplo de Canal M3U

```
#EXTINF:-1 tvg-id="GloboHD" tvg-logo="http://logo.png" group-title="Abertos",Globo HD
http://stream.server.com:8080/live/globo/playlist.m3u8
```

### B) Estrutura de Dados Supabase

```typescript
interface Canal {
  id: number;
  nome: string;
  grupo: string;
  url: string;
  tipo: 'canal' | 'filme' | 'serie';
  logo: string | null;
  poster: string | null;
  favorito: boolean;
  atualizado_em: string;
}
```

### C) Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Limpar cache
rm -rf node_modules/.vite
rm -rf dist

# Reinstalar deps
npm ci

# Verificar bundle
npm run build -- --analyze
```

---

**FIM DO PROMPT MESTRE FINAL V4**
