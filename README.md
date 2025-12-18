# RedFlix Streaming Platform

Uma plataforma de streaming moderna construída com React, Vite, e Supabase.

## 📦 Instalação

### 1. Instalar dependências na raiz

```bash
npm install
```

### 2. Instalar dependências na pasta src/

```bash
cd src
npm install
cd ..
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env` e adicione suas credenciais:

```env
# TMDB API
VITE_TMDB_API_KEY=your_tmdb_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**Onde encontrar as credenciais:**

- **TMDB API Key**: Obtenha em https://www.themoviedb.org/settings/api
- **Supabase URL e Keys**: Obtenha em https://supabase.com/dashboard → Settings → API

### 4. Executar o projeto

```bash
npm run dev
```

O projeto estará disponível em http://localhost:3000

## 🔧 Comandos Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm run dev:electron` - Executa versão Electron

## 📝 Notas Importantes

- Sempre instale as dependências tanto na **raiz** quanto na pasta **src/**
- Nunca commite o arquivo `.env` (já está protegido pelo `.gitignore`)
- Consulte `AUTHENTICATION_GUIDE.md` para mais detalhes sobre autenticação

## 🆘 Problemas Comuns

### Erro: "Failed to resolve entry for package @supabase/supabase-js"

**Solução:** Execute `npm install` dentro da pasta `src/`:

```bash
cd src
npm install
cd ..
npm run dev
```
