# 🧪 Teste Rápido - Verificação de Fonte Única

## ✅ Como Verificar se o Sistema Está Carregando Corretamente

### 1️⃣ Teste Via Console do Navegador (Mais Rápido)

1. **Abra a aplicação RedFlix** no navegador
2. **Pressione F12** para abrir DevTools
3. **Vá para aba "Console"**
4. **Procure por estas mensagens**:

#### ✅ Carregamento CORRETO (do servidor remoto):
```
🎬 Carregando filmes.txt do servidor remoto...
📡 Buscando do servidor: https://[project].supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/filmes
✅ 150 filmes carregados do servidor remoto
🎬 Filmes processados: 95
📺 Séries processadas: 55
```

#### ⚠️ ATENÇÃO - Usando fallback demo:
```
❌ Erro ao carregar filmes.txt do servidor: [error]
❌ Falha ao carregar diretamente: [error]
❌ NENHUM CONTEÚDO DISPONÍVEL - Verifique a URL https://chemorena.com/filmes/filmes.txt
📚 Loading curated content library (65 movies + 35 series)
```

**Se aparecer as mensagens ⚠️, o arquivo remoto NÃO está acessível!**

---

### 2️⃣ Teste Via Comandos do Console

Cole estes comandos no console do navegador para verificar:

#### Testar carregamento de filmes:
```javascript
// Importar função
const { loadM3UContent } = await import('./utils/m3uContentLoader.js');

// Forçar reload
const data = await loadM3UContent(true);

// Verificar resultado
console.log('📊 RESULTADO:');
console.log('Filmes:', data.filmes.length);
console.log('Séries:', data.series.length);
console.log('Primeira filme:', data.filmes[0]);
console.log('Primeira série:', data.series[0]);
```

#### Testar estatísticas:
```javascript
const { getM3UStats } = await import('./utils/m3uContentLoader.js');
const stats = await getM3UStats();
console.table(stats);
```

#### Testar canais:
```javascript
const { loadChannels } = await import('./utils/channelsLoader.js');
const canais = await loadChannels();
console.log('📺 Canais:', canais.channels.length);
console.log('Grupos:', canais.groups);
console.table(canais.channels.slice(0, 5));
```

---

### 3️⃣ Teste Direto das URLs

Abra estas URLs diretamente no navegador para verificar se os arquivos existem:

#### Filmes e Séries:
```
https://chemorena.com/filmes/filmes.txt
```

**Deve mostrar**: Conteúdo M3U com linhas começando com `#EXTM3U` e `#EXTINF`

#### Canais IPTV:
```
https://chemorena.com/filmes/canaissite.txt
```

**Deve mostrar**: Conteúdo M3U8 com canais de TV

---

### 4️⃣ Verificação Visual na Interface

#### Na Página de Filmes:
1. Acesse a página **"Filmes"**
2. **Se carregar do remoto**: Você verá os filmes do seu arquivo .txt
3. **Se carregar do fallback**: Você verá filmes como "The Dark Knight", "Mad Max", "John Wick" (conteúdo demo)

#### Na Página de Séries:
1. Acesse a página **"Séries"**
2. **Se carregar do remoto**: Você verá as séries do seu arquivo .txt
3. **Se carregar do fallback**: Você verá séries como "Breaking Bad", "Game of Thrones" (conteúdo demo)

#### Na Página de Canais:
1. Acesse a página **"Canais"**
2. **Se carregar do remoto**: Você verá os canais do canaissite.txt
3. **Se carregar do fallback**: Você verá 5 canais demo "RedFlix ..."

---

### 5️⃣ Teste da API do Servidor

Teste se o servidor Supabase está fazendo o fetch corretamente:

#### Via navegador:
```
https://[SEU_PROJECT_ID].supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/filmes
```

**Troque [SEU_PROJECT_ID]** pelo ID do seu projeto Supabase.

**Resposta esperada (JSON)**:
```json
{
  "total": 150,
  "movies": [
    {
      "id": 1,
      "name": "Matrix",
      "title": "Matrix",
      "category": "FILMES ACAO",
      "url": "https://...",
      "logo": "https://..."
    },
    ...
  ],
  "categories": {
    "FILMES ACAO": [...],
    "SERIES DRAMA": [...]
  }
}
```

#### Via curl:
```bash
curl -H "Authorization: Bearer [ANON_KEY]" \
  https://[PROJECT_ID].supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/filmes
```

---

### 6️⃣ Checklist de Verificação Rápida

Marque cada item conforme você testa:

#### Arquivos Remotos:
- [ ] https://chemorena.com/filmes/filmes.txt está acessível
- [ ] Arquivo filmes.txt está no formato M3U correto
- [ ] https://chemorena.com/filmes/canaissite.txt está acessível
- [ ] Arquivo canaissite.txt está no formato M3U8 correto

#### Servidor Supabase:
- [ ] Edge Function está deployada
- [ ] Rota /iptv/playlists/filmes retorna JSON com filmes
- [ ] Rota /iptv/playlists/canais retorna JSON com canais
- [ ] Logs do servidor não mostram erros

#### Frontend:
- [ ] Console mostra "✅ X filmes carregados do servidor remoto"
- [ ] Console NÃO mostra "Loading curated content library"
- [ ] Página de Filmes mostra conteúdo do .txt (não demo)
- [ ] Página de Séries mostra conteúdo do .txt (não demo)
- [ ] Página de Canais mostra conteúdo do .txt (não demo)

#### Imagens (TMDB):
- [ ] Filmes têm posters (não placeholders)
- [ ] Séries têm posters (não placeholders)
- [ ] Console mostra buscas TMDB bem-sucedidas

