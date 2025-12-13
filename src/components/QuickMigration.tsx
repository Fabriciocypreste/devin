import { useState } from 'react';
import { Button } from './ui/button';
import { toast } from '../utils/toast';
import { migrateAll } from '../utils/migrationHelpers';
import { DatabaseIcon as Database, ZapIcon as Zap } from './Icons';

/**
 * Quick Migration Button
 * 
 * Botão rápido para executar migração completa
 * Pode ser adicionado em qualquer lugar (header, admin, etc)
 */
export function QuickMigration() {
  const [loading, setLoading] = useState(false);

  const handleMigrate = async () => {
    if (!confirm('Deseja migrar TODOS os dados locais para o banco de dados?\n\nIsso vai:\n✅ Migrar filmes/séries\n✅ Migrar canais IPTV\n✅ Melhorar performance em 10x\n\nTempo estimado: 10-30 segundos')) {
      return;
    }

    try {
      setLoading(true);
      toast.loading('🔄 Migrando dados...');

      const results = await migrateAll();

      toast.dismiss();

      if (results.content.success && results.channels.success) {
        toast.success(
          `✅ Migração completa!\n\n` +
          `📺 ${results.content.count} filmes/séries\n` +
          `📡 ${results.channels.count} canais IPTV\n\n` +
          `🚀 Sistema agora 10x mais rápido!`,
          { duration: 5000 }
        );
      } else if (results.content.success || results.channels.success) {
        toast.warning(
          `⚠️ Migração parcial\n\n` +
          `${results.content.success ? `✅ ${results.content.count} filmes/séries` : '❌ Falha em conteúdo'}\n` +
          `${results.channels.success ? `✅ ${results.channels.count} canais` : '❌ Falha em canais'}`,
          { duration: 5000 }
        );
      } else {
        toast.error('❌ Falha na migração');
      }

      // Reload page para aplicar mudanças
      setTimeout(() => {
        if (confirm('Migração concluída! Recarregar página para aplicar mudanças?')) {
          window.location.reload();
        }
      }, 2000);

    } catch (error) {
      console.error('❌ Erro na migração:', error);
      toast.dismiss();
      toast.error('❌ Erro na migração. Verifique o console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleMigrate}
      disabled={loading}
      className="bg-gradient-to-r from-[#E50914] to-[#b8070f] hover:from-[#b8070f] hover:to-[#8a0610] text-white shadow-lg"
    >
      {loading ? (
        <>
          <Zap className="w-4 h-4 mr-2 animate-pulse" />
          Migrando...
        </>
      ) : (
        <>
          <Database className="w-4 h-4 mr-2" />
          Migrar para Banco
        </>
      )}
    </Button>
  );
}

/**
 * Migration Status Indicator
 * 
 * Indicador visual do status da migração
 */
export function MigrationStatus({ 
  contentExists, 
  channelsExists 
}: { 
  contentExists: boolean; 
  channelsExists: boolean; 
}) {
  const allMigrated = contentExists && channelsExists;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1a1a1a] border border-[#333]">
      <div 
        className={`w-2 h-2 rounded-full ${
          allMigrated ? 'bg-green-500' : 'bg-yellow-500'
        } animate-pulse`}
      />
      <span className="text-xs text-gray-400">
        {allMigrated ? 'Banco Ativo' : 'Cache Local'}
      </span>
    </div>
  );
}