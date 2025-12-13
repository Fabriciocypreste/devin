# 📋 FORMULÁRIO COMPLETO - BANCO DE DADOS REDFLIX SUPABASE/POSTGRES

**Data:** 19 de Novembro de 2024  
**Versão:** 1.0 Final  
**Projeto:** RedFlix - Plataforma de Streaming

---

## 1️⃣ IDENTIFICAÇÃO DO PRODUTO

**Nome do site/produto:**  
RedFlix

**Descrição:**  
Plataforma completa de streaming estilo Netflix com integração TMDB para catálogo de 50.000+ filmes e séries, sistema IPTV com 80+ canais de TV ao vivo, autenticação multi-perfil (até 5 por usuário), dashboard administrativo completo, sistema de listas personalizadas (Minha Lista, Favoritos, Continuar Assistindo), página Kids com jogos integrados, busca avançada com filtros, player universal de vídeo, analytics de uso e suporte a 3 planos de assinatura (free, basic, standard, premium).

**Público-alvo:**  
Usuários brasileiros (18-65 anos) que desejam consumir filmes, séries e TV ao vivo em uma plataforma unificada, com foco em conteúdo dublado/legendado em português.

**URL do site:**  
Local (em desenvolvimento) - Deploy futuro em Vercel/Netlify

---

## 2️⃣ TRÁFEGO E DESEMPENHO (ESTIMATIVAS)

**Usuários únicos diários:**  
- MVP: 100-500 usuários/dia  
- Crescimento: 1.000-5.000 usuários/dia  
- Produção: 10.000-50.000 usuários/dia

**Leituras por segundo (pico estimado):**  
- MVP: 10-50 rps  
- Produção: 500-2.000 rps

**Escritas por segundo (pico estimado):**  
- MVP: 5-20 wps  
- Produção: 200-500 wps  
(Alta escrita devido a watch_history salvar progresso a cada 30s durante reprodução)

**SLA/Latência desejada:**  
- p95 leitura: < 200ms  
- p95 escrita: < 500ms  
- Uptime: 99.5% (MVP) / 99.9% (Produção)

---

## 3️⃣ AMBIENTES E MIGRAÇÕES

**Estratégia de ambientes:**  
Projeto único Supabase com separação lógica via RLS e schemas. Ambiente local usa Supabase CLI para desenvolvimento. Produção em projeto Supabase dedicado. Justificativa: MVP com orçamento limitado, migração para projetos separados (dev/staging/prod) quando escalar.

**Política de migrações:**  
Dev (local) → Testar migrations → Staging (branch de testes) → Approval manual → Prod (deploy com backup prévio). Rollback via migrations down ou restore de backup point-in-time do Supabase.

**Ferramenta de migração desejada:**  
Supabase Migrations (SQL puro) com versionamento em `/supabase/migrations/*.sql`. Arquivos numerados sequencialmente (001_, 002_, etc).

---

## 4️⃣ ARTEFATOS E CÓDIGO

### **Arquivos backend disponíveis:**

```
/supabase/migrations/001_create_redflix_schema.sql  
/supabase/migrations/002_create_kv_store.sql  
/supabase/functions/server/index.tsx (Hono web server)  
/supabase/functions/server/kv_store.tsx (KV store helper)  
/utils/supabase/admin.ts (cliente service_role)  
/utils/supabase/client.ts (cliente público)  
/utils/supabase/database.ts (funções CRUD)  
/utils/supabase/info.tsx (projectId, publicAnonKey)
```

### **Arquivos frontend/rotas relevantes:**

```
/App.tsx (14 rotas principais)  
/components/Login.tsx  
/components/Signup.tsx  
/components/ProfileSelection.tsx  
/components/UserDashboard.tsx  
/components/AdminDashboardV2.tsx  
/components/MyListPage.tsx  
/components/MovieDetails.tsx  
/components/IPTVPage.tsx  
/components/KidsPage.tsx  
/components/SoccerPage.tsx
```

### **Diagrama ER:**  
NÃO existe atualmente. Precisa ser gerado a partir do schema SQL.

### **Arquivos de seed/CSV/JSON:**

```
/public/data/canais.json (80 canais IPTV - ANEXAR)  
/public/data/lista.m3u (lista M3U de canais)  
Seed SQL em /supabase/migrations/001_create_redflix_schema.sql (linhas 622-629: 6 canais exemplo)  
CSV de 80 canais IPTV - NÃO EXISTE, precisa ser extraído de canais.json
```

---

## 5️⃣ ENDPOINTS/ROTAS CRÍTICAS (TOP 10)

### **1. GET /api/content**
- **Payload:** `{ genre_id?: number, media_type?: 'movie'|'tv', limit?: number }`
- **Resposta:** `Array<{ id, title, poster_path, vote_average, media_type }>`
- **Criticidade:** ALTA (página inicial, categorias)

### **2. GET /api/profiles/:userId**
- **Payload:** `{ user_id: uuid }`
- **Resposta:** `Array<{ id, name, avatar_url, is_kids, last_used }>`
- **Criticidade:** ALTA (seleção de perfil obrigatória após login)

### **3. POST /api/my-list**
- **Payload:** `{ profile_id: uuid, content_id: bigint }`
- **Resposta:** `{ id: uuid, added_at: timestamp }`
- **Criticidade:** MÉDIA (feature principal de listas)

### **4. GET /api/continue-watching/:profileId**
- **Payload:** `{ profile_id: uuid, limit?: number }`
- **Resposta:** `Array<{ content_id, title, progress_percentage, updated_at }>`
- **Criticidade:** ALTA (UX principal - continuar assistindo)

### **5. PUT /api/watch-progress**
- **Payload:** `{ profile_id: uuid, content_id: bigint, episode_id?: uuid, current_time: int, total_time: int }`
- **Resposta:** `{ progress_percentage: decimal, completed: boolean }`
- **Criticidade:** ALTA (salvo a cada 30s durante reprodução)

### **6. GET /api/iptv-channels**
- **Payload:** `{ category?: string, is_active?: boolean }`
- **Resposta:** `Array<{ id, name, logo_url, stream_url, category }>`
- **Criticidade:** MÉDIA (página IPTV)

### **7. GET /api/trending**
- **Payload:** `{ limit?: number }`
- **Resposta:** `Array<Content>` (view com watch_count e avg_rating dos últimos 7 dias)
- **Criticidade:** ALTA (página "Bombando")

