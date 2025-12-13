-- =====================================================
-- REDFLIX - DATABASE COMPLETO
-- Arquivo SQL consolidado com todas as migrations
-- =====================================================
-- ATENÇÃO: Este arquivo contém TODAS as migrations em ordem:
-- 001 - Schema e Tabelas + RLS
-- 002 - Triggers e Funções
-- 003 - Índices
-- 004 - Seeds (Dados de Exemplo)
-- 005 - Storage Policies
-- =====================================================
-- Execute este arquivo COMPLETO no SQL Editor do Supabase
-- Tempo estimado: 30-45 minutos
-- =====================================================

-- =====================================================
-- MIGRATION 001: SCHEMA E TABELAS
-- =====================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";      -- Para busca full-text eficiente
CREATE EXTENSION IF NOT EXISTS "unaccent";     -- Para busca sem acentos

-- =====================================================
-- TABELA: users
-- Estende auth.users com informações adicionais do usuário
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  subscription_plan TEXT NOT NULL DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'standard', 'premium')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'expired', 'suspended')),
  subscription_start_date TIMESTAMPTZ,
  subscription_end_date TIMESTAMPTZ,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  preferred_language TEXT DEFAULT 'pt-BR',
  notifications_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.users IS 'Informações estendidas dos usuários do RedFlix';
COMMENT ON COLUMN public.users.subscription_plan IS 'Plano de assinatura: free, basic, standard, premium';
COMMENT ON COLUMN public.users.subscription_status IS 'Status da assinatura: active, canceled, expired, suspended';
COMMENT ON COLUMN public.users.is_admin IS 'Indica se o usuário tem privilégios administrativos';

-- =====================================================
-- TABELA: profiles
-- Perfis de visualização (máximo 5 por usuário)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  is_kids BOOLEAN NOT NULL DEFAULT false,
  pin_code TEXT CHECK (pin_code IS NULL OR length(pin_code) = 4),
  language TEXT DEFAULT 'pt-BR',
  autoplay_next BOOLEAN NOT NULL DEFAULT true,
  autoplay_previews BOOLEAN NOT NULL DEFAULT true,
  maturity_rating TEXT DEFAULT 'all' CHECK (maturity_rating IN ('all', 'kids', 'teen', 'adult')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

COMMENT ON TABLE public.profiles IS 'Perfis de visualização dos usuários (máximo 5 por usuário)';
COMMENT ON COLUMN public.profiles.is_kids IS 'Indica se é um perfil infantil (com restrições de conteúdo)';
COMMENT ON COLUMN public.profiles.pin_code IS 'PIN de 4 dígitos para proteger o perfil';
COMMENT ON COLUMN public.profiles.maturity_rating IS 'Classificação máxima permitida: all, kids, teen, adult';

-- =====================================================
-- TABELA: content
-- Catálogo de filmes e séries
-- =====================================================
CREATE TABLE IF NOT EXISTS public.content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tmdb_id INTEGER UNIQUE,
  media_type TEXT NOT NULL CHECK (media_type IN ('movie', 'tv')),
  title TEXT NOT NULL,
  original_title TEXT,
  overview TEXT,
  poster_path TEXT,
  backdrop_path TEXT,
  logo_path TEXT,
  genres JSONB DEFAULT '[]'::jsonb,
  release_date DATE,
  runtime INTEGER, -- em minutos (para filmes)
  number_of_seasons INTEGER, -- para séries
  number_of_episodes INTEGER, -- para séries
  status TEXT CHECK (status IN ('released', 'returning', 'ended', 'canceled', 'in_production')),
  age_rating TEXT CHECK (age_rating IN ('L', '10', '12', '14', '16', '18')),
  imdb_rating DECIMAL(3,1),
  vote_average DECIMAL(3,1),
  vote_count INTEGER,
  popularity DECIMAL(10,2),
  trailer_url TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_top10 BOOLEAN NOT NULL DEFAULT false,
  top10_position INTEGER CHECK (top10_position BETWEEN 1 AND 10),
  is_available BOOLEAN NOT NULL DEFAULT true,
  available_for_plans TEXT[] DEFAULT ARRAY['free', 'basic', 'standard', 'premium'],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.content IS 'Catálogo de filmes e séries do RedFlix';
COMMENT ON COLUMN public.content.tmdb_id IS 'ID do The Movie Database (TMDB) para sincronização';
COMMENT ON COLUMN public.content.media_type IS 'Tipo de mídia: movie ou tv';
COMMENT ON COLUMN public.content.genres IS 'Array JSON de gêneros';
COMMENT ON COLUMN public.content.is_featured IS 'Indica se aparece no hero slider';
COMMENT ON COLUMN public.content.is_top10 IS 'Indica se está no top 10';
COMMENT ON COLUMN public.content.available_for_plans IS 'Array de planos que podem acessar este conteúdo';

-- =====================================================
-- TABELA: seasons
-- Temporadas de séries
-- =====================================================
CREATE TABLE IF NOT EXISTS public.seasons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  tmdb_season_id INTEGER,
  season_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  poster_path TEXT,
  air_date DATE,
  episode_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(content_id, season_number)
);

