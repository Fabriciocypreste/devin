# 🎬 RedFlix - Guia de Configuração do Banco de Dados

## 🔍 Verificar Estado do Banco de Dados

Existem **3 formas** de verificar o que já foi criado no Supabase:

---

## ✅ Opção 1: Interface React (Mais Bonita) ⭐ RECOMENDADO

**Como acessar:**

1. Na URL da aplicação, adicione: `?db-status=true`
2. Exemplo: `https://seu-app.com/?db-status=true`

**O que você verá:**
- ✅ Tabelas existentes/faltando em tempo real
- ✅ Buckets existentes/faltando
- ✅ Status de RLS e políticas
- ✅ Botão para criar buckets automaticamente
- ✅ Interface estilo Netflix/RedFlix

---

## ✅ Opção 2: Interface HTML Standalone

**Como acessar:**

1. Abra o arquivo: `/verify-database.html` no navegador
2. A verificação é automática ao abrir a página

**Recursos:**
- Dashboard bonito estilo Netflix
- Estatísticas em tempo real
- Botão para criar buckets
- Funciona sem precisar rodar a aplicação

---

## ✅ Opção 3: Via HTTP/API Direto

**Endpoint de Verificação:**

```bash
curl https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/database/verify \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog"
```

**Endpoint para Criar Buckets:**

```bash
curl -X POST https://glnmajvrxdwfyedsuaxx.supabase.co/functions/v1/make-server-2363f5d6/database/create-buckets \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdsbm1hanZyeGR3ZnllZHN1YXh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNzI1NzIsImV4cCI6MjA3Nzg0ODU3Mn0.a4uIxvJFFCJeptDUMinnIAsNz0W-qnmqsdujzBJsHog" \
  -H "Content-Type: application/json"
```

---

## 📊 O que será verificado:

### ✅ Tabelas (14 esperadas):
1. **users** - Usuários do sistema
2. **profiles** - Perfis de usuário
3. **content** - Filmes e séries
4. **seasons** - Temporadas de séries
5. **episodes** - Episódios de séries
6. **my_list** - Minha Lista
7. **favorites** - Favoritos
8. **watch_history** - Histórico de visualização
9. **reviews** - Avaliações
10. **iptv_channels** - Canais IPTV
11. **iptv_favorites** - Canais favoritos
12. **notifications** - Notificações
13. **admin_logs** - Logs admin
14. **analytics_events** - Eventos de analytics
15. **system_settings** - Configurações do sistema (EXTRA - não estava na lista original)

### ✅ Storage Buckets (3 esperados):
1. **make-2363f5d6-avatars** - Avatares de perfis (2MB, privado)
2. **make-2363f5d6-channel-logos** - Logos de canais (500KB, público)
3. **make-2363f5d6-content-media** - Mídia de conteúdo (5MB, público)

### ✅ Row Level Security:
- Verifica quantas tabelas têm RLS habilitado
- Conta total de políticas RLS (esperado: 60+)
- Mostra distribuição por tabela

### ✅ Funções (10 esperadas):
1. **update_updated_at** - Atualiza timestamps
2. **calculate_progress_percentage** - Calcula progresso
3. **enforce_max_profiles_per_user** - Limita perfis
4. **create_user_record** - Cria registro de usuário
5. **increment_helpful_count** - Incrementa helpful
6. **get_content_with_progress** - Busca com progresso
7. **search_content** - Busca de conteúdo
8. **get_trending_content** - Conteúdo em alta
9. **update_content_from_tmdb** - Atualiza do TMDB
10. **get_user_recommendations** - Recomendações

### ✅ Triggers (12 esperados):
- update_users_updated_at
- update_profiles_updated_at
- update_content_updated_at
- update_seasons_updated_at
- update_episodes_updated_at
- update_my_list_updated_at
- update_watch_history_updated_at
- update_reviews_updated_at
- update_iptv_channels_updated_at
- update_notifications_updated_at
- check_max_profiles_trigger
- create_user_record_trigger

### ✅ Índices (70+ esperados):
Otimizações de performance para todas as tabelas

---

## 🚀 Fluxo Completo de Setup:

```mermaid
graph TD
    A[Início] --> B[AI do Supabase executa SQL]
    B --> C[Criar Tabelas, Funções, Triggers, RLS]
    C --> D{Sucesso?}
    D -->|Sim| E[Abrir Interface de Verificação]
    D -->|Não| F[Analisar Erro e Corrigir]
    F --> B
    E --> G[Verificar Status]
    G --> H{Buckets Criados?}
    H -->|Não| I[Clicar 'Criar Buckets']
    H -->|Sim| J[✅ Banco Completo!]
    I --> J
```

---

## 🎯 Status Esperados:

### ✅ **Status: READY** (Tudo OK)
```json
{
  "overall_status": "ready",
  "tables": { "missing": [] },
  "storage": { "missing": [] }
}
```

### ⚠️ **Status: NEEDS_SETUP** (Configuração necessária)
```json
{
  "overall_status": "needs_setup",
  "tables": { "missing": ["users", "profiles", ...] },
  "storage": { "missing": ["make-2363f5d6-avatars", ...] }
}
```

---

## 🔧 Arquivos Criados:

### Backend (Edge Function):
- `/supabase/functions/server/database_setup.tsx` - Módulo de setup
- `/supabase/functions/server/index.tsx` - Rotas adicionadas

### Frontend:
- `/components/DatabaseStatus.tsx` - Componente React
- `/verify-database.html` - Interface HTML standalone
- `/verify-database.ts` - Script CLI (opcional)

### SQL:
- `/supabase/REDFLIX_COMPLETE_DATABASE.sql` - SQL completo (gerado pela outra AI)
- `/supabase/migrations/*.sql` - Migrations individuais (se existirem)

---

## 📝 Próximos Passos:

### 1️⃣ Se a AI do Supabase ainda estiver executando:
- ⏳ Aguarde a conclusão
- 📋 Anote se houve erros

### 2️⃣ Quando terminar:
- 🔍 Acesse a interface de verificação
- 📊 Veja o que foi criado
- 📦 Crie buckets se necessário

### 3️⃣ Se tudo estiver ✅:
- 🎉 Banco completo e pronto!
- 🚀 Pode começar a usar a aplicação

### 4️⃣ Se houver erros:
- 📸 Tire screenshot do erro
- 📋 Copie mensagem completa
- 🤖 Envie para correção

---

## 💡 Dicas:

- **Buckets são opcionais no início**: A aplicação funciona sem eles, mas é necessário para upload de avatares e logos
- **Tabelas são obrigatórias**: Sem elas a aplicação não funciona corretamente
- **RLS é importante**: Garante segurança dos dados
- **Verifique sempre**: Use a interface para conferir o status

---

## 🆘 Troubleshooting:

### Problema: "Tabelas não aparecem"
**Solução:** A AI do Supabase ainda está executando, aguarde.

### Problema: "Erro ao verificar banco"
**Solução:** Verifique se o Edge Function está rodando.

### Problema: "Buckets não criados"
**Solução:** Clique no botão "Criar Buckets Faltantes" na interface.

### Problema: "Erro de permissão"
**Solução:** Verifique se o SERVICE_ROLE_KEY está configurado corretamente.

---

## 📞 Suporte:

Se encontrar problemas:
1. Abra a interface de verificação
2. Tire screenshot completo
3. Copie JSON de erro (se houver)
4. Reporte o problema

---

**✅ Última atualização:** Dezembro 2024
**🎬 RedFlix Database Setup v1.0**
