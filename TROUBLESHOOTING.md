# 🔧 TROUBLESHOOTING - Problemas de Instalação e Dependências

Guia de solução de problemas comuns relacionados à instalação e dependências do projeto Redflix.

---

## 📋 ÍNDICE

1. [Erros de @supabase/supabase-js](#erros-de-supabasesupabase-js)
2. [Erros de npm install](#erros-de-npm-install)
3. [Erros de Build](#erros-de-build)
4. [Erros de Cache](#erros-de-cache)
5. [Problemas com node_modules](#problemas-com-node_modules)

---

## 🔴 ERROS DE @supabase/supabase-js

### **Erro: "Failed to resolve entry for package @supabase/supabase-js"**

**Sintoma completo:**
```
Failed to resolve entry for package "@supabase/supabase-js". 
The package may have incorrect main/module/exports specified in its package.json.
```

**Causas:**
1. ❌ Pacote não instalado corretamente
2. ❌ Cache do npm corrompido
3. ❌ Versão incompatível do pacote
4. ❌ Arquivos dist/ ausentes no pacote

**Soluções (em ordem de preferência):**

#### ✅ Solução 1: Script de Instalação Limpa (RECOMENDADO)

**Windows:**
```bash
npm run install:clean
```
ou
```bash
install-deps.bat
```

**Linux/Mac:**
```bash
./install-deps.sh
```

#### ✅ Solução 2: Reinstalar @supabase/supabase-js

```bash
# Desinstalar
npm uninstall @supabase/supabase-js

# Reinstalar versão específica
npm install @supabase/supabase-js@^2.39.0

# Verificar se instalou corretamente
ls -la node_modules/@supabase/supabase-js/dist/
# Deve mostrar: index.cjs, index.mjs, index.d.cts, index.d.mts

# Rodar projeto
npm run dev
```

#### ✅ Solução 3: Limpar Cache e Reinstalar Tudo

```bash
# Limpar cache
npm cache clean --force

# Remover node_modules
rm -rf node_modules package-lock.json

# Reinstalar
npm install

# Rodar
npm run dev
```

---

## 🟡 ERROS DE npm install

### **Erro: "ERESOLVE unable to resolve dependency tree"**

**Solução:**
```bash
# Usar flag --legacy-peer-deps
npm install --legacy-peer-deps

# OU usar flag --force (menos recomendado)
npm install --force
```

### **Erro: "npm ERR! code EACCES"**

**Causa:** Permissões incorretas

**Solução Linux/Mac:**
```bash
# Corrigir permissões
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Reinstalar
npm install
```

**Solução Windows:**
```bash
# Executar terminal como Administrador
# Depois:
npm install
```

---

## 🟠 ERROS DE BUILD

### **Erro: "Cannot find package 'fdir'"**

**Causa:** Dependência do Vite não instalada

**Solução:**
```bash
npm install fdir --save-dev
npm run build
```

### **Erro: "Failed to scan for dependencies"**

**Causa:** Vite não consegue pré-processar dependências

**Solução:**
```bash
# Limpar cache do Vite
rm -rf node_modules/.vite

# Reinstalar dependências
npm install

# Tentar build novamente
npm run build
```

---

## 🔵 ERROS DE CACHE

### **Cache Corrompido**

**Sintomas:**
- Erros aleatórios após npm install
- Pacotes "não encontrados" mesmo após instalação
- Build falha sem motivo claro

**Solução:**
```bash
# 1. Limpar TODOS os caches
npm cache clean --force
rm -rf node_modules
rm -rf package-lock.json
rm -rf .npm
rm -rf node_modules/.cache

# 2. Reinstalar tudo
npm install

# 3. Verificar
npm run dev
```

---

## 🟣 PROBLEMAS COM node_modules

### **node_modules muito grande / lento**

**Solução:**
```bash
# Remover node_modules desnecessários
rm -rf node_modules

# Instalar apenas produção (para testar)
npm install --production

# OU instalar tudo novamente
npm install
```

### **Estrutura de node_modules corrompida**

**Solução:**
```bash
# Remover completamente
rm -rf node_modules
rm -rf package-lock.json

# Reinstalar do zero
npm install
```

---

## 🛠️ COMANDOS ÚTEIS

### Verificar instalação de @supabase/supabase-js

```bash
# Ver versão instalada
npm list @supabase/supabase-js

# Ver arquivos do pacote
ls -la node_modules/@supabase/supabase-js/

# Ver arquivos dist
ls -la node_modules/@supabase/supabase-js/dist/
```

### Diagnóstico completo

```bash
# Versão do Node
node --version

# Versão do npm
npm --version

# Listar dependências instaladas
npm list --depth=0

# Verificar pacotes problemáticos
npm doctor
```

---

## ⚙️ ESTRUTURA CORRETA DO PROJETO

O projeto tem duas estruturas de dependências:

```
devin/
├── package.json          ← Dependências PRINCIPAIS (Vite lê aqui)
│   └── dependencies:
│       └── @supabase/supabase-js: ^2.39.0
├── node_modules/         ← Instalado via npm install (raiz)
│   └── @supabase/
│       └── supabase-js/
│           └── dist/
│               ├── index.cjs  ✅ Deve existir
│               ├── index.mjs  ✅ Deve existir
│               └── ...
└── src/
    ├── package.json      ← Dependências ADICIONAIS (opcional)
    │   └── dependencies:
    │       └── @supabase/supabase-js: ^2.39.0
    └── node_modules/     ← Instalado via npm install (src)
```

**IMPORTANTE:**
- O **Vite** lê apenas o `package.json` da RAIZ
- O `src/package.json` é opcional e para ferramentas específicas
- Certifique-se que `@supabase/supabase-js` está no **package.json da raiz**

---

## 🆘 ÚLTIMO RECURSO

Se nada funcionar, tente a **reinstalação completa**:

```bash
# 1. Fazer backup do .env
cp .env .env.backup

# 2. Remover TUDO
rm -rf node_modules
rm -rf package-lock.json
rm -rf src/node_modules
rm -rf src/package-lock.json
rm -rf .npm

# 3. Limpar cache global
npm cache clean --force

# 4. Reinstalar Node.js (se necessário)
# Baixar de: https://nodejs.org/

# 5. Reinstalar dependências
npm install
cd src
npm install
cd ..

# 6. Restaurar .env
cp .env.backup .env

# 7. Tentar rodar
npm run dev
```

---

## 📞 SUPORTE

Se o problema persistir:

1. Verifique a versão do Node.js: `node --version` (deve ser >= 18)
2. Verifique a versão do npm: `npm --version` (deve ser >= 9)
3. Verifique o log completo de erro: `npm run dev > error.log 2>&1`
4. Compartilhe o erro completo com o time de desenvolvimento

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de reportar um erro, verifique:

- [ ] Node.js >= 18 instalado
- [ ] npm >= 9 instalado
- [ ] Cache limpo (`npm cache clean --force`)
- [ ] `@supabase/supabase-js` presente no `package.json` da raiz
- [ ] `node_modules/@supabase/supabase-js/dist/` contém arquivos `.cjs` e `.mjs`
- [ ] Arquivo `.env` configurado corretamente
- [ ] Tentou `npm run install:clean`
- [ ] Tentou reinstalação manual

---

**Última atualização:** Dezembro 2024
