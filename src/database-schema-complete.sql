-- ============================================
-- REDFLIX - SCHEMA COMPLETO DO BANCO DE DADOS
-- ============================================
-- Este SQL cria APENAS as tabelas que faltam
-- Mantém as 3 tabelas já existentes:
-- ✅ analytics_events
-- ✅ content
-- ✅ watch_history
-- ============================================

-- ============================================
-- 1. TABELA: users
-- Armazena dados dos usuários da plataforma
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'standard', 'premium')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'expired')),
  subscription_start_date TIMESTAMP WITH TIME ZONE,
  subscription_end_date TIMESTAMP WITH TIME ZONE,
  is_admin BOOLEAN DEFAULT false,
  avatar_url TEXT,
  language TEXT DEFAULT 'pt-BR',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Índices para otimização
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_status);

-- ============================================
-- 2. TABELA: profiles
-- Perfis de usuários (Kids, Adulto, etc)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  is_kids BOOLEAN DEFAULT false,
  pin_code TEXT,
  language TEXT DEFAULT 'pt-BR',
  auto_play_next BOOLEAN DEFAULT true,
  auto_play_previews BOOLEAN DEFAULT true,
  maturity_rating TEXT DEFAULT 'all' CHECK (maturity_rating IN ('all', '10', '12', '14', '16', '18')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_used TIMESTAMP WITH TIME ZONE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_profiles_user ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_kids ON profiles(is_kids);

-- ============================================
-- 3. TABELA: seasons
-- Temporadas das séries
-- ============================================
CREATE TABLE IF NOT EXISTS seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  season_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  poster_path TEXT,
  air_date DATE,
  episode_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_id, season_number)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_seasons_content ON seasons(content_id);

-- ============================================
-- 4. TABELA: episodes
-- Episódios das temporadas
-- ============================================
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES seasons(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  episode_number INTEGER NOT NULL,
  name TEXT NOT NULL,
  overview TEXT,
  still_path TEXT,
  air_date DATE,
  runtime INTEGER,
  video_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(season_id, episode_number)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_episodes_season ON episodes(season_id);
CREATE INDEX IF NOT EXISTS idx_episodes_content ON episodes(content_id);

-- ============================================
-- 5. TABELA: my_list
-- Lista personalizada "Minha Lista"
-- ============================================
CREATE TABLE IF NOT EXISTS my_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, profile_id, content_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_mylist_user ON my_list(user_id);
CREATE INDEX IF NOT EXISTS idx_mylist_profile ON my_list(profile_id);
CREATE INDEX IF NOT EXISTS idx_mylist_content ON my_list(content_id);

-- ============================================
-- 6. TABELA: favorites
-- Favoritos do usuário
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, profile_id, content_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_profile ON favorites(profile_id);
CREATE INDEX IF NOT EXISTS idx_favorites_content ON favorites(content_id);

-- ============================================
-- 7. TABELA: reviews
-- Avaliações e reviews dos usuários
-- ============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES content(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_spoiler BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, profile_id, content_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_content ON reviews(content_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ============================================
-- 8. TABELA: iptv_channels
-- Canais IPTV (Futebol, ESPN, etc)
-- ============================================
CREATE TABLE IF NOT EXISTS iptv_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  logo_url TEXT,
  stream_url TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('sports', 'news', 'movies', 'series', 'kids', 'documentary', 'music', 'other')),
  subcategory TEXT,
  language TEXT DEFAULT 'pt-BR',
  country TEXT DEFAULT 'BR',
  is_live BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  quality TEXT DEFAULT 'HD' CHECK (quality IN ('SD', 'HD', 'FULL_HD', '4K')),
  viewer_count INTEGER DEFAULT 0,
  schedule JSONB,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_iptv_channels_category ON iptv_channels(category);
CREATE INDEX IF NOT EXISTS idx_iptv_channels_active ON iptv_channels(is_active);
CREATE INDEX IF NOT EXISTS idx_iptv_channels_slug ON iptv_channels(slug);

-- ============================================
-- 9. TABELA: iptv_favorites
-- Canais IPTV favoritos do usuário
-- ============================================
CREATE TABLE IF NOT EXISTS iptv_favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  channel_id UUID NOT NULL REFERENCES iptv_channels(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, profile_id, channel_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_user ON iptv_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_profile ON iptv_favorites(profile_id);
CREATE INDEX IF NOT EXISTS idx_iptv_favorites_channel ON iptv_favorites(channel_id);

-- ============================================
-- 10. TABELA: notifications
-- Notificações do sistema
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'promotion')),
  link_url TEXT,
  image_url TEXT,
  is_read BOOLEAN DEFAULT false,
  read_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at DESC);

-- ============================================
-- 11. TABELA: admin_logs
-- Logs de ações administrativas
-- ============================================
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_admin_logs_user ON admin_logs(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_logs(action);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_logs(created_at DESC);

-- ============================================
-- 12. TABELA: kv_store_2363f5d6
-- Tabela padrão Key-Value do sistema
-- ============================================
CREATE TABLE IF NOT EXISTS kv_store_2363f5d6 (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_kv_store_created ON kv_store_2363f5d6(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_kv_store_updated ON kv_store_2363f5d6(updated_at DESC);

-- ============================================
-- TRIGGERS para updated_at automático
-- ============================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas com updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seasons_updated_at BEFORE UPDATE ON seasons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_iptv_channels_updated_at BEFORE UPDATE ON iptv_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kv_store_updated_at BEFORE UPDATE ON kv_store_2363f5d6
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================
-- Habilitando RLS nas tabelas sensíveis

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE my_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE iptv_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DADOS INICIAIS (SEED DATA)
-- ============================================

-- Inserir categorias de canais IPTV padrão (exemplos)
INSERT INTO iptv_channels (name, slug, description, logo_url, stream_url, category, subcategory, quality) VALUES
  ('ESPN Brasil', 'espn-brasil', 'Canal de esportes ESPN', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=244&h=137&fit=crop', 'https://stream.example.com/espn', 'sports', 'general', 'FULL_HD'),
  ('SporTV', 'sportv', 'Canal de esportes brasileiro', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=244&h=137&fit=crop', 'https://stream.example.com/sportv', 'sports', 'general', 'HD'),
  ('Premiere FC', 'premiere-fc', 'Futebol ao vivo', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=244&h=137&fit=crop', 'https://stream.example.com/premiere', 'sports', 'soccer', 'FULL_HD'),
  ('RedFlix Kids', 'redflix-kids', 'Conteúdo infantil 24/7', 'https://images.unsplash.com/photo-1587334207216-b8d60a5191a1?w=244&h=137&fit=crop', 'https://stream.example.com/kids', 'kids', 'general', 'HD')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- FINALIZADO! ✅
-- ============================================
-- Execute este SQL no SQL Editor do Supabase
-- Tempo estimado: ~5 segundos
-- ============================================

-- Verificar criação das tabelas:
SELECT 
  schemaname,
  tablename,
  tableowner
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
