-- ========================================
-- GITHUB SYNC - CONFIGURAÇÃO DO BANCO DE DADOS
-- ========================================
-- Script SQL para preparar o Supabase para sincronização GitHub
-- Execute este script no Supabase Dashboard → SQL Editor
-- ========================================

-- ========================================
-- 1. CRIAR ÍNDICES ÚNICOS (OBRIGATÓRIO)
-- ========================================
-- Estes índices são necessários para o upsert funcionar
-- sem criar duplicatas

-- Remover índices antigos se existirem (lowercase)
DROP INDEX IF EXISTS unique_filme_nome;
DROP INDEX IF EXISTS unique_serie_nome;
DROP INDEX IF EXISTS unique_canal_nome;

-- Criar novos índices únicos no campo nome (case-sensitive)
CREATE UNIQUE INDEX IF NOT EXISTS unique_filme_nome ON filmes(nome);
CREATE UNIQUE INDEX IF NOT EXISTS unique_serie_nome ON series(nome);
CREATE UNIQUE INDEX IF NOT EXISTS unique_canal_nome ON canais(nome);

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ Índices únicos criados com sucesso!';
  RAISE NOTICE '   - unique_filme_nome';
  RAISE NOTICE '   - unique_serie_nome';
  RAISE NOTICE '   - unique_canal_nome';
END $$;

-- ========================================
-- 2. VERIFICAR ESTRUTURA DAS TABELAS
-- ========================================

-- Verificar se as tabelas existem
DO $$
DECLARE
  tabelas_faltando TEXT[];
BEGIN
  -- Verificar filmes
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'filmes') THEN
    tabelas_faltando := array_append(tabelas_faltando, 'filmes');
  END IF;
  
  -- Verificar series
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'series') THEN
    tabelas_faltando := array_append(tabelas_faltando, 'series');
  END IF;
  
  -- Verificar canais
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'canais') THEN
    tabelas_faltando := array_append(tabelas_faltando, 'canais');
  END IF;
  
  -- Reportar resultado
  IF array_length(tabelas_faltando, 1) > 0 THEN
    RAISE EXCEPTION '❌ ERRO: Tabelas não encontradas: %. Execute o script create_tables.sql primeiro!', 
      array_to_string(tabelas_faltando, ', ');
  ELSE
    RAISE NOTICE '✅ Todas as tabelas necessárias existem!';
  END IF;
END $$;

-- ========================================
-- 3. ADICIONAR COLUNA DE METADATA (OPCIONAL)
-- ========================================
-- Adiciona coluna JSON para metadados extras do M3U

-- Filmes
ALTER TABLE filmes 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Séries
ALTER TABLE series 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Canais
ALTER TABLE canais 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- Mensagem de confirmação
DO $$
BEGIN
  RAISE NOTICE '✅ Coluna metadata adicionada (ou já existia)';
END $$;

-- ========================================
-- 4. CRIAR FUNÇÃO DE SYNC LOG (OPCIONAL)
-- ========================================
-- Cria tabela para registrar histórico de sincronizações

-- Criar tabela de logs de sincronização
CREATE TABLE IF NOT EXISTS sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sync_type TEXT NOT NULL,  -- 'filmes', 'series', 'canais', 'all'
  status TEXT NOT NULL,      -- 'success', 'error', 'partial'
  total_items INTEGER DEFAULT 0,
  inserted_items INTEGER DEFAULT 0,
  updated_items INTEGER DEFAULT 0,
  error_count INTEGER DEFAULT 0,
  error_messages JSONB DEFAULT '[]',
  duration_ms INTEGER,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_sync_logs_sync_type ON sync_logs(sync_type);
CREATE INDEX IF NOT EXISTS idx_sync_logs_status ON sync_logs(status);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON sync_logs(created_at DESC);

