# RedFlix - Sistema P2P para Streaming

Este documento descreve o sistema P2P (peer-to-peer) implementado para distribuicao DIRECT do RedFlix.

## Visao Geral

O sistema P2P usa WebRTC para compartilhar segmentos HLS entre usuarios, reduzindo a carga no CDN e melhorando a experiencia de streaming.

## Onde o P2P e Usado

O P2P esta habilitado APENAS para:
- Desktop (Electron) - Windows, macOS, Linux
- APK Android TV / TV Box (instalacao via Downloader)

O P2P NAO e usado em:
- Web publico
- Apps de loja (Play Store, Tizen, webOS, Fire TV)

## Como Funciona

1. **Conexao de Peers**: Usuarios conectam-se via WebRTC
2. **Cache de Segmentos**: Segmentos HLS sao armazenados em cache local
3. **Compartilhamento**: Peers compartilham segmentos entre si
4. **Fallback CDN**: Se P2P falhar, o sistema usa CDN automaticamente

## Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                      P2P Engine                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Peers     │  │   Cache     │  │   CDN Fallback      │  │
│  │  (WebRTC)   │  │  (Local)    │  │   (HTTP)            │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│                    HLS Preloader                             │
├─────────────────────────────────────────────────────────────┤
│                    Video Player                              │
└─────────────────────────────────────────────────────────────┘
```

## Uso

### Verificar se P2P esta Ativo

```typescript
import { p2pEngine } from './services/p2p/P2PEngine';

if (p2pEngine.isEnabled()) {
  console.log('P2P ativo');
}
```

### Obter Estatisticas

```typescript
const stats = p2pEngine.getStats();
console.log('Peers conectados:', stats.peersConnected);
console.log('Bytes do P2P:', stats.bytesFromP2P);
console.log('Bytes do CDN:', stats.bytesFromCDN);
console.log('Ratio P2P:', stats.p2pRatio);
```

### Eventos

```typescript
p2pEngine.on('peer-connected', (data) => {
  console.log('Novo peer conectado');
});

p2pEngine.on('fallback-cdn', (data) => {
  console.log('Usando CDN para:', data.url);
});

p2pEngine.on('stats-update', (stats) => {
  console.log('Estatisticas atualizadas:', stats);
});
```

## Configuracao

### Habilitar P2P

No arquivo `.env`:

```bash
VITE_DISTRIBUTION_TYPE=DIRECT
VITE_P2P_ENABLED=true
```

### Desabilitar P2P

```bash
VITE_DISTRIBUTION_TYPE=STORE
VITE_P2P_ENABLED=false
```

## Seguranca

- P2P so funciona em builds DIRECT
- Conexoes WebRTC sao criptografadas
- Nenhum dado pessoal e compartilhado
- Apenas segmentos de video sao trocados

## Performance

### Beneficios do P2P

- Reducao de 30-70% na carga do CDN
- Menor latencia para usuarios proximos
- Melhor qualidade em redes congestionadas

### Fallback Automatico

Se o P2P falhar por qualquer motivo:
1. O sistema detecta a falha
2. Automaticamente usa CDN
3. Nenhuma interrupcao no playback
4. Invisivel para o usuario

## Troubleshooting

### P2P nao conecta peers

1. Verifique se WebRTC esta disponivel
2. Verifique firewall/NAT
3. Verifique se ha outros usuarios online

### Performance baixa

1. Verifique a conexao de internet
2. Verifique o numero de peers conectados
3. Monitore as estatisticas do P2P

### Fallback constante para CDN

1. Pode indicar poucos peers disponiveis
2. Pode indicar problemas de rede
3. O sistema funciona normalmente via CDN
