# 📺 Canais IPTV - Conteúdo Real Licenciado

## ✅ Status: Configurado para Carregar Conteúdo Real

A página de Canais está **configurada para carregar seu conteúdo real** do arquivo `canaissite.txt`.

---

## 🔧 Configuração Atual

### URL do Arquivo
```
https://chemorena.com/filmes/canaissite.txt
```

### Sistema de Carregamento

O sistema tenta carregar os canais em 2 etapas:

**1. Tentativa Direta**
```javascript
fetch('https://chemorena.com/filmes/canaissite.txt')
```
- Mais rápido
- Pode falhar por CORS (Cross-Origin)

**2. Via Proxy do Servidor** (Fallback)
```javascript
fetch('https://[projeto].supabase.co/functions/v1/make-server-2363f5d6/proxy-m3u?url=...')
```
- Contorna problemas de CORS
- Requer servidor Edge Function rodando

---

## 📊 Como Verificar Se Está Carregando Corretamente

### 1. Abrir Console do Navegador

**Chrome/Edge:**
- Pressione `F12` ou `Ctrl+Shift+I`

**Firefox:**
- Pressione `F12` ou `Ctrl+Shift+K`

### 2. Acessar Página de Canais

Clique em "Canais" no menu lateral.

### 3. Verificar Logs no Console

Você verá logs detalhados mostrando o processo:

#### ✅ **SUCESSO - Carregamento Direto**
```
📺 ═══════════════════════════════════════════════════════
📺 CARREGANDO CANAIS REAIS DO SERVIDOR
📺 URL: https://chemorena.com/filmes/canaissite.txt
📺 ═══════════════════════════════════════════════════════
🔄 Tentativa 1: Carregamento direto...
✅ SUCESSO - Carregado direto: 45678 caracteres
✅ Primeiros 100 caracteres: #EXTM3U...
🔄 Parseando conteúdo M3U8...
✅ 250 canais parseados
✅ ═══════════════════════════════════════════════════════
✅ CANAIS REAIS CARREGADOS COM SUCESSO!
✅ Total de canais: 250
✅ Total de grupos: 15
✅ Grupos: Esportes, Filmes, Séries, Notícias...
✅ ═══════════════════════════════════════════════════════
📋 Amostra dos primeiros 5 canais:
  1. ESPN HD [Esportes]
     Logo: https://exemplo.com/espn.png
     Stream: https://...
```

#### ⚠️ **CORS Bloqueado - Tentando Proxy**
```
⚠️ Tentativa 1 FALHOU (esperado por CORS): ...
🔄 Tentativa 2: Via proxy do servidor...
📡 URL do proxy: https://...
✅ SUCESSO - Carregado via proxy: 45678 caracteres
```

#### ❌ **ERRO - Usando Canais Demo**
```
❌ Tentativa 2 FALHOU: ...
📺 Usando canais de demonstração...
```

---

## 🎯 Formato do Arquivo M3U8

Seu arquivo `canaissite.txt` deve estar no formato M3U8:

```m3u
#EXTM3U

#EXTINF:-1 tvg-logo="https://exemplo.com/logo1.png" group-title="Esportes",ESPN HD
https://stream.exemplo.com/espn.m3u8

#EXTINF:-1 tvg-logo="https://exemplo.com/logo2.png" group-title="Filmes",HBO HD
https://stream.exemplo.com/hbo.m3u8

#EXTINF:-1 tvg-logo="https://exemplo.com/logo3.png" group-title="Séries",FOX HD
https://stream.exemplo.com/fox.m3u8
```

### Campos Reconhecidos

- `#EXTINF:` - Início da definição do canal
- `tvg-logo="..."` - URL do logo do canal (opcional)
- `group-title="..."` - Grupo/categoria do canal (opcional)
- `tvg-id="..."` - ID do canal (opcional)
- `,Nome do Canal` - Nome exibido (depois da vírgula)
- Próxima linha = URL do stream

---

## 🔍 Estrutura dos Canais Carregados

Cada canal carregado tem a seguinte estrutura:

```typescript
{
  id: 1,                                           // ID único
  name: "ESPN HD",                                 // Nome do canal
  logo: "https://exemplo.com/espn.png",          // URL do logo
  streamUrl: "https://stream.exemplo.com/espn",  // URL do stream
  group: "Esportes",                              // Grupo/categoria
  tvgId: "espn-hd"                                // ID do EPG (opcional)
}
```

---

## 📱 Interface da Página de Canais

### Layout

