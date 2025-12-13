/**
 * Mensagem de inicialização do RedFlix
 * Exibe uma vez ao carregar a aplicação
 */

let messageShown = false;

export function showStartupMessage() {
  if (messageShown) return;
  messageShown = true;

  const style = 'color: #E50914; font-weight: bold; font-size: 14px;';
  const styleNormal = 'color: #fff; font-size: 12px;';
  
  console.log('%c🎬 RedFlix', style);
  console.log('%cPlataforma de streaming carregada com sucesso!', styleNormal);
  console.log('%c✅ Mais de 80 funcionalidades ativas', styleNormal);
  console.log('%c📡 TMDB + Football APIs integradas', styleNormal);
  console.log('%c⚽ Página de Futebol completa', styleNormal);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #E50914;');
}
