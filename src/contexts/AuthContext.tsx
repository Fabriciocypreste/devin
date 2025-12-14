/**
 * REDFLIX AUTH CONTEXT
 * Gerenciamento de autenticação e sessão do usuário
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';

interface User {
  id: number;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
  plan?: string;
}

interface Profile {
  id: string;
  user_id: string;
  name: string;
  avatar_url?: string;
  is_kids: boolean;
  maturity_rating: string;
}

interface AuthContextType {
  user: User | null;
  userId: number | null; // ID do usuario para uso em componentes (substitui hardcoding)
  accessToken: string | null;
  profiles: Profile[];
  selectedProfile: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Métodos de autenticação
  signup: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<void>;
  signout: () => Promise<void>;

  // Métodos de perfil
  selectProfile: (profile: Profile) => void;
  loadProfiles: () => Promise<void>;
  createProfile: (name: string, isKids?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: 'redflix_access_token',
  USER: 'redflix_user',
  PROFILE: 'redflix_selected_profile',
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER);
        const storedProfile = localStorage.getItem(STORAGE_KEYS.PROFILE);

        if (storedToken && storedUser) {
          setAccessToken(storedToken);
          setUser(JSON.parse(storedUser));

          // Carregar perfis (com try-catch para evitar crash)
          try {
            const { profiles: loadedProfiles } = await api.profiles.list(storedToken);
            setProfiles(loadedProfiles);

            // Restaurar perfil selecionado
            if (storedProfile) {
              const profile = JSON.parse(storedProfile);
              setSelectedProfile(profile);
            } else if (loadedProfiles.length > 0) {
              setSelectedProfile(loadedProfiles[0]);
            }
          } catch (profileError) {
            console.error('Erro ao carregar perfis:', profileError);
            // Continua sem perfis, mas mantém a sessão
          }
        }
      } catch (error) {
        console.error('Erro ao carregar sessão:', error);
        // Limpar dados inválidos
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  /**
   * Cadastro de novo usuário
   */
  const signup = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const response = await api.auth.signup({ email, password, name, phone });

      if (response.success) {
        // Fazer login automaticamente após cadastro
        await signin(email, password);
      }
    } catch (error) {
      console.error('Erro no cadastro:', error);
      throw error;
    }
  };

  /**
   * Login
   */
  const signin = async (email: string, password: string) => {
    try {
      console.log('🔐 [AuthContext] Iniciando signin FAKE (Bypass)...', { email });

      // SIMULAÇÃO DE LOGIN (Bypass para desenvolvimento)
      const fakeUser: User = {
        id: 1, // ID numerico para compatibilidade com o banco de dados
        email: email,
        name: email.split('@')[0] || 'Usuário Teste',
        role: 'user',
        plan: 'basic'
      };
      const fakeToken = 'fake-jwt-token-dev-bypass';

      // Salvar token e usuário
      setAccessToken(fakeToken);
      setUser(fakeUser);

      localStorage.setItem(STORAGE_KEYS.TOKEN, fakeToken);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fakeUser));

      console.log('🔐 [AuthContext] Criando perfil fake...');

      // Fake profiles
      const fakeProfiles = [
        { id: 'p1', user_id: '123', name: 'Perfil Principal', is_kids: false, maturity_rating: 'all' },
        { id: 'p2', user_id: '123', name: 'Kids', is_kids: true, maturity_rating: '12' }
      ];

      setProfiles(fakeProfiles);
      selectProfile(fakeProfiles[0]);

      console.log('🔐 [AuthContext] Login FAKE completo!');
      return; // Retorna sucesso

      /* CÓDIGO ORIGINAL DESATIVADO
      const response = await api.auth.signin(email, password);
      
      console.log('🔐 [AuthContext] Resposta do servidor:', response);
      
      if (response.success && response.access_token) {
        // ...
      } else {
        console.error('🔐 [AuthContext] Resposta sem success ou access_token:', response);
        throw new Error('Resposta inválida do servidor');
      }
      */
    } catch (error) {
      console.error('🔐 [AuthContext] Erro no login:', error);
      throw error;
    }
  };

  /**
   * Logout
   */
  const signout = async () => {
    try {
      if (accessToken) {
        await api.auth.signout(accessToken);
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Limpar dados locais
      setUser(null);
      setAccessToken(null);
      setProfiles([]);
      setSelectedProfile(null);

      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    }
  };

  /**
   * Selecionar perfil
   */
  const selectProfile = (profile: Profile) => {
    setSelectedProfile(profile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  };

  /**
   * Carregar perfis
   */
  const loadProfiles = async () => {
    if (!accessToken) return;

    try {
      const { profiles: loadedProfiles } = await api.profiles.list(accessToken);
      setProfiles(loadedProfiles);
    } catch (error) {
      console.error('Erro ao carregar perfis:', error);
    }
  };

  /**
   * Criar novo perfil
   */
  const createProfile = async (name: string, isKids = false) => {
    if (!accessToken) return;

    try {
      await api.profiles.create(accessToken, {
        name,
        is_kids: isKids,
        maturity_rating: isKids ? '12' : 'all',
      });

      // Recarregar perfis
      await loadProfiles();
    } catch (error) {
      console.error('Erro ao criar perfil:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    userId: user?.id || null, // ID do usuario para uso em componentes
    accessToken,
    profiles,
    selectedProfile,
    isAuthenticated: !!user && !!accessToken,
    isLoading,

    signup,
    signin,
    signout,

    selectProfile,
    loadProfiles,
    createProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    // Durante o desenvolvimento com hot-reload, o contexto pode não estar disponível temporariamente
    // Retornar valores padrão sem warning excessivo
    const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

    if (isDev) {
      // Mostrar warning apenas uma vez durante desenvolvimento
      if (!(window as any).__authWarningShown) {
        console.warn('useAuth: AuthProvider não encontrado - usando valores padrão');
        (window as any).__authWarningShown = true;
      }
    }

    return {
      user: null,
      userId: null, // ID do usuario para uso em componentes
      accessToken: null,
      profiles: [],
      selectedProfile: null,
      isAuthenticated: false,
      isLoading: true,
      signup: async () => { },
      signin: async () => { },
      signout: async () => { },
      selectProfile: () => { },
      loadProfiles: async () => { },
      createProfile: async () => { },
    } as AuthContextType;
  }

  return context;
}

export default AuthContext;
