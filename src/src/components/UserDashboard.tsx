/**
 * 📊 USER DASHBOARD - PAINEL DO USUÁRIO
 * Dashboard do usuário seguindo o mesmo design do Admin Dashboard
 */

import { useState } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
const redflixLogo = 'http://chemorena.com/redfliz.png';

// Arrow Left Icon
const ArrowLeft = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

// Metric Card Component
interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  chartData: number[];
}

function MetricCard({ title, value, change, isPositive, chartData }: MetricCardProps) {
  const maxValue = Math.max(...chartData);
  
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a] relative overflow-hidden">
      {/* Red accent line on top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E50914] to-transparent"></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-gray-400 text-sm mb-2">{title}</h3>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        
        {/* Icon placeholder */}
        <div className="w-10 h-10 bg-[#E50914]/10 rounded-lg flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E50914" strokeWidth="2">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
          </svg>
        </div>
      </div>
      
      {/* Change indicator */}
      <div className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </div>
      
      {/* Mini chart */}
      <div className="mt-4 h-12 flex items-end gap-1">
        {chartData.map((value, i) => (
          <div
            key={i}
            className="flex-1 bg-[#E50914] rounded-t opacity-60 hover:opacity-100 transition-opacity"
            style={{ height: `${(value / maxValue) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

// Graph Component
interface GraphProps {
  title: string;
  subtitle?: string;
  data: { label: string; value: number }[];
  type?: 'line' | 'bar';
}

function Graph({ title, subtitle, data, type = 'bar' }: GraphProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
      <div className="mb-6">
        <h3 className="text-white font-bold text-lg">{title}</h3>
        {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
      </div>
      
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
              {type === 'bar' ? (
                <div
                  className="w-full bg-gradient-to-t from-[#E50914] to-[#E50914]/40 rounded-t hover:from-[#E50914] hover:to-[#E50914]/60 transition-all cursor-pointer"
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                  title={`${item.label}: ${item.value}`}
                />
              ) : (
                <div className="w-full relative" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 bg-[#E50914]"
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                  />
                </div>
              )}
            </div>
            <span className="text-xs text-gray-500">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface UserDashboardProps {
  onBack: () => void;
  userName?: string;
  userAvatar?: string;
  onProfileClick?: () => void;
  onAccountClick?: () => void;
}

export function UserDashboard({
  onBack,
  userName = "Maria Silva",
  userAvatar,
  onProfileClick,
  onAccountClick,
}: UserDashboardProps) {
  // Dados de estatísticas do usuário
  const metrics = {
    horasAssistidas: {
      value: '87h',
      change: '+12% vs. semana anterior',
      isPositive: true,
      chartData: [60, 65, 70, 75, 80, 85, 87, 85, 80, 82, 84, 87],
    },
    filmesAssistidos: {
      value: '23',
      change: '+8 vs. mês anterior',
      isPositive: true,
      chartData: [10, 12, 14, 16, 18, 19, 20, 21, 22, 22, 23, 23],
    },
    seriesEmAndamento: {
      value: '5',
      change: '+2 vs. mês anterior',
      isPositive: true,
      chartData: [1, 1, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5],
    },
    minhaLista: {
      value: '42',
      change: '+5 esta semana',
      isPositive: true,
      chartData: [30, 32, 34, 35, 36, 37, 38, 39, 40, 41, 42, 42],
    },
  };

  const horasPorDia = [
    { label: 'Dom', value: 12 },
    { label: 'Seg', value: 8 },
    { label: 'Ter', value: 15 },
    { label: 'Qua', value: 10 },
    { label: 'Qui', value: 18 },
    { label: 'Sex', value: 14 },
    { label: 'Sáb', value: 16 },
  ];

  const conteudoPorGenero = [
    { label: 'Ação', value: 35 },
    { label: 'Drama', value: 28 },
    { label: 'Comédia', value: 22 },
    { label: 'Ficção', value: 15 },
    { label: 'Terror', value: 10 },
    { label: 'Romance', value: 8 },
  ];

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gradient-to-b from-black/90 to-transparent backdrop-blur-sm border-b border-[#2a2a2a]">
        <div className="container mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Botão Voltar + Logo */}
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden md:inline">Voltar</span>
              </button>
              
              <ImageWithFallback
                src={redflixLogo}
                alt="RedFlix"
                className="h-8"
              />
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="font-bold text-sm">{userName}</p>
                <p className="text-xs text-gray-400">Plano Premium</p>
              </div>
              <button
                onClick={onProfileClick}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center font-bold hover:scale-105 transition-transform shadow-lg"
              >
                {userName.charAt(0)}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Meu Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">Acompanhe suas estatísticas e atividades de visualização</p>
        </div>

        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="Horas Assistidas"
            value={metrics.horasAssistidas.value}
            change={metrics.horasAssistidas.change}
            isPositive={metrics.horasAssistidas.isPositive}
            chartData={metrics.horasAssistidas.chartData}
          />
          <MetricCard
            title="Filmes Assistidos"
            value={metrics.filmesAssistidos.value}
            change={metrics.filmesAssistidos.change}
            isPositive={metrics.filmesAssistidos.isPositive}
            chartData={metrics.filmesAssistidos.chartData}
          />
          <MetricCard
            title="Séries em Andamento"
            value={metrics.seriesEmAndamento.value}
            change={metrics.seriesEmAndamento.change}
            isPositive={metrics.seriesEmAndamento.isPositive}
            chartData={metrics.seriesEmAndamento.chartData}
          />
          <MetricCard
            title="Minha Lista"
            value={metrics.minhaLista.value}
            change={metrics.minhaLista.change}
            isPositive={metrics.minhaLista.isPositive}
            chartData={metrics.minhaLista.chartData}
          />
        </div>

        {/* Gráficos de Atividade */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Graph
            title="Horas por dia da semana"
            subtitle="Sua atividade semanal"
            data={horasPorDia}
            type="bar"
          />
          <Graph
            title="Conteúdo por gênero"
            subtitle="Seus gêneros favoritos"
            data={conteudoPorGenero}
            type="bar"
          />
        </div>

        {/* Cards de Ação Rápida */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continuar Assistindo */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4">Continuar Assistindo</h3>
            <p className="text-gray-400 text-sm mb-6">Retome de onde parou</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Últimos 7 dias</span>
                <span className="text-white font-bold text-2xl">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Em progresso</span>
                <span className="text-white font-bold text-2xl">8</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
              <button className="w-full px-4 py-2 bg-[#E50914] hover:bg-[#E50914]/80 rounded text-sm text-white font-medium transition-colors">
                Ver Tudo
              </button>
            </div>
          </div>

          {/* Minha Lista */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4">Minha Lista</h3>
            <p className="text-gray-400 text-sm mb-6">Seus favoritos salvos</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Total de itens</span>
                <span className="text-white font-bold text-2xl">42</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Novos esta semana</span>
                <span className="text-white font-bold text-2xl">5</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
              <button 
                onClick={onAccountClick}
                className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white font-medium transition-colors"
              >
                Acessar Lista
              </button>
            </div>
          </div>

          {/* Perfil e Configurações */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4">Perfil e Conta</h3>
            <p className="text-gray-400 text-sm mb-6">Gerencie suas preferências</p>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Plano atual</span>
                <span className="text-[#E50914] font-bold">Premium</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Perfis</span>
                <span className="text-white font-bold text-2xl">4</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
              <button 
                onClick={onProfileClick}
                className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white font-medium transition-colors"
              >
                Gerenciar Perfil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
