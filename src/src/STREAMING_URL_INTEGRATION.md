# 🎬 Sistema de Integração de URLs de Streaming

## ✅ Implementação Completa

### O que foi implementado?

Sistema completo que conecta filmes e séries às suas URLs de streaming reais, permitindo que ao clicar em "Play" o vídeo seja reproduzido dentro da plataforma RedFlix.

---

## 🎯 Funcionalidades

### 1️⃣ **Busca Inteligente de URLs**

**Arquivo:** `/utils/contentUrls.ts`

```typescript
// Busca automática por título
const url = await getContentUrl('The Matrix', 'movie');

// Busca específica de filme
const movieUrl = await getMovieUrl('Inception');

// Busca específica de série
const seriesUrl = await getSeriesUrl('Breaking Bad');
```

**Features:**
- ✅ Match exato de título
- ✅ Match parcial (contains)
- ✅ Match por similaridade (>70%)
- ✅ Normalização de strings (remove acentos, caracteres especiais)
- ✅ Cache automático (evita requisições duplicadas)

---

### 2️⃣ **Player Universal**

**Arquivo:** `/components/UniversalPlayer.tsx`

**Modos de reprodução:**

1. **Stream Mode** (Prioridade 1)
   - Usa URL customizada do JSON
   - Reproduz conteúdo real
   - Iframe com suporte fullscreen

2. **Trailer Mode** (Prioridade 2)
   - Se não houver URL de stream
   - Reproduz trailer do YouTube
   - Autoplay habilitado

3. **Placeholder Mode** (Fallback)
   - Quando não há URLs disponíveis
   - Exibe instruções claras
   - Mostra TMDB ID para referência

**Design:**
```
┌─────────────────────────────────────┐
│ ← Voltar    The Matrix • Filme     │
├─────────────────────────────────────┤
│                                     │
│          [PLAYER DE VÍDEO]          │
│         (Iframe fullscreen)         │
│                                     │
├─────────────────────────────────────┤
│ ● REPRODUZINDO STREAM REAL          │
└─────────────────────────────────────┘
```

---

### 3️⃣ **Integração com MovieDetails**

**Arquivo:** `/components/MovieDetails.tsx`

**Fluxo de execução:**

```
1. MovieDetails monta
   ↓
2. Busca detalhes do TMDB
   ↓
3. Busca URL de streaming do JSON local
   getContentUrl(título, tipo)
   ↓
4. Valida URL (não pode ser example.com)
   isValidStreamUrl()
   ↓
5. Salva streamUrl no state
   ↓
6. Usuário clica em "Assistir"
   ↓
7. Abre UniversalPlayer com:
   - streamUrl (se disponível)
   - trailerKey (fallback)
   - placeholder (último recurso)
```

---

## 📋 Estrutura dos Dados JSON

### `/public/data/filmes.json`

```json
[
  {
    "nome": "The Matrix",
    "logo": "https://image.tmdb.org/t/p/w500/...",
    "categoria": "ficcao",
    "url": "https://seu-servidor.com/filmes/matrix"
  }
]
```

### `/public/data/series.json`

```json
[
  {
    "nome": "Breaking Bad",
    "logo": "https://image.tmdb.org/t/p/w500/...",
    "categoria": "drama",
    "url": "https://seu-servidor.com/series/breaking-bad"
  }
]
```

**Campos:**
- `nome`: Título do conteúdo (usado para match)
- `logo`: URL da logo/poster (opcional)
- `categoria`: Gênero do conteúdo (opcional)
- `url`: **URL DE STREAMING** (campo crítico)

---

## 🚀 Como Adicionar Conteúdo

### Passo 1: Editar JSON

```bash
# Editar arquivo de filmes
nano public/data/filmes.json

# OU séries
nano public/data/series.json
```

### Passo 2: Adicionar entrada

```json
{
  "nome": "Interstellar",
  "logo": "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
  "categoria": "ficcao",
  "url": "https://seu-cdn.com/stream/interstellar.m3u8"
}
```

### Passo 3: Recarregar aplicação

