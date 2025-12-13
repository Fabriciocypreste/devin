# 🚀 Supabase Quick Start - RedFlix

## ⚡ Começar em 3 Minutos

---

## 1️⃣ Criar Tabelas (1 minuto)

### Via Supabase Dashboard

```bash
1. Acessar: https://supabase.com/dashboard
2. Projeto: glnmajvrxdwfyedsuaxx
3. SQL Editor → New Query
4. Copiar /supabase/migrations/create_tables.sql
5. Run → Aguardar ✅
```

**Verificar:**
```sql
SELECT COUNT(*) FROM filmes;
-- Deve retornar 0 (tabela vazia)
```

---

## 2️⃣ Importar Dados (1 minuto)

### Via Console do Navegador

```bash
# 1. Build do projeto
npm run build
npm run preview

# 2. Abrir http://localhost:4173
# 3. DevTools (F12) → Console
```

```javascript
// No console:
await window.importarDados.tudo();

// Aguardar log:
// ✅ 10 filmes importados
// ✅ 10 séries importadas
// ✅ 15 canais importados
// 🎉 Total: 35 registros
```

**Verificar:**
```javascript
// Testar query
const { supabase } = await import('./utils/supabase/client');
const { data } = await supabase.from('filmes').select('*');
console.log(data); // Deve mostrar 10 filmes
```

---

## 3️⃣ Usar nos Componentes (1 minuto)

### Exemplo Básico

```typescript
import { useFilmes } from './utils/useSupabaseData';

function MinhaPage() {
  const { filmes, loading } = useFilmes();

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      {filmes.map(filme => (
        <div key={filme.id}>
          <img src={filme.logo} alt={filme.nome} />
          <h3>{filme.nome}</h3>
          <Badge>{filme.categoria}</Badge>
        </div>
      ))}
    </div>
  );
}
```

---

## ✅ Pronto!

**Seu RedFlix agora está usando dados reais do Supabase!**

```
✅ Tabelas criadas
✅ Dados importados (35 registros)
✅ Frontend integrado
✅ Fallback automático funcionando
```

---

## 📊 Comandos Úteis

### Importar Dados

```javascript
// Console do navegador (F12)

// Tudo
await window.importarDados.tudo();

// Apenas filmes
await window.importarDados.filmes();

// Apenas séries
await window.importarDados.series();

// Apenas canais
await window.importarDados.canais();
```

### Limpar Cache

```javascript
// Limpar cache em memória
window.limparCacheRedFlix();
```

### Verificar Dados

```javascript
// Importar cliente
const { supabase } = await import('./utils/supabase/client');

// Contar registros
const { count: filmesCount } = await supabase
  .from('filmes')
  .select('*', { count: 'exact', head: true });
console.log('Filmes:', filmesCount);

// Buscar todos
const { data: filmes } = await supabase
  .from('filmes')
  .select('*');
console.table(filmes);
```

---

## 🐛 Troubleshooting Rápido

### Problema: Tabelas não existem

```sql
-- Executar no SQL Editor
\dt public.*

-- Se não mostrar filmes, series, canais:
-- → Executar create_tables.sql novamente
```

### Problema: Importação falha

```javascript
// Verificar conexão
const { data, error } = await supabase
  .from('filmes')
  .select('count');

console.log(error); 
// null = OK
// != null = problema de conexão ou RLS
```

### Problema: Dados não aparecem

```javascript
// Verificar se hook está carregando
const { filmes, loading, error, source } = useFilmes();

console.log({
  total: filmes.length,
  loading,
  error,
  source // 'supabase' ou 'local'
});

// Se source = 'local':
// → Dados vindo de /public/data/filmes.json (fallback)
// → Verificar se importação foi feita
```

---

## 📚 Documentação Completa

Para instruções detalhadas, veja:
- **SUPABASE_INTEGRATION_COMPLETE.md** - Guia completo
- **create_tables.sql** - Schema do banco
- **useSupabaseData.ts** - Hooks React
- **importData.ts** - Script de importação

---

**🎉 RedFlix com dados reais em 3 minutos!** 🚀
