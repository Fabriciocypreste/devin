# 🚀 COMO IMPORTAR CONTEÚDO DO GITHUB

## ✅ Resumo Rápido

Agora você pode usar o conteúdo do repositório **github.com/Fabriciocypreste/lista** como fonte de dados na RedFlix!

---

## 📍 Como Acessar

### **Opção 1: Via URL**
Digite na barra de endereços:
```
?category=content-manager
```

### **Opção 2: Via Console**
Abra o console do navegador (F12) e digite:
```javascript
window.handleCategoryClick('content-manager')
```

### **Opção 3: Adicionar Link no Menu**
Edite o menu lateral e adicione:
```tsx
onClick={() => handleCategoryClick('content-manager')}
```

---

## 🎯 Passo a Passo

### **1. Acesse o Gerenciador de Conteúdo**
Use uma das opções acima para abrir a página

### **2. Clique em "Importar"**
Escolha entre:
- 🎬 **Filmes** (vermelho)
- 📺 **Séries** (azul)
- 📡 **Canais** (verde)

### **3. Acesse o GitHub**
No modal que abrir, clique no link direto para o arquivo:
- `filmes.txt`
- `series.txt`  
- `canais.txt`

### **4. Copie o Conteúdo Raw**
No GitHub:
1. Clique no botão **"Raw"**
2. Selecione tudo: **Ctrl+A** (Windows) ou **Cmd+A** (Mac)
3. Copie: **Ctrl+C** ou **Cmd+C**

### **5. Cole no Modal**
Volte para o modal e cole o conteúdo no campo de texto

### **6. Clique em "Importar"**
Aguarde o processamento e veja a mensagem de sucesso!

---

## 📊 O Que Acontece?

1. **Parse M3U**: O sistema lê o formato M3U e extrai:
   - Título
   - URL do stream
   - Logo/Poster
   - Categoria/Grupo
   - Metadados

2. **Salva no KV Store**: Dados ficam salvos no Supabase

3. **Disponibiliza Conteúdo**: Você pode usar em qualquer página

---

## 🎬 Como Usar o Conteúdo Importado

### **Exemplo: Carregar Filmes**

```tsx
import { loadImportedContent, convertToMovieFormat } from '../utils/contentImporter';

function MinhaPage() {
  const [filmes, setFilmes] = useState([]);

  useEffect(() => {
    async function loadFilmes() {
      const imported = await loadImportedContent('filmes');
      const formatted = imported.map(convertToMovieFormat);
      setFilmes(formatted);
    }
    loadFilmes();
  }, []);

  return (
    <div>
      <h1>{filmes.length} Filmes Importados</h1>
      <div className="grid">
        {filmes.map(filme => (
          <MovieCard key={filme.id} movie={filme} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🔧 APIs Disponíveis

### **1. Carregar Conteúdo**
```tsx
const filmes = await loadImportedContent('filmes');
const series = await loadImportedContent('series');
const canais = await loadImportedContent('canais');
```

### **2. Ver Estatísticas**
```tsx
const stats = await getImportStats();
// { filmes: 150, series: 80, canais: 200, total: 430 }
```

### **3. Limpar Conteúdo**
```tsx
await clearImportedContent('filmes'); // Limpa apenas filmes
await clearImportedContent();         // Limpa tudo
```

### **4. Converter para MovieCard**
```tsx
const movieFormat = convertToMovieFormat(importedItem);
// Compatível com <MovieCard />
```

---

## 🎨 Estrutura dos Dados

Cada item importado tem:
```typescript
{
  id: "nome-do-filme-0",              // ID único
  title: "Nome do Filme",             // Título
  url: "http://exemplo.com/stream",   // URL do stream
  logo: "https://exemplo.com/logo",   // Logo/poster
  group: "Ação",                      // Categoria
  description: "",                     // Descrição
  metadata: {                          // Metadados extras
    "tvg-logo": "...",
    "group-title": "..."
  }
}
```

---

## 📍 Arquivos Criados

✅ `/components/ImportContentModal.tsx` - Modal de importação  
✅ `/components/ContentManagerPage.tsx` - Página de gerenciamento  
✅ `/utils/contentImporter.ts` - Funções de parse e storage  
✅ `/supabase/functions/server/index.tsx` - API routes (já atualizado)  

---

## 🎯 Próximos Passos

### **1. Substituir TMDB por Conteúdo Importado**

Nas páginas de filmes/séries, substitua:
```tsx
// Antes
const filmes = await fetchFromTMDB('/movie/popular');

// Depois
const filmes = await loadImportedContent('filmes');
```

### **2. Usar no Player**

```tsx
function Player({ contentId }) {
  const [content] = await loadImportedContent('filmes');
  const item = content.find(c => c.id === contentId);
  
  return <video src={item.url} controls />;
}
```

### **3. Adicionar Busca**

```tsx
async function buscar(query) {
  const [filmes, series, canais] = await Promise.all([
    loadImportedContent('filmes'),
    loadImportedContent('series'),
    loadImportedContent('canais'),
  ]);
  
  const todos = [...filmes, ...series, ...canais];
  return todos.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase())
  );
}
```

---

## ⚡ Performance

- ✅ **Cache Local**: Dados salvos no KV Store
- ✅ **Não depende de APIs externas**: Funciona offline
- ✅ **Carregamento rápido**: Leitura direta do Supabase
- ✅ **Atualizável**: Reimporte quando o GitHub atualizar

---

## 🔍 Debug

### **Ver logs no console:**
```
📥 Importing filmes...
✅ Parsed 150 filmes items
💾 Saving 150 filmes to KV store
✅ Successfully imported 150 filmes
```

### **Verificar dados salvos:**
```tsx
const stats = await getImportStats();
console.log(stats); // { filmes: 150, series: 80, canais: 200, total: 430 }
```

---

## 🚨 Troubleshooting

**Problema**: "Nenhum item válido encontrado"  
**Solução**: Verifique se copiou do botão "Raw" no GitHub e se o arquivo começa com `#EXTM3U`

**Problema**: Conteúdo não aparece  
**Solução**: Use `loadImportedContent()` nas páginas para carregar os dados

**Problema**: Erro 404 na API  
**Solução**: Verifique se o servidor está rodando e as credenciais do Supabase estão corretas

---

## 📝 Links Úteis

- **Repositório**: https://github.com/Fabriciocypreste/lista
- **Documentação completa**: `/INSTRUCOES_CONTEUDO_GITHUB.md`
- **Exemplos de código**: `/examples/hover-code-brasileirao.tsx`

---

**Pronto!** Agora você tem controle total sobre o conteúdo da RedFlix usando o repositório GitHub como fonte única! 🎉
