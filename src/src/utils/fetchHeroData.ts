// Script para buscar dados das séries hero via TMDB API
import { fetchFromTMDB } from './tmdb';

export interface HeroData {
  id: number;
  name: string;
  backdrop_path: string;
  logo_path: string | null;
  overview: string;
  genres: string[];
  trailer_key: string | null;
  media_type: 'tv';
}

// IDs das séries selecionadas
const HERO_SERIES_IDS = {
  WEDNESDAY: 119051,
  THE_WITCHER: 71912,
  THE_LAST_OF_US: 100088
};

/**
 * Busca dados completos de uma série via TMDB API
 */
async function fetchSeriesData(seriesId: number): Promise<HeroData | null> {
  try {
    console.log(`📡 Buscando dados da série ID ${seriesId}...`);
    
    // 1. Buscar detalhes da série
    const details = await fetchFromTMDB(`/tv/${seriesId}`, {
      append_to_response: 'images,videos'
    });
    
    if (!details) {
      console.error(`❌ Série ${seriesId} não encontrada`);
      return null;
    }

    console.log(`✅ Série encontrada: ${details.name}`);
    
    // 2. Extrair logo (se disponível nas imagens)
    let logoPath: string | null = null;
    if (details.images?.logos && details.images.logos.length > 0) {
      // Priorizar logos em inglês ou português
      const logo = details.images.logos.find((l: any) => 
        l.iso_639_1 === 'en' || l.iso_639_1 === 'pt' || l.iso_639_1 === null
      ) || details.images.logos[0];
      
      logoPath = `https://image.tmdb.org/t/p/original${logo.file_path}`;
      console.log(`  🎨 Logo encontrada: ${logoPath}`);
    } else {
      console.log(`  ⚠️  Sem logo disponível para ${details.name}`);
    }
    
    // 3. Extrair trailer (YouTube)
    let trailerKey: string | null = null;
    if (details.videos?.results && details.videos.results.length > 0) {
      const trailer = details.videos.results.find((v: any) => 
        v.type === 'Trailer' && v.site === 'YouTube'
      ) || details.videos.results[0];
      
      trailerKey = trailer?.key || null;
      console.log(`  🎬 Trailer encontrado: ${trailerKey}`);
    }
    
    // 4. Montar backdrop em alta resolução
    const backdropPath = details.backdrop_path 
      ? `https://image.tmdb.org/t/p/original${details.backdrop_path}`
      : '';
    
    // 5. Extrair gêneros
    const genres = details.genres?.map((g: any) => g.name) || [];
    
    const heroData: HeroData = {
      id: details.id,
      name: details.name || details.original_name,
      backdrop_path: backdropPath,
      logo_path: logoPath,
      overview: details.overview || 'Descrição não disponível.',
      genres: genres,
      trailer_key: trailerKey,
      media_type: 'tv'
    };
    
    console.log(`✅ Dados completos extraídos para ${heroData.name}`);
    console.log(`   - Backdrop: ${backdropPath ? 'OK' : 'FALTANDO'}`);
    console.log(`   - Logo: ${logoPath ? 'OK' : 'FALTANDO'}`);
    console.log(`   - Trailer: ${trailerKey ? 'OK' : 'FALTANDO'}`);
    console.log(`   - Gêneros: ${genres.join(', ')}`);
    
    return heroData;
    
  } catch (error) {
    console.error(`❌ Erro ao buscar série ${seriesId}:`, error);
    return null;
  }
}

/**
 * Busca dados de todas as séries hero
 */
export async function fetchAllHeroData(): Promise<HeroData[]> {
  console.log('🚀 Iniciando busca de dados das séries hero...');
  console.log(`📋 Séries selecionadas: Wednesday, The Witcher, The Last of Us`);
  
  const results: HeroData[] = [];
  
  // Buscar dados de cada série
  for (const [name, id] of Object.entries(HERO_SERIES_IDS)) {
    console.log(`\n--- Buscando ${name} (ID: ${id}) ---`);
    const data = await fetchSeriesData(id);
    if (data) {
      results.push(data);
    }
    // Delay para não sobrecarregar API
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n✅ Busca concluída! ${results.length} séries obtidas.`);
  return results;
}

/**
 * Salva dados no KV Store do Supabase
 */
export async function saveHeroDataToKV(data: HeroData[]): Promise<boolean> {
  try {
    console.log('💾 Salvando dados no KV Store...');
    
    // Importar dinamicamente para evitar erros
    const { projectId, publicAnonKey } = await import('./supabase/info');
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/hero-data`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ data })
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao salvar: ${response.statusText}`);
    }
    
    console.log('✅ Dados salvos com sucesso no banco!');
    return true;
    
  } catch (error) {
    console.error('❌ Erro ao salvar no KV Store:', error);
    return false;
  }
}

/**
 * Carrega dados do KV Store
 */
export async function loadHeroDataFromKV(): Promise<HeroData[] | null> {
  try {
    console.log('📡 Carregando dados do KV Store...');
    
    // Importar dinamicamente para evitar erros
    const { projectId, publicAnonKey } = await import('./supabase/info');
    
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/hero-data`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Erro ao carregar: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`✅ ${data.length} séries carregadas do banco!`);
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao carregar do KV Store:', error);
    return null;
  }
}

/**
 * Gera código TypeScript para salvar localmente
 */
export function generateLocalCode(data: HeroData[]): string {
  const code = `// Dados das séries hero (gerado automaticamente via TMDB API)
// Última atualização: ${new Date().toISOString()}

export interface HeroSlide {
  id: number;
  name: string;
  backdrop_path: string;
  logo_path: string | null;
  overview: string;
  genres: string[];
  trailer_key: string | null;
  media_type: 'tv';
}

export const HERO_SLIDES: HeroSlide[] = ${JSON.stringify(data, null, 2)};

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
    slide.name.toLowerCase().includes(name.toLowerCase())
  );
}
`;
  
  return code;
}
