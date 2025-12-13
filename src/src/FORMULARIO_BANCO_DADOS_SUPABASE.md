# 📋 FORMULÁRIO COMPLETO - BANCO DE DADOS SUPABASE/POSTGRES - REDFLIX

**Data de criação:** Novembro 2024  
**Versão:** 1.0  
**Objetivo:** Coletar todas as informações necessárias para projetar e implementar do zero o banco de dados do RedFlix em Supabase/Postgres

---

## ✅ INSTRUÇÕES DE PREENCHIMENTO

1. **Preencha TODOS os campos** marcados com `[ ]`
2. **Seja CONCISO** quando solicitado
3. **ForneçaquEXEMPLOS** concretos quando solicitado
4. **Anexe ARQUIVOS** específicos quando solicitado
5. **Quando terminar, responda:** `PRONTO` no final do formulário

---

# 📌 PARTE 1: INFORMAÇÕES GERAIS DO PRODUTO

## 1.1 Identificação do Produto

**Nome do produto/site:**  
[ ] RedFlix

**Descrição curta e objetivo principal (máx. 3 linhas):**  
[ ] Plataforma completa de streaming estilo Netflix com integração TMDB (filmes/séries), sistema IPTV com 80+ canais ao vivo, autenticação de usuários, múltiplos perfis, dashboard administrativo e sistema de listas personalizadas.

**Público-alvo principal:**  
[ ] Usuários brasileiros que desejam assistir filmes, séries e TV ao vivo em uma plataforma unificada

**URL do site (se existir):**  
[ ] Em desenvolvimento / Local

---

## 1.2 Estimativas de Tráfego e Performance

**Usuários diários estimados (usuários únicos/dia):**  
[ ] MVP: 100-500 | Crescimento: 1000-5000 | Produção: 10.000+

**Leituras por segundo (pico estimado):**  
[ ] MVP: 10-50 rps | Crescimento: 100-500 rps | Produção: 500-2000 rps

**Escritas por segundo (pico estimado):**  
[ ] MVP: 5-20 wps | Crescimento: 50-200 wps | Produção: 200-500 wps

**Requisitos de latência/SLA:**  
[ ] Consultas de leitura: < 200ms (p95)  
[ ] Consultas de escrita: < 500ms (p95)  
[ ] Uptime desejado: 99.5% (MVP) | 99.9% (Produção)

---

## 1.3 Ambientes

**Separação de ambientes Supabase desejada:**  
[ ] ☑ Projeto único (dev/staging/prod no mesmo banco)  
[ ] ☐ Projetos separados (3 projetos Supabase distintos)

**Justificativa da escolha:**  
[ ] MVP com orçamento limitado, usar RLS e schemas para separação lógica

**Política de migrations entre ambientes:**  
[ ] Testar em dev → Aplicar em staging → Deploy em prod com approval manual

---

# 📌 PARTE 2: CÓDIGO E ARTEFATOS DO PROJETO

## 2.1 Arquivos Essenciais para Análise

**Por favor, CONFIRME que fornecerá os seguintes arquivos do seu repositório:**

### Backend/API:
- [ ] ☑ `/supabase/migrations/001_create_redflix_schema.sql` (JÁ FORNECIDO)
- [ ] ☑ `/supabase/functions/server/index.tsx` (servidor Hono)
- [ ] ☑ `/supabase/functions/server/kv_store.tsx` (helper KV)

### Modelos de Dados:
- [ ] ☑ `/utils/supabase/database.ts` (JÁ FORNECIDO - funções de BD)
- [ ] ☑ `/utils/tmdb.ts` (tipos do TMDB)
- [ ] ☐ Diagrama ER (se existir) - **PENDENTE**

### Routes/Controllers:
- [ ] ☑ `/App.tsx` (rotas principais)
- [ ] ☑ `/components/*Page.tsx` (páginas e lógica)

### Documentação:
- [ ] ☑ `/README.md` (JÁ FORNECIDO)
- [ ] ☑ Múltiplos arquivos `.md` de documentação (JÁ FORNECIDO)

---

## 2.2 Endpoints e Rotas Críticas

**Liste os 10 endpoints/rotas MAIS CRÍTICOS do sistema:**

1. **GET /api/content?genre=X&type=movie**  
   - Payload: `{ genre_id: number, media_type: 'movie'|'tv', limit: number }`  
   - Resposta: `Array<Content>`  
   - Criticidade: ALTA (página inicial e categorias)

2. **GET /api/profiles/:userId**  
   - Payload: `{ user_id: uuid }`  
   - Resposta: `Array<Profile>` (máx 5)  
   - Criticidade: ALTA (seleção de perfil obrigatória)

3. **POST /api/my-list**  
   - Payload: `{ profile_id: uuid, content_id: bigint }`  
   - Resposta: `{ success: boolean, id: uuid }`  
   - Criticidade: MÉDIA (feature principal)

4. **GET /api/continue-watching/:profileId**  
   - Payload: `{ profile_id: uuid }`  
   - Resposta: `Array<WatchHistory>` (ordenado por updated_at DESC)  
   - Criticidade: ALTA (UX principal)

5. **PUT /api/watch-progress**  
   - Payload: `{ profile_id, content_id, episode_id?, current_time, total_time }`  
   - Resposta: `{ progress_percentage: decimal }`  
   - Criticidade: ALTA (salvar progresso em tempo real)

6. **GET /api/iptv-channels?category=sports**  
   - Payload: `{ category?: string }`  
   - Resposta: `Array<IPTVChannel>` (ordenado por sort_order)  
   - Criticidade: MÉDIA (página IPTV)

7. **GET /api/trending**  
   - Payload: `{ limit: number }`  
   - Resposta: `Array<Content>` (view com watch_count e avg_rating)  
   - Criticidade: ALTA (página Bombando)

8. **POST /api/analytics/track**  
   - Payload: `{ event_type, event_category, metadata, user_id?, profile_id?, content_id? }`  
   - Resposta: `{ success: boolean }`  
   - Criticidade: BAIXA (não bloqueia UX, fire-and-forget)

9. **GET /api/search?q=vingadores**  
   - Payload: `{ q: string, limit: number }`  
   - Resposta: `Array<Content>` (full-text search)  
   - Criticidade: ALTA (busca principal)

10. **GET /api/admin/stats**  
    - Payload: `{ admin_id: uuid }`  
    - Resposta: `{ total_users, active_users, total_views, revenue }`  
    - Criticidade: MÉDIA (dashboard admin)

---

## 2.3 Exemplos de Requisições/Respostas

**Exemplo 1: Adicionar à Minha Lista**

```json
// REQUEST POST /api/my-list
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "content_id": 299536
}

// RESPONSE 201 Created
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "content_id": 299536,
  "added_at": "2024-11-19T10:30:00Z"
}
```

**Exemplo 2: Atualizar Progresso**

```json
// REQUEST PUT /api/watch-progress
{
  "profile_id": "550e8400-e29b-41d4-a716-446655440000",
  "content_id": 299536,
  "episode_id": null,
  "current_time": 3600,
  "total_time": 7200
}

// RESPONSE 200 OK
{
  "id": "770e8400-e29b-41d4-a716-446655440002",
  "progress_percentage": 50.00,
  "completed": false,
  "updated_at": "2024-11-19T10:31:15Z"
}
```

---

# 📌 PARTE 3: ENTIDADES E MODELAGEM DE DADOS

## 3.1 Lista Completa de Entidades

**CONFIRME as entidades já identificadas no schema atual:**

1. [ ] ☑ `users` - Usuários da plataforma
2. [ ] ☑ `profiles` - Perfis individuais (máx 5 por usuário)
3. [ ] ☑ `content` - Catálogo de filmes e séries (TMDB)
4. [ ] ☑ `seasons` - Temporadas de séries
5. [ ] ☑ `episodes` - Episódios individuais
6. [ ] ☑ `my_list` - Minha Lista por perfil
7. [ ] ☑ `favorites` - Favoritos por perfil
8. [ ] ☑ `watch_history` - Continuar assistindo + progresso
9. [ ] ☑ `reviews` - Avaliações e ratings
10. [ ] ☑ `iptv_channels` - Canais de TV ao vivo
11. [ ] ☑ `iptv_favorites` - Canais favoritos por perfil
12. [ ] ☑ `notifications` - Sistema de notificações
13. [ ] ☑ `admin_logs` - Logs de ações administrativas
14. [ ] ☑ `analytics_events` - Eventos de analytics
15. [ ] ☑ `system_settings` - Configurações do sistema

**Há NOVAS entidades que precisam ser adicionadas?**  
[ ] ☐ Sim (liste abaixo)  
[ ] ☑ Não

**Se SIM, liste as novas entidades:**  
[ ] N/A

---

## 3.2 Detalhamento de Entidades Principais

### ENTIDADE 1: `users`

**Nome da tabela:**  
[ ] `public.users`

**Descrição:**  
[ ] Tabela principal de usuários, extende auth.users do Supabase com dados adicionais de assinatura e preferências

**Campos (tipo | null? | default | descrição):**

