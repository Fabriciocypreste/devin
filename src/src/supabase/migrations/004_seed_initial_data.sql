-- =====================================================
-- RedFlix Database Schema - Migration 004
-- Seeds - Dados Iniciais para Testes
-- =====================================================
-- ATENÇÃO: Execute após 003_create_indexes.sql
-- ATENÇÃO: Estes são dados de TESTE. Ajuste conforme necessário.
-- =====================================================

-- =====================================================
-- SEED: users
-- Criar 3 usuários de exemplo
-- =====================================================

-- NOTA: Para criar usuários reais, use a API do Supabase Auth
-- Os IDs aqui são exemplos. Em produção, use o trigger create_user_record()
-- que cria automaticamente o registro em public.users quando um usuário
-- é criado via auth.users

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

-- =====================================================
-- SEED: profiles
-- Criar 3 perfis de exemplo
-- =====================================================

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

-- =====================================================
-- SEED: content
-- Criar conteúdos de exemplo
-- =====================================================

-- Conteúdo 1: Filme - Vingadores: Ultimato
INSERT INTO public.content (
  id,
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
  age_rating,
  imdb_rating,
  vote_average,
  vote_count,
  popularity,
  is_featured,
  is_top10,
  top10_position,
  is_available
)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  299534,
  'movie',
  'Vingadores: Ultimato',
  'Avengers: Endgame',
  'Após Thanos eliminar metade das criaturas vivas, os Vingadores restantes devem fazer o que for necessário para desfazer as ações do titã louco.',
  '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
  '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
  '["Ação", "Aventura", "Ficção científica"]'::jsonb,
  '2019-04-24',
  181,
  '12',
  8.4,
  8.3,
  25000,
  500.5,
  true,
  true,
  1,
  true
) ON CONFLICT (id) DO NOTHING;

-- Conteúdo 2: Série - Breaking Bad
INSERT INTO public.content (
  id,
  tmdb_id,
  media_type,
  title,
  original_title,
  overview,
  poster_path,
  backdrop_path,
  genres,
  release_date,
  number_of_seasons,
  number_of_episodes,
  status,
  age_rating,
  vote_average,
  vote_count,
  popularity,
  is_featured,
  is_top10,
  top10_position,
  is_available
)
VALUES (
  'c0000000-0000-0000-0000-000000000002',
  1396,
  'tv',
  'Breaking Bad',
  'Breaking Bad',
  'Um professor de química do ensino médio diagnosticado com câncer de pulmão inoperável recorre à fabricação e venda de metanfetamina para garantir o futuro de sua família.',
  '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
  '["Drama", "Crime"]'::jsonb,
  '2008-01-20',
  5,
  62,
  'ended',
  '16',
  9.5,
  15000,
  450.2,
  true,
  true,
  2,
  true
) ON CONFLICT (id) DO NOTHING;

