# RedFlix - Database Setup & Deployment Guide

Este README contém todas as instruções para criar, configurar e verificar o banco de dados PostgreSQL/Supabase para o projeto RedFlix.

## 📋 Sumário

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Estrutura de Arquivos](#estrutura-de-arquivos)
4. [Instruções de Deploy](#instruções-de-deploy)
5. [Verificação Pós-Deploy](#verificação-pós-deploy)
6. [Storage Buckets](#storage-buckets)
7. [Edge Functions](#edge-functions)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O schema do RedFlix inclui:

- **14 tabelas principais**: users, profiles, content, seasons, episodes, my_list, favorites, watch_history, reviews, iptv_channels, iptv_favorites, notifications, admin_logs, analytics_events, system_settings
- **RLS (Row Level Security)** completo em todas as tabelas
- **Triggers automáticos** para updated_at, progress_percentage, max_profiles
- **Índices otimizados** para queries frequentes (incluindo GIN para JSONB e full-text)
- **Funções RPC** para busca, recomendações e analytics
- **Storage policies** para avatars, logos de canais e imagens de conteúdo
- **Edge Function** para sincronização com TMDB

---

## ✅ Pré-requisitos

1. **Conta Supabase** ativa (gratuita ou paga)
2. **Projeto Supabase** criado
3. **Supabase CLI** instalado (opcional, mas recomendado):
   ```bash
   npm install -g supabase
   ```
4. **Credenciais do projeto**:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `TMDB_API_KEY` (para sincronização de conteúdo)

---

## 📁 Estrutura de Arquivos

```
/supabase/
├── migrations/
│   ├── 001_create_redflix_schema.sql       # Tabelas e RLS
│   ├── 002_create_triggers_and_functions.sql # Triggers e funções
│   ├── 003_create_indexes.sql              # Índices
│   ├── 004_seed_initial_data.sql           # Dados de exemplo
│   └── 005_storage_policies.sql            # Storage e políticas
├── functions/
│   └── sync-tmdb-content/
│       └── index.ts                        # Edge Function
└── README.md                               # Este arquivo
```

---

## 🚀 Instruções de Deploy

### Opção 1: Via SQL Editor do Supabase (Recomendado)

1. **Acesse o Supabase Dashboard**:
   - Vá para https://app.supabase.com
   - Selecione seu projeto

2. **Abra o SQL Editor**:
   - Menu lateral: `SQL Editor` → `New query`

3. **Execute as migrations na ordem**:

   **Migration 001 - Schema e Tabelas**:
   ```sql
   -- Copie e cole todo o conteúdo de 001_create_redflix_schema.sql
   -- Clique em RUN
   ```

   **Migration 002 - Triggers e Funções**:
   ```sql
   -- Copie e cole todo o conteúdo de 002_create_triggers_and_functions.sql
   -- Clique em RUN
   ```

   **Migration 003 - Índices**:
   ```sql
   -- Copie e cole todo o conteúdo de 003_create_indexes.sql
   -- Clique em RUN
   ```

   **Migration 004 - Seeds (Opcional)**:
   ```sql
   -- Copie e cole todo o conteúdo de 004_seed_initial_data.sql
   -- Clique em RUN
   ```

   **Migration 005 - Storage (Instruções)**:
   ```sql
   -- Leia as instruções em 005_storage_policies.sql
   -- Execute as políticas RLS conforme necessário
   ```

4. **Importante**: Execute uma migration por vez e aguarde o resultado antes de executar a próxima.

### Opção 2: Via Supabase CLI (Avançado)

1. **Login no Supabase**:
   ```bash
   supabase login
   ```

2. **Link ao projeto**:
   ```bash
   supabase link --project-ref <seu-project-ref>
   ```

3. **Aplicar migrations**:
   ```bash
   supabase db push
   ```

### Opção 3: Via Backend (Edge Function)

Para ambientes automatizados, você pode criar uma Edge Function que executa as migrations usando `SUPABASE_SERVICE_ROLE_KEY`. **Atenção**: Use apenas em ambientes controlados.

---

## 🔍 Verificação Pós-Deploy

Execute estas queries no SQL Editor para validar a instalação:

### 1. Verificar Tabelas Criadas

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Esperado**: 14 tabelas (users, profiles, content, seasons, episodes, my_list, favorites, watch_history, reviews, iptv_channels, iptv_favorites, notifications, admin_logs, analytics_events, system_settings)

### 2. Verificar RLS Habilitado

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Esperado**: `rowsecurity = true` em todas as tabelas

### 3. Verificar Políticas RLS

```sql
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Esperado**: Múltiplas políticas para cada tabela (SELECT, INSERT, UPDATE, DELETE)

### 4. Verificar Triggers

```sql
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;
```

**Esperado**: Triggers `update_*_updated_at`, `calculate_watch_progress`, `check_max_profiles`

### 5. Verificar Funções

```sql
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

**Esperado**: Funções como `update_updated_at`, `calculate_progress_percentage`, `enforce_max_profiles_per_user`, `search_content`, `get_trending_content`, etc.

### 6. Verificar Índices

```sql
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
```

**Esperado**: Múltiplos índices (50+) em todas as tabelas

### 7. Verificar Seeds (se aplicou 004)

```sql
-- Verificar usuários
SELECT id, email, subscription_plan, is_admin FROM public.users;

-- Verificar perfis
SELECT id, user_id, name, is_kids FROM public.profiles;

-- Verificar conteúdos
SELECT id, title, media_type, is_featured FROM public.content;

-- Verificar canais IPTV
SELECT id, name, category, is_active FROM public.iptv_channels;
```

**Esperado**: 3 usuários, 3 perfis, 3 conteúdos, 6 canais IPTV

### 8. Verificar System Settings

```sql
SELECT key, value, is_public FROM public.system_settings ORDER BY key;
```

**Esperado**: app_name, app_version, maintenance_mode, max_profiles_per_user, plans, tmdb_sync_enabled, analytics_enabled

---

## 📦 Storage Buckets

### Criação de Buckets

**Via Dashboard**:
1. Vá para `Storage` no menu lateral
2. Clique em `New bucket`
3. Crie os seguintes buckets:

   - **make-2363f5d6-avatars**
     - Public: ❌ Não
     - File size limit: 2 MB
     - Allowed MIME types: image/png, image/jpeg, image/jpg, image/webp

   - **make-2363f5d6-channel-logos**
     - Public: ✅ Sim
     - File size limit: 500 KB
     - Allowed MIME types: image/png, image/jpeg, image/jpg, image/svg+xml, image/webp

   - **make-2363f5d6-content-media**
     - Public: ✅ Sim
     - File size limit: 5 MB
     - Allowed MIME types: image/png, image/jpeg, image/jpg, image/webp

**Via Edge Function** (idempotente):
```typescript
// Ver exemplo em 005_storage_policies.sql
const buckets = [
  { name: 'make-2363f5d6-avatars', options: { public: false, fileSizeLimit: 2097152 } },
  { name: 'make-2363f5d6-channel-logos', options: { public: true, fileSizeLimit: 524288 } },
  { name: 'make-2363f5d6-content-media', options: { public: true, fileSizeLimit: 5242880 } }
];

for (const bucket of buckets) {
  const { data: existing } = await supabase.storage.listBuckets();
  if (!existing?.some(b => b.name === bucket.name)) {
    await supabase.storage.createBucket(bucket.name, bucket.options);
  }
}
```

### Aplicar Políticas de Storage

Execute as políticas RLS do arquivo `005_storage_policies.sql` no SQL Editor.

### Verificar Buckets

```sql
SELECT * FROM storage.buckets;
```

**Esperado**: 3 buckets criados

---

## ⚡ Edge Functions

### Deploy da Edge Function: sync-tmdb-content

1. **Configurar Secrets**:
   ```bash
   # Via CLI
   supabase secrets set TMDB_API_KEY=<sua-chave-tmdb>

   # Ou via Dashboard: Settings → Edge Functions → Secrets
   ```

2. **Deploy**:
   ```bash
   supabase functions deploy sync-tmdb-content --no-verify-jwt
   ```

3. **Testar**:
   ```bash
   curl -X POST https://<project-ref>.supabase.co/functions/v1/sync-tmdb-content \
     -H "Authorization: Bearer <SUPABASE_ANON_KEY>" \
     -H "Content-Type: application/json" \
     -d '{"tmdb_ids": [299534, 1396], "media_type": "movie"}'
   ```

4. **Uso no Frontend**:
   ```typescript
   const response = await fetch(
     `https://${projectId}.supabase.co/functions/v1/sync-tmdb-content`,
     {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${publicAnonKey}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({
         sync_all: true,
         limit: 50
       })
     }
   );
   ```

---

## 🔧 Troubleshooting

### Problema: Erro de permissão ao executar migrations

**Solução**: Certifique-se de estar logado como proprietário do projeto ou com `SUPABASE_SERVICE_ROLE_KEY`.

### Problema: RLS bloqueando queries

**Solução**: 
- Verifique se você está autenticado (use `auth.users` real, não IDs de exemplo)
- Para testes, desabilite RLS temporariamente:
  ```sql
  ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
  ```
- **IMPORTANTE**: Re-habilite RLS após testes!

### Problema: Trigger `on_auth_user_created` não funciona

**Solução**: Este trigger requer acesso ao schema `auth`. Execute manualmente:
```sql
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_record();
```

Se não tiver acesso, crie usuários via Supabase Auth API que automaticamente criará o registro.

### Problema: Índices não estão sendo criados

**Solução**: Em produção, use `CREATE INDEX CONCURRENTLY` para evitar locks:
```sql
CREATE INDEX CONCURRENTLY idx_content_popularity 
ON public.content(popularity DESC) 
WHERE is_available = true;
```

### Problema: Seeds não inserem dados (IDs de usuários inválidos)

**Solução**: Os IDs em `004_seed_initial_data.sql` são exemplos. Para ter dados reais:
1. Crie usuários via Supabase Auth:
   ```typescript
   const { data, error } = await supabase.auth.signUp({
     email: 'teste@redflix.com',
     password: 'senha123',
     options: {
       data: { full_name: 'Teste RedFlix' }
     }
   });
   ```
2. O trigger `create_user_record()` criará automaticamente o registro em `public.users`
3. Use os IDs reais para criar perfis e demais dados

### Problema: Storage policies não funcionam

**Solução**: Verifique se:
1. Os buckets foram criados com os nomes exatos (`make-2363f5d6-*`)
2. As políticas RLS foram aplicadas em `storage.objects`
3. O usuário está autenticado ao tentar upload

### Problema: Edge Function retorna 404

**Solução**:
1. Verifique se o deploy foi bem-sucedido:
   ```bash
   supabase functions list
   ```
2. Certifique-se de usar a URL correta: `https://<project-ref>.supabase.co/functions/v1/sync-tmdb-content`
3. Verifique os logs:
   ```bash
   supabase functions logs sync-tmdb-content
   ```

---

## 📊 Checklist Pós-Deploy

- [ ] 14 tabelas criadas
- [ ] RLS habilitado em todas as tabelas
- [ ] Políticas RLS aplicadas (4-8 políticas por tabela)
- [ ] Triggers criados (update_updated_at, calculate_progress, check_max_profiles)
- [ ] Funções criadas (search_content, get_trending_content, etc.)
- [ ] Índices criados (50+ índices)
- [ ] Seeds aplicados (opcional, 3 users, 3 profiles, 3 contents, 6 channels)
- [ ] System settings configurados (7 settings)
- [ ] Storage buckets criados (3 buckets)
- [ ] Storage policies aplicadas
- [ ] Edge Function deployada (sync-tmdb-content)
- [ ] Secrets configurados (TMDB_API_KEY)

---

## 🎉 Próximos Passos

Após aplicar todas as migrations:

1. **Criar usuários reais** via Supabase Auth (não usar os seeds)
2. **Sincronizar conteúdos do TMDB** via Edge Function
3. **Testar autenticação** e fluxo de login
4. **Testar RLS** com queries do frontend
5. **Configurar backup** automático do banco
6. **Configurar monitoring** de performance
7. **Revisar e ajustar** índices baseado em queries reais

---

## 📝 Observações Finais

- **NÃO compartilhe** `SUPABASE_SERVICE_ROLE_KEY` publicamente
- **SEMPRE use** RLS em produção
- **Teste queries** antes de executar em produção
- **Faça backup** antes de migrations destrutivas
- **Monitore performance** dos índices após deploy

---

## 🆘 Suporte

Para dúvidas ou problemas:
1. Verifique os logs do Supabase Dashboard
2. Consulte a documentação oficial: https://supabase.com/docs
3. Use o SQL Editor para executar queries de verificação
4. Em caso de erro, reverta migrations usando `ROLLBACK` ou `DROP TABLE/FUNCTION/etc`

**ATENÇÃO**: Sempre teste em ambiente de desenvolvimento antes de aplicar em produção!

---

**RedFlix Database v1.0** - Criado em 2025
