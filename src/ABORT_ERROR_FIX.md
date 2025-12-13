# Fix: AbortError - Server Fetch Timeout Issues

## 🔧 Problema Identificado
O erro `AbortError: signal is aborted without reason` estava ocorrendo devido a:
1. **Timeout muito curto** (8 segundos) nas chamadas ao servidor
2. **Múltiplas chamadas simultâneas** ao servidor sobrecarregando-o
3. **Retry excessivo** (2 tentativas) causando mensagens de erro duplicadas

## ✅ Correções Implementadas

### 1. Aumento do Timeout (utils/tmdb.ts)
```typescript
// ANTES: 8 segundos
const timeoutId = setTimeout(() => controller.abort(), 8000);

// DEPOIS: 30 segundos
const timeoutId = setTimeout(() => controller.abort(), 30000);
```

### 2. Redução de Retries (utils/tmdb.ts)
```typescript
// ANTES: 2 retries
async function fetchFromTMDB(endpoint: string, retries = 2)

// DEPOIS: 1 retry
async function fetchFromTMDB(endpoint: string, retries = 1)
```

### 3. Melhor Tratamento de Erros (utils/tmdb.ts)
```typescript
// Agora identifica AbortError especificamente
if (error instanceof Error && error.name === 'AbortError') {
  console.error(`⏱️ Request timeout (attempt ${attempt}/${retries}): Server took too long to respond`);
}
```

### 4. Delay Entre Retries Aumentado (utils/tmdb.ts)
```typescript
// ANTES: 500ms * attempt
await new Promise(resolve => setTimeout(resolve, 500 * attempt));

// DEPOIS: 1000ms * attempt
await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
```

### 5. Timeout em Chamadas Diretas ao Servidor

#### utils/contentList.ts
```typescript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s

const response = await fetch(url, {
  headers: { 'Authorization': `Bearer ${publicAnonKey}` },
  signal: controller.signal
});

clearTimeout(timeoutId);
```

#### utils/channelsList.ts
```typescript
// Mesma implementação de timeout + AbortController
```

### 6. Sequencialização de Chamadas (App.tsx)
**ANTES:** Dois `useEffect` separados fazendo chamadas simultâneas
```typescript
useEffect(() => { /* fetch content */ }, []);
useEffect(() => { /* fetch TOP 10 */ }, []);
```

**DEPOIS:** Um único `useEffect` com chamadas sequenciais
```typescript
useEffect(() => {
  // 1. Fetch content list
  const contentList = await fetchContentList();
  
  // 2. Fetch content details
  const contentDetails = await fetchContentDetails(contentList);
  
  // 3. Small delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 4. Fetch TOP 10 Brasil
  const trendingSeries = await getTrending('tv', 'day');
  
  // 5. Small delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 6. Fetch TOP 10 Trending
  const trendingAll = await getTrending('all', 'day');
}, []);
```

## 📊 Resultados Esperados
- ✅ Menos erros de timeout (30s é suficiente para o servidor responder)
- ✅ Menos mensagens de erro no console (apenas 1 retry ao invés de 2)
- ✅ Melhor performance (chamadas sequenciais evitam sobrecarga)
- ✅ Logs mais informativos (distingue timeout de outros erros)
- ✅ Servidor tem tempo para processar cada requisição

## 🎯 Benefícios
1. **Estabilidade:** Servidor não é sobrecarregado com chamadas simultâneas
2. **Performance:** Delays estratégicos entre chamadas críticas
3. **UX:** Mensagens de erro mais claras e informativas
4. **Manutenibilidade:** Código mais limpo e fácil de debugar

## 🔍 Monitoramento
Os logs agora mostram claramente:
- `⏱️` Timeouts (AbortError)
- `❌` Erros gerais de servidor
- `✅` Sucessos com detalhes
- `🔄` Tentativas de retry com progresso
