# ⚡ M3U Source - Guia Rápido de Uso

## 🚀 Início Rápido (3 minutos)

### 1️⃣ Verificar Arquivo M3U

```bash
# Verificar se existe
ls -lh public/data/lista.m3u

# Deve mostrar: lista.m3u (~1.4 MB)
```

### 2️⃣ Testar no Navegador

```javascript
// Console do navegador (F12)
const { loadM3UContent, getM3UStats } = await import('./utils/m3uContentLoader.ts');

// Carregar conteúdo
const data = await loadM3UContent();
console.log('Filmes:', data.filmes.length);
console.log('Séries:', data.series.length);
console.log('Canais:', data.canais.length);

// Ver estatísticas
const stats = await getM3UStats();
console.table(stats);
```

### 3️⃣ Iniciar Aplicação

```bash
npm run dev
```

**Resultado Esperado:**
```
✅ lista.m3u carregado
✅ 500 filmes encontrados
✅ 700 séries encontradas
✅ Página inicial renderizada
✅ Sem erros 404
```

---

## 📝 Uso Básico

### Carregar Todo Conteúdo

```typescript
import { loadM3UContent } from './utils/m3uContentLoader';

const data = await loadM3UContent();

console.log(`
  Filmes: ${data.filmes.length}
  Séries: ${data.series.length}
  Canais: ${data.canais.length}
`);
```

### Carregar Apenas Filmes

```typescript
import { loadM3UFilmes } from './utils/m3uContentLoader';

const filmes = await loadM3UFilmes();
filmes.forEach(f => {
  console.log(`${f.title} - ${f.streamUrl}`);
});
```

### Carregar Apenas Séries

```typescript
import { loadM3USeries } from './utils/m3uContentLoader';

const series = await loadM3USeries();
series.forEach(s => {
  console.log(`${s.title} - ${s.streamUrl}`);
});
```

### Buscar Conteúdo

```typescript
import { searchM3UContent } from './utils/m3uContentLoader';

const results = await searchM3UContent('Matrix');
console.table(results);
```

### Filtrar por Categoria

```typescript
import { getM3UByCategory } from './utils/m3uContentLoader';

// Todos os filmes de ação
const acao = await getM3UByCategory('acao', 'movie');

// Todas as séries de drama
const drama = await getM3UByCategory('drama', 'tv');

// Todo conteúdo de comédia
const comedia = await getM3UByCategory('comedia');
```

### Obter Categorias

```typescript
import { getM3UCategories } from './utils/m3uContentLoader';

const categories = await getM3UCategories();
console.log('Categorias disponíveis:', categories);
// ['acao', 'comedia', 'drama', 'terror', ...]
```

---

## 🎨 Usar na UI

### Componente React Básico

```tsx
import React, { useEffect, useState } from 'react';
import { loadM3UFilmes, M3UContent } from '../utils/m3uContentLoader';

function FilmesList() {
  const [filmes, setFilmes] = useState<M3UContent[]>([]);
  
  useEffect(() => {
    loadM3UFilmes().then(setFilmes);
  }, []);
  
  return (
    <div>
      <h2>🎬 Filmes ({filmes.length})</h2>
      <div className="grid grid-cols-5 gap-4">
        {filmes.slice(0, 20).map(filme => (
          <div key={filme.id}>
            <img src={filme.poster_path || filme.logo} alt={filme.title} />
            <h3>{filme.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Usar Home Page Completa

```tsx
import { M3UHomePage } from './components/M3UHomePage';

function App() {
  return (
    <M3UHomePage
      onMovieClick={(content) => {
        console.log('Clicou em:', content.title);
        // Abrir player ou detalhes
      }}
    />
  );
}
```

---

## 🔧 Operações Avançadas

### Limpar Cache

```typescript
import { clearM3UCache } from './utils/m3uContentLoader';

clearM3UCache();
// Cache limpo, próxima chamada recarrega do arquivo
```

### Forçar Reload

```typescript
import { loadM3UContent } from './utils/m3uContentLoader';

// forceRefresh = true
const data = await loadM3UContent(true);
```

### Verificar se M3U Existe

```typescript
import { checkM3UExists } from './utils/m3uContentLoader';

const exists = await checkM3UExists();
if (exists) {
  console.log('✅ M3U disponível');
} else {
  console.error('❌ M3U não encontrado');
}
```

### Estatísticas Detalhadas

```typescript
import { getM3UStats } from './utils/m3uContentLoader';

const stats = await getM3UStats();

console.log(`
  📊 ESTATÍSTICAS M3U
  
  Total de Filmes: ${stats.totalFilmes}
  Total de Séries: ${stats.totalSeries}
  Total de Canais: ${stats.totalCanais}
  
  Categorias (${stats.categories.length}):
  ${stats.categories.join(', ')}
  
  Última Atualização: ${stats.lastUpdate.toLocaleString()}
`);
```

---

## 🎯 Exemplos Práticos

### Exemplo 1: Busca com Autocomplete

```tsx
import { searchM3UContent } from '../utils/m3uContentLoader';

