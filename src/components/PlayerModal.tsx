/**
 * Player Modal Component
 * Modal component for playing IPTV channel streams
 */

import React, { useEffect, useRef } from 'react';
import { Channel } from '../services/m3uParser';

interface PlayerModalProps {
  channel: Channel;
  onClose: () => void;
}

export function PlayerModal({ channel, onClose }: PlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

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

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(err => {
        console.error('Error auto-playing video:', err);
      });
    }
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
          autoPlay
          src={channel.url}
          className="player-video"
          poster={channel.logo}
        >
          <source src={channel.url} type="application/x-mpegURL" />
          <p>Seu navegador não suporta reprodução de vídeo.</p>
        </video>
        
        {/* Show error message if stream fails */}
        <div className="player-info">
          <p className="channel-group">{channel.group}</p>
        </div>
      </div>
    </div>
  );
}
