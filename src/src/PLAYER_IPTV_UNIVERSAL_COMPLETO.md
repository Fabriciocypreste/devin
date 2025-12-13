# 🎬 PLAYER IPTV UNIVERSAL - DOCUMENTAÇÃO COMPLETA

## ✅ IMPLEMENTADO: IPTVUniversalPlayer

**Arquivo**: `/components/IPTVUniversalPlayer.tsx`

---

## 🎯 FUNCIONALIDADES COMPLETAS

### ✅ SUPORTE A FORMATOS

| Formato | Tecnologia | P2P | CORS | Streaming Ao Vivo |
|---------|-----------|-----|------|-------------------|
| **MP4** | HTML5 Player | ✅ | ✅ | ❌ |
| **M3U8** | HLS.js + P2P | ✅ | ✅ | ✅ |
| **TS** | HLS.js + P2P | ✅ | ✅ | ✅ |
| **M3U** | HLS.js + P2P | ✅ | ✅ | ✅ |
| **Live Streams** | HLS.js + P2P | ✅ | ✅ | ✅ |

---

## 🏗️ ARQUITETURA

```
┌─────────────────────────────────────────────────────────────┐
│                  IPTVUniversalPlayer                        │
│                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │   Detector     │→ │   Seletor      │→ │   Player     │  │
│  │   de Tipo      │  │   de Modo      │  │   Adequado   │  │
│  └────────────────┘  └────────────────┘  └──────────────┘  │
│          ↓                   ↓                    ↓         │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MODO 1: HLS + P2P (M3U8, TS, Live)                   │ │
│  │  - HLS.js para parsing                                 │ │
│  │  - p2p-media-loader para distribuição WebRTC          │ │
│  │  - Trackers: Supabase + OpenWebTorrent + Novage       │ │
│  │  - STUN servers: Google (3x)                           │ │
│  │  - Estatísticas P2P em tempo real                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MODO 2: HLS Nativo (Safari/iOS)                      │ │
│  │  - Suporte nativo do navegador                         │ │
│  │  - Sem P2P (limitação do Safari)                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  MODO 3: HTML5 Player (MP4 P2P)                       │ │
│  │  - Player nativo do navegador                          │ │
│  │  - Suporte a P2P para arquivos MP4                     │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔧 TECNOLOGIAS UTILIZADAS

### 1. **HLS.js** (HTTP Live Streaming)
- Reproduz streams M3U8 e TS
- Suporte a adaptive bitrate
- Recuperação automática de erros
- Buffer inteligente

### 2. **p2p-media-loader** (WebRTC P2P)
- Distribuição P2P via WebRTC
- Reduz carga no servidor
- Aumenta velocidade de download
- Trackers:
  - `wss://[supabase]/functions/v1/make-server-2363f5d6/tracker`
  - `wss://tracker.openwebtorrent.com`
  - `wss://tracker.novage.com.ua`

### 3. **STUN Servers** (NAT Traversal)
- `stun:stun.l.google.com:19302`
- `stun:stun1.l.google.com:19302`
- `stun:stun2.l.google.com:19302`

### 4. **CORS** (Cross-Origin Resource Sharing)
- Configurado no `vite.config.ts`:
  ```typescript
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Range',
  }
  ```

---

## 📊 ESTATÍSTICAS P2P EM TEMPO REAL

O player exibe estatísticas detalhadas quando em modo HLS + P2P:

```
┌─────────────────────────────────────────────────────────────┐
│  Estatísticas P2P WebRTC                                    │
├─────────────┬─────────────┬─────────────┬──────────────────┤
│   Peers     │   P2P ↓     │   P2P ↑     │   Eficiência     │
│     👥      │     💾      │     📤      │       📊         │
│     5       │   15.3 MB   │   8.7 MB    │     68% P2P      │
└─────────────┴─────────────┴─────────────┴──────────────────┘
                HTTP: 6.2 MB
[████████████████████████████████░░░░░░░░░░░░] 68%
```

**Métricas:**
- **Peers**: Número de peers conectados no swarm
- **P2P ↓**: Dados baixados de outros peers
- **P2P ↑**: Dados enviados para outros peers
- **Eficiência**: % de dados recebidos via P2P vs HTTP
- **HTTP**: Dados baixados diretamente do servidor

---

## 🎮 PROPS DO COMPONENTE

```typescript
interface IPTVUniversalPlayerProps {
  // URL do stream (obrigatório)
  url?: string;
  streamUrl?: string; // Alias para compatibilidade
  
  // Configurações visuais
  poster?: string; // Imagem de preview
  title?: string; // Título exibido no player
  
  // Comportamento
  autoPlay?: boolean; // Auto-reproduzir (padrão: true)
  isLive?: boolean; // Marca como stream ao vivo (padrão: false)
  
  // P2P e Estatísticas
  enableP2P?: boolean; // Habilita P2P WebRTC (padrão: true)
  enableStats?: boolean; // Mostra estatísticas P2P (padrão: true)
  
  // Callback
  onClose?: () => void; // Função ao fechar player
}
```

