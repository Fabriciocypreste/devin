/**
 * Utilitários para detecção e otimização de formatos de imagem modernos
 */

/**
 * Detecta se o navegador suporta formatos modernos
 */
export const browserSupportsFormat = {
  avif: false,
  webp: false,
};

// Detectar suporte a AVIF
if (typeof window !== 'undefined') {
  const avifTest = new Image();
  avifTest.onload = () => {
    browserSupportsFormat.avif = true;
  };
  avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgANogQEAwgMg8f8D///8WfhwB8+ErK42A=';

  // Detectar suporte a WebP
  const webpTest = new Image();
  webpTest.onload = () => {
    browserSupportsFormat.webp = true;
  };
  webpTest.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
}

/**
 * Retorna o melhor formato suportado pelo navegador
 */
export function getBestImageFormat(): 'avif' | 'webp' | 'jpeg' {
  if (browserSupportsFormat.avif) return 'avif';
  if (browserSupportsFormat.webp) return 'webp';
  return 'jpeg';
}

/**
 * Converte URL do TMDB para formato otimizado
 */
export function getOptimizedImageUrl(
  url: string,
  format: 'avif' | 'webp' | 'jpeg' = 'jpeg'
): string {
  if (!url || !url.includes('image.tmdb.org')) {
    return url;
  }

  // TMDB já serve imagens otimizadas via CDN
  // Podemos adicionar parâmetros de formato se necessário
  return url;
}

/**
 * Estima o tamanho do arquivo baseado no formato e dimensões
 */
export function estimateFileSize(
  width: number,
  height: number,
  format: 'avif' | 'webp' | 'jpeg' | 'png'
): number {
  const pixels = width * height;
  
  // Estimativas baseadas em compressão típica (bytes por pixel)
  const bytesPerPixel = {
    avif: 0.1,  // Melhor compressão
    webp: 0.15, // Boa compressão
    jpeg: 0.25, // Compressão média
    png: 1.5,   // Sem compressão com perdas
  };

  return Math.round(pixels * bytesPerPixel[format]);
}

/**
 * Verifica se o tamanho do arquivo está dentro dos limites
 */
export function isWithinSizeLimit(
  width: number,
  height: number,
  format: 'avif' | 'webp' | 'jpeg' | 'png',
  type: 'thumbnail' | 'banner' | 'logo'
): boolean {
  const limits = {
    thumbnail: 150 * 1024,  // 150KB
    banner: 500 * 1024,     // 500KB
    logo: 50 * 1024,        // 50KB
  };

  const estimatedSize = estimateFileSize(width, height, format);
  return estimatedSize <= limits[type];
}

/**
 * Recomenda o melhor tamanho e formato para um tipo de imagem
 */
export function getRecommendedImageSettings(type: 'thumbnail' | 'banner' | 'logo' | 'poster'): {
  maxWidth: number;
  maxHeight: number;
  format: 'avif' | 'webp' | 'jpeg';
  quality: number;
} {
  const settings = {
    thumbnail: {
      maxWidth: 154,
      maxHeight: 231,
      format: 'webp' as const,
      quality: 75,
    },
    banner: {
      maxWidth: 1280,
      maxHeight: 720,
      format: 'webp' as const,
      quality: 80,
    },
    logo: {
      maxWidth: 200,
      maxHeight: 200,
      format: 'webp' as const,
      quality: 90,
    },
    poster: {
      maxWidth: 342,
      maxHeight: 513,
      format: 'webp' as const,
      quality: 80,
    },
  };

  return settings[type];
}

/**
 * Gera srcset para imagens responsivas
 */
export function generateSrcSet(baseUrl: string, widths: number[]): string {
  return widths
    .map(width => {
      const url = baseUrl.replace(/\/w\d+\//, `/w${width}/`);
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Gera sizes attribute para imagens responsivas
 */
export function generateSizes(breakpoints: { maxWidth: string; size: string }[]): string {
  return breakpoints
    .map((bp, index) => {
      if (index === breakpoints.length - 1) {
        return bp.size;
      }
      return `(max-width: ${bp.maxWidth}) ${bp.size}`;
    })
    .join(', ');
}

/**
 * Configurações de responsive images para diferentes componentes
 */
export const responsiveImageConfig = {
  poster: {
    widths: [154, 185, 342, 500],
    sizes: generateSizes([
      { maxWidth: '640px', size: '154px' },
      { maxWidth: '768px', size: '185px' },
      { maxWidth: '1024px', size: '342px' },
      { maxWidth: '1280px', size: '342px' },
    ]),
  },
  backdrop: {
    widths: [780, 1280],
    sizes: generateSizes([
      { maxWidth: '1024px', size: '780px' },
      { maxWidth: '1920px', size: '1280px' },
    ]),
  },
  thumbnail: {
    widths: [92, 154],
    sizes: generateSizes([
      { maxWidth: '640px', size: '92px' },
      { maxWidth: '1280px', size: '154px' },
    ]),
  },
};

/**
 * Performance metrics para diferentes formatos
 */
export const formatPerformance = {
  avif: {
    compressionRatio: 0.5,  // 50% do tamanho JPEG
    decodingSpeed: 'slow',
    support: 'modern',
  },
  webp: {
    compressionRatio: 0.7,  // 70% do tamanho JPEG
    decodingSpeed: 'fast',
    support: 'wide',
  },
  jpeg: {
    compressionRatio: 1.0,
    decodingSpeed: 'fastest',
    support: 'universal',
  },
};

/**
 * Log de performance de carregamento de imagem
 */
export function logImagePerformance(
  url: string,
  format: string,
  loadTime: number,
  fileSize?: number
) {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 Image Performance:`, {
      url: url.substring(url.lastIndexOf('/') + 1),
      format,
      loadTime: `${loadTime.toFixed(0)}ms`,
      fileSize: fileSize ? `${(fileSize / 1024).toFixed(1)}KB` : 'unknown',
    });
  }
}
