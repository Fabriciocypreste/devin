# RedFlix - Build iOS (iPhone e iPad)

Este documento descreve o processo de build do aplicativo RedFlix para iOS usando Capacitor.

## Requisitos

- **macOS** 12.0 ou superior
- **Xcode** 14.0 ou superior (disponivel na App Store)
- **Node.js** 20+
- **CocoaPods** (instalado automaticamente pelo Capacitor)

## Estrutura do Projeto

```
/ios                        # Projeto iOS nativo (Capacitor)
  /App
    /App
      Info.plist            # Configuracoes do app
      /public               # Assets web copiados do dist/
    App.xcodeproj           # Projeto Xcode
    App.xcworkspace         # Workspace Xcode (usar este!)
/capacitor.config.ts        # Configuracao do Capacitor
```

## Configuracao Inicial (Primeira vez)

### 1. Instalar Xcode

1. Abra a App Store no Mac
2. Busque por "Xcode"
3. Instale (pode demorar, ~12GB)
4. Apos instalar, abra o Xcode uma vez para aceitar os termos

### 2. Instalar Command Line Tools

```bash
xcode-select --install
```

### 3. Instalar dependencias do projeto

```bash
cd /caminho/para/redflix
npm install
```

## Build do App iOS

### 1. Build do frontend (Vite)

```bash
npm run build
```

### 2. Sincronizar com iOS

```bash
npx cap sync ios
```

Este comando:
- Copia os arquivos do `dist/` para `ios/App/App/public/`
- Atualiza as dependencias nativas
- Instala pods do CocoaPods

### 3. Abrir no Xcode

```bash
npx cap open ios
```

Ou manualmente:
```bash
open ios/App/App.xcworkspace
```

**IMPORTANTE:** Sempre abra o `.xcworkspace`, NAO o `.xcodeproj`!

## Rodar no Simulador

1. No Xcode, selecione um simulador no menu superior (ex: "iPhone 15 Pro")
2. Clique no botao Play (triangulo) ou pressione `Cmd + R`
3. Aguarde o build e o simulador abrir
4. O app RedFlix deve aparecer no simulador

### Simuladores disponiveis

- iPhone 15 / 15 Pro / 15 Pro Max
- iPhone 14 / 14 Pro
- iPad Pro / iPad Air
- E outros...

## Rodar em iPhone/iPad Real

### 1. Configurar Apple ID no Xcode

1. Xcode > Settings > Accounts
2. Clique em "+" e adicione seu Apple ID
3. Nao precisa de conta de desenvolvedor paga para testes

### 2. Configurar Signing

1. No Xcode, selecione o projeto "App" no navegador lateral
2. Selecione o target "App"
3. Aba "Signing & Capabilities"
4. Marque "Automatically manage signing"
5. Selecione seu Team (seu Apple ID)
6. O Bundle Identifier deve ser unico (ex: `com.seuapelido.redflix`)

### 3. Conectar o dispositivo

1. Conecte o iPhone/iPad via cabo USB
2. No dispositivo, confie no computador quando solicitado
3. No Xcode, selecione seu dispositivo no menu superior

### 4. Build e Run

1. Clique no botao Play ou `Cmd + R`
2. Na primeira vez, pode pedir para confiar no desenvolvedor no iPhone:
   - iPhone > Ajustes > Geral > Gerenciamento de Dispositivo
   - Selecione seu Apple ID e confie

## Funcionalidades Testadas

O app iOS deve suportar todas as funcionalidades:

- [x] **Login/Logout** - Autenticacao com o backend
- [x] **Player HLS** - Reproducao de streams via HLS.js
- [x] **Continuar Assistindo** - Progresso salvo no backend
- [x] **Proximo Episodio** - Transicao automatica entre episodios
- [x] **Navegacao** - Home, Filmes, Series, Canais
- [x] **Busca** - Pesquisa de conteudo
- [x] **Favoritos** - Adicionar/remover da lista

## Configuracoes do Info.plist

O arquivo `ios/App/App/Info.plist` ja esta configurado com:

```xml
<!-- Permitir conexoes HTTP para streaming -->
<key>NSAppTransportSecurity</key>
<dict>
    <key>NSAllowsArbitraryLoads</key>
    <true/>
    <key>NSAllowsArbitraryLoadsForMedia</key>
    <true/>
</dict>

<!-- Audio em background -->
<key>UIBackgroundModes</key>
<array>
    <string>audio</string>
</array>
```

## Troubleshooting

### Erro: "No signing certificate"

1. Xcode > Settings > Accounts
2. Selecione seu Apple ID
3. Clique em "Download Manual Profiles"

### Erro: "Untrusted Developer"

No iPhone:
1. Ajustes > Geral > Gerenciamento de Dispositivo
2. Selecione seu Apple ID
3. Toque em "Confiar"

### Erro: "Could not launch app"

1. Desconecte e reconecte o dispositivo
2. Reinicie o Xcode
3. Limpe o build: Product > Clean Build Folder (`Cmd + Shift + K`)

### Erro: "Pod install failed"

```bash
cd ios/App
pod install --repo-update
```

### Erro: "Module not found"

```bash
npx cap sync ios
cd ios/App
pod install
```

### Video nao reproduz

Verifique se o `Info.plist` tem:
- `NSAllowsArbitraryLoads` = true
- `NSAllowsArbitraryLoadsForMedia` = true

## Comandos Uteis

```bash
# Sincronizar alteracoes do frontend
npm run build && npx cap sync ios

# Abrir no Xcode
npx cap open ios

# Limpar cache do CocoaPods
cd ios/App && pod cache clean --all && pod install

# Ver logs do dispositivo
# No Xcode: Window > Devices and Simulators > Selecione o dispositivo > Open Console
```

## Build para Distribuicao (Fora de Escopo)

Para publicar na App Store, voce precisaria:
- Conta Apple Developer ($99/ano)
- Certificados de distribuicao
- App Store Connect configurado
- TestFlight para beta testing

**Isso NAO esta no escopo deste documento.**

## Backend

O app iOS consome o mesmo backend que as outras plataformas:
- API: Configurada em `capacitor.config.ts`
- Autenticacao: JWT tokens
- Progresso: Salvo via `/api/progress`

Nenhuma alteracao no backend e necessaria para iOS.

## Versoes

- **Capacitor**: 7.x
- **iOS Deployment Target**: 13.0+
- **Swift**: 5.x (gerenciado pelo Capacitor)
