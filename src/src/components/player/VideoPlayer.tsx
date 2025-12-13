import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { cn } from '../../utils/cn';
import { isLowEndDevice } from '../../utils/deviceDetection';

interface VideoPlayerProps {
    src: string;
    poster?: string;
    title?: string;
    autoPlay?: boolean;
    onBack?: () => void;
    onEnded?: () => void;
}

export function VideoPlayer({ src, poster, title, autoPlay = true, onBack, onEnded }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(autoPlay);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const controlsTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const isHls = Hls.isSupported() && src.endsWith('.m3u8');
        let hls: Hls | null = null;

        if (isHls) {
            const lowEnd = isLowEndDevice();
            hls = new Hls({
                maxBufferLength: lowEnd ? 10 : 30,
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: lowEnd ? 10 : 30,
            });

            hls.loadSource(src);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (autoPlay) video.play().catch(e => console.warn('Autoplay blocked', e));
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Native HLS (Safari)
            video.src = src;
            if (autoPlay) video.play().catch(e => console.warn('Autoplay blocked', e));
        } else {
            // Standard MP4
            video.src = src;
            if (autoPlay) video.play().catch(e => console.warn('Autoplay blocked', e));
        }

        return () => {
            if (hls) hls.destroy();
        };
    }, [src, autoPlay]);

    // Controls visibility logic
    const handleMouseMove = () => {
        setShowControls(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div
            className="relative h-screen w-screen bg-black overflow-hidden group"
            onMouseMove={handleMouseMove}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') togglePlay();
                if (e.key === 'Escape' || e.key === 'Backspace') onBack?.();
            }}
            tabIndex={0} // Make focusable for keyboard events
            ref={r => r?.focus()} // Auto focus on mount
        >
            <video
                ref={videoRef}
                className="h-full w-full object-contain"
                poster={poster}
                onTimeUpdate={(e) => setProgress((e.currentTarget.currentTime / e.currentTarget.duration) * 100)}
                onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                onEnded={onEnded}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Overlay Controls */}
            <div className={cn(
                "absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60 transition-opacity duration-300 flex flex-col justify-between p-8",
                showControls ? "opacity-100" : "opacity-0"
            )}>
                {/* Top Bar */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={onBack}
                        className="text-white hover:text-red-500 focus:text-red-500 transition-colors p-2 focus-ring"
                    >
                        ← Voltar
                    </button>
                    <h2 className="text-xl font-bold text-white drop-shadow-md">{title}</h2>
                </div>

                {/* Center Play Button (only when paused) */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/50 rounded-full p-6 backdrop-blur-sm">
                            ▶
                        </div>
                    </div>
                )}

                {/* Bottom Bar */}
                <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-red-600 transition-all duration-100"
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <button onClick={togglePlay} className="text-white focus-ring px-2">
                                {isPlaying ? 'Pause' : 'Play'}
                            </button>
                        </div>
                        <div className="text-white text-sm">
                            {/* Time display could go here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
