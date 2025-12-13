# 📺 Página de Canais - Documentação Completa

## 🎨 Design e Layout

A página de Canais segue o design moderno de aplicações IPTV com layout em 3 colunas:

### Estrutura:
1. **Sidebar Esquerda (240px)** - Menu de categorias
2. **Coluna Central** - Lista de canais numerados
3. **Coluna Direita** - Video player + programação

## 📋 Formato do Arquivo canais.txtt.tsx

O arquivo `canais.txt` no repositório GitHub usa o seguinte formato:

```
NomeDoCanal|URL_Logo|URL_Stream|Programa1,Programa2,Programa3
```

### Exemplo:

```
ultura | http://api.cdnapp.fun:80/play/y6gsRebFHAC_zy-03SgP1eI5d7jf8pl8nYrUsfSQaf0/ts | http://api.cdnapp.fun:80/images/9563345ec7cd63944d9900e9c091e661.png
RedeTV! | http://api.cdnapp.fun:80/play/y6gsRebFHAC_zy-03SgP1dDvw36TzqW5DZulzg6zvHs/ts | http://api.cdnapp.fun:80/images/0cb21e2d7c03d3fceb868d1a1eeb0ea5.png
Band SP HD | http://api.cdnapp.fun:80/play/y6gsRebFHAC_zy-03SgP1QuCOFQV08nqgMmOxUOphp8/ts | http://api.cdnapp.fun:80/images/0c0fdf1d9fabeb1bd3e468f6ceeafcc6.png

## 🏷️ Campos do Arquivo:

1. **Nome do Canal** - Nome completo exibido na interface
2. **URL do Logo** - URL da imagem do logo (Wikimedia Commons, Imgur, etc.)
3. **URL do Stream** - URL da transmissão ao vivo (para futura integração)
4. **Programas** - Lista separada por vírgula com programação do canal

## 📍 Localização no GitHub:

O sistema busca automaticamente o arquivo em:
- `https://raw.githubusercontent.com/Fabriciocypreste/figma.gif/main/canais.txt`
- `https://raw.githubusercontent.com/Fabriciocypreste/figma.gif/master/canais.txt`

## 🎯 Categorias Disponíveis:

### Menu Lateral:
- **ALL** - Todos os canais
- **FAVORITE LIST** - Lista de favoritos (futuro)
- **CANAIS ARGENTINOS** - Canais da Argentina (futuro)
- **UHD** - Canais em Ultra HD/4K
- **ESPORTE** - Canais esportivos
- **CULTURA & NOTÍCIAS** - Canais de notícias e cultura
- **INFANTIL** - Canais para crianças
- **ABERTOS** - Canais de TV aberta
- **FILMES & SÉRIES** - Canais de entretenimento

### Categorização Automática:

Os canais são categorizados automaticamente por palavras-chave no nome:

#### Esporte:
- ESPN, Fox Sports, Sport TV, Premiere, Combate, Band Sports, TNT Sports

#### Notícias:
- News, CNN, Band, Record, Globo (notícias)

#### Infantil:
- Cartoon, Discovery Kids, Nickelodeon, Disney, Gloob, Nick Jr, Disney Junior

#### Filmes & Séries:
- HBO, Telecine, Paramount, Universal, Warner, AXN, Sony, TNT, Space, FX, AMC, Studio Universal, Syfy

#### UHD/4K:
- Canais contendo "UHD" ou "4K" no nome

#### Documentários:
- National Geographic, Discovery, History, Animal Planet, TLC

## 🎬 Funcionalidades Implementadas:

### Lista de Canais:
- ✅ Numeração sequencial (001, 002, 003...)
- ✅ Logos reais dos canais (80+ canais)
- ✅ Nome completo do canal
- ✅ Ícone de replay em canais selecionados
- ✅ Destaque visual para canal selecionado (borda vermelha)
- ✅ Hover effects suaves

### Video Player:
- ✅ Área de player 50% da altura da tela
- ✅ Logo do canal em watermark (canto superior esquerdo)
- ✅ Indicador "AO VIVO" pulsante
- ✅ Placeholder com botão de play
- ✅ Background preto para simular vídeo

### Programação:
- ✅ **Seletor de dias** - Navegar por 7 dias de programação
- ✅ **Grade horária completa** com:
  - Horário de início e fim
  - Nome do programa
  - Descrição do programa
  - Badge "AO VIVO" para programa atual
  - Botão "Reproduciendo" (vermelho) para programa ao vivo
  - Botão "Programar" (vermelho) para programas futuros