```
id                    | UUID      | NOT NULL | PK, FK para auth.users(id) ON DELETE CASCADE
email                 | TEXT      | NOT NULL | UNIQUE, email do usuário
full_name             | TEXT      | NULL     | Nome completo
avatar_url            | TEXT      | NULL     | URL do avatar
phone                 | TEXT      | NULL     | Telefone
birth_date            | DATE      | NULL     | Data de nascimento
country               | TEXT      | NULL     | DEFAULT 'BR', país
language              | TEXT      | NULL     | DEFAULT 'pt-BR', idioma preferido

subscription_plan     | TEXT      | NOT NULL | DEFAULT 'free', CHECK IN ('free','basic','standard','premium')
subscription_status   | TEXT      | NOT NULL | DEFAULT 'inactive', CHECK IN ('active','inactive','canceled','trial')
subscription_start    | TIMESTAMPTZ | NULL   | Data de início da assinatura
subscription_end      | TIMESTAMPTZ | NULL   | Data de fim da assinatura

adult_content         | BOOLEAN   | NOT NULL | DEFAULT false, permite conteúdo adulto
autoplay_next_episode | BOOLEAN   | NOT NULL | DEFAULT true
autoplay_previews     | BOOLEAN   | NOT NULL | DEFAULT true
subtitle_language     | TEXT      | NULL     | DEFAULT 'pt', idioma de legendas
audio_language        | TEXT      | NULL     | DEFAULT 'pt', idioma de áudio
video_quality         | TEXT      | NULL     | DEFAULT 'auto', CHECK IN ('auto','480p','720p','1080p','4k')

created_at            | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at            | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
last_login            | TIMESTAMPTZ | NULL     | Último login
is_admin              | BOOLEAN   | NOT NULL | DEFAULT false, flag de administrador
is_active             | BOOLEAN   | NOT NULL | DEFAULT true, conta ativa
```

**Chave Primária:**  
[ ] `id` (UUID, referencia auth.users)

**Chaves Estrangeiras:**  
[ ] `id` → `auth.users(id)` ON DELETE CASCADE

**Relações:**  
[ ] 1:N com `profiles` (1 user → N profiles, máx 5)  
[ ] 1:N com `notifications`  
[ ] 1:N com `admin_logs` (se is_admin=true)

**Índices:**  
[ ] `idx_users_email` ON email  
[ ] `idx_users_subscription_status` ON subscription_status  
[ ] `idx_users_is_admin` ON is_admin

**Exemplos de 3-5 registros:**

```sql
-- Usuário Admin
INSERT INTO users VALUES (
  '550e8400-e29b-41d4-a716-446655440000',
  'admin@redflix.com',
  'Administrador RedFlix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
  NULL,
  '1990-01-01',
  'BR',
  'pt-BR',
  'premium',
  'active',
  '2024-01-01 00:00:00+00',
  NULL,
  true,
  true,
  true,
  'pt',
  'pt',
  '1080p',
  '2024-01-01 00:00:00+00',
  '2024-11-19 10:00:00+00',
  '2024-11-19 09:00:00+00',
  true,
  true
);

-- Usuário Premium
INSERT INTO users VALUES (
  '660e8400-e29b-41d4-a716-446655440001',
  'joao@email.com',
  'João Silva',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
  '+5511999998888',
  '1995-05-15',
  'BR',
  'pt-BR',
  'premium',
  'active',
  '2024-06-01 00:00:00+00',
  '2025-06-01 00:00:00+00',
  false,
  true,
  true,
  'pt',
  'pt',
  'auto',
  '2024-06-01 10:30:00+00',
  '2024-11-19 08:15:00+00',
  '2024-11-19 08:00:00+00',
  false,
  true
);

-- Usuário Free
INSERT INTO users VALUES (
  '770e8400-e29b-41d4-a716-446655440002',
  'maria@email.com',
  'Maria Oliveira',
  NULL,
  NULL,
  '2000-12-20',
  'BR',
  'pt-BR',
  'free',
  'inactive',
  NULL,
  NULL,
  false,
  true,
  false,
  'pt',
  'pt',
  '720p',
  '2024-11-01 14:20:00+00',
  '2024-11-18 20:45:00+00',
  '2024-11-18 20:30:00+00',
  false,
  true
);
```

---

### ENTIDADE 2: `profiles`

**Nome da tabela:**  
[ ] `public.profiles`

**Descrição:**  
[ ] Perfis individuais por usuário (máximo 5). Cada perfil tem suas próprias listas, histórico e preferências.

**Campos:**

```
id            | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
user_id       | UUID        | NOT NULL | FK para users(id) ON DELETE CASCADE
name          | TEXT        | NOT NULL | Nome do perfil (ex: "João", "Kids", "Filmes de Ação")
avatar_url    | TEXT        | NULL     | DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'
is_kids       | BOOLEAN     | NOT NULL | DEFAULT false, perfil infantil
pin_code      | TEXT        | NULL     | PIN criptografado para proteger perfil
language      | TEXT        | NULL     | DEFAULT 'pt-BR'
age_rating    | TEXT        | NULL     | DEFAULT 'all', CHECK IN ('all','10','12','14','16','18')

autoplay      | BOOLEAN     | NOT NULL | DEFAULT true
notifications | BOOLEAN     | NOT NULL | DEFAULT true

created_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
last_used     | TIMESTAMPTZ | NULL     | Última vez que o perfil foi usado
```

**Constraint especial:**  
[ ] CONSTRAINT max_profiles_per_user CHECK ((SELECT COUNT(*) FROM profiles WHERE user_id = profiles.user_id) <= 5)

**Chave Primária:**  
[ ] `id`

**Chaves Estrangeiras:**  
[ ] `user_id` → `users(id)` ON DELETE CASCADE

**Relações:**  
[ ] N:1 com `users`  
[ ] 1:N com `my_list`  
[ ] 1:N com `favorites`  
[ ] 1:N com `watch_history`  
[ ] 1:N com `reviews`  
[ ] 1:N com `iptv_favorites`

**Índices:**  
[ ] `idx_profiles_user_id` ON user_id  
[ ] `idx_profiles_is_kids` ON is_kids

**Exemplos de registros:**

```sql
-- Perfil principal do João
INSERT INTO profiles VALUES (
  '880e8400-e29b-41d4-a716-446655440000',
  '660e8400-e29b-41d4-a716-446655440001',
  'João',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=joao',
  false,
  NULL,
  'pt-BR',
  '18',
  true,
  true,
  '2024-06-01 10:30:00+00',
  '2024-11-19 08:15:00+00',
  '2024-11-19 08:00:00+00'
);

-- Perfil Kids do João
INSERT INTO profiles VALUES (
  '990e8400-e29b-41d4-a716-446655440001',
  '660e8400-e29b-41d4-a716-446655440001',
  'Pedro (Kids)',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
  true,
  'hash_do_pin_1234',
  'pt-BR',
  '10',
  true,
  false,
  '2024-06-01 11:00:00+00',
  '2024-11-18 15:20:00+00',
  '2024-11-18 15:00:00+00'
);

-- Perfil adulto da Maria
INSERT INTO profiles VALUES (
  'aa0e8400-e29b-41d4-a716-446655440002',
  '770e8400-e29b-41d4-a716-446655440002',
  'Maria',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=maria',
  false,
  NULL,
  'pt-BR',
  'all',
  false,
  true,
  '2024-11-01 14:20:00+00',
  '2024-11-18 20:45:00+00',
  '2024-11-18 20:30:00+00'
);
```

---

### ENTIDADE 3: `content`

**Nome da tabela:**  
[ ] `public.content`

**Descrição:**  
[ ] Catálogo completo de filmes e séries. Sincronizado com TMDB API. É a entidade central do conteúdo.

**Campos:**

