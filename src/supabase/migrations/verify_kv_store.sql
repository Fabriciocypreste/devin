-- =====================================================
-- VERIFICAÇÃO RÁPIDA - KV STORE
-- =====================================================
-- Execute este script para verificar se tudo está OK
-- =====================================================

-- 1. Verificar se a tabela existe
SELECT 
  'Tabela existe' as status,
  COUNT(*) as total_registros
FROM public.kv_store_2363f5d6;

-- 2. Verificar índices
SELECT 
  indexname as indice,
  indexdef as definicao
FROM pg_indexes
WHERE tablename = 'kv_store_2363f5d6'
ORDER BY indexname;

-- 3. Verificar políticas RLS
SELECT 
  policyname as politica,
  cmd as comando,
  qual as condicao
FROM pg_policies
WHERE tablename = 'kv_store_2363f5d6'
ORDER BY policyname;

-- 4. Verificar função de limpeza existe
SELECT 
  proname as funcao,
  prosrc as codigo
FROM pg_proc
WHERE proname = 'clean_expired_kv_entries';

-- 5. Verificar trigger
SELECT 
  tgname as trigger,
  tgenabled as habilitado
FROM pg_trigger
WHERE tgrelid = 'public.kv_store_2363f5d6'::regclass;

-- 6. Listar todos os registros
SELECT 
  key,
  value,
  created_at,
  expires_at,
  CASE 
    WHEN expires_at IS NULL THEN 'Permanente'
    WHEN expires_at > NOW() THEN 'Ativo'
    ELSE 'Expirado'
  END as status
FROM public.kv_store_2363f5d6
ORDER BY created_at DESC;

-- 7. Estatísticas
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE expires_at IS NULL) as permanentes,
  COUNT(*) FILTER (WHERE expires_at > NOW()) as ativos,
  COUNT(*) FILTER (WHERE expires_at < NOW()) as expirados,
  pg_size_pretty(pg_total_relation_size('public.kv_store_2363f5d6')) as tamanho_total
FROM public.kv_store_2363f5d6;

-- =====================================================
-- RESULTADO ESPERADO:
-- =====================================================
-- 1. Status: "Tabela existe", total_registros >= 2
-- 2. Índices: 4 índices (PK + 3 indexes)
-- 3. Políticas: 2 políticas RLS
-- 4. Função: clean_expired_kv_entries existe
-- 5. Trigger: update_kv_store_updated_at habilitado
-- 6. Registros: Pelo menos 2 (system:version, cache:enabled)
-- 7. Estatísticas: Total >= 2, permanentes >= 2
-- =====================================================
