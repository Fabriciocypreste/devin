# 🎬 GUIA COMPLETO - SETUP REDFLIX + SUPABASE

## ✅ STATUS ATUAL:

```
╔════════════════════════════════════════════════════════╗
║  TODAS AS CHAVES RECEBIDAS E CONFIGURADAS!            ║
╚════════════════════════════════════════════════════════╝

✅ Project ID:        vsztquvvnwlxdwyeoffh
✅ Project URL:       https://vsztquvvnwlxdwyeoffh.supabase.co
✅ ANON_KEY:          Configurada ✅
✅ SERVICE_ROLE_KEY:  Configurada ✅
✅ TMDB_API_KEY:      Configurada ✅
✅ /utils/supabase/info.tsx: Atualizado ✅
```

---

## 🎯 PRÓXIMOS 3 PASSOS (17 MINUTOS TOTAL):

```
┌─────────────────────────────────────────────┐
│ PASSO 1: Criar tabela KV no banco          │
│ ⏱️  2 minutos                                │
│ 📄 /PASSO_1_CRIAR_TABELA_KV.sql            │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ PASSO 2: Configurar Secrets                │
│ ⏱️  5 minutos                                │
│ 📄 /PASSO_2_CONFIGURAR_SECRETS.md          │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ PASSO 3: Deploy Edge Function              │
│ ⏱️  10 minutos                               │
│ 📄 /PASSO_3_DEPLOY_EDGE_FUNCTION.md        │
└─────────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────────┐
│ PASSO 4: Testar tudo                       │
│ ⏱️  5 minutos                                │
│ 📄 /PASSO_4_TESTAR_APLICACAO.md            │
└─────────────────────────────────────────────┘
```

---

## 📋 PASSO 1: CRIAR TABELA KV (2 MIN)

### **1.1. Acesse o SQL Editor:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/sql/new

### **1.2. Abra o arquivo:**
📄 `/PASSO_1_CRIAR_TABELA_KV.sql`

### **1.3. Copie TODO o conteúdo**

### **1.4. Cole no SQL Editor**

### **1.5. Clique em "Run" ou "Execute"**

### **1.6. Verifique se apareceu:**
```
✅ TABELA KV CRIADA COM SUCESSO!
total_entries: 3
```

---

## 🔐 PASSO 2: CONFIGURAR SECRETS (5 MIN)

### **2.1. Acesse:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/settings/functions

### **2.2. Procure por "Secrets" ou "Environment Variables"**

### **2.3. Adicione os 4 secrets:**

**Clique em "[+ Add Secret]" 4 vezes:**

```
1️⃣ Name:  SUPABASE_URL
   Value: https://vsztquvvnwlxdwyeoffh.supabase.co

2️⃣ Name:  SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw

3️⃣ Name:  SUPABASE_SERVICE_ROLE_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUzMDc0MCwiZXhwIjoyMDc5MTA2NzQwfQ.O0ul8YbFj_0umjce0eWxX0xrTz8i-Fs9q1f-fzqxKCo

4️⃣ Name:  TMDB_API_KEY
   Value: ddb1bdf6aa91bdf335797853884b0c1d
```

**Detalhes:** `/PASSO_2_CONFIGURAR_SECRETS.md`

---

## 🚀 PASSO 3: DEPLOY EDGE FUNCTION (10 MIN)

### **3.1. Instalar Supabase CLI:**
```bash
npm install -g supabase
```

### **3.2. Fazer login:**
```bash
supabase login
```

### **3.3. Deploy:**
```bash
supabase functions deploy make-server-2363f5d6 --project-ref vsztquvvnwlxdwyeoffh
```

**Resultado esperado:**
```
✔ Function make-server-2363f5d6 deployed successfully!
https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6
```

**Detalhes:** `/PASSO_3_DEPLOY_EDGE_FUNCTION.md`

---

## 🧪 PASSO 4: TESTAR TUDO (5 MIN)

### **Teste 1: Health Check**
```bash
curl https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/health
```
**Esperado:** `{"status":"ok"}`

---

### **Teste 2: TMDB API**
```bash
curl "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/tmdb/trending/movie/day" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw"
```
**Esperado:** JSON com lista de filmes