```
id                    | BIGINT      | NOT NULL | PK, ID do TMDB
tmdb_id               | BIGINT      | NOT NULL | UNIQUE, ID original do TMDB
imdb_id               | TEXT        | NULL     | ID do IMDB (formato: tt1234567)
media_type            | TEXT        | NOT NULL | CHECK IN ('movie', 'tv')

title                 | TEXT        | NOT NULL | Título em português
original_title        | TEXT        | NULL     | Título original
overview              | TEXT        | NULL     | Sinopse
tagline               | TEXT        | NULL     | Tagline promocional

poster_path           | TEXT        | NULL     | /path/to/poster.jpg (relativo TMDB)
backdrop_path         | TEXT        | NULL     | /path/to/backdrop.jpg
logo_path             | TEXT        | NULL     | Logo PNG transparente
trailer_key           | TEXT        | NULL     | Chave do vídeo do YouTube

release_date          | DATE        | NULL     | Data de lançamento
runtime               | INTEGER     | NULL     | Duração em minutos
status                | TEXT        | NULL     | Ex: 'Released', 'In Production'

vote_average          | DECIMAL(3,1)| NULL     | Nota média (0.0 - 10.0)
vote_count            | INTEGER     | NULL     | Total de votos
popularity            | DECIMAL(10,3)| NULL    | Score de popularidade TMDB

genres                | JSONB       | NOT NULL | DEFAULT '[]'::jsonb, [{"id":28,"name":"Ação"}]
production_countries  | JSONB       | NOT NULL | DEFAULT '[]'::jsonb
spoken_languages      | JSONB       | NOT NULL | DEFAULT '[]'::jsonb
keywords              | JSONB       | NOT NULL | DEFAULT '[]'::jsonb

number_of_seasons     | INTEGER     | NULL     | Apenas para séries
number_of_episodes    | INTEGER     | NULL     | Apenas para séries
episode_run_time      | JSONB       | NOT NULL | DEFAULT '[]'::jsonb, [45, 50] minutos

stream_url            | TEXT        | NULL     | URL do stream (MP4, M3U8, etc)
has_stream            | BOOLEAN     | NOT NULL | DEFAULT false
stream_quality        | TEXT        | NULL     | '720p', '1080p', '4k'

age_rating            | TEXT        | NULL     | DEFAULT 'L', CHECK IN ('L','10','12','14','16','18')

is_featured           | BOOLEAN     | NOT NULL | DEFAULT false, destaque no hero
is_trending           | BOOLEAN     | NOT NULL | DEFAULT false, em alta
is_new                | BOOLEAN     | NOT NULL | DEFAULT false, novidade
is_original           | BOOLEAN     | NOT NULL | DEFAULT false, RedFlix Original

created_at            | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at            | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
last_synced           | TIMESTAMPTZ | NOT NULL | DEFAULT NOW(), última sync com TMDB
```

**Chave Primária:**  
[ ] `id` (BIGINT = TMDB ID)

**Chaves Estrangeiras:**  
[ ] Nenhuma (tabela principal)

**Relações:**  
[ ] 1:N com `seasons` (se media_type='tv')  
[ ] 1:N com `my_list`  
[ ] 1:N com `favorites`  
[ ] 1:N com `watch_history`  
[ ] 1:N com `reviews`

**Índices:**  
[ ] `idx_content_tmdb_id` ON tmdb_id (UNIQUE)  
[ ] `idx_content_media_type` ON media_type  
[ ] `idx_content_is_featured` ON is_featured  
[ ] `idx_content_is_trending` ON is_trending  
[ ] `idx_content_genres` ON genres USING GIN  
[ ] `idx_content_title_search` ON to_tsvector('portuguese', title) USING GIN

**Cardinalidade estimada:**  
[ ] MVP: 1.000-5.000 registros  
[ ] Crescimento: 10.000-50.000 registros  
[ ] Produção: 50.000-200.000 registros

**Taxa de crescimento:**  
[ ] +100-500 filmes/séries por semana (sync TMDB automatizada)

**Exemplos de registros:**

```sql
-- Filme: Vingadores Ultimato
INSERT INTO content VALUES (
  299536,
  299536,
  'tt4154796',
  'movie',
  'Vingadores: Ultimato',
  'Avengers: Endgame',
  'Após Thanos eliminar metade das criaturas vivas, os Vingadores restantes...',
  'Vingue os caídos.',
  '/q6725aR8wg0m4ESYB6npol4c0qT.jpg',
  '/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
  '/logo_vingadores.png',
  'TcMBFSGVi1C',
  '2019-04-24',
  181,
  'Released',
  8.3,
  24567,
  523.234,
  '[{"id":28,"name":"Ação"},{"id":12,"name":"Aventura"},{"id":878,"name":"Ficção científica"}]'::jsonb,
  '[{"iso_3166_1":"US","name":"United States of America"}]'::jsonb,
  '[{"iso_639_1":"en","name":"English"}]'::jsonb,
  '[{"id":9715,"name":"superhero"},{"id":9717,"name":"marvel"}]'::jsonb,
  NULL,
  NULL,
  '[]'::jsonb,
  'https://cdn.redflix.com/movies/vingadores-ultimato.mp4',
  true,
  '1080p',
  '12',
  true,
  true,
  false,
  false,
  '2024-01-01 00:00:00+00',
  '2024-11-19 00:00:00+00',
  '2024-11-19 02:00:00+00'
);

-- Série: Breaking Bad
INSERT INTO content VALUES (
  1396,
  1396,
  'tt0903747',
  'tv',
  'Breaking Bad',
  'Breaking Bad',
  'Um professor de química diagnosticado com câncer...',
  'Mude o jogo.',
  '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
  '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
  '/breaking_bad_logo.png',
  'HhesaQXLuRY',
  '2008-01-20',
  NULL,
  'Ended',
  9.5,
  12890,
  487.123,
  '[{"id":18,"name":"Drama"},{"id":80,"name":"Crime"}]'::jsonb,
  '[{"iso_3166_1":"US","name":"United States"}]'::jsonb,
  '[{"iso_639_1":"en","name":"English"}]'::jsonb,
  '[{"id":1234,"name":"drug dealer"},{"id":5678,"name":"chemistry"}]'::jsonb,
  5,
  62,
  '[45, 47, 48]'::jsonb,
  NULL,
  false,
  NULL,
  '16',
  true,
  true,
  false,
  false,
  '2024-01-15 00:00:00+00',
  '2024-11-19 01:00:00+00',
  '2024-11-19 03:00:00+00'
);

-- Filme Kids: Frozen
INSERT INTO content VALUES (
  109445,
  109445,
  'tt2294629',
  'movie',
  'Frozen - Uma Aventura Congelante',
  'Frozen',
  'Quando uma profecia condena o reino...',
  'Let it go.',
  '/kgwjIb0x2eHFZLSmTMQrpJmLxH8.jpg',
  '/8O3IMk0TZQSeT0Xw0vgT2dCHOsp.jpg',
  '/frozen_logo.png',
  'L0MK7BxCX7s',
  '2013-11-27',
  102,
  'Released',
  7.3,
  15234,
  412.567,
  '[{"id":16,"name":"Animação"},{"id":12,"name":"Aventura"},{"id":10751,"name":"Família"}]'::jsonb,
  '[{"iso_3166_1":"US","name":"United States"}]'::jsonb,
  '[{"iso_639_1":"en","name":"English"}]'::jsonb,
  '[{"id":9823,"name":"princess"},{"id":9824,"name":"ice"}]'::jsonb,
  NULL,
  NULL,
  '[]'::jsonb,
  'https://cdn.redflix.com/movies/frozen.mp4',
  true,
  '1080p',
  'L',
  false,
  false,
  false,
  false,
  '2024-02-01 00:00:00+00',
  '2024-11-18 00:00:00+00',
  '2024-11-18 04:00:00+00'
);
```

---

### ENTIDADE 4: `watch_history`

**Nome da tabela:**  
[ ] `public.watch_history`

**Descrição:**  
[ ] Histórico de visualização e progresso de reprodução por perfil. Usado para "Continuar Assistindo".

**Campos:**

```
id                  | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
profile_id          | UUID        | NOT NULL | FK para profiles(id) ON DELETE CASCADE
content_id          | BIGINT      | NOT NULL | FK para content(id) ON DELETE CASCADE
episode_id          | UUID        | NULL     | FK para episodes(id) ON DELETE SET NULL (NULL para filmes)

current_time        | INTEGER     | NOT NULL | DEFAULT 0, posição atual em segundos
total_time          | INTEGER     | NULL     | Duração total em segundos
progress_percentage | DECIMAL(5,2)| NOT NULL | DEFAULT 0, calculado automaticamente (0-100)
completed           | BOOLEAN     | NOT NULL | DEFAULT false, auto-true se progress >= 90%

watched_at          | TIMESTAMPTZ | NOT NULL | DEFAULT NOW(), primeira vez assistido
updated_at          | TIMESTAMPTZ | NOT NULL | DEFAULT NOW(), última atualização de progresso
```

**UNIQUE constraint:**  
[ ] UNIQUE(profile_id, content_id, episode_id)

**Chave Primária:**  
[ ] `id`

**Chaves Estrangeiras:**  
[ ] `profile_id` → `profiles(id)` ON DELETE CASCADE  
[ ] `content_id` → `content(id)` ON DELETE CASCADE  
[ ] `episode_id` → `episodes(id)` ON DELETE SET NULL

**Relações:**  
[ ] N:1 com `profiles`  
[ ] N:1 com `content`  
[ ] N:1 com `episodes` (opcional)

**Índices:**  
[ ] `idx_watch_history_profile_id` ON profile_id  
[ ] `idx_watch_history_content_id` ON content_id  
[ ] `idx_watch_history_updated_at` ON updated_at DESC  
[ ] `idx_watch_history_completed` ON completed

**Trigger automático:**  
[ ] BEFORE INSERT OR UPDATE: calcula progress_percentage e marca completed=true se >= 90%

**Cardinalidade estimada:**  
[ ] MVP: 500-2.000 registros  
[ ] Crescimento: 10.000-50.000 registros  
[ ] Produção: 100.000-1.000.000+ registros

**Taxa de crescimento:**  
[ ] +50-200 registros/dia por usuário ativo (alta escrita!)

**Exemplos:**

