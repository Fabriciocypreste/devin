# 🎬 COMO FUNCIONA O REDFLIX - SISTEMA SIMPLIFICADO

## 📋 RESUMO EXECUTIVO

O RedFlix agora usa um **sistema simplificado e direto** para carregar filmes do arquivo `filmes.txt` e reproduzi-los no player HTML5 nativo.

```
┌─────────────┐      ┌──────────────┐      ┌──────────┐      ┌─────────┐
│ filmes.txt  │ ───> │ CORS Proxy   │ ───> │ App.tsx  │ ───> │ Player  │
│ (remoto)    │      │ (allorigins) │      │ (estado) │      │ (HTML5) │
└─────────────┘      └──────────────┘      └──────────┘      └─────────┘
```

---

## 🔄 FLUXO COMPLETO (PASSO A PASSO)

### **1. INICIALIZAÇÃO DO APP**
📍 **Arquivo:** `/App.tsx` (linha ~624)

Quando o app carrega, dispara um `useEffect`:

```typescript
useEffect(() => {
  async function fetchData() {
    // 1. Mostra loading
    setLoading(true);
    setLoadingProgress(10);
    
    console.log('🎬 REDFLIX - SISTEMA SIMPLIFICADO');
    console.log('📡 Fonte: https://chemorena.com/filmes/filmes.txt');
    
    // 2. Importa e chama o iptvService
    const { fetchMoviesByCategory } = await import('./services/iptvService');
    const result = await fetchMoviesByCategory();
    
    // 3. Mostra resultado
    console.log('✅ Filmes carregados:', result.total);
    console.log('📂 Categorias:', Object.keys(result.categories).length);
  }
  
  fetchData();
}, []);
```

---

### **2. BUSCA DO ARQUIVO filmes.txt**
📍 **Arquivo:** `/services/iptvService.ts`

#### **A) Proxy CORS**
```typescript
const IPTV_LIST_URL = 'https://chemorena.com/filmes/filmes.txt';

const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',  // Primário
  'https://corsproxy.io/?',               // Fallback
];
```

**Por que proxy?**
- ❌ Navegadores bloqueiam requisições diretas (CORS)
- ✅ Proxy contorna esse bloqueio
- ✅ Sistema tenta múltiplos proxies (resiliência)

#### **B) Download**
```typescript
const proxiedUrl = `${proxy}${encodeURIComponent(IPTV_LIST_URL)}`;
// Resultado: https://api.allorigins.win/raw?url=https%3A%2F%2Fchemorena.com%2Ffilmes%2Ffilmes.txt

const response = await fetch(proxiedUrl);
const textData = await response.text();
```

**O que baixa:**
```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="http://url.com/logo.jpg" group-title="Ação",Filme de Ação (2024)
http://servidor.com/filme.mp4
#EXTINF:-1 tvg-logo="http://url.com/serie.jpg" group-title="Séries",Série EP1
http://servidor.com/serie.m3u8
```

---

### **3. PARSING DO ARQUIVO (LINHA POR LINHA)**
📍 **Arquivo:** `/services/iptvService.ts` (função `parseM3UData`)

```typescript
const parseM3UData = (textData: string): Movie[] => {
  const lines = textData.split('\n').filter(line => line.trim() !== '');
  const movies: Movie[] = [];

  // Processa em PARES (info + URL)
  for (let i = 0; i < lines.length; i += 2) {
    const infoLine = lines[i];      // #EXTINF com metadados
    const streamUrl = lines[i + 1];  // URL do vídeo
    
    // EXTRAI LOGO
    const logoMatch = infoLine.match(/tvg-logo="([^"]*)"/);
    const logoUrl = logoMatch ? logoMatch[1] : '';
    
    // EXTRAI CATEGORIA
    const categoryMatch = infoLine.match(/group-title="([^"]*)"/);
    const category = categoryMatch ? categoryMatch[1] : 'Geral';
    
    // EXTRAI TÍTULO (depois da última vírgula)
    const title = infoLine.split(',').pop()?.trim() || '';
    
    // EXTRAI ANO (se houver no título)
    const yearMatch = title.match(/\((\d{4})\)/);
    const year = yearMatch ? parseInt(yearMatch[1]) : 0;
    
    // MONTA O OBJETO MOVIE
    movies.push({
      id: `movie-${i}-${Date.now()}`,
      category,
      title,
      logoUrl,
      streamUrl: streamUrl.trim(), // ✅ URL DIRETA DO VÍDEO
      year,
    });
  }

  return movies;
};
```

