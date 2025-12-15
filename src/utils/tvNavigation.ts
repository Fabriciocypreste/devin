/**
 * TV Navigation - Navegacao por controle remoto para Android TV / TV Box
 * 
 * Suporte completo para DPAD:
 * - Navegacao horizontal/vertical
 * - Foco visivel
 * - Play/Pause pelo controle
 * - OK confirma
 * - BACK volta
 */

// Detectar se esta em Android TV
export function isAndroidTV(): boolean {
  if (typeof window === 'undefined') return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const isAndroid = userAgent.includes('android');
  const isTV = userAgent.includes('tv') || 
               userAgent.includes('aft') || // Amazon Fire TV
               userAgent.includes('tizen') || // Samsung TV
               userAgent.includes('webos') || // LG TV
               userAgent.includes('smart-tv') ||
               userAgent.includes('googletv') ||
               userAgent.includes('crkey'); // Chromecast
  
  // Verificar se tem suporte a gamepad (comum em TV boxes)
  const hasGamepad = 'getGamepads' in navigator;
  
  // Verificar tamanho de tela grande (TVs geralmente > 1080p)
  const isLargeScreen = window.innerWidth >= 1280;
  
  return (isAndroid && isTV) || (isAndroid && isLargeScreen && hasGamepad);
}

// Teclas do controle remoto
export const TV_KEYS = {
  UP: ['ArrowUp', 'w', 'W'],
  DOWN: ['ArrowDown', 's', 'S'],
  LEFT: ['ArrowLeft', 'a', 'A'],
  RIGHT: ['ArrowRight', 'd', 'D'],
  ENTER: ['Enter', ' '],
  BACK: ['Escape', 'Backspace', 'GoBack'],
  PLAY_PAUSE: ['MediaPlayPause', 'p', 'P', ' '],
  STOP: ['MediaStop'],
  FAST_FORWARD: ['MediaFastForward'],
  REWIND: ['MediaRewind'],
};

// Classe para elementos focaveis
export const FOCUSABLE_CLASS = 'tv-focusable';
export const FOCUSED_CLASS = 'tv-focused';

// Estado global de navegacao
let currentFocusIndex = 0;
let focusableElements: HTMLElement[] = [];
let isNavigationEnabled = false;

/**
 * Inicializa navegacao por controle remoto
 */
