/**
 * 📊 DASHBOARD OVERVIEW - VISÃO GERAL (HOME DO PAINEL)
 * Página principal com métricas, gráficos e atividades em tempo real
 */

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  miniChart: number[];
}

function MetricCard({ title, value, change, isPositive, icon, miniChart }: MetricCardProps) {
  const maxValue = Math.max(...miniChart);
  
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a] hover:border-[#E50914]/50 transition-all relative overflow-hidden group">
      {/* Red accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#E50914] to-transparent" />
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-gray-400 text-xs font-medium mb-2">{title}</h3>
          <p className="text-2xl md:text-3xl font-bold text-white">{value}</p>
        </div>
        
        <div className="w-10 h-10 bg-[#E50914]/10 rounded-lg flex items-center justify-center group-hover:bg-[#E50914]/20 transition-colors">
          <div className="text-[#E50914]">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Change indicator */}
      <div className={`text-xs font-medium flex items-center gap-1 mb-3 ${
        isPositive ? 'text-green-500' : 'text-red-500'
      }`}>
        <span className="text-base">{isPositive ? '↗' : '↘'}</span>
        <span>{change}</span>
      </div>
      
      {/* Mini sparkline chart */}
      <div className="h-10 flex items-end gap-0.5">
        {miniChart.map((value, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-[#E50914] to-[#E50914]/40 rounded-t transition-all hover:from-[#E50914] hover:to-[#E50914]/60"
            style={{ height: `${(value / maxValue) * 100}%`, minHeight: '8%' }}
          />
        ))}
      </div>
    </div>
  );
}

interface ChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
}

