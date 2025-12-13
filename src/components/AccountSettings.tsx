import { useState } from 'react';
import { ChevronRightIcon, HomeIcon, CreditCardIcon, ShieldIcon, MonitorIcon, UserIcon, ArrowLeftIcon } from './Icons';
const netflixLogo = 'http://chemorena.com/redfliz.png';

interface AccountSettingsProps {
  onClose: () => void;
}

type MenuSection = 'visao-geral' | 'assinatura' | 'seguranca' | 'aparelhos' | 'perfis';

export function AccountSettings({ onClose }: AccountSettingsProps) {
  const [activeSection, setActiveSection] = useState<MenuSection>('assinatura');

  const menuItems = [
    { id: 'visao-geral' as MenuSection, label: 'Visão geral', icon: HomeIcon },
    { id: 'assinatura' as MenuSection, label: 'Assinatura', icon: CreditCardIcon },
    { id: 'seguranca' as MenuSection, label: 'Segurança', icon: ShieldIcon },
    { id: 'aparelhos' as MenuSection, label: 'Aparelhos', icon: MonitorIcon },
    { id: 'perfis' as MenuSection, label: 'Perfis', icon: UserIcon },
  ];

  const shortcuts = [
    { icon: '💳', title: 'Alterar plano', description: '' },
    { icon: '💰', title: 'Gerenciar a forma de pagamento', description: '' },
    { icon: '📱', title: 'Gerenciar acesso e aparelhos', description: '' },
    { icon: '🔒', title: 'Atualizar senha', description: '' },
    { icon: '👤', title: 'Transferir um perfil', description: '' },
    { icon: '👶', title: 'Ajustar o controle parental', description: '' },
    { 
      icon: '⚙️', 
      title: 'Editar configurações', 
      description: 'Idiomas, legendas, reprodução automática, notificações, privacidade e muito mais' 
    },
  ];

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <img src={netflixLogo} alt="Netflix" className="h-8" />
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" size={20} />
            <span className="hidden sm:inline">Voltar à Netflix</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      activeSection === item.id
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Assinatura Section */}
            {activeSection === 'assinatura' && (
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Conta</h1>
                  <p className="text-gray-600 mt-1">Detalhes da assinatura</p>
                </div>

                {/* Subscription Info Card */}
                <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                  {/* Badge */}
                  <div className="inline-block bg-[#0073e6] text-white px-4 py-2 rounded text-sm font-medium">
                    Assinante desde novembro de 2025
                  </div>

                  {/* Plan Details */}
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Plano Padrão com anúncios
                    </h2>
                    <p className="text-gray-600">
                      Próximo pagamento: 5 de dezembro de 2025
                    </p>
                    <div className="flex items-center gap-2 text-gray-700">
                      <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                        <rect width="32" height="20" rx="3" fill="#1A1F71"/>
                        <text x="16" y="13" fontSize="8" fill="white" textAnchor="middle" fontWeight="bold">VISA</text>
                      </svg>
                      <span>•••• •••• •••• 4616</span>
                    </div>
                  </div>

                  {/* Manage Button */}
                  <button className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">Gerenciar assinatura</span>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Shortcuts Section */}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-900">Atalhos</h2>
                  <div className="space-y-3">
                    {shortcuts.map((shortcut, index) => (
                      <button
                        key={index}
                        className="w-full flex items-center justify-between px-4 py-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{shortcut.icon}</span>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">{shortcut.title}</p>
                            {shortcut.description && (
                              <p className="text-sm text-gray-500 mt-0.5">{shortcut.description}</p>
                            )}
                          </div>
                        </div>
                        <ChevronRightIcon className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Manage Profiles Section */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">Gerenciar perfis</h2>
                      <p className="text-gray-600 mt-1">2 perfis</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        <div className="w-10 h-10 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white font-bold">
                          U
                        </div>
                        <div className="w-10 h-10 rounded-full bg-pink-500 border-2 border-white flex items-center justify-center text-white font-bold">
                          K
                        </div>
                      </div>
                      <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Visão Geral Section */}
            {activeSection === 'visao-geral' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Visão geral</h1>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <p className="text-gray-600">
                    Resumo da sua conta e atividade recente.
                  </p>
                  {/* Adicionar conteúdo da visão geral aqui */}
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-700">Status da conta</span>
                      <span className="text-green-600 font-medium">Ativa</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-700">Plano atual</span>
                      <span className="text-gray-900 font-medium">Padrão com anúncios</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-gray-700">Dispositivos ativos</span>
                      <span className="text-gray-900 font-medium">3 dispositivos</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Segurança Section */}
            {activeSection === 'seguranca' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Segurança</h1>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-between px-4 py-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">🔑</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Alterar senha</p>
                        <p className="text-sm text-gray-500">Última alteração: há 3 meses</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                  
                  <button className="w-full flex items-center justify-between px-4 py-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">📧</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Alterar e-mail</p>
                        <p className="text-sm text-gray-500">usuario@email.com</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="w-full flex items-center justify-between px-4 py-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">📱</span>
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Autenticação de dois fatores</p>
                        <p className="text-sm text-gray-500">Adicione uma camada extra de segurança</p>
                      </div>
                    </div>
                    <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>
            )}

            {/* Aparelhos Section */}
            {activeSection === 'aparelhos' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Aparelhos</h1>
                <p className="text-gray-600">Gerencie os dispositivos conectados à sua conta</p>
                
                <div className="space-y-3">
                  {[
                    { device: 'Chrome - Windows', location: 'São Paulo, Brasil', lastUsed: 'Agora', active: true },
                    { device: 'Samsung TV', location: 'São Paulo, Brasil', lastUsed: 'Há 2 horas', active: false },
                    { device: 'iPhone 14', location: 'São Paulo, Brasil', lastUsed: 'Há 1 dia', active: false },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between px-4 py-4 bg-white border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${item.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                        <div>
                          <p className="font-medium text-gray-900">{item.device}</p>
                          <p className="text-sm text-gray-500">{item.location} • {item.lastUsed}</p>
                        </div>
                      </div>
                      {!item.active && (
                        <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                          Remover
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perfis Section */}
            {activeSection === 'perfis' && (
              <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900">Perfis</h1>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Usuário', color: 'bg-blue-500', initial: 'U' },
                    { name: 'Kids', color: 'bg-pink-500', initial: 'K' },
                  ].map((profile, index) => (
                    <button
                      key={index}
                      className="group flex flex-col items-center gap-3 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-20 h-20 rounded-lg ${profile.color} flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform`}>
                        {profile.initial}
                      </div>
                      <span className="font-medium text-gray-900">{profile.name}</span>
                    </button>
                  ))}
                  
                  {/* Add Profile Button */}
                  <button className="group flex flex-col items-center gap-3 p-4 bg-white border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-4xl group-hover:text-gray-600 transition-colors">
                      +
                    </div>
                    <span className="font-medium text-gray-600 group-hover:text-gray-900">Adicionar perfil</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm text-gray-600">
            <div className="space-y-3">
              <a href="#" className="block hover:underline">Entre em contato</a>
              <a href="#" className="block hover:underline">Relações com investidores</a>
              <a href="#" className="block hover:underline">Termos de Uso</a>
              <a href="#" className="block hover:underline">Cartão pré-pago</a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline">Media Center</a>
              <a href="#" className="block hover:underline">Carreiras</a>
              <a href="#" className="block hover:underline">Declaração de Privacidade</a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline">Preferências de cookies</a>
              <a href="#" className="block hover:underline">Áudio e legendas</a>
              <a href="#" className="block hover:underline">Central de Ajuda</a>
            </div>
            <div className="space-y-3">
              <a href="#" className="block hover:underline">Informações corporativas</a>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-500">
            Dúvidas? Entre em contato
          </p>
        </div>
      </div>
    </div>
  );
}
