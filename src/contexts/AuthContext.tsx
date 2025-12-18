import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../utils/supabase/client';

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
  signUp: (email: string, password: string, name: string) => Promise<void>;
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
    // Verificar sessão existente ao carregar
    const checkSession = async () => {
      try {
        console.log('🔍 [AuthContext] Verificando sessão existente...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ [AuthContext] Erro ao verificar sessão:', error);
          return;
        }

        if (session?.user) {
          console.log('✅ [AuthContext] Sessão encontrada:', session.user.id);
          
          const restoredUser: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            role: session.user.user_metadata?.role || 'user',
          };

          setUser(restoredUser);
          localStorage.setItem('user', JSON.stringify(restoredUser));
        } else {
          console.log('ℹ️ [AuthContext] Nenhuma sessão encontrada');
        }
      } catch (error) {
        console.error('❌ [AuthContext] Erro ao restaurar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listener para mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 [AuthContext] Auth state changed:', event);

        if (event === 'SIGNED_IN' && session?.user) {
          const loggedUser: User = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            role: session.user.user_metadata?.role || 'user',
          };
          setUser(loggedUser);
          localStorage.setItem('user', JSON.stringify(loggedUser));
        }

        if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 [AuthContext] Iniciando login real com Supabase...');
      setLoading(true);

      // Autenticação real com Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ [AuthContext] Erro ao fazer login:', error);
        throw new Error(error.message || 'Erro ao fazer login');
      }

      if (!data.user) {
        throw new Error('Usuário não encontrado');
      }

      console.log('✅ [AuthContext] Login bem-sucedido:', data.user.id);

      // Criar objeto de usuário
      const loggedUser: User = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
        avatar: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
        role: data.user.user_metadata?.role || 'user',
      };

      // Salvar no state
      setUser(loggedUser);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      console.log('✅ [AuthContext] Usuário salvo no contexto');
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro no signIn:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 [AuthContext] Criando nova conta...');
      setLoading(true);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: 'user',
          },
        },
      });

      if (error) {
        console.error('❌ [AuthContext] Erro ao criar conta:', error);
        throw new Error(error.message || 'Erro ao criar conta');
      }

      if (!data.user) {
        throw new Error('Erro ao criar usuário');
      }

      console.log('✅ [AuthContext] Conta criada com sucesso:', data.user.id);

      // Criar objeto de usuário
      const newUser: User = {
        id: data.user.id,
        email: data.user.email!,
        name: name,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
        role: 'user',
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error: any) {
      console.error('❌ [AuthContext] Erro no signUp:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('🚪 [AuthContext] Realizando logout...');
      setLoading(true);

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ [AuthContext] Erro ao fazer logout:', error);
        throw error;
      }

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      
      console.log('✅ [AuthContext] Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ [AuthContext] Erro no signOut:', error);
      throw error;
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