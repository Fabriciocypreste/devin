-- ========================================
-- SETUP COMPLETO DO SUPABASE - EXECUTAR MANUALMENTE
-- ========================================
-- 
-- INSTRUÇÕES:
-- 1. Acesse: https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/sql/new
-- 2. Cole este SQL inteiro
-- 3. Clique em "Run" ou "Execute"
-- 4. Verifique se não deu erro
-- ========================================

-- Criar tabela KV Store
CREATE TABLE IF NOT EXISTS kv_store_2363f5d6 (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para buscas por prefixo
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix 
ON kv_store_2363f5d6(key text_pattern_ops);

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

-- Inserir dados de teste
INSERT INTO kv_store_2363f5d6 (key, value) 
VALUES ('test:connection', '{"status":"ok","message":"Banco conectado com sucesso!"}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Verificar se tudo funcionou
SELECT 
  'Tabela KV criada com sucesso!' as status,
  COUNT(*) as total_entries
FROM kv_store_2363f5d6;

-- Mostrar estrutura da tabela
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'kv_store_2363f5d6'
ORDER BY ordinal_position;

-- Mostrar dados de teste
SELECT * FROM kv_store_2363f5d6 LIMIT 5;
