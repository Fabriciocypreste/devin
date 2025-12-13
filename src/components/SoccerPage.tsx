import React, { useEffect, useState, useRef } from "react";
import { NetflixHeader } from './NetflixHeader';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, TrophyIcon, TrendingUpIcon, ClockIcon, NewspaperIcon, ExternalLinkIcon, TvIcon, TargetIcon, UsersIcon, TableIcon, AwardIcon, PlayIcon } from './Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { NewsReader } from './NewsReader';
import { TeamDetails } from './TeamDetails';
import { getSearchName, getSportsDbId } from '../utils/teamMapping';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { TeamLogo } from './TeamLogo';

interface SoccerPageProps {
  onClose?: () => void;
}

export function SoccerPage({ onClose }: SoccerPageProps) {
  const [teams, setTeams] = useState<any[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([]);
  const [libertadoresMatches, setLibertadoresMatches] = useState<any[]>([]);
  const [standings, setStandings] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [topScorers, setTopScorers] = useState<any[]>([]);
  const [sportmonksScorers, setSportmonksScorers] = useState<any[]>([]);
  const [liveMatches, setLiveMatches] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [assists, setAssists] = useState<any[]>([]);
  const [rounds, setRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNews, setSelectedNews] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [sportsDbTeams, setSportsDbTeams] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  
  // Refs for quick navigation
  const liveMatchesRef = useRef<HTMLDivElement>(null);
  const teamsRef = useRef<HTMLDivElement>(null);
  const scorersRef = useRef<HTMLDivElement>(null);
  const standingsRef = useRef<HTMLDivElement>(null);
  const transfersRef = useRef<HTMLDivElement>(null);
  const assistsRef = useRef<HTMLDivElement>(null);
  
  // ✅ Server URL
  const serverUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;
  
  const brasileiraoId = 2013; // Brasileirão Série A
  const libertadoresId = 2152; // Copa Libertadores

  // Helper function to get transmission info
  const getTransmissao = (match: any): string => {
    const bigTeams = ['Flamengo', 'Palmeiras', 'Corinthians', 'São Paulo', 'Fluminense'];
    const isBigMatch = bigTeams.some(team => 
      match.homeTeam.name.includes(team) || match.awayTeam.name.includes(team)
    );
    
    if (isBigMatch) {
      return 'TV Globo, SporTV e Premiere';
    }
    
    // Check for clássicos (derbies)
    const classicos = [
      ['Corinthians', 'Palmeiras'],
      ['Corinthians', 'São Paulo'],
      ['Flamengo', 'Fluminense'],
      ['Flamengo', 'Vasco'],
      ['Grêmio', 'Internacional']
    ];
    
    const isClassico = classicos.some(([team1, team2]) => 
      (match.homeTeam.name.includes(team1) && match.awayTeam.name.includes(team2)) ||
      (match.homeTeam.name.includes(team2) && match.awayTeam.name.includes(team1))
    );
    
    if (isClassico) {
      return 'TV Globo e Premiere';
    }
    
    // Default transmissions based on matchday
    if (match.matchday && match.matchday % 2 === 0) {
      return 'SporTV e Premiere';
    }
    
    return 'Premiere';
  };

  // Helper function to generate embed URL
  const getEmbedUrl = (match: any): string => {
    const timeCasa = match.homeTeam.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
    const timeFora = match.awayTeam.name.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-');
    
    return `https://ge.globo.com/futebol/brasileirao-serie-a/${timeCasa}-x-${timeFora}.html`;
  };

  useEffect(() => {
    // ✅ REATIVADO: Carregar dados automaticamente ao abrir a página
    fetchAllData();
  }, []);

  async function fetchAllData() {
    // Prevent multiple simultaneous calls
    if (isFetching) {
      console.log('⚠️ fetchAllData já está em execução, ignorando...');
      return;
    }
    
    console.log('🔄 Iniciando fetchAllData...');
    setIsFetching(true);
    setLoading(true);
    
    try {
      let footballTeams: any[] = [];
      
      // Fetch teams
      try {
        console.log('📡 Buscando times...');
        const teamsResp = await fetch(`${serverUrl}/football/competitions/${brasileiraoId}/teams`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (teamsResp.ok) {
          const teamsData = await teamsResp.json();
          footballTeams = teamsData.teams || [];
          setTeams(footballTeams);
          console.log(`✅ ${footballTeams.length} times carregados`);
        } else {
          // Silenciar erro HTTP
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch matches
      try {
        const matchesResp = await fetch(`${serverUrl}/football/competitions/${brasileiraoId}/matches`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (matchesResp.ok) {
          const matchesData = await matchesResp.json();
          const matches = matchesData.matches || [];
          
          // Filter upcoming matches (SCHEDULED or TIMED status)
          const upcoming = matches
            .filter((m: any) => m.status === 'SCHEDULED' || m.status === 'TIMED')
            .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
            .slice(0, 12);
          
          setUpcomingMatches(upcoming);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch standings
      try {
        const standingsResp = await fetch(`${serverUrl}/football/competitions/${brasileiraoId}/standings`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (standingsResp.ok) {
          const standingsData = await standingsResp.json();
          setStandings(standingsData.standings?.[0]?.table || []);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch Libertadores matches
      try {
        console.log('🏆 Buscando jogos da Libertadores...');
        const libertadoresResp = await fetch(`${serverUrl}/football/competitions/${libertadoresId}/matches`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        console.log(`🏆 Libertadores response status: ${libertadoresResp.status}`);
        
        if (libertadoresResp.ok) {
          const libertadoresData = await libertadoresResp.json();
          const matches = libertadoresData.matches || [];
          console.log(`🏆 Total Libertadores matches: ${matches.length}`);
          
          // Filter upcoming matches with Brazilian teams
          const upcoming = matches
            .filter((m: any) => m.status === 'SCHEDULED' || m.status === 'TIMED')
            .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
            .slice(0, 6);
          
          console.log(`✅ ${upcoming.length} próximos jogos da Libertadores`);
          setLibertadoresMatches(upcoming);
        } else {
          // Silenciar erro HTTP
          setLibertadoresMatches([]);
        }
      } catch (err) {
        // Silenciar erro de fetch
        setLibertadoresMatches([]);
      }

      // Fetch soccer news
      try {
        const newsResp = await fetch(`${serverUrl}/soccer-news`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (newsResp.ok) {
          const newsData = await newsResp.json();
          setNews(newsData.items || []);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch top scorers
      try {
        const scorersResp = await fetch(`${serverUrl}/football/competitions/${brasileiraoId}/scorers`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (scorersResp.ok) {
          const scorersData = await scorersResp.json();
          setTopScorers(scorersData.scorers?.slice(0, 10) || []);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch Sportmonks scorers (more detailed)
      try {
        const sportmonksScorersResp = await fetch(`${serverUrl}/sportmonks/scorers/brasileirao`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (sportmonksScorersResp.ok) {
          const sportmonksData = await sportmonksScorersResp.json();
          setSportmonksScorers(sportmonksData.data?.slice(0, 15) || []);
          console.log('✅ Artilheiros Sportmonks carregados:', sportmonksData.data?.length);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch live matches
      try {
        const liveResp = await fetch(`${serverUrl}/sportmonks/matches/live`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (liveResp.ok) {
          const liveData = await liveResp.json();
          const brazilianMatches = liveData.data?.filter((match: any) => 
            match.league?.data?.name?.includes('Brasil') || 
            match.league?.data?.id === 384
          ) || [];
          setLiveMatches(brazilianMatches);
          console.log('✅ Jogos ao vivo carregados:', brazilianMatches.length);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch transfers
      try {
        console.log('💼 Buscando transferências...');
        const transfersResp = await fetch(`${serverUrl}/sportmonks/transfers/brasileirao`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (transfersResp.ok) {
          const transfersData = await transfersResp.json();
          setTransfers(transfersData.data?.slice(0, 20) || []);
          console.log(`✅ ${transfersData.data?.length || 0} transferências carregadas`);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch assists leaders
      try {
        console.log('🎯 Buscando garçons...');
        const assistsResp = await fetch(`${serverUrl}/sportmonks/assists/brasileirao`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (assistsResp.ok) {
          const assistsData = await assistsResp.json();
          setAssists(assistsData.data?.slice(0, 15) || []);
          console.log(`✅ ${assistsData.data?.length || 0} garçons carregados`);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch rounds
      try {
        console.log('🗓️ Buscando rodadas...');
        const roundsResp = await fetch(`${serverUrl}/sportmonks/rounds/brasileirao`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (roundsResp.ok) {
          const roundsData = await roundsResp.json();
          setRounds(roundsData.data || []);
          console.log(`✅ ${roundsData.data?.length || 0} rodadas carregadas`);
        }
      } catch (err) {
        // Silenciar erro de fetch
      }

      // Fetch detailed info for each team
      if (footballTeams.length > 0) {
        
        console.log(`🔍 Buscando dados detalhados para ${footballTeams.length} times...`);
        
        // Fetch detailed team info
        const enrichedTeams = await Promise.all(
          footballTeams.map(async (team: any) => {
            try {
              // Get proper search name using mapping
              const searchName = getSearchName(team.name);
              console.log(`🔍 Searching for "${team.name}" as "${searchName}"`);
              
              // Try to search by mapped team name
              const searchResp = await fetch(
                `${serverUrl}/sportsdb/search/team/${encodeURIComponent(searchName)}`,
                { headers: { "Authorization": `Bearer ${publicAnonKey}` } }
              );
              
              if (searchResp.ok) {
                const searchData = await searchResp.json();
                if (searchData.teams && searchData.teams.length > 0) {
                  // Filter only Brazilian teams
                  const brazilianTeam = searchData.teams.find((t: any) => 
                    t.strCountry === 'Brazil' || 
                    t.strLeague?.includes('Brazil') ||
                    t.strLeague?.includes('Serie A')
                  );
                  
                  if (brazilianTeam) {
                    console.log(`✅ Dados detalhados encontrados para ${team.name}: ${brazilianTeam.strTeam}`);
                    return { ...team, sportsDbData: brazilianTeam };
                  }
                }
              }
              
              console.log(`⚠️ Dados detalhados não encontrados para ${team.name}`);
            } catch (err) {
              console.log(`❌ Erro ao buscar dados detalhados para ${team.name}:`, err);
            }
            return team;
          })
        );
        
        const enriched = enrichedTeams.filter(t => t.sportsDbData);
        setSportsDbTeams(enriched);
        console.log(`✅ ${enriched.length} times enriquecidos com dados detalhados`);
      }

      setLoading(false);
      setIsFetching(false);
    } catch (error: any) {
      console.error('⚠️ Erro ao carregar dados do futebol:', error);
      // Não exibe erro na interface, apenas loga no console
      setLoading(false);
      setIsFetching(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-[#006a4e] via-[#0a3d5c] to-[#1a1f3a]">
        <NetflixHeader 
          activeCategory="futebol"
          onCategoryChange={() => {}}
          onSearchClick={() => {}}
        />
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#FFD700] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white">Carregando dados do Brasileirão...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show News Reader if a news article is selected
  if (selectedNews) {
    return <NewsReader newsUrl={selectedNews} onClose={() => setSelectedNews(null)} />;
  }

  // Show Team Details if a team is selected
  if (selectedTeam) {
    return (
      <TeamDetails 
        team={selectedTeam} 
        onClose={() => setSelectedTeam(null)}
        onNewsClick={(url) => setSelectedNews(url)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#006a4e] via-[#0a3d5c] to-[#1a1f3a] text-white">

      {/* Mobile Quick Action Bar - Football Specific */}
      <div className="md:hidden sticky top-16 z-40 bg-gradient-to-r from-[#009b3a] via-[#fedf00] to-[#002776] shadow-lg">
        <div className="flex items-center justify-around py-2 px-2">
          {/* Live Matches */}
          {liveMatches.length > 0 && (
            <button
              onClick={() => liveMatchesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/20 transition-all active:scale-95"
            >
              <div className="relative">
                <PlayIcon className="w-5 h-5 text-red-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-ping" />
              </div>
              <span className="text-[9px] font-bold text-black">AO VIVO</span>
            </button>
          )}
          
          {/* Teams */}
          <button
            onClick={() => teamsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/20 transition-all active:scale-95"
          >
            <UsersIcon className="w-5 h-5 text-black" />
            <span className="text-[9px] font-bold text-black">TIMES</span>
          </button>
          
          {/* Scorers */}
          <button
            onClick={() => scorersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/20 transition-all active:scale-95"
          >
            <TargetIcon className="w-5 h-5 text-black" />
            <span className="text-[9px] font-bold text-black">ARTILHARIA</span>
          </button>
          
          {/* Standings */}
          <button
            onClick={() => standingsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/20 transition-all active:scale-95"
          >
            <TrophyIcon className="w-5 h-5 text-black" />
            <span className="text-[9px] font-bold text-black">TABELA</span>
          </button>
          
          {/* Top Scorer */}
          {sportmonksScorers.length > 0 && (
            <button
              onClick={() => scorersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="flex flex-col items-center gap-1 px-2 py-1 rounded-lg hover:bg-white/20 transition-all active:scale-95"
            >
              <AwardIcon className="w-5 h-5 text-black" />
              <span className="text-[9px] font-bold text-black">ARTILHEIRO</span>
            </button>
          )}
        </div>
      </div>

      {/* Hero Banner - YouTube Video - Full Width */}
      <div className="relative overflow-hidden">
        {/* Video Container */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {/* YouTube Iframe */}
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/tXVf_5VSvQo?autoplay=1&mute=1&loop=1&playlist=tXVf_5VSvQo&controls=0&modestbranding=1&showinfo=0&rel=0&disablekb=1&fs=0&playsinline=1&iv_load_policy=3"
            title="Brasileirão - RedFlix"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{
              pointerEvents: 'none'
            }}
          />
          
          {/* Overlay Gradient - Top (extends header) */}
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black via-black/70 to-transparent z-10 pointer-events-none" />
          
          {/* Overlay Gradient - Bottom */}
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black via-black/90 to-transparent z-10 pointer-events-none" />
          
          {/* Side Vignette - Left */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-black/50 to-transparent z-10 pointer-events-none" />
          
          {/* Side Vignette - Right */}
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-black/50 to-transparent z-10 pointer-events-none" />
          
          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center px-4 pointer-events-none">
            <div className="max-w-6xl mx-auto text-center space-y-6">
              {/* Brazil Flag Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-4">
                <svg viewBox="0 0 720 504" className="w-full h-full drop-shadow-2xl">
                  {/* Verde */}
                  <rect width="720" height="504" fill="#009b3a"/>
                  {/* Losango Amarelo */}
                  <path d="M360,7.5L649.5,252L360,496.5L70.5,252L360,7.5z" fill="#fedf00"/>
                  {/* Círculo Azul */}
                  <circle cx="360" cy="252" r="104" fill="#002776"/>
                  {/* Faixa Branca */}
                  <path d="M360,148 A104,104 0 0,1 464,252 A104,104 0 0,1 360,356" fill="none" stroke="#fff" strokeWidth="10"/>
                  {/* Texto "ORDEM E PROGRESSO" simplificado */}
                  <text x="360" y="258" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="#fff" textAnchor="middle">
                    ORDEM E PROGRESSO
                  </text>
                  {/* Estrelas (representativas) */}
                  <circle cx="360" cy="200" r="3" fill="#fff"/>
                  <circle cx="380" cy="215" r="2.5" fill="#fff"/>
                  <circle cx="340" cy="215" r="2.5" fill="#fff"/>
                  <circle cx="360" cy="230" r="2" fill="#fff"/>
                  <circle cx="390" cy="290" r="2" fill="#fff"/>
                  <circle cx="330" cy="290" r="2" fill="#fff"/>
                </svg>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tight drop-shadow-2xl">
                Campeonato Brasileiro
              </h1>

              {/* Subtitle */}
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#FFD700] drop-shadow-xl">
                Série A • 2025
              </div>

              {/* Stats Pills */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-6 pointer-events-auto">
                <div className="flex items-center gap-3 bg-black/80 backdrop-blur-lg px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-[#FFD700]/40 shadow-2xl hover:border-[#FFD700] transition-all duration-300 hover:scale-105">
                  <TrophyIcon className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700]" />
                  <span className="font-black text-white text-base md:text-lg">{teams.length} Times</span>
                </div>
                <div className="flex items-center gap-3 bg-black/80 backdrop-blur-lg px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-blue-400/40 shadow-2xl hover:border-blue-400 transition-all duration-300 hover:scale-105">
                  <CalendarIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                  <span className="font-black text-white text-base md:text-lg">{upcomingMatches.length} Jogos</span>
                </div>
                <div className="flex items-center gap-3 bg-black/80 backdrop-blur-lg px-6 py-3 md:px-8 md:py-4 rounded-full border-2 border-green-400/40 shadow-2xl hover:border-green-400 transition-all duration-300 hover:scale-105">
                  <div className="relative">
                    <TrendingUpIcon className="w-5 h-5 md:w-6 md:h-6 text-green-400" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping" />
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                  <span className="font-black text-white text-base md:text-lg">Ao Vivo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Próximos Jogos - PRIMEIRA SEÇÃO */}
      <div className="px-4 md:px-12 pt-12 pb-8">
        <div className="flex items-center gap-3 mb-8">
          <CalendarIcon className="w-7 h-7 text-[#FFD700]" />
          <h2 className="text-3xl font-bold text-white">Próximos Jogos</h2>
        </div>

        {upcomingMatches.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-300 text-lg">Nenhum jogo agendado no momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {upcomingMatches.slice(0, 6).map((match) => (
              <div
                key={match.id}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/20"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {new Date(match.utcDate).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFD700]/20 px-3 py-1 rounded-full">
                    <ClockIcon className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-sm font-semibold text-[#FFD700]">
                      {new Date(match.utcDate).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between gap-8 mb-6">
                  {/* Home Team */}
                  <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {match.homeTeam.crest && (
                        <img 
                          src={match.homeTeam.crest} 
                          alt={match.homeTeam.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <span className="text-white font-semibold text-center text-sm md:text-base">
                      {match.homeTeam.shortName || match.homeTeam.name}
                    </span>
                  </div>

                  {/* VS Divider */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center">
                      <span className="text-[#FFD700] font-black text-sm">VS</span>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {match.awayTeam.crest && (
                        <img 
                          src={match.awayTeam.crest} 
                          alt={match.awayTeam.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <span className="text-white font-semibold text-center text-sm md:text-base">
                      {match.awayTeam.shortName || match.awayTeam.name}
                    </span>
                  </div>
                </div>

                {/* Match Info */}
                <div className="border-t border-gray-800 pt-4 space-y-2">
                  {match.matchday && (
                    <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 px-3 py-1.5 rounded-full">
                      <TrophyIcon className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm font-bold text-[#FFD700]">
                        {match.matchday}ª Rodada - Brasileirão 2025
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Section */}
      <div className="px-4 md:px-12 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {/* Total Teams */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#FFD700]/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-[#FFD700]" />
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-1">{teams.length}</div>
            <div className="text-sm text-gray-300">Times Participantes</div>
          </div>

          {/* Upcoming Matches */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-400/50 transition-all duration-300">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-blue-400/20 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <div className="text-4xl font-black text-white mb-1">{upcomingMatches.length}</div>
            <div className="text-sm text-gray-300">Jogos Agendados</div>
          </div>

          {/* Leader */}
          {standings.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-green-400/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-green-400/20 rounded-full p-2">
                  <TeamLogo
                    src={standings[0].team.crest}
                    alt={standings[0].team.name}
                    size="sm"
                  />
                </div>
              </div>
              <div className="text-2xl font-black text-white mb-1 line-clamp-1">
                {standings[0].team.shortName || standings[0].team.name}
              </div>
              <div className="text-sm text-gray-300">Líder do Campeonato</div>
            </div>
          )}

          {/* Total Points Leader */}
          {standings.length > 0 && (
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#FFD700]/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                  <TrendingUpIcon className="w-6 h-6 text-[#FFD700]" />
                </div>
              </div>
              <div className="text-4xl font-black text-white mb-1">{standings[0].points}</div>
              <div className="text-sm text-gray-300">Pontos do Líder</div>
            </div>
          )}
        </div>
      </div>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div ref={liveMatchesRef} className="relative px-4 md:px-12 mb-16 scroll-mt-32">
          <div className="bg-gradient-to-br from-red-600/20 via-red-500/10 to-orange-600/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-red-500/50 shadow-2xl animate-pulse-slow">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute"></div>
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">🔴 AO VIVO AGORA</h2>
              <div className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                LIVE
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {liveMatches.map((match: any) => (
                <div
                  key={match.id}
                  className="bg-black/60 backdrop-blur-md rounded-xl p-6 border border-red-500/30 hover:border-red-500 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-500 text-sm font-bold">AO VIVO</span>
                    </div>
                    {match.league?.data?.name && (
                      <span className="text-xs text-gray-400">{match.league.data.name}</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-white font-semibold text-center text-sm">
                        {match.participants?.data?.[0]?.name || 'Time 1'}
                      </div>
                      <div className="text-4xl font-black text-white">
                        {match.scores?.data?.[0]?.score?.goals || 0}
                      </div>
                    </div>

                    {/* VS */}
                    <div className="text-gray-400 font-bold">VS</div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-white font-semibold text-center text-sm">
                        {match.participants?.data?.[1]?.name || 'Time 2'}
                      </div>
                      <div className="text-4xl font-black text-white">
                        {match.scores?.data?.[1]?.score?.goals || 0}
                      </div>
                    </div>
                  </div>

                  {/* Match Time */}
                  <div className="mt-4 text-center">
                    <div className="text-[#FFD700] font-bold text-lg">
                      {match.state?.state || 'Em andamento'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Teams Grid - Enhanced Section */}
      <div ref={teamsRef} className="relative px-4 md:px-12 mb-16 scroll-mt-32">
        <div className="bg-gradient-to-br from-green-600/10 via-yellow-500/5 to-blue-600/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#009b3a] to-[#FFD700] flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-black text-white">⚽ Times do Brasileirão Série A</h2>
                <p className="text-sm text-gray-400">Clique no escudo para ver detalhes completos do time</p>
              </div>
            </div>
            <div className="px-4 py-2 bg-[#009b3a]/20 rounded-full border border-[#009b3a]/30">
              <span className="text-sm font-bold text-[#009b3a]">{teams.length} Times</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {teams.map((team, index) => {
              const position = standings.find(s => s.team.id === team.id)?.position || index + 1;
              const points = standings.find(s => s.team.id === team.id)?.points || 0;
              
              let badgeColor = 'bg-gray-600';
              if (position <= 4) badgeColor = 'bg-blue-600';
              else if (position <= 6) badgeColor = 'bg-green-600';
              else if (position >= 17) badgeColor = 'bg-red-600';
              
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeam(team)}
                  className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#FFD700] transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl"
                >
                  <div className={`absolute top-3 left-3 w-8 h-8 rounded-full ${badgeColor} flex items-center justify-center text-white font-bold text-sm border-2 border-white/20 shadow-lg`}>
                    {position}
                  </div>

                  <div className="relative w-20 h-20 mx-auto mb-4 mt-2">
                    {team.crest && (
                      <img 
                        src={team.crest} 
                        alt={team.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-2xl"
                      />
                    )}
                  </div>

                  <h3 className="text-white font-bold text-center mb-2 line-clamp-2 min-h-[3rem] flex items-center justify-center">
                    {team.shortName || team.name}
                  </h3>

                  <div className="flex items-center justify-center gap-4 text-xs mb-3">
                    <div className="text-center">
                      <div className="text-[#FFD700] font-black text-lg">{points}</div>
                      <div className="text-gray-400">pts</div>
                    </div>
                  </div>

                  {/* Click to view indicator */}
                  <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[#FFD700] text-xs font-semibold">Clique para detalhes →</span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#FFD700]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                </button>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-wrap gap-4 justify-center text-xs">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-600 border border-white/20"></div>
                <span className="text-gray-400">Libertadores (G4)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-600 border border-white/20"></div>
                <span className="text-gray-400">Pré-Libertadores (G6)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-600 border border-white/20"></div>
                <span className="text-gray-400">Rebaixamento (Z4)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Scorers Table - Enhanced with Sportmonks */}
      {(sportmonksScorers.length > 0 || topScorers.length > 0) && (
        <div ref={scorersRef} className="relative px-4 md:px-12 mb-16 scroll-mt-32">
          <div className="bg-gradient-to-br from-[#FFD700]/10 via-[#009b3a]/5 to-[#002776]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#FFD700]/20 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <TrendingUpIcon className="w-6 h-6 text-[#FFD700]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">🔥 Artilharia do Brasileirão</h2>
              <div className="ml-auto px-3 py-1 bg-[#FFD700]/20 rounded-full border border-[#FFD700]/30">
                <span className="text-xs font-bold text-[#FFD700]">Atualizado</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-300">Pos</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-300">Jogador</th>
                    <th className="text-left py-4 px-4 text-sm font-bold text-gray-300">Time</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-gray-300">Gols</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-gray-300 hidden md:table-cell">Assistências</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-gray-300 hidden lg:table-cell">Jogos</th>
                  </tr>
                </thead>
                <tbody>
                  {(sportmonksScorers.length > 0 ? sportmonksScorers : topScorers).map((scorer: any, index: number) => {
                    const isSportmonks = sportmonksScorers.length > 0;
                    const playerName = isSportmonks ? scorer.player?.data?.display_name || scorer.player?.data?.common_name : scorer.player?.name;
                    const teamName = isSportmonks ? scorer.team?.data?.name : scorer.team?.shortName || scorer.team?.name;
                    const goals = isSportmonks ? scorer.goals_count : scorer.goals;
                    const assists = isSportmonks ? scorer.assists_count : 0;
                    const matches = isSportmonks ? scorer.appearances_count : scorer.playedMatches;
                    
                    return (
                      <tr 
                        key={`${index}-${playerName}`}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                            index === 0 ? 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500' :
                            index === 1 ? 'bg-gray-400/20 text-gray-300 border-2 border-gray-400' :
                            index === 2 ? 'bg-amber-700/20 text-amber-600 border-2 border-amber-700' :
                            'bg-white/10 text-gray-400'
                          }`}>
                            {index === 0 ? '👑' : index + 1}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="text-white font-semibold">{playerName}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-300 text-sm font-medium">{teamName}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFD700]/20">
                            <span className="text-2xl">⚽</span>
                            <span className="text-xl font-black text-[#FFD700]">{goals || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center hidden md:table-cell">
                          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/20">
                            <span className="text-lg">🎯</span>
                            <span className="text-lg font-bold text-blue-400">{assists || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-center hidden lg:table-cell">
                          <span className="text-gray-400 font-medium">{matches || 0}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* League Table / Standings */}
      {standings.length > 0 && (
        <div ref={standingsRef} className="relative px-4 md:px-12 mb-16 scroll-mt-32">
          <div className="bg-gradient-to-br from-[#009b3a]/10 via-[#002776]/5 to-[#FFD700]/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-[#009b3a]/30 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#009b3a]/20 flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-[#009b3a]" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">📊 Tabela de Classificação</h2>
              <div className="ml-auto px-3 py-1 bg-[#009b3a]/20 rounded-full border border-[#009b3a]/30">
                <span className="text-xs font-bold text-[#009b3a]">Brasileirão 2025</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-white/20">
                    <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300">#</th>
                    <th className="text-left py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300">Time</th>
                    <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300">P</th>
                    <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300 hidden sm:table-cell">J</th>
                    <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300 hidden md:table-cell">V</th>
                    <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300 hidden md:table-cell">E</th>
                    <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300 hidden md:table-cell">D</th>
                    <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300 hidden lg:table-cell">GP</th>
                    <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300 hidden lg:table-cell">GC</th>
                    <th className="text-center py-3 px-2 md:px-4 text-xs md:text-sm font-bold text-gray-300 hidden lg:table-cell">SG</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.slice(0, 20).map((team: any, index: number) => {
                    const position = team.position || index + 1;
                    const isLibertadores = position <= 4;
                    const isPreLibertadores = position >= 5 && position <= 6;
                    const isSulAmericana = position >= 7 && position <= 12;
                    const isRebaixamento = position >= 17;
                    
                    return (
                      <tr 
                        key={team.team.id}
                        className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                          isLibertadores ? 'bg-green-500/5 border-l-4 border-l-green-500' :
                          isPreLibertadores ? 'bg-blue-500/5 border-l-4 border-l-blue-500' :
                          isSulAmericana ? 'bg-orange-500/5 border-l-4 border-l-orange-500' :
                          isRebaixamento ? 'bg-red-500/5 border-l-4 border-l-red-500' :
                          'border-l-4 border-l-transparent'
                        }`}
                      >
                        <td className="py-3 px-2 md:px-4">
                          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
                            position === 1 ? 'bg-yellow-500/20 text-yellow-500 border-2 border-yellow-500' :
                            position === 2 ? 'bg-gray-400/20 text-gray-300 border border-gray-400' :
                            position === 3 ? 'bg-amber-700/20 text-amber-600 border border-amber-700' :
                            'bg-white/10 text-gray-400'
                          }`}>
                            {position === 1 ? '👑' : position}
                          </div>
                        </td>
                        <td className="py-3 px-2 md:px-4">
                          <div className="flex items-center gap-2">
                            {team.team.crest && (
                              <img 
                                src={team.team.crest} 
                                alt={team.team.shortName || team.team.name}
                                className="w-5 h-5 md:w-6 md:h-6 object-contain"
                              />
                            )}
                            <span className="text-white font-medium text-xs md:text-sm truncate max-w-[100px] md:max-w-none">
                              {team.team.shortName || team.team.name}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center">
                          <span className="text-base md:text-xl font-black text-[#FFD700]">{team.points || 0}</span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center hidden sm:table-cell">
                          <span className="text-gray-300 text-xs md:text-sm">{team.playedGames || 0}</span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center hidden md:table-cell">
                          <span className="text-green-400 font-semibold text-xs md:text-sm">{team.won || 0}</span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center hidden md:table-cell">
                          <span className="text-gray-400 text-xs md:text-sm">{team.draw || 0}</span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center hidden md:table-cell">
                          <span className="text-red-400 text-xs md:text-sm">{team.lost || 0}</span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center hidden lg:table-cell">
                          <span className="text-gray-300 text-xs md:text-sm">{team.goalsFor || 0}</span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center hidden lg:table-cell">
                          <span className="text-gray-300 text-xs md:text-sm">{team.goalsAgainst || 0}</span>
                        </td>
                        <td className="py-3 px-2 md:px-4 text-center hidden lg:table-cell">
                          <span className={`font-semibold text-xs md:text-sm ${
                            team.goalDifference > 0 ? 'text-green-400' : 
                            team.goalDifference < 0 ? 'text-red-400' : 
                            'text-gray-400'
                          }`}>
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference || 0}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-300">Libertadores (1-4)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-300">Pré-Libertadores (5-6)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-300">Sul-Americana (7-12)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span className="text-gray-300">Rebaixamento (17-20)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teams Info Section */}
      {sportsDbTeams.length > 0 && (
        <div className="relative px-4 md:px-12 mb-16">
          <div className="bg-gradient-to-br from-[#009b3a]/10 via-[#fedf00]/5 to-[#002776]/10 backdrop-blur-sm rounded-2xl p-8 border border-[#FFD700]/20 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-[#FFD700]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">Informações Detalhadas dos Times</h2>
              </div>
              <div className="md:ml-auto flex items-center gap-2">
                <div className="px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30">
                  <span className="text-xs font-bold text-green-400">{sportsDbTeams.length} Times</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sportsDbTeams.slice(0, 12).map((team) => {
                const sportsData = team.sportsDbData;
                if (!sportsData) return null;
                
                return (
                  <div
                    key={team.id}
                    className="group relative overflow-hidden bg-black/40 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:shadow-xl hover:shadow-[#FFD700]/20 hover:-translate-y-1"
                  >
                    {/* Team Banner Background - Full Card */}
                    {(sportsData.strTeamBanner || sportsData.strTeamJersey || sportsData.strStadiumThumb) && (
                      <div className="absolute inset-0 z-0">
                        <img 
                          src={
                            sportsData.strTeamBanner || 
                            sportsData.strTeamJersey || 
                            sportsData.strStadiumThumb ||
                            team.crest
                          } 
                          alt={`${team.name} background`}
                          className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-[2px]"
                        />
                        {/* Gradient Overlay for better text readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/40" />
                      </div>
                    )}

                    {/* Content Container */}
                    <div className="relative z-10">
                      {/* Team Header */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="relative w-16 h-16 flex-shrink-0">
                          {team.crest && (
                            <img 
                              src={team.crest} 
                              alt={team.name}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-white mb-1 line-clamp-2 group-hover:text-[#FFD700] transition-colors drop-shadow-md">
                            {team.name}
                          </h3>
                          {team.shortName && (
                            <p className="text-xs text-gray-400 line-clamp-1">{team.shortName}</p>
                          )}
                        </div>
                      </div>

                    {/* Team Info from TheSportsDB */}
                    <div className="space-y-2 text-sm">
                      {sportsData.strStadium && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPinIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                          <span className="line-clamp-1">{sportsData.strStadium}</span>
                        </div>
                      )}
                      
                      {sportsData.intFormedYear && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <CalendarIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span>Fundado em {sportsData.intFormedYear}</span>
                        </div>
                      )}
                      
                      {sportsData.strStadiumLocation && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPinIcon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                          <span className="line-clamp-1">{sportsData.strStadiumLocation}</span>
                        </div>
                      )}

                      {sportsData.intStadiumCapacity && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <TrophyIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span>Capacidade: {parseInt(sportsData.intStadiumCapacity).toLocaleString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                      {/* Team Description */}
                      {sportsData.strDescriptionPT && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <p className="text-xs text-gray-400 line-clamp-3">
                            {sportsData.strDescriptionPT}
                          </p>
                        </div>
                      )}

                      {/* View Details Button */}
                      <button
                        onClick={() => setSelectedTeam(team)}
                        className="mt-4 w-full px-4 py-2 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] rounded-lg border border-[#FFD700]/30 hover:border-[#FFD700] transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                      >
                        <ExternalLinkIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        <span className="text-sm font-bold">Ver Detalhes</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More Button */}
            {sportsDbTeams.length > 12 && (
              <div className="mt-8 text-center">
                <button className="px-8 py-3 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] rounded-full border-2 border-[#FFD700]/30 hover:border-[#FFD700] transition-all duration-300 font-bold">
                  Ver Todos os {sportsDbTeams.length} Times
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Remaining Matches and Libertadores */}
      <div className="px-4 md:px-12 pb-20">
        {upcomingMatches.length > 6 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <CalendarIcon className="w-7 h-7 text-[#FFD700]" />
              <h2 className="text-3xl font-bold text-white">Mais Jogos Agendados</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
              {upcomingMatches.slice(6).map((match) => (
              <div
                key={match.id}
                className="group relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/20"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <CalendarIcon className="w-4 h-4" />
                    <span>
                      {new Date(match.utcDate).toLocaleDateString('pt-BR', {
                        weekday: 'short',
                        day: '2-digit',
                        month: 'short',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#FFD700]/20 px-3 py-1 rounded-full">
                    <ClockIcon className="w-4 h-4 text-[#FFD700]" />
                    <span className="text-sm font-semibold text-[#FFD700]">
                      {new Date(match.utcDate).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Teams */}
                <div className="flex items-center justify-between gap-8 mb-6">
                  {/* Home Team */}
                  <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {match.homeTeam.crest && (
                        <img 
                          src={match.homeTeam.crest} 
                          alt={match.homeTeam.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <span className="text-white font-semibold text-center text-sm md:text-base">
                      {match.homeTeam.shortName || match.homeTeam.name}
                    </span>
                  </div>

                  {/* VS Divider */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center">
                      <span className="text-[#FFD700] font-black text-sm">VS</span>
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="relative w-20 h-20 flex items-center justify-center">
                      {match.awayTeam.crest && (
                        <img 
                          src={match.awayTeam.crest} 
                          alt={match.awayTeam.name}
                          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <span className="text-white font-semibold text-center text-sm md:text-base">
                      {match.awayTeam.shortName || match.awayTeam.name}
                    </span>
                  </div>
                </div>

                {/* Match Info - Enhanced */}
                <div className="border-t border-gray-800 pt-4 space-y-3">
                  {/* Rodada Badge */}
                  {match.matchday && (
                    <div className="inline-flex items-center gap-2 bg-[#FFD700]/20 px-3 py-1.5 rounded-full">
                      <TrophyIcon className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm font-bold text-[#FFD700]">
                        {match.matchday}ª Rodada - Brasileirão Série A 2025
                      </span>
                    </div>
                  )}

                  {/* Stadium */}
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0">
                      <MapPinIcon className="w-4 h-4 text-green-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Estádio</div>
                      <div className="font-semibold text-white">
                        {match.venue || 'Estádio a definir'}
                      </div>
                    </div>
                  </div>

                  {/* Area/Location */}
                  {match.area && (
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Local</div>
                        <div className="font-semibold text-white">
                          {match.area.name || `${match.homeTeam.name} - Brasil`}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Transmissão */}
                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                      <TvIcon className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Transmissão</div>
                      <div className="font-semibold text-white">
                        {getTransmissao(match)}
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center gap-2 text-sm pt-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-blue-400 font-semibold">Agendado</span>
                  </div>
                </div>

                {/* TV Globo Embed */}
                <div className="mt-4 border-t border-gray-800 pt-4">
                  <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl overflow-hidden border border-green-500/30">
                    {/* Embed Header */}
                    <div className="bg-gradient-to-r from-green-600 to-green-500 px-4 py-2 flex items-center justify-center gap-2">
                      <TvIcon className="w-4 h-4 text-white" />
                      <span className="text-white font-semibold text-sm">
                        Transmissão Oficial - TV Globo
                      </span>
                    </div>
                    
                    {/* Embed Content */}
                    <div className="bg-gray-900/50 p-4 text-center">
                      <a
                        href={getEmbedUrl(match)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm font-semibold"
                      >
                        <ExternalLinkIcon className="w-4 h-4" />
                        <span>Ver no GloboEsporte</span>
                      </a>
                    </div>
                    
                    {/* Embed Footer */}
                    <div className="bg-gray-800/30 px-4 py-2 text-center text-xs text-gray-400">
                      Assista na Globo e Globoplay
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#e50914]/0 to-[#e50914]/0 group-hover:from-[#e50914]/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>
              </div>
            ))}
            </div>
          </div>
        )}

        {/* Libertadores Section */}
        {libertadoresMatches.length > 0 && (
          <div className="mt-16 pt-16 border-t border-white/10">
            <div className="flex items-center gap-3 mb-8">
              <TrophyIcon className="w-7 h-7 text-[#FFD700]" />
              <h2 className="text-3xl font-bold text-white">Copa Libertadores</h2>
              <span className="px-3 py-1 bg-[#FFD700]/20 text-[#FFD700] text-sm font-bold rounded-full">
                CONMEBOL
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {libertadoresMatches.map((match) => (
                <div
                  key={match.id}
                  className="group relative bg-gradient-to-br from-[#FFD700]/10 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-[#FFD700]/30 hover:border-[#FFD700] transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/20"
                >
                  {/* Match Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {new Date(match.utcDate).toLocaleDateString('pt-BR', {
                          weekday: 'short',
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FFD700]/30 px-3 py-1 rounded-full">
                      <ClockIcon className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm font-semibold text-[#FFD700]">
                        {new Date(match.utcDate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Teams */}
                  <div className="flex items-center justify-between gap-6 mb-6">
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 md:w-20 md:h-20">
                        {match.homeTeam.crest && (
                          <img 
                            src={match.homeTeam.crest} 
                            alt={match.homeTeam.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                          />
                        )}
                      </div>
                      <span className="text-white font-semibold text-center text-sm md:text-base">
                        {match.homeTeam.shortName || match.homeTeam.name}
                      </span>
                    </div>

                    {/* VS Divider */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-[#FFD700]/30 border-2 border-[#FFD700] flex items-center justify-center">
                        <span className="text-[#FFD700] font-black text-sm">VS</span>
                      </div>
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center gap-3">
                      <div className="relative w-16 h-16 md:w-20 md:h-20">
                        {match.awayTeam.crest && (
                          <img 
                            src={match.awayTeam.crest} 
                            alt={match.awayTeam.name}
                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 drop-shadow-lg"
                          />
                        )}
                      </div>
                      <span className="text-white font-semibold text-center text-sm md:text-base">
                        {match.awayTeam.shortName || match.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  {/* Match Info - Enhanced */}
                  <div className="border-t border-[#FFD700]/20 pt-4 space-y-3">
                    {/* Competition Badge */}
                    <div className="inline-flex items-center gap-2 bg-[#FFD700]/30 px-3 py-1.5 rounded-full">
                      <TrophyIcon className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm font-bold text-[#FFD700]">
                        Copa Libertadores da América 2025
                      </span>
                    </div>

                    {/* Stadium */}
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <div className="w-8 h-8 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-4 h-4 text-green-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Estádio</div>
                        <div className="font-semibold text-white">
                          {match.venue || 'Estádio a definir'}
                        </div>
                      </div>
                    </div>

                    {/* Area/Location */}
                    {match.area && (
                      <div className="flex items-center gap-2 text-sm text-gray-200">
                        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center flex-shrink-0">
                          <MapPinIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-400">Local</div>
                          <div className="font-semibold text-white">
                            {match.area.name || 'América do Sul'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Transmissão - Libertadores */}
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <div className="w-8 h-8 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                        <TvIcon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">Transmissão</div>
                        <div className="font-semibold text-white">
                          Paramount+ e ESPN
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* TV Embed */}
                  <div className="mt-4 border-t border-[#FFD700]/20 pt-4">
                    <div className="bg-gradient-to-r from-[#FFD700]/20 to-orange-900/20 rounded-xl overflow-hidden border border-[#FFD700]/30">
                      {/* Embed Header */}
                      <div className="bg-gradient-to-r from-[#FFD700] to-orange-500 px-4 py-2 flex items-center justify-center gap-2">
                        <TrophyIcon className="w-4 h-4 text-black" />
                        <span className="text-black font-bold text-sm">
                          CONMEBOL Libertadores
                        </span>
                      </div>
                      
                      {/* Embed Content */}
                      <div className="bg-gray-900/50 p-4 text-center">
                        <a
                          href="https://www.paramountplus.com/br/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD700] hover:bg-yellow-500 text-black rounded-lg transition-colors text-sm font-bold"
                        >
                          <ExternalLinkIcon className="w-4 h-4" />
                          <span>Assistir no Paramount+</span>
                        </a>
                      </div>
                      
                      {/* Embed Footer */}
                      <div className="bg-gray-800/30 px-4 py-2 text-center text-xs text-gray-300">
                        Transmissão exclusiva Paramount+ e ESPN
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Soccer News Section - GloboEsporte Embed */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <div className="flex items-center gap-3 mb-8">
            <NewspaperIcon className="w-7 h-7 text-[#FFD700]" />
            <h2 className="text-3xl font-bold text-white">Últimas Notícias do Futebol</h2>
            <span className="px-3 py-1 bg-green-600/20 text-green-400 text-sm font-bold rounded-full">
              GloboEsporte
            </span>
          </div>

          {/* Main News Card - Opens Full GloboEsporte */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured Card - Full GE */}
            <button
              onClick={() => setSelectedNews('https://ge.globo.com/')}
              className="lg:col-span-2 group relative bg-gradient-to-br from-green-900/40 to-green-800/20 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-green-600/50 hover:border-green-500 transition-all duration-300 hover:shadow-2xl hover:shadow-green-600/30 text-left h-full min-h-[400px]"
            >
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgxMnYxMkgzNnptNDggMGgxMnYxMkg4NHpNMCAxMzRoMTJ2MTJIMHB6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
              
              {/* Content */}
              <div className="relative p-8 h-full flex flex-col justify-between">
                {/* Header */}
                <div>
                  <div className="inline-flex items-center gap-2 bg-green-600 px-4 py-2 rounded-full mb-6">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <span className="font-black text-green-600 text-sm">ge</span>
                    </div>
                    <span className="text-white font-bold">GloboEsporte</span>
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-green-300 transition-colors">
                    Acompanhe Todas as Notícias do Futebol
                  </h3>
                  
                  <p className="text-gray-300 text-lg mb-6">
                    Clique para acessar o portal completo do GloboEsporte com notícias em tempo real, 
                    vídeos, análises e tudo sobre o futebol brasileiro e mundial.
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-green-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-semibold">Notícias ao Vivo</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-semibold">Vídeos Exclusivos</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-semibold">Análises Completas</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-semibold">Jogos ao Vivo</span>
                  </div>
                </div>

                {/* CTA */}
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-lg group-hover:translate-x-2 transition-transform">
                    Acessar Portal Completo
                  </span>
                  <ExternalLinkIcon className="w-6 h-6 text-green-400 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/0 to-green-600/0 group-hover:from-green-600/10 group-hover:to-transparent transition-all duration-300"></div>
            </button>

            {/* Side Cards */}
            <div className="space-y-6">
              {/* Brasileirão Card */}
              <button
                onClick={() => setSelectedNews('https://ge.globo.com/futebol/brasileirao-serie-a/')}
                className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-yellow-500 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/20 text-left w-full p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrophyIcon className="w-6 h-6 text-yellow-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-2 group-hover:text-yellow-400 transition-colors">
                      Brasileirão Série A
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Tudo sobre o campeonato brasileiro
                    </p>
                  </div>
                  <ExternalLinkIcon className="w-5 h-5 text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </div>
              </button>

              {/* Libertadores Card */}
              <button
                onClick={() => setSelectedNews('https://ge.globo.com/futebol/libertadores/')}
                className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-orange-500 transition-all duration-300 hover:shadow-xl hover:shadow-orange-500/20 text-left w-full p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrophyIcon className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-2 group-hover:text-orange-400 transition-colors">
                      Copa Libertadores
                    </h4>
                    <p className="text-gray-400 text-sm">
                      A maior competição da América
                    </p>
                  </div>
                  <ExternalLinkIcon className="w-5 h-5 text-gray-400 group-hover:text-orange-400 transition-colors" />
                </div>
              </button>

              {/* Seleção Brasileira Card */}
              <button
                onClick={() => setSelectedNews('https://ge.globo.com/futebol/selecao-brasileira/')}
                className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-green-500 transition-all duration-300 hover:shadow-xl hover:shadow-green-500/20 text-left w-full p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">🇧🇷</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-bold text-lg mb-2 group-hover:text-green-400 transition-colors">
                      Seleção Brasileira
                    </h4>
                    <p className="text-gray-400 text-sm">
                      Notícias da Seleção Canarinho
                    </p>
                  </div>
                  <ExternalLinkIcon className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors" />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Old News Section - Keep but hidden */}
        {news.length > 0 && false && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-8">
              <NewspaperIcon className="w-7 h-7 text-[#FFD700]" />
              <h2 className="text-3xl font-bold text-white">Últimas Notícias</h2>
              <span className="text-gray-400 text-sm">GloboEsporte</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.slice(0, 9).map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedNews(item.link)}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:shadow-2xl hover:shadow-[#FFD700]/20 text-left"
                >
                  {/* News Image */}
                  {item.image && (
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    </div>
                  )}

                  {/* News Content */}
                  <div className="p-5 space-y-3">
                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <ClockIcon className="w-3 h-3" />
                      <span>
                        {new Date(item.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-semibold line-clamp-2 group-hover:text-[#e50914] transition-colors">
                      {item.title}
                    </h3>

                    {/* Description */}
                    {item.description && (
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    {/* Categories */}
                    {item.categories && item.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.categories.slice(0, 3).map((cat: string, catIndex: number) => (
                          <span
                            key={catIndex}
                            className="text-xs bg-[#e50914]/20 text-[#e50914] px-2 py-1 rounded-full"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Read More */}
                    <div className="flex items-center gap-2 text-sm text-[#FFD700] font-semibold pt-2">
                      <span>Ler notícia</span>
                      <ExternalLinkIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/0 to-[#FFD700]/0 group-hover:from-[#FFD700]/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Mini Standings */}
        {standings.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <TrophyIcon className="w-7 h-7 text-[#FFD700]" />
              <h2 className="text-3xl font-bold text-white">Classificação</h2>
              <span className="text-gray-400 text-sm">(Top 10)</span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#FFD700]/90 text-black">
                      <th className="p-4 text-left text-sm">Pos</th>
                      <th className="p-4 text-left text-sm">Time</th>
                      <th className="p-4 text-center text-sm">PG</th>
                      <th className="p-4 text-center text-sm">J</th>
                      <th className="p-4 text-center text-sm">V</th>
                      <th className="p-4 text-center text-sm">E</th>
                      <th className="p-4 text-center text-sm">D</th>
                      <th className="p-4 text-center text-sm">SG</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.slice(0, 10).map((team: any, index: number) => (
                      <tr 
                        key={team.team.id}
                        className={`border-b border-white/10 hover:bg-[#FFD700]/10 transition-colors ${
                          index < 4 ? 'bg-green-500/10' : ''
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-bold text-[#FFD700] text-lg">
                            {team.position}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {team.team.crest && (
                              <img 
                                src={team.team.crest} 
                                alt={team.team.name}
                                className="w-8 h-8 object-contain"
                              />
                            )}
                            <span className="font-semibold text-white">
                              {team.team.shortName || team.team.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="font-bold text-white text-lg">
                            {team.points}
                          </span>
                        </td>
                        <td className="p-4 text-center text-gray-400">{team.playedGames}</td>
                        <td className="p-4 text-center text-green-400">{team.won}</td>
                        <td className="p-4 text-center text-yellow-400">{team.draw}</td>
                        <td className="p-4 text-center text-red-400">{team.lost}</td>
                        <td className="p-4 text-center">
                          <span className={team.goalDifference > 0 ? 'text-green-400' : team.goalDifference < 0 ? 'text-red-400' : 'text-gray-400'}>
                            {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-black/40 border-t border-gray-800 flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-900/40 border border-green-700"></div>
                  <span className="text-gray-400">Libertadores</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfers Section */}
        {transfers.length > 0 && (
          <div ref={transfersRef} className="mt-16 scroll-mt-32">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                <UsersIcon className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">💼 Transferências Recentes</h2>
              <div className="ml-auto px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30">
                <span className="text-xs font-bold text-purple-400">Últimos 3 meses</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {transfers.slice(0, 12).map((transfer: any, index: number) => (
                <div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
                >
                  {/* Player Info */}
                  <div className="mb-4">
                    <h4 className="text-white font-bold text-lg mb-1">
                      {transfer.player?.data?.display_name || transfer.player?.data?.common_name || 'Jogador'}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {transfer.position?.data?.name || 'Posição não informada'}
                    </p>
                  </div>

                  {/* Transfer Arrow */}
                  <div className="flex items-center gap-3 mb-4">
                    {/* From Team */}
                    <div className="flex-1 text-center">
                      <div className="text-xs text-gray-500 mb-1">De:</div>
                      <div className="text-sm text-white font-medium line-clamp-2">
                        {transfer.fromTeam?.data?.name || 'Clube anterior'}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="text-purple-400 text-2xl">→</div>

                    {/* To Team */}
                    <div className="flex-1 text-center">
                      <div className="text-xs text-gray-500 mb-1">Para:</div>
                      <div className="text-sm text-white font-medium line-clamp-2">
                        {transfer.toTeam?.data?.name || 'Novo clube'}
                      </div>
                    </div>
                  </div>

                  {/* Transfer Details */}
                  <div className="border-t border-white/10 pt-4 space-y-2">
                    {transfer.amount && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Valor:</span>
                        <span className="text-green-400 font-bold">
                          € {parseInt(transfer.amount).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                    {transfer.date && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Data:</span>
                        <span className="text-white text-sm">
                          {new Date(transfer.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    {transfer.type && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">Tipo:</span>
                        <span className="text-purple-400 text-sm font-medium">
                          {transfer.type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assists Leaders Section */}
        {assists.length > 0 && (
          <div ref={assistsRef} className="mt-16 scroll-mt-32">
            <div className="bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-cyan-500/10 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/20 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <TargetIcon className="w-6 h-6 text-blue-400" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">🎯 Garçons do Brasileirão</h2>
                <div className="ml-auto px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30">
                  <span className="text-xs font-bold text-blue-400">Assistências</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-300">Pos</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-300">Jogador</th>
                      <th className="text-left py-4 px-4 text-sm font-bold text-gray-300">Time</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-gray-300">Assistências</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-gray-300 hidden md:table-cell">Gols</th>
                      <th className="text-center py-4 px-4 text-sm font-bold text-gray-300 hidden lg:table-cell">Jogos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assists.map((player: any, index: number) => {
                      const playerName = player.player?.data?.display_name || player.player?.data?.common_name;
                      const teamName = player.team?.data?.name;
                      const assistsCount = player.assists_count || 0;
                      const goalsCount = player.goals_count || 0;
                      const matches = player.appearances_count || 0;
                      
                      return (
                        <tr 
                          key={`${index}-${playerName}`}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                              index === 0 ? 'bg-blue-500/20 text-blue-400 border-2 border-blue-500' :
                              index === 1 ? 'bg-cyan-400/20 text-cyan-300 border-2 border-cyan-400' :
                              index === 2 ? 'bg-sky-400/20 text-sky-300 border-2 border-sky-400' :
                              'bg-white/10 text-gray-400'
                            }`}>
                              {index === 0 ? '🎯' : index + 1}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-white font-semibold">{playerName}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-300 text-sm font-medium">{teamName}</span>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/20">
                              <span className="text-2xl">🅰️</span>
                              <span className="text-xl font-black text-blue-400">{assistsCount}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center hidden md:table-cell">
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#FFD700]/20">
                              <span className="text-lg">⚽</span>
                              <span className="text-lg font-bold text-[#FFD700]">{goalsCount}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center hidden lg:table-cell">
                            <span className="text-gray-400 font-medium">{matches}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Rounds Calendar Section */}
        {rounds.length > 0 && (
          <div className="mt-16 mb-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-[#FFD700]" />
              </div>
              <h2 className="text-3xl font-bold text-white">🗓️ Calendário de Rodadas</h2>
              <div className="ml-auto px-3 py-1 bg-[#FFD700]/20 rounded-full border border-[#FFD700]/30">
                <span className="text-xs font-bold text-[#FFD700]">{rounds.length} Rodadas</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {rounds.slice(0, 38).map((round: any, index: number) => {
                const roundNumber = round.name?.match(/\\d+/)?.[0] || index + 1;
                const fixturesCount = round.fixtures?.data?.length || 0;
                
                return (
                  <div
                    key={round.id}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-[#FFD700] transition-all duration-300 hover:shadow-lg hover:shadow-[#FFD700]/20 text-center"
                  >
                    <div className="text-[#FFD700] font-black text-3xl mb-2">
                      {roundNumber}
                    </div>
                    <div className="text-white font-semibold text-sm mb-2">
                      Rodada
                    </div>
                    {fixturesCount > 0 && (
                      <div className="text-gray-400 text-xs">
                        {fixturesCount} jogos
                      </div>
                    )}
                    {round.starting_at && (
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(round.starting_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
