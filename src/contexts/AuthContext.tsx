import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@supabase/supabase-js';

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
  error: string | null;
  signIn: (email: string, password: string) => Promise<User>;
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

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session on mount
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ Sessão existente encontrada:', session.user.email);
          
          const existingUser = {
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
            avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            role: 'user' as const,
          };
          
          setUser(existingUser);
          localStorage.setItem('user', JSON.stringify(existingUser));
          localStorage.setItem('token', session.access_token);
        } else {
          console.log('ℹ️ Nenhuma sessão ativa encontrada');
          // Check for stored user data (fallback)
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              console.error('Error parsing stored user:', error);
              localStorage.removeItem('user');
            }
          }
        }
      } catch (error) {
        console.error('❌ Erro ao verificar sessão:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth state changed:', event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } else if (event === 'SIGNED_IN' && session?.user) {
        const authenticatedUser = {
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.full_name || session.user.email!.split('@')[0],
          avatar: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
          role: 'user' as const,
        };
        
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        localStorage.setItem('token', session.access_token);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 [AuthContext] Iniciando login real com Supabase...');
      
      setLoading(true);
      setError(null);

      // Real authentication with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        console.error('❌ [AuthContext] Erro na autenticação:', error.message);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Usuário não encontrado');
      }

      console.log('✅ [AuthContext] Login bem-sucedido:', data.user.email);

      // Create user object
      const authenticatedUser = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
        avatar: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
        role: 'user' as const,
      };

      // Save to state and localStorage
      setUser(authenticatedUser);
      localStorage.setItem('user', JSON.stringify(authenticatedUser));
      localStorage.setItem('token', data.session?.access_token || '');

      console.log('✅ [AuthContext] Sessão criada com sucesso');
      return authenticatedUser;

    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao fazer login';
      console.error('❌ [AuthContext] Erro no signIn:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('📝 [AuthContext] Iniciando cadastro com Supabase...');
      
      setLoading(true);
      setError(null);

      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error('❌ [AuthContext] Erro no cadastro:', error.message);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Erro ao criar usuário');
      }

      console.log('✅ [AuthContext] Cadastro bem-sucedido:', data.user.email);

      // If email confirmation is disabled, auto login
      if (data.session) {
        const newUser = {
          id: data.user.id,
          email: data.user.email!,
          name: name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.id}`,
          role: 'user' as const,
        };

        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', data.session.access_token);
      }

    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar conta';
      console.error('❌ [AuthContext] Erro no signUp:', errorMessage);
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log('👋 [AuthContext] Fazendo logout...');
      setLoading(true);
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Erro ao fazer logout:', error);
        throw error;
      }

      // Clear local state
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      
      console.log('✅ [AuthContext] Logout realizado com sucesso');
    } catch (error) {
      console.error('❌ Sign out error:', error);
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
    error,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};