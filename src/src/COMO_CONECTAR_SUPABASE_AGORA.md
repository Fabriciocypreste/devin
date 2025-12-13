# 🔌 COMO CONECTAR AO SUPABASE - GUIA COMPLETO

## ✅ O QUE JÁ ESTÁ CONFIGURADO:

### **1. Credenciais do Supabase:**
```typescript
// Arquivo: /utils/supabase/info.tsx
projectId = "glnmajvrxdwfyedsuaxx"
publicAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog"
```

**URL do Supabase:**
```
https://glnmajvrxdwfyedsuaxx.supabase.co
```

**Endpoint da Edge Function:**
```
https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6
```

---

## ❌ O QUE ESTÁ FALTANDO:

### **1. Variáveis de Ambiente (Secrets) no Supabase:**

Para a Edge Function funcionar, você precisa configurar estas variáveis:

```bash
SUPABASE_URL=https://glnmajvrxdwfyedsuaxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog
SUPABASE_SERVICE_ROLE_KEY=<VOCÊ PRECISA FORNECER>
SUPABASE_DB_URL=<OPCIONAL - VOCÊ PRECISA FORNECER>
TMDB_API_KEY=<JÁ EXISTE - ddb1bdf6aa91bdf335797853884b0c1d>
```

### **2. Banco de Dados (Tabela KV):**

A Edge Function usa uma tabela chamada `kv_store_2363f5d6` que precisa existir no banco.

---

## 📋 CHECKLIST PARA CONECTAR:

### **PASSO 1: Obter as chaves do Supabase**

1. ✅ **Acesse:** https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx
2. ✅ **Vá em:** Settings → API
3. ✅ **Copie:**
   - ✅ Project URL (já temos)
   - ✅ anon public key (já temos)
   - ❌ **service_role key** (SECRET - VOCÊ PRECISA COPIAR)

---

### **PASSO 2: Configurar Secrets da Edge Function**

1. ✅ **Acesse:** https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/functions
2. ✅ **Adicione estes secrets:**

```bash
SUPABASE_URL=https://glnmajvrxdwfyedsuaxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog
SUPABASE_SERVICE_ROLE_KEY=<COLE AQUI A SERVICE_ROLE_KEY>
TMDB_API_KEY=ddb1bdf6aa91bdf335797853884b0c1d
```

**IMPORTANTE:** Substitua `<COLE AQUI A SERVICE_ROLE_KEY>` pela chave real!

---

### **PASSO 3: Criar a tabela KV no banco**

Execute este SQL no Supabase:

```sql
-- Criar tabela KV Store
CREATE TABLE IF NOT EXISTS kv_store_2363f5d6 (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para buscas por prefixo
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_2363f5d6(key text_pattern_ops);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_kv_store_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger
DROP TRIGGER IF EXISTS update_kv_store_timestamp ON kv_store_2363f5d6;
CREATE TRIGGER update_kv_store_timestamp
  BEFORE UPDATE ON kv_store_2363f5d6
  FOR EACH ROW
  EXECUTE FUNCTION update_kv_store_updated_at();

-- Testar
SELECT 'Tabela KV criada com sucesso!' as status;
```

**Como executar:**
1. ✅ Acesse: https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/sql/new
2. ✅ Cole o SQL acima
3. ✅ Clique em "Run"

---

### **PASSO 4: Deploy da Edge Function**

A Edge Function já existe no código. Você precisa fazer deploy dela:

**Opção A - Via Supabase CLI (recomendado):**

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link com o projeto
supabase link --project-ref glnmajvrxdwfyedsuaxx

# Deploy da função
supabase functions deploy make-server-2363f5d6 --project-ref glnmajvrxdwfyedsuaxx
```

**Opção B - Via Dashboard:**
1. ✅ Acesse: https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/functions
2. ✅ Clique em "New Edge Function"
3. ✅ Nome: `make-server-2363f5d6`
4. ✅ Cole o conteúdo de `/supabase/functions/server/index.tsx`
5. ✅ Clique em "Deploy"

---

## 🧪 TESTAR A CONEXÃO:

### **Teste 1: Health Check**

```bash
curl https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/health
```

**Resultado esperado:**
```json
{"status":"ok"}
```

---

### **Teste 2: TMDB API**

```bash
curl "https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/tmdb/trending/movie/day" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog"
```

**Resultado esperado:**
```json
{
  "results": [
    { "id": 123, "title": "...", ... }
  ]
}
```

---

### **Teste 3: KV Store**

```bash
curl -X POST "https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/kv/set" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog" \
  -H "Content-Type: application/json" \
  -d '{"key":"test","value":"funcionou!"}'
```

---

## 📝 RESUMO - O QUE VOCÊ PRECISA FAZER:

```
1. ✅ Ir no Supabase Dashboard
2. ✅ Settings → API → Copiar SERVICE_ROLE_KEY
3. ✅ Settings → Functions → Adicionar Secrets
4. ✅ SQL Editor → Executar SQL de criação da tabela KV
5. ✅ Functions → Deploy da Edge Function
6. ✅ Testar os endpoints
```

---

## 🆘 INFORMAÇÕES QUE VOCÊ PRECISA ME DAR:

Para eu poder ajudar completamente, você precisa me fornecer:

1. **SERVICE_ROLE_KEY:** 
   - Onde encontrar: https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api
   - É uma chave que começa com `eyJhbG...` e é **MUITO LONGA**
   - ⚠️ **NÃO COMPARTILHE EM PÚBLICO!**

2. **Confirmação de que a tabela KV foi criada:**
   - Execute o SQL que forneci
   - Me diga se funcionou ou se deu erro

3. **Confirmação de que a Edge Function foi deployada:**
   - Me diga se você conseguiu fazer deploy
   - Ou me diga se precisa de ajuda

---

## 🔥 ATALHO RÁPIDO:

Se você quiser que EU faça tudo isso automaticamente, me forneça:

1. ✅ **SERVICE_ROLE_KEY** (encontre em Settings → API)
2. ✅ Confirme que posso executar SQL no seu banco
3. ✅ Confirme que posso fazer deploy da Edge Function

E eu configuro tudo para você! 🚀

---

## 📞 PRÓXIMO PASSO:

**ME FORNEÇA A SERVICE_ROLE_KEY** e eu configuro o resto!

Ou me diga qual parte você quer fazer manualmente.
