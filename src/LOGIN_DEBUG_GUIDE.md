# 🔍 Guia de Debug - Sistema de Login RedFlix

## Status Atual
✅ **Logs de Debug Implementados** - Sistema completo de rastreamento

## Arquivos Modificados

### 1. `/components/Login.tsx`
- ✅ Logs no envio do formulário
- ✅ Rastreamento de email e tamanho da senha
- ✅ Feedback de sucesso/erro

### 2. `/utils/api.ts`
- ✅ Logs na chamada da API signin
- ✅ Rastreamento do endpoint e dados enviados
- ✅ Log da resposta do servidor

### 3. `/contexts/AuthContext.tsx`
- ✅ Logs detalhados do processo de signin
- ✅ Rastreamento de token e usuário
- ✅ Logs de carregamento de perfis

## Fluxo de Logs Esperado

Quando você clicar em "Entrar", deve ver esta sequência no console:

```
🔑 [Login] Formulário enviado: { email: "user@example.com", passwordLength: 8 }
🔑 [Login] Chamando signin...
📡 [API] Chamando signin: { email: "user@example.com", endpoint: "/auth/signin" }
📡 [API] Resposta signin: { success: true, access_token: "...", user: {...} }
🔐 [AuthContext] Iniciando signin... { email: "user@example.com" }
🔐 [AuthContext] Resposta do servidor: { success: true, ... }
🔐 [AuthContext] Carregando perfis...
🔐 [AuthContext] Perfis carregados: [...]
🔐 [AuthContext] Login completo!
🔑 [Login] Signin concluído com sucesso!
```

## Como Testar

### Passo 1: Abrir o Console do Navegador
1. Pressione `F12` ou `Ctrl+Shift+I` (Windows/Linux)
2. Ou `Cmd+Option+I` (Mac)
3. Vá para a aba **Console**

### Passo 2: Criar uma Conta (Se não tiver)
1. Clique em "Assine agora" na tela de login
2. Preencha os dados:
   - Nome: Teste RedFlix
   - Email: teste@redflix.com
   - Senha: Teste123
   - Telefone: (opcional)
3. Complete o cadastro

### Passo 3: Fazer Login
1. Na tela de login, preencha:
   - Email: teste@redflix.com
   - Senha: Teste123
2. **Observe o console** enquanto clica em "Entrar"
3. Anote todos os logs que aparecerem

## Possíveis Problemas e Soluções

### ❌ Problema 1: Nenhum Log Aparece
**Causa**: Formulário não está sendo enviado
**Solução**: 
- Verifique se o botão "Entrar" está habilitado
- Confirme que email e senha estão preenchidos
- Verifique se há erros JavaScript no console

### ❌ Problema 2: Log para em "Chamando signin"
**Causa**: Requisição não chegou ao servidor
**Solução**:
- Verifique a URL da API no console Network
- URL esperada: `https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6/auth/signin`
- Verifique se há erros CORS

### ❌ Problema 3: Erro "Email e password são obrigatórios"
**Causa**: Dados não estão sendo enviados no body
**Solução**:
- Verifique o Network tab
- Confirme que o body da requisição contém `{ "email": "...", "password": "..." }`

### ❌ Problema 4: Erro 401 "Invalid login credentials"
**Causa**: Email ou senha incorretos
**Solução**:
- Verifique se a conta foi criada corretamente
- Tente criar uma nova conta
- Verifique se não há espaços extras no email/senha

### ❌ Problema 5: Erro 500 do Servidor
**Causa**: Problema no backend Supabase
**Solução**:
- Verifique se as credenciais do Supabase estão corretas em `/utils/supabase/info.tsx`
- Project ID: `vsztquvvnwlxdwyeoffh`
- Confirme que as variáveis de ambiente estão configuradas

## Informações Importantes

### Credenciais do Supabase (Atualizadas)
```typescript
// /utils/supabase/info.tsx
export const projectId = 'vsztquvvnwlxdwyeoffh';
export const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ6c3RxdXZ2bndseGR3eWVvZmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIwMzE0MDIsImV4cCI6MjA0NzYwNzQwMn0.ioJH2vxdUWq3H0GCNV7zcLfZ5EbVqOcL7pLqGDEHKKw';
```

### URL da API
```
Base: https://vsztquvvnwlxdwyeoffh.supabase.co/functions/v1/make-server-2363f5d6
Signin: /auth/signin
Signup: /auth/signup
```

## Network Tab - O Que Verificar

### Request (Enviado)
```json
POST /auth/signin
Headers:
  Content-Type: application/json
  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Body:
{
  "email": "teste@redflix.com",
  "password": "Teste123"
}
```

### Response (Esperada - Sucesso)
```json
{
  "success": true,
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "...",
  "user": {
    "id": "...",
    "email": "teste@redflix.com",
    "name": "Teste RedFlix"
  }
}
```

### Response (Erro)
```json
{
  "error": "Invalid login credentials"
}
```

## Próximos Passos

Após identificar onde o fluxo está parando, compartilhe:

1. **Último log que apareceu** no console
2. **Status Code** da requisição (200, 401, 500, etc.)
3. **Response Body** que o servidor retornou
4. **Mensagem de erro** exata (se houver)

Isso permitirá identificar e corrigir o problema específico!

---

**Data**: 19/11/2024  
**Versão**: RedFlix v5.3.1 - Debug Login
