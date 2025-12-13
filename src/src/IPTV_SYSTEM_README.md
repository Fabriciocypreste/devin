# RedFlix IPTV System - Complete Documentation

## 📺 Visão Geral

Sistema completo de IPTV integrado ao RedFlix, seguindo o PRD fornecido. Permite reprodução de canais ao vivo, filmes e séries via streaming HLS/M3U8 com interface estilo Smart TV.

## 🎯 Funcionalidades Principais

### 1. **Backend - Endpoints IPTV**
Localização: `/supabase/functions/server/index.tsx`

#### Endpoints Criados:

**GET `/make-server-2363f5d6/iptv/playlists/canais`**
- Busca e faz parsing da lista de canais do chemorena.com
- URL fonte: `https://chemorena.com/filmes/canaissite.txt`
- Retorna JSON com canais parseados e agrupados por categoria
```json
{
  "total": 150,
  "channels": [...],
  "categories": {
    "Esportes": [...],
    "Filmes": [...],
    "Notícias": [...]
  }
}
```

**GET `/make-server-2363f5d6/iptv/playlists/filmes`**
- Busca e faz parsing da lista de filmes/séries
- URL fonte: `https://chemorena.com/filmes/filmes.txt`
- Retorna JSON com filmes/séries parseados e agrupados

**GET `/make-server-2363f5d6/iptv/stream-proxy?url=<stream_url>`**
- Proxy para streams com CORS habilitado
- Aceita parâmetro `url` com a URL do stream
- Adiciona headers CORS necessários
- Suporta HLS (m3u8) e outros formatos

#### Parser M3U/TXT
Função `parseM3UPlaylist()` implementada para:
- Ler formato M3U com `#EXTINF:`
- Extrair metadados: logo, categoria, nome
- Suportar TXT com URLs diretas
- Agrupar por categoria automaticamente

### 2. **Player IPTV**
Componente: `/components/IPTVPlayer.tsx`

#### Tecnologias:
- **HLS.js** - Player principal para streams HLS
- **Native HLS** - Fallback para Safari/iOS
- **React Hooks** - Gerenciamento de estado

#### Recursos do Player:
✅ Play/Pause  
✅ Controle de volume  
✅ Mute/Unmute  
✅ Fullscreen  
✅ Picture-in-Picture (PiP)  
✅ Configurações de qualidade  
✅ Auto-hide dos controles  
✅ Detecção e recuperação de erros  
✅ Loading states  
✅ Responsivo (mobile + desktop)  

#### Tratamento de Erros:
- Network Error → Reconexão automática
- Media Error → Recuperação de mídia
- Fatal Error → Exibição de mensagem ao usuário

### 3. **Interface IPTV**
Componente: `/components/IPTVPage.tsx`

#### Design Estilo Smart TV:
- Background gradiente escuro premium
- Cards de canais/filmes com hover effects
- Categorias filtráveis
- Busca em tempo real
- Toggle entre Grid/List view

#### Funcionalidades:
- **Tabs**: Canais ao Vivo | Filmes & Séries
- **Busca**: Input com filtro em tempo real
- **Filtros**: Por categoria/gênero
- **View Modes**: Grid (cards) ou List (linhas)
- **Loading States**: Spinner durante carregamento
- **Error Handling**: Mensagens amigáveis com retry

#### Layouts:

**Grid View:**
```
┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐
│Logo │ │Logo │ │Logo │ │Logo │
│     │ │     │ │     │ │     │
└─────┘ └─────┘ └─────┘ └─────┘
  Nome    Nome    Nome    Nome
```

**List View:**
```
┌─────────────────────────────────────┐
│ [Logo] Nome do Canal    [Play >]    │
├─────────────────────────────────────┤
│ [Logo] Nome do Canal    [Play >]    │
└─────────────────────────────────────┘
```

### 4. **Integração com RedFlix**

#### Navegação:
Adicionado no `NetflixHeader`:
```
Início | Séries | Filmes | Bombando | IPTV | ...
```

#### Roteamento:
No `App.tsx`:
- State: `showIPTVPage`
- Handler: `case 'iptv':` em `handleCategoryChange()`
- Render condicional com página IPTV

## 🔧 Configuração Técnica

### Requisitos:
- **HLS.js** - Já incluído via import
- **Supabase Functions** - Backend Deno com Hono
- **CORS habilitado** - Para streams externos

### URLs das Listas:
```javascript
const CANAIS_URL = "https://chemorena.com/filmes/canaissite.txt";
const FILMES_URL = "https://chemorena.com/filmes/filmes.txt";
```

### Headers CORS (Backend):
```javascript
{
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/vnd.apple.mpegurl',
  'Cache-Control': 'no-store'
}
```

## 📱 Responsividade

### Mobile:
- Layout adaptativo com breakpoints
- Touch-friendly controls
- Swipe support
- Bottom navigation integrada

### Desktop:
- Fullscreen player
- Keyboard shortcuts
- Mouse hover effects
- Grid responsivo (2-6 colunas)

## 🎨 Design System