- ✅ Destaque visual para programa atual (fundo vermelho completo)
- ✅ Scroll suave na programação

### Interface:
- ✅ Botão "Voltar" na sidebar
- ✅ Toast notifications ao trocar de canal
- ✅ Loading state com spinner
- ✅ Responsivo e fluido
- ✅ Tema escuro consistente

## 📺 Canais Incluídos (80+):

### Esporte (29 canais):
- All Sports, Band Sports (UHD/HD)
- Combate (UHD/HD)
- ESPN Brasil (UHD/HD/Extra/2)
- Fox Sports (1/2 em 4K/HD)
- Premiere (1-6 em 4K/HD)
- SporTV (1-3 em UHD/HD)
- TNT Sports

### TV Aberta (5 canais):
- Globo HD, SBT HD, Record HD, Band HD, RedeTV HD

### Notícias (4 canais):
- GloboNews, CNN Brasil, BandNews, RecordNews

### Infantil (7 canais):
- Cartoon Network, Discovery Kids, Nickelodeon, Disney Channel, Gloob, Disney Junior, Nick Jr

### Filmes HBO (6 canais):
- HBO, HBO Plus, HBO Signature, HBO Family, HBO 2, HBO Xtreme

### Filmes Telecine (6 canais):
- Premium, Action, Touch, Fun, Pipoca, Cult

### Séries & Entretenimento (10 canais):
- Paramount, Universal, Warner, AXN, Sony, TNT, Space, FX, AMC, Studio Universal, Syfy

### Documentários (7 canais):
- National Geographic, Discovery, History, Animal Planet, Discovery Science, TLC, Food Network, HGTV

### Entretenimento (3 canais):
- MTV, VH1, Comedy Central

## 🔧 Fontes dos Logos:

Todos os logos são provenientes de:
- **Wikimedia Commons** - Logos oficiais de alta qualidade
- **URLs diretas** - Hospedagem confiável e pública

### Exemplos de URLs:
```
ESPN: https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/ESPN_wordmark.svg/200px-ESPN_wordmark.svg.png
HBO: https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/HBO_logo.svg/200px-HBO_logo.svg.png
Globo: https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Logotipo_da_Rede_Globo.svg/200px-Logotipo_da_Rede_Globo.svg.png
```

## 🚀 Próximos Passos:

### Para implementar streaming real:

1. **Integrar Player de Vídeo:**
   ```typescript
   // Opções de players:
   - HLS.js (para streams HLS/m3u8)
   - Video.js (player completo)
   - Plyr (interface moderna)
   - JW Player (comercial)
   ```

2. **Adicionar EPG (Electronic Program Guide):**
   - Integrar API de EPG real
   - Programação dinâmica por canal
   - Atualização automática

3. **Sistema de Favoritos:**
   - Salvar canais favoritos no localStorage
   - Categoria "FAVORITE LIST" funcional

4. **Gravação/DVR:**
   - Permitir programar gravações
   - Armazenar no Supabase Storage

5. **Parental Control:**
   - Classificação etária
   - PIN para canais adultos

## 💡 Dicas de Uso:

1. **Adicionar novo canal:**
   - Adicione linha no canais.txt
   - Formato: `Nome|Logo|Stream|Programas`
   - Commit no GitHub

2. **Trocar logo:**
   - Atualize a URL do logo na linha correspondente
   - Use Wikimedia Commons para logos oficiais

3. **Organizar canais:**
   - Mantenha ordem lógica (esporte, abertos, filmes, etc.)
   - Numeração é automática

4. **Testar localmente:**
   - Modifique `/canais.txt` no projeto
   - Servidor busca do GitHub em produção

## 🎨 Estilo Visual:

### Cores:
- **Background**: `#0a0a0a`, `#141414`
- **Cards**: `#1a1a1a`, `#1e1e1e`
- **Vermelho**: `#DC2626` (Redfliz)
- **Roxo**: `#A855F7` (categorias especiais)
- **Texto**: Branco com opacidade variável

### Fontes:
- **Inter** - Todas as variações (Regular, Medium, Semi Bold, Bold, Extra Bold)

### Animações:
- Pulse no indicador "AO VIVO"
- Hover effects suaves
- Transições em 200ms

---

**Última atualização:** Novembro 2024
**Versão:** 2.0
**Status:** ✅ Totalmente funcional com logos reais
