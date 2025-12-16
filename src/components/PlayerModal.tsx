/**
 * Player Modal Component
 * Modal component for playing IPTV channel streams with HLS.js support
 */

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';
import { Channel } from '../services/m3uParser';
import { HLS_CONFIG } from '../services/canaisConstants';

interface PlayerModalProps {
  channel: Channel;
  onClose: () => void;
}

export function PlayerModal({ channel, onClose }: PlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Setup HLS.js player
  useEffect(() => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const url = channel.url;

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if HLS is supported
    if (Hls.isSupported()) {
      const hls = new Hls(HLS_CONFIG);

      hlsRef.current = hls;

      hls.loadSource(url);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('📺 HLS manifest parsed, starting playback');
        video.play().catch(err => {
          console.error('Error auto-playing video:', err);
        });
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.log('Network error, attempting to recover');
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.log('Media error, attempting to recover');
              hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, cannot recover');
              hls.destroy();
              break;
          }
        }
      });
    }
    // Check if native HLS support (Safari)
    else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      console.log('📺 Using native HLS support');
      video.src = url;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(err => {
          console.error('Error auto-playing video:', err);
        });
      });
    }
    // Fallback to direct URL
    else {
      console.log('📺 Using direct URL playback');
      video.src = url;
      video.play().catch(err => {
        console.error('Error auto-playing video:', err);
      });
    }

    // Cleanup on unmount
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.url]);

  // Handle overlay click to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  return (
    <div 
      ref={overlayRef}
      className="player-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div 
        className="player-modal-content" 
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          className="close-btn" 
          onClick={onClose}
          aria-label="Fechar player"
        >
          ✕
        </button>
        
        <h2 className="player-title">{channel.name}</h2>
        
        <video
          ref={videoRef}
          controls
          className="player-video"
          poster={channel.logo}
        >
          <p>Seu navegador não suporta reprodução de vídeo.</p>
        </video>
        
        {/* Show channel info */}
        <div className="player-info">
          <p className="channel-group">{channel.group}</p>
        </div>
      </div>
    </div>
  );
}