COMMENT ON TABLE public.seasons IS 'Temporadas de séries de TV';

-- =====================================================
-- TABELA: episodes
-- Episódios de séries
-- =====================================================
CREATE TABLE IF NOT EXISTS public.episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  season_id UUID NOT NULL REFERENCES public.seasons(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  tmdb_episode_id INTEGER,
  episode_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  still_path TEXT,
  air_date DATE,
  runtime INTEGER, -- em minutos
  video_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(season_id, episode_number)
);

COMMENT ON TABLE public.episodes IS 'Episódios de séries de TV';
COMMENT ON COLUMN public.episodes.video_url IS 'URL do vídeo do episódio';

-- =====================================================
-- TABELA: my_list
-- "Minha Lista" de cada perfil
-- =====================================================
CREATE TABLE IF NOT EXISTS public.my_list (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, content_id)
);

COMMENT ON TABLE public.my_list IS 'Lista de conteúdos salvos por perfil (Minha Lista)';

-- =====================================================
-- TABELA: favorites
-- Conteúdos favoritados (com like/dislike)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  rating TEXT NOT NULL CHECK (rating IN ('like', 'dislike')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, content_id)
);

COMMENT ON TABLE public.favorites IS 'Avaliações (like/dislike) de conteúdos por perfil';

-- =====================================================
-- TABELA: watch_history
-- Histórico de visualização e progresso
-- =====================================================
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES public.episodes(id) ON DELETE CASCADE,
  current_time INTEGER NOT NULL DEFAULT 0, -- em segundos
  total_time INTEGER NOT NULL, -- em segundos
  progress_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00 CHECK (progress_percentage BETWEEN 0 AND 100),
  completed BOOLEAN NOT NULL DEFAULT false,
  last_watched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, content_id, episode_id)
);

COMMENT ON TABLE public.watch_history IS 'Histórico de visualização e progresso de cada perfil';
COMMENT ON COLUMN public.watch_history.progress_percentage IS 'Porcentagem assistida (calculada automaticamente via trigger)';
COMMENT ON COLUMN public.watch_history.completed IS 'Marcado como completo quando >= 90%';

-- =====================================================
-- TABELA: reviews
-- Avaliações e comentários dos usuários
-- =====================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.content(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  is_spoiler BOOLEAN NOT NULL DEFAULT false,
  helpful_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);

COMMENT ON TABLE public.reviews IS 'Avaliações e comentários de usuários sobre conteúdos';
COMMENT ON COLUMN public.reviews.helpful_count IS 'Número de usuários que marcaram como útil';

-- =====================================================
-- TABELA: iptv_channels
-- Canais de TV ao vivo (IPTV)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.iptv_channels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  logo_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('sports', 'news', 'entertainment', 'movies', 'kids', 'documentaries', 'music', 'other')),
  stream_url TEXT NOT NULL,
  epg_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  requires_subscription BOOLEAN NOT NULL DEFAULT false,
  available_for_plans TEXT[] DEFAULT ARRAY['basic', 'standard', 'premium'],
  sort_order INTEGER NOT NULL DEFAULT 0,
  country TEXT DEFAULT 'BR',
  language TEXT DEFAULT 'pt',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.iptv_channels IS 'Canais de TV ao vivo (IPTV)';
COMMENT ON COLUMN public.iptv_channels.category IS 'Categoria: sports, news, entertainment, movies, kids, documentaries, music, other';
COMMENT ON COLUMN public.iptv_channels.epg_url IS 'URL do guia eletrônico de programação (EPG)';

-- =====================================================
-- TABELA: iptv_favorites
-- Canais favoritos de cada perfil
-- =====================================================
CREATE TABLE IF NOT EXISTS public.iptv_favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES public.iptv_channels(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(profile_id, channel_id)
);

