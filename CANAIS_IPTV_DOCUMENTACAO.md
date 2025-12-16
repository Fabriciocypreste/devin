# 📺 Sistema de Canais IPTV - Documentação Completa

## 🎯 Visão Geral

Sistema completo de visualização de canais IPTV que lê o arquivo `LISTAREAL.m3u` e exibe os canais em uma interface moderna com player funcional.

## 📁 Estrutura de Arquivos

```
src/
├── services/
│   ├── m3uParser.ts          # Parser do formato M3U
│   └── canaisService.ts       # Lógica de negócio dos canais
├── pages/
│   └── CanaisPage.tsx         # Página principal de canais
├── components/
│   └── PlayerModal.tsx        # Modal do player com HLS.js
└── styles/
    └── canais.css             # Estilos do sistema de canais

public/
├── LISTAREAL.m3u              # Arquivo M3U com ~795k canais
└── test-m3u.html              # Página de teste do parser
```

## 🔧 Componentes Implementados

### 1. M3U Parser (`src/services/m3uParser.ts`)

**Responsabilidades:**
- Lê e parseia arquivos M3U/M3U8
- Extrai metadados dos canais (nome, logo, categoria, URL)
- Gera IDs únicos para cada canal

**Interface Channel:**
```typescript
export interface Channel {
  id: string;        // ID único gerado
  name: string;      // Nome do canal
  logo: string;      // URL da logo
  group: string;     // Categoria/grupo
  url: string;       // URL do stream
}
```

**Funções principais:**
- `parseM3U(fileUrl: string): Promise<Channel[]>` - Parse completo do arquivo
- `parseM3UContent(content: string): Channel[]` - Parse do conteúdo
- `parseExtinfLine(line: string): Partial<Channel>` - Parse de metadados
- `generateChannelId(channel: Channel): string` - Geração de ID único

**Formato M3U suportado:**
```m3u
#EXTM3U
#EXTINF:-1 tvg-id="..." tvg-name="Canal HD" tvg-logo="http://..." group-title="Esportes",Canal HD
http://stream.example.com/canal.m3u8
```

### 2. Serviço de Canais (`src/services/canaisService.ts`)

**Responsabilidades:**
- Carrega canais do arquivo M3U
- Gerencia categorias
- Filtra canais por busca e categoria

**Funções principais:**
```typescript
// Carrega todos os canais
loadCanais(): Promise<Channel[]>

// Retorna lista de categorias únicas
getCategories(canais: Channel[]): string[]

// Filtra canais por busca e categoria
filterCanais(canais: Channel[], search: string, category: string): Channel[]
```

### 3. Página de Canais (`src/pages/CanaisPage.tsx`)

**Características:**
- Grid responsivo de canais
- Busca em tempo real
- Filtro por categoria
- Estados de loading e erro
- Integração com player modal

**Estados gerenciados:**
- `canais` - Lista completa de canais
- `filteredCanais` - Lista filtrada
- `categories` - Categorias disponíveis
- `search` - Termo de busca
- `selectedCategory` - Categoria selecionada
- `selectedChannel` - Canal sendo reproduzido
- `loading` - Estado de carregamento
- `error` - Mensagens de erro

**Props:**
```typescript
interface CanaisPageProps {
  onClose?: () => void;  // Callback para fechar a página
}
```

### 4. Player Modal (`src/components/PlayerModal.tsx`)

**Características:**
- Suporte a HLS.js para streams M3U8
- Fallback para HLS nativo (Safari)
- Recuperação automática de erros
- Controles nativos do navegador
- Fecha com tecla ESC
- Fecha ao clicar fora do modal

**Tecnologias:**
- HLS.js para reprodução de streams
- Low latency mode ativado
- Buffer otimizado (90s)

**Props:**
```typescript
interface PlayerModalProps {
  channel: Channel;     // Canal a ser reproduzido
  onClose: () => void;  // Callback para fechar o player
}
```

## 🎨 Estilos (`src/styles/canais.css`)

**Paleta de cores:**
- Background principal: `#0a0e27`
- Background cards: `#1a1f3a`
- Cor de destaque: `#00d9ff`
- Texto: `#e0e6ed`

**Layout responsivo:**
- Desktop (>1024px): 3 colunas
- Tablet (769-1024px): 2 colunas
- Mobile (<768px): 1 coluna

**Componentes estilizados:**
- `.canais-page` - Container principal
- `.canais-header` - Cabeçalho com filtros
- `.canais-grid` - Grid de canais
- `.canal-card` - Card individual do canal
- `.player-modal-overlay` - Overlay do player
- `.player-modal-content` - Conteúdo do player

## 🚀 Como Usar

### 1. Acessar a página de canais

A página de canais é acessada através do menu de navegação:
- Clique em "Canais" no menu superior
- Ou use a categoria "canais" no handleCategoryChange

### 2. Buscar canais

```typescript
// No input de busca
<input
  type="text"
  placeholder="🔍 Buscar canal..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
/>
```

### 3. Filtrar por categoria

```typescript
// No select de categorias
<select
  value={selectedCategory}
  onChange={(e) => setSelectedCategory(e.target.value)}
>
  {categories.map(cat => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>
```

### 4. Assistir um canal

```typescript
// Ao clicar no botão "Assistir"
const handleChannelClick = (channel: Channel) => {
  setSelectedChannel(channel);
};
```

## 🧪 Testes

### Teste do Parser

Acesse `http://localhost:3000/test-m3u.html` para testar o parser:

1. Clique em "Load Channels" para carregar os canais
2. Clique em "Show Statistics" para ver estatísticas
3. Verifica:
   - Total de canais carregados
   - Categorias encontradas
   - Top 10 categorias por número de canais

