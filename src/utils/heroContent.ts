// Dados das séries hero - APENAS 3 SÉRIES SELECIONADAS
// Wednesday, The Witcher e Black Lightning

export interface HeroSlide {
  id: number;
  name: string;
  title?: string;
  backdrop_path: string;
  logo_path: string | null;
  overview: string;
  genres: string[];
  trailer_key: string | null;
  media_type: 'tv' | 'movie';
}

// IDs do TMDB das séries selecionadas
export const SELECTED_SERIES_IDS = {
  WEDNESDAY: 119051,
  THE_WITCHER: 71912,
  THE_LAST_OF_US: 100088
};

// Dados temporários até buscar do TMDB
export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 119051,
    name: 'Wednesday',
    backdrop_path: 'https://image.tmdb.org/t/p/original/iHSwvRVsRyxpX7FE7GbviaDvgGZ.jpg',
    logo_path: 'https://image.tmdb.org/t/p/original/q2VlheTdJfXfOOLbNEKMGEFfmFv.png',
    overview: 'Inteligente, sarcástica e um pouco morta por dentro, Wednesday Addams investiga uma onda de assassinatos enquanto faz novos amigos - e inimigos - na Academia Nunca Mais.',
    genres: ['Mistério', 'Comédia', 'Fantasia'],
    trailer_key: 'Di310WS8zLk',
    media_type: 'tv'
  },
  {
    id: 71912,
    name: 'The Witcher',
    backdrop_path: 'https://image.tmdb.org/t/p/original/7ftFUxg8GPe2AcLPVL5mVn2nMr6.jpg',
    logo_path: 'https://image.tmdb.org/t/p/original/9ohrPartL37UoQBNa08wq2kwrkN.png',
    overview: 'Geralt de Rívia, um caçador de monstros mutante, viaja em direção ao seu destino em um mundo turbulento onde as pessoas frequentemente são mais perversas do que os monstros.',
    genres: ['Ação', 'Fantasia', 'Aventura'],
    trailer_key: 'ndl1W4ltcmg',
    media_type: 'tv'
  },
  {
    id: 100088,
    name: 'The Last of Us',
    backdrop_path: 'https://image.tmdb.org/t/p/original/uKvVjHNqB5VmOrdxqAt2F7J78ED.jpg',
    logo_path: 'https://image.tmdb.org/t/p/original/logMer35IbzZ0BRxCrbrXYdaIT3.png',
    overview: 'Vinte anos após a destruição da civilização moderna por um fungo, Joel e Ellie embarcam em uma jornada brutal através dos Estados Unidos em um mundo pós-apocalíptico.',
    genres: ['Ação', 'Drama', 'Sci-Fi'],
    trailer_key: 'uLtkt8BonwM',
    media_type: 'tv'
  }
];

// Função para buscar dados atualizados do TMDB
export async function fetchHeroSlides(): Promise<HeroSlide[]> {
  // Usar a chave API do TMDB (mesma do tmdb.ts)
  const API_KEY = 'ddb1bdf6aa91bdf335797853884b0c1d';
  const BASE_URL = 'https://api.themoviedb.org/3';
  
  try {
    console.log('📡 Buscando dados atualizados das séries via TMDB...');
    
    const slides: HeroSlide[] = [];
    
    for (const [name, id] of Object.entries(SELECTED_SERIES_IDS)) {
      try {
        const response = await fetch(
          `${BASE_URL}/tv/${id}?append_to_response=images,videos&language=pt-BR&api_key=${API_KEY}`,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          console.error(`❌ Erro ao buscar ${name}: ${response.status}`);
          continue;
        }
        
        const data = await response.json();
        
        // Extrair logo
        let logoPath: string | null = null;
        if (data.images?.logos && data.images.logos.length > 0) {
          const logo = data.images.logos.find((l: any) => 
            l.iso_639_1 === 'en' || l.iso_639_1 === 'pt' || l.iso_639_1 === null
          ) || data.images.logos[0];
          logoPath = `https://image.tmdb.org/t/p/original${logo.file_path}`;
        }
        
        // Extrair trailer
        let trailerKey: string | null = null;
        if (data.videos?.results && data.videos.results.length > 0) {
          const trailer = data.videos.results.find((v: any) => 
            v.type === 'Trailer' && v.site === 'YouTube'
          ) || data.videos.results[0];
          trailerKey = trailer?.key || null;
        }
        
        slides.push({
          id: data.id,
          name: data.name || data.original_name,
          title: data.original_name !== data.name ? data.original_name : undefined,
          backdrop_path: `https://image.tmdb.org/t/p/original${data.backdrop_path}`,
          logo_path: logoPath,
          overview: data.overview || 'Descrição não disponível.',
          genres: data.genres?.map((g: any) => g.name) || [],
          trailer_key: trailerKey,
          media_type: 'tv'
        });
        
        console.log(`✅ ${name} carregada com sucesso`);
        
      } catch (error) {
        console.error(`❌ Erro ao processar ${name}:`, error);
      }
    }
    
    if (slides.length === 0) {
      console.warn('⚠️ Nenhuma série carregada do TMDB, usando dados estáticos');
      return HERO_SLIDES;
    }
    
    console.log(`✅ ${slides.length} séries carregadas do TMDB!`);
    return slides;
    
  } catch (error) {
    console.error('❌ Erro ao buscar hero slides:', error);
    return HERO_SLIDES;
  }
}

// Função helper para obter um slide específico
export function getHeroSlide(id: number): HeroSlide | undefined {
  return HERO_SLIDES.find(slide => slide.id === id);
}

// Função helper para obter slides aleatórios
export function getRandomHeroSlides(count: number = 3): HeroSlide[] {
  const shuffled = [...HERO_SLIDES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, HERO_SLIDES.length));
}

// Função helper para obter slide por nome
export function getHeroSlideByName(name: string): HeroSlide | undefined {
  return HERO_SLIDES.find(slide => 
    slide.name.toLowerCase().includes(name.toLowerCase()) ||
    slide.title?.toLowerCase().includes(name.toLowerCase())
  );
}
