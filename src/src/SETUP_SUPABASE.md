# 🔧 SETUP DO SUPABASE - PASSO A PASSO

## ✅ SIM! VOCÊ PRECISA CRIAR AS TABELAS NO SUPABASE

---

## 📋 **PASSO A PASSO COMPLETO:**

### **1️⃣ Abrir o Supabase Dashboard**

1. Acesse: https://supabase.com/dashboard
2. Faça login na sua conta
3. Selecione seu projeto RedFlix

---

### **2️⃣ Abrir o SQL Editor**

1. No menu lateral esquerdo, clique em **"SQL Editor"** ⚡
2. Clique em **"+ New query"** (Nova consulta)

---

### **3️⃣ Copiar e Executar o SQL**

Você tem **2 opções**:

#### **OPÇÃO A - Arquivo Completo (RECOMENDADO)** ⭐

1. Abra o arquivo `/supabase/REDFLIX_COMPLETE_DATABASE.sql`
2. Copie **TODO** o conteúdo (são ~2000 linhas)
3. Cole no SQL Editor do Supabase
4. Clique em **"Run"** (Executar) no canto inferior direito
5. Aguarde 30-45 segundos ⏱️

#### **OPÇÃO B - Verificação Rápida** 🔍

1. Abra o arquivo `/supabase/QUICK_CHECK.sql`
2. Copie o conteúdo
3. Cole no SQL Editor
4. Execute
5. Se retornar **0 tabelas**, execute a OPÇÃO A

---

### **4️⃣ Verificar se Funcionou**

Após executar, verifique se apareceu:

```
✅ Successfully executed
```

Ou vá em **"Table Editor"** no menu lateral e veja se apareceram as tabelas:

- ✅ users
- ✅ profiles
- ✅ content
- ✅ my_list
- ✅ favorites
- ✅ watch_history
- ✅ reviews
- ✅ iptv_channels
- ✅ iptv_categories
- ✅ iptv_favorites
- ✅ notifications
- ✅ kv_store_2363f5d6

---

### **5️⃣ Verificar Row Level Security (RLS)**

1. Clique em qualquer tabela (ex: **users**)
2. Clique na aba **"Policies"**
3. Veja se tem políticas criadas ✅

Se tiver políticas = **TUDO CERTO!** 🎉

---

## 🚨 **PROBLEMAS COMUNS:**

### **Erro: "extension already exists"**
✅ **Normal!** Continue a execução, não é erro.

### **Erro: "permission denied"**
❌ Você precisa de permissões de ADMIN no projeto Supabase.

### **Erro: "relation already exists"**
✅ **Tabelas já existem!** Você pode pular este passo.

### **Nenhuma mensagem aparece**
- Verifique se clicou em **"Run"**
- Verifique a conexão com internet
- Tente novamente

---

## 📊 **O QUE O SQL FAZ:**

O arquivo `REDFLIX_COMPLETE_DATABASE.sql` cria:

1. ✅ **15 tabelas** completas
2. ✅ **Row Level Security (RLS)** em todas
3. ✅ **Políticas de segurança** automáticas
4. ✅ **Triggers** para updated_at
5. ✅ **Índices** para performance
6. ✅ **Funções auxiliares** (busca, etc)
7. ✅ **Dados de exemplo** (opcional)

---

## ⚡ **ATALHO RÁPIDO:**

Se você já executou o SQL antes, pode verificar com:

```sql
-- Cole isso no SQL Editor e execute
SELECT COUNT(*) as total_tables 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'users', 'profiles', 'content', 'my_list', 
  'favorites', 'watch_history', 'reviews', 
  'iptv_channels', 'iptv_categories', 
  'iptv_favorites', 'notifications', 'kv_store_2363f5d6'
);
```

**Resultado esperado:** `total_tables = 12`

Se retornar **0** = precisa executar o SQL completo  
Se retornar **12** = já está pronto! ✅

---

## 🎯 **CHECKLIST FINAL:**

- [ ] Acessei o Supabase Dashboard
- [ ] Abri o SQL Editor
- [ ] Copiei o arquivo REDFLIX_COMPLETE_DATABASE.sql
- [ ] Executei o SQL (cliquei em Run)
- [ ] Vi mensagem de sucesso ✅
- [ ] Verifiquei as tabelas no Table Editor
- [ ] Vi as políticas RLS criadas

---

## ✅ **DEPOIS QUE EXECUTAR:**

Volte para a aplicação RedFlix e teste:

```javascript
window.location.hash = '#test-backend'
```

Agora vai funcionar 100%! 🚀

---

## 🆘 **PRECISA DE AJUDA?**

**Erro ao executar?** Me mostre a mensagem de erro

**Não sabe onde está o SQL Editor?** 
- Menu lateral → ⚡ SQL Editor

**Não apareceu nada?**
- Aguarde 1 minuto
- Recarregue a página do Supabase
- Vá em Table Editor e veja se as tabelas apareceram

---

## 📁 **ARQUIVOS NO PROJETO:**

```
/supabase/
├── REDFLIX_COMPLETE_DATABASE.sql   ← EXECUTE ESTE! ⭐
├── QUICK_CHECK.sql                 ← Verificar se já tem tabelas
├── SCHEMA_SUMMARY.md               ← Documentação do schema
└── README.md                       ← Info das migrations
```

---

# 🎉 EXECUTOU O SQL? TUDO PRONTO!

Agora o backend está 100% integrado e funcional! 🚀
