# 🚀 GUIA RÁPIDO - PLAYER IPTV UNIVERSAL

## ✅ O QUE FOI IMPLEMENTADO

### 📦 Arquivo Criado
**`/components/IPTVUniversalPlayer.tsx`**

### 🎯 Suporta TUDO
- ✅ **MP4** (P2P, HTML5 player)
- ✅ **M3U8** (HLS + P2P WebRTC)
- ✅ **TS** (Segmentos HLS + P2P)
- ✅ **M3U** (Listas IPTV + P2P)
- ✅ **Streaming Ao Vivo** (Baixa latência)

---

## 🎬 USO BÁSICO

### 1️⃣ Importar

```tsx
import IPTVUniversalPlayer from './components/IPTVUniversalPlayer';
```

### 2️⃣ Usar

```tsx
<IPTVUniversalPlayer
  streamUrl="http://servidor.com/video.m3u8"
  title="Meu Vídeo"
  isLive={true}
  enableP2P={true}
  enableStats={true}
  onClose={() => console.log('Fechado')}
/>
```

---

## 📋 PROPS PRINCIPAIS

| Prop | Tipo | Padrão | Descrição |
|------|------|--------|-----------|
| **streamUrl** | string | - | ✅ URL do vídeo (obrigatório) |
| **title** | string | - | Título exibido |
| **isLive** | boolean | false | Marca como ao vivo |
| **enableP2P** | boolean | true | Ativa P2P WebRTC |
| **enableStats** | boolean | true | Mostra estatísticas |
| **autoPlay** | boolean | true | Auto-reproduzir |
| **poster** | string | - | Imagem preview |
| **onClose** | function | - | Callback ao fechar |

---

## 🎯 EXEMPLOS RÁPIDOS

### 🔴 Canal IPTV (Ao Vivo)

```tsx
<IPTVUniversalPlayer
  streamUrl="http://servidor.com/globo/live.m3u8"
  title="Globo HD"
  isLive={true}
  enableP2P={true}
/>
```

### 🎬 Filme MP4 (P2P)

```tsx
<IPTVUniversalPlayer
  streamUrl="http://api.cdnapp.fun:80/movie/.../video.mp4"
  title="Silvio (2024)"
  isLive={false}
  enableStats={false}
/>
```

### 📺 Série (M3U8 VOD)

```tsx
<IPTVUniversalPlayer
  streamUrl="http://servidor.com/series/s01e01.m3u8"
  title="Breaking Bad - S01E01"
  isLive={false}
  enableP2P={true}
/>
```

---

## 🔧 FUNCIONALIDADES AUTOMÁTICAS

### ✅ Detecção Inteligente
- Detecta tipo (.m3u8, .ts, .mp4)
- Escolhe melhor modo (HLS+P2P, HLS nativo, HTML5)
- Fallback automático se P2P falhar

### ✅ Recuperação de Erros
- **Network Error** → Reconecta
- **Media Error** → Tenta recuperar
- **Fatal Error** → Exibe mensagem

### ✅ Otimizações Live
Quando `isLive={true}`:
- Buffer reduzido (20s)
- Latência mínima
- Modo baixa latência ativado

### ✅ Estatísticas P2P
Exibe em tempo real:
- 👥 Peers conectados
- 💾 Download P2P
- 📤 Upload P2P
- 📊 Eficiência (% P2P)

---

## 🌐 COMPATIBILIDADE

| Navegador | MP4 | M3U8 | P2P | Live |
|-----------|-----|------|-----|------|
| Chrome | ✅ | ✅ | ✅ | ✅ |
| Firefox | ✅ | ✅ | ✅ | ✅ |
| Edge | ✅ | ✅ | ✅ | ✅ |
| Safari/iOS | ✅ | ✅ | ❌* | ✅ |

*Safari usa HLS nativo sem P2P

---

## 📡 FONTES DE DADOS

### Filmes/Séries (MP4)
```
Fonte: https://chemorena.com/filmes/filmes.txt
Player: HTML5 + P2P
```

### Canais IPTV (M3U8)
```
Fonte: https://chemorena.com/filmes/canaissite.txt
Player: HLS.js + P2P WebRTC
```

---

## 🎨 INTERFACE

### Badges Exibidos
- **🌐 HLS + P2P** - Modo HLS com P2P
- **📡 HLS** - Modo HLS nativo
- **🎬 MP4** - Player HTML5
- **🔴 AO VIVO** - Stream ao vivo (quando `isLive={true}`)

