# 🎬 REDFLIX - RESUMO VISUAL DO SISTEMA

## 🎯 COMO FUNCIONA (1 IMAGEM)

```
┌─────────────────────────────────────────────────────────────────┐
│                    🌐 INTERNET                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1️⃣  https://chemorena.com/filmes/filmes.txt                    │
│       ↓                                                          │
│       │  #EXTM3U                                                 │
│       │  #EXTINF:-1 tvg-logo="..." group-title="Ação",Filme 1   │
│       │  http://servidor.com/filme1.mp4                          │
│       │  #EXTINF:-1 tvg-logo="..." group-title="Drama",Filme 2  │
│       │  http://servidor.com/filme2.m3u8                         │
│       │  ...                                                     │
│       ↓                                                          │
│                                                                  │
│  2️⃣  https://api.allorigins.win/raw?url=...                     │
│       (CORS Proxy - contorna bloqueio do navegador)             │
│       ↓                                                          │
└───────┼──────────────────────────────────────────────────────────┘
        │
        ↓
┌───────────────────────────────────────────────────────────────┐
│              💻 NAVEGADOR (RedFlix)                            │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│  3️⃣  /services/iptvService.ts                                 │
│       ↓                                                        │
│       ├─ fetchAndParseMovies()                                 │
│       │   ├─ fetch(proxy + url)                                │
│       │   └─ parseM3UData(textData)                            │
│       │       └─ Lê linha por linha                            │
│       │           ├─ Extrai TÍTULO                             │
│       │           ├─ Extrai LOGO                               │
│       │           ├─ Extrai CATEGORIA                          │
│       │           └─ Extrai STREAM URL ✅                      │
│       │                                                        │
│       └─ Retorna: Movie[]                                      │
│           [                                                    │
│             {                                                  │
│               id: "movie-1",                                   │
│               title: "Filme 1",                                │
│               logoUrl: "http://...",                           │
│               streamUrl: "http://servidor.com/filme1.mp4" ✅  │
│               category: "Ação"                                 │
│             },                                                 │
│             ...                                                │
│           ]                                                    │
│       ↓                                                        │
│                                                                │
│  4️⃣  /App.tsx                                                  │
│       ↓                                                        │
│       ├─ useEffect() → fetchData()                             │
│       │   ├─ Importa iptvService                               │
│       │   ├─ Chama fetchMoviesByCategory()                     │
│       │   └─ Converte formato                                  │
│       │       └─ PRESERVA streamUrl ✅                         │
│       │                                                        │
│       ├─ setAllContent(movies)                                 │
│       │   └─ Estado do React                                   │
│       │                                                        │
│       └─ Renderiza interface                                   │
│           ├─ HeroSlider                                        │
│           ├─ MovieCards                                        │
│           └─ Categorias                                        │
│       ↓                                                        │
│                                                                │
│  5️⃣  Usuário clica "▶️ Assistir"                              │
│       ↓                                                        │
│       └─ handlePlayMovie(movie)                                │
│           ├─ Valida movie.streamUrl                            │
│           └─ setPlayingMovie(movie) ✅                         │
│       ↓                                                        │
│                                                                │
│  6️⃣  /components/Player.tsx                                    │
│       ↓                                                        │
│       └─ <video src={movie.streamUrl} autoPlay />             │
│           ↓                                                    │
│           └─ Navegador baixa e reproduz o vídeo               │
│               ├─ MP4: Reprodução direta                        │
│               └─ M3U8: Streaming HLS adaptativo                │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

---

## 📂 ARQUIVOS-CHAVE

| Arquivo | Função | Linhas Críticas |
|---------|--------|-----------------|
| `/services/iptvService.ts` | 📡 Busca e parseia filmes.txt | `parseM3UData()`, `fetchAndParseMovies()` |
| `/types.ts` | 📦 Define interface Movie | `interface Movie { streamUrl: string }` |
| `/App.tsx` | 🎛️ Gerencia estado global | `handlePlayMovie()`, `useEffect()` linha ~624 |
| `/components/Player.tsx` | 🎬 Player HTML5 | `<video src={streamUrl} />` |

---

## 🔑 CAMPOS ESSENCIAIS

### **Movie (do iptvService)**
```typescript
{
  id: string,
  title: string,          // ✅ Nome do filme
  logoUrl: string,        // ✅ Imagem do poster
  streamUrl: string,      // 🔥 URL DO VÍDEO (CRÍTICO!)
  category: string,       // ✅ Categoria (Ação, Drama, etc)
  year: number           // ✅ Ano de lançamento
}
```

### **streamUrl - O Campo Mais Importante**
```typescript
// ❌ SEM streamUrl = NÃO REPRODUZ
{ title: "Filme", streamUrl: "" }

