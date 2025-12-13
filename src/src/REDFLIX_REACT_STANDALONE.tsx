/**
 * RedFlix - Layout da Página Inicial com Efeitos de Cards
 * Versão React Standalone - Copie este código para usar em seu projeto
 */

import React, { useState } from 'react';

// ============================================
// TIPOS
// ============================================

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
}

// ============================================
// DADOS DE EXEMPLO
// ============================================

const SAMPLE_MOVIES: Movie[] = [
  { id: 1, title: 'Venom: A Última Rodada', poster: 'https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg', rating: 6.8 },
  { id: 2, title: 'Terrifier 3', poster: 'https://image.tmdb.org/t/p/w500/7NDHoebflLwL1CcgLJ9wZbbDrmV.jpg', rating: 7.2 },
  { id: 3, title: 'Apocalipse Zumbi 2', poster: 'https://image.tmdb.org/t/p/w500/xlkclSE4aq7r3JsFIJRgs21zUew.jpg', rating: 6.5 },
  { id: 4, title: 'Gladiador II', poster: 'https://image.tmdb.org/t/p/w500/2cxhvwyEwRlysAmRH4iodkvo0z5.jpg', rating: 7.5 },
  { id: 5, title: 'Robô Selvagem', poster: 'https://image.tmdb.org/t/p/w500/8dkuf9IuVh0VZjDTk7kAY67lU0U.jpg', rating: 8.1 },
  { id: 6, title: 'Moana 2', poster: 'https://image.tmdb.org/t/p/w500/m3TGJNSem6qHoD1D0iH26lQtGQm.jpg', rating: 7.0 },
  { id: 7, title: 'Deadpool & Wolverine', poster: 'https://image.tmdb.org/t/p/w500/9TFSqghEHrlBMRR63yTx80Orxva.jpg', rating: 7.8 },
  { id: 8, title: 'Coringa: Delírio a Dois', poster: 'https://image.tmdb.org/t/p/w500/byDXrm0pY6vSGCjFZfURHCGndMz.jpg', rating: 5.9 },
  { id: 9, title: 'Wicked', poster: 'https://image.tmdb.org/t/p/w500/xDGbZ0JJ3mYaGKy4Nzd9Kph6M9L.jpg', rating: 7.6 },
  { id: 10, title: 'Red One', poster: 'https://image.tmdb.org/t/p/w500/cdqLnri3NEGcmfnqwk2TSIYtddg.jpg', rating: 6.7 },
  { id: 11, title: 'Operação Natal', poster: 'https://image.tmdb.org/t/p/w500/fQVequbGPlPlZU3omOGQ2DKlV3.jpg', rating: 6.4 },
  { id: 12, title: 'Arcane', poster: 'https://image.tmdb.org/t/p/w500/abf8tHznhSvl9BAElD2cQeRr7do.jpg', rating: 8.7 },
  { id: 13, title: 'Sonic 3', poster: 'https://image.tmdb.org/t/p/w500/d8Ryb8AunYAujoRinca6pZREsJJ.jpg', rating: 7.9 },
  { id: 14, title: 'Armor', poster: 'https://image.tmdb.org/t/p/w500/pnXLFioDeftqjlCVlRmXvIdMsdP.jpg', rating: 5.5 },
];

// ============================================
// COMPONENTE: HEADER
// ============================================

