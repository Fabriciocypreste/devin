import { useState, useMemo } from "react";
import { MovieCard } from "./MovieCard";
import { Movie } from "../utils/tmdb";

interface LanguageBrowsePageProps {
  onMovieClick?: (movie: Movie) => void;
  onAddToList?: (movie: Movie) => void;
  onLike?: (movie: Movie) => void;
  onWatchLater?: (movie: Movie) => void;
  myList?: number[];
  likedList?: number[];
  watchLaterList?: number[];
}

export function LanguageBrowsePage({
  onMovieClick,
  onAddToList,
  onLike,
  onWatchLater,
  myList = [],
  likedList = [],
  watchLaterList = []
}: LanguageBrowsePageProps) {
  const [preferenceFilter, setPreferenceFilter] = useState("all");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [sortBy, setSortBy] = useState("suggestions");

  // Dados de exemplo de filmes/séries com idiomas (convertidos para formato Movie)
  const allContent: Movie[] = [
    { 
      id: 1041513, 
      title: "Stranger Things", 
      name: "Stranger Things",
      media_type: "tv", 
      original_language: "en",
      vote_average: 9.0,
      poster_path: "/49WJfeN0moxb9IPfGn8AIqMGskD.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      overview: "Quando um garoto desaparece, uma pequena cidade descobre um mistério envolvendo experiências secretas, forças sobrenaturais e uma garota muito especial.",
      first_air_date: "2024-01-01",
      genre_ids: [878, 18, 9648],
      origin_country: ["US"],
      original_name: "Stranger Things",
      popularity: 1500,
      vote_count: 15000
    },
    { 
      id: 63351, 
      title: "Narcos", 
      name: "Narcos",
      media_type: "tv", 
      original_language: "es",
      vote_average: 8.8,
      poster_path: "/rTmal9fDbwh5F0waol2hq35U4ah.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "A verdadeira história da ascensão e queda dos reis da droga colombianos e o envolvimento da DEA.",
      first_air_date: "2023-01-01",
      genre_ids: [80, 18],
      origin_country: ["CO", "US"],
      original_name: "Narcos",
      popularity: 1200,
      vote_count: 8000
    },
    { 
      id: 1396, 
      title: "Breaking Bad", 
      name: "Breaking Bad",
      media_type: "tv", 
      original_language: "en",
      vote_average: 9.5,
      poster_path: "/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      overview: "Um professor de química do ensino médio se associa a um ex-aluno para produzir metanfetamina.",
      first_air_date: "2023-01-01",
      genre_ids: [18, 80],
      origin_country: ["US"],
      original_name: "Breaking Bad",
      popularity: 2000,
      vote_count: 20000
    },
    { 
      id: 71446, 
      title: "La Casa de Papel", 
      name: "La Casa de Papel",
      media_type: "tv", 
      original_language: "es",
      vote_average: 8.3,
      poster_path: "/MoEKaPFHABtA1xKoOteirGaHl1.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Um grupo de ladrões realiza o maior assalto da história da Espanha.",
      first_air_date: "2023-01-01",
      genre_ids: [80, 18, 9648],
      origin_country: ["ES"],
      original_name: "La Casa de Papel",
      popularity: 1800,
      vote_count: 12000
    },
    { 
      id: 96677, 
      title: "Lupin", 
      name: "Lupin",
      media_type: "tv", 
      original_language: "fr",
      vote_average: 7.5,
      poster_path: "/sgxawbFB5Vi5OkPWmvLFJNdm93i.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Inspirado pelas aventuras de Arsène Lupin, um ladrão quer vingar seu pai por uma injustiça.",
      first_air_date: "2024-01-01",
      genre_ids: [80, 18, 9648],
      origin_country: ["FR"],
      original_name: "Lupin",
      popularity: 900,
      vote_count: 5000
    },
    { 
      id: 110316, 
      title: "Alice in Borderland", 
      name: "Alice in Borderland",
      media_type: "tv", 
      original_language: "ja",
      vote_average: 7.8,
      poster_path: "/nWT0ngQmNuxH5rEcKs4YfgYUd40.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Um gamer e seus amigos se veem em uma Tokyo paralela, onde precisam competir em jogos mortais.",
      first_air_date: "2024-01-01",
      genre_ids: [18, 9648, 878],
      origin_country: ["JP"],
      original_name: "今際の国のアリス",
      popularity: 1100,
      vote_count: 6000
    },
    { 
      id: 70523, 
      title: "Dark", 
      name: "Dark",
      media_type: "tv", 
      original_language: "de",
      vote_average: 8.7,
      poster_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Uma família em uma cidade na Alemanha em 2019. Seu passado, presente e futuro.",
      first_air_date: "2023-01-01",
      genre_ids: [18, 9648, 878],
      origin_country: ["DE"],
      original_name: "Dark",
      popularity: 1300,
      vote_count: 9000
    },
    { 
      id: 93405, 
      title: "Squid Game", 
      name: "Squid Game",
      media_type: "tv", 
      original_language: "ko",
      vote_average: 8.0,
      poster_path: "/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Centenas de jogadores aceitam um convite para competir em jogos infantis por um prêmio tentador.",
      first_air_date: "2024-01-01",
      genre_ids: [18, 9648],
      origin_country: ["KR"],
      original_name: "오징어 게임",
      popularity: 2500,
      vote_count: 18000
    },
    { 
      id: 79744, 
      title: "The Rookie", 
      name: "The Rookie",
      media_type: "tv", 
      original_language: "en",
      vote_average: 8.1,
      poster_path: "/wbeqBUFydztHDQ4PPdidEXKx5uG.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      overview: "A história de um homem de 45 anos que se torna o policial mais velho novato do LAPD.",
      first_air_date: "2023-01-01",
      genre_ids: [80, 18],
      origin_country: ["US"],
      original_name: "The Rookie",
      popularity: 800,
      vote_count: 4000
    },
    { 
      id: 76479, 
      title: "O Mecanismo", 
      name: "O Mecanismo",
      media_type: "tv", 
      original_language: "pt",
      vote_average: 7.6,
      poster_path: "/4jW3cHV5OrACSPjSYGu4pDMrRh8.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "A história fictícia baseada na Operação Lava Jato.",
      first_air_date: "2023-01-01",
      genre_ids: [80, 18],
      origin_country: ["BR"],
      original_name: "O Mecanismo",
      popularity: 700,
      vote_count: 3000
    },
    { 
      id: 939243, 
      title: "Um Relâmpago", 
      media_type: "movie", 
      original_language: "ko",
      vote_average: 7.4,
      poster_path: "/eYWaCi05hQPHJScCFr63BY0LDzE.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Um thriller de ação sul-coreano explosivo.",
      release_date: "2024-01-01",
      genre_ids: [28, 53],
      original_title: "Um Relâmpago",
      popularity: 600,
      vote_count: 2500
    },
    { 
      id: 37680, 
      title: "Suits", 
      name: "Suits",
      media_type: "tv", 
      original_language: "en",
      vote_average: 8.5,
      poster_path: "/vQiryp6LioFxQThywxbC6TuoDjy.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      overview: "Um talentoso advogado contrata um brilhante universitário que nunca cursou direito.",
      first_air_date: "2023-01-01",
      genre_ids: [18],
      origin_country: ["US"],
      original_name: "Suits",
      popularity: 1400,
      vote_count: 10000
    },
    { 
      id: 76479, 
      title: "Elite", 
      name: "Elite",
      media_type: "tv", 
      original_language: "es",
      vote_average: 7.5,
      poster_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Três adolescentes de classe trabalhadora conseguem bolsas de estudo em uma escola privada de elite na Espanha.",
      first_air_date: "2024-01-01",
      genre_ids: [18, 9648, 80],
      origin_country: ["ES"],
      original_name: "Elite",
      popularity: 1000,
      vote_count: 5500
    },
    { 
      id: 71789, 
      title: "Suburra", 
      name: "Suburra",
      media_type: "tv", 
      original_language: "it",
      vote_average: 7.7,
      poster_path: "/4VmDLmoFTJUTSNe4PR5fMN5hR1h.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Uma batalha pela posse de terras na periferia de Roma.",
      first_air_date: "2023-01-01",
      genre_ids: [80, 18],
      origin_country: ["IT"],
      original_name: "Suburra: La serie",
      popularity: 650,
      vote_count: 2800
    },
    { 
      id: 120168, 
      title: "Resident Evil", 
      name: "Resident Evil",
      media_type: "tv", 
      original_language: "en",
      vote_average: 7.2,
      poster_path: "/aXGlvZBq3RYR9JKpBNYVS82ALNR.jpg",
      backdrop_path: "/56v2KjBlU4XaOv9rVYEQypROD7P.jpg",
      overview: "Uma série baseada nos famosos jogos de survival horror.",
      first_air_date: "2024-01-01",
      genre_ids: [18, 878, 27],
      origin_country: ["US"],
      original_name: "Resident Evil",
      popularity: 850,
      vote_count: 4200
    },
    { 
      id: 95557, 
      title: "Valeria", 
      name: "Valeria",
      media_type: "tv", 
      original_language: "es",
      vote_average: 7.0,
      poster_path: "/62QhTDLJbVW2XKPRuW0UkxBB1hv.jpg",
      backdrop_path: "/3NTAbAiao4JLzFQw6YxP1YZppM8.jpg",
      overview: "Uma escritora em crise encontra inspiração em suas três melhores amigas.",
      first_air_date: "2023-01-01",
      genre_ids: [35, 18],
      origin_country: ["ES"],
      original_name: "Valeria",
      popularity: 500,
      vote_count: 2000
    },
  ];

  // Mapeamento de idiomas
  const languageMap: Record<string, string> = {
    'en': 'Inglês',
    'es': 'Espanhol',
    'fr': 'Francês',
    'ja': 'Japonês',
    'de': 'Alemão',
    'ko': 'Coreano',
    'pt': 'Português',
    'it': 'Italiano',
    'ar': 'Árabe',
    'nl': 'Holandês',
    'da': 'Dinamarquês',
    'he': 'Hebraico',
    'hi': 'Hindi',
    'id': 'Indonésio',
    'ms': 'Malaisia',
    'tl': 'Filipino'
  };

  // Função para pegar o idioma em português
  const getLanguageInPortuguese = (langCode: string) => {
    return languageMap[langCode] || langCode.toUpperCase();
  };

  // Filtrar conteúdo
  const filteredContent = useMemo(() => {
    let content = [...allContent];

    // Filtrar por idioma
    if (languageFilter !== "all") {
      content = content.filter(item => {
        const itemLanguage = getLanguageInPortuguese(item.original_language);
        return itemLanguage === languageFilter;
      });
    }

    // Ordenar
    if (sortBy === "year") {
      content.sort((a, b) => {
        const yearA = parseInt((a.first_air_date || a.release_date || '2000').split('-')[0]);
        const yearB = parseInt((b.first_air_date || b.release_date || '2000').split('-')[0]);
        return yearB - yearA;
      });
    } else if (sortBy === "a-z") {
      content.sort((a, b) => {
        const titleA = a.title || a.name || '';
        const titleB = b.title || b.name || '';
        return titleA.localeCompare(titleB);
      });
    } else if (sortBy === "z-a") {
      content.sort((a, b) => {
        const titleA = a.title || a.name || '';
        const titleB = b.title || b.name || '';
        return titleB.localeCompare(titleA);
      });
    } else {
      // Sugestões (ordenar por rating)
      content.sort((a, b) => b.vote_average - a.vote_average);
    }

    return content;
  }, [languageFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#141414] text-white pt-20 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        {/* Título */}
        <h1 className="text-4xl mb-8">Navegar por idiomas</h1>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          {/* Dropdown 1: Selecione suas preferências */}
          <div className="flex-1">
            <select
              value={preferenceFilter}
              onChange={(e) => setPreferenceFilter(e.target.value)}
              className="w-full bg-black border border-white/30 text-white px-4 py-3 rounded appearance-none cursor-pointer hover:border-white/60 transition-colors [&>option]:bg-black [&>option]:text-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="all" className="bg-black text-white">Selecione suas preferências</option>
              <option value="original" className="bg-black text-white">Idioma original</option>
              <option value="dub" className="bg-black text-white">Dublagem</option>
              <option value="sub" className="bg-black text-white">Legendas</option>
              <optgroup label="Plataformas de Streaming" className="bg-black text-white">
                <option value="netflix" className="bg-black text-white">Netflix</option>
                <option value="prime" className="bg-black text-white">Amazon Prime Video</option>
                <option value="disney" className="bg-black text-white">Disney+</option>
                <option value="hbo" className="bg-black text-white">HBO Max</option>
                <option value="apple" className="bg-black text-white">Apple TV+</option>
                <option value="paramount" className="bg-black text-white">Paramount+</option>
                <option value="star" className="bg-black text-white">Star+</option>
                <option value="globoplay" className="bg-black text-white">Globoplay</option>
              </optgroup>
            </select>
          </div>

          {/* Dropdown 2: Idioma */}
          <div className="flex-1">
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="w-full bg-black border border-white/30 text-white px-4 py-3 rounded appearance-none cursor-pointer hover:border-white/60 transition-colors [&>option]:bg-black [&>option]:text-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="all" className="bg-black text-white">Idioma original</option>
              <option value="Alemão" className="bg-black text-white">Alemão</option>
              <option value="Árabe" className="bg-black text-white">Árabe</option>
              <option value="Coreano" className="bg-black text-white">Coreano</option>
              <option value="Dinamarquês" className="bg-black text-white">Dinamarquês</option>
              <option value="Em neerlandês (Bélgica)" className="bg-black text-white">Em neerlandês (Bélgica)</option>
              <option value="Espanhol" className="bg-black text-white">Espanhol</option>
              <option value="Filipino" className="bg-black text-white">Filipino</option>
              <option value="Francês" className="bg-black text-white">Francês</option>
              <option value="Hebraico" className="bg-black text-white">Hebraico</option>
              <option value="Hindi" className="bg-black text-white">Hindi</option>
              <option value="Holandês" className="bg-black text-white">Holandês</option>
              <option value="Indonésio" className="bg-black text-white">Indonésio</option>
              <option value="Inglês" className="bg-black text-white">Inglês</option>
              <option value="Italiano" className="bg-black text-white">Italiano</option>
              <option value="Japonês" className="bg-black text-white">Japonês</option>
              <option value="Malaisia" className="bg-black text-white">Malaisia</option>
              <option value="Português" className="bg-black text-white">Português</option>
            </select>
          </div>

          {/* Dropdown 3: Ordenar por */}
          <div className="flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-black border border-white/30 text-white px-4 py-3 rounded appearance-none cursor-pointer hover:border-white/60 transition-colors [&>option]:bg-black [&>option]:text-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='white' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 1rem center',
              }}
            >
              <option value="suggestions" className="bg-black text-white">Sugestões para você</option>
              <option value="year" className="bg-black text-white">Ano de estreia</option>
              <option value="a-z" className="bg-black text-white">A-Z</option>
              <option value="z-a" className="bg-black text-white">Z-A</option>
            </select>
          </div>
        </div>

        {/* Grid de Conteúdo com MovieCard */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {filteredContent.map((item) => (
            <MovieCard
              key={item.id}
              movie={item}
              onClick={() => onMovieClick?.(item)}
              onAddToList={() => onAddToList?.(item)}
              onLike={() => onLike?.(item)}
              onWatchLater={() => onWatchLater?.(item)}
              isInList={myList.includes(item.id)}
              isLiked={likedList.includes(item.id)}
              isInWatchLater={watchLaterList.includes(item.id)}
            />
          ))}
        </div>

        {/* Mensagem se não houver resultados */}
        {filteredContent.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-white/60">
              Nenhum conteúdo encontrado com os filtros selecionados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}