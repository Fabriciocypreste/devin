import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.redflix.app',
  appName: 'RedFlix',
  webDir: 'dist',
  android: {
    // Configurações para Android e Android TV
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false,
    // Permite fullscreen para melhor experiência em TV
    backgroundColor: '#000000',
  },
  server: {
    // Permite carregar conteúdo de URLs externas (streams)
    allowNavigation: ['*'],
    cleartext: true,
  },
  plugins: {
    // Configurações de plugins se necessário
  }
};

export default config;
