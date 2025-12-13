// Icons inline to avoid lucide-react dependency
const TrendingUp = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const Eye = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const Clock = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Users = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Monitor = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

import { Card } from '../ui/card';

// Recharts temporarily commented out due to build issues
// Simple chart placeholders will be used instead
// import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Simple chart placeholder component
const SimpleChartPlaceholder = ({ type, title, height = "300px" }: { type: string; title: string; height?: string }) => (
  <div className="w-full bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg flex items-center justify-center border border-gray-700" style={{ height }}>
    <div className="text-center">
      <div className="text-4xl mb-2">📊</div>
      <p className="text-gray-400 text-sm">{title}</p>
      <p className="text-gray-500 text-xs mt-1">{type}</p>
    </div>
  </div>
);

export function Analytics() {
  const viewsData = [
    { day: 'Seg', views: 12400, hours: 3200, users: 2800 },
    { day: 'Ter', views: 15600, hours: 3800, users: 3200 },
    { day: 'Qua', views: 18200, hours: 4500, users: 3600 },
    { day: 'Qui', views: 16800, hours: 4200, users: 3400 },
    { day: 'Sex', views: 21000, hours: 5600, users: 4100 },
    { day: 'Sáb', views: 24500, hours: 6800, users: 4800 },
    { day: 'Dom', views: 22300, hours: 6200, users: 4500 }
  ];

  const deviceData = [
    { name: 'Smart TV', value: 45, color: '#DC2626' },
    { name: 'Mobile', value: 30, color: '#EA580C' },
    { name: 'Desktop', value: 20, color: '#CA8A04' },
    { name: 'Tablet', value: 5, color: '#65A30D' }
  ];

  const regionData = [
    { region: 'São Paulo', views: 125000 },
    { region: 'Rio de Janeiro', views: 89000 },
    { region: 'Minas Gerais', views: 67000 },
    { region: 'Paraná', views: 54000 },
    { region: 'Bahia', views: 48000 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
          Estatísticas & Analytics
        </h1>
        <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
          Análise detalhada de consumo e engajamento
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Eye className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Visualizações (7 dias)
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">130.8k</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Clock className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Horas Assistidas
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">34.3k</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <Users className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Usuários Ativos
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">26.5k</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/20 rounded-lg">
              <Monitor className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Tempo Médio
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">1h 18m</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Views & Hours Trend */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
          Visualizações e Horas Assistidas (Últimos 7 dias)
        </h3>
        <SimpleChartPlaceholder 
          type="Area Chart" 
          title="Trends over 7 days" 
          height="300px"
        />
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Distribution */}
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
            Distribuição por Dispositivo
          </h3>
          <SimpleChartPlaceholder 
            type="Pie Chart" 
            title="Device breakdown" 
            height="250px"
          />
        </Card>

        {/* Regions */}
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
            Top Regiões
          </h3>
          <SimpleChartPlaceholder 
            type="Bar Chart" 
            title="Regional distribution" 
            height="250px"
          />
        </Card>
      </div>
    </div>
  );
}
