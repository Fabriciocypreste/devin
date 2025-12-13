# 🪟 GUIA COMPLETO - WINDOWS

## 🎯 Para quem pagou assinatura e quer o site funcionando AGORA

---

## ⚡ MÉTODO 1: AUTOMÁTICO (MAIS FÁCIL)

### **Passo 1: Baixar o projeto**

1. Clique em **"Code"** (botão verde)
2. Clique em **"Download ZIP"**
3. Extraia o ZIP para uma pasta (ex: `C:\RedFlix`)

### **Passo 2: Abrir no terminal**

1. Abra a pasta extraída
2. Na barra de endereços, digite: `powershell`
3. Pressione `Enter`

### **Passo 3: Rodar script automático**

Clique 2x no arquivo:
```
corrigir-estilos.bat
```

✅ **PRONTO!** O script faz tudo sozinho!

---

## ⚡ MÉTODO 2: MANUAL (3 COMANDOS)

### **Passo 1: Abrir PowerShell**

1. Abra a pasta do projeto
2. Na barra de endereços, digite: `powershell`
3. Pressione `Enter`

### **Passo 2: Instalar**

Cole no PowerShell:
```powershell
npm install
```

Aguarde 2-5 minutos...

### **Passo 3: Executar**

Cole no PowerShell:
```powershell
npm run dev
```

### **Passo 4: Abrir navegador**

O navegador abre automaticamente em:
```
http://localhost:5173
```

Se não abrir, copie e cole esse link no navegador.

### **Passo 5: Forçar reload**

No navegador, pressione:
```
Ctrl + Shift + R
```

✅ **PRONTO!** Site funcionando!

---

## 🎯 O QUE VOCÊ DEVE VER

### ✅ **CORRETO:**

```
╔══════════════════════════════════════╗
║  🔴 FUNDO VERMELHO DEGRADÊ          ║
║                                      ║
║    ┌────────────────────┐            ║
║    │ ⚫ CAIXA PRETA    │            ║
║    │                    │            ║
║    │   🔴 LOGO         │            ║
║    │                    │            ║
║    │   📧 Email        │            ║
║    │   🔒 Senha        │            ║
║    │                    │            ║
║    │  🔴 ENTRAR        │            ║
║    │                    │            ║
║    │  (G) (f) (🍎)    │            ║
║    └────────────────────┘            ║
║                                      ║
╚══════════════════════════════════════╝
```

### ❌ **ERRADO (se aparecer assim):**

```
╔══════════════════════════════════════╗
║  ⚪ FUNDO BRANCO                    ║
║                                      ║
║  🔴 Logo                            ║
║  Email ou telefone                   ║
║  Senha                               ║
║  Entrar                              ║
║  Google Facebook Apple               ║
║                                      ║
║  (SEM CORES, SEM CAIXA PRETA)       ║
╚══════════════════════════════════════╝
```

Se aparecer ERRADO → Veja seção **"PROBLEMAS"** abaixo

---

## 🐛 PROBLEMAS E SOLUÇÕES

### ❌ **Problema 1: Estilos não carregam (fundo branco)**

**Sintomas:**
- Fundo branco ao invés de vermelho
- Botões cinza ao invés de vermelho
- Sem bordas arredondadas

**Solução Rápida:**

1. Pare o servidor (`Ctrl + C`)
2. Cole no PowerShell:
   ```powershell
   npm cache clean --force
   npm install
   npm run dev
   ```
3. No navegador: `Ctrl + Shift + R`

**Solução Completa (se a rápida não funcionar):**

Cole TUDO de uma vez no PowerShell:
```powershell
taskkill /F /IM node.exe 2>$null
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm cache clean --force
npm install
npm run dev
```

---

### ❌ **Problema 2: "npm não é reconhecido"**

**Causa:** Node.js não está instalado

**Solução:**

1. Baixe o Node.js: https://nodejs.org/
2. Escolha a versão **LTS** (recomendada)
3. Instale (Next, Next, Finish)
4. **FECHE E ABRA NOVAMENTE** o PowerShell
5. Teste: `node --version`
6. Deve aparecer: `v18.x.x` ou maior

---

### ❌ **Problema 3: "A porta 5173 já está em uso"**

**Solução 1 - Matar processo:**
```powershell
taskkill /F /IM node.exe
npm run dev
```

**Solução 2 - Usar outra porta:**
```powershell
npm run dev -- --port 3000
```

Depois abra: http://localhost:3000

---

### ❌ **Problema 4: "Cannot find module 'vite'"**

**Solução:**
```powershell
npm install
npm run dev
```

---

### ❌ **Problema 5: Erro de permissão**

**Solução - Executar como Administrador:**

1. Clique direito no PowerShell
2. "Executar como administrador"
3. Rode os comandos novamente

---

### ❌ **Problema 6: "Execution Policy"**

**Erro:**
```
cannot be loaded because running scripts is disabled
```

**Solução:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## 📋 CHECKLIST PASSO A PASSO

Use esta lista para não esquecer nada:

### **Antes de começar:**
- [ ] Node.js instalado (versão >= 18)
- [ ] Projeto baixado e extraído
- [ ] PowerShell aberto na pasta do projeto

### **Instalação:**
- [ ] `npm install` executado com sucesso
- [ ] Aguardou 2-5 minutos
- [ ] Sem erros em vermelho