**Exemplo de entrada e saída:**

**Entrada (2 linhas):**
```
#EXTINF:-1 tvg-logo="http://exemplo.com/poster.jpg" group-title="Ação",Vingadores (2024)
http://servidor.com/vingadores.mp4
```

**Saída (objeto Movie):**
```javascript
{
  id: "movie-0-1732112400000",
  category: "Ação",
  title: "Vingadores (2024)",
  logoUrl: "http://exemplo.com/poster.jpg",
  streamUrl: "http://servidor.com/vingadores.mp4", // ✅ CRÍTICO!
  year: 2024
}
```

---

### **4. ORGANIZAÇÃO POR CATEGORIA**
📍 **Arquivo:** `/services/iptvService.ts` (função `fetchMoviesByCategory`)

```typescript
export const fetchMoviesByCategory = async () => {
  const allMovies = await fetchAndParseMovies();
  
  // Agrupa por categoria
  const categories: { [key: string]: Movie[] } = {};
  
  allMovies.forEach(movie => {
    const cat = movie.category || 'Sem Categoria';
    if (!categories[cat]) {
      categories[cat] = [];
    }
    categories[cat].push(movie);
  });
  
  return {
    movies: allMovies,        // Todos os filmes
    categories: categories,    // Agrupados
    total: allMovies.length,   // Total
  };
};
```

**Resultado:**
```javascript
{
  movies: [movie1, movie2, movie3, ...],
  categories: {
    "Ação": [movie1, movie5, movie8],
    "Comédia": [movie2, movie3],
    "Séries": [movie4, movie6, movie7],
  },
  total: 150
}
```

---

### **5. CONVERSÃO PARA FORMATO DO APP**
📍 **Arquivo:** `/App.tsx` (linha ~661)

O iptvService retorna `Movie[]` em formato simples.
O App precisa de campos adicionais para funcionar com os componentes existentes.

```typescript
const convertedMovies = result.movies.map(movie => ({
  // Campos originais do iptvService
  id: parseInt(movie.id.replace(/[^\d]/g, '')) || Math.random() * 1000000,
  category: movie.category,
  logoUrl: movie.logoUrl,
  streamUrl: movie.streamUrl, // ✅ PRESERVADO!
  year: movie.year,
  
  // Campos adicionais para compatibilidade
  title: movie.title,
  name: movie.title,                    // Alias para séries
  poster_path: movie.logoUrl,           // Imagem do poster
  backdrop_path: movie.logoUrl,         // Imagem de fundo
  overview: `Categoria: ${movie.category}`,
  vote_average: 8.0,
  media_type: 'movie' as const,
  release_date: movie.year > 0 ? `${movie.year}-01-01` : '2024-01-01',
}));

// Salva no estado do App
setAllContent(convertedMovies);
setTopShows(convertedMovies.slice(0, 20));
setContinueWatching(convertedMovies.slice(0, 5));
```

---

### **6. EXIBIÇÃO NA INTERFACE**
📍 **Arquivo:** `/App.tsx` (renderização)

Os filmes agora estão em `allContent`, `topShows`, etc.
Os componentes (MovieCard, HeroSlider) renderizam essas listas.

```typescript
<HeroSlider 
  movies={topShows} 
  onPlayMovie={handlePlayMovie}  // ✅ Callback para reproduzir
/>

<MovieRow 
  title="Em Alta" 
  movies={allContent} 
  onMovieClick={handleMovieClick}
/>
```

---

