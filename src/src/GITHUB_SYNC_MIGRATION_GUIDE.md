# 🔄 Guia de Migração - Dados Locais → GitHub → Supabase

## 📋 Visão Geral

Este guia explica como migrar seus dados locais existentes (`/public/data/*.json`) para o sistema de sincronização GitHub → Supabase.

---

## 🎯 Cenários de Migração

### Cenário 1: Primeira Vez (Sem dados locais)

**Situação**: Você não tem dados locais e quer começar do zero com dados do GitHub.

**Solução**: Use o sistema GitHub Sync diretamente.

```
1. Configure o banco (execute GITHUB_SYNC_DATABASE_SETUP.sql)
2. Acesse Admin → GitHub Sync
3. Clique em "Sincronizar Tudo"
4. Pronto! ✅
```

---

### Cenário 2: Migrar Dados Locais para GitHub

**Situação**: Você tem dados em `/public/data/*.json` e quer colocar no GitHub.

#### Passo 1: Preparar Arquivos

```bash
# Seus arquivos atuais
/public/data/filmes.json
/public/data/series.json
/public/data/canais.json
```

#### Passo 2: Criar Estrutura no GitHub

```bash
# No repositório FIGMA1, criar estrutura:
/data/
  ├── filmes.json
  ├── series.json
  └── canais.json
```

#### Passo 3: Copiar Conteúdo

**Opção A: Manualmente**

1. Abra `/public/data/filmes.json` localmente
2. Copie o conteúdo
3. Crie `data/filmes.json` no GitHub
4. Cole o conteúdo
5. Commit e push
6. Repita para séries e canais

**Opção B: Via Git CLI**

```bash
# Clone o repositório
git clone https://github.com/Fabriciocypreste/FIGMA1.git
cd FIGMA1

# Criar diretório data
mkdir -p data

# Copiar arquivos locais
cp /caminho/para/redflix/public/data/filmes.json data/
cp /caminho/para/redflix/public/data/series.json data/
cp /caminho/para/redflix/public/data/canais.json data/

# Commit e push
git add data/
git commit -m "Adicionar dados de filmes, séries e canais"
git push origin main
```

#### Passo 4: Sincronizar

```
1. Acesse Admin → GitHub Sync
2. Clique em "Sincronizar Tudo"
3. Verifique se os dados foram importados
```

---

### Cenário 3: Migrar Dados Locais Diretamente para Supabase

**Situação**: Você quer migrar dados locais sem passar pelo GitHub.

#### Script de Migração Completo

Crie um arquivo `migrate-local-to-supabase.ts`:

