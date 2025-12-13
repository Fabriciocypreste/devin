-- =====================================================
-- RedFlix Database Schema - Migration 003
-- Índices para Performance
-- =====================================================
-- ATENÇÃO: Execute após 002_create_triggers_and_functions.sql
-- Use CREATE INDEX CONCURRENTLY em produção para evitar locks
-- =====================================================

-- =====================================================
-- ÍNDICES - users
-- =====================================================

-- Busca por email (já tem UNIQUE, mas explícito)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Filtro por plano de assinatura
CREATE INDEX IF NOT EXISTS idx_users_subscription_plan ON public.users(subscription_plan);

-- Filtro por status de assinatura
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON public.users(subscription_status);

-- Admins
CREATE INDEX IF NOT EXISTS idx_users_is_admin ON public.users(is_admin) WHERE is_admin = true;

-- =====================================================
-- ÍNDICES - profiles
-- =====================================================

-- Busca por user_id (mais comum)
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- Perfis kids
CREATE INDEX IF NOT EXISTS idx_profiles_is_kids ON public.profiles(is_kids);

-- Busca composta user + nome
CREATE INDEX IF NOT EXISTS idx_profiles_user_name ON public.profiles(user_id, name);

-- =====================================================
-- ÍNDICES - content
-- =====================================================

-- Busca por TMDB ID (sincronização)
CREATE INDEX IF NOT EXISTS idx_content_tmdb_id ON public.content(tmdb_id);

-- Filtro por tipo de mídia
CREATE INDEX IF NOT EXISTS idx_content_media_type ON public.content(media_type);

-- Filtro por disponibilidade
CREATE INDEX IF NOT EXISTS idx_content_is_available ON public.content(is_available) WHERE is_available = true;

-- Featured content
CREATE INDEX IF NOT EXISTS idx_content_is_featured ON public.content(is_featured) WHERE is_featured = true;

-- Top 10
CREATE INDEX IF NOT EXISTS idx_content_top10 ON public.content(is_top10, top10_position) WHERE is_top10 = true;

-- Ordenação por popularidade
CREATE INDEX IF NOT EXISTS idx_content_popularity ON public.content(popularity DESC) WHERE is_available = true;

-- Ordenação por rating
CREATE INDEX IF NOT EXISTS idx_content_vote_average ON public.content(vote_average DESC) WHERE is_available = true;

-- Ordenação por data de lançamento
CREATE INDEX IF NOT EXISTS idx_content_release_date ON public.content(release_date DESC) WHERE is_available = true;

-- Full-text search no título (GiST com pg_trgm)
CREATE INDEX IF NOT EXISTS idx_content_title_trgm ON public.content USING gin(title gin_trgm_ops);

-- Full-text search no overview (GiST com pg_trgm)
CREATE INDEX IF NOT EXISTS idx_content_overview_trgm ON public.content USING gin(overview gin_trgm_ops);

-- Índice GIN para JSONB genres (busca por gênero)
CREATE INDEX IF NOT EXISTS idx_content_genres ON public.content USING gin(genres);

-- Índice composto para listagens principais
CREATE INDEX IF NOT EXISTS idx_content_listing ON public.content(is_available, media_type, popularity DESC) WHERE is_available = true;

-- =====================================================
-- ÍNDICES - seasons
-- =====================================================

-- Busca por content_id
CREATE INDEX IF NOT EXISTS idx_seasons_content_id ON public.seasons(content_id);

-- Busca por TMDB season ID
CREATE INDEX IF NOT EXISTS idx_seasons_tmdb_id ON public.seasons(tmdb_season_id);

-- Ordenação por número da temporada
CREATE INDEX IF NOT EXISTS idx_seasons_content_season ON public.seasons(content_id, season_number);

-- =====================================================
-- ÍNDICES - episodes
-- =====================================================

-- Busca por season_id
CREATE INDEX IF NOT EXISTS idx_episodes_season_id ON public.episodes(season_id);

-- Busca por content_id
CREATE INDEX IF NOT EXISTS idx_episodes_content_id ON public.episodes(content_id);

-- Busca por TMDB episode ID
CREATE INDEX IF NOT EXISTS idx_episodes_tmdb_id ON public.episodes(tmdb_episode_id);

-- Ordenação por número do episódio
CREATE INDEX IF NOT EXISTS idx_episodes_season_episode ON public.episodes(season_id, episode_number);

-- =====================================================
-- ÍNDICES - my_list
-- =====================================================

-- Busca por profile_id (mais comum)
CREATE INDEX IF NOT EXISTS idx_my_list_profile_id ON public.my_list(profile_id);

-- Busca por content_id
CREATE INDEX IF NOT EXISTS idx_my_list_content_id ON public.my_list(content_id);

-- Ordenação por data de adição
CREATE INDEX IF NOT EXISTS idx_my_list_added_at ON public.my_list(profile_id, added_at DESC);

-- =====================================================
-- ÍNDICES - favorites
-- =====================================================

-- Busca por profile_id
CREATE INDEX IF NOT EXISTS idx_favorites_profile_id ON public.favorites(profile_id);

-- Busca por content_id
CREATE INDEX IF NOT EXISTS idx_favorites_content_id ON public.favorites(content_id);

-- Filtro por rating
CREATE INDEX IF NOT EXISTS idx_favorites_rating ON public.favorites(profile_id, rating);

-- =====================================================
-- ÍNDICES - watch_history
-- =====================================================

-- Busca por profile_id (mais comum)
CREATE INDEX IF NOT EXISTS idx_watch_history_profile_id ON public.watch_history(profile_id);

