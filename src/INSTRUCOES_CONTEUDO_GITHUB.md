# 📦 IMPORTAR CONTEÚDO REAL DO GITHUB

## 🎯 Objetivo

Usar o conteúdo do repositório **github.com/Fabriciocypreste/lista** como fonte única de dados para filmes, séries e canais na RedFlix.

---

## 📁 Repositório

**URL:** https://github.com/Fabriciocypreste/lista

**Arquivos disponíveis:**
- `filmes.txt` - Lista de filmes em formato M3U
- `series.txt` - Lista de séries em formato M3U
- `canais.txt` - Lista de canais IPTV em formato M3U

---

## 🚀 Como Importar (Passo a Passo)

### **1️⃣ Acesse a Página de Gerenciamento**

Na RedFlix, acesse:
```
/content-manager
```

Ou adicione um botão no menu principal que leve para `<ContentManagerPage />`

---

### **2️⃣ Clique em "Importar Conteúdo"**

Você verá 3 cards:
- 🎬 **Filmes** (vermelho)
- 📺 **Séries** (azul)  
- 📡 **Canais** (verde)

Clique em **"Importar"** no card desejado.

---

### **3️⃣ Acesse o GitHub**

O modal mostrará um link direto para o arquivo:
```
https://github.com/Fabriciocypreste/lista/blob/main/filmes.txt
https://github.com/Fabriciocypreste/lista/blob/main/series.txt
https://github.com/Fabriciocypreste/lista/blob/main/canais.txt
```

---

### **4️⃣ Copie o Conteúdo Raw**

No GitHub:
1. Clique no botão **"Raw"** (canto superior direito)
2. Pressione **Ctrl+A** (Windows/Linux) ou **Cmd+A** (Mac)
3. Pressione **Ctrl+C** (Windows/Linux) ou **Cmd+C** (Mac)

---

### **5️⃣ Cole no Modal da RedFlix**

1. Volte para o modal aberto
2. Cole o conteúdo no campo de texto (Ctrl+V / Cmd+V)
3. Clique em **"Importar"**

---

### **6️⃣ Aguarde o Processamento**

O sistema irá:
- ✅ Fazer parse do formato M3U
- ✅ Extrair títulos, URLs e metadados
- ✅ Salvar no KV Store do Supabase
- ✅ Exibir mensagem de sucesso

---

## 📊 Estrutura dos Dados

### **Formato M3U Esperado**

```m3u
#EXTM3U
#EXTINF:-1 tvg-logo="https://exemplo.com/logo.png" group-title="Ação", Nome do Filme
http://exemplo.com/stream.m3u8

#EXTINF:-1 tvg-logo="https://exemplo.com/logo2.png" group-title="Drama", Outro Filme
http://exemplo.com/stream2.m3u8
```

### **Dados Extraídos**

Para cada item, o sistema extrai:
```typescript
{
  id: "nome-do-filme-0",              // ID gerado automaticamente
  title: "Nome do Filme",             // Título extraído
  url: "http://exemplo.com/stream",   // URL do stream
  logo: "https://exemplo.com/logo",   // Logo/poster
  group: "Ação",                      // Categoria/grupo
  description: "",                     // Descrição (se houver)
  metadata: {                          // Metadados extras
    "tvg-logo": "...",
    "group-title": "..."
  }
}
```

---

## 🔧 Arquitetura do Sistema

### **1. Frontend (Components)**

```
/components/ImportContentModal.tsx
├─ Modal com 3 abas (Filmes, Séries, Canais)
├─ Textarea para colar conteúdo M3U
├─ Botão "Importar" que chama parseM3UContent()
└─ Validação e preview do conteúdo

/components/ContentManagerPage.tsx
├─ Dashboard com estatísticas
├─ Cards para cada tipo de conteúdo
├─ Botões de importar e limpar
└─ Instruções de uso
```

### **2. Utils (Parsing)**

```
/utils/contentImporter.ts
├─ parseM3UContent()      → Parse formato M3U
├─ saveImportedContent()  → Salva no servidor
├─ loadImportedContent()  → Carrega do servidor
├─ getImportStats()       → Estatísticas
└─ convertToMovieFormat() → Converte para MovieCard
```

### **3. Backend (API)**

```
/supabase/functions/server/index.tsx

GET    /imported-content/:type     → Carrega filmes/series/canais
POST   /imported-content/:type     → Salva filmes/series/canais
DELETE /imported-content/:type     → Limpa filmes/series/canais
GET    /imported-content-stats     → Estatísticas gerais
```

### **4. Storage (KV Store)**

```
imported-content:filmes   → Array<ImportedContent>
imported-content:series   → Array<ImportedContent>
imported-content:canais   → Array<ImportedContent>
```

---

## 🎬 Como Usar o Conteúdo Importado

### **Exemplo 1: Exibir Filmes Importados**

```tsx
import { loadImportedContent, convertToMovieFormat } from '../utils/contentImporter';

function FilmesPage() {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    async function load() {
      const imported = await loadImportedContent('filmes');
      const formatted = imported.map(convertToMovieFormat);
      setFilmes(formatted);
    }
    load();
  }, []);

  return (
    <div>
      <h1>Filmes do GitHub</h1>
      <div className="grid">
        {filmes.map(filme => (
          <MovieCard key={filme.id} movie={filme} />
        ))}
      </div>
    </div>
  );
}
```

### **Exemplo 2: Exibir Canais IPTV**