// ✅ COM streamUrl = REPRODUZ
{ title: "Filme", streamUrl: "http://servidor.com/video.mp4" }
```

**Formatos aceitos:**
- ✅ `.mp4` - Vídeo MP4 (H.264)
- ✅ `.m3u8` - HLS (HTTP Live Streaming)
- ⚠️ `.mkv` - Matroska (depende do navegador)

---

## 🎮 CONTROLES DO PLAYER

```
┌────────────────────────────────────────────┐
│  ← Voltar    TÍTULO DO FILME               │
├────────────────────────────────────────────┤
│                                            │
│                                            │
│              🎬 VÍDEO                      │
│                                            │
│                                            │
├────────────────────────────────────────────┤
│  ▐▐ | ⏪ | ⏩ | 🔊───── | 00:45 / 02:30    │
│                                            │
│  [════════════════════░░░░] 75%            │
│                                            │
│  1x | 🎤 | 📝 | PiP | ⛶                   │
└────────────────────────────────────────────┘
```

**Controles disponíveis:**
- ▶️/⏸️ Play/Pause
- ⏪ Voltar 10s
- ⏩ Avançar 10s
- 🔊 Volume
- 🔇 Mute
- 1x Velocidade (0.5x, 1x, 1.5x, 2x)
- 🎤 Áudio (multi-áudio)
- 📝 Legendas
- PiP Picture-in-Picture
- ⛶ Tela cheia

---

## 🔄 FLUXO SIMPLIFICADO

```
START
  │
  ├─ App carrega
  │
  ├─ Busca filmes.txt via CORS proxy
  │
  ├─ Parseia linha por linha
  │    ├─ Linha 1: #EXTINF (metadados)
  │    └─ Linha 2: URL do vídeo
  │
  ├─ Cria array de Movies
  │    └─ Cada Movie tem streamUrl
  │
  ├─ Mostra na interface
  │    ├─ Hero Slider
  │    ├─ Cards de filmes
  │    └─ Categorias
  │
  ├─ Usuário clica "Assistir"
  │
  ├─ handlePlayMovie(movie)
  │    └─ setPlayingMovie(movie)
  │
  ├─ App renderiza Player
  │
  ├─ Player usa <video src={streamUrl} />
  │
  ├─ Navegador reproduz o vídeo
  │
  └─ Usuário clica "Voltar"
       │
       └─ setPlayingMovie(null)
            │
            └─ Volta para interface
