# 📺 Sistema de Canais RedFlix - Documentação Completa

## 🎯 Visão Geral

O Sistema de Canais da RedFlix é uma implementação completa de IPTV que carrega automaticamente todos os canais do arquivo `canais.txt` do repositório GitHub, exibindo logos reais, categorizando automaticamente e permitindo reprodução ao vivo.

---

## 📁 Estrutura de Arquivos

### **Arquivo de Dados**
- **`/canais.txt`** - Arquivo principal com lista de canais no formato:
  ```
  NOME|URL_LOGO|URL_STREAM|PROGRAMAS
  ```

### **Componentes Principais**
- **`/components/ChannelsPage.tsx`** - Tela principal de canais com layout IPTV
- **`/components/VideoPlayer.tsx`** - Player de vídeo modal para streaming
- **`/utils/channelsParser.ts`** - Parser e utilitários para processar canais

---

## 🎨 Layout & Design

### **Baseado na Imagem de Referência**
- **Sidebar Esquerda (260px)**: Menu de categorias com design cinematográfico
- **Lista de Canais**: Grid vertical com logos, nomes e botões de ação
- **Player Modal**: Full-screen com controles e programação

### **Paleta de Cores**
```css
Background: #000000
Accent: #E50914 (vermelho RedFlix)
Highlight: #2A2A2A
Text Primary: #FFFFFF
Text Secondary: #B3B3B3
```

### **Tipografia**
- **Fonte Principal**: Montserrat (Semi Bold, Bold, Regular)
- **Tamanhos**: 10px-32px conforme hierarquia

---

## 🔧 Funcionalidades Implementadas

### **1. Carregamento Automático de Canais**
✅ Lê `canais.txt` do GitHub automaticamente  
✅ Fallback para arquivo local se GitHub falhar  
✅ Parser inteligente que extrai: nome, logo, URL, programas  

### **2. Categorização Automática**
Os canais são categorizados automaticamente baseado em padrões no nome:

| Categoria | Palavras-Chave |
|-----------|----------------|
| **ESPORTE** | sport, espn, fox sports, premiere, combate, band sports |
| **INFANTIL** | kids, cartoon, nickelodeon, disney, gloob, nick jr |
| **NOTÍCIAS** | news, cnn, globonews, bandnews, recordnews |
| **FILMES & SÉRIES** | hbo, telecine, paramount, warner, universal, axn, sony |
| **CULTURA** | national geographic, discovery, history, animal planet |
| **VARIEDADES** | mtv, vh1, comedy, tlc, food, hgtv |
| **ABERTOS** | globo, sbt, record, band, redetv |

### **3. Detecção de Qualidade**
✅ **4K/UHD** - Badge vermelho  
✅ **HD** - Badge azul  
✅ **SD** - Sem badge  

### **4. Sistema de Favoritos**
✅ Adicionar/remover canais dos favoritos  
✅ Categoria "LISTA DE FAVORITOS" dedicada  
✅ Ícone de coração preenchido para favoritos  

### **5. Busca em Tempo Real**
✅ Campo de busca no sidebar  
✅ Filtro instantâneo por nome do canal  
✅ Funciona em conjunto com categorias  

### **6. Player de Vídeo**
✅ Modal full-screen com iframe  
✅ Header com logo e nome do canal  
✅ Botão "Programação" para ver programas  
✅ Qualidade e status "Ao Vivo" visíveis  
✅ Fallback visual se stream não carregar  

### **7. Interface Interativa**
✅ **Hover Effects**: Fundo vermelho suave, borda brilhante, escala 1.02  
✅ **Animações**: Motion/React com stagger de entrada  
✅ **Borda Esquerda**: Acende em vermelho ao passar mouse  
✅ **Contador de Canais**: Exibido ao lado de cada categoria  

---

## 📊 Estrutura de Dados

### **Interface Channel**
```typescript
interface Channel {
  id: number;           // ID único sequencial
  name: string;         // Nome do canal
  logo: string;         // URL da logo (Wikipedia/Imgur)
  url: string;          // URL do stream ao vivo
  programs: string[];   // Lista de programas
  category: string;     // Categoria auto-detectada
  quality: string;      // 4K, HD ou SD
}
```

### **Exemplo de Canal Parseado**
```json
{
  "id": 1,
  "name": "ESPN BRASIL UHD",
  "logo": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png",
  "url": "https://stream.espn.com/brasil-uhd",
  "programs": ["SportsCenter", "Futebol no Mundo", "NBA Action"],
  "category": "ESPORTE",
  "quality": "4K"
}
```

---

## 🎬 Fluxo de Uso

### **1. Navegação por Categorias**
1. Usuário clica em categoria no sidebar (ex: "ESPORTE")
2. Lista filtra automaticamente canais daquela categoria
3. Contador atualiza mostrando quantidade de canais

### **2. Busca de Canais**
1. Usuário digita no campo de busca
2. Filtragem em tempo real por nome
3. Funciona em conjunto com categoria ativa

### **3. Assistir Canal**
1. Usuário clica em "Assistir" no card do canal
2. Player modal abre em full-screen
3. Stream carrega automaticamente via iframe
4. Botão "Programação" mostra lista de programas

### **4. Gerenciar Favoritos**
1. Usuário clica no ícone de coração
2. Canal é adicionado/removido dos favoritos
3. Categoria "LISTA DE FAVORITOS" atualiza