### **8. POST /api/analytics/track**
- **Payload:** `{ event_type: string, event_category: string, metadata: jsonb, user_id?: uuid, profile_id?: uuid, content_id?: bigint }`
- **Resposta:** `{ success: boolean }`
- **Criticidade:** BAIXA (fire-and-forget, não bloqueia UX)

### **9. GET /api/search**
- **Payload:** `{ q: string, limit?: number }`
- **Resposta:** `Array<Content>` (full-text search português em title)
- **Criticidade:** ALTA (busca principal)

### **10. GET /api/admin/stats**
- **Payload:** `{ admin_id: uuid }`
- **Resposta:** `{ total_users: int, active_subscriptions: int, total_views: int, revenue: decimal }`
- **Criticidade:** MÉDIA (dashboard administrativo)

---

## 6️⃣ ENTIDADES (TABELAS) - DETALHAMENTO COMPLETO

### **TABELA 1: public.users**

**Descrição:**  
Usuários da plataforma (extends auth.users do Supabase). Armazena dados de assinatura, preferências e configurações de conta.

**Campos:**

```sql
id                    | UUID         | NOT NULL | PK, FK → auth.users(id) ON DELETE CASCADE
email                 | TEXT         | NOT NULL | UNIQUE
full_name             | TEXT         | NULL     | -
avatar_url            | TEXT         | NULL     | -
phone                 | TEXT         | NULL     | -
birth_date            | DATE         | NULL     | -
country               | TEXT         | NULL     | DEFAULT 'BR'
language              | TEXT         | NULL     | DEFAULT 'pt-BR'

subscription_plan     | TEXT         | NOT NULL | DEFAULT 'free' CHECK IN ('free','basic','standard','premium')
subscription_status   | TEXT         | NOT NULL | DEFAULT 'inactive' CHECK IN ('active','inactive','canceled','trial')
subscription_start_date | TIMESTAMPTZ | NULL    | -
subscription_end_date | TIMESTAMPTZ | NULL     | -

adult_content         | BOOLEAN      | NOT NULL | DEFAULT false
autoplay_next_episode | BOOLEAN      | NOT NULL | DEFAULT true
autoplay_previews     | BOOLEAN      | NOT NULL | DEFAULT true
subtitle_language     | TEXT         | NULL     | DEFAULT 'pt'
audio_language        | TEXT         | NULL     | DEFAULT 'pt'
video_quality         | TEXT         | NULL     | DEFAULT 'auto' CHECK IN ('auto','480p','720p','1080p','4k')

created_at            | TIMESTAMPTZ  | NOT NULL | DEFAULT NOW()
updated_at            | TIMESTAMPTZ  | NOT NULL | DEFAULT NOW()
last_login            | TIMESTAMPTZ  | NULL     | -
is_admin              | BOOLEAN      | NOT NULL | DEFAULT false
is_active             | BOOLEAN      | NOT NULL | DEFAULT true
```

**Chave Primária:** `id`  
**Foreign Keys:** `id → auth.users(id) ON DELETE CASCADE`  
**Índices:**
- `idx_users_email ON email` (BTREE)
- `idx_users_subscription_status ON subscription_status` (BTREE)
- `idx_users_is_admin ON is_admin` (BTREE)

**Cardinalidade:**  
MVP: 100-500 | Crescimento: 1.000-10.000 | Produção: 10.000-100.000

**Exemplos (2 registros):**

```sql
INSERT INTO users VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@redflix.com', 'Admin RedFlix', NULL, NULL, '1990-01-01',
  'BR', 'pt-BR', 'premium', 'active', '2024-01-01 00:00:00+00', NULL,
  true, true, true, 'pt', 'pt', '1080p',
  '2024-01-01 00:00:00+00', NOW(), NOW(), true, true
);

INSERT INTO users VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  'joao@email.com', 'João Silva', 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
  '+5511999998888', '1995-05-15', 'BR', 'pt-BR', 'premium', 'active',
  '2024-06-01 00:00:00+00', '2025-06-01 00:00:00+00',
  false, true, true, 'pt', 'pt', 'auto',
  '2024-06-01 10:30:00+00', NOW(), NOW(), false, true
);
```

---

### **TABELA 2: public.profiles**

**Descrição:**  
Perfis individuais por usuário (máximo 5). Cada perfil tem listas, histórico e preferências isoladas.

**Campos:**

```sql
id            | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
user_id       | UUID        | NOT NULL | FK → users(id) ON DELETE CASCADE
name          | TEXT        | NOT NULL | Min 1, Max 50 caracteres
avatar_url    | TEXT        | NULL     | DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
is_kids       | BOOLEAN     | NOT NULL | DEFAULT false
pin_code      | TEXT        | NULL     | Encrypted (bcrypt/argon2)
language      | TEXT        | NULL     | DEFAULT 'pt-BR'
age_rating    | TEXT        | NULL     | DEFAULT 'all' CHECK IN ('all','10','12','14','16','18')
autoplay      | BOOLEAN     | NOT NULL | DEFAULT true
notifications | BOOLEAN     | NOT NULL | DEFAULT true
created_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
last_used     | TIMESTAMPTZ | NULL     | -
```

**Chave Primária:** `id`  
**Foreign Keys:** `user_id → users(id) ON DELETE CASCADE`  
**Constraint:** `CHECK ((SELECT COUNT(*) FROM profiles WHERE user_id = profiles.user_id) <= 5)`

**Índices:**
- `idx_profiles_user_id ON user_id` (BTREE)
- `idx_profiles_is_kids ON is_kids` (BTREE)

**Cardinalidade:**  
MVP: 200-1.000 | Crescimento: 2.000-20.000 | Produção: 20.000-200.000

**Exemplos:**

```sql
INSERT INTO profiles VALUES (
  '880e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440001',
  'João', 'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
  false, NULL, 'pt-BR', '18', true, true,
  NOW(), NOW(), NOW()
);

INSERT INTO profiles VALUES (
  '990e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  'Pedro (Kids)', 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
  true, '$2a$10$encrypted_pin', 'pt-BR', '10', true, false,
  NOW(), NOW(), NOW()
);
```

---

### **TABELA 3: public.content**

**Descrição:**  
Catálogo de filmes e séries sincronizado com TMDB API. Tabela central de todo o conteúdo da plataforma.

**Campos:**

