# 🔐 PASSO 2: CONFIGURAR SECRETS DA EDGE FUNCTION

## 📍 ONDE FAZER:

🔗 **URL DIRETA:**
```
https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/settings/functions
```

**Ou navegue:**
1. Dashboard → Seu projeto (vsztquvvnwlxdwyeoffh)
2. Settings (engrenagem) → Functions
3. Procure por "Secrets" ou "Environment Variables"

---

## 🔑 SECRETS A ADICIONAR (4 no total):

### **1️⃣ SUPABASE_URL**

```
Name:  SUPABASE_URL
Value: https://vsztquvvnwlxdwyeoffh.supabase.co
```

---

### **2️⃣ SUPABASE_ANON_KEY**

```
Name:  SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw
```

---

### **3️⃣ SUPABASE_SERVICE_ROLE_KEY**

```
Name:  SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUzMDc0MCwiZXhwIjoyMDc5MTA2NzQwfQ.O0ul8YbFj_0umjce0eWxX0xrTz8i-Fs9q1f-fzqxKCo
```

---

### **4️⃣ TMDB_API_KEY**

```
Name:  TMDB_API_KEY
Value: ddb1bdf6aa91bdf335797853884b0c1d
```

---

## 📋 COMO ADICIONAR (PASSO A PASSO):

### **1. Acesse a página de Functions**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/settings/functions

### **2. Procure pela seção "Secrets"**

Você verá algo assim:

```
┌─────────────────────────────────────────┐
│ Function Secrets                        │
│                                         │
│ [+ Add new secret]                      │
│                                         │
│ Name              Value                 │
│ ─────────────────────────────────────── │
│                                         │
└─────────────────────────────────────────┘
```

### **3. Adicione o primeiro secret**

1. Clique em **[+ Add new secret]**
2. **Name:** `SUPABASE_URL`
3. **Value:** `https://vsztquvvnwlxdwyeoffh.supabase.co`
4. Clique em **[Save]** ou **[Add]**

### **4. Repita para os outros 3 secrets**

**Secret 2:**
- Name: `SUPABASE_ANON_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw`

**Secret 3:**
- Name: `SUPABASE_SERVICE_ROLE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzUzMDc0MCwiZXhwIjoyMDc5MTA2NzQwfQ.O0ul8YbFj_0umjce0eWxX0xrTz8i-Fs9q1f-fzqxKCo`

**Secret 4:**
- Name: `TMDB_API_KEY`
- Value: `ddb1bdf6aa91bdf335797853884b0c1d`

---

## ✅ VERIFICAR SE FUNCIONOU:

Após adicionar todos os 4 secrets, você deve ver:

```
┌─────────────────────────────────────────┐
│ Function Secrets                        │
│                                         │
│ Name                      Value         │
│ ─────────────────────────────────────── │
│ SUPABASE_URL              https://vz... │
│ SUPABASE_ANON_KEY         eyJhbGci...  │
│ SUPABASE_SERVICE_ROLE_KEY eyJhbGci...  │
│ TMDB_API_KEY              ddb1bdf6...  │
└─────────────────────────────────────────┘
```

**⚠️ IMPORTANTE:**
- Os valores podem aparecer truncados ou ocultos
- Isso é normal por segurança
- Se você vir os 4 nomes, está tudo certo!

---

## ⏱️ TEMPO ESTIMADO: 5 minutos

---

## 🚀 PRÓXIMO PASSO:

Depois de adicionar os 4 secrets:

📄 **Veja:** `/PASSO_3_DEPLOY_EDGE_FUNCTION.md`

Ou comece instalando a Supabase CLI:

```bash
npm install -g supabase
```

---

## 🆘 DÚVIDAS?

**Se você não encontrar a seção "Secrets":**
- Tire um print da página
- Me descreva o que você vê
- Eu te ajudo a encontrar!

**Se der erro ao adicionar:**
- Verifique se o nome está exatamente igual (case-sensitive)
- Verifique se o valor foi copiado completo
- Me envie a mensagem de erro