```bash
# O cache é automático, mas para garantir:
# Limpar localStorage (opcional)
localStorage.clear();

# Recarregar página
window.location.reload();
```

---

## 🎥 Formatos de URL Suportados

### ✅ Suportados

```typescript
// HLS (M3U8)
"https://cdn.com/video/stream.m3u8"

// MP4 direto
"https://cdn.com/video/filme.mp4"

// DASH
"https://cdn.com/video/manifest.mpd"

// Embed players
"https://player.vimeo.com/video/123456789"
"https://www.youtube.com/embed/VIDEO_ID"
"https://player.twitch.tv/?video=VIDEO_ID"

// URLs customizadas de servidores
"https://seu-servidor.com/stream/ID"
```

### ❌ Não Suportados (Placeholder)

```typescript
// Example.com (placeholder)
"https://example.com/filmes/matrix" ❌

// URLs vazias
"" ❌

// URLs sem protocolo
"cdn.com/video.mp4" ❌
```

---

## 🔍 Sistema de Busca Inteligente

### Match Exato

```typescript
JSON: "The Matrix"
Busca: "The Matrix"
Match: ✅ 100%
```

### Match Parcial

```typescript
JSON: "The Matrix Reloaded"
Busca: "Matrix"
Match: ✅ Contains
```

### Match por Similaridade

```typescript
JSON: "The Shawshank Redemption"
Busca: "Shawshank Redemtion" (typo)
Match: ✅ 85% similaridade
```

### Normalização

```typescript
JSON: "São Paulo"
Busca: "sao paulo"
Match: ✅ (remove acentos)

JSON: "Spider-Man: No Way Home"
Busca: "spiderman no way home"
Match: ✅ (remove hífens)
```

---

## 📊 Logs e Debug

### Console Logs Automáticos

Quando você clica em "Assistir":

```javascript
🔍 Buscando URL para filme: "The Matrix"
✅ URL encontrada: https://cdn.com/matrix.m3u8
✅ Stream URL encontrada: https://cdn.com/matrix.m3u8
🎬 Abrindo player universal...
📡 Stream URL: https://cdn.com/matrix.m3u8
🎥 Trailer Key: null
🎬 Player Mode: STREAM
📡 Stream URL: https://cdn.com/matrix.m3u8
✅ Stream player carregado
```

### Debug Manual

```javascript
// No console do browser (F12)

// Importar funções
const { getContentUrl } = await import('./utils/contentUrls');

// Testar busca
const url = await getContentUrl('The Matrix', 'movie');
console.log('URL:', url);

// Ver todos os filmes
const { getAllMovies } = await import('./utils/contentUrls');
const filmes = await getAllMovies();
console.table(filmes);

// Ver todas as séries
const { getAllSeries } = await import('./utils/contentUrls');
const series = await getAllSeries();
console.table(series);
```

---

## 🎨 UI/UX do Player

### Stream Disponível

```
┌─────────────────────────────────────┐
│ ← Voltar    Interstellar • Filme  ×│
│                                     │
│    [VÍDEO REPRODUZINDO FULLSCREEN]  │
│                                     │
│ ● REPRODUZINDO STREAM REAL          │
└─────────────────────────────────────┘
```

### Apenas Trailer

```
┌─────────────────────────────────────┐
│ ← Voltar    The Matrix • Filme    ×│
│                                     │
│   [TRAILER DO YOUTUBE REPRODUZINDO] │
│                                     │
│ The Matrix • Trailer                │
└─────────────────────────────────────┘
```

### Sem URL

```
┌─────────────────────────────────────┐
│ ← Voltar    Unknown Movie • Filme ×│
│                                     │
│           ▶ (ícone play)            │
│                                     │
│      Conteúdo Indisponível          │
│                                     │
│  A URL de streaming para           │
│  "Unknown Movie" não está          │
│  disponível.                       │
│                                     │
│  Para assistir este filme:         │
│  1. Adicione URL no JSON           │
│  2. Configure streaming            │
│  3. Recarregue a página            │
│                                     │
│  TMDB ID: 123456  TIPO: Filme      │
└─────────────────────────────────────┘
```

---

## 🔧 Configuração de Servidor de Streaming

### Opção 1: HLS Server (Recomendado)

```bash
# Instalar FFmpeg
sudo apt install ffmpeg

# Converter vídeo para HLS
ffmpeg -i input.mp4 \
  -codec: copy \
  -start_number 0 \
  -hls_time 10 \
  -hls_list_size 0 \
  -f hls \
  output.m3u8

# Servir via HTTP
python3 -m http.server 8000

# URL: http://seu-ip:8000/output.m3u8
```

### Opção 2: Vimeo Embed

```json
{
  "nome": "Meu Filme",
  "url": "https://player.vimeo.com/video/SEU_VIDEO_ID"
}
```

### Opção 3: YouTube Embed

```json
{
  "nome": "Meu Vídeo",
  "url": "https://www.youtube.com/embed/VIDEO_ID"
}
```

### Opção 4: CDN Externo

```json
{
  "nome": "Filme Público",
  "url": "https://cdn.jsdelivr.net/gh/user/repo@main/video.mp4"
}
```

---

## 🧪 Testes

### Teste 1: URL Válida

```bash
1. Adicionar filme com URL válida
2. Abrir MovieDetails
3. Clicar em "Assistir"
4. Verificar: Player abre com vídeo reproduzindo ✅
5. Console: "REPRODUZINDO STREAM REAL" ✅
```

### Teste 2: Apenas Trailer

```bash
1. Filme sem URL no JSON
2. Mas tem trailer no TMDB
3. Clicar em "Assistir"
4. Verificar: YouTube trailer reproduz ✅
5. Console: "Player Mode: TRAILER" ✅
```

### Teste 3: Sem Conteúdo

```bash
1. Filme sem URL e sem trailer
2. Clicar em "Assistir"
3. Verificar: Placeholder com instruções ✅
4. Console: "Player Mode: PLACEHOLDER" ✅
```

### Teste 4: Match Inteligente

```bash
1. JSON: "The Matrix"
2. TMDB: "Matrix, The"
3. Verificar: Match encontrado ✅
4. Console: "Match por similaridade" ✅
```

---

## ⚡ Performance

### Cache Automático

```typescript
// Primeira busca
await getMovieUrl('Matrix'); // Fetch de filmes.json

// Buscas seguintes
await getMovieUrl('Inception'); // Usa cache ✅
await getMovieUrl('Interstellar'); // Usa cache ✅

// Zero requisições extras!
```

### Lazy Loading

```typescript
// JSONs só carregam quando necessário
// Não carrega series.json se só buscar filmes
```

---

## 📚 Exemplos Práticos

### Exemplo 1: Adicionar Filme

```json
// public/data/filmes.json
{
  "nome": "Blade Runner 2049",
  "logo": "https://image.tmdb.org/t/p/w500/gajva2L0rPYkEWjzgFlBXCAVBE5.jpg",
  "categoria": "ficcao",
  "url": "https://meu-cdn.com/streams/blade-runner-2049.m3u8"
}
```

**Resultado:**
```
Usuário busca "Blade Runner 2049"
  ↓
getMovieUrl() encontra match exato
  ↓
Retorna URL: https://meu-cdn.com/streams/blade-runner-2049.m3u8
  ↓
UniversalPlayer reproduz stream ✅
```

### Exemplo 2: Série com Episódios

```json
// public/data/series.json
{
  "nome": "Stranger Things",
  "logo": "https://image.tmdb.org/t/p/w500/...",
  "categoria": "ficcao",
  "url": "https://meu-cdn.com/series/stranger-things/s01e01.m3u8"
}
```

**Futuro:** Sistema de episódios individual (próxima implementação)

---

## 🎯 Checklist de Validação

### Desenvolvedor

- [ ] ✅ Criar `/utils/contentUrls.ts`
- [ ] ✅ Criar `/components/UniversalPlayer.tsx`
- [ ] ✅ Atualizar `/components/MovieDetails.tsx`
- [ ] ✅ Adicionar URLs nos JSONs
- [ ] ✅ Testar com URL válida
- [ ] ✅ Testar com trailer apenas
- [ ] ✅ Testar sem conteúdo
- [ ] ✅ Verificar logs no console

