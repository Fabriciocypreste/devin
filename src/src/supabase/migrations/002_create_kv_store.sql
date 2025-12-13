-- =====================================================
-- REDFLIX - KV STORE TABLE
-- =====================================================
-- Tabela de key-value store para cache e dados temporários
-- Usada pelo servidor Edge Function para armazenar:
-- - Cache de imagens
-- - Cache de dados da API
-- - Configurações temporárias
-- =====================================================

-- Criar tabela KV Store
CREATE TABLE IF NOT EXISTS public.kv_store_2363f5d6 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_kv_store_expires_at ON public.kv_store_2363f5d6(expires_at);
CREATE INDEX IF NOT EXISTS idx_kv_store_updated_at ON public.kv_store_2363f5d6(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON public.kv_store_2363f5d6(key text_pattern_ops);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_kv_store_updated_at
  BEFORE UPDATE ON public.kv_store_2363f5d6
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para limpar entradas expiradas (executar via cron job)
CREATE OR REPLACE FUNCTION clean_expired_kv_entries()
RETURNS void AS $$
BEGIN
  DELETE FROM public.kv_store_2363f5d6
  WHERE expires_at IS NOT NULL AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Habilitar RLS
ALTER TABLE public.kv_store_2363f5d6 ENABLE ROW LEVEL SECURITY;

-- Política: Permitir leitura pública (para cache de imagens)
CREATE POLICY "Permitir leitura pública de kv_store"
  ON public.kv_store_2363f5d6 FOR SELECT
  USING (true);

-- Política: Permitir escrita apenas via service_role (backend)
CREATE POLICY "Permitir escrita via service_role"
  ON public.kv_store_2363f5d6 FOR ALL
  USING (auth.role() = 'service_role');

-- =====================================================
-- COMENTÁRIOS
-- =====================================================

COMMENT ON TABLE public.kv_store_2363f5d6 IS 'Key-Value store para cache e dados temporários do RedFlix';
COMMENT ON COLUMN public.kv_store_2363f5d6.key IS 'Chave única (ex: image_cache:movie_123, tmdb_trending)';
COMMENT ON COLUMN public.kv_store_2363f5d6.value IS 'Valor em formato JSON';
COMMENT ON COLUMN public.kv_store_2363f5d6.expires_at IS 'Data de expiração (NULL = nunca expira)';

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

-- Inserir configuração de exemplo
INSERT INTO public.kv_store_2363f5d6 (key, value, expires_at) VALUES
  ('system:version', '{"version": "1.0.0", "build": "2024-11-19"}', NULL),
  ('cache:enabled', '{"enabled": true, "ttl": 3600}', NULL)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
