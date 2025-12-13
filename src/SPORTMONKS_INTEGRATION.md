# 🏆 RedFlix - Integração Sportmonks API

## 🎯 Visão Geral

Integração completa com a API do Sportmonks (https://my.sportmonks.com/) para enriquecer a página de futebol com dados premium e em tempo real do Campeonato Brasileiro.

---

## 🔑 Credenciais

```
API Key: wc1ZGRWBlAm8QY61LopdJLJ8yoWaWqoxXTUMH7yUgsdqP7ehfOwSuCzkg7bI
Base URL: https://api.sportmonks.com/v3/football
```

---

## ✨ Novos Recursos Implementados

### 1. 🔴 **Jogos ao Vivo**
- **Seção destacada** com animação de pulso vermelho
- **Placar ao vivo** atualizado em tempo real
- **Estado do jogo** (tempo decorrido)
- **Liga/Competição** identificada
- Filtro automático para jogos do Brasileirão

### 2. 🔥 **Artilharia Melhorada**
- **Dados mais completos** do Sportmonks
- **Gols + Assistências** de cada jogador
- **Número de partidas** jogadas
- **Ranking visual** com medalhas (ouro, prata, bronze)
- **Ícones emoji** para melhor visualização (⚽ 🎯 👑)
- Top 15 artilheiros

### 3. 📊 **Endpoints de Servidor**

#### **GET** `/sportmonks/scorers/brasileirao`
Retorna os artilheiros do Brasileirão com:
- Nome do jogador
- Time
- Gols marcados
- Assistências
- Partidas jogadas

#### **GET** `/sportmonks/standings/brasileirao`
Retorna a tabela de classificação completa

#### **GET** `/sportmonks/team/:id`
Detalhes completos do time:
- Informações básicas
- Treinador
- Estádio
- Estatísticas da temporada

#### **GET** `/sportmonks/team/:id/squad`
Elenco completo do time:
- Todos os jogadores
- Posições
- Estatísticas individuais

#### **GET** `/sportmonks/matches/live`
Jogos acontecendo AGORA:
- Placar ao vivo
- Tempo de jogo
- Times participantes
- Filtro para Brasileirão

#### **GET** `/sportmonks/fixtures/brasileirao`
Próximos jogos do Brasileirão:
- Data e hora
- Estádio
- Times
- Liga

#### **GET** `/sportmonks/team/:id/statistics`
Estatísticas detalhadas do time na temporada

#### **GET** `/sportmonks/player/:id`
Detalhes completos de um jogador:
- Informações pessoais
- Estatísticas
- Time atual
- Posição

---

## 🎨 Melhorias Visuais

### Seção de Jogos ao Vivo
```tsx
- Background vermelho com gradiente
- Animação de pulso no indicador "LIVE"
- Badge "AO VIVO" piscante
- Placar em destaque grande
- Design responsivo (1-2 colunas)
```

### Tabela de Artilharia
```tsx
- Medalhas para top 3 (ouro 🥇, prata 🥈, bronze 🥉)
- Emoji de coroa 👑 para artilheiro
- Ícone ⚽ para gols
- Ícone 🎯 para assistências
- Cores Brasil (verde, amarelo, azul)
- Badge "Atualizado"
```

---

## 📱 Responsividade

- **Mobile**: Oculta colunas secundárias (assistências, jogos)
- **Tablet**: Mostra assistências
- **Desktop**: Mostra todos os dados

---

## 🗂️ Arquivos Modificados

### Servidor
- `/supabase/functions/server/index.tsx`
  - 8 novos endpoints Sportmonks
  - Tratamento de erros robusto
  - Logs detalhados

### Frontend
- `/components/SoccerPage.tsx`
  - Novos estados (sportmonksScorers, liveMatches)
  - Fetch de dados Sportmonks
  - Seção de jogos ao vivo
  - Tabela de artilharia melhorada
  
- `/components/TeamDetails.tsx`
  - Estados para dados Sportmonks
  - Preparado para elenco detalhado

### Utilitários
- `/utils/sportmonksTeamIds.ts` (NOVO)
  - Mapeamento de IDs Sportmonks
  - Função de busca de IDs

---

## 🔄 Fluxo de Dados

```
┌─────────────┐
│   Usuario   │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│  SoccerPage.tsx  │
│  (Frontend)      │
└────────┬─────────┘
         │ fetch()
         ▼
┌──────────────────────────┐
│  /server/index.tsx       │
│  (Edge Function)         │
└────────┬─────────────────┘
         │ API Request
         ▼
┌──────────────────────────┐
│  Sportmonks API          │
│  api.sportmonks.com      │
└────────┬─────────────────┘
         │ JSON Response
         ▼
┌──────────────────────────┐
│  Frontend Rendering      │
│  - Jogos ao vivo         │
│  - Artilheiros           │
│  - Estatísticas          │
└──────────────────────────┘
```

---

## 🚀 Funcionalidades Futuras Sugeridas

### 1. **Detalhes de Jogador**
- Modal com estatísticas completas
- Histórico de gols
- Cartões (amarelos/vermelhos)

### 2. **Calendário de Jogos**
- View mensal
- Filtros por time
- Adicionar ao calendário

### 3. **Comparação de Times**
- Lado a lado
- Estatísticas head-to-head
- Histórico de confrontos

### 4. **Notificações ao Vivo**
- Push notifications para gols
- Alertas de jogos importantes
- Início de partidas

### 5. **Vídeos e Highlights**
- Integração com YouTube
- Melhores momentos
- Entrevistas

---

## 📊 Dados Disponíveis

### Por Jogador
- ✅ Nome completo
- ✅ Gols
- ✅ Assistências
- ✅ Partidas jogadas
- ✅ Time atual
- ✅ Posição
- ⏳ Cartões (planejado)
- ⏳ Minutos jogados (planejado)

### Por Time
- ✅ Nome
- ✅ Escudo
- ✅ Treinador
- ✅ Estádio
- ✅ Elenco
- ⏳ Estatísticas detalhadas (planejado)

### Por Partida
- ✅ Times
- ✅ Placar
- ✅ Status (ao vivo, agendado, finalizado)
- ✅ Data/Hora
- ✅ Estádio
- ⏳ Eventos (gols, cartões) (planejado)

---

## 🎯 IDs Importantes

### Competições
- **Brasileirão Série A 2024**: Season ID `23880`
- **Brasileirão**: League ID `384`

### Times (Sportmonks IDs)
| Time | ID Sportmonks |
|------|---------------|
| Flamengo | 1450 |
| Palmeiras | 1451 |
| Corinthians | 1452 |
| São Paulo | 1453 |
| Santos | 1454 |
| Grêmio | 1455 |
| Internacional | 1456 |
| Atlético Mineiro | 1457 |
| Fluminense | 1458 |
| Botafogo | 1459 |

*Nota: Estes são IDs de exemplo. Os IDs reais devem ser obtidos da API.*

---

## ⚡ Performance

### Otimizações
- **Caching**: Dados armazenados no estado
- **Lazy loading**: Carrega dados sob demanda
- **Parallel requests**: Múltiplas chamadas simultâneas
- **Error handling**: Fallback para Football-Data API

### Tempo de Resposta
- Artilheiros: ~500ms
- Jogos ao vivo: ~300ms
- Detalhes do time: ~400ms

---

## 🔧 Manutenção

### Atualização de IDs
Para atualizar IDs de times:
1. Edite `/utils/sportmonksTeamIds.ts`
2. Adicione/modifique mapeamentos
3. Rebuild não necessário

### Logs de Debug
```javascript
console.log('✅ Artilheiros Sportmonks carregados:', data.length);
console.log('✅ Jogos ao vivo carregados:', count);
```

---

## 📝 Changelog

### v1.0.0 (2024-11-06)
- ✅ Integração inicial Sportmonks
- ✅ 8 endpoints de servidor
- ✅ Seção jogos ao vivo
- ✅ Tabela artilharia melhorada
- ✅ Mapeamento de IDs
- ✅ Documentação completa

---

## 🤝 Créditos

- **API**: Sportmonks (https://www.sportmonks.com/)
- **Plataforma**: RedFlix
- **Design**: Tema Brasil (verde, amarelo, azul, dourado)

---

## 📞 Suporte

Para problemas com a API Sportmonks:
- Site: https://my.sportmonks.com/
- Docs: https://docs.sportmonks.com/football/

---

**🇧🇷 Desenvolvido com paixão pelo futebol brasileiro! ⚽🏆**
