import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from '../utils/toast';
import { 
  migrateContentList, 
  migrateChannelsList, 
  migrateAll,
  checkKVStatus 
} from '../utils/migrationHelpers';
import { 
  DatabaseIcon as Database, 
  DownloadIcon as Download, 
  CheckCircle2Icon as CheckCircle2, 
  XCircleIcon as XCircle, 
  Loader2Icon as Loader2 
} from './Icons';

/**
 * Painel de Migração de Dados
 * 
 * Permite migrar dados locais para o KV Store
 */
export function MigrationPanel() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    contentListExists: boolean;
    channelsListExists: boolean;
    contentCount: number;
    channelsCount: number;
  } | null>(null);

  // Verificar status atual
  const handleCheckStatus = async () => {
    try {
      setLoading(true);
      toast.loading('Verificando status do KV Store...');
      
      const kvStatus = await checkKVStatus();
      setStatus(kvStatus);
      
      toast.dismiss();
      toast.success('Status verificado com sucesso!');
      
      console.log('📊 Status do KV Store:', kvStatus);
    } catch (error) {
      console.error('❌ Erro ao verificar status:', error);
      toast.dismiss();
      toast.error('Erro ao verificar status');
    } finally {
      setLoading(false);
    }
  };

  // Migrar lista de conteúdo
  const handleMigrateContent = async () => {
    try {
      setLoading(true);
      toast.loading('Migrando lista de filmes/séries...');
      
      const result = await migrateContentList();
      
      toast.dismiss();
      toast.success(`✅ ${result.count} filmes/séries migrados!`);
      
      // Atualizar status
      await handleCheckStatus();
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      toast.dismiss();
      toast.error('Erro na migração de conteúdo');
    } finally {
      setLoading(false);
    }
  };

  // Migrar lista de canais
  const handleMigrateChannels = async () => {
    try {
      setLoading(true);
      toast.loading('Migrando lista de canais IPTV...');
      
      const result = await migrateChannelsList();
      
      toast.dismiss();
      toast.success(`✅ ${result.count} canais migrados!`);
      
      // Atualizar status
      await handleCheckStatus();
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      toast.dismiss();
      toast.error('Erro na migração de canais');
    } finally {
      setLoading(false);
    }
  };

  // Migrar tudo
  const handleMigrateAll = async () => {
    try {
      setLoading(true);
      toast.loading('Migrando todos os dados...');
      
      const results = await migrateAll();
      
      toast.dismiss();
      
      if (results.content.success && results.channels.success) {
        toast.success(`✅ Migração completa! ${results.content.count} conteúdos + ${results.channels.count} canais`);
      } else {
        toast.warning('Migração parcial concluída');
      }
      
      // Atualizar status
      await handleCheckStatus();
    } catch (error) {
      console.error('❌ Erro na migração:', error);
      toast.dismiss();
      toast.error('Erro na migração completa');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Database className="w-8 h-8 text-[#E50914]" />
        <div>
          <h2 className="text-2xl text-white">Migração de Dados</h2>
          <p className="text-gray-400 text-sm">
            Migrar dados locais para o Banco de Dados (KV Store)
          </p>
        </div>
      </div>

      {/* Status Card */}
      <Card className="bg-[#1a1a1a] border-[#333] p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white">Status Atual</h3>
          <Button
            onClick={handleCheckStatus}
            disabled={loading}
            variant="outline"
            size="sm"
            className="border-[#E50914] text-[#E50914] hover:bg-[#E50914] hover:text-white"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Verificar Status'
            )}
          </Button>
        </div>

        {status ? (
          <div className="space-y-3">
            {/* Content List Status */}
            <div className="flex items-center justify-between p-3 bg-[#141414] rounded">
              <div className="flex items-center gap-3">
                {status.contentListExists ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="text-white">Lista de Filmes/Séries</p>
                  <p className="text-sm text-gray-400">
                    {status.contentListExists 
                      ? `${status.contentCount} items no banco` 
                      : 'Não encontrado no banco'}
                  </p>
                </div>
              </div>
            </div>

            {/* Channels List Status */}
            <div className="flex items-center justify-between p-3 bg-[#141414] rounded">
              <div className="flex items-center gap-3">
                {status.channelsListExists ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <p className="text-white">Lista de Canais IPTV</p>
                  <p className="text-sm text-gray-400">
                    {status.channelsListExists 
                      ? `${status.channelsCount} canais no banco` 
                      : 'Não encontrado no banco'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Clique em "Verificar Status" para ver o estado atual
          </div>
        )}
      </Card>

      {/* Migration Actions */}
      <Card className="bg-[#1a1a1a] border-[#333] p-6">
        <h3 className="text-white mb-4">Ações de Migração</h3>
        
        <div className="space-y-3">
          {/* Migrate Content */}
          <div className="flex items-center justify-between p-4 bg-[#141414] rounded">
            <div>
              <p className="text-white">Migrar Filmes/Séries</p>
              <p className="text-sm text-gray-400">
                Dados Locais → KV Store
              </p>
            </div>
            <Button
              onClick={handleMigrateContent}
              disabled={loading}
              className="bg-[#E50914] hover:bg-[#b8070f] text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Migrar
            </Button>
          </div>

          {/* Migrate Channels */}
          <div className="flex items-center justify-between p-4 bg-[#141414] rounded">
            <div>
              <p className="text-white">Migrar Canais IPTV</p>
              <p className="text-sm text-gray-400">
                Do Chemorena → KV Store
              </p>
            </div>
            <Button
              onClick={handleMigrateChannels}
              disabled={loading}
              className="bg-[#E50914] hover:bg-[#b8070f] text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Migrar
            </Button>
          </div>

          {/* Migrate All */}
          <div className="flex items-center justify-between p-4 bg-[#141414] rounded border border-[#E50914]">
            <div>
              <p className="text-white">Migrar Tudo</p>
              <p className="text-sm text-gray-400">
                Migrar conteúdo + canais de uma vez
              </p>
            </div>
            <Button
              onClick={handleMigrateAll}
              disabled={loading}
              className="bg-[#E50914] hover:bg-[#b8070f] text-white"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Migrar Tudo
            </Button>
          </div>
        </div>
      </Card>

      {/* Info Card */}
      <Card className="bg-[#1a1a1a] border-[#333] p-6">
        <h3 className="text-white mb-3">ℹ️ Informações</h3>
        <div className="space-y-2 text-sm text-gray-400">
          <p>• A migração salva dados locais no banco de dados</p>
          <p>• Após migrar, o sistema usará os dados do banco (mais rápido)</p>
          <p>• Você pode executar a migração quantas vezes quiser</p>
          <p>• Os dados existentes serão sobrescritos</p>
          <p>• Esta operação é segura e pode ser revertida</p>
        </div>
      </Card>

      {/* Sources Info */}
      <Card className="bg-[#1a1a1a] border-[#333] p-6">
        <h3 className="text-white mb-3">📍 Fontes de Dados</h3>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-gray-400 mb-1">Filmes/Séries:</p>
            <p className="text-[#E50914] font-mono text-xs break-all">
              Catálogo Local Embedado (130+ títulos)
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Canais IPTV:</p>
            <p className="text-[#E50914] font-mono text-xs break-all">
              https://chemorena.com/filmes/canaissite.txt
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}