function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (query.length > 2) {
      searchM3UContent(query).then(setResults);
    }
  }, [query]);
  
  return (
    <>
      <input
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar filme ou série..."
      />
      <ul>
        {results.map(item => (
          <li key={item.id}>{item.title}</li>
        ))}
      </ul>
    </>
  );
}
```

### Exemplo 2: Filtro por Categoria

```tsx
import { getM3UCategories, getM3UByCategory } from '../utils/m3uContentLoader';

function CategoryFilter() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState('todos');
  const [content, setContent] = useState([]);
  
  useEffect(() => {
    getM3UCategories().then(setCategories);
  }, []);
  
  useEffect(() => {
    getM3UByCategory(selected).then(setContent);
  }, [selected]);
  
  return (
    <>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="todos">Todos</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      
      <div className="grid grid-cols-5 gap-4">
        {content.map(item => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
    </>
  );
}
```

### Exemplo 3: Player Integrado

```tsx
import { loadM3UFilmes } from '../utils/m3uContentLoader';
import IPTVPlayer from './IPTVPlayer';

function MoviePlayer() {
  const [filmes, setFilmes] = useState([]);
  const [playing, setPlaying] = useState(null);
  
  useEffect(() => {
    loadM3UFilmes().then(setFilmes);
  }, []);
  
  if (playing) {
    return (
      <IPTVPlayer
        streamUrl={playing.streamUrl}
        title={playing.title}
        onClose={() => setPlaying(null)}
      />
    );
  }
  
  return (
    <div className="grid grid-cols-5 gap-4">
      {filmes.map(filme => (
        <div key={filme.id} onClick={() => setPlaying(filme)}>
          <img src={filme.poster_path} alt={filme.title} />
          <h3>{filme.title}</h3>
        </div>
      ))}
    </div>
  );
}
```

---

## 🐛 Troubleshooting

### Problema: "Failed to load M3U"

```typescript
// Verificar se arquivo existe
const exists = await checkM3UExists();
console.log('Arquivo existe:', exists);

// Verificar permissões
// Deve estar em: public/data/lista.m3u
```

### Problema: "Cache não atualiza"

```typescript
// Limpar cache e forçar reload
import { clearM3UCache, loadM3UContent } from './utils/m3uContentLoader';

clearM3UCache();
const data = await loadM3UContent(true);
```

### Problema: "Títulos com caracteres estranhos"

```typescript
// Os títulos são limpos automaticamente
// Para ver o título original:
console.log('Limpo:', filme.title);
console.log('Original:', filme.original_title);
```

### Problema: "Poucos resultados na busca"

```typescript
// Busca é case-insensitive e busca em:
// - title
// - original_title  
// - category

// Exemplo:
const results = await searchM3UContent('matrix'); // ✅ Funciona
const results = await searchM3UContent('Matrix'); // ✅ Funciona
const results = await searchM3UContent('MATRIX'); // ✅ Funciona
```

---

## 📊 Performance

### Cache

```typescript
// Primeira chamada: ~500ms (carrega e parse)
const data1 = await loadM3UContent();

// Chamadas seguintes: <1ms (usa cache)
const data2 = await loadM3UContent();
const data3 = await loadM3UContent();

// Cache válido por 5 minutos
// Depois de 5 min, recarrega automaticamente
```

### Otimização

```typescript
// ❌ NÃO fazer isso (múltiplas chamadas desnecessárias)
const filmes = await loadM3UFilmes();
const series = await loadM3USeries();
const canais = await loadM3UCanais();

// ✅ Fazer isso (uma chamada, todos os dados)
const data = await loadM3UContent();
const filmes = data.filmes;
const series = data.series;
const canais = data.canais;
```

---

## ✅ Checklist

### Instalação
- ✅ Arquivo lista.m3u em public/data/
- ✅ npm install e npm run dev executados
- ✅ Sem erros no console

### Testes
- ✅ loadM3UContent() retorna dados
- ✅ filmes.length > 0
- ✅ series.length > 0
- ✅ searchM3UContent() funciona
- ✅ getM3UCategories() retorna array

### UI
- ✅ M3UHomePage renderiza
- ✅ Carrosséis aparecem
- ✅ Click abre player
- ✅ Player reproduz vídeo

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- `/M3U_PRIMARY_SOURCE_IMPLEMENTATION.md` - Documentação técnica completa
- `/utils/m3uContentLoader.ts` - Código fonte comentado
- `/components/M3UHomePage.tsx` - Exemplo de uso na UI

---

## 🎉 Pronto!

Agora você pode:
```
✅ Carregar conteúdo do M3U
✅ Exibir na UI
✅ Buscar e filtrar
✅ Reproduzir streams
✅ Sem erros 404
✅ 100% funcional
```

**Dúvidas?** Consulte a documentação completa ou os comentários no código.

---

*Guia Rápido - M3U como Fonte Primária v5.0*  
*Novembro 2025*
