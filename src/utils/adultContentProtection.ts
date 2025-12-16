/**
 * 🔒 REDFLIX - ADULT CONTENT PROTECTION
 * 
 * Sistema de proteção por senha para canais adultos:
 * - Sessão de 30 minutos
 * - Senha padrão: "1234" (configurável)
 * - Usa sessionStorage para controle
 */

// TODO: For production, move this to environment variables
// or implement a more secure authentication mechanism
const ADULT_PASSWORD = '1234'; // Senha padrão (configurável)
const SESSION_KEY = 'redflix_adult_access';
const SESSION_DURATION = 30 * 60 * 1000; // 30 minutos em millisegundos

interface AdultSession {
  authenticated: boolean;
  expiresAt: number;
}

/**
 * Verifica se o usuário tem acesso a conteúdo adulto
 */
export function hasAdultAccess(): boolean {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    
    if (!sessionData) {
      return false;
    }
    
    const session: AdultSession = JSON.parse(sessionData);
    const now = Date.now();
    
    // Verifica se a sessão ainda é válida
    if (session.authenticated && session.expiresAt > now) {
      return true;
    }
    
    // Sessão expirada - limpar
    clearAdultAccess();
    return false;
    
  } catch (error) {
    console.error('Erro ao verificar acesso adulto:', error);
    return false;
  }
}

/**
 * Autentica o usuário para acessar conteúdo adulto
 */
export function authenticateAdultAccess(password: string): boolean {
  if (password === ADULT_PASSWORD) {
    const session: AdultSession = {
      authenticated: true,
      expiresAt: Date.now() + SESSION_DURATION,
    };
    
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    console.log('✅ Acesso adulto concedido por 30 minutos');
    return true;
  }
  
  console.warn('❌ Senha incorreta para acesso adulto');
  return false;
}

/**
 * Remove o acesso a conteúdo adulto
 */
export function clearAdultAccess(): void {
  sessionStorage.removeItem(SESSION_KEY);
  console.log('🔒 Acesso adulto removido');
}

/**
 * Retorna o tempo restante da sessão em minutos
 */
export function getSessionTimeRemaining(): number {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    
    if (!sessionData) {
      return 0;
    }
    
    const session: AdultSession = JSON.parse(sessionData);
    const now = Date.now();
    const remainingMs = session.expiresAt - now;
    
    return Math.max(0, Math.ceil(remainingMs / 60000)); // converter para minutos
    
  } catch (error) {
    return 0;
  }
}
