# RedFlix - Resumo do Schema do Banco de Dados

## 📊 Tabelas Criadas (14 tabelas)

### 1. **users** - Usuários do sistema
- Estende `auth.users` com informações de assinatura
- Campos: id, email, full_name, subscription_plan, subscription_status, is_admin
- **RLS**: Usuários veem apenas seus dados; Admins veem tudo

### 2. **profiles** - Perfis de visualização (máx. 5 por usuário)
- Campos: id, user_id, name, avatar_url, is_kids, pin_code, maturity_rating
- **RLS**: Usuários gerenciam apenas seus perfis
- **Trigger**: `check_max_profiles` impede mais de 5 perfis

### 3. **content** - Catálogo de filmes e séries
- Campos: id, tmdb_id, media_type, title, overview, genres (JSONB), poster_path, is_featured, is_top10
- **RLS**: Todos podem ler conteúdos disponíveis; Admins podem editar
- **Índices**: Full-text search (title, overview), GIN (genres), popularidade, rating

### 4. **seasons** - Temporadas de séries
- Campos: id, content_id, season_number, name, episode_count
- **RLS**: Todos podem ler; Admins podem editar

### 5. **episodes** - Episódios de séries
- Campos: id, season_id, content_id, episode_number, name, video_url, runtime
- **RLS**: Todos podem ler; Admins podem editar

### 6. **my_list** - "Minha Lista" de cada perfil
- Campos: id, profile_id, content_id, added_at
- **RLS**: Usuários gerenciam apenas listas de seus perfis

### 7. **favorites** - Like/Dislike de conteúdos
- Campos: id, profile_id, content_id, rating ('like' ou 'dislike')
- **RLS**: Usuários gerenciam apenas favoritos de seus perfis

### 8. **watch_history** - Histórico e progresso de visualização
- Campos: id, profile_id, content_id, episode_id, current_time, total_time, progress_percentage, completed
- **RLS**: Usuários gerenciam apenas histórico de seus perfis
- **Trigger**: `calculate_watch_progress` calcula automaticamente progress_percentage e marca como completed >= 90%

### 9. **reviews** - Avaliações e comentários
- Campos: id, user_id, content_id, rating (1-5), review_text, is_spoiler, helpful_count
- **RLS**: Todos podem ler; Usuários gerenciam suas próprias reviews

### 10. **iptv_channels** - Canais de TV ao vivo
- Campos: id, name, logo_url, category, stream_url, is_active, available_for_plans
- **RLS**: Todos podem ler canais ativos; Admins podem editar

### 11. **iptv_favorites** - Canais favoritos de cada perfil
- Campos: id, profile_id, channel_id, added_at
- **RLS**: Usuários gerenciam apenas favoritos de seus perfis

### 12. **notifications** - Notificações para usuários
- Campos: id, user_id, title, message, type, is_read, action_url
- **RLS**: Usuários veem apenas suas notificações; Admins podem criar

### 13. **admin_logs** - Logs de ações administrativas (auditoria)
- Campos: id, admin_id, action, entity_type, entity_id, details (JSONB), ip_address
- **RLS**: Apenas admins podem ler e inserir

### 14. **system_settings** - Configurações globais do sistema
- Campos: id, key, value (JSONB), description, is_public
- **RLS**: Configurações públicas visíveis para todos; Apenas admins gerenciam

---

## 🔐 Principais Políticas RLS por Tabela

| Tabela | SELECT | INSERT | UPDATE | DELETE |
|--------|--------|--------|--------|--------|
| **users** | Próprio usuário ou Admin | - | Próprio usuário ou Admin | - |
| **profiles** | Próprios perfis | Próprios perfis | Próprios perfis | Próprios perfis |
| **content** | Todos (se disponível) | Admin | Admin | Admin |
| **seasons** | Todos (se disponível) | Admin | Admin | Admin |
| **episodes** | Todos (se disponível) | Admin | Admin | Admin |
| **my_list** | Próprias listas | Próprias listas | - | Próprias listas |
| **favorites** | Próprios favoritos | Próprios favoritos | Próprios favoritos | Próprios favoritos |
| **watch_history** | Próprio histórico | Próprio histórico | Próprio histórico | Próprio histórico |
| **reviews** | Todos | Próprias reviews | Próprias reviews | Próprias reviews |
| **iptv_channels** | Todos (se ativo) | Admin | Admin | Admin |
| **iptv_favorites** | Próprios favoritos | Próprios favoritos | - | Próprios favoritos |
| **notifications** | Próprias notificações | Admin | Próprias notificações | Próprias notificações |
| **admin_logs** | Admin | Admin | - | - |
| **analytics_events** | Próprios eventos ou Admin | Authenticated/Anon | - | - |
| **system_settings** | Públicas ou Admin | Admin | Admin | Admin |

---

## ⚙️ Triggers e Funções Principais

### Triggers Automáticos

1. **update_updated_at()** - Atualiza `updated_at` em BEFORE UPDATE
   - Aplicado em: users, profiles, content, seasons, episodes, watch_history, reviews, iptv_channels, system_settings

2. **calculate_progress_percentage()** - Calcula progresso de visualização
   - Aplicado em: watch_history
   - Valida total_time >= current_time
   - Calcula progress_percentage = (current_time / total_time) * 100
   - Marca completed = true se >= 90%

3. **enforce_max_profiles_per_user()** - Limite de 5 perfis por usuário
   - Aplicado em: profiles (BEFORE INSERT)
   - Impede criação se usuário já tem 5 perfis

4. **create_user_record()** - Cria registro em public.users quando usuário é criado
   - Aplicado em: auth.users (AFTER INSERT)
   - SECURITY DEFINER

### Funções RPC (Callable via Frontend)

1. **search_content(query, limit, offset)** - Busca full-text em conteúdos
   - Retorna: conteúdos com score de similaridade
   - Público (anon + authenticated)

2. **get_trending_content(limit)** - Conteúdos em alta (popularidade + views recentes)
   - Retorna: conteúdos ordenados por view_count (últimos 7 dias) + popularity
   - Público (anon + authenticated)

3. **get_content_with_progress(profile_id, limit, offset)** - Conteúdos com progresso do perfil
   - Retorna: conteúdos com progress_percentage, last_watched_at, completed
   - Authenticated only
   - SECURITY DEFINER

4. **get_user_recommendations(profile_id, limit)** - Recomendações personalizadas
   - Retorna: conteúdos baseados em gêneros assistidos pelo perfil
   - Authenticated only
   - SECURITY DEFINER

5. **increment_helpful_count(review_id)** - Incrementa helpful_count de uma review
   - Authenticated only
   - SECURITY DEFINER

6. **update_content_from_tmdb(...)** - UPSERT de conteúdo do TMDB
   - Uso interno via Edge Function com SERVICE_ROLE_KEY
   - SECURITY DEFINER

---

## 📈 Índices Importantes

### Full-Text Search
- `idx_content_title_trgm` - GIN em title
- `idx_content_overview_trgm` - GIN em overview

### JSONB
- `idx_content_genres` - GIN em genres
- `idx_admin_logs_details` - GIN em details
- `idx_analytics_events_data` - GIN em event_data
- `idx_system_settings_value` - GIN em value

### Performance
- `idx_content_listing` - Composto: is_available, media_type, popularity DESC
- `idx_watch_history_continue` - Continue assistindo (completed=false, progress>5%)
- `idx_analytics_user_events` - Composto: user_id, event_type, created_at DESC
- `idx_iptv_channels_sort` - Composto: category, is_active, sort_order

### Relações
- Índices em todas as FKs (user_id, profile_id, content_id, etc.)
- Índices em TMDB IDs para sincronização

---

## 🗂️ Storage Buckets

| Bucket | Público | Tamanho Máx | Uso |
|--------|---------|-------------|-----|
| **make-2363f5d6-avatars** | ❌ Não | 2 MB | Fotos de perfil de usuários |
| **make-2363f5d6-channel-logos** | ✅ Sim | 500 KB | Logos de canais IPTV |
| **make-2363f5d6-content-media** | ✅ Sim | 5 MB | Posters, backdrops de conteúdos |

### Políticas de Storage

- **avatars**: Usuários gerenciam apenas seus próprios avatares e de seus perfis
- **channel-logos**: Todos podem ler; Admins podem editar
- **content-media**: Todos podem ler; Admins podem editar

---

## ⚡ Edge Functions

### sync-tmdb-content
- **Endpoint**: `POST /functions/v1/sync-tmdb-content`
- **Auth**: Bearer SUPABASE_ANON_KEY
- **Função**: Sincroniza conteúdos do TMDB para o banco
- **Parâmetros**:
  - `tmdb_ids`: Array de IDs do TMDB
  - `media_type`: 'movie' ou 'tv'
  - `sync_all`: true para sincronizar conteúdos populares
  - `limit`: Número de conteúdos a sincronizar (se sync_all=true)
- **Retorna**: 
  ```json
  {
    "success": true,
    "synced": 10,
    "errors": 0,
    "results": [...],
    "errors": [...]
  }
  ```

---

## 🔍 Queries de Verificação (Executar Após Deploy)

### 1. Validar que não existem users sem email
```sql
SELECT * FROM public.users WHERE email IS NULL OR email = '';
```
**Esperado**: 0 resultados

### 2. Validar que nenhum user tem > 5 perfis
```sql
SELECT user_id, COUNT(*) as profile_count
FROM public.profiles
GROUP BY user_id
HAVING COUNT(*) > 5;
```
**Esperado**: 0 resultados

### 3. Validar que progress_percentage está entre 0 e 100
```sql
SELECT * FROM public.watch_history
WHERE progress_percentage < 0 OR progress_percentage > 100;
```
**Esperado**: 0 resultados

### 4. Validar que completed é true quando progress >= 90%
```sql
SELECT * FROM public.watch_history
WHERE progress_percentage >= 90 AND completed = false;
```
**Esperado**: 0 resultados

### 5. Validar que conteúdos featured estão disponíveis
```sql
SELECT * FROM public.content
WHERE is_featured = true AND is_available = false;
```
**Esperado**: 0 resultados

### 6. Validar que top10_position é único para cada posição
```sql
SELECT top10_position, COUNT(*) as count
FROM public.content
WHERE is_top10 = true
GROUP BY top10_position
HAVING COUNT(*) > 1;
```
**Esperado**: 0 resultados

### 7. Validar que system_settings tem as configurações básicas
```sql
SELECT key FROM public.system_settings
WHERE key IN ('app_name', 'app_version', 'maintenance_mode', 'max_profiles_per_user', 'plans')
ORDER BY key;
```
**Esperado**: 5 resultados

### 8. Validar que buckets de storage existem
```sql
SELECT name FROM storage.buckets
WHERE name LIKE 'make-2363f5d6-%'
ORDER BY name;
```
**Esperado**: 3 resultados

### 9. Validar que RLS está habilitado em todas as tabelas
```sql
SELECT tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = false;
```
**Esperado**: 0 resultados

### 10. Validar que extensões necessárias estão instaladas
```sql
SELECT extname FROM pg_extension
WHERE extname IN ('uuid-ossp', 'pg_trgm', 'unaccent')
ORDER BY extname;
```
**Esperado**: 3 resultados

---

## 🎯 Resumo de Counts Esperados

Após aplicar todas as migrations e seeds:

| Item | Quantidade |
|------|------------|
| **Tabelas** | 14 |
| **Políticas RLS** | 60+ |
| **Triggers** | 12+ |
| **Funções** | 10+ |
| **Índices** | 70+ |
| **Users (seed)** | 3 |
| **Profiles (seed)** | 3 |
| **Content (seed)** | 3 |
| **Seasons (seed)** | 2 |
| **Episodes (seed)** | 2 |
| **IPTV Channels (seed)** | 6 |
| **System Settings** | 7 |
| **Storage Buckets** | 3 |
| **Edge Functions** | 1 |

---

## 🚨 Avisos Importantes

1. **NÃO execute** migrations em produção sem testar em desenvolvimento primeiro
2. **NÃO desabilite** RLS em produção
3. **NÃO compartilhe** SUPABASE_SERVICE_ROLE_KEY publicamente
4. **SEMPRE use** CREATE INDEX CONCURRENTLY em produção para índices grandes
5. **FAÇA BACKUP** antes de migrations destrutivas
6. **Os seeds** usam UUIDs fixos - em produção, use auth.users real
7. **O trigger on_auth_user_created** pode precisar ser criado manualmente
8. **Valide todas as políticas RLS** antes de liberar para usuários

---

**RedFlix Database Schema v1.0** - Pronto para Deploy 🚀
