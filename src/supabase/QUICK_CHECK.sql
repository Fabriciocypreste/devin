-- =====================================================
-- DIAGNÓSTICO RÁPIDO - O QUE EXISTE NO BANCO?
-- =====================================================
-- Execute este script para ver o que JÁ FOI CRIADO
-- =====================================================

-- 1️⃣ LISTAR TODAS AS TABELAS DO PROJETO
SELECT 
    schemaname as schema,
    tablename as tabela,
    tableowner as dono
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- =====================================================
-- RESULTADO ESPERADO:
-- Se tiver APENAS "kv_store_2363f5d6" → Banco VAZIO (só tem a tabela padrão)
-- Se tiver 14+ tabelas → Banco CRIADO! ✅
-- =====================================================
