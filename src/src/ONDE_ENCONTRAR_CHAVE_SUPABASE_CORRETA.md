# 🔑 ONDE ENCONTRAR A CHAVE CORRETA DO SUPABASE

## ⚠️ VOCÊ FORNECEU AS CHAVES ERRADAS!

### **❌ Chaves que você forneceu (ERRADAS):**
```
Publishable key: sb_publishable_lRHLkt5z3z2l7it3pSrnTw_HSRZaXof
Secret key: sb_secret_itbumIECiSeW7Yw7NL8F5w_rrreCqp0
```

**Essas não são do Supabase!** Parecem ser de outro serviço (Stripe, Shopify, etc.)

---

## 🎯 PASSO A PASSO - ONDE ENCONTRAR AS CHAVES CORRETAS:

### **PASSO 1: Acesse o Supabase Dashboard**

🔗 **URL EXATA:** https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx

---

### **PASSO 2: Vá em Settings → API**

🔗 **URL DIRETA:** https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api

**Você deve ver algo assim:**

```
┌────────────────────────────────────────────────────────┐
│ Configuration                                          │
│                                                        │
│ Project URL                                            │
│ https://glnmajvrxdwfyedsuaxx.supabase.co              │
│                                                        │
│ Project API keys                                       │
│                                                        │
│ ┌────────────────────────────────────────────────┐   │
│ │ anon public                                     │   │
│ │                                                 │   │
│ │ This key is safe to use in a browser if you    │   │
│ │ have enabled Row Level Security for your       │   │
│ │ tables and configured policies.                 │   │
│ │                                                 │   │
│ │ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3... │   │ ← JÁ TEMOS ESTA
│ │                                                 │   │
│ │ [Copy]                                          │   │
│ └────────────────────────────────────────────────┘   │
│                                                        │
│ ┌────────────────────────────────────────────────┐   │
│ │ service_role secret                             │   │ ← QUEREMOS ESTA!
│ │                                                 │   │
│ │ This key has the ability to bypass Row Level   │   │
│ │ Security. Never share it publicly.              │   │
│ │                                                 │   │
│ │ ••••••••••••••••••••••••••••••••••••••••••••   │   │
│ │                                                 │   │
│ │ [Reveal] [Copy]                                 │   │
│ └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

### **PASSO 3: Clique em "Reveal" na seção service_role**

Você verá a chave aparecer:

```
┌────────────────────────────────────────────────┐
│ service_role secret                             │
│                                                 │
│ This key has the ability to bypass Row Level   │
│ Security. Never share it publicly.              │
│                                                 │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3... │ ← COPIE ESTA!
│                                                 │
│ [Hide] [Copy]                                   │
└────────────────────────────────────────────────┘
```

---

### **PASSO 4: Clique em "Copy"**

A chave será copiada para sua área de transferência.

**A chave deve parecer com isto:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI3MjU3MiwiZXhwIjoyMDc3ODQ4NTcyfQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**Características:**
- ✅ Começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- ✅ Tem 3 partes separadas por `.`
- ✅ É muito longa (200-300 caracteres)
- ✅ Contém `"role":"service_role"` quando decodificada

---

### **PASSO 5: Cole a chave aqui**

Depois de copiar, cole aqui para eu validar se está correta!

---

## 🚨 DIFERENÇAS ENTRE AS CHAVES:

### **❌ ERRADAS (que você forneceu):**
```
sb_publishable_lRHLkt5z3z2l7it3pSrnTw_HSRZaXof
sb_secret_itbumIECiSeW7Yw7NL8F5w_rrreCqp0
```
- Começam com `sb_`
- São curtas (~50 caracteres)
- Parecem ser de outro serviço

### **✅ CORRETAS (Supabase):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog
```
- Começam com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- São longas (200-300 caracteres)
- São JWTs válidos

---

## 🎯 CHECKLIST:

- [ ] Acessei https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api
- [ ] Encontrei a seção "service_role secret"
- [ ] Cliquei em "Reveal"
- [ ] Copiei a chave INTEIRA
- [ ] A chave começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- [ ] Colei aqui para validação

---

## 📸 SCREENSHOTS DE REFERÊNCIA:

Se você ainda não encontrou, tire um print da página:
🔗 https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api

E me envie ou descreva o que você está vendo!

---

## 🆘 AINDA COM DÚVIDAS?

**Me diga:**
1. O que você vê na página Settings → API?
2. Você consegue ver a seção "service_role secret"?
3. Tem algum botão "Reveal" ou "👁️"?

E eu te ajudo a encontrar! 🔍
