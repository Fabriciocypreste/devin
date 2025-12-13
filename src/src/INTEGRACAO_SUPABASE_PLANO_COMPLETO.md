# 🚀 PLANO DE INTEGRAÇÃO COMPLETA - REDFLIX + SUPABASE

**Projeto:** RedFlix - Plataforma de Streaming  
**Supabase Project ID:** `vsztquvvnwlxdwyeoffh`  
**Proprietário:** Fabricio Cunha Cypreste  
**Data de Autorização:** 19/11/2024  
**Status:** ✅ AUTORIZADO FORMALMENTE

---

## 📋 AUTORIZAÇÃO RECEBIDA

✅ **Permissões Concedidas:**
1. Configurar integrações frontend (ANON_KEY)
2. Criar e implantar Edge Functions
3. Executar operações administrativas (INSERT/UPDATE/UPSERT)
4. Configurar variáveis de ambiente
5. Executar scripts de seed (não-destrutivos)
6. Testar RLS, Realtime e Auth
7. Criar documentação técnica

⚠️ **Requer Aprovação Prévia:**
- DROP, DELETE sem WHERE, alterações destrutivas de schema

---

## 🎯 OBJETIVOS DA INTEGRAÇÃO

### **Fase 1: Setup Inicial (Database)** 🔧
- [ ] Aplicar migrations SQL (criar 16 tabelas)
- [ ] Configurar RLS policies (9 tabelas)
- [ ] Criar índices de performance
- [ ] Inserir seed data inicial
- [ ] Validar integridade do schema

### **Fase 2: Edge Functions (Backend)** ⚡
- [ ] Deploy função `sync-tmdb-content`
- [ ] Deploy função `get-user-info`
- [ ] Configurar Service Role Key
- [ ] Testar endpoints protegidos
- [ ] Configurar CORS e logging

### **Fase 3: Frontend Integration** ��
- [ ] Configurar Supabase Client
- [ ] Implementar Auth (Login/Signup)
- [ ] Conectar Profiles
- [ ] Integrar Minha Lista / Favoritos
- [ ] Watch History tracking
- [ ] IPTV channels

### **Fase 4: Testing & Validation** ✅
- [ ] Testes de RLS (segurança)
- [ ] Testes de performance
- [ ] Validar fluxo completo
- [ ] Criar usuários de teste
- [ ] Verificar logs e analytics

### **Fase 5: Documentation & Rollback** 📚
- [ ] README de deploy
- [ ] Guia de troubleshooting
- [ ] Plano de rollback
- [ ] Documentação de API
- [ ] Logs de atividades

---

## 📊 ESTADO ATUAL DO PROJETO

### **✅ JÁ CONFIGURADO:**
1. ✅ Projeto Supabase criado (`vsztquvvnwlxdwyeoffh`)
2. ✅ Credenciais atualizadas em `/utils/supabase/info.tsx`
3. ✅ Cliente Supabase configurado (`/utils/supabase/client.ts`)
4. ✅ Migrations SQL prontas:
   - `/supabase/migrations/001_create_redflix_schema.sql` (647 linhas)
   - `/supabase/migrations/002_create_kv_store.sql` (82 linhas)
5. ✅ Edge Function server rodando (`/supabase/functions/server/index.tsx`)
6. ✅ Formulário de especificação completo (`/FORMULARIO_COMPLETO_REDFLIX_SUPABASE.md`)

### **⚠️ PENDENTE (Requer Ação):**
1. ⚠️ Tabelas não criadas no banco (migrations não aplicadas)
2. ⚠️ Service Role Key não configurada
3. ⚠️ Seed data não inserido
4. ⚠️ RLS policies não ativas
5. ⚠️ Storage buckets não criados

---

## 🔐 CREDENCIAIS E SEGURANÇA

### **Credenciais Públicas (Frontend) ✅**
```env
NEXT_PUBLIC_SUPABASE_URL=https://vsztquvvnwlxdwyeoffh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw
```

**Status:** ✅ Já configuradas em `/utils/supabase/info.tsx`