-- Busca por content_id
CREATE INDEX IF NOT EXISTS idx_watch_history_content_id ON public.watch_history(content_id);

-- Busca por episode_id
CREATE INDEX IF NOT EXISTS idx_watch_history_episode_id ON public.watch_history(episode_id);

-- Ordenação por última visualização
CREATE INDEX IF NOT EXISTS idx_watch_history_last_watched ON public.watch_history(profile_id, last_watched_at DESC);

-- Filtro por completed
CREATE INDEX IF NOT EXISTS idx_watch_history_completed ON public.watch_history(profile_id, completed);

-- Continue Assistindo (não completo, ordenado por data)
CREATE INDEX IF NOT EXISTS idx_watch_history_continue ON public.watch_history(profile_id, last_watched_at DESC)
  WHERE completed = false AND progress_percentage > 5;

-- =====================================================
-- ÍNDICES - reviews
-- =====================================================

-- Busca por user_id
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);

-- Busca por content_id (mais comum - listagem de reviews)
CREATE INDEX IF NOT EXISTS idx_reviews_content_id ON public.reviews(content_id);

-- Ordenação por helpful_count
CREATE INDEX IF NOT EXISTS idx_reviews_helpful ON public.reviews(content_id, helpful_count DESC);

-- Ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(content_id, created_at DESC);

-- =====================================================
-- ÍNDICES - iptv_channels
-- =====================================================

-- Filtro por categoria
CREATE INDEX IF NOT EXISTS idx_iptv_channels_category ON public.iptv_channels(category);

-- Filtro por ativo
CREATE INDEX IF NOT EXISTS idx_iptv_channels_is_active ON public.iptv_channels(is_active) WHERE is_active = true;

-- Ordenação por sort_order
CREATE INDEX IF NOT EXISTS idx_iptv_channels_sort ON public.iptv_channels(category, is_active, sort_order) WHERE is_active = true;

-- Filtro por país
CREATE INDEX IF NOT EXISTS idx_iptv_channels_country ON public.iptv_channels(country);

-- =====================================================
-- ÍNDICES - iptv_favorites
-- =====================================================

-- Busca por profile_id
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_profile_id ON public.iptv_favorites(profile_id);

-- Busca por channel_id
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_channel_id ON public.iptv_favorites(channel_id);

-- Ordenação por data de adição
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_added_at ON public.iptv_favorites(profile_id, added_at DESC);

-- =====================================================
-- ÍNDICES - notifications
-- =====================================================

-- Busca por user_id (mais comum)
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Filtro por is_read
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(user_id, is_read);

-- Ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(user_id, created_at DESC);

-- Notificações não lidas (mais recentes primeiro)
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON public.notifications(user_id, created_at DESC)
  WHERE is_read = false;

-- =====================================================
-- ÍNDICES - admin_logs
-- =====================================================

-- Busca por admin_id
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON public.admin_logs(admin_id);

-- Busca por tipo de entidade
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_type ON public.admin_logs(entity_type);

-- Busca por entity_id
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_id ON public.admin_logs(entity_id);

-- Ordenação por data de criação
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON public.admin_logs(created_at DESC);

-- Índice GIN para JSONB details (busca em detalhes)
CREATE INDEX IF NOT EXISTS idx_admin_logs_details ON public.admin_logs USING gin(details);

-- =====================================================
-- ÍNDICES - analytics_events
-- =====================================================

-- Busca por user_id
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON public.analytics_events(user_id);

-- Busca por profile_id
CREATE INDEX IF NOT EXISTS idx_analytics_events_profile_id ON public.analytics_events(profile_id);

-- Filtro por tipo de evento
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);

-- Ordenação por data de criação (mais comum para relatórios)
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events(created_at DESC);

-- Índice composto para análises por usuário
CREATE INDEX IF NOT EXISTS idx_analytics_user_events ON public.analytics_events(user_id, event_type, created_at DESC);

-- Índice composto para análises por perfil
CREATE INDEX IF NOT EXISTS idx_analytics_profile_events ON public.analytics_events(profile_id, event_type, created_at DESC);

-- Índice GIN para JSONB event_data (busca em dados do evento)
CREATE INDEX IF NOT EXISTS idx_analytics_events_data ON public.analytics_events USING gin(event_data);

-- Busca por session_id
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON public.analytics_events(session_id);

-- =====================================================
-- ÍNDICES - system_settings
-- =====================================================

-- Busca por key (já tem UNIQUE, mas explícito)
CREATE INDEX IF NOT EXISTS idx_system_settings_key ON public.system_settings(key);

-- Filtro por is_public
CREATE INDEX IF NOT EXISTS idx_system_settings_is_public ON public.system_settings(is_public);

-- Índice GIN para JSONB value (busca em valores)
CREATE INDEX IF NOT EXISTS idx_system_settings_value ON public.system_settings USING gin(value);

-- =====================================================
-- OBSERVAÇÕES SOBRE CRIAÇÃO CONCORRENTE
-- =====================================================

-- Em PRODUÇÃO, use CREATE INDEX CONCURRENTLY para evitar locks:
--
-- CREATE INDEX CONCURRENTLY idx_content_popularity ON public.content(popularity DESC) WHERE is_available = true;
--
-- ATENÇÃO: CREATE INDEX CONCURRENTLY não pode ser executado dentro de uma transaction (BEGIN/COMMIT)
-- Execute cada índice separadamente no SQL Editor do Supabase em produção.

-- =====================================================
-- FIM DA MIGRATION 003
-- =====================================================
