interface LazyLoadOptions {
  rootMargin?: string;
  threshold?: number | number[];
  onLoad?: (element: Element) => void;
  onError?: (element: Element, error: Error) => void;
}

class LazyLoader {
  private observer: IntersectionObserver | null = null;
  private loadedElements: WeakSet<Element> = new WeakSet();
  private defaultOptions: LazyLoadOptions = {
    rootMargin: '200px 0px',
    threshold: 0.01
  };

  constructor(options?: LazyLoadOptions) {
    if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      this.initObserver({ ...this.defaultOptions, ...options });
    }
  }

  private initObserver(options: LazyLoadOptions): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.loadedElements.has(entry.target)) {
            this.loadElement(entry.target, options);
          }
        });
      },
      {
        rootMargin: options.rootMargin,
        threshold: options.threshold
      }
    );
  }

  private async loadElement(element: Element, options: LazyLoadOptions): Promise<void> {
    this.loadedElements.add(element);

    try {
      if (element instanceof HTMLImageElement) {
        await this.loadImage(element);
      } else if (element instanceof HTMLVideoElement) {
        await this.loadVideo(element);
      } else if (element.hasAttribute('data-component')) {
        await this.loadComponent(element);
      }

      options.onLoad?.(element);
      element.classList.add('lazy-loaded');
      element.classList.remove('lazy-loading');
    } catch (error) {
      options.onError?.(element, error as Error);
      element.classList.add('lazy-error');
    }

    this.observer?.unobserve(element);
  }

  private loadImage(img: HTMLImageElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const src = img.dataset.src;
      const srcset = img.dataset.srcset;

      if (!src && !srcset) {
        resolve();
        return;
      }

      img.classList.add('lazy-loading');

      const onLoad = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        resolve();
      };

      const onError = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onError);
        
        if (img.dataset.fallback) {
          img.src = img.dataset.fallback;
          resolve();
        } else {
          reject(new Error(`Failed to load image: ${src}`));
        }
      };

      img.addEventListener('load', onLoad);
      img.addEventListener('error', onError);

      if (srcset) {
        img.srcset = srcset;
      }
      if (src) {
        img.src = src;
      }
    });
  }

  private loadVideo(video: HTMLVideoElement): Promise<void> {
    return new Promise((resolve, reject) => {
      const src = video.dataset.src;
      const poster = video.dataset.poster;

      if (!src) {
        resolve();
        return;
      }

      video.classList.add('lazy-loading');

      if (poster) {
        video.poster = poster;
      }

      video.addEventListener('loadeddata', () => resolve(), { once: true });
      video.addEventListener('error', () => reject(new Error(`Failed to load video: ${src}`)), { once: true });

      video.src = src;
      video.load();
    });
  }

  private async loadComponent(element: Element): Promise<void> {
    const componentName = element.getAttribute('data-component');
    if (!componentName) return;

    element.classList.add('lazy-loading');
    console.log(`[LazyLoader] Loading component: ${componentName}`);
  }

  public observe(element: Element): void {
    if (this.observer && !this.loadedElements.has(element)) {
      this.observer.observe(element);
    }
  }

  public unobserve(element: Element): void {
    this.observer?.unobserve(element);
  }

  public observeAll(selector: string, container?: Element): void {
    const root = container || document;
    const elements = root.querySelectorAll(selector);
    elements.forEach((el) => this.observe(el));
  }

  public disconnect(): void {
    this.observer?.disconnect();
  }

  public static preloadImage(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to preload: ${src}`));
      img.src = src;
    });
  }

  public static preloadImages(srcs: string[]): Promise<void[]> {
    return Promise.all(srcs.map((src) => LazyLoader.preloadImage(src)));
  }
}

export const lazyLoader = new LazyLoader();
export default LazyLoader;