```typescript
import { supabase } from './utils/supabase/client';

interface ContentItem {
  nome: string;
  logo: string;
  url: string;
  categoria: string;
}

async function migrateFilmes() {
  console.log('📥 Migrando filmes...');
  
  try {
    // Buscar dados locais
    const response = await fetch('/data/filmes.json');
    const filmes: ContentItem[] = await response.json();
    
    console.log(`   Encontrados: ${filmes.length} filmes`);
    
    // Inserir no Supabase em lotes
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < filmes.length; i += batchSize) {
      const batch = filmes.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('filmes')
        .upsert(batch, { 
          onConflict: 'nome',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error(`   ❌ Erro no lote ${i / batchSize + 1}:`, error);
      } else {
        totalInserted += data?.length || 0;
        console.log(`   ✅ Lote ${i / batchSize + 1} inserido (${data?.length || 0} itens)`);
      }
    }
    
    console.log(`✅ ${totalInserted} filmes migrados com sucesso!`);
    return totalInserted;
  } catch (error) {
    console.error('❌ Erro ao migrar filmes:', error);
    return 0;
  }
}

async function migrateSeries() {
  console.log('📥 Migrando séries...');
  
  try {
    const response = await fetch('/data/series.json');
    const series: ContentItem[] = await response.json();
    
    console.log(`   Encontradas: ${series.length} séries`);
    
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < series.length; i += batchSize) {
      const batch = series.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('series')
        .upsert(batch, { 
          onConflict: 'nome',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error(`   ❌ Erro no lote ${i / batchSize + 1}:`, error);
      } else {
        totalInserted += data?.length || 0;
        console.log(`   ✅ Lote ${i / batchSize + 1} inserido (${data?.length || 0} itens)`);
      }
    }
    
    console.log(`✅ ${totalInserted} séries migradas com sucesso!`);
    return totalInserted;
  } catch (error) {
    console.error('❌ Erro ao migrar séries:', error);
    return 0;
  }
}

async function migrateCanais() {
  console.log('📥 Migrando canais...');
  
  try {
    const response = await fetch('/data/canais.json');
    const canais: ContentItem[] = await response.json();
    
    console.log(`   Encontrados: ${canais.length} canais`);
    
    const batchSize = 100;
    let totalInserted = 0;
    
    for (let i = 0; i < canais.length; i += batchSize) {
      const batch = canais.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('canais')
        .upsert(batch, { 
          onConflict: 'nome',
          ignoreDuplicates: false 
        })
        .select();
      
      if (error) {
        console.error(`   ❌ Erro no lote ${i / batchSize + 1}:`, error);
      } else {
        totalInserted += data?.length || 0;
        console.log(`   ✅ Lote ${i / batchSize + 1} inserido (${data?.length || 0} itens)`);
      }
    }
    
    console.log(`✅ ${totalInserted} canais migrados com sucesso!`);
    return totalInserted;
  } catch (error) {
    console.error('❌ Erro ao migrar canais:', error);
    return 0;
  }
}

async function migrateAll() {
  console.log('');
  console.log('========================================');
  console.log('🚀 INICIANDO MIGRAÇÃO LOCAL → SUPABASE');
  console.log('========================================');
  console.log('');
  
  const startTime = Date.now();
  
  const filmesCount = await migrateFilmes();
  console.log('');
  
  const seriesCount = await migrateSeries();
  console.log('');
  
  const canaisCount = await migrateCanais();
  console.log('');
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log('========================================');
  console.log('📊 RESUMO DA MIGRAÇÃO');
  console.log('========================================');
  console.log(`✅ Filmes:  ${filmesCount} registros`);
  console.log(`✅ Séries:  ${seriesCount} registros`);
  console.log(`✅ Canais:  ${canaisCount} registros`);
  console.log('----------------------------------------');
  console.log(`✅ TOTAL:   ${filmesCount + seriesCount + canaisCount} registros`);
  console.log(`⏱️  Tempo:   ${duration}s`);
  console.log('========================================');
  console.log('');
  console.log('🎉 Migração concluída com sucesso!');
  console.log('');
}

// Exportar funções
export { migrateFilmes, migrateSeries, migrateCanais, migrateAll };

// Executar automaticamente se chamado diretamente
if (typeof window !== 'undefined') {
  (window as any).migrateAll = migrateAll;
  console.log('💡 Migração disponível! Execute: migrateAll()');
}
```

#### Como Usar o Script

**Opção 1: Console do Navegador**

```javascript
// 1. Abra o DevTools (F12)
// 2. Vá para a aba Console
// 3. Execute:
await migrateAll()
```

**Opção 2: Adicionar ao AdminDashboard**

```typescript
// Em AdminDashboard.tsx ou GitHubSyncPanel.tsx
import { migrateAll } from '../utils/migrate-local-to-supabase';

// Adicionar botão
<Button onClick={() => migrateAll()}>
  Migrar Dados Locais
</Button>
```

---

### Cenário 4: Manter Dados Locais E Usar GitHub

**Situação**: Você quer manter os dados locais como fallback e usar GitHub como fonte primária.

#### Sistema de Fallback em Camadas

