/**
 * 👤 PERFIL COMPLETO DO ASSINANTE
 * Visualização detalhada com informações, uso e ações administrativas
 */

interface SubscriberProfileProps {
  subscriberId: string;
  onBack: () => void;
}

export function SubscriberProfile({ subscriberId, onBack }: SubscriberProfileProps) {
  // Mock data - em produção viria do backend
  const subscriber = {
    id: subscriberId,
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '+55 (11) 98765-4321',
    cpf: '123.456.789-00',
    address: 'Rua das Flores, 123 - São Paulo, SP',
    plan: 'Premium',
    status: 'Ativo',
    paymentMethod: 'Cartão de Crédito ****1234',
    lastBilling: '15/11/2024',
    nextBilling: '15/12/2024',
    memberSince: '15/03/2023',
  };

  const recentContent = [
    { title: 'Breaking Bad', type: 'Série', time: 'há 2 horas' },
    { title: 'The Witcher', type: 'Série', time: 'há 5 horas' },
    { title: 'Inception', type: 'Filme', time: 'há 1 dia' },
  ];

  const devices = [
    { model: 'Samsung Smart TV', lastUsed: 'há 2 horas', ip: '192.168.1.10', status: 'online' },
    { model: 'iPhone 13', lastUsed: 'há 5 horas', ip: '192.168.1.25', status: 'offline' },
    { model: 'Xiaomi Mi Box', lastUsed: 'há 1 dia', ip: '192.168.1.30', status: 'offline' },
  ];

  return (
    <div className="space-y-6">
      {/* Header com botão voltar */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span className="text-xl">←</span>
          <span>Voltar</span>
        </button>
        <div>
          <h2 className="text-2xl font-bold text-white">{subscriber.name}</h2>
          <p className="text-gray-400 text-sm mt-1">ID: {subscriber.id}</p>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda - Informações */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Pessoais */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-[#E50914]">👤</span>
              Informações Pessoais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-xs">Nome completo</label>
                <p className="text-white mt-1">{subscriber.name}</p>
              </div>
              <div>
                <label className="text-gray-500 text-xs">Email</label>
                <p className="text-white mt-1">{subscriber.email}</p>
              </div>
              <div>
                <label className="text-gray-500 text-xs">Telefone</label>
                <p className="text-white mt-1">{subscriber.phone}</p>
              </div>
              <div>
                <label className="text-gray-500 text-xs">CPF</label>
                <p className="text-white mt-1">{subscriber.cpf}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-500 text-xs">Endereço</label>
                <p className="text-white mt-1">{subscriber.address}</p>
              </div>
            </div>
          </div>

          {/* Status da Assinatura */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-[#E50914]">💳</span>
              Status da Assinatura
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-gray-500 text-xs">Plano</label>
                <p className="text-white mt-1 font-bold">{subscriber.plan}</p>
              </div>
              <div>
                <label className="text-gray-500 text-xs">Status</label>
                <p className="text-green-500 mt-1 font-bold">{subscriber.status}</p>
              </div>
              <div>
                <label className="text-gray-500 text-xs">Última cobrança</label>
                <p className="text-white mt-1">{subscriber.lastBilling}</p>
              </div>
              <div>
                <label className="text-gray-500 text-xs">Próxima cobrança</label>
                <p className="text-white mt-1">{subscriber.nextBilling}</p>
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-500 text-xs">Método de pagamento</label>
                <p className="text-white mt-1">{subscriber.paymentMethod}</p>
              </div>
            </div>
          </div>

          {/* Últimos Conteúdos Assistidos */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-[#E50914]">📺</span>
              Últimos Conteúdos Assistidos
            </h3>
            <div className="space-y-3">
              {recentContent.map((content, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                  <div>
                    <p className="text-white font-medium">{content.title}</p>
                    <p className="text-gray-500 text-xs">{content.type}</p>
                  </div>
                  <span className="text-gray-400 text-xs">{content.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dispositivos Conectados */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-[#E50914]">💻</span>
              Dispositivos Conectados
            </h3>
            <div className="space-y-3">
              {devices.map((device, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-[#2a2a2a] last:border-0">
                  <div className="flex-1">
                    <p className="text-white font-medium">{device.model}</p>
                    <p className="text-gray-500 text-xs">IP: {device.ip} • {device.lastUsed}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      device.status === 'online' 
                        ? 'bg-green-500/20 text-green-500' 
                        : 'bg-gray-500/20 text-gray-500'
                    }`}>
                      {device.status}
                    </span>
                    <button className="text-red-500 hover:text-red-400 text-xs">Bloquear</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna Direita - Ações */}
        <div className="space-y-6">
          {/* Card de Ações Rápidas */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4">Ações Administrativas</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white transition-colors text-left">
                Resetar senha
              </button>
              <button className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white transition-colors text-left">
                Enviar email de boas-vindas
              </button>
              <button className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white transition-colors text-left">
                Enviar notificação push
              </button>
              <button className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white transition-colors text-left">
                Limpar dispositivos
              </button>
              <button className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white transition-colors text-left">
                Alterar plano
              </button>
              <button className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white transition-colors text-left">
                Alterar status
              </button>
              <button className="w-full px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-500 rounded text-sm transition-colors text-left">
                Suspender / bloquear
              </button>
              <button className="w-full px-4 py-2 bg-green-600/20 hover:bg-green-600/30 text-green-500 rounded text-sm transition-colors text-left">
                Reativar
              </button>
              <button className="w-full px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-500 rounded text-sm transition-colors text-left">
                Excluir conta
              </button>
            </div>
          </div>

          {/* Card de Pagamento */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4">Financeiro</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 bg-[#E50914] hover:bg-[#E50914]/80 rounded text-sm text-white transition-colors">
                Gerar link de pagamento
              </button>
              <button className="w-full px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded text-sm text-white transition-colors">
                Reenviar cobrança
              </button>
            </div>
          </div>

          {/* Card de Informações */}
          <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#2a2a2a]">
            <h3 className="text-white font-bold text-lg mb-4">Informações</h3>
            <div className="space-y-3">
              <div>
                <label className="text-gray-500 text-xs">Membro desde</label>
                <p className="text-white mt-1">{subscriber.memberSince}</p>
              </div>
              <div>
                <label className="text-gray-500 text-xs">ID do Usuário</label>
                <p className="text-white mt-1 text-xs font-mono">{subscriber.id}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}