```sql
-- João assistindo Vingadores (50% completo)
INSERT INTO watch_history VALUES (
  'bb0e8400-e29b-41d4-a716-446655440000',
  '880e8400-e29b-41d4-a716-446655440000',
  299536,
  NULL,
  5430,
  10860,
  50.00,
  false,
  '2024-11-18 20:00:00+00',
  '2024-11-18 21:30:00+00'
);

-- João assistindo Breaking Bad S01E01 (95% completo - marcado como completed)
INSERT INTO watch_history VALUES (
  'cc0e8400-e29b-41d4-a716-446655440001',
  '880e8400-e29b-41d4-a716-446655440000',
  1396,
  'dd0e8400-e29b-41d4-a716-446655440000',
  2700,
  2820,
  95.74,
  true,
  '2024-11-17 19:00:00+00',
  '2024-11-17 19:47:00+00'
);

-- Pedro (Kids) assistindo Frozen (20% completo)
INSERT INTO watch_history VALUES (
  'ee0e8400-e29b-41d4-a716-446655440002',
  '990e8400-e29b-41d4-a716-446655440001',
  109445,
  NULL,
  1224,
  6120,
  20.00,
  false,
  '2024-11-18 15:00:00+00',
  '2024-11-18 15:20:00+00'
);
```

---

### ENTIDADE 5: `iptv_channels`

**Nome da tabela:**  
[ ] `public.iptv_channels`

**Descrição:**  
[ ] Catálogo de canais de TV ao vivo (IPTV). Usado na página IPTVPage com 80+ canais reais.

**Campos:**

```
id           | UUID        | NOT NULL | PK, DEFAULT uuid_generate_v4()
name         | TEXT        | NOT NULL | Nome do canal (ex: "Globo", "ESPN")
logo_url     | TEXT        | NULL     | URL do logo do canal
stream_url   | TEXT        | NOT NULL | URL M3U8/MP4 do stream
category     | TEXT        | NOT NULL | 'sports', 'news', 'movies', 'kids', 'general', 'music'

country      | TEXT        | NULL     | DEFAULT 'BR', código do país
language     | TEXT        | NULL     | DEFAULT 'pt', idioma
quality      | TEXT        | NULL     | DEFAULT '720p', '1080p', etc

is_active    | BOOLEAN     | NOT NULL | DEFAULT true, canal ativo
is_premium   | BOOLEAN     | NOT NULL | DEFAULT false, requer assinatura premium

sort_order   | INTEGER     | NOT NULL | DEFAULT 0, ordem de exibição

created_at   | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
updated_at   | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
```

**Chave Primária:**  
[ ] `id`

**Relações:**  
[ ] 1:N com `iptv_favorites`

**Índices:**  
[ ] `idx_iptv_channels_category` ON category  
[ ] `idx_iptv_channels_is_active` ON is_active  
[ ] `idx_iptv_channels_sort_order` ON sort_order

**Cardinalidade estimada:**  
[ ] MVP: 80-100 canais  
[ ] Crescimento: 100-300 canais  
[ ] Produção: 300-1000 canais

**Exemplos:**

```sql
-- Canal Globo (geral)
INSERT INTO iptv_channels VALUES (
  'ff0e8400-e29b-41d4-a716-446655440000',
  'Globo',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Globo_logo_2008.svg/200px-Globo_logo_2008.svg.png',
  'https://live.cdn.globo.com/stream.m3u8',
  'general',
  'BR',
  'pt',
  '1080p',
  true,
  false,
  1,
  '2024-01-01 00:00:00+00',
  '2024-11-19 00:00:00+00'
);

-- Canal ESPN (esportes)
INSERT INTO iptv_channels VALUES (
  'gg0e8400-e29b-41d4-a716-446655440001',
  'ESPN',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png',
  'https://live.espn.com/stream.m3u8',
  'sports',
  'BR',
  'pt',
  '720p',
  true,
  true,
  10,
  '2024-01-01 00:00:00+00',
  '2024-11-19 00:00:00+00'
);

-- Canal Cartoon Network (kids)
INSERT INTO iptv_channels VALUES (
  'hh0e8400-e29b-41d4-a716-446655440002',
  'Cartoon Network',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Cartoon_Network_2010_logo.svg/200px-Cartoon_Network_2010_logo.svg.png',
  'https://live.cartoonnetwork.com/stream.m3u8',
  'kids',
  'BR',
  'pt',
  '720p',
  true,
  false,
  50,
  '2024-01-01 00:00:00+00',
  '2024-11-19 00:00:00+00'
);
```

---

### ENTIDADE 6: `my_list` e `favorites`

**Tabelas similares, estrutura idêntica:**

```
-- my_list (Minha Lista)
id          | UUID        | NOT NULL | PK
profile_id  | UUID        | NOT NULL | FK profiles(id) ON DELETE CASCADE
content_id  | BIGINT      | NOT NULL | FK content(id) ON DELETE CASCADE
added_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
UNIQUE(profile_id, content_id)

-- favorites (Favoritos / Curtidos)
id          | UUID        | NOT NULL | PK
profile_id  | UUID        | NOT NULL | FK profiles(id) ON DELETE CASCADE
content_id  | BIGINT      | NOT NULL | FK content(id) ON DELETE CASCADE
added_at    | TIMESTAMPTZ | NOT NULL | DEFAULT NOW()
UNIQUE(profile_id, content_id)
```

**Diferença conceitual:**  
[ ] `my_list` = "Minha Lista" (botão + no card)  
[ ] `favorites` = "Curtir" (botão ❤️ no card)

---

## 3.3 Tabelas de Junção (N:N)

**Tabelas N:N identificadas:**

1. [ ] ☑ `my_list` → profiles ↔ content
2. [ ] ☑ `favorites` → profiles ↔ content
3. [ ] ☑ `iptv_favorites` → profiles ↔ iptv_channels

**Confirmação:** Todas as N:N foram mapeadas?  
[ ] ☑ Sim  
[ ] ☐ Não

---

# 📌 PARTE 4: AUTENTICAÇÃO E AUTORIZAÇÃO

## 4.1 Provedor de Autenticação

**Provedor de auth utilizado:**  
[ ] ☑ Supabase Auth (nativo)  
[ ] ☐ OAuth (Google, Facebook, etc)  
[ ] ☐ SSO  
[ ] ☐ Custom JWT

**Se Supabase Auth, confirmar configuração:**  
[ ] ☑ Email/Password habilitado  
[ ] ☑ Confirmação de email: DESABILITADA (para MVP)  
[ ] ☐ OAuth providers: NENHUM (adicionar depois)

**Tabela auth.users (gerenciada pelo Supabase):**  
[ ] ☑ SIM, extendida por public.users via FK

---

## 4.2 Roles e Permissões

**Roles do Supabase identificadas:**

1. **anon** (público não autenticado)  
   [ ] ☑ Pode SELECT em `content` (catálogo público)  
   [ ] ☑ Pode SELECT em `iptv_channels` WHERE is_active=true AND is_premium=false  
   [ ] ☐ Nenhuma escrita permitida

2. **authenticated** (usuário logado)  
   [ ] ☑ Pode SELECT/INSERT/UPDATE/DELETE próprios dados (users, profiles, my_list, favorites, watch_history)  
   [ ] ☑ Pode SELECT em `content` (todo catálogo)  
   [ ] ☑ Pode SELECT em `iptv_channels` WHERE is_active=true  
   [ ] ☑ Pode INSERT em `analytics_events` (tracking)

3. **service_role** (backend/admin total)  
   [ ] ☑ Acesso completo a TODAS as tabelas  
   [ ] ☑ Bypass RLS  
   [ ] ⚠️ **NUNCA expor no frontend**

**Custom role "admin" via is_admin flag:**  
[ ] ☑ Verificar `users.is_admin = true` para operações admin  
[ ] ☑ Pode CRUD em `content`, `iptv_channels`, `system_settings`  
[ ] ☑ Pode SELECT em `admin_logs`, `analytics_events`

---

## 4.3 Claims Customizados no JWT

**Claims adicionais no JWT (se necessário):**  
[ ] ☐ `tenant_id` (não aplicável - single-tenant)  
[ ] ☐ `organization_id` (não aplicável)  
[ ] ☑ `is_admin` (pode ser útil, mas verificar sempre no DB)  
[ ] ☑ `subscription_plan` (pode ser útil para RLS)

**Fonte dos claims:**  
[ ] Hook do Supabase Auth para adicionar `is_admin` e `subscription_plan` ao JWT

---

# 📌 PARTE 5: MULTI-TENANCY E ISOLAMENTO

## 5.1 Modelo de Tenancy

**Tipo de sistema:**  
[ ] ☑ Single-tenant (todos os usuários compartilham mesmo catálogo)  
[ ] ☐ Multi-tenant por tenant_id  
[ ] ☐ Híbrido

**Justificativa:**  
[ ] RedFlix é uma plataforma única onde todos os usuários veem o mesmo catálogo de filmes/séries (como Netflix). Isolamento é feito por `user_id` e `profile_id`, não por tenant.

---

## 5.2 Isolamento de Dados

