/**
 * REDFLIX SETTINGS PAGE
 * Configurações e preferências do aplicativo
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from '../utils/toastNotifications';

interface Settings {
  // Reprodução
  autoplay: boolean;
  quality: 'auto' | 'high' | 'medium' | 'low';
  subtitles: boolean;
  defaultLanguage: string;
  
  // Notificações
  emailNotifications: boolean;
  pushNotifications: boolean;
  newContentAlerts: boolean;
  
  // Interface
  theme: 'dark' | 'light';
  language: string;
  region: string;
  
  // Avançado
  clearCache: boolean;
  dataUsage: 'high' | 'medium' | 'low';
}

const SETTINGS_KEY = 'redflix_settings';

const defaultSettings: Settings = {
  autoplay: true,
  quality: 'auto',
  subtitles: false,
  defaultLanguage: 'pt-BR',
  emailNotifications: true,
  pushNotifications: false,
  newContentAlerts: true,
  theme: 'dark',
  language: 'pt-BR',
  region: 'BR',
  clearCache: false,
  dataUsage: 'high'
};

export function Settings() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    loadSettings();
  }, [isAuthenticated, navigate]);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings({ ...defaultSettings, ...JSON.parse(stored) });
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    }
  };

  const handleChange = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
      setHasChanges(false);
      toast.success('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    }
  };

  const handleClearCache = () => {
    if (confirm('Isso irá limpar todos os dados em cache. Deseja continuar?')) {
      // Limpa dados de cache (mantém autenticação)
      const keysToKeep = ['redflix_access_token', 'redflix_user', 'redflix_selected_profile'];
      Object.keys(localStorage).forEach(key => {
        if (!keysToKeep.includes(key)) {
          localStorage.removeItem(key);
        }
      });
      toast.success('Cache limpo com sucesso!');
    }
  };

  const handleClearHistory = () => {
    if (confirm('Isso irá apagar todo o seu histórico de visualização. Deseja continuar?')) {
      localStorage.removeItem('redflix_watch_history');
      toast.success('Histórico limpo com sucesso!');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">Configurações</h1>
          {hasChanges && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-medium"
            >
              Salvar Alterações
            </button>
          )}
        </div>

        {/* Playback Settings */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Reprodução</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Reprodução Automática</div>
                <div className="text-gray-400 text-sm">Iniciar próximo episódio automaticamente</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.autoplay}
                  onChange={(e) => handleChange('autoplay', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Legendas</div>
                <div className="text-gray-400 text-sm">Ativar legendas por padrão</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.subtitles}
                  onChange={(e) => handleChange('subtitles', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Qualidade de Vídeo</label>
              <select
                value={settings.quality}
                onChange={(e) => handleChange('quality', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
              >
                <option value="auto">Automática</option>
                <option value="high">Alta (1080p)</option>
                <option value="medium">Média (720p)</option>
                <option value="low">Baixa (480p)</option>
              </select>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">Idioma Padrão</label>
              <select
                value={settings.defaultLanguage}
                onChange={(e) => handleChange('defaultLanguage', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
              >
                <option value="pt-BR">Português (Brasil)</option>
                <option value="en-US">English (US)</option>
                <option value="es-ES">Español</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Notificações</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Notificações por Email</div>
                <div className="text-gray-400 text-sm">Receber atualizações por email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Notificações Push</div>
                <div className="text-gray-400 text-sm">Receber notificações no navegador</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.pushNotifications}
                  onChange={(e) => handleChange('pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-white font-medium">Alertas de Novo Conteúdo</div>
                <div className="text-gray-400 text-sm">Ser notificado sobre novos lançamentos</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.newContentAlerts}
                  onChange={(e) => handleChange('newContentAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-red-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Advanced */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-2xl font-bold text-white mb-6">Avançado</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white font-medium mb-2">Uso de Dados</label>
              <select
                value={settings.dataUsage}
                onChange={(e) => handleChange('dataUsage', e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600"
              >
                <option value="high">Alto (Melhor qualidade)</option>
                <option value="medium">Médio (Balanceado)</option>
                <option value="low">Baixo (Economizar dados)</option>
              </select>
            </div>

            <div className="pt-4 border-t border-gray-800">
              <button
                onClick={handleClearCache}
                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">Limpar Cache</div>
                  <div className="text-gray-400 text-sm">Remove dados temporários</div>
                </div>
                <span className="text-xl">🗑️</span>
              </button>
            </div>

            <div>
              <button
                onClick={handleClearHistory}
                className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">Limpar Histórico</div>
                  <div className="text-gray-400 text-sm">Remove histórico de visualização</div>
                </div>
                <span className="text-xl">📜</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Legal</h2>
          
          <div className="space-y-3">
            <button className="w-full text-left text-gray-300 hover:text-white transition-colors">
              Termos de Uso
            </button>
            <button className="w-full text-left text-gray-300 hover:text-white transition-colors">
              Política de Privacidade
            </button>
            <button className="w-full text-left text-gray-300 hover:text-white transition-colors">
              Sobre o RedFlix
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
