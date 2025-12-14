import React, { useState } from 'react';
import { cn } from '../../utils/cn'; // Assumindo que criaremos um utilitário cn (clsx + tailwind-merge)

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    imageUrl?: string;
    title?: string;
    subtitle?: string;
    badge?: string;
    aspectRatio?: 'poster' | 'video' | 'square';
    isFocused?: boolean;
    onPress?: () => void;
    showLogo?: boolean; // Mostrar logo RedFlix nas imagens TMDB
}

export function GlassCard({
    imageUrl,
    title,
    subtitle,
    badge,
    aspectRatio = 'poster',
    className,
    isFocused = false,
    onPress,
    showLogo = false,
    children,
    ...props
}: GlassCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const aspectClasses = {
        poster: 'aspect-[2/3]',
        video: 'aspect-video', // 16:9
        square: 'aspect-square',
    };

    return (
        <div
            className={cn(
                'group relative overflow-hidden rounded-lg transition-all duration-300',
                'glass-card hover-scale-premium cursor-pointer',
                isFocused && 'focus-ring focused',
                aspectClasses[aspectRatio],
                className
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onPress}
            role="button"
            tabIndex={0}
            {...props}
        >
                        {/* Background Image */}
                        {imageUrl && (
                            <div className="absolute inset-0">
                                <img
                                    src={imageUrl}
                                    alt={title || 'Card Image'}
                                    className={cn(
                                        'h-full w-full object-cover transition-transform duration-500',
                                        isHovered ? 'scale-110' : 'scale-100'
                                    )}
                                    loading="lazy"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80" />
                    
                                {/* Logo RedFlix para imagens TMDB */}
                                {showLogo && (
                                    <div className="absolute top-2 right-2 z-10">
                                        <img
                                            src="https://chemorena.com/redfliz.png"
                                            alt="RedFlix"
                                            className="w-8 h-8 object-contain opacity-80 drop-shadow-lg"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-100 transition-opacity duration-300">
                {badge && (
                    <div className="absolute top-2 right-2 rounded bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow-lg">
                        {badge}
                    </div>
                )}

                <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
                    {title && (
                        <h3 className="line-clamp-1 text-lg font-bold text-white drop-shadow-md">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="line-clamp-1 text-sm text-gray-300 drop-shadow-sm">
                            {subtitle}
                        </p>
                    )}

                    {/* Action Buttons (Visible on Hover/Focus) */}
                    <div className={cn(
                        "mt-2 flex gap-2 opacity-0 transition-opacity duration-300",
                        (isHovered || isFocused) && "opacity-100"
                    )}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