**Estratégia de isolamento:**  
[ ] ☑ Por `user_id` → cada usuário vê apenas seus próprios dados (users, profiles)  
[ ] ☑ Por `profile_id` → cada perfil tem suas próprias listas, favoritos, histórico  
[ ] ☑ Catálogo público → `content` e `iptv_channels` são compartilhados (público)

**Não aplicável:**  
[ ] ☐ tenant_id  
[ ] ☐ organization_id

---

# 📌 PARTE 6: REGRAS DE NEGÓCIO E VALIDAÇÕES

## 6.1 Validações de Campos

**Validações críticas por tabela:**

### users:
- [ ] `email` → UNIQUE, formato email válido
- [ ] `subscription_plan` → CHECK IN ('free', 'basic', 'standard', 'premium')
- [ ] `subscription_status` → CHECK IN ('active', 'inactive', 'canceled', 'trial')
- [ ] `video_quality` → CHECK IN ('auto', '480p', '720p', '1080p', '4k')

### profiles:
- [ ] `name` → NOT NULL, length 1-50
- [ ] `age_rating` → CHECK IN ('all', '10', '12', '14', '16', '18')
- [ ] MAX 5 profiles por user_id (constraint)

### content:
- [ ] `media_type` → CHECK IN ('movie', 'tv')
- [ ] `vote_average` → >= 0 AND <= 10
- [ ] `title` → NOT NULL, min length 1
- [ ] `age_rating` → CHECK IN ('L', '10', '12', '14', '16', '18')

### watch_history:
- [ ] `current_time` → >= 0
- [ ] `total_time` → >= current_time
- [ ] `progress_percentage` → >= 0 AND <= 100

---

## 6.2 Regras Complexas e Transações

**Regras transacionais:**

1. **Adicionar à Minha Lista:**
   ```
   IF EXISTS (my_list WHERE profile_id=X AND content_id=Y) THEN
     RAISE EXCEPTION 'Já existe na lista'
   ELSE
     INSERT INTO my_list
   END
   ```

2. **Atualizar progresso:**
   ```
   UPSERT INTO watch_history
   SET current_time = X, total_time = Y
   TRIGGER calcula progress_percentage automaticamente
   IF progress_percentage >= 90 THEN completed = true
   ```

3. **Criar perfil:**
   ```
   IF (SELECT COUNT(*) FROM profiles WHERE user_id=X) >= 5 THEN
     RAISE EXCEPTION 'Limite de 5 perfis atingido'
   ELSE
     INSERT INTO profiles
   END
   ```

4. **Deletar usuário:**
   ```
   ON DELETE CASCADE em:
   - profiles
   - my_list (via profiles)
   - favorites (via profiles)
   - watch_history (via profiles)
   - notifications
   ```

---

## 6.3 Soft Delete vs Hard Delete

**Política de deleção:**  
[ ] ☑ Hard Delete para:
  - profiles (usuário pode recriar)
  - my_list, favorites (ações reversíveis, mas não precisam histórico)
  - watch_history (pode ser recriado)

[ ] ☐ Soft Delete para:
  - N/A no MVP

**Justificativa:**  
[ ] Simplicidade no MVP. Adicionar soft delete depois se necessário (auditoria).

---

## 6.4 Logs e Auditoria

**Tabelas com auditoria:**  
[ ] ☑ `admin_logs` → registra TODAS as ações de admins  
[ ] ☑ `analytics_events` → tracking de comportamento do usuário

**Dados auditados:**  
[ ] admin_id, action, resource_type, resource_id, details (JSONB), ip_address, user_agent, timestamp

**Retenção de logs:**  
[ ] MVP: 90 dias  
[ ] Produção: 1 ano (analytics) | Indefinido (admin_logs)

---

## 6.5 Triggers e Funções

**Triggers identificados:**

1. **update_updated_at_column()** → BEFORE UPDATE em:
   - users
   - profiles
   - content
   - watch_history

2. **calculate_progress_percentage()** → BEFORE INSERT/UPDATE em:
   - watch_history
   - Calcula progress_percentage = (current_time / total_time) * 100
   - Se >= 90%, marca completed = true

**Funções SECURITY DEFINER necessárias:**  
[ ] ☐ Nenhuma no MVP  
[ ] ☑ Adicionar depois se necessário

---

# 📌 PARTE 7: SEGURANÇA E RLS (ROW-LEVEL SECURITY)

## 7.1 Habilitar RLS

**RLS habilitado nas seguintes tabelas:**

- [ ] ☑ `users`
- [ ] ☑ `profiles`
- [ ] ☑ `content` (apenas admin pode modificar)
- [ ] ☑ `my_list`
- [ ] ☑ `favorites`
- [ ] ☑ `watch_history`
- [ ] ☑ `reviews`
- [ ] ☑ `iptv_favorites`
- [ ] ☑ `notifications`

**Tabelas SEM RLS (acesso via service_role apenas):**

- [ ] ☑ `iptv_channels` (público para leitura)
- [ ] ☑ `admin_logs`
- [ ] ☑ `analytics_events`
- [ ] ☑ `system_settings`
- [ ] ☑ `seasons`, `episodes` (públicos)

---

## 7.2 Políticas RLS por Tabela

### Tabela: `users`

**SELECT:**
```sql
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);
```

**UPDATE:**
```sql
CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);
```

**INSERT/DELETE:**  
[ ] Gerenciado pelo Supabase Auth, não permitir via RLS

---

### Tabela: `profiles`

**SELECT:**
```sql
CREATE POLICY "Users can view own profiles" ON profiles
  FOR SELECT USING (auth.uid() = user_id);
```

**INSERT:**
```sql
CREATE POLICY "Users can create own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**UPDATE:**
```sql
CREATE POLICY "Users can update own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);
```

**DELETE:**
```sql
CREATE POLICY "Users can delete own profiles" ON profiles
  FOR DELETE USING (auth.uid() = user_id);
```

---

### Tabela: `content`

**SELECT (público):**
```sql
CREATE POLICY "Content is viewable by everyone" ON content
  FOR SELECT USING (true);
```

**INSERT/UPDATE/DELETE (apenas admins):**
```sql
CREATE POLICY "Only admins can modify content" ON content
  FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND is_admin = true)
  );
```

---

### Tabela: `my_list`

**SELECT:**
```sql
CREATE POLICY "Users can view own my_list" ON my_list
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid())
  );
```

**INSERT/UPDATE/DELETE:**
```sql
CREATE POLICY "Users can manage own my_list" ON my_list
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = profile_id AND user_id = auth.uid())
  );
```

*(Políticas similares para `favorites`, `watch_history`, `reviews`, `iptv_favorites`)*

---

## 7.3 Índices para RLS

**Colunas indexadas para performance de RLS:**

- [ ] ☑ `profiles.user_id` → JOIN constante em políticas
- [ ] ☑ `my_list.profile_id` → filtro RLS
- [ ] ☑ `favorites.profile_id` → filtro RLS
- [ ] ☑ `watch_history.profile_id` → filtro RLS
- [ ] ☑ `users.is_admin` → verificação admin
- [ ] ☑ `content.is_featured`, `content.is_trending` → queries frequentes

---

## 7.4 Funções Helper SECURITY DEFINER

**Funções necessárias:**  
[ ] ☐ Nenhuma no MVP

**Exemplo futuro:**
```sql
-- Função para retornar IDs de perfis do usuário (helper)
CREATE FUNCTION get_user_profile_ids(user_uuid UUID)
RETURNS SETOF UUID
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT id FROM profiles WHERE user_id = user_uuid;
$$;
```

---

# 📌 PARTE 8: ARMAZENAMENTO DE ARQUIVOS (SUPABASE STORAGE)

## 8.1 Uso de Storage

**Vai usar Supabase Storage?**  
[ ] ☑ SIM, para:
  - Avatars de usuários
  - Avatars de perfis
  - Logos de canais IPTV (upload manual admin)

[ ] ☐ NÃO (usar URLs externas apenas)

---

## 8.2 Buckets e Políticas

**Buckets necessários:**

1. **Bucket: `avatars`**
   - [ ] Tipo: PUBLIC (URLs acessíveis sem auth)
   - [ ] Path: `avatars/{user_id}/{filename}`
   - [ ] Política:
     - READ: público
     - WRITE: apenas owner (auth.uid() = user_id no path)

2. **Bucket: `channel-logos`**
   - [ ] Tipo: PUBLIC
   - [ ] Path: `channel-logos/{channel_id}/{filename}`
   - [ ] Política:
     - READ: público
     - WRITE: apenas admins

**RLS para storage.objects:**  
[ ] Configurar políticas por bucket conforme acima

**Tamanho máximo por arquivo:**  
[ ] 5MB (avatars) | 2MB (logos)

**Formatos permitidos:**  
[ ] JPG, PNG, WEBP, SVG (apenas logos)

---

## 8.3 Naming Convention

**Convenção de nomenclatura:**  
[ ] `{bucket}/{user_id ou resource_id}/{timestamp}_{original_filename}`

**Exemplo:**  
[ ] `avatars/550e8400-e29b-41d4-a716-446655440000/1700000000_profile.jpg`

---

# 📌 PARTE 9: REALTIME / NOTIFICAÇÕES

## 9.1 Uso de Realtime

**Precisa de Supabase Realtime?**  
[ ] ☐ SIM, para:
  - Chat
  - Notificações em tempo real
  - Presença online
  - Watch together (assistir junto)

[ ] ☑ NÃO no MVP

**Se SIM no futuro:**  
[ ] Habilitar Realtime em `notifications` para notificações push

---

## 9.2 Tópicos e Eventos

**Tópicos Realtime (futuro):**  
[ ] `notifications:{user_id}` → notificações do usuário  
[ ] `watch_together:{session_id}` → sincronizar playback

**Eventos:**  
[ ] INSERT em `notifications` → broadcast para `notifications:{user_id}`

---

# 📌 PARTE 10: INTEGRAÇÕES EXTERNAS E EDGE FUNCTIONS

## 10.1 APIs Externas

**APIs integradas:**

1. **TMDB API**
   - [ ] Endpoint: `https://api.themoviedb.org/3/*`
   - [ ] Chave: `VITE_TMDB_API_KEY` (já configurada)
   - [ ] Uso: Sincronização de catálogo de filmes/séries
   - [ ] Chamado de: Frontend (client-side) + Edge Function (sync)