function NetflixHeader({ isScrolled }: { isScrolled: boolean }) {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-[#141414]' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-12 h-16 md:h-[68px]">
        {/* Logo + Menu */}
        <div className="flex items-center gap-3 md:gap-10">
          <img
            src="http://chemorena.com/redfliz.png"
            alt="RedFlix"
            className="h-6 md:h-8 cursor-pointer hover:opacity-80 transition-opacity"
          />
          
          <nav className="hidden lg:flex items-center gap-5">
            <button className="text-sm text-white font-semibold">Início</button>
            <button className="text-sm text-gray-300 hover:text-gray-200 transition-colors">Séries</button>
            <button className="text-sm text-gray-300 hover:text-gray-200 transition-colors">Filmes</button>
            <button className="text-sm text-gray-300 hover:text-gray-200 transition-colors">Bombando</button>
            <button className="text-sm text-gray-300 hover:text-gray-200 transition-colors">Minha lista</button>
          </nav>
        </div>
        
        {/* Right Icons */}
        <div className="flex items-center gap-3 md:gap-6">
          {/* Search */}
          <button className="text-white hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>
          
          {/* Profile */}
          <div className="w-7 h-7 md:w-8 md:h-8 bg-[#E50914] rounded flex items-center justify-center cursor-pointer">
            <svg className="w-4 h-4 md:w-5 md:h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

// ============================================
// COMPONENTE: HERO SLIDER
// ============================================

function HeroSlider() {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(https://image.tmdb.org/t/p/original/628Dep6AxEtDxjZoGP78TsOxYbK.jpg)' }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-4 md:px-12 lg:px-16">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
            Gladiador II
          </h1>
          
          <div className="flex gap-2 mb-4">
            <span className="text-white text-lg">Ação</span>
            <span className="text-white text-lg">•</span>
            <span className="text-white text-lg">Aventura</span>
            <span className="text-white text-lg">•</span>
            <span className="text-white text-lg">Drama</span>
          </div>
          
          <p className="text-white text-lg md:text-xl mb-8 line-clamp-3 drop-shadow-lg max-w-xl">
            Anos após testemunhar a morte do reverenciado herói Maximus pelas mãos de seu tio, 
            Lucius é forçado a entrar no Coliseu depois que sua casa é conquistada pelos 
            imperadores tiranos que agora lideram Roma.
          </p>
          
          <div className="flex gap-4">
            <button className="bg-white hover:bg-gray-200 text-black px-8 py-3 rounded flex items-center gap-2 transition-all hover:scale-105 font-semibold active:scale-95">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              Assistir
            </button>
            
            <button className="bg-gray-500/70 hover:bg-gray-500/90 text-white px-8 py-3 rounded flex items-center gap-2 transition-all hover:scale-105 font-semibold backdrop-blur-sm active:scale-95">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              Mais Info
            </button>
          </div>
        </div>
      </div>
      
      {/* Slide Indicators */}
      <div className="absolute bottom-8 right-8 flex gap-2 z-20">
        <div className="w-12 h-1 bg-white rounded-full"></div>
        <div className="w-8 h-1 bg-white/50 rounded-full"></div>
        <div className="w-8 h-1 bg-white/50 rounded-full"></div>
      </div>
    </section>
  );
}

// ============================================
// COMPONENTE: MOVIE CARD
// ============================================

function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="group relative cursor-pointer">
      <div className="relative rounded overflow-hidden shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:z-50">
        {/* Poster */}
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-auto aspect-[2/3] object-cover"
          loading="lazy"
        />
        
        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Title */}
            <h3 className="text-white font-bold text-sm mb-2 line-clamp-2">{movie.title}</h3>
            
            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-white text-xs font-semibold">{movie.rating}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {/* Play */}
              <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors">
                <svg className="w-4 h-4 text-black ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              </button>
              
              {/* Add to List */}
              <button className="w-8 h-8 bg-gray-800/80 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              
              {/* Like */}
              <button className="w-8 h-8 bg-gray-800/80 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
                </svg>
              </button>
              
              {/* More Info */}
              <button className="w-8 h-8 bg-gray-800/80 border-2 border-gray-400 rounded-full flex items-center justify-center hover:border-white transition-colors ml-auto">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: CONTENT ROW
// ============================================

function ContentRow({ title, movies }: { title: string; movies: Movie[] }) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  
  return (
    <div className="mb-12 px-4 md:px-12">
      <h2 className="text-white font-bold text-xl md:text-2xl mb-4">{title}</h2>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 md:gap-4 lg:gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            onMouseEnter={() => setHoveredId(movie.id)}
            onMouseLeave={() => setHoveredId(null)}
            style={{
              filter: hoveredId !== null && hoveredId !== movie.id ? 'blur(2px)' : 'blur(0px)',
              opacity: hoveredId !== null && hoveredId !== movie.id ? 0.5 : 1,
              transition: 'all 0.3s ease',
            }}
          >
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE: STREAMING MARQUEE
// ============================================

function StreamingMarquee() {
  const logos = [
    { name: 'Netflix', url: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Logonetflix.png' },
    { name: 'Prime Video', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png' },
    { name: 'Disney+', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/640px-Disney%2B_logo.svg.png' },
    { name: 'HBO Max', url: 'https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg' },
    { name: 'Apple TV+', url: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
    { name: 'Paramount+', url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Paramount_Plus.svg' },
  ];
  
  // Triplicar para efeito infinito
  const duplicatedLogos = [...logos, ...logos, ...logos];
  
  return (
    <div className="relative w-full py-12 overflow-hidden bg-black">
      {/* Gradient Edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
      
      {/* Marquee */}
      <div className="relative flex overflow-hidden">
        <div className="flex gap-8 items-center whitespace-nowrap animate-marquee">
          {duplicatedLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="flex-shrink-0 w-36 h-24 bg-white rounded-lg flex items-center justify-center p-4 hover:scale-110 transition-transform"
            >
              <img
                src={logo.url}
                alt={logo.name}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL: APP
// ============================================

export default function RedFlixHome() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="bg-[#141414] min-h-screen">
      {/* Header */}
      <NetflixHeader isScrolled={isScrolled} />
      
      {/* Hero Slider */}
      <HeroSlider />
      
      {/* Content Section */}
      <div className="relative bg-gradient-to-b from-black via-black to-[#141414] pb-20 -mt-32">
        <ContentRow title="Em Alta Agora" movies={SAMPLE_MOVIES.slice(0, 7)} />
        <ContentRow title="Populares na RedFlix" movies={SAMPLE_MOVIES.slice(7, 14)} />
        <ContentRow title="Filmes de Ação" movies={SAMPLE_MOVIES.slice(0, 7)} />
        <ContentRow title="Comédias" movies={SAMPLE_MOVIES.slice(7, 14)} />
      </div>
      
      {/* Streaming Marquee */}
      <StreamingMarquee />
      
      {/* CSS para animação do marquee */}
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

// ============================================
// TAILWIND CONFIG (adicione ao seu tailwind.config.js)
// ============================================

/*
module.exports = {
  theme: {
    extend: {
      colors: {
        'redflix': '#E50914',
        'redflix-dark': '#B20710',
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-33.333%)' }
        }
      }
    }
  }
}
*/
