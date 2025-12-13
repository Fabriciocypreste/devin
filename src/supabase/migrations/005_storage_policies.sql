-- =====================================================
-- RedFlix Database Schema - Migration 005
-- Storage Buckets e Políticas
-- =====================================================
-- ATENÇÃO: Execute após 004_seed_initial_data.sql
-- ATENÇÃO: A criação de buckets deve ser feita via Edge Function
-- ou manualmente via Dashboard do Supabase
-- =====================================================

-- =====================================================
-- INSTRUÇÕES PARA CRIAÇÃO DE BUCKETS
-- =====================================================

-- Execute estes comandos manualmente no SQL Editor do Supabase
-- ou via Edge Function com SUPABASE_SERVICE_ROLE_KEY:

-- Bucket 1: avatars (para fotos de perfil dos usuários)
-- Características: privado, max 2MB por arquivo
-- Comando (via Edge Function ou Dashboard):
--
-- const { data, error } = await supabase.storage.createBucket('make-2363f5d6-avatars', {
--   public: false,
--   fileSizeLimit: 2097152, // 2MB
--   allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
-- });

-- Bucket 2: channel-logos (para logos de canais IPTV)
-- Características: público, max 500KB por arquivo
-- Comando (via Edge Function ou Dashboard):
--
-- const { data, error } = await supabase.storage.createBucket('make-2363f5d6-channel-logos', {
--   public: true,
--   fileSizeLimit: 524288, // 500KB
--   allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp']
-- });

-- Bucket 3: content-media (para posters, backdrops, etc.)
-- Características: público (cache), max 5MB por arquivo
-- Comando (via Edge Function ou Dashboard):
--
-- const { data, error } = await supabase.storage.createBucket('make-2363f5d6-content-media', {
--   public: true,
--   fileSizeLimit: 5242880, // 5MB
--   allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
-- });

-- =====================================================
-- POLÍTICAS RLS PARA STORAGE.OBJECTS
-- =====================================================

-- BUCKET: make-2363f5d6-avatars
-- Usuários podem ler apenas seus próprios avatares e avatares de perfis que possuem

-- Política SELECT: Usuários podem ver seus avatares e de seus perfis
CREATE POLICY "avatars_select_own" ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-avatars'
    AND (
      -- Avatar do próprio usuário (path: {user_id}/avatar.jpg)
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      -- Avatar de perfil do usuário (path: {user_id}/{profile_id}/avatar.jpg)
      (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Política INSERT: Usuários podem fazer upload de avatares
CREATE POLICY "avatars_insert_own" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'make-2363f5d6-avatars'
    AND (
      -- Upload para seu próprio usuário
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      -- Upload para seus perfis
      (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Política UPDATE: Usuários podem atualizar seus avatares
CREATE POLICY "avatars_update_own" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- Política DELETE: Usuários podem deletar seus avatares
CREATE POLICY "avatars_delete_own" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-avatars'
    AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR
      (storage.foldername(name))[1] IN (
        SELECT id::text FROM public.profiles WHERE user_id = auth.uid()
      )
    )
  );

-- =====================================================
-- BUCKET: make-2363f5d6-channel-logos
-- Logos de canais são públicos (qualquer um pode ler)
-- Apenas admins podem fazer upload/atualizar/deletar
-- =====================================================

-- Política SELECT: Todos podem ler logos de canais
CREATE POLICY "channel_logos_select_all" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'make-2363f5d6-channel-logos');

-- Política INSERT: Apenas admins podem fazer upload
CREATE POLICY "channel_logos_insert_admin" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'make-2363f5d6-channel-logos'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Política UPDATE: Apenas admins podem atualizar
CREATE POLICY "channel_logos_update_admin" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-channel-logos'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Política DELETE: Apenas admins podem deletar
CREATE POLICY "channel_logos_delete_admin" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-channel-logos'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- BUCKET: make-2363f5d6-content-media
-- Imagens de conteúdo (posters, backdrops) são públicas
-- Apenas admins podem fazer upload/atualizar/deletar
-- =====================================================

-- Política SELECT: Todos podem ler imagens de conteúdo
CREATE POLICY "content_media_select_all" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'make-2363f5d6-content-media');