---

## 📖 EXEMPLOS DE USO

### 1️⃣ **Reproduzir Canal IPTV (M3U8 ao vivo)**

```tsx
import IPTVUniversalPlayer from './components/IPTVUniversalPlayer';

<IPTVUniversalPlayer
  streamUrl="http://servidor.com/canal/live.m3u8"
  title="Globo HD"
  isLive={true}
  enableP2P={true}
  enableStats={true}
  poster="https://image.tmdb.org/t/p/w500/poster.jpg"
/>
```

### 2️⃣ **Reproduzir Filme (MP4 P2P)**

```tsx
<IPTVUniversalPlayer
  streamUrl="http://api.cdnapp.fun:80/movie/new_app/Q24Wb98eYc/359.mp4"
  title="Silvio (2024)"
  isLive={false}
  enableP2P={true}
  enableStats={false}
  poster="https://image.tmdb.org/t/p/w500/silvio.jpg"
/>
```

### 3️⃣ **Reproduzir Série (M3U8 VOD)**

```tsx
<IPTVUniversalPlayer
  streamUrl="http://servidor.com/series/breaking-bad/s01e01.m3u8"
  title="Breaking Bad - S01E01"
  isLive={false}
  enableP2P={true}
  autoPlay={true}
/>
```

### 4️⃣ **Stream de Segmento TS**

```tsx
<IPTVUniversalPlayer
  streamUrl="http://servidor.com/segments/segment-001.ts"
  title="Segment 001"
  isLive={true}
  enableP2P={true}
/>
```

---

## 🔄 FLUXO DE DETECÇÃO AUTOMÁTICA

```
URL Recebida
    ↓
┌───────────────────┐
│ Detecta Formato   │
│ - .m3u8 → HLS     │
│ - .m3u  → HLS     │
│ - .ts   → HLS     │
│ - .mp4  → HTML5   │
└─────────┬─────────┘
          ↓
┌───────────────────┐
│ Verifica Suporte  │
│ - HLS.js?         │
│ - P2P?            │
│ - HLS Nativo?     │
└─────────┬─────────┘
          ↓
    ┌─────┴─────┐
    ↓           ↓
[HLS]       [HTML5]
    ↓
┌───────┴────────┐
│ HLS + P2P      │ ← MELHOR (WebRTC)
│ HLS Nativo     │ ← Safari/iOS
│ HLS HTTP       │ ← Fallback
└────────────────┘
```

---

## 🎯 OTIMIZAÇÕES IMPLEMENTADAS

### Para **Streaming Ao Vivo** (`isLive={true}`):
- ✅ Buffer reduzido (20s vs 30s)
- ✅ Latência mínima (3 sync segments vs 5)
- ✅ Modo baixa latência habilitado
- ✅ Menos segments pré-carregados (10 vs 20)

### Para **VOD** (Vídeo sob demanda):
- ✅ Buffer maior (30s)
- ✅ Mais segments pré-carregados (20)
- ✅ Melhor qualidade de reprodução

### Recuperação de Erros:
- ✅ **Network Error**: Reconecta automaticamente
- ✅ **Media Error**: Tenta recuperar codec
- ✅ **Fatal Error**: Exibe mensagem ao usuário
- ✅ Retry com backoff exponencial

---

## 🌐 COMPATIBILIDADE DE NAVEGADORES

| Navegador | MP4 | M3U8 (HLS) | P2P | Live |
|-----------|-----|-----------|-----|------|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |
| Safari | ✅ | ✅ (nativo) | ❌ | ✅ |
| iOS Safari | ✅ | ✅ (nativo) | ❌ | ✅ |
| Android Chrome | ✅ | ✅ | ✅ | ✅ |

**Nota**: Safari/iOS usam suporte HLS nativo sem P2P devido a limitações do navegador.

---

## 📡 FONTES DE DADOS SUPORTADAS

### 1. **Filmes e Séries** (MP4 P2P)
```
Fonte: https://chemorena.com/filmes/filmes.txt
Formato: M3U (EXTINF)
URLs: http://api.cdnapp.fun:80/movie/.../video.mp4
```

### 2. **Canais IPTV** (M3U8 HLS)
```
Fonte: https://chemorena.com/filmes/canaissite.txt
Formato: M3U8 (HLS)
URLs: http://servidor.com/canal/live.m3u8
```

