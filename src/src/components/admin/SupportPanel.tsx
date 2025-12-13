import { Card } from '../ui/card';
import { Badge } from '../ui/badge-simple';

// Icons inline to avoid lucide-react dependency
const MessageSquare = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
);

const AlertCircle = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckCircle = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const Clock = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const Star = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

export function SupportPanel() {
  const tickets = [
    { id: '#TK-1234', user: 'João Silva', subject: 'Problema com pagamento', status: 'open', priority: 'high', date: '2024-11-04 10:30' },
    { id: '#TK-1235', user: 'Maria Santos', subject: 'Vídeo não carrega', status: 'in-progress', priority: 'medium', date: '2024-11-04 09:15' },
    { id: '#TK-1236', user: 'Pedro Costa', subject: 'Dúvida sobre planos', status: 'resolved', priority: 'low', date: '2024-11-03 18:20' },
  ];

  const feedback = [
    { user: 'Ana Oliveira', rating: 5, comment: 'Excelente serviço! Muito satisfeita.', date: '2024-11-04' },
    { user: 'Carlos Mendes', rating: 4, comment: 'Boa plataforma, poderia ter mais conteúdo nacional.', date: '2024-11-03' },
    { user: 'Lucia Ferreira', rating: 5, comment: 'Interface muito intuitiva e rápida.', date: '2024-11-03' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
          Suporte & Feedback
        </h1>
        <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
          Gerenciamento de tickets e feedback dos usuários
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/20 rounded-lg">
              <AlertCircle className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">Abertos</p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">42</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-yellow-600/20 rounded-lg">
              <Clock className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">Em Andamento</p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">28</p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">Resolvidos</p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">234</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Tickets */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
          Tickets Recentes
        </h3>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-white/50 font-['Inter:Medium',sans-serif] text-[12px]">{ticket.id}</span>
                    <Badge className={`${
                      ticket.status === 'open' ? 'bg-red-600/20 text-red-500 border-red-600/30' :
                      ticket.status === 'in-progress' ? 'bg-yellow-600/20 text-yellow-500 border-yellow-600/30' :
                      'bg-green-600/20 text-green-500 border-green-600/30'
                    } border text-[11px]`}>
                      {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in-progress' ? 'Em Andamento' : 'Resolvido'}
                    </Badge>
                    <Badge className={`${
                      ticket.priority === 'high' ? 'bg-red-600/20 text-red-500' :
                      ticket.priority === 'medium' ? 'bg-yellow-600/20 text-yellow-500' :
                      'bg-blue-600/20 text-blue-500'
                    } text-[11px]`}>
                      {ticket.priority === 'high' ? 'Alta' : ticket.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                  </div>
                  <h4 className="text-white font-['Inter:Semi_Bold',sans-serif] text-[15px]">{ticket.subject}</h4>
                  <p className="text-white/60 font-['Inter:Regular',sans-serif] text-[13px]">{ticket.user}</p>
                </div>
                <span className="text-white/40 text-[12px]">{ticket.date}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Feedback */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4">
          Feedback dos Usuários
        </h3>
        <div className="space-y-3">
          {feedback.map((item, index) => (
            <div key={index} className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[14px]">{item.user}</span>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className={i < item.rating ? 'text-yellow-500 fill-yellow-500' : 'text-white/20'} />
                    ))}
                  </div>
                </div>
                <span className="text-white/40 text-[12px]">{item.date}</span>
              </div>
              <p className="text-white/70 font-['Inter:Regular',sans-serif] text-[13px]">{item.comment}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
