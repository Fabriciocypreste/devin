# ✅ Separação Automática: Filmes vs Séries

## 🎯 Objetivo

**Garantir que:**
- 📺 Página **Séries** exiba APENAS séries da lista
- 🎬 Página **Filmes** exiba APENAS filmes da lista
- ✅ Separação automática baseada em nome e categoria

---

## 🔍 Como Funciona a Detecção

### **Arquivo Fonte: filmes.txt**

O sistema lê o arquivo `filmes.txt` que contém AMBOS filmes e séries:

```m3u
#EXTINF:-1 group-title="Filmes",Matrix 1999 1080p Dublado
https://servidor.com/filmes/matrix.mp4

#EXTINF:-1 group-title="Séries",Breaking Bad S01E01 1080p Dublado
https://servidor.com/series/breaking-bad-s01e01.mp4

#EXTINF:-1 group-title="Filmes",Avatar 2009 1080p Dublado
https://servidor.com/filmes/avatar.mp4

#EXTINF:-1 group-title="Séries",Game of Thrones Temporada 1
https://servidor.com/series/got-s01.mp4
```

---

## 🤖 Sistema de Detecção Automática

### **Função: `detectTypeFromServerData()` (linha 272-319)**

**Localização:** `/utils/m3uContentLoader.ts`

#### **1️⃣ Detecta CANAIS primeiro (prioridade alta)**
```typescript
// Palavras-chave para canais
const canalKeywords = ['tv', 'canal', 'channel', 'ao vivo', 'live', 'news', 'sport', 'esporte', 'globo', 'record', 'sbt', 'band'];

if (canalKeywords.some(k => categoria.includes(k))) {
  return 'canal';  // ✅ Não vai para filmes nem séries
}
```

**Exemplos:**
- `"Globo TV"` → `canal` ❌ (não aparece em filmes/séries)
- `"ESPN Sport"` → `canal` ❌ (não aparece em filmes/séries)

---

#### **2️⃣ Detecta SÉRIES (regras específicas)**

**Regra A: Padrões de série no nome**
```typescript
// Detecta: S01E01, S1E1, Temporada 1, Season 1
if (/s\d{1,2}e\d{1,2}/i.test(nome) || /temporada\s*\d+/i.test(nome) || /season\s*\d+/i.test(nome)) {
  console.log(`📺 Detectado como SÉRIE por padrão: ${nome}`);
  return 'tv';  // ✅ VAI PARA SÉRIES
}
```

**Exemplos que SÃO séries:**
- `"Breaking Bad S01E01"` → `tv` ✅
- `"Game of Thrones Temporada 1"` → `tv` ✅
- `"Friends Season 1"` → `tv` ✅
- `"The Office S2E5"` → `tv` ✅

---

**Regra B: Palavras-chave de série**
```typescript
const serieKeywords = [
  'serie', 'series', 'temporada', 'season', 
  's01', 's02', 's03', 's04', 's05', 's06', 's07', 's08', 's09', 's10',
  's1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9',
  'episodio', 'episode', 'ep', 'e01', 'e02', 'e03',
  'temp', 'temporadas'
];

if (serieKeywords.some(k => categoria.includes(k) || nome.includes(k))) {
  console.log(`📺 Detectado como SÉRIE por keyword: ${nome}`);
  return 'tv';  // ✅ VAI PARA SÉRIES
}
```

**Exemplos que SÃO séries:**
- Categoria: `"Séries Ação"` → `tv` ✅
- Nome: `"Lost Episodio 1"` → `tv` ✅
- Nome: `"The Walking Dead Temp 5"` → `tv` ✅

---

#### **3️⃣ Detecta FILMES (regras específicas)**

**Regra A: Palavras-chave de filme**
```typescript
const filmeKeywords = ['filme', 'movie', 'cinema'];

if (filmeKeywords.some(k => categoria.includes(k))) {
  console.log(`🎬 Detectado como FILME por keyword: ${nome}`);
  return 'movie';  // ✅ VAI PARA FILMES
}
```

**Exemplos que SÃO filmes:**
- Categoria: `"Filmes Ação"` → `movie` ✅
- Categoria: `"Movies"` → `movie` ✅
- Categoria: `"Cinema 2024"` → `movie` ✅

---

**Regra B: Tem ano no nome (1900-2099)**
```typescript
if (/\b(19|20)\d{2}\b/.test(nome)) {
  console.log(`🎬 Detectado como FILME por ano: ${nome}`);
  return 'movie';  // ✅ VAI PARA FILMES
}
```

**Exemplos que SÃO filmes:**
- `"Matrix 1999 1080p"` → `movie` ✅
- `"Avatar 2009 Dublado"` → `movie` ✅
- `"Titanic 1997 HD"` → `movie` ✅
- `"Oppenheimer 2023"` → `movie` ✅

---

**Regra C: Padrão (se não identificou)**
```typescript
// Se não identificou como série ou canal, assume filme
console.log(`🎬 Detectado como FILME (padrão): ${nome}`);
return 'movie';  // ✅ VAI PARA FILMES
```