---

### 7️⃣ Solução de Problemas

#### ❌ Problema: "NENHUM CONTEÚDO DISPONÍVEL"

**Causa**: Arquivo remoto não está acessível

**Solução**:
1. Verificar se https://chemorena.com/filmes/filmes.txt existe
2. Verificar formato do arquivo (deve ser M3U válido)
3. Verificar se o servidor está online
4. Verificar logs da Edge Function no Supabase

---

#### ❌ Problema: "Carregado via proxy: 0 caracteres"

**Causa**: Arquivo existe mas está vazio

**Solução**:
1. Abrir o arquivo .txt no navegador
2. Verificar se tem conteúdo
3. Verificar se começa com `#EXTM3U`
4. Adicionar conteúdo ao arquivo

---

#### ❌ Problema: Conteúdo demo aparece (Breaking Bad, Matrix, etc)

**Causa**: Fallback ativado - arquivo remoto falhou

**Solução**:
1. Seguir checklist acima
2. Verificar logs do console
3. Forçar reload: `clearM3UCache()` no console
4. Aguardar 5 minutos e tentar novamente

---

#### ❌ Problema: CORS error ao carregar diretamente

**Causa**: Servidor remoto não tem CORS configurado

**Solução**:
✅ **Normal!** O sistema usa o proxy do Supabase automaticamente.
- O fallback de carregamento direto é tentativa
- Se falhar, usa proxy do servidor (funciona)
- Sem ação necessária do usuário

---

### 8️⃣ Comandos Úteis de Debug

#### Limpar cache e forçar reload:
```javascript
const { clearM3UCache, loadM3UContent } = await import('./utils/m3uContentLoader.js');
clearM3UCache();
const fresh = await loadM3UContent(true);
console.log('Recarregado:', fresh.filmes.length, 'filmes');
```

#### Ver conteúdo do cache:
```javascript
const { loadM3UContent } = await import('./utils/m3uContentLoader.js');
const cached = await loadM3UContent(false); // false = usar cache
console.log('Cache:', cached);
```

#### Buscar por título:
```javascript
const { searchM3UContent } = await import('./utils/m3uContentLoader.js');
const results = await searchM3UContent('matrix');
console.table(results);
```

#### Ver categorias disponíveis:
```javascript
const { getM3UCategories } = await import('./utils/m3uContentLoader.js');
const cats = await getM3UCategories();
console.log('Categorias:', cats);
```

---

### 9️⃣ Exemplo de Arquivo filmes.txt Correto

```m3u
#EXTM3U

#EXTINF:-1 tvg-id="" tvg-name="Matrix" tvg-logo="https://image.tmdb.org/t/p/w500/..." group-title="FILMES ACAO",Matrix 1999
https://cdn.example.com/filmes/matrix.ts

#EXTINF:-1 tvg-id="" tvg-name="Breaking Bad S01E01" tvg-logo="" group-title="SERIES DRAMA",Breaking Bad S01E01
https://cdn.example.com/series/bb-s01e01.ts

#EXTINF:-1 tvg-id="" tvg-name="Inception" tvg-logo="" group-title="FILMES FICCAO",Inception 2010
https://cdn.example.com/filmes/inception.ts
```

**Pontos importantes**:
- Começa com `#EXTM3U`
- Cada entrada tem `#EXTINF:` com metadados
- Linha seguinte é a URL do stream
- `group-title` define a categoria
- Nome pode incluir ano, qualidade, etc (será limpo automaticamente)

---

### 🔟 Teste Rápido em 30 Segundos

1. **Abra o navegador** → Pressione F12
2. **Console** → Cole e execute:
```javascript
const { getM3UStats } = await import('./utils/m3uContentLoader.js');
const stats = await getM3UStats();
console.log('==========================================');
console.log('📊 STATUS DO SISTEMA:');
console.log('==========================================');
console.log('✅ Filmes carregados:', stats.totalFilmes);
console.log('✅ Séries carregadas:', stats.totalSeries);
console.log('✅ Canais carregados:', stats.totalCanais);
console.log('✅ Categorias:', stats.categories.join(', '));
console.log('✅ Última atualização:', stats.lastUpdate.toLocaleString());
console.log('==========================================');

if (stats.totalFilmes === 65 && stats.totalSeries === 35) {
  console.error('⚠️ ATENÇÃO: Usando conteúdo demo!');
  console.error('⚠️ Verifique: https://chemorena.com/filmes/filmes.txt');
} else {
  console.log('✅ SISTEMA OK - Carregando do arquivo remoto!');
}
```

3. **Resultado esperado**:
   - Se mostrar números diferentes de 65/35: ✅ **OK - Usando arquivo remoto**
   - Se mostrar exatamente 65/35: ⚠️ **DEMO - Verificar arquivo remoto**

---

## 📞 Resumo do Teste

### ✅ Tudo OK se:
- Console mostra "carregados do servidor remoto"
- Números são diferentes de 65 filmes / 35 séries
- Conteúdo exibido corresponde ao seu arquivo .txt
- Não aparecem filmes/séries como "The Dark Knight", "Breaking Bad" (demos)

### ⚠️ Verificar se:
- Console mostra "Loading curated content library"
- Números são exatamente 65 filmes / 35 séries
- Aparecem filmes/séries do conteúdo demo
- URL remota não está acessível

### ❌ Problema se:
- Console mostra erros repetidos
- Nenhum conteúdo carrega (nem demo)
- Aplicação trava ou não responde
- Edge Function retorna erro 500

---

**Criado em**: 19 de novembro de 2025  
**Versão**: 1.0  
**Objetivo**: Verificação rápida de que o sistema usa apenas fontes remotas
