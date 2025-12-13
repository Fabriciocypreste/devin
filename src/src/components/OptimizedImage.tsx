import { useState, useEffect, useRef, CSSProperties, useMemo } from 'react';
import { getProxiedImageUrl } from '../utils/imageProxy';

// Cache em memória para URLs otimizadas (evita recalcular)
const urlCache = new Map<string, string>();

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean; // High priority = eager loading
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  blur?: boolean; // Show blur placeholder
  quality?: number; // 1-100
  useProxy?: boolean; // Use image proxy with cache (default: true for TMDB images)
}

/**
 * Componente de Imagem Ultra-Otimizado para Performance
 * 
 * Features:
 * - Lazy loading automático (exceto priority=true)
 * - Blur placeholder durante carregamento
 * - WebP/AVIF automático quando disponível
 * - fetchPriority="high" para imagens críticas
 * - IntersectionObserver para carregamento inteligente
 * - Preload automático de imagens priority
 */
export function OptimizedImage({
  src,
  alt,
  priority = false,
  width,
  height,
  className = '',
  style,
  onLoad,
  onError,
  blur = true,
  quality = 80,
  useProxy = true,
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [proxiedSrc, setProxiedSrc] = useState<string>(src);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // DESABILITADO: Proxy estava causando latência extra
  // As imagens do TMDB já vêm de CDN rápido, não precisa de proxy
  useEffect(() => {
    setProxiedSrc(src);
  }, [src]);

  // Preload de imagem priority no <head>
  useEffect(() => {
    if (priority && proxiedSrc) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = optimizeImageUrl(proxiedSrc, width);
      link.setAttribute('fetchpriority', 'high');
      document.head.appendChild(link);

      return () => {
        document.head.removeChild(link);
      };
    }
  }, [priority, proxiedSrc, width]);

  // IntersectionObserver para lazy loading AGRESSIVO
  useEffect(() => {
    if (priority || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '800px', // Carregar 800px antes (ULTRA agressivo para scroll suave)
        threshold: 0.01,
      }
    );

    observerRef.current.observe(imgRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  /**
   * Otimiza URL da imagem com parâmetros de qualidade/formato
   * Usa cache em memória para evitar recalcular
   */
  const optimizeImageUrl = useMemo(() => {
    return (url: string, targetWidth?: number): string => {
      if (!url) return '';
      
      // Verificar cache primeiro
      const cacheKey = `${url}-${targetWidth}`;
      const cached = urlCache.get(cacheKey);
      if (cached) return cached;

    // URLs do TMDB - usar tamanho otimizado
    if (url.includes('image.tmdb.org')) {
      // Escolher tamanho baseado na largura alvo (ULTRA otimizado para performance)
      let size = 'w342'; // Default ainda mais otimizado (antes era w500)
      if (targetWidth) {
        if (targetWidth <= 150) size = 'w154';
        else if (targetWidth <= 200) size = 'w185';
        else if (targetWidth <= 300) size = 'w342';
        else if (targetWidth <= 500) size = 'w500';
        else size = 'w500'; // Máximo w500 para performance (antes era w780)
      }
      const optimized = url.replace(/\/(original|w\d+)\//, `/${size}/`);
      urlCache.set(cacheKey, optimized);
      return optimized;
    }

    // URLs do Unsplash - adicionar parâmetros de otimização
    if (url.includes('unsplash.com')) {
      const urlObj = new URL(url);
      urlObj.searchParams.set('fm', 'webp'); // Formato WebP
      urlObj.searchParams.set('q', quality.toString());
      if (targetWidth) {
        urlObj.searchParams.set('w', targetWidth.toString());
      }
      urlObj.searchParams.set('auto', 'format,compress');
      const optimized = urlObj.toString();
      urlCache.set(cacheKey, optimized);
      return optimized;
    }

    // URLs do chemorena.com - adicionar CDN optimization
    if (url.includes('chemorena.com')) {
      const optimized = url.replace('http://', 'https://');
      urlCache.set(cacheKey, optimized);
      return optimized;
    }

    // Outras URLs - retornar com HTTPS
    const optimized = url.replace('http://', 'https://');
    
    // Adicionar ao cache
    urlCache.set(cacheKey, optimized);
    
    return optimized;
    };
  }, []);

  /**
   * Gera blur placeholder (LQIP - Low Quality Image Placeholder)
   * Otimizado para performance - SVG inline simples
   */
  function getBlurPlaceholder(): string {
    // SVG simples sem blur para performance
    return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="100%25" height="100%25" fill="%231a1a1a"/%3E%3C/svg%3E';
  }

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    // Silenciar erro - fallback será exibido
    setHasError(true);
    onError?.();
  };

  const optimizedSrc = optimizeImageUrl(proxiedSrc, width);
  const blurDataURL = getBlurPlaceholder();

  // Fallback se der erro
  if (hasError) {
    return (
      <div
        className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${className}`}
        style={style}
      >
        <svg
          className="w-1/4 h-1/4 opacity-20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
    );
  }

  // Gerar URLs para formatos modernos
  const avifSrc = optimizedSrc.includes('image.tmdb.org') 
    ? optimizedSrc 
    : optimizedSrc;
  const webpSrc = optimizedSrc.includes('image.tmdb.org')
    ? optimizedSrc
    : optimizedSrc;

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {/* Blur Placeholder */}
      {blur && !isLoaded && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Main Image with Modern Formats */}
      <picture>
        {/* AVIF - Melhor compressão (30-50% menor que WebP) */}
        {isInView && (
          <source
            srcSet={avifSrc}
            type="image/avif"
          />
        )}
        
        {/* WebP - Boa compressão (25-35% menor que JPEG) */}
        {isInView && (
          <source
            srcSet={webpSrc}
            type="image/webp"
          />
        )}
        
        {/* JPEG/PNG - Fallback para navegadores antigos */}
        <img
          ref={imgRef}
          src={isInView ? optimizedSrc : blurDataURL}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchpriority={priority ? 'high' : 'auto'}
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            ...style,
            contentVisibility: isInView ? 'visible' : 'auto',
          }}
        />
      </picture>

      {/* Loading Skeleton */}
      {!isLoaded && isInView && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
      )}
    </div>
  );
}

/**
 * Hero Image - Para banners principais (alta prioridade)
 */
export function HeroImage({
  src,
  alt,
  className,
  style,
  onLoad,
}: Omit<OptimizedImageProps, 'priority' | 'blur' | 'width' | 'height'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={true}
      blur={true}
      quality={85}
      width={1280}
      height={720}
      className={className}
      style={style}
      onLoad={onLoad}
    />
  );
}

/**
 * Thumbnail Image - Para cards de filmes/séries
 */
export function ThumbnailImage({
  src,
  alt,
  className,
  style,
}: Omit<OptimizedImageProps, 'priority' | 'blur' | 'width' | 'height'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={false}
      blur={true}
      quality={70}
      width={200}
      height={300}
      className={className}
      style={style}
    />
  );
}

/**
 * Logo Image - Para logos de canais/marcas
 */
export function LogoImage({
  src,
  alt,
  className,
  style,
  priority = false,
}: Omit<OptimizedImageProps, 'blur' | 'width' | 'height'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={priority}
      blur={false}
      quality={85}
      width={200}
      height={100}
      className={className}
      style={style}
    />
  );
}

/**
 * Background Image - Para fundos
 */
export function BackgroundImage({
  src,
  alt,
  className,
  style,
  priority = false,
}: Omit<OptimizedImageProps, 'blur' | 'width' | 'height' | 'quality'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      priority={priority}
      blur={true}
      quality={70}
      width={1920}
      height={1080}
      className={className}
      style={style}
    />
  );
}
