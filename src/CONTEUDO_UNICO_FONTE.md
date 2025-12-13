# 🎬 RedFlix - Configuração de Fonte Única de Conteúdo

## ✅ SISTEMA CONFIGURADO

O RedFlix agora está configurado para usar **EXCLUSIVAMENTE** os arquivos .txt remotos como fonte de conteúdo.

## 📡 Fontes de Dados

### Filmes e Séries
- **URL**: `https://chemorena.com/filmes/filmes.txt`
- **Formato**: M3U/M3U8
- **Carregamento**: Via servidor Supabase Edge Function
- **Endpoint**: `/make-server-2363f5d6/iptv/playlists/filmes`

### Canais IPTV
- **URL**: `https://chemorena.com/filmes/canaissite.txt`
- **Formato**: M3U/M3U8
- **Carregamento**: Via servidor Supabase Edge Function
- **Endpoint**: `/make-server-2363f5d6/iptv/playlists/canais`

## 🔄 Sistema de Fallback em 4 Níveis

### Nível 1: Servidor Supabase (PRIORITÁRIO)
```
Servidor → https://chemorena.com/filmes/filmes.txt → Parse → Retorna JSON
Frontend → Servidor Supabase → Recebe conteúdo processado
```

**Vantagens:**
- Sem problemas de CORS
- Cache no servidor
- Processamento otimizado
- Logs centralizados

### Nível 2: Carregamento Direto
```
Frontend → https://chemorena.com/filmes/filmes.txt (direto)
```

**Uso:**
- Quando o servidor Supabase está indisponível
- Pode ter problemas de CORS dependendo da configuração

### Nível 3: Cache Local
```
Usa dados em cache da última requisição bem-sucedida
```

**Duração:** 5 minutos
**Uso:** Offline ou problemas temporários

### Nível 4: Conteúdo Vazio
```
Retorna array vazio e exibe mensagem de erro ao usuário
```

## 📊 Fluxo de Dados

### 1. Filmes
```
filmes.txt → Servidor → Parse M3U → Detecção de tipo → Separação
                                                           ↓
                                            ┌──────────────┴──────────────┐
                                            ↓                             ↓
                                       Tipo: movie                   Tipo: tv
                                            ↓                             ↓
                                    Array de filmes              Array de séries
                                            ↓                             ↓
                                    MoviesPage.tsx               SeriesPage.tsx
                                            ↓                             ↓
                                  Enriquecimento TMDB          Enriquecimento TMDB
                                  (posters, sinopse)           (posters, sinopse)
```

### 2. Canais IPTV
```
canaissite.txt → Servidor → Parse M3U → Agrupamento por categoria
                                                    ↓
                                            ChannelsPage.tsx
                                                    ↓
                                            HLS Player (hls.js)
```

## 🎯 Detecção de Tipo (Filme vs Série)

O sistema detecta automaticamente se um item é filme ou série baseado em:

### Séries (palavras-chave):
- `serie`, `series`, `temporada`, `season`
- `s01`, `s02`, `s03` (padrão de temporadas)
- `episodio`, `episode`, `ep`

### Filmes (padrão):
- Qualquer item que não seja série ou canal
- Itens com anos no nome (ex: "Matrix 1999")
- Categoria contém "filme" ou "movie"

### Canais (ignorados na lista de filmes):
- `tv`, `canal`, `channel`
- `ao vivo`, `live`
- `news`, `sport`, `esporte`

## 🖼️ Enriquecimento de Imagens (TMDB)

### Processo:
1. **Carrega título** do filmes.txt
2. **Limpa o nome** (remove ano, qualidade, etc)
3. **Busca no TMDB** via API Search
4. **Extrai metadados**:
   - Poster (244x137px)
   - Backdrop
   - Sinopse
   - Avaliação
   - Gêneros
   - Data de lançamento

### Exemplo:
```
filmes.txt: "Matrix 1999 1080p Dublado"
           ↓
Limpeza: "Matrix"
           ↓
TMDB Search: /search/movie?query=Matrix
           ↓
Resultado: {
  poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
  backdrop_path: "/...",
  overview: "Um hacker descobre...",
  vote_average: 8.7,
  genre_ids: [28, 878]
}
```

## 📝 Formato do Arquivo filmes.txt

### Formato M3U Esperado:
```m3u
#EXTM3U

#EXTINF:-1 tvg-id="" tvg-name="Matrix" tvg-logo="https://..." group-title="FILMES ACAO",Matrix 1999
https://cdn.example.com/filmes/matrix.ts

#EXTINF:-1 tvg-id="" tvg-name="Breaking Bad S01E01" tvg-logo="https://..." group-title="SERIES DRAMA",Breaking Bad S01E01
https://cdn.example.com/series/bb-s01e01.ts
```

