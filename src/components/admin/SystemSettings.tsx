import { SettingsIcon, ServerIcon, DatabaseIcon, KeyIcon, ShieldIcon, GlobeIcon } from '../Icons';
import { Card } from '../ui/card';
import { Button } from '../ui/button-simple';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

export function SystemSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-['Inter:Extra_Bold',sans-serif] text-[32px]">
          Configurações do Sistema
        </h1>
        <p className="text-white/50 font-['Inter:Medium',sans-serif] text-[14px] mt-1">
          Gerenciamento de servidores, APIs e integrações
        </p>
      </div>

      {/* Server Status */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4 flex items-center gap-2">
          <ServerIcon size={20} />
          Status dos Servidores
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-lg border border-green-600/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[14px]">CDN Principal</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 text-[12px]">Online</span>
              </div>
            </div>
            <p className="text-white/50 text-[12px]">Latência: 12ms | Uptime: 99.98%</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-green-600/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[14px]">Banco de Dados</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 text-[12px]">Online</span>
              </div>
            </div>
            <p className="text-white/50 text-[12px]">Queries: 2.4k/s | Conexões: 142</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-green-600/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[14px]">Storage (Supabase)</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-500 text-[12px]">Online</span>
              </div>
            </div>
            <p className="text-white/50 text-[12px]">Usado: 234 GB / 500 GB</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-yellow-600/30">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-['Inter:Semi_Bold',sans-serif] text-[14px]">Player Stream</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <span className="text-yellow-500 text-[12px]">Limitado</span>
              </div>
            </div>
            <p className="text-white/50 text-[12px]">Bandwidth: 78% utilizado</p>
          </div>
        </div>
      </Card>

      {/* API Keys */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4 flex items-center gap-2">
          <KeyIcon size={20} />
          Chaves de API
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Input value="sk_live_***************************" readOnly className="bg-white/5 border-white/10 text-white flex-1" />
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white">Renovar</Button>
          </div>
          <div className="flex items-center gap-3">
            <Input value="TMDB API: ddb1bdf6aa91***************" readOnly className="bg-white/5 border-white/10 text-white flex-1" />
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-white">Editar</Button>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4 flex items-center gap-2">
          <ShieldIcon size={20} />
          Segurança
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-['Inter:Medium',sans-serif] text-[14px]">Autenticação de dois fatores</p>
              <p className="text-white/50 text-[12px]">Adiciona camada extra de segurança</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-['Inter:Medium',sans-serif] text-[14px]">Logs de auditoria</p>
              <p className="text-white/50 text-[12px]">Registra todas as ações administrativas</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
            <div>
              <p className="text-white font-['Inter:Medium',sans-serif] text-[14px]">SSL/TLS</p>
              <p className="text-white/50 text-[12px]">Certificado válido até 15/12/2025</p>
            </div>
            <Switch defaultChecked disabled />
          </div>
        </div>
      </Card>

      {/* Integrations */}
      <Card className="bg-[#1a1a1a] border-white/10 p-6">
        <h3 className="text-white font-['Inter:Bold',sans-serif] text-[18px] mb-4 flex items-center gap-2">
          <GlobeIcon size={20} />
          Integrações
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
            <span className="text-white font-['Inter:Medium',sans-serif] text-[14px]">Google Analytics</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
            <span className="text-white font-['Inter:Medium',sans-serif] text-[14px]">Firebase</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
            <span className="text-white font-['Inter:Medium',sans-serif] text-[14px]">Supabase</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="p-3 bg-white/5 rounded-lg flex items-center justify-between">
            <span className="text-white font-['Inter:Medium',sans-serif] text-[14px]">Stripe</span>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </Card>

      <Button className="bg-red-600 hover:bg-red-700 text-white">
        Salvar Configurações
      </Button>
    </div>
  );
}
