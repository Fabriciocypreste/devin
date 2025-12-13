# ✅ DEPLOY CHECKLIST - REDFLIX SUPABASE

**Projeto:** vsztquvvnwlxdwyeoffh  
**Data:** 19/11/2024  
**Responsável:** Fabricio Cunha Cypreste

---

## 🎯 PRÉ-REQUISITOS

- [ ] Acesso ao Dashboard Supabase
- [ ] Credenciais ANON_KEY configuradas
- [ ] Arquivos de migration disponíveis
- [ ] Backup realizado (se houver dados existentes)

---

## 📋 FASE 1: DATABASE SETUP (30 minutos)

### **1.1 Acessar SQL Editor**
- [ ] Abrir: https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh
- [ ] Clicar em "SQL Editor" no menu lateral
- [ ] Clicar em "New Query"

### **1.2 Executar Migration 001**
- [ ] Abrir arquivo `/supabase/migrations/001_create_redflix_schema.sql`
- [ ] Copiar TODO o conteúdo (647 linhas)
- [ ] Colar no SQL Editor
- [ ] Clicar em "Run" (canto inferior direito)
- [ ] ✅ Aguardar mensagem "Success" (~5-10 segundos)

**Validação:**
```sql
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'users', 'profiles', 'content', 'seasons', 'episodes',
  'my_list', 'favorites', 'watch_history', 'reviews',
  'iptv_channels', 'iptv_favorites', 'notifications',
  'admin_logs', 'analytics_events', 'system_settings'
);
```
**Resultado esperado:** `count = 15`

### **1.3 Executar Migration 002**
- [ ] Nova query: "New Query"
- [ ] Abrir arquivo `/supabase/migrations/002_create_kv_store.sql`
- [ ] Copiar TODO o conteúdo (82 linhas)
- [ ] Colar no SQL Editor
- [ ] Clicar em "Run"
- [ ] ✅ Aguardar "Success" (~2 segundos)

**Validação:**
```sql
SELECT COUNT(*) FROM kv_store_2363f5d6;
```
**Resultado esperado:** `count = 0` (tabela vazia)

### **1.4 Verificar RLS Habilitado**
- [ ] Nova query
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```
**Resultado esperado:** 9 tabelas com `rowsecurity = t`

### **1.5 Verificar Seed Data**
- [ ] Nova query
```sql
SELECT name FROM iptv_channels ORDER BY sort_order;
```
**Resultado esperado:** 6 canais (Globo, SBT, Record, Band, RedeTV!, Cultura)

---

## 🔐 FASE 2: SECRETS & ENVIRONMENT (10 minutos)

### **2.1 Obter Service Role Key**
- [ ] Acessar: Settings → API
- [ ] Localizar "Project API keys"
- [ ] Copiar `service_role` key (⚠️ SECRETA!)
- [ ] **NÃO compartilhar publicamente**

### **2.2 Configurar Edge Functions Secrets**
- [ ] Ir para: Edge Functions → Settings → Secrets
- [ ] Clicar em "Add new secret"
- [ ] Nome: `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Valor: [colar a key copiada]
- [ ] Clicar em "Save"

### **2.3 Configurar TMDB API Key (se necessário)**
- [ ] Verificar se `TMDB_API_KEY` existe nos secrets
- [ ] Se não existir, adicionar:
  - Nome: `TMDB_API_KEY`
  - Valor: [sua key da TMDB]

### **2.4 Verificar Environment Variables**
- [ ] `SUPABASE_URL` → deve ser auto-configurada
- [ ] `SUPABASE_ANON_KEY` → deve ser auto-configurada
- [ ] `SUPABASE_SERVICE_ROLE_KEY` → configurada no passo 2.2
- [ ] `TMDB_API_KEY` → configurada no passo 2.3

---

## ⚡ FASE 3: EDGE FUNCTIONS (15 minutos)

