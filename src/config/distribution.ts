export type DistributionType = 'STORE' | 'DIRECT';

interface DistributionConfig {
  type: DistributionType;
  p2pEnabled: boolean;
  platform: 'web' | 'electron' | 'android' | 'android-tv' | 'ios' | 'tizen' | 'webos' | 'firetv';
}

const detectPlatform = (): DistributionConfig['platform'] => {
  if (typeof window === 'undefined') return 'web';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (window.electron) return 'electron';
  if (userAgent.includes('tizen')) return 'tizen';
  if (userAgent.includes('webos')) return 'webos';
  if (userAgent.includes('firetv') || userAgent.includes('amazon')) return 'firetv';
  if (userAgent.includes('android tv') || userAgent.includes('androidtv')) return 'android-tv';
  if (userAgent.includes('android')) return 'android';
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  
  return 'web';
};

const STORE_PLATFORMS: DistributionConfig['platform'][] = [
  'web',
  'android',
  'ios',
  'tizen',
  'webos',
  'firetv'
];

const DIRECT_PLATFORMS: DistributionConfig['platform'][] = [
  'electron',
  'android-tv'
];

export const getDistributionConfig = (): DistributionConfig => {
  const platform = detectPlatform();
  const envP2P = import.meta.env.VITE_P2P_ENABLED === 'true';
  const envDistribution = import.meta.env.VITE_DISTRIBUTION_TYPE as DistributionType | undefined;
  
  if (envDistribution) {
    return {
      type: envDistribution,
      p2pEnabled: envDistribution === 'DIRECT' && envP2P,
      platform
    };
  }
  
  const isDirectPlatform = DIRECT_PLATFORMS.includes(platform);
  
  return {
    type: isDirectPlatform ? 'DIRECT' : 'STORE',
    p2pEnabled: isDirectPlatform && envP2P,
    platform
  };
};

export const isP2PEnabled = (): boolean => {
  const config = getDistributionConfig();
  return config.p2pEnabled;
};

export const isStoreBuild = (): boolean => {
  const config = getDistributionConfig();
  return config.type === 'STORE';
};

export const isDirectBuild = (): boolean => {
  const config = getDistributionConfig();
  return config.type === 'DIRECT';
};