```
┌─────────────────────────────────────────────────┐
│  CANAIS IPTV                                    │
│                                                 │
│  [🔍 Buscar...]  [▼ Grupo: Todos]             │
│                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ ESPN │  │ HBO  │  │ FOX  │  │ CNN  │      │
│  │  HD  │  │  HD  │  │  HD  │  │  HD  │      │
│  └──────┘  └──────┘  └──────┘  └──────┘      │
│                                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐      │
│  │ TNT  │  │ SPORT│  │ GLOB │  │ BAND │      │
│  │  HD  │  │  TV  │  │  HD  │  │  HD  │      │
│  └──────┘  └──────┘  └──────┘  └──────┘      │
│                                                 │
│  Total: 250 canais em 15 grupos                │
└─────────────────────────────────────────────────┘
```

### Funcionalidades

✅ **Busca em tempo real** - Digite para filtrar
✅ **Filtro por grupo** - Esportes, Filmes, Séries, etc
✅ **Grid responsivo** - Adapta ao tamanho da tela
✅ **Logos dos canais** - Carregados do M3U8
✅ **Player integrado** - Clique para assistir
✅ **Contador** - Mostra quantos canais carregados

---

## 🎬 Assistir Canais

### Fluxo de Reprodução

1. **Usuário clica em um canal**
2. **Player HLS abre em modal fullscreen**
3. **Stream começa automaticamente**
4. **Controles de vídeo disponíveis**

### Player

```
┌─────────────────────────────────────────────┐
│  [X] Fechar                ESPN HD          │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │         📺 VÍDEO AO VIVO           │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ████████████░░░░░░░░░  LIVE               │
│  ◀◀  ▶  ▶▶  🔊  ⚙️  ⛶                    │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔧 Troubleshooting

### Problema: Apenas 6 canais (demo)

**Causa:** Arquivo não carregou ou não foi parseado

**Soluções:**

1. **Verificar URL do arquivo:**
   ```
   https://chemorena.com/filmes/canaissite.txt
   ```
   - Abra no navegador
   - Deve baixar ou mostrar o conteúdo M3U8

2. **Verificar formato M3U8:**
   - Arquivo deve começar com `#EXTM3U`
   - Cada canal em formato `#EXTINF` + URL

3. **Verificar logs no console:**
   - F12 para abrir console
   - Procurar por erros em vermelho
   - Verificar qual tentativa falhou

4. **Testar proxy manualmente:**
   ```javascript
   // Cole no console do navegador:
   fetch('https://chemorena.com/filmes/canaissite.txt')
     .then(r => r.text())
     .then(t => console.log('Conteúdo:', t.substring(0, 500)))
     .catch(e => console.error('Erro:', e));
   ```

### Problema: Canais carregam mas não tocam

**Causa:** URL do stream inválida ou bloqueada

**Soluções:**

1. **Verificar URL do stream:**
   - Deve terminar em `.m3u8` ou `.ts`
   - Deve ser HTTPS (não HTTP)

2. **Testar stream manualmente:**
   ```javascript
   // Cole no console:
   const streamUrl = 'https://seu-stream.m3u8';
   fetch(streamUrl, { mode: 'no-cors' })
     .then(() => console.log('✅ Stream acessível'))
     .catch(e => console.error('❌ Stream bloqueado:', e));
   ```

3. **Verificar CORS:**
   - Streams precisam permitir CORS
   - Ou usar proxy do servidor

### Problema: Logos não aparecem

**Causa:** URLs dos logos no M3U8 estão quebradas

**Soluções:**

1. **Verificar tvg-logo no M3U8:**
   ```m3u
   #EXTINF:-1 tvg-logo="https://exemplo.com/logo.png" ...
                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                        URL deve ser válida e pública
   ```

2. **Testar URL do logo:**
   - Abrir URL no navegador
   - Deve mostrar a imagem

3. **Fallback automático:**
   - Sistema usa placeholder se logo não carregar
   - Ícone de TV 📺 será exibido

---

## 📝 Exemplo de Arquivo M3U8 Válido