### 3. **Streams Externos**
- Qualquer URL M3U8
- Qualquer URL MP4
- Qualquer URL TS
- CORS deve estar habilitado

---

## 🐛 DEBUG E LOGS

O player fornece logs detalhados no console:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 IPTV UNIVERSAL PLAYER - INICIANDO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 URL: http://servidor.com/live.m3u8
📺 Tipo Detectado: HLS
🔴 É Live: true
🌐 P2P Habilitado: true
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Iniciando modo: HLS + P2P (via WebRTC)
✅ P2P Engine inicializado
   - Tracker: Supabase + OpenWebTorrent + Novage
   - STUN Servers: Google (3 servidores)
   - Segments: 10 forward
✅ P2P integrado ao HLS.js
✅ Manifest HLS parseado com sucesso
📊 Qualidade carregada: 120s, 30 segmentos
▶️ Reprodução iniciada
```

---

## 🚀 PRÓXIMOS PASSOS - INTEGRAÇÃO

### 1. **Substituir Players Antigos**

```tsx
// ANTES (IPTVPlayerP2P)
import IPTVPlayerP2P from './components/IPTVPlayerP2P';

<IPTVPlayerP2P
  streamUrl={url}
  title={title}
/>

// DEPOIS (IPTVUniversalPlayer)
import IPTVUniversalPlayer from './components/IPTVUniversalPlayer';

<IPTVUniversalPlayer
  streamUrl={url}
  title={title}
  isLive={true} // ✅ ADICIONAR para canais
  enableP2P={true}
  enableStats={true}
/>
```

### 2. **Atualizar ChannelsPage.tsx**

```tsx
// Substituir P2PVideoPlayer e VideoPlayer por:
<IPTVUniversalPlayer
  streamUrl={selectedChannel.streamUrl}
  title={selectedChannel.name}
  poster={selectedChannel.logo}
  isLive={true} // ✅ Canais são ao vivo
  enableP2P={true}
  enableStats={true}
/>
```

### 3. **Atualizar IPTVPage.tsx**

```tsx
<IPTVUniversalPlayer
  streamUrl={selectedStream.url}
  title={selectedStream.name}
  isLive={selectedStream.type === 'canal'} // ✅ Detecta tipo
  enableP2P={true}
/>
```

### 4. **Atualizar UniversalPlayer (filmes/séries)**

```tsx
// Para MP4 (filmes/séries)
<IPTVUniversalPlayer
  streamUrl={movie.streamUrl}
  title={movie.title}
  poster={movie.poster_path}
  isLive={false} // ✅ VOD
  enableP2P={true}
  enableStats={false} // ✅ Ocultar stats em filmes
/>
```

---

## 🎉 RESUMO DE FUNCIONALIDADES

✅ **4 Modos de Reprodução**:
1. HLS + P2P (M3U8, TS, Live) - MELHOR
2. HLS Nativo (Safari/iOS)
3. HLS HTTP (Fallback)
4. HTML5 (MP4 P2P)

✅ **Detecção Automática**:
- Tipo de stream (.m3u8, .ts, .mp4)
- Suporte do navegador
- Modo de reprodução ideal

✅ **P2P WebRTC**:
- Distribuição de carga
- Estatísticas em tempo real
- 3 trackers (Supabase + públicos)
- 3 STUN servers Google

✅ **Streaming Ao Vivo**:
- Latência ultra-baixa
- Recuperação automática de erros
- Buffer otimizado

✅ **CORS Completo**:
- Configurado no vite.config
- Suporta links externos
- Headers customizados

✅ **UI Rica**:
- Badge tipo de player
- Badge AO VIVO (live streams)
- Estatísticas P2P detalhadas
- Mensagens de erro amigáveis
- Botão de fechar

---

## 📦 DEPENDÊNCIAS

Já incluídas no projeto via CDN (index.html):

```html
<!-- HLS.js -->
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>

<!-- P2P Media Loader -->
<script src="https://cdn.jsdelivr.net/npm/p2p-media-loader-core@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/p2p-media-loader-hlsjs@latest"></script>
```

---

## ✅ STATUS FINAL

🎉 **IPTVUniversalPlayer COMPLETO E PRONTO PARA USO!**

- ✅ Suporta MP4, M3U8, TS, M3U
- ✅ P2P WebRTC com estatísticas
- ✅ Streaming ao vivo otimizado
- ✅ CORS habilitado
- ✅ Detecção automática de formato
- ✅ Recuperação de erros
- ✅ UI rica e informativa
- ✅ Compatível com todos navegadores
- ✅ Integração com filmes.txt e canaissite.txt

**Arquivo**: `/components/IPTVUniversalPlayer.tsx`
**Data**: 20/11/2024