```sql
id                    | BIGINT       | NOT NULL | PK (TMDB ID)
tmdb_id               | BIGINT       | NOT NULL | UNIQUE
imdb_id               | TEXT         | NULL     | Formato: tt1234567
media_type            | TEXT         | NOT NULL | CHECK IN ('movie', 'tv')
title                 | TEXT         | NOT NULL | Título em português
original_title        | TEXT         | NULL     | Título original
overview              | TEXT         | NULL     | Sinopse
tagline               | TEXT         | NULL     | -
poster_path           | TEXT         | NULL     | /path.jpg (relativo TMDB)
backdrop_path         | TEXT         | NULL     | /path.jpg
logo_path             | TEXT         | NULL     | Logo PNG transparente
trailer_key           | TEXT         | NULL     | YouTube key
release_date          | DATE         | NULL     | -
runtime               | INTEGER      | NULL     | Minutos
status                | TEXT         | NULL     | Released, In Production
vote_average          | DECIMAL(3,1) | NULL     | 0.0-10.0
vote_count            | INTEGER      | NULL     | -
popularity            | DECIMAL(10,3)| NULL     | Score TMDB
genres                | JSONB        | NOT NULL | DEFAULT '[]' Ex: [{"id":28,"name":"Ação"}]
production_countries  | JSONB        | NOT NULL | DEFAULT '[]'
spoken_languages      | JSONB        | NOT NULL | DEFAULT '[]'
keywords              | JSONB        | NOT NULL | DEFAULT '[]'
number_of_seasons     | INTEGER      | NULL     | Apenas séries
number_of_episodes    | INTEGER      | NULL     | Apenas séries
episode_run_time      | JSONB        | NOT NULL | DEFAULT '[]' Ex: [45,50]
stream_url            | TEXT         | NULL     | MP4, M3U8, etc
has_stream            | BOOLEAN      | NOT NULL | DEFAULT false
stream_quality        | TEXT         | NULL     | 720p, 1080p, 4k
age_rating            | TEXT         | NULL     | DEFAULT 'L' CHECK IN ('L','10','12','14','16','18')
is_featured           | BOOLEAN      | NOT NULL | DEFAULT false (hero banner)
is_trending           | BOOLEAN      | NOT NULL | DEFAULT false
is_new                | BOOLEAN      | NOT NULL | DEFAULT false
is_original           | BOOLEAN      | NOT NULL | DEFAULT false (RedFlix Original)
created_at            | TIMESTAMPTZ  | NOT NULL | DEFAULT NOW()
updated_at            | TIMESTAMPTZ  | NOT NULL | DEFAULT NOW()
last_synced           | TIMESTAMPTZ  | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:** Nenhuma (tabela raiz)

**Índices:**
- `idx_content_tmdb_id ON tmdb_id` (BTREE UNIQUE)
- `idx_content_media_type ON media_type` (BTREE)
- `idx_content_is_featured ON is_featured` (BTREE)
- `idx_content_is_trending ON is_trending` (BTREE)
- `idx_content_genres ON genres` (GIN)
- `idx_content_title_search ON to_tsvector('portuguese', title)` (GIN)

**Cardinalidade:**  
MVP: 1.000-5.000 | Crescimento: 10.000-50.000 | Produção: 50.000-200.000

**Exemplos:**

```sql
INSERT INTO content VALUES (
  299536, 299536, 'tt4154796', 'movie',
  'Vingadores: Ultimato', 'Avengers: Endgame',
  'Após Thanos eliminar metade das criaturas vivas...',
  'Vingue os caídos.',
  '/q6725aR8wg0m4ESYB6npol4c0qT.jpg',
  '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
  '/logo_vingadores.png', 'TcMBFSGVi1C',
  '2019-04-24', 181, 'Released', 8.3, 24567, 523.234,
  '[{"id":28,"name":"Ação"},{"id":12,"name":"Aventura"}]'::jsonb,
  '[{"iso_3166_1":"US","name":"United States"}]'::jsonb,
  '[{"iso_639_1":"en","name":"English"}]'::jsonb,
  '[{"id":9715,"name":"superhero"}]'::jsonb,
  NULL, NULL, '[]'::jsonb,
  'https://cdn.redflix.com/movies/vingadores-ultimato.mp4',
  true, '1080p', '12', true, true, false, false,
  NOW(), NOW(), NOW()
);
```

---

### **TABELA 4: public.seasons**

**Descrição:**  
Temporadas de séries (relacionadas a content onde media_type='tv').

**Campos:**

```sql
id              | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
content_id      | BIGINT      | NOT NULL | FK → content(id) ON DELETE CASCADE
season_number   | INTEGER     | NOT NULL | >= 0 (temporada 0 = especiais)
tmdb_id         | BIGINT      | NULL     | UNIQUE
name            | TEXT        | NOT NULL | Ex: "Temporada 1"
overview        | TEXT        | NULL     | -
poster_path     | TEXT        | NULL     | -
air_date        | DATE        | NULL     | -
episode_count   | INTEGER     | NULL     | -
created_at      | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at      | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:** `content_id → content(id) ON DELETE CASCADE`  
**Constraint:** `UNIQUE(content_id, season_number)`

**Índices:**
- `idx_seasons_content_id ON content_id` (BTREE)
- `idx_seasons_season_number ON season_number` (BTREE)

**Cardinalidade:**  
MVP: 500-2.000 | Crescimento: 5.000-20.000 | Produção: 20.000-100.000

---

### **TABELA 5: public.episodes**

**Descrição:**  
Episódios individuais de temporadas de séries.

**Campos:**

```sql
id              | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
season_id       | UUID        | NOT NULL | FK → seasons(id) ON DELETE CASCADE
episode_number  | INTEGER     | NOT NULL | >= 1
tmdb_id         | BIGINT      | NULL     | UNIQUE
name            | TEXT        | NOT NULL | -
overview        | TEXT        | NULL     | -
still_path      | TEXT        | NULL     | Thumbnail do episódio
air_date        | DATE        | NULL     | -
runtime         | INTEGER     | NULL     | Minutos
vote_average    | DECIMAL(3,1)| NULL     | 0.0-10.0
vote_count      | INTEGER     | NULL     | -
stream_url      | TEXT        | NULL     | -
has_stream      | BOOLEAN     | NOT NULL | DEFAULT false
created_at      | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at      | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:** `season_id → seasons(id) ON DELETE CASCADE`  
**Constraint:** `UNIQUE(season_id, episode_number)`

**Índices:**
- `idx_episodes_season_id ON season_id` (BTREE)
- `idx_episodes_episode_number ON episode_number` (BTREE)

**Cardinalidade:**  
MVP: 5.000-20.000 | Crescimento: 50.000-200.000 | Produção: 200.000-1.000.000

---

### **TABELA 6: public.my_list**

**Descrição:**  
Lista "Minha Lista" por perfil (botão + no card).

**Campos:**

```sql
id          | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
profile_id  | UUID        | NOT NULL | FK → profiles(id) ON DELETE CASCADE
content_id  | BIGINT      | NOT NULL | FK → content(id) ON DELETE CASCADE
added_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:**  
- `profile_id → profiles(id) ON DELETE CASCADE`  
- `content_id → content(id) ON DELETE CASCADE`

