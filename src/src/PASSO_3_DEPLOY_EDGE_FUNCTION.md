# 🚀 PASSO 3: DEPLOY DA EDGE FUNCTION

## 📋 OPÇÃO 1: VIA SUPABASE CLI (RECOMENDADO)

### **Passo 3.1: Instalar Supabase CLI**

**No terminal (macOS/Linux):**
```bash
brew install supabase/tap/supabase
```

**Ou via npm (Windows/macOS/Linux):**
```bash
npm install -g supabase
```

**Verificar instalação:**
```bash
supabase --version
```

Deve mostrar algo como: `1.x.x`

---

### **Passo 3.2: Fazer Login**

```bash
supabase login
```

**O que vai acontecer:**
1. Vai abrir seu navegador
2. Você vai fazer login no Supabase
3. Vai autorizar o CLI
4. Volta para o terminal

**Resultado esperado:**
```
✔ Logged in.
```

---

### **Passo 3.3: Link com o Projeto**

```bash
supabase link --project-ref vsztquvvnwlxdwyeoffh
```

**Pode pedir:**
- Password do banco (se não souber, pode deixar em branco)
- Confirmação do projeto

**Resultado esperado:**
```
✔ Linked project vsztquvvnwlxdwyeoffh
```

---

### **Passo 3.4: Deploy da Função**

```bash
supabase functions deploy make-server-2363f5d6 --project-ref vsztquvvnwlxdwyeoffh
```

**O que vai acontecer:**
1. CLI vai empacotar os arquivos de `/supabase/functions/server/`
2. Vai fazer upload para o Supabase
3. Vai ativar a função

**Resultado esperado:**
```
Deploying Function make-server-2363f5d6...
✔ Function make-server-2363f5d6 deployed successfully!

Function URL:
https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6
```

---

## 📋 OPÇÃO 2: VIA DASHBOARD (ALTERNATIVA)

⚠️ **ATENÇÃO:** Esta opção é mais trabalhosa. Use a CLI se possível!

### **Passo 2.1: Criar a função**

1. 🔗 Acesse: https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/functions
2. Clique em **[+ Create a new function]**
3. **Name:** `make-server-2363f5d6`
4. Clique em **[Create]**

---

### **Passo 2.2: Copiar o código**

**⚠️ PROBLEMA:** O dashboard só aceita 1 arquivo, mas temos múltiplos arquivos.

**Arquivos que precisam ser deployados:**
```
/supabase/functions/server/
├── index.tsx              ← Arquivo principal
├── kv_store.tsx          ← Utilitário KV
├── users.ts              ← Rotas de usuários
├── iptv.ts               ← Rotas IPTV
├── content.ts            ← Rotas de conteúdo
├── notifications.ts      ← Rotas de notificações
└── database_setup.tsx    ← Setup do banco
```

**Por isso, use a OPÇÃO 1 (CLI)!**

---

## 🧪 PASSO 4: TESTAR SE FUNCIONOU

### **Teste 1: Health Check**

```bash
curl https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/health
```

**Resultado esperado:**
```json
{"status":"ok"}
```

**Se deu erro:**
- Verifique se a URL está correta
- Verifique se o deploy foi bem-sucedido
- Veja os logs (próximo teste)

---

### **Teste 2: Ver Logs**

🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/functions/make-server-2363f5d6/logs

**Ou via CLI:**
```bash
supabase functions logs make-server-2363f5d6 --project-ref vsztquvvnwlxdwyeoffh
```

**O que procurar:**
- Erros de inicialização
- Erros de variáveis de ambiente
- Erros de conexão com banco

---

### **Teste 3: TMDB API**

```bash
curl "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/tmdb/trending/movie/day" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw"
```

**Resultado esperado:**
```json
{
  "results": [
    {
      "id": 123,
      "title": "Filme 1",
      "poster_path": "/abc.jpg",
      ...
    },
    ...
  ]
}
```

---

### **Teste 4: KV Store - SET**

```bash
curl -X POST "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/kv/set" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw" \
  -H "Content-Type: application/json" \
  -d '{"key":"teste:funciona","value":"✅ SIM! RedFlix está ON!"}'
```

**Resultado esperado:**
```json
{"success":true}
```

---

### **Teste 5: KV Store - GET**

```bash
curl "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/kv/get/teste:funciona" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw"
```

**Resultado esperado:**
```json
{"value":"✅ SIM! RedFlix está ON!"}
```

---

## 🚨 PROBLEMAS COMUNS:

### **Erro: "Function not found" (404)**

**Causa:** Deploy não foi bem-sucedido ou nome está errado

**Solução:**
1. Verifique se o nome é exatamente `make-server-2363f5d6`
2. Veja os logs do deploy
3. Tente fazer deploy novamente

---

### **Erro: "Environment variable not found"**

**Causa:** Secrets não foram configurados

**Solução:**
1. Volte para `/PASSO_2_CONFIGURAR_SECRETS.md`
2. Verifique se os 4 secrets estão lá
3. Verifique se os nomes estão corretos (case-sensitive)

---

### **Erro: "Database connection failed"**

**Causa:** Tabela KV não foi criada

**Solução:**
1. Volte para `/PASSO_1_CRIAR_TABELA_KV.sql`
2. Execute o SQL novamente
3. Verifique se a tabela foi criada

---

### **Erro: "TMDB API failed"**

**Causa:** API key inválida ou rate limit

**Solução:**
1. Verifique se o secret `TMDB_API_KEY` está correto
2. Teste a API diretamente: https://api.themoviedb.org/3/trending/movie/day?api_key=ddb1bdf6aa91bdf335797853884b0c1d
3. Veja os logs da função

---

## ✅ CHECKLIST COMPLETO:

- [ ] Instalei Supabase CLI
- [ ] Fiz login (`supabase login`)
- [ ] Linkei o projeto (`supabase link`)
- [ ] Fiz deploy da função (`supabase functions deploy`)
- [ ] Testei `/health` → `{"status":"ok"}`
- [ ] Testei `/tmdb/trending/movie/day` → JSON com filmes
- [ ] Testei `/kv/set` → `{"success":true}`
- [ ] Testei `/kv/get` → Dados corretos
- [ ] **TUDO FUNCIONANDO! 🎉**

---

## ⏱️ TEMPO ESTIMADO: 10 minutos

---

## 🚀 PRÓXIMO PASSO:

Depois que tudo estiver funcionando:

📄 **Veja:** `/PASSO_4_TESTAR_APLICACAO.md`

Ou abra a aplicação e teste:
```
http://localhost:XXXX
```

---

## 📞 PRECISA DE AJUDA?

**Se você tiver problemas:**
1. Me envie a mensagem de erro completa
2. Me envie os logs da função (link acima)
3. Me diga qual teste falhou

E eu te ajudo! 🛟
