# 🧪 Teste de Sincronização GitHub → Supabase

## 📋 Checklist de Validação

Execute este checklist para validar se o sistema está funcionando corretamente.

---

## ✅ Fase 1: Preparação

### 1.1 Verificar Banco de Dados

**Execute no Supabase SQL Editor:**

```sql
-- Verificar se as tabelas existem
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('filmes', 'series', 'canais');

-- Verificar índices únicos
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename IN ('filmes', 'series', 'canais')
AND indexname LIKE 'unique_%';

-- Contar registros atuais
SELECT 
  'filmes' as tabela, COUNT(*) as total FROM filmes
UNION ALL
SELECT 
  'series' as tabela, COUNT(*) as total FROM series
UNION ALL
SELECT 
  'canais' as tabela, COUNT(*) as total FROM canais;
```

**Resultado Esperado:**
```
✅ 3 tabelas encontradas
✅ 3 índices únicos encontrados
✅ Total de registros exibido
```

### 1.2 Verificar Repositório GitHub

**Acesse manualmente:**
```
https://github.com/Fabriciocypreste/FIGMA1
```

**Verifique se existem:**
- ✅ `data/filmes.json`
- ✅ `data/series.json`
- ✅ `data/canais.json`
- ✅ `lista.m3u`

**Resultado Esperado:**
```
✅ Repositório acessível
✅ Todos os arquivos presentes
```

---

## ✅ Fase 2: Teste de Interface

### 2.1 Acessar Painel GitHub Sync

**Passo a passo:**
```
1. Login no RedFlix
2. Dashboard do Usuário
3. Admin Dashboard
4. Clicar em "GitHub Sync" no menu lateral
```

**Resultado Esperado:**
```
✅ Painel carrega sem erros
✅ Botões visíveis e funcionais
✅ Console log vazio (aguardando)
✅ Card de informações do repositório exibido
```

### 2.2 Testar Sincronização Individual (Filmes)

**Ações:**
```
1. Clicar em "🎬 Filmes"
2. Aguardar processo
3. Observar logs no console
```

**Resultado Esperado:**
```
📡 Sincronizando filmes...
📡 Baixando data/filmes.json...
📄 Processando arquivo...
💾 Sincronizando com Supabase...
✅ [N] filmes sincronizados com sucesso!
```

**Validação no Banco:**
```sql
SELECT COUNT(*) as total_filmes FROM filmes;
SELECT nome, categoria, url FROM filmes LIMIT 5;
```

### 2.3 Testar Sincronização Individual (Séries)

**Ações:**
```
1. Clicar em "📺 Séries"
2. Aguardar processo
3. Observar logs no console
```

**Resultado Esperado:**
```
📡 Sincronizando series...
📡 Baixando data/series.json...
📄 Processando arquivo...
💾 Sincronizando com Supabase...
✅ [N] séries sincronizadas com sucesso!
```

**Validação no Banco:**
```sql
SELECT COUNT(*) as total_series FROM series;
SELECT nome, categoria, url FROM series LIMIT 5;
```

### 2.4 Testar Sincronização Individual (Canais)

**Ações:**
```
1. Clicar em "📡 Canais"
2. Aguardar processo
3. Observar logs no console
```

**Resultado Esperado:**
```
📡 Sincronizando canais...
📡 Baixando data/canais.json...
📄 Processando arquivo...
💾 Sincronizando com Supabase...
✅ [N] canais sincronizados com sucesso!
```

**Validação no Banco:**
```sql
SELECT COUNT(*) as total_canais FROM canais;
SELECT nome, categoria, url FROM canais LIMIT 5;
```

---

## ✅ Fase 3: Teste Completo

### 3.1 Sincronização Completa

**Ações:**
```
1. Limpar console log (botão "Limpar")
2. Clicar em "🔄 Sincronizar Tudo"
3. Aguardar processo completo
4. Observar todos os logs
```