### Painel P2P (quando ativo)
```
┌─────────────────────────────────────────────────┐
│ 👥 Peers: 5                                      │
│ 💾 P2P ↓: 15.3 MB                                │
│ 📤 P2P ↑: 8.7 MB                                 │
│ 📊 Eficiência: 68% P2P                           │
└─────────────────────────────────────────────────┘
```

---

## 🔄 INTEGRAÇÃO COM CÓDIGO EXISTENTE

### Substituir IPTVPlayerP2P

```tsx
// ❌ ANTES
import IPTVPlayerP2P from './components/IPTVPlayerP2P';

<IPTVPlayerP2P
  streamUrl={url}
  title={title}
/>

// ✅ DEPOIS
import IPTVUniversalPlayer from './components/IPTVUniversalPlayer';

<IPTVUniversalPlayer
  streamUrl={url}
  title={title}
  isLive={true} // ✅ ADICIONAR
  enableP2P={true}
/>
```

### Integrar com M3UContentLoader

```tsx
import { loadM3UContent } from './utils/m3uContentLoader';

// Carregar filmes do filmes.txt
const { filmes } = await loadM3UContent();

// Reproduzir
<IPTVUniversalPlayer
  streamUrl={filmes[0].streamUrl} // ✅ URL do MP4
  title={filmes[0].title}
  poster={filmes[0].poster_path} // ✅ Poster TMDB
  isLive={false}
/>
```

---

## 🐛 DEBUG

### Logs no Console

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
✅ Manifest HLS parseado
▶️ Reprodução iniciada
```

---

## ⚡ TECNOLOGIAS

### Core
- **HLS.js** - Streaming M3U8
- **p2p-media-loader** - P2P WebRTC
- **HTML5 Video** - Player nativo

### Infraestrutura P2P
- **3 Trackers**:
  - Supabase Edge Function
  - OpenWebTorrent
  - Novage
- **3 STUN Servers** (Google)

### CORS
- Configurado em `vite.config.ts`
- Permite links externos
- Headers customizados

---

## ✅ CHECKLIST DE USO

- [ ] Importar `IPTVUniversalPlayer`
- [ ] Passar `streamUrl` (obrigatório)
- [ ] Definir `isLive` (true para canais, false para filmes)
- [ ] Configurar `enableP2P` (true recomendado)
- [ ] Adicionar `title` (opcional mas recomendado)
- [ ] Implementar `onClose` se modal

---

## 🎉 RESULTADO FINAL

### ✅ 4 Modos de Reprodução
1. **HLS + P2P** - M3U8, TS, Live (MELHOR)
2. **HLS Nativo** - Safari/iOS
3. **HLS HTTP** - Fallback
4. **HTML5** - MP4 P2P

### ✅ Detecção Automática
- Formato detectado automaticamente
- Modo selecionado automaticamente
- P2P ativado quando possível

### ✅ UI Rica
- Badges informativos
- Estatísticas P2P detalhadas
- Mensagens de erro amigáveis
- Botão de fechar (opcional)

### ✅ Performance
- Baixa latência em lives
- Buffer otimizado
- Recuperação de erros
- P2P reduz carga do servidor

---

## 📁 ARQUIVOS DO PROJETO

| Arquivo | Descrição |
|---------|-----------|
| `/components/IPTVUniversalPlayer.tsx` | ✅ Player principal |
| `/PLAYER_IPTV_UNIVERSAL_COMPLETO.md` | 📖 Documentação técnica |
| `/EXEMPLO_INTEGRACAO_PLAYER.tsx` | 📝 Exemplos de código |
| `/GUIA_RAPIDO_PLAYER_IPTV.md` | 🚀 Este guia |

---

## 💡 DICA FINAL

**Use sempre `isLive={true}` para canais e `isLive={false}` para filmes/séries.**

Isso ativa otimizações específicas:
- **Live**: Latência baixa, buffer pequeno
- **VOD**: Melhor qualidade, buffer maior

---

## 🎬 PRONTO PARA USAR!

```tsx
import IPTVUniversalPlayer from './components/IPTVUniversalPlayer';

function MinhaPage() {
  return (
    <IPTVUniversalPlayer
      streamUrl="SEU_STREAM_AQUI"
      title="Meu Canal"
      isLive={true}
      enableP2P={true}
    />
  );
}
```

✅ **É só isso! Player pronto e funcionando.**

---

**Data**: 20/11/2024  
**Versão**: 1.0.0  
**Status**: ✅ COMPLETO E TESTADO
