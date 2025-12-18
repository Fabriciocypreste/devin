/**
 * REDFLIX PROFILE PAGE
 * Página de perfil do usuário com integração AuthContext
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { addToHistory, getHistory, getContinueWatching } from '../utils/history';
import { getFavorites } from '../utils/favorites';
import { toast } from '../utils/toastNotifications';

export function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signout } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  });
  
  const [stats, setStats] = useState({
    watchedCount: 0,
    favoritesCount: 0,
    continueWatchingCount: 0,
    totalWatchTime: 0 // em minutos
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: '',
        avatar: user.avatar || ''
      });
    }

    // Calcula estatísticas
    calculateStats();
  }, [user, isAuthenticated, navigate]);

  const calculateStats = () => {
    const history = getHistory();
    const favorites = getFavorites();
    const continueWatching = getContinueWatching();
    
    // Calcula tempo total assistido (estimativa)
    const totalMinutes = history.reduce((acc, item) => {
      const duration = item.duration || 90; // default 90min
      const watched = (duration / 60) * (item.progress / 100);
      return acc + watched;
    }, 0);

    setStats({
      watchedCount: history.length,
      favoritesCount: favorites.length,
      continueWatchingCount: continueWatching.length,
      totalWatchTime: Math.floor(totalMinutes)
    });
  };

  const handleSave = async () => {
    // TODO: Implementar salvamento no backend quando disponível
    try {
      console.log('Salvando perfil:', formData);
      // Aqui você pode adicionar chamada à API
      setIsEditing(false);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao atualizar perfil');
    }
  };

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair?')) {
      await signout();
      navigate('/login');
    }
  };

  const formatWatchTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes}min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-white mb-8">Meu Perfil</h1>

        {/* Profile Card */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-5xl font-bold mb-4">
                {formData.avatar ? (
                  <img
                    src={formData.avatar}
                    alt="Avatar"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  formData.name.charAt(0).toUpperCase()
                )}
              </div>
              {isEditing && (
                <button className="text-sm text-red-500 hover:text-red-400">
                  Alterar Foto
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Nome</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Telefone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleSave}
                      className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{formData.name}</h2>
                    <p className="text-gray-400">{formData.email}</p>
                    {formData.phone && <p className="text-gray-400">{formData.phone}</p>}
                  </div>
                  
                  {user.plan && (
                    <div className="inline-block px-4 py-1 bg-red-600/20 border border-red-600 rounded-full text-red-500 text-sm">
                      Plano: {user.plan}
                    </div>
                  )}
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-red-500 hover:text-red-400 font-medium"
                  >
                    Editar Perfil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Estatísticas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.watchedCount}</div>
              <div className="text-gray-400 text-sm">Assistidos</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.favoritesCount}</div>
              <div className="text-gray-400 text-sm">Favoritos</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{stats.continueWatchingCount}</div>
              <div className="text-gray-400 text-sm">Continuando</div>
            </div>
            
            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">{formatWatchTime(stats.totalWatchTime)}</div>
              <div className="text-gray-400 text-sm">Tempo Assistido</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/favorites')}
              className="flex items-center gap-4 p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl hover:border-red-600 transition-colors text-left"
            >
              <span className="text-3xl">❤️</span>
              <div>
                <div className="text-white font-semibold mb-1">Meus Favoritos</div>
                <div className="text-gray-400 text-sm">Ver todos os seus favoritos</div>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-4 p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl hover:border-red-600 transition-colors text-left"
            >
              <span className="text-3xl">📜</span>
              <div>
                <div className="text-white font-semibold mb-1">Histórico</div>
                <div className="text-gray-400 text-sm">Ver seu histórico de visualização</div>
              </div>
            </button>
            
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-4 p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl hover:border-red-600 transition-colors text-left"
            >
              <span className="text-3xl">⚙️</span>
              <div>
                <div className="text-white font-semibold mb-1">Configurações</div>
                <div className="text-gray-400 text-sm">Ajustar preferências do app</div>
              </div>
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-6 bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl hover:border-red-600 transition-colors text-left"
            >
              <span className="text-3xl">🚪</span>
              <div>
                <div className="text-white font-semibold mb-1">Sair</div>
                <div className="text-gray-400 text-sm">Desconectar da sua conta</div>
              </div>
            </button>
          </div>
        </div>

        {/* Password Change */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Alterar Senha</h3>
          <button
            onClick={() => alert('Funcionalidade de alteração de senha em breve!')}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Alterar Senha
          </button>
        </div>
      </div>
    </div>
  );
}