**Resultado Esperado:**
```
🚀 Iniciando sincronização completa do repositório FIGMA1...
📡 Conectando ao GitHub...

[Para cada arquivo:]
📡 Baixando [arquivo]...
✅ Arquivo baixado com sucesso ([N] bytes)
📄 Processando arquivo...
✅ [N] entradas extraídas do JSON/M3U
💾 Sincronizando com Supabase...
✅ Lote 1 inserido ([N] itens)
... (mais lotes se necessário)
✅ [N] [tipo] sincronizados com sucesso!

========================================
📊 RESUMO DA SINCRONIZAÇÃO
========================================
✅ filmes: [N] registros sincronizados
✅ series: [N] registros sincronizados
✅ canais: [N] registros sincronizados
========================================
✅ Total: [N] registros sincronizados
🚀 Conteúdo atualizado em todas as páginas!
```

**Validação Completa no Banco:**
```sql
-- Estatísticas gerais
SELECT * FROM estatisticas_conteudo;

-- Conteúdo recente
SELECT * FROM conteudo_recente LIMIT 10;

-- Total por categoria
SELECT categoria, COUNT(*) as total 
FROM filmes 
GROUP BY categoria 
ORDER BY total DESC;

SELECT categoria, COUNT(*) as total 
FROM series 
GROUP BY categoria 
ORDER BY total DESC;

SELECT categoria, COUNT(*) as total 
FROM canais 
GROUP BY categoria 
ORDER BY total DESC;
```

---

## ✅ Fase 4: Validação nas Páginas

### 4.1 Página de Filmes

**Acesse:**
```
/filmes
```

**Verificar:**
- ✅ Cards de filmes são exibidos
- ✅ Imagens carregam corretamente
- ✅ Categorias estão corretas
- ✅ Hover mostra informações
- ✅ Click abre player/detalhes

### 4.2 Página de Séries

**Acesse:**
```
/series
```

**Verificar:**
- ✅ Cards de séries são exibidos
- ✅ Imagens carregam corretamente
- ✅ Categorias estão corretas
- ✅ Hover mostra informações
- ✅ Click abre player/detalhes

### 4.3 Página de Canais

**Acesse:**
```
/canais
```

**Verificar:**
- ✅ Lista de canais exibida
- ✅ Logos carregam corretamente
- ✅ Categorias/grupos estão corretos
- ✅ Click abre player IPTV

### 4.4 Sistema IPTV

**Acesse:**
```
/iptv
```

**Verificar:**
- ✅ Player IPTV funciona
- ✅ Lista de canais carrega
- ✅ Troca de canal funciona
- ✅ Stream inicia corretamente

---

## ✅ Fase 5: Teste de Duplicatas

### 5.1 Executar Sincronização Duas Vezes

**Ações:**
```
1. Executar sincronização completa
2. Anotar total de registros
3. Executar sincronização completa novamente
4. Comparar totais
```

**Resultado Esperado:**
```
✅ Total de registros permanece o mesmo
✅ Não há duplicatas
✅ Registros são atualizados (updated_at mudou)
```

**Validação SQL:**
```sql
-- Verificar duplicatas
SELECT nome, COUNT(*) as qtd 
FROM filmes 
GROUP BY nome 
HAVING COUNT(*) > 1;

SELECT nome, COUNT(*) as qtd 
FROM series 
GROUP BY nome 
HAVING COUNT(*) > 1;

SELECT nome, COUNT(*) as qtd 
FROM canais 
GROUP BY nome 
HAVING COUNT(*) > 1;

-- Deve retornar 0 linhas em todas as queries
```

---

## ✅ Fase 6: Teste de Parser M3U

### 6.1 Testar Conversão M3U

**Criar arquivo de teste M3U:**

```m3u
#EXTM3U
#EXTINF:-1 tvg-id="test1" tvg-name="Canal Teste 1" tvg-logo="https://example.com/logo1.png" group-title="Testes",Canal Teste 1
https://example.com/stream1.m3u8
#EXTINF:-1 tvg-id="test2" tvg-name="Canal Teste 2" tvg-logo="https://example.com/logo2.png" group-title="Testes",Canal Teste 2
https://example.com/stream2.m3u8
```

**Testar no Console do Navegador:**