-- Comentários
COMMENT ON TABLE sync_logs IS 'Histórico de sincronizações GitHub → Supabase';
COMMENT ON COLUMN sync_logs.sync_type IS 'Tipo de sincronização (filmes/series/canais/all)';
COMMENT ON COLUMN sync_logs.status IS 'Status da sincronização (success/error/partial)';

DO $$
BEGIN
  RAISE NOTICE '✅ Tabela sync_logs criada para histórico!';
END $$;

-- ========================================
-- 5. CRIAR VIEW DE ESTATÍSTICAS APRIMORADA
-- ========================================

-- View de estatísticas com informações de sincronização
CREATE OR REPLACE VIEW v_sync_stats AS
SELECT
  'filmes' as tipo,
  COUNT(*) as total_registros,
  COUNT(DISTINCT categoria) as total_categorias,
  MAX(created_at) as ultimo_registro,
  MAX(updated_at) as ultima_atualizacao,
  (SELECT COUNT(*) FROM sync_logs WHERE sync_type IN ('filmes', 'all') AND status = 'success') as syncs_sucesso
FROM filmes
UNION ALL
SELECT
  'series' as tipo,
  COUNT(*) as total_registros,
  COUNT(DISTINCT categoria) as total_categorias,
  MAX(created_at) as ultimo_registro,
  MAX(updated_at) as ultima_atualizacao,
  (SELECT COUNT(*) FROM sync_logs WHERE sync_type IN ('series', 'all') AND status = 'success') as syncs_sucesso
FROM series
UNION ALL
SELECT
  'canais' as tipo,
  COUNT(*) as total_registros,
  COUNT(DISTINCT categoria) as total_categorias,
  MAX(created_at) as ultimo_registro,
  MAX(updated_at) as ultima_atualizacao,
  (SELECT COUNT(*) FROM sync_logs WHERE sync_type IN ('canais', 'all') AND status = 'success') as syncs_sucesso
FROM canais;

DO $$
BEGIN
  RAISE NOTICE '✅ View v_sync_stats criada!';
END $$;

-- ========================================
-- 6. CRIAR FUNÇÃO DE BACKUP
-- ========================================

-- Função para criar backup antes de sincronizar
CREATE OR REPLACE FUNCTION backup_before_sync()
RETURNS TABLE(
  backup_id UUID,
  backup_timestamp TIMESTAMPTZ,
  total_filmes INTEGER,
  total_series INTEGER,
  total_canais INTEGER
) AS $$
DECLARE
  new_backup_id UUID;
  new_timestamp TIMESTAMPTZ;
BEGIN
  -- Gerar ID e timestamp
  new_backup_id := gen_random_uuid();
  new_timestamp := NOW();
  
  -- Criar tabela de backup se não existir
  CREATE TABLE IF NOT EXISTS backups (
    id UUID PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL,
    filmes_data JSONB,
    series_data JSONB,
    canais_data JSONB,
    total_filmes INTEGER,
    total_series INTEGER,
    total_canais INTEGER
  );
  
  -- Inserir backup
  INSERT INTO backups (id, timestamp, filmes_data, series_data, canais_data, total_filmes, total_series, total_canais)
  SELECT
    new_backup_id,
    new_timestamp,
    (SELECT jsonb_agg(row_to_json(f.*)) FROM filmes f),
    (SELECT jsonb_agg(row_to_json(s.*)) FROM series s),
    (SELECT jsonb_agg(row_to_json(c.*)) FROM canais c),
    (SELECT COUNT(*) FROM filmes),
    (SELECT COUNT(*) FROM series),
    (SELECT COUNT(*) FROM canais);
  
  -- Retornar informações do backup
  RETURN QUERY
  SELECT
    new_backup_id,
    new_timestamp,
    (SELECT COUNT(*)::INTEGER FROM filmes),
    (SELECT COUNT(*)::INTEGER FROM series),
    (SELECT COUNT(*)::INTEGER FROM canais);
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  RAISE NOTICE '✅ Função backup_before_sync() criada!';
  RAISE NOTICE '   Use: SELECT * FROM backup_before_sync();';
