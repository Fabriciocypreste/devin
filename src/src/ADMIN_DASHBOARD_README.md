# 🎛️ Admin Dashboard - Redfliz

Dashboard administrativo completo para gerenciamento da plataforma de streaming Redfliz.

## 🚀 Como Acessar

1. Na sidebar esquerda, clique em **"Admin Panel"** (último item da seção "OUTROS")
2. O dashboard abrirá em tela cheia com menu lateral

## 📊 Módulos Implementados

### 1. **Dashboard Overview** (Visão Geral)
Página principal com métricas consolidadas:

#### KPIs Principais:
- **Assinantes Ativos**: 12,458 (+342 este mês)
- **Novos Registros**: 342 novos usuários
- **Cancelamentos**: 28 (taxa de 2.3%)
- **MRR (Receita Mensal Recorrente)**: R$ 186k (+12.5%)

#### Métricas de Engajamento:
- **Total de Visualizações**: 847k
- **Horas Assistidas**: 234k horas
- **Taxa de Engajamento**: 78.4%

#### Gráficos:
- **Crescimento de Usuários**: Gráfico de área com evolução mensal
- **Receita Mensal**: Gráfico de barras (Jan-Jun)
- **Distribuição por Dispositivo**: Gráfico de pizza
  - Smart TV: 45%
  - Mobile: 30%
  - Desktop: 20%
  - Tablet: 5%
- **Distribuição de Planos**: Comparativo de assinantes por plano
- **Minutos Assistidos**: Tendência de consumo

#### Top 10 Conteúdos:
Tabela com os filmes/séries mais assistidos:
1. Breaking Bad - 45,890 views - 12,834h - ⭐ 9.5
2. Stranger Things - 42,340 views - 11,245h - ⭐ 9.2
3. The Witcher - 38,920 views - 10,567h - ⭐ 8.9
... até o 10º lugar

#### Alertas do Sistema:
- **Erros de Servidor**: 3 ocorrências
- **Problemas no Player**: 1 ocorrência
- **Conversão Trial → Pago**: 24.6% (taxa de conversão)

---

### 2. **Usuários e Assinaturas**

#### Estatísticas:
- Total de usuários: 12,458
- Ativos: 10,234
- Em Trial: 1,892
- Suspensos: 332

#### Funcionalidades:
✅ **Busca avançada** por nome ou e-mail
✅ **Filtros por status**: Todos, Ativos, Trial, Suspensos, Cancelados
✅ **Tabela completa** com:
  - Nome e e-mail do usuário
  - Status atual (badge colorido)
  - Plano contratado
  - MRR (receita mensal do usuário)
  - Data de cadastro
  - Último login
  - Número de dispositivos conectados
  - Total gasto histórico

#### Ações por Usuário:
- Ver detalhes completos
- Enviar e-mail
- Gerenciar plano (upgrade/downgrade)
- Histórico de pagamentos
- Suspender conta

#### Comunicação em Massa:
- **Enviar E-mail**: Para grupos selecionados
- **Push Notification**: Notificações instantâneas
- **Exportar CSV**: Download de dados dos usuários

---

### 3. **Painel Financeiro**

#### Métricas Financeiras:
- **MRR**: R$ 352k (Monthly Recurring Revenue)
- **ARR**: R$ 4.2M (Annual Recurring Revenue)
- **LTV**: R$ 890 (Lifetime Value médio)
- **Taxa de Churn**: 2.3%

#### Gráfico de Receita:
Evolução mensal de:
- Receita (linha verde)
- Custos (linha vermelha)
- Lucro (linha roxa)

#### Planos e Preços:
**Básico** - R$ 15,90/mês
- HD
- 1 Tela
- Sem Download
- 4,500 assinantes → R$ 71.5k MRR

**Premium** - R$ 29,90/mês
- Full HD
- 2 Telas
- Download
- 5,800 assinantes → R$ 173.4k MRR

