# 🧪 Teste Rápido: Temporadas e Episódios

**Execute este teste no Console do navegador (F12)**

---

## 🎯 TESTE 1: Verificar API do Servidor

```javascript
// Copie e cole no Console (DevTools)

async function testSeasonAPI() {
  console.log('🧪 Iniciando teste da API de temporadas...\n');
  
  const projectId = 'YOUR_PROJECT_ID'; // Substitua pelo seu ID
  const anonKey = 'YOUR_ANON_KEY'; // Substitua pela sua key
  
  // Teste com Game of Thrones (ID: 1399, Temporada 1)
  const tvId = 1399;
  const seasonNumber = 1;
  
  const url = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/tmdb/tv/${tvId}/season/${seasonNumber}`;
  
  console.log('📡 URL:', url);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${anonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Status:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro:', errorText);
      return;
    }
    
    const data = await response.json();
    
    console.log('✅ Dados recebidos:');
    console.log('   Nome:', data.name);
    console.log('   Número da temporada:', data.season_number);
    console.log('   Total de episódios:', data.episodes?.length || 0);
    console.log('\n📺 Episódios:');
    
    data.episodes?.slice(0, 3).forEach(ep => {
      console.log(`   ${ep.episode_number}. ${ep.name} (${ep.runtime} min)`);
    });
    
    console.log('\n✅ TESTE PASSOU! A API está funcionando.');
    return data;
  } catch (error) {
    console.error('❌ TESTE FALHOU:', error);
    console.error('Stack:', error.stack);
  }
}

// Executar teste
testSeasonAPI();
```

---

## 🎯 TESTE 2: Verificar Função getSeason()

```javascript
// Copie e cole no Console após o app carregar

async function testGetSeason() {
  console.log('🧪 Testando função getSeason()...\n');
  
  // Importar dinamicamente
  const { getSeason } = await import('/utils/tmdb.ts');
  
  // Testar com Breaking Bad (ID: 1396, Temporada 1)
  const tvId = 1396;
  const seasonNumber = 1;
  
  console.log(`📺 Buscando temporada ${seasonNumber} de Breaking Bad (ID: ${tvId})`);
  
  try {
    const data = await getSeason(tvId, seasonNumber);
    
    console.log('✅ Dados recebidos:');
    console.log('   Nome:', data.name);
    console.log('   Episódios:', data.episodes?.length || 0);
    console.log('\n📝 Primeiro episódio:');
    console.log('   Título:', data.episodes[0].name);
    console.log('   Descrição:', data.episodes[0].overview.substring(0, 100) + '...');
    
    console.log('\n✅ TESTE PASSOU! getSeason() está funcionando.');
    return data;
  } catch (error) {
    console.error('❌ TESTE FALHOU:', error);
    console.error('Detalhes:', error.message);
  }
}

// Executar teste
testGetSeason();
```

---

## 🎯 TESTE 3: Verificar Estado do MovieDetails

```javascript
// Execute este teste DEPOIS de abrir uma série

function debugMovieDetails() {
  console.log('🐛 Debug do estado atual do MovieDetails:\n');
  
  // Verificar elementos na página
  const seasonTabs = document.querySelectorAll('[class*="Temporada"]');
  const episodeCards = document.querySelectorAll('[class*="episode"]');
  
  console.log('📊 Elementos encontrados na página:');
  console.log('   Tabs de temporada:', seasonTabs.length);
  console.log('   Cards de episódio:', episodeCards.length);
  
  // Verificar se a seção existe
  const seasonsSection = Array.from(document.querySelectorAll('h2')).find(
    h => h.textContent.includes('Temporadas')
  );
  
  if (seasonsSection) {
    console.log('✅ Seção "Temporadas e Episódios" encontrada');
    console.log('   Texto:', seasonsSection.textContent);
  } else {
    console.log('❌ Seção "Temporadas e Episódios" NÃO encontrada');
  }
  
  // Verificar mensagens de debug
  const debugMessage = Array.from(document.querySelectorAll('p')).find(
    p => p.textContent.includes('Temporadas carregadas')
  );
  
  if (debugMessage) {
    console.log('📋 Mensagem de debug:', debugMessage.textContent);
  }
  
  return {
    seasonTabs: seasonTabs.length,
    episodeCards: episodeCards.length,
    hasSeasonsSection: !!seasonsSection
  };
}

// Executar debug
debugMovieDetails();
```

---

## 🎯 TESTE 4: Teste Completo Passo a Passo

```javascript
// Teste completo - Execute TUDO de uma vez

