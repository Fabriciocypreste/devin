# 🚀 GitHub Sync - Guia Rápido de Início

## ⚡ Início Rápido (3 minutos)

### 1️⃣ Acesse o Admin Dashboard

```
1. Faça login no RedFlix
2. Vá para Dashboard do Usuário (ícone de perfil)
3. Clique em "Admin Dashboard"
4. No menu lateral, clique em "GitHub Sync" 
```

### 2️⃣ Execute a Sincronização

```
1. Clique no botão vermelho "🔄 Sincronizar Tudo"
2. Aguarde (acompanhe o progresso)
3. Pronto! ✅
```

### 3️⃣ Verifique o Resultado

Abra as páginas para ver o conteúdo:
- `/filmes` - Filmes sincronizados
- `/series` - Séries sincronizadas
- `/canais` - Canais sincronizados

---

## 📊 O que acontece?

### Processo Automático

```
📡 Conecta ao GitHub
    ↓
📥 Baixa arquivos (filmes.json, series.json, canais.json, lista.m3u)
    ↓
🔄 Converte M3U para JSON (se necessário)
    ↓
💾 Faz upsert no Supabase (evita duplicatas)
    ↓
✅ Conteúdo disponível no site!
```

### Logs Esperados

```
📡 Conectando ao repositório GitHub FIGMA1...
✅ Arquivo filmes.json encontrado (120 itens)
✅ Arquivo series.json encontrado (80 itens)  
✅ Arquivo canais.json encontrado (400 itens)
🔄 Enviando dados para Supabase...
✅ 600 registros sincronizados com sucesso!
🚀 Conteúdo atualizado em todas as páginas!
```

---

## 🎯 Recursos Principais

### ✅ Sincronização Completa
- **Botão**: "🔄 Sincronizar Tudo"
- **Tempo**: ~30-60 segundos
- **Resultado**: Todos os filmes, séries e canais atualizados

### ✅ Sincronização Individual
- **Botões**: "🎬 Filmes", "📺 Séries", "📡 Canais"
- **Tempo**: ~10-20 segundos cada
- **Resultado**: Apenas o tipo selecionado é atualizado

### ✅ Console Log em Tempo Real
- Acompanhe cada etapa
- Veja estatísticas detalhadas
- Identifique erros rapidamente

---

## 📦 Fonte dos Dados

**Repositório GitHub**: [Fabriciocypreste/FIGMA1](https://github.com/Fabriciocypreste/FIGMA1)

**Arquivos lidos**:
- `data/filmes.json` → Tabela `filmes`
- `data/series.json` → Tabela `series`
- `data/canais.json` → Tabela `canais`
- `lista.m3u` → Tabela `canais` (convertido)

---

## 🔧 Configuração do Banco (Apenas uma vez)

Se for a primeira vez usando o sistema, execute este SQL no Supabase:

```sql
-- Criar índices únicos para permitir upsert
CREATE UNIQUE INDEX IF NOT EXISTS unique_filme_nome ON filmes(nome);
CREATE UNIQUE INDEX IF NOT EXISTS unique_serie_nome ON series(nome);
CREATE UNIQUE INDEX IF NOT EXISTS unique_canal_nome ON canais(nome);
```

**Como executar**:
1. Abra o Supabase Dashboard
2. Vá em "SQL Editor"
3. Cole o SQL acima
4. Clique em "Run"

---

## ❓ FAQ Rápido

### P: Posso sincronizar várias vezes?
**R**: Sim! O sistema usa upsert, então não duplica conteúdo.

### P: E se der erro?
**R**: O console log mostrará o erro específico. Geralmente é:
- Arquivo não encontrado (404)
- Formato inválido
- Problema de conexão

### P: Quanto tempo demora?
**R**: 
- Sincronização completa: ~30-60s
- Individual: ~10-20s
- Depende da quantidade de registros

### P: Os dados são sobrescritos?
**R**: Sim, registros com mesmo nome são atualizados. Novos registros são inseridos.

### P: Preciso fazer backup?
**R**: O Supabase mantém histórico, mas é recomendado fazer backup antes da primeira sincronização.

---

## 🆘 Suporte Rápido

### Erro: "Arquivo não encontrado"
✅ Verifique se o repositório FIGMA1 está público  
✅ Confirme que os arquivos existem no caminho correto

### Erro: "Formato inválido"
✅ Verifique se o JSON é válido  
✅ Para M3U, confirme que tem `#EXTM3U`

### Erro: "Duplicate key"
✅ Execute o SQL de criação dos índices únicos

---

## 📚 Documentação Completa

Para mais detalhes, veja:
- `GITHUB_SYNC_README.md` - Documentação completa
- `supabase/migrations/create_tables.sql` - Schema do banco
- `utils/githubSync.ts` - Código de sincronização
- `utils/m3uParser.ts` - Parser M3U

---

**🎉 Pronto! Seu RedFlix agora usa dados reais do GitHub!**

Para suporte: [Fabricio Cypreste](https://github.com/Fabriciocypreste)