**Constraint:** `UNIQUE(profile_id, content_id)`

**Índices:**
- `idx_my_list_profile_id ON profile_id` (BTREE)
- `idx_my_list_content_id ON content_id` (BTREE)
- `idx_my_list_added_at ON added_at DESC` (BTREE)

**Cardinalidade:**  
MVP: 500-2.000 | Crescimento: 5.000-50.000 | Produção: 50.000-500.000

---

### **TABELA 7: public.favorites**

**Descrição:**  
Favoritos/Curtidos por perfil (botão ❤️ no card). Estrutura idêntica a my_list.

**Campos:**

```sql
id          | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
profile_id  | UUID        | NOT NULL | FK → profiles(id) ON DELETE CASCADE
content_id  | BIGINT      | NOT NULL | FK → content(id) ON DELETE CASCADE
added_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:**  
- `profile_id → profiles(id) ON DELETE CASCADE`  
- `content_id → content(id) ON DELETE CASCADE`

**Constraint:** `UNIQUE(profile_id, content_id)`

**Índices:**
- `idx_favorites_profile_id ON profile_id` (BTREE)
- `idx_favorites_content_id ON content_id` (BTREE)

**Cardinalidade:**  
MVP: 500-2.000 | Crescimento: 5.000-50.000 | Produção: 50.000-500.000

---

### **TABELA 8: public.watch_history**

**Descrição:**  
Histórico de visualização e progresso de reprodução. Usado para "Continuar Assistindo". **TABELA DE ALTA ESCRITA** (upsert a cada 30s durante reprodução).

**Campos:**

```sql
id                  | UUID         | NOT NULL | PK, DEFAULT uuid_generate_v4()
profile_id          | UUID         | NOT NULL | FK → profiles(id) ON DELETE CASCADE
content_id          | BIGINT       | NOT NULL | FK → content(id) ON DELETE CASCADE
episode_id          | UUID         | NULL     | FK → episodes(id) ON DELETE SET NULL
current_time        | INTEGER      | NOT NULL | DEFAULT 0, segundos
total_time          | INTEGER      | NULL     | Segundos
progress_percentage | DECIMAL(5,2) | NOT NULL | DEFAULT 0, 0-100 (calculado automaticamente)
completed           | BOOLEAN      | NOT NULL | DEFAULT false (auto true se >= 90%)
watched_at          | TIMESTAMPTZ  | NOT NULL | DEFAULT NOW()
updated_at          | TIMESTAMPTZ  | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:**  
- `profile_id → profiles(id) ON DELETE CASCADE`  
- `content_id → content(id) ON DELETE CASCADE`  
- `episode_id → episodes(id) ON DELETE SET NULL`

**Constraint:** `UNIQUE(profile_id, content_id, episode_id)`

**Trigger:** `calculate_progress_percentage()` BEFORE INSERT/UPDATE calcula progress_percentage e marca completed=true se >= 90%

**Índices:**
- `idx_watch_history_profile_id ON profile_id` (BTREE)
- `idx_watch_history_content_id ON content_id` (BTREE)
- `idx_watch_history_updated_at ON updated_at DESC` (BTREE)
- `idx_watch_history_completed ON completed` (BTREE)

**Cardinalidade:**  
MVP: 1.000-5.000 | Crescimento: 10.000-100.000 | Produção: 100.000-1.000.000+

**Exemplos:**

```sql
INSERT INTO watch_history VALUES (
  'bb0e8400-e29b-41d4-a716-446655440000',
  '880e8400-e29b-41d4-a716-446655440000',
  299536, NULL, 5430, 10860, 50.00, false, NOW(), NOW()
);
```

---

### **TABELA 9: public.reviews**

**Descrição:**  
Avaliações e reviews de conteúdo por perfil.

**Campos:**

```sql
id          | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
profile_id  | UUID        | NOT NULL | FK → profiles(id) ON DELETE CASCADE
content_id  | BIGINT      | NOT NULL | FK → content(id) ON DELETE CASCADE
rating      | INTEGER     | NULL     | CHECK >= 1 AND <= 5
review_text | TEXT        | NULL     | Max 1000 caracteres
thumbs_up   | BOOLEAN     | NULL     | true=like, false=dislike, null=none
created_at  | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at  | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:**  
- `profile_id → profiles(id) ON DELETE CASCADE`  
- `content_id → content(id) ON DELETE CASCADE`

**Constraint:** `UNIQUE(profile_id, content_id)`

**Índices:**
- `idx_reviews_profile_id ON profile_id` (BTREE)
- `idx_reviews_content_id ON content_id` (BTREE)
- `idx_reviews_rating ON rating` (BTREE)

**Cardinalidade:**  
MVP: 100-500 | Crescimento: 1.000-10.000 | Produção: 10.000-100.000

---

### **TABELA 10: public.iptv_channels**

**Descrição:**  
Catálogo de 80+ canais de TV ao vivo (IPTV). Usado na página IPTVPage.

**Campos:**

```sql
id          | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
name        | TEXT        | NOT NULL | Nome do canal
logo_url    | TEXT        | NULL     | URL do logo
stream_url  | TEXT        | NOT NULL | M3U8/MP4 URL
category    | TEXT        | NOT NULL | 'sports', 'news', 'movies', 'kids', 'general', 'music'
country     | TEXT        | NULL     | DEFAULT 'BR'
language    | TEXT        | NULL     | DEFAULT 'pt'
quality     | TEXT        | NULL     | DEFAULT '720p'
is_active   | BOOLEAN     | NOT NULL | DEFAULT true
is_premium  | BOOLEAN     | NOT NULL | DEFAULT false (requer assinatura)
sort_order  | INTEGER     | NOT NULL | DEFAULT 0 (ordem de exibição)
created_at  | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at  | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:** Nenhuma

**Índices:**
- `idx_iptv_channels_category ON category` (BTREE)
- `idx_iptv_channels_is_active ON is_active` (BTREE)
- `idx_iptv_channels_sort_order ON sort_order` (BTREE)

