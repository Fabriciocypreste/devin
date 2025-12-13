import { ImageWithFallback } from './figma/ImageWithFallback';
const redflixLogo = 'http://chemorena.com/redfliz.png';

// Icons inline to avoid lucide-react dependency
type IconProps = { size?: number; className?: string; strokeWidth?: number };

const Home = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9 22 9 12 15 12 15 22"></polyline>
  </svg>
);

const Film = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
);

const Tv = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

const Sparkles = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
    <path d="M5 3v4"></path>
    <path d="M19 17v4"></path>
    <path d="M3 5h4"></path>
    <path d="M17 19h4"></path>
  </svg>
);

const Soccer = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 2L15 8L21 9L16 14L17 20L12 17L7 20L8 14L3 9L9 8L12 2Z"></path>
  </svg>
);

const Gamepad2 = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="6" y1="11" x2="10" y2="11"></line>
    <line x1="8" y1="9" x2="8" y2="13"></line>
    <line x1="15" y1="12" x2="15.01" y2="12"></line>
    <line x1="18" y1="10" x2="18.01" y2="10"></line>
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path>
  </svg>
);

const Baby = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12h.01"></path>
    <path d="M15 12h.01"></path>
    <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"></path>
    <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
  </svg>
);

const Radio = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
  </svg>
);

const History = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
    <path d="M3 3v5h5"></path>
    <path d="M12 7v5l4 2"></path>
  </svg>
);

const Bookmark = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
  </svg>
);

const Clock = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const TvMinimalPlay = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64Z"></path>
    <path d="M7 21h10"></path>
    <rect width="20" height="14" x="2" y="3" rx="2"></rect>
  </svg>
);

const Settings = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const User = ({ size = 24, className = "", strokeWidth = 2 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

type IconComponent = typeof Home;

interface SidebarItemProps {
  icon: IconComponent;
  label: string;
  collapsed: boolean;
  onClick?: () => void;
  isActive?: boolean;
}

function SidebarItem({ icon: Icon, label, collapsed, onClick, isActive }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex gap-3 items-center px-3 py-2.5 rounded-lg 
        transition-all duration-200 group
        ${isActive 
          ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
          : 'text-white/80 hover:bg-white/10 hover:text-white'
        }
        ${collapsed ? 'justify-center' : ''}
      `}
    >
      <Icon 
        size={22} 
        strokeWidth={2.5}
        className={`shrink-0 transition-transform duration-200 ${
          isActive ? '' : 'group-hover:scale-110'
        }`}
      />
      {!collapsed && (
        <span className="font-['Inter:Medium',sans-serif] text-[15px] whitespace-nowrap">
          {label}
        </span>
      )}
    </button>
  );
}

interface ImprovedSidebarProps {
  collapsed: boolean;
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  onChannelsClick: () => void;
  onKidsClick?: () => void;
  onSoccerClick?: () => void;
  onAdminClick: () => void;
  onUserDashboardClick?: () => void;
  onToggle: () => void;
}

export function ImprovedSidebar({ 
  collapsed, 
  activeCategory = 'Início',
  onCategoryChange,
  onChannelsClick,
  onKidsClick,
  onSoccerClick,
  onAdminClick,
  onUserDashboardClick,
  onToggle 
}: ImprovedSidebarProps) {
  const handleCategoryClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div 
      className={`
        fixed left-0 top-0 h-full z-50
        bg-gradient-to-b from-black via-black to-[#0a0a0a]
        border-r border-white/10
        transition-all duration-300 ease-in-out
        ${collapsed ? 'w-[80px]' : 'w-[240px]'}
      `}
    >
      {/* Header com Logo */}
      <div className="relative border-b border-white/10 overflow-hidden">
        {/* Gradient de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E50914]/10 via-transparent to-transparent" />
        
        <div className={`relative p-6 flex items-center justify-center ${collapsed ? '' : 'flex-col'}`}>
          {/* Logo RedFlix */}
          <div className={`${collapsed ? 'w-12' : 'w-32'} transition-all duration-300`}>
            <ImageWithFallback
              src={redflixLogo}
              alt="RedFlix"
              className="w-full h-auto object-contain drop-shadow-2xl px-[0px] px-[20px] py-[0px]"
              priority={true}
            />
          </div>
          
          {/* Texto Streaming */}
          {!collapsed && (
            <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[11px] uppercase tracking-[2px] mt-2">
              Premium Streaming
            </p>
          )}
        </div>
      </div>

      {/* Menu Principal */}
      <div className="px-4 py-6 space-y-2">
        {!collapsed && (
          <p className="text-white/40 font-['Inter:Semi_Bold',sans-serif] text-[11px] uppercase tracking-wider px-3 mb-3">
            Menu
          </p>
        )}
        <SidebarItem 
          icon={Home} 
          label="Início" 
          collapsed={collapsed}
          isActive={activeCategory === 'Início'}
          onClick={() => handleCategoryClick('Início')}
        />
        <SidebarItem 
          icon={Film} 
          label="Filmes" 
          collapsed={collapsed}
          isActive={activeCategory === 'Filmes'}
          onClick={() => handleCategoryClick('Filmes')}
        />
        <SidebarItem 
          icon={Tv} 
          label="Séries" 
          collapsed={collapsed}
          isActive={activeCategory === 'Séries'}
          onClick={() => handleCategoryClick('Séries')}
        />
        <SidebarItem 
          icon={Sparkles} 
          label="Animes" 
          collapsed={collapsed}
          isActive={activeCategory === 'Animes'}
          onClick={() => handleCategoryClick('Animes')}
        />
        <SidebarItem 
          icon={Gamepad2} 
          label="Futebol" 
          collapsed={collapsed}
          onClick={onSoccerClick}
        />
        <SidebarItem 
          icon={Baby} 
          label="Kids" 
          collapsed={collapsed}
          onClick={onKidsClick}
        />
      </div>

      {/* Biblioteca */}
      <div className="px-4 py-6 space-y-2 border-t border-white/5">
        {!collapsed && (
          <p className="text-white/40 font-['Inter:Semi_Bold',sans-serif] text-[11px] uppercase tracking-wider px-3 mb-3">
            Biblioteca
          </p>
        )}
        <SidebarItem 
          icon={User} 
          label="Meu Dashboard" 
          collapsed={collapsed}
          onClick={onUserDashboardClick}
        />
        <SidebarItem 
          icon={History} 
          label="Histórico" 
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={Bookmark} 
          label="Favoritos" 
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={Clock} 
          label="Ver Depois" 
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={Radio} 
          label="Canais ao Vivo" 
          collapsed={collapsed}
          onClick={onChannelsClick}
        />
      </div>

      {/* Outros */}
      <div className="px-4 py-6 space-y-2 border-t border-white/5">
        {!collapsed && (
          <p className="text-white/40 font-['Inter:Semi_Bold',sans-serif] text-[11px] uppercase tracking-wider px-3 mb-3">
            Outros
          </p>
        )}
        <SidebarItem 
          icon={TvMinimalPlay} 
          label="Assistir Juntos" 
          collapsed={collapsed}
        />
        <SidebarItem 
          icon={Settings} 
          label="Admin Panel" 
          collapsed={collapsed}
          onClick={onAdminClick}
        />
      </div>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5 bg-black/50 backdrop-blur-sm">
          <p className="text-white/30 font-['Inter:Regular',sans-serif] text-[10px] text-center">
            Redfliz © 2024
          </p>
        </div>
      )}
    </div>
  );
}
