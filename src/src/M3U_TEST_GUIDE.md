# ⚡ Guia Rápido de Teste - M3U v5.1

## 🚀 Teste em 3 Minutos

### 1️⃣ Iniciar Aplicação
```bash
npm run dev
```

### 2️⃣ Abrir Console (F12)
Você deve ver:
```
🎬 Starting M3U content load...
⚡ Loading from lista.m3u...
✅ lista.m3u carregado de local: XXXXX bytes
📋 Total de entradas: 40
🎬 Filmes encontrados: 20
📺 Séries encontradas: 15
📡 Canais encontrados: 5
✅ M3U loaded successfully!
✅ Converted to Movie format: 35 items
🎉 M3U LOAD complete!
📊 Total: 35 | Filmes: 20 | Séries: 15
```

### 3️⃣ Verificar UI
- ✅ Banner principal aparece (Matrix)
- ✅ Carrosséis por categoria:
  - 🎬 FILMES ACAO (6 itens)
  - 🎭 FILMES DRAMA (5 itens)
  - 🚀 FILMES FICCAO (4 itens)
  - 📺 SERIES DRAMA (4 itens)
  - 🧙 SERIES FANTASIA (4 itens)

---

## 🧪 Testes Detalhados

### Teste A: Verificar Arquivo M3U
```bash
# Terminal
curl http://localhost:5173/data/lista.m3u | head -20

# Deve mostrar:
#EXTM3U
#EXTINF:-1 tvg-logo="..." group-title="FILMES ACAO",Matrix (1999)
https://cdn.example.com/filmes/matrix.ts
...
```

### Teste B: Console JavaScript
```javascript
// F12 → Console

// 1. Carregar M3U
const { loadM3UContent } = await import('./utils/m3uContentLoader.ts');
const data = await loadM3UContent();

// 2. Verificar dados
console.log('Filmes:', data.filmes.length);
console.log('Séries:', data.series.length);
console.log('Canais:', data.canais.length);

// 3. Ver primeiro filme
console.table(data.filmes[0]);

// Resultado esperado:
{
  id: 1000,
  title: "Matrix",
  streamUrl: "https://cdn.example.com/filmes/matrix.ts",
  category: "filmes acao",
  type: "movie"
}
```

### Teste C: Fallback GitHub
```bash
# 1. Renomear arquivo local
mv public/data/lista.m3u public/data/lista.m3u.backup

# 2. Recarregar página no navegador

# 3. Verificar console:
⚠️ Lista local indisponível, usando backup GitHub...
✅ lista.m3u carregado de github: XXXXX bytes

# 4. Restaurar arquivo
mv public/data/lista.m3u.backup public/data/lista.m3u
```

### Teste D: Network Tab
```javascript
// DevTools → Network → Recarregar

// Deve aparecer:
✅ lista.m3u → 200 OK (Size: ~50 KB)

// NÃO deve aparecer:
❌ filmes.json (deletado)
❌ series.json (deletado)
```

### Teste E: Busca e Filtro
```javascript
// Console
const { searchM3UContent } = await import('./utils/m3uContentLoader.ts');

// Buscar filme
const results = await searchM3UContent('Matrix');
console.table(results);

// Deve retornar:
[{
  id: 1000,
  title: "Matrix",
  ...
}]
```

### Teste F: Estatísticas
```javascript
// Console
const { getM3UStats } = await import('./utils/m3uContentLoader.ts');
const stats = await getM3UStats();

console.table(stats);

// Resultado esperado:
{
  totalFilmes: 20,
  totalSeries: 15,
  totalCanais: 5,
  categories: ['filmes acao', 'filmes drama', ...],
  lastUpdate: Date
}
```

---

## ✅ Checklist de Validação

### Arquivos
- [ ] `/public/data/lista.m3u` existe e tem conteúdo
- [ ] `/public/data/filmes.json` NÃO existe (deletado)
- [ ] `/public/data/series.json` NÃO existe (deletado)

### Console Logs
- [ ] `🎬 Starting M3U content load...` aparece
- [ ] `✅ M3U loaded successfully!` aparece
- [ ] `🎬 Filmes: 20 | 📺 Séries: 15` aparece
- [ ] `🎉 M3U LOAD complete!` aparece
- [ ] **ZERO erros 404**
- [ ] **ZERO erros de parse**