export function initTVNavigation(): void {
  if (isNavigationEnabled) return;
  
  console.log('📺 Inicializando navegacao TV...');
  
  // Adicionar listener de teclado
  document.addEventListener('keydown', handleKeyDown);
  
  // Observar mudancas no DOM para atualizar elementos focaveis
  const observer = new MutationObserver(() => {
    updateFocusableElements();
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  // Atualizar elementos focaveis inicialmente
  updateFocusableElements();
  
  isNavigationEnabled = true;
  console.log('📺 Navegacao TV ativada');
}

/**
 * Desativa navegacao por controle remoto
 */
export function disableTVNavigation(): void {
  document.removeEventListener('keydown', handleKeyDown);
  isNavigationEnabled = false;
  console.log('📺 Navegacao TV desativada');
}

/**
 * Atualiza lista de elementos focaveis
 */
export function updateFocusableElements(): void {
  focusableElements = Array.from(
    document.querySelectorAll(`.${FOCUSABLE_CLASS}, [data-tv-focusable="true"], button, a, [tabindex="0"]`)
  ) as HTMLElement[];
  
  // Filtrar elementos visiveis
  focusableElements = focusableElements.filter(el => {
    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);
    return rect.width > 0 && 
           rect.height > 0 && 
           style.display !== 'none' && 
           style.visibility !== 'hidden';
  });
  
  // Se nao houver foco atual, focar no primeiro elemento
  if (focusableElements.length > 0 && currentFocusIndex >= focusableElements.length) {
    currentFocusIndex = 0;
  }
}

/**
 * Handler de teclas
 */
function handleKeyDown(event: KeyboardEvent): void {
  const key = event.key;
  
  // Navegacao
  if (TV_KEYS.UP.includes(key)) {
    event.preventDefault();
    navigateVertical(-1);
  } else if (TV_KEYS.DOWN.includes(key)) {
    event.preventDefault();
    navigateVertical(1);
  } else if (TV_KEYS.LEFT.includes(key)) {
    event.preventDefault();
    navigateHorizontal(-1);
  } else if (TV_KEYS.RIGHT.includes(key)) {
    event.preventDefault();
    navigateHorizontal(1);
  } else if (TV_KEYS.ENTER.includes(key)) {
    event.preventDefault();
    activateFocusedElement();
  } else if (TV_KEYS.BACK.includes(key)) {
    event.preventDefault();
    handleBack();
  } else if (TV_KEYS.PLAY_PAUSE.includes(key)) {
    handlePlayPause();
  }
}

/**
 * Navega verticalmente (cima/baixo)
 */
function navigateVertical(direction: number): void {
  if (focusableElements.length === 0) return;
  
  const currentElement = focusableElements[currentFocusIndex];
  if (!currentElement) {
    setFocus(0);
    return;
  }
  
  const currentRect = currentElement.getBoundingClientRect();
  const currentCenterX = currentRect.left + currentRect.width / 2;
  
  // Encontrar elemento mais proximo na direcao vertical
  let bestIndex = -1;
  let bestDistance = Infinity;
  
  for (let i = 0; i < focusableElements.length; i++) {
    if (i === currentFocusIndex) continue;
    
    const el = focusableElements[i];
    const rect = el.getBoundingClientRect();
    const centerY = rect.top + rect.height / 2;
    const currentCenterY = currentRect.top + currentRect.height / 2;
    
    // Verificar se esta na direcao correta
    if (direction > 0 && centerY <= currentCenterY) continue;
    if (direction < 0 && centerY >= currentCenterY) continue;
    
    // Calcular distancia (priorizar elementos alinhados horizontalmente)
    const horizontalDistance = Math.abs((rect.left + rect.width / 2) - currentCenterX);
    const verticalDistance = Math.abs(centerY - currentCenterY);
    const distance = verticalDistance + horizontalDistance * 0.5;
    
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }
  
  if (bestIndex >= 0) {
    setFocus(bestIndex);
  }
}

/**
 * Navega horizontalmente (esquerda/direita)
 */
function navigateHorizontal(direction: number): void {
  if (focusableElements.length === 0) return;
  
  const currentElement = focusableElements[currentFocusIndex];
  if (!currentElement) {
    setFocus(0);
    return;
  }
  
  const currentRect = currentElement.getBoundingClientRect();
  const currentCenterY = currentRect.top + currentRect.height / 2;
  
  // Encontrar elemento mais proximo na direcao horizontal
  let bestIndex = -1;
  let bestDistance = Infinity;
  
  for (let i = 0; i < focusableElements.length; i++) {
    if (i === currentFocusIndex) continue;
    
    const el = focusableElements[i];
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const currentCenterX = currentRect.left + currentRect.width / 2;
    
    // Verificar se esta na direcao correta
    if (direction > 0 && centerX <= currentCenterX) continue;
    if (direction < 0 && centerX >= currentCenterX) continue;
    
    // Calcular distancia (priorizar elementos alinhados verticalmente)
    const horizontalDistance = Math.abs(centerX - currentCenterX);
    const verticalDistance = Math.abs((rect.top + rect.height / 2) - currentCenterY);
    const distance = horizontalDistance + verticalDistance * 0.5;
    
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = i;
    }
  }
  
  if (bestIndex >= 0) {
    setFocus(bestIndex);
  }
}

/**
 * Define foco em um elemento
 */
