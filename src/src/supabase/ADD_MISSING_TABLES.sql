-- =====================================================
-- TABELAS FALTANTES - REDFLIX
-- Execute este SQL no Supabase para adicionar as tabelas que faltam
-- =====================================================

-- =====================================================
-- TABELA: my_list
-- Lista pessoal de conteúdos salvos pelo usuário
-- =====================================================
CREATE TABLE IF NOT EXISTS public.my_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'tv', 'iptv')),
  tmdb_id INTEGER,
  title TEXT,
  poster_url TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_id, content_id)
);

COMMENT ON TABLE public.my_list IS 'Lista pessoal de conteúdos (Minha Lista)';
COMMENT ON COLUMN public.my_list.content_id IS 'ID do conteúdo (pode ser TMDB ID, IPTV slug, etc)';
COMMENT ON COLUMN public.my_list.content_type IS 'Tipo: movie, tv, ou iptv';

-- Índices para my_list
CREATE INDEX IF NOT EXISTS idx_my_list_user_profile ON public.my_list(user_id, profile_id);
CREATE INDEX IF NOT EXISTS idx_my_list_content ON public.my_list(content_id);
CREATE INDEX IF NOT EXISTS idx_my_list_added_at ON public.my_list(added_at DESC);

-- RLS para my_list
ALTER TABLE public.my_list ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own my_list" ON public.my_list;
CREATE POLICY "Users can view their own my_list"
  ON public.my_list FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into their own my_list" ON public.my_list;
CREATE POLICY "Users can insert into their own my_list"
  ON public.my_list FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from their own my_list" ON public.my_list;
CREATE POLICY "Users can delete from their own my_list"
  ON public.my_list FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABELA: favorites
-- Conteúdos marcados como favoritos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'tv', 'iptv')),
  tmdb_id INTEGER,
  title TEXT,
  poster_url TEXT,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_id, content_id)
);

COMMENT ON TABLE public.favorites IS 'Conteúdos marcados como favoritos';
COMMENT ON COLUMN public.favorites.content_id IS 'ID do conteúdo (pode ser TMDB ID, IPTV slug, etc)';

-- Índices para favorites
CREATE INDEX IF NOT EXISTS idx_favorites_user_profile ON public.favorites(user_id, profile_id);
CREATE INDEX IF NOT EXISTS idx_favorites_content ON public.favorites(content_id);
CREATE INDEX IF NOT EXISTS idx_favorites_added_at ON public.favorites(added_at DESC);

-- RLS para favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own favorites" ON public.favorites;
CREATE POLICY "Users can view their own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert into their own favorites" ON public.favorites;
CREATE POLICY "Users can insert into their own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete from their own favorites" ON public.favorites;
CREATE POLICY "Users can delete from their own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TABELA: reviews
-- Avaliações e reviews de conteúdos
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  content_id TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('movie', 'tv')),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_spoiler BOOLEAN NOT NULL DEFAULT false,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

COMMENT ON TABLE public.reviews IS 'Avaliações e reviews de filmes e séries';
COMMENT ON COLUMN public.reviews.rating IS 'Nota de 1 a 5 estrelas';
COMMENT ON COLUMN public.reviews.is_spoiler IS 'Indica se o review contém spoilers';
COMMENT ON COLUMN public.reviews.helpful_count IS 'Número de usuários que marcaram como útil';

-- Índices para reviews
CREATE INDEX IF NOT EXISTS idx_reviews_content ON public.reviews(content_id, content_type);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);

-- RLS para reviews
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view reviews" ON public.reviews;
CREATE POLICY "Anyone can view reviews"
  ON public.reviews FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
CREATE POLICY "Users can insert their own reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRIGGERS para updated_at
-- =====================================================

-- Function para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para reviews
DROP TRIGGER IF EXISTS update_reviews_updated_at ON public.reviews;
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICAÇÃO FINAL
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Tabelas criadas com sucesso!';
  RAISE NOTICE '✅ my_list - Minha Lista';
  RAISE NOTICE '✅ favorites - Favoritos';
  RAISE NOTICE '✅ reviews - Avaliações';
  RAISE NOTICE '✅ RLS habilitado em todas as tabelas';
  RAISE NOTICE '✅ Índices criados para performance';
  RAISE NOTICE '🎉 Tudo pronto para usar!';
END $$;
