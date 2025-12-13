# ⚡ QUICK FIX - KV Store Errors (1 minuto)

## ❌ ERRO
```
Error: Could not find the table 'public.kv_store_2363f5d6'
```

---

## ✅ SOLUÇÃO RÁPIDA

### 1️⃣ Abra o Supabase Dashboard
- Vá em: https://supabase.com/dashboard
- Selecione seu projeto RedFlix
- Clique em **SQL Editor** (menu lateral)

### 2️⃣ Cole e Execute este SQL

```sql
-- CRIAR TABELA KV STORE
CREATE TABLE IF NOT EXISTS public.kv_store_2363f5d6 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_kv_store_expires_at 
  ON public.kv_store_2363f5d6(expires_at);

CREATE INDEX IF NOT EXISTS idx_kv_store_updated_at 
  ON public.kv_store_2363f5d6(updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
  ON public.kv_store_2363f5d6(key text_pattern_ops);

-- TRIGGER (se a função já existe)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'update_updated_at_column') THEN
    EXECUTE 'CREATE TRIGGER update_kv_store_updated_at
      BEFORE UPDATE ON public.kv_store_2363f5d6
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column()';
  END IF;
END $$;

-- FUNÇÃO DE LIMPEZA
CREATE OR REPLACE FUNCTION clean_expired_kv_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM public.kv_store_2363f5d6
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- RLS
ALTER TABLE public.kv_store_2363f5d6 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Permitir leitura pública de kv_store" 
  ON public.kv_store_2363f5d6;
CREATE POLICY "Permitir leitura pública de kv_store"
  ON public.kv_store_2363f5d6 FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Permitir escrita via service_role" 
  ON public.kv_store_2363f5d6;
CREATE POLICY "Permitir escrita via service_role"
  ON public.kv_store_2363f5d6 FOR ALL
  USING (auth.role() = 'service_role');

-- DADOS INICIAIS
INSERT INTO public.kv_store_2363f5d6 (key, value, expires_at) VALUES
  ('system:version', '{"version": "1.0.0", "build": "2024-11-19"}', NULL),
  ('cache:enabled', '{"enabled": true, "ttl": 3600}', NULL)
ON CONFLICT (key) DO NOTHING;
```

### 3️⃣ Clique em **RUN** (Ctrl+Enter)

### 4️⃣ Aguarde: ✅ **Success. No rows returned**

### 5️⃣ Recarregue o RedFlix (F5)

---

## ✅ VERIFICAR

Execute no SQL Editor:
```sql
SELECT * FROM public.kv_store_2363f5d6;
```

**Deve retornar 2 linhas:**
- `system:version`
- `cache:enabled`

---

## 🎊 PRONTO!

❌ **ANTES:**
```
Error: Could not find table 'kv_store_2363f5d6'
```

✅ **DEPOIS:**
```
Cache funcionando normalmente
```

---

**Tempo:** 1 minuto  
**Dificuldade:** ⭐ Fácil  
**Impacto:** 🔥 Crítico (resolve erros de cache)

---

## 📚 DOCUMENTAÇÃO COMPLETA
- Ver: `/FIX_KV_STORE_ERRORS.md`
- Migration: `/supabase/migrations/002_create_kv_store.sql`
- Verificação: `/supabase/migrations/verify_kv_store.sql`
