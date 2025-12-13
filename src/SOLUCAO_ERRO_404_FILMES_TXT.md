# 🔧 SOLUÇÃO: Erro 404 ao carregar filmes.txt

## ✅ CORREÇÕES IMPLEMENTADAS

### 1️⃣ **Proxy do Servidor Atualizado**
- **Arquivo**: `/supabase/functions/server/proxy.ts`
- **Rota criada**: `GET /make-server-2363f5d6/proxy-m3u?url={file_url}`
- **Função**: Fazer proxy de arquivos M3U evitando CORS

### 2️⃣ **Sistema de Fallback Triplo**
- **Arquivo**: `/utils/filmesLoader.ts`
- **3 tentativas automáticas** para carregar filmes.txt:

```
TENTATIVA 1: Proxy do Servidor Supabase
       ↓ (se falhar)
TENTATIVA 2: Fetch Direto (CORS)
       ↓ (se falhar)
TENTATIVA 3: Proxy Vite (dev mode)
       ↓ (se tudo falhar)
ERRO: Mensagem clara para o usuário
```

---

## 🔄 FLUXO DE CARREGAMENTO

### Tentativa 1: Proxy Servidor (RECOMENDADO)
```
URL: https://{projectId}.supabase.co/functions/v1/make-server-2363f5d6/proxy-m3u?url=https%3A%2F%2Fchemorena.com%2Ffilmes%2Ffilmes.txt

Headers:
  - Authorization: Bearer {publicAnonKey}

Servidor faz:
  1. Recebe request
  2. Faz fetch de https://chemorena.com/filmes/filmes.txt
  3. Adiciona headers CORS
  4. Retorna conteúdo com CORS permitido

Vantagens:
  ✅ Funciona em produção
  ✅ Evita bloqueios CORS
  ✅ Cache do servidor (3600s)
  ✅ Logs de debug
```

### Tentativa 2: Fetch Direto
```
URL: https://chemorena.com/filmes/filmes.txt

Modo: CORS
Cache: No-cache

Funciona se:
  ✅ Servidor permite CORS (Access-Control-Allow-Origin: *)
  
Pode falhar se:
  ❌ Servidor bloqueia CORS
  ❌ Certificado SSL inválido
```

### Tentativa 3: Proxy Vite (Dev)
```
URL: /filmes/filmes.txt

Vite redireciona para:
  → https://chemorena.com/filmes/filmes.txt

Funciona apenas em:
  ✅ Modo desenvolvimento (vite dev)
  
Não funciona em:
  ❌ Produção (build)
```

---

## 🔍 DEBUGGING

### Console Output Esperado (SUCESSO):

```
📡 Tentando carregar filmes.txt...
📡 Tentativa 1: Via proxy do servidor...
📄 Proxy M3U request for: https://chemorena.com/filmes/filmes.txt
✅ Proxy M3U success: 200
✅ Arquivo carregado via proxy: 45678 caracteres

🎬 ═══════════════════════════════════════════════════
🎬 CARREGANDO DE filmes.txt (ÚNICA FONTE)
🎬 ═══════════════════════════════════════════════════
📋 Total de entradas parseadas: 234
🎬 Filmes: 156 | 📺 Séries: 78
...
```

### Console Output (ERRO 404):

```
📡 Tentando carregar filmes.txt...
📡 Tentativa 1: Via proxy do servidor...
❌ Proxy M3U error: 404 Not Found
⚠️ Proxy falhou: 404 Not Found
📡 Tentativa 2: Fetch direto...
⚠️ Erro no fetch direto: NetworkError...
📡 Tentativa 3: Via proxy Vite...
✅ Arquivo carregado via Vite proxy: 45678 caracteres
(continua normalmente)
```

---

## 🛠️ ROTA DO SERVIDOR

### Endpoint: `/make-server-2363f5d6/proxy-m3u`

**Código em `/supabase/functions/server/proxy.ts`:**

```typescript
proxyRoutes.get("/make-server-2363f5d6/proxy-m3u", async (c) => {
  try {
    const fileUrl = c.req.query("url");

    if (!fileUrl) {
      return c.json({ error: "URL parameter is required" }, 400);
    }

    console.log(`📄 Proxy M3U request for: ${fileUrl}`);

    // Fazer request para o arquivo M3U
    const response = await fetch(decodeURIComponent(fileUrl), {
      headers: {
        'User-Agent': 'Mozilla/5.0 ...',
        'Accept': 'text/plain, text/*, application/vnd.apple.mpegurl, */*',
      },
    });

    if (!response.ok) {
      console.error(`❌ Proxy M3U error: ${response.status} ${response.statusText}`);
      return c.json({ 
        error: `Failed to fetch M3U file: ${response.status} ${response.statusText}` 
      }, response.status);
    }

    console.log(`✅ Proxy M3U success: ${response.status}`);

    const content = await response.text();

    // Retornar com CORS headers
    return new Response(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch (error) {
    console.error(`❌ Proxy M3U error:`, error);
    return c.json({ 
      error: `Proxy error: ${error.message}` 
    }, 500);
  }
});
```