**Ultra** - R$ 49,90/mês
- 4K
- 4 Telas
- Download
- 2,158 assinantes → R$ 107.7k MRR

#### Transações Recentes:
Tabela com últimas transações:
- ID da transação
- Usuário
- Plano
- Valor
- Data/hora
- Status (Sucesso/Pendente/Falhou)

#### Integrações de Pagamento:
- Stripe
- PayPal
- PIX (futuro)

---

### 4. **Gerenciamento de Conteúdo**

#### Estatísticas:
- Total: 2,847 títulos
- Publicados: 2,456
- Pendentes: 234
- Rascunhos: 157

#### Funcionalidades:
✅ **Busca** por título, gênero ou tags
✅ **Grid de conteúdo** com cards visuais
✅ **Status visual**:
  - 🟢 Publicado
  - 🟡 Pendente
  - ⚪ Rascunho

#### Informações por Card:
- Thumbnail (placeholder)
- Título
- Tipo (Filme/Série)
- Avaliação (⭐ rating)
- Número de episódios/temporadas (séries)
- Duração (filmes)
- Visualizações
- Data de adição

#### Ações Disponíveis (hover no card):
- 👁️ Visualizar
- ✏️ Editar metadados
- 🗑️ Deletar

#### Upload de Conteúdo:
- Botão "Adicionar Conteúdo"
- Botão "Importar" (CSV/JSON)

#### Metadados Gerenciáveis:
- Título, sinopse, elenco
- Pôsteres, thumbnails, trailers
- Idiomas, legendas, dublagens
- Categorias e gêneros
- Tags e coleções

---

### 5. **Estatísticas & Analytics**

#### KPIs da Semana:
- Visualizações (7 dias): 130.8k
- Horas Assistidas: 34.3k
- Usuários Ativos: 26.5k
- Tempo Médio por Sessão: 1h 18m

#### Gráfico de Visualizações:
Últimos 7 dias com:
- Views por dia
- Horas assistidas
- Usuários ativos

#### Distribuição por Dispositivo:
- Smart TV: 45%
- Mobile: 30%
- Desktop: 20%
- Tablet: 5%

#### Top Regiões (Brasil):
1. São Paulo: 125k views
2. Rio de Janeiro: 89k views
3. Minas Gerais: 67k views
4. Paraná: 54k views
5. Bahia: 48k views

#### Métricas Avançadas:
- Taxa de retenção
- Média de tempo assistido por título
- Taxa de abandono (onde usuários param)
- Dispositivos mais usados
- Horários de pico de acesso

---

### 6. **Suporte & Feedback**

#### Tickets de Suporte:
- **Abertos**: 42 tickets
- **Em Andamento**: 28 tickets
- **Resolvidos**: 234 tickets