2. **APIs de Futebol (12 APIs)**
   - [ ] Uso: Página SoccerPage com notícias e jogos
   - [ ] Chamado de: Frontend

**Webhooks:**  
[ ] ☐ Nenhum no MVP

---

## 10.2 Edge Functions

**Edge Functions necessárias:**

1. **`sync-tmdb-content`**
   - [ ] Tarefa: Sincronizar catálogo TMDB → Supabase (batch insert/update em `content`)
   - [ ] Trigger: Cron job (diário) OU manual via admin dashboard
   - [ ] Segurança: service_role key

2. **`github-sync`** (já existe)
   - [ ] Tarefa: Sincronizar dados do GitHub para Supabase KV
   - [ ] Trigger: Manual via GitHubSyncPanel

**Funções futuras:**  
[ ] `handle-stripe-webhook` → processar pagamentos  
[ ] `send-notification-email` → enviar emails via SendGrid

---

## 10.3 Segurança de Chaves e Secrets

**Onde armazenar secrets:**  
[ ] ☑ Supabase Environment Variables (Edge Functions)  
[ ] ☑ .env local (desenvolvimento)  
[ ] ☐ Vault externo (não necessário no MVP)

**Secrets necessários:**  
[ ] `SUPABASE_SERVICE_ROLE_KEY` → acesso total (backend only)  
[ ] `TMDB_API_KEY` → já existe  
[ ] *(Futuros: STRIPE_SECRET_KEY, SENDGRID_API_KEY)*

**Política de rotação:**  
[ ] Rotação manual quando necessário (MVP)  
[ ] Automação futura via Vault

---

# 📌 PARTE 11: PERFORMANCE, ÍNDICES E CARDINALIDADE

## 11.1 Principais Consultas

**Top 10 queries mais frequentes:**

1. **Buscar conteúdo em alta (trending)**
   ```sql
   SELECT * FROM trending_content LIMIT 20;
   ```
   - [ ] View materializada? ☐ SIM | ☑ NÃO (view simples OK para MVP)
   - [ ] Cache: 5 minutos no frontend

2. **Continuar assistindo (por perfil)**
   ```sql
   SELECT * FROM continue_watching WHERE profile_id = X ORDER BY updated_at DESC LIMIT 10;
   ```
   - [ ] View otimizada já existe
   - [ ] Índice em `watch_history.updated_at` (já criado)

3. **Busca full-text por título**
   ```sql
   SELECT * FROM content WHERE to_tsvector('portuguese', title) @@ to_tsquery('vingadores');
   ```
   - [ ] Índice GIN em `to_tsvector('portuguese', title)` (já criado)

4. **Filmes por gênero**
   ```sql
   SELECT * FROM content WHERE genres @> '[{"id": 28}]' AND media_type='movie' LIMIT 20;
   ```
   - [ ] Índice GIN em `genres` (já criado)

5. **Canais IPTV por categoria**
   ```sql
   SELECT * FROM iptv_channels WHERE category='sports' AND is_active=true ORDER BY sort_order;
   ```
   - [ ] Índice composto: `(category, is_active, sort_order)` → CRIAR

6. **Minha Lista (ordenada por adicionado recentemente)**
   ```sql
   SELECT c.* FROM my_list ml JOIN content c ON ml.content_id = c.id
   WHERE ml.profile_id = X ORDER BY ml.added_at DESC;
   ```
   - [ ] Índice em `my_list.added_at DESC` (já criado)

7. **Verificar se está na Minha Lista**
   ```sql
   SELECT EXISTS(SELECT 1 FROM my_list WHERE profile_id=X AND content_id=Y);
   ```
   - [ ] Índice único `(profile_id, content_id)` (já criado)

8. **Perfis do usuário**
   ```sql
   SELECT * FROM profiles WHERE user_id = X ORDER BY last_used DESC NULLS LAST;
   ```
   - [ ] Índice em `profiles.user_id` (já criado)
   - [ ] Índice em `last_used` → CRIAR se necessário

9. **Conteúdo em destaque (hero banners)**
   ```sql
   SELECT * FROM content WHERE is_featured=true ORDER BY popularity DESC LIMIT 5;
   ```
   - [ ] Índice em `is_featured` (já criado)

10. **Analytics - eventos recentes**
    ```sql
    SELECT * FROM analytics_events WHERE user_id=X ORDER BY created_at DESC LIMIT 100;
    ```
    - [ ] Índice em `(user_id, created_at DESC)` → CRIAR

---

## 11.2 Colunas Filtradas/Ordenadas

**Colunas que aparecem em WHERE:**

- [ ] `content.media_type`
- [ ] `content.is_featured`
- [ ] `content.is_trending`
- [ ] `iptv_channels.category`
- [ ] `iptv_channels.is_active`
- [ ] `watch_history.profile_id`
- [ ] `watch_history.completed`
- [ ] `my_list.profile_id`
- [ ] `favorites.profile_id`
- [ ] `users.is_admin`
- [ ] `users.subscription_status`

**Colunas que aparecem em ORDER BY:**

- [ ] `content.popularity DESC`
- [ ] `content.release_date DESC`
- [ ] `watch_history.updated_at DESC`
- [ ] `my_list.added_at DESC`
- [ ] `favorites.added_at DESC`
- [ ] `iptv_channels.sort_order ASC`
- [ ] `analytics_events.created_at DESC`

---

## 11.3 Cardinalidade Estimada

| Tabela | MVP | Crescimento | Produção |
|--------|-----|-------------|----------|
| users | 100-500 | 1.000-5.000 | 10.000-100.000 |
| profiles | 200-1.000 | 2.000-10.000 | 20.000-200.000 |
| content | 1.000-5.000 | 10.000-50.000 | 50.000-200.000 |
| seasons | 500-2.000 | 5.000-20.000 | 20.000-100.000 |
| episodes | 5.000-20.000 | 50.000-200.000 | 200.000-1.000.000 |
| my_list | 500-2.000 | 5.000-20.000 | 50.000-500.000 |
| favorites | 500-2.000 | 5.000-20.000 | 50.000-500.000 |
| watch_history | 1.000-5.000 | 10.000-50.000 | 100.000-1.000.000+ |
| reviews | 100-500 | 1.000-5.000 | 10.000-100.000 |
| iptv_channels | 80-100 | 100-300 | 300-1.000 |
| iptv_favorites | 200-1.000 | 2.000-10.000 | 20.000-100.000 |
| notifications | 500-2.000 | 5.000-20.000 | 50.000-500.000 |
| admin_logs | 100-500 | 1.000-5.000 | 10.000-100.000 |
| analytics_events | 5.000-20.000 | 50.000-200.000 | 500.000-5.000.000+ |

---

## 11.4 Taxa de Crescimento

**Tabelas de alta escrita (write-heavy):**

1. **watch_history**
   - [ ] +50-200 registros/dia por usuário ativo
   - [ ] UPSERT constante durante reprodução (a cada 10-30s)
   - [ ] **Otimização:** Debounce no frontend (salvar a cada 30s), não a cada segundo

2. **analytics_events**
   - [ ] +100-500 eventos/dia por usuário ativo
   - [ ] **Otimização:** Batch insert (buffer de 10 eventos), fire-and-forget

3. **my_list, favorites**
   - [ ] +5-20 registros/dia por usuário ativo
   - [ ] Crescimento linear

**Tabelas de leitura intensiva (read-heavy):**

1. **content**
   - [ ] Lido em quase todas as páginas
   - [ ] **Otimização:** Cache CDN (imagens), cache Redis/Supabase (queries)

2. **iptv_channels**
   - [ ] Lido na página IPTV
   - [ ] **Otimização:** Cache de 30 minutos (lista estável)

---

# 📌 PARTE 12: MIGRATIONS, SEEDS E DEPLOY

## 12.1 Preferência de Migrations

