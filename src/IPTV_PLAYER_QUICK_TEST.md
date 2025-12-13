# ⚡ Teste Rápido: IPTVPlayer v4.8

## 🎯 Como Testar em 3 Minutos

### 1️⃣ Verificar Instalação do HLS.js
```bash
# Verificar se HLS.js está instalado
npm list hls.js

# Se não estiver instalado:
npm install hls.js
```

### 2️⃣ Iniciar o Projeto
```bash
npm run dev
```

### 3️⃣ Testar Streams

#### Teste A: Canal de TV (.m3u8)
```
1. Abrir http://localhost:5173
2. Login (se necessário)
3. Ir para "Canais" ou "IPTV"
4. Clicar em qualquer canal
5. ✅ Deve reproduzir automaticamente
```

**Console esperado:**
```
🎬 Carregando stream: https://...playlist.m3u8
📡 É HLS? true
✅ Usando HLS.js para reprodução
✅ HLS manifest parsed
✅ Vídeo pronto para reprodução
```

#### Teste B: Verificar Logs
```
1. Abrir DevTools (F12)
2. Ir para aba Console
3. Reproduzir um vídeo
4. ✅ Ver logs do IPTVPlayer
```

**Logs esperados:**
```
🎬 Carregando stream: [URL]
📡 É HLS? [true/false]
✅ Usando [HLS.js/HLS nativo/HTML5]
✅ Metadados carregados
✅ Vídeo pronto para reprodução
```

#### Teste C: Testar Erro e Reconexão
```
1. Reproduzir um stream
2. Desconectar WiFi por 2s
3. Reconectar WiFi
4. ✅ Deve reconectar automaticamente
```

**Console esperado:**
```
⚠️ HLS.js error: [network error]
🔄 Tentando recuperar de erro de rede...
✅ Reconectado
```

---

## 🎬 URLs de Teste

### Streams HLS Públicos para Teste
```javascript
// Canal de notícias (24/7)
const testStream1 = "https://cnn-cnninternational-1-eu.rakuten.waw.path1.net/playlist.m3u8";

// Big Buck Bunny (teste HLS)
const testStream2 = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

// Exemplo MP4
const testStream3 = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
```

### Usar no Console do Navegador
```javascript
// Abrir DevTools e executar:
const player = document.querySelector('video');
if (player) {
  player.src = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
  player.play();
}
```

---

## ✅ Checklist de Validação

### Funcionalidades Básicas
```
□ Vídeo carrega
□ Reproduz automaticamente
□ Controles funcionam (play/pause)
□ Volume funciona
□ Fullscreen funciona
□ Título aparece no topo
□ Botão "Fechar" funciona
```

### Formatos Suportados
```
□ .m3u8 reproduz
□ .ts reproduz
□ .mp4 reproduz
□ URLs longas funcionam
□ URLs com query params funcionam
```

### Error Handling
```
□ Erro de rede reconecta
□ Erro 404 exibe mensagem
□ CORS bloqueado loga warning
□ Stream inválido não trava
```

### Performance
```
□ Carrega em < 3s
□ Não trava o navegador
□ Memória estável
□ CPU < 30%
```

---

## 🐛 Problemas Comuns e Soluções

### Problema 1: "HLS.js is not defined"
```
❌ Erro: Cannot find module 'hls.js'

✅ Solução:
npm install hls.js
npm run dev
```

### Problema 2: "Vídeo não carrega"
```
❌ Erro: Vídeo fica em loading infinito

✅ Verificar:
1. URL do stream está correta?
2. CORS está configurado?
3. Stream está online?
4. Console tem erros?
```

### Problema 3: "CORS blocked"
```
❌ Erro: CORS policy blocked

✅ Solução:
1. Usar proxy Supabase
2. Configurar CORS no servidor de origem
3. Usar extensão CORS unblock (dev only)
```