function LineChart({ title, subtitle, data }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
      <div className="mb-6">
        <h3 className="text-white font-bold text-base">{title}</h3>
        {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
      </div>
      
      <div className="h-48 relative">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round((maxValue + minValue) / 2)}</span>
          <span>{minValue}</span>
        </div>
        
        {/* Chart area */}
        <div className="ml-12 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="border-t border-[#2a2a2a]/50" />
            ))}
          </div>
          
          {/* Line path */}
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#E50914" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Area under line */}
            <path
              d={data.map((d, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 100 - ((d.value - minValue) / range) * 100;
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ') + ` L 100,100 L 0,100 Z`}
              fill="url(#lineGradient)"
            />
            
            {/* Line */}
            <path
              d={data.map((d, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 100 - ((d.value - minValue) / range) * 100;
                return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
              }).join(' ')}
              fill="none"
              stroke="#E50914"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs text-gray-500 translate-y-5">
            {data.filter((_, i) => i % Math.ceil(data.length / 6) === 0).map((d, i) => (
              <span key={i}>{d.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface BarChartProps {
  title: string;
  subtitle?: string;
  data: ChartData[];
  showComparison?: boolean;
}

function BarChart({ title, subtitle, data, showComparison }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
      <div className="mb-6">
        <h3 className="text-white font-bold text-base">{title}</h3>
        {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
      </div>
      
      <div className="h-48 flex items-end justify-between gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex items-end justify-center h-40">
              {showComparison && (
                <div
                  className="w-1/3 bg-gradient-to-t from-gray-600 to-gray-500 rounded-t mr-1"
                  style={{ height: `${(item.value * 0.7 / maxValue) * 100}%` }}
                />
              )}
              <div
                className="w-full bg-gradient-to-t from-[#E50914] to-[#B20710] rounded-t hover:from-[#FF0A16] hover:to-[#E50914] transition-all cursor-pointer"
                style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '8%' }}
                title={`${item.label}: ${item.value}`}
              />
            </div>
            <span className="text-xs text-gray-500 text-center">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardOverview() {
  // Métricas principais
  const metrics = [
    {
      title: 'Assinantes Ativos',
      value: '125,000',
      change: '+5% vs. anterior',
      isPositive: true,
      icon: <span className="text-2xl">���</span>,
      miniChart: [110, 112, 115, 118, 120, 122, 123, 124, 125, 124.5, 124.8, 125],
    },
    {
      title: 'MRR',
      value: 'R$ 3,125,000',
      change: '+4% vs. anterior',
      isPositive: true,
      icon: <span className="text-2xl">💰</span>,
      miniChart: [2800, 2850, 2900, 2950, 3000, 3050, 3075, 3090, 3100, 3110, 3120, 3125],
    },
    {
      title: 'ARPU',
      value: 'R$ 25.00',
      change: '+1% vs. anterior',
      isPositive: true,
      icon: <span className="text-2xl">💵</span>,
      miniChart: [23, 23.5, 24, 24.2, 24.4, 24.6, 24.7, 24.8, 24.9, 24.95, 24.98, 25],
    },
    {
      title: 'Usuários Online Agora',
      value: '35,000',
      change: '+8% vs. média',
      isPositive: true,
      icon: <span className="text-2xl">🟢</span>,
      miniChart: [28, 29, 30, 31, 32, 33, 33.5, 34, 34.5, 34.8, 35, 35],
    },
  ];

  // Dados para gráficos
  const assinaturasPorMes = [
    { label: 'jan', value: 500 },
    { label: 'fev', value: 800 },
    { label: 'mar', value: 1200 },
    { label: 'abr', value: 1500 },
    { label: 'mai', value: 1800 },
    { label: 'jul', value: 2100 },
    { label: 'ago', value: 2300 },
    { label: 'set', value: 2200 },
    { label: 'out', value: 2400 },
    { label: 'nov', value: 2500 },
    { label: 'mer', value: 2500 },
  ];

  const cancelamentosPorMes = [
    { label: 'jan', value: 50 },
    { label: 'fev', value: 80 },
    { label: 'mar', value: 100 },
    { label: 'abr', value: 130 },
    { label: 'mai', value: 150 },
    { label: 'jul', value: 180 },
    { label: 'ago', value: 200 },
    { label: 'set', value: 220 },
    { label: 'out', value: 210 },
    { label: 'nov', value: 250 },
    { label: 'mer', value: 250 },
  ];

  const churnRate = [
    { label: 'jan', value: 0.2 },
    { label: 'fev', value: 0.3 },
    { label: 'mar', value: 0.4 },
    { label: 'abr', value: 0.5 },
    { label: 'mai', value: 0.6 },
    { label: 'jul', value: 0.7 },
    { label: 'ago', value: 0.8 },
    { label: 'set', value: 0.9 },
    { label: 'out', value: 0.85 },
    { label: 'nov', value: 1.0 },
    { label: 'mer', value: 1.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-2xl font-bold text-white">Visão Geral (Home do Painel)</h2>
        <p className="text-gray-400 text-sm mt-1">Dashboard operacional completo do RedFlix PRO</p>
      </div>

      {/* Métricas Principais em Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <MetricCard key={i} {...metric} />
        ))}
      </div>

      {/* Gráficos em Tempo Real */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LineChart
          title="Assinaturas por mês"
          subtitle="Real-time graph"
          data={assinaturasPorMes}
        />
        <LineChart
          title="Cancelamentos por mês"
          subtitle="Real-time graph"
          data={cancelamentosPorMes}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart
          title="Churn Rate anual e mensal"
          subtitle="Real-time anual e mensal"
          data={churnRate}
          showComparison={true}
        />
        
        {/* Card Especial - Atividade do Futebol */}
        <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
          <div className="mb-6">
            <h3 className="text-white font-bold text-base">Atividade do Futebol</h3>
            <p className="text-gray-400 text-xs mt-1">Dados do módulo Futebol integrado</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Jogos de hoje</span>
              <span className="text-white font-bold text-2xl">5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Jogos ao vivo</span>
              <span className="text-white font-bold text-2xl flex items-center gap-2">
                2
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Jogos da semana</span>
              <span className="text-white font-bold text-2xl">15</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#2a2a2a]">
            <p className="text-xs text-gray-500 mb-3">Guido acesso</p>
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-xs font-medium transition-colors">
                Série A
              </button>
              <button className="flex-1 px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-xs font-medium transition-colors">
                Libertadores
              </button>
              <button className="flex-1 px-3 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-xs font-medium transition-colors">
                Seleção
              </button>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#2a2a2a]">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#E50914]/20 flex items-center justify-center">
                <span className="text-[#E50914] text-xs font-bold">1</span>
              </div>
              <span className="text-gray-400 text-xs">Novos jogos A</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 rounded-full bg-[#E50914]/20 flex items-center justify-center">
                <span className="text-[#E50914] text-xs font-bold">2</span>
              </div>
              <span className="text-gray-400 text-xs">Renovos giegos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}