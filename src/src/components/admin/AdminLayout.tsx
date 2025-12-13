/**
 * 🎨 ADMIN LAYOUT - LAYOUT BASE DO DASHBOARD ADMIN
 * Sidebar + Header + Conteúdo
 */

import { ReactNode } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { useState } from 'react';

const redflixLogo = 'http://chemorena.com/redfliz.png';

interface MenuItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  onBack: () => void;
}

export function AdminLayout({ children, currentPage, onPageChange, onBack }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Visão Geral', icon: <span className="text-lg">📊</span> },
    { id: 'subscribers', label: 'Assinantes', icon: <span className="text-lg">👥</span>, badge: 125000 },
    { id: 'vod', label: 'Conteúdo VOD', icon: <span className="text-lg">🎬</span> },
    { id: 'channels', label: 'Canais IPTV', icon: <span className="text-lg">📺</span> },
    { id: 'epg', label: 'EPG', icon: <span className="text-lg">📅</span> },
    { id: 'plans', label: 'Planos', icon: <span className="text-lg">📦</span> },
    { id: 'coupons', label: 'Cupons', icon: <span className="text-lg">🎁</span> },
    { id: 'devices', label: 'Dispositivos', icon: <span className="text-lg">📱</span>, badge: 87500 },
    { id: 'financial', label: 'Financeiro', icon: <span className="text-lg">💰</span> },
    { id: 'notifications', label: 'Notificações', icon: <span className="text-lg">🔔</span> },
    { id: 'soccer', label: 'Futebol', icon: <span className="text-lg">⚽</span>, badge: 5 },
    { id: 'logs', label: 'Logs & Segurança', icon: <span className="text-lg">🛡️</span> },
    { id: 'access', label: 'Gerar Acesso', icon: <span className="text-lg">📄</span> },
    { id: 'm3u', label: 'Importar M3U', icon: <span className="text-lg">📤</span> },
    { id: 'ai', label: 'Inteligência IA', icon: <span className="text-lg">🧠</span> },
    { id: 'settings', label: 'Configurações', icon: <span className="text-lg">⚙️</span> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 bg-[#141414] border-r border-[#2a2a2a] flex-col fixed h-full z-40">
        {/* Logo */}
        <div className="p-6 border-b border-[#2a2a2a]">
          <ImageWithFallback
            src={redflixLogo}
            alt="RedFlix PRO"
            className="h-8"
          />
          <span className="ml-2 text-xs text-gray-400 font-medium">ADMIN PRO</span>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  currentPage === item.id
                    ? 'bg-[#E50914] text-white shadow-lg shadow-red-500/20'
                    : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    currentPage === item.id 
                      ? 'bg-white/20 text-white' 
                      : 'bg-[#E50914]/20 text-[#E50914]'
                  }`}>
                    {item.badge > 999 ? `${Math.floor(item.badge / 1000)}k` : item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Help Section */}
        <div className="p-4 border-t border-[#2a2a2a]">
          <button 
            onClick={onBack}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
          >
            <span className="text-base">←</span>
            <span>Voltar ao App</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/80" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-[#141414] border-r border-[#2a2a2a] flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageWithFallback
                  src={redflixLogo}
                  alt="RedFlix PRO"
                  className="h-8"
                />
                <span className="text-xs text-gray-400 font-medium">ADMIN PRO</span>
              </div>
              <button onClick={() => setSidebarOpen(false)}>
                <span className="text-xl text-gray-400">✕</span>
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 overflow-y-auto py-4 px-3">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onPageChange(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                      currentPage === item.id
                        ? 'bg-[#E50914] text-white shadow-lg shadow-red-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        currentPage === item.id 
                          ? 'bg-white/20 text-white' 
                          : 'bg-[#E50914]/20 text-[#E50914]'
                      }`}>
                        {item.badge > 999 ? `${Math.floor(item.badge / 1000)}k` : item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </nav>

            {/* Help Section */}
            <div className="p-4 border-t border-[#2a2a2a]">
              <button 
                onClick={onBack}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1a1a1a] rounded-lg transition-colors"
              >
                <span className="text-base">←</span>
                <span>Voltar ao App</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between px-4 md:px-8 py-4">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <span className="text-2xl">☰</span>
              </button>
              <div>
                <h1 className="text-xl font-bold">
                  {menuItems.find(item => item.id === currentPage)?.label || 'Dashboard'}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">RedFlix PRO Admin Panel</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-[#1a1a1a] rounded-lg px-4 py-2 border border-[#2a2a2a]">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="bg-transparent border-none outline-none text-sm text-white placeholder-gray-500 w-48"
                />
              </div>

              {/* Notifications */}
              <button className="relative p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors">
                <span className="text-lg text-gray-400">🔔</span>
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#E50914] rounded-full" />
              </button>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-[#2a2a2a]">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">Admin Master</p>
                  <p className="text-xs text-gray-400">Acesso Total</p>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#E50914] to-[#B20710] flex items-center justify-center font-bold text-sm">
                  A
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}