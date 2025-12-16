/**
 * @deprecated This file is no longer used in the application.
 * The app now uses databaseContentLoader.ts to load content from Supabase database.
 * This file is kept for reference only.
 * 
 * Original purpose: Carregar filmes.txt via proxy do servidor
 */
async function loadFilmesTxt(): Promise<string> {
  console.log('📡 Tentando carregar filmes.txt...');
  
  // TENTATIVA 1: Via proxy do servidor
  try {
    const proxyUrl = `https://${projectId}.supabase.co/functions/v1/make-server-2363f5d6/proxy-m3u?url=${encodeURIComponent('https://chemorena.com/filmes/filmes.txt')}`;
    
    console.log('📡 Tentativa 1: Via proxy do servidor...');
    
    const response = await fetch(proxyUrl, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (response.ok) {
      const content = await response.text();
      console.log(`✅ Arquivo carregado via proxy: ${content.length} caracteres`);
      return content;
    }
    
    console.warn(`⚠️ Proxy falhou: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.warn('⚠️ Erro no proxy do servidor:', error);
  }
  
  // TENTATIVA 2: Direto (pode ter CORS)
  try {
    console.log('📡 Tentativa 2: Fetch direto...');
    
    const response = await fetch('https://chemorena.com/filmes/filmes.txt', {
      mode: 'cors',
      cache: 'no-cache',
    });
    
    if (response.ok) {
      const content = await response.text();
      console.log(`✅ Arquivo carregado direto: ${content.length} caracteres`);
      return content;
    }
    
    console.warn(`⚠️ Fetch direto falhou: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.warn('⚠️ Erro no fetch direto:', error);
  }
  
  // TENTATIVA 3: Via proxy do Vite (dev only)
  try {
    console.log('📡 Tentativa 3: Via proxy Vite...');
    
    const response = await fetch('/filmes/filmes.txt');
    
    if (response.ok) {
      const content = await response.text();
      console.log(`✅ Arquivo carregado via Vite proxy: ${content.length} caracteres`);
      return content;
    }
    
    console.warn(`⚠️ Vite proxy falhou: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.warn('⚠️ Erro no Vite proxy:', error);
  }
  
  throw new Error('Não foi possível carregar filmes.txt de nenhuma fonte. Verifique a conexão.');
}