**Cardinalidade:**  
MVP: 80-100 | Crescimento: 100-300 | Produção: 300-1.000

**Exemplos:**

```sql
INSERT INTO iptv_channels VALUES (
  'ff0e8400-e29b-41d4-a716-446655440000',
  'Globo',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globo_logo_2008.svg/200px-Globo_logo_2008.svg.png',
  'https://live.cdn.globo.com/stream.m3u8',
  'general', 'BR', 'pt', '1080p', true, false, 1, NOW(), NOW()
);

INSERT INTO iptv_channels VALUES (
  'gg0e8400-e29b-41d4-a716-446655440001',
  'ESPN',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png',
  'https://live.espn.com/stream.m3u8',
  'sports', 'BR', 'pt', '720p', true, true, 10, NOW(), NOW()
);
```

---

### **TABELA 11: public.iptv_favorites**

**Descrição:**  
Canais IPTV favoritos por perfil (N:N entre profiles e iptv_channels).

**Campos:**

```sql
id          | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
profile_id  | UUID        | NOT NULL | FK → profiles(id) ON DELETE CASCADE
channel_id  | UUID        | NOT NULL | FK → iptv_channels(id) ON DELETE CASCADE
added_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:**  
- `profile_id → profiles(id) ON DELETE CASCADE`  
- `channel_id → iptv_channels(id) ON DELETE CASCADE`

**Constraint:** `UNIQUE(profile_id, channel_id)`

**Índices:**
- `idx_iptv_favorites_profile_id ON profile_id` (BTREE)
- `idx_iptv_favorites_channel_id ON channel_id` (BTREE)

**Cardinalidade:**  
MVP: 200-1.000 | Crescimento: 2.000-10.000 | Produção: 20.000-100.000

---

### **TABELA 12: public.notifications**

**Descrição:**  
Sistema de notificações push para usuários.

**Campos:**

```sql
id          | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
user_id     | UUID        | NOT NULL | FK → users(id) ON DELETE CASCADE
profile_id  | UUID        | NULL     | FK → profiles(id) ON DELETE CASCADE
type        | TEXT        | NOT NULL | CHECK IN ('new_content','new_episode','recommendation','system','promo')
title       | TEXT        | NOT NULL | -
message     | TEXT        | NOT NULL | -
image_url   | TEXT        | NULL     | -
action_url  | TEXT        | NULL     | Link para ação
is_read     | BOOLEAN     | NOT NULL | DEFAULT false
created_at  | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
expires_at  | TIMESTAMPTZ | NULL     | Notificação expira
```

**Chave Primária:** `id`  
**Foreign Keys:**  
- `user_id → users(id) ON DELETE CASCADE`  
- `profile_id → profiles(id) ON DELETE CASCADE`

**Índices:**
- `idx_notifications_user_id ON user_id` (BTREE)
- `idx_notifications_is_read ON is_read` (BTREE)
- `idx_notifications_created_at ON created_at DESC` (BTREE)

**Cardinalidade:**  
MVP: 500-2.000 | Crescimento: 5.000-50.000 | Produção: 50.000-500.000

---

### **TABELA 13: public.admin_logs**

**Descrição:**  
Logs de auditoria de ações administrativas.

**Campos:**

```sql
id            | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
admin_id      | UUID        | NULL     | FK → users(id) ON DELETE SET NULL
action        | TEXT        | NOT NULL | 'create', 'update', 'delete', 'login', etc
resource_type | TEXT        | NOT NULL | 'user', 'content', 'channel', etc
resource_id   | TEXT        | NULL     | ID do recurso afetado
details       | JSONB       | NOT NULL | DEFAULT '{}' (dados extras)
ip_address    | INET        | NULL     | IP do admin
user_agent    | TEXT        | NULL     | Browser/OS
created_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:** `admin_id → users(id) ON DELETE SET NULL`

**Índices:**
- `idx_admin_logs_admin_id ON admin_id` (BTREE)
- `idx_admin_logs_action ON action` (BTREE)
- `idx_admin_logs_created_at ON created_at DESC` (BTREE)

**Cardinalidade:**  
MVP: 100-500 | Crescimento: 1.000-10.000 | Produção: 10.000-100.000

---

### **TABELA 14: public.analytics_events**

**Descrição:**  
Eventos de analytics para métricas e insights. **TABELA DE ALTA ESCRITA**.

**Campos:**

```sql
id              | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
user_id         | UUID        | NULL     | FK → users(id) ON DELETE SET NULL
profile_id      | UUID        | NULL     | FK → profiles(id) ON DELETE SET NULL
event_type      | TEXT        | NOT NULL | 'play','pause','complete','search','click'
event_category  | TEXT        | NOT NULL | 'video','navigation','interaction'
content_id      | BIGINT      | NULL     | FK → content(id) ON DELETE SET NULL
episode_id      | UUID        | NULL     | FK → episodes(id) ON DELETE SET NULL
metadata        | JSONB       | NOT NULL | DEFAULT '{}'
session_id      | UUID        | NULL     | Session UUID
device_type     | TEXT        | NULL     | 'desktop','mobile','tablet','tv'
browser         | TEXT        | NULL     | -
os              | TEXT        | NULL     | -
created_at      | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:** `id`  
**Foreign Keys:**  
- `user_id → users(id) ON DELETE SET NULL`  
- `profile_id → profiles(id) ON DELETE SET NULL`  
- `content_id → content(id) ON DELETE SET NULL`  
- `episode_id → episodes(id) ON DELETE SET NULL`

**Índices:**
- `idx_analytics_events_user_id ON user_id` (BTREE)
- `idx_analytics_events_event_type ON event_type` (BTREE)
- `idx_analytics_events_created_at ON created_at DESC` (BTREE)

**Cardinalidade:**  
MVP: 5.000-20.000 | Crescimento: 50.000-500.000 | Produção: 500.000-5.000.000+

**Retenção:** 90 dias (MVP) / 1 ano (Produção)

---

### **TABELA 15: public.system_settings**

**Descrição:**  
Configurações globais do sistema (chave-valor).

**Campos:**

```sql
key         | TEXT        | NOT NULL | PK
value       | JSONB       | NOT NULL | Valor da configuração
description | TEXT        | NULL     | -
updated_at  | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_by  | UUID        | NULL     | FK → users(id) ON DELETE SET NULL
```

**Chave Primária:** `key`  
**Foreign Keys:** `updated_by → users(id) ON DELETE SET NULL`

**Cardinalidade:** 10-50 registros (baixo volume)

**Exemplos (seed data):**

```sql
INSERT INTO system_settings VALUES
  ('maintenance_mode', 'false', 'Modo de manutenção ativo', NOW(), NULL),
  ('allow_signups', 'true', 'Permitir novos cadastros', NOW(), NULL),
  ('max_profiles_per_user', '5', 'Máximo de perfis por usuário', NOW(), NULL);
