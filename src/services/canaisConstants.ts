/**
 * Constants for Canais IPTV System
 */

// Placeholder image for broken logos
export const LOGO_PLACEHOLDER_SVG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="112" viewBox="0 0 200 112"%3E%3Crect fill="%231a1f3a" width="200" height="112"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2300d9ff" font-size="48" font-family="Arial, sans-serif"%3E📺%3C/text%3E%3C/svg%3E';

// HLS.js Player Configuration
export const HLS_CONFIG = {
  enableWorker: true,
  lowLatencyMode: true,
  backBufferLength: 90, // seconds
} as const;
