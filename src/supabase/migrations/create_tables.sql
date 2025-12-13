-- ========================================
-- REDFLIX DATABASE SCHEMA
-- ========================================
-- Script para criar as tabelas de filmes, séries e canais
-- no Supabase PostgreSQL
-- 
-- Execute este script no Supabase Dashboard → SQL Editor
-- ========================================

-- Criar extensão UUID se não existir
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- TABELA: filmes
-- ========================================
CREATE TABLE IF NOT EXISTS filmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  logo TEXT,
  categoria TEXT DEFAULT 'filme',
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_filmes_nome ON filmes(nome);
CREATE INDEX IF NOT EXISTS idx_filmes_categoria ON filmes(categoria);
CREATE INDEX IF NOT EXISTS idx_filmes_created_at ON filmes(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_filmes_updated_at
  BEFORE UPDATE ON filmes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE filmes IS 'Tabela de filmes do RedFlix';
COMMENT ON COLUMN filmes.id IS 'ID único do filme (UUID)';
COMMENT ON COLUMN filmes.nome IS 'Nome/título do filme';
COMMENT ON COLUMN filmes.logo IS 'URL da imagem/poster do filme';
COMMENT ON COLUMN filmes.categoria IS 'Categoria/gênero do filme (drama, acao, etc)';
COMMENT ON COLUMN filmes.url IS 'URL do streaming do filme';

-- ========================================
-- TABELA: series
-- ========================================
CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  logo TEXT,
  categoria TEXT DEFAULT 'serie',
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_series_nome ON series(nome);
CREATE INDEX IF NOT EXISTS idx_series_categoria ON series(categoria);
CREATE INDEX IF NOT EXISTS idx_series_created_at ON series(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_series_updated_at
  BEFORE UPDATE ON series
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE series IS 'Tabela de séries do RedFlix';
COMMENT ON COLUMN series.id IS 'ID único da série (UUID)';
COMMENT ON COLUMN series.nome IS 'Nome/título da série';
COMMENT ON COLUMN series.logo IS 'URL da imagem/poster da série';
COMMENT ON COLUMN series.categoria IS 'Categoria/gênero da série (drama, ficcao, etc)';
COMMENT ON COLUMN series.url IS 'URL do streaming da série';

-- ========================================
-- TABELA: canais
-- ========================================
CREATE TABLE IF NOT EXISTS canais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  logo TEXT,
  categoria TEXT DEFAULT 'canal',
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_canais_nome ON canais(nome);
CREATE INDEX IF NOT EXISTS idx_canais_categoria ON canais(categoria);
CREATE INDEX IF NOT EXISTS idx_canais_created_at ON canais(created_at DESC);

-- Trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_canais_updated_at
  BEFORE UPDATE ON canais
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comentários
COMMENT ON TABLE canais IS 'Tabela de canais de TV do RedFlix';
COMMENT ON COLUMN canais.id IS 'ID único do canal (UUID)';
COMMENT ON COLUMN canais.nome IS 'Nome do canal (Globo, SBT, etc)';
COMMENT ON COLUMN canais.logo IS 'URL do logo do canal';
COMMENT ON COLUMN canais.categoria IS 'Categoria do canal (aberto, esportes, noticias, etc)';
COMMENT ON COLUMN canais.url IS 'URL do stream m3u8 do canal';

-- ========================================
-- ROW LEVEL SECURITY (RLS)
-- ========================================
-- Habilitar RLS para segurança
ALTER TABLE filmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE canais ENABLE ROW LEVEL SECURITY;

-- Políticas: permitir leitura pública (todos podem ler)
CREATE POLICY "Permitir leitura pública de filmes"
  ON filmes FOR SELECT
  USING (true);

CREATE POLICY "Permitir leitura pública de séries"
  ON series FOR SELECT
  USING (true);

CREATE POLICY "Permitir leitura pública de canais"
  ON canais FOR SELECT
  USING (true);

-- Políticas: permitir inserção apenas para usuários autenticados
-- (pode ser ajustado conforme necessidade)
CREATE POLICY "Permitir inserção de filmes para autenticados"
  ON filmes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir inserção de séries para autenticados"
  ON series FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir inserção de canais para autenticados"
  ON canais FOR INSERT
  WITH CHECK (true);

-- ========================================
-- CONSTRAINTS ADICIONAIS
-- ========================================
-- Evitar duplicatas por nome (necessário para upsert)
CREATE UNIQUE INDEX IF NOT EXISTS unique_filme_nome ON filmes(nome);
CREATE UNIQUE INDEX IF NOT EXISTS unique_serie_nome ON series(nome);
CREATE UNIQUE INDEX IF NOT EXISTS unique_canal_nome ON canais(nome);

-- ========================================
-- VIEWS ÚTEIS
-- ========================================
-- View para conteúdo recente (últimos 30 dias)
CREATE OR REPLACE VIEW conteudo_recente AS
SELECT 
  'filme' as tipo,
  id,
  nome,
  logo,
  categoria,
  url,
  created_at
FROM filmes
WHERE created_at > NOW() - INTERVAL '30 days'
UNION ALL
SELECT 
  'serie' as tipo,
  id,
  nome,
  logo,
  categoria,
  url,
  created_at
FROM series
WHERE created_at > NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- View para estatísticas
CREATE OR REPLACE VIEW estatisticas_conteudo AS
SELECT
  'Filmes' as tipo,
  COUNT(*) as total,
  COUNT(DISTINCT categoria) as categorias
FROM filmes
UNION ALL
SELECT
  'Séries' as tipo,
  COUNT(*) as total,
  COUNT(DISTINCT categoria) as categorias
FROM series
UNION ALL
SELECT
  'Canais' as tipo,
  COUNT(*) as total,
  COUNT(DISTINCT categoria) as categorias
FROM canais;

-- ========================================
-- DADOS INICIAIS (OPCIONAL)
-- ========================================
-- Você pode descomentar abaixo para inserir dados de exemplo

/*
-- Exemplo de filme
INSERT INTO filmes (nome, logo, categoria, url) VALUES
  ('The Shawshank Redemption', 'https://image.tmdb.org/t/p/w500/9cqNxx0GxF0bflZmeSMuL5tnGzr.jpg', 'drama', 'https://example.com/filmes/shawshank');

-- Exemplo de série
INSERT INTO series (nome, logo, categoria, url) VALUES
  ('Breaking Bad', 'https://image.tmdb.org/t/p/w500/ztkUQFLlC19CCMYHW9o1zWhJRNU.jpg', 'drama', 'https://example.com/series/breaking-bad');

-- Exemplo de canal
INSERT INTO canais (nome, logo, categoria, url) VALUES
  ('Globo', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Logotipo_da_Rede_Globo.svg/200px-Logotipo_da_Rede_Globo.svg.png', 'aberto', 'https://cdn.jmvstream.com/w/LVW-10842/LVW10842_ABqSmartTv/playlist.m3u8');
*/

-- ========================================
-- FIM DO SCRIPT
-- ========================================
-- Execute: \i /path/to/create_tables.sql
-- Ou cole diretamente no Supabase SQL Editor
-- ========================================
