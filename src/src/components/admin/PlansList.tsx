/**
 * 💳 PLANOS & COBRANÇAS
 * Gerenciamento completo de planos, preços e recorrências
 */

export function PlansList() {
  const plans = [
    {
      id: '1',
      name: 'Básico',
      price: 'R$ 19.90',
      duration: 'Mensal',
      devices: 1,
      quality: 'HD',
      subscribers: 45000,
      active: true,
    },
    {
      id: '2',
      name: 'Padrão',
      price: 'R$ 29.90',
      duration: 'Mensal',
      devices: 2,
      quality: 'Full HD',
      subscribers: 55000,
      active: true,
    },
    {
      id: '3',
      name: 'Premium',
      price: 'R$ 39.90',
      duration: 'Mensal',
      devices: 4,
      quality: '4K + HDR',
      subscribers: 25000,
      active: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Planos & Cobranças</h2>
          <p className="text-gray-400 text-sm mt-1">Gerencie planos, preços e recorrências</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#E50914] hover:bg-[#E50914]/80 rounded-lg text-white font-medium transition-colors">
          <span className="text-lg">➕</span>
          Criar Plano
        </button>
      </div>

      {/* Métricas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#E50914]/10 rounded-lg flex items-center justify-center">
              <span className="text-xl text-[#E50914]">💰</span>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Receita Total</p>
              <p className="text-2xl font-bold text-white">R$ 3.1M</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#E50914]/10 rounded-lg flex items-center justify-center">
              <span className="text-xl text-[#E50914]">👥</span>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Assinantes</p>
              <p className="text-2xl font-bold text-white">125k</p>
            </div>
          </div>
        </div>
        <div className="bg-[#1a1a1a] rounded-lg p-5 border border-[#2a2a2a]">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#E50914]/10 rounded-lg flex items-center justify-center">
              <span className="text-xl text-[#E50914]">💻</span>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Plano Médio</p>
              <p className="text-2xl font-bold text-white">R$ 25</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Planos */}
      <div className="bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0a0a0a] border-b border-[#2a2a2a]">
            <tr>
              <th className="text-left text-gray-400 text-xs font-medium p-4">Plano</th>
              <th className="text-left text-gray-400 text-xs font-medium p-4">Valor</th>
              <th className="text-left text-gray-400 text-xs font-medium p-4">Duração</th>
              <th className="text-left text-gray-400 text-xs font-medium p-4">Dispositivos</th>
              <th className="text-left text-gray-400 text-xs font-medium p-4">Qualidade</th>
              <th className="text-left text-gray-400 text-xs font-medium p-4">Assinantes</th>
              <th className="text-left text-gray-400 text-xs font-medium p-4">Status</th>
              <th className="text-left text-gray-400 text-xs font-medium p-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.id} className="border-b border-[#2a2a2a] hover:bg-[#1a1a1a]/50">
                <td className="p-4">
                  <p className="text-white font-medium">{plan.name}</p>
                </td>
                <td className="p-4">
                  <p className="text-white">{plan.price}</p>
                </td>
                <td className="p-4">
                  <p className="text-gray-400">{plan.duration}</p>
                </td>
                <td className="p-4">
                  <p className="text-gray-400">{plan.devices}</p>
                </td>
                <td className="p-4">
                  <p className="text-gray-400">{plan.quality}</p>
                </td>
                <td className="p-4">
                  <p className="text-white font-medium">{plan.subscribers.toLocaleString()}</p>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    plan.active ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                  }`}>
                    {plan.active ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors">
                      <span className="text-sm">✏️</span>
                    </button>
                    <button className="p-1.5 hover:bg-[#2a2a2a] rounded transition-colors">
                      <span className="text-sm text-red-500">🗑️</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}