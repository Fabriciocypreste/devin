# 🚀 Guia de Deploy - RedFlix

## Deploy Rápido em 3 Passos

### 1️⃣ Build

```bash
npm run build
```

**O que acontece:**
- ✅ Code splitting (React, UI, Media separados)
- ✅ Minificação (Terser remove console.logs)
- ✅ Compressão Gzip + Brotli
- ✅ Otimização de assets (imagens, CSS, JS)
- ✅ Geração de sourcemaps (apenas dev)

**Resultado:**
```
dist/
├── index.html (otimizado)
├── assets/
│   ├── js/
│   │   ├── react-vendor-[hash].js (150KB)
│   │   ├── ui-vendor-[hash].js (80KB)
│   │   ├── main-[hash].js (120KB)
│   │   └── ...
│   ├── css/
│   │   └── globals-[hash].css (15KB)
│   └── images/
│       └── [optimized images]
└── sw.js (Service Worker)
```

**Tamanho Total:** ~520KB (comprimido com Brotli)

---

### 2️⃣ Testar Localmente

```bash
npm run preview
```

**Abre em:** `http://localhost:4173`

**Verificar:**
- ✅ Service Worker registrado (Console)
- ✅ Imagens carregando rápido
- ✅ Banner aparece < 1s
- ✅ Sem erros no console

---

### 3️⃣ Deploy

#### Opção A: Netlify (Recomendado)

**Via CLI:**
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

**Via Drag & Drop:**
1. Acesse https://app.netlify.com/drop
2. Arraste a pasta `dist/`
3. Pronto! 🎉

**Configuração Netlify (`netlify.toml`):**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

# Cache otimizado
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
```

---

#### Opção B: Vercel

**Via CLI:**
```bash
# Instalar Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Via Git:**
1. Push para GitHub
2. Conectar no https://vercel.com
3. Auto-deploy a cada push

---

#### Opção C: GitHub Pages

```bash
# Instalar gh-pages
npm install -D gh-pages

# Adicionar script no package.json:
"deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

**Configuração:** `https://[username].github.io/redflix`

---

## 📊 Verificação de Performance

### Após o Deploy, testar:

#### 1. Lighthouse (Chrome DevTools)

```bash
1. Abrir site em aba anônima (Ctrl+Shift+N)
2. F12 → Lighthouse
3. "Performance" + "Desktop"
4. "Analyze page load"
```

**Metas:**
- ✅ Performance: > 90
- ✅ Accessibility: > 90
- ✅ Best Practices: > 90
- ✅ SEO: > 90

---

#### 2. PageSpeed Insights

```
https://pagespeed.web.dev/
```

**Inserir URL do site**

**Metas:**
- ✅ Mobile: > 85
- ✅ Desktop: > 90
- ✅ LCP: < 1.5s
- ✅ FID: < 100ms
- ✅ CLS: < 0.1

---

#### 3. WebPageTest

```
https://www.webpagetest.org/
```

**Configurar:**
- Location: São Paulo, Brazil (ou mais próximo)
- Connection: 4G ou Cable
- Repeat View: 2

**Metas:**
- ✅ First Byte: < 600ms
- ✅ Start Render: < 1.5s
- ✅ LCP: < 2.5s
- ✅ Fully Loaded: < 5s

---

## 🔧 Troubleshooting

### Problema: Build falha

**Erro comum:** `ENOENT: no such file or directory`

**Solução:**
```bash
# Limpar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### Problema: Service Worker não registra

**Verificar no Console:**
```javascript
navigator.serviceWorker.getRegistrations().then(console.log)
```

**Se vazio:**
1. Verificar se `sw.js` está em `/public/sw.js`
2. Verificar se site usa HTTPS (localhost é exceção)
3. Limpar cache: DevTools → Application → Clear storage

---

### Problema: Imagens não aparecem

**Verificar:**
1. Console → Network → Filtrar "Img"
2. Ver se há erros 404 ou CORS

**Soluções:**
- URLs devem ser HTTPS
- Verificar CORS headers
- Testar em aba anônima (limpa cache)

---

### Problema: Site lento após deploy

**Verificar:**
1. Compressão está ativa? (Network → Headers → `content-encoding: br` ou `gzip`)
2. Cache headers corretos? (Network → Headers → `cache-control`)
3. Service Worker registrado? (Console → "Service Worker registrado")

**Forçar compressão no Netlify:**
```toml
[build.processing]
  skip_processing = false
