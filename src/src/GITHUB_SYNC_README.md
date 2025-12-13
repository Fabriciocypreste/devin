# 🔄 Sistema de Sincronização GitHub → Supabase - RedFlix

## 📋 Visão Geral

Sistema completo de sincronização automática que lê conteúdo real de filmes, séries e canais do repositório GitHub FIGMA1 e sincroniza automaticamente com o banco de dados Supabase usado pelo RedFlix.

## 🎯 Funcionalidades

### ✅ Principais Recursos

- **📡 Leitura Automática do GitHub**: Conecta e baixa arquivos do repositório FIGMA1
- **🔄 Conversão M3U → JSON**: Converte automaticamente listas M3U para formato JSON estruturado
- **💾 Sincronização Inteligente**: Usa upsert para evitar duplicatas baseado no nome
- **📊 Progresso em Tempo Real**: Exibe progresso visual e logs detalhados
- **🔍 Detecção Automática**: Identifica automaticamente o tipo de conteúdo (filme/série/canal)
- **📦 Sincronização em Lote**: Processa dados em lotes de 100 itens para melhor performance
- **🎯 Sincronização Seletiva**: Permite sincronizar todos os arquivos ou apenas um tipo específico

### 📁 Arquivos Suportados

O sistema busca automaticamente os seguintes arquivos do repositório:

- `data/filmes.json` - Lista de filmes
- `data/series.json` - Lista de séries
- `data/canais.json` - Lista de canais
- `lista.m3u` - Playlist M3U (convertida automaticamente)

## 🏗️ Arquitetura

### Componentes Criados

#### 1. `/utils/m3uParser.ts`
Parser completo para arquivos M3U com as seguintes funcionalidades:

```typescript
// Parse de conteúdo M3U
parseM3U(content: string): M3UEntry[]

// Detecção automática de tipo de conteúdo
detectContentType(filename: string, entries: M3UEntry[]): 'filmes' | 'series' | 'canais'

// Parse completo com detecção
parseM3UComplete(content: string, filename: string): ParsedM3U

// Validação de arquivo M3U
isValidM3U(content: string): boolean
```

**Funcionalidades do Parser:**
- Extrai informações de `#EXTINF:` (tvg-id, tvg-name, tvg-logo, group-title)
- Detecta automaticamente URLs de stream
- Categoriza conteúdo baseado em palavras-chave
- Suporta múltiplos formatos de M3U

#### 2. `/utils/githubSync.ts`
Utilitário completo de sincronização com o GitHub:

```typescript
// Buscar arquivo do GitHub
fetchGitHubFile(owner: string, repo: string, path: string): Promise<string>

// Sincronizar arquivo específico
syncFile(owner: string, repo: string, path: string, type: 'filmes' | 'series' | 'canais'): Promise<SyncResult>

// Sincronizar todos os arquivos do FIGMA1
syncAllFromFIGMA1(onProgress?: (progress: SyncProgress) => void): Promise<SyncResult[]>
```

**Funcionalidades de Sincronização:**
- Busca arquivos do GitHub via raw.githubusercontent.com
- Processa JSON e M3U automaticamente
- Faz upsert em lotes no Supabase
- Retorna estatísticas detalhadas
- Logs coloridos no console

#### 3. `/components/GitHubSyncPanel.tsx`
Interface completa de sincronização integrada ao Admin Dashboard:

**Recursos da Interface:**
- 🚀 Botão de sincronização completa
- 🎯 Botões de sincronização individual (Filmes/Séries/Canais)
- 📊 Barra de progresso em tempo real
- 📝 Console log com cores e timestamps
- 📦 Informações do repositório fonte
- 📖 Instruções de uso
- 📊 Resumo de resultados com estatísticas

### Integração com Admin Dashboard

O painel foi integrado ao AdminDashboard como uma nova seção:

- **Menu Item**: "GitHub Sync" com ícone do GitHub
- **Posição**: Entre Analytics e Suporte
- **Ícone**: SVG do GitHub oficial
- **Acesso**: Clique no menu lateral do Admin

## 🚀 Como Usar

### 1. Acessar o Painel Admin

1. Faça login no RedFlix
2. Vá para o Dashboard do Usuário
3. Clique em "Admin Dashboard"
4. No menu lateral, clique em "GitHub Sync"

### 2. Sincronização Completa

**Para sincronizar todo o conteúdo:**

```
1. Clique no botão "🔄 Sincronizar Tudo"
2. Aguarde o processo (acompanhe no console log)
3. Veja o resumo de resultados
```

**Logs esperados:**
```
📡 Conectando ao repositório GitHub FIGMA1...
✅ Arquivo filmes.json encontrado (120 itens)
✅ Arquivo series.json encontrado (80 itens)
✅ Arquivo canais.json encontrado (400 itens)
🔄 Enviando dados para Supabase...
✅ 600 registros sincronizados com sucesso!
🚀 Conteúdo atualizado em todas as páginas!
```

### 3. Sincronização Individual

**Para sincronizar apenas um tipo:**

```
1. Clique em um dos botões:
   - 🎬 Filmes
   - 📺 Séries
   - 📡 Canais
2. Aguarde a sincronização
3. Veja o resultado
```

### 4. Validar Conteúdo

Após a sincronização, verifique se o conteúdo aparece nas páginas:

- `/filmes` - Página de Filmes
- `/series` - Página de Séries
- `/canais` - Página de Canais
- `/iptv` - Sistema IPTV

## 🗄️ Banco de Dados

### Estrutura das Tabelas

Todas as tabelas seguem o mesmo padrão:

```sql
CREATE TABLE filmes/series/canais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,  -- Campo usado para upsert
  logo TEXT,
  categoria TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Constraints Importantes

**Unique Index no campo `nome`:**
```sql
CREATE UNIQUE INDEX unique_filme_nome ON filmes(nome);
CREATE UNIQUE INDEX unique_serie_nome ON series(nome);
CREATE UNIQUE INDEX unique_canal_nome ON canais(nome);
```

Isso permite o **upsert** automático sem duplicatas.

### Row Level Security (RLS)

- **Leitura**: Pública (todos podem ler)
- **Inserção**: Pública (necessário para sincronização)
- **Atualização**: Automática via trigger

## 📊 Formato dos Dados

### JSON Esperado

```json
[
  {
    "nome": "Nome do Conteúdo",
    "logo": "https://example.com/logo.jpg",
    "categoria": "acao",
    "url": "https://example.com/stream.m3u8"
  }
]
```

### M3U Esperado

```m3u
#EXTM3U
#EXTINF:-1 tvg-id="canal1" tvg-name="Canal 1" tvg-logo="https://example.com/logo.jpg" group-title="Esportes",Canal 1
https://example.com/stream.m3u8
```

### Conversão M3U → JSON

O parser converte automaticamente:

```javascript
{
  nome: "Canal 1",              // Extraído após a vírgula
  logo: "https://...",          // tvg-logo
  categoria: "esportes",        // group-title (lowercase)
  url: "https://...",           // URL do stream
  tvg_id: "canal1",             // tvg-id
  tvg_name: "Canal 1",          // tvg-name
  group_title: "Esportes"       // group-title (original)
}
```

## 🔧 Configurações

### Parâmetros de Sincronização

```typescript
// Tamanho do lote para upsert
const batchSize = 100;

// Repositório fonte
const owner = 'Fabriciocypreste';
const repo = 'FIGMA1';

// Arquivos monitorados
const files = [
  { path: 'data/filmes.json', type: 'filmes' },
  { path: 'data/series.json', type: 'series' },
  { path: 'data/canais.json', type: 'canais' },
  { path: 'lista.m3u', type: 'canais' }
];
```

### Timeout e Performance

- **Sem timeout**: Sincronização roda até completar
- **Lotes de 100**: Evita sobrecarga do Supabase
- **Logs detalhados**: Acompanhe cada etapa
- **Error handling**: Captura e exibe erros específicos

## 📝 Logs e Debugging

### Tipos de Log

- 🔵 **INFO** (cinza): Informações gerais
- ✅ **SUCCESS** (verde): Operações bem-sucedidas
- ⚠️ **WARNING** (amarelo): Avisos
- ❌ **ERROR** (vermelho): Erros

### Console Log

Todos os logs aparecem tanto na interface quanto no console do navegador:

```javascript
console.log('[INFO] 📡 Conectando ao GitHub...');
console.log('[SUCCESS] ✅ 120 filmes sincronizados');
console.error('[ERROR] ❌ Erro ao buscar arquivo: 404');
```

## 🐛 Troubleshooting

### Problema: "Erro ao buscar arquivo: 404"

**Causa**: Arquivo não existe no repositório

**Solução**:
1. Verifique se o arquivo existe em `github.com/Fabriciocypreste/FIGMA1`
2. Confirme o caminho correto (data/filmes.json, etc)
3. Verifique se o repositório está público

### Problema: "Nenhuma entrada encontrada no arquivo"

**Causa**: Arquivo vazio ou formato inválido

**Solução**:
1. Verifique o conteúdo do arquivo no GitHub
2. Confirme se o JSON é válido
3. Para M3U, verifique se contém `#EXTM3U` e `#EXTINF:`

### Problema: "Erro ao inserir lote: duplicate key"

**Causa**: Índice único não foi criado

**Solução**:
1. Execute o SQL de criação de tabelas atualizado
2. Verifique se os índices únicos existem:
```sql
SELECT * FROM pg_indexes WHERE tablename IN ('filmes', 'series', 'canais');
```

### Problema: Sincronização travada

**Causa**: Arquivo muito grande ou conexão lenta

**Solução**:
1. Aguarde mais tempo (processamento em lote pode demorar)
2. Verifique o console para logs de progresso
3. Tente sincronização individual por tipo

## 📚 Próximos Passos

### Melhorias Futuras

1. **🔄 Sincronização Agendada**
   - Cron job para sincronizar automaticamente
   - Webhook do GitHub para atualização em tempo real

2. **🔍 Validação Avançada**
   - Verificar URLs de stream antes de salvar
   - Validar formato de imagens (logos)
   - Detectar conteúdo duplicado

3. **📊 Analytics**
   - Histórico de sincronizações
   - Estatísticas de conteúdo adicionado
   - Dashboard de qualidade dos dados

4. **🔐 Segurança**
   - Autenticação para sincronização
   - Rate limiting
   - Logs de auditoria

5. **🎯 Features**
   - Sincronização seletiva por categoria
   - Filtros e busca de conteúdo
   - Preview antes de sincronizar

## 🤝 Contribuindo

Para adicionar novos formatos de arquivo ou melhorar o parser:

1. Edite `/utils/m3uParser.ts` para novos formatos
2. Adicione novos métodos em `/utils/githubSync.ts`
3. Atualize a interface em `/components/GitHubSyncPanel.tsx`

## 📄 Licença

Este sistema é parte do projeto RedFlix.

---

**Versão**: 4.0  
**Autor**: Fabricio Cypreste  
**Data**: 2025  
**Status**: ✅ Completo e Funcional