---

## 🧪 TESTANDO MANUALMENTE

### 1. Testar Proxy do Servidor

```bash
curl -X GET \
  "https://{projectId}.supabase.co/functions/v1/make-server-2363f5d6/proxy-m3u?url=https%3A%2F%2Fchemorena.com%2Ffilmes%2Ffilmes.txt" \
  -H "Authorization: Bearer {publicAnonKey}"
```

**Resposta esperada:**
```
#EXTM3U
#EXTINF:-1 tvg-logo="..." group-title="Filmes",Nome do Filme
http://servidor.com/filme.mp4
...
```

### 2. Testar Fetch Direto

```javascript
fetch('https://chemorena.com/filmes/filmes.txt')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
```

**Se funcionar:** CORS está permitido  
**Se falhar:** Precisa usar proxy

### 3. Testar Proxy Vite

```javascript
// Em modo dev (npm run dev)
fetch('/filmes/filmes.txt')
  .then(r => r.text())
  .then(console.log)
  .catch(console.error);
```

**Se funcionar:** Vite proxy está ok  
**Se falhar:** Verificar vite.config.ts

---

## ⚠️ POSSÍVEIS PROBLEMAS

### Problema 1: Rota não encontrada (404)

**Sintoma:**
```
❌ Erro ao carregar filmes.txt: Error: HTTP 404
```

**Causa:**
- Servidor Supabase não está com a rota montada
- Prefixo `/make-server-2363f5d6/` faltando

**Solução:**
```typescript
// Em /supabase/functions/server/proxy.ts
proxyRoutes.get("/make-server-2363f5d6/proxy-m3u", ...)
//              ↑ Prefixo obrigatório

// Em /supabase/functions/server/index.tsx
app.route('/', proxyRoutes);
```

### Problema 2: CORS bloqueado

**Sintoma:**
```
⚠️ Erro no fetch direto: TypeError: Failed to fetch
```

**Causa:**
- Servidor chemorena.com bloqueia CORS

**Solução:**
- Usar proxy do servidor (Tentativa 1)
- Headers CORS já configurados no proxy

### Problema 3: URL inválida

**Sintoma:**
```
❌ Proxy M3U error: 404 Not Found
```

**Causa:**
- URL https://chemorena.com/filmes/filmes.txt não existe
- Caminho errado

**Solução:**
- Verificar URL real do arquivo
- Testar manualmente no navegador

---

## 🎯 VERIFICAÇÃO FINAL

### Checklist de Correção:

- [x] **Proxy do servidor criado** (`/supabase/functions/server/proxy.ts`)
- [x] **Rota com prefixo correto** (`/make-server-2363f5d6/proxy-m3u`)
- [x] **CORS headers configurados** (`Access-Control-Allow-Origin: *`)
- [x] **Sistema de fallback triplo** (Proxy → Direto → Vite)
- [x] **Logs de debug** (Console mostra cada tentativa)
- [x] **Tratamento de erros** (Mensagens claras)

### Como Verificar se Funcionou:

1. **Abrir console do navegador** (F12)
2. **Recarregar página**
3. **Verificar logs:**

```
✅ Sucesso:
   📡 Tentativa 1: Via proxy do servidor...
   ✅ Arquivo carregado via proxy: 45678 caracteres
   ✅ CARREGADO: 156 filmes + 78 séries

❌ Erro:
   ⚠️ Proxy falhou: 404
   ⚠️ Erro no fetch direto: ...
   ⚠️ Erro no Vite proxy: ...
   ❌ Não foi possível carregar filmes.txt
```

---

## 📚 ARQUIVOS MODIFICADOS

| Arquivo | Mudança |
|---------|---------|
| `/supabase/functions/server/proxy.ts` | ✅ Adicionado prefixo `/make-server-2363f5d6/` |
| `/utils/filmesLoader.ts` | ✅ Sistema de fallback triplo |

---

## 🚀 PRÓXIMOS PASSOS

### Se ainda der erro 404:

1. **Verificar se o servidor está rodando:**
   ```bash
   curl https://{projectId}.supabase.co/functions/v1/make-server-2363f5d6/health
   ```
   Deve retornar: `{"status":"ok"}`

2. **Verificar logs do servidor:**
   - Acessar Supabase Dashboard
   - Logs → Edge Functions
   - Procurar por erros

3. **Testar rota manualmente:**
   - Copiar URL completa do proxy
   - Testar no Postman ou curl
   - Ver resposta

4. **Verificar se filmes.txt existe:**
   - Abrir https://chemorena.com/filmes/filmes.txt no navegador
   - Se 404 → arquivo não existe
   - Se 200 → arquivo existe, problema é CORS/proxy

---

**Data**: 20/11/2024  
**Status**: ✅ **CORRIGIDO**  
**Sistema de Fallback**: 3 tentativas automáticas  
**Proxy do Servidor**: Configurado com CORS  
