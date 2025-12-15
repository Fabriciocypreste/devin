import Hls from 'hls.js';
import { p2pEngine } from '../p2p/P2PEngine';
import { isP2PEnabled } from '../../config/distribution';

interface PreloadedContent {
  url: string;
  hls: Hls | null;
  preloadedSegments: number;
  timestamp: number;
}

interface HLSConfig {
  enableWorker: boolean;
  lowLatencyMode: boolean;
  backBufferLength: number;
  maxBufferLength: number;
  maxMaxBufferLength: number;
  fragLoadingTimeOut: number;
  manifestLoadingTimeOut: number;
  levelLoadingTimeOut: number;
  startLevel: number;
  abrEwmaDefaultEstimate: number;
  abrBandWidthFactor: number;
  abrBandWidthUpFactor: number;
}

class HLSPreloader {
  private preloadedContent: Map<string, PreloadedContent> = new Map();
  private maxPreloaded = 3;
  private preloadSegments = 2;

  public getOptimizedConfig(): HLSConfig {
    return {
      enableWorker: true,
      lowLatencyMode: true,
      backBufferLength: 30,
      maxBufferLength: 20,
      maxMaxBufferLength: 40,
      fragLoadingTimeOut: 15000,
      manifestLoadingTimeOut: 10000,
      levelLoadingTimeOut: 10000,
      startLevel: -1,
      abrEwmaDefaultEstimate: 500000,
      abrBandWidthFactor: 0.95,
      abrBandWidthUpFactor: 0.7
    };
  }

  public createHLSInstance(video: HTMLVideoElement, url: string): Hls {
    const config = this.getOptimizedConfig();
    const hls = new Hls(config);

    if (isP2PEnabled()) {
      hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
        console.log(`[HLS] Loading fragment: ${data.frag.url}`);
      });
    }

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      console.log('[HLS] Manifest parsed, starting playback');
      video.play().catch(err => {
        console.warn('[HLS] Autoplay blocked:', err.message);
      });
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      if (data.fatal) {
        console.error('[HLS] Fatal error:', data);
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log('[HLS] Network error, trying to recover...');
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log('[HLS] Media error, trying to recover...');
            hls.recoverMediaError();
            break;
          default:
            console.error('[HLS] Unrecoverable error');
            hls.destroy();
            break;
        }
      }
    });

    hls.loadSource(url);
    hls.attachMedia(video);

    return hls;
  }

  public async preloadContent(url: string): Promise<void> {
    if (this.preloadedContent.has(url)) {
      return;
    }

    if (this.preloadedContent.size >= this.maxPreloaded) {
      const oldest = Array.from(this.preloadedContent.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      if (oldest) {
        this.destroyPreloaded(oldest[0]);
      }
    }

    console.log(`[Preloader] Preloading: ${url}`);

    const preloaded: PreloadedContent = {
      url,
      hls: null,
      preloadedSegments: 0,
      timestamp: Date.now()
    };

    if (url.includes('.m3u8') && Hls.isSupported()) {
      const config = this.getOptimizedConfig();
      const hls = new Hls({
        ...config,
        autoStartLoad: true,
        startFragPrefetch: true
      });

      hls.on(Hls.Events.FRAG_LOADED, () => {
        preloaded.preloadedSegments++;
        if (preloaded.preloadedSegments >= this.preloadSegments) {
          hls.stopLoad();
        }
      });

      hls.loadSource(url);
      preloaded.hls = hls;
    } else {
      try {
        const response = await fetch(url, { method: 'HEAD' });
        if (response.ok) {
          preloaded.preloadedSegments = 1;
        }
      } catch (error) {
        console.warn('[Preloader] Failed to preload:', error);
      }
    }

    this.preloadedContent.set(url, preloaded);
  }

  public getPreloaded(url: string): Hls | null {
    const preloaded = this.preloadedContent.get(url);
    if (preloaded?.hls) {
      this.preloadedContent.delete(url);
      return preloaded.hls;
    }
    return null;
  }

  public destroyPreloaded(url: string): void {
    const preloaded = this.preloadedContent.get(url);
    if (preloaded?.hls) {
      preloaded.hls.destroy();
    }
    this.preloadedContent.delete(url);
  }

  public destroyAll(): void {
    this.preloadedContent.forEach((preloaded) => {
      if (preloaded.hls) {
        preloaded.hls.destroy();
      }
    });
    this.preloadedContent.clear();
  }
}

export const hlsPreloader = new HLSPreloader();
export default HLSPreloader;
