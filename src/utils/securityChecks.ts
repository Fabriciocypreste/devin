/**
 * Security Checks - Deteccao de ambiente suspeito e app modificado
 * 
 * Camadas de protecao:
 * - Deteccao de DevTools aberto
 * - Deteccao de ambiente de debug
 * - Deteccao de emulador/root
 * - Verificacao de integridade do app
 * - Protecao contra injecao de codigo
 */

// Flag para ambiente suspeito
let isSuspiciousEnvironment = false;
let securityChecksPassed = true;

/**
 * Verifica se DevTools esta aberto
 */
export function isDevToolsOpen(): boolean {
  const threshold = 160;
  const widthThreshold = window.outerWidth - window.innerWidth > threshold;
  const heightThreshold = window.outerHeight - window.innerHeight > threshold;
  
  // Verificar via console.log timing
  let devtoolsOpen = false;
  const element = new Image();
  Object.defineProperty(element, 'id', {
    get: function() {
      devtoolsOpen = true;
      return '';
    }
  });
  
  // Tentar detectar via timing
  const start = performance.now();
  console.log('%c', element);
  console.clear();
  const end = performance.now();
  
  if (end - start > 100) {
    devtoolsOpen = true;
  }
  
  return widthThreshold || heightThreshold || devtoolsOpen;
}

/**
 * Verifica se esta em ambiente de debug
 */
export function isDebugEnvironment(): boolean {
  // Verificar se esta em modo debug
  const isDebug = 
    // @ts-ignore
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__ !== undefined ||
    // @ts-ignore
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__ !== undefined ||
    // @ts-ignore
    window.Firebug !== undefined;
  
  return isDebug;
}

/**
 * Verifica se esta em emulador (Android)
 */
export function isEmulator(): boolean {
  const userAgent = navigator.userAgent.toLowerCase();
  
  const emulatorIndicators = [
    'sdk',
    'emulator',
    'simulator',
    'generic',
    'goldfish',
    'ranchu',
    'vbox',
    'genymotion'
  ];
  
  return emulatorIndicators.some(indicator => userAgent.includes(indicator));
}

/**
 * Verifica integridade basica do app
 */
export function checkAppIntegrity(): boolean {
  // Verificar se funcoes criticas existem
  const criticalFunctions = [
    'fetch',
    'localStorage',
    'sessionStorage'
  ];
  
  for (const fn of criticalFunctions) {
    // @ts-ignore
    if (typeof window[fn] === 'undefined') {
      console.warn(`Funcao critica ${fn} nao encontrada`);
      return false;
    }
  }
  
  // Verificar se localStorage nao foi modificado
  try {
    const testKey = '__integrity_test__';
    localStorage.setItem(testKey, 'test');
    const value = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    
    if (value !== 'test') {
      return false;
    }
  } catch (e) {
    return false;
  }
  
  return true;
}

/**
 * Verifica se o ambiente e seguro para streaming
 */
export function isSecureEnvironment(): boolean {
  // Em producao, verificar HTTPS
  if (import.meta.env.PROD) {
    if (window.location.protocol !== 'https:' && !window.location.hostname.includes('localhost')) {
      console.warn('Ambiente nao seguro: HTTPS necessario');
      return false;
    }
  }
  
  return true;
}

/**
 * Executa todas as verificacoes de seguranca
 */
export function runSecurityChecks(): {
  passed: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Verificar DevTools (apenas em producao)
  if (import.meta.env.PROD && isDevToolsOpen()) {
    issues.push('DevTools detectado');
  }
  
  // Verificar emulador
  if (isEmulator()) {
    issues.push('Emulador detectado');
  }
  
  // Verificar integridade
  if (!checkAppIntegrity()) {
    issues.push('Falha na verificacao de integridade');
  }
  
  // Verificar ambiente seguro
  if (!isSecureEnvironment()) {
    issues.push('Ambiente nao seguro');
  }
  
  securityChecksPassed = issues.length === 0;
  isSuspiciousEnvironment = issues.length > 0;
  
  if (issues.length > 0) {
    console.warn('Problemas de seguranca detectados:', issues);
  }
  
  return {
    passed: securityChecksPassed,
    issues
  };
}

/**
 * Obtem status de seguranca
 */
export function getSecurityStatus(): {
  isSuspicious: boolean;
  checksPassed: boolean;
} {
  return {
    isSuspicious: isSuspiciousEnvironment,
    checksPassed: securityChecksPassed
  };
}

/**
 * Gera fingerprint do dispositivo para deteccao de fraude
 */
export function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 0,
    // @ts-ignore
    navigator.deviceMemory || 0,
    navigator.platform
  ];
  
  const fingerprint = components.join('|');
  
  // Hash simples
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  
  return Math.abs(hash).toString(16);
}

/**
 * Protege funcao contra modificacao
 */
export function protectFunction<T extends Function>(fn: T, name: string): T {
  const originalToString = fn.toString;
  
  Object.defineProperty(fn, 'toString', {
    value: function() {
      return `function ${name}() { [native code] }`;
    },
    writable: false,
    configurable: false
  });
  
  return fn;
}

/**
 * Monitora tentativas de injecao de codigo
 */
export function setupInjectionMonitor(): void {
  // Monitorar eval
  const originalEval = window.eval;
  // @ts-ignore
  window.eval = function(code: string) {
    console.warn('Tentativa de eval detectada');
    // Em producao, bloquear
    if (import.meta.env.PROD) {
      throw new Error('eval nao permitido');
    }
    return originalEval.call(window, code);
  };
  
  // Monitorar Function constructor
  const originalFunction = Function;
  // @ts-ignore
  window.Function = function(...args: any[]) {
    console.warn('Tentativa de criar funcao dinamica detectada');
    if (import.meta.env.PROD) {
      throw new Error('Criacao dinamica de funcao nao permitida');
    }
    return new originalFunction(...args);
  };
}

/**
 * Inicializa todas as protecoes de seguranca
 */
export function initSecurityProtections(): void {
  console.log('🔒 Inicializando protecoes de seguranca...');
  
  // Executar verificacoes
  const result = runSecurityChecks();
  
  if (!result.passed) {
    console.warn('⚠️ Ambiente suspeito detectado:', result.issues);
  } else {
    console.log('✅ Verificacoes de seguranca passaram');
  }
  
  // Configurar monitor de injecao (apenas em producao)
  if (import.meta.env.PROD) {
    setupInjectionMonitor();
  }
  
  // Gerar fingerprint
  const fingerprint = generateDeviceFingerprint();
  console.log('🔑 Device fingerprint:', fingerprint);
  
  // Armazenar fingerprint para uso posterior
  try {
    sessionStorage.setItem('device_fingerprint', fingerprint);
  } catch (e) {
    // Ignorar erro
  }
}

export default {
  isDevToolsOpen,
  isDebugEnvironment,
  isEmulator,
  checkAppIntegrity,
  isSecureEnvironment,
  runSecurityChecks,
  getSecurityStatus,
  generateDeviceFingerprint,
  protectFunction,
  setupInjectionMonitor,
  initSecurityProtections
};