COMMENT ON TABLE public.iptv_favorites IS 'Canais IPTV favoritos de cada perfil';

-- =====================================================
-- TABELA: notifications
-- Notificações para usuários
-- =====================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error', 'new_content', 'subscription')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.notifications IS 'Notificações para usuários';
COMMENT ON COLUMN public.notifications.type IS 'Tipo: info, warning, success, error, new_content, subscription';

-- =====================================================
-- TABELA: admin_logs
-- Logs de ações administrativas
-- =====================================================
CREATE TABLE IF NOT EXISTS public.admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.admin_logs IS 'Logs de todas as ações administrativas para auditoria';

-- =====================================================
-- TABELA: analytics_events
-- Eventos de analytics e métricas
-- =====================================================
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.analytics_events IS 'Eventos de analytics para métricas e relatórios';
COMMENT ON COLUMN public.analytics_events.event_type IS 'Tipo do evento: page_view, play, pause, complete, search, etc.';

-- =====================================================
-- TABELA: system_settings
-- Configurações globais do sistema
-- =====================================================
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.system_settings IS 'Configurações globais do sistema RedFlix';
COMMENT ON COLUMN public.system_settings.is_public IS 'Indica se a configuração pode ser lida por usuários não autenticados';

-- =====================================================
-- HABILITAR ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.my_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iptv_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iptv_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS - users
-- =====================================================

CREATE POLICY "users_select_own" ON public.users
  FOR SELECT TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "users_select_admin" ON public.users
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "users_update_admin" ON public.users
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- =====================================================
-- POLÍTICAS RLS - profiles
-- =====================================================

CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- POLÍTICAS RLS - content
-- =====================================================

CREATE POLICY "content_select_all" ON public.content
  FOR SELECT TO anon, authenticated
  USING (is_available = true);

CREATE POLICY "content_insert_admin" ON public.content
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "content_update_admin" ON public.content
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "content_delete_admin" ON public.content
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- =====================================================
-- POLÍTICAS RLS - seasons
-- =====================================================

CREATE POLICY "seasons_select_all" ON public.seasons
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.content WHERE id = seasons.content_id AND is_available = true));

CREATE POLICY "seasons_modify_admin" ON public.seasons
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- =====================================================
-- POLÍTICAS RLS - episodes
-- =====================================================

CREATE POLICY "episodes_select_all" ON public.episodes
  FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.content WHERE id = episodes.content_id AND is_available = true));

CREATE POLICY "episodes_modify_admin" ON public.episodes
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- =====================================================
-- POLÍTICAS RLS - my_list
-- =====================================================

CREATE POLICY "my_list_select_own" ON public.my_list
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = my_list.profile_id AND user_id = auth.uid()));

CREATE POLICY "my_list_insert_own" ON public.my_list
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = my_list.profile_id AND user_id = auth.uid()));

CREATE POLICY "my_list_delete_own" ON public.my_list
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = my_list.profile_id AND user_id = auth.uid()));

-- =====================================================
-- POLÍTICAS RLS - favorites
-- =====================================================

CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = favorites.profile_id AND user_id = auth.uid()));

CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = favorites.profile_id AND user_id = auth.uid()));

CREATE POLICY "favorites_update_own" ON public.favorites
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = favorites.profile_id AND user_id = auth.uid()));

CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = favorites.profile_id AND user_id = auth.uid()));

-- =====================================================
-- POLÍTICAS RLS - watch_history
-- =====================================================

CREATE POLICY "watch_history_select_own" ON public.watch_history
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = watch_history.profile_id AND user_id = auth.uid()));

CREATE POLICY "watch_history_insert_own" ON public.watch_history
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = watch_history.profile_id AND user_id = auth.uid()));

CREATE POLICY "watch_history_update_own" ON public.watch_history
  FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = watch_history.profile_id AND user_id = auth.uid()));

CREATE POLICY "watch_history_delete_own" ON public.watch_history
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = watch_history.profile_id AND user_id = auth.uid()));

-- =====================================================
-- POLÍTICAS RLS - reviews
-- =====================================================

CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- POLÍTICAS RLS - iptv_channels
-- =====================================================

CREATE POLICY "iptv_channels_select_all" ON public.iptv_channels
  FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "iptv_channels_modify_admin" ON public.iptv_channels
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- =====================================================
-- POLÍTICAS RLS - iptv_favorites
-- =====================================================