**Ferramenta de migrations:**  
[ ] ☑ Supabase Migrations (SQL puro)  
[ ] ☐ Prisma Migrate  
[ ] ☐ Flyway  
[ ] ☐ Custom scripts

**Localização:**  
[ ] `/supabase/migrations/*.sql`

**Arquivo principal já criado:**  
[ ] ☑ `001_create_redflix_schema.sql` (schema completo)

**Próximas migrations:**  
[ ] `002_add_indexes.sql` (índices adicionais)  
[ ] `003_seed_iptv_channels.sql` (dados iniciais)  
[ ] `004_add_storage_policies.sql` (políticas de Storage)

---

## 12.2 Seed Data

**Dados iniciais necessários:**

1. **system_settings**
   - [ ] ☑ Já inserido no schema (manutenção, signups, etc)

2. **iptv_channels**
   - [ ] ☑ 6 canais de exemplo no schema
   - [ ] ☐ Lista completa de 80 canais → FORNECER CSV/JSON

3. **content**
   - [ ] ☐ 100-500 filmes/séries populares → Sincronizar via TMDB Edge Function

4. **users (admin)**
   - [ ] Criar via Supabase Auth manualmente ou script

**Arquivo de seed:**  
[ ] `/supabase/migrations/003_seed_data.sql`

**Fornecer CSV/JSON de canais IPTV:**  
[ ] ☐ SIM, anexar arquivo `iptv_channels_seed.json`  
[ ] ☑ NÃO, importar manualmente via admin dashboard

---

## 12.3 Processo de Deploy

**CI/CD:**  
[ ] ☐ GitHub Actions  
[ ] ☐ GitLab CI  
[ ] ☑ Manual (MVP)

**Fluxo de deploy:**

1. **Dev:**
   - [ ] Testar migrations localmente
   - [ ] `supabase db reset` (dropa e recria)
   - [ ] Validar schema e queries

2. **Staging:**
   - [ ] `supabase db push` para projeto staging
   - [ ] Smoke tests manuais
   - [ ] Validar RLS policies

3. **Produção:**
   - [ ] Backup manual antes
   - [ ] `supabase db push` para projeto prod
   - [ ] Monitorar logs por 1 hora
   - [ ] Rollback se necessário

**Rollback:**  
[ ] ☑ Manter migrations reversíveis (DOWN scripts)  
[ ] ☑ Backup automático do Supabase (point-in-time recovery)

---

# 📌 PARTE 13: OBSERVABILIDADE E MANUTENÇÃO

## 13.1 Logs e Métricas

**Logs necessários:**

1. **Erro de queries**
   - [ ] Logar no Supabase Dashboard → Logs
   - [ ] Alertar se taxa de erro > 1%

2. **Latência de queries**
   - [ ] Monitorar p50, p95, p99
   - [ ] Alertar se p95 > 500ms

3. **Edge Functions**
   - [ ] Logar execuções e erros
   - [ ] Monitorar timeout (25s limit)

**Métricas:**  
[ ] Supabase Dashboard nativo (CPU, RAM, Disk, Connections)  
[ ] ☐ APM externo (Datadog, New Relic) → Futuro

---

## 13.2 Acesso e Permissões

**Quem terá acesso ao Supabase:**

1. **Owner (você)**
   - [ ] Email: [SEU_EMAIL_AQUI]
   - [ ] Permissão: Owner (acesso total)

2. **Desenvolvedores**
   - [ ] Email: [LISTA_DE_EMAILS]
   - [ ] Permissão: Developer (read/write, sem billing)

3. **Admins da aplicação**
   - [ ] Acesso via app (is_admin=true)
   - [ ] NÃO tem acesso ao Supabase Dashboard

**2FA:**  
[ ] ☑ Habilitado para owner  
[ ] ☐ Obrigatório para todos (futuro)

---

## 13.3 Backup e Retention

**Política de backup:**  
[ ] ☑ Backups automáticos do Supabase (diários)  
[ ] ☑ Point-in-time recovery (últimos 7 dias - plano Free/Pro)  
[ ] ☐ Backups manuais semanais → Futuro

**Retenção:**

- [ ] `analytics_events`: 90 dias (MVP) | 1 ano (Produção)
- [ ] `admin_logs`: Indefinido (compliance)
- [ ] `watch_history`: Indefinido (UX)
- [ ] `notifications`: 30 dias (limpar lidas antigas)

**Script de limpeza (futuro):**
```sql
-- Deletar notificações lidas com mais de 30 dias
DELETE FROM notifications
WHERE is_read = true AND created_at < NOW() - INTERVAL '30 days';

-- Deletar analytics com mais de 90 dias
DELETE FROM analytics_events
WHERE created_at < NOW() - INTERVAL '90 days';
```

---

# 📌 PARTE 14: ENTREGÁVEIS DESEJADOS

## 14.1 Artefatos Esperados

**Ao final da implementação, fornecer:**

1. [ ] ☑ **DDL SQL completo** (`/supabase/migrations/*.sql`)
2. [ ] ☑ **Políticas RLS** (incluídas no DDL)
3. [ ] ☑ **Índices** (incluídos no DDL + arquivo separado se necessário)
4. [ ] ☑ **Seed data SQL** (`003_seed_data.sql`)
5. [ ] ☐ **Diagrama ER** (PNG/PDF) → GERAR com ferramenta
6. [ ] ☐ **Edge Functions TS** (se aplicável)
7. [ ] ☑ **Plano de deploy** (documento Markdown)
8. [ ] ☑ **Checklist de segurança** (RLS, secrets, validações)
9. [ ] ☐ **Script de teste de integridade** (validar dados)

**Ferramentas sugeridas para ER:**  
[ ] dbdiagram.io  
[ ] drawio  
[ ] Supabase Table Editor (exportar como imagem)

---

## 14.2 Prioridade de Entrega

**Ordem de implementação:**

1. [ ] ☑ **CRÍTICO (P0)** → Schema base + RLS (users, profiles, content, watch_history)
2. [ ] ☑ **ALTA (P1)** → Listas (my_list, favorites) + IPTV
3. [ ] ☑ **MÉDIA (P2)** → Notificações + Analytics + Admin logs
4. [ ] ☐ **BAIXA (P3)** → Realtime + Storage policies (futuro)

**Timeline desejada:**  
[ ] P0: Semana 1  
[ ] P1: Semana 2  
[ ] P2: Semana 3  
[ ] P3: Futuro (post-MVP)

---

# 📌 PARTE 15: TESTES E VALIDAÇÃO

## 15.1 Casos de Teste

**Testes funcionais (manuais ou automatizados):**

1. **Criar usuário e perfis**
   ```
   - Criar user via Supabase Auth
   - Criar 5 perfis → OK
   - Tentar criar 6º perfil → ERRO (constraint)
   - Deletar perfil → CASCADE em listas/histórico
   ```

2. **Adicionar à Minha Lista**
   ```
   - Adicionar filme X à Minha Lista do perfil Y → OK
   - Tentar adicionar novamente → ERRO (unique constraint)
   - Deletar perfil → CASCADE deleta entrada em my_list
   ```

3. **Salvar progresso de reprodução**
   ```
   - Salvar progresso 50% → OK
   - UPSERT novamente (75%) → Atualiza registro existente
   - Verificar progress_percentage calculado automaticamente
   - Atingir 95% → completed = true
   ```

4. **Upload de avatar**
   ```
   - Upload como owner → OK
   - Upload como outro usuário → ERRO (RLS bloqueia)
   - URL pública acessível → OK
   ```

5. **Busca full-text**
   ```
   - Buscar "vingadores" → Retorna filmes relacionados
   - Buscar "ação" → Retorna filmes do gênero
   - Performance < 200ms
   ```

---

## 15.2 Consultas de Verificação

**Queries para validar integridade:**

```sql
-- 1. Verificar constraint de máx 5 perfis
SELECT user_id, COUNT(*) as total_profiles
FROM profiles
GROUP BY user_id
HAVING COUNT(*) > 5;
-- Deve retornar 0 linhas

-- 2. Verificar progress_percentage consistente
SELECT * FROM watch_history
WHERE progress_percentage > 100 OR progress_percentage < 0;
-- Deve retornar 0 linhas

-- 3. Verificar completed marcado corretamente
SELECT * FROM watch_history
WHERE progress_percentage >= 90 AND completed = false;
-- Deve retornar 0 linhas (trigger deve marcar auto)

-- 4. Verificar órfãos em my_list (perfis deletados)
SELECT ml.* FROM my_list ml
LEFT JOIN profiles p ON ml.profile_id = p.id
WHERE p.id IS NULL;
-- Deve retornar 0 linhas (CASCADE delete)

-- 5. Verificar conteúdo sem título
SELECT * FROM content WHERE title IS NULL OR title = '';
-- Deve retornar 0 linhas

-- 6. Verificar canais IPTV ativos sem URL
SELECT * FROM iptv_channels WHERE is_active = true AND (stream_url IS NULL OR stream_url = '');
-- Deve retornar 0 linhas

-- 7. Verificar usuários admin
SELECT id, email, is_admin FROM users WHERE is_admin = true;
-- Retornar apenas admins conhecidos

-- 8. Verificar RLS em content (public read)
SET ROLE anon;
SELECT COUNT(*) FROM content;
-- Deve retornar total de conteúdo (público)

-- 9. Verificar RLS em my_list (apenas próprio perfil)
SET ROLE authenticated;
SET request.jwt.claims.sub = 'user_id_here';
SELECT COUNT(*) FROM my_list WHERE profile_id = 'profile_id_outro_usuario';
-- Deve retornar 0 (RLS bloqueia)

-- 10. Performance de trending view
EXPLAIN ANALYZE SELECT * FROM trending_content LIMIT 20;
-- Execution time < 500ms
```