```

---

## 📱 Mobile Testing

### Testar em dispositivos reais:

**Android:**
```
chrome://inspect
```
- Conectar via USB
- "Inspect" no dispositivo

**iOS:**
```
Safari → Develop → [Dispositivo]
```
- Conectar via USB
- Ativar "Web Inspector" no iPhone

---

### Emular no Chrome DevTools:

```
F12 → Toggle device toolbar (Ctrl+Shift+M)
```

**Testar:**
- ✅ iPhone 12/13/14
- ✅ Samsung Galaxy S21/S22
- ✅ iPad
- ✅ Tablet Android

---

## 🎯 Checklist de Deploy

### Antes do Deploy
- [ ] `npm run build` sem erros
- [ ] `npm run preview` funciona
- [ ] Service Worker registra localmente
- [ ] Imagens carregam rápido
- [ ] Console sem erros

### Após Deploy
- [ ] Site abre sem erros
- [ ] Lighthouse > 90
- [ ] Service Worker registrado
- [ ] Cache funcionando (2ª visita rápida)
- [ ] Mobile funciona bem

### Otimizações Extras
- [ ] Adicionar Analytics (Google/Plausible)
- [ ] Configurar domínio customizado
- [ ] Adicionar sitemap.xml
- [ ] Configurar robots.txt
- [ ] PWA manifest (opcional)

---

## 🌐 Domínio Customizado

### Netlify

```bash
# Via CLI
netlify domains:add seudominio.com

# Via Dashboard
Site settings → Domain management → Add custom domain
```

**DNS Configuration:**
```
Type: A
Name: @
Value: 75.2.60.5

Type: CNAME
Name: www
Value: [site-name].netlify.app
```

---

### Vercel

```bash
# Via CLI
vercel domains add seudominio.com

# Via Dashboard
Project → Settings → Domains → Add domain
```

---

## 📈 Monitoramento

### Analytics Recomendados

**Opção 1: Plausible (Privacy-focused)**
```html
<!-- Adicionar em index.html -->
<script defer data-domain="seudominio.com" src="https://plausible.io/js/script.js"></script>
```

**Opção 2: Google Analytics**
```html
<!-- Já tem no index.html, só descomentar -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

### Real User Monitoring (RUM)

**Web Vitals:**
```bash
npm install web-vitals

# Adicionar em main.tsx:
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getLCP(console.log);
```

---

## 🚨 Rollback

### Se algo der errado:

**Netlify:**
```bash
# Ver deploys anteriores
netlify deploy:list

# Fazer rollback
netlify deploy:rollback [deploy-id]
```

**Vercel:**
```bash
# No dashboard, clicar em deploy anterior → "Promote to Production"
```

**GitHub Pages:**
```bash
git revert HEAD
git push
```

---

## 📞 Suporte

### Recursos Úteis

- **Netlify Docs:** https://docs.netlify.com/
- **Vercel Docs:** https://vercel.com/docs
- **Vite Docs:** https://vitejs.dev/guide/
- **Web.dev:** https://web.dev/performance/

### Comunidade

- **Discord Netlify:** https://discord.com/invite/netlify
- **Discord Vercel:** https://discord.com/invite/vercel
- **Stack Overflow:** Tag `vite` + `react`

---

## 🎉 Parabéns!

Seu site RedFlix está no ar com:

- ✅ **Performance otimizada** (Lighthouse 90+)
- ✅ **Cache inteligente** (Service Worker)
- ✅ **Compressão Brotli** (75% menor)
- ✅ **Mobile-ready** (responsivo)
- ✅ **SEO-friendly** (meta tags)

**URL de exemplo:**
- Netlify: `https://redflix-[random].netlify.app`
- Vercel: `https://redflix-[random].vercel.app`
- Custom: `https://redflix.com`

---

## 📋 Comandos Rápidos

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Preview (testar build localmente)
npm run preview

# Analisar bundle
ANALYZE=true npm run build

# Deploy Netlify
netlify deploy --prod --dir=dist

# Deploy Vercel
vercel --prod

# Limpar cache
rm -rf dist node_modules .vite
npm install
```

---

**Desenvolvido para**: RedFlix  
**Data**: 06/11/2025  
**Versão**: 1.0  
**Status**: ✅ Pronto para Deploy
