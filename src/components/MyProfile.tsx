import { useState } from 'react';

// Icons inline to avoid lucide-react dependency
const ArrowLeftIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const CameraIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);

const Edit2Icon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
  </svg>
);

const ChevronRightIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);

const UserIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const BellIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const DownloadIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const SmartphoneIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const SettingsIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M12 1v6m0 6v6m5.657-13.657l-4.243 4.243m0 6l-4.243 4.243M23 12h-6m-6 0H1m17.657 5.657l-4.243-4.243m0-6l-4.243-4.243"></path>
  </svg>
);

const HelpCircleIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);

const LogOutIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const StarIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const ClockIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const HeartIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
  </svg>
);

const PlayIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const TrophyIcon = ({ className = "", size = 24 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

interface MyProfileProps {
  onClose: () => void;
  currentUser?: { name: string; avatar?: string } | null;
  onManageProfiles?: () => void;
}

export function MyProfile({ onClose, currentUser, onManageProfiles }: MyProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(currentUser?.name || 'Fabricio Cunha');
  const [activeTab, setActiveTab] = useState<'profile' | 'activity' | 'settings'>('profile');

  // Mock data - em produção viria do backend
  const stats = {
    watchedMovies: 247,
    watchedSeries: 89,
    totalHours: 1842,
    favorites: 34,
    rating: 4.8
  };

  const recentActivity = [
    { id: 1, title: 'The Witcher', type: 'Série', episode: 'T3:E5', date: 'Hoje', progress: 75 },
    { id: 2, title: 'Breaking Bad', type: 'Série', episode: 'T2:E4', date: 'Ontem', progress: 100 },
    { id: 3, title: 'The Dark Knight', type: 'Filme', date: '2 dias atrás', progress: 100 },
    { id: 4, title: 'Stranger Things', type: 'Série', episode: 'T4:E2', date: '3 dias atrás', progress: 45 }
  ];

  const devices = [
    { id: 1, name: 'iPhone 13 Pro', active: true, lastUsed: 'Agora' },
    { id: 2, name: 'Samsung Smart TV', active: false, lastUsed: 'Há 2 horas' },
    { id: 3, name: 'iPad Pro', active: false, lastUsed: 'Há 1 dia' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#141414] overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#141414]/95 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3 md:px-8 md:py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 md:w-6 md:h-6" size={24} />
            <span className="text-sm md:text-base">Voltar</span>
          </button>
          <h1 className="text-white text-lg md:text-2xl font-semibold">Meu Perfil</h1>
          <div className="w-16"></div>
        </div>

        {/* Tabs */}
        <div className="flex items-center px-4 md:px-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-3 text-sm md:text-base font-medium transition-all ${
              activeTab === 'profile'
                ? 'text-white border-b-2 border-red-600'
                : 'text-gray-400 border-b-2 border-transparent'
            }`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 text-sm md:text-base font-medium transition-all ${
              activeTab === 'activity'
                ? 'text-white border-b-2 border-red-600'
                : 'text-gray-400 border-b-2 border-transparent'
            }`}
          >
            Atividade
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 text-sm md:text-base font-medium transition-all ${
              activeTab === 'settings'
                ? 'text-white border-b-2 border-red-600'
                : 'text-gray-400 border-b-2 border-transparent'
            }`}
          >
            Configurações
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-6 pb-24 max-w-6xl mx-auto">
        {activeTab === 'profile' && (
          <>
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              {/* Avatar */}
              <div className="relative mb-4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={profileName} className="w-full h-full rounded-lg object-cover" />
                  ) : (
                    <svg width="80" height="80" viewBox="0 0 120 120" fill="none" className="w-16 h-16 md:w-20 md:h-20">
                      <circle cx="35" cy="40" r="8" fill="white" />
                      <circle cx="85" cy="40" r="8" fill="white" />
                      <path d="M 30 70 Q 60 95 90 70" stroke="white" strokeWidth="8" strokeLinecap="round" fill="none" />
                    </svg>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-[#E50914] p-2 rounded-full shadow-lg hover:bg-red-700 transition-colors">
                  <CameraIcon className="w-4 h-4 text-white" size={16} />
                </button>
              </div>

              {/* Name */}
              {isEditing ? (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="bg-[#333] text-white px-4 py-2 rounded-lg text-xl md:text-2xl font-semibold text-center outline-none focus:ring-2 focus:ring-red-600"
                    maxLength={15}
                  />
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      localStorage.setItem('redflix_profile_name', profileName);
                    }}
                    className="bg-[#E50914] px-4 py-2 rounded-lg text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Salvar
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-white text-xl md:text-2xl font-semibold">{profileName}</h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit2Icon className="w-4 h-4" size={16} />
                  </button>
                </div>
              )}
              <p className="text-gray-400 text-sm">Membro desde Set 2023</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <PlayIcon className="w-5 h-5 text-red-600" size={20} />
                  <span className="text-2xl md:text-3xl font-bold text-white">{stats.watchedMovies}</span>
                </div>
                <p className="text-gray-400 text-xs">Filmes</p>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <PlayIcon className="w-5 h-5 text-blue-600" size={20} />
                  <span className="text-2xl md:text-3xl font-bold text-white">{stats.watchedSeries}</span>
                </div>
                <p className="text-gray-400 text-xs">Séries</p>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <ClockIcon className="w-5 h-5 text-purple-600" size={20} />
                  <span className="text-2xl md:text-3xl font-bold text-white">{stats.totalHours}h</span>
                </div>
                <p className="text-gray-400 text-xs">Assistidas</p>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <HeartIcon className="w-5 h-5 text-pink-600" size={20} />
                  <span className="text-2xl md:text-3xl font-bold text-white">{stats.favorites}</span>
                </div>
                <p className="text-gray-400 text-xs">Favoritos</p>
              </div>

              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] p-4 rounded-lg border border-white/5 col-span-2 md:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <StarIcon className="w-5 h-5 text-yellow-600" size={20} />
                  <span className="text-2xl md:text-3xl font-bold text-white">{stats.rating}</span>
                </div>
                <p className="text-gray-400 text-xs">Avaliação</p>
              </div>
            </div>

            {/* Achievements */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5 text-yellow-500" size={20} />
                Conquistas
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { icon: '🎬', label: 'Cinéfilo', unlocked: true },
                  { icon: '📺', label: 'Maratonista', unlocked: true },
                  { icon: '⭐', label: 'Top Fan', unlocked: true },
                  { icon: '🌟', label: 'VIP', unlocked: true },
                  { icon: '🔥', label: 'Em Chamas', unlocked: false },
                  { icon: '👑', label: 'Lendário', unlocked: false }
                ].map((achievement, idx) => (
                  <div
                    key={idx}
                    className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-2 transition-all ${
                      achievement.unlocked
                        ? 'bg-gradient-to-br from-yellow-600/20 to-orange-600/20 border border-yellow-600/30'
                        : 'bg-[#1a1a1a] border border-white/5 opacity-40'
                    }`}
                  >
                    <span className="text-2xl md:text-3xl">{achievement.icon}</span>
                    <span className="text-white text-[10px] md:text-xs text-center px-1">{achievement.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <button 
                onClick={() => {
                  if (onManageProfiles) {
                    onManageProfiles();
                  }
                }}
                className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400" size={20} />
                  <span className="text-white">Gerenciar Perfis</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-gray-400" size={20} />
                  <span className="text-white">Editar Informações do Perfil</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <SettingsIcon className="w-5 h-5 text-gray-400" size={20} />
                  <span className="text-white">Preferências de Reprodução</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
              </button>

              <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <DownloadIcon className="w-5 h-5 text-gray-400" size={20} />
                  <span className="text-white">Downloads</span>
                </div>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
              </button>
            </div>
          </>
        )}

        {activeTab === 'activity' && (
          <>
            {/* Recent Activity */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">Assistidos Recentemente</h3>
              <div className="space-y-3">
                {recentActivity.map((item) => (
                  <div
                    key={item.id}
                    className="bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg p-4 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <p className="text-gray-400 text-sm">
                          {item.type} {item.episode && `• ${item.episode}`}
                        </p>
                      </div>
                      <span className="text-gray-500 text-xs">{item.date}</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-[#333] rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-red-600 h-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Viewing Stats Chart */}
            <div className="bg-[#1a1a1a] rounded-lg p-4 md:p-6">
              <h3 className="text-white text-lg font-semibold mb-4">Tempo Assistido (Últimos 7 dias)</h3>
              <div className="flex items-end justify-between h-32 gap-2">
                {[45, 62, 38, 75, 50, 85, 95].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-gradient-to-t from-red-600 to-red-400 rounded-t transition-all hover:from-red-500 hover:to-red-300"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-gray-500 text-xs">
                      {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'settings' && (
          <>
            {/* Account Settings */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">Conta</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <BellIcon className="w-5 h-5 text-gray-400" size={20} />
                    <div className="text-left">
                      <p className="text-white">Notificações</p>
                      <p className="text-gray-400 text-xs">Gerenciar preferências de notificação</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <DownloadIcon className="w-5 h-5 text-gray-400" size={20} />
                    <div className="text-left">
                      <p className="text-white">Qualidade de Download</p>
                      <p className="text-gray-400 text-xs">Padrão (720p)</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="w-5 h-5 text-gray-400" size={20} />
                    <div className="text-left">
                      <p className="text-white">Reprodução Automática</p>
                      <p className="text-gray-400 text-xs">Ativado</p>
                    </div>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
                </button>
              </div>
            </div>

            {/* Connected Devices */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">Dispositivos Conectados</h3>
              <div className="space-y-2">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="bg-[#1a1a1a] rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <SmartphoneIcon className="w-5 h-5 text-gray-400" size={20} />
                      <div>
                        <p className="text-white">{device.name}</p>
                        <p className="text-gray-400 text-xs">{device.lastUsed}</p>
                      </div>
                    </div>
                    {device.active && (
                      <span className="bg-green-600/20 text-green-500 text-xs px-2 py-1 rounded-full">
                        Ativo
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Support & Help */}
            <div className="mb-8">
              <h3 className="text-white text-lg font-semibold mb-4">Ajuda & Suporte</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <HelpCircleIcon className="w-5 h-5 text-gray-400" size={20} />
                    <span className="text-white">Central de Ajuda</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="w-5 h-5 text-gray-400" size={20} />
                    <span className="text-white">Termos de Uso</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-colors">
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="w-5 h-5 text-gray-400" size={20} />
                    <span className="text-white">Política de Privacidade</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" size={20} />
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div>
              <h3 className="text-red-600 text-lg font-semibold mb-4">Zona de Perigo</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-red-900/20 rounded-lg transition-colors border border-red-900/30">
                  <div className="flex items-center gap-3">
                    <LogOutIcon className="w-5 h-5 text-red-500" size={20} />
                    <span className="text-red-500">Sair de Todos os Dispositivos</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-red-500" size={20} />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-[#1a1a1a] hover:bg-red-900/20 rounded-lg transition-colors border border-red-900/30">
                  <div className="flex items-center gap-3">
                    <SettingsIcon className="w-5 h-5 text-red-500" size={20} />
                    <span className="text-red-500">Excluir Conta</span>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-red-500" size={20} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
