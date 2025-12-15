# RedFlix - Otimizacoes de Performance

Este documento descreve as otimizacoes de performance implementadas no RedFlix.

## Visao Geral

O RedFlix implementa varias tecnicas de otimizacao para garantir carregamento rapido e playback suave:

1. HLS Preload Inteligente
2. Lazy Loading de Imagens e Componentes
3. Service Worker para Cache Estrategico
4. Prefetch de Conteudo

## HLS Preload Inteligente

### Configuracao Otimizada

```typescript
const hlsConfig = {
  enableWorker: true,           // Web Worker para decodificacao
  lowLatencyMode: true,         // Modo baixa latencia
  backBufferLength: 30,         // Buffer de retrocesso
  maxBufferLength: 20,          // Buffer maximo
  maxMaxBufferLength: 40,       // Buffer maximo absoluto
  fragLoadingTimeOut: 15000,    // Timeout de fragmento
  manifestLoadingTimeOut: 10000, // Timeout de manifesto
  levelLoadingTimeOut: 10000,   // Timeout de nivel
  startLevel: -1,               // Auto-selecao de qualidade
  abrEwmaDefaultEstimate: 500000, // Estimativa inicial de banda
  abrBandWidthFactor: 0.95,     // Fator de banda
  abrBandWidthUpFactor: 0.7     // Fator de upgrade
};
```

### Preload de Proximo Conteudo

```typescript
import { hlsPreloader } from './services/performance/HLSPreloader';

// Precarregar proximo episodio
hlsPreloader.preloadContent(nextEpisodeUrl);

// Usar HLS precarregado
const hls = hlsPreloader.getPreloaded(url);
if (hls) {
  hls.attachMedia(videoElement);
}
```

## Lazy Loading

### Imagens

```html
<img 
  data-src="/images/poster.jpg"
  data-fallback="/images/placeholder.jpg"
  class="lazy"
/>
```

```typescript
import { lazyLoader } from './services/performance/LazyLoader';

// Observar imagens lazy
lazyLoader.observeAll('img.lazy');

// Precarregar imagens criticas
LazyLoader.preloadImages([
  '/images/hero.jpg',
  '/images/logo.png'
]);
```

### Componentes

```html
<div data-component="VideoPlayer" class="lazy-component"></div>
```

## Service Worker

### Estrategias de Cache

| Tipo de Recurso | Estrategia | Cache |
|-----------------|------------|-------|
| Imagens | Cache First | IMAGE_CACHE |
| Scripts/CSS | Cache First | STATIC_CACHE |
| API | Network First | DYNAMIC_CACHE |
| HLS (.m3u8, .ts) | Network Only | - |

### Registro do Service Worker

```typescript
import { swManager } from './services/performance/ServiceWorkerManager';

// Registrar SW
await swManager.register();

// Verificar se esta ativo
if (swManager.isActive()) {
  console.log('Service Worker ativo');
}

// Limpar cache
swManager.clearCache();

// Prefetch de URLs
swManager.prefetchContent([
  '/images/poster1.jpg',
  '/images/poster2.jpg'
]);
```

### Atualizacao do Service Worker

```typescript
// Verificar atualizacoes
await swManager.update();

// Aplicar atualizacao
swManager.skipWaiting();

// Escutar evento de atualizacao
window.addEventListener('sw-update-available', () => {
  console.log('Nova versao disponivel');
});
```

## Metricas de Performance

### Tempo de Carregamento

- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s

### Tempo de Playback

- Time to First Frame: < 2s
- Buffer Stall Rate: < 1%
- Rebuffer Ratio: < 0.5%

## Como Testar Performance

### Chrome DevTools

1. Abra DevTools (F12)
2. Va para aba "Performance"
3. Clique em "Record"
4. Navegue pelo app
5. Pare a gravacao
6. Analise os resultados

### Lighthouse

1. Abra DevTools (F12)
2. Va para aba "Lighthouse"
3. Selecione "Performance"
4. Clique em "Analyze page load"

### Network Throttling

1. Abra DevTools (F12)
2. Va para aba "Network"
3. Selecione "Slow 3G" ou "Fast 3G"
4. Teste o carregamento

## Troubleshooting

### Carregamento lento

1. Verifique se o Service Worker esta ativo
2. Verifique o cache do navegador
3. Verifique a conexao de rede
4. Analise o waterfall no DevTools

### Playback com travamentos

1. Verifique a configuracao HLS
2. Verifique a qualidade do stream
3. Verifique a banda disponivel
4. Monitore o buffer no player

### Cache nao funciona

1. Verifique se o SW esta registrado
2. Verifique as estrategias de cache
3. Limpe o cache e tente novamente
4. Verifique erros no console