#### Sistema de Tickets:
Cada ticket contém:
- ID único (#TK-xxxx)
- Usuário
- Assunto
- Status (Aberto/Em Andamento/Resolvido)
- Prioridade (Alta/Média/Baixa)
- Data/hora

#### Feedback dos Usuários:
- Nome do usuário
- Avaliação em estrelas (1-5)
- Comentário textual
- Data do feedback

#### Funcionalidades Futuras:
- Sistema de chat interno
- Respostas automáticas (FAQ)
- Integração com WhatsApp/Telegram
- SLA tracking

---

### 7. **Configurações do Sistema**

#### Status dos Servidores:
✅ **CDN Principal**
- Status: Online (verde pulsante)
- Latência: 12ms
- Uptime: 99.98%

✅ **Banco de Dados**
- Status: Online
- Queries: 2.4k/segundo
- Conexões ativas: 142

✅ **Storage (Supabase)**
- Status: Online
- Usado: 234 GB / 500 GB (47%)

⚠️ **Player Stream**
- Status: Limitado (amarelo)
- Bandwidth: 78% utilizado

#### Chaves de API:
- **Chave de Produção**: sk_live_*************************** (Renovar)
- **TMDB API**: ddb1bdf6aa91*************** (Editar)

#### Segurança:
✅ **Autenticação de Dois Fatores** (Ativado)
✅ **Logs de Auditoria** (Ativado)
✅ **SSL/TLS** (Certificado válido até 15/12/2025)

#### Integrações Ativas:
- ✅ Google Analytics
- ✅ Firebase
- ✅ Supabase
- ✅ Stripe

---

## 🎨 Design System

### Cores:
- **Background**: `#0a0a0a`, `#141414`, `#1a1a1a`
- **Cards**: `#1a1a1a` → `#252525` (gradiente)
- **Bordas**: `white/10` (branco 10% opacidade)
- **Vermelho**: `#DC2626` (Redfliz)
- **Verde**: `#10B981` (sucesso)
- **Amarelo**: `#EAB308` (atenção)
- **Roxo**: `#A855F7` (premium)

### Fontes:
- **Inter** (todas as variações)
- Extra Bold: Títulos
- Bold: Números/KPIs
- Semi Bold: Labels
- Medium: Texto padrão
- Regular: Descrições

### Componentes UI:
Usando **shadcn/ui**:
- Card
- Button
- Input
- Select
- Badge
- DropdownMenu
- Switch
- Tooltip

### Gráficos:
Usando **Recharts**:
- LineChart (tendências)
- AreaChart (crescimento)
- BarChart (comparativos)
- PieChart (distribuição)

---

## 🔄 Dados Mockados

Atualmente o dashboard usa **dados mockados** para demonstração.

### Para Integrar com Backend Real:

1. **Substituir dados mock** por chamadas API
2. **Conectar ao Supabase** para dados de usuários
3. **Integrar com TMDB** para métricas de conteúdo
4. **Adicionar webhooks** para atualizações em tempo real
5. **Implementar cache** com React Query

### Exemplo de Integração:
```typescript
// Antes (mock)
const stats = {
  activeSubscribers: 12458,
  newSubscribers: 342,
  cancellations: 28
};

// Depois (API)
const { data: stats } = useQuery('dashboard-stats', async () => {
  const response = await fetch('/api/admin/stats');
  return response.json();
});
```

---

## 📱 Responsividade

O dashboard é **totalmente responsivo**:
- Desktop: Layout completo com sidebar
- Tablet: Grid adaptativo
- Mobile: Cards empilhados (futuro)

---

## 🔐 Segurança

### Acesso Restrito:
- Apenas usuários **admin** podem acessar
- Autenticação via Supabase Auth
- Permissões por role (admin/moderator)

### Logs de Auditoria:
Todas as ações admin são logadas:
- Alterações de usuário
- Mudanças de plano
- Upload de conteúdo
- Configurações do sistema

---

## 🚀 Próximos Passos

### Features Planejadas:
1. **Notificações em Tempo Real**
   - WebSocket para updates live
   - Toast notifications para eventos

2. **Exportação Avançada**
   - PDF de relatórios
   - Excel com gráficos
   - Agendamento de relatórios

3. **Automação**
   - Regras automáticas (ex: trial → oferta)
   - E-mails programados
   - Backup automático

4. **AI/ML Integration**
   - Recomendações personalizadas
   - Detecção de fraude
   - Previsão de churn

5. **Páginas Adicionais**
   - Publicidade (ads management)
   - Branding (customização visual)
   - Notificações (push/email/sms)
   - Integrações avançadas

---

## 💡 Uso

### Navegação:
1. Clique no item do menu lateral
2. Conteúdo atualiza na área principal
3. Use botões "Voltar" ou ESC para sair

### Filtragem:
- Use a barra de busca no topo
- Selecione filtros de status
- Clique em colunas para ordenar

### Ações em Massa:
- Selecione múltiplos itens (futuro)
- Use botões de ação em massa
- Confirme antes de executar

---

**Versão**: 1.0.0  
**Última Atualização**: Novembro 2024  
**Status**: ✅ Funcional com dados mockados

Para dúvidas ou sugestões, consulte a documentação técnica ou abra um issue no repositório.
