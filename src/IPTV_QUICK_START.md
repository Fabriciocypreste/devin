# 🚀 IPTV Quick Start Guide

## Acesso Rápido

### 1. Acessar o IPTV
```
1. Faça login no RedFlix
2. Clique em "IPTV" no menu superior
3. Ou acesse via URL: ?category=iptv
```

### 2. Estrutura de Navegação

```
RedFlix
└── IPTV
    ├── Canais ao Vivo (Tab 1)
    │   ├── Buscar
    │   ├── Filtrar por Categoria
    │   └── Grid/List View
    └── Filmes & Séries (Tab 2)
        ├── Buscar
        ├── Filtrar por Categoria
        └── Grid/List View
```

## 📡 Fontes de Dados

### Listas Oficiais (chemorena.com):
```javascript
Canais: https://chemorena.com/filmes/canaissite.txt
Filmes: https://chemorena.com/filmes/filmes.txt
```

### Como as Listas são Carregadas:

1. **Backend faz fetch** da URL do chemorena.com
2. **Parser M3U** extrai:
   - Nome do canal/filme
   - URL do stream
   - Logo (se disponível)
   - Categoria
3. **Agrupa por categoria** automaticamente
4. **Retorna JSON** para o frontend
5. **Frontend renderiza** os cards

## 🎮 Controles do Player

### Teclado (Desktop):
- `Espaço`: Play/Pause
- `F`: Fullscreen
- `M`: Mute/Unmute
- `Esc`: Fechar player
- `←/→`: Próximo/Anterior (se implementado)

### Mouse:
- `Click no video`: Play/Pause
- `Hover`: Mostrar controles
- `Double-click`: Fullscreen

### Touch (Mobile):
- `Tap`: Play/Pause
- `Tap nos controles`: Ações
- `Swipe`: (reservado para futuro)

## 🔧 Endpoints da API

### 1. Buscar Canais
```bash
GET https://{project}.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/canais
Authorization: Bearer {anon_key}
```

**Response:**
```json
{
  "total": 150,
  "channels": [
    {
      "name": "ESPN Brasil",
      "url": "https://...",
      "logo": "https://...",
      "category": "Esportes",
      "tvgId": "espn-br"
    }
  ],
  "categories": {
    "Esportes": [...],
    "Notícias": [...],
    "Filmes": [...]
  }
}
```

### 2. Buscar Filmes/Séries
```bash
GET https://{project}.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/filmes
Authorization: Bearer {anon_key}
```

### 3. Proxy de Stream
```bash
GET https://{project}.supabase.co/functions/v1/make-server-2363f5d6/iptv/stream-proxy?url={stream_url}
Authorization: Bearer {anon_key}
```

## 🎨 UI Components

### IPTVPage
```typescript
<IPTVPage 
  onClose={() => setShowIPTVPage(false)}
  onCategoryChange={handleCategoryChange}
  onSearchClick={() => setShowSearchOverlay(true)}
  defaultTab="canais" // ou "filmes"
/>
```

### IPTVPlayer
```typescript
<IPTVPlayer
  streamUrl="https://example.com/stream.m3u8"
  title="Nome do Canal"
  onClose={() => setPlaying(false)}
/>
```

## 🐛 Debug Mode

### Verificar Logs:
1. Abra DevTools (F12)
2. Vá para Console
3. Procure por logs com emojis:
   - 📺 Carregamento de canais
   - 🎬 Carregamento de filmes
   - ▶️ Seleção de stream
   - ✅ Sucesso
   - ❌ Erros

### Logs Importantes:
```javascript
// Backend
console.log('📺 Buscando playlist de canais IPTV');
console.log('✅ Playlist carregada: X caracteres');
console.log('✅ X canais parseados');

// Frontend
console.log('📺 Buscando canais IPTV...');
console.log('✅ Canais carregados:', data.total);
console.log('▶️ Selecionando stream:', stream.name);

// Player
console.log('✅ HLS manifest parsed successfully');
console.log('❌ HLS Error:', data);
```

## 🔍 Testar Manualmente

### 1. Testar Backend:
```bash
# Canais
curl "https://{project}.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/canais" \
  -H "Authorization: Bearer {anon_key}"

# Filmes
curl "https://{project}.supabase.co/functions/v1/make-server-2363f5d6/iptv/playlists/filmes" \
  -H "Authorization: Bearer {anon_key}"
```

### 2. Testar Stream Direto:
```html
<!-- Abra no navegador -->
<video controls>
  <source src="https://stream.example.com/live.m3u8" type="application/x-mpegURL">
</video>
```

### 3. Testar Proxy:
```bash
curl "https://{project}.supabase.co/functions/v1/make-server-2363f5d6/iptv/stream-proxy?url=https://stream.example.com/live.m3u8" \
  -H "Authorization: Bearer {anon_key}"
```

## 📦 Estados do Sistema

### Loading States:
```
1. Initial Load → "Carregando conteúdo..."
2. Parsing → "Processando lista..."
3. Ready → Mostra cards
4. Playing → Player fullscreen
5. Error → "Erro ao carregar, Tentar Novamente"
```

