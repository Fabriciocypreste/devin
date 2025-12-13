/**
 * Pré-carrega múltiplas imagens em cache
 * 
 * @param urls Array de URLs para pré-carregar
 */
export async function preloadImages(urls: string[]): Promise<void> {
  // DESABILITADO: Edge Functions não deployadas - pré-load desabilitado
  // As imagens carregarão sob demanda diretamente do TMDB
  return;
  
  /* CÓDIGO ORIGINAL - Será reativado após deploy das Edge Functions
  const tmdbUrls = urls.filter(url => url && url.includes('image.tmdb.org'));
  
  if (tmdbUrls.length === 0) return;

  console.log(`📦 Pre-loading ${tmdbUrls.length} images to cache...`);

  // Fazer requisições em paralelo (máximo 10 por vez)
  const batchSize = 10;
  for (let i = 0; i < tmdbUrls.length; i += batchSize) {
    const batch = tmdbUrls.slice(i, i + batchSize);
    await Promise.all(
      batch.map(url => getProxiedImageUrl(url).catch(() => url))
    );
  }

  console.log(`✅ Pre-loading complete`);
  */
}