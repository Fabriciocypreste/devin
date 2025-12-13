# 📺 Documentação do IPTV Service - RedFlix

## 🎯 Visão Geral

O **iptvService.ts** é um serviço alternativo e simplificado para carregar filmes, séries e canais IPTV diretamente do arquivo `filmes.txt` remoto, sem depender do backend Supabase.

---

## 🏗️ Arquitetura

### **Sistema Atual (Complexo)**
```
filmes.txt → Supabase Edge Functions → Parse no servidor → Cache KV → Frontend
```

**Vantagens:**
- ✅ Parse no servidor (mais rápido)
- ✅ Sistema de cache robusto  
- ✅ Fallback em 4 níveis
- ✅ Sem problemas de CORS

**Desvantagens:**
- ❌ Complexo
- ❌ Depende do backend

---

### **iptvService.ts (Simples)**
```
filmes.txt → CORS Proxy → Parse no cliente → Frontend
```

**Vantagens:**
- ✅ Simples e direto
- ✅ Sem dependência de backend
- ✅ Fallback entre proxies
- ✅ Fácil de debugar

**Desvantagens:**
- ❌ Parse no cliente (mais lento)
- ❌ Depende de proxies externos
- ❌ Sem cache

---

## 📁 Estrutura de Arquivos

### **1. `/types.ts`** - Interfaces Base
```typescript
export interface Movie {
  id: string;
  category: string;
  title: string;
  logoUrl: string;
  streamUrl: string;
  year: number;
}
```

**Responsabilidade:** Define o tipo base de filme/série/canal usado em toda a aplicação.

---

### **2. `/services/iptvService.ts`** - Serviço IPTV
```typescript
// Funções principais:
fetchAndParseMovies()       // Busca e parseia filmes.txt
fetchMoviesByCategory()     // Organiza por categoria
detectContentType()         // Detecta se é filme/série/canal
isValidStreamFormat()       // Valida MP4/M3U8
filterValidStreams()        // Filtra apenas streams válidos
```

**Responsabilidade:** Buscar, parsear e validar conteúdo do filmes.txt.

---

### **3. `/components/Player.tsx`** - Player HTML5
```typescript
interface PlayerProps {
  movie: Movie;
  onBack: () => void;
}
```

**Responsabilidade:** Renderizar player HTML5 nativo com controles personalizados.

**Features:**
- ✅ Play/Pause
- ✅ Barra de progresso
- ✅ Controle de volume
- ✅ Velocidade de reprodução
- ✅ Picture-in-Picture
- ✅ Fullscreen
- ✅ Seek (avançar/voltar)

---

### **4. `/App.tsx`** - Gerenciamento de Estado
```typescript
const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);

const handlePlayMovie = (movie: Movie) => {
  setPlayingMovie(movie); // Abre o player
};

const handleBackFromPlayer = () => {
  setPlayingMovie(null); // Fecha o player
};
```

**Responsabilidade:** Gerenciar o estado de reprodução e renderização condicional.

**Renderização:**
```typescript
if (playingMovie) {
  return <Player movie={playingMovie} onBack={handleBackFromPlayer} />;
}
```

---

## 🔧 Como Funciona

### **Passo 1: Buscar Dados**
```typescript
import { fetchAndParseMovies } from './services/iptvService';

const movies = await fetchAndParseMovies();
// Retorna: Movie[]
```

### **Passo 2: Abrir Player**
```typescript
const movie: Movie = {
  id: '123',
  title: 'Filme Exemplo',
  category: 'Ação',
  logoUrl: 'https://exemplo.com/logo.jpg',
  streamUrl: 'https://exemplo.com/video.mp4',
  year: 2024
};

handlePlayMovie(movie);
```

### **Passo 3: Player Renderiza**
```typescript
<Player movie={movie} onBack={handleBackFromPlayer} />
```

O player usa:
```html
<video src={movie.streamUrl} autoPlay />
```

---

## 🧪 Como Testar

### **1. Teste Manual via URL**
Acesse: `http://localhost:5173/?iptv-test=true`

Isso abre o componente `IptvServiceTest` que:
- ✅ Busca o filmes.txt
- ✅ Parseia o conteúdo
- ✅ Mostra estatísticas
- ✅ Lista categorias
- ✅ Exibe primeiros 20 itens
- ✅ Valida formato dos streams

### **2. Teste Programático**
```typescript
import { fetchMoviesByCategory } from './services/iptvService';

const result = await fetchMoviesByCategory();

console.log('Total:', result.total);
console.log('Filmes:', result.movies);
console.log('Categorias:', result.categories);
```

---

## 🌐 CORS Proxies

O serviço usa **múltiplos proxies** para garantir resiliência:

```typescript
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',  // Primário
  'https://corsproxy.io/?',               // Fallback
];
```

**Como funciona:**
1. Tenta o primeiro proxy
2. Se falhar, tenta o segundo
3. Se todos falharem, retorna erro

---

## 📊 Formato do M3U

O `filmes.txt` segue o formato M3U:

```m3u
#EXTM3U
#EXTINF:-1 tvg-id="" tvg-name="TÍTULO" tvg-logo="URL_LOGO" group-title="CATEGORIA",TÍTULO
http://exemplo.com/video.mp4
#EXTINF:-1 tvg-id="" tvg-name="OUTRO FILME" tvg-logo="URL_LOGO" group-title="AÇÃO",OUTRO FILME
http://exemplo.com/outro.mp4
```

**Parsing:**
- Linha 1: `#EXTINF` com metadados
- Linha 2: URL do stream
- Repete...

---

## 🎨 Detecção de Tipo de Conteúdo

```typescript
detectContentType(movie: Movie): 'movie' | 'tv' | 'channel'
```

**Lógica:**
1. **Canal IPTV** → Se categoria/título contém: `canal`, `tv`, `ao vivo`, `live`
2. **Série** → Se categoria/título contém: `serie`, `temporada`, `episodio`
3. **Filme** → Padrão

---

## ✅ Validação de Streams

```typescript
isValidStreamFormat(url: string): boolean
```

**Formatos válidos:**
- ✅ `.mp4`
- ✅ `.m3u8`
- ✅ `.mp4?param=value`
- ✅ `.m3u8?token=xyz`

---

## 🔄 Integração com o Sistema Atual

### **Opção A: Substituir** (não recomendado)
Trocar todo o sistema atual pelo iptvService.

### **Opção B: Fallback** (recomendado)
Usar iptvService como fallback se o sistema Supabase falhar:

```typescript
async function loadContent() {
  try {
    // Tenta sistema Supabase (atual)
    return await loadEnrichedContent();
  } catch (error) {
    console.warn('Supabase falhou, usando iptvService...');
    // Fallback para iptvService
    return await fetchAndParseMovies();
  }
}
```

### **Opção C: Híbrido**
Usar iptvService para carga inicial rápida, depois enriquecer com TMDB:

```typescript
// 1. Carrega rápido com iptvService
const movies = await fetchAndParseMovies();
setMovies(movies); // Já exibe algo pro usuário

// 2. Enriquece em background
const enrichedMovies = await enrichWithTMDB(movies);
setMovies(enrichedMovies); // Atualiza com dados melhores
```

---

## 🐛 Debug

### **Console Logs**
O iptvService tem logs detalhados:

```
🔄 iptvService: Tentando fetch via https://api.allorigins.win/...
✅ iptvService: Sucesso com https://api.allorigins.win/ - 150 filmes
📊 iptvService: 15 categorias organizadas
```

### **Erros Comuns**

**1. "Failed to fetch"**
- **Causa:** Proxy CORS está fora do ar
- **Solução:** O sistema tenta o próximo proxy automaticamente

**2. "Empty response from proxy"**
- **Causa:** O filmes.txt está vazio ou inacessível
- **Solução:** Verificar se https://chemorena.com/filmes/filmes.txt está acessível

**3. "No movies were extracted"**
- **Causa:** Formato do M3U mudou
- **Solução:** Verificar o parsing no `parseM3UData()`

---

## 📈 Estatísticas

Ao testar, você verá:

```
📊 Total: 150
🎬 Filmes: 80
📺 Séries: 50
📡 Canais: 20
✅ Streams Válidos: 145
```

---

## 🚀 Próximos Passos

1. ✅ **FEITO:** Criar `/types.ts` com interface Movie
2. ✅ **FEITO:** Criar `/services/iptvService.ts`
3. ✅ **FEITO:** Atualizar `Player.tsx` para usar Movie do types.ts
4. ✅ **FEITO:** Criar `IptvServiceTest.tsx` para testes
5. ⏳ **TODO:** Integrar como fallback no sistema atual
6. ⏳ **TODO:** Adicionar enriquecimento TMDB opcional
7. ⏳ **TODO:** Implementar cache local (localStorage)

---

## 🎓 Exemplo Completo

```typescript
import { fetchAndParseMovies } from './services/iptvService';
import { Movie } from './types';

// 1. Buscar filmes
const movies = await fetchAndParseMovies();

// 2. Filtrar apenas filmes (não séries/canais)
const onlyMovies = movies.filter(m => 
  !m.category.toLowerCase().includes('serie') &&
  !m.category.toLowerCase().includes('canal')
);

// 3. Pegar o primeiro filme
const firstMovie = onlyMovies[0];

// 4. Reproduzir
handlePlayMovie(firstMovie);

// 5. O Player renderiza automaticamente!
```

---

## 📞 Suporte

- **Código:** `/services/iptvService.ts`
- **Testes:** Acesse `?iptv-test=true`
- **Console:** Pressione F12 para ver logs detalhados

---

## 🎉 Conclusão

O **iptvService** oferece uma alternativa simples e direta para carregar conteúdo do RedFlix sem depender do backend Supabase. É perfeito para:

- ✅ Desenvolvimento local
- ✅ Fallback quando o backend falha
- ✅ Testes rápidos
- ✅ Prototipagem

Use `?iptv-test=true` para testar agora mesmo! 🚀