```tsx
function CanaisPage() {
  const [canais, setCanais] = useState([]);

  useEffect(() => {
    async function load() {
      const imported = await loadImportedContent('canais');
      setCanais(imported);
    }
    load();
  }, []);

  return (
    <div>
      <h1>Canais IPTV</h1>
      {canais.map(canal => (
        <div key={canal.id}>
          <img src={canal.logo} alt={canal.title} />
          <h3>{canal.title}</h3>
          <p>Grupo: {canal.group}</p>
          <button onClick={() => playStream(canal.url)}>
            Assistir
          </button>
        </div>
      ))}
    </div>
  );
}
```

### **Exemplo 3: Buscar em Todo Conteúdo**

```tsx
async function searchAll(query: string) {
  const [filmes, series, canais] = await Promise.all([
    loadImportedContent('filmes'),
    loadImportedContent('series'),
    loadImportedContent('canais'),
  ]);

  const all = [...filmes, ...series, ...canais];
  
  return all.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );
}
```

---

## 🔍 Endpoints da API

### **1. Salvar Conteúdo**

```http
POST /make-server-2363f5d6/imported-content/filmes
Authorization: Bearer {publicAnonKey}
Content-Type: application/json

{
  "items": [
    {
      "id": "filme-1",
      "title": "Nome do Filme",
      "url": "http://...",
      "logo": "http://...",
      "group": "Ação"
    }
  ]
}
```

**Resposta:**
```json
{
  "success": true,
  "count": 150,
  "type": "filmes"
}
```

---

### **2. Carregar Conteúdo**

```http
GET /make-server-2363f5d6/imported-content/filmes
Authorization: Bearer {publicAnonKey}
```

**Resposta:**
```json
[
  {
    "id": "filme-1",
    "title": "Nome do Filme",
    "url": "http://...",
    "logo": "http://...",
    "group": "Ação"
  }
]
```

---

### **3. Estatísticas**

```http
GET /make-server-2363f5d6/imported-content-stats
Authorization: Bearer {publicAnonKey}
```

**Resposta:**
```json
{
  "filmes": 150,
  "series": 80,
  "canais": 200,
  "total": 430
}
```

---

### **4. Limpar Conteúdo**

```http
DELETE /make-server-2363f5d6/imported-content/filmes
Authorization: Bearer {publicAnonKey}
```

**Resposta:**
```json
{
  "success": true
}
```

---

## ✅ Vantagens Dessa Abordagem

| Vantagem | Descrição |
|----------|-----------|
| 🎯 **Fonte Única** | Todo conteúdo vem do repositório GitHub |
| 🚀 **Performance** | Dados salvos no KV Store (rápido) |
| 💾 **Persistência** | Conteúdo permanece após importação |
| 🔄 **Atualizável** | Reimporte quando o GitHub atualizar |
| 📱 **Offline-friendly** | Funciona sem depender de APIs externas |
| 🎨 **Flexível** | Adicione metadados customizados |
| 🔍 **Buscável** | Sistema de busca unificado |

---

## 🛠️ Próximos Passos

### **1. Integrar com Páginas Existentes**

Substitua os loaders atuais:
```tsx
// Antes (TMDB)
const filmes = await fetchFromTMDB('/movie/popular');

// Depois (GitHub)
const filmes = await loadImportedContent('filmes');
```

### **2. Adicionar Filtros por Grupo**

```tsx
const acao = filmes.filter(f => f.group === 'Ação');
const drama = filmes.filter(f => f.group === 'Drama');
```

### **3. Criar Sistema de Favoritos**

```tsx
// Salvar favorito com ID do conteúdo importado
await saveFavorite(userId, filme.id);
```

### **4. Implementar Player Unificado**

```tsx
function UniversalPlayer({ contentId, type }) {
  const [content] = await loadImportedContent(type);
  const item = content.find(c => c.id === contentId);
  
  return <VideoPlayer src={item.url} />;
}
```

---

## 📝 Logs e Debug

### **Console do Browser**

```
📥 Importing filmes...
✅ Parsed 150 filmes items
💾 Saving 150 filmes to KV store
✅ Saved 150 filmes to KV store
✅ Successfully imported 150 filmes
```

### **Console do Servidor (Edge Function)**

```
💾 Saving 150 filmes to KV store
```

---

## 🚨 Troubleshooting

### **Problema: "Nenhum item válido encontrado"**

**Causa:** Formato M3U inválido ou vazio

**Solução:** 
1. Verifique se copiou do botão "Raw" no GitHub
2. Confirme que o arquivo começa com `#EXTM3U`
3. Verifique se há linhas com URLs válidas

---

### **Problema: "Failed to save"**

**Causa:** Erro na comunicação com servidor

**Solução:**
1. Verifique se o servidor está rodando
2. Confirme as credenciais do Supabase
3. Veja logs no console do navegador

---

### **Problema: Conteúdo não aparece nas páginas**

**Causa:** Páginas ainda usando TMDB

**Solução:**
1. Substitua `fetchFromTMDB()` por `loadImportedContent()`
2. Use `convertToMovieFormat()` para compatibilidade
3. Recarregue a página

---

## 🎯 Checklist de Implementação

- [x] ✅ Modal de importação criado
- [x] ✅ Parser de M3U implementado
- [x] ✅ API routes no servidor
- [x] ✅ KV Store configurado
- [x] ✅ Página de gerenciamento
- [ ] 🔲 Integrar com páginas de filmes
- [ ] 🔲 Integrar com páginas de séries
- [ ] 🔲 Integrar com player IPTV
- [ ] 🔲 Adicionar busca unificada
- [ ] 🔲 Implementar sistema de categorias

---

**Versão:** 1.0.0  
**Última atualização:** 25/11/2025  
**Repositório:** github.com/Fabriciocypreste/lista