-- Política INSERT: Apenas admins podem fazer upload
CREATE POLICY "content_media_insert_admin" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'make-2363f5d6-content-media'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Política UPDATE: Apenas admins podem atualizar
CREATE POLICY "content_media_update_admin" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-content-media'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Política DELETE: Apenas admins podem deletar
CREATE POLICY "content_media_delete_admin" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'make-2363f5d6-content-media'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- =====================================================
-- OBSERVAÇÕES IMPORTANTES
-- =====================================================

-- 1. CRIAÇÃO DE BUCKETS:
--    Os buckets devem ser criados via:
--    a) Dashboard do Supabase (Storage > New Bucket)
--    b) Edge Function com SERVICE_ROLE_KEY
--    c) Supabase CLI: supabase storage buckets create <bucket-name>

-- 2. ESTRUTURA DE PATHS RECOMENDADA:
--    avatars:
--      - {user_id}/avatar.jpg (avatar do usuário)
--      - {profile_id}/avatar.jpg (avatar do perfil)
--    
--    channel-logos:
--      - {channel_id}/logo.png
--    
--    content-media:
--      - posters/{content_id}.jpg
--      - backdrops/{content_id}.jpg
--      - logos/{content_id}.png

-- 3. SIGNED URLs:
--    Para buckets privados (avatars), use createSignedUrl() no backend:
--    
--    const { data, error } = await supabase.storage
--      .from('make-2363f5d6-avatars')
--      .createSignedUrl('path/to/file.jpg', 3600); // 1 hora

-- 4. PUBLIC URLs:
--    Para buckets públicos (channel-logos, content-media), use getPublicUrl():
--    
--    const { data } = supabase.storage
--      .from('make-2363f5d6-channel-logos')
--      .getPublicUrl('path/to/logo.png');

-- 5. UPLOAD DE ARQUIVOS:
--    Frontend (usuário autenticado):
--    
--    const { data, error } = await supabase.storage
--      .from('make-2363f5d6-avatars')
--      .upload(`${userId}/avatar.jpg`, file, {
--        cacheControl: '3600',
--        upsert: true
--      });

-- 6. VALIDAÇÃO NO BACKEND:
--    O Edge Function deve validar:
--    - Tamanho do arquivo
--    - Tipo MIME
--    - Permissões do usuário
--    - Quotas de storage

-- =====================================================
-- EXEMPLO DE CÓDIGO PARA EDGE FUNCTION
-- Criação idempotente de buckets
-- =====================================================

-- TypeScript (Edge Function):
-- 
-- import { createClient } from 'npm:@supabase/supabase-js@2';
-- 
-- const supabase = createClient(
--   Deno.env.get('SUPABASE_URL')!,
--   Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
-- );
-- 
-- async function ensureBucketsExist() {
--   const buckets = [
--     {
--       name: 'make-2363f5d6-avatars',
--       options: { public: false, fileSizeLimit: 2097152 }
--     },
--     {
--       name: 'make-2363f5d6-channel-logos',
--       options: { public: true, fileSizeLimit: 524288 }
--     },
--     {
--       name: 'make-2363f5d6-content-media',
--       options: { public: true, fileSizeLimit: 5242880 }
--     }
--   ];
-- 
--   for (const bucket of buckets) {
--     const { data: existing } = await supabase.storage.listBuckets();
--     const bucketExists = existing?.some(b => b.name === bucket.name);
--     
--     if (!bucketExists) {
--       const { error } = await supabase.storage.createBucket(
--         bucket.name,
--         bucket.options
--       );
--       if (error) console.error(`Erro ao criar bucket ${bucket.name}:`, error);
--       else console.log(`Bucket ${bucket.name} criado com sucesso`);
--     }
--   }
-- }

-- =====================================================
-- FIM DA MIGRATION 005
-- =====================================================
