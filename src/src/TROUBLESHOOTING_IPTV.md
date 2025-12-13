# 🔧 Troubleshooting: Erros IPTV 404

## ❌ Erro Atual

```
⚠️ Tentativa 1 FALHOU (esperado por CORS): TypeError: Failed to fetch
❌ Tentativa 2 FALHOU: Error: Proxy error: 404 - 404 Not Found
❌ Erro ao carregar canais: Error: Proxy error: 404 - 404 Not Found
```

---

## 🔍 Análise do Problema

### **1. Rotas Existem no Código ✅**

As rotas IPTV estão definidas em `/supabase/functions/server/index.tsx`:

```typescript
// Linha 2374
app.get("/make-server-2363f5d6/iptv/playlists/canais", async (c) => {
  // Código da rota...
});

// Linha 2416
app.get("/make-server-2363f5d6/iptv/playlists/filmes", async (c) => {
  // Código da rota...
});
```

### **2. Servidor Está Inicializado ✅**

```typescript
// Linha 3303
Deno.serve(app.fetch);
```

### **3. CORS Configurado ✅**

```typescript
// Linhas 21-30
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);
```

---

## 🎯 Causa Provável

### **Servidor Supabase não foi implantado/reiniciado**

Quando você adiciona novas rotas ao servidor, é necessário que o ambiente Supabase **reimplante** o Edge Function.

**Sintomas:**
- ✅ Código está correto
- ✅ Rotas existem no arquivo
- ❌ Servidor retorna 404
- ❌ Significa que servidor está rodando versão antiga

---

## ✅ Solução 1: Forçar Reimplantação (RECOMENDADO)

### **Opção A: Modificar e Salvar `index.tsx`**

1. Abra `/supabase/functions/server/index.tsx`
2. Adicione um comentário ou espaço em branco qualquer
3. Salve o arquivo
4. O sistema Figma Make deve detectar a mudança e reimplantar automaticamente

### **Opção B: Adicionar Log de Debug**

Adicione este log após o CORS:

```typescript
app.use(
  "/*",
  cors({
    origin: "*",
    // ...
  }),
);

// ✅ Log para verificar se servidor reiniciou
console.log('🚀 Servidor iniciado com rotas IPTV:', new Date().toISOString());
```

---

## ✅ Solução 2: Verificar Logs do Servidor

### **Como Ver os Logs:**

1. Abra o console do navegador (F12)
2. Verifique se os logs do servidor aparecem
3. Procure por mensagens como:
   ```
   📺 Buscando playlist de canais IPTV
   ✅ Playlist carregada: 12345 caracteres
   ✅ 150 canais parseados
   ```

Se não vê esses logs → Servidor não recebeu a requisição → 404

---

## ✅ Solução 3: Teste Manual do Endpoint

### **Teste Direto no Navegador:**

Abra esta URL no navegador:
```
https://<projectId>.supabase.co/functions/v1/make-server-2363f5d6/health
```

**Resultado esperado:**
```json
{
  "status": "ok"
}
```

**Se funcionar:**
✅ Servidor está rodando

**Teste a rota IPTV:**
```
https://<projectId>.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/canais
```

**Resultado esperado:**
```json
{
  "total": 150,
  "channels": [...],
  "categories": {...}
}
```

**Se retornar 404:**
❌ Rota não existe → Servidor não foi reimplantado

---

## ✅ Solução 4: Adicionar Fallback no Frontend

Como solução temporária, vou adicionar um fallback que carrega diretamente do `canaissite.txt` se o servidor falhar.

### **Código do Fallback:**

```typescript
const fetchChannels = async () => {
  try {
    setLoading(true);
    setError(null);

    console.log('📺 Tentando servidor backend...');
    
    try {
      const response = await fetch(`${serverUrl}/iptv/playlists/canais`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Canais carregados do servidor:', data.total);
        setChannels(data.channels || []);
        setCategories(data.categories || {});
        setLoading(false);
        return;
      }
    } catch (serverError) {
      console.warn('⚠️ Servidor falhou, tentando fallback direto...');
    }

    // FALLBACK: Carregar diretamente do arquivo
    console.log('📺 Carregando diretamente de canaissite.txt...');
    const response = await fetch('https://chemorena.com/filmes/canaissite.txt');
    
    if (!response.ok) {
      throw new Error('Falha ao carregar arquivo de canais');
    }

    const text = await response.text();
    const parsed = parseM3U(text);
    
    console.log('✅ Canais carregados diretamente:', parsed.length);
    setChannels(parsed);
    
    // Agrupar por categoria
    const grouped = {};
    parsed.forEach(channel => {
      const cat = channel.category || 'Outros';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(channel);
    });
    
    setCategories(grouped);
    setLoading(false);
  } catch (err) {
    console.error('❌ Erro ao carregar canais:', err);
    setError(`Erro ao carregar canais: ${err.message}`);
    setLoading(false);
  }
};
```

