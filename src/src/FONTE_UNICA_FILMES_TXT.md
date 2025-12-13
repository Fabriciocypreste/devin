# 🎬 FONTE ÚNICA: filmes.txt

## ✅ REGRA IMPLEMENTADA

**ÚNICA FONTE DE CONTEÚDO**: https://chemorena.com/filmes/filmes.txt

Todas as outras fontes foram **REMOVIDAS**. O sistema agora usa **EXCLUSIVAMENTE** o arquivo filmes.txt conforme solicitado.

---

## 📁 ARQUIVOS CRIADOS/MODIFICADOS

| Arquivo | Status | Descrição |
|---------|--------|-----------|
| `/utils/filmesLoader.ts` | ✅ **NOVO** | Loader exclusivo para filmes.txt |
| `/App.tsx` | ✅ **ATUALIZADO** | Usa apenas filmesLoader.ts |

---

## 🔧 COMO FUNCIONA

### 1️⃣ **Carregamento de filmes.txt**

```
App.tsx inicia
       ↓
loadAllContent() chamado
       ↓
Fetch https://chemorena.com/filmes/filmes.txt
       ↓
Via proxy do servidor Supabase
       ↓
Parse M3U completo
       ↓
Separa filmes e séries
       ↓
Enriquece com TMDB (poster + logo)
       ↓
Retorna para App.tsx
```

### 2️⃣ **Parse M3U**

```m3u
#EXTINF:-1 tvg-logo="http://logo.png" group-title="Filmes",Nome do Filme
http://servidor.com/filme.mp4

Extrai:
  - Nome: "Nome do Filme"
  - Logo: "http://logo.png"
  - Categoria: "Filmes"
  - URL: "http://servidor.com/filme.mp4"
```

### 3️⃣ **Separação Filmes vs Séries**

**Padrões de Série Detectados:**
- `S01E01`, `S1E1` (padrão série)
- `Temporada 1`, `Season 1`
- `Temp 1`, `EP 1`
- Categoria contém "serie" ou "series"

**Se não for série → É filme**

### 4️⃣ **Enriquecimento TMDB**

Para cada item:

```
1. Limpar título (remover ano, qualidade, tags)
2. Buscar no TMDB
   - Search API: /search/movie ou /search/tv
3. Pegar primeiro resultado
4. Buscar detalhes
   - Details API: /movie/{id} ou /tv/{id}
   - Append: images (para pegar logos)
5. Extrair:
   - poster_path → Poster (capa) do filme/série
   - backdrop_path → Backdrop (fundo)
   - logo → Logo oficial (images.logos[0])
   - overview → Sinopse
   - vote_average → Nota
   - release_date → Data de lançamento
   - genres → Gêneros
6. Retornar item enriquecido
```

### 5️⃣ **Agrupamento de Séries**

```
Séries dispersas:
  - Breaking Bad S01E01
  - Breaking Bad S01E02
  - Breaking Bad S02E01
       ↓
groupSeriesByTitle()
       ↓
Série única:
  - Breaking Bad
    └── Temporada 1
        ├── Episódio 1
        └── Episódio 2
    └── Temporada 2
        └── Episódio 1
```

**Regra**: Na página inicial → Mostra só a série  
**Regra**: Na página de detalhes → Mostra todas as temporadas

---

## 🎨 PÁGINA INICIAL

### O que é exibido:

```
✅ FILMES:
   - Poster do TMDB (capa)
   - Logo do TMDB (se disponível)
   - Título
   - Ano
   - Nota TMDB

✅ SÉRIES:
   - Poster do TMDB (capa da série)
   - Logo do TMDB (se disponível)
   - Título base (sem temporada/episódio)
   - Ano
   - Nota TMDB
   
   ❌ NÃO mostra temporadas (só no detalhe)
```

### Layout dos Cards

```
┌──────────────┐
│   [POSTER]   │  ← Poster TMDB (244x137px)
│   [LOGO]     │  ← Logo TMDB (overlay)
│              │
│ Título       │
│ ★ 8.5 | 2023│
└──────────────┘
```

---

## 📺 PÁGINA DE DETALHES (MovieDetails)

### Para Filmes:
```
✅ Poster grande
✅ Logo
✅ Sinopse completa
✅ Gêneros
✅ Nota TMDB
✅ Botão "Assistir" → Reproduz MP4
```

### Para Séries:
```
✅ Poster grande
✅ Logo
✅ Sinopse completa
✅ Gêneros
✅ Nota TMDB
✅ TODAS AS TEMPORADAS:
    └── Temporada 1
        ├── Episódio 1 [Assistir]
        ├── Episódio 2 [Assistir]
    └── Temporada 2
        ├── Episódio 1 [Assistir]
```

---

## 🔗 URLS REAIS DO FILMES.TXT

### Formato Esperado:

```m3u
#EXTINF:-1 tvg-logo="http://..." group-title="Filmes",Filme X (2023)
http://servidor.com/filmes/filmex.mp4

#EXTINF:-1 tvg-logo="http://..." group-title="Séries",Série Y S01E01
http://servidor.com/series/seriey_s01e01.mp4
```

### Validação:

```
✅ URLs devem ser .mp4 (filmes)
✅ URLs devem ser .mp4 ou .mkv (séries)
✅ Cada linha HTTP é um vídeo real
✅ streamUrl é salvo exatamente como está no filmes.txt
```

---

## 📊 DADOS SALVOS

### Estrutura Movie:

```typescript
{
  id: number,                    // Auto-gerado
  title: string,                 // Do filmes.txt
  name: string,                  // Igual ao title
  streamUrl: string,             // URL REAL do filmes.txt
  poster_path: string,           // URL do TMDB
  backdrop_path: string,         // URL do TMDB
  logo: string,                  // URL do TMDB (logo oficial)
  overview: string,              // Sinopse do TMDB
  vote_average: number,          // Nota do TMDB
  release_date: string,          // Data do TMDB
  genre_ids: number[],           // IDs dos gêneros
  genres: Array<{id, name}>,     // Gêneros completos
  category: string,              // Do filmes.txt
  type: 'movie' | 'tv',          // Detectado automaticamente
  year: number,                  // Extraído ou do TMDB
  
  // Apenas para séries:
  seasons: Array<{
    season_number: number,
    name: string,
    episodes: Array<{
      episode_number: number,
      name: string,
      streamUrl: string,        // URL REAL do episódio
    }>
  }>
}
```

---

## 🎯 REGRAS OBRIGATÓRIAS

### ✅ O QUE É FEITO

1. **Carregar APENAS de filmes.txt**
2. **Parse M3U completo**
3. **Separar filmes e séries automaticamente**
4. **Buscar poster e logo no TMDB**
5. **Usar URLs REAIS do filmes.txt**
6. **Página inicial: 1 card por série** (sem temporadas)
7. **Página detalhes: TODAS as temporadas**
8. **Imagens fixas 244x137px** (via CSS)

### ❌ O QUE NÃO É FEITO

1. ❌ Não usa dados mock
2. ❌ Não inventa URLs
3. ❌ Não usa outras fontes
4. ❌ Não mostra temporadas na home
5. ❌ Não altera streamUrl original

---

## 🚀 PROCESSO COMPLETO

### Quando o usuário abre a página:

```
1. App.tsx carrega
2. loadAllContent() executa
3. Fetch filmes.txt via proxy
4. Parse M3U (todos os itens)
5. Separar filmes e séries
6. Enriquecer com TMDB (lotes de 5)
   - Buscar poster
   - Buscar logo
   - Buscar dados (sinopse, nota, etc)
7. Agrupar séries por título
8. Converter para formato App
9. Renderizar na página inicial
   - Filmes: 1 card com poster + logo
   - Séries: 1 card com poster + logo (SEM temporadas)
```

### Quando clica em um filme:

```
1. Abre MovieDetails
2. Mostra poster grande + logo
3. Mostra sinopse, gêneros, nota
4. Botão "Assistir"
5. Clica → Abre Player
6. Player reproduz streamUrl (MP4 real)
```

### Quando clica em uma série:

```
1. Abre MovieDetails
2. Mostra poster grande + logo
3. Mostra sinopse, gêneros, nota
4. Lista TODAS AS TEMPORADAS
5. Lista TODOS OS EPISÓDIOS
6. Clica em episódio → Abre Player
7. Player reproduz streamUrl (MP4 real)
```

---

## 📈 PERFORMANCE

### Otimizações Implementadas:

```
✅ Processamento em lotes (5 itens por vez)
✅ Delay entre lotes (500ms)
✅ Cache em memória (30min)
✅ Parse M3U eficiente
✅ Agrupamento inteligente de séries
```

### Tempos Esperados:

```
Parse M3U: ~1s (para 1000 itens)
Enriquecimento TMDB: ~30s (para 100 itens)
Total inicial: ~40s
Requests TMDB: 3/seg (controlado)
```

---

## 🔍 LOGS DE DEBUG

### Console Output:

```
🎬 ═══════════════════════════════════════════════════
🎬 CARREGANDO DE filmes.txt (ÚNICA FONTE)
🎬 URL: https://chemorena.com/filmes/filmes.txt
🎬 ═══════════════════════════════════════════════════
📡 Fazendo request via proxy...
✅ Arquivo carregado: 45678 caracteres
📋 Total de entradas parseadas: 234
🎬 Filmes: 156 | 📺 Séries: 78
🔄 Enriquecendo com TMDB...
   Enriquecido: 5/234
   Enriquecido: 10/234
   ...
   Enriquecido: 234/234
✅ ═══════════════════════════════════════════════════
✅ CARREGADO: 156 filmes + 78 séries
✅ ═══════════════════════════════════════════════════
✅ Carregado: 156 filmes + 45 séries (agrupadas)
✅ Total: 201 itens
📊 AMOSTRA DO PRIMEIRO ITEM:
  Título: Spider-Man No Way Home
  Tipo: movie
  Poster TMDB: ✅
  Logo TMDB: ✅
  StreamURL (MP4): ✅
  URL: http://servidor.com/filmes/spiderman...
```

---

## ✅ RESULTADO FINAL

### O que o usuário vê:

1. **Página Inicial:**
   - Cards com posters do TMDB
   - Logos overlay (se disponível)
   - 1 card por filme
   - 1 card por série (sem mostrar temporadas)

2. **Clica em Filme:**
   - Detalhes completos
   - Botão "Assistir"
   - Reproduz MP4 real

3. **Clica em Série:**
   - Detalhes completos
   - TODAS as temporadas listadas
   - TODOS os episódios listados
   - Clica em episódio → Reproduz MP4 real

### Garantias:

✅ **100% do conteúdo vem de filmes.txt**  
✅ **Posters e logos vêm do TMDB**  
✅ **URLs de stream são REAIS (MP4)**  
✅ **Temporadas só aparecem no detalhe**  
✅ **Nenhuma outra fonte é usada**  

---

**Data**: 20/11/2024  
**Status**: ✅ **IMPLEMENTADO**  
**Fonte Única**: https://chemorena.com/filmes/filmes.txt  
**Enriquecimento**: TMDB API (poster + logo)  
**Formato Streams**: MP4 (real)  
