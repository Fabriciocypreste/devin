-- =====================================================
-- RedFlix Database Schema - Migration 002
-- Triggers e Funções
-- =====================================================
-- ATENÇÃO: Execute após 001_create_redflix_schema.sql
-- =====================================================

-- =====================================================
-- FUNÇÃO: update_updated_at()
-- Atualiza automaticamente o campo updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.update_updated_at() IS 'Trigger function para atualizar automaticamente updated_at';

-- =====================================================
-- TRIGGERS: update_updated_at
-- Aplicar em todas as tabelas com campo updated_at
-- =====================================================

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_seasons_updated_at
  BEFORE UPDATE ON public.seasons
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_watch_history_updated_at
  BEFORE UPDATE ON public.watch_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_iptv_channels_updated_at
  BEFORE UPDATE ON public.iptv_channels
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_system_settings_updated_at
  BEFORE UPDATE ON public.system_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- FUNÇÃO: calculate_progress_percentage()
-- Calcula automaticamente progress_percentage e completed
-- no watch_history
-- =====================================================
CREATE OR REPLACE FUNCTION public.calculate_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
  -- Validar que total_time >= current_time
  IF NEW.total_time < NEW.current_time THEN
    RAISE EXCEPTION 'total_time (%) deve ser >= current_time (%)', NEW.total_time, NEW.current_time;
  END IF;

  -- Validar que total_time > 0
  IF NEW.total_time <= 0 THEN
    RAISE EXCEPTION 'total_time deve ser maior que 0';
  END IF;

  -- Calcular progress_percentage
  NEW.progress_percentage = ROUND((NEW.current_time::DECIMAL / NEW.total_time::DECIMAL) * 100, 2);

  -- Garantir que não ultrapasse 100%
  IF NEW.progress_percentage > 100 THEN
    NEW.progress_percentage = 100;
  END IF;

  -- Marcar como completed se >= 90%
  IF NEW.progress_percentage >= 90 THEN
    NEW.completed = true;
  ELSE
    NEW.completed = false;
  END IF;

  -- Atualizar last_watched_at
  NEW.last_watched_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.calculate_progress_percentage() IS 'Calcula progress_percentage e define completed automaticamente no watch_history';

-- Trigger para watch_history
CREATE TRIGGER calculate_watch_progress
  BEFORE INSERT OR UPDATE OF current_time, total_time ON public.watch_history
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_progress_percentage();

-- =====================================================
-- FUNÇÃO: enforce_max_profiles_per_user()
-- Garante máximo de 5 perfis por usuário
-- =====================================================
CREATE OR REPLACE FUNCTION public.enforce_max_profiles_per_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_count INTEGER;
BEGIN
  -- Contar perfis existentes do usuário
  SELECT COUNT(*)
  INTO profile_count
  FROM public.profiles
  WHERE user_id = NEW.user_id;

  -- Se já tem 5 ou mais perfis, impedir inserção
  IF profile_count >= 5 THEN
    RAISE EXCEPTION 'Usuário já possui o máximo de 5 perfis permitidos';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.enforce_max_profiles_per_user() IS 'Garante que cada usuário tenha no máximo 5 perfis';

-- Trigger para profiles
CREATE TRIGGER check_max_profiles
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_max_profiles_per_user();

-- =====================================================
-- FUNÇÃO: create_user_record()
-- Cria automaticamente registro em public.users quando
-- um novo usuário é criado no auth.users
-- =====================================================
CREATE OR REPLACE FUNCTION public.create_user_record()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.create_user_record() IS 'Cria automaticamente registro em public.users quando novo usuário é criado';

-- Trigger no auth.users (requer permissões especiais)
-- NOTA: Este trigger só funciona se você tiver acesso ao schema auth
-- Execute manualmente via SQL Editor do Supabase se necessário:
--
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION public.create_user_record();

