// Script para verificar e criar estruturas do banco RedFlix
import { projectId, publicAnonKey } from './utils/supabase/info.tsx';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6`;

async function verifyDatabase() {
  console.log('🔍 Verificando estrutura do banco de dados RedFlix...\n');
  
  try {
    const response = await fetch(`${SERVER_URL}/database/verify`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Erro HTTP: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(text);
      return null;
    }
    
    const data = await response.json();
    
    console.log('📊 === TABELAS ===');
    console.log(`Total esperado: ${data.tables.total}`);
    console.log(`✅ Existentes (${data.tables.existing.length}):`, data.tables.existing.join(', ') || 'nenhuma');
    console.log(`❌ Faltando (${data.tables.missing.length}):`, data.tables.missing.join(', ') || 'nenhuma');
    console.log(`Status: ${data.tables.status}\n`);
    
    console.log('📦 === STORAGE BUCKETS ===');
    console.log(`Total esperado: ${data.storage.total}`);
    console.log(`✅ Existentes (${data.storage.existing.length}):`, data.storage.existing.join(', ') || 'nenhum');
    console.log(`❌ Faltando (${data.storage.missing.length}):`, data.storage.missing.join(', ') || 'nenhum');
    console.log(`Status: ${data.storage.status}\n`);
    
    console.log('🔒 === ROW LEVEL SECURITY (RLS) ===');
    console.log(`Tabelas com RLS habilitado: ${data.rls.enabled_count}`);
    console.log(`Tabelas sem RLS: ${data.rls.disabled_count}\n`);
    
    console.log('📜 === POLÍTICAS RLS ===');
    console.log(`Total de políticas: ${data.policies.total}`);
    if (data.policies.by_table.length > 0) {
      console.log('Por tabela:');
      data.policies.by_table.forEach((p: any) => {
        console.log(`  - ${p.table}: ${p.policy_count} políticas`);
      });
    }
    console.log();
    
    console.log('🎯 === STATUS GERAL ===');
    console.log(`Status: ${data.overall_status}`);
    console.log();
    
    if (data.overall_status === 'ready') {
      console.log('✅ Banco de dados está completo e pronto para uso!');
    } else {
      console.log('⚠️  Banco de dados precisa de configuração.');
      
      if (data.tables.missing.length > 0) {
        console.log('\n💡 Para criar as tabelas faltantes:');
        console.log('   Execute o SQL completo em /supabase/REDFLIX_COMPLETE_DATABASE.sql');
        console.log('   no SQL Editor do Supabase ou via AI do Supabase');
      }
      
      if (data.storage.missing.length > 0) {
        console.log('\n💡 Para criar os buckets faltantes:');
        console.log('   Execute createStorageBuckets() ou use a rota POST /database/create-buckets');
      }
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao verificar banco de dados:', error);
    return null;
  }
}

async function createBuckets() {
  console.log('\n📦 Criando storage buckets...\n');
  
  try {
    const response = await fetch(`${SERVER_URL}/database/create-buckets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`❌ Erro HTTP: ${response.status} ${response.statusText}`);
      const text = await response.text();
      console.error(text);
      return null;
    }
    
    const data = await response.json();
    
    console.log(`✅ Buckets criados: ${data.created}`);
    console.log(`❌ Falhas: ${data.failed}`);
    console.log(`📝 ${data.message}\n`);
    
    if (data.results) {
      data.results.forEach((r: any) => {
        if (r.success) {
          console.log(`  ✅ ${r.bucket}`);
        } else {
          console.log(`  ❌ ${r.bucket}: ${r.error}`);
        }
      });
    }
    
    return data;
    
  } catch (error) {
    console.error('❌ Erro ao criar buckets:', error);
    return null;
  }
}

// Executar
console.log('================================================');
console.log('       REDFLIX - VERIFICAÇÃO DE BANCO          ');
console.log('================================================\n');

const result = await verifyDatabase();

if (result && result.storage.missing.length > 0) {
  console.log('\n📦 Tentando criar buckets faltantes...');
  await createBuckets();
  
  console.log('\n🔄 Verificando novamente...');
  await verifyDatabase();
}

console.log('\n================================================');
console.log('              VERIFICAÇÃO CONCLUÍDA             ');
console.log('================================================\n');