```m3u
#EXTM3U

#EXTINF:-1 tvg-id="espn.br" tvg-name="ESPN HD" tvg-logo="https://exemplo.com/logos/espn.png" group-title="Esportes",ESPN HD
https://streaming.exemplo.com/espn/master.m3u8

#EXTINF:-1 tvg-id="hbo.br" tvg-name="HBO HD" tvg-logo="https://exemplo.com/logos/hbo.png" group-title="Filmes",HBO HD
https://streaming.exemplo.com/hbo/master.m3u8

#EXTINF:-1 tvg-id="fox.br" tvg-name="FOX HD" tvg-logo="https://exemplo.com/logos/fox.png" group-title="Séries",FOX HD
https://streaming.exemplo.com/fox/master.m3u8

#EXTINF:-1 tvg-id="globo.br" tvg-name="Globo HD" tvg-logo="https://exemplo.com/logos/globo.png" group-title="Canais Abertos",Globo HD
https://streaming.exemplo.com/globo/master.m3u8

#EXTINF:-1 tvg-id="sbt.br" tvg-name="SBT HD" tvg-logo="https://exemplo.com/logos/sbt.png" group-title="Canais Abertos",SBT HD
https://streaming.exemplo.com/sbt/master.m3u8

#EXTINF:-1 tvg-id="band.br" tvg-name="Band HD" tvg-logo="https://exemplo.com/logos/band.png" group-title="Canais Abertos",Band HD
https://streaming.exemplo.com/band/master.m3u8

#EXTINF:-1 tvg-id="record.br" tvg-name="Record HD" tvg-logo="https://exemplo.com/logos/record.png" group-title="Canais Abertos",Record HD
https://streaming.exemplo.com/record/master.m3u8

#EXTINF:-1 tvg-id="sportv.br" tvg-name="SporTV HD" tvg-logo="https://exemplo.com/logos/sportv.png" group-title="Esportes",SporTV HD
https://streaming.exemplo.com/sportv/master.m3u8

#EXTINF:-1 tvg-id="cnn.br" tvg-name="CNN Brasil" tvg-logo="https://exemplo.com/logos/cnn.png" group-title="Notícias",CNN Brasil
https://streaming.exemplo.com/cnn/master.m3u8

#EXTINF:-1 tvg-id="gnt.br" tvg-name="GNT HD" tvg-logo="https://exemplo.com/logos/gnt.png" group-title="Variedades",GNT HD
https://streaming.exemplo.com/gnt/master.m3u8
```

---

## 🎯 Checklist de Verificação

Use este checklist para garantir que tudo está funcionando:

- [ ] Arquivo canaissite.txt está acessível em https://chemorena.com/filmes/canaissite.txt
- [ ] Arquivo começa com `#EXTM3U`
- [ ] Cada canal tem `#EXTINF` seguido de URL do stream
- [ ] URLs dos streams são HTTPS e terminam em .m3u8
- [ ] URLs dos logos são públicas e acessíveis
- [ ] Abri console do navegador (F12)
- [ ] Vi logs "✅ CANAIS REAIS CARREGADOS COM SUCESSO!"
- [ ] Quantidade de canais maior que 6 (não é demo)
- [ ] Grupos corretos aparecem no filtro
- [ ] Posso buscar canais pelo nome
- [ ] Player abre ao clicar em um canal
- [ ] Stream toca corretamente

---

## 📞 Suporte

### Logs Importantes

Ao reportar problemas, sempre inclua:

1. **Console do navegador** (F12)
2. **Tentativas de carregamento** (sucesso/falha)
3. **Quantidade de canais carregados**
4. **Mensagens de erro** (se houver)

### Exemplo de Log Completo

```
📺 ═══════════════════════════════════════════════════════
📺 CARREGANDO CANAIS REAIS DO SERVIDOR
📺 URL: https://chemorena.com/filmes/canaissite.txt
📺 ═══════════════════════════════════════════════════════
🔄 Tentativa 1: Carregamento direto...
⚠️ Tentativa 1 FALHOU (esperado por CORS): TypeError: Failed to fetch
🔄 Tentativa 2: Via proxy do servidor...
📡 URL do proxy: https://xyz.supabase.co/functions/v1/make-server-2363f5d6/proxy-m3u?url=...
✅ SUCESSO - Carregado via proxy: 89456 caracteres
✅ Primeiros 100 caracteres: #EXTM3U #EXTINF:-1 tvg-id="espn.br" ...
🔄 Parseando conteúdo M3U8...
✅ 250 canais parseados
✅ ═══════════════════════════════════════════════════════
✅ CANAIS REAIS CARREGADOS COM SUCESSO!
✅ Total de canais: 250
✅ Total de grupos: 15
✅ Grupos: Esportes, Filmes, Séries, Notícias, Infantil, ...
✅ ═══════════════════════════════════════════════════════
```

---

## ✅ Conclusão

A página de Canais está **100% configurada** para carregar seu conteúdo real de `canaissite.txt`.

O sistema:
- ✅ Tenta carregar direto
- ✅ Usa proxy como fallback
- ✅ Parse automático de M3U8
- ✅ Logs detalhados
- ✅ Fallback para demo apenas em erro

**Basta acessar a página e verificar os logs no console!**

---

**Data:** 19 de novembro de 2025  
**Status:** ✅ CONFIGURADO PARA CONTEÚDO REAL  
**Arquivo:** `/utils/channelsLoader.ts`  
**URL:** `https://chemorena.com/filmes/canaissite.txt`
