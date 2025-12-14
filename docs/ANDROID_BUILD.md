# RedFlix - Build Android (Mobile e TV)

Este documento descreve o processo de build do aplicativo RedFlix para Android e Android TV usando Capacitor.

## Requisitos

- **Node.js** 20+
- **Java JDK** 21+
- **Android SDK** com:
  - Platform Tools
  - Build Tools 34.0.0
  - Android Platform 34 (Android 14)

## Estrutura do Projeto

```
/android                    # Projeto Android nativo (Capacitor)
  /app
    /src/main
      AndroidManifest.xml   # Configurado para Mobile + TV
    /build/outputs/apk      # APKs gerados
/capacitor.config.ts        # Configuracao do Capacitor
/android-release            # APKs prontos para distribuicao
```

## Configuracao Inicial (Primeira vez)

### 1. Instalar dependencias do projeto

```bash
npm install
```

### 2. Instalar Android SDK (se nao tiver)

```bash
# Baixar command line tools
mkdir -p ~/android-sdk
cd ~/android-sdk
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip
unzip commandlinetools-linux-11076708_latest.zip
mkdir -p cmdline-tools/latest
mv cmdline-tools/* cmdline-tools/latest/

# Configurar variaveis de ambiente
export ANDROID_HOME=~/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools

# Aceitar licencas e instalar componentes
yes | sdkmanager --licenses
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### 3. Configurar local.properties

```bash
echo "sdk.dir=$HOME/android-sdk" > android/local.properties
```

## Build do APK

### 1. Build do frontend (Vite)

```bash
npm run build
```

### 2. Sincronizar com Android

```bash
npx cap sync android
```

### 3. Gerar APK Release (unsigned)

```bash
cd android
./gradlew assembleRelease
```

O APK sera gerado em:
```
android/app/build/outputs/apk/release/app-release-unsigned.apk
```

## APK Assinado (para Play Store)

Para publicar na Play Store, voce precisa assinar o APK:

### 1. Criar keystore (primeira vez)

```bash
keytool -genkey -v -keystore redflix-release.keystore -alias redflix -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Assinar o APK

```bash
# Usando apksigner (recomendado)
$ANDROID_HOME/build-tools/34.0.0/apksigner sign --ks redflix-release.keystore --out app-release-signed.apk app-release-unsigned.apk

# Ou usando jarsigner
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore redflix-release.keystore app-release-unsigned.apk redflix
```

### 3. Alinhar o APK (otimizacao)

```bash
$ANDROID_HOME/build-tools/34.0.0/zipalign -v 4 app-release-unsigned.apk app-release-aligned.apk
```

## Suporte Android TV

O aplicativo ja esta configurado para Android TV com:

- **Leanback Launcher**: Aparece na tela inicial da TV
- **D-pad Navigation**: Suporte a controle remoto
- **Touchscreen opcional**: Nao requer tela touch
- **Banner**: Icone para TV (320x180dp)

### Configuracoes no AndroidManifest.xml

```xml
<!-- Nao requer touchscreen -->
<uses-feature android:name="android.hardware.touchscreen" android:required="false" />

<!-- Suporte a Leanback -->
<uses-feature android:name="android.software.leanback" android:required="false" />

<!-- Launcher para TV -->
<intent-filter>
    <action android:name="android.intent.action.MAIN" />
    <category android:name="android.intent.category.LEANBACK_LAUNCHER" />
</intent-filter>
```

## Instalacao em Dispositivos

### Android Mobile

```bash
adb install app-release-unsigned.apk
```

### Android TV / TV Box

```bash
# Conectar via ADB (IP da TV)
adb connect 192.168.x.x:5555

# Instalar
adb install app-release-unsigned.apk
```

### Habilitar instalacao de fontes desconhecidas

Em dispositivos Android, va em:
- Configuracoes > Seguranca > Fontes desconhecidas > Ativar

Em Android TV:
- Configuracoes > Dispositivo > Seguranca e restricoes > Fontes desconhecidas > Ativar

## Troubleshooting

### Erro: SDK location not found

Crie o arquivo `android/local.properties`:
```
sdk.dir=/caminho/para/android-sdk
```

### Erro: invalid source release: 21

Instale Java 21:
```bash
sudo apt install openjdk-21-jdk
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
```

### Erro: INSTALL_FAILED_UPDATE_INCOMPATIBLE

Desinstale a versao anterior:
```bash
adb uninstall com.redflix.app
```

## Versoes

- **Capacitor**: 7.x
- **Android Target SDK**: 34 (Android 14)
- **Android Min SDK**: 22 (Android 5.1)
- **Gradle**: 8.13

## Comandos Uteis

```bash
# Listar dispositivos conectados
adb devices

# Ver logs do app
adb logcat | grep -i redflix

# Abrir app via ADB
adb shell am start -n com.redflix.app/.MainActivity

# Limpar build
cd android && ./gradlew clean
```