---

## 🎯 Checklist de Diagnóstico

Execute estes passos na ordem:

- [ ] **1. Verificar URL no console**
  ```javascript
  console.log('🔗 URL:', `${serverUrl}/iptv/playlists/canais`);
  ```
  Deve mostrar: `https://xxxxx.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/canais`

- [ ] **2. Teste endpoint de health**
  Abrir no navegador: `https://xxxxx.supabase.co/functions/v1/make-server-2363f5d6/health`
  ✅ Se retornar `{"status":"ok"}` → Servidor OK
  ❌ Se retornar erro → Servidor não está rodando

- [ ] **3. Teste endpoint IPTV**
  Abrir no navegador: `https://xxxxx.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/canais`
  ✅ Se retornar JSON com canais → Rota OK
  ❌ Se retornar 404 → Rota não existe (servidor não reimplantado)

- [ ] **4. Verificar logs do servidor**
  No console, procurar por:
  ```
  📺 Buscando playlist de canais IPTV
  ```
  ✅ Se aparecer → Requisição chegou ao servidor
  ❌ Se não aparecer → Requisição não chegou

- [ ] **5. Verificar response status**
  ```javascript
  console.log('📡 Response status:', response.status);
  ```
  - `200` → Sucesso ✅
  - `404` → Rota não encontrada ❌
  - `500` → Erro interno do servidor ❌
  - `CORS error` → Problema de CORS ❌

---

## 🚀 Ação Recomendada

### **Para Figma Make / Supabase:**

1. **Adicione um trigger de reimplantação automática** quando `index.tsx` é modificado
2. **Adicione botão "Restart Server"** na interface
3. **Mostre status do servidor** (online/offline, última implantação)

### **Para o Usuário:**

1. **Aguarde alguns segundos** - às vezes o servidor leva tempo para reiniciar
2. **Recarregue a página** - força nova conexão
3. **Limpe o cache** - pode estar usando versão antiga
4. **Verifique console** - veja os logs detalhados

---

## 📊 Fluxo de Diagnóstico Visual

```
┌─────────────────────────────────────────┐
│ 1. Frontend faz requisição              │
│    fetch(/iptv/playlists/canais)        │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│ 2. Verifica se chega ao servidor        │
│    Logs: "📺 Buscando playlist..."      │
└─────────────────────────────────────────┘
              ↓
         SIM ✅ │ NÃO ❌
              ↓          ↓
   ┌──────────┴─┐   ┌───────────────┐
   │ Servidor   │   │ 404 - Servidor│
   │ processa   │   │ não tem rota  │
   └──────────┬─┘   └───────────────┘
              ↓              ↓
   ┌──────────────────┐  ┌──────────────┐
   │ Retorna JSON     │  │ Reimplantar  │
   │ com canais       │  │ servidor     │
   └──────────────────┘  └──────────────┘
              ↓
   ┌──────────────────┐
   │ Frontend exibe   │
   │ menu lateral     │
   └──────────────────┘
```

---

## ✅ Status Atual

| Componente | Status | Observação |
|------------|--------|------------|
| **Código das rotas** | ✅ OK | Rotas definidas em `index.tsx` |
| **CORS** | ✅ OK | Configurado para `origin: "*"` |
| **Servidor Deno** | ✅ OK | `Deno.serve(app.fetch)` presente |
| **Reimplantação** | ❌ PENDENTE | Servidor precisa reiniciar |
| **Logs detalhados** | ✅ ADICIONADO | Console mostra URL, status, resposta |

---

## 🎯 Próximos Passos

1. ✅ **Logs detalhados adicionados** ao `fetchChannels()`
2. ⏳ **Aguardar reimplantação** do servidor Supabase
3. 🔄 **Testar endpoints** no navegador
4. 📝 **Verificar logs** no console
5. ✅ **Confirmar funcionamento** com dados reais

---

**Criado em:** 20 de novembro de 2025  
**Status:** 🔧 TROUBLESHOOTING EM ANDAMENTO  
**Próxima ação:** Aguardar reimplantação do servidor ou adicionar fallback