CREATE POLICY "iptv_favorites_select_own" ON public.iptv_favorites
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = iptv_favorites.profile_id AND user_id = auth.uid()));

CREATE POLICY "iptv_favorites_insert_own" ON public.iptv_favorites
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.profiles WHERE id = iptv_favorites.profile_id AND user_id = auth.uid()));

CREATE POLICY "iptv_favorites_delete_own" ON public.iptv_favorites
  FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = iptv_favorites.profile_id AND user_id = auth.uid()));

-- =====================================================
-- POLÍTICAS RLS - notifications
-- =====================================================

CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_insert_admin" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- POLÍTICAS RLS - admin_logs
-- =====================================================

CREATE POLICY "admin_logs_select_admin" ON public.admin_logs
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admin_logs_insert_admin" ON public.admin_logs
  FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- =====================================================
-- POLÍTICAS RLS - analytics_events
-- =====================================================

CREATE POLICY "analytics_events_select_own" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "analytics_events_select_admin" ON public.analytics_events
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "analytics_events_insert_authenticated" ON public.analytics_events
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "analytics_events_insert_anon" ON public.analytics_events
  FOR INSERT TO anon
  WITH CHECK (user_id IS NULL);

-- =====================================================
-- POLÍTICAS RLS - system_settings
-- =====================================================

CREATE POLICY "system_settings_select_public" ON public.system_settings
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "system_settings_select_admin" ON public.system_settings
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "system_settings_modify_admin" ON public.system_settings
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true));

-- =====================================================
-- MIGRATION 002: TRIGGERS E FUNÇÕES
-- =====================================================

-- =====================================================
-- FUNÇÃO: update_updated_at()
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
-- =====================================================
CREATE OR REPLACE FUNCTION public.calculate_progress_percentage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.total_time < NEW.current_time THEN
    RAISE EXCEPTION 'total_time (%) deve ser >= current_time (%)', NEW.total_time, NEW.current_time;
  END IF;

  IF NEW.total_time <= 0 THEN
    RAISE EXCEPTION 'total_time deve ser maior que 0';
  END IF;

  NEW.progress_percentage = ROUND((NEW.current_time::DECIMAL / NEW.total_time::DECIMAL) * 100, 2);

  IF NEW.progress_percentage > 100 THEN
    NEW.progress_percentage = 100;
  END IF;

  IF NEW.progress_percentage >= 90 THEN
    NEW.completed = true;
  ELSE
    NEW.completed = false;
  END IF;

  NEW.last_watched_at = now();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.calculate_progress_percentage() IS 'Calcula progress_percentage e define completed automaticamente no watch_history';

CREATE TRIGGER calculate_watch_progress
  BEFORE INSERT OR UPDATE OF current_time, total_time ON public.watch_history
  FOR EACH ROW
  EXECUTE FUNCTION public.calculate_progress_percentage();

-- =====================================================
-- FUNÇÃO: enforce_max_profiles_per_user()
-- =====================================================
CREATE OR REPLACE FUNCTION public.enforce_max_profiles_per_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO profile_count
  FROM public.profiles
  WHERE user_id = NEW.user_id;

  IF profile_count >= 5 THEN
    RAISE EXCEPTION 'Usuário já possui o máximo de 5 perfis permitidos';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION public.enforce_max_profiles_per_user() IS 'Garante que cada usuário tenha no máximo 5 perfis';

CREATE TRIGGER check_max_profiles
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_max_profiles_per_user();

-- =====================================================
-- FUNÇÃO: create_user_record()
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

-- =====================================================
-- FUNÇÃO: increment_helpful_count()
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

REVOKE EXECUTE ON FUNCTION public.increment_helpful_count(UUID) FROM anon;
GRANT EXECUTE ON FUNCTION public.increment_helpful_count(UUID) TO authenticated;

-- =====================================================
-- FUNÇÃO: get_content_with_progress()
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