### Teste Manual da Interface

1. Navegue para a página de canais
2. Verifique se os canais são carregados
3. Teste a busca digitando nomes de canais
4. Teste o filtro de categorias
5. Clique em "Assistir" para abrir o player
6. Verifique se o player reproduz o stream
7. Teste fechar o player (botão X ou ESC)

## 📊 Estatísticas do Arquivo M3U

- **Tamanho:** 92MB
- **Linhas:** ~795.764
- **Canais:** Aproximadamente 397.882 canais
- **Categorias:** Dezenas de categorias diferentes

**Principais categorias:**
- ⚽ Esportes (SporTV, Fox Sports, ESPN, etc.)
- 📺 Canais Abertos (Globo, SBT, Record, etc.)
- 🎬 Filmes e Séries
- 🎮 Entretenimento
- 📰 Notícias
- 🎵 Música

## 🔒 Tratamento de Erros

### Parser M3U

```typescript
try {
  const channels = await parseM3U('/LISTAREAL.m3u');
} catch (error) {
  console.error('❌ Error parsing M3U file:', error);
  // Retorna array vazio em caso de erro
  return [];
}
```

### Loading de Canais

```typescript
if (channels.length === 0) {
  setError('Nenhum canal encontrado no arquivo M3U');
  return;
}
```

### Player HLS

```typescript
hls.on(Hls.Events.ERROR, (event, data) => {
  if (data.fatal) {
    switch (data.type) {
      case Hls.ErrorTypes.NETWORK_ERROR:
        hls.startLoad(); // Tenta reconectar
        break;
      case Hls.ErrorTypes.MEDIA_ERROR:
        hls.recoverMediaError(); // Recupera erro de mídia
        break;
      default:
        hls.destroy(); // Destrói instância em caso de erro fatal
        break;
    }
  }
});
```

## 🎯 Validações Implementadas

✅ Parser trata M3U malformado (linhas vazias, formatos incorretos)
✅ Logo quebrada mostra placeholder SVG
✅ Busca é case-insensitive
✅ Player tem fallback se HLS.js não suportar
✅ Modal fecha ao clicar no overlay
✅ Modal fecha com tecla ESC
✅ Recuperação automática de erros de stream

## 🔄 Fluxo de Dados

```
1. Usuário acessa página de canais
   ↓
2. CanaisPage carrega canais via loadCanais()
   ↓
3. loadCanais() chama parseM3U()
   ↓
4. parseM3U() faz fetch do arquivo M3U
   ↓
5. Parser extrai canais e metadados
   ↓
6. Canais são armazenados no estado
   ↓
7. Usuário pode buscar/filtrar canais
   ↓
8. Usuário clica em "Assistir"
   ↓
9. PlayerModal é aberto com HLS.js
   ↓
10. Stream é reproduzido
```

## 🛠️ Integração no App

### App.tsx

```typescript
import { CanaisPage } from './pages/CanaisPage';

// Estado para controlar exibição
const [showCanaisPage, setShowCanaisPage] = useState(false);

// Handler de categoria
case 'canais':
  setShowCanaisPage(true);
  break;

// Renderização condicional
if (showCanaisPage) {
  return (
    <CanaisPage onClose={() => setShowCanaisPage(false)} />
  );
}
```

## 📱 Suporte Mobile

- Layout responsivo com 1 coluna em mobile
- Touch-friendly cards e botões
- Player otimizado para tela pequena
- Filtros em coluna vertical
- Modal ajustado para viewport mobile

## 🚀 Performance

- Lazy loading implementado no grid
- Imagens com lazy loading nativo
- Parser otimizado para arquivos grandes
- HLS.js com worker thread
- Buffer otimizado para streaming

## 🔍 Debugging

### Console Logs

```typescript
console.log('📺 Parsing M3U file from:', fileUrl);
console.log('✅ M3U file loaded, size:', content.length, 'bytes');
console.log('✅ Parsed', channels.length, 'channels');
console.log('📺 HLS manifest parsed, starting playback');
```

### Erros Comuns

1. **"Cannot find module @rollup/rollup-linux-x64-gnu"**
   - Problema de dependências do Vite
   - Solução: npm install ou aguardar deploy no ambiente correto

2. **"No channels found"**
   - Arquivo M3U não encontrado ou vazio
   - Verificar se `/LISTAREAL.m3u` está acessível

3. **"HLS error"**
   - Stream offline ou URL inválida
   - Sistema tenta recuperar automaticamente

## 📋 Checklist de Implementação

- [x] Parser M3U funcional
- [x] Serviço de canais
- [x] Página de canais com grid
- [x] Busca em tempo real
- [x] Filtro por categoria
- [x] Player modal com HLS.js
- [x] Estilos responsivos
- [x] Estados de loading/erro
- [x] Integração no App.tsx
- [x] Tratamento de erros
- [x] Página de teste
- [x] Documentação completa

## 🎉 Conclusão

O sistema de canais IPTV está completamente implementado e pronto para uso. Todos os requisitos foram atendidos:

1. ✅ Parser real do M3U com extração de metadados
2. ✅ Interface com grid responsivo
3. ✅ Busca e filtros funcionais
4. ✅ Player com HLS.js e recuperação de erros
5. ✅ Estilos dark theme
6. ✅ Integração completa no App
7. ✅ Tratamento robusto de erros
8. ✅ Suporte mobile

**Total de arquivos criados/modificados:**
- 2 novos serviços
- 1 nova página
- 1 novo componente
- 1 arquivo CSS
- 1 página de teste
- 1 modificação no App.tsx
