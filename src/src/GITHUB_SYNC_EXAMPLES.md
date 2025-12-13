# 📚 Exemplos Práticos - GitHub Sync

## 🎯 Casos de Uso Reais

### 1. Primeira Sincronização

**Cenário**: Você acabou de criar o banco de dados e quer popular com conteúdo real.

**Passo a passo:**

```
1. Configurar Banco de Dados
   ↓
2. Executar SQL de criação de tabelas
   ↓
3. Acessar GitHub Sync no Admin
   ↓
4. Clicar em "Sincronizar Tudo"
   ↓
5. Aguardar conclusão
   ↓
6. Verificar páginas de conteúdo
```

**Tempo estimado**: 2-3 minutos

**Resultado esperado**:
```
✅ 120+ filmes adicionados
✅ 80+ séries adicionadas
✅ 400+ canais adicionados
✅ Todas as páginas funcionando
```

---

### 2. Atualização de Conteúdo

**Cenário**: Você adicionou novos filmes no repositório GitHub e quer atualizar o site.

**Passo a passo:**

```
1. Editar data/filmes.json no GitHub
2. Commit e push das alterações
3. Acessar GitHub Sync no Admin
4. Clicar em "🎬 Filmes" (sincronização individual)
5. Aguardar conclusão
```

**Tempo estimado**: 10-20 segundos

**Resultado esperado**:
```
✅ Novos filmes adicionados
✅ Filmes existentes atualizados
✅ Nenhuma duplicata criada
```

---

### 3. Importar Lista M3U de IPTV

**Cenário**: Você tem uma lista M3U de canais e quer importar para o RedFlix.

**Exemplo de arquivo M3U** (`lista.m3u`):

```m3u
#EXTM3U

#EXTINF:-1 tvg-id="globo" tvg-name="Globo" tvg-logo="https://cdn.example.com/logos/globo.png" group-title="Abertos",Rede Globo
https://cdn.jmvstream.com/w/LVW-10842/LVW10842_ABqSmartTv/playlist.m3u8

#EXTINF:-1 tvg-id="sbt" tvg-name="SBT" tvg-logo="https://cdn.example.com/logos/sbt.png" group-title="Abertos",SBT
https://cdn.jmvstream.com/w/LVW-10801/LVW10801_Xvs59wP3GZ/playlist.m3u8

#EXTINF:-1 tvg-id="band" tvg-name="Band" tvg-logo="https://cdn.example.com/logos/band.png" group-title="Abertos",Band
https://cdn.jmvstream.com/w/LVW-10819/LVW10819_h8JlwwZYI0/playlist.m3u8

#EXTINF:-1 tvg-id="espn" tvg-name="ESPN" tvg-logo="https://cdn.example.com/logos/espn.png" group-title="Esportes",ESPN
https://cdn.example.com/espn/playlist.m3u8

#EXTINF:-1 tvg-id="sportv" tvg-name="SporTV" tvg-logo="https://cdn.example.com/logos/sportv.png" group-title="Esportes",SporTV
https://cdn.example.com/sportv/playlist.m3u8
```

**Passo a passo:**

```
1. Adicionar lista.m3u ao repositório GitHub
2. Acessar GitHub Sync
3. Clicar em "Sincronizar Tudo"
4. Sistema detecta M3U automaticamente
5. Converte para JSON e importa
```

**Conversão automática para**:

```json
[
  {
    "nome": "Rede Globo",
    "logo": "https://cdn.example.com/logos/globo.png",
    "url": "https://cdn.jmvstream.com/.../playlist.m3u8",
    "categoria": "abertos",
    "tvg_id": "globo",
    "tvg_name": "Globo",
    "group_title": "Abertos"
  },
  {
    "nome": "SBT",
    "logo": "https://cdn.example.com/logos/sbt.png",
    "url": "https://cdn.jmvstream.com/.../playlist.m3u8",
    "categoria": "abertos",
    "tvg_id": "sbt",
    "tvg_name": "SBT",
    "group_title": "Abertos"
  }
]
```

**Resultado esperado**:
```
✅ 5 canais importados e categorizados
✅ URLs de stream preservadas
✅ Logos e metadados extraídos
```

---

### 4. Organizar Filmes por Gênero

**Cenário**: Você quer organizar filmes em categorias (ação, drama, comédia, etc).

**Exemplo de `filmes.json` organizado**:

```json
[
  {
    "nome": "Velozes e Furiosos",
    "logo": "https://image.tmdb.org/t/p/w500/poster1.jpg",
    "url": "https://example.com/stream/velozes.m3u8",
    "categoria": "acao"
  },
  {
    "nome": "John Wick",
    "logo": "https://image.tmdb.org/t/p/w500/poster2.jpg",
    "url": "https://example.com/stream/johnwick.m3u8",
    "categoria": "acao"
  },
  {
    "nome": "Titanic",
    "logo": "https://image.tmdb.org/t/p/w500/poster3.jpg",
    "url": "https://example.com/stream/titanic.m3u8",
    "categoria": "romance"
  },
  {
    "nome": "Se Beber Não Case",
    "logo": "https://image.tmdb.org/t/p/w500/poster4.jpg",
    "url": "https://example.com/stream/hangover.m3u8",
    "categoria": "comedia"
  }
]
```

**Após sincronização, consultas SQL**:

```sql
-- Ver todos os filmes de ação
SELECT * FROM filmes WHERE categoria = 'acao';

-- Contar filmes por categoria
SELECT categoria, COUNT(*) as total 
FROM filmes 
GROUP BY categoria 
ORDER BY total DESC;

-- Top 10 filmes mais recentes por categoria
SELECT * FROM filmes 
WHERE categoria = 'acao' 
ORDER BY created_at DESC 
LIMIT 10;
```

---

### 5. Adicionar Séries com Temporadas

**Cenário**: Você quer adicionar séries organizadas por temporada.

**Exemplo de `series.json` com temporadas**:

```json
[
  {
    "nome": "Breaking Bad - Temporada 1",
    "logo": "https://image.tmdb.org/t/p/w500/breaking-bad-s1.jpg",
    "url": "https://example.com/stream/breaking-bad-s1.m3u8",
    "categoria": "drama"
  },
  {
    "nome": "Breaking Bad - Temporada 2",
    "logo": "https://image.tmdb.org/t/p/w500/breaking-bad-s2.jpg",
    "url": "https://example.com/stream/breaking-bad-s2.m3u8",
    "categoria": "drama"
  },
  {
    "nome": "Stranger Things - Temporada 1",
    "logo": "https://image.tmdb.org/t/p/w500/stranger-things-s1.jpg",
    "url": "https://example.com/stream/stranger-things-s1.m3u8",
    "categoria": "ficcao"
  }
]
```

**Buscar todas as temporadas de uma série**:

```sql
-- Buscar todas as temporadas de Breaking Bad
SELECT * FROM series 
WHERE nome LIKE 'Breaking Bad%' 
ORDER BY nome;

-- Buscar temporadas usando REGEX
SELECT * FROM series 
WHERE nome ~ '^Breaking Bad - Temporada [0-9]+$' 
ORDER BY nome;
```

---

### 6. Sincronização Programática

**Cenário**: Você quer chamar a sincronização via código JavaScript.

**Exemplo em React**:

```typescript
import { syncAllFromFIGMA1, syncFile } from '../utils/githubSync';

// Sincronização completa com callback de progresso
const handleFullSync = async () => {
  const results = await syncAllFromFIGMA1((progress) => {
    console.log(`${progress.progress}% - ${progress.message}`);
  });
  
  console.log('Resultados:', results);
};

// Sincronização individual
const handleMoviesSync = async () => {
  const result = await syncFile(
    'Fabriciocypreste',
    'FIGMA1',
    'data/filmes.json',
    'filmes',
    (progress) => {
      console.log(progress.message);
    }
  );
  
  if (result.success) {
    console.log(`✅ ${result.inserted} filmes sincronizados`);
  } else {
    console.error('❌ Erros:', result.errors);
  }
};
```

---

### 7. Migração de Dados Antigos

**Cenário**: Você tem dados locais em `/public/data/*.json` e quer migrar para o Supabase.

**Script de migração**:

```typescript
import { supabase } from '../utils/supabase/client';

async function migrateLocalToSupabase() {
  // Ler arquivo local
  const response = await fetch('/data/filmes.json');
  const filmes = await response.json();
  
  console.log(`📦 ${filmes.length} filmes encontrados localmente`);
  
  // Inserir no Supabase
  const { data, error } = await supabase
    .from('filmes')
    .upsert(filmes, { 
      onConflict: 'nome',
      ignoreDuplicates: false 
    })
    .select();
  
  if (error) {
    console.error('❌ Erro:', error);
  } else {
    console.log(`✅ ${data.length} filmes migrados`);
  }
}

// Executar migração
migrateLocalToSupabase();
```

---

### 8. Validação de URLs de Stream

**Cenário**: Você quer validar se os URLs de stream estão funcionando antes de sincronizar.

**Script de validação**:

```typescript
async function validateStreamUrl(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function validateBeforeSync() {
  const response = await fetch('/data/filmes.json');
  const filmes = await response.json();
  
  console.log('🔍 Validando URLs de stream...');
  
  for (const filme of filmes) {
    const isValid = await validateStreamUrl(filme.url);
    console.log(`${isValid ? '✅' : '❌'} ${filme.nome}: ${filme.url}`);
  }
}

// Executar validação
validateBeforeSync();
```

