# 🎨 GUIA VISUAL - CHAVES DO SUPABASE

## 🚨 VOCÊ ESTÁ PROCURANDO NO LUGAR ERRADO!

### **❌ Estas NÃO são chaves do Supabase:**
```
sb_publishable_lRHLkt5z3z2l7it3pSrnTw_HSRZaXof
sb_secret_itbumIECiSeW7Yw7NL8F5w_rrreCqp0
```

**Essas chaves vêm de outro serviço!** (Provavelmente Stripe, Shopify, ou similar)

---

## 🎯 COMPARAÇÃO VISUAL:

### **❌ CHAVES ERRADAS (que você forneceu):**
```
Formato:    sb_publishable_XXXXXXXXXXXXXXXXXXXX
Tamanho:    ~45 caracteres
Prefixo:    sb_publishable_ ou sb_secret_
Serviço:    NÃO é Supabase!
```

---

### **✅ CHAVES CORRETAS DO SUPABASE:**
```
Formato:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...XXXXX...XXX
Tamanho:    200-300 caracteres
Prefixo:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
Serviço:    SUPABASE (JWT válido)
Tipo:       JSON Web Token
```

---

## 📍 ONDE ENCONTRAR (PASSO A PASSO):

### **ETAPA 1: Acesse o projeto Supabase**

**URL COMPLETA:**
```
https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api
```

**Ou navegue manualmente:**
1. Vá para https://supabase.com/dashboard
2. Clique no projeto "glnmajvrxdwfyedsuaxx"
3. Clique em "Settings" (engrenagem) no menu lateral
4. Clique em "API"

---

### **ETAPA 2: Identifique as duas chaves**

Na página, você verá **DUAS seções**:

```
═══════════════════════════════════════════════════════════
1️⃣ anon public
───────────────────────────────────────────────────────────
Safe to use in a browser if you have enabled Row Level 
Security for your tables and configured policies.

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFz...

[Copy]
───────────────────────────────────────────────────────────
Status: ✅ JÁ TEMOS ESTA!
═══════════════════════════════════════════════════════════

═══════════════════════════════════════════════════════════
2️⃣ service_role secret 🔒
───────────────────────────────────────────────────────────
This key has the ability to bypass Row Level Security. 
Never share it publicly.

••••••••••••••••••••••••••••••••••••••••••••••••••••••••

[Reveal] [Copy]
───────────────────────────────────────────────────────────
Status: ⚠️ PRECISAMOS DESTA!
═══════════════════════════════════════════════════════════
```

---

### **ETAPA 3: Revelar a chave service_role**

**ANTES de clicar em "Reveal":**
```
┌────────────────────────────────────────┐
│ service_role secret                    │
│                                        │
│ ••••••••••••••••••••••••••••••••••••  │ ← Oculta
│                                        │
│ [Reveal] [Copy]                        │
└────────────────────────────────────────┘
```

**DEPOIS de clicar em "Reveal":**
```
┌────────────────────────────────────────┐
│ service_role secret                    │
│                                        │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9. │ ← Visível!
│ eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imds │
│ bm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6 │
│ InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MjI3 │
│ MjU3MiwiZXhwIjoyMDc3ODQ4NTcyfQ.XXXXX │
│                                        │
│ [Hide] [Copy]                          │
└────────────────────────────────────────┘
```

---

### **ETAPA 4: Copiar a chave**

Clique em **[Copy]** para copiar a chave inteira.

**⚠️ IMPORTANTE:**
- Copie a chave **COMPLETA** (toda a linha)
- NÃO copie apenas uma parte
- A chave tem ~250 caracteres

---

## ✅ VALIDAÇÃO DA CHAVE:

### **Teste 1: Verificar o início**
A chave deve começar **EXATAMENTE** assim:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M
```

### **Teste 2: Contar os pontos**
A chave deve ter **EXATAMENTE 2 pontos** (`.`):
```
eyJhbGci...XXXXX.eyJpc3M...XXXXX.XXXXX...XXXXX
     ↑                 ↑
  Ponto 1          Ponto 2
```

### **Teste 3: Verificar o tamanho**
A chave deve ter **entre 200 e 300 caracteres**.

---

## 🧪 DECODIFICAR A CHAVE (OPCIONAL):

Se quiser verificar se é a chave correta:

1. Acesse: https://jwt.io
2. Cole a chave no campo "Encoded"
3. No lado direito ("Decoded"), procure por:

```json
{
  "iss": "supabase",
  "ref": "glnmajvrxdwfyedsuaxx",
  "role": "service_role",  ← DEVE SER service_role!
  "iat": 1762272572,
  "exp": 2077848572
}
```

Se o campo `"role"` for `"service_role"`, está **CORRETO!** ✅

---

## 📊 RESUMO COMPARATIVO:

| Item | ❌ Chave Errada | ✅ Chave Correta |
|------|----------------|------------------|
| **Prefixo** | `sb_publishable_` ou `sb_secret_` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.` |
| **Tamanho** | ~45 caracteres | 200-300 caracteres |
| **Formato** | Texto simples | JWT (3 partes) |
| **Pontos (.)** | 0 | 2 |
| **Serviço** | Outro (Stripe?) | Supabase |
| **Tipo** | API Key | JSON Web Token |

---

## 🎯 CHECKLIST FINAL:

Antes de me enviar a chave, verifique:

- [ ] A chave começa com `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.`
- [ ] A chave tem 2 pontos (`.`)
- [ ] A chave tem mais de 200 caracteres
- [ ] Copiei do dashboard do Supabase (não de outro lugar)
- [ ] É a chave "service_role", não "anon"

Se **TODOS** os itens estiverem ✅, a chave está correta!

---

## 🚀 PRÓXIMO PASSO:

**Cole a chave aqui** e eu vou:
1. ✅ Validar se está correta
2. ✅ Configurar os secrets automaticamente
3. ✅ Te guiar no resto do setup

---

## 🆘 AINDA NÃO ENCONTROU?

**Me diga exatamente o que você vê na página:**
🔗 https://supabase.com/dashboard/project/glnmajvrxdwfyedsuaxx/settings/api

Descreva:
- Quantas seções de chaves você vê?
- Quais são os nomes das seções?
- Tem algum botão "Reveal"?

E eu te ajudo! 🔍
