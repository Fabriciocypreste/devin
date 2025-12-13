# 🔌 TESTE DE CONEXÃO - REDFLIX

## ✅ CONFIGURAÇÃO VERIFICADA:

### **Backend (Supabase Edge Function):**
- ✅ Servidor rodando em: `https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6`
- ✅ Rotas de autenticação criadas
- ✅ CORS habilitado
- ✅ Logger ativo

### **Frontend:**
- ✅ API client configurado em `/utils/api.ts`
- ✅ AuthContext criado em `/contexts/AuthContext.tsx`
- ✅ Supabase client em `/utils/supabase/client.ts`
- ✅ Credenciais em `/utils/supabase/info.tsx`

### **Banco de Dados:**
- ✅ Tabelas criadas no Supabase
- ✅ RLS configurado
- ✅ Políticas de segurança ativas

---

## 🧪 TESTES RÁPIDOS:

### **1. Teste de Health Check**

Abra o console (F12) e cole:

```javascript
fetch('https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend OK:', data))
  .catch(err => console.error('❌ Backend ERROR:', err))
```

**Resultado esperado:**
```
✅ Backend OK: { status: "ok" }
```

---

### **2. Teste de Criação de Conta**

```javascript
fetch('https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog'
  },
  body: JSON.stringify({
    email: 'teste' + Date.now() + '@redflix.com',
    password: 'senha123',
    name: 'Teste User'
  })
})
  .then(r => r.json())
  .then(data => console.log('✅ Signup OK:', data))
  .catch(err => console.error('❌ Signup ERROR:', err))
```

**Resultado esperado:**
```
✅ Signup OK: {
  user: { id: "...", email: "...", name: "..." },
  access_token: "..."
}
```

---

### **3. Teste Direto do Supabase Client**

```javascript
import { supabase } from './utils/supabase/client';

// Verificar conexão
supabase.from('users').select('count').then(
  ({ data, error }) => {
    if (error) {
      console.error('❌ Supabase Error:', error);
    } else {
      console.log('✅ Supabase OK:', data);
    }
  }
);
```

---

## 🚨 POSSÍVEIS PROBLEMAS:

### **ERRO: "Failed to fetch" ou "Network Error"**

**Causa:** Edge Function não está deployed ou não está rodando

**Solução:**
1. Acesse https://supabase.com/dashboard
2. Vá em **Edge Functions**
3. Verifique se `make-server-2363f5d6` está **deployed**
4. Se não estiver, faça deploy

---

### **ERRO: "CORS error"**

**Causa:** CORS não configurado corretamente

**Solução:** Já está configurado no código, mas verifique se o servidor está rodando.

---

### **ERRO: "Unauthorized" ou "403"**

**Causa:** Token inválido ou RLS bloqueando

**Solução:** 
1. Verifique se o token está correto
2. Verifique as políticas RLS no Supabase

---

## ✅ PRÓXIMOS PASSOS:

Quando os testes funcionarem:

1. ✅ Abrir página de teste: `window.location.hash = '#test-backend'`
2. ✅ Criar conta
3. ✅ Fazer login
4. ✅ Criar perfil
5. ✅ Adicionar à lista
6. ✅ Testar persistência

---

## 🔧 COMANDOS ÚTEIS:

### **Limpar localStorage (se necessário):**
```javascript
localStorage.clear();
location.reload();
```

### **Ver dados salvos:**
```javascript
console.log({
  token: localStorage.getItem('redflix_access_token'),
  user: localStorage.getItem('redflix_user'),
  profile: localStorage.getItem('redflix_selected_profile')
});
```

### **Verificar se está autenticado:**
```javascript
const token = localStorage.getItem('redflix_access_token');
console.log('Autenticado:', !!token);
```

---

## 📞 SUPORTE:

Se algum teste falhar, me envie:
1. **Qual teste falhou** (1, 2 ou 3)
2. **Mensagem de erro completa**
3. **Print do console (F12)**