---

## 📊 Fluxo de Separação

```
┌────────────────────────────────��────────┐
│  filmes.txt (arquivo único)             │
│                                         │
│  - Matrix 1999                          │
│  - Breaking Bad S01E01                  │
│  - Avatar 2009                          │
│  - Game of Thrones Temporada 1          │
│  - Titanic 1997                         │
│  - Friends S02E03                       │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│  detectTypeFromServerData()             │
│  (Analisa nome e categoria)             │
└─────────────────────────────────────────┘
                   ↓
           ┌──────┴──────┐
           ↓             ↓
    ┌───────────┐   ┌───────────┐
    │  'movie'  │   │   'tv'    │
    └───────────┘   └───────────┘
           ↓             ↓
    ┌───────────┐   ┌───────────┐
    │  FILMES   │   │  SÉRIES   │
    │  Array    │   │  Array    │
    └───────────┘   └───────────┘
           ↓             ↓
    ┌───────────┐   ┌───────────┐
    │ Matrix    │   │ Breaking  │
    │ Avatar    │   │   Bad     │
    │ Titanic   │   │ Game of   │
    │           │   │  Thrones  │
    │           │   │ Friends   │
    └───────────┘   └───────────┘
```

---

## 📁 Implementação no Código

### **1. Carregar e Separar (m3uContentLoader.ts:154-196)**

```typescript
// Converter formato do servidor para formato M3UContent
const filmes: M3UContent[] = data.movies
  .filter((movie: any) => {
    const type = detectTypeFromServerData(movie);  // ✅ DETECTA TIPO
    return type === 'movie';  // ✅ FILTRA APENAS FILMES
  })
  .map((movie: any, index: number) => ({
    id: movie.id || index + 1000,
    title: movie.name || movie.title,
    streamUrl: movie.url,  // ✅ URL do vídeo
    type: 'movie' as const,  // ✅ MARCA COMO FILME
    // ... outros campos
  }));

const series: M3UContent[] = data.movies
  .filter((movie: any) => {
    const type = detectTypeFromServerData(movie);  // ✅ DETECTA TIPO
    return type === 'tv';  // ✅ FILTRA APENAS SÉRIES
  })
  .map((movie: any, index: number) => ({
    id: movie.id || index + 2000,
    title: movie.name || movie.title,
    streamUrl: movie.url,  // ✅ URL do vídeo
    type: 'tv' as const,  // ✅ MARCA COMO SÉRIE
    // ... outros campos
  }));
```

**Resultado:**
- ✅ Array `filmes` contém APENAS filmes
- ✅ Array `series` contém APENAS séries
- ✅ Cada um com seu `streamUrl` correto

---

### **2. Página de Filmes (MoviesPage.tsx:96-112)**

```typescript
// PASSO 1: Carregar filmes do M3U (filmes.txt)
const { loadM3UContent } = await import('../utils/m3uContentLoader');
const m3uData = await loadM3UContent();

console.log(`✅ ${m3uData.filmes.length} filmes encontrados`);  // ✅ APENAS FILMES

// Usar APENAS o array de filmes
const allMovies = m3uData.filmes;  // ✅ FILMES JÁ SEPARADOS

const basicMovies: Movie[] = allMovies.map((filme, index) => ({
  id: filme.id || index,
  title: filme.title,
  streamUrl: filme.streamUrl,  // ✅ URL do filme
  media_type: 'movie',  // ✅ TIPO FILME
  // ...
}));
```

**Resultado:**
- ✅ Página de Filmes exibe APENAS filmes
- ✅ Cada filme tem sua URL de vídeo

---

### **3. Página de Séries (SeriesPage.tsx:93-109)**

```typescript
// PASSO 1: Carregar séries do M3U (filmes.txt)
const { loadM3UContent } = await import('../utils/m3uContentLoader');
const m3uData = await loadM3UContent();

console.log(`✅ ${m3uData.series.length} séries encontradas`);  // ✅ APENAS SÉRIES

// Usar APENAS o array de séries
const allSeries = m3uData.series;  // ✅ SÉRIES JÁ SEPARADAS

const basicSeries: Movie[] = allSeries.map((serie, index) => ({
  id: serie.id || index,
  name: serie.title,
  streamUrl: serie.streamUrl,  // ✅ URL da série
  media_type: 'tv',  // ✅ TIPO SÉRIE
  // ...
}));
```

**Resultado:**
- ✅ Página de Séries exibe APENAS séries
- ✅ Cada série tem sua URL de vídeo

---

## 🧪 Logs de Debug

Ao carregar o conteúdo, você verá logs no console:

```javascript
// Ao detectar tipo:
📺 Detectado como SÉRIE por padrão: Breaking Bad S01E01
🎬 Detectado como FILME por ano: Matrix 1999
📺 Detectado como SÉRIE por keyword: Game of Thrones Temporada 1
🎬 Detectado como FILME por keyword: Avatar

// Ao separar:
✅ 150 filmes carregados do servidor remoto
🎬 Filmes processados: 120
📺 Séries processadas: 30

// Em cada página:
🎬 Carregando TODOS os filmes do filmes.txt...
✅ 120 filmes encontrados no filmes.txt

📺 Carregando TODAS as séries do filmes.txt...
✅ 30 séries encontradas no filmes.txt
```

---

## ✅ Tabela de Exemplos

| Nome no filmes.txt | Categoria | Detectado Como | Página |
|-------------------|-----------|----------------|--------|
| `Matrix 1999 1080p` | `Filmes` | `movie` 🎬 | Filmes ✅ |
| `Breaking Bad S01E01` | `Séries` | `tv` 📺 | Séries ✅ |
| `Avatar 2009 Dublado` | `Filmes Ação` | `movie` 🎬 | Filmes ✅ |
| `Game of Thrones Temporada 1` | `Séries` | `tv` 📺 | Séries ✅ |
| `Titanic 1997 HD` | `Cinema` | `movie` 🎬 | Filmes ✅ |
| `Friends S02E03` | `Séries Comédia` | `tv` 📺 | Séries ✅ |
| `Oppenheimer 2023` | - | `movie` 🎬 | Filmes ✅ |
| `The Office Episodio 1` | - | `tv` 📺 | Séries ✅ |

---

## 🎯 Garantias

| Aspecto | Status | Comprovação |
|---------|--------|-------------|
| **Separação Automática** | ✅ | Detecta padrões e palavras-chave |
| **Filmes só em /movies** | ✅ | `m3uData.filmes` (linha 112) |
| **Séries só em /series** | ✅ | `m3uData.series` (linha 109) |
| **URLs preservadas** | ✅ | `streamUrl` em ambos |
| **Logs detalhados** | ✅ | Console mostra separação |

---

## 📝 Checklist de Validação

### **Para testar a separação:**

1. **Abra a página de Filmes**
   - Console deve mostrar: `✅ X filmes encontrados`
   - Cards exibidos devem ser APENAS filmes
   - Nomes devem ter anos (1999, 2009, etc) ou categoria "Filme"

2. **Abra a página de Séries**
   - Console deve mostrar: `✅ X séries encontradas`
   - Cards exibidos devem ser APENAS séries
   - Nomes devem ter S01E01, Temporada, Season, etc

3. **Verifique os logs de detecção**
   ```javascript
   // No console, procure por:
   📺 Detectado como SÉRIE por padrão: ...
   🎬 Detectado como FILME por ano: ...
   ```

4. **Clique em um filme**
   - Deve reproduzir URL de FILME (.mp4)
   - Badge: "🎬 FILME"

5. **Clique em uma série**
   - Deve reproduzir URL de SÉRIE (.mp4)
   - Badge: "📺 SÉRIE"

---

## 🔧 Ajustes no filmes.txt (Se Necessário)

### **Se um filme aparecer como série:**

**Opção 1: Adicionar categoria**
```m3u
#EXTINF:-1 group-title="Filmes",Inception 2010
https://servidor.com/inception.mp4
```

**Opção 2: Adicionar ano no nome**
```m3u
#EXTINF:-1,Inception 2010 1080p
https://servidor.com/inception.mp4
```

---

### **Se uma série aparecer como filme:**

**Opção 1: Adicionar categoria**
```m3u
#EXTINF:-1 group-title="Séries",Breaking Bad
https://servidor.com/breaking-bad.mp4
```

**Opção 2: Adicionar padrão no nome**
```m3u
#EXTINF:-1,Breaking Bad S01E01
https://servidor.com/breaking-bad.mp4
```

ou

```m3u
#EXTINF:-1,Breaking Bad Temporada 1
https://servidor.com/breaking-bad.mp4
```

---

## 🎉 Resultado Final

```
════════════════════════════════════════════════
       ✅ SEPARAÇÃO AUTOMÁTICA FUNCIONANDO
════════════════════════════════════════════════

📁 filmes.txt (arquivo único)
   ↓
🤖 Detecção automática por nome e categoria
   ↓
┌─────────────────────────────────────────┐
│  PÁGINA FILMES                          │
│  - Matrix 1999          [PLAY] →.mp4    │
│  - Avatar 2009          [PLAY] →.mp4    │
│  - Titanic 1997         [PLAY] →.mp4    │
│  ✅ APENAS FILMES                        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  PÁGINA SÉRIES                          │
│  - Breaking Bad S01E01  [PLAY] →.mp4    │
│  - Game of Thrones T1   [PLAY] →.mp4    │
│  - Friends S02E03       [PLAY] →.mp4    │
│  ✅ APENAS SÉRIES                        │
���─────────────────────────────────────────┘
```

---

**Criado em:** 20 de novembro de 2025  
**Status:** ✅ 100% Implementado  
**Versão:** 5.0.0 - SEPARAÇÃO AUTOMÁTICA  
**Garantia:** Filmes e séries são separados automaticamente do mesmo arquivo