---

### **Teste 3: KV Store**
```bash
curl -X POST "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/kv/set" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw" \
  -H "Content-Type: application/json" \
  -d '{"key":"redflix:test","value":"🎬 RedFlix conectado!"}'
```
**Esperado:** `{"success":true}`

**Detalhes:** `/PASSO_4_TESTAR_APLICACAO.md`

---

## 📊 CHECKLIST COMPLETO:

### **✅ Configuração Inicial:**
- [x] ✅ ANON_KEY recebida
- [x] ✅ SERVICE_ROLE_KEY recebida
- [x] ✅ `/utils/supabase/info.tsx` atualizado

### **Setup (fazer agora):**
- [ ] Executar SQL para criar tabela KV
- [ ] Adicionar 4 secrets na Edge Function
- [ ] Instalar Supabase CLI
- [ ] Fazer deploy da Edge Function

### **Testes:**
- [ ] Testar `/health` → `{"status":"ok"}`
- [ ] Testar `/tmdb/trending/movie/day` → JSON com filmes
- [ ] Testar `/kv/set` e `/kv/get` → Dados salvos
- [ ] Abrir a aplicação e testar UI

---

## 🎯 INFORMAÇÕES DO PROJETO:

```
Project ID:   vsztquvvnwlxdwyeoffh
Project URL:  https://vsztquvvnwlxdwyeoffh.supabase.co

Dashboard:
https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh

SQL Editor:
https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/sql/new

Functions:
https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/settings/functions

Function Logs:
https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/functions/make-server-2363f5d6/logs

Database:
https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/editor
```

---

## 📚 ARQUIVOS CRIADOS:

### **Guias Passo a Passo:**
1. `/PASSO_1_CRIAR_TABELA_KV.sql` ⭐ - SQL pronto
2. `/PASSO_2_CONFIGURAR_SECRETS.md` ⭐ - Secrets
3. `/PASSO_3_DEPLOY_EDGE_FUNCTION.md` ⭐ - Deploy
4. `/PASSO_4_TESTAR_APLICACAO.md` ⭐ - Testes

### **Guia Master:**
5. `/GUIA_COMPLETO_SETUP_REDFLIX.md` ⭐⭐⭐ - Este arquivo

### **Outros:**
- `/SETUP_FINAL_SUPABASE.md` - Resumo técnico
- `/PEGAR_ANON_KEY.md` - Como pegar chaves
- `/ONDE_ENCONTRAR_CHAVE_SUPABASE_CORRETA.md` - Guia de chaves

---

## ⏱️ TEMPO TOTAL ESTIMADO:

```
Passo 1: Criar tabela KV        →  2 min
Passo 2: Configurar secrets     →  5 min
Passo 3: Deploy Edge Function   → 10 min
Passo 4: Testar                 →  5 min
─────────────────────────────────────────
TOTAL                           → 22 min
```

---

## 🚀 COMECE AGORA:

### **1️⃣ Abra o primeiro arquivo:**
📄 `/PASSO_1_CRIAR_TABELA_KV.sql`

### **2️⃣ Acesse o SQL Editor:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/sql/new

### **3️⃣ Execute o SQL**

### **4️⃣ Vá para o Passo 2**

---

## 🆘 PRECISA DE AJUDA?

**Se algo não funcionar:**
1. Veja os logs da função (link acima)
2. Veja o console do navegador (F12)
3. Me envie a mensagem de erro
4. Me diga qual passo você está

**E eu te ajudo imediatamente! 🚀**

---

## 🎉 DEPOIS DO SETUP:

```
╔══════════════════════════════════════════╗
║  🎬 REDFLIX TOTALMENTE CONECTADO!       ║
╚══════════════════════════════════════════╝

✅ 80+ funcionalidades ativas
✅ Sistema de login/perfis
✅ Dashboard completo
✅ Página Kids com jogos
✅ Sistema IPTV
✅ Busca avançada
✅ Player universal
✅ Integração TMDB
✅ Backend Supabase

🍿 Aproveite o RedFlix! 🎬
```

---

**COMECE PELO PASSO 1! 🎯**
