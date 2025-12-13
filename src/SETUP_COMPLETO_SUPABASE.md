# 🎯 SETUP COMPLETO DO SUPABASE - GUIA MASTER

## ⚠️ AVISO IMPORTANTE SOBRE A CHAVE QUE VOCÊ FORNECEU:

A chave `3ae5cd2f65a90cbbab99725699f41fc81955d2f3edb3af464cc7ef296118b666` **NÃO É A CORRETA!**

- ❌ Não é um JWT (não começa com `eyJ`)
- ❌ Não é a SERVICE_ROLE_KEY que precisamos
- ✅ Você precisa encontrar a chave que **começa com** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`

---

## 📋 CHECKLIST COMPLETO (3 PASSOS):

### ✅ **PASSO 1: Criar tabela KV no banco**

**Tempo:** 2 minutos

1. 🔗 **Acesse:** https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/sql/new
2. 📄 **Abra:** `/SETUP_SUPABASE_MANUAL.sql`
3. 📋 **Copie:** Todo o conteúdo do arquivo
4. 📝 **Cole:** No SQL Editor do Supabase
5. ▶️ **Clique:** "Run" ou "Execute"
6. ✅ **Verifique:** Se apareceu "Tabela KV criada com sucesso!"

---

### ✅ **PASSO 2: Configurar Secrets da Edge Function**

**Tempo:** 5 minutos

1. 🔗 **Acesse:** https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/functions
2. 📄 **Abra:** `/CONFIGURAR_SECRETS.md`
3. 🔑 **Adicione os 4 secrets:**
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **VOCÊ PRECISA COPIAR DO DASHBOARD!**
   - `TMDB_API_KEY`

**⚠️ IMPORTANTE:** Para o `SUPABASE_SERVICE_ROLE_KEY`:
1. Acesse: https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api
2. Procure por "**service_role key**"
3. Clique em "**Reveal**" ou "**👁️**"
4. Copie a chave **INTEIRA** (é muito longa!)
5. Cole no campo "Value" do secret

---

### ✅ **PASSO 3: Deploy da Edge Function**

**Tempo:** 10 minutos

1. 📄 **Abra:** `/DEPLOY_EDGE_FUNCTION.md`
2. 📝 **Siga:** As instruções da **OPÇÃO 1 (CLI)**

**Comandos resumidos:**
```bash
# Instalar CLI
npm install -g supabase

# Login
supabase login

# Deploy
supabase functions deploy make-server-2363f5d6 --project-ref glnmajvrxdwfyedsuaxx
```

---

## 🧪 TESTAR TUDO:

### **Teste 1: Health Check**
```bash
curl https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/health
```

**Resultado esperado:** `{"status":"ok"}`

---

### **Teste 2: TMDB API**
```bash
curl "https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/tmdb/trending/movie/day" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog"
```

**Resultado esperado:** JSON com lista de filmes

---

### **Teste 3: KV Store**
```bash
curl -X POST "https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/kv/set" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog" \
  -H "Content-Type: application/json" \
  -d '{"key":"test","value":"funcionou!"}'
```

**Resultado esperado:** `{"success":true}`

---

## 📊 RESUMO VISUAL:

```
SETUP COMPLETO (3 PASSOS):

┌─────────────────────────────────────────┐
│ PASSO 1: Criar tabela KV               │
│ ────────────────────────────────────   │
│ ✅ Executar SQL                        │
│ ⏱️  2 minutos                           │
│ 📄 /SETUP_SUPABASE_MANUAL.sql          │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ PASSO 2: Configurar Secrets            │
│ ────────────────────────────────────   │
│ ✅ Adicionar 4 secrets                 │
│ ⏱️  5 minutos                           │
│ 📄 /CONFIGURAR_SECRETS.md              │
│ ⚠️  SERVICE_ROLE_KEY obrigatória!      │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ PASSO 3: Deploy Edge Function          │
│ ────────────────────────────────────   │
│ ✅ Usar Supabase CLI                   │
│ ⏱️  10 minutos                          │
│ 📄 /DEPLOY_EDGE_FUNCTION.md            │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ ✅ TUDO CONECTADO!                     │
│ ────────────────────────────────────   │
│ 🧪 Testar endpoints                    │
│ 🎉 Começar a usar!                     │
└─────────────────────────────────────────┘
```

---

## 🚨 O QUE VOCÊ PRECISA FAZER AGORA:

### **1️⃣ URGENTE - ENCONTRAR A SERVICE_ROLE_KEY CORRETA:**

🔗 **Acesse:** https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api

**Procure por:**
```
┌─────────────────────────────────────────┐
│ Project API keys                        │
│                                         │
│ service_role                            │
│ Used for privileged access              │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC... │ ← ESTA!
│ [👁️ Reveal]                            │
└─────────────────────────────────────────┘
```

**Clique em "Reveal" e copie a chave INTEIRA!**

---

### **2️⃣ EXECUTAR OS 3 PASSOS ACIMA:**

1. ✅ Criar tabela KV (2 min)
2. ✅ Configurar Secrets (5 min)
3. ✅ Deploy Edge Function (10 min)

**Total: ~17 minutos**

---

## 📚 ARQUIVOS CRIADOS PARA VOCÊ:

```
SETUP MANUAL:
├─ /SETUP_SUPABASE_MANUAL.sql ⭐ SQL para criar tabela
├─ /CONFIGURAR_SECRETS.md ⭐ Como adicionar secrets
└─ /DEPLOY_EDGE_FUNCTION.md ⭐ Como fazer deploy

GUIAS COMPLETOS:
├─ /COMO_CONECTAR_SUPABASE_AGORA.md
└─ /SETUP_COMPLETO_SUPABASE.md (este arquivo)

EMAILS PARA FIGMA (se precisar):
├─ /EMAIL_DEFINITIVO_FIGMA.md
├─ /EMAIL_COMPACTO_FIGMA.md
├─ /EMAIL_FINAL_FIGMA_PORTUGUES.md
└─ /EMAIL_FINAL_FIGMA_ENGLISH.md
```

---

## 🆘 PRECISA DE AJUDA?

**Se você tiver dúvidas, me forneça:**
1. ✅ A SERVICE_ROLE_KEY correta (começa com `eyJhbG...`)
2. ✅ Print da mensagem de erro (se houver)
3. ✅ Qual passo você está tentando fazer

**E eu te ajudo imediatamente! 🚀**

---

## 🎯 PRÓXIMO PASSO:

**ME FORNEÇA A SERVICE_ROLE_KEY CORRETA** e eu te guio no resto do processo!

Ou comece executando o **PASSO 1** (criar tabela KV) que não precisa da service_role_key!
