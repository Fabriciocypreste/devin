import { useState, useEffect } from 'react';
import { getPersonDetails, getPersonMovieCredits, getPersonTVCredits, getPersonImages, getImageUrl } from '../utils/tmdb';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Icons inline to avoid lucide-react dependency
const X = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const Calendar = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const MapPin = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const Award = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"></circle>
    <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
  </svg>
);

const Film = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
    <line x1="7" y1="2" x2="7" y2="22"></line>
    <line x1="17" y1="2" x2="17" y2="22"></line>
    <line x1="2" y1="12" x2="22" y2="12"></line>
    <line x1="2" y1="7" x2="7" y2="7"></line>
    <line x1="2" y1="17" x2="7" y2="17"></line>
    <line x1="17" y1="17" x2="22" y2="17"></line>
    <line x1="17" y1="7" x2="22" y2="7"></line>
  </svg>
);

const Tv = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

interface PersonDetailsProps {
  personId: number;
  personName: string;
  onClose: () => void;
  onContentClick?: (id: number, mediaType: 'movie' | 'tv') => void;
}

interface PersonInfo {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  also_known_as: string[];
  popularity: number;
}

interface Credit {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  character?: string;
  job?: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: string;
}

export function PersonDetails({ personId, personName, onClose, onContentClick }: PersonDetailsProps) {
  const [person, setPerson] = useState<PersonInfo | null>(null);
  const [movieCredits, setMovieCredits] = useState<Credit[]>([]);
  const [tvCredits, setTVCredits] = useState<Credit[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'movies' | 'tv' | 'photos'>('about');

  useEffect(() => {
    async function fetchPersonData() {
      try {
        setLoading(true);

        // Fetch person details
        const personData = await getPersonDetails(personId);
        setPerson(personData);

        // Fetch movie credits
        const movieCreditsData = await getPersonMovieCredits(personId);
        const sortedMovies = (movieCreditsData.cast || [])
          .sort((a: Credit, b: Credit) => {
            const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
            const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
            return dateB - dateA;
          });
        setMovieCredits(sortedMovies.slice(0, 50));

        // Fetch TV credits
        const tvCreditsData = await getPersonTVCredits(personId);
        const sortedTV = (tvCreditsData.cast || [])
          .sort((a: Credit, b: Credit) => {
            const dateA = a.first_air_date ? new Date(a.first_air_date).getTime() : 0;
            const dateB = b.first_air_date ? new Date(b.first_air_date).getTime() : 0;
            return dateB - dateA;
          });
        setTVCredits(sortedTV.slice(0, 50));

        // Fetch images
        const imagesData = await getPersonImages(personId);
        const profileImages = (imagesData.profiles || [])
          .slice(0, 20)
          .map((img: any) => img.file_path);
        setImages(profileImages);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching person data:', error);
        setLoading(false);
      }
    }

    fetchPersonData();
  }, [personId]);

  const calculateAge = (birthday: string | null, deathday: string | null) => {
    if (!birthday) return null;
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    const age = end.getFullYear() - birth.getFullYear();
    return age;
  };

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!person) {
    return null;
  }

  const age = calculateAge(person.birthday, person.deathday);

  return (
    <div className="fixed inset-0 z-50 bg-black overflow-y-auto">
      <div className="min-h-screen">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="fixed top-8 right-8 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-black/80 backdrop-blur-sm hover:bg-[#E50914] transition-all duration-300 group"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Header com Card Compacto */}
        <div className="relative bg-gradient-to-b from-black via-[#0a0a0a] to-black pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-12">
            {/* Card Compacto do Perfil */}
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl border border-white/10 p-8 backdrop-blur-xl shadow-2xl">
              <div className="flex items-start gap-8">
                {/* Foto pequena */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 rounded-2xl overflow-hidden bg-white/5 border-2 border-[#E50914]/50 shadow-lg shadow-red-600/20">
                    {person.profile_path ? (
                      <ImageWithFallback
                        src={getImageUrl(person.profile_path, 'w300')}
                        alt={person.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#E50914]/20 to-[#E50914]/5">
                        <Award className="w-12 h-12 text-[#E50914]/50" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Informações principais */}
                <div className="flex-1">
                  <h1 className="text-white font-['Montserrat:Extra_Bold',sans-serif] text-4xl mb-4">
                    {person.name}
                  </h1>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Profissão */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 flex items-center justify-center flex-shrink-0">
                        <Award className="w-5 h-5 text-[#E50914]" />
                      </div>
                      <div>
                        <p className="text-white/50 font-['Roboto:Regular',sans-serif] text-xs uppercase tracking-wider mb-1">
                          Profissão
                        </p>
                        <p className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-base">
                          {person.known_for_department}
                        </p>
                      </div>
                    </div>

                    {/* Idade */}
                    {person.birthday && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-[#E50914]" />
                        </div>
                        <div>
                          <p className="text-white/50 font-['Roboto:Regular',sans-serif] text-xs uppercase tracking-wider mb-1">
                            Idade
                          </p>
                          <p className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-base">
                            {age ? `${age} anos` : 'N/A'}
                          </p>
                          <p className="text-white/40 font-['Roboto:Regular',sans-serif] text-xs mt-0.5">
                            {formatDate(person.birthday)}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Naturalidade */}
                    {person.place_of_birth && (
                      <div className="flex items-start gap-3 md:col-span-2">
                        <div className="w-10 h-10 rounded-lg bg-[#E50914]/10 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-[#E50914]" />
                        </div>
                        <div>
                          <p className="text-white/50 font-['Roboto:Regular',sans-serif] text-xs uppercase tracking-wider mb-1">
                            Naturalidade
                          </p>
                          <p className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-base">
                            {person.place_of_birth}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-12">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('about')}
                className={`py-4 px-2 font-['Montserrat:Semi_Bold',sans-serif] text-lg transition-all relative ${
                  activeTab === 'about' ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Sobre
                {activeTab === 'about' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E50914]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('movies')}
                className={`py-4 px-2 font-['Montserrat:Semi_Bold',sans-serif] text-lg transition-all relative flex items-center gap-2 ${
                  activeTab === 'movies' ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Film className="w-5 h-5" />
                Filmes ({movieCredits.length})
                {activeTab === 'movies' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E50914]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('tv')}
                className={`py-4 px-2 font-['Montserrat:Semi_Bold',sans-serif] text-lg transition-all relative flex items-center gap-2 ${
                  activeTab === 'tv' ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Tv className="w-5 h-5" />
                Séries ({tvCredits.length})
                {activeTab === 'tv' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E50914]" />
                )}
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`py-4 px-2 font-['Montserrat:Semi_Bold',sans-serif] text-lg transition-all relative ${
                  activeTab === 'photos' ? 'text-white' : 'text-white/50 hover:text-white/80'
                }`}
              >
                Fotos ({images.length})
                {activeTab === 'photos' && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E50914]" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="max-w-7xl mx-auto px-12 py-12">
          {/* Aba Sobre */}
          {activeTab === 'about' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-white font-['Montserrat:Bold',sans-serif] text-3xl mb-4">
                  Biografia
                </h2>
                <p className="text-white/80 font-['Roboto:Regular',sans-serif] text-lg leading-relaxed whitespace-pre-line">
                  {person.biography || 'Biografia não disponível.'}
                </p>
              </div>

              {person.also_known_as && person.also_known_as.length > 0 && (
                <div>
                  <h3 className="text-white font-['Montserrat:Bold',sans-serif] text-2xl mb-4">
                    Também conhecido como
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {person.also_known_as.map((name, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white/80 font-['Roboto:Regular',sans-serif]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Aba Filmes */}
          {activeTab === 'movies' && (
            <div>
              <h2 className="text-white font-['Montserrat:Bold',sans-serif] text-3xl mb-8">
                Filmografia
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {movieCredits.map((credit) => (
                  <div
                    key={`${credit.id}-${credit.character}`}
                    className="group cursor-pointer"
                    onClick={() => onContentClick?.(credit.id, 'movie')}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-white/5 border border-white/10 group-hover:border-[#E50914] transition-all duration-300 group-hover:scale-105">
                      {credit.poster_path ? (
                        <ImageWithFallback
                          src={getImageUrl(credit.poster_path, 'w500')}
                          alt={credit.title || 'Sem título'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <Film className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-sm mb-1 line-clamp-2 group-hover:text-[#E50914] transition-colors">
                      {credit.title}
                    </h3>
                    {credit.character && (
                      <p className="text-white/60 font-['Roboto:Regular',sans-serif] text-xs line-clamp-1">
                        como {credit.character}
                      </p>
                    )}
                    {credit.release_date && (
                      <p className="text-white/40 font-['Roboto:Regular',sans-serif] text-xs mt-1">
                        {new Date(credit.release_date).getFullYear()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba Séries */}
          {activeTab === 'tv' && (
            <div>
              <h2 className="text-white font-['Montserrat:Bold',sans-serif] text-3xl mb-8">
                Séries de TV
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {tvCredits.map((credit) => (
                  <div
                    key={`${credit.id}-${credit.character}`}
                    className="group cursor-pointer"
                    onClick={() => onContentClick?.(credit.id, 'tv')}
                  >
                    <div className="aspect-[2/3] rounded-lg overflow-hidden mb-3 bg-white/5 border border-white/10 group-hover:border-[#E50914] transition-all duration-300 group-hover:scale-105">
                      {credit.poster_path ? (
                        <ImageWithFallback
                          src={getImageUrl(credit.poster_path, 'w500')}
                          alt={credit.name || 'Sem título'}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/30">
                          <Tv className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <h3 className="text-white font-['Montserrat:Semi_Bold',sans-serif] text-sm mb-1 line-clamp-2 group-hover:text-[#E50914] transition-colors">
                      {credit.name}
                    </h3>
                    {credit.character && (
                      <p className="text-white/60 font-['Roboto:Regular',sans-serif] text-xs line-clamp-1">
                        como {credit.character}
                      </p>
                    )}
                    {credit.first_air_date && (
                      <p className="text-white/40 font-['Roboto:Regular',sans-serif] text-xs mt-1">
                        {new Date(credit.first_air_date).getFullYear()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Aba Fotos */}
          {activeTab === 'photos' && (
            <div>
              <h2 className="text-white font-['Montserrat:Bold',sans-serif] text-3xl mb-8">
                Galeria de Fotos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((imagePath, index) => (
                  <div
                    key={index}
                    className="aspect-[2/3] rounded-lg overflow-hidden bg-white/5 border border-white/10 hover:border-[#E50914] transition-all duration-300 hover:scale-105 cursor-pointer"
                  >
                    <ImageWithFallback
                      src={getImageUrl(imagePath, 'w500')}
                      alt={`${person.name} - Foto ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
