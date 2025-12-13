/**
 * Script de importação de dados dos arquivos JSON para o Supabase
 * 
 * Este script:
 * 1. Lê os arquivos JSON locais (filmes.json, series.json, canais.json)
 * 2. Importa os dados para as respectivas tabelas no Supabase
 * 3. Evita duplicatas verificando se o registro já existe
 * 4. Pode ser executado múltiplas vezes com segurança
 */

import { db } from './supabase/client';

// Tipos para os dados JSON
interface FilmeJSON {
  nome: string;
  logo: string;
  categoria: string;
  url: string;
}

interface SerieJSON {
  nome: string;
  logo: string;
  categoria: string;
  url: string;
}

interface CanalJSON {
  nome: string;
  logo: string;
  categoria: string;
  url: string;
}

/**
 * Carrega dados do arquivo JSON local
 */
async function carregarJSON<T>(caminho: string): Promise<T[]> {
  try {
    const response = await fetch(caminho);
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${caminho}: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Erro ao carregar ${caminho}:`, error);
    return [];
  }
}

/**
 * Importa filmes do JSON para o Supabase
 */
export async function importarFilmes(): Promise<{
  sucesso: boolean;
  total: number;
  importados: number;
  erros: string[];
}> {
  console.log('📽️ Iniciando importação de filmes...');
  
  const resultado = {
    sucesso: false,
    total: 0,
    importados: 0,
    erros: [] as string[],
  };

  try {
    // Carregar dados do JSON
    const filmes = await carregarJSON<FilmeJSON>('/data/filmes.json');
    resultado.total = filmes.length;

    if (filmes.length === 0) {
      resultado.erros.push('Nenhum filme encontrado no arquivo JSON');
      return resultado;
    }

    console.log(`📊 ${filmes.length} filmes encontrados no JSON`);

    // Buscar filmes existentes
    const filmesExistentes = await db.filmes.getAll();
    const nomesExistentes = new Set(filmesExistentes.map(f => f.nome));

    // Filtrar apenas filmes novos
    const filmesNovos = filmes.filter(f => !nomesExistentes.has(f.nome));

    if (filmesNovos.length === 0) {
      console.log('✅ Todos os filmes já existem no banco');
      resultado.sucesso = true;
      return resultado;
    }

    console.log(`📥 Importando ${filmesNovos.length} filmes novos...`);

    // Inserir filmes novos
    await db.filmes.insert(filmesNovos);
    resultado.importados = filmesNovos.length;
    resultado.sucesso = true;

    console.log(`✅ ${filmesNovos.length} filmes importados com sucesso`);
    
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao importar filmes:', mensagem);
    resultado.erros.push(mensagem);
  }

  return resultado;
}

/**
 * Importa séries do JSON para o Supabase
 */
export async function importarSeries(): Promise<{
  sucesso: boolean;
  total: number;
  importados: number;
  erros: string[];
}> {
  console.log('📺 Iniciando importação de séries...');
  
  const resultado = {
    sucesso: false,
    total: 0,
    importados: 0,
    erros: [] as string[],
  };

  try {
    // Carregar dados do JSON
    const series = await carregarJSON<SerieJSON>('/data/series.json');
    resultado.total = series.length;

    if (series.length === 0) {
      resultado.erros.push('Nenhuma série encontrada no arquivo JSON');
      return resultado;
    }

    console.log(`📊 ${series.length} séries encontradas no JSON`);

    // Buscar séries existentes
    const seriesExistentes = await db.series.getAll();
    const nomesExistentes = new Set(seriesExistentes.map(s => s.nome));

    // Filtrar apenas séries novas
    const seriesNovas = series.filter(s => !nomesExistentes.has(s.nome));

    if (seriesNovas.length === 0) {
      console.log('✅ Todas as séries já existem no banco');
      resultado.sucesso = true;
      return resultado;
    }

    console.log(`📥 Importando ${seriesNovas.length} séries novas...`);

    // Inserir séries novas
    await db.series.insert(seriesNovas);
    resultado.importados = seriesNovas.length;
    resultado.sucesso = true;

    console.log(`✅ ${seriesNovas.length} séries importadas com sucesso`);
    
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao importar séries:', mensagem);
    resultado.erros.push(mensagem);
  }

  return resultado;
}

/**
 * Importa canais do JSON para o Supabase
 */
export async function importarCanais(): Promise<{
  sucesso: boolean;
  total: number;
  importados: number;
  erros: string[];
}> {
  console.log('📡 Iniciando importação de canais...');
  
  const resultado = {
    sucesso: false,
    total: 0,
    importados: 0,
    erros: [] as string[],
  };

  try {
    // Carregar dados do JSON
    const canais = await carregarJSON<CanalJSON>('/data/canais.json');
    resultado.total = canais.length;

    if (canais.length === 0) {
      resultado.erros.push('Nenhum canal encontrado no arquivo JSON');
      return resultado;
    }

    console.log(`📊 ${canais.length} canais encontrados no JSON`);

    // Buscar canais existentes
    const canaisExistentes = await db.canais.getAll();
    const nomesExistentes = new Set(canaisExistentes.map(c => c.nome));

    // Filtrar apenas canais novos
    const canaisNovos = canais.filter(c => !nomesExistentes.has(c.nome));

    if (canaisNovos.length === 0) {
      console.log('✅ Todos os canais já existem no banco');
      resultado.sucesso = true;
      return resultado;
    }

    console.log(`📥 Importando ${canaisNovos.length} canais novos...`);

    // Inserir canais novos
    await db.canais.insert(canaisNovos);
    resultado.importados = canaisNovos.length;
    resultado.sucesso = true;

    console.log(`✅ ${canaisNovos.length} canais importados com sucesso`);
    
  } catch (error) {
    const mensagem = error instanceof Error ? error.message : String(error);
    console.error('❌ Erro ao importar canais:', mensagem);
    resultado.erros.push(mensagem);
  }

  return resultado;
}

/**
 * Importa todos os dados (filmes, séries e canais)
 */
export async function importarTodosDados() {
  console.log('🚀 Iniciando importação completa de dados...\n');

  const resultados = {
    filmes: await importarFilmes(),
    series: await importarSeries(),
    canais: await importarCanais(),
  };

  // Resumo
  console.log('\n📊 RESUMO DA IMPORTAÇÃO:');
  console.log('─'.repeat(50));
  
  console.log(`\n📽️ Filmes:`);
  console.log(`   Total no JSON: ${resultados.filmes.total}`);
  console.log(`   Importados: ${resultados.filmes.importados}`);
  console.log(`   Status: ${resultados.filmes.sucesso ? '✅ Sucesso' : '❌ Falhou'}`);
  if (resultados.filmes.erros.length > 0) {
    console.log(`   Erros: ${resultados.filmes.erros.join(', ')}`);
  }

  console.log(`\n📺 Séries:`);
  console.log(`   Total no JSON: ${resultados.series.total}`);
  console.log(`   Importados: ${resultados.series.importados}`);
  console.log(`   Status: ${resultados.series.sucesso ? '✅ Sucesso' : '❌ Falhou'}`);
  if (resultados.series.erros.length > 0) {
    console.log(`   Erros: ${resultados.series.erros.join(', ')}`);
  }

  console.log(`\n📡 Canais:`);
  console.log(`   Total no JSON: ${resultados.canais.total}`);
  console.log(`   Importados: ${resultados.canais.importados}`);
  console.log(`   Status: ${resultados.canais.sucesso ? '✅ Sucesso' : '❌ Falhou'}`);
  if (resultados.canais.erros.length > 0) {
    console.log(`   Erros: ${resultados.canais.erros.join(', ')}`);
  }

  const totalImportado = 
    resultados.filmes.importados + 
    resultados.series.importados + 
    resultados.canais.importados;

  console.log('\n─'.repeat(50));
  console.log(`\n🎉 Total importado: ${totalImportado} registros`);
  console.log('\n✅ Importação completa!\n');

  return resultados;
}

// Executar importação automaticamente se chamado diretamente
if (typeof window !== 'undefined') {
  // Em desenvolvimento, expor funções globalmente para teste manual
  (window as any).importarDados = {
    tudo: importarTodosDados,
    filmes: importarFilmes,
    series: importarSeries,
    canais: importarCanais,
  };
}
