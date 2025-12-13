/**
 * ========================================
 * 🎬 REDFLIX - IPTV SERVICE
 * ========================================
 * 
 * Serviço simples e direto para carregar filmes/séries/canais
 * do arquivo remoto filmes.txt usando CORS proxies.
 * 
 * FONTE: https://chemorena.com/filmes/filmes.txt
 * 
 * Este é um serviço alternativo/fallback ao sistema Supabase.
 * Mais leve, sem cache, sem backend, parsing direto no cliente.
 */

import { Movie } from '../types';

// URL da lista M3U remota
const IPTV_LIST_URL = 'https://chemorena.com/filmes/filmes.txt';

/**
 * Lista de proxies CORS para tentar em ordem
 * Isso garante resiliência caso um proxy esteja fora do ar
 */
const CORS_PROXIES = [
  'https://api.allorigins.win/raw?url=',  // Primário
  'https://corsproxy.io/?',               // Fallback
];

/**
 * Faz o parsing do conteúdo M3U e converte para array de Movies
 * 
 * Formato esperado:
 * #EXTINF:-1 tvg-id="" tvg-name="TÍTULO" tvg-logo="URL" group-title="CATEGORIA",TÍTULO
 * http://exemplo.com/video.mp4
 * 
 * @param textData - Conteúdo texto do arquivo M3U
 * @returns Array de objetos Movie
 */
const parseM3UData = (textData: string): Movie[] => {
  const lines = textData
    .split('\n')
    .filter(line => line.trim() !== '' && !line.startsWith('#EXTM3U'));
  
  const movies: Movie[] = [];

  // Processa em pares: linha de info + linha de URL
  for (let i = 0; i < lines.length; i += 2) {
    const infoLine = lines[i];
    const streamUrl = lines[i + 1];

    // Valida se é uma entrada válida
    if (!infoLine || !streamUrl || !infoLine.startsWith('#EXTINF')) {
      continue; // Pula entradas malformadas
    }
    
    // Extrai logo
    const logoMatch = infoLine.match(/tvg-logo="([^"]*)"/);
    const logoUrl = logoMatch ? logoMatch[1] : `https://picsum.photos/seed/${i}/244/137`;
    
    // Extrai categoria
    const categoryMatch = infoLine.match(/group-title="([^"]*)"/);
    const category = categoryMatch ? categoryMatch[1].trim() : 'Geral';
    
    // Extrai título (depois da última vírgula)
    const title = infoLine.split(',').pop()?.trim() || 'Sem Título';
    
    // Extrai ano (se houver no título)
    const yearMatch = title.match(/\((\d{4})\)/);
    const year = yearMatch ? parseInt(yearMatch[1]) : 0;
    
    // Valida URL do stream
    if (streamUrl && streamUrl.trim()) {
      movies.push({
        id: `movie-${i}-${Date.now()}`, // ID único
        category,
        title,
        logoUrl,
        streamUrl: streamUrl.trim(),
        year,
      });
    }
  }

  // Log de debug
  if (movies.length === 0) {
    console.warn('⚠️ iptvService: Nenhum filme encontrado após parsing. Verifique o formato do M3U.');
  } else {
    console.log(`✅ iptvService: ${movies.length} itens parseados com sucesso`);
  }

  return movies;
};

/**
 * Busca e parseia a lista de filmes usando CORS proxies
 * Tenta cada proxy em ordem até conseguir sucesso
 * 
 * @returns Promise<Movie[]> - Array de filmes parseados
 * @throws Error se todos os proxies falharem
 */
export const fetchAndParseMovies = async (): Promise<Movie[]> => {
  let lastError: Error | null = null;

  // Tenta cada proxy em ordem
  for (const proxy of CORS_PROXIES) {
    const proxiedUrl = `${proxy}${encodeURIComponent(IPTV_LIST_URL)}`;
    
    try {
      console.log(`🔄 iptvService: Tentando fetch via ${proxy}...`);
      
      const response = await fetch(proxiedUrl);

      // Valida status HTTP
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const textData = await response.text();

      // Valida resposta vazia
      if (!textData.trim()) {
        throw new Error('Resposta vazia do proxy');
      }

      // Parseia os dados
      const movies = parseM3UData(textData);
      
      console.log(`✅ iptvService: Sucesso com ${proxy} - ${movies.length} filmes`);
      return movies;

    } catch (error) {
      console.warn(`❌ iptvService: Falha com ${proxy}:`, error);
      lastError = error as Error;
      // Continua para o próximo proxy
    }
  }

  // Se chegou aqui, todos os proxies falharam - tentar fallback local
  console.warn('⚠️ iptvService: Todos os proxies falharam, tentando fallback local...');
  
  try {
    console.log('🔄 iptvService: Tentando carregar /data/lista.m3u local...');
    const response = await fetch('/data/lista.m3u');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const textData = await response.text();
    const movies = parseM3UData(textData);
    
    console.log(`✅ iptvService: Fallback local bem-sucedido - ${movies.length} canais`);
    return movies;
    
  } catch (localError) {
    console.error('❌ iptvService: Fallback local também falhou:', localError);
  }

  // Se tudo falhou
  console.error('❌ iptvService: Todos os métodos falharam', lastError);
  throw lastError || new Error('Não foi possível carregar os dados. Verifique sua conexão.');
};

/**
 * Busca filmes/séries/canais e organiza por categoria
 * 
 * @returns Promise com objeto contendo categorias organizadas
 */
export const fetchMoviesByCategory = async () => {
  const allMovies = await fetchAndParseMovies();
  
  // Agrupa por categoria
  const categories: { [key: string]: Movie[] } = {};
  
  allMovies.forEach(movie => {
    const cat = movie.category || 'Sem Categoria';
    if (!categories[cat]) {
      categories[cat] = [];
    }
    categories[cat].push(movie);
  });
  
  console.log(`📊 iptvService: ${Object.keys(categories).length} categorias organizadas`);
  
  return {
    movies: allMovies,
    categories,
    total: allMovies.length,
  };
};

/**
 * Detecta o tipo de conteúdo baseado na categoria e nome
 * 
 * @param movie - Objeto Movie
 * @returns 'movie' | 'tv' | 'channel'
 */
export const detectContentType = (movie: Movie): 'movie' | 'tv' | 'channel' => {
  const category = movie.category.toLowerCase();
  const title = movie.title.toLowerCase();
  
  // Detecta canais IPTV
  const channelKeywords = ['canal', 'tv', 'channel', 'ao vivo', 'live'];
  if (channelKeywords.some(k => category.includes(k) || title.includes(k))) {
    return 'channel';
  }
  
  // Detecta séries
  const seriesKeywords = ['serie', 'series', 'temporada', 'season', 'episodio', 'episode'];
  if (seriesKeywords.some(k => category.includes(k) || title.includes(k))) {
    return 'tv';
  }
  
  // Padrão: filme
  return 'movie';
};

/**
 * Valida se um streamUrl é MP4 ou M3U8
 * 
 * @param url - URL do stream
 * @returns true se for formato válido
 */
export const isValidStreamFormat = (url: string): boolean => {
  const lower = url.toLowerCase();
  return lower.endsWith('.mp4') || 
         lower.endsWith('.m3u8') || 
         lower.includes('.mp4?') ||
         lower.includes('.m3u8?');
};

/**
 * Filtra apenas streams válidos (MP4 ou M3U8)
 * 
 * @param movies - Array de filmes
 * @returns Array filtrado com apenas streams válidos
 */
export const filterValidStreams = (movies: Movie[]): Movie[] => {
  return movies.filter(movie => isValidStreamFormat(movie.streamUrl));
};