-- Conteúdo 3: Filme - Frozen
INSERT INTO public.content (
  id,
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
  age_rating,
  vote_average,
  vote_count,
  popularity,
  is_available,
  available_for_plans
)
VALUES (
  'c0000000-0000-0000-0000-000000000003',
  109445,
  'movie',
  'Frozen: Uma Aventura Congelante',
  'Frozen',
  'Quando uma profecia condena um reino à era do gelo eterno, Anna, uma jovem otimista, se une a um montanhista para encontrar sua irmã Elsa e quebrar o feitiço.',
  '/kgwjIb2JDHRhNk13lmSxiClFjc4.jpg',
  '/1T9RigOBuGhVZzGqT8Sf1XxhQmN.jpg',
  '["Animação", "Aventura", "Família"]'::jsonb,
  '2013-11-27',
  102,
  'L',
  7.4,
  12000,
  380.8,
  true,
  ARRAY['free', 'basic', 'standard', 'premium']
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED: seasons (Breaking Bad)
-- =====================================================

INSERT INTO public.seasons (id, content_id, season_number, name, overview, episode_count)
VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002',
  1,
  'Temporada 1',
  'Walter White, um professor de química, descobre que tem câncer e decide fabricar metanfetamina.',
  7
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.seasons (id, content_id, season_number, name, overview, episode_count)
VALUES (
  'd0000000-0000-0000-0000-000000000002',
  'c0000000-0000-0000-0000-000000000002',
  2,
  'Temporada 2',
  'Walter e Jesse expandem seus negócios, mas enfrentam novos perigos.',
  13
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED: episodes (Breaking Bad - Temporada 1)
-- =====================================================

INSERT INTO public.episodes (id, season_id, content_id, episode_number, name, overview, runtime)
VALUES (
  'e0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002',
  1,
  'Pilot',
  'Walter White é diagnosticado com câncer e decide usar suas habilidades em química para garantir o futuro financeiro de sua família.',
  58
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.episodes (id, season_id, content_id, episode_number, name, overview, runtime)
VALUES (
  'e0000000-0000-0000-0000-000000000002',
  'd0000000-0000-0000-0000-000000000001',
  'c0000000-0000-0000-0000-000000000002',
  2,
  'Cat''s in the Bag...',
  'Walter e Jesse tentam lidar com as consequências de sua primeira cozinha.',
  48
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED: iptv_channels
-- Criar 6 canais IPTV de exemplo
-- =====================================================

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000001',
  'ESPN Brasil',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/320px-ESPN_wordmark.svg.png',
  'sports',
  'https://example.com/stream/espn-brasil',
  true,
  true,
  ARRAY['standard', 'premium'],
  1,
  'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000002',
  'Globo News',
  'https://upload.wikimedia.org/wikipedia/pt/thumb/b/b4/Logotipo_da_GloboNews.svg/320px-Logotipo_da_GloboNews.svg.png',
  'news',
  'https://example.com/stream/globonews',
  true,
  true,
  ARRAY['basic', 'standard', 'premium'],
  2,
  'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000003',
  'Cartoon Network',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/320px-Cartoon_Network_2010_logo.svg.png',
  'kids',
  'https://example.com/stream/cartoon-network',
  true,
  false,
  ARRAY['free', 'basic', 'standard', 'premium'],
  3,
  'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000004',
  'HBO',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/320px-HBO_logo.svg.png',
  'movies',
  'https://example.com/stream/hbo',
  true,
  true,
  ARRAY['premium'],
  4,
  'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000005',
  'Discovery Channel',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Discovery_Channel_-_Logo_2019.svg/320px-Discovery_Channel_-_Logo_2019.svg.png',
  'documentaries',
  'https://example.com/stream/discovery',
  true,
  true,
  ARRAY['standard', 'premium'],
  5,
  'BR'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.iptv_channels (id, name, logo_url, category, stream_url, is_active, requires_subscription, available_for_plans, sort_order, country)
VALUES (
  'f0000000-0000-0000-0000-000000000006',
  'MTV Brasil',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/MTV_2021_%28brand_version%29.svg/320px-MTV_2021_%28brand_version%29.svg.png',
  'music',
  'https://example.com/stream/mtv',
  true,
  false,
  ARRAY['free', 'basic', 'standard', 'premium'],
  6,
  'BR'
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- SEED: system_settings
-- Configurações iniciais do sistema
-- =====================================================

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES (
  'app_name',
  '"RedFlix"'::jsonb,
  'Nome da aplicação',
  true
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES (
  'app_version',
  '"1.0.0"'::jsonb,
  'Versão atual da aplicação',
  true
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES (
  'maintenance_mode',
  'false'::jsonb,
  'Modo de manutenção ativado/desativado',
  true
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES (
  'max_profiles_per_user',
  '5'::jsonb,
  'Número máximo de perfis por usuário',
  false
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES (
  'plans',
  '{
    "free": {
      "name": "Gratuito",
      "price": 0,
      "features": ["SD", "1 tela", "Anúncios"],
      "max_screens": 1,
      "quality": "SD"
    },
    "basic": {
      "name": "Básico",
      "price": 19.90,
      "features": ["HD", "1 tela", "Sem anúncios"],
      "max_screens": 1,
      "quality": "HD"
    },
    "standard": {
      "name": "Standard",
      "price": 32.90,
      "features": ["Full HD", "2 telas", "Sem anúncios"],
      "max_screens": 2,
      "quality": "Full HD"
    },
    "premium": {
      "name": "Premium",
      "price": 49.90,
      "features": ["4K+HDR", "4 telas", "Sem anúncios", "IPTV"],
      "max_screens": 4,
      "quality": "4K"
    }
  }'::jsonb,
  'Configurações dos planos de assinatura',
  true
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES (
  'tmdb_sync_enabled',
  'true'::jsonb,
  'Sincronização automática com TMDB habilitada',
  false
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO public.system_settings (key, value, description, is_public)
VALUES (
  'analytics_enabled',
  'true'::jsonb,
  'Analytics habilitado',
  false
) ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- =====================================================
-- OBSERVAÇÕES FINAIS
-- =====================================================

-- Os IDs usados aqui são UUIDs fixos para facilitar testes.
-- Em produção, os UUIDs serão gerados automaticamente.

-- Para criar usuários reais, use a Supabase Auth API:
-- supabase.auth.signUp({ email, password, options: { data: { full_name } } })

-- Após aplicar este seed, você pode testar:
-- 1. Login com os emails de teste (se criados via Auth)
-- 2. Seleção de perfis
-- 3. Visualização de conteúdos
-- 4. Canais IPTV

-- =====================================================
-- FIM DA MIGRATION 004
-- =====================================================