```typescript
// utils/contentLoader.ts
import { supabase } from './supabase/client';

async function loadContent(type: 'filmes' | 'series' | 'canais') {
  try {
    // 1ª Tentativa: Supabase (sincronizado do GitHub)
    console.log(`📡 Buscando ${type} do Supabase...`);
    const { data: supabaseData, error } = await supabase
      .from(type)
      .select('*')
      .order('nome', { ascending: true });
    
    if (!error && supabaseData && supabaseData.length > 0) {
      console.log(`✅ ${supabaseData.length} ${type} carregados do Supabase`);
      return supabaseData;
    }
    
    // 2ª Tentativa: GitHub (direto)
    console.log(`📡 Buscando ${type} do GitHub...`);
    const githubUrl = `https://raw.githubusercontent.com/Fabriciocypreste/FIGMA1/main/data/${type}.json`;
    const githubResponse = await fetch(githubUrl);
    
    if (githubResponse.ok) {
      const githubData = await githubResponse.json();
      console.log(`✅ ${githubData.length} ${type} carregados do GitHub`);
      return githubData;
    }
    
    // 3ª Tentativa: Local (fallback)
    console.log(`📁 Buscando ${type} localmente...`);
    const localResponse = await fetch(`/data/${type}.json`);
    
    if (localResponse.ok) {
      const localData = await localResponse.json();
      console.log(`✅ ${localData.length} ${type} carregados localmente`);
      return localData;
    }
    
    // Nenhuma fonte disponível
    console.error(`❌ Não foi possível carregar ${type} de nenhuma fonte`);
    return [];
    
  } catch (error) {
    console.error(`❌ Erro ao carregar ${type}:`, error);
    return [];
  }
}

