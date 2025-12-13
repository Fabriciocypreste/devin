# 🎬 RedFlix Platform - Plataforma de Streaming Completa

<div align="center">

![RedFlix Logo](http://chemorena.com/redfliz.png)

**Plataforma completa de streaming com mais de 80 funcionalidades**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.1.6-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

</div>

---

## 🚀 Início Rápido

```bash
# 1. Clone o repositório
git clone <seu-repositorio>
cd redflix-platform

# 2. Instale as dependências
npm install

# 3. Execute o projeto
npm run dev
```

**Pronto!** Abra http://localhost:5173 e veja a mágica acontecer! ✨

---

## ✨ Funcionalidades

### 🔐 Autenticação
- ✅ Login com email/senha
- ✅ Login social (Google, Facebook, Apple)
- ✅ Cadastro de usuários
- ✅ Seleção de perfis múltiplos
- ✅ Gerenciamento de perfis
- ✅ Dashboard do usuário

### 🎥 Conteúdo
- ✅ **Filmes** (integração TMDB)
- ✅ **Séries** (integração TMDB)
- ✅ **Canais IPTV** (integração GitHub)
- ✅ **Kids** (conteúdo infantil + jogos interativos)
- ✅ **Soccer** (futebol ao vivo)
- ✅ **RedFlix Originals**
- ✅ **Bombando** (trending)

### 🔍 Busca e Descoberta
- ✅ Busca avançada (multi-filtro)
- ✅ Busca por idioma
- ✅ Filtros por gênero
- ✅ Ordenação (popularidade, data, rating)
- ✅ Top 10 semanal
- ✅ Em alta (trending)

### 📺 Player de Vídeo
- ✅ Player HTML5 nativo
- ✅ Suporte HLS (m3u8)
- ✅ Controles customizados
- ✅ Picture-in-Picture
- ✅ Legendas
- ✅ Múltiplas qualidades

### 📚 Biblioteca Pessoal
- ✅ Minha Lista
- ✅ Continuar Assistindo
- ✅ Histórico completo
- ✅ Favoritos
- ✅ Ver Depois

### 🎨 Design
- ✅ Paleta Netflix (#E50914)
- ✅ Logo oficial RedFlix
- ✅ Design responsivo (desktop + mobile)
- ✅ Animações suaves
- ✅ Dark mode nativo
- ✅ Imagens otimizadas (244×137px)

### 🛠️ Administração
- ✅ Dashboard administrativo
- ✅ Gerenciamento de conteúdo
- ✅ Monitoramento de performance
- ✅ Status do banco de dados
- ✅ Diagnósticos do sistema

---

## 🏗️ Tecnologias

### Frontend
- **React 18.3.1** - UI Library
- **TypeScript 5.4.2** - Type Safety
- **Tailwind CSS 4.0.0** - Styling
- **Vite 5.1.6** - Build Tool
- **Lucide React** - Icons
- **Radix UI** - Accessible Components

### Backend
- **Supabase** - Database + Auth + Storage
- **Hono** - Edge Functions
- **TMDB API** - Filmes e Séries
- **GitHub** - IPTV Content Source

### Player
- **HLS.js** - Streaming Protocol
- **HTML5 Video** - Native Player

---

## 📂 Estrutura do Projeto

```
redflix-platform/
├── src/
│   ├── components/              # Componentes React
│   │   ├── Login.tsx           # Tela de login
│   │   ├── NetflixHeader.tsx   # Header principal
│   │   ├── MovieCard.tsx       # Card de filme/série
│   │   ├── Player.tsx          # Player de vídeo
│   │   ├── KidsPage.tsx        # Página kids + jogos
│   │   ├── IPTVPage.tsx        # IPTV completo
│   │   └── ...                 # +80 componentes
│   ├── styles/
│   │   └── globals.css         # Estilos globais (Tailwind v4)
│   ├── utils/                  # Utilitários
│   │   ├── tmdbApi.ts          # API TMDB
│   │   ├── primeVicioLoader.ts # Loader GitHub
│   │   └── imageCache.ts       # Cache de imagens
│   ├── types/                  # TypeScript types
│   ├── contexts/               # React Contexts
│   │   └── AuthContext.tsx     # Autenticação
│   ├── App.tsx                 # Componente principal
│   └── main.tsx                # Entry point
├── supabase/
│   └── functions/              # Edge Functions
│       └── server/
│           └── index.tsx       # Hono server
├── public/                     # Arquivos estáticos
├── package.json                # Dependências
├── vite.config.ts              # Configuração Vite
└── tsconfig.json               # TypeScript config
```

---

## 🎯 Como Usar

### **1. Tela de Login**
- Email: qualquer email
- Senha: qualquer senha (demo mode)
- Ou use login social

### **2. Selecionar Perfil**
- Escolha um perfil existente
- Ou crie um novo perfil

### **3. Explorar Conteúdo**
- **Início**: Filmes e séries em destaque
- **Filmes**: Catálogo completo de filmes
- **Séries**: Catálogo completo de séries
- **Canais**: IPTV com centenas de canais
- **Kids**: Conteúdo infantil + jogos
- **Soccer**: Futebol ao vivo
- **Busca**: Busca avançada com filtros

### **4. Assistir**
- Clique em qualquer conteúdo
- Veja detalhes, trailer, elenco
- Clique em "Assistir"
- Player abre com controles completos

### **5. Gerenciar**
- Adicione à "Minha Lista"
- Marque como favorito
- Veja histórico completo
- Continue de onde parou

---

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento (hot reload)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Análise de bundle
npm run analyze
```

---

## 🌐 URLs

- **Local**: http://localhost:5173
- **Network**: http://192.168.x.x:5173 (LAN)

---

## 🎨 Paleta de Cores

```css
--redflix-red: #E50914;      /* Vermelho principal */
--redflix-dark: #141414;     /* Fundo escuro */
--redflix-black: #000000;    /* Preto */
--redflix-gray: #808080;     /* Cinza */
--redflix-white: #FFFFFF;    /* Branco */
```

---

## 📱 Responsivo

- ✅ **Desktop** (1920×1080)
- ✅ **Laptop** (1366×768)
- ✅ **Tablet** (768×1024)
- ✅ **Mobile** (375×667)

---

## 🔒 Segurança

- ✅ Autenticação Supabase
- ✅ JWT Tokens
- ✅ HTTPS obrigatório
- ✅ CORS configurado
- ✅ Environment variables protegidas
- ✅ Service Role Key no servidor

---

## 🐛 Solução de Problemas

### **Estilos não carregam?**

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run dev
```

No navegador: `Ctrl + Shift + R`

### **Porta 5173 ocupada?**

```bash
npm run dev -- --port 3000
```

### **Erros de módulo?**

```bash
npm install
```

Veja mais em: [INSTALACAO_COMPLETA.md](./INSTALACAO_COMPLETA.md)

---

## 📚 Documentação

- 📄 [INSTALACAO_COMPLETA.md](./INSTALACAO_COMPLETA.md) - Guia completo de instalação
- 📄 [CORRECAO_URGENTE.txt](./CORRECAO_URGENTE.txt) - Correção de estilos
- 📄 [SOLUCAO_ESTILOS_QUEBRADOS.md](./SOLUCAO_ESTILOS_QUEBRADOS.md) - Diagnóstico CSS

---

## 🚀 Deploy

### **Vercel**
```bash
npm run build
vercel --prod
```

### **Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### **GitHub Pages**
```bash
npm run build
# Faça upload da pasta dist/
```

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças grandes:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto é de uso pessoal/educacional.

**APIs e Integrações:**
- TMDB: https://www.themoviedb.org/
- Supabase: https://supabase.com/
- GitHub: https://github.com/Fabriciocypreste/lista.git

---

## 🎉 Agradecimentos

- **TMDB** - Banco de dados de filmes
- **Supabase** - Backend completo
- **Vercel** - Deploy e hospedagem
- **Tailwind CSS** - Framework CSS
- **React** - UI Library

---

## 📞 Suporte

Problemas? Abra uma issue ou me contate!

---

## 🔄 Atualizações Recentes

### **v1.0.0** (2025-11-28)
- ✅ Migração para Tailwind v4
- ✅ Correção de estilos CSS
- ✅ Otimização de performance
- ✅ Melhorias no player
- ✅ Bug fixes gerais

---

<div align="center">

**Feito com ❤️ e ☕ para a comunidade**

⭐ **Deixe uma estrela se este projeto te ajudou!** ⭐

</div>