---

## 🚀 Performance & Otimizações

### **Lazy Loading de Imagens**
- Logos carregadas sob demanda usando `ImageWithFallback`
- Placeholder transparente se logo falhar

### **Animações Stagger**
- Delay progressivo de 0.02s por item
- Transições suaves de 0.3s
- AnimatePresence para entrada/saída

### **Scrollbar Customizado**
```css
- Largura: 8px
- Cor: #E50914 (vermelho RedFlix)
- Hover: #c41a23 (vermelho mais escuro)
- Track: rgba(255,255,255,0.05)
```

---

## 🎯 Categorias do Menu Lateral

```
1. TODO (Todos os canais)
2. LISTA DE FAVORITOS (Favoritos do usuário)
3. 4K (Apenas canais em 4K/UHD)
4. ESPORTE
5. FILMES & SÉRIES
6. ABERTOS
7. INFANTIL
8. VARIEDADES
9. CULTURA
10. NOTÍCIAS
```

---

## 🔗 Integração com GitHub

### **URL do Repositório**
```
https://github.com/Fabriciocypreste/figma.git
```

### **Carregamento de Dados**
```typescript
// 1ª Tentativa: Arquivo local
const response = await fetch('/canais.txt');

// 2ª Tentativa: GitHub Raw
const githubUrl = 'https://raw.githubusercontent.com/Fabriciocypreste/figma/main/canais.txt';
const githubResponse = await fetch(githubUrl);
```

---

## 📋 Formato do Arquivo `canais.txt`

### **Estrutura de Linha**
```
NOME_DO_CANAL|URL_DA_LOGO|URL_DO_STREAM|PROGRAMA1,PROGRAMA2,PROGRAMA3
```

### **Exemplo Real**
```
ESPN BRASIL UHD|https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png|https://stream.espn.com/brasil-uhd|SportsCenter,Futebol no Mundo,NBA Action
```

### **Regras**
- ✅ Separador: Pipe `|`
- ✅ Programas: Separados por vírgula
- ✅ Logos: URLs completas (preferencialmente HTTPS)
- ✅ Streams: URLs diretas ou embedáveis

---

## 🎨 Elementos Visuais

### **Card de Canal**
- **Logo**: 42x42px com borda arredondada
- **Número**: 001, 002, etc. (3 dígitos)
- **Nome**: Montserrat Bold 16px
- **Categoria**: Montserrat Medium 12px
- **Badge de Qualidade**: 4K vermelho ou HD azul
- **Botão Assistir**: Vermelho #E50914 com ícone play

### **Efeitos de Hover**
```css
Background: de #1a1a1a para #E50914/20
Borda: de white/10 para #E50914/50
Escala: 1.02
Sombra: shadow-[#E50914]/20
Borda Esquerda: Vermelho sólido
```

---

## 🛠️ Manutenção

### **Adicionar Novo Canal**
1. Editar `/canais.txt`
2. Adicionar linha no formato: `NOME|LOGO|URL|PROGRAMAS`
3. Sistema detecta categoria automaticamente
4. Salvar e commitar no GitHub

### **Atualizar Logos**
- Usar URLs do Wikipedia Commons ou Imgur
- Formato recomendado: PNG ou SVG
- Dimensões: Mínimo 200px de largura

### **Modificar Categorias**
- Editar função `detectCategory()` em `/utils/channelsParser.ts`
- Adicionar novos padrões de palavras-chave
- Atualizar array `categories` em `ChannelsPage.tsx`

---

## 📱 Responsividade

### **Desktop (1920x1080+)**
- Sidebar: 260px fixa
- Lista: Grid de 1 coluna, max-width 5xl
- Cards: Width total com espaçamento interno

### **TV Mode**
- Interface otimizada para controle remoto
- Foco visual em cards selecionados
- Navegação por categorias simplificada

---

## 🔮 Recursos Futuros

### **Planejados**
- [ ] EPG (Guia de Programação Eletrônica) ao vivo
- [ ] Gravação de programas
- [ ] Timeshift (pausar TV ao vivo)
- [ ] Múltiplos perfis de favoritos
- [ ] Histórico de visualização
- [ ] Recomendações baseadas em preferências
- [ ] Controle parental por categoria
- [ ] Picture-in-Picture

---

## 🎯 Conformidade com PRD

✅ **Carregar canais do GitHub automaticamente**  
✅ **Logos reais à esquerda do nome (42x42px)**  
✅ **Abrir player ao clicar com link do stream**  
✅ **Layout baseado na imagem de referência**  
✅ **Categorias dinâmicas no sidebar**  
✅ **Efeitos de hover e transições suaves**  
✅ **Modal de programação (EPs)**  
✅ **Sistema de favoritos**  
✅ **Busca em tempo real**  
✅ **Badges de qualidade (4K, HD)**  

---

## 📞 Suporte

Para problemas ou sugestões:
- Verificar console do navegador para logs detalhados
- Confirmar que `canais.txt` está acessível no GitHub
- Testar URLs de stream individualmente
- Reportar issues com número do canal e categoria

---

**🎬 RedFlix - Sistema de Canais ao Vivo v3.0**  
*Design cinematográfico premium para experiência IPTV definitiva* ✨
