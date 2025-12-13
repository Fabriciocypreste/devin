import React, { useState } from 'react';

interface TeamLogoProps {
  src?: string | null;
  alt: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

/**
 * Componente de Logo de Time com Fallback
 * Exibe a logo do time, e caso falhe, mostra:
 * 1. Primeira letra do nome do time em destaque
 * 2. Ícone SVG de escudo genérico
 */
export function TeamLogo({ src, alt, size = 'md', className = '' }: TeamLogoProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Tamanhos predefinidos
  const sizes = {
    xs: 'w-5 h-5',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32',
  };

  const containerSize = sizes[size];
  
  // Extrair primeira letra do nome do time
  const initial = alt.charAt(0).toUpperCase();

  // Se não tem src OU se deu erro ao carregar
  const showFallback = !src || imageError;

  return (
    <div className={`relative ${containerSize} flex items-center justify-center ${className}`}>
      {!showFallback && (
        <>
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-white/10 animate-pulse rounded-full" />
          )}
          
          {/* Imagem real */}
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
            onError={() => {
              console.log(`⚠️ Erro ao carregar logo: ${alt}`);
              setImageError(true);
            }}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />
        </>
      )}

      {/* Fallback: Escudo com inicial */}
      {showFallback && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* SVG de escudo de futebol */}
          <svg
            viewBox="0 0 100 120"
            className="w-full h-full"
            fill="none"
          >
            {/* Escudo externo */}
            <path
              d="M50 5 L90 20 L90 55 Q90 85 50 115 Q10 85 10 55 L10 20 Z"
              fill="url(#shieldGradient)"
              stroke="#FFD700"
              strokeWidth="2"
            />
            
            {/* Gradiente do escudo */}
            <defs>
              <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1a1a1a" />
                <stop offset="100%" stopColor="#0a0a0a" />
              </linearGradient>
            </defs>
            
            {/* Linhas decorativas */}
            <path
              d="M50 20 L50 100"
              stroke="#FFD700"
              strokeWidth="1"
              opacity="0.3"
            />
            <path
              d="M30 40 L70 40"
              stroke="#FFD700"
              strokeWidth="1"
              opacity="0.3"
            />
            <path
              d="M30 60 L70 60"
              stroke="#FFD700"
              strokeWidth="1"
              opacity="0.3"
            />
            
            {/* Inicial do time */}
            <text
              x="50"
              y="70"
              textAnchor="middle"
              fontSize="45"
              fontWeight="black"
              fill="#FFD700"
              fontFamily="Arial, sans-serif"
            >
              {initial}
            </text>
          </svg>
        </div>
      )}
    </div>
  );
}

/**
 * Variante simplificada - apenas inicial com fundo colorido
 */
export function TeamLogoSimple({ src, alt, size = 'md', className = '' }: TeamLogoProps) {
  const [imageError, setImageError] = useState(false);

  const sizes = {
    xs: 'w-5 h-5 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-12 h-12 text-base',
    lg: 'w-20 h-20 text-2xl',
    xl: 'w-32 h-32 text-5xl',
  };

  const containerSize = sizes[size];
  const initial = alt.charAt(0).toUpperCase();

  if (!src || imageError) {
    // Fallback: círculo com inicial
    return (
      <div 
        className={`${containerSize} rounded-full bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center font-black text-black ${className}`}
      >
        {initial}
      </div>
    );
  }

  return (
    <div className={`relative ${containerSize} flex items-center justify-center ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
        onError={() => setImageError(true)}
        loading="lazy"
      />
    </div>
  );
}
