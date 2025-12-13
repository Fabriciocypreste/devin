import { useState, useEffect } from 'react';
import { SearchIcon, BellIcon, ChevronDownIcon, UserIcon, MenuIcon, XIcon } from './Icons';
const redflixLogo = 'http://chemorena.com/redfliz.png';

interface NetflixHeaderProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  onSearchClick: () => void;
  onProfileClick?: () => void;
  currentUser?: { name: string; avatar?: string } | null;
}

export function NetflixHeader({
  activeCategory,
  onCategoryChange,
  onSearchClick,
  onProfileClick,
  currentUser
}: NetflixHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { label: 'Início', value: 'home' },
    { label: 'Séries', value: 'Séries' },
    { label: 'Filmes', value: 'Filmes' },
    { label: 'Bombando', value: 'bombando' },
    { label: 'Navegar por idiomas', value: 'languages' },
    { label: 'Canais', value: 'canais' },
    { label: 'Futebol', value: 'futebol' },
    { label: 'Minha lista', value: 'my-list' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="flex items-center justify-between px-4 md:px-12 h-16 md:h-[68px]">
          {/* Logo + Menu */}
          <div className="flex items-center gap-3 md:gap-10">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden text-white p-1"
              aria-label="Menu"
            >
              {showMobileMenu ? <XIcon className="w-6 h-6" size={24} /> : <MenuIcon className="w-6 h-6" size={24} />}
            </button>

            {/* Logo RedFlix */}
            <img
              src={redflixLogo}
              alt="RedFlix"
              className="h-6 md:h-8 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onCategoryChange('redflix-originals')}
              title="RedFlix Originais"
            />

            {/* Navigation Menu - Desktop */}
            <nav className="hidden lg:flex items-center gap-5">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => onCategoryChange(item.value)}
                  className={`text-sm transition-colors ${
                    activeCategory === item.value
                      ? 'text-white font-semibold'
                      : 'text-gray-300 hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* Search */}
            <button
              onClick={onSearchClick}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Buscar"
            >
              <SearchIcon className="w-5 h-5 md:w-6 md:h-6" size={24} />
            </button>

            {/* Kids - Hidden on mobile */}
            <button
              onClick={() => onCategoryChange('kids')}
              className="hidden md:block text-white hover:text-gray-300 transition-colors text-sm font-medium"
            >
              Infantil
            </button>

            {/* Notifications - Hidden on very small screens */}
            <button
              className="hidden sm:block text-white hover:text-gray-300 transition-colors relative"
              aria-label="Notificações"
            >
              <BellIcon className="w-5 h-5 md:w-6 md:h-6" size={24} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#E50914] rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-1 md:gap-2 group"
                aria-label="Perfil"
              >
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 md:w-8 md:h-8 rounded"
                  />
                ) : (
                  <div className="w-7 h-7 md:w-8 md:h-8 bg-[#E50914] rounded flex items-center justify-center">
                    <UserIcon className="w-4 h-4 md:w-5 md:h-5 text-white" size={20} />
                  </div>
                )}
                <ChevronDownIcon className="hidden md:block w-4 h-4 text-white group-hover:rotate-180 transition-transform" size={16} />
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-4 w-56 bg-black/95 border border-gray-700 rounded py-2 shadow-xl">
                  <button
                    onClick={() => {
                      onCategoryChange('my-profile');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    👤 Meu Perfil
                  </button>
                  <button
                    onClick={() => {
                      onCategoryChange('user-dashboard');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    📊 Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onCategoryChange('admin-dashboard');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    🎛 Admin Dashboard
                  </button>
                  <div className="border-t border-gray-700 my-2"></div>
                  <div className="px-4 py-1 text-xs text-gray-400 font-semibold">MINHA ÁREA</div>
                  <button
                    onClick={() => {
                      onCategoryChange('my-list');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    📋 Minha Lista
                  </button>
                  <button
                    onClick={() => {
                      onCategoryChange('continue-watching');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    ▶️ Continue Assistindo
                  </button>
                  <button
                    onClick={() => {
                      onCategoryChange('favorites');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    ❤️ Favoritos
                  </button>
                  <button
                    onClick={() => {
                      onCategoryChange('history');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    📜 Histórico
                  </button>
                  <div className="border-t border-gray-700 my-2"></div>
                  <button
                    onClick={() => {
                      onCategoryChange('account-settings');
                      setShowProfileMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    ⚙️ Conta
                  </button>
                  <button
                    onClick={onProfileClick}
                    className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors text-sm"
                  >
                    🚪 Sair
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {showMobileMenu && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
          onClick={() => setShowMobileMenu(false)}
        >
          <div 
            className="fixed left-0 top-16 bottom-0 w-72 bg-[#141414] shadow-xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="flex flex-col p-4">
              {menuItems.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    onCategoryChange(item.value);
                    setShowMobileMenu(false);
                  }}
                  className={`text-left py-3 px-4 rounded-lg transition-all ${
                    activeCategory === item.value
                      ? 'bg-[#E50914] text-white font-semibold'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Kids link in mobile menu */}
              <button
                onClick={() => {
                  onCategoryChange('kids');
                  setShowMobileMenu(false);
                }}
                className={`text-left py-3 px-4 rounded-lg transition-all ${
                  activeCategory === 'kids'
                    ? 'bg-[#E50914] text-white font-semibold'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                Infantil
              </button>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}