### **Execução:**
- [ ] `npm run dev` executado
- [ ] Mensagem "ready in X ms" apareceu
- [ ] URL `http://localhost:5173` foi exibida

### **Navegador:**
- [ ] Navegador abriu automaticamente
- [ ] OU abriu manualmente o link
- [ ] Pressionou `Ctrl + Shift + R`

### **Visual (deve ter):**
- [ ] Fundo vermelho degradê
- [ ] Caixa preta centralizada
- [ ] Logo com brilho vermelho
- [ ] Campos brancos arredondados
- [ ] Botão "Entrar" vermelho
- [ ] Botões sociais coloridos

Se TUDO estiver ✅ → **FUNCIONANDO!**

---

## 🎬 COMO USAR O SITE

### **1. Login**
- **Email:** qualquer@email.com (demo)
- **Senha:** qualquer senha (demo)
- Ou clique nos botões sociais (Google, Facebook, Apple)

### **2. Selecionar Perfil**
- Clique em um perfil existente
- Ou clique "Adicionar Perfil"

### **3. Navegar**
- **Início:** Filmes e séries em destaque
- **Filmes:** Catálogo completo (500.000+ filmes)
- **Séries:** Catálogo completo (100.000+ séries)
- **Canais:** IPTV ao vivo (centenas de canais)
- **Kids:** Conteúdo infantil + 5 jogos
- **Busca:** Busca avançada com filtros

### **4. Assistir**
- Clique em qualquer card de filme/série
- Veja detalhes, elenco, trailer
- Clique "Assistir"
- Player abre com controles completos

### **5. Gerenciar**
- **Minha Lista:** Adicione favoritos
- **Continuar Assistindo:** Retome de onde parou
- **Histórico:** Veja tudo que assistiu
- **Favoritos:** Marque como favorito

---

## 🔧 COMANDOS ÚTEIS

### **Verificar se Node está instalado:**
```powershell
node --version
npm --version
```

### **Limpar tudo e reinstalar:**
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm cache clean --force
npm install
```

### **Ver logs detalhados:**
```powershell
npm run dev --verbose
```

### **Parar servidor:**
```
Ctrl + C
```

### **Abrir DevTools no navegador:**
```
F12
```

---

## 🆘 AINDA NÃO FUNCIONA?

### **Me diga:**

1. **Qual comando você rodou?**
   ```
   Exemplo: npm install
   ```

2. **Qual erro apareceu?**
   ```
   Copie a mensagem de erro completa
   ```

3. **Versões:**
   ```powershell
   node --version
   npm --version
   ```

4. **Sistema:**
   - Windows 10 ou 11?
   - 32 bits ou 64 bits?

5. **Print do erro:**
   - Tire print da tela
   - Print do PowerShell
   - Print do navegador (F12 → Console)

---

## 📞 SCRIPTS AUTOMÁTICOS

Se preferir, use os scripts prontos:

### **Script 1: corrigir-estilos.bat**
- Clique 2x no arquivo
- Faz tudo automaticamente
- ✅ Mais fácil!

### **Script 2: corrigir-estilos.ps1**
- Abra PowerShell
- Digite: `.\corrigir-estilos.ps1`
- Pressione Enter

---

## 🎯 RESULTADO FINAL

Depois de seguir este guia, você terá:

✅ **RedFlix Platform funcionando**
- 500.000+ filmes (TMDB)
- 100.000+ séries (TMDB)
- Centenas de canais IPTV
- Player de vídeo completo
- Sistema de login e perfis
- Design Netflix/RedFlix perfeito
- Responsivo (funciona em qualquer tamanho)

✅ **Todas as 80+ funcionalidades:**
- Login social
- Busca avançada
- Minha Lista
- Continuar Assistindo
- Histórico
- Favoritos
- Kids + Jogos
- IPTV
- Soccer
- Top 10
- Dashboard
- E muito mais!

---

## 🚀 ATALHOS DE TECLADO

### **PowerShell:**
- `Ctrl + C` → Parar servidor
- `Ctrl + L` → Limpar tela
- `Ctrl + V` → Colar
- `↑` → Comando anterior

### **Navegador:**
- `F12` → Abrir DevTools
- `Ctrl + Shift + R` → Hard reload
- `Ctrl + Shift + I` → Inspecionar elemento
- `F5` → Reload normal
- `Ctrl + +` → Zoom in
- `Ctrl + -` → Zoom out

---

## 📚 DOCUMENTAÇÃO COMPLETA

Leia também:

- 📄 `README.md` → Documentação principal
- 📄 `COMECE_AQUI.txt` → Início rápido
- 📄 `INSTALACAO_COMPLETA.md` → Guia detalhado
- 📄 `SOLUCAO_ESTILOS_QUEBRADOS.md` → Problemas de CSS

---

## 🎉 PRONTO!

**Seu RedFlix está funcionando!**

Aproveite sua assinatura e assista a:
- 🎬 Milhares de filmes
- 📺 Milhares de séries
- 📡 Centenas de canais ao vivo
- 🎮 Jogos interativos (página Kids)

**BOM ENTRETENIMENTO! 🍿🎬**

---

<div align="center">

**Problemas? Abra uma issue ou me contate!**

⭐ **Deixe uma estrela no projeto!** ⭐

</div>
