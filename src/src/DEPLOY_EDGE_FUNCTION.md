# 🚀 DEPLOY DA EDGE FUNCTION

## ⚠️ IMPORTANTE:

A Edge Function já está **codificada** em `/supabase/functions/server/index.tsx`.

Agora você precisa fazer o **DEPLOY** dela para o Supabase.

---

## 📋 OPÇÕES DE DEPLOY:

### **OPÇÃO 1: Via Supabase CLI (RECOMENDADO)**

#### **1.1. Instalar Supabase CLI**

**No terminal:**
```bash
npm install -g supabase
```

Ou se você usa Homebrew (Mac):
```bash
brew install supabase/tap/supabase
```

---

#### **1.2. Fazer Login**

```bash
supabase login
```

Isso vai abrir seu navegador para você fazer login.

---

#### **1.3. Link com o projeto**

```bash
supabase link --project-ref glnmajvrxdwfyedsuaxx
```

Vai pedir sua senha do banco. Se não souber, pode pular este passo.

---

#### **1.4. Deploy da função**

```bash
supabase functions deploy make-server-2363f5d6 --project-ref glnmajvrxdwfyedsuaxx
```

**Resultado esperado:**
```
Deploying Function make-server-2363f5d6...
✅ Function deployed successfully!
URL: https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6
```

---

### **OPÇÃO 2: Via Dashboard (ALTERNATIVA)**

⚠️ **ATENÇÃO:** Esta opção pode ter limitações. Use a CLI se possível.

#### **2.1. Acesse Functions**

🔗 https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/functions

---

#### **2.2. Clique em "Create a new function"**

---

#### **2.3. Configurar a função**

- **Name:** `make-server-2363f5d6`
- **Editor:** Cole o conteúdo COMPLETO de `/supabase/functions/server/index.tsx`

---

#### **2.4. Adicionar os outros arquivos**

Você precisará adicionar também:
- `/supabase/functions/server/kv_store.tsx`
- `/supabase/functions/server/users.ts`
- `/supabase/functions/server/iptv.ts`
- `/supabase/functions/server/content.ts`
- `/supabase/functions/server/notifications.ts`
- `/supabase/functions/server/database_setup.tsx`

**PROBLEMA:** O dashboard pode não suportar múltiplos arquivos facilmente.

**SOLUÇÃO:** Use a **OPÇÃO 1 (CLI)** - é mais fácil!

---

## 🧪 TESTAR SE FUNCIONOU:

### **Teste 1: Health Check**

```bash
curl https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/health
```

**Resultado esperado:**
```json
{"status":"ok"}
```

---

### **Teste 2: TMDB API**

```bash
curl "https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/tmdb/trending/movie/day" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog"
```

**Resultado esperado:**
```json
{
  "results": [
    {"id": 123, "title": "Filme 1", ...},
    {"id": 456, "title": "Filme 2", ...}
  ]
}
```

---

### **Teste 3: Ver logs da função**

🔗 https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/functions/make-server-2363f5d6/logs

Se houver erros, os logs vão mostrar o que está acontecendo.

---

## 🚨 PROBLEMAS COMUNS:

### **Erro: "Function not found"**
- ✅ Verifique se o nome está correto: `make-server-2363f5d6`
- ✅ Verifique se o deploy foi bem-sucedido

### **Erro: "Environment variable not found"**
- ✅ Verifique se os secrets foram configurados em `/CONFIGURAR_SECRETS.md`

### **Erro: "Database connection failed"**
- ✅ Verifique se a tabela KV foi criada com `/SETUP_SUPABASE_MANUAL.sql`

---

## 📊 CHECKLIST COMPLETO:

- [ ] Instalei Supabase CLI
- [ ] Fiz login com `supabase login`
- [ ] Fiz deploy com `supabase functions deploy`
- [ ] Testei o endpoint `/health`
- [ ] Testei o endpoint `/tmdb/trending/movie/day`
- [ ] Verifiquei os logs

---

## 🆘 PRECISA DE AJUDA?

Se você tiver problemas, me forneça:
1. A mensagem de erro completa
2. Os logs da função (link acima)
3. O que você já tentou fazer

E eu te ajudo! 🚀