async function testeCompleto() {
  console.clear();
  console.log('🎬 REDFLIX - TESTE COMPLETO DE TEMPORADAS\n');
  console.log('='.repeat(60));
  
  // Passo 1: Verificar imports
  console.log('\n📦 Passo 1: Verificando imports...');
  try {
    const { getSeason } = await import('/utils/tmdb.ts');
    console.log('✅ getSeason importado com sucesso');
  } catch (error) {
    console.error('❌ Erro ao importar:', error);
    return;
  }
  
  // Passo 2: Testar com ID conhecido
  console.log('\n📺 Passo 2: Testando com Stranger Things (ID: 66732)...');
  const { getSeason } = await import('/utils/tmdb.ts');
  
  try {
    const season1 = await getSeason(66732, 1);
    console.log('✅ Temporada 1 carregada');
    console.log('   Nome:', season1.name);
    console.log('   Episódios:', season1.episodes.length);
    console.log('   Primeiro episódio:', season1.episodes[0].name);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return;
  }
  
  // Passo 3: Testar múltiplas temporadas
  console.log('\n📺 Passo 3: Testando temporadas 1-3...');
  try {
    for (let i = 1; i <= 3; i++) {
      const season = await getSeason(66732, i);
      console.log(`   Temporada ${i}: ${season.episodes.length} episódios`);
    }
    console.log('✅ Todas as temporadas carregaram');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    return;
  }
  
  // Passo 4: Verificar interface
  console.log('\n🖼️  Passo 4: Verificando interface...');
  const result = debugMovieDetails();
  
  if (result.hasSeasonsSection) {
    console.log('✅ Interface renderizada corretamente');
  } else {
    console.log('⚠️ Interface pode ter problemas de renderização');
  }
  
  // Resultado final
  console.log('\n' + '='.repeat(60));
  console.log('✅ TESTE COMPLETO FINALIZADO\n');
  console.log('📊 Resumo:');
  console.log('   - API funcionando: ✅');
  console.log('   - getSeason funcionando: ✅');
  console.log('   - Interface renderizada:', result.hasSeasonsSection ? '✅' : '❌');
  console.log('\n💡 Se a interface não renderizou, verifique o console para erros React.');
}

// Executar teste completo
testeCompleto();
```

---

## 📋 RESULTADOS ESPERADOS

### ✅ Teste Passou:

```
🎬 REDFLIX - TESTE COMPLETO DE TEMPORADAS

============================================================

📦 Passo 1: Verificando imports...
✅ getSeason importado com sucesso

📺 Passo 2: Testando com Stranger Things (ID: 66732)...
✅ Temporada 1 carregada
   Nome: Temporada 1
   Episódios: 8
   Primeiro episódio: Chapter One: The Vanishing of Will Byers

📺 Passo 3: Testando temporadas 1-3...
   Temporada 1: 8 episódios
   Temporada 2: 9 episódios
   Temporada 3: 8 episódios
✅ Todas as temporadas carregaram

🖼️  Passo 4: Verificando interface...
✅ Seção "Temporadas e Episódios" encontrada
✅ Interface renderizada corretamente

============================================================
✅ TESTE COMPLETO FINALIZADO

📊 Resumo:
   - API funcionando: ✅
   - getSeason funcionando: ✅
   - Interface renderizada: ✅
```

---

### ❌ Teste Falhou (Exemplo):

```
🎬 REDFLIX - TESTE COMPLETO DE TEMPORADAS

============================================================

📦 Passo 1: Verificando imports...
✅ getSeason importado com sucesso

📺 Passo 2: Testando com Stranger Things (ID: 66732)...
❌ Erro: Not found

[TESTE INTERROMPIDO]
```

**Causa possível:**
- Servidor offline
- API key inválida
- Rede bloqueada

---

## 🔧 TROUBLESHOOTING

### Erro: "getSeason is not a function"

**Solução:**
```javascript
// Verificar se o módulo existe
const module = await import('/utils/tmdb.ts');
console.log('Funções disponíveis:', Object.keys(module));
```

---

### Erro: "404 Not Found"

**Solução:**
```javascript
// Verificar se o servidor está rodando
const healthUrl = `https://YOUR_PROJECT.supabase.co/functions/v1/make-server-2363f5d6/health`;
const response = await fetch(healthUrl);
console.log('Health check:', await response.json());
```

---

### Erro: "Network Error"

**Solução:**
```javascript
// Verificar CORS
fetch('https://api.themoviedb.org/3/tv/1399/season/1?api_key=ddb1bdf6aa91bdf335797853884b0c1d')
  .then(r => r.json())
  .then(d => console.log('TMDB direto:', d))
  .catch(e => console.error('Erro CORS:', e));
```

---

## 🎯 IDS DE SÉRIES PARA TESTE

```
Game of Thrones:    1399
Breaking Bad:       1396
Stranger Things:    66732
The Last of Us:     100088
Wednesday:          119051
The Witcher:        71912
The Boys:           76479
House of the Dragon: 94997
Peaky Blinders:     60574
Vikings:            44217
```

---

## 💡 DICA RÁPIDA

**Quer testar rapidamente?**

Abra o Console e cole:

```javascript
(async () => {
  const { getSeason } = await import('/utils/tmdb.ts');
  const data = await getSeason(66732, 1);
  console.log('Episódios:', data.episodes.length);
})();
```

Se retornar um número, **está funcionando!** ✅

---

**Desenvolvido por:** Fabricio Cypreste  
**Data:** 08/11/2025  
**Status:** ✅ GUIA DE TESTES COMPLETO  

🧪 **RedFlix - Teste suas Temporadas!** 🚀
