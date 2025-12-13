/**
 * TOAST NATIVO PARA REDFLIX
 * Sistema de notificações toast sem dependências externas
 */

const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const toastEl = document.createElement('div');
  toastEl.className = `fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-all ${
    type === 'success' ? 'bg-green-600' : 
    type === 'error' ? 'bg-red-600' : 
    'bg-blue-600'
  }`;
  toastEl.textContent = message;
  toastEl.style.opacity = '0';
  document.body.appendChild(toastEl);
  
  // Fade in
  requestAnimationFrame(() => {
    toastEl.style.opacity = '1';
  });
  
  // Fade out and remove
  setTimeout(() => {
    toastEl.style.opacity = '0';
    setTimeout(() => toastEl.remove(), 300);
  }, 3000);
};

export const toast = {
  success: (msg: string, _options?: any) => showToast(msg, 'success'),
  error: (msg: string, _options?: any) => showToast(msg, 'error'),
  info: (msg: string, _options?: any) => showToast(msg, 'info'),
};

export default toast;
