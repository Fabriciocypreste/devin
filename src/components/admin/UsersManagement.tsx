import { useState } from 'react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button-simple';
import { Badge } from '../ui/badge-simple';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select-simple';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu-simple';

// Icons inline to avoid lucide-react dependency
const Users = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const Search = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const Filter = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const Download = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const Mail = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
  </svg>
);

const Bell = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
  </svg>
);

const Monitor = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
    <line x1="8" y1="21" x2="16" y2="21"></line>
    <line x1="12" y1="17" x2="12" y2="21"></line>
  </svg>
);

const Smartphone = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const Tv = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
    <polyline points="17 2 12 7 7 2"></polyline>
  </svg>
);

const MoreVertical = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1"></circle>
    <circle cx="12" cy="5" r="1"></circle>
    <circle cx="12" cy="19" r="1"></circle>
  </svg>
);

const Ban = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
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

const DollarSign = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

type UserStatus = 'active' | 'trial' | 'suspended' | 'cancelled';

interface User {
  id: string;
  name: string;
  email: string;
  status: UserStatus;
  plan: string;
  mrr: number;
  joinDate: string;
  lastLogin: string;
  devices: number;
  totalSpent: number;
}

export function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Dados mockados
  const users: User[] = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      status: 'active',
      plan: 'Premium',
      mrr: 29.90,
      joinDate: '2024-01-15',
      lastLogin: '2024-11-03 14:30',
      devices: 3,
      totalSpent: 179.40
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      status: 'active',
      plan: 'Ultra',
      mrr: 49.90,
      joinDate: '2024-02-20',
      lastLogin: '2024-11-04 09:15',
      devices: 5,
      totalSpent: 449.10
    },
    {
      id: '3',
      name: 'Pedro Costa',
      email: 'pedro.costa@email.com',
      status: 'trial',
      plan: 'Premium',
      mrr: 0,
      joinDate: '2024-10-28',
      lastLogin: '2024-11-03 18:45',
      devices: 2,
      totalSpent: 0
    },
    {
      id: '4',
      name: 'Ana Oliveira',
      email: 'ana.oliveira@email.com',
      status: 'suspended',
      plan: 'Básico',
      mrr: 0,
      joinDate: '2024-03-10',
      lastLogin: '2024-10-15 12:20',
      devices: 1,
      totalSpent: 119.60
    },
    {
      id: '5',
      name: 'Carlos Mendes',
      email: 'carlos.mendes@email.com',
      status: 'active',
      plan: 'Premium',
      mrr: 29.90,
      joinDate: '2024-05-05',
      lastLogin: '2024-11-04 11:00',
      devices: 4,
      totalSpent: 179.40
    },
  ];

  const stats = {
    total: 12458,
    active: 10234,
    trial: 1892,
    suspended: 332
  };

  const getStatusBadge = (status: UserStatus) => {
    const variants = {
      active: { label: 'Ativo', class: 'bg-green-600/20 text-green-500 border-green-600/30' },
      trial: { label: 'Trial', class: 'bg-blue-600/20 text-blue-500 border-blue-600/30' },
      suspended: { label: 'Suspenso', class: 'bg-red-600/20 text-red-500 border-red-600/30' },
      cancelled: { label: 'Cancelado', class: 'bg-gray-600/20 text-gray-500 border-gray-600/30' }
    };

    const variant = variants[status];
    return (
      <Badge className={`${variant.class} border`}>
        {variant.label}
      </Badge>
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
            Gerenciamento de Usuários
          </h1>
          <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
            {stats.total.toLocaleString()} usuários cadastrados
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            <Mail size={16} className="mr-2" />
            Enviar E-mail
          </Button>
          <Button className="bg-white/10 hover:bg-white/20 text-white border-white/20">
            <Bell size={16} className="mr-2" />
            Push
          </Button>
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <Download size={16} className="mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-600/20 rounded-lg">
              <Users className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Total
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.total.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-600/20 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Ativos
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.active.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-600/20 rounded-lg">
              <Clock className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Em Trial
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.trial.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-[#1a1a1a] border-white/10 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-600/20 rounded-lg">
              <Ban className="text-red-600" size={20} />
            </div>
            <div>
              <p className="text-white/60 font-['Inter:Medium',sans-serif] text-[12px]">
                Suspensos
              </p>
              <p className="text-white font-['Inter:Bold',sans-serif] text-[20px]">
                {stats.suspended.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#1a1a1a] border-white/10 p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-white">
              <Filter size={16} className="mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="active">Ativos</SelectItem>
              <SelectItem value="trial">Trial</SelectItem>
              <SelectItem value="suspended">Suspensos</SelectItem>
              <SelectItem value="cancelled">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#1a1a1a] border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Usuário
                </th>
                <th className="text-left py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Plano
                </th>
                <th className="text-right py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  MRR
                </th>
                <th className="text-left py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Cadastro
                </th>
                <th className="text-left py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Último Login
                </th>
                <th className="text-center py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Dispositivos
                </th>
                <th className="text-right py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Total Gasto
                </th>
                <th className="text-center py-4 px-6 text-white/60 font-['Inter:Semi_Bold',sans-serif] text-[12px]">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="py-4 px-6">
                    <div>
                      <p className="text-white font-['Inter:Medium',sans-serif] text-[14px]">
                        {user.name}
                      </p>
                      <p className="text-white/50 font-['Inter:Regular',sans-serif] text-[12px]">
                        {user.email}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {getStatusBadge(user.status)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white font-['Inter:Medium',sans-serif] text-[14px]">
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[14px]">
                      R$ {user.mrr.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white/70 font-['Inter:Regular',sans-serif] text-[13px]">
                      {new Date(user.joinDate).toLocaleDateString('pt-BR')}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-white/70 font-['Inter:Regular',sans-serif] text-[13px]">
                      {user.lastLogin}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-center gap-1">
                      <Monitor size={14} className="text-white/50" />
                      <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[14px]">
                        {user.devices}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <DollarSign size={14} className="text-green-500" />
                      <span className="text-white font-['Inter:Bold',sans-serif] text-[14px]">
                        {user.totalSpent.toFixed(2)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          <MoreVertical size={16} className="text-white/70" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1a1a1a] border-white/10">
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          Ver Detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          Enviar E-mail
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          Gerenciar Plano
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-white/10">
                          Histórico
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 hover:bg-red-600/10">
                          Suspender
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-white/50 font-['Inter:Regular',sans-serif] text-[14px]">
          Mostrando {filteredUsers.length} de {stats.total.toLocaleString()} usuários
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Anterior
          </Button>
          <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
