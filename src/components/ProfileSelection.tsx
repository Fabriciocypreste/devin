import { ImageWithFallback } from './figma/ImageWithFallback';
const redflixLogo = 'http://chemorena.com/redfliz.png';
const backgroundImage = 'https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1920&q=80';

interface ProfileSelectionProps {
  onSelectProfile: () => void;
  onManageProfiles?: () => void;
  onSelectKidsProfile?: () => void;
}

export function ProfileSelection({ onSelectProfile, onManageProfiles, onSelectKidsProfile }: ProfileSelectionProps) {
  return (
    <div 
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-8 py-8 md:py-16"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#000'
      }}
    >
      {/* Logo */}
      <div className="mb-4 md:mb-8">
        <ImageWithFallback
          src={redflixLogo}
          alt="RedFlix Logo"
          className="h-6 md:h-12 w-auto"
        />
      </div>

      {/* Featured Content Title - Mobile Only */}
      <div className="md:hidden text-center mb-4">
        <h2 className="text-white text-xl font-bold mb-1">ATÉ O ÚLTIMO SAMURAI</h2>
        <p className="text-gray-300 text-sm">Disponível em 13 de novembro</p>
      </div>

      {/* Título */}
      <h1 className="text-white text-xl md:text-4xl lg:text-6xl mb-6 md:mb-16 text-center font-medium">
        Escolha o seu perfil
      </h1>

      {/* Profiles Grid */}
      <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-10 md:mb-16 max-w-4xl">
        {/* Profile 1 - Fabricio Cunha - Cara Azul Sorridente */}
        <button
          onClick={onSelectProfile}
          className="group flex flex-col items-center gap-2 md:gap-4 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
        >
          <div className="w-24 h-24 md:w-40 md:h-40 lg:w-[200px] lg:h-[200px] bg-[#3B82F6] rounded-md md:rounded-lg overflow-hidden flex items-center justify-center relative border-2 md:border-4 border-transparent group-hover:border-white transition-all duration-300">
            {/* Cara Sorridente Simples */}
            <svg className="w-16 h-16 md:w-24 md:h-24 lg:w-[120px] lg:h-[120px]" viewBox="0 0 120 120" fill="none">
              {/* Olho Esquerdo */}
              <circle cx="35" cy="40" r="8" fill="white" />
              {/* Olho Direito */}
              <circle cx="85" cy="40" r="8" fill="white" />
              {/* Sorriso */}
              <path
                d="M 30 70 Q 60 95 90 70"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
          <span className="text-gray-400 text-sm md:text-base lg:text-xl transition-colors duration-300 group-hover:text-white text-center">
            FABRICIO...
          </span>
        </button>

        {/* Profile 2 - Infantil - Gradiente Arco-íris */}
        <button
          onClick={onSelectKidsProfile || onSelectProfile}
          className="group flex flex-col items-center gap-2 md:gap-4 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
        >
          <div 
            className="w-24 h-24 md:w-40 md:h-40 lg:w-[200px] lg:h-[200px] rounded-md md:rounded-lg overflow-hidden flex items-center justify-center relative border-2 md:border-4 border-transparent group-hover:border-white transition-all duration-300"
            style={{
              background: 'linear-gradient(180deg, #22C55E 0%, #EAB308 20%, #EC4899 40%, #A855F7 60%, #3B82F6 100%)'
            }}
          >
            {/* Texto "Infantil" Branco com Borda Vermelha */}
            <div 
              className="text-white font-black text-base md:text-2xl lg:text-4xl text-center px-3 py-2 md:px-6 md:py-3 rounded-md md:rounded-lg"
              style={{
                backgroundColor: 'rgba(229, 9, 20, 0.9)',
                border: '2px solid white',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)'
              }}
            >
              Infantil
            </div>
          </div>
          <span className="text-gray-400 text-sm md:text-base lg:text-xl transition-colors duration-300 group-hover:text-white">
            Infantil
          </span>
        </button>

        {/* Add Profile Button - Cinza com + */}
        <button
          onClick={onManageProfiles}
          className="group flex flex-col items-center gap-2 md:gap-4 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
        >
          <div className="w-24 h-24 md:w-40 md:h-40 lg:w-[200px] lg:h-[200px] bg-[#404040] rounded-md md:rounded-lg overflow-hidden flex items-center justify-center relative border-2 md:border-4 border-transparent group-hover:border-white transition-all duration-300">
            {/* Símbolo + */}
            <svg className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="35" fill="#1A1A1A" />
              <line x1="40" y1="20" x2="40" y2="60" stroke="#808080" strokeWidth="6" strokeLinecap="round" />
              <line x1="20" y1="40" x2="60" y2="40" stroke="#808080" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <span className="text-gray-400 text-sm md:text-base lg:text-xl transition-colors duration-300 group-hover:text-white text-center">
            Adicionar
          </span>
        </button>

        {/* Edit Profile Button - Cinza com lápis */}
        <button
          onClick={onManageProfiles}
          className="group flex flex-col items-center gap-2 md:gap-4 transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation"
        >
          <div className="w-24 h-24 md:w-40 md:h-40 lg:w-[200px] lg:h-[200px] bg-[#404040] rounded-md md:rounded-lg overflow-hidden flex items-center justify-center relative border-2 md:border-4 border-transparent group-hover:border-white transition-all duration-300">
            {/* Símbolo de lápis */}
            <svg className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20" viewBox="0 0 24 24" fill="none" stroke="#808080" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
          </div>
          <span className="text-gray-400 text-sm md:text-base lg:text-xl transition-colors duration-300 group-hover:text-white">
            Editar
          </span>
        </button>
      </div>

      {/* Manage Profiles Button - Hidden on mobile, shown on desktop */}
      <button
        onClick={onManageProfiles}
        className="hidden md:block px-6 md:px-8 py-2 md:py-3 border-2 border-gray-500 hover:border-white text-gray-400 hover:text-white text-base md:text-xl transition-all duration-300 hover:scale-105 active:scale-95"
      >
        Gerenciar perfis
      </button>
    </div>
  );
}
