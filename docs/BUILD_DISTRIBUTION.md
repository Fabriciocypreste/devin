# RedFlix - Guia de Build por Distribuicao

Este documento explica como gerar builds para diferentes tipos de distribuicao: STORE (lojas oficiais) e DIRECT (distribuicao direta).

## Tipos de Distribuicao

### STORE (Lojas Oficiais)
- Play Store (Android)
- Samsung Tizen Store
- LG webOS Store
- Amazon Fire TV Store
- Web publico

**Caracteristicas:**
- SEM P2P (compliance total)
- Otimizado para revisao de lojas
- Segue todas as politicas de privacidade

### DIRECT (Distribuicao Direta)
- APK Android TV / TV Box (via Downloader)
- App Desktop Electron (Windows/macOS/Linux)

**Caracteristicas:**
- COM P2P habilitado
- Distribuicao fora de lojas
- Instalacao manual pelo usuario

## Configuracao de Ambiente

### Variaveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
# Tipo de distribuicao: STORE ou DIRECT
VITE_DISTRIBUTION_TYPE=STORE

# Habilitar P2P (apenas para DIRECT)
VITE_P2P_ENABLED=false

# URL da API
VITE_API_BASE=https://api.redflix.com
```

### Build para STORE

```bash
# Configurar ambiente
export VITE_DISTRIBUTION_TYPE=STORE
export VITE_P2P_ENABLED=false

# Build Web
npm run build

# Build Android (Play Store)
cd android && ./gradlew assembleRelease

# Build Tizen
cd tizen && tizen build-web

# Build webOS
cd webos && ares-package .
```

### Build para DIRECT

```bash
# Configurar ambiente
export VITE_DISTRIBUTION_TYPE=DIRECT
export VITE_P2P_ENABLED=true

# Build Electron (Desktop)
cd electron && npm run build

# Build Android TV (APK direto)
cd android-tv && ./gradlew assembleRelease
```

## Verificacao de Build

### Verificar Tipo de Distribuicao

No console do navegador ou app:

```javascript
import { getDistributionConfig } from './config/distribution';

const config = getDistributionConfig();
console.log('Tipo:', config.type);        // STORE ou DIRECT
console.log('P2P:', config.p2pEnabled);   // true ou false
console.log('Plataforma:', config.platform);
```

### Verificar P2P Ativo

```javascript
import { isP2PEnabled } from './config/distribution';

if (isP2PEnabled()) {
  console.log('P2P esta ativo');
} else {
  console.log('P2P esta desativado');
}
```

## Estrutura de Arquivos

```
src/
├── config/
│   └── distribution.ts    # Configuracao de distribuicao
├── services/
│   ├── p2p/
│   │   └── P2PEngine.ts   # Engine P2P (WebRTC)
│   └── performance/
│       ├── HLSPreloader.ts      # Preload HLS
│       ├── LazyLoader.ts        # Lazy loading
│       └── ServiceWorkerManager.ts  # Cache SW
```

## Plataformas e P2P

| Plataforma | Distribuicao | P2P |
|------------|--------------|-----|
| Web        | STORE        | NAO |
| Android    | STORE        | NAO |
| iOS        | STORE        | NAO |
| Tizen      | STORE        | NAO |
| webOS      | STORE        | NAO |
| Fire TV    | STORE        | NAO |
| Electron   | DIRECT       | SIM |
| Android TV | DIRECT       | SIM |

## Troubleshooting

### P2P nao funciona no Electron

1. Verifique se `VITE_P2P_ENABLED=true`
2. Verifique se `VITE_DISTRIBUTION_TYPE=DIRECT`
3. Verifique o console para erros de WebRTC

### Build falha para STORE

1. Certifique-se de que `VITE_P2P_ENABLED=false`
2. Remova qualquer codigo P2P do bundle final
3. Verifique se nao ha referencias a WebRTC

### Cache nao funciona

1. Verifique se o Service Worker esta registrado
2. Limpe o cache do navegador
3. Verifique o console para erros do SW