### UI
- [ ] Banner principal renderiza
- [ ] Carrosséis aparecem organizados
- [ ] Scroll horizontal funciona
- [ ] Hover mostra efeitos
- [ ] Click em filme abre detalhes
- [ ] Botão "Assistir" funciona
- [ ] Player reproduz vídeo

### Funcionalidades
- [ ] Carregamento < 2 segundos
- [ ] Sem tela branca/vazia
- [ ] Imagens carregam
- [ ] Categorias corretas
- [ ] TOP 10 funciona
- [ ] Continue Watching funciona

---

## 🐛 Troubleshooting

### Problema: Página vazia
```javascript
// Verificar console para erros
// Deve ter logs de M3U

// Se não aparecer nada:
const { checkM3UExists } = await import('./utils/m3uContentLoader.ts');
const exists = await checkM3UExists();
console.log('M3U existe:', exists);
```

### Problema: Erro 404 no M3U
```bash
# Verificar se arquivo existe
ls -lh public/data/lista.m3u

# Se não existir, criar
# (arquivo foi criado na implementação)
```

### Problema: Fallback não funciona
```javascript
// Testar URL GitHub manualmente
fetch('https://raw.githubusercontent.com/Fabriciocypreste/FIGMA1/main/public/data/lista.m3u')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
```

### Problema: Cache não atualiza
```javascript
// Limpar cache
const { clearM3UCache, loadM3UContent } = await import('./utils/m3uContentLoader.ts');
clearM3UCache();
const data = await loadM3UContent(true); // forceRefresh
```

---

## 🎯 Resultados Esperados

### Console Output Completo
```
🎬 Starting M3U content load...
⚡ Loading from lista.m3u...
✅ lista.m3u carregado de local: 50000 bytes
📋 Total de entradas: 40
🎬 Filmes encontrados: 20
📺 Séries encontradas: 15
📡 Canais encontrados: 5
✅ M3U loaded successfully!
🎬 Filmes: 20 | 📺 Séries: 15 | 📡 Canais: 5
✅ Converted to Movie format: 35 items
🎉 M3U LOAD complete!
📊 Total: 35 | Filmes: 20 | Séries: 15
🖼️ Starting image preloading...
```

### UI Renderizada
```
✅ Hero Banner: Matrix (1999)
✅ Carrossel 1: FILMES ACAO (6 filmes)
✅ Carrossel 2: FILMES DRAMA (5 filmes)
✅ Carrossel 3: FILMES FICCAO (4 filmes)
✅ Carrossel 4: FILMES CRIME (3 filmes)
✅ Carrossel 5: FILMES ROMANCE (2 filmes)
✅ Carrossel 6: SERIES DRAMA (4 séries)
✅ Carrossel 7: SERIES FANTASIA (4 séries)
✅ Carrossel 8: SERIES FICCAO (3 séries)
✅ Section: Continue Assistindo
✅ Section: TOP 10 Brasil
✅ Section: TOP 10 Em Alta
```

### Network Requests
```
✅ lista.m3u → 200 OK (50 KB)
✅ Imagens TMDB → 200 OK
❌ ZERO requisições para filmes.json
❌ ZERO requisições para series.json
```

---

## 📊 Métricas de Sucesso

### Performance
- ⏱️ Carregamento total: < 2 segundos
- 📦 Tamanho total: ~50 KB (M3U)
- 🔁 Cache hits: 99% após primeira carga
- 🚀 Time to Interactive: < 1 segundo

### Funcionalidades
- ✅ 100% das funcionalidades funcionando
- ✅ ZERO erros 404
- ✅ ZERO erros JavaScript
- ✅ Fallback GitHub funcionando
- ✅ Layout preservado

### UX
- ✅ Carregamento suave
- ✅ Sem tela branca
- ✅ Imagens carregam progressivamente
- ✅ Navegação fluida
- ✅ Responsivo mobile

---

## 🎉 Teste Passou!

Se todos os itens acima estão ✅, então:

```
┌──────────────────────────────────┐
│                                  │
│   ✅ TESTE COMPLETO APROVADO!   │
│                                  │
│   Sistema M3U v5.1 funcionando   │
│   perfeitamente!                 │
│                                  │
│   🚀 Pronto para produção       │
│                                  │
└──────────────────────────────────┘
```

---

*Guia de Teste v5.1 - RedFlix M3U Integration*  
*07 de Novembro de 2025*