// Uso
const filmes = await loadContent('filmes');
const series = await loadContent('series');
const canais = await loadContent('canais');
```

---

## 🔄 Workflow Recomendado

### Desenvolvimento

```
1. Editar dados localmente (/public/data/*.json)
2. Testar no localhost
3. Quando satisfeito, fazer push para GitHub
4. Sincronizar via GitHub Sync
```

### Produção

```
1. Dados no GitHub (fonte da verdade)
2. Sincronização automática/manual para Supabase
3. Aplicação lê do Supabase
4. Fallback para GitHub em caso de erro
```

---

## 📊 Comparação de Abordagens

| Abordagem | Vantagens | Desvantagens | Recomendado Para |
|-----------|-----------|--------------|------------------|
| **Apenas Local** | Simples, sem dependências | Sem sincronização, difícil de escalar | Desenvolvimento inicial |
| **Apenas GitHub** | Versionamento, colaboração | Latência na leitura | Projetos pequenos |
| **Apenas Supabase** | Rápido, escalável | Sem versionamento nativo | Produção com dados dinâmicos |
| **GitHub → Supabase** | Melhor dos dois mundos | Complexidade adicional | ✅ **Produção (RECOMENDADO)** |
| **Híbrido (todos)** | Máxima redundância | Mais complexo de manter | Alta disponibilidade crítica |

---

## 🔧 Manutenção

### Atualizar Dados

**Workflow Recomendado:**

```
1. Editar data/*.json no GitHub
2. Commit e push
3. Executar sincronização no Admin
4. Verificar nas páginas do RedFlix
```

### Adicionar Novos Filmes

**No GitHub (data/filmes.json):**

```json
{
  "nome": "Novo Filme 2025",
  "logo": "https://image.tmdb.org/t/p/w500/poster.jpg",
  "url": "https://example.com/stream/novo-filme.m3u8",
  "categoria": "acao"
}
```

**Sincronizar:**

```
Admin → GitHub Sync → 🎬 Filmes
```

### Remover Conteúdo

**Não recomendado**: Apagar do JSON pode causar inconsistências.

**Melhor abordagem**: Marcar como inativo.

```json
{
  "nome": "Filme Antigo",
  "logo": "...",
  "url": "...",
  "categoria": "acao",
  "ativo": false  // ← Adicionar campo
}
```

Depois filtrar na aplicação:

```typescript
const filmesAtivos = filmes.filter(f => f.ativo !== false);
```

---

## 🔒 Backup e Recuperação

### Criar Backup Manual

**SQL (Supabase):**

```sql
-- Criar backup
SELECT * FROM backup_before_sync();

-- Ver backups
SELECT id, timestamp, total_filmes, total_series, total_canais 
FROM backups 
ORDER BY timestamp DESC;
```

**JavaScript:**

```typescript
import { supabase } from './utils/supabase/client';

async function createBackup() {
  const { data: filmes } = await supabase.from('filmes').select('*');
  const { data: series } = await supabase.from('series').select('*');
  const { data: canais } = await supabase.from('canais').select('*');
  
  const backup = {
    timestamp: new Date().toISOString(),
    data: { filmes, series, canais }
  };
  
  // Baixar como arquivo
  const blob = new Blob([JSON.stringify(backup, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `backup-${Date.now()}.json`;
  a.click();
}
```

### Restaurar de Backup

**SQL:**

```sql
-- Restaurar de backup específico
-- (CUIDADO: Isso sobrescreve todos os dados!)

-- 1. Ver backups disponíveis
SELECT id, timestamp FROM backups ORDER BY timestamp DESC;

-- 2. Restaurar (substitua 'backup-id' pelo ID real)
-- TODO: Implementar função restore_backup()
```

**Manual:**

```
1. Ter arquivo de backup (JSON)
2. Copiar conteúdo para data/*.json no GitHub
3. Executar sincronização completa
```

---

## 📈 Monitoramento

### Verificar Status

**SQL (Supabase):**

```sql
-- Estatísticas gerais
SELECT * FROM v_sync_stats;

-- Histórico de syncs
SELECT * FROM sync_logs 
ORDER BY created_at DESC 
LIMIT 10;

-- Conteúdo mais recente
SELECT tipo, nome, created_at 
FROM (
  SELECT 'filme' as tipo, nome, created_at FROM filmes
  UNION ALL
  SELECT 'serie' as tipo, nome, created_at FROM series
  UNION ALL
  SELECT 'canal' as tipo, nome, created_at FROM canais
) conteudo
ORDER BY created_at DESC
LIMIT 20;
```

### Detectar Problemas

```sql
-- Registros sem URL
SELECT 'filmes' as tabela, nome 
FROM filmes WHERE url IS NULL OR url = ''
UNION ALL
SELECT 'series' as tabela, nome 
FROM series WHERE url IS NULL OR url = ''
UNION ALL
SELECT 'canais' as tabela, nome 
FROM canais WHERE url IS NULL OR url = '';

-- Registros sem logo
SELECT 'filmes' as tabela, nome 
FROM filmes WHERE logo IS NULL OR logo = ''
UNION ALL
SELECT 'series' as tabela, nome 
FROM series WHERE logo IS NULL OR logo = ''
UNION ALL
SELECT 'canais' as tabela, nome 
FROM canais WHERE logo IS NULL OR logo = '';

-- Duplicatas (não deveria retornar nada)
SELECT nome, COUNT(*) as qtd 
FROM filmes GROUP BY nome HAVING COUNT(*) > 1;
```

---

## 🎓 Melhores Práticas

### ✅ DO (Faça)

1. **Sempre faça backup antes de sincronizar**
2. **Use nomes únicos e descritivos**
3. **Mantenha categorias consistentes**
4. **Valide URLs antes de adicionar**
5. **Documente mudanças no Git**
6. **Teste em desenvolvimento primeiro**
7. **Monitore logs de sincronização**

### ❌ DON'T (Não Faça)

1. **Não edite Supabase diretamente (use GitHub)**
2. **Não use nomes duplicados**
3. **Não apague dados sem backup**
4. **Não misture categorias inconsistentes**
5. **Não adicione URLs inválidas**
6. **Não sincronize sem testar**
7. **Não ignore erros de sincronização**

---

## 📞 Suporte

Problemas na migração? Consulte:

- `GITHUB_SYNC_README.md` - Documentação completa
- `GITHUB_SYNC_TEST.md` - Testes e validação
- `GITHUB_SYNC_EXAMPLES.md` - Exemplos práticos
- `GITHUB_SYNC_DATABASE_SETUP.sql` - Configuração SQL

---

**🎉 Boa sorte com a migração! 🚀**
