import { search, Movie } from './tmdb';
import { projectId, publicAnonKey } from './supabase/info';

export interface ContentItem {
  name: string;
  type: 'movie' | 'tv';
}

/**
 * Busca a lista de filmes/séries do arquivo externo através do servidor
 */
export async function fetchContentList(): Promise<ContentItem[]> {
  try {
    const url = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/content-list`;
    console.log('📡 Fetching content list from server:', url);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout (reduzido)
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    console.log(`📡 Server response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error fetching content list from server:', response.status, errorText);
      console.error('⚠️ The server returned an error. Using fallback content from server.');
      // Still return empty array and let server fallback handle it
      return [];
    }
    
    const data = await response.json();
    console.log('✅ Content list received:', data.items?.length || 0, 'items');
    
    if (!data.items || data.items.length === 0) {
      console.warn('⚠️ Server returned empty content list');
      return [];
    }
    
    // Identificar se é filme ou série baseado em padrões comuns
    const contentList: ContentItem[] = data.items.map((name: string) => {
      const lowerName = name.toLowerCase();
      
      // Palavras-chave que indicam filmes
      const movieKeywords = [
        'filme', 'movie', 'cinema', 'trilogia', 
        'saga', 'missão', 'operação', 'projeto'
      ];
      
      // Nomes conhecidos de filmes/franquias famosas
      const knownMovies = [
        'spirited away', 'your name', 'weathering with you', 'suzume',
        'belle', 'boy and the heron', 'a silent voice', 'clannad',
        'your lie in april', 'avengers', 'iron man', 'spider-man',
        'batman', 'superman', 'wonder woman', 'justice league',
        'star wars', 'lord of the rings', 'hobbit', 'harry potter',
        'fantastic beasts', 'matrix', 'inception', 'interstellar',
        'tenet', 'dunkirk', 'oppenheimer', 'dark knight', 'joker',
        'godfather', 'scarface', 'goodfellas', 'casino', 'shawshank',
        'forrest gump', 'pulp fiction', 'django', 'kill bill',
        'inglourious basterds', 'reservoir dogs', 'hateful eight',
        'top gun', 'mission: impossible', 'fast and furious', 'transformers',
        'jurassic', 'terminator', 'alien', 'predator', 'avatar',
        'titanic', 'gladiator', 'braveheart', 'troy', '300'
      ];
      
      // Palavras-chave que indicam séries
      const tvKeywords = [
        'temporada', 'season', 'episódio', 'episode', 'série', 'series'
      ];
      
      // Nomes conhecidos de séries famosas
      const knownTVShows = [
        'breaking bad', 'game of thrones', 'stranger things', 'the witcher',
        'the last of us', 'house of the dragon', 'the mandalorian', 'wednesday',
        'the boys', 'peaky blinders', 'money heist', 'squid game', 'vikings',
        'dark', 'narcos', 'the crown', 'ozark', 'better call saul', 'friends',
        'the office', 'black mirror', 'the walking dead', 'lucifer', 'you',
        'arcane', 'succession', 'sherlock', 'westworld', 'true detective',
        'the umbrella academy', 'euphoria', 'the bear', 'ted lasso',
        'the handmaid', 'see', 'severance', 'atlanta', 'beef', 'hawkeye',
        'yellowstone', 'rings of power', 'shogun', 'the penguin', 'fallout',
        'echo', 'the gentlemen', 'sugar', '3 body problem', 'ripley',
        'baby reindeer', 'the sympathizer', 'masters of the air', 'chernobyl',
        'the wire', 'fargo', 'twin peaks', 'lost', 'dexter',
        'the sopranos', 'mad men', 'loki', 'wandavision', 'falcon', 'winter soldier',
        'moon knight', 'she-hulk', 'ms. marvel', 'secret invasion', 'what if',
        'ahsoka', 'andor', 'boba fett', 'obi-wan', 'acolyte', 'foundation',
        'silo', 'for all mankind', 'pachinko', 'morning show', 'shrinking',
        'bad sisters', 'hijack', 'pacific', 'band of brothers', 'rome',
        'boardwalk empire', '1883', '1923', 'tulsa king', 'mayor of kingstown',
        'lioness', 'terminal list', 'reacher', 'mrs. maisel', 'the expanse',
        'wheel of time', 'peripheral', 'daisy jones', 'citadel', 'avatar',
        'one piece', 'cowboy bebop', 'death note', 'attack on titan',
        'demon slayer', 'jujutsu kaisen', 'my hero academia', 'fullmetal alchemist',
        'hunter x hunter', 'naruto', 'dragon ball', 'one punch man',
        'mob psycho', 'tokyo ghoul', 'parasyte', 'vinland saga', 'steins',
        'code geass', 'neon genesis', 'bleach', 'fairy tail', 'sword art',
        're:zero', 'shield hero', 'overlord', 'konosuba', 'slime',
        'dr. stone', 'promised neverland', 'erased', 'violet evergarden'
      ];
      
      // Verificar se é uma série conhecida
      const isTVShow = knownTVShows.some(show => lowerName.includes(show)) ||
                      tvKeywords.some(keyword => lowerName.includes(keyword));
      
      // Verificar se é filme conhecido
      const isKnownMovie = knownMovies.some(movie => lowerName.includes(movie));
      
      // Verificar se tem palavra-chave de filme
      const hasMovieKeyword = movieKeywords.some(keyword => lowerName.includes(keyword));
      
      // Lógica de decisão:
      // 1. Se é série conhecida -> TV
      // 2. Se é filme conhecido -> Movie
      // 3. Se tem keyword de filme e não de série -> Movie
      // 4. Padrão -> TV (já que a maioria do conteúdo são séries)
      let type: 'movie' | 'tv' = 'tv';
      
      if (isKnownMovie && !isTVShow) {
        type = 'movie';
      } else if (hasMovieKeyword && !isTVShow) {
        type = 'movie';
      } else if (!isTVShow && !hasMovieKeyword) {
        // Se não tem nenhum indicador, padrão é TV
        type = 'tv';
      }
      
      return {
        name,
        type
      };
    });
    
    console.log(`📋 Prepared ${contentList.length} items for TMDB lookup`);
    
    return contentList;
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('⏱️ Request timeout while fetching content list');
    } else {
      console.error('❌ Exception in fetchContentList:', error);
    }
    return [];
  }
}