END
```

---

## 🧪 TESTAR O SISTEMA

### **Opção 1: Normal**
```
http://localhost:5173
```
✅ Carrega interface completa
✅ Mostra filmes do filmes.txt
✅ Pode clicar e assistir

### **Opção 2: Teste Técnico**
```
http://localhost:5173/?iptv-test=true
```
✅ Interface de teste
✅ Botão "Testar iptvService"
✅ Mostra estatísticas
✅ Lista filmes com validação

---

## 📊 DADOS DE EXEMPLO

### **Entrada (filmes.txt)**
```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="http://exemplo.com/vingadores.jpg" group-title="Ação",Vingadores Ultimato (2019)
http://servidor.com/filmes/vingadores.mp4
#EXTINF:-1 tvg-logo="http://exemplo.com/pokemon.jpg" group-title="Animação",Pokemon (2024)
http://servidor.com/series/pokemon-s01e01.m3u8
```

### **Saída (parseado)**
```javascript
[
  {
    id: "movie-0-1732112400000",
    title: "Vingadores Ultimato (2019)",
    logoUrl: "http://exemplo.com/vingadores.jpg",
    streamUrl: "http://servidor.com/filmes/vingadores.mp4",
    category: "Ação",
    year: 2019
  },
  {
    id: "movie-2-1732112400001",
    title: "Pokemon (2024)",
    logoUrl: "http://exemplo.com/pokemon.jpg",
    streamUrl: "http://servidor.com/series/pokemon-s01e01.m3u8",
    category: "Animação",
    year: 2024
  }
]
```

### **No Player**
```html
<video 
  src="http://servidor.com/filmes/vingadores.mp4"
  autoPlay
/>
```

---

## 🎯 CHECKLIST DE FUNCIONAMENTO

- [ ] **1. filmes.txt acessível**
  - URL: https://chemorena.com/filmes/filmes.txt
  - Formato: M3U válido
  - URLs de vídeo funcionais

- [ ] **2. CORS Proxy funcionando**
  - api.allorigins.win ou corsproxy.io
  - Retorna conteúdo do filmes.txt

- [ ] **3. Parsing correto**
  - Extrai título, logo, categoria
  - **Extrai streamUrl corretamente**
  - Cria objetos Movie válidos

- [ ] **4. Conversão de formato**
  - Preserva streamUrl
  - Adiciona campos compatíveis

- [ ] **5. Interface renderiza**
  - Mostra filmes
  - Cards clicáveis
  - Botão "Assistir" visível

- [ ] **6. handlePlayMovie funciona**
  - Valida streamUrl
  - Define playingMovie
  - Abre Player

- [ ] **7. Player reproduz**
  - Tag <video> recebe streamUrl
  - Vídeo carrega
  - Vídeo reproduz
  - Controles funcionam

- [ ] **8. Voltar funciona**
  - Fecha Player
  - Volta para interface
  - Estado limpo

---

## 🚨 PONTOS DE ATENÇÃO

### **1. streamUrl é OBRIGATÓRIO**
```typescript
// ✅ BOM
{ streamUrl: "http://servidor.com/video.mp4" }

// ❌ RUIM (não vai reproduzir)
{ streamUrl: "" }
{ streamUrl: undefined }
{ /* sem streamUrl */ }
```

### **2. Formato do filmes.txt**
```m3u
✅ CORRETO (2 linhas por filme)
#EXTINF:-1 tvg-logo="..." group-title="Cat",Título
http://url.com/video.mp4

❌ INCORRETO (faltando linha)
#EXTINF:-1 tvg-logo="..." group-title="Cat",Título
(sem URL)
```

### **3. CORS Proxy necessário**
```typescript
✅ COM PROXY
fetch('https://api.allorigins.win/raw?url=https://chemorena.com/filmes/filmes.txt')

❌ SEM PROXY (vai dar erro CORS)
fetch('https://chemorena.com/filmes/filmes.txt')
```

---

## 🎉 RESULTADO FINAL

```
Usuário abre RedFlix
     ↓
Vê lista de filmes (do filmes.txt)
     ↓
Clica em "Assistir"
     ↓
Player abre em tela cheia
     ↓
Vídeo reproduz automaticamente
     ↓
Usuário assiste
     ↓
Clica em "Voltar"
     ↓
Volta para lista de filmes
```

## ✅ **SISTEMA 100% FUNCIONAL!**

🎬 **filmes.txt** → 🌐 **CORS Proxy** → 📡 **iptvService** → 🎛️ **App** → 🎥 **Player** → ▶️ **Vídeo**
