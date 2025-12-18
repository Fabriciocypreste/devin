# 🎬 RedFlix Platform

Plataforma de streaming completa com React, Vite e Supabase.

## 🚀 Instalação Rápida

### 1. Clonar o repositório
```bash
git clone https://github.com/Fabriciocypreste/devin.git
cd devin
```

### 2. Instalar dependências

**Na raiz:**
```bash
npm install
```

**Na pasta src:**
```bash
cd src
npm install
cd ..
```

### 3. Configurar variáveis de ambiente

```bash
# Copiar o arquivo de exemplo
cp .env.example .env
```

**Edite o arquivo `.env` com suas credenciais:**

```env
# TMDB API - Obtenha em: https://www.themoviedb.org/settings/api
VITE_TMDB_API_KEY=sua_chave_tmdb_aqui

# Supabase - Obtenha em: https://supabase.com/dashboard
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

### 4. Executar o projeto

```bash
npm run dev
```

O projeto estará disponível em: `http://localhost:3000`

## 📦 Estrutura do Projeto

```
devin/
├── src/                    # Código fonte principal
│   ├── components/         # Componentes React
│   ├── contexts/           # Context API (Auth, etc)
│   ├── utils/              # Funções utilitárias
│   └── package.json        # Dependências do frontend
├── backend/                # API Backend (Node.js)
├── admin/                  # Painel administrativo
├── electron/               # Aplicação desktop
├── package.json            # Dependências raiz
├── .env.example            # Exemplo de variáveis de ambiente
└── README.md               # Este arquivo
```

## 🔧 Comandos Disponíveis

```bash
npm run dev          # Desenvolvimento (porta 3000)
npm run build        # Build de produção
npm run preview      # Preview do build
npm run dev:electron # Executar versão Electron desktop
```

## 🐛 Solução de Problemas

### Erro: "Failed to resolve entry for package @supabase/supabase-js"

**Solução:**
```bash
cd src
npm install @supabase/supabase-js
cd ..
npm run dev
```

### Erro: "Missing Supabase environment variables"

**Solução:**
1. Verifique se o arquivo `.env` existe na raiz
2. Confirme que as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão configuradas

## 🔐 Segurança

⚠️ **NUNCA commite o arquivo `.env` no Git!**

O arquivo `.gitignore` já está configurado para ignorar `.env`, mas sempre verifique antes de fazer commit.

## 📄 Licença

ISC

## 👤 Autor

Fabriciocypreste
