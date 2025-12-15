# Android TV / Fire TV - Guia de Build e Deploy

## Requisitos

### Software
- Android Studio Hedgehog (2023.1.1) ou superior
- Android SDK 34
- Kotlin 1.9+
- Java JDK 17

### Hardware
- Android TV ou Fire TV para testes
- Computador com Windows, macOS ou Linux

## Instalação do Android Studio

1. Baixe em: https://developer.android.com/studio
2. Execute o instalador
3. No SDK Manager, instale:
   - Android SDK Platform 34
   - Android TV Intel x86 Atom System Image
   - Google Play services

## Configuração do Projeto

### Estrutura de Arquivos
```
android-tv/
├── build.gradle                    # Config raiz
├── settings.gradle                 # Settings
├── gradle.properties               # Propriedades
└── app/
    ├── build.gradle                # Config do app
    └── src/main/
        ├── AndroidManifest.xml     # Manifest
        ├── java/com/redflix/tv/
        │   ├── MainActivity.kt     # Activity principal
        │   ├── PlayerActivity.kt   # Player de vídeo
        │   ├── fragments/
        │   │   └── MainFragment.kt # Fragment Leanback
        │   ├── models/
        │   │   └── Content.kt      # Modelos de dados
        │   ├── presenters/
        │   │   └── CardPresenter.kt # Presenter de cards
        │   ├── utils/
        │   │   └── ChannelInputHandler.kt # Input numérico
        │   └── voice/
        │       └── VoiceCommandHandler.kt # Comandos de voz
        └── res/
            ├── layout/             # Layouts XML
            ├── values/             # Strings, cores, estilos
            ├── drawable/           # Drawables
            ├── mipmap-*/           # Ícones
            └── xml/                # Configs XML
```

### Dependências Principais
- androidx.leanback: UI otimizada para TV
- androidx.media3: ExoPlayer para HLS
- Retrofit: Chamadas de API
- Glide: Carregamento de imagens

## Build do Projeto

### Via Android Studio
1. Abra o Android Studio
2. File > Open > Selecione `android-tv/`
3. Aguarde o Gradle sync
4. Build > Build Bundle(s) / APK(s) > Build APK(s)

### Via Linha de Comando
```bash
cd android-tv/

# Build debug
./gradlew assembleDebug

# Build release
./gradlew assembleRelease

# O APK estará em app/build/outputs/apk/
```

## Configuração do Dispositivo

### Android TV
1. Vá em Configurações > Sobre > Build number
2. Toque 7 vezes para ativar modo desenvolvedor
3. Vá em Configurações > Preferências do dispositivo > Opções do desenvolvedor
4. Ative "Depuração USB" e "Depuração de rede ADB"

### Fire TV
1. Vá em Configurações > My Fire TV > Opções do desenvolvedor
2. Ative "Depuração ADB"
3. Ative "Apps de fontes desconhecidas"

## Instalação em TV Real

### Via ADB
```bash
# Conecte via rede
adb connect <TV_IP>:5555

# Instale o APK
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Execute o app
adb shell am start -n com.redflix.tv/.MainActivity
```

### Via Android Studio
1. Conecte à TV via ADB
2. Selecione o dispositivo no dropdown
3. Clique em Run

## Funcionalidades Implementadas

### Navegação DPAD
- Setas direcionais: Navegar entre elementos
- OK/Enter: Selecionar
- Back: Voltar
- Home: Ir para launcher

### Entrada de Canal Numérico
- Digite números no controle remoto
- Overlay aparece mostrando o número
- Timeout de 2.5s para confirmar
- Navega automaticamente para o canal

### Teclado Virtual
- Ao focar em campo de busca, o teclado nativo aparece
- Suporte a busca por voz

### Player HLS
- ExoPlayer com suporte a HLS
- Controles de reprodução via controle remoto
- Suporte a legendas e múltiplas faixas de áudio

### Comandos de Voz (Stubs)

#### Google Assistant (Android TV)
Comandos suportados:
- "Abrir canal 12"
- "Assistir canal 45"
- "Abrir RedFlix"
- "Continuar assistindo"
- "Buscar [query]"

Configuração em `res/xml/actions.xml`

#### Alexa (Fire TV)
Stubs implementados em `VoiceCommandHandler.kt`
Requer configuração adicional no Alexa Developer Console

## Troubleshooting

### Gradle sync falha
- Verifique a versão do JDK (17+)
- Limpe cache: File > Invalidate Caches
- Delete pasta `.gradle` e sincronize novamente

### ADB não conecta
- Verifique se a TV e o computador estão na mesma rede
- Reinicie o servidor ADB: `adb kill-server && adb start-server`
- Verifique se a depuração está ativa na TV

### App não aparece no launcher
- Verifique se o AndroidManifest tem `LEANBACK_LAUNCHER`
- Confirme que `android.software.leanback` está declarado

### Player não reproduz
- Verifique permissão de internet no Manifest
- Confirme que a URL do stream está acessível
- Verifique logs do ExoPlayer

## Publicação

### Google Play (Android TV)

#### Checklist
- [ ] Ícone 512x512 PNG
- [ ] Banner 1280x720 PNG
- [ ] Screenshots 1920x1080 (mínimo 3)
- [ ] Descrição em português
- [ ] Política de privacidade URL
- [ ] APK/AAB assinado
- [ ] Classificação de conteúdo

#### Processo
1. Acesse https://play.google.com/console
2. Crie novo app
3. Preencha informações da loja
4. Upload do AAB
5. Configure distribuição para TV
6. Submeta para revisão

### Amazon Appstore (Fire TV)

#### Checklist
- [ ] Ícone 512x512 PNG
- [ ] Ícone pequeno 114x114 PNG
- [ ] Screenshots 1920x1080 (mínimo 3)
- [ ] Descrição em português
- [ ] Política de privacidade URL
- [ ] APK assinado

#### Processo
1. Acesse https://developer.amazon.com/apps-and-games
2. Crie novo app
3. Selecione "Fire TV" como plataforma
4. Preencha informações
5. Upload do APK
6. Submeta para revisão

## Recursos Adicionais

- Android TV Developer: https://developer.android.com/tv
- Leanback Library: https://developer.android.com/training/tv/start/start
- ExoPlayer: https://exoplayer.dev/
- Fire TV Developer: https://developer.amazon.com/docs/fire-tv/getting-started-developing-apps-and-games-for-amazon-fire-tv.html