### **3.1 Verificar Deploy Status**
- [ ] Ir para: Edge Functions
- [ ] Verificar se `make-server-2363f5d6` está listada
- [ ] Status deve ser "Active" ou "Deployed"

### **3.2 Testar Health Check**

**Método 1: Browser**
- [ ] Abrir: `https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/health`
- [ ] ✅ Deve retornar JSON com status "healthy"

**Método 2: cURL**
```bash
curl https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/health \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw"
```

### **3.3 Testar Cache Endpoints**
- [ ] Testar: `GET /image-cache-stats`
```bash
curl https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/image-cache-stats \
  -H "Authorization: Bearer [ANON_KEY]"
```
**Resultado esperado:** JSON com `cache: { totalEntries: 0 }`

- [ ] Testar: `POST /clear-image-cache`
```bash
curl -X POST https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/clear-image-cache \
  -H "Authorization: Bearer [ANON_KEY]"
```
**Resultado esperado:** JSON com `success: true, deletedCount: 0`

---

## 🎨 FASE 4: FRONTEND INTEGRATION (20 minutos)

### **4.1 Abrir Console do Navegador**
- [ ] Acessar: http://localhost:5173 (ou URL do seu projeto)
- [ ] Abrir DevTools (F12)
- [ ] Ir para aba "Console"

### **4.2 Testar Conexão Básica**
```javascript
// Copiar e colar no console
const { supabase } = await import('./utils/supabase/client.ts');
const { data, error } = await supabase.from('content').select('count');
console.log('✅ Conexão OK:', data, error);
```
**Resultado esperado:** `[{ count: 0 }]` com `error: null`

### **4.3 Criar Usuário de Teste**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'teste@redflix.com',
  password: 'TesteSenha123!',
  options: {
    data: {
      full_name: 'Usuário Teste RedFlix'
    }
  }
});
console.log('✅ Usuário criado:', data.user?.id);
```

### **4.4 Fazer Login**
```javascript
const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
  email: 'teste@redflix.com',
  password: 'TesteSenha123!'
});
console.log('✅ Login OK:', loginData.session?.access_token ? 'Autenticado' : 'Falhou');
```

### **4.5 Criar Perfil**
```javascript
const { data: { session } } = await supabase.auth.getSession();
const userId = session.user.id;

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

console.log('✅ Perfil criado:', profile.id);
```

### **4.6 Testar Minha Lista**
```javascript
// Primeiro, inserir um filme de teste (requer permissão admin ou RLS ajustada)
const { data: movie } = await supabase
  .from('content')
  .insert({
    id: 299536,
    tmdb_id: 299536,
    media_type: 'movie',
    title: 'Vingadores: Ultimato',
    overview: 'Teste',
    poster_path: '/poster.jpg',
    genres: [{"id":28,"name":"Ação"}],
    has_stream: false
  })
  .select()
  .single();

// Adicionar à Minha Lista
const { data: myListItem } = await supabase
  .from('my_list')
  .insert({
    profile_id: profile.id,
    content_id: 299536
  })
  .select()
  .single();

console.log('✅ Adicionado à Minha Lista:', myListItem.id);
```

---

## 🧪 FASE 5: SECURITY & VALIDATION (15 minutos)

### **5.1 Testar RLS (Row Level Security)**
```javascript
// Tentar acessar perfil de outro usuário (deve ser bloqueado)
const { data: otherProfiles } = await supabase
  .from('profiles')
  .select('*')
  .neq('user_id', session.user.id);

console.log('🔒 RLS Test:', otherProfiles.length === 0 ? '✅ Bloqueado corretamente' : '❌ FALHA DE SEGURANÇA');
```

### **5.2 Testar Watch History**
```javascript
const { data: progress } = await supabase
  .from('watch_history')
  .upsert({
    profile_id: profile.id,
    content_id: 299536,
    current_time: 3600,
    total_time: 7200
  })
  .select()
  .single();

