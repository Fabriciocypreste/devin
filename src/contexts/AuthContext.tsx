import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
      console.log('═══════════════════════════════════════════════════════');
      console.log('🚨 FAKE LOGIN MODE - DEVELOPMENT ONLY 🚨');
      console.log('═══════════════════════════════════════════════════════');
      console.log('⚠️  This is a simulated authentication system');
      console.log('⚠️  ANY email and password combination will work');
      console.log('⚠️  No actual validation is being performed');
      console.log('═══════════════════════════════════════════════════════');
      
      setLoading(true);

      // Generate a random user ID
      const randomUserId = `user_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      
      // Extract name from email (part before @)
      const userName = email.split('@')[0];
      
      // Array of avatar URLs for better fake profiles
      const avatarUrls = [
        'https://api.dicebear.com/7.x/avataaars/svg?seed=' + encodeURIComponent(email),
        'https://api.dicebear.com/7.x/bottts/svg?seed=' + encodeURIComponent(email),
        'https://api.dicebear.com/7.x/personas/svg?seed=' + encodeURIComponent(email),
        'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName) + '&background=random&size=200',
        'https://robohash.org/' + encodeURIComponent(email) + '?set=set4&size=200x200'
      ];
      
      // Pick a random avatar
      const randomAvatar = avatarUrls[Math.floor(Math.random() * avatarUrls.length)];
      
      // Create fake user profile
      const fakeUser: User = {
        id: randomUserId,
        email: email,
        name: userName.charAt(0).toUpperCase() + userName.slice(1), // Capitalize first letter
        avatar: randomAvatar,
        role: 'user'
      };

      console.log('✅ Login Input Received:');
      console.log('   📧 Email:', email);
      console.log('   🔑 Password:', password.replace(/./g, '*')); // Hide password in console
      console.log('');
      console.log('✅ Fake User Profile Generated:');
      console.log('   🆔 User ID:', fakeUser.id);
      console.log('   📧 Email:', fakeUser.email);
      console.log('   👤 Name:', fakeUser.name);
      console.log('   🖼️  Avatar URL:', fakeUser.avatar);
      console.log('   🎭 Role:', fakeUser.role);
      console.log('');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Store user data
      localStorage.setItem('user', JSON.stringify(fakeUser));
      localStorage.setItem('token', `fake_token_${randomUserId}`);
      
      setUser(fakeUser);
      
      console.log('✅ Authentication Successful!');
      console.log('✅ User data stored in localStorage');
      console.log('✅ Fake token generated and stored');
      console.log('═══════════════════════════════════════════════════════');
      console.log('🎉 Welcome to the application!');
      console.log('═══════════════════════════════════════════════════════');
      
    } catch (error) {
      console.error('❌ Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      };

      localStorage.setItem('user', JSON.stringify(newUser));
      localStorage.setItem('token', 'fake-jwt-token');
      setUser(newUser);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
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