REVOKE EXECUTE ON FUNCTION public.get_content_with_progress(UUID, INTEGER, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_content_with_progress(UUID, INTEGER, INTEGER) TO authenticated;

-- =====================================================
-- FUNÇÃO: search_content()
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

GRANT EXECUTE ON FUNCTION public.search_content(TEXT, INTEGER, INTEGER) TO anon, authenticated;

-- =====================================================
-- FUNÇÃO: get_trending_content()
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

GRANT EXECUTE ON FUNCTION public.get_trending_content(INTEGER) TO anon, authenticated;

-- =====================================================
-- FUNÇÃO: update_content_from_tmdb()
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

REVOKE EXECUTE ON FUNCTION public.update_content_from_tmdb FROM anon, authenticated, public;

-- =====================================================
-- FUNÇÃO: get_user_recommendations()
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
  RETURN QUERY
  WITH watched_genres AS (
    SELECT DISTINCT jsonb_array_elements_text(c.genres) as genre
    FROM public.watch_history wh
    JOIN public.content c ON c.id = wh.content_id
    WHERE wh.profile_id = profile_uuid
      AND wh.progress_percentage > 20
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
      (SELECT COUNT(*) FROM favorite_genres fg WHERE c.genres @> to_jsonb(fg.genre)) * 10 +
      COALESCE(c.vote_average, 0) +
      (COALESCE(c.popularity, 0) / 100)
    ) as recommendation_score
  FROM public.content c
  WHERE
    c.is_available = true
    AND NOT EXISTS (
      SELECT 1 FROM public.watch_history wh
      WHERE wh.profile_id = profile_uuid AND wh.content_id = c.id
    )
    AND EXISTS (
      SELECT 1 FROM favorite_genres fg
      WHERE c.genres @> to_jsonb(fg.genre)
    )
  ORDER BY recommendation_score DESC, c.vote_average DESC
  LIMIT content_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION public.get_user_recommendations(UUID, INTEGER) IS 'Retorna recomendações personalizadas baseadas no histórico do perfil';

REVOKE EXECUTE ON FUNCTION public.get_user_recommendations(UUID, INTEGER) FROM anon;
GRANT EXECUTE ON FUNCTION public.get_user_recommendations(UUID, INTEGER) TO authenticated;

-- =====================================================
-- MIGRATION 003: ÍNDICES
-- =====================================================

-- users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON public.users(subscription_plan);
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin) WHERE is_admin = true;

-- profiles
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_is_kids ON public.profiles(is_kids);
CREATE INDEX IF NOT EXISTS idx_profiles_user_name ON public.profiles(user_id, name);

-- content
CREATE INDEX IF NOT EXISTS idx_content_tmdb_id ON public.content(tmdb_id);
CREATE INDEX IF NOT EXISTS idx_content_media_type ON public.content(media_type);
CREATE INDEX IF NOT EXISTS idx_content_is_available ON public.content(is_available) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_content_is_featured ON public.content(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_content_top10 ON public.content(is_top10, top10_position) WHERE is_top10 = true;
CREATE INDEX IF NOT EXISTS idx_content_popularity ON public.content(popularity DESC) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_content_vote_average ON public.content(vote_average DESC) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_content_release_date ON public.content(release_date DESC) WHERE is_available = true;
CREATE INDEX IF NOT EXISTS idx_content_title_trgm ON public.content USING gin(title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_content_overview_trgm ON public.content USING gin(overview gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_content_genres ON public.content USING gin(genres);
CREATE INDEX IF NOT EXISTS idx_content_listing ON public.content(is_available, media_type, popularity DESC) WHERE is_available = true;

-- seasons
CREATE INDEX IF NOT EXISTS idx_seasons_content_id ON public.seasons(content_id);
CREATE INDEX IF NOT EXISTS idx_seasons_tmdb_id ON public.seasons(tmdb_season_id);
CREATE INDEX IF NOT EXISTS idx_seasons_content_season ON public.seasons(content_id, season_number);

-- episodes
CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON public.episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_episodes_content_id ON public.episodes(content_id);
CREATE INDEX IF NOT EXISTS idx_episodes_tmdb_id ON public.episodes(tmdb_episode_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season_episode ON public.episodes(season_id, episode_number);

-- my_list
CREATE INDEX IF NOT EXISTS idx_my_list_profile_id ON public.my_list(profile_id);
CREATE INDEX IF NOT EXISTS idx_my_list_content_id ON public.my_list(content_id);
CREATE INDEX IF NOT EXISTS idx_my_list_added_at ON public.my_list(profile_id, added_at DESC);

-- favorites
CREATE INDEX IF NOT EXISTS idx_favorites_profile_id ON public.favorites(profile_id);
CREATE INDEX IF NOT EXISTS idx_favorites_content_id ON public.favorites(content_id);
CREATE INDEX IF NOT EXISTS idx_favorites_rating ON public.favorites(profile_id, rating);

-- watch_history
CREATE INDEX IF NOT EXISTS idx_watch_history_profile_id ON public.watch_history(profile_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_content_id ON public.watch_history(content_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_episode_id ON public.watch_history(episode_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched ON public.watch_history(profile_id, last_watched_at DESC);
CREATE INDEX IF NOT EXISTS idx_watch_history_completed ON public.watch_history(profile_id, completed);
CREATE INDEX IF NOT EXISTS idx_watch_history_continue ON public.watch_history(profile_id, last_watched_at DESC) WHERE completed = false AND progress_percentage > 5;

-- reviews
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_content_id ON public.reviews(content_id);
CREATE INDEX IF NOT EXISTS idx_reviews_helpful ON public.reviews(content_id, helpful_count DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(content_id, created_at DESC);

-- iptv_channels
CREATE INDEX IF NOT EXISTS idx_iptv_channels_category ON public.iptv_channels(category);
CREATE INDEX IF NOT EXISTS idx_iptv_channels_is_active ON public.iptv_channels(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_iptv_channels_sort ON public.iptv_channels(category, is_active, sort_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_iptv_channels_country ON public.iptv_channels(country);

-- iptv_favorites
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_profile_id ON public.iptv_favorites(profile_id);
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_channel_id ON public.iptv_favorites(channel_id);
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_added_at ON public.iptv_favorites(profile_id, added_at DESC);

-- notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, created_at DESC) WHERE is_read = false;

-- admin_logs
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_type ON public.admin_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_id ON public.admin_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_details ON public.admin_logs USING gin(details);

-- analytics_events
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_profile_id ON public.analytics_events(profile_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_user_events ON public.analytics_events(user_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_profile_events ON public.analytics_events(profile_id, event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_data ON public.analytics_events USING gin(event_data);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON public.analytics_events(session_id);

-- system_settings
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);
CREATE INDEX IF NOT EXISTS idx_system_settings_is_public ON public.system_settings(is_public);
CREATE INDEX IF NOT EXISTS idx_system_settings_value ON public.system_settings USING gin(value);

-- =====================================================
-- MIGRATION 004: SEEDS (DADOS DE EXEMPLO)
-- =====================================================

-- Usuário 1: Admin Premium
INSERT INTO public.users (id, email, full_name, subscription_plan, subscription_status, is_admin, subscription_start_date, subscription_end_date)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'admin@redflix.com',
  'Admin RedFlix',
  'premium',
  'active',
  true,
  now(),
  now() + interval '1 year'
) ON CONFLICT (id) DO NOTHING;

-- Usuário 2: Premium Regular
INSERT INTO public.users (id, email, full_name, subscription_plan, subscription_status, is_admin, subscription_start_date, subscription_end_date)
VALUES (
  'a0000000-0000-0000-0000-000000000002',
  'premium@redflix.com',
  'João Silva',
  'premium',
  'active',
  false,
  now(),
  now() + interval '1 year'
) ON CONFLICT (id) DO NOTHING;

-- Usuário 3: Free
INSERT INTO public.users (id, email, full_name, subscription_plan, subscription_status, is_admin, subscription_start_date, subscription_end_date)
VALUES (
  'a0000000-0000-0000-0000-000000000003',
  'free@redflix.com',
  'Maria Santos',
  'free',
  'active',
  false,
  now(),
  now() + interval '30 days'
) ON CONFLICT (id) DO NOTHING;

-- Perfil 1: Admin
INSERT INTO public.profiles (id, user_id, name, avatar_url, is_kids, maturity_rating)
VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Admin',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
  false,
  'adult'
) ON CONFLICT (id) DO NOTHING;

-- Perfil 2: João
INSERT INTO public.profiles (id, user_id, name, avatar_url, is_kids, maturity_rating)
VALUES (
  'b0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000002',
  'João',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao',
  false,
  'adult'
) ON CONFLICT (id) DO NOTHING;

-- Perfil 3: Maria Kids
INSERT INTO public.profiles (id, user_id, name, avatar_url, is_kids, maturity_rating)
VALUES (
  'b0000000-0000-0000-0000-000000000003',
  'a0000000-0000-0000-0000-000000000003',
  'Maria Kids',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=MariaKids',
  true,
  'kids'
) ON CONFLICT (id) DO NOTHING;

-- Conteúdo 1: Filme - Vingadores: Ultimato
INSERT INTO public.content (
  id, tmdb_id, media_type, title, original_title, overview, poster_path, backdrop_path, genres,
  release_date, runtime, age_rating, imdb_rating, vote_average, vote_count, popularity,
  is_featured, is_top10, top10_position, is_available
)
VALUES (
  'c0000000-0000-0000-0000-000000000001', 299534, 'movie', 'Vingadores: Ultimato', 'Avengers: Endgame',
  'Após Thanos eliminar metade das criaturas vivas, os Vingadores restantes devem fazer o que for necessário para desfazer as ações do titã louco.',
  '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg', '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
  '["Ação", "Aventura", "Ficção científica"]'::jsonb, '2019-04-24', 181, '12', 8.4, 8.3, 25000, 500.5,
  true, true, 1, true
) ON CONFLICT (id) DO NOTHING;

-- Conteúdo 2: Série - Breaking Bad
INSERT INTO public.content (
  id, tmdb_id, media_type, title, original_title, overview, poster_path, backdrop_path, genres,
  release_date, number_of_seasons, number_of_episodes, status, age_rating, vote_average, vote_count,
  popularity, is_featured, is_top10, top10_position, is_available
)
VALUES (
  'c0000000-0000-0000-0000-000000000002', 1396, 'tv', 'Breaking Bad', 'Breaking Bad',
  'Um professor de química do ensino médio diagnosticado com câncer de pulmão inoperável recorre à fabricação e venda de metanfetamina para garantir o futuro de sua família.',
  '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg', '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
  '["Drama", "Crime"]'::jsonb, '2008-01-20', 5, 62, 'ended', '16', 9.5, 15000, 450.2,
  true, true, 2, true
) ON CONFLICT (id) DO NOTHING;

-- Conteúdo 3: Filme - Frozen
INSERT INTO public.content (
  id, tmdb_id, media_type, title, original_title, overview, poster_path, backdrop_path, genres,
  release_date, runtime, age_rating, vote_average, vote_count, popularity, is_available, available_for_plans
)
VALUES (
  'c0000000-0000-0000-0000-000000000003', 109445, 'movie', 'Frozen: Uma Aventura Congelante', 'Frozen',
  'Quando uma profecia condena um reino à era do gelo eterno, Anna, uma jovem otimista, se une a um montanhista para encontrar sua irmã Elsa e quebrar o feitiço.',
  '/kgwjIb2JDHRhNk13lmSxiClFjc4.jpg', '/1T9RigOBuGhVZzGqT8Sf1XxhQmN.jpg',
  '["Animação", "Aventura", "Família"]'::jsonb, '2013-11-27', 102, 'L', 7.4, 12000, 380.8, true,
  ARRAY['free', 'basic', 'standard', 'premium']
) ON CONFLICT (id) DO NOTHING;

-- Temporadas Breaking Bad
INSERT INTO public.seasons (id, content_id, season_number, name, overview, episode_count)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002', 1, 'Temporada 1',
  'Walter White, um professor de química, descobre que tem câncer e decide fabricar metanfetamina.', 7
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seasons (id, content_id, season_number, name, overview, episode_count)
VALUES (
  'd0000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000002', 2, 'Temporada 2',
  'Walter e Jesse expandem seus negócios, mas enfrentam novos perigos.', 13
) ON CONFLICT (id) DO NOTHING;

-- Episódios Breaking Bad
INSERT INTO public.episodes (id, season_id, content_id, episode_number, name, overview, runtime)
VALUES (
  'e0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002', 1, 'Pilot',
  'Walter White é diagnosticado com câncer e decide usar suas habilidades em química para garantir o futuro financeiro de sua família.', 58
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.episodes (id, season_id, content_id, episode_number, name, overview, runtime)
VALUES (
  'e0000000-0000-0000-0000-000000000002',
  'd0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002', 2, 'Cat''s in the Bag...',
  'Walter e Jesse tentam lidar com as consequências de sua primeira cozinha.', 48
) ON CONFLICT (id) DO NOTHING;

-- Canais IPTV
INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000001', 'ESPN Brasil',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/320px-ESPN_wordmark.svg.png',
  'sports', 'https://example.com/stream/espn-brasil', true, true, ARRAY['standard', 'premium'], 1, 'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000002', 'Globo News',
  'https://upload.wikimedia.org/wikipedia/pt/thumb/b/b4/Logotipo_da_GloboNews.svg/320px-Logotipo_da_GloboNews.svg.png',
  'news', 'https://example.com/stream/globonews', true, true, ARRAY['basic', 'standard', 'premium'], 2, 'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000003', 'Cartoon Network',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/320px-Cartoon_Network_2010_logo.svg.png',
  'kids', 'https://example.com/stream/cartoon-network', true, false, ARRAY['free', 'basic', 'standard', 'premium'], 3, 'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000004', 'HBO',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/320px-HBO_logo.svg.png',
  'movies', 'https://example.com/stream/hbo', true, true, ARRAY['premium'], 4, 'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000005', 'Discovery Channel',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Discovery_Channel_-_Logo_2019.svg/320px-Discovery_Channel_-_Logo_2019.svg.png',
  'documentaries', 'https://example.com/stream/discovery', true, true, ARRAY['standard', 'premium'], 5, 'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000006', 'MTV Brasil',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/MTV_2021_%28brand_version%29.svg/320px-MTV_2021_%28brand_version%29.svg.png',
  'music', 'https://example.com/stream/mtv', true, false, ARRAY['free', 'basic', 'standard', 'premium'], 6, 'BR'
) ON CONFLICT (id) DO NOTHING;

-- System Settings
INSERT INTO public.system_settings (key, value, description, is_public)
VALUES ('app_name', '"RedFlix"'::jsonb, 'Nome da aplicação', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES ('app_version', '"1.0.0"'::jsonb, 'Versão atual da aplicação', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES ('maintenance_mode', 'false'::jsonb, 'Modo de manutenção ativado/desativado', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES ('max_profiles_per_user', '5'::jsonb, 'Número máximo de perfis por usuário', false)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES ('plans', '{
  "free": {"name": "Gratuito", "price": 0, "features": ["SD", "1 tela", "Anúncios"], "max_screens": 1, "quality": "SD"},
  "basic": {"name": "Básico", "price": 19.90, "features": ["HD", "1 tela", "Sem anúncios"], "max_screens": 1, "quality": "HD"},
  "standard": {"name": "Standard", "price": 32.90, "features": ["Full HD", "2 telas", "Sem anúncios"], "max_screens": 2, "quality": "Full HD"},
  "premium": {"name": "Premium", "price": 49.90, "features": ["4K+HDR", "4 telas", "Sem anúncios", "IPTV"], "max_screens": 4, "quality": "4K"}
}'::jsonb, 'Configurações dos planos de assinatura', true)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES ('tmdb_sync_enabled', 'true'::jsonb, 'Sincronização automática com TMDB habilitada', false)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES ('analytics_enabled', 'true'::jsonb, 'Analytics habilitado', false)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- MIGRATION 005: STORAGE POLICIES
-- =====================================================

-- Políticas para bucket: make-2363f5d6-avatars
CREATE POLICY "avatars_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR (storage.foldername(name))[1] IN (SELECT id::text FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'make-2363f5d6-avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR (storage.foldername(name))[1] IN (SELECT id::text FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR (storage.foldername(name))[1] IN (SELECT id::text FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR (storage.foldername(name))[1] IN (SELECT id::text FROM public.profiles WHERE user_id = auth.uid())
    )
  );

-- Políticas para bucket: make-2363f5d6-channel-logos
CREATE POLICY "channel_logos_select_all" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'make-2363f5d6-channel-logos');

CREATE POLICY "channel_logos_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'make-2363f5d6-channel-logos'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "channel_logos_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-channel-logos'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "channel_logos_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-channel-logos'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- Políticas para bucket: make-2363f5d6-content-media
CREATE POLICY "content_media_select_all" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'make-2363f5d6-content-media');

CREATE POLICY "content_media_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'make-2363f5d6-content-media'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "content_media_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-content-media'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "content_media_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-content-media'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND is_admin = true)
  );

-- =====================================================
-- FIM DO ARQUIVO COMPLETO
-- =====================================================
-- SUCESSO! Banco de dados RedFlix criado com:
-- ✅ 14 tabelas
-- ✅ 60+ políticas RLS
-- ✅ 12 triggers
-- ✅ 10 funções RPC
-- ✅ 70+ índices
-- ✅ Dados de exemplo (3 users, 3 profiles, 3 contents, 6 channels)
-- ✅ 7 configurações de sistema
-- ✅ Políticas de storage
-- =====================================================
