// RedFlix - Team Details Component
import React, { useEffect, useState } from 'react';
import { 
  ArrowLeftIcon as ArrowLeft, 
  CalendarIcon as Calendar, 
  MapPinIcon as MapPin, 
  TrophyIcon as Trophy, 
  ClockIcon as Clock, 
  NewspaperIcon as Newspaper, 
  ExternalLinkIcon as ExternalLink, 
  TrendingUpIcon as TrendingUp, 
  RssIcon as Rss 
} from './Icons';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getTeamColors, getTextColor } from '../utils/teamColors';
import { getTeamRssFeed } from '../utils/teamRssFeeds';
import { getTeamGloboUrl } from '../utils/teamGloboUrls';

interface TeamDetailsProps {
  team: any;
  onClose: () => void;
  onNewsClick: (url: string) => void;
}

export function TeamDetails({ team, onClose, onNewsClick }: TeamDetailsProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [libertadoresMatches, setLibertadoresMatches] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [teamInfo, setTeamInfo] = useState<any>(null);
  const [scorers, setScorers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsLoading, setNewsLoading] = useState(true);
  const [hasSpecificFeed, setHasSpecificFeed] = useState(false);
  
  const teamColors = getTeamColors(team.name);
  const textColor = getTextColor(teamColors.primary);
  const teamRssFeed = getTeamRssFeed(team.name);
  
  // Check if team qualifies for Libertadores (Flamengo or Palmeiras)
  const isLibertadoresTeam = team.name.toLowerCase().includes('flamengo') || team.name.toLowerCase().includes('palmeiras');

  useEffect(() => {
    // Team details desabilitado - servidor removido
    setLoading(false);
    setNewsLoading(false);
  }, [team.id]);

  async function fetchTeamData() {
    setLoading(true);
    
    try {
      // Fetch team matches
      const matchesResp = await fetch(`${serverUrl}/football/teams/${team.id}/matches`, {
        headers: { "Authorization": `Bearer ${publicAnonKey}` },
      });
      
      if (matchesResp.ok) {
        const matchesData = await matchesResp.json();
        const allMatches = matchesData.matches || [];
        
        // Get next 6 matches
        const upcoming = allMatches
          .filter((m: any) => m.status === 'SCHEDULED' || m.status === 'TIMED')
          .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
          .slice(0, 6);
        
        setMatches(upcoming);

        // Calculate stats from all matches
        const played = allMatches.filter((m: any) => m.status === 'FINISHED');
        const wins = played.filter((m: any) => {
          const homeWin = m.homeTeam.id === team.id && m.score.fullTime.home > m.score.fullTime.away;
          const awayWin = m.awayTeam.id === team.id && m.score.fullTime.away > m.score.fullTime.home;
          return homeWin || awayWin;
        }).length;
        
        setStats({
          played: played.length,
          wins,
          draws: played.filter((m: any) => m.score.fullTime.home === m.score.fullTime.away).length,
          losses: played.length - wins - played.filter((m: any) => m.score.fullTime.home === m.score.fullTime.away).length,
        });
      }

      // Fetch team news - use specific RSS feed if available
      setNewsLoading(true);
      
      if (teamRssFeed) {
        console.log(`📰 Using specific RSS feed for ${team.name}: ${teamRssFeed}`);
        setHasSpecificFeed(true);
        
        const encodedFeed = encodeURIComponent(teamRssFeed);
        const newsResp = await fetch(`${serverUrl}/team-news/${encodedFeed}`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (newsResp.ok) {
          const newsData = await newsResp.json();
          setNews(newsData.items || []);
          console.log(`✅ Loaded ${newsData.items?.length || 0} team-specific news items`);
        }
      } else {
        console.log(`📰 Using general news filtered by team name: ${team.name}`);
        setHasSpecificFeed(false);
        
        const newsResp = await fetch(`${serverUrl}/soccer-news?team=${encodeURIComponent(team.name)}`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (newsResp.ok) {
          const newsData = await newsResp.json();
          setNews(newsData.items || []);
          console.log(`✅ Loaded ${newsData.items?.length || 0} filtered news items`);
        }
      }
      
      // Fetch team detailed info
      try {
        const teamResp = await fetch(`${serverUrl}/football/teams/${team.id}`, {
          headers: { "Authorization": `Bearer ${publicAnonKey}` },
        });
        
        if (teamResp.ok) {
          const teamData = await teamResp.json();
          setTeamInfo(teamData);
          
          // Extract scorers from squad
          if (teamData.squad) {
            const scorersData = teamData.squad
              .filter((player: any) => player.position === 'Offence')
              .slice(0, 5)
              .map((player: any) => ({
                name: player.name,
                position: player.position,
                nationality: player.nationality,
              }));
            setScorers(scorersData);
          }
        }
      } catch (err) {
        console.error('Error fetching team info:', err);
      }
      
      // Fetch Libertadores matches if team qualifies
      if (isLibertadoresTeam) {
        try {
          console.log(`🏆 Attempting to fetch Libertadores matches for ${team.name}...`);
          const libertadoresId = 2152; // Copa Libertadores
          
          const libResp = await fetch(`${serverUrl}/football/competitions/${libertadoresId}/matches`, {
            headers: { "Authorization": `Bearer ${publicAnonKey}` },
          });
          
          console.log(`🏆 Libertadores API response status: ${libResp.status}`);
          
          if (libResp.ok) {
            const libData = await libResp.json();
            console.log(`🏆 Libertadores API returned ${libData.matches?.length || 0} total matches`);
            
            const teamLibMatches = (libData.matches || [])
              .filter((m: any) => 
                m.homeTeam.id === team.id || m.awayTeam.id === team.id
              )
              .filter((m: any) => m.status === 'SCHEDULED' || m.status === 'TIMED')
              .sort((a: any, b: any) => new Date(a.utcDate).getTime() - new Date(b.utcDate).getTime())
              .slice(0, 4);
            
            setLibertadoresMatches(teamLibMatches);
            console.log(`✅ Found ${teamLibMatches.length} Libertadores matches for ${team.name}`);
          } else {
            const errorText = await libResp.text();
            console.warn(`⚠️ Libertadores API error: ${libResp.status} - ${errorText}`);
            // Don't fail, just set empty array
            setLibertadoresMatches([]);
          }
        } catch (err) {
          console.error(`❌ Error fetching Libertadores matches for ${team.name}:`, err);
          // Don't fail, just set empty array
          setLibertadoresMatches([]);
        }
      } else {
        // Not a Libertadores team, set empty array
        setLibertadoresMatches([]);
      }
      
      setNewsLoading(false);
      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching team data:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white">Carregando informações do time...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br ${teamColors.gradient} overflow-y-auto`}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors hover:bg-white/10"
            style={{ backgroundColor: teamColors.primary }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      {/* Team Banner */}
      <div className="relative h-80 bg-black/30 backdrop-blur-sm">
        <div className="absolute inset-0 opacity-10">
          {team.crest && (
            <img 
              src={team.crest} 
              alt={team.name}
              className="w-full h-full object-contain blur-3xl scale-150"
            />
          )}
        </div>
        
        <div className="relative h-full flex flex-col items-center justify-center px-4">
          <div className="w-32 h-32 mb-6">
            {team.crest && (
              <img 
                src={team.crest} 
                alt={team.name}
                className="w-full h-full object-contain drop-shadow-2xl"
              />
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white text-center mb-4">
            {team.name}
          </h1>
          
          {team.venue && (
            <div className="flex items-center gap-2 text-gray-400">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{team.venue}</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="text-4xl font-black text-white mb-2">{stats.played}</div>
              <div className="text-sm text-gray-200">Jogos</div>
            </div>
            <div className="bg-green-500/20 backdrop-blur-sm rounded-xl p-6 border border-green-500/50">
              <div className="text-4xl font-black text-green-400 mb-2">{stats.wins}</div>
              <div className="text-sm text-gray-200">Vitórias</div>
            </div>
            <div className="bg-yellow-500/20 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/50">
              <div className="text-4xl font-black text-yellow-400 mb-2">{stats.draws}</div>
              <div className="text-sm text-gray-200">Empates</div>
            </div>
            <div className="bg-red-500/20 backdrop-blur-sm rounded-xl p-6 border border-red-500/50">
              <div className="text-4xl font-black text-red-400 mb-2">{stats.losses}</div>
              <div className="text-sm text-gray-200">Derrotas</div>
            </div>
          </div>
        )}

        {/* Team Information */}
        {teamInfo && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-7 h-7" style={{ color: teamColors.accent }} />
              <h2 className="text-3xl font-bold text-white">Informações do Time</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {teamInfo.founded && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-sm text-gray-300 mb-2">Fundado em</div>
                  <div className="text-3xl font-black text-white">{teamInfo.founded}</div>
                </div>
              )}
              
              {teamInfo.venue && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-sm text-gray-300 mb-2">Estádio</div>
                  <div className="text-2xl font-bold text-white">{teamInfo.venue}</div>
                </div>
              )}
              
              {teamInfo.clubColors && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-sm text-gray-300 mb-2">Cores</div>
                  <div className="text-xl font-semibold text-white">{teamInfo.clubColors}</div>
                </div>
              )}
              
              {teamInfo.coach?.name && (
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                  <div className="text-sm text-gray-300 mb-2">Treinador</div>
                  <div className="text-xl font-semibold text-white">{teamInfo.coach.name}</div>
                  {teamInfo.coach.nationality && (
                    <div className="text-sm text-gray-400 mt-1">{teamInfo.coach.nationality}</div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top Scorers */}
        {scorers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-7 h-7" style={{ color: teamColors.accent }} />
              <h2 className="text-3xl font-bold text-white">Principais Atacantes</h2>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <div className="space-y-4">
                {scorers.map((scorer, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ 
                        backgroundColor: `${teamColors.primary}40`,
                        color: teamColors.accent
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-lg">{scorer.name}</div>
                      {scorer.nationality && (
                        <div className="text-gray-400 text-sm">{scorer.nationality}</div>
                      )}
                    </div>
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-semibold"
                      style={{ 
                        backgroundColor: `${teamColors.accent}30`,
                        color: teamColors.accent
                      }}
                    >
                      {scorer.position}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Upcoming Matches */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-7 h-7" style={{ color: teamColors.accent }} />
            <h2 className="text-3xl font-bold text-white">Próximos Jogos</h2>
          </div>

          {matches.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 border border-white/20 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-200 text-lg">Nenhum jogo agendado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 transition-all hover:border-white/40 hover:bg-white/15"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(match.utcDate).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div 
                      className="flex items-center gap-2 px-3 py-1 rounded-full"
                      style={{ backgroundColor: `${teamColors.primary}40` }}
                    >
                      <Clock className="w-4 h-4" style={{ color: teamColors.accent }} />
                      <span className="text-sm font-semibold" style={{ color: teamColors.accent }}>
                        {new Date(match.utcDate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      {match.homeTeam.crest && (
                        <img 
                          src={match.homeTeam.crest} 
                          alt={match.homeTeam.name}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                      <span className="text-white font-semibold text-center text-sm">
                        {match.homeTeam.shortName || match.homeTeam.name}
                      </span>
                    </div>

                    <div 
                      className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                      style={{ 
                        backgroundColor: `${teamColors.primary}20`,
                        borderColor: teamColors.accent
                      }}
                    >
                      <span className="font-black text-xs" style={{ color: teamColors.accent }}>VS</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2">
                      {match.awayTeam.crest && (
                        <img 
                          src={match.awayTeam.crest} 
                          alt={match.awayTeam.name}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                      <span className="text-white font-semibold text-center text-sm">
                        {match.awayTeam.shortName || match.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  {match.venue && (
                    <div className="flex items-center gap-2 text-sm text-gray-200 mt-4 pt-4 border-t border-white/20">
                      <MapPin className="w-4 h-4" />
                      <span>{match.venue}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Copa Libertadores - Only for Flamengo and Palmeiras */}
        {isLibertadoresTeam && libertadoresMatches.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-7 h-7 text-[#FFD700]" />
              <h2 className="text-3xl font-bold text-white">Copa Libertadores da América</h2>
              <span className="px-3 py-1.5 bg-[#FFD700]/20 text-[#FFD700] text-sm font-bold rounded-full border border-[#FFD700]/30">
                CONMEBOL
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {libertadoresMatches.map((match) => (
                <div
                  key={match.id}
                  className="bg-gradient-to-br from-[#FFD700]/10 to-transparent backdrop-blur-sm rounded-xl p-6 border-2 border-[#FFD700]/30 hover:border-[#FFD700] transition-all hover:shadow-2xl hover:shadow-[#FFD700]/20"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-200">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(match.utcDate).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[#FFD700]/20 px-3 py-1 rounded-full">
                      <Clock className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm font-semibold text-[#FFD700]">
                        {new Date(match.utcDate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1 flex flex-col items-center gap-2">
                      {match.homeTeam.crest && (
                        <img 
                          src={match.homeTeam.crest} 
                          alt={match.homeTeam.name}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                      <span className="text-white font-semibold text-center text-sm">
                        {match.homeTeam.shortName || match.homeTeam.name}
                      </span>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700] flex items-center justify-center">
                      <span className="font-black text-xs text-[#FFD700]">VS</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center gap-2">
                      {match.awayTeam.crest && (
                        <img 
                          src={match.awayTeam.crest} 
                          alt={match.awayTeam.name}
                          className="w-16 h-16 object-contain"
                        />
                      )}
                      <span className="text-white font-semibold text-center text-sm">
                        {match.awayTeam.shortName || match.awayTeam.name}
                      </span>
                    </div>
                  </div>

                  {match.venue && (
                    <div className="flex items-center gap-2 text-sm text-gray-200 mt-4 pt-4 border-t border-[#FFD700]/20">
                      <MapPin className="w-4 h-4 text-[#FFD700]" />
                      <span>{match.venue}</span>
                    </div>
                  )}

                  {/* Paramount+ Streaming Info */}
                  <div className="mt-4 pt-4 border-t border-[#FFD700]/20">
                    <div className="flex items-center gap-2 text-sm text-gray-300">
                      <ExternalLink className="w-4 h-4 text-purple-400" />
                      <span>Transmissão:</span>
                      <span className="font-semibold text-purple-400">Paramount+ e ESPN</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Team News - GloboEsporte Embed */}
        <div>
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <div className="flex items-center gap-3">
              <Newspaper className="w-7 h-7" style={{ color: teamColors.accent }} />
              <h2 className="text-3xl font-bold text-white">Notícias do {team.name}</h2>
            </div>
            
            <div 
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{ 
                backgroundColor: `${teamColors.accent}30`,
                color: teamColors.accent,
                border: `1px solid ${teamColors.accent}50`
              }}
            >
              <Rss className="w-4 h-4" />
              <span>Portal Oficial GloboEsporte</span>
            </div>
          </div>

          {/* Main News Card - Opens Team-Specific GE Page */}
          <button
            onClick={() => onNewsClick(getTeamGloboUrl(team.name))}
            className="group relative w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border-2 hover:border-white/40 transition-all duration-300 hover:shadow-2xl text-left min-h-[300px]"
            style={{ 
              borderColor: `${teamColors.accent}50`,
              boxShadow: `0 10px 40px ${teamColors.primary}20`
            }}
          >
            {/* Background Pattern with Team Colors */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{ 
                background: `linear-gradient(135deg, ${teamColors.primary} 0%, ${teamColors.secondary} 100%)`
              }}
            ></div>
            
            {/* Content */}
            <div className="relative p-8 h-full flex flex-col justify-between">
              {/* Header */}
              <div>
                <div 
                  className="inline-flex items-center gap-3 px-4 py-2 rounded-full mb-6"
                  style={{ 
                    backgroundColor: `${teamColors.accent}40`,
                    border: `2px solid ${teamColors.accent}`
                  }}
                >
                  {team.crest && (
                    <img 
                      src={team.crest} 
                      alt={team.name}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    <span className="font-black text-green-600 text-sm">ge</span>
                  </div>
                  <span className="text-white font-bold">GloboEsporte</span>
                </div>

                <h3 
                  className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:scale-105 transition-transform"
                  style={{ textShadow: `2px 2px 8px ${teamColors.primary}80` }}
                >
                  Todas as Notícias do {team.name}
                </h3>
                
                <p className="text-gray-200 text-lg mb-6">
                  Acesse o portal completo do GloboEsporte dedicado ao {team.name} com 
                  notícias exclusivas, vídeos, análises, bastidores e tudo sobre o time.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2" style={{ color: teamColors.accent }}>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: teamColors.accent }}
                  ></div>
                  <span className="text-sm font-semibold text-white">Notícias em Tempo Real</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: teamColors.accent }}>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: teamColors.accent }}
                  ></div>
                  <span className="text-sm font-semibold text-white">Vídeos Exclusivos</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: teamColors.accent }}>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: teamColors.accent }}
                  ></div>
                  <span className="text-sm font-semibold text-white">Análises Completas</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: teamColors.accent }}>
                  <div 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: teamColors.accent }}
                  ></div>
                  <span className="text-sm font-semibold text-white">Bastidores do Clube</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex items-center justify-between">
                <span 
                  className="font-bold text-lg group-hover:translate-x-2 transition-transform"
                  style={{ color: teamColors.accent }}
                >
                  Acessar Portal do {team.shortName || team.name}
                </span>
                <ExternalLink 
                  className="w-6 h-6 group-hover:scale-110 transition-transform" 
                  style={{ color: teamColors.accent }}
                />
              </div>
            </div>

            {/* Hover Overlay with Team Color */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
              style={{ background: `linear-gradient(to right, ${teamColors.primary}, transparent)` }}
            ></div>
          </button>

          {/* Old News Grid - Keep Hidden */}
          {false && newsLoading && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 border border-white/20 text-center">
              <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: teamColors.accent }} />
              <p className="text-gray-200 text-lg">Carregando notícias...</p>
            </div>
          )}
          
          {false && news.length === 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 border border-white/20 text-center">
              <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-200 text-lg">Nenhuma notícia específica do time no momento</p>
            </div>
          )}
          
          {false && news.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onNewsClick(item.link)}
                  className="group text-left bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-2xl hover:bg-white/15"
                >
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

                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>
                        {new Date(item.date).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </div>

                    <h3 className="text-white font-semibold line-clamp-2 group-hover:text-[#e50914] transition-colors">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="text-gray-400 text-sm line-clamp-3">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-sm font-semibold pt-2" style={{ color: teamColors.accent }}>
                      <span>Ler mais</span>
                      <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