---

# 📌 PARTE 16: SEGURANÇA OPERACIONAL

## 16.1 Confirmação de Operações Destrutivas

**⚠️ CONFIRMAÇÃO OBRIGATÓRIA:**

**Nenhuma operação destrutiva será executada sem confirmação explícita:**  
[ ] ☑ CONCORDO

**Operações destrutivas incluem:**
- [ ] DROP TABLE
- [ ] DROP DATABASE
- [ ] TRUNCATE
- [ ] DELETE sem WHERE (massa)
- [ ] ALTER TABLE DROP COLUMN
- [ ] Desabilitar RLS

**Processo de confirmação:**
1. Listar objetos a serem removidos
2. Pedir confirmação explícita: "CONFIRMO DELEÇÃO DE [objeto]"
3. Executar apenas após confirmação
4. Fazer backup antes

---

## 16.2 Autorização para Migrations Destrutivas

**Se autorizar migrations que removem dados, fornecer:**

**Objetos autorizados para remoção (se aplicável):**  
[ ] ☐ Nenhum (não autorizado)  
[ ] ☐ Lista específica abaixo:

```
- TABLE: [nome_tabela_old]
- COLUMN: [tabela.coluna_deprecated]
- INDEX: [idx_old_index]
```

**Backup obrigatório antes:**  
[ ] ☑ SIM, sempre

---

# 📌 PARTE 17: DADOS E EXEMPLOS

## 17.1 Arquivos e Snippets

**Fornecer exemplos reais (SEM SEGREDOS) de:**

1. **CSV de canais IPTV (80 canais)**
   - [ ] ☐ Anexar arquivo: `iptv_channels.csv`
   - [ ] ☑ Importar manualmente depois

2. **JSON de conteúdo inicial**
   - [ ] ☐ Anexar arquivo: `content_seed.json`
   - [ ] ☑ Sincronizar via TMDB API

3. **Exemplos de payloads de APIs**
   - [ ] ☑ Já fornecidos na Parte 2.3

---

## 17.2 Dump ou Migrations Atuais

**Projeto já tem banco existente?**  
[ ] ☑ SIM, schema em `/supabase/migrations/001_create_redflix_schema.sql`  
[ ] ☐ NÃO, criar do zero

**Se SIM, fornecer:**  
[ ] ☑ Arquivo SQL já fornecido  
[ ] ☐ Dump completo (pg_dump) → N/A

---

# 📌 PARTE 18: PRIORIDADES, PRAZOS E CONTEXTO

## 18.1 Prazos

**Prazo para MVP:**  
[ ] 2-3 semanas (schema + RLS + seed)

**Prazo para Produção:**  
[ ] 1-2 meses (após MVP + testes + otimizações)

---

## 18.2 Recursos Disponíveis

**Desenvolvedores:**  
[ ] 1-2 pessoas

**Orçamento Supabase:**  
[ ] Plano Free (MVP) → Plano Pro (~$25/mês) quando crescer

**Conhecimento técnico:**  
[ ] PostgreSQL: Intermediário  
[ ] Supabase: Intermediário  
[ ] React/TypeScript: Avançado

---

## 18.3 Restrições Legais/Compliance

**Regulamentações aplicáveis:**  
[ ] ☑ LGPD (Lei Geral de Proteção de Dados - Brasil)  
[ ] ☐ GDPR (se tiver usuários EU)  
[ ] ☐ HIPAA (não aplicável)  
[ ] ☐ SOC 2 (futuro)

**Dados sensíveis:**  
[ ] Email, nome, telefone (PII - Personally Identifiable Information)  
[ ] Histórico de visualização (comportamento)

**Requisitos LGPD:**
- [ ] ☑ Direito de acesso (usuário pode ver seus dados)
- [ ] ☑ Direito de correção (usuário pode editar)
- [ ] ☑ Direito de exclusão (deletar conta → CASCADE)
- [ ] ☑ Consentimento explícito (termo de uso no cadastro)
- [ ] ☐ Portabilidade de dados (exportar JSON) → Futuro

**Criptografia:**  
[ ] ☑ Em trânsito (HTTPS)  
[ ] ☑ Em repouso (Supabase default)  
[ ] ☐ Criptografia adicional (colunas específicas) → N/A no MVP

---

# 📌 PARTE 19: PERGUNTAS ABERTAS E CHECKLIST FINAL

## 19.1 Dúvidas Pendentes

**Aguardando esclarecimento:**

1. **Canais IPTV:**
   - [ ] ☐ Fornecer lista completa de 80 canais (CSV/JSON)?  
   - [ ] ☑ Importar manualmente via admin dashboard?

2. **Storage:**
   - [ ] ☑ Configurar buckets agora?  
   - [ ] ☐ Deixar para depois do MVP?

3. **Realtime:**
   - [ ] ☐ Habilitar agora?  
   - [ ] ☑ Deixar para v2.0?

4. **Diagrama ER:**
   - [ ] ☐ Gerar automaticamente (ferramenta)?  
   - [ ] ☑ Desenhar manualmente depois?

---

## 19.2 Confirmações Críticas

**Por favor, CONFIRME as seguintes decisões:**

1. [ ] ☑ **Multi-tenant:** Sistema é single-tenant (todos usuários compartilham catálogo)
2. [ ] ☑ **Soft delete:** NÃO usar soft delete no MVP (hard delete OK)
3. [ ] ☑ **RLS:** Habilitar em todas as tabelas sensíveis
4. [ ] ☑ **Migrations:** Usar Supabase Migrations (SQL puro)
5. [ ] ☑ **Auth:** Usar Supabase Auth nativo (email/password)
6. [ ] ☑ **Storage:** Usar para avatars e logos (buckets públicos)
7. [ ] ☑ **Realtime:** NÃO usar no MVP
8. [ ] ☑ **Edge Functions:** Criar `sync-tmdb-content` e `github-sync`
9. [ ] ☑ **Analytics:** Salvar eventos em `analytics_events` (retenção 90 dias MVP)
10. [ ] ☑ **Backup:** Confiar em backups automáticos do Supabase

---

# 📌 PARTE 20: ARQUIVOS ANEXOS

**Anexar os seguintes arquivos junto com este formulário:**

- [ ] ☑ `/supabase/migrations/001_create_redflix_schema.sql` (já fornecido)
- [ ] ☑ `/utils/supabase/database.ts` (já fornecido)
- [ ] ☑ `/utils/tmdb.ts` (fornecer se pedido)
- [ ] ☐ `iptv_channels.csv` (lista de 80 canais) → PENDENTE
- [ ] ☐ Diagrama ER (se existir) → PENDENTE
- [ ] ☐ Dump atual do banco (se aplicável) → N/A

---

# ✅ INSTRUÇÕES FINAIS

## Quando terminar de preencher:

1. **Revise TODO o formulário**
2. **Certifique-se que todos os `[ ]` foram preenchidos**
3. **Anexe os arquivos solicitados**
4. **Responda abaixo:**

---

## 🎯 RESPOSTA FINAL

**Após revisar e preencher TUDO, escreva:**

```
PRONTO

Confirmo que:
- Todos os campos foram preenchidos
- Exemplos concretos foram fornecidos
- Arquivos essenciais estão anexados
- Entendo que a implementação seguirá este formulário como especificação
- Autorizo o início da modelagem do banco de dados

Assinatura: [SEU NOME]
Data: [DATA]
```

---

**Após receber "PRONTO", iniciarei a modelagem e implementação do banco de dados Supabase/Postgres para o RedFlix!**

---

# 📝 NOTAS ADICIONAIS

## Observações do Implementador:

- Schema base já existe e está bem estruturado
- RLS policies já estão definidas
- Triggers automáticos implementados (update_updated_at, calculate_progress_percentage)
- Views úteis criadas (trending_content, continue_watching)
- Índices principais já existem
- Seed data parcial (system_settings, 6 canais IPTV de exemplo)

## Próximos Passos Sugeridos:

1. Revisar e validar schema existente
2. Adicionar índices compostos sugeridos
3. Criar Edge Function `sync-tmdb-content`
4. Configurar Storage buckets e políticas
5. Popular seed data (80 canais IPTV)
6. Testar RLS policies exaustivamente
7. Implementar scripts de validação de integridade
8. Documentar fluxos de deploy
9. Gerar diagrama ER

---

**Fim do Formulário - Versão 1.0 - RedFlix Database Design**
