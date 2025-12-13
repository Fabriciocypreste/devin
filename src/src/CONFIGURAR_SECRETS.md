# 🔐 CONFIGURAR SECRETS DA EDGE FUNCTION

## 📍 ONDE FAZER:

🔗 https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/functions

---

## 🔑 SECRETS QUE VOCÊ PRECISA ADICIONAR:

### **1. SUPABASE_URL**
```
https://glnmajvrxdwfyedsuaxx.supabase.co
```

### **2. SUPABASE_ANON_KEY**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog
```

### **3. SUPABASE_SERVICE_ROLE_KEY**
```
<VOCÊ PRECISA COPIAR DO DASHBOARD>
```

**Onde encontrar:**
1. Acesse: https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api
2. Procure por "service_role key"
3. Clique em "Reveal" ou "👁️"
4. Copie a chave INTEIRA
5. Cole no campo "Value" do secret

### **4. TMDB_API_KEY**
```
ddb1bdf6aa91bdf335797853884b0c1d
```

---

## 📋 PASSO A PASSO:

### **1. Acesse a página de Functions**
🔗 https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/functions

### **2. Procure por "Secrets" ou "Environment Variables"**

Você verá algo assim:

```
┌──────────────────────────────────────────┐
│ Function Secrets                         │
│                                          │
│ [+ Add Secret]                           │
│                                          │
│ Name              Value                  │
│ ──────────────────────────────────────── │
│                                          │
└──────────────────────────────────────────┘
```

### **3. Clique em "[+ Add Secret]" 4 vezes**

**Secret 1:**
- Name: `SUPABASE_URL`
- Value: `https://glnmajvrxdwfyedsuaxx.supabase.co`
- [Save]

**Secret 2:**
- Name: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog`
- [Save]

**Secret 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `<COLE AQUI A SERVICE_ROLE_KEY QUE VOCÊ COPIOU>`
- [Save]

**Secret 4:**
- Name: `TMDB_API_KEY`
- Value: `ddb1bdf6aa91bdf335797853884b0c1d`
- [Save]

---

## ✅ VERIFICAR SE FUNCIONOU:

Após adicionar todos os secrets, você deve ver:

```
┌──────────────────────────────────────────┐
│ Function Secrets                         │
│                                          │
│ Name                      Value          │
│ ──────────────────────────────────────── │
│ SUPABASE_URL              https://gl...  │
│ SUPABASE_ANON_KEY         eyJhbGci...   │
│ SUPABASE_SERVICE_ROLE_KEY eyJhbGci...   │
│ TMDB_API_KEY              ddb1bdf6...   │
└──────────────────────────────────────────┘
```

---

## 🚨 IMPORTANTE:

- ⚠️ **SUPABASE_SERVICE_ROLE_KEY** deve começar com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- ⚠️ **NÃO USE** a chave `3ae5cd2f65a90cbbab99725699f41fc81955d2f3edb3af464cc7ef296118b666` - essa NÃO é a correta!
- ⚠️ A **service_role key** é DIFERENTE da **anon key**!

---

## 📞 PRECISA DE AJUDA?

Se você não conseguir encontrar a **service_role key**, me mande um print da página:
🔗 https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api

Ou me diga qual dúvida você tem!