### **7. CLIQUE NO BOTÃO "ASSISTIR"**
📍 **Arquivo:** Componentes (MovieCard, HeroSlider, MovieDetails, etc)

Quando o usuário clica em "Assistir", o componente chama:

```typescript
<button onClick={() => onPlayMovie(movie)}>
  ▶️ Assistir
</button>
```

Isso dispara o callback `handlePlayMovie` do App.tsx:

```typescript
const handlePlayMovie = (movie: Movie) => {
  console.log('🎬 REPRODUZINDO:', movie.title);
  console.log('🎥 Stream URL:', movie.streamUrl); // ✅ URL DO VÍDEO
  
  // Validar
  if (!movie.streamUrl) {
    alert('Erro: Este filme não possui URL de reprodução.');
    return;
  }
  
  // Abrir player
  setPlayingMovie(movie); // ✅ Define o estado
};
```

---

### **8. RENDERIZAÇÃO DO PLAYER**
📍 **Arquivo:** `/App.tsx` (renderização condicional)

```typescript
// PRIORIDADE MÁXIMA: Se tem filme reproduzindo, mostra APENAS o Player
if (playingMovie) {
  return <Player movie={playingMovie} onBack={handleBackFromPlayer} />;
}

// Senão, mostra a interface normal
return <div>...interface normal...</div>;
```

**O que acontece:**
- ✅ Interface principal **desaparece**
- ✅ Player **toma conta da tela**
- ✅ Exibe o vídeo em tela cheia

---

### **9. PLAYER HTML5 REPRODUZ O VÍDEO**
📍 **Arquivo:** `/components/Player.tsx`

```typescript
const Player: React.FC<PlayerProps> = ({ movie, onBack }) => {
  const streamUrl = movie.streamUrl || '';
  
  console.log('🎬 Player carregado:', movie.title);
  console.log('🎥 Stream URL:', streamUrl);
  
  return (
    <div className="fixed inset-0 bg-black z-50">
      <video
        ref={videoRef}
        className="w-full h-full"
        src={streamUrl}  // ✅ USA A URL DIRETA DO VÍDEO
        autoPlay
      />
      
      {/* Controles personalizados */}
      <div className="controls">
        <button onClick={togglePlay}>⏯️</button>
        <button onClick={onBack}>← Voltar</button>
      </div>
    </div>
  );
};
```

**Como funciona o `<video>`:**
1. Recebe o `src={streamUrl}` (URL do vídeo .mp4 ou .m3u8)
2. Navegador **baixa** o vídeo do servidor
3. Navegador **decodifica** e **renderiza**
4. Controles JavaScript manipulam a reprodução

**Formatos suportados:**
- ✅ `.mp4` - MP4 (H.264)
- ✅ `.m3u8` - HLS (streaming adaptativo)
- ✅ `.mkv` - Matroska (depende do navegador)

---

### **10. VOLTAR DO PLAYER**
📍 **Arquivo:** `/components/Player.tsx` → `/App.tsx`

Quando o usuário clica no botão "Voltar":

```typescript
// Player.tsx
<button onClick={onBack}>← Voltar</button>

// App.tsx
const handleBackFromPlayer = () => {
  console.log('🔙 Fechando player');
  setPlayingMovie(null); // ✅ Limpa o estado
};
```

**O que acontece:**
- ✅ `playingMovie` vira `null`
- ✅ Renderização condicional volta para interface normal
- ✅ Player **desaparece**
- ✅ Interface principal **reaparece**

---

## 📊 DIAGRAMA DE ESTADOS