/**
 * Busca os detalhes completos de cada item da lista usando a API do TMDB
 */
export async function fetchContentDetails(items: ContentItem[]): Promise<Movie[]> {
  const moviesData: Movie[] = [];
  const seenIds = new Set<number>();
  const total = items.length;
  
  // LIMITAR a 150 itens para ter conteúdo suficiente (15 gêneros x 10 itens)
  const limitedItems = items.slice(0, 150);
  const limitedTotal = limitedItems.length;
  
  console.log(`📋 Starting to fetch ${limitedTotal} items from TMDB (optimized for multiple genres)...`);
  
  for (let i = 0; i < limitedItems.length; i++) {
    const item = limitedItems[i];
    
    // Validar item antes de buscar
    if (!item || !item.name) {
      continue;
    }
    
    const progress = Math.round(((i + 1) / limitedTotal) * 100);
    
    try {
      // Tentar primeiro baseado no tipo detectado
      let searchResults = await search(item.type, item.name);
      let foundType = item.type;
      
      // Se não encontrar, tentar o outro tipo
      if (!searchResults.results || searchResults.results.length === 0) {
        const alternativeType = item.type === 'tv' ? 'movie' : 'tv';
        searchResults = await search(alternativeType, item.name);
        foundType = alternativeType;
      }
      
      if (searchResults.results && searchResults.results.length > 0) {
        const result = searchResults.results[0];
        
        // Adicionar media_type ao resultado
        result.media_type = foundType;
        
        // Evitar duplicados
        if (!seenIds.has(result.id)) {
          seenIds.add(result.id);
          moviesData.push(result);
        }
      }
    } catch (error) {
      // Silenciar erros individuais de busca
    }
    
    // Log de progresso a cada 5 itens
    if ((i + 1) % 5 === 0 || i + 1 === limitedTotal) {
      console.log(`📊 Progress: ${progress}% (${moviesData.length} found / ${i + 1} processed)`);
    }
    
    // Delay menor para acelerar
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`✅ Successfully loaded ${moviesData.length} of ${limitedTotal} items (fast load mode)`);
  return moviesData;
}
