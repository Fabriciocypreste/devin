-- ============================================
-- REDFLIX - PARTE 3/3: TABELAS IPTV E SISTEMA
-- ============================================
-- Execute este arquivo POR ÚLTIMO (após Parte 1 e 2)
-- Tempo estimado: ~3 segundos
-- ============================================

-- ============================================
-- 1. TABELA: iptv_channels
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
-- 2. TABELA: iptv_favorites
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
-- 3. TABELA: notifications
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
-- 4. TABELA: admin_logs
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
-- 5. TABELA: kv_store_2363f5d6
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

CREATE TRIGGER update_iptv_channels_updated_at BEFORE UPDATE ON iptv_channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kv_store_updated_at BEFORE UPDATE ON kv_store_2363f5d6
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE iptv_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- DADOS INICIAIS (SEED DATA)
-- ============================================

-- Inserir canais IPTV de exemplo
INSERT INTO iptv_channels (name, slug, description, logo_url, stream_url, category, subcategory, quality) VALUES
  ('ESPN Brasil', 'espn-brasil', 'Canal de esportes ESPN', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=244&h=137&fit=crop', 'https://stream.example.com/espn', 'sports', 'general', 'FULL_HD'),
  ('SporTV', 'sportv', 'Canal de esportes brasileiro', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=244&h=137&fit=crop', 'https://stream.example.com/sportv', 'sports', 'general', 'HD'),
  ('Premiere FC', 'premiere-fc', 'Futebol ao vivo', 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=244&h=137&fit=crop', 'https://stream.example.com/premiere', 'sports', 'soccer', 'FULL_HD'),
  ('RedFlix Kids', 'redflix-kids', 'Conteúdo infantil 24/7', 'https://images.unsplash.com/photo-1587334207216-b8d60a5191a1?w=244&h=137&fit=crop', 'https://stream.example.com/kids', 'kids', 'general', 'HD')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ✅ PARTE 3 CONCLUÍDA!
-- ============================================
-- Tabelas criadas: iptv_channels, iptv_favorites, notifications, admin_logs, kv_store_2363f5d6
-- ============================================
-- 🎉 SCHEMA COMPLETO CRIADO COM SUCESSO!
-- ============================================
-- Total: 15 tabelas no banco de dados
-- ============================================
