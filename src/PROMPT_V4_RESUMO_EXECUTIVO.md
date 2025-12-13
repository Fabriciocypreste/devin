# 🎬 PROMPT V4 - RESUMO EXECUTIVO

**RedFlix IPTV - Especificação Rápida**

---

## 🚨 REGRA DE OURO

```
❌ NÃO MODIFICAR: Layout, Menus, Cores, Fontes, Espaçamento
✅ APENAS ADICIONAR: Funcionalidades Técnicas
🖼️ IMAGENS FIXAS: 244 × 137 px
```

---

## 📋 MENU (NÃO ALTERAR)

```
Início | Séries | Filmes | Bombando | Navegar por idiomas | Canais | Futebol | Minha lista
```

---

## ⚙️ FUNCIONALIDADES

### 1. Player HLS
```tsx
import Hls from 'hls.js';
// Reproduz .ts e .m3u8
// Controles: play/pause, volume, fullscreen, favoritar
// Fechar: ESC ou X
```

### 2. Supabase
```sql
-- Tabela: conteudo
id, nome, grupo, url, tipo, logo, poster, favorito, atualizado_em

-- URL M3U:
http://api.cdnapp.fun:80/playlist/new_app/Q24Wb98eYc/m3u_plus
```

### 3. Parser M3U
```tsx
// Streaming incremental
// Sem limite de linhas
// Suporte 10k+ canais
// Logs de progresso
```

### 4. Cache (3 Camadas)
```
Memory → IndexedDB → Supabase → HTTP
```

### 5. Imagens
```css
width: 244px;
height: 137px;
aspect-ratio: 16/9;
loading: lazy;
fallback: sem_logo.png;
```

---

## 🧩 ESTRUTURA

```
components/
├── IPTVPlayer.tsx       ✅ Player HLS
├── MediaCard.tsx        ✅ Card 244×137
└── CanaisPage.tsx       ✅ Grid + Filtros

utils/
├── parseM3U.ts          ✅ Parser streaming
├── carregarListaSupabase.ts ✅ Sync
└── cacheLocal.ts        ✅ IndexedDB
```

---

## 🎨 DESIGN (NÃO ALTERAR)

```css
Cores:
--bg-primary: #000000
--accent-red: #E50914
--text-white: #FFFFFF

Fontes:
font-family: 'Inter', sans-serif

Grid:
Mobile: 2 cols
Tablet: 4 cols
Desktop: 6 cols
```

---

## 🧪 LOGS ESPERADOS

```
🚀 RedFlix IPTV iniciado
📡 Buscando conteúdo no Supabase...
✅ 8.421 canais carregados
💾 Sincronizando...
✅ Banco atualizado
🎬 Renderizando canais
```

---

## 📊 PERFORMANCE

```
⏱️ Carregamento: < 3s
📊 Canais: 10.000+
💾 Cache hit: > 90%
🎬 Player: < 500ms
```

---

## 🚀 QUICK START

```bash
# Instalar deps
npm install hls.js @supabase/supabase-js

# Configurar .env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...

# Rodar
npm run dev
```

---

## ✅ CHECKLIST

- [ ] Player HLS funcionando
- [ ] Supabase sincronizando
- [ ] Parser M3U completo
- [ ] Cache 3 camadas ativo
- [ ] Imagens 244×137 px
- [ ] Layout original preservado
- [ ] Performance < 3s

---

**Documentação Completa:** `/PROMPT_MESTRE_FINAL_V4.md`

🎬 **RedFlix IPTV v4.0** 🚀