-- =====================================================
-- FUNÇÃO: increment_helpful_count()
-- Helper para incrementar helpful_count em reviews
-- (chamada via RPC do frontend)
-- =====================================================
CREATE OR REPLACE FUNCTION public.increment_helpful_count(review_uuid UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.reviews
  SET helpful_count = helpful_count + 1
  WHERE id = review_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.increment_helpful_count(UUID) IS 'Incrementa helpful_count de uma review (chamada via RPC)';

-- Revogar execução para anon
REVOKE EXECUTE ON FUNCTION public.increment_helpful_count(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.increment_helpful_count(UUID) TO authenticated;

-- =====================================================
-- FUNÇÃO: get_content_with_progress()
-- Retorna conteúdos com progresso de visualização do perfil
-- (chamada via RPC do frontend)
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_content_with_progress(profile_uuid UUID, content_limit INTEGER DEFAULT 20, content_offset INTEGER DEFAULT 0)
RETURNS TABLE (
  id UUID,
  tmdb_id INTEGER,
  media_type TEXT,
  title TEXT,
  overview TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  genres JSONB,
  release_date DATE,
  age_rating TEXT,
  vote_average DECIMAL,
  progress_percentage DECIMAL,
  last_watched_at TIMESTAMPTZ,
  completed BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.tmdb_id,
    c.media_type,
    c.title,
    c.overview,
    c.poster_path,
    c.backdrop_path,
    c.genres,
    c.release_date,
    c.age_rating,
    c.vote_average,
    COALESCE(wh.progress_percentage, 0) as progress_percentage,
    wh.last_watched_at,
    COALESCE(wh.completed, false) as completed
  FROM public.content c
  LEFT JOIN public.watch_history wh ON wh.content_id = c.id AND wh.profile_id = profile_uuid
  WHERE c.is_available = true
  ORDER BY wh.last_watched_at DESC NULLS LAST, c.created_at DESC
  LIMIT content_limit
  OFFSET content_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_content_with_progress(UUID, INTEGER, INTEGER) IS 'Retorna conteúdos com progresso de visualização do perfil';

-- Revogar execução para anon
REVOKE EXECUTE ON FUNCTION public.get_content_with_progress(UUID, INTEGER, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_content_with_progress(UUID, INTEGER, INTEGER) TO authenticated;

-- =====================================================
-- FUNÇÃO: search_content()
-- Busca full-text em conteúdos (título e overview)
-- =====================================================
CREATE OR REPLACE FUNCTION public.search_content(search_query TEXT, content_limit INTEGER DEFAULT 20, content_offset INTEGER DEFAULT 0)
RETURNS TABLE (
  id UUID,
  tmdb_id INTEGER,
  media_type TEXT,
  title TEXT,
  original_title TEXT,
  overview TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  genres JSONB,
  release_date DATE,
  age_rating TEXT,
  vote_average DECIMAL,
  similarity REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.tmdb_id,
    c.media_type,
    c.title,
    c.original_title,
    c.overview,
    c.poster_path,
    c.backdrop_path,
    c.genres,
    c.release_date,
    c.age_rating,
    c.vote_average,
    GREATEST(
      similarity(c.title, search_query),
      similarity(COALESCE(c.original_title, ''), search_query),
      similarity(COALESCE(c.overview, ''), search_query) * 0.5
    ) as similarity
  FROM public.content c
  WHERE
    c.is_available = true
    AND (
      c.title ILIKE '%' || search_query || '%'
      OR c.original_title ILIKE '%' || search_query || '%'
      OR c.overview ILIKE '%' || search_query || '%'
    )
  ORDER BY similarity DESC, c.popularity DESC
  LIMIT content_limit
  OFFSET content_offset;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.search_content(TEXT, INTEGER, INTEGER) IS 'Busca full-text em conteúdos com ranking por similaridade';

-- Permitir para anon e authenticated
GRANT EXECUTE ON FUNCTION public.search_content(TEXT, INTEGER, INTEGER) TO anon, authenticated;

-- =====================================================
-- FUNÇÃO: get_trending_content()
-- Retorna conteúdos em alta (baseado em popularity + analytics)
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_trending_content(content_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  tmdb_id INTEGER,
  media_type TEXT,
  title TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  genres JSONB,
  vote_average DECIMAL,
  popularity DECIMAL,
  view_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.tmdb_id,
    c.media_type,
    c.title,
    c.poster_path,
    c.backdrop_path,
    c.genres,
    c.vote_average,
    c.popularity,
    COUNT(DISTINCT ae.id) as view_count
  FROM public.content c
  LEFT JOIN public.analytics_events ae ON
    ae.event_type = 'play'
    AND (ae.event_data->>'content_id')::UUID = c.id
    AND ae.created_at >= now() - interval '7 days'
  WHERE c.is_available = true
  GROUP BY c.id
  ORDER BY view_count DESC, c.popularity DESC, c.vote_average DESC
  LIMIT content_limit;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.get_trending_content(INTEGER) IS 'Retorna conteúdos em alta baseado em visualizações recentes e popularidade';

-- Permitir para anon e authenticated
GRANT EXECUTE ON FUNCTION public.get_trending_content(INTEGER) TO anon, authenticated;

-- =====================================================
-- FUNÇÃO: update_content_from_tmdb()
-- Atualiza/insere conteúdo baseado em dados do TMDB
-- (chamada via Edge Function)
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_content_from_tmdb(
  p_tmdb_id INTEGER,
  p_media_type TEXT,
  p_title TEXT,
  p_original_title TEXT,
  p_overview TEXT,
  p_poster_path TEXT,
  p_backdrop_path TEXT,
  p_genres JSONB,
  p_release_date DATE,
  p_runtime INTEGER,
  p_vote_average DECIMAL,
  p_vote_count INTEGER,
  p_popularity DECIMAL
)
RETURNS UUID AS $$
DECLARE
  content_uuid UUID;
BEGIN
  INSERT INTO public.content (
    tmdb_id,
    media_type,
    title,
    original_title,
    overview,
    poster_path,
    backdrop_path,
    genres,
    release_date,
    runtime,
    vote_average,
    vote_count,
    popularity
  ) VALUES (
    p_tmdb_id,
    p_media_type,
    p_title,
    p_original_title,
    p_overview,
    p_poster_path,
    p_backdrop_path,
    p_genres,
    p_release_date,
    p_runtime,
    p_vote_average,
    p_vote_count,
    p_popularity
  )
  ON CONFLICT (tmdb_id)
  DO UPDATE SET
    title = EXCLUDED.title,
    original_title = EXCLUDED.original_title,
    overview = EXCLUDED.overview,
    poster_path = EXCLUDED.poster_path,
    backdrop_path = EXCLUDED.backdrop_path,
    genres = EXCLUDED.genres,
    release_date = EXCLUDED.release_date,
    runtime = EXCLUDED.runtime,
    vote_average = EXCLUDED.vote_average,
    vote_count = EXCLUDED.vote_count,
    popularity = EXCLUDED.popularity,
    updated_at = now()
  RETURNING id INTO content_uuid;

  RETURN content_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.update_content_from_tmdb IS 'Atualiza ou insere conteúdo do TMDB (UPSERT) - usar apenas via Edge Function';

-- Revogar execução para todos (só via Edge Function com SERVICE_ROLE_KEY)
REVOKE EXECUTE ON FUNCTION public.update_content_from_tmdb FROM anon, authenticated, public;

-- =====================================================
-- FUNÇÃO: get_user_recommendations()
-- Recomendações baseadas no histórico do perfil
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_recommendations(profile_uuid UUID, content_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  tmdb_id INTEGER,
  media_type TEXT,
  title TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  genres JSONB,
  vote_average DECIMAL,
  recommendation_score DECIMAL
) AS $$
BEGIN
  -- Busca conteúdos similares baseado nos gêneros assistidos pelo perfil
  RETURN QUERY
  WITH watched_genres AS (
    SELECT DISTINCT jsonb_array_elements_text(c.genres) as genre
    FROM public.watch_history wh
    JOIN public.content c ON c.id = wh.content_id
    WHERE wh.profile_id = profile_uuid
      AND wh.progress_percentage > 20 -- Assistiu pelo menos 20%
  ),
  favorite_genres AS (
    SELECT genre, COUNT(*) as genre_count
    FROM watched_genres
    GROUP BY genre
    ORDER BY genre_count DESC
    LIMIT 5
  )
  SELECT
    c.id,
    c.tmdb_id,
    c.media_type,
    c.title,
    c.poster_path,
    c.backdrop_path,
    c.genres,
    c.vote_average,
    (
      -- Score baseado em: gêneros favoritos + rating + popularidade
      (SELECT COUNT(*) FROM favorite_genres fg WHERE c.genres @> to_jsonb(fg.genre)) * 10 +
      COALESCE(c.vote_average, 0) +
      (COALESCE(c.popularity, 0) / 100)
    ) as recommendation_score
  FROM public.content c
  WHERE
    c.is_available = true
    -- Não incluir conteúdos já assistidos
    AND NOT EXISTS (
      SELECT 1 FROM public.watch_history wh
      WHERE wh.profile_id = profile_uuid AND wh.content_id = c.id
    )
    -- Incluir apenas conteúdos com pelo menos 1 gênero favorito
    AND EXISTS (
      SELECT 1 FROM favorite_genres fg
      WHERE c.genres @> to_jsonb(fg.genre)
    )
  ORDER BY recommendation_score DESC, c.vote_average DESC
  LIMIT content_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_recommendations(UUID, INTEGER) IS 'Retorna recomendações personalizadas baseadas no histórico do perfil';

-- Revogar execução para anon
REVOKE EXECUTE ON FUNCTION public.get_user_recommendations(UUID, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_user_recommendations(UUID, INTEGER) TO authenticated;

-- =====================================================
-- FIM DA MIGRATION 002
-- =====================================================