function setFocus(index: number): void {
  // Remover foco anterior
  focusableElements.forEach(el => {
    el.classList.remove(FOCUSED_CLASS);
    el.style.outline = '';
    el.style.transform = '';
  });
  
  // Definir novo foco
  currentFocusIndex = index;
  const element = focusableElements[index];
  
  if (element) {
    element.classList.add(FOCUSED_CLASS);
    element.style.outline = '3px solid #E50914';
    element.style.outlineOffset = '2px';
    element.style.transform = 'scale(1.05)';
    element.style.transition = 'transform 0.2s ease, outline 0.2s ease';
    
    // Scroll para elemento visivel
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    });
    
    // Focar elemento para acessibilidade
    element.focus({ preventScroll: true });
  }
}

/**
 * Ativa elemento focado (simula clique)
 */
function activateFocusedElement(): void {
  const element = focusableElements[currentFocusIndex];
  if (element) {
    element.click();
  }
}

/**
 * Handler para botao BACK
 */
function handleBack(): void {
  // Verificar se ha modal aberto
  const modal = document.querySelector('[data-modal="true"]');
  if (modal) {
    const closeButton = modal.querySelector('[data-close="true"]');
    if (closeButton) {
      (closeButton as HTMLElement).click();
      return;
    }
  }
  
  // Verificar se ha player em fullscreen
  const player = document.querySelector('video');
  if (player && document.fullscreenElement) {
    document.exitFullscreen();
    return;
  }
  
  // Voltar na navegacao
  if (window.history.length > 1) {
    window.history.back();
  }
}

/**
 * Handler para Play/Pause
 */
function handlePlayPause(): void {
  const video = document.querySelector('video');
  if (video) {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }
}

/**
 * Foca em um elemento especifico
 */
export function focusElement(element: HTMLElement): void {
  const index = focusableElements.indexOf(element);
  if (index >= 0) {
    setFocus(index);
  } else {
    // Atualizar lista e tentar novamente
    updateFocusableElements();
    const newIndex = focusableElements.indexOf(element);
    if (newIndex >= 0) {
      setFocus(newIndex);
    }
  }
}

/**
 * Obtem elemento atualmente focado
 */
export function getCurrentFocusedElement(): HTMLElement | null {
  return focusableElements[currentFocusIndex] || null;
}

/**
 * CSS para estilos de foco TV
 */
export const TV_FOCUS_STYLES = `
  .tv-focusable {
    transition: transform 0.2s ease, outline 0.2s ease, box-shadow 0.2s ease;
  }
  
  .tv-focusable:focus,
  .tv-focused {
    outline: 3px solid #E50914 !important;
    outline-offset: 2px;
    transform: scale(1.05);
    box-shadow: 0 0 20px rgba(229, 9, 20, 0.5);
    z-index: 10;
  }
  
  .tv-focusable:hover {
    transform: scale(1.02);
  }
  
  /* Esconder cursor em modo TV */
  .tv-mode {
    cursor: none !important;
  }
  
  .tv-mode * {
    cursor: none !important;
  }
`;

/**
 * Injeta estilos de foco TV
 */
export function injectTVStyles(): void {
  const styleId = 'tv-navigation-styles';
  if (document.getElementById(styleId)) return;
  
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = TV_FOCUS_STYLES;
  document.head.appendChild(style);
}

/**
 * Inicializa tudo para TV
 */
export function setupTVMode(): void {
  if (!isAndroidTV()) {
    console.log('📺 Nao e Android TV, pulando setup');
    return;
  }
  
  console.log('📺 Modo TV detectado, configurando...');
  
  // Adicionar classe ao body
  document.body.classList.add('tv-mode');
  
  // Injetar estilos
  injectTVStyles();
  
  // Inicializar navegacao
  initTVNavigation();
  
  // Focar primeiro elemento apos pequeno delay
  setTimeout(() => {
    updateFocusableElements();
    if (focusableElements.length > 0) {
      setFocus(0);
    }
  }, 500);
}

export default {
  isAndroidTV,
  initTVNavigation,
  disableTVNavigation,
  updateFocusableElements,
  focusElement,
  getCurrentFocusedElement,
  setupTVMode,
  injectTVStyles,
  TV_KEYS,
  FOCUSABLE_CLASS,
  FOCUSED_CLASS
};
