import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, profilesApi } from '../utils/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔐 [AuthContext] Iniciando signin...', { email });
      
      // Chamar API REAL do Supabase
      const response = await authApi.signin(email, password);
      console.log('🔐 [AuthContext] Resposta do servidor:', response);
      
      if (!response.success) {
        throw new Error('Falha na autenticação');
      }
      
      // Salvar tokens
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      
      // Criar objeto de usuário
      const authenticatedUser: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
      };
      
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      
      // Carregar perfis do usuário
      console.log('🔐 [AuthContext] Carregando perfis...');
      const profilesResponse = await profilesApi.list(response.access_token);
      console.log('🔐 [AuthContext] Perfis carregados:', profilesResponse);
      
      console.log('🔐 [AuthContext] Login completo!');
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro no signin:', error);
      throw new Error(error.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    try {
      setLoading(true);
      console.log('🔐 [AuthContext] Iniciando signup...', { email, name });
      
      // Chamar API REAL do Supabase
      const response = await authApi.signup({ email, password, name, phone });
      console.log('🔐 [AuthContext] Resposta signup:', response);
      
      if (!response.success) {
        throw new Error('Falha ao criar conta');
      }
      
      // Fazer login automático após cadastro
      await signIn(email, password);
      
      console.log('🔐 [AuthContext] Signup completo!');
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro no signup:', error);
      throw new Error(error.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      if (token) {
        await authApi.signout(token);
      }
      
      // Limpar dados locais
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      console.log('🔐 [AuthContext] Logout completo!');
    } catch (error) {
      console.error('❌ [AuthContext] Erro no signout:', error);
      // Limpar mesmo se der erro
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = { ...user, ...data } as User;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};