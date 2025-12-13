# ✅ PASSO 4: TESTAR A APLICAÇÃO REDFLIX

## 🎯 AGORA TUDO ESTÁ CONECTADO!

```
✅ Banco de dados (tabela KV)
✅ Edge Function (make-server-2363f5d6)
✅ Secrets configurados
✅ Chaves do Supabase atualizadas
✅ API do TMDB conectada
```

---

## 🧪 TESTES RÁPIDOS DA APLICAÇÃO:

### **Teste 1: Abrir a aplicação**

```bash
# Se você estiver rodando localmente
npm run dev
```

Ou acesse a URL da sua aplicação.

---

### **Teste 2: Verificar console do navegador**

**Abra o DevTools (F12) e procure por:**

✅ **Sem erros de conexão:**
```
✅ Supabase configurado
✅ TMDB API funcionando
✅ Edge Function conectada
```

❌ **Se houver erros:**
- `Failed to fetch` → Edge Function não está acessível
- `CORS error` → Problema na Edge Function
- `401 Unauthorized` → Chave ANON incorreta
- `404 Not Found` → Edge Function não foi deployada

---

### **Teste 3: Testar login/cadastro**

1. Tente criar um novo usuário
2. Tente fazer login
3. Verifique se os dados são salvos no Supabase

**Ver dados no banco:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/editor

---

### **Teste 4: Testar carregamento de filmes**

1. Vá para a página principal
2. Verifique se os filmes aparecem
3. Verifique se as imagens carregam

**Se não aparecer:**
- Veja o console (F12)
- Verifique se a API do TMDB está respondendo
- Teste manualmente: `/TESTES_MANUAIS.md`

---

### **Teste 5: Testar funcionalidades específicas**

**RedFlix tem mais de 80 funcionalidades:**
- [ ] Login/Logout
- [ ] Seleção de perfis
- [ ] Dashboard do usuário
- [ ] Página Kids com jogos
- [ ] Sistema IPTV
- [ ] Busca avançada
- [ ] Player de vídeo
- [ ] Favoritos
- [ ] Lista "Minha Lista"
- [ ] Histórico de visualização
- [ ] E muito mais...

---

## 🔍 COMO DEBUGAR PROBLEMAS:

### **Problema: Filmes não aparecem**

**1. Teste a API diretamente:**
```bash
curl "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/tmdb/trending/movie/day" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw"
```

**2. Veja os logs da Edge Function:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/functions/make-server-2363f5d6/logs

**3. Veja o console do navegador (F12)**

---

### **Problema: Login não funciona**

**1. Teste criar usuário via API:**
```bash
curl -X POST "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/users/signup" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw" \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@redflix.com","password":"senha123","name":"Teste User"}'
```

**2. Veja os logs**

**3. Verifique o Supabase Auth:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/auth/users

---

### **Problema: Dados não salvam**

**1. Teste o KV Store:**
```bash
# Salvar
curl -X POST "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/kv/set" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw" \
  -H "Content-Type: application/json" \
  -d '{"key":"debug:test","value":"teste de debug"}'

# Ler
curl "https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/kv/get/debug:test" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzenRxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MzA3NDAsImV4cCI6MjA3OTEwNjc0MH0.vXKk_HSkkVzjWbje72BNXNk472GIdW2Iuy_F8Gw20lw"
```

**2. Veja os dados no banco:**
🔗 https://supabase.com/dashboard/project/vsztquvvnwlxdwyeoffh/editor

---

## 📊 CHECKLIST COMPLETO DO SETUP:

### **Backend:**
- [x] ✅ Tabela KV criada
- [x] ✅ Edge Function deployada
- [x] ✅ Secrets configurados
- [x] ✅ TMDB API conectada

### **Frontend:**
- [x] ✅ `/utils/supabase/info.tsx` atualizado
- [x] ✅ Project ID: vsztquvvnwlxdwyeoffh
- [x] ✅ ANON_KEY configurada

### **Testes:**
- [ ] Health check funciona
- [ ] TMDB API retorna filmes
- [ ] KV Store salva/lê dados
- [ ] Login/cadastro funciona
- [ ] Filmes aparecem na UI
- [ ] Todas funcionalidades testadas

---

## 🎉 TUDO PRONTO!

Se todos os testes passaram:

```
╔════════════════════════════════════════╗
║  🎬 REDFLIX ESTÁ TOTALMENTE CONECTADO! ║
╚════════════════════════════════════════╝

✅ Banco de dados: Supabase (vsztquvvnwlxdwyeoffh)
✅ Edge Function: Deployada e funcionando
✅ TMDB API: Integrada
✅ Sistema de usuários: Ativo
✅ KV Store: Operacional
✅ Mais de 80 funcionalidades: Prontas!

🚀 Agora é só usar e testar tudo!
```

---

## 📚 DOCUMENTAÇÃO ADICIONAL:

- `/PASSO_1_CRIAR_TABELA_KV.sql` - SQL executado
- `/PASSO_2_CONFIGURAR_SECRETS.md` - Secrets configurados
- `/PASSO_3_DEPLOY_EDGE_FUNCTION.md` - Deploy realizado
- `/SETUP_FINAL_SUPABASE.md` - Resumo completo

---

## 🆘 PRECISA DE AJUDA?

Se algo não funcionar:
1. Veja os logs da Edge Function
2. Veja o console do navegador (F12)
3. Teste os endpoints manualmente
4. Me envie os erros e eu te ajudo!

**Divirta-se com o RedFlix! 🍿🎬**