### **Credenciais Privadas (Backend) ⚠️**
```env
SUPABASE_SERVICE_ROLE_KEY=<PENDENTE>
```

**Como obter:**
1. Acessar: https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh
2. Settings → API → Project API keys
3. Copiar `service_role` key (secret)
4. **NÃO COMPARTILHAR AQUI NO CHAT**
5. Adicionar no painel de Edge Functions

---

## 🗄️ FASE 1: APLICAR MIGRATIONS (DATABASE SETUP)

### **Etapa 1.1: Acessar SQL Editor**

1. Abrir: https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh
2. Menu lateral → **SQL Editor**
3. Clicar em **New Query**

### **Etapa 1.2: Executar Migration 001 (Schema Principal)**

**Arquivo:** `/supabase/migrations/001_create_redflix_schema.sql`

**O que cria:**
- ✅ 15 tabelas principais (users, profiles, content, etc)
- ✅ 9 políticas RLS
- ✅ 25+ índices de performance
- ✅ 3 triggers automáticos
- ✅ 2 views (trending_content)
- ✅ Seed data inicial (6 canais IPTV)

**Tempo estimado:** 5-10 segundos

**Validação após executar:**
```sql
-- Deve retornar 15 linhas
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name NOT LIKE 'pg_%'
ORDER BY table_name;
```

**Resultado esperado:**
```
admin_logs
analytics_events
content
episodes
favorites
iptv_channels
iptv_favorites
my_list
notifications
profiles
reviews
seasons
system_settings
users
watch_history
```

### **Etapa 1.3: Executar Migration 002 (KV Store)**

**Arquivo:** `/supabase/migrations/002_create_kv_store.sql`

**O que cria:**
- ✅ Tabela `kv_store_2363f5d6` (cache)
- ✅ 3 índices
- ✅ Função `clean_expired_kv_entries()`

**Validação:**
```sql
-- Deve funcionar sem erro
SELECT COUNT(*) FROM kv_store_2363f5d6;
-- Resultado: 0 (tabela vazia)
```

### **Etapa 1.4: Verificar RLS Habilitado**

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true
ORDER BY tablename;
```

**Deve retornar 9 tabelas:**
- content
- favorites
- iptv_favorites
- my_list
- notifications
- profiles
- reviews
- users
- watch_history

---

## ⚡ FASE 2: EDGE FUNCTIONS (BACKEND)

### **Etapa 2.1: Configurar Service Role Key**

1. Acessar: https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/settings/api
2. Copiar `service_role` key
3. Ir para: **Edge Functions** → Settings → Secrets
4. Adicionar secret:
   - Nome: `SUPABASE_SERVICE_ROLE_KEY`
   - Valor: `[cole a key copiada]`

### **Etapa 2.2: Verificar Edge Functions Existentes**

**Funções já criadas:**
- ✅ `/supabase/functions/server/index.tsx` (servidor principal Hono)

**Rotas disponíveis:**
```
POST /make-server-2363f5d6/clear-image-cache
GET  /make-server-2363f5d6/image-cache-stats
GET  /make-server-2363f5d6/content-list
POST /make-server-2363f5d6/github-sync
GET  /make-server-2363f5d6/health
```

### **Etapa 2.3: Testar Edge Function**

```bash
curl https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/health \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw"
```

**Resposta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2024-11-19T..."
}
```

---

## 🎨 FASE 3: FRONTEND INTEGRATION

### **Etapa 3.1: Testar Conexão Básica**

Abrir console do navegador e executar:

```javascript
// Importar cliente
const { supabase } = await import('./utils/supabase/client.ts');

// Testar conexão
const { data, error } = await supabase.from('content').select('count');
console.log('Conexão OK:', data, error);
```

**Resultado esperado:**
```javascript
Conexão OK: [{ count: 0 }] null
```

### **Etapa 3.2: Criar Usuário de Teste**

```javascript
// Signup
const { data: signupData, error: signupError } = await supabase.auth.signUp({
  email: 'teste@redflix.com',
  password: 'senha123456',
  options: {
    data: {
      full_name: 'Usuário Teste'
    }
  }
});

console.log('Usuário criado:', signupData);
```