---

### 9. Backup Antes de Sincronizar

**Cenário**: Fazer backup dos dados atuais antes de sincronizar novos.

**Script de backup**:

```typescript
import { supabase } from '../utils/supabase/client';

async function backupToJSON() {
  console.log('💾 Criando backup...');
  
  // Buscar todos os dados
  const { data: filmes } = await supabase.from('filmes').select('*');
  const { data: series } = await supabase.from('series').select('*');
  const { data: canais } = await supabase.from('canais').select('*');
  
  // Criar objeto de backup
  const backup = {
    timestamp: new Date().toISOString(),
    data: {
      filmes,
      series,
      canais
    },
    stats: {
      total_filmes: filmes?.length || 0,
      total_series: series?.length || 0,
      total_canais: canais?.length || 0
    }
  };
  
  // Baixar como JSON
  const blob = new Blob([JSON.stringify(backup, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `redflix-backup-${Date.now()}.json`;
  a.click();
  
  console.log('✅ Backup criado com sucesso!');
}

// Executar backup
backupToJSON();
```

---

### 10. Sincronização Agendada

**Cenário**: Executar sincronização automaticamente a cada 24 horas.

**Exemplo com setInterval**:

```typescript
import { syncAllFromFIGMA1 } from '../utils/githubSync';

// Sincronizar a cada 24 horas
const SYNC_INTERVAL = 24 * 60 * 60 * 1000; // 24 horas em ms

function startAutoSync() {
  console.log('⏰ Sincronização automática iniciada');
  
  // Sincronizar imediatamente
  syncAllFromFIGMA1((progress) => {
    console.log(`[Auto-Sync] ${progress.message}`);
  });
  
  // Agendar próximas sincronizações
  setInterval(() => {
    console.log('⏰ Executando sincronização agendada...');
    
    syncAllFromFIGMA1((progress) => {
      console.log(`[Auto-Sync] ${progress.message}`);
    });
  }, SYNC_INTERVAL);
}

// Iniciar ao carregar página
startAutoSync();
```

---

## 🎓 Dicas e Boas Práticas

### ✅ Nomes Únicos

Sempre use nomes únicos para evitar conflitos:

```json
❌ Ruim:
{ "nome": "Filme 1" }
{ "nome": "Filme 1" }  // Duplicata!

✅ Bom:
{ "nome": "Velozes e Furiosos" }
{ "nome": "Velozes e Furiosos 2" }  // Nomes diferentes
```

### ✅ URLs Válidas

Sempre use URLs completas e válidas:

```json
❌ Ruim:
{ "url": "/stream/filme.m3u8" }  // URL relativa

✅ Bom:
{ "url": "https://example.com/stream/filme.m3u8" }  // URL completa
```

### ✅ Categorias Consistentes

Use categorias consistentes e em lowercase:

```json
❌ Ruim:
{ "categoria": "Ação" }
{ "categoria": "ACAO" }
{ "categoria": "ação" }  // Inconsistente

✅ Bom:
{ "categoria": "acao" }
{ "categoria": "acao" }
{ "categoria": "acao" }  // Consistente
```

### ✅ Logos de Qualidade

Use logos de boa qualidade e hospedados em CDN:

```json
❌ Ruim:
{ "logo": "logo.png" }  // Caminho local

✅ Bom:
{ "logo": "https://image.tmdb.org/t/p/w500/poster.jpg" }  // CDN
```

---

## 📝 Templates Prontos

### Template: filmes.json

```json
[
  {
    "nome": "Nome do Filme",
    "logo": "https://image.tmdb.org/t/p/w500/poster.jpg",
    "url": "https://example.com/stream/filme.m3u8",
    "categoria": "acao"
  }
]
```

### Template: series.json

```json
[
  {
    "nome": "Nome da Série - Temporada 1",
    "logo": "https://image.tmdb.org/t/p/w500/poster.jpg",
    "url": "https://example.com/stream/serie-s1.m3u8",
    "categoria": "drama"
  }
]
```

### Template: canais.json

```json
[
  {
    "nome": "Nome do Canal",
    "logo": "https://cdn.example.com/logos/canal.png",
    "url": "https://cdn.example.com/stream/canal/playlist.m3u8",
    "categoria": "abertos"
  }
]
```

### Template: lista.m3u

```m3u
#EXTM3U

#EXTINF:-1 tvg-id="canal1" tvg-name="Canal 1" tvg-logo="https://example.com/logo.png" group-title="Categoria",Nome do Canal
https://example.com/stream/canal1.m3u8
```

---

**💡 Precisa de mais exemplos? Confira a documentação completa em `GITHUB_SYNC_README.md`**
