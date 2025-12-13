import React, { useState } from 'react';
import { MapPinIcon, CalendarIcon, TrophyIcon } from './Icons';
import brasileiraoData from '../data/brasileirao-times.json';

/**
 * 🎯 GRID DE TIMES DO BRASILEIRÃO COM DADOS VÁLIDOS
 * 
 * Usa o JSON com informações oficiais dos 20 times da Série A 2025
 * Implementa hovers interativos estilo Netflix/RedFlix
 */

interface BrasileiraoTeamsGridProps {
  onTeamClick?: (team: any) => void;
}

export function BrasileiraoTeamsGrid({ onTeamClick }: BrasileiraoTeamsGridProps) {
  const [hoveredTeam, setHoveredTeam] = useState<string | null>(null);
  
  // ✅ Dados reais dos times
  const teams = brasileiraoData.serie_a_2025;
  
  // Helper: Calcular anos desde fundação
  const getYearsSince = (fundacao: string): number => {
    const founded = new Date(fundacao).getFullYear();
    const current = new Date().getFullYear();
    return current - founded;
  };
  
  // Helper: Cores do time em gradient CSS
  const getTeamGradient = (cores: string[]): string => {
    const colorMap: Record<string, string> = {
      'vermelho': '#E50914',
      'preto': '#000000',
      'branco': '#FFFFFF',
      'azul': '#0066CC',
      'verde': '#009B3A',
      'grená': '#8B0000',
      'amarelo': '#FFDF00'
    };
    
    const colors = cores.map(cor => colorMap[cor] || '#333333');
    return `linear-gradient(135deg, ${colors.join(', ')})`;
  };

  return (
    <div className="py-8 px-4 md:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
          🏆 Times da Série A 2025
        </h2>
        <p className="text-gray-400">
          {teams.length} clubes • Logos oficiais • Dados válidos
        </p>
      </div>

      {/* Grid de Times */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {teams.map((team) => {
          const isHovered = hoveredTeam === team.id;
          const yearsSince = getYearsSince(team.fundacao);
          
          return (
            <button
              key={team.id}
              onClick={() => onTeamClick?.(team)}
              onMouseEnter={() => setHoveredTeam(team.id)}
              onMouseLeave={() => setHoveredTeam(null)}
              className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-[#FFD700] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/30 overflow-hidden"
              style={{
                transform: isHovered ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)',
                zIndex: isHovered ? 50 : 1
              }}
            >
              {/* Background com cores do time */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                style={{ background: getTeamGradient(team.cores) }}
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10">
                {/* Logo do Time - HOVER SCALE + ROTATE */}
                <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <img 
                    src={team.logo_url}
                    alt={`${team.nome} logo`}
                    className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500 group-hover:scale-125 group-hover:rotate-6 group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]"
                    loading="lazy"
                  />
                  
                  {/* Glow Effect no Hover */}
                  <div className="absolute inset-0 bg-[#FFD700]/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150" />
                </div>

                {/* Nome do Time - HOVER COLOR */}
                <h3 className="text-white font-bold text-center mb-1 line-clamp-2 min-h-[3rem] flex items-center justify-center group-hover:text-[#FFD700] transition-colors duration-300 drop-shadow-lg">
                  {team.nome}
                </h3>

                {/* Apelido */}
                <p className="text-gray-400 text-sm text-center mb-3 group-hover:text-[#FFD700]/80 transition-colors">
                  {team.apelido}
                </p>

                {/* Cores do Time - Pills */}
                <div className="flex items-center justify-center gap-1.5 mb-4">
                  {team.cores.map((cor, idx) => {
                    const colorMap: Record<string, string> = {
                      'vermelho': 'bg-red-600',
                      'preto': 'bg-black border border-white/30',
                      'branco': 'bg-white',
                      'azul': 'bg-blue-600',
                      'verde': 'bg-green-600',
                      'grená': 'bg-red-900',
                      'amarelo': 'bg-yellow-400'
                    };
                    
                    return (
                      <div 
                        key={idx}
                        className={`w-6 h-6 rounded-full ${colorMap[cor] || 'bg-gray-500'} shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                        title={cor}
                      />
                    );
                  })}
                </div>

                {/* Informações Extras - Aparecem no Hover */}
                <div className="space-y-2 text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  {/* Cidade/Estado */}
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <MapPinIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span className="line-clamp-1">{team.cidade}/{team.estado}</span>
                  </div>
                  
                  {/* Estádio */}
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <TrophyIcon className="w-3.5 h-3.5 text-green-400" />
                    <span className="line-clamp-1">{team.estadio}</span>
                  </div>
                  
                  {/* Fundação */}
                  <div className="flex items-center justify-center gap-2 text-gray-300">
                    <CalendarIcon className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{yearsSince} anos de história</span>
                  </div>
                </div>

                {/* CTA - Aparece no Hover */}
                <div className="mt-4 pt-3 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <span className="text-[#FFD700] text-xs font-bold flex items-center justify-center gap-1">
                    Clique para detalhes
                    <svg className="w-3 h-3 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </span>
                </div>
              </div>

              {/* Border Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl border-2 border-[#FFD700] animate-pulse" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-gray-400 text-sm">Dados oficiais • Logos em alta resolução</span>
          </div>
        </div>
      </div>
    </div>
  );
}