**IMPORTANTE:** Como não temos email configurado, o usuário será criado mas não confirmado. Vou criar uma função administrativa para confirmar.

### **Etapa 3.3: Testar Autenticação**

```javascript
// Login
const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
  email: 'teste@redflix.com',
  password: 'senha123456'
});

console.log('Login OK:', loginData);

// Obter sessão
const { data: sessionData } = await supabase.auth.getSession();
console.log('Sessão ativa:', sessionData.session?.user);
```

### **Etapa 3.4: Criar Perfil**

```javascript
// Obter user_id da sessão
const { data: { session } } = await supabase.auth.getSession();
const userId = session.user.id;

// Criar perfil
const { data: profile, error: profileError } = await supabase
  .from('profiles')
  .insert({
    user_id: userId,
    name: 'Perfil Principal',
    is_kids: false,
    age_rating: '18'
  })
  .select()
  .single();

console.log('Perfil criado:', profile);
```

### **Etapa 3.5: Inserir Conteúdo de Teste**

```javascript
// Inserir filme de teste
const { data: movie, error: movieError } = await supabase
  .from('content')
  .insert({
    id: 299536,
    tmdb_id: 299536,
    media_type: 'movie',
    title: 'Vingadores: Ultimato',
    overview: 'Após Thanos eliminar metade...',
    poster_path: '/q6725aR8wg0m4ESYB6npol4c0qT.jpg',
    release_date: '2019-04-24',
    vote_average: 8.3,
    genres: [{"id":28,"name":"Ação"}],
    has_stream: false
  })
  .select()
  .single();

console.log('Filme inserido:', movie);
```

**NOTA:** Isso só funciona se você for admin ou RLS permitir. Pode precisar de ajuste nas policies.

### **Etapa 3.6: Testar Minha Lista**

```javascript
// Obter profile_id do perfil criado
const profileId = profile.id;

// Adicionar à Minha Lista
const { data: myListItem, error: myListError } = await supabase
  .from('my_list')
  .insert({
    profile_id: profileId,
    content_id: 299536
  })
  .select()
  .single();

console.log('Adicionado à Minha Lista:', myListItem);

// Buscar Minha Lista
const { data: myList } = await supabase
  .from('my_list')
  .select('*, content(*)')
  .eq('profile_id', profileId);

console.log('Minha Lista:', myList);
```

---

## 🧪 FASE 4: TESTING & VALIDATION

### **Teste 1: RLS Policies (Segurança) 🔒**

```javascript
// Tentar acessar perfil de outro usuário (deve falhar)
const { data: otherProfiles } = await supabase
  .from('profiles')
  .select('*')
  .neq('user_id', session.user.id);

console.log('Perfis de outros usuários:', otherProfiles);
// Resultado esperado: [] (array vazio por causa do RLS)
```

### **Teste 2: Watch History (Progress Tracking)**

```javascript
// Salvar progresso
const { data: progress } = await supabase
  .from('watch_history')
  .upsert({
    profile_id: profileId,
    content_id: 299536,
    current_time: 3600, // 1 hora
    total_time: 10860   // 3h 1min
  })
  .select()
  .single();

console.log('Progresso salvo:', progress);
// Verificar se progress_percentage foi calculado automaticamente (trigger)
```

### **Teste 3: IPTV Channels**

```javascript
// Buscar canais IPTV (seed data)
const { data: channels } = await supabase
  .from('iptv_channels')
  .select('*')
  .order('sort_order');

console.log('Canais IPTV:', channels);
// Deve retornar os 6 canais do seed
```

### **Teste 4: Performance (Índices)**

```sql
-- No SQL Editor, verificar plano de query
EXPLAIN ANALYZE
SELECT * FROM content 
WHERE media_type = 'movie' 
AND is_featured = true
ORDER BY popularity DESC
LIMIT 10;

-- Deve usar índice (Index Scan), não Seq Scan
```

---

## 📚 FASE 5: DOCUMENTATION

