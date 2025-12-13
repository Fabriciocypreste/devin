import React, { useState, useEffect, useRef } from 'react';

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

// Tiny placeholder blur image (base64 low-res version)
const BLUR_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMWExYTFhO3N0b3Atb3BhY2l0eToxIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojMGEwYTBhO3N0b3Atb3BhY2l0eToxIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  priority?: boolean; // Desativa lazy loading para imagens críticas
  quality?: number; // Qualidade da imagem (1-100)
  blur?: boolean; // Ativar placeholder blur
  responsive?: boolean; // Gerar srcset responsivo
  sizes?: string; // Atributo sizes para responsive images
  cdnOptimize?: boolean; // Usar otimização CDN
}

/**
 * Componente otimizado de imagem com:
 * - Lazy loading automático
 * - Blur placeholder durante carregamento
 * - Otimização via CDN (WebP/AVIF)
 * - Responsive images (srcset)
 * - Cache control
 * - Fallback em caso de erro
 * - IntersectionObserver para carregamento inteligente
 */
export function ImageWithFallback({
  src,
  alt = '',
  priority = false,
  quality = 80,
  blur = true,
  responsive = true,
  sizes,
  cdnOptimize = true,
  className,
  style,
  onLoad,
  onError,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Se priority, já está em view
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Otimizar URL com CDN
  const optimizeImageUrl = (url: string, width?: number): string => {
    if (!url || !cdnOptimize) return url;

    // Se já é uma URL otimizada, retorna
    if (url.includes('cdn-cgi/image') || url.includes('data:image')) {
      return url;
    }

    // URLs do TMDB já são otimizadas
    if (url.includes('image.tmdb.org')) {
      return url;
    }

    // Para URLs do chemorena.com, aplicar otimização CDN
    if (url.includes('chemorena.com')) {
      try {
        // Garantir que a URL usa HTTPS
        const secureUrl = url.replace('http://', 'https://');
        
        const baseUrl = 'https://chemorena.com/cdn-cgi/image/';
        const params = [
          `quality=${quality}`,
          'format=auto', // Auto-detecta WebP/AVIF
          width ? `width=${width}` : '',
          'fit=scale-down'
        ].filter(Boolean).join(',');
        
        // Remove o domínio da URL original para evitar duplicação
        const imagePath = secureUrl.replace('https://chemorena.com/', '');
        return `${baseUrl}${params}/${imagePath}`;
      } catch (error) {
        // Se der erro na otimização, retornar URL original com HTTPS
        return url.replace('http://', 'https://');
      }
    }

    // Garantir HTTPS em outras URLs
    return url.replace('http://', 'https://');
  };

  // Gerar srcset para imagens responsivas
  const generateSrcSet = (url: string): string | undefined => {
    if (!url || !responsive || url.includes('data:image')) return undefined;

    const widths = [320, 640, 768, 1024, 1280, 1920];
    return widths
      .map(width => `${optimizeImageUrl(url, width)} ${width}w`)
      .join(', ');
  };

  // IntersectionObserver para lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Começar a carregar 50px antes de aparecer
        threshold: 0.01
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [priority]);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.debug('Image load error:', src);
    setDidError(true);
    onError?.(e);
  };

  // Se deu erro, mostrar fallback
  if (didError || !src) {
    return (
      <div
        className={`inline-block bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] text-center align-middle ${className ?? ''}`}
        style={style}
      >
        <div className="flex items-center justify-center w-full h-full opacity-30">
          <img 
            src={ERROR_IMG_SRC} 
            alt="Erro ao carregar imagem" 
            {...rest} 
            data-original-url={src} 
          />
        </div>
      </div>
    );
  }

  const optimizedSrc = optimizeImageUrl(src);
  const srcSet = generateSrcSet(src);
  const imageSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  return (
    <div className={`relative overflow-hidden ${className ?? ''}`} style={style}>
      {/* Blur Placeholder */}
      {blur && !isLoaded && (
        <img
          src={BLUR_PLACEHOLDER}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            opacity: isLoaded ? 0 : 1
          }}
        />
      )}

      {/* Main Image */}
      <img
        ref={imgRef}
        src={isInView ? optimizedSrc : BLUR_PLACEHOLDER}
        srcSet={isInView && srcSet ? srcSet : undefined}
        sizes={isInView && srcSet ? imageSizes : undefined}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={`w-full h-full object-cover ${className ?? ''}`}
        style={{
          ...style,
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.5s ease-out'
        }}
        onLoad={handleLoad}
        onError={handleError}
        {...rest}
      />

      {/* Loading Skeleton */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a1a] via-[#2a2a2a] to-[#1a1a1a] animate-pulse" />
      )}
    </div>
  );
}

/**
 * Componente específico para Banners (Hero)
 * Otimizado para LCP (Largest Contentful Paint)
 */
export function HeroBanner({
  src,
  alt = 'Banner',
  className,
  ...rest
}: Omit<ImageWithFallbackProps, 'priority' | 'blur' | 'responsive'>) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      priority={true} // Sempre carregar imediatamente
      blur={true}
      responsive={true}
      quality={90} // Qualidade alta para banners
      sizes="100vw"
      className={className}
      {...rest}
    />
  );
}

/**
 * Componente específico para Thumbnails de Filmes/Séries
 */
export function MovieThumbnail({
  src,
  alt = 'Thumbnail',
  className,
  ...rest
}: Omit<ImageWithFallbackProps, 'priority' | 'blur' | 'responsive'>) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      priority={false}
      blur={true}
      responsive={true}
      quality={75} // Qualidade média para thumbnails
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
      className={className}
      {...rest}
    />
  );
}

/**
 * Componente específico para Avatares/Logos
 */
export function Avatar({
  src,
  alt = 'Avatar',
  className,
  ...rest
}: Omit<ImageWithFallbackProps, 'priority' | 'blur' | 'responsive'>) {
  return (
    <ImageWithFallback
      src={src}
      alt={alt}
      priority={false}
      blur={false} // Avatares pequenos não precisam de blur
      responsive={false}
      quality={85}
      cdnOptimize={true}
      className={className}
      {...rest}
    />
  );
}
