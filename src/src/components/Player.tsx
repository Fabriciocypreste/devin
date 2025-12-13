import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Movie } from '../types';

interface PlayerProps {
  movie: Movie;
  onBack: () => void;
}

const Player: React.FC<PlayerProps> = ({ movie, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [areControlsVisible, setAreControlsVisible] = useState(true);
  const [showSettings, setShowSettings] = useState<'speed' | 'quality' | 'audio' | 'subtitles' | null>(null);
  
  // Mock state for audio/subtitles
  const [selectedAudio, setSelectedAudio] = useState('Português');
  const [selectedSubtitle, setSelectedSubtitle] = useState('Português');
  const mockAudioTracks = ['Português', 'English', 'Español'];
  const mockSubtitles = ['Desativado', 'Português', 'English'];

  const formatTime = (timeInSeconds: number) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const parts = [minutes, seconds].map(part => String(part).padStart(2, '0'));
    if (hours > 0) {
      parts.unshift(String(hours));
    }
    return parts.join(':');
  };
  
  const hideControls = useCallback(() => {
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      setAreControlsVisible(false);
      setShowSettings(null);
    }, 3000);
  }, []);
  
  const showControls = useCallback(() => {
     if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    setAreControlsVisible(true);
    if(isPlaying) hideControls();
  }, [hideControls, isPlaying]);


  useEffect(() => {
    if (isPlaying) {
      showControls();
    }
     return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, showControls]);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };
  
  const handleSeek = (delta: number) => {
    if(videoRef.current) {
      videoRef.current.currentTime += delta;
    }
  }
  
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(videoRef.current) {
      const newTime = (Number(e.target.value) / 100) * duration;
      videoRef.current.currentTime = newTime;
    }
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = Number(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if(videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
  }
  
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if(videoRef.current) {
      videoRef.current.muted = newMuted;
      setVolume(newMuted ? 0 : videoRef.current.volume);
    }
  }

  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    }
  }

  const toggleFullscreen = () => {
    const element = document.querySelector('.fixed.inset-0.bg-black');
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if(element) {
      element.requestFullscreen();
    }
  }
  
  const handlePlaybackRateChange = (rate: number) => {
    if(videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSettings(null);
    }
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
      setCurrentTime(video.currentTime);
    };
    const setVideoDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateProgress);
    video.addEventListener('loadedmetadata', setVideoDuration);
    video.addEventListener('play', () => setIsPlaying(true));
    video.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      video.removeEventListener('timeupdate', updateProgress);
      video.removeEventListener('loadedmetadata', setVideoDuration);
      video.removeEventListener('play', () => setIsPlaying(true));
      video.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  // ✅ Obter streamUrl do filme
  const streamUrl = movie.streamUrl || '';

  // ✅ Log para debug
  useEffect(() => {
    console.log('🎬 Player carregado para:', movie.title || movie.name);
    console.log('🎥 Stream URL:', streamUrl);
  }, [movie, streamUrl]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
       <div 
        className="w-full h-full relative group"
        onMouseMove={showControls}
        onMouseLeave={() => isPlaying && hideControls()}
       >
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          src={streamUrl}
          autoPlay
          onClick={handlePlayPause}
        >
          {/* Mock Subtitle Track */}
          <track kind="captions" srcLang="en" label="English" />
        </video>

        <div className={`absolute inset-0 bg-black/30 transition-opacity duration-300 pointer-events-none ${areControlsVisible ? 'opacity-100' : 'opacity-0'}`}>
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between bg-gradient-to-b from-black/70 to-transparent pointer-events-auto">
            <div className="flex items-center">
              <button onClick={onBack} className="text-white hover:text-red-500 transition-colors duration-200 z-10" aria-label="Back">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <h1 className="text-white text-xl ml-4 font-semibold">{movie.title || movie.name}</h1>
            </div>
          </div>
          
          {/* Center Play Button */}
           <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying && (
                     <button onClick={handlePlayPause} className="p-4 bg-black/50 rounded-full text-white pointer-events-auto hover:bg-red-600 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                    </button>
                )}
           </div>


          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent pointer-events-auto">
            {/* Progress Bar */}
            <div className="mb-2">
              <input type="range" min="0" max="100" value={progress || 0} onChange={handleProgressChange} className="w-full h-1 bg-gray-500/50 rounded-lg appearance-none cursor-pointer range-sm accent-red-600" />
            </div>
            <div className="flex justify-between items-center text-white">
              <div className="flex items-center space-x-4">
                 <button onClick={handlePlayPause}>
                  {isPlaying ? 
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg> :
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                  }
                </button>
                <button onClick={() => handleSeek(-10)}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M8.447 1.026a.75.75 0 00-1.06 0l-5.25 5.25a.75.75 0 000 1.06l5.25 5.25a.75.75 0 101.06-1.06L3.78 6.75l4.667-4.667a.75.75 0 000-1.056zM16.197 1.026a.75.75 0 00-1.06 0l-5.25 5.25a.75.75 0 000 1.06l5.25 5.25a.75.75 0 101.06-1.06L11.53 6.75l4.667-4.667a.75.75 0 000-1.056z" /></svg></button>
                <button onClick={() => handleSeek(10)}><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M11.553 1.026a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L16.22 6.75 11.553 2.06a.75.75 0 010-1.033zM3.803 1.026a.75.75 0 011.06 0l5.25 5.25a.75.75 0 010 1.06l-5.25 5.25a.75.75 0 11-1.06-1.06L8.47 6.75 3.803 2.06a.75.75 0 010-1.033z" /></svg></button>
                <div className="flex items-center space-x-2">
                    <button onClick={toggleMute}>
                        {isMuted ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path d="M7 4a1 1 0 011.707-.707l3.707 3.707a1 1 0 010 1.414l-3.707 3.707A1 1 0 017 11V4zm9.37 1.625a.75.75 0 00-1.06-.02l-2.013 1.725A1.375 1.375 0 0012.25 8v4c0 .48.256.913.647 1.17l2.013 1.725a.75.75 0 10.99-1.13l-1.7-1.455a.125.125 0 010-.19l1.7-1.456a.75.75 0 00.07-1.04z" /></svg>}
                    </button>
                    <input type="range" min="0" max="1" step="0.05" value={volume} onChange={handleVolumeChange} className="w-24 h-1 bg-gray-500/50 rounded-lg appearance-none cursor-pointer range-sm accent-white" />
                </div>
                <div className="text-sm font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="flex items-center space-x-4 relative">
                {showSettings && (
                  <div className="absolute bottom-12 right-0 bg-black/80 rounded-md p-2 text-sm w-40">
                    {showSettings === 'speed' && <>
                      <h4 className="font-bold px-1 pb-1 border-b border-gray-600 mb-1">Velocidade</h4>
                      {[0.5, 1, 1.5, 2].map(rate => (
                        <button key={rate} onClick={() => handlePlaybackRateChange(rate)} className={`block w-full text-left p-1 hover:bg-gray-700 rounded ${playbackRate === rate ? 'font-bold text-red-500' : ''}`}>
                            {rate === 1 ? 'Normal' : `${rate}x`}
                        </button>
                      ))}
                    </>}
                     {showSettings === 'audio' && <>
                      <h4 className="font-bold px-1 pb-1 border-b border-gray-600 mb-1">Áudio</h4>
                      {mockAudioTracks.map(track => (
                        <button key={track} onClick={() => { setSelectedAudio(track); setShowSettings(null); }} className={`block w-full text-left p-1 hover:bg-gray-700 rounded ${selectedAudio === track ? 'font-bold text-red-500' : ''}`}>
                            {track}
                        </button>
                      ))}
                    </>}
                     {showSettings === 'subtitles' && <>
                        <h4 className="font-bold px-1 pb-1 border-b border-gray-600 mb-1">Legendas</h4>
                        {mockSubtitles.map(sub => (
                           <button key={sub} onClick={() => { setSelectedSubtitle(sub); setShowSettings(null); }} className={`block w-full text-left p-1 hover:bg-gray-700 rounded ${selectedSubtitle === sub ? 'font-bold text-red-500' : ''}`}>
                              {sub}
                          </button>
                        ))}
                     </>}
                  </div>
                )}
                
                <button onClick={() => setShowSettings(showSettings === 'audio' ? null : 'audio')} title="Áudio"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"></path></svg></button>
                <button onClick={() => setShowSettings(showSettings === 'subtitles' ? null : 'subtitles')} title="Legendas"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm3 1a1 1 0 000 2h8a1 1 0 100-2H6zM6 9a1 1 0 000 2h2a1 1 0 100-2H6zm4 0a1 1 0 100 2h2a1 1 0 100-2h-2z" clipRule="evenodd" /></svg></button>
                <button onClick={() => setShowSettings(showSettings === 'speed' ? null : 'speed')} className="font-semibold text-sm w-8" title="Velocidade">{playbackRate}x</button>
                <button onClick={togglePictureInPicture} title="Picture-in-Picture"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"></path></svg></button>
                <button onClick={toggleFullscreen} title="Tela Cheia"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v3A1.5 1.5 0 004.5 8h3A1.5 1.5 0 009 6.5v-3A1.5 1.5 0 007.5 2h-3zM3 12.5A1.5 1.5 0 014.5 11h3A1.5 1.5 0 019 12.5v3A1.5 1.5 0 017.5 17h-3A1.5 1.5 0 013 15.5v-3zM12.5 2A1.5 1.5 0 0011 3.5v3A1.5 1.5 0 0012.5 8h3A1.5 1.5 0 0017 6.5v-3A1.5 1.5 0 0015.5 2h-3zM11 12.5A1.5 1.5 0 0112.5 11h3A1.5 1.5 0 0117 12.5v3A1.5 1.5 0 0115.5 17h-3A1.5 1.5 0 0111 15.5v-3z" clipRule="evenodd" /></svg></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;