```

---

### **TABELA 16: public.kv_store_2363f5d6**

**Descrição:**  
Key-Value store para cache de imagens, trending content e dados temporários.

**Campos:**

```sql
key        | TEXT        | NOT NULL | PK
value      | JSONB       | NOT NULL | Dados em JSON
created_at | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
expires_at | TIMESTAMPTZ | NULL     | NULL = nunca expira
```

**Chave Primária:** `key`  
**Foreign Keys:** Nenhuma

**Índices:**
- `idx_kv_store_expires_at ON expires_at` (BTREE)
- `idx_kv_store_updated_at ON updated_at DESC` (BTREE)
- `idx_kv_store_key_prefix ON key text_pattern_ops` (BTREE)

**Função de limpeza:** `clean_expired_kv_entries()` deleta entradas com expires_at < NOW()

**Cardinalidade:**  
MVP: 100-500 | Crescimento: 500-5.000 | Produção: 5.000-50.000

---

## 7️⃣ RELACIONAMENTOS N:N

**Tabelas de junção:**

1. **my_list** → profiles ↔ content
2. **favorites** → profiles ↔ content
3. **iptv_favorites** → profiles ↔ iptv_channels

**Todas têm:**
- UNIQUE(profile_id/user_id, content_id/channel_id)
- ON DELETE CASCADE em ambas FKs
- Índice em profile_id e content_id/channel_id

---

## 8️⃣ REGRAS DE NEGÓCIO E VALIDAÇÕES

### **Validações por campo:**

- `users.email`: UNIQUE, formato email válido
- `users.subscription_plan`: CHECK IN ('free','basic','standard','premium')
- `users.video_quality`: CHECK IN ('auto','480p','720p','1080p','4k')
- `profiles.name`: NOT NULL, length 1-50
- `profiles.age_rating`: CHECK IN ('all','10','12','14','16','18')
- `content.media_type`: CHECK IN ('movie','tv')
- `content.vote_average`: >= 0 AND <= 10
- `content.age_rating`: CHECK IN ('L','10','12','14','16','18')
- `watch_history.current_time`: >= 0
- `watch_history.progress_percentage`: >= 0 AND <= 100
- `reviews.rating`: >= 1 AND <= 5
- `iptv_channels.category`: CHECK IN ('sports','news','movies','kids','general','music')

### **Regras transacionais:**

1. **Adicionar à Minha Lista:**
   - IF EXISTS → ERRO "Já existe"
   - ELSE → INSERT

2. **Salvar Progresso (watch_history):**
   - UPSERT (INSERT ON CONFLICT UPDATE)
   - Trigger calcula progress_percentage = (current_time / total_time) * 100
   - IF progress_percentage >= 90 → completed = true

3. **Criar Perfil:**
   - IF COUNT(profiles WHERE user_id=X) >= 5 → ERRO "Limite atingido"
   - ELSE → INSERT

4. **Deletar Usuário:**
   - CASCADE DELETE em: profiles → my_list, favorites, watch_history, reviews, iptv_favorites, notifications

### **Soft Delete vs Hard Delete:**

**Hard Delete (escolhido):**
- profiles (usuário pode recriar)
- my_list, favorites (ações reversíveis)
- watch_history (pode ser recriado)

**Justificativa:** Simplicidade no MVP. Auditoria via admin_logs.

### **Limites/Constraints:**

- **Máx 5 perfis por usuário:**  
  ```sql
  CONSTRAINT max_profiles_per_user CHECK (
    (SELECT COUNT(*) FROM profiles WHERE user_id = profiles.user_id) <= 5
  )
  ```

- **Unicidade:**  
  - `UNIQUE(profile_id, content_id)` em my_list, favorites
  - `UNIQUE(profile_id, content_id, episode_id)` em watch_history
  - `UNIQUE(content_id, season_number)` em seasons
  - `UNIQUE(season_id, episode_number)` em episodes

---

## 9️⃣ AUTENTICAÇÃO E AUTORIZAÇÃO

### **Provedor de Auth:**  
Supabase Auth (email/password). Confirmação de email DESABILITADA para MVP.

### **Claims no JWT:**

```typescript
{
  sub: uuid,           // auth.uid()
  email: string,
  is_admin: boolean,   // custom claim
  subscription_plan: string  // custom claim (opcional)
}
```

### **Roles e permissões:**

| Role | Permissão Geral |
|------|----------------|
| **anon** | SELECT em content, iptv_channels (públicos) |
| **authenticated** | CRUD próprios dados (users, profiles, listas, histórico) |
| **service_role** | Acesso total (bypass RLS) - BACKEND ONLY |
| **admin (flag)** | CRUD em content, iptv_channels, system_settings |

### **RLS Resumido por tabela:**

- **users:** SELECT/UPDATE próprio usuário (auth.uid() = id)
- **profiles:** CRUD próprios perfis (auth.uid() = user_id)
- **content:** SELECT público, INSERT/UPDATE/DELETE apenas admins
- **my_list, favorites, watch_history, reviews:** CRUD apenas próprio perfil
- **iptv_channels:** SELECT público
- **iptv_favorites:** CRUD apenas próprio perfil
- **notifications:** SELECT/UPDATE próprio usuário
- **admin_logs, analytics_events:** Acesso via service_role apenas
- **system_settings:** SELECT público, UPDATE apenas admins

---

## 🔟 SEGURANÇA E RLS AVANÇADO

### **Tabelas com RLS habilitado:**

- users ✅
- profiles ✅
- content ✅
- my_list ✅
- favorites ✅
- watch_history ✅
- reviews ✅
- iptv_favorites ✅
- notifications ✅

### **Políticas administrativas:**

```sql
-- Admins podem modificar content
CREATE POLICY "Only admins can modify content" ON content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );

-- Admins podem modificar system_settings
CREATE POLICY "Only admins can modify settings" ON system_settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );
```

### **Funções helper SECURITY DEFINER:**

Nenhuma no MVP. Futuro: `get_user_profile_ids(user_uuid)` para auxiliar RLS complexas.

### **Índices para performance de RLS:**

- `profiles.user_id` → JOIN constante em políticas
- `my_list.profile_id`, `favorites.profile_id`, `watch_history.profile_id`
- `users.is_admin` → verificação admin
- `content.is_featured`, `content.is_trending` → queries frequentes

---

## 1️⃣1️⃣ ARMAZENAMENTO (SUPABASE STORAGE)

### **Usará Storage?**  
SIM

### **Buckets necessários:**

1. **avatars** (PUBLIC)
   - Path: `avatars/{user_id}/{timestamp}_{filename}`
   - Política leitura: Público
   - Política escrita: Owner apenas (auth.uid() = user_id no path)
   - Tamanho max: 5MB
   - Formatos: JPG, PNG, WEBP

2. **channel-logos** (PUBLIC)
   - Path: `channel-logos/{channel_id}/{filename}`
   - Política leitura: Público
   - Política escrita: Admins apenas
   - Tamanho max: 2MB
   - Formatos: JPG, PNG, WEBP, SVG

### **Naming convention:**  
`{bucket}/{resource_id}/{timestamp}_{original_filename}`

Exemplo: `avatars/550e8400-e29b-41d4-a716-446655440000/1700000000_profile.jpg`

---

## 1️⃣2️⃣ REALTIME / NOTIFICAÇÕES

### **Precisa de Realtime?**  
NÃO no MVP. Futuro: notificações push em tempo real.

### **Se habilitado no futuro:**

- **Tópico:** `notifications:{user_id}`
- **Evento:** INSERT em `notifications` → broadcast para usuário
- **Payload:** `{ id, title, message, type, action_url }`

---

## 1️⃣3️⃣ INTEGRAÇÕES EXTERNAS E EDGE FUNCTIONS

### **APIs externas:**

1. **TMDB API**
   - URL: `https://api.themoviedb.org/3/*`
   - Chave: `TMDB_API_KEY` (já configurada)
   - Uso: Sincronização de catálogo

2. **APIs de Futebol (12 APIs)**
   - Uso: Página SoccerPage
   - Nomes: TheSportsDB, Sportmonks, etc

### **Edge Functions:**

1. **`sync-tmdb-content`**
   - Propósito: Sincronizar catálogo TMDB → content (batch insert/update)
   - Trigger: Cron diário OU manual via admin dashboard
   - Segurança: service_role key

2. **`github-sync`** (já existe)
   - Propósito: Sincronizar dados GitHub → KV Store
   - Trigger: Manual via GitHubSyncPanel

### **Segredos a armazenar:**

- `SUPABASE_SERVICE_ROLE_KEY` (backend only)
- `TMDB_API_KEY` (já existe)
- Futuros: `STRIPE_SECRET_KEY`, `SENDGRID_API_KEY`

---

## 1️⃣4️⃣ ÍNDICES DE PERFORMANCE

### **Principais consultas:**

1. Trending content (view com watch_count últimos 7 dias)
2. Continue watching (WHERE progress_percentage > 5 AND < 95, ORDER BY updated_at DESC)
3. Full-text search (to_tsvector('portuguese', title))
4. Filmes por gênero (genres @> '[{"id":28}]')
5. Canais IPTV por categoria (WHERE category='sports' AND is_active=true ORDER BY sort_order)
6. Minha Lista ordenada (ORDER BY added_at DESC)
7. Verificar se está na lista (EXISTS SELECT 1...)
8. Perfis do usuário (WHERE user_id=X ORDER BY last_used DESC)
9. Conteúdo em destaque (WHERE is_featured=true ORDER BY popularity DESC)
10. Analytics recentes (WHERE user_id=X ORDER BY created_at DESC LIMIT 100)

### **Colunas frequentemente filtradas/ordenadas:**

- `content`: media_type, is_featured, is_trending, genres, title (GIN tsvector)
- `watch_history`: profile_id, completed, updated_at (DESC)
- `my_list, favorites`: profile_id, added_at (DESC)
- `iptv_channels`: category, is_active, sort_order
- `profiles`: user_id, last_used
- `users`: is_admin, subscription_status

### **Índices recomendados (já criados):**

Ver seção de cada tabela. Todos os índices principais já estão no schema SQL.

### **Tabelas de alta escrita:**

1. **watch_history** (upsert a cada 30s durante reprodução)  
   - Otimização: Debounce no frontend, batch writes

2. **analytics_events** (100-500 eventos/dia por usuário)  
   - Otimização: Buffer de 10 eventos, fire-and-forget, retenção 90 dias

---

## 1️⃣5️⃣ MIGRAÇÕES, SEEDS E DEPLOY

### **Arquivos de migração que já existem:**

```
/supabase/migrations/001_create_redflix_schema.sql (schema completo)
/supabase/migrations/002_create_kv_store.sql (KV store)
```

### **Seed data necessário:**

1. **system_settings** - JÁ INCLUÍDO em 001_create_redflix_schema.sql (6 configurações)

2. **iptv_channels** - PARCIAL em 001_create_redflix_schema.sql (6 canais exemplo)  
   **PENDENTE:** CSV completo de 80 canais (extrair de `/public/data/canais.json`)

3. **content** - Sincronizar via Edge Function `sync-tmdb-content` (100-500 filmes/séries populares)

### **Estratégia de deploy:**

- **Manual** no MVP
- **Futuro:** GitHub Actions (test migrations → apply to staging → manual approval → prod)
- **Rollback:** DOWN migrations ou restore de backup point-in-time

### **Fluxo:**

1. Testar localmente (`supabase db reset`)
2. Push para staging (`supabase db push`)
3. Smoke tests manuais
4. Backup prod
5. Push para prod
6. Monitorar logs por 1h

---

## 1️⃣6️⃣ OBSERVABILIDADE E MANUTENÇÃO

### **Logs/monitoramento:**

- Erros de queries (Supabase Dashboard → Logs)
- Latência p50/p95/p99 (Supabase Performance)
- Edge Functions logs (execuções, timeouts)
- Alert se p95 > 500ms ou taxa erro > 1%

### **Backups e retenção:**

- **Backups automáticos:** Diários (Supabase)
- **Point-in-time recovery:** Últimos 7 dias (plano Pro)
- **Retenção por tabela:**
  - `analytics_events`: 90 dias (MVP) / 1 ano (Prod)
  - `admin_logs`: Indefinido
  - `watch_history`: Indefinido
  - `notifications`: 30 dias (limpar lidas antigas)

### **Acesso ao projeto:**

- Owner: [SEU_EMAIL] (acesso total)
- Desenvolvedores: [LISTA_EMAILS] (read/write, sem billing)
- 2FA habilitado para owner

---

## 1️⃣7️⃣ TESTES E VALIDAÇÃO

### **Casos de teste essenciais:**

1. **Criar usuário e perfis:**
   - Criar user via Supabase Auth
   - Criar 5 perfis → OK
   - Tentar criar 6º → ERRO constraint
   - Deletar perfil → CASCADE em listas

2. **Salvar progresso:**
   - Salvar 50% → OK
   - UPSERT 75% → Atualiza registro
   - Verificar progress_percentage calculado
   - Atingir 95% → completed=true

3. **Adicionar à Minha Lista:**
   - Adicionar filme X → OK
   - Adicionar novamente → ERRO unique
   - Deletar perfil → CASCADE deleta entrada

4. **Busca full-text:**
   - Buscar "vingadores" → Retorna resultados
   - Performance < 200ms

5. **Upload avatar:**
   - Upload como owner → OK
   - Upload como outro user → ERRO RLS
   - URL pública acessível

### **Consultas de verificação de integridade:**

```sql
-- 1. Verificar constraint 5 perfis
SELECT user_id, COUNT(*) FROM profiles GROUP BY user_id HAVING COUNT(*) > 5;
-- Deve retornar 0 linhas

-- 2. Verificar progress_percentage
SELECT * FROM watch_history WHERE progress_percentage > 100 OR progress_percentage < 0;
-- Deve retornar 0 linhas

-- 3. Verificar completed
SELECT * FROM watch_history WHERE progress_percentage >= 90 AND completed = false;
-- Deve retornar 0 linhas

-- 4. Verificar órfãos em my_list
SELECT ml.* FROM my_list ml LEFT JOIN profiles p ON ml.profile_id = p.id WHERE p.id IS NULL;
-- Deve retornar 0 linhas

-- 5. Verificar conteúdo sem título
SELECT * FROM content WHERE title IS NULL OR title = '';
-- Deve retornar 0 linhas
```

---

## 1️⃣8️⃣ COMPLIANCE / LEGAL

### **Requisitos legais:**  
LGPD (Lei Geral de Proteção de Dados - Brasil)

### **Dados sensíveis:**

- Email, nome, telefone (PII)
- Histórico de visualização (comportamento)
- PIN de perfil (criptografado)

### **Direitos LGPD:**

- ✅ Acesso (usuário vê seus dados)
- ✅ Correção (usuário edita)
- ✅ Exclusão (deletar conta → CASCADE)
- ✅ Consentimento (termo no cadastro)
- ☐ Portabilidade (exportar JSON) - Futuro

### **Políticas de retenção:**

- `analytics_events`: 90 dias MVP / 1 ano Prod
- `admin_logs`: Indefinido (compliance)
- `notifications`: 30 dias (limpar lidas)
- Outros: Indefinido até usuário deletar conta

---

## 1️⃣9️⃣ ENTREGÁVEIS

### **Artefatos esperados:**

1. ✅ DDL SQL completo (`/supabase/migrations/*.sql`)
2. ✅ Políticas RLS (incluídas no DDL)
3. ✅ Índices (incluídos no DDL)
4. ✅ Triggers e funções (incluídos no DDL)
5. ✅ Seed data SQL
6. ☐ Diagrama ER (PNG/PDF) - GERAR
7. ☐ Edge Functions TS (`sync-tmdb-content.ts`) - CRIAR
8. ✅ Plano de deploy (documentado)
9. ✅ Checklist de segurança (RLS, secrets, validações)

### **Prioridade de entrega:**

1. **P0 (Crítico):** Schema base + RLS (users, profiles, content, watch_history)
2. **P1 (Alta):** Listas (my_list, favorites) + IPTV
3. **P2 (Média):** Notificações + Analytics + Admin logs
4. **P3 (Baixa):** Storage policies + Realtime (futuro)

---

## 2️⃣0️⃣ PRAZOS, PRIORIDADES E RECURSOS

### **Prazo desejado:**

- **MVP:** 2-3 semanas (schema + RLS + seed)
- **Produção:** 1-2 meses (MVP + testes + otimizações)

### **Equipe disponível:**

- 1-2 desenvolvedores
- Conhecimento: PostgreSQL (intermediário), Supabase (intermediário), React/TS (avançado)

### **Conta Supabase atual:**

- Plano: Free (MVP) → Pro $25/mês (quando crescer)
- Projeto: 1 projeto (dev/prod no mesmo)

---

## 2️⃣1️⃣ OBSERVAÇÕES FINAIS / PENDÊNCIAS

### **Questões abertas:**

1. **CSV de 80 canais IPTV:**  
   Extrair de `/public/data/canais.json` e gerar INSERT SQL

2. **Diagrama ER:**  
   Gerar com dbdiagram.io ou Supabase Table Editor

3. **Edge Function `sync-tmdb-content`:**  
   Implementar sincronização TMDB → content

### **Permissões destrutivas:**

⚠️ **CONFIRMAÇÃO OBRIGATÓRIA:** Nenhuma operação destrutiva (DROP TABLE, TRUNCATE, DELETE sem WHERE) será executada sem confirmação explícita.

**Autorizado para remoção:** NENHUM objeto no momento.

---

## 📎 ANEXOS (ARQUIVOS FORNECIDOS)

1. `/supabase/migrations/001_create_redflix_schema.sql` (647 linhas)
2. `/supabase/migrations/002_create_kv_store.sql` (82 linhas)
3. `/utils/supabase/database.ts` (693 linhas - funções CRUD)
4. `/public/data/canais.json` (dados de 80 canais) - VER ARQUIVO
5. `/README.md` (documentação geral)

---

## ✅ CONFIRMAÇÃO FINAL

**Revisei todos os campos deste formulário.**  
**Todas as informações fornecidas estão corretas e completas.**  
**Autorizo o início da modelagem e geração de artefatos.**

---

# **PRONTO**

---

**Assinatura:** RedFlix Team  
**Data:** 19 de Novembro de 2024  
**Versão do Formulário:** 1.0 Final

---

**Próximos Passos:**  
Com base neste formulário completo, a equipe de backend pode agora:
1. Gerar DDL SQL adicional (se necessário)
2. Criar políticas RLS detalhadas
3. Implementar Edge Functions
4. Gerar diagrama ER
5. Criar scripts de seed completos
6. Preparar plano de deploy
