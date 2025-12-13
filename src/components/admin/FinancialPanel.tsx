// Icons inline to avoid lucide-react dependency
const DollarSign = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const TrendingUp = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const CreditCard = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const Gift = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="20 12 20 22 4 22 4 12"></polyline>
    <rect x="2" y="7" width="20" height="5"></rect>
    <line x1="12" y1="22" x2="12" y2="7"></line>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
  </svg>
);

const Download = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

import { Card } from '../ui/card';
import { Button } from '../ui/button-simple';

// Recharts temporarily commented out due to build issues
// import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

export function FinancialPanel() {
  const financialData = [
    { month: 'Jan', revenue: 127500, costs: 45000, profit: 82500 },
    { month: 'Fev', revenue: 138000, costs: 48000, profit: 90000 },
    { month: 'Mar', revenue: 147000, costs: 50000, profit: 97000 },
    { month: 'Abr', revenue: 157500, costs: 52000, profit: 105500 },
    { month: 'Mai', revenue: 168000, costs: 54000, profit: 114000 },
    { month: 'Jun', revenue: 186870, costs: 56000, profit: 130870 }
  ];

  const plans = [
    { name: 'Básico', price: 15.90, subscribers: 4500, mrr: 71550, features: ['HD', '1 Tela', 'Sem Download'] },
    { name: 'Premium', price: 29.90, subscribers: 5800, mrr: 173420, features: ['Full HD', '2 Telas', 'Download'] },
    { name: 'Ultra', price: 49.90, subscribers: 2158, mrr: 107682, features: ['4K', '4 Telas', 'Download'] }
  ];

  const recentTransactions = [
    { id: '#12345', user: 'João Silva', plan: 'Premium', amount: 29.90, date: '2024-11-04 14:30', status: 'success' },
    { id: '#12346', user: 'Maria Santos', plan: 'Ultra', amount: 49.90, date: '2024-11-04 12:15', status: 'success' },
    { id: '#12347', user: 'Pedro Costa', plan: 'Básico', amount: 15.90, date: '2024-11-04 10:20', status: 'pending' },
    { id: '#12348', user: 'Ana Oliveira', plan: 'Premium', amount: 29.90, date: '2024-11-03 18:45', status: 'failed' },
  ];

  const stats = {
    mrr: 352652,
    arr: 4231824,
    ltv: 890,
    churn: 2.3
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
            Painel Financeiro
          </h1>
          <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
            Gestão de receitas, planos e transações
          </p>
        </div>
        <Button className="bg-red-600 hover:bg-red-700 text-white">
          <Download size={16} className="mr-2" />
          Exportar Relatório
        </Button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px] mb-2">
                MRR (Monthly Recurring Revenue)
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[24px]">
                R$ {(stats.mrr / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="p-3 bg-green-600/20 rounded-lg">
              <TrendingUp className="text-green-600" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px] mb-2">
                ARR (Annual Recurring Revenue)
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[24px]">
                R$ {(stats.arr / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <DollarSign className="text-purple-600" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px] mb-2">
                LTV (Lifetime Value)
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[24px]">
                R$ {stats.ltv}
              </p>
            </div>
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <CreditCard className="text-blue-600" size={20} />
            </div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px] mb-2">
                Taxa de Churn
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[24px]">
                {stats.churn}%
              </p>
            </div>
            <div className="p-3 bg-orange-600/20 rounded-lg">
              <Gift className="text-orange-600" size={20} />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
          Receita vs Custos vs Lucro
        </h3>
        <SimpleChartPlaceholder 
          type="Line Chart" 
          title="Revenue trends over 6 months" 
          height="300px"
        />
      </Card>

      {/* Plans */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px]">
            Planos e Preços
          </h3>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white">
            Adicionar Plano
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan) => (
            <Card key={plan.name} className="bg-white/5 border-white/10 p-6">
              <h4 className="text-white font-['Inter:Bold',sans-serif] text-[20px] mb-2">
                {plan.name}
              </h4>
              <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mb-4">
                R$ {plan.price}/mês
              </p>
              <div className="space-y-2 mb-4">
                {plan.features.map((feature, index) => (
                  <p key={index} className="text-white/70 font-['Inter:Regular',sans-serif] text-[13px]">
                    • {feature}
                  </p>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-white/50 text-[12px]">Assinantes</span>
                  <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[14px]">
                    {plan.subscribers.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50 text-[12px]">MRR</span>
                  <span className="text-green-500 font-['Inter:Bold',sans-serif] text-[14px]">
                    R$ {(plan.mrr / 1000).toFixed(1)}k
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Recent Transactions */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
          Transações Recentes
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">ID</th>
                <th className="text-left py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">Usuário</th>
                <th className="text-left py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">Plano</th>
                <th className="text-right py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">Valor</th>
                <th className="text-left py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">Data</th>
                <th className="text-center py-3 px-4 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 px-4 text-white/50 font-['Inter:Medium',sans-serif] text-[13px]">
                    {transaction.id}
                  </td>
                  <td className="py-3 px-4 text-white font-['Inter:Medium',sans-serif] text-[14px]">
                    {transaction.user}
                  </td>
                  <td className="py-3 px-4 text-white/70 font-['Inter:Regular',sans-serif] text-[14px]">
                    {transaction.plan}
                  </td>
                  <td className="py-3 px-4 text-right text-white font-['Inter:Bold',sans-serif] text-[14px]">
                    R$ {transaction.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-white/70 font-['Inter:Regular',sans-serif] text-[13px]">
                    {transaction.date}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[12px] font-['Inter:Semi_Bold',sans-serif] ${
                      transaction.status === 'success' ? 'bg-green-600/20 text-green-500' :
                      transaction.status === 'pending' ? 'bg-yellow-600/20 text-yellow-500' :
                      'bg-red-600/20 text-red-500'
                    }`}>
                      {transaction.status === 'success' ? 'Sucesso' :
                       transaction.status === 'pending' ? 'Pendente' : 'Falhou'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
