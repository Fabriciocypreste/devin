class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private isRegistered = false;

  public async register(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      console.warn('[SW Manager] Service Workers not supported');
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('[SW Manager] Service Worker registered:', this.registration.scope);
      this.isRegistered = true;

      this.registration.addEventListener('updatefound', () => {
        const newWorker = this.registration?.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[SW Manager] New version available');
              this.notifyUpdate();
            }
          });
        }
      });

      return true;
    } catch (error) {
      console.error('[SW Manager] Registration failed:', error);
      return false;
    }
  }

  public async unregister(): Promise<boolean> {
    if (this.registration) {
      const success = await this.registration.unregister();
      if (success) {
        this.isRegistered = false;
        this.registration = null;
        console.log('[SW Manager] Service Worker unregistered');
      }
      return success;
    }
    return false;
  }

  public async update(): Promise<void> {
    if (this.registration) {
      await this.registration.update();
      console.log('[SW Manager] Checking for updates...');
    }
  }

  public skipWaiting(): void {
    if (this.registration?.waiting) {
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  public clearCache(): void {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CLEAR_CACHE' });
      console.log('[SW Manager] Cache cleared');
    }
  }

  public cacheUrls(urls: string[]): void {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'CACHE_URLS', urls });
      console.log('[SW Manager] Caching URLs:', urls.length);
    }
  }

  public prefetchContent(contentUrls: string[]): void {
    const imagesToCache = contentUrls.filter(url => 
      url.includes('/images/') || 
      url.includes('image.tmdb.org') ||
      url.includes('.jpg') ||
      url.includes('.png') ||
      url.includes('.webp')
    );

    if (imagesToCache.length > 0) {
      this.cacheUrls(imagesToCache);
    }
  }

  private notifyUpdate(): void {
    const event = new CustomEvent('sw-update-available');
    window.dispatchEvent(event);
  }

  public getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  public isActive(): boolean {
    return this.isRegistered && !!navigator.serviceWorker.controller;
  }
}

export const swManager = new ServiceWorkerManager();
export default ServiceWorkerManager;