console.log('✅ Progress tracking:', progress.progress_percentage + '%');
// Deve calcular automaticamente: 50%
```

### **5.3 Verificar Triggers**
```javascript
// O progress_percentage deve ser calculado automaticamente
const { data: history } = await supabase
  .from('watch_history')
  .select('*')
  .eq('profile_id', profile.id)
  .single();

console.log('✅ Trigger funcionando:', history.progress_percentage === 50 ? 'SIM' : 'NÃO');
```

### **5.4 Testar Performance (Query Plans)**

No SQL Editor:
```sql
EXPLAIN ANALYZE
SELECT * FROM content 
WHERE media_type = 'movie' 
AND is_featured = true
ORDER BY popularity DESC
LIMIT 10;
```
**Verificar:** Deve usar `Index Scan`, não `Seq Scan`

---

## 📊 FASE 6: MONITORING & LOGS (10 minutos)

### **6.1 Verificar Database Logs**
- [ ] Ir para: Logs → Database
- [ ] Verificar últimas queries
- [ ] ✅ Não deve haver erros críticos

### **6.2 Verificar Edge Functions Logs**
- [ ] Ir para: Edge Functions → Logs
- [ ] Filtrar: Últimas 24 horas
- [ ] ✅ Verificar status 200 nas requests

### **6.3 Verificar Auth Logs**
- [ ] Ir para: Auth → Logs
- [ ] ✅ Ver eventos de signup/signin

### **6.4 Storage Usage**
- [ ] Ir para: Settings → Usage
- [ ] Verificar:
  - Database size
  - Egress (bandwidth)
  - Edge Functions invocations
- [ ] ✅ Deve estar dentro do plano Free (500MB DB, 2GB egress)

---

## ✅ VALIDATION CHECKLIST

### **Database ✓**
- [ ] 15 tabelas criadas
- [ ] KV Store criada
- [ ] RLS habilitado em 9 tabelas
- [ ] Seed data presente (6 canais)
- [ ] Índices criados
- [ ] Triggers funcionando

### **Backend ✓**
- [ ] Service Role Key configurada
- [ ] Edge Functions respondendo
- [ ] Health check retorna 200
- [ ] Cache endpoints funcionando
- [ ] Logs sem erros

### **Frontend ✓**
- [ ] Conexão estabelecida
- [ ] Auth funcionando (signup/login)
- [ ] Perfis criando e listando
- [ ] Minha Lista funcionando
- [ ] Watch History tracking
- [ ] IPTV channels carregando

### **Security ✓**
- [ ] RLS bloqueando acessos não autorizados
- [ ] Service Role Key não exposta
- [ ] ANON_KEY funcionando corretamente
- [ ] Políticas testadas

### **Performance ✓**
- [ ] Índices sendo usados
- [ ] Queries < 200ms (p95)
- [ ] Edge Functions < 500ms
- [ ] Sem N+1 queries

---

## 🚨 ROLLBACK (Em caso de problemas)

### **Opção 1: Reverter Migrations**
```sql
-- ⚠️ ISSO APAGA TODOS OS DADOS!
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

### **Opção 2: Point-in-Time Recovery**
- [ ] Dashboard → Database → Backups
- [ ] Escolher backup anterior
- [ ] Clicar em "Restore"

---

## 📞 SUPORTE

**Em caso de problemas:**

1. ✅ Consultar: `/TROUBLESHOOTING.md`
2. ✅ Verificar: Dashboard → Logs
3. ✅ Status: https://status.supabase.com
4. ✅ Contato: fabriciocypreste@gmail.com

---

## 📝 CONCLUSÃO

Ao completar todos os checkboxes:

- [ ] ✅ **Deploy concluído com sucesso**
- [ ] ✅ **Todas as fases validadas**
- [ ] ✅ **Sem erros críticos**
- [ ] ✅ **Sistema em produção**

**Tempo total estimado:** 1h 30min

**Data de conclusão:** ___/___/______

**Responsável:** _______________________

**Assinatura:** _______________________

---

**Última atualização:** 19/11/2024  
**Versão:** 1.0
