import { isP2PEnabled, getDistributionConfig } from '../../config/distribution';

interface P2PPeer {
  id: string;
  connection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
}

interface P2PSegment {
  url: string;
  data: ArrayBuffer;
  timestamp: number;
}

type P2PEventType = 'peer-connected' | 'peer-disconnected' | 'segment-received' | 'fallback-cdn' | 'stats-update';

interface P2PStats {
  peersConnected: number;
  bytesFromP2P: number;
  bytesFromCDN: number;
  p2pRatio: number;
}

class P2PEngine {
  private enabled: boolean = false;
  private peers: Map<string, P2PPeer> = new Map();
  private segmentCache: Map<string, P2PSegment> = new Map();
  private stats: P2PStats = {
    peersConnected: 0,
    bytesFromP2P: 0,
    bytesFromCDN: 0,
    p2pRatio: 0
  };
  private eventListeners: Map<P2PEventType, Set<(data: unknown) => void>> = new Map();
  private maxCacheSize = 50;
  private maxCacheAge = 60000;

  constructor() {
    this.enabled = isP2PEnabled();
    if (this.enabled) {
      this.initialize();
    }
  }

  private initialize(): void {
    console.log('[P2P] Initializing P2P Engine...');
    const config = getDistributionConfig();
    console.log(`[P2P] Platform: ${config.platform}, Distribution: ${config.type}`);
    
    this.cleanupOldSegments();
    setInterval(() => this.cleanupOldSegments(), 30000);
  }

  private cleanupOldSegments(): void {
    const now = Date.now();
    for (const [url, segment] of this.segmentCache.entries()) {
      if (now - segment.timestamp > this.maxCacheAge) {
        this.segmentCache.delete(url);
      }
    }
    
    if (this.segmentCache.size > this.maxCacheSize) {
      const entries = Array.from(this.segmentCache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      const toRemove = entries.slice(0, entries.length - this.maxCacheSize);
      toRemove.forEach(([url]) => this.segmentCache.delete(url));
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public async fetchSegment(url: string): Promise<ArrayBuffer> {
    if (!this.enabled) {
      return this.fetchFromCDN(url);
    }

    const cached = this.segmentCache.get(url);
    if (cached) {
      this.stats.bytesFromP2P += cached.data.byteLength;
      this.updateStats();
      return cached.data;
    }

    const p2pData = await this.tryFetchFromPeers(url);
    if (p2pData) {
      this.cacheSegment(url, p2pData);
      this.stats.bytesFromP2P += p2pData.byteLength;
      this.updateStats();
      return p2pData;
    }

    this.emit('fallback-cdn', { url });
    return this.fetchFromCDN(url);
  }

  private async tryFetchFromPeers(url: string): Promise<ArrayBuffer | null> {
    for (const [, peer] of this.peers) {
      if (peer.dataChannel?.readyState === 'open') {
        try {
          const data = await this.requestSegmentFromPeer(peer, url);
          if (data) return data;
        } catch (error) {
          console.warn(`[P2P] Failed to fetch from peer:`, error);
        }
      }
    }
    return null;
  }

  private requestSegmentFromPeer(peer: P2PPeer, url: string): Promise<ArrayBuffer | null> {
    return new Promise((resolve) => {
      if (!peer.dataChannel) {
        resolve(null);
        return;
      }

      const timeout = setTimeout(() => resolve(null), 5000);

      const handler = (event: MessageEvent) => {
        clearTimeout(timeout);
        peer.dataChannel?.removeEventListener('message', handler);
        
        if (event.data instanceof ArrayBuffer) {
          resolve(event.data);
        } else {
          resolve(null);
        }
      };

      peer.dataChannel.addEventListener('message', handler);
      peer.dataChannel.send(JSON.stringify({ type: 'request', url }));
    });
  }

  private async fetchFromCDN(url: string): Promise<ArrayBuffer> {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    
    this.stats.bytesFromCDN += data.byteLength;
    this.updateStats();
    
    if (this.enabled) {
      this.cacheSegment(url, data);
    }
    
    return data;
  }

  private cacheSegment(url: string, data: ArrayBuffer): void {
    this.segmentCache.set(url, {
      url,
      data,
      timestamp: Date.now()
    });
  }

  private updateStats(): void {
    const total = this.stats.bytesFromP2P + this.stats.bytesFromCDN;
    this.stats.p2pRatio = total > 0 ? this.stats.bytesFromP2P / total : 0;
    this.stats.peersConnected = this.peers.size;
    this.emit('stats-update', this.stats);
  }

  public getStats(): P2PStats {
    return { ...this.stats };
  }

  public on(event: P2PEventType, callback: (data: unknown) => void): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event)?.add(callback);
  }

  public off(event: P2PEventType, callback: (data: unknown) => void): void {
    this.eventListeners.get(event)?.delete(callback);
  }

  private emit(event: P2PEventType, data: unknown): void {
    this.eventListeners.get(event)?.forEach(callback => callback(data));
  }

  public destroy(): void {
    this.peers.forEach(peer => {
      peer.dataChannel?.close();
      peer.connection.close();
    });
    this.peers.clear();
    this.segmentCache.clear();
    this.eventListeners.clear();
  }
}

export const p2pEngine = new P2PEngine();
export default P2PEngine;
