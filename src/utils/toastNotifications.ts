/**
 * REDFLIX TOAST NOTIFICATIONS
 * Simple toast notification system
 */

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top' | 'bottom';
}

export function showToast(
  message: string, 
  type: ToastType = 'info',
  options: ToastOptions = {}
): void {
  const {
    duration = 3000,
    position = 'bottom'
  } = options;

  // Create toast element
  const toast = document.createElement('div');
  
  // Base styles
  toast.className = `fixed ${position === 'top' ? 'top-24' : 'bottom-8'} left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 rounded-lg shadow-2xl text-white font-semibold transition-all transform backdrop-blur-md border`;
  
  // Type-specific styles
  const typeStyles: Record<ToastType, string> = {
    success: 'bg-green-600/90 border-green-500',
    error: 'bg-red-600/90 border-red-500',
    warning: 'bg-yellow-600/90 border-yellow-500',
    info: 'bg-blue-600/90 border-blue-500'
  };
  
  toast.className += ` ${typeStyles[type]}`;
  
  // Add icon based on type
  const icons: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };
  
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-xl">${icons[type]}</span>
      <span>${message}</span>
    </div>
  `;
  
  // Initial state (hidden)
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(-50%) translateY(20px)';
  
  document.body.appendChild(toast);
  
  // Animate in
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  
  // Auto dismiss
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
}

// Convenience methods
export const toast = {
  success: (message: string, options?: ToastOptions) => showToast(message, 'success', options),
  error: (message: string, options?: ToastOptions) => showToast(message, 'error', options),
  warning: (message: string, options?: ToastOptions) => showToast(message, 'warning', options),
  info: (message: string, options?: ToastOptions) => showToast(message, 'info', options),
};
