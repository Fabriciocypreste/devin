# 🎯 SETUP FINAL DO SUPABASE - PROJETO CORRETO

## ✅ INFORMAÇÕES DO SEU PROJETO:

```
Project ID:   vsztquvvnwlxdwyeoffh
Project URL:  https://vsztquvvnwlxdwyeoffh.supabase.co
Dashboard:    https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh
```

---

## 🔑 CHAVES RECEBIDAS:

### **✅ SERVICE_ROLE_KEY (Recebida!):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUzMDc0MCwiZXhwIjoyMDc5MTA2NzQwfQ.O0ul8YbFj_0umjce0eWxX0xrTz8i-Fs9q1f-fzqxKCo
```

**Validação:**
- ✅ Formato JWT válido
- ✅ Role: service_role
- ✅ Projeto: vsztquvvnwlxdwyeoffh
- ✅ Expira em: 2079 (mais de 50 anos!)

---

### **⚠️ ANON_KEY (Ainda precisa!):**

**Onde pegar:**
1. 🔗 Acesse: https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/settings/api
2. 📄 Procure por "**anon public**" (primeira seção)
3. 📋 Clique em "**Copy**"
4. 📝 Cole aqui

**A chave deve:**
- ✅ Começar com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- ✅ Conter `"role":"anon"` quando decodificada
- ✅ Conter `"ref":"vsztquvvnwlxdwyeoffh"`

---

## 📋 PRÓXIMOS PASSOS (DEPOIS DA ANON_KEY):

### **PASSO 1: Criar tabela KV no banco (2 min)**

**SQL a executar:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/sql/new

```sql
-- Criar tabela KV Store
CREATE TABLE IF NOT EXISTS kv_store_2363f5d6 (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_2363f5d6(key text_pattern_ops);

-- Criar função de atualização
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

-- Dados de teste
INSERT INTO kv_store_2363f5d6 (key, value) 
VALUES ('test:connection', '{"status":"ok","message":"Banco conectado!"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verificar
SELECT * FROM kv_store_2363f5d6;
```

---

### **PASSO 2: Configurar Secrets (5 min)**

**Onde configurar:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/settings/functions

**Secrets a adicionar:**

```
1️⃣ SUPABASE_URL
   https://vsztquvvnwlxdwyeoffh.supabase.co

2️⃣ SUPABASE_ANON_KEY
   <VOCÊ VAI FORNECER>

3️⃣ SUPABASE_SERVICE_ROLE_KEY
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUzMDc0MCwiZXhwIjoyMDc5MTA2NzQwfQ.O0ul8YbFj_0umjce0eWxX0xrTz8i-Fs9q1f-fzqxKCo

4️⃣ TMDB_API_KEY
   ddb1bdf6aa91bdf335797853884b0c1d
```

**Como adicionar:**
1. Clique em "[+ Add Secret]"
2. Name: `SUPABASE_URL`
3. Value: `https://vsztquvvnwlxdwyeoffh.supabase.co`
4. [Save]
5. Repita para os outros 3 secrets

---

### **PASSO 3: Deploy Edge Function (10 min)**

**Opção A: Via CLI (Recomendado)**

```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Deploy
supabase functions deploy make-server-2363f5d6 --project-ref vsztquvvnwlxdwyeoffh
```

**Opção B: Via Dashboard**

1. 🔗 Acesse: https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/functions
2. Clique em "Create a new function"
3. Name: `make-server-2363f5d6`
4. Cole o código de `/supabase/functions/server/index.tsx`
5. Deploy

---

## 🧪 TESTES:

### **Teste 1: Health Check**
```bash
curl https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/health
```

**Resultado esperado:** `{"status":"ok"}`

---

### **Teste 2: TMDB API**
```bash
curl "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/tmdb/trending/movie/day" \
  -H "Authorization: Bearer <SUA_ANON_KEY>"
```

**Resultado esperado:** JSON com filmes

---

### **Teste 3: KV Store**
```bash
curl -X POST "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/kv/set" \
  -H "Authorization: Bearer <SUA_ANON_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"key":"test","value":"funcionou!"}'
```

**Resultado esperado:** `{"success":true}`

---

## 📊 CHECKLIST COMPLETO:

### **Antes de começar:**
- [x] ✅ SERVICE_ROLE_KEY recebida
- [ ] ❌ ANON_KEY (precisa fornecer)

### **Setup (depois da ANON_KEY):**
- [ ] Atualizar `/utils/supabase/info.tsx` com ANON_KEY
- [ ] Executar SQL para criar tabela KV
- [ ] Adicionar 4 secrets na Edge Function
- [ ] Instalar Supabase CLI
- [ ] Fazer deploy da Edge Function
- [ ] Testar endpoint `/health`
- [ ] Testar endpoint `/tmdb/trending/movie/day`
- [ ] **TUDO FUNCIONANDO! 🎉**

---

## 🚀 PRÓXIMO PASSO:

**FORNEÇA A ANON_KEY** da página:
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/settings/api

**Seção:** "anon public" (primeira chave)

Assim que você fornecer, eu configuro tudo automaticamente! ⚡