### Campos Importantes:
- `tvg-name`: Nome do filme/série
- `tvg-logo`: Logo/poster (opcional - será substituído pelo TMDB)
- `group-title`: Categoria (ex: "FILMES ACAO", "SERIES DRAMA")
- URL: Link direto para streaming

## 🚀 Como Adicionar Novo Conteúdo

### Opção 1: Editar filmes.txt no servidor
1. Acesse https://chemorena.com/filmes/filmes.txt
2. Adicione novas linhas no formato M3U
3. Salve o arquivo
4. O RedFlix atualizará automaticamente em até 5 minutos (cache)

### Opção 2: Forçar atualização no frontend
```javascript
import { clearM3UCache, loadM3UContent } from './utils/m3uContentLoader';

// Limpar cache
clearM3UCache();

// Forçar reload
const data = await loadM3UContent(true);
```

## 📦 Arquivos Relacionados

### Frontend
- `/utils/m3uContentLoader.ts` - Carregador principal de conteúdo
- `/utils/m3uParser.ts` - Parser de arquivos M3U
- `/components/MoviesPage.tsx` - Página de filmes
- `/components/SeriesPage.tsx` - Página de séries
- `/components/ChannelsPage.tsx` - Página de canais IPTV

### Backend
- `/supabase/functions/server/index.tsx` - Edge Function principal
- `/supabase/functions/server/iptv.ts` - Rotas IPTV (se existir)
- `/supabase/functions/server/proxy.ts` - Proxy para streams (se existir)

## 🔧 Manutenção

### Verificar Status
```javascript
import { getM3UStats } from './utils/m3uContentLoader';

const stats = await getM3UStats();
console.log({
  totalFilmes: stats.totalFilmes,
  totalSeries: stats.totalSeries,
  categorias: stats.categories,
  ultimaAtualizacao: stats.lastUpdate
});
```

### Logs Importantes
- `🎬 Carregando filmes.txt do servidor remoto...` - Iniciando carregamento
- `✅ X filmes carregados do servidor remoto` - Sucesso
- `❌ Erro ao carregar filmes.txt do servidor` - Falha (vai para fallback)
- `📦 Usando cache M3U` - Usando cache local

## ⚠️ Importante

### Arquivo Local (NÃO É MAIS USADO)
O arquivo `/public/data/lista.m3u` era usado como demo, mas agora está **DESATIVADO**.

### Única Fonte de Verdade
```
✅ https://chemorena.com/filmes/filmes.txt (ATIVO)
✅ https://chemorena.com/filmes/canaissite.txt (ATIVO)
❌ /public/data/lista.m3u (IGNORADO)
❌ /public/data/canais.json (IGNORADO)
```

## 🎨 Imagens Fixas (244 × 137px)

Todas as imagens são redimensionadas para **244 × 137px** (proporção Netflix):

### No TMDB:
```
Original: https://image.tmdb.org/t/p/original/poster.jpg
↓
Redimensionado: https://image.tmdb.org/t/p/w500/poster.jpg
↓
CSS: width: 244px, height: 137px
```

### Componentes com imagens fixas:
- `MovieCard` - Cards de filmes/séries
- `ContentRow` - Linhas de conteúdo
- `HeroSlider` - Banner principal
- `CategoryBanner` - Banners de categoria

## ✅ Checklist de Verificação

- [x] Sistema carrega de https://chemorena.com/filmes/filmes.txt
- [x] Sistema carrega de https://chemorena.com/filmes/canaissite.txt
- [x] Fallback em 4 níveis configurado
- [x] Cache de 5 minutos ativo
- [x] Detecção automática de tipo (filme/série)
- [x] Enriquecimento TMDB funcionando
- [x] Imagens fixas 244x137px
- [x] Logs detalhados no console
- [x] Arquivo local demo desativado

## 📞 Suporte

Se o conteúdo não estiver carregando:

1. **Verifique o console do navegador**
   - Abra DevTools (F12)
   - Aba Console
   - Procure por logs com 🎬 ou ❌

2. **Verifique o arquivo remoto**
   - Acesse https://chemorena.com/filmes/filmes.txt no navegador
   - Confirme que o arquivo existe e está no formato M3U

3. **Force atualização**
   - Pressione Ctrl+Shift+R (hard reload)
   - Limpe o cache do navegador

4. **Verifique o servidor Supabase**
   - Acesse os logs da Edge Function
   - Procure por erros de fetch ou parse

---

**Data de atualização**: 19 de novembro de 2025
**Versão**: 1.0 - Sistema de Fonte Única
