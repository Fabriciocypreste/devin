# 🔧 TROUBLESHOOTING GUIDE - REDFLIX SUPABASE

**Projeto:** vsztquvvnwlxdwyeoffh  
**Última atualização:** 19/11/2024

---

## 📋 ÍNDICE

1. [Erros de Conexão](#erros-de-conexão)
2. [Erros de Autenticação](#erros-de-autenticação)
3. [Erros de RLS (Permissões)](#erros-de-rls)
4. [Erros de Edge Functions](#erros-de-edge-functions)
5. [Erros de Migrations](#erros-de-migrations)
6. [Problemas de Performance](#problemas-de-performance)
7. [Erros de Cache](#erros-de-cache)
8. [Problemas Comuns](#problemas-comuns)

---

## 🔌 ERROS DE CONEXÃO

### **Erro: "Failed to fetch" ou "Network error"**

**Sintomas:**
```
TypeError: Failed to fetch
    at fetch (...)
```

**Causas possíveis:**
1. ❌ URL do Supabase incorreta
2. ❌ Projeto pausado/suspenso
3. ❌ Problema de CORS
4. ❌ Firewall/bloqueio de rede

**Soluções:**

**1. Verificar URL:**
```javascript
// No console
console.log('URL:', import.meta.env.NEXT_PUBLIC_SUPABASE_URL);
// Deve ser: https://vsztquvvnwlxdwyeoffh.supabase.co
```

**2. Verificar Status do Projeto:**
- Acessar: https://supabase.com/dashboard
- Verificar se projeto está "Active"
- Se pausado, clicar em "Resume"

**3. Testar Conexão Direta:**
```bash
curl https://vsztquvvnwlxdwyeoffh.supabase.co
# Deve retornar HTML da página do Supabase
```

**4. Verificar CORS (Edge Functions):**
```typescript
// Em /supabase/functions/server/index.tsx
app.use('*', cors({
  origin: '*', // Ou domínio específico
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
```

---

### **Erro: "Invalid API key"**

**Sintomas:**
```json
{
  "message": "Invalid API key",
  "code": "invalid_api_key"
}
```

**Solução:**
```javascript
// Verificar se ANON_KEY está correta
import { publicAnonKey } from './utils/supabase/info';
console.log('Key:', publicAnonKey.substring(0, 20) + '...');

// Comparar com o Dashboard:
// Settings → API → anon public key
```

**Corrigir:**
1. Copiar key correta do Dashboard
2. Atualizar `/utils/supabase/info.tsx`
3. Reiniciar aplicação

---

## 🔐 ERROS DE AUTENTICAÇÃO

### **Erro: "Email not confirmed"**

**Sintomas:**
```json
{
  "message": "Email not confirmed",
  "code": "email_not_confirmed"
}
```

**Causa:** Supabase esperando confirmação de email, mas não há servidor SMTP configurado.

**Solução (Ambiente de Teste):**

**Opção 1: Confirmar manualmente via SQL**
```sql
-- No SQL Editor
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'teste@redflix.com';
```

**Opção 2: Desabilitar confirmação (⚠️ apenas dev)**
```sql
-- Settings → Auth → Email Auth → Confirm Email
-- Desmarcar opção
```

**Opção 3: Usar admin.createUser (recomendado)**
```javascript
// No Edge Function com service_role
const { data, error } = await supabase.auth.admin.createUser({
  email: 'teste@redflix.com',
  password: 'senha123',
  email_confirm: true, // ✅ Já confirmado
  user_metadata: {
    full_name: 'Teste'
  }
});
```

---

### **Erro: "Invalid login credentials"**

**Sintomas:**
```json
{
  "message": "Invalid login credentials",
  "code": "invalid_credentials"
}
```

**Checklist:**
1. ✅ Email está correto?
2. ✅ Senha está correta? (mínimo 6 caracteres)
3. ✅ Usuário foi criado?
4. ✅ Email foi confirmado?

**Verificar no SQL:**
```sql
SELECT id, email, email_confirmed_at, created_at 
FROM auth.users 
WHERE email = 'teste@redflix.com';
```

**Se usuário não existe:**
```javascript
const { data, error } = await supabase.auth.signUp({
  email: 'teste@redflix.com',
  password: 'SenhaForte123!'
});
```

---

### **Erro: "User already registered"**

**Sintomas:**
```json
{
  "message": "User already registered",
  "code": "user_already_exists"
}
```

**Solução:** Use `signIn` em vez de `signUp`:
```javascript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'teste@redflix.com',
  password: 'senha123'
});
```

---

## 🔒 ERROS DE RLS (Row Level Security)

### **Erro: "new row violates row-level security policy"**

**Sintomas:**
```
ERROR: new row violates row-level security policy for table "profiles"
```

**Causa:** RLS está bloqueando a operação porque você não tem permissão.

**Diagnóstico:**
```sql
-- Ver políticas da tabela
SELECT * FROM pg_policies WHERE tablename = 'profiles';
```

**Soluções:**

**1. Autenticar-se primeiro:**
```javascript
// Verificar se está autenticado
const { data: { session } } = await supabase.auth.getSession();
console.log('Autenticado?', !!session);

// Se não estiver, fazer login
await supabase.auth.signInWithPassword({...});
```

**2. Verificar se user_id é o correto:**
```javascript
const { data: { user } } = await supabase.auth.getUser();
console.log('User ID:', user.id);

// Usar esse ID ao inserir
const { data } = await supabase
  .from('profiles')
  .insert({
    user_id: user.id, // ✅ Seu próprio ID
    name: 'Perfil'
  });
```

**3. Bypass RLS (apenas para testes, com service_role):**
```javascript
// ⚠️ Apenas no backend/Edge Functions!
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  'https://vsztquvvnwlxdwyeoffh.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service_role bypassa RLS
);

// Agora pode inserir sem RLS
const { data } = await supabaseAdmin.from('profiles').insert({...});
```

---

### **Erro: "permission denied for table"**

**Sintomas:**
```
ERROR: permission denied for table "content"
```

**Causa:** Tabela não tem política RLS adequada.

**Verificar:**
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'content';
-- rowsecurity deve ser 't' (true)

SELECT * FROM pg_policies WHERE tablename = 'content';
-- Deve ter pelo menos uma policy
```

**Adicionar política (se necessário):**
```sql
-- Permitir leitura pública de conteúdo
CREATE POLICY "Public can read content"
ON content FOR SELECT
USING (true);

-- Apenas admins podem inserir
CREATE POLICY "Only admins can insert content"
ON content FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.is_admin = true
  )
);
```

---

## ⚡ ERROS DE EDGE FUNCTIONS

### **Erro: "Function not found"**

**Sintomas:**
```json
{
  "message": "Function not found",
  "code": "function_not_found"
}
```

**Verificar:**
```bash
# Testar URL diretamente
curl https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/health

# Se retornar 404, function não está deployed
```

**Solução:**
1. Dashboard → Edge Functions
2. Verificar se `make-server-2363f5d6` está listada
3. Se não estiver, fazer deploy manual (não disponível no Figma Make)

---

### **Erro: "Internal Server Error" (500)**

**Sintomas:**
```json
{
  "message": "Internal server error"
}
```

**Diagnóstico:**
1. Dashboard → Edge Functions → Logs
2. Filtrar por função: `make-server-2363f5d6`
3. Procurar por stack traces

**Causas comuns:**

**1. Variável de ambiente faltando:**
```typescript
// No código da function
const apiKey = Deno.env.get('TMDB_API_KEY');
if (!apiKey) {
  throw new Error('TMDB_API_KEY not configured');
}
```

**Solução:** Configurar em Edge Functions → Settings → Secrets

**2. Tabela não existe:**
```typescript
// Erro: relation "kv_store_2363f5d6" does not exist
```

**Solução:** Aplicar migrations via SQL Editor

**3. Permissões (service_role):**
```typescript
// Usar service_role para bypass RLS
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
```

---

### **Erro: "Function timeout"**

**Sintomas:**
```
Function execution timed out
```

**Causa:** Função levou mais de 60s (limite Supabase Free)

**Soluções:**

**1. Otimizar query:**
```typescript
// ❌ Lento
const all = await supabase.from('content').select('*');
const filtered = all.data.filter(x => x.media_type === 'movie');

// ✅ Rápido
const filtered = await supabase
  .from('content')
  .select('*')
  .eq('media_type', 'movie')
  .limit(100);
```

**2. Adicionar timeout nas requests externas:**
```typescript
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000); // 5s

const response = await fetch(url, { 
  signal: controller.signal 
});
clearTimeout(timeout);
```

**3. Dividir em batches:**
```typescript
// Processar em lotes de 100
for (let i = 0; i < items.length; i += 100) {
  const batch = items.slice(i, i + 100);
  await processBatch(batch);
}
```

---

## 📊 ERROS DE MIGRATIONS

### **Erro: "relation already exists"**

**Sintomas:**
```
ERROR: relation "users" already exists
```

**Causa:** Migration já foi aplicada anteriormente.

**Solução 1: Ignorar (se tabela já existe)**
```sql
-- Usar IF NOT EXISTS
CREATE TABLE IF NOT EXISTS users (...);
```

**Solução 2: Reverter e reaplicar**
```sql
-- ⚠️ Isso apaga dados!
DROP TABLE IF EXISTS users CASCADE;

-- Depois aplicar migration novamente
```

---

### **Erro: "constraint violation"**

**Sintomas:**
```
ERROR: duplicate key value violates unique constraint "profiles_user_id_key"
```

**Causa:** Tentando inserir dado que viola constraint (UNIQUE, FOREIGN KEY, CHECK)

**Diagnóstico:**
```sql
-- Ver constraints da tabela
SELECT * FROM information_schema.table_constraints 
WHERE table_name = 'profiles';
```

**Soluções:**

**1. UNIQUE violation:**
```javascript
// Use upsert em vez de insert
const { data } = await supabase
  .from('profiles')
  .upsert({ user_id: userId, name: 'Perfil' })
  .select();
```

**2. FOREIGN KEY violation:**
```javascript
// Verificar se user_id existe antes de inserir perfil
const { data: user } = await supabase
  .from('users')
  .select('id')
  .eq('id', userId)
  .single();

if (!user) {
  console.error('Usuário não existe!');
}
```

**3. CHECK constraint violation:**
```sql
-- Ver a constraint
SELECT * FROM information_schema.check_constraints 
WHERE constraint_name LIKE '%profiles%';

-- Ajustar os dados para passar na validação
```

---

## 🐌 PROBLEMAS DE PERFORMANCE

### **Queries lentas (> 1s)**

**Diagnóstico:**
```sql
-- Analisar plano de execução
EXPLAIN ANALYZE
SELECT * FROM content 
WHERE media_type = 'movie' 
AND is_featured = true;
```

**Identificar problemas:**
- ❌ `Seq Scan` = Ruim (varredura completa)
- ✅ `Index Scan` = Bom (usando índice)

**Soluções:**

**1. Criar índice:**
```sql
CREATE INDEX IF NOT EXISTS idx_content_media_type_featured 
ON content(media_type, is_featured) 
WHERE is_featured = true;
```

**2. Limitar resultados:**
```javascript
const { data } = await supabase
  .from('content')
  .select('*')
  .eq('media_type', 'movie')
  .limit(20); // ✅ Apenas 20 resultados
```

**3. Selecionar apenas colunas necessárias:**
```javascript
// ❌ Lento (traz tudo)
const { data } = await supabase.from('content').select('*');

// ✅ Rápido (apenas o necessário)
const { data } = await supabase
  .from('content')
  .select('id, title, poster_path');
```

---

### **N+1 Query Problem**

**Sintoma:** Fazer 1 query para lista, depois 1 query para cada item

```javascript
// ❌ N+1 problem
const profiles = await supabase.from('profiles').select('*');
for (const profile of profiles.data) {
  const myList = await supabase
    .from('my_list')
    .select('*')
    .eq('profile_id', profile.id); // N queries!
}
```

**Solução:** Usar JOIN ou batch query
```javascript
// ✅ Uma única query com JOIN
const { data } = await supabase
  .from('profiles')
  .select(`
    *,
    my_list (*)
  `);
```

---

## 💾 ERROS DE CACHE

### **Erro: "Cache not available"**

**Sintomas:**
```
⚠️ Cache stats unavailable: relation "kv_store_2363f5d6" does not exist
```

**Causa:** Tabela KV não foi criada (migration 002 não aplicada)

**Solução:**
```sql
-- Aplicar migration 002
-- Copiar conteúdo de /supabase/migrations/002_create_kv_store.sql
-- Executar no SQL Editor
```

**Verificar:**
```sql
SELECT COUNT(*) FROM kv_store_2363f5d6;
-- Deve funcionar (retornar 0 se vazia)
```

---

### **Cache corrompido**

**Sintomas:**
```
JSON parse error: Unexpected token
```

**Solução:** Limpar cache
```sql
DELETE FROM kv_store_2363f5d6 WHERE key LIKE 'tmdb-image-%';
```

---

## 🔧 PROBLEMAS COMUNS

### **1. Imagens não carregam (404)**

**Causa:** URLs do TMDB sem base URL

**Solução:**
```javascript
// ❌ Errado
<img src="/w500/poster.jpg" />

// ✅ Correto
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
<img src={`${TMDB_IMAGE_BASE}/w500${posterPath}`} />
```

---

### **2. Perfis não aparecem após login**

**Diagnóstico:**
```javascript
const { data: { session } } = await supabase.auth.getSession();
console.log('User ID:', session?.user?.id);

const { data: profiles } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', session.user.id);

console.log('Perfis encontrados:', profiles);
```

**Causa comum:** user_id errado no insert

**Solução:**
```javascript
// Sempre usar session.user.id
const { data: { user } } = await supabase.auth.getUser();
await supabase.from('profiles').insert({
  user_id: user.id, // ✅ Correto
  name: 'Perfil'
});
```

---

### **3. "Minha Lista" não salva**

**Diagnóstico:**
```javascript
try {
  const { data, error } = await supabase
    .from('my_list')
    .insert({
      profile_id: profileId,
      content_id: contentId
    });
  
  if (error) throw error;
  console.log('✅ Salvo:', data);
} catch (error) {
  console.error('❌ Erro:', error.message);
}
```

**Causas comuns:**
1. `profile_id` inválido
2. `content_id` não existe em `content`
3. Já existe (UNIQUE constraint)

**Solução para duplicatas:**
```javascript
// Usar upsert ou verificar antes
const { data: existing } = await supabase
  .from('my_list')
  .select('id')
  .eq('profile_id', profileId)
  .eq('content_id', contentId)
  .single();

if (!existing) {
  await supabase.from('my_list').insert({...});
}
```

---

### **4. Watch History não atualiza progress**

**Causa:** Trigger não está funcionando

**Verificar:**
```sql
-- Ver triggers da tabela
SELECT * FROM information_schema.triggers 
WHERE event_object_table = 'watch_history';
```

**Solução:** Recriar trigger
```sql
-- Dropar e recriar (está na migration 001)
DROP TRIGGER IF EXISTS calculate_progress ON watch_history;

CREATE TRIGGER calculate_progress
BEFORE INSERT OR UPDATE ON watch_history
FOR EACH ROW
EXECUTE FUNCTION calculate_progress_percentage();
```

---

## 📞 QUANDO PEDIR AJUDA

Se nenhuma solução acima funcionou:

1. ✅ Coletar informações:
   - Mensagem de erro completa
   - Stack trace (se houver)
   - Código que causou o erro
   - Logs do Dashboard

2. ✅ Verificar:
   - Dashboard → Logs (Database, Edge Functions, Auth)
   - Status: https://status.supabase.com
   - Documentação: https://supabase.com/docs

3. ✅ Contato:
   - Email: fabriciocypreste@gmail.com
   - Supabase Discord: https://discord.supabase.com

---

## 🎯 COMANDOS ÚTEIS

### **Verificação Rápida (SQL)**
```sql
-- Ver todas as tabelas
\dt

-- Ver tamanho do banco
SELECT pg_size_pretty(pg_database_size('postgres'));

-- Ver queries lentas
SELECT * FROM pg_stat_statements 
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- Ver conexões ativas
SELECT * FROM pg_stat_activity;

-- Limpar cache
DELETE FROM kv_store_2363f5d6 WHERE expires_at < NOW();
```

### **Verificação Rápida (Console)**
```javascript
// Testar conexão
const { data, error } = await supabase.from('users').select('count');

// Ver sessão
const { data: { session } } = await supabase.auth.getSession();

// Fazer logout
await supabase.auth.signOut();

// Limpar storage local
localStorage.clear();
```

---

**Última atualização:** 19/11/2024  
**Versão:** 1.0