### Problema 4: "Autoplay blocked"
```
⚠️ Warning: Autoplay prevented

✅ Esperado:
- Navegadores bloqueiam autoplay por padrão
- Usuário deve clicar em play manualmente
- Não é um erro crítico
```

---

## 📊 Resultados Esperados

### ✅ Sucesso Total
```
✅ Todos os formatos reproduzem
✅ Sem erros no console
✅ Performance < 30% CPU
✅ Memória estável
✅ Interface responsiva
✅ Logs de diagnóstico claros
```

### ⚠️ Sucesso Parcial
```
✅ Maioria dos formatos funcionam
⚠️ Alguns erros CORS (normal)
✅ Performance aceitável
✅ Interface ok
⚠️ Alguns streams offline
```

### ❌ Falha
```
❌ Nenhum formato reproduz
❌ Muitos erros no console
❌ Performance ruim
❌ Interface quebrada
❌ Sem logs
```

---

## 🎯 Teste Rápido de 60 Segundos

### Minuto 1: Teste Básico
```bash
# Terminal
npm run dev

# Navegador
1. Abrir http://localhost:5173
2. Ir para Canais/IPTV
3. Clicar em 1 canal
4. ✅ Deve reproduzir

# Console (F12)
5. Ver logs do IPTVPlayer
6. ✅ Sem erros vermelhos
```

### Resultado
```
✅ Player funciona = SUCESSO
❌ Player não funciona = Ver logs
```

---

## 📝 Report de Teste

### Template para Reportar
```markdown
## Teste IPTVPlayer v4.8

**Data**: [data]
**Navegador**: [Chrome/Firefox/Safari]
**OS**: [Windows/Mac/Linux/iOS/Android]

### Resultados
- [ ] Stream .m3u8 funciona
- [ ] Stream .ts funciona
- [ ] Arquivo .mp4 funciona
- [ ] Logs aparecem no console
- [ ] Sem erros críticos

### Console Logs
```
[Colar logs aqui]
```

### Screenshots
[Anexar screenshots se houver problemas]

### Notas Adicionais
[Observações]
```

---

## 🚀 Testes Avançados (Opcional)

### Teste de Stress
```javascript
// Trocar stream rapidamente (10x)
for (let i = 0; i < 10; i++) {
  setTimeout(() => {
    // Trocar canal
  }, i * 1000);
}

// ✅ Não deve travar
// ✅ Memória não deve crescer
```

### Teste de Múltiplos Formatos
```javascript
const streams = [
  "https://example.com/stream.m3u8",  // HLS
  "https://example.com/stream.ts",    // TS
  "https://example.com/video.mp4",    // MP4
  "https://example.com/video.webm",   // WebM
];

// Testar cada um
streams.forEach(url => {
  // Abrir stream
  // Verificar reprodução
  // Fechar
});
```

### Teste de Navegadores
```
□ Chrome (Desktop)
□ Firefox (Desktop)
□ Safari (Desktop/Mac)
□ Edge (Desktop)
□ Chrome (Mobile/Android)
□ Safari (Mobile/iOS)
```

---

## 🎉 Teste Concluído

### Se Tudo Funcionou
```
🎉 PARABÉNS!
✅ IPTVPlayer v4.8 está funcionando perfeitamente
✅ Streams reproduzem corretamente
✅ Sem erros críticos
✅ Performance excelente

Próximo passo:
→ Usar em produção
→ Monitorar logs
→ Coletar feedback dos usuários
```

### Se Algo Falhou
```
⚠️ Revisar checklist acima
⚠️ Verificar logs do console
⚠️ Testar em outro navegador
⚠️ Verificar URLs dos streams

Suporte:
→ Ver IPTV_PLAYER_UPDATE.md
→ Verificar issues no GitHub
→ Consultar documentação HLS.js
```

---

**⚡ Teste Completo em 3 Minutos - IPTVPlayer v4.8**

*Guia de Teste Rápido - Novembro 2025*
