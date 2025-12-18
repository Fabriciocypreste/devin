# Redflix Streaming Platform

Uma plataforma de streaming moderna construída com React, Vite e Supabase.

## 🚀 Instalação

### Opção 1: Script Automático (Recomendado)

**Windows:**
```bash
npm run install:clean
```
ou execute diretamente:
```bash
install-deps.bat
```

**Linux/Mac:**
```bash
chmod +x install-deps.sh
./install-deps.sh
```
ou use o script npm:
```bash
npm run install:clean
```

### Opção 2: Manual

```bash
# 1. Limpar tudo
rm -rf node_modules package-lock.json
cd src
rm -rf node_modules package-lock.json
cd ..

# 2. Instalar na raiz
npm install

# 3. Instalar no src
cd src
npm install
cd ..

# 4. Rodar
npm run dev
```

## 🏃 Como Executar

Após a instalação, execute:

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview do build de produção
- `npm run install:clean` - Limpa e reinstala todas as dependências
- `npm run dev:electron` - Inicia versão Electron

## ⚠️ Problemas Comuns

### Erro: "@supabase/supabase-js" não encontrado

**Causa:** Dependências não instaladas corretamente ou cache corrompido.

**Solução:**
```bash
# Limpar cache e reinstalar
npm run install:clean

# OU manualmente:
npm uninstall @supabase/supabase-js
npm install @supabase/supabase-js
cd src
npm install @supabase/supabase-js
cd ..
npm run dev
```

### Erro: "Failed to resolve entry for package"

**Causa:** Pacote corrompido ou instalação incompleta.

**Solução:**
```bash
# Remover node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Build não funciona

**Solução:**
```bash
# Limpar cache do npm
npm cache clean --force

# Reinstalar tudo
npm run install:clean

# Tentar build novamente
npm run build
```

## 📚 Documentação Adicional

- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) - Guia completo de solução de problemas
- [SETUP_COMPLETE.md](SETUP_COMPLETE.md) - Guia de configuração completo
- [AUTHENTICATION_GUIDE.md](AUTHENTICATION_GUIDE.md) - Guia de autenticação

## 🔧 Tecnologias

- React 18
- Vite 7
- TypeScript
- Tailwind CSS
- Supabase
- React Router DOM

## 📝 Licença

Este projeto é privado e proprietário
