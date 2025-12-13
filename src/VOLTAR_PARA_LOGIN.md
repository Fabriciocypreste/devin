# 🔄 COMO VOLTAR PARA A TELA DE LOGIN

Se você está preso na tela de cadastro ou perfil e quer voltar para o login, use uma destas opções:

---

## **OPÇÃO 1: URL com Parâmetro Reset (MAIS FÁCIL)**

Adicione `?reset=true` no final da URL:

```
http://localhost:5173/?reset=true
```

**Como fazer:**
1. Abra o navegador
2. Na barra de endereço, adicione `?reset=true` no final
3. Pressione Enter
4. ✅ Você será redirecionado automaticamente para o login!

---

## **OPÇÃO 2: Página de Reset Dedicada**

Acesse a página de reset criada especialmente:

```
http://localhost:5173/reset-login.html
```

**Como fazer:**
1. Abra o navegador
2. Digite: `http://localhost:5173/reset-login.html`
3. Clique no botão "🔄 Limpar e Voltar para Login"
4. ✅ Todos os dados serão limpos e você voltará ao login!

---

## **OPÇÃO 3: Console do Navegador**

Use o DevTools do navegador:

1. Pressione **F12** (ou Ctrl+Shift+I)
2. Vá para a aba **Console**
3. Cole este código:

```javascript
localStorage.clear();
sessionStorage.clear();
location.href = '/?reset=true';
```

4. Pressione **Enter**
5. ✅ Página será recarregada no login!

---

## **OPÇÃO 4: Limpar Cache do Navegador**

### **Google Chrome / Edge:**

1. Pressione **Ctrl + Shift + Delete**
2. Selecione:
   - ✅ Cookies e outros dados do site
   - ✅ Imagens e arquivos em cache
3. Selecione período: **Última hora**
4. Clique em **Limpar dados**
5. Recarregue a página: **F5**

### **Firefox:**

1. Pressione **Ctrl + Shift + Delete**
2. Selecione:
   - ✅ Cookies
   - ✅ Cache
3. Selecione período: **Última hora**
4. Clique em **Limpar agora**
5. Recarregue a página: **F5**

---

## **OPÇÃO 5: Modo Anônimo / Privado**

Teste em uma janela anônima:

### **Chrome / Edge:**
- **Ctrl + Shift + N**

### **Firefox:**
- **Ctrl + Shift + P**

### **Safari:**
- **Cmd + Shift + N**

Depois acesse: `http://localhost:5173`

---

## **OPÇÃO 6: Forçar Reload Completo**

Use estes atalhos para forçar um reload completo:

### **Windows:**
- **Ctrl + F5** (hard reload)
- **Ctrl + Shift + R** (bypass cache)

### **Mac:**
- **Cmd + Shift + R**

---

## **🆘 SE NADA FUNCIONAR:**

### **Reset Completo do Projeto:**

1. **Pare o servidor** (Ctrl+C no terminal)

2. **Limpe o cache do npm:**
   ```bash
   npm cache clean --force
   ```

3. **Delete node_modules:**
   ```bash
   rm -rf node_modules
   rm package-lock.json
   ```

4. **Reinstale:**
   ```bash
   npm install
   ```

5. **Rode novamente:**
   ```bash
   npm run dev
   ```

6. **Acesse com reset:**
   ```
   http://localhost:5173/?reset=true
   ```

---

## **📋 COMANDOS RÁPIDOS (PowerShell)**

Cole isto no terminal PowerShell (na pasta do projeto):

```powershell
# Parar servidor (se estiver rodando)
taskkill /F /IM node.exe 2>$null

# Limpar tudo
npm cache clean --force
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Reinstalar e rodar
npm install
npm run dev
```

Depois acesse: `http://localhost:5173/?reset=true`

---

## **🎯 VERIFICAR SE FUNCIONOU**

Você deve ver a tela de login com:

- ✅ Fundo vermelho degradê
- ✅ Caixa preta centralizada
- ✅ Logo RedFlix no topo
- ✅ Campos de email e senha (fundo branco)
- ✅ Botão vermelho "Entrar"
- ✅ Botões de login social (Google, Facebook, Apple)
- ✅ Checkbox "Lembre-se de mim"
- ✅ Link "Precisa de ajuda?"
- ✅ Link "Novo por aqui? Assine agora"

---

## **🔍 DEBUG - Verificar Estado Atual**

Para ver o que está salvo no navegador:

1. Pressione **F12**
2. Vá em **Application** (Chrome) ou **Storage** (Firefox)
3. Clique em **Local Storage**
4. Veja o que está salvo em `http://localhost:5173`

**Chaves importantes:**
- `redflix_current_screen` - Tela atual
- `redflix_auth` - Estado de autenticação
- `redflix_user` - Dados do usuário

**Para limpar manualmente:**
- Clique direito na chave
- **Delete**

---

## **✅ PREVENÇÃO**

Para não ficar preso novamente:

1. **Sempre use o botão "Sair"** quando disponível
2. **Não feche o navegador no meio do cadastro**
3. **Complete o cadastro ou cancele** antes de fechar
4. **Use "Voltar"** nos formulários para cancelar

---

## **🎉 SUCESSO!**

Agora você sabe como voltar para o login de 6 formas diferentes!

**Forma mais rápida:** Adicione `?reset=true` na URL! 🚀