### Cores:
- **Primary**: `#E50914` (Red RedFlix)
- **Background**: Gradiente `from-[#0a0a0a] via-[#141414] to-[#1a0a0f]`
- **Cards**: `bg-gray-800/50` com hover `bg-gray-800/60`
- **Borders**: `border-gray-700` hover `border-[#E50914]`

### Componentes UI:
- Lucide React Icons (Tv, Film, Play, etc.)
- TailwindCSS para estilização
- Gradientes e glassmorphism

## 🚀 Como Usar

### Para Usuários:

1. **Acesse IPTV**:
   - Clique em "IPTV" no menu superior
   - Ou navegue via Bottom Nav (mobile)

2. **Escolha o Tipo**:
   - Tab "Canais ao Vivo" para TV
   - Tab "Filmes & Séries" para VOD

3. **Busque/Filtre**:
   - Use a barra de busca
   - Selecione uma categoria
   - Alterne entre Grid/List

4. **Assista**:
   - Clique em qualquer item
   - Player abre em fullscreen
   - Use controles para ajustar

### Para Desenvolvedores:

#### Adicionar Nova Fonte:
```javascript
// Em /supabase/functions/server/index.tsx
app.get("/make-server-2363f5d6/iptv/playlists/nova-fonte", async (c) => {
  const url = "https://example.com/playlist.m3u";
  const response = await fetch(url);
  const text = await response.text();
  const items = parseM3UPlaylist(text);
  return c.json({ items });
});
```

#### Customizar Player:
```typescript
// Em /components/IPTVPlayer.tsx
<IPTVPlayer
  streamUrl="https://stream.example.com/live.m3u8"
  title="Nome do Canal"
  onClose={() => setPlaying(false)}
/>
```

## 🔒 Segurança

### Backend:
- ✅ Proxy seguro via Supabase Functions
- ✅ CORS configurado corretamente
- ✅ Rate limiting (Supabase nativo)
- ✅ Logs de acesso

### Frontend:
- ✅ Validação de URLs
- ✅ Error boundaries
- ✅ Sanitização de inputs
- ⚠️ **Disclaimer**: Uso apenas para conteúdo autorizado

## 📊 Performance

### Otimizações:
- Lazy loading de componentes
- Cache de playlists (TTL curto)
- Streaming via proxy (sem bufferização completa)
- HLS adaptativo (ajuste automático de qualidade)

### Métricas Esperadas:
- **Startup**: < 2s
- **Busca**: Instantânea (client-side)
- **Stream Start**: 1-3s (depende da fonte)

## 🐛 Troubleshooting

### Stream não carrega:
1. Verificar console: logs do HLS.js
2. Testar URL diretamente no navegador
3. Verificar CORS via DevTools
4. Tentar usar o proxy: `/iptv/stream-proxy?url=...`

### Lista vazia:
1. Verificar conectividade com chemorena.com
2. Ver logs do servidor no Supabase
3. Validar formato M3U/TXT
4. Usar fallback se necessário

### Player não funciona:
1. Verificar suporte HLS no navegador
2. Testar em Safari (HLS nativo)
3. Verificar formato do stream (deve ser m3u8)
4. Atualizar HLS.js se necessário

## 📝 Formato das Listas

### M3U Esperado:
```m3u
#EXTM3U
#EXTINF:-1 tvg-id="canal1" tvg-logo="https://logo.png" group-title="Esportes",ESPN
https://stream.example.com/espn/live.m3u8
#EXTINF:-1 tvg-id="canal2" tvg-logo="https://logo2.png" group-title="Filmes",HBO
https://stream.example.com/hbo/live.m3u8
```

### TXT Simples:
```
https://stream1.example.com/live.m3u8
https://stream2.example.com/live.m3u8
https://stream3.example.com/live.m3u8
```

## 🎯 Roadmap Futuro

- [ ] EPG (Guia de Programação Eletrônico)
- [ ] Gravação de programas
- [ ] Timeshift (pausar TV ao vivo)
- [ ] Multi-view (assistir vários canais)
- [ ] Chromecast support
- [ ] Legendas/Closed Captions
- [ ] Controle parental
- [ ] Histórico de visualização
- [ ] Recomendações personalizadas

## 📚 Referências

- **HLS.js Documentation**: https://github.com/video-dev/hls.js/
- **M3U Format**: https://en.wikipedia.org/wiki/M3U
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **PRD Original**: Fornecido pelo cliente

---

**Versão**: 1.0  
**Data**: 06/11/2025  
**Status**: ✅ Completo e Funcional

---

## 💡 Dicas

1. **Melhor experiência**: Use Chrome/Edge para HLS.js ou Safari para HLS nativo
2. **Mobile**: Player funciona em PiP para multitasking
3. **Performance**: Lista Grid consome menos recursos que List em muitos itens
4. **Qualidade**: Player ajusta automaticamente baseado na conexão

## 🆘 Suporte

Para problemas ou dúvidas:
1. Verificar logs do console (F12)
2. Testar em modo anônimo (desabilitar extensões)
3. Limpar cache do navegador
4. Verificar status do Supabase Functions

**Desenvolvido com ❤️ para RedFlix**