```javascript
import { parseM3U, isValidM3U } from '../utils/m3uParser';

const testM3U = `#EXTM3U
#EXTINF:-1 tvg-id="test1" tvg-name="Canal Teste" tvg-logo="https://example.com/logo.png" group-title="Testes",Canal Teste
https://example.com/stream.m3u8`;

console.log('É M3U válido?', isValidM3U(testM3U));
console.log('Resultado do parse:', parseM3U(testM3U));
```

**Resultado Esperado:**
```javascript
{
  nome: "Canal Teste",
  logo: "https://example.com/logo.png",
  url: "https://example.com/stream.m3u8",
  categoria: "testes",
  tvg_id: "test1",
  tvg_name: "Canal Teste",
  group_title: "Testes"
}
```

---

## 📊 Relatório de Teste

### Template de Relatório

```markdown
# Relatório de Teste - GitHub Sync

**Data**: [DATA DO TESTE]
**Testador**: [SEU NOME]
**Versão**: 4.0

## Resultados

### ✅ Fase 1: Preparação
- [ ] Banco de dados configurado
- [ ] Índices únicos criados
- [ ] Repositório acessível

### ✅ Fase 2: Interface
- [ ] Painel carrega corretamente
- [ ] Sincronização individual Filmes
- [ ] Sincronização individual Séries
- [ ] Sincronização individual Canais

### ✅ Fase 3: Sincronização Completa
- [ ] Todos os arquivos baixados
- [ ] Conversão M3U funciona
- [ ] Logs detalhados exibidos
- [ ] Estatísticas corretas

### ✅ Fase 4: Páginas
- [ ] Página Filmes exibe conteúdo
- [ ] Página Séries exibe conteúdo
- [ ] Página Canais exibe conteúdo
- [ ] Sistema IPTV funciona

### ✅ Fase 5: Duplicatas
- [ ] Não há duplicatas
- [ ] Upsert funciona corretamente

### ✅ Fase 6: Parser M3U
- [ ] Validação M3U funciona
- [ ] Parse extrai informações corretamente

## Estatísticas Finais

- **Total Filmes**: [N]
- **Total Séries**: [N]
- **Total Canais**: [N]
- **Total Geral**: [N]
- **Tempo de Sincronização**: [N] segundos

## Observações

[Adicione aqui qualquer observação ou problema encontrado]

## Status Final

[ ] ✅ APROVADO - Tudo funcionando
[ ] ⚠️ APROVADO COM RESSALVAS - Pequenos ajustes necessários
[ ] ❌ REPROVADO - Problemas críticos encontrados
```

---

## 🐛 Problemas Comuns

### Erro 404 - Arquivo não encontrado

**Causa**: Caminho do arquivo incorreto ou repositório privado

**Solução**:
```
1. Verificar URL: https://raw.githubusercontent.com/Fabriciocypreste/FIGMA1/main/data/filmes.json
2. Confirmar que repositório está público
3. Verificar nome dos arquivos (case-sensitive)
```

### Erro: "duplicate key value violates unique constraint"

**Causa**: Índice único não foi criado

**Solução**:
```sql
DROP INDEX IF EXISTS unique_filme_nome;
DROP INDEX IF EXISTS unique_serie_nome;
DROP INDEX IF EXISTS unique_canal_nome;

CREATE UNIQUE INDEX unique_filme_nome ON filmes(nome);
CREATE UNIQUE INDEX unique_serie_nome ON series(nome);
CREATE UNIQUE INDEX unique_canal_nome ON canais(nome);
```

### Nenhum log aparece

**Causa**: Erro JavaScript ou componente não renderizou

**Solução**:
```
1. Abrir DevTools (F12)
2. Verificar erros no console
3. Verificar aba Network para requisições
4. Recarregar página
```

---

## 📞 Suporte

Se encontrar problemas não listados aqui:

1. Abra um issue no GitHub
2. Inclua:
   - Logs do console
   - Mensagens de erro
   - Passos para reproduzir
   - Screenshots se possível

---

**Boa sorte com os testes! 🚀**