### Player States:
```
1. Loading → Spinner + "Carregando stream..."
2. Playing → Video + Controles
3. Paused → Video pausado
4. Error → Mensagem de erro + Botão retry
5. Buffering → Overlay de loading
```

## 🎯 Casos de Uso

### Usuário Final:

**Assistir Canal de Esportes:**
1. Click em "IPTV" no menu
2. Tab "Canais ao Vivo"
3. Filtrar categoria: "Esportes"
4. Click no canal desejado
5. Player abre automaticamente
6. Assistir!

**Buscar Filme Específico:**
1. Click em "IPTV"
2. Tab "Filmes & Séries"
3. Digitar nome na busca
4. Click no resultado
5. Player abre e reproduz

**Alternar Entre Canais:**
1. Clicar em "✕ Fechar" no player
2. Volta para lista de canais
3. Escolher outro canal
4. Novo player abre

## 🔐 Segurança e Permissões

### CORS:
- ✅ Habilitado no backend
- ✅ Proxy seguro para streams externos
- ✅ Headers corretos configurados

### Autenticação:
- Usa `publicAnonKey` do Supabase
- JWT token incluso automaticamente
- Rate limiting do Supabase aplicado

### Disclaimer Legal:
```
⚠️ IMPORTANTE:
Este sistema é para uso educacional e demonstração.
Certifique-se de ter autorização para transmitir
qualquer conteúdo protegido por direitos autorais.
```

## 📱 Experiência Mobile

### Otimizações:
- Layout responsivo
- Touch controls otimizados
- Picture-in-Picture support
- Landscape mode otimizado
- Bottom sheet controls

### Testado em:
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Mobile browsers modernos
- ⚠️ Alguns browsers antigos podem não suportar HLS

## 🚨 Troubleshooting Comum

### "Lista vazia" ou "Erro ao carregar":
**Possível causa**: URL do chemorena.com indisponível
**Solução**: 
1. Verificar conectividade
2. Tentar recarregar (F5)
3. Verificar logs do servidor

### "Stream não reproduz":
**Possível causa**: URL do stream inválida ou CORS
**Solução**:
1. Usar proxy: `/iptv/stream-proxy?url=...`
2. Verificar formato (deve ser m3u8)
3. Testar URL diretamente

### "Player fica carregando infinitamente":
**Possível causa**: Stream offline ou slow
**Solução**:
1. Aguardar 10-15 segundos
2. Fechar e tentar outro canal
3. Verificar conexão internet

### "Controles não aparecem":
**Possível causa**: Mouse não está sobre o player
**Solução**:
1. Mover mouse sobre o vídeo
2. Tocar na tela (mobile)
3. Pressionar qualquer tecla

## 💻 Desenvolvimento

### Adicionar Novo Formato:
```typescript
// Em parseM3UPlaylist()
if (line.startsWith('#EXT-X-')) {
  // Parser para novo formato
}
```

### Adicionar Nova Fonte:
```typescript
// Em IPTVPage.tsx
const fetchCustomSource = async () => {
  const response = await fetch(`${serverUrl}/iptv/playlists/custom`);
  const data = await response.json();
  setCustomContent(data.items);
};
```

### Customizar Player:
```typescript
// Em IPTVPlayer.tsx
const hls = new Hls({
  enableWorker: true,
  lowLatencyMode: true,
  maxBufferLength: 30, // Customizar buffer
  maxMaxBufferLength: 600,
  // ... mais opções HLS.js
});
```

## 🎬 Demonstração

### URLs de Teste Públicas:
```javascript
// Big Buck Bunny (teste)
const testStream = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

// Apple Test Stream
const appleTest = "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8";
```

### Testar com Stream de Exemplo:
```typescript
<IPTVPlayer
  streamUrl="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  title="Test Stream"
  onClose={() => {}}
/>
```

## 📊 Métricas de Performance

### Benchmarks Esperados:
- Carregamento da lista: < 2s
- Parsing M3U: < 500ms
- Busca/Filtro: < 100ms (instant)
- Stream start: 1-3s
- Buffer inicial: 2-5s

### Monitoramento:
```javascript
// Tempo de carregamento
console.time('load-playlist');
await fetchChannels();
console.timeEnd('load-playlist');

// Memória (Chrome DevTools)
Performance Monitor → JS Heap Size
```

---

## ✅ Checklist de Funcionalidade

- [x] Backend endpoints criados
- [x] Parser M3U/TXT implementado
- [x] Player HLS.js integrado
- [x] Interface Smart TV criada
- [x] Navegação integrada ao RedFlix
- [x] Busca e filtros funcionando
- [x] Grid/List view implementados
- [x] Controles do player completos
- [x] Mobile responsivo
- [x] Error handling robusto
- [x] Loading states
- [x] CORS configurado
- [x] Proxy de streams
- [x] Documentação completa

**Status**: ✅ **100% COMPLETO**

---

**Pronto para usar! 🎉**

Para começar, basta acessar a página IPTV pelo menu superior ou através da navegação do RedFlix.
