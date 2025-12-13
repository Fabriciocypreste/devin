# 🏗️ BUILD LOCAL - RedFlix Platform

## 📦 Pré-requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 ou **yarn** >= 1.22.0

## 🚀 Instalação e Build

### 1. Instalar Dependências

```bash
npm install
# ou
yarn install
```

### 2. Modo Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O servidor de desenvolvimento será iniciado em:
```
http://localhost:3000
```

### 3. Build para Produção

```bash
npm run build
# ou
yarn build
```

A pasta `dist/` será criada com todos os arquivos otimizados.

### 4. Preview da Build

```bash
npm run preview
# ou
yarn preview
```

Visualize a build de produção localmente em:
```
http://localhost:4173
```

### 5. Análise do Bundle (Opcional)

```bash
npm run analyze
# ou
yarn analyze
```

Um arquivo `dist/stats.html` será gerado mostrando:
- Tamanho de cada chunk
- Tamanho gzip/brotli
- Dependências e imports

---

## 📁 Estrutura da Build

Após executar `npm run build`, a pasta `dist/` terá:

```
dist/
├── index.html                 # HTML principal
├── assets/
│   ├── js/                    # JavaScript otimizado e minificado
│   │   ├── react-vendor-[hash].js
│   │   ├── ui-vendor-[hash].js
│   │   ├── radix-vendor-[hash].js
│   │   ├── media-vendor-[hash].js
│   │   └── [name]-[hash].js
│   ├── css/                   # CSS otimizado
│   │   └── [name]-[hash].css
│   ├── images/                # Imagens otimizadas (WebP, minificadas)
│   │   └── [name]-[hash].{png,jpg,svg,webp}
│   └── fonts/                 # Fontes
│       └── [name]-[hash].{woff,woff2,ttf}
└── data/                      # JSONs e M3U
    ├── canais.json
    └── lista.m3u
```

---

## ⚙️ Otimizações Incluídas

### Build Otimizada
✅ **Minificação com Terser** - Remove console.logs e debuggers
✅ **Code Splitting** - Chunks separados por vendor
✅ **Tree Shaking** - Remove código não usado
✅ **CSS Code Split** - CSS separado por rota
✅ **Compressão Gzip + Brotli** - Assets comprimidos

### Imagens
✅ **Otimização automática** - PNG, JPG, SVG minificados
✅ **Conversão WebP** - Imagens convertidas para WebP
✅ **Lazy Loading** - Carregamento sob demanda
✅ **Cache inteligente** - Sistema de cache de imagens

### Performance
✅ **Chunks < 1MB** - Limite configurado
✅ **Assets inline < 4KB** - Pequenos assets como base64
✅ **Prefetch crítico** - Recursos principais pré-carregados
✅ **Service Worker** - Cache offline PWA

---

## 🌐 Deploy

### Opção 1: Servidor Estático (Vercel, Netlify, etc)

1. Faça o build:
```bash
npm run build
```

2. Configure o deploy apontando para a pasta `dist/`

3. Configure variáveis de ambiente (se necessário):
```env
VITE_TMDB_API_KEY=sua_api_key
VITE_SUPABASE_URL=sua_supabase_url
VITE_SUPABASE_ANON_KEY=sua_anon_key
```

### Opção 2: Servidor Node.js

1. Instale um servidor estático:
```bash
npm install -g serve
```

2. Sirva a pasta dist:
```bash
serve -s dist -p 3000
```

### Opção 3: Apache/Nginx

1. Copie o conteúdo de `dist/` para o diretório do servidor

2. Configure `.htaccess` (Apache) ou `nginx.conf`:

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
  
  # Cache estático
  location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
}
```

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz:

```env
# TMDB API
VITE_TMDB_API_KEY=sua_api_key_tmdb

# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_anon_key

# Opcional
VITE_API_BASE_URL=https://api.exemplo.com
```

### Ajustar Otimizações

Edite `vite.config.ts` conforme necessário:

```typescript
// Desabilitar compressão (desenvolvimento)
viteCompression({
  disable: true,
})

// Manter console.logs
terserOptions: {
  compress: {
    drop_console: false,
  }
}

// Ajustar limite de chunk
chunkSizeWarningLimit: 2000, // 2MB
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module"
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Build muito lenta
```bash
# Desabilitar plugins de otimização temporariamente
# Comente viteImagemin e viteCompression no vite.config.ts
```

### Erro de memória no build
```bash
# Aumentar memória do Node
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

### Assets não carregam
- Verifique se `publicDir` está correto no `vite.config.ts`
- Confirme que `index.html` está na raiz
- Verifique console do navegador para erros CORS

---

## 📊 Métricas Esperadas

### Tamanho da Build
- **Total:** ~2-3 MB (antes da compressão)
- **Gzip:** ~600-800 KB
- **Brotli:** ~500-700 KB

### Chunks Principais
- `react-vendor`: ~150 KB
- `radix-vendor`: ~200 KB
- `ui-vendor`: ~100 KB
- `main`: ~400 KB

### Performance
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3.5s
- **Lighthouse Score:** > 90

---

## 📚 Recursos

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TMDB API](https://www.themoviedb.org/documentation/api)

---

## ✅ Checklist de Deploy

- [ ] Build executado com sucesso
- [ ] Assets otimizados (imagens, CSS, JS)
- [ ] Variáveis de ambiente configuradas
- [ ] Testes em navegadores (Chrome, Firefox, Safari)
- [ ] Testes mobile (iOS, Android)
- [ ] Service Worker funcionando (offline)
- [ ] SEO configurado (meta tags, sitemap)
- [ ] Analytics integrado (Google Analytics, etc)
- [ ] Monitoramento de erros (Sentry, etc)

---

**Status:** ✅ Pronto para Build Local
**Última Atualização:** Novembro 2024
**Compatibilidade:** Node.js 18+, React 18+, Vite 5+
