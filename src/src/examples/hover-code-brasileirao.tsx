/**
 * 🎬 CÓDIGO EXATO DO HOVER - TIMES DO BRASILEIRÃO
 * 
 * Este arquivo mostra o código isolado do efeito hover
 * usando os dados REAIS dos 20 times da Série A 2025
 */

import React, { useState } from 'react';
import brasileiraoData from '../data/brasileirao-times.json';

// ✅ Dados reais carregados
const teams = brasileiraoData.serie_a_2025;

// Exemplo: Flamengo
const flamengo = {
  "id": "flamengo",
  "nome": "Flamengo",
  "apelido": "Mengão",
  "cidade": "Rio de Janeiro",
  "estado": "RJ",
  "cores": ["vermelho", "preto"],
  "logo_url": "https://upload.wikimedia.org/wikipedia/en/2/2e/CR_Flamengo_logo.svg",
  "estadio": "Maracanã",
  "fundacao": "1895-11-17"
};

// ═══════════════════════════════════════════════════════════════════
// 🎯 PARTE 1: ESTRUTURA DO CARD COM HOVER
// ═══════════════════════════════════════════════════════════════════

function TeamCardWithHover({ team }: { team: typeof flamengo }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button
      // ✅ Container principal com grupo para hover
      className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-[#FFD700] transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#FFD700]/30 overflow-hidden"
      
      // ✅ Controle manual do hover (opcional)
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      
      // ✅ Style dinâmico baseado no hover
      style={{
        transform: isHovered ? 'translateY(-8px) scale(1.05)' : 'translateY(0) scale(1)',
        zIndex: isHovered ? 50 : 1
      }}
    >
      {/* ───────────────────────────────────────────────────────── */}
      {/* LAYER 1: Background com cores do time (aparece no hover) */}
      {/* ───────────────────────────────────────────────────────── */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
        style={{ 
          background: `linear-gradient(135deg, #E50914, #000000)` // Vermelho e Preto do Flamengo
        }}
      />
      
      {/* ───────────────────────────────────────────────────────── */}
      {/* LAYER 2: Gradient overlay (intensifica no hover)        */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {/* ───────────────────────────────────────────────────────── */}
      {/* LAYER 3: Conteúdo do card                                */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="relative z-10">
        {/* Logo do Time com HOVER EFFECTS */}
        <div className="relative w-24 h-24 mx-auto mb-4 flex items-center justify-center">
          <img 
            src={team.logo_url}  // ✅ https://upload.wikimedia.org/wikipedia/en/2/2e/CR_Flamengo_logo.svg
            alt={`${team.nome} logo`}
            className="
              w-full h-full 
              object-contain 
              drop-shadow-2xl 
              transition-all duration-500 
              group-hover:scale-125        /* ✅ Aumenta 25% */
              group-hover:rotate-6         /* ✅ Rotaciona 6 graus */
              group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]  /* ✅ Glow dourado */
            "
          />
          
          {/* Glow circular no hover */}
          <div className="absolute inset-0 bg-[#FFD700]/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-150" />
        </div>

        {/* Nome do Time - muda para dourado no hover */}
        <h3 className="
          text-white 
          font-bold 
          text-center 
          mb-1 
          group-hover:text-[#FFD700]  /* ✅ Fica dourado */
          transition-colors duration-300 
          drop-shadow-lg
        ">
          {team.nome}  {/* Flamengo */}
        </h3>

        {/* Apelido */}
        <p className="
          text-gray-400 
          text-sm 
          text-center 
          mb-3 
          group-hover:text-[#FFD700]/80  /* ✅ Fica dourado claro */
          transition-colors
        ">
          {team.apelido}  {/* Mengão */}
        </p>

        {/* Pills de Cores - crescem no hover */}
        <div className="flex items-center justify-center gap-1.5 mb-4">
          {/* Pill Vermelha */}
          <div className="
            w-6 h-6 
            rounded-full 
            bg-red-600 
            shadow-lg 
            transform 
            group-hover:scale-110  /* ✅ Aumenta 10% */
            transition-transform duration-300
          " />
          
          {/* Pill Preta */}
          <div className="
            w-6 h-6 
            rounded-full 
            bg-black 
            border border-white/30 
            shadow-lg 
            transform 
            group-hover:scale-110  /* ✅ Aumenta 10% */
            transition-transform duration-300
          " />
        </div>

        {/* ─────────────────────────────────────────────────── */}
        {/* INFORMAÇÕES EXTRAS - Aparecem apenas no hover      */}
        {/* ─────────────────────────────────────────────────── */}
        <div className="
          space-y-2 
          text-xs 
          opacity-0                    /* ✅ Invisível inicialmente */
          group-hover:opacity-100      /* ✅ Aparece no hover */
          transition-all duration-300 
          transform 
          translate-y-4                /* ✅ Começa 4px abaixo */
          group-hover:translate-y-0    /* ✅ Desliza para cima */
        ">
          {/* Cidade/Estado */}
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <span>📍</span>
            <span>{team.cidade}/{team.estado}</span>  {/* Rio de Janeiro/RJ */}
          </div>
          
          {/* Estádio */}
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <span>🏟️</span>
            <span>{team.estadio}</span>  {/* Maracanã */}
          </div>
          
          {/* Anos de História */}
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <span>📅</span>
            <span>
              {2025 - new Date(team.fundacao).getFullYear()} anos de história  {/* 130 anos */}
            </span>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────── */}
        {/* CTA - Aparece no hover                             */}
        {/* ─────────────────────────────────────────────────── */}
        <div className="
          mt-4 
          pt-3 
          border-t border-white/10 
          opacity-0 
          group-hover:opacity-100 
          transition-all duration-300 
          transform 
          translate-y-4 
          group-hover:translate-y-0
        ">
          <span className="text-[#FFD700] text-xs font-bold flex items-center justify-center gap-1">
            Clique para detalhes
            <svg className="w-3 h-3 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
              <path d="M9 18l6-6-6-6" />
            </svg>
          </span>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────── */}
      {/* LAYER 4: Borda dourada pulsante (hover)                  */}
      {/* ───────────────────────────────────────────────────────── */}
      <div className="
        absolute inset-0 
        rounded-2xl 
        opacity-0 
        group-hover:opacity-100 
        transition-opacity duration-300 
        pointer-events-none
      ">
        <div className="absolute inset-0 rounded-2xl border-2 border-[#FFD700] animate-pulse" />
      </div>
    </button>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 🎯 PARTE 2: FUNÇÃO HELPER PARA CORES DO TIME
// ═══════════════════════════════════════════════════════════════════

function getTeamGradient(cores: string[]): string {
  // Mapa de cores oficiais para hexadecimal
  const colorMap: Record<string, string> = {
    'vermelho': '#E50914',
    'preto': '#000000',
    'branco': '#FFFFFF',
    'azul': '#0066CC',
    'verde': '#009B3A',
    'grená': '#8B0000',
    'amarelo': '#FFDF00'
  };
  
  // Converte array de cores para hex
  const hexColors = cores.map(cor => colorMap[cor] || '#333333');
  
  // Retorna CSS gradient
  return `linear-gradient(135deg, ${hexColors.join(', ')})`;
}

// Exemplo de uso:
// getTeamGradient(["vermelho", "preto"]) 
// → "linear-gradient(135deg, #E50914, #000000)"

// ═══════════════════════════════════════════════════════════════════
// 🎯 PARTE 3: CLASSES TAILWIND USADAS NO HOVER
// ═══════════════════════════════════════════════════════════════════

const HOVER_CLASSES = {
  // Container do card
  container: `
    group                          // Ativa group-hover nos filhos
    relative                       // Para positioning absoluto dos layers
    hover:scale-105                // Cresce 5%
    hover:border-[#FFD700]         // Borda dourada
    hover:shadow-2xl               // Sombra grande
    hover:shadow-[#FFD700]/30      // Sombra dourada com 30% opacity
    transition-all duration-300    // Animação suave de 300ms
  `,
  
  // Logo do time
  logo: `
    group-hover:scale-125          // Cresce 25% quando hover no grupo
    group-hover:rotate-6           // Rotaciona 6 graus
    group-hover:drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]  // Glow dourado
    transition-all duration-500    // Animação mais lenta (500ms)
  `,
  
  // Texto do nome
  nome: `
    group-hover:text-[#FFD700]     // Fica dourado
    transition-colors duration-300 // Transição suave de cor
  `,
  
  // Pills de cores
  colorPill: `
    group-hover:scale-110          // Cresce 10%
    transition-transform duration-300
  `,
  
  // Informações extras (aparecem no hover)
  extraInfo: `
    opacity-0                      // Invisível inicialmente
    group-hover:opacity-100        // Aparece no hover
    translate-y-4                  // Começa 4px abaixo
    group-hover:translate-y-0      // Move para posição normal
    transition-all duration-300
  `,
  
  // Background com cores do time
  colorBackground: `
    opacity-0                      // Invisível inicialmente
    group-hover:opacity-20         // 20% de opacidade no hover
    transition-opacity duration-500
    blur-xl                        // Efeito de desfoque
  `,
  
  // Borda dourada pulsante
  borderGlow: `
    opacity-0                      // Invisível inicialmente
    group-hover:opacity-100        // Aparece no hover
    border-2 border-[#FFD700]      // Borda dourada 2px
    animate-pulse                  // Animação de pulso
  `
};

// ═══════════════════════════════════════════════════════════════════
// 🎯 PARTE 4: EXEMPLO DE INTEGRAÇÃO COMPLETA
// ═══════════════════════════════════════════════════════════════════

export function BrasileiraoTeamsExample() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 p-8">
      {teams.map((team) => (
        <TeamCardWithHover key={team.id} team={team} />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// 📊 RESUMO DAS TRANSIÇÕES
// ═══════════════════════════════════════════════════════════════════

/*
  ┌─────────────────────────────────────────────────────────────┐
  │ ELEMENTO            │ ESTADO INICIAL → HOVER               │
  ├─────────────────────────────────────────────────────────────┤
  │ Card                │ scale(1) → scale(1.05) + shadow      │
  │ Logo                │ scale(1) → scale(1.25) + rotate(6°)  │
  │ Nome                │ white → #FFD700 (dourado)            │
  │ Pills de Cores      │ scale(1) → scale(1.1)                │
  │ Background Colorido │ opacity 0 → opacity 20%              │
  │ Info Extra          │ opacity 0 + y:4 → opacity 100 + y:0  │
  │ Borda Dourada       │ opacity 0 → opacity 100 + pulse      │
  │ Glow do Logo        │ opacity 0 → opacity 100              │
  └─────────────────────────────────────────────────────────────┘
  
  ⏱️ Duração das transições:
  - Card: 300ms
  - Logo: 500ms (mais lento para efeito dramático)
  - Textos: 300ms
  - Background: 500ms
  - Info extra: 300ms
*/
