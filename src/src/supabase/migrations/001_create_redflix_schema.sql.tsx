-- =====================================================
-- RedFlix Database Schema - Migration 001
-- Criação de todas as tabelas principais
-- =====================================================
-- ATENÇÃO: Este arquivo NÃO deve ser executado diretamente pelo código.
-- Use o CLI do Supabase ou execute manualmente no SQL Editor.
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

-- Usuários podem ler apenas seus próprios dados
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Usuários podem atualizar apenas seus próprios dados (exceto campos sensíveis)
CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins podem ler todos os usuários
CREATE POLICY "users_select_admin" ON public.users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins podem atualizar todos os usuários
CREATE POLICY "users_update_admin" ON public.users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- POLÍTICAS RLS - profiles
-- =====================================================

-- Usuários podem ver apenas seus próprios perfis
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Usuários podem criar seus próprios perfis
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar seus próprios perfis
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Usuários podem deletar seus próprios perfis
CREATE POLICY "profiles_delete_own" ON public.profiles
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- POLÍTICAS RLS - content
-- =====================================================

-- Todos podem ler conteúdos disponíveis (anon e authenticated)
CREATE POLICY "content_select_all" ON public.content
  FOR SELECT
  TO anon, authenticated
  USING (is_available = true);

-- Admins podem inserir conteúdo
CREATE POLICY "content_insert_admin" ON public.content
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins podem atualizar conteúdo
CREATE POLICY "content_update_admin" ON public.content
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins podem deletar conteúdo
CREATE POLICY "content_delete_admin" ON public.content
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- POLÍTICAS RLS - seasons
-- =====================================================

-- Todos podem ler temporadas de conteúdos disponíveis
CREATE POLICY "seasons_select_all" ON public.seasons
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content
      WHERE id = seasons.content_id AND is_available = true
    )
  );

-- Admins podem inserir/atualizar/deletar temporadas
CREATE POLICY "seasons_modify_admin" ON public.seasons
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- POLÍTICAS RLS - episodes
-- =====================================================

-- Todos podem ler episódios de conteúdos disponíveis
CREATE POLICY "episodes_select_all" ON public.episodes
  FOR SELECT
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.content
      WHERE id = episodes.content_id AND is_available = true
    )
  );

-- Admins podem inserir/atualizar/deletar episódios
CREATE POLICY "episodes_modify_admin" ON public.episodes
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- POLÍTICAS RLS - my_list
-- =====================================================

-- Usuários podem ver apenas sua própria lista
CREATE POLICY "my_list_select_own" ON public.my_list
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = my_list.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem adicionar à sua lista
CREATE POLICY "my_list_insert_own" ON public.my_list
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = my_list.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem remover da sua lista
CREATE POLICY "my_list_delete_own" ON public.my_list
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = my_list.profile_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS - favorites
-- =====================================================

-- Usuários podem ver apenas seus próprios favoritos
CREATE POLICY "favorites_select_own" ON public.favorites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = favorites.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem adicionar favoritos
CREATE POLICY "favorites_insert_own" ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = favorites.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem atualizar favoritos (mudar like/dislike)
CREATE POLICY "favorites_update_own" ON public.favorites
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = favorites.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem remover favoritos
CREATE POLICY "favorites_delete_own" ON public.favorites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = favorites.profile_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS - watch_history
-- =====================================================

-- Usuários podem ver apenas seu próprio histórico
CREATE POLICY "watch_history_select_own" ON public.watch_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = watch_history.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem inserir no histórico
CREATE POLICY "watch_history_insert_own" ON public.watch_history
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = watch_history.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem atualizar seu histórico
CREATE POLICY "watch_history_update_own" ON public.watch_history
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = watch_history.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem deletar seu histórico
CREATE POLICY "watch_history_delete_own" ON public.watch_history
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = watch_history.profile_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS - reviews
-- =====================================================

-- Todos podem ler reviews
CREATE POLICY "reviews_select_all" ON public.reviews
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Usuários podem criar reviews
CREATE POLICY "reviews_insert_own" ON public.reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Usuários podem atualizar suas reviews
CREATE POLICY "reviews_update_own" ON public.reviews
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Usuários podem deletar suas reviews
CREATE POLICY "reviews_delete_own" ON public.reviews
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- POLÍTICAS RLS - iptv_channels
-- =====================================================

-- Todos podem ler canais ativos
CREATE POLICY "iptv_channels_select_all" ON public.iptv_channels
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Admins podem inserir/atualizar/deletar canais
CREATE POLICY "iptv_channels_modify_admin" ON public.iptv_channels
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- POLÍTICAS RLS - iptv_favorites
-- =====================================================

-- Usuários podem ver apenas seus favoritos
CREATE POLICY "iptv_favorites_select_own" ON public.iptv_favorites
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = iptv_favorites.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem adicionar favoritos
CREATE POLICY "iptv_favorites_insert_own" ON public.iptv_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = iptv_favorites.profile_id AND user_id = auth.uid()
    )
  );

-- Usuários podem remover favoritos
CREATE POLICY "iptv_favorites_delete_own" ON public.iptv_favorites
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = iptv_favorites.profile_id AND user_id = auth.uid()
    )
  );

-- =====================================================
-- POLÍTICAS RLS - notifications
-- =====================================================

-- Usuários podem ver apenas suas notificações
CREATE POLICY "notifications_select_own" ON public.notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Sistema/Admin pode criar notificações
CREATE POLICY "notifications_insert_admin" ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Usuários podem atualizar suas notificações (marcar como lidas)
CREATE POLICY "notifications_update_own" ON public.notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Usuários podem deletar suas notificações
CREATE POLICY "notifications_delete_own" ON public.notifications
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- =====================================================
-- POLÍTICAS RLS - admin_logs
-- =====================================================

-- Apenas admins podem ler logs
CREATE POLICY "admin_logs_select_admin" ON public.admin_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Apenas admins podem inserir logs
CREATE POLICY "admin_logs_insert_admin" ON public.admin_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- POLÍTICAS RLS - analytics_events
-- =====================================================

-- Usuários podem ver apenas seus eventos
CREATE POLICY "analytics_events_select_own" ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Admins podem ver todos os eventos
CREATE POLICY "analytics_events_select_admin" ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Usuários autenticados podem inserir eventos
CREATE POLICY "analytics_events_insert_authenticated" ON public.analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

-- Usuários anônimos podem inserir eventos (sem user_id)
CREATE POLICY "analytics_events_insert_anon" ON public.analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- =====================================================
-- POLÍTICAS RLS - system_settings
-- =====================================================

-- Todos podem ler configurações públicas
CREATE POLICY "system_settings_select_public" ON public.system_settings
  FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

-- Admins podem ler todas as configurações
CREATE POLICY "system_settings_select_admin" ON public.system_settings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Admins podem inserir/atualizar/deletar configurações
CREATE POLICY "system_settings_modify_admin" ON public.system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- FIM DA MIGRATION 001
-- =====================================================
