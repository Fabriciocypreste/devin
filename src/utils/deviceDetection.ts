export const isTVBox = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return (
        ua.includes('smart-tv') ||
        ua.includes('smarttv') ||
        ua.includes('googletv') ||
        ua.includes('android tv') ||
        ua.includes('appletv') ||
        ua.includes('crkey') || // Chromecast
        ua.includes('roku') ||
        ua.includes('firetv') ||
        ua.includes('station') || // Station TV
        (ua.includes('android') && !ua.includes('mobile')) // Android non-mobile often TV Box
    );
};

export const isMobile = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(ua);
};

export const isLowEndDevice = (): boolean => {
    if (typeof navigator === 'undefined') return false;
    // Check for hardware concurrency (cores)
    const cores = navigator.hardwareConcurrency || 4;
    // Check for device memory (RAM in GB) - experimental API
    const memory = (navigator as any).deviceMemory || 4;

    return cores <= 4 || memory <= 2 || isTVBox();
};

export const getPerformanceConfig = () => {
    const lowEnd = isLowEndDevice();
    return {
        enableBlur: !lowEnd,
        enableShadows: !lowEnd,
        enableAnimations: !lowEnd,
        imageQuality: lowEnd ? 'low' : 'high',
        hlsBufferLength: lowEnd ? 10 : 30,
    };
};