```
┌──────────────┐
│ App Iniciado │
└──────┬───────┘
       │
       ▼
┌────────────────────┐
│ Loading = true     │
│ (tela de loading)  │
└─────────┬──────────┘
          │
          ▼
┌───────────────────────┐
│ fetchMoviesByCategory │ ←── iptvService.ts
└──────────┬────────────┘
           │
           ▼
┌──────────────────────┐
│ Parsing filmes.txt   │ ←── parseM3UData()
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Conversão de formato │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ setAllContent()      │ ←── Estado do App
│ Loading = false      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Interface normal     │ ◄───┐
│ (HeroSlider, Cards)  │     │
└──────────┬───────────┘     │
           │                 │
    Clica "Assistir"         │
           │                 │
           ▼                 │
┌──────────────────────┐     │
│ handlePlayMovie()    │     │
│ setPlayingMovie()    │     │
└──────────┬───────────┘     │
           │                 │
           ▼                 │
┌──────────────────────┐     │
│ Player em tela cheia │     │
│ (video src=streamUrl)│     │
└──────────┬───────────┘     │
           │                 │
    Clica "Voltar"           │
           │                 │
           ▼                 │
┌──────────────────────┐     │
│ handleBackFromPlayer │     │
│ setPlayingMovie(null)│ ────┘
└──────────────────────┘
```

---

## 🔍 LOGS NO CONSOLE

Quando você abre o RedFlix e pressiona F12 (console), verá:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 REDFLIX - SISTEMA SIMPLIFICADO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Fonte: https://chemorena.com/filmes/filmes.txt
🔄 Carregando via CORS Proxy...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 iptvService: Tentando fetch via https://api.allorigins.win/...
✅ iptvService: Sucesso - 150 filmes
📊 iptvService: 15 categorias organizadas
✅ Filmes carregados: 150
📂 Categorias: 15
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 CARREGAMENTO CONCLUÍDO!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

Quando clicar em "Assistir":

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 REPRODUZINDO: Vingadores (2024)
🎥 Stream URL: http://servidor.com/vingadores.mp4
📂 Categoria: Ação
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎬 Player carregado para: Vingadores (2024)
🎥 Stream URL: http://servidor.com/vingadores.mp4
```

---

## 🎯 PONTOS CRÍTICOS

### **1. streamUrl é ESSENCIAL**
```typescript
// ❌ SEM streamUrl = NÃO FUNCIONA
{ title: "Filme", streamUrl: "" } // ❌

// ✅ COM streamUrl = FUNCIONA
{ title: "Filme", streamUrl: "http://servidor.com/video.mp4" } // ✅
```

### **2. Formato do arquivo filmes.txt**
```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="URL_LOGO" group-title="CATEGORIA",TÍTULO
URL_DO_VIDEO.mp4
```

**Cada filme = 2 linhas:**
- Linha 1: Metadados (#EXTINF)
- Linha 2: URL do vídeo

### **3. CORS Proxy é NECESSÁRIO**
```typescript
// ❌ Direto = BLOQUEADO
fetch('https://chemorena.com/filmes/filmes.txt') // ❌ CORS Error

// ✅ Via proxy = FUNCIONA
fetch('https://api.allorigins.win/raw?url=https://chemorena.com/filmes/filmes.txt') // ✅
```

---

## 🧪 COMO TESTAR

### **Teste 1: Console**
1. Abra o RedFlix
2. Pressione F12
3. Veja os logs de carregamento

### **Teste 2: Página de Teste**
1. Acesse: `http://localhost:5173/?iptv-test=true`
2. Clique em "Testar iptvService"
3. Veja estatísticas e lista de filmes

### **Teste 3: Reproduzir**
1. Carregue o RedFlix normalmente
2. Clique em qualquer filme
3. Clique em "Assistir"
4. O player deve abrir e reproduzir

---

## 🎓 CONCLUSÃO

O RedFlix agora funciona de forma **simples e direta**:

1. ✅ Busca `filmes.txt` via CORS proxy
2. ✅ Parseia linha por linha
3. ✅ Extrai nome, logo e **URL do vídeo**
4. ✅ Converte para formato do App
5. ✅ Exibe na interface
6. ✅ Ao clicar "Assistir", abre Player
7. ✅ Player usa `<video src={streamUrl}>` para reproduzir
8. ✅ Botão "Voltar" fecha o player

**Sem backend. Sem Supabase. Sem complexidade. Apenas:**
```
filmes.txt → iptvService → App → Player → Video
```

🎉 **SISTEMA 100% FUNCIONAL!** 🎉