### Usuário Final

- [ ] ✅ Clicar em filme
- [ ] ✅ Clicar em "Assistir"
- [ ] ✅ Player abre instantaneamente
- [ ] ✅ Vídeo reproduz corretamente
- [ ] ✅ Fullscreen funciona
- [ ] ✅ Voltar fecha o player
- [ ] ✅ Interface responsiva

---

## 🚀 Próximos Passos

### 1. Sistema de Episódios

```typescript
// Estrutura futura
{
  "nome": "Breaking Bad",
  "tipo": "serie",
  "temporadas": [
    {
      "numero": 1,
      "episodios": [
        {
          "numero": 1,
          "titulo": "Pilot",
          "url": "https://cdn.com/bb/s01e01.m3u8"
        }
      ]
    }
  ]
}
```

### 2. Legendas

```typescript
{
  "nome": "The Matrix",
  "url": "https://cdn.com/matrix.m3u8",
  "legendas": [
    {
      "idioma": "pt-BR",
      "url": "https://cdn.com/subs/matrix-pt.vtt"
    },
    {
      "idioma": "en",
      "url": "https://cdn.com/subs/matrix-en.vtt"
    }
  ]
}
```

### 3. Qualidades Múltiplas

```typescript
{
  "nome": "Interstellar",
  "qualidades": [
    {
      "label": "1080p",
      "url": "https://cdn.com/1080p.m3u8"
    },
    {
      "label": "720p",
      "url": "https://cdn.com/720p.m3u8"
    },
    {
      "label": "480p",
      "url": "https://cdn.com/480p.m3u8"
    }
  ]
}
```

---

## 💡 Dicas Importantes

### ✅ Boas Práticas

1. **URLs HTTPS**: Sempre use HTTPS (não HTTP)
2. **CDN Rápido**: Use CDN com boa latência
3. **HLS Preferred**: HLS é mais compatível que MP4 direto
4. **Cache Headers**: Configure cache no servidor
5. **CORS**: Habilite CORS no servidor de vídeos

### ⚠️ Evitar

1. ❌ URLs `example.com` (são placeholders)
2. ❌ URLs sem protocolo
3. ❌ Links temporários (expiram)
4. ❌ Links de download (não streamam)
5. ❌ URLs bloqueadas por CORS

---

## 📞 Troubleshooting

### Problema: "Conteúdo Indisponível"

**Causa:** URL não encontrada ou inválida

**Solução:**
```bash
1. Verificar JSON tem a URL
2. Verificar URL não é example.com
3. Testar URL diretamente no browser
4. Checar console para erros
```

### Problema: Player não carrega

**Causa:** CORS ou URL bloqueada

**Solução:**
```bash
1. Abrir DevTools → Console
2. Procurar erro CORS
3. Configurar CORS no servidor
4. Ou usar proxy
```

### Problema: Match não encontra

**Causa:** Título diferente

**Solução:**
```javascript
// Verificar título exato
console.log(getTitle(movie));

// Ajustar JSON para match exato
{
  "nome": "TÍTULO_EXATO_DO_TMDB",
  "url": "..."
}
```

---

## 🏆 Status Final

### ✅ **COMPLETO E FUNCIONAL**

**Implementado:**
- ✅ Sistema de busca inteligente de URLs
- ✅ Player universal com 3 modos
- ✅ Integração com MovieDetails
- ✅ Match fuzzy com 70% similaridade
- ✅ Cache automático
- ✅ Validação de URLs
- ✅ UI/UX profissional
- ✅ Logs detalhados
- ✅ Fallbacks robustos

**Resultado:**
> **Agora ao clicar em "Play", o vídeo correspondente abre e reproduz dentro do RedFlix!** 🎬✅

---

**Desenvolvido com ❤️ para RedFlix**  
**Sistema de Streaming Integrado** 🎬  
**Status:** PRODUCTION READY ✅
