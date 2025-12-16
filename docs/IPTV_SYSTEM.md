# 📺 Sistema de Canais IPTV - REDFLIX

## 🎯 Visão Geral

Sistema completo de canais IPTV integrado ao REDFLIX, utilizando o arquivo `LISTAREAL.m3u` com **397.881 canais** organizados em **125 categorias**.

## ✨ Funcionalidades Principais

### 1. Parser M3U Inteligente
- **Arquivo**: `src/services/m3uParser.ts`
- **Função**: Parse completo do arquivo LISTAREAL.m3u (795.764 linhas)
- **Extração de metadados**:
  - `tvg-name`: Nome do canal
  - `tvg-logo`: URL da logo
  - `tvg-id`: ID do canal
  - `group-title`: Categoria
  - Stream URL (.ts)

### 2. Proteção de Conteúdo Adulto 🔒
- **Arquivo**: `src/utils/adultContentProtection.ts`
- **Detecção Automática**: 579 canais adultos identificados
- **Categorias Protegidas**:
  - ADULTOS
  - ✨XXX ADULTOS
  - ✨XXX ONLYFANS
  - Series | ONLYFANS

#### Sistema de Senha
- **Senha Padrão**: `1234` (configurável)
- **Sessão**: 30 minutos
- **Armazenamento**: `sessionStorage`
- **Indicador**: Timer visual mostrando tempo restante

### 3. Interface de Usuário

#### Header
```tsx
📺 Canais IPTV
397.881 canais disponíveis
[🔒 Área Adulta] ou [🔓 Área Adulta Ativa (25min)]
```

#### Filtros
- **Busca**: Campo de texto para filtrar por nome do canal
- **Categoria**: Dropdown com 125 categorias
- **Limpar**: Botão para resetar filtros

#### Grid de Canais
- **Layout Responsivo**:
  - 📱 Mobile: 1 coluna
  - 📱 Tablet: 2 colunas  
  - 💻 Desktop: 3-5 colunas
- **Card do Canal**:
  - Logo do canal (ou placeholder)
  - Nome do canal
  - Badge da categoria
  - Badge "AO VIVO" 🔴
  - Ícone 🔒 para canais adultos bloqueados
  - Hover: Botão ▶️ Assistir ou 🔒 Desbloquear

### 4. Player de Vídeo
- **Arquivo**: `src/components/PlayerModal.tsx`
- **Tecnologia**: HLS.js para streams .ts
- **Recursos**:
  - Fullscreen
  - Controles nativos HTML5
  - Tratamento de erros
  - Retry automático
  - Informações do canal no topo
  - Atalhos do teclado:
    - `Esc`: Fechar player
    - `F`: Toggle fullscreen

## 📊 Estatísticas do Sistema

| Métrica | Valor |
|---------|-------|
| **Canais Totais** | 397.881 |
| **Categorias** | 125 |
| **Canais Adultos** | 579 |
| **Tamanho M3U** | 91.41 MB |
| **Linhas no Arquivo** | 795.764 |

## 🚀 Como Usar

### 1. Acessar Página de Canais
```tsx
// No App.tsx, o usuário pode acessar via:
setShowCanaisPage(true);
// Ou através do menu de navegação
```

### 2. Buscar Canais
1. Digite o nome do canal no campo de busca
2. Ou selecione uma categoria no dropdown
3. Clique em "Limpar Filtros" para resetar

### 3. Assistir um Canal
1. Clique no card do canal desejado
2. Se for um canal adulto bloqueado, será solicitada a senha
3. O player abrirá em fullscreen
4. Use os controles nativos ou atalhos do teclado

### 4. Desbloquear Área Adulta
1. Clique no botão "🔒 Área Adulta" no header
2. Digite a senha: `1234`
3. A sessão durará 30 minutos
4. O botão mudará para "🔓 Área Adulta Ativa (Xmin)"

## 🔐 Configuração de Senha

Para alterar a senha padrão, edite o arquivo:
```typescript
// src/utils/adultContentProtection.ts
const ADULT_PASSWORD = '1234'; // Altere aqui
```

Para alterar a duração da sessão:
```typescript
// src/utils/adultContentProtection.ts
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos em ms
```

## 🏗️ Arquitetura do Sistema

```
src/
├── services/
│   └── m3uParser.ts          # Parser do M3U, funções de busca e filtro
├── utils/
│   └── adultContentProtection.ts  # Sistema de proteção por senha
├── components/
│   ├── PasswordModal.tsx     # Modal de autenticação
│   └── PlayerModal.tsx       # Player de vídeo fullscreen
└── pages/
    └── CanaisPage.tsx        # Página principal de canais
```

## 🎨 Design

### Cores
- **Background**: `#0a0a0a` (preto profundo)
- **Cards**: `#181818` (cinza escuro)
- **Accent**: `#E50914` (vermelho Netflix)
- **Text**: `#ffffff` (branco)

### Efeitos
- **Hover**: Scale 1.05, borda vermelha
- **Glassmorphism**: Backdrop blur nos modais
- **Transições**: 300ms cubic-bezier

## 🐛 Tratamento de Erros

### Parser M3U
```typescript
// Se o arquivo não for encontrado:
throw new Error('LISTAREAL.m3u não encontrado');

// Se nenhum canal for parseado:
throw new Error('Nenhum canal encontrado no LISTAREAL.m3u');
```

### Player de Vídeo
- **Erro de Rede**: Tenta novamente automaticamente
- **Erro de Mídia**: Recuperação automática via HLS.js
- **Stream Offline**: Mensagem "Canal pode estar offline"
- **Botão "Tentar Novamente"** disponível em todos os erros

## 📱 Responsividade

| Breakpoint | Grid | Descrição |
|------------|------|-----------|
| < 640px | 1 col | Mobile portrait |
| 640px - 1024px | 2 cols | Tablet |
| 1024px - 1280px | 3 cols | Desktop small |
| 1280px - 1536px | 4 cols | Desktop medium |
| > 1536px | 5 cols | Desktop large |

## 🔍 Algoritmo de Detecção de Conteúdo Adulto

```typescript
function isAdultChannel(group: string): boolean {
  const groupLower = group.toLowerCase();
  const adultCategories = [
    'adultos',
    '✨xxx adultos',
    '✨xxx onlyfans',
    'series | onlyfans'
  ];
  return adultCategories.some(category => 
    groupLower === category
  );
}
```

**Importante**: A detecção é feita APENAS por categoria, não por nome do canal. Isso evita falsos positivos em títulos de filmes como "Whindersson Nunes Adulto" ou "MaXXXine".

## 🎯 Próximos Passos

- [ ] Implementar favoritos de canais
- [ ] Adicionar histórico de visualização
- [ ] Criar playlists personalizadas
- [ ] EPG (guia de programação)
- [ ] Filtro por qualidade (4K, FHD, HD, SD)
- [ ] Modo picture-in-picture
- [ ] Chromecast support

## 📝 Notas Técnicas

- O arquivo LISTAREAL.m3u está na raiz do projeto (`/LISTAREAL.m3u`)
- Os streams usam formato .ts (MPEG Transport Stream)
- HLS.js é necessário para navegadores que não suportam HLS nativamente
- Safari tem suporte nativo HLS e não precisa de HLS.js
- A sessão de acesso adulto é perdida ao fechar o navegador (sessionStorage)

## 🤝 Contribuindo

Para adicionar novas funcionalidades ou corrigir bugs:

1. Crie uma branch com nome descritivo
2. Faça suas alterações
3. Teste com diferentes tipos de canais
4. Submeta um Pull Request

## 📄 Licença

Este sistema faz parte do projeto REDFLIX.