END $$;

-- ========================================
-- 7. POLÍTICAS RLS PARA SYNC_LOGS
-- ========================================

-- Habilitar RLS
ALTER TABLE sync_logs ENABLE ROW LEVEL SECURITY;

-- Permitir leitura pública
CREATE POLICY "Permitir leitura pública de logs" ON sync_logs
  FOR SELECT USING (true);

-- Permitir inserção pública (para sync)
CREATE POLICY "Permitir inserção de logs" ON sync_logs
  FOR INSERT WITH CHECK (true);

DO $$
BEGIN
  RAISE NOTICE '✅ Políticas RLS configuradas para sync_logs';
END $$;

-- ========================================
-- 8. VERIFICAÇÃO FINAL
-- ========================================

-- Query de verificação completa
DO $$
DECLARE
  status_check TEXT := '

========================================
✅ CONFIGURAÇÃO GITHUB SYNC COMPLETA!
========================================

📊 TABELAS:
';
  tabela_record RECORD;
  indice_record RECORD;
BEGIN
  -- Listar tabelas
  FOR tabela_record IN 
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('filmes', 'series', 'canais', 'sync_logs', 'backups')
    ORDER BY table_name
  LOOP
    status_check := status_check || '   ✅ ' || tabela_record.table_name || E'\n';
  END LOOP;
  
  status_check := status_check || E'\n📑 ÍNDICES ÚNICOS:\n';
  
  -- Listar índices únicos
  FOR indice_record IN
    SELECT indexname, tablename
    FROM pg_indexes
    WHERE schemaname = 'public'
    AND indexname LIKE 'unique_%'
    ORDER BY tablename, indexname
  LOOP
    status_check := status_check || '   ✅ ' || indice_record.indexname || 
                    ' (tabela: ' || indice_record.tablename || ')' || E'\n';
  END LOOP;
  
  status_check := status_check || E'\n📈 ESTATÍSTICAS:\n';
  status_check := status_check || '   • Filmes: ' || (SELECT COUNT(*) FROM filmes)::TEXT || E' registros\n';
  status_check := status_check || '   • Séries: ' || (SELECT COUNT(*) FROM series)::TEXT || E' registros\n';
  status_check := status_check || '   • Canais: ' || (SELECT COUNT(*) FROM canais)::TEXT || E' registros\n';
  
  status_check := status_check || E'\n🚀 PRÓXIMOS PASSOS:\n';
  status_check := status_check || E'   1. Acesse o Admin Dashboard\n';
  status_check := status_check || E'   2. Clique em "GitHub Sync"\n';
  status_check := status_check || E'   3. Execute "Sincronizar Tudo"\n';
  status_check := status_check || E'\n========================================\n';
  
  RAISE NOTICE '%', status_check;
END $$;

-- ========================================
-- QUERIES ÚTEIS PARA MONITORAMENTO
-- ========================================

-- Ver estatísticas gerais
-- SELECT * FROM v_sync_stats;

-- Ver últimos 10 syncs
-- SELECT * FROM sync_logs ORDER BY created_at DESC LIMIT 10;

-- Ver backups disponíveis
-- SELECT id, timestamp, total_filmes, total_series, total_canais FROM backups ORDER BY timestamp DESC;

-- Restaurar backup específico (CUIDADO!)
-- SELECT * FROM restore_backup('backup_id_aqui');

-- Ver duplicatas (deve retornar 0)
-- SELECT nome, COUNT(*) FROM filmes GROUP BY nome HAVING COUNT(*) > 1;
-- SELECT nome, COUNT(*) FROM series GROUP BY nome HAVING COUNT(*) > 1;
-- SELECT nome, COUNT(*) FROM canais GROUP BY nome HAVING COUNT(*) > 1;

-- ========================================
-- FIM DO SCRIPT
-- ========================================