### **Documentos Criados:**

1. ✅ `/FORMULARIO_COMPLETO_REDFLIX_SUPABASE.md` (especificação completa)
2. ✅ `/INTEGRACAO_SUPABASE_PLANO_COMPLETO.md` (este arquivo)
3. 🔄 `/DEPLOY_CHECKLIST.md` (será criado)
4. 🔄 `/TROUBLESHOOTING.md` (será criado)
5. 🔄 `/API_DOCUMENTATION.md` (será criado)

---

## 🔄 PLANO DE ROLLBACK

### **Cenário 1: Reverter Migrations**

```sql
-- ATENÇÃO: Isso apaga TODOS os dados!
-- Use apenas em caso de erro crítico

DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS admin_logs CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS iptv_favorites CASCADE;
DROP TABLE IF EXISTS iptv_channels CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS watch_history CASCADE;
DROP TABLE IF EXISTS favorites CASCADE;
DROP TABLE IF EXISTS my_list CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS seasons CASCADE;
DROP TABLE IF EXISTS content CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS system_settings CASCADE;
DROP TABLE IF EXISTS kv_store_2363f5d6 CASCADE;
```

### **Cenário 2: Backup Point-in-Time**

O Supabase oferece backups automáticos diários. Em caso de problema:

1. Acessar: Dashboard → Database → Backups
2. Escolher backup anterior à integração
3. Clicar em "Restore"

---

## ✅ CHECKLIST DE CONCLUSÃO

### **Database Setup:**
- [ ] Migration 001 aplicada (15 tabelas)
- [ ] Migration 002 aplicada (KV Store)
- [ ] RLS habilitado em 9 tabelas
- [ ] Seed data inserido (6 canais)
- [ ] Índices criados e funcionando

### **Backend Setup:**
- [ ] Service Role Key configurada
- [ ] Edge Functions testadas
- [ ] Endpoints respondendo
- [ ] Logs configurados

### **Frontend Setup:**
- [ ] Cliente Supabase conectado
- [ ] Auth funcionando (signup/login)
- [ ] Profiles criados e funcionando
- [ ] Minha Lista funcionando
- [ ] Watch History funcionando
- [ ] IPTV channels carregando

### **Security & Testing:**
- [ ] RLS policies testadas
- [ ] Usuários de teste criados
- [ ] Performance validada
- [ ] Logs sem erros críticos

### **Documentation:**
- [ ] README de deploy criado
- [ ] Troubleshooting guide criado
- [ ] API docs criada
- [ ] Logs de atividades entregues

---

## 📊 PRÓXIMOS PASSOS IMEDIATOS

### **AÇÃO REQUERIDA DO PROPRIETÁRIO:**

**Passo 1:** Aplicar Migrations (SQL Editor)
- Copiar conteúdo de `/supabase/migrations/001_create_redflix_schema.sql`
- Executar no SQL Editor
- Copiar conteúdo de `/supabase/migrations/002_create_kv_store.sql`
- Executar no SQL Editor

**Passo 2:** Configurar Service Role Key
- Copiar key de Settings → API
- Adicionar em Edge Functions → Secrets

**Passo 3:** Validar
- Executar testes do console
- Verificar se tudo funciona

---

## 📞 SUPORTE

**Em caso de problemas:**

1. Verificar logs: Dashboard → Logs → Database/Edge Functions
2. Consultar: `/TROUBLESHOOTING.md` (será criado)
3. Verificar status: https://status.supabase.com
4. Contato: fabriciocypreste@gmail.com

---

## 📝 LOG DE ATIVIDADES

**19/11/2024 - Setup Inicial**
- ✅ Autorização formal recebida
- ✅ Projeto Supabase configurado
- ✅ Credenciais atualizadas
- ✅ Plano de integração criado
- ⏳ Aguardando execução de migrations

---

**Status Geral:** ⚠️ **PRONTO PARA DEPLOY** (aguardando aplicação de migrations)

**Responsável:** AI Figma Make (autorizada por Fabricio Cunha Cypreste)  
**Última Atualização:** 